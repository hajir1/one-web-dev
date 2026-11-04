// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import {
  baseFontStack,
  fontLoader,
  fontLoadCss,
  fontStack,
  fontsUsedIn,
  googleFontsUrl,
  isSafeFontUrl,
  isValidFontName,
  sanitizeFonts,
  validateFontInput,
  withFontCss,
} from "../../pageMaker/core/helpers/fontCss";
import { compose } from "../../pageMaker/engine/helpers/compose";
import { createDefaultDoc } from "../../pageMaker/engine/helpers/migrate";
import { createElementNode, insertNode } from "../../pageMaker/engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../../pageMaker/core/elementDefinitions";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { MENU_SECTIONS, isLeafActive } from "../../../config/menu";

const font = (over = {}) => ({
  id: "f1",
  name: "Poppins",
  source: "google",
  fallback: "sans-serif",
  weights: [400, 700],
  url: "",
  createdAt: 1,
  ...over,
});
const fileFont = (over = {}) =>
  font({ id: "f2", name: "Merek", source: "url", url: "https://x.test/f/merek.woff2", ...over });

test("nama font: huruf/angka/spasi/-/_ saja", () => {
  for (const ok of ["Poppins", "Playfair Display", "Fira_Code-2", "A"]) assert.ok(isValidFontName(ok), ok);
  for (const bad of ["", " ", "Pop\"pins", "a;b", "x}y", "<b>", "-Dash", "a".repeat(61), "Pop'pins"])
    assert.ok(!isValidFontName(bad), bad);
});

test("URL font: hanya http(s) atau path dari root; tanpa karakter yang bisa menutup url()", () => {
  for (const ok of ["https://a.test/x.woff2", "http://a.test/x.css?family=A", "/fonts/x.ttf"])
    assert.ok(isSafeFontUrl(ok), ok);
  for (const bad of [
    "javascript:alert(1)",
    "data:font/woff2;base64,AAAA",
    "//evil.test/x.css",
    "https://a.test/x.css\") ;} body{display:none",
    "https://a.test/a b.css",
    "https://a.test/x'.css",
    "https://a.test/x(1).css",
    "relative/x.css",
    "",
  ])
    assert.ok(!isSafeFontUrl(bad), bad);
});

test("Google Fonts: URL benar (spasi jadi +, bobot terurut, 400 saja tanpa wght)", () => {
  assert.equal(googleFontsUrl("Poppins", [400]), "https://fonts.googleapis.com/css2?family=Poppins&display=swap");
  assert.equal(
    googleFontsUrl("Playfair Display", [700, 400, 400]),
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
  );
  assert.ok(googleFontsUrl("X", [123, 500]).includes("wght@500&"));
});

test("pemuat font: @import untuk Google/stylesheet, @font-face untuk berkas; URL tak aman → null", () => {
  assert.equal(fontLoader(font()).kind, "import");
  assert.match(fontLoader(font()).css, /^@import url\("https:\/\/fonts\.googleapis\.com\/css2\?family=Poppins:wght@400;700&display=swap"\);$/);
  const css = fontLoader(fileFont());
  assert.equal(css.kind, "face");
  assert.match(css.css, /font-family: "Merek";/);
  assert.match(css.css, /format\("woff2"\)/);
  assert.equal(fontLoader(fileFont({ url: "https://x.test/a.ttf" })).css.includes('format("truetype")'), true);
  assert.equal(fontLoader(fileFont({ url: "https://x.test/a.otf" })).css.includes('format("opentype")'), true);
  assert.equal(fontLoader(fileFont({ url: "https://x.test/style.css" })).kind, "import");
  assert.equal(fontLoader(fileFont({ url: "javascript:alert(1)" })), null);
  assert.equal(fontLoader(font({ name: 'Bad"Name' })), null);
});

test("deteksi font terpakai: hanya dari deklarasi font-family", () => {
  const fonts = [font(), fileFont()];
  const css = `.a { font-family: "Poppins", sans-serif; }\n.b { content: "Merek"; }\n/* "Merek" */`;
  assert.deepEqual(fontsUsedIn(css, fonts).map((f) => f.name), ["Poppins"]);
  assert.deepEqual(fontsUsedIn(".a { color: red; }", fonts), []);
  assert.deepEqual(fontsUsedIn(`.a{font-family:"Merek",serif}`, fonts).map((f) => f.name), ["Merek"]);
});

test("withFontCss: tak berubah tanpa font terpakai; @import selalu sebelum @font-face dan aturan lain", () => {
  const css = `.a { font-family: inherit; }\n`;
  assert.equal(withFontCss(css, [font(), fileFont()]), css);
  assert.equal(withFontCss(css, []), css);
  const used = `.a { font-family: "Merek", serif; }\n.b { font-family: "Poppins", sans-serif; }\n`;
  const out = withFontCss(used, [fileFont(), font()]);
  assert.ok(out.startsWith("@import url("), out);
  assert.ok(out.indexOf("@import") < out.indexOf("@font-face"));
  assert.ok(out.indexOf("@font-face") < out.indexOf(".a {"));
  assert.equal(fontLoadCss(used, [font(), font({ id: "dup" })]).split("@import").length - 1, 1, "duplikat dibuang");
});

test("font dasar: id pustaka, id sistem, atau null", () => {
  const fonts = [font()];
  assert.equal(baseFontStack(fonts, "f1"), '"Poppins", sans-serif');
  assert.equal(baseFontStack(fonts, "sys-georgia"), "Georgia, serif");
  assert.equal(baseFontStack(fonts, "hilang"), null);
  assert.equal(baseFontStack(fonts, null), null);
  assert.equal(fontStack(font({ fallback: "serif" })), '"Poppins", serif');
});

