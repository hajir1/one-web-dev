// ─── workers/audioClient.ts ──────────────────────────────────────────────────
// Klien worker konversi audio. Satu worker per file: memori (PCM, modul WASM)
// dilepas begitu file selesai, dan membatalkan cukup dengan terminate().

import i18n from "../../../i18n";
import { BROWSER_AUDIO_MAX_SECONDS } from "../lib/audio";
import type { AudioConvertSettings, AudioTargetId } from "../lib/audioFormats";
import type { AudioInfo, AudioWorkerRequest, AudioWorkerResponse } from "./audioWorker";

const aborted = () => new DOMException(i18n.t("media.errors.aborted"), "AbortError");

type ACtor = typeof AudioContext;

/** Decode di halaman utama (cadangan untuk sumber yang tidak bisa di-decode worker). */
async function decodeOnMainThread(file: Blob, sampleRate: number | null, channels: number | null, signal?: AbortSignal): Promise<{ channels: Float32Array[]; sampleRate: number }> {
  const g = globalThis as unknown as { AudioContext?: ACtor; webkitAudioContext?: ACtor };
  const Ctx = g.AudioContext ?? g.webkitAudioContext;
  if (!Ctx) throw new Error(i18n.t("media.errors.noWebAudio"));
  const data = await file.arrayBuffer();
  if (signal?.aborted) throw aborted();
  const ctx = new Ctx();
  let buffer: AudioBuffer;
  try {
    buffer = await new Promise<AudioBuffer>((resolve, reject) => {
      const p = ctx.decodeAudioData(data, resolve, () => reject(new Error("decode")));
      if (p && typeof (p as Promise<AudioBuffer>).then === "function") (p as Promise<AudioBuffer>).then(resolve, reject);
    });
  } catch {
    throw new Error(i18n.t("media.audioConverter.undecodable"));
  } finally {
    ctx.close?.().catch(() => {});
  }
  if (buffer.duration > BROWSER_AUDIO_MAX_SECONDS) throw new Error(i18n.t("media.audioConverter.tooLong", { n: BROWSER_AUDIO_MAX_SECONDS / 60 }));
  const outCh = channels ?? buffer.numberOfChannels;
  const outRate = sampleRate ?? buffer.sampleRate;
  if (outCh === buffer.numberOfChannels && outRate === buffer.sampleRate) {
    return { channels: Array.from({ length: outCh }, (_, i) => buffer.getChannelData(i)), sampleRate: outRate };
  }
  // OfflineAudioContext: resample + up/down-mix kanal sesuai aturan Web Audio.
  const off = new OfflineAudioContext(outCh, Math.max(1, Math.ceil(buffer.duration * outRate)), outRate);
  const node = off.createBufferSource();
  node.buffer = buffer;
  node.connect(off.destination);
  node.start();
  const r = await off.startRendering();
  return { channels: Array.from({ length: r.numberOfChannels }, (_, i) => r.getChannelData(i)), sampleRate: outRate };
}

export interface AudioConvertResult {
  blob: Blob;
  info: AudioInfo;
}

export function convertAudioInWorker(
  file: Blob,
  target: AudioTargetId,
  settings: AudioConvertSettings,
  mime: string,
  opts: { signal?: AbortSignal; onProgress?: (pct: number) => void } = {},
): Promise<AudioConvertResult> {
  const { signal, onProgress } = opts;
  if (signal?.aborted) return Promise.reject(aborted());
  return new Promise((resolve, reject) => {
    const w = new Worker(new URL("./audioWorker.ts", import.meta.url), { type: "module" });
    const send = (m: AudioWorkerRequest, t: Transferable[] = []) => w.postMessage(m, t);
    const finish = (fn: () => void) => {
      signal?.removeEventListener("abort", onAbort);
      w.terminate();
      fn();
    };
    const onAbort = () => finish(() => reject(aborted()));
    signal?.addEventListener("abort", onAbort, { once: true });
    w.onerror = (e) => {
      e.preventDefault?.();
      finish(() => reject(new Error(i18n.t("media.codec.loadFailed"))));
    };
    w.onmessage = (e: MessageEvent<AudioWorkerResponse>) => {
      const m = e.data;
      if (m.type === "progress") onProgress?.(m.value);
      else if (m.type === "needPcm") {
        decodeOnMainThread(file, m.sampleRate, m.channels, signal).then(
          (pcm) => {
            onProgress?.(55);
            // Salin agar buffer AudioBuffer asli tidak ikut dipindahkan.
            const planes = pcm.channels.map((c) => c.slice());
            send({ op: "pcm", channels: planes, sampleRate: pcm.sampleRate }, planes.map((p) => p.buffer));
          },
          (err: Error) => (err.name === "AbortError" ? undefined : finish(() => reject(err))),
        );
      } else if (m.type === "done") finish(() => resolve({ blob: new Blob([m.bytes], { type: mime }), info: m.info }));
      else if (m.type === "error") {
        const msg =
          m.code === "UNSUPPORTED_TARGET"
            ? i18n.t("media.audioConverter.targetUnsupported")
            : m.code === "NO_AUDIO"
              ? i18n.t("media.audioConverter.undecodable")
              : i18n.t("media.codec.failed", { reason: m.error || "?" });
        finish(() => reject(new Error(msg)));
      }
    };
    send({ op: "convert", file, target, settings });
  });
}

/** Opus butuh encoder WebCodecs bawaan browser (Chrome/Edge/Firefox; Safari belum). */
export async function canEncodeOpus(): Promise<boolean> {
  const AE = (globalThis as unknown as { AudioEncoder?: { isConfigSupported(c: unknown): Promise<{ supported?: boolean }> } }).AudioEncoder;
  if (!AE) return false;
  try {
    return !!(await AE.isConfigSupported({ codec: "opus", sampleRate: 48000, numberOfChannels: 2, bitrate: 128000 })).supported;
  } catch {
    return false;
  }
}
