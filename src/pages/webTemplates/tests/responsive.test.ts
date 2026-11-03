// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { compose, fluidPx, gridTrackCount } from "../../pageMaker/engine/helpers/compose";
import { fontSizeCss } from "../../pageMaker/core/helpers/generatorCss";
import { createBox } from "../../pageMaker/engine/helpers/tree";
import { normalizeDoc } from "../../pageMaker/engine/helpers/migrate";
import { IMG_PLACEHOLDER, IMG_FALLBACK_SCRIPT } from "../../pageMaker/helpers/imagePlaceholder";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate } from "../registry";
import { templateFiles } from "../exportTemplate";

const icons = makeIconLookup([]);

test("ukuran cair: clamp antara HP dan desktop", () => {
  assert.equal(fluidPx(24, 24), "24px");
  assert.match(fluidPx(96, 53), /^clamp\(53px, [\d.-]+px \+ [\d.]+vw, 96px\)$/);
  assert.equal(fontSizeCss({ fontSize: 48 }), "48px");
  assert.equal(fontSizeCss({ fontSize: 18, fluidType: true }), "18px");
  assert.match(fontSizeCss({ fontSize: 48, fluidType: true }), /^clamp\(2\.188rem, .+, 3rem\)$/);
  assert.equal(gridTrackCount("repeat(3, minmax(0, 1fr))"), 3);
  assert.equal(gridTrackCount("minmax(0, 1.5fr) minmax(0, 1fr) 200px"), 3);
});

test("grid: tablet 2 kolom, HP 2 kolom / geser, selang-seling & hover", () => {
  const kids = () => [1, 2, 3, 4].map(() => createBox("stack"));
  const g = createBox("grid", { columns: "repeat(4, minmax(0, 1fr))", stackOnMobile: true, mobileGrid: "scroll", stagger: true, children: kids() });
  const two = createBox("grid", { columns: "repeat(3, minmax(0, 1fr))", stackOnMobile: true, mobileGrid: "two", children: kids().slice(0, 3) });
  const card = createBox("stack", { hoverLift: true });
  const root = createBox("stack", { children: [g, two, card] });
  const css = compose(root, { rootClass: "pg", icons }).html.css;
  assert.match(css, /@media \(min-width: 641px\) and \(max-width: 1024px\) \{[^@]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 640px\) \{[\s\S]*grid-auto-flow: column;[\s\S]*scroll-snap-type: x mandatory;/);
  assert.match(css, /> \* \{\s*scroll-snap-align: start;/);
  assert.match(css, /@media \(min-width: 1025px\) \{[\s\S]*> :nth-child\(2n\) \{\s*position: relative;\s*top: 40px;/);
  assert.match(css, /@media \(hover: hover\)[\s\S]*:hover \{\s*translate: 0 -6px;/);
  // Tiga kolom berisi tiga kartu tetap tiga kolom di tablet (tanpa kartu yatim).
  const tablet = css.slice(css.indexOf("max-width: 1024px"));
  assert.equal((tablet.slice(0, tablet.indexOf("@media")).match(/repeat\(2/g) ?? []).length, 1);
  // Properti baru tersimpan lewat normalisasi dokumen.
  const doc = normalizeDoc({ version: 2, root });
  const [ng] = doc.root.children;
  assert.equal(ng.mobileGrid, "scroll");
  assert.equal(ng.stagger, true);
  assert.equal(doc.root.children[2].hoverLift, true);
});

test("polesan template: judul cair, kartu hover, grid HP; tanpa @media ukuran lama", () => {
  let fluid = 0;
  let lift = 0;
  let mobileGrid = 0;
  for (const t of WEB_TEMPLATES.slice(0, 40)) {
    for (const p of buildTemplatePages(t, "id")) {
      const walk = (n) => {
        if (n.kind === "element") {
          if (n.state.fluidType) fluid++;
          if (n.elementType === "text" && n.state.fluidType) assert.doesNotMatch(n.advanced?.customCss ?? "", /@media \(max-width: 640px\) \{\s*& \{ font-size/);
          return;
        }
        if (n.hoverLift) lift++;
        if (n.mobileGrid) mobileGrid++;
        n.children.forEach(walk);
      };
      walk(p.doc.root);
    }
  }
  assert.ok(fluid > 100 && lift > 50 && mobileGrid > 10, `${fluid}/${lift}/${mobileGrid}`);
});

test("placeholder gambar: skrip fallback ada di setiap HTML unduhan", () => {
  assert.match(IMG_PLACEHOLDER, /^data:image\/svg\+xml,/);
  assert.match(IMG_FALLBACK_SCRIPT, /addEventListener\("error"/);
  const t = getTemplate("cafe-kopi-senja");
  const { files } = templateFiles(t, "id", t.content.brand, buildTemplatePages(t, "id"), { icons, allowPremiumElements: true });
  const html = files.filter((f) => f.name.endsWith(".html"));
  assert.ok(html.length > 1);
  for (const f of html) assert.ok(f.content.includes("data-img-placeholder"), f.name);
});
