// ─── api/queries.ts ──────────────────────────────────────────────────────────
// TanStack Query hooks per resource. Components use these hooks instead of fetching
// directly, so the same data is shared (cached), requests
// in parallel are merged, and loading/error states are consistent.
//
//   useTemplatesPage(params)   GET /templates?page&limit&tier&category&q&sort
//   useTemplatesInfinite(p)    same, loaded in steps of 12 per batch (infinite scroll, v7)
//   useTemplateDetail(id)      GET /templates/:id
//   useCatalogQuery()          full catalog (templates + sections + elements) for Web Market
//   useTransactions(limit)     GET /billing/transactions
//   useReferral()              GET /referrals/me
//   useMfaStatus()             GET /auth/2fa
//
// Account data used by many older components (balance, marketplace account, session)
// is still available through zustand stores, but it is also fetched through the same
// query cache (see billing.ts, marketplace/account.ts).

import { useEffect } from "react";
import { infiniteQueryOptions, keepPreviousData, useInfiniteQuery, useQuery, type QueryClient } from "@tanstack/react-query";
import { api, ApiError } from "./client";
import { qk, queryClient, STALE } from "./queryClient";
import { isBackendConfigured } from "../pages/media/processing/apiConfig";
import { sanitizeTemplate, catalogRepository } from "../marketplace/repository";
import { setServerPromo } from "../marketplace/promo";
import type { TemplateCatalogItem, Tier } from "../marketplace/types";
import type { TemplateSort } from "../marketplace/catalogQuery";
import { mfaStatus } from "../auth/session";
import { currentLang } from "../i18n";
import { transactionsQuery } from "../pages/media/processing/billing";
import { catalogQuery as plansCatalogQuery, subscriptionQuery } from "../pages/plans/plans";
import { isDemoMode } from "../demo/demoMode";

/** Demo mode (v12): template catalog in the frontend (v13: every template), loaded separately. */
const demoTemplates = () => import("../demo/demoTemplates");

const langOf = (lng?: string) => (lng?.startsWith("en") ? "en" : "id");

/* ------------------------------------------------------------------ */
/* Templates: paginated list (server-side pagination)                   */
/* ------------------------------------------------------------------ */

export const TEMPLATES_PER_PAGE = 10;

export interface TemplatesPageParams {
  lang: string;
  page: number;
  limit?: number;
  tier: "all" | Tier;
  category: string;
  q: string;
  sort: TemplateSort;
}

export interface TemplatesPage {
  templates: TemplateCatalogItem[];
  page: number;
  pages: number;
  limit: number;
  /** Count after filtering. */
  total: number;
  /** Count of all published templates. */
  totalAll: number;
  /** Count per tier tab for the category filter + active search. */
  facets: { all: number; free: number; premium: number };
}

const int = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : d);

/** Validate the template page response (broken entries dropped, odd numbers replaced with defaults). */
export function sanitizeTemplatesPage(raw: unknown, params: TemplatesPageParams): TemplatesPage {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const templates = (Array.isArray(r.templates) ? r.templates : []).map(sanitizeTemplate).filter((t): t is TemplateCatalogItem => !!t);
  const limit = int(r.limit, params.limit ?? TEMPLATES_PER_PAGE) || TEMPLATES_PER_PAGE;
  const total = int(r.total, templates.length);
  const f = (r.facets && typeof r.facets === "object" ? (r.facets as Record<string, unknown>).tier : null) as Record<string, unknown> | null;
  return {
    templates,
    page: Math.max(1, int(r.page, params.page)),
    pages: Math.max(1, int(r.pages, Math.ceil(total / limit))),
    limit,
    total,
    totalAll: int(r.totalAll, total),
    facets: { all: int(f?.all, total), free: int(f?.free, 0), premium: int(f?.premium, 0) },
  };
}

async function fetchTemplatesPage(p: TemplatesPageParams & { limit: number }, signal?: AbortSignal): Promise<TemplatesPage> {
  if (isDemoMode()) return (await demoTemplates()).demoTemplatesPage(p);
  const qs = new URLSearchParams({ lang: langOf(p.lang), page: String(p.page), limit: String(p.limit) });
  if (p.tier !== "all") qs.set("tier", p.tier);
  if (p.category !== "all") qs.set("category", p.category);
  if (p.q.trim()) qs.set("q", p.q.trim().slice(0, 100));
  if (p.sort !== "featured") qs.set("sort", p.sort);
  const raw = await api<Record<string, unknown>>(`/templates?${qs}`, { signal });
  if ("promo" in raw) setServerPromo(raw.promo);
  // v21.2: Code Templates are registered in backend v14 (kind "code") → included in the server list.
  return sanitizeTemplatesPage(raw, p);
}

function templatesPageQuery(params: TemplatesPageParams) {
  const p = { ...params, limit: params.limit ?? TEMPLATES_PER_PAGE };
  return {
    queryKey: qk.templatesPage(p),
    queryFn: ({ signal }: { signal?: AbortSignal }) => fetchTemplatesPage(p, signal),
    staleTime: STALE.medium,
  };
}

