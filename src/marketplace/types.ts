import type { LibraryId } from "../pages/pageMaker/engine/helpers/libraries";
/* ================================================================== */
/* Catalog data types & access rights (frontend)                         */
/*                                                                    */
/* Data shapes are deliberately flat and serializable (no functions) so  */
/* they can later be mapped 1:1 from API responses. Item IDs are ALWAYS  */
/* unique keys prefixed by kind, never display names:                   */
/*                                                                    */
/*   template:<templateId>   preset:<presetId>   element:<elementType>   */
/* ================================================================== */

export type Tier = "free" | "premium";
type CatalogKind = "template" | "section" | "element" | "feature";

/** Catalog item key, e.g. "template:saas-launch", "preset:pro-faq", "element:rating". */
export type ItemId = string;

interface CatalogItemBase {
  id: ItemId;
  kind: CatalogKind;
  /** Raw ID without a prefix (template id, preset id, element type). */
  refId: string;
  name: string;
  description: string;
  category: string;
  tier: Tier;
  /** Price in credits (see config/marketplace.ts). */
  price: number;
  /** Added in this catalog release. */
  isNew: boolean;
}

export interface SectionCatalogItem extends CatalogItemBase {
  kind: "section";
}

export interface ElementCatalogItem extends CatalogItemBase {
  kind: "element";
}

/** Features unlocked once per account (e.g. 360° Tour Pro in the VR menu). */
interface FeatureCatalogItem extends CatalogItemBase {
  kind: "feature";
}

export type PieceCatalogItem = SectionCatalogItem | ElementCatalogItem | FeatureCatalogItem;

interface TemplatePageInfo {
  key: string;
  name: string;
  /** Slug & home page (from the server). */
  slug?: string;
  home?: boolean;
}

export interface TemplateCatalogItem extends CatalogItemBase {
  kind: "template";
  /** Catalog card accent color. */
  accent: string;
  /** Extra search keywords. */
  tags: string[];
  pages: TemplatePageInfo[];
  /** Section presets used (unique, in order of appearance). */
  sectionIds: ItemId[];
  /** Elements used (unique, in order of appearance). */
  elementIds: ItemId[];
  /** PREMIUM sections & elements unlocked when the template is purchased. */
  premiumItemIds: ItemId[];
  /** Number of sections across all pages (complexity indicator). */
  sectionCount: number;
  /** CDN libraries (Element → Library menu) used in the template pages. */
  libraries: LibraryId[];
  /** Promo price computed by the server (if any). */
  promoPrice?: number;
  /** Static demo pages (HTML rendered by the server, opened in a sandboxed iframe). */
  demoUrl?: string;
  thumbnailUrl?: string | null;
  version?: number;
  /** The template's built-in Google Fonts (loaded automatically). */
  fonts: string[];
  /** v16: Code Template (one self-contained HTML file, not opened in Page Design). */
  code?: { group: string; budgetKb: number; libs: string[] };
}

export type CatalogItem = TemplateCatalogItem | SectionCatalogItem | ElementCatalogItem;

/* ------------------------------------------------------------------ */
/* Access rights — three separate concepts                              */
/* ------------------------------------------------------------------ */

/** 1. Kepemilikan template. */
interface TemplateOwnership {
  templateId: string;
  acquiredAt: number;
  pricePaid: number;
  source: "simulation" | "server";
}

/** 2. Access to sections/elements INCLUDED in the template (applies in designs from the template). */
interface TemplateAccessGrant {
  templateId: string;
  itemIds: ItemId[];
  grantedAt: number;
}

/** 3. Individual ownership of sections/elements (applies in every design). */
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

/** Usage context: a design from a specific template, or a design from scratch. */
export interface AccessContext {
  templateId?: string | null;
}

/**
 * Why an item may be used:
 *   free      — free item
 *   owned     — purchased individually
 *   template  — included with an owned template (only in designs from that template)
 *   locked    — no access yet
 */
export type AccessReason = "free" | "owned" | "template" | "locked";

/* ------------------------------------------------------------------ */
/* Account transactions (from the server)                               */
/* ------------------------------------------------------------------ */

type TransactionKind = "template" | "item" | "design-pack" | "site-pack" | "topup" | "template-use" | "usage" | "adjustment";

export interface SimTransaction {
  id: string;
  kind: TransactionKind;
  /** Perubahan saldo (negatif = terpakai). */
  credits: number;
  itemId?: ItemId;
  designs?: number;
  /** Number of website slots (site-pack transaction). */
  sites?: number;
  /** Description from the server (ledger). */
  description?: string;
  at: number;
}

export interface SiteQuote {
  sites: number;
  credits: number;
  lines: { packageId: string; sites: number; credits: number; count: number }[];
  /** Price if everything were bought individually (1 website). */
  listCredits: number;
}

export interface DesignQuote {
  designs: number;
  credits: number;
  /** Pack breakdown: [{ packageId, count }]. */
  lines: { packageId: string; designs: number; credits: number; count: number }[];
  /** Price if everything were bought with the smallest pack (to show savings). */
  listCredits: number;
}
