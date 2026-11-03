import { api, apiFetch } from "../api/client";

/* ================================================================== */
/* Kiriman (v20 · backend v12): formulir, RSVP, dan ucapan dari situs   */
/* pengguna yang sudah online. Satu proyek (website / template kode) =  */
/* satu alamat penerima (`POST {API}/f/:id`).                          */
/* ================================================================== */

export type ProjectType = "site" | "code-site";
export type SubmissionKind = "rsvp" | "ucapan" | "form";

export interface FormEndpoint {
  id: string;
  projectType: ProjectType;
  projectId: string;
  name: string;
  showWishes: boolean;
  submitUrl: string;
  wishesUrl: string;
  createdAt: string;
  counts?: Partial<Record<SubmissionKind, number>>;
}

export interface Submission {
  id: string;
  kind: SubmissionKind;
  data: Record<string, string>;
  hidden: boolean;
  createdAt: string;
}

export interface SubmissionPage {
  submissions: Submission[];
  nextBefore: string | null;
  counts: Partial<Record<SubmissionKind, number>>;
}

export const ensureEndpoint = (projectType: ProjectType, projectId: string, name: string) =>
  api<FormEndpoint>("/forms", { body: { projectType, projectId, name: name.slice(0, 200) || projectId } });

export const listEndpoints = () => api<{ endpoints: FormEndpoint[] }>("/forms");

export function listSubmissions(id: string, opts: { kind?: SubmissionKind; before?: string | null; limit?: number } = {}) {
  const q = new URLSearchParams();
  if (opts.kind) q.set("kind", opts.kind);
  if (opts.before) q.set("before", opts.before);
  if (opts.limit) q.set("limit", String(opts.limit));
  const s = q.toString();
  return api<SubmissionPage>(`/forms/${encodeURIComponent(id)}/submissions${s ? `?${s}` : ""}`);
}

export const setSubmissionHidden = (id: string, sid: string, hidden: boolean) =>
  api(`/forms/${encodeURIComponent(id)}/submissions/${encodeURIComponent(sid)}`, { method: "PATCH", body: { hidden } });

export const deleteSubmission = (id: string, sid: string) =>
  api(`/forms/${encodeURIComponent(id)}/submissions/${encodeURIComponent(sid)}`, { method: "DELETE" });

export const setShowWishes = (id: string, showWishes: boolean) => api<FormEndpoint>(`/forms/${encodeURIComponent(id)}`, { method: "PATCH", body: { showWishes } });

/** CSV dari server (cookie sesi ikut), dikembalikan sebagai Blob. */
export async function downloadCsv(id: string, kind?: SubmissionKind): Promise<{ blob: Blob; fileName: string }> {
  const res = await apiFetch(`/forms/${encodeURIComponent(id)}/submissions.csv${kind ? `?kind=${kind}` : ""}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const cd = res.headers.get("Content-Disposition") ?? "";
  const fileName = /filename="([^"]+)"/.exec(cd)?.[1] ?? "kiriman.csv";
  return { blob: await res.blob(), fileName };
}

/**
 * Skrip penghubung yang disisipkan ke HTML hasil unduh/deploy template kode.
 * Mesin undangan membaca `window.OWD_FORM` (lihat tools/codeTemplates/invite.ts).
 */
export function formBridgeScript(ep: Pick<FormEndpoint, "submitUrl" | "wishesUrl">): string {
  const json = JSON.stringify({ submit: ep.submitUrl, wishes: ep.wishesUrl }).replace(/</g, "\\u003c");
  return `<script>window.OWD_FORM = ${json};</script>`;
}

/** Sisipkan skrip penghubung tepat sebelum </head> (sekali). */
export function withFormBridge(html: string, ep: Pick<FormEndpoint, "submitUrl" | "wishesUrl"> | null): string {
  if (!ep || html.includes("window.OWD_FORM =")) return html;
  const tag = formBridgeScript(ep);
  const i = html.search(/<\/head>/i);
  return i < 0 ? tag + html : html.slice(0, i) + tag + "\n" + html.slice(i);
}
