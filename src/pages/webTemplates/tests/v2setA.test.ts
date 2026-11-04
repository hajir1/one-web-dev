import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isSection } from "../../pageMaker/helpers/pageDoc";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../pageMaker/core/elementDefinitions";
import { isPremiumPreset } from "../../pageMaker/helpers/sectionPresets";
import { V2A_CATALOG } from "../templates/v2/catalogA";
import { V2A_TEMPLATES } from "../templates/v2/setA";
import { V2A_SOURCES } from "../templates/v2/setA/assets";
import { TEMPLATE_CATALOG, TEMPLATE_CATEGORIES } from "../../../config/templates";
import { isValidPrice } from "../../../config/marketplace";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate, type BuiltTemplatePage, type WebTemplate } from "../registry";
import type { TplLang } from "../types";

type SectionBox = { tag?: string; name: string };

/* v2 catalog part A: 25 templates (1 Free + 24 Premium), 4–10 pages. */

const LANGS: TplLang[] = ["id", "en"];
const IDS = [
  "cafe-kopi-senja",
  "fitness-gym-pulse",
  "beauty-salon-ayu",
  "automotive-bengkel",
  "finance-dana",
  "nonprofit-peduli",
  "wedding-janji",
  "music-band-nada",
  "construction-bangun",
  "hotel-resort-pantai",
  "kids-preschool",
  "pets-vet-sahabat",
  "agri-tani",
  "logistics-kirim",
  "gaming-arena",
  "architecture-ruang",
  "news-warta",
  "saas-crm-relasi",
  "shop-skincare",
  "education-university",
  "health-dental",
  "travel-umrah",
  "event-music-fest",
  "agency-marketing",
  "company-manufaktur",
];

const templates = (): WebTemplate[] => V2A_CATALOG.map((m) => getTemplate(m.id) as WebTemplate);

/** Premium items (section presets & elements) used by the template. */
function premiumItems(tpl: WebTemplate): string[] {
  const { sectionIds, elementIds } = templateContents(tpl);
  return [
    ...sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))),
    ...elementIds.filter((id: string) => ELEMENT_DEFINITION_BY_TYPE[id.replace("element:", "")]?.premium),
  ];
}

test("katalog A: 25 template berurutan, terdaftar, 1 Free + 24 Premium, harga valid", () => {
  assert.equal(V2A_CATALOG.length, 25);
  assert.deepEqual(V2A_CATALOG.map((m) => m.id), IDS);
  assert.deepEqual(Object.keys(V2A_TEMPLATES).sort(), [...IDS].sort());
  const free = V2A_CATALOG.filter((m) => m.tier === "free");
  assert.deepEqual(free.map((m) => m.id), ["cafe-kopi-senja"]);
  assert.equal(V2A_CATALOG.filter((m) => m.tier === "premium").length, 24);
  for (const m of V2A_CATALOG) {
    assert.ok(isValidPrice("template", m.tier, m.price), `${m.id}: harga ${m.price}`);
    assert.ok(TEMPLATE_CATEGORIES.includes(m.category), `${m.id}: kategori ${m.category}`);
    // Premium moved up to v2 because it now uses libraries (templates/libraryPlan.ts).
    assert.equal(m.version, m.tier === "premium" ? 2 : 1);
    assert.equal(m.isNew, true);
    assert.equal(m.tags.length, 3);
    assert.match(m.accent, /^#[0-9a-f]{6}$/i);
    assert.ok(TEMPLATE_CATALOG.some((c) => c.id === m.id), `${m.id}: masuk TEMPLATE_CATALOG`);
    assert.ok(WEB_TEMPLATES.some((t) => t.id === m.id), `${m.id}: punya konten`);
  }
  // Premium: the price rises with the page count (a 10-page template costs more than a 5-page one).
  const price = (id: string) => V2A_CATALOG.find((m) => m.id === id)?.price ?? 0;
  assert.ok(price("saas-crm-relasi") > price("automotive-bengkel"));
  assert.ok(price("company-manufaktur") > price("agri-tani"));
});

test("halaman: 4–10 per template, kunci & slug unik, satu homepage, ≥4 variasi jumlah halaman", () => {
  const counts = new Set<number>();
  for (const tpl of templates()) {
    const pages = tpl.content.pages;
    assert.ok(pages.length >= 4 && pages.length <= 10, `${tpl.id}: ${pages.length} halaman`);
    counts.add(pages.length);
    assert.equal(new Set(pages.map((p) => p.key)).size, pages.length, `${tpl.id}: kunci unik`);
    for (const lang of LANGS) {
      const slugs = pages.map((p) => p.slug[lang]);
      assert.equal(new Set(slugs).size, pages.length, `${tpl.id}/${lang}: slug unik`);
      for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/, `${tpl.id}/${lang}: slug ${s}`);
      for (const p of pages) assert.ok(p.name[lang], `${tpl.id}/${p.key}: nama ${lang}`);
    }
    assert.equal(pages.filter((p) => p.home).length, 1, `${tpl.id}: satu homepage`);
  }
  assert.ok(counts.size >= 4, `variasi jumlah halaman: ${[...counts].join(", ")}`);
  assert.ok([...counts].some((n) => n >= 8), "ada template 8–10 halaman");
  assert.equal(templates().find((t) => t.id === "cafe-kopi-senja")?.content.pages.length, 4);
});

