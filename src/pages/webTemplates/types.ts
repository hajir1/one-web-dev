import type { PageDoc } from "../pageMaker/helpers/pageDoc";

export type TplLang = "id" | "en";

/** Pick the text for the template content language. */
export type Tr = (id: string, en: string) => string;
export const makeTr = (lang: TplLang): Tr => (id, en) => (lang === "en" ? en : id);

export interface TemplatePageDef {
  key: string;
  /** Slug per language (index.html for the home page, <slug>.html for the rest). */
  slug: Record<TplLang, string>;
  name: Record<TplLang, string>;
  home?: boolean;
}

export interface TemplateContent {
  brand: string;
  pages: TemplatePageDef[];
  /** Builds one page. `href(key)` = the address of another page in the exported HTML website. */
  build: (key: string, tr: Tr, href: (key: string) => string) => PageDoc;
  /** false = skip the general responsive polish (templates/polish.ts), e.g. v7 dashboards whose layout is already custom. */
  polish?: boolean;
}
