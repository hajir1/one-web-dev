import { useTranslation } from "react-i18next";
import { Database } from "lucide-react";
import { CRUD_STACKS, type CrudStack } from "../../helpers/crud";

/* ================================================================== */
/* Code panel › "Include CRUD": include a CRUD dashboard + backend for   */
/* the website's data collections. The stack choice sets the export format: */
/* Laravel → Laravel Blade, Node.js (Express) → HTML in public/.         */
/* ================================================================== */

export default function CrudExportBar({
  collections,
  enabled,
  stack,
  active,
  onToggle,
  onStack,
}: {
  /** Collection name on the website. */
  collections: string[];
  enabled: boolean;
  stack: CrudStack;
  /** The selected format matches the stack (CRUD is really included). */
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
