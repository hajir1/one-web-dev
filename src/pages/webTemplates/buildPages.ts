import type { TemplateMeta } from "../../config/templates";
import type { PageDoc } from "../pageMaker/helpers/pageDoc";
import { makeTr, type TemplateContent, type TplLang } from "./types";
import { applyLibraryPlan } from "./templates/libraryPlan";
import { polishTemplatePage } from "./templates/polish";
import { applyTemplateCrud } from "./templateCrud";
import { calmHero, prioritizeHeroImage } from "./templates/heroPriority";
import { fixPageContrast } from "./templates/contrastFix";

/* ================================================================== */
/* Bangun halaman template dari kontennya. Dipisah dari registry.ts     */
/* (v12) supaya mode demo bisa membangun template tanpa ikut memuat isi  */
/* SEMUA template (registry mengimpor seluruh katalog).                  */
/* ================================================================== */

export interface BuiltTemplatePage {
  key: string;
  slug: string;
  name: string;
  home: boolean;
  doc: PageDoc;
}

/**
 * Bangun semua halaman template dalam bahasa `lang`. Setiap panggilan menghasilkan pohon baru (ID node baru).
 * Desain mencatat `source.templateId`: item Premium bawaan template hanya berlaku di desain ini.
 */
export function buildTemplatePages(t: Pick<TemplateMeta, "id" | "version"> & { content: TemplateContent }, lang: TplLang): BuiltTemplatePage[] {
  const tr = makeTr(lang);
  const defs = t.content.pages;
  const href = (key: string) => {
    const d = defs.find((p) => p.key === key);
    if (!d) return "#";
    return d.home ? "index.html" : `${d.slug[lang]}.html`;
  };
  // Uji coba CRUD: katalog Product Card → koleksi data (+ halaman item bila ada halaman detail).
  return applyTemplateCrud(defs.map((d) => ({ key: d.key, slug: d.slug[lang], name: d.name[lang], home: !!d.home, doc: { ...fixPageContrast(prioritizeHeroImage(calmHero((t.content.polish === false ? (x: PageDoc) => x : polishTemplatePage)(applyLibraryPlan(t.id, t.content.build(d.key, tr, href)))))), source: { templateId: t.id, version: t.version } } })), lang, (t as { category?: string }).category);
}

