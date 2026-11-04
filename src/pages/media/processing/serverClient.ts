// ─── processing/serverClient.ts ──────────────────────────────────────────────
// Media & Data server job client (the Nest backend = the only gateway).
// Files do NOT go through Nest: Nest issues a signed upload URL, the browser
// uploads directly to object storage, then the job is created with the uploadId.
// Jobs are processed in a queue (the local Nest processor or an internal Python
// worker that is never exposed to the internet); the frontend polls the status.
// The server charges credits ONLY for successful jobs.
//
// ┌─ BACKEND (NestJS) ────────────────────────────────────────────────────┐
// │ POST {base}/media/jobs/uploads  { feature, fileName, contentType, bytes }
// │        → 201 { uploadId, upload:{ url, method:"PUT", headers }, maxBytes }
// │        (feature access & balance are checked here; 402/403/413 before upload)
// │ PUT  upload.url  (directly to storage, headers from the response above)
// │ POST {base}/media/jobs  { feature, uploadId, params } + Idempotency-Key
// │        → 202 { jobId, status }  · same key → the old job, NO new cost
// │ GET  {base}/media/jobs/:id  → { status, progress?, resultUrl?, error?, account? }
// │ DELETE {base}/media/jobs/:id  cancel (not charged)
// │ Data features (data-*) use the same contract at {base}/data/jobs, VR features (vr-*, v7) at {base}/vr/jobs.
// └───────────────────────────────────────────────────────────────────────┘

import i18n, { currentLang } from "../../../i18n";
import { useJobPrefs } from "../../jobs/jobPrefs";
import { apiFetch } from "../../../api/client";
import { apiConfig, serverUnavailableMessage, configureApi, isBackendConfigured, readJson, sha256Hex, type ApiConfig } from "./apiConfig";
import { useBilling } from "./billing";
import { notify } from "../../../components/app/Toaster";
import type { BillingAccount, ServerFeatureId } from "./pricing";

/* ------------------------------ error ------------------------------- */

/** Stops the queue (not an item failure): items go back to "waiting". */
export class StopQueueError extends Error {}

export class ServerUnavailableError extends StopQueueError {
  constructor(public feature: ServerFeatureId) {
    super(serverUnavailableMessage());
    this.name = "ServerUnavailableError";
  }
}

export class InsufficientCreditError extends StopQueueError {
  constructor(public account: BillingAccount | null) {
    super(i18n.t("errors.server.insufficient"));
    this.name = "InsufficientCreditError";
  }
}

export class FeatureLockedError extends StopQueueError {
  constructor() {
    super(i18n.t("errors.server.locked"));
    this.name = "FeatureLockedError";
  }
}

/**
 * v6: the processing service (Python worker) is down / not responding → the backend
 * replies 503 with a friendly message. The queue stops (items go back to waiting)
 * and the message shows as a notification, not a raw error.
 */
export class ServiceUnavailableError extends StopQueueError {
  constructor(message?: string | null) {
    super(message || i18n.t("errors.server.unavailable503"));
    this.name = "ServiceUnavailableError";
  }
}

/** Failure reason code from the backend/worker (e.g. "timeout") → a sentence for the user. */
export function jobErrorMessage(code: unknown): string {
  if (typeof code === "string" && code.trim() && !/^[a-z_]{1,60}$/i.test(code.trim())) return code.trim().slice(0, 300); // already a sentence
  const c = typeof code === "string" ? code.trim().toLowerCase() : "";
  return i18n.t(`errors.server.jobErrors.${c || "processing_failed"}`, { defaultValue: i18n.t("errors.server.failed") });
}

export class ServerJobError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ServerJobError";
  }
}

/* --------------------------- konfigurasi ---------------------------- */

/** For testing / when the backend is ready. */
export function configureServerClient(c: Partial<ApiConfig>) {
  configureApi(c);
}

/** The server is ready for this feature: a backend is configured AND the feature is not disabled. */
export const isServerConfigured = (feature?: ServerFeatureId) =>
  isBackendConfigured() && (!feature || useBilling.getState().pricing[feature].enabled);

/* ---------------------------- idempotensi --------------------------- */

/**
 * Stable idempotency key: feature + parameters + file fingerprint (size,
 * name, SHA-256 of the first & last 1 MB). Double clicks, retries, or duplicate
 * requests produce the SAME key → the backend does not charge twice.
 */
