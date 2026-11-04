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
import { libraryHead, libraryScripts } from "../../pageMaker/engine/helpers/libraries";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { V7H_CATALOG } from "../templates/v7/catalogH";
import { V7H_TEMPLATES } from "../templates/v7/setH";
import { V7H_SPECS } from "../templates/v7/setH/specs";
import { luminance } from "../templates/v7/setH/kitH";
import { V7H_SOURCES } from "../templates/v7/setH/assets";
import { NEW_CATEGORIES_H } from "../templates/v7/categoriesH";
import { TEMPLATE_CATALOG, TEMPLATE_CATEGORIES } from "../../../config/templates";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { EXPORT_FORMATS } from "../../pageMaker/helpers/projectExport";
import { templateFiles } from "../exportTemplate";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate, type WebTemplate } from "../registry";
import type { TplLang } from "../types";

/* v7 catalog part H: Dashboard templates from specs (setH/h*.ts), built by kitH. */

type SectionBox = { tag?: string; name: string };

const LANGS: TplLang[] = ["id", "en"];
const IDS = V7H_SPECS.map((s) => s.id);
const icons = makeIconLookup([]);
const templates = (): WebTemplate[] => V7H_CATALOG.map((m) => getTemplate(m.id) as WebTemplate);

function walk(n: ComponentNode, f: (n: ComponentNode) => void): void {
  f(n);
  if (isBox(n)) n.children.forEach((c) => walk(c, f));
}

function premiumItems(tpl: WebTemplate): string[] {
  const { sectionIds, elementIds } = templateContents(tpl);
  return [...sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))), ...elementIds.filter((id: string) => ELEMENT_DEFINITION_BY_TYPE[id.replace("element:", "")]?.premium)];
}

/** Nested Sections/Rows are forbidden: root → section → Row → content. */
function nestedRows(n: ComponentNode, inRow = false): number {
  if (!isBox(n)) return 0;
  const row = Boolean((n as { row?: unknown }).row);
  const here = row && inRow ? 1 : 0;
  return here + n.children.reduce((a, c) => a + nestedRows(c, inRow || row), 0);
}

test("katalog H: urut sesuai spesifikasi, terdaftar, mayoritas kategori Dashboard, halaman 3–8", () => {
  assert.deepEqual(V7H_CATALOG.map((m) => m.id), IDS);
  assert.deepEqual(Object.keys(V7H_TEMPLATES).sort(), [...IDS].sort());
  assert.equal(new Set(IDS).size, IDS.length);
  const dash = V7H_CATALOG.filter((m) => m.category === "dashboard").length;
  assert.ok(dash > IDS.length / 2, `Dashboard: ${dash}/${IDS.length}`);
  assert.ok(V7H_CATALOG.some((m) => m.tier === "free"), "ada template Free");
  for (const m of V7H_CATALOG) {
    assert.ok(TEMPLATE_CATEGORIES.includes(m.category), `${m.id}: kategori ${m.category}`);
    assert.notEqual(m.category, "shop", `${m.id}: dashboard bukan toko (tanpa kartu produk)`);
    assert.ok(TEMPLATE_CATALOG.some((c) => c.id === m.id), `${m.id}: masuk TEMPLATE_CATALOG`);
    assert.ok(WEB_TEMPLATES.some((t) => t.id === m.id), `${m.id}: punya konten`);
    const n = V7H_TEMPLATES[m.id].pages.length;
    assert.ok(n >= 3 && n <= 8, `${m.id}: ${n} halaman`);
  }
});

test("halaman: slug unik, satu beranda, header + isi + footer, tanpa Row bersarang, dwibahasa", () => {
  for (const tpl of templates()) {
    const pages = tpl.content.pages;
    assert.equal(new Set(pages.map((p) => p.key)).size, pages.length, `${tpl.id}: kunci unik`);
    assert.equal(pages.filter((p) => p.home).length, 1);
    for (const lang of LANGS) {
      const slugs = pages.map((p) => p.slug[lang]);
      assert.equal(new Set(slugs).size, pages.length, `${tpl.id}/${lang}: slug unik`);
      for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/, `${tpl.id}/${lang}: slug ${s}`);
      for (const p of buildTemplatePages(tpl, lang)) {
        const kids = p.doc.root.children as unknown as SectionBox[];
        assert.ok(kids.length >= 2, `${tpl.id}/${p.key}: minimal 2 section`);
        assert.ok(p.doc.root.children.every(isSection));
        assert.equal(nestedRows(p.doc.root as unknown as ComponentNode), 0, `${tpl.id}/${p.key}: Row bersarang`);
        assert.doesNotMatch(JSON.stringify(p.doc), /undefined|NaN/, `${tpl.id}/${p.key}: nilai kosong`);
      }
    }
    const strip = (lang: TplLang) => JSON.stringify(buildTemplatePages(tpl, lang)[0].doc).replace(/"id":"[^"]+"/g, "");
    assert.notEqual(strip("id"), strip("en"), `${tpl.id}: beranda dwibahasa`);
  }
});

