/* ================================================================== */
/* ATURAN HARGA & PAKET KATALOG (Free/Premium) — satu sumber angka        */
/*                                                                    */
/* Dipakai katalog template, section, element, dan paket desain.        */
/* Komponen UI tidak menulis angka sendiri.                             */
/*                                                                    */
/* Nilai di sini = cadangan TAMPILAN (mis. sebelum katalog server        */
/* dimuat). Harga yang ditagih, tier, dan kepemilikan ditentukan server   */
/* (backend Nest, dapat diubah admin).                                   */
/* ================================================================== */

/*
 * Satuan harga: 1 kredit = Rp1.000 (paket kredit besar lebih murah per kredit).
 */

/** Template website: Free = 0 kredit (gratis), Premium = 20–300 kredit (Rp20rb–Rp300rb; 15 kredit/halaman + bonus kualitas, lihat marketplace/templatePricing.ts). */
export const TEMPLATE_PRICE = { free: 0, premiumMin: 20, premiumMax: 300 } as const;

/** Section & element: Free = 0, Premium = 5–10 kredit (Rp5rb–Rp10rb, sesuai kompleksitas & nilai fungsional). */
export const ITEM_PRICE = { free: 0, premiumMin: 5, premiumMax: 10 } as const;

/**
 * v9: elemen 3D (semuanya Premium). Lebih mahal dari elemen biasa karena
 * berisi runtime WebGL (Three.js) + gambar statis cadangan. Lihat
 * USULAN-3D-DAN-HARGA.md; server/admin tetap bisa mengubah harganya.
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
 * Template Free = 0 kredit dan dipakai TANPA pembelian. Bendera ini tetap
 * ada bila suatu saat template Free diberi harga dan ditagih saat dipakai.
 */
export const FREE_TEMPLATE_CHARGES_ON_USE = false;

/* ------------------------------------------------------------------ */
/* Promo template                                                       */
/* ------------------------------------------------------------------ */

/**
 * Promo seluruh template: diskon 40% dari harga awal sampai akhir
 * 10 Januari 2027 (WIB). Harga promo dibulatkan ke kredit terdekat,
 * minimal 1 untuk template berbayar. Setelah `endsAt`, harga kembali normal.
 */
export const TEMPLATE_PROMO = { percentOff: 40, endsAt: "2027-01-10T23:59:59+07:00" } as const;

/* ------------------------------------------------------------------ */
/* Paket folder website                                                 */
/* ------------------------------------------------------------------ */

export interface SitePackage {
  id: string;
  /** Jumlah slot folder website tambahan. */
  sites: number;
  credits: number;
  highlight?: boolean;
}

/**
 * Slot folder website tambahan (di atas FREE_SITES). Makin banyak makin
 * murah per website: 1 = 15 kredit (Rp15rb), 10 = 105 kredit (10,5/website), dst.
 * Jumlah lain dihitung dari kombinasi paket termurah (lihat pricing.ts).
 */
export const SITE_PACKAGES: SitePackage[] = [
  { id: "site-pack-1", sites: 1, credits: 15 },
  { id: "site-pack-5", sites: 5, credits: 60 },
  { id: "site-pack-10", sites: 10, credits: 105, highlight: true },
  { id: "site-pack-25", sites: 25, credits: 225 },
  { id: "site-pack-50", sites: 50, credits: 400 },
];

/** Batas slot website dalam sekali beli. */
export const MAX_SITES_PER_PURCHASE = 100;

/**
 * Komposisi 10 preset section BARU. Brief menyebut 4 Free + 6 Premium di
 * spesifikasi dan 2 Free + 8 Premium di daftar pengujian; dipakai 4 + 6.
 * Untuk mengubah, pindahkan id antar-daftar di
 * pages/pageMaker/helpers/sectionPresetsPro.ts (PRO_FREE_IDS) — tes ikut
 * membaca angka ini.
 */
export const NEW_SECTION_SPLIT = { free: 4, premium: 6 } as const;

/**
 * Menu VR — Tur 360°. Gratis: maks. 3 scene per tur, hotspot pindah scene
 * & info teks, ekspor HTML. "Tur 360° Pro" dibuka SEKALI per akun:
 * hingga 30 scene per tur + hotspot gambar & audio. 50 kredit = Rp50.000
 * sekali bayar (pembanding: Kuula/CloudPano ±US$20–27 per BULAN; tur
 * berjalan di browser sehingga tidak ada biaya server per buka).
 */
export const VR_PRO = { id: "vr-pro", price: 50 } as const;

/** Komposisi katalog template. */
export const TEMPLATE_SPLIT = { free: 32, premium: 378 } as const;

/* ------------------------------------------------------------------ */
/* Paket desain halaman                                                */
/* ------------------------------------------------------------------ */

export interface DesignPackage {
  id: string;
  /** Jumlah desain halaman baru yang ditambahkan ke kuota. */
  designs: number;
  credits: number;
  highlight?: boolean;
}

/** 1 paket = 5 desain = 5 kredit (Rp5rb). Paket besar 50 desain = 30 kredit (diskon 40%). */
export const DESIGN_PACKAGES: DesignPackage[] = [
  { id: "design-pack-5", designs: 5, credits: 5 },
  { id: "design-pack-50", designs: 50, credits: 30, highlight: true },
];

/** Batas jumlah desain dalam sekali beli (mencegah salah ketik 5000). */
export const MAX_DESIGNS_PER_PURCHASE = 200;

/* ------------------------------------------------------------------ */
/* Validasi harga (dipakai tes & data katalog)                          */
/* ------------------------------------------------------------------ */

export type PricedKind = "template" | "section" | "element" | "element3d";

export function isValidPrice(kind: PricedKind, tier: "free" | "premium", price: number): boolean {
  if (!Number.isInteger(price)) return false;
  if (kind === "template") return tier === "free" ? price === TEMPLATE_PRICE.free : price >= TEMPLATE_PRICE.premiumMin && price <= TEMPLATE_PRICE.premiumMax;
  if (kind === "element3d") return tier === "premium" && price >= ELEMENT_3D_RANGE.min && price <= ELEMENT_3D_RANGE.max;
  return tier === "free" ? price === ITEM_PRICE.free : price >= ITEM_PRICE.premiumMin && price <= ITEM_PRICE.premiumMax;
}
