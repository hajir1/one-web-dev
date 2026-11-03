/* ================================================================== */
/* KONFIGURASI HARGA TERPUSAT                                           */
/*                                                                    */
/*  1. Paket kredit (harga bertingkat: makin banyak, makin murah)        */
/*  2. Biaya kredit fitur non-server (template premium, slot website…)  */
/*  3. Tarif fitur server (Media & Data) ada di                          */
/*     pages/media/processing/pricing.ts → DEFAULT_PRICING               */
/*                                                                    */
/* Komponen UI TIDAK menulis angka harga sendiri; semuanya membaca dari  */
/* file ini (atau dari harga yang dikirim backend dan sudah divalidasi). */
/* Harga di sini hanya untuk TAMPILAN. Harga yang ditagih, saldo, dan    */
/* pemotongan kredit SELALU ditentukan & divalidasi backend.             */
/* ================================================================== */

/* Semua harga dalam RUPIAH (IDR, bilangan bulat). Pembayaran lewat     */
/* Midtrans yang hanya memproses IDR; tidak ada harga/konversi dolar.   */

export interface CreditPackage {
  id: string;
  credits: number;
  /** Harga total paket (rupiah bulat). */
  priceIdr: number;
  /** Ditandai "Paling hemat"/"Populer". */
  highlight?: boolean;
}

/** Harga dasar 1 kredit (paket terkecil). */
export const BASE_IDR_PER_CREDIT = 1000;

/**
 * Paket bawaan (sama dengan migrasi backend v3). Harga per kredit turun:
 *   20 → Rp1.000 · 50 → Rp950 · 100 → Rp900 · 250 → Rp850 · 500 → Rp800
 * Paket terkecil Rp20.000 agar biaya transaksi Midtrans (mis. VA ±Rp4.000)
 * tidak memakan sebagian besar nilai pembelian.
 */
export const DEFAULT_CREDIT_PACKAGES: CreditPackage[] = [
  { id: "credits-20", credits: 20, priceIdr: 20000 },
  { id: "credits-50", credits: 50, priceIdr: 47500 },
  { id: "credits-100", credits: 100, priceIdr: 90000, highlight: true },
  { id: "credits-250", credits: 250, priceIdr: 212500 },
  { id: "credits-500", credits: 500, priceIdr: 400000 },
];

/** Harga per kredit sebuah paket (rupiah, dibulatkan). */
export const pricePerCredit = (p: CreditPackage) => Math.round(p.priceIdr / p.credits);

/** Harga dasar = harga per kredit TERTINGGI (paket terkecil). Dipakai untuk menghitung hemat. */
export function baseRate(packages: CreditPackage[] = DEFAULT_CREDIT_PACKAGES): number {
  return packages.length ? Math.max(...packages.map((p) => p.priceIdr / p.credits)) : BASE_IDR_PER_CREDIT;
}

/** Harga per kredit terendah (paket terbesar). */
export function bestRate(packages: CreditPackage[] = DEFAULT_CREDIT_PACKAGES): number {
  return packages.length ? Math.min(...packages.map((p) => p.priceIdr / p.credits)) : BASE_IDR_PER_CREDIT;
}

/** Penghematan dibanding membeli di harga dasar: { listIdr, idr, percent } (rupiah bulat, transparan). */
export function packageSavings(p: CreditPackage, packages: CreditPackage[] = DEFAULT_CREDIT_PACKAGES) {
  const list = Math.round(baseRate(packages) * p.credits);
  const idr = Math.max(0, list - p.priceIdr);
  const percent = list > 0 ? Math.round((idr / list) * 100) : 0;
  return { listIdr: list, idr, percent };
}

/** Format Rupiah tanpa desimal, mis. 47500 → "Rp47.500". */
export function formatIdr(amount: number): string {
  return `Rp${Math.round(amount).toLocaleString("id-ID")}`;
}

/** Nilai rupiah dari sejumlah kredit pada harga dasar (untuk keterangan "≈ RpX"). */
export const creditsToIdr = (credits: number) => Math.round(credits * BASE_IDR_PER_CREDIT);

/**
 * Validasi daftar paket (dari backend atau konfigurasi): id unik, angka
 * positif, harga rupiah bilangan bulat, dan harga per kredit TIDAK naik
 * ketika jumlah kredit naik. Mengembalikan daftar terurut, atau null.
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
/* Biaya kredit untuk fitur non-server (Web Maker).                     */
/* Satu tempat — dipakai dialog kredit, halaman Credits, dan template.  */
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
 * Biaya (kredit; 1 kredit = Rp1.000) per pembelian/akses. `null` = mengikuti
 * tarif fitur server. Nilai tampilan; harga yang ditagih dari backend.
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
