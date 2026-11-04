import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Coins, ExternalLink, Loader2 } from "lucide-react";
import Modal from "../components/app/Modal";
import { Link } from "../components/app/LocaleLink";
import { Notice, btn } from "../components/app/ui";
import { notify } from "../components/app/Toaster";
import { CREDITS_PATH } from "../config/menu";
import { gateValues, requestCost, useCreditGate } from "./credits";
import { BillingError, BillingUnavailableError, hasItem, refreshBilling, unlockItem, useBilling } from "../pages/media/processing/billing";
import { formatCredits } from "../pages/media/processing/pricing";
import { isBackendConfigured } from "../pages/media/processing/apiConfig";
import { isDemoMode } from "../demo/demoMode";
import { refreshMarketAccount } from "../marketplace/account";
import { useSession } from "../auth/session";

/**
 * "This feature needs credits" dialog. Mounted once on pages that use
 * paid features. It never assumes a payment succeeded: item access only
 * unlocks after the backend confirms (`unlockItem`), and the charged price
 * is decided by the server (the numbers here are display only).
 */
export default function CreditDialog() {
  const { t } = useTranslation();
  const request = useCreditGate((s) => s.request);
  const close = useCreditGate((s) => s.close);
  const account = useBilling((s) => s.account);
  const status = useBilling((s) => s.status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signedIn = useSession((s) => s.status === "authenticated");

  useEffect(() => {
    setError(null);
    setBusy(false);
    if (request && status === "idle") void refreshBilling();
  }, [request, status]);

  // Demo mode (v12): no credits (requireCredit does not open the dialog in demo either).
  if (!request || isDemoMode()) return null;
  const values = gateValues(request);
  const cost = requestCost(request);
  const title = t(request.titleKey ?? `credits.gate.${request.feature}.title`, values);
  const message = t(request.messageKey ?? `credits.gate.${request.feature}.message`, values);
  const backend = isBackendConfigured();
  const owned = request.itemKey ? hasItem(request.itemKey) : false;
  const enough = account && cost !== null ? account.adminFree === true || account.balance >= cost : false;
  const canUnlock = backend && !!account && (!!request.itemKey || !!request.onPay) && cost !== null && !owned;

  const unlock = async () => {
    if (busy) return;
    if (request.onPay) {
      setBusy(true);
      setError(null);
      try {
        await request.onPay();
        close();
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errors.unknown"));
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!request.itemKey) return;
    setBusy(true);
    setError(null);
    try {
      await unlockItem(request.itemKey, request.feature);
      if (!hasItem(request.itemKey)) throw new BillingError(t("credits.dialog.notConfirmed"));
      void refreshMarketAccount();
      notify.success(t("credits.dialog.unlocked", { item: request.item ?? title }));
      const done = request.onUnlocked;
      close();
      done?.();
    } catch (e) {
      setError(e instanceof BillingUnavailableError ? t("errors.billingUnavailable") : e instanceof Error ? e.message : t("errors.unknown"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      alert
      onClose={close}
      size="sm"
      testId="credit-dialog"
      icon={<Coins className="h-5 w-5" />}
      title={title}
      description={message}
      footer={
        <>
          <button type="button" onClick={close} className={btn.secondary}>
            {t("credits.dialog.later")}
          </button>
          {backend && !signedIn ? (
            <Link to={`/signin?next=${encodeURIComponent(window.location.pathname + window.location.search)}`} onClick={close} data-testid="credit-signin" className={btn.primary}>
              {t("auth.signIn")}
            </Link>
          ) : canUnlock && enough ? (
            <button type="button" data-testid="credit-unlock" onClick={unlock} disabled={busy} className={btn.primary}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
              {t("credits.dialog.useCredits", { cost: formatCredits(cost ?? 0) })}
            </button>
          ) : (
            <Link to={CREDITS_PATH} onClick={close} data-testid="credit-buy" className={btn.primary}>
              <ExternalLink className="h-4 w-4" /> {t("credits.dialog.openCredits")}
            </Link>
          )}
        </>
      }
    >
      <dl className="space-y-1.5 text-sm">
        {request.item && (
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500 dark:text-gray-400">{t("credits.dialog.item")}</dt>
            <dd className="text-right font-semibold text-gray-800 dark:text-gray-100">{request.item}</dd>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">{t("credits.dialog.cost")}</dt>
          <dd className="font-semibold text-gray-800 dark:text-gray-100">{cost === null ? t("credits.dialog.costByUsage") : formatCredits(cost)}</dd>
        </div>
        {account && (
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500 dark:text-gray-400">{t("credits.dialog.balance")}</dt>
            <dd className="font-semibold text-gray-800 dark:text-gray-100">{formatCredits(account.balance)}</dd>
          </div>
        )}
      </dl>
      <div className="mt-3 space-y-2">
        {!backend && <Notice tone="warn">{t("errors.billingUnavailable")}</Notice>}
        {backend && !signedIn && <Notice tone="info">{t("auth.signInToContinue")}</Notice>}
        {backend && signedIn && status === "error" && <Notice tone="error">{t("credits.dialog.accountError")}</Notice>}
        {owned && <Notice tone="success">{t("credits.dialog.owned")}</Notice>}
        {canUnlock && !enough && <Notice tone="warn">{t("credits.dialog.insufficient")}</Notice>}
        {backend && account && !request.itemKey && !request.onPay && <Notice tone="info">{t("credits.dialog.serverHandles")}</Notice>}
        {error && (
          <Notice tone="error">
            {error}
          </Notice>
        )}
      </div>
    </Modal>
  );
}
