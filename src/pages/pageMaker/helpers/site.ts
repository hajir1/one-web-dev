import type { SavedDesign } from "../core/store/designStore";
import type { SiteInfo } from "../core/helpers/siteTypes";
import i18n from "../../../i18n";
import { normalizePageSeo, normalizeSiteSeo, type PageSeo, type SiteSeo } from "./seo";

/* ================================================================== */
/* Folder Website                                                       */
/*                                                                    */
/*   Design/Page = satu desain Page Maker = satu halaman (tipe "page"). */
/*   Folder/Website = daftar REFERENSI ke desain (tipe "site"):         */
/*     { pages: [{ designId, slug, label? }], homepageId }              */
/*   Folder tidak menyalin desain → tidak ada duplikasi; nama desain    */
/*   yang diubah otomatis terbawa ke menu. Menghapus halaman dari        */
/*   folder TIDAK menghapus desainnya.                                  */
/* ================================================================== */

export const SITE_TYPE = "site";
export const PAGE_DESIGN_TYPE = "page";
const MAX_SITE_PAGES = 50;

interface SitePage {
  /** ID stabil desain sumber. */
  designId: string;
  /** Bagian URL: /slug, slug.html. Unik di satu website. */
  slug: string;
  /** Teks menu khusus; kosong = nama desain terkini. */
  label?: string;
  /** v10: SEO halaman (judul, deskripsi, gambar OG, noindex). */
  seo?: PageSeo;
  /** v20: true = tidak tampil di menu otomatis (halaman tetap ada & bisa dibuka lewat tautan). */
  hidden?: boolean;
}

export interface SiteDoc {
  version: 1;
  pages: SitePage[];
  homepageId: string | null;
  /** Asal folder bila dibuat dari Web Templates (untuk mencegah duplikasi tak sengaja). */
  source?: { templateId: string; version: number };
  /** v10: SEO situs (URL publik, deskripsi & gambar bawaan). */
  seo?: SiteSeo;
}

export const createSiteDoc = (): SiteDoc => ({ version: 1, pages: [], homepageId: null });

/* ------------------------------- slug ------------------------------- */

const RESERVED = new Set(["index", "assets", "src", "app", "pages", "node-modules"]);

export const isValidSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 60 && !RESERVED.has(s);

/** "Tentang Kami!" → "tentang-kami" (huruf latin tanpa aksen, angka, tanda hubung). */
export function slugify(name: string): string {
  const s = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
    .replace(/-+$/, "");
  return isValidSlug(s) ? s : s ? `halaman-${s}`.slice(0, 60) : "halaman";
}

export function uniqueSlug(base: string, taken: Set<string>): string {
  const b = isValidSlug(base) ? base : slugify(base);
  let s = b;
  for (let i = 2; taken.has(s); i++) s = `${b}-${i}`;
  return s;
}

/* --------------------------- normalisasi ---------------------------- */

/** Data tersimpan apa pun → SiteDoc valid (slug unik & valid, homepage ada di daftar). */
export function normalizeSiteDoc(raw: unknown): SiteDoc {
  const out = createSiteDoc();
  if (!raw || typeof raw !== "object") return out;
  const v = raw as Record<string, unknown>;
  const seen = new Set<string>();
  const slugs = new Set<string>();
  for (const p of Array.isArray(v.pages) ? v.pages.slice(0, MAX_SITE_PAGES) : []) {
    if (!p || typeof p !== "object") continue;
    const o = p as Record<string, unknown>;
    if (typeof o.designId !== "string" || !o.designId || seen.has(o.designId)) continue;
    seen.add(o.designId);
    const slug = uniqueSlug(typeof o.slug === "string" ? o.slug : "halaman", slugs);
    slugs.add(slug);
    const label = typeof o.label === "string" && o.label.trim() ? o.label.trim().slice(0, 60) : undefined;
    const seo = normalizePageSeo(o.seo);
    out.pages.push({ designId: o.designId, slug, ...(label ? { label } : {}), ...(seo ? { seo } : {}), ...(o.hidden === true ? { hidden: true } : {}) });
  }
  const home = typeof v.homepageId === "string" ? v.homepageId : null;
  out.homepageId = home && seen.has(home) ? home : (out.pages[0]?.designId ?? null);
  const src = v.source as Record<string, unknown> | undefined;
  if (src && typeof src === "object" && typeof src.templateId === "string" && /^[\w-]{1,60}$/.test(src.templateId) && typeof src.version === "number")
    out.source = { templateId: src.templateId, version: src.version };
  const seo = normalizeSiteSeo(v.seo);
  if (seo) out.seo = seo;
  return out;
}

/* ------------------------------ operasi ----------------------------- */

const taken = (doc: SiteDoc, except?: string) =>
  new Set(doc.pages.filter((p) => p.designId !== except).map((p) => p.slug));

export function addPage(doc: SiteDoc, d: SavedDesign): SiteDoc {
  if (doc.pages.some((p) => p.designId === d.id) || doc.pages.length >= MAX_SITE_PAGES) return doc;
  const pages = [...doc.pages, { designId: d.id, slug: uniqueSlug(slugify(d.name), taken(doc)) }];
  return { ...doc, pages, homepageId: doc.homepageId ?? d.id };
}

/** Keluarkan halaman dari folder (desain sumber tetap ada). */
export function removePage(doc: SiteDoc, designId: string): SiteDoc {
  const pages = doc.pages.filter((p) => p.designId !== designId);
  return { ...doc, pages, homepageId: doc.homepageId === designId ? (pages[0]?.designId ?? null) : doc.homepageId };
}

