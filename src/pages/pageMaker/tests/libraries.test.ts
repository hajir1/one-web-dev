import test from "node:test";
import assert from "node:assert/strict";
import { compose } from "../engine/helpers/compose";
import { createElementNode } from "../engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset, normalizePageDoc } from "../helpers/pageDoc";
import { addPage, createSiteDoc } from "../helpers/site";
import { buildSite } from "../helpers/siteExport";
import {
  DEFAULT_LIBS,
  LIBRARIES,
  libraryAttrs,
  libraryHead,
  libraryReadme,
  libraryScripts,
  sanitizeLibraryList,
  sanitizeLibs,
} from "../engine/helpers/libraries";

const icons = makeIconLookup([]);
const FRAMEWORKS = ["html", "react", "vue", "svelte", "angular"];

function pageRoot(libraries, libs) {
  const sec = createSectionFromPreset("single");
  const t = createElementNode("text", { ...structuredClone(D.text.defaults), text: "Halo" }, "Judul");
  t.libs = libs;
  sec.children[0].children.push(t);
  sec.libs = { aos: { ...DEFAULT_LIBS.aos, effect: "zoom-in" } };
  const root = createPageRoot([sec]);
  if (libraries) root.libraries = libraries;
  return root;
}
const ALL_LIBS = { aos: { ...DEFAULT_LIBS.aos, delay: 200 }, animate: { ...DEFAULT_LIBS.animate, speed: "fast" }, tilt: { ...DEFAULT_LIBS.tilt, glare: true } };

