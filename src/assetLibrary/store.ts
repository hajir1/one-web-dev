import { create } from "zustand";
import { isDemoMode } from "../demo/demoMode";
import { onUserChange, useSession } from "../auth/session";
import { localBackend } from "./localBackend";
import { serverBackend } from "./serverBackend";
import { AssetError, prepareImage } from "./prepareImage";
import { ASSET_LIMITS, type AssetBackend, type AssetMeta } from "./types";

/* ================================================================== */
/* Asset Library (v21): one image list per account (or per browser in    */
/* demo mode), shared by every website & code template. The same image  */
/* (logo, photo) can be reused without uploading it twice.              */
/* ================================================================== */

/** Server when the backend is active AND the user is signed in; otherwise IndexedDB. */
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
  /** Increments whenever the content changes (previews resolve again). */
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

/** Switch account / sign in / sign out → list & cache reload from the right place. */
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
      // Images uploaded before signing in are still in this browser → keep showing & exporting them.
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

/** Asset data URL (for previews in a sandboxed iframe, which cannot open the app's blob: URLs). */
export function assetDataUrl(id: string): Promise<string | null> {
  let p = dataCache.get(id);
  if (!p) {
    p = assetBlob(id).then((b) => (b ? readDataUrl(b) : null));
    dataCache.set(id, p);
    void p.then((d) => d || dataCache.delete(id));
  }
  return p;
}
