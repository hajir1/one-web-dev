// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { compose } from "../engine/helpers/compose";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { normalizePageDoc } from "../helpers/pageDoc";
import { projectFiles, singlePage } from "../helpers/siteExport";
import { buildTemplatePages } from "../../webTemplates/buildPages";
import { shopStarter } from "../../webTemplates/templates/shopStarter";
import {
  addItem,
  applyCollection,
  canBecomeCollection,
  collectionAncestor,
  collectionsIn,
  formatPrice,
  markCollection,
  materialize,
  parsePrice,
  queryItems,
  removeItem,
  unmarkCollection,
  updateItem,
  uniqueCollections,
  validateValues,
} from "../helpers/collections";
import { withCrud } from "../helpers/crud";
import { collectElements, findNode } from "../engine/helpers/tree";

const icons = makeIconLookup([]);
const home = () => buildTemplatePages({ id: "shop-starter", version: 1, content: shopStarter }, "id").find((p) => p.home).doc;
const cardsOf = (box) => collectElements(box).filter((e) => e.elementType === "product-card");

test("template Kopi Senja: katalog sudah jadi koleksi Produk berisi 6 item", () => {
  const refs = collectionsIn(home().root);
  assert.equal(refs.length, 1);
  const { col } = refs[0];
  assert.equal(col.name, "Produk");
  assert.equal(col.slug, "produk");
  assert.equal(col.items.length, 6);
  assert.deepEqual(
    { name: col.items[0].values.name, price: col.items[0].values.price, compare: col.items[0].values.compare_price, rating: col.items[0].values.rating, reviews: col.items[0].values.reviews, label: col.items[0].values.label },
    { name: "Arabika Gayo 250 g", price: 95000, compare: 110000, rating: 4.8, reviews: 214, label: "Terlaris" },
  );
  assert.equal(col.items[1].values.label, "");
});

test("format harga", () => {
  assert.equal(parsePrice("Rp95.000"), 95000);
  assert.equal(parsePrice("Rp 1.250.000,00"), 1250000);
  assert.equal(formatPrice(95000), "Rp95.000");
  assert.equal(formatPrice(0, true), "");
});

test("CRUD murni + materialize menyusun ulang kartu dari data", () => {
  const root = home().root;
  const { boxId, col } = collectionsIn(root)[0];
  let next = addItem(col, { name: "Kopi Baru", price: 50000, compare_price: 0, rating: 4.2, reviews: 3, description: "Enak", label: "Baru", image: "" });
  next = updateItem(next, next.items[1].id, { ...next.items[1].values, price: 99000 });
  next = removeItem(next, next.items[2].id);
  const r2 = applyCollection(root, boxId, next);
  const box = findNode(r2, boxId);
  const cards = cardsOf(box);
  assert.equal(cards.length, 6);
  assert.equal(cards[0].state.name, "Kopi Baru");
  assert.equal(cards[0].state.priceText, "Rp50.000");
  assert.equal(cards[0].state.comparePriceText, "");
  assert.equal(cards[0].state.badgeText, "Baru");
  assert.equal(cards[1].state.priceText, "Rp99.000");
  // Styles follow the pattern (the old first card).
  const first = cardsOf(findNode(root, boxId))[0];
  assert.equal(cards[3].state.ctaBgColor, first.state.ctaBgColor);
  // Every item deleted → no cards left, the stored pattern is used again.
  const empty = applyCollection(r2, boxId, { ...next, items: [] });
  assert.equal(findNode(empty, boxId).children.length, 0);
  const back = applyCollection(empty, boxId, addItem({ ...next, items: [] }, { name: "Satu", price: 1000 }));
  assert.equal(cardsOf(findNode(back, boxId))[0].state.name, "Satu");
});

test("cari + pagination", () => {
  const { col } = collectionsIn(home().root)[0];
  assert.equal(queryItems(col, "", 1, 5).rows.length, 5);
  assert.equal(queryItems(col, "", 2, 5).rows.length, 1);
  assert.equal(queryItems(col, "", 9, 5).page, 2);
  assert.equal(queryItems(col, "robusta", 1, 5).total, 1);
  assert.equal(queryItems(col, "TERLARIS", 1, 5).total, 1);
});

