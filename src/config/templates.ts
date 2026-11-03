import { TEMPLATE_PRICE } from "./marketplace";
import { V2A_CATALOG } from "../pages/webTemplates/templates/v2/catalogA";
import { V2B_CATALOG } from "../pages/webTemplates/templates/v2/catalogB";
import { V3C_CATALOG } from "../pages/webTemplates/templates/v3/catalogC";
import { V3D_CATALOG } from "../pages/webTemplates/templates/v3/catalogD";
import { V4E_CATALOG } from "../pages/webTemplates/templates/v4/catalogE";
import { V5F_CATALOG } from "../pages/webTemplates/templates/v5/catalogF";
import { V6G_CATALOG } from "../pages/webTemplates/templates/v6/catalogG";
import { V7H_CATALOG } from "../pages/webTemplates/templates/v7/catalogH";
import { V9I_CATALOG } from "../pages/webTemplates/templates/v9/catalogI";
import { V10J_CATALOG } from "../pages/webTemplates/templates/v10/catalogJ";

/* ================================================================== */
/* Katalog Web Templates (metadata) — konten tiap template ada di        */
/* pages/webTemplates/templates/. Nama & deskripsi tampil di locales:    */
/* templates.items.<id>.{name,description}.                             */
/*                                                                    */
/* - tier "free"    : langsung bisa dipakai (tanpa pembelian).          */
/* - tier "premium" : pratinjau bebas; unduh & edit setelah template     */
/*   dibeli (simulasi lokal di tahap ini, lihat src/marketplace/).       */
/*                                                                    */
/* Harga: Free = 0 kredit, Premium = 3 kredit per halaman + bonus      */
/* kualitas 0–2 (lihat marketplace/templatePricing.ts).                 */
/* ================================================================== */

export type TemplateCategory =
  | "dashboard"
  | "company"
  | "agency"
  | "shop"
  | "portfolio"
  | "blog"
  | "saas"
  | "startup"
  | "personal"
  | "restaurant"
  | "realestate"
  | "education"
  | "event"
  | "photography"
  | "technology"
  | "health"
  | "travel"
  | "professional"
  | "community"
  | "creative"
  | "fitness"
  | "beauty"
  | "automotive"
  | "finance"
  | "nonprofit"
  | "wedding"
  | "music"
  | "construction"
  | "hospitality"
  | "kids"
  | "pets"
  | "agriculture"
  | "logistics"
  | "gaming"
  | "architecture"
  | "news"
  | "sports"
  | "government"
  | "worship"
  | "bakery"
  | "insurance"
  | "podcast"
  | "film"
  | "fashion"
  | "jewelry"
  | "printing"
  | "laundry"
  | "recruitment"
  | "bookstore"
  | "florist"
  | "energy"
  | "science"
  | "coworking"
  | "dental"
  | "furniture"
  | "language"
  | "maritime"
  | "craft"
  | "catering"
  | "rental"
  | "barbershop"
  | "museum"
  | "pharmacy"
  | "carwash"
  | "tailor"
  | "spa"
  | "tattoo"
  | "optician"
  | "cleaning"
  | "moving"
  | "security"
  | "brewery"
  | "library"
  | "cooperative"
  | "notary"
  | "driving"
  | "repair"
  | "garden"
  // v16: Template Kode (bagian J)
  | "invitation"
  | "animation";

export type TemplateTier = "free" | "premium";

export interface TemplateMeta {
  id: string;
  /** Naik bila isi template berubah (disimpan di website hasil edit). */
  version: number;
  category: TemplateCategory;
  tier: TemplateTier;
  /** Harga dalam kredit (Free = TEMPLATE_PRICE.free). */
  price: number;
  /** Warna aksen kartu katalog. */
  accent: string;
  /** Kata kunci pencarian tambahan (bahasa netral). */
  tags: string[];
  /** Label "Terbaru": hanya template di LATEST_TEMPLATE_IDS (unggahan terakhir), diatur otomatis di bawah. */
  isNew?: boolean;
}

const free = TEMPLATE_PRICE.free;

