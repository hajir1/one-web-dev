import type { Framework } from "../core/helpers/generatorCss";

/* ================================================================== */
/* SEO hasil ekspor website (v10)                                        */
/*                                                                    */
/*   Folder website menyimpan SEO situs (URL, deskripsi & gambar OG     */
/*   bawaan, boleh diindeks) dan SEO per halaman (judul, deskripsi,     */
/*   gambar OG, noindex). Saat ekspor:                                   */
/*     HTML/Blade      <meta> di <head> tiap halaman                    */
/*     React/Vue/      meta bawaan di index.html + src/seo.(js|ts) yang */
/*     Svelte/Angular  mengganti judul & meta setiap pindah rute         */
/*     semua format    robots.txt, sitemap.xml (bila URL situs diisi)    */
/* ================================================================== */

export interface SiteSeo {
  /** URL publik situs, mis. https://tokokue.id (tanpa garis miring akhir). */
  siteUrl?: string;
  /** Deskripsi bawaan untuk halaman tanpa deskripsi sendiri. */
  description?: string;
  /** Gambar bagikan bawaan (URL absolut http/https). */
  ogImage?: string;
  /** false = seluruh situs tidak boleh diindeks (mis. situs uji coba). */
  indexable?: boolean;
}

export interface PageSeo {
  /** Judul untuk mesin pencari; kosong = "<nama halaman> — <nama situs>". */
  title?: string;
  description?: string;
  ogImage?: string;
  /** Sembunyikan halaman ini dari mesin pencari. */
  noindex?: boolean;
}

/** SEO final satu halaman, siap ditulis ke berkas. */
export interface ResolvedSeo {
  title: string;
  description: string;
  ogImage: string;
  noindex: boolean;
  /** URL kanonik absolut; kosong bila URL situs belum diisi. */
  url: string;
  /** Path rute ("/", "/tentang") untuk SPA. */
  path: string;
}

export const SEO_LIMITS = { title: 70, description: 300, url: 300 } as const;
/** Panjang yang biasanya tampil utuh di hasil pencarian Google. */
export const SEO_IDEAL = { title: 60, descriptionMin: 50, description: 160 } as const;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/** URL http/https absolut yang valid, tanpa garis miring akhir; selain itu "". */
export function cleanUrl(v: unknown): string {
  const s = clean(v, SEO_LIMITS.url);
  if (!s) return "";
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" && u.protocol !== "http:") return "";
    if (u.username || u.password) return "";
    return u.href.replace(/\/+$/, "");
  } catch {
    return "";
  }
}

export function normalizeSiteSeo(raw: unknown): SiteSeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const v = raw as Record<string, unknown>;
  const out: SiteSeo = {};
  const siteUrl = cleanUrl(v.siteUrl);
  if (siteUrl) out.siteUrl = siteUrl;
  const description = clean(v.description, SEO_LIMITS.description);
  if (description) out.description = description;
  const ogImage = cleanUrl(v.ogImage);
  if (ogImage) out.ogImage = ogImage;
  if (v.indexable === false) out.indexable = false;
  return Object.keys(out).length ? out : undefined;
}

export function normalizePageSeo(raw: unknown): PageSeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const v = raw as Record<string, unknown>;
  const out: PageSeo = {};
  const title = clean(v.title, SEO_LIMITS.title);
  if (title) out.title = title;
  const description = clean(v.description, SEO_LIMITS.description);
  if (description) out.description = description;
  const ogImage = cleanUrl(v.ogImage);
  if (ogImage) out.ogImage = ogImage;
  if (v.noindex === true) out.noindex = true;
  return Object.keys(out).length ? out : undefined;
}

export interface SeoPageInput {
  title: string;
  slug: string;
  isHome: boolean;
  file: string;
  seo?: PageSeo;
}

