import { useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, CircleHelp, ExternalLink, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import DocsContent, { useDocTopic } from "./DocsContent";
import { Link } from "./LocaleLink";
import type { DocTopicId } from "../../config/docs";

/* ================================================================== */
/* Tombol "Bantuan" → laci dokumentasi menu ini (tanpa meninggalkan      */
/* halaman), dengan tautan ke halaman dokumentasi lengkap.               */
/* ================================================================== */

function DocsDrawer({ topic, onClose }: { topic: DocTopicId; onClose: () => void }) {
  const { t } = useTranslation();
  const doc = useDocTopic(topic);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex justify-end bg-gray-950/40 backdrop-blur-[1px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="docs-drawer-title"
        data-testid="docs-drawer"
        className="flex h-full w-full max-w-xl flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <header className="flex items-start gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            <BookOpen className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">{t("docs.label")}</p>
            <h2 id="docs-drawer-title" className="text-lg font-bold text-gray-900 dark:text-white">
              {doc?.title ?? t("docs.label")}
            </h2>
            {doc && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{doc.summary}</p>}
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t("common.close")} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <DocsContent topic={topic} compact />
        </div>
        <footer className="border-t border-gray-100 px-5 py-3 dark:border-gray-800">
          <Link to={`/docs/${topic}`} onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">
            {t("docs.openFull")} <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}

export default function HelpButton({ topic, compact = false }: { topic: DocTopicId; compact?: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="help-button"
        aria-haspopup="dialog"
        title={t("docs.helpTitle")}
        className={
          compact
            ? "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
            : "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-theme-xs transition hover:border-brand-300 hover:text-brand-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-brand-500/50 dark:hover:text-brand-300"
        }
      >
        <CircleHelp className="h-4 w-4" />
        <span className={compact ? "hidden lg:inline" : ""}>{t("docs.help")}</span>
      </button>
      {open && <DocsDrawer topic={topic} onClose={() => setOpen(false)} />}
    </>
  );
}
