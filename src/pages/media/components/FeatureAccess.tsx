import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../../../components/app/LocaleLink";
import { CREDITS_PATH, PLANS_PATH } from "../../../config/menu";
import { CloudOff, Coins, Crown, Gauge, Loader2, Lock, LockOpen, Plus, ServerCog, Wallet } from "lucide-react";
import { ACCESS_LABEL, costOf, featureName, formatCredits, formatCreditValue, packCostPerUse, tierNote as tierNoteOf, unitName, type AccessState } from "../processing/pricing";
import { BillingUnavailableError, refreshBilling, unlockFeature } from "../processing/billing";
import { TOOL_BY_ID, type MediaToolId } from "../processing/policy";
import { useFeatureAccess, type FeatureAccess } from "../hooks/useFeatureAccess";
import type { UsageInput } from "../processing/pricing";
import { Chip, btn } from "./ui";
import { AdminFreeBadge } from "../../../components/app/AdminFreeBadge";
import { buyAddon, formatBytes, minutes, planName, VIDEO_MINUTE_FEATURES } from "../../plans/plans";

/** The Credits page (formerly /media-tools/kredit). */
export const STORE_PATH = CREDITS_PATH;

const STATE_TONE: Record<AccessState, "gray" | "green" | "amber" | "blue" | "rose"> = {
  unavailable: "rose",
  unknown: "gray",
  locked: "amber",
  insufficient: "amber",
  quota: "amber",
  ready: "green",
};

export function AccessChip({ state }: { state: AccessState }) {
  const Icon = state === "ready" ? LockOpen : state === "unavailable" ? CloudOff : state === "quota" ? Gauge : Lock;
  return (
    <Chip tone={STATE_TONE[state]}>
      <Icon className="h-3 w-3" /> {ACCESS_LABEL[state]}
    </Chip>
  );
}

/** v11: plan feature access details: plan, usage, remaining quota, file limits. */
function PlanAccessDetails({ access }: { access: FeatureAccess }) {
  const { t } = useTranslation();
  const { account, quota, entitlement, pricing: p } = access;
  const sub = account?.subscription ?? null;
  const video = VIDEO_MINUTE_FEATURES.has(access.feature);
  const Row = ({ k, v, testId }: { k: string; v: React.ReactNode; testId?: string }) => (
    <>
      <dt className="text-gray-500 dark:text-gray-400">{k}</dt>
      <dd className="text-right font-medium text-gray-800 dark:text-white/90" data-testid={testId}>
        {v}
      </dd>
    </>
  );
  const usage = account?.adminFree ? (
    <AdminFreeBadge />
  ) : quota && quota.units + quota.videoSeconds === 0 && !quota.durationUnknown && (entitlement?.packUses ?? 0) > 0 ? (
    t("access.plan.fromPack", { n: access.plan.packUses })
  ) : video ? (
    quota?.durationUnknown || !quota?.videoSeconds ? (
      t("access.plan.videoAfter")
    ) : (
      t("access.plan.videoMinutes", { n: Math.max(1, Math.ceil(quota.videoSeconds / 60)) })
    )
  ) : (
    t("access.plan.units", { count: quota?.units ?? 1 })
  );
  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm" data-testid="access-details">
      <Row k={t("access.serverStatus")} v={access.serverAvailable ? <Chip tone="green">{t("access.available")}</Chip> : <Chip tone="rose">{t("access.notAvailable")}</Chip>} />
      <Row k={t("access.featureAccess")} v={<AccessChip state={access.state} />} testId="access-state" />
      <Row
        k={t("access.plan.current")}
        v={
          sub ? (
            <span>
              {planName(sub.plan)}
              {sub.scope === "team" && sub.teamName && <span className="block text-[11px] font-normal text-gray-500">{t("access.plan.team", { team: sub.teamName })}</span>}
            </span>
          ) : (
            <span className="text-gray-400">{t("access.notLoaded")}</span>
          )
        }
        testId="plan-name"
      />
      <Row
        k={t("access.estimate", { count: access.count })}
        v={
          <span>
            {usage}
            {!account?.adminFree && <span className="block text-[11px] font-normal text-gray-500">{t("access.plan.chargedOnSuccess")}</span>}
          </span>
        }
        testId="plan-cost"
      />
      {sub && (
        <Row
          k={t("access.plan.left")}
          v={video ? t("access.plan.minutesLeft", { n: minutes(sub.videoSeconds.left), total: minutes(sub.videoSeconds.limit + sub.videoSeconds.bonus) }) : t("access.plan.unitsLeft", { n: sub.units.left, total: sub.units.limit + sub.units.bonus })}
          testId="uses-left"
        />
      )}
      {sub && <Row k={t("access.plan.maxFile")} v={formatBytes(Math.min(sub.limits.maxBytes, p.limits.maxBytes))} />}
      {(entitlement?.packUses ?? 0) > 0 && <Row k={t("access.plan.oldPack")} v={t("access.usesLeft", { n: entitlement!.packUses })} />}
    </dl>
  );
}

