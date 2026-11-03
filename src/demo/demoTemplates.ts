import i18n from "../i18n";
import { TEMPLATE_CATALOG, latestFirst, type TemplateMeta } from "../config/templates";
import { buildTemplatePages } from "../pages/webTemplates/buildPages";
import { templateSiteFromPages, type BuiltTemplatePage, type TemplateRef } from "../pages/webTemplates/templateContent";
import { buildSite } from "../pages/pageMaker/helpers/siteExport";
import type { IconLookup } from "../pages/pageMaker/core/helpers/elementDefinition";
import { queryTemplates } from "../marketplace/catalogQuery";
import type { TemplateCatalogItem } from "../marketplace/types";
import type { TemplatesPage, TemplatesPageParams } from "../api/queries";
import type { TemplateContent, TemplatePageDef, TplLang } from "../pages/webTemplates/types";
import { DEMO_TEMPLATE_IDS } from "./demoTemplateIds";
import { DEMO_LOADERS, DEMO_PAGES } from "./demoContent.generated";
import { CODE_TEMPLATE_CATALOG, codeTemplateMeta, loadCodeTemplate, withThumbFlag } from "../pages/webTemplates/codeTemplates/catalog";

/* ================================================================== */
/* Katalog template MODE DEMO (v12) — sepenuhnya di frontend.          */
/*                                                                    */
/* Menggantikan GET /templates, GET /templates/:id, dan POST             */
/* /templates/:id/acquire saat backend tidak ada. Modul ini dimuat       */
/* terpisah (dynamic import) sehingga isi template hanya diunduh di mode */
/* demo. Daftar halaman & pemuat isi ada di demoContent.generated (v13: */
/* semua template; dibuat src/tools/genDemoTemplates.ts). Isi template */
/* dimuat per berkas sumber saat dibuka, bukan sekaligus. Build produksi*/
/* memakai modul kosong (vite.config.ts). Semua template di sini gratis.*/
/* Pratinjau & thumbnail dirender di browser (bukan HTML dari server).   */
/* ================================================================== */

type DemoTemplate = TemplateMeta & { pages: TemplatePageDef[] };

const ID_SET = new Set(DEMO_TEMPLATE_IDS);
/** v16: Template Kode punya satu halaman (index.html). */
const CODE_PAGES: TemplatePageDef[] = [{ key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true }];
const TEMPLATES: DemoTemplate[] = latestFirst([
  // Unggahan terakhir (label "Terbaru") paling atas; lalu Template Kode, lalu template lain.
  ...CODE_TEMPLATE_CATALOG.map((m) => ({ ...m, pages: CODE_PAGES })),
  ...TEMPLATE_CATALOG.filter((m) => ID_SET.has(m.id) && DEMO_PAGES[m.id] && DEMO_LOADERS[m.id]).map((m) => ({ ...m, pages: DEMO_PAGES[m.id] })),
]);
const BY_ID = new Map(TEMPLATES.map((t) => [t.id, t]));

const contentCache = new Map<string, Promise<TemplateContent>>();
/** Muat isi satu template (chunk berkas sumbernya diunduh sekali, lalu di-cache). */
function loadContent(id: string): Promise<TemplateContent> {
  let p = contentCache.get(id);
  if (!p) {
    p = DEMO_LOADERS[id]();
    contentCache.set(id, p);
    p.catch(() => contentCache.delete(id));
  }
  return p;
}

const langOf = (lng?: string): TplLang => (lng?.startsWith("en") ? "en" : "id");

/** Metadata kartu katalog (ringan: tanpa membangun halaman template). */
function toItem(t: DemoTemplate, lang: TplLang): TemplateCatalogItem {
  const tr = i18n.getFixedT(lang);
  return {
    id: `template:${t.id}`,
    kind: "template",
    refId: t.id,
    name: tr(`templates.items.${t.id}.name`, { defaultValue: t.id }),
    description: tr(`templates.items.${t.id}.description`, { defaultValue: "" }),
    category: t.category,
    tier: "free",
    price: 0,
    isNew: !!t.isNew,
    accent: t.accent,
    tags: t.tags,
    pages: t.pages.map((p) => ({ key: p.key, name: p.name[lang], slug: p.slug[lang], home: !!p.home })),
    sectionIds: [],
    elementIds: [],
    premiumItemIds: [],
    sectionCount: 0,
    libraries: [],
    fonts: [],
    thumbnailUrl: null,
    version: t.version,
    ...(codeTemplateMeta(t.id) ? { code: codeTemplateMeta(t.id)!.code } : {}),
  };
}

const listCache = new Map<TplLang, TemplateCatalogItem[]>();
/** Semua template demo (urutan katalog) dalam bahasa `lang`. */
export function demoTemplateList(lang?: string): TemplateCatalogItem[] {
  const l = langOf(lang);
  let list = listCache.get(l);
  if (!list) {
    list = TEMPLATES.map((t) => toItem(t, l));
    listCache.set(l, list);
  }
  return list;
}

/** Pengganti GET /templates?page&limit&tier&category&q&sort. */
export function demoTemplatesPage(p: TemplatesPageParams & { limit: number }): TemplatesPage {
  const lang = langOf(p.lang);
  const all = demoTemplateList(lang);
  const cat = (c: string) => i18n.getFixedT(lang)(`templates.categories.${c}`, { defaultValue: c });
  const base = { text: p.q, category: p.category, sort: p.sort };
  const matched = queryTemplates(all, { ...base, tier: "all" }, cat);
  const filtered = p.tier === "premium" ? [] : matched;
  const limit = Math.max(1, p.limit);
  const pages = Math.max(1, Math.ceil(filtered.length / limit));
  const page = Math.min(Math.max(1, p.page), pages);
  return {
    templates: filtered.slice((page - 1) * limit, page * limit),
    page,
    pages,
    limit,
    total: filtered.length,
    totalAll: all.length,
    facets: { all: matched.length, free: matched.length, premium: 0 },
  };
}

