// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { compose } from "../engine/helpers/compose";
import { createElementNode } from "../engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset } from "../helpers/pageDoc";
import { menuItems, resolveMenuSite } from "../core/elements/navigation/Menu";
import {
  addPage,
  allSiteInfos,
  createSiteDoc,
  isValidSlug,
  movePage,
  normalizeSiteDoc,
  removePage,
  replacePage,
  setHomepage,
  setLabel,
  setSlug,
  slugify,
  uniqueSlug,
} from "../helpers/site";
import { buildSite } from "../helpers/siteExport";

const icons = makeIconLookup([]);

function page(id, name, extra = []) {
  const sec = createSectionFromPreset("single");
  const menu = createElementNode("menu", structuredClone(D.menu.defaults), "Menu");
  const t = createElementNode("text", { ...structuredClone(D.text.defaults), text: `Ini ${name}` }, "Judul");
  t.advanced = { cssId: "judul", customJs: "element.dataset.x = '1';" };
  sec.children[0].children.push(menu, t, ...extra);
  return { id, name, updatedAt: 1, state: JSON.parse(JSON.stringify({ version: 2, root: createPageRoot([sec]) })) };
}

const site = (doc, id = "s1", name = "Situs") => ({ id, name, updatedAt: 1, state: doc });

/* ------------------------------- slug ------------------------------- */

test("slug: nama desain dipetakan ke slug valid, bukan dipakai mentah", () => {
  assert.equal(slugify("Tentang Kami!"), "tentang-kami");
  assert.equal(slugify("  Layanan & Harga  "), "layanan-harga");
  assert.equal(slugify("Café Ölé"), "cafe-ole");
  assert.equal(slugify("Index"), "halaman-index"); // nama terlarang
  assert.equal(slugify("!!!"), "halaman");
  assert.ok(isValidSlug("kontak-2"));
  for (const bad of ["Kontak", "a b", "-a", "a--b", "index", "assets", "x/y", ""]) assert.ok(!isValidSlug(bad), bad);
  assert.equal(uniqueSlug("kontak", new Set(["kontak", "kontak-2"])), "kontak-3");
});

/* ------------------------------ folder ------------------------------ */

test("folder: tambah/keluarkan/urutkan/ganti halaman tanpa menyentuh desain sumber", () => {
  const a = page("a", "Beranda"), b = page("b", "Tentang Kami"), c = page("c", "Kontak"), x = page("x", "Kontak");
  const before = JSON.stringify([a, b, c]);
  let doc = createSiteDoc();
  for (const d of [a, b, c]) doc = addPage(doc, d);
  assert.deepEqual(doc.pages.map((p) => p.slug), ["beranda", "tentang-kami", "kontak"]);
  assert.equal(doc.homepageId, "a", "halaman pertama otomatis jadi homepage");
  assert.equal(addPage(doc, a), doc, "desain yang sama tidak ditambah dua kali");

  doc = movePage(doc, "c", 0);
  assert.deepEqual(doc.pages.map((p) => p.designId), ["c", "a", "b"]);

  doc = setHomepage(doc, "b");
  doc = replacePage(doc, "b", x);
  assert.deepEqual(doc.pages.map((p) => p.designId), ["c", "a", "x"], "posisi dipertahankan");
  assert.equal(doc.pages[2].slug, "tentang-kami", "slug dipertahankan saat diganti");
  assert.equal(doc.homepageId, "x", "homepage ikut desain pengganti");
  assert.equal(replacePage(doc, "a", c), doc, "tidak boleh mengganti dengan desain yang sudah ada di folder");

  doc = removePage(doc, "x");
  assert.equal(doc.homepageId, "c", "homepage dihapus → halaman pertama");
  assert.equal(JSON.stringify([a, b, c]), before, "desain sumber tidak berubah");
});

