import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Database, FileText, Filter, Link2, Unlink } from "lucide-react";
import type { BoxNode, ElementNode } from "../../engine/helpers/componentTypes";
import type { CollectionDef } from "../../helpers/collections";
import { BIND_FIELDS, RELATED_MAX, canBind, previewItem, type BindField } from "../../helpers/itemPage";

/* ================================================================== */
/* Uji coba HALAMAN ITEM: panel Pengaturan                               */
/*   ItemBoxPanel   box detail = satu item koleksi (+ item pratinjau)    */
/*   RelatedPanel   kartu "Mungkin Anda suka" (label sama, maks N)       */
/*   BindPanel      elemen di halaman item: isi dari kolom mana          */
/* ================================================================== */

const INPUT =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900";
const LABEL = "mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300";
const PRIMARY = "inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40";
const GHOST =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5";

function CollectionSelect({ cols, value, onChange, testId }: { cols: CollectionDef[]; value: string; onChange: (slug: string) => void; testId: string }) {
  const { t } = useTranslation();
  return (
    <label className="block">
      <span className={LABEL}>{t("crud.item.collection")}</span>
      <select className={INPUT} value={value} onChange={(e) => onChange(e.target.value)} data-testid={testId}>
        {cols.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name} (/{c.slug})
          </option>
        ))}
      </select>
    </label>
  );
}

