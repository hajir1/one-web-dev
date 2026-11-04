import type { TemplateMeta } from "../../config/templates";
import type { PageDoc } from "../pageMaker/helpers/pageDoc";
import { makeTr, type TemplateContent, type TplLang } from "./types";
import { applyLibraryPlan } from "./templates/libraryPlan";
import { polishTemplatePage } from "./templates/polish";
import { applyTemplateCrud } from "./templateCrud";
import { calmHero, prioritizeHeroImage } from "./templates/heroPriority";
import { fixPageContrast } from "./templates/contrastFix";

/* ================================================================== */
/* Builds template pages from their content. Split from registry.ts     */
/* (v12) so demo mode can build templates without also loading the content */
/* ALL templates (the registry imports the whole catalog).               */
/* ================================================================== */

export interface BuiltTemplatePage {
  key: string;
  slug: string;
  name: string;
  home: boolean;
  doc: PageDoc;
}

/**
 * Builds every template page in language `lang`. Each call produces a new tree (new node IDs).
 * The design records `source.templateId`: the template's built-in Premium items only apply in this design.
 */
export function buildTemplatePages(t: Pick<TemplateMeta, "id" | "version"> & { content: TemplateContent }, lang: TplLang): BuiltTemplatePage[] {
  const tr = makeTr(lang);
  const defs = t.content.pages;
  const href = (key: string) => {
    const d = defs.find((p) => p.key === key);
    if (!d) return "#";
    return d.home ? "index.html" : `${d.slug[lang]}.html`;
  };
  // CRUD preview: a Product Card catalog → a data collection (+ item pages when there is a detail page).
  return applyTemplateCrud(defs.map((d) => ({ key: d.key, slug: d.slug[lang], name: d.name[lang], home: !!d.home, doc: { ...fixPageContrast(prioritizeHeroImage(calmHero((t.content.polish === false ? (x: PageDoc) => x : polishTemplatePage)(applyLibraryPlan(t.id, t.content.build(d.key, tr, href)))))), source: { templateId: t.id, version: t.version } } })), lang, (t as { category?: string }).category);
}

