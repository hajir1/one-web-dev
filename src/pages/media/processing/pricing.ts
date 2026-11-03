// ─── processing/pricing.ts ───────────────────────────────────────────────────
// KONFIGURASI HARGA TERPUSAT untuk fitur server Media. Komponen UI tidak
// pernah menulis angka biaya sendiri — semua membaca dari sini (atau dari
// harga yang dikirim backend lewat `mergePricing`).
//
// ATURAN PRODUK (konsisten di seluruh Media):
//   1 kredit = Rp1.000 (harga dasar; paket besar lebih murah). Kredit dibeli
//   dulu lewat Midtrans dalam Rupiah (bayar dulu, baru fitur terbuka).
//
//   Dua hal yang DIPISAH:
//   a) SALDO KREDIT  — dompet umum, dipakai membayar setiap penggunaan
//                      (`costPerUse` kredit per penggunaan berhasil).
//   b) AKSES FITUR   — status terkunci/terbuka per fitur. Akses dibuka dengan
//                      membeli PAKET FITUR seharga `packPrice` kredit yang
//                      berisi `usesPerCredit` penggunaan (lebih hemat daripada
//                      bayar per pakai). Pembelian paket pertama membuka
//                      fitur secara permanen.
//
//   Saat dipakai: kuota paket fitur dipakai lebih dulu; bila habis, biaya
//   `costPerUse` diambil dari saldo. Fitur dengan `unlockRequired: false`
//   bisa langsung dibayar dari saldo tanpa membeli paket.
//
//   Kredit / kuota paket hanya berkurang setelah pemrosesan BERHASIL dan
//   dikonfirmasi backend. Gagal / dibatalkan = gratis.
//
// Angka di bawah = cadangan tampilan dan SAMA dengan backend
// (src/billing/catalog/feature-pricing.ts); backend yang menagih.
// Contoh: hapus latar belakang 0,5 kredit = Rp500 per gambar.
//
// Tabel ini juga memuat fitur server menu DATA (konversi spreadsheet lama &
// ekstraksi tabel PDF) agar seluruh tarif server ada di SATU tempat.
// Paket kredit (harga bertingkat) ada di config/pricing.ts.

import i18n, { currentLang, LANG_LABEL } from "../../../i18n";
import { isAdminFree } from "../../../auth/adminFree";
import { BASE_IDR_PER_CREDIT, DEFAULT_CREDIT_PACKAGES, formatIdr } from "../../../config/pricing";
import { planQuota, sanitizePlanView, type PlanView, type QuotaPlan } from "../../plans/planCore";

/** Harga dasar 1 kredit (Rupiah). Paket lebih besar lebih murah per kredit. */
const CREDIT_IDR = BASE_IDR_PER_CREDIT;

export type MediaServerFeatureId = "remove-background" | "image-upscaler" | "video-to-frames" | "video-to-gif" | "audio-extract" | "video-compress";
export type DataServerFeatureId = "data-legacy-sheet" | "data-pdf-table" | "data-pdf-ocr";
/** v7: fitur server menu VR (Tur 360°). */
export type VrServerFeatureId = "vr-panorama-stitch";
export type ServerFeatureId = MediaServerFeatureId | DataServerFeatureId | VrServerFeatureId;

/** Satuan penggunaan (teks UI: pricing.units.<unit>). */
export type UsageUnit = "image" | "gif" | "video" | "audio" | "file" | "page" | "panorama";

interface CostTier {
  /** Batas atas (inklusif) dalam satuan `by`; Infinity untuk tingkat terakhir. */
  upTo: number;
  /** Pengali biaya standar. */
  factor: number;
}

export interface FeaturePricing {
  feature: ServerFeatureId;
  /** Satuan penggunaan (diterjemahkan lewat pricing.units.<unit>). */
  unit: UsageUnit;
  /** Kredit per penggunaan standar (bayar per pakai dari saldo). */
  costPerUse: number;
  /** Isi satu paket fitur (jumlah penggunaan standar). */
  usesPerCredit: number;
  /** Harga satu paket fitur (kredit). */
  packPrice: number;
  /** Wajib membuka akses (membeli paket) sebelum bisa membayar per pakai. */
  unlockRequired: boolean;
  /** Biaya bisa naik berdasarkan ukuran/durasi/skala. */
  tiers?: { by: "bytes" | "seconds" | "scale" | "pages" | "photos"; steps: CostTier[] };
  /** Batas input pekerjaan server (divalidasi frontend & WAJIB backend). */
  limits: { maxBytes: number; maxSeconds?: number };
  /** Backend bisa menonaktifkan fitur tertentu. */
  enabled: boolean;
  /** v11: termasuk paket langganan Media & Data (kuota bulanan, bukan kredit per pakai). */
  inPlan: boolean;
}

