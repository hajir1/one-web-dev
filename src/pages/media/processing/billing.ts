// ─── processing/billing.ts ───────────────────────────────────────────────────
// Status akun (saldo, hak akses fitur) + klien billing.
//
// PRINSIP KEAMANAN:
// - Saldo, status pembayaran, dan hak akses HANYA berasal dari respons
//   backend. Frontend tidak pernah menambah saldo, membuka akses, atau
//   menganggap pembayaran berhasil berdasarkan state/URL sendiri.
// - State ini sengaja TIDAK disimpan ke localStorage: data basi tidak boleh
//   dipakai sebagai bukti hak akses. Setiap kali halaman dibuka → muat ulang.
// - Pembayaran lewat payment gateway (halaman checkout hosted). Tidak ada
//   secret/kunci gateway di frontend; backend yang membuat sesi checkout.
//
// ┌─ BACKEND (NestJS, sudah tersedia) ────────────────────────────────────┐
// │ GET  {base}/billing/account   → { balance, entitlements:{fitur:{unlocked,packUses}} }
// │ GET  {base}/billing/pricing   → { [fitur]: {costPerUse, usesPerCredit, packPrice, unlockRequired, enabled} }
// │ POST {base}/billing/checkout  { packageId, returnUrl } + Idempotency-Key
// │                               → { checkoutUrl }  (URL gateway, https)
// │ GET  {base}/billing/checkout/:sessionId → { status:"paid"|"pending"|"failed", account }
// │                               (status DARI WEBHOOK gateway, bukan dari redirect)
// │ POST {base}/billing/unlock    { feature } + Idempotency-Key
// │                               → { account }   402 bila saldo kurang
// │ GET  {base}/billing/packages  → { packages:[{id,credits,priceIdr,highlight?}] } (Rupiah)
// │                               (opsional; tanpa ini dipakai config/pricing.ts)
// │ GET  {base}/billing/transactions?limit=50
// │                               → { transactions:[{id,type,credits,createdAt,
// │                                   description?,status?,amount?,currency?}] } (amount = rupiah)
// │ POST {base}/billing/unlock-item { item, feature } + Idempotency-Key
// │                               → { account }  (account.items memuat item)
// │                               402 saldo kurang · 409 sudah dimiliki (tanpa biaya)
// │                               Kredit dipotong SEKALI per item & kunci idempoten.
// └───────────────────────────────────────────────────────────────────────┘

import { create } from "zustand";
import i18n from "../../../i18n";
import { DEFAULT_CREDIT_PACKAGES, sanitizePackages, type CreditFeature, type CreditPackage } from "../../../config/pricing";
import { apiFetch } from "../../../api/client";
import { invalidateAccountQueries, qk, queryClient, STALE } from "../../../api/queryClient";
import { billingUnavailableMessage, isBackendConfigured, readJson } from "./apiConfig";
import { DEFAULT_PRICING, mergePricing, sanitizeAccount, type BillingAccount, type FeaturePricing, type ServerFeatureId } from "./pricing";

export class BillingUnavailableError extends Error {
  constructor() {
    super(billingUnavailableMessage());
    this.name = "BillingUnavailableError";
  }
}
export class BillingError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "BillingError";
  }
}

type Status = "idle" | "loading" | "ready" | "unavailable" | "error";

interface BillingState {
  account: BillingAccount | null;
  pricing: Record<ServerFeatureId, FeaturePricing>;
  pricingSource: "default" | "server";
  /** Paket kredit yang ditampilkan (bawaan, atau dari server bila valid). */
  packages: CreditPackage[];
  packagesSource: "default" | "server";
  status: Status;
  error: string | null;
  /** Hanya dipanggil dengan data dari respons backend. */
  setAccountFromServer: (raw: unknown) => BillingAccount | null;
}

export const useBilling = create<BillingState>((set) => ({
  account: null,
  pricing: DEFAULT_PRICING,
  pricingSource: "default",
  packages: DEFAULT_CREDIT_PACKAGES,
  packagesSource: "default",
  status: "idle",
  error: null,
  setAccountFromServer: (raw) => {
    const account = sanitizeAccount(raw);
    if (!account) return null;
    // v11: respons yang tidak memuat kuota paket (mis. beli item) tidak menghapus kuota yang sudah diketahui.
    const prev = useBilling.getState().account;
    if (!account.subscription && prev?.subscription) account.subscription = prev.subscription;
    set({ account });
    return account;
  },
}));

const inflight = new Map<string, Promise<unknown>>();
function once<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cur = inflight.get(key) as Promise<T> | undefined;
  if (cur) return cur;
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

async function call(path: string, init: RequestInit = {}): Promise<Record<string, unknown>> {
  if (!isBackendConfigured()) throw new BillingUnavailableError();
  let res: Response;
  try {
    res = await apiFetch(path, init);
  } catch {
    throw new BillingError(i18n.t("errors.billing.network"));
  }
  const body = await readJson(res);
  if (!res.ok) {
    const msg = typeof body.error === "string" ? body.error : null;
    if (res.status === 401) throw new BillingError(msg ?? i18n.t("errors.billing.signIn"), 401);
    if (res.status === 402) throw new BillingError(msg ?? i18n.t("errors.billing.insufficient"), 402);
    throw new BillingError(msg ?? i18n.t("errors.billing.status", { status: res.status }), res.status);
  }
  return body;
}

