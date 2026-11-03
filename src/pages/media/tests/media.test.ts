// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { sniffBytes } from "../lib/fileSniff";
import { validateFiles, summarizeRejections } from "../lib/validate";
import { deduplicateName, formatSize, formatTime, safeFileName, sizeDelta } from "../lib/format";
import { inspectMetadata, jpegEnd, minimalOrientationApp1, parseExifTiff, stripMetadata } from "../lib/metadata";
import { MAX_FRAMES, frameFileName, planFrames } from "../lib/videoPlan";
import { unsharpMask, upscaleTarget, UPSCALE_MAX_PIXELS } from "../lib/sharpen";
import { colorFormats, contrastRatio, extractPalette, rgbToCmyk, rgbToHsl, toHex } from "../lib/color";
import { parseSvgLength, svgIntrinsicSize } from "../lib/svg";
import { computeOutputSize } from "../converters/sizings";
import { resolveTarget } from "../converters/formats";
import { encodeBmp, encodeIco, fitSquare } from "../lib/imageFormats";
import { AUDIO_TARGETS, audioTarget, downmix, isAiff, parseAiff, outputBitrate, outputChannels, outputSampleRate, resampleLinear, vorbisQuality } from "../lib/audioFormats";

const bytes = (...parts) => {
  const out = [];
  for (const p of parts) {
    if (typeof p === "string") for (const c of p) out.push(c.charCodeAt(0));
    else if (typeof p === "number") out.push(p);
    else out.push(...p);
  }
  return new Uint8Array(out);
};
const be16 = (n) => [(n >> 8) & 255, n & 255];
const be32 = (n) => [(n >>> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255];
const le32 = (n) => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];

/* ------------------------------ sniffing ----------------------------- */

test("sniff: format dikenali dari isi, bukan nama", () => {
  assert.equal(sniffBytes(bytes(0x89, "PNG", 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0)), "png");
  assert.equal(sniffBytes(bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0)), "jpeg");
  assert.equal(sniffBytes(bytes("GIF89a", 0, 0)), "gif");
  assert.equal(sniffBytes(bytes("RIFF", 0, 0, 0, 0, "WEBP", "VP8 ")), "webp");
  assert.equal(sniffBytes(bytes("RIFF", 0, 0, 0, 0, "AVI ", "LIST")), "avi");
  assert.equal(sniffBytes(bytes(0, 0, 0, 0x1c, "ftyp", "avif", 0, 0, 0, 0, "mif1", "miaf")), "avif");
  assert.equal(sniffBytes(bytes(0, 0, 0, 0x18, "ftyp", "heic", 0, 0, 0, 0, "mif1", "heic")), "heic");
  assert.equal(sniffBytes(bytes(0, 0, 0, 0x14, "ftyp", "qt  ", 0, 0, 0, 0, "qt  ")), "mov");
  assert.equal(sniffBytes(bytes(0, 0, 0, 0x18, "ftyp", "isom", 0, 0, 2, 0, "isom", "mp41")), "mp4");
  assert.equal(sniffBytes(bytes(0x1a, 0x45, 0xdf, 0xa3, 0x9f, 0x42, 0x82, 0x84, "webm")), "webm");
  assert.equal(sniffBytes(bytes(0x1a, 0x45, 0xdf, 0xa3, 0x9f, 0x42, 0x82, 0x88, "matroska")), "mkv");
  assert.equal(sniffBytes(bytes("BM", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)), "bmp");
  assert.equal(sniffBytes(bytes("﻿".length ? [0xef, 0xbb, 0xbf] : [], '<?xml version="1.0"?>\n<!-- x -->\n<svg xmlns="http://www.w3.org/2000/svg">')), "svg");
  assert.equal(sniffBytes(bytes("<html><body>bukan svg</body></html>")), "unknown");
  assert.equal(sniffBytes(bytes("halo dunia ini teks biasa")), "unknown");
});

