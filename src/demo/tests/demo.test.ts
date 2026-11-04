// v12: demo mode (frontend without a backend, VITE_API_BASE_URL=off). v13: every catalog template. v15: no limits.
import test from "node:test";
import assert from "node:assert/strict";
import { apiConfig, configureApi, resolveApiBase } from "../../pages/media/processing/apiConfig";
import { isDemoHiddenPath, isDemoMode } from "../demoMode";
import { DEMO_TEMPLATE_COUNT, DEMO_TEMPLATE_IDS } from "../demoTemplateIds";
import { demoAcquire, demoPreview, demoTemplateDetail, demoTemplateList, demoTemplatesPage } from "../demoTemplates";
import { MENU_SECTIONS, visibleMenuSections } from "../../config/menu";
import { DOC_TOPICS, isVisibleDocTopic, visibleDocTopics } from "../../config/docs";
import { LATEST_TEMPLATE_IDS, TEMPLATE_CATALOG } from "../../config/templates";
import { FREE_SITES, MAX_DESIGNS } from "../../config/quota";
import { requireCredit, useCreditGate } from "../../credits/credits";
import { acquireTemplate } from "../../pages/webTemplates/templateContent";
import { ApiCatalogRepository } from "../../marketplace/repository";
import { emptyAccount } from "../../marketplace/account";
import { makeIconLookup } from "../../pages/pageMaker/core/helpers/elementDefinition";
import { WEB_TEMPLATES, buildTemplatePages } from "../../pages/webTemplates/registry";
import { DEMO_LOADERS, DEMO_PAGES } from "../demoContent.generated";
import { maxDesigns, siteLimit, UNLIMITED_LIMIT } from "../../marketplace/hooks";
import { useMarketStore } from "../../marketplace/account";
import { VR_LIMITS, vrCap } from "../../pages/vr/model";
import { CODE_TEMPLATE_IDS } from "../../pages/webTemplates/codeTemplates/catalog";

const icons = makeIconLookup([]);

/** Runs `fn` with the backend turned off (demo mode), then restores it. */
async function inDemo<T>(fn: () => T | Promise<T>): Promise<T> {
  const prev = apiConfig.baseUrl;
  configureApi({ baseUrl: null });
  try {
    return await fn();
  } finally {
    configureApi({ baseUrl: prev });
  }
}

const page = (over: Partial<Parameters<typeof demoTemplatesPage>[0]> = {}) =>
  demoTemplatesPage({ lang: "id", page: 1, limit: 12, tier: "all", category: "all", q: "", sort: "featured", ...over });

test("mode demo aktif hanya bila backend tidak dikonfigurasi (VITE_API_BASE_URL=off)", async () => {
  assert.equal(resolveApiBase({ VITE_API_BASE_URL: "off" }), null);
  assert.equal(isDemoMode(), false, "tes berjalan dengan backend bawaan → bukan demo");
  assert.equal(await inDemo(isDemoMode), true);
  assert.equal(isDemoMode(), false);
});

const ALL = TEMPLATE_CATALOG.length;
/** v16–v18: demo catalog = Page Design templates + 37 Code Templates. */
const CODE = CODE_TEMPLATE_IDS.length;
const SHOWN = ALL + CODE;

test("template demo = SEMUA template katalog: unik, isinya tersedia, termasuk semua template Free", () => {
  assert.ok(ALL >= 400);
  assert.equal(DEMO_TEMPLATE_COUNT, SHOWN);
  assert.equal(new Set(DEMO_TEMPLATE_IDS).size, ALL);
  const ids = new Set(TEMPLATE_CATALOG.map((t) => t.id));
  for (const id of DEMO_TEMPLATE_IDS) assert.ok(ids.has(id), `${id} tidak ada di katalog`);
  for (const t of TEMPLATE_CATALOG.filter((x) => x.tier === "free")) assert.ok(DEMO_TEMPLATE_IDS.includes(t.id), `template Free ${t.id} hilang`);
  assert.equal(demoTemplateList("id").length, SHOWN, "semua template demo punya konten");
  assert.equal(CODE, 277);
  // The last upload ("Latest" label) on top, then Code Templates, then other templates.
  const list = demoTemplateList("id");
  const latest = LATEST_TEMPLATE_IDS.length;
  assert.deepEqual(list.slice(0, latest).map((t) => t.refId), [...LATEST_TEMPLATE_IDS], "template terbaru paling atas");
  assert.ok(list.slice(0, latest).every((t) => t.isNew) && list.slice(latest).every((t) => !t.isNew), "hanya unggahan terakhir berlabel Terbaru");
  const codeOld = CODE_TEMPLATE_IDS.filter((id) => !LATEST_TEMPLATE_IDS.includes(id));
  assert.deepEqual(list.slice(latest, latest + codeOld.length).map((t) => t.refId), codeOld, "Template Kode sesudahnya");
});

