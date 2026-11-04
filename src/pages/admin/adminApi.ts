import { useCallback, useEffect, useRef, useState } from "react";
import { notify } from "../../components/app/Toaster";
import { ApiError, api } from "../../api/client";
import { catalogRepository } from "../../marketplace/repository";
import { invalidateCatalogQueries } from "../../api/queryClient";
import { loadServerCatalog } from "../../marketplace/serverCatalog";
import { clearTemplateCache } from "../webTemplates/templateContent";

/* Admin panel data utilities (not components; split out so Fast Refresh keeps working). */

export type Row = Record<string, unknown>;

export const qs = (o: Record<string, string | number | undefined>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== "") p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const errText = (e: unknown) => (e instanceof ApiError ? `${e.message}${e.code ? ` (${e.code})` : ""}` : e instanceof Error ? e.message : String(e));

export const fmtDate = (v: unknown) => (typeof v === "string" && v ? new Date(v).toLocaleString() : "—");

export const fmtNum = (v: unknown) => (typeof v === "number" ? v.toLocaleString() : "—");

export function useAdminGet<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);
  const reload = useCallback(async () => {
    if (!path) return;
    const id = ++seq.current;
    setLoading(true);
    setError(null);
    try {
      const r = await api<T>(path);
      if (id === seq.current) setData(r);
    } catch (e) {
      if (id === seq.current) setError(errText(e));
    } finally {
      if (id === seq.current) setLoading(false);
    }
  }, [path]);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { data, error, loading, reload };
}

export async function act(fn: () => Promise<unknown>, ok: string, after?: () => void) {
  try {
    await fn();
    notify.success(ok);
    after?.();
    return true;
  } catch (e) {
    notify.error(errText(e));
    return false;
  }
}

export function refreshCatalogCaches() {
  catalogRepository.clear();
  clearTemplateCache();
  invalidateCatalogQueries();
  void loadServerCatalog(true);
}

export const td = "px-3 py-2 align-middle";

export type Tone = "gray" | "green" | "amber" | "blue" | "rose";

export const STATUS_TONE: Record<string, Tone> = { PAID: "green", SUCCEEDED: "green", PUBLISHED: "green", ACTIVE: "green", PENDING: "amber", QUEUED: "amber", DRAFT: "amber", RUNNING: "blue", FAILED: "rose", SUSPENDED: "rose" };

export const statusTone = (s: unknown): Tone => STATUS_TONE[String(s)] ?? "gray";

export interface Paged {
  total: number;
  page: number;
  pageSize: number;
}
