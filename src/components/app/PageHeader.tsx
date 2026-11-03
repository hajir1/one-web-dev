import type { ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "./LocaleLink";
import HelpButton from "./HelpButton";
import type { DocTopicId } from "../../config/docs";

/* ================================================================== */
/* Header halaman standar: breadcrumb, ikon, judul, deskripsi, chip,     */
/* aksi, dan tombol Bantuan (dokumentasi menu ini).                      */
/* ================================================================== */

export interface Crumb {
  label: string;
  to?: string;
}

export default function PageHeader({
  icon: Icon,
  title,
  description,
  crumbs,
  chips,
  actions,
  help,
  tileClassName = "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  testId,
}: {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  chips?: ReactNode;
  actions?: ReactNode;
  /** Topik dokumentasi untuk tombol Bantuan. */
  help?: DocTopicId;
  tileClassName?: string;
  testId?: string;
}) {
  return (
    <header className="ow-card ow-hero relative overflow-hidden px-5 py-6 sm:px-7" data-testid={testId}>
      <div aria-hidden className="ow-grid-bg pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 [mask-image:linear-gradient(to_left,black,transparent)] sm:block" />
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="relative mb-3 flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          {crumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
              {c.to ? (
                <Link to={c.to} className="hover:text-gray-800 hover:underline dark:hover:text-white/90">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-gray-700 dark:text-gray-200">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {Icon && (
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tileClassName}`}>
              <Icon className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">{title}</h1>
            {description && <p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>}
            {chips && <div className="mt-3 flex flex-wrap gap-1.5">{chips}</div>}
          </div>
        </div>
        {(actions || help) && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
            {help && <HelpButton topic={help} />}
          </div>
        )}
      </div>
    </header>
  );
}
