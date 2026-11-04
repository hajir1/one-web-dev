import { TEMPLATE_PRICE } from "../../../../config/marketplace";
import type { TemplateMeta } from "../../../../config/templates";

/**
 * Metadata for the 20 catalog v4 templates (part E). Content: ./setE/.
 * 1 Free + 19 Premium, 4–9 pages. Some data templates use the
 * Chart element (Chart.js is added automatically via CDN on export). Premium prices
 * follow the `templatePrice` formula (marketplace/templatePricing.ts).
 */
export const V4E_CATALOG: TemplateMeta[] = [
  { id: "coworking-ruang-temu", version: 1, category: "coworking", tier: "free", price: TEMPLATE_PRICE.free, accent: "#0f766e", tags: ["coworking", "ruang kerja", "meeting room"], isNew: true },
  { id: "coworking-hub-kreatif", version: 1, category: "coworking", tier: "premium", price: 100, accent: "#7c3aed", tags: ["creative hub", "membership", "event"], isNew: true },
  { id: "dental-senyum-sehat", version: 1, category: "dental", tier: "premium", price: 95, accent: "#0ea5e9", tags: ["klinik gigi", "dokter gigi", "booking"], isNew: true },
  { id: "dental-ortho", version: 1, category: "dental", tier: "premium", price: 85, accent: "#db2777", tags: ["ortodonti", "kawat gigi", "aligner"], isNew: true },
  { id: "furniture-kayu-jati", version: 1, category: "furniture", tier: "premium", price: 115, accent: "#92400e", tags: ["mebel", "kayu jati", "custom"], isNew: true },
  { id: "furniture-minimalis", version: 1, category: "furniture", tier: "premium", price: 80, accent: "#404040", tags: ["furnitur", "minimalis", "interior"], isNew: true },
  { id: "language-kursus-bahasa", version: 1, category: "language", tier: "premium", price: 115, accent: "#dc2626", tags: ["kursus bahasa", "toefl", "kelas"], isNew: true },
  { id: "language-les-privat", version: 1, category: "language", tier: "premium", price: 65, accent: "#2563eb", tags: ["les privat", "tutor", "online"], isNew: true },
  { id: "maritime-diving-trip", version: 1, category: "maritime", tier: "premium", price: 95, accent: "#0369a1", tags: ["diving", "snorkeling", "open trip"], isNew: true },
  { id: "maritime-pelayaran", version: 1, category: "maritime", tier: "premium", price: 130, accent: "#1e3a8a", tags: ["pelayaran", "kapal", "jadwal"], isNew: true },
  { id: "craft-anyaman", version: 1, category: "craft", tier: "premium", price: 80, accent: "#a16207", tags: ["anyaman", "kerajinan", "rotan"], isNew: true },
  { id: "craft-keramik", version: 1, category: "craft", tier: "premium", price: 65, accent: "#c2410c", tags: ["keramik", "workshop", "pottery"], isNew: true },
  { id: "saas-analitik-data", version: 1, category: "saas", tier: "premium", price: 145, accent: "#4f46e5", tags: ["analitik", "dashboard", "chart"], isNew: true },
  { id: "finance-investasi", version: 1, category: "finance", tier: "premium", price: 130, accent: "#047857", tags: ["investasi", "reksa dana", "chart"], isNew: true },
  { id: "agriculture-hidroponik", version: 1, category: "agriculture", tier: "premium", price: 95, accent: "#16a34a", tags: ["hidroponik", "sayur", "panen"], isNew: true },
  { id: "nonprofit-laporan-dampak", version: 1, category: "nonprofit", tier: "premium", price: 110, accent: "#be185d", tags: ["laporan dampak", "donasi", "transparansi"], isNew: true },
  { id: "energy-angin", version: 1, category: "energy", tier: "premium", price: 80, accent: "#0891b2", tags: ["energi angin", "turbin", "data produksi"], isNew: true },
  { id: "startup-pitch-deck", version: 1, category: "startup", tier: "premium", price: 80, accent: "#f97316", tags: ["pitch", "investor", "traksi"], isNew: true },
  { id: "education-bimbel-online", version: 1, category: "education", tier: "premium", price: 130, accent: "#9333ea", tags: ["bimbel", "kelas online", "try out"], isNew: true },
  { id: "logistics-gudang", version: 1, category: "logistics", tier: "premium", price: 95, accent: "#b45309", tags: ["gudang", "fulfillment", "inventaris"], isNew: true },
];
