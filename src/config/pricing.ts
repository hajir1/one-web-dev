/* ================================================================== */
/* CENTRAL PRICING CONFIGURATION                                        */
/*                                                                    */
/*  1. Credit packs (tiered pricing: the more you buy, the cheaper)      */
/*  2. Credit costs of non-server features (premium templates, website slots…) */
/*  3. Server feature rates (Media & Data) live in                       */
/*     pages/media/processing/pricing.ts → DEFAULT_PRICING               */
/*                                                                    */
/* UI components NEVER hardcode prices; everything reads from            */
/* this file (or from prices sent by the backend and already validated). */
/* Prices here are for DISPLAY only. Charged prices, balances, and       */
/* credit deductions are ALWAYS decided & validated by the backend.      */
/* ================================================================== */

/* All prices are in RUPIAH (IDR, integers). Payments go through        */
/* Midtrans, which only processes IDR; there are no dollar prices/conversions. */

export interface CreditPackage {
  id: string;
  credits: number;
  /** Total pack price (whole rupiah). */
  priceIdr: number;
  /** Marked "Best value"/"Popular". */
  highlight?: boolean;
}

/** Base price of 1 credit (smallest pack). */
export const BASE_IDR_PER_CREDIT = 1000;

/**
 * Default packs (same as backend migration v3). The price per credit drops:
 *   20 → Rp1,000 · 50 → Rp950 · 100 → Rp900 · 250 → Rp850 · 500 → Rp800
 * The smallest pack is Rp20,000 so Midtrans transaction fees (e.g. VA about Rp4,000)
 * do not eat most of the purchase value.
 */
export const DEFAULT_CREDIT_PACKAGES: CreditPackage[] = [
  { id: "credits-20", credits: 20, priceIdr: 20000 },
  { id: "credits-50", credits: 50, priceIdr: 47500 },
  { id: "credits-100", credits: 100, priceIdr: 90000, highlight: true },
  { id: "credits-250", credits: 250, priceIdr: 212500 },
  { id: "credits-500", credits: 500, priceIdr: 400000 },
];

/** Price per credit of a pack (rupiah, rounded). */
export const pricePerCredit = (p: CreditPackage) => Math.round(p.priceIdr / p.credits);

/** Base price = the HIGHEST price per credit (smallest pack). Used to compute savings. */
export function baseRate(packages: CreditPackage[] = DEFAULT_CREDIT_PACKAGES): number {
  return packages.length ? Math.max(...packages.map((p) => p.priceIdr / p.credits)) : BASE_IDR_PER_CREDIT;
}

/** Lowest price per credit (largest pack). */
export function bestRate(packages: CreditPackage[] = DEFAULT_CREDIT_PACKAGES): number {
  return packages.length ? Math.min(...packages.map((p) => p.priceIdr / p.credits)) : BASE_IDR_PER_CREDIT;
}

/** Savings compared to buying at the base price: { listIdr, idr, percent } (whole rupiah, transparent). */
export function packageSavings(p: CreditPackage, packages: CreditPackage[] = DEFAULT_CREDIT_PACKAGES) {
  const list = Math.round(baseRate(packages) * p.credits);
  const idr = Math.max(0, list - p.priceIdr);
  const percent = list > 0 ? Math.round((idr / list) * 100) : 0;
  return { listIdr: list, idr, percent };
}

/** Rupiah format without decimals, e.g. 47500 → "Rp47.500". */
export function formatIdr(amount: number): string {
  return `Rp${Math.round(amount).toLocaleString("id-ID")}`;
}

/** Rupiah value of a number of credits at the base price (for the "≈ RpX" note). */
export const creditsToIdr = (credits: number) => Math.round(credits * BASE_IDR_PER_CREDIT);

/**
 * Validates a pack list (from the backend or config): unique ids, positive
 * numbers, integer rupiah prices, and the price per credit does NOT rise
 * as the credit amount rises. Returns the sorted list, or null.
 */
export function sanitizePackages(raw: unknown): CreditPackage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 12) return null;
  const out: CreditPackage[] = [];
  const ids = new Set<string>();
  for (const r of raw) {
    if (!r || typeof r !== "object") return null;
    const v = r as Record<string, unknown>;
    const id = typeof v.id === "string" && /^[\w-]{1,40}$/.test(v.id) ? v.id : null;
    const credits = typeof v.credits === "number" && Number.isInteger(v.credits) && v.credits > 0 && v.credits <= 100000 ? v.credits : null;
    const price = typeof v.priceIdr === "number" && Number.isInteger(v.priceIdr) && v.priceIdr > 0 ? v.priceIdr : null;
    if (!id || credits === null || price === null || ids.has(id)) return null;
    ids.add(id);
    out.push({ id, credits, priceIdr: price, ...(v.highlight === true ? { highlight: true } : {}) });
  }
  out.sort((a, b) => a.credits - b.credits);
  for (let i = 1; i < out.length; i++) if (out[i].priceIdr / out[i].credits > out[i - 1].priceIdr / out[i - 1].credits + 1e-9) return null;
  return out;
}

/* ------------------------------------------------------------------ */
/* Credit costs for non-server features (Web Maker).                    */
/* One place, used by the credit dialog, the Credits page, and templates. */
/* ------------------------------------------------------------------ */

export type CreditFeature =
  | "export"
  | "site-slot"
  | "premium-preset"
  | "premium-event"
  | "premium-element"
  | "premium-template"
  | "premium-vr"
  | "media-server"
  | "data-server";

/**
 * Cost (credits; 1 credit = Rp1,000) per purchase/access. `null` = follows the
 * server feature rate. Display values; charged prices come from the backend.
 */
export const CREDIT_COST: Record<CreditFeature, number | null> = {
  export: 5,
  "site-slot": 15,
  "premium-preset": 10,
  "premium-event": 5,
  "premium-element": 10,
  "premium-template": 40,
  "premium-vr": 50,
  "media-server": null,
  "data-server": null,
};
