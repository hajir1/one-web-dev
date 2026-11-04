// ─── workers/codecWorker.ts ──────────────────────────────────────────────────
// WebAssembly-based image encoders/decoders, run in a Web Worker so
// the UI does not freeze. Each codec is loaded (dynamic import) ONLY on first
// use, so the initial bundle does not grow: opening the converter page does not
// downloading any codec until a file is processed.
//
// Codecs (all permissively licensed, safe for commercial products):
// - PNG  : @jsquash/png  (Rust `png` crate)            Apache-2.0 / MIT
// - JPEG : @jsquash/jpeg (MozJPEG)                      Apache-2.0 / IJG + BSD
// - WebP : @jsquash/webp (libwebp)                      Apache-2.0 / BSD-3
// - AVIF : @jsquash/avif (libavif + libaom)             Apache-2.0 / BSD-2
// - JXL  : @jsquash/jxl  (libjxl)                       Apache-2.0 / BSD-3
// - QOI  : @jsquash/qoi                                 Apache-2.0 / MIT
// - TIFF : utif2 (JS)                                   MIT
// - GIF  : gifenc (JS)                                  MIT
// - BMP & ICO: written in-house (lib/imageFormats.ts)

import { encodeBmp, encodeIco } from "../lib/imageFormats";

export type EncodeFormat = "png" | "jpeg" | "webp" | "avif" | "jxl" | "qoi" | "gif" | "bmp" | "ico" | "tiff";
export type DecodeFormat = "jxl" | "qoi" | "tiff" | "avif" | "webp" | "png" | "jpeg";

export interface CodecEncodeOptions {
  /** 1–100 (JPEG/WebP/AVIF/JXL). */
  quality: number;
  /** WebP/AVIF/JXL without lossy compression. */
  lossless: boolean;
  /** Icon sizes for ICO (square). */
  icoSizes?: number[];
}

export type CodecRequest =
  | { id: number; op: "encode"; format: EncodeFormat; width: number; height: number; data: Uint8ClampedArray; options: CodecEncodeOptions }
  | { id: number; op: "decode"; format: DecodeFormat; bytes: ArrayBuffer };

export type CodecResponse =
  | { id: number; ok: true; bytes?: ArrayBuffer; image?: { width: number; height: number; data: Uint8ClampedArray } }
  | { id: number; ok: false; error: string };

const img = (data: Uint8ClampedArray, width: number, height: number): ImageData =>
  typeof ImageData !== "undefined" ? new ImageData(data as Uint8ClampedArray<ArrayBuffer>, width, height) : ({ data, width, height, colorSpace: "srgb" } as ImageData);

const q = (v: number) => Math.min(100, Math.max(1, Math.round(v)));

async function encode(format: EncodeFormat, image: ImageData, o: CodecEncodeOptions): Promise<ArrayBuffer> {
  switch (format) {
    case "png": {
      const { default: enc } = await import("@jsquash/png/encode.js");
      return enc(image);
    }
    case "jpeg": {
      const { default: enc } = await import("@jsquash/jpeg/encode.js");
      return enc(image, { quality: q(o.quality), progressive: true, optimize_coding: true });
    }
    case "webp": {
      const { default: enc } = await import("@jsquash/webp/encode.js");
      return enc(image, o.lossless ? { lossless: 1, quality: 100, exact: 1 } : { quality: q(o.quality) });
    }
    case "avif": {
      const { default: enc } = await import("@jsquash/avif/encode.js");
      return enc(image, o.lossless ? { lossless: true } : { quality: q(o.quality), speed: 6 });
    }
    case "jxl": {
      const { default: enc } = await import("@jsquash/jxl/encode.js");
      return enc(image, o.lossless ? { lossless: true } : { quality: q(o.quality), effort: 7 });
    }
    case "qoi": {
      const { default: enc } = await import("@jsquash/qoi/encode.js");
      return enc(image);
    }
    case "tiff": {
      const UTIF = (await import("utif2")).default;
      return UTIF.encodeImage(new Uint8Array(image.data.buffer, image.data.byteOffset, image.data.byteLength), image.width, image.height);
    }
    case "gif": {
      const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
      const rgba = new Uint8Array(image.data.buffer, image.data.byteOffset, image.data.byteLength);
      // 256-color palette; transparent pixels (alpha < 128) use the transparent index.
      const palette = quantize(rgba, 256, { format: "rgba4444", oneBitAlpha: true });
      const index = applyPalette(rgba, palette, "rgba4444");
      const tIndex = palette.findIndex((c) => c[3] === 0);
      const gif = GIFEncoder();
      gif.writeFrame(index, image.width, image.height, { palette, ...(tIndex >= 0 ? { transparent: true, transparentIndex: tIndex } : {}) });
      gif.finish();
      const out = gif.bytes();
      return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) as ArrayBuffer;
    }
    case "bmp":
      return encodeBmp(image.data, image.width, image.height);
    case "ico": {
      const { default: enc } = await import("@jsquash/png/encode.js");
      return encodeIco(image, o.icoSizes?.length ? o.icoSizes : [16, 32, 48, 256], (d) => enc(d));
    }
  }
}

async function decode(format: DecodeFormat, bytes: ArrayBuffer): Promise<ImageData> {
  switch (format) {
    case "jxl":
      return (await import("@jsquash/jxl/decode.js")).default(bytes);
    case "qoi":
      return (await import("@jsquash/qoi/decode.js")).default(bytes);
    case "avif": {
      const r = await (await import("@jsquash/avif/decode.js")).default(bytes);
      if (!r) throw new Error("AVIF");
      return r as ImageData;
    }
    case "webp":
      return (await import("@jsquash/webp/decode.js")).default(bytes);
    case "png":
      return (await import("@jsquash/png/decode.js")).default(bytes);
    case "jpeg":
      return (await import("@jsquash/jpeg/decode.js")).default(bytes);
    case "tiff": {
      const UTIF = (await import("utif2")).default;
      const ifds = UTIF.decode(bytes);
      // The first page with an image (TIFF can contain thumbnails/other pages).
      const page = ifds.find((f) => Number((f.t256 as number[] | undefined)?.[0]) > 0) ?? ifds[0];
      if (!page) throw new Error("TIFF");
      UTIF.decodeImage(bytes, page);
      const rgba = UTIF.toRGBA8(page);
      const w = Number(page.width);
      const h = Number(page.height);
      return img(new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, w * h * 4), w, h);
    }
  }
}

const post = (msg: CodecResponse, transfer: Transferable[] = []) => (self as unknown as Worker).postMessage(msg, transfer);

self.onmessage = async (e: MessageEvent<CodecRequest>) => {
  const msg = e.data;
  try {
    if (msg.op === "encode") {
      const bytes = await encode(msg.format, img(msg.data, msg.width, msg.height), msg.options);
      post({ id: msg.id, ok: true, bytes }, [bytes]);
    } else {
      const out = await decode(msg.format, msg.bytes);
      const data = new Uint8ClampedArray(out.data);
      post({ id: msg.id, ok: true, image: { width: out.width, height: out.height, data } }, [data.buffer]);
    }
  } catch (err) {
    post({ id: msg.id, ok: false, error: err instanceof Error ? err.message || err.name : String(err) });
  }
};
