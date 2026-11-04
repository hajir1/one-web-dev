// ─── converters/index.ts ─────────────────────────────────────────────────────
// Conversion dispatcher per CATEGORY COMBINATION (raster/vector), not per
// format pair. Every path now: accepts an AbortSignal, checks limits
// size, verifies the output format, and frees the Canvas after use.

import i18n from "../../../i18n";
import type { SniffedKind } from "../lib/fileSniff";
import { parseSvg, sanitizeSvgDoc, svgIntrinsicSize } from "../lib/svg";
import { runImageWorker } from "../workers/runWorker";
import { decodeInWorker, encodeInWorker } from "../workers/codecClient";
import type { DecodeFormat, EncodeFormat } from "../workers/codecWorker";
import { getFormat, sourceCategory, WORKER_DECODED, type FormatDefinition } from "./formats";
import {
  assertInputSize,
  context2d,
  createCanvas,
  decodeImage,
  encodeCanvas,
  releaseCanvas,
  throwIfAborted,
} from "./image";
import type { ConversionOptions } from "./options";
import { computeOutputSize } from "./sizings";

export interface ConvertContext {
  signal?: AbortSignal;
  onProgress?: (pct: number) => void;
}

export interface ConvertResult {
  blob: Blob;
  format: FormatDefinition;
  width?: number;
  height?: number;
  /** Note for the user (e.g. the image was downscaled before tracing). */
  notes: string[];
}

/** Pixel limit before tracing; above this the image is downscaled first. */
const TRACE_MAX_PIXELS = 1_500_000;

const qualityFor = (target: FormatDefinition, o: ConversionOptions) =>
  target.id === "png" ? undefined : target.id === "webp" && o.losslessWebp ? 1 : Math.min(Math.max(o.quality / 100, 0.01), 1);

/** Formats Canvas can still create if the WASM codec fails to load (e.g. a CSP blocks WebAssembly). */
const CANVAS_FALLBACK = new Set(["png", "jpeg", "webp"]);

async function encodeTarget(canvas: HTMLCanvasElement, ctx2d: CanvasRenderingContext2D, target: FormatDefinition, o: ConversionOptions, cctx: ConvertContext, notes: string[]): Promise<Blob> {
  const { width, height } = canvas;
  const data = ctx2d.getImageData(0, 0, width, height).data;
  cctx.onProgress?.(55);
  try {
    const bytes = await encodeInWorker(
      target.id as EncodeFormat,
      width,
      height,
      data,
      { quality: o.quality, lossless: !!target.losslessOption && o.losslessWebp, icoSizes: o.icoSizes },
      cctx.signal,
    );
    return new Blob([bytes], { type: target.mime });
  } catch (e) {
    if ((e as Error)?.name === "AbortError" || !CANVAS_FALLBACK.has(target.id)) throw e;
    // WASM codec unavailable → the browser's built-in encoder (slightly different quality).
    notes.push(i18n.t("media.codec.canvasFallback"));
    return encodeCanvas(canvas, target.mime, qualityFor(target, o));
  }
}

async function drawToFormat(
  source: CanvasImageSource,
  naturalW: number,
  naturalH: number,
  target: FormatDefinition,
  o: ConversionOptions,
  cctx: ConvertContext,
): Promise<ConvertResult> {
  const { width, height } = computeOutputSize(naturalW, naturalH, o.resize);
  const canvas = createCanvas(width, height);
  try {
    const ctx = context2d(canvas, { willReadFrequently: true });
    if (!target.alpha) {
      // JPEG without alpha: fill the background first (the color is already validated in the UI).
      ctx.fillStyle = o.jpegBackgroundColor;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, width, height);
    throwIfAborted(cctx.signal);
    const notes: string[] = [];
    const blob = await encodeTarget(canvas, ctx, target, o, cctx, notes);
    cctx.onProgress?.(95);
    return { blob, format: target, width, height, notes };
  } finally {
    releaseCanvas(canvas);
  }
}

/**
 * Reads a raster image: the browser decoder when possible; TIFF/JXL/QOI (and AVIF/WebP
 * in old browsers) via the WASM codec in the worker.
 */
async function loadRaster(file: Blob, kind: SniffedKind, signal?: AbortSignal): Promise<{ source: CanvasImageSource; width: number; height: number; close: () => void }> {
  const viaWorker = async () => {
    const pixels = await decodeInWorker(kind as DecodeFormat, await file.arrayBuffer(), signal);
    assertInputSize(pixels.width, pixels.height);
    const c = createCanvas(pixels.width, pixels.height);
    context2d(c).putImageData(new ImageData(pixels.data as Uint8ClampedArray<ArrayBuffer>, pixels.width, pixels.height), 0, 0);
    return { source: c, width: pixels.width, height: pixels.height, close: () => releaseCanvas(c) };
  };
  if (WORKER_DECODED.includes(kind)) return viaWorker();
  try {
    const img = await decodeImage(file, signal);
    return { source: img.source, width: img.width, height: img.height, close: () => img.close() };
  } catch (e) {
    if ((e as Error)?.name === "AbortError" || !(kind === "avif" || kind === "webp")) throw e;
    return viaWorker();
  }
}

async function rasterToRaster(file: Blob, kind: SniffedKind, target: FormatDefinition, o: ConversionOptions, ctx: ConvertContext) {
  const img = await loadRaster(file, kind, ctx.signal);
  try {
    assertInputSize(img.width, img.height);
    ctx.onProgress?.(25);
    return await drawToFormat(img.source, img.width, img.height, target, o, ctx);
  } finally {
    img.close();
  }
}

