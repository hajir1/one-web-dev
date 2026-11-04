import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Database, Unlink } from "lucide-react";
import type { BoxNode } from "../../engine/helpers/componentTypes";
import {
  DISPLAY_MODES,
  PER_PAGE_MAX,
  PER_PAGE_MIN,
  SORT_KEYS,
  categoriesOf,
  clampPerPage,
  displayOf,
  type CollectionDef,
  type CollectionDisplay,
  type CollectionDisplayMode,
  type CollectionView,
  type SortKey,
} from "../../helpers/collections";

/* ================================================================== */
/* Settings › Data collections: mark a Row/card group as a collection,   */
/* or open its dashboard. Preview: the cards must be Product Cards.     */
/* ================================================================== */

const INPUT =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900";

export function CollectionBoxPanel({ box, onMark, onUnmark, onOpen }: { box: BoxNode; onMark: (name: string) => void; onUnmark: () => void; onOpen: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState(t("crud.defaultName"));
  if (box.collection) {
    return (
      <div className="space-y-3 text-sm" data-testid="collection-panel">
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
          {t("crud.panel.isCollection", { name: box.collection.name, count: box.collection.items.length })}
        </p>
        <button type="button" onClick={onOpen} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700" data-testid="collection-open">
          <Database className="h-4 w-4" /> {t("crud.panel.open")}
        </button>
        <button type="button" onClick={onUnmark} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5" data-testid="collection-unmark">
          <Unlink className="h-3.5 w-3.5" /> {t("crud.panel.unmark")}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("crud.panel.unmarkHint")}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3 text-sm" data-testid="collection-panel">
      <p className="text-xs text-gray-600 dark:text-gray-300">{t("crud.panel.intro", { count: box.children.length })}</p>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">{t("crud.nameLabel")}</span>
        <input className={INPUT} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} data-testid="collection-name" />
      </label>
      <button
        type="button"
        disabled={!name.trim()}
        onClick={() => onMark(name.trim())}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
        data-testid="collection-mark"
      >
        <Database className="h-4 w-4" /> {t("crud.panel.mark")}
      </button>
    </div>
  );
}

/** A note in the Settings of cards whose content is managed by a collection. */
export function CollectionCardNote({ name, onOpen }: { name: string; onOpen: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 text-xs" data-testid="collection-card-note">
      <p className="text-gray-600 dark:text-gray-300">{t("crud.panel.cardNote", { name })}</p>
      <button type="button" onClick={onOpen} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700" data-testid="collection-card-open">
        <Database className="h-3.5 w-3.5" /> {t("crud.panel.open")}
      </button>
    </div>
  );
}

/**
 * Styling › Data display (optional): how collection cards load on the public
 * page. Default "Show all"; other modes load per page from the API.
 */
export function CollectionDisplayPanel({
  col,
  onChange,
  onView,
  filterBars = 0,
}: {
  col: CollectionDef;
  onChange: (d: CollectionDisplay) => void;
  onView?: (v: CollectionView) => void;
  /** Number of filter chip groups connected to this collection on the page. */
  filterBars?: number;
}) {
  const { t } = useTranslation();
  const d = displayOf(col);
  const view = col.view ?? {};
  const cats = categoriesOf(col);
  // Stored categories no longer in the data still show so they can be replaced.
  const catOptions = view.category && !cats.some((c) => c.toLowerCase() === view.category!.toLowerCase()) ? [...cats, view.category] : cats;
  return (
    <div className="space-y-3 text-sm" data-testid="collection-display">
      {onView && (
        <>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">{t("crud.view.category")}</span>
            <select className={INPUT} value={view.category ?? ""} onChange={(e) => onView({ ...view, category: e.target.value })} data-testid="collection-view-category">
              <option value="">{t("crud.view.allCategories")}</option>
              {catOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          {!cats.length && <p className="text-xs text-gray-500 dark:text-gray-400">{t("crud.view.noCategories")}</p>}
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">{t("crud.view.sort")}</span>
            <select className={INPUT} value={view.sort ?? "manual"} onChange={(e) => onView({ ...view, sort: e.target.value as SortKey })} data-testid="collection-view-sort">
              {SORT_KEYS.map((k) => (
                <option key={k} value={k}>
                  {t(`crud.view.sorts.${k}`)}
                </option>
              ))}
            </select>
          </label>
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-300" data-testid="collection-filter-status">
            {filterBars ? t("crud.filter.linked", { count: filterBars }) : t("crud.filter.howTo")}
          </p>
        </>
      )}
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">{t("crud.display.mode")}</span>
        <select className={INPUT} value={d.mode} onChange={(e) => onChange({ ...d, mode: e.target.value as CollectionDisplayMode })} data-testid="collection-display-mode">
          {DISPLAY_MODES.map((m) => (
            <option key={m} value={m}>
              {t(`crud.display.modes.${m}`)}
            </option>
          ))}
        </select>
      </label>
      {d.mode !== "all" && (
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">{t("crud.display.perPage")}</span>
          <input
            type="number"
            min={PER_PAGE_MIN}
            max={PER_PAGE_MAX}
            className={INPUT}
            value={d.perPage}
            onChange={(e) => onChange({ ...d, perPage: clampPerPage(e.target.value) })}
            data-testid="collection-display-per-page"
          />
        </label>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400">{t(`crud.display.hint.${d.mode}`, { count: d.perPage })}</p>
    </div>
  );
}
