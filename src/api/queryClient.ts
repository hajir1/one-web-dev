// ─── api/queryClient.ts ──────────────────────────────────────────────────────
// One QueryClient (TanStack Query) for the whole app: shared cache,
// merging identical requests (dedup), and retry rules.
//
// General rules (can be overridden per resource in api/queries.ts):
// - staleTime 30 seconds: navigating back and forth does not call the API again.
// - gcTime 10 minutes: unused data is dropped from memory.
// - 4xx errors (401/402/403/404/409/422) are NOT retried: the result will not
//   changes. Network/5xx errors are retried 2× with increasing delays.
// - No refetch when the window regains focus (balance & account are updated
//   explicitly after a transaction via invalidateQueries).

import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./client";

export const STALE = {
  /** Account data that changes often (balance, quota). */
  short: 30_000,
  /** Public catalog (template list, prices). */
  medium: 5 * 60_000,
  /** Nearly static (credit packs, feature prices). */
  long: 30 * 60_000,
} as const;

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  if ((error as Error)?.name === "AbortError") return false;
  // Backend not configured: retrying changes nothing.
  if (error instanceof ApiError && error.code === "API_UNAVAILABLE") return false;
  return failureCount < 2;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE.short,
        // Outside the browser (Node tests) no GC timer, so the process can exit.
        gcTime: typeof window === "undefined" ? Infinity : 10 * 60_000,
        retry: shouldRetry,
        retryDelay: (n) => Math.min(500 * 2 ** n, 4000),
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  });
}

export const queryClient = createQueryClient();

/* ------------------------------------------------------------------ */
/* Query keys per resource (one source, used by hooks & invalidation)    */
/* ------------------------------------------------------------------ */

export const qk = {
  session: ["session"] as const,
  billing: ["billing"] as const,
  billingAccount: ["billing", "account"] as const,
  billingPricing: ["billing", "pricing"] as const,
  billingPackages: ["billing", "packages"] as const,
  transactions: (limit: number) => ["billing", "transactions", limit] as const,
  market: ["market", "account"] as const,
  serverCatalog: ["catalog", "items"] as const,
  catalog: (lang: string) => ["catalog", "snapshot", lang] as const,
  templates: ["templates"] as const,
  templatesPage: (params: object) => ["templates", "page", params] as const,
  templatesInfinite: (params: object) => ["templates", "infinite", params] as const,
  template: (lang: string, id: string) => ["templates", "detail", lang, id] as const,
  referral: ["referral", "me"] as const,
  mfa: ["auth", "2fa"] as const,
};

/**
 * After an action that changes balance/ownership (purchase, paid checkout, admin
 * refund): mark account data as stale so screens using it reload.
 * The balance & marketplace account stores are already updated from the server response.
 */
export function invalidateAccountQueries() {
  void queryClient.invalidateQueries({ queryKey: qk.billing });
  void queryClient.invalidateQueries({ queryKey: qk.market });
  void queryClient.invalidateQueries({ queryKey: qk.referral });
}

/** After an admin changes templates/the catalog. */
export function invalidateCatalogQueries() {
  void queryClient.invalidateQueries({ queryKey: qk.templates });
  void queryClient.invalidateQueries({ queryKey: ["catalog"] });
}

/** When switching accounts/signing out: drop all data that belonged to the previous account. */
export function clearAccountQueries() {
  for (const key of [qk.billing, qk.market, qk.referral, qk.mfa, qk.session]) queryClient.removeQueries({ queryKey: key });
}
