import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Clock, Download, Loader2, RefreshCw, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { KIND_LABEL } from "../lib/fileSniff";
import { formatSize, sizeDelta } from "../lib/format";
import type { QueueItem } from "../hooks/useFileQueue";
import { CHECKERBOARD, Chip, ProgressBar, btn } from "./ui";

const STATUS = {
  pending: { tone: "gray" as const, Icon: Clock },
  processing: { tone: "blue" as const, Icon: Loader2 },
  done: { tone: "green" as const, Icon: CheckCircle2 },
  error: { tone: "rose" as const, Icon: AlertCircle },
};

/** Satu baris file di antrean: pratinjau, ukuran, status, progres, dan aksi. */
export default function FileRow({
  item,
  stale,
  disabled,
  actionLabel,
  showResultThumb,
  extra,
  onProcess,
  onDownload,
  onRemove,
}: {
  item: QueueItem;
  stale?: boolean;
  /** Antrean lain sedang berjalan. */
  disabled?: boolean;
  actionLabel?: string;
  /** Tampilkan hasil (dengan latar kotak-kotak) sebagai thumbnail. */
  showResultThumb?: boolean;
  extra?: ReactNode;
  onProcess: () => void;
  onDownload: () => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  const s = STATUS[item.status];
  const r = item.result;
  const delta = r ? sizeDelta(item.file.size, r.blob.size) : null;
  const thumb = showResultThumb && r ? r.url : item.previewUrl;

  return (
    <li
      data-testid="file-row"
      data-status={item.status}
      className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-gray-300 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-gray-700"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-gray-200 dark:ring-gray-700" style={showResultThumb ? CHECKERBOARD : undefined}>
          {thumb ? (
            <img src={thumb} alt="" loading="lazy" className={`h-full w-full ${showResultThumb ? "object-contain" : "object-cover"} bg-gray-100 dark:bg-gray-800`} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] font-semibold text-gray-500 dark:bg-gray-800">{KIND_LABEL[item.kind]}</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90" title={item.file.name}>
              {item.file.name}
            </p>
            <Chip tone={s.tone}>
              <s.Icon className={`h-3 w-3 ${item.status === "processing" ? "animate-spin" : ""}`} />
              {t(`media.queue.status.${item.status}`)}
              {item.status === "processing" && item.progress !== null ? ` ${item.progress}%` : ""}
            </Chip>
            {stale && item.status === "done" && <Chip tone="amber">{t("media.queue.settingsChanged")}</Chip>}
          </div>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {KIND_LABEL[item.kind]} · {formatSize(item.file.size)}
            {r && (
              <>
                {" → "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {r.label ? `${r.label} · ` : ""}
                  {formatSize(r.blob.size)}
                </span>
                {delta !== null && (
                  <span className={`ml-1 font-semibold ${delta <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    ({delta > 0 ? "+" : ""}
                    {delta}%)
                  </span>
                )}
              </>
            )}
          </p>
          {item.status === "processing" && (
            <div className="mt-1.5 max-w-xs">
              <ProgressBar value={item.progress} label={t("media.queue.progressOf", { name: item.file.name })} />
            </div>
          )}
          {item.status === "error" && item.error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{item.error}</p>}
          {extra}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
        {(item.status === "pending" || item.status === "error" || (item.status === "done" && stale)) && (
          <button type="button" onClick={onProcess} disabled={disabled} className={`${btn.secondary} !px-3 !py-1.5 text-xs`}>
            {item.status === "pending" ? (actionLabel ?? t("media.queue.process")) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" /> {item.status === "error" ? t("common.retry") : t("media.queue.reprocess")}
              </>
            )}
          </button>
        )}
        {r && (
          <button type="button" onClick={onDownload} className={`${btn.success} text-xs`} data-testid="row-download">
            <Download className="h-3.5 w-3.5" /> {t("common.download")}
          </button>
        )}
        <button type="button" onClick={onRemove} className={btn.icon} aria-label={t("media.queue.removeNamed", { name: item.file.name })} title={t("media.queue.remove")}>
          <X className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
