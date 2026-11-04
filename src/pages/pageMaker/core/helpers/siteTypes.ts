/* ================================================================== */
/* Website context types for elements (used by the Menu Element)       */
/* Split from helpers/site.ts so `core` does not depend upward.        */
/* ================================================================== */

export interface SitePageInfo {
  designId: string;
  /** Menu text: a custom label, or the current design name. */
  label: string;
  /** A valid & unique URL slug within the website (e.g. "tentang-kami"). */
  slug: string;
  isHome: boolean;
  /** v20: false = not shown in the automatic menu (e.g. a thank-you page). */
  inMenu?: boolean;
}

export interface SiteInfo {
  id: string;
  name: string;
  pages: SitePageInfo[];
}

export interface SiteContext {
  sites: SiteInfo[];
  /** The design being rendered (to mark the active menu item & pick the folder automatically). */
  currentDesignId?: string | null;
  /**
   * "none" = a plain <a href="slug.html"> link (editor / single-page export).
   * "site" = website export: links use the framework router (Link, RouterLink, routerLink, #/).
   */
  routing: "none" | "site";
}

/** Extra context when rendering an element spec. */
export interface SpecContext {
  site?: SiteContext;
}

/** Page link path per target. */
export function pageHref(p: Pick<SitePageInfo, "slug" | "isHome">, target: "html" | "router" | "hash"): string {
  if (target === "html") return p.isHome ? "index.html" : `${p.slug}.html`;
  if (target === "hash") return p.isHome ? "#/" : `#/${p.slug}`;
  return p.isHome ? "/" : `/${p.slug}`;
}
