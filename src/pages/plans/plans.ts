// ─── plans/plans.ts ──────────────────────────────────────────────────────────
// v11: Media & Data subscription plans (monthly/yearly, quota per month).
//
// The numbers here = display fallbacks and MATCH the backend
// (src/billing/catalog/plans.ts). The backend bills and deducts quota;
// the frontend never changes plans/quotas itself.
//
// ┌─ BACKEND ────────────────────────────────────────────────────────────┐
// │ GET  /billing/plans                → plan catalog + add-ons (public)
// │ GET  /billing/subscription         → { current, personal, team }
// │ POST /billing/subscription/quote   { plan, interval, forTeam? } → price & discount
// │ POST /billing/subscription/buy     + Idempotency-Key → pay with the credit balance
// │ POST /billing/subscription/checkout { …, returnUrl } + Idempotency-Key → URL Midtrans
// │ POST /billing/subscription/addon   { addon: "units" | "video" } + Idempotency-Key
// └───────────────────────────────────────────────────────────────────────┘

import i18n from "../../i18n";
import { apiFetch } from "../../api/client";
import { invalidateAccountQueries, queryClient, STALE } from "../../api/queryClient";
import { isBackendConfigured, readJson } from "../media/processing/apiConfig";
import { BillingError, BillingUnavailableError, safeCheckoutUrl, useBilling } from "../media/processing/billing";
import { int, iso, sanitizeCatalog, sanitizeSummary, type AddonId, type PaidPlanId, type PlanInterval, type PlanQuote } from "./planCore";

export * from "./planCore";

/* ------------------------------- API ------------------------------- */

const randomKey = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

async function call(path: string, init: RequestInit = {}): Promise<Record<string, unknown>> {
  if (!isBackendConfigured()) throw new BillingUnavailableError();
  let res: Response;
  try {
    res = await apiFetch(path, init);
  } catch {
    throw new BillingError(i18n.t("errors.billing.network"));
  }
  const body = await readJson(res);
  if (!res.ok) throw new BillingError(typeof body.error === "string" ? body.error : i18n.t("errors.billing.status", { status: res.status }), res.status);
  return body;
}

const post = (path: string, body: object, idem = false) =>
  call(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(idem ? { "Idempotency-Key": `plan-${randomKey()}` } : {}) },
    body: JSON.stringify(body),
  });

export const planKeys = {
  catalog: ["billing", "plans"] as const,
  subscription: ["billing", "subscription"] as const,
};

export const catalogQuery = {
  queryKey: planKeys.catalog,
  queryFn: async () => sanitizeCatalog(await call("/billing/plans")),
  staleTime: STALE.long,
};

export const subscriptionQuery = {
  queryKey: planKeys.subscription,
  queryFn: async () => {
    const s = sanitizeSummary(await call("/billing/subscription"));
    if (!s) throw new BillingError(i18n.t("errors.server.invalidResponse"));
    return s;
  },
  staleTime: STALE.short,
};

/** Stores a plan transaction result from the server response (account + plan summary). */
function record(body: Record<string, unknown>) {
  if (body.account) useBilling.getState().setAccountFromServer({ ...(body.account as object), subscription: (body.subscription as { current?: unknown } | undefined)?.current });
  const s = sanitizeSummary(body.subscription);
  if (s) queryClient.setQueryData(planKeys.subscription, s);
  invalidateAccountQueries();
  return s;
}

export async function quotePlan(plan: PaidPlanId, interval: PlanInterval, forTeam: boolean): Promise<PlanQuote> {
  const b = await post("/billing/subscription/quote", { plan, interval, ...(forTeam ? { forTeam } : {}) });
  return {
    plan,
    interval,
    action: b.action === "renew" || b.action === "upgrade" ? b.action : "new",
    priceIdr: int(b.priceIdr) ?? 0,
    creditIdr: int(b.creditIdr) ?? 0,
    finalIdr: int(b.finalIdr) ?? 0,
    credits: typeof b.credits === "number" ? b.credits : 0,
    startsAt: iso(b.startsAt) ?? "",
    endsAt: iso(b.endsAt) ?? "",
  };
}

/** Pay for a plan with the credit balance. */
export async function buyPlanWithCredits(plan: PaidPlanId, interval: PlanInterval, forTeam: boolean) {
  return record(await post("/billing/subscription/buy", { plan, interval, ...(forTeam ? { forTeam } : {}) }, true));
}

/** Pay for a plan via Midtrans → checkout URL (the plan activates after the paid webhook). */
export async function startPlanCheckout(plan: PaidPlanId, interval: PlanInterval, forTeam: boolean, returnUrl: string): Promise<string> {
  const b = await post("/billing/subscription/checkout", { plan, interval, returnUrl, ...(forTeam ? { forTeam } : {}) }, true);
  const url = safeCheckoutUrl(b.checkoutUrl);
  if (!url) throw new BillingError(i18n.t("errors.billing.invalidCheckout"));
  return url;
}

/** Extra quota for the current month (paid with credits). */
export async function buyAddon(addon: AddonId) {
  return record(await post("/billing/subscription/addon", { addon }, true));
}
