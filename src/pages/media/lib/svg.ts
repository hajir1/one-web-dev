// ─── lib/svg.ts ──────────────────────────────────────────────────────────────
// Reads & cleans user-uploaded SVGs.
// - Correct parse error detection: Chrome/Safari insert <parsererror>
//   INSIDE the document (the root stays <svg>), so checking only the root `nodeName` does not
//   enough (bug in the old version).
// - Width/height with units (cm, mm, in, pt, %) are read correctly;
//   sebelumnya "100%" dianggap 100 px.
// - SVG→SVG output is cleaned of <script>, on* handlers, and javascript:
//   URLs so the output file is safe to open/embed.

import i18n from "../../../i18n";

const PX_PER: Record<string, number> = { px: 1, "": 1, pt: 96 / 72, pc: 16, in: 96, cm: 96 / 2.54, mm: 96 / 25.4, q: 96 / 101.6, em: 16, ex: 8, rem: 16 };

/** "10cm" → 377.95; "100%" / "auto" / empty → null. */
export function parseSvgLength(v: string | null | undefined): number | null {
  if (!v) return null;
  const m = /^\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*([a-z]*)\s*$/i.exec(v);
  if (!m) return null;
  const unit = m[2].toLowerCase();
  if (!(unit in PX_PER)) return null;
  const n = parseFloat(m[1]) * PX_PER[unit];
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** viewBox "0 0 120 80" → { w: 120, h: 80 } */
function parseViewBox(v: string | null | undefined): { w: number; h: number } | null {
  if (!v) return null;
  const p = v.trim().split(/[\s,]+/).map(Number);
  if (p.length !== 4 || p.some((x) => !Number.isFinite(x)) || p[2] <= 0 || p[3] <= 0) return null;
  return { w: p[2], h: p[3] };
}

/** Intrinsic SVG size; ratio from the viewBox when only one side is known. */
export function svgIntrinsicSize(attrs: { width?: string | null; height?: string | null; viewBox?: string | null }, fallback = 1024): { width: number; height: number; known: boolean } {
  const w = parseSvgLength(attrs.width);
  const h = parseSvgLength(attrs.height);
  const vb = parseViewBox(attrs.viewBox);
  if (w && h) return { width: w, height: h, known: true };
  if (vb) {
    if (w) return { width: w, height: (w * vb.h) / vb.w, known: true };
    if (h) return { width: (h * vb.w) / vb.h, height: h, known: true };
    return { width: vb.w, height: vb.h, known: true };
  }
  return { width: w ?? fallback, height: h ?? w ?? fallback, known: false };
}

export function parseSvg(text: string): { doc: Document; svg: SVGSVGElement } {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = doc.documentElement;
  if (root.nodeName.toLowerCase() !== "svg" || doc.getElementsByTagName("parsererror").length > 0) {
    throw new Error(i18n.t("media.errors.invalidSvg"));
  }
  return { doc, svg: root as unknown as SVGSVGElement };
}

const DANGEROUS_TAGS = ["script", "iframe", "embed", "object", "handler", "listener"];
const URL_ATTRS = ["href", "xlink:href", "src", "action", "formaction"];

/** Strip active content. Returns the number of nodes/attributes removed. */
export function sanitizeSvgDoc(doc: Document): number {
  let removed = 0;
  for (const tag of DANGEROUS_TAGS) {
    for (const el of Array.from(doc.getElementsByTagName(tag))) {
      el.remove();
      removed++;
    }
  }
  for (const el of Array.from(doc.getElementsByTagName("*"))) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      // eslint-disable-next-line no-control-regex -- control characters are stripped on purpose so "java\x00script:" cannot slip through
      const val = attr.value.replace(/[\s\u0000-\u001f]+/g, "").toLowerCase();
      if (name.startsWith("on") || (URL_ATTRS.includes(name) && (val.startsWith("javascript:") || val.startsWith("data:text/html")))) {
        el.removeAttribute(attr.name);
        removed++;
      }
    }
  }
  return removed;
}
