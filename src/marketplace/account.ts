import { create } from "zustand";
import { FREE_EXPORTS, FREE_SITES, MAX_DESIGNS } from "../config/quota";
import { api, ApiError } from "../api/client";
import { qk, queryClient } from "../api/queryClient";
import { isBackendConfigured } from "../pages/media/processing/apiConfig";
import { useBilling } from "../pages/media/processing/billing";
import type { EntitlementSnapshot, ItemId, SimTransaction } from "./types";

/* ================================================================== */
/* Marketplace account from the SERVER (GET /marketplace/account)       */
/*                                                                    */
/* Balance, template/item ownership, design & website quotas, and         */
/* history comes ONLY from backend responses. Nothing is stored in       */
/* localStorage: every page open → reload from the server.              */
/* ================================================================== */

interface QuotaUsage {
  used: number;
  max: number;
}

export interface AccountLimits {
  designs: QuotaUsage;
  sites: QuotaUsage;
  exports: { used: number; free: number; remaining: number; cost: number };
}

export interface MarketAccount {
  balance: number;
  entitlements: EntitlementSnapshot;
  /** Extra page designs from design packs. */
  extraDesigns: number;
  /** Extra website folder slots (website packs + single slots). */
  extraSites: number;
  transactions: SimTransaction[];
  limits: AccountLimits;
}

const DEFAULT_LIMITS: AccountLimits = {
  designs: { used: 0, max: MAX_DESIGNS },
  sites: { used: 0, max: FREE_SITES },
  exports: { used: 0, free: FREE_EXPORTS, remaining: FREE_EXPORTS, cost: 1 },
};

export const emptyAccount = (): MarketAccount => ({
  balance: 0,
  entitlements: { templates: [], templateGrants: [], items: [] },
  extraDesigns: 0,
  extraSites: 0,
  transactions: [],
  limits: structuredClone(DEFAULT_LIMITS),
});

/* ------------------------------------------------------------------ */
/* Server response validation (odd data dropped, never throws)           */
/* ------------------------------------------------------------------ */

const ITEM_RE = /^(template|preset|element|event|feature):[\w-]{1,80}$/;
const ID_RE = /^[\w-]{1,80}$/;
const MAX_TX = 100;
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const round = (n: number) => Math.round(n * 100) / 100;
const KINDS = new Set(["template", "item", "design-pack", "site-pack", "topup", "template-use", "usage", "adjustment"]);

function usage(raw: unknown, d: QuotaUsage): QuotaUsage {
  if (!isObj(raw)) return { ...d };
  return { used: Math.max(0, Math.floor(num(raw.used, d.used))), max: Math.max(0, Math.floor(num(raw.max, d.max))) };
}

