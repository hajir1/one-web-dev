import type { BoxNode, ComponentNode, ElementNode } from "../../pageMaker/engine/helpers/componentTypes";
import { isBox } from "../../pageMaker/engine/helpers/componentTypes";
import type { PageDoc } from "../../pageMaker/helpers/pageDoc";

/* ================================================================== */
/* Automatic color contrast for templates (WCAG 2 AA)                   */
/*                                                                    */
/* Each text color in an element is paired with its background:         */
/*   - field "<x>TextColor"/"<x>Color" ↔ "<x>BgColor" on the same element, */
/*   - "textColor"/"color" ↔ that element's "bgColor",                   */
/*   - when the element is transparent: the nearest box background (bgColor). */
/* When the ratio is < 4.5 (3 for text ≥ 24px), the text color is shifted slightly */
/* (darker on light backgrounds, lighter on dark backgrounds) until      */
/* it passes; when the text is already white/black, the background is shifted. Colors */
/* other things (border, shadow, hover) are left untouched.              */
/* ================================================================== */

type Rgb = [number, number, number];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function parse(hex: unknown): Rgb | null {
  if (typeof hex !== "string" || !HEX.test(hex.trim())) return null;
  let h = hex.trim().slice(1);
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
}

const toHex = (c: Rgb) => `#${c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("")}`;

function lum([r, g, b]: Rgb): number {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(a: Rgb, b: Rgb): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Mix `c` toward `to` (0..1). */
const mix = (c: Rgb, to: Rgb, t: number): Rgb => c.map((v, i) => v + (to[i] - v) * t) as Rgb;

/** Below this ratio the pair is considered a wrong background guess. */
const NEAR_MISS = 2;

const BLACK: Rgb = [0, 0, 0];
const WHITE: Rgb = [255, 255, 255];

/** Shifts `c` away from `other` until the contrast is ≥ `min`; null when impossible. */
function push(c: Rgb, other: Rgb, min: number): Rgb | null {
  const to = lum(other) > 0.18 ? BLACK : WHITE;
  for (let t = 0.04; t <= 1.0001; t += 0.04) {
    const n = mix(c, to, t);
    if (contrast(n, other) >= min) return n;
  }
  return null;
}

/** Fixes a text/background pair; returns the new color (or null when it already passes). */
export function fixPair(fgHex: string, bgHex: string, min = 4.5): { fg?: string; bg?: string } | null {
  const fg = parse(fgHex);
  const bg = parse(bgHex);
  if (!fg || !bg) return null;
  const now = contrast(fg, bg);
  // A very low ratio almost certainly means the real background is something else (image, gradient,
  // custom CSS): do not touch. Only the "nearly passing" ones are fixed.
  if (now >= min || now < NEAR_MISS) return null;
  const nf = push(fg, bg, min);
  // Text that is already nearly white/black cannot be shifted far: shift the background.
  const fgMoved = nf ? Math.max(...nf.map((v, i) => Math.abs(v - fg[i]))) : 999;
  if (nf && fgMoved <= 120) return { fg: toHex(nf) };
  const nb = push(bg, fg, min);
  if (nb) return { bg: toHex(nb) };
  return nf ? { fg: toHex(nf) } : null;
}

const SKIP = /(border|shadow|overlay|glow|outline|ring|divider|line|track|accent|icon|hover|focus|active|placeholder|gradient|stroke|fill|dot|bar)/i;
const opaque = (v: unknown) => typeof v === "string" && HEX.test(v.trim());

/** Box background: a hex color, "none" (transparent), or "unknown" (image, gradient, variable). */
function boxBg(b: BoxNode): string | "none" | "unknown" {
  if (b.bgType && b.bgType !== "solid") return "unknown";
  if ((b as { section?: { bgImage?: string } }).section?.bgImage || b.bgImage) return "unknown";
  if (!b.bgEnabled) return "none";
  if (opaque(b.bgColor)) return b.bgColor;
  return /^(transparent|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/i.test(String(b.bgColor ?? "").trim()) ? "none" : "unknown";
}

function fixElement(el: ElementNode, parentBg: string | null): ElementNode {
  const s = (el.state ?? {}) as Record<string, unknown>;
  const big = typeof s.fontSize === "number" && s.fontSize >= 24;
  const min = big ? 3 : 4.5;
  const patch: Record<string, string> = {};
  const ownBg = opaque(s.bgColor) ? (s.bgColor as string) : null;
  // Elements that draw their background through other fields (e.g. tables: headerBg, stripeBg) cannot
  // be guessed: only clear prefix pairs are checked.
  const complex = Object.keys(s).some((k) => /^(header|stripe|row|cell|th|td)/i.test(k));
  for (const [k, v] of Object.entries(s)) {
    if (!/Color$/.test(k) || /bg|background/i.test(k) || SKIP.test(k) || !opaque(v)) continue;
    const prefix = k.replace(/(Text)?Color$/, "");
    const bgKey = prefix ? [`${prefix}BgColor`, `${prefix}Bg`].find((x) => opaque(s[x])) : undefined;
    if (complex && !bgKey) continue;
    const bg = bgKey ? (s[bgKey] as string) : ownBg ?? parentBg;
    if (!bg) continue;
    const fix = fixPair((patch[k] ?? v) as string, (bgKey ? patch[bgKey] : undefined) ?? bg, min);
    if (!fix) continue;
    if (fix.fg) patch[k] = fix.fg;
    else if (fix.bg) {
      // Only this element's own background may be shifted (the parent box background is used by other elements).
      if (bgKey) patch[bgKey] = fix.bg;
      else if (ownBg) patch.bgColor = fix.bg;
      else {
        const f2 = push(parse(v as string)!, parse(bg)!, min);
        if (f2) patch[k] = toHex(f2);
      }
    }
  }
  return Object.keys(patch).length ? { ...el, state: { ...el.state, ...patch } } : el;
}

function walk(n: ComponentNode, bg: string | null): ComponentNode {
  if (!isBox(n)) return fixElement(n, bg);
  const own = boxBg(n);
  // Boxes with an image/gradient/variable background: the background color is unknown → their content is only
  // checked against its own background.
  const next = own === "unknown" ? null : own === "none" ? bg : own;
  const kids = n.children.map((c) => walk(c, next));
  return kids.every((k, i) => k === n.children[i]) ? n : { ...n, children: kids };
}

/** Fixes the contrast of the whole page (the default page background is white). */
export function fixPageContrast(doc: PageDoc, pageBg = "#ffffff"): PageDoc {
  const own = boxBg(doc.root);
  const root = walk(doc.root, own === "unknown" ? null : own === "none" ? pageBg : own) as BoxNode;
  return root === doc.root ? doc : { ...doc, root };
}
