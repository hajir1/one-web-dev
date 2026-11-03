import { LATEST_TEMPLATE_IDS } from "../../config/templates";
import test from "node:test";
import assert from "node:assert/strict";
import { DESIGN_PACKAGES, FREE_TEMPLATE_CHARGES_ON_USE, MAX_SITES_PER_PURCHASE, NEW_SECTION_SPLIT, SITE_PACKAGES, TEMPLATE_PROMO, TEMPLATE_SPLIT, isValidPrice } from "../../config/marketplace";
import { FREE_SITES, MAX_DESIGNS } from "../../config/quota";
import { promoActive, promoPrice, promoRemaining } from "../promo";
import { EMPTY_ENTITLEMENTS, accessReason, canUse, itemIdOf, parseItemId, templateStatus } from "../entitlements";
import { betterDeal, betterSiteDeal, normalizeDesignCount, normalizeSiteCount, quoteDesigns, quoteSites } from "../pricing";
import { commerceService } from "../services";
import { maxDesigns, siteLimit } from "../hooks";
import { ApiCatalogRepository, sanitizeTemplate } from "../repository";
import { emptyAccount, sanitizeAccount, useMarketStore } from "../account";
import { buildElementCatalog, buildSectionCatalog } from "../data/catalog";
import { buildTemplateCatalog } from "../data/templateCatalog";
import { apiConfig, configureApi } from "../../pages/media/processing/apiConfig";
import { ELEMENTS_3D, ELEMENTS_V2, NEW_ELEMENT_TYPES, pieceInfo } from "../data/prices";
import { DEFAULT_TEMPLATE_QUERY, queryTemplates } from "../catalogQuery";
import { PRO_FREE_IDS, PRO_PRESETS } from "../../pages/pageMaker/helpers/sectionPresetsPro";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../../pages/pageMaker/core/elementDefinitions";
import { compose } from "../../pages/pageMaker/engine/helpers/compose";
import { createElementNode } from "../../pages/pageMaker/engine/helpers/tree";
import { jsSyntaxError } from "../../pages/pageMaker/engine/helpers/advanced";
import { makeIconLookup } from "../../pages/pageMaker/core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset, docTemplateId, normalizePageDoc } from "../../pages/pageMaker/helpers/pageDoc";
import { designRoom } from "../../pages/pageMaker/helpers/designQuota";
import { useDesignStore } from "../../pages/pageMaker/core/store/designStore";
import { PAGE_DESIGN_TYPE } from "../../pages/pageMaker/helpers/site";
import { buildSite } from "../../pages/pageMaker/helpers/siteExport";
import { WEB_TEMPLATES, getTemplate, templateSite } from "../../pages/webTemplates/registry";

const icons = makeIconLookup([]);
const FRAMEWORKS = ["html", "react", "vue", "svelte", "angular"];
/** Katalog lengkap dirakit dari sumber template (sama dengan yang diekspor ke seed backend). */
let snap = null;
const catalog = async () => {
  if (!snap) {
    const pieces = { sections: buildSectionCatalog(), elements: buildElementCatalog() };
    snap = { ...pieces, templates: buildTemplateCatalog(pieces, WEB_TEMPLATES) };
  }
  return snap;
};

/** Backend palsu: mencatat request dan menjawab per path. */
function mockServer(routes) {
  const calls = [];
  const prev = { baseUrl: apiConfig.baseUrl, fetch: apiConfig.fetch };
  configureApi({
    baseUrl: "http://api.test",
    fetch: async (url, init = {}) => {
      const u = new URL(String(url));
      const path = u.pathname + u.search;
      const headers = new Headers(init.headers);
      const call = { path, method: init.method ?? "GET", body: init.body ? JSON.parse(String(init.body)) : undefined, idem: headers.get("Idempotency-Key"), credentials: init.credentials };
      calls.push(call);
      const h = routes[`${call.method} ${u.pathname}`] ?? routes[`${call.method} ${path}`];
      const [status, body] = h ? await h(call) : [404, { error: "not found" }];
      return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
    },
  });
  return { calls, restore: () => configureApi(prev) };
}

