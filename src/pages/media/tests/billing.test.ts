// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PRICING,
  CREDIT_PACKAGES,
  accessState,
  costOf,
  estimateUses,
  formatCredits,
  formatCreditValue,
  formatMoney,
  mergePricing,
  packCostPerUse,
  packUsesOf,
  planCharge,
  sanitizeAccount,
  usageFactor,
  usesForCredits,
  validateServerInput,
} from "../processing/pricing";
import { MEDIA_TOOLS, TOOL_BY_ID, availableModes, isServerOnly } from "../processing/policy";
import { SERVER_UNAVAILABLE_MESSAGE } from "../processing/apiConfig";
import { BillingUnavailableError, refreshBilling, safeCheckoutUrl, sanitizeTransactions, startCheckout, unlockFeature, useBilling, verifyCheckout } from "../processing/billing";
import {
  configureServerClient,
  FeatureLockedError,
  InsufficientCreditError,
  isServerConfigured,
  jobKey,
  runServerJob,
  ServerJobError,
  ServerUnavailableError,
  StopQueueError,
} from "../processing/serverClient";
import { encodeWav, mixToMono, sliceChannels, wavBytes } from "../lib/wav";
import { compressPlan, gifPlan } from "../lib/serverPlans";

const P = DEFAULT_PRICING;
// v11: Media & Data memakai kuota paket; mesin kredit/paket fitur di bawah diuji dengan tarif kredit (seperti VR).
const legacy = (p) => ({ ...p, inPlan: false, unlockRequired: true });
const MB = 1024 * 1024;
const acct = (balance, ents = {}) => ({ balance, entitlements: ents, syncedAt: 0 });
const hdr = (init, k) => new Headers(init.headers).get(k);
/** Tiket unggah: URL storage luar (bukan API) → PUT tanpa cookie. */
const uploadTicket = (id = "u1") => json(201, { uploadId: id, upload: { method: "PUT", url: `https://store.test/put/${id}?sig=abc`, headers: { "Content-Type": "image/png" } } });
/** Bungkus fetch job: tangani langkah unggah (POST …/uploads + PUT ke storage), sisanya ke `rest`. */
const withUpload = (rest, puts = []) => async (url, init = {}) => {
  const u = String(url);
  if (u.endsWith("/uploads")) return uploadTicket();
  if (u.startsWith("https://store.test/")) {
    puts.push({ url: u, init });
    return new Response(null, { status: 200 });
  }
  return rest(url, init);
};

/* ------------------------------ harga ------------------------------- */

test("harga: konfigurasi awal sesuai tabel & terpusat", () => {
  assert.deepEqual(
    ["remove-background", "video-to-gif", "image-upscaler", "video-to-frames"].map((f) => [P[f].costPerUse, P[f].usesPerCredit]),
    [[0.5, 12], [1, 7], [1.25, 8], [0.5, 10]],
  );
  for (const p of Object.values(P)) {
    assert.ok(p.costPerUse > 0 && p.usesPerCredit >= 1 && p.packPrice > 0, p.feature);
    assert.ok(packCostPerUse(p) <= p.costPerUse + 1e-9, `paket ${p.feature} tidak lebih mahal dari bayar per pakai`);
  }
  assert.ok(CREDIT_PACKAGES.every((k) => k.credits > 0));
  assert.equal(formatCredits(0.25), "0,25 kredit");
  assert.equal(formatCreditValue(0.5), "Rp500", "hapus latar belakang = Rp500 per gambar");
  assert.equal(formatMoney(47500), "Rp47.500");
});

