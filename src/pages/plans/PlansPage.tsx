import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Check, Coins, CreditCard, Crown, Film, Gauge, Loader2, Plus, ShieldCheck, Sparkles, Users } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import Modal from "../../components/app/Modal";
import { Link } from "../../components/app/LocaleLink";
import { AdminFreeNotice } from "../../components/app/AdminFreeBadge";
import { notify } from "../../components/app/Toaster";
import { Chip, Notice, Panel, ProgressBar, Segmented, btn } from "../../components/app/ui";
import { useSession } from "../../auth/session";
import { currentLang, LANG_LABEL } from "../../i18n";
import { legalPath } from "../../config/legal";
import { isBackendConfigured } from "../media/processing/apiConfig";
import { BillingUnavailableError, ensureBilling, useBilling, verifyCheckout } from "../media/processing/billing";
import { formatCredits, formatMoney } from "../media/processing/pricing";
import {
  DEFAULT_CATALOG,
  buyAddon,
  buyPlanWithCredits,
  catalogQuery,
  formatBytes,
  formatRetention,
  minutes,
  perMonthWhenYearly,
  planKeys,
  planName,
  priceOf,
  quotePlan,
  startPlanCheckout,
  subscriptionQuery,
  type AddonId,
  type AddonSpec,
  type PaidPlanId,
  type PlanId,
  type PlanInterval,
  type PlanQuote,
  type PlanSpec,
  type PlanView,
} from "./plans";
import { queryClient } from "../../api/queryClient";

/* ================================================================== */
/* v11: /:lang/plans — paket langganan bulanan/tahunan Media & Data.     */
/* Harga, potongan naik paket, dan masa berlaku DIHITUNG BACKEND          */
/* (quote); halaman ini hanya menampilkan dan meneruskan pilihan.        */
/* ================================================================== */

const RANK: Record<PlanId, number> = { free: 0, basic: 1, pro: 2, team: 3 };

type Alert = { tone: "warn" | "error" | "info" | "success"; text: string };
type Choice = { plan: PaidPlanId; interval: PlanInterval };

const errText = (e: unknown, fallback: string) => (e instanceof Error && e.message ? e.message : fallback);