const MB = 1024 * 1024;

const BASE_PRICING: Record<ServerFeatureId, Omit<FeaturePricing, "inPlan">> = {
  "remove-background": {
    feature: "remove-background",
    unit: "image",
    costPerUse: 0.5,
    usesPerCredit: 12,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "bytes", steps: [{ upTo: 10 * MB, factor: 1 }, { upTo: Infinity, factor: 1.5 }] },
    limits: { maxBytes: 25 * MB },
    enabled: true,
  },
  "video-to-gif": {
    feature: "video-to-gif",
    unit: "gif",
    costPerUse: 1,
    usesPerCredit: 7,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "seconds", steps: [{ upTo: 10, factor: 1 }, { upTo: 20, factor: 1.5 }, { upTo: Infinity, factor: 2 }] },
    limits: { maxBytes: 200 * MB, maxSeconds: 30 },
    enabled: true,
  },
  "image-upscaler": {
    feature: "image-upscaler",
    unit: "image",
    costPerUse: 1.25,
    usesPerCredit: 8,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "scale", steps: [{ upTo: 2, factor: 1 }, { upTo: Infinity, factor: 1.5 }] },
    limits: { maxBytes: 10 * MB },
    enabled: true,
  },
  "video-to-frames": {
    feature: "video-to-frames",
    unit: "video",
    costPerUse: 0.5,
    usesPerCredit: 10,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "seconds", steps: [{ upTo: 300, factor: 1 }, { upTo: 900, factor: 2 }, { upTo: Infinity, factor: 3 }] },
    limits: { maxBytes: 2048 * MB, maxSeconds: 1800 },
    enabled: true,
  },
  "audio-extract": {
    feature: "audio-extract",
    unit: "audio",
    costPerUse: 0.25,
    usesPerCredit: 25,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "seconds", steps: [{ upTo: 1800, factor: 1 }, { upTo: Infinity, factor: 2 }] },
    limits: { maxBytes: 2048 * MB, maxSeconds: 3 * 3600 },
    enabled: true,
  },
  "video-compress": {
    feature: "video-compress",
    unit: "video",
    costPerUse: 1.5,
    usesPerCredit: 5,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "bytes", steps: [{ upTo: 200 * MB, factor: 1 }, { upTo: 1024 * MB, factor: 2 }, { upTo: Infinity, factor: 4 }] },
    limits: { maxBytes: 2048 * MB, maxSeconds: 3600 },
    enabled: true,
  },
  /* ---------------------------- menu Data ---------------------------- */
  "data-legacy-sheet": {
    feature: "data-legacy-sheet",
    unit: "file",
    costPerUse: 0.25,
    usesPerCredit: 25,
    packPrice: 5,
    unlockRequired: false,
    tiers: { by: "bytes", steps: [{ upTo: 10 * MB, factor: 1 }, { upTo: Infinity, factor: 2 }] },
    limits: { maxBytes: 50 * MB },
    enabled: true,
  },
  "data-pdf-table": {
    feature: "data-pdf-table",
    // Per dokumen; dokumen tebal dikali faktor tingkat (≤20 hlm ×1, ≤100 ×3, >100 ×6).
    unit: "file",
    costPerUse: 0.5,
    usesPerCredit: 12,
    packPrice: 5,
    unlockRequired: false,
    tiers: { by: "pages", steps: [{ upTo: 20, factor: 1 }, { upTo: 100, factor: 3 }, { upTo: Infinity, factor: 6 }] },
    limits: { maxBytes: 30 * MB },
    enabled: true,
  },
  "data-pdf-ocr": {
    feature: "data-pdf-ocr",
    // v7 (P8): OCR PDF hasil scan → PDF bisa dicari + .txt. Per berkas; ≤10 hlm ×1, ≤50 ×3, >50 ×6 (maks. 100 hlm).
    unit: "file",
    costPerUse: 1,
    usesPerCredit: 6,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "pages", steps: [{ upTo: 10, factor: 1 }, { upTo: 50, factor: 3 }, { upTo: Infinity, factor: 6 }] },
    limits: { maxBytes: 100 * MB },
    enabled: true,
  },
  /* ----------------------------- menu VR ----------------------------- */
  "vr-panorama-stitch": {
    feature: "vr-panorama-stitch",
    // v7: ZIP 2–24 foto → panorama 360°. Per panorama; ≤8 foto ×1, ≤16 ×1,5, >16 ×2.
    unit: "panorama",
    costPerUse: 1,
    usesPerCredit: 6,
    packPrice: 5,
    unlockRequired: true,
    tiers: { by: "photos", steps: [{ upTo: 8, factor: 1 }, { upTo: 16, factor: 1.5 }, { upTo: Infinity, factor: 2 }] },
    limits: { maxBytes: 200 * MB },
    enabled: true,
  },
};

