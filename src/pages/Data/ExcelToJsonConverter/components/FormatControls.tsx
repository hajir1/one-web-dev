import { useTranslation } from "react-i18next";
import { Segmented, Toggle } from "../../../../components/app/ui";
import { OutputFormat } from "../types";

interface FormatControlsProps {
  outputFormat: OutputFormat;
  headerRow: boolean;
  pretty: boolean;
  onOutputFormatChange: (f: OutputFormat) => void;
  onHeaderRowChange: (v: boolean) => void;
  onPrettyChange: (v: boolean) => void;
}

export default function FormatControls({ outputFormat, headerRow, pretty, onOutputFormatChange, onHeaderRowChange, onPrettyChange }: FormatControlsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4" data-testid="excel-options">
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("data.excel.format")}</p>
        <Segmented<OutputFormat>
          value={outputFormat}
          onChange={onOutputFormatChange}
          label={t("data.excel.format")}
          options={[
            { value: "json", label: "JSON (.json)" },
            { value: "js", label: t("data.excel.jsModule") },
          ]}
        />
      </div>
      <Toggle checked={headerRow} onChange={onHeaderRowChange} label={t("data.excel.headerRow")} hint={t("data.excel.headerRowHint")} />
      <Toggle checked={pretty} onChange={onPrettyChange} label={t("data.excel.pretty")} hint={t("data.excel.prettyHint")} />
    </div>
  );
}
