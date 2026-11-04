// ─── lib/sharpen.ts ──────────────────────────────────────────────────────────
// Unsharp mask (separable Gaussian) for Image Upscaler. Pure functions on
// an RGBA buffer → can run in a Web Worker and be tested without a browser.

export interface SharpenOptions {
  /** Strength 0–3 (0 = no sharpening). */
  amount: number;
  /** Radius blur (sigma) dalam piksel, 0.5–3. */
  radius: number;
  /** Ignore small differences (0–255) so noise is not sharpened too. */
  threshold: number;
}

function gaussianKernel(sigma: number): Float32Array {
  const r = Math.max(1, Math.ceil(sigma * 2.5));
  const k = new Float32Array(r * 2 + 1);
  let sum = 0;
  for (let i = -r; i <= r; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    k[i + r] = v;
    sum += v;
  }
  for (let i = 0; i < k.length; i++) k[i] /= sum;
  return k;
}

/** Gaussian blur of the RGB channels (alpha unchanged). Image edges are clamped. */
function gaussianBlurRGB(src: Uint8ClampedArray, w: number, h: number, sigma: number): Float32Array {
  const k = gaussianKernel(sigma);
  const r = (k.length - 1) / 2;
  const tmp = new Float32Array(w * h * 3);
  const out = new Float32Array(w * h * 3);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let a = 0, b = 0, c = 0;
      for (let i = -r; i <= r; i++) {
        const xx = x + i < 0 ? 0 : x + i >= w ? w - 1 : x + i;
        const p = (row + xx) * 4;
        const kv = k[i + r];
        a += src[p] * kv;
        b += src[p + 1] * kv;
        c += src[p + 2] * kv;
      }
      const o = (row + x) * 3;
      tmp[o] = a;
      tmp[o + 1] = b;
      tmp[o + 2] = c;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = 0, b = 0, c = 0;
      for (let i = -r; i <= r; i++) {
        const yy = y + i < 0 ? 0 : y + i >= h ? h - 1 : y + i;
        const p = (yy * w + x) * 3;
        const kv = k[i + r];
        a += tmp[p] * kv;
        b += tmp[p + 1] * kv;
        c += tmp[p + 2] * kv;
      }
      const o = (y * w + x) * 3;
      out[o] = a;
      out[o + 1] = b;
      out[o + 2] = c;
    }
  }
  return out;
}

/** Apply an unsharp mask IN PLACE on an RGBA buffer. */
export function unsharpMask(data: Uint8ClampedArray, w: number, h: number, opt: SharpenOptions): Uint8ClampedArray {
  const amount = Math.max(0, Math.min(3, opt.amount));
  if (amount === 0 || w < 3 || h < 3) return data;
  const blur = gaussianBlurRGB(data, w, h, Math.max(0.5, Math.min(3, opt.radius)));
  const th = Math.max(0, Math.min(255, opt.threshold));
  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    for (let c = 0; c < 3; c++) {
      const diff = data[i + c] - blur[j + c];
      if (Math.abs(diff) >= th) data[i + c] = data[i + c] + amount * diff; // Uint8Clamped menjepit 0–255
    }
  }
  return data;
}

/* ---------------------------- upscale size ---------------------------- */

export const UPSCALE_MAX_PIXELS = 16_777_216; // safe on Safari/iOS
const UPSCALE_MAX_SIDE = 16_384;

/** Upscaled output size; clamped to the safe limit (fixed ratio). */
export function upscaleTarget(w: number, h: number, scale: number): { width: number; height: number; scale: number; clamped: boolean; tooLarge: boolean } {
  let s = Math.max(1, scale);
  const byArea = Math.sqrt(UPSCALE_MAX_PIXELS / (w * h));
  const bySide = UPSCALE_MAX_SIDE / Math.max(w, h);
  const limit = Math.min(byArea, bySide);
  // Already as large as/larger than the limit: cannot be enlarged in the browser.
  const tooLarge = limit <= 1.01;
  const clamped = s > limit;
  if (clamped) s = Math.max(1, limit);
  return { width: Math.max(1, Math.floor(w * s)), height: Math.max(1, Math.floor(h * s)), scale: s, clamped, tooLarge };
}
