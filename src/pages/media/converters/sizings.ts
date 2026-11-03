// ─── converters/sizings.ts ───────────────────────────────────────────────────
// Hitung ukuran hasil. Dipakai raster→raster, vektor→raster, vektor→vektor.
//
// Tambahan: mode "fit-box" (muat di dalam kotak L×T, rasio terjaga) dan
// `noUpscale` — cocok untuk resize batch foto berbagai ukuran tanpa
// memperbesar gambar kecil. Nilai tidak valid (0, NaN, negatif) jatuh ke
// ukuran asli, dan hasil dijepit ke batas Canvas.

import { MAX_CANVAS_SIDE } from "./image";

export type ResizeMode = "fit-width" | "fit-height" | "fit-box" | "exact";

export interface ResizeOptions {
  enabled: boolean;
  mode: ResizeMode;
  width: number;
  height: number;
  /** Jangan perbesar gambar yang lebih kecil dari target (kecuali mode exact). */
  noUpscale?: boolean;
}

const valid = (n: number) => Number.isFinite(n) && n > 0;
const clampSide = (n: number) => Math.max(1, Math.min(MAX_CANVAS_SIDE, Math.round(n)));

export function computeOutputSize(naturalWidth: number, naturalHeight: number, resize: ResizeOptions): { width: number; height: number } {
  const nw = valid(naturalWidth) ? naturalWidth : 1;
  const nh = valid(naturalHeight) ? naturalHeight : 1;
  if (!resize.enabled) return { width: clampSide(nw), height: clampSide(nh) };

  const ratio = nw / nh;
  const tw = valid(resize.width) ? resize.width : nw;
  const th = valid(resize.height) ? resize.height : nh;

  let w: number;
  let h: number;
  switch (resize.mode) {
    case "fit-width":
      w = tw;
      h = tw / ratio;
      break;
    case "fit-height":
      h = th;
      w = th * ratio;
      break;
    case "fit-box": {
      const s = Math.min(tw / nw, th / nh);
      w = nw * s;
      h = nh * s;
      break;
    }
    case "exact":
    default:
      return { width: clampSide(tw), height: clampSide(th) };
  }
  if (resize.noUpscale && (w > nw || h > nh)) {
    w = nw;
    h = nh;
  }
  // Jepit ke batas Canvas dengan rasio tetap.
  const over = Math.max(w / MAX_CANVAS_SIDE, h / MAX_CANVAS_SIDE, 1);
  return { width: clampSide(w / over), height: clampSide(h / over) };
}