/**
 * Muat saldo, hak akses, dan harga dari backend lewat cache TanStack Query.
 * - `refreshBilling()` (default) selalu mengambil data baru (dipakai tombol
 *   "Muat ulang" dan setelah transaksi), tetap digabung bila paralel.
 * - `ensureBilling()` memakai cache bila masih segar (dipakai saat komponen
 *   dibuka) → berpindah halaman tidak memanggil 3 endpoint lagi.
 * Harga fitur & paket kredit hampir statis → cache 30 menit.
 */
export function refreshBilling(force = true): Promise<void> {
  return once(force ? "refresh" : "ensure", async () => {
    if (!isBackendConfigured()) {
      useBilling.setState({ status: "unavailable", account: null, error: null });
      return;
    }
    if (!useBilling.getState().account) useBilling.setState({ status: "loading", error: null });
    try {
      const [acc, pricing, pkgs] = await Promise.all([
        queryClient.fetchQuery({ queryKey: qk.billingAccount, queryFn: () => call("/billing/account"), staleTime: force ? 0 : STALE.short, retry: false }),
        queryClient
          .fetchQuery({ queryKey: qk.billingPricing, queryFn: () => call("/billing/pricing"), staleTime: force ? 0 : STALE.long, retry: false })
          .catch(() => null),
        queryClient
          .fetchQuery({ queryKey: qk.billingPackages, queryFn: () => call("/billing/packages"), staleTime: force ? 0 : STALE.long, retry: false })
          .catch(() => null),
      ]);
      useBilling.getState().setAccountFromServer(acc);
      if (pricing) useBilling.setState({ pricing: mergePricing(DEFAULT_PRICING, pricing), pricingSource: "server" });
      const packages = pkgs ? sanitizePackages(pkgs.packages) : null;
      if (packages) useBilling.setState({ packages, packagesSource: "server" });
      useBilling.setState({ status: "ready", error: null });
    } catch (e) {
      useBilling.setState({ status: "error", account: null, error: e instanceof Error ? e.message : i18n.t("errors.billing.loadFailed") });
    }
  });
}

/** Seperti refreshBilling, tetapi memakai cache yang masih segar. */
export const ensureBilling = () => refreshBilling(false);

const randomKey = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/** URL checkout hanya diterima bila https (atau http lokal saat pengembangan). */
export function safeCheckoutUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  try {
    const u = new URL(raw);
    if (u.protocol === "https:") return u.toString();
    if (u.protocol === "http:" && /^(localhost|127\.0\.0\.1)$/.test(u.hostname)) return u.toString();
  } catch {
    /* tidak valid */
  }
  return null;
}

/**
 * Mulai pembelian paket kredit → mengembalikan URL checkout gateway.
 * Klik ganda pada paket yang sama digabung menjadi satu permintaan.
 */
export function startCheckout(packageId: string, returnUrl: string): Promise<string> {
  return once(`checkout:${packageId}`, async () => {
    const body = await call("/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": `checkout-${packageId}-${randomKey()}` },
      // Seluruh pembayaran dalam Rupiah lewat Midtrans (Midtrans hanya memproses IDR).
      body: JSON.stringify({ packageId, currency: "IDR", returnUrl }),
    });
    const url = safeCheckoutUrl(body.checkoutUrl);
    if (!url) throw new BillingError(i18n.t("errors.billing.invalidCheckout"));
    return url;
  });
}

export type CheckoutStatus = "paid" | "pending" | "failed";

/**
 * Setelah kembali dari gateway: status DIVERIFIKASI ke backend. Parameter
 * URL (?checkout=success) tidak pernah dipercaya sebagai bukti pembayaran.
 */
export async function verifyCheckout(sessionId: string): Promise<CheckoutStatus> {
  if (!/^[\w-]{6,128}$/.test(sessionId)) throw new BillingError(i18n.t("errors.billing.invalidSession"));
  const body = await call(`/billing/checkout/${encodeURIComponent(sessionId)}`);
  const status = body.status === "paid" || body.status === "failed" ? body.status : "pending";
  const sub = (body.subscription as { current?: unknown } | undefined)?.current;
  if (body.account) useBilling.getState().setAccountFromServer(sub ? { ...(body.account as object), subscription: sub } : body.account);
  if (status === "paid") invalidateAccountQueries();
  return status;
}

/** Buka akses fitur (beli paket fitur dari saldo). */
export function unlockFeature(feature: ServerFeatureId): Promise<BillingAccount | null> {
  return once(`unlock:${feature}`, async () => {
    const body = await call("/billing/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": `unlock-${feature}-${randomKey()}` },
      body: JSON.stringify({ feature }),
    });
    invalidateAccountQueries();
    return useBilling.getState().setAccountFromServer(body.account);
  });
}