export async function jobKey(feature: ServerFeatureId, file: Blob & { name?: string }, params: unknown): Promise<string> {
  const MB = 1024 * 1024;
  const head = await file.slice(0, MB).arrayBuffer();
  const tail = file.size > MB ? await file.slice(Math.max(MB, file.size - MB)).arrayBuffer() : new ArrayBuffer(0);
  const meta = new TextEncoder().encode(JSON.stringify([feature, file.name ?? "", file.size, params ?? null]));
  const all = new Uint8Array(meta.byteLength + head.byteLength + tail.byteLength);
  all.set(meta, 0);
  all.set(new Uint8Array(head), meta.byteLength);
  all.set(new Uint8Array(tail), meta.byteLength + head.byteLength);
  return `${feature}-${(await sha256Hex(all)).slice(0, 40)}`;
}

/* ------------------------------ job --------------------------------- */

export interface ServerJobRequest {
  feature: ServerFeatureId;
  file: File | Blob;
  fileName?: string;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  onProgress?: (pct: number) => void;
}

export interface ServerJobResult {
  blob: Blob;
  jobId: string;
  /** Latest balance & access rights according to the backend (after the cost is deducted). */
  account: BillingAccount | null;
}

const inflight = new Map<string, Promise<ServerJobResult>>();

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new DOMException("Dibatalkan", "AbortError"));
      },
      { once: true },
    );
  });

/** Balance/access are ONLY updated from numbers sent by the backend. v11: + plan quota (`subscription`). */
const recordAccount = (raw: unknown, subscription?: unknown) =>
  raw ? useBilling.getState().setAccountFromServer(subscription ? { ...(raw as object), subscription } : raw) : null;

/** v11: plan quota from an error response (PLAN_*) → update the remaining quota display without reloading the account. */
function recordPlan(plan: unknown) {
  const acc = useBilling.getState().account;
  if (acc && plan && typeof plan === "object") useBilling.getState().setAccountFromServer({ ...acc, subscription: plan });
}

function httpError(status: number, body: Record<string, unknown>): Error {
  if (status === 401) return new ServerJobError(i18n.t("errors.billing.signIn"), 401);
  // v7 (P6): team credits used up / member monthly limit — not a personal balance shortfall.
  if (status === 402 && typeof body.code === "string" && body.code.startsWith("TEAM_")) return new ServerJobError(jobErrorMessage(body.code), 402);
  // v11: subscription plan quota used up / plan limit → message from the server + latest remaining quota.
  if (typeof body.code === "string" && (body.code.startsWith("PLAN_") || body.code === "SERVER_BUSY")) {
    recordPlan(body.plan);
    return new ServerJobError(typeof body.error === "string" ? body.error : i18n.t("errors.server.status", { status }), status);
  }
  if (status === 402) return new InsufficientCreditError(recordAccount(body.account));
  if (status === 403) return new FeatureLockedError();
  const msg = typeof body.error === "string" ? body.error : null;
  if (status === 413) return new ServerJobError(msg ?? i18n.t("errors.server.tooLarge"), status);
  if (status === 415) return new ServerJobError(msg ?? i18n.t("errors.server.badType"), status);
  if (status === 429) return new ServerJobError(msg ?? i18n.t("errors.server.rateLimited"), status);
  if (status === 503) return new ServiceUnavailableError(msg);
  return new ServerJobError(msg ?? i18n.t("errors.server.status", { status }), status);
}

/** Job endpoint per feature group: Media → /media/jobs, Data → /data/jobs (same contract). */
export const jobsPath = (feature: ServerFeatureId) => (feature.startsWith("data-") ? "/data/jobs" : feature.startsWith("vr-") ? "/vr/jobs" : "/media/jobs");

/** A URL that belongs to this backend (send cookies) or external storage (no cookies). */
const isApiUrl = (url: string) => !!apiConfig.baseUrl && url.startsWith(`${apiConfig.baseUrl}/`);

interface UploadTicket {
  uploadId: string;
  url: string;
  headers: Record<string, string>;
}