test("konten demo hasil generator identik dengan sumber template (id & en) dan lengkap", async () => {
  assert.deepEqual(Object.keys(DEMO_LOADERS).sort(), [...DEMO_TEMPLATE_IDS].sort());
  assert.deepEqual(Object.keys(DEMO_PAGES).sort(), [...DEMO_TEMPLATE_IDS].sort());
  // Random node IDs per build → normalized before comparing.
  const norm = (s: string) => {
    const m = new Map<string, string>();
    return s.replace(/n-\d+-[a-z0-9]+/g, (x) => m.get(x) ?? (m.set(x, `N${m.size}`), m.get(x)!));
  };
  for (const t of WEB_TEMPLATES.filter((x) => DEMO_LOADERS[x.id])) {
    const content = await DEMO_LOADERS[t.id]();
    assert.deepEqual(JSON.parse(JSON.stringify(DEMO_PAGES[t.id])), JSON.parse(JSON.stringify(t.content.pages)), `${t.id}: daftar halaman berbeda`);
    for (const lang of ["id", "en"] as const) {
      const a = norm(JSON.stringify(buildTemplatePages(t, lang)));
      const b = norm(JSON.stringify(buildTemplatePages({ ...t, content }, lang)));
      assert.equal(a, b, `${t.id} (${lang}) berbeda — jalankan ulang src/tools/genDemoTemplates.ts`);
    }
  }
});

test("katalog demo: semua gratis (harga 0), nama dari locales, tanpa item Premium", () => {
  const list = demoTemplateList("id");
  assert.ok(list.every((t) => t.tier === "free" && t.price === 0 && t.premiumItemIds.length === 0));
  const starter = demoTemplateDetail("id", "company-starter");
  assert.ok(starter && starter.name !== "company-starter" && starter.pages.some((p) => p.home));
  assert.equal(demoTemplateDetail("id", "tidak-ada"), null);
  assert.equal(demoTemplateList("en")[0].refId, list[0].refId, "urutan sama di semua bahasa");
});

test("halaman katalog demo: paginasi, filter kategori & cari, tab Premium kosong", () => {
  const p1 = page();
  const pages = Math.ceil(SHOWN / 12);
  assert.deepEqual([p1.total, p1.totalAll, p1.pages, p1.templates.length], [SHOWN, SHOWN, pages, 12]);
  assert.deepEqual(p1.facets, { all: SHOWN, free: SHOWN, premium: 0 });
  const last = page({ page: pages });
  assert.equal(last.templates.length, SHOWN - (pages - 1) * 12);
  assert.equal(page({ page: 999 }).page, pages, "halaman di luar batas → halaman terakhir");
  const dash = page({ category: "dashboard", limit: 100 });
  assert.ok(dash.total > 0 && dash.templates.every((t) => t.category === "dashboard"));
  assert.equal(page({ tier: "premium" }).total, 0);
  const q = page({ q: "kopi" });
  assert.ok(q.total > 0 && q.total < SHOWN);
  for (const [cat, n] of [["invitation", 50], ["animation", 37]] as const) assert.equal(page({ category: cat, limit: 100 }).total, n, cat);
  const byName = page({ sort: "name", limit: SHOWN }).templates.map((t) => t.name);
  assert.deepEqual(byName, [...byName].sort((a, b) => a.localeCompare(b)));
});

test("isi template demo dibangun di browser dan dicatat sumbernya", async () => {
  const pages = await demoAcquire({ id: "company-starter", version: 1 }, "id");
  assert.ok(pages.length >= 1 && pages.some((p) => p.home));
  assert.ok(pages.every((p) => p.doc.source?.templateId === "company-starter"));
  await assert.rejects(() => demoAcquire({ id: "bukan-demo", version: 1 }, "id"));
  // acquireTemplate (used by the Templates page) does not call the server in demo mode.
  const viaAcquire = await inDemo(() => acquireTemplate({ id: "shop-starter", version: 1 }, "en"));
  assert.ok(viaAcquire.length > 0 && viaAcquire.every((p) => p.doc.source?.templateId === "shop-starter"));
});

