import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Download, ExternalLink, FilePlus2, Github, FileText, Globe, LayoutTemplate, PencilRuler, Rocket, SlidersHorizontal, Sparkles, Trash2 } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import { Link, useLocaleNavigate } from "../../components/app/LocaleLink";
import { Chip, INPUT, Panel, btn } from "../../components/app/ui";
import { notify } from "../../components/app/Toaster";
import { TEMPLATES_PATH, codeEditorPath, studioPath } from "../../config/menu";
import { useDesignStore, type SavedDesign } from "../pageMaker/core/store/designStore";
import { PAGE_DESIGN_TYPE, SITE_TYPE, addPage, createSiteDoc, normalizeSiteDoc } from "../pageMaker/helpers/site";
import { formatDate } from "../pageMaker/core/helpers/formatDate";
import { ensureDesignRoom } from "../pageMaker/helpers/designQuota";
import { ensureSiteRoom } from "../pageMaker/helpers/siteQuota";
import DesignLimitDialog from "../pageMaker/ui/DesignLimitDialog";
import SiteLimitDialog from "../pageMaker/ui/SiteLimitDialog";
import CreditDialog from "../../credits/CreditDialog";
import { homeDesignOf } from "../webTemplates/createFromTemplate";
import { deployKey, removeDeploy, useDeploys } from "../pageMaker/helpers/deployHistory";
import { CODE_SITE_TYPE, normalizeCodeSite } from "../webTemplates/codeTemplates/codeSite";

// The download dialog (jszip + code generator) and the Studio preset data load when used, not when the page opens.
const SiteDownloadDialog = lazy(() => import("../pageMaker/ui/collections/SiteDownloadDialog"));
import { countEdits } from "../webTemplates/codeTemplates/editModel";

/* ================================================================== */
/* "My Websites" (v17): entry point of the Website Builder.              */
/*                                                                    */
/* One flow for every project kind:                                     */
/*   1. Starting point: a template, or start from scratch               */
/*   2. Modify      : Studio (v20: every page in one editor) or         */
/*                    Code template Studio (click to edit)               */
/*   3. Deploy      : the Deploy button in Studio                       */
/* The project list combines website folders and Code Template projects. */
/* ================================================================== */

const EMPTY: SavedDesign[] = [];
const CARD = "rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/40";
const ACTION = "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5";

interface Project {
  kind: "site" | "code";
  item: SavedDesign;
  detail: string;
  edit: string;
  deploy: string;
}