test("validasi: kosong, terlalu besar, jenis salah, menyamar, batas jumlah", async () => {
  const png = new File([bytes(0x89, "PNG", 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13)], "a.png");
  const fakePng = new File([bytes("<html>bukan gambar</html>")], "palsu.png", { type: "image/png" });
  const jpegNamedPng = new File([bytes(0xff, 0xd8, 0xff, 0xe0, 0, 16)], "foto.png", { type: "image/png" });
  const empty = new File([], "kosong.jpg");
  const big = new File([new Uint8Array(2048)], "besar.png");
  const heic = new File([bytes(0, 0, 0, 0x18, "ftyp", "heic", 0, 0, 0, 0, "mif1", "heic")], "iphone.heic");
  const res = await validateFiles([png, fakePng, jpegNamedPng, empty, big, heic], { kinds: ["png", "jpeg"], maxBytes: 1024 });
  assert.deepEqual(res.accepted.map((a) => [a.file.name, a.kind]), [["a.png", "png"], ["foto.png", "jpeg"]]);
  const reasons = Object.fromEntries(res.rejected.map((r) => [r.name, r.reason]));
  assert.match(reasons["palsu.png"], /tidak dikenali/);
  assert.match(reasons["kosong.jpg"], /kosong/);
  assert.match(reasons["besar.png"], /melebihi batas/);
  assert.match(reasons["iphone.heic"], /HEIC/);
  assert.match(summarizeRejections(res.rejected), /^4 file dilewati/);
  const lim = await validateFiles([png, png, png], { kinds: ["png"], maxBytes: 1e6, maxFiles: 2 });
  assert.equal(lim.accepted.length, 2);
  assert.match(lim.rejected[0].reason, /batas 2 file/);
});

test("format: ukuran, waktu, nama aman & unik", () => {
  assert.equal(formatSize(512), "512 B");
  assert.equal(formatSize(1536), "1.5 KB");
  assert.equal(formatSize(3 * 1024 ** 3), "3.00 GB");
  assert.equal(formatSize(NaN), "—");
  assert.equal(formatTime(75.5), "1:15.50");
  assert.equal(formatTime(3725), "1:02:05.00");
  assert.equal(formatTime(Infinity), "—");
  assert.equal(sizeDelta(100, 40), -60);
  assert.equal(sizeDelta(0, 40), null);
  assert.equal(safeFileName("../../etc/pass:wd?.png"), "etc-pass-wd-.png");
  assert.equal(safeFileName("..."), "file");
  const used = new Set(["a.png", "a-1.png"]);
  assert.equal(deduplicateName("a.png", used), "a-2.png");
  assert.equal(deduplicateName("b.png", used), "b.png");
});

/* ------------------------------ metadata ----------------------------- */

/** TIFF big-endian: IFD0 (Make, Model, Orientation, GPS ptr) + IFD GPS. */
function buildExifTiff({ orientation = 6, gps = true } = {}) {
  const make = "Canon\0", model = "Canon EOS R6\0";
  const ifd0Count = gps ? 4 : 3;
  const ifd0Off = 8;
  const ifd0Size = 2 + ifd0Count * 12 + 4;
  const gpsOff = ifd0Off + ifd0Size;
  const gpsCount = 4;
  const gpsSize = gps ? 2 + gpsCount * 12 + 4 : 0;
  const dataOff = gpsOff + gpsSize;
  const data = [];
  const put = (arr) => {
    const off = dataOff + data.length;
    data.push(...arr);
    return off;
  };
  const makeOff = put([...make].map((c) => c.charCodeAt(0)));
  const modelOff = put([...model].map((c) => c.charCodeAt(0)));
  const rat = (n, d) => [...be32(n), ...be32(d)];
  const latOff = put([...rat(6, 1), ...rat(10, 1), ...rat(30, 1)]); // 6°10'30"
  const lonOff = put([...rat(106, 1), ...rat(49, 1), ...rat(0, 1)]);
  const entry = (tag, type, count, value4) => [...be16(tag), ...be16(type), ...be32(count), ...value4];
  const ifd0 = [
    ...be16(ifd0Count),
    ...entry(0x010f, 2, make.length, be32(makeOff)),
    ...entry(0x0110, 2, model.length, be32(modelOff)),
    ...entry(0x0112, 3, 1, [...be16(orientation), 0, 0]),
    ...(gps ? entry(0x8825, 4, 1, be32(gpsOff)) : []),
    ...be32(0),
  ];
  const gpsIfd = gps
    ? [
        ...be16(gpsCount),
        ...entry(0x0001, 2, 2, [..."S\0"].map((c) => c.charCodeAt(0)).concat([0, 0])),
        ...entry(0x0002, 5, 3, be32(latOff)),
        ...entry(0x0003, 2, 2, [..."E\0"].map((c) => c.charCodeAt(0)).concat([0, 0])),
        ...entry(0x0004, 5, 3, be32(lonOff)),
        ...be32(0),
      ]
    : [];
  return new Uint8Array([0x4d, 0x4d, 0x00, 0x2a, ...be32(8), ...ifd0, ...gpsIfd, ...data]);
}