test("library: daftar CDN memakai versi tetap (bukan @latest) dan lisensi MIT; AOS/Animate/Tilt tanpa CDN", () => {
  assert.deepEqual(LIBRARIES.map((l) => l.id), ["aos", "animate", "tilt", "scroll", "chartjs", "aframe", "three"]);
  // v25: efek dijalankan runtime OWD Motion yang ditanam di HTML.
  for (const id of ["aos", "animate", "tilt"]) {
    const l = LIBRARIES.find((x) => x.id === id);
    assert.ok(l.builtin && !l.css && !l.js, id);
  }
  for (const l of LIBRARIES) {
    for (const u of [l.css, l.js, l.esm].filter(Boolean)) {
      assert.match(u, /^https:\/\/cdn\.jsdelivr\.net\/npm\/[a-z.-]+@\d+\.\d+\.\d+\//, u);
      assert.ok(u.includes(l.version), u);
    }
    if (l.id !== "scroll") assert.equal(l.license, "MIT");
  }
});

test("library: OWD Scroll (v26) ditanam tanpa CDN, atribut data-scroll, runtime terpisah dari OWD Motion", () => {
  const l = LIBRARIES.find((x) => x.id === "scroll");
  assert.ok(l.builtin && !l.css && !l.js && !l.esm);
  assert.deepEqual(sanitizeLibs({ scroll: { effect: "terbang", amount: 9999, delay: 77 } }), { scroll: { effect: "split", amount: 200, delay: 100 } });
  assert.deepEqual(sanitizeLibs({ scroll: { effect: "marquee", amount: 0 } }), { scroll: { effect: "marquee", amount: 0, delay: 0 } });
  const { attrs } = libraryAttrs({ scroll: { effect: "counter", amount: 0, delay: 300 } }, ["scroll"]);
  assert.deepEqual(attrs, { "data-scroll": "counter", "data-scroll-delay": "300" });
  assert.deepEqual(libraryAttrs({ scroll: { effect: "pin", amount: 80, delay: 0 } }, []).attrs, {}, "tidak terpasang → tanpa atribut");
  const head = libraryHead(["scroll"]), tail = libraryScripts(["scroll"]);
  assert.ok(head.includes("owds-mq") && !head.includes("owd-motion"), "CSS scroll saja, tanpa OWD Motion");
  assert.ok(tail.includes("window.OWDScroll") && !tail.includes("window.OWDMotion") && !/cdn\./.test(head + tail));
  assert.ok(!/gsap/i.test(tail), "tanpa GSAP");
  assert.ok(!libraryHead(["aos"]).includes("owds-"), "template lama tidak ikut membawa runtime scroll");
  assert.match(libraryReadme(["scroll"]), /OWD Scroll/);
});

test("library: sanitize menolak nilai asing, menjepit angka, membuang duplikat", () => {
  assert.equal(sanitizeLibs(null), undefined);
  assert.equal(sanitizeLibs({ foo: 1 }), undefined);
  assert.deepEqual(sanitizeLibs({ aos: { effect: "meledak", duration: 99999, delay: -5, once: false } }), {
    aos: { effect: "fade-up", duration: 3000, delay: 0, once: false },
  });
  assert.deepEqual(sanitizeLibs({ tilt: { max: 90, scale: 5, glare: "ya" } }), { tilt: { max: 35, scale: 1.2, glare: false } });
  assert.deepEqual(sanitizeLibraryList(["tilt", "aos", "aos", "jquery"]), ["aos", "tilt"]);
  assert.equal(sanitizeLibraryList([]), undefined);
});

test("library: atribut hanya keluar untuk library yang terpasang", () => {
  assert.deepEqual(libraryAttrs(ALL_LIBS, []), { attrs: {}, classes: [] });
  const a = libraryAttrs(ALL_LIBS, ["aos", "animate", "tilt"]);
  assert.equal(a.attrs["data-aos"], "fade-up");
  assert.equal(a.attrs["data-aos-delay"], "200");
  assert.equal(a.attrs["data-tilt-glare"], "true");
  assert.deepEqual(a.classes, ["animate__animated", "animate__fadeInUp", "animate__fast"]);
});

test("library: atribut & class sampai ke kode ekspor di 5 framework", () => {
  const out = compose(pageRoot(["aos", "animate", "tilt"], ALL_LIBS), { rootClass: "pg", icons });
  assert.deepEqual(out.libraries, ["aos", "animate", "tilt"]);
  for (const fw of FRAMEWORKS) {
    const all = out.files(fw).map((f) => f.content).join("\n");
    assert.match(all, /data-aos="zoom-in"/, fw);
    assert.match(all, /data-aos="fade-up"/, fw);
    assert.match(all, /animate__fadeInUp/, fw);
    assert.match(all, /data-tilt-max="10"/, fw);
  }
  const index = out.files("html").find((f) => /index\.html$/.test(f.name)).content;
  // Runtime OWD Motion: CSS + penanda JS di <head>, skrip di akhir <body>, tanpa CDN.
  assert.doesNotMatch(index, /cdn\.jsdelivr|aos\.css|vanilla-tilt\.min/);
  assert.match(index, /classList\.add\("owd-motion"\)/);
  assert.match(index, /html\.owd-motion \[data-aos\]/);
  assert.match(index, /@keyframes fadeInUp/);
  assert.ok(index.indexOf("@keyframes fadeInUp") < index.indexOf("</head>"));
  assert.ok(index.indexOf("window.OWDMotion") > index.indexOf("<body"));
  assert.equal(index.split("window.OWDMotion =").length, 2, "runtime sekali per halaman");
  for (const fw of ["react", "vue", "svelte", "angular"]) {
    const md = out.files(fw).find((f) => /LIBRARIES\.md$/.test(f.name));
    assert.ok(md, fw);
    assert.match(md.content, /OWD Motion/);
    assert.ok(out.files(fw).some((f) => f.name === "owd-motion.js" && /window\.OWDMotion/.test(f.content)), `${fw}: runtime ikut diunduh`);
  }
});

test("library: tanpa library terpasang, tidak ada CDN maupun atribut (libs elemen diabaikan)", () => {
  const out = compose(pageRoot(undefined, ALL_LIBS), { rootClass: "pg", icons });
  assert.deepEqual(out.libraries, []);
  for (const fw of FRAMEWORKS) {
    const all = out.files(fw).map((f) => f.content).join("\n");
    assert.doesNotMatch(all, /data-aos|animate__|data-tilt|cdn\.jsdelivr/, fw);
    assert.ok(!out.files(fw).some((f) => /LIBRARIES\.md$/.test(f.name)), fw);
  }
  assert.equal(libraryHead([]), "");
  assert.equal(libraryScripts([]), "");
  assert.equal(libraryReadme([]), "");
});

test("library: tersimpan & dibuka ulang (normalizePageDoc) tanpa hilang", () => {
  const root = pageRoot(["tilt", "aos"], { tilt: DEFAULT_LIBS.tilt });
  const doc = normalizePageDoc(JSON.parse(JSON.stringify({ version: 2, root })));
  assert.deepEqual(doc.root.libraries, ["aos", "tilt"]);
  assert.deepEqual(doc.root.children[0].libs.aos.effect, "zoom-in");
  assert.deepEqual(doc.root.children[0].children[0].children[0].libs, { tilt: DEFAULT_LIBS.tilt });
});

test("library: ekspor website memuat runtime efek per halaman & README mencatat library", () => {
  const mk = (id, name, libraries) => ({ id, name, updatedAt: 1, state: JSON.parse(JSON.stringify({ version: 2, root: pageRoot(libraries, ALL_LIBS) })) });
  const a = mk("a", "Beranda", ["aos"]), b = mk("b", "Kontak", undefined);
  let doc = createSiteDoc();
  for (const d of [a, b]) doc = addPage(doc, d);
  const built = buildSite({ id: "s", name: "Situs", updatedAt: 1, state: doc }, [a, b], { icons });
  const html = built.files("html");
  const home = html.find((f) => /index\.html$/.test(f.name)).content;
  const kontak = html.find((f) => /kontak\.html$/.test(f.name)).content;
  assert.match(home, /owd-motion/);
  assert.doesNotMatch(kontak, /owd-motion/);
  for (const fw of FRAMEWORKS) {
    const readme = built.files(fw).find((f) => /README\.md$/.test(f.name));
    assert.ok(readme, fw);
    assert.match(readme.content, /AOS \(Animate On Scroll\) 2\.3\.4/, fw);
  }
});
