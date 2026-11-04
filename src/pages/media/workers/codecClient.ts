// ─── workers/codecClient.ts ──────────────────────────────────────────────────
// WASM codec worker client. One worker is reused for many files
// (WASM modules only need to load once). Cancelling one task stops
// worker immediately; other tasks in the same worker are canceled too and
// a new worker is created when needed again.

import i18n from "../../../i18n";
import type { CodecEncodeOptions, CodecRequest, CodecResponse, DecodeFormat, EncodeFormat } from "./codecWorker";

type Pending = { resolve: (r: CodecResponse & { ok: true }) => void; reject: (e: unknown) => void };

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, Pending>();

const aborted = () => new DOMException(i18n.t("media.errors.aborted"), "AbortError");

function failAll(err: unknown) {
  for (const p of pending.values()) p.reject(err);
  pending.clear();
}

function getWorker(): Worker {
  if (worker) return worker;
  const w = new Worker(new URL("./codecWorker.ts", import.meta.url), { type: "module" });
  w.onmessage = (e: MessageEvent<CodecResponse>) => {
    const p = pending.get(e.data.id);
    if (!p) return;
    pending.delete(e.data.id);
    if (e.data.ok) p.resolve(e.data);
    else p.reject(new Error(i18n.t("media.codec.failed", { reason: e.data.error || "?" })));
  };
  w.onerror = (e) => {
    e.preventDefault?.();
    stopCodecWorker(new Error(i18n.t("media.codec.loadFailed")));
  };
  worker = w;
  return w;
}

/** Stops the worker (and all its tasks). */
function stopCodecWorker(reason: unknown = aborted()) {
  worker?.terminate();
  worker = null;
  failAll(reason);
}

type Req = CodecRequest extends infer R ? (R extends { id: number } ? Omit<R, "id"> : never) : never;

function run(req: Req, transfer: Transferable[], signal?: AbortSignal): Promise<CodecResponse & { ok: true }> {
  if (signal?.aborted) return Promise.reject(aborted());
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const onAbort = () => stopCodecWorker(aborted());
    signal?.addEventListener("abort", onAbort, { once: true });
    pending.set(id, {
      resolve: (r) => (signal?.removeEventListener("abort", onAbort), resolve(r)),
      reject: (e) => (signal?.removeEventListener("abort", onAbort), reject(e)),
    });
    getWorker().postMessage({ ...req, id } as CodecRequest, transfer);
  });
}

/** Encodes RGBA pixels to the target format in the worker. `data` is transferred (cannot be used again). */
export async function encodeInWorker(format: EncodeFormat, width: number, height: number, data: Uint8ClampedArray, options: CodecEncodeOptions, signal?: AbortSignal): Promise<ArrayBuffer> {
  const r = await run({ op: "encode", format, width, height, data, options }, [data.buffer], signal);
  if (!r.bytes) throw new Error(i18n.t("media.codec.failed", { reason: "empty" }));
  return r.bytes;
}

/** Decodes a file (JXL/QOI/TIFF, or AVIF/WebP when the browser cannot) into RGBA pixels. */
export async function decodeInWorker(format: DecodeFormat, bytes: ArrayBuffer, signal?: AbortSignal) {
  const r = await run({ op: "decode", format, bytes }, [bytes], signal);
  if (!r.image) throw new Error(i18n.t("media.codec.failed", { reason: "empty" }));
  return r.image;
}