/* ------------------------------------------------------------------ */
/* Template: infinite scroll (v7)                                        */
/* ------------------------------------------------------------------ */

/** Jumlah template per muatan infinite scroll. */
export const TEMPLATES_PER_LOAD = 12;

export type TemplatesListParams = Omit<TemplatesPageParams, "page">;

/**
 * The template catalog loads in batches (server page/limit pagination). The query key
 * includes the filters, so changing a filter/search = a new list starting from batch 1;
 * going back to an earlier filter uses the cache (loaded batches are kept).
 */
export function templatesInfiniteQuery(params: TemplatesListParams) {
  const p = { lang: params.lang, tier: params.tier, category: params.category, q: params.q.trim(), sort: params.sort, limit: params.limit ?? TEMPLATES_PER_LOAD };
  return infiniteQueryOptions({
    queryKey: qk.templatesInfinite(p),
    queryFn: ({ pageParam, signal }) => fetchTemplatesPage({ ...p, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (last: TemplatesPage) => (last.page < last.pages ? last.page + 1 : undefined),
    staleTime: STALE.medium,
  });
}

export function useTemplatesInfinite(params: TemplatesListParams) {
  return useInfiniteQuery(templatesInfiniteQuery(params));
}

/** Merge batches into one list; duplicate templates (data shifting between batches) are dropped. */
export function flattenTemplatePages(pages: readonly TemplatesPage[] | undefined): TemplateCatalogItem[] {
  const seen = new Set<string>();
  const out: TemplateCatalogItem[] = [];
  for (const p of pages ?? [])
    for (const t of p.templates)
      if (!seen.has(t.refId)) {
        seen.add(t.refId);
        out.push(t);
      }
  return out;
}

/** Prepare the first catalog batch (e.g. when the cursor is over the menu). */
const prefetchTemplatesInfinite = (params: TemplatesListParams, client: QueryClient = queryClient) =>
  isBackendConfigured() || isDemoMode() ? client.prefetchInfiniteQuery(templatesInfiniteQuery(params)) : Promise.resolve();

/**
 * One page of the template catalog. `placeholderData: keepPreviousData` → when
 * changing page/filter, the old list stays visible (dimmed) until the new data
 * arrives, with no blank screen. The next page is prefetched automatically.
 */
export function useTemplatesPage(params: TemplatesPageParams) {
  const opts = templatesPageQuery(params);
  const query = useQuery({ ...opts, placeholderData: keepPreviousData });
  const next = query.data && !query.isPlaceholderData && params.page < query.data.pages ? params.page + 1 : null;
  const nextKey = next ? JSON.stringify({ ...params, page: next }) : null;
  useEffect(() => {
    if (nextKey) void queryClient.prefetchQuery(templatesPageQuery(JSON.parse(nextKey) as TemplatesPageParams));
  }, [nextKey]);
  return query;
}

/** Prefetch one catalog page (e.g. when the cursor is over a page button). */
export const prefetchTemplatesPage = (params: TemplatesPageParams, client: QueryClient = queryClient) =>
  isBackendConfigured() || isDemoMode() ? client.prefetchQuery(templatesPageQuery(params)) : Promise.resolve();

const DEFAULT_TEMPLATES_PAGE = (lang = currentLang()): TemplatesPageParams => ({ lang, page: 1, tier: "all", category: "all", q: "", sort: "featured" });

/* ------------------------------------------------------------------ */
/* Template: detail                                                      */
/* ------------------------------------------------------------------ */

function templateDetailQuery(lang: string, id: string) {
  return {
    queryKey: qk.template(langOf(lang), id),
    queryFn: async ({ signal }: { signal?: AbortSignal }) => {
      if (isDemoMode()) {
        const d = (await demoTemplates()).demoTemplateDetail(lang, id);
        if (!d) throw new ApiError("TEMPLATE_NOT_FOUND", 404, "TEMPLATE_NOT_FOUND");
        return d;
      }
      const t = sanitizeTemplate(await api(`/templates/${encodeURIComponent(id)}?lang=${langOf(lang)}`, { signal }));
      if (!t) throw new Error("TEMPLATE_INVALID");
      return t;
    },
    staleTime: STALE.medium,
  };
}

export function useTemplateDetail(lang: string, id: string | undefined, initial?: TemplateCatalogItem | null) {
  return useQuery({
    ...templateDetailQuery(lang, id ?? ""),
    enabled: !!id,
    // Data from the catalog card is enough to render instantly.
    initialData: initial ?? undefined,
  });
}

/** Fill the detail cache from card data → opening the preview does not wait for the network. */
export function seedTemplateDetail(lang: string, tpl: TemplateCatalogItem) {
  const key = qk.template(langOf(lang), tpl.refId);
  if (!queryClient.getQueryData(key)) queryClient.setQueryData(key, tpl);
}

/* ------------------------------------------------------------------ */
/* Full catalog (Web Market, built-in template items)                    */
/* ------------------------------------------------------------------ */

export const catalogQuery = (lang: string) => ({
  queryKey: qk.catalog(langOf(lang)),
  queryFn: () => catalogRepository.getCatalog(langOf(lang)),
  staleTime: STALE.medium,
});

/* ------------------------------------------------------------------ */
/* Account: transactions, referrals, 2FA                                 */
/* ------------------------------------------------------------------ */

export function useTransactions(limit = 50, enabled = true) {
  return useQuery({ ...transactionsQuery(limit), enabled: enabled && isBackendConfigured() });
}

export interface ReferralInfo {
  code: string;
  active: boolean;
  shareUrl: string;
  timesUsed: number;
  discountPercent: number;
  maxDiscountIdr: number;
  rewardCredits: number;
  rewardsEarned: number;
  firstPurchaseOnly: boolean;
  voucherValidDays: number;
  /** The code this account used when signing up (if any). */
  usedReferral: { code: string; at?: string } | null;
}

const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : d);

export function sanitizeReferral(raw: unknown): ReferralInfo | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.code !== "string" || !/^[A-Z0-9]{4,16}$/.test(r.code)) return null;
  const used = r.usedReferral && typeof r.usedReferral === "object" ? (r.usedReferral as Record<string, unknown>) : null;
  return {
    code: r.code,
    active: r.active !== false,
    shareUrl: typeof r.shareUrl === "string" && /^https?:\/\//.test(r.shareUrl) ? r.shareUrl : "",
    timesUsed: num(r.timesUsed),
    discountPercent: num(r.discountPercent),
    maxDiscountIdr: num(r.maxDiscountIdr),
    rewardCredits: num(r.rewardCredits),
    rewardsEarned: num(r.rewardsEarned),
    firstPurchaseOnly: r.firstPurchaseOnly !== false,
    voucherValidDays: num(r.voucherValidDays),
    usedReferral:
      used && typeof used.code === "string"
        ? { code: used.code, ...(typeof used.redeemedAt === "string" ? { at: used.redeemedAt } : typeof used.at === "string" ? { at: used.at } : {}) }
        : null,
  };
}

