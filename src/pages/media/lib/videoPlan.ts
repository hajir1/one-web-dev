// ─── lib/videoPlan.ts ────────────────────────────────────────────────────────
// Timing plan for extracted frames. Pure functions → easy to test.
//
// Old-version bugs handled here:
// - Infinity/NaN durations (common in WebM from MediaRecorder) caused endless
//   loops. Now rejected with a clear message (and lib/video.ts
//   tries to fix its duration first).
// - No frame count limit: a 10-minute video × 60 fps = 36,000 frames in
//   memory → the tab crashed. Now it is capped at MAX_FRAMES and the user is told.

import i18n from "../../../i18n";

export const MAX_FRAMES = 600;

export type FramePlanMode =
  | { kind: "fps"; fps: number }
  | { kind: "interval"; seconds: number }
  | { kind: "count"; count: number };

export interface FramePlanInput {
  duration: number;
  mode: FramePlanMode;
  /** Range (seconds). Default is the whole video. */
  start?: number;
  end?: number;
  maxFrames?: number;
}

export interface FramePlan {
  times: number[];
  /** Number of frames requested before capping. */
  requested: number;
  truncated: boolean;
  error?: string;
}

const EPS = 0.001;

export function planFrames({ duration, mode, start = 0, end, maxFrames = MAX_FRAMES }: FramePlanInput): FramePlan {
  if (!Number.isFinite(duration) || duration <= 0)
    return { times: [], requested: 0, truncated: false, error: i18n.t("media.video.noDuration") };
  const s = Math.max(0, Math.min(start, duration));
  const e = Math.max(s, Math.min(end ?? duration, duration));
  const span = e - s;
  const last = Math.max(0, duration - EPS);

  let times: number[] = [];
  let requested: number;
  if (mode.kind === "count") {
    const n = Math.max(1, Math.floor(mode.count));
    requested = n;
    const take = Math.min(n, maxFrames);
    // Spread evenly, including the start; the last point is not exactly at the end (often a black frame).
    for (let i = 0; i < take; i++) times.push(Math.min(last, s + (span * i) / Math.max(1, take)));
  } else {
    const step = mode.kind === "fps" ? 1 / Math.max(0.01, mode.fps) : Math.max(0.01, mode.seconds);
    // Frames at s, s+step, … while still < e. A 0 range → one frame.
    requested = span === 0 ? 1 : Math.max(1, Math.ceil(span / step - EPS));
    const take = Math.min(requested, maxFrames);
    for (let i = 0; i < take; i++) times.push(Math.min(last, s + i * step));
  }
  // Drop duplicates (e.g. a very short range).
  times = times.filter((t, i) => i === 0 || t - times[i - 1] > EPS / 2);
  return { times, requested, truncated: requested > times.length };
}

/** 4-digit frame number + time, for file names that sort in a file manager. */
export function frameFileName(base: string, index: number, timeSec: number, ext: string): string {
  const ms = Math.round(timeSec * 1000);
  return `${base}-frame-${String(index).padStart(4, "0")}-${String(ms).padStart(7, "0")}ms.${ext}`;
}
