import i18n from "../../../i18n";
import type { WorkerRequest, WorkerResponse } from "./imageWorker";

/** Runs one task in a new worker; abort → the worker is stopped immediately. */
export function runImageWorker(req: WorkerRequest, signal?: AbortSignal): Promise<WorkerResponse & { ok: true }> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException(i18n.t("media.errors.aborted"), "AbortError"));
      return;
    }
    const worker = new Worker(new URL("./imageWorker.ts", import.meta.url), { type: "module" });
    const done = () => {
      worker.terminate();
      signal?.removeEventListener("abort", onAbort);
    };
    const onAbort = () => {
      done();
      reject(new DOMException(i18n.t("media.errors.aborted"), "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      done();
      if (e.data.ok) resolve(e.data);
      else reject(new Error(e.data.error || i18n.t("media.errors.workerFailed")));
    };
    worker.onerror = (e) => {
      done();
      reject(new Error(e.message || i18n.t("media.errors.workerFailed")));
    };
    worker.postMessage(req, [req.data.buffer]);
  });
}
