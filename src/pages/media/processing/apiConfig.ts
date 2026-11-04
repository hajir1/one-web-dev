// ─── processing/apiConfig.ts ─────────────────────────────────────────────────
// Shared configuration for ALL API clients (auth, billing, marketplace, templates,
// designs, server jobs, admin). Only the public base URL from env; NO API
// keys, payment secrets, or credentials in the frontend. Authentication uses
// session cookie (credentials: "include"); see src/api/client.ts.

import i18n from "../../../i18n";

export interface ApiConfig {
  /** Nest backend base URL; null = the frontend runs without a backend. */
  baseUrl: string | null;
  fetch: typeof fetch;
  pollMs: number;
  /** Total time limit for waiting on one job (ms). */
  timeoutMs: number;
}

/**
 * Nest backend base URL (the only API gateway). Order:
 * VITE_API_BASE_URL → VITE_MEDIA_API_BASE (old name) → http://localhost:3000.
 * Set "off" to run the frontend without a backend (server features disabled).
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

/** For testing / when the backend is ready. */
export function configureApi(c: Partial<ApiConfig>) {
  Object.assign(apiConfig, c);
}

export const isBackendConfigured = () => !!apiConfig.baseUrl;

/** Standard message when a server feature runs before its service is active. */
export const SERVER_UNAVAILABLE_MESSAGE = "Server belum tersedia. Fitur ini akan dapat digunakan setelah layanan server diaktifkan.";
/** Translated version (follows the active language) of the standard messages above. */
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