test("validasi form", () => {
  const { col } = collectionsIn(home().root)[0];
  const bad = validateValues(col.fields, { name: "", price: "abc", compare_price: "10", rating: "7" });
  assert.equal(bad.errors.name, "crud.err.required");
  assert.ok(bad.errors.price);
  assert.equal(bad.errors.rating, "crud.err.rating");
  const ok = validateValues(col.fields, { name: "A", price: "Rp12.000", compare_price: "15000", rating: "4,5", reviews: "2", image: "javascript:alert(1)" });
  assert.equal(ok.values.price, 12000);
  assert.equal(ok.values.rating, 4.5);
  assert.equal(ok.errors.image, "crud.err.image");
  assert.equal(validateValues(col.fields, { name: "A", price: "12000", compare_price: "9000" }).errors.compare_price, "crud.err.compare");
});

test("tandai / lepas koleksi per elemen; koleksi bertahan saat dimuat ulang", () => {
  const root = home().root;
  const { boxId } = collectionsIn(root)[0];
  const plain = unmarkCollection(root, boxId);
  assert.equal(collectionsIn(plain).length, 0);
  assert.equal(cardsOf(findNode(plain, boxId)).length, 6, "kartu tetap ada");
  assert.ok(canBecomeCollection(findNode(plain, boxId)));
  const again = markCollection(plain, boxId, "Menu Kopi");
  assert.equal(collectionsIn(again)[0].col.slug, "menu-kopi");
  const reloaded = normalizePageDoc(JSON.parse(JSON.stringify({ version: 2, root: again }))).root;
  const col = collectionsIn(reloaded)[0]?.col;
  assert.ok(col, "koleksi tidak hilang saat normalisasi");
  assert.equal(col.items.length, 6);
  assert.ok(col.pattern);
  const card = cardsOf(findNode(reloaded, boxId))[0];
  assert.equal(collectionAncestor(reloaded, card.id)?.id, boxId);
});

test("slug ganda diberi akhiran", () => {
  const { col } = collectionsIn(home().root)[0];
  assert.deepEqual(uniqueCollections([col, col]).map((c) => c.slug), ["produk", "produk-2"]);
});

function exported(fw) {
  const doc = home();
  const c = compose(doc.root, { rootClass: "kopi", icons });
  return { files: projectFiles(fw, "Kopi Senja", [singlePage(c, "Kopi Senja")]), cols: collectionsIn(doc.root).map((r) => r.col), html: c.html };
}

test("compose memberi penanda data-collection", () => {
  const { html } = exported("html");
  assert.match(html.body, /data-collection="produk"/);
});

test("Include CRUD Laravel: berkas lengkap + PHP valid", () => {
  const { files, cols } = exported("blade");
  const out = withCrud("laravel", files, cols, "Kopi Senja");
  const names = out.map((f) => f.name);
  for (const n of [
    "app/Models/Produk.php",
    "app/Http/Controllers/Admin/ProdukController.php",
    "app/Http/Controllers/Api/ProdukApiController.php",
    "app/Http/Requests/ProdukRequest.php",
    "database/seeders/ProdukSeeder.php",
    "resources/views/admin/produk/index.blade.php",
    "resources/views/admin/produk/_form.blade.php",
    "resources/views/admin/layout.blade.php",
    "public/assets/collections.js",
  ])
    assert.ok(names.includes(n), n);
  assert.ok(names.some((n) => /^database\/migrations\/.+_create_produk_table\.php$/.test(n)));
  const routes = out.find((f) => f.name === "routes/web.php").content;
  assert.match(routes, /Route::resource\('produk', .*ProdukController::class\)->except\('show'\)->parameters\(\['produk' => 'item'\]\)/);
  assert.match(routes, /middleware\('auth'\)/);
  const ctrl = out.find((f) => f.name === "app/Http/Controllers/Admin/ProdukController.php").content;
  assert.match(ctrl, /->search\(\$q\)/);
  assert.match(ctrl, /->paginate\(\$perPage\)/);
  const page = out.find((f) => f.name.startsWith("resources/views/pages/")).content;
  assert.match(page, /assets\/collections\.js/);
  // PHP syntax check (when php is available).
  let php = true;
  try {
    execFileSync("php", ["-v"], { stdio: "ignore" });
  } catch {
    php = false;
  }
  if (php) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "crud-php-"));
    for (const f of out.filter((f) => f.name.endsWith(".php") && !f.name.endsWith(".blade.php"))) {
      const p = path.join(dir, f.name.replace(/\//g, "_"));
      fs.writeFileSync(p, f.content);
      execFileSync("php", ["-l", p], { stdio: "pipe" });
    }
  }
});