export function sanitizeAccount(raw: unknown): MarketAccount {
  if (!isObj(raw)) return emptyAccount();
  const e = isObj(raw.entitlements) ? raw.entitlements : {};
  const uniq = <T,>(list: T[], key: (t: T) => string) => list.filter((x, i) => list.findIndex((y) => key(y) === key(x)) === i);
  const templates = uniq(
    arr(e.templates)
      .filter(isObj)
      .filter((t) => typeof t.templateId === "string" && ID_RE.test(t.templateId))
      .map((t) => ({ templateId: t.templateId as string, acquiredAt: num(t.acquiredAt, 0), pricePaid: num(t.pricePaid, 0), source: "server" as const })),
    (t) => t.templateId,
  );
  const templateGrants = uniq(
    arr(e.templateGrants)
      .filter(isObj)
      .filter((g) => typeof g.templateId === "string" && ID_RE.test(g.templateId))
      .map((g) => ({
        templateId: g.templateId as string,
        itemIds: arr(g.itemIds).filter((i): i is ItemId => typeof i === "string" && ITEM_RE.test(i)),
        grantedAt: num(g.grantedAt, 0),
      })),
    (g) => g.templateId,
  );
  const items = uniq(
    arr(e.items)
      .filter(isObj)
      .filter((i) => typeof i.itemId === "string" && ITEM_RE.test(i.itemId))
      .map((i) => ({ itemId: i.itemId as string, acquiredAt: num(i.acquiredAt, 0), pricePaid: num(i.pricePaid, 0), source: "server" as const })),
    (i) => i.itemId,
  );
  const transactions = arr(raw.transactions)
    .filter(isObj)
    .filter((t) => typeof t.id === "string" && KINDS.has(t.kind as string))
    .slice(0, MAX_TX)
    .map((t) => ({
      id: t.id as string,
      kind: t.kind as SimTransaction["kind"],
      credits: num(t.credits, 0),
      at: num(t.at, 0),
      ...(typeof t.description === "string" ? { description: t.description.slice(0, 200) } : {}),
      ...(typeof t.itemId === "string" && ITEM_RE.test(t.itemId) ? { itemId: t.itemId } : {}),
      ...(typeof t.designs === "number" && t.designs > 0 ? { designs: Math.floor(t.designs) } : {}),
      ...(typeof t.sites === "number" && t.sites > 0 ? { sites: Math.floor(t.sites) } : {}),
    }));
  const l = isObj(raw.limits) ? raw.limits : {};
  const ex = isObj(l.exports) ? l.exports : {};
  return {
    balance: Math.max(0, round(num(raw.balance, 0))),
    entitlements: { templates, templateGrants, items },
    extraDesigns: Math.max(0, Math.floor(num(raw.extraDesigns, 0))),
    extraSites: Math.max(0, Math.floor(num(raw.extraSites, 0))),
    transactions,
    limits: {
      designs: usage(l.designs, DEFAULT_LIMITS.designs),
      sites: usage(l.sites, DEFAULT_LIMITS.sites),
      exports: {
        used: Math.max(0, Math.floor(num(ex.used, 0))),
        free: Math.max(0, Math.floor(num(ex.free, FREE_EXPORTS))),
        remaining: Math.max(0, Math.floor(num(ex.remaining, FREE_EXPORTS))),
        cost: Math.max(0, num(ex.cost, 1)),
      },
    },
  };
}

/* ------------------------------------------------------------------ */
/* Store                                                                */
/* ------------------------------------------------------------------ */

type Status = "idle" | "loading" | "ready" | "anonymous" | "unavailable" | "error";

interface MarketStore {
  account: MarketAccount;
  status: Status;
  error: string | null;
}

export const useMarketStore = create<MarketStore>(() => ({ account: emptyAccount(), status: "idle", error: null }));

/** Applies the account from a server response (and the billing balance when included). */
export function commitAccount(raw: unknown, billing?: unknown): MarketAccount {
  const account = sanitizeAccount(raw);
  useMarketStore.setState({ account, status: "ready", error: null });
  queryClient.setQueryData(qk.market, raw);
  if (billing) {
    useBilling.getState().setAccountFromServer(billing);
    // Balance changed → the transaction history on the Credits page needs reloading.
    void queryClient.invalidateQueries({ queryKey: qk.billing });
  }
  return account;
}

/** Partially update the quota (e.g. from a design sync / export response). */
export function patchLimits(patch: Partial<AccountLimits>) {
  useMarketStore.setState((s) => ({ account: { ...s.account, limits: { ...s.account.limits, ...patch } } }));
}

let inflight: Promise<void> | null = null;
export function refreshMarketAccount(): Promise<void> {
  if (!isBackendConfigured()) {
    useMarketStore.setState({ status: "unavailable", account: emptyAccount() });
    return Promise.resolve();
  }
  inflight ??= (async () => {
    useMarketStore.setState({ status: "loading", error: null });
    try {
      // Through the query cache: parallel calls from several components = one request.
      commitAccount(await queryClient.fetchQuery({ queryKey: qk.market, queryFn: ({ signal }) => api("/marketplace/account", { signal }), staleTime: 0, retry: false }));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) useMarketStore.setState({ status: "anonymous", account: emptyAccount(), error: null });
      else useMarketStore.setState({ status: "error", error: e instanceof Error ? e.message : String(e) });
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** Clear on sign-out. */
export const resetMarketAccount = () => useMarketStore.setState({ account: emptyAccount(), status: "anonymous", error: null });
