import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isSection } from "../../pageMaker/helpers/pageDoc";
import { isBox, type ComponentNode } from "../../pageMaker/engine/helpers/componentTypes";
import { LIBRARY_IDS } from "../../pageMaker/engine/helpers/libraries";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../pageMaker/core/elementDefinitions";
import { TF } from "../../pageMaker/core/helpers/templateFonts";
import { isPremiumPreset } from "../../pageMaker/helpers/sectionPresets";
import { compose } from "../../pageMaker/engine/helpers/compose";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { V5F_CATALOG as V4E_CATALOG } from "../templates/v5/catalogF";
import { V5F_TEMPLATES as V4E_TEMPLATES } from "../templates/v5/setF";
import { V5F_SOURCES as V4E_SOURCES } from "../templates/v5/setF/assets";
import { isRow, normalizePageDoc } from "../../pageMaker/helpers/pageDoc";
import { TEMPLATE_CATALOG, TEMPLATE_CATEGORIES } from "../../../config/templates";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate, type BuiltTemplatePage, type WebTemplate } from "../registry";
import type { TplLang } from "../types";

type SectionBox = { tag?: string; name: string };

/* Catalog v5 part F: 10 templates (1 Free + 9 Premium), 4–6 pages, using Full Width & Specialty sections. */

const LANGS: TplLang[] = ["id", "en"];
const PAGES: Record<string, number> = {
  "catering-dapur-rasa": 4,
  "hotel-teras-senja": 6,
  "rental-lintas": 5,
  "yoga-hening": 5,
  "tax-taksa": 5,
  "event-riang-pesta": 6,
  "barber-cukur-jenggala": 4,
  "museum-lini-masa": 6,
  "app-dompetku": 5,
  "agro-petik-kebun": 5,
};
const CHART_IDS = ["app-dompetku", "agro-petik-kebun"];
const EFFECT_LIBS = ["aos", "animate", "tilt"];
const icons = makeIconLookup([]);
const IDS = Object.keys(PAGES);
const NEW_CATEGORIES = ["catering", "rental", "barbershop", "museum"];

const templates = (): WebTemplate[] => V4E_CATALOG.map((m) => getTemplate(m.id) as WebTemplate);

function walk(n: ComponentNode, f: (n: ComponentNode) => void): void {
  f(n);
  if (isBox(n)) n.children.forEach((c) => walk(c, f));
}

/** Premium items (section presets & elements) used by the template. */
function premiumItems(tpl: WebTemplate): string[] {
  const { sectionIds, elementIds } = templateContents(tpl);
  return [
    ...sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))),
    ...elementIds.filter((id: string) => ELEMENT_DEFINITION_BY_TYPE[id.replace("element:", "")]?.premium),
  ];
}

const fontOf = (css: string | undefined) => css?.match(/font-family: ([^;]+);/)?.[1]?.trim();

test("katalog F: 10 template berurutan, terdaftar, 1 Free + 9 Premium", () => {
  assert.equal(V4E_CATALOG.length, 10);
  assert.deepEqual(V4E_CATALOG.map((m) => m.id), IDS);
  assert.deepEqual(Object.keys(V4E_TEMPLATES).sort(), [...IDS].sort());
  assert.deepEqual(V4E_CATALOG.filter((m) => m.tier === "free").map((m) => m.id), ["catering-dapur-rasa"]);
  assert.equal(V4E_CATALOG.filter((m) => m.tier === "premium").length, 9);
  for (const m of V4E_CATALOG) {
    assert.ok(TEMPLATE_CATEGORIES.includes(m.category), `${m.id}: kategori ${m.category}`);
    assert.ok(TEMPLATE_CATALOG.some((c) => c.id === m.id), `${m.id}: masuk TEMPLATE_CATALOG`);
    assert.ok(WEB_TEMPLATES.some((t) => t.id === m.id), `${m.id}: punya konten`);
  }
});

