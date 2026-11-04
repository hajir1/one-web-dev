import { PDFDocument } from "pdf-lib";
import { DataError } from "../shared/errors";
import { parseRanges } from "./pdfLib";

/* ================================================================== */
/* Renders PDF pages to images with pdf.js (Apache-2.0), in the browser. */
/* Used for PDF → images and strong compression (pages become JPEG).    */
/* pdf.js loads dynamically so it does not weigh down other pages.      */
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

/** Pixel limit per page so the browser tab does not run out of memory on phones. */
const MAX_PIXELS = 16_000_000;

export interface RenderOptions {
  /** Output DPI (72 = the PDF's original size). */
  dpi: number;
  format: "png" | "jpeg" | "webp";
  /** 0..1 for JPEG/WebP. */
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
  /** PDF page size in points (for rebuilding the PDF). */
  pt: { w: number; h: number };
}

const toBlob = (c: HTMLCanvasElement, type: string, q: number) =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new DataError("readFailed"))), type, q));

export async function renderPages(bytes: Uint8Array, o: RenderOptions): Promise<RenderedPage[]> {
  const m = await pdfjs();
  let doc;
  try {
    // pdf.js transfers the buffer to the worker → send a copy.
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
      // White background (transparent PDFs turn black in JPEG).
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
 * Strong compression: each page is re-rendered as JPEG and assembled
 * into a new PDF. Size drops sharply for scanned/photo PDFs,
 * but text can no longer be selected/searched.
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
