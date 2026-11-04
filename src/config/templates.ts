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
/* Web Templates catalog (metadata); each template's content lives in    */
/* pages/webTemplates/templates/. Names & descriptions shown via locales: */
/* templates.items.<id>.{name,description}.                             */
/*                                                                    */
/* - tier "free"    : usable right away (no purchase).                  */
/* - tier "premium" : free preview; download & edit after the template   */
/*   purchased (local simulation at this stage, see src/marketplace/).  */
/*                                                                    */
/* Price: Free = 0 credits, Premium = 3 credits per page + a           */
/* quality bonus of 0–2 (see marketplace/templatePricing.ts).           */
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
  // v16: Code Templates (part J)
  | "invitation"
  | "animation";

export type TemplateTier = "free" | "premium";

export interface TemplateMeta {
  id: string;
  /** Bumped when template content changes (stored in edited websites). */
  version: number;
  category: TemplateCategory;
  tier: TemplateTier;
  /** Price in credits (Free = TEMPLATE_PRICE.free). */
  price: number;
  /** Catalog card accent color. */
  accent: string;
  /** Extra search keywords (language neutral). */
  tags: string[];
  /** "Latest" label: only templates in LATEST_TEMPLATE_IDS (the last upload), set automatically below. */
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
  // Catalog release v2: 50 templates (2 Free + 48 Premium), 4–10 pages.
  ...V2A_CATALOG,
  ...V2B_CATALOG,
  ...V3C_CATALOG,
  ...V3D_CATALOG,
  // Catalog release v4: 20 templates (1 Free + 19 Premium), some using the Chart element.
  ...V4E_CATALOG,
  // Catalog release v5: 10 templates (1 Free + 9 Premium) with Full Width & Specialty sections.
  ...V5F_CATALOG,
  // Catalog release v6: 100 templates (part G) from the data spec, 3–8 pages.
  ...V6G_CATALOG,
  // Catalog release v7: 100 dashboard templates (part H) + Dashboard category.
  ...V7H_CATALOG,
  // Catalog release v9: Premium 3D & animation templates (part I), 60–300 credits.
  ...V9I_CATALOG,
  // Catalog release v10: 3D + scroll effect templates (part J), made in batches.
  ...V10J_CATALOG,
];

/* ------------------------------------------------------------------ */
/* "Newest" label + top ordering                                        */
/*                                                                    */
/* Only the LAST upload is labeled "Latest", and those templates         */
/* appear at the top of the "Featured" order (catalog, demo, backend seed */
/* via sortOrder). When a new batch is uploaded, replace this list;      */
/* old labels disappear automatically. Also applies to Code Templates.  */
/* ------------------------------------------------------------------ */
/* v29 upload: 15 3D scroll stories, 15 invitations, 10 pure CSS animations (Code Templates). */
export const LATEST_TEMPLATE_IDS: readonly string[] = [
  "story-benang-rajut",
  "story-sawah-terasering",
  "story-seribu-bangau",
  "story-senar-gitar",
  "story-lilin-aroma",
  "story-ombak-selancar",
  "story-pizza-tungku",
  "story-satelit-jaringan",
  "story-sepeda-lembah",
  "story-kotak-musik",
  "story-teh-kebun",
  "story-jahit-busana",
  "story-kompas-properti",
  "story-daur-kertas",
  "story-cat-sanggar",
  "undangan-nikah-segel-lilin",
  "undangan-nikah-lensa-kamera",
  "undangan-ultah-60-lampion",
  "undangan-reuni-kalender-sobek",
  "undangan-tujuh-bulan-anyaman",
  "undangan-nikah-candi-bentar",
  "undangan-wisuda-ubin-balik",
  "undangan-rumah-jendela-kayu",
  "undangan-ultah-anak-kue-lapis",
  "undangan-khitanan-balon-letus",
  "undangan-nikah-kartu-pos",
  "undangan-ultah-30-kaca-pecah",
  "undangan-aqiqah-tetes-madu",
  "undangan-lamaran-surat-lipat",
  "undangan-nikah-tirai-manik",
  "anim-css-matahari-terbit",
  "anim-css-kincir-angin",
  "anim-css-kapal-kertas",
  "anim-css-roket-luncur",
  "anim-css-kebun-bunga",
  "anim-css-api-unggun",
  "anim-css-lampu-kota",
  "anim-css-pesawat-spanduk",
  "anim-css-mesin-ketik",
  "anim-css-orbit-planet",
];
const LATEST = new Set(LATEST_TEMPLATE_IDS);
export const isLatestTemplate = (id: string): boolean => LATEST.has(id);

/** Puts the latest templates on top (in LATEST_TEMPLATE_IDS order); the rest keep their original order. */
export function latestFirst<T extends { id: string }>(list: readonly T[]): T[] {
  const rank = (id: string) => (LATEST.has(id) ? LATEST_TEMPLATE_IDS.indexOf(id) : LATEST_TEMPLATE_IDS.length);
  return list.map((t, i) => ({ t, i })).sort((a, b) => rank(a.t.id) - rank(b.t.id) || a.i - b.i).map((x) => x.t);
}

/** Backend seed sortOrder: latest far ahead, then the original `index` order. */
export const latestSortOrder = (id: string, index: number): number => (LATEST.has(id) ? LATEST_TEMPLATE_IDS.indexOf(id) - 1_000_000 : index);

/** Source order stays fixed (tests & old IDs depend on it); display order is set by latestFirst/latestSortOrder. */
export const TEMPLATE_CATALOG: TemplateMeta[] = RAW_TEMPLATE_CATALOG.map((t) => ({ ...t, isNew: LATEST.has(t.id) }));

/** @deprecated Prices are now per template (`TemplateMeta.price`). Kept for compatibility. */
export const PREMIUM_TEMPLATE_COST = 12;

/** Category order in the catalog filter. */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  // v7: Dashboard category first.
  "dashboard",
  // v16: Code Templates (digital invitations & design animations).
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
