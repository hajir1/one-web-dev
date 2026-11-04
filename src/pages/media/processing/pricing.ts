// ─── processing/pricing.ts ───────────────────────────────────────────────────
// CENTRAL PRICING CONFIGURATION for Media server features. UI components never
// hardcode costs; everything reads from here (or from
// prices sent by the backend through `mergePricing`).
//
// PRODUCT RULES (consistent across Media):
//   1 credit = Rp1,000 (base price; large packs are cheaper). Credits are bought
//   first through Midtrans in Rupiah (pay first, then the feature unlocks).
//
//   Two SEPARATE things:
//   a) CREDIT BALANCE — a general wallet, used to pay for each use
//                      (`costPerUse` credits per successful use).
//   b) FEATURE ACCESS — locked/unlocked status per feature. Access is unlocked by
//                      buying a FEATURE PACK costing `packPrice` credits that
//                      holds `usesPerCredit` uses (cheaper than
//                      pay per use). Buying the first pack unlocks
//                      fitur secara permanen.
//
//   On use: the feature pack quota is used first; when it runs out, the cost
//   `costPerUse` is taken from the balance. Features with `unlockRequired: false`
//   can be paid from the balance right away without buying a pack.
//
//   Credits / pack quota only decrease after processing SUCCEEDS and
//   confirmed by the backend. Failed / cancelled = free.
//
// The numbers below are display fallbacks and MATCH the backend
// (src/billing/catalog/feature-pricing.ts); the backend does the charging.
// Example: background removal 0.5 credit = Rp500 per image.
//
// This table also holds the DATA menu server features (old spreadsheet conversion &
// PDF table extraction) so every server rate lives in ONE place.
// Credit packs (tiered pricing) live in config/pricing.ts.

import i18n, { currentLang, LANG_LABEL } from "../../../i18n";
import { isAdminFree } from "../../../auth/adminFree";
import { BASE_IDR_PER_CREDIT, DEFAULT_CREDIT_PACKAGES, formatIdr } from "../../../config/pricing";
import { planQuota, sanitizePlanView, type PlanView, type QuotaPlan } from "../../plans/planCore";

/** Base price of 1 credit (Rupiah). Larger packs are cheaper per credit. */
const CREDIT_IDR = BASE_IDR_PER_CREDIT;

export type MediaServerFeatureId = "remove-background" | "image-upscaler" | "video-to-frames" | "video-to-gif" | "audio-extract" | "video-compress";
export type DataServerFeatureId = "data-legacy-sheet" | "data-pdf-table" | "data-pdf-ocr";
/** v7: fitur server menu VR (Tur 360°). */
export type VrServerFeatureId = "vr-panorama-stitch";
export type ServerFeatureId = MediaServerFeatureId | DataServerFeatureId | VrServerFeatureId;

/** Usage unit (UI text: pricing.units.<unit>). */
export type UsageUnit = "image" | "gif" | "video" | "audio" | "file" | "page" | "panorama";

interface CostTier {
  /** Upper bound (inclusive) in `by` units; Infinity for the last tier. */
  upTo: number;
  /** Pengali biaya standar. */
  factor: number;
}

export interface FeaturePricing {
  feature: ServerFeatureId;
  /** Usage unit (translated via pricing.units.<unit>). */
  unit: UsageUnit;
  /** Credits per standard use (pay per use from the balance). */
  costPerUse: number;
  /** Contents of one feature pack (number of standard uses). */
  usesPerCredit: number;
  /** Price of one feature pack (credits). */
  packPrice: number;
  /** Access must be unlocked (by buying a pack) before paying per use. */
  unlockRequired: boolean;
  /** The cost can rise with size/duration/scale. */
  tiers?: { by: "bytes" | "seconds" | "scale" | "pages" | "photos"; steps: CostTier[] };
  /** Server job input limits (validated by the frontend & REQUIRED on the backend). */
  limits: { maxBytes: number; maxSeconds?: number };
  /** The backend can disable specific features. */
  enabled: boolean;
  /** v11: included in the Media & Data subscription plans (monthly quota, not credits per use). */
  inPlan: boolean;
}

