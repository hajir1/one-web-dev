import { useEffect, useRef, useState } from "react";
import { AudioLines, Download, Film, Loader2, Play, Square, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import ModePicker from "../../components/ModePicker";
import { confirmServerRun } from "../../components/ServerGate";
import { Notice, Panel, ProgressBar, Segmented, Slider, btn } from "../../components/ui";
import { useVideoSource } from "../../hooks/useVideoSource";
import { VIDEO_KINDS } from "../../lib/fileSniff";
import { baseName, formatSize, formatTime } from "../../lib/format";
import { downloadBlob } from "../../lib/download";
import { BROWSER_AUDIO_MAX_SECONDS, extractWav } from "../../lib/audio";
import { wavBytes } from "../../lib/wav";
import type { FileRules } from "../../lib/validate";
import type { ProcessingMode } from "../../processing/policy";
import { useBilling } from "../../processing/billing";
import { validateServerInput } from "../../processing/pricing";
import { runServerJob, StopQueueError } from "../../processing/serverClient";

const BROWSER_MAX_BYTES = 200 * 1024 * 1024;
type ServerFormat = "mp3" | "aac" | "opus" | "copy";
const EXT: Record<ServerFormat, string> = { mp3: "mp3", aac: "m4a", opus: "opus", copy: "mka" };

export default function AudioExtract() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ProcessingMode>("browser");
  const pricing = useBilling((s) => s.pricing["audio-extract"]);
  const rules: FileRules = { kinds: VIDEO_KINDS, maxBytes: mode === "browser" ? BROWSER_MAX_BYTES : pricing.limits.maxBytes, maxFiles: 1 };
  const src = useVideoSource({ requireVideoTrack: false });
  const intake = useFileIntake(rules, src.load);

  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [mono, setMono] = useState(false);
  const [rate, setRate] = useState("source");
  const [format, setFormat] = useState<ServerFormat>("mp3");
  const [bitrate, setBitrate] = useState("192");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "warn" | "error"; text: string } | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string; info: string } | null>(null);
  const ctrl = useRef<AbortController | null>(null);
  const resultRef = useRef(result);
  resultRef.current = result;

  useEffect(() => {
    if (src.video) setRange([0, src.video.meta.duration]);
  }, [src.video]);
  useEffect(
    () => () => {
      ctrl.current?.abort();
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    },
    [],
  );

  const v = src.video;
  const span = Math.max(0, range[1] - range[0]);
  const usage = v ? { bytes: v.file.size, seconds: span } : undefined;
  const browserError = v
    ? v.file.size > BROWSER_MAX_BYTES
      ? t("media.audioExtract.fileTooLarge", { size: formatSize(v.file.size), max: formatSize(BROWSER_MAX_BYTES) })
      : span > BROWSER_AUDIO_MAX_SECONDS
        ? t("media.audioExtract.rangeTooLong", { span: formatTime(span), max: BROWSER_AUDIO_MAX_SECONDS / 60 })
        : span <= 0
          ? t("media.audioExtract.emptyRange")
          : null
    : null;
  const serverError = v && usage ? validateServerInput(pricing, usage) ?? (span <= 0 ? t("media.audioExtract.emptyRange") : null) : null;
  const blocking = mode === "browser" ? browserError : serverError;
  const estRate = rate === "source" ? 48000 : Number(rate);
  const estimate =
    mode === "browser"
      ? t(rate === "source" ? "media.audioExtract.estimateSource" : "media.audioExtract.estimate", { size: formatSize(wavBytes(span, estRate, mono ? 1 : 2)) })
      : null;

  const setResultBlob = (blob: Blob, name: string, info: string) => {
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    setResult({ blob, url: URL.createObjectURL(blob), name, info });
  };

  const run = async () => {
    if (!v || blocking) return;
    setMsg(null);
    if (mode === "server") {
      const ok = await confirmServerRun("audio-extract", [usage!], () => setMode("browser"));
      if (!ok) return;
    }
    const c = new AbortController();
    ctrl.current = c;
    setBusy(true);
    try {
      if (mode === "browser") {
        const r = await extractWav(v.file, { start: range[0], end: range[1], mono, sampleRate: rate === "source" ? null : Number(rate) }, c.signal);
        setResultBlob(r.blob, `${baseName(v.file.name)}.wav`, `WAV · ${r.channels === 1 ? "mono" : t("media.audioExtract.channelsN", { count: r.channels })} · ${r.sampleRate / 1000} kHz · ${formatTime(r.seconds)}`);
      } else {
        const res = await runServerJob({ feature: "audio-extract", file: v.file, params: { start: range[0], end: range[1], format, bitrate: Number(bitrate), mono }, signal: c.signal });
        setResultBlob(res.blob, `${baseName(v.file.name)}.${EXT[format]}`, format.toUpperCase());
      }
    } catch (e) {
      if ((e as Error)?.name === "AbortError") setMsg({ tone: "warn", text: t("media.audioExtract.cancelled") });
      else if (e instanceof StopQueueError) setMsg({ tone: "warn", text: e.message });
      else setMsg({ tone: "error", text: e instanceof Error ? e.message : t("media.audioExtract.failed") });
    } finally {
      ctrl.current = null;
      setBusy(false);
    }
  };

  const reset = () => {
    ctrl.current?.abort();
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setMsg(null);
    src.clear();
  };

  const label = (text: string) => <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{text}</p>;

  return (
    <MediaShell tool="audio-extract" icon={AudioLines} accent="violet">
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
      {msg && (
        <Notice tone={msg.tone} onDismiss={() => setMsg(null)} testId="run-message">
          {msg.text}
        </Notice>
      )}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="flex min-w-0 flex-col gap-4">
          {!v ? (
            <Dropzone rules={rules} accept="video/*,.mkv,.mov" multiple={false} onFiles={intake.handleFiles} busy={intake.checking || src.loading} title={t("media.server.dropVideo")} />
          ) : (
            <Panel
              title={
                <span className="flex min-w-0 items-center gap-2">
                  <Film className="h-4 w-4 shrink-0" />
                  <span className="truncate">{v.file.name}</span>
                </span>
              }
              description={`${formatSize(v.file.size)} · ${formatTime(v.meta.duration)}`}
              actions={
                <button type="button" onClick={reset} className={btn.ghost} disabled={busy}>
                  <X className="h-3.5 w-3.5" /> {t("media.server.changeVideo")}
                </button>
              }
              bodyClassName="p-3"
            >
              <video src={v.url} controls playsInline className="max-h-[45vh] w-full rounded-xl bg-black" data-testid="player" />
            </Panel>
          )}
          {result && (
            <Panel title={t("media.audioExtract.result")} description={`${result.name} · ${formatSize(result.blob.size)} · ${result.info}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <audio src={result.url} controls className="w-full" data-testid="audio-result" />
                <button type="button" className={`${btn.success} shrink-0`} onClick={() => downloadBlob(result.blob, result.name)} data-testid="audio-download">
                  <Download className="h-4 w-4" /> {t("common.download")}
                </button>
              </div>
            </Panel>
          )}
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start" aria-label={t("media.common.settings")}>
          <Panel title={t("media.modePicker.label")}>
            <ModePicker tool="audio-extract" value={mode} onChange={setMode} disabled={busy} inputs={usage ? [usage] : undefined} />
          </Panel>
          {v && (
            <Panel title={t("media.common.settings")}>
              <div className="flex flex-col gap-4">
                <Slider label={t("media.common.start")} value={range[0]} min={0} max={v.meta.duration} step={0.1} format={formatTime} disabled={busy} onChange={(x) => setRange([Math.min(x, range[1]), range[1]])} />
                <Slider label={t("media.common.end")} value={range[1]} min={0} max={v.meta.duration} step={0.1} format={formatTime} disabled={busy} onChange={(x) => setRange([range[0], Math.max(x, range[0])])} />
                <div>
                  {label(t("media.audioExtract.channels"))}
                  <Segmented label={t("media.audioExtract.channels")} value={mono ? "mono" : "asli"} disabled={busy} onChange={(x) => setMono(x === "mono")} options={[{ value: "asli", label: t("media.common.original") }, { value: "mono", label: "Mono" }]} />
                </div>
                {mode === "browser" ? (
                  <div>
                    {label(t("media.audioExtract.sampleRate"))}
                    <Segmented
                      label={t("media.audioExtract.sampleRate")}
                      value={rate}
                      disabled={busy}
                      onChange={setRate}
                      options={[
                        { value: "source", label: t("media.common.original") },
                        { value: "48000", label: "48k" },
                        { value: "44100", label: "44.1k" },
                        { value: "22050", label: "22k" },
                        { value: "16000", label: "16k" },
                      ]}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      {label(t("media.common.format"))}
                      <Segmented
                        label={t("media.common.format")}
                        value={format}
                        disabled={busy}
                        onChange={setFormat}
                        options={[
                          { value: "mp3", label: "MP3" },
                          { value: "aac", label: "AAC" },
                          { value: "opus", label: "Opus" },
                          { value: "copy", label: t("media.audioExtract.copy"), title: t("media.audioExtract.copyHint") },
                        ]}
                      />
                    </div>
                    {format !== "copy" && (
                      <div>
                        {label(t("media.audioExtract.bitrateKbps"))}
                        <Segmented label="Bitrate" value={bitrate} disabled={busy} onChange={setBitrate} options={["96", "128", "192", "320"].map((b) => ({ value: b, label: b }))} />
                      </div>
                    )}
                  </>
                )}
                <div className={`rounded-xl px-3 py-2 text-xs ${blocking ? "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200" : "bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-300"}`} data-testid="job-summary">
                  {blocking ?? (mode === "browser" ? `${formatTime(span)} audio → ${estimate}.` : `${formatTime(span)} audio → ${format === "copy" ? t("media.audioExtract.originalTrack") : `${format.toUpperCase()} ${bitrate} kbps`}.`)}
                </div>
              </div>
            </Panel>
          )}
          {busy ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <ProgressBar value={null} label={t("media.audioExtract.extracting")} />
              <button type="button" onClick={() => ctrl.current?.abort()} className={btn.danger}>
                <Square className="h-3.5 w-3.5" /> {t("common.cancel")}
              </button>
            </div>
          ) : (
            <button type="button" onClick={run} disabled={!v || !!blocking} className={`${btn.primary} w-full py-3`} data-testid="audio-run">
              {src.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {mode === "browser" ? t("media.audioExtract.runBrowser") : t("media.audioExtract.runServer")}
            </button>
          )}
        </aside>
      </div>
    </MediaShell>
  );
}