test("biaya: pengali per ukuran/durasi/skala, batas server", () => {
  const rb = P["remove-background"];
  assert.equal(usageFactor(rb, { bytes: 5 * MB }), 1);
  assert.equal(usageFactor(rb, { bytes: 15 * MB }), 1.5);
  assert.equal(costOf(rb, { bytes: 15 * MB }), 0.75);
  assert.equal(packUsesOf(rb, { bytes: 15 * MB }), 2);
  assert.equal(costOf(P["video-to-gif"], { seconds: 25 }), 2);
  assert.equal(costOf(P["image-upscaler"], { scale: 4 }), 1.875);
  assert.equal(usageFactor(rb, {}), 1, "tanpa data = tingkat dasar");
  assert.match(validateServerInput(rb, { bytes: 30 * MB }), /25 MB/);
  assert.match(validateServerInput(P["video-to-gif"], { seconds: 31 }), /30 detik/);
  assert.match(validateServerInput(P["video-compress"], { seconds: 3601 }), /60 menit/);
  assert.equal(validateServerInput(rb, { bytes: MB }), null);
});

test("rencana biaya: kuota paket dulu, lalu saldo; kekurangan dihitung", () => {
  const rb = legacy(P["remove-background"]);
  const inputs = [{ bytes: MB }, { bytes: MB }, { bytes: 15 * MB }];
  // tanpa akun: semua dihitung dari saldo, keterjangkauan tidak diketahui
  assert.deepEqual(planCharge(rb, inputs, null), { packUses: 0, credits: 1.75, creditsWithoutPack: 1.75, affordable: null, shortfall: 0 });
  // 2 kuota paket → 2 file kecil dari paket, file besar dari saldo
  const a = acct(0.5, { "remove-background": { unlocked: true, packUses: 2 } });
  const p1 = planCharge(rb, inputs, a);
  assert.equal(p1.packUses, 2);
  assert.equal(p1.credits, 0.75);
  assert.equal(p1.affordable, false);
  assert.equal(p1.shortfall, 0.25);
  assert.equal(planCharge(rb, inputs, acct(2, { "remove-background": { unlocked: true, packUses: 0 } })).affordable, true);
});

test("status akses: belum tersedia > belum dimuat > terkunci > saldo kurang > terbuka", () => {
  const p = legacy(P["video-to-gif"]);
  assert.equal(accessState(p, { serverAvailable: false, account: acct(100, { "video-to-gif": { unlocked: true, packUses: 9 } }) }), "unavailable");
  assert.equal(accessState({ ...p, enabled: false }, { serverAvailable: true, account: acct(9) }), "unavailable");
  assert.equal(accessState(p, { serverAvailable: true, account: null }), "unknown");
  assert.equal(accessState(p, { serverAvailable: true, account: acct(50) }), "locked", "saldo banyak tapi akses belum dibeli");
  assert.equal(accessState(p, { serverAvailable: true, account: acct(0, { "video-to-gif": { unlocked: true, packUses: 0 } }) }), "insufficient");
  assert.equal(accessState(p, { serverAvailable: true, account: acct(0, { "video-to-gif": { unlocked: true, packUses: 1 } }) }), "ready");
  assert.equal(accessState({ ...p, unlockRequired: false }, { serverAvailable: true, account: acct(1) }), "ready", "bayar per pakai tanpa paket bila diizinkan");
});

test("perkiraan penggunaan & kalkulator", () => {
  const up = legacy(P["image-upscaler"]);
  assert.equal(estimateUses(up, null), null);
  assert.equal(estimateUses(up, acct(10)), 0, "terkunci");
  assert.equal(estimateUses(up, acct(5, { "image-upscaler": { unlocked: true, packUses: 3 } })), 7);
  assert.deepEqual(usesForCredits(P["remove-background"], 50), { payPerUse: 100, viaPacks: 120 });
  assert.deepEqual(usesForCredits(P["video-to-gif"], 5), { payPerUse: 5, viaPacks: 7 });
});

