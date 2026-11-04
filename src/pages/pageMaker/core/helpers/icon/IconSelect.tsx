import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../../../../../components/app/LocaleLink";
import { Search, Settings } from "lucide-react";
import { useIconStore, sanitizeSvg, resizeSvg } from "../../store/iconStore";

interface IconSelectProps {
  /** id of the currently selected icon, or null for "no icon". */
  value: string | null;
  onChange: (iconId: string | null) => void;
  /** Path to the global icon manager page (add/rename/delete). Optional. */
  manageHref?: string;
}

/**
 * A lightweight picker for element makers (Button, Card, etc.): only shows
 * & selects icons from the same global library (useIconStore). Because
 * the store is persisted to localStorage, icons added through the
 * "Global Icons" page show up here automatically without any refresh;
 * both places read from the same single data source.
 */
export default function IconSelect({
  value,
  onChange,
  manageHref,
}: IconSelectProps) {
  const { t } = useTranslation();
  const icons = useIconStore((s) => s.icons);
  const [query, setQuery] = useState("");

  const filtered = icons.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2.5 ">
      <div className="flex items-center gap-1.5">
        <div className="flex-1 flex items-center gap-1.5 rounded border border-gray-300 dark:border-gray-700 px-2 py-1.5 ">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("el.icon.search")}
            className="flex-1 min-w-0 text-xs bg-transparent outline-none text-gray-700 dark:text-gray-300"
          />
        </div>
        {manageHref && (
          <Link
            to={manageHref}
            title={t("el.icon.manage")}
            className="inline-flex items-center justify-center rounded border border-gray-300 dark:border-gray-700 p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white/90 flex-shrink-0"
          >
            <Settings size={13} />
          </Link>
        )}
      </div>

      <button
        onClick={() => onChange(null)}
        className={`self-start px-2.5 py-1.5 rounded text-xs font-medium border ${
          value === null
            ? "border-blue-800 text-blue-800 dark:text-blue-400"
            : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
        }`}
      >
        {t("el.icon.none")}
      </button>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-4 gap-1.5 max-h-[220px] overflow-y-auto">
          {filtered.map((icon) => (
            <button
              key={icon.id}
              onClick={() => onChange(icon.id)}
              title={icon.name}
              className={`rounded border p-1.5 flex flex-col items-center gap-1 ${
                value === icon.id
                  ? "border-blue-800 bg-blue-50 dark:bg-blue-900/10"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <span
                className="w-6 h-6 text-gray-700 dark:text-gray-300 flex items-center justify-center"
                dangerouslySetInnerHTML={{
                  __html: resizeSvg(sanitizeSvg(icon.svg), 24),
                }}
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full text-center">
                {icon.name}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">
          {icons.length === 0
            ? t("el.icon.libraryEmpty")
            : t("el.icon.noMatch")}
        </p>
      )}
    </div>
  );
}
