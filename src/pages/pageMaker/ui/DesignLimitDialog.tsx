import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ArrowRight, PackagePlus, Trash2 } from "lucide-react";
import Modal from "../../../components/app/Modal";
import { Notice, btn } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import { designCapacity } from "../../../config/quota";
import { Link } from "../../../components/app/LocaleLink";
import { MARKET_PATH } from "../../../config/menu";
import { useMaxDesigns, useMarketAccount } from "../../../marketplace/hooks";
import { smallestPack } from "../../../marketplace/pricing";
import { commerceService } from "../../../marketplace/services";
import { isDemoMode } from "../../../demo/demoMode";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import { PAGE_DESIGN_TYPE, SITE_TYPE } from "../helpers/site";
import { designUsage, useDesignLimit } from "../helpers/designQuota";

const NONE: SavedDesign[] = [];

/**
 * The "design limit reached" dialog. Shows existing designs (oldest first)
 * so the USER chooses what to delete; every delete needs confirmation.
 * Nothing is deleted automatically. Once there is enough space, the "Continue" button
 * runs the pending action.
 */
export default function DesignLimitDialog() {
  const { t, i18n } = useTranslation();
  const request = useDesignLimit((s) => s.request);
  const close = useDesignLimit((s) => s.close);
  const designs = useDesignStore((s) => s.designs[PAGE_DESIGN_TYPE]) ?? NONE;
  const sites = useDesignStore((s) => s.designs[SITE_TYPE]) ?? NONE;
  const deleteDesign = useDesignStore((s) => s.deleteDesign);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const MAX_DESIGNS = useMaxDesigns();
  const balance = useMarketAccount().balance;
  const pack = smallestPack();

  const usage = useMemo(() => designUsage(sites), [sites]);
  const ordered = useMemo(() => [...designs].sort((a, b) => a.updatedAt - b.updatedAt), [designs]);
  if (!request) return null;

  const cap = designCapacity(designs.length, request.adding, MAX_DESIGNS);
  const fmt = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" });

  const remove = (d: SavedDesign) => {
    deleteDesign(PAGE_DESIGN_TYPE, d.id);
    setConfirmId(null);
    notify.success(t("designLimit.deleted", { name: d.name }));
  };

  const proceed = () => {
    const run = request.onRoom;
    close();
    setConfirmId(null);
    run?.();
  };

  /** Alternative to deleting: buy 1 design pack (simulated) — the quota grows immediately. */
  const buyPack = async () => {
    const r = await commerceService.purchaseDesigns(pack.designs);
    if (r.ok) notify.success(t("market.toast.designsAdded", { count: pack.designs }));
    else notify.error(t(`market.errors.${r.error}`));
  };

  const onClose = () => {
    setConfirmId(null);
    close();
  };

  return (
    <Modal
      open
      alert
      onClose={onClose}
      size="md"
      testId="design-limit"
      icon={<AlertTriangle className="h-5 w-5" />}
      title={t("designLimit.title", { max: MAX_DESIGNS })}
      description={t(`designLimit.reason.${request.reason}`, { count: request.adding, max: MAX_DESIGNS, label: request.label ?? "" })}
      footer={
        <>
          <button type="button" onClick={onClose} className={btn.secondary}>
            {t("common.close")}
          </button>
          {request.onRoom && (
            <button type="button" onClick={proceed} disabled={!cap.ok} className={btn.primary} data-testid="design-limit-continue">
              {t("designLimit.continue")} <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200" data-testid="design-limit-count">
          {t("designLimit.usage", { current: designs.length, max: MAX_DESIGNS })}
        </p>
        {cap.ok ? (
          <Notice tone="success">{t("designLimit.roomOk")}</Notice>
        ) : (
          <Notice tone="warn">{t("designLimit.mustDelete", { count: cap.mustDelete })}</Notice>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("designLimit.noAutoDelete")}</p>
        {/* Demo mode (v12): no design pack purchases. */}
        {!cap.ok && !isDemoMode() && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-2.5 text-xs dark:border-blue-500/20 dark:bg-blue-500/10" data-testid="design-limit-pack">
            <span className="min-w-0 flex-1 text-gray-700 dark:text-gray-200">{t("market.limit.orBuy", { designs: pack.designs, credits: pack.credits, balance })}</span>
            <button type="button" onClick={buyPack} disabled={balance < pack.credits} className={`${btn.primary} !px-2.5 !py-1 text-xs`} data-testid="design-limit-buy">
              <PackagePlus className="h-3.5 w-3.5" /> {t("market.limit.buy", { designs: pack.designs })}
            </button>
            <Link to={MARKET_PATH} onClick={onClose} className="font-semibold text-blue-700 underline dark:text-blue-300">
              {t("market.limit.more")}
            </Link>
          </div>
        )}
        <ul className="max-h-72 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800" data-testid="design-limit-list">
          {ordered.map((d) => {
            const used = usage[d.id] ?? [];
            const confirming = confirmId === d.id;
            return (
              <li key={d.id} className="flex flex-wrap items-center gap-2 px-3 py-2.5 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-800 dark:text-gray-100">{d.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("designLimit.updated", { date: fmt.format(d.updatedAt) })}
                    {used.length > 0 && <> · {t("designLimit.usedIn", { sites: used.join(", ") })}</>}
                  </p>
                </div>
                {confirming ? (
                  <div className="flex w-full flex-col gap-2 rounded-lg bg-rose-50 p-2 sm:w-auto sm:flex-row sm:items-center dark:bg-rose-500/10">
                    <span className="text-xs text-rose-700 dark:text-rose-300">
                      {used.length ? t("designLimit.confirmUsed", { count: used.length }) : t("designLimit.confirm")}
                    </span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => remove(d)} className={`${btn.danger} !px-2.5 !py-1 text-xs`} data-testid={`design-delete-yes-${d.id}`}>
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
                    onClick={() => setConfirmId(d.id)}
                    className={`${btn.ghost} !px-2.5 !py-1 text-xs text-rose-600 dark:text-rose-400`}
                    aria-label={t("designLimit.deleteAria", { name: d.name })}
                    data-testid={`design-delete-${d.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> {t("common.delete")}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
