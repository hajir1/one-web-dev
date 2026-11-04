// ─── converters/formats.ts ───────────────────────────────────────────────────
// TARGET formats the converter can create, and the mapping of source file kinds
// (from content sniffing) to categories. Source formats are now broader than
// targets: GIF/BMP/ICO/AVIF can be read by the browser even though Canvas cannot
// encode them (previously these files were rejected with "unrecognized format").

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
  /** Can be lossless (the "Lossless" option). */
  losslessOption?: boolean;
}

/** Format descriptions are read at use time so they follow the active language. */
const fmt = (d: Omit<FormatDefinition, "description">): FormatDefinition =>
  Object.defineProperty(d as FormatDefinition, "description", { get: () => i18n.t(`media.formats.${d.id}`), enumerable: true });

/**
 * Every raster format is encoded by a WebAssembly codec in a Web Worker
 * (workers/codecWorker.ts), not canvas.toBlob, so the output is identical in every
 * browser (Safari can now create WebP/AVIF too). SVG from raster = tracing.
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

/** Source kinds that can be converted. */
export const SOURCE_KINDS: SniffedKind[] = ["png", "jpeg", "webp", "gif", "bmp", "ico", "avif", "tiff", "jxl", "qoi", "svg"];

/** Sources decoded by the WASM codec in the worker (the browser cannot read them). */
export const WORKER_DECODED: SniffedKind[] = ["tiff", "jxl", "qoi"];

export const sourceCategory = (k: SniffedKind): FormatCategory => (k === "svg" ? "vector" : "raster");

/**
 * The actual target format for one file. "same" = the original format (re-
 * compression); source formats that cannot be created (e.g. HEIC) → PNG.
 */
export function resolveTarget(target: TargetId, kind: SniffedKind): FormatDefinition {
  if (target !== "same") return getFormat(target);
  const same = FORMATS.find((f) => f.id === kind);
  return same ?? getFormat("png");
}