const seg = (marker, payload) => [0xff, marker, ...be16(payload.length + 2), ...payload];
const str = (s) => [...s].map((c) => c.charCodeAt(0));

function buildJpeg({ trailing = true } = {}) {
  const exif = [...str("Exif\0\0"), ...buildExifTiff()];
  return new Uint8Array([
    0xff, 0xd8,
    ...seg(0xe0, [...str("JFIF\0"), 1, 1, 0, 0, 1, 0, 1, 0, 0]),
    ...seg(0xe1, exif),
    ...seg(0xe1, [...str("http://ns.adobe.com/xap/1.0/\0"), ...str("<x:xmpmeta/>")]),
    ...seg(0xe2, [...str("ICC_PROFILE\0"), 1, 1, 9, 9, 9]),
    ...seg(0xed, [...str("Photoshop 3.0\0"), 1, 2, 3]),
    ...seg(0xee, [...str("Adobe"), 0, 100, 0, 0, 0, 0, 1]),
    ...seg(0xfe, str("komentar rahasia")),
    ...seg(0xdb, [0, ...new Array(64).fill(1)]),
    ...seg(0xc0, [8, 0, 2, 0, 2, 1, 1, 0x11, 0]),
    ...seg(0xc4, [0, 0xff, 0xd9, 0xff, 0xd9]), // byte FF D9 di dalam tabel (bukan EOI)
    ...seg(0xda, [1, 1, 0, 0, 63, 0]),
    0x12, 0xff, 0x00, 0x34, 0xff, 0xd0, 0x56, // data entropi: FF00 & RST0
    0xff, 0xd9,
    ...(trailing ? [0xff, 0xd8, ...seg(0xe1, [...str("Exif\0\0"), ...buildExifTiff()]), 0xff, 0xd9] : []),
  ]);
}

test("metadata JPEG: GPS, kamera, orientasi terbaca; strip lossless & data setelah EOI dibuang", () => {
  const jpg = buildJpeg();
  const r = inspectMetadata(jpg);
  assert.equal(r.format, "jpeg");
  assert.equal(r.hasGps, true);
  assert.deepEqual(r.gps, { lat: -6.175, lon: 106.816667 });
  assert.equal(r.camera, "Canon EOS R6");
  assert.equal(r.orientation, 6);
  assert.equal(r.hasIcc, true);
  for (const b of ["EXIF", "XMP", "IPTC/Photoshop", "Komentar"]) assert.ok(r.blocks.includes(b), b);
  assert.ok(r.blocks.some((b) => /setelah gambar/.test(b)));

  const out = stripMetadata(jpg, { keepOrientation: true, keepIcc: true });
  const r2 = inspectMetadata(out);
  assert.equal(r2.hasGps, false);
  assert.equal(r2.camera, undefined);
  assert.equal(r2.orientation, 6, "orientasi dipertahankan lewat EXIF minimal");
  assert.deepEqual(r2.blocks, ["EXIF"]);
  assert.equal(r2.hasIcc, true);
  // Segmen gambar utuh: dari DQT sampai EOI identik.
  const tail = (b) => Array.from(b.slice(b.indexOf(0xdb) - 1, jpegEnd(b, findSos(b))));
  assert.deepEqual(tail(out), tail(jpg));
  assert.equal(out[out.length - 2], 0xff);
  assert.equal(out[out.length - 1], 0xd9);
  assert.ok(String.fromCharCode(...out).includes("Adobe"), "APP14 Adobe dipertahankan");
  assert.ok(!String.fromCharCode(...out).includes("komentar rahasia"));

  const bare = stripMetadata(jpg, { keepOrientation: false, keepIcc: false });
  const r3 = inspectMetadata(bare);
  assert.equal(r3.hasExif, false);
  assert.equal(r3.hasIcc, false);
  assert.deepEqual(r3.blocks, []);
});

function findSos(b) {
  for (let i = 2; i < b.length - 1; i++) if (b[i] === 0xff && b[i + 1] === 0xda) return i;
  return -1;
}

