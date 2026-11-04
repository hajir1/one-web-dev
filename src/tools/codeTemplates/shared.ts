/* ================================================================== */
/* Code Template generator utilities (v16, part J).                     */
/* The output is self-contained HTML files in pages/webTemplates/codeTemplates/. */
/* ================================================================== */

/** Deterministic RNG (mulberry32): generator output is always the same. */
export function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (lo: number, hi: number) => lo + (hi - lo) * next(),
    int: (lo: number, hi: number) => Math.floor(lo + (hi - lo + 1) * next()),
    pick: <T>(list: readonly T[]) => list[Math.floor(next() * list.length)],
  };
}
export type Rng = ReturnType<typeof rng>;

/** Compact number for SVG attributes. */
export const n = (v: number, d = 1) => {
  const s = v.toFixed(d);
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
};

/** Escape HTML text. */
export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Tidies CSS/JS: removes excess indentation and double blank lines (smaller, still readable). */
export function tidy(src: string): string {
  return src
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ---------------- no-code edit markers (v17, see editModel.ts) ---------------- */

/** Editable text attributes: data-owd-text + label (+ multi-line). */
export const ot = (key: string, label: string, multi = false) => ` data-owd-text="${key}" data-owd-label="${esc(label)}"${multi ? " data-owd-multi" : ""}`;
/** Editable link attributes. */
export const oh = (key: string, label: string) => ` data-owd-href="${key}" data-owd-href-label="${esc(label)}"`;

export interface ThemeVar {
  name: string;
  value: string;
  label: string;
  /** [min, max, step] for the slider. */
  range?: [number, number, number];
}
/** Editable theme variable block (the Colors & style form). */
export function themeStyle(vars: ThemeVar[]): string {
  return `<style id="owd-theme">
/* Colors & style: edit here or in the OneWebDev editor. */
:root {
${vars.map((v) => `  ${v.name}: ${v.value}; /* ${v.label}${v.range ? ` [${v.range.join(",")}]` : ""} */`).join("\n")}
}
</style>`;
}

/** JSON that is safe for <script> (same as jsonForScript in editModel.ts). */
export function json(value: unknown): string {
  return JSON.stringify(value, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/\/\*/g, "\\/*")
    .replace(/\*\//g, "*\\/");
}
/** A data block editable through the form: const NAME = /*owd:data…*\/{…}/*owd:end*\/; */
export function dataBlock(name: string, label: string, value: unknown, hide: string[] = []): string {
  return `/*owd:data name="${name}" label="${esc(label)}"${hide.length ? ` hide="${hide.join(",")}"` : ""}*/${json(value)}/*owd:end*/`;
}

/**
 * Vercel Web Analytics (v19). Loaded only on sites that are already online (http/https),
 * not in previews/thumbnails (iframes) or when opened from a local file.
 * On hosts other than Vercel the result is just one 404 request; remove this block if unused.
 */
export const VERCEL_ANALYTICS = `<script>
/* Vercel Web Analytics: enable the "Analytics" menu in the Vercel project dashboard. */
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
(function () { if (!/^https?:$/.test(location.protocol) || window.top !== window.self || /^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname)) return; var s = document.createElement("script"); s.defer = true; s.src = "/_vercel/insights/script.js"; document.head.appendChild(s); })();
</script>`;

/** Kerangka dokumen. */
export function doc(o: { lang?: string; title: string; description: string; head?: string; css: string; body: string; theme?: string; vars?: ThemeVar[]; titleEditable?: boolean }): string {
  return `<!doctype html>
<html lang="${o.lang ?? "id"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title${o.titleEditable === false ? "" : ot("judulTab", "Judul tab browser")}>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
${VERCEL_ANALYTICS}
${o.theme ? `<meta name="theme-color" content="${o.theme}">\n` : ""}${o.head ? `${o.head.trim()}\n` : ""}${o.vars ? `${themeStyle(o.vars)}\n` : ""}<style>
${tidy(o.css)}
</style>
</head>
<body>
${o.body.trim()}
</body>
</html>
`;
}