/** Fitur server milik menu Media. */
export const MEDIA_SERVER_FEATURES: MediaServerFeatureId[] = ["remove-background", "image-upscaler", "video-to-frames", "video-to-gif", "audio-extract", "video-compress"];
/** Fitur server milik menu Data. */
export const DATA_SERVER_FEATURES: DataServerFeatureId[] = ["data-legacy-sheet", "data-pdf-table", "data-pdf-ocr"];
/** Fitur server milik menu VR (v7). */
export const VR_SERVER_FEATURES: VrServerFeatureId[] = ["vr-panorama-stitch"];

/**
 * v11: Media & Data memakai paket langganan (tanpa paket fitur / kredit per
 * pakai). Tarif kredit di atas tetap dipakai VR dan sisa paket fitur lama.
 */
export const DEFAULT_PRICING: Record<ServerFeatureId, FeaturePricing> = Object.fromEntries(
  Object.entries(BASE_PRICING).map(([id, p]) => {
    const inPlan = !(VR_SERVER_FEATURES as string[]).includes(id);
    return [id, { ...p, inPlan, unlockRequired: inPlan ? false : p.unlockRequired }];
  }),
) as Record<ServerFeatureId, FeaturePricing>;

/** @deprecated pakai DEFAULT_CREDIT_PACKAGES dari config/pricing.ts (harga bertingkat). */
export const CREDIT_PACKAGES = DEFAULT_CREDIT_PACKAGES;

/* ------------------------------ format ------------------------------ */

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/** Nama fitur server yang sudah diterjemahkan (pricing.features.<id>). */
export const featureName = (f: ServerFeatureId) => i18n.t(`pricing.features.${f}`, { defaultValue: f });
/** Nama satuan penggunaan yang sudah diterjemahkan. */
export const unitName = (u: UsageUnit) => i18n.t(`pricing.units.${u}`);
/** Keterangan pengali tarif bertingkat, mis. "hingga ×3 untuk file besar"; null bila tanpa tingkat. */
export function tierNote(p: FeaturePricing): string | null {
  if (!p.tiers || p.tiers.steps.length < 2) return null;
  return i18n.t(`pricing.tierNote.${p.tiers.by}`, { factor: p.tiers.steps[p.tiers.steps.length - 1].factor });
}

/** 0.25 → "0,25 kredit" (id) / "0.25 credits" (en). */
export function formatCredits(n: number, withUnit = true): string {
  const v = round(n);
  const s = v.toLocaleString(LANG_LABEL[currentLang()].locale, { maximumFractionDigits: 3 });
  return withUnit ? i18n.t("pricing.credits", { count: v, value: s }) : s;
}

/** Nilai kredit dalam Rupiah pada harga DASAR (Rp1.000/kredit), mis. 0,5 → "Rp500". */
export function formatCreditValue(credits: number): string {
  return formatMoney(credits * CREDIT_IDR);
}

/** Rupiah tanpa desimal, mis. 47500 → "Rp47.500". */
export function formatMoney(idr: number): string {
  return formatIdr(idr);
}

/* ------------------------------ biaya ------------------------------- */

export interface UsageInput {
  bytes?: number;
  seconds?: number;
  scale?: number;
  pages?: number;
  photos?: number;
}

/** Pengali biaya untuk satu input (1 bila tidak ada tingkat / data). */
export function usageFactor(p: FeaturePricing, input: UsageInput = {}): number {
  if (!p.tiers) return 1;
  const v = input[p.tiers.by];
  if (v === undefined || !Number.isFinite(v)) return p.tiers.steps[0]?.factor ?? 1;
  return p.tiers.steps.find((s) => v <= s.upTo)?.factor ?? p.tiers.steps[p.tiers.steps.length - 1].factor;
}

