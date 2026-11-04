import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Combine,
  Download,
  FileImage,
  FileMinus,
  FileStack,
  FileText,
  Images,
  ListOrdered,
  RotateCw,
  Scissors,
  ShieldCheck,
  Shrink,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import { Link, Navigate } from "../../../components/app/LocaleLink";
import { Chip, Field, INPUT, Notice, Panel, ProgressBar, Segmented, Toggle, btn } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import FileDropZone from "../shared/FileDropZone";
import { formatSize } from "../shared/excelUtils";
import { baseName, safeFileName, triggerDownload } from "../shared/downloadUtils";
import { DataError, dataErrorMessage } from "../shared/errors";
import { MAX_IMAGES, MAX_PDF_BYTES, MAX_PDF_FILES } from "./pdfLimits";
import type { ImageInput, PageSize } from "./pdfLib";
import { isDemoMode } from "../../../demo/demoMode";

/** pdf-lib (about 400 KB) loads when a tool is first used. */
const lib = () => import("./pdfLib");

/* ================================================================== */
/* PDF tools (v10): merge, split, extract/delete/rotate/reorder pages,   */
/* compress, PDF → images, images → PDF. 100% in the browser, free.    */
/* ================================================================== */

const BASE = "/data-tools/pdf-tools";

type PdfToolId = "merge" | "split" | "extract" | "delete" | "rotate" | "organize" | "compress" | "to-image" | "from-image";

const PDF_TOOLS: { id: PdfToolId; icon: LucideIcon }[] = [
  { id: "merge", icon: Combine },
  { id: "split", icon: Scissors },
  { id: "compress", icon: Shrink },
  { id: "to-image", icon: FileImage },
  { id: "from-image", icon: Images },
  { id: "extract", icon: FileStack },
  { id: "delete", icon: FileMinus },
  { id: "rotate", icon: RotateCw },
  { id: "organize", icon: ListOrdered },
];
const isPdfTool = (v: string): v is PdfToolId => PDF_TOOLS.some((x) => x.id === v);

const readBytes = async (f: File) => new Uint8Array(await f.arrayBuffer());
const pdfBlob = (b: Uint8Array) => new Blob([b as BlobPart], { type: "application/pdf" });

async function zipAndDownload(entries: { name: string; data: Blob | Uint8Array }[], zipName: string) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const e of entries) zip.file(e.name, e.data);
  triggerDownload(await zip.generateAsync({ type: "blob" }), zipName);
}

/** One selected PDF file + its page count. */
function usePdfFile() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pick = async (files: File[]) => {
    const f = files[0];
    setError(null);
    setPages(null);
    if (!f) return;
    if (f.size > MAX_PDF_BYTES) {
      setError(dataErrorMessage(new DataError("fileTooLarge", { max: formatSize(MAX_PDF_BYTES) })));
      return;
    }
    try {
      const info = await (await lib()).pdfInfo(await readBytes(f));
      setFile(f);
      setPages(info.pages);
    } catch (e) {
      setFile(null);
      setError(dataErrorMessage(e));
    }
  };
  return { file, pages, error, pick, clear: () => (setFile(null), setPages(null)) };
}

function PdfPicker({ state }: { state: ReturnType<typeof usePdfFile> }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <FileDropZone accept=".pdf,application/pdf" onFiles={state.pick} title={t("data.pdf.dropOne")} hint={t("data.pdf.dropHint", { max: formatSize(MAX_PDF_BYTES) })} compact={!!state.file} testId="pdf-drop" />
      {state.file && (
        <p className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200" data-testid="pdf-file">
          <FileText className="h-4 w-4 text-rose-600" />
          <span className="min-w-0 flex-1 truncate font-medium">{state.file.name}</span>
          <span className="text-xs text-gray-400">
            {formatSize(state.file.size)} · {t("data.pdf.pageCount", { count: state.pages ?? 0 })}
          </span>
        </p>
      )}
      {state.error && <Notice tone="error">{state.error}</Notice>}
    </div>
  );
}