test("setiap halaman dibangun di ID & EN: section saja di root, header + isi + footer, bahasa berbeda", () => {
  for (const tpl of templates()) {
    const byLang = {} as Record<TplLang, BuiltTemplatePage[]>;
    for (const lang of LANGS) {
      const built = buildTemplatePages(tpl, lang);
      assert.equal(built.length, tpl.content.pages.length);
      byLang[lang] = built;
      for (const p of built) {
        const kids = p.doc.root.children as unknown as SectionBox[];
        assert.ok(kids.length >= 3, `${tpl.id}/${p.key}/${lang}: minimal 3 section`);
        assert.ok(p.doc.root.children.every(isSection), `${tpl.id}/${p.key}/${lang}: anak root = section`);
        assert.equal(kids[0].tag, "header", `${tpl.id}/${p.key}: header di atas`);
        assert.equal(kids[kids.length - 1].tag, "footer", `${tpl.id}/${p.key}: footer di bawah`);
      }
    }
    // Pages within one template are not identical to each other (different page designs).
    const shapes = byLang.id.map((p) => (p.doc.root.children as unknown as SectionBox[]).map((s) => s.name).join("|"));
    assert.equal(new Set(shapes).size, shapes.length, `${tpl.id}: susunan section tiap halaman berbeda`);
    // Content is truly bilingual.
    assert.notEqual(JSON.stringify(byLang.id.map((p) => p.name)), JSON.stringify(byLang.en.map((p) => p.name)), `${tpl.id}: nama halaman dwibahasa`);
  }
});

test("Free tanpa item Premium; setiap Premium memakai ≥1 item Premium dan pilihannya bervariasi", () => {
  const sets = new Set<string>();
  for (const tpl of templates()) {
    const items = premiumItems(tpl);
    if (tpl.tier === "free") assert.deepEqual(items, [], `${tpl.id}: template gratis memakai ${items.join(", ")}`);
    else {
      assert.ok(items.length >= 1, `${tpl.id}: tanpa item Premium`);
      sets.add(items.slice().sort().join(","));
    }
  }
  assert.ok(sets.size >= 20, `kombinasi item Premium bervariasi: ${sets.size}`);
});

test("identitas: merek unik di seluruh katalog, font & warna bervariasi", () => {
  const brands = WEB_TEMPLATES.map((t) => t.content.brand);
  assert.equal(new Set(brands).size, brands.length, "merek unik");
  const fonts = new Set<string | undefined>();
  const backgrounds = new Set<string>();
  for (const tpl of templates()) {
    const css = buildTemplatePages(tpl, "id")[0].doc.root.advanced?.customCss ?? "";
    fonts.add(css.match(/font-family: ([^;]+)/)?.[1]);
    backgrounds.add(tpl.accent);
  }
  assert.ok(fonts.size >= 5, `font: ${fonts.size}`);
  assert.ok(backgrounds.size >= 20, `aksen: ${backgrounds.size}`);
});

test("aset v2a: nama berawalan, SVG ASCII kecil tanpa URL eksternal", () => {
  const names = Object.keys(V2A_SOURCES);
  assert.ok(names.length >= 25);
  for (const n of names) {
    assert.match(n, /^v2a-/);
    const svg = V2A_SOURCES[n]();
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(/^[\x20-\x7e]*$/.test(svg), `${n}: ASCII`);
    assert.ok(svg.length < 8000, `${n}: ${svg.length} byte`);
    assert.doesNotMatch(svg.replace('xmlns="http://www.w3.org/2000/svg"', ""), /https?:/, `${n}: URL eksternal`);
  }
});

test("locale: kunci ID & EN identik, semua template & 16 kategori v2", () => {
  type Frag = { templates: { items: Record<string, { name: string; description: string }>; categories: Record<string, string> } };
  // Merged locales (src/locales) — the fragment folder is not shipped.
  const read = (lang: TplLang): Frag => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../locales/${lang}.json`, import.meta.url)), "utf8"));
  const idj = read("id");
  const enj = read("en");
  const keys = (o: object, pre = ""): string[] => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? keys(v, `${pre}${k}.`) : [`${pre}${k}`])).sort();
  assert.deepEqual(keys(idj.templates), keys(enj.templates));
  for (const id of IDS)
    for (const j of [idj, enj]) {
      const it = j.templates.items[id];
      assert.ok(it?.name && it?.description, id);
      const n = getTemplate(id)?.content.pages.length;
      assert.match(it.description, new RegExp(`${n} (halaman|pages)`), `${id}: jumlah halaman di deskripsi`);
    }
  for (const c of ["agriculture", "architecture", "automotive", "beauty", "construction", "finance", "fitness", "gaming", "hospitality", "kids", "logistics", "music", "news", "nonprofit", "pets", "wedding"]) assert.ok(idj.templates.categories[c] && enj.templates.categories[c], c);
});