export default function WebsiteHub() {
  const { t } = useTranslation();
  const navigate = useLocaleNavigate();
  const sites = useDesignStore((s) => s.designs[SITE_TYPE]) ?? EMPTY;
  const pages = useDesignStore((s) => s.designs[PAGE_DESIGN_TYPE]) ?? EMPTY;
  const codeSites = useDesignStore((s) => s.designs[CODE_SITE_TYPE]) ?? EMPTY;
  const saveDesign = useDesignStore((s) => s.saveDesign);
  const deleteDesign = useDesignStore((s) => s.deleteDesign);
  const [name, setName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  /** Website being downloaded (Download dialog). */
  const [downloadId, setDownloadId] = useState<string | null>(null);
  const downloadSite = downloadId ? (sites.find((s) => s.id === downloadId) ?? null) : null;

  const projects = useMemo<Project[]>(() => {
    const list: Project[] = [
      ...sites.map((s): Project => {
        const n = normalizeSiteDoc(s.state).pages.length;
        const home = homeDesignOf(s);
        return {
          kind: "site",
          item: s,
          detail: t("hub.siteDetail", { count: n }),
          edit: studioPath(s.id, home ?? undefined),
          deploy: `${studioPath(s.id)}?step=deploy`,
        };
      }),
      ...codeSites.flatMap((c): Project[] => {
        const doc = normalizeCodeSite(c.state);
        if (!doc) return [];
        return [
          {
            kind: "code",
            item: c,
            detail: t("hub.codeDetail", { name: t(`templates.items.${doc.templateId}.name`, { defaultValue: doc.templateId }), count: countEdits(doc.edits) }),
            edit: codeEditorPath(c.id),
            deploy: `${codeEditorPath(c.id)}?step=deploy`,
          },
        ];
      }),
    ];
    return list.sort((a, b) => b.item.updatedAt - a.item.updatedAt);
  }, [sites, codeSites, t]);

  /** v20: old page designs not yet in any website. */
  const loosePages = useMemo(() => {
    const used = new Set(sites.flatMap((s) => normalizeSiteDoc(s.state).pages.map((p) => p.designId)));
    return pages.filter((d) => !used.has(d.id)).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [sites, pages]);

  const makeSiteNow = (page: SavedDesign) => {
    const id = saveDesign(SITE_TYPE, page.name, addPage(createSiteDoc(), page));
    notify.success(t("hub.madeSite", { name: page.name }));
    navigate(studioPath(id, page.id));
  };
  const makeSite = (page: SavedDesign) => {
    if (!ensureSiteRoom({ reason: "create", label: page.name, onRoom: () => makeSiteNow(page) })) return;
    makeSiteNow(page);
  };
  const deploys = useDeploys();
  const removeProject = (p: Project) => {
    // Website: only its folder is deleted; its page designs appear again under "Loose page designs".
    deleteDesign(p.kind === "site" ? SITE_TYPE : CODE_SITE_TYPE, p.item.id);
    removeDeploy(deployKey(p.kind, p.item.id));
    setConfirmDelete(null);
  };

  /** Start from scratch: a website folder + one empty "Beranda" page → straight to the editor. */
  const startBlankNow = async () => {
    const { createDefaultPageDoc } = await import("../pageMaker/helpers/pageDoc");
    const st = useDesignStore.getState();
    const siteName = name.trim() || t("website.defaultName", { n: (st.designs[SITE_TYPE]?.length ?? 0) + 1 });
    const pageId = saveDesign(PAGE_DESIGN_TYPE, t("hub.homePage"), createDefaultPageDoc());
    const page = useDesignStore.getState().designs[PAGE_DESIGN_TYPE]?.find((d) => d.id === pageId);
    const siteId = saveDesign(SITE_TYPE, siteName, page ? addPage(createSiteDoc(), page) : createSiteDoc());
    setName("");
    notify.success(t("hub.blankCreated", { name: siteName }));
    navigate(studioPath(siteId, pageId));
  };
  const startBlank = () => {
    if (!ensureDesignRoom(1, "save", { label: t("hub.homePage"), onRoom: startBlank })) return;
    if (!ensureSiteRoom({ reason: "create", label: name.trim(), onRoom: () => void startBlankNow() })) return;
    void startBlankNow();
  };

  const steps = [
    { icon: LayoutTemplate, title: t("hub.steps.1.title"), text: t("hub.steps.1.text") },
    { icon: PencilRuler, title: t("hub.steps.2.title"), text: t("hub.steps.2.text") },
    { icon: Rocket, title: t("hub.steps.3.title"), text: t("hub.steps.3.text") },
  ];

  return (
    <>
      <AppMeta title={t("hub.metaTitle")} description={t("hub.description")} />
      <div className="flex flex-col gap-5" data-testid="website-hub">
        <PageHeader icon={Rocket} title={t("hub.title")} description={t("hub.description")} crumbs={[{ label: t("nav.sections.web-maker.name") }, { label: t("hub.title") }]} help="website" />

        {/* -------- alur 3 langkah -------- */}
        <ol className="grid gap-3 md:grid-cols-3" aria-label={t("flow.aria")} data-testid="hub-steps">
          {steps.map((s, i) => (
            <li key={i} className={`${CARD} relative flex gap-3`}>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-700 dark:text-brand-300">{t("hub.stepN", { n: i + 1 })}</p>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">{s.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{s.text}</p>
              </div>
              {i < 2 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-white text-gray-300 md:block dark:bg-gray-950" aria-hidden />}
            </li>
          ))}
        </ol>

        {/* -------- start -------- */}
        <Panel title={t("hub.startTitle")} description={t("hub.startHint")}>
          <div className="grid gap-3 md:grid-cols-2">
            <Link to={TEMPLATES_PATH} className="group flex flex-col gap-2 rounded-2xl border-2 border-brand-200 bg-brand-50/50 p-4 hover:border-brand-500 dark:border-brand-500/30 dark:bg-brand-500/5" data-testid="hub-start-template">
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/90">
                <Sparkles className="h-5 w-5 text-brand-600" /> {t("hub.fromTemplate")}
                <Chip tone="blue">{t("hub.recommended")}</Chip>
              </span>
              <span className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{t("hub.fromTemplateText")}</span>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-700 group-hover:underline dark:text-brand-300">
                {t("hub.browse")} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <div className="flex flex-col gap-2 rounded-2xl border-2 border-gray-200 p-4 dark:border-gray-800">
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/90">
                <FilePlus2 className="h-5 w-5 text-gray-500" /> {t("hub.blank")}
              </span>
              <span className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{t("hub.blankText")}</span>
              <div className="mt-auto flex gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && startBlank()} placeholder={t("hub.blankPlaceholder")} aria-label={t("website.newLabel")} className={`${INPUT} min-w-0 !py-1.5`} />
                <button type="button" onClick={startBlank} className={`${btn.primary} shrink-0 !px-3 !py-1.5`} data-testid="hub-start-blank">
                  {t("hub.blankCta")}
                </button>
              </div>
            </div>
          </div>
        </Panel>

        {/* -------- proyek -------- */}
        <Panel title={t("hub.projects", { count: projects.length })} description={t("hub.projectsHint")}>
          {projects.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400" data-testid="hub-empty">
              {t("hub.empty")}
            </p>
          ) : (
            <ul className="flex flex-col gap-2" data-testid="hub-projects">
              {projects.map((p) => (
                <li key={`${p.kind}:${p.item.id}`} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 dark:border-gray-800" data-testid="hub-project">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    {p.kind === "site" ? <Globe className="h-4.5 w-4.5" /> : <SlidersHorizontal className="h-4.5 w-4.5" />}
                  </span>
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{p.item.name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {p.kind === "site" ? t("hub.kindSite") : t("hub.kindCode")} · {p.detail} · {formatDate(p.item.updatedAt)}
                    </p>
                    {deploys[deployKey(p.kind, p.item.id)] && (() => {
                      const d = deploys[deployKey(p.kind, p.item.id)];
                      return (
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs" data-testid="hub-deployed">
                          <Chip tone="green">{t("hub.deployed", { date: formatDate(Date.parse(d.at)) })}</Chip>
                          <a href={d.pagesUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-center gap-1 truncate font-medium text-brand-700 hover:underline dark:text-brand-300">
                            <ExternalLink className="h-3 w-3 shrink-0" /> <span className="truncate">{d.pagesUrl.replace(/^https:\/\//, "")}</span>
                          </a>
                          <a href={d.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gray-500 hover:underline dark:text-gray-400">
                            <Github className="h-3 w-3" /> {d.owner}/{d.repo}
                          </a>
                        </p>
                      );
                    })()}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link to={p.edit} className={ACTION}>
                      <PencilRuler className="h-3.5 w-3.5" /> {t("hub.edit")}
                    </Link>
                    {p.kind === "site" && (
                      <button type="button" className={ACTION} onClick={() => setDownloadId(p.item.id)} data-testid="hub-download-open">
                        <Download className="h-3.5 w-3.5" /> {t("hub.download.button")}
                      </button>
                    )}
                    <Link to={p.deploy} className={`${ACTION} !border-brand-600 !text-brand-700 dark:!text-brand-300`}>
                      <Rocket className="h-3.5 w-3.5" /> {t(deploys[deployKey(p.kind, p.item.id)] ? "hub.redeploy" : "hub.deploy")}
                    </Link>
                    {confirmDelete === p.item.id ? (
                        <span className="flex items-center gap-1 text-xs">
                          <button type="button" className="rounded bg-rose-600 px-2 py-1 font-semibold text-white" onClick={() => removeProject(p)}>
                            {t("common.delete")}
                          </button>
                          <button type="button" className="px-1.5 py-1 text-gray-500" onClick={() => setConfirmDelete(null)}>
                            {t("common.cancel")}
                          </button>
                        </span>
                      ) : (
                        <button type="button" className={btn.icon} aria-label={t("website.deleteAria", { name: p.item.name })} onClick={() => setConfirmDelete(p.item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {loosePages.length > 0 && (
          <Panel title={t("hub.loosePages", { count: loosePages.length })} description={t("hub.loosePagesHint")}>
            <ul className="flex flex-col gap-2" data-testid="hub-loose-pages">
              {loosePages.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-gray-300 px-3 py-2 dark:border-gray-700">
                  <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-200">{d.name}</span>
                  <span className="text-xs text-gray-400">{formatDate(d.updatedAt)}</span>
                  <button type="button" className={ACTION} onClick={() => makeSite(d)}>
                    <Globe className="h-3.5 w-3.5" /> {t("hub.makeSite")}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
      {downloadSite && (
        <Suspense fallback={null}>
          <SiteDownloadDialog site={downloadSite} designs={pages} onClose={() => setDownloadId(null)} />
        </Suspense>
      )}
      <CreditDialog />
      <DesignLimitDialog />
      <SiteLimitDialog />
    </>
  );
}
