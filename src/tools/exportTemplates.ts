// @ts-nocheck — skrip Node (tsx), tidak ikut bundle aplikasi.
/* ================================================================== */
/* Ekspor katalog & template frontend → data seed backend.              */
/*                                                                    */
/*   npx tsx src/tools/exportTemplates.ts <folder-tujuan>               */
/*                                                                    */
/* Hasil:                                                              */
/*   catalog-items.json        harga & tier section/elemen/event/fitur  */
/*   templates/<id>.json       paket owd-template@1 per template:        */
/*                             metadata + isi (id/en) + demo HTML statis */
/*   v14: 37 Template Kode (undangan, animasi, 3D) ikut diekspor dengan   */
/*   template.kind = "code": isi = satu berkas index.html.               */
/* Lalu di backend: salin ke prisma/seed/ dan jalankan `npm run db:seed`.*/
/* Setelah template ada di server, isi template tidak lagi dibutuhkan   */
/* di bundle frontend (halaman Web Templates memuatnya dari API).       */
/* ================================================================== */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { makeIconLookup } from "../pages/pageMaker/core/helpers/elementDefinition";
import { WEB_TEMPLATES, buildTemplatePages } from "../pages/webTemplates/registry";
import { templateFiles } from "../pages/webTemplates/exportTemplate";
import { buildElementCatalog, buildSectionCatalog } from "../marketplace/data/catalog";
import { buildTemplateCatalog } from "../marketplace/data/templateCatalog";
import { FEATURE_ITEMS } from "../marketplace/data/prices";
import { EVENTS } from "../pages/pageMaker/engine/helpers/events";
import { CREDIT_COST } from "../config/pricing";
import { CODE_TEMPLATE_CATALOG } from "../pages/webTemplates/codeTemplates/catalog";
import { latestSortOrder } from "../config/templates";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] ?? "template-export");
const only = process.argv[3] ? new Set(process.argv[3].split(",")) : null;
const locale = (lang: string) => JSON.parse(readFileSync(join(here, "..", "locales", `${lang}.json`), "utf8"));
const L = { id: locale("id"), en: locale("en") };
const tplText = (lang: "id" | "en", id: string, key: "name" | "description") => L[lang]?.templates?.items?.[id]?.[key];

const CONTENT_TYPE: Record<string, string> = { html: "text/html", css: "text/css", svg: "image/svg+xml", js: "text/javascript" };
const icons = makeIconLookup([]);

mkdirSync(join(out, "templates"), { recursive: true });

// 1. Katalog item (harga & tier). Nama = label teknis; terjemahan tetap di frontend.
const sections = buildSectionCatalog();
const elements = buildElementCatalog();
const items = [
  ...sections.map((s) => ({ id: s.id, kind: "section", refId: s.refId, name: s.name, category: s.category, tier: s.tier, price: s.price, isNew: s.isNew })),
  ...elements.map((e) => ({ id: e.id, kind: "element", refId: e.refId, name: e.name, category: e.category, tier: e.tier, price: e.price, isNew: e.isNew })),
  ...EVENTS.map((e) => ({
    id: `event:${e.name}`,
    kind: "event",
    refId: e.name,
    name: e.name,
    category: "event",
    tier: e.free ? "free" : "premium",
    price: e.free ? 0 : (CREDIT_COST["premium-event"] ?? 1),
    isNew: false,
  })),
  ...Object.entries(FEATURE_ITEMS).map(([id, f]) => ({ id: `feature:${id}`, kind: "feature", refId: id, name: f.name, category: "feature", tier: "premium", price: f.price, isNew: false })),
];
writeFileSync(join(out, "catalog-items.json"), JSON.stringify({ format: "owd-catalog@1", items }, null, 1));

