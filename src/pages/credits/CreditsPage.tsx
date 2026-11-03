import { useCallback, useEffect, useState } from "react";
import { AdminFreeNotice } from "../../components/app/AdminFreeBadge";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowDownLeft, ArrowUpRight, BadgePercent, Coins, Crown, History, Loader2, LockOpen, RefreshCw, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import { Chip, Notice, Panel, Slider, btn } from "../../components/app/ui";
import EmptyState from "../../components/app/EmptyState";
import { QueryError, SkeletonRows } from "../../components/app/QueryState";
import { useTransactions } from "../../api/queries";
import { Link } from "../../components/app/LocaleLink";
import { legalPath } from "../../config/legal";
import { PLANS_PATH } from "../../config/menu";
import { DEFAULT_ADDONS } from "../plans/planCore";

const ADDON_CREDITS = DEFAULT_ADDONS[0].credits;
import { notify } from "../../components/app/Toaster";
import { CREDIT_COST, packageSavings, pricePerCredit, type CreditFeature } from "../../config/pricing";
import { FREE_EXPORTS, FREE_SITES, MAX_DESIGNS } from "../../config/quota";
import { isBackendConfigured } from "../media/processing/apiConfig";
import {
  BillingUnavailableError,
  ensureBilling,
  refreshBilling,
  startCheckout,
  unlockFeature,
  useBilling,
  verifyCheckout,
  type CreditTransaction,
} from "../media/processing/billing";
import { isServerConfigured } from "../media/processing/serverClient";
import {
  DATA_SERVER_FEATURES,
  MEDIA_SERVER_FEATURES,
  VR_SERVER_FEATURES,
  accessState,
  costOf,
  featureName,
  formatCredits,
  formatMoney,
  packCostPerUse,
  tierNote,
  unitName,
  usesForCredits,
  type ServerFeatureId,
} from "../media/processing/pricing";
import { AccessChip } from "../media/components/FeatureAccess";
import { currentLang, LANG_LABEL } from "../../i18n";

/* ================================================================== */
/* Halaman Credits: saldo, paket bertingkat, tarif fitur, riwayat.      */
/* Semua angka saldo/riwayat berasal dari backend. Tanpa backend,       */
/* halaman menjelaskan dengan jujur bahwa pembayaran belum tersedia     */
/* dan TIDAK membuat transaksi apa pun.                                 */
/* ================================================================== */

/** Fitur Web Maker yang bertarif tetap (urutan tampilan). */
const WEB_FEATURES: CreditFeature[] = ["export", "site-slot", "premium-template", "premium-preset", "premium-element"];

type TxState = { status: "idle" | "loading" | "ready" | "error" | "unavailable"; items: CreditTransaction[]; error?: unknown };

