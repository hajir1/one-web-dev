// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { isBox, isElement } from "../../pageMaker/engine/helpers/componentTypes";
import { collectElements, walk } from "../../pageMaker/engine/helpers/tree";
import { normalizePageDoc, isSection } from "../../pageMaker/helpers/pageDoc";
import { isRow } from "../../pageMaker/helpers/rowModel";
import { buildSite } from "../../pageMaker/helpers/siteExport";
import { PAGE_DESIGN_TYPE, SITE_TYPE, normalizeSiteDoc } from "../../pageMaker/helpers/site";
import { useDesignStore } from "../../pageMaker/core/store/designStore";
import { designRoom, ensureDesignRoom, useDesignLimit } from "../../pageMaker/helpers/designQuota";
import { designCapacity, MAX_DESIGNS, FREE_SITES, canCreateFreeSite } from "../../../config/quota";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../pageMaker/core/elementDefinitions";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate, templateSite } from "../registry";
import { templateFiles, externalizeAssets } from "../exportTemplate";
import { asset, assetNameOf, ASSET_NAMES } from "../assets";
import { createSiteFromTemplate, sitesFromTemplate, uniqueSiteName } from "../createFromTemplate";
import { TEMPLATE_CATALOG, TEMPLATE_CATEGORIES } from "../../../config/templates";
import { isValidPrice } from "../../../config/marketplace";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { isPremiumPreset } from "../../pageMaker/helpers/sectionPresets";
import { V6G_CATALOG } from "../templates/v6/catalogG";
import { V7H_CATALOG } from "../templates/v7/catalogH";
import { V9I_CATALOG } from "../templates/v9/catalogI";
import { V10J_CATALOG } from "../templates/v10/catalogJ";

const icons = makeIconLookup([]);
const LANGS = ["id", "en"];

test("katalog: 150 template lama + set G + set H (v7) + set I (v9) — Free & Premium, kategori beragam, harga sesuai aturan", () => {
  const total = 150 + V6G_CATALOG.length + V7H_CATALOG.length + V9I_CATALOG.length + V10J_CATALOG.length;
  const gFree = [...V6G_CATALOG, ...V7H_CATALOG].filter((m) => m.tier === "free").map((m) => m.id);
  assert.equal(WEB_TEMPLATES.length, total);
  assert.equal(TEMPLATE_CATALOG.length, total);
  const free = WEB_TEMPLATES.filter((t) => t.tier === "free");
  assert.deepEqual(free.map((t) => t.id).sort(), ["bakery-roti-hangat", "blog-catatan-kuliner", "blog-journal", "cafe-kopi-senja", "catering-dapur-rasa", "company-starter", "coworking-ruang-temu", "personal-resume", "portfolio-minimal", "shop-starter", ...gFree].sort());
  assert.equal(WEB_TEMPLATES.filter((t) => t.tier === "premium").length, total - 10 - gFree.length);
  for (const t of WEB_TEMPLATES) {
    assert.ok(isValidPrice("template", t.tier, t.price), `${t.id}: harga ${t.price}`);
    assert.ok(TEMPLATE_CATEGORIES.includes(t.category), `${t.id}: kategori`);
  }
  assert.ok(new Set(WEB_TEMPLATES.map((t) => t.category)).size >= 56, "kategori beragam");
  assert.equal(new Set(WEB_TEMPLATES.map((t) => t.id)).size, total);
  assert.equal(getTemplate("nope"), null);
});

test("struktur: setiap halaman valid (Section → Row → isi), tanpa Row bersarang, tahan normalisasi", () => {
  for (const tpl of WEB_TEMPLATES)
    for (const lang of LANGS)
      for (const p of buildTemplatePages(tpl, lang)) {
        const root = p.doc.root;
        assert.ok(root.children.length >= 3, `${tpl.id}/${p.key}: minimal header, isi, footer`);
        for (const sec of root.children) {
          assert.ok(isSection(sec), `${tpl.id}/${p.key}: anak root harus section`);
          for (const row of sec.children) {
            assert.ok(isRow(row), `${tpl.id}/${p.key}: anak section harus Row`);
            walk(row, (n) => {
              if (n !== row) assert.ok(!(isBox(n) && (n.row || n.section)), `${tpl.id}/${p.key}: Row/section bersarang`);
            });
          }
        }
        // Normalisasi Page Maker (dipakai saat desain dibuka) tidak mengubah jumlah elemen.
        const norm = normalizePageDoc(JSON.parse(JSON.stringify(p.doc)));
        assert.equal(collectElements(norm.root).length, collectElements(root).length, `${tpl.id}/${p.key}`);
      }
});

