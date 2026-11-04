import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  VR_LIMITS,
  createHotspot,
  createScene,
  createTour,
  fromDirection,
  mediaIdsOf,
  proFeaturesUsed,
  removeScene,
  sanitizeTour,
  sniffVrMedia,
  toPosition,
  tourIssues,
} from "../model";
import { AFRAME, RUNTIME_JS, assetNames, blobToDataUrl, buildTourFiles, buildTourHtml, buildTourSingleHtml, runtimeTour, scriptJson } from "../exportTour";
import { orphanMedia } from "../storage";
import { pieceInfo, FEATURE_ITEMS } from "../../../marketplace/data/prices";
import { parseItemId, itemIdOf } from "../../../marketplace/entitlements";
import { VR_PRO, TEMPLATE_PRICE } from "../../../config/marketplace";
import { CREDIT_COST } from "../../../config/pricing";
import { MENU_SECTIONS, VR_TOUR_PATH } from "../../../config/menu";
import { DOC_BY_ID } from "../../../config/docs";

function sampleTour() {
  const t = createTour("Rumah Contoh");
  const a = t.scenes[0];
  const b = createScene("Dapur");
  a.panoramaId = "m-a";
  b.panoramaId = "m-b";
  const go = createHotspot("scene", 30, -5, "Ke dapur");
  go.targetSceneId = b.id;
  const info = createHotspot("info", -40, 10, "Ruang tamu");
  info.text = "Luas 4×5 m";
  a.hotspots.push(go, info);
  t.scenes.push(b);
  return t;
}

/* ------------------------------ model ------------------------------ */

test("vr model: tur baru 1 scene, batas paket Gratis/Pro", () => {
  const t = createTour("A");
  assert.equal(t.scenes.length, 1);
  assert.equal(t.startSceneId, t.scenes[0].id);
  assert.equal(VR_LIMITS.freeScenes, 3);
  assert.equal(VR_LIMITS.proScenes, 30);
  assert.deepEqual(proFeaturesUsed(sampleTour()), []);
  const big = sampleTour();
  big.scenes.push(createScene("3"), createScene("4"));
  assert.deepEqual(proFeaturesUsed(big), ["scenes"]);
  const media = sampleTour();
  media.scenes[0].hotspots.push(createHotspot("audio", 0, 0, "Narasi"));
  assert.deepEqual(proFeaturesUsed(media), ["audio"]);
});

test("vr model: yaw/pitch ↔ posisi 3D bolak-balik, nilai dinormalisasi", () => {
  for (const [yaw, pitch] of [[0, 0], [90, 0], [-135, 20], [179, -60], [45, 85]]) {
    const [x, y, z] = toPosition(yaw, pitch);
    const r = fromDirection(x, y, z);
    assert.ok(Math.abs(r.yaw - yaw) < 0.2 || Math.abs(Math.abs(r.yaw - yaw) - 360) < 0.2, `${yaw}`);
    assert.ok(Math.abs(r.pitch - pitch) < 0.2, `${pitch}`);
  }
  const [x0, y0, z0] = toPosition(0, 0, 1);
  assert.ok(Math.abs(x0) < 1e-9 && Math.abs(y0) < 1e-9 && z0 === -1, "yaw 0 = depan (-Z)");
  const h = createHotspot("info", 540, 120, "x");
  assert.equal(Math.abs(h.yaw), 180);
  assert.equal(h.pitch, 85);
});

test("vr model: sanitizeTour membuang data rusak & referensi scene yang hilang", () => {
  assert.equal(sanitizeTour(null), null);
  assert.equal(sanitizeTour({ scenes: [] }), null);
  const raw = JSON.parse(JSON.stringify(sampleTour()));
  raw.scenes[0].hotspots.push({ id: "x", kind: "evil", yaw: "a", pitch: 999, label: "<b>" }, { kind: "scene", targetSceneId: "missing", yaw: 0, pitch: 0 });
  raw.accent = "red;}";
  raw.startSceneId = "nope";
  const t = sanitizeTour(raw)!;
  assert.equal(t.accent, "#2563eb");
  assert.equal(t.startSceneId, t.scenes[0].id);
  const hs = t.scenes[0].hotspots;
  assert.equal(hs[2].kind, "info");
  assert.equal(hs[2].pitch, 85);
  assert.equal(hs[3].targetSceneId, undefined);
});

