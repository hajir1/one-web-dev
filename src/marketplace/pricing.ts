import { DESIGN_PACKAGES, MAX_DESIGNS_PER_PURCHASE, MAX_SITES_PER_PURCHASE, SITE_PACKAGES, type DesignPackage, type SitePackage } from "../config/marketplace";
import type { DesignQuote, SiteQuote } from "./types";

/* ================================================================== */
/* Hitung harga paket desain (murni, mudah diuji)                       */
/*                                                                    */
/* Jumlah desain dibeli kelipatan paket terkecil (5). Kombinasi paket    */
/* dipilih yang PALING MURAH, mis. 50 desain = 1× paket 50 (6 kredit),   */
/* bukan 10× paket 5 (10 kredit). Bila menambah sedikit desain justru    */
/* lebih murah (45 desain = 9 kredit vs 50 desain = 6 kredit), UI        */
/* menampilkan saran lewat `betterDeal`.                                 */
/* ================================================================== */

export const smallestPack = (packs: DesignPackage[] = DESIGN_PACKAGES) => packs.reduce((a, b) => (b.designs < a.designs ? b : a));

/** Bulatkan ke atas ke kelipatan paket terkecil, dibatasi 1 paket … MAX_DESIGNS_PER_PURCHASE. */
export function normalizeDesignCount(n: number, packs: DesignPackage[] = DESIGN_PACKAGES): number {
  const step = smallestPack(packs).designs;
  const v = Number.isFinite(n) ? Math.ceil(Math.max(step, n) / step) * step : step;
  return Math.min(Math.floor(MAX_DESIGNS_PER_PURCHASE / step) * step, v);
}

/** Kombinasi paket termurah untuk tepat `designs` desain (kelipatan paket terkecil). */
export function quoteDesigns(designs: number, packs: DesignPackage[] = DESIGN_PACKAGES): DesignQuote {
  const total = normalizeDesignCount(designs, packs);
  const step = smallestPack(packs).designs;
  const units = total / step;
  // Knapsack kecil (jumlah unit ≤ 40): biaya minimum untuk tepat u unit.
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

/** Saran: jumlah lebih besar yang biayanya sama atau lebih murah (null bila tidak ada). */
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
/* Paket folder website (diskon bertingkat)                             */
/* ------------------------------------------------------------------ */

/** Paket website dalam bentuk paket desain supaya memakai knapsack yang sama. */
const asPacks = (packs: SitePackage[]): DesignPackage[] => packs.map((p) => ({ id: p.id, designs: p.sites, credits: p.credits }));

/** Bulatkan jumlah website: 1 … MAX_SITES_PER_PURCHASE. */
export const normalizeSiteCount = (n: number): number => Math.min(MAX_SITES_PER_PURCHASE, Number.isFinite(n) ? Math.max(1, Math.ceil(n)) : 1);

/** Kombinasi paket website termurah untuk tepat `sites` website. */
export function quoteSites(sites: number, packs: SitePackage[] = SITE_PACKAGES): SiteQuote {
  const q = quoteDesigns(normalizeSiteCount(sites), asPacks(packs));
  return { sites: q.designs, credits: q.credits, lines: q.lines.map((l) => ({ packageId: l.packageId, sites: l.designs, credits: l.credits, count: l.count })), listCredits: q.listCredits };
}

/** Saran jumlah website lebih banyak dengan biaya sama atau lebih murah (null bila tidak ada). */
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
