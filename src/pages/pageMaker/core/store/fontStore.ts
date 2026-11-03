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
  /** Font dasar halaman (id font pustaka atau id font sistem), atau null = bawaan peramban. */
  baseFontId: string | null;
  /** Mengembalikan pesan galat, atau null kalau berhasil. */
  addFont: (input: FontInput) => string | null;
  updateFont: (id: string, patch: Partial<Pick<FontInput, "fallback" | "weights" | "url">>) => string | null;
  removeFont: (id: string) => void;
  setBaseFont: (id: string | null) => void;
}

/** Pesan galat validasi dalam bahasa aktif (aturan tetap dari validateFontInput). */
function fontInputError(input: FontInput): string | null {
  if (!validateFontInput(input)) return null;
  return isValidFontName(input.name) ? i18n.t("gs.errors.fontUrl") : i18n.t("gs.errors.fontName");
}

/**
 * Pustaka font global — persist ke localStorage, sama seperti pustaka ikon.
 * Nama keluarga font tidak bisa diubah setelah dibuat karena elemen menyimpan
 * font sebagai string CSS (`"Nama", sans-serif`); ganti font = hapus + tambah.
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
      // Data di localStorage bisa rusak/diedit manual → bersihkan saat dimuat.
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
