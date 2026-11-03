// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { STITCH, zipPhotos } from "../stitch";
import { DEFAULT_PRICING, VR_SERVER_FEATURES, DATA_SERVER_FEATURES, costOf, packUsesOf, planCharge } from "../../media/processing/pricing";
import { jobsPath } from "../../media/processing/serverClient";
import { OCR_LANGS, OCR_MAX_PAGES, SERVER_INPUT, checkSignature, isPdfFeature } from "../../Data/ServerConvert/estimate";
import id from "../../../locales/id.json" with { type: "json" };
import en from "../../../locales/en.json" with { type: "json" };

/* v7: VR Panorama Stitcher (item 6) & OCR PDF (P8) — sisi frontend. */

test("harga VR panorama: 1 kredit, faktor per jumlah foto (≤8 ×1, ≤16 ×1,5, >16 ×2), paket 5 kredit = 6 panorama", () => {
  const p = DEFAULT_PRICING["vr-panorama-stitch"];
  assert.deepEqual(VR_SERVER_FEATURES, ["vr-panorama-stitch"]);
  assert.equal(p.unlockRequired, true);
  assert.equal(p.packPrice, 5);
  assert.equal(p.usesPerCredit, 6);
  assert.equal(costOf(p, { photos: 6 }), 1);
  assert.equal(costOf(p, { photos: 8 }), 1);
  assert.equal(costOf(p, { photos: 12 }), 1.5);
  assert.equal(costOf(p, { photos: 24 }), 2);
  assert.equal(packUsesOf(p, { photos: 12 }), 2);
  const acc = { balance: 1, entitlements: { "vr-panorama-stitch": { unlocked: true, packUses: 0 } }, items: [], extraSiteSlots: 0, syncedAt: 0 };
  assert.equal(planCharge(p, [{ photos: 20 }], acc).affordable, false);
});

test("harga OCR: per berkas, ≤10 hlm ×1, ≤50 ×3, >50 ×6; batas 100 halaman", () => {
  const p = DEFAULT_PRICING["data-pdf-ocr"];
  assert.ok(DATA_SERVER_FEATURES.includes("data-pdf-ocr"));
  assert.deepEqual([costOf(p, { pages: 10 }), costOf(p, { pages: 11 }), costOf(p, { pages: 50 }), costOf(p, { pages: 51 })], [1, 3, 3, 6]);
  assert.equal(OCR_MAX_PAGES, 100);
  assert.deepEqual(SERVER_INPUT["data-pdf-ocr"].outputs, ["zip"]);
  assert.ok(isPdfFeature("data-pdf-ocr") && !isPdfFeature("data-legacy-sheet"));
  assert.throws(() => checkSignature("data-pdf-ocr", new TextEncoder().encode("PK\x03\x04xxxx"), "a.pdf"));
  checkSignature("data-pdf-ocr", new TextEncoder().encode("%PDF-1.7"), "a.pdf");
  assert.deepEqual([...OCR_LANGS], ["ind+eng", "ind", "eng"]);
});

test("endpoint per kelompok: vr-* → /vr/jobs, data-* → /data/jobs, lainnya → /media/jobs", () => {
  assert.equal(jobsPath("vr-panorama-stitch"), "/vr/jobs");
  assert.equal(jobsPath("data-pdf-ocr"), "/data/jobs");
  assert.equal(jobsPath("video-to-gif"), "/media/jobs");
});

test("zipPhotos: urutan pilih dipertahankan (01, 02, …), tanpa kompresi, ekstensi aman", async () => {
  const files = [new File([new Uint8Array([0xff, 0xd8, 1])], "B.JPG"), new File([new Uint8Array([0x89, 0x50, 2])], "a.png"), new File([new Uint8Array([3])], "aneh.j?p<g")];
  const blob = await zipPhotos(files);
  const z = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.deepEqual(Object.keys(z.files), ["01.jpg", "02.png", "03.jpg"]);
  assert.deepEqual([...(await z.file("02.png").async("uint8array"))], [0x89, 0x50, 2]);
  assert.equal(STITCH.maxPhotos, 24);
  assert.equal(STITCH.minPhotos, 2);
});

test("teks: kode galat Python baru & teks VR/OCR ada di id dan en", () => {
  const codes = ["too_few_images", "too_many_images", "not_enough_overlap", "stitch_failed", "ocr_failed", "no_text"];
  for (const L of [id, en]) {
    for (const c of codes) assert.ok(L.errors.server.jobErrors[c], c);
    assert.ok(L.pricing.features["vr-panorama-stitch"] && L.pricing.features["data-pdf-ocr"]);
    assert.ok(L.pricing.units.panorama && L.pricing.tierNote.photos);
    assert.ok(Array.isArray(L.vr.stitch.tips) && L.vr.stitch.unavailable && L.vr.stitch.open);
    assert.ok(L.data.server.features["data-pdf-ocr"] && L.data.server.ocrLangs.ind_eng);
  }
  assert.deepEqual(Object.keys(id.vr.stitch).sort(), Object.keys(en.vr.stitch).sort());
});