const RAW_TEMPLATE_CATALOG: TemplateMeta[] = [
  // Free (4)
  { id: "company-starter", version: 1, category: "company", tier: "free", price: free, accent: "#1d4ed8", tags: ["consulting", "konsultan", "profil"] },
  { id: "shop-starter", version: 1, category: "shop", tier: "free", price: free, accent: "#b45309", tags: ["coffee", "kopi", "toko"] },
  { id: "portfolio-minimal", version: 1, category: "portfolio", tier: "free", price: free, accent: "#ea580c", tags: ["designer", "desainer", "cv"] },
  { id: "blog-journal", version: 1, category: "blog", tier: "free", price: free, accent: "#0369a1", tags: ["artikel", "newsletter", "writing"] },
  // Premium (16)
  { id: "company-agency", version: 2, category: "agency", tier: "premium", price: 45, accent: "#4f46e5", tags: ["studio", "digital", "landing"] },
  { id: "shop-boutique", version: 2, category: "shop", tier: "premium", price: 60, accent: "#0f766e", tags: ["fashion", "butik", "katalog"] },
  { id: "saas-launch", version: 2, category: "saas", tier: "premium", price: 55, accent: "#6366f1", tags: ["analytics", "dashboard", "b2b"] },
  { id: "startup-pitch", version: 2, category: "startup", tier: "premium", price: 20, accent: "#65a30d", tags: ["investor", "pitch", "agritech"] },
  { id: "personal-brand", version: 2, category: "personal", tier: "premium", price: 20, accent: "#c2410c", tags: ["coach", "speaker", "kreator"] },
  { id: "restaurant-saji", version: 2, category: "restaurant", tier: "premium", price: 35, accent: "#14532d", tags: ["menu", "reservasi", "kuliner"] },
  { id: "realestate-hunian", version: 2, category: "realestate", tier: "premium", price: 40, accent: "#0f766e", tags: ["properti", "rumah", "listing"] },
  { id: "education-kelas", version: 2, category: "education", tier: "premium", price: 20, accent: "#2563eb", tags: ["kursus", "course", "bootcamp"] },
  { id: "event-summit", version: 2, category: "event", tier: "premium", price: 35, accent: "#c026d3", tags: ["konferensi", "tiket", "conference"] },
  { id: "photography-lensa", version: 2, category: "photography", tier: "premium", price: 35, accent: "#78716c", tags: ["galeri", "gallery", "wedding"] },
  { id: "tech-devhub", version: 2, category: "technology", tier: "premium", price: 40, accent: "#22d3ee", tags: ["developer", "api", "open source"] },
  { id: "health-klinik", version: 2, category: "health", tier: "premium", price: 35, accent: "#0d9488", tags: ["klinik", "dokter", "booking"] },
  { id: "travel-jelajah", version: 2, category: "travel", tier: "premium", price: 20, accent: "#0284c7", tags: ["wisata", "tour", "destinasi"] },
  { id: "professional-lexa", version: 2, category: "professional", tier: "premium", price: 35, accent: "#b8860b", tags: ["hukum", "law", "konsultan"] },
  { id: "creative-studio", version: 2, category: "creative", tier: "premium", price: 55, accent: "#ec4899", tags: ["studio", "branding", "motion"] },
  { id: "community-kita", version: 2, category: "community", tier: "premium", price: 20, accent: "#7c3aed", tags: ["komunitas", "meetup", "member"] },
  // Rilis katalog v2: 50 template (2 Free + 48 Premium), 4–10 halaman.
  ...V2A_CATALOG,
  ...V2B_CATALOG,
  ...V3C_CATALOG,
  ...V3D_CATALOG,
  // Rilis katalog v4: 20 template (1 Free + 19 Premium), sebagian memakai elemen Chart.
  ...V4E_CATALOG,
  // Rilis katalog v5: 10 template (1 Free + 9 Premium) dengan section Lebar Penuh & Spesialisasi.
  ...V5F_CATALOG,
  // Rilis katalog v6: 100 template (bagian G) dari spesifikasi data, 3–8 halaman.
  ...V6G_CATALOG,
  // Rilis katalog v7: 100 template dashboard (bagian H) + kategori Dashboard.
  ...V7H_CATALOG,
  // Rilis katalog v9: template Premium 3D & animasi (bagian I), 60–300 kredit.
  ...V9I_CATALOG,
  // Rilis katalog v10: template 3D + efek scroll (bagian J), dibuat per batch.
  ...V10J_CATALOG,
];

