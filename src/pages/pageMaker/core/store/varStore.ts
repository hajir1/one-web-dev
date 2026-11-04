import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeId } from "../helpers/makeId";
import {
  BUILTIN_VARS,
  withBuiltinVars,
  isValidVarValue,
  normalizeVarName,
  sanitizeVars,
  validateVarName,
  type CssVar,
  type VarError,
  type VarType,
} from "../helpers/cssVars";

/* ================================================================== */
/* Global variable library (v7) — persisted to localStorage like fonts. */
/* Built-in variables always exist (their values can be changed & reset); */
/* user-created variables can be added, edited, renamed, and deleted.   */
/* Tidying references in designs (rename / delete) lives in             */
/* globalSetting/ui/VariableManager.tsx so this store stays small.      */
/* ================================================================== */

interface VarStore {
  vars: CssVar[];
  add: (input: { name: string; type: VarType; value: string }) => VarError | null;
  update: (id: string, patch: { name?: string; value?: string }) => VarError | null;
  remove: (id: string) => void;
  reset: (id: string) => void;
}

/** Built-ins first (fixed order), then user-created ones. Built-in values come from stored data when valid. */
/** Built-in variables always exist (stored values win), then user-created variables. */
export const withBuiltins = withBuiltinVars;

export const useVarStore = create<VarStore>()(
  persist(
    (set, get) => ({
      vars: withBuiltins([]),

      add: (input) => {
        const err = validateVarName(input.name, get().vars);
        if (err) return err;
        if (!isValidVarValue(input.type, input.value)) return "valueInvalid";
        const v: CssVar = { id: makeId(), name: normalizeVarName(input.name), type: input.type, value: input.value.trim() };
        set((s) => ({ vars: [...s.vars, v] }));
        return null;
      },

      update: (id, patch) => {
        const cur = get().vars.find((v) => v.id === id);
        if (!cur) return "nameInvalid";
        const next = { ...cur };
        if (patch.name !== undefined && !cur.builtin) {
          const err = validateVarName(patch.name, get().vars, id);
          if (err) return err;
          next.name = normalizeVarName(patch.name);
        }
        if (patch.value !== undefined) {
          if (!isValidVarValue(cur.type, patch.value)) return "valueInvalid";
          next.value = patch.value.trim();
        }
        set((s) => ({ vars: s.vars.map((v) => (v.id === id ? next : v)) }));
        return null;
      },

      remove: (id) => set((s) => ({ vars: s.vars.filter((v) => v.id !== id || v.builtin) })),

      reset: (id) =>
        set((s) => ({
          vars: s.vars.map((v) => {
            const b = v.id === id && v.builtin ? BUILTIN_VARS.find((x) => x.id === v.id) : undefined;
            return b ? { ...v, value: b.value } : v;
          }),
        })),
    }),
    {
      name: "global-css-variables",
      version: 1,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as { vars?: unknown };
        return { ...current, vars: withBuiltins(sanitizeVars(p.vars)) };
      },
    },
  ),
);
