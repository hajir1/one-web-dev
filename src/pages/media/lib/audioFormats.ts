// ─── lib/audioFormats.ts ─────────────────────────────────────────────────────
// The "Convert Audio" target format list + pure rules (no DOM)
// used by the worker and tested in Node: channel/sample rate limits per format and
// pemetaan bitrate → kualitas Vorbis.

export type AudioTargetId = "mp3" | "wav" | "ogg" | "opus" | "flac" | "aac" | "m4a";

export interface AudioTarget {
  id: AudioTargetId;
  label: string;
  ext: string;
  mime: string;
  /** No lossy compression (bitrate does not apply). */
  lossless: boolean;
  /** Maximum channels supported by the encoder. */
  maxChannels: number;
  /** Maximum sample rate supported by the encoder (null = any). */
  maxSampleRate: number | null;
  /** Needs the browser's built-in WebCodecs encoder (no WASM version). */
  needsWebCodecs?: boolean;
}

export const AUDIO_TARGETS: AudioTarget[] = [
  { id: "mp3", label: "MP3", ext: "mp3", mime: "audio/mpeg", lossless: false, maxChannels: 2, maxSampleRate: 48000 },
  { id: "wav", label: "WAV", ext: "wav", mime: "audio/wav", lossless: true, maxChannels: 8, maxSampleRate: null },
  { id: "ogg", label: "OGG", ext: "ogg", mime: "audio/ogg", lossless: false, maxChannels: 2, maxSampleRate: 48000 },
  { id: "opus", label: "Opus", ext: "opus", mime: "audio/ogg; codecs=opus", lossless: false, maxChannels: 2, maxSampleRate: 48000, needsWebCodecs: true },
  { id: "flac", label: "FLAC", ext: "flac", mime: "audio/flac", lossless: true, maxChannels: 8, maxSampleRate: 192000 },
  { id: "aac", label: "AAC", ext: "aac", mime: "audio/aac", lossless: false, maxChannels: 2, maxSampleRate: 48000 },
  { id: "m4a", label: "M4A", ext: "m4a", mime: "audio/mp4", lossless: false, maxChannels: 2, maxSampleRate: 48000 },
];

export const audioTarget = (id: AudioTargetId) => AUDIO_TARGETS.find((t) => t.id === id) ?? AUDIO_TARGETS[0];

/** Bitrates offered (kbps). */
export const AUDIO_BITRATES = [96, 128, 160, 192, 256, 320] as const;
export const AUDIO_SAMPLE_RATES = [22050, 32000, 44100, 48000] as const;

export interface AudioConvertSettings {
  /** kbps, for lossy formats. */
  bitrate: number;
  /** null = sample rate asli. */
  sampleRate: number | null;
  /** null = jumlah kanal asli. */
  channels: 1 | 2 | null;
}

export const DEFAULT_AUDIO_SETTINGS: AudioConvertSettings = { bitrate: 192, sampleRate: null, channels: null };

/** Output channel count: the user's choice or the original, limited by the encoder. */
export function outputChannels(target: AudioTarget, chosen: AudioConvertSettings["channels"], source: number): number {
  const want = chosen ?? Math.max(1, source || 2);
  return Math.max(1, Math.min(target.maxChannels, want));
}

/**
 * Output sample rate. A 96 kHz source to MP3/AAC/Vorbis drops to 48 kHz;
 * a 22.05 kHz source stays 22.05 kHz unless the user picks otherwise.
 * Opus is always 48 kHz (the Opus codec works at 48 kHz).
 */
export function outputSampleRate(target: AudioTarget, chosen: number | null, source: number): number {
  if (target.id === "opus") return 48000;
  const want = chosen ?? (source > 0 ? source : 48000);
  return target.maxSampleRate ? Math.min(target.maxSampleRate, want) : want;
}

/** Bitrate (kbps) → kualitas VBR Vorbis (-1..10, ±128 kbps ≈ 4). */
export function vorbisQuality(kbps: number): number {
  const table: [number, number][] = [
    [64, 0],
    [96, 2],
    [128, 4],
    [160, 5],
    [192, 6],
    [256, 8],
    [320, 9],
  ];
  if (kbps <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [b1, q1] = table[i];
    const [b0, q0] = table[i - 1];
    if (kbps <= b1) return q0 + ((kbps - b0) / (b1 - b0)) * (q1 - q0);
  }
  return 10;
}

/** Effective bitrate: Opus maxes out at 256 kbps for stereo (no audible difference above that). */
export function outputBitrate(target: AudioTarget, kbps: number, channels: number): number {
  const k = Math.max(32, Math.min(320, Math.round(kbps)));
  if (target.id === "opus") return Math.min(k, 128 * channels) * 1000;
  return k * 1000;
}

