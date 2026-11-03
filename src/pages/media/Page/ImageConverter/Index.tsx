import { useMemo, useState } from "react";
import { ImageIcon, Repeat2 } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import QueuePanel from "../../components/QueuePanel";
import { ColorField, Notice, NumberField, Panel, Segmented, Slider, Toggle } from "../../components/ui";
import { useFileQueue } from "../../hooks/useFileQueue";
import { baseName } from "../../lib/format";
import type { FileRules } from "../../lib/validate";
import {
  DEFAULT_CONVERSION_OPTIONS,
  FORMATS,
  SOURCE_KINDS,
  convertFile,
  resolveTarget,
  sourceCategory,
  type ConversionOptions,
  type ResizeMode,
  type TargetId,
} from "../../converters";
import { ICO_SIZES } from "../../lib/imageFormats";

const RULES: FileRules = { kinds: SOURCE_KINDS, maxBytes: 100 * 1024 * 1024, maxFiles: 200 };

const RESIZE_MODES: ResizeMode[] = ["fit-box", "fit-width", "fit-height", "exact"];

export default function ImageConverter() {
  const { t } = useTranslation();
  const TARGETS: { id: TargetId; label: string; hint: string }[] = [
    { id: "same", label: t("media.imageConverter.sameFormat"), hint: t("media.imageConverter.sameFormatHint") },
    ...FORMATS.map((f) => ({ id: f.id as TargetId, label: f.label, hint: f.description })),
  ];
  const resizeModes = RESIZE_MODES.map((value) => ({ value, label: t(`media.imageConverter.resizeModes.${value}`) }));
  const [target, setTarget] = useState<TargetId>("webp");
  const [o, setO] = useState<ConversionOptions>(DEFAULT_CONVERSION_OPTIONS);

  const settingsKey = useMemo(() => JSON.stringify([target, o]), [target, o]);
  const queue = useFileQueue({
    settingsKey,
    process: async (item, ctx) => {
      const fmt = resolveTarget(target, item.kind);
      const r = await convertFile(item.file, item.kind, fmt, o, ctx);
      return {
        blob: r.blob,
        fileName: `${baseName(item.file.name)}.${fmt.ext}`,
        label: `${fmt.label}${r.width ? ` ${r.width}×${r.height}` : ""}`,
        meta: { notes: r.notes },
      };
    },
  });
  const intake = useFileIntake(RULES, queue.add);

  const kinds = queue.items.map((i) => i.kind);
  const targetsUsed = new Set(kinds.map((k) => resolveTarget(target, k).id));
  if (!kinds.length) targetsUsed.add(target === "same" ? "jpeg" : target);
  const used = FORMATS.filter((f) => targetsUsed.has(f.id));
  const anyRasterOut = [...targetsUsed].some((x) => x !== "svg");
  const anyLossy = used.some((f) => f.lossy);
  const anyLosslessOpt = used.some((f) => f.losslessOption);
  const anyJpeg = targetsUsed.has("jpeg");
  const anyIco = targetsUsed.has("ico");
  const traceNeeded = target === "svg" && (kinds.some((k) => sourceCategory(k) === "raster") || !kinds.length);
  const svgOut = target === "svg" || (target === "same" && kinds.includes("svg"));
  const lossless = anyLosslessOpt && o.losslessWebp && !anyJpeg;

  const set = <K extends keyof ConversionOptions>(k: K, v: ConversionOptions[K]) => setO((p) => ({ ...p, [k]: v }));
  const setResize = (p: Partial<ConversionOptions["resize"]>) => setO((x) => ({ ...x, resize: { ...x.resize, ...p } }));

  return (
    <MediaShell tool="image-converter" icon={Repeat2} accent="blue">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        {/* ------------------------ pengaturan ------------------------ */}
        <aside className="order-2 flex flex-col gap-4 lg:order-none lg:sticky lg:top-20 lg:self-start" aria-label={t("media.imageConverter.settingsLabel")}>
          <Panel title={t("media.imageConverter.targetTitle")} description={t("media.imageConverter.targetDescription")}>
            <div role="radiogroup" aria-label={t("media.imageConverter.targetTitle")} className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3" data-testid="target-formats">
              {TARGETS.map((tg) => {
                const off = false;
                const active = target === tg.id;
                return (
                  <button
                    key={tg.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={off}
                    onClick={() => setTarget(tg.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition disabled:opacity-40 ${
                      active
                        ? "border-blue-700 bg-blue-50/70 ring-1 ring-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:ring-blue-500"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    } ${tg.id === "same" ? "col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-3" : ""}`}
                  >
                    <span className="block text-sm font-semibold text-gray-800 dark:text-white/90">{tg.label}</span>
                    <span className="block text-[11px] leading-snug text-gray-500 dark:text-gray-400">{off ? t("media.imageConverter.notSupported") : tg.hint}</span>
                  </button>
                );
              })}
            </div>
            {target === "same" && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{t("media.imageConverter.sameNote")}</p>
            )}
            <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400" data-testid="wasm-note">
              {t("media.imageConverter.wasmNote")}
            </p>
            {target === "svg" && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                <Trans i18nKey="media.imageConverter.svgNote" components={{ b: <b /> }} />
              </p>
            )}
          </Panel>

          {(anyRasterOut || traceNeeded || svgOut) && (
            <Panel title={t("media.imageConverter.qualityTitle")}>
              <div className="flex flex-col gap-4">
                {anyLossy && (
                  <Slider
                    label={t("media.imageConverter.quality")}
                    value={o.quality}
                    min={1}
                    max={100}
                    disabled={lossless}
                    onChange={(v) => set("quality", v)}
                    format={(v) => (lossless ? "lossless" : String(v))}
                    hint={t("media.imageConverter.qualityHint")}
                  />
                )}
                {anyLosslessOpt && <Toggle checked={o.losslessWebp} onChange={(v) => set("losslessWebp", v)} label={t("media.imageConverter.webpLossless")} hint={t("media.imageConverter.webpLosslessHint")} />}
                {anyIco && (
                  <fieldset data-testid="ico-sizes">
                    <legend className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">{t("media.imageConverter.icoSizes")}</legend>
                    <div className="flex flex-wrap gap-1.5">
                      {ICO_SIZES.map((sz) => {
                        const on = o.icoSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            aria-pressed={on}
                            onClick={() => set("icoSizes", on ? o.icoSizes.filter((x) => x !== sz) : [...o.icoSizes, sz].sort((a, b) => a - b))}
                            disabled={on && o.icoSizes.length === 1}
                            className={`rounded-lg border px-2 py-1 text-xs font-medium ${on ? "border-blue-700 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-200" : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"}`}
                          >
                            {sz}×{sz}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{t("media.imageConverter.icoHint")}</p>
                  </fieldset>
                )}
                {anyJpeg && <ColorField label={t("media.imageConverter.jpegBackground")} value={o.jpegBackgroundColor} onChange={(v) => set("jpegBackgroundColor", v)} />}
                {targetsUsed.has("png") && !anyLossy && <p className="text-xs text-gray-500 dark:text-gray-400">{t("media.imageConverter.pngNote")}</p>}
                {traceNeeded && (
                  <>
                    <Slider label={t("media.imageConverter.traceColors")} value={o.trace.numberOfColors} min={2} max={32} onChange={(v) => set("trace", { ...o.trace, numberOfColors: v })} />
                    <Slider label={t("media.imageConverter.traceNoise")} value={o.trace.pathomit} min={0} max={30} format={(v) => `${v}px`} onChange={(v) => set("trace", { ...o.trace, pathomit: v })} />
                  </>
                )}
                {svgOut && (
                  <>
                    <Toggle
                      checked={o.vectorBackgroundColor !== null}
                      onChange={(v) => set("vectorBackgroundColor", v ? "#ffffff" : null)}
                      label={t("media.imageConverter.svgFill")}
                      hint={t("media.imageConverter.svgFillHint")}
                    />
                    {o.vectorBackgroundColor !== null && <ColorField label={t("media.imageConverter.svgFillColor")} value={o.vectorBackgroundColor} onChange={(v) => set("vectorBackgroundColor", v)} />}
                  </>
                )}
              </div>
            </Panel>
          )}

          <Panel title={t("media.imageConverter.resizeTitle")} description={t("media.imageConverter.resizeDescription")}>
            <div className="flex flex-col gap-4">
              <Toggle checked={o.resize.enabled} onChange={(v) => setResize({ enabled: v })} label={t("media.imageConverter.resizeEnable")} />
              {o.resize.enabled && (
                <>
                  <Segmented label={t("media.imageConverter.resizeMode")} value={o.resize.mode} options={resizeModes} onChange={(mode) => setResize({ mode })} />
                  <div className="grid grid-cols-2 gap-3">
                    {o.resize.mode !== "fit-height" && <NumberField label={t("media.common.width")} suffix="px" min={1} max={16384} value={o.resize.width} onChange={(width) => setResize({ width })} />}
                    {o.resize.mode !== "fit-width" && <NumberField label={t("media.common.height")} suffix="px" min={1} max={16384} value={o.resize.height} onChange={(height) => setResize({ height })} />}
                  </div>
                  {o.resize.mode !== "exact" ? (
                    <Toggle checked={!!o.resize.noUpscale} onChange={(v) => setResize({ noUpscale: v })} label={t("media.imageConverter.noUpscale")} />
                  ) : (
                    <p className="text-xs text-amber-700 dark:text-amber-400">{t("media.imageConverter.exactWarning")}</p>
                  )}
                </>
              )}
            </div>
          </Panel>
        </aside>

        {/* -------------------------- antrean -------------------------- */}
        {/* Di HP, unggah & antrean tampil lebih dulu; pengaturan di bawahnya. */}
        <div className="order-1 flex min-w-0 flex-col gap-4 lg:order-none">
          <Dropzone
            rules={RULES}
            accept="image/*,.svg,.ico,.avif,.tif,.tiff,.jxl,.qoi"
            onFiles={intake.handleFiles}
            busy={intake.checking}
            compact={queue.items.length > 0}
            allowPaste
          />
          {intake.rejectionText && (
            <Notice tone="warn" onDismiss={intake.clearRejected} testId="rejections">
              {intake.rejectionText}
            </Notice>
          )}
          {queue.items.length === 0 ? (
            <Panel bodyClassName="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <ImageIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("media.imageConverter.emptyTitle")}</p>
              <p className="max-w-sm text-xs text-gray-500 dark:text-gray-400">
                {t("media.imageConverter.emptyText")}
              </p>
            </Panel>
          ) : (
            <QueuePanel
              queue={queue}
              runLabel={t("media.imageConverter.runAll")}
              actionLabel={t("media.imageConverter.run")}
              zipName={`${t("media.imageConverter.zipPrefix")}-${target}-${new Date().toISOString().slice(0, 10)}.zip`}
              rowExtra={(it) => {
                const notes = (it.result?.meta?.notes as string[] | undefined) ?? [];
                return notes.length ? <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{notes.join(" ")}</p> : null;
              }}
            />
          )}
        </div>
      </div>
    </MediaShell>
  );
}