/** Pengganti GET /templates/:id. null = bukan template demo. */
export function demoTemplateDetail(lang: string, id: string): TemplateCatalogItem | null {
  return demoTemplateList(lang).find((t) => t.refId === id) ?? null;
}

/** Pengganti POST /templates/:id/acquire: isi halaman dibangun di browser (salinan baru tiap panggilan). */
export async function demoAcquire(ref: TemplateRef, lang: TplLang): Promise<BuiltTemplatePage[]> {
  const t = BY_ID.get(ref.id);
  if (!t) throw new Error("TEMPLATE_NOT_FOUND");
  // Template Kode bukan pohon Desain Halaman (tombol Edit tidak ditampilkan untuknya).
  if (codeTemplateMeta(t.id)) throw new Error("CODE_TEMPLATE");
  return buildTemplatePages({ ...t, content: await loadContent(t.id) }, lang);
}

/* ------------------------------------------------------------------ */
/* Pratinjau di browser                                                  */
/* ------------------------------------------------------------------ */

/** Pesan dari iframe pratinjau saat tautan antarhalaman diklik. */
export const DEMO_NAV_MESSAGE = "owd-demo-nav";

/**
 * Skrip kecil di dalam pratinjau: tautan ke halaman lain template
 * (mis. "tentang.html") tidak dibuka di iframe, tetapi dikirim ke
 * halaman induk supaya pemilih halaman ikut berganti.
 */
const NAV_SCRIPT = `<script>document.addEventListener("click",function(e){var a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(!a)return;var h=a.getAttribute("href")||"";var m=/^([\\w.-]+\\.html)(#.*)?$/.exec(h);if(m){e.preventDefault();parent.postMessage({type:"${DEMO_NAV_MESSAGE}",file:m[1]},"*");}else if(h.charAt(0)!=="#"){e.preventDefault();}},true);</script>`;

const escapeStyle = (css: string) => css.replace(/<\/style/gi, "<\\/style");
const escapeScript = (js: string) => js.replace(/<\/script/gi, "<\\/script");

/** Satu berkas HTML mandiri: CSS & JS lokal disisipkan langsung (untuk iframe srcdoc). */
function inlineAssets(html: string, files: Map<string, string>): string {
  return html
    .replace(/<link rel="stylesheet" href="(assets\/[^"]+\.css)"\s*\/?>/g, (m, href: string) => {
      const css = files.get(href);
      return css === undefined ? m : `<style>${escapeStyle(css)}</style>`;
    })
    .replace(/<script src="(assets\/[^"]+\.js)"(?:\s+defer)?><\/script>/g, (m, src: string) => {
      const js = files.get(src);
      return js === undefined ? m : `<script>${escapeScript(js)}</script>`;
    })
    .replace(/<\/body>/i, `${NAV_SCRIPT}</body>`);
}

export interface DemoPreview {
  /** HTML mandiri per halaman, kunci = key halaman template. */
  html: Record<string, string>;
  /** Nama berkas → key halaman (untuk navigasi di dalam pratinjau). */
  fileToKey: Record<string, string>;
}

const previewCache = new Map<string, DemoPreview>();

/**
 * Render template di browser untuk pratinjau. `homeOnly` = hanya beranda
 * (thumbnail kartu; lebih ringan). Hasil di-cache selama tab terbuka.
 */
export async function demoPreview(id: string, lang: string, icons: IconLookup, homeOnly = false): Promise<DemoPreview | null> {
  const t = BY_ID.get(id);
  if (!t) return null;
  const l = langOf(lang);
  const key = `${id}:${l}:${homeOnly ? "home" : "all"}`;
  if (codeTemplateMeta(id)) {
    const cached = previewCache.get(key);
    if (cached) return cached;
    // v16: Template Kode dirender apa adanya (thumbnail: satu frame lalu berhenti).
    const raw = await loadCodeTemplate(id);
    const out = { html: { home: homeOnly ? withThumbFlag(raw) : raw }, fileToKey: { "index.html": "home" } };
    previewCache.set(key, out);
    return out;
  }
  const hit = previewCache.get(key) ?? (homeOnly ? previewCache.get(`${id}:${l}:all`) : undefined);
  if (hit) return hit;
  const content = await loadContent(id);
  const all = buildTemplatePages({ ...t, content }, l);
  const pages = homeOnly ? all.filter((p) => p.home).slice(0, 1) : all;
  const { site, designs } = templateSiteFromPages({ id: t.id, version: t.version }, pages.length ? pages : all.slice(0, 1), content.brand);
  const built = buildSite(site, designs, { icons, allowPremiumElements: true, allowPremiumEvents: true });
  const files = new Map(built.files("html").map((f) => [f.name, f.content]));
  const html: Record<string, string> = {};
  const fileToKey: Record<string, string> = {};
  for (const p of all) {
    const file = p.home ? "index.html" : `${p.slug}.html`;
    fileToKey[file] = p.key;
    const raw = files.get(file);
    if (raw !== undefined) html[p.key] = inlineAssets(raw.replace(/<html lang="[^"]*">/, `<html lang="${l}">`), files);
  }
  const out = { html, fileToKey };
  previewCache.set(key, out);
  return out;
}
