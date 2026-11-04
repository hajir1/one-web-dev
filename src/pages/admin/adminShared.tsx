import {  useEffect,  useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { Chip, INPUT, Notice,  btn } from "../../components/app/ui";

/* Small shared utilities & components for the admin panel (split from AdminPage.tsx, no. 15). */

/** Simple GET with loading/error state + reload. */

/** Run an admin action: success/error toast, then the callback. */

/** After an admin changes the catalog/templates: drop the client cache so the latest prices & lists are used. */

export function Spinner() {
  return (
    <div className="flex justify-center py-10 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export function Loadable({ loading, error, onRetry, children }: { loading: boolean; error: string | null; onRetry: () => void; children: ReactNode }) {
  const { t } = useTranslation();
  if (error)
    return (
      <Notice tone="error">
        {error}{" "}
        <button type="button" onClick={onRetry} className="font-semibold underline">
          {t("admin.retry")}
        </button>
      </Notice>
    );
  return (
    <div className="relative">
      {loading && (
        <div className="absolute right-2 top-2 text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      {children}
    </div>
  );
}

export function ReloadBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  const { t } = useTranslation();
  return (
    <button type="button" onClick={onClick} className={btn.ghost} disabled={loading} aria-label={t("admin.reload")}>
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
    </button>
  );
}

export function Table({ head, children, empty }: { head: ReactNode[]; children: ReactNode; empty?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-gray-100 text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-700 dark:divide-gray-800 dark:text-gray-200">{children}</tbody>
      </table>
      {empty && <p className="py-6 text-center text-sm text-gray-500">{t("admin.empty")}</p>}
    </div>
  );
}

export function Pager({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void }) {
  const { t } = useTranslation();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span>{t("admin.total", { count: total })}</span>
      <div className="flex items-center gap-2">
        <button type="button" className={btn.ghost} disabled={page <= 1} onClick={() => onPage(page - 1)}>
          ‹
        </button>
        <span>
          {page} / {pages}
        </span>
        <button type="button" className={btn.ghost} disabled={page >= pages} onClick={() => onPage(page + 1)}>
          ›
        </button>
      </div>
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        onChange(draft.trim());
      }}
    >
      <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} className={`${INPUT} w-56 pl-8`} />
    </form>
  );
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${INPUT} w-auto`}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function PythonChip({ h }: { h: { configured: boolean; ok: boolean | null } }) {
  const { t } = useTranslation();
  if (!h.configured) return <Chip>{t("admin.python.notConfigured")}</Chip>;
  return <Chip tone={h.ok ? "green" : "rose"}>{h.ok ? t("admin.python.ok") : t("admin.python.down")}</Chip>;
}

/** Shape of a paginated page from /admin/*. */

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/40">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">{value}</p>
    </div>
  );
}
