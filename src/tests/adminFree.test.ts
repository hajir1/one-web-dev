// @ts-nocheck
// v6: admin no-credit mode on the display side (the backend still decides billing).
import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_PRICING, accessState, estimateUses, planCharge, sanitizeAccount } from "../pages/media/processing/pricing";
import { isAdminFree, setAdminFree } from "../auth/adminFree";
import { limitText, UNLIMITED_LIMIT } from "../marketplace/hooks";

// v11: tested with credit rates (Media now uses plan quotas).
const p = { ...DEFAULT_PRICING["image-upscaler"], inPlan: false, unlockRequired: true };

test("pengguna biasa: saldo 0 & fitur terkunci → locked, tidak cukup", () => {
  setAdminFree(false);
  const acc = sanitizeAccount({ balance: 0, entitlements: {}, items: [] });
  assert.equal(acc.adminFree, undefined);
  assert.equal(accessState(p, { serverAvailable: true, account: acc }), "locked");
  const plan = planCharge(p, [{ scale: 4 }], acc);
  assert.equal(plan.affordable, false);
});

test("admin dari respons server: siap, biaya 0, penggunaan tanpa batas", () => {
  setAdminFree(false);
  const acc = sanitizeAccount({ balance: 0, entitlements: {}, items: [], adminFree: true });
  assert.equal(acc.adminFree, true);
  assert.equal(accessState(p, { serverAvailable: true, account: acc }), "ready");
  const plan = planCharge(p, [{ scale: 4 }, {}], acc);
  assert.deepEqual({ credits: plan.credits, packUses: plan.packUses, affordable: plan.affordable, shortfall: plan.shortfall }, { credits: 0, packUses: 0, affordable: true, shortfall: 0 });
  assert.ok(plan.creditsWithoutPack > 0, "harga normal tetap terlihat sebagai pembanding");
  assert.equal(estimateUses(p, acc), Infinity);
  // A down server is still "unavailable" even for admins.
  assert.equal(accessState(p, { serverAvailable: false, account: acc }), "unavailable");
});

test("admin dari profil sesi: akun dari respons job (tanpa flag) tetap ditandai", () => {
  setAdminFree(true);
  assert.equal(isAdminFree(), true);
  const acc = sanitizeAccount({ balance: 0, entitlements: {}, items: [] });
  assert.equal(acc.adminFree, true);
  setAdminFree(false);
});

test("saldo negatif (setelah refund) tetap terbaca", () => {
  const acc = sanitizeAccount({ balance: -12.5, entitlements: {}, items: [] });
  assert.equal(acc.balance, -12.5);
  assert.equal(planCharge(p, [{}], acc).affordable, false);
});

test("limitText: batas admin tampil ∞", () => {
  assert.equal(limitText(10), 10);
  assert.equal(limitText(UNLIMITED_LIMIT), "∞");
});