/** Rincian akses: status server, biaya, saldo, perkiraan penggunaan. */
export function AccessDetails({ access, showPlan = true }: { access: FeatureAccess; showPlan?: boolean }) {
  const { t } = useTranslation();
  if (access.pricing.inPlan) return <PlanAccessDetails access={access} />;
  const { pricing: p, account, plan, entitlement } = access;
  const base = costOf(p);
  const tierNote = tierNoteOf(p);
  const Row = ({ k, v, testId }: { k: string; v: React.ReactNode; testId?: string }) => (
    <>
      <dt className="text-gray-500 dark:text-gray-400">{k}</dt>
      <dd className="text-right font-medium text-gray-800 dark:text-white/90" data-testid={testId}>
        {v}
      </dd>
    </>
  );
  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm" data-testid="access-details">
      <Row k={t("access.serverStatus")} v={access.serverAvailable ? <Chip tone="green">{t("access.available")}</Chip> : <Chip tone="rose">{t("access.notAvailable")}</Chip>} />
      <Row k={t("access.featureAccess")} v={<AccessChip state={access.state} />} testId="access-state" />
      <Row
        k={t("access.costPerUse")}
        v={
          <span>
            {formatCredits(base)} <span className="text-xs font-normal text-gray-400">({formatCreditValue(base)})</span>
            {tierNote && <span className="block text-[11px] font-normal text-gray-500">{tierNote}</span>}
          </span>
        }
        testId="cost-per-use"
      />
      <Row
        k={t("access.featurePack")}
        v={
          <span>
            {formatCredits(p.packPrice)} = {p.usesPerCredit}× {unitName(p.unit)}
            <span className="block text-[11px] font-normal text-gray-500">{t("access.perUseApprox", { cost: formatCredits(packCostPerUse(p)) })}</span>
          </span>
        }
      />
      {showPlan && account?.adminFree && <Row k={t("access.estimate", { count: access.count })} v={<AdminFreeBadge />} testId="plan-cost" />}
      {showPlan && !account?.adminFree && (
        <Row
          k={t("access.estimate", { count: access.count })}
          v={
            <span>
              {plan.packUses > 0 && t("access.packUsesPlus", { n: plan.packUses })}
              {formatCredits(plan.credits)}
              <span className="block text-[11px] font-normal text-gray-500">{t("access.chargedOnSuccess")}</span>
            </span>
          }
          testId="plan-cost"
        />
      )}
      <Row k={t("access.balance")} v={account ? formatCredits(account.balance) : <span className="text-gray-400">{t("access.notLoaded")}</span>} testId="balance" />
      <Row k={t("access.packQuota")} v={entitlement ? t("access.usesLeft", { n: entitlement.packUses }) : <span className="text-gray-400">—</span>} />
      <Row
        k={t("access.estimatedUses")}
        v={
          access.usesLeft === null ? (
            <span className="text-gray-400">{t("access.needsBalance")}</span>
          ) : access.usesLeft === Infinity ? (
            t("adminFree.unlimited")
          ) : (
            t("access.usesWithBalance", { n: access.usesLeft })
          )
        }
        testId="uses-left"
      />
    </dl>
  );
}