test("metadata JPEG: EXIF minimal valid & parser tahan data rusak", () => {
  const app1 = minimalOrientationApp1(8);
  assert.equal(app1.length, 2 + ((app1[2] << 8) | app1[3]));
  assert.equal(parseExifTiff(app1.slice(10)).orientation, 8);
  const broken = parseExifTiff(new Uint8Array([0x4d, 0x4d, 0, 0x2a, 0xff, 0xff, 0xff, 0xff]));
  assert.equal(broken.hasGps, false);
  assert.equal(broken.camera, undefined);
  assert.throws(() => inspectMetadata(new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0xff, 0xff])), /terpotong/);
  assert.throws(() => stripMetadata(bytes("GIF89a")), /tidak didukung/);
});

function pngChunk(type, data) {
  return [...be32(data.length), ...str(type), ...data, 0, 0, 0, 0];
}

test("metadata PNG: teks/prompt AI, eXIf, tIME dibuang; IDAT utuh", () => {
  const png = new Uint8Array([
    0x89, ...str("PNG"), 0x0d, 0x0a, 0x1a, 0x0a,
    ...pngChunk("IHDR", [0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]),
    ...pngChunk("iCCP", [...str("sRGB\0"), 0, 1, 2]),
    ...pngChunk("tEXt", [...str("parameters\0"), ...str("a cat, masterpiece")]),
    ...pngChunk("tEXt", [...str("Software\0"), ...str("Photoshop")]),
    ...pngChunk("eXIf", Array.from(buildExifTiff())),
    ...pngChunk("tIME", [7, 0xe8, 1, 1, 0, 0, 0]),
    ...pngChunk("IDAT", [1, 2, 3, 4, 5]),
    ...pngChunk("IEND", []),
  ]);
  const r = inspectMetadata(png);
  assert.deepEqual(r.textKeys, ["parameters", "Software"]);
  assert.equal(r.hasGps, true);
  assert.ok(r.blocks.includes("Waktu"));
  const out = stripMetadata(png, { keepOrientation: true, keepIcc: false });
  const r2 = inspectMetadata(out);
  assert.deepEqual(r2.textKeys, []);
  assert.equal(r2.hasGps, false);
  assert.equal(r2.hasIcc, false);
  assert.ok(String.fromCharCode(...out).includes("IDAT"));
  assert.equal(out.length, png.length - r.removableBytes - (12 + 8));
});

