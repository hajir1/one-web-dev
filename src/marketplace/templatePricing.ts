import { TEMPLATE_PRICE } from "../config/marketplace";

/* ================================================================== */
/* Premium template price                                               */
/*                                                                    */
/*   price = 15 credits × page count + quality bonus (0–10)             */
/*   bonus = 10 when score ≥ 6, 5 when score ≥ 3, otherwise 0           */
/*   (1 credit = Rp1,000 → Rp15k per page, range Rp20k–Rp300k)           */
/*   score = number of built-in Premium items + number of libraries used */
/*                                                                    */
/* Because the maximum bonus (10) is less than the price of one page (15), */
/* templates with more pages are ALWAYS more expensive; quality          */
/* only distinguishes templates with the same number of pages.          */
/* Free templates are always 0 credits. Catalog prices are written statically and */
/* checked against this formula by tests/pricing.test.ts.               */
/* ================================================================== */

export const CREDITS_PER_PAGE = 15;

export function qualityBonus(premiumItems: number, libraries: number): 0 | 5 | 10 {
  const score = premiumItems + libraries;
  return score >= 6 ? 10 : score >= 3 ? 5 : 0;
}

export function templatePrice(pages: number, premiumItems: number, libraries: number): number {
  const raw = CREDITS_PER_PAGE * pages + qualityBonus(premiumItems, libraries);
  return Math.min(TEMPLATE_PRICE.premiumMax, Math.max(TEMPLATE_PRICE.premiumMin, raw));
}
