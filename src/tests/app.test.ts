// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_CREDIT_PACKAGES, CREDIT_COST, baseRate, bestRate, formatIdr, packageSavings, pricePerCredit, sanitizePackages } from "../config/pricing";
import { MENU_SECTIONS, CREDITS_PATH } from "../config/menu";
import { DOC_TOPICS } from "../config/docs";
import { localizePath, splitLangPath, switchLangPath } from "../i18n";
import { configureServerClient } from "../pages/media/processing/serverClient";
import { hasItem, refreshBilling, unlockItem, useBilling } from "../pages/media/processing/billing";
import { itemKey } from "../credits/items";

const ROOT = join(import.meta.dirname, "..");
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

test("paket kredit berjenjang dalam Rupiah: makin besar makin murah; 100 kredit = Rp90.000 (Rp900/kredit)", () => {
  const rates = DEFAULT_CREDIT_PACKAGES.map(pricePerCredit);
  for (let i = 1; i < rates.length; i++) assert.ok(rates[i] < rates[i - 1], "harga per kredit turun");
  for (const p of DEFAULT_CREDIT_PACKAGES) assert.ok(Number.isInteger(p.priceIdr) && p.priceIdr >= 20000, `${p.id}: rupiah bulat ≥ Rp20.000`);
  assert.ok(DEFAULT_CREDIT_PACKAGES.every((p) => !("priceUsd" in p)), "tidak ada harga dolar");
  const p100 = DEFAULT_CREDIT_PACKAGES.find((p) => p.credits === 100);
  assert.equal(p100.priceIdr, 90000);
  assert.equal(p100.highlight, true);
  assert.equal(pricePerCredit(p100), 900);
  assert.equal(baseRate(), 1000);
  assert.equal(bestRate(), 800);
  assert.deepEqual(packageSavings(p100), { listIdr: 100000, idr: 10000, percent: 10 });
  assert.deepEqual(packageSavings(DEFAULT_CREDIT_PACKAGES[0]), { listIdr: 20000, idr: 0, percent: 0 });
  assert.equal(formatIdr(47500), "Rp47.500");
  // Paket dari server divalidasi; data rusak / desimal / dolar dibuang.
  assert.deepEqual(sanitizePackages([{ id: "b", credits: 20, priceIdr: 16000 }, { id: "a", credits: 10, priceIdr: 9000 }]).map((p) => p.id), ["a", "b"]);
  assert.equal(sanitizePackages([{ id: "x", credits: -1, priceIdr: 1000 }]), null, "data rusak → pakai paket bawaan");
  assert.equal(sanitizePackages([{ id: "x", credits: 10, priceIdr: 9999.5 }]), null, "rupiah wajib bilangan bulat");
  assert.equal(sanitizePackages([{ id: "x", credits: 10, priceUsd: 5 }]), null, "harga dolar tidak diterima");
  assert.equal(sanitizePackages([{ id: "a", credits: 10, priceIdr: 5000 }, { id: "b", credits: 20, priceIdr: 16000 }]), null, "paket besar tidak boleh lebih mahal per kredit");
  assert.equal(CREDIT_COST["premium-template"], 40);
  assert.equal(CREDIT_COST["site-slot"], 15);
  assert.equal(CREDIT_COST["premium-vr"], 50);
});

test("menu: Media tanpa pembelian kredit; Data mempertahankan 2 fitur utama; Credits terpisah", () => {
  const sec = Object.fromEntries(MENU_SECTIONS.map((s) => [s.id, s]));
  const media = sec.media.items.map((i) => i.path);
  assert.ok(!media.some((p) => /kredit|credit/.test(p)), "tidak ada item beli kredit di Media");
  const data = sec.data.items.map((i) => i.key);
  assert.deepEqual(data.slice(0, 2), ["excelToJson", "sqlConverter"]);
  assert.ok(sec["web-maker"].items.some((i) => i.path === "/web-templates"));
  assert.equal(CREDITS_PATH, "/credits");
  // Setiap menu punya topik bantuan.
  const topics = new Set(DOC_TOPICS.map((d) => d.id));
  for (const s of MENU_SECTIONS) for (const i of s.items) assert.ok(topics.has(i.doc), `${i.key} → ${i.doc}`);
});

test("URL bahasa: /id & /en, ganti bahasa mempertahankan halaman, query & hash", () => {
  assert.deepEqual(splitLangPath("/en/media-tools"), { lang: "en", rest: "/media-tools" });
  assert.deepEqual(splitLangPath("/media-tools"), { lang: null, rest: "/media-tools" });
  assert.deepEqual(splitLangPath("/de/x"), { lang: null, rest: "/de/x" });
  assert.equal(localizePath("/credits", "en"), "/en/credits");
  assert.equal(localizePath("/", "id"), "/id");
  assert.equal(localizePath("/id/website?x=1#a", "en"), "/en/website?x=1#a");
  assert.equal(localizePath("https://example.com", "en"), "https://example.com");
  assert.equal(localizePath("//evil.test", "en"), "//evil.test");
  assert.equal(switchLangPath("/id/data-tools/utilities/jwt", "?q=1", "#t", "en"), "/en/data-tools/utilities/jwt?q=1#t");
});

