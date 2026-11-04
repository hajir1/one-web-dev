import test from "node:test";
import assert from "node:assert/strict";
import { compose } from "../engine/helpers/compose";
import { createElementNode } from "../engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionForEditor, createSectionFromPreset, emptySection } from "../helpers/pageDoc";
import { SECTION_PRESETS } from "../helpers/sectionPresets";
import { filterDesigns } from "../core/helpers/designSearch";
import { chartConfig, chartSummary, parseChartData } from "../core/elements/data/Chart";
import { LIBRARY_BY_ID } from "../engine/helpers/libraries";
import { ELEMENT_ICON } from "../engine/helpers/elementIcons";

const icons = makeIconLookup([]);
const FRAMEWORKS = ["html", "react", "vue", "svelte", "angular"];
const CDN = LIBRARY_BY_ID.chartjs.js;

const countEls = (b) => b.children.reduce((n, c) => n + (c.kind === "element" ? 1 : countEls(c)), 0);
const boxes = (b) => b.children.filter((c) => c.kind === "box");

/* --------------------------- Empty section --------------------------- */

test("section baru dari preset: kosong (tanpa elemen), row & kolom tetap ada", () => {
  for (const p of SECTION_PRESETS) {
    const full = createSectionFromPreset(p);
    const empty = createSectionForEditor(p);
    assert.ok(empty, p.id);
    assert.equal(countEls(empty), 0, `${p.id}: tanpa elemen`);
    assert.equal(boxes(empty).length, boxes(full).length, `${p.id}: jumlah row sama`);
    boxes(empty).forEach((row, i) => assert.equal(boxes(row).length, boxes(boxes(full)[i]).length, `${p.id}: kolom row ${i}`));
  }
});

test("section dengan contoh isi tetap bisa dipilih; template tetap berisi", () => {
  const withContent = SECTION_PRESETS.filter((p) => countEls(createSectionFromPreset(p)) > 0);
  assert.ok(withContent.length > 0);
  for (const p of withContent) {
    assert.ok(countEls(createSectionForEditor(p, true)) > 0, p.id);
    assert.ok(countEls(createSectionFromPreset(p)) > 0, `${p.id}: createSectionFromPreset (dipakai template) tidak berubah`);
  }
  const src = createSectionFromPreset(withContent[0]);
  const before = JSON.stringify(src);
  emptySection(src);
  assert.equal(JSON.stringify(src), before, "emptySection tidak mengubah input");
});

/* --------------------------- Search designs --------------------------- */

test("cari desain: tanpa beda huruf besar/aksen, semua kata harus cocok", () => {
  const list = [{ name: "Beranda Kopi" }, { name: "Tentang Kami" }, { name: "Café Menu Kopi" }, { name: "Kontak" }];
  assert.equal(filterDesigns(list, "").length, 4);
  assert.equal(filterDesigns(list, "   ").length, 4);
  assert.deepEqual(filterDesigns(list, "kopi").map((d) => d.name), ["Beranda Kopi", "Café Menu Kopi"]);
  assert.deepEqual(filterDesigns(list, "CAFE kopi").map((d) => d.name), ["Café Menu Kopi"]);
  assert.deepEqual(filterDesigns(list, "zzz"), []);
});

/* ------------------------------ Chart ------------------------------ */

const chartPage = (state = {}) => {
  const sec = createSectionFromPreset("single");
  sec.children[0].children.push(createElementNode("chart", { ...structuredClone(D.chart.defaults), ...state }, "Chart"));
  return createPageRoot([sec]);
};