test("harga & akun dari backend disanitasi", () => {
  const m = mergePricing(P, { "video-to-gif": { costPerUse: 0.3, usesPerCredit: 5.7, enabled: false, unlockRequired: false }, "remove-background": { costPerUse: -1, usesPerCredit: "x" } });
  assert.equal(m["video-to-gif"].costPerUse, 0.3);
  assert.equal(m["video-to-gif"].usesPerCredit, 5);
  assert.equal(m["video-to-gif"].enabled, false);
  assert.equal(m["remove-background"].costPerUse, 0.5, "nilai tidak valid diabaikan");
  assert.equal(m["image-upscaler"], P["image-upscaler"]);
  // v6: saldo boleh negatif (setelah refund/chargeback) dan tetap ditampilkan apa adanya.
  assert.equal(sanitizeAccount({ balance: -5 }).balance, -5);
  assert.equal(sanitizeAccount({ balance: "x" }), null);
  const a = sanitizeAccount({ balance: 2.5, entitlements: { "video-to-gif": { unlocked: true, packUses: 3.9 }, palsu: { unlocked: true } } });
  assert.deepEqual(a.entitlements, { "video-to-gif": { unlocked: true, packUses: 3 } });
});

/* ------------------------------ kebijakan ---------------------------- */

test("kebijakan: fitur browser gratis vs fitur server berbayar", () => {
  assert.equal(MEDIA_TOOLS.length, 12); // v10: + favicon-generator, og-image
  assert.deepEqual(availableModes("audio-converter"), ["browser"]);
  assert.equal(TOOL_BY_ID["audio-converter"].serverFeature, undefined);
  assert.deepEqual(availableModes("image-converter"), ["browser"]);
  assert.deepEqual(availableModes("audio-extract"), ["browser", "server"]);
  assert.equal(isServerOnly("video-to-gif"), true);
  assert.equal(isServerOnly("video-compress"), true);
  assert.equal(isServerOnly("remove-background"), false);
  for (const t of MEDIA_TOOLS) {
    if (t.modes.server) assert.ok(t.serverFeature && P[t.serverFeature], `${t.id} punya harga`);
    else assert.equal(t.serverFeature, undefined, `${t.id} browser-only tanpa harga`);
  }
  assert.equal(TOOL_BY_ID["metadata-remover"].modes.server, undefined);
});

/* ---------------------------- klien billing --------------------------- */

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("billing tanpa backend: tidak ada transaksi, tidak ada saldo palsu", async () => {
  configureServerClient({ baseUrl: null });
  useBilling.setState({ account: null, status: "idle" });
  await refreshBilling();
  assert.equal(useBilling.getState().status, "unavailable");
  assert.equal(useBilling.getState().account, null);
  await assert.rejects(startCheckout("kredit-10", "https://x.test/kredit"), BillingUnavailableError);
  await assert.rejects(unlockFeature("video-to-gif"), BillingUnavailableError);
  await assert.rejects(verifyCheckout("sess_123456"), BillingUnavailableError);
  assert.equal(useBilling.getState().account, null);
});

test("billing dengan backend: saldo & akses hanya dari respons server; checkout aman", async () => {
  const calls = [];
  configureServerClient({
    baseUrl: "https://api.contoh.test",
    fetch: async (url, init = {}) => {
      calls.push({ url: String(url), method: init.method ?? "GET", key: hdr(init, "Idempotency-Key"), credentials: init.credentials });
      const u = String(url);
      if (u.endsWith("/billing/account")) return json(200, { balance: 3, entitlements: { "video-to-gif": { unlocked: false, packUses: 0 } } });
      if (u.endsWith("/billing/pricing")) return json(200, { "video-to-gif": { costPerUse: 0.25 } });
      if (u.endsWith("/billing/checkout")) return json(200, { checkoutUrl: "https://pay.gateway.test/s/abc" });
      if (u.endsWith("/billing/unlock")) return json(200, { account: { balance: 2, entitlements: { "video-to-gif": { unlocked: true, packUses: 7 } } } });
      if (u.includes("/billing/checkout/")) return json(200, { status: "pending" });
      return json(404, {});
    },
  });
  await refreshBilling();
  const s = useBilling.getState();
  assert.equal(s.status, "ready");
  assert.equal(s.account.balance, 3);
  assert.equal(s.pricing["video-to-gif"].costPerUse, 0.25);
  assert.equal(s.pricingSource, "server");
  assert.ok(calls.every((c) => c.credentials === "include"), "cookie sesi selalu ikut");

  const [u1, u2] = await Promise.all([startCheckout("kredit-10", "https://app.test/kredit"), startCheckout("kredit-10", "https://app.test/kredit")]);
  assert.equal(u1, "https://pay.gateway.test/s/abc");
  assert.equal(u2, u1);
  assert.equal(calls.filter((c) => c.url.endsWith("/billing/checkout")).length, 1, "klik ganda → satu sesi checkout");
  assert.match(calls.find((c) => c.url.endsWith("/billing/checkout")).key, /^checkout-kredit-10-/);

  assert.equal(await verifyCheckout("sess_123456"), "pending");
  assert.equal(useBilling.getState().account.balance, 3, "status pending tidak menambah saldo");
  await assert.rejects(verifyCheckout("../hack"), /tidak valid/);

  const acc = await unlockFeature("video-to-gif");
  assert.deepEqual(acc.entitlements["video-to-gif"], { unlocked: true, packUses: 7 });
  assert.equal(useBilling.getState().account.balance, 2);

  assert.equal(safeCheckoutUrl("javascript:alert(1)"), null);
  assert.equal(safeCheckoutUrl("http://evil.test/pay"), null);
  assert.equal(safeCheckoutUrl("http://localhost:3000/pay"), "http://localhost:3000/pay");
  useBilling.setState({ pricing: P, pricingSource: "default" });
});

