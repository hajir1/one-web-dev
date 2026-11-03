import type { SavedDesign } from "../core/store/designStore";
import { LIBRARY_IDS, libraryHead, libraryScripts } from "../engine/helpers/libraries";
import type { Framework } from "../core/helpers/generatorCss";
import type { GeneratedFile } from "../core/ui/CodeExportPanel";
import type { IconLookup } from "../core/helpers/elementDefinition";
import type { GlobalFont } from "../core/helpers/fontCss";
import type { SiteInfo } from "../core/helpers/siteTypes";
import { compose, toPascal, type Composed, type PremiumAllow } from "../engine/helpers/compose";
import { toKebab } from "../core/helpers/markup";
import { normalizePageDoc, type PageDoc } from "./pageDoc";
import { normalizeSiteDoc, resolvePages } from "./site";
import { collectionsIn, itemSlugify } from "./collections";
import { itemBoxIn, itemCollectionsUsed, syncItemPage } from "./itemPage";
import i18n from "../../../i18n";
import { IMG_FALLBACK_TAG } from "./imagePlaceholder";
import type { CssVar } from "../core/helpers/cssVars";
import { autoDescription, resolveSeo, robotsTxt, seoMetaTags, seoRuntimeModule, sitemapXml, websiteJsonLd, type PageSeo, type ResolvedSeo, type SiteSeo } from "./seo";
import {
  BASE_RESET,
  angularScaffold,
  bladeProject,
  htmlReadme,
  reactScaffold,
  rewritePageLinks,
  svelteScaffold,
  vueScaffold,
  type ProjectContext,
} from "./projectExport";

/* ================================================================== */
/* Pratinjau & ekspor WEBSITE (satu folder = satu proyek)               */
/*                                                                    */
/*   HTML    index.html (homepage) + <slug>.html, assets/<nama>.css/js  */
/*   Blade   resources/views/pages/<slug>.blade.php + routes/web.php     */
/*   React   src/pages/<slug>/…, src/App.jsx (react-router-dom)          */
/*   Vue     src/pages/<slug>/…, src/router.js (vue-router), App.vue     */
/*   Svelte  src/pages/<slug>/…, src/App.svelte (router hash bawaan)     */
/*   Angular src/app/pages/<slug>/…, app.routes.ts (@angular/router)     */
/* Tiap halaman di-compose terpisah (class `page-<slug>`), jadi gaya,    */
/* ID, Custom CSS/JS, dan komponen anak tiap halaman tidak bertabrakan.  */
/* v7: setiap format = proyek lengkap siap jalan (package.json, README). */
/* ================================================================== */

export interface SiteBuildOptions {
  icons: IconLookup;
  fonts?: GlobalFont[];
  baseFont?: string | null;
  allowPremiumEvents?: PremiumAllow;
  allowPremiumElements?: PremiumAllow;
  /**
   * Izin elemen premium PER HALAMAN (mis. item bawaan template hanya berlaku
   * di desain dari template itu). Bila ada, menggantikan `allowPremiumElements`.
   */
  allowPremiumElementsFor?: (doc: PageDoc) => PremiumAllow;
  /** Sama seperti `allowPremiumElementsFor`, untuk event Premium. */
  allowPremiumEventsFor?: (doc: PageDoc) => PremiumAllow;
  /** v7: variabel global (lihat cssVars.ts). */
  vars?: CssVar[];
}

export interface BuiltPage {
  designId: string;
  slug: string;
  title: string;
  isHome: boolean;
  /** Nama berkas HTML tanpa ekstensi ("index" untuk homepage). */
  file: string;
  rootClass: string;
  composed: Composed;
  /** v10: SEO halaman dari folder website. */
  seo?: PageSeo;
  /**
   * Uji coba halaman item: satu salinan halaman per item koleksi
   * (ekspor HTML: <dir>/<slug>.html). Kosong untuk halaman biasa.
   */
  items?: { dir: string; slug: string; title: string; composed: Composed }[];
}