const MB = 1024 * 1024;

const BASE_PRICING: Record<ServerFeatureId, Omit<FeaturePricing, "inPlan">> = {
  "remove-background": {
    feature: "remove-background",
    unit: "image",
    costPerUse: 0.5,
    usesPerCredit: 12,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "bytes", steps: [{ upTo: 10 * MB, factor: 1 }, { upTo: Infinity, factor: 1.5 }] },
    limits: { maxBytes: 25 * MB },
    enabled: true,
  },
  "video-to-gif": {
    feature: "video-to-gif",
    unit: "gif",
    costPerUse: 1,
    usesPerCredit: 7,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "seconds", steps: [{ upTo: 10, factor: 1 }, { upTo: 20, factor: 1.5 }, { upTo: Infinity, factor: 2 }] },
    limits: { maxBytes: 200 * MB, maxSeconds: 30 },
    enabled: true,
  },
  "image-upscaler": {
    feature: "image-upscaler",
    unit: "image",
    costPerUse: 1.25,
    usesPerCredit: 8,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "scale", steps: [{ upTo: 2, factor: 1 }, { upTo: Infinity, factor: 1.5 }] },
    limits: { maxBytes: 10 * MB },
    enabled: true,
  },
  "video-to-frames": {
    feature: "video-to-frames",
    unit: "video",
    costPerUse: 0.5,
    usesPerCredit: 10,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "seconds", steps: [{ upTo: 300, factor: 1 }, { upTo: 900, factor: 2 }, { upTo: Infinity, factor: 3 }] },
    limits: { maxBytes: 2048 * MB, maxSeconds: 1800 },
    enabled: true,
  },
  "audio-extract": {
    feature: "audio-extract",
    unit: "audio",
    costPerUse: 0.25,
    usesPerCredit: 25,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "seconds", steps: [{ upTo: 1800, factor: 1 }, { upTo: Infinity, factor: 2 }] },
    limits: { maxBytes: 2048 * MB, maxSeconds: 3 * 3600 },
    enabled: true,
  },
  "video-compress": {
    feature: "video-compress",
    unit: "video",
    costPerUse: 1.5,
    usesPerCredit: 5,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "bytes", steps: [{ upTo: 200 * MB, factor: 1 }, { upTo: 1024 * MB, factor: 2 }, { upTo: Infinity, factor: 4 }] },
    limits: { maxBytes: 2048 * MB, maxSeconds: 3600 },
    enabled: true,
  },
  /* ---------------------------- menu Data ---------------------------- */
  "data-legacy-sheet": {
    feature: "data-legacy-sheet",
    unit: "file",
    costPerUse: 0.25,
    usesPerCredit: 25,
    packPrice: 5,
    unlockRequired: false,
    tiers: { by: "bytes", steps: [{ upTo: 10 * MB, factor: 1 }, { upTo: Infinity, factor: 2 }] },
    limits: { maxBytes: 50 * MB },
    enabled: true,
  },
  "data-pdf-table": {
    feature: "data-pdf-table",
    // Per dokumen; dokumen tebal dikali faktor tingkat (≤20 hlm ×1, ≤100 ×3, >100 ×6).
    unit: "file",
    costPerUse: 0.5,
    usesPerCredit: 12,
    packPrice: 5,
    unlockRequired: false,
    tiers: { by: "pages", steps: [{ upTo: 20, factor: 1 }, { upTo: 100, factor: 3 }, { upTo: Infinity, factor: 6 }] },
    limits: { maxBytes: 30 * MB },
    enabled: true,
  },
  "data-pdf-ocr": {
    feature: "data-pdf-ocr",
    // v7 (P8): OCR for scanned PDFs → searchable PDF + .txt. Per file; ≤10 pages ×1, ≤50 ×3, >50 ×6 (max. 100 pages).
    unit: "file",
    costPerUse: 1,
    usesPerCredit: 6,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "pages", steps: [{ upTo: 10, factor: 1 }, { upTo: 50, factor: 3 }, { upTo: Infinity, factor: 6 }] },
    limits: { maxBytes: 100 * MB },
    enabled: true,
  },
  /* ----------------------------- menu VR ----------------------------- */
  "vr-panorama-stitch": {
    feature: "vr-panorama-stitch",
    // v7: ZIP of 2–24 photos → 360° panorama. Per panorama; ≤8 photos ×1, ≤16 ×1.5, >16 ×2.
    unit: "panorama",
    costPerUse: 1,
    usesPerCredit: 6,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "photos", steps: [{ upTo: 8, factor: 1 }, { upTo: 16, factor: 1.5 }, { upTo: Infinity, factor: 2 }] },
    limits: { maxBytes: 200 * MB },
    enabled: true,
  },
};