test("vr model: hapus scene memutus hotspot yang menuju ke sana; masalah ekspor terdeteksi", () => {
  const t = sampleTour();
  const b = t.scenes[1].id;
  const r = removeScene(t, b);
  assert.equal(r.scenes.length, 1);
  assert.equal(r.scenes[0].hotspots[0].targetSceneId, undefined);
  assert.deepEqual(tourIssues(r).map((x) => x.key), ["noTarget"]);
  assert.deepEqual(removeScene(r, r.scenes[0].id), r, "scene terakhir tidak bisa dihapus");
  const empty = createTour("x");
  assert.deepEqual(tourIssues(empty).map((x) => x.key), ["noPanorama"]);
  assert.deepEqual(tourIssues(sampleTour()), []);
  assert.deepEqual(mediaIdsOf(sampleTour()).sort(), ["m-a", "m-b"]);
  assert.deepEqual(orphanMedia([sampleTour()], { "m-a": {} as never, "m-x": {} as never }), ["m-x"]);
});

test("vr model: jenis berkas dicek dari isi", () => {
  const b = (...v: number[]) => new Uint8Array([...v, ...new Array(16).fill(0)]);
  assert.equal(sniffVrMedia(b(0xff, 0xd8, 0xff, 0xe0)), "jpeg");
  assert.equal(sniffVrMedia(b(0x89, 0x50, 0x4e, 0x47)), "png");
  assert.equal(sniffVrMedia(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])), "webp");
  assert.equal(sniffVrMedia(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45])), "wav");
  assert.equal(sniffVrMedia(b(0x49, 0x44, 0x33)), "mp3");
  assert.equal(sniffVrMedia(b(0x4f, 0x67, 0x67, 0x53)), "ogg");
  assert.equal(sniffVrMedia(b(0x3c, 0x73, 0x76, 0x67)), "unknown", "SVG/HTML ditolak");
});

/* ------------------------------ export ------------------------------ */

test("vr ekspor: A-Frame dari CDN (versi dikunci, MIT) dipasang sekali di <head>", () => {
  assert.equal(AFRAME.license, "MIT");
  assert.match(AFRAME.js!, /^https:\/\/cdn\.jsdelivr\.net\/npm\/aframe@\d+\.\d+\.\d+\//);
  const html = buildTourHtml({ title: "T", lang: "id", boot: { tour: runtimeTour(sampleTour()), media: {}, mode: "view" } });
  const tag = `<script src="${AFRAME.js}"></script>`;
  assert.ok(html.indexOf(tag) > -1 && html.indexOf(tag) < html.indexOf("</head>"));
  assert.equal(html.split(AFRAME.js!).length, 2);
  assert.ok(html.indexOf("<a-scene") > html.indexOf("</head>"));
  assert.doesNotThrow(() => new Function(RUNTIME_JS), "runtime JS valid");
});

test("vr ekspor: teks pengguna tidak bisa keluar dari <script>/<title>", () => {
  const t = sampleTour();
  t.name = '</title><script>alert(1)</script>';
  t.scenes[0].hotspots[1].text = "</script><img src=x onerror=alert(1)>";
  const html = buildTourHtml({ title: t.name, lang: "id", boot: { tour: runtimeTour(t), media: {}, mode: "view" } });
  assert.ok(!html.includes("<script>alert(1)"));
  assert.ok(!html.includes("</script><img"));
  assert.equal(scriptJson("a</script> "), '"a\\u003c/script>\\u2028"');
  assert.ok(!/innerHTML\s*=\s*[^"]/.test(RUNTIME_JS.replace('$("vr-title").innerHTML = ""', "")), "runtime memakai textContent");
});

test("vr ekspor: index.html + README + aset bernama rapi, hanya media yang dipakai", () => {
  const t = sampleTour();
  const img = createHotspot("image", 0, 0, "Foto");
  img.mediaId = "m-img";
  t.scenes[1].hotspots.push(img);
  const media = [
    { id: "m-a", kind: "jpeg" as const, blob: new Blob(["a"]) },
    { id: "m-b", kind: "webp" as const, blob: new Blob(["b"]) },
    { id: "m-img", kind: "png" as const, blob: new Blob(["c"]) },
    { id: "m-unused", kind: "png" as const, blob: new Blob(["d"]) },
  ];
  assert.deepEqual(assetNames(t, media), { "m-a": "assets/panorama-1.jpg", "m-b": "assets/panorama-2.webp", "m-img": "assets/gambar-1.png" });
  const files = buildTourFiles(t, media, "en");
  assert.deepEqual(files.map((f) => f.name), ["index.html", "README.md", "assets/panorama-1.jpg", "assets/panorama-2.webp", "assets/gambar-1.png"]);
});

test("vr pratinjau 1 berkas: semua media ditanam sebagai data URL, tanpa assets/, tanpa catatan server", async () => {
  const t = sampleTour();
  const media = [
    { id: "m-a", kind: "jpeg" as const, blob: new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0x00])]) },
    { id: "m-b", kind: "webp" as const, blob: new Blob(["webp"]) },
    { id: "m-unused", kind: "png" as const, blob: new Blob(["x"]) },
  ];
  assert.equal(await blobToDataUrl(media[0].blob, "image/jpeg"), "data:image/jpeg;base64,/9j/AA==");
  // Large files (more than one base64 chunk) stay intact.
  const big = new Uint8Array(100_000).map((_, i) => i % 251);
  assert.equal(await blobToDataUrl(new Blob([big]), "image/png"), "data:image/png;base64," + Buffer.from(big).toString("base64"));
  const html = await buildTourSingleHtml(t, media, "id");
  const boot = JSON.parse(html.match(/window\.__VR_BOOT = (.*);\n/)![1]);
  assert.equal(boot.inline, true);
  assert.deepEqual(Object.keys(boot.media).sort(), ["m-a", "m-b"]);
  assert.match(boot.media["m-a"], /^data:image\/jpeg;base64,/);
  assert.match(boot.media["m-b"], /^data:image\/webp;base64,/);
  assert.ok(!html.includes("assets/"));
  // The "needs a web server" note only applies to ZIP exports (separate assets).
  assert.match(RUNTIME_JS, /location\.protocol === "file:" && !\(window\.__VR_BOOT && window\.__VR_BOOT\.inline\)/);
  const zipHtml = buildTourHtml({ title: "T", lang: "id", boot: { tour: runtimeTour(t), media: {}, mode: "view" } });
  assert.ok(!zipHtml.includes('"inline"'));
});

