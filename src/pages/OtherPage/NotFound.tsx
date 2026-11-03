import { useTranslation } from "react-i18next";
import { Compass } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import BrandLogo from "../../components/app/BrandLogo";
import { Link } from "../../components/app/LocaleLink";
import { btn } from "../../components/app/ui";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <AppMeta title={t("notFound.metaTitle")} description={t("notFound.message")} />
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-6 text-center dark:bg-gray-950" data-testid="not-found">
        <BrandLogo />
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
          <Compass className="h-7 w-7" />
        </div>
        <div className="max-w-md">
          <p className="font-mono text-sm font-semibold text-brand-700 dark:text-brand-300">404</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{t("notFound.title")}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t("notFound.message")}</p>
        </div>
        <Link to="/" className={btn.primary}>
          {t("notFound.home")}
        </Link>
      </main>
    </>
  );
}
