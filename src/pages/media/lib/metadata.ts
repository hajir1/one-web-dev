// ─── lib/metadata.ts ─────────────────────────────────────────────────────────
// Reads & removes image metadata WITHOUT re-encoding (lossless): pixel data
// is untouched, only metadata segments/chunks are dropped.
//
//   JPEG  buang APP1 (EXIF/XMP), APP13 (IPTC/Photoshop), APP3–APP12, APP15,
//         COM. Keep APP0 (JFIF), APP2 (ICC profile, optional),
//         APP14 (Adobe; required for CMYK JPEGs). EXIF orientation can
//         be kept through a minimal EXIF containing only the Orientation tag.
//   PNG   drop tEXt, zTXt, iTXt, eXIf, tIME (+ iCCP when requested).
//   WebP  drop the EXIF & XMP chunks, update the VP8X flags & RIFF size.

import i18n from "../../../i18n";

type MetaFormat = "jpeg" | "png" | "webp";

export interface MetadataReport {
  format: MetaFormat;
  /** Summary of blocks found, e.g. "EXIF", "XMP", "Comment". */
  blocks: string[];
  hasExif: boolean;
  hasGps: boolean;
  gps?: { lat: number; lon: number };
  camera?: string;
  software?: string;
  dateTime?: string;
  serial?: string;
  orientation?: number;
  /** PNG text (e.g. an AI "parameters" prompt). */
  textKeys: string[];
  hasIcc: boolean;
  /** Total metadata bytes that can be dropped. */
  removableBytes: number;
}

export interface StripOptions {
  keepOrientation: boolean;
  keepIcc: boolean;
}

/* ------------------------------ util ------------------------------ */

const u16be = (b: Uint8Array, o: number) => (b[o] << 8) | b[o + 1];
const u32be = (b: Uint8Array, o: number) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
const u32le = (b: Uint8Array, o: number) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
const ascii = (b: Uint8Array, o: number, n: number) => String.fromCharCode(...b.subarray(o, Math.min(b.length, o + n)));

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function detectMetaFormat(b: Uint8Array): MetaFormat | null {
  if (b[0] === 0xff && b[1] === 0xd8) return "jpeg";
  if (b[0] === 0x89 && ascii(b, 1, 3) === "PNG") return "png";
  if (ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 4) === "WEBP") return "webp";
  return null;
}

/* ------------------------------ EXIF ------------------------------ */

interface ExifInfo {
  orientation?: number;
  camera?: string;
  software?: string;
  dateTime?: string;
  serial?: string;
  gps?: { lat: number; lon: number };
  hasGps: boolean;
}

/** Parse TIFF/EXIF (starting at the "II"/"MM" header). Tolerant of corrupt data. */
export function parseExifTiff(t: Uint8Array): ExifInfo {
  const info: ExifInfo = { hasGps: false };
  if (t.length < 8) return info;
  const le = t[0] === 0x49;
  const u16 = (o: number) => (o + 2 <= t.length ? (le ? t[o] | (t[o + 1] << 8) : (t[o] << 8) | t[o + 1]) : 0);
  const u32 = (o: number) => (o + 4 <= t.length ? (le ? u32le(t, o) : u32be(t, o)) : 0);
  const SIZES: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

  const readIfd = (off: number) => {
    const out = new Map<number, { type: number; count: number; valOff: number }>();
    if (off <= 0 || off + 2 > t.length) return out;
    const n = Math.min(u16(off), 500);
    for (let i = 0; i < n; i++) {
      const e = off + 2 + i * 12;
      if (e + 12 > t.length) break;
      const tag = u16(e), type = u16(e + 2), count = u32(e + 4);
      const size = (SIZES[type] ?? 1) * count;
      out.set(tag, { type, count, valOff: size <= 4 ? e + 8 : u32(e + 8) });
    }
    return out;
  };
  const str = (ent?: { count: number; valOff: number }) =>
    ent ? ascii(t, ent.valOff, Math.min(ent.count, 200)).replace(/\0+$/, "").trim() || undefined : undefined;
  const rational = (o: number) => {
    const d = u32(o + 4);
    return d ? u32(o) / d : 0;
  };

  const ifd0 = readIfd(u32(4));
  const make = str(ifd0.get(0x010f));
  const model = str(ifd0.get(0x0110));
  info.camera = [make, model && make && model.startsWith(make) ? model.slice(make.length).trim() : model].filter(Boolean).join(" ") || undefined;
  info.software = str(ifd0.get(0x0131));
  info.dateTime = str(ifd0.get(0x0132));
  const ori = ifd0.get(0x0112);
  if (ori) info.orientation = u16(ori.valOff);

  const exifPtr = ifd0.get(0x8769);
  if (exifPtr) {
    const ex = readIfd(u32(exifPtr.valOff));
    info.dateTime = str(ex.get(0x9003)) ?? info.dateTime;
    info.serial = str(ex.get(0xa431));
  }
  const gpsPtr = ifd0.get(0x8825);
  if (gpsPtr) {
    const g = readIfd(u32(gpsPtr.valOff));
    info.hasGps = g.size > 0;
    const lat = g.get(0x0002), lon = g.get(0x0004);
    if (lat && lon && lat.count >= 3 && lon.count >= 3) {
      const dms = (o: number) => rational(o) + rational(o + 8) / 60 + rational(o + 16) / 3600;
      let la = dms(lat.valOff), lo = dms(lon.valOff);
      if (str(g.get(0x0001)) === "S") la = -la;
      if (str(g.get(0x0003)) === "W") lo = -lo;
      if (Number.isFinite(la) && Number.isFinite(lo) && (la !== 0 || lo !== 0)) info.gps = { lat: +la.toFixed(6), lon: +lo.toFixed(6) };
    }
  }
  return info;
}

