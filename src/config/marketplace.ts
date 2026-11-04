/* ================================================================== */
/* CATALOG PRICING & PACK RULES (Free/Premium) — one source of numbers    */
/*                                                                    */
/* Used by the template, section, element, and design pack catalogs.    */
/* UI components never hardcode their own numbers.                      */
/*                                                                    */
/* Values here are DISPLAY fallbacks (e.g. before the server catalog     */
/* loads). Charged prices, tiers, and ownership are decided by the server */
/* (Nest backend, editable by admins).                                   */
/* ================================================================== */

/*
 * Price unit: 1 credit = Rp1,000 (larger credit packs are cheaper per credit).
 */

/** Website templates: Free = 0 credits, Premium = 20–300 credits (Rp20k–Rp300k; 15 credits/page + quality bonus, see marketplace/templatePricing.ts). */
export const TEMPLATE_PRICE = { free: 0, premiumMin: 20, premiumMax: 300 } as const;

/** Sections & elements: Free = 0, Premium = 5–10 credits (Rp5k–Rp10k, based on complexity & functional value). */
export const ITEM_PRICE = { free: 0, premiumMin: 5, premiumMax: 10 } as const;

/**
 * v9: 3D elements (all Premium). More expensive than regular elements because
 * they contain a WebGL runtime (Three.js) + a static fallback image. See
 * USULAN-3D-DAN-HARGA.md; the server/admin can still change the price.
 */
export const ELEMENT_3D_PRICE: Record<string, number> = {
  "three-product": 20,
  "three-shape": 15,
  "three-globe": 25,
  "three-particles": 15,
  "card-3d": 10,
};
export const ELEMENT_3D_RANGE = { min: 10, max: 25 } as const;

/**
 * Free template = 0 credits and used WITHOUT purchase. This flag stays
 * in case Free templates are ever priced and charged on use.
 */
export const FREE_TEMPLATE_CHARGES_ON_USE = false;

/* ------------------------------------------------------------------ */
/* Promo template                                                       */
/* ------------------------------------------------------------------ */

/**
 * Sitewide template promo: 40% off the original price until the end of
 * 10 January 2027 (WIB). Promo prices are rounded to the nearest credit,
 * at least 1 for paid templates. After `endsAt`, prices return to normal.
 */
export const TEMPLATE_PROMO = { percentOff: 40, endsAt: "2027-01-10T23:59:59+07:00" } as const;

/* ------------------------------------------------------------------ */
/* Website folder packs                                                 */
/* ------------------------------------------------------------------ */

export interface SitePackage {
  id: string;
  /** Jumlah slot folder website tambahan. */
  sites: number;
  credits: number;
  highlight?: boolean;
}

/**
 * Extra website folder slots (above FREE_SITES). The more you buy, the
 * cheaper per website: 1 = 15 credits (Rp15k), 10 = 105 credits (10.5/website), etc.
 * Other amounts are computed from the cheapest pack combination (see pricing.ts).
 */
export const SITE_PACKAGES: SitePackage[] = [
  { id: "site-pack-1", sites: 1, credits: 15 },
  { id: "site-pack-5", sites: 5, credits: 60 },
  { id: "site-pack-10", sites: 10, credits: 105, highlight: true },
  { id: "site-pack-25", sites: 25, credits: 225 },
  { id: "site-pack-50", sites: 50, credits: 400 },
];

/** Maximum website slots in a single purchase. */
export const MAX_SITES_PER_PURCHASE = 100;

/**
 * Composition of the 10 NEW section presets. The brief says 4 Free + 6 Premium in
 * the spec and 2 Free + 8 Premium in the test list; 4 + 6 is used.
 * To change it, move ids between the lists in
 * pages/pageMaker/helpers/sectionPresetsPro.ts (PRO_FREE_IDS); the tests
 * read this number too.
 */
export const NEW_SECTION_SPLIT = { free: 4, premium: 6 } as const;

/**
 * VR menu: 360° Tours. Free: max. 3 scenes per tour, scene-jump & text info
 * hotspots, HTML export. "360° Tour Pro" is unlocked ONCE per account:
 * up to 30 scenes per tour + image & audio hotspots. 50 credits = Rp50,000
 * one-time (for comparison: Kuula/CloudPano about US$20–27 per MONTH; tours
 * run in the browser so there is no per-view server cost).
 */
export const VR_PRO = { id: "vr-pro", price: 50 } as const;

/** Template catalog composition. */
export const TEMPLATE_SPLIT = { free: 32, premium: 378 } as const;

/* ------------------------------------------------------------------ */
/* Page design packs                                                   */
/* ------------------------------------------------------------------ */

export interface DesignPackage {
  id: string;
  /** Number of new page designs added to the quota. */
  designs: number;
  credits: number;
  highlight?: boolean;
}

/** 1 pack = 5 designs = 5 credits (Rp5k). Large pack of 50 designs = 30 credits (40% off). */
export const DESIGN_PACKAGES: DesignPackage[] = [
  { id: "design-pack-5", designs: 5, credits: 5 },
  { id: "design-pack-50", designs: 50, credits: 30, highlight: true },
];

/** Maximum number of designs in a single purchase (prevents a typo like 5000). */
export const MAX_DESIGNS_PER_PURCHASE = 200;

/* ------------------------------------------------------------------ */
/* Price validation (used by tests & catalog data)                      */
/* ------------------------------------------------------------------ */

export type PricedKind = "template" | "section" | "element" | "element3d";

export function isValidPrice(kind: PricedKind, tier: "free" | "premium", price: number): boolean {
  if (!Number.isInteger(price)) return false;
  if (kind === "template") return tier === "free" ? price === TEMPLATE_PRICE.free : price >= TEMPLATE_PRICE.premiumMin && price <= TEMPLATE_PRICE.premiumMax;
  if (kind === "element3d") return tier === "premium" && price >= ELEMENT_3D_RANGE.min && price <= ELEMENT_3D_RANGE.max;
  return tier === "free" ? price === ITEM_PRICE.free : price >= ITEM_PRICE.premiumMin && price <= ITEM_PRICE.premiumMax;
}