/** Biaya satu penggunaan bila dibayar dari saldo. */
export const costOf = (p: FeaturePricing, input?: UsageInput) => round(p.costPerUse * usageFactor(p, input));

/** Kuota paket yang terpakai untuk satu penggunaan. */
export const packUsesOf = (p: FeaturePricing, input?: UsageInput) => Math.ceil(usageFactor(p, input) - 1e-9);

/** Harga per penggunaan bila membeli paket (untuk perbandingan). */
export const packCostPerUse = (p: FeaturePricing) => round(p.packPrice / p.usesPerCredit);

/** Validasi input terhadap batas server. null = valid. */
export function validateServerInput(p: FeaturePricing, input: UsageInput): string | null {
  if (input.bytes !== undefined && input.bytes > p.limits.maxBytes) return i18n.t("pricing.errors.tooLarge", { mb: Math.round(p.limits.maxBytes / MB) });
  if (p.limits.maxSeconds !== undefined && input.seconds !== undefined && input.seconds > p.limits.maxSeconds)
    return p.limits.maxSeconds >= 120
      ? i18n.t("pricing.errors.tooLongMinutes", { n: Math.round(p.limits.maxSeconds / 60) })
      : i18n.t("pricing.errors.tooLongSeconds", { n: p.limits.maxSeconds });
  return null;
}

/* --------------------------- akun & akses --------------------------- */

/** Hak akses per fitur menurut BACKEND. */
interface FeatureEntitlement {
  unlocked: boolean;
  /** Sisa kuota paket (penggunaan standar). */
  packUses: number;
}

/** Data akun dari backend (frontend tidak pernah mengubahnya sendiri). */
export interface BillingAccount {
  balance: number;
  entitlements: Partial<Record<ServerFeatureId, FeatureEntitlement>>;
  /** Item sekali-beli yang sudah dibuka server (mis. "template:shop-premium", "site-slot"). */
  items: string[];
  /** Slot folder website tambahan yang sudah dibeli. */
  extraSiteSlots: number;
  syncedAt: number;
  /** v6: mode admin tanpa kredit (dari backend / profil sesi). Hanya untuk tampilan; server yang menagih. */
  adminFree?: boolean;
  /** v7 (P6): tim pengguna. `payWithTeam` = job server dibayar dari dompet tim (tanpa kuota paket pribadi). */
  team?: TeamAccount | null;
  /** v11: paket langganan Media & Data yang berlaku + sisa kuota bulan ini. */
  subscription?: PlanView | null;
}

interface TeamAccount {
  id: string;
  name: string;
  role: "owner" | "member";
  balance: number;
  payWithTeam: boolean;
  monthlyLimit: number | null;
  spentMonth: number;
  /** Kredit tim yang masih boleh dipakai bulan ini (min(saldo tim, sisa batas)). */
  available: number;
}

/** Saldo yang membayar job server: kredit tim (bila sumber "Tim") atau saldo pribadi. */
export const payingBalance = (a: BillingAccount) => (a.team?.payWithTeam ? a.team.available : a.balance);

export interface ChargePlan {
  /** Kuota paket yang akan dipakai. */
  packUses: number;
  /** Kredit dari saldo. */
  credits: number;
  /** Total bila semua dibayar dari saldo (tanpa paket). */
  creditsWithoutPack: number;
  /** null = saldo tidak diketahui. */
  affordable: boolean | null;
  /** Kekurangan kredit (0 bila cukup / tidak diketahui). */
  shortfall: number;
}

