import { TEMPLATE_PRICE } from "../../../../config/marketplace";
import type { TemplateMeta } from "../../../../config/templates";

/**
 * Metadata 25 template katalog v2 (bagian B). Konten: ./setB/.
 * 1 Free + 24 Premium, 4–10 halaman. Harga Premium mengikuti rumus
 * `templatePrice` (marketplace/templatePricing.ts): 3 kredit per halaman
 * + bonus kualitas; diuji di tests/pricing.test.ts.
 */
export const V2B_CATALOG: TemplateMeta[] = [
  { id: "personal-resume", version: 1, category: "personal", tier: "free", price: TEMPLATE_PRICE.free, accent: "#c2410c", tags: ["cv", "resume", "riwayat kerja"], isNew: true },
  { id: "fitness-yoga", version: 2, category: "fitness", tier: "premium", price: 115, accent: "#0d9488", tags: ["yoga", "studio", "retreat"], isNew: true },
  { id: "beauty-barbershop", version: 2, category: "beauty", tier: "premium", price: 95, accent: "#b91c1c", tags: ["barber", "potong rambut", "booking"], isNew: true },
  { id: "automotive-dealer", version: 2, category: "automotive", tier: "premium", price: 145, accent: "#dc2626", tags: ["mobil", "dealer", "test drive"], isNew: true },
  { id: "finance-accounting", version: 2, category: "finance", tier: "premium", price: 125, accent: "#047857", tags: ["akuntan", "pajak", "bookkeeping"], isNew: true },
  { id: "nonprofit-foundation-edu", version: 2, category: "nonprofit", tier: "premium", price: 100, accent: "#ea580c", tags: ["yayasan", "donasi", "charity"], isNew: true },
  { id: "wedding-organizer", version: 2, category: "wedding", tier: "premium", price: 130, accent: "#b0855b", tags: ["pernikahan", "wedding planner", "adat"], isNew: true },
  { id: "music-school", version: 2, category: "music", tier: "premium", price: 115, accent: "#4f46e5", tags: ["kursus musik", "piano", "lessons"], isNew: true },
  { id: "construction-interior", version: 2, category: "construction", tier: "premium", price: 145, accent: "#d97706", tags: ["kontraktor", "renovasi", "interior"], isNew: true },
  { id: "hospitality-villa", version: 2, category: "hospitality", tier: "premium", price: 160, accent: "#3f6b4f", tags: ["vila", "resort", "booking"], isNew: true },
  { id: "kids-toystore", version: 2, category: "kids", tier: "premium", price: 80, accent: "#f43f5e", tags: ["mainan", "toys", "anak"], isNew: true },
  { id: "pets-shop", version: 2, category: "pets", tier: "premium", price: 95, accent: "#f97316", tags: ["petshop", "grooming", "hewan"], isNew: true },
  { id: "agri-coffee-farm", version: 2, category: "agriculture", tier: "premium", price: 110, accent: "#4d7c0f", tags: ["kebun kopi", "farm", "petani"], isNew: true },
  { id: "logistics-cargo", version: 2, category: "logistics", tier: "premium", price: 130, accent: "#f59e0b", tags: ["ekspedisi", "cargo", "lacak"], isNew: true },
  { id: "gaming-esports-team", version: 2, category: "gaming", tier: "premium", price: 100, accent: "#84cc16", tags: ["esports", "tim game", "turnamen"], isNew: true },
  { id: "architecture-landscape", version: 2, category: "architecture", tier: "premium", price: 80, accent: "#5a7a4a", tags: ["lanskap", "taman", "landscape"], isNew: true },
  { id: "news-magazine", version: 2, category: "news", tier: "premium", price: 155, accent: "#c8102e", tags: ["berita", "majalah", "media"], isNew: true },
  { id: "startup-fintech", version: 2, category: "startup", tier: "premium", price: 145, accent: "#7c3aed", tags: ["fintech", "dompet digital", "app"], isNew: true },
  { id: "shop-furniture", version: 2, category: "shop", tier: "premium", price: 125, accent: "#9a6b3f", tags: ["furnitur", "mebel", "furniture"], isNew: true },
  { id: "education-language", version: 2, category: "education", tier: "premium", price: 160, accent: "#0b6bcb", tags: ["kursus bahasa", "ielts", "language"], isNew: true },
  { id: "health-pharmacy", version: 2, category: "health", tier: "premium", price: 110, accent: "#059669", tags: ["apotek", "pharmacy", "obat"], isNew: true },
  { id: "photography-wedding-film", version: 2, category: "photography", tier: "premium", price: 70, accent: "#b08d57", tags: ["videografi", "wedding film", "foto"], isNew: true },
  { id: "tech-cybersecurity", version: 2, category: "technology", tier: "premium", price: 130, accent: "#06b6d4", tags: ["keamanan siber", "pentest", "soc"], isNew: true },
  { id: "professional-notary", version: 2, category: "professional", tier: "premium", price: 65, accent: "#7f1d1d", tags: ["notaris", "ppat", "akta"], isNew: true },
  { id: "community-coworking", version: 2, category: "community", tier: "premium", price: 100, accent: "#c2562e", tags: ["coworking", "ruang kerja", "komunitas"], isNew: true },
];
