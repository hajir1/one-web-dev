// ─── hooks/useFileQueue.ts ───────────────────────────────────────────────────
// Antrean file bersama untuk semua halaman Media yang memproses banyak file.
//
// Memperbaiki bug versi lama:
// - Object URL (pratinjau & hasil) dicabut saat item dihapus, hasil diganti,
//   "Hapus semua", dan saat halaman ditinggalkan (sebelumnya bocor).
// - Tidak ada proses ganda: satu antrean berjalan pada satu waktu; item yang
//   sedang diproses tidak bisa diproses lagi (klik ganda / "Proses semua"
//   bersamaan dengan "Proses" per item).
// - Bisa dibatalkan (AbortController); item yang dibatalkan kembali ke
//   status sebelumnya, BUKAN "gagal".
// - Hasil menyimpan format/nama file-nya sendiri, jadi mengganti pengaturan
//   setelah konversi tidak membuat ekstensi unduhan salah. Hasil yang dibuat
//   dengan pengaturan lama ditandai "usang" dan ikut diproses ulang.
// - Item yang dihapus saat sedang diproses tidak "hidup lagi" ketika hasil
//   datang terlambat.

import { useCallback, useEffect, useRef, useState } from "react";
import i18n from "../../../i18n";
import type { AcceptedFile } from "../lib/validate";
import type { SniffedKind } from "../lib/fileSniff";
import { makeId } from "../lib/format";
import { StopQueueError } from "../processing/serverClient";

type QueueStatus = "pending" | "processing" | "done" | "error";

interface QueueResult {
  blob: Blob;
  url: string;
  fileName: string;
  /** Label hasil, mis. "WebP" atau "PNG transparan". */
  label?: string;
  /** settingsKey saat hasil dibuat. */
  key: string;
  meta?: Record<string, unknown>;
}

export interface QueueItem {
  id: string;
  file: File;
  kind: SniffedKind;
  previewUrl: string | null;
  status: QueueStatus;
  progress: number | null;
  error?: string;
  result?: QueueResult;
}

export interface ProcessContext {
  signal: AbortSignal;
  onProgress: (pct: number) => void;
}

interface ProcessOutput {
  blob: Blob;
  fileName: string;
  label?: string;
  meta?: Record<string, unknown>;
}

export interface UseFileQueueOptions {
  process: (item: QueueItem, ctx: ProcessContext) => Promise<ProcessOutput>;
  /** Ringkasan pengaturan saat ini; hasil dengan kunci berbeda = usang. */
  settingsKey: string;
  /** Buat object URL pratinjau untuk file (default true). */
  preview?: boolean;
  /** Dipanggil saat antrean dihentikan oleh StopQueueError (mis. server belum tersedia). */
  onStop?: (err: StopQueueError) => void;
}

const isAbort = (e: unknown) => (e as Error)?.name === "AbortError";