function Meter({ label, used, total, format, testId }: { label: string; used: number; total: number; format: (n: number) => string; testId: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 100;
  return (
    <div data-testid={testId}>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>
        <span className="font-mono text-gray-500 dark:text-gray-400">
          {format(used)} / {format(total)}
        </span>
      </div>
      <ProgressBar value={pct} label={label} />
    </div>
  );
}

function CurrentPlan({ view, title, addons, busy, onAddon, canBuy }: { view: PlanView; title: string; addons: AddonSpec[]; busy: string | null; onAddon: (a: AddonId) => void; canBuy: boolean }) {
  const { t } = useTranslation();
  const locale = LANG_LABEL[currentLang()].locale;
  const date = (s: string | null) => (s ? new Date(s).toLocaleDateString(locale, { dateStyle: "medium" }) : "—");
  return (
    <Panel
      title={title}
      description={
        view.active && view.expiresAt
          ? t("plans.current.activeUntil", { date: date(view.expiresAt), interval: t(`plans.interval.${view.interval ?? "month"}`) })
          : t("plans.current.freeHint")
      }
      actions={
        <Chip tone={view.active ? "green" : "gray"}>
          {view.scope === "team" && view.teamName ? `${planName(view.plan)} · ${view.teamName}` : planName(view.plan)}
        </Chip>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2" data-testid="plan-usage">
        <Meter label={t("plans.current.units")} used={view.units.used} total={view.units.limit + view.units.bonus} format={(n) => String(n)} testId="meter-units" />
        <Meter
          label={t("plans.current.video")}
          used={view.videoSeconds.used}
          total={view.videoSeconds.limit + view.videoSeconds.bonus}
          format={(n) => t("plans.min", { n: minutes(n) })}
          testId="meter-video"
        />
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {t("plans.current.window", { start: date(view.window.start), end: date(view.window.end) })}
        {(view.units.bonus > 0 || view.videoSeconds.bonus > 0) &&
          ` · ${[
            view.units.bonus > 0 && t("plans.current.bonusUnits", { n: view.units.bonus }),
            view.videoSeconds.bonus > 0 && t("plans.current.bonusVideo", { n: minutes(view.videoSeconds.bonus) }),
          ]
            .filter(Boolean)
            .join(", ")}`}
      </p>
      {canBuy && (
        <div className="mt-4 flex flex-wrap gap-2" data-testid="addons">
          {addons.map((a) => (
            <button key={a.id} type="button" className={`${btn.secondary} !py-1.5 text-xs`} disabled={busy !== null} onClick={() => onAddon(a.id)} data-testid={`addon-${a.id}`}>
              {busy === `addon-${a.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              {a.id === "units"
                ? t("plans.addon.units", { n: a.units, cost: formatCredits(a.credits) })
                : t("plans.addon.video", { n: minutes(a.videoSeconds), cost: formatCredits(a.credits) })}
            </button>
          ))}
        </div>
      )}
    </Panel>
  );
}

export default function PlansPage() {
  const { t } = useTranslation();
  const status = useSession((s) => s.status);
  const signedIn = status === "authenticated";
  const backend = isBackendConfigured();
  const [params, setParams] = useSearchParams();
  const [interval, setInterval_] = useState<PlanInterval>("month");
  const [alert, setAlert] = useState<Alert | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [quote, setQuote] = useState<{ status: "loading" | "ready" | "error"; data?: PlanQuote; error?: string }>({ status: "loading" });
  const balance = useBilling((s) => s.account?.balance ?? null);
  const locale = LANG_LABEL[currentLang()].locale;
  const date = (s: string) => new Date(s).toLocaleDateString(locale, { dateStyle: "medium" });

  const catalogQ = useQuery({ ...catalogQuery, enabled: backend });
  const catalog = catalogQ.data ?? DEFAULT_CATALOG;
  const subQ = useQuery({ ...subscriptionQuery, enabled: backend && signedIn });
  const summary = subQ.data ?? null;

  useEffect(() => {
    if (signedIn) void ensureBilling();
  }, [signedIn]);

  // Kembali dari Midtrans: status diverifikasi ke backend, bukan dari URL.
  const session = params.get("session");
  useEffect(() => {
    if (!session) return;
    setAlert({ tone: "info", text: t("creditsPage.checkout.verifying") });
    verifyCheckout(session)
      .then((s) => {
        setAlert(
          s === "paid"
            ? { tone: "success", text: t("plans.checkout.paid") }
            : s === "pending"
              ? { tone: "info", text: t("plans.checkout.pending") }
              : { tone: "error", text: t("creditsPage.checkout.failed") },
        );
        void queryClient.invalidateQueries({ queryKey: planKeys.subscription });
      })
      .catch((e) => setAlert({ tone: "warn", text: e instanceof BillingUnavailableError ? t("creditsPage.checkout.cannotVerify") : errText(e, t("errors.unknown")) }))
      .finally(() => {
        const next = new URLSearchParams(params);
        next.delete("session");
        setParams(next, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Harga final selalu dari backend (potongan sisa paket lama dihitung di sana).
  useEffect(() => {
    if (!choice) return;
    let live = true;
    setQuote({ status: "loading" });
    quotePlan(choice.plan, choice.interval, choice.plan === "team")
      .then((q) => live && setQuote({ status: "ready", data: q }))
      .catch((e) => live && setQuote({ status: "error", error: errText(e, t("errors.unknown")) }));
    return () => {
      live = false;
    };
  }, [choice, t]);

  const payCredits = async () => {
    if (!choice || busy) return;
    setBusy("credits");
    try {
      await buyPlanWithCredits(choice.plan, choice.interval, choice.plan === "team");
      notify.success(t("plans.checkout.activated", { plan: planName(choice.plan) }));
      setChoice(null);
    } catch (e) {
      setQuote((q) => ({ ...q, error: errText(e, t("errors.unknown")) }));
    } finally {
      setBusy(null);
    }
  };

  const payGateway = async () => {
    if (!choice || busy) return;
    setBusy("gateway");
    try {
      const url = await startPlanCheckout(choice.plan, choice.interval, choice.plan === "team", `${window.location.origin}${window.location.pathname}`);
      window.location.assign(url);
    } catch (e) {
      setQuote((q) => ({ ...q, error: errText(e, t("errors.unknown")) }));
      setBusy(null);
    }
  };

  const addon = async (a: AddonId) => {
    if (busy) return;
    setBusy(`addon-${a}`);
    setAlert(null);
    try {
      await buyAddon(a);
      notify.success(t("plans.addon.done"));
    } catch (e) {
      setAlert({ tone: "warn", text: errText(e, t("errors.unknown")) });
    } finally {
      setBusy(null);
    }
  };

  /** Status tombol kartu paket untuk akun ini. */
  const cardAction = (p: PlanSpec): { label: string; disabled: boolean; hint?: string; to?: string; current?: boolean } => {
    if (!signedIn) return { label: t("plans.card.signIn"), disabled: false, to: `/signin?next=${encodeURIComponent("/plans")}` };
    const personal = summary?.personal ?? null;
    if (p.id === "free") {
      const onFree = !personal?.active;
      return { label: onFree ? t("plans.card.current") : t("plans.card.freeAfter"), disabled: true, current: onFree };
    }
    if (p.id === "team") {
      const team = summary?.team ?? null;
      if (!team) return { label: t("plans.card.createTeam"), disabled: false, to: "/team", hint: t("plans.card.teamHint") };
      if (!team.canManage) return { label: t("plans.card.ownerOnly"), disabled: true, hint: t("plans.card.ownerOnlyHint", { team: team.teamName ?? "" }) };
      return stateFor(p.id, team);
    }
    return stateFor(p.id, personal);
  };

  const stateFor = (id: PaidPlanId, view: PlanView | null) => {
    const active = view?.active && view.paidPlan ? view.paidPlan : null;
    if (!active) return { label: t("plans.card.choose"), disabled: false };
    if (active === id) return { label: t("plans.card.renew"), disabled: false, current: true, hint: view?.expiresAt ? t("plans.card.renewHint", { date: date(view.expiresAt) }) : undefined };
    if (RANK[id] > RANK[active]) return { label: t("plans.card.upgrade"), disabled: false, hint: t("plans.card.upgradeHint") };
    return { label: t("plans.card.noDowngrade"), disabled: true, hint: view?.expiresAt ? t("plans.card.noDowngradeHint", { date: date(view.expiresAt) }) : undefined };
  };

  const q = quote.data;
  const canPayCredits = q && balance !== null && balance >= q.credits;

  return (
    <>
      <AppMeta title={t("plans.metaTitle")} description={t("plans.metaDescription")} />
      <div className="flex flex-col gap-5" data-testid="plans-page">
        <PageHeader
          icon={Crown}
          tileClassName="bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
          title={t("plans.title")}
          description={t("plans.description")}
          crumbs={[{ label: t("nav.dashboard"), to: "/" }, { label: t("nav.plans") }]}
          help="plans"
          chips={<Chip tone="green">{t("plans.chips.yearly", { percent: catalog.yearlyDiscountPercent })}</Chip>}
        />

        <AdminFreeNotice />
        {!backend && <Notice tone="warn" title={t("creditsPage.noBackendTitle")}>{t("errors.billingUnavailable")}</Notice>}
        {alert && (
          <Notice tone={alert.tone} onDismiss={() => setAlert(null)} testId="plans-alert">
            {alert.text}
          </Notice>
        )}
        {subQ.isError && <Notice tone="warn">{errText(subQ.error, t("errors.unknown"))}</Notice>}

        {summary && (
          <div className={`grid gap-5 ${summary.team && summary.team.teamId ? "lg:grid-cols-2" : ""}`}>
            <CurrentPlan
              view={summary.current}
              title={summary.current.scope === "team" ? t("plans.current.titleTeam") : t("plans.current.title")}
              addons={catalog.addons}
              busy={busy}
              onAddon={addon}
              canBuy={backend}
            />
            {summary.team && summary.current.scope !== "team" && (
              <Panel title={t("plans.team.title", { team: summary.team.teamName ?? "" })} description={summary.team.active ? t("plans.team.noSeat") : t("plans.team.inactive")}>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t("plans.team.members", { n: summary.team.members, seats: summary.team.limits.seats })}</p>
              </Panel>
            )}
          </div>
        )}

        <Panel
          title={t("plans.choose.title")}
          description={t("plans.choose.description")}
          actions={
            <Segmented
              label={t("plans.interval.label")}
              value={interval}
              onChange={setInterval_}
              options={[
                { value: "month", label: t("plans.interval.month") },
                { value: "year", label: t("plans.interval.yearSave", { percent: catalog.yearlyDiscountPercent }) },
              ]}
            />
          }
        >
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-testid="plan-cards">
            {catalog.plans.map((p) => {
              const a = cardAction(p);
              const highlight = p.id === "pro";
              const price = priceOf(p, interval);
              return (
                <li
                  key={p.id}
                  data-testid={`plan-${p.id}`}
                  className={`relative flex flex-col rounded-2xl border p-4 ${
                    highlight ? "border-brand-500 bg-brand-25 ring-1 ring-brand-500 dark:bg-brand-500/5" : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="mb-2 flex min-h-5 flex-wrap items-center gap-1">
                    <p className="mr-auto text-base font-bold text-gray-900 dark:text-white">{planName(p.id)}</p>
                    {highlight && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        <Sparkles className="h-3 w-3" /> {t("creditsPage.packages.popular")}
                      </span>
                    )}
                    {a.current && <Chip tone="green">{t("plans.card.yours")}</Chip>}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid={`plan-${p.id}-price`}>
                    {p.monthlyIdr === 0 ? t("plans.card.free") : formatMoney(price)}
                    {p.monthlyIdr > 0 && <span className="text-sm font-medium text-gray-500"> / {t(`plans.interval.per.${interval}`)}</span>}
                  </p>
                  <p className="mt-0.5 min-h-4 text-xs text-gray-500 dark:text-gray-400">
                    {p.monthlyIdr > 0 && interval === "year"
                      ? t("plans.card.yearlyNote", { perMonth: formatMoney(perMonthWhenYearly(p)), full: formatMoney(p.monthlyIdr * 12) })
                      : p.id === "team"
                        ? t("plans.card.seats", { n: p.seats })
                        : ""}
                  </p>
                  <ul className="mt-3 flex flex-1 flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    {[
                      t("plans.feat.units", { n: p.units }),
                      t("plans.feat.video", { n: minutes(p.videoSeconds) }),
                      t("plans.feat.size", { size: formatBytes(p.maxBytes) }),
                      t("plans.feat.duration", { n: minutes(p.maxVideoSeconds) }),
                      t("plans.feat.concurrency", { count: p.concurrency }),
                      t("plans.feat.retention", { time: formatRetention(p.retentionHours) }),
                      ...(p.priority ? [t("plans.feat.priority")] : []),
                      ...(p.seats > 1 ? [t("plans.feat.seats", { n: p.seats })] : []),
                    ].map((s) => (
                      <li key={s} className="flex items-start gap-1.5">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" /> {s}
                      </li>
                    ))}
                  </ul>
                  {a.hint && <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">{a.hint}</p>}
                  {a.to ? (
                    <Link to={a.to} className={`${highlight ? btn.primary : btn.secondary} mt-3 w-full`} data-testid={`plan-${p.id}-action`}>
                      {p.id === "team" ? <Users className="h-4 w-4" /> : null} {a.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`${highlight ? btn.primary : btn.secondary} mt-3 w-full`}
                      disabled={a.disabled || busy !== null || !backend}
                      onClick={() => p.id !== "free" && setChoice({ plan: p.id, interval })}
                      data-testid={`plan-${p.id}-action`}
                    >
                      {a.label}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" /> {t("plans.noAutoRenew")}
          </p>
        </Panel>

        <Panel title={t("plans.how.title")}>
          <ul className="flex list-disc flex-col gap-2 pl-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300" data-testid="plans-how">
            {(t("plans.how.items", { returnObjects: true }) as string[]).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <Modal
        open={choice !== null}
        onClose={() => busy === null && setChoice(null)}
        title={choice ? t("plans.checkout.title", { plan: planName(choice.plan), interval: t(`plans.interval.${choice.interval}`) }) : ""}
        icon={<Gauge className="h-5 w-5" />}
        testId="plan-checkout"
        footer={
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className={btn.secondary} onClick={() => setChoice(null)} disabled={busy !== null}>
              {t("common.cancel")}
            </button>
            {catalog.paymentAvailable && (
              <button type="button" className={btn.secondary} onClick={() => void payGateway()} disabled={!q || busy !== null} data-testid="plan-pay-gateway">
                {busy === "gateway" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                {t("plans.checkout.payGateway", { price: q ? formatMoney(q.finalIdr) : "" })}
              </button>
            )}
            <button type="button" className={btn.primary} onClick={() => void payCredits()} disabled={!canPayCredits || busy !== null} data-testid="plan-pay-credits">
              {busy === "credits" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
              {t("plans.checkout.payCredits", { credits: q ? formatCredits(q.credits) : "" })}
            </button>
          </div>
        }
      >
        {quote.status === "loading" && (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> {t("common.loading")}
          </p>
        )}
        {q && quote.status === "ready" && (
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-sm" data-testid="plan-quote">
            <dt className="text-gray-500">{t(`plans.checkout.action.${q.action}`)}</dt>
            <dd className="text-right font-medium">{formatMoney(q.priceIdr)}</dd>
            {q.creditIdr > 0 && (
              <>
                <dt className="text-gray-500">{t("plans.checkout.credit")}</dt>
                <dd className="text-right font-medium text-emerald-700 dark:text-emerald-400">−{formatMoney(q.creditIdr)}</dd>
              </>
            )}
            <dt className="border-t border-gray-100 pt-1.5 font-semibold dark:border-gray-800">{t("plans.checkout.total")}</dt>
            <dd className="border-t border-gray-100 pt-1.5 text-right font-bold dark:border-gray-800" data-testid="plan-quote-total">
              {formatMoney(q.finalIdr)}
            </dd>
            <dt className="text-gray-500">{t("plans.checkout.period")}</dt>
            <dd className="text-right">
              {date(q.startsAt)} – {date(q.endsAt)}
            </dd>
          </dl>
        )}
        {q && balance !== null && balance < q.credits && (
          <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
            {t("plans.checkout.lowBalance", { balance: formatCredits(balance), need: formatCredits(q.credits) })}{" "}
            <Link to="/credits" className="underline">
              {t("access.buyCredits")}
            </Link>
          </p>
        )}
        {quote.error && (
          <Notice tone="warn" testId="plan-quote-error">
            {quote.error}
          </Notice>
        )}
        <p className="mt-3 flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <Film className="mt-0.5 h-3 w-3 shrink-0" /> {t("plans.checkout.note")}
        </p>
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
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
      </Modal>
    </>
  );
}
