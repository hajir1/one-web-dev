import { api } from "../../api/client";
import type { SavedDesign } from "../pageMaker/core/store/designStore";
import type { PageDoc } from "../pageMaker/helpers/pageDoc";
import type { SiteDoc } from "../pageMaker/helpers/site";
import type { TplLang } from "./types";
import { isDemoMode } from "../../demo/demoMode";

/* ================================================================== */
/* Template content from the SERVER                                     */
/*                                                                    */
/* Public template metadata (GET /templates), but its content (tree       */
/* Page Maker pages) is only sent through POST /templates/:id/acquire:  */
/* free templates, or Premium ones already purchased (402 if not).      */
/* Content is cached in memory while the tab is open (not stored on disk). */
/* ================================================================== */

export interface TemplateRef {
  id: string;
  version: number;
}

export interface BuiltTemplatePage {
  key: string;
  slug: string;
  name: string;
  home: boolean;
  doc: PageDoc;
}

const cache = new Map<string, Promise<BuiltTemplatePage[]>>();

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Validates pages from the server; pages without a document tree are dropped. */
export function sanitizePages(raw: unknown, ref: TemplateRef): BuiltTemplatePage[] {
  if (!Array.isArray(raw)) return [];
  const out: BuiltTemplatePage[] = [];
  for (const p of raw) {
    if (!isObj(p) || typeof p.key !== "string" || !isObj(p.doc) || !isObj((p.doc as { root?: unknown }).root)) continue;
    const doc = { ...(p.doc as unknown as PageDoc), source: { templateId: ref.id, version: ref.version } };
    out.push({
      key: p.key,
      slug: typeof p.slug === "string" && p.slug ? p.slug : p.key,
      name: typeof p.name === "string" ? p.name : p.key,
      home: p.home === true,
      doc,
    });
  }
  if (out.length && !out.some((p) => p.home)) out[0].home = true;
  return out;
}

/**
 * Fetches template content (every call returns a new copy).
 * Throws ApiError 402 TEMPLATE_LOCKED when the Premium template is not owned yet.
 */
export async function acquireTemplate(ref: TemplateRef, lang: TplLang): Promise<BuiltTemplatePage[]> {
  const key = `${ref.id}:${ref.version}:${lang}`;
  let p = cache.get(key);
  if (!p && isDemoMode()) {
    // Demo mode (v12): content is built in the browser from the frontend's built-in templates.
    p = import("../../demo/demoTemplates").then((m) => m.demoAcquire(ref, lang));
    cache.set(key, p);
    p.catch(() => cache.delete(key));
  }
  if (!p) {
    p = api<{ pages?: unknown }>(`/templates/${encodeURIComponent(ref.id)}/acquire`, { method: "POST", body: { lang } }).then((r) => sanitizePages(r.pages, ref));
    cache.set(key, p);
    p.catch(() => cache.delete(key));
  }
  return structuredClone(await p);
}

/**
 * v21.2: Code Template HTML from backend v14 (free, or Premium already purchased;
 * ApiError 402 TEMPLATE_LOCKED if not). Installed as the loadCodeTemplate() source.
 */
export async function acquireCodeTemplateHtml(id: string): Promise<string> {
  const r = await api<{ html?: unknown }>(`/templates/${encodeURIComponent(id)}/acquire`, { method: "POST", body: { lang: "id" } });
  if (typeof r.html !== "string" || !/^\s*<!doctype html/i.test(r.html)) throw new Error("TEMPLATE_CONTENT_MISSING");
  return r.html;
}

/** Forget the cache (e.g. after signing out). */
export const clearTemplateCache = () => cache.clear();

/** A temporary website folder + designs (NOT saved) for the zip export. */
export function templateSiteFromPages(t: TemplateRef, pages: BuiltTemplatePage[], siteName: string): { site: SavedDesign; designs: SavedDesign[]; pages: BuiltTemplatePage[] } {
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

/** Static demo file URL (HTML rendered by the server) for one page. */
export function demoPageUrl(demoUrl: string | undefined, page?: { slug?: string; home?: boolean }): string | null {
  if (!demoUrl) return null;
  const base = demoUrl.replace(/index\.html$/, "");
  return !page || page.home ? `${base}index.html` : `${base}${encodeURIComponent(page.slug ?? "")}.html`;
}
