// ─── processing/serverClient.ts ──────────────────────────────────────────────
// Klien pekerjaan server Media & Data (backend Nest = satu-satunya gateway).
// Berkas TIDAK lewat Nest: Nest memberi URL unggah bertanda tangan, browser
// mengunggah langsung ke object storage, lalu job dibuat dengan uploadId.
// Job diproses di antrean (processor lokal Nest atau pekerja Python
// internal yang tidak pernah dibuka ke internet); frontend mem-poll status.
// Kredit dipotong server HANYA untuk job yang berhasil.
//
// ┌─ BACKEND (NestJS) ────────────────────────────────────────────────────┐
// │ POST {base}/media/jobs/uploads  { feature, fileName, contentType, bytes }
// │        → 201 { uploadId, upload:{ url, method:"PUT", headers }, maxBytes }
// │        (akses fitur & saldo dicek di sini; 402/403/413 sebelum unggah)
// │ PUT  upload.url  (langsung ke storage, header dari respons di atas)
// │ POST {base}/media/jobs  { feature, uploadId, params } + Idempotency-Key
// │        → 202 { jobId, status }  · kunci sama → job lama, TANPA biaya baru
// │ GET  {base}/media/jobs/:id  → { status, progress?, resultUrl?, error?, account? }
// │ DELETE {base}/media/jobs/:id  batalkan (tidak ditagih)
// │ Fitur Data (data-*) memakai kontrak yang sama di {base}/data/jobs, fitur VR (vr-*, v7) di {base}/vr/jobs.
// └───────────────────────────────────────────────────────────────────────┘

import i18n, { currentLang } from "../../../i18n";
import { useJobPrefs } from "../../jobs/jobPrefs";
import { apiFetch } from "../../../api/client";
import { apiConfig, serverUnavailableMessage, configureApi, isBackendConfigured, readJson, sha256Hex, type ApiConfig } from "./apiConfig";
import { useBilling } from "./billing";
import { notify } from "../../../components/app/Toaster";
import type { BillingAccount, ServerFeatureId } from "./pricing";

/* ------------------------------ error ------------------------------- */

/** Menghentikan antrean (bukan kegagalan item): item kembali "menunggu". */
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
 * v6: layanan pemrosesan (pekerja Python) mati / tidak merespons → backend
 * membalas 503 dengan pesan ramah. Antrean berhenti (item kembali menunggu)
 * dan pesan tampil sebagai notifikasi, bukan galat mentah.
 */
export class ServiceUnavailableError extends StopQueueError {
  constructor(message?: string | null) {
    super(message || i18n.t("errors.server.unavailable503"));
    this.name = "ServiceUnavailableError";
  }
}

/** Kode alasan gagal dari backend/pekerja (mis. "timeout") → kalimat untuk pengguna. */
export function jobErrorMessage(code: unknown): string {
  if (typeof code === "string" && code.trim() && !/^[a-z_]{1,60}$/i.test(code.trim())) return code.trim().slice(0, 300); // sudah berupa kalimat
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

/** Untuk pengujian / saat backend siap. */
export function configureServerClient(c: Partial<ApiConfig>) {
  configureApi(c);
}

/** Server siap untuk fitur ini: backend terpasang DAN fitur tidak dinonaktifkan. */
export const isServerConfigured = (feature?: ServerFeatureId) =>
  isBackendConfigured() && (!feature || useBilling.getState().pricing[feature].enabled);

/* ---------------------------- idempotensi --------------------------- */

/**
 * Kunci idempotensi stabil: fitur + parameter + sidik jari file (ukuran,
 * nama, SHA-256 dari 1 MB awal & akhir). Klik ganda, retry, atau request
 * duplikat menghasilkan kunci yang SAMA → backend tidak menagih dua kali.
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
  /** Saldo & hak akses terbaru menurut backend (setelah biaya dipotong). */
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

/** Saldo/hak akses HANYA diperbarui dari angka yang dikirim backend. v11: + kuota paket (`subscription`). */
const recordAccount = (raw: unknown, subscription?: unknown) =>
  raw ? useBilling.getState().setAccountFromServer(subscription ? { ...(raw as object), subscription } : raw) : null;

/** v11: kuota paket dari respons galat (PLAN_*) → perbarui tampilan sisa kuota tanpa memuat ulang akun. */
function recordPlan(plan: unknown) {
  const acc = useBilling.getState().account;
  if (acc && plan && typeof plan === "object") useBilling.getState().setAccountFromServer({ ...acc, subscription: plan });
}

function httpError(status: number, body: Record<string, unknown>): Error {
  if (status === 401) return new ServerJobError(i18n.t("errors.billing.signIn"), 401);
  // v7 (P6): kredit tim habis / batas bulanan anggota — bukan kekurangan saldo pribadi.
  if (status === 402 && typeof body.code === "string" && body.code.startsWith("TEAM_")) return new ServerJobError(jobErrorMessage(body.code), 402);
  // v11: kuota paket langganan habis / batas paket → pesan dari server + sisa kuota terbaru.
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

/** Endpoint job per kelompok fitur: Media → /media/jobs, Data → /data/jobs (kontrak sama). */
export const jobsPath = (feature: ServerFeatureId) => (feature.startsWith("data-") ? "/data/jobs" : feature.startsWith("vr-") ? "/vr/jobs" : "/media/jobs");

/** URL milik backend ini (kirim cookie) atau storage luar (tanpa cookie). */
const isApiUrl = (url: string) => !!apiConfig.baseUrl && url.startsWith(`${apiConfig.baseUrl}/`);

interface UploadTicket {
  uploadId: string;
  url: string;
  headers: Record<string, string>;
}

/** Minta izin unggah lalu kirim berkas LANGSUNG ke storage (bukan lewat Nest). */
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
      // v7 (P4): minta email bila job berjalan lama (server yang memutuskan berdasarkan durasi).
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
      // Beri tahu server agar job dihentikan & tidak ditagih (best effort).
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
 * Jalankan satu pekerjaan server. Permintaan dengan kunci yang sama yang
 * masih berjalan digabung (tidak ada request ganda). Penggunaan/kredit HANYA
 * diperbarui dari angka yang dikirim backend.
 */
export async function runServerJob(req: ServerJobRequest): Promise<ServerJobResult> {
  if (!isServerConfigured(req.feature)) throw new ServerUnavailableError(req.feature);
  const key = await jobKey(req.feature, req.file as Blob & { name?: string }, req.params);
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = execute(key, req)
    .catch((e: unknown) => {
      // 503: tampilkan sebagai notifikasi (sekali per permintaan), lalu teruskan ke halaman.
      if (e instanceof ServiceUnavailableError) notify.warn(e.message);
      throw e;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}