export function ItemBoxPanel({
  box,
  cols,
  onMark,
  onUnmark,
  onPreview,
  onOpenData,
}: {
  box: BoxNode;
  cols: CollectionDef[];
  onMark: (slug: string) => void;
  onUnmark: () => void;
  onPreview: (itemId: string) => void;
  onOpenData: () => void;
}) {
  const { t } = useTranslation();
  const [pick, setPick] = useState(cols[0]?.slug ?? "");
  if (box.itemOf) {
    const col = cols.find((c) => c.slug === box.itemOf!.collection);
    const current = previewItem(col, box.itemOf);
    return (
      <div className="space-y-3 text-sm" data-testid="item-panel">
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
          {col ? t("crud.item.isItem", { name: col.name, url: `/${col.slug}/<slug>` }) : t("crud.item.missing", { slug: box.itemOf.collection })}
        </p>
        {col && col.items.length > 0 && (
          <label className="block">
            <span className={LABEL}>{t("crud.item.preview")}</span>
            <select className={INPUT} value={current?.id ?? ""} onChange={(e) => onPreview(e.target.value)} data-testid="item-preview">
              {col.items.map((it) => (
                <option key={it.id} value={it.id}>
                  {String(it.values.name || it.slug)}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("crud.item.bindHint")}</p>
        <button type="button" onClick={onOpenData} className={GHOST}>
          <Database className="h-3.5 w-3.5" /> {t("crud.panel.open")}
        </button>
        <button type="button" onClick={onUnmark} className={GHOST} data-testid="item-unmark">
          <Unlink className="h-3.5 w-3.5" /> {t("crud.item.unmark")}
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-3 text-sm" data-testid="item-panel">
      <p className="text-xs text-gray-600 dark:text-gray-300">{t("crud.item.intro")}</p>
      <CollectionSelect cols={cols} value={pick} onChange={setPick} testId="item-collection" />
      <button type="button" disabled={!pick} onClick={() => onMark(pick)} className={PRIMARY} data-testid="item-mark">
        <FileText className="h-4 w-4" /> {t("crud.item.mark")}
      </button>
    </div>
  );
}

export function RelatedPanel({ box, cols, onMark, onUnmark, onLimit }: { box: BoxNode; cols: CollectionDef[]; onMark: (slug: string) => void; onUnmark: () => void; onLimit: (n: number) => void }) {
  const { t } = useTranslation();
  const [pick, setPick] = useState(cols[0]?.slug ?? "");
  if (box.related) {
    const col = cols.find((c) => c.slug === box.related!.collection);
    return (
      <div className="space-y-3 text-sm" data-testid="related-panel">
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">{t("crud.related.isRelated", { name: col?.name ?? box.related.collection })}</p>
        <label className="block">
          <span className={LABEL}>{t("crud.related.limit")}</span>
          <input type="number" min={1} max={RELATED_MAX} className={INPUT} value={box.related.limit} onChange={(e) => onLimit(Number(e.target.value))} data-testid="related-limit" />
        </label>
        <button type="button" onClick={onUnmark} className={GHOST} data-testid="related-unmark">
          <Unlink className="h-3.5 w-3.5" /> {t("crud.related.unmark")}
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-3 text-sm" data-testid="related-panel">
      <p className="text-xs text-gray-600 dark:text-gray-300">{t("crud.related.intro")}</p>
      <CollectionSelect cols={cols} value={pick} onChange={setPick} testId="related-collection" />
      <button type="button" disabled={!pick} onClick={() => onMark(pick)} className={PRIMARY} data-testid="related-mark">
        <Link2 className="h-4 w-4" /> {t("crud.related.mark")}
      </button>
    </div>
  );
}

export function BindPanel({ el, onBind }: { el: ElementNode; onBind: (f: BindField | null) => void }) {
  const { t } = useTranslation();
  const options = BIND_FIELDS.filter((f) => canBind(el, f));
  return (
    <div className="space-y-2 text-sm" data-testid="bind-panel">
      <label className="block">
        <span className={LABEL}>{t("crud.bind.label")}</span>
        <select className={INPUT} value={el.bind ?? ""} onChange={(e) => onBind((e.target.value || null) as BindField | null)} data-testid="bind-field">
          <option value="">{t("crud.bind.none")}</option>
          {options.map((f) => (
            <option key={f} value={f}>
              {t(`crud.field.${f}`)}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">{t(el.bind ? "crud.bind.hintOn" : "crud.bind.hintOff")}</p>
    </div>
  );
}

/** Grup chip (badge/teks/tombol) → filter kategori sebuah koleksi. */
export function FilterBarPanel({
  box,
  cols,
  onMark,
  onUnmark,
  onSync,
}: {
  box: BoxNode;
  cols: CollectionDef[];
  onMark: (slug: string) => void;
  onUnmark: () => void;
  onSync: () => void;
}) {
  const { t } = useTranslation();
  const [pick, setPick] = useState(cols[0]?.slug ?? "");
  if (box.filterOf) {
    const col = cols.find((c) => c.slug === box.filterOf);
    const chips = box.children.filter((c) => c.kind === "element" && c.chip !== undefined) as ElementNode[];
    return (
      <div className="space-y-3 text-sm" data-testid="filter-panel">
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
          {col ? t("crud.filter.isFilter", { name: col.name }) : t("crud.item.missing", { slug: box.filterOf })}
        </p>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300" data-testid="filter-chips">
          {chips.map((c) => (
            <li key={c.id} className="flex justify-between gap-2">
              <span className="truncate">{String(c.state?.text ?? "")}</span>
              <span className="shrink-0 text-gray-400">{c.chip ? c.chip : t("crud.filter.all")}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("crud.filter.hint")}</p>
        <button type="button" onClick={onSync} className={GHOST} data-testid="filter-sync">
          <Filter className="h-3.5 w-3.5" /> {t("crud.filter.sync")}
        </button>
        <button type="button" onClick={onUnmark} className={GHOST} data-testid="filter-unmark">
          <Unlink className="h-3.5 w-3.5" /> {t("crud.filter.unmark")}
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-3 text-sm" data-testid="filter-panel">
      <p className="text-xs text-gray-600 dark:text-gray-300">{t("crud.filter.intro")}</p>
      <CollectionSelect cols={cols} value={pick} onChange={setPick} testId="filter-collection" />
      <button type="button" onClick={() => onMark(pick)} disabled={!pick} className={PRIMARY} data-testid="filter-mark">
        <Filter className="h-4 w-4" /> {t("crud.filter.mark")}
      </button>
    </div>
  );
}
