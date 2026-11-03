// ─── lib/wav.ts ──────────────────────────────────────────────────────────────
// Encoder WAV PCM 16-bit (murni, tanpa dependensi) + utilitas kanal.

import i18n from "../../../i18n";

/** Potong kanal ke rentang [startSec, endSec). */
export function sliceChannels(ch: Float32Array[], sampleRate: number, startSec: number, endSec: number): Float32Array[] {
  const len = ch[0]?.length ?? 0;
  const a = Math.max(0, Math.min(len, Math.floor(startSec * sampleRate)));
  const b = Math.max(a, Math.min(len, Math.ceil(endSec * sampleRate)));
  return ch.map((c) => c.subarray(a, b));
}

/** Campur semua kanal menjadi mono (rata-rata). */
export function mixToMono(ch: Float32Array[]): Float32Array {
  if (ch.length === 1) return ch[0];
  const n = ch[0].length;
  const out = new Float32Array(n);
  for (const c of ch) for (let i = 0; i < n; i++) out[i] += c[i];
  for (let i = 0; i < n; i++) out[i] /= ch.length;
  return out;
}

/** Ukuran file WAV 16-bit dalam byte. */
export const wavBytes = (seconds: number, sampleRate: number, channels: number) => 44 + Math.round(seconds * sampleRate) * channels * 2;

/** Encode kanal float (-1..1) ke WAV PCM 16-bit little-endian. */
export function encodeWav(ch: Float32Array[], sampleRate: number): Uint8Array {
  const channels = ch.length;
  if (!channels) throw new Error(i18n.t("media.errors.noAudioChannels"));
  const frames = ch[0].length;
  const dataBytes = frames * channels * 2;
  const buf = new ArrayBuffer(44 + dataBytes);
  const v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  v.setUint32(4, 36 + dataBytes, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true); // ukuran chunk fmt
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, channels, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * channels * 2, true); // byte rate
  v.setUint16(32, channels * 2, true); // block align
  v.setUint16(34, 16, true); // bit per sampel
  str(36, "data");
  v.setUint32(40, dataBytes, true);
  let o = 44;
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      const s = Math.max(-1, Math.min(1, ch[c][i] || 0));
      v.setInt16(o, s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff), true);
      o += 2;
    }
  }
  return new Uint8Array(buf);
}
