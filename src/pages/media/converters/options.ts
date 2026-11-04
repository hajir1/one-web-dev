// ─── converters/options.ts ───────────────────────────────────────────────────
// One options bundle for the dispatcher; each path only uses the relevant fields.

import type { ResizeOptions } from "./sizings";

interface TraceOptions {
  /** Number of colors before tracing (fewer = simpler SVG). */
  numberOfColors: number;
  /** Drop shapes smaller than N pixels (reduces noise). */
  pathomit: number;
  /** Straight line tolerance. */
  ltres: number;
  /** Toleransi kurva. */
  qtres: number;
}

const DEFAULT_TRACE_OPTIONS: TraceOptions = { numberOfColors: 8, pathomit: 8, ltres: 1, qtres: 1 };

export interface ConversionOptions {
  quality: number; // 1–100
  /** Lossless for WebP/AVIF/JPEG XL (the old name is kept). */
  losslessWebp: boolean;
  /** Sizes included in the ICO file. */
  icoSizes: number[];
  jpegBackgroundColor: string;
  resize: ResizeOptions;
  trace: TraceOptions;
  vectorBackgroundColor: string | null; // null = keep transparent
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
