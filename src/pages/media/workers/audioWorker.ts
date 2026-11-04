// ─── workers/audioWorker.ts ──────────────────────────────────────────────────
// Audio conversion in a Web Worker (one worker per file; stopped on cancel).
// Files are never uploaded: read directly from the Blob in browser memory.
//
// Jalur cepat: mediabunny membaca kontainer (MP3, WAV, OGG, FLAC, AAC, M4A,
// WebM, MKV, MP4…), decodes (WebCodecs), changes channels/sample rate, then
// encodes. WASM encoders are registered only when the browser has no
// built-in encoder for that codec, and loaded only when used.
//
// Fallback path: when the worker cannot decode the source (e.g. a browser
// without WebCodecs audio, or formats like AIFF), the worker asks the main page
// for PCM (decodeAudioData) and then encodes that PCM.
//
// Licenses (safe for commercial products, see LAPORAN.md):
// - mediabunny & @mediabunny/*-encoder : MPL-2.0 (per-file copyleft; unmodified)
// - LAME (in @mediabunny/mp3-encoder)   : LGPL, separate WASM module, unmodified
// - FFmpeg AAC (in @mediabunny/aac-encoder): LGPL, separate WASM module, unmodified
// - libFLAC (in @mediabunny/flac-encoder): BSD-3
// - libvorbis/libogg (wasm-media-encoders): BSD-3, pembungkus MIT

import type { AudioCodec, AudioSample, OutputFormat } from "mediabunny";
import { audioTarget, downmix, isAiff, parseAiff, resampleLinear, outputBitrate, outputChannels, outputSampleRate, vorbisQuality, type AudioConvertSettings, type AudioTarget, type AudioTargetId } from "../lib/audioFormats";

export interface AudioInfo {
  seconds: number;
  sampleRate: number;
  channels: number;
}

export type AudioWorkerRequest =
  | { op: "convert"; file: Blob; target: AudioTargetId; settings: AudioConvertSettings }
  | { op: "pcm"; channels: Float32Array[]; sampleRate: number }
  | { op: "pcmError"; error: string };

export type AudioWorkerResponse =
  | { type: "progress"; value: number }
  /** Requests PCM from the main page (already resampled to this rate/channels; null = original). */
  | { type: "needPcm"; sampleRate: number | null; channels: number | null }
  | { type: "done"; bytes: ArrayBuffer; info: AudioInfo }
  | { type: "error"; error: string; code?: "UNSUPPORTED_TARGET" | "NO_AUDIO" };

const post = (msg: AudioWorkerResponse, transfer: Transferable[] = []) => (self as unknown as Worker).postMessage(msg, transfer);
const progress = (v: number) => post({ type: "progress", value: Math.max(0, Math.min(100, Math.round(v))) });

class TargetUnsupported extends Error {
  code = "UNSUPPORTED_TARGET" as const;
}
class NeedPcm extends Error {}

/* ------------------------------------------------------------------ */
/* Encoder & format keluaran                                             */
/* ------------------------------------------------------------------ */

const CODEC: Record<Exclude<AudioTargetId, "ogg">, AudioCodec> = {
  mp3: "mp3",
  wav: "pcm-s16",
  opus: "opus",
  flac: "flac",
  aac: "aac",
  m4a: "aac",
};

async function ensureEncoder(codec: AudioCodec) {
  const mb = await import("mediabunny");
  if (await mb.canEncodeAudio(codec).catch(() => false)) return;
  if (codec === "mp3") (await import("@mediabunny/mp3-encoder")).registerMp3Encoder();
  else if (codec === "aac") (await import("@mediabunny/aac-encoder")).registerAacEncoder();
  else if (codec === "flac") (await import("@mediabunny/flac-encoder")).registerFlacEncoder();
  else if (codec !== "pcm-s16") throw new TargetUnsupported(codec);
}

async function outputFormat(id: Exclude<AudioTargetId, "ogg">): Promise<OutputFormat> {
  const mb = await import("mediabunny");
  switch (id) {
    case "mp3":
      return new mb.Mp3OutputFormat();
    case "wav":
      return new mb.WavOutputFormat();
    case "opus":
      return new mb.OggOutputFormat();
    case "flac":
      return new mb.FlacOutputFormat();
    case "aac":
      return new mb.AdtsOutputFormat();
    case "m4a":
      return new mb.Mp4OutputFormat({ fastStart: "in-memory" });
  }
}

