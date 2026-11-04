import { useSyncExternalStore } from "react";

/* ================================================================== */
/* Deploy history (v29.1): remembers the last GitHub deploy of each     */
/* project (website folder or Code Template project) in localStorage,   */
/* so the project list and the Deploy dialog can show "Deployed" with   */
/* the site & repo links, and a redeploy reuses the same repo.          */
/* The GitHub token is never stored here.                               */
/* ================================================================== */

export interface DeployRecord {
  owner: string;
  repo: string;
  repoUrl: string;
  pagesUrl: string;
  vercelUrl?: string;
  /** ISO time of the last successful deploy. */
  at: string;
}

const KEY = "owd-deploys:v1";
const EVENT = "owd-deploys-change";
const isHttps = (u: unknown): u is string => typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u);

/** Project key: `site:<id>` (website folder) or `code:<id>` (Code Template project). */
export const deployKey = (kind: "site" | "code", id: string) => `${kind}:${id}`;

function readAll(): Record<string, DeployRecord> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}") as unknown;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const out: Record<string, DeployRecord> = {};
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      const r = v as Partial<DeployRecord> | null;
      if (!r || typeof r.owner !== "string" || typeof r.repo !== "string" || !isHttps(r.repoUrl) || !isHttps(r.pagesUrl) || typeof r.at !== "string") continue;
      out[k] = { owner: r.owner, repo: r.repo, repoUrl: r.repoUrl, pagesUrl: r.pagesUrl, ...(isHttps(r.vercelUrl) ? { vercelUrl: r.vercelUrl } : {}), at: r.at };
    }
    return out;
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, DeployRecord>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage blocked: the record only lives for this page view */
  }
  cache = null;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

let cache: Record<string, DeployRecord> | null = null;
const snapshot = () => (cache ??= readAll());

export const getDeploy = (key: string): DeployRecord | null => snapshot()[key] ?? null;

export function saveDeploy(key: string, rec: Omit<DeployRecord, "at"> & { at?: string }) {
  writeAll({ ...readAll(), [key]: { ...rec, at: rec.at ?? new Date().toISOString() } });
}

export function removeDeploy(key: string) {
  const all = readAll();
  if (!(key in all)) return;
  delete all[key];
  writeAll(all);
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Every deploy record (re-renders when one changes, also from other tabs). */
export const useDeploys = (): Record<string, DeployRecord> => useSyncExternalStore(subscribe, snapshot, () => ({}));

/** The last deploy of one project, or null. */
export function useDeploy(key: string | undefined): DeployRecord | null {
  const all = useDeploys();
  return key ? (all[key] ?? null) : null;
}
