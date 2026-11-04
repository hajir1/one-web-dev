import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, BookOpen, Search } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import DocsContent, { useDocTopic } from "../../components/app/DocsContent";
import { Link, Navigate, useLocaleNavigate } from "../../components/app/LocaleLink";
import { DOC_BY_ID, DOC_GROUP_ORDER, isVisibleDocTopic as isDocTopic, visibleDocTopics, type DocTopicId } from "../../config/docs";
import { INPUT } from "../../components/app/ui";
import { isDemoMode } from "../../demo/demoMode";

/* ================================================================== */
/* Documentation hub: /docs and /docs/:topic (ID & EN from the locales). */
/* ================================================================== */

function TopicLink({ id, active }: { id: DocTopicId; active: boolean }) {
  const { t } = useTranslation();
  const Icon = DOC_BY_ID[id].icon;
  return (
    <Link
      to={`/docs/${id}`}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${
        active ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{t(`docs.topics.${id}.title`)}</span>
    </Link>
  );
}

export default function DocsPage() {
  const { t } = useTranslation();
  const { topic } = useParams();
  const navigate = useLocaleNavigate();
  const [q, setQ] = useState("");
  const current: DocTopicId = isDocTopic(topic) ? topic : "getting-started";
  const doc = useDocTopic(current);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const topics = visibleDocTopics();
    if (!s) return topics;
    return topics.filter((d) => {
      const raw = JSON.stringify(t(`docs.topics.${d.id}`, { returnObjects: true }) ?? "").toLowerCase();
      return raw.includes(s);
    });
  }, [q, t]);

  if (topic && !isDocTopic(topic)) return <Navigate to="/docs" replace />;
  const info = DOC_BY_ID[current];

  return (
    <>
      <AppMeta title={`${doc?.title ?? t("docs.title")} · ${t("docs.title")}`} description={doc?.summary ?? t("docs.description")} />
      <div className="flex flex-col gap-5" data-testid="docs-page">
        <PageHeader
          icon={BookOpen}
          title={t("docs.title")}
          description={t(isDemoMode() ? "demo.docs.description" : "docs.description")}
          crumbs={[{ label: t("nav.dashboard"), to: "/" }, { label: t("docs.title"), to: "/docs" }, { label: doc?.title ?? current }]}
        />

        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
            <label className="relative block">
              <span className="sr-only">{t("docs.search")}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("docs.search")} className={`${INPUT} pl-9`} data-testid="docs-search" />
            </label>
            {/* Mobile: pemilih topik ringkas */}
            <select
              className={`${INPUT} lg:hidden`}
              value={current}
              onChange={(e) => navigate(`/docs/${e.target.value}`)}
              aria-label={t("docs.chooseTopic")}
              data-testid="docs-topic-select"
            >
              {DOC_GROUP_ORDER.map((g) => (
                <optgroup key={g} label={t(`docs.groups.${g}`)}>
                  {filtered
                    .filter((d) => d.group === g)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {t(`docs.topics.${d.id}.title`)}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <nav aria-label={t("docs.title")} className="ow-card hidden p-2 lg:block">
              {DOC_GROUP_ORDER.map((g) => {
                const items = filtered.filter((d) => d.group === g);
                if (!items.length) return null;
                return (
                  <div key={g} className="mb-2 last:mb-0">
                    <p className="px-2.5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">{t(`docs.groups.${g}`)}</p>
                    {items.map((d) => (
                      <TopicLink key={d.id} id={d.id} active={d.id === current} />
                    ))}
                  </div>
                );
              })}
              {!filtered.length && <p className="px-2.5 py-3 text-sm text-gray-500">{t("docs.noResults")}</p>}
            </nav>
          </aside>

          <main className="ow-card min-w-0 p-5 sm:p-7" aria-labelledby="doc-title">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-5 dark:border-gray-800">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                  <info.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t(`docs.groups.${info.group}`)}</p>
                  <h2 id="doc-title" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {doc?.title ?? current}
                  </h2>
                </div>
              </div>
              {current !== "getting-started" && (
                <Link to={info.path} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5">
                  {t("docs.openTool")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            <DocsContent topic={current} />
            {/* Demo mode (v15): the full /dokumentasi guide contains credit rules, so it is hidden. */}
            {!isDemoMode() && (current === "page-maker" || current === "website" || current === "global-setting") && (
              <p className="mt-6 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                {t("docs.fullGuide")}{" "}
                <Link to="/dokumentasi" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                  {t("docs.fullGuideLink")}
                </Link>
              </p>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