/** Server features of the Media menu. */
export const MEDIA_SERVER_FEATURES: MediaServerFeatureId[] = ["remove-background", "image-upscaler", "video-to-frames", "video-to-gif", "audio-extract", "video-compress"];
/** Server features of the Data menu. */
export const DATA_SERVER_FEATURES: DataServerFeatureId[] = ["data-legacy-sheet", "data-pdf-table", "data-pdf-ocr"];
/** Server features of the VR menu (v7). */
export const VR_SERVER_FEATURES: VrServerFeatureId[] = ["vr-panorama-stitch"];

/**
 * v11: Media & Data use subscription plans (no feature packs / pay-per-use
 * credits). The credit rates above are still used by VR and leftover old feature packs.
 */
export const DEFAULT_PRICING: Record<ServerFeatureId, FeaturePricing> = Object.fromEntries(
  Object.entries(BASE_PRICING).map(([id, p]) => {
    const inPlan = !(VR_SERVER_FEATURES as string[]).includes(id);
    return [id, { ...p, inPlan, unlockRequired: inPlan ? false : p.unlockRequired }];
  }),
) as Record<ServerFeatureId, FeaturePricing>;

/** @deprecated use DEFAULT_CREDIT_PACKAGES from config/pricing.ts (tiered prices). */
export const CREDIT_PACKAGES = DEFAULT_CREDIT_PACKAGES;

/* ------------------------------ format ------------------------------ */

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/** Translated server feature name (pricing.features.<id>). */
export const featureName = (f: ServerFeatureId) => i18n.t(`pricing.features.${f}`, { defaultValue: f });
/** Translated usage unit name. */
export const unitName = (u: UsageUnit) => i18n.t(`pricing.units.${u}`);
/** Tiered rate multiplier note, e.g. "up to ×3 for large files"; null when there are no tiers. */
export function tierNote(p: FeaturePricing): string | null {
  if (!p.tiers || p.tiers.steps.length < 2) return null;
  return i18n.t(`pricing.tierNote.${p.tiers.by}`, { factor: p.tiers.steps[p.tiers.steps.length - 1].factor });
}

/** 0.25 → "0,25 kredit" (id) / "0.25 credits" (en). */
export function formatCredits(n: number, withUnit = true): string {
  const v = round(n);
  const s = v.toLocaleString(LANG_LABEL[currentLang()].locale, { maximumFractionDigits: 3 });
  return withUnit ? i18n.t("pricing.credits", { count: v, value: s }) : s;
}

/** Credit value in Rupiah at the BASE price (Rp1,000/credit), e.g. 0.5 → "Rp500". */
export function formatCreditValue(credits: number): string {
  return formatMoney(credits * CREDIT_IDR);
}

/** Rupiah without decimals, e.g. 47500 → "Rp47.500". */
export function formatMoney(idr: number): string {
  return formatIdr(idr);
}

/* ------------------------------ biaya ------------------------------- */

export interface UsageInput {
  bytes?: number;
  seconds?: number;
  scale?: number;
  pages?: number;
  photos?: number;
}

/** Cost multiplier for one input (1 when there are no tiers / data). */
export function usageFactor(p: FeaturePricing, input: UsageInput = {}): number {
  if (!p.tiers) return 1;
  const v = input[p.tiers.by];
  if (v === undefined || !Number.isFinite(v)) return p.tiers.steps[0]?.factor ?? 1;
  return p.tiers.steps.find((s) => v <= s.upTo)?.factor ?? p.tiers.steps[p.tiers.steps.length - 1].factor;
}

