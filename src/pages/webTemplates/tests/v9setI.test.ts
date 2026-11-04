import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isBox, type ComponentNode } from "../../pageMaker/engine/helpers/componentTypes";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../pageMaker/core/elementDefinitions";
import { TF } from "../../pageMaker/core/helpers/templateFonts";
import { isPremiumPreset } from "../../pageMaker/helpers/sectionPresets";
import { compose } from "../../pageMaker/engine/helpers/compose";
import { FRAMEWORKS } from "../../../exportEngine/engine";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { V9I_CATALOG } from "../templates/v9/catalogI";
import { V9I_TEMPLATES } from "../templates/v9/setI";
import { V9I_SPECS } from "../templates/v9/setI/specs";
import { V9I_SOURCES } from "../templates/v9/setI/assets";
import { showcasePrice, threeTypesOf } from "../templates/v9/setI/kitI";
import { TEMPLATE_CATALOG, TEMPLATE_CATEGORIES } from "../../../config/templates";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { qualityBonus } from "../../../marketplace/templatePricing";
import { templateFiles } from "../exportTemplate";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate, type BuiltTemplatePage, type WebTemplate } from "../registry";
import type { TplLang } from "../types";

/* v9 catalog part I: Premium 3D & animation templates (setI/i*.ts), built by kitI. */

type SectionBox = { tag?: string; name: string };

const LANGS: TplLang[] = ["id", "en"];
const IDS = V9I_SPECS.map((s) => s.id);
const icons = makeIconLookup([]);
const templates = (): WebTemplate[] => V9I_CATALOG.map((m) => getTemplate(m.id) as WebTemplate);
const THREE = ["three-globe", "three-product", "three-shape", "three-particles", "card-3d"];

function walk(n: ComponentNode, f: (n: ComponentNode) => void): void {
  f(n);
  if (isBox(n)) n.children.forEach((c) => walk(c, f));
}

function premiumItems(tpl: WebTemplate): string[] {
  const { sectionIds, elementIds } = templateContents(tpl);
  return [...sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))), ...elementIds.filter((id: string) => ELEMENT_DEFINITION_BY_TYPE[id.replace("element:", "")]?.premium)];
}

const fontOf = (css: string | undefined) => css?.match(/font-family: ([^;]+);/)?.[1]?.trim();

test("katalog I: urut sesuai spesifikasi, terdaftar, semua Premium, 2–10 halaman, kelipatan batch 10", () => {
  assert.deepEqual(V9I_CATALOG.map((m) => m.id), IDS);
  assert.deepEqual(Object.keys(V9I_TEMPLATES).sort(), [...IDS].sort());
  assert.equal(IDS.length % 10, 0, "batch 10 template");
  for (const m of V9I_CATALOG) {
    assert.equal(m.tier, "premium", m.id);
    assert.match(m.id, /^x3d-[a-z0-9-]+$/);
    assert.ok(TEMPLATE_CATEGORIES.includes(m.category), `${m.id}: kategori ${m.category}`);
    assert.ok(TEMPLATE_CATALOG.some((c) => c.id === m.id), `${m.id}: masuk TEMPLATE_CATALOG`);
    assert.ok(WEB_TEMPLATES.some((t) => t.id === m.id), `${m.id}: punya konten`);
    const n = V9I_TEMPLATES[m.id].pages.length;
    assert.ok(n >= 2 && n <= 10, `${m.id}: ${n} halaman`);
  }
});

test("harga 60–300 kredit = showcasePrice(halaman, jenis 3D, bonus kualitas); rentang terpakai lebar", () => {
  for (const tpl of templates()) {
    const s = V9I_SPECS.find((x) => x.id === tpl.id)!;
    const c = templateContents(tpl);
    const expected = showcasePrice(tpl.content.pages.length, threeTypesOf(s).length, qualityBonus(premiumItems(tpl).length, c.libraries.length));
    assert.equal(tpl.price, expected, tpl.id);
    assert.ok(tpl.price >= 60 && tpl.price <= 300, `${tpl.id}: ${tpl.price}`);
  }
  const prices = V9I_CATALOG.map((m) => m.price);
  assert.ok(Math.max(...prices) - Math.min(...prices) >= 100, `rentang harga: ${Math.min(...prices)}–${Math.max(...prices)}`);
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
        assert.equal(kids[0].tag, "header");
        assert.equal(kids[kids.length - 1].tag, "footer");
      }
    }
    const shapes = byLang.id.map((p) => (p.doc.root.children as unknown as SectionBox[]).map((s) => s.name).join("|"));
    assert.equal(new Set(shapes).size, shapes.length, `${tpl.id}: susunan section tiap halaman berbeda`);
    assert.notEqual(JSON.stringify(byLang.id[0].doc).replace(/"id":"[^"]+"/g, ""), JSON.stringify(byLang.en[0].doc).replace(/"id":"[^"]+"/g, ""), `${tpl.id}: beranda dwibahasa`);
  }
});

test("3D & animasi: beranda memakai elemen 3D, jenis 3D sesuai spesifikasi, animasi CSS tanpa library", () => {
  for (const tpl of templates()) {
    const s = V9I_SPECS.find((x) => x.id === tpl.id)!;
    const used = new Set<string>();
    for (const lang of LANGS)
      buildTemplatePages(tpl, lang).forEach((p, i) => {
        const types = new Set<string>();
        let anims = 0;
        walk(p.doc.root as unknown as ComponentNode, (n) => {
          if (!isBox(n) && THREE.includes(n.elementType)) types.add(n.elementType);
          if (n.anim) anims++;
        });
        types.forEach((t) => used.add(t));
        if (i === 0) assert.ok(types.size >= 1, `${tpl.id}/${lang}: beranda tanpa 3D`);
        assert.ok(anims >= 2, `${tpl.id}/${p.key}/${lang}: animasi ${anims}`);
        assert.deepEqual(p.doc.root.libraries ?? [], [], `${tpl.id}/${p.key}: library efek`);
      });
    assert.deepEqual([...used].sort(), threeTypesOf(s), tpl.id);
  }
});