/** Akun seperti dikirim server: template dimiliki + grant item bawaannya + item satuan. */
const serverAccount = ({ balance = 0, templates = [], items = [], limits = undefined } = {}) => ({
  balance,
  entitlements: {
    templates: templates.map((t) => ({ templateId: t.refId, acquiredAt: 1, pricePaid: t.price })),
    templateGrants: templates.map((t) => ({ templateId: t.refId, itemIds: t.premiumItemIds, grantedAt: 1 })),
    items: items.map((id) => ({ itemId: id, acquiredAt: 1, pricePaid: 1 })),
  },
  extraDesigns: 0,
  extraSites: 0,
  transactions: [],
  ...(limits ? { limits } : {}),
});

/* ------------------------------------------------------------------ */
/* Katalog: komposisi & harga                                          */
/* ------------------------------------------------------------------ */

test("10 section Pro baru: 4 Free + 6 Premium, tipe beragam, harga 0 / 1–2 kredit", async () => {
  assert.equal(PRO_PRESETS.length, 10);
  assert.equal(PRO_FREE_IDS.length, NEW_SECTION_SPLIT.free);
  assert.equal(PRO_PRESETS.length - PRO_FREE_IDS.length, NEW_SECTION_SPLIT.premium);
  const cats = new Set(PRO_PRESETS.map((p) => p.category));
  for (const c of ["hero", "features", "services", "testimonials", "pricing", "faq", "portfolio", "team", "statistics", "cta"]) assert.ok(cats.has(c), c);
  const { sections } = await catalog();
  const pro = sections.filter((s) => s.isNew);
  assert.equal(pro.length, 10);
  for (const s of sections) {
    assert.ok(isValidPrice("section", s.tier, s.price), `${s.id}: ${s.price}`);
    assert.equal(s.id, `preset:${s.refId}`);
    assert.ok(s.name && s.description && s.category, s.id);
  }
  assert.deepEqual(pro.filter((s) => s.tier === "free").map((s) => s.refId).sort(), [...PRO_FREE_IDS].sort());
});

test("19 elemen baru (11 Free + 8 Premium) terdaftar, harga sesuai, metadata lengkap", async () => {
  assert.equal(NEW_ELEMENT_TYPES.length, 19);
  const free = NEW_ELEMENT_TYPES.filter((t) => !D[t].premium);
  const prem = NEW_ELEMENT_TYPES.filter((t) => D[t].premium);
  assert.deepEqual(free.sort(), ["avatar", "blockquote", "file-upload", "floating-input", "map-embed", "number-stepper", "pagination", "search-bar", "segmented", "skeleton", "steps"]);
  assert.deepEqual(prem.sort(), ["cookie-consent", "dropdown", "form-wizard", "image-hotspot", "offcanvas", "otp-input", "popover", "toast"]);
  const { elements } = await catalog();
  for (const e of elements) assert.ok(isValidPrice(ELEMENTS_3D.includes(e.refId) ? "element3d" : "element", e.tier, e.price), `${e.id}: ${e.price}`);
  for (const t of NEW_ELEMENT_TYPES) {
    const e = elements.find((x) => x.refId === t);
    assert.ok(e && e.isNew && e.name, t);
    assert.deepEqual(pieceInfo(`element:${t}`).price, e.price);
  }
  // elemen rilis sebelumnya tidak lagi ditandai "Baru"
  for (const t of ELEMENTS_V2) assert.equal(elements.find((x) => x.refId === t).isNew, false, t);
});