/** Vorbis encoder (libvorbis WASM) that accepts planar PCM chunks. */
async function createVorbis() {
  // This package inlines its own WASM (base64), so there is no separate .wasm file.
  const { createOggEncoder } = await import("wasm-media-encoders");
  const enc = await createOggEncoder();
  const parts: Uint8Array[] = [];
  let configured = false;
  return {
    configure(sampleRate: number, channels: number, kbps: number) {
      enc.configure({ sampleRate, channels: channels === 1 ? 1 : 2, vbrQuality: vorbisQuality(kbps) });
      configured = true;
    },
    get configured() {
      return configured;
    },
    // The encode output still belongs to the encoder → it must be copied.
    push(planes: Float32Array[]) {
      const out = enc.encode(planes);
      if (out.length) parts.push(out.slice());
    },
    finish(): ArrayBuffer {
      const tail = enc.finalize();
      if (tail.length) parts.push(tail.slice());
      const total = parts.reduce((n, p) => n + p.length, 0);
      const buf = new Uint8Array(total);
      let o = 0;
      for (const p of parts) {
        buf.set(p, o);
        o += p.length;
      }
      return buf.buffer;
    },
  };
}

function planesOf(sample: AudioSample): Float32Array[] {
  return Array.from({ length: sample.numberOfChannels }, (_, i) => {
    const dst = new Float32Array(sample.allocationSize({ planeIndex: i, format: "f32-planar" }) / 4);
    sample.copyTo(dst, { planeIndex: i, format: "f32-planar" });
    return dst;
  });
}

/* ------------------------------------------------------------------ */
/* Fast path: read + decode in the worker                                */
/* ------------------------------------------------------------------ */

async function convertDirect(file: Blob, target: AudioTarget, s: AudioConvertSettings): Promise<{ bytes: ArrayBuffer; info: AudioInfo }> {
  const mb = await import("mediabunny");
  const input = new mb.Input({ source: new mb.BlobSource(file), formats: mb.ALL_FORMATS });
  try {
    const track = await input.getPrimaryAudioTrack().catch(() => null);
    if (!track) throw new NeedPcm("no-track");
    if (!(await track.canDecode().catch(() => false))) throw new NeedPcm("undecodable");
    const channels = outputChannels(target, s.channels, track.numberOfChannels);
    const sampleRate = outputSampleRate(target, s.sampleRate, track.sampleRate);
    const seconds = await input.computeDuration().catch(() => 0);
    const info = { seconds, sampleRate, channels };

    if (target.id === "ogg") {
      // Vorbis is not in WebCodecs: mediabunny decodes/resamples, and its PCM
      // is passed to libvorbis. mediabunny's own output (8-bit WAV) is discarded.
      const vorbis = await createVorbis();
      vorbis.configure(sampleRate, channels, s.bitrate);
      const sink = new WritableStream({ write() {} });
      const conv = await mb.Conversion.init({
        input,
        output: new mb.Output({ format: new mb.WavOutputFormat(), target: new mb.StreamTarget(sink) }),
        video: { discard: true },
        audio: {
          codec: "pcm-u8",
          numberOfChannels: channels,
          sampleRate,
          forceTranscode: true,
          process: (sample) => (vorbis.push(planesOf(sample)), sample),
        },
        showWarnings: false,
      });
      if (!conv.isValid) throw new NeedPcm("invalid");
      conv.onProgress = (p) => progress(5 + p * 90);
      await conv.execute();
      return { bytes: vorbis.finish(), info };
    }

    const codec = CODEC[target.id];
    await ensureEncoder(codec);
    const out = new mb.Output({ format: await outputFormat(target.id), target: new mb.BufferTarget() });
    const conv = await mb.Conversion.init({
      input,
      output: out,
      video: { discard: true },
      audio: {
        codec,
        numberOfChannels: channels,
        sampleRate,
        ...(target.lossless ? {} : { bitrate: outputBitrate(target, s.bitrate, channels) }),
        // Always re-encode so the bitrate/channel settings are applied.
        forceTranscode: true,
      },
      showWarnings: false,
    });
    if (!conv.isValid) {
      const reasons = conv.discardedTracks.filter((d) => d.track.isAudioTrack()).map((d) => d.reason);
      if (reasons.includes("no_encodable_target_codec")) throw new TargetUnsupported(codec);
      throw new NeedPcm(reasons.join(",") || "invalid");
    }
    conv.onProgress = (p) => progress(5 + p * 90);
    await conv.execute();
    const bytes = out.target.buffer;
    if (!bytes?.byteLength) throw new Error("empty");
    return { bytes, info };
  } finally {
    input.dispose();
  }
}

/* ------------------------------------------------------------------ */
/* Fallback path: PCM from the main page                                */
/* ------------------------------------------------------------------ */

let pcmWaiter: { resolve: (v: { channels: Float32Array[]; sampleRate: number }) => void; reject: (e: Error) => void } | null = null;

function requestPcm(sampleRate: number | null, channels: number | null) {
  return new Promise<{ channels: Float32Array[]; sampleRate: number }>((resolve, reject) => {
    pcmWaiter = { resolve, reject };
    post({ type: "needPcm", sampleRate, channels });
  });
}