/** Reduces the channel count (remaining channels are averaged into the kept ones). */
export function downmix(planes: Float32Array[], to: number): Float32Array[] {
  if (planes.length <= to) return planes;
  if (to === 1) {
    const out = new Float32Array(planes[0].length);
    for (const p of planes) for (let i = 0; i < out.length; i++) out[i] += p[i] / planes.length;
    return [out];
  }
  // Stereo: L = even channels, R = odd channels (good enough for a simple 5.1 → 2.0).
  const out = [new Float32Array(planes[0].length), new Float32Array(planes[0].length)];
  const counts = [0, 0];
  planes.forEach((p, c) => {
    const k = c % 2;
    counts[k]++;
    for (let i = 0; i < p.length; i++) out[k][i] += p[i];
  });
  out.forEach((o, k) => {
    for (let i = 0; i < o.length; i++) o[i] /= counts[k] || 1;
  });
  return out;
}

/** Simple linear resample (only for the > 48 kHz fallback path). */
export function resampleLinear(src: Float32Array, from: number, to: number): Float32Array {
  if (from === to) return src;
  const n = Math.max(1, Math.round((src.length * to) / from));
  const out = new Float32Array(n);
  const ratio = from / to;
  for (let i = 0; i < n; i++) {
    const x = i * ratio;
    const i0 = Math.floor(x);
    const i1 = Math.min(src.length - 1, i0 + 1);
    const f = x - i0;
    out[i] = src[Math.min(src.length - 1, i0)] * (1 - f) + src[i1] * f;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* AIFF / AIFF-C → PCM (the browser & mediabunny cannot read AIFF)       */
/* ------------------------------------------------------------------ */

export const isAiff = (head: Uint8Array) =>
  head.length >= 12 && String.fromCharCode(...head.subarray(0, 4)) === "FORM" && ["AIFF", "AIFC"].includes(String.fromCharCode(...head.subarray(8, 12)));

/** Float 80-bit (IEEE 754 extended, big-endian) → number. */
function readExtended(v: DataView, o: number): number {
  const exp = v.getUint16(o) & 0x7fff;
  const sign = v.getUint16(o) & 0x8000 ? -1 : 1;
  const hi = v.getUint32(o + 2);
  const lo = v.getUint32(o + 6);
  if (!exp && !hi && !lo) return 0;
  return sign * (hi * 2 ** (exp - 16383 - 31) + lo * 2 ** (exp - 16383 - 63));
}

/** Parse uncompressed AIFF/AIFF-C (PCM 8/16/24/32-bit, 'sowt', float 32/64). */
export function parseAiff(buf: ArrayBuffer): { channels: Float32Array[]; sampleRate: number } {
  const v = new DataView(buf);
  const tag = (o: number) => String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3));
  if (buf.byteLength < 12 || tag(0) !== "FORM") throw new Error("AIFF");
  const aifc = tag(8) === "AIFC";
  let ch = 0,
    frames = 0,
    bits = 0,
    rate = 0,
    comp = "NONE",
    dataAt = -1;
  for (let o = 12; o + 8 <= buf.byteLength; ) {
    const id = tag(o);
    const size = v.getUint32(o + 4);
    const body = o + 8;
    if (id === "COMM") {
      ch = v.getInt16(body);
      frames = v.getUint32(body + 2);
      bits = v.getInt16(body + 6);
      rate = readExtended(v, body + 8);
      if (aifc && size >= 22) comp = tag(body + 18);
    } else if (id === "SSND") dataAt = body + 8 + v.getUint32(body);
    o = body + size + (size & 1);
  }
  if (!ch || !rate || dataAt < 0) throw new Error("AIFF");
  const c = comp.toLowerCase();
  const float = c === "fl32" || c === "fl64";
  if (!["none", "twos", "sowt", "fl32", "fl64", "raw "].includes(c)) throw new Error(`AIFF-C ${comp}`);
  const bytes = float ? (c === "fl64" ? 8 : 4) : Math.ceil(bits / 8);
  const le = c === "sowt";
  const n = Math.min(frames, Math.floor((buf.byteLength - dataAt) / (bytes * ch)));
  const out = Array.from({ length: ch }, () => new Float32Array(n));
  let o = dataAt;
  for (let i = 0; i < n; i++)
    for (let k = 0; k < ch; k++, o += bytes) {
      let x: number;
      if (c === "fl32") x = v.getFloat32(o);
      else if (c === "fl64") x = v.getFloat64(o);
      else if (bytes === 1) x = c === "raw " ? (v.getUint8(o) - 128) / 128 : v.getInt8(o) / 128;
      else if (bytes === 2) x = v.getInt16(o, le) / 32768;
      else if (bytes === 3) x = (((v.getInt8(o) << 16) | (v.getUint8(o + 1) << 8) | v.getUint8(o + 2)) / 8388608);
      else x = v.getInt32(o, le) / 2147483648;
      out[k][i] = x;
    }
  return { channels: out, sampleRate: Math.round(rate) };
}
