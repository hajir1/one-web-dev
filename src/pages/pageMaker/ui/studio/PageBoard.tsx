import { useEffect, useRef, useState, type CSSProperties, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Copy, Eye, EyeOff, Home, MoreHorizontal, PanelTop, Pencil, Plus, Trash2, X } from "lucide-react";
import type { ResolvedSitePage } from "../../helpers/site";
import PageThumb from "./PageThumb";

/* ================================================================== */
/* Papan halaman Studio (v20): semua halaman website berjajar seperti    */
/* kartu, kartu (+) di ujung untuk menambah. Klik kartu = buka halaman.  */
/* Seret kartu (atau panah) = ubah urutan menu.                          */
/* ================================================================== */

export interface PageBoardActions {
  onOpen: (id: string) => void;
  onAdd: (afterId: string | null) => void;
  onRename: (id: string, name: string) => void;
  onSetHome: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, to: number) => void;
  /** Salin header & footer halaman ini ke semua halaman lain. */
  onSyncChrome: (id: string) => void;
  onClose: () => void;
}

/** Perkiraan tinggi menu ⋯ (8 butir + garis), untuk memilih buka ke bawah atau ke atas. */
const MENU_H = 300;

function CardMenu({ page, index, count, a }: { page: ResolvedSitePage; index: number; count: number; a: PageBoardActions & { rename: () => void } }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  // v21: menu "fixed" di atas kartu (kartu ber-overflow-hidden memotong menu, "Hapus halaman" tak terlihat).
  // Membuka ke atas bila ruang di bawah tombol tidak cukup.
  const [pos, setPos] = useState<CSSProperties>({});
  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const right = Math.max(8, window.innerWidth - r.right);
      setPos(window.innerHeight - r.bottom < MENU_H + 12 && r.top > MENU_H + 12 ? { right, bottom: window.innerHeight - r.top + 4 } : { right, top: r.bottom + 4 });
    }
    setOpen((v) => !v);
  };
  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const close = () => setOpen(false);
    document.addEventListener("mousedown", off);
    document.addEventListener("keydown", esc);
    window.addEventListener("resize", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", off);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("resize", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [open]);
  const item = (Icon: typeof Home, label: string, run: () => void, opts: { danger?: boolean; disabled?: boolean; testId?: string } = {}) => (
    <button
      type="button"
      role="menuitem"
      disabled={opts.disabled}
      data-testid={opts.testId}
      onClick={() => {
        setOpen(false);
        run();
      }}
      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium disabled:opacity-40 ${
        opts.danger ? "text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
    </button>
  );
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("studio.pageMenu", { name: page.title })}
        ref={btnRef}
        onClick={toggle}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/10"
        data-testid="studio-page-menu"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" style={pos} className="fixed z-50 max-h-[calc(100vh-16px)] w-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {item(Pencil, t("studio.rename"), a.rename)}
          {item(Home, t("studio.setHome"), () => a.onSetHome(page.designId), { disabled: page.isHome })}
          {item(page.hidden ? Eye : EyeOff, page.hidden ? t("studio.showInMenu") : t("studio.hideFromMenu"), () => a.onToggleHidden(page.designId), { testId: "studio-toggle-hidden" })}
          {item(Copy, t("studio.duplicate"), () => a.onDuplicate(page.designId))}
          {item(PanelTop, t("studio.syncChrome"), () => a.onSyncChrome(page.designId), { disabled: count < 2 })}
          {item(ArrowLeft, t("studio.moveLeft"), () => a.onMove(page.designId, index - 1), { disabled: index === 0 })}
          {item(ArrowRight, t("studio.moveRight"), () => a.onMove(page.designId, index + 1), { disabled: index === count - 1 })}
          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
          {item(Trash2, t("studio.deletePage"), () => a.onDelete(page.designId), { danger: true, disabled: count < 2, testId: "studio-delete-page" })}
        </div>
      )}
    </div>
  );
}

function NameInput({ value, onDone }: { value: string; onDone: (v: string | null) => void }) {
  const [v, setV] = useState(value);
  return (
    <input
      autoFocus
      value={v}
      maxLength={60}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => onDone(v.trim() && v.trim() !== value ? v.trim() : null)}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") onDone(null);
      }}
      className="w-full rounded border border-blue-700 bg-white px-1.5 py-0.5 text-sm font-semibold text-gray-800 outline-none dark:bg-gray-900 dark:text-white/90"
    />
  );
}