/** Action button for the status: buy credits, unlock access, reload. */
export function AccessActions({ access, compact }: { access: FeatureAccess; compact?: boolean }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const storeLink = `${STORE_PATH}?feature=${access.feature}`;
  // v6: admins do not need to buy credits/plans.
  if (access.account?.adminFree) return null;

  // v11: subscription plan features → view/upgrade the plan, or buy extra quota this month.
  if (access.pricing.inPlan) {
    const problem = access.quota?.problem;
    const addon = problem === "units" ? "units" : problem === "video" ? "video" : null;
    const add = async () => {
      if (!addon) return;
      setMsg(null);
      setBusy(true);
      try {
        await buyAddon(addon);
      } catch (e) {
        setMsg(e instanceof Error ? e.message : t("errors.unknown"));
      } finally {
        setBusy(false);
      }
    };
    return (
      <div className="flex flex-col gap-2">
        <div className={`flex flex-wrap gap-2 ${compact ? "" : "justify-end"}`}>
          {access.billingStatus === "error" && (
            <button type="button" className={btn.secondary} onClick={() => refreshBilling()}>
              {t("access.reloadBalance")}
            </button>
          )}
          {addon && (
            <button type="button" className={btn.secondary} onClick={add} disabled={busy} data-testid="buy-addon">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {addon === "units" ? t("access.plan.addUnits") : t("access.plan.addVideo")}
            </button>
          )}
          <Link to={PLANS_PATH} className={access.state === "quota" ? btn.primary : btn.secondary} data-testid="see-plans">
            <Crown className="h-4 w-4" /> {access.state === "quota" ? t("access.plan.upgrade") : t("access.plan.see")}
          </Link>
        </div>
        {msg && (
          <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300" data-testid="billing-alert">
            {msg}
          </p>
        )}
      </div>
    );
  }

  const unlock = async () => {
    setMsg(null);
    setBusy(true);
    try {
      await unlockFeature(access.feature);
    } catch (e) {
      setMsg(e instanceof BillingUnavailableError ? e.message : e instanceof Error ? e.message : t("access.unlockFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex flex-wrap gap-2 ${compact ? "" : "justify-end"}`}>
        {access.billingStatus === "error" && (
          <button type="button" className={btn.secondary} onClick={() => refreshBilling()}>
            {t("access.reloadBalance")}
          </button>
        )}
        {(access.state === "locked" || access.state === "unavailable" || access.state === "unknown") && access.pricing.unlockRequired && (
          <button type="button" className={btn.secondary} onClick={unlock} disabled={busy || !!access.entitlement?.unlocked} data-testid="unlock-feature">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockOpen className="h-4 w-4" />}
            {t("access.unlock", { cost: formatCredits(access.pricing.packPrice) })}
          </button>
        )}
        <Link to={storeLink} className={access.state === "insufficient" ? btn.primary : btn.secondary} data-testid="buy-credits">
          <Coins className="h-4 w-4" /> {t("access.buyCredits")}
        </Link>
      </div>
      {msg && (
        <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300" data-testid="billing-alert">
          {msg}
        </p>
      )}
    </div>
  );
}

/** Server feature access card (shown in the side panel when server mode is selected). */
export default function FeatureAccessCard({ tool, inputs }: { tool: MediaToolId; inputs?: UsageInput[] }) {
  const { t } = useTranslation();
  const access = useFeatureAccess(tool, inputs);
  if (!access) return null;
  return (
    <section className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/40" data-testid="feature-access">
      <header className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/90">
          <ServerCog className="h-4 w-4 text-gray-400" /> {TOOL_BY_ID[tool].serverFeature ? featureName(TOOL_BY_ID[tool].serverFeature!) : tool} · {t("access.server")}
        </h2>
        <span className="flex items-center gap-1.5">
          <AdminFreeBadge compact />
          <AccessChip state={access.state} />
        </span>
      </header>
      <div className="flex flex-col gap-3 p-4">
        {!access.serverAvailable && (
          <p className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:bg-rose-500/10 dark:text-rose-200">
            <CloudOff className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {t("errors.serverUnavailable")}
          </p>
        )}
        <AccessDetails access={access} />
        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
          <Wallet className="mt-0.5 h-3 w-3 shrink-0" /> {access.pricing.inPlan ? t("access.plan.howItWorks") : t("access.howItWorks")}
        </p>
        <AccessActions access={access} compact />
      </div>
    </section>
  );
}
