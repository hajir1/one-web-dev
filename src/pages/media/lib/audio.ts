// ─── lib/audio.ts ────────────────────────────────────────────────────────────
// Audio extraction in the browser via the Web Audio API → WAV.

import i18n from "../../../i18n";
import { encodeWav, mixToMono, sliceChannels } from "./wav";

/** Safety limit: the whole audio is decoded into memory as float32. */
export const BROWSER_AUDIO_MAX_SECONDS = 20 * 60;

export interface AudioExtractOptions {
  start: number;
  end: number;
  mono: boolean;
  /** null = sample rate asli. */
  sampleRate: number | null;
}

type ACtor = typeof AudioContext;

export async function extractWav(file: Blob, o: AudioExtractOptions, signal?: AbortSignal): Promise<{ blob: Blob; sampleRate: number; channels: number; seconds: number }> {
  const Ctx: ACtor | undefined = (globalThis as unknown as { AudioContext?: ACtor; webkitAudioContext?: ACtor }).AudioContext ?? (globalThis as unknown as { webkitAudioContext?: ACtor }).webkitAudioContext;
  if (!Ctx) throw new Error(i18n.t("media.errors.noWebAudio"));
  if (o.end - o.start > BROWSER_AUDIO_MAX_SECONDS) throw new Error(i18n.t("media.errors.audioRangeTooLong", { n: BROWSER_AUDIO_MAX_SECONDS / 60 }));
  const data = await file.arrayBuffer();
  if (signal?.aborted) throw new DOMException(i18n.t("media.errors.aborted"), "AbortError");
  const ctx = new Ctx();
  let buffer: AudioBuffer;
  try {
    buffer = await new Promise<AudioBuffer>((resolve, reject) => {
      // Callback form for old Safari; promise form for modern browsers.
      const p = ctx.decodeAudioData(data, resolve, () => reject(new Error("x")));
      if (p && typeof (p as Promise<AudioBuffer>).then === "function") (p as Promise<AudioBuffer>).then(resolve, reject);
    });
  } catch {
    throw new Error(i18n.t("media.errors.noAudioTrack"));
  } finally {
    ctx.close?.().catch(() => {});
  }
  if (signal?.aborted) throw new DOMException(i18n.t("media.errors.aborted"), "AbortError");

  let channels: Float32Array[] = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
  channels = sliceChannels(channels, buffer.sampleRate, o.start, o.end);
  if (!channels[0]?.length) throw new Error(i18n.t("media.errors.emptyAudioRange"));
  if (o.mono) channels = [mixToMono(channels)];

  let rate = buffer.sampleRate;
  if (o.sampleRate && o.sampleRate !== rate) {
    // Resample with OfflineAudioContext (the browser's built-in interpolation).
    const frames = Math.ceil((channels[0].length * o.sampleRate) / rate);
    const off = new OfflineAudioContext(channels.length, frames, o.sampleRate);
    const src = off.createBuffer(channels.length, channels[0].length, rate);
    channels.forEach((c, i) => src.copyToChannel(new Float32Array(c), i));
    const node = off.createBufferSource();
    node.buffer = src;
    node.connect(off.destination);
    node.start();
    const rendered = await off.startRendering();
    channels = Array.from({ length: rendered.numberOfChannels }, (_, i) => rendered.getChannelData(i));
    rate = o.sampleRate;
  }
  if (signal?.aborted) throw new DOMException(i18n.t("media.errors.aborted"), "AbortError");
  const wav = encodeWav(channels, rate);
  return { blob: new Blob([wav as BlobPart], { type: "audio/wav" }), sampleRate: rate, channels: channels.length, seconds: channels[0].length / rate };
}