/** Minimal APP1 EXIF: only the Orientation tag. */
export function minimalOrientationApp1(orientation: number): Uint8Array {
  const tiff = [0x4d, 0x4d, 0x00, 0x2a, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, orientation & 0xff, 0, 0, 0, 0, 0, 0];
  const payload = [...Array.from("Exif").map((c) => c.charCodeAt(0)), 0, 0, ...tiff];
  const len = payload.length + 2;
  return new Uint8Array([0xff, 0xe1, len >> 8, len & 0xff, ...payload]);
}

/* ------------------------------ JPEG ------------------------------ */

interface JpegSeg {
  marker: number;
  start: number;
  end: number; // eksklusif
  data: Uint8Array; // payload without marker & length
}

function jpegSegments(b: Uint8Array): { segs: JpegSeg[]; scanStart: number } {
  const segs: JpegSeg[] = [];
  let o = 2;
  while (o + 4 <= b.length) {
    if (b[o] !== 0xff) throw new Error(i18n.t("media.metadata.errors.invalidJpeg"));
    let marker = b[o + 1];
    while (marker === 0xff && o + 2 < b.length) {
      o++; // padding 0xFF
      marker = b[o + 1];
    }
    if (marker === 0xda || marker === 0xd9) return { segs, scanStart: o };
    if (marker >= 0xd0 && marker <= 0xd7) {
      o += 2;
      continue;
    }
    const len = u16be(b, o + 2);
    if (len < 2 || o + 2 + len > b.length) throw new Error(i18n.t("media.metadata.errors.jpegTruncated"));
    segs.push({ marker, start: o, end: o + 2 + len, data: b.subarray(o + 4, o + 2 + len) });
    o += 2 + len;
  }
  throw new Error(i18n.t("media.metadata.errors.jpegNoScan"));
}

/**
 * End of the main image (after EOI). Data AFTER EOI, e.g. a second
 * MPF/"depth map" image from phones, complete with its own EXIF & GPS,
 * is dropped too. Progressive scans (many SOS + tables in between) are walked
 * per segment so FF D9 bytes inside a table are not mistaken for EOI.
 */
export function jpegEnd(b: Uint8Array, scanStart: number): number {
  let o = scanStart;
  while (o + 1 < b.length) {
    const m = b[o + 1];
    if (m === 0xd9) return o + 2;
    if (m >= 0xd0 && m <= 0xd7) {
      o += 2;
    } else {
      if (o + 4 > b.length) break;
      o += 2 + u16be(b, o + 2); // segmen (SOS/DHT/DQT/DRI/…)
      if (m !== 0xda) continue;
    }
    // Entropy data: continue until a real marker (not FF00 / RSTn / fill FF).
    while (o + 1 < b.length) {
      if (b[o] === 0xff) {
        const n = b[o + 1];
        if (n === 0x00 || n === 0xff || (n >= 0xd0 && n <= 0xd7)) {
          o += n === 0xff ? 1 : 2;
          continue;
        }
        break;
      }
      o++;
    }
  }
  return b.length; // EOI not found (truncated file): keep as is
}