test("validateFontInput: nama dan URL", () => {
  assert.equal(validateFontInput({ name: "Inter", source: "google", fallback: "sans-serif" }), null);
  assert.ok(validateFontInput({ name: "", source: "google", fallback: "sans-serif" }));
  assert.ok(validateFontInput({ name: "A", source: "url", fallback: "serif", url: "" }));
  assert.ok(validateFontInput({ name: "A", source: "url", fallback: "serif", url: "javascript:1" }));
  assert.equal(validateFontInput({ name: "A", source: "url", fallback: "serif", url: "/f/a.woff2" }), null);
});

test("sanitizeFonts: membuang sampah dan data berbahaya dari localStorage", () => {
  assert.deepEqual(sanitizeFonts(null), []);
  assert.deepEqual(sanitizeFonts("x"), []);
  const out = sanitizeFonts([
    font(),
    font(), // id kembar
    { id: "a", name: "ok", source: "url", url: "javascript:alert(1)" },
    { id: "b", name: 'x"; } body{', source: "google" },
    { id: "", name: "NoId" },
    42,
    null,
    { id: "c", name: "Tepat", source: "weird", fallback: "weird", weights: [1, 400, "700", 999] },
  ]);
  assert.deepEqual(out.map((f) => f.id), ["f1", "c"]);
  const c = out[1];
  assert.equal(c.source, "google");
  assert.equal(c.fallback, "sans-serif");
  assert.deepEqual(c.weights, [400, 700]);
});

/* ---------------------------- compose ------------------------------- */

const icons = makeIconLookup([]);
const textNode = (fontFamily) =>
  createElementNode("text", { ...D.text.defaults, fontFamily }, "Text");

function docWith(fontFamily) {
  const doc = createDefaultDoc();
  return insertNode(doc.root, doc.root.id, 0, textNode(fontFamily));
}
const opts = (extra = {}) => ({ rootClass: "demo", designs: {}, icons, ...extra });

test("compose: font pustaka yang dipakai dimuat di CSS HTML (pratinjau dan export)", () => {
  const root = docWith('"Merek", serif');
  for (const preview of [false, true]) {
    const c = compose(root, opts({ fonts: [fileFont()], preview }));
    assert.ok(c.html.css.startsWith("@font-face"), c.html.css.slice(0, 80));
    assert.match(c.html.css, /font-family: "Merek", serif;/);
  }
});

test("compose: tanpa font pustaka / font tak terpakai → CSS identik dengan sebelumnya", () => {
  const root = docWith("");
  const base = compose(root, opts());
  assert.equal(compose(root, opts({ fonts: [font(), fileFont()] })).html.css, base.html.css);
  assert.ok(!base.html.css.includes("@import") && !base.html.css.includes("@font-face"));
  assert.match(base.html.css, /font-family: inherit;/);
});

test("compose: font dasar hanya di root; elemen tetap warisi", () => {
  const root = docWith("");
  const c = compose(root, opts({ fonts: [font()], baseFont: '"Poppins", sans-serif' }));
  const rootRule = c.html.css.match(/\.demo \{[^}]*\}/)[0];
  assert.match(rootRule, /font-family: "Poppins", sans-serif;/);
  assert.equal((c.html.css.match(/font-family: "Poppins"/g) ?? []).length, 1);
  assert.ok(c.html.css.startsWith("@import"), "font dasar ikut dimuat");
});

test("compose: semua framework memuat font di berkas CSS/style yang tepat", () => {
  const root = docWith('"Merek", serif');
  const c = compose(root, opts({ fonts: [fileFont()] }));
  for (const fw of ["html", "react", "vue", "svelte", "angular"]) {
    const files = c.files(fw);
    const withFace = files.filter((f) => f.content.includes("@font-face"));
    assert.ok(withFace.length >= 1, `${fw}: tidak ada @font-face`);
    for (const f of withFace) {
      // @font-face/@import must come before the first rule in its file
      const i = f.content.indexOf("@font-face");
      const firstRule = f.content.search(/\.demo[\s{_]/);
      assert.ok(firstRule === -1 || i < firstRule, `${fw}/${f.name}: urutan`);
    }
  }
});

/* ------------------------------- menu -------------------------------- */

test("menu: 4 kelompok, Web Maker disederhanakan (v20), path unik", () => {
  assert.deepEqual(MENU_SECTIONS.map((s) => s.id), ["data", "media", "web-maker", "vr"]);
  const web = MENU_SECTIONS.find((s) => s.id === "web-maker");
  // v20: the editor, compose & deploy, and global styles moved into Studio.
  assert.deepEqual(web.items.map((i) => i.key), ["websiteHub", "webTemplates", "webMarket"]);
  const paths = MENU_SECTIONS.flatMap((s) => s.items.map((i) => i.path));
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(Object.keys(D).length >= 18);
});

test("menu: Element/Component Maker sudah dihapus; Studio dibuka dari Website Saya", () => {
  const web = MENU_SECTIONS.find((s) => s.id === "web-maker").items;
  const paths = web.map((i) => i.path);
  assert.ok(!paths.includes("/element-maker"));
  assert.ok(!paths.includes("/component-maker"));
  assert.deepEqual(paths, ["/website-builder", "/web-templates", "/web-market"]);
  const hub = web.find((i) => i.key === "websiteHub");
  assert.ok(isLeafActive(hub, "/website-builder/code/abc"), "editor tanpa kode menandai Website Saya");
  assert.ok(!isLeafActive(hub, "/website"));
});
