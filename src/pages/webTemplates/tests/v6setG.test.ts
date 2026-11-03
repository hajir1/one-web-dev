import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isSection } from "../../pageMaker/helpers/pageDoc";
import { isBox, type ComponentNode } from "../../pageMaker/engine/helpers/componentTypes";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../pageMaker/core/elementDefinitions";
import { TF } from "../../pageMaker/core/helpers/templateFonts";
import { isPremiumPreset } from "../../pageMaker/helpers/sectionPresets";
import { compose } from "../../pageMaker/engine/helpers/compose";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { V6G_CATALOG } from "../templates/v6/catalogG";
import { V6G_TEMPLATES } from "../templates/v6/setG";
import { V6G_SPECS } from "../templates/v6/setG/specs";
import { V6G_SOURCES } from "../templates/v6/setG/assets";
import { FREE_SWAP } from "../templates/v6/setG/kitG";
import { NEW_CATEGORIES_G } from "../templates/v6/categoriesG";
import { TEMPLATE_CATALOG, TEMPLATE_CATEGORIES } from "../../../config/templates";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { templateFiles } from "../exportTemplate";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate, type BuiltTemplatePage, type WebTemplate } from "../registry";
import type { TplLang } from "../types";

/* Katalog v6 bagian G: template dari spesifikasi data (setG/g*.ts), dibangun kitG. */

type SectionBox = { tag?: string; name: string };

const LANGS: TplLang[] = ["id", "en"];
const IDS = V6G_SPECS.map((s) => s.id);
const icons = makeIconLookup([]);
const templates = (): WebTemplate[] => V6G_CATALOG.map((m) => getTemplate(m.id) as WebTemplate);

function walk(n: ComponentNode, f: (n: ComponentNode) => void): void {
  f(n);
  if (isBox(n)) n.children.forEach((c) => walk(c, f));
}

function premiumItems(tpl: WebTemplate): string[] {
  const { sectionIds, elementIds } = templateContents(tpl);
  return [...sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))), ...elementIds.filter((id: string) => ELEMENT_DEFINITION_BY_TYPE[id.replace("element:", "")]?.premium)];
}

const fontOf = (css: string | undefined) => css?.match(/font-family: ([^;]+);/)?.[1]?.trim();

test("katalog G: urut sesuai spesifikasi, terdaftar, ±10% Free, halaman 3–8", () => {
  assert.deepEqual(V6G_CATALOG.map((m) => m.id), IDS);
  assert.deepEqual(Object.keys(V6G_TEMPLATES).sort(), [...IDS].sort());
  const free = V6G_CATALOG.filter((m) => m.tier === "free").length;
  assert.equal(free, Math.round(IDS.length / 10), `Free: ${free}`);
  for (const m of V6G_CATALOG) {
    assert.ok(TEMPLATE_CATEGORIES.includes(m.category), `${m.id}: kategori ${m.category}`);
    assert.ok(TEMPLATE_CATALOG.some((c) => c.id === m.id), `${m.id}: masuk TEMPLATE_CATALOG`);
    assert.ok(WEB_TEMPLATES.some((t) => t.id === m.id), `${m.id}: punya konten`);
    const n = V6G_TEMPLATES[m.id].pages.length;
    assert.ok(n >= 3 && n <= 8, `${m.id}: ${n} halaman`);
  }
});

test("halaman: kunci & slug unik, satu homepage, ID & EN dibangun dengan header + isi + footer", () => {
  for (const tpl of templates()) {
    const pages = tpl.content.pages;
    assert.equal(new Set(pages.map((p) => p.key)).size, pages.length, `${tpl.id}: kunci unik`);
    for (const lang of LANGS) {
      const slugs = pages.map((p) => p.slug[lang]);
      assert.equal(new Set(slugs).size, pages.length, `${tpl.id}/${lang}: slug unik`);
      for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/, `${tpl.id}/${lang}: slug ${s}`);
    }
    assert.equal(pages.filter((p) => p.home).length, 1);
    const byLang = {} as Record<TplLang, BuiltTemplatePage[]>;
    for (const lang of LANGS) {
      byLang[lang] = buildTemplatePages(tpl, lang);
      for (const p of byLang[lang]) {
        const kids = p.doc.root.children as unknown as SectionBox[];
        assert.ok(kids.length >= 4, `${tpl.id}/${p.key}/${lang}: minimal 4 section`);
        assert.ok(p.doc.root.children.every(isSection));
        assert.equal(kids[0].tag, "header");
        assert.equal(kids[kids.length - 1].tag, "footer");
      }
    }
    const shapes = byLang.id.map((p) => (p.doc.root.children as unknown as SectionBox[]).map((s) => s.name).join("|"));
    assert.equal(new Set(shapes).size, shapes.length, `${tpl.id}: susunan section tiap halaman berbeda`);
    assert.notEqual(JSON.stringify(byLang.id[0].doc).replace(/"id":"[^"]+"/g, ""), JSON.stringify(byLang.en[0].doc).replace(/"id":"[^"]+"/g, ""), `${tpl.id}: beranda dwibahasa`);
  }
});

