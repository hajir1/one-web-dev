import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { LANG_LABEL, SUPPORTED_LANGS, switchLangPath, type Lang } from "../../i18n";
import { useLang } from "./LocaleLink";

/**
 * ID / EN language switcher. The page, query (?design=…), and hash stay the same;
 * only the language prefix in the URL changes.
 */
export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const lang = useLang();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const go = (l: Lang) => l !== lang && navigate(switchLangPath(pathname, search, hash, l), { replace: true, preventScrollReset: true });

  return (
    <div
      role="group"
      aria-label={t("header.language")}
      className="inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-900"
      data-testid="lang-switcher"
    >
      {!compact && <Languages className="mx-1 h-4 w-4 text-gray-400" aria-hidden />}
      {SUPPORTED_LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === lang}
          title={LANG_LABEL[l].native}
          onClick={() => go(l)}
          data-testid={`lang-${l}`}
          className={`h-7 min-w-9 rounded-md px-2 text-xs font-bold tracking-wide transition ${
            l === lang ? "bg-brand-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          }`}
        >
          {LANG_LABEL[l].short}
        </button>
      ))}
    </div>
  );
}