/** Path publik halaman per format (HTML memakai berkas .html, Svelte memakai hash). */
export function pagePath(p: Pick<SeoPageInput, "isHome" | "slug" | "file">, fw: Framework): string {
  if (p.isHome) return "/";
  if (fw === "html") return `/${p.file}.html`;
  if (fw === "svelte") return `/#/${p.slug}`;
  return `/${p.slug}`;
}

export function resolveSeo(siteName: string, site: SiteSeo | undefined, p: SeoPageInput, fw: Framework): ResolvedSeo {
  const path = pagePath(p, fw);
  const base = site?.siteUrl ?? "";
  return {
    title: p.seo?.title || (p.title === siteName ? p.title : `${p.title} — ${siteName}`),
    description: p.seo?.description || site?.description || "",
    ogImage: p.seo?.ogImage || site?.ogImage || "",
    noindex: site?.indexable === false || !!p.seo?.noindex,
    url: base ? `${base}${path === "/" ? "/" : path}` : "",
    path: fw === "svelte" ? (p.isHome ? "/" : `/${p.slug}`) : path,
  };
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };
const plain = (html: string) =>
  html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e: string) => ENTITIES[e])
    .replace(/\s+/g, " ")
    .trim();

/** Potong di batas kata, maksimal `max` karakter (… bila dipotong). */
function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,.;:–—-]+$/, "")}…`;
}

/**
 * Deskripsi otomatis dari isi halaman (dipakai bila pengguna belum mengisi
 * deskripsi SEO): paragraf pertama yang cukup panjang; bila tidak ada,
 * gabungan judul + paragraf pertama. "" bila halaman tanpa teks.
 */
export function autoDescription(html: string, max: number = SEO_IDEAL.description): string {
  const paras = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => plain(m[1])).filter(Boolean);
  const long = paras.find((t) => t.length >= SEO_IDEAL.descriptionMin);
  if (long) return clip(long, max);
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  const joined = [h1 ? plain(h1[1]) : "", paras[0] ?? ""].filter(Boolean).join(". ");
  return joined ? clip(joined, max) : "";
}

const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Tag meta SEO + Open Graph + Twitter untuk <head> (tanpa <title>). */
export function seoMetaTags(r: ResolvedSeo, siteName: string, lang: "id" | "en" = "id"): string {
  const tags: string[] = [];
  if (r.description) tags.push(`<meta name="description" content="${attr(r.description)}" />`);
  tags.push(`<meta name="robots" content="${r.noindex ? "noindex, nofollow" : "index, follow"}" />`);
  if (r.url) tags.push(`<link rel="canonical" href="${attr(r.url)}" />`);
  tags.push(`<meta property="og:type" content="website" />`);
  tags.push(`<meta property="og:site_name" content="${attr(siteName)}" />`);
  tags.push(`<meta property="og:locale" content="${lang === "en" ? "en_US" : "id_ID"}" />`);
  tags.push(`<meta property="og:title" content="${attr(r.title)}" />`);
  if (r.description) tags.push(`<meta property="og:description" content="${attr(r.description)}" />`);
  if (r.url) tags.push(`<meta property="og:url" content="${attr(r.url)}" />`);
  if (r.ogImage) tags.push(`<meta property="og:image" content="${attr(r.ogImage)}" />`);
  tags.push(`<meta name="twitter:card" content="${r.ogImage ? "summary_large_image" : "summary"}" />`);
  return tags.join("\n");
}

/** JSON-LD WebSite untuk beranda (hanya bila URL situs diisi). */
export function websiteJsonLd(siteName: string, site: SiteSeo | undefined): string {
  if (!site?.siteUrl) return "";
  const data = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: `${site.siteUrl}/`, ...(site.description ? { description: site.description } : {}) };
  // "<" di-escape supaya teks tidak bisa menutup tag <script>.
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

export function robotsTxt(site: SiteSeo | undefined): string {
  const lines = ["User-agent: *", site?.indexable === false ? "Disallow: /" : "Allow: /"];
  if (site?.siteUrl && site.indexable !== false) lines.push("", `Sitemap: ${site.siteUrl}/sitemap.xml`);
  return lines.join("\n") + "\n";
}

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** sitemap.xml halaman yang boleh diindeks; "" bila URL situs kosong atau semua noindex. */
export function sitemapXml(pages: readonly ResolvedSeo[], lastmod?: string): string {
  const urls = pages.filter((p) => p.url && !p.noindex && !p.url.includes("#"));
  if (!urls.length) return "";
  const mod = lastmod ? `\n    <lastmod>${xml(lastmod)}</lastmod>` : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((p) => `  <url>\n    <loc>${xml(p.url)}</loc>${mod}\n  </url>`).join("\n")}
</urlset>
`;
}