/** Process button + progress + result. */
function useRunner() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  const run = async (fn: (signal: AbortSignal, onProgress: (d: number, n: number) => void) => Promise<string | void>) => {
    abort.current?.abort();
    const ctl = new AbortController();
    abort.current = ctl;
    setBusy(true);
    setResult(null);
    setProgress(null);
    try {
      const msg = await fn(ctl.signal, (d, n) => setProgress(Math.round((d / n) * 100)));
      if (msg) setResult(msg);
      notify.success(t("data.pdf.done"));
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") notify.error(dataErrorMessage(e));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };
  return { busy, progress, result, run, cancel: () => abort.current?.abort() };
}

function RunBar({ runner, disabled, label, onRun }: { runner: ReturnType<typeof useRunner>; disabled: boolean; label: string; onRun: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={btn.primary} disabled={disabled || runner.busy} onClick={onRun} data-testid="pdf-run">
          <Download className="h-4 w-4" /> {runner.busy ? t("data.pdf.working") : label}
        </button>
        {runner.busy && (
          <button type="button" className={btn.ghost} onClick={runner.cancel}>
            {t("common.cancel")}
          </button>
        )}
      </div>
      {runner.busy && <ProgressBar value={runner.progress} label={t("data.pdf.working")} />}
      {runner.result && (
        <Notice tone="success" testId="pdf-result">
          {runner.result}
        </Notice>
      )}
    </div>
  );
}

/* ------------------------------ gabung ------------------------------ */

function MergeTool() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const runner = useRunner();
  const add = (list: File[]) => {
    const pdfs = list.filter((f) => /\.pdf$/i.test(f.name) || f.type === "application/pdf");
    if (pdfs.length < list.length) notify.error(t("data.pdf.onlyPdf"));
    setFiles((cur) => [...cur, ...pdfs].slice(0, MAX_PDF_FILES));
  };
  const move = (i: number, d: number) =>
    setFiles((cur) => {
      const next = [...cur];
      const [x] = next.splice(i, 1);
      next.splice(i + d, 0, x);
      return next;
    });
  const total = files.reduce((s, f) => s + f.size, 0);
  return (
    <div className="flex flex-col gap-4">
      <FileDropZone accept=".pdf,application/pdf" multiple onFiles={add} title={t("data.pdf.dropMany")} hint={t("data.pdf.dropManyHint", { max: MAX_PDF_FILES })} compact={files.length > 0} testId="pdf-drop" />
      {files.length > 0 && (
        <ol className="flex flex-col gap-1.5" data-testid="pdf-merge-list">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-800">
              <span className="w-5 text-xs font-semibold text-gray-400">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="text-xs text-gray-400">{formatSize(f.size)}</span>
              <button type="button" className={btn.icon} aria-label={t("data.pdf.up")} disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" className={btn.icon} aria-label={t("data.pdf.down")} disabled={i === files.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" className={btn.icon} aria-label={t("common.delete")} onClick={() => setFiles((cur) => cur.filter((_, k) => k !== i))}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ol>
      )}
      <RunBar
        runner={runner}
        disabled={files.length < 2 || total > MAX_PDF_BYTES}
        label={t("data.pdf.tools.merge.action")}
        onRun={() =>
          runner.run(async () => {
            const out = await (await lib()).mergePdfs(await Promise.all(files.map(readBytes)));
            triggerDownload(pdfBlob(out), "gabungan.pdf");
            return t("data.pdf.resultSize", { size: formatSize(out.length) });
          })
        }
      />
    </div>
  );
}

/* ------------------- one PDF + page range ------------------- */