test("pratinjau demo: HTML mandiri per halaman (CSS disisipkan) + navigasi antarhalaman", async () => {
  const prev = await demoPreview("company-starter", "id", icons);
  assert.ok(prev);
  const keys = Object.keys(prev.html);
  assert.ok(keys.length >= 2);
  for (const html of Object.values(prev.html)) {
    assert.ok(!/href="assets\/[^"]+\.css"/.test(html), "CSS lokal harus disisipkan");
    assert.ok(html.includes("<style>") && html.includes("owd-demo-nav"));
  }
  assert.equal(prev.fileToKey["index.html"] !== undefined, true);
  const thumb = await demoPreview("company-starter", "id", icons, true);
  assert.ok(thumb && Object.keys(thumb.html).length >= 1);
  assert.equal(await demoPreview("bukan-demo", "id", icons), null);
  // v16: Code Templates are not built as Page Design trees.
  await assert.rejects(() => demoAcquire({ id: CODE_TEMPLATE_IDS[0], version: 1 }, "id"), /CODE_TEMPLATE/);
  // Spec-based templates (sets G/H/I) are also loaded from their set chunk.
  const spec = await demoPreview(DEMO_TEMPLATE_IDS[DEMO_TEMPLATE_IDS.length - 1], "en", icons, true);
  assert.ok(spec && Object.keys(spec.html).length === 1);
});

test("menu demo: alat server & Toko disembunyikan, tanpa tanda kredit; produksi tidak berubah", async () => {
  assert.equal(visibleMenuSections(), MENU_SECTIONS);
  const demo = await inDemo(visibleMenuSections);
  const paths = demo.flatMap((s) => s.items.map((i) => i.path));
  for (const hidden of ["/data-tools/server-convert", "/media-tools/video-to-gif", "/media-tools/video-compress", "/web-market"]) assert.ok(!paths.includes(hidden), hidden);
  for (const kept of ["/website-builder", "/web-templates", "/media-tools/remove-background", "/vr/tour-360", "/data-tools/pdf-tools"]) assert.ok(paths.includes(kept), kept);
  assert.ok(demo.every((s) => s.items.every((i) => !i.credit)));
  assert.ok(MENU_SECTIONS.some((s) => s.items.some((i) => i.credit)), "data menu asli tidak ikut berubah");
});

test("rute demo: halaman akun, pembayaran & alat server diarahkan ke Dashboard", () => {
  for (const p of ["/credits", "/plans", "/account", "/job-history", "/team", "/team/join", "/admin", "/signin", "/invoice/123", "/web-market", "/media-tools/video-compress"]) assert.ok(isDemoHiddenPath(p), p);
  for (const p of ["/", "/page-maker", "/web-templates", "/web-templates/company-starter", "/docs", "/media-tools/remove-background", "/vr/tour-360"]) assert.ok(!isDemoHiddenPath(p), p);
});

test("dokumentasi demo: topik Kredit, Paket & Konversi Server disembunyikan", async () => {
  assert.equal(visibleDocTopics(), DOC_TOPICS);
  const ids = (await inDemo(visibleDocTopics)).map((d) => d.id);
  assert.ok(!ids.includes("credits") && !ids.includes("plans") && !ids.includes("data-server"));
  assert.ok(ids.includes("templates"));
  assert.equal(await inDemo(() => isVisibleDocTopic("credits")), false);
  assert.equal(isVisibleDocTopic("credits"), true);
});

test("v15: demo tanpa batas folder website, desain, dan Tur 360°; gerbang kredit tidak pernah terbuka", async () => {
  // The production free pack is unchanged.
  assert.equal(FREE_SITES, 2);
  assert.equal(MAX_DESIGNS, 10);
  const acc = emptyAccount();
  assert.equal(acc.limits.sites.max, 2);
  assert.equal(acc.limits.designs.max, 10);
  assert.equal(siteLimit(), useMarketStore.getState().account.limits.sites.max);
  assert.equal(maxDesigns(), useMarketStore.getState().account.limits.designs.max);
  assert.equal(vrCap(VR_LIMITS.proScenes), VR_LIMITS.proScenes);
  // Demo mode: unlimited.
  assert.equal(await inDemo(siteLimit), UNLIMITED_LIMIT);
  assert.equal(await inDemo(maxDesigns), UNLIMITED_LIMIT);
  assert.equal(await inDemo(() => vrCap(VR_LIMITS.maxTours)), Infinity);
  assert.equal(await inDemo(() => vrCap(VR_LIMITS.hotspotsPerScene)), Infinity);
  assert.ok(await inDemo(() => isDemoHiddenPath("/dokumentasi")));
  assert.ok(!isDemoHiddenPath("/docs/vr"));
  useCreditGate.getState().close();
  await inDemo(() => requireCredit("premium-element", { item: "x" }));
  assert.equal(useCreditGate.getState().request, null);
});

test("repository katalog demo: template dari frontend tanpa panggilan jaringan", async () => {
  const repo = new ApiCatalogRepository();
  const prevFetch = apiConfig.fetch;
  configureApi({ fetch: (() => Promise.reject(new Error("tidak boleh ada fetch"))) as typeof fetch });
  try {
    const snap = await inDemo(() => repo.getCatalog("id"));
    assert.equal(snap.templates.length, SHOWN);
    assert.ok(snap.elements.length > 0 && snap.sections.length > 0);
  } finally {
    configureApi({ fetch: prevFetch });
  }
});
