import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createPageRoot, createSectionForEditor, type PageDoc } from "../helpers/pageDoc";
import { PAGE_PATTERNS, applyChrome, buildPatternPage, duplicatePageDoc, footerOf, headerOf } from "../helpers/studio";
import { addPage, allSiteInfos, createSiteDoc, insertPageAfter, normalizeSiteDoc, setHidden, setLabel } from "../helpers/site";
import { menuItems } from "../core/elements/navigation/Menu";
import { withFormBridge } from "../../../submissions/api";
import { readModel } from "../../webTemplates/codeTemplates/editModel";
import { fieldsForPick, hiddenExcept, withBridge } from "../../webTemplates/codeTemplates/editor/codeStudio";
import { STUDIO_PATH, studioPath } from "../../../config/menu";
import type { SavedDesign } from "../core/store/designStore";

const here = dirname(fileURLToPath(import.meta.url));
const tpl = (id: string) => readFileSync(join(here, "../../webTemplates/codeTemplates/files", `${id}.html`), "utf8");
const design = (id: string, name = id, type = "page", state: unknown = { version: 2, root: createPageRoot() }): SavedDesign => ({ id, name, elementType: type, state, createdAt: 1, updatedAt: 1 }) as SavedDesign;

const homeWithChrome = (): PageDoc => ({
  version: 2,
  root: createPageRoot([createSectionForEditor("navbar", true)!, createSectionForEditor("hero-center", true)!, createSectionForEditor("footer-4", true)!]),
});

/* ------------------------------ Studio ------------------------------ */

test("studio: pola halaman hanya memakai preset gratis yang ada", () => {
  for (const p of PAGE_PATTERNS) {
    const doc = buildPatternPage(p.id, null);
    assert.equal(doc.root.children.length, p.sections.length, p.id);
  }
});

test("studio: halaman baru memakai header & footer beranda (salinan ber-id baru)", () => {
  const home = homeWithChrome();
  const page = buildPatternPage("about", home);
  assert.equal(page.root.children.length, 2 + 3);
  const h = headerOf(page)!;
  const f = footerOf(page)!;
  assert.ok(h && f);
  assert.notEqual(h.id, headerOf(home)!.id);
  assert.notEqual(f.id, footerOf(home)!.id);
  assert.equal(buildPatternPage("blank", home).root.children.length, 2);
});

test("studio: samakan header & footer mengganti yang lama, tidak menyentuh isi", () => {
  const home = homeWithChrome();
  const other = buildPatternPage("services", null);
  const before = other.root.children.length;
  const { doc, changed } = applyChrome(home, other);
  assert.ok(changed);
  assert.equal(doc.root.children.length, before + 2);
  // Jalankan lagi: header/footer diganti, jumlah tetap.
  const again = applyChrome(home, doc).doc;
  assert.equal(again.root.children.length, before + 2);
  // Sumber tanpa header/footer → tidak berubah.
  assert.equal(applyChrome(other, doc).changed, false);
});

test("studio: duplikat halaman memberi id baru", () => {
  const home = homeWithChrome();
  const copy = duplicatePageDoc(home);
  assert.equal(copy.root.children.length, home.root.children.length);
  assert.notEqual(copy.root.children[0].id, home.root.children[0].id);
});

test("studio: tautan Studio", () => {
  assert.equal(studioPath("abc"), `${STUDIO_PATH}/abc`);
  assert.equal(studioPath("a b", "p1"), `${STUDIO_PATH}/a%20b?page=p1`);
});

/* ------------------------- halaman & menu -------------------------- */

test("situs: sisipkan halaman setelah halaman aktif, sembunyikan dari menu", () => {
  let doc = createSiteDoc();
  doc = addPage(doc, design("a", "Beranda"));
  doc = addPage(doc, design("c", "Kontak"));
  doc = insertPageAfter(doc, design("b", "Tentang"), "a");
  assert.deepEqual(doc.pages.map((p) => p.designId), ["a", "b", "c"]);
  doc = setHidden(doc, "c", true);
  doc = setLabel(doc, "c", "Hubungi");
  const n = normalizeSiteDoc(JSON.parse(JSON.stringify(doc)));
  assert.equal(n.pages.find((p) => p.designId === "c")?.hidden, true);
  assert.equal(n.pages.find((p) => p.designId === "c")?.label, "Hubungi");
  assert.equal(setHidden(n, "c", false).pages.find((p) => p.designId === "c")?.hidden, undefined);

  const site = design("s", "Situs", "site", n);
  const designs = ["a", "b", "c"].map((id) => design(id));
  const infos = allSiteInfos([site], designs);
  const ctx = { sites: infos, currentSiteId: "s" };
  const { items } = menuItems({ siteId: "", pageIds: [] }, ctx as never);
  assert.deepEqual(items.map((p) => p.designId), ["a", "b"], "halaman tersembunyi tidak masuk menu otomatis");
  const picked = menuItems({ siteId: "", pageIds: ["c"] }, ctx as never).items;
  assert.deepEqual(picked.map((p) => p.designId), ["c"], "pilihan manual tetap dihormati");
});

