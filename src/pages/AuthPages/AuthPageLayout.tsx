import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import BrandLogo, { BrandMark } from "../../components/app/BrandLogo";
import LanguageSwitcher from "../../components/app/LanguageSwitcher";
import { Link } from "../../components/app/LocaleLink";
import ThemeToggle from "../../components/app/ThemeToggle";

/** Sign-in / Sign-up page shell (no sidebar). */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" aria-label={t("app.name")}>
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-12 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-md">
          {/* v9: the "1" icon above the Sign-in/Sign-up card. */}
          <BrandMark className="mx-auto mb-4 h-12 w-12 drop-shadow-sm" />
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">{children}</div>
        </div>
      </main>
    </div>
  );
}