test("desain berbeda: kombinasi hero/header/footer/bentuk unik, beranda tidak ada yang sama susunannya", () => {
  const combos = new Set<string>();
  const homes = new Set<string>();
  for (const s of V6G_SPECS) {
    const k = `${s.hero}/${s.header}/${s.footer}/${s.look.shape}`;
    assert.ok(!combos.has(k), `${s.id}: kombinasi kerangka ${k} sudah dipakai`);
    combos.add(k);
    const home = s.home.map((b) => (typeof b === "string" ? b : b[0])).join(",");
    assert.ok(!homes.has(home), `${s.id}: susunan beranda kembar`);
    homes.add(home);
  }
  const heroes = new Set(V6G_SPECS.map((s) => s.hero));
  assert.ok(heroes.size >= Math.min(14, V6G_SPECS.length / 2), `jenis hero: ${heroes.size}`);
});

test("item Premium: Free tanpa item Premium & tanpa blok Premium, Premium ≥1 item, kombinasi bervariasi", () => {
  const sets = new Set<string>();
  for (const tpl of templates()) {
    const items = premiumItems(tpl);
    if (tpl.tier === "free") {
      assert.deepEqual(items, [], `${tpl.id}: template gratis memakai ${items.join(", ")}`);
      const spec = V6G_SPECS.find((s) => s.id === tpl.id)!;
      const blocks = [...spec.home, ...spec.pages.flatMap((p) => p.blocks)].map((b) => (typeof b === "string" ? b : b[0]));
      assert.deepEqual(blocks.filter((b) => FREE_SWAP[b]), [], `${tpl.id}: spesifikasi Free menulis blok Premium`);
    } else {
      assert.ok(items.length >= 1, `${tpl.id}: tanpa item Premium`);
      sets.add(items.slice().sort().join(","));
    }
  }
  const premium = V6G_CATALOG.filter((m) => m.tier === "premium").length;
  assert.ok(sets.size >= premium * 0.8, `kombinasi item Premium: ${sets.size}/${premium}`);
});

test("library: hanya aos/animate/tilt; Premium memakai library di setiap halaman; Free hanya AOS", () => {
  for (const tpl of templates())
    for (const lang of LANGS)
      for (const p of buildTemplatePages(tpl, lang)) {
        const installed = p.doc.root.libraries ?? [];
        for (const l of installed) assert.ok(["aos", "animate", "tilt"].includes(l), `${tpl.id}/${p.key}: ${l}`);
        const onNodes = new Set<string>();
        walk(p.doc.root as unknown as ComponentNode, (n) => Object.keys(n.libs ?? {}).forEach((k) => onNodes.add(k)));
        for (const k of onNodes) assert.ok(installed.includes(k as never), `${tpl.id}/${p.key}: efek ${k} tanpa library`);
        assert.ok(onNodes.size >= 1, `${tpl.id}/${p.key}/${lang}: tanpa efek library`);
        if (tpl.tier === "free") assert.deepEqual(installed, ["aos"], `${tpl.id}: gratis hanya AOS`);
      }
});

test("font & warna: pasangan font dari TF dan unik, aksen unik, merek unik di seluruh katalog", () => {
  const tfValues = new Set(Object.values(TF));
  const pairs = new Set<string>();
  for (const tpl of templates()) {
    const doc = buildTemplatePages(tpl, "id")[0].doc;
    const body = fontOf(doc.root.advanced?.customCss);
    assert.ok(body && tfValues.has(body), `${tpl.id}: font isi ${body}`);
    const s = V6G_SPECS.find((x) => x.id === tpl.id)!;
    const pair = `${s.look.head} / ${s.look.body}`;
    assert.ok(!pairs.has(pair), `${tpl.id}: pasangan font ${pair} sudah dipakai`);
    pairs.add(pair);
  }
  assert.equal(new Set(templates().map((t) => t.accent.toLowerCase())).size, IDS.length, "aksen unik");
  const brands = WEB_TEMPLATES.map((t) => t.content.brand);
  assert.equal(new Set(brands).size, brands.length, "merek unik");
  const older = TEMPLATE_CATALOG.filter((m) => !V6G_CATALOG.some((x) => x.id === m.id)).map((m) => m.id);
  assert.deepEqual(IDS.filter((id) => older.includes(id)), []);
});