test("Include CRUD Express: situs di public/ + server + JS valid", () => {
  const { files, cols } = exported("html");
  const out = withCrud("express", files, cols, "Kopi Senja");
  const names = out.map((f) => f.name);
  for (const n of ["package.json", "server.js", "src/db.js", "src/auth.js", "src/collections/produk.js", "src/routes/produk.js", "src/seed/produk.json", "views/admin/produk/index.ejs", "views/admin/produk/form.ejs", "views/login.ejs", "public/index.html", "public/assets/collections.js", "README.md"])
    assert.ok(names.includes(n), n);
  assert.ok(!names.includes("index.html"));
  assert.match(out.find((f) => f.name === "public/index.html").content, /<script src="\/assets\/collections\.js" defer><\/script>\s*<\/body>/);
  assert.equal(JSON.parse(out.find((f) => f.name === "src/seed/produk.json").content).length, 6);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "crud-js-"));
  for (const f of out.filter((f) => f.name.endsWith(".js"))) {
    const p = path.join(dir, f.name.replace(/\//g, "_").replace(/\.js$/, ".mjs"));
    fs.writeFileSync(p, f.content);
    execFileSync(process.execPath, ["--check", p], { stdio: "pipe" });
  }
});

test("tanpa koleksi: berkas tidak berubah", () => {
  const { files } = exported("blade");
  assert.equal(withCrud("laravel", files, [], "X"), files);
});

test("materialize tanpa pola aman", () => {
  const box = { kind: "box", id: "b", children: [], collection: { name: "P", slug: "p", card: "product-card", fields: [], items: [{ id: "1", values: {} }] } };
  assert.equal(materialize(box).children.length, 0);
});

/* ---------------- round 2: data views, whole website export ---------------- */

test("tampilan data opsional: default semua; pagination membatasi kartu statis + atribut", async () => {
  const { setCollectionDisplay, collectionDisplayCss, sanitizeCollection } = await import("../helpers/collections");
  let root = home().root;
  const { boxId, col } = collectionsIn(root)[0];
  // Default: no display field, every card, no mode attribute.
  assert.equal(col.display, undefined);
  let html = compose(root, { rootClass: "p", icons }).html.body;
  assert.doesNotMatch(html, /data-collection-mode/);
  // Add items up to 9, then paginate 4 per batch.
  let c = col;
  for (let i = 0; i < 3; i++) c = addItem(c, { ...c.items[0].values, name: `Ekstra ${i}` });
  root = applyCollection(root, boxId, c);
  root = setCollectionDisplay(root, boxId, { mode: "pages", perPage: 4 });
  const box = findNode(root, boxId);
  assert.equal(box.collection.items.length, 9);
  assert.equal(cardsOf(box).length, 4);
  html = compose(root, { rootClass: "p", icons }).html.body;
  assert.match(html, /data-collection-mode="pages"/);
  assert.match(html, /data-per-page="4"/);
  // Scroll: horizontal CSS on the box; back to "all" = the field is removed, every card.
  root = setCollectionDisplay(root, boxId, { mode: "scroll", perPage: 3 });
  const comp = compose(root, { rootClass: "p", icons });
  assert.match(comp.html.css, /grid-auto-flow: column !important/);
  assert.equal(cardsOf(findNode(root, boxId)).length, 3);
  root = setCollectionDisplay(root, boxId, { mode: "all", perPage: 3 });
  assert.equal(findNode(root, boxId).collection.display, undefined);
  assert.equal(cardsOf(findNode(root, boxId)).length, 9);
  assert.equal(collectionDisplayCss(findNode(root, boxId).collection), "");
  // Sanitasi: mode tak dikenal dibuang, perPage dijepit.
  assert.deepEqual(sanitizeCollection({ ...col, display: { mode: "more", perPage: 999 } }, (n) => n).display, { mode: "more", perPage: 48 });
  assert.equal(sanitizeCollection({ ...col, display: { mode: "x", perPage: 3 } }, (n) => n).display, undefined);
});