async function rasterToVector(file: Blob, kind: SniffedKind, o: ConversionOptions, ctx: ConvertContext): Promise<ConvertResult> {
  const img = await loadRaster(file, kind, ctx.signal);
  const notes: string[] = [];
  let canvas: HTMLCanvasElement | null = null;
  try {
    assertInputSize(img.width, img.height);
    const scale = Math.min(1, Math.sqrt(TRACE_MAX_PIXELS / (img.width * img.height)));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    if (scale < 1) notes.push(i18n.t("media.convert.traceDownscaled", { w, h }));
    canvas = createCanvas(w, h);
    const c2d = context2d(canvas, { willReadFrequently: true });
    c2d.drawImage(img.source, 0, 0, w, h);
    const data = c2d.getImageData(0, 0, w, h).data;
    ctx.onProgress?.(20);
    const res = await runImageWorker(
      {
        op: "trace",
        width: w,
        height: h,
        data,
        options: { numberofcolors: o.trace.numberOfColors, pathomit: o.trace.pathomit, ltres: o.trace.ltres, qtres: o.trace.qtres },
      },
      ctx.signal,
    );
    let svg = res.svg ?? "";
    if (!svg.includes("<path")) throw new Error(i18n.t("media.convert.traceEmpty"));
    // Restore the original size: viewBox stays at the tracing size, width/height at the original size.
    svg = svg.replace(/^\s*<svg\s/, `<svg width="${img.width}" height="${img.height}" `);
    return { blob: new Blob([svg], { type: "image/svg+xml" }), format: getFormat("svg"), width: img.width, height: img.height, notes };
  } finally {
    if (canvas) releaseCanvas(canvas);
    img.close();
  }
}

async function readSvg(file: Blob) {
  const text = await file.text();
  const { doc, svg } = parseSvg(text);
  const removed = sanitizeSvgDoc(doc);
  return { doc, svg, removed };
}

async function vectorToRaster(file: Blob, target: FormatDefinition, o: ConversionOptions, ctx: ConvertContext): Promise<ConvertResult> {
  const { doc, svg, removed } = await readSvg(file);
  const size = svgIntrinsicSize(
    { width: svg.getAttribute("width"), height: svg.getAttribute("height"), viewBox: svg.getAttribute("viewBox") },
    o.resize.enabled ? o.resize.width : 1024,
  );
  const w = Math.max(1, Math.round(size.width));
  const h = Math.max(1, Math.round(size.height));
  // Make sure the SVG has an explicit size so <img> renders with the right ratio.
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));
  if (!svg.getAttribute("viewBox") && size.known) svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const blob = new Blob([new XMLSerializer().serializeToString(doc)], { type: "image/svg+xml" });
  const img = await decodeImage(blob, ctx.signal);
  try {
    const out = await drawToFormat(img.source, w, h, target, o, ctx);
    if (!size.known) out.notes.push(i18n.t("media.convert.svgNoSize"));
    if (removed) out.notes.push(i18n.t("media.convert.svgIgnored", { count: removed }));
    return out;
  } finally {
    img.close();
  }
}

async function vectorToVector(file: Blob, o: ConversionOptions): Promise<ConvertResult> {
  const { doc, svg, removed } = await readSvg(file);
  const notes: string[] = [];
  if (removed) notes.push(i18n.t("media.convert.svgRemoved", { count: removed }));
  const size = svgIntrinsicSize({ width: svg.getAttribute("width"), height: svg.getAttribute("height"), viewBox: svg.getAttribute("viewBox") }, 300);
  if (!svg.getAttribute("viewBox")) svg.setAttribute("viewBox", `0 0 ${+size.width.toFixed(3)} ${+size.height.toFixed(3)}`);
  if (o.resize.enabled) {
    const { width, height } = computeOutputSize(size.width, size.height, o.resize);
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
  }
  if (o.vectorBackgroundColor) {
    const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
    // Covers the whole viewBox (not 100%, which can be off when the viewBox does not start at 0).
    const vb = (svg.getAttribute("viewBox") ?? "0 0 0 0").trim().split(/[\s,]+/).map(Number);
    rect.setAttribute("x", String(vb[0] || 0));
    rect.setAttribute("y", String(vb[1] || 0));
    rect.setAttribute("width", String(vb[2] || size.width));
    rect.setAttribute("height", String(vb[3] || size.height));
    rect.setAttribute("fill", o.vectorBackgroundColor);
    svg.insertBefore(rect, svg.firstChild);
  }
  const blob = new Blob([new XMLSerializer().serializeToString(doc)], { type: "image/svg+xml" });
  return { blob, format: getFormat("svg"), notes };
}

export async function convertFile(file: Blob, kind: SniffedKind, target: FormatDefinition, options: ConversionOptions, ctx: ConvertContext = {}): Promise<ConvertResult> {
  throwIfAborted(ctx.signal);
  const src = sourceCategory(kind);
  if (src === "raster" && target.category === "raster") return rasterToRaster(file, kind, target, options, ctx);
  if (src === "raster" && target.category === "vector") return rasterToVector(file, kind, options, ctx);
  if (src === "vector" && target.category === "raster") return vectorToRaster(file, target, options, ctx);
  return vectorToVector(file, options);
}

export * from "./formats";
export * from "./options";
export * from "./sizings";
