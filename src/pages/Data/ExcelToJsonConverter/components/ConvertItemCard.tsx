import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Loader2, RefreshCw, ServerCog, X } from "lucide-react";
import { ConvertItem } from "../types";
import { formatSize } from "../../shared/excelUtils";
import CopyButton from "../../../../components/app/CopyButton";
import { Link } from "../../../../components/app/LocaleLink";
import { INPUT, btn } from "../../../../components/app/ui";

const PREVIEW_CHARS = 4000;

interface ConvertItemCardProps {
  item: ConvertItem;
  fileExt: string;
  onDownload: (item: ConvertItem) => void;
  onReconvert: (itemId: string) => void;
  onChangeSheet: (itemId: string, sheetName: string) => void;
  onRemove: (id: string) => void;
}

export default function ConvertItemCard({ item, fileExt, onDownload, onReconvert, onChangeSheet, onRemove }: ConvertItemCardProps) {
  const { t } = useTranslation();
  const busy = item.status === "converting" || item.status === "pending";
  return (
    <li className="ow-card overflow-hidden" data-testid="convert-item" data-status={item.status}>
      <div className="flex flex-wrap items-center gap-3 p-3.5 sm:flex-nowrap">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            item.status === "error"
              ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
              : item.status === "done"
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
          }`}
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : item.status === "error" ? <AlertTriangle className="h-5 w-5" /> : item.status === "done" ? <CheckCircle2 className="h-5 w-5" /> : <FileSpreadsheet className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90" title={item.file.name}>
            {item.file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatSize(item.originalSize)}
            {busy && <> · {t("common.processing")}</>}
            {item.status === "done" && typeof item.rowCount === "number" && <> · {t("data.excel.rows", { count: item.rowCount })}</>}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {item.status === "error" && !item.legacy && (
            <button type="button" onClick={() => onReconvert(item.id)} className={`${btn.secondary} !px-3 !py-1.5 text-xs`}>
              <RefreshCw className="h-3.5 w-3.5" /> {t("common.retry")}
            </button>
          )}
          {item.status === "done" && (
            <>
              <CopyButton text={() => item.resultText ?? ""} testId="copy-result" />
              <button type="button" onClick={() => onDownload(item)} className={`${btn.primary} !px-3 !py-1.5 text-xs`} data-testid="download-result">
                <Download className="h-3.5 w-3.5" /> .{fileExt}
              </button>
            </>
          )}
          <button type="button" onClick={() => onRemove(item.id)} className={btn.icon} aria-label={t("data.excel.remove", { name: item.file.name })} title={t("common.delete")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {item.status === "error" && (
        <div className="border-t border-rose-100 bg-rose-50/60 px-4 py-2.5 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-200" role="alert">
          {item.errorMsg}
          {item.legacy && (
            <Link to="/data-tools/server-convert" className="ml-1 inline-flex items-center gap-1 font-semibold underline">
              <ServerCog className="h-3.5 w-3.5" /> {t("data.excel.useServer")}
            </Link>
          )}
        </div>
      )}

      {item.sheetNames.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
          <label htmlFor={`sheet-${item.id}`} className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {t("data.excel.sheet")}
          </label>
          <select id={`sheet-${item.id}`} value={item.selectedSheet} onChange={(e) => onChangeSheet(item.id, e.target.value)} className={`${INPUT} !w-auto !py-1.5`} disabled={busy}>
            {item.sheetNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-400">{t("data.excel.sheetCount", { count: item.sheetNames.length })}</span>
        </div>
      )}

      {item.status === "done" && item.resultText !== undefined && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {item.rowCount === 0 ? (
            <p className="px-4 py-3 text-sm text-amber-700 dark:text-amber-300">{t("data.excel.emptySheet")}</p>
          ) : (
            <pre className="max-h-56 overflow-auto bg-gray-50 px-4 py-3 font-mono text-xs leading-relaxed text-gray-700 dark:bg-gray-950/50 dark:text-gray-300" data-testid="result-preview">
              {item.resultText.length > PREVIEW_CHARS ? `${item.resultText.slice(0, PREVIEW_CHARS)}\n…` : item.resultText}
            </pre>
          )}
          {item.resultText.length > PREVIEW_CHARS && <p className="px-4 pb-2.5 pt-1 text-xs text-gray-500 dark:text-gray-400">{t("data.excel.previewCut", { count: item.rowCount })}</p>}
        </div>
      )}
    </li>
  );
}
