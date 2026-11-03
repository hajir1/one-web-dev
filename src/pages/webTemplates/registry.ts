import { TEMPLATE_CATALOG, type TemplateMeta } from "../../config/templates";
import type { SavedDesign } from "../pageMaker/core/store/designStore";
import type { SiteDoc } from "../pageMaker/helpers/site";
import { companyStarter } from "./templates/companyStarter";
import { companyAgency } from "./templates/companyAgency";
import { shopStarter } from "./templates/shopStarter";
import { shopBoutique } from "./templates/shopBoutique";
import { PRO_TEMPLATES } from "./templates/pro";
import { V2A_TEMPLATES } from "./templates/v2/setA";
import { V2B_TEMPLATES } from "./templates/v2/setB";
import { V3C_TEMPLATES } from "./templates/v3/setC";
import { V3D_TEMPLATES } from "./templates/v3/setD";
import { V4E_TEMPLATES } from "./templates/v4/setE";
import { V5F_TEMPLATES } from "./templates/v5/setF";
import { V6G_TEMPLATES } from "./templates/v6/setG";
import { V7H_TEMPLATES } from "./templates/v7/setH";
import { V9I_TEMPLATES } from "./templates/v9/setI";
import { V10J_TEMPLATES } from "./templates/v10/setJ";
import type { TemplateContent, TplLang } from "./types";
import { buildTemplatePages, type BuiltTemplatePage } from "./buildPages";

/* ================================================================== */
/* Registry template: metadata (config/templates.ts) + konten.           */
/* ================================================================== */

const CONTENT: Record<string, TemplateContent> = {
  "company-starter": companyStarter,
  "company-agency": companyAgency,
  "shop-starter": shopStarter,
  "shop-boutique": shopBoutique,
  ...PRO_TEMPLATES,
  ...V2A_TEMPLATES,
  ...V2B_TEMPLATES,
  ...V3C_TEMPLATES,
  ...V3D_TEMPLATES,
  ...V4E_TEMPLATES,
  ...V5F_TEMPLATES,
  ...V6G_TEMPLATES,
  ...V7H_TEMPLATES,
  ...V9I_TEMPLATES,
  ...V10J_TEMPLATES,
};

export interface WebTemplate extends TemplateMeta {
  content: TemplateContent;
}

export const WEB_TEMPLATES: WebTemplate[] = TEMPLATE_CATALOG.filter((m) => CONTENT[m.id]).map((m) => ({ ...m, content: CONTENT[m.id] }));

export const getTemplate = (id: string | undefined | null): WebTemplate | null => WEB_TEMPLATES.find((t) => t.id === id) ?? null;

export const toTplLang = (lng: string | undefined): TplLang => (lng?.startsWith("en") ? "en" : "id");

export { buildTemplatePages, type BuiltTemplatePage };

/** Folder website + desain sementara (TIDAK disimpan) untuk pratinjau & unduhan. */
export function templateSite(t: WebTemplate, lang: TplLang, siteName: string): { site: SavedDesign; designs: SavedDesign[]; pages: BuiltTemplatePage[] } {
  const pages = buildTemplatePages(t, lang);
  const now = Date.now();
  const designs: SavedDesign[] = pages.map((p) => ({ id: `tpl-${t.id}-${p.key}`, name: p.name, state: p.doc, updatedAt: now }));
  const home = designs[pages.findIndex((p) => p.home)] ?? designs[0];
  const doc: SiteDoc = {
    version: 1,
    pages: pages.map((p, i) => ({ designId: designs[i].id, slug: p.slug })),
    homepageId: home?.id ?? null,
    source: { templateId: t.id, version: t.version },
  };
  return { site: { id: `tpl-site-${t.id}`, name: siteName, state: doc, updatedAt: now }, designs, pages };
}