export const pricingOf = (f: ServerFeatureId) => useBilling.getState().pricing[f];

/* ------------------------------------------------------------------ */
/* Item berbayar (template premium, preset, elemen, slot website)       */
/* ------------------------------------------------------------------ */

/** Kunci item yang valid, mis. "template:shop-premium" atau "site-slot". */
const isItemKey = (k: string) => /^[\w:.-]{1,80}$/.test(k);

/** Apakah akun (menurut respons server terakhir) sudah memiliki item ini. */
export function hasItem(itemKey: string): boolean {
  return !!useBilling.getState().account?.items.includes(itemKey);
}

/**
 * Buka akses satu item berbayar dengan saldo kredit. Saldo hanya berubah
 * dari respons backend. Klik ganda digabung (satu permintaan) dan kunci
 * idempoten dikirim agar server tidak memotong kredit dua kali.
 */
export function unlockItem(itemKey: string, feature: CreditFeature): Promise<BillingAccount | null> {
  if (!isItemKey(itemKey)) return Promise.reject(new BillingError(i18n.t("errors.billing.invalidItem")));
  return once(`unlock-item:${itemKey}`, async () => {
    if (hasItem(itemKey)) return useBilling.getState().account; // sudah dimiliki: tidak ada biaya
    let body: Record<string, unknown>;
    try {
      body = await call("/billing/unlock-item", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": `item-${itemKey}-${randomKey()}` },
        body: JSON.stringify({ item: itemKey, feature }),
      });
    } catch (e) {
      // 409 = sudah dimiliki → muat ulang akun dari server, tanpa biaya baru.
      if (e instanceof BillingError && e.status === 409) {
        await refreshBilling();
        return useBilling.getState().account;
      }
      throw e;
    }
    invalidateAccountQueries();
    return useBilling.getState().setAccountFromServer(body.account);
  });
}

/* ------------------------------------------------------------------ */
/* Riwayat transaksi                                                    */
/* ------------------------------------------------------------------ */

type TransactionType = "purchase" | "usage" | "refund" | "unlock" | "adjustment";

export interface CreditTransaction {
  id: string;
  type: TransactionType;
  /** Positif = kredit masuk, negatif = kredit terpakai. */
  credits: number;
  createdAt: string;
  description?: string;
  status?: "completed" | "pending" | "failed";
  /** Nominal pembayaran dalam rupiah bulat (hanya transaksi pembelian). */
  amountIdr?: number;
  /** Pembayaran lunas: id pembayaran + nomor invoice (untuk tautan invoice). */
  paymentId?: string;
  invoiceNumber?: string;
}

const TX_TYPES: TransactionType[] = ["purchase", "usage", "refund", "unlock", "adjustment"];

/** Validasi baris riwayat dari server (yang tidak valid dibuang). */
export function sanitizeTransactions(raw: unknown): CreditTransaction[] {
  if (!Array.isArray(raw)) return [];
  const out: CreditTransaction[] = [];
  for (const r of raw.slice(0, 200)) {
    if (!r || typeof r !== "object") continue;
    const v = r as Record<string, unknown>;
    if (typeof v.id !== "string" || !v.id || v.id.length > 100) continue;
    if (typeof v.credits !== "number" || !Number.isFinite(v.credits)) continue;
    if (typeof v.createdAt !== "string" || Number.isNaN(Date.parse(v.createdAt))) continue;
    const type = TX_TYPES.includes(v.type as TransactionType) ? (v.type as TransactionType) : "adjustment";
    const tx: CreditTransaction = { id: v.id, type, credits: v.credits, createdAt: v.createdAt };
    if (typeof v.description === "string") tx.description = v.description.slice(0, 200);
    if (v.status === "completed" || v.status === "pending" || v.status === "failed") tx.status = v.status;
    if (v.currency === "IDR" && typeof v.amount === "number" && Number.isInteger(v.amount) && v.amount >= 0) tx.amountIdr = v.amount;
    if (typeof v.paymentId === "string" && /^[0-9a-f-]{36}$/i.test(v.paymentId) && typeof v.invoiceNumber === "string" && v.invoiceNumber.length <= 40) {
      tx.paymentId = v.paymentId;
      tx.invoiceNumber = v.invoiceNumber;
    }
    out.push(tx);
  }
  return out;
}

/** Ambil riwayat transaksi kredit dari backend. */
function fetchTransactions(limit = 50): Promise<CreditTransaction[]> {
  return once(`tx:${limit}`, async () => {
    const body = await call(`/billing/transactions?limit=${Math.max(1, Math.min(200, Math.floor(limit)))}`);
    return sanitizeTransactions(body.transactions);
  });
}

/** Opsi query riwayat transaksi (dipakai useQuery di halaman Credits & prefetch). */
export const transactionsQuery = (limit = 50) => ({
  queryKey: qk.transactions(limit),
  queryFn: () => fetchTransactions(limit),
  staleTime: STALE.short,
});
