import { Fragment, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Printer } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import BrandLogo from "../../components/app/BrandLogo";
import LanguageSwitcher from "../../components/app/LanguageSwitcher";
import ThemeToggle from "../../components/app/ThemeToggle";
import { Link, Navigate, useLang } from "../../components/app/LocaleLink";
import { btn, Notice } from "../../components/app/ui";
import { isLegalDoc, LEGAL_DOCS, legalPath } from "../../config/legal";
import { LEGAL_DOCUMENTS, type LegalBlock } from "./documents";

/** Teks dalam [kurung siku] = placeholder yang belum diisi → ditandai kuning. */
function withPlaceholders(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((p, i) =>
    /^\[[^\]]+\]$/.test(p) ? (
      <mark key={i} className="rounded bg-amber-100 px-0.5 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200" title="Placeholder: isi di src/config/legal.ts">
        {p}
      </mark>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (Array.isArray(block))
    return (
      <ul className="ml-5 list-disc space-y-1.5">
        {block.map((li, i) => (
          <li key={i}>{withPlaceholders(li)}</li>
        ))}
      </ul>
    );
  return <p>{withPlaceholders(block)}</p>;
}

/** Halaman publik /:lang/legal/:doc — S&K, Privasi, Refund, Kontak (tanpa login). */
export default function LegalPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { doc } = useParams();
  if (!isLegalDoc(doc)) return <Navigate to={legalPath("terms")} replace />;
  const d = LEGAL_DOCUMENTS[doc];
  const hasPlaceholder = JSON.stringify(d).includes("[");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppMeta title={d.title} description={d.summary} />
      <header className="flex items-center justify-between px-4 py-3 sm:px-6 print:hidden">
        <Link to="/" aria-label={t("app.name")}>
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <nav className="mb-4 flex flex-wrap gap-2 print:hidden" aria-label={t("legal.nav")}>
          {LEGAL_DOCS.map((id) => (
            <Link
              key={id}
              to={legalPath(id)}
              aria-current={id === doc ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                id === doc ? "bg-brand-600 text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              }`}
            >
              {t(`legal.docs.${id}`)}
            </Link>
          ))}
        </nav>
        <article className="rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-relaxed text-gray-700 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 print:border-0 print:shadow-none">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{d.title}</h1>
            <button type="button" onClick={() => window.print()} className={`${btn.ghost} print:hidden`} aria-label={t("legal.print")}>
              <Printer className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{d.summary}</p>
          {lang === "en" && (
            <div className="mt-4">
              <Notice tone="info">{t("legal.indonesianOnly")}</Notice>
            </div>
          )}
          {hasPlaceholder && (
            <div className="mt-4 print:hidden">
              <Notice tone="warn">{t("legal.placeholderWarning")}</Notice>
            </div>
          )}
          {d.sections.map((s) => (
            <section key={s.heading} className="mt-6 space-y-3">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">{s.heading}</h2>
              {s.body.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