test("template Free hanya memakai item gratis; elemen Premium template Premium tercatat sebagai item bawaan", () => {
  for (const tpl of WEB_TEMPLATES) {
    const premiumUsed = new Set();
    for (const p of buildTemplatePages(tpl, "id"))
      for (const el of collectElements(p.doc.root)) {
        const def = ELEMENT_DEFINITION_BY_TYPE[el.elementType];
        assert.ok(def, el.elementType);
        if (def.premium) premiumUsed.add(`element:${el.elementType}`);
      }
    if (tpl.tier === "free") assert.equal(premiumUsed.size, 0, `${tpl.id}: template gratis tidak boleh memakai elemen premium`);
    const { elementIds, sectionIds } = templateContents(tpl);
    for (const id of premiumUsed) assert.ok(elementIds.includes(id), `${tpl.id}: ${id}`);
    // Setiap halaman desain mencatat template asalnya.
    for (const p of buildTemplatePages(tpl, "en")) assert.deepEqual(p.doc.source, { templateId: tpl.id, version: tpl.version });
    if (tpl.tier === "free") for (const id of sectionIds) assert.ok(!isPremiumPreset(id.replace("preset:", "")), `${tpl.id}: ${id} premium`);
  }
});

test("pratinjau/ekspor: semua halaman ter-compose tanpa peringatan di ID & EN", () => {
  for (const tpl of WEB_TEMPLATES)
    for (const lang of LANGS) {
      const { site, designs } = templateSite(tpl, lang, tpl.content.brand);
      // Pratinjau katalog menampilkan template utuh; tanpa izin, elemen Premium hanya ada di template Premium.
      const built = buildSite(site, designs, { icons, allowPremiumElements: true });
      assert.deepEqual(built.warnings, [], `${tpl.id}/${lang}`);
      const locked = buildSite(site, designs, { icons });
      if (tpl.tier === "free") assert.deepEqual(locked.warnings, [], `${tpl.id}/${lang}: gratis tanpa kredit`);
      assert.equal(built.pages.length, tpl.content.pages.length);
      assert.ok(built.home, "ada homepage");
      for (const p of built.pages) assert.ok(p.composed.html.body.length > 500);
    }
});

test("template benar-benar berbeda satu sama lain", () => {
  const homes = WEB_TEMPLATES.map((tpl) => {
    const { site, designs } = templateSite(tpl, "id", tpl.content.brand);
    return buildSite(site, designs, { icons, allowPremiumElements: true }).home.composed.html.body.replace(/\s+/g, " ");
  });
  for (let i = 0; i < homes.length; i++) for (let j = i + 1; j < homes.length; j++) assert.notEqual(homes[i], homes[j]);
  const brands = new Set(WEB_TEMPLATES.map((t) => t.content.brand));
  assert.equal(brands.size, WEB_TEMPLATES.length);
  // Tipografi berbeda: font root template Pro bervariasi.
  const fonts = new Set(WEB_TEMPLATES.map((tpl) => buildTemplatePages(tpl, "id")[0].doc.root.advanced?.customCss?.match(/font-family: ([^;]+)/)?.[1] ?? "default"));
  assert.ok(fonts.size >= 5, `font: ${fonts.size}`);
});

test("toko online: katalog berharga, detail produk, CTA ke halaman detail — tanpa transaksi", () => {
  for (const tpl of WEB_TEMPLATES.filter((t) => t.category === "shop")) {
    const pages = buildTemplatePages(tpl, "id");
    const detail = pages.find((p) => p.key === "product");
    assert.ok(detail, `${tpl.id}: halaman detail produk`);
    const home = pages.find((p) => p.home);
    const cards = pages.flatMap((p) => collectElements(p.doc.root)).filter((e) => e.elementType === "product-card");
    assert.ok(cards.length >= 6, `${tpl.id}: katalog`);
    for (const c of cards) {
      assert.match(c.state.priceText, /^Rp[\d.]+$/);
      // Kartu koleksi dengan halaman item → produk/<slug>.html (uji coba CRUD).
      assert.ok(c.state.ctaHref === `${detail.slug}.html` || /^produk\/[a-z0-9-]+\.html$/.test(c.state.ctaHref), c.state.ctaHref);
    }
    // Tidak ada form yang mengirim ke server pembayaran / tidak ada script.
    const { site, designs } = templateSite(tpl, "id", tpl.content.brand);
    for (const p of buildSite(site, designs, { icons }).pages) {
      // Satu-satunya skrip yang boleh: chip filter kategori (uji coba CRUD).
      assert.equal(p.composed.html.script.replace(/\/\* owd-category-filter \*\/[\s\S]*\}\)\(\);/, "").trim(), "");
      assert.doesNotMatch(p.composed.html.body, /<form[^>]+action=/);
    }
    assert.ok(home);
  }
});