test("metadata WebP: chunk EXIF/XMP dibuang, flag VP8X & ukuran RIFF diperbarui", () => {
  const exif = Array.from(buildExifTiff());
  const chunk = (id, data) => [...str(id), ...le32(data.length), ...data, ...(data.length & 1 ? [0] : [])];
  const body = [
    ...str("WEBP"),
    ...chunk("VP8X", [0x08 | 0x04 | 0x10, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    ...chunk("VP8L", [1, 2, 3]),
    ...chunk("EXIF", exif),
    ...chunk("XMP ", str("<x:xmpmeta/>")),
  ];
  const webp = new Uint8Array([...str("RIFF"), ...le32(body.length), ...body]);
  const r = inspectMetadata(webp);
  assert.equal(r.hasGps, true);
  assert.deepEqual(r.blocks, ["EXIF", "XMP"]);
  const out = stripMetadata(webp, { keepOrientation: true, keepIcc: true });
  const size = out[4] | (out[5] << 8) | (out[6] << 16) | (out[7] << 24);
  assert.equal(size, out.length - 8);
  assert.equal(out[20] & 0x0c, 0, "flag EXIF/XMP dimatikan");
  assert.equal(out[20] & 0x10, 0x10, "flag alpha tetap");
  assert.deepEqual(inspectMetadata(out).blocks, []);
});

/* ------------------------------ video ------------------------------- */

test("rencana frame: fps, interval, jumlah, rentang, batas, durasi rusak", () => {
  assert.deepEqual(planFrames({ duration: 3, mode: { kind: "fps", fps: 1 } }).times, [0, 1, 2]);
  assert.equal(planFrames({ duration: 3.5, mode: { kind: "fps", fps: 1 } }).times.length, 4);
  assert.deepEqual(planFrames({ duration: 10, mode: { kind: "interval", seconds: 4 } }).times, [0, 4, 8]);
  const c = planFrames({ duration: 10, mode: { kind: "count", count: 4 } });
  assert.deepEqual(c.times, [0, 2.5, 5, 7.5]);
  const r = planFrames({ duration: 10, mode: { kind: "fps", fps: 2 }, start: 2, end: 4 });
  assert.deepEqual(r.times, [2, 2.5, 3, 3.5]);
  const big = planFrames({ duration: 600, mode: { kind: "fps", fps: 60 } });
  assert.equal(big.requested, 36000);
  assert.equal(big.times.length, MAX_FRAMES);
  assert.equal(big.truncated, true);
  for (const d of [Infinity, NaN, 0, -1]) assert.match(planFrames({ duration: d, mode: { kind: "fps", fps: 1 } }).error, /Durasi/);
  const pt = planFrames({ duration: 5, mode: { kind: "fps", fps: 1 }, start: 5, end: 5 });
  assert.equal(pt.times.length, 1);
  assert.ok(pt.times[0] < 5, "tidak tepat di ujung video");
  assert.equal(frameFileName("klip", 7, 1.234, "webp"), "klip-frame-0007-0001234ms.webp");
});

/* ------------------------------ upscale ------------------------------ */

test("upscale: ukuran dijepit ke batas aman, rasio tetap", () => {
  assert.deepEqual(upscaleTarget(1000, 500, 2), { width: 2000, height: 1000, scale: 2, clamped: false, tooLarge: false });
  const t = upscaleTarget(4000, 3000, 4);
  assert.equal(t.clamped, true);
  assert.ok(t.width * t.height <= UPSCALE_MAX_PIXELS);
  assert.ok(Math.abs(t.width / t.height - 4 / 3) < 0.01);
  assert.equal(upscaleTarget(20000, 100, 2).tooLarge, true, "sisi sudah melebihi batas");
  assert.equal(upscaleTarget(5000, 4000, 2).tooLarge, true, "20 MP sudah melebihi 16,7 MP");
});

test("unsharp mask: tepi lebih kontras, area rata tidak berubah, alpha utuh", () => {
  const w = 8, h = 4;
  const d = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      const v = x < 4 ? 100 : 160;
      d[o] = d[o + 1] = d[o + 2] = v;
      d[o + 3] = 200;
    }
  const out = unsharpMask(d.slice(), w, h, { amount: 1, radius: 1, threshold: 0 });
  const px = (x) => out[(1 * w + x) * 4];
  assert.ok(px(3) < 100 && px(4) > 160, "tepi dipertajam");
  assert.equal(px(0), 100);
  assert.equal(px(7), 160);
  assert.ok(Array.from({ length: w * h }, (_, i) => out[i * 4 + 3]).every((a) => a === 200));
  assert.deepEqual(unsharpMask(d.slice(), w, h, { amount: 0, radius: 1, threshold: 0 }), d);
});

/* ------------------------------ warna ------------------------------- */

test("warna: konversi, alpha, kontras WCAG, palet dominan", () => {
  assert.equal(toHex({ r: 255, g: 0, b: 128, a: 255 }), "#FF0080");
  assert.equal(toHex({ r: 255, g: 0, b: 128, a: 128 }, true), "#FF008080");
  assert.deepEqual(rgbToHsl(255, 0, 0), { h: 0, s: 100, l: 50 });
  assert.deepEqual(rgbToCmyk(0, 0, 0), { c: 0, m: 0, y: 0, k: 100 });
  assert.equal(Math.round(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })), 21);
  assert.equal(colorFormats({ r: 1, g: 2, b: 3, a: 128 })[1].value, "rgba(1, 2, 3, 0.5)");
  const data = new Uint8ClampedArray(100 * 4);
  for (let i = 0; i < 100; i++) {
    const red = i < 70;
    data.set(red ? [220, 20, 20, 255] : [20, 20, 220, 255], i * 4);
  }
  data.set([0, 255, 0, 0], 0); // transparan diabaikan
  const pal = extractPalette(data, 4);
  assert.equal(toHex(pal[0]), "#DC1414");
  assert.ok(pal[0].share > 0.6);
  assert.ok(pal.some((c) => toHex(c) === "#1414DC"));
  assert.deepEqual(extractPalette(new Uint8ClampedArray(16)), []);
});

/* ------------------------------ svg & ukuran ------------------------- */