/** Cost of one use when paid from the balance. */
export const costOf = (p: FeaturePricing, input?: UsageInput) => round(p.costPerUse * usageFactor(p, input));

/** Pack quota consumed by one use. */
export const packUsesOf = (p: FeaturePricing, input?: UsageInput) => Math.ceil(usageFactor(p, input) - 1e-9);

/** Price per use when buying a pack (for comparison). */
export const packCostPerUse = (p: FeaturePricing) => round(p.packPrice / p.usesPerCredit);

/** Validasi input terhadap batas server. null = valid. */
export function validateServerInput(p: FeaturePricing, input: UsageInput): string | null {
  if (input.bytes !== undefined && input.bytes > p.limits.maxBytes) return i18n.t("pricing.errors.tooLarge", { mb: Math.round(p.limits.maxBytes / MB) });
  if (p.limits.maxSeconds !== undefined && input.seconds !== undefined && input.seconds > p.limits.maxSeconds)
    return p.limits.maxSeconds >= 120
      ? i18n.t("pricing.errors.tooLongMinutes", { n: Math.round(p.limits.maxSeconds / 60) })
      : i18n.t("pricing.errors.tooLongSeconds", { n: p.limits.maxSeconds });
  return null;
}

/* --------------------------- account & access --------------------------- */

/** Hak akses per fitur menurut BACKEND. */
interface FeatureEntitlement {
  unlocked: boolean;
  /** Remaining plan quota (standard uses). */
  packUses: number;
}

/** Account data from the backend (the frontend never changes it itself). */
export interface BillingAccount {
  balance: number;
  entitlements: Partial<Record<ServerFeatureId, FeatureEntitlement>>;
  /** One-time items already unlocked by the server (e.g. "template:shop-premium", "site-slot"). */
  items: string[];
  /** Extra website folder slots already purchased. */
  extraSiteSlots: number;
  syncedAt: number;
  /** v6: admin no-credit mode (from the backend / session profile). Display only; the server does the billing. */
  adminFree?: boolean;
  /** v7 (P6): the user's team. `payWithTeam` = server jobs are paid from the team wallet (no personal plan quota). */
  team?: TeamAccount | null;
  /** v11: the active Media & Data subscription plan + this month's remaining quota. */
  subscription?: PlanView | null;
}

interface TeamAccount {
  id: string;
  name: string;
  role: "owner" | "member";
  balance: number;
  payWithTeam: boolean;
  monthlyLimit: number | null;
  spentMonth: number;
  /** Team credits still usable this month (min(team balance, remaining limit)). */
  available: number;
}

/** The balance that pays for server jobs: team credits (when the source is "Team") or the personal balance. */
export const payingBalance = (a: BillingAccount) => (a.team?.payWithTeam ? a.team.available : a.balance);

export interface ChargePlan {
  /** Plan quota that will be used. */
  packUses: number;
  /** Credits from the balance. */
  credits: number;
  /** Total if everything is paid from the balance (no pack). */
  creditsWithoutPack: number;
  /** null = balance unknown. */
  affordable: boolean | null;
  /** Credit shortfall (0 when sufficient / unknown). */
  shortfall: number;
}

