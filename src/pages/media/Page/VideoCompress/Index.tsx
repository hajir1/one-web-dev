import { useState } from "react";
import { Shrink } from "lucide-react";
import { useTranslation } from "react-i18next";
import ServerVideoTool from "../../components/ServerVideoTool";
import { NumberField, Segmented } from "../../components/ui";
import { baseName, formatSize } from "../../lib/format";
import { compressPlan, type CompressCodec, type CompressHeight, type CompressInput } from "../../lib/serverPlans";

const HEIGHTS: { value: string; label: string | null; h: CompressHeight }[] = [
  { value: "source", label: null, h: "source" },
  { value: "1080", label: "1080p", h: 1080 },
  { value: "720", label: "720p", h: 720 },
  { value: "480", label: "480p", h: 480 },
];

export default function VideoCompress() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<CompressInput["mode"]>("quality");
  const [quality, setQuality] = useState<CompressInput["quality"]>("balanced");
  const [targetMB, setTargetMB] = useState(10);
  const [height, setHeight] = useState("source");
  const [codec, setCodec] = useState<CompressCodec>("h264");
  const [audio, setAudio] = useState<CompressInput["audio"]>("keep");

  const label = (text: string) => <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{text}</p>;

  return (
    <ServerVideoTool
      tool="video-compress"
      icon={Shrink}
      accent="blue"
      runLabel={t("media.videoCompress.run")}
      onSource={(v) => setTargetMB(Math.max(1, Math.round(v.file.size / 1024 / 1024 / 2)))}
      renderOptions={(v, disabled) => (
        <>
          <div>
            {label(t("media.videoCompress.method"))}
            <Segmented
              label={t("media.videoCompress.method")}
              value={mode}
              disabled={disabled}
              onChange={setMode}
              options={[
                { value: "quality", label: t("media.videoCompress.byQuality") },
                { value: "size", label: t("media.videoCompress.bySize") },
              ]}
            />
          </div>
          {mode === "quality" ? (
            <div>
              {label(t("media.videoCompress.quality"))}
              <Segmented
                label={t("media.videoCompress.quality")}
                value={quality}
                disabled={disabled}
                onChange={setQuality}
                options={[
                  { value: "high", label: t("media.videoCompress.qualities.high") },
                  { value: "balanced", label: t("media.videoCompress.qualities.balanced") },
                  { value: "small", label: t("media.videoCompress.qualities.small") },
                ]}
              />
            </div>
          ) : (
            <NumberField label={t("media.videoCompress.targetLabel", { size: formatSize(v.file.size) })} suffix="MB" min={1} max={2048} value={targetMB} onChange={setTargetMB} disabled={disabled} />
          )}
          <div>
            {label(t("media.videoCompress.resolution"))}
            <Segmented
              label={t("media.videoCompress.resolution")}
              value={height}
              disabled={disabled}
              onChange={setHeight}
              options={HEIGHTS.map((o) => ({ value: o.value, label: o.label ?? t("media.videoCompress.original"), title: o.h !== "source" && o.h >= v.meta.height ? t("media.videoCompress.notSmaller") : undefined }))}
            />
          </div>
          <div>
            {label("Codec")}
            <Segmented
              label="Codec"
              value={codec}
              disabled={disabled}
              onChange={setCodec}
              options={[
                { value: "h264", label: "H.264", title: t("media.videoCompress.codecs.h264") },
                { value: "h265", label: "H.265", title: t("media.videoCompress.codecs.h265") },
                { value: "vp9", label: "VP9", title: t("media.videoCompress.codecs.vp9") },
              ]}
            />
          </div>
          <div>
            {label(t("media.videoCompress.audio"))}
            <Segmented
              label={t("media.videoCompress.audio")}
              value={audio}
              disabled={disabled}
              onChange={setAudio}
              options={[
                { value: "keep", label: t("media.videoCompress.audioKeep") },
                { value: "aac128", label: "128 kbps" },
                { value: "none", label: t("media.videoCompress.audioRemove") },
              ]}
            />
          </div>
        </>
      )}
      buildJob={(v) => {
        const h = HEIGHTS.find((x) => x.value === height)!.h;
        const p = compressPlan({ bytes: v.file.size, duration: v.meta.duration, srcHeight: v.meta.height, mode, quality, targetMB, height: h, codec, audio });
        return {
          params: p.params,
          usage: { bytes: v.file.size, seconds: v.meta.duration },
          error: p.error,
          summary: (
            <>
              {codec.toUpperCase()} → .{p.container}
              {h !== "source" ? `, ${h}p` : t("media.videoCompress.summaryOriginalRes")}
              {mode === "size" && p.videoKbps
                ? t("media.videoCompress.summaryBitrate", { kbps: p.videoKbps, target: targetMB })
                : t("media.videoCompress.summaryQuality", { quality: t(`media.videoCompress.qualitiesLower.${quality}`) })}
              {audio === "none" ? t("media.videoCompress.summaryNoAudio") : ""}. {t("media.videoCompress.summaryFinal")}
            </>
          ),
          outName: `${baseName(v.file.name)}-${t("media.videoCompress.fileSuffix")}.${p.container}`,
        };
      }}
    />
  );
}