export interface BuiltSite {
  info: SiteInfo;
  pages: BuiltPage[];
  home: BuiltPage | null;
  warnings: string[];
  files: (fw: Framework) => GeneratedFile[];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const indent = (s: string, n: number) =>
  s
    .split("\n")
    .map((l) => (l.trim() ? " ".repeat(n) + l : l))
    .join("\n");

export function buildSite(site: SavedDesign, designs: SavedDesign[], opts: SiteBuildOptions): BuiltSite {
  const doc = normalizeSiteDoc(site.state);
  const warnings: string[] = [];
  const resolved = resolvePages(doc, designs);
  for (const p of resolved) if (!p.design) warnings.push(i18n.t("el.site.pageDeletedSkipped", { slug: p.slug }));
  const available = resolved.filter((p) => p.design);
  const homeId = available.some((p) => p.designId === doc.homepageId) ? doc.homepageId : (available[0]?.designId ?? null);
  if (doc.homepageId && homeId !== doc.homepageId && available.length) warnings.push(i18n.t("el.site.homepageMissing"));
  if (!available.length) warnings.push(i18n.t("el.site.folderEmpty"));

  const info: SiteInfo = {
    id: site.id,
    name: site.name,
    pages: available.map((p) => ({ designId: p.designId, label: p.title, slug: p.slug, isHome: p.designId === homeId, ...(p.hidden ? { inMenu: false } : {}) })),
  };

  const docs = new Map(available.map((p) => [p.designId, normalizePageDoc(p.design!.state)]));
  /** Koleksi data di semua halaman (untuk halaman item). */
  const cols = [...docs.values()].flatMap((d) => collectionsIn(d.root).map((r) => r.col));
  const pages: BuiltPage[] = available.map((p) => {
    const isHome = p.designId === homeId;
    const rootClass = `page-${p.slug}`;
    const pageDoc = docs.get(p.designId)!;
    const composeRoot = (root: typeof pageDoc.root) =>
      compose(root, {
        rootClass,
        icons: opts.icons,
        fonts: opts.fonts,
        baseFont: opts.baseFont,
        vars: opts.vars,
        allowPremiumEvents: opts.allowPremiumEventsFor ? opts.allowPremiumEventsFor(pageDoc) : opts.allowPremiumEvents,
        allowPremiumElements: opts.allowPremiumElementsFor ? opts.allowPremiumElementsFor(pageDoc) : opts.allowPremiumElements,
        site: { sites: [info], currentDesignId: p.designId, routing: "site" },
      });
    // Halaman item: data koleksi terbaru dari halaman lain ikut dipakai.
    const root = itemCollectionsUsed(pageDoc.root).length ? syncItemPage(pageDoc.root, cols) : pageDoc.root;
    const composed = composeRoot(root);
    for (const w of composed.warnings) warnings.push(`${p.title}: ${w.message}`);
    const ib = itemBoxIn(root);
    const col = ib ? cols.find((c) => c.slug === ib.itemOf!.collection) : undefined;
    const items = col
      ? col.items.map((it) => ({ dir: col.slug, slug: it.slug ?? itemSlugify(it.values.name), title: String(it.values.name ?? ""), composed: composeRoot(syncItemPage(root, cols, it.id)) }))
      : undefined;
    return { designId: p.designId, slug: p.slug, title: p.title, isHome, file: isHome ? "index" : p.slug, rootClass, composed, ...(p.seo ? { seo: p.seo } : {}), ...(items?.length ? { items } : {}) };
  });
  const home = pages.find((p) => p.isHome) ?? null;
  // Homepage didahulukan di routing.
  const ordered = home ? [home, ...pages.filter((p) => p !== home)] : pages;

  return { info, pages, home, warnings, files: (fw: Framework) => projectFiles(fw, site.name, ordered, { seo: doc.seo ?? {} }) };
}

/** Nama dasar zip website, mis. "website-kopi-senja". */
export const siteZipName = (name: string) => `website-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "website";

/** Bungkus hasil compose satu desain menjadi "situs" satu halaman (ekspor proyek Desain Halaman). */
export function singlePage(composed: Composed, title: string): BuiltPage {
  return { designId: "", slug: "home", title, isHome: true, file: "index", rootClass: composed.rootClass, composed };
}

/** CSS global proyek: pemuat font (@import harus paling atas) + variabel :root + reset dasar. */
function projectGlobalCss(pages: readonly BuiltPage[]): string {
  const uniq = (xs: string[]) => [...new Set(xs.map((x) => x.trim()).filter(Boolean))];
  return [...uniq(pages.map((p) => p.composed.fontLoaders)), ...uniq(pages.map((p) => p.composed.varsCss)), BASE_RESET].join("\n\n") + "\n";
}

/**
 * Berkas proyek siap jalan (v7) untuk satu format. `ordered` = halaman dengan
 * beranda di depan. Tiap halaman di-compose terpisah; kerangka proyek
 * (package.json, router, README, CSS global) dari projectExport.ts.
 */
export function projectFiles(fw: Framework, siteName: string, ordered: readonly BuiltPage[], site?: { seo: SiteSeo }): GeneratedFile[] {
  // v10: SEO hanya untuk ekspor folder website (Desain Halaman tetap seperti sebelumnya).
  // Halaman tanpa deskripsi SEO → deskripsi otomatis dari paragraf pertamanya.
  const seo: ResolvedSeo[] | null = site
    ? ordered.map((p) => {
        const r = resolveSeo(siteName, site.seo, p, fw);
        return r.description ? r : { ...r, description: autoDescription(p.composed.html.body) };
      })
    : null;
  const lang = i18n.language?.startsWith("en") ? "en" : "id";
  const homeSeo = seo ? seo[ordered.findIndex((p) => p.isHome)] ?? seo[0] : undefined;
  const ctx: ProjectContext = {
    name: siteName,
    pages: ordered.map((p) => ({ title: p.title, slug: p.slug, isHome: p.isHome, file: p.file })),
    libs: LIBRARY_IDS.filter((id) => ordered.some((p) => p.composed.libraries.includes(id))),
    globalCss: projectGlobalCss(ordered),
    ...(homeSeo
      ? { headTitle: homeSeo.title, headExtra: [seoMetaTags(homeSeo, siteName, lang), websiteJsonLd(siteName, site!.seo)].filter(Boolean).join("\n") }
      : {}),
  };
  /** robots.txt + sitemap.xml di folder publik format ini. */
  const seoFiles = (dir: string): GeneratedFile[] => {
    if (!seo || !site) return [];
    // Tanpa <lastmod>: hasil ekspor tetap identik untuk desain yang sama (sidik jari ekspor).
    const map = sitemapXml(seo);
    return [
      { name: `${dir}robots.txt`, lang: "text", content: robotsTxt(site.seo) },
      ...(map ? [{ name: `${dir}sitemap.xml`, lang: "xml", content: map }] : []),
    ];
  };
  const seoModule = (path: string, ts: boolean): GeneratedFile[] => (seo ? [{ name: path, lang: ts ? "ts" : "js", content: seoRuntimeModule(seo, ts) }] : []);

  if (fw === "html") {
    const out: GeneratedFile[] = [];
    // Font Google: dari @import CSS (berantai, memblokir render) → <link> di <head> + preconnect.
    const globalFonts = splitFontImports(ctx.globalCss);
    for (const p of ordered) {
      const h = { ...p.composed.html };
      const pageFonts = splitFontImports(h.css);
      h.css = pageFonts.css;
      // Aksesibilitas: tautan "Lewati ke konten" ke <main> (pengguna keyboard/pembaca layar).
      h.body = withSkipLink(h.body, lang);
      const fontHead = fontHeadTags([...globalFonts.urls, ...pageFonts.urls]);
      out.push({
        name: `${p.file}.html`,
        lang: "html",
        content: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${seo ? esc(seo[ordered.indexOf(p)].title) : `${esc(p.title)}${p.title === siteName ? "" : ` — ${esc(siteName)}`}`}</title>${
    seo ? `\n${indent([seoMetaTags(seo[ordered.indexOf(p)], siteName, lang), p.isHome ? websiteJsonLd(siteName, site!.seo) : ""].filter(Boolean).join("\n"), 2)}` : ""
  }
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />${fontHead ? `\n${indent(fontHead, 2)}` : ""}
  <link rel="stylesheet" href="assets/global.css" />
  <link rel="stylesheet" href="assets/${p.file}.css" />
  ${IMG_FALLBACK_TAG}${libraryHead(p.composed.libraries) ? `\n${indent(libraryHead(p.composed.libraries), 2)}` : ""}
</head>
<body>
${indent(h.body, 2)}${libraryScripts(p.composed.libraries) ? `\n${indent(libraryScripts(p.composed.libraries), 2)}` : ""}${h.script ? `\n  <script src="assets/${p.file}.js"></script>` : ""}
</body>
</html>
`,
      });
      out.push({ name: `assets/${p.file}.css`, lang: "css", content: h.css });
      if (h.script) out.push({ name: `assets/${p.file}.js`, lang: "js", content: h.script.trim() + "\n" });
      // Uji coba halaman item: satu berkas statis per item (<koleksi>/<slug>.html).
      const page = out[out.length - (h.script ? 3 : 2)].content;
      for (const it of p.items ?? []) {
        const v = { ...it.composed.html, css: splitFontImports(it.composed.html.css).css, body: withSkipLink(it.composed.html.body, lang) };
        // Hanya komentar nama elemen yang berbeda → pakai CSS halaman.
        const bare = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");
        const ownCss = bare(v.css) !== bare(h.css);
        let html = page
          .replace("<head>", '<head>\n  <base href="../" />')
          .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(it.title)} — ${esc(siteName)}</title>`)
          .replace(indent(h.body, 2), () => indent(v.body, 2));
        if (ownCss) html = html.replace(`href="assets/${p.file}.css"`, `href="${it.dir}/${it.slug}.css"`);
        out.push({ name: `${it.dir}/${it.slug}.html`, lang: "html", content: html });
        if (ownCss) out.push({ name: `${it.dir}/${it.slug}.css`, lang: "css", content: v.css });
      }
    }
    out.push({ name: "assets/global.css", lang: "css", content: `${globalFonts.css.trimEnd()}\n\n${SKIP_LINK_CSS}\n` });
    out.push({ name: "assets/favicon.svg", lang: "xml", content: faviconSvg(siteName) });
    out.push(...seoFiles(""));
    out.push(htmlReadme(ctx));
    return out;
  }

  if (fw === "blade") {
    const blade = bladeProject(
      ctx,
      ordered.map((p, i) => ({
        ...ctx.pages[i],
        body: p.composed.html.body,
        css: p.composed.html.css,
        script: p.composed.html.script,
        libs: p.composed.libraries,
        ...(seo ? { fullTitle: seo[i].title, meta: [seoMetaTags(seo[i], siteName, lang), p.isHome ? websiteJsonLd(siteName, site!.seo) : ""].filter(Boolean).join("\n") } : {}),
      })),
    );
    const readmeAt = blade.findIndex((f) => f.name === "README.md");
    blade.splice(readmeAt < 0 ? blade.length : readmeAt, 0, ...seoFiles("public/"));
    return blade;
  }

  const prefix = fw === "angular" ? "src/app/pages" : "src/pages";
  const linkMode = fw === "svelte" ? "hash" : "router";
  const pageFiles = ordered.flatMap((p) =>
    p.composed.files(fw).map((f) => {
      let content = f.lang === "css" ? f.content : rewritePageLinks(f.content, ctx.pages, linkMode);
      // Komponen halaman Angular dipakai langsung oleh router → harus standalone.
      if (fw === "angular" && f.name === `${toKebab(toPascal(p.rootClass))}.component.ts` && !content.includes("standalone: true"))
        content = content.replace(/(selector: '[^']+',)/, "$1\n  standalone: true,");
      return { ...f, name: `${prefix}/${p.slug}/${f.name}`, content };
    }),
  );
  const name = (p: BuiltPage) => toPascal(p.rootClass);
  // Urutan berkas: halaman dulu (ditampilkan pertama di panel kode), lalu router/entry, kerangka, README.
  const scaffold = (files: GeneratedFile[]) => {
    const readme = files.filter((f) => f.name === "README.md");
    return { head: files.filter((f) => f.name !== "README.md"), readme };
  };

  if (fw === "react") {
    const { head, readme } = scaffold(reactScaffold(ctx));
    const app = `import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { initLibraries } from "./initLibraries";${seo ? `\nimport { applySeo } from "./seo";` : ""}
