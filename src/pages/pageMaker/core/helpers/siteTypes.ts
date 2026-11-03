/* ================================================================== */
/* Tipe konteks website untuk elemen (dipakai Menu Element)            */
/* Dipisah dari helpers/site.ts supaya `core` tidak bergantung ke atas. */
/* ================================================================== */

export interface SitePageInfo {
  designId: string;
  /** Teks menu: label khusus, atau nama desain terkini. */
  label: string;
  /** Slug URL yang valid & unik di website (mis. "tentang-kami"). */
  slug: string;
  isHome: boolean;
  /** v20: false = tidak tampil di menu otomatis (mis. halaman terima kasih). */
  inMenu?: boolean;
}

export interface SiteInfo {
  id: string;
  name: string;
  pages: SitePageInfo[];
}

export interface SiteContext {
  sites: SiteInfo[];
  /** Desain yang sedang dirender (untuk menandai menu aktif & memilih folder otomatis). */
  currentDesignId?: string | null;
  /**
   * "none" = link <a href="slug.html"> biasa (editor / ekspor satu halaman).
   * "site" = ekspor website: link memakai router framework (Link, RouterLink, routerLink, #/).
   */
  routing: "none" | "site";
}

/** Konteks tambahan saat merender spec elemen. */
export interface SpecContext {
  site?: SiteContext;
}

/** Path tautan halaman per target. */
export function pageHref(p: Pick<SitePageInfo, "slug" | "isHome">, target: "html" | "router" | "hash"): string {
  if (target === "html") return p.isHome ? "index.html" : `${p.slug}.html`;
  if (target === "hash") return p.isHome ? "#/" : `#/${p.slug}`;
  return p.isHome ? "/" : `/${p.slug}`;
}
