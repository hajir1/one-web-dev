import { test } from "node:test";
import assert from "node:assert/strict";
import { pageList, pageRange, templateQueryFromSearch, templateSearchFromQuery } from "../catalogQuery";
import { sanitizeTemplatesPage, TEMPLATES_PER_PAGE } from "../../api/queries";

const CATS = ["shop", "spa", "tattoo"];
const parse = (s: string) => templateQueryFromSearch(new URLSearchParams(s), CATS);

test("URL katalog: filter & halaman dibaca dari query string, nilai asing → default", () => {
  assert.deepEqual(parse(""), { text: "", category: "all", tier: "all", sort: "featured", page: 1 });
  assert.deepEqual(parse("q=kopi&category=spa&tier=premium&sort=price-asc&page=3"), { text: "kopi", category: "spa", tier: "premium", sort: "price-asc", page: 3 });
  assert.deepEqual(parse("category=../x&tier=gold&sort=hack&page=-2"), { text: "", category: "all", tier: "all", sort: "featured", page: 1 });
  assert.equal(parse("page=abc").page, 1);
  assert.equal(parse("page=99999999").page, 10_000);
  assert.equal(parse(`q=${"a".repeat(300)}`).text.length, 100);
});

test("URL katalog: nilai default tidak ditulis; bolak-balik tetap sama", () => {
  assert.equal(templateSearchFromQuery({ text: "", category: "all", tier: "all", sort: "featured", page: 1 }).toString(), "");
  const q = { text: "salon rambut", category: "spa", tier: "free" as const, sort: "name" as const, page: 4 };
  const s = templateSearchFromQuery(q);
  assert.equal(s.get("page"), "4");
  assert.deepEqual(templateQueryFromSearch(s, CATS), q);
});

test("nomor halaman: awal & akhir selalu ada, tetangga halaman aktif, celah jadi …", () => {
  assert.deepEqual(pageList(1, 1), [1]);
  assert.deepEqual(pageList(1, 3), [1, 2, 3]);
  assert.deepEqual(pageList(1, 25), [1, 2, "gap", 25]);
  assert.deepEqual(pageList(6, 25), [1, "gap", 5, 6, 7, "gap", 25]);
  assert.deepEqual(pageList(3, 25), [1, 2, 3, 4, "gap", 25], "celah satu angka ditampilkan sebagai angka");
  assert.deepEqual(pageList(25, 25), [1, "gap", 24, 25]);
});

test("rentang item: 10 per halaman, halaman terakhir terpotong, kosong = 0–0", () => {
  assert.deepEqual(pageRange(1, 10, 250), { from: 1, to: 10 });
  assert.deepEqual(pageRange(3, 10, 27), { from: 21, to: 27 });
  assert.deepEqual(pageRange(1, 10, 0), { from: 0, to: 0 });
});

test("respons halaman template: angka & facet divalidasi, default 10 per halaman", () => {
  const params = { lang: "id", page: 2, tier: "all" as const, category: "all", q: "", sort: "featured" as const };
  const p = sanitizeTemplatesPage({ templates: [null, { refId: "../x" }], page: 2, pages: 25, limit: 10, total: 250, totalAll: 250, facets: { tier: { all: 250, free: 20, premium: 230 } } }, params);
  assert.equal(TEMPLATES_PER_PAGE, 10);
  assert.deepEqual(p.templates, []);
  assert.deepEqual([p.page, p.pages, p.limit, p.total, p.totalAll], [2, 25, 10, 250, 250]);
  assert.deepEqual(p.facets, { all: 250, free: 20, premium: 230 });
  const bad = sanitizeTemplatesPage({ page: -1, limit: "x", total: NaN }, params);
  assert.deepEqual([bad.page, bad.pages, bad.limit, bad.total], [2, 1, 10, 0]);
});

test("infinite scroll (v7): 12 per muatan, muatan berikutnya sampai habis, gabungan tanpa ganda, kunci ikut filter", async () => {
  const { templatesInfiniteQuery, flattenTemplatePages, TEMPLATES_PER_LOAD } = await import("../../api/queries");
  assert.equal(TEMPLATES_PER_LOAD, 12);
  const base = { lang: "id", tier: "all" as const, category: "dashboard", q: " admin ", sort: "featured" as const };
  const o = templatesInfiniteQuery(base);
  assert.equal(o.initialPageParam, 1);
  const pg = (page: number, pages: number, ids: string[]) => ({ templates: ids.map((refId) => ({ refId }) as never), page, pages, limit: 12, total: 30, totalAll: 350, facets: { all: 30, free: 10, premium: 20 } });
  assert.equal(o.getNextPageParam(pg(1, 3, []), [], 1, [1]), 2);
  assert.equal(o.getNextPageParam(pg(3, 3, []), [], 3, [1, 2, 3]), undefined, "muatan terakhir → berhenti");
  assert.deepEqual(
    flattenTemplatePages([pg(1, 2, ["a", "b"]), pg(2, 2, ["b", "c"])]).map((t) => t.refId),
    ["a", "b", "c"],
  );
  // Different filter → different key (list resets); search whitespace is normalized.
  const k1 = JSON.stringify(o.queryKey);
  assert.notEqual(k1, JSON.stringify(templatesInfiniteQuery({ ...base, category: "shop" }).queryKey));
  assert.equal(k1, JSON.stringify(templatesInfiniteQuery({ ...base, q: "admin" }).queryKey));
  assert.match(k1, /"limit":12/);
});
