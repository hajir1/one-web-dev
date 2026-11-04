import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { ApiError } from "../../api/client";

/* ================================================================== */
/* Consistent loading & error display for API data                      */
/* (used together with the TanStack Query hooks in api/queries.ts).     */
/* ================================================================== */

/** Pulsing gray block shown in place of content that is loading. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-lg bg-gray-200/80 dark:bg-white/10 ${className}`} />;
}

/** Skeleton rows (transaction list, tables). */
export function SkeletonRows({ rows = 4, testId }: { rows?: number; testId?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 p-4" role="status" aria-busy="true" aria-label={t("query.loading")} data-testid={testId}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton card (template catalog). */
export function SkeletonCards({ count = 6, testId }: { count?: number; testId?: string }) {
  const { t } = useTranslation();
  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label={t("query.loading")} data-testid={testId}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/40">
          <Skeleton className="h-52 rounded-none" />
          <div className="flex flex-col gap-3 p-5">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Friendly message per error type (network, too many requests, server). */
function errorMessage(error: unknown, t: (k: string) => string): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return error.code === "API_UNAVAILABLE" ? error.message : t("query.network");
    if (error.status === 429) return t("query.tooMany");
    if (error.status >= 500) return t("query.server");
    return error.message;
  }
  if ((error as Error)?.name === "TypeError") return t("query.network");
  return error instanceof Error && error.message ? error.message : t("errors.unknown");
}

/** Error box with a "Try again" button. */
export function QueryError({ error, onRetry, title, retrying, testId, compact }: { error: unknown; onRetry?: () => void; title?: ReactNode; retrying?: boolean; testId?: string; compact?: boolean }) {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      data-testid={testId}
      className={`flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 ${compact ? "p-3" : "p-4"}`}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">{title ?? t("query.errorTitle")}</p>
        <p className="mt-0.5 opacity-90">{errorMessage(error, t)}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-60 dark:border-rose-500/40 dark:bg-transparent dark:text-rose-200"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} /> {t("common.retry")}
        </button>
      )}
    </div>
  );
}