${ordered.map((p) => `import ${name(p)} from "./pages/${p.slug}/${name(p)}";`).join("\n")}

/** Gulir ke atas & jalankan ulang library CDN setiap pindah halaman. */
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);${seo ? "\n    applySeo(pathname);" : ""}
    const id = requestAnimationFrame(() => initLibraries());
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <Routes>
${ordered.map((p) => `        <Route path="${p.isHome ? "/" : `/${p.slug}`}" element={<${name(p)} />} />`).join("\n")}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
`;
    const main = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;
    return [...pageFiles, { name: "src/App.jsx", lang: "jsx", content: app }, { name: "src/main.jsx", lang: "jsx", content: main }, ...seoModule("src/seo.js", false), ...head, ...seoFiles("public/"), ...readme];
  }

  if (fw === "vue") {
    const { head, readme } = scaffold(vueScaffold(ctx));
    const router = `import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { initLibraries } from "./initLibraries.js";${seo ? `\nimport { applySeo } from "./seo.js";` : ""}
${ordered.map((p) => `import ${name(p)} from "./pages/${p.slug}/${name(p)}.vue";`).join("\n")}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
${ordered.map((p) => `    { path: "${p.isHome ? "/" : `/${p.slug}`}", component: ${name(p)}, meta: { title: ${JSON.stringify(p.title)} } },`).join("\n")}
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