test("elemen baru: tampil di 5 framework tanpa peringatan; JS kustom valid; Premium terkunci tanpa izin", () => {
  for (const t of [...NEW_ELEMENT_TYPES, ...ELEMENTS_V2]) {
    const def = D[t];
    const sec = createSectionFromPreset("single");
    sec.children[0].children.push(createElementNode(t, structuredClone(def.defaults), def.label));
    const root = createPageRoot([sec]);
    const ok = compose(root, { rootClass: "pg", icons, allowPremiumElements: true });
    assert.deepEqual(ok.warnings, [], t);
    for (const fw of FRAMEWORKS) assert.ok(ok.files(fw).length > 0, `${t}/${fw}`);
    const custom = def.customCode?.(def.defaults);
    if (custom?.js) assert.equal(jsSyntaxError(custom.js), null, `${t}: JS`);
    const locked = compose(root, { rootClass: "pg", icons });
    assert.equal(locked.warnings.length, def.premium ? 1 : 0, `${t}: kunci premium`);
  }
});

test("template: 32 Free / sisanya Premium, harga sesuai, item Premium bawaan = item Premium yang dipakai", async () => {
  const { templates, sections, elements } = await catalog();
  assert.equal(templates.length, TEMPLATE_SPLIT.free + TEMPLATE_SPLIT.premium);
  assert.equal(templates.filter((t) => t.tier === "free").length, TEMPLATE_SPLIT.free);
  assert.equal(templates.filter((t) => t.tier === "premium").length, TEMPLATE_SPLIT.premium);
  const tierOf = new Map([...sections, ...elements].map((i) => [i.id, i.tier]));
  for (const t of templates) {
    assert.ok(isValidPrice("template", t.tier, t.price), `${t.id}: ${t.price}`);
    assert.ok(t.name && t.description && t.pages.length >= 1 && t.sectionCount >= 3, t.id);
    for (const id of [...t.sectionIds, ...t.elementIds]) assert.ok(tierOf.has(id), `${t.id}: ${id} tidak dikenal`);
    const used = [...t.sectionIds, ...t.elementIds].filter((id) => tierOf.get(id) === "premium");
    if (t.tier === "free") {
      assert.deepEqual(used, [], `${t.id}: template Free tanpa item Premium`);
      assert.deepEqual(t.premiumItemIds, []);
    } else assert.deepEqual(t.premiumItemIds, used, t.id);
  }
  // Template Premium baru benar-benar memakai item Premium (section/elemen).
  const fresh = templates.filter((t) => t.tier === "premium" && t.isNew);
  // Label "Terbaru" hanya untuk unggahan terakhir (LATEST_TEMPLATE_IDS).
  assert.deepEqual(templates.filter((t) => t.isNew).map((t) => t.refId).sort(), [...LATEST_TEMPLATE_IDS].sort());
  // Template Free = 0 kredit.
  for (const t of templates.filter((x) => x.tier === "free")) assert.equal(t.price, 0, t.id);
  for (const t of fresh) assert.ok(t.premiumItemIds.length >= 1, t.id);
  // Template Premium memakai section Pro (preset ber-ID) dari katalog.
  assert.ok(templates.some((t) => t.sectionIds.includes("preset:pro-pricing-cards")));
});