test("halaman: jumlah persis, kunci & slug unik, satu homepage", () => {
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
    assert.equal(homes[0].slug.en, "index");
  }
});

test("setiap halaman dibangun di ID & EN: section saja di root, header + isi + footer, dwibahasa", () => {
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
    const shapes = byLang.id.map((p) => (p.doc.root.children as unknown as SectionBox[]).map((s) => s.name).join("|"));
    assert.equal(new Set(shapes).size, shapes.length, `${tpl.id}: susunan section tiap halaman berbeda`);
    assert.notEqual(JSON.stringify(byLang.id.map((p) => p.name)), JSON.stringify(byLang.en.map((p) => p.name)), `${tpl.id}: nama halaman dwibahasa`);
    // The home page content also differs between languages.
    assert.notEqual(JSON.stringify(byLang.id[0].doc).replace(/"id":"[^"]+"/g, ""), JSON.stringify(byLang.en[0].doc).replace(/"id":"[^"]+"/g, ""), `${tpl.id}: isi beranda dwibahasa`);
  }
});

test("item Premium: Free tanpa item Premium; Premium ≥1, kombinasi & jumlah bervariasi", () => {
  const sets = new Set<string>();
  const sizes: number[] = [];
  for (const tpl of templates()) {
    const items = premiumItems(tpl);
    if (tpl.tier === "free") assert.deepEqual(items, [], `${tpl.id}: template gratis memakai ${items.join(", ")}`);
    else {
      assert.ok(items.length >= 1, `${tpl.id}: tanpa item Premium`);
      sets.add(items.slice().sort().join(","));
      sizes.push(items.length);
    }
  }
  assert.equal(sets.size, 9, `kombinasi item Premium: ${sets.size}`);
  assert.ok(sizes.some((n) => n <= 2), "ada template dengan 1–2 item Premium");
  assert.ok(sizes.some((n) => n >= 3 && n <= 4), "ada template dengan 3–4 item Premium");
  assert.ok(sizes.some((n) => n >= 5), "ada template dengan 5+ item Premium");
});

test("library: hanya aos/animate/tilt, Premium memasang & memakai library di setiap halaman, sebaran cukup", () => {
  const count: Record<string, number> = { aos: 0, animate: 0, tilt: 0 };
  for (const tpl of templates()) {
    const used = new Set<string>();
    for (const lang of LANGS)
      for (const p of buildTemplatePages(tpl, lang)) {
        const installed = p.doc.root.libraries ?? [];
        for (const l of installed) {
          assert.ok((LIBRARY_IDS as string[]).includes(l), `${tpl.id}/${p.key}: library ${l}`);
          assert.ok(EFFECT_LIBS.includes(l), `${tpl.id}/${p.key}: root.libraries hanya aos/animate/tilt (${l})`);
        }
        const onNodes = new Set<string>();
        walk(p.doc.root as unknown as ComponentNode, (n) => Object.keys(n.libs ?? {}).forEach((k) => onNodes.add(k)));
        for (const k of onNodes) assert.ok(installed.includes(k as never), `${tpl.id}/${p.key}: efek ${k} tanpa library terpasang`);
        if (tpl.tier === "premium") {
          assert.ok(installed.length >= 1, `${tpl.id}/${p.key}/${lang}: tanpa library`);
          assert.ok(onNodes.size >= 1, `${tpl.id}/${p.key}/${lang}: tidak ada node dengan efek library`);
        } else {
          for (const l of installed) assert.equal(l, "aos", `${tpl.id}: template gratis hanya boleh AOS`);
        }
        installed.forEach((l) => used.add(l));
      }
    used.forEach((l) => (count[l] += 1));
  }
  assert.ok(count.aos >= 5, `AOS: ${count.aos}`);
  assert.ok(count.animate >= 4, `Animate: ${count.animate}`);
  assert.ok(count.tilt >= 3, `Tilt: ${count.tilt}`);
});

