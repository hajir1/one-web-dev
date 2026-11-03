import { useEffect, useRef, useState, type ReactNode } from "react";
import { Download, Film, Loader2, Play, Square, X, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import MediaShell from "./MediaShell";
import Dropzone, { useFileIntake } from "./Dropzone";
import FeatureAccessCard from "./FeatureAccess";
import { confirmServerRun } from "./ServerGate";
import { Notice, Panel, ProgressBar, btn, type Accent } from "./ui";
import { useVideoSource, type VideoSource } from "../hooks/useVideoSource";
import { VIDEO_KINDS } from "../lib/fileSniff";
import { formatSize, formatTime } from "../lib/format";
import { downloadBlob } from "../lib/download";
import type { FileRules } from "../lib/validate";
import { TOOL_BY_ID, type MediaToolId } from "../processing/policy";
import { useBilling } from "../processing/billing";
import { validateServerInput, type UsageInput } from "../processing/pricing";
import { runServerJob, StopQueueError } from "../processing/serverClient";

export interface ServerJobSpec {
  params: Record<string, unknown>;
  usage: UsageInput;
  /** Galat validasi; null = siap dijalankan. */
  error: string | null;
  /** Ringkasan hasil yang akan dibuat (mis. "≈ 150 frame, 480×270"). */
  summary: ReactNode;
  outName: string;
}

/**
 * Kerangka alat video yang diproses di SERVER (Video to GIF, Kompres
 * Video): unggah + validasi, pratinjau, pengaturan, kartu akses/biaya, dan
 * tombol jalankan yang selalu melewati gerbang server. Tidak ada hasil
 * palsu: tanpa backend, gerbang menampilkan alert dan proses berhenti.
 */
export default function ServerVideoTool({
  tool,
  icon,
  accent,
  runLabel,
  renderOptions,
  buildJob,
  onSource,
}: {
  tool: MediaToolId;
  icon: LucideIcon;
  accent: Accent;
  runLabel: string;
  renderOptions: (v: VideoSource, disabled: boolean) => ReactNode;
  buildJob: (v: VideoSource) => ServerJobSpec;
  /** Dipanggil sekali setiap video baru selesai dimuat (mis. set rentang bawaan). */
  onSource?: (v: VideoSource) => void;
}) {
  const { t } = useTranslation();
  const feature = TOOL_BY_ID[tool].serverFeature!;
  const pricing = useBilling((s) => s.pricing[feature]);
  const rules: FileRules = { kinds: VIDEO_KINDS, maxBytes: pricing.limits.maxBytes, maxFiles: 1 };
  const src = useVideoSource();
  const intake = useFileIntake(rules, src.load);
  const [running, setRunning] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ tone: "warn" | "error"; text: string } | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const ctrl = useRef<AbortController | null>(null);
  const resultRef = useRef(result);
  resultRef.current = result;

  useEffect(
    () => () => {
      ctrl.current?.abort();
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    },
    [],
  );

  const onSourceRef = useRef(onSource);
  onSourceRef.current = onSource;
  useEffect(() => {
    if (src.video) onSourceRef.current?.(src.video);
  }, [src.video]);

  const job = src.video ? buildJob(src.video) : null;
  const limitError = job ? validateServerInput(pricing, job.usage) : null;
  const blocking = job?.error ?? limitError;

  const run = async () => {
    if (!src.video || !job || blocking) return;
    setMsg(null);
    const ok = await confirmServerRun(tool, [job.usage]);
    if (!ok) return;
    const c = new AbortController();
    ctrl.current = c;
    setRunning(0);
    try {
      const res = await runServerJob({ feature, file: src.video.file, params: job.params, signal: c.signal, onProgress: setRunning });
      if (result) URL.revokeObjectURL(result.url);
      setResult({ blob: res.blob, url: URL.createObjectURL(res.blob), name: job.outName });
    } catch (e) {
      if ((e as Error)?.name === "AbortError") setMsg({ tone: "warn", text: t("media.server.cancelled") });
      else if (e instanceof StopQueueError) setMsg({ tone: "warn", text: e.message });
      else setMsg({ tone: "error", text: e instanceof Error ? e.message : t("errors.server.failed") });
    } finally {
      ctrl.current = null;
      setRunning(null);
    }
  };

  const reset = () => {
    ctrl.current?.abort();
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setMsg(null);
    src.clear();
  };

  return (
    <MediaShell tool={tool} icon={icon} accent={accent}>
      {intake.rejectionText && (
        <Notice tone="warn" onDismiss={intake.clearRejected} testId="rejections">
          {intake.rejectionText}
        </Notice>
      )}
      {src.error && (
        <Notice tone="error" onDismiss={src.clearError} testId="video-error">
          {src.error}
        </Notice>
      )}
      {src.notice && (
        <Notice tone="info" onDismiss={src.clearNotice}>
          {src.notice}
        </Notice>
      )}
      {msg && (
        <Notice tone={msg.tone} onDismiss={() => setMsg(null)} testId="run-message">
          {msg.text}
        </Notice>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="flex min-w-0 flex-col gap-4">
          {!src.video ? (
            <Dropzone rules={rules} accept="video/*,.mkv,.mov" multiple={false} onFiles={intake.handleFiles} busy={intake.checking || src.loading} title={t("media.server.dropVideo")} />
          ) : (
            <Panel
              title={
                <span className="flex min-w-0 items-center gap-2">
                  <Film className="h-4 w-4 shrink-0" />
                  <span className="truncate">{src.video.file.name}</span>
                </span>
              }
              description={`${formatSize(src.video.file.size)} · ${src.video.meta.width}×${src.video.meta.height} · ${formatTime(src.video.meta.duration)}`}
              actions={
                <button type="button" onClick={reset} className={btn.ghost} disabled={running !== null}>
                  <X className="h-3.5 w-3.5" /> {t("media.server.changeVideo")}
                </button>
              }
              bodyClassName="p-3"
            >
              <video src={src.video.url} controls muted playsInline className="max-h-[55vh] w-full rounded-xl bg-black" data-testid="player" />
            </Panel>
          )}

          {result && (
            <Panel title={t("media.server.result")} description={`${result.name} · ${formatSize(result.blob.size)}`}>
              <button type="button" className={btn.success} onClick={() => downloadBlob(result.blob, result.name)}>
                <Download className="h-4 w-4" /> {t("common.download")}
              </button>
            </Panel>
          )}

          {!src.video && (
            <Panel bodyClassName="p-5">
              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{t("media.server.processedOnServer")}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{TOOL_BY_ID[tool].rationale}</p>
            </Panel>
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start" aria-label={t("media.common.settings")}>
          {src.video && (
            <Panel title={t("media.common.settings")}>
              <div className="flex flex-col gap-4">
                {renderOptions(src.video, running !== null)}
                {job && (
                  <div
                    className={`rounded-xl px-3 py-2 text-xs ${blocking ? "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200" : "bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-300"}`}
                    data-testid="job-summary"
                  >
                    {blocking ?? job.summary}
                  </div>
                )}
              </div>
            </Panel>
          )}
          <FeatureAccessCard tool={tool} inputs={job ? [job.usage] : undefined} />
          {running !== null ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <ProgressBar value={running || null} label={t("media.server.progress")} />
              <button type="button" onClick={() => ctrl.current?.abort()} className={btn.danger}>
                <Square className="h-3.5 w-3.5" /> {t("common.cancel")}
              </button>
            </div>
          ) : (
            <button type="button" onClick={run} disabled={!src.video || !!blocking} className={`${btn.primary} w-full py-3`} data-testid="server-run">
              {src.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} {runLabel}
            </button>
          )}
        </aside>
      </div>
    </MediaShell>
  );
}
