import { DESIGN_PACKAGES, MAX_DESIGNS_PER_PURCHASE, MAX_SITES_PER_PURCHASE, SITE_PACKAGES, type DesignPackage, type SitePackage } from "../config/marketplace";
import type { DesignQuote, SiteQuote } from "./types";

/* ================================================================== */
/* Design pack price calculation (pure, easy to test)                   */
/*                                                                    */
/* Designs are bought in multiples of the smallest pack (5). The pack combination */
/* chosen is the CHEAPEST, e.g. 50 designs = 1× pack of 50 (6 credits),  */
/* not 10× pack of 5 (10 credits). When adding a few designs is actually */
/* cheaper (45 designs = 9 credits vs 50 designs = 6 credits), the UI    */
/* shows a suggestion via `betterDeal`.                                  */
/* ================================================================== */

export const smallestPack = (packs: DesignPackage[] = DESIGN_PACKAGES) => packs.reduce((a, b) => (b.designs < a.designs ? b : a));

/** Rounds up to a multiple of the smallest pack, limited to 1 pack … MAX_DESIGNS_PER_PURCHASE. */
export function normalizeDesignCount(n: number, packs: DesignPackage[] = DESIGN_PACKAGES): number {
  const step = smallestPack(packs).designs;
  const v = Number.isFinite(n) ? Math.ceil(Math.max(step, n) / step) * step : step;
  return Math.min(Math.floor(MAX_DESIGNS_PER_PURCHASE / step) * step, v);
}

/** Cheapest pack combination for exactly `designs` designs (multiples of the smallest pack). */
export function quoteDesigns(designs: number, packs: DesignPackage[] = DESIGN_PACKAGES): DesignQuote {
  const total = normalizeDesignCount(designs, packs);
  const step = smallestPack(packs).designs;
  const units = total / step;
  // Small knapsack (units ≤ 40): minimum cost for exactly u units.
  const best: { cost: number; pick: number[] }[] = [{ cost: 0, pick: packs.map(() => 0) }];
  for (let u = 1; u <= units; u++) {
    let cur: { cost: number; pick: number[] } | null = null;
    packs.forEach((p, i) => {
      const size = p.designs / step;
      if (!Number.isInteger(size) || size > u || !best[u - size]) return;
      const cost = best[u - size].cost + p.credits;
      if (!cur || cost < cur.cost) {
        const pick = [...best[u - size].pick];
        pick[i] += 1;
        cur = { cost, pick };
      }
    });
    best[u] = cur ?? { cost: Infinity, pick: packs.map(() => 0) };
  }
  const result = best[units];
  return {
    designs: total,
    credits: result.cost,
    lines: packs
      .map((p, i) => ({ packageId: p.id, designs: p.designs, credits: p.credits, count: result.pick[i] }))
      .filter((l) => l.count > 0),
    listCredits: units * smallestPack(packs).credits,
  };
}

/** Suggestion: a larger amount that costs the same or less (null when none). */
export function betterDeal(designs: number, packs: DesignPackage[] = DESIGN_PACKAGES): DesignQuote | null {
  const now = quoteDesigns(designs, packs);
  let best: DesignQuote | null = null;
  for (const p of packs) {
    const target = Math.ceil(now.designs / p.designs) * p.designs;
    if (target <= now.designs) continue;
    const q = quoteDesigns(target, packs);
    if (q.designs > now.designs && q.credits <= now.credits && (!best || q.designs > best.designs)) best = q;
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Website folder packs (tiered discounts)                              */
/* ------------------------------------------------------------------ */

/** Website packs in design pack form so they use the same knapsack. */
const asPacks = (packs: SitePackage[]): DesignPackage[] => packs.map((p) => ({ id: p.id, designs: p.sites, credits: p.credits }));

/** Bulatkan jumlah website: 1 … MAX_SITES_PER_PURCHASE. */
export const normalizeSiteCount = (n: number): number => Math.min(MAX_SITES_PER_PURCHASE, Number.isFinite(n) ? Math.max(1, Math.ceil(n)) : 1);

/** Cheapest website pack combination for exactly `sites` websites. */
export function quoteSites(sites: number, packs: SitePackage[] = SITE_PACKAGES): SiteQuote {
  const q = quoteDesigns(normalizeSiteCount(sites), asPacks(packs));
  return { sites: q.designs, credits: q.credits, lines: q.lines.map((l) => ({ packageId: l.packageId, sites: l.designs, credits: l.credits, count: l.count })), listCredits: q.listCredits };
}

/** Suggests more websites for the same or lower cost (null when none). */
export function betterSiteDeal(sites: number, packs: SitePackage[] = SITE_PACKAGES): SiteQuote | null {
  const now = quoteSites(sites, packs);
  let best: SiteQuote | null = null;
  for (const p of packs) {
    const target = Math.ceil(now.sites / p.sites) * p.sites;
    if (target <= now.sites || target > MAX_SITES_PER_PURCHASE) continue;
    const q = quoteSites(target, packs);
    if (q.sites > now.sites && q.credits <= now.credits && (!best || q.sites > best.sites)) best = q;
  }
  return best;
}
