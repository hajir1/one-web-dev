// ─── converters/formats.ts ───────────────────────────────────────────────────
// Format TUJUAN yang bisa dibuat converter, dan pemetaan jenis file sumber
// (hasil sniffing isi) ke kategori. Format sumber kini lebih luas dari
// tujuan: GIF/BMP/ICO/AVIF bisa dibaca browser walau tidak bisa di-encode
// Canvas (sebelumnya file ini ditolak dengan "format tidak dikenali").

import i18n from "../../../i18n";
import type { SniffedKind } from "../lib/fileSniff";

export type FormatCategory = "raster" | "vector";

export interface FormatDefinition {
  id: "png" | "jpeg" | "webp" | "avif" | "jxl" | "gif" | "bmp" | "ico" | "tiff" | "qoi" | "svg";
  label: string;
  category: FormatCategory;
  mime: string;
  ext: string;
  description: string;
  /** Mendukung transparansi. */
  alpha: boolean;
  /** Kompresi lossy (slider kualitas berlaku). */
  lossy?: boolean;
  /** Bisa lossless (opsi "Lossless"). */
  losslessOption?: boolean;
}

/** Deskripsi format dibaca saat dipakai agar mengikuti bahasa aktif. */
const fmt = (d: Omit<FormatDefinition, "description">): FormatDefinition =>
  Object.defineProperty(d as FormatDefinition, "description", { get: () => i18n.t(`media.formats.${d.id}`), enumerable: true });

/**
 * Semua format raster di-encode codec WebAssembly di Web Worker
 * (workers/codecWorker.ts), bukan canvas.toBlob — hasilnya sama di semua
 * browser (Safari kini juga bisa membuat WebP/AVIF). SVG dari raster = tracing.
 */
export const FORMATS: FormatDefinition[] = [
  fmt({ id: "webp", label: "WebP", category: "raster", mime: "image/webp", ext: "webp", alpha: true, lossy: true, losslessOption: true }),
  fmt({ id: "jpeg", label: "JPG", category: "raster", mime: "image/jpeg", ext: "jpg", alpha: false, lossy: true }),
  fmt({ id: "png", label: "PNG", category: "raster", mime: "image/png", ext: "png", alpha: true }),
  fmt({ id: "avif", label: "AVIF", category: "raster", mime: "image/avif", ext: "avif", alpha: true, lossy: true, losslessOption: true }),
  fmt({ id: "jxl", label: "JPEG XL", category: "raster", mime: "image/jxl", ext: "jxl", alpha: true, lossy: true, losslessOption: true }),
  fmt({ id: "gif", label: "GIF", category: "raster", mime: "image/gif", ext: "gif", alpha: true }),
  fmt({ id: "bmp", label: "BMP", category: "raster", mime: "image/bmp", ext: "bmp", alpha: true }),
  fmt({ id: "ico", label: "ICO", category: "raster", mime: "image/x-icon", ext: "ico", alpha: true }),
  fmt({ id: "tiff", label: "TIFF", category: "raster", mime: "image/tiff", ext: "tiff", alpha: true }),
  fmt({ id: "qoi", label: "QOI", category: "raster", mime: "image/qoi", ext: "qoi", alpha: true }),
  fmt({ id: "svg", label: "SVG", category: "vector", mime: "image/svg+xml", ext: "svg", alpha: true }),
];

export type TargetId = FormatDefinition["id"] | "same";

export function getFormat(id: FormatDefinition["id"]): FormatDefinition {
  const f = FORMATS.find((x) => x.id === id);
  if (!f) throw new Error(i18n.t("media.formats.unknown", { id }));
  return f;
}

/** Jenis sumber yang bisa dikonversi. */
export const SOURCE_KINDS: SniffedKind[] = ["png", "jpeg", "webp", "gif", "bmp", "ico", "avif", "tiff", "jxl", "qoi", "svg"];

/** Sumber yang di-decode codec WASM di worker (browser tidak bisa membacanya). */
export const WORKER_DECODED: SniffedKind[] = ["tiff", "jxl", "qoi"];

export const sourceCategory = (k: SniffedKind): FormatCategory => (k === "svg" ? "vector" : "raster");

/**
 * Format tujuan sebenarnya untuk satu file. "same" = format asli (kompresi
 * ulang); format sumber yang tidak bisa dibuat (mis. HEIC) → PNG.
 */
export function resolveTarget(target: TargetId, kind: SniffedKind): FormatDefinition {
  if (target !== "same") return getFormat(target);
  const same = FORMATS.find((f) => f.id === kind);
  return same ?? getFormat("png");
}