/* ------------------------ kiriman & undangan ------------------------ */

test("kiriman: alamat server disisipkan sekali sebelum </head>", () => {
  const ep = { submitUrl: "https://api.contoh.id/f/abc", wishesUrl: "https://api.contoh.id/f/abc/wishes" };
  const out = withFormBridge("<html><head><title>x</title></head><body></body></html>", ep);
  assert.match(out, /<script>window\.OWD_FORM = \{"submit":"https:\/\/api\.contoh\.id\/f\/abc","wishes":"[^"]+"\};<\/script>\n<\/head>/);
  assert.equal(withFormBridge(out, ep), out);
  assert.equal(withFormBridge("<p>x</p>", null), "<p>x</p>");
  assert.ok(!withFormBridge("<head></head>", { submitUrl: "</script><b>", wishesUrl: "" }).includes("</script><b>"));
});

test("undangan: mesin membaca OWD_FORM, punya honeypot, dan mengirim RSVP/ucapan", () => {
  const html = tpl("undangan-nikah-rangkai-kasih");
  assert.ok(html.includes("window.OWD_FORM"));
  assert.ok(html.includes("_hp"));
  assert.ok(html.includes('_kind: "rsvp"') || html.includes("_kind:\"rsvp\"") || html.includes("_kind: 'rsvp'"));
  assert.ok(html.includes("keepalive"));
});

/* --------------------- studio template kode ------------------------ */

test("studio kode: jembatan hanya di pratinjau, sebelum </body>", () => {
  const out = withBridge("<html><body><p>a</p></body></html>", { edit: true, scrollY: 120, opened: true });
  assert.ok(out.indexOf("owd-studio-css") < out.indexOf("</body>"));
  assert.match(out, /"scrollY":120/);
  assert.ok(!withBridge("x", { edit: false, scrollY: 0, opened: false }).includes("</script></body>"));
});

test("studio kode: klik bagian undangan → isian CONFIG bagian itu saja", () => {
  const model = readModel(tpl("undangan-nikah-rangkai-kasih"));
  const f = fieldsForPick(model, { section: "galeri", sectionTexts: [], sectionLinks: [] });
  assert.deepEqual(f.data, [{ name: "CONFIG", keys: ["judulGaleri", "pengantarGaleri", "galeri"] }]);
  const cfg = model.data.find((d) => d.name === "CONFIG")!;
  const hidden = hiddenExcept(cfg.value, f.data[0].keys, cfg.hidden);
  assert.ok(hidden.includes("acara") && hidden.includes("id") && !hidden.includes("galeri"));
  const rsvp = fieldsForPick(model, { section: "rsvp", sectionTexts: [], sectionLinks: [] });
  assert.deepEqual(rsvp.data[0].keys, ["rsvp"]);
});

test("studio kode: klik teks → satu isian; klik bidang section → semua teks di section", () => {
  const model = readModel(tpl("folio-naya-kirana"));
  const key = model.texts[0].key;
  const one = fieldsForPick(model, { text: key, section: "beranda", sectionTexts: [key, model.texts[1].key], sectionLinks: [] });
  assert.deepEqual(one.texts, [key]);
  assert.equal(one.data.length, 0);
  const sec = fieldsForPick(model, { section: "proyek", sectionTexts: [key, "tidak-ada"], sectionLinks: [] });
  assert.deepEqual(sec.texts, [key], "kunci yang tidak dikenal diabaikan");
  assert.deepEqual(sec.data, [{ name: "PROJECTS", keys: null }]);
});

test("studio kode: klik bagian katalog website 3D bisnis → daftar katalog & kategori bisa diubah", () => {
  const model = readModel(tpl("biz-kopi-lereng-ijen"));
  const f = fieldsForPick(model, { section: "katalog", sectionTexts: [], sectionLinks: [] });
  const daftar = f.data.find((d) => d.name === "DAFTAR");
  assert.deepEqual(daftar?.keys, ["kategori", "katalog"]);
  const blk = model.data.find((d) => d.name === "DAFTAR")!;
  const hidden = hiddenExcept(blk.value, daftar!.keys, blk.hidden);
  assert.ok(hidden.includes("faq") && hidden.includes("paket") && !hidden.includes("katalog"));
});
