import { TEMPLATE_PROMO } from "../config/marketplace";

/* ================================================================== */
/* Promo template (murni): harga promo & sisa waktu countdown            */
/* ================================================================== */

/**
 * Promo yang berlaku. Nilai awal dari config/marketplace.ts hanya cadangan;
 * begitu GET /templates terbaca, nilai SERVER (env TEMPLATE_PROMO_*) yang
 * dipakai (null = tidak ada promo), sehingga promo cukup diatur di backend.
 */
let current: { percentOff: number; endsAt: number } = { percentOff: TEMPLATE_PROMO.percentOff, endsAt: Date.parse(TEMPLATE_PROMO.endsAt) };

/** Dipanggil repository saat daftar template dari server diterima. */
export function setServerPromo(raw: unknown): void {
  const r = raw as { percentOff?: unknown; endsAt?: unknown } | null;
  const pct = typeof r?.percentOff === "number" ? r.percentOff : NaN;
  const end = typeof r?.endsAt === "string" ? Date.parse(r.endsAt) : NaN;
  current = Number.isFinite(pct) && pct > 0 && pct < 100 && Number.isFinite(end) ? { percentOff: pct, endsAt: end } : { percentOff: 0, endsAt: NaN };
}

/** Waktu berakhir promo (ms) — NaN bila tidak ada promo. */
export const promoEndsAt = () => current.endsAt;

export const promoActive = (now = Date.now()) => Number.isFinite(current.endsAt) && current.percentOff > 0 && now <= current.endsAt;

export interface PromoPrice {
  /** Harga awal (katalog). */
  original: number;
  /** Harga yang dibayar sekarang. */
  price: number;
  active: boolean;
  percentOff: number;
}

/** Harga template setelah promo. 0 tetap 0; berbayar minimal 1 kredit. */
export function promoPrice(original: number, now = Date.now()): PromoPrice {
  const active = promoActive(now) && original > 0;
  const price = active ? Math.max(1, Math.round((original * (100 - current.percentOff)) / 100)) : original;
  return { original, price, active, percentOff: current.percentOff };
}

/** Sisa waktu promo dalam hari/jam/menit/detik (semua 0 bila sudah berakhir). */
export function promoRemaining(now = Date.now()): { days: number; hours: number; minutes: number; seconds: number; ended: boolean } {
  const ms = Number.isFinite(current.endsAt) ? Math.max(0, current.endsAt - now) : 0;
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60, ended: ms === 0 };
}
