import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Coins, Menu, HardDrive, X } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { Link } from "../components/app/LocaleLink";
import BrandLogo from "../components/app/BrandLogo";
import LanguageSwitcher from "../components/app/LanguageSwitcher";
import ThemeToggle from "../components/app/ThemeToggle";
import { CREDITS_PATH, DOCS_PATH } from "../config/menu";
import { refreshBilling, useBilling } from "../pages/media/processing/billing";
import { formatCredits } from "../pages/media/processing/pricing";
import UserMenu from "./UserMenu";
import { AdminFreeBadge } from "../components/app/AdminFreeBadge";
import { isDemoMode } from "../demo/demoMode";

/** Demo mode (v12): a "Demo" badge replaces the credit balance & account menu. */
function DemoBadge() {
  const { t } = useTranslation();
  return (
    <span
      data-testid="header-demo"
      title={t("demo.badgeTitle")}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-2.5 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
    >
      <HardDrive className="h-4 w-4" /> {t("demo.badge")}
    </span>
  );
}

/** Credit balance from the server (or "—" when the backend is not available). */
function CreditPill() {
  const { t } = useTranslation();
  const account = useBilling((s) => s.account);
  const status = useBilling((s) => s.status);
  useEffect(() => {
    if (status === "idle") void refreshBilling();
  }, [status]);
  return (
    <Link
      to={CREDITS_PATH}
      data-testid="header-credits"
      title={t("header.creditsTitle")}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
    >
      <Coins className="h-4 w-4" />
      <span className="hidden min-[420px]:inline">{account ? formatCredits(account.balance) : t("header.credits")}</span>
      <span className="sr-only min-[420px]:hidden">{t("header.credits")}</span>
    </Link>
  );
}

const AppHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const demo = isDemoMode();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  return (
    <header className="sticky top-0 z-99999 flex w-full border-gray-200 bg-white/85 backdrop-blur-md lg:border-b dark:border-gray-800 dark:bg-gray-900/85">
      <div className="flex grow items-center justify-between gap-2 border-b border-gray-200 px-3 py-2.5 lg:border-b-0 lg:px-6 lg:py-3 dark:border-gray-800">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 lg:h-10 lg:w-10 dark:border-gray-800 dark:text-gray-400 dark:hover:text-white"
            onClick={handleToggle}
            aria-label={t("header.toggleSidebar")}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="hidden min-[360px]:block lg:hidden" aria-label={t("app.name")}>
            <span className="hidden sm:block">
              <BrandLogo />
            </span>
            <span className="sm:hidden">
              <BrandLogo collapsed />
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {demo ? (
            <DemoBadge />
          ) : (
            <>
              <AdminFreeBadge compact />
              <CreditPill />
            </>
          )}
          <Link
            to={DOCS_PATH}
            className="hidden h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:inline-flex dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <BookOpen className="h-4 w-4" /> {t("nav.docs")}
          </Link>
          <LanguageSwitcher compact />
          <ThemeToggle />
          {!demo && <UserMenu />}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
