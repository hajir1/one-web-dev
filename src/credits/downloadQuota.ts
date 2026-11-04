/* ================================================================== */
/* Code export ON THE SERVER (v4) — POST /exports                        */
/*                                                                    */
/* Full code is no longer built in the browser and then "reported": the server */
/* loads the synced design, checks Premium items,                       */
/* records the quota, and only then sends the files. Quota rules are unchanged: */
/*  - 20 free exports per account; identical output (same framework + content) */
/*    is not counted again (the fingerprint is computed by the server);  */
/*  - once used up → exports cost credits (pay=true after consent).      */
/* ================================================================== */

import { FREE_EXPORTS } from "../config/quota";
import { api, ApiError } from "../api/client";
import { patchLimits, useMarketStore } from "../marketplace/account";
import { useBilling } from "../pages/media/processing/billing";
import { useIconStore } from "../pages/pageMaker/core/store/iconStore";
import { useFontStore } from "../pages/pageMaker/core/store/fontStore";
import { useVarStore } from "../pages/pageMaker/core/store/varStore";
import { currentMotionVars } from "../pages/pageMaker/core/store/motionStore";

export { FREE_EXPORTS };
/** @deprecated old name */
export const FREE_DOWNLOADS = FREE_EXPORTS;

/** v9: "free" = Full Website Compose export, free and unlimited (does not use the quota). */
export type ExportRecordResult = "counted" | "repeat" | "paid" | "free" | "blocked";

export interface ExportQuotaInfo {
  used: number;
  free: number;
  remaining: number;
  cost: number;
}

export interface ServerExportSource {
  kind: "page" | "site";
  /** Design/website id in designStore (must already be synced). */
  id: string;
  rootClass?: string;
}

export interface ExportedFile {
  name: string;
  content: string;
  lang: string;
}

type ServerExport = ExportQuotaInfo & { result: "counted" | "repeat" | "paid" | "free"; account?: unknown; files: ExportedFile[]; fingerprint: string };

/** The user's icons, fonts & global variables only exist on the device → sent along so the server code matches the preview. */
function assets() {
  const { fonts, baseFontId } = useFontStore.getState();
  // v7: global variables are sent too (library fonts become variables on the server from `fonts`).
  // v9: + default Animation & 3D values (--owd-anim-*, --owd-3d-*); the server only writes them when used.
  const vars = [...useVarStore.getState().vars, ...currentMotionVars()].map(({ name, type, value }) => ({ name, type, value }));
  return { icons: useIconStore.getState().icons, fonts, vars, ...(baseFontId ? { baseFontId } : {}) };
}

/**
 * Asks the server to build the code. "blocked" = the free quota is used up and `pay`
 * has not been approved (nothing is recorded, no files). Other errors are thrown
 * as ApiError: 401 not signed in · 402 PREMIUM_ITEMS_LOCKED { items } ·
 * 402 INSUFFICIENT_CREDITS · 404 DESIGN_NOT_SYNCED.
 */
export async function serverExport(
  source: ServerExportSource,
  framework: string,
  lang: "id" | "en",
  pay = false,
): Promise<{ result: ExportRecordResult; quota: ExportQuotaInfo; files: ExportedFile[] }> {
  try {
    const r = await api<ServerExport>("/exports", {
      body: { kind: source.kind, id: source.id, framework, lang, pay, ...(source.rootClass ? { rootClass: source.rootClass } : {}), ...assets() },
    });
    const quota = { used: r.used, free: r.free, remaining: r.remaining, cost: r.cost };
    patchLimits({ exports: quota });
    // Paid export: the server sends the latest balance.
    const billing = r.account ? useBilling.getState().setAccountFromServer(r.account) : null;
    if (billing) useMarketStore.setState((s) => ({ account: { ...s.account, balance: billing.balance } }));
    return { result: r.result, quota, files: Array.isArray(r.files) ? r.files : [] };
  } catch (e) {
    if (e instanceof ApiError && e.code === "EXPORT_QUOTA_EXCEEDED") {
      const cur = useMarketStore.getState().account.limits.exports;
      const cost = typeof e.body.cost === "number" ? e.body.cost : cur.cost;
      const quota = { ...cur, remaining: 0, cost };
      patchLimits({ exports: quota });
      return { result: "blocked", quota, files: [] };
    }
    throw e;
  }
}
