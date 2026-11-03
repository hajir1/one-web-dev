import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";
import { CloudOff, Server, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TOOL_BY_ID, type MediaToolId } from "../processing/policy";
import { serverUnavailableMessage } from "../processing/apiConfig";
import { formatCredits, type UsageInput } from "../processing/pricing";
import { useFeatureAccess } from "../hooks/useFeatureAccess";
import { AccessActions, AccessDetails } from "./FeatureAccess";
import { btn } from "./ui";

/* ================================================================== */
/* Gerbang pemrosesan server                                            */
/*                                                                    */
/* Setiap kali fitur server dijalankan, pengguna melihat nama fitur,     */
/* status server, status akses, biaya per penggunaan, perkiraan biaya,   */
/* saldo & perkiraan penggunaan. Selama server belum tersedia, dialog    */
/* ini adalah ALERT informatif: tidak ada upload, saldo tidak berubah,    */
/* tidak ada transaksi.                                                   */
/* ================================================================== */

interface GateRequest {
  tool: MediaToolId;
  inputs: UsageInput[];
  resolve: (ok: boolean) => void;
  onUseBrowser?: () => void;
}

const useGate = create<{ req: GateRequest | null; set: (r: GateRequest | null) => void }>((set) => ({
  req: null,
  set: (req) => set({ req }),
}));

/**
 * Tampilkan informasi biaya & akses. `true` hanya bila server tersedia,
 * akses terbuka, saldo/kuota cukup, dan pengguna menekan "Jalankan".
 */
export function confirmServerRun(tool: MediaToolId, inputs: UsageInput[], onUseBrowser?: () => void): Promise<boolean> {
  useGate.getState().req?.resolve(false);
  return new Promise((resolve) => useGate.getState().set({ tool, inputs: inputs.length ? inputs : [{}], resolve, onUseBrowser }));
}

function GateBody({ req, onClose }: { req: GateRequest; onClose: (ok: boolean) => void }) {
  const { t } = useTranslation();
  const access = useFeatureAccess(req.tool, req.inputs);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => first.current?.focus(), []);
  if (!access) return null;
  const spec = TOOL_BY_ID[req.tool];
  const ready = access.state === "ready";

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="srv-title"
      aria-describedby="srv-desc"
      data-testid="server-gate"
      data-state={access.state}
      className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:rounded-2xl dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            access.serverAvailable ? "bg-blue-50 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
          }`}
        >
          {access.serverAvailable ? <Server className="h-5 w-5" /> : <CloudOff className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="srv-title" className="text-base font-semibold text-gray-900 dark:text-white">
            {t("media.gate.title", { name: spec.name })}
          </h2>
          <p id="srv-desc" className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {access.serverAvailable
              ? t("media.gate.willUpload", { count: access.count })
              : t("media.gate.nothingHappens")}
          </p>
        </div>
        <button type="button" onClick={() => onClose(false)} aria-label={t("common.close")} className={btn.icon}>
          <X className="h-4 w-4" />
        </button>
      </div>

      {!access.serverAvailable && (
        <p role="alert" data-testid="server-unavailable" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {serverUnavailableMessage()}
        </p>
      )}

      <div className="mt-4 rounded-xl bg-gray-50 p-3.5 dark:bg-white/5">
        <AccessDetails access={access} />
      </div>
      {access.state === "insufficient" && (
        <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">{t("media.gate.shortfall", { amount: formatCredits(access.plan.shortfall) })}</p>
      )}
      {access.state === "locked" && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{t("media.gate.locked")}</p>}
      {access.state === "quota" && access.quota?.problem && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-300" data-testid="quota-problem">
          {t(`media.gate.quota.${access.quota.problem}`)}
        </p>
      )}

      <div className="mt-4">{!ready && <AccessActions access={access} />}</div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {req.onUseBrowser && spec.modes.browser && (
          <button
            type="button"
            className={btn.secondary}
            onClick={() => {
              const cb = req.onUseBrowser;
              onClose(false);
              cb?.();
            }}
          >
            {t("media.gate.useBrowser")}
          </button>
        )}
        {ready ? (
          <button ref={first} type="button" onClick={() => onClose(true)} className={btn.primary} data-testid="server-confirm">
            {access.account?.adminFree
              ? t("media.gate.run", { credits: t("adminFree.free") })
              : access.pricing.inPlan
              ? access.quota && access.quota.units > 0
                ? t("media.gate.runWithPlan", { count: access.quota.units })
                : access.quota && (access.quota.videoSeconds > 0 || access.quota.durationUnknown)
                  ? t("media.gate.runWithVideo")
                  : t("media.gate.runWithPack", { uses: access.plan.packUses })
              : access.plan.packUses
              ? t("media.gate.runWithQuota", { credits: formatCredits(access.plan.credits), uses: access.plan.packUses })
              : t("media.gate.run", { credits: formatCredits(access.plan.credits) })}
          </button>
        ) : (
          <button ref={first} type="button" onClick={() => onClose(false)} className={btn.primary} data-testid="server-ok">
            {t("media.gate.ok")}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ServerGateDialog() {
  const req = useGate((s) => s.req);
  const setReq = useGate((s) => s.set);
  const finish = (ok: boolean) => {
    req?.resolve(ok);
    setReq(null);
  };

  useEffect(() => {
    if (!req) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [req]);

  if (!req) return null;
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && finish(false)}>
      <GateBody key={req.tool + JSON.stringify(req.inputs)} req={req} onClose={finish} />
    </div>,
    document.body,
  );
}
