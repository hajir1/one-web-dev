// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { ApiError, ApiUnavailableError, api, apiFetch, newIdempotencyKey, onSessionExpired } from "../client";
import { DEFAULT_API_BASE, apiConfig, configureApi, resolveApiBase } from "../../pages/media/processing/apiConfig";
import { acquireTemplate, clearTemplateCache, demoPageUrl, sanitizePages } from "../../pages/webTemplates/templateContent";

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function server(handler) {
  const calls = [];
  const prev = { baseUrl: apiConfig.baseUrl, fetch: apiConfig.fetch };
  configureApi({
    baseUrl: "http://localhost:3000",
    fetch: async (url, init = {}) => {
      const c = { url: String(url), method: init.method ?? "GET", credentials: init.credentials, headers: new Headers(init.headers), body: init.body };
      calls.push(c);
      return handler(c, calls);
    },
  });
  return { calls, restore: () => configureApi(prev) };
}

test("base URL: default http://localhost:3000; VITE_API_BASE_URL menang; 'off' = tanpa backend; nilai aneh ditolak", () => {
  assert.equal(DEFAULT_API_BASE, "http://localhost:3000");
  assert.equal(resolveApiBase({}), "http://localhost:3000");
  assert.equal(resolveApiBase(undefined), "http://localhost:3000");
  assert.equal(resolveApiBase({ VITE_API_BASE_URL: "https://api.contoh.id/" }), "https://api.contoh.id");
  assert.equal(resolveApiBase({ VITE_MEDIA_API_BASE: "http://lama.test" }), "http://lama.test", "nama env lama tetap dibaca");
  assert.equal(resolveApiBase({ VITE_API_BASE_URL: "http://baru.test", VITE_MEDIA_API_BASE: "http://lama.test" }), "http://baru.test");
  assert.equal(resolveApiBase({ VITE_API_BASE_URL: "off" }), null);
  assert.equal(resolveApiBase({ VITE_API_BASE_URL: "" }), null);
  assert.equal(resolveApiBase({ VITE_API_BASE_URL: "javascript:alert(1)" }), null);
});

test("api(): cookie ikut, JSON + Idempotency-Key, error membawa kode server", async () => {
  const srv = server((c) => (c.url.endsWith("/boom") ? json(402, { error: "Saldo kurang", code: "INSUFFICIENT_CREDITS" }) : json(200, { ok: true })));
  try {
    const r = await api("/x", { body: { a: 1 }, idempotencyKey: "k-1" });
    assert.deepEqual(r, { ok: true });
    const c = srv.calls[0];
    assert.equal(c.url, "http://localhost:3000/x");
    assert.equal(c.method, "POST");
    assert.equal(c.credentials, "include");
    assert.equal(c.headers.get("Idempotency-Key"), "k-1");
    assert.equal(c.headers.get("Content-Type"), "application/json");
    assert.ok(c.headers.get("Accept-Language"));
    await assert.rejects(api("/boom"), (e) => e instanceof ApiError && e.status === 402 && e.code === "INSUFFICIENT_CREDITS" && e.message === "Saldo kurang");
    assert.match(newIdempotencyKey("tpl"), /^tpl-/);
    assert.notEqual(newIdempotencyKey(), newIdempotencyKey());
  } finally {
    srv.restore();
  }
});

test("401 → satu kali /auth/refresh lalu diulang; refresh gagal → sesi berakhir; rute auth tidak di-refresh", async () => {
  let fresh = false;
  let expired = 0;
  const off = onSessionExpired(() => expired++);
  const srv = server((c) => {
    if (c.url.endsWith("/auth/refresh")) {
      fresh = true;
      return json(200, {});
    }
    if (c.url.endsWith("/auth/login")) return json(401, { error: "salah" });
    return fresh ? json(200, { me: 1 }) : json(401, {});
  });
  try {
    const [a, b] = await Promise.all([api("/auth/me"), api("/designs")]);
    assert.deepEqual([a, b], [{ me: 1 }, { me: 1 }]);
    assert.equal(srv.calls.filter((c) => c.url.endsWith("/auth/refresh")).length, 1, "refresh paralel digabung");
    await assert.rejects(api("/auth/login", { body: {} }), (e) => e.status === 401);
    assert.equal(srv.calls.filter((c) => c.url.endsWith("/auth/refresh")).length, 1, "login salah tidak memicu refresh");
  } finally {
    srv.restore();
  }
  const srv2 = server(() => json(401, {}));
  try {
    const res = await apiFetch("/billing/account");
    assert.equal(res.status, 401);
    assert.equal(expired, 1);
  } finally {
    srv2.restore();
    off();
  }
  const prev = apiConfig.baseUrl;
  configureApi({ baseUrl: null });
  await assert.rejects(api("/x"), ApiUnavailableError);
  configureApi({ baseUrl: prev });
});

test("isi template: hanya lewat POST /acquire, divalidasi, salinan baru tiap kali; demo statis per halaman", async () => {
  const ref = { id: "shop-boutique", version: 3 };
  const page = (key, home = false) => ({ key, slug: key, name: key.toUpperCase(), home, doc: { version: 2, root: { id: "r", type: "page", children: [] } } });
  const srv = server((c) =>
    c.url.endsWith("/templates/shop-boutique/acquire") ? json(200, { pages: [page("beranda", true), page("kontak"), { key: "rusak" }, null] }) : json(402, { error: "Terkunci", code: "TEMPLATE_LOCKED" }),
  );
  try {
    clearTemplateCache();
    const a = await acquireTemplate(ref, "id");
    assert.equal(srv.calls[0].method, "POST");
    assert.equal(JSON.parse(srv.calls[0].body).lang, "id");
    assert.deepEqual(a.map((p) => p.key), ["beranda", "kontak"], "halaman tanpa dokumen dibuang");
    assert.deepEqual(a[0].doc.source, { templateId: "shop-boutique", version: 3 }, "asal template dicatat");
    a[0].doc.root.children.push("x");
    const b = await acquireTemplate(ref, "id");
    assert.equal(srv.calls.length, 1, "di-cache");
    assert.deepEqual(b[0].doc.root.children, [], "mengedit salinan tidak mengubah cache");
    await assert.rejects(acquireTemplate({ id: "premium-x", version: 1 }, "id"), (e) => e.status === 402 && e.code === "TEMPLATE_LOCKED");
  } finally {
    srv.restore();
    clearTemplateCache();
  }
  assert.equal(sanitizePages([page("a"), page("b")], { id: "t", version: 1 })[0].home, true, "tanpa beranda → halaman pertama");
  assert.deepEqual(sanitizePages("x", { id: "t", version: 1 }), []);
  const demo = "http://localhost:3000/templates/shop-boutique/demo/id/index.html";
  assert.equal(demoPageUrl(demo), demo);
  assert.equal(demoPageUrl(demo, { slug: "kontak", home: false }), "http://localhost:3000/templates/shop-boutique/demo/id/kontak.html");
  assert.equal(demoPageUrl(demo, { slug: "../x", home: false }).endsWith("..%2Fx.html"), true);
  assert.equal(demoPageUrl(undefined), null);
});
