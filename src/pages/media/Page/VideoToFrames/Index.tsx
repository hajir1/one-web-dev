import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Clapperboard, Download, Film, Loader2, Play, Square, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import ModePicker from "../../components/ModePicker";
import { Chip, Notice, NumberField, Panel, ProgressBar, Segmented, Slider, btn } from "../../components/ui";
import { confirmServerRun } from "../../components/ServerGate";
import { VIDEO_KINDS } from "../../lib/fileSniff";
import type { AcceptedFile, FileRules } from "../../lib/validate";
import { baseName, formatSize, formatTime, makeId } from "../../lib/format";
import { downloadAsZip, downloadBlob } from "../../lib/download";
import { loadVideoMeta, seekTo, type VideoMeta } from "../../lib/video";
import { MAX_FRAMES, frameFileName, planFrames, type FramePlanMode } from "../../lib/videoPlan";
import { context2d, createCanvas, encodeCanvas, releaseCanvas } from "../../converters/image";
import type { ProcessingMode } from "../../processing/policy";
import { runServerJob, StopQueueError } from "../../processing/serverClient";

const RULES: FileRules = { kinds: VIDEO_KINDS, maxBytes: 300 * 1024 * 1024, maxFiles: 1 };

type ImgFormat = "webp" | "jpeg" | "png";
const FORMATS: Record<ImgFormat, { mime: string; ext: string; label: string }> = {
  webp: { mime: "image/webp", ext: "webp", label: "WebP" },
  jpeg: { mime: "image/jpeg", ext: "jpg", label: "JPEG" },
  png: { mime: "image/png", ext: "png", label: "PNG" },
};

interface Frame {
  id: string;
  index: number;
  time: number;
  blob: Blob;
  url: string;
  manual?: boolean;
}

interface LoadedVideo {
  file: File;
  url: string;
  meta: VideoMeta;
}