test("desain berbeda: kombinasi shell/kartu/KPI/palet unik, aksen & pasangan font dari TF", () => {
  const combos = new Set<string>();
  const accents = new Set<string>();
  const tfValues = new Set(Object.values(TF));
  for (const s of V7H_SPECS) {
    const k = `${s.shell}/${s.look.card}/${s.kpi}/${s.home.join(",")}`;
    assert.ok(!combos.has(k), `${s.id}: kombinasi ${k} sudah dipakai`);
    combos.add(k);
    assert.ok(!accents.has(s.pal[2].toLowerCase()), `${s.id}: aksen ${s.pal[2]} kembar`);
    // The accent is used as active text/menu on the background: contrast at least 3:1.
    const ratio = (a: string, b: string) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    assert.ok(ratio(s.pal[2], s.look.surface) >= 3, `${s.id}: kontras aksen ${s.pal[2]} di ${s.look.surface} = ${ratio(s.pal[2], s.look.surface).toFixed(2)}`);
    assert.ok(ratio(s.pal[0], s.look.surface) >= 7, `${s.id}: kontras teks`);
    accents.add(s.pal[2].toLowerCase());
    for (const f of [s.look.head, s.look.body]) assert.ok(tfValues.has(f) || Object.keys(TF).includes(f), `${s.id}: font ${f}`);
  }
  const brands = WEB_TEMPLATES.map((t) => t.content.brand);
  assert.equal(new Set(brands).size, brands.length, "merek unik di seluruh katalog");
  assert.ok(new Set(V7H_SPECS.map((s) => s.shell)).size >= Math.min(6, V7H_SPECS.length / 3), "shell bervariasi");
});

test("item Premium: Free tanpa item Premium & hanya AOS/tanpa library, Premium ≥1 item", () => {
  for (const tpl of templates()) {
    const items = premiumItems(tpl);
    if (tpl.tier === "free") assert.deepEqual(items, [], `${tpl.id}: template gratis memakai ${items.join(", ")}`);
    else assert.ok(items.length >= 1, `${tpl.id}: tanpa item Premium`);
    for (const lang of LANGS)
      for (const p of buildTemplatePages(tpl, lang)) {
        const installed = p.doc.root.libraries ?? [];
        const onNodes = new Set<string>();
        walk(p.doc.root as unknown as ComponentNode, (n) => Object.keys(n.libs ?? {}).forEach((k) => onNodes.add(k)));
        for (const k of onNodes) assert.ok(installed.includes(k as never), `${tpl.id}/${p.key}: efek ${k} tanpa library`);
        if (tpl.tier === "free") assert.deepEqual(installed.filter((l) => l !== "aos"), [], `${tpl.id}: gratis hanya AOS`);
      }
  }
});

test("grafik: setiap template memakai Chart; compose memasang Chart.js versi terkunci", () => {
  for (const tpl of templates()) {
    const pages = buildTemplatePages(tpl, "en").filter((p) => JSON.stringify(p.doc).includes('"elementType":"chart"'));
    assert.ok(pages.length >= 1, `${tpl.id}: tanpa elemen Chart`);
    const out = compose(pages[0].doc.root, { rootClass: "pg", icons });
    assert.ok(out.libraries.includes("chartjs" as never), `${tpl.id}: compose tanpa chartjs`);
    assert.match(libraryHead(out.libraries) + libraryScripts(out.libraries), /chart\.js@\d+\.\d+\.\d+\//, `${tpl.id}: versi Chart.js tidak dikunci`);
  }
});

test("ekspor: setiap template set H bisa diekspor ke semua format", () => {
  const formats = EXPORT_FORMATS.map((f) => f.id);
  for (const tpl of templates())
    for (const fw of formats) {
      const { files } = templateFiles(tpl, "id", tpl.content.brand, buildTemplatePages(tpl, "id"), { icons, allowPremiumElements: true }, fw);
      assert.ok(files.some((f) => f.name.endsWith("README.md")), `${tpl.id}/${fw}: README`);
      assert.ok(files.length >= 3, `${tpl.id}/${fw}: berkas`);
      for (const f of files) assert.doesNotMatch(f.content, /undefined|data:image\/svg\+xml;base64/, `${tpl.id}/${fw}/${f.name}`);
    }
});

test("locale: nama = merek, deskripsi menyebut jumlah halaman, kategori Dashboard berlabel", () => {
  type Loc = { templates: { items: Record<string, { name: string; description: string }>; categories: Record<string, string> } };
  const read = (lang: TplLang): Loc => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../locales/${lang}.json`, import.meta.url)), "utf8"));
  const idj = read("id");
  const enj = read("en");
  for (const id of IDS) {
    const n = V7H_TEMPLATES[id].pages.length;
    assert.match(idj.templates.items[id]?.description ?? "", new RegExp(`${n} halaman`), `${id}: ID`);
    assert.match(enj.templates.items[id]?.description ?? "", new RegExp(`${n} pages`), `${id}: EN`);
    assert.equal(idj.templates.items[id].name, V7H_TEMPLATES[id].brand);
  }
  for (const c of Object.keys(NEW_CATEGORIES_H)) {
    assert.ok(idj.templates.categories[c] && enj.templates.categories[c], `kategori ${c}`);
    assert.ok(TEMPLATE_CATEGORIES.includes(c as never), `kategori ${c} di TEMPLATE_CATEGORIES`);
  }
});

test("aset v7h: logo & ilustrasi Masuk per template, SVG ASCII kecil tanpa URL luar", () => {
  const names = Object.keys(V7H_SOURCES);
  assert.equal(names.length, IDS.length * 2);
  for (const n of names) {
    const svg = V7H_SOURCES[n]();
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(/^[\x20-\x7e]*$/.test(svg), `${n}: ASCII`);
    assert.ok(svg.length < 12000, `${n}: ${svg.length} byte`);
    assert.doesNotMatch(svg.replace('xmlns="http://www.w3.org/2000/svg"', ""), /https?:|NaN|undefined/, n);
  }
  for (const tpl of templates()) {
    const json = JSON.stringify(LANGS.flatMap((l) => buildTemplatePages(tpl, l).map((p) => p.doc)));
    assert.doesNotMatch(json, /unsplash|placehold\.co|picsum/, `${tpl.id}: gambar eksternal`);
    for (const m of json.matchAll(/"srcUrl":"([^"]*)"/g)) assert.match(m[1], /^data:image\/svg\+xml;base64,/, `${tpl.id}: gambar`);
  }
});
