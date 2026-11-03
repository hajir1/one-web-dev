import { useTranslation } from "react-i18next";
import { ColumnMap, Row } from "../types";
import { detectColumnType } from "../sqlUtils";

interface ColumnMapperProps {
  rows: Row[];
  columnMaps: ColumnMap[];
  onUpdate: (index: number, patch: Partial<ColumnMap>) => void;
  onToggleAll: (included: boolean) => void;
}

export default function ColumnMapper({ rows, columnMaps, onUpdate, onToggleAll }: ColumnMapperProps) {
  const { t } = useTranslation();
  const all = columnMaps.every((c) => c.included);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800" data-testid="column-mapper">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-white/5 dark:text-gray-400">
        <input type="checkbox" checked={all} onChange={(e) => onToggleAll(e.target.checked)} className="h-4 w-4 accent-brand-600" aria-label={t("data.sql.toggleAll")} />
        <span className="w-32 shrink-0 sm:w-44">{t("data.sql.sourceColumn")}</span>
        <span className="flex-1">{t("data.sql.dbColumn")}</span>
      </div>
      <div className="max-h-72 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
        {columnMaps.map((col, idx) => (
          <div key={col.source} className="flex items-center gap-3 px-3 py-2">
            <input
              type="checkbox"
              checked={col.included}
              onChange={(e) => onUpdate(idx, { included: e.target.checked })}
              className="h-4 w-4 shrink-0 accent-brand-600"
              aria-label={t("data.sql.includeColumn", { name: col.source })}
            />
            <div className="w-32 min-w-0 shrink-0 sm:w-44">
              <p className="truncate font-mono text-xs text-gray-700 dark:text-gray-200" title={col.source}>
                {col.source}
              </p>
              <span className="text-[11px] text-gray-400">{t(`data.sql.types.${detectColumnType(rows, col.source)}`)}</span>
            </div>
            <input
              type="text"
              value={col.dbColumn}
              onChange={(e) => onUpdate(idx, { dbColumn: e.target.value })}
              disabled={!col.included}
              placeholder={col.source}
              aria-label={t("data.sql.dbColumnFor", { name: col.source })}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 font-mono text-xs text-gray-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
