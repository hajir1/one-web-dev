import { TEMPLATE_PRICE } from "../../../../config/marketplace";
import type { TemplateMeta } from "../../../../config/templates";

/**
 * Metadata for the 25 catalog v3 templates (part D). Content: ./setD/.
 * 1 Free + 24 Premium, 4–10 pages. Premium prices follow the
 * `templatePrice` formula (marketplace/templatePricing.ts): 3 credits per page
 * + a quality bonus; tested in tests/pricing.test.ts.
 */
export const V3D_CATALOG: TemplateMeta[] = [
  { id: "blog-catatan-kuliner", version: 1, category: "blog", tier: "free", price: TEMPLATE_PRICE.free, accent: "#c2410c", tags: ["kuliner", "resep", "blog"], isNew: true },
  { id: "government-desa-digital", version: 1, category: "government", tier: "premium", price: 125, accent: "#166534", tags: ["desa", "layanan publik", "apbdes"], isNew: true },
  { id: "government-dinas-pariwisata", version: 1, category: "government", tier: "premium", price: 145, accent: "#0e7490", tags: ["dinas", "pariwisata", "agenda"], isNew: true },
  { id: "insurance-lindungi", version: 1, category: "insurance", tier: "premium", price: 115, accent: "#1d4ed8", tags: ["asuransi", "proteksi", "klaim"], isNew: true },
  { id: "insurance-auto", version: 1, category: "insurance", tier: "premium", price: 80, accent: "#ea580c", tags: ["asuransi kendaraan", "klaim", "bengkel rekanan"], isNew: true },
  { id: "film-produksi", version: 1, category: "film", tier: "premium", price: 95, accent: "#111827", tags: ["rumah produksi", "film", "iklan"], isNew: true },
  { id: "film-festival", version: 1, category: "film", tier: "premium", price: 80, accent: "#b91c1c", tags: ["festival film", "jadwal", "tiket"], isNew: true },
  { id: "jewelry-emas", version: 1, category: "jewelry", tier: "premium", price: 95, accent: "#a16207", tags: ["perhiasan", "emas", "berlian"], isNew: true },
  { id: "jewelry-handmade", version: 1, category: "jewelry", tier: "premium", price: 60, accent: "#9d174d", tags: ["handmade", "aksesoris", "perak"], isNew: true },
  { id: "recruitment-talenta", version: 1, category: "recruitment", tier: "premium", price: 130, accent: "#0f766e", tags: ["rekrutmen", "headhunter", "hr"], isNew: true },
  { id: "recruitment-job-board", version: 1, category: "recruitment", tier: "premium", price: 115, accent: "#4338ca", tags: ["lowongan", "karier", "job board"], isNew: true },
  { id: "bookstore-pustaka", version: 1, category: "bookstore", tier: "premium", price: 95, accent: "#7c2d12", tags: ["toko buku", "buku", "komunitas baca"], isNew: true },
  { id: "bookstore-penerbit", version: 1, category: "bookstore", tier: "premium", price: 80, accent: "#be123c", tags: ["penerbit", "naskah", "katalog buku"], isNew: true },
  { id: "energy-surya", version: 1, category: "energy", tier: "premium", price: 115, accent: "#ca8a04", tags: ["panel surya", "energi terbarukan", "instalasi"], isNew: true },
  { id: "energy-ev-charging", version: 1, category: "energy", tier: "premium", price: 80, accent: "#059669", tags: ["ev charging", "mobil listrik", "spklu"], isNew: true },
  { id: "science-lab-riset", version: 1, category: "science", tier: "premium", price: 130, accent: "#0369a1", tags: ["laboratorium", "riset", "publikasi"], isNew: true },
  { id: "science-museum", version: 1, category: "science", tier: "premium", price: 95, accent: "#7e22ce", tags: ["museum sains", "pameran", "edukasi"], isNew: true },
  { id: "printing-merch", version: 1, category: "printing", tier: "premium", price: 80, accent: "#e11d48", tags: ["merchandise", "sablon", "custom"], isNew: true },
  { id: "laundry-kiloan-express", version: 1, category: "laundry", tier: "premium", price: 60, accent: "#2563eb", tags: ["laundry kiloan", "express", "langganan"], isNew: true },
  { id: "saas-hr-absensi", version: 1, category: "saas", tier: "premium", price: 160, accent: "#6366f1", tags: ["hris", "absensi", "payroll"], isNew: true },
  { id: "finance-koperasi", version: 1, category: "finance", tier: "premium", price: 110, accent: "#15803d", tags: ["koperasi", "simpan pinjam", "anggota"], isNew: true },
  { id: "realestate-apartemen", version: 1, category: "realestate", tier: "premium", price: 145, accent: "#334155", tags: ["apartemen", "unit", "virtual tour"], isNew: true },
  { id: "music-dj", version: 1, category: "music", tier: "premium", price: 65, accent: "#d946ef", tags: ["dj", "event", "mixtape"], isNew: true },
  { id: "nonprofit-lingkungan", version: 1, category: "nonprofit", tier: "premium", price: 95, accent: "#65a30d", tags: ["lingkungan", "relawan", "donasi"], isNew: true },
  { id: "agency-seo", version: 1, category: "agency", tier: "premium", price: 130, accent: "#f59e0b", tags: ["seo", "digital marketing", "audit"], isNew: true },
];