test("ekspor seluruh website + CRUD Express: semua halaman ikut di public/", async () => {
  const { templateSiteFromPages } = await import("../../webTemplates/templateContent");
  const { buildSite } = await import("../helpers/siteExport");
  const pages = buildTemplatePages({ id: "shop-starter", version: 1, content: shopStarter }, "id");
  const { site, designs } = templateSiteFromPages({ id: "shop-starter", version: 1 }, pages, "Kopi Senja");
  const built = buildSite(site, designs, { icons, allowPremiumElements: true, allowPremiumEvents: true });
  assert.ok(built.pages.length >= 2);
  const cols = designs.flatMap((d) => collectionsIn(normalizePageDoc(d.state).root).map((r) => r.col));
  const out = withCrud("express", built.files("html"), cols, "Kopi Senja");
  const names = out.map((f) => f.name);
  for (const p of built.pages) assert.ok(names.includes(`public/${p.file}.html`), p.file);
  assert.ok(names.includes("public/detail-produk.html") || built.pages.every((p) => p.slug !== "detail-produk"));
  const readme = out.find((f) => f.name === "README.md").content;
  assert.match(readme, /https:\/\/nodejs\.org\/en\/download/);
  assert.match(readme, /node -v/);
});

test("Include CRUD hanya menawarkan Node.js (Express); Laravel disimpan untuk nanti", async () => {
  const { CRUD_STACKS, isOfferedStack, stackForFramework, frameworkForStack } = await import("../helpers/crud");
  assert.deepEqual(CRUD_STACKS.map((s) => s.id), ["express"]);
  assert.equal(isOfferedStack("laravel"), false);
  assert.equal(stackForFramework("blade"), null);
  assert.equal(stackForFramework("html"), "express");
  assert.equal(frameworkForStack("laravel"), "blade");
});

test("slug item: unik, tervalidasi, dipertahankan saat tambah/ubah", async () => {
  const { withSlugs, slugError, itemSlugify, itemHref } = await import("../helpers/collections");
  assert.equal(itemSlugify("Arabika Gayo 250 g"), "arabika-gayo-250-g");
  const col = collectionsIn(home().root)[0].col;
  assert.ok(col.items.every((it) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.slug)));
  assert.equal(new Set(col.items.map((it) => it.slug)).size, col.items.length);
  const dup = withSlugs({ ...col, items: [col.items[0], { ...col.items[0], id: "x" }] });
  assert.equal(dup.items[1].slug, `${col.items[0].slug}-2`);
  assert.equal(slugError(col, "robusta_500", col.items[1].id), "crud.err.itemSlug");
  assert.equal(slugError(col, col.items[0].slug, col.items[1].id), "crud.err.itemSlugTaken");
  assert.equal(slugError(col, col.items[1].slug, col.items[1].id), null);
  let next = updateItem(col, col.items[1].id, col.items[1].values, "robusta-temanggung");
  assert.equal(next.items[1].slug, "robusta-temanggung");
  next = updateItem(next, next.items[1].id, { ...next.items[1].values, name: "Nama Baru" });
  assert.equal(next.items[1].slug, "robusta-temanggung");
  next = addItem(next, { ...next.items[0].values, name: "Kopi Baru" });
  assert.equal(next.items[0].slug, "kopi-baru");
  assert.equal(itemHref({ ...next, itemPage: true }, next.items[0]), "produk/kopi-baru.html");
});