test("folder: slug & label — validasi, unik, label kosong kembali ke nama desain", () => {
  let doc = createSiteDoc();
  for (const d of [page("a", "Beranda"), page("b", "Profil")]) doc = addPage(doc, d);
  assert.match(setSlug(doc, "b", "Profil Kami").error, /huruf kecil/);
  assert.match(setSlug(doc, "b", "beranda").error, /sudah dipakai/);
  const ok = setSlug(doc, "b", "tentang");
  assert.equal(ok.error, undefined);
  assert.equal(ok.doc.pages[1].slug, "tentang");
  doc = setLabel(ok.doc, "b", "Tentang Kami");
  assert.equal(doc.pages[1].label, "Tentang Kami");
  doc = setLabel(doc, "b", "  ");
  assert.equal("label" in doc.pages[1], false);
});

test("folder: data rusak dinormalisasi (duplikat, slug bentrok/invalid, homepage hilang)", () => {
  const doc = normalizeSiteDoc({
    pages: [
      { designId: "a", slug: "Home Page" },
      { designId: "a", slug: "dup" },
      { designId: "b", slug: "home-page" },
      { designId: "c", slug: "index" },
      { slug: "tanpa-id" },
      null,
    ],
    homepageId: "zzz",
  });
  assert.deepEqual(doc.pages.map((p) => p.designId), ["a", "b", "c"]);
  const slugs = doc.pages.map((p) => p.slug);
  assert.equal(new Set(slugs).size, 3);
  assert.ok(slugs.every(isValidSlug), slugs.join());
  assert.equal(doc.homepageId, "a");
  assert.deepEqual(normalizeSiteDoc("rusak"), createSiteDoc());
});

/* ------------------------------- menu ------------------------------- */

test("menu: mengambil halaman dari folder yang tepat; ganti nama & hapus desain ikut terbarui", () => {
  const a = page("a", "Beranda"), b = page("b", "Tentang"), c = page("c", "Kontak"), z = page("z", "Lain");
  let d1 = createSiteDoc();
  for (const d of [a, b, c]) d1 = addPage(d1, d);
  const d2 = addPage(createSiteDoc(), z);
  const sites = [site(d2, "s2", "Lain"), site(d1, "s1", "Utama")];

  let infos = allSiteInfos(sites, [a, b, c, z]);
  // automatic: the folder containing the page being rendered
  assert.equal(resolveMenuSite({ siteId: "" }, { sites: infos, currentDesignId: "b", routing: "none" }).id, "s1");
  // no page context → the first folder
  assert.equal(resolveMenuSite({ siteId: "" }, { sites: infos, routing: "none" }).id, "s2");
  // an explicit choice wins
  assert.equal(resolveMenuSite({ siteId: "s2" }, { sites: infos, currentDesignId: "b", routing: "none" }).id, "s2");

  const ctx = { sites: infos, currentDesignId: "a", routing: "none" };
  assert.deepEqual(menuItems({ siteId: "", pageIds: [] }, ctx).items.map((p) => p.label), ["Beranda", "Tentang", "Kontak"]);
  assert.deepEqual(menuItems({ siteId: "", pageIds: ["c", "a"] }, ctx).items.map((p) => p.label), ["Beranda", "Kontak"], "urutan ikut folder");

  // renaming a design → the menu label follows (the folder only stores IDs)
  const b2 = { ...b, name: "Tentang Kami" };
  infos = allSiteInfos(sites, [a, b2, c, z]);
  assert.deepEqual(menuItems({ siteId: "s1", pageIds: [] }, { sites: infos, routing: "none" }).items.map((p) => p.label), ["Beranda", "Tentang Kami", "Kontak"]);
  // design deleted → gone from the menu
  infos = allSiteInfos(sites, [a, c, z]);
  assert.deepEqual(menuItems({ siteId: "s1", pageIds: [] }, { sites: infos, routing: "none" }).items.map((p) => p.slug), ["beranda", "kontak"]);
  // no folder → sample
  assert.equal(menuItems({ siteId: "", pageIds: [] }, { sites: [], routing: "none" }).sample, true);
});

