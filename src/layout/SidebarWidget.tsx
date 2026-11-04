import { useTranslation } from "react-i18next";
import { Coins, HardDrive, Sparkles } from "lucide-react";
import { Link } from "../components/app/LocaleLink";
import { CREDITS_PATH } from "../config/menu";
import { FREE_DESIGNS, FREE_SITES } from "../credits/credits";
import { FREE_EXPORTS } from "../credits/downloadQuota";
import { isDemoMode } from "../demo/demoMode";
import { DEMO_TEMPLATE_COUNT } from "../demo/demoTemplateIds";

/** Demo mode (v12, v15: unlimited): demo summary, no credit links. */
function DemoWidget() {
  const { t } = useTranslation();
  return (
    <div data-testid="demo-widget" className="mx-auto mb-10 w-full max-w-60 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white px-4 py-4 dark:border-brand-500/20 dark:from-brand-500/10 dark:to-transparent">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
        <HardDrive className="h-3.5 w-3.5" /> {t("demo.widget.title")}
      </p>
      <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
        <li>{t("demo.widget.sites")}</li>
        <li>{t("demo.widget.designs")}</li>
        <li>{t("demo.widget.templates", { count: DEMO_TEMPLATE_COUNT })}</li>
        <li>{t("demo.widget.elements")}</li>
        <li>{t("demo.widget.local")}</li>
      </ul>
    </div>
  );
}

/** Free plan summary + link to the Credits page. */
export default function SidebarWidget() {
  const { t } = useTranslation();
  if (isDemoMode()) return <DemoWidget />;
  return (
    <div className="mx-auto mb-10 w-full max-w-60 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white px-4 py-4 dark:border-brand-500/20 dark:from-brand-500/10 dark:to-transparent">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
        <Sparkles className="h-3.5 w-3.5" /> {t("sidebar.freePlan")}
      </p>
      <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
        <li>{t("sidebar.sites", { count: FREE_SITES })}</li>
        <li>{t("sidebar.designs", { count: FREE_DESIGNS })}</li>
        <li>{t("sidebar.exports", { count: FREE_EXPORTS })}</li>
        <li>{t("sidebar.browserFree")}</li>
      </ul>
      <Link
        to={CREDITS_PATH}
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
      >
        <Coins className="h-3.5 w-3.5" /> {t("sidebar.buyCredits")}
      </Link>
    </div>
  );
}
