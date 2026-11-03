// ─── processing/apiConfig.ts ─────────────────────────────────────────────────
// Konfigurasi bersama SEMUA klien API (auth, billing, marketplace, template,
// desain, job server, admin). Hanya base URL publik dari env — TIDAK ada API
// key, secret pembayaran, atau kredensial di frontend. Autentikasi memakai
// cookie sesi (credentials: "include"); lihat src/api/client.ts.

import i18n from "../../../i18n";

export interface ApiConfig {
  /** Base URL backend Nest; null = frontend dijalankan tanpa backend. */
  baseUrl: string | null;
  fetch: typeof fetch;
  pollMs: number;
  /** Batas waktu total menunggu satu job (ms). */
  timeoutMs: number;
}

/**
 * Base URL backend Nest (satu-satunya gateway API). Urutan:
 * VITE_API_BASE_URL → VITE_MEDIA_API_BASE (nama lama) → http://localhost:3000.
 * Isi "off" untuk menjalankan frontend tanpa backend (fitur server nonaktif).
 */
export const DEFAULT_API_BASE = "http://localhost:3000";

export function resolveApiBase(env: Record<string, string | undefined> | undefined): string | null {
  const raw = (env?.VITE_API_BASE_URL ?? env?.VITE_MEDIA_API_BASE ?? DEFAULT_API_BASE).trim();
  if (raw === "" || raw.toLowerCase() === "off") return null;
  return /^https?:\/\//.test(raw) ? raw.replace(/\/+$/, "") : null;
}

const envBase = (() => {
  try {
    return resolveApiBase((import.meta as unknown as { env?: Record<string, string | undefined> }).env);
  } catch {
    return DEFAULT_API_BASE;
  }
})();

export const apiConfig: ApiConfig = {
  baseUrl: envBase,
  fetch: (...a) => fetch(...a),
  pollMs: 1500,
  timeoutMs: 10 * 60_000,
};

/** Untuk pengujian / saat backend siap. */
export function configureApi(c: Partial<ApiConfig>) {
  Object.assign(apiConfig, c);
}

export const isBackendConfigured = () => !!apiConfig.baseUrl;

/** Pesan baku saat fitur server dijalankan sebelum layanannya aktif. */
export const SERVER_UNAVAILABLE_MESSAGE = "Server belum tersedia. Fitur ini akan dapat digunakan setelah layanan server diaktifkan.";
/** Versi terjemahan (ikut bahasa aktif) dari pesan baku di atas. */
export const serverUnavailableMessage = () => i18n.t("errors.serverUnavailable");
export const billingUnavailableMessage = () => i18n.t("errors.billingUnavailable");
export const BILLING_UNAVAILABLE_MESSAGE =
  "Pembayaran belum tersedia. Pembelian kredit dan pembukaan akses akan aktif setelah sistem pembayaran tersambung. Tidak ada transaksi yang dibuat.";

export async function readJson(res: Response): Promise<Record<string, unknown>> {
  try {
    const v = await res.json();
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

export async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return toHex(await crypto.subtle.digest("SHA-256", bytes as BufferSource));
}
