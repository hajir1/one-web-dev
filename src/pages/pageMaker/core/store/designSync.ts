import i18n from "../../../../i18n";
import { notify } from "../../../../components/app/Toaster";
import { api, ApiError } from "../../../../api/client";
import { onUserChange, useSession, type SessionUser } from "../../../../auth/session";
import { patchLimits, type AccountLimits } from "../../../../marketplace/account";
import { useDesignStore, type SavedDesign } from "./designStore";

/* ================================================================== */
/* Page Maker design sync ↔ server (GET/POST /designs)                  */
/*                                                                    */
/* - On sign-in: the account's designs are fetched from the server; designs created */
/*   before signing in (owner = null) are uploaded to that account. Designs belonging to */
/*   ANOTHER account in the same browser are never uploaded.            */
/* - Every change is sent (debounced) as an upsert/delete. Conflicts    */
/*   across devices: the newest wins (updatedAt).                       */
/* - Design & website quotas are enforced by the SERVER; rejected designs */
/*   stay on this device and the user is notified.                      */
/* - On sign-out: the local copy is cleared (data stays on the server). */
/* ================================================================== */

type Designs = Record<string, SavedDesign[]>;
type Key = string; // `${type}\u0000${id}`

const DEBOUNCE_MS = 1500;
/** Rough size limit of one sync request (server body 25 MB). */
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
  /** Premium items used but not owned yet (v4). */
  locked?: string[];
}

const key = (type: string, id: string): Key => `${type}\u0000${id}`;
const valid = (type: string, id: string) => /^[\w-]{1,40}$/.test(type) && /^[\w-]{1,80}$/.test(id);

/** The snapshot last known to match the server: key → updatedAt. */
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

/** Merges the server list into the local copy (the newest wins). */
function mergeServer(local: Designs, rows: ServerDesign[]): Designs {
  const next: Designs = Object.fromEntries(Object.entries(local).map(([t, l]) => [t, [...(l ?? [])]]));
  for (const r of rows) {
    const list = (next[r.type] ??= []);
    const i = list.findIndex((d) => d.id === r.id);
    const cur = i >= 0 ? list[i] : null;
    if (cur && cur.updatedAt > r.updatedAt) continue; // local is newer → will be uploaded
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

/** Fetches changes from the server (full on sign-in, incremental afterwards). */
async function pullDesigns(full = false): Promise<void> {
  if (!active) return;
  const since = full ? 0 : serverTime;
  const r = await api<{ designs: ServerDesign[]; serverTime: number; quota?: unknown }>(`/designs?since=${since}`);
  if (!active) return;
  quota(r.quota);
  // A 5-second safety margin for slightly different clocks.
  serverTime = Math.max(0, r.serverTime - 5000);
  const { designs } = useDesignStore.getState();
  apply(mergeServer(designs, r.designs ?? []), active);
}

/** Sends local changes that are not on the server yet. */
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

  // Split by size so one request is not too large.
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
        synced.delete(k); // deletion accepted
        continue;
      }
      if (res.status === "ok") {
        synced.set(k, u.updatedAt);
        // The design uses Premium items not owned yet: it is still saved, but exports will be rejected by the server.
        const locked = (res.locked ?? []).join(",");
        if (locked && lockedSeen.get(k) !== locked) notify.warn(i18n.t("sync.locked", { name: u.name, items: (res.locked ?? []).slice(0, 3).join(", ") }));
        if (locked) lockedSeen.set(k, locked);
        else lockedSeen.delete(k);
      }
      else if (res.status === "stale") synced.delete(k); // the server is newer → fetched on pull
      else rejected.push({ name: u.name, code: res.code ?? res.status });
    }
    for (const d of b.deletes) synced.delete(key(d.type, d.id));
  }
  const msgKey = (code: string) =>
    code === "DESIGN_TOO_LARGE" || code === "too_large" ? "sync.tooLarge" : code === "DESIGN_STORAGE_FULL" ? "sync.storageFull" : "sync.limit";
  for (const x of rejected.slice(0, 3)) notify.warn(i18n.t(msgKey(x.code), { name: x.name }));
  // Rejected designs stay on this device; retried on the next change.
}

/**
 * Sends every local change NOW and waits for it to finish (used before
 * server exports, because the server builds code from the stored design).
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

/** Last locked Premium item keys per design (the warning only shows when they change). */
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
  // A local copy belonging to another account → drop it (never upload it to this account).
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
  // The account's designs stay on the server; the local copy is cleared.
  apply({}, null);
}

let installed = false;
/** Installs once (called from the app bootstrap). */
export function installDesignSync() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  useDesignStore.subscribe((s, prev) => {
    if (s.designs !== prev.designs) schedule();
  });
  onUserChange((u) => {
    // Only when the account changes (other profile changes, e.g. admin mode, do not trigger a re-pull).
    if (u) {
      if (u.id !== active) void start(u);
    }
    else if (active) stop();
  });
  const u = useSession.getState().user;
  if (u) void start(u);
  // Session ended (not just an unreachable server) → the account's copies are cleared.
  useSession.subscribe((s, prev) => {
    if (s.status === "anonymous" && prev.status !== "anonymous" && useDesignStore.getState().owner) stop();
  });
  window.addEventListener("focus", () => active && void cycle(true));
  window.addEventListener("beforeunload", () => {
    if (timer) void cycle(false);
  });
}
