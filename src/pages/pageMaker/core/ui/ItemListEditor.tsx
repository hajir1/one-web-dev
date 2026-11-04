import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Field, TextInput } from "../helpers/SmallUIHelpers";

export interface ItemFieldDef<T> {
  key: keyof T & string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
}

/**
 * Editor for structured item lists (title+body, label+href, etc.): add,
 * remove, reorder. Used by Accordion, Tabs, Breadcrumbs, and any
 * new element that needs repeated data.
 */
export default function ItemListEditor<T extends Record<string, string>>({
  items,
  onChange,
  fields,
  newItem,
  itemLabel,
  min = 1,
  max = 20,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: ItemFieldDef<T>[];
  newItem: (index: number) => T;
  itemLabel?: string;
  min?: number;
  max?: number;
}) {
  const { t } = useTranslation();
  const label = itemLabel ?? t("pm.items.item");
  const setField = (idx: number, key: keyof T, value: string) =>
    onChange(items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const iconBtn =
    "p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded border border-gray-200 dark:border-gray-800 p-2.5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-1">
            <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              {label} {idx + 1}
            </span>
            <button
              type="button"
              className={iconBtn}
              onClick={() => move(idx, -1)}
              disabled={idx === 0}
              aria-label={t("pm.items.moveUp", { label, n: idx + 1 })}
            >
              <ArrowUp size={13} />
            </button>
            <button
              type="button"
              className={iconBtn}
              onClick={() => move(idx, 1)}
              disabled={idx === items.length - 1}
              aria-label={t("pm.items.moveDown", { label, n: idx + 1 })}
            >
              <ArrowDown size={13} />
            </button>
            <button
              type="button"
              className={`${iconBtn} hover:!text-rose-600`}
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              disabled={items.length <= min}
              aria-label={t("pm.items.remove", { label, n: idx + 1 })}
            >
              <Trash2 size={13} />
            </button>
          </div>
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              <TextInput
                value={item[f.key] ?? ""}
                onChange={(v) => setField(idx, f.key, v)}
                placeholder={f.placeholder}
                multiline={f.multiline}
                rows={2}
              />
            </Field>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem(items.length)])}
        disabled={items.length >= max}
        className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold border border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40"
      >
        <Plus size={13} /> {t("pm.items.add", { label: label.toLowerCase() })}
      </button>
    </div>
  );
}
