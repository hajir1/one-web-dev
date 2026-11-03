// @ts-nocheck
// v7: riwayat pekerjaan (P1) & kredit tim (P6) di sisi frontend.
import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_PRICING, estimateUses, payingBalance, planCharge, sanitizeAccount } from "../../media/processing/pricing";
import { historyQuery } from "../history";
import { TEAM_MAX_MEMBERS } from "../../team/team";

// v11: Media & Data memakai kuota paket; mesin kredit/paket fitur di bawah diuji dengan tarif kredit (seperti VR).
const legacy = (p) => ({ ...p, inPlan: false, unlockRequired: true });
const team = (o = {}) => ({ id: "t1", name: "Studio", role: "member", balance: 20, payWithTeam: true, monthlyLimit: 5, spentMonth: 1, available: 4, ...o });
const acct = (balance, ents = {}, t = undefined) => ({ balance, entitlements: ents, syncedAt: 0, ...(t ? { team: t } : {}) });

test("historyQuery: filter 'all' tidak dikirim, cursor & limit dikirim", () => {
  assert.equal(historyQuery({ group: "all", status: "all" }), "/jobs/history?limit=20");
  assert.equal(historyQuery({ group: "vr", status: "failed", cursor: "abc", limit: 5 }), "/jobs/history?limit=5&group=vr&status=failed&cursor=abc");
});

test("sanitizeAccount membaca blok team dan membuang yang rusak", () => {
  const a = sanitizeAccount({ balance: 3, entitlements: {}, team: { ...team(), name: "x".repeat(80), role: "admin" } });
  assert.equal(a.team.name.length, 60);
  assert.equal(a.team.role, "member");
  assert.equal(a.team.available, 4);
  assert.equal(sanitizeAccount({ balance: 3, entitlements: {}, team: { id: 1 } }).team, undefined);
});

test("sumber Tim: dibayar kredit tim, kuota paket pribadi tidak dipakai", () => {
  const p = legacy(DEFAULT_PRICING["remove-background"]);
  const ents = { "remove-background": { unlocked: true, packUses: 10 } };
  const personal = planCharge(p, [{}], acct(0, ents));
  assert.equal(personal.packUses, 1);
  assert.equal(personal.credits, 0);

  const viaTeam = acct(0, ents, team());
  assert.equal(payingBalance(viaTeam), 4);
  const plan = planCharge(p, [{}], viaTeam);
  assert.equal(plan.packUses, 0);
  assert.equal(plan.credits, p.costPerUse);
  assert.equal(plan.affordable, true);
  assert.equal(estimateUses(p, viaTeam), Math.floor(4 / p.costPerUse));

  const capped = planCharge(p, [{}], acct(100, ents, team({ available: 0 })));
  assert.equal(capped.affordable, false);
});

test("sumber Pribadi tetap memakai saldo & paket pribadi walau anggota tim", () => {
  const p = legacy(DEFAULT_PRICING["remove-background"]);
  const a = acct(7, { "remove-background": { unlocked: true, packUses: 2 } }, team({ payWithTeam: false }));
  assert.equal(payingBalance(a), 7);
  assert.equal(estimateUses(p, a), 2 + Math.floor(7 / p.costPerUse));
});

test("batas anggota tim = 10 (sama dengan backend)", () => {
  assert.equal(TEAM_MAX_MEMBERS, 10);
});