test("SVG: satuan panjang & ukuran intrinsik", () => {
  assert.equal(parseSvgLength("100"), 100);
  assert.equal(parseSvgLength("1in"), 96);
  assert.ok(Math.abs(parseSvgLength("2.54cm") - 96) < 1e-9);
  assert.equal(parseSvgLength("100%"), null);
  assert.equal(parseSvgLength("auto"), null);
  assert.deepEqual(svgIntrinsicSize({ width: "100%", viewBox: "0 0 40 20" }), { width: 40, height: 20, known: true });
  assert.deepEqual(svgIntrinsicSize({ width: "200", viewBox: "0 0 40 20" }), { width: 200, height: 100, known: true });
  assert.deepEqual(svgIntrinsicSize({}, 512), { width: 512, height: 512, known: false });
});

test("resize: fit-box, tanpa memperbesar, nilai tidak valid, batas Canvas", () => {
  const r = (mode, w, h, extra = {}) => computeOutputSize(4000, 2000, { enabled: true, mode, width: w, height: h, ...extra });
  assert.deepEqual(r("fit-box", 1000, 1000), { width: 1000, height: 500 });
  assert.deepEqual(r("fit-width", 800, 0), { width: 800, height: 400 });
  assert.deepEqual(r("fit-height", 0, 300), { width: 600, height: 300 });
  assert.deepEqual(r("exact", 100, 100), { width: 100, height: 100 });
  assert.deepEqual(r("fit-width", 8000, 0, { noUpscale: true }), { width: 4000, height: 2000 });
  assert.deepEqual(r("fit-width", NaN, 0), { width: 4000, height: 2000 });
  assert.deepEqual(r("fit-width", 40000, 0), { width: 16384, height: 8192 });
  assert.deepEqual(computeOutputSize(10, 10, { enabled: false, mode: "exact", width: 1, height: 1 }), { width: 10, height: 10 });
});

test("format tujuan: 'format asli' & sumber yang tidak bisa di-encode", () => {
  assert.equal(resolveTarget("same", "jpeg").id, "jpeg");
  // v5: GIF, AVIF, TIFF, JXL, QOI bisa di-encode (codec WASM) → tetap formatnya.
  assert.equal(resolveTarget("same", "gif").id, "gif");
  assert.equal(resolveTarget("same", "avif").id, "avif");
  assert.equal(resolveTarget("same", "tiff").id, "tiff");
  assert.equal(resolveTarget("same", "heic").id, "png");
  assert.equal(resolveTarget("webp", "gif").id, "webp");
});


/* ------------------------- v5: format baru ------------------------- */

test("sniff: audio & gambar baru (WAV, FLAC, AIFF, MP3, AAC, M4A, QOI, JXL)", () => {
  assert.equal(sniffBytes(bytes("RIFF", 0, 0, 0, 0, "WAVE", "fmt ")), "wav");
  assert.equal(sniffBytes(bytes("fLaC", 0, 0, 0, 34)), "flac");
  assert.equal(sniffBytes(bytes("FORM", 0, 0, 0, 0, "AIFF", "COMM")), "aiff");
  assert.equal(sniffBytes(bytes("ID3", 4, 0, 0, 0, 0, 0, 0)), "mp3");
  assert.equal(sniffBytes(bytes(0xff, 0xfb, 0x90, 0x64, 0, 0)), "mp3");
  assert.equal(sniffBytes(bytes(0xff, 0xf1, 0x50, 0x80, 0, 0)), "aac");
  assert.equal(sniffBytes(bytes(0, 0, 0, 0x20, "ftyp", "M4A ", 0, 0, 0, 0, "M4A ", "mp42")), "m4a");
  assert.equal(sniffBytes(bytes("qoif", 0, 0, 0, 1, 0, 0, 0, 1, 4, 0)), "qoi");
  assert.equal(sniffBytes(bytes(0xff, 0x0a, 0, 0)), "jxl");
});

test("BMP: header & urutan piksel BGRA bawah-ke-atas", () => {
  // 2×2: merah, hijau / biru, putih transparan
  const px = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 0]);
  const buf = encodeBmp(px, 2, 2);
  const v = new DataView(buf);
  assert.equal(String.fromCharCode(v.getUint8(0), v.getUint8(1)), "BM");
  assert.equal(v.getUint32(2, true), buf.byteLength);
  assert.equal(v.getInt32(18, true), 2);
  assert.equal(v.getUint16(28, true), 32);
  const data = new Uint8Array(buf, v.getUint32(10, true));
  // Baris pertama di file = baris bawah gambar (biru lalu putih transparan).
  assert.deepEqual([...data.slice(0, 8)], [255, 0, 0, 255, 255, 255, 255, 0]);
  assert.deepEqual([...data.slice(8, 12)], [0, 0, 255, 255]);
});

