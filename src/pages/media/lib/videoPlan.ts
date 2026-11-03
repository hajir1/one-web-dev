// ─── lib/videoPlan.ts ────────────────────────────────────────────────────────
// Rencana waktu frame yang diekstrak. Fungsi murni → mudah diuji.
//
// Bug versi lama yang ditangani di sini:
// - Durasi Infinity/NaN (umum pada WebM hasil MediaRecorder) membuat loop
//   tak berujung. Sekarang ditolak dengan pesan jelas (dan lib/video.ts
//   mencoba memperbaiki durasinya lebih dulu).
// - Tanpa batas jumlah frame: video 10 menit × 60 fps = 36.000 frame di
//   memori → tab crash. Sekarang dibatasi MAX_FRAMES dan pengguna diberi tahu.

import i18n from "../../../i18n";

export const MAX_FRAMES = 600;

export type FramePlanMode =
  | { kind: "fps"; fps: number }
  | { kind: "interval"; seconds: number }
  | { kind: "count"; count: number };

export interface FramePlanInput {
  duration: number;
  mode: FramePlanMode;
  /** Rentang (detik). Default seluruh video. */
  start?: number;
  end?: number;
  maxFrames?: number;
}

export interface FramePlan {
  times: number[];
  /** Jumlah frame yang diminta sebelum dibatasi. */
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
    // Sebar merata, termasuk awal; titik terakhir tidak tepat di ujung (sering frame hitam).
    for (let i = 0; i < take; i++) times.push(Math.min(last, s + (span * i) / Math.max(1, take)));
  } else {
    const step = mode.kind === "fps" ? 1 / Math.max(0.01, mode.fps) : Math.max(0.01, mode.seconds);
    // Frame di s, s+step, … selama masih < e. Rentang 0 → satu frame.
    requested = span === 0 ? 1 : Math.max(1, Math.ceil(span / step - EPS));
    const take = Math.min(requested, maxFrames);
    for (let i = 0; i < take; i++) times.push(Math.min(last, s + i * step));
  }
  // Buang duplikat (mis. rentang sangat pendek).
  times = times.filter((t, i) => i === 0 || t - times[i - 1] > EPS / 2);
  return { times, requested, truncated: requested > times.length };
}

/** Nomor frame 4 digit + waktu, untuk nama file yang urut di file manager. */
export function frameFileName(base: string, index: number, timeSec: number, ext: string): string {
  const ms = Math.round(timeSec * 1000);
  return `${base}-frame-${String(index).padStart(4, "0")}-${String(ms).padStart(7, "0")}ms.${ext}`;
}
