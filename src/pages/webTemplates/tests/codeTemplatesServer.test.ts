// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { apiConfig, configureApi } from "../../media/processing/apiConfig";
import { acquireCodeTemplateHtml } from "../templateContent";
import { clearCodeTemplateCache, loadCodeTemplate, setCodeTemplateSource } from "../codeTemplates/catalog";
import { sanitizeTemplate } from "../../../marketplace/repository";

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const HTML = "<!doctype html><html><body>Sekar &amp; Arum</body></html>";

function server(handler) {
  const calls = [];
  const prev = { baseUrl: apiConfig.baseUrl, fetch: apiConfig.fetch };
  configureApi({
    baseUrl: "http://localhost:3000",
    fetch: async (url, init = {}) => {
      calls.push({ url: String(url), method: init.method ?? "GET", body: init.body });
      return handler(String(url));
    },
  });
  return { calls, restore: () => configureApi(prev) };
}

test("v21.2 template kode dari server: metadata code dikenali, nilai aneh dibuang", () => {
  const base = { refId: "undangan-nikah-jawa-sekar-arum", tier: "premium", price: 120, demoUrl: "http://localhost:3000/templates/x/demo/id/index.html" };
  const t = sanitizeTemplate({ ...base, code: { group: "invitation", budgetKb: 150, libs: ["AOS 2.3.4", 5] } });
  assert.deepEqual(t.code, { group: "invitation", budgetKb: 150, libs: ["AOS 2.3.4"] });
  assert.equal(t.tier, "premium");
  assert.equal(t.price, 120);
  assert.equal(sanitizeTemplate({ ...base, code: { group: "video" } }).code, undefined);
  assert.equal(sanitizeTemplate(base).code, undefined, "template Page Maker tetap tanpa code");
});

test("v21.2 HTML template kode diambil lewat acquire (402 bila Premium belum dibeli), di-cache per template", async () => {
  const srv = server((url) =>
    url.endsWith("/templates/anim-taman-kunang/acquire")
      ? json(200, { html: HTML, lang: "id" })
      : url.endsWith("/templates/anim-sakura-senja/acquire")
        ? json(200, { html: "bukan html" })
        : json(402, { error: "Terkunci", code: "TEMPLATE_LOCKED" }),
  );
  setCodeTemplateSource(acquireCodeTemplateHtml);
  try {
    assert.equal(await loadCodeTemplate("anim-taman-kunang"), HTML);
    assert.equal(await loadCodeTemplate("anim-taman-kunang"), HTML);
    assert.equal(srv.calls.length, 1, "di-cache");
    assert.equal(srv.calls[0].method, "POST");
    await assert.rejects(loadCodeTemplate("motion-lini-saas"), (e) => e.status === 402 && e.code === "TEMPLATE_LOCKED");
    await assert.rejects(loadCodeTemplate("anim-sakura-senja"), /TEMPLATE_CONTENT_MISSING/);
    await assert.rejects(loadCodeTemplate("bukan-template"), /TEMPLATE_NOT_FOUND/);
    assert.equal(srv.calls.length, 3, "id yang tidak dikenal tidak dikirim ke server");
    clearCodeTemplateCache();
    await loadCodeTemplate("anim-taman-kunang");
    assert.equal(srv.calls.length, 4, "keluar akun → ambil ulang (hak akses dicek lagi)");
  } finally {
    setCodeTemplateSource(null);
    srv.restore();
  }
});
