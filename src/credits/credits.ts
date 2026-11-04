import { create } from "zustand";
import { isAdminFree } from "../auth/adminFree";
import { CREDIT_COST, type CreditFeature } from "../config/pricing";
import { FREE_SITES, MAX_DESIGNS } from "../config/quota";
import { isDemoMode } from "../demo/demoMode";
import { notify } from "../components/app/Toaster";
import i18n from "../i18n";

/* ================================================================== */
/* Credit gate (frontend)                                               */
/*                                                                    */
/* ONE gateway for paid Web Maker features. `requireCredit()` opens      */
/* a dialog that explains the cost. Credit purchases/usage ALWAYS        */
/* through the backend (`unlockItem` in billing): balance and access are only */
/* change only after the server confirms. Without a backend, the dialog gives */
/* know honestly that payment is not available yet.                     */
/* ================================================================== */

export type { CreditFeature };

/** Limit of saved page designs (see config/quota.ts). */
export const FREE_DESIGNS = MAX_DESIGNS;
/** Free website folders (see config/quota.ts). */
export { FREE_SITES };

export interface CreditRequest {
  feature: CreditFeature;
  /** Name of the requested item (preset / event / template), optional; content, not translated. */
  item?: string;
  /** Access key in the backend (e.g. "template:shop-premium"); when present, the dialog can unlock access. */
  itemKey?: string;
  /** Custom i18n text key; default credits.gate.<feature>.title/message. */
  titleKey?: string;
  messageKey?: string;
  /** Interpolation values for the text. */
  values?: Record<string, string | number>;
  /** Custom cost in credits (e.g. a template price); default CREDIT_COST. */
  cost?: number;
  /**
   * Catalog price of the item (Premium section/element/event) for DISPLAY. The
   * price actually charged is decided by the server from its catalog.
   */
  simCost?: number;
  /**
   * Paid action without an item (e.g. export after the free quota runs out): the
   * "Use N credits" button runs this; the server charges the balance.
   */
  onPay?: () => Promise<void>;
  /** Called after access to the item (`itemKey`) is confirmed by the server. */
  onUnlocked?: () => void;
}

interface CreditGateState {
  request: CreditRequest | null;
  open: (r: CreditRequest) => void;
  close: () => void;
}

export const useCreditGate = create<CreditGateState>((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

/** Default values for each feature's dialog text. */
export const gateValues = (r: CreditRequest): Record<string, string | number> => ({
  sites: FREE_SITES,
  designs: MAX_DESIGNS,
  item: r.item ?? "",
  ...r.values,
});

/** Biaya efektif sebuah permintaan (null = mengikuti tarif fitur server). */
export const requestCost = (r: CreditRequest): number | null => r.cost ?? r.simCost ?? CREDIT_COST[r.feature];

/**
 * Asks the user to spend credits on a feature. Shows the credit dialog
 * and returns `false` (the action does not run now).
 */
export function requireCredit(feature: CreditFeature, extra: Omit<CreditRequest, "feature"> = {}): false {
  // Demo mode (v12): no credits/purchases → no dialog, just a short message.
  if (isDemoMode()) {
    notify.info(i18n.t("demo.notAvailable"));
    return false;
  }
  // v6: admin → no credit dialog. Paid actions run right away (the server does not charge admins).
  if (isAdminFree() && extra.onPay) {
    void extra.onPay().catch(() => useCreditGate.getState().open({ feature, ...extra }));
    return false;
  }
  useCreditGate.getState().open({ feature, ...extra });
  return false;
}
