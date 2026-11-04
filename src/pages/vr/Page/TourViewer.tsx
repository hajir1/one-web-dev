import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, FileCode2, Info, Maximize, Minimize, X } from "lucide-react";
import AppMeta from "../../../components/app/AppMeta";
import { Link } from "../../../components/app/LocaleLink";
import CreditDialog from "../../../credits/CreditDialog";
import { VR_TOUR_PATH } from "../../../config/menu";
import { mediaIdsOf } from "../model";
import { getMediaMap, useTourStore } from "../storage";
import { useTourExport } from "../useTourExport";
import TourPreview from "../ui/TourPreview";
import type { Tour } from "../model";

/* ================================================================== */
/* Full-screen tour preview: /vr/tour-360/pratinjau/:tourId             */
/*                                                                    */
/* Opened in a new tab from the editor. Its A-Frame runtime is the same as */
/* the export, but photos are read from this browser's storage          */
/* (IndexedDB), so no server or upload is needed. Changes in the editor */
/* tab show here too.                                                   */
/* ================================================================== */

const STORE_KEY = "onewebdev-vr-tours-v1";
const pill = "inline-flex items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-slate-900/90 disabled:opacity-60";

export default function TourViewer() {
  const { tourId } = useParams();
  const { t } = useTranslation();
  const tour = useTourStore((s) => s.tours.find((x) => x.id === tourId) ?? null);

  // The editor tab saves to localStorage → reload here (the "storage" event).
  useEffect(() => {
    const on = (e: StorageEvent) => {
      if (e.key === STORE_KEY) void useTourStore.persist.rehydrate();
    };
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white" data-testid="vr-viewer">
      <AppMeta title={tour ? `${tour.name} · ${t("vr.viewer.title")}` : t("vr.viewer.title")} description={t("vr.metaDescription")} />
      {tour ? (
        <Viewer tour={tour} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center" data-testid="vr-viewer-missing">
          <p className="text-sm text-white/80">{t("vr.viewer.missing")}</p>
          <Link to={VR_TOUR_PATH} className={pill}>
            <ArrowLeft className="h-3.5 w-3.5" /> {t("vr.editor.back")}
          </Link>
        </div>
      )}
      <CreditDialog />
    </div>
  );
}

function Viewer({ tour }: { tour: Tour }) {
  const { t, i18n } = useTranslation();
  const { busy, exportSingle } = useTourExport(tour);
  const [media, setMedia] = useState<Record<string, Blob> | null>(null);
  const [note, setNote] = useState(true);
  const [full, setFull] = useState(false);

  const ids = mediaIdsOf(tour).join("|");
  useEffect(() => {
    let alive = true;
    void getMediaMap(ids ? ids.split("|") : []).then((m) => alive && setMedia(m));
    return () => {
      alive = false;
    };
  }, [ids]);

  useEffect(() => {
    const on = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);
  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    else void document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  const start = tour.scenes.find((s) => s.id === tour.startSceneId) ?? tour.scenes[0];
  return (
    <>
      {media && <TourPreview tour={tour} media={media} sceneId={start.id} mode="view" lang={i18n.language} title={t("vr.viewer.title")} />}
      {!start.panoramaId && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/80">
          <span className="rounded-lg bg-black/60 px-3 py-2">{t("vr.viewer.noPanorama")}</span>
        </div>
      )}
      <div className="absolute right-3 top-[68px] z-10 flex max-w-[calc(100%-1.5rem)] flex-col items-end gap-2 sm:top-3">
        <div className="flex flex-wrap justify-end gap-2">
          <Link to={`${VR_TOUR_PATH}?tour=${tour.id}`} className={pill} data-testid="vr-viewer-edit">
            <ArrowLeft className="h-3.5 w-3.5" /> {t("vr.viewer.edit")}
          </Link>
          <button type="button" className={pill} onClick={exportSingle} disabled={busy} title={t("vr.export.singleHint")} data-testid="vr-viewer-single">
            <FileCode2 className="h-3.5 w-3.5" /> {t("vr.export.single")}
          </button>
          <button type="button" className={pill} onClick={toggleFull} aria-pressed={full}>
            {full ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />} {full ? t("vr.viewer.exitFull") : t("vr.viewer.full")}
          </button>
          {!note && (
            <button type="button" className={pill} onClick={() => setNote(true)} aria-label={t("vr.viewer.about")}>
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {note && (
          <div className="relative w-80 max-w-full rounded-xl bg-slate-900/85 p-3 pr-8 text-xs leading-relaxed text-white/90 backdrop-blur" data-testid="vr-viewer-note">
            <button type="button" className="absolute right-2 top-2 rounded p-0.5 text-white/70 hover:text-white" onClick={() => setNote(false)} aria-label={t("vr.viewer.closeNote")}>
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="font-semibold text-white">{t("vr.viewer.noteTitle")}</p>
            <p className="mt-1">{t("vr.viewer.noteText")}</p>
          </div>
        )}
      </div>
    </>
  );
}