// Jalankan ulang library CDN setelah halaman baru dirender.
router.afterEach((${seo ? "to" : ""}) => {${seo ? "\n  applySeo(to.path);" : ""}
  nextTick(() => initLibraries());
});

export default router;
`;
    return [
      ...pageFiles,
      { name: "src/App.vue", lang: "vue", content: `<template>\n  <RouterView />\n</template>\n` },
      { name: "src/router.js", lang: "js", content: router },
      {
        name: "src/main.js",
        lang: "js",
        content: `import { createApp } from "vue";\nimport "./styles.css";\nimport App from "./App.vue";\nimport router from "./router.js";\n\ncreateApp(App).use(router).mount("#app");\n`,
      },
      ...seoModule("src/seo.js", false),
      ...head,
      ...seoFiles("public/"),
      ...readme,
    ];
  }

  if (fw === "svelte") {
    const { head, readme } = scaffold(svelteScaffold(ctx));
    const app = `<script>
  import { onMount, tick } from "svelte";
  import { initLibraries } from "./initLibraries.js";${seo ? `\n  import { applySeo } from "./seo.js";` : ""}
${ordered.map((p) => `  import ${name(p)} from "./pages/${p.slug}/${name(p)}.svelte";`).join("\n")}

  // Router hash sederhana (Svelte tidak punya router bawaan): #/ , #/slug
  const routes = {
${ordered.map((p) => `    "${p.isHome ? "/" : `/${p.slug}`}": ${name(p)},`).join("\n")}
  };

  let path = "/";
  async function read() {
    path = window.location.hash.slice(1) || "/";
    window.scrollTo(0, 0);${seo ? "\n    applySeo(path);" : ""}
    await tick();
    initLibraries();
  }
  onMount(() => {
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  });

  $: Page = routes[path] || routes["/"];