export function movePage(doc: SiteDoc, designId: string, to: number): SiteDoc {
  const from = doc.pages.findIndex((p) => p.designId === designId);
  if (from < 0) return doc;
  const t = Math.max(0, Math.min(to, doc.pages.length - 1));
  if (t === from) return doc;
  const pages = [...doc.pages];
  const [it] = pages.splice(from, 1);
  pages.splice(t, 0, it);
  return { ...doc, pages };
}

/** Ganti desain sebuah halaman (posisi, slug & homepage dipertahankan). */
export function replacePage(doc: SiteDoc, designId: string, d: SavedDesign): SiteDoc {
  if (designId === d.id || doc.pages.some((p) => p.designId === d.id)) return doc;
  return {
    ...doc,
    pages: doc.pages.map((p) => (p.designId === designId ? { ...p, designId: d.id, label: undefined } : p)),
    homepageId: doc.homepageId === designId ? d.id : doc.homepageId,
  };
}

export const setHomepage = (doc: SiteDoc, designId: string): SiteDoc =>
  doc.pages.some((p) => p.designId === designId) ? { ...doc, homepageId: designId } : doc;

/** Ubah slug. Error (bahasa aktif) bila tidak valid / sudah dipakai. */
export function setSlug(doc: SiteDoc, designId: string, slug: string): { doc: SiteDoc; error?: string; code?: "slugInvalid" | "slugTaken" } {
  const s = slug.trim().toLowerCase();
  if (!isValidSlug(s))
    return { doc, code: "slugInvalid", error: i18n.t("el.site.slugInvalid") };
  if (taken(doc, designId).has(s)) return { doc, code: "slugTaken", error: i18n.t("el.site.slugTaken") };
  return { doc: { ...doc, pages: doc.pages.map((p) => (p.designId === designId ? { ...p, slug: s } : p)) } };
}

export const setLabel = (doc: SiteDoc, designId: string, label: string): SiteDoc => ({
  ...doc,
  pages: doc.pages.map((p) =>
    p.designId === designId ? { designId: p.designId, slug: p.slug, ...(label.trim() ? { label: label.slice(0, 60) } : {}), ...(p.seo ? { seo: p.seo } : {}), ...(p.hidden ? { hidden: true } : {}) } : p,
  ),
});

/** v20: tampil/sembunyikan halaman dari menu otomatis. */
export function setHidden(doc: SiteDoc, designId: string, hidden: boolean): SiteDoc {
  return {
    ...doc,
    pages: doc.pages.map((p) => {
      if (p.designId !== designId) return p;
      const { hidden: _old, ...rest } = p;
      void _old;
      return hidden ? { ...rest, hidden: true } : rest;
    }),
  };
}

/** v20: sisipkan halaman baru tepat setelah `afterId` (null = di akhir). */
export function insertPageAfter(doc: SiteDoc, d: SavedDesign, afterId: string | null): SiteDoc {
  const added = addPage(doc, d);
  if (added === doc || !afterId) return added;
  const at = added.pages.findIndex((p) => p.designId === afterId);
  return at < 0 ? added : movePage(added, d.id, at + 1);
}

/** v10: ubah SEO situs (nilai dinormalkan; kosong = dihapus). */
export function setSiteSeo(doc: SiteDoc, patch: Partial<SiteSeo>): SiteDoc {
  const seo = normalizeSiteSeo({ ...doc.seo, ...patch });
  const { seo: _old, ...rest } = doc;
  void _old;
  return seo ? { ...rest, seo } : rest;
}

/** v10: ubah SEO satu halaman. */
export function setPageSeo(doc: SiteDoc, designId: string, patch: Partial<PageSeo>): SiteDoc {
  return {
    ...doc,
    pages: doc.pages.map((p) => {
      if (p.designId !== designId) return p;
      const seo = normalizePageSeo({ ...p.seo, ...patch });
      const { seo: _old, ...rest } = p;
      void _old;
      return seo ? { ...rest, seo } : rest;
    }),
  };
}

/* ------------------------- konteks untuk menu ----------------------- */

export interface ResolvedSitePage extends SitePage {
  design: SavedDesign | null;
  /** Label efektif (label khusus atau nama desain terkini). */
  title: string;
  isHome: boolean;
}

/** Halaman folder + desainnya (desain yang sudah dihapus ditandai `design: null`). */
export function resolvePages(doc: SiteDoc, designs: SavedDesign[]): ResolvedSitePage[] {
  return doc.pages.map((p) => {
    const design = designs.find((d) => d.id === p.designId) ?? null;
    return {
      ...p,
      design,
      title: p.label?.trim() || design?.name || i18n.t("el.site.deletedDesign"),
      isHome: p.designId === doc.homepageId,
    };
  });
}

/** Info website untuk Menu Element (hanya halaman yang desainnya masih ada). */
function siteInfo(site: SavedDesign, designs: SavedDesign[]): SiteInfo {
  const doc = normalizeSiteDoc(site.state);
  return {
    id: site.id,
    name: site.name,
    pages: resolvePages(doc, designs)
      .filter((p) => p.design)
      .map((p) => ({ designId: p.designId, label: p.title, slug: p.slug, isHome: p.isHome, ...(p.hidden ? { inMenu: false } : {}) })),
  };
}

export const allSiteInfos = (sites: SavedDesign[], designs: SavedDesign[]) => sites.map((s) => siteInfo(s, designs));
