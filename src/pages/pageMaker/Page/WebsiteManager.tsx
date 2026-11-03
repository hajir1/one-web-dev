import { useComposeVars } from "../core/hooks/useGlobalVars";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { Link } from "../../../components/app/LocaleLink";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Code2,
  ExternalLink,
  Eye,
  FolderPlus,
  Globe,
  Home,
  LayoutTemplate,
  Monitor,
  Pencil,
  Plus,
  Smartphone,
  Tablet,
  Trash2,
  X,
} from "lucide-react";
import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import FlowSteps from "../../../components/app/FlowSteps";
import { Chip } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import { TEMPLATES_PATH } from "../../../config/menu";
import { useMaxDesigns, usePremiumElementsFor, useSiteLimit, limitText } from "../../../marketplace/hooks";
import CodeExportPanel from "../core/ui/CodeExportPanel";
import { useIconLookup } from "../core/hooks/useElementOutput";
import { useFontStore } from "../core/store/fontStore";
import { useLibraryFonts } from "../core/hooks/useLibraryFonts";
import { baseFontStack } from "../core/helpers/fontCss";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import { formatDate } from "../core/helpers/formatDate";
import type { Framework } from "../core/helpers/generatorCss";
import {
  PAGE_DESIGN_TYPE,
  SITE_TYPE,
  addPage,
  createSiteDoc,
  movePage,
  normalizeSiteDoc,
  removePage,
  replacePage,
  resolvePages,
  setHomepage,
  setLabel,
  setSlug,
  type SiteDoc,
} from "../helpers/site";
import { buildSite } from "../helpers/siteExport";
import { COMPOSITION_TYPE, mergeComposition, normalizeComposition } from "../helpers/composer";
import PagePreview from "../ui/PagePreview";
import CreditDialog from "../../../credits/CreditDialog";
import { ensureDesignRoom } from "../helpers/designQuota";
import DesignLimitDialog from "../ui/DesignLimitDialog";
import SiteLimitDialog from "../ui/SiteLimitDialog";
import SiteSeoPanel from "../ui/SiteSeoPanel";
import { ensureSiteRoom } from "../helpers/siteQuota";

/* ================================================================== */
/* Website — kelola Folder Website (satu folder = satu website)          */
/*   - halaman = referensi ke desain Page Maker (tidak disalin)          */
/*   - urutan, homepage, slug URL, label menu                            */
/*   - pratinjau dengan navigasi antarhalaman & ekspor satu proyek        */
/* Perubahan folder langsung tersimpan (localStorage).                  */
/* ================================================================== */

const EMPTY: SavedDesign[] = [];
const VIEWPORTS = [
  { id: "desktop", width: null, icon: Monitor },
  { id: "tablet", width: 768, icon: Tablet },
  { id: "mobile", width: 375, icon: Smartphone },
] as const;
const CARD = "rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3";
const ICON_BTN =
  "inline-flex h-7 w-7 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white";
const INPUT =
  "w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

