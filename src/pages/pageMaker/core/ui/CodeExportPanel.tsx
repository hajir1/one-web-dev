import { useEffect, useState, type ReactNode } from "react";
import { limitText } from "../../../../marketplace/hooks";
import { useTranslation } from "react-i18next";
import { Coins, Download, Lock, Rocket } from "lucide-react";
import { useExportQuota } from "../../../../credits/useDownloadQuota";
import type { ExportedFile, ServerExportSource } from "../../../../credits/downloadQuota";
import { notify } from "../../../../components/app/Toaster";
import JSZip from "jszip";
import { packForFramework } from "../../../../assetLibrary/resolve";
import { Framework, FRAMEWORK_LABELS } from "../helpers/generatorCss";
import { isDemoMode } from "../../../../demo/demoMode";
import { deployKey } from "../../helpers/deployHistory";
import DeployDialog from "../../ui/DeployDialog";
import CopyButton from "../../../../components/app/CopyButton";
import type { DeployFile } from "../../helpers/githubDeploy";

/** One generated file (used in the code panel & when zipped for download). */
export interface GeneratedFile {
  name: string;
  content: string;
  lang: string;
}

interface CodeExportPanelProps {
  framework: Framework;
  onFrameworkChange: (fw: Framework) => void;
  files: GeneratedFile[];
  /** Zip file name prefix, e.g. "button" -> "button-react.zip". */
  zipBaseName: string;
  /** Maximum height of the code area. Default: max-h-80. */
  codeMaxHeightClass?: string;
  /**
   * Export source on the server (a saved design/website). null = cannot
   * be exported yet (e.g. not saved) → `notReadyKey` is shown.
   * Downloaded files ALWAYS come from the server; `files` is only for the preview.
   */
  source: ServerExportSource | null;
  notReadyKey?: string;
  /** v9: unlimited free downloads (Full Website Compose): the quota is not shown. */
  unlimited?: boolean;
  /** v17: opens the Deploy dialog when the panel shows (the "Deploy" link from My Websites). */
  autoDeploy?: boolean;
  /** CRUD preview: asset image layout when zipped (e.g. "express" → public/). Default: framework. */
  packAs?: string;
  /** Content above the framework choice (e.g. the Include CRUD option). */
  header?: ReactNode;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke ditunda: beberapa browser (Firefox/Safari) membatalkan unduhan
  // if the URL is revoked in the same tick as click().
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Number of lines that can be viewed for free per file. */
function previewLineCount(total: number): number {
  return Math.min(total, Math.max(6, Math.min(24, Math.floor(total * 0.4))));
}

/**
 * A code excerpt for the free preview. The rest is NOT sent to the DOM,
 * so the full code is only available through a download (quota / credits).
 */
export function limitedPreview(content: string): { visible: string; hidden: number } {
  const lines = content.split("\n");
  const keep = previewLineCount(lines.length);
  return { visible: lines.slice(0, keep).join("\n"), hidden: Math.max(0, lines.length - keep) };
}

/**
 * Code export panel: pick a framework, pick a file, see a limited PREVIEW,
 * then download the full code as a ready-to-run project ZIP (with a README).
 * The full code is built by the SERVER (checks Premium + per-account quota); after the free
 * quota runs out → credit dialog.
 */
export default function CodeExportPanel({
  framework,
  onFrameworkChange,
  files,
  zipBaseName,
  codeMaxHeightClass = "max-h-80",
  source,
  notReadyKey = "pm.export.saveFirst",
  unlimited = false,
  autoDeploy = false,
  packAs,
  header,
}: CodeExportPanelProps) {
  const { t } = useTranslation();
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const quota = useExportQuota();
  /** i18n key of the last export result (translated at render time). */
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deployOpen, setDeployOpen] = useState(autoDeploy && framework === "html");

  // Keep the index valid when the file count changes (e.g. Tabs: script.js appears/disappears).
  const safeIdx = Math.min(activeFileIdx, Math.max(files.length - 1, 0));
  useEffect(() => {
    if (activeFileIdx !== safeIdx) setActiveFileIdx(safeIdx);
  }, [activeFileIdx, safeIdx]);

  const activeFile = files[safeIdx];

  const changeFramework = (fw: Framework) => {
    onFrameworkChange(fw);
    setActiveFileIdx(0);
  };

  // Demo mode (v12): no server & account → the full code is built in the browser and downloaded without a quota.
  const demo = isDemoMode();