/* ---------------------------- klien server ---------------------------- */

const file = () => new File([new Uint8Array([1, 2, 3, 4])], "foto.png", { type: "image/png" });

test("server: tanpa backend → pesan 'Server belum tersedia', saldo tidak berubah", async () => {
  configureServerClient({ baseUrl: null });
  useBilling.setState({ account: null });
  assert.equal(isServerConfigured("video-to-gif"), false);
  await assert.rejects(runServerJob({ feature: "video-to-gif", file: file() }), (e) => e instanceof ServerUnavailableError && e instanceof StopQueueError && e.message === SERVER_UNAVAILABLE_MESSAGE);
  assert.equal(useBilling.getState().account, null);
  assert.equal(SERVER_UNAVAILABLE_MESSAGE, "Server belum tersedia. Fitur ini akan dapat digunakan setelah layanan server diaktifkan.");
});

test("server: fitur yang dinonaktifkan backend dianggap belum tersedia", async () => {
  configureServerClient({ baseUrl: "https://api.contoh.test", fetch: async () => json(500, {}) });
  useBilling.setState({ pricing: { ...P, "video-compress": { ...P["video-compress"], enabled: false } } });
  assert.equal(isServerConfigured("video-compress"), false);
  await assert.rejects(runServerJob({ feature: "video-compress", file: file() }), ServerUnavailableError);
  useBilling.setState({ pricing: P });
});

test("server: idempotensi, request ganda digabung, saldo dari respons backend", async () => {
  const calls = [];
  const puts = [];
  let polls = 0;
  useBilling.setState({ account: null });
  configureServerClient({
    baseUrl: "https://api.contoh.test",
    pollMs: 1,
    fetch: withUpload(async (url, init = {}) => {
      calls.push({ url, method: init.method ?? "GET", key: hdr(init, "Idempotency-Key"), body: init.body ? JSON.parse(init.body) : null });
      if (init.method === "POST") return json(202, { jobId: "j1", status: "queued" });
      if (String(url).endsWith("/media/jobs/j1")) {
        polls++;
        return polls < 2
          ? json(200, { status: "running", progress: 50 })
          : json(200, { status: "succeeded", resultUrl: "https://api.contoh.test/r/j1", account: { balance: 4.9, entitlements: { "remove-background": { unlocked: true, packUses: 0 } } } });
      }
      if (String(url).endsWith("/r/j1")) return new Response(new Blob([new Uint8Array([9, 9])]), { status: 200 });
      return json(404, {});
    }, puts),
  });
  const f = file();
  const [a, b] = await Promise.all([runServerJob({ feature: "remove-background", file: f }), runServerJob({ feature: "remove-background", file: f })]);
  assert.equal(a, b, "klik ganda → satu job");
  assert.equal(calls.filter((c) => c.method === "POST").length, 1);
  assert.match(calls[0].key, /^remove-background-[0-9a-f]{40}$/);
  assert.equal(calls[0].body.uploadId, "u1", "job merujuk berkas yang sudah diunggah");
  assert.equal(puts.length, 1, "berkas diunggah sekali, langsung ke storage");
  assert.equal(puts[0].init.credentials, "omit", "storage luar tanpa cookie");
  assert.equal(hdr(puts[0].init, "Content-Type"), "image/png");
  assert.equal(a.blob.size, 2);
  assert.equal(useBilling.getState().account.balance, 4.9);
  assert.equal(await jobKey("remove-background", f, {}), await jobKey("remove-background", f, {}));
  assert.notEqual(await jobKey("remove-background", f, { a: 1 }), await jobKey("remove-background", f, {}));
});