/** Cost plan for a set of inputs (order: plan quota first, then the balance). */
export function planCharge(p: FeaturePricing, inputs: UsageInput[], account: BillingAccount | null): ChargePlan {
  // v6: admin → no cost (the server does not charge either).
  // v11: subscription plan features → no credits (leftover old feature packs are used first, the rest from plan quota).
  if (account?.adminFree || p.inPlan) {
    if (p.inPlan && !account?.adminFree) {
      let pack = account?.entitlements[p.feature]?.packUses ?? 0;
      let packUses = 0;
      for (const inp of inputs) {
        const need = packUsesOf(p, inp);
        if (pack >= need) {
          pack -= need;
          packUses += need;
        }
      }
      return { packUses, credits: 0, creditsWithoutPack: 0, affordable: account ? true : null, shortfall: 0 };
    }
    const list = round(inputs.reduce((n, inp) => n + costOf(p, inp), 0));
    return { packUses: 0, credits: 0, creditsWithoutPack: list, affordable: true, shortfall: 0 };
  }
  // v7: "Team" source → everything is paid with team credits, the personal plan quota is not used.
  const viaTeam = !!account?.team?.payWithTeam;
  let pack = viaTeam ? 0 : (account?.entitlements[p.feature]?.packUses ?? 0);
  let packUses = 0;
  let credits = 0;
  let without = 0;
  for (const inp of inputs) {
    const need = packUsesOf(p, inp);
    const c = costOf(p, inp);
    without += c;
    if (pack >= need) {
      pack -= need;
      packUses += need;
    } else credits += c;
  }
  credits = round(credits);
  if (!account) return { packUses: 0, credits: round(without), creditsWithoutPack: round(without), affordable: null, shortfall: 0 };
  const short = Math.max(0, round(credits - payingBalance(account)));
  return { packUses, credits, creditsWithoutPack: round(without), affordable: short === 0, shortfall: short };
}

/** Estimated number of standard uses that can be paid now. null = unknown. */
export function estimateUses(p: FeaturePricing, account: BillingAccount | null): number | null {
  if (!account) return null;
  if (account.adminFree) return Infinity;
  if (p.inPlan) {
    const sub = account.subscription;
    const pack = account.entitlements[p.feature]?.packUses ?? 0;
    if (!sub) return null;
    return pack + (VIDEO_MINUTES.has(p.feature) ? Math.floor(sub.videoSeconds.left / 60) : sub.units.left);
  }
  const ent = account.entitlements[p.feature];
  if (p.unlockRequired && !ent?.unlocked) return 0;
  if (account.team?.payWithTeam) return Math.floor(round(account.team.available / p.costPerUse));
  return (ent?.packUses ?? 0) + Math.floor(round(account.balance / p.costPerUse));
}

/** How many uses `credits` credits buy (pack vs pay per use). */
export function usesForCredits(p: FeaturePricing, credits: number) {
  return {
    payPerUse: Math.floor(round(credits / p.costPerUse)),
    viaPacks: Math.floor(round(credits / p.packPrice)) * p.usesPerCredit,
  };
}

export type AccessState = "unavailable" | "unknown" | "locked" | "insufficient" | "quota" | "ready";

/** Plan feature whose quota is in video minutes (estimate "≈ N minutes"). */
const VIDEO_MINUTES = new Set<ServerFeatureId>(["video-compress", "audio-extract"]);

/** v11: short cost label: plan quota for Media & Data, credits per use for the rest. */
export function serverCostLabel(p: FeaturePricing): string {
  if (p.inPlan) return i18n.t(VIDEO_MINUTES.has(p.feature) ? "plans.cost.minute" : "plans.cost.unit");
  return i18n.t("media.shell.perUse", { cost: formatCredits(costOf(p)) });
}

/**
 * v11: plan quota plan for the current input. Input covered by leftover
 * old feature packs does not use subscription quota. null = not a plan feature.
 */
export function quotaFor(p: FeaturePricing, inputs: UsageInput[], account: BillingAccount | null): QuotaPlan | null {
  if (!p.inPlan) return null;
  let pack = account?.entitlements[p.feature]?.packUses ?? 0;
  const rest = inputs.filter((inp) => {
    const need = packUsesOf(p, inp);
    if (pack >= need) {
      pack -= need;
      return false;
    }
    return true;
  });
  return planQuota(p.feature, rest, account?.subscription ?? null, p.limits.maxBytes);
}

/** Access status label (text from the locales: pricing.access.<state>). */
export const ACCESS_LABEL: Record<AccessState, string> = new Proxy({} as Record<AccessState, string>, {
  get: (_t, key: string) => i18n.t(`pricing.access.${key}`),
});