test("repository: template dari GET /templates (divalidasi), di-cache per bahasa, clear() memuat ulang", async () => {
  const { templates } = await catalog();
  const sample = templates.slice(0, 3).map((t) => ({ ...t, demoUrl: `http://api.test/templates/${t.refId}/demo/id/index.html` }));
  const srv = mockServer({
    "GET /templates": () => [200, { templates: [...sample, { refId: "../x" }, null, { refId: "ok-id", tier: "free", price: 9, accent: "javascript:1", demoUrl: "javascript:alert(1)" }] }],
    "GET /catalog": () => [200, { items: [] }],
  });
  try {
    const repo = new ApiCatalogRepository();
    const a = await repo.getCatalog("id");
    assert.equal(await repo.getCatalog("id"), a, "cache per bahasa");
    assert.equal(srv.calls.filter((c) => c.path.startsWith("/templates")).length, 1);
    assert.equal(srv.calls[0].credentials, "include", "cookie sesi ikut");
    assert.equal(a.templates.length, 4, "entri rusak dibuang");
    assert.equal(a.templates[0].demoUrl, sample[0].demoUrl);
    const odd = a.templates.find((t) => t.refId === "ok-id");
    assert.equal(odd.price, 0, "Free selalu 0");
    assert.equal(odd.accent, "#2563eb");
    assert.equal(odd.demoUrl, undefined, "URL non-http dibuang");
    assert.ok(a.sections.length > 0 && a.elements.length > 0, "section & elemen dari kode editor");
    await repo.getCatalog("en");
    assert.ok(srv.calls.some((c) => c.path === "/templates?lang=en"));
    repo.clear();
    await repo.getCatalog("id");
    assert.equal(srv.calls.filter((c) => c.path === "/templates?lang=id").length, 2);
    assert.equal(sanitizeTemplate({ refId: "x", tier: "premium", price: 7, promoPrice: 4 }).promoPrice, 4, "harga promo dari server dipakai");
  } finally {
    srv.restore();
  }
});

/* ------------------------------------------------------------------ */
/* Hak akses: tiga konsep terpisah                                     */
/* ------------------------------------------------------------------ */

test("akses: Free selalu; template dibeli → item bawaan HANYA di desain dari template itu", async () => {
  const { templates, elements } = await catalog();
  const saas = templates.find((t) => t.refId === "saas-launch");
  const mega = itemIdOf.element("mega-menu");
  assert.ok(saas.premiumItemIds.includes(mega));
  const none = sanitizeAccount(serverAccount()).entitlements;
  assert.equal(templateStatus("saas-launch", "premium", none), "locked");
  assert.equal(accessReason("element:rating", "free", none), "free");
  assert.equal(accessReason(mega, "premium", none, { templateId: "saas-launch" }), "locked", "belum dibeli");

  const e = sanitizeAccount(serverAccount({ templates: [saas] })).entitlements;
  assert.equal(templateStatus("saas-launch", "premium", e), "owned");
  // (1) kepemilikan template & (2) grant terpisah; (3) item individual tidak tersentuh
  assert.equal(e.templates.length, 1);
  assert.deepEqual(e.templateGrants[0].itemIds, saas.premiumItemIds);
  assert.equal(e.items.length, 0);
  assert.equal(accessReason(mega, "premium", e, { templateId: "saas-launch" }), "template");
  assert.equal(accessReason(mega, "premium", e, {}), "locked", "desain dari nol tetap terkunci");
  assert.equal(accessReason(mega, "premium", e, { templateId: "startup-pitch" }), "locked", "template lain yang belum dimiliki");
  // Item Premium yang TIDAK disertakan tetap terkunci walau di desain template.
  const slider = elements.find((x) => x.refId === "slider");
  assert.ok(!saas.premiumItemIds.includes(slider.id));
  assert.equal(canUse(slider.id, "premium", e, { templateId: "saas-launch" }), false);
});

test("akses: beberapa template digabung; item satuan hanya membuka item itu (di semua desain)", async () => {
  const { templates, elements } = await catalog();
  const saas = templates.find((t) => t.refId === "saas-launch");
  const startup = templates.find((t) => t.refId === "startup-pitch");
  const typewriter = itemIdOf.element("typewriter");
  const mega = itemIdOf.element("mega-menu");
  assert.ok(startup.premiumItemIds.includes(typewriter) && !saas.premiumItemIds.includes(typewriter));
  const slider = elements.find((x) => x.refId === "slider");
  const e = sanitizeAccount(serverAccount({ templates: [saas, startup], items: [slider.id] })).entitlements;
  assert.equal(accessReason(typewriter, "premium", e, { templateId: "saas-launch" }), "template");
  assert.equal(accessReason(mega, "premium", e, { templateId: "startup-pitch" }), "template");
  assert.equal(accessReason(typewriter, "premium", e, {}), "locked");
  assert.equal(accessReason(slider.id, "premium", e, {}), "owned");
  assert.equal(accessReason(itemIdOf.element("countdown"), "premium", e, {}), "locked", "hanya item yang dibeli");
});

