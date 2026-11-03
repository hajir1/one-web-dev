import { useTranslation } from "react-i18next";
import { BadgePercent, Timer } from "lucide-react";
import { promoEndsAt, promoPrice, promoRemaining } from "../promo";
import { usePromoNow } from "./promoClock";
import { isDemoMode } from "../../demo/demoMode";

const pad = (n: number) => String(n).padStart(2, "0");

/** Sisa waktu promo: "12h 05:31:09" (hari, jam:menit:detik). */
export function PromoCountdown({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const r = promoRemaining(usePromoNow());
  if (r.ended) return null;
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${className}`} data-testid="promo-countdown" role="timer" aria-label={t("promo.remainingAria", { days: r.days, hours: r.hours, minutes: r.minutes })}>
      <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {t("promo.remaining", { days: r.days, time: `${pad(r.hours)}:${pad(r.minutes)}:${pad(r.seconds)}` })}
    </span>
  );
}

/** Pita promo di atas katalog/detail: diskon + tanggal berakhir + countdown. */
export function PromoBanner() {
  const { t, i18n } = useTranslation();
  const now = usePromoNow();
  // Mode demo (v12): tanpa harga → tanpa pita promo.
  if (promoRemaining(now).ended || isDemoMode()) return null;
  const until = new Intl.DateTimeFormat(i18n.language, { dateStyle: "long" }).format(promoEndsAt());
  return (
    <section
      className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 px-4 py-3 text-white shadow-sm"
      aria-label={t("promo.title", { percent: promoPrice(10, now).percentOff })}
      data-testid="promo-banner"
    >
      <span className="inline-flex items-center gap-2 text-sm font-bold">
        <BadgePercent className="h-5 w-5 shrink-0" aria-hidden="true" />
        {t("promo.title", { percent: promoPrice(10, now).percentOff })}
      </span>
      <span className="min-w-0 flex-1 text-xs text-rose-50 sm:text-sm">{t("promo.text", { date: until })}</span>
      <PromoCountdown className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold sm:text-sm" />
    </section>
  );
}

/** Harga template: harga awal dicoret + harga promo (Free tetap "Gratis"). */
export function PromoPriceTag({ price, testId, size = "sm" }: { price: number; testId?: string; size?: "sm" | "lg" }) {
  const { t } = useTranslation();
  const p = promoPrice(price, usePromoNow());
  const big = size === "lg";
  if (price === 0) {
    return (
      <span className={`font-bold text-emerald-700 dark:text-emerald-400 ${big ? "text-base" : "text-sm"}`} data-testid={testId}>
        {t("market.credits", { count: 0 })}
      </span>
    );
  }
  return (
    <span className={`inline-flex flex-wrap items-baseline justify-end gap-x-1.5 ${big ? "text-base" : "text-sm"}`} data-testid={testId} data-promo={p.active ? "active" : "off"}>
      {p.active && (
        <>
          <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">-{p.percentOff}%</span>
          <s className="text-xs text-gray-400 dark:text-gray-500" aria-label={t("promo.originalAria", { count: p.original })}>
            {p.original}
          </s>
        </>
      )}
      <span className="font-bold text-gray-900 dark:text-white">{t("market.credits", { count: p.price })}</span>
    </span>
  );
}