const isExif = (s: JpegSeg) => s.marker === 0xe1 && ascii(s.data, 0, 6) === "Exif\0\0";
const isXmp = (s: JpegSeg) => s.marker === 0xe1 && ascii(s.data, 0, 28).startsWith("http://ns.adobe.com/");
const isIcc = (s: JpegSeg) => s.marker === 0xe2 && ascii(s.data, 0, 12) === "ICC_PROFILE\0";
const keepJpeg = (s: JpegSeg, o: StripOptions) =>
  !(s.marker >= 0xe0 && s.marker <= 0xef) && s.marker !== 0xfe
    ? true // segmen non-APP/COM (DQT, SOF, DHT, DRI…) selalu dipertahankan
    : s.marker === 0xe0 || s.marker === 0xee || (s.marker === 0xe2 && isIcc(s) && o.keepIcc);

function inspectJpeg(b: Uint8Array): MetadataReport {
  const { segs } = jpegSegments(b);
  const r: MetadataReport = { format: "jpeg", blocks: [], hasExif: false, hasGps: false, textKeys: [], hasIcc: false, removableBytes: 0 };
  for (const s of segs) {
    if (isExif(s)) {
      r.hasExif = true;
      r.blocks.push("EXIF");
      Object.assign(r, parseExifTiff(s.data.subarray(6)));
    } else if (isXmp(s)) r.blocks.push("XMP");
    else if (s.marker === 0xed) r.blocks.push("IPTC/Photoshop");
    else if (s.marker === 0xfe) r.blocks.push(i18n.t("media.metadata.blocks.comment"));
    else if (isIcc(s)) r.hasIcc = true;
    else if (s.marker >= 0xe3 && s.marker <= 0xef && s.marker !== 0xee) r.blocks.push(`APP${s.marker - 0xe0}`);
    if (!keepJpeg(s, { keepIcc: true, keepOrientation: false })) r.removableBytes += s.end - s.start;
  }
  const trailing = b.length - jpegEnd(b, jpegSegments(b).scanStart);
  if (trailing > 0) {
    r.blocks.push(i18n.t("media.metadata.blocks.trailing"));
    r.removableBytes += trailing;
  }
  r.blocks = Array.from(new Set(r.blocks));
  return r;
}

function stripJpeg(b: Uint8Array, o: StripOptions): Uint8Array {
  const { segs, scanStart } = jpegSegments(b);
  let orientation = 1;
  for (const s of segs) if (isExif(s)) orientation = parseExifTiff(s.data.subarray(6)).orientation ?? 1;
  const parts: Uint8Array[] = [b.subarray(0, 2)];
  let inserted = false;
  const insertOrientation = () => {
    if (!inserted && o.keepOrientation && orientation >= 2 && orientation <= 8) parts.push(minimalOrientationApp1(orientation));
    inserted = true;
  };
  for (const s of segs) {
    // The minimal EXIF goes after APP0 (or at the start when there is no APP0).
    if (s.marker !== 0xe0) insertOrientation();
    if (keepJpeg(s, o)) parts.push(b.subarray(s.start, s.end));
  }
  insertOrientation();
  parts.push(b.subarray(scanStart, jpegEnd(b, scanStart)));
  return concat(parts);
}

/* ------------------------------ PNG ------------------------------- */

const PNG_TEXT = new Set(["tEXt", "zTXt", "iTXt"]);
const PNG_META = new Set(["tEXt", "zTXt", "iTXt", "eXIf", "tIME"]);

function pngChunks(b: Uint8Array) {
  const out: { type: string; start: number; end: number; data: Uint8Array }[] = [];
  let o = 8;
  while (o + 12 <= b.length) {
    const len = u32be(b, o);
    const type = ascii(b, o + 4, 4);
    const end = o + 12 + len;
    if (end > b.length) throw new Error(i18n.t("media.metadata.errors.pngTruncated"));
    out.push({ type, start: o, end, data: b.subarray(o + 8, o + 8 + len) });
    o = end;
    if (type === "IEND") break;
  }
  return out;
}

