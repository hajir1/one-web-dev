// ─── converters/sizings.ts ───────────────────────────────────────────────────
// Computes the output size. Used for raster→raster, vector→raster, vector→vector.
//
// Extras: a "fit-box" mode (fit inside a W×H box, ratio kept) and
// `noUpscale`, suited to batch resizing photos of various sizes without
// enlarging small images. Invalid values (0, NaN, negative) fall back to
// the original size, and the result is clamped to the Canvas limit.

import { MAX_CANVAS_SIDE } from "./image";

export type ResizeMode = "fit-width" | "fit-height" | "fit-box" | "exact";

export interface ResizeOptions {
  enabled: boolean;
  mode: ResizeMode;
  width: number;
  height: number;
  /** Do not enlarge images smaller than the target (except in exact mode). */
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
  // Clamp to the Canvas limit with a fixed ratio.
  const over = Math.max(w / MAX_CANVAS_SIDE, h / MAX_CANVAS_SIDE, 1);
  return { width: clampSide(w / over), height: clampSide(h / over) };
}
