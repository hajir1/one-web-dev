// ─── lib/serverPlans.ts ──────────────────────────────────────────────────────
// Validasi & ringkasan parameter untuk fitur yang diproses di server.
// Fungsi murni (diuji di Node). Backend WAJIB memvalidasi ulang.

import i18n from "../../../i18n";

const GIF_MIN_SPAN = 0.5;

export function gifPlan(o: { duration: number; srcW: number; srcH: number; start: number; end: number; fps: number; width: number; maxSeconds: number }) {
  const span = Math.max(0, Math.min(o.end, o.duration) - Math.max(0, o.start));
  const width = o.srcW > 0 ? Math.min(o.width, o.srcW) : o.width;
  const height = o.srcW > 0 ? Math.max(2, Math.round(((o.srcH / o.srcW) * width) / 2) * 2) : 0;
  const frames = Math.ceil(span * o.fps - 1e-9);
  let error: string | null = null;
  if (span < GIF_MIN_SPAN) error = i18n.t("media.plans.gifMinSpan", { n: GIF_MIN_SPAN });
  else if (span > o.maxSeconds) error = i18n.t("media.plans.gifTooLong", { span: span.toFixed(1), max: o.maxSeconds });
  return { span, width, height, frames, error, upscaled: o.srcW > 0 && o.width > o.srcW };
}

export type CompressCodec = "h264" | "h265" | "vp9";
export type CompressHeight = "source" | 1080 | 720 | 480;

export interface CompressInput {
  bytes: number;
  duration: number;
  srcHeight: number;
  mode: "quality" | "size";
  quality: "high" | "balanced" | "small";
  targetMB: number;
  height: CompressHeight;
  codec: CompressCodec;
  audio: "keep" | "aac128" | "none";
}

const CRF: Record<CompressCodec, Record<CompressInput["quality"], number>> = {
  h264: { high: 20, balanced: 24, small: 28 },
  h265: { high: 22, balanced: 26, small: 30 },
  vp9: { high: 28, balanced: 33, small: 38 },
};

/** Parameter kompresi + validasi. Bitrate target dihitung dari ukuran & durasi. */
export function compressPlan(i: CompressInput) {
  const MB = 1024 * 1024;
  const container = i.codec === "vp9" ? "webm" : "mp4";
  const audioKbps = i.audio === "none" ? 0 : 128;
  let error: string | null = null;
  let videoKbps: number | null = null;
  if (i.height !== "source" && i.srcHeight > 0 && i.height >= i.srcHeight) error = i18n.t("media.plans.compressNotSmaller", { height: i.height, src: i.srcHeight });
  if (i.mode === "size") {
    if (!(i.targetMB > 0)) error = i18n.t("media.plans.compressTargetMissing");
    else if (i.targetMB * MB >= i.bytes) error = i18n.t("media.plans.compressTargetTooBig");
    else if (i.duration > 0) {
      videoKbps = Math.floor((i.targetMB * MB * 8) / 1000 / i.duration - audioKbps);
      if (videoKbps < 100) error = i18n.t("media.plans.compressTargetTooSmall", { seconds: Math.round(i.duration) });
    }
  }
  return {
    error,
    container,
    params: {
      codec: i.codec,
      container,
      height: i.height,
      audio: i.audio,
      ...(i.mode === "size" ? { targetBytes: Math.round(i.targetMB * MB), videoKbps } : { crf: CRF[i.codec][i.quality] }),
    },
    videoKbps,
  };
}
