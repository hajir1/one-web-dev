import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isSection } from "../../pageMaker/helpers/pageDoc";
import { collectElements, walk } from "../../pageMaker/engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../pageMaker/core/elementDefinitions";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { TF } from "../../pageMaker/core/helpers/templateFonts";
import { buildSite } from "../../pageMaker/helpers/siteExport";
import { isPremiumPreset } from "../../pageMaker/helpers/sectionPresets";
import { isBox, type ComponentNode } from "../../pageMaker/engine/helpers/componentTypes";
import { isRow } from "../../pageMaker/helpers/rowModel";
import { templateFiles } from "../exportTemplate";
import { V3C_CATALOG } from "../templates/v3/catalogC";
import { V3C_TEMPLATES } from "../templates/v3/setC";
import { V3C_SOURCES } from "../templates/v3/setC/assets";
import { TEMPLATE_CATALOG, TEMPLATE_CATEGORIES } from "../../../config/templates";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate, templateSite, type BuiltTemplatePage, type WebTemplate } from "../registry";
import type { TplLang } from "../types";

type SectionBox = { tag?: string; name: string };

/* Katalog v3 bagian C: 25 template (1 Free + 24 Premium), 4–10 halaman, library & font Google. */

const LANGS: TplLang[] = ["id", "en"];
const PAGES: Record<string, number> = {
  "bakery-roti-hangat": 4,
  "sports-futsal-arena": 6,
  "sports-runclub": 5,
  "worship-masjid-annur": 6,
  "worship-gereja-kasih": 5,
  "bakery-patisserie": 7,
  "podcast-ruang-dengar": 5,
  "podcast-studio-suara": 4,
  "fashion-streetwear": 7,
  "fashion-batik-nusantara": 8,
  "printing-cetak-kilat": 6,
  "laundry-bersih": 4,
  "florist-kembang": 5,
  "florist-wedding-bloom": 6,
  "shop-gadget": 9,
  "portfolio-illustrator": 4,
  "restaurant-ramen": 6,
  "health-psikolog": 5,
  "education-tahfidz": 7,
  "technology-ai-lab": 8,
  "travel-diving": 6,
  "creative-tattoo": 4,
  "hospitality-capsule-hotel": 7,
  "startup-edtech": 9,
  "company-konsultan-pajak": 10,
};
const IDS = Object.keys(PAGES);
const NEW_CATEGORIES = ["bakery", "fashion", "florist", "laundry", "podcast", "printing", "sports", "worship"];
const LIBS = ["aos", "animate", "tilt"];

const templates = (): WebTemplate[] => V3C_CATALOG.map((m) => getTemplate(m.id) as WebTemplate);

function premiumItems(tpl: WebTemplate): string[] {
  const { sectionIds, elementIds } = templateContents(tpl);
  return [
    ...sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))),
    ...elementIds.filter((id: string) => ELEMENT_DEFINITION_BY_TYPE[id.replace("element:", "")]?.premium),
  ];
}

/** Library yang dipakai node di halaman. */
function nodeLibs(root: ComponentNode): Set<string> {
  const used = new Set<string>();
  walk(root, (n) => {
    for (const k of Object.keys(n.libs ?? {})) used.add(k);
  });
  return used;
}

test("katalog C: 25 template berurutan, terdaftar, 1 Free + 24 Premium", () => {
  assert.equal(V3C_CATALOG.length, 25);
  assert.deepEqual(V3C_CATALOG.map((m) => m.id), IDS);
  assert.deepEqual(Object.keys(V3C_TEMPLATES).sort(), [...IDS].sort());
  assert.deepEqual(V3C_CATALOG.filter((m) => m.tier === "free").map((m) => m.id), ["bakery-roti-hangat"]);
  assert.equal(V3C_CATALOG.filter((m) => m.tier === "premium").length, 24);
  for (const m of V3C_CATALOG) {
    assert.ok(TEMPLATE_CATEGORIES.includes(m.category), `${m.id}: kategori ${m.category}`);
    assert.ok(TEMPLATE_CATALOG.some((c) => c.id === m.id), `${m.id}: masuk TEMPLATE_CATALOG`);
    assert.ok(WEB_TEMPLATES.some((t) => t.id === m.id), `${m.id}: punya konten`);
  }
});

test("halaman: jumlah tepat per template, kunci & slug unik, satu homepage", () => {
  for (const tpl of templates()) {
    const pages = tpl.content.pages;
    assert.equal(pages.length, PAGES[tpl.id], `${tpl.id}: ${pages.length} halaman`);
    assert.equal(new Set(pages.map((p) => p.key)).size, pages.length, `${tpl.id}: kunci unik`);
    for (const lang of LANGS) {
      const slugs = pages.map((p) => p.slug[lang]);
      assert.equal(new Set(slugs).size, pages.length, `${tpl.id}/${lang}: slug unik`);
      for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/, `${tpl.id}/${lang}: slug ${s}`);
      for (const p of pages) assert.ok(p.name[lang], `${tpl.id}/${p.key}: nama ${lang}`);
    }
    const homes = pages.filter((p) => p.home);
    assert.equal(homes.length, 1, `${tpl.id}: satu homepage`);
    assert.equal(homes[0].slug.id, "index");
  }
});

