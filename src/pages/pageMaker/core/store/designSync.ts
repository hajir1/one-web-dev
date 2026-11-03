import i18n from "../../../../i18n";
import { notify } from "../../../../components/app/Toaster";
import { api, ApiError } from "../../../../api/client";
import { onUserChange, useSession, type SessionUser } from "../../../../auth/session";
import { patchLimits, type AccountLimits } from "../../../../marketplace/account";
import { useDesignStore, type SavedDesign } from "./designStore";

/* ================================================================== */
/* Sinkronisasi desain Page Maker ↔ server (GET/POST /designs)          */
/*                                                                    */
/* - Saat login: desain akun diambil dari server; desain yang dibuat     */
/*   sebelum login (owner = null) diunggah ke akun itu. Desain milik      */
/*   akun LAIN di browser yang sama tidak pernah ikut terunggah.         */
/* - Setiap perubahan dikirim (debounce) sebagai upsert/delete. Konflik  */
/*   antar-perangkat: yang terbaru menang (updatedAt).                  */
/* - Kuota desain & website ditegakkan SERVER; desain yang ditolak       */
/*   tetap ada di perangkat ini dan pengguna diberi tahu.                */
/* - Saat keluar: salinan lokal dikosongkan (data tetap ada di server).  */
/* ================================================================== */

type Designs = Record<string, SavedDesign[]>;
type Key = string; // `${type}\u0000${id}`

const DEBOUNCE_MS = 1500;
/** Batas kasar ukuran satu permintaan sinkron (body server 25 MB). */
const MAX_BATCH_BYTES = 6 * 1024 * 1024;

interface ServerDesign {
  type: string;
  id: string;
  name: string;
  state: unknown;
  updatedAt: number;
  deleted: boolean;
}

interface SyncResult {
  type: string;
  id: string;
  status: "ok" | "stale" | "limit" | "too_large";
  code?: string;
  /** Item Premium yang dipakai tetapi belum dimiliki (v4). */
  locked?: string[];
}

const key = (type: string, id: string): Key => `${type}\u0000${id}`;
const valid = (type: string, id: string) => /^[\w-]{1,40}$/.test(type) && /^[\w-]{1,80}$/.test(id);

/** Snapshot yang terakhir diketahui sama dengan server: key → updatedAt. */
let synced = new Map<Key, number>();
let active: string | null = null;
let applying = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let running: Promise<void> | null = null;
let serverTime = 0;

function flat(designs: Designs): Map<Key, { type: string; d: SavedDesign }> {
  const out = new Map<Key, { type: string; d: SavedDesign }>();
  for (const [type, list] of Object.entries(designs)) for (const d of list ?? []) if (valid(type, d.id)) out.set(key(type, d.id), { type, d });
  return out;
}

function apply(next: Designs, owner: string | null) {
  applying = true;
  try {
    useDesignStore.getState().replaceAll(next, owner);
  } finally {
    applying = false;
  }
}

/** Gabungkan daftar server ke salinan lokal (yang terbaru menang). */
function mergeServer(local: Designs, rows: ServerDesign[]): Designs {
  const next: Designs = Object.fromEntries(Object.entries(local).map(([t, l]) => [t, [...(l ?? [])]]));
  for (const r of rows) {
    const list = (next[r.type] ??= []);
    const i = list.findIndex((d) => d.id === r.id);
    const cur = i >= 0 ? list[i] : null;
    if (cur && cur.updatedAt > r.updatedAt) continue; // lokal lebih baru → akan diunggah
    if (r.deleted) {
      if (i >= 0) list.splice(i, 1);
    } else {
      const d: SavedDesign = { id: r.id, name: r.name, state: r.state, updatedAt: r.updatedAt };
      if (i >= 0) list[i] = d;
      else list.unshift(d);
    }
    synced.set(key(r.type, r.id), r.updatedAt);
  }
  for (const t of Object.keys(next)) next[t].sort((a, b) => b.updatedAt - a.updatedAt);
  return next;
}

function quota(raw: unknown) {
  if (raw && typeof raw === "object") patchLimits(raw as Partial<AccountLimits>);
}

/** Ambil perubahan dari server (penuh saat login, inkremental setelahnya). */
async function pullDesigns(full = false): Promise<void> {
  if (!active) return;
  const since = full ? 0 : serverTime;
  const r = await api<{ designs: ServerDesign[]; serverTime: number; quota?: unknown }>(`/designs?since=${since}`);
  if (!active) return;
  quota(r.quota);
  // Jarak aman 5 detik untuk jam yang sedikit berbeda.
  serverTime = Math.max(0, r.serverTime - 5000);
  const { designs } = useDesignStore.getState();
  apply(mergeServer(designs, r.designs ?? []), active);
}

