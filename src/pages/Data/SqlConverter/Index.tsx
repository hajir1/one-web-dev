import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ExcelJS from "exceljs";
import { Braces, Database, FileSpreadsheet, Loader2, ShieldCheck, Upload, X } from "lucide-react";

import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import EmptyState from "../../../components/app/EmptyState";
import { Chip, Field, INPUT, Notice, Panel, Segmented, SelectField, Toggle, btn } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import { ACCEPT_ATTR, ACCEPTED_EXCEL_EXT, MAX_FILE_SIZE, formatSize, readWorkbook } from "../shared/excelUtils";
import { safeFileName, triggerDownload } from "../shared/downloadUtils";
import { DataError, dataErrorMessage } from "../shared/errors";
import FileDropZone from "../shared/FileDropZone";
import { Link } from "../../../components/app/LocaleLink";
import { buildSql, detectColumns, excelRowsFromSheet, parseJsonText, validateColumns } from "./sqlUtils";
import { ColumnMap, InsertMode, Row, SqlDialect, SourceType } from "./types";
import ColumnMapper from "./components/ColumnMapper";
import SqlPreviewPanel from "./components/SqlPreviewPanel";

const PREVIEW_ROW_LIMIT = 5;
const MAX_JSON_BYTES = 10 * 1024 * 1024;
const JSON_SAMPLE = `[
  { "nim": "2201001", "nama": "Budi Santoso", "ipk": 3.42, "aktif": true },
  { "nim": "2201002", "nama": "Siti O'Neil", "ipk": 3.87, "aktif": false }
]`;

