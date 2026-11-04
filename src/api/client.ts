// ─── api/client.ts ───────────────────────────────────────────────────────────
// A single service layer for every call to the Nest backend
// (VITE_API_BASE_URL, default http://localhost:3000). Cookie sesi httpOnly
// sent automatically (credentials: "include"); 401 → a single POST
// /auth/refresh, then the request is retried. No tokens in localStorage.

import i18n from "../i18n";
import { apiConfig, isBackendConfigured, readJson } from "../pages/media/processing/apiConfig";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    /** Stable error code from the backend (e.g. "TEMPLATE_LOCKED"). */
    public code: string | null,
    public body: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiUnavailableError extends ApiError {
  constructor() {
    super(i18n.t("errors.serverUnavailable"), 0, "API_UNAVAILABLE");
    this.name = "ApiUnavailableError";
  }
}

export const apiBase = () => apiConfig.baseUrl;
export const apiUrl = (path: string) => `${apiConfig.baseUrl ?? ""}${path}`;

const lang = () => (i18n.language?.startsWith("en") ? "en" : "id");

let refreshing: Promise<boolean> | null = null;
/** Refresh the session from the refresh cookie. Parallel calls are merged into one. */
function refreshSession(): Promise<boolean> {
  if (!isBackendConfigured()) return Promise.resolve(false);
  refreshing ??= apiConfig
    .fetch(apiUrl("/auth/refresh"), { method: "POST", credentials: "include", headers: { "Accept-Language": lang() } })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

/** Called when the session has truly ended (refresh failed). */
const sessionListeners = new Set<() => void>();
export const onSessionExpired = (cb: () => void) => {
  sessionListeners.add(cb);
  return () => sessionListeners.delete(cb);
};

const NO_REFRESH = new Set([
  "/auth/refresh",
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/verify-email",
  "/auth/verify-email/resend",
  "/auth/password/forgot",
  "/auth/password/reset",
]);

/**
 * Raw fetch to the backend with cookies + Accept-Language. A 401 on a protected
 * endpoint → refresh once, then retry. Returns the Response as is.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (!isBackendConfigured()) throw new ApiUnavailableError();
  const headers = new Headers(init.headers);
  if (!headers.has("Accept-Language")) headers.set("Accept-Language", lang());
  const run = () => apiConfig.fetch(apiUrl(path), { credentials: "include", ...init, headers });
  const res = await run();
  if (res.status !== 401 || NO_REFRESH.has(path.split("?")[0])) return res;
  if (!(await refreshSession())) {
    sessionListeners.forEach((cb) => cb());
    return res;
  }
  return run();
}

export interface ApiRequest {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Sends the Idempotency-Key header (required for actions that charge credits). */
  idempotencyKey?: string;
  signal?: AbortSignal;
}

export const newIdempotencyKey = (prefix = "req") =>
  `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`.slice(0, 200);

/** Calls a JSON endpoint. Status ≥ 400 is thrown as an ApiError (with the server message when present). */
export async function api<T = Record<string, unknown>>(path: string, req: ApiRequest = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (req.body !== undefined) headers["Content-Type"] = "application/json";
  if (req.idempotencyKey) headers["Idempotency-Key"] = req.idempotencyKey;
  let res: Response;
  try {
    res = await apiFetch(path, {
      method: req.method ?? (req.body !== undefined ? "POST" : "GET"),
      headers,
      body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
      signal: req.signal,
    });
  } catch (e) {
    if (e instanceof ApiError || (e as Error)?.name === "AbortError") throw e;
    throw new ApiError(i18n.t("errors.billing.network"), 0, "NETWORK");
  }
  if (res.status === 204) return {} as T;
  const body = await readJson(res);
  if (!res.ok) {
    const code = typeof body.code === "string" ? body.code : null;
    const msg = typeof body.error === "string" ? body.error : i18n.t("errors.billing.status", { status: res.status });
    throw new ApiError(msg, res.status, code, body);
  }
  return body as T;
}
