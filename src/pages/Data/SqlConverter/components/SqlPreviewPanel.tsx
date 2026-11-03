import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import CopyButton from "../../../../components/app/CopyButton";
import { Panel, btn } from "../../../../components/app/ui";

interface SqlPreviewPanelProps {
  previewSql: string;
  canGenerate: boolean;
  totalRows: number;
  previewRowLimit: number;
  hint: string | null;
  getFullSql: () => string;
  onDownload: () => void;
}

export default function SqlPreviewPanel({ previewSql, canGenerate, totalRows, previewRowLimit, hint, getFullSql, onDownload }: SqlPreviewPanelProps) {
  const { t } = useTranslation();
  return (
    <Panel
      title={t("data.sql.previewTitle")}
      description={canGenerate && totalRows > previewRowLimit ? t("data.sql.previewNote", { shown: previewRowLimit, total: totalRows }) : undefined}
      actions={
        <>
          <CopyButton text={getFullSql} disabled={!canGenerate} label={t("data.sql.copyAll")} testId="sql-copy" />
          <button type="button" onClick={onDownload} disabled={!canGenerate} className={`${btn.primary} !px-3 !py-1.5 text-xs`} data-testid="sql-download">
            <Download className="h-3.5 w-3.5" /> .sql
          </button>
        </>
      }
      bodyClassName="p-0"
    >
      {hint && (
        <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200" role="status" data-testid="sql-hint">
          {hint}
        </p>
      )}
      <pre className="max-h-72 overflow-auto bg-gray-50 px-4 py-3 font-mono text-xs leading-relaxed text-gray-700 dark:bg-gray-950/50 dark:text-gray-300" data-testid="sql-preview">
        {previewSql || t("data.sql.previewEmpty")}
      </pre>
    </Panel>
  );
}
