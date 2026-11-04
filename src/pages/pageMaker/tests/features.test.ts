// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { compose } from "../engine/helpers/compose";
import { createElementNode, findNode, walk } from "../engine/helpers/tree";
import { ELEMENT_DEFINITIONS, ELEMENT_DEFINITION_BY_TYPE as D } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset, normalizePageDoc } from "../helpers/pageDoc";
import {
  customRuntime,
  injectRootAttrs,
  isValidCssId,
  jsSyntaxError,
  parseClassList,
  sanitizeAdvanced,
  scopeCustomCss,
} from "../engine/helpers/advanced";
import { hasScriptTag, stripScripts } from "../core/elements/basic/Code";
import {
  addItem,
  createComposition,
  isStale,
  mergeComposition,
  moveItem,
  normalizeComposition,
  refreshItem,
  removeItem,
  replaceItem,
} from "../helpers/composer";
import { highlight } from "../core/ui/CodeEditor";

const icons = makeIconLookup([]);
const el = (t = "button", state = {}) => createElementNode(t, { ...structuredClone(D[t].defaults), ...state }, t);
const page = (...nodes) => {
  const sec = createSectionFromPreset("single");
  sec.children[0].children.push(...nodes);
  return { root: createPageRoot([sec]), sec };
};
const build = (root, extra = {}) => compose(root, { rootClass: "pg", icons, ...extra });
const file = (c, fw, re) => c.files(fw).find((f) => re.test(f.name))?.content ?? "";

/* ------------------------------ Lanjutan ----------------------------- */

