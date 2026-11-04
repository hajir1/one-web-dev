import { useState, type ReactNode } from "react";
import { Download, Loader2, Play, Square, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { downloadAsZip, downloadBlob } from "../lib/download";
import { formatSize } from "../lib/format";
import type { FileQueue, QueueItem } from "../hooks/useFileQueue";
import FileRow from "./FileRow";
import { Notice, Panel, btn } from "./ui";

/**
 * Queue list + bulk actions (process all, cancel, download all as a
 * ZIP, remove all). Used by Image Converter, Remove Background, and Remove
 * Metadata.
 */
export default function QueuePanel({
  queue,
  title,
  runLabel,
  actionLabel,
  zipName,
  showResultThumb,
  rowExtra,
  onRunAll,
  onRunOne,
}: {
  queue: FileQueue;
  title?: string;
  runLabel?: string;
  actionLabel?: string;
  zipName: string;
  showResultThumb?: boolean;
  rowExtra?: (item: QueueItem) => ReactNode;
  /** Default: queue.run(). Pages with a server mode install a cost gate here. */
  onRunAll?: () => void;
  onRunOne?: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { items, running, pendingCount, doneItems } = queue;
  const [zipping, setZipping] = useState<number | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  if (!items.length) return null;

  const totalIn = items.reduce((n, it) => n + it.file.size, 0);
  const totalOut = doneItems.reduce((n, it) => n + (it.result?.blob.size ?? 0), 0);

  const downloadAll = async () => {
    setZipError(null);
    if (doneItems.length === 1) {
      const r = doneItems[0].result!;
      downloadBlob(r.blob, r.fileName);
      return;
    }
    setZipping(0);
    try {
      await downloadAsZip(
        doneItems.map((it) => ({ name: it.result!.fileName, blob: it.result!.blob })),
        zipName,
        setZipping,
      );
    } catch (e) {
      setZipError(e instanceof Error ? t("media.queue.zipFailedWith", { message: e.message }) : t("media.queue.zipFailed"));
    } finally {
      setZipping(null);
    }
  };

  return (
    <Panel
      title={`${title ?? t("media.queue.title")} (${items.length})`}
      description={
        <>
          {t("media.queue.totalIn", { size: formatSize(totalIn) })}
          {doneItems.length > 0 && (
            <>
              {" · "}
              {t("media.queue.totalDone", { count: doneItems.length, size: formatSize(totalOut) })}
            </>
          )}
        </>
      }
      actions={
        <>
          {running ? (
            <button type="button" onClick={queue.cancel} className={btn.danger} data-testid="queue-cancel">
              <Square className="h-3.5 w-3.5" /> {t("common.cancel")}
            </button>
          ) : (
            <button type="button" onClick={onRunAll ?? (() => queue.run())} disabled={!pendingCount} className={btn.primary} data-testid="queue-run">
              <Play className="h-3.5 w-3.5" /> {runLabel ?? t("media.queue.runAll")} ({pendingCount})
            </button>
          )}
          <button type="button" onClick={downloadAll} disabled={!doneItems.length || zipping !== null || running} className={btn.secondary} data-testid="queue-download">
            {zipping !== null ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {zipping !== null ? `ZIP ${zipping}%` : doneItems.length > 1 ? t("media.queue.downloadZip", { count: doneItems.length }) : t("common.download")}
          </button>
          <button type="button" onClick={queue.clear} className={btn.ghost} data-testid="queue-clear">
            <Trash2 className="h-3.5 w-3.5" /> {t("media.queue.clearAll")}
          </button>
        </>
      }
    >
      {zipError && (
        <div className="mb-3">
          <Notice tone="error" onDismiss={() => setZipError(null)}>
            {zipError}
          </Notice>
        </div>
      )}
      <ul className="flex flex-col gap-2" data-testid="queue-list">
        {items.map((it) => (
          <FileRow
            key={it.id}
            item={it}
            stale={queue.isStale(it)}
            disabled={running}
            actionLabel={actionLabel}
            showResultThumb={showResultThumb}
            extra={rowExtra?.(it)}
            onProcess={() => (onRunOne ? onRunOne(it.id) : queue.run([it.id]))}
            onDownload={() => it.result && downloadBlob(it.result.blob, it.result.fileName)}
            onRemove={() => queue.remove(it.id)}
          />
        ))}
      </ul>
    </Panel>
  );
}