/** Rencana biaya untuk sekumpulan input (urut: kuota paket dulu, lalu saldo). */
export function planCharge(p: FeaturePricing, inputs: UsageInput[], account: BillingAccount | null): ChargePlan {
  // v6: admin → tanpa biaya (server juga tidak menagih).
  // v11: fitur paket langganan → tanpa kredit (sisa paket fitur lama dipakai dulu, sisanya kuota paket).
  if (account?.adminFree || p.inPlan) {
    if (p.inPlan && !account?.adminFree) {
      let pack = account?.entitlements[p.feature]?.packUses ?? 0;
      let packUses = 0;
      for (const inp of inputs) {
        const need = packUsesOf(p, inp);
        if (pack >= need) {
          pack -= need;
          packUses += need;
        }
      }
      return { packUses, credits: 0, creditsWithoutPack: 0, affordable: account ? true : null, shortfall: 0 };
    }
    const list = round(inputs.reduce((n, inp) => n + costOf(p, inp), 0));
    return { packUses: 0, credits: 0, creditsWithoutPack: list, affordable: true, shortfall: 0 };
  }
  // v7: sumber "Tim" → semua dibayar kredit tim, kuota paket pribadi tidak dipakai.
  const viaTeam = !!account?.team?.payWithTeam;
  let pack = viaTeam ? 0 : (account?.entitlements[p.feature]?.packUses ?? 0);
  let packUses = 0;
  let credits = 0;
  let without = 0;
  for (const inp of inputs) {
    const need = packUsesOf(p, inp);
    const c = costOf(p, inp);
    without += c;
    if (pack >= need) {
      pack -= need;
      packUses += need;
    } else credits += c;
  }
  credits = round(credits);
  if (!account) return { packUses: 0, credits: round(without), creditsWithoutPack: round(without), affordable: null, shortfall: 0 };
  const short = Math.max(0, round(credits - payingBalance(account)));
  return { packUses, credits, creditsWithoutPack: round(without), affordable: short === 0, shortfall: short };
}

/** Perkiraan jumlah penggunaan standar yang bisa dibayar sekarang. null = tidak diketahui. */
export function estimateUses(p: FeaturePricing, account: BillingAccount | null): number | null {
  if (!account) return null;
  if (account.adminFree) return Infinity;
  if (p.inPlan) {
    const sub = account.subscription;
    const pack = account.entitlements[p.feature]?.packUses ?? 0;
    if (!sub) return null;
    return pack + (VIDEO_MINUTES.has(p.feature) ? Math.floor(sub.videoSeconds.left / 60) : sub.units.left);
  }
  const ent = account.entitlements[p.feature];
  if (p.unlockRequired && !ent?.unlocked) return 0;
  if (account.team?.payWithTeam) return Math.floor(round(account.team.available / p.costPerUse));
  return (ent?.packUses ?? 0) + Math.floor(round(account.balance / p.costPerUse));
}

/** Berapa penggunaan yang didapat dari `credits` kredit (paket vs bayar per pakai). */
export function usesForCredits(p: FeaturePricing, credits: number) {
  return {
    payPerUse: Math.floor(round(credits / p.costPerUse)),
    viaPacks: Math.floor(round(credits / p.packPrice)) * p.usesPerCredit,
  };
}

export type AccessState = "unavailable" | "unknown" | "locked" | "insufficient" | "quota" | "ready";

/** Fitur paket yang kuotanya menit video (perkiraan "≈ N menit"). */
const VIDEO_MINUTES = new Set<ServerFeatureId>(["video-compress", "audio-extract"]);

/** v11: label biaya singkat — kuota paket untuk Media & Data, kredit per pakai untuk lainnya. */
export function serverCostLabel(p: FeaturePricing): string {
  if (p.inPlan) return i18n.t(VIDEO_MINUTES.has(p.feature) ? "plans.cost.minute" : "plans.cost.unit");
  return i18n.t("media.shell.perUse", { cost: formatCredits(costOf(p)) });
}

/**
 * v11: rencana kuota paket untuk input saat ini. Input yang tertutup sisa
 * paket fitur lama tidak memakai kuota paket langganan. null = bukan fitur paket.
 */
export function quotaFor(p: FeaturePricing, inputs: UsageInput[], account: BillingAccount | null): QuotaPlan | null {
  if (!p.inPlan) return null;
  let pack = account?.entitlements[p.feature]?.packUses ?? 0;
  const rest = inputs.filter((inp) => {
    const need = packUsesOf(p, inp);
    if (pack >= need) {
      pack -= need;
      return false;
    }
    return true;
  });
  return planQuota(p.feature, rest, account?.subscription ?? null, p.limits.maxBytes);
}

/** Label status akses (teks dari locales: pricing.access.<state>). */
export const ACCESS_LABEL: Record<AccessState, string> = new Proxy({} as Record<AccessState, string>, {
  get: (_t, key: string) => i18n.t(`pricing.access.${key}`),
});

