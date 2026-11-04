import { api, ApiError, newIdempotencyKey } from "../api/client";
import { commitAccount, refreshMarketAccount } from "./account";
import { quoteDesigns, quoteSites } from "./pricing";
import type { DesignQuote, PieceCatalogItem, SiteQuote, TemplateCatalogItem } from "./types";

/* ================================================================== */
/* Transaction services (separate from the UI)                          */
/*                                                                    */
/* Every purchase goes through the Nest backend: prices are set by the SERVER, credits */
/* are charged once per idempotency key, and the account is only updated from */
/* server responses. Components never compute balances themselves.      */
/* ================================================================== */

type PurchaseError = "insufficient" | "already-owned" | "not-for-sale" | "invalid" | "signin" | "network";

type CommerceResult = { ok: true } | { ok: false; error: PurchaseError; message?: string };

export interface CommerceService {
  readonly mode: "server";
  purchaseTemplate(tpl: TemplateCatalogItem): Promise<CommerceResult>;
  purchaseItem(item: PieceCatalogItem): Promise<CommerceResult>;
  /** Buys page design quota; the amount is rounded to a pack (see pricing.ts). */
  purchaseDesigns(designs: number): Promise<CommerceResult & { quote?: DesignQuote }>;
  /** Buy extra website folder slots; tiered prices (see pricing.ts). */
  purchaseSites(sites: number): Promise<CommerceResult & { quote?: SiteQuote }>;
}

/** Turns backend HTTP errors into reasons the UI understands. */
function purchaseError(e: unknown): { ok: false; error: PurchaseError; message?: string } {
  if (!(e instanceof ApiError)) return { ok: false, error: "network" };
  const message = e.message;
  if (e.status === 401) return { ok: false, error: "signin", message };
  if (e.status === 402) return { ok: false, error: "insufficient", message };
  if (e.status === 409) return { ok: false, error: "already-owned", message };
  if (e.code === "ITEM_UNKNOWN" || e.code === "TEMPLATE_NOT_FOR_SALE") return { ok: false, error: "not-for-sale", message };
  if (e.status === 0) return { ok: false, error: "network", message };
  return { ok: false, error: "invalid", message };
}

type PurchaseBody = { account?: unknown; billing?: unknown };

/** Double clicks on the same action are merged into one request (one idempotency key). */
const inflight = new Map<string, Promise<CommerceResult>>();
function once(key: string, fn: () => Promise<CommerceResult>) {
  const cur = inflight.get(key);
  if (cur) return cur;
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

async function post(path: string, body: unknown, prefix: string): Promise<CommerceResult> {
  try {
    const r = await api<PurchaseBody>(path, { method: "POST", body, idempotencyKey: newIdempotencyKey(prefix) });
    commitAccount(r.account, r.billing);
    return { ok: true };
  } catch (e) {
    const res = purchaseError(e);
    // Already owned = no new cost; still reload the account so the UI stays in sync.
    if (res.error === "already-owned") void refreshMarketAccount();
    return res;
  }
}

const serverCommerce: CommerceService = {
  mode: "server",
  purchaseTemplate: (tpl) =>
    tpl.tier !== "premium" ? Promise.resolve({ ok: false, error: "not-for-sale" }) : once(tpl.id, () => post(`/templates/${encodeURIComponent(tpl.refId)}/purchase`, {}, "tpl")),
  purchaseItem: (item) => (item.tier !== "premium" ? Promise.resolve({ ok: false, error: "not-for-sale" }) : once(item.id, () => post("/marketplace/purchase", { itemId: item.id }, "item"))),
  purchaseDesigns: async (designs) => {
    const quote = quoteDesigns(designs);
    return { ...(await once(`designs:${quote.designs}`, () => post("/marketplace/design-packs", { designs: quote.designs }, "designs"))), quote };
  },
  purchaseSites: async (sites) => {
    const quote = quoteSites(sites);
    return { ...(await once(`sites:${quote.sites}`, () => post("/marketplace/site-packs", { sites: quote.sites }, "sites"))), quote };
  },
};

export const commerceService: CommerceService = serverCommerce;
