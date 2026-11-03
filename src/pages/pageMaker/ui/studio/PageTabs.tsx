import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { EyeOff, Home, LayoutGrid, Plus } from "lucide-react";
import type { ResolvedSitePage } from "../../helpers/site";

/* ================================================================== */
/* Tab halaman di bilah atas Studio (v20).                              */
/* Klik = pindah halaman. "Semua halaman" membuka papan; (+) menambah.   */
/* Layar sempit: daftar pilihan (select).                               */
/* ================================================================== */

export default function PageTabs({
  pages,
  currentId,
  onOpen,
  onAdd,
  onBoard,
  boardOpen,
}: {
  pages: ResolvedSitePage[];
  currentId: string | null;
  onOpen: (designId: string) => void;
  onAdd: () => void;
  onBoard: () => void;
  boardOpen: boolean;
}) {
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [currentId]);

  return (
    <div className="flex min-w-0 items-center gap-1" data-testid="studio-page-tabs">
      <button
        type="button"
        onClick={onBoard}
        aria-pressed={boardOpen}
        title={t("studio.allPagesTitle")}
        className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition ${
          boardOpen ? "border-blue-800 bg-blue-800 text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
        }`}
        data-testid="studio-board-toggle"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden xl:inline">{t("studio.allPages")}</span>
        <span className="rounded-full bg-black/10 px-1.5 text-[10px] dark:bg-white/15">{pages.length}</span>
      </button>

      {/* layar lebar: tab */}
      <div ref={listRef} role="tablist" aria-label={t("studio.pagesAria")} className="hidden min-w-0 items-center gap-0.5 overflow-x-auto md:flex [scrollbar-width:thin]">
        {pages.map((p) => {
          const on = p.designId === currentId && !boardOpen;
          return (
            <button
              key={p.designId}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onOpen(p.designId)}
              title={`${p.title} · /${p.isHome ? "" : p.slug}`}
              className={`inline-flex h-8 max-w-44 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition ${
                on ? "bg-blue-50 text-blue-900 ring-1 ring-blue-700 dark:bg-blue-500/15 dark:text-blue-100" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
              data-testid="studio-page-tab"
            >
              {p.isHome && <Home className="h-3.5 w-3.5 shrink-0" aria-label={t("studio.home")} />}
              <span className="truncate">{p.title}</span>
              {p.hidden && <EyeOff className="h-3 w-3 shrink-0 opacity-60" aria-label={t("studio.hiddenFromMenu")} />}
            </button>
          );
        })}
      </div>

      {/* layar sempit: pilihan */}
      <select
        className="h-8 min-w-0 max-w-40 rounded-lg border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-700 md:hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        value={currentId ?? ""}
        aria-label={t("studio.pagesAria")}
        onChange={(e) => e.target.value && onOpen(e.target.value)}
      >
        {pages.map((p) => (
          <option key={p.designId} value={p.designId}>
            {p.isHome ? "⌂ " : ""}
            {p.title}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onAdd}
        title={t("studio.addPage")}
        aria-label={t("studio.addPage")}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-600 hover:border-blue-700 hover:text-blue-800 dark:border-gray-600 dark:text-gray-300"
        data-testid="studio-add-page"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
