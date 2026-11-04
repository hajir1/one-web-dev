import i18n from "../../../i18n";
import type { BgDtype, BgRequest, BgResponse } from "./bgRemovalWorker";

/* Background removal worker client: one worker is reused (the model stays in
 * memory). The queue runs sequentially via useFileQueue; abort terminates the
 * worker so the next call creates a new one. */

let worker: Worker | null = null;
let seq = 0;

function getWorker(): Worker {
  worker ??= new Worker(new URL("./bgRemovalWorker.ts", import.meta.url), { type: "module" });
  return worker;
}

function kill() {
  worker?.terminate();
  worker = null;
}

export function removeBackgroundInWorker(file: Blob, dtype: BgDtype, opts: { signal?: AbortSignal; onProgress?: (v: number) => void }): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const aborted = () => new DOMException(i18n.t("media.errors.aborted"), "AbortError");
    if (opts.signal?.aborted) return reject(aborted());
    const w = getWorker();
    const id = ++seq;
    const cleanup = () => {
      w.removeEventListener("message", onMessage);
      w.removeEventListener("error", onError);
      opts.signal?.removeEventListener("abort", onAbort);
    };
    const onAbort = () => {
      cleanup();
      kill();
      reject(aborted());
    };
    const onError = (e: ErrorEvent) => {
      cleanup();
      kill();
      reject(new Error(e.message || i18n.t("media.errors.workerFailed")));
    };
    const onMessage = (e: MessageEvent<BgResponse>) => {
      const m = e.data;
      if (m.id !== id) return;
      if (m.type === "progress") return opts.onProgress?.(m.value);
      cleanup();
      if (m.type === "done") resolve(m.blob);
      else reject(new Error(m.error));
    };
    w.addEventListener("message", onMessage);
    w.addEventListener("error", onError);
    opts.signal?.addEventListener("abort", onAbort, { once: true });
    w.postMessage({ id, file, dtype } satisfies BgRequest);
  });
}
