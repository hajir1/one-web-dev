import { create } from "zustand";
import { isDemoMode } from "../demo/demoMode";
import { onUserChange, useSession } from "../auth/session";
import { localBackend } from "./localBackend";
import { serverBackend } from "./serverBackend";
import { AssetError, prepareImage } from "./prepareImage";
import { ASSET_LIMITS, type AssetBackend, type AssetMeta } from "./types";

/* ================================================================== */
/* Pustaka Aset (v21): satu daftar gambar per akun (atau per browser di  */
/* mode demo), dipakai bersama semua website & template kode. Gambar    */
/* yang sama (logo, foto) bisa dipakai ulang tanpa diunggah dua kali.   */
/* ================================================================== */

/** Server bila backend aktif DAN pengguna sudah masuk; selain itu IndexedDB. */
export function currentBackend(): AssetBackend {
  return !isDemoMode() && useSession.getState().user ? serverBackend : localBackend;
}

export interface UploadResult {
  added: AssetMeta[];
  failed: { name: string; code: AssetError["code"] }[];
}

interface AssetState {
  assets: AssetMeta[];
  loaded: boolean;
  loading: boolean;
  error: boolean;
  /** Naik tiap kali isi berubah (pratinjau menerjemahkan ulang). */
  version: number;
  load: (force?: boolean) => Promise<void>;
  upload: (files: File[], onProgress?: (done: number, total: number) => void) => Promise<UploadResult>;
  rename: (id: string, name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const blobCache = new Map<string, Promise<Blob | null>>();
const dataCache = new Map<string, Promise<string | null>>();
let loadingP: Promise<void> | null = null;

export const useAssets = create<AssetState>((set, get) => ({
  assets: [],
  loaded: false,
  loading: false,
  error: false,
  version: 0,
  load: (force = false) => {
    if (get().loaded && !force) return Promise.resolve();
    if (loadingP) return loadingP;
    set({ loading: true, error: false });
    loadingP = currentBackend()
      .list()
      .then(
        (assets) => set((s) => ({ assets, loaded: true, loading: false, version: s.version + 1 })),
        () => set({ loading: false, error: true, loaded: true }),
      )
      .finally(() => (loadingP = null));
    return loadingP;
  },
  upload: async (files, onProgress) => {
    await get().load();
    const added: AssetMeta[] = [];
    const failed: UploadResult["failed"] = [];
    const be = currentBackend();
    let i = 0;
    for (const f of files) {
      try {
        if (get().assets.length + added.length >= ASSET_LIMITS.maxCount) throw new AssetError("quota");
        const meta = await be.add(await prepareImage(f));
        added.push(meta);
      } catch (e) {
        failed.push({ name: f.name, code: e instanceof AssetError ? e.code : "network" });
      }
      onProgress?.(++i, files.length);
    }
    if (added.length) set((s) => ({ assets: [...[...added].reverse(), ...s.assets], version: s.version + 1 }));
    return { added, failed };
  },
  rename: async (id, name) => {
    const n = name.trim().slice(0, 120);
    if (!n) return;
    await currentBackend().rename(id, n);
    set((s) => ({ assets: s.assets.map((a) => (a.id === id ? { ...a, name: n } : a)) }));
  },
  remove: async (id) => {
    await currentBackend().remove(id);
    blobCache.delete(id);
    dataCache.delete(id);
    set((s) => ({ assets: s.assets.filter((a) => a.id !== id), version: s.version + 1 }));
  },
}));

/** Ganti akun / masuk / keluar → daftar & cache dimuat ulang dari tempat yang benar. */
onUserChange(() => {
  blobCache.clear();
  dataCache.clear();
  useAssets.setState((s) => ({ assets: [], loaded: false, version: s.version + 1 }));
});

export const assetMeta = (id: string) => useAssets.getState().assets.find((a) => a.id === id) ?? null;

export function assetBlob(id: string): Promise<Blob | null> {
  let p = blobCache.get(id);
  if (!p) {
    const be = currentBackend();
    p = be
      .blob(id)
      .catch(() => null)
      // Gambar yang diunggah sebelum masuk akun masih ada di browser ini → tetap tampil & ikut diekspor.
      .then((b) => b ?? (be.kind === "server" ? localBackend.blob(id).catch(() => null) : null));
    blobCache.set(id, p);
    void p.then((b) => b || blobCache.delete(id));
  }
  return p;
}

const readDataUrl = (b: Blob) =>
  new Promise<string | null>((res) => {
    const r = new FileReader();
    r.onload = () => res(typeof r.result === "string" ? r.result : null);
    r.onerror = () => res(null);
    r.readAsDataURL(b);
  });

/** data URL aset (untuk pratinjau di iframe sandbox, yang tidak bisa membuka blob: milik aplikasi). */
export function assetDataUrl(id: string): Promise<string | null> {
  let p = dataCache.get(id);
  if (!p) {
    p = assetBlob(id).then((b) => (b ? readDataUrl(b) : null));
    dataCache.set(id, p);
    void p.then((d) => d || dataCache.delete(id));
  }
  return p;
}
