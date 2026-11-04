// ─── jobs/history.ts ─────────────────────────────────────────────────────────
// v7 (P1): shape of the job history data from GET /jobs/history (Nest backend).

export interface HistoryItem {
  id: string;
  feature: string;
  group: "media" | "data" | "vr";
  state: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  progress: number;
  inputName: string;
  inputBytes: number;
  resultName: string | null;
  error: string | null;
  /** v11: units/videoSeconds = plan quota used (paidBy "plan"). */
  charged: { credits: number; packUses: number; units?: number; videoSeconds?: number };
  paidBy: "personal" | "pack" | "team" | "free" | "plan";
  teamName: string | null;
  createdAt: string;
  finishedAt: string | null;
  downloadable: boolean;
  expiresAt: string | null;
}

export interface HistoryPage {
  items: HistoryItem[];
  nextCursor: string | null;
}

/** History query URL; the "all" filter is not sent. */
export function historyQuery(o: { group?: string; status?: string; cursor?: string | null; limit?: number }): string {
  const q = new URLSearchParams();
  q.set("limit", String(o.limit ?? 20));
  if (o.group && o.group !== "all") q.set("group", o.group);
  if (o.status && o.status !== "all") q.set("status", o.status);
  if (o.cursor) q.set("cursor", o.cursor);
  return `/jobs/history?${q.toString()}`;
}