async function encodePcm(target: AudioTarget, s: AudioConvertSettings, input: Float32Array[], inputRate: number): Promise<{ bytes: ArrayBuffer; info: AudioInfo }> {
  if (!input.length || !input[0]?.length) throw Object.assign(new Error("no-audio"), { code: "NO_AUDIO" as const });
  // Final channels & sample rate (the user's choice, limited by the encoder).
  const channels = outputChannels(target, s.channels, input.length);
  const rate = outputSampleRate(target, s.sampleRate, inputRate);
  const info = { seconds: input[0].length / inputRate, sampleRate: rate, channels };

  if (target.id === "ogg") {
    // libvorbis takes PCM as is → channels & rate are adjusted here.
    let planes = downmix(input, channels);
    if (planes.length < channels) planes = Array.from({ length: channels }, (_, i) => planes[i] ?? planes[0]);
    if (rate !== inputRate) planes = planes.map((p) => resampleLinear(p, inputRate, rate));
    const frames = planes[0].length;
    const CHUNK = rate; // ±1 second per chunk
    const vorbis = await createVorbis();
    vorbis.configure(rate, channels, s.bitrate);
    for (let i = 0; i < frames; i += CHUNK) {
      vorbis.push(planes.map((p) => p.subarray(i, Math.min(frames, i + CHUNK))));
      progress(60 + (i / frames) * 38);
    }
    return { bytes: vorbis.finish(), info };
  }

  const mb = await import("mediabunny");
  const codec = CODEC[target.id];
  await ensureEncoder(codec);
  const out = new mb.Output({ format: await outputFormat(target.id), target: new mb.BufferTarget() });
  // mediabunny remixes & resamples by itself (transform) before encoding.
  const src = new mb.AudioSampleSource({
    codec,
    ...(target.lossless ? {} : { bitrate: outputBitrate(target, s.bitrate, channels) }),
    transform: { numberOfChannels: channels, sampleRate: rate },
  });
  out.addAudioTrack(src);
  await out.start();
  const inCh = input.length;
  const frames = input[0].length;
  const CHUNK = inputRate;
  for (let i = 0; i < frames; i += CHUNK) {
    const n = Math.min(CHUNK, frames - i);
    const data = new Float32Array(n * inCh);
    input.forEach((p, c) => data.set(p.subarray(i, i + n), c * n));
    const sample = new mb.AudioSample({ data, format: "f32-planar", numberOfChannels: inCh, sampleRate: inputRate, timestamp: i / inputRate });
    await src.add(sample);
    sample.close();
    progress(60 + (i / frames) * 38);
  }
  await out.finalize();
  const bytes = out.target.buffer;
  if (!bytes?.byteLength) throw new Error("empty");
  return { bytes, info };
}

/* ------------------------------------------------------------------ */

async function convert(file: Blob, id: AudioTargetId, s: AudioConvertSettings) {
  const target = audioTarget(id);
  progress(2);
  // AIFF: read ourselves (raw PCM), not supported by browser decoders.
  if (isAiff(new Uint8Array(await file.slice(0, 12).arrayBuffer()))) {
    const pcm = parseAiff(await file.arrayBuffer());
    progress(50);
    return encodePcm(target, s, pcm.channels, pcm.sampleRate);
  }
  try {
    return await convertDirect(file, target, s);
  } catch (e) {
    if (e instanceof TargetUnsupported) throw e;
    // Anything other than "target format not supported" → try the fallback path.
  }
  progress(10);
  // The main page decodes (and resamples when the user picks a rate); channels & encoder limits are set in encodePcm.
  const pcm = await requestPcm(target.id === "opus" ? 48000 : s.sampleRate, null);
  return encodePcm(target, s, pcm.channels, pcm.sampleRate);
}

if (typeof self !== "undefined" && typeof (self as unknown as { postMessage?: unknown }).postMessage === "function" && typeof window === "undefined") {
  self.onmessage = async (e: MessageEvent<AudioWorkerRequest>) => {
    const msg = e.data;
    if (msg.op === "pcm") {
      pcmWaiter?.resolve({ channels: msg.channels, sampleRate: msg.sampleRate });
      pcmWaiter = null;
      return;
    }
    if (msg.op === "pcmError") {
      pcmWaiter?.reject(Object.assign(new Error(msg.error), { code: "NO_AUDIO" as const }));
      pcmWaiter = null;
      return;
    }
    try {
      const { bytes, info } = await convert(msg.file, msg.target, msg.settings);
      post({ type: "done", bytes, info }, [bytes]);
    } catch (err) {
      const code = (err as { code?: "UNSUPPORTED_TARGET" | "NO_AUDIO" }).code;
      post({ type: "error", error: err instanceof Error ? err.message || err.name : String(err), ...(code ? { code } : {}) });
    }
  };
}
