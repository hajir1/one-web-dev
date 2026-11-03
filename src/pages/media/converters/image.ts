// ─── converters/image.ts ─────────────────────────────────────────────────────
// Utilitas bersama: decode gambar, batas ukuran Canvas, dan encode yang
// DIVERIFIKASI. Sebelumnya, browser yang tidak bisa meng-encode WebP (mis.
// Safari lama) diam-diam mengembalikan PNG dan file diberi ekstensi .webp.

import i18n from "../../../i18n";

const MAX_INPUT_PIXELS = 50_000_000;
/** Sisi maksimum Canvas yang aman lintas browser. */
export const MAX_CANVAS_SIDE = 16_384;
/** Luas Canvas yang aman di Safari/iOS. Di atas ini masih mungkin berhasil di desktop. */
export const SAFE_CANVAS_PIXELS = 16_777_216;

class ImageTooLargeError extends Error {}

export interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

const abortError = () => new DOMException(i18n.t("media.errors.aborted"), "AbortError");

export function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw abortError();
}

/** Decode file gambar raster (orientasi EXIF diterapkan oleh browser). */
export async function decodeImage(file: Blob, signal?: AbortSignal): Promise<DecodedImage> {
  throwIfAborted(signal);
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
      throwIfAborted(signal);
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch (e) {
      if ((e as Error)?.name === "AbortError") throw e;
      // Lanjut ke <img> (mis. ICO/SVG/format yang tidak didukung createImageBitmap).
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(i18n.t("media.convert.unreadable")));
      signal?.addEventListener("abort", () => reject(abortError()), { once: true });
    });
    if (!img.naturalWidth || !img.naturalHeight) throw new Error(i18n.t("media.convert.invalidSize"));
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
  } finally {
    // Data piksel sudah ter-decode; URL tidak dibutuhkan lagi.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export function assertInputSize(w: number, h: number) {
  if (w * h > MAX_INPUT_PIXELS)
    throw new ImageTooLargeError(i18n.t("media.convert.inputTooLarge", { w, h, mp: (w * h / 1e6).toFixed(1), max: MAX_INPUT_PIXELS / 1e6 }));
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  if (width > MAX_CANVAS_SIDE || height > MAX_CANVAS_SIDE)
    throw new ImageTooLargeError(i18n.t("media.convert.outputTooLarge", { width, height, max: MAX_CANVAS_SIDE }));
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

export function context2d(canvas: HTMLCanvasElement, opts?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d", opts);
  if (!ctx) throw new ImageTooLargeError(i18n.t("media.convert.canvasRefused"));
  return ctx;
}

/** Bebaskan memori Canvas besar segera (penting di Safari). */
export function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0;
  canvas.height = 0;
}

/** canvas.toBlob yang memastikan format hasil benar-benar sesuai permintaan. */
export function encodeCanvas(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.size === 0) {
          reject(new ImageTooLargeError(i18n.t("media.convert.encodeFailed")));
          return;
        }
        if (blob.type && blob.type !== mime) {
          reject(new Error(i18n.t("media.convert.encodeUnsupported", { format: mime.replace("image/", "").toUpperCase() })));
          return;
        }
        resolve(blob);
      },
      mime,
      quality,
    );
  });
}

const encodeSupport = new Map<string, boolean>();

/** Apakah browser ini bisa meng-encode `mime` lewat Canvas? (hasil di-cache) */
export async function canEncode(mime: string): Promise<boolean> {
  if (encodeSupport.has(mime)) return encodeSupport.get(mime)!;
  let ok: boolean;
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 2;
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, mime));
    ok = !!blob && blob.type === mime;
  } catch {
    ok = false;
  }
  encodeSupport.set(mime, ok);
  return ok;
}
