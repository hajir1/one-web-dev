import { useEffect, useMemo } from "react";
import { refreshBilling, useBilling } from "../processing/billing";
import { isServerConfigured } from "../processing/serverClient";
import { accessState, estimateUses, planCharge, quotaFor, type ServerFeatureId, type UsageInput } from "../processing/pricing";
import { TOOL_BY_ID, type MediaToolId } from "../processing/policy";

let refreshedOnce = false;

/**
 * Semua informasi akses fitur server untuk satu alat: harga (terpusat),
 * saldo & hak akses (dari backend), rencana biaya untuk input saat ini,
 * dan status gabungan. Dipakai kartu akses dan gerbang server.
 */
export function useFeatureAccess(tool: MediaToolId, inputs: UsageInput[] = [{}]) {
  return useServerFeatureAccess(TOOL_BY_ID[tool].serverFeature ?? null, inputs);
}

/** Sama dengan useFeatureAccess, langsung per fitur server (v7: dipakai menu VR & OCR di luar alat Media). */
export function useServerFeatureAccess(feature: ServerFeatureId | null, inputs: UsageInput[] = [{}]) {
  const pricing = useBilling((s) => (feature ? s.pricing[feature] : null));
  const account = useBilling((s) => s.account);
  const status = useBilling((s) => s.status);
  const error = useBilling((s) => s.error);

  useEffect(() => {
    if (!refreshedOnce && feature) {
      refreshedOnce = true;
      refreshBilling();
    }
  }, [feature]);

  const key = JSON.stringify(inputs);
  return useMemo(() => {
    if (!feature || !pricing) return null;
    const serverAvailable = isServerConfigured(feature);
    const list = inputs.length ? inputs : [{}];
    const plan = planCharge(pricing, list, account);
    const quota = quotaFor(pricing, list, account);
    return {
      feature,
      pricing,
      account,
      billingStatus: status,
      billingError: error,
      serverAvailable,
      plan,
      count: list.length,
      quota,
      state: accessState(pricing, { serverAvailable, account, plan, quota }),
      usesLeft: estimateUses(pricing, account),
      entitlement: account?.entitlements[feature] ?? null,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature, pricing, account, status, error, key]);
}

export type FeatureAccess = NonNullable<ReturnType<typeof useFeatureAccess>>;
