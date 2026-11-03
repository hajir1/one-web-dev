// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { buildIco, faviconHtml, readableOn, webManifest, wrapText, ogMetaHtml } from "../lib/webIcons";

test("buildIco: header, entri, dan offset PNG benar", () => {
  const a = new Uint8Array([1, 2, 3]);
  const b = new Uint8Array([4, 5]);
  const ico = buildIco([{ size: 16, bytes: a }, { size: 256, bytes: b }]);
  const v = new DataView(ico.buffer);
  assert.equal(v.getUint16(2, true), 1);
  assert.equal(v.getUint16(4, true), 2);
  assert.equal(ico[6], 16);
  assert.equal(ico[6 + 16], 0); // 256 ditulis 0
  assert.equal(v.getUint32(6 + 8, true), 3);
  const off1 = v.getUint32(6 + 12, true);
  const off2 = v.getUint32(6 + 16 + 12, true);
  assert.deepEqual([...ico.slice(off1, off1 + 3)], [1, 2, 3]);
  assert.deepEqual([...ico.slice(off2, off2 + 2)], [4, 5]);
  assert.equal(ico.length, 6 + 32 + 5);
  assert.throws(() => buildIco([]));
});

test("wrapText: bungkus per kata, potong kata panjang, elipsis", () => {
  const m = (s) => s.length * 10;
  assert.deepEqual(wrapText("satu dua tiga", 80, m, 3), ["satu dua", "tiga"]);
  assert.deepEqual(wrapText("abcdefghijkl", 50, m, 5), ["abcde", "fghij", "kl"]);
  const cut = wrapText("a b c d e f g h", 30, m, 2);
  assert.equal(cut.length, 2);
  assert.ok(cut[1].endsWith("…"));
});

test("readableOn memilih kontras terbaik", () => {
  assert.equal(readableOn("#000000"), "#ffffff");
  assert.equal(readableOn("#ffffff"), "#111827");
  assert.equal(readableOn("#1f3a8f"), "#ffffff");
  assert.equal(readableOn("#ffd54f"), "#111827");
});

test("manifest & HTML", () => {
  const m = JSON.parse(webManifest({ name: "Toko Kue Bandung Raya", themeColor: "#ABCDEF", backgroundColor: "bukan" }));
  assert.equal(m.short_name, "Toko Kue Ban");
  assert.equal(m.theme_color, "#abcdef");
  assert.equal(m.background_color, "#ffffff");
  assert.ok(m.icons.some((i) => i.purpose === "maskable"));
  assert.ok(faviconHtml("#123456", true).includes("favicon.svg"));
  assert.ok(!faviconHtml("#123456", false).includes("favicon.svg"));
  assert.match(ogMetaHtml({ title: 'A "b"', description: "", imageUrl: "" }), /content="A &quot;b&quot;"/);
});
