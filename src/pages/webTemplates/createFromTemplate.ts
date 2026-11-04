import { useDesignStore, type SavedDesign } from "../pageMaker/core/store/designStore";
import { PAGE_DESIGN_TYPE, SITE_TYPE, normalizeSiteDoc, type SiteDoc } from "../pageMaker/helpers/site";
import type { BuiltTemplatePage, TemplateRef } from "./templateContent";

/* ================================================================== */
/* "Edit in Page Maker": copies the template into a NEW website folder  */
/* owned by the user (page designs + folder). Template content comes from */
/* the server (acquire); the original template is never changed. Quotas (designs & */
/* folders) are checked by the CALLER before this, and enforced by the server on */
/* designs are synced.                                                   */
/* ================================================================== */

/** The user's website folders created from this template (newest first). */
export function sitesFromTemplate(templateId: string, sites: SavedDesign[] = useDesignStore.getState().designs[SITE_TYPE] ?? []): SavedDesign[] {
  return sites.filter((s) => normalizeSiteDoc(s.state).source?.templateId === templateId).sort((a, b) => b.updatedAt - a.updatedAt);
}

/** A folder's home design (to open in Page Maker). */
export function homeDesignOf(site: SavedDesign): string | null {
  const doc = normalizeSiteDoc(site.state);
  const designs = useDesignStore.getState().designs[PAGE_DESIGN_TYPE] ?? [];
  const alive = doc.pages.filter((p) => designs.some((d) => d.id === p.designId));
  return alive.find((p) => p.designId === doc.homepageId)?.designId ?? alive[0]?.designId ?? null;
}

/** Nama folder unik: "Nama", "Nama (2)", … */
export function uniqueSiteName(base: string, sites: SavedDesign[] = useDesignStore.getState().designs[SITE_TYPE] ?? []): string {
  const taken = new Set(sites.map((s) => s.name));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base} (${i})`)) return `${base} (${i})`;
}

export interface CreatedSite {
  siteId: string;
  homeDesignId: string;
  designIds: string[];
}

/** Saves the page designs + website folder from a template. Returns the new ID. */
export function createSiteFromTemplate(t: TemplateRef, pages: BuiltTemplatePage[], siteName: string): CreatedSite {
  const { saveDesign } = useDesignStore.getState();
  const name = uniqueSiteName(siteName);
  const designIds = pages.map((p) => saveDesign(PAGE_DESIGN_TYPE, `${p.name} · ${name}`, p.doc));
  const homeIdx = Math.max(0, pages.findIndex((p) => p.home));
  const doc: SiteDoc = {
    version: 1,
    pages: pages.map((p, i) => ({ designId: designIds[i], slug: p.slug, label: p.name })),
    homepageId: designIds[homeIdx],
    source: { templateId: t.id, version: t.version },
  };
  const siteId = saveDesign(SITE_TYPE, name, normalizeSiteDoc(doc));
  return { siteId, homeDesignId: designIds[homeIdx], designIds };
}