test("unduhan: HTML per halaman + CSS + aset SVG + README; tautan antarhalaman valid; tanpa data URI", () => {
  for (const tpl of WEB_TEMPLATES)
    for (const lang of LANGS) {
      const { files, assets } = templateFiles(tpl, lang, tpl.content.brand, buildTemplatePages(tpl, lang), { icons, allowPremiumElements: true });
      const names = new Set(files.map((f) => f.name));
      assert.ok(names.has("index.html"));
      assert.ok(names.has("README.md"));
      assert.ok(assets.length >= 2, `${tpl.id}: aset gambar`);
      for (const a of assets) assert.ok(names.has(`assets/img/${a}.svg`));
      for (const f of files) {
        assert.doesNotMatch(f.content, /data:image\/svg\+xml;base64/, `${tpl.id}/${f.name}`);
        if (!f.name.endsWith(".html")) continue;
        assert.match(f.content, new RegExp(`<html lang="${lang}">`));
        // Halaman item (produk/<slug>.html) memakai <base href="../">: tautan dihitung dari akar.
        for (const m of f.content.replace(/<base [^>]*>/, "").matchAll(/(?:href|src)="([^"#:]+)"/g)) {
          const target = m[1];
          assert.ok(names.has(target), `${tpl.id}/${lang}/${f.name}: tautan rusak ${target}`);
        }
      }
      const readme = files.find((f) => f.name === "README.md").content;
      assert.match(readme, /index\.html/);
      assert.match(readme, lang === "id" ? /tidak.{0,6} memproses/ : /do \*\*not\*\* process/);
    }
});

test("aset: data URI ↔ nama berkas; gambar pengguna tidak diubah", () => {
  for (const n of ASSET_NAMES) assert.equal(assetNameOf(asset(n)), n);
  const user = "data:image/svg+xml;base64,PHN2Zy8+";
  const { files, assets } = externalizeAssets([{ name: "a.html", content: `<img src="${user}"><img src="${asset("team-1")}">` }]);
  assert.deepEqual(assets, ["team-1"]);
  assert.match(files[0].content, new RegExp(user.replace(/[+/]/g, "\\$&")));
  assert.match(files[0].content, /assets\/img\/team-1\.svg/);
  const css = externalizeAssets([{ name: "assets/x.css", content: `url(${asset("team-2")})` }]);
  assert.match(css.files[0].content, /url\(img\/team-2\.svg\)/);
});

test("kuota desain: maks. 10, pesan berapa yang harus dihapus, tidak ada hapus otomatis", () => {
  assert.equal(MAX_DESIGNS, 10);
  assert.deepEqual(designCapacity(10, 1), { ok: false, current: 10, adding: 1, max: 10, free: 0, mustDelete: 1 });
  assert.equal(designCapacity(7, 3).ok, true);
  assert.equal(designCapacity(8, 4).mustDelete, 2);
  assert.equal(FREE_SITES, 2);
  assert.equal(canCreateFreeSite(1), true);
  assert.equal(canCreateFreeSite(2), false);
  assert.equal(canCreateFreeSite(2, 1), true);

  const full = Array.from({ length: 9 }, (_, i) => ({ id: `d${i}`, name: `D${i}`, state: {}, updatedAt: i }));
  useDesignStore.setState({ designs: { [PAGE_DESIGN_TYPE]: full } });
  assert.equal(designRoom(1).ok, true);
  assert.equal(ensureDesignRoom(1, "save"), true);
  assert.equal(useDesignLimit.getState().request, null);
  assert.equal(ensureDesignRoom(4, "template", { label: "X" }), false);
  assert.deepEqual(
    { adding: useDesignLimit.getState().request.adding, reason: useDesignLimit.getState().request.reason },
    { adding: 4, reason: "template" },
  );
  assert.equal(useDesignStore.getState().designs[PAGE_DESIGN_TYPE].length, 9, "tidak ada desain yang dihapus");
  useDesignLimit.getState().close();
});

test("edit template: salinan baru (folder + desain), template asli tidak berubah, terdeteksi untuk cegah duplikasi", () => {
  useDesignStore.setState({ designs: {} });
  const tpl = getTemplate("shop-boutique");
  const before = JSON.stringify(buildTemplatePages(tpl, "id").map((p) => [p.key, p.slug, collectElements(p.doc.root).length]));

  const a = createSiteFromTemplate(tpl, buildTemplatePages(tpl, "id"), tpl.content.brand);
  const st = useDesignStore.getState().designs;
  assert.equal(st[PAGE_DESIGN_TYPE].length, tpl.content.pages.length);
  assert.equal(st[SITE_TYPE].length, 1);
  const doc = normalizeSiteDoc(st[SITE_TYPE][0].state);
  assert.deepEqual(doc.source, { templateId: "shop-boutique", version: tpl.version });
  assert.equal(doc.homepageId, a.homeDesignId);
  assert.deepEqual(doc.pages.map((p) => p.slug), ["beranda", "katalog", "detail-produk", "kontak"]);
  assert.equal(sitesFromTemplate("shop-boutique").length, 1);
  assert.equal(sitesFromTemplate("company-agency").length, 0);

  // Salinan kedua: nama folder unik, ID desain baru (tidak menimpa salinan pertama).
  const b = createSiteFromTemplate(tpl, buildTemplatePages(tpl, "id"), tpl.content.brand);
  assert.notEqual(a.siteId, b.siteId);
  assert.equal(new Set([...a.designIds, ...b.designIds]).size, a.designIds.length * 2);
  assert.deepEqual(useDesignStore.getState().designs[SITE_TYPE].map((s) => s.name).sort(), ["Moda Rupa", "Moda Rupa (2)"]);
  assert.equal(uniqueSiteName("Moda Rupa"), "Moda Rupa (3)");

  // Mengedit salinan tidak memengaruhi template.
  const copy = useDesignStore.getState().designs[PAGE_DESIGN_TYPE][0];
  copy.state.root.children = [];
  const after = JSON.stringify(buildTemplatePages(tpl, "id").map((p) => [p.key, p.slug, collectElements(p.doc.root).length]));
  assert.equal(after, before);
  useDesignStore.setState({ designs: {} });
});

test("Product Card: elemen gratis baru, harga & rating di markup, tanpa script", () => {
  const def = ELEMENT_DEFINITION_BY_TYPE["product-card"];
  assert.ok(def && !def.premium);
  const spec = def.spec({ ...def.defaults, priceText: "Rp10.000", comparePriceText: "Rp12.000", ctaHref: "detail.html" }, "pc", icons);
  const html = JSON.stringify(spec.markup);
  assert.match(html, /Rp10\.000/);
  assert.match(html, /Rp12\.000/);
  assert.match(html, /detail\.html/);
  assert.match(spec.css, /text-decoration: line-through/);
  assert.ok(isElement({ kind: "element" }));
});

test("uji coba CRUD: semua template berkatalog Product Card punya koleksi data; Express valid", async () => {
  const { collectionsIn } = await import("../../pageMaker/helpers/collections");
  const { itemBoxIn } = await import("../../pageMaker/helpers/itemPage");
  const { withCrud } = await import("../../pageMaker/helpers/crud");
  const { execFileSync } = await import("node:child_process");
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tplcrud-"));
  let withCol = 0;
  let items = 0;
  for (const tpl of WEB_TEMPLATES) {
    const pages = buildTemplatePages(tpl, "id");
    const hasCards = pages.some((p) => collectElements(p.doc.root).some((e) => e.elementType === "product-card"));
    const cols = pages.flatMap((p) => collectionsIn(p.doc.root).map((r) => r.col));
    if (!hasCards) assert.equal(cols.length, 0, tpl.id);
    if (!cols.length) continue;
    assert.equal(cols.length, 1, `${tpl.id}: satu koleksi`);
    withCol++;
    const col = cols[0];
    assert.ok(col.items.length >= 2 && col.items.every((it) => it.slug), tpl.id);
    const itemPage = pages.find((p) => itemBoxIn(p.doc.root));
    if (col.itemPage) {
      items++;
      assert.ok(itemPage, `${tpl.id}: halaman item`);
      const binds = collectElements(itemBoxIn(itemPage.doc.root)).map((e) => e.bind);
      assert.ok(binds.includes("name") && binds.includes("price"), `${tpl.id}: ${binds}`);
    }
    // Dimuat ulang: koleksi tetap ada.
    assert.equal(collectionsIn(normalizePageDoc(JSON.parse(JSON.stringify(pages.find((p) => collectionsIn(p.doc.root).length).doc))).root).length, 1, tpl.id);
    const { site, designs } = templateSite(tpl, "id", tpl.content.brand);
    const files = buildSite(site, designs, { icons, allowPremiumElements: true, allowPremiumEvents: true }).files("html");
    if (col.itemPage) assert.equal(files.filter((f) => f.name.startsWith(`${col.slug}/`)).length, col.items.length, tpl.id);
    const out = withCrud("express", files, cols, tpl.content.brand);
    const sub = path.join(dir, tpl.id);
    for (const f of out.filter((f) => f.name.endsWith(".js"))) {
      const p = path.join(sub, f.name);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, f.content);
      execFileSync(process.execPath, ["--check", p]);
    }
  }
  assert.ok(withCol >= 80, `koleksi: ${withCol}`);
  assert.ok(items >= 6, `halaman item: ${items}`);
});
