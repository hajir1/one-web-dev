import { TEMPLATE_PROMO } from "../config/marketplace";

/* ================================================================== */
/* Template promo (pure): promo price & countdown time left              */
/* ================================================================== */

/**
 * The promo in effect. The initial value from config/marketplace.ts is only a fallback;
 * once GET /templates is read, the SERVER value (env TEMPLATE_PROMO_*) is
 * used (null = no promo), so promos only need configuring in the backend.
 */
let current: { percentOff: number; endsAt: number } = { percentOff: TEMPLATE_PROMO.percentOff, endsAt: Date.parse(TEMPLATE_PROMO.endsAt) };

/** Called by the repository when the template list from the server is received. */
export function setServerPromo(raw: unknown): void {
  const r = raw as { percentOff?: unknown; endsAt?: unknown } | null;
  const pct = typeof r?.percentOff === "number" ? r.percentOff : NaN;
  const end = typeof r?.endsAt === "string" ? Date.parse(r.endsAt) : NaN;
  current = Number.isFinite(pct) && pct > 0 && pct < 100 && Number.isFinite(end) ? { percentOff: pct, endsAt: end } : { percentOff: 0, endsAt: NaN };
}

/** Promo end time (ms); NaN when there is no promo. */
export const promoEndsAt = () => current.endsAt;

export const promoActive = (now = Date.now()) => Number.isFinite(current.endsAt) && current.percentOff > 0 && now <= current.endsAt;

export interface PromoPrice {
  /** Original price (catalog). */
  original: number;
  /** Price paid now. */
  price: number;
  active: boolean;
  percentOff: number;
}

/** Template price after the promo. 0 stays 0; paid ones cost at least 1 credit. */
export function promoPrice(original: number, now = Date.now()): PromoPrice {
  const active = promoActive(now) && original > 0;
  const price = active ? Math.max(1, Math.round((original * (100 - current.percentOff)) / 100)) : original;
  return { original, price, active, percentOff: current.percentOff };
}

/** Remaining promo time in days/hours/minutes/seconds (all 0 once ended). */
export function promoRemaining(now = Date.now()): { days: number; hours: number; minutes: number; seconds: number; ended: boolean } {
  const ms = Number.isFinite(current.endsAt) ? Math.max(0, current.endsAt - now) : 0;
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60, ended: ms === 0 };
}