function RangeTool({ tool }: { tool: "extract" | "delete" | "rotate" | "organize" | "split" }) {
  const { t } = useTranslation();
  const pdf = usePdfFile();
  const runner = useRunner();
  const [ranges, setRanges] = useState("");
  const [angle, setAngle] = useState<"90" | "180" | "270">("90");
  const [mode, setMode] = useState<"each" | "every" | "range">("each");
  const [every, setEvery] = useState(2);
  const name = pdf.file ? safeFileName(baseName(pdf.file.name), "dokumen") : "dokumen";
  const needsRange = tool === "extract" || tool === "delete" || tool === "organize" || (tool === "split" && mode === "range");

  const go = () =>
    runner.run(async () => {
      const bytes = await readBytes(pdf.file!);
      if (tool === "split" && mode !== "range") {
        const parts = await (await lib()).splitPdf(bytes, mode === "each" ? 1 : every);
        const width = String(parts.length).length;
        await zipAndDownload(
          parts.map((p, i) => ({ name: `${name}-${String(i + 1).padStart(width, "0")}.pdf`, data: p })),
          `${name}-pisah.zip`,
        );
        return t("data.pdf.resultParts", { count: parts.length });
      }
      const out =
        tool === "delete"
          ? await (await lib()).deletePages(bytes, ranges)
          : tool === "rotate"
            ? await (await lib()).rotatePages(bytes, Number(angle) as 90 | 180 | 270, ranges)
            : tool === "organize"
              ? await (await lib()).reorderPages(bytes, ranges)
              : await (await lib()).extractPages(bytes, ranges);
      triggerDownload(pdfBlob(out), `${name}-${tool}.pdf`);
      return t("data.pdf.resultSize", { size: formatSize(out.length) });
    });

  return (
    <div className="flex flex-col gap-4">
      <PdfPicker state={pdf} />
      {tool === "split" && (
        <Segmented
          label={t("data.pdf.split.mode")}
          value={mode}
          onChange={setMode}
          options={[
            { value: "each", label: t("data.pdf.split.each") },
            { value: "every", label: t("data.pdf.split.every") },
            { value: "range", label: t("data.pdf.split.range") },
          ]}
        />
      )}
      {tool === "split" && mode === "every" && (
        <Field label={t("data.pdf.split.everyLabel")}>
          <input type="number" min={1} max={500} value={every} onChange={(e) => setEvery(Math.max(1, Math.min(500, Number(e.target.value) || 1)))} className={`${INPUT} max-w-32`} />
        </Field>
      )}
      {tool === "rotate" && (
        <Segmented label={t("data.pdf.rotate.angle")} value={angle} onChange={setAngle} options={[{ value: "90", label: "90°" }, { value: "180", label: "180°" }, { value: "270", label: "270°" }]} />
      )}
      {(needsRange || tool === "rotate") && (
        <Field label={t(`data.pdf.rangeLabel.${tool === "split" ? "extract" : tool}`)} hint={t(tool === "organize" ? "data.pdf.orderHint" : "data.pdf.rangeHint", { total: pdf.pages ?? "?" })}>
          <input value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder={tool === "organize" ? "3, 1, 2, 4-" : tool === "rotate" ? t("data.pdf.allPages") : "1-3, 5, 8-"} className={INPUT} data-testid="pdf-range" />
        </Field>
      )}
      <RunBar runner={runner} disabled={!pdf.file || (needsRange && !ranges.trim())} label={t(`data.pdf.tools.${tool}.action`)} onRun={go} />
    </div>
  );
}

/* ------------------------------ kompres ----------------------------- */

function CompressTool() {
  const { t } = useTranslation();
  const pdf = usePdfFile();
  const runner = useRunner();
  const [level, setLevel] = useState<"lossless" | "low" | "medium" | "high">("medium");
  const [strip, setStrip] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <PdfPicker state={pdf} />
      <Segmented
        label={t("data.pdf.compress.level")}
        value={level}
        onChange={setLevel}
        options={(["lossless", "low", "medium", "high"] as const).map((v) => ({ value: v, label: t(`data.pdf.compress.${v}`) }))}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">{t(`data.pdf.compress.${level}Hint`)}</p>
      {level === "lossless" && <Toggle checked={strip} onChange={setStrip} label={t("data.pdf.compress.strip")} />}
      <RunBar
        runner={runner}
        disabled={!pdf.file}
        label={t("data.pdf.tools.compress.action")}
        onRun={() =>
          runner.run(async (signal, onProgress) => {
            const bytes = await readBytes(pdf.file!);
            const out =
              level === "lossless" ? await (await lib()).compressLossless(bytes, strip) : await (await import("./pdfRender")).compressRaster(bytes, level, signal, onProgress);
            const before = bytes.length;
            if (out.length >= before) return t("data.pdf.compress.noGain");
            triggerDownload(pdfBlob(out), `${safeFileName(baseName(pdf.file!.name), "dokumen")}-kecil.pdf`);
            return t("data.pdf.compress.result", { before: formatSize(before), after: formatSize(out.length), pct: Math.round((1 - out.length / before) * 100) });
          })
        }
      />
    </div>
  );
}