test("aset v6g: SVG ASCII kecil tanpa URL luar, semua gambar template ada & terpakai", () => {
  const names = Object.keys(V6G_SOURCES);
  assert.equal(names.length, IDS.length * 6 + 8);
  for (const n of names) {
    assert.match(n, /^v6g-/);
    const svg = V6G_SOURCES[n]();
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(/^[\x20-\x7e]*$/.test(svg), `${n}: ASCII`);
    assert.ok(svg.length < 8000, `${n}: ${svg.length} byte`);
    assert.doesNotMatch(svg.replace('xmlns="http://www.w3.org/2000/svg"', ""), /https?:/, `${n}: URL eksternal`);
    assert.doesNotMatch(svg, /NaN|undefined/, `${n}: atribut rusak`);
  }
  for (const tpl of templates()) {
    const json = JSON.stringify(LANGS.flatMap((l) => buildTemplatePages(tpl, l).map((p) => p.doc)));
    assert.doesNotMatch(json, /unsplash|placehold\.co|picsum/, `${tpl.id}: gambar eksternal`);
    // Setiap src gambar adalah data URI SVG yang terdaftar (tidak ada gambar rusak).
    for (const m of json.matchAll(/"(src|bgImage|image|before|after|avatar|photo)":"([^"]*)"/g)) {
      if (m[1] === "bgImage" && !m[2]) continue; // latar tanpa gambar (bawaan)
      assert.match(m[2], /^data:image\/svg\+xml;base64,/, `${tpl.id}: gambar ${m[1]}=${m[2].slice(0, 40)}`);
    }
    assert.doesNotMatch(json, /undefined|NaN/, `${tpl.id}: nilai kosong di isi`);
  }
});

test("grafik: template ber-chart memakai elemen Chart; compose memasang Chart.js", () => {
  const withChart = V6G_SPECS.filter((s) => s.biz.chart);
  assert.ok(withChart.length >= 2);
  for (const s of withChart) {
    const tpl = getTemplate(s.id)!;
    const pages = buildTemplatePages(tpl, "en").filter((p) => JSON.stringify(p.doc).includes('"elementType":"chart"'));
    assert.ok(pages.length >= 1, `${s.id}: tanpa elemen Chart`);
    for (const p of pages) {
      const out = compose(p.doc.root, { rootClass: "pg", icons });
      assert.ok(out.libraries.includes("chartjs" as never), `${s.id}/${p.key}: compose tanpa chartjs`);
    }
  }
});

test("ekspor HTML: setiap template set G menghasilkan semua halaman + gambar SVG", () => {
  for (const tpl of templates())
    for (const lang of LANGS) {
      const { files, assets } = templateFiles(tpl, lang, tpl.content.brand, buildTemplatePages(tpl, lang), { icons, allowPremiumElements: true });
      assert.equal(files.filter((f) => f.name.endsWith(".html")).length, tpl.content.pages.length, `${tpl.id}/${lang}: berkas HTML`);
      assert.ok(assets.some((a) => /v6g-/.test(a)), `${tpl.id}: gambar SVG`);
      for (const f of files) assert.doesNotMatch(f.content, /data:image\/svg\+xml;base64/, `${tpl.id}/${f.name}: data URI tersisa`);
    }
});

test("locale: nama = merek, deskripsi menyebut jumlah halaman, kategori baru berlabel", () => {
  type Loc = { templates: { items: Record<string, { name: string; description: string }>; categories: Record<string, string> } };
  const read = (lang: TplLang): Loc => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../locales/${lang}.json`, import.meta.url)), "utf8"));
  const idj = read("id");
  const enj = read("en");
  for (const id of IDS) {
    const n = V6G_TEMPLATES[id].pages.length;
    assert.match(idj.templates.items[id]?.description ?? "", new RegExp(`${n} halaman`), `${id}: ID`);
    assert.match(enj.templates.items[id]?.description ?? "", new RegExp(`${n} pages`), `${id}: EN`);
    assert.equal(idj.templates.items[id].name, V6G_TEMPLATES[id].brand);
  }
  for (const c of Object.keys(NEW_CATEGORIES_G)) {
    assert.ok(idj.templates.categories[c] && enj.templates.categories[c], `kategori ${c}`);
    assert.ok(TEMPLATE_CATEGORIES.includes(c as never), `kategori ${c} di TEMPLATE_CATEGORIES`);
  }
});