test("vr pratinjau layar penuh: rute di luar layout, dibuka dari editor & daftar, teks ID/EN", () => {
  const app = readFileSync("src/App.tsx", "utf8");
  const route = app.indexOf('path="vr/tour-360/pratinjau/:tourId"');
  assert.ok(route > -1);
  assert.ok(route > app.lastIndexOf("</Route>", app.indexOf("{/* Auth Layout */}")), "tanpa sidebar AppLayout");
  const page = readFileSync("src/pages/vr/Page/VrTour.tsx", "utf8");
  assert.equal(page.match(/\/pratinjau\/\$\{/g)?.length, 2);
  assert.ok(page.includes('data-testid="vr-export-single"'));
  for (const lang of ["id", "en"]) {
    const L = JSON.parse(readFileSync(`src/locales/${lang}.json`, "utf8"));
    for (const k of ["title", "open", "short", "edit", "full", "noteTitle", "noteText", "missing"]) assert.ok(L.vr.viewer[k], `${lang}: viewer.${k}`);
    for (const k of ["single", "singleHint", "singleDone"]) assert.ok(L.vr.export[k], `${lang}: export.${k}`);
  }
});

/* ------------------------- credits, menu, docs ------------------------- */

test("vr kredit: Tur 360° Pro = item fitur 50 kredit (Rp50.000, rentang template Premium)", () => {
  const key = itemIdOf.feature(VR_PRO.id);
  assert.equal(key, "feature:vr-pro");
  assert.deepEqual(parseItemId(key), { kind: "feature", ref: "vr-pro" });
  assert.deepEqual(pieceInfo(key), { kind: "feature", refId: "vr-pro", tier: "premium", price: 50, name: "Tur 360° Pro" });
  assert.equal(pieceInfo("feature:tidak-ada"), null);
  assert.equal(CREDIT_COST["premium-vr"], VR_PRO.price);
  assert.ok(VR_PRO.price >= TEMPLATE_PRICE.premiumMin && VR_PRO.price <= TEMPLATE_PRICE.premiumMax);
  assert.deepEqual(Object.keys(FEATURE_ITEMS), ["vr-pro"]);
});

test("vr menu: bagian VR di sidebar, rute & dokumentasi tersedia, teks ID/EN lengkap", () => {
  const vr = MENU_SECTIONS.find((s) => s.id === "vr")!;
  assert.deepEqual(vr.items.map((i) => i.path), [VR_TOUR_PATH]);
  assert.equal(DOC_BY_ID.vr.path, VR_TOUR_PATH);
  const app = readFileSync("src/App.tsx", "utf8");
  assert.ok(app.includes('path="vr/tour-360"'));
  for (const lang of ["id", "en"]) {
    const L = JSON.parse(readFileSync(`src/locales/${lang}.json`, "utf8"));
    assert.ok(L.nav.sections.vr.name && L.nav.items.vrTour.name && L.docs.topics.vr.sections.length >= 5 && L.credits.gate["premium-vr"].title, lang);
    for (const k of ["scene", "info", "image", "audio"]) assert.ok(L.vr.kinds[k], `${lang}: ${k}`);
  }
});
