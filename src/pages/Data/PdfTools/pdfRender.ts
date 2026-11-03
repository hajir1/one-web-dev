import { PDFDocument } from "pdf-lib";
import { DataError } from "../shared/errors";
import { parseRanges } from "./pdfLib";

/* ================================================================== */
/* Render halaman PDF ke gambar dengan pdf.js (Apache-2.0), di browser.  */
/* Dipakai untuk PDF → gambar dan kompres kuat (halaman jadi JPEG).      */
/* pdf.js dimuat dinamis agar tidak membebani halaman lain.              */
/* ================================================================== */

type PdfJs = typeof import("pdfjs-dist");
let lib: Promise<PdfJs> | null = null;

function pdfjs(): Promise<PdfJs> {
  lib ??= Promise.all([import("pdfjs-dist"), import("pdfjs-dist/build/pdf.worker.min.mjs?url")]).then(([m, w]) => {
    m.GlobalWorkerOptions.workerSrc = w.default;
    return m;
  });
  return lib;
}

/** Batas piksel per halaman supaya tab browser tidak kehabisan memori di HP. */
const MAX_PIXELS = 16_000_000;

export interface RenderOptions {
  /** DPI hasil (72 = ukuran asli PDF). */
  dpi: number;
  format: "png" | "jpeg" | "webp";
  /** 0..1 untuk JPEG/WebP. */
  quality: number;
  ranges?: string;
  signal?: AbortSignal;
  onProgress?: (done: number, total: number) => void;
}

export interface RenderedPage {
  index: number;
  blob: Blob;
  width: number;
  height: number;
  /** Ukuran halaman PDF dalam poin (untuk menyusun ulang PDF). */
  pt: { w: number; h: number };
}

const toBlob = (c: HTMLCanvasElement, type: string, q: number) =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new DataError("readFailed"))), type, q));

export async function renderPages(bytes: Uint8Array, o: RenderOptions): Promise<RenderedPage[]> {
  const m = await pdfjs();
  let doc;
  try {
    // pdf.js memindahkan buffer ke worker → kirim salinan.
    doc = await m.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise;
  } catch (e) {
    if ((e as { name?: string })?.name === "PasswordException") throw new DataError("pdfEncrypted");
    throw new DataError("pdfBroken");
  }
  try {
    const indices = parseRanges(o.ranges ?? "", doc.numPages);
    const out: RenderedPage[] = [];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    for (let k = 0; k < indices.length; k++) {
      if (o.signal?.aborted) throw new DOMException("aborted", "AbortError");
      const page = await doc.getPage(indices[k] + 1);
      const base = page.getViewport({ scale: 1 });
      let scale = o.dpi / 72;
      const px = base.width * base.height * scale * scale;
      if (px > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / px);
      const vp = page.getViewport({ scale });
      canvas.width = Math.ceil(vp.width);
      canvas.height = Math.ceil(vp.height);
      // Latar putih (PDF transparan jadi hitam di JPEG).
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
      const blob = await toBlob(canvas, `image/${o.format}`, o.quality);
      out.push({ index: indices[k], blob, width: canvas.width, height: canvas.height, pt: { w: base.width, h: base.height } });
      page.cleanup();
      o.onProgress?.(k + 1, indices.length);
    }
    canvas.width = canvas.height = 0;
    return out;
  } finally {
    void doc.destroy();
  }
}

/**
 * Kompres kuat: setiap halaman dirender ulang menjadi JPEG lalu disusun
 * jadi PDF baru. Ukuran turun drastis untuk PDF hasil scan/berisi foto,
 * tetapi teks tidak bisa dipilih/dicari lagi.
 */
export async function compressRaster(
  bytes: Uint8Array,
  level: "low" | "medium" | "high",
  signal?: AbortSignal,
  onProgress?: (done: number, total: number) => void,
): Promise<Uint8Array> {
  const preset = { low: { dpi: 150, quality: 0.8 }, medium: { dpi: 110, quality: 0.65 }, high: { dpi: 80, quality: 0.5 } }[level];
  const pages = await renderPages(bytes, { ...preset, format: "jpeg", signal, onProgress });
  const doc = await PDFDocument.create();
  for (const p of pages) {
    const img = await doc.embedJpg(new Uint8Array(await p.blob.arrayBuffer()));
    doc.addPage([p.pt.w, p.pt.h]).drawImage(img, { x: 0, y: 0, width: p.pt.w, height: p.pt.h });
  }
  return doc.save({ useObjectStreams: true });
}
