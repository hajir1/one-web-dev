import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../../../../i18n";
import { makeId } from "../helpers/makeId";
import {
  SYSTEM_FONTS,
  isValidFontName,
  sanitizeFonts,
  validateFontInput,
  type FontInput,
  type GlobalFont,
} from "../helpers/fontCss";


interface FontStore {
  fonts: GlobalFont[];
  /** Base page font (a library font id or a system font id), or null = the browser default. */
  baseFontId: string | null;
  /** Returns an error message, or null on success. */
  addFont: (input: FontInput) => string | null;
  updateFont: (id: string, patch: Partial<Pick<FontInput, "fallback" | "weights" | "url">>) => string | null;
  removeFont: (id: string) => void;
  setBaseFont: (id: string | null) => void;
}

/** Validation error message in the active language (the rules still come from validateFontInput). */
function fontInputError(input: FontInput): string | null {
  if (!validateFontInput(input)) return null;
  return isValidFontName(input.name) ? i18n.t("gs.errors.fontUrl") : i18n.t("gs.errors.fontName");
}

/**
 * Global font library: persisted to localStorage, like the icon library.
 * The font family name cannot be changed after creation because elements store
 * fonts as CSS strings (`"Name", sans-serif`); changing a font = delete + add.
 */
export const useFontStore = create<FontStore>()(
  persist(
    (set, get) => ({
      fonts: [],
      baseFontId: null,

      addFont: (input) => {
        const err = fontInputError(input);
        if (err) return err;
        const name = input.name.trim();
        if (get().fonts.some((f) => f.name.toLowerCase() === name.toLowerCase()))
          return i18n.t("gs.errors.fontExists", { name });
        const font: GlobalFont = {
          id: makeId(),
          name,
          source: input.source,
          fallback: input.fallback,
          weights: input.weights?.length ? input.weights : [400, 700],
          url: input.source === "url" ? (input.url ?? "").trim() : "",
          createdAt: Date.now(),
        };
        set((s) => ({ fonts: [font, ...s.fonts] }));
        return null;
      },

      updateFont: (id, patch) => {
        const cur = get().fonts.find((f) => f.id === id);
        if (!cur) return i18n.t("gs.errors.fontNotFound");
        const next: GlobalFont = {
          ...cur,
          ...(patch.fallback && { fallback: patch.fallback }),
          ...(patch.weights?.length && { weights: patch.weights }),
          ...(patch.url !== undefined && cur.source === "url" && { url: patch.url.trim() }),
        };
        const err = fontInputError(next);
        if (err) return err;
        set((s) => ({ fonts: s.fonts.map((f) => (f.id === id ? next : f)) }));
        return null;
      },

      removeFont: (id) =>
        set((s) => ({
          fonts: s.fonts.filter((f) => f.id !== id),
          baseFontId: s.baseFontId === id ? null : s.baseFontId,
        })),

      setBaseFont: (id) => set({ baseFontId: id }),
    }),
    {
      name: "global-font-library",
      version: 1,
      // Data in localStorage may be corrupt/hand-edited → sanitize on load.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as { fonts?: unknown; baseFontId?: unknown };
        const fonts = sanitizeFonts(p.fonts);
        const baseId = typeof p.baseFontId === "string" ? p.baseFontId : null;
        const valid =
          baseId && (fonts.some((f) => f.id === baseId) || SYSTEM_FONTS.some((s) => s.id === baseId));
        return { ...current, fonts, baseFontId: valid ? baseId : null };
      },
    },
  ),
);
