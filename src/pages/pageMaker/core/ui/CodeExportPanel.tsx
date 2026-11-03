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
import DeployDialog from "../../ui/DeployDialog";
import CopyButton from "../../../../components/app/CopyButton";
import type { DeployFile } from "../../helpers/githubDeploy";

/** Satu file hasil generate (dipakai di panel kode & saat di-zip untuk download). */
export interface GeneratedFile {
  name: string;
  content: string;
  lang: string;
}

interface CodeExportPanelProps {
  framework: Framework;
  onFrameworkChange: (fw: Framework) => void;
  files: GeneratedFile[];
  /** Awalan nama file zip, mis. "button" -> "button-react.zip". */
  zipBaseName: string;
  /** Tinggi maksimum area kode. Default: max-h-80. */
  codeMaxHeightClass?: string;
  /**
   * Sumber ekspor di server (desain/website tersimpan). null = belum bisa
   * diekspor (mis. belum disimpan) → `notReadyKey` ditampilkan.
   * Berkas yang diunduh SELALU dari server; `files` hanya untuk pratinjau.
   */
  source: ServerExportSource | null;
  notReadyKey?: string;
  /** v9: unduhan gratis tanpa batas (Susun Website Utuh): kuota tidak ditampilkan. */
  unlimited?: boolean;
  /** v17: buka dialog Deploy saat panel tampil (tautan "Deploy" dari Website Saya). */
  autoDeploy?: boolean;
  /** Uji coba CRUD: tata letak gambar aset saat di-zip (mis. "express" → public/). Default: framework. */
  packAs?: string;
  /** Konten di atas pilihan framework (mis. opsi Include CRUD). */
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
  // kalau URL langsung dicabut di tick yang sama dengan click().
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Jumlah baris yang boleh dilihat gratis untuk satu file. */
function previewLineCount(total: number): number {
  return Math.min(total, Math.max(6, Math.min(24, Math.floor(total * 0.4))));
}

/**
 * Potongan kode untuk pratinjau gratis. Sisanya TIDAK dikirim ke DOM,
 * jadi kode lengkap hanya didapat lewat unduhan (kuota / kredit).
 */
export function limitedPreview(content: string): { visible: string; hidden: number } {
  const lines = content.split("\n");
  const keep = previewLineCount(lines.length);
  return { visible: lines.slice(0, keep).join("\n"), hidden: Math.max(0, lines.length - keep) };
}

/**
 * Panel export kode: pilih framework, pilih file, lihat PRATINJAU terbatas,
 * lalu download kode lengkap sebagai ZIP proyek siap jalan (berisi README).
 * Kode lengkap dibuat SERVER (cek Premium + kuota per akun); setelah kuota
 * gratis habis → dialog kredit.
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
  /** Kunci i18n hasil ekspor terakhir (diterjemahkan saat render). */
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deployOpen, setDeployOpen] = useState(autoDeploy && framework === "html");

  // Jaga index tetap valid kalau jumlah file berubah (mis. Tabs: script.js muncul/hilang).
  const safeIdx = Math.min(activeFileIdx, Math.max(files.length - 1, 0));
  useEffect(() => {
    if (activeFileIdx !== safeIdx) setActiveFileIdx(safeIdx);
  }, [activeFileIdx, safeIdx]);

  const activeFile = files[safeIdx];

  const changeFramework = (fw: Framework) => {
    onFrameworkChange(fw);
    setActiveFileIdx(0);
  };

  // Mode demo (v12): tanpa server & akun → kode lengkap dibuat di browser dan diunduh tanpa kuota.
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
   * Simpan berkas hasil server (bukan hasil generate lokal). v7: SELALU zip
   * (proyek siap jalan + README), dengan satu folder akar bernama proyek.
   */
  const save = async (out: ExportedFile[]) => {
    if (out.length === 0) throw new Error("server mengirim 0 berkas");
    const root = `${zipBaseName}-${framework}`;
    const zip = new JSZip();
    // v21: gambar Pustaka Aset (`aset:<id>`) → berkas sungguhan di zip.
    const packed = await packForFramework(out, packAs ?? framework);
    packed.files.forEach((f) => zip.file(`${root}/${f.name}`, f.content));
    packed.binaries.forEach((b) => zip.file(`${root}/${b.name}`, b.blob));
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    triggerDownload(blob, `${root}.zip`);
  };

  /**
   * v14: berkas untuk dialog Deploy (hanya HTML). Mode demo: hasil generate lokal;
   * produksi: berkas dari server lewat alur ekspor biasa (kuota/kredit sama dengan unduh).
   */
  const withDeployFiles = async (push: (files: DeployFile[]) => Promise<void>): Promise<"done" | "blocked" | "failed"> => {
    if (demo) {
      // Galat deploy sudah ditampilkan dialog.
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
        {/* Pilihan framework */}
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
      {framework === "html" && deployOpen && <DeployDialog open onClose={() => setDeployOpen(false)} defaultRepo={zipBaseName} withFiles={withDeployFiles} />}
    </>
  );
}