/** Status akses gabungan untuk ditampilkan & untuk menentukan aksi. */
export function accessState(p: FeaturePricing, opts: { serverAvailable: boolean; account: BillingAccount | null; plan?: ChargePlan; quota?: QuotaPlan | null }): AccessState {
  if (!opts.serverAvailable || !p.enabled) return "unavailable";
  if (!opts.account) return "unknown";
  if (opts.account.adminFree) return "ready";
  if (p.inPlan) {
    const q = opts.quota ?? quotaFor(p, [{}], opts.account);
    return q?.enough === false ? "quota" : "ready";
  }
  const ent = opts.account.entitlements[p.feature];
  if (p.unlockRequired && !ent?.unlocked) return "locked";
  const plan = opts.plan ?? planCharge(p, [{}], opts.account);
  return plan.affordable === false ? "insufficient" : "ready";
}

/* ------------------------ harga dari backend ------------------------ */

const num = (v: unknown, min = 0) => (typeof v === "number" && Number.isFinite(v) && v >= min ? v : null);

/** Gabungkan harga dari backend (bila ada) dengan bawaan; nilai tidak valid diabaikan. */
export function mergePricing(base: Record<ServerFeatureId, FeaturePricing>, remote: unknown): Record<ServerFeatureId, FeaturePricing> {
  const out = { ...base };
  if (!remote || typeof remote !== "object") return out;
  for (const id of Object.keys(base) as ServerFeatureId[]) {
    const r = (remote as Record<string, unknown>)[id];
    if (!r || typeof r !== "object") continue;
    const v = r as Record<string, unknown>;
    const cur = base[id];
    out[id] = {
      ...cur,
      costPerUse: num(v.costPerUse, 0.0001) ?? cur.costPerUse,
      usesPerCredit: num(v.usesPerCredit, 1) !== null ? Math.floor(v.usesPerCredit as number) : cur.usesPerCredit,
      packPrice: num(v.packPrice, 0.0001) ?? cur.packPrice,
      unlockRequired: typeof v.unlockRequired === "boolean" ? v.unlockRequired : cur.unlockRequired,
      enabled: typeof v.enabled === "boolean" ? v.enabled : cur.enabled,
      inPlan: typeof v.inPlan === "boolean" ? v.inPlan : cur.inPlan,
    };
  }
  return out;
}

export function sanitizeAccount(raw: unknown): BillingAccount | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Record<string, unknown>;
  // Saldo boleh negatif (kredit ditarik setelah refund/chargeback); dulu akun negatif dibuang → saldo "tidak dapat dimuat".
  const balance = num(v.balance, -Infinity);
  if (balance === null) return null;
  const entitlements: BillingAccount["entitlements"] = {};
  const ents = v.entitlements && typeof v.entitlements === "object" ? (v.entitlements as Record<string, unknown>) : {};
  for (const id of Object.keys(DEFAULT_PRICING) as ServerFeatureId[]) {
    const e = ents[id] as Record<string, unknown> | undefined;
    if (e && typeof e === "object") entitlements[id] = { unlocked: e.unlocked === true, packUses: Math.floor(num(e.packUses) ?? 0) };
  }
  const items = Array.isArray(v.items) ? (v.items as unknown[]).filter((x): x is string => typeof x === "string" && /^[\w:.-]{1,80}$/.test(x)).slice(0, 500) : [];
  const extra = num(v.extraSiteSlots);
  const team = sanitizeTeam(v.team);
  const subscription = sanitizePlanView(v.subscription);
  return {
    balance: round(balance),
    entitlements,
    items,
    extraSiteSlots: extra === null ? 0 : Math.floor(extra),
    syncedAt: Date.now(),
    ...(v.adminFree === true || isAdminFree() ? { adminFree: true } : {}),
    ...(team ? { team } : {}),
    ...(subscription ? { subscription } : {}),
  };
}

function sanitizeTeam(raw: unknown): TeamAccount | null {
  if (!raw || typeof raw !== "object") return null;
  const t = raw as Record<string, unknown>;
  const balance = num(t.balance);
  const available = num(t.available);
  if (typeof t.id !== "string" || typeof t.name !== "string" || balance === null || available === null) return null;
  return {
    id: t.id,
    name: t.name.slice(0, 60),
    role: t.role === "owner" ? "owner" : "member",
    balance: round(balance),
    payWithTeam: t.payWithTeam === true,
    monthlyLimit: num(t.monthlyLimit),
    spentMonth: round(num(t.spentMonth) ?? 0),
    available: round(available),
  };
}
