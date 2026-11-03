import { api } from "../../api/client";
import type { SavedDesign } from "../pageMaker/core/store/designStore";
import type { PageDoc } from "../pageMaker/helpers/pageDoc";
import type { SiteDoc } from "../pageMaker/helpers/site";
import type { TplLang } from "./types";
import { isDemoMode } from "../../demo/demoMode";

/* ================================================================== */
/* Isi template dari SERVER                                             */
/*                                                                    */
/* Metadata template publik (GET /templates), tetapi isinya (pohon        */
/* halaman Page Maker) hanya dikirim lewat POST /templates/:id/acquire:   */
/* template gratis, atau Premium yang sudah dibeli (402 bila belum).     */
/* Isi di-cache di memori selama tab terbuka (tidak disimpan ke disk).    */
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

/** Validasi halaman dari server; halaman tanpa pohon dokumen dibuang. */
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
 * Ambil isi template (setiap pemanggilan mengembalikan salinan baru).
 * Melempar ApiError 402 TEMPLATE_LOCKED bila Premium belum dimiliki.
 */
export async function acquireTemplate(ref: TemplateRef, lang: TplLang): Promise<BuiltTemplatePage[]> {
  const key = `${ref.id}:${ref.version}:${lang}`;
  let p = cache.get(key);
  if (!p && isDemoMode()) {
    // Mode demo (v12): isi dibangun di browser dari template bawaan frontend.
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
 * v21.2: HTML Template Kode dari backend v14 (gratis, atau Premium yang sudah dibeli;
 * ApiError 402 TEMPLATE_LOCKED bila belum). Dipasang sebagai sumber loadCodeTemplate().
 */
export async function acquireCodeTemplateHtml(id: string): Promise<string> {
  const r = await api<{ html?: unknown }>(`/templates/${encodeURIComponent(id)}/acquire`, { method: "POST", body: { lang: "id" } });
  if (typeof r.html !== "string" || !/^\s*<!doctype html/i.test(r.html)) throw new Error("TEMPLATE_CONTENT_MISSING");
  return r.html;
}

/** Lupakan cache (mis. setelah keluar akun). */
export const clearTemplateCache = () => cache.clear();

/** Folder website + desain sementara (TIDAK disimpan) untuk ekspor zip. */
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

/** URL berkas demo statis (HTML hasil render server) untuk satu halaman. */
export function demoPageUrl(demoUrl: string | undefined, page?: { slug?: string; home?: boolean }): string | null {
  if (!demoUrl) return null;
  const base = demoUrl.replace(/index\.html$/, "");
  return !page || page.home ? `${base}index.html` : `${base}${encodeURIComponent(page.slug ?? "")}.html`;
}