test("server: 402/403 menghentikan antrean; gagal & batal tidak mengubah saldo", async () => {
  useBilling.setState({ account: null });
  configureServerClient({ baseUrl: "https://api.contoh.test", pollMs: 1, fetch: async () => json(402, { account: { balance: 0, entitlements: {} } }) });
  await assert.rejects(runServerJob({ feature: "image-upscaler", file: file() }), (e) => e instanceof InsufficientCreditError && e.account.balance === 0);
  configureServerClient({ fetch: async () => json(403, {}) });
  await assert.rejects(runServerJob({ feature: "image-upscaler", file: file() }), FeatureLockedError);

  useBilling.setState({ account: acct(5) });
  configureServerClient({ fetch: withUpload(async (url, init = {}) => (init.method === "POST" ? json(202, { jobId: "j2", status: "queued" }) : json(200, { status: "failed", error: "Model gagal memuat." }))) });
  await assert.rejects(runServerJob({ feature: "image-upscaler", file: file() }), (e) => e instanceof ServerJobError && /Model gagal/.test(e.message));
  assert.equal(useBilling.getState().account.balance, 5);

  const deleted = [];
  const ctrl = new AbortController();
  configureServerClient({
    pollMs: 50,
    fetch: withUpload(async (url, init = {}) => {
      if (init.method === "DELETE") deleted.push(url);
      return init.method === "POST" ? json(202, { jobId: "j3", status: "queued" }) : json(200, { status: "running" });
    }),
  });
  const p = runServerJob({ feature: "video-to-frames", file: file(), signal: ctrl.signal });
  setTimeout(() => ctrl.abort(), 10);
  await assert.rejects(p, (e) => e.name === "AbortError");
  assert.equal(deleted.length, 1, "job dibatalkan di server");
  assert.equal(useBilling.getState().account.balance, 5);
  configureServerClient({ baseUrl: null });
  useBilling.setState({ account: null });
});

/* ------------------------- rencana fitur server ----------------------- */

test("rencana GIF: rentang, batas durasi, lebar tidak melebihi sumber", () => {
  const base = { duration: 60, srcW: 1280, srcH: 720, fps: 10, maxSeconds: 30 };
  const ok = gifPlan({ ...base, start: 2, end: 7, width: 480 });
  assert.deepEqual([ok.span, ok.width, ok.height, ok.frames, ok.error], [5, 480, 270, 50, null]);
  assert.match(gifPlan({ ...base, start: 0, end: 40, width: 480 }).error, /melebihi batas 30 detik/);
  assert.match(gifPlan({ ...base, start: 3, end: 3.2, width: 480 }).error, /minimal/);
  const small = gifPlan({ ...base, srcW: 320, srcH: 240, start: 0, end: 2, width: 800 });
  assert.equal(small.width, 320);
  assert.equal(small.upscaled, true);
});