test("font: pasangan judul/isi dari TF, ≥12 font berbeda, pasangan unik per template", () => {
  const tfValues = new Set(Object.values(TF));
  const fonts = new Set<string>();
  const pairs = new Set<string>();
  for (const tpl of templates()) {
    const doc = buildTemplatePages(tpl, "id")[0].doc;
    const body = fontOf(doc.root.advanced?.customCss);
    assert.ok(body && tfValues.has(body), `${tpl.id}: font isi ${body}`);
    let head: string | undefined;
    walk(doc.root as unknown as ComponentNode, (n) => {
      const st = (n as { state?: { tag?: string } }).state;
      if (!head && !isBox(n) && st?.tag === "h1") head = fontOf(n.advanced?.customCss?.replace(/\n/g, " ").match(/font-family: [^;]+;/)?.[0]);
    });
    assert.ok(head && tfValues.has(head), `${tpl.id}: font judul ${head}`);
    fonts.add(body as string);
    fonts.add(head as string);
    pairs.add(`${head} / ${body}`);
  }
  assert.ok(fonts.size >= 12, `font berbeda: ${fonts.size}`);
  assert.equal(pairs.size, 10, "setiap template punya pasangan font sendiri");
});

test("identitas: merek unik di seluruh katalog, aksen bervariasi", () => {
  const older = TEMPLATE_CATALOG.filter((m) => !V4E_CATALOG.some((x) => x.id === m.id)).map((m) => m.id);
  const clash = IDS.filter((id) => older.includes(id));
  assert.deepEqual(clash, [], `ID katalog F bentrok dengan template lama: ${clash.join(", ")}`);
  const brands = WEB_TEMPLATES.map((t) => t.content.brand);
  assert.equal(new Set(brands).size, brands.length, "merek unik");
  assert.equal(new Set(templates().map((t) => t.accent)).size, 10);
});

test("aset v5f: nama berawalan, SVG ASCII kecil tanpa URL eksternal, dipakai template", () => {
  const names = Object.keys(V4E_SOURCES);
  assert.ok(names.length >= 20);
  for (const n of names) {
    assert.match(n, /^v5f-/);
    const svg = V4E_SOURCES[n]();
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(/^[\x20-\x7e]*$/.test(svg), `${n}: ASCII`);
    assert.ok(svg.length < 8000, `${n}: ${svg.length} byte`);
    assert.doesNotMatch(svg.replace('xmlns="http://www.w3.org/2000/svg"', ""), /https?:/, `${n}: URL eksternal`);
  }
  // Templates do not load external images (Unsplash etc.).
  for (const tpl of templates()) {
    const json = JSON.stringify(buildTemplatePages(tpl, "id").map((p) => p.doc));
    assert.doesNotMatch(json, /unsplash|placehold\.co/, `${tpl.id}: gambar eksternal`);
  }
});

test("grafik: template data memakai elemen Chart, compose memasang Chart.js, keempat jenis grafik muncul", () => {
  const types = new Set<string>();
  for (const tpl of templates()) {
    const pages = buildTemplatePages(tpl, "id");
    const withChart = pages.filter((p) => {
      let found = false;
      walk(p.doc.root as unknown as ComponentNode, (n) => {
        if (!isBox(n) && n.elementType === "chart") {
          found = true;
          types.add(String((n.state as { chartType?: string }).chartType));
          const rows = (n.state as { rows?: string[] }).rows ?? [];
          assert.ok(rows.length >= 3, `${tpl.id}/${p.key}: data grafik terlalu sedikit`);
        }
      });
      return found;
    });
    if (!CHART_IDS.includes(tpl.id)) {
      assert.equal(withChart.length, 0, `${tpl.id}: bukan template grafik`);
      continue;
    }
    assert.ok(withChart.length >= 1, `${tpl.id}: tanpa elemen Chart`);
    for (const p of withChart) {
      assert.ok(!(p.doc.root.libraries ?? []).includes("chartjs" as never), `${tpl.id}/${p.key}: chartjs dipasang manual`);
      const out = compose(p.doc.root, { rootClass: "pg", icons });
      assert.ok(out.libraries.includes("chartjs" as never), `${tpl.id}/${p.key}: compose tanpa chartjs (${out.libraries.join(",")})`);
    }
  }
  for (const t of ["bar", "line", "doughnut"]) assert.ok(types.has(t), `jenis grafik ${t} belum dipakai`);
});