  const downloadFiles = async () => {
    if (files.length === 0 || busy) return;
    if (demo) {
      setBusy(true);
      try {
        await save(files);
        setLastResult("demo.export.done");
      } catch {
        setLastResult("pm.export.failed");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!source) {
      notify.warn(t(notReadyKey));
      return;
    }
    setBusy(true);
    try {
      const res = await quota.run(source, framework, save);
      setLastResult(
        res === "counted"
          ? "pm.export.counted"
          : res === "paid"
            ? "pm.export.paidShort"
            : res === "free"
              ? "pm.export.freeDone"
            : res === "repeat"
            ? "pm.export.repeat"
            : res === "failed"
              ? "pm.export.failed"
              : null,
      );
    } finally {
      setBusy(false);
    }
  };

  /**
   * Saves the files from the server (not the local generated output). v7: ALWAYS a zip
   * (a ready-to-run project + README), with one root folder named after the project.
   */
  const save = async (out: ExportedFile[]) => {
    if (out.length === 0) throw new Error("server mengirim 0 berkas");
    const root = `${zipBaseName}-${framework}`;
    const zip = new JSZip();
    // v21: Asset Library images (`aset:<id>`) → real files in the zip.
    const packed = await packForFramework(out, packAs ?? framework);
    packed.files.forEach((f) => zip.file(`${root}/${f.name}`, f.content));
    packed.binaries.forEach((b) => zip.file(`${root}/${b.name}`, b.blob));
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    triggerDownload(blob, `${root}.zip`);
  };

  /**
   * v14: files for the Deploy dialog (HTML only). Demo mode: local generated output;
   * production: files from the server through the normal export flow (same quota/credits as a download).
   */
  const withDeployFiles = async (push: (files: DeployFile[]) => Promise<void>): Promise<"done" | "blocked" | "failed"> => {
    if (demo) {
      // The deploy error is already shown by the dialog.
      return push(files).then(
        () => "done" as const,
        () => "failed" as const,
      );
    }
    if (!source) {
      notify.warn(t(notReadyKey));
      return "failed";
    }
    const res = await quota.run(source, framework, push);
    return res === "blocked" ? "blocked" : res === "failed" || res === "signin" ? "failed" : "done";
  };

  if (!activeFile) return null;
  const preview = demo ? { visible: activeFile.content, hidden: 0 } : limitedPreview(activeFile.content);

  return (
    <>
      {header}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Framework choice */}
        <div className="flex flex-wrap gap-1.5 border-b border-gray-200 dark:border-gray-800 px-3 py-2.5">
          {(Object.keys(FRAMEWORK_LABELS) as Framework[]).map((fw) => (
            <button
              key={fw}
              type="button"
              onClick={() => changeFramework(fw)}
              aria-pressed={framework === fw}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                framework === fw
                  ? "bg-blue-800 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:opacity-80"
              }`}
            >
              {FRAMEWORK_LABELS[fw]}
            </button>
          ))}
        </div>

        {/* Tab file */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 px-3">
          <div className="flex flex-wrap min-w-0">
            {files.map((f, idx) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setActiveFileIdx(idx)}
                className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 -mb-px ${
                  idx === safeIdx
                    ? "border-blue-800 text-blue-800 dark:text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
          {demo && (
            <span className="shrink-0 py-1.5">
              <CopyButton text={activeFile.content} testId="code-copy" />
            </span>
          )}
          {!demo && (
            <span className="inline-flex shrink-0 items-center gap-1 py-2 text-[11px] font-medium text-amber-700 dark:text-amber-400">
              <Lock size={12} /> {t("pm.export.limitedPreview")}
            </span>
          )}
        </div>
        <div className="relative">
          <pre
            data-testid="code-preview"
            className={`text-xs leading-relaxed p-4 whitespace-pre-wrap wrap-break-word text-gray-700 dark:text-gray-300 ${codeMaxHeightClass} overflow-y-auto ${demo ? "" : "select-none"}`}
          >
            <code>{preview.visible}</code>
          </pre>
          {preview.hidden > 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent dark:from-gray-900" />
          )}
        </div>
        {preview.hidden > 0 && (
          <div
            data-testid="code-locked"
            className="flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300"
          >
            <Lock size={13} className="shrink-0 text-amber-600" />
            <span>
              {t("pm.export.hiddenLines", { count: preview.hidden, framework: FRAMEWORK_LABELS[framework] })}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={downloadFiles}
          disabled={busy}
          data-testid="download-code"
          className="bg-blue-800 text-white px-4 py-2.5 rounded font-semibold text-sm inline-flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-60"
        >
          {quota.remaining === 0 && !unlimited && !demo ? <Coins size={15} /> : <Download size={15} />}
          {t("pm.export.downloadZip", { framework: FRAMEWORK_LABELS[framework] })}
        </button>
        {framework === "html" && (
          <button
            type="button"
            onClick={() => setDeployOpen(true)}
            data-testid="deploy-open"
            className="border border-blue-800 text-blue-800 dark:border-blue-400 dark:text-blue-300 px-4 py-2.5 rounded font-semibold text-sm inline-flex items-center justify-center gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10"
          >
            <Rocket size={15} /> {t("pm.deploy.open")}
          </button>
        )}
        <span data-testid="download-quota" className="text-xs text-gray-500 dark:text-gray-400">
          {demo
            ? t("demo.export.unlimited")
            : unlimited
            ? t("pm.export.unlimited")
            : quota.remaining === null
            ? t("pm.export.checkingQuota")
            : quota.remaining > 0
              ? t("pm.export.quotaLeft", { remaining: limitText(quota.remaining), total: limitText(quota.total) })
              : t("pm.export.quotaOut")}
        </span>
        {lastResult && (
          <span data-testid="export-result" role="status" className="w-full text-xs text-gray-500 dark:text-gray-400">
            {t(lastResult)}
          </span>
        )}
        {framework === "html" ? (
          <p className="w-full text-xs text-gray-500 dark:text-gray-400">{t("pm.deploy.hint")}</p>
        ) : (
          <p className="w-full text-xs text-gray-500 dark:text-gray-400" data-testid="deploy-html-only">
            {t("pm.deploy.htmlOnly")}
          </p>
        )}
      </div>
      {framework === "html" && deployOpen && <DeployDialog open onClose={() => setDeployOpen(false)} defaultRepo={zipBaseName} withFiles={withDeployFiles} projectKey={source?.kind === "site" ? deployKey("site", source.id) : undefined} />}
    </>
  );
}
