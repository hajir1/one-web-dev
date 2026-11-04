// @ts-nocheck
// v11: Media & Data subscription plans on the frontend side.
import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_CATALOG, DEFAULT_PLANS, perMonthWhenYearly, planQuota, sanitizeCatalog, sanitizePlanView, sanitizeSummary, unitsFor, videoSecondsFor } from "../planCore";
import { DEFAULT_PRICING, MEDIA_SERVER_FEATURES, DATA_SERVER_FEATURES, VR_SERVER_FEATURES, accessState, estimateUses, planCharge, sanitizeAccount } from "../../media/processing/pricing";

const MB = 1024 * 1024;
const meter = (limit, used = 0, bonus = 0) => ({ limit, used, bonus, left: Math.max(0, limit + bonus - used) });
const view = (o = {}) => ({
  plan: "free",
  active: false,
  scope: "personal",
  window: { start: "2026-10-01T00:00:00.000Z", end: "2026-11-01T00:00:00.000Z" },
  units: meter(10),
  videoSeconds: meter(300),
  limits: { maxBytes: 25 * MB, maxVideoSeconds: 120, concurrency: 1, priority: false, retentionHours: 24, seats: 1 },
  ...o,
});

test("harga: bulanan sesuai usulan, tahunan diskon 10% dibulatkan ke ribuan", () => {
  const by = Object.fromEntries(DEFAULT_PLANS.map((p) => [p.id, p]));
  assert.deepEqual([by.basic.monthlyIdr, by.pro.monthlyIdr, by.team.monthlyIdr], [29_000, 59_000, 129_000]);
  assert.deepEqual([by.basic.yearlyIdr, by.pro.yearlyIdr, by.team.yearlyIdr], [313_000, 637_000, 1_393_000]);
  assert.equal(by.team.seats, 5);
  assert.equal(perMonthWhenYearly(by.basic), 26_000);
  assert.equal(DEFAULT_CATALOG.yearlyDiscountPercent, 10);
});

test("Media & Data termasuk paket; VR tetap kredit", () => {
  for (const f of [...MEDIA_SERVER_FEATURES, ...DATA_SERVER_FEATURES]) {
    assert.equal(DEFAULT_PRICING[f].inPlan, true, f);
    assert.equal(DEFAULT_PRICING[f].unlockRequired, false, f);
  }
  for (const f of VR_SERVER_FEATURES) assert.equal(DEFAULT_PRICING[f].inPlan, false, f);
});

test("hitungan kuota: proses berat lebih dari 1, video per detik (sama dengan backend)", () => {
  assert.equal(unitsFor("image-upscaler", { scale: 4 }), 2);
  assert.equal(unitsFor("data-pdf-ocr", { pages: 51 }), 3);
  assert.equal(unitsFor("video-compress", { seconds: 60 }), 0);
  assert.equal(videoSecondsFor("audio-extract", { seconds: 59.1 }), 60);
});

test("planQuota: urutan cek ukuran > durasi > proses > menit video", () => {
  const v = view();
  assert.equal(planQuota("remove-background", [{ bytes: 30 * MB }], v).problem, "size");
  assert.equal(planQuota("video-to-gif", [{ seconds: 121 }], v).problem, "duration");
  assert.equal(planQuota("image-upscaler", Array(6).fill({ scale: 4 }), v).problem, "units");
  assert.equal(planQuota("video-compress", [{ seconds: 110 }, { seconds: 110 }, { seconds: 110 }], v).problem, "video");
  const ok = planQuota("video-compress", [{ seconds: 90 }, {}], v);
  assert.deepEqual([ok.enough, ok.videoSeconds, ok.durationUnknown], [true, 90, true]);
  assert.equal(planQuota("remove-background", [{}], null).enough, null);
  assert.equal(planQuota("video-compress", [{}], view({ videoSeconds: meter(300, 300) })).problem, "video");
});

test("akses fitur paket: tanpa kredit, kuota habis → 'quota'; sisa paket fitur lama dipakai dulu", () => {
  const p = DEFAULT_PRICING["remove-background"];
  const acc = sanitizeAccount({ balance: 0, entitlements: { "remove-background": { unlocked: true, packUses: 1 } }, subscription: view({ units: meter(10, 10) }) });
  assert.ok(acc.subscription);
  const charge = planCharge(p, [{}, {}], acc);
  assert.deepEqual([charge.credits, charge.packUses, charge.affordable], [0, 1, true]);
  assert.equal(estimateUses(p, acc), 1);
  assert.equal(accessState(p, { serverAvailable: true, account: { ...acc, entitlements: {} } }), "quota");
  assert.equal(accessState(p, { serverAvailable: true, account: sanitizeAccount({ balance: 0, entitlements: {}, subscription: view() }) }), "ready");
});

test("sanitasi data paket dari server", () => {
  assert.equal(sanitizePlanView({ plan: "gold", units: meter(1), videoSeconds: meter(1) }), null);
  const v = sanitizePlanView({ ...view({ plan: "pro", teamName: "x".repeat(99) }), limits: { maxBytes: -1 } });
  assert.equal(v.limits.maxBytes, 1024 * MB, "nilai tidak valid → angka bawaan paket");
  assert.equal(v.teamName.length, 60);
  const s = sanitizeSummary({ current: view(), personal: view(), team: { ...view({ plan: "team", scope: "team" }), teamId: "t1", canManage: true, hasSeat: true, members: 3 } });
  assert.deepEqual([s.team.teamId, s.team.canManage, s.team.members], ["t1", true, 3]);
  assert.equal(sanitizeSummary({ current: view() }), null);
  const c = sanitizeCatalog({ plans: [{ id: "basic", monthlyIdr: 30_000, yearlyIdr: "x" }], paymentAvailable: true });
  assert.equal(c.plans.find((p) => p.id === "basic").monthlyIdr, 30_000);
  assert.equal(c.plans.find((p) => p.id === "basic").yearlyIdr, 313_000);
  assert.equal(c.paymentAvailable, true);
  assert.equal(sanitizeCatalog(null), DEFAULT_CATALOG);
});