/** Kirim perubahan lokal yang belum ada di server. */
async function pushDesigns(): Promise<void> {
  if (!active) return;
  const now = flat(useDesignStore.getState().designs);
  const upserts: { type: string; id: string; name: string; state: unknown; updatedAt: number }[] = [];
  for (const [k, { type, d }] of now) if (synced.get(k) !== d.updatedAt) upserts.push({ type, id: d.id, name: d.name.slice(0, 200), state: d.state ?? null, updatedAt: Math.max(0, Math.floor(d.updatedAt)) });
  const deletes: { type: string; id: string; deletedAt: number }[] = [];
  for (const k of synced.keys()) if (!now.has(k)) {
    const [type, id] = k.split("\u0000");
    deletes.push({ type, id, deletedAt: Date.now() });
  }
  if (!upserts.length && !deletes.length) return;

  // Pecah per ukuran agar satu permintaan tidak terlalu besar.
  const batches: { upserts: typeof upserts; deletes: typeof deletes }[] = [];
  let cur = { upserts: [] as typeof upserts, deletes, bytes: 0 };
  for (const u of upserts) {
    const size = JSON.stringify(u.state).length;
    if (cur.upserts.length && (cur.bytes + size > MAX_BATCH_BYTES || cur.upserts.length >= 50)) {
      batches.push(cur);
      cur = { upserts: [], deletes: [], bytes: 0 };
    }
    cur.upserts.push(u);
    cur.bytes += size;
  }
  batches.push(cur);

  const rejected: { name: string; code: string }[] = [];
  for (const b of batches) {
    const r = await api<{ results: SyncResult[]; quota?: unknown }>("/designs/sync", { body: { upserts: b.upserts, deletes: b.deletes } });
    quota(r.quota);
    for (const res of r.results ?? []) {
      const k = key(res.type, res.id);
      const u = b.upserts.find((x) => x.type === res.type && x.id === res.id);
      if (!u) {
        synced.delete(k); // hapus diterima
        continue;
      }
      if (res.status === "ok") {
        synced.set(k, u.updatedAt);
        // Desain memakai item Premium yang belum dimiliki: tetap tersimpan, tetapi ekspor akan ditolak server.
        const locked = (res.locked ?? []).join(",");
        if (locked && lockedSeen.get(k) !== locked) notify.warn(i18n.t("sync.locked", { name: u.name, items: (res.locked ?? []).slice(0, 3).join(", ") }));
        if (locked) lockedSeen.set(k, locked);
        else lockedSeen.delete(k);
      }
      else if (res.status === "stale") synced.delete(k); // server lebih baru → diambil saat pull
      else rejected.push({ name: u.name, code: res.code ?? res.status });
    }
    for (const d of b.deletes) synced.delete(key(d.type, d.id));
  }
  const msgKey = (code: string) =>
    code === "DESIGN_TOO_LARGE" || code === "too_large" ? "sync.tooLarge" : code === "DESIGN_STORAGE_FULL" ? "sync.storageFull" : "sync.limit";
  for (const x of rejected.slice(0, 3)) notify.warn(i18n.t(msgKey(x.code), { name: x.name }));
  // Desain yang ditolak tetap ada di perangkat ini; dicoba lagi pada perubahan berikutnya.
}

/**
 * Kirim semua perubahan lokal SEKARANG dan tunggu selesai (dipakai sebelum
 * ekspor server, karena server membuat kode dari desain yang tersimpan).
 */
export async function flushDesigns(): Promise<void> {
  if (!active) return;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (running) await running;
  await pushDesigns();
}

/** Kunci item Premium terkunci terakhir per desain (peringatan hanya saat berubah). */
const lockedSeen = new Map<string, string>();

async function cycle(pull: boolean) {
  if (running) return running;
  running = (async () => {
    try {
      await pushDesigns();
      if (pull) await pullDesigns();
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 401)) console.warn("[Sinkron desain] gagal:", e);
    } finally {
      running = null;
    }
  })();
  return running;
}

function schedule() {
  if (!active || applying) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void cycle(false);
  }, DEBOUNCE_MS);
}

async function start(user: SessionUser) {
  const store = useDesignStore.getState();
  // Salinan lokal milik akun lain → buang (jangan pernah diunggah ke akun ini).
  if (store.owner && store.owner !== user.id) apply({}, user.id);
  const claimAnonymous = !useDesignStore.getState().owner;
  active = user.id;
  synced = new Map();
  serverTime = 0;
  try {
    await pullDesigns(true);
    if (claimAnonymous) notifyClaim();
    await pushDesigns();
  } catch (e) {
    console.warn("[Sinkron desain] gagal memuat:", e);
  }
}

function notifyClaim() {
  const n = [...flat(useDesignStore.getState().designs).keys()].filter((k) => !synced.has(k)).length;
  if (n) notify.info(i18n.t("sync.claimed", { count: n }));
}

function stop() {
  active = null;
  synced = new Map();
  if (timer) clearTimeout(timer);
  timer = null;
  // Desain milik akun tetap di server; salinan lokal dikosongkan.
  apply({}, null);
}

let installed = false;
/** Pasang sekali (dipanggil dari bootstrap aplikasi). */
export function installDesignSync() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  useDesignStore.subscribe((s, prev) => {
    if (s.designs !== prev.designs) schedule();
  });
  onUserChange((u) => {
    // Hanya saat akun berganti (perubahan profil lain, mis. mode admin, tidak memicu tarik ulang).
    if (u) {
      if (u.id !== active) void start(u);
    }
    else if (active) stop();
  });
  const u = useSession.getState().user;
  if (u) void start(u);
  // Sesi berakhir (bukan sekadar server tak terjangkau) → salinan milik akun dikosongkan.
  useSession.subscribe((s, prev) => {
    if (s.status === "anonymous" && prev.status !== "anonymous" && useDesignStore.getState().owner) stop();
  });
  window.addEventListener("focus", () => active && void cycle(true));
  window.addEventListener("beforeunload", () => {
    if (timer) void cycle(false);
  });
}
