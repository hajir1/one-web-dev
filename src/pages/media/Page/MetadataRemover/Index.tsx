import { useEffect, useMemo, useState } from "react";
import { MapPin, ShieldCheck, ShieldOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import QueuePanel from "../../components/QueuePanel";
import { Chip, Notice, Panel, Toggle } from "../../components/ui";
import { useFileQueue, type QueueItem } from "../../hooks/useFileQueue";
import { baseName, formatSize } from "../../lib/format";
import type { FileRules } from "../../lib/validate";
import { inspectMetadata, stripMetadata, type MetadataReport } from "../../lib/metadata";
import { context2d, createCanvas, decodeImage, encodeCanvas, releaseCanvas } from "../../converters/image";

const RULES: FileRules = { kinds: ["jpeg", "png", "webp", "gif", "bmp", "avif"], maxBytes: 50 * 1024 * 1024, maxFiles: 200 };
const LOSSLESS = new Set(["jpeg", "png", "webp"]);
const EXT: Record<string, string> = { jpeg: "jpg", png: "png", webp: "webp" };

type Report = MetadataReport | { error: string } | "reencode";

const AI_KEYS = /^(parameters|prompt|workflow|negative|sd-metadata|invokeai|comfy)/i;

function Findings({ report }: { report: Report | undefined }) {
  const { t } = useTranslation();
  if (!report) return <p className="mt-1 text-[11px] text-gray-400">{t("media.metadataRemover.checking")}</p>;
  if (report === "reencode")
    return <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{t("media.metadataRemover.reencode")}</p>;
  if ("error" in report) return <p className="mt-1 text-[11px] text-rose-600">{report.error}</p>;
  const ai = report.textKeys.filter((k) => AI_KEYS.test(k));
  const items = [
    report.camera && t("media.metadataRemover.camera", { value: report.camera }),
    report.dateTime && t("media.metadataRemover.dateTime", { value: report.dateTime }),
    report.software && t("media.metadataRemover.software", { value: report.software }),
    report.serial && t("media.metadataRemover.serial", { value: report.serial }),
    report.textKeys.length > 0 && t("media.metadataRemover.text", { value: `${report.textKeys.slice(0, 4).join(", ")}${report.textKeys.length > 4 ? "…" : ""}` }),
  ].filter(Boolean) as string[];
  const clean = !report.blocks.length && !report.hasGps;
  return (
    <div className="mt-1.5 flex flex-col gap-1" data-testid="findings">
      <div className="flex flex-wrap gap-1">
        {clean ? (
          <Chip tone="green">
            <ShieldCheck className="h-3 w-3" /> {t("media.metadataRemover.clean")}
          </Chip>
        ) : (
          <>
            {report.hasGps && (
              <Chip tone="rose">
                <MapPin className="h-3 w-3" /> {t("media.metadataRemover.gps")}
              </Chip>
            )}
            {ai.length > 0 && <Chip tone="amber">{t("media.metadataRemover.aiPrompt")}</Chip>}
            {report.blocks.map((b) => (
              <Chip key={b}>{b}</Chip>
            ))}
            <Chip tone="blue">−{formatSize(report.removableBytes)}</Chip>
          </>
        )}
      </div>
      {report.gps && (
        <p className="text-[11px] text-rose-700 dark:text-rose-300">
          {t("media.metadataRemover.coordinates", { lat: report.gps.lat, lon: report.gps.lon })}
        </p>
      )}
      {items.length > 0 && <p className="text-[11px] text-gray-500 dark:text-gray-400">{items.join(" · ")}</p>}
    </div>
  );
}

export default function MetadataRemover() {
  const { t } = useTranslation();
  const [keepOrientation, setKeepOrientation] = useState(true);
  const [keepIcc, setKeepIcc] = useState(true);
  const [reports, setReports] = useState<Record<string, Report>>({});

  const settingsKey = useMemo(() => JSON.stringify([keepOrientation, keepIcc]), [keepOrientation, keepIcc]);

  const queue = useFileQueue({
    settingsKey,
    process: async (item: QueueItem, ctx) => {
      if (LOSSLESS.has(item.kind)) {
        const bytes = new Uint8Array(await item.file.arrayBuffer());
        if (ctx.signal.aborted) throw new DOMException(t("media.errors.aborted"), "AbortError");
        const out = stripMetadata(bytes, { keepOrientation, keepIcc });
        const check = inspectMetadata(out);
        if (check.hasGps || check.blocks.some((b) => b !== "EXIF") || (check.hasExif && !keepOrientation))
          throw new Error(t("media.metadataRemover.verifyFailed"));
        return {
          blob: new Blob([out as BlobPart], { type: item.file.type || `image/${item.kind}` }),
          fileName: `${baseName(item.file.name)}-${t("media.metadataRemover.fileSuffix")}.${EXT[item.kind]}`,
          label: "Lossless",
        };
      }
      // GIF/BMP/AVIF: encode ulang ke PNG lewat Canvas.
      const img = await decodeImage(item.file, ctx.signal);
      const c = createCanvas(img.width, img.height);
      try {
        context2d(c).drawImage(img.source, 0, 0);
        return { blob: await encodeCanvas(c, "image/png"), fileName: `${baseName(item.file.name)}-${t("media.metadataRemover.fileSuffix")}.png`, label: t("media.metadataRemover.labelReencode") };
      } finally {
        img.close();
        releaseCanvas(c);
      }
    },
  });
  const intake = useFileIntake(RULES, queue.add);

  // Periksa metadata setiap file baru (sekali per file).
  useEffect(() => {
    const missing = queue.items.filter((it) => !(it.id in reports));
    if (!missing.length) return;
    let alive = true;
    (async () => {
      const next: Record<string, Report> = {};
      for (const it of missing) {
        if (!LOSSLESS.has(it.kind)) next[it.id] = "reencode";
        else
          try {
            next[it.id] = inspectMetadata(new Uint8Array(await it.file.arrayBuffer()));
          } catch (e) {
            next[it.id] = { error: e instanceof Error ? e.message : t("media.metadataRemover.unreadable") };
          }
      }
      if (alive) setReports((r) => ({ ...r, ...next }));
    })();
    return () => {
      alive = false;
    };
  }, [queue.items, reports, t]);

  const gpsCount = queue.items.filter((it) => {
    const r = reports[it.id];
    return r && typeof r === "object" && "hasGps" in r && r.hasGps;
  }).length;

  return (
    <MediaShell tool="metadata-remover" icon={ShieldOff} accent="rose">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="flex min-w-0 flex-col gap-4">
          <Dropzone rules={RULES} accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif" onFiles={intake.handleFiles} busy={intake.checking} compact={queue.items.length > 0} />
          {intake.rejectionText && (
            <Notice tone="warn" onDismiss={intake.clearRejected} testId="rejections">
              {intake.rejectionText}
            </Notice>
          )}
          {gpsCount > 0 && (
            <Notice tone="error" title={t("media.metadataRemover.gpsWarningTitle", { count: gpsCount })} testId="gps-warning">
              {t("media.metadataRemover.gpsWarning")}
            </Notice>
          )}
          <QueuePanel
            queue={queue}
            title={t("media.metadataRemover.photos")}
            runLabel={t("media.metadataRemover.runAll")}
            actionLabel={t("media.metadataRemover.run")}
            zipName={`${t("media.metadataRemover.zipPrefix")}-${new Date().toISOString().slice(0, 10)}.zip`}
            rowExtra={(it) => <Findings report={reports[it.id]} />}
          />
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start" aria-label={t("media.common.settings")}>
          <Panel title={t("media.metadataRemover.keepTitle")} description={t("media.metadataRemover.keepDescription")}>
            <div className="flex flex-col gap-4">
              <Toggle
                checked={keepOrientation}
                onChange={setKeepOrientation}
                label={t("media.metadataRemover.keepOrientation")}
                hint={t("media.metadataRemover.keepOrientationHint")}
              />
              <Toggle checked={keepIcc} onChange={setKeepIcc} label={t("media.metadataRemover.keepIcc")} hint={t("media.metadataRemover.keepIccHint")} />
            </div>
          </Panel>
          <Panel title={t("media.metadataRemover.removedTitle")}>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              {(["exif", "gps", "xmp", "png", "extra"] as const).map((k) => (
                <li key={k}>• {t(`media.metadataRemover.removed.${k}`)}</li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </MediaShell>
  );
}