const referralQuery = {
  queryKey: qk.referral,
  queryFn: async ({ signal }: { signal?: AbortSignal }) => {
    const r = sanitizeReferral(await api("/referrals/me", { signal }));
    if (!r) throw new Error("REFERRAL_INVALID");
    return r;
  },
  staleTime: STALE.short,
};

export const useReferral = (enabled = true) => useQuery({ ...referralQuery, enabled: enabled && isBackendConfigured() });

/** Apply a friend's code (existing account that has never purchased). */
export async function redeemReferral(code: string) {
  const r = await api<{ voucher: unknown }>("/referrals/redeem", { body: { code } });
  void queryClient.invalidateQueries({ queryKey: qk.referral });
  void queryClient.invalidateQueries({ queryKey: qk.billing });
  return r;
}

/** Invite link: goes straight to the sign-up page with the code filled in. */
export function referralInviteUrl(info: Pick<ReferralInfo, "code" | "shareUrl">, lang: string, fallbackOrigin = typeof window !== "undefined" ? window.location.origin : ""): string {
  let origin = fallbackOrigin;
  try {
    if (info.shareUrl) origin = new URL(info.shareUrl).origin;
  } catch {
    /* use the page origin */
  }
  return `${origin}/${langOf(lang)}/signup?ref=${encodeURIComponent(info.code)}`;
}

export const useMfaStatus = (enabled = true) =>
  useQuery({ queryKey: qk.mfa, queryFn: () => mfaStatus(), enabled: enabled && isBackendConfigured(), staleTime: STALE.short });

/* ------------------------------------------------------------------ */
/* Prefetch                                                              */
/* ------------------------------------------------------------------ */

const idle = (fn: () => void) => {
  if (typeof window === "undefined") return;
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 3000 });
  else setTimeout(fn, 1500);
};

/** Called once after the session loads: prepare page 1 of the template catalog. */
export function prefetchCommonPages() {
  if (!isBackendConfigured()) return;
  idle(() => void prefetchTemplatesInfinite(DEFAULT_TEMPLATES_PAGE()));
}

/** Prefetch per menu destination (called on cursor/focus over a sidebar link). */
export function prefetchRoute(path: string, signedIn: boolean) {
  if (!isBackendConfigured()) return;
  if (path.endsWith("/web-templates")) void prefetchTemplatesInfinite(DEFAULT_TEMPLATES_PAGE());
  else if (path.endsWith("/web-market")) void queryClient.prefetchQuery(catalogQuery(currentLang()));
  else if (path.endsWith("/credits") && signedIn) void queryClient.prefetchQuery(transactionsQuery(50));
  else if (path.endsWith("/plans")) {
    void queryClient.prefetchQuery(plansCatalogQuery);
    if (signedIn) void queryClient.prefetchQuery(subscriptionQuery);
  } else if (path.endsWith("/profile") && signedIn) void queryClient.prefetchQuery(referralQuery);
}