/** Combined access status for display & for choosing the action. */
export function accessState(p: FeaturePricing, opts: { serverAvailable: boolean; account: BillingAccount | null; plan?: ChargePlan; quota?: QuotaPlan | null }): AccessState {
  if (!opts.serverAvailable || !p.enabled) return "unavailable";
  if (!opts.account) return "unknown";
  if (opts.account.adminFree) return "ready";
  if (p.inPlan) {
    const q = opts.quota ?? quotaFor(p, [{}], opts.account);
    return q?.enough === false ? "quota" : "ready";
  }
  const ent = opts.account.entitlements[p.feature];
  if (p.unlockRequired && !ent?.unlocked) return "locked";
  const plan = opts.plan ?? planCharge(p, [{}], opts.account);
  return plan.affordable === false ? "insufficient" : "ready";
}

/* ------------------------ prices from the backend ------------------------ */

const num = (v: unknown, min = 0) => (typeof v === "number" && Number.isFinite(v) && v >= min ? v : null);

/** Merges prices from the backend (if any) with the defaults; invalid values are ignored. */
export function mergePricing(base: Record<ServerFeatureId, FeaturePricing>, remote: unknown): Record<ServerFeatureId, FeaturePricing> {
  const out = { ...base };
  if (!remote || typeof remote !== "object") return out;
  for (const id of Object.keys(base) as ServerFeatureId[]) {
    const r = (remote as Record<string, unknown>)[id];
    if (!r || typeof r !== "object") continue;
    const v = r as Record<string, unknown>;
    const cur = base[id];
    out[id] = {
      ...cur,
      costPerUse: num(v.costPerUse, 0.0001) ?? cur.costPerUse,
      usesPerCredit: num(v.usesPerCredit, 1) !== null ? Math.floor(v.usesPerCredit as number) : cur.usesPerCredit,
      packPrice: num(v.packPrice, 0.0001) ?? cur.packPrice,
      unlockRequired: typeof v.unlockRequired === "boolean" ? v.unlockRequired : cur.unlockRequired,
      enabled: typeof v.enabled === "boolean" ? v.enabled : cur.enabled,
      inPlan: typeof v.inPlan === "boolean" ? v.inPlan : cur.inPlan,
    };
  }
  return out;
}

export function sanitizeAccount(raw: unknown): BillingAccount | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Record<string, unknown>;
  // The balance may be negative (credits clawed back after a refund/chargeback); negative accounts used to be dropped → balance "could not be loaded".
  const balance = num(v.balance, -Infinity);
  if (balance === null) return null;
  const entitlements: BillingAccount["entitlements"] = {};
  const ents = v.entitlements && typeof v.entitlements === "object" ? (v.entitlements as Record<string, unknown>) : {};
  for (const id of Object.keys(DEFAULT_PRICING) as ServerFeatureId[]) {
    const e = ents[id] as Record<string, unknown> | undefined;
    if (e && typeof e === "object") entitlements[id] = { unlocked: e.unlocked === true, packUses: Math.floor(num(e.packUses) ?? 0) };
  }
  const items = Array.isArray(v.items) ? (v.items as unknown[]).filter((x): x is string => typeof x === "string" && /^[\w:.-]{1,80}$/.test(x)).slice(0, 500) : [];
  const extra = num(v.extraSiteSlots);
  const team = sanitizeTeam(v.team);
  const subscription = sanitizePlanView(v.subscription);
  return {
    balance: round(balance),
    entitlements,
    items,
    extraSiteSlots: extra === null ? 0 : Math.floor(extra),
    syncedAt: Date.now(),
    ...(v.adminFree === true || isAdminFree() ? { adminFree: true } : {}),
    ...(team ? { team } : {}),
    ...(subscription ? { subscription } : {}),
  };
}

function sanitizeTeam(raw: unknown): TeamAccount | null {
  if (!raw || typeof raw !== "object") return null;
  const t = raw as Record<string, unknown>;
  const balance = num(t.balance);
  const available = num(t.available);
  if (typeof t.id !== "string" || typeof t.name !== "string" || balance === null || available === null) return null;
  return {
    id: t.id,
    name: t.name.slice(0, 60),
    role: t.role === "owner" ? "owner" : "member",
    balance: round(balance),
    payWithTeam: t.payWithTeam === true,
    monthlyLimit: num(t.monthlyLimit),
    spentMonth: round(num(t.spentMonth) ?? 0),
    available: round(available),
  };
}