// 2. Template: metadata + isi + demo statis per bahasa.
const meta = new Map(buildTemplateCatalog({ sections, elements }, WEB_TEMPLATES).map((t) => [t.refId, t]));
let n = 0;
let bytes = 0;
WEB_TEMPLATES.forEach((t, index) => {
  if (only && !only.has(t.id)) return;
  const m = meta.get(t.id)!;
  const contents: Record<string, unknown[]> = {};
  const demo: Record<string, { path: string; contentType: string; body: string }[]> = {};
  for (const lang of ["id", "en"] as const) {
    const built = buildTemplatePages(t, lang);
    contents[lang] = built.map((p) => ({ key: p.key, slug: p.slug, name: p.name, home: p.home, doc: p.doc }));
    const { files } = templateFiles(t, lang, t.content.brand, built, { icons, allowPremiumElements: true });
    demo[lang] = files
      .filter((f) => f.name !== "README.md")
      .map((f) => ({ path: f.name, contentType: CONTENT_TYPE[f.name.split(".").pop() ?? ""] ?? "text/plain", body: f.content }));
  }
  const bundle = {
    format: "owd-template@1",
    status: "PUBLISHED",
    template: {
      id: t.id,
      name: { id: tplText("id", t.id, "name") ?? t.id, en: tplText("en", t.id, "name") ?? tplText("id", t.id, "name") ?? t.id },
      description: { id: tplText("id", t.id, "description") ?? "", en: tplText("en", t.id, "description") ?? tplText("id", t.id, "description") ?? "" },
      category: t.category,
      tier: t.tier,
      price: t.price,
      accent: t.accent,
      tags: t.tags ?? [],
      version: t.version ?? 1,
      isNew: !!t.isNew,
      sortOrder: latestSortOrder(t.id, index),
      pages: t.content.pages.map((p) => ({ key: p.key, home: !!p.home, name: p.name, slug: p.slug })),
      sectionIds: m.sectionIds,
      elementIds: m.elementIds,
      premiumItemIds: m.premiumItemIds,
      libraries: m.libraries,
      fonts: m.fonts,
      sectionCount: m.sectionCount,
    },
    contents,
    demo,
  };
  const json = JSON.stringify(bundle);
  bytes += json.length;
  writeFileSync(join(out, "templates", `${t.id}.json`), json);
  n++;
});
// 3. v14: Template Kode. Isi = berkas HTML apa adanya (sama dengan unduhan zip);
//    demo publik dibuat backend dari berkas yang sama. Harga awal = harga katalog
//    (Premium); admin bisa menjadikannya gratis atau mengubah harganya di panel.
let nCode = 0;
CODE_TEMPLATE_CATALOG.forEach((t, index) => {
  if (only && !only.has(t.id)) return;
  const html = readFileSync(join(here, "..", "pages", "webTemplates", "codeTemplates", "files", `${t.id}.html`), "utf8");
  const nameId = tplText("id", t.id, "name") ?? t.id;
  const descId = tplText("id", t.id, "description") ?? "";
  const bundle = {
    format: "owd-template@1",
    status: "PUBLISHED",
    template: {
      id: t.id,
      kind: "code",
      code: t.code,
      name: { id: nameId, en: tplText("en", t.id, "name") ?? nameId },
      description: { id: descId, en: tplText("en", t.id, "description") ?? descId },
      category: t.category,
      tier: t.tier,
      price: t.tier === "free" ? 0 : t.price,
      accent: t.accent,
      tags: t.tags ?? [],
      version: t.version ?? 1,
      isNew: !!t.isNew,
      // Template kode tampil di atas template lain (sortOrder negatif); unggahan terakhir tetap paling atas.
      sortOrder: latestSortOrder(t.id, index - CODE_TEMPLATE_CATALOG.length),
      pages: [{ key: "home", home: true, name: { id: "Beranda", en: "Home" }, slug: { id: "index", en: "index" } }],
      libraries: [],
      fonts: [],
      sectionCount: 0,
    },
    // Template kode berbahasa tunggal (teksnya bagian dari desain): satu isi untuk id & en.
    contents: { id: [{ key: "home", slug: "index", name: nameId, home: true, html }] },
  };
  const json = JSON.stringify(bundle);
  bytes += json.length;
  writeFileSync(join(out, "templates", `${t.id}.json`), json);
  nCode++;
});

console.log(`Selesai: ${items.length} item katalog, ${n} template + ${nCode} template kode (${(bytes / 1048576).toFixed(1)} MB) → ${out}`);