test("halaman item: detail terikat ke data + Mungkin Anda suka berlabel sama", async () => {
  const { itemBoxIn, relatedItems, syncItemPage } = await import("../helpers/itemPage");
  const pages = buildTemplatePages({ id: "shop-starter", version: 1, content: shopStarter }, "id");
  const col = collectionsIn(home().root)[0].col;
  assert.equal(col.itemPage, true);
  const h = home().root;
  assert.ok(cardsOf(findNode(h, collectionsIn(h)[0].boxId)).every((c) => /^produk\/[a-z0-9-]+\.html$/.test(c.state.ctaHref)));
  const detail = pages.find((p) => p.slug === "detail-produk").doc;
  const box = itemBoxIn(detail.root);
  assert.equal(box.itemOf.collection, col.slug);
  const binds = collectElements(box).map((e) => e.bind).filter(Boolean);
  for (const f of ["name", "price", "image", "description"]) assert.ok(binds.includes(f), f);
  // Preview another item → the content changes.
  const v60 = col.items.find((it) => it.slug === "set-v60-pemula");
  const root = syncItemPage(detail.root, [col], v60.id);
  const name = collectElements(itemBoxIn(root)).find((e) => e.bind === "name");
  assert.match(JSON.stringify(name.state), /Set V60 Pemula/);
  // Related: same label first, the item itself is excluded.
  const first = col.items[0];
  const rel = relatedItems(col, first, 3);
  assert.equal(rel.length, 3);
  assert.ok(!rel.some((it) => it.id === first.id));
  const same = col.items.filter((it) => it.id !== first.id && it.values.label && it.values.label === first.values.label);
  assert.deepEqual(rel.slice(0, same.length).map((it) => it.id), same.slice(0, 3).map((it) => it.id));
  // Reloaded: itemOf/related/bind persist.
  const again = normalizePageDoc(JSON.parse(JSON.stringify(detail)));
  assert.equal(itemBoxIn(again.root).itemOf.collection, col.slug);
  assert.ok(collectElements(itemBoxIn(again.root)).some((e) => e.bind === "price"));
  const html = compose(again.root, { rootClass: "p", icons }).html.body;
  assert.match(html, /data-item="produk"/);
  assert.match(html, /data-related="produk"/);
  assert.match(html, /data-field="name"/);
});

