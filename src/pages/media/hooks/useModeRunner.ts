import { useCallback, useState } from "react";
import { confirmServerRun } from "../components/ServerGate";
import type { StopQueueError } from "../processing/serverClient";
import type { UsageInput } from "../processing/pricing";
import type { MediaToolId, ProcessingMode } from "../processing/policy";
import type { FileQueue } from "./useFileQueue";

/**
 * Processing mode + cost gate. Browser mode runs right away; server mode
 * always shows the cost estimate first and only runs when
 * confirmed (and the server is available).
 */
export function useProcessingMode(tool: MediaToolId, initial: ProcessingMode = "browser") {
  const [mode, setMode] = useState<ProcessingMode>(initial);
  const [stopMessage, setStopMessage] = useState<string | null>(null);

  // Server not available / access locked / insufficient balance (backend answer):
  // the queue stops, items go back to "waiting", and a message is shown.
  const onStop = useCallback((err: StopQueueError) => setStopMessage(err.message), []);

  /** Wrap queue.run with the server gate. */
  const gate = useCallback(
    async (queue: FileQueue, ids?: string[], usage?: (file: File) => UsageInput) => {
      setStopMessage(null);
      if (mode === "server") {
        const targets = queue.items.filter((it) => (ids ? ids.includes(it.id) : it.status !== "processing" && (it.status !== "done" || queue.isStale(it))));
        const inputs = targets.map((it) => usage?.(it.file) ?? { bytes: it.file.size });
        const ok = await confirmServerRun(tool, inputs, () => setMode("browser"));
        if (!ok) return;
      }
      await queue.run(ids);
    },
    [mode, tool],
  );

  return { mode, setMode, onStop, gate, stopMessage, clearStop: () => setStopMessage(null) };
}
