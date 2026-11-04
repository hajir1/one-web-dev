// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { createElementNode } from "../engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset } from "../helpers/pageDoc";
import { addPage, createSiteDoc, normalizeSiteDoc, setLabel, setPageSeo, setSiteSeo } from "../helpers/site";
import { buildSite } from "../helpers/siteExport";
import { cleanUrl, normalizePageSeo, resolveSeo, robotsTxt, seoAudit, sitemapXml } from "../helpers/seo";

const icons = makeIconLookup([]);
function page(id, name) {
  const sec = createSectionFromPreset("single");
  sec.children[0].children.push(createElementNode("text", { ...structuredClone(D.text.defaults), text: `Ini ${name}` }, "Judul"));
  return { id, name, updatedAt: 1, state: JSON.parse(JSON.stringify({ version: 2, root: createPageRoot([sec]) })) };
}
const designs = [page("d1", "Beranda"), page("d2", "Tentang")];
function seoSite() {
  let doc = addPage(addPage(createSiteDoc(), designs[0]), designs[1]);
  doc = setSiteSeo(doc, { siteUrl: "https://tokokue.id/", description: "Kue rumahan segar setiap hari di Bandung, pesan lewat WhatsApp.", ogImage: "https://tokokue.id/og.jpg" });
  doc = setPageSeo(doc, "d2", { title: "Tentang Toko Kue <Ibu>", description: 'Cerita "kami" & dapur kami.' });
  return { id: "s1", name: "Toko Kue", updatedAt: 1, state: JSON.parse(JSON.stringify(doc)) };
}
const files = (fw) => Object.fromEntries(buildSite(seoSite(), designs, { icons }).files(fw).map((f) => [f.name, f.content]));

test("cleanUrl: hanya http/https absolut, tanpa kredensial", () => {
  assert.equal(cleanUrl("https://a.com/"), "https://a.com");
  assert.equal(cleanUrl("javascript:alert(1)"), "");
  assert.equal(cleanUrl("/gambar.jpg"), "");
  assert.equal(cleanUrl("https://u:p@a.com"), "");
});

test("normalisasi menyimpan SEO dan membuang nilai tidak valid", () => {
  const doc = normalizeSiteDoc({ pages: [{ designId: "d1", slug: "a", seo: { title: "  Judul  ", ogImage: "ftp://x", noindex: "ya" } }], seo: { siteUrl: "bukan url", indexable: false } });
  assert.deepEqual(doc.pages[0].seo, { title: "Judul" });
  assert.deepEqual(doc.seo, { indexable: false });
  assert.equal(normalizePageSeo({}), undefined);
});

test("setLabel tidak menghapus SEO halaman", () => {
  const doc = setLabel(setPageSeo(addPage(createSiteDoc(), designs[0]), "d1", { description: "x" }), "d1", "Menu");
  assert.deepEqual(doc.pages[0].seo, { description: "x" });
});

test("HTML: meta per halaman di-escape, canonical, robots.txt & sitemap.xml", () => {
  const f = files("html");
  assert.match(f["index.html"], /<title>Beranda — Toko Kue<\/title>/);
  assert.match(f["index.html"], /<link rel="canonical" href="https:\/\/tokokue.id\/" \/>/);
  assert.match(f["index.html"], /application\/ld\+json/);
  assert.match(f["tentang.html"], /<title>Tentang Toko Kue &lt;Ibu&gt;<\/title>/);
  assert.match(f["tentang.html"], /content="Cerita &quot;kami&quot; &amp; dapur kami."/);
  assert.match(f["tentang.html"], /og:url" content="https:\/\/tokokue.id\/tentang.html"/);
  assert.ok(!f["tentang.html"].includes("ld+json"));
  assert.match(f["robots.txt"], /Sitemap: https:\/\/tokokue.id\/sitemap.xml/);
  assert.match(f["sitemap.xml"], /<loc>https:\/\/tokokue.id\/tentang.html<\/loc>/);
});

test("Blade: meta di @verbatim, title lengkap, berkas publik", () => {
  const f = files("blade");
  const v = f["resources/views/pages/tentang.blade.php"];
  assert.match(v, /@section\('title'\)\n@verbatimTentang Toko Kue &lt;Ibu&gt;@endverbatim@endsection/);
  assert.match(v, /@push\('head'\)\n@verbatim\n {2}<meta name="description"/);
  assert.match(f["resources/views/layouts/app.blade.php"], /<title>@yield\('title'\)<\/title>/);
  assert.ok(f["public/robots.txt"] && f["public/sitemap.xml"].includes("https://tokokue.id/tentang<"));
});

test("SPA: index.html berisi meta beranda, seo.js dipanggil router", () => {
  for (const [fw, idx, router, mod] of [
    ["react", "index.html", "src/App.jsx", "src/seo.js"],
    ["vue", "index.html", "src/router.js", "src/seo.js"],
    ["svelte", "index.html", "src/App.svelte", "src/seo.js"],
    ["angular", "src/index.html", "src/app/app.component.ts", "src/seo.ts"],
  ]) {
    const f = files(fw);
    assert.match(f[idx], /<meta name="description" content="Kue rumahan/, fw);
    assert.match(f[router], /applySeo\(/, fw);
    assert.match(f[mod], /export function applySeo/, fw);
    assert.ok(f["public/robots.txt"], fw);
  }
  assert.match(files("react")["src/seo.js"], /"\/tentang": \{\n\s+"title": "Tentang Toko Kue <Ibu>"/);
  // Svelte uses hashes → the sitemap only has the home page.
  assert.ok(!files("svelte")["public/sitemap.xml"].includes("#"));
});

test("noindex & situs tidak boleh diindeks", () => {
  const p = { title: "A", slug: "a", isHome: false, file: "a", seo: { noindex: true } };
  assert.equal(resolveSeo("S", {}, p, "html").noindex, true);
  assert.equal(sitemapXml([resolveSeo("S", { siteUrl: "https://a.id" }, p, "html")]), "");
  assert.match(robotsTxt({ indexable: false, siteUrl: "https://a.id" }), /Disallow: \/\n$/);
});

test("ekspor tanpa SEO tetap punya robots.txt tanpa sitemap", () => {
  const doc = addPage(createSiteDoc(), designs[0]);
  const f = Object.fromEntries(buildSite({ id: "s", name: "S", updatedAt: 1, state: doc }, designs, { icons }).files("html").map((x) => [x.name, x.content]));
  assert.equal(f["robots.txt"], "User-agent: *\nAllow: /\n");
  assert.equal(f["sitemap.xml"], undefined);
});

test("audit SEO: deskripsi kosong & judul ganda", () => {
  const pages = [
    { title: "A", slug: "a", isHome: true, file: "index", seo: { title: "Sama" } },
    { title: "B", slug: "b", isHome: false, file: "b", seo: { title: "Sama" } },
  ];
  const codes = seoAudit("S", {}, pages).map((x) => x.code);
  assert.ok(codes.includes("noSiteUrl") && codes.includes("noDescription") && codes.includes("duplicateTitle"));
});