</script>

<svelte:component this={Page} />
`;
    return [
      ...pageFiles,
      { name: "src/App.svelte", lang: "svelte", content: app },
      { name: "src/main.js", lang: "js", content: `import "./styles.css";\nimport App from "./App.svelte";\n\nconst app = new App({ target: document.getElementById("app") });\n\nexport default app;\n` },
      ...seoModule("src/seo.js", false),
      ...head,
      ...seoFiles("public/"),
      ...readme,
    ];
  }

  // Angular
  const { head, readme } = scaffold(angularScaffold(ctx));
  const cls = (p: BuiltPage) => `${name(p)}Component`;
  const routes = `import { Routes } from '@angular/router';
${ordered.map((p) => `import { ${cls(p)} } from './pages/${p.slug}/${toKebab(name(p))}.component';`).join("\n")}

export const routes: Routes = [
${ordered.map((p) => `  { path: '${p.isHome ? "" : p.slug}', component: ${cls(p)}, title: ${JSON.stringify(seo ? seo[ordered.indexOf(p)].title : p.title)} },`).join("\n")}
  { path: '**', redirectTo: '' },
];
`;
  return [
    ...pageFiles,
    { name: "src/app/app.routes.ts", lang: "ts", content: routes },
    {
      name: "src/app/app.component.ts",
      lang: "ts",
      content: `import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { initLibraries } from './init-libraries';${seo ? "\nimport { applySeo } from '../seo';" : ""}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent {
  constructor(router: Router) {
    // Jalankan ulang library CDN setiap pindah halaman.
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(${
      seo
        ? `(e) => {\n      // Judul & meta SEO per halaman (setelah TitleStrategy Angular).\n      setTimeout(() => applySeo((e as NavigationEnd).urlAfterRedirects.split(/[?#]/)[0] || '/'));\n      setTimeout(() => initLibraries());\n    }`
        : "() => setTimeout(() => initLibraries())"
    });
  }
}
`,
    },
    {
      name: "src/main.ts",
      lang: "ts",
      content: `import { bootstrapApplication } from '@angular/platform-browser';\nimport { provideRouter, withInMemoryScrolling } from '@angular/router';\nimport { AppComponent } from './app/app.component';\nimport { routes } from './app/app.routes';\n\nbootstrapApplication(AppComponent, {\n  providers: [provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' }))],\n}).catch((err) => console.error(err));\n`,
    },
    ...seoModule("src/seo.ts", true),
    ...head,
    ...seoFiles("public/"),
    ...readme,
  ];
}