test("rencana kompres: target ukuran → bitrate, validasi resolusi & ukuran", () => {
  const base = { bytes: 100 * MB, duration: 100, srcHeight: 1080, mode: "quality", quality: "balanced", targetMB: 10, height: "source", codec: "h264", audio: "keep" };
  assert.deepEqual(compressPlan(base).params, { codec: "h264", container: "mp4", height: "source", audio: "keep", crf: 24 });
  assert.equal(compressPlan({ ...base, codec: "vp9" }).container, "webm");
  const sized = compressPlan({ ...base, mode: "size", targetMB: 10 });
  assert.equal(sized.error, null);
  assert.equal(sized.videoKbps, Math.floor((10 * MB * 8) / 1000 / 100 - 128));
  assert.match(compressPlan({ ...base, mode: "size", targetMB: 200 }).error, /lebih kecil dari ukuran file asli/);
  assert.match(compressPlan({ ...base, mode: "size", targetMB: 1, duration: 600 }).error, /terlalu kecil/);
  assert.match(compressPlan({ ...base, height: 1080 }).error, /tidak lebih kecil/);
  assert.equal(compressPlan({ ...base, height: 720 }).error, null);
});

/* -------------------------------- WAV -------------------------------- */

test("WAV: header PCM 16-bit benar, clipping, mono & potong", () => {
  const l = new Float32Array([0, 1, -1, 0.5, 2]);
  const r = new Float32Array([0, -1, 1, -0.5, -2]);
  const wav = encodeWav([l, r], 8000);
  const v = new DataView(wav.buffer);
  const s = (o, n) => String.fromCharCode(...wav.slice(o, o + n));
  assert.equal(s(0, 4), "RIFF");
  assert.equal(s(8, 4), "WAVE");
  assert.equal(v.getUint32(4, true), wav.length - 8);
  assert.equal(v.getUint16(22, true), 2);
  assert.equal(v.getUint32(24, true), 8000);
  assert.equal(v.getUint32(28, true), 8000 * 2 * 2);
  assert.equal(v.getUint32(40, true), 5 * 2 * 2);
  assert.equal(v.getInt16(44 + 4, true), 32767);
  assert.equal(v.getInt16(44 + 6, true), -32768);
  assert.equal(v.getInt16(44 + 16, true), 32767, "di atas 1 dijepit");
  assert.equal(wav.length, wavBytes(5 / 8000, 8000, 2));
  assert.deepEqual(Array.from(mixToMono([l, r]).slice(0, 4)), [0, 0, 0, 0]);
  assert.equal(sliceChannels([l], 2, 0.5, 2)[0].length, 3);
  assert.throws(() => encodeWav([], 8000), /kanal/);
});

test("checkout selalu Rupiah: body berisi currency IDR, tanpa nominal dari klien", async () => {
  let sent = null;
  configureServerClient({
    baseUrl: "https://api.contoh.test",
    fetch: async (url, init = {}) => {
      if (String(url).endsWith("/billing/checkout")) {
        sent = JSON.parse(String(init.body));
        return json(200, { checkoutUrl: "https://app.sandbox.midtrans.com/snap/v4/redirection/abc", sessionId: "abcdef12" });
      }
      return json(404, {});
    },
  });
  try {
    const url = await startCheckout("credits-100", "https://app.contoh.test/id/credits");
    assert.match(url, /midtrans\.com/);
    assert.deepEqual(sent, { packageId: "credits-100", currency: "IDR", returnUrl: "https://app.contoh.test/id/credits" });
  } finally {
    configureServerClient({ baseUrl: null });
  }
});

test("riwayat transaksi: nominal pembelian dibaca sebagai rupiah bulat; nominal dolar diabaikan", () => {
  const [a, b] = sanitizeTransactions([
    { id: "t1", type: "purchase", credits: 100, createdAt: "2026-10-18T00:00:00Z", status: "completed", currency: "IDR", amount: 90000 },
    { id: "t2", type: "purchase", credits: 5, createdAt: "2026-10-18T00:00:00Z", status: "completed", currency: "USD", amount: 500, amountUsd: 5 },
  ]);
  assert.equal(a.amountIdr, 90000);
  assert.equal(b.amountIdr, undefined);
  assert.equal("amountUsd" in b, false);
});
