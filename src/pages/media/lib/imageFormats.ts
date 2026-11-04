// ─── lib/imageFormats.ts ─────────────────────────────────────────────────────
// Simple image format writers that need no WASM codec: BMP (32-bit
// with alpha) and ICO (containing several PNG sizes). Pure (no DOM),
// used in a Web Worker and tested in Node.

type Rgba = Uint8ClampedArray | Uint8Array;

/** 32-bit BGRA BMP (BITMAPV4 header so alpha is read on Windows & in browsers). */
export function encodeBmp(rgba: Rgba, width: number, height: number): ArrayBuffer {
  const FILE_HEADER = 14;
  const INFO_HEADER = 108; // BITMAPV4HEADER
  const rowBytes = width * 4;
  const pixelBytes = rowBytes * height;
  const buf = new ArrayBuffer(FILE_HEADER + INFO_HEADER + pixelBytes);
  const v = new DataView(buf);
  // BITMAPFILEHEADER
  v.setUint8(0, 0x42);
  v.setUint8(1, 0x4d);
  v.setUint32(2, buf.byteLength, true);
  v.setUint32(10, FILE_HEADER + INFO_HEADER, true);
  // BITMAPV4HEADER
  const o = FILE_HEADER;
  v.setUint32(o, INFO_HEADER, true);
  v.setInt32(o + 4, width, true);
  v.setInt32(o + 8, height, true); // positive = rows from bottom to top
  v.setUint16(o + 12, 1, true); // planes
  v.setUint16(o + 14, 32, true); // bit per piksel
  v.setUint32(o + 16, 3, true); // BI_BITFIELDS
  v.setUint32(o + 20, pixelBytes, true);
  v.setInt32(o + 24, 2835, true); // 72 DPI
  v.setInt32(o + 28, 2835, true);
  v.setUint32(o + 40, 0x00ff0000, true); // mask R
  v.setUint32(o + 44, 0x0000ff00, true); // mask G
  v.setUint32(o + 48, 0x000000ff, true); // mask B
  v.setUint32(o + 52, 0xff000000, true); // mask A
  v.setUint32(o + 56, 0x73524742, true); // LCS_sRGB "sRGB"
  // Pixels (BGRA, bottom row first)
  const out = new Uint8Array(buf, FILE_HEADER + INFO_HEADER);
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * rowBytes;
    const dst = y * rowBytes;
    for (let x = 0; x < rowBytes; x += 4) {
      out[dst + x] = rgba[src + x + 2];
      out[dst + x + 1] = rgba[src + x + 1];
      out[dst + x + 2] = rgba[src + x];
      out[dst + x + 3] = rgba[src + x + 3];
    }
  }
  return buf;
}

export interface RgbaImage {
  width: number;
  height: number;
  data: Rgba;
}

/**
 * Scales down/up into a `size×size` box with a fixed ratio (the rest transparent).
 * Area averaging when shrinking (sharp for icons), bilinear when enlarging.
 */
export function fitSquare(src: RgbaImage, size: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(size * size * 4);
  const scale = Math.min(size / src.width, size / src.height);
  const w = Math.max(1, Math.round(src.width * scale));
  const h = Math.max(1, Math.round(src.height * scale));
  const ox = Math.floor((size - w) / 2);
  const oy = Math.floor((size - h) / 2);
  const sx = src.width / w;
  const sy = src.height / h;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        n = 0;
      if (sx >= 1 && sy >= 1) {
        const x0 = Math.floor(x * sx),
          x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
        const y0 = Math.floor(y * sy),
          y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
        for (let yy = y0; yy < y1 && yy < src.height; yy++)
          for (let xx = x0; xx < x1 && xx < src.width; xx++) {
            const i = (yy * src.width + xx) * 4;
            const al = src.data[i + 3];
            // Premultiplied so transparent edges do not turn dark.
            r += src.data[i] * al;
            g += src.data[i + 1] * al;
            b += src.data[i + 2] * al;
            a += al;
            n++;
          }
      } else {
        const fx = Math.min(src.width - 1, Math.max(0, (x + 0.5) * sx - 0.5));
        const fy = Math.min(src.height - 1, Math.max(0, (y + 0.5) * sy - 0.5));
        const x0 = Math.floor(fx),
          y0 = Math.floor(fy);
        const x1 = Math.min(src.width - 1, x0 + 1),
          y1 = Math.min(src.height - 1, y0 + 1);
        const dx = fx - x0,
          dy = fy - y0;
        for (const [xx, yy, wgt] of [
          [x0, y0, (1 - dx) * (1 - dy)],
          [x1, y0, dx * (1 - dy)],
          [x0, y1, (1 - dx) * dy],
          [x1, y1, dx * dy],
        ] as const) {
          const i = (yy * src.width + xx) * 4;
          const al = src.data[i + 3] * wgt;
          r += src.data[i] * al;
          g += src.data[i + 1] * al;
          b += src.data[i + 2] * al;
          a += al;
          n += wgt;
        }
      }
      const o = ((y + oy) * size + (x + ox)) * 4;
      if (a > 0) {
        out[o] = r / a;
        out[o + 1] = g / a;
        out[o + 2] = b / a;
      }
      out[o + 3] = n ? a / n : 0;
    }
  }
  return out;
}

/** Allowed ICO sizes (ICO stores 1–256 px per side). */
export const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256] as const;

/**
 * An ICO containing several sizes, each a PNG (supported on Windows Vista+ and
 * every browser). `encodePng` is injected so this module stays pure.
 */
export async function encodeIco(src: RgbaImage, sizes: number[], encodePng: (img: ImageData) => Promise<ArrayBuffer>): Promise<ArrayBuffer> {
  const list = [...new Set(sizes.filter((s) => s >= 1 && s <= 256).map(Math.round))].sort((a, b) => a - b);
  if (!list.length) list.push(32);
  const pngs: Uint8Array[] = [];
  for (const s of list) {
    const data = fitSquare(src, s);
    pngs.push(new Uint8Array(await encodePng({ data, width: s, height: s, colorSpace: "srgb" } as ImageData)));
  }
  const headerBytes = 6 + 16 * list.length;
  const total = headerBytes + pngs.reduce((n, p) => n + p.byteLength, 0);
  const buf = new ArrayBuffer(total);
  const v = new DataView(buf);
  v.setUint16(0, 0, true);
  v.setUint16(2, 1, true); // 1 = icon
  v.setUint16(4, list.length, true);
  let offset = headerBytes;
  list.forEach((s, i) => {
    const e = 6 + i * 16;
    v.setUint8(e, s >= 256 ? 0 : s);
    v.setUint8(e + 1, s >= 256 ? 0 : s);
    v.setUint8(e + 2, 0); // palet
    v.setUint8(e + 3, 0);
    v.setUint16(e + 4, 1, true); // planes
    v.setUint16(e + 6, 32, true); // bpp
    v.setUint32(e + 8, pngs[i].byteLength, true);
    v.setUint32(e + 12, offset, true);
    new Uint8Array(buf, offset, pngs[i].byteLength).set(pngs[i]);
    offset += pngs[i].byteLength;
  });
  return buf;
}
