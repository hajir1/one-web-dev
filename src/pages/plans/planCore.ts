// ─── plans/planCore.ts ───────────────────────────────────────────────────────
// v11: subscription plan types, fallback numbers, validation, and quota math.
// No runtime imports into billing/pricing (used by sanitizeAccount in
// pricing.ts; avoids a circular import). The API lives in plans.ts.

import i18n from "../../i18n";
import type { ServerFeatureId, UsageInput } from "../media/processing/pricing";

export type PlanId = "free" | "basic" | "pro" | "team";
export type PaidPlanId = Exclude<PlanId, "free">;
export type PlanInterval = "month" | "year";
export type AddonId = "units" | "video";

export interface PlanSpec {
  id: PlanId;
  monthlyIdr: number;
  yearlyIdr: number;
  units: number;
  videoSeconds: number;
  maxBytes: number;
  maxVideoSeconds: number;
  concurrency: number;
  priority: boolean;
  retentionHours: number;
  seats: number;
}

export interface AddonSpec {
  id: AddonId;
  credits: number;
  units: number;
  videoSeconds: number;
}

export interface PlanCatalog {
  yearlyDiscountPercent: number;
  plans: PlanSpec[];
  addons: AddonSpec[];
  paymentAvailable: boolean;
}

interface Meter {
  limit: number;
  bonus: number;
  used: number;
  left: number;
}

/** The quota in effect for the account (from the backend). */
export interface PlanView {
  plan: PlanId;
  paidPlan: PlanId | null;
  interval: PlanInterval | null;
  active: boolean;
  expiresAt: string | null;
  scope: "personal" | "team";
  teamName: string | null;
  window: { start: string; end: string };
  units: Meter;
  videoSeconds: Meter;
  limits: { maxBytes: number; maxVideoSeconds: number; concurrency: number; priority: boolean; retentionHours: number; seats: number };
}

export interface TeamPlanView extends PlanView {
  teamId: string;
  canManage: boolean;
  hasSeat: boolean;
  members: number;
}

export interface SubscriptionSummary {
  current: PlanView;
  personal: PlanView;
  team: TeamPlanView | null;
}

export interface PlanQuote {
  plan: PaidPlanId;
  interval: PlanInterval;
  action: "new" | "renew" | "upgrade";
  priceIdr: number;
  creditIdr: number;
  finalIdr: number;
  credits: number;
  startsAt: string;
  endsAt: string;
}

const MB = 1024 * 1024;
export const YEARLY_DISCOUNT_PERCENT = 10;
const yearly = (m: number) => Math.floor((m * 12 * (100 - YEARLY_DISCOUNT_PERCENT)) / 100 / 1000) * 1000;

export const DEFAULT_PLANS: PlanSpec[] = [
  { id: "free", monthlyIdr: 0, yearlyIdr: 0, units: 10, videoSeconds: 300, maxBytes: 25 * MB, maxVideoSeconds: 120, concurrency: 1, priority: false, retentionHours: 24, seats: 1 },
  { id: "basic", monthlyIdr: 29_000, yearlyIdr: yearly(29_000), units: 150, videoSeconds: 3600, maxBytes: 200 * MB, maxVideoSeconds: 900, concurrency: 1, priority: false, retentionHours: 72, seats: 1 },
  { id: "pro", monthlyIdr: 59_000, yearlyIdr: yearly(59_000), units: 500, videoSeconds: 18_000, maxBytes: 1024 * MB, maxVideoSeconds: 1800, concurrency: 2, priority: true, retentionHours: 168, seats: 1 },
  { id: "team", monthlyIdr: 129_000, yearlyIdr: yearly(129_000), units: 1500, videoSeconds: 54_000, maxBytes: 2048 * MB, maxVideoSeconds: 3600, concurrency: 3, priority: true, retentionHours: 168, seats: 5 },
];

export const DEFAULT_ADDONS: AddonSpec[] = [
  { id: "units", credits: 10, units: 50, videoSeconds: 0 },
  { id: "video", credits: 10, units: 0, videoSeconds: 1800 },
];

export const DEFAULT_CATALOG: PlanCatalog = { yearlyDiscountPercent: YEARLY_DISCOUNT_PERCENT, plans: DEFAULT_PLANS, addons: DEFAULT_ADDONS, paymentAvailable: false };

/** Features counted per minute of video/audio (not per run). */
export const VIDEO_MINUTE_FEATURES: ReadonlySet<ServerFeatureId> = new Set(["video-compress", "audio-extract"]);

