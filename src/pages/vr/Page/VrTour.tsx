import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Crown, Download, ExternalLink, Eye, FileCode2, Glasses, ImagePlus, MousePointerClick, Plus, Star, Trash2, Upload, Wand2 } from "lucide-react";
import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import { notify } from "../../../components/app/Toaster";
import { Chip, ColorField, Field, INPUT, Notice, Panel, Segmented, Toggle, btn } from "../../../components/app/ui";
import Dropzone, { useFileIntake } from "../../media/components/Dropzone";
import CreditDialog from "../../../credits/CreditDialog";
import { VR_PRO } from "../../../config/marketplace";
import { VR_TOUR_PATH } from "../../../config/menu";
import { useAccess } from "../../../marketplace/hooks";
import { AFRAME } from "../exportTour";
import { PRO_KEY, unlockVrPro, useTourExport } from "../useTourExport";
import { isDemoMode } from "../../../demo/demoMode";
import { Link } from "../../../components/app/LocaleLink";
import {
  AUDIO_MEDIA,
  HOTSPOT_KINDS,
  IMAGE_MEDIA,
  PRO_HOTSPOT_KINDS,
  VR_LIMITS,
  clampPitch,
  createHotspot,
  createScene,
  mediaIdsOf,
  normYaw,
  removeScene,
  sniffVrMedia,
  uid,
  vrCap,
  type Hotspot,
  type HotspotKind,
  type Tour,
  type TourScene,
  type VrMediaKind,
} from "../model";
import { deleteMedia, getMediaMap, orphanMedia, putMedia, useTourStore } from "../storage";
import TourPreview from "../ui/TourPreview";
import PanoramaStitcher from "../ui/PanoramaStitcher";

const PANO_RULES = { kinds: ["jpeg", "png", "webp"] as const, maxBytes: VR_LIMITS.panoramaBytes, maxFiles: 1 };

/** Simpan berkas ke IndexedDB setelah jenisnya dicek dari isi. */
async function storeFile(file: File, allowed: VrMediaKind[], maxBytes: number): Promise<{ id: string; kind: VrMediaKind } | { error: string }> {
  if (file.size > maxBytes) return { error: "tooBig" };
  const kind = sniffVrMedia(new Uint8Array(await file.slice(0, 16).arrayBuffer()));
  if (!allowed.includes(kind)) return { error: "badType" };
  const id = uid("m");
  await putMedia(id, file);
  useTourStore.getState().addMediaMeta({ id, name: file.name.slice(0, 120), type: kind, size: file.size });
  return { id, kind };
}

/** Hapus berkas yang tidak lagi dipakai tur mana pun. */
function cleanupMedia() {
  const { tours, media, dropMediaMeta } = useTourStore.getState();
  const ids = orphanMedia(tours, media);
  if (!ids.length) return;
  dropMediaMeta(ids);
  for (const id of ids) void deleteMedia(id).catch(() => undefined);
}