test("menu: tautan per target (halaman tunggal & ekspor website per framework)", () => {
  const a = page("a", "Beranda"), b = page("b", "Tentang Kami");
  let doc = createSiteDoc();
  for (const d of [a, b]) doc = addPage(doc, d);
  const infos = allSiteInfos([site(doc)], [a, b]);
  const root = JSON.parse(JSON.stringify(b.state.root));

  const single = compose(root, { rootClass: "pg", icons, site: { sites: infos, currentDesignId: "b", routing: "none" } });
  assert.match(single.html.body, /href="index\.html"[^>]*>Beranda</);
  assert.match(single.html.body, /href="tentang-kami\.html"[^>]*aria-current="page"|aria-current="page"[^>]*href="tentang-kami\.html"/);
  assert.match(single.html.body, /data-pm-page="a"/);

  const built = buildSite(site(doc), [a, b], { icons });
  const all = (fw) => built.files(fw).map((f) => f.content).join("\n");
  assert.match(all("react"), /<Link[^>]*to="\/tentang-kami"/);
  assert.match(all("react"), /import \{ Link \} from "react-router-dom"/);
  assert.match(all("vue"), /<RouterLink[^>]*to="\/tentang-kami"/);
  assert.match(all("svelte"), /href="#\/tentang-kami"/);
  assert.match(all("angular"), /routerLink="\/tentang-kami"/);
  assert.match(all("html"), /href="tentang-kami\.html"/);
});

/* ---------------------------- website export ------------------------ */

test("ekspor website: struktur & routing per framework, homepage dihormati", () => {
  const a = page("a", "Beranda"), b = page("b", "Tentang Kami", [createElementNode("tabs", structuredClone(D.tabs.defaults), "Tabs")]), c = page("c", "Kontak");
  let doc = createSiteDoc();
  for (const d of [a, b, c]) doc = addPage(doc, d);
  doc = setHomepage(doc, "b");
  const built = buildSite(site(doc), [a, b, c], { icons });
  assert.equal(built.home.designId, "b");
  assert.deepEqual(built.warnings, []);
  const names = (fw) => built.files(fw).map((f) => f.name);
  const file = (fw, n) => built.files(fw).find((f) => f.name === n)?.content ?? "";

  // HTML: homepage = index.html, other pages = <slug>.html
  assert.ok(names("html").includes("index.html"));
  assert.ok(names("html").includes("beranda.html") && names("html").includes("kontak.html"));
  assert.ok(!names("html").includes("tentang-kami.html"), "homepage tidak diduplikasi");
  assert.match(file("html", "index.html"), /Ini Tentang Kami/);
  assert.match(file("html", "beranda.html"), /href="index\.html"/);

  // React
  assert.ok(names("react").includes("src/App.jsx") && names("react").includes("src/main.jsx"));
  const app = file("react", "src/App.jsx");
  assert.match(app, /BrowserRouter/);
  assert.match(app, /path="\/"[^\n]*PageTentangKami|PageTentangKami[^\n]*path="\/"/);
  assert.match(app, /\/kontak/);
  assert.ok(names("react").some((n) => n.startsWith("src/pages/tentang-kami/") && n.includes("Tabs")), "komponen anak per halaman");

  // Vue / Svelte / Angular
  assert.match(file("vue", "src/router.js"), /createWebHistory/);
  assert.match(file("svelte", "src/App.svelte"), /hashchange/);
  const routes = file("angular", "src/app/app.routes.ts");
  assert.match(routes, /path: ''/);
  assert.match(routes, /path: 'kontak'/);
  for (const f of built.files("angular").filter((f) => /pages\/.*\.component\.ts$/.test(f.name)))
    assert.match(f.content, /standalone: true/, f.name);

  for (const fw of ["html", "react", "vue", "svelte", "angular"]) assert.ok(names(fw).includes("README.md"), fw);
});

test("ekspor website: desain yang dihapus dilewati dengan peringatan; folder kosong diberi tahu", () => {
  const a = page("a", "Beranda"), b = page("b", "Profil");
  let doc = createSiteDoc();
  for (const d of [a, b]) doc = addPage(doc, d);
  doc = setHomepage(doc, "b");
  const built = buildSite(site(doc), [a], { icons });
  assert.equal(built.pages.length, 1);
  assert.equal(built.home.designId, "a");
  assert.ok(built.warnings.some((w) => /dihapus/.test(w)));
  assert.ok(built.warnings.some((w) => /Homepage/.test(w)));
  assert.ok(buildSite(site(createSiteDoc()), [], { icons }).warnings.some((w) => /belum berisi/.test(w)));
});
