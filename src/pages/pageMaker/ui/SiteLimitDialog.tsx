import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Coins, FolderX, Trash2 } from "lucide-react";
import Modal from "../../../components/app/Modal";
import { Notice, btn } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import { Link } from "../../../components/app/LocaleLink";
import { MARKET_PATH } from "../../../config/menu";
import { SITE_PACKAGES } from "../../../config/marketplace";
import { useMarketAccount, useSiteLimit } from "../../../marketplace/hooks";
import { commerceService } from "../../../marketplace/services";
import { isDemoMode } from "../../../demo/demoMode";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import { SITE_TYPE, normalizeSiteDoc } from "../helpers/site";
import { useSiteLimitDialog } from "../helpers/siteQuota";

const NONE: SavedDesign[] = [];

/**
 * The "website quota full" dialog with two options:
 *  1. Pay: unlock 1 website slot (or a cheaper pack in Web Market).
 *  2. Delete an old website: the user chooses; every delete is confirmed.
 *     Its page designs stay saved in My Designs.
 * Once there is enough space, "Continue" runs the pending action.
 */
export default function SiteLimitDialog() {
  const { t, i18n } = useTranslation();
  const request = useSiteLimitDialog((s) => s.request);
  const close = useSiteLimitDialog((s) => s.close);
  const sites = useDesignStore((s) => s.designs[SITE_TYPE]) ?? NONE;
  const deleteDesign = useDesignStore((s) => s.deleteDesign);
  const limit = useSiteLimit();
  const balance = useMarketAccount().balance;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const single = SITE_PACKAGES.reduce((a, b) => (b.sites < a.sites ? b : a));
  const ordered = useMemo(() => [...sites].sort((a, b) => a.updatedAt - b.updatedAt), [sites]);
  if (!request) return null;

  const room = sites.length < limit;
  const fmt = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" });

  const onClose = () => {
    setConfirmId(null);
    close();
  };
  const proceed = (paid = false) => {
    const run = request.onRoom;
    onClose();
    run?.(paid);
  };

  const remove = (s: SavedDesign) => {
    deleteDesign(SITE_TYPE, s.id);
    setConfirmId(null);
    notify.success(t("siteLimit.deleted", { name: s.name }));
  };

  const demo = isDemoMode();
  const pay = async () => {
    if (busy) return;
    setBusy(true);
    const r = await commerceService.purchaseSites(single.sites);
    setBusy(false);
    if (r.ok) notify.success(t("market.toast.sitesAdded", { count: single.sites }));
    else notify.error(t(`market.errors.${r.error}`));
  };

  return (
    <Modal
      open
      alert
      onClose={onClose}
      size="md"
      testId="site-limit"
      icon={<FolderX className="h-5 w-5" />}
      title={t("siteLimit.title", { max: limit })}
      description={demo ? t(`demo.siteLimit.reason.${request.reason}`, { max: limit, label: request.label ?? "" }) : t(`siteLimit.reason.${request.reason}`, { max: limit, label: request.label ?? "" })}
      footer={
        <>
          <button type="button" onClick={onClose} className={btn.secondary}>
            {t("common.close")}
          </button>
          {request.onRoom && (
            <button type="button" onClick={() => proceed()} disabled={!room} className={btn.primary} data-testid="site-limit-continue">
              {t("siteLimit.continue")} <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200" data-testid="site-limit-count">
          {t("siteLimit.usage", { current: sites.length, max: limit })}
        </p>
        {room ? <Notice tone="success">{t("siteLimit.roomOk")}</Notice> : <Notice tone="warn">{t(demo ? "demo.siteLimit.choose" : "siteLimit.choose", { max: limit })}</Notice>}

        {/* Demo mode (v12): no slot payment; the only way = delete an old website. */}
        {!demo && (
          <section className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-500/20 dark:bg-blue-500/10" data-testid="site-limit-pay" aria-labelledby="site-limit-pay-title">
            <h3 id="site-limit-pay-title" className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {t("siteLimit.payTitle")}
            </h3>
            <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
              {t("siteLimit.payText", { credits: single.credits, balance })}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button type="button" onClick={pay} disabled={room || busy || balance < single.credits} className={`${btn.primary} !px-3 !py-1.5 text-xs`} data-testid="site-limit-buy">
                <Coins className="h-3.5 w-3.5" /> {t("siteLimit.payButton", { credits: single.credits })}
              </button>
              <Link to={MARKET_PATH} onClick={onClose} className="text-xs font-semibold text-blue-700 underline dark:text-blue-300">
                {t("siteLimit.morePacks")}
              </Link>
            </div>
          </section>
        )}

        <section aria-labelledby="site-limit-delete-title">
          <h3 id="site-limit-delete-title" className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {t(demo ? "demo.siteLimit.deleteTitle" : "siteLimit.deleteTitle")}
          </h3>
          <p className="mb-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t("siteLimit.deleteText")}</p>
          <ul className="max-h-60 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800" data-testid="site-limit-list">
            {ordered.map((s) => {
              const confirming = confirmId === s.id;
              const pages = normalizeSiteDoc(s.state).pages.length;
              return (
                <li key={s.id} className="flex flex-wrap items-center gap-2 px-3 py-2.5 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-800 dark:text-gray-100">{s.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("siteLimit.meta", { count: pages, date: fmt.format(s.updatedAt) })}
                    </p>
                  </div>
                  {confirming ? (
                    <div className="flex w-full flex-col gap-2 rounded-lg bg-rose-50 p-2 sm:w-auto sm:flex-row sm:items-center dark:bg-rose-500/10">
                      <span className="text-xs text-rose-700 dark:text-rose-300">{t("siteLimit.confirm")}</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => remove(s)} className={`${btn.danger} !px-2.5 !py-1 text-xs`} data-testid={`site-delete-yes-${s.id}`}>
                          {t("common.delete")}
                        </button>
                        <button type="button" onClick={() => setConfirmId(null)} className={`${btn.ghost} !px-2.5 !py-1 text-xs`}>
                          {t("common.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(s.id)}
                      className={`${btn.ghost} !px-2.5 !py-1 text-xs text-rose-600 dark:text-rose-400`}
                      aria-label={t("siteLimit.deleteAria", { name: s.name })}
                      data-testid={`site-delete-${s.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> {t("common.delete")}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </Modal>
  );
}