export default function VrTour() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const tours = useTourStore((s) => s.tours);
  const tour = tours.find((x) => x.id === params.get("tour")) ?? null;
  return (
    <>
      <AppMeta title={t("vr.title")} description={t("vr.metaDescription")} />
      <div className="flex min-h-screen flex-col gap-6">
        <PageHeader
          icon={Glasses}
          title={t("vr.title")}
          description={t("vr.description")}
          crumbs={[{ label: t("nav.sections.vr.name") }, { label: t("vr.title") }]}
          help="vr"
          testId="vr-header"
        />
        {tour ? <TourEditor key={tour.id} tour={tour} onBack={() => setParams({}, { replace: true })} /> : <TourList onOpen={(id) => setParams({ tour: id })} />}
      </div>
      <CreditDialog />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Daftar tur                                                           */
/* ------------------------------------------------------------------ */

function TourList({ onOpen }: { onOpen: (id: string) => void }) {
  const { t, i18n } = useTranslation();
  const { tours, add, remove } = useTourStore();
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const create = () => {
    const tour = add(name.trim() || t("vr.list.defaultName"));
    if (!tour) return notify.error(t("vr.list.limit", { max: VR_LIMITS.maxTours }));
    setName("");
    onOpen(tour.id);
  };
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Panel title={t("vr.list.title", { count: tours.length })} description={t("vr.list.subtitle")}>
        {tours.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center" data-testid="vr-empty">
            <Glasses className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("vr.list.emptyTitle")}</p>
            <p className="max-w-sm text-xs text-gray-500 dark:text-gray-400">{t("vr.list.emptyText")}</p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2" data-testid="vr-tours">
            {tours.map((x) => (
              <li key={x.id} className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                <p className="truncate font-semibold text-gray-800 dark:text-white/90">{x.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {t("vr.list.meta", { scenes: x.scenes.length, hotspots: x.scenes.reduce((n, s) => n + s.hotspots.length, 0) })} ·{" "}
                  {new Date(x.updatedAt).toLocaleString(i18n.language === "en" ? "en-US" : "id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </p>
                {confirm === x.id ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-rose-700 dark:text-rose-300">{t("vr.list.confirmDelete")}</span>
                    <button
                      type="button"
                      className="font-semibold text-rose-700 hover:underline"
                      onClick={() => {
                        remove(x.id);
                        setConfirm(null);
                        cleanupMedia();
                      }}
                    >
                      {t("common.delete", { defaultValue: "Hapus" })}
                    </button>
                    <button type="button" className="text-gray-500 hover:underline" onClick={() => setConfirm(null)}>
                      {t("common.cancel", { defaultValue: "Batal" })}
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <button type="button" className={btn.secondary.replace("px-4 py-2.5", "px-3 py-1.5")} onClick={() => onOpen(x.id)} data-testid={`vr-open-${x.id}`}>
                      {t("vr.list.open")}
                    </button>
                    <Link to={`${VR_TOUR_PATH}/pratinjau/${x.id}`} target="_blank" rel="noopener" className={btn.secondary.replace("px-4 py-2.5", "px-3 py-1.5")} data-testid={`vr-view-${x.id}`}>
                      <ExternalLink className="h-4 w-4" /> {t("vr.viewer.short")}
                    </Link>
                    <button type="button" className={btn.icon} aria-label={t("vr.list.delete")} onClick={() => setConfirm(x.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <div className="flex flex-col gap-4">
        <Panel title={t("vr.list.newTitle")}>
          <div className="flex flex-col gap-2">
            <input className={INPUT} value={name} maxLength={80} placeholder={t("vr.list.namePlaceholder")} aria-label={t("vr.list.newTitle")} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} data-testid="vr-new-name" />
            <button type="button" className={btn.primary} onClick={create} data-testid="vr-create">
              <Plus className="h-4 w-4" /> {t("vr.list.create")}
            </button>
          </div>
        </Panel>
        <PlanCard />
      </div>
    </div>
  );
}

function PlanCard() {
  const { t } = useTranslation();
  const pro = useAccess().owns(PRO_KEY);
  // Mode demo (v15): semua fitur terbuka tanpa batas, tanpa label paket.
  if (isDemoMode())
    return (
      <Panel title={t("demo.vr.title")}>
        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300" data-testid="vr-plan">
          <p>{t("demo.vr.body")}</p>
          <p className="text-[11px] text-gray-400">{t("vr.plan.cdn", { name: AFRAME.name, version: AFRAME.version })}</p>
        </div>
      </Panel>
    );
  return (
    <Panel title={t("vr.plan.title")}>
      <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300" data-testid="vr-plan">
        <p>
          <Chip tone="green">{t("vr.plan.free")}</Chip> {t("vr.plan.freeText", { scenes: VR_LIMITS.freeScenes })}
        </p>
        <p>
          <Chip tone="amber">
            <Crown className="h-3 w-3" /> {t("vr.plan.pro")}
          </Chip>{" "}
          {t("vr.plan.proText", { scenes: VR_LIMITS.proScenes, price: VR_PRO.price })}
        </p>
        {pro ? (
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{t("vr.plan.active")}</p>
        ) : (
          <button type="button" className={btn.secondary} onClick={() => unlockVrPro()} data-testid="vr-unlock">
            <Crown className="h-4 w-4 text-amber-500" /> {t("vr.plan.unlock", { price: VR_PRO.price })}
          </button>
        )}
        <p className="text-[11px] text-gray-400">{t("vr.plan.cdn", { name: AFRAME.name, version: AFRAME.version })}</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Editor tur                                                           */
/* ------------------------------------------------------------------ */

function TourEditor({ tour, onBack }: { tour: Tour; onBack: () => void }) {
  const { t, i18n } = useTranslation();
  const save = useTourStore((s) => s.save);
  const mediaMeta = useTourStore((s) => s.media);
  const { busy: exporting, pro, issues, proUsed, exportZip, exportSingle } = useTourExport(tour);
  const [sceneId, setSceneId] = useState(tour.startSceneId);
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [placeKind, setPlaceKind] = useState<HotspotKind>("scene");
  const [selected, setSelected] = useState<string | null>(null);
  const [media, setMedia] = useState<Record<string, Blob>>({});
  const [busy, setBusy] = useState(false);
  const [aspectWarn, setAspectWarn] = useState<string | null>(null);
  const [stitchOpen, setStitchOpen] = useState(false);
  const scene = tour.scenes.find((s) => s.id === sceneId) ?? tour.scenes[0];
  const hotspot = scene.hotspots.find((h) => h.id === selected) ?? null;
  const update = useCallback((next: Tour) => save(next), [save]);
  const updateScene = (patch: Partial<TourScene>) => update({ ...tour, scenes: tour.scenes.map((s) => (s.id === scene.id ? { ...s, ...patch } : s)) });
  const updateHotspot = (id: string, patch: Partial<Hotspot>) => updateScene({ hotspots: scene.hotspots.map((h) => (h.id === id ? { ...h, ...patch } : h)) });

  // Muat berkas yang dipakai tur dari IndexedDB (sekali per id).
  const ids = mediaIdsOf(tour).join("|");
  useEffect(() => {
    let alive = true;
    const need = ids ? ids.split("|") : [];
    void getMediaMap(need).then((m) => alive && setMedia((cur) => (need.every((id) => cur[id] === m[id]) && Object.keys(cur).length === need.length ? cur : m)));
    return () => {
      alive = false;
    };
  }, [ids]);

  const addScene = () => {
    if (tour.scenes.length >= vrCap(VR_LIMITS.proScenes)) return notify.error(t("vr.scene.max", { max: VR_LIMITS.proScenes }));
    if (tour.scenes.length >= VR_LIMITS.freeScenes && !pro) return unlockVrPro();
    const s = createScene(t("vr.scene.defaultName", { n: tour.scenes.length + 1 }));
    update({ ...tour, scenes: [...tour.scenes, s] });
    setSceneId(s.id);
    setSelected(null);
  };

  /** Pasang berkas panorama ke scene aktif (unggahan biasa atau hasil Panorama Stitcher v7). */
  const applyPanorama = async (f: File) => {
    setBusy(true);
    try {
      const r = await storeFile(f, IMAGE_MEDIA, VR_LIMITS.panoramaBytes);
      if ("error" in r) return notify.error(t(`vr.errors.${r.error}`));
      const sid = scene.id;
      const cur = useTourStore.getState().tours.find((x) => x.id === tour.id) ?? tour;
      update({ ...cur, scenes: cur.scenes.map((s) => (s.id === sid ? { ...s, panoramaId: r.id } : s)) });
      cleanupMedia();
      // Panorama equirectangular idealnya 2:1.
      const bmp = await createImageBitmap(f).catch(() => null);
      setAspectWarn(bmp && Math.abs(bmp.width / bmp.height - 2) > 0.1 ? t("vr.scene.aspectWarn", { w: bmp.width, h: bmp.height }) : null);
      bmp?.close();
    } catch {
      notify.error(t("vr.errors.storage"));
    } finally {
      setBusy(false);
    }
  };

  const intake = useFileIntake({ ...PANO_RULES, kinds: [...PANO_RULES.kinds] }, async (files) => {
    const f = files[0]?.file;
    if (f) await applyPanorama(f);
  });

  const place = useCallback(
    (yaw: number, pitch: number) => {
      if (scene.hotspots.length >= vrCap(VR_LIMITS.hotspotsPerScene)) return notify.error(t("vr.hotspot.max", { max: VR_LIMITS.hotspotsPerScene }));
      if (PRO_HOTSPOT_KINDS.includes(placeKind) && !pro) return unlockVrPro();
      const h = createHotspot(placeKind, yaw, pitch, t(`vr.kinds.${placeKind}`));
      if (placeKind === "scene") h.targetSceneId = tour.scenes.find((s) => s.id !== scene.id)?.id;
      if (placeKind === "info") h.text = "";
      update({ ...tour, scenes: tour.scenes.map((s) => (s.id === scene.id ? { ...s, hotspots: [...s.hotspots, h] } : s)) });
      setSelected(h.id);
    },
    [tour, scene, placeKind, pro, t, update],
  );

  const uploadHotspotMedia = async (h: Hotspot, file: File) => {
    const audio = h.kind === "audio";
    setBusy(true);
    try {
      const r = await storeFile(file, audio ? AUDIO_MEDIA : IMAGE_MEDIA, audio ? VR_LIMITS.audioBytes : VR_LIMITS.imageBytes);
      if ("error" in r) return notify.error(t(`vr.errors.${r.error}`));
      updateHotspot(h.id, { mediaId: r.id });
      cleanupMedia();
    } catch {
      notify.error(t("vr.errors.storage"));
    } finally {
      setBusy(false);
    }
  };

  const otherScenes = tour.scenes.filter((s) => s.id !== scene.id);
  const sceneOptions = useMemo(() => tour.scenes.map((s) => ({ value: s.id, label: s.name })), [tour.scenes]);

  return (
    <div className="flex flex-col gap-4" data-testid="vr-editor">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={btn.ghost} onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> {t("vr.editor.back")}
        </button>
        <input className={`${INPUT} max-w-xs font-semibold`} value={tour.name} maxLength={80} aria-label={t("vr.editor.tourName")} onChange={(e) => update({ ...tour, name: e.target.value })} data-testid="vr-tour-name" />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {proUsed.length > 0 && !isDemoMode() && (
            <Chip tone={pro ? "green" : "amber"}>
              <Crown className="h-3 w-3" /> {pro ? t("vr.plan.active") : t("vr.export.needsPro")}
            </Chip>
          )}
          <Link to={`${VR_TOUR_PATH}/pratinjau/${tour.id}`} target="_blank" rel="noopener" className={btn.secondary} title={t("vr.viewer.openHint")} data-testid="vr-open-viewer">
            <ExternalLink className="h-4 w-4" /> {t("vr.viewer.open")}
          </Link>
          <button type="button" className={btn.secondary} onClick={exportSingle} disabled={busy || exporting} title={t("vr.export.singleHint")} data-testid="vr-export-single">
            <FileCode2 className="h-4 w-4" /> {t("vr.export.single")}
          </button>
          <button type="button" className={btn.primary} onClick={exportZip} disabled={busy || exporting} title={t("vr.export.zipHint")} data-testid="vr-export">
            <Download className="h-4 w-4" /> {t("vr.export.button")}
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        {/* Scene */}
        <Panel
          title={t("vr.scene.title", { count: tour.scenes.length })}
          actions={
            <button type="button" className={btn.icon} onClick={addScene} aria-label={t("vr.scene.add")} data-testid="vr-add-scene">
              <Plus className="h-4 w-4" />
            </button>
          }
          bodyClassName="p-3"
        >
          <ul className="flex flex-col gap-1" data-testid="vr-scenes">
            {tour.scenes.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSceneId(s.id);
                    setSelected(null);
                  }}
                  aria-current={s.id === scene.id}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm ${s.id === scene.id ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"}`}
                >
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  {s.id === tour.startSceneId && <Star className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-label={t("vr.scene.start")} />}
                  {!s.panoramaId && <ImagePlus className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-label={t("vr.issues.noPanorama", { scene: s.name })} />}
                </button>
              </li>
            ))}
          </ul>
          {!pro && tour.scenes.length >= VR_LIMITS.freeScenes && <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">{t("vr.scene.freeLimit", { n: VR_LIMITS.freeScenes })}</p>}
          <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
            <Field label={t("vr.scene.name")}>
              <input className={INPUT} value={scene.name} maxLength={60} onChange={(e) => updateScene({ name: e.target.value })} data-testid="vr-scene-name" />
            </Field>
            <Dropzone rules={{ ...PANO_RULES, kinds: [...PANO_RULES.kinds] }} accept="image/jpeg,image/png,image/webp" multiple={false} onFiles={intake.handleFiles} busy={intake.checking || busy} compact title={scene.panoramaId ? t("vr.scene.replacePanorama") : t("vr.scene.uploadPanorama")} testId="vr-pano-drop" />
            {intake.rejectionText && (
              <Notice tone="warn" onDismiss={intake.clearRejected}>
                {intake.rejectionText}
              </Notice>
            )}
            {aspectWarn && (
              <Notice tone="warn" onDismiss={() => setAspectWarn(null)}>
                {aspectWarn}
              </Notice>
            )}
            <p className="text-[11px] text-gray-500">{t("vr.scene.panoramaHint", { mb: VR_LIMITS.panoramaBytes / 1024 / 1024 })}</p>
            <button type="button" className={`${btn.secondary.replace("px-4 py-2.5", "px-3 py-1.5")} justify-center`} onClick={() => setStitchOpen(true)} disabled={busy} data-testid="vr-stitch-open">
              <Wand2 className="h-3.5 w-3.5" /> {t("vr.stitch.open")}
            </button>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btn.secondary.replace("px-4 py-2.5", "px-3 py-1.5")} disabled={scene.id === tour.startSceneId} onClick={() => update({ ...tour, startSceneId: scene.id })}>
                <Star className="h-3.5 w-3.5" /> {t("vr.scene.makeStart")}
              </button>
              <button
                type="button"
                className={btn.icon}
                disabled={tour.scenes.length <= 1}
                aria-label={t("vr.scene.delete")}
                onClick={() => {
                  update(removeScene(tour, scene.id));
                  setSceneId(otherScenes[0]?.id ?? tour.startSceneId);
                  setSelected(null);
                  setTimeout(cleanupMedia, 0);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Panel>

        {/* Pratinjau */}
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              label={t("vr.editor.mode")}
              value={mode}
              onChange={setMode}
              options={[
                { value: "edit", label: <span className="inline-flex items-center gap-1"><MousePointerClick className="h-3.5 w-3.5" /> {t("vr.editor.modeEdit")}</span> },
                { value: "view", label: <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {t("vr.editor.modeView")}</span> },
              ]}
            />
            {mode === "edit" && (
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                {t("vr.editor.placeKind")}
                <select className={`${INPUT} w-auto py-1.5`} value={placeKind} onChange={(e) => setPlaceKind(e.target.value as HotspotKind)} data-testid="vr-place-kind">
                  {HOTSPOT_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {t(`vr.kinds.${k}`)}
                      {PRO_HOTSPOT_KINDS.includes(k) && !pro ? " (Pro)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
            <TourPreview
              tour={tour}
              media={media}
              sceneId={scene.id}
              mode={mode}
              lang={i18n.language}
              title={t("vr.editor.previewTitle")}
              onPlace={place}
              onPick={(id) => setSelected(id)}
            />
            {!scene.panoramaId && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/80">
                <span className="inline-flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2">
                  <Upload className="h-4 w-4" /> {t("vr.editor.noPanorama")}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{mode === "edit" ? t("vr.editor.editHint") : t("vr.editor.viewHint")}</p>
          {issues.length > 0 && (
            <Notice tone="warn" title={t("vr.issues.title")} testId="vr-issues">
              <ul className="list-disc pl-4">
                {issues.slice(0, 6).map((x, i) => (
                  <li key={i}>{t(`vr.issues.${x.key}`, { scene: x.scene, label: x.label })}</li>
                ))}
              </ul>
            </Notice>
          )}
        </div>

        {/* Hotspot */}
        <div className="flex flex-col gap-4">
          <Panel title={t("vr.hotspot.title", { count: scene.hotspots.length })} bodyClassName="p-3">
            {scene.hotspots.length === 0 ? (
              <p className="text-xs text-gray-500">{t("vr.hotspot.empty")}</p>
            ) : (
              <ul className="flex flex-col gap-1" data-testid="vr-hotspots">
                {scene.hotspots.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(h.id)}
                      aria-current={h.id === selected}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs ${h.id === selected ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"}`}
                    >
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase text-gray-600 dark:bg-white/10 dark:text-gray-300">{t(`vr.kinds.${h.kind}`)}</span>
                      <span className="min-w-0 flex-1 truncate">{h.label || "—"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {hotspot && (
            <Panel title={t("vr.hotspot.edit")} bodyClassName="flex flex-col gap-3 p-3">
              <div data-testid="vr-hotspot-form" className="flex flex-col gap-3">
                <Field label={t("vr.hotspot.label")}>
                  <input className={INPUT} value={hotspot.label} maxLength={80} onChange={(e) => updateHotspot(hotspot.id, { label: e.target.value })} data-testid="vr-hs-label" />
                </Field>
                {hotspot.kind === "scene" && (
                  <Field label={t("vr.hotspot.target")} hint={otherScenes.length ? undefined : t("vr.hotspot.needScene")}>
                    <select className={INPUT} value={hotspot.targetSceneId ?? ""} onChange={(e) => updateHotspot(hotspot.id, { targetSceneId: e.target.value || undefined })} data-testid="vr-hs-target">
                      <option value="">{t("vr.hotspot.chooseScene")}</option>
                      {sceneOptions
                        .filter((o) => o.value !== scene.id)
                        .map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                    </select>
                  </Field>
                )}
                {hotspot.kind === "info" && (
                  <Field label={t("vr.hotspot.text")}>
                    <textarea className={INPUT} rows={4} maxLength={1000} value={hotspot.text ?? ""} onChange={(e) => updateHotspot(hotspot.id, { text: e.target.value })} data-testid="vr-hs-text" />
                  </Field>
                )}
                {(hotspot.kind === "image" || hotspot.kind === "audio") && (
                  <Field label={t(`vr.hotspot.${hotspot.kind}File`)} hint={hotspot.mediaId ? mediaMeta[hotspot.mediaId]?.name : t("vr.hotspot.noFile")}>
                    <input
                      type="file"
                      accept={hotspot.kind === "audio" ? "audio/mpeg,audio/wav,audio/ogg" : "image/jpeg,image/png,image/webp"}
                      className="block w-full text-xs"
                      disabled={busy}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) void uploadHotspotMedia(hotspot, f);
                      }}
                    />
                  </Field>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Yaw (°)">
                    <input type="number" className={INPUT} step={1} min={-180} max={180} value={hotspot.yaw} onChange={(e) => updateHotspot(hotspot.id, { yaw: normYaw(Number(e.target.value)) })} />
                  </Field>
                  <Field label="Pitch (°)">
                    <input type="number" className={INPUT} step={1} min={-85} max={85} value={hotspot.pitch} onChange={(e) => updateHotspot(hotspot.id, { pitch: clampPitch(Number(e.target.value)) })} />
                  </Field>
                </div>
                <button
                  type="button"
                  className={btn.ghost}
                  onClick={() => {
                    updateScene({ hotspots: scene.hotspots.filter((h) => h.id !== hotspot.id) });
                    setSelected(null);
                    setTimeout(cleanupMedia, 0);
                  }}
                >
                  <Trash2 className="h-4 w-4" /> {t("vr.hotspot.delete")}
                </button>
              </div>
            </Panel>
          )}

          <Panel title={t("vr.settings.title")} bodyClassName="flex flex-col gap-3 p-3">
            <Toggle checked={tour.autoRotate} onChange={(v) => update({ ...tour, autoRotate: v })} label={t("vr.settings.autoRotate")} hint={t("vr.settings.autoRotateHint")} />
            <ColorField label={t("vr.settings.accent")} value={tour.accent} onChange={(v) => /^#[0-9a-f]{6}$/i.test(v) && update({ ...tour, accent: v })} />
          </Panel>
          <PlanCard />
        </div>
      </div>
      <PanoramaStitcher open={stitchOpen} onClose={() => setStitchOpen(false)} onDone={applyPanorama} />
    </div>
  );
}