export default function SqlConverter() {
  const { t } = useTranslation();
  const [sourceType, setSourceType] = useState<SourceType>("excel");

  // --- Sumber: Excel ---
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelWorkbook, setExcelWorkbook] = useState<ExcelJS.Workbook | null>(null);
  const [excelSelectedSheet, setExcelSelectedSheet] = useState("");
  const [excelHeaderRow, setExcelHeaderRow] = useState(true);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState<{ text: string; legacy: boolean } | null>(null);
  const readToken = useRef(0);

  // --- Sumber: JSON ---
  const [jsonText, setJsonText] = useState("");
  const [jsonFileName, setJsonFileName] = useState<string | null>(null);
  const [jsonFileError, setJsonFileError] = useState<string | null>(null);
  const jsonInputRef = useRef<HTMLInputElement | null>(null);

  // --- Pemetaan & opsi SQL ---
  const [tableName, setTableName] = useState("");
  const [columnMaps, setColumnMaps] = useState<ColumnMap[]>([]);
  const [insertMode, setInsertMode] = useState<InsertMode>("bulk");
  const [dialect, setDialect] = useState<SqlDialect>("mysql");
  const [nullAsKeyword, setNullAsKeyword] = useState(true);

  const handleExcelFile = useCallback(
    async (file: File) => {
      setExcelError(null);
      if (!ACCEPTED_EXCEL_EXT.test(file.name)) return setExcelError({ text: t("data.excel.skipType", { name: file.name }), legacy: false });
      const token = ++readToken.current;
      setExcelLoading(true);
      setExcelFile(file);
      setExcelWorkbook(null);
      try {
        const workbook = await readWorkbook(file);
        if (token !== readToken.current) return; // file lain sudah dipilih
        setExcelWorkbook(workbook);
        setExcelSelectedSheet(workbook.worksheets[0]?.name ?? "");
        notify.success(t("data.sql.fileRead", { name: file.name }));
      } catch (err) {
        if (token !== readToken.current) return;
        setExcelError({ text: dataErrorMessage(err), legacy: err instanceof DataError && err.code === "legacyFormat" });
        setExcelFile(null);
      } finally {
        if (token === readToken.current) setExcelLoading(false);
      }
    },
    [t],
  );

  const clearExcel = () => {
    readToken.current++;
    setExcelFile(null);
    setExcelWorkbook(null);
    setExcelSelectedSheet("");
    setExcelError(null);
    setExcelLoading(false);
  };

  const excelRows = useMemo<Row[]>(() => {
    if (!excelWorkbook || !excelSelectedSheet) return [];
    return excelRowsFromSheet(excelWorkbook, excelSelectedSheet, excelHeaderRow);
  }, [excelWorkbook, excelSelectedSheet, excelHeaderRow]);

  const handleJsonFile = (file: File) => {
    setJsonFileError(null);
    if (file.size > MAX_JSON_BYTES) return setJsonFileError(t("data.errors.fileTooLarge", { max: formatSize(MAX_JSON_BYTES) }));
    file.text().then(
      (text) => {
        setJsonText(text);
        setJsonFileName(file.name);
      },
      () => setJsonFileError(t("data.errors.readFailed")),
    );
  };

  const jsonParsed = useMemo<{ rows: Row[]; error: string | null }>(() => {
    if (!jsonText.trim()) return { rows: [], error: null };
    try {
      return { rows: parseJsonText(jsonText), error: null };
    } catch (err) {
      return { rows: [], error: dataErrorMessage(err) };
    }
  }, [jsonText]);

  const rows: Row[] = sourceType === "excel" ? excelRows : jsonParsed.rows;

  useEffect(() => {
    const cols = detectColumns(rows);
    setColumnMaps((prev) => cols.map((col) => prev.find((p) => p.source === col) ?? { source: col, dbColumn: col, included: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelWorkbook, excelSelectedSheet, excelHeaderRow, jsonText, sourceType]);

  const updateColumn = (index: number, p: Partial<ColumnMap>) => setColumnMaps((prev) => prev.map((c, i) => (i === index ? { ...c, ...p } : c)));
  const toggleAll = (included: boolean) => setColumnMaps((prev) => prev.map((c) => ({ ...c, included })));

  const colIssue = validateColumns(columnMaps);
  const tableOk = tableName.trim().length > 0;
  const canGenerate = rows.length > 0 && tableOk && !colIssue;
  const hint = !rows.length
    ? null
    : !tableOk
      ? t("data.sql.needTable")
      : colIssue
        ? t(`data.sql.issue.${colIssue.code}`, colIssue)
        : null;

  const previewSql = useMemo(
    () => (canGenerate ? buildSql(rows, tableName, columnMaps, insertMode, dialect, nullAsKeyword, PREVIEW_ROW_LIMIT) : ""),
    [rows, tableName, columnMaps, insertMode, dialect, nullAsKeyword, canGenerate],
  );
  // SQL lengkap dibuat hanya saat disalin/diunduh (data besar tidak dibangun ulang tiap ketikan).
  const getFullSql = () => (canGenerate ? buildSql(rows, tableName, columnMaps, insertMode, dialect, nullAsKeyword) : "");

  const downloadSql = () => {
    const sql = getFullSql();
    if (!sql) return;
    triggerDownload(new Blob([sql], { type: "application/sql" }), `${safeFileName(tableName.trim(), "insert")}.sql`);
    notify.success(t("data.sql.downloaded", { count: rows.length }));
  };

  return (
    <>
      <AppMeta title={t("data.sql.metaTitle")} description={t("data.sql.metaDescription")} />
      <div className="flex flex-col gap-5" data-testid="sql-converter">
        <PageHeader
          icon={Database}
          tileClassName="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
          title={t("data.sql.title")}
          description={t("data.sql.description")}
          crumbs={[{ label: t("nav.sections.data.name"), to: "/data-tools" }, { label: t("data.sql.title") }]}
          help="data-sql"
          chips={
            <>
              <Chip tone="green">
                <ShieldCheck className="h-3 w-3" /> {t("data.common.browserOnly")}
              </Chip>
              <Chip tone="blue">MySQL · PostgreSQL · SQL Server</Chip>
            </>
          }
        />

        <Panel
          title={t("data.sql.sourceTitle")}
          actions={
            <Segmented<SourceType>
              value={sourceType}
              onChange={setSourceType}
              label={t("data.sql.sourceTitle")}
              options={[
                {
                  value: "excel",
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <FileSpreadsheet className="h-4 w-4" /> Excel / CSV
                    </span>
                  ),
                },
                {
                  value: "json",
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <Braces className="h-4 w-4" /> JSON
                    </span>
                  ),
                },
              ]}
            />
          }
        >
          {sourceType === "excel" ? (
            <div className="flex flex-col gap-3" data-testid="sql-excel-source">
              {!excelFile ? (
                <FileDropZone accept={ACCEPT_ATTR} onFiles={(f) => void handleExcelFile(f[0])} hint={t("data.excel.dropHint", { max: formatSize(MAX_FILE_SIZE) })} testId="sql-drop" />
              ) : (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-3.5 dark:border-gray-800">
                  <FileSpreadsheet className="h-5 w-5 shrink-0 text-emerald-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{excelFile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatSize(excelFile.size)}
                      {excelLoading && (
                        <span className="ml-1 inline-flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> {t("common.processing")}
                        </span>
                      )}
                    </p>
                  </div>
                  {excelWorkbook && excelWorkbook.worksheets.length > 1 && (
                    <SelectField
                      label={t("data.excel.sheet")}
                      value={excelSelectedSheet}
                      onChange={setExcelSelectedSheet}
                      options={excelWorkbook.worksheets.map((ws) => ({ value: ws.name, label: ws.name }))}
                    />
                  )}
                  <button type="button" onClick={clearExcel} className={btn.icon} aria-label={t("data.sql.changeFile")} title={t("data.sql.changeFile")}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <Toggle checked={excelHeaderRow} onChange={setExcelHeaderRow} label={t("data.excel.headerRow")} hint={t("data.excel.headerRowHint")} />
              {excelError && (
                <Notice tone="error" onDismiss={() => setExcelError(null)}>
                  {excelError.text}{" "}
                  {excelError.legacy && (
                    <Link to="/data-tools/server-convert" className="font-semibold underline">
                      {t("data.excel.useServer")}
                    </Link>
                  )}
                </Notice>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2" data-testid="sql-json-source">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => jsonInputRef.current?.click()} className={`${btn.secondary} !py-1.5 text-xs`}>
                  <Upload className="h-3.5 w-3.5" /> {t("data.sql.uploadJson")}
                </button>
                <input
                  ref={jsonInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleJsonFile(e.target.files[0]);
                    e.target.value = "";
                  }}
                />
                <button type="button" onClick={() => (setJsonText(JSON_SAMPLE), setJsonFileName(null), setJsonFileError(null))} className={`${btn.ghost} text-xs`}>
                  {t("common.sample")}
                </button>
                {jsonText && (
                  <button type="button" onClick={() => (setJsonText(""), setJsonFileName(null), setJsonFileError(null))} className={`${btn.ghost} text-xs`}>
                    {t("common.clear")}
                  </button>
                )}
                {jsonFileName && <span className="truncate text-xs text-gray-500">{jsonFileName}</span>}
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonFileError(null);
                }}
                aria-label={t("data.sql.jsonLabel")}
                placeholder={JSON_SAMPLE}
                rows={9}
                spellCheck={false}
                className={`${INPUT} font-mono text-xs`}
                data-testid="sql-json-input"
              />
              {(jsonFileError ?? jsonParsed.error) && <Notice tone="error">{jsonFileError ?? jsonParsed.error}</Notice>}
              {!jsonParsed.error && jsonText.trim() && !jsonParsed.rows.length && <Notice tone="warn">{t("data.errors.noRows")}</Notice>}
            </div>
          )}
        </Panel>

        {rows.length === 0 ? (
          <div className="ow-card">
            <EmptyState icon={Database} title={t("data.sql.emptyTitle")} text={t("data.sql.emptyText")} testId="sql-empty" />
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            <Panel title={t("data.sql.mappingTitle")} description={t("data.sql.detected", { rows: rows.length, cols: columnMaps.length })}>
              <div className="flex flex-col gap-4">
                <Field label={t("data.sql.tableName")} htmlFor="sql-table">
                  <input
                    id="sql-table"
                    type="text"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder={t("data.sql.tablePlaceholder")}
                    className={`${INPUT} font-mono ${!tableOk ? "border-amber-400" : ""}`}
                    aria-invalid={!tableOk}
                    data-testid="sql-table"
                  />
                </Field>
                <ColumnMapper rows={rows} columnMaps={columnMaps} onUpdate={updateColumn} onToggleAll={toggleAll} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField<InsertMode>
                    label={t("data.sql.insertMode")}
                    value={insertMode}
                    onChange={setInsertMode}
                    options={[
                      { value: "bulk", label: t("data.sql.bulk") },
                      { value: "single", label: t("data.sql.single") },
                    ]}
                  />
                  <SelectField<SqlDialect>
                    label={t("data.sql.dialect")}
                    value={dialect}
                    onChange={setDialect}
                    options={[
                      { value: "mysql", label: "MySQL / MariaDB" },
                      { value: "postgres", label: "PostgreSQL" },
                      { value: "mssql", label: "SQL Server" },
                      { value: "generic", label: t("data.sql.generic") },
                    ]}
                  />
                </div>
                <Toggle checked={nullAsKeyword} onChange={setNullAsKeyword} label={t("data.sql.nullKeyword")} hint={t("data.sql.nullKeywordHint")} />
              </div>
            </Panel>
            <SqlPreviewPanel previewSql={previewSql} canGenerate={canGenerate} totalRows={rows.length} previewRowLimit={PREVIEW_ROW_LIMIT} hint={hint} getFullSql={getFullSql} onDownload={downloadSql} />
          </div>
        )}
      </div>
    </>
  );
}