export function useFileQueue({ process, settingsKey, preview = true, onStop }: UseFileQueueOptions) {
  const [items, setItemsState] = useState<QueueItem[]>([]);
  const [running, setRunning] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const itemsRef = useRef<QueueItem[]>([]);
  const runningRef = useRef(false);
  const cancelRef = useRef(false);
  const ctrlRef = useRef<{ id: string; ctrl: AbortController } | null>(null);
  const latest = useRef({ process, settingsKey, onStop });
  latest.current = { process, settingsKey, onStop };

  const commit = useCallback((fn: (prev: QueueItem[]) => QueueItem[]) => {
    itemsRef.current = fn(itemsRef.current);
    setItemsState(itemsRef.current);
  }, []);

  const patch = useCallback(
    (id: string, p: Partial<QueueItem>) => commit((prev) => prev.map((it) => (it.id === id ? { ...it, ...p } : it))),
    [commit],
  );

  const revokeItem = (it: QueueItem) => {
    if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    if (it.result) URL.revokeObjectURL(it.result.url);
  };

  // Halaman ditinggalkan: hentikan proses & cabut semua URL.
  useEffect(
    () => () => {
      cancelRef.current = true;
      ctrlRef.current?.ctrl.abort();
      itemsRef.current.forEach(revokeItem);
      itemsRef.current = [];
    },
    [],
  );

  const add = useCallback(
    (files: AcceptedFile[]) => {
      if (!files.length) return;
      const fresh: QueueItem[] = files.map(({ file, kind }) => ({
        id: makeId(),
        file,
        kind,
        previewUrl: preview ? URL.createObjectURL(file) : null,
        status: "pending",
        progress: null,
      }));
      commit((prev) => [...prev, ...fresh]);
    },
    [commit, preview],
  );

  const remove = useCallback(
    (id: string) => {
      const it = itemsRef.current.find((x) => x.id === id);
      if (!it) return;
      if (ctrlRef.current?.id === id) ctrlRef.current.ctrl.abort();
      revokeItem(it);
      commit((prev) => prev.filter((x) => x.id !== id));
    },
    [commit],
  );

  const cancel = useCallback(() => {
    if (!runningRef.current) return;
    cancelRef.current = true;
    ctrlRef.current?.ctrl.abort();
  }, []);

  const clear = useCallback(() => {
    cancel();
    itemsRef.current.forEach(revokeItem);
    commit(() => []);
  }, [cancel, commit]);

  /** Hapus semua hasil (file sumber tetap). */
  const clearResults = useCallback(() => {
    if (runningRef.current) return;
    itemsRef.current.forEach((it) => it.result && URL.revokeObjectURL(it.result.url));
    commit((prev) => prev.map((it) => ({ ...it, status: "pending", result: undefined, error: undefined, progress: null })));
  }, [commit]);

  const isStale = useCallback((it: QueueItem) => !!it.result && it.result.key !== latest.current.settingsKey, []);

  const needsWork = (it: QueueItem) => it.status === "pending" || it.status === "error" || (it.status === "done" && isStale(it));

  const run = useCallback(
    async (ids?: string[]) => {
      if (runningRef.current) return;
      const targets = (ids ?? itemsRef.current.filter(needsWork).map((it) => it.id)).filter((id) => {
        const it = itemsRef.current.find((x) => x.id === id);
        return !!it && it.status !== "processing";
      });
      if (!targets.length) return;

      runningRef.current = true;
      cancelRef.current = false;
      setRunning(true);
      try {
        for (const id of targets) {
          if (cancelRef.current) break;
          const item = itemsRef.current.find((x) => x.id === id);
          if (!item) continue; // dihapus saat menunggu
          const before = { status: item.status, error: item.error };
          const ctrl = new AbortController();
          ctrlRef.current = { id, ctrl };
          setActiveId(id);
          patch(id, { status: "processing", progress: null, error: undefined });
          const { process: proc, settingsKey } = latest.current;
          try {
            const out = await proc(item, {
              signal: ctrl.signal,
              onProgress: (pct) => {
                if (!ctrl.signal.aborted) patch(id, { progress: Math.max(0, Math.min(100, Math.round(pct))) });
              },
            });
            if (ctrl.signal.aborted) throw new DOMException(i18n.t("media.errors.aborted"), "AbortError");
            if (!out.blob || out.blob.size === 0) throw new Error(i18n.t("media.errors.emptyResult"));
            const still = itemsRef.current.find((x) => x.id === id);
            if (!still) continue; // dihapus saat diproses: buang hasil
            if (still.result) URL.revokeObjectURL(still.result.url);
            patch(id, {
              status: "done",
              progress: 100,
              result: {
                blob: out.blob,
                url: URL.createObjectURL(out.blob),
                fileName: out.fileName,
                label: out.label,
                key: settingsKey,
                meta: out.meta,
              },
            });
          } catch (err) {
            const still = itemsRef.current.find((x) => x.id === id);
            if (isAbort(err) || err instanceof StopQueueError) {
              if (still) patch(id, { status: before.status === "processing" ? "pending" : before.status, error: before.error, progress: null });
              if (err instanceof StopQueueError) {
                latest.current.onStop?.(err);
                break;
              }
              if (cancelRef.current) break;
              continue; // item ini saja yang dibatalkan (mis. dihapus)
            }
            if (still)
              patch(id, {
                status: "error",
                progress: null,
                error: err instanceof Error && err.message ? err.message : i18n.t("media.errors.processFailed"),
              });
          }
        }
      } finally {
        ctrlRef.current = null;
        runningRef.current = false;
        cancelRef.current = false;
        setActiveId(null);
        setRunning(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [patch],
  );

  const pendingCount = items.filter(needsWork).length;
  const doneItems = items.filter((it) => it.status === "done" && it.result);

  return { items, add, remove, clear, clearResults, run, cancel, running, activeId, isStale, pendingCount, doneItems };
}

export type FileQueue = ReturnType<typeof useFileQueue>;