export default function PageBoard({
  siteName,
  pages,
  currentId,
  render,
  actions,
}: {
  siteName: string;
  pages: ResolvedSitePage[];
  currentId: string | null;
  render: (designId: string) => { css: string; body: string } | null;
  actions: PageBoardActions;
}) {
  const { t } = useTranslation();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const drop = (e: DragEvent, i: number) => {
    e.preventDefault();
    if (dragId) actions.onMove(dragId, i);
    setDragId(null);
    setOverIdx(null);
  };

  return (
    <div className="absolute inset-0 z-30 overflow-y-auto bg-gray-100 dark:bg-gray-950" data-testid="studio-board" role="region" aria-label={t("studio.boardTitle")}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("studio.boardTitle")}</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">{t("studio.boardText", { name: siteName })}</p>
          </div>
          <button type="button" onClick={actions.onClose} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" data-testid="studio-board-close">
            <X className="h-4 w-4" /> {t("studio.backToEditor")}
          </button>
        </div>

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="studio-board-list">
          {pages.map((p, i) => {
            const shot = render(p.designId);
            const current = p.designId === currentId;
            return (
              <li
                key={p.designId}
                draggable={renaming !== p.designId}
                onDragStart={(e) => {
                  setDragId(p.designId);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverIdx(null);
                }}
                onDragOver={(e) => {
                  if (!dragId) return;
                  e.preventDefault();
                  setOverIdx(i);
                }}
                onDrop={(e) => drop(e, i)}
                className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition dark:bg-gray-900 ${
                  current ? "border-blue-700 ring-2 ring-blue-700/30" : "border-gray-200 dark:border-gray-800"
                } ${dragId === p.designId ? "opacity-40" : ""} ${overIdx === i && dragId && dragId !== p.designId ? "ring-2 ring-amber-500" : ""}`}
                data-testid="studio-page-card"
              >
                <button type="button" onClick={() => actions.onOpen(p.designId)} className="block border-b border-gray-200 text-left dark:border-gray-800" aria-label={t("studio.openPage", { name: p.title })}>
                  {shot ? <PageThumb css={shot.css} body={shot.body} title={p.title} /> : <div className="aspect-[4/3] w-full bg-gray-50 dark:bg-gray-800" />}
                </button>
                <div className="flex items-start gap-2 px-3 py-2.5">
                  <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded bg-gray-100 px-1 text-[11px] font-bold text-gray-600 dark:bg-white/10 dark:text-gray-300">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    {renaming === p.designId ? (
                      <NameInput
                        value={p.title}
                        onDone={(v) => {
                          setRenaming(null);
                          if (v) actions.onRename(p.designId, v);
                        }}
                      />
                    ) : (
                      <button type="button" onDoubleClick={() => setRenaming(p.designId)} onClick={() => actions.onOpen(p.designId)} className="block max-w-full truncate text-left text-sm font-semibold text-gray-800 dark:text-white/90">
                        {p.title}
                      </button>
                    )}
                    <p className="truncate font-mono text-[11px] text-gray-400">/{p.isHome ? "" : p.slug}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.isHome && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-500/15 dark:text-blue-200">
                          <Home className="h-3 w-3" /> {t("studio.home")}
                        </span>
                      )}
                      {p.hidden && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
                          <EyeOff className="h-3 w-3" /> {t("studio.hiddenFromMenu")}
                        </span>
                      )}
                    </div>
                  </div>
                  <CardMenu page={p} index={i} count={pages.length} a={{ ...actions, rename: () => setRenaming(p.designId) }} />
                </div>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => actions.onAdd(null)}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 transition hover:border-blue-700 hover:bg-blue-50/50 hover:text-blue-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-blue-500/5"
              data-testid="studio-board-add"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-900">
                <Plus className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold">{t("studio.addPage")}</span>
              <span className="px-6 text-center text-[11px]">{t("studio.addPageHint")}</span>
            </button>
          </li>
        </ol>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("studio.boardFoot")}</p>
      </div>
    </div>
  );
}
