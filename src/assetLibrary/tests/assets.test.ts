import { test } from "node:test";
import assert from "node:assert/strict";
import { assetFileName, assetIdOf, assetRef, findAssetIds, isAssetRef, MISSING_ASSET, replaceAssetRefs } from "../refs";
import { layoutFor, packAssets, relativePath, type AssetSource } from "../pack";
import { assetUsage } from "../usage";
import { isSafeBgImage } from "../../pages/pageMaker/core/helpers/background";
import { safeUrl } from "../../pages/pageMaker/core/helpers/generatorCss";
import { parseGallery } from "../../pages/pageMaker/core/elements/extra/shared";

const A = "a1b2c3d4e5f60718";
const B = "0f9e8d7c-6b5a-4321-9876-543210fedcba"; // id server (uuid)

test("v21 aset: rujukan dikenali, diekstrak, dan diganti", () => {
  assert.equal(assetRef(A), `aset:${A}`);
  assert.ok(isAssetRef(`aset:${A}`) && isAssetRef(` aset:${B} `));
  assert.ok(!isAssetRef("aset:xy") && !isAssetRef("https://x.test/a.png") && !isAssetRef(`aset:${A}"onerror=1`));
  assert.equal(assetIdOf(`aset:${B}`), B);
  const html = `<img src="aset:${A}"><div style="background-image:url(aset:${B})"></div><img src="aset:${A}">`;
  assert.deepEqual(findAssetIds(html), [A, B]);
  assert.equal(replaceAssetRefs(html, (id) => (id === A ? "x.webp" : undefined)), `<img src="x.webp"><div style="background-image:url(aset:${B})"></div><img src="x.webp">`);
});

test("v21 aset: rujukan lolos penyaring URL elemen (src, latar, galeri)", () => {
  assert.equal(safeUrl(`aset:${A}`, ""), `aset:${A}`);
  assert.ok(isSafeBgImage(`aset:${A}`));
  assert.ok(!isSafeBgImage(`aset:${A}) url(javascript:x`));
  assert.deepEqual(parseGallery([`aset:${A} | Pelaminan`]), [{ src: `aset:${A}`, caption: "Pelaminan" }]);
});

test("v21 aset: nama berkas ekspor aman & unik per id", () => {
  assert.equal(assetFileName("Foto Prewedding (1).JPG", A, "image/jpeg"), "foto-prewedding-1-a1b2c3d4.jpg");
  assert.equal(assetFileName("", B, "image/webp"), "gambar-0f9e8d7c.webp");
  assert.equal(assetFileName("../../etc/passwd", A, "image/png"), "etc-passwd-a1b2c3d4.png");
});

test("v21 aset: jalur relatif dari folder berkas", () => {
  assert.equal(relativePath("index.html", "assets/img/a.webp"), "assets/img/a.webp");
  assert.equal(relativePath("assets/home.css", "assets/img/a.webp"), "img/a.webp");
  assert.equal(relativePath("blog/post/index.html", "assets/img/a.webp"), "../../assets/img/a.webp");
  assert.equal(layoutFor("html"), "static");
  assert.equal(layoutFor("react"), "public");
});

const src = (blobs: Record<string, string>): AssetSource => ({
  meta: (id) => (blobs[id] ? { name: `Foto ${id.slice(0, 2)}`, mime: "image/webp" } : null),
  blob: async (id) => (blobs[id] ? new Blob([blobs[id]], { type: "image/webp" }) : null),
});

test("v21 aset: zip/deploy HTML berisi berkas gambar sungguhan + rujukan relatif", async () => {
  const files = [
    { name: "index.html", content: `<img src="aset:${A}">`, lang: "html" },
    { name: "assets/index.css", content: `.h{background-image:url(aset:${A})}`, lang: "css" },
    { name: "README.md", content: "tanpa gambar", lang: "md" },
  ];
  const r = await packAssets(files, "static", src({ [A]: "RIFF" }));
  assert.deepEqual(r.missing, []);
  assert.deepEqual(
    r.binaries.map((b) => b.name),
    ["assets/img/foto-a1-a1b2c3d4.webp"],
  );
  assert.equal(r.files[0].content, `<img src="assets/img/foto-a1-a1b2c3d4.webp">`);
  assert.equal(r.files[1].content, `.h{background-image:url(img/foto-a1-a1b2c3d4.webp)}`);
  assert.equal(r.files[1].lang, "css");
  assert.equal(await r.binaries[0].blob.text(), "RIFF");
});

test("v21 aset: framework SPA → public/assets/img + jalur absolut; aset hilang → kotak abu-abu", async () => {
  const r = await packAssets([{ name: "src/pages/Home.jsx", content: `<img src="aset:${A}" /><img src="aset:${B}" />` }], "public", src({ [A]: "x" }));
  assert.deepEqual(r.binaries.map((b) => b.name), ["public/assets/img/foto-a1-a1b2c3d4.webp"]);
  assert.deepEqual(r.missing, [B]);
  assert.equal(r.files[0].content, `<img src="/assets/img/foto-a1-a1b2c3d4.webp" /><img src="${MISSING_ASSET}" />`);
});

test("v21 aset: tanpa rujukan → berkas tidak disentuh", async () => {
  const files = [{ name: "index.html", content: "<p>hai</p>" }];
  const r = await packAssets(files, "static", src({}));
  assert.equal(r.files, files);
  assert.deepEqual(r.binaries, []);
});

test("v21 aset: tempat pemakaian (website › halaman, template kode) untuk cegah hapus tak sengaja", () => {
  const designs = {
    site: [{ id: "s1", name: "Toko Kopi", state: { version: 1, pages: [{ designId: "p1", slug: "beranda" }], homepageId: "p1" } }],
    page: [
      { id: "p1", name: "Beranda", state: { root: { children: [{ props: { srcUrl: `aset:${A}` } }] } } },
      { id: "p2", name: "Lepas", state: { images: [`aset:${A}1 | bukan`] } },
    ],
    "code-site": [{ id: "c1", name: "Undangan Raka", state: { edits: { "data:CONFIG": { galeri: [{ judul: "x", gambar: `aset:${A}` }] } } } }],
  };
  const uses = assetUsage(A, designs, (t) => (t === "code-site" ? "template kode" : t));
  assert.deepEqual(
    uses.map((u) => u.label),
    ["Toko Kopi › Beranda", "Undangan Raka (template kode)"],
  );
  assert.deepEqual(assetUsage("ffffffffffffffff", designs), []);
});