/* --------------------------- PDF → image --------------------------- */

function ToImageTool() {
  const { t } = useTranslation();
  const pdf = usePdfFile();
  const runner = useRunner();
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("jpeg");
  const [dpi, setDpi] = useState<"72" | "150" | "300">("150");
  const [ranges, setRanges] = useState("");
  return (
    <div className="flex flex-col gap-4">
      <PdfPicker state={pdf} />
      <div className="flex flex-wrap gap-4">
        <Segmented label={t("data.pdf.toImage.format")} value={format} onChange={setFormat} options={[{ value: "jpeg", label: "JPG" }, { value: "png", label: "PNG" }, { value: "webp", label: "WebP" }]} />
        <Segmented label={t("data.pdf.toImage.dpi")} value={dpi} onChange={setDpi} options={[{ value: "72", label: "72 DPI" }, { value: "150", label: "150 DPI" }, { value: "300", label: "300 DPI" }]} />
      </div>
      <Field label={t("data.pdf.rangeLabel.extract")} hint={t("data.pdf.rangeHint", { total: pdf.pages ?? "?" })}>
        <input value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder={t("data.pdf.allPages")} className={INPUT} />
      </Field>
      <RunBar
        runner={runner}
        disabled={!pdf.file}
        label={t("data.pdf.tools.to-image.action")}
        onRun={() =>
          runner.run(async (signal, onProgress) => {
            const { renderPages } = await import("./pdfRender");
            const pages = await renderPages(await readBytes(pdf.file!), { dpi: Number(dpi), format, quality: 0.9, ranges, signal, onProgress });
            const name = safeFileName(baseName(pdf.file!.name), "halaman");
            const ext = format === "jpeg" ? "jpg" : format;
            if (pages.length === 1) triggerDownload(pages[0].blob, `${name}-${pages[0].index + 1}.${ext}`);
            else await zipAndDownload(pages.map((p) => ({ name: `${name}-${p.index + 1}.${ext}`, data: p.blob })), `${name}-gambar.zip`);
            return t("data.pdf.resultImages", { count: pages.length });
          })
        }
      />
    </div>
  );
}

/* --------------------------- image → PDF --------------------------- */

/** Reads an image; anything other than JPG/PNG (WebP, GIF, BMP, AVIF) is converted to PNG via canvas. */
async function toImageInput(f: File): Promise<ImageInput> {
  const bytes = await readBytes(f);
  const bmp = await createImageBitmap(f).catch(() => {
    throw new DataError("unsupportedFile", { name: f.name });
  });
  const { width, height } = bmp;
  if (f.type === "image/jpeg" || f.type === "image/png") {
    bmp.close();
    return { bytes, type: f.type === "image/png" ? "png" : "jpg", width, height };
  }
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  c.getContext("2d")!.drawImage(bmp, 0, 0);
  bmp.close();
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
  if (!blob) throw new DataError("readFailed");
  return { bytes: new Uint8Array(await blob.arrayBuffer()), type: "png", width, height };
}

