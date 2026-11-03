import { useState } from "react";
import { useAdminFree } from "../../components/app/AdminFreeBadge";
import { useTranslation } from "react-i18next";
import { Coins, ExternalLink, Loader2, ShoppingCart } from "lucide-react";
import Modal from "../../components/app/Modal";
import { Link } from "../../components/app/LocaleLink";
import { Notice, btn } from "../../components/app/ui";
import { notify } from "../../components/app/Toaster";
import { CREDITS_PATH } from "../../config/menu";
import { useMarketAccount } from "../hooks";
import type { CatalogSnapshot } from "../repository";
import { commerceService } from "../services";
import type { TemplateCatalogItem } from "../types";
import IncludedItems from "./IncludedItems";
import { promoPrice } from "../promo";
import { PromoCountdown, PromoPriceTag } from "./Promo";

/**
 * Konfirmasi pembelian template Premium dengan kredit akun (server).
 * Menampilkan harga, saldo, dan item Premium bawaan sebelum membeli.
 */
export default function TemplatePurchaseDialog({
  tpl,
  catalog,
  onClose,
  onPurchased,
}: {
  tpl: TemplateCatalogItem;
  catalog: CatalogSnapshot;
  onClose: () => void;
  onPurchased?: () => void;
}) {
  const { t } = useTranslation();
  const balance = useMarketAccount().balance;
  const [busy, setBusy] = useState(false);
  const price = promoPrice(tpl.price).price;
  const adminFree = useAdminFree();
  const enough = adminFree || balance >= price;

  const buy = async () => {
    if (busy) return;
    setBusy(true);
    const r = await commerceService.purchaseTemplate(tpl);
    setBusy(false);
    if (!r.ok && r.error !== "already-owned") {
      notify.error(r.message ?? t(`market.errors.${r.error}`));
      return;
    }
    notify.success(tpl.code ? t("market.toast.codeTemplateUnlocked", { name: tpl.name }) : t("market.toast.templateUnlocked", { name: tpl.name, count: tpl.premiumItemIds.length }));
    onClose();
    onPurchased?.();
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="md"
      testId="template-purchase"
      icon={<ShoppingCart className="h-5 w-5" />}
      title={t("market.purchase.title", { name: tpl.name })}
      description={t(tpl.code ? "market.purchase.codeText" : "market.purchase.text")}
      footer={
        <>
          <button type="button" onClick={onClose} className={btn.secondary}>
            {t("common.cancel")}
          </button>
          {enough ? (
            <button type="button" onClick={buy} disabled={busy} className={btn.primary} data-testid="template-purchase-confirm">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />} {t("market.purchase.buy", { count: price })}
            </button>
          ) : (
            <Link to={CREDITS_PATH} onClick={onClose} className={btn.primary}>
              <ExternalLink className="h-4 w-4" /> {t("market.buyCredits")}
            </Link>
          )}
        </>
      }
    >
      <dl className="mb-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">{t("credits.dialog.cost")}</dt>
          <dd className="text-right">
            <PromoPriceTag price={tpl.price} testId="purchase-price" />
          </dd>
        </div>
        {promoPrice(tpl.price).active && (
          <div className="flex justify-between gap-3 text-rose-700 dark:text-rose-300">
            <dt>{t("promo.endsIn")}</dt>
            <dd>
              <PromoCountdown className="text-xs font-semibold" />
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">{t("market.balance")}</dt>
          <dd className="font-semibold text-gray-800 dark:text-gray-100">{t("market.credits", { count: balance })}</dd>
        </div>
      </dl>
      {/* Template Kode (v21.2): satu berkas HTML, tanpa section/elemen Page Maker bawaan. */}
      {!tpl.code && <IncludedItems tpl={tpl} catalog={catalog} compact />}
      <div className="mt-3 space-y-2">
        {!tpl.code && <Notice tone="info">{t("market.included.scope")}</Notice>}
        {!enough && <Notice tone="warn">{t("credits.dialog.insufficient")}</Notice>}
      </div>
    </Modal>
  );
}