/**
 * Modul SPA: ganti <title>, description, robots, canonical, dan og:* setiap
 * pindah rute. Mesin pencari modern menjalankan JavaScript, jadi meta ini
 * ikut terbaca; meta bawaan di index.html tetap jadi cadangan.
 */
export function seoRuntimeModule(pages: readonly ResolvedSeo[], ts: boolean): string {
  const data = Object.fromEntries(pages.map((p) => [p.path, { title: p.title, description: p.description, image: p.ogImage, noindex: p.noindex, url: p.url }]));
  const sig = ts ? "(path: string): void" : "(path)";
  const meta = ts ? "(attr: string, key: string, value: string): void" : "(attr, key, value)";
  const link = ts ? "(value: string): void" : "(value)";
  return `// Dibuat oleh OneWebDev: judul & meta SEO per halaman.
const PAGES${ts ? ": Record<string, { title: string; description: string; image: string; noindex: boolean; url: string }>" : ""} = ${JSON.stringify(data, null, 2)};

function setMeta${meta} {
  let el = document.head.querySelector(\`meta[\${attr}="\${key}"]\`);
  if (!value) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical${link} {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!value) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", value);
}

/** Pasang judul & meta untuk path rute ("/", "/tentang"). */
export function applySeo${sig} {
  const p = PAGES[path] || PAGES["/"];
  if (!p) return;
  document.title = p.title;
  setMeta("name", "description", p.description);
  setMeta("name", "robots", p.noindex ? "noindex, nofollow" : "index, follow");
  setMeta("property", "og:title", p.title);
  setMeta("property", "og:description", p.description);
  setMeta("property", "og:image", p.image);
  setMeta("property", "og:url", p.url);
  setCanonical(p.url);
}
`;
}

export type SeoIssue = { level: "warn" | "info"; code: string; page?: string };

/** Pemeriksaan SEO ringan untuk ditampilkan di panel Website. */
export function seoAudit(siteName: string, site: SiteSeo | undefined, pages: readonly SeoPageInput[]): SeoIssue[] {
  const out: SeoIssue[] = [];
  if (!site?.siteUrl) out.push({ level: "info", code: "noSiteUrl" });
  if (site?.indexable === false) out.push({ level: "warn", code: "siteNoindex" });
  if (!site?.ogImage && !pages.some((p) => p.seo?.ogImage)) out.push({ level: "info", code: "noOgImage" });
  const titles = new Map<string, number>();
  for (const p of pages) {
    const r = resolveSeo(siteName, site, p, "html");
    titles.set(r.title, (titles.get(r.title) ?? 0) + 1);
    if (!r.description) out.push({ level: "warn", code: "noDescription", page: p.title });
    else if (r.description.length < SEO_IDEAL.descriptionMin) out.push({ level: "info", code: "shortDescription", page: p.title });
    else if (r.description.length > SEO_IDEAL.description) out.push({ level: "info", code: "longDescription", page: p.title });
    if (r.title.length > SEO_IDEAL.title) out.push({ level: "info", code: "longTitle", page: p.title });
  }
  for (const p of pages) {
    const r = resolveSeo(siteName, site, p, "html");
    if ((titles.get(r.title) ?? 0) > 1) out.push({ level: "warn", code: "duplicateTitle", page: p.title });
  }
  return out;
}
