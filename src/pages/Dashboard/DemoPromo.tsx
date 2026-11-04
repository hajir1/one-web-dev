import { useTranslation } from "react-i18next";
import { ArrowRight, Check, Database, Glasses, Globe, Image, LayoutTemplate, PanelsTopLeft, Rocket, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "../../components/app/LocaleLink";
import { TEMPLATES_PATH, VR_TOUR_PATH } from "../../config/menu";
import { DEMO_TEMPLATE_COUNT } from "../../demo/demoTemplateIds";

/* ================================================================== */
/* Dashboard mode demo (v15): banner promosi OneWebDev,        */
/* replaces the menu list and quota cards.                              */
/* ================================================================== */

const PAGE_MAKER_PATH = "/page-maker";

interface Highlight {
  key: "web" | "data" | "media" | "vr";
  icon: LucideIcon;
  path: string;
  tone: string;
}

const HIGHLIGHTS: Highlight[] = [
  { key: "web", icon: PanelsTopLeft, path: PAGE_MAKER_PATH, tone: "bg-brand-500/15 text-brand-200" },
  { key: "data", icon: Database, path: "/data-tools/excel-to-json", tone: "bg-sky-400/15 text-sky-200" },
  { key: "media", icon: Image, path: "/media-tools", tone: "bg-violet-400/15 text-violet-200" },
  { key: "vr", icon: Glasses, path: VR_TOUR_PATH, tone: "bg-emerald-400/15 text-emerald-200" },
];

/** Mock browser window: preview of the website being assembled. */
function SiteMockup() {
  const { t } = useTranslation();
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/30 dark:bg-gray-900">
        <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/60">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 truncate rounded-md bg-white px-2 py-0.5 font-mono text-[10px] text-gray-400 dark:bg-gray-900">kopi-senja.github.io</span>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="h-2.5 w-16 rounded-full bg-gray-800 dark:bg-gray-200" />
            <span className="flex gap-1.5">
              <span className="h-2 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <span className="h-2 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <span className="h-2 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            </span>
          </div>
          <div className="grid grid-cols-[1.2fr_1fr] gap-3 rounded-xl bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 p-4 dark:from-amber-500/20 dark:via-orange-500/10 dark:to-rose-500/20">
            <div className="flex flex-col gap-2">
              <span className="h-3 w-full rounded-full bg-gray-800/80 dark:bg-white/80" />
              <span className="h-3 w-3/4 rounded-full bg-gray-800/80 dark:bg-white/80" />
              <span className="mt-1 h-1.5 w-full rounded-full bg-gray-800/20 dark:bg-white/25" />
              <span className="h-1.5 w-5/6 rounded-full bg-gray-800/20 dark:bg-white/25" />
              <span className="mt-2 h-5 w-20 rounded-md bg-brand-600" />
            </div>
            <div className="rounded-lg bg-gradient-to-br from-amber-300 to-rose-300 dark:from-amber-400/60 dark:to-rose-400/60" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                <span className="h-8 rounded-md bg-gray-100 dark:bg-gray-800" />
                <span className="h-1.5 w-3/4 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="h-1.5 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="absolute -left-3 top-24 hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-lg sm:inline-flex dark:bg-gray-800 dark:text-white">
        <LayoutTemplate className="h-3.5 w-3.5 text-brand-600" /> {t("demo.promo.floatTemplates", { count: DEMO_TEMPLATE_COUNT })}
      </span>
      <span className="absolute -bottom-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-lg dark:bg-gray-800 dark:text-white">
        <Rocket className="h-3.5 w-3.5 text-emerald-600" /> {t("demo.promo.floatDeploy")}
      </span>
    </div>
  );
}

export default function DemoPromo() {
  const { t } = useTranslation();
  const stats = [
    { value: String(DEMO_TEMPLATE_COUNT), label: t("demo.promo.stats.templates") },
    { value: "35+", label: t("demo.promo.stats.tools") },
    { value: "5", label: t("demo.promo.stats.frameworks") },
    { value: "100%", label: t("demo.promo.stats.browser") },
  ];
  const perks = [t("demo.promo.perks.noAccount"), t("demo.promo.perks.private"), t("demo.promo.perks.export")];

  return (
    <section
      aria-labelledby="promo-title"
      data-testid="home-promo"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-brand-950 to-brand-800 px-5 py-8 text-white shadow-xl sm:px-10 sm:py-12"
    >
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> {t("demo.promo.badge")}
          </p>
          <h1 id="promo-title" className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {t("demo.promo.title")} <span className="bg-gradient-to-r from-sky-300 via-brand-200 to-violet-300 bg-clip-text text-transparent">{t("demo.promo.titleAccent")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{t("demo.promo.subtitle")}</p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link
              to={TEMPLATES_PATH}
              data-testid="promo-cta-templates"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-brand-50"
            >
              <LayoutTemplate className="h-4 w-4" /> {t("demo.promo.ctaTemplates")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={PAGE_MAKER_PATH}
              data-testid="promo-cta-builder"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              <Globe className="h-4 w-4" /> {t("demo.promo.ctaBuilder")}
            </Link>
          </div>

          <ul className="mt-6 flex flex-col gap-2 text-sm text-white/80 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 shrink-0 text-emerald-300" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <SiteMockup />
      </div>

      <dl className="relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-950/40 px-4 py-4 backdrop-blur">
            <dt className="text-xs text-white/60">{s.label}</dt>
            <dd className="mt-1 text-2xl font-extrabold tracking-tight">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {HIGHLIGHTS.map(({ key, icon: Icon, path, tone }) => (
          <Link
            key={key}
            to={path}
            data-testid={`promo-feature-${key}`}
            className="group flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/25 hover:bg-white/10"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-sm font-bold">
                {t(`demo.promo.features.${key}.title`)}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-white/65">{t(`demo.promo.features.${key}.text`)}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
