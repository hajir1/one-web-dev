import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Camera, CloudOff, Loader2, Sparkles, Trash2, Wand2 } from "lucide-react";
import Modal from "../../../components/app/Modal";
import { notify } from "../../../components/app/Toaster";
import { Notice, Segmented, btn } from "../../../components/app/ui";
import Dropzone, { useFileIntake } from "../../media/components/Dropzone";
import { AccessActions, AccessDetails } from "../../media/components/FeatureAccess";
import { useServerFeatureAccess } from "../../media/hooks/useFeatureAccess";
import { InsufficientCreditError, FeatureLockedError, ServerUnavailableError, ServiceUnavailableError, runServerJob } from "../../media/processing/serverClient";
import { formatCredits } from "../../media/processing/pricing";
import { STITCH, zipPhotos } from "../stitch";

type Width = "4096" | "6144";

interface Photo {
  id: string;
  file: File;
  url: string;
}

/** v7: dialog VR Panorama Stitcher (lihat ../stitch.ts). */
export default function PanoramaStitcher({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: (file: File) => Promise<void> }) {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [width, setWidth] = useState<Width>("6144");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const count = photos.length;
  const access = useServerFeatureAccess(STITCH.feature, [{ photos: Math.max(1, count) }]);

  useEffect(() => () => abort.current?.abort(), []);
  // Lepas URL pratinjau saat foto dibuang / komponen ditutup.
  const urls = useRef<string[]>([]);
  urls.current = photos.map((p) => p.url);
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const intake = useFileIntake({ kinds: ["jpeg", "png", "webp"], maxBytes: STITCH.maxPhotoBytes, maxFiles: STITCH.maxPhotos }, (files) => {
    setError(null);
    setPhotos((cur) => {
      const room = STITCH.maxPhotos - cur.length;
      if (files.length > room) setError(t("vr.stitch.tooMany", { max: STITCH.maxPhotos }));
      const add = files.slice(0, Math.max(0, room)).map((f, i) => ({ id: `${Date.now()}-${i}-${f.file.name}`, file: f.file, url: URL.createObjectURL(f.file) }));
      return [...cur, ...add];
    });
  });

  const remove = (id: string) =>
    setPhotos((cur) => {
      const p = cur.find((x) => x.id === id);
      if (p) URL.revokeObjectURL(p.url);
      return cur.filter((x) => x.id !== id);
    });

  const close = () => {
    if (running) abort.current?.abort();
    onClose();
  };

  const run = async () => {
    if (running || count < STITCH.minPhotos || !access) return;
    setRunning(true);
    setError(null);
    setProgress(0);
    abort.current = new AbortController();
    try {
      const zip = await zipPhotos(photos.map((p) => p.file));
      const file = new File([zip], "panorama-foto.zip", { type: "application/zip" });
      const res = await runServerJob({
        feature: STITCH.feature,
        file,
        params: { photos: count, projection: "equirect", width: Number(width) },
        signal: abort.current.signal,
        onProgress: setProgress,
      });
      await onDone(new File([res.blob], `panorama-360-${Date.now()}.jpg`, { type: "image/jpeg" }));
      notify.success(t("vr.stitch.done"));
      photos.forEach((p) => URL.revokeObjectURL(p.url));
      setPhotos([]);
      onClose();
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      // Python mati / saldo kurang / terkunci → pesan ramah dari serverClient; kredit tidak dipotong.
      if (e instanceof ServiceUnavailableError || e instanceof ServerUnavailableError) setError(t("vr.stitch.unavailable"));
      else if (e instanceof InsufficientCreditError || e instanceof FeatureLockedError) setError(e.message);
      else setError(e instanceof Error ? e.message : t("errors.server.failed"));
    } finally {
      setRunning(false);
      setProgress(null);
      abort.current = null;
    }
  };

  const ready = access?.state === "ready";
  const few = count > 0 && count < STITCH.recommendedMin;

  return (
    <Modal
      open={open}
      onClose={close}
      title={t("vr.stitch.title")}
      description={t("vr.stitch.description")}
      icon={<Wand2 className="h-5 w-5" />}
      size="lg"
      testId="vr-stitch"
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={close}>
            {running ? t("common.cancel") : t("common.close", { defaultValue: "Tutup" })}
          </button>
          <button type="button" className={btn.primary} onClick={run} disabled={running || count < STITCH.minPhotos || !ready} data-testid="vr-stitch-run">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {access && count >= STITCH.minPhotos ? t("vr.stitch.run", { cost: formatCredits(access.plan.credits), uses: access.plan.packUses }) : t("vr.stitch.runIdle")}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {access && !access.serverAvailable && (
          <Notice tone="warn" testId="vr-stitch-offline">
            <span className="flex items-start gap-2">
              <CloudOff className="mt-0.5 h-4 w-4 shrink-0" /> {t("vr.stitch.unavailable")}
            </span>
          </Notice>
        )}
        <ul className="flex list-disc flex-col gap-1 pl-5 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
          {(t("vr.stitch.tips", { returnObjects: true, min: STITCH.recommendedMin, max: STITCH.maxPhotos }) as string[]).map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
        {count < STITCH.maxPhotos && (
          <Dropzone
            rules={{ kinds: ["jpeg", "png", "webp"], maxBytes: STITCH.maxPhotoBytes, maxFiles: STITCH.maxPhotos - count }}
            accept="image/jpeg,image/png,image/webp"
            onFiles={intake.handleFiles}
            busy={intake.checking || running}
            compact
            title={t("vr.stitch.drop", { n: count, max: STITCH.maxPhotos })}
            testId="vr-stitch-drop"
          />
        )}
        {intake.rejectionText && (
          <Notice tone="warn" onDismiss={intake.clearRejected}>
            {intake.rejectionText}
          </Notice>
        )}
        {count > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300" data-testid="vr-stitch-count">
              <Camera className="h-3.5 w-3.5" /> {t("vr.stitch.count", { count, max: STITCH.maxPhotos })}
            </p>
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {photos.map((p, i) => (
                <li key={p.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <img src={p.url} alt={t("vr.stitch.photoAlt", { n: i + 1 })} className="h-full w-full object-cover" />
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] font-semibold text-white">{i + 1}</span>
                  {!running && (
                    <button type="button" onClick={() => remove(p.id)} className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white opacity-80 hover:opacity-100" aria-label={t("vr.stitch.remove", { n: i + 1 })}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {few && <Notice tone="info">{t("vr.stitch.fewHint", { min: STITCH.recommendedMin })}</Notice>}
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("vr.stitch.resolution")}</p>
          <Segmented<Width>
            value={width}
            onChange={setWidth}
            label={t("vr.stitch.resolution")}
            options={[
              { value: "4096", label: "4K · 4096×2048" },
              { value: "6144", label: "6K · 6144×3072" },
            ]}
          />
        </div>
        {access && (
          <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800" data-testid="vr-stitch-access">
            <AccessDetails access={access} />
            <div className="mt-3">
              <AccessActions access={access} compact />
            </div>
          </div>
        )}
        {running && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300" role="status" data-testid="vr-stitch-progress">
            <Loader2 className="h-4 w-4 animate-spin" /> {progress ? t("vr.stitch.progress", { pct: Math.round(progress) }) : t("vr.stitch.uploading")}
          </div>
        )}
        {error && (
          <Notice tone="error" onDismiss={() => setError(null)} testId="vr-stitch-error">
            {error}
          </Notice>
        )}
      </div>
    </Modal>
  );
}