test("terjemahan: kunci ID = EN, tidak ada teks kosong, semua t(\"…\") statis ada", () => {
  const flat = (o, p = "", out = {}) => {
    for (const [k, v] of Object.entries(o)) {
      const key = p ? `${p}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, out);
      else out[key] = v;
    }
    return out;
  };
  const id = flat(JSON.parse(readFileSync(join(ROOT, "locales/id.json"), "utf8")));
  const en = flat(JSON.parse(readFileSync(join(ROOT, "locales/en.json"), "utf8")));
  // Bahasa Indonesia hanya punya bentuk jamak "other"; samakan sufiks plural sebelum membandingkan.
  const base = (keys) => [...new Set(keys.map((k) => k.replace(/_(zero|one|two|few|many|other)$/, "")))].sort();
  assert.deepEqual(base(Object.keys(id)), base(Object.keys(en)));
  for (const [k, v] of Object.entries(en)) assert.ok(v !== "" && v !== null, `kosong: ${k}`);

  const files = [];
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      if (n === "node_modules" || n === "tests" || n === "locales") continue;
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|jsx?)$/.test(n)) files.push(p);
    }
  };
  walk(ROOT);
  const missing = [];
  const has = (k) => k in id || `${k}_one` in id || `${k}_other` in id || Object.keys(id).some((x) => x.startsWith(`${k}.`));
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/\bt\(\s*"([a-zA-Z][\w-]*(?:\.[\w-]+)+)"/g)) if (!has(m[1])) missing.push(`${f.replace(ROOT, "")}: ${m[1]}`);
  }
  assert.deepEqual(missing, []);
});

test("item berbayar (template/slot): akses hanya setelah server mengonfirmasi; klik ganda = 1 permintaan", async () => {
  const calls = [];
  let items = [];
  configureServerClient({
    baseUrl: "https://api.contoh.test",
    fetch: async (url, init = {}) => {
      const u = String(url);
      calls.push({ u, method: init.method ?? "GET", key: new Headers(init.headers).get("Idempotency-Key"), body: init.body });
      if (u.endsWith("/billing/account")) return json(200, { balance: 10, entitlements: {}, items });
      if (u.endsWith("/billing/pricing") || u.endsWith("/billing/packages")) return json(404, {});
      if (u.endsWith("/billing/unlock-item")) {
        items = [...items, JSON.parse(init.body).item];
        return json(200, { account: { balance: 2, entitlements: {}, items } });
      }
      return json(404, {});
    },
  });
  await refreshBilling();
  const key = itemKey.template("shop-boutique");
  assert.equal(hasItem(key), false);
  await Promise.all([unlockItem(key, "premium-template"), unlockItem(key, "premium-template")]);
  const unlocks = calls.filter((c) => c.u.endsWith("/billing/unlock-item"));
  assert.equal(unlocks.length, 1, "klik ganda digabung");
  assert.match(unlocks[0].key, /^item-template:shop-boutique-/);
  assert.equal(hasItem(key), true);
  assert.equal(useBilling.getState().account.balance, 2, "saldo dari respons server");
  // Sudah dimiliki → tidak ada permintaan/biaya baru.
  await unlockItem(key, "premium-template");
  assert.equal(calls.filter((c) => c.u.endsWith("/billing/unlock-item")).length, 1);
  await assert.rejects(unlockItem("bad key!", "premium-template"));
  assert.equal(itemKey.siteSlot(3), "site-slot:3");
  configureServerClient({ baseUrl: "" });
});

test("locale split (core + rest) sama dengan sumber dan tidak basi", async () => {
  // @ts-expect-error skrip .mjs tanpa tipe
  const { splitLocale, REST_KEYS } = await import("../../scripts/split-locales.mjs");
  for (const lang of ["id", "en"]) {
    const all = JSON.parse(readFileSync(join(ROOT, `locales/${lang}.json`), "utf8"));
    const want = splitLocale(all);
    const core = JSON.parse(readFileSync(join(ROOT, `locales/split/${lang}.core.json`), "utf8"));
    const rest = JSON.parse(readFileSync(join(ROOT, `locales/split/${lang}.rest.json`), "utf8"));
    assert.deepEqual(core, want.core, `${lang}.core basi: jalankan npm run locales`);
    assert.deepEqual(rest, want.rest, `${lang}.rest basi: jalankan npm run locales`);
    for (const k of REST_KEYS) assert.ok(!(k in core), `${k} tidak boleh di core`);
    // Beranda & shell tidak boleh butuh bagian rest.
    for (const k of ["nav", "home", "demo", "common", "auth", "app"]) assert.ok(k in core, `${k} harus di core`);
  }
});
