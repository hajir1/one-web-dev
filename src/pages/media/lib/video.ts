// ─── lib/video.ts ────────────────────────────────────────────────────────────
// Bantuan video di browser: muat metadata (dengan batas waktu & pesan codec),
// perbaiki durasi Infinity, dan seek yang tidak bisa menggantung selamanya.

import i18n from "../../../i18n";

const abortErr = () => new DOMException(i18n.t("media.errors.aborted"), "AbortError");

function waitEvent(el: HTMLMediaElement, ok: string[], timeoutMs: number, signal?: AbortSignal, timeoutMsg?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const off = () => {
      ok.forEach((n) => el.removeEventListener(n, onOk));
      el.removeEventListener("error", onErr);
      signal?.removeEventListener("abort", onAbort);
      clearTimeout(t);
    };
    const onOk = (e: Event) => {
      off();
      resolve(e.type);
    };
    const onErr = () => {
      off();
      reject(mediaError(el));
    };
    const onAbort = () => {
      off();
      reject(abortErr());
    };
    const t = setTimeout(() => {
      off();
      reject(new Error(timeoutMsg ?? i18n.t("media.video.timeout")));
    }, timeoutMs);
    ok.forEach((n) => el.addEventListener(n, onOk));
    el.addEventListener("error", onErr);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function mediaError(el: HTMLMediaElement): Error {
  const code = el.error?.code;
  if (code === 4)
    return new Error(i18n.t("media.video.unsupportedCodec"));
  if (code === 3) return new Error(i18n.t("media.video.decodeFailed"));
  if (code === 2) return new Error(i18n.t("media.video.readFailed"));
  return new Error(i18n.t("media.video.loadFailed"));
}

export interface VideoMeta {
  duration: number;
  width: number;
  height: number;
  /** Durasi awalnya Infinity dan sudah dihitung ulang. */
  durationFixed: boolean;
}

export async function loadVideoMeta(video: HTMLVideoElement, url: string, signal?: AbortSignal): Promise<VideoMeta> {
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  if (video.src !== url) video.src = url;
  if (video.readyState < 1) await waitEvent(video, ["loadedmetadata"], 20_000, signal, i18n.t("media.video.metaTimeout"));

  let durationFixed = false;
  if (!Number.isFinite(video.duration)) {
    // Trik umum untuk WebM tanpa durasi: lompat ke akhir agar browser menghitungnya.
    video.currentTime = 1e101;
    await waitEvent(video, ["durationchange", "timeupdate", "seeked"], 8_000, signal).catch(() => "");
    durationFixed = Number.isFinite(video.duration);
    video.currentTime = 0;
    await waitEvent(video, ["seeked"], 8_000, signal).catch(() => "");
  }
  if (!video.videoWidth || !video.videoHeight) throw new Error(i18n.t("media.video.noVideoTrack"));
  return { duration: video.duration, width: video.videoWidth, height: video.videoHeight, durationFixed };
}

/** Seek dengan batas waktu; seek ke posisi yang sama tidak menunggu event. */
export async function seekTo(video: HTMLVideoElement, time: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) throw abortErr();
  if (Math.abs(video.currentTime - time) < 1e-4 && video.readyState >= 2) return;
  const p = waitEvent(video, ["seeked"], 10_000, signal, i18n.t("media.video.seekStuck", { time: time.toFixed(2) }));
  video.currentTime = time;
  await p;
  if (video.readyState < 2) await waitEvent(video, ["loadeddata", "canplay"], 5_000, signal).catch(() => "");
}
