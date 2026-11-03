import { TEMPLATE_PRICE } from "../config/marketplace";

/* ================================================================== */
/* Harga template Premium                                               */
/*                                                                    */
/*   harga = 15 kredit × jumlah halaman + bonus kualitas (0–10)         */
/*   bonus = 10 bila skor ≥ 6, 5 bila skor ≥ 3, selain itu 0            */
/*   (1 kredit = Rp1.000 → Rp15rb per halaman, rentang Rp20rb–Rp300rb)   */
/*   skor  = jumlah item Premium bawaan + jumlah library yang dipakai   */
/*                                                                    */
/* Karena bonus maksimal (10) lebih kecil dari harga satu halaman (15), */
/* template dengan halaman lebih banyak SELALU lebih mahal; kualitas    */
/* hanya membedakan template dengan jumlah halaman yang sama.           */
/* Template Free selalu 0 kredit. Harga di katalog ditulis statis dan   */
/* dicocokkan dengan rumus ini oleh tests/pricing.test.ts.              */
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
