import type { TemplateMeta } from "../../../../config/templates";

/**
 * Catalog v10 template metadata (part J, 3D + OWD Scroll effects). Content: ./setJ/.
 * Built per batch (10 templates per batch, 2 of them portfolios).
 * Price = set I showcasePrice: 25/page + 20/3D kind (three-* or tilt elements) + quality bonus.
 */
export const V10J_CATALOG: TemplateMeta[] = [
  { id: "j3d-tanah-liat-kasongan", version: 1, category: "craft", tier: "premium", price: 95, accent: "#B5532A", tags: ["gerabah", "kerajinan", "Kasongan", "pot tanaman", "3d"], isNew: true },
  { id: "j3d-bayu-kertanegara", version: 1, category: "portfolio", tier: "premium", price: 95, accent: "#1F3A5F", tags: ["arsitek", "portofolio", "arsitektur tropis", "denah", "3d"], isNew: true },
  { id: "j3d-nadia-pramesti", version: 1, category: "photography", tier: "premium", price: 95, accent: "#B23A2B", tags: ["fotografer", "portofolio", "dokumenter", "esai foto", "3d"], isNew: true },
  { id: "j3d-kongsi-pala-banda", version: 1, category: "agriculture", tier: "premium", price: 95, accent: "#9E2A2B", tags: ["pala", "ekspor rempah", "fuli", "Banda Neira", "3d"], isNew: true },
  { id: "j3d-jamu-bakul", version: 1, category: "brewery", tier: "premium", price: 95, accent: "#E8A317", tags: ["jamu", "minuman herbal", "kunyit asam", "produk baru", "3d"], isNew: true },
  { id: "j3d-angin-timur-layang", version: 1, category: "event", tier: "premium", price: 100, accent: "#D2412F", tags: ["festival", "layang-layang", "acara pantai", "tiket", "3d"], isNew: true },
  { id: "j3d-sambal-bu-rum", version: 1, category: "catering", tier: "premium", price: 95, accent: "#C8241B", tags: ["sambal", "makanan rumahan", "UMKM", "jar", "3d"], isNew: true },
  { id: "j3d-roda-lawas", version: 1, category: "automotive", tier: "premium", price: 95, accent: "#1E4D3B", tags: ["bengkel sepeda", "onthel", "restorasi", "Kotagede", "3d"], isNew: true },
  { id: "j3d-ombak-kidul", version: 1, category: "sports", tier: "premium", price: 95, accent: "#00838A", tags: ["selancar", "sekolah surfing", "Batu Karas", "wisata pantai", "3d"], isNew: true },
  { id: "j3d-petak-sembilan", version: 1, category: "construction", tier: "premium", price: 100, accent: "#A8442E", tags: ["tegel", "ubin semen", "Kotagede", "bahan bangunan", "3d"], isNew: true },
];
