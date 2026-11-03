import { useMemo, useState } from "react";
import { Maximize2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import QueuePanel from "../../components/QueuePanel";
import ModePicker from "../../components/ModePicker";
import CompareSlider from "../../components/CompareSlider";
import { Notice, Panel, Segmented, Slider } from "../../components/ui";
import { useFileQueue, type ProcessContext, type QueueItem } from "../../hooks/useFileQueue";
import { useProcessingMode } from "../../hooks/useModeRunner";
import { baseName } from "../../lib/format";
import type { FileRules } from "../../lib/validate";
import { upscaleTarget } from "../../lib/sharpen";
import { context2d, createCanvas, decodeImage, encodeCanvas, releaseCanvas, throwIfAborted } from "../../converters/image";
import { runImageWorker } from "../../workers/runWorker";
import { runServerJob } from "../../processing/serverClient";

const RULES: FileRules = { kinds: ["png", "jpeg", "webp", "bmp", "gif", "avif"], maxBytes: 20 * 1024 * 1024, maxFiles: 20 };

type Scale = "2" | "3" | "4";
type OutFmt = "png" | "webp" | "jpeg";
const OUT: Record<OutFmt, { mime: string; ext: string; label: string }> = {
  png: { mime: "image/png", ext: "png", label: "PNG" },
  webp: { mime: "image/webp", ext: "webp", label: "WebP" },
  jpeg: { mime: "image/jpeg", ext: "jpg", label: "JPEG" },
};

export default function ImageUpscaler() {
  const { t } = useTranslation();
  const pm = useProcessingMode("image-upscaler");
  const [scale, setScale] = useState<Scale>("2");
  const [sharpen, setSharpen] = useState(0.6);
  const [radius, setRadius] = useState(1.2);
  const [fmt, setFmt] = useState<OutFmt>("png");
  const [selected, setSelected] = useState<string | null>(null);

  const settingsKey = useMemo(() => JSON.stringify([pm.mode, scale, sharpen, radius, fmt]), [pm.mode, scale, sharpen, radius, fmt]);

  const browserUpscale = async (item: QueueItem, ctx: ProcessContext) => {
    const img = await decodeImage(item.file, ctx.signal);
    const tgt = upscaleTarget(img.width, img.height, Number(scale));
    if (tgt.tooLarge) {
      img.close();
      throw new Error(t("media.imageUpscaler.tooLarge", { w: img.width, h: img.height }));
    }
    const canvas = createCanvas(tgt.width, tgt.height);
    try {
      const c2d = context2d(canvas, { willReadFrequently: sharpen > 0 });
      c2d.imageSmoothingEnabled = true;
      c2d.imageSmoothingQuality = "high";
      if (fmt === "jpeg") {
        c2d.fillStyle = "#ffffff";
        c2d.fillRect(0, 0, tgt.width, tgt.height);
      }
      c2d.drawImage(img.source, 0, 0, tgt.width, tgt.height);
      ctx.onProgress(35);
      if (sharpen > 0) {
        const id = c2d.getImageData(0, 0, tgt.width, tgt.height);
        const res = await runImageWorker({ op: "sharpen", width: tgt.width, height: tgt.height, data: id.data, options: { amount: sharpen, radius, threshold: 2 } }, ctx.signal);
        c2d.putImageData(new ImageData(res.data! as Uint8ClampedArray<ArrayBuffer>, tgt.width, tgt.height), 0, 0);
      }
      throwIfAborted(ctx.signal);
      ctx.onProgress(85);
      const blob = await encodeCanvas(canvas, OUT[fmt].mime, fmt === "png" ? undefined : 0.92);
      return {
        blob,
        fileName: `${baseName(item.file.name)}-${tgt.scale.toFixed(tgt.clamped ? 2 : 0)}x.${OUT[fmt].ext}`,
        label: `${tgt.width}×${tgt.height}`,
        meta: { clamped: tgt.clamped, from: `${img.width}×${img.height}`, scale: tgt.scale },
      };
    } finally {
      img.close();
      releaseCanvas(canvas);
    }
  };

  const queue = useFileQueue({
    settingsKey,
    onStop: pm.onStop,
    process: async (item, ctx) => {
      if (pm.mode === "server") {
        const r = await runServerJob({ feature: "image-upscaler", file: item.file, params: { scale: Number(scale), format: fmt }, signal: ctx.signal, onProgress: ctx.onProgress });
        return { blob: r.blob, fileName: `${baseName(item.file.name)}-ai-${scale}x.${OUT[fmt].ext}`, label: `AI ${scale}×` };
      }
      return browserUpscale(item, ctx);
    },
  });
  const intake = useFileIntake(RULES, queue.add);
  const focus = queue.items.find((i) => i.id === selected && i.result) ?? queue.doneItems[0];

  return (
    <MediaShell tool="image-upscaler" icon={Maximize2} accent="indigo">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="flex min-w-0 flex-col gap-4">
          <Dropzone rules={RULES} accept="image/*" onFiles={intake.handleFiles} busy={intake.checking} compact={queue.items.length > 0} allowPaste />
          {intake.rejectionText && (
            <Notice tone="warn" onDismiss={intake.clearRejected} testId="rejections">
              {intake.rejectionText}
            </Notice>
          )}
          {pm.stopMessage && (
            <Notice tone="warn" onDismiss={pm.clearStop}>
              {pm.stopMessage}
            </Notice>
          )}
          {focus?.result && focus.previewUrl && (
            <Panel
              title={t("media.imageUpscaler.comparison")}
              description={t("media.imageUpscaler.comparisonDescription", { from: String(focus.result.meta?.from ?? ""), to: focus.result.label ?? "" })}
              bodyClassName="p-3"
            >
              <CompareSlider before={focus.previewUrl} after={focus.result.url} beforeLabel={t("media.imageUpscaler.beforeLabel")} afterLabel={t("media.common.result")} pixelated />
              {Boolean(focus.result.meta?.clamped) && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                  {t("media.imageUpscaler.clamped", { scale: Number(focus.result.meta?.scale).toFixed(2) })}
                </p>
              )}
            </Panel>
          )}
          <QueuePanel
            queue={queue}
            title={t("media.common.images")}
            runLabel={t("media.imageUpscaler.runAll")}
            actionLabel={t("media.imageUpscaler.run")}
            zipName={`upscale-${scale}x-${new Date().toISOString().slice(0, 10)}.zip`}
            onRunAll={() => pm.gate(queue, undefined, (f) => ({ bytes: f.size, scale: Number(scale) }))}
            onRunOne={(id) => pm.gate(queue, [id], (f) => ({ bytes: f.size, scale: Number(scale) }))}
            rowExtra={(it) =>
              it.result ? (
                <button type="button" onClick={() => setSelected(it.id)} className="mt-1 text-[11px] font-semibold text-brand-700 hover:underline dark:text-brand-300">
                  {t("media.common.viewComparison")}
                </button>
              ) : null
            }
          />
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start" aria-label={t("media.common.settings")}>
          <Panel title={t("media.modePicker.label")}>
            <ModePicker tool="image-upscaler" value={pm.mode} onChange={pm.setMode} disabled={queue.running} inputs={queue.items.map((i) => ({ bytes: i.file.size, scale: Number(scale) }))} />
          </Panel>
          <Panel title={t("media.common.settings")}>
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("media.imageUpscaler.run")}</p>
                <Segmented label={t("media.imageUpscaler.scale")} value={scale} onChange={setScale} options={[{ value: "2", label: "2×" }, { value: "3", label: "3×" }, { value: "4", label: "4×" }]} />
              </div>
              {pm.mode === "browser" && (
                <>
                  <Slider label={t("media.imageUpscaler.sharpen")} value={sharpen} min={0} max={2} step={0.1} onChange={setSharpen} format={(v) => (v === 0 ? t("media.common.off") : v.toFixed(1))} hint={t("media.imageUpscaler.sharpenHint")} />
                  <Slider label={t("media.imageUpscaler.radius")} value={radius} min={0.5} max={3} step={0.1} onChange={setRadius} disabled={sharpen === 0} format={(v) => `${v.toFixed(1)} px`} />
                </>
              )}
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("media.common.outputFormat")}</p>
                <Segmented label={t("media.common.outputFormat")} value={fmt} onChange={setFmt} options={(Object.keys(OUT) as OutFmt[]).map((k) => ({ value: k, label: OUT[k].label }))} />
              </div>
            </div>
          </Panel>
          <p className="px-1 text-[11px] leading-relaxed text-gray-400">
            {t("media.imageUpscaler.note")}
          </p>
        </aside>
      </div>
    </MediaShell>
  );
}