test("pembelian lewat server: harga & saldo dari respons, klik ganda = 1 request, 402/409 tidak mengubah akun", async () => {
  const { templates, elements } = await catalog();
  const saas = templates.find((t) => t.refId === "saas-launch");
  const free = templates.find((t) => t.tier === "free");
  const slider = elements.find((x) => x.refId === "slider");
  const rating = elements.find((x) => x.refId === "rating");
  let owned = false;
  const srv = mockServer({
    "POST /templates/saas-launch/purchase": async () => {
      await new Promise((r) => setTimeout(r, 5));
      if (owned) return [409, { error: "sudah dimiliki", code: "TEMPLATE_OWNED" }];
      owned = true;
      return [200, { ok: true, account: serverAccount({ balance: 94, templates: [saas] }), billing: { balance: 94 } }];
    },
    "POST /marketplace/purchase": () => [402, { error: "Saldo kurang", code: "INSUFFICIENT_CREDITS" }],
    "GET /marketplace/account": () => [200, serverAccount({ balance: 94, templates: [saas] })],
  });
  try {
    useMarketStore.setState({ account: emptyAccount(), status: "ready" });
    const [a, b] = await Promise.all([commerceService.purchaseTemplate(saas), commerceService.purchaseTemplate(saas)]);
    assert.ok(a.ok && b.ok);
    const posts = srv.calls.filter((c) => c.method === "POST");
    assert.equal(posts.length, 1, "klik ganda digabung");
    assert.match(posts[0].idem, /^tpl-/, "Idempotency-Key dikirim");
    const acc = useMarketStore.getState().account;
    assert.equal(acc.balance, 94, "saldo dari server, bukan dihitung klien");
    assert.equal(templateStatus("saas-launch", "premium", acc.entitlements), "owned");

    assert.equal((await commerceService.purchaseTemplate(saas)).error, "already-owned");
    const before = useMarketStore.getState().account;
    assert.equal((await commerceService.purchaseItem(slider)).error, "insufficient");
    assert.equal(useMarketStore.getState().account.balance, before.balance);
    const n = srv.calls.length;
    assert.equal((await commerceService.purchaseItem(rating)).error, "not-for-sale");
    assert.equal((await commerceService.purchaseTemplate(free)).error, "not-for-sale");
    assert.equal(srv.calls.length, n, "item Free tidak dikirim ke server");
  } finally {
    srv.restore();
    useMarketStore.setState({ account: emptyAccount(), status: "idle" });
  }
  assert.deepEqual(parseItemId("preset:pro-faq-accordion"), { kind: "section", ref: "pro-faq-accordion" });
  assert.equal(parseItemId("preset:<script>"), null);
  assert.equal(FREE_TEMPLATE_CHARGES_ON_USE, false);
});

/* ------------------------------------------------------------------ */
/* Paket desain                                                        */
/* ------------------------------------------------------------------ */

test("paket desain: 5 = 5 kredit, 50 = 30 kredit, kombinasi termurah, pembulatan & saran hemat", () => {
  assert.deepEqual(DESIGN_PACKAGES.map((p) => [p.designs, p.credits]), [[5, 5], [50, 30]]);
  assert.equal(quoteDesigns(5).credits, 5);
  assert.equal(quoteDesigns(50).credits, 30);
  assert.equal(quoteDesigns(55).credits, 35);
  assert.equal(quoteDesigns(100).credits, 60);
  assert.equal(quoteDesigns(10).credits, 10);
  assert.equal(normalizeDesignCount(7), 10);
  assert.equal(normalizeDesignCount(0), 5);
  assert.equal(normalizeDesignCount(10000), 200);
  assert.equal(betterDeal(45).designs, 50);
  assert.equal(betterDeal(45).credits, 30);
  assert.equal(betterDeal(5), null);
});