test("ICO: direktori berisi PNG per ukuran, rasio dipertahankan", async () => {
  const src = { width: 4, height: 2, data: new Uint8ClampedArray(4 * 2 * 4).fill(200) };
  const sq = fitSquare(src, 4);
  // Gambar 4×2 di kotak 4×4: baris atas & bawah transparan.
  assert.equal(sq[3], 0);
  assert.equal(sq[(1 * 4 + 1) * 4 + 3], 200);
  const fakePng = async (img) => new Uint8Array([img.width, img.height]).buffer;
  const ico = await encodeIco(src, [256, 16, 16, 999], fakePng);
  const v = new DataView(ico);
  assert.equal(v.getUint16(2, true), 1);
  assert.equal(v.getUint16(4, true), 2);
  assert.equal(v.getUint8(6), 16);
  assert.equal(v.getUint8(6 + 16), 0); // 256 ditulis sebagai 0
  const off = v.getUint32(6 + 16 + 12, true);
  assert.deepEqual([...new Uint8Array(ico, off, 2)], [0, 0]); // 256 & 0xff
});

test("audio: batas kanal, sample rate, bitrate per format", () => {
  assert.deepEqual(AUDIO_TARGETS.map((t) => t.id), ["mp3", "wav", "ogg", "opus", "flac", "aac", "m4a"]);
  const mp3 = audioTarget("mp3");
  assert.equal(outputChannels(mp3, null, 6), 2);
  assert.equal(outputChannels(mp3, 1, 2), 1);
  assert.equal(outputChannels(audioTarget("flac"), null, 6), 6);
  assert.equal(outputSampleRate(mp3, null, 96000), 48000);
  assert.equal(outputSampleRate(mp3, null, 22050), 22050);
  assert.equal(outputSampleRate(audioTarget("wav"), null, 96000), 96000);
  assert.equal(outputSampleRate(audioTarget("opus"), 22050, 44100), 48000);
  assert.equal(outputBitrate(mp3, 192, 2), 192000);
  assert.equal(outputBitrate(audioTarget("opus"), 320, 2), 256000);
  assert.equal(outputBitrate(audioTarget("opus"), 320, 1), 128000);
  assert.equal(vorbisQuality(128), 4);
  assert.ok(vorbisQuality(320) > vorbisQuality(192));
  assert.equal(vorbisQuality(32), 0);
});

test("audio: downmix & resample cadangan", () => {
  const six = Array.from({ length: 6 }, (_, c) => new Float32Array([c, c]));
  const st = downmix(six, 2);
  assert.equal(st.length, 2);
  assert.equal(st[0][0], (0 + 2 + 4) / 3);
  assert.equal(st[1][0], (1 + 3 + 5) / 3);
  assert.equal(downmix(six, 1)[0][0], 15 / 6);
  const r = resampleLinear(new Float32Array([0, 1, 0, 1]), 96000, 48000);
  assert.equal(r.length, 2);
  assert.deepEqual([...r], [0, 0]);
});

test("audio: AIFF 16-bit big-endian dibaca sendiri", () => {
  const comm = [...be16(2), ...be32(2), ...be16(16), 0x40, 0x0e, 0xac, 0x44, 0, 0, 0, 0, 0, 0];
  const ssnd = [...be32(0), ...be32(0), ...be16(16384), ...be16(-16384 & 0xffff), ...be16(0), ...be16(32767)];
  const body = bytes("AIFF", "COMM", be32(comm.length), comm, "SSND", be32(ssnd.length), ssnd);
  const file = bytes("FORM", be32(body.length), body);
  assert.equal(isAiff(file), true);
  const r = parseAiff(file.buffer);
  assert.equal(r.sampleRate, 44100);
  assert.equal(r.channels.length, 2);
  assert.deepEqual([...r.channels[0]], [0.5, 0]);
  assert.deepEqual([...r.channels[1]], [-0.5, 32767 / 32768]);
});