function FromImageTool() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState<PageSize>("a4");
  const [margin, setMargin] = useState<"0" | "20" | "40">("20");
  const runner = useRunner();
  return (
    <div className="flex flex-col gap-4">
      <FileDropZone
        accept="image/*"
        multiple
        onFiles={(l) => setFiles((cur) => [...cur, ...l.filter((f) => f.type.startsWith("image/"))].slice(0, MAX_IMAGES))}
        title={t("data.pdf.fromImage.drop")}
        hint={t("data.pdf.fromImage.hint", { max: MAX_IMAGES })}
        compact={files.length > 0}
        testId="pdf-drop"
      />
      {files.length > 0 && (
        <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          {t("data.pdf.fromImage.count", { count: files.length })}
          <button type="button" className={btn.ghost} onClick={() => setFiles([])}>
            {t("data.pdf.clear")}
          </button>
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        <Segmented label={t("data.pdf.fromImage.size")} value={size} onChange={setSize} options={[{ value: "a4", label: "A4" }, { value: "letter", label: "Letter" }, { value: "fit", label: t("data.pdf.fromImage.fit") }]} />
        <Segmented label={t("data.pdf.fromImage.margin")} value={margin} onChange={setMargin} options={[{ value: "0", label: t("data.pdf.fromImage.noMargin") }, { value: "20", label: t("data.pdf.fromImage.small") }, { value: "40", label: t("data.pdf.fromImage.large") }]} />
      </div>
      <RunBar
        runner={runner}
        disabled={!files.length}
        label={t("data.pdf.tools.from-image.action")}
        onRun={() =>
          runner.run(async (signal, onProgress) => {
            const inputs: ImageInput[] = [];
            for (let i = 0; i < files.length; i++) {
              if (signal.aborted) throw new DOMException("aborted", "AbortError");
              inputs.push(await toImageInput(files[i]));
              onProgress(i + 1, files.length);
            }
            const out = await (await lib()).imagesToPdf(inputs, size, Number(margin));
            triggerDownload(pdfBlob(out), "gambar.pdf");
            return t("data.pdf.resultSize", { size: formatSize(out.length) });
          })
        }
      />
    </div>
  );
}

/* ------------------------------ page ----------------------------- */

function Hub() {
  const { t } = useTranslation();
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" data-testid="pdf-hub">
      {PDF_TOOLS.map((x) => (
        <li key={x.id}>
          <Link to={`${BASE}/${x.id}`} className="ow-card group flex h-full items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md" data-testid={`pdf-hub-${x.id}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              <x.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                {t(`data.pdf.tools.${x.id}.name`)}
                <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 transition group-hover:text-brand-600" />
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{t(`data.pdf.tools.${x.id}.description`)}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function PdfTools() {
  const { t } = useTranslation();
  const { tool } = useParams();
  if (tool !== undefined && !isPdfTool(tool)) return <Navigate to={BASE} replace />;
  const def = tool ? PDF_TOOLS.find((x) => x.id === tool)! : null;
  const title = def ? t(`data.pdf.tools.${def.id}.name`) : t("data.pdf.title");
  const desc = def ? t(`data.pdf.tools.${def.id}.description`) : t("data.pdf.description");
  return (
    <>
      <AppMeta title={def ? `${title} · ${t("data.pdf.title")}` : title} description={desc} />
      <div className="flex min-w-0 flex-col gap-5" data-testid="pdf-tools">
        <PageHeader
          icon={def?.icon ?? FileText}
          tileClassName="bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
          title={title}
          description={desc}
          crumbs={[{ label: t("nav.sections.data.name"), to: "/data-tools" }, { label: t("data.pdf.title"), to: def ? BASE : undefined }, ...(def ? [{ label: title }] : [])]}
          help="data-pdf"
          chips={
            <>
              <Chip tone="green">
                <ShieldCheck className="h-3 w-3" /> {t("data.common.browserOnly")}
              </Chip>
              {!isDemoMode() && <Chip tone="blue">{t("common.free")}</Chip>}
            </>
          }
        />
        {def && (
          <nav aria-label={t("data.pdf.toolsNav")} className="-mx-1 flex w-full min-w-0 max-w-full gap-1 overflow-x-auto px-1 pb-1">
            {PDF_TOOLS.map((x) => (
              <Link
                key={x.id}
                to={`${BASE}/${x.id}`}
                aria-current={x.id === def.id ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  x.id === def.id
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                <x.icon className="h-3.5 w-3.5" /> {t(`data.pdf.tools.${x.id}.name`)}
              </Link>
            ))}
          </nav>
        )}
        {!def ? (
          <Hub />
        ) : (
          <Panel key={def.id}>
            {def.id === "merge" ? (
              <MergeTool />
            ) : def.id === "compress" ? (
              <CompressTool />
            ) : def.id === "to-image" ? (
              <ToImageTool />
            ) : def.id === "from-image" ? (
              <FromImageTool />
            ) : (
              <RangeTool tool={def.id} />
            )}
          </Panel>
        )}
      </div>
    </>
  );
}