test("kuota desain bertambah setelah beli paket (batas dari server), batas lama tetap untuk tanpa paket", async () => {
  const limits = (max) => ({ designs: { used: MAX_DESIGNS, max }, sites: { used: 0, max: FREE_SITES } });
  const srv = mockServer({
    "POST /marketplace/design-packs": (c) => [200, { account: { ...serverAccount({ balance: 6, limits: limits(MAX_DESIGNS + c.body.designs) }), extraDesigns: c.body.designs } }],
  });
  try {
    useMarketStore.setState({ account: sanitizeAccount(serverAccount({ balance: 7, limits: limits(MAX_DESIGNS) })), status: "ready" });
    useDesignStore.setState({ designs: { [PAGE_DESIGN_TYPE]: Array.from({ length: MAX_DESIGNS }, (_, i) => ({ id: `d${i}`, name: `D${i}`, state: {}, updatedAt: i })) } });
    assert.equal(maxDesigns(), MAX_DESIGNS);
    assert.equal(designRoom(1).ok, false);
    const r = await commerceService.purchaseDesigns(4);
    assert.ok(r.ok);
    assert.equal(r.quote.designs, 5, "dibulatkan ke paket");
    assert.deepEqual(srv.calls[0].body, { designs: 5 });
    assert.equal(maxDesigns(), MAX_DESIGNS + 5);
    assert.equal(designRoom(5).ok, true);
    assert.equal(designRoom(6).ok, false);
  } finally {
    srv.restore();
    useMarketStore.setState({ account: emptyAccount(), status: "idle" });
    useDesignStore.setState({ designs: {} });
  }
  assert.equal(maxDesigns(), MAX_DESIGNS);
});

/* ------------------------------------------------------------------ */
/* Validasi akun dari server                                            */
/* ------------------------------------------------------------------ */

test("akun server divalidasi: data rusak dibuang, duplikat digabung, bentuk asing = akun kosong", () => {
  const dirty = sanitizeAccount({
    balance: -5,
    entitlements: {
      templates: [{ templateId: "<x>" }, { templateId: "event-summit", pricePaid: 6 }, { templateId: "event-summit" }],
      templateGrants: [{ templateId: "event-summit", itemIds: ["element:countdown", "javascript:1"] }],
      items: [{ itemId: "element:slider" }, { itemId: "element:slider" }, { itemId: "../etc" }],
    },
    transactions: [{ id: "t1", kind: "template", credits: -6, at: 1 }, { id: "t2", kind: "hack", credits: 999 }],
    limits: { designs: { used: 3, max: 25 } },
  });
  assert.equal(dirty.balance, 0);
  assert.equal(dirty.entitlements.templates.length, 1);
  assert.deepEqual(dirty.entitlements.templateGrants[0].itemIds, ["element:countdown"]);
  assert.equal(dirty.entitlements.items.length, 1);
  assert.deepEqual(dirty.transactions.map((t) => t.id), ["t1"]);
  assert.equal(dirty.limits.designs.max, 25);
  assert.equal(dirty.limits.sites.max, FREE_SITES, "default bila server tidak mengirim");
  assert.deepEqual(sanitizeAccount(null), emptyAccount());
  assert.deepEqual(sanitizeAccount("x"), emptyAccount());
});

/* ------------------------------------------------------------------ */
/* Desain dari template & ekspor                                        */
/* ------------------------------------------------------------------ */