export default function VideoToFrames() {
  const { t } = useTranslation();
  const [video, setVideo] = useState<LoadedVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<ProcessingMode>("browser");

  const [planKind, setPlanKind] = useState<FramePlanMode["kind"]>("fps");
  const [fps, setFps] = useState(1);
  const [interval, setIntervalSec] = useState(5);
  const [count, setCount] = useState(12);
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [format, setFormat] = useState<ImgFormat>("webp");
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState<"1" | "0.5" | "0.25">("1");

  const [frames, setFrames] = useState<Frame[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [zipPct, setZipPct] = useState<number | null>(null);

  const playerRef = useRef<HTMLVideoElement>(null);
  const workerVideoRef = useRef<HTMLVideoElement>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const framesRef = useRef<Frame[]>([]);
  const videoRef = useRef<LoadedVideo | null>(null);
  framesRef.current = frames;
  videoRef.current = video;

  const extracting = progress !== null;

  const revokeFrames = (list: Frame[]) => list.forEach((f) => URL.revokeObjectURL(f.url));

  // Leaving the page: stop extraction, revoke every URL.
  useEffect(
    () => () => {
      ctrlRef.current?.abort();
      revokeFrames(framesRef.current);
      if (videoRef.current) URL.revokeObjectURL(videoRef.current.url);
    },
    [],
  );

  const clearVideo = useCallback(() => {
    ctrlRef.current?.abort();
    revokeFrames(framesRef.current);
    setFrames([]);
    setProgress(null);
    if (videoRef.current) URL.revokeObjectURL(videoRef.current.url);
    setVideo(null);
    setError(null);
    setNotice(null);
  }, []);

  const load = useCallback(
    async ([f]: AcceptedFile[]) => {
      clearVideo();
      setLoading(true);
      const url = URL.createObjectURL(f.file);
      try {
        const meta = await loadVideoMeta(workerVideoRef.current!, url);
        setVideo({ file: f.file, url, meta });
        setRange([0, meta.duration]);
        if (meta.durationFixed) setNotice(t("media.video.durationFixed"));
      } catch (e) {
        URL.revokeObjectURL(url);
        if (workerVideoRef.current) workerVideoRef.current.removeAttribute("src");
        setError(e instanceof Error ? e.message : t("media.video.loadFailed"));
      } finally {
        setLoading(false);
      }
    },
    [clearVideo, t],
  );
  const intake = useFileIntake(RULES, load);

  const planMode: FramePlanMode = planKind === "fps" ? { kind: "fps", fps } : planKind === "interval" ? { kind: "interval", seconds: interval } : { kind: "count", count };
  const plan = video ? planFrames({ duration: video.meta.duration, mode: planMode, start: range[0], end: range[1] }) : null;
  const outW = video ? Math.max(1, Math.round(video.meta.width * Number(scale))) : 0;
  const outH = video ? Math.max(1, Math.round(video.meta.height * Number(scale))) : 0;

  const capture = async (v: HTMLVideoElement, canvas: HTMLCanvasElement, time: number, signal?: AbortSignal) => {
    await seekTo(v, time, signal);
    const ctx = context2d(canvas);
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const fm = FORMATS[format];
    return encodeCanvas(canvas, fm.mime, format === "png" ? undefined : quality / 100);
  };

  const extractBrowser = async () => {
    if (!video || !plan || plan.error || !plan.times.length) return;
    const v = workerVideoRef.current!;
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    revokeFrames(framesRef.current.filter((f) => !f.manual));
    setFrames((prev) => prev.filter((f) => f.manual));
    setError(null);
    setProgress({ done: 0, total: plan.times.length });
    const canvas = createCanvas(outW, outH);
    let done = 0;
    try {
      for (const [i, time] of plan.times.entries()) {
        if (ctrl.signal.aborted) break;
        const blob = await capture(v, canvas, time, ctrl.signal);
        if (ctrl.signal.aborted) break;
        const fr: Frame = { id: makeId(), index: i + 1, time, blob, url: URL.createObjectURL(blob) };
        setFrames((prev) => [...prev, fr]); // shown progressively
        done = i + 1;
        setProgress({ done, total: plan.times.length });
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setError(t("media.videoToFrames.extractFailed", { message: e instanceof Error ? e.message : t("media.videoToFrames.extractFailedGeneric"), count: done }));
    } finally {
      if (ctrl.signal.aborted && done < plan.times.length && videoRef.current) setNotice(t("media.videoToFrames.stopped", { done, total: plan.times.length }));
      releaseCanvas(canvas);
      ctrlRef.current = null;
      setProgress(null);
    }
  };

  const extractServer = async () => {
    if (!video) return;
    const ok = await confirmServerRun("video-to-frames", [{ bytes: video.file.size, seconds: range[1] - range[0] }], () => setMode("browser"));
    if (!ok) return;
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    setProgress({ done: 0, total: 100 });
    try {
      const res = await runServerJob({
        feature: "video-to-frames",
        file: video.file,
        params: { plan: planMode, start: range[0], end: range[1], format, quality, scale: Number(scale) },
        signal: ctrl.signal,
        onProgress: (p) => setProgress({ done: p, total: 100 }),
      });
      downloadBlob(res.blob, `${baseName(video.file.name)}-frames.zip`);
    } catch (e) {
      if (e instanceof StopQueueError) setNotice(e.message);
      else if ((e as Error)?.name !== "AbortError") setError(e instanceof Error ? e.message : t("errors.server.failed"));
    } finally {
      ctrlRef.current = null;
      setProgress(null);
    }
  };

  const grabCurrent = async () => {
    const p = playerRef.current;
    if (!p || !video || extracting) return;
    p.pause();
    const time = Math.min(p.currentTime, Math.max(0, video.meta.duration - 0.001));
    const canvas = createCanvas(outW, outH);
    try {
      const blob = await capture(workerVideoRef.current!, canvas, time);
      const fr: Frame = { id: makeId(), index: framesRef.current.length + 1, time, blob, url: URL.createObjectURL(blob), manual: true };
      setFrames((prev) => [...prev, fr].sort((a, b) => a.time - b.time));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("media.videoToFrames.grabFailed"));
    } finally {
      releaseCanvas(canvas);
    }
  };

  const removeFrame = (id: string) =>
    setFrames((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) URL.revokeObjectURL(f.url);
      return prev.filter((x) => x.id !== id);
    });

  const base = baseName(video?.file.name ?? "video");
  const nameOf = (f: Frame) => frameFileName(base, f.index, f.time, FORMATS[format].ext).replace(/\.[^.]+$/, `.${f.blob.type.split("/")[1]?.replace("jpeg", "jpg") ?? FORMATS[format].ext}`);

  const downloadAll = async () => {
    if (frames.length === 1) return downloadBlob(frames[0].blob, nameOf(frames[0]));
    setZipPct(0);
    try {
      await downloadAsZip(frames.map((f) => ({ name: nameOf(f), blob: f.blob })), `${base}-frames.zip`, setZipPct);
    } catch (e) {
      setError(e instanceof Error ? t("media.queue.zipFailedWith", { message: e.message }) : t("media.queue.zipFailed"));
    } finally {
      setZipPct(null);
    }
  };

  const totalBytes = frames.reduce((n, f) => n + f.blob.size, 0);

  return (
    <MediaShell tool="video-to-frames" icon={Clapperboard} accent="amber">
      {/* Worker video: hidden but kept in the DOM (Safari does not decode display:none videos). */}
      <video ref={workerVideoRef} muted playsInline aria-hidden className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px opacity-0" />

      {intake.rejectionText && (
        <Notice tone="warn" onDismiss={intake.clearRejected} testId="rejections">
          {intake.rejectionText}
        </Notice>
      )}
      {error && (
        <Notice tone="error" onDismiss={() => setError(null)} testId="video-error">
          {error}
        </Notice>
      )}
      {notice && (
        <Notice tone="info" onDismiss={() => setNotice(null)}>
          {notice}
        </Notice>
      )}

      {!video ? (
        <Dropzone rules={RULES} accept="video/*,.mkv,.mov" multiple={false} onFiles={intake.handleFiles} busy={intake.checking || loading} title={t("media.server.dropVideo")} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <div className="flex min-w-0 flex-col gap-4">
            <Panel
              title={
                <span className="flex min-w-0 items-center gap-2">
                  <Film className="h-4 w-4 shrink-0" />
                  <span className="truncate">{video.file.name}</span>
                </span>
              }
              description={`${formatSize(video.file.size)} · ${video.meta.width}×${video.meta.height} · ${formatTime(video.meta.duration)}`}
              actions={
                <button type="button" onClick={clearVideo} className={btn.ghost} disabled={extracting}>
                  <X className="h-3.5 w-3.5" /> {t("media.server.changeVideo")}
                </button>
              }
              bodyClassName="p-3"
            >
              <video ref={playerRef} src={video.url} controls muted playsInline className="max-h-[55vh] w-full rounded-xl bg-black" data-testid="player" />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={grabCurrent} disabled={extracting} className={btn.secondary} data-testid="grab-frame">
                  <Camera className="h-4 w-4" /> {t("media.videoToFrames.grab")}
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">{t("media.videoToFrames.grabHint")}</span>
              </div>
            </Panel>

            <Panel
              title={t("media.videoToFrames.framesTitle", { count: frames.length })}
              description={frames.length ? t("media.videoToFrames.total", { size: formatSize(totalBytes) }) : t("media.videoToFrames.framesHint")}
              actions={
                frames.length > 0 && (
                  <>
                    <button type="button" onClick={downloadAll} disabled={extracting || zipPct !== null} className={btn.primary} data-testid="frames-download">
                      {zipPct !== null ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      {zipPct !== null ? `ZIP ${zipPct}%` : frames.length > 1 ? t("media.queue.downloadZip", { count: frames.length }) : t("common.download")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        revokeFrames(frames);
                        setFrames([]);
                      }}
                      disabled={extracting}
                      className={btn.ghost}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> {t("media.videoToFrames.clearResults")}
                    </button>
                  </>
                )
              }
            >
              {frames.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">{t("media.videoToFrames.empty")}</p>
              ) : (
                <ul className="grid max-h-[75vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-4" data-testid="frames">
                  {frames.map((f) => (
                    <li key={f.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/40">
                      <img src={f.url} alt={t("media.videoToFrames.frameAt", { time: formatTime(f.time) })} loading="lazy" className="aspect-video w-full bg-gray-100 object-contain dark:bg-gray-800" />
                      <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-gray-700 dark:text-gray-200">
                            {formatTime(f.time)} {f.manual && <Chip tone="amber">{t("media.videoToFrames.manual")}</Chip>}
                          </p>
                          <p className="text-[11px] text-gray-400">{formatSize(f.blob.size)}</p>
                        </div>
                        <div className="flex shrink-0">
                          <button type="button" className={btn.icon} aria-label={t("media.videoToFrames.downloadFrame", { time: formatTime(f.time) })} onClick={() => downloadBlob(f.blob, nameOf(f))}>
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className={btn.icon} aria-label={t("media.videoToFrames.removeFrame", { time: formatTime(f.time) })} onClick={() => removeFrame(f.id)} disabled={extracting}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start" aria-label={t("media.videoToFrames.settingsLabel")}>
            <Panel title={t("media.modePicker.label")}>
              <ModePicker tool="video-to-frames" value={mode} onChange={setMode} disabled={extracting} inputs={[{ bytes: video.file.size, seconds: range[1] - range[0] }]} />
            </Panel>
            <Panel title={t("media.videoToFrames.planTitle")}>
              <div className="flex flex-col gap-4">
                <Segmented
                  label={t("media.videoToFrames.planKind")}
                  value={planKind}
                  onChange={setPlanKind}
                  disabled={extracting}
                  options={[
                    { value: "fps", label: t("media.videoToFrames.kinds.fps") },
                    { value: "interval", label: t("media.videoToFrames.kinds.interval") },
                    { value: "count", label: t("media.videoToFrames.kinds.count") },
                  ]}
                />
                {planKind === "fps" && <Slider label={t("media.common.fps")} value={fps} min={1} max={60} onChange={setFps} disabled={extracting} format={(v) => `${v} fps`} />}
                {planKind === "interval" && <NumberField label={t("media.videoToFrames.every")} suffix={t("media.videoToFrames.seconds")} min={1} max={3600} value={interval} onChange={setIntervalSec} disabled={extracting} />}
                {planKind === "count" && <NumberField label={t("media.videoToFrames.countLabel")} min={1} max={MAX_FRAMES} value={count} onChange={setCount} disabled={extracting} />}
                <Slider label={t("media.common.start")} value={range[0]} min={0} max={video.meta.duration} step={0.1} format={formatTime} disabled={extracting} onChange={(v) => setRange([Math.min(v, range[1]), range[1]])} />
                <Slider label={t("media.common.end")} value={range[1]} min={0} max={video.meta.duration} step={0.1} format={formatTime} disabled={extracting} onChange={(v) => setRange([range[0], Math.max(v, range[0])])} />
                {plan && (
                  <div className={`rounded-xl px-3 py-2 text-xs ${plan.truncated || plan.error ? "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300" : "bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-300"}`} data-testid="plan">
                    {plan.error ??
                      (plan.truncated
                        ? t("media.videoToFrames.truncated", { requested: plan.requested, max: MAX_FRAMES })
                        : t("media.videoToFrames.planSummary", { count: plan.times.length, w: outW, h: outH }))}
                  </div>
                )}
              </div>
            </Panel>
            <Panel title={t("media.videoToFrames.imageFormat")}>
              <div className="flex flex-col gap-4">
                <Segmented label={t("media.common.format")} value={format} onChange={setFormat} disabled={extracting} options={(Object.keys(FORMATS) as ImgFormat[]).map((k) => ({ value: k, label: FORMATS[k].label }))} />
                {format !== "png" && <Slider label={t("media.imageConverter.quality")} value={quality} min={1} max={100} onChange={setQuality} disabled={extracting} />}
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("media.imageUpscaler.scale")}</p>
                  <Segmented label={t("media.imageUpscaler.scale")} value={scale} onChange={setScale} disabled={extracting} options={[{ value: "1", label: "100%" }, { value: "0.5", label: "50%" }, { value: "0.25", label: "25%" }]} />
                </div>
              </div>
            </Panel>
            {extracting ? (
              <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <ProgressBar value={progress && progress.total ? (progress.done / progress.total) * 100 : null} label={t("media.videoToFrames.progress")} />
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500">{mode === "server" ? t("media.videoToFrames.serverProgress", { pct: progress?.done ?? 0 }) : t("media.videoToFrames.frameProgress", { done: progress?.done, total: progress?.total })}</p>
                  <button type="button" onClick={() => ctrlRef.current?.abort()} className={btn.danger} data-testid="extract-cancel">
                    <Square className="h-3.5 w-3.5" /> {t("media.videoToFrames.stop")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={mode === "server" ? extractServer : extractBrowser}
                disabled={!plan || !!plan.error || !plan.times.length}
                className={`${btn.primary} w-full py-3`}
                data-testid="extract"
              >
                <Play className="h-4 w-4" /> {t("media.videoToFrames.extract", { count: plan?.times.length ?? 0 })}
              </button>
            )}
          </aside>
        </div>
      )}
    </MediaShell>
  );
}
