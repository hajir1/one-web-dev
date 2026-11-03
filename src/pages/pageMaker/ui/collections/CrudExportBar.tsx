import { useTranslation } from "react-i18next";
import { Database } from "lucide-react";
import { CRUD_STACKS, type CrudStack } from "../../helpers/crud";

/* ================================================================== */
/* Panel Kode › "Include CRUD": sertakan dashboard CRUD + backend untuk  */
/* koleksi data di website. Pilihan stack mengatur format ekspor:        */
/* Laravel → Laravel Blade, Node.js (Express) → HTML di public/.         */
/* ================================================================== */

export default function CrudExportBar({
  collections,
  enabled,
  stack,
  active,
  onToggle,
  onStack,
}: {
  /** Nama koleksi di website. */
  collections: string[];
  enabled: boolean;
  stack: CrudStack;
  /** Format yang dipilih cocok dengan stack (CRUD benar-benar ikut). */
  active: boolean;
  onToggle: (on: boolean) => void;
  onStack: (s: CrudStack) => void;
}) {
  const { t } = useTranslation();
  const none = collections.length === 0;
  return (
    <div className="mb-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800" data-testid="crud-export">
      <label className="flex items-start gap-2.5">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-blue-800" checked={enabled && !none} disabled={none} onChange={(e) => onToggle(e.target.checked)} data-testid="crud-include" />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Database className="h-4 w-4 text-blue-800 dark:text-blue-400" /> {t("crud.export.title")}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {none ? t("crud.export.none") : t("crud.export.text", { names: collections.join(", ") })}
          </span>
        </span>
      </label>
      {enabled && !none && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-6.5" role="radiogroup" aria-label={t("crud.export.stack")}>
          <span className="mr-1 text-xs text-gray-500 dark:text-gray-400">{t("crud.export.stack")}</span>
          {CRUD_STACKS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={stack === s.id && active}
              onClick={() => onStack(s.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${stack === s.id && active ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-600 hover:opacity-80 dark:bg-gray-800 dark:text-gray-300"}`}
              data-testid={`crud-stack-${s.id}`}
            >
              {s.label}
            </button>
          ))}
          {!active && <span className="w-full text-xs text-amber-700 dark:text-amber-400">{t("crud.export.pickStack")}</span>}
        </div>
      )}
    </div>
  );
}
