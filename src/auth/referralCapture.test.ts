import test from "node:test";
import assert from "node:assert/strict";
import { clearStoredReferral, getStoredReferral, normalizeReferralInput, storeReferral } from "./referralCapture";
import { referralInviteUrl, sanitizeReferral } from "../api/queries";

const mem = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
};

test("referral: normalisasi masukan", () => {
  assert.equal(normalizeReferralInput(" k7p3-qx9m "), "K7P3QX9M");
  assert.equal(normalizeReferralInput("ab"), null);
  assert.equal(normalizeReferralInput("<script>"), null);
  assert.equal(normalizeReferralInput(42), null);
});

test("referral: kode dari tautan disimpan 30 hari", () => {
  const s = mem();
  storeReferral("abcd1234", 1000, s);
  assert.equal(getStoredReferral(2000, s), "ABCD1234");
  assert.equal(getStoredReferral(1000 + 31 * 86400_000, s), null);
  storeReferral("bad!", 1000, s);
  assert.equal(getStoredReferral(2000, s), "ABCD1234");
  clearStoredReferral(s);
  assert.equal(getStoredReferral(2000, s), null);
});

test("referral: respons /referrals/me & tautan undangan", () => {
  const r = sanitizeReferral({ code: "K7P3QX9M", shareUrl: "https://app.example.com/?ref=K7P3QX9M", timesUsed: 2, usedReferral: { code: "ABCD2345", redeemedAt: "2026-10-01T00:00:00Z" } })!;
  assert.equal(r.usedReferral?.code, "ABCD2345");
  assert.equal(r.usedReferral?.at, "2026-10-01T00:00:00Z");
  assert.equal(referralInviteUrl(r, "en-US"), "https://app.example.com/en/signup?ref=K7P3QX9M");
  assert.equal(referralInviteUrl({ code: "K7P3QX9M", shareUrl: "" }, "id", "http://localhost:5173"), "http://localhost:5173/id/signup?ref=K7P3QX9M");
  assert.equal(sanitizeReferral({ code: "x" }), null);
});
