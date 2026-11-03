import { useCallback, useState } from "react";
import { confirmServerRun } from "../components/ServerGate";
import type { StopQueueError } from "../processing/serverClient";
import type { UsageInput } from "../processing/pricing";
import type { MediaToolId, ProcessingMode } from "../processing/policy";
import type { FileQueue } from "./useFileQueue";

/**
 * Mode pemrosesan + gerbang biaya. Mode browser langsung jalan; mode server
 * selalu menampilkan perkiraan biaya dulu dan hanya berjalan bila
 * dikonfirmasi (dan server tersedia).
 */
export function useProcessingMode(tool: MediaToolId, initial: ProcessingMode = "browser") {
  const [mode, setMode] = useState<ProcessingMode>(initial);
  const [stopMessage, setStopMessage] = useState<string | null>(null);

  // Server belum tersedia / akses terkunci / saldo kurang (jawaban backend):
  // antrean berhenti, item kembali "menunggu", pesan ditampilkan.
  const onStop = useCallback((err: StopQueueError) => setStopMessage(err.message), []);

  /** Bungkus queue.run dengan gerbang server. */
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