function inspectPng(b: Uint8Array): MetadataReport {
  const r: MetadataReport = { format: "png", blocks: [], hasExif: false, hasGps: false, textKeys: [], hasIcc: false, removableBytes: 0 };
  for (const c of pngChunks(b)) {
    if (PNG_TEXT.has(c.type)) {
      const nul = c.data.indexOf(0);
      r.textKeys.push(ascii(c.data, 0, nul < 0 ? Math.min(79, c.data.length) : nul));
      r.blocks.push(i18n.t("media.metadata.blocks.text"));
    } else if (c.type === "eXIf") {
      r.hasExif = true;
      r.blocks.push("EXIF");
      Object.assign(r, parseExifTiff(c.data));
    } else if (c.type === "tIME") r.blocks.push(i18n.t("media.metadata.blocks.time"));
    else if (c.type === "iCCP") r.hasIcc = true;
    if (PNG_META.has(c.type)) r.removableBytes += c.end - c.start;
  }
  r.blocks = Array.from(new Set(r.blocks));
  return r;
}

function stripPng(b: Uint8Array, o: StripOptions): Uint8Array {
  const parts: Uint8Array[] = [b.subarray(0, 8)];
  for (const c of pngChunks(b)) {
    if (PNG_META.has(c.type) || (!o.keepIcc && c.type === "iCCP")) continue;
    parts.push(b.subarray(c.start, c.end));
  }
  return concat(parts);
}

/* ------------------------------ WebP ------------------------------ */

function webpChunks(b: Uint8Array) {
  const out: { id: string; start: number; end: number; data: Uint8Array }[] = [];
  let o = 12;
  while (o + 8 <= b.length) {
    const id = ascii(b, o, 4);
    const size = u32le(b, o + 4);
    const end = o + 8 + size + (size & 1);
    if (o + 8 + size > b.length) throw new Error(i18n.t("media.metadata.errors.webpTruncated"));
    out.push({ id, start: o, end: Math.min(end, b.length), data: b.subarray(o + 8, o + 8 + size) });
    o = end;
  }
  return out;
}

function inspectWebp(b: Uint8Array): MetadataReport {
  const r: MetadataReport = { format: "webp", blocks: [], hasExif: false, hasGps: false, textKeys: [], hasIcc: false, removableBytes: 0 };
  for (const c of webpChunks(b)) {
    if (c.id === "EXIF") {
      r.hasExif = true;
      r.blocks.push("EXIF");
      const d = ascii(c.data, 0, 6) === "Exif\0\0" ? c.data.subarray(6) : c.data;
      Object.assign(r, parseExifTiff(d));
      r.removableBytes += c.end - c.start;
    } else if (c.id === "XMP ") {
      r.blocks.push("XMP");
      r.removableBytes += c.end - c.start;
    } else if (c.id === "ICCP") r.hasIcc = true;
  }
  return r;
}

function stripWebp(b: Uint8Array, o: StripOptions): Uint8Array {
  const parts: Uint8Array[] = [];
  for (const c of webpChunks(b)) {
    if (c.id === "EXIF" || c.id === "XMP " || (!o.keepIcc && c.id === "ICCP")) continue;
    const chunk = b.slice(c.start, c.end);
    if (c.id === "VP8X" && chunk.length >= 9) {
      chunk[8] &= ~(0x08 | 0x04); // flag EXIF & XMP
      if (!o.keepIcc) chunk[8] &= ~0x20; // flag ICC
    }
    parts.push(chunk);
  }
  const body = concat(parts);
  const head = new Uint8Array(12);
  head.set(b.subarray(0, 4), 0);
  const size = body.length + 4;
  head[4] = size & 0xff;
  head[5] = (size >> 8) & 0xff;
  head[6] = (size >> 16) & 0xff;
  head[7] = (size >>> 24) & 0xff;
  head.set(b.subarray(8, 12), 8);
  return concat([head, body]);
}

/* ------------------------------ API ------------------------------- */

export function inspectMetadata(b: Uint8Array): MetadataReport {
  const f = detectMetaFormat(b);
  if (f === "jpeg") return inspectJpeg(b);
  if (f === "png") return inspectPng(b);
  if (f === "webp") return inspectWebp(b);
  throw new Error(i18n.t("media.metadata.errors.inspectUnsupported"));
}

export function stripMetadata(b: Uint8Array, o: StripOptions = { keepOrientation: true, keepIcc: true }): Uint8Array {
  const f = detectMetaFormat(b);
  if (f === "jpeg") return stripJpeg(b, o);
  if (f === "png") return stripPng(b, o);
  if (f === "webp") return stripWebp(b, o);
  throw new Error(i18n.t("media.metadata.errors.stripUnsupported"));
}
