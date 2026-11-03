import type { PageDoc } from "../pageMaker/helpers/pageDoc";

export type TplLang = "id" | "en";

/** Pilih teks sesuai bahasa konten template. */
export type Tr = (id: string, en: string) => string;
export const makeTr = (lang: TplLang): Tr => (id, en) => (lang === "en" ? en : id);

export interface TemplatePageDef {
  key: string;
  /** Slug per bahasa (index.html untuk homepage, <slug>.html untuk lainnya). */
  slug: Record<TplLang, string>;
  name: Record<TplLang, string>;
  home?: boolean;
}

export interface TemplateContent {
  brand: string;
  pages: TemplatePageDef[];
  /** Bangun satu halaman. `href(key)` = alamat halaman lain di website hasil ekspor HTML. */
  build: (key: string, tr: Tr, href: (key: string) => string) => PageDoc;
  /** false = lewati polesan responsif umum (templates/polish.ts), mis. dashboard v7 yang tata letaknya sudah khusus. */
  polish?: boolean;
}
