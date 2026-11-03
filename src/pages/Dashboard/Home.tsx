import { useTranslation } from "react-i18next";
import { ArrowUpRight, BookOpen, Coins, LayoutTemplate, ShieldCheck, Sparkles } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import { Link } from "../../components/app/LocaleLink";
import { CREDITS_PATH, DOCS_PATH, GLOBAL_SETTING_PATH, TEMPLATES_PATH, visibleMenuSections, type MenuLeaf, type MenuSection } from "../../config/menu";
import { isDemoMode } from "../../demo/demoMode";
import DemoPromo from "./DemoPromo";
import { useMaxDesigns, useSiteLimit, limitText } from "../../marketplace/hooks";
import { useIconStore } from "../pageMaker/core/store/iconStore";
import { useFontStore } from "../pageMaker/core/store/fontStore";
import { useDesignStore } from "../pageMaker/core/store/designStore";

/** Info singkat di bawah deskripsi sebuah menu (hanya untuk menu tertentu). */
function useLeafMeta(): (leaf: MenuLeaf) => string | null {
  const { t } = useTranslation();
  const iconCount = useIconStore((s) => s.icons.length);
  const fontCount = useFontStore((s) => s.fonts.length);
  return (leaf) => (leaf.path === GLOBAL_SETTING_PATH ? t("home.libraryMeta", { icons: iconCount, fonts: fontCount }) : null);
}

const SECTION_TILE: Record<MenuSection["id"], string> = {
  data: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  media: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  "web-maker": "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  vr: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
};

function SectionCard({ section, meta }: { section: MenuSection; meta: (leaf: MenuLeaf) => string | null }) {
  const { t } = useTranslation();
  const Icon = section.icon;
  return (
    <section aria-labelledby={`dash-${section.id}`} className="ow-card flex flex-col p-5" data-testid={`home-section-${section.id}`}>
      <div className="flex items-start gap-3.5">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${SECTION_TILE[section.id]}`}>
          <Icon size={22} />
        </span>
        <div className="min-w-0">
          <h2 id={`dash-${section.id}`} className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {t(`nav.sections.${section.id}.name`)}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{t(`nav.sections.${section.id}.description`)}</p>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-1.5">
        {section.items.map((leaf) => {
          const LeafIcon = leaf.icon;
          const info = meta(leaf);
          return (
            <li key={leaf.path}>
              <Link
                to={leaf.path}
                className="group flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-25 focus-visible:outline-2 focus-visible:outline-brand-600 dark:border-gray-800 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
              >
                <LeafIcon size={16} className="shrink-0 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-300" />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white/90">
                    {t(`nav.items.${leaf.key}.name`)}
                    {leaf.new && (
                      <span className="rounded-full bg-brand-100 px-1.5 py-px text-[10px] font-bold uppercase text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">
                        {t("common.new")}
                      </span>
                    )}
                    {leaf.credit && (
                      <span title={t("nav.usesCredits")} className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-px text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                        <Coins className="h-2.5 w-2.5" /> {t("home.credit")}
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{info ?? t(`nav.items.${leaf.key}.description`)}</span>
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-300"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Meter({ label, value, max, testId }: { label: string; value: number; max: number; testId?: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const full = value >= max;
  return (
    <div className="min-w-0" data-testid={testId}>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
        <span className={`font-mono font-semibold ${full ? "text-amber-700 dark:text-amber-300" : "text-gray-800 dark:text-gray-100"}`}>
          {value}/{limitText(max)}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10" role="presentation">
        <div className={`h-full rounded-full ${full ? "bg-amber-500" : "bg-brand-500"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const meta = useLeafMeta();
  const pages = useDesignStore((s) => s.designs.page?.length ?? 0);
  const maxDesigns = useMaxDesigns();
  const sites = useDesignStore((s) => s.designs.site?.length ?? 0);
  const siteLimit = useSiteLimit();
  const demo = isDemoMode();

  // Mode demo (v15): hanya banner promosi, tanpa daftar menu dan kuota.
  if (demo)
    return (
      <>
        <AppMeta title={t("home.metaTitle")} description={t("app.description")} />
        <DemoPromo />
      </>
    );

  return (
    <>
      <AppMeta title={t("home.metaTitle")} description={t("app.description")} />
      <div className="flex flex-col gap-6">
        <header className="ow-card ow-hero relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10" data-testid="home-hero">
          <div aria-hidden className="ow-grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
                <Sparkles className="h-3.5 w-3.5" /> {t("home.badge")}
              </p>
              <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">{t("home.title")}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">{t("home.subtitle")}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to={TEMPLATES_PATH} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700">
                  <LayoutTemplate className="h-4 w-4" /> {t("home.ctaTemplates")}
                </Link>
                <Link
                  to={DOCS_PATH}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
                >
                  <BookOpen className="h-4 w-4" /> {t("home.ctaDocs")}
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur dark:border-gray-700 dark:bg-gray-900/60" data-testid="home-quota">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("home.quotaTitle")}</p>
              <div className="mt-3 flex flex-col gap-3">
                <Meter label={t("home.quotaDesigns")} value={pages} max={maxDesigns} testId="quota-designs" />
                <Meter label={t("home.quotaSites")} value={sites} max={siteLimit} testId="quota-sites" />
              </div>
              <Link to={CREDITS_PATH} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300">
                <Coins className="h-3.5 w-3.5" /> {t("home.quotaMore")}
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {visibleMenuSections().map((section) => (
            <SectionCard key={section.id} section={section} meta={meta} />
          ))}
        </div>

        <p className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {t("home.privacy")}
        </p>
      </div>
    </>
  );
}
