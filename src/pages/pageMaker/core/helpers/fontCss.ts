/* ================================================================== */
/* Global fonts: pure logic (no React) so it can be tested             */
/*                                                                    */
/* Shared by: Global Setting (font management), the styling panel      */
/* (font picker), Element Maker (export code), Component/Page Maker     */
/* (compose → preview + export).                                        */
/*                                                                    */
/* Elements store fonts as plain CSS strings (e.g.                       */
/*   "Poppins", sans-serif ). So the exported CSS stays self-contained; */
/* only the font loader lines (@import / @font-face) are added for      */
/* library fonts actually used in that CSS.                             */
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

/** A font loaded from Google Fonts (family name is enough) or from a URL. */
export type FontSource = "google" | "url";

export interface GlobalFont {
  id: string;
  /** Font family name = the name in CSS `font-family`. Not changed after creation. */
  name: string;
  source: FontSource;
  fallback: FontFallback;
  /** Only for the "google" source. */
  weights: number[];
  /** Only for the "url" source: a stylesheet (.css) or a font file (.woff2/.woff/.ttf/.otf). */
  url: string;
  createdAt: number;
}

/** Built-in system fonts; no need to load them. */
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

/** Font family name: letters/digits/spaces/-/_ only (safe for CSS and Google Fonts URLs). */
export function isValidFontName(name: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9 _-]{0,59}$/.test(name.trim());
}

/**
 * Allowed font URLs: http(s) or a relative path from the root ("/fonts/x.woff2").
 * Rejects spaces, quotes, parentheses, backslashes, and control characters; the value goes
 * into `url("...")` in CSS, so it must not be able to close the string/declaration.
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

/** Error message (active language), or null when the input is valid. */
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

/** The `font-family` value for a library font, e.g. `"Poppins", sans-serif`. */
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

/** Loader rule for one font: `@import url(...)` or `@font-face {...}`. */
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

/** Every value in `font-family:` declarations in the CSS (to detect fonts in use). */
function fontFamilyValues(css: string): string[] {
  const out: string[] = [];
  const re = /font-family\s*:\s*([^;}]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) out.push(m[1]);
  return out;
}

/** Library fonts used by this CSS (in library order). */
export function fontsUsedIn(css: string, fonts: GlobalFont[]): GlobalFont[] {
  if (!fonts.length || !css.includes("font-family")) return [];
  const values = fontFamilyValues(css);
  return fonts.filter((f) => values.some((v) => v.includes(`"${f.name.trim()}"`)));
}

/** Loader lines for a font list: every @import first (required at the start of a stylesheet), then @font-face. */
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
 * Loaders only for library fonts used in `css` ("" when none).
 * v7: `font-family: var(--x)` is counted through its variable value.
 */
export function fontLoadCss(css: string, fonts: GlobalFont[], vars: readonly CssVar[] = []): string {
  return loadersCss(fontsUsedIn(vars.length ? expandVarRefs(expandVarRefs(css, vars), vars) : css, fonts));
}

/** `css` preceded by the loaders of the fonts it uses; unchanged when there are no library fonts. */
export function withFontCss(css: string, fonts: GlobalFont[], vars: readonly CssVar[] = []): string {
  const load = fontLoadCss(css, fonts, vars);
  return load ? `${load}\n\n${css}` : css;
}

/* ------------------------- v7: fonts as variables ------------------------- */

/** "Plus Jakarta Sans" → "font-plus-jakarta-sans". */
function fontVarName(f: Pick<GlobalFont, "name">): string {
  return `font-${f.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`.slice(0, 40);
}

/**
 * Every library font automatically becomes a `--font-<name>` variable so
 * elements store a reference (`var(--font-poppins)`), not a copy of the stack.
 * Changing a font in Global Settings immediately changes every element.
 */
export function libraryFontVars(fonts: readonly GlobalFont[]): CssVar[] {
  return fonts.filter((f) => isValidFontName(f.name)).map((f) => ({ id: `font-${f.id}`, name: fontVarName(f), type: "font" as const, value: fontStack(f) }));
}

/** The `font-family` value from a base font id: a library font, or null. */
export function baseFontStack(fonts: GlobalFont[], baseFontId: string | null): string | null {
  if (!baseFontId) return null;
  const sys = SYSTEM_FONTS.find((s) => s.id === baseFontId);
  if (sys) return sys.stack;
  const f = fonts.find((x) => x.id === baseFontId);
  return f ? fontStack(f) : null;
}

/** Sanitizes font data from localStorage (it may be corrupt / hand-edited). */
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