/* ------------------------- font & favicon (HTML) ------------------------- */

const FONT_IMPORT = /^@import url\("(https:\/\/fonts\.googleapis\.com\/[^"]+)"\);?[ \t]*\n?/gm;

/** Pisahkan @import Google Fonts dari CSS (untuk dijadikan <link> di <head>). */
export function splitFontImports(css: string): { css: string; urls: string[] } {
  const urls: string[] = [];
  const rest = css.replace(FONT_IMPORT, (_m, url: string) => {
    urls.push(url);
    return "";
  });
  return { css: urls.length ? rest.replace(/^\s*\n/, "") : css, urls };
}

const attrEsc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** preconnect + stylesheet Google Fonts (unik); "" bila tidak ada font pustaka. */
export function fontHeadTags(urls: readonly string[]): string {
  const uniq = [...new Set(urls)];
  if (!uniq.length) return "";
  return [
    `<link rel="preconnect" href="https://fonts.googleapis.com" />`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`,
    ...uniq.map((u) => `<link rel="stylesheet" href="${attrEsc(u)}" />`),
  ].join("\n");
}

/** Favicon SVG sederhana: huruf pertama nama situs (cegah 404 /favicon.ico). */
export function faviconSvg(siteName: string): string {
  const ch = (siteName.trim().match(/[\p{L}\p{N}]/u)?.[0] ?? "W").toUpperCase();
  const x = ch.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#111827"/><text x="32" y="43" font-family="system-ui,Segoe UI,Arial,sans-serif" font-size="34" font-weight="700" text-anchor="middle" fill="#fff">${x}</text></svg>\n`;
}

/* ------------------------------ skip link ------------------------------- */

export const SKIP_LINK_CSS = `/* Tautan "Lewati ke konten": tersembunyi sampai difokus dengan keyboard */
.owd-skip {
  position: absolute;
  left: 12px;
  top: -64px;
  z-index: 10000;
  padding: 10px 16px;
  border-radius: 8px;
  background: #111827;
  color: #ffffff;
  font: 600 14px/1.2 system-ui, sans-serif;
  text-decoration: none;
}
.owd-skip:focus {
  top: 12px;
  outline: 3px solid #f59e0b;
  outline-offset: 2px;
}`;

/** Tambah tautan skip di awal body dan id pada <main> pertama (bila ada <main>). */
export function withSkipLink(body: string, lang: "id" | "en"): string {
  const m = /<main\b([^>]*)>/i.exec(body);
  if (!m || body.includes('class="owd-skip"')) return body;
  const idm = /\bid="([^"]+)"/.exec(m[1]);
  const id = idm ? idm[1] : "konten";
  const main = idm ? m[0] : `<main id="${id}"${m[1]}>`;
  const label = lang === "en" ? "Skip to content" : "Lewati ke konten";
  const out = body.slice(0, m.index) + main + body.slice(m.index + m[0].length);
  return `<a class="owd-skip" href="#${id}">${label}</a>\n${out}`;
}
