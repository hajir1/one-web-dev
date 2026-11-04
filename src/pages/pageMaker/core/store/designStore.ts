import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeId } from "../helpers/makeId";
import { varNamesIn, type CssVar } from "../helpers/cssVars";
import { currentGlobalVars } from "../hooks/useGlobalVars";

/**
 * v7: page designs store a copy of the global variables they reference in
 * `root.vars`, so the design still renders correctly on other devices / in server
 * exports even when the variables do not exist there yet. Global values still win.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withVarSnapshot(state: any): any {
  if (!state || typeof state !== "object" || !state.root || typeof state.root !== "object") return state;
  const { vars: _old, ...root } = state.root as { vars?: CssVar[] };
  const used = new Set(varNamesIn(JSON.stringify(root)));
  if (!used.size) return _old ? { ...state, root } : state;
  const all = currentGlobalVars();
  const snap = all.filter((v) => used.has(v.name)).map(({ id, name, type, value }) => ({ id, name, type, value }));
  // Variables no longer on this device: keep the old copy.
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
   * Owner of the local copy (server user id). null = created before signing in;
   * that design is uploaded to the account when the user signs in (see designSync.ts).
   */
  owner: string | null;
  /** Replaces the whole content (used by server sync). */
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
    // Local copy (offline cache). Source of truth when signed in = the server (/designs).
    { name: "element-maker-designs-v2", partialize: (s) => ({ designs: s.designs, owner: s.owner }) }
  )
);