test("desain berbeda: kombinasi hero/header/footer/bentuk & susunan beranda unik, font & aksen unik", () => {
  const combos = new Set<string>();
  const homes = new Set<string>();
  const pairs = new Set<string>();
  const tfValues = new Set(Object.values(TF));
  for (const s of V9I_SPECS) {
    const k = `${s.hero}/${s.header}/${s.footer}/${s.look.shape}`;
    assert.ok(!combos.has(k), `${s.id}: kombinasi kerangka ${k} sudah dipakai`);
    combos.add(k);
    const home = s.home.map((b) => (typeof b === "string" ? b : b[0])).join(",");
    assert.ok(!homes.has(home), `${s.id}: susunan beranda kembar`);
    homes.add(home);
    const pair = `${s.look.head} / ${s.look.body}`;
    assert.ok(!pairs.has(pair), `${s.id}: pasangan font ${pair} sudah dipakai`);
    pairs.add(pair);
  }
  for (const tpl of templates()) {
    const body = fontOf(buildTemplatePages(tpl, "id")[0].doc.root.advanced?.customCss);
    assert.ok(body && tfValues.has(body), `${tpl.id}: font isi ${body}`);
  }
  assert.equal(new Set(templates().map((t) => t.accent.toLowerCase())).size, IDS.length, "aksen unik");
  const brands = WEB_TEMPLATES.map((t) => t.content.brand);
  assert.equal(new Set(brands).size, brands.length, "merek unik di seluruh katalog");
  const older = TEMPLATE_CATALOG.filter((m) => !V9I_CATALOG.some((x) => x.id === m.id)).map((m) => m.id);
  assert.deepEqual(IDS.filter((id) => older.includes(id)), []);
});

test("aset v9i: SVG ASCII kecil tanpa URL luar, semua gambar template data URI terdaftar", () => {
  const names = Object.keys(V9I_SOURCES);
  assert.equal(names.length, IDS.length * 6);
  for (const n of names) {
    assert.match(n, /^v9i-/);
    const svg = V9I_SOURCES[n]();
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(/^[\x20-\x7e]*$/.test(svg), `${n}: ASCII`);
    assert.doesNotMatch(svg.replace('xmlns="http://www.w3.org/2000/svg"', ""), /https?:/, `${n}: URL eksternal`);
    assert.doesNotMatch(svg, /NaN|undefined/, `${n}: atribut rusak`);
  }
  for (const tpl of templates()) {
    const json = JSON.stringify(LANGS.flatMap((l) => buildTemplatePages(tpl, l).map((p) => p.doc)));
    assert.doesNotMatch(json, /unsplash|placehold\.co|picsum/, `${tpl.id}: gambar eksternal`);
    for (const m of json.matchAll(/"(src|bgImage|image|before|after|avatar|photo|poster)":"([^"]*)"/g)) {
      if ((m[1] === "bgImage" || m[1] === "poster") && !m[2]) continue;
      assert.match(m[2], /^data:image\/svg\+xml;base64,/, `${tpl.id}: gambar ${m[1]}=${m[2].slice(0, 40)}`);
    }
    assert.doesNotMatch(json, /undefined|NaN/, `${tpl.id}: nilai kosong di isi`);
  }
});

test("ekspor: setiap halaman lolos compose tanpa peringatan di semua format; HTML situs utuh", () => {
  for (const tpl of templates()) {
    for (const p of buildTemplatePages(tpl, "id")) {
      const out = compose(p.doc.root, { rootClass: "pg", icons, allowPremiumElements: true });
      assert.deepEqual(out.warnings, [], `${tpl.id}/${p.key}`);
      for (const fw of FRAMEWORKS) {
        const files = out.files(fw);
        assert.ok(files.length > 0, `${tpl.id}/${p.key}/${fw}`);
        const uses3d = JSON.stringify(p.doc).match(/"elementType":"three-/);
        if (uses3d && fw !== "html" && fw !== "blade") assert.ok(files.some((f) => /owd3d\.js$|owd-3d\.ts$/.test(f.name)), `${tpl.id}/${p.key}/${fw}: runtime 3D`);
      }
    }
    for (const lang of LANGS) {
      const { files, assets } = templateFiles(tpl, lang, tpl.content.brand, buildTemplatePages(tpl, lang), { icons, allowPremiumElements: true });
      assert.equal(files.filter((f) => f.name.endsWith(".html")).length, tpl.content.pages.length, `${tpl.id}/${lang}: berkas HTML`);
      assert.ok(assets.some((a) => /v9i-|v6g-/.test(a)), `${tpl.id}: gambar SVG`);
    }
  }
});

test("locale: nama = merek, deskripsi menyebut jumlah halaman", () => {
  type Loc = { templates: { items: Record<string, { name: string; description: string }> } };
  const read = (lang: TplLang): Loc => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../locales/${lang}.json`, import.meta.url)), "utf8"));
  const idj = read("id");
  const enj = read("en");
  for (const id of IDS) {
    const n = V9I_TEMPLATES[id].pages.length;
    assert.match(idj.templates.items[id]?.description ?? "", new RegExp(`${n} halaman`), `${id}: ID`);
    assert.match(enj.templates.items[id]?.description ?? "", new RegExp(`${n} pages`), `${id}: EN`);
    assert.equal(idj.templates.items[id].name, V9I_TEMPLATES[id].brand);
  }
});