test("struktur: section saja di root, header + isi + footer, susunan tiap halaman berbeda, dwibahasa", () => {
  for (const tpl of templates()) {
    const byLang = {} as Record<TplLang, BuiltTemplatePage[]>;
    for (const lang of LANGS) {
      byLang[lang] = buildTemplatePages(tpl, lang);
      for (const p of byLang[lang]) {
        const kids = p.doc.root.children as unknown as SectionBox[];
        assert.ok(kids.length >= 3, `${tpl.id}/${p.key}/${lang}: minimal 3 section`);
        assert.ok(p.doc.root.children.every(isSection), `${tpl.id}/${p.key}/${lang}: anak root = section`);
        assert.equal(kids[0].tag, "header", `${tpl.id}/${p.key}: header di atas`);
        assert.equal(kids[kids.length - 1].tag, "footer", `${tpl.id}/${p.key}: footer di bawah`);
        for (const sec of p.doc.root.children as unknown as { children: ComponentNode[] }[])
          for (const row of sec.children) {
            assert.ok(isRow(row), `${tpl.id}/${p.key}: anak section = Row`);
            walk(row, (n) => assert.ok(n === row || !(isBox(n) && (n.row || n.section)), `${tpl.id}/${p.key}: Row bersarang`));
          }
      }
    }
    const shapes = byLang.id.map((p) => (p.doc.root.children as unknown as SectionBox[]).map((s) => s.name).join("|"));
    assert.equal(new Set(shapes).size, shapes.length, `${tpl.id}: susunan section tiap halaman berbeda\n${shapes.join("\n")}`);
    assert.notEqual(JSON.stringify(byLang.id.map((p) => p.name)), JSON.stringify(byLang.en.map((p) => p.name)), `${tpl.id}: nama halaman dwibahasa`);
    const text = (lang: TplLang) => JSON.stringify(byLang[lang].map((p) => collectElements(p.doc.root).map((e) => e.state.text ?? "")));
    assert.notEqual(text("id"), text("en"), `${tpl.id}: isi dwibahasa`);
  }
});

test("pratinjau: semua halaman ter-compose tanpa peringatan (ID & EN)", () => {
  const icons = makeIconLookup([]);
  for (const tpl of templates())
    for (const lang of LANGS) {
      const { site, designs } = templateSite(tpl, lang, tpl.content.brand);
      const built = buildSite(site, designs, { icons, allowPremiumElements: true });
      assert.deepEqual(built.warnings, [], `${tpl.id}/${lang}`);
      assert.equal(built.pages.length, tpl.content.pages.length);
    }
});

test("unduhan & toko: ≥2 aset gambar per template; halaman toko tanpa script dalam mode terkunci", () => {
  const icons = makeIconLookup([]);
  for (const tpl of templates()) {
    for (const lang of LANGS) {
      const { assets } = templateFiles(tpl, lang, tpl.content.brand, buildTemplatePages(tpl, lang), { icons, allowPremiumElements: true });
      assert.ok(assets.length >= 2, `${tpl.id}/${lang}: aset gambar ${assets.join(", ")}`);
    }
    if (tpl.category !== "shop") continue;
    const { site, designs } = templateSite(tpl, "id", tpl.content.brand);
    for (const p of buildSite(site, designs, { icons }).pages) assert.equal(p.composed.html.script.trim(), "", `${tpl.id}: script`);
  }
});

test("item Premium: Free tanpa item Premium; Premium ≥1, kombinasi & jumlah bervariasi", () => {
  const sets = new Set<string>();
  const sizes = { small: 0, mid: 0, big: 0 };
  for (const tpl of templates()) {
    const items = premiumItems(tpl);
    if (tpl.tier === "free") {
      assert.deepEqual(items, [], `${tpl.id}: template gratis memakai ${items.join(", ")}`);
      continue;
    }
    assert.ok(items.length >= 1, `${tpl.id}: tanpa item Premium`);
    sets.add(items.slice().sort().join(","));
    if (items.length <= 2) sizes.small++;
    else if (items.length <= 4) sizes.mid++;
    else sizes.big++;
  }
  assert.ok(sets.size >= 18, `kombinasi item Premium: ${sets.size}`);
  assert.ok(sizes.small > 0 && sizes.mid > 0 && sizes.big > 0, `jumlah item bervariasi: ${JSON.stringify(sizes)}`);
});

