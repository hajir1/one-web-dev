import { DataError } from "../shared/errors";
import type { DataServerFeatureId } from "../../media/processing/pricing";

/* ================================================================== */
/* Validasi file & perkiraan input untuk Konversi Server (tanpa upload). */
/* ================================================================== */

export type ServerOutput = "json" | "xlsx" | "csv" | "zip";

export const SERVER_INPUT: Record<DataServerFeatureId, { ext: RegExp; accept: string; outputs: ServerOutput[] }> = {
  "data-legacy-sheet": { ext: /\.(xls|ods|xlsb)$/i, accept: ".xls,.ods,.xlsb", outputs: ["json", "xlsx", "csv"] },
  "data-pdf-table": { ext: /\.pdf$/i, accept: ".pdf,application/pdf", outputs: ["json", "xlsx", "csv"] },
  // v7 (P8): OCR PDF hasil scan → ZIP berisi PDF yang bisa dicari + .txt.
  "data-pdf-ocr": { ext: /\.pdf$/i, accept: ".pdf,application/pdf", outputs: ["zip"] },
};

export const isPdfFeature = (f: DataServerFeatureId) => f === "data-pdf-table" || f === "data-pdf-ocr";
/** Bahasa OCR yang didukung server (Tesseract). */
export const OCR_LANGS = ["ind+eng", "ind", "eng"] as const;
export type OcrLang = (typeof OCR_LANGS)[number];
/** Batas halaman OCR per berkas (sama dengan OCR_MAX_PAGES di layanan Python). */
export const OCR_MAX_PAGES = 100;

/** Tanda tangan file (magic bytes) agar file salah ekstensi ditolak sebelum dikirim. */
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
 * Perkiraan jumlah halaman PDF dari objek /Type /Page (tanpa parser PDF).
 * Hanya untuk ESTIMASI biaya; jumlah resmi dihitung server. null = tidak diketahui.
 */
export function estimatePdfPages(bytes: Uint8Array): number | null {
  let text = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) text += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  const pages = text.match(/\/Type\s*\/Page(?![a-zA-Z])/g)?.length ?? 0;
  if (pages > 0) return pages;
  // PDF dengan object stream terkompresi: ambil /Count terbesar dari /Pages.
  const counts = [...text.matchAll(/\/Count\s+(\d+)/g)].map((m) => Number(m[1]));
  return counts.length ? Math.max(...counts) : null;
}
