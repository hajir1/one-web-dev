import { PDFDocument, degrees } from "pdf-lib";
import { DataError } from "../shared/errors";

/* ================================================================== */
/* PDF tools (v10) — pure pdf-lib (MIT) logic, runs in the browser.      */
/* No files are sent to a server. Rendering pages to images             */
/* (PDF → images, strong compression) lives in pdfRender.ts (pdf.js).    */
/* ================================================================== */

import { MAX_IMAGES } from "./pdfLimits";

const isPdf = (b: Uint8Array) => b.length > 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46; // %PDF

/** Opens a PDF; friendly errors when it is not a PDF, is corrupt, or is password-locked. */
export async function loadPdf(bytes: Uint8Array): Promise<PDFDocument> {
  if (!isPdf(bytes)) throw new DataError("notPdf");
  try {
    const doc = await PDFDocument.load(bytes, { updateMetadata: false });
    // pdf-lib sometimes does not throw for corrupt files; check its page tree.
    if (doc.getPageCount() < 1) throw new Error("no pages");
    return doc;
  } catch (e) {
    if (/encrypt/i.test(String((e as Error)?.message ?? e))) throw new DataError("pdfEncrypted");
    throw new DataError("pdfBroken");
  }
}

/**
 * "1-3, 5, 8-" → 0-based page indexes (order kept, no duplicates).
 * Empty = every page. Error when outside 1..total.
 */
export function parseRanges(input: string, total: number): number[] {
  const s = input.replace(/\s+/g, "");
  if (!s) return Array.from({ length: total }, (_, i) => i);
  const out: number[] = [];
  const seen = new Set<number>();
  for (const part of s.split(/[,;]/)) {
    if (!part) continue;
    const m = /^(\d+)?(-)?(\d+)?$/.exec(part);
    if (!m || (!m[1] && !m[3])) throw new DataError("pdfRange", { part });
    const a = m[1] ? Number(m[1]) : 1;
    const b = m[2] ? (m[3] ? Number(m[3]) : total) : a;
    if (a < 1 || b < 1 || a > total || b > total) throw new DataError("pdfRangeOut", { part, total });
    const step = a <= b ? 1 : -1;
    for (let p = a; p !== b + step; p += step) {
      if (!seen.has(p - 1)) {
        seen.add(p - 1);
        out.push(p - 1);
      }
    }
  }
  if (!out.length) throw new DataError("pdfRange", { part: input });
  return out;
}

async function copyInto(target: PDFDocument, src: PDFDocument, indices: number[], rotate = 0) {
  const pages = await target.copyPages(src, indices);
  for (const p of pages) {
    if (rotate) p.setRotation(degrees((p.getRotation().angle + rotate + 360) % 360));
    target.addPage(p);
  }
}

const save = (doc: PDFDocument) => doc.save({ useObjectStreams: true });

/** Merge several PDFs in order. */
export async function mergePdfs(files: Uint8Array[]): Promise<Uint8Array> {
  if (files.length < 2) throw new DataError("pdfNeedTwo");
  const out = await PDFDocument.create();
  for (const f of files) {
    const src = await loadPdf(f);
    await copyInto(out, src, src.getPageIndices());
  }
  return save(out);
}

/** Extracts specific pages into a new PDF. */
export async function extractPages(bytes: Uint8Array, ranges: string): Promise<Uint8Array> {
  const src = await loadPdf(bytes);
  const out = await PDFDocument.create();
  await copyInto(out, src, parseRanges(ranges, src.getPageCount()));
  return save(out);
}

/** Split: one PDF per page (or per group of N pages). */
export async function splitPdf(bytes: Uint8Array, every = 1): Promise<Uint8Array[]> {
  const src = await loadPdf(bytes);
  const n = src.getPageCount();
  const size = Math.max(1, Math.floor(every));
  const parts: Uint8Array[] = [];
  for (let i = 0; i < n; i += size) {
    const out = await PDFDocument.create();
    await copyInto(out, src, Array.from({ length: Math.min(size, n - i) }, (_, k) => i + k));
    parts.push(await save(out));
  }
  return parts;
}

/** Delete specific pages. */
export async function deletePages(bytes: Uint8Array, ranges: string): Promise<Uint8Array> {
  const src = await loadPdf(bytes);
  const drop = new Set(parseRanges(ranges, src.getPageCount()));
  const keep = src.getPageIndices().filter((i) => !drop.has(i));
  if (!keep.length) throw new DataError("pdfDeleteAll");
  const out = await PDFDocument.create();
  await copyInto(out, src, keep);
  return save(out);
}

/** Rotates pages (all or a range) 90/180/270 degrees clockwise. */
export async function rotatePages(bytes: Uint8Array, angle: 90 | 180 | 270, ranges = ""): Promise<Uint8Array> {
  const doc = await loadPdf(bytes);
  for (const i of parseRanges(ranges, doc.getPageCount())) {
    const p = doc.getPage(i);
    p.setRotation(degrees((p.getRotation().angle + angle) % 360));
  }
  return save(doc);
}

/** Reorders pages in a new order, e.g. "3,1,2". Pages not listed are dropped. */
export async function reorderPages(bytes: Uint8Array, order: string): Promise<Uint8Array> {
  return extractPages(bytes, order);
}

/**
 * Light compression: rewrites the PDF structure (object streams, drops orphan
 * objects, removes metadata). Content & text stay the same; savings vary.
 */
export async function compressLossless(bytes: Uint8Array, stripMetadata = true): Promise<Uint8Array> {
  const src = await loadPdf(bytes);
  const out = await PDFDocument.create();
  await copyInto(out, src, src.getPageIndices());
  if (!stripMetadata) {
    out.setTitle(src.getTitle() ?? "");
    out.setAuthor(src.getAuthor() ?? "");
  }
  out.setProducer("");
  out.setCreator("");
  return save(out);
}

export type PageSize = "fit" | "a4" | "letter";
const SIZES = { a4: [595.28, 841.89], letter: [612, 792] } as const;

export interface ImageInput {
  bytes: Uint8Array;
  type: "png" | "jpg";
  width: number;
  height: number;
}

/** Images (JPG/PNG) → one PDF, one image per page. */
export async function imagesToPdf(images: ImageInput[], size: PageSize = "fit", margin = 0): Promise<Uint8Array> {
  if (!images.length) throw new DataError("noFile");
  if (images.length > MAX_IMAGES) throw new DataError("tooManyFiles", { max: MAX_IMAGES });
  const doc = await PDFDocument.create();
  for (const img of images) {
    const emb = img.type === "png" ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes);
    const iw = emb.width;
    const ih = emb.height;
    let pw: number = iw + margin * 2;
    let ph: number = ih + margin * 2;
    if (size !== "fit") {
      const [w, h] = SIZES[size];
      // Page orientation follows the image.
      [pw, ph] = iw > ih ? [h, w] : [w, h];
    }
    const scale = Math.min((pw - margin * 2) / iw, (ph - margin * 2) / ih, size === "fit" ? 1 : Infinity);
    const w = iw * scale;
    const h = ih * scale;
    doc.addPage([pw, ph]).drawImage(emb, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
  }
  return save(doc);
}

/** Short PDF info for display. */
export async function pdfInfo(bytes: Uint8Array): Promise<{ pages: number; title?: string }> {
  const d = await loadPdf(bytes);
  return { pages: d.getPageCount(), title: d.getTitle() || undefined };
}