test("chart: elemen Data gratis, berikon, butuh library chartjs", () => {
  assert.equal(D.chart.group, "Data");
  assert.ok(!D.chart.premium);
  assert.ok(ELEMENT_ICON.chart);
  assert.deepEqual(D.chart.libraries, ["chartjs"]);
  assert.match(CDN, /chart\.js@\d+\.\d+\.\d+\//);
});

test("chart: data diparse & dibersihkan (maks. 2 seri, 24 baris, angka aman)", () => {
  const d = parseChartData({ series: "A, B, C", rows: ["Jan, 1, 2", "", "Feb, x, 3", ...Array.from({ length: 30 }, (_, i) => `L${i}, ${i}`)] });
  assert.deepEqual(d.series.map((s) => s.name), ["A", "B"]);
  assert.equal(d.labels.length, 24);
  assert.deepEqual(d.series[0].values.slice(0, 2), [1, 0]);
  assert.deepEqual(parseChartData({ series: "", rows: ["X, 5"] }).series[0].name, "Data");
  const pie = chartConfig({ ...D.chart.defaults, chartType: "pie" });
  assert.equal(pie.data.datasets.length, 1);
  assert.equal(pie.options.scales, undefined);
  assert.equal(chartConfig({ ...D.chart.defaults, chartType: "evil" }).type, "bar");
  assert.match(chartSummary(D.chart.defaults), /Jan: Penjualan 12, Target 10/);
});

test("chart: tampil di 5 framework tanpa peringatan; CDN Chart.js otomatis di <head> HTML", () => {
  const out = compose(chartPage(), { rootClass: "pg", icons });
  assert.deepEqual(out.warnings, []);
  assert.deepEqual(out.libraries, ["chartjs"], "library otomatis walau tidak dipasang manual");
  const html = out.files("html").map((f) => f.content).join("\n");
  assert.ok(html.includes(`<script defer src="${CDN}"`), "script CDN Chart.js (defer) ada di index.html");
  const index = out.files("html").find((f) => f.name === "index.html").content;
  assert.ok(index.indexOf(`<script src="${CDN}"`) < index.indexOf("</head>"), "script CDN Chart.js di dalam <head>");
  assert.equal(index.split(CDN).length, 2, "CDN hanya sekali");
  for (const fw of FRAMEWORKS) {
    const files = out.files(fw);
    assert.ok(files.length > 0, fw);
    const all = files.map((f) => f.content).join("\n");
    assert.ok(all.includes("new Chart(") || all.includes("new Chart(this"), `${fw}: kode grafik`);
    if (fw !== "html") assert.ok(files.some((f) => f.name === "LIBRARIES.md" && f.content.includes("chart.js@")), `${fw}: LIBRARIES.md`);
  }
  const ng = out.files("angular").map((f) => f.content).join("\n");
  assert.match(ng, /ViewChild/);
  assert.match(ng, /implements .*AfterViewInit/);
});

test("chart: tanpa elemen Chart tidak ada CDN Chart.js; teks berbahaya di-escape", () => {
  const sec = createSectionFromPreset("single");
  sec.children[0].children.push(createElementNode("text", structuredClone(D.text.defaults), "Teks"));
  const plain = compose(createPageRoot([sec]), { rootClass: "pg", icons });
  assert.deepEqual(plain.libraries, []);
  assert.ok(!plain.files("html").some((f) => f.content.includes("chart.js")));
  const evil = compose(chartPage({ title: "</script><img src=x onerror=alert(1)>", series: "<b>A</b>" }), { rootClass: "pg", icons });
  for (const fw of FRAMEWORKS) {
    const all = evil.files(fw).map((f) => f.content).join("\n");
    assert.ok(!all.includes("<img src=x"), `${fw}: tidak ada tag mentah`);
    assert.ok(!all.includes("</script><img"), `${fw}: tidak keluar dari <script>`);
  }
});

test("teks petunjuk pustaka elemen tidak tertimpa teks menu Library CDN", async () => {
  const { readFileSync } = await import("node:fs");
  for (const lang of ["id", "en"]) {
    const L = JSON.parse(readFileSync(`src/locales/${lang}.json`, "utf8")).pm.library;
    assert.match(L.hint, /\{\{area\}\}/, `${lang}: pm.library.hint milik pustaka elemen`);
    assert.ok(L.cdnHint && !L.cdnHint.includes("{{area}}"), `${lang}: pm.library.cdnHint milik menu Library`);
  }
});
