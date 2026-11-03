import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeId } from "../helpers/makeId";
import { varNamesIn, type CssVar } from "../helpers/cssVars";
import { currentGlobalVars } from "../hooks/useGlobalVars";

/**
 * v7: desain halaman menyimpan salinan variabel global yang dirujuknya di
 * `root.vars`, jadi desain tetap tampil benar di perangkat lain / ekspor
 * server walau variabelnya belum ada di sana. Nilai global tetap menang.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withVarSnapshot(state: any): any {
  if (!state || typeof state !== "object" || !state.root || typeof state.root !== "object") return state;
  const { vars: _old, ...root } = state.root as { vars?: CssVar[] };
  const used = new Set(varNamesIn(JSON.stringify(root)));
  if (!used.size) return _old ? { ...state, root } : state;
  const all = currentGlobalVars();
  const snap = all.filter((v) => used.has(v.name)).map(({ id, name, type, value }) => ({ id, name, type, value }));
  // Variabel yang sudah tidak ada di perangkat ini: pertahankan salinan lama.
  for (const v of _old ?? []) if (used.has(v.name) && !snap.some((x) => x.name === v.name)) snap.push(v);
  return { ...state, root: { ...root, ...(snap.length ? { vars: snap } : {}) } };
}

export interface SavedDesign {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
  updatedAt: number;
}

interface DesignStore {
  // Keyed by elementType, e.g. "button", "text", "card"
  designs: Record<string, SavedDesign[]>;
  /**
   * Pemilik salinan lokal (id user server). null = dibuat sebelum login;
   * desain itu diunggah ke akun saat pengguna masuk (lihat designSync.ts).
   */
  owner: string | null;
  /** Ganti seluruh isi (dipakai sinkronisasi server). */
  replaceAll: (designs: Record<string, SavedDesign[]>, owner: string | null) => void;
  getDesigns: (elementType: string) => SavedDesign[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveDesign: (elementType: string, name: string, state: any) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateDesign: (elementType: string, id: string, state: any) => void;
  renameDesign: (elementType: string, id: string, name: string) => void;
  deleteDesign: (elementType: string, id: string) => void;
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set, get) => ({
      designs: {},
      owner: null,
      replaceAll: (designs, owner) => set({ designs, owner }),
      getDesigns: (elementType) => get().designs[elementType] || [],
      saveDesign: (elementType, name, state) => {
        const id = makeId();
        set((s) => {
          const list = s.designs[elementType] || [];
          return {
            designs: {
              ...s.designs,
              [elementType]: [
                {
                  id,
                  name: name.trim() || "Desain tanpa nama",
                  state: withVarSnapshot(state),
                  updatedAt: Date.now(),
                },
                ...list,
              ],
            },
          };
        });
        return id;
      },
      updateDesign: (elementType, id, state) =>
        set((s) => {
          const list = s.designs[elementType] || [];
          return {
            designs: {
              ...s.designs,
              [elementType]: list.map((d) =>
                d.id === id ? { ...d, state: withVarSnapshot(state), updatedAt: Date.now() } : d
              ),
            },
          };
        }),
      renameDesign: (elementType, id, name) =>
        set((s) => {
          const list = s.designs[elementType] || [];
          return {
            designs: {
              ...s.designs,
              [elementType]: list.map((d) =>
                d.id === id ? { ...d, name: name.trim() || d.name } : d
              ),
            },
          };
        }),
      deleteDesign: (elementType, id) =>
        set((s) => {
          const list = s.designs[elementType] || [];
          return {
            designs: {
              ...s.designs,
              [elementType]: list.filter((d) => d.id !== id),
            },
          };
        }),
    }),
    // Salinan lokal (cache offline). Sumber kebenaran saat login = server (/designs).
    { name: "element-maker-designs-v2", partialize: (s) => ({ designs: s.designs, owner: s.owner }) }
  )
);
