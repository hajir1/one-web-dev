import { TEMPLATE_PRICE } from "../../../../config/marketplace";
import type { TemplateMeta } from "../../../../config/templates";

/**
 * Metadata for the 25 catalog v3 templates (part C). Content: ./setC/.
 * 1 Free + 24 Premium, 4–10 pages. Premium prices follow the
 * `templatePrice` formula (marketplace/templatePricing.ts): 3 credits per page
 * + a quality bonus; tested in tests/pricing.test.ts.
 */
export const V3C_CATALOG: TemplateMeta[] = [
  { id: "bakery-roti-hangat", version: 1, category: "bakery", tier: "free", price: TEMPLATE_PRICE.free, accent: "#b45309", tags: ["roti", "bakery", "pesan antar"], isNew: true },
  { id: "sports-futsal-arena", version: 1, category: "sports", tier: "premium", price: 95, accent: "#16a34a", tags: ["futsal", "sewa lapangan", "turnamen"], isNew: true },
  { id: "sports-runclub", version: 1, category: "sports", tier: "premium", price: 80, accent: "#f43f5e", tags: ["lari", "komunitas", "race"], isNew: true },
  { id: "worship-masjid-annur", version: 1, category: "worship", tier: "premium", price: 95, accent: "#047857", tags: ["masjid", "kajian", "zakat"], isNew: true },
  { id: "worship-gereja-kasih", version: 1, category: "worship", tier: "premium", price: 80, accent: "#6d28d9", tags: ["gereja", "ibadah", "pelayanan"], isNew: true },
  { id: "bakery-patisserie", version: 1, category: "bakery", tier: "premium", price: 115, accent: "#be185d", tags: ["patisserie", "kue", "custom cake"], isNew: true },
  { id: "podcast-ruang-dengar", version: 1, category: "podcast", tier: "premium", price: 80, accent: "#7c3aed", tags: ["podcast", "episode", "audio"], isNew: true },
  { id: "podcast-studio-suara", version: 1, category: "podcast", tier: "premium", price: 65, accent: "#0f766e", tags: ["studio rekaman", "sewa studio", "voice over"], isNew: true },
  { id: "fashion-streetwear", version: 1, category: "fashion", tier: "premium", price: 115, accent: "#18181b", tags: ["streetwear", "drop", "lookbook"], isNew: true },
  { id: "fashion-batik-nusantara", version: 1, category: "fashion", tier: "premium", price: 125, accent: "#92400e", tags: ["batik", "wastra", "koleksi"], isNew: true },
  { id: "printing-cetak-kilat", version: 1, category: "printing", tier: "premium", price: 95, accent: "#0284c7", tags: ["percetakan", "banner", "kartu nama"], isNew: true },
  { id: "laundry-bersih", version: 1, category: "laundry", tier: "premium", price: 65, accent: "#0891b2", tags: ["laundry", "antar jemput", "kiloan"], isNew: true },
  { id: "florist-kembang", version: 1, category: "florist", tier: "premium", price: 80, accent: "#db2777", tags: ["florist", "buket", "hampers"], isNew: true },
  { id: "florist-wedding-bloom", version: 1, category: "florist", tier: "premium", price: 100, accent: "#a16207", tags: ["dekorasi bunga", "pernikahan", "venue"], isNew: true },
  { id: "shop-gadget", version: 1, category: "shop", tier: "premium", price: 145, accent: "#2563eb", tags: ["gadget", "elektronik", "garansi"], isNew: true },
  { id: "portfolio-illustrator", version: 1, category: "portfolio", tier: "premium", price: 65, accent: "#ea580c", tags: ["ilustrator", "karya", "komisi"], isNew: true },
  { id: "restaurant-ramen", version: 1, category: "restaurant", tier: "premium", price: 95, accent: "#dc2626", tags: ["ramen", "izakaya", "menu"], isNew: true },
  { id: "health-psikolog", version: 1, category: "health", tier: "premium", price: 80, accent: "#0d9488", tags: ["psikolog", "konseling", "kesehatan mental"], isNew: true },
  { id: "education-tahfidz", version: 1, category: "education", tier: "premium", price: 115, accent: "#15803d", tags: ["tahfidz", "pesantren", "quran"], isNew: true },
  { id: "technology-ai-lab", version: 1, category: "technology", tier: "premium", price: 130, accent: "#4f46e5", tags: ["ai", "machine learning", "riset"], isNew: true },
  { id: "travel-diving", version: 1, category: "travel", tier: "premium", price: 95, accent: "#0369a1", tags: ["diving", "snorkeling", "trip"], isNew: true },
  { id: "creative-tattoo", version: 1, category: "creative", tier: "premium", price: 65, accent: "#171717", tags: ["tattoo", "artist", "booking"], isNew: true },
  { id: "hospitality-capsule-hotel", version: 1, category: "hospitality", tier: "premium", price: 115, accent: "#c2410c", tags: ["capsule hotel", "hostel", "backpacker"], isNew: true },
  { id: "startup-edtech", version: 1, category: "startup", tier: "premium", price: 145, accent: "#9333ea", tags: ["edtech", "aplikasi belajar", "startup"], isNew: true },
  { id: "company-konsultan-pajak", version: 1, category: "company", tier: "premium", price: 160, accent: "#1e3a8a", tags: ["pajak", "konsultan", "akuntansi"], isNew: true },
];