test("ekspor statis: produk/<slug>.html per item; Express: rute /produk/:slug tanpa berkas per item", async () => {
  const { templateSiteFromPages } = await import("../../webTemplates/templateContent");
  const { buildSite } = await import("../helpers/siteExport");
  const pages = buildTemplatePages({ id: "shop-starter", version: 1, content: shopStarter }, "id");
  const { site, designs } = templateSiteFromPages({ id: "shop-starter", version: 1 }, pages, "Kopi Senja");
  const built = buildSite(site, designs, { icons, allowPremiumElements: true, allowPremiumEvents: true });
  const files = built.files("html");
  const item = files.find((f) => f.name === "produk/set-v60-pemula.html");
  assert.ok(item, files.map((f) => f.name).join(","));
  assert.match(item.content, /<base href="\.\.\/" ?\/?>/);
  assert.match(item.content, /Set V60 Pemula/);
  assert.equal(files.filter((f) => /^produk\/.+\.html$/.test(f.name)).length, 6);
  const cols = designs.flatMap((d) => collectionsIn(normalizePageDoc(d.state).root).map((r) => r.col));
  const out = withCrud("express", files, cols, "Kopi Senja");
  const names = out.map((f) => f.name);
  assert.ok(!names.some((n) => /^public\/produk\//.test(n)));
  const server = out.find((f) => f.name === "server.js").content;
  assert.match(server, /app\.get\("\/produk\/:slug"/);
  assert.match(server, /\/api\/produk\/:slug\/related/);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "item-"));
  for (const f of out.filter((f) => f.name.endsWith(".js"))) {
    const p = path.join(dir, f.name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, f.content);
    execFileSync(process.execPath, ["--check", p]);
  }
  const routes = out.find((f) => f.name === "src/routes/produk.js").content;
  assert.match(routes, /detail-produk\.html/);
});

test("kategori: kolom data, tampil per kategori + urutan, data lama mendapat kolom Kategori", async () => {
  const { categoriesOf, setCollectionView, sanitizeCollection, viewItems } = await import("../helpers/collections");
  const h = home().root;
  const ref = collectionsIn(h)[0];
  const col = ref.col;
  assert.ok(col.fields.some((f) => f.key === "category" && f.type === "category"));
  assert.deepEqual(categoriesOf(col), ["Biji kopi", "Alat seduh", "Camilan"]);
  // Cards carry data-category.
  const body = compose(h, { rootClass: "p", icons }).html.body;
  assert.match(body, /data-category="Biji kopi"/);
  // Only "Brewing tools", cheapest first.
  let root = setCollectionView(h, ref.boxId, { category: "alat seduh", sort: "price_asc" });
  const box = findNode(root, ref.boxId);
  assert.deepEqual(cardsOf(box).map((c) => c.state.name), ["Mug Keramik Senja", "Tumbler Termos 500 ml", "Set V60 Pemula"]);
  const html = compose(root, { rootClass: "p", icons }).html.body;
  assert.match(html, /data-view-category="alat seduh"/);
  assert.match(html, /data-sort="price_asc"/);
  root = setCollectionView(root, ref.boxId, { category: "", sort: "manual" });
  assert.equal(findNode(root, ref.boxId).collection.view, undefined);
  assert.equal(cardsOf(findNode(root, ref.boxId)).length, 6);
  assert.deepEqual(viewItems({ ...col, view: { sort: "rating_desc" } }).map((it) => it.values.rating)[0], 4.9);
  // Old data without a category column → added after Label; invalid views are dropped.
  const old = { ...col, fields: col.fields.filter((f) => f.key !== "category"), view: { category: "  Camilan ", sort: "zzz" } };
  const clean = sanitizeCollection(JSON.parse(JSON.stringify(old)), (n) => n);
  const keys = clean.fields.map((f) => f.key);
  assert.equal(keys[keys.indexOf("label") + 1], "category");
  assert.deepEqual(clean.view, { category: "Camilan" });
});

test("chip filter kategori: template terhubung, chip mengikuti data, skrip statis + Express", async () => {
  const { filterBarsIn, syncFilterBars, markFilterBar, unmarkFilterBar, canBeFilterBar, FILTER_JS } = await import("../helpers/categoryFilter");
  const { updateItem } = await import("../helpers/collections");
  const h = home().root;
  const [bar] = filterBarsIn(h);
  assert.ok(bar, "grup chip di beranda");
  const col = collectionsIn(h)[0].col;
  assert.equal(bar.filterOf, col.slug);
  assert.deepEqual(bar.children.map((c) => c.chip), ["", "Biji kopi", "Alat seduh", "Camilan"]);
  const comp = compose(h, { rootClass: "p", icons });
  assert.match(comp.html.body, new RegExp(`data-filter="${col.slug}"`));
  assert.match(comp.html.body, /data-chip="" aria-pressed="true"|aria-pressed="true"[^>]*data-chip=""/);
  assert.ok(comp.html.script.includes("owd-category-filter"));
  // Design canvas: scripts are not run.
  assert.ok(!compose(h, { rootClass: "p", icons, preview: true }).html.script.includes("owd-category-filter"));
  // A new category in the data → a new chip (normal chip style), old chip ids stay.
  const first = col.items[0];
  const next = updateItem(col, first.id, { ...first.values, category: "Merchandise" });
  const synced = filterBarsIn(syncFilterBars(h, [next]))[0];
  assert.deepEqual(synced.children.map((c) => c.chip), ["", "Merchandise", "Biji kopi", "Alat seduh", "Camilan"]);
  assert.equal(synced.children[2].id, bar.children[1].id);
  assert.equal(synced.children[1].state.text, "Merchandise");
  assert.equal(synced.children[1].state.bgColor, bar.children[1].state.bgColor);
  // Unmark, then mark again.
  let root = unmarkFilterBar(h, bar.id);
  assert.equal(filterBarsIn(root).length, 0);
  assert.ok(canBeFilterBar(findNode(root, bar.id)));
  root = markFilterBar(root, bar.id, col);
  assert.equal(filterBarsIn(root)[0].children.length, 4);
  // Reloaded: filterOf, chips, itemCategory persist.
  const again = normalizePageDoc(JSON.parse(JSON.stringify({ version: 2, root: h })));
  assert.equal(filterBarsIn(again.root)[0].filterOf, col.slug);
  assert.match(compose(again.root, { rootClass: "p", icons }).html.body, /data-category="Camilan"/);
  // The static script filters cards; it stops when collections.js (backend) is active.
  assert.match(FILTER_JS, /window\.OWD_COLLECTIONS/);
  // Express: category column, filter & sort in the API, category route before :slug.
  const out = withCrud("express", [{ name: "index.html", content: `<html><head></head><body>${comp.html.body}</body></html>` }], [col], "Kopi Senja");
  const model = out.find((f) => f.name === `src/collections/${col.slug}.js`).content;
  assert.match(model, /HAS_CATEGORY = true/);
  assert.match(model, /export const SORTS/);
  assert.match(model, /export function categories\(\)/);
  const server = out.find((f) => f.name === "server.js").content;
  assert.ok(server.indexOf(`/api/${col.slug}/kategori`) > 0 && server.indexOf(`/api/${col.slug}/kategori`) < server.indexOf(`/api/${col.slug}/:slug`));
  const script = out.find((f) => f.name === "public/assets/collections.js").content;
  assert.match(script, /window\.OWD_COLLECTIONS = true/);
  assert.match(script, /kategori=/);
  const db = out.find((f) => f.name === "src/db.js").content;
  assert.match(db, /category TEXT/);
  assert.match(db, /ensureColumns/);
  const seed = JSON.parse(out.find((f) => f.name === `src/seed/${col.slug}.json`).content);
  assert.equal(seed[0].category, "Biji kopi");
});

test("Express db.js: database lama (tanpa slug & kategori) dimigrasi tanpa galat", async () => {
  const col = collectionsIn(home().root)[0].col;
  const out = withCrud("express", [{ name: "index.html", content: "<html><head></head><body></body></html>" }], [col], "Kopi Senja");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "db-"));
  for (const f of out.filter((f) => f.name.endsWith(".js") || f.name.endsWith(".json"))) {
    const p = path.join(dir, f.name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, f.content);
  }
  fs.mkdirSync(path.join(dir, "data"));
  const run = (code) => execFileSync(process.execPath, ["--no-warnings", "--input-type=module", "-e", code], { cwd: dir, encoding: "utf8" });
  // Old-version table: no slug and category columns; one name "Kategori" (fallback slug).
  run(`import { DatabaseSync } from "node:sqlite";
const d = new DatabaseSync("data/app.db");
d.exec("CREATE TABLE produk (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price INTEGER NOT NULL, compare_price INTEGER, rating REAL NOT NULL DEFAULT 0, reviews INTEGER NOT NULL DEFAULT 0, description TEXT, label TEXT, image TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))");
d.exec("INSERT INTO produk (name, price) VALUES ('Kopi A', 1000), ('Kopi A', 2000), ('Kategori', 3000)");`);
  const res = JSON.parse(run(`import { db } from "./src/db.js";
const M = await import("./src/collections/${col.slug}.js");
const rows = db.prepare("SELECT slug, category FROM produk ORDER BY id").all();
const v = M.validate({ name: "Baru", price: "5000", slug: "kategori" });
console.log(JSON.stringify({ rows: rows.map((r) => r.slug), cats: M.categories(), err: v.errors.slug || null }));`));
  assert.deepEqual(res.rows, ["kopi-a", "kopi-a-2", "kategori-2"]);
  assert.deepEqual(res.cats, []);
  assert.ok(res.err);
  // A new database (seed) works too.
  fs.rmSync(path.join(dir, "data"), { recursive: true });
  fs.mkdirSync(path.join(dir, "data"));
  const fresh = JSON.parse(run(`import { db } from "./src/db.js";
console.log(JSON.stringify(db.prepare("SELECT COUNT(*) AS n FROM produk WHERE slug != ''").get()));`));
  assert.equal(fresh.n, 6);
});
