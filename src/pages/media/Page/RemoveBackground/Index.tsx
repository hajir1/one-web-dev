import { useMemo, useState } from "react";
import { Eraser, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import QueuePanel from "../../components/QueuePanel";
import ModePicker from "../../components/ModePicker";
import CompareSlider from "../../components/CompareSlider";
import { ColorField, Notice, Panel, Segmented } from "../../components/ui";
import { useFileQueue, type ProcessContext, type QueueItem } from "../../hooks/useFileQueue";
import { useProcessingMode } from "../../hooks/useModeRunner";
import { baseName } from "../../lib/format";
import type { FileRules } from "../../lib/validate";
import { context2d, createCanvas, decodeImage, encodeCanvas, releaseCanvas } from "../../converters/image";
import { runServerJob } from "../../processing/serverClient";
import { removeBackgroundInWorker } from "../../workers/bgRemoval";

const RULES: FileRules = { kinds: ["png", "jpeg", "webp", "bmp", "avif"], maxBytes: 20 * 1024 * 1024, maxFiles: 50 };

/** BiRefNet_lite (MIT): fp16 ±115 MB (hemat), fp32 ±224 MB (paling presisi di CPU/wasm). */
type ModelId = "fp16" | "fp32";
type BgMode = "transparent" | "white" | "color";

const MODELS: ModelId[] = ["fp16", "fp32"];

function explain(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  if (/fetch|network|Failed to load|NetworkError|huggingface|Could not locate/i.test(msg))
    return new Error(i18n.t("media.removeBackground.errors.modelDownload"));
  if (/memory|allocation|OOM|RangeError/i.test(msg)) return new Error(i18n.t("media.removeBackground.errors.memory"));
  return err instanceof Error ? err : new Error(msg || i18n.t("media.removeBackground.errors.failed"));
}

/** Tempel hasil transparan di atas warna latar (opsional). */
async function flatten(png: Blob, color: string): Promise<Blob> {
  const img = await decodeImage(png);
  const c = createCanvas(img.width, img.height);
  try {
    const ctx = context2d(c);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(img.source, 0, 0);
    return await encodeCanvas(c, "image/jpeg", 0.92);
  } finally {
    img.close();
    releaseCanvas(c);
  }
}

export default function RemoveBackground() {
  const { t } = useTranslation();
  const models = MODELS.map((value) => ({ value, label: t(`media.removeBackground.models.${value}.label`), title: t(`media.removeBackground.models.${value}.title`) }));
  const pm = useProcessingMode("remove-background");
  const [model, setModel] = useState<ModelId>("fp16");
  const [bg, setBg] = useState<BgMode>("transparent");
  const [bgColor, setBgColor] = useState("#f3f4f6");
  const [selected, setSelected] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);

  const fill = bg === "white" ? "#ffffff" : bg === "color" ? bgColor : null;
  const settingsKey = useMemo(() => JSON.stringify([pm.mode, model, fill]), [pm.mode, model, fill]);

  const processBrowser = async (item: QueueItem, ctx: ProcessContext) => {
    let blob: Blob;
    try {
      blob = await removeBackgroundInWorker(item.file, model, { signal: ctx.signal, onProgress: ctx.onProgress });
    } catch (e) {
      if ((e as Error)?.name === "AbortError" || ctx.signal.aborted) throw new DOMException(t("media.errors.aborted"), "AbortError");
      throw explain(e);
    }
    setModelReady(true);
    return blob;
  };

  const queue = useFileQueue({
    settingsKey,
    onStop: pm.onStop,
    process: async (item, ctx) => {
      let blob: Blob;
      if (pm.mode === "server") {
        blob = (await runServerJob({ feature: "remove-background", file: item.file, params: { model: "server-hd" }, signal: ctx.signal, onProgress: ctx.onProgress })).blob;
      } else {
        blob = await processBrowser(item, ctx);
      }
      if (fill) {
        return { blob: await flatten(blob, fill), fileName: `${baseName(item.file.name)}-${t("media.removeBackground.fileSuffix")}.jpg`, label: t("media.removeBackground.labelJpeg") };
      }
      return { blob, fileName: `${baseName(item.file.name)}-${t("media.removeBackground.fileSuffix")}.png`, label: t("media.removeBackground.labelPng") };
    },
  });
  const intake = useFileIntake(RULES, queue.add);

  const focus = queue.items.find((i) => i.id === selected && i.result) ?? queue.doneItems[0];

  return (
    <MediaShell tool="remove-background" icon={Eraser} accent="emerald">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="flex min-w-0 flex-col gap-4">
          <Dropzone rules={RULES} accept="image/png,image/jpeg,image/webp,image/bmp,image/avif" onFiles={intake.handleFiles} busy={intake.checking} compact={queue.items.length > 0} allowPaste />
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
            <Panel title={t("media.common.resultPreview")} description={focus.file.name} bodyClassName="p-3">
              <CompareSlider before={focus.previewUrl} after={focus.result.url} beforeLabel={t("media.common.original")} afterLabel={t("media.removeBackground.afterLabel")} checker />
            </Panel>
          )}
          <QueuePanel
            queue={queue}
            title={t("media.common.images")}
            runLabel={t("media.removeBackground.runAll")}
            actionLabel={t("media.removeBackground.run")}
            zipName={`${t("media.removeBackground.fileSuffix")}-${new Date().toISOString().slice(0, 10)}.zip`}
            showResultThumb
            onRunAll={() => pm.gate(queue)}
            onRunOne={(id) => pm.gate(queue, [id])}
            rowExtra={(it) =>
              it.result ? (
                <button type="button" onClick={() => setSelected(it.id)} className="mt-1 text-[11px] font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                  {t("media.common.viewComparison")}
                </button>
              ) : null
            }
          />
          {!queue.items.length && (
            <Panel bodyClassName="grid gap-4 p-5 sm:grid-cols-3">
              {[
                ["1", t("media.removeBackground.steps.add.title"), t("media.removeBackground.steps.add.text")],
                ["2", t("media.removeBackground.steps.remove.title"), t("media.removeBackground.steps.remove.text")],
                ["3", t("media.removeBackground.steps.download.title"), t("media.removeBackground.steps.download.text")],
              ].map(([n, title, d]) => (
                <div key={n} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{n}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{d}</p>
                  </div>
                </div>
              ))}
            </Panel>
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start" aria-label={t("media.common.settings")}>
          <Panel title={t("media.modePicker.label")}>
            <ModePicker tool="remove-background" value={pm.mode} onChange={pm.setMode} disabled={queue.running} inputs={queue.items.map((i) => ({ bytes: i.file.size }))} />
          </Panel>
          <Panel title={t("media.common.result")}>
            <div className="flex flex-col gap-4">
              {pm.mode === "browser" && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("media.removeBackground.model")}</p>
                  <Segmented label={t("media.removeBackground.model")} value={model} options={models} onChange={setModel} disabled={queue.running} />
                  <p className="mt-1.5 flex items-start gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
                    {modelReady ? t("media.removeBackground.modelReady") : t("media.removeBackground.modelHint")}
                  </p>
                </div>
              )}
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("media.removeBackground.background")}</p>
                <Segmented
                  label={t("media.removeBackground.background")}
                  value={bg}
                  onChange={setBg}
                  options={[
                    { value: "transparent", label: t("media.removeBackground.bg.transparent") },
                    { value: "white", label: t("media.removeBackground.bg.white") },
                    { value: "color", label: t("media.removeBackground.bg.color") },
                  ]}
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{fill ? t("media.removeBackground.savedJpeg") : t("media.removeBackground.savedPng")}</p>
              </div>
              {bg === "color" && <ColorField label={t("media.removeBackground.bgColor")} value={bgColor} onChange={setBgColor} />}
            </div>
          </Panel>
          <p className="px-1 text-[11px] leading-relaxed text-gray-400">
            {t("media.removeBackground.license")}
          </p>
        </aside>
      </div>
    </MediaShell>
  );
}
