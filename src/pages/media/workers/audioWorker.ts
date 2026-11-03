// ─── workers/audioWorker.ts ──────────────────────────────────────────────────
// Konversi audio di Web Worker (satu worker per file; dihentikan saat batal).
// File tidak pernah diunggah: dibaca langsung dari Blob di memori browser.
//
// Jalur cepat: mediabunny membaca kontainer (MP3, WAV, OGG, FLAC, AAC, M4A,
// WebM, MKV, MP4…), men-decode (WebCodecs), mengubah kanal/sample rate, lalu
// meng-encode. Encoder WASM didaftarkan hanya bila browser tidak punya
// encoder bawaan untuk kodek itu, dan dimuat hanya saat dipakai.
//
// Jalur cadangan: bila worker tidak bisa men-decode sumber (mis. browser
// tanpa WebCodecs audio, atau format seperti AIFF), worker meminta PCM ke
// halaman utama (decodeAudioData) lalu meng-encode PCM itu.
//
// Lisensi (aman untuk produk komersial, lihat LAPORAN.md):
// - mediabunny & @mediabunny/*-encoder : MPL-2.0 (copyleft per file; tidak diubah)
// - LAME (di @mediabunny/mp3-encoder)   : LGPL, modul WASM terpisah, tidak diubah
// - FFmpeg AAC (di @mediabunny/aac-encoder): LGPL, modul WASM terpisah, tidak diubah
// - libFLAC (di @mediabunny/flac-encoder): BSD-3
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
  /** Minta PCM dari halaman utama (sudah di-resample ke rate/kanal ini; null = asli). */
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

/** Encoder Vorbis (libvorbis WASM) yang menerima potongan PCM planar. */
async function createVorbis() {
  // Paket ini menyisipkan WASM-nya sendiri (base64), jadi tidak ada file .wasm terpisah.
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
    // Hasil encode masih milik encoder → wajib disalin.
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
/* Jalur cepat: baca + decode di worker                                  */
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
      // Vorbis tidak ada di WebCodecs: mediabunny men-decode/resample, PCM-nya
      // diteruskan ke libvorbis. Keluaran mediabunny sendiri (WAV 8-bit) dibuang.
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
        // Selalu encode ulang agar pengaturan bitrate/kanal dipakai.
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
/* Jalur cadangan: PCM dari halaman utama                                */
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
  // Kanal & sample rate akhir (pilihan pengguna, dibatasi kemampuan encoder).
  const channels = outputChannels(target, s.channels, input.length);
  const rate = outputSampleRate(target, s.sampleRate, inputRate);
  const info = { seconds: input[0].length / inputRate, sampleRate: rate, channels };

  if (target.id === "ogg") {
    // libvorbis menerima PCM apa adanya → kanal & rate disesuaikan di sini.
    let planes = downmix(input, channels);
    if (planes.length < channels) planes = Array.from({ length: channels }, (_, i) => planes[i] ?? planes[0]);
    if (rate !== inputRate) planes = planes.map((p) => resampleLinear(p, inputRate, rate));
    const frames = planes[0].length;
    const CHUNK = rate; // ±1 detik per potongan
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
  // mediabunny me-remix & me-resample sendiri (transform) sebelum encode.
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
  // AIFF: dibaca sendiri (PCM mentah), tidak didukung decoder browser.
  if (isAiff(new Uint8Array(await file.slice(0, 12).arrayBuffer()))) {
    const pcm = parseAiff(await file.arrayBuffer());
    progress(50);
    return encodePcm(target, s, pcm.channels, pcm.sampleRate);
  }
  try {
    return await convertDirect(file, target, s);
  } catch (e) {
    if (e instanceof TargetUnsupported) throw e;
    // Apa pun selain "format tujuan tidak didukung" → coba jalur cadangan.
  }
  progress(10);
  // Halaman utama men-decode (dan me-resample bila pengguna memilih rate); kanal & batas encoder diatur di encodePcm.
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
