import { Fragment, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2, CircleHelp, Coins, FileInput, Lightbulb, ListChecks, ServerCog, Target } from "lucide-react";
import type { DocTopicId } from "../../config/docs";
import { isDemoMode } from "../../demo/demoMode";

/* ================================================================== */
/* Render isi dokumentasi dari locales (docs.topics.<id>).               */
/* Format teks sederhana: **tebal** dan `kode`. Tidak ada HTML mentah.   */
/* ================================================================== */

interface DocSection {
  /** purpose | usage | io | limits | examples | errors | backend */
  kind: string;
  heading: string;
  body?: string;
  items?: string[];
  /** Pasangan masalah → solusi (untuk kind "errors"). */
  pairs?: { q: string; a: string }[];
}

export interface DocTopicContent {
  title: string;
  summary: string;
  sections: DocSection[];
}

const KIND_ICON: Record<string, typeof Target> = {
  purpose: Target,
  usage: ListChecks,
  io: FileInput,
  limits: Coins,
  examples: Lightbulb,
  errors: AlertTriangle,
  backend: ServerCog,
};

/** `**tebal**` dan `kode` → elemen React (teks lain di-escape oleh React). */
function richText(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} className="font-semibold text-gray-800 dark:text-white/90">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return (
        <code key={i} className="rounded bg-gray-100 px-1 py-0.5 text-[0.9em] text-gray-800 dark:bg-white/10 dark:text-gray-100">
          {p.slice(1, -1)}
        </code>
      );
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export function useDocTopic(id: DocTopicId): DocTopicContent | null {
  const { t, i18n } = useTranslation();
  // Mode demo (v12): topik yang punya versi demo (tanpa kredit/akun) memakai versi itu.
  const demoKey = `demo.docs.topics.${id}`;
  const raw = t(isDemoMode() && i18n.exists(demoKey) ? demoKey : `docs.topics.${id}`, { returnObjects: true }) as unknown;
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as DocTopicContent).sections)) return null;
  return raw as DocTopicContent;
}

export default function DocsContent({ topic, compact = false }: { topic: DocTopicId; compact?: boolean }) {
  const { t } = useTranslation();
  const doc = useDocTopic(topic);
  if (!doc) return <p className="text-sm text-gray-500">{t("docs.missing")}</p>;
  return (
    <article className="flex flex-col gap-5" data-testid={`docs-${topic}`}>
      {!compact && <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">{richText(doc.summary)}</p>}
      {doc.sections.map((s, i) => {
        const Icon = KIND_ICON[s.kind] ?? CircleHelp;
        const warn = s.kind === "backend" || s.kind === "errors";
        return (
          <section key={i} aria-labelledby={`doc-${topic}-${i}`} className="min-w-0">
            <h3 id={`doc-${topic}-${i}`} className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${warn ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"}`}>
                <Icon className="h-4 w-4" />
              </span>
              {s.heading}
            </h3>
            {s.body && <p className="mb-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{richText(s.body)}</p>}
            {s.items && s.items.length > 0 && (
              <ul className="flex flex-col gap-1.5 pl-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {s.items.map((it, j) => (
                  <li key={j} className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                    <span className="min-w-0">{richText(it)}</span>
                  </li>
                ))}
              </ul>
            )}
            {s.pairs && s.pairs.length > 0 && (
              <dl className="flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-200 text-sm dark:divide-gray-800 dark:border-gray-800">
                {s.pairs.map((p, j) => (
                  <div key={j} className="px-3.5 py-2.5">
                    <dt className="font-medium text-gray-800 dark:text-white/90">{richText(p.q)}</dt>
                    <dd className="mt-0.5 text-gray-600 dark:text-gray-300">{richText(p.a)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        );
      })}
    </article>
  );
}
