/* ================================================================== */
/* Font global — logika murni (tanpa React) supaya bisa dites          */
/*                                                                    */
/* Dipakai bareng oleh: Global Setting (kelola font), panel styling    */
/* (pilih font), Element Maker (kode export), Component/Page Maker      */
/* (compose → pratinjau + export).                                      */
/*                                                                    */
/* Elemen menyimpan font sebagai string CSS biasa (mis.                 */
/*   "Poppins", sans-serif ). Jadi CSS hasil export tetap mandiri; yang  */
/* ditambahkan hanya baris pemuat font (@import / @font-face) untuk     */
/* font pustaka yang benar-benar dipakai di CSS itu.                    */
/* ================================================================== */

import i18n from "../../../../i18n";
import { expandVarRefs, type CssVar } from "./cssVars";

export type FontFallback = "sans-serif" | "serif" | "monospace" | "cursive";

export const FONT_FALLBACKS: { value: FontFallback; label: string }[] = [
  { value: "sans-serif", label: "Sans-serif" },
  { value: "serif", label: "Serif" },
  { value: "monospace", label: "Monospace" },
  { value: "cursive", label: "Cursive" },
];

export const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/** Font yang dimuat dari Google Fonts (cukup nama keluarga) atau dari URL. */
export type FontSource = "google" | "url";

export interface GlobalFont {
  id: string;
  /** Nama keluarga font = nama di CSS `font-family`. Tidak diubah setelah dibuat. */
  name: string;
  source: FontSource;
  fallback: FontFallback;
  /** Hanya untuk sumber "google". */
  weights: number[];
  /** Hanya untuk sumber "url": stylesheet (.css) atau berkas font (.woff2/.woff/.ttf/.otf). */
  url: string;
  createdAt: number;
}