test("desain mencatat template asal (tahan normalisasi); asal palsu dibuang", () => {
  const tpl = getTemplate("saas-launch");
  const { designs } = templateSite(tpl, "id", "X");
  const doc = normalizePageDoc(JSON.parse(JSON.stringify(designs[0].state)));
  assert.equal(docTemplateId(doc), "saas-launch");
  assert.equal(docTemplateId(normalizePageDoc({ ...doc, source: { templateId: "../../etc" } })), null);
  assert.equal(docTemplateId(normalizePageDoc({ version: 2, root: doc.root })), null);
});

test("ekspor website: izin elemen Premium per halaman mengikuti template asal", () => {
  const tpl = getTemplate("saas-launch");
  const { site, designs } = templateSite(tpl, "id", "X");
  const allowIfFrom = (doc) => (type) => doc.source?.templateId === "saas-launch" && type !== "slider";
  assert.deepEqual(buildSite(site, designs, { icons, allowPremiumElementsFor: allowIfFrom }).warnings, []);
  // Halaman tanpa asal template (desain dari nol) → elemen Premium terkunci.
  const stripped = designs.map((d) => ({ ...d, state: { version: 2, root: d.state.root } }));
  assert.ok(buildSite(site, stripped, { icons, allowPremiumElementsFor: allowIfFrom }).warnings.length > 0);
});

/* ------------------------------------------------------------------ */
/* Filter katalog                                                      */
/* ------------------------------------------------------------------ */

test("katalog: cari nama/deskripsi/tag, filter kategori & tier, urut harga/kategori, hasil kosong", async () => {
  const { templates } = await catalog();
  const q = (o) => queryTemplates(templates, { ...DEFAULT_TEMPLATE_QUERY, ...o });
  assert.equal(q({}).length, TEMPLATE_SPLIT.free + TEMPLATE_SPLIT.premium);
  assert.deepEqual(q({}).map((t) => t.id), templates.map((t) => t.id));
  assert.equal(q({ tier: "free" }).length, 32);
  assert.equal(q({ tier: "premium" }).length, TEMPLATE_SPLIT.premium);
  assert.deepEqual(q({ category: "shop" }).map((t) => t.refId).sort(), ["shop-boutique", "shop-furniture", "shop-gadget", "shop-skincare", "shop-starter"]);
  assert.ok(q({ text: "restoran" }).some((t) => t.refId === "restaurant-saji"));
  assert.ok(q({ text: "KONFERENSI" }).some((t) => t.refId === "event-summit"), "tag, tidak peka huruf besar");
  assert.equal(q({ text: "zzz-tidak-ada" }).length, 0);
  const asc = q({ sort: "price-asc" }).map((t) => t.price);
  assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
  const desc = q({ sort: "price-desc" }).map((t) => t.price);
  assert.deepEqual(desc, [...desc].sort((a, b) => b - a));
  const cat = q({ sort: "category" }).map((t) => t.category);
  assert.deepEqual(cat, [...cat].sort((a, b) => a.localeCompare(b)));
  assert.deepEqual(q({ tier: "free", text: "toko" }).map((t) => t.refId).sort(), ["agriculture-sangrai-lereng", "bakery-roti-hangat", "bookstore-toko-pojok", "dash-pasar-kita", "florist-kebun-kembang", "shop-starter"]);
});

test("akun kosong: tanpa hak akses, tanpa transaksi, batas default", () => {
  const s = emptyAccount();
  assert.deepEqual(s.entitlements, EMPTY_ENTITLEMENTS);
  assert.deepEqual(s.transactions, []);
  assert.equal(s.extraDesigns, 0);
  assert.equal(s.extraSites, 0);
  assert.equal(s.limits.designs.max, MAX_DESIGNS);
  assert.equal(s.limits.sites.max, FREE_SITES);
});

/* ------------------------------------------------------------------ */
/* Promo template 40% sampai 10 Januari 2027                            */
/* ------------------------------------------------------------------ */