function Wallet_({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useTranslation();
  const { account, status, error } = useBilling();
  return (
    <div className="min-w-[240px] rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur dark:border-gray-700 dark:bg-gray-900/60" data-testid="wallet">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        <Wallet className="h-3.5 w-3.5" /> {t("creditsPage.wallet.title")}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white" data-testid="wallet-balance">
        {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" aria-label={t("common.loading")} /> : account ? formatCredits(account.balance) : "—"}
      </p>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
        {account
          ? t("creditsPage.wallet.items", { count: account.items.length })
          : status === "error"
            ? error
            : status === "unavailable"
              ? t("creditsPage.wallet.unavailable")
              : t("creditsPage.wallet.notLoaded")}
      </p>
      <button type="button" onClick={onRefresh} className={`${btn.ghost} mt-2 !px-0 text-xs`} data-testid="wallet-refresh">
        <RefreshCw className="h-3.5 w-3.5" /> {t("creditsPage.wallet.refresh")}
      </button>
    </div>
  );
}

export default function CreditsPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const focus = (params.get("feature") ?? params.get("fitur")) as ServerFeatureId | null;
  const { account, pricing, pricingSource, packages, packagesSource } = useBilling();
  const [alert, setAlert] = useState<{ tone: "warn" | "error" | "info" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [calc, setCalc] = useState(50);
  const backend = isBackendConfigured();
  const locale = LANG_LABEL[currentLang()].locale;

  // Riwayat transaksi lewat TanStack Query: cache 30 detik, dimuat ulang
  // otomatis setelah pembelian (invalidateQueries di billing.ts).
  const txQuery = useTransactions(50, backend);
  const tx: TxState = !backend
    ? { status: "unavailable", items: [] }
    : txQuery.isPending
      ? { status: "loading", items: [] }
      : txQuery.isError
        ? { status: "error", items: [], error: txQuery.error }
        : { status: "ready", items: txQuery.data ?? [] };
  const loadTx = useCallback(() => void txQuery.refetch(), [txQuery]);

  const refresh = useCallback(() => {
    void refreshBilling();
    void txQuery.refetch();
  }, [txQuery]);

  // Saat halaman dibuka: pakai data yang masih segar, muat bila basi.
  useEffect(() => {
    void ensureBilling();
  }, []);

  // Kembali dari payment gateway: status DIVERIFIKASI ke backend, bukan dari URL.
  const session = params.get("session");
  useEffect(() => {
    if (!session) return;
    setAlert({ tone: "info", text: t("creditsPage.checkout.verifying") });
    verifyCheckout(session)
      .then((s) => {
        setAlert(
          s === "paid"
            ? { tone: "success", text: t("creditsPage.checkout.paid") }
            : s === "pending"
              ? { tone: "info", text: t("creditsPage.checkout.pending") }
              : { tone: "error", text: t("creditsPage.checkout.failed") },
        );
        if (s === "paid") void loadTx();
      })
      .catch((e) => setAlert({ tone: "warn", text: e instanceof BillingUnavailableError ? t("creditsPage.checkout.cannotVerify") : e instanceof Error ? e.message : t("errors.unknown") }))
      .finally(() => {
        // Hapus ?session dari URL agar refresh tidak memverifikasi ulang.
        const next = new URLSearchParams(params);
        next.delete("session");
        setParams(next, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const buy = async (id: string) => {
    if (busy) return;
    setAlert(null);
    setBusy(id);
    try {
      const url = await startCheckout(id, `${window.location.origin}${window.location.pathname}`);
      window.location.assign(url);
    } catch (e) {
      setAlert({ tone: "warn", text: e instanceof Error ? e.message : t("errors.unknown") });
    } finally {
      setBusy(null);
    }
  };

  const unlock = async (f: ServerFeatureId) => {
    if (busy) return;
    setAlert(null);
    setBusy(`unlock-${f}`);
    try {
      await unlockFeature(f);
      notify.success(t("creditsPage.features.unlocked", { name: featureName(f) }));
    } catch (e) {
      setAlert({ tone: "warn", text: e instanceof Error ? e.message : t("errors.unknown") });
    } finally {
      setBusy(null);
    }
  };

  const serverRows = (ids: ServerFeatureId[]) =>
    ids.map((id) => {
      const p = pricing[id];
      const ent = account?.entitlements[id];
      const st = accessState(p, { serverAvailable: isServerConfigured(id), account });
      const note = tierNote(p);
      return (
        <tr key={id} className={`align-top ${focus === id ? "bg-brand-50/70 dark:bg-brand-500/10" : ""}`} data-testid={`price-${id}`}>
          <td className="px-4 py-3">
            <p className="font-semibold text-gray-800 dark:text-white/90">{featureName(id)}</p>
            <p className="text-xs text-gray-500">{t("creditsPage.features.per", { unit: unitName(p.unit) })}</p>
          </td>
          <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
            {p.inPlan ? (
              <>
                <Chip tone="blue">{t("creditsPage.features.inPlan")}</Chip>
                <span className="mt-1 block text-[11px] text-gray-500">{t("creditsPage.features.inPlanHint")}</span>
              </>
            ) : (
              <>
                {formatCredits(costOf(p))}
                {note && <span className="block text-[11px] text-gray-500">{note}</span>}
              </>
            )}
          </td>
          <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
            {p.inPlan ? (
              ent && ent.packUses > 0 ? <span className="text-[11px] text-gray-500">{t("access.usesLeft", { n: ent.packUses })}</span> : <span className="text-xs text-gray-500">—</span>
            ) : p.unlockRequired ? (
              <>
                {formatCredits(p.packPrice)} → {p.usesPerCredit}×
                <span className="block text-[11px] text-gray-500">{t("access.perUseApprox", { cost: formatCredits(packCostPerUse(p)) })}</span>
                {ent && <span className="block text-[11px] text-gray-500">{t("access.usesLeft", { n: ent.packUses })}</span>}
              </>
            ) : (
              <span className="text-xs text-gray-500">{t("creditsPage.features.noPack")}</span>
            )}
          </td>
          <td className="px-4 py-3">
            <AccessChip state={st} />
          </td>
          <td className="px-4 py-3 text-right">
            {p.inPlan ? (
              <Link to={PLANS_PATH} className={`${btn.secondary} !py-1.5 text-xs`} data-testid={`plans-${id}`}>
                <Crown className="h-3.5 w-3.5" /> {t("creditsPage.features.seePlans")}
              </Link>
            ) : p.unlockRequired && (
              <button type="button" onClick={() => unlock(id)} disabled={busy !== null} className={`${btn.secondary} !py-1.5 text-xs`} data-testid={`unlock-${id}`}>
                {busy === `unlock-${id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LockOpen className="h-3.5 w-3.5" />}
                {ent?.unlocked ? t("creditsPage.features.addPack") : t("creditsPage.features.unlock")}
              </button>
            )}
          </td>
        </tr>
      );
    });

  const best = packages.reduce((a, b) => (pricePerCredit(b) < pricePerCredit(a) ? b : a), packages[0]);

  return (
    <>
      <AppMeta title={t("creditsPage.metaTitle")} description={t("creditsPage.metaDescription")} />
      <div className="flex flex-col gap-5" data-testid="credits-page">
        <PageHeader
          icon={Coins}
          tileClassName="bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
          title={t("creditsPage.title")}
          description={t("creditsPage.description")}
          crumbs={[{ label: t("nav.dashboard"), to: "/" }, { label: t("nav.credits") }]}
          help="credits"
          chips={
            <>
              <Chip tone={pricingSource === "server" && packagesSource === "server" ? "green" : "amber"}>
                {pricingSource === "server" && packagesSource === "server" ? t("creditsPage.chips.serverPrices") : t("creditsPage.chips.samplePrices")}
              </Chip>
              {!backend && <Chip tone="rose">{t("creditsPage.chips.noBackend")}</Chip>}
            </>
          }
          actions={<Wallet_ onRefresh={refresh} />}
        />

        <AdminFreeNotice />
        {!backend && <Notice tone="warn" title={t("creditsPage.noBackendTitle")}>{t("errors.billingUnavailable")}</Notice>}
        {alert && (
          <Notice tone={alert.tone} onDismiss={() => setAlert(null)} testId="billing-alert">
            {alert.text}
          </Notice>
        )}

        <Notice tone="info" title={t("creditsPage.plansBanner.title")} testId="plans-banner">
          {t("creditsPage.plansBanner.text")}{" "}
          <Link to={PLANS_PATH} className="font-semibold underline">
            {t("creditsPage.plansBanner.cta")}
          </Link>
        </Notice>

        {/* Paket kredit bertingkat */}
        <Panel title={t("creditsPage.packages.title")} description={t("creditsPage.packages.description", { best: formatMoney(pricePerCredit(best)) })}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5" data-testid="packages">
            {packages.map((pk) => {
              const save = packageSavings(pk, packages);
              const rb = Math.floor(pk.credits / ADDON_CREDITS);
              return (
                <li
                  key={pk.id}
                  data-testid={`package-${pk.id}`}
                  className={`relative flex flex-col rounded-2xl border p-4 transition ${
                    pk.highlight ? "border-brand-500 bg-brand-25 ring-1 ring-brand-500 dark:bg-brand-500/5" : "border-gray-200 hover:border-brand-200 dark:border-gray-700"
                  }`}
                >
                  <div className="mb-2 flex min-h-5 flex-wrap gap-1">
                    {pk.highlight && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        <Sparkles className="h-3 w-3" /> {t("creditsPage.packages.popular")}
                      </span>
                    )}
                    {pk.id === best.id && !pk.highlight && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">{t("creditsPage.packages.bestValue")}</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCredits(pk.credits)}</p>
                  <p className="mt-0.5 text-lg font-semibold text-gray-700 dark:text-gray-200">{formatMoney(pk.priceIdr)}</p>
                  <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400" data-testid="per-credit">
                    {t("creditsPage.packages.perCredit", { price: formatMoney(pricePerCredit(pk)) })}
                  </p>
                  <p className="mt-2 min-h-5 text-xs" data-testid="savings">
                    {save.percent > 0 ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                        <BadgePercent className="h-3.5 w-3.5" />
                        {t("creditsPage.packages.save", { percent: save.percent, amount: formatMoney(save.idr), list: formatMoney(save.listIdr) })}
                      </span>
                    ) : (
                      <span className="text-gray-400">{t("creditsPage.packages.basePrice")}</span>
                    )}
                  </p>
                  <p className="mt-2 flex-1 text-xs text-gray-500 dark:text-gray-400">{t("creditsPage.packages.example", { n: rb })}</p>
                  <button
                    type="button"
                    onClick={() => buy(pk.id)}
                    disabled={busy !== null}
                    className={`${pk.highlight ? btn.primary : btn.secondary} mt-3 w-full`}
                    data-testid={`buy-${pk.id}`}
                  >
                    {busy === pk.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />} {t("creditsPage.packages.buy", { price: formatMoney(pk.priceIdr) })}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" /> {t("creditsPage.packages.secure")}
          </p>
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400" data-testid="buy-legal">
            {t("legal.buyNote.before")}{" "}
            <Link to={legalPath("terms")} target="_blank" className="underline">
              {t("legal.docs.terms")}
            </Link>{" "}
            {t("legal.consent.and")}{" "}
            <Link to={legalPath("refund")} target="_blank" className="underline">
              {t("legal.docs.refund")}
            </Link>
            {t("legal.buyNote.after")}
          </p>
        </Panel>

        {/* Biaya fitur Web Maker */}
        <Panel title={t("creditsPage.web.title")} description={t("creditsPage.web.description", { sites: FREE_SITES, designs: MAX_DESIGNS, exports: FREE_EXPORTS })}>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" data-testid="web-pricing">
            {WEB_FEATURES.map((f) => (
              <li key={f} className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 px-3 py-2.5 dark:border-gray-800">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{t(`creditsPage.web.items.${f}.name`)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t(`creditsPage.web.items.${f}.hint`, { sites: FREE_SITES, exports: FREE_EXPORTS })}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                  {formatCredits(CREDIT_COST[f] ?? 0)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Tarif fitur server: Media & Data */}
        <Panel title={t("creditsPage.features.title")} description={t("creditsPage.features.description")} bodyClassName="p-0">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm" data-testid="feature-pricing">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-white/5 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("creditsPage.features.colFeature")}</th>
                  <th className="px-4 py-3 font-semibold">{t("creditsPage.features.colCost")}</th>
                  <th className="px-4 py-3 font-semibold">{t("creditsPage.features.colPack")}</th>
                  <th className="px-4 py-3 font-semibold">{t("creditsPage.features.colStatus")}</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">{t("creditsPage.features.colAction")}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr>
                  <th colSpan={5} scope="colgroup" className="bg-gray-50/60 px-4 py-2 text-xs font-semibold text-gray-600 dark:bg-white/[0.02] dark:text-gray-300">
                    {t("nav.sections.media.name")}
                  </th>
                </tr>
                {serverRows(MEDIA_SERVER_FEATURES)}
                <tr>
                  <th colSpan={5} scope="colgroup" className="bg-gray-50/60 px-4 py-2 text-xs font-semibold text-gray-600 dark:bg-white/[0.02] dark:text-gray-300">
                    {t("nav.sections.data.name")}
                  </th>
                </tr>
                {serverRows(DATA_SERVER_FEATURES)}
                <tr>
                  <th colSpan={5} scope="colgroup" className="bg-gray-50/60 px-4 py-2 text-xs font-semibold text-gray-600 dark:bg-white/[0.02] dark:text-gray-300">
                    {t("nav.sections.vr.name")}
                  </th>
                </tr>
                {serverRows(VR_SERVER_FEATURES)}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          {/* Riwayat transaksi */}
          <Panel
            title={t("creditsPage.history.title")}
            description={t("creditsPage.history.description")}
            actions={
              tx.status !== "unavailable" && (
                <button type="button" onClick={() => loadTx()} className={`${btn.ghost} text-xs`} disabled={txQuery.isFetching}>
                  <RefreshCw className={`h-3.5 w-3.5 ${txQuery.isFetching ? "animate-spin" : ""}`} /> {t("creditsPage.wallet.refresh")}
                </button>
              )
            }
            bodyClassName="p-0"
          >
            <div data-testid="history">
              {tx.status === "unavailable" && <EmptyState icon={History} title={t("creditsPage.history.unavailableTitle")} text={t("creditsPage.history.unavailable")} />}
              {(tx.status === "loading" || tx.status === "idle") && <SkeletonRows rows={4} testId="history-loading" />}
              {tx.status === "error" && (
                <div className="p-4">
                  <QueryError error={tx.error} title={t("creditsPage.history.error")} onRetry={loadTx} retrying={txQuery.isFetching} testId="history-error" />
                </div>
              )}
              {tx.status === "ready" && tx.items.length === 0 && <EmptyState icon={History} title={t("creditsPage.history.emptyTitle")} text={t("creditsPage.history.empty")} />}
              {tx.status === "ready" && tx.items.length > 0 && (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {tx.items.map((it) => (
                    <li key={it.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          it.credits >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                        }`}
                      >
                        {it.credits >= 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800 dark:text-white/90">{it.description || t(`creditsPage.history.types.${it.type}`)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(it.createdAt).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" })}
                          {it.status && it.status !== "completed" && ` · ${t(`creditsPage.history.status.${it.status}`)}`}
                          {it.amountIdr !== undefined && ` · ${formatMoney(it.amountIdr)}`}
                          {it.paymentId && it.invoiceNumber && (
                            <>
                              {" · "}
                              <Link to={`/invoice/${it.paymentId}`} className="text-brand-600 hover:underline dark:text-brand-400" data-testid="history-invoice">
                                {it.invoiceNumber}
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                      <span className={`shrink-0 font-mono text-sm font-semibold ${it.credits >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-gray-700 dark:text-gray-200"}`}>
                        {it.credits >= 0 ? "+" : "−"}
                        {formatCredits(Math.abs(it.credits))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Panel>

          <div className="flex flex-col gap-5">
            <Panel title={t("creditsPage.calc.title")} description={t("creditsPage.calc.description")}>
              <Slider label={t("creditsPage.calc.label")} value={calc} min={1} max={100} onChange={setCalc} format={(v) => formatCredits(v)} />
              <ul className="mt-4 flex flex-col divide-y divide-gray-100 text-sm dark:divide-gray-800" data-testid="calculator">
                {[...MEDIA_SERVER_FEATURES, ...DATA_SERVER_FEATURES, ...VR_SERVER_FEATURES].filter((f) => !pricing[f].inPlan).map((f) => {
                  const u = usesForCredits(pricing[f], calc);
                  return (
                    <li key={f} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <span className="font-medium text-gray-700 dark:text-gray-200">{featureName(f)}</span>
                      <span className="text-gray-600 dark:text-gray-300">{t("creditsPage.calc.uses", { n: u.payPerUse, unit: unitName(pricing[f].unit) })}</span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <Panel title={t("creditsPage.how.title")}>
              <ul className="flex list-disc flex-col gap-2 pl-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                {(t("creditsPage.how.items", { returnObjects: true }) as string[]).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}

