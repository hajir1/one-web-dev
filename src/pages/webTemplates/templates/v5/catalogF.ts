import { TEMPLATE_PRICE } from "../../../../config/marketplace";
import type { TemplateMeta } from "../../../../config/templates";

/**
 * Metadata for the 10 catalog v5 templates (part F). Content: ./setF/.
 * 1 Free + 9 Premium, 4–6 pages. Every template uses a
 * Full Width section (home header) and a Specialty section (sidebar + inner
 * rows), the same as the Divi-style section types in Page Maker. Premium prices
 * follow the `templatePrice` formula (marketplace/templatePricing.ts).
 */
export const V5F_CATALOG: TemplateMeta[] = [
  { id: "catering-dapur-rasa", version: 1, category: "catering", tier: "free", price: TEMPLATE_PRICE.free, accent: "#c2410c", tags: ["katering", "nasi kotak", "prasmanan"], isNew: true },
  { id: "hotel-teras-senja", version: 1, category: "hospitality", tier: "premium", price: 100, accent: "#b45309", tags: ["resor", "vila", "lombok"], isNew: true },
  { id: "rental-lintas", version: 1, category: "rental", tier: "premium", price: 80, accent: "#dc2626", tags: ["sewa mobil", "car rental", "bali"], isNew: true },
  { id: "yoga-hening", version: 1, category: "fitness", tier: "premium", price: 80, accent: "#7c3aed", tags: ["yoga", "prenatal", "studio"], isNew: true },
  { id: "tax-taksa", version: 1, category: "professional", tier: "premium", price: 80, accent: "#047857", tags: ["konsultan pajak", "spt", "pembukuan"], isNew: true },
  { id: "event-riang-pesta", version: 1, category: "event", tier: "premium", price: 100, accent: "#c026d3", tags: ["event organizer", "pesta", "dekorasi"], isNew: true },
  { id: "barber-cukur-jenggala", version: 1, category: "barbershop", tier: "premium", price: 65, accent: "#b91c1c", tags: ["barbershop", "potong rambut", "cukur"], isNew: true },
  { id: "museum-lini-masa", version: 1, category: "museum", tier: "premium", price: 100, accent: "#78350f", tags: ["museum", "sejarah", "pameran"], isNew: true },
  { id: "app-dompetku", version: 1, category: "technology", tier: "premium", price: 85, accent: "#0891b2", tags: ["aplikasi", "keuangan", "chart"], isNew: true },
  { id: "agro-petik-kebun", version: 1, category: "agriculture", tier: "premium", price: 80, accent: "#ea580c", tags: ["agrowisata", "petik buah", "chart"], isNew: true },
];