test("library: hanya aos/animate/tilt; Premium memasang ≥1 library di setiap halaman dan memakainya", () => {
  const usage: Record<string, number> = { aos: 0, animate: 0, tilt: 0 };
  for (const tpl of templates()) {
    const used = new Set<string>();
    for (const p of buildTemplatePages(tpl, "id")) {
      const libs = p.doc.root.libraries ?? [];
      for (const l of libs) assert.ok(LIBS.includes(l), `${tpl.id}/${p.key}: library ${l}`);
      const onNodes = nodeLibs(p.doc.root);
      if (tpl.tier === "premium") assert.ok(libs.length >= 1, `${tpl.id}/${p.key}: tanpa library`);
      for (const l of libs) assert.ok(onNodes.has(l), `${tpl.id}/${p.key}: ${l} terpasang tapi tidak dipakai node`);
      for (const l of onNodes) assert.ok(libs.includes(l as never), `${tpl.id}/${p.key}: node memakai ${l} yang tidak terpasang`);
      libs.forEach((l) => used.add(l));
    }
    if (tpl.tier === "free") assert.ok([...used].every((l) => l === "aos"), `${tpl.id}: Free hanya AOS`);
    for (const l of used) usage[l]++;
  }
  assert.ok(usage.aos >= 15, `AOS: ${usage.aos}`);
  assert.ok(usage.animate >= 6, `Animate: ${usage.animate}`);
  assert.ok(usage.tilt >= 6, `Tilt: ${usage.tilt}`);
});

test("identitas: merek unik di seluruh katalog, font Google bervariasi (≥12 font, ≥18 pasangan)", () => {
  const brands = WEB_TEMPLATES.map((t) => t.content.brand);
  assert.equal(new Set(brands).size, brands.length, "merek unik");
  const tfValues = new Set(Object.values(TF));
  const fonts = new Set<string>();
  const pairs = new Set<string>();
  for (const tpl of templates()) {
    const root = buildTemplatePages(tpl, "id")[0].doc.root;
    const body = root.advanced?.customCss?.match(/font-family: ([^;]+)/)?.[1] ?? "";
    let headFont = "";
    walk(root, (n) => {
      if (headFont || n.kind !== "element" || n.elementType !== "text" || !["h1", "h2", "h3"].includes(n.state.tag)) return;
      headFont = n.advanced?.customCss?.match(/font-family: ([^;]+)/)?.[1] ?? "";
    });
    assert.ok(tfValues.has(body), `${tpl.id}: font isi ${body}`);
    assert.ok(tfValues.has(headFont), `${tpl.id}: font judul ${headFont}`);
    fonts.add(body);
    fonts.add(headFont);
    pairs.add(`${headFont} / ${body}`);
  }
  assert.ok(fonts.size >= 12, `font: ${fonts.size}`);
  assert.ok(pairs.size >= 18, `pasangan font: ${pairs.size}`);
});

test("aset v3c: nama berawalan, SVG ASCII kecil tanpa URL eksternal", () => {
  const names = Object.keys(V3C_SOURCES);
  assert.ok(names.length >= 25, `aset: ${names.length}`);
  for (const n of names) {
    assert.match(n, /^v3c-/);
    const svg = V3C_SOURCES[n]();
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(/^[\x20-\x7e]*$/.test(svg), `${n}: ASCII`);
    assert.ok(svg.length < 8000, `${n}: ${svg.length} byte`);
    assert.doesNotMatch(svg.replace('xmlns="http://www.w3.org/2000/svg"', ""), /https?:/, `${n}: URL eksternal`);
  }
});

test("locale (hasil gabungan src/locales): nama, deskripsi N halaman, kategori baru", () => {
  type Loc = { templates: { items: Record<string, { name: string; description: string }>; categories: Record<string, string> } };
  const read = (lang: TplLang): Loc => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../locales/${lang}.json`, import.meta.url)), "utf8"));
  const idj = read("id");
  const enj = read("en");
  for (const id of IDS) {
    const n = PAGES[id];
    const a = idj.templates.items[id];
    const b = enj.templates.items[id];
    assert.ok(a?.name && a?.description, `${id}: locale id`);
    assert.ok(b?.name && b?.description, `${id}: locale en`);
    assert.equal(a.name, V3C_TEMPLATES[id].brand, `${id}: nama = merek`);
    assert.equal(b.name, V3C_TEMPLATES[id].brand, `${id}: name = brand`);
    assert.match(a.description, new RegExp(`\\b${n} halaman`), `${id}: deskripsi ID`);
    assert.match(b.description, new RegExp(`\\b${n} pages`), `${id}: deskripsi EN`);
  }
  for (const c of NEW_CATEGORIES) {
    assert.ok(idj.templates.categories[c], `kategori ${c} (id)`);
    assert.ok(enj.templates.categories[c], `kategori ${c} (en)`);
  }
});