test("promo: 40% dari harga awal sampai akhir 10 Jan 2027 (WIB), dibulatkan, Free tetap 0", async () => {
  const before = Date.parse("2026-10-15T10:00:00+07:00");
  const last = Date.parse("2027-01-10T23:59:59+07:00");
  const after = Date.parse("2027-01-11T00:00:00+07:00");
  assert.equal(TEMPLATE_PROMO.percentOff, 40);
  assert.deepEqual(promoPrice(10, before), { original: 10, price: 6, active: true, percentOff: 40 });
  assert.equal(promoPrice(4, before).price, 2);
  assert.equal(promoPrice(30, before).price, 18);
  assert.equal(promoPrice(1, before).price, 1, "minimal 1 kredit");
  assert.equal(promoPrice(0, before).price, 0);
  assert.equal(promoPrice(0, before).active, false);
  assert.equal(promoPrice(10, last).active, true);
  assert.deepEqual(promoPrice(10, after), { original: 10, price: 10, active: false, percentOff: 40 });
  assert.equal(promoActive(after), false);
  const r = promoRemaining(Date.parse("2027-01-09T22:58:58+07:00"));
  assert.deepEqual(r, { days: 1, hours: 1, minutes: 1, seconds: 1, ended: false });
  assert.equal(promoRemaining(after).ended, true);
});

/* ------------------------------------------------------------------ */
/* Paket folder website (diskon bertingkat)                             */
/* ------------------------------------------------------------------ */

test("paket website: 1 = 15 kredit, 10 = 105 kredit, makin banyak makin murah, kombinasi termurah", () => {
  assert.equal(quoteSites(1).credits, 15);
  assert.equal(quoteSites(10).credits, 105);
  const per = SITE_PACKAGES.map((p) => p.credits / p.sites);
  for (let i = 1; i < per.length; i++) assert.ok(per[i] < per[i - 1], "harga per website turun");
  assert.equal(quoteSites(11).credits, 120);
  assert.equal(quoteSites(2).credits, 30);
  assert.equal(quoteSites(0).sites, 1, "minimal 1");
  assert.equal(quoteSites(1000).sites, MAX_SITES_PER_PURCHASE);
  assert.equal(normalizeSiteCount(2.2), 3);
  // 9 website = 5 + 4×1 = 120 kredit > 10 website = 105 kredit → saran hemat.
  assert.equal(quoteSites(9).credits, 120);
  assert.deepEqual([betterSiteDeal(9).sites, betterSiteDeal(9).credits], [10, 105]);
  assert.equal(betterSiteDeal(10), null);
});

test("paket website: kuota folder bertambah setelah beli (batas dari server); saldo kurang ditolak", async () => {
  let paid = false;
  const srv = mockServer({
    "POST /marketplace/site-packs": (c) => {
      if (paid) return [402, { error: "Saldo kurang", code: "INSUFFICIENT_CREDITS" }];
      paid = true;
      return [200, { account: { ...serverAccount({ balance: 45, limits: { sites: { used: 0, max: FREE_SITES + c.body.sites } } }), extraSites: c.body.sites } }];
    },
  });
  try {
    useMarketStore.setState({ account: sanitizeAccount(serverAccount({ balance: 150 })), status: "ready" });
    assert.equal(siteLimit(), FREE_SITES);
    const r = await commerceService.purchaseSites(10);
    assert.ok(r.ok);
    assert.equal(r.quote.credits, 105);
    assert.equal(siteLimit(), FREE_SITES + 10);
    assert.equal(useMarketStore.getState().account.balance, 45);
    assert.equal(useMarketStore.getState().account.extraSites, 10);
    assert.equal((await commerceService.purchaseSites(10)).error, "insufficient");
    assert.equal(siteLimit(), FREE_SITES + 10, "gagal = tidak berubah");
  } finally {
    srv.restore();
    useMarketStore.setState({ account: emptyAccount(), status: "idle" });
  }
});
