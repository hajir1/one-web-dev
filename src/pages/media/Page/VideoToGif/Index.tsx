import { useState } from "react";
import { Clapperboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import ServerVideoTool from "../../components/ServerVideoTool";
import { Segmented, Slider, Toggle } from "../../components/ui";
import { baseName, formatTime } from "../../lib/format";
import { useBilling } from "../../processing/billing";
import { gifPlan } from "../../lib/serverPlans";

const WIDTHS = [240, 320, 480, 640, 800] as const;
const FPS = [5, 10, 15, 20, 25] as const;

type Palette = "best" | "balanced" | "small";

export default function VideoToGif() {
  const { t } = useTranslation();
  const maxSeconds = useBilling((s) => s.pricing["video-to-gif"].limits.maxSeconds ?? 30);
  const [range, setRange] = useState<[number, number]>([0, 5]);
  const [fps, setFps] = useState<(typeof FPS)[number]>(10);
  const [width, setWidth] = useState<(typeof WIDTHS)[number]>(480);
  const [loop, setLoop] = useState(true);
  const [palette, setPalette] = useState<Palette>("balanced");

  return (
    <ServerVideoTool
      tool="video-to-gif"
      icon={Clapperboard}
      accent="amber"
      runLabel={t("media.videoToGif.run")}
      onSource={(v) => setRange([0, Math.min(5, v.meta.duration)])}
      renderOptions={(v, disabled) => {
        const d = v.meta.duration;
        return (
          <>
            <Slider label={t("media.common.start")} value={range[0]} min={0} max={d} step={0.1} format={formatTime} disabled={disabled} onChange={(x) => setRange([Math.min(x, range[1]), range[1]])} />
            <Slider label={t("media.common.end")} value={range[1]} min={0} max={d} step={0.1} format={formatTime} disabled={disabled} onChange={(x) => setRange([range[0], Math.max(x, range[0])])} />
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("media.common.fps")}</p>
              <Segmented label={t("media.common.fps")} value={String(fps)} disabled={disabled} onChange={(x) => setFps(Number(x) as (typeof FPS)[number])} options={FPS.map((f) => ({ value: String(f), label: String(f) }))} />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("media.videoToGif.widthPx")}</p>
              <Segmented
                label={t("media.common.width")}
                value={String(width)}
                disabled={disabled}
                onChange={(x) => setWidth(Number(x) as (typeof WIDTHS)[number])}
                options={WIDTHS.map((w) => ({ value: String(w), label: String(w), title: w > v.meta.width ? t("media.videoToGif.widthTooLarge") : undefined }))}
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("media.videoToGif.palette")}</p>
              <Segmented
                label={t("media.videoToGif.palette")}
                value={palette}
                disabled={disabled}
                onChange={setPalette}
                options={[
                  { value: "best", label: t("media.videoToGif.palettes.best") },
                  { value: "balanced", label: t("media.videoToGif.palettes.balanced") },
                  { value: "small", label: t("media.videoToGif.palettes.small") },
                ]}
              />
            </div>
            <Toggle checked={loop} onChange={setLoop} label={t("media.videoToGif.loop")} disabled={disabled} />
          </>
        );
      }}
      buildJob={(v) => {
        const p = gifPlan({ duration: v.meta.duration, srcW: v.meta.width, srcH: v.meta.height, start: range[0], end: range[1], fps, width, maxSeconds });
        return {
          params: { start: range[0], end: range[1], fps, width: p.width, loop, palette },
          usage: { bytes: v.file.size, seconds: p.span },
          error: p.error,
          summary: (
            <>
              {t("media.videoToGif.summary", { span: p.span.toFixed(1), frames: p.frames, width: p.width, height: p.height })}
              {loop ? t("media.videoToGif.summaryLoop") : ""}.
              {p.upscaled && t("media.videoToGif.summaryUpscaled")}
              {p.frames > 300 && t("media.videoToGif.summaryManyFrames")}
            </>
          ),
          outName: `${baseName(v.file.name)}.gif`,
        };
      }}
    />
  );
}
