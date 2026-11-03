// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, degrees } from "pdf-lib";
import { compressLossless, deletePages, extractPages, imagesToPdf, mergePdfs, parseRanges, pdfInfo, reorderPages, rotatePages, splitPdf } from "../PdfTools/pdfLib";

async function makePdf(n, w = 200) {
  const d = await PDFDocument.create();
  for (let i = 0; i < n; i++) d.addPage([w + i, 300]);
  return d.save();
}
const widths = async (b) => (await PDFDocument.load(b)).getPages().map((p) => Math.round(p.getWidth()));

test("parseRanges", () => {
  assert.deepEqual(parseRanges("", 3), [0, 1, 2]);
  assert.deepEqual(parseRanges("1-3, 5, 8-", 9), [0, 1, 2, 4, 7, 8]);
  assert.deepEqual(parseRanges("3,1,1,2", 3), [2, 0, 1]);
  assert.deepEqual(parseRanges("3-1", 3), [2, 1, 0]);
  assert.throws(() => parseRanges("0", 3), { code: "pdfRangeOut" });
  assert.throws(() => parseRanges("4", 3), { code: "pdfRangeOut" });
  assert.throws(() => parseRanges("a-b", 3), { code: "pdfRange" });
});

test("merge menjaga urutan", async () => {
  const out = await mergePdfs([await makePdf(2, 100), await makePdf(1, 500)]);
  assert.deepEqual(await widths(out), [100, 101, 500]);
  await assert.rejects(mergePdfs([await makePdf(1)]), { code: "pdfNeedTwo" });
});

test("extract, delete, reorder, split", async () => {
  const src = await makePdf(5);
  assert.deepEqual(await widths(await extractPages(src, "2,4-")), [201, 203, 204]);
  assert.deepEqual(await widths(await deletePages(src, "1-2")), [202, 203, 204]);
  assert.deepEqual(await widths(await reorderPages(src, "5,1")), [204, 200]);
  await assert.rejects(deletePages(src, "1-5"), { code: "pdfDeleteAll" });
  assert.equal((await splitPdf(src)).length, 5);
  const parts = await splitPdf(src, 2);
  assert.deepEqual(await Promise.all(parts.map(widths)), [[200, 201], [202, 203], [204]]);
});

test("rotate rentang tertentu", async () => {
  const out = await PDFDocument.load(await rotatePages(await makePdf(3), 90, "2"));
  assert.deepEqual(out.getPages().map((p) => p.getRotation().angle), [0, 90, 0]);
});

test("bukan PDF & PDF rusak ditolak", async () => {
  await assert.rejects(pdfInfo(new TextEncoder().encode("halo")), { code: "notPdf" });
  await assert.rejects(pdfInfo(new TextEncoder().encode("%PDF-1.7 rusak")), { code: "pdfBroken" });
});

test("compressLossless menghasilkan PDF valid dengan halaman sama", async () => {
  const d = await PDFDocument.create();
  d.setAuthor("Rahasia");
  d.addPage().setRotation(degrees(0));
  const out = await PDFDocument.load(await compressLossless(await d.save()));
  assert.equal(out.getPageCount(), 1);
  assert.equal(out.getAuthor(), undefined);
});

test("imagesToPdf: A4 mengikuti orientasi gambar", async () => {
  // PNG 1x1 transparan
  const png = Uint8Array.from(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR42mNk+M9QzwAEjDAGACCDAv8cI7IoAAAAAElFTkSuQmCC", "base64"));
  const out = await PDFDocument.load(await imagesToPdf([{ bytes: png, type: "png", width: 2, height: 1 }], "a4", 20));
  const p = out.getPage(0);
  assert.ok(p.getWidth() > p.getHeight());
  const fit = await PDFDocument.load(await imagesToPdf([{ bytes: png, type: "png", width: 2, height: 1 }], "fit"));
  assert.equal(Math.round(fit.getPage(0).getWidth()), 2);
});
