// ─── lib/fileSniff.ts ─────────────────────────────────────────────────────────
// Deteksi jenis file dari ISI (magic bytes), bukan dari nama/MIME yang
// dikirim browser. MIME dari OS sering kosong (mis. .heic, .mkv di Windows)
// atau salah (file .png yang sebenarnya JPEG). Validasi berbasis isi
// mencegah file "menyamar" lolos ke decoder.

import i18n from "../../../i18n";

export type SniffedKind =
  | "png"
  | "jpeg"
  | "gif"
  | "webp"
  | "bmp"
  | "ico"
  | "tiff"
  | "avif"
  | "heic"
  | "svg"
  | "jxl"
  | "qoi"
  | "mp3"
  | "wav"
  | "flac"
  | "aac"
  | "m4a"
  | "aiff"
  | "mp4"
  | "mov"
  | "webm"
  | "mkv"
  | "avi"
  | "ogg"
  | "unknown";

const IMAGE_KINDS: SniffedKind[] = ["png", "jpeg", "gif", "webp", "bmp", "ico", "tiff", "avif", "heic", "svg", "jxl", "qoi"];
/** Audio murni (Ogg/WebM/MP4 juga bisa berisi audio; lihat AUDIO_SOURCE_KINDS di halaman Convert Audio). */
export const AUDIO_KINDS: SniffedKind[] = ["mp3", "wav", "flac", "aac", "m4a", "aiff", "ogg"];
export const VIDEO_KINDS: SniffedKind[] = ["mp4", "mov", "webm", "mkv", "avi", "ogg"];

/** Format gambar yang bisa di-decode oleh browser modern (Chrome/Firefox/Safari terbaru). */
export const BROWSER_DECODABLE_IMAGES: SniffedKind[] = ["png", "jpeg", "gif", "webp", "bmp", "ico", "avif", "svg"];

const KIND_LABEL_BASE: Record<Exclude<SniffedKind, "unknown">, string> = {
  png: "PNG",
  jpeg: "JPEG",
  gif: "GIF",
  webp: "WebP",
  bmp: "BMP",
  ico: "ICO",
  tiff: "TIFF",
  avif: "AVIF",
  heic: "HEIC/HEIF",
  svg: "SVG",
  jxl: "JPEG XL",
  qoi: "QOI",
  mp3: "MP3",
  wav: "WAV",
  flac: "FLAC",
  aac: "AAC",
  m4a: "M4A",
  aiff: "AIFF",
  mp4: "MP4",
  mov: "MOV (QuickTime)",
  webm: "WebM",
  mkv: "MKV",
  avi: "AVI",
  ogg: "Ogg",
};

/** Label format untuk UI; "unknown" mengikuti bahasa aktif. */
export const KIND_LABEL: Record<SniffedKind, string> = new Proxy(KIND_LABEL_BASE as Record<SniffedKind, string>, {
  get: (target, key: string) => (key === "unknown" ? i18n.t("media.kinds.unknown") : target[key as SniffedKind]),
});

/** Berapa byte awal yang perlu dibaca untuk sniffing. */
const SNIFF_BYTES = 4096;

const ascii = (b: Uint8Array, start: number, len: number) => {
  let s = "";
  for (let i = start; i < start + len && i < b.length; i++) s += String.fromCharCode(b[i]);
  return s;
};

const startsWith = (b: Uint8Array, sig: number[], offset = 0) => sig.every((v, i) => b[offset + i] === v);

function sniffFtyp(b: Uint8Array): SniffedKind {
  // Box ISO-BMFF: [size(4)]["ftyp"][major brand(4)][minor(4)][compatible brands…]
  const size = ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0;
  const end = Math.min(b.length, size >= 16 ? size : 32);
  const brands: string[] = [ascii(b, 8, 4)];
  for (let i = 16; i + 4 <= end; i += 4) brands.push(ascii(b, i, 4));
  const has = (...xs: string[]) => brands.some((x) => xs.includes(x));
  if (has("avif", "avis")) return "avif";
  if (has("M4A ", "M4B ", "M4P ")) return "m4a";
  if (has("heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1")) return "heic";
  if (brands[0] === "qt  ") return "mov";
  return "mp4";
}

function looksLikeSvg(b: Uint8Array): boolean {
  let text = ascii(b, 0, Math.min(b.length, SNIFF_BYTES));
  if (text.charCodeAt(0) === 0xef && text.charCodeAt(1) === 0xbb && text.charCodeAt(2) === 0xbf) text = text.slice(3);
  const t = text.trimStart().toLowerCase();
  if (!t.startsWith("<")) return false;
  return /<svg[\s>]/.test(t);
}

/** Jenis file dari byte awal (minimal 12 byte; idealnya SNIFF_BYTES). */
export function sniffBytes(b: Uint8Array): SniffedKind {
  if (b.length < 4) return "unknown";
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(b, [0xff, 0xd8, 0xff])) return "jpeg";
  if (ascii(b, 0, 6) === "GIF87a" || ascii(b, 0, 6) === "GIF89a") return "gif";
  if (ascii(b, 0, 4) === "RIFF") {
    const sub = ascii(b, 8, 4);
    if (sub === "WEBP") return "webp";
    if (sub === "AVI ") return "avi";
    if (sub === "WAVE") return "wav";
  }
  if (ascii(b, 0, 4) === "RF64" && ascii(b, 8, 4) === "WAVE") return "wav";
  if (ascii(b, 0, 4) === "fLaC") return "flac";
  if (ascii(b, 0, 4) === "FORM" && (ascii(b, 8, 4) === "AIFF" || ascii(b, 8, 4) === "AIFC")) return "aiff";
  if (ascii(b, 0, 4) === "qoif") return "qoi";
  // JPEG XL: codestream FF 0A atau container ISO-BMFF "JXL ".
  if (startsWith(b, [0xff, 0x0a]) || (startsWith(b, [0, 0, 0, 0x0c]) && ascii(b, 4, 4) === "JXL ")) return "jxl";
  if (ascii(b, 0, 3) === "ID3") return "mp3";
  if (ascii(b, 4, 4) === "ftyp") return sniffFtyp(b);
  if (startsWith(b, [0x1a, 0x45, 0xdf, 0xa3])) {
    // EBML: DocType "webm" atau "matroska" ada di header awal.
    return ascii(b, 0, Math.min(b.length, 128)).includes("webm") ? "webm" : "mkv";
  }
  if (ascii(b, 0, 4) === "OggS") return "ogg";
  if (ascii(b, 0, 2) === "BM" && b.length >= 14) return "bmp";
  if (startsWith(b, [0x00, 0x00, 0x01, 0x00])) return "ico";
  if (startsWith(b, [0x49, 0x49, 0x2a, 0x00]) || startsWith(b, [0x4d, 0x4d, 0x00, 0x2a])) return "tiff";
  if (looksLikeSvg(b)) return "svg";
  // ADTS AAC (sync 0xFFF, layer 00) sebelum MP3 (sync 0xFFE, layer ≠ 00).
  if (b[0] === 0xff && (b[1] & 0xf6) === 0xf0) return "aac";
  if (b[0] === 0xff && (b[1] & 0xe0) === 0xe0 && (b[1] & 0x06) !== 0) return "mp3";
  return "unknown";
}

export async function sniffFile(file: Blob): Promise<SniffedKind> {
  const head = new Uint8Array(await file.slice(0, SNIFF_BYTES).arrayBuffer());
  return sniffBytes(head);
}

export const isImageKind = (k: SniffedKind) => IMAGE_KINDS.includes(k);
export const isVideoKind = (k: SniffedKind) => VIDEO_KINDS.includes(k);