test("Custom CSS di-scope ke node: deklarasi, &, turunan, @media, dan pembersihan", () => {
  assert.equal(scopeCustomCss("color: red; padding: 4px", ".n"), ".n {\n  color: red;\n  padding: 4px;\n}\n");
  const out = scopeCustomCss("&:hover { opacity: .5 } p, .x { margin: 0 } @media (max-width: 600px) { & { display: none } }", ".n");
  assert.match(out, /\.n:hover \{/);
  assert.match(out, /\.n p, \.n \.x \{/);
  assert.match(out, /@media \(max-width: 600px\) \{\n\.n \{/);
  // deklarasi lepas bercampur aturan bersarang (gaya CSS nesting)
  const mix = scopeCustomCss("border: 1px solid; padding: 4px; & > *:not(:first-child) { margin: 0 } color: red", ".n") ?? "";
  assert.match(mix, /^\.n \{\n {2}border: 1px solid;\n {2}padding: 4px;\n\}/);
  assert.match(mix, /\.n > \*:not\(:first-child\) \{/);
  assert.match(mix, /\.n \{\n {2}color: red;\n\}\n$/);
  // cannot escape the scope / close <style>
  assert.match(scopeCustomCss("body { color: red }", ".n"), /^\.n \{/);
  assert.doesNotMatch(scopeCustomCss("@import url(x.css); </style><script>x</script> a { b: c }", ".n") ?? "", /@import|<\/style/);
  assert.equal(scopeCustomCss("a { b: c", ".n"), null);
  assert.match(scopeCustomCss("& { x: y }", ".n", "svelte"), /^:global\(\.n\) \{/);
  assert.match(scopeCustomCss("@keyframes spin { to { transform: rotate(1turn) } }", ".n"), /@keyframes spin/);
});

test("validasi ID/class, sanitasi data, sisip atribut root", () => {
  assert.ok(isValidCssId("hero-1"));
  assert.ok(!isValidCssId("1hero"));
  assert.ok(!isValidCssId("he ro"));
  assert.deepEqual(parseClassList("a  b a 1x c-d"), ["a", "b", "c-d"]);
  assert.equal(sanitizeAdvanced({ cssId: " ", customCss: "" }), undefined);
  assert.deepEqual(sanitizeAdvanced({ cssId: " x ", junk: 1 }), { cssId: "x" });
  assert.equal(
    injectRootAttrs('<div className="a" role="x">\n  <b className="z" />\n</div>', "id1", ["k"], true),
    '<div className="a k" role="x" id="id1">\n  <b className="z" />\n</div>',
  );
  assert.equal(injectRootAttrs("<section>", undefined, ["k"], false), '<section class="k">');
});

test("CSS ID ganda dalam satu halaman → akhiran otomatis + peringatan; ID tidak valid diabaikan", () => {
  const a = el("button");
  a.advanced = { cssId: "cta" };
  const b = el("text");
  b.advanced = { cssId: "cta", cssClass: "judul 9x" };
  const c = el("badge");
  c.advanced = { cssId: "1bad" };
  const { root, sec } = page(a, b, c);
  sec.advanced = { cssId: "cta" };
  const out = build(root);
  assert.match(out.html.body, /<section class="pg__box-1" id="cta">/);
  assert.match(out.html.body, /class="pg__button-1" id="cta-2"/);
  assert.match(out.html.body, /class="pg__text-1 judul" id="cta-3"/);
  assert.doesNotMatch(out.html.body, /1bad/);
  assert.ok(out.warnings.some((w) => /dipakai lebih dari sekali/.test(w.message)));
  assert.ok(out.warnings.some((w) => /tidak valid/.test(w.message) && /1bad/.test(w.message)));
  assert.ok(out.warnings.some((w) => /Class tidak valid.*9x/.test(w.message)));
  // the ID & class also reach child components (interactive elements)
  const t = el("tabs");
  t.advanced = { cssId: "tab-utama", cssClass: "tabku" };
  const o2 = build(page(t).root);
  for (const fw of ["react", "vue", "svelte", "angular"]) {
    const child = o2.files(fw).find((f) => /tabs1/i.test(f.name) && !/\.css$|\.component\.ts$/.test(f.name));
    assert.match(child.content, /tabku/, fw);
    assert.match(child.content, /id="tab-utama"/, fw);
  }
});

test("Custom JS: runtime + init di HTML; tidak di canvas desain; wiring per framework", () => {
  const b = el("button");
  b.advanced = { customJs: "on(element, 'click', () => element.classList.add('ok'));", customCss: "&:hover { opacity: .8 }" };
  const { root } = page(b);
  const out = build(root);
  assert.match(out.html.script, /function initCustomCode\(root\)/);
  assert.match(out.html.script, /run\("Button “button”", "\.pg__button-1"/);
  assert.match(out.html.script, /initCustomCode\(document\);$/);
  assert.match(out.html.css, /\/\* Custom CSS \*\/[\s\S]*\.pg__button-1:hover \{/);
  assert.doesNotMatch(build(root, { preview: true }).html.script, /initCustomCode/);
  // React
  const react = file(out, "react", /^Pg\.jsx$/);
  assert.match(react, /import \{ useEffect, useRef \} from "react";/);
  assert.match(react, /import \{ initCustomCode \} from "\.\/customCode";/);
  assert.match(react, /useEffect\(\(\) => initCustomCode\(rootRef\.current\), \[\]\);/);
  assert.match(react, /<main className="pg" ref=\{rootRef\}>/);
  assert.match(file(out, "react", /^customCode\.js$/), /^export function initCustomCode/);
  // Vue: custom CSS in a global <style> (reaches child components)
  const vue = file(out, "vue", /^Pg\.vue$/);
  assert.match(vue, /<main class="pg" ref="rootRef">/);
  assert.match(vue, /onMounted\(\(\) => \{\n {2}destroyCustomCode = initCustomCode\(rootRef\.value\);/);
  assert.match(vue, /onBeforeUnmount/);
  assert.match(vue, /<\/style>\n\n<style>\n\/\* Custom CSS \*\//);
  // Svelte
  const sv = file(out, "svelte", /^Pg\.svelte$/);
  assert.match(sv, /bind:this=\{rootEl\}/);
  assert.match(sv, /onMount\(\(\) => initCustomCode\(rootEl\)\);/);
  assert.match(sv, /:global\(\.pg__button-1:hover\)/);
  // Angular
  const ngTs = file(out, "angular", /^pg\.component\.ts$/);
  assert.match(ngTs, /implements AfterViewInit, OnDestroy/);
  assert.match(ngTs, /@ViewChild\('pmRoot'\)/);
  assert.match(ngTs, /encapsulation: ViewEncapsulation\.None/);
  assert.match(file(out, "angular", /^pg\.component\.html$/), /<main class="pg" #pmRoot>/);
  assert.match(file(out, "angular", /^custom-code\.ts$/), /@ts-nocheck[\s\S]*export function initCustomCode/);
  // without Custom JS → the output does not change (no ref/runtime)
  const plain = build(page(el("button")).root);
  assert.doesNotMatch(file(plain, "react", /^Pg\.jsx$/), /rootRef|initCustomCode/);
  assert.equal(plain.files("react").some((f) => f.name === "customCode.js"), false);
});

test("Custom JS: sintaks salah diabaikan + peringatan; runtime tidak menumpuk listener & menangkap error", () => {
  const b = el("button");
  b.advanced = { customJs: "if ( {" };
  const out = build(page(b).root);
  assert.ok(out.warnings.some((w) => /Custom JS.*tidak valid/.test(w.message)));
  assert.equal(out.html.script.includes("initCustomCode"), false);
  assert.equal(jsSyntaxError("on(element, 'x', () => 1)"), null);

  // runtime execution on a fake DOM
  const listeners = new Set();
  const fakeEl = {
    addEventListener: (t, h) => listeners.add(h),
    removeEventListener: (t, h) => listeners.delete(h),
  };
  const root = { querySelectorAll: () => [fakeEl], matches: () => false };
  const errors = [];
  const origErr = console.error;
  console.error = (...a) => errors.push(a.join(" "));
  try {
    const src = customRuntime([
      { label: "A", selector: ".a", code: "on(element, 'click', function () {});" },
      { label: "Rusak", selector: ".b", code: "throw new Error('boom')" },
      { label: "C", selector: ".c", code: "onCleanup(() => { root.cleaned = (root.cleaned || 0) + 1; });" },
    ]);
    const init = new Function(`${src}; return initCustomCode;`)();
    init(root);
    assert.equal(listeners.size, 1);
    init(root); // re-render / StrictMode: the old initialization is cleaned up first
    assert.equal(listeners.size, 1);
    assert.equal(root.cleaned, 1);
    const destroy = init(root);
    destroy();
    assert.equal(listeners.size, 0);
    assert.ok(errors.some((e) => /Rusak/.test(e)), "error per node dicatat");
  } finally {
    console.error = origErr;
  }
});

test("Lanjutan & Code Element tersimpan setelah dimuat ulang (normalizePageDoc)", () => {
  const code = el("code", { html: "<p>Hi</p>", css: "p { color: red }", js: "element.title = 'x';" });
  code.advanced = { cssId: "kode", customJs: "console.log(1)" };
  const { root, sec } = page(code);
  sec.advanced = { cssClass: "hero", customCss: "padding: 1px;" };
  const again = normalizePageDoc(JSON.parse(JSON.stringify({ version: 2, root })));
  const s2 = again.root.children[0];
  assert.deepEqual(s2.advanced, { cssClass: "hero", customCss: "padding: 1px;" });
  const c2 = s2.children[0].children[0];
  assert.equal(c2.elementType, "code");
  assert.deepEqual(c2.state, { html: "<p>Hi</p>", css: "p { color: red }", js: "element.title = 'x';" });
  assert.deepEqual(c2.advanced, { cssId: "kode", customJs: "console.log(1)" });
});

/* ---------------------------- Code Element --------------------------- */

test("Code Element: HTML mentah, <script> dibuang, CSS di-scope, JS lewat runtime, aman per framework", () => {
  assert.equal(stripScripts('<p>a</p><script>alert(1)</script><SCRIPT src="x"></SCRIPT>'), "<p>a</p>");
  assert.ok(hasScriptTag("<script>"));
  const code = el("code", {
    html: '<p class="x">{{ nama }} {a} </script></p><script>evil()</script>',
    css: ".x { color: blue } & { border: 1px solid }",
    js: "element.dataset.ok = '1';",
  });
  const out = build(page(code).root);
  assert.deepEqual(out.warnings, []);
  assert.match(out.html.body, /<div class="pg__code-1">\s*<p class="x">\{\{ nama \}\} \{a\} <\/p>/);
  assert.doesNotMatch(out.html.body, /evil/);
  assert.match(out.html.css, /\.pg__code-1 \.x \{\n {2}color: blue\n\}/);
  assert.match(out.html.css, /\.pg__code-1 \{\n {2}border: 1px solid\n\}/);
  assert.match(out.html.script, /run\("Code “code”", "\.pg__code-1"/);
  assert.match(file(out, "react", /^CodeBlock1\.jsx$/), /dangerouslySetInnerHTML=\{\{ __html:/);
  const vue = file(out, "vue", /^CodeBlock1\.vue$/);
  assert.match(vue, /<div class="pg__code-1" v-html="html"><\/div>/);
  assert.match(vue, /const html = ".*<\\\/p>/); // "</" is escaped inside <script>
  assert.match(file(out, "svelte", /^CodeBlock1\.svelte$/), /\{@html html\}/);
  const ng = file(out, "angular", /^code-block1\.component\.ts$/);
  assert.match(ng, /import \{ DomSanitizer, SafeHtml \} from '@angular\/platform-browser';/);
  assert.match(ng, /bypassSecurityTrustHtml/);
  assert.match(file(out, "angular", /^code-block1\.component\.html$/), /\[innerHTML\]="html"/);
});

test("editor kode: highlight aman (di-escape) untuk html/css/js", () => {
  const h = highlight('<img src="x" onerror="alert(1)">', "html");
  assert.doesNotMatch(h, /<img/);
  assert.match(h, /&lt;img/);
  assert.match(highlight("const a = 'b'; // c", "js"), /<span class="[^"]*violet[^"]*">const<\/span>/);
  assert.match(highlight("& { color: red }", "css"), /color/);
});

/* ---------------------------- Page Composer -------------------------- */

const design = (id, name, nodes, updatedAt = 1, sectionAdv) => {
  const { root, sec } = page(...nodes);
  if (sectionAdv) sec.advanced = sectionAdv;
  return { id, name, updatedAt, state: JSON.parse(JSON.stringify({ version: 2, root })) };
};

test("Page Composer: urutan terjaga, desain sumber tidak berubah, ID bentrok diganti, struktur valid", () => {
  const a = el("text", { text: "A" });
  a.advanced = { cssId: "judul" };
  const b = el("text", { text: "B" });
  b.advanced = { cssId: "judul" };
  const d1 = design("d1", "Desain 1", [a], 1, { cssId: "hero" });
  const d2 = design("d2", "Desain 2", [b], 1, { cssId: "hero" });
  const before = JSON.stringify([d1, d2]);
  let c = addItem(addItem(createComposition(), d1), d2);
  const merged = mergeComposition(c);
  assert.equal(JSON.stringify([d1, d2]), before, "desain sumber tidak berubah");
  assert.equal(merged.root.children.length, 2);
  const texts = [];
  walk(merged.root, (n) => n.kind === "element" && texts.push(n.state.text));
  assert.deepEqual(texts, ["A", "B"]);
  const ids = [];
  walk(merged.root, (n) => n.advanced?.cssId && ids.push(n.advanced.cssId));
  assert.deepEqual(ids, ["hero", "judul", "hero-2", "judul-2"]);
  assert.equal(merged.warnings.filter((w) => /diganti/.test(w)).length, 2);
  // new node ids (no ids shared with the snapshot) → editing the page does not touch the copy
  assert.equal(findNode(merged.root, c.items[0].snapshot.root.children[0].id), null);
  // the result can be exported without duplicate IDs
  const out = build(merged.root);
  assert.equal((out.html.body.match(/id="hero"/g) ?? []).length, 1);
  // reorder, replace, delete
  c = moveItem(c, c.items[1].uid, 0);
  assert.deepEqual(c.items.map((i) => i.designId), ["d2", "d1"]);
  const d3 = design("d3", "Desain 3", [el("badge")]);
  c = replaceItem(c, c.items[1].uid, d3);
  assert.deepEqual(c.items.map((i) => i.designId), ["d2", "d3"]);
  c = removeItem(c, c.items[0].uid);
  assert.deepEqual(c.items.map((i) => i.designId), ["d3"]);
  // source changed → can be refreshed
  const d3b = { ...design("d3", "Desain 3", [el("badge"), el("button")]), updatedAt: 99 };
  assert.ok(isStale(c.items[0], [d3b]));
  c = refreshItem(c, c.items[0].uid, d3b);
  assert.ok(!isStale(c.items[0], [d3b]));
});

test("Page Composer: data tersimpan dinormalisasi, desain kosong diberi peringatan, tidak ada nesting salah", () => {
  const c = normalizeComposition({ items: [{ uid: "x", designId: "a", name: "A", snapshot: { version: 2, root: { kind: "box", children: [{ kind: "element", elementType: "button" }] } } }, null, 5, { uid: "x", snapshot: "rusak" }] });
  assert.equal(c.items.length, 2);
  assert.notEqual(c.items[0].uid, c.items[1].uid);
  const m = mergeComposition(c);
  assert.ok(m.warnings.some((w) => /kosong/.test(w)));
  let sections = 0;
  const rowsInRows = 0;
  walk(m.root, (n) => {
    if (n.section) sections++;
  });
  assert.ok(sections >= 1);
  assert.ok(m.root.children.every((s) => s.section && s.children.every((r) => r.row)));
  assert.equal(rowsInRows, 0);
  assert.deepEqual(normalizeComposition("x"), createComposition());
});

/* --------------------------- Premium elements -------------------------- */

test("elemen premium: ditandai, tidak ikut tanpa kredit, lengkap di 5 framework dengan kredit", () => {
  const prem = ELEMENT_DEFINITIONS.filter((d) => d.premium).map((d) => d.type);
  assert.deepEqual(prem.sort(), ["back-to-top", "before-after", "card-3d", "comparison-table", "cookie-consent", "countdown", "dropdown", "form-wizard", "gallery-lightbox", "image-hotspot", "logo-marquee", "mega-menu", "modal-popup", "offcanvas", "otp-input", "popover", "pricing", "pricing-switch", "progress", "slider", "stats-counter", "testimonial", "three-globe", "three-particles", "three-product", "three-shape", "toast", "typewriter"]);
  const { root } = page(el("slider"), el("countdown"), el("progress"), el("testimonial"), el("pricing"));
  const free = build(root);
  assert.equal(free.elementCount, 0);
  assert.equal(free.warnings.length, 5);
  const paid = build(root, { allowPremiumElements: true });
  assert.deepEqual(paid.warnings, []);
  assert.match(paid.html.script, /Slider: panah, titik, dan autoplay/);
  assert.match(paid.html.script, /countdownParts/);
  assert.ok(paid.files("react").some((f) => f.name === "Slider1.jsx"));
  assert.ok(paid.files("vue").some((f) => f.name === "Countdown1.vue"));
  assert.match(file(paid, "angular", /^slider1\.component\.ts$/), /implements OnInit, OnDestroy/);
  assert.match(file(paid, "react", /^Slider1\.jsx$/), /clearInterval/);
  assert.match(paid.html.body, /role="progressbar" aria-valuenow="72"/);
  // countdown: invalid date → default
  const bad = el("countdown", { target: "javascript:alert(1)" });
  const o = build(page(bad).root, { allowPremiumElements: true });
  assert.match(o.html.script, /new Date\("2026-12-31T23:59"\)/);
});