/** Runs for one input (same as the backend `unitsFor`). */
export function unitsFor(feature: ServerFeatureId, usage: UsageInput = {}): number {
  if (VIDEO_MINUTE_FEATURES.has(feature)) return 0;
  if (feature === "image-upscaler" && (usage.scale ?? 2) > 2) return 2;
  if (feature === "data-pdf-ocr" && (usage.pages ?? 0) > 50) return 3;
  return 1;
}

/** Video seconds for one input (0 when the duration is not known yet). */
export function videoSecondsFor(feature: ServerFeatureId, usage: UsageInput = {}): number {
  if (!VIDEO_MINUTE_FEATURES.has(feature)) return 0;
  const s = usage.seconds;
  return typeof s === "number" && Number.isFinite(s) && s > 0 ? Math.ceil(s) : 0;
}

/* ------------------------------ format ------------------------------ */

export const planName = (p: PlanId) => i18n.t(`plans.names.${p}`);
export const priceOf = (p: PlanSpec, i: PlanInterval) => (i === "year" ? p.yearlyIdr : p.monthlyIdr);
/** Monthly price when paying yearly (rounded down, for display). */
export const perMonthWhenYearly = (p: PlanSpec) => Math.floor(p.yearlyIdr / 12 / 100) * 100;
export const minutes = (sec: number) => Math.floor(sec / 60);
export const formatBytes = (b: number) => (b >= 1024 * MB ? `${+(b / (1024 * MB)).toFixed(1)} GB` : `${Math.round(b / MB)} MB`);
export function formatRetention(h: number) {
  return h % 24 === 0 ? i18n.t("plans.days", { count: h / 24 }) : i18n.t("plans.hours", { count: h });
}

/* ------------------------------ sanitasi ------------------------------ */

const PLAN_IDS: PlanId[] = ["free", "basic", "pro", "team"];
const isPlan = (v: unknown): v is PlanId => typeof v === "string" && (PLAN_IDS as string[]).includes(v);
export const int = (v: unknown, min = 0) => (typeof v === "number" && Number.isFinite(v) && v >= min ? Math.floor(v) : null);
export const iso = (v: unknown) => (typeof v === "string" && !Number.isNaN(Date.parse(v)) ? v : null);

function meter(raw: unknown): Meter | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  const limit = int(m.limit);
  const used = int(m.used);
  if (limit === null || used === null) return null;
  const bonus = int(m.bonus) ?? 0;
  return { limit, bonus, used, left: int(m.left) ?? Math.max(0, limit + bonus - used) };
}

/** Validates the server quota display; null when its shape is unknown. */
export function sanitizePlanView(raw: unknown): PlanView | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Record<string, unknown>;
  const units = meter(v.units);
  const videoSeconds = meter(v.videoSeconds);
  const w = (v.window ?? {}) as Record<string, unknown>;
  const l = (v.limits ?? {}) as Record<string, unknown>;
  if (!isPlan(v.plan) || !units || !videoSeconds) return null;
  const spec = DEFAULT_PLANS.find((p) => p.id === v.plan)!;
  return {
    plan: v.plan,
    paidPlan: isPlan(v.paidPlan) ? v.paidPlan : null,
    interval: v.interval === "year" || v.interval === "month" ? v.interval : null,
    active: v.active === true,
    expiresAt: iso(v.expiresAt),
    scope: v.scope === "team" ? "team" : "personal",
    teamName: typeof v.teamName === "string" ? v.teamName.slice(0, 60) : null,
    window: { start: iso(w.start) ?? new Date().toISOString(), end: iso(w.end) ?? new Date().toISOString() },
    units,
    videoSeconds,
    limits: {
      maxBytes: int(l.maxBytes, 1) ?? spec.maxBytes,
      maxVideoSeconds: int(l.maxVideoSeconds, 1) ?? spec.maxVideoSeconds,
      concurrency: int(l.concurrency, 1) ?? spec.concurrency,
      priority: typeof l.priority === "boolean" ? l.priority : spec.priority,
      retentionHours: int(l.retentionHours, 1) ?? spec.retentionHours,
      seats: int(l.seats, 1) ?? spec.seats,
    },
  };
}

