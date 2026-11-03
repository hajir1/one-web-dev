// ─── converters/options.ts ───────────────────────────────────────────────────
// Satu bundle opsi untuk dispatcher; tiap jalur hanya memakai field yang relevan.

import type { ResizeOptions } from "./sizings";

interface TraceOptions {
  /** Jumlah warna sebelum tracing (sedikit = SVG lebih sederhana). */
  numberOfColors: number;
  /** Buang bentuk lebih kecil dari N piksel (kurangi noise). */
  pathomit: number;
  /** Toleransi garis lurus. */
  ltres: number;
  /** Toleransi kurva. */
  qtres: number;
}

const DEFAULT_TRACE_OPTIONS: TraceOptions = { numberOfColors: 8, pathomit: 8, ltres: 1, qtres: 1 };

export interface ConversionOptions {
  quality: number; // 1–100
  /** Lossless untuk WebP/AVIF/JPEG XL (nama lama dipertahankan). */
  losslessWebp: boolean;
  /** Ukuran yang dimasukkan ke berkas ICO. */
  icoSizes: number[];
  jpegBackgroundColor: string;
  resize: ResizeOptions;
  trace: TraceOptions;
  vectorBackgroundColor: string | null; // null = tetap transparan
}

export const DEFAULT_CONVERSION_OPTIONS: ConversionOptions = {
  quality: 80,
  losslessWebp: false,
  icoSizes: [16, 32, 48, 256],
  jpegBackgroundColor: "#ffffff",
  resize: { enabled: false, mode: "fit-box", width: 1920, height: 1080, noUpscale: true },
  trace: DEFAULT_TRACE_OPTIONS,
  vectorBackgroundColor: null,
};
