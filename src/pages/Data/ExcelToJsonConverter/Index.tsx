import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import JSZip from "jszip";
import { Download, FileSpreadsheet, Loader2, ShieldCheck, Trash2 } from "lucide-react";

import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import EmptyState from "../../../components/app/EmptyState";
import { Chip, Notice, Panel, btn } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import { ACCEPT_ATTR, ACCEPTED_EXCEL_EXT, LEGACY_SHEET_EXT, MAX_FILE_SIZE, formatSize, makeId, readWorkbook } from "../shared/excelUtils";
import { baseName, safeFileName, triggerDownload } from "../shared/downloadUtils";
import { DataError, dataErrorMessage } from "../shared/errors";
import FileDropZone from "../shared/FileDropZone";
import { sheetToText } from "./converterUtils";
import { ConvertItem, OutputFormat } from "./types";
import FormatControls from "./components/FormatControls";
import ConvertItemCard from "./components/ConvertItemCard";
import { isDemoMode } from "../../../demo/demoMode";

interface Options {
  headerRow: boolean;
  pretty: boolean;
  outputFormat: OutputFormat;
}

const MAX_FILES = 30;

export default function ExcelToJsonConverter() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ConvertItem[]>([]);
  const itemsRef = useRef<ConvertItem[]>([]);
  const [opts, setOpts] = useState<Options>({ headerRow: true, pretty: true, outputFormat: "json" });
  // Opsi terbaru dibaca SETELAH file selesai dibaca → tidak ada hasil dengan opsi basi
  // (bug lama: mengubah opsi saat file besar masih dibaca menghasilkan output lama).
  const optsRef = useRef(opts);
  optsRef.current = opts;
  // Token per item: hasil konversi lama tidak menimpa hasil yang lebih baru.
  const tokens = useRef<Record<string, number>>({});
  const [isZipping, setIsZipping] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Hanya memakai ref + setter state (stabil), jadi aman di-memo tanpa dependensi.
  const commit = useCallback((fn: (prev: ConvertItem[]) => ConvertItem[]) => {
    itemsRef.current = fn(itemsRef.current);
    setItems(itemsRef.current);
  }, []);
  const patch = useCallback(
    (id: string, p: Partial<ConvertItem>) => commit((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i))),
    [commit],
  );

  const fileExt = opts.outputFormat === "js" ? "js" : "json";

  const processItem = useCallback(async (itemId: string, sheetName?: string): Promise<boolean> => {
    const current = itemsRef.current.find((i) => i.id === itemId);
    if (!current) return false;
    const token = (tokens.current[itemId] ?? 0) + 1;
    tokens.current[itemId] = token;
    patch(itemId, { status: "converting", errorMsg: undefined });
    try {
      const workbook = current.workbook ?? (await readWorkbook(current.file));
      if (tokens.current[itemId] !== token || !itemsRef.current.some((i) => i.id === itemId)) return false;
      const sheetNames = workbook.worksheets.map((ws) => ws.name);
      const latest = itemsRef.current.find((i) => i.id === itemId)!;
      const sheet = sheetName || latest.selectedSheet || sheetNames[0] || "";
      const o = optsRef.current;
      const { text, rowCount } = sheetToText(workbook, sheet, o.headerRow, o.pretty, o.outputFormat);
      patch(itemId, {
        status: "done",
        workbook,
        sheetNames,
        selectedSheet: sheet,
        rowCount,
        resultText: text,
        resultBlob: new Blob([text], { type: o.outputFormat === "js" ? "text/javascript" : "application/json" }),
      });
      return true;
    } catch (err) {
      if (tokens.current[itemId] !== token) return false;
      patch(itemId, {
        status: "error",
        errorMsg: dataErrorMessage(err),
        legacy: err instanceof DataError && err.code === "legacyFormat",
        resultText: undefined,
        resultBlob: undefined,
      });
      return false;
    }
  }, [patch]);

  const addFiles = useCallback(
    async (files: File[]) => {
      setGlobalError(null);
      const room = MAX_FILES - itemsRef.current.length;
      const skipped: string[] = [];
      const accepted = files.filter((f) => {
        if (!ACCEPTED_EXCEL_EXT.test(f.name)) return skipped.push(t("data.excel.skipType", { name: f.name })), false;
        if (f.size > MAX_FILE_SIZE) return skipped.push(t("data.excel.skipSize", { name: f.name, max: formatSize(MAX_FILE_SIZE) })), false;
        return true;
      });
      if (accepted.length > room) skipped.push(t("data.excel.skipCount", { count: accepted.length - room, max: MAX_FILES }));
      const take = accepted.slice(0, Math.max(0, room));
      if (skipped.length) setGlobalError(skipped.join(" "));
      if (!take.length) return;

      const newItems: ConvertItem[] = take.map((file) => ({
        id: makeId(),
        file,
        status: "pending",
        originalSize: file.size,
        sheetNames: [],
        selectedSheet: "",
        legacy: LEGACY_SHEET_EXT.test(file.name),
      }));
      commit((prev) => [...prev, ...newItems]);
      const results = await Promise.all(newItems.map((it) => processItem(it.id)));
      const ok = results.filter(Boolean).length;
      const failed = results.length - ok;
      if (failed === 0) notify.success(t("data.excel.converted", { count: ok }));
      else if (ok === 0) notify.error(t("data.excel.allFailed", { count: failed }));
      else notify.warn(t("data.excel.someFailed", { ok, failed }));
    },
    [commit, processItem, t],
  );

  // Opsi berubah → konversi ulang item yang sudah selesai (workbook sudah di memori).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    itemsRef.current.filter((i) => i.status === "done" && i.workbook).forEach((i) => void processItem(i.id));
  }, [opts, processItem]);

  const removeItem = (id: string) => {
    delete tokens.current[id];
    commit((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    tokens.current = {};
    commit(() => []);
    setGlobalError(null);
  };

  const changeSheet = (itemId: string, sheetName: string) => {
    patch(itemId, { selectedSheet: sheetName });
    void processItem(itemId, sheetName);
  };

  const downloadItem = (item: ConvertItem) => {
    if (!item.resultBlob) return;
    triggerDownload(item.resultBlob, `${safeFileName(baseName(item.file.name))}.${fileExt}`);
  };

  const done = items.filter((i) => i.status === "done" && i.resultBlob);

  const downloadAll = async () => {
    if (!done.length) return;
    if (done.length === 1) return downloadItem(done[0]);
    setIsZipping(true);
    setGlobalError(null);
    try {
      const zip = new JSZip();
      const used = new Set<string>();
      done.forEach((item) => {
        const base = safeFileName(baseName(item.file.name));
        let name = `${base}.${fileExt}`;
        for (let n = 1; used.has(name); n++) name = `${base}-${n}.${fileExt}`;
        used.add(name);
        zip.file(name, item.resultBlob as Blob);
      });
      triggerDownload(await zip.generateAsync({ type: "blob" }), `excel-to-json-${Date.now()}.zip`);
      notify.success(t("data.excel.zipReady", { count: done.length }));
    } catch (err) {
      setGlobalError(t("data.excel.zipFailed", { detail: dataErrorMessage(err) }));
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <>
      <AppMeta title={t("data.excel.metaTitle")} description={t("data.excel.metaDescription")} />
      <div className="flex flex-col gap-5" data-testid="excel-to-json">
        <PageHeader
          icon={FileSpreadsheet}
          tileClassName="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
          title={t("data.excel.title")}
          description={t("data.excel.description")}
          crumbs={[{ label: t("nav.sections.data.name"), to: "/data-tools" }, { label: t("data.excel.title") }]}
          help="data-excel-json"
          chips={
            <>
              <Chip tone="green">
                <ShieldCheck className="h-3 w-3" /> {t("data.common.browserOnly")}
              </Chip>
              {!isDemoMode() && <Chip tone="blue">{t("common.free")}</Chip>}
            </>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Panel title={t("data.excel.uploadTitle")} description={t("data.excel.uploadHint", { max: formatSize(MAX_FILE_SIZE), files: MAX_FILES })}>
            <FileDropZone accept={ACCEPT_ATTR} multiple onFiles={addFiles} hint={t("data.excel.dropHint", { max: formatSize(MAX_FILE_SIZE) })} testId="excel-drop" />
            {globalError && (
              <div className="mt-3">
                <Notice tone="warn" onDismiss={() => setGlobalError(null)} testId="excel-error">
                  {globalError}
                </Notice>
              </div>
            )}
          </Panel>
          <Panel title={t("data.excel.optionsTitle")} description={t("data.excel.optionsHint")}>
            <FormatControls
              outputFormat={opts.outputFormat}
              headerRow={opts.headerRow}
              pretty={opts.pretty}
              onOutputFormatChange={(outputFormat) => setOpts((o) => ({ ...o, outputFormat }))}
              onHeaderRowChange={(headerRow) => setOpts((o) => ({ ...o, headerRow }))}
              onPrettyChange={(pretty) => setOpts((o) => ({ ...o, pretty }))}
            />
          </Panel>
        </div>

        <Panel
          title={t("data.excel.resultsTitle")}
          description={items.length ? t("data.excel.resultsSummary", { done: done.length, total: items.length }) : undefined}
          actions={
            items.length > 0 && (
              <>
                <button type="button" onClick={downloadAll} disabled={!done.length || isZipping} className={`${btn.primary} !py-2 text-xs`} data-testid="download-all">
                  {isZipping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  {isZipping ? t("data.excel.zipping") : done.length > 1 ? t("data.excel.downloadZip", { count: done.length }) : t("data.excel.download")}
                </button>
                <button type="button" onClick={clearAll} className={`${btn.ghost} text-xs`} data-testid="clear-all">
                  <Trash2 className="h-3.5 w-3.5" /> {t("data.excel.clearAll")}
                </button>
              </>
            )
          }
          bodyClassName={items.length ? "p-4" : "p-0"}
        >
          {items.length === 0 ? (
            <EmptyState icon={FileSpreadsheet} title={t("data.excel.emptyTitle")} text={t("data.excel.emptyText")} testId="excel-empty" />
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <ConvertItemCard key={item.id} item={item} fileExt={fileExt} onDownload={downloadItem} onReconvert={(id) => void processItem(id)} onChangeSheet={changeSheet} onRemove={removeItem} />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