/** Input yang menyimpan saat Enter / kehilangan fokus. */
function CommitInput({
  value,
  onCommit,
  placeholder,
  label,
  error,
  prefix,
}: {
  value: string;
  onCommit: (v: string) => void;
  placeholder?: string;
  label: string;
  error?: string | null;
  prefix?: string;
}) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1">
        {prefix && <span className="text-xs text-gray-400">{prefix}</span>}
        <input
          value={v}
          aria-label={label}
          placeholder={placeholder}
          onChange={(e) => setV(e.target.value)}
          onBlur={() => v !== value && onCommit(v)}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className={`${INPUT} ${error ? "border-rose-500" : ""}`}
        />
      </div>
      {error && (
        <p role="alert" className="mt-0.5 text-[11px] text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function WebsiteManager() {
  const { t } = useTranslation();
  const designs = useDesignStore((s) => s.designs[PAGE_DESIGN_TYPE]) ?? EMPTY;
  const sites = useDesignStore((s) => s.designs[SITE_TYPE]) ?? EMPTY;
  const legacy = useDesignStore((s) => s.designs[COMPOSITION_TYPE]) ?? EMPTY;
  const saveDesign = useDesignStore((s) => s.saveDesign);
  const updateDesign = useDesignStore((s) => s.updateDesign);
  const renameDesign = useDesignStore((s) => s.renameDesign);
  const deleteDesign = useDesignStore((s) => s.deleteDesign);

  const icons = useIconLookup();
  const fonts = useFontStore((st) => st.fonts);
  const baseFont = useFontStore((st) => baseFontStack(st.fonts, st.baseFontId));
  const globalVars = useComposeVars();
  useLibraryFonts();

  // v17: ?site=<id> memilih folder; &step=deploy langsung membuka tab Kode + dialog Deploy.
  const [params, setParams] = useSearchParams();
  const [autoDeploy] = useState(() => params.get("step") === "deploy");
  const [selectedId, setSelectedIdState] = useState<string | null>(() => params.get("site"));
  const setSelectedId = (id: string | null) => {
    setSelectedIdState(id);
    if (params.has("site") || params.has("step")) setParams({}, { replace: true });
  };
  const site = sites.find((s) => s.id === selectedId) ?? sites[0] ?? null;
  const doc: SiteDoc = useMemo(() => (site ? normalizeSiteDoc(site.state) : createSiteDoc()), [site]);
  const pages = useMemo(() => resolvePages(doc, designs), [doc, designs]);

  const [newName, setNewName] = useState("");
  const [slugError, setSlugError] = useState<{ id: string; msg: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tab, setTab] = useState<"preview" | "code">(autoDeploy ? "code" : "preview");
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]["id"]>("desktop");
  const [framework, setFramework] = useState<Framework>("html");
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => setConfirmDelete(false), [site?.id]);

  const MAX_DESIGNS = useMaxDesigns();
  // Elemen Premium ikut di pratinjau/ekspor bila dimiliki, atau disertakan template asal halaman itu.
  const premiumFor = usePremiumElementsFor();
  const built = useMemo(
    () => (site ? buildSite(site, designs, { icons, fonts, baseFont, vars: globalVars, allowPremiumElementsFor: premiumFor }) : null),
    [site, designs, icons, fonts, baseFont, globalVars, premiumFor],
  );
  const shown = built?.pages.find((p) => p.designId === currentPage) ?? built?.home ?? built?.pages[0] ?? null;
  const files = useMemo(() => (built ? built.files(framework) : []), [built, framework]);
  const vpWidth = VIEWPORTS.find((v) => v.id === viewport)!.width;

  const save = (next: SiteDoc) => site && updateDesign(SITE_TYPE, site.id, next);

  /** Batas folder website: FREE_SITES gratis + slot tambahan (server atau paket simulasi). */
  const siteLimit = useSiteLimit();

  const createSiteNow = () => {
    const current = useDesignStore.getState().designs[SITE_TYPE]?.length ?? 0;
    const name = newName.trim() || t("website.defaultName", { n: current + 1 });
    const id = saveDesign(SITE_TYPE, name, createSiteDoc());
    setSelectedId(id);
    setNewName("");
    notify.success(t("website.created", { name }));
  };

  /** Kuota penuh → dialog: bayar slot website atau hapus website lama. */
  const createSite = () => {
    if (!ensureSiteRoom({ reason: "create", label: newName.trim(), onRoom: createSiteNow })) return;
    createSiteNow();
  };

  const convertLegacy = (c: SavedDesign) => {
    if (!ensureDesignRoom(1, "convert", { label: c.name, onRoom: () => convertLegacy(c) })) return;
    const merged = mergeComposition(normalizeComposition(c.state));
    saveDesign(PAGE_DESIGN_TYPE, t("website.legacy.convertedName", { name: c.name }), { version: 2, root: merged.root });
    setNotice(t("website.legacy.converted", { name: c.name }));
  };

  const onDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (dragId) save(movePage(doc, dragId, index));
    setDragId(null);
  };

  return (
    <>
      <AppMeta title={t("website.metaTitle")} description={t("website.metaDescription")} />
      <div className="flex flex-col gap-5" data-testid="website-manager">
        <FlowSteps current={3} to={{ 2: "/page-maker" }} />
        <PageHeader
          icon={Globe}
          title={t("website.title")}
          description={t("website.description")}
          crumbs={[{ label: t("nav.sections.web-maker.name") }, { label: t("website.title") }]}
          help="website"
          chips={
            <span data-testid="site-quota" className="flex flex-wrap gap-1.5">
              <Chip tone={sites.length >= siteLimit ? "amber" : "blue"}>{t("website.quotaSites", { current: sites.length, max: limitText(siteLimit) })}</Chip>
              <Chip tone={designs.length >= MAX_DESIGNS ? "amber" : "gray"}>{t("website.quotaDesigns", { current: designs.length, max: limitText(MAX_DESIGNS) })}</Chip>
            </span>
          }
          actions={
            <Link to={TEMPLATES_PATH} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5">
              <LayoutTemplate className="h-4 w-4" /> {t("website.fromTemplate")}
            </Link>
          }
        />

        {notice && (
          <p role="status" className="flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-800 dark:bg-green-500/10 dark:text-green-300">
            <span className="flex-1">{notice}</span>
            <button type="button" aria-label={t("common.close")} onClick={() => setNotice(null)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </p>
        )}

        <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-5">
            {/* ---------------- folder ---------------- */}
            <section className={CARD} aria-labelledby="ws-folders">
              <h2 id="ws-folders" className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                {t("website.folders", { count: sites.length })}
              </h2>
              <ul className="mb-3 flex flex-col gap-1.5" data-testid="site-list">
                {sites.map((s) => {
                  const n = normalizeSiteDoc(s.state).pages.length;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(s.id)}
                        aria-pressed={site?.id === s.id}
                        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                          site?.id === s.id
                            ? "border-blue-700 bg-blue-50 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-white/5"
                        }`}
                      >
                        <Globe className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 flex-1 truncate font-medium">{s.name}</span>
                        <span className="text-[11px] text-gray-400">{t("website.pagesCount", { count: n })}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createSite()}
                  placeholder={t("website.newPlaceholder")}
                  aria-label={t("website.newLabel")}
                  className={INPUT}
                />
                <button
                  type="button"
                  onClick={createSite}
                  data-testid="create-site"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
                >
                  <FolderPlus className="h-3.5 w-3.5" /> {t("website.create")}
                </button>
              </div>
              {sites.length >= siteLimit && (
                <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-400" data-testid="site-limit-note">
                  {t("website.limitNote", { max: limitText(siteLimit) })}
                </p>
              )}
            </section>

            {/* ---------------- desain tersimpan ---------------- */}
            <section className={CARD} aria-labelledby="ws-designs">
              <h2 id="ws-designs" className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                {t("website.designs", { current: designs.length, max: limitText(MAX_DESIGNS) })}
              </h2>
              {designs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("website.noDesigns")}{" "}
                  <Link to="/page-maker" className="font-semibold text-brand-700 underline dark:text-brand-300">
                    Page Maker
                  </Link>{" "}
                  · <Link to={TEMPLATES_PATH} className="font-semibold text-brand-700 underline dark:text-brand-300">{t("website.fromTemplate")}</Link>
                </p>
              ) : (
                <ul className="flex flex-col gap-2" data-testid="ws-design-list">
                  {designs.map((d) => {
                    const inSite = doc.pages.some((p) => p.designId === d.id);
                    return (
                      <li key={d.id} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{d.name}</p>
                          <p className="text-[11px] text-gray-400">{formatDate(d.updatedAt)}</p>
                        </div>
                        <Link to={`/page-maker?design=${encodeURIComponent(d.id)}`} className={ICON_BTN} aria-label={t("website.openInEditor", { name: d.name })} title={t("website.openInEditor", { name: d.name })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          disabled={!site || inSite}
                          onClick={() => save(addPage(doc, d))}
                          aria-label={t("website.addToSite", { name: d.name })}
                          title={!site ? t("website.needFolder") : inSite ? t("website.alreadyIn") : t("website.addToFolder")}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" /> {inSite ? t("website.added") : t("website.add")}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* ---------------- migrasi Page Composer ---------------- */}
            {legacy.length > 0 && (
              <section className={CARD} aria-labelledby="ws-legacy" data-testid="legacy-compositions">
                <h2 id="ws-legacy" className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                  {t("website.legacy.title", { count: legacy.length })}
                </h2>
                <p className="mb-3 text-[11px] text-gray-500 dark:text-gray-400">
                  {t("website.legacy.text")}
                </p>
                <ul className="flex flex-col gap-2">
                  {legacy.map((c) => (
                    <li key={c.id} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
                      <span className="min-w-0 flex-1 truncate text-sm">{c.name}</span>
                      <button type="button" onClick={() => convertLegacy(c)} className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300">
                        {t("website.legacy.convert")}
                      </button>
                      <button type="button" className={ICON_BTN} aria-label={t("website.deleteAria", { name: c.name })} onClick={() => deleteDesign(COMPOSITION_TYPE, c.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* ---------------- detail folder ---------------- */}
          {!site ? (
            <section className={`${CARD} flex min-h-80 flex-col items-center justify-center gap-2 text-center`}>
              <Globe className="h-8 w-8 text-blue-600" />
              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{t("website.emptyTitle")}</p>
              <p className="max-w-sm text-xs text-gray-500 dark:text-gray-400">{t("website.emptyText")}</p>
            </section>
          ) : (
            <div className="flex min-w-0 flex-col gap-5">
              <section className={CARD} aria-label={t("website.settings")} data-testid="site-detail">
                <div className="mb-3 flex flex-wrap items-end gap-2">
                  <div className="min-w-48 flex-1">
                    <p className="mb-1 text-xs text-gray-500">{t("website.name")}</p>
                    <CommitInput label={t("website.name")} value={site.name} onCommit={(v) => v.trim() && renameDesign(SITE_TYPE, site.id, v)} />
                  </div>
                  {confirmDelete ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-rose-600">{t("website.deleteConfirm")}</span>
                      <button
                        type="button"
                        onClick={() => {
                          deleteDesign(SITE_TYPE, site.id);
                          setSelectedId(null);
                        }}
                        className="rounded bg-rose-600 px-2 py-1 font-semibold text-white"
                      >
                        {t("common.delete")}
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(false)} className="px-2 py-1 text-gray-500">
                        {t("common.cancel")}
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs text-gray-500 hover:text-rose-600">
                      <Trash2 className="h-3.5 w-3.5" /> {t("website.deleteFolder")}
                    </button>
                  )}
                </div>

                <h2 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">{t("website.pages", { count: pages.length })}</h2>
                <p className="mb-2 text-[11px] text-gray-500 dark:text-gray-400">
                  {t("website.pagesHint")}
                </p>
                {pages.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-gray-300 px-3 py-6 text-center text-sm text-gray-400 dark:border-gray-700">
                    {t("website.folderEmpty")}
                  </p>
                ) : (
                  <ol className="flex flex-col gap-2" data-testid="site-pages">
                    {pages.map((p, i) => (
                      <li
                        key={p.designId}
                        draggable
                        onDragStart={() => setDragId(p.designId)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDrop(e, i)}
                        onDragEnd={() => setDragId(null)}
                        data-testid="site-page"
                        className={`rounded-lg border px-3 py-2 ${dragId === p.designId ? "border-blue-500 opacity-60" : "border-gray-200 dark:border-gray-800"} ${
                          p.design ? "" : "bg-rose-50 dark:bg-rose-500/10"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-5 shrink-0 text-xs font-semibold text-gray-400">{i + 1}</span>
                          <label className="inline-flex items-center gap-1 text-xs" title={t("website.makeHome")}>
                            <input
                              type="radio"
                              name={`home-${site.id}`}
                              checked={p.isHome}
                              disabled={!p.design}
                              onChange={() => save(setHomepage(doc, p.designId))}
                              aria-label={t("website.makeHomeAria", { name: p.title })}
                            />
                            <Home className={`h-3.5 w-3.5 ${p.isHome ? "text-blue-700" : "text-gray-300"}`} />
                          </label>
                          <div className="min-w-32 flex-1">
                            <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                              {p.design ? p.design.name : t("website.designDeleted")}
                              {p.isHome && <span className="ml-1.5 text-[10px] font-semibold text-blue-700">HOMEPAGE</span>}
                            </p>
                          </div>
                          <button type="button" className={ICON_BTN} aria-label={t("website.moveUp")} disabled={i === 0} onClick={() => save(movePage(doc, p.designId, i - 1))}>
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className={ICON_BTN} aria-label={t("website.moveDown")} disabled={i === pages.length - 1} onClick={() => save(movePage(doc, p.designId, i + 1))}>
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          {p.design && (
                            <Link to={`/page-maker?design=${encodeURIComponent(p.designId)}`} className={ICON_BTN} aria-label={t("website.openInEditor", { name: p.title })} title={t("website.openInEditor", { name: p.title })}>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          <button
                            type="button"
                            className={ICON_BTN}
                            aria-label={t("website.removeAria", { name: p.title })}
                            title={t("website.removeHint")}
                            onClick={() => save(removePage(doc, p.designId))}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {p.design ? (
                          <div className="mt-2 grid gap-2 pl-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                            <CommitInput label={t("website.menuLabel", { name: p.title })} value={p.label ?? ""} placeholder={p.design.name} onCommit={(v) => save(setLabel(doc, p.designId, v))} />
                            <CommitInput
                              label={t("website.slugLabel", { name: p.title })}
                              prefix="/"
                              value={p.slug}
                              error={slugError?.id === p.designId ? slugError.msg : null}
                              onCommit={(v) => {
                                const r = setSlug(doc, p.designId, v);
                                setSlugError(r.code ? { id: p.designId, msg: t(`website.slug.${r.code}`) } : null);
                                if (!r.error) save(r.doc);
                              }}
                            />
                            <select
                              value=""
                              aria-label={t("website.replaceAria", { name: p.title })}
                              onChange={(e) => {
                                const d = designs.find((x) => x.id === e.target.value);
                                if (d) save(replacePage(doc, p.designId, d));
                              }}
                              className="rounded border border-gray-300 bg-white px-1.5 py-1 text-xs dark:border-gray-700 dark:bg-gray-900"
                            >
                              <option value="">{t("website.replace")}</option>
                              {designs
                                .filter((d) => !doc.pages.some((x) => x.designId === d.id))
                                .map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ) : (
                          <p className="mt-1 pl-7 text-[11px] text-rose-600">{t("website.sourceDeleted")}</p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              {/* ---------------- SEO (v10) ---------------- */}
              <SiteSeoPanel siteName={site.name} doc={doc} pages={pages} onChange={save} />

              {/* ---------------- pratinjau / kode ---------------- */}
              <section className={`${CARD} flex min-w-0 flex-col gap-3`} aria-label={t("website.previewLabel")}>
                <div className="flex flex-wrap items-center gap-2">
                  <div role="tablist" className="flex gap-0.5 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
                    {(
                      [
                        ["preview", t("website.tabPreview"), Eye],
                        ["code", t("website.tabCode"), Code2],
                      ] as const
                    ).map(([id, label, Icon]) => (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={tab === id}
                        onClick={() => setTab(id)}
                        className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold ${
                          tab === id ? "bg-blue-800 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                  {tab === "preview" && (
                    <div className="flex gap-0.5 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700" role="group" aria-label={t("website.viewport")}>
                      {VIEWPORTS.map(({ id, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          aria-label={t(`website.vp.${id}`)}
                          aria-pressed={viewport === id}
                          onClick={() => setViewport(id)}
                          className={`inline-flex h-7 w-8 items-center justify-center rounded-md ${
                            viewport === id ? "bg-blue-800 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {built && built.warnings.length > 0 && (
                  <ul role="status" data-testid="site-warnings" className="flex flex-col gap-1 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                    {built.warnings.slice(0, 8).map((w, i) => (
                      <li key={i} className="flex gap-1.5">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {w}
                      </li>
                    ))}
                  </ul>
                )}

                {tab === "preview" ? (
                  <>
                    {built && built.pages.length > 0 && (
                      <nav aria-label={t("website.previewPages")} className="flex flex-wrap gap-1.5" data-testid="preview-pages">
                        {built.pages.map((p) => (
                          <button
                            key={p.designId}
                            type="button"
                            aria-pressed={shown?.designId === p.designId}
                            onClick={() => setCurrentPage(p.designId)}
                            className={`rounded-full border px-2.5 py-0.5 text-xs ${
                              shown?.designId === p.designId
                                ? "border-blue-800 bg-blue-800 text-white"
                                : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {p.isHome && <Home className="mr-1 inline h-3 w-3" />}
                            {p.title} <span className="opacity-60">{p.isHome ? "/" : `/${p.slug}`}</span>
                          </button>
                        ))}
                      </nav>
                    )}
                    <div className="h-[70vh] min-h-80 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                      {shown ? (
                        <PagePreview
                          css={shown.composed.html.css}
                          body={shown.composed.html.body}
                          script={shown.composed.html.script}
                          libraries={shown.composed.libraries}
                          viewportWidth={vpWidth}
                          onNavigate={(id) => setCurrentPage(id)}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">{t("website.previewEmpty")}</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3" data-testid="site-code">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {t("website.codeHint")}
                    </p>
                    <CodeExportPanel framework={framework} onFrameworkChange={setFramework} files={files} zipBaseName={`website-${site.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")} codeMaxHeightClass="max-h-[50vh]" source={{ kind: "site", id: site.id }} unlimited autoDeploy={autoDeploy} />
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
      <CreditDialog />
      <DesignLimitDialog />
      <SiteLimitDialog />
    </>
  );
}
