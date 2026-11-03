import type { AssetBackend, AssetMeta, PreparedImage } from "./types";

/* Mode demo & sebelum masuk: aset disimpan di IndexedDB browser ini      */
/* (kapasitas ratusan MB, tidak seperti localStorage yang hanya ±5 MB).  */
/* Desain hanya menyimpan `aset:<id>`.                                   */

const DB = "owd-assets";
const META = "meta";
const BLOB = "blob";

let dbp: Promise<IDBDatabase> | null = null;
function db(): Promise<IDBDatabase> {
  if (!dbp)
    dbp = new Promise((res, rej) => {
      if (typeof indexedDB === "undefined") return rej(new Error("IndexedDB tidak tersedia"));
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => {
        r.result.createObjectStore(META, { keyPath: "id" });
        r.result.createObjectStore(BLOB);
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  dbp.catch(() => (dbp = null));
  return dbp;
}

function tx<T>(stores: string[], mode: IDBTransactionMode, run: (t: IDBTransaction) => IDBRequest<T> | void): Promise<T | undefined> {
  return db().then(
    (d) =>
      new Promise<T | undefined>((res, rej) => {
        const t = d.transaction(stores, mode);
        const req = run(t);
        t.oncomplete = () => res(req ? req.result : undefined);
        t.onerror = () => rej(t.error);
        t.onabort = () => rej(t.error);
      }),
  );
}

const newId = () => {
  const a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
};

export const localBackend: AssetBackend = {
  kind: "local",
  async list() {
    const all = (await tx<AssetMeta[]>([META], "readonly", (t) => t.objectStore(META).getAll())) ?? [];
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
  async add(img: PreparedImage) {
    const meta: AssetMeta = { id: newId(), name: img.name, mime: img.mime, bytes: img.blob.size, width: img.width, height: img.height, createdAt: Date.now() };
    await tx([META, BLOB], "readwrite", (t) => {
      t.objectStore(META).put(meta);
      t.objectStore(BLOB).put(img.blob, meta.id);
    });
    return meta;
  },
  async rename(id, name) {
    await tx([META], "readwrite", (t) => {
      const s = t.objectStore(META);
      const g = s.get(id);
      g.onsuccess = () => g.result && s.put({ ...g.result, name });
    });
  },
  async remove(id) {
    await tx([META, BLOB], "readwrite", (t) => {
      t.objectStore(META).delete(id);
      t.objectStore(BLOB).delete(id);
    });
  },
  async blob(id) {
    return ((await tx<Blob>([BLOB], "readonly", (t) => t.objectStore(BLOB).get(id))) as Blob | undefined) ?? null;
  },
};
