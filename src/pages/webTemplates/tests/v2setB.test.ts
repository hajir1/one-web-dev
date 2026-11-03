import test from "node:test";
import assert from "node:assert/strict";
import { collectElements } from "../../pageMaker/engine/helpers/tree";
import { isSection } from "../../pageMaker/helpers/pageDoc";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../pageMaker/core/elementDefinitions";
import { isPremiumPreset } from "../../pageMaker/helpers/sectionPresets";
import { V2B_CATALOG } from "../templates/v2/catalogB";
import { V2B_TEMPLATES } from "../templates/v2/setB";
import { WEB_TEMPLATES, buildTemplatePages, type WebTemplate } from "../registry";
import { TEMPLATE_CATEGORIES } from "../../../config/templates";
import { isValidPrice, TEMPLATE_PRICE } from "../../../config/marketplace";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { ASSET_NAMES } from "../assets";

/* Katalog v2 bagian B: 25 template (1 Free + 24 Premium), 4–10 halaman. */

const IDS = [
  "personal-resume",
  "fitness-yoga",
  "beauty-barbershop",
  "automotive-dealer",
  "finance-accounting",
  "nonprofit-foundation-edu",
  "wedding-organizer",
  "music-school",
  "construction-interior",
  "hospitality-villa",
  "kids-toystore",
  "pets-shop",
  "agri-coffee-farm",
  "logistics-cargo",
  "gaming-esports-team",
  "architecture-landscape",
  "news-magazine",
  "startup-fintech",
  "shop-furniture",
  "education-language",
  "health-pharmacy",
  "photography-wedding-film",
  "tech-cybersecurity",
  "professional-notary",
  "community-coworking",
];

const LANGS = ["id", "en"] as const;
const setB = () => WEB_TEMPLATES.filter((t) => IDS.includes(t.id));

/** Item Premium (section preset & elemen) yang dipakai template. */
function premiumItems(tpl: WebTemplate): string[] {
  const { sectionIds, elementIds } = templateContents(tpl);
  return [
    ...sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))),
    ...elementIds.filter((id) => ELEMENT_DEFINITION_BY_TYPE[id.replace("element:", "")]?.premium),
  ];
}