/* ------------------------------------------------------------------ */
/* Label "Terbaru" + urutan teratas                                     */
/*                                                                    */
/* Hanya unggahan TERAKHIR yang berlabel "Terbaru", dan template itu    */
/* tampil paling atas di urutan "Unggulan" (katalog, demo, seed backend */
/* lewat sortOrder). Saat batch baru diunggah, ganti isi daftar ini;    */
/* label lama otomatis hilang. Berlaku juga untuk Template Kode.        */
/* ------------------------------------------------------------------ */
export const LATEST_TEMPLATE_IDS: readonly string[] = V10J_CATALOG.map((t) => t.id);
const LATEST = new Set(LATEST_TEMPLATE_IDS);
export const isLatestTemplate = (id: string): boolean => LATEST.has(id);

/** Taruh template terbaru paling atas (urutan di LATEST_TEMPLATE_IDS), sisanya tetap urutan semula. */
export function latestFirst<T extends { id: string }>(list: readonly T[]): T[] {
  const rank = (id: string) => (LATEST.has(id) ? LATEST_TEMPLATE_IDS.indexOf(id) : LATEST_TEMPLATE_IDS.length);
  return list.map((t, i) => ({ t, i })).sort((a, b) => rank(a.t.id) - rank(b.t.id) || a.i - b.i).map((x) => x.t);
}

/** Urutan sortOrder seed backend: terbaru jauh di depan, lalu urutan asli `index`. */
export const latestSortOrder = (id: string, index: number): number => (LATEST.has(id) ? LATEST_TEMPLATE_IDS.indexOf(id) - 1_000_000 : index);

/** Urutan sumber tetap (tes & ID lama bergantung padanya); urutan tampil diatur latestFirst/latestSortOrder. */
export const TEMPLATE_CATALOG: TemplateMeta[] = RAW_TEMPLATE_CATALOG.map((t) => ({ ...t, isNew: LATEST.has(t.id) }));

/** @deprecated Harga kini per template (`TemplateMeta.price`). Dipertahankan untuk kompatibilitas. */
export const PREMIUM_TEMPLATE_COST = 12;

/** Urutan kategori di filter katalog. */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  // v7: kategori Dashboard di urutan pertama.
  "dashboard",
  // v16: Template Kode (undangan digital & animasi desain).
  "invitation",
  "animation",
  "company",
  "agency",
  "shop",
  "portfolio",
  "blog",
  "saas",
  "startup",
  "personal",
  "restaurant",
  "realestate",
  "education",
  "event",
  "photography",
  "technology",
  "health",
  "travel",
  "professional",
  "community",
  "creative",
  "fitness",
  "beauty",
  "automotive",
  "finance",
  "nonprofit",
  "wedding",
  "music",
  "construction",
  "hospitality",
  "kids",
  "pets",
  "agriculture",
  "logistics",
  "gaming",
  "architecture",
  "news",
  "sports",
  "government",
  "worship",
  "bakery",
  "insurance",
  "podcast",
  "film",
  "fashion",
  "jewelry",
  "printing",
  "laundry",
  "recruitment",
  "bookstore",
  "florist",
  "energy",
  "science",
  "coworking",
  "dental",
  "furniture",
  "language",
  "maritime",
  "craft",
  "catering",
  "rental",
  "barbershop",
  "museum",
  "pharmacy",
  "carwash",
  "tailor",
  "spa",
  "tattoo",
  "optician",
  "cleaning",
  "moving",
  "security",
  "brewery",
  "library",
  "cooperative",
  "notary",
  "driving",
  "repair",
  "garden",
];
