import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VR_LIMITS, vrCap, createTour, mediaIdsOf, sanitizeTour, type MediaMeta, type Tour } from "./model";

/* ================================================================== */
/* Penyimpanan tur 360° di browser ini                                  */
/*                                                                    */
/* Struktur tur (kecil) → localStorage lewat zustand persist.            */
/* Foto & audio (besar) → IndexedDB "onewebdev-vr" store "media".       */
/* Belum ada sinkronisasi ke server (frontend saja).                    */
/* ================================================================== */

interface TourState {
  tours: Tour[];
  media: Record<string, MediaMeta>;
  add: (name: string) => Tour | null;
  save: (tour: Tour) => void;
  remove: (id: string) => void;
  addMediaMeta: (m: MediaMeta) => void;
  dropMediaMeta: (ids: string[]) => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      tours: [],
      media: {},
      add: (name) => {
        if (get().tours.length >= vrCap(VR_LIMITS.maxTours)) return null;
        const tour = createTour(name);
        set((s) => ({ tours: [tour, ...s.tours] }));
        return tour;
      },
      save: (tour) => set((s) => ({ tours: s.tours.map((t) => (t.id === tour.id ? { ...tour, updatedAt: Date.now() } : t)) })),
      remove: (id) => set((s) => ({ tours: s.tours.filter((t) => t.id !== id) })),
      addMediaMeta: (m) => set((s) => ({ media: { ...s.media, [m.id]: m } })),
      dropMediaMeta: (ids) =>
        set((s) => {
          const media = { ...s.media };
          for (const id of ids) delete media[id];
          return { media };
        }),
    }),
    {
      name: "onewebdev-vr-tours-v1",
      version: 1,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<TourState>;
        const tours = Array.isArray(p.tours) ? p.tours.map(sanitizeTour).filter((t): t is Tour => !!t).slice(0, vrCap(VR_LIMITS.maxTours)) : [];
        const media = p.media && typeof p.media === "object" ? p.media : {};
        return { ...current, tours, media };
      },
    },
  ),
);

/** Media yang tidak dipakai tur mana pun (aman dihapus). */
export function orphanMedia(tours: Tour[], media: Record<string, MediaMeta>): string[] {
  const used = new Set(tours.flatMap(mediaIdsOf));
  return Object.keys(media).filter((id) => !used.has(id));
}

/* ------------------------------------------------------------------ */
/* IndexedDB                                                            */
/* ------------------------------------------------------------------ */

const DB = "onewebdev-vr";
const STORE = "media";
let dbp: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB tidak tersedia di browser ini."));
  dbp ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbp = null;
      reject(req.error ?? new Error("IndexedDB gagal dibuka."));
    };
  });
  return dbp;
}

function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return db().then(
    (d) =>
      new Promise<T>((resolve, reject) => {
        const req = run(d.transaction(STORE, mode).objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("IndexedDB gagal."));
      }),
  );
}

export const putMedia = (id: string, blob: Blob) => tx("readwrite", (s) => s.put(blob, id)).then(() => undefined);
const getMedia = (id: string) => tx<Blob | undefined>("readonly", (s) => s.get(id) as IDBRequest<Blob | undefined>);
export const deleteMedia = (id: string) => tx("readwrite", (s) => s.delete(id)).then(() => undefined);

/** Ambil banyak media sekaligus (yang hilang dilewati). */
export async function getMediaMap(ids: string[]): Promise<Record<string, Blob>> {
  const out: Record<string, Blob> = {};
  await Promise.all(
    ids.map(async (id) => {
      const b = await getMedia(id).catch(() => undefined);
      if (b) out[id] = b;
    }),
  );
  return out;
}
