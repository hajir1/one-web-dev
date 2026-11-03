import { useState } from "react";
import { useTranslation } from "react-i18next";
import JSZip from "jszip";
import { notify } from "../../components/app/Toaster";
import { downloadBlob } from "../media/lib/download";
import { requireCredit } from "../../credits/credits";
import { VR_PRO } from "../../config/marketplace";
import { useAccess } from "../../marketplace/hooks";
import { itemIdOf } from "../../marketplace/entitlements";
import { buildTourFiles, buildTourSingleHtml, type TourMediaFile } from "./exportTour";
import { mediaIdsOf, proFeaturesUsed, sniffVrMedia, tourIssues, type Tour, type VrMediaKind } from "./model";
import { getMediaMap, useTourStore } from "./storage";
import { isDemoMode } from "../../demo/demoMode";

export const PRO_KEY = itemIdOf.feature(VR_PRO.id);
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "tur-360";

/** Buka dialog kredit Tur 360° Pro. Mode demo (v15): Pro sudah terbuka, jadi dialog tidak pernah perlu. */
export const unlockVrPro = (onUnlocked?: () => void) => {
  if (isDemoMode()) {
    onUnlocked?.();
    return true;
  }
  return requireCredit("premium-vr", { item: "Tur 360° Pro", itemKey: PRO_KEY, simCost: VR_PRO.price, onUnlocked });
};

/** Berkas tur dari IndexedDB, lengkap dengan jenisnya. */
async function tourMediaFiles(tour: Tour): Promise<TourMediaFile[]> {
  const meta = useTourStore.getState().media;
  const blobs = await getMediaMap(mediaIdsOf(tour));
  return Promise.all(
    Object.entries(blobs).map(async ([id, blob]) => ({ id, blob, kind: (meta[id]?.type as VrMediaKind | undefined) ?? sniffVrMedia(new Uint8Array(await blob.slice(0, 16).arrayBuffer())) })),
  );
}

/**
 * Unduhan tur: ZIP untuk hosting, atau pratinjau 1 berkas yang bisa dibuka
 * dengan klik ganda. Keduanya memakai syarat yang sama (tur lengkap, fitur
 * Pro hanya bila sudah dibuka).
 */
export function useTourExport(tour: Tour) {
  const { t, i18n } = useTranslation();
  const pro = useAccess().owns(PRO_KEY);
  const [busy, setBusy] = useState(false);
  const issues = tourIssues(tour);
  const proUsed = proFeaturesUsed(tour);

  const run = async (kind: "zip" | "single") => {
    if (issues.length) return notify.error(t("vr.export.fixFirst"));
    if (proUsed.length && !pro) return unlockVrPro();
    setBusy(true);
    try {
      const media = await tourMediaFiles(tour);
      if (kind === "single") {
        const html = await buildTourSingleHtml(tour, media, i18n.language);
        downloadBlob(new Blob([html], { type: "text/html" }), `${slug(tour.name)}-pratinjau.html`);
        notify.success(t("vr.export.singleDone"));
        return;
      }
      const zip = new JSZip();
      for (const f of buildTourFiles(tour, media, i18n.language)) zip.file(f.name, f.blob);
      downloadBlob(await zip.generateAsync({ type: "blob" }), `${slug(tour.name)}.zip`);
      notify.success(t("vr.export.done"));
    } catch {
      notify.error(t("vr.errors.export"));
    } finally {
      setBusy(false);
    }
  };

  return { busy, pro, issues, proUsed, exportZip: () => run("zip"), exportSingle: () => run("single") };
}
