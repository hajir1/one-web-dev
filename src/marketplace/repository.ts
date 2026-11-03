import { api } from "../api/client";
import { setServerPromo } from "./promo";
import type { LibraryId } from "../pages/pageMaker/engine/helpers/libraries";
import { loadServerCatalog } from "./serverCatalog";
import type { ElementCatalogItem, ItemId, SectionCatalogItem, TemplateCatalogItem } from "./types";
import { isDemoMode } from "../demo/demoMode";

/* ================================================================== */
/* Repository katalog                                                   */
/*                                                                    */
/* Komponen TIDAK membaca data katalog langsung; mereka memakai hook     */
/* (./hooks.ts) yang memanggil repository ini.                          */
/* - Template: metadata dari GET /templates (isi template TIDAK ikut;    */
/*   diambil lewat POST /templates/:id/acquire saat dipakai).            */
/* - Section & elemen: kode editor ada di frontend, tier & harga dari    */
/*   GET /catalog (diatur admin).                                       */
/* ================================================================== */

export interface CatalogSnapshot {
  templates: TemplateCatalogItem[];
  sections: SectionCatalogItem[];
  elements: ElementCatalogItem[];
  /** Bahasa saat nama/deskripsi dirakit. */
  lang: string;
}

interface CatalogRepository {
  /** Ambil katalog lengkap. Boleh melempar (jaringan/server) — hook menampilkan status error. */
  getCatalog(lang: string): Promise<CatalogSnapshot>;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const strs = (v: unknown, re?: RegExp): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && (!re || re.test(x))) : []);
const ITEM_RE = /^(preset|element|event|feature):[\w-]{1,80}$/;

/** Validasi satu template dari server; null bila bentuknya tidak dikenal. */
export function sanitizeTemplate(raw: unknown): TemplateCatalogItem | null {
  if (!isObj(raw)) return null;
  const refId = str(raw.refId);
  if (!/^[\w-]{1,80}$/.test(refId)) return null;
  const tier = raw.tier === "premium" ? "premium" : "free";
  const price = typeof raw.price === "number" && raw.price >= 0 ? raw.price : 0;
  const demoUrl = str(raw.demoUrl);
  return {
    id: `template:${refId}`,
    kind: "template",
    refId,
    name: str(raw.name, refId),
    description: str(raw.description),
    category: str(raw.category, "company"),
    tier,
    price: tier === "free" ? 0 : price,
    ...(typeof raw.promoPrice === "number" ? { promoPrice: raw.promoPrice } : {}),
    isNew: raw.isNew === true,
    accent: /^#[0-9a-f]{3,8}$/i.test(str(raw.accent)) ? str(raw.accent) : "#2563eb",
    tags: strs(raw.tags),
    pages: (Array.isArray(raw.pages) ? raw.pages : [])
      .filter(isObj)
      .map((p) => ({ key: str(p.key), name: str(p.name, str(p.key)), slug: str(p.slug, str(p.key)), home: p.home === true }))
      .filter((p) => p.key),
    sectionIds: strs(raw.sectionIds, ITEM_RE) as ItemId[],
    elementIds: strs(raw.elementIds, ITEM_RE) as ItemId[],
    premiumItemIds: strs(raw.premiumItemIds, ITEM_RE) as ItemId[],
    sectionCount: typeof raw.sectionCount === "number" ? raw.sectionCount : 0,
    libraries: strs(raw.libraries) as LibraryId[],
    fonts: strs(raw.fonts),
    ...(/^https?:\/\//.test(demoUrl) ? { demoUrl } : {}),
    thumbnailUrl: typeof raw.thumbnailUrl === "string" && /^https?:\/\//.test(raw.thumbnailUrl) ? raw.thumbnailUrl : null,
    ...(typeof raw.version === "number" ? { version: raw.version } : {}),
    ...codeOf(raw.code),
  };
}

const CODE_GROUPS = new Set(["animation", "invitation", "web3d", "portfolio3d", "motion3d", "landing", "biz3d"]);
/** v14: Template Kode dari server → { code: { group, budgetKb, libs } }. */
function codeOf(v: unknown): { code?: NonNullable<TemplateCatalogItem["code"]> } {
  if (!isObj(v) || !CODE_GROUPS.has(str(v.group))) return {};
  return { code: { group: str(v.group), budgetKb: typeof v.budgetKb === "number" && v.budgetKb >= 0 ? v.budgetKb : 0, libs: strs(v.libs).slice(0, 20) } };
}

/** Repository server: template dari backend, section/elemen dari kode editor + harga server. */
export class ApiCatalogRepository implements CatalogRepository {
  private cache = new Map<string, CatalogSnapshot>();

  async getCatalog(lang: string): Promise<CatalogSnapshot> {
    const hit = this.cache.get(lang);
    if (hit) return hit;
    if (isDemoMode()) {
      // Mode demo (v12): template dari frontend; section & elemen dari kode editor (semua gratis di demo).
      const [demo, data] = await Promise.all([import("../demo/demoTemplates"), import("./data/catalog")]);
      const snap: CatalogSnapshot = { templates: demo.demoTemplateList(lang), sections: data.buildSectionCatalog(), elements: data.buildElementCatalog(), lang };
      this.cache.set(lang, snap);
      return snap;
    }
    const [list, data] = await Promise.all([
      api<{ templates?: unknown[]; promo?: unknown }>(`/templates?lang=${lang === "en" ? "en" : "id"}`),
      import("./data/catalog"),
      loadServerCatalog(),
    ]);
    if ("promo" in list) setServerPromo(list.promo);
    const templates = (list.templates ?? []).map(sanitizeTemplate).filter((t): t is TemplateCatalogItem => !!t);
    const snap: CatalogSnapshot = { templates, sections: data.buildSectionCatalog(), elements: data.buildElementCatalog(), lang };
    this.cache.set(lang, snap);
    return snap;
  }

  /** Lupakan cache (mis. setelah admin mengubah katalog). */
  clear() {
    this.cache.clear();
  }
}

export const catalogRepository = new ApiCatalogRepository();
