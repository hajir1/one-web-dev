import { DataError } from "../shared/errors";
import type { DataServerFeatureId } from "../../media/processing/pricing";

/* ================================================================== */
/* File validation & input estimate for Server Convert (without uploading). */
/* ================================================================== */

export type ServerOutput = "json" | "xlsx" | "csv" | "zip";

export const SERVER_INPUT: Record<DataServerFeatureId, { ext: RegExp; accept: string; outputs: ServerOutput[] }> = {
  "data-legacy-sheet": { ext: /\.(xls|ods|xlsb)$/i, accept: ".xls,.ods,.xlsb", outputs: ["json", "xlsx", "csv"] },
  "data-pdf-table": { ext: /\.pdf$/i, accept: ".pdf,application/pdf", outputs: ["json", "xlsx", "csv"] },
  // v7 (P8): OCR for scanned PDFs → a ZIP with a searchable PDF + .txt.
  "data-pdf-ocr": { ext: /\.pdf$/i, accept: ".pdf,application/pdf", outputs: ["zip"] },
};

export const isPdfFeature = (f: DataServerFeatureId) => f === "data-pdf-table" || f === "data-pdf-ocr";
/** OCR languages supported by the server (Tesseract). */
export const OCR_LANGS = ["ind+eng", "ind", "eng"] as const;
export type OcrLang = (typeof OCR_LANGS)[number];
/** OCR page limit per file (same as OCR_MAX_PAGES in the Python service). */
export const OCR_MAX_PAGES = 100;

/** File signatures (magic bytes) so files with the wrong extension are rejected before sending. */
export function checkSignature(feature: DataServerFeatureId, head: Uint8Array, name: string): void {
  const hex = Array.from(head.slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
  if (isPdfFeature(feature)) {
    if (!hex.startsWith("25504446")) throw new DataError("notPdf"); // %PDF
    return;
  }
  const ext = name.split(".").pop()?.toLowerCase();
  const ole = hex.startsWith("d0cf11e0a1b11ae1"); // .xls (OLE2)
  const zip = hex.startsWith("504b"); // .ods / .xlsb (ZIP)
  if ((ext === "xls" && !ole) || ((ext === "ods" || ext === "xlsb") && !zip)) throw new DataError("badSignature", { ext: ext ?? "" });
}

/**
 * Estimates the PDF page count from /Type /Page objects (no PDF parser).
 * Only for cost ESTIMATES; the official count is computed by the server. null = unknown.
 */
export function estimatePdfPages(bytes: Uint8Array): number | null {
  let text = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) text += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  const pages = text.match(/\/Type\s*\/Page(?![a-zA-Z])/g)?.length ?? 0;
  if (pages > 0) return pages;
  // PDFs with compressed object streams: take the largest /Count from /Pages.
  const counts = [...text.matchAll(/\/Count\s+(\d+)/g)].map((m) => Number(m[1]));
  return counts.length ? Math.max(...counts) : null;
}