export function sanitizeSummary(raw: unknown): SubscriptionSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Record<string, unknown>;
  const current = sanitizePlanView(v.current);
  const personal = sanitizePlanView(v.personal);
  if (!current || !personal) return null;
  let team: TeamPlanView | null = null;
  const t = v.team as Record<string, unknown> | null;
  const tv = t ? sanitizePlanView(t) : null;
  if (t && tv && typeof t.teamId === "string")
    team = { ...tv, teamId: t.teamId, canManage: t.canManage === true, hasSeat: t.hasSeat === true, members: int(t.members) ?? 0 };
  return { current, personal, team };
}

export function sanitizeCatalog(raw: unknown): PlanCatalog {
  if (!raw || typeof raw !== "object") return DEFAULT_CATALOG;
  const v = raw as Record<string, unknown>;
  const plans: PlanSpec[] = DEFAULT_PLANS.map((d) => {
    const r = Array.isArray(v.plans) ? (v.plans as Record<string, unknown>[]).find((p) => p && p.id === d.id) : null;
    if (!r) return d;
    return {
      ...d,
      monthlyIdr: int(r.monthlyIdr) ?? d.monthlyIdr,
      yearlyIdr: int(r.yearlyIdr) ?? d.yearlyIdr,
      units: int(r.units) ?? d.units,
      videoSeconds: int(r.videoSeconds) ?? d.videoSeconds,
      maxBytes: int(r.maxBytes, 1) ?? d.maxBytes,
      maxVideoSeconds: int(r.maxVideoSeconds, 1) ?? d.maxVideoSeconds,
      concurrency: int(r.concurrency, 1) ?? d.concurrency,
      priority: typeof r.priority === "boolean" ? r.priority : d.priority,
      retentionHours: int(r.retentionHours, 1) ?? d.retentionHours,
      seats: int(r.seats, 1) ?? d.seats,
    };
  });
  const addons: AddonSpec[] = DEFAULT_ADDONS.map((d) => {
    const r = Array.isArray(v.addons) ? (v.addons as Record<string, unknown>[]).find((a) => a && a.id === d.id) : null;
    return r ? { ...d, credits: int(r.credits, 1) ?? d.credits, units: int(r.units) ?? d.units, videoSeconds: int(r.videoSeconds) ?? d.videoSeconds } : d;
  });
  return { yearlyDiscountPercent: int(v.yearlyDiscountPercent) ?? YEARLY_DISCOUNT_PERCENT, plans, addons, paymentAvailable: v.paymentAvailable === true };
}

/* ---------------------------- rencana kuota ---------------------------- */

export interface QuotaPlan {
  units: number;
  videoSeconds: number;
  /** Some inputs have an unknown duration (video minutes are counted after finishing). */
  durationUnknown: boolean;
  /** null = unknown (quota not loaded yet). */
  enough: boolean | null;
  /** Reason when insufficient / over the limit. */
  problem: "units" | "video" | "size" | "duration" | null;
}

/** Estimated quota usage for a set of inputs (in order, same as the backend check). */
export function planQuota(feature: ServerFeatureId, inputs: UsageInput[], view: PlanView | null, techMaxBytes?: number): QuotaPlan {
  let units = 0;
  let videoSeconds = 0;
  let durationUnknown = false;
  for (const inp of inputs) {
    units += unitsFor(feature, inp);
    videoSeconds += videoSecondsFor(feature, inp);
    if (VIDEO_MINUTE_FEATURES.has(feature) && !videoSecondsFor(feature, inp)) durationUnknown = true;
  }
  if (!view) return { units, videoSeconds, durationUnknown, enough: null, problem: null };
  const maxBytes = Math.min(view.limits.maxBytes, techMaxBytes ?? Infinity);
  if (inputs.some((i) => i.bytes !== undefined && i.bytes > maxBytes)) return { units, videoSeconds, durationUnknown, enough: false, problem: "size" };
  const durationFeature = VIDEO_MINUTE_FEATURES.has(feature) || feature === "video-to-gif" || feature === "video-to-frames";
  if (durationFeature && inputs.some((i) => i.seconds !== undefined && i.seconds > view.limits.maxVideoSeconds))
    return { units, videoSeconds, durationUnknown, enough: false, problem: "duration" };
  if (units > view.units.left) return { units, videoSeconds, durationUnknown, enough: false, problem: "units" };
  if (VIDEO_MINUTE_FEATURES.has(feature) && (view.videoSeconds.left <= 0 || videoSeconds > view.videoSeconds.left))
    return { units, videoSeconds, durationUnknown, enough: false, problem: "video" };
  return { units, videoSeconds, durationUnknown, enough: true, problem: null };
}

