import { useCallback, useEffect } from "react";
import i18n, { currentLang } from "../i18n";
import { notify } from "../components/app/Toaster";
import { ApiError } from "../api/client";
import { useSession } from "../auth/session";
import { refreshMarketAccount, useMarketStore } from "../marketplace/account";
import { flushDesigns } from "../pages/pageMaker/core/store/designSync";
import { FREE_EXPORTS, serverExport, type ExportedFile, type ServerExportSource } from "./downloadQuota";
import { requireCredit } from "./credits";

export type ExportRunResult = "counted" | "repeat" | "paid" | "free" | "blocked" | "failed" | "signin";

/** Status kuota ekspor gratis (dari server) + `run()` yang meminta server membuat kode. */
export function useExportQuota() {
  const status = useSession((s) => s.status);
  const exports = useMarketStore((s) => s.account.limits.exports);
  const marketStatus = useMarketStore((s) => s.status);
  useEffect(() => {
    if (status === "authenticated" && marketStatus === "idle") void refreshMarketAccount();
  }, [status, marketStatus]);

  /**
   * Jalankan ekspor: sinkronkan desain → server membuat kode (cek Premium &
   * kuota) → `save(files)` mengunduh berkas DARI SERVER. Kuota habis → dialog
   * kredit; bila disetujui, server memotong kredit lalu berkas diunduh.
   */
  const run = useCallback(async (source: ServerExportSource, framework: string, save: (files: ExportedFile[]) => Promise<void>): Promise<ExportRunResult> => {
    if (useSession.getState().status !== "authenticated") {
      notify.info(i18n.t("auth.signInToExport"));
      return "signin";
    }
    const doSave = async (files: ExportedFile[]) => {
      try {
        await save(files);
        return true;
      } catch (err) {
        console.error("[Ekspor] gagal:", err);
        return false;
      }
    };
    const fail = (e: unknown): ExportRunResult => {
      if (e instanceof ApiError && e.code === "PREMIUM_ITEMS_LOCKED") {
        const items = Array.isArray(e.body.items) ? (e.body.items as string[]).slice(0, 5).join(", ") : "";
        notify.error(i18n.t("pm.export.locked", { items }));
      } else if (e instanceof ApiError && e.code === "DESIGN_NOT_SYNCED") notify.warn(i18n.t("pm.export.notSynced"));
      else notify.error(e instanceof ApiError ? e.message : i18n.t("errors.unknown"));
      return "failed";
    };
    let rec;
    try {
      await flushDesigns();
      rec = await serverExport(source, framework, currentLang());
    } catch (e) {
      return fail(e);
    }
    if (rec.result === "blocked") {
      requireCredit("export", {
        messageKey: "credits.gate.export.messageUsed",
        values: { count: rec.quota.free || FREE_EXPORTS },
        cost: rec.quota.cost,
        onPay: async () => {
          try {
            const paid = await serverExport(source, framework, currentLang(), true);
            if (paid.result !== "blocked" && (await doSave(paid.files))) notify.success(i18n.t("pm.export.paid", { cost: rec.quota.cost }));
          } catch (e) {
            fail(e);
          }
        },
      });
      return "blocked";
    }
    return (await doSave(rec.files)) ? rec.result : "failed";
  }, []);

  const signedIn = status === "authenticated";
  return { remaining: signedIn && marketStatus === "ready" ? exports.remaining : null, total: exports.free || FREE_EXPORTS, run };
}

/** @deprecated nama lama. */
export const useDownloadQuota = useExportQuota;
