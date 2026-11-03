import type { LibraryId } from "../pages/pageMaker/engine/helpers/libraries";
/* ================================================================== */
/* Tipe data katalog & hak akses (frontend)                              */
/*                                                                    */
/* Bentuk data sengaja dibuat datar dan serializable (tanpa fungsi) agar */
/* nanti bisa dipetakan 1:1 dari respons API. ID item SELALU berupa      */
/* kunci unik berawalan jenis — tidak pernah memakai nama tampilan:       */
/*                                                                    */
/*   template:<templateId>   preset:<presetId>   element:<elementType>   */
/* ================================================================== */

export type Tier = "free" | "premium";
type CatalogKind = "template" | "section" | "element" | "feature";

/** Kunci item katalog, mis. "template:saas-launch", "preset:pro-faq", "element:rating". */
export type ItemId = string;

interface CatalogItemBase {
  id: ItemId;
  kind: CatalogKind;
  /** ID mentah tanpa awalan (id template, id preset, tipe elemen). */
  refId: string;
  name: string;
  description: string;
  category: string;
  tier: Tier;
  /** Harga dalam kredit (lihat config/marketplace.ts). */
  price: number;
  /** Ditambahkan pada rilis katalog ini. */
  isNew: boolean;
}

export interface SectionCatalogItem extends CatalogItemBase {
  kind: "section";
}

export interface ElementCatalogItem extends CatalogItemBase {
  kind: "element";
}

/** Fitur yang dibuka sekali per akun (mis. Tur 360° Pro di menu VR). */
interface FeatureCatalogItem extends CatalogItemBase {
  kind: "feature";
}

export type PieceCatalogItem = SectionCatalogItem | ElementCatalogItem | FeatureCatalogItem;

interface TemplatePageInfo {
  key: string;
  name: string;
  /** Slug & halaman beranda (dari server). */
  slug?: string;
  home?: boolean;
}

export interface TemplateCatalogItem extends CatalogItemBase {
  kind: "template";
  /** Warna aksen kartu katalog. */
  accent: string;
  /** Kata kunci tambahan untuk pencarian. */
  tags: string[];
  pages: TemplatePageInfo[];
  /** Section preset yang dipakai (unik, urut kemunculan). */
  sectionIds: ItemId[];
  /** Elemen yang dipakai (unik, urut kemunculan). */
  elementIds: ItemId[];
  /** Section & element PREMIUM yang ikut dibuka saat template dibeli. */
  premiumItemIds: ItemId[];
  /** Jumlah section di semua halaman (indikator kompleksitas). */
  sectionCount: number;
  /** Library CDN (menu Element → Library) yang dipakai di halaman template. */
  libraries: LibraryId[];
  /** Harga promo yang dihitung server (bila ada). */
  promoPrice?: number;
  /** Halaman demo statis (HTML hasil render server, dibuka di iframe sandbox). */
  demoUrl?: string;
  thumbnailUrl?: string | null;
  version?: number;
  /** Font Google bawaan template (dimuat otomatis). */
  fonts: string[];
  /** v16: Template Kode (satu berkas HTML mandiri, tidak dibuka di Desain Halaman). */
  code?: { group: string; budgetKb: number; libs: string[] };
}

export type CatalogItem = TemplateCatalogItem | SectionCatalogItem | ElementCatalogItem;

/* ------------------------------------------------------------------ */
/* Hak akses — tiga konsep yang dipisah                                 */
/* ------------------------------------------------------------------ */

/** 1. Kepemilikan template. */
interface TemplateOwnership {
  templateId: string;
  acquiredAt: number;
  pricePaid: number;
  source: "simulation" | "server";
}

/** 2. Akses section/element yang DISERTAKAN dalam template (berlaku di desain dari template). */
interface TemplateAccessGrant {
  templateId: string;
  itemIds: ItemId[];
  grantedAt: number;
}

/** 3. Kepemilikan section/element secara individual (berlaku di semua desain). */
interface ItemOwnership {
  itemId: ItemId;
  acquiredAt: number;
  pricePaid: number;
  source: "simulation" | "server";
}

export interface EntitlementSnapshot {
  templates: TemplateOwnership[];
  templateGrants: TemplateAccessGrant[];
  items: ItemOwnership[];
}

/** Konteks pemakaian: desain dari template tertentu, atau desain dari nol. */
export interface AccessContext {
  templateId?: string | null;
}

/**
 * Alasan sebuah item boleh dipakai:
 *   free      — item gratis
 *   owned     — dibeli individual
 *   template  — disertakan template yang dimiliki (hanya di desain dari template)
 *   locked    — belum punya akses
 */
export type AccessReason = "free" | "owned" | "template" | "locked";

/* ------------------------------------------------------------------ */
/* Transaksi akun (dari server)                                         */
/* ------------------------------------------------------------------ */

type TransactionKind = "template" | "item" | "design-pack" | "site-pack" | "topup" | "template-use" | "usage" | "adjustment";

export interface SimTransaction {
  id: string;
  kind: TransactionKind;
  /** Perubahan saldo (negatif = terpakai). */
  credits: number;
  itemId?: ItemId;
  designs?: number;
  /** Jumlah slot website (transaksi site-pack). */
  sites?: number;
  /** Keterangan dari server (ledger). */
  description?: string;
  at: number;
}

export interface SiteQuote {
  sites: number;
  credits: number;
  lines: { packageId: string; sites: number; credits: number; count: number }[];
  /** Harga bila semuanya dibeli satuan (1 website). */
  listCredits: number;
}

export interface DesignQuote {
  designs: number;
  credits: number;
  /** Rincian paket: [{ packageId, count }]. */
  lines: { packageId: string; designs: number; credits: number; count: number }[];
  /** Harga bila semuanya dibeli dengan paket terkecil (untuk menampilkan hemat). */
  listCredits: number;
}