test("v2 set B: 25 template berurutan, konten & metadata cocok, terdaftar di registry", () => {
  assert.equal(V2B_CATALOG.length, 25);
  assert.deepEqual(V2B_CATALOG.map((m) => m.id), IDS);
  assert.deepEqual(Object.keys(V2B_TEMPLATES).sort(), [...IDS].sort());
  assert.equal(setB().length, 25, "semua template set B muncul di WEB_TEMPLATES");
  for (const m of V2B_CATALOG) {
    // Premium naik ke v2 karena kini memakai library (templates/libraryPlan.ts).
    assert.equal(m.version, m.tier === "premium" ? 2 : 1, m.id);
    assert.equal(m.isNew, true, m.id);
    assert.ok(TEMPLATE_CATEGORIES.includes(m.category), `${m.id}: kategori ${m.category}`);
    assert.match(m.accent, /^#[0-9a-f]{6}$/i, m.id);
    assert.equal(m.tags.length, 3, `${m.id}: 3 kata kunci`);
  }
});

test("v2 set B: tepat 1 Free (personal-resume), harga valid", () => {
  const free = V2B_CATALOG.filter((m) => m.tier === "free");
  assert.deepEqual(free.map((m) => m.id), ["personal-resume"]);
  assert.equal(free[0].price, TEMPLATE_PRICE.free);
  for (const m of V2B_CATALOG) {
    assert.ok(isValidPrice("template", m.tier, m.price), `${m.id}: harga ${m.price}`);
    if (m.tier === "premium") assert.ok(m.price >= TEMPLATE_PRICE.premiumMin && m.price <= TEMPLATE_PRICE.premiumMax && Number.isInteger(m.price), m.id);
  }
});

test("v2 set B: 4–10 halaman, key & slug unik, satu homepage, ≥4 variasi jumlah halaman", () => {
  const counts = new Set<number>();
  for (const id of IDS) {
    const c = V2B_TEMPLATES[id];
    const n = c.pages.length;
    counts.add(n);
    assert.ok(n >= 4 && n <= 10, `${id}: ${n} halaman`);
    assert.equal(new Set(c.pages.map((p) => p.key)).size, n, `${id}: key unik`);
    for (const lang of LANGS) {
      assert.equal(new Set(c.pages.map((p) => p.slug[lang])).size, n, `${id}/${lang}: slug unik`);
      for (const p of c.pages) assert.match(p.slug[lang], /^[a-z0-9-]+$/, `${id}/${lang}: slug ${p.slug[lang]}`);
    }
    assert.equal(c.pages.filter((p) => p.home).length, 1, `${id}: satu homepage`);
  }
  assert.ok(counts.size >= 4, `variasi jumlah halaman: ${[...counts].join(", ")}`);
});

test("v2 set B: setiap halaman dibangun di ID & EN, berbeda antarbahasa, dan antarhalaman", () => {
  for (const tpl of setB()) {
    const bodies: Record<string, string> = {};
    for (const lang of LANGS) {
      const pages = buildTemplatePages(tpl, lang);
      assert.equal(pages.length, tpl.content.pages.length);
      const sigs = new Set<string>();
      for (const p of pages) {
        const root = p.doc.root;
        assert.ok(root.children.length >= 3, `${tpl.id}/${p.key}: header + isi + footer`);
        for (const s of root.children) assert.ok(isSection(s), `${tpl.id}/${p.key}`);
        assert.equal(root.children[0].tag, "header", `${tpl.id}/${p.key}: header`);
        assert.equal(root.children.at(-1).tag, "footer", `${tpl.id}/${p.key}: footer`);
        const els = collectElements(root);
        assert.ok(els.some((e) => e.elementType === "menu" || e.elementType === "mega-menu"), `${tpl.id}/${p.key}: navigasi`);
        const texts = els.filter((e) => e.elementType === "text").map((e) => e.state.text);
        sigs.add(root.children.slice(1, -1).map((s) => s.name).join("|") + "#" + texts.slice(0, 6).join("|"));
        bodies[`${lang}:${p.key}`] = JSON.stringify(texts);
      }
      assert.equal(sigs.size, pages.length, `${tpl.id}/${lang}: setiap halaman punya desain/isi sendiri`);
    }
    for (const p of tpl.content.pages) assert.notEqual(bodies[`id:${p.key}`], bodies[`en:${p.key}`], `${tpl.id}/${p.key}: teks ID ≠ EN`);
  }
});

test("v2 set B: Premium berisi ≥1 item Premium (bervariasi); Free tanpa item Premium", () => {
  const used = new Set<string>();
  for (const tpl of setB()) {
    const items = premiumItems(tpl);
    if (tpl.tier === "free") assert.deepEqual(items, [], `${tpl.id}: template gratis tidak boleh berisi item premium`);
    else assert.ok(items.length >= 1, `${tpl.id}: minimal 1 item premium`);
    items.forEach((i) => used.add(i));
  }
  assert.ok(used.size >= 10, `variasi item premium: ${used.size}`);
});

test("v2 set B: merek unik, identitas visual beragam, aset v2b- terdaftar", () => {
  const all = WEB_TEMPLATES.map((t) => t.content.brand);
  for (const id of IDS) {
    const b = V2B_TEMPLATES[id].brand;
    assert.equal(all.filter((x) => x === b).length, 1, `${id}: merek ${b} unik di katalog`);
  }
  // Tipografi: pasangan font teks (root) + font judul H1 bervariasi.
  const typo = new Set(
    setB().map((t) => {
      const root = buildTemplatePages(t, "id")[0].doc.root;
      const body = root.advanced?.customCss?.match(/font-family: ([^;]+)/)?.[1];
      const h1 = collectElements(root).find((e) => e.elementType === "text" && e.state.tag === "h1");
      return `${body} / ${h1?.advanced?.customCss?.match(/font-family: ([^;]+)/)?.[1] ?? "-"}`;
    }),
  );
  assert.ok(typo.size >= 8, `pasangan tipografi: ${typo.size}`);
  assert.ok(new Set(V2B_CATALOG.map((m) => m.accent)).size >= 20, "warna aksen beragam");
  assert.ok(ASSET_NAMES.filter((n) => n.startsWith("v2b-")).length >= 30, "aset v2b-");
});