/** Font bawaan sistem — tidak perlu dimuat. */
export const SYSTEM_FONTS: { id: string; name: string; stack: string }[] = [
  {
    id: "sys-ui",
    name: "Sistem (UI)",
    stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  { id: "sys-arial", name: "Arial", stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif' },
  { id: "sys-verdana", name: "Verdana", stack: "Verdana, Geneva, sans-serif" },
  { id: "sys-trebuchet", name: "Trebuchet MS", stack: '"Trebuchet MS", Helvetica, sans-serif' },
  { id: "sys-georgia", name: "Georgia", stack: "Georgia, serif" },
  { id: "sys-times", name: "Times New Roman", stack: '"Times New Roman", Times, serif' },
  { id: "sys-mono", name: "Monospace", stack: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace' },
];

/* ------------------------------ validasi ---------------------------- */

/** Nama keluarga font: huruf/angka/spasi/-/_ saja (aman untuk CSS dan URL Google Fonts). */
export function isValidFontName(name: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9 _-]{0,59}$/.test(name.trim());
}

/**
 * URL font yang diizinkan: http(s) atau path relatif dari root ("/fonts/x.woff2").
 * Menolak spasi, kutip, kurung, backslash, dan karakter kontrol — nilainya masuk
 * ke `url("...")` di CSS, jadi tidak boleh bisa menutup string/deklarasi.
 */
export function isSafeFontUrl(url: string): boolean {
  const u = url.trim();
  if (!u || u.length > 500) return false;
  // eslint-disable-next-line no-control-regex -- karakter kontrol sengaja ditolak dalam URL font
  if (/[\s"'()\\<>{};\u0000-\u001f]/.test(u)) return false;
  return /^https?:\/\/[^/]+/i.test(u) || /^\/(?!\/)/.test(u);
}

export type UrlKind = "stylesheet" | "file";

const FILE_EXT = /\.(woff2?|ttf|otf)(\?.*)?(#.*)?$/i;

export function urlKind(url: string): UrlKind {
  return FILE_EXT.test(url.trim()) ? "file" : "stylesheet";
}

function fileFormat(url: string): string {
  const ext = url.trim().match(FILE_EXT)?.[1]?.toLowerCase();
  return ext === "woff2"
    ? "woff2"
    : ext === "woff"
      ? "woff"
      : ext === "ttf"
        ? "truetype"
        : "opentype";
}

export interface FontInput {
  name: string;
  source: FontSource;
  fallback: FontFallback;
  weights?: number[];
  url?: string;
}

/** Pesan galat (bahasa aktif) atau null kalau input valid. */
export function validateFontInput(i: FontInput): string | null {
  if (!isValidFontName(i.name))
    return i18n.t("el.font.nameInvalid");
  if (i.source === "url") {
    if (!i.url || !isSafeFontUrl(i.url))
      return i18n.t("el.font.urlInvalid");
  }
  return null;
}

/* ----------------------------- CSS output --------------------------- */

/** Nilai `font-family` untuk sebuah font pustaka, mis. `"Poppins", sans-serif`. */
export function fontStack(f: Pick<GlobalFont, "name" | "fallback">): string {
  return `"${f.name.trim()}", ${f.fallback}`;
}

export function googleFontsUrl(name: string, weights: number[]): string {
  const family = name.trim().replace(/ /g, "+");
  const ws = [...new Set(weights)]
    .filter((w) => (FONT_WEIGHTS as readonly number[]).includes(w))
    .sort((a, b) => a - b);
  const axis = ws.length && !(ws.length === 1 && ws[0] === 400) ? `:wght@${ws.join(";")}` : "";
  return `https://fonts.googleapis.com/css2?family=${family}${axis}&display=swap`;
}

/** Aturan pemuat satu font: `@import url(...)` atau `@font-face {...}`. */
export function fontLoader(f: GlobalFont): { kind: "import" | "face"; css: string } | null {
  if (!isValidFontName(f.name)) return null;
  if (f.source === "google") {
    return { kind: "import", css: `@import url("${googleFontsUrl(f.name, f.weights)}");` };
  }
  if (!isSafeFontUrl(f.url)) return null;
  const url = f.url.trim();
  if (urlKind(url) === "stylesheet") return { kind: "import", css: `@import url("${url}");` };
  return {
    kind: "face",
    css: `@font-face {\n  font-family: "${f.name.trim()}";\n  src: url("${url}") format("${fileFormat(url)}");\n  font-display: swap;\n}`,
  };
}

/** Semua nilai pada deklarasi `font-family:` di CSS (untuk mendeteksi font yang dipakai). */
function fontFamilyValues(css: string): string[] {
  const out: string[] = [];
  const re = /font-family\s*:\s*([^;}]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) out.push(m[1]);
  return out;
}

/** Font pustaka yang dipakai oleh CSS ini (urut sesuai pustaka). */
export function fontsUsedIn(css: string, fonts: GlobalFont[]): GlobalFont[] {
  if (!fonts.length || !css.includes("font-family")) return [];
  const values = fontFamilyValues(css);
  return fonts.filter((f) => values.some((v) => v.includes(`"${f.name.trim()}"`)));
}

/** Baris pemuat untuk daftar font: semua @import dulu (wajib di awal stylesheet), lalu @font-face. */
export function loadersCss(fonts: GlobalFont[]): string {
  const ls = fonts.map(fontLoader).filter((l): l is NonNullable<typeof l> => !!l);
  const seen = new Set<string>();
  const uniq = ls.filter((l) => (seen.has(l.css) ? false : (seen.add(l.css), true)));
  return [
    ...uniq.filter((l) => l.kind === "import"),
    ...uniq.filter((l) => l.kind === "face"),
  ]
    .map((l) => l.css)
    .join("\n");
}

/**
 * Pemuat hanya untuk font pustaka yang dipakai di `css` ("" kalau tidak ada).
 * v7: `font-family: var(--x)` ikut dihitung lewat nilai variabelnya.
 */
export function fontLoadCss(css: string, fonts: GlobalFont[], vars: readonly CssVar[] = []): string {
  return loadersCss(fontsUsedIn(vars.length ? expandVarRefs(expandVarRefs(css, vars), vars) : css, fonts));
}

/** `css` didahului pemuat font yang dipakainya — tak berubah kalau tidak ada font pustaka. */
export function withFontCss(css: string, fonts: GlobalFont[], vars: readonly CssVar[] = []): string {
  const load = fontLoadCss(css, fonts, vars);
  return load ? `${load}\n\n${css}` : css;
}

/* ------------------------- v7: font sebagai variabel ------------------------- */

/** "Plus Jakarta Sans" → "font-plus-jakarta-sans". */
function fontVarName(f: Pick<GlobalFont, "name">): string {
  return `font-${f.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`.slice(0, 40);
}

/**
 * Setiap font pustaka otomatis menjadi variabel `--font-<nama>` sehingga
 * elemen menyimpan referensi (`var(--font-poppins)`), bukan salinan stack.
 * Mengubah font di Pengaturan Global langsung mengubah semua elemen.
 */
export function libraryFontVars(fonts: readonly GlobalFont[]): CssVar[] {
  return fonts.filter((f) => isValidFontName(f.name)).map((f) => ({ id: `font-${f.id}`, name: fontVarName(f), type: "font" as const, value: fontStack(f) }));
}

/** Nilai `font-family` dari id font dasar: font pustaka, atau null. */
export function baseFontStack(fonts: GlobalFont[], baseFontId: string | null): string | null {
  if (!baseFontId) return null;
  const sys = SYSTEM_FONTS.find((s) => s.id === baseFontId);
  if (sys) return sys.stack;
  const f = fonts.find((x) => x.id === baseFontId);
  return f ? fontStack(f) : null;
}

/** Bersihkan data font dari localStorage (bisa rusak / diedit manual). */
export function sanitizeFonts(raw: unknown): GlobalFont[] {
  if (!Array.isArray(raw)) return [];
  const out: GlobalFont[] = [];
  const ids = new Set<string>();
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const v = r as Record<string, unknown>;
    const name = typeof v.name === "string" ? v.name.trim() : "";
    const id = typeof v.id === "string" && v.id ? v.id : "";
    if (!id || ids.has(id) || !isValidFontName(name)) continue;
    const source: FontSource = v.source === "url" ? "url" : "google";
    const url = typeof v.url === "string" ? v.url.trim() : "";
    if (source === "url" && !isSafeFontUrl(url)) continue;
    const fallback = FONT_FALLBACKS.some((f) => f.value === v.fallback)
      ? (v.fallback as FontFallback)
      : "sans-serif";
    const weights = Array.isArray(v.weights)
      ? [...new Set(v.weights.map(Number))]
          .filter((w) => (FONT_WEIGHTS as readonly number[]).includes(w))
          .sort((a, b) => a - b)
      : [400, 700];
    ids.add(id);
    out.push({
      id,
      name,
      source,
      fallback,
      weights: weights.length ? weights : [400],
      url: source === "url" ? url : "",
      createdAt: Number(v.createdAt) || 0,
    });
  }
  return out;
}
