// ─── lib/color.ts ────────────────────────────────────────────────────────────
// Color conversion & dominant palette extraction (median cut). Pure functions.

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number; // 0–255
}

const hex2 = (v: number) => Math.round(v).toString(16).padStart(2, "0").toUpperCase();

export function toHex({ r, g, b, a }: RGBA, withAlpha = false): string {
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${withAlpha && a < 255 ? hex2(a) : ""}`;
}

export function rgbToHsl(r: number, g: number, b: number) {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === rf ? (gf - bf) / d + (gf < bf ? 6 : 0) : max === gf ? (bf - rf) / d + 2 : (rf - gf) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360) % 360, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number) {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    h = max === rf ? ((gf - bf) / d) % 6 : max === gf ? (bf - rf) / d + 2 : (rf - gf) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h) % 360, s: Math.round((max === 0 ? 0 : d / max) * 100), v: Math.round(max * 100) };
}

/** Naive CMYK (no ICC profile); an approximation only. */
export function rgbToCmyk(r: number, g: number, b: number) {
  const k = 1 - Math.max(r, g, b) / 255;
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  const f = (v: number) => Math.round(((1 - v / 255 - k) / (1 - k)) * 100);
  return { c: f(r), m: f(g), y: f(b), k: Math.round(k * 100) };
}

/** Luminans relatif WCAG. */
function luminance({ r, g, b }: Pick<RGBA, "r" | "g" | "b">): number {
  const ch = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** WCAG contrast ratio between two colors (1–21). */
export function contrastRatio(a: Pick<RGBA, "r" | "g" | "b">, b: Pick<RGBA, "r" | "g" | "b">): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

export function colorFormats(c: RGBA): { label: string; value: string }[] {
  const hsl = rgbToHsl(c.r, c.g, c.b);
  const hsv = rgbToHsv(c.r, c.g, c.b);
  const cmyk = rgbToCmyk(c.r, c.g, c.b);
  const alpha = c.a < 255;
  const a = +(c.a / 255).toFixed(2);
  return [
    { label: "HEX", value: toHex(c, alpha) },
    { label: alpha ? "RGBA" : "RGB", value: alpha ? `rgba(${c.r}, ${c.g}, ${c.b}, ${a})` : `rgb(${c.r}, ${c.g}, ${c.b})` },
    { label: alpha ? "HSLA" : "HSL", value: alpha ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})` : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "HSV", value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { label: "CMYK", value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];
}

/* ------------------------------- palet ------------------------------- */

export interface PaletteColor extends RGBA {
  /** Porsi piksel (0–1). */
  share: number;
}

/**
 * Dominant colors with median cut. Nearly transparent pixels (alpha < 125)
 * are ignored; at most about 60 thousand samples so large images stay fast.
 */
export function extractPalette(data: Uint8ClampedArray, count = 6, maxSamples = 60_000): PaletteColor[] {
  const total = data.length / 4;
  const step = Math.max(1, Math.floor(total / maxSamples));
  const px: number[][] = [];
  for (let i = 0; i < total; i += step) {
    const o = i * 4;
    if (data[o + 3] < 125) continue;
    px.push([data[o], data[o + 1], data[o + 2]]);
  }
  if (!px.length) return [];

  type Box = number[][];
  const boxes: Box[] = [px];
  const range = (b: Box, c: number) => {
    let lo = 255, hi = 0;
    for (const p of b) {
      if (p[c] < lo) lo = p[c];
      if (p[c] > hi) hi = p[c];
    }
    return hi - lo;
  };
  while (boxes.length < count) {
    // Split the box with the largest range (times the pixel count, so busy boxes are prioritized).
    let bi = -1, best = 0, bc = 0;
    boxes.forEach((b, i) => {
      if (b.length < 2) return;
      for (let c = 0; c < 3; c++) {
        const score = range(b, c) * Math.sqrt(b.length);
        if (score > best) {
          best = score;
          bi = i;
          bc = c;
        }
      }
    });
    if (bi < 0 || best === 0) break;
    const box = boxes[bi].sort((p, q) => p[bc] - q[bc]);
    const mid = box.length >> 1;
    boxes.splice(bi, 1, box.slice(0, mid), box.slice(mid));
  }
  const n = px.length;
  const raw = boxes
    .filter((b) => b.length)
    .map((b) => {
      const s = [0, 0, 0];
      for (const p of b) {
        s[0] += p[0];
        s[1] += p[1];
        s[2] += p[2];
      }
      return { r: s[0] / b.length, g: s[1] / b.length, b: s[2] / b.length, count: b.length };
    })
    .sort((x, y) => y.count - x.count);
  // Median cut can split one large color into several boxes: merge the near-identical ones.
  const merged: typeof raw = [];
  for (const c of raw) {
    const m = merged.find((x) => (x.r - c.r) ** 2 + (x.g - c.g) ** 2 + (x.b - c.b) ** 2 < 18 ** 2);
    if (m) {
      const t = m.count + c.count;
      m.r = (m.r * m.count + c.r * c.count) / t;
      m.g = (m.g * m.count + c.g * c.count) / t;
      m.b = (m.b * m.count + c.b * c.count) / t;
      m.count = t;
    } else merged.push({ ...c });
  }
  return merged
    .map((c) => ({ r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b), a: 255, share: c.count / n }))
    .sort((x, y) => y.share - x.share);
}