/** Requests upload permission, then sends the file DIRECTLY to storage (not through Nest). */
async function uploadInput(group: string, req: ServerJobRequest): Promise<UploadTicket> {
  const name = req.fileName ?? (req.file as File).name ?? "file";
  const contentType = req.file.type || "application/octet-stream";
  let res: Response;
  try {
    res = await apiFetch(`${group}/uploads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature: req.feature, fileName: name.slice(0, 200), contentType, bytes: req.file.size }),
      signal: req.signal,
    });
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    throw new ServerJobError(i18n.t("errors.server.network"));
  }
  const body = await readJson(res);
  if (!res.ok) throw httpError(res.status, body);
  const up = (body.upload ?? {}) as { url?: unknown; headers?: unknown };
  if (typeof body.uploadId !== "string" || typeof up.url !== "string") throw new ServerJobError(i18n.t("errors.server.invalidResponse"));
  const headers: Record<string, string> = {};
  if (up.headers && typeof up.headers === "object") for (const [k, v] of Object.entries(up.headers)) if (typeof v === "string") headers[k] = v;
  let put: Response;
  try {
    put = await apiConfig.fetch(up.url, { method: "PUT", body: req.file, headers, credentials: isApiUrl(up.url) ? "include" : "omit", signal: req.signal });
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    throw new ServerJobError(i18n.t("errors.server.uploadFailed"));
  }
  if (!put.ok) throw new ServerJobError(i18n.t("errors.server.uploadFailed"), put.status);
  req.onProgress?.(1);
  return { uploadId: body.uploadId, url: up.url, headers };
}

async function execute(key: string, req: ServerJobRequest): Promise<ServerJobResult> {
  const group = jobsPath(req.feature);
  const base = `${apiConfig.baseUrl!}${group}`;
  const f = apiConfig.fetch;
  const ticket = await uploadInput(group, req);

  let res: Response;
  try {
    res = await apiFetch(group, {
      method: "POST",
      // v7 (P4): request an email when the job runs long (the server decides based on duration).
      body: JSON.stringify({ feature: req.feature, uploadId: ticket.uploadId, params: req.params ?? {}, notify: useJobPrefs.getState().notify, lang: currentLang() }),
      headers: { "Content-Type": "application/json", "Idempotency-Key": key },
      signal: req.signal,
    });
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    throw new ServerJobError(i18n.t("errors.server.network"));
  }
  let body = await readJson(res);
  if (!res.ok) throw httpError(res.status, body);
  const jobId = typeof body.jobId === "string" ? body.jobId : "";
  if (!jobId) throw new ServerJobError(i18n.t("errors.server.invalidResponse"));

  const started = Date.now();
  try {
    while (body.status !== "succeeded") {
      if (body.status === "failed") throw new ServerJobError(jobErrorMessage(body.error));
      if (Date.now() - started > apiConfig.timeoutMs) throw new ServerJobError(i18n.t("errors.server.timeout"));
      if (typeof body.progress === "number") req.onProgress?.(Math.max(0, Math.min(100, Math.round(body.progress))));
      await sleep(apiConfig.pollMs, req.signal);
      const poll = await apiFetch(`${group}/${encodeURIComponent(jobId)}`, { signal: req.signal });
      body = await readJson(poll);
      if (!poll.ok) throw httpError(poll.status, body);
    }
  } catch (e) {
    if ((e as Error)?.name === "AbortError") {
      // Tell the server to stop the job & not charge for it (best effort).
      f(`${base}/${encodeURIComponent(jobId)}`, { method: "DELETE", credentials: "include" }).catch(() => {});
    }
    throw e;
  }

  const resultUrl = typeof body.resultUrl === "string" ? body.resultUrl : "";
  if (!resultUrl) throw new ServerJobError(i18n.t("errors.server.noResult"));
  const out = await f(resultUrl, { credentials: isApiUrl(resultUrl) ? "include" : "omit", signal: req.signal });
  if (!out.ok) throw new ServerJobError(i18n.t("errors.server.downloadFailed"), out.status);
  const blob = await out.blob();
  if (!blob.size) throw new ServerJobError(i18n.t("errors.server.emptyResult"));
  return { blob, jobId, account: recordAccount(body.account, body.subscription) };
}

/**
 * Runs one server job. Requests with the same key that are
 * still running are merged (no duplicate requests). Usage/credits are ONLY
 * updated from numbers sent by the backend.
 */
export async function runServerJob(req: ServerJobRequest): Promise<ServerJobResult> {
  if (!isServerConfigured(req.feature)) throw new ServerUnavailableError(req.feature);
  const key = await jobKey(req.feature, req.file as Blob & { name?: string }, req.params);
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = execute(key, req)
    .catch((e: unknown) => {
      // 503: show as a notification (once per request), then pass it on to the page.
      if (e instanceof ServiceUnavailableError) notify.warn(e.message);
      throw e;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}
