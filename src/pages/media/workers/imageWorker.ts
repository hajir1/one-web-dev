// ─── workers/imageWorker.ts ──────────────────────────────────────────────────
// Pekerjaan CPU berat dipindah dari thread UI supaya halaman tidak "hang"
// (versi lama menjalankan tracing di thread utama: gambar besar membekukan
// tab hingga puluhan detik dan tidak bisa dibatalkan). Worker dibuat per
// tugas dan di-terminate saat selesai atau dibatalkan.

import ImageTracer from "imagetracerjs";
import { unsharpMask, type SharpenOptions } from "../lib/sharpen";

export type WorkerRequest =
  | { op: "trace"; width: number; height: number; data: Uint8ClampedArray; options: Record<string, number> }
  | { op: "sharpen"; width: number; height: number; data: Uint8ClampedArray; options: SharpenOptions };

export type WorkerResponse = { ok: true; svg?: string; data?: Uint8ClampedArray } | { ok: false; error: string };

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;
  try {
    if (msg.op === "trace") {
      const imgd = { width: msg.width, height: msg.height, data: msg.data } as ImageData;
      const svg: string = ImageTracer.imagedataToSVG(imgd, { ...msg.options, viewbox: true });
      (self as unknown as Worker).postMessage({ ok: true, svg } satisfies WorkerResponse);
      return;
    }
    if (msg.op === "sharpen") {
      const out = unsharpMask(msg.data, msg.width, msg.height, msg.options);
      (self as unknown as Worker).postMessage({ ok: true, data: out } satisfies WorkerResponse, [out.buffer]);
      return;
    }
    (self as unknown as Worker).postMessage({ ok: false, error: "" } satisfies WorkerResponse);
  } catch (err) {
    (self as unknown as Worker).postMessage({ ok: false, error: err instanceof Error ? err.message : "" } satisfies WorkerResponse);
  }
};
