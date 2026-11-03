// ─── api/queryClient.ts ──────────────────────────────────────────────────────
// Satu QueryClient (TanStack Query) untuk seluruh aplikasi: cache bersama,
// penggabungan permintaan yang sama (dedup), dan aturan coba ulang.
//
// Aturan umum (bisa ditimpa per resource di api/queries.ts):
// - staleTime 30 detik: berpindah halaman bolak-balik tidak memanggil API lagi.
// - gcTime 10 menit: data yang tidak dipakai dibuang dari memori.
// - Error 4xx (401/402/403/404/409/422) TIDAK dicoba ulang: hasilnya tidak akan
//   berubah. Error jaringan/5xx dicoba ulang 2× dengan jeda bertahap.
// - Tidak refetch saat jendela fokus kembali (saldo & akun diperbarui
//   eksplisit setelah transaksi lewat invalidateQueries).

import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./client";

export const STALE = {
  /** Data akun yang sering berubah (saldo, kuota). */
  short: 30_000,
  /** Katalog publik (daftar template, harga). */
  medium: 5 * 60_000,
  /** Hampir statis (paket kredit, harga fitur). */
  long: 30 * 60_000,
} as const;

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  if ((error as Error)?.name === "AbortError") return false;
  // Backend belum dikonfigurasi: mencoba ulang tidak mengubah apa pun.
  if (error instanceof ApiError && error.code === "API_UNAVAILABLE") return false;
  return failureCount < 2;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE.short,
        // Di luar browser (tes Node) tanpa timer GC agar proses bisa selesai.
        gcTime: typeof window === "undefined" ? Infinity : 10 * 60_000,
        retry: shouldRetry,
        retryDelay: (n) => Math.min(500 * 2 ** n, 4000),
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  });
}

export const queryClient = createQueryClient();

/* ------------------------------------------------------------------ */
/* Kunci query per resource (satu sumber, dipakai hook & invalidasi)     */
/* ------------------------------------------------------------------ */

export const qk = {
  session: ["session"] as const,
  billing: ["billing"] as const,
  billingAccount: ["billing", "account"] as const,
  billingPricing: ["billing", "pricing"] as const,
  billingPackages: ["billing", "packages"] as const,
  transactions: (limit: number) => ["billing", "transactions", limit] as const,
  market: ["market", "account"] as const,
  serverCatalog: ["catalog", "items"] as const,
  catalog: (lang: string) => ["catalog", "snapshot", lang] as const,
  templates: ["templates"] as const,
  templatesPage: (params: object) => ["templates", "page", params] as const,
  templatesInfinite: (params: object) => ["templates", "infinite", params] as const,
  template: (lang: string, id: string) => ["templates", "detail", lang, id] as const,
  referral: ["referral", "me"] as const,
  mfa: ["auth", "2fa"] as const,
};

/**
 * Setelah aksi yang mengubah saldo/kepemilikan (beli, checkout lunas, refund
 * admin): tandai data akun basi agar layar yang memakainya memuat ulang.
 * Store saldo & akun marketplace sudah diperbarui dari respons server.
 */
export function invalidateAccountQueries() {
  void queryClient.invalidateQueries({ queryKey: qk.billing });
  void queryClient.invalidateQueries({ queryKey: qk.market });
  void queryClient.invalidateQueries({ queryKey: qk.referral });
}

/** Setelah admin mengubah template/katalog. */
export function invalidateCatalogQueries() {
  void queryClient.invalidateQueries({ queryKey: qk.templates });
  void queryClient.invalidateQueries({ queryKey: ["catalog"] });
}

/** Saat ganti akun/keluar: buang semua data milik akun sebelumnya. */
export function clearAccountQueries() {
  for (const key of [qk.billing, qk.market, qk.referral, qk.mfa, qk.session]) queryClient.removeQueries({ queryKey: key });
}