test("locale (hasil gabungan src/locales): nama & deskripsi semua template, 4 kategori baru", () => {
  type Loc = { templates: { items: Record<string, { name: string; description: string }>; categories: Record<string, string> } };
  const read = (lang: TplLang): Loc => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../locales/${lang}.json`, import.meta.url)), "utf8"));
  const idj = read("id");
  const enj = read("en");
  for (const id of IDS) {
    const n = PAGES[id];
    const a = idj.templates.items[id];
    const b = enj.templates.items[id];
    assert.ok(a?.name && a?.description, `${id}: locale ID`);
    assert.ok(b?.name && b?.description, `${id}: locale EN`);
    assert.match(a.description, new RegExp(`${n} halaman`), `${id}: jumlah halaman (ID)`);
    assert.match(b.description, new RegExp(`${n} pages`), `${id}: jumlah halaman (EN)`);
    assert.equal(a.name, getTemplate(id)?.content.brand, `${id}: nama = merek`);
  }
  for (const c of NEW_CATEGORIES) {
    assert.ok(idj.templates.categories[c], `kategori ${c} (ID)`);
    assert.ok(enj.templates.categories[c], `kategori ${c} (EN)`);
  }
});

test("tipe section ala Divi: beranda dibuka Header Lebar Penuh, setiap template punya section Spesialisasi", () => {
  for (const tpl of templates()) {
    for (const lang of LANGS) {
      const pages = buildTemplatePages(tpl, lang);
      const homeSecs = pages[0].doc.root.children as unknown as { section: { sectionType?: string; contentWidth: number; padX: number }; name: string; children: { rowWidth?: string }[] }[];
      const first = homeSecs[1];
      assert.equal(first.section.sectionType, "fullwidth", `${tpl.id}/${lang}: section pertama beranda`);
      assert.equal(first.section.contentWidth, 0);
      assert.equal(first.section.padX, 0);
      assert.ok(first.children.every((r) => r.rowWidth === "full"), `${tpl.id}: Row lebar penuh`);
      let special = 0;
      for (const p of pages)
        for (const s of p.doc.root.children as unknown as ComponentNode[]) {
          const sec = (s as { section?: { sectionType?: string } }).section;
          if (sec?.sectionType !== "specialty") continue;
          special++;
          // one Row; there are no more Rows inside it (inner rows = regular grid groups)
          assert.equal((s as { children: ComponentNode[] }).children.length, 1);
          let nested = 0;
          walk((s as { children: ComponentNode[] }).children[0], (n) => {
            if (n !== (s as { children: ComponentNode[] }).children[0] && isRow(n)) nested++;
          });
          assert.equal(nested, 0, `${tpl.id}/${p.key}: Row bersarang`);
          const special_col = JSON.stringify(s).includes('"name":"Kolom Spesial"');
          assert.ok(special_col, `${tpl.id}/${p.key}: kolom spesial`);
        }
      assert.ok(special >= 1, `${tpl.id}/${lang}: tanpa section Spesialisasi`);
      // the section type is saved & reloaded too
      const back = normalizePageDoc(JSON.parse(JSON.stringify(pages[0].doc)));
      assert.equal((back.root.children[1] as unknown as { section: { sectionType?: string } }).section.sectionType, "fullwidth");
    }
  }
});
