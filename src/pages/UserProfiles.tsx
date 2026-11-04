import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Check, Copy, Gift, Link2, Loader2, Share2, ShieldCheck, UserCog, Users, Wallet } from "lucide-react";
import AppMeta from "../components/app/AppMeta";
import PageHeader from "../components/app/PageHeader";
import { Link, Navigate, useLang } from "../components/app/LocaleLink";
import { btn, Chip, INPUT, Notice, Panel } from "../components/app/ui";
import { QueryError, Skeleton } from "../components/app/QueryState";
import { ApiError } from "../api/client";
import { redeemReferral, referralInviteUrl, useReferral, type ReferralInfo } from "../api/queries";
import { useSession, type SessionUser } from "../auth/session";
import { normalizeReferralInput } from "../auth/referralCapture";
import { CREDITS_PATH } from "../config/menu";

/** Copies text to the clipboard (textarea fallback for old browsers / non-HTTPS). */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand?.("copy") ?? false;
    ta.remove();
    return ok;
  }
}

function useCopied() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    if (await copyText(text)) {
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    }
  };
  return { copied, copy };
}

const idr = (n: number, lang: string) => new Intl.NumberFormat(lang === "en" ? "en-US" : "id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

/** /:lang/profile — account identity + referral code. */
export default function UserProfiles() {
  const { t } = useTranslation();
  const status = useSession((s) => s.status);
  const user = useSession((s) => s.user);
  if (status === "anonymous") return <Navigate to="/signin?next=/profile" replace />;
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5" data-testid="profile-page">
      <AppMeta title={t("profile.title")} />
      <PageHeader title={t("profile.title")} description={t("profile.description")} />
      {user ? <IdentityCard user={user} /> : <Skeleton className="h-28 w-full rounded-2xl" />}
      <ReferralCard enabled={!!user} />
    </div>
  );
}

function IdentityCard({ user }: { user: SessionUser }) {
  const { t } = useTranslation();
  const label = user.name || user.email;
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  return (
    <Panel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">{initial}</span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold text-gray-900 dark:text-white" data-testid="profile-name">{user.name || t("profile.noName")}</p>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.emailVerified ? (
              <Chip tone="green">
                <BadgeCheck className="h-3.5 w-3.5" /> {t("profile.verified")}
              </Chip>
            ) : (
              <Chip tone="amber">{t("profile.unverified")}</Chip>
            )}
            {user.providers.map((p) => (
              <Chip key={p}>{p === "google" ? "Google" : t("profile.passwordLogin")}</Chip>
            ))}
            {user.mfaEnabled && (
              <Chip tone="blue">
                <ShieldCheck className="h-3.5 w-3.5" /> 2FA
              </Chip>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={CREDITS_PATH} className={btn.secondary}>
            <Wallet className="h-4 w-4" /> {t("header.creditsTitle")}
          </Link>
          <Link to="/account" className={btn.secondary}>
            <UserCog className="h-4 w-4" /> {t("account.title")}
          </Link>
        </div>
      </div>
    </Panel>
  );
}

function ReferralCard({ enabled }: { enabled: boolean }) {
  const { t } = useTranslation();
  const lang = useLang();
  const q = useReferral(enabled);
  const { copied, copy } = useCopied();
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <Panel title={t("referral.title")} description={t("referral.description")}>
      {q.isPending ? (
        <div className="flex flex-col gap-3" aria-busy="true" aria-label={t("query.loading")}>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      ) : q.isError ? (
        <QueryError error={q.error} onRetry={() => void q.refetch()} retrying={q.isFetching} testId="referral-error" />
      ) : (
        <ReferralBody info={q.data} lang={lang} copied={copied} copy={copy} canShare={canShare} />
      )}
    </Panel>
  );
}

function ReferralBody({ info, lang, copied, copy, canShare }: { info: ReferralInfo; lang: string; copied: string | null; copy: (k: string, v: string) => void; canShare: boolean }) {
  const { t } = useTranslation();
  const invite = referralInviteUrl(info, lang);
  const share = async () => {
    try {
      await navigator.share({ title: "OneWebDev", text: t("referral.shareText", { code: info.code }), url: invite });
    } catch {
      /* cancelled by the user */
    }
  };
  return (
    <div className="flex flex-col gap-5">
      {!info.active && <Notice tone="warn">{t("referral.inactive")}</Notice>}

      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-4 dark:border-brand-500/40 dark:bg-brand-500/10 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">{t("referral.yourCode")}</p>
          <p className="mt-1 select-all break-all font-mono text-2xl font-bold tracking-[0.2em] text-gray-900 dark:text-white" data-testid="referral-code">
            {info.code}
          </p>
        </div>
        <button type="button" className={btn.primary} onClick={() => copy("code", info.code)} data-testid="referral-copy" aria-live="polite">
          {copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied === "code" ? t("referral.copied") : t("referral.copyCode")}
        </button>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("referral.inviteLink")}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input readOnly value={invite} className={`${INPUT} min-w-0 flex-1 text-xs`} onFocus={(e) => e.currentTarget.select()} aria-label={t("referral.inviteLink")} data-testid="referral-link" />
          <div className="flex gap-2">
            <button type="button" className={`${btn.secondary} flex-1 sm:flex-none`} onClick={() => copy("link", invite)} data-testid="referral-copy-link">
              {copied === "link" ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              {copied === "link" ? t("referral.copied") : t("referral.copyLink")}
            </button>
            {canShare && (
              <button type="button" className={`${btn.secondary} flex-1 sm:flex-none`} onClick={share} data-testid="referral-share">
                <Share2 className="h-4 w-4" /> {t("referral.share")}
              </button>
            )}
          </div>
        </div>
      </div>

      <ul className="grid gap-3 text-sm sm:grid-cols-2">
        <li className="flex gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
          <Gift className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <span className="text-gray-600 dark:text-gray-300">
            {t("referral.friendGets", { percent: info.discountPercent, days: info.voucherValidDays })}
            {info.maxDiscountIdr > 0 && ` ${t("referral.maxDiscount", { amount: idr(info.maxDiscountIdr, lang) })}`}
            {info.firstPurchaseOnly && ` ${t("referral.firstPurchase")}`}
          </span>
        </li>
        <li className="flex gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
          <Users className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <span className="text-gray-600 dark:text-gray-300">
            {info.rewardCredits > 0 ? t("referral.youGet", { credits: info.rewardCredits }) : t("referral.noReward")}
            <span className="mt-1 block text-xs text-gray-500" data-testid="referral-stats">
              {t("referral.stats", { used: info.timesUsed, rewarded: info.rewardsEarned })}
            </span>
          </span>
        </li>
      </ul>

      {info.usedReferral ? (
        <p className="text-xs text-gray-500 dark:text-gray-400" data-testid="referral-used">
          {t("referral.joinedWith", { code: info.usedReferral.code })}
        </p>
      ) : (
        <RedeemForm />
      )}
    </div>
  );
}

function RedeemForm() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const c = normalizeReferralInput(code);
    if (!c) return setMsg({ tone: "error", text: t("referral.invalidFormat") });
    setBusy(true);
    setMsg(null);
    try {
      await redeemReferral(c);
      setMsg({ tone: "success", text: t("referral.redeemed") });
      setCode("");
    } catch (err) {
      setMsg({ tone: "error", text: err instanceof ApiError ? err.message : t("errors.unknown") });
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="border-t border-gray-100 pt-4 dark:border-gray-800" data-testid="referral-redeem">
      <label htmlFor="redeem-code" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("referral.haveCode")}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="redeem-code"
          className={`${INPUT} font-mono uppercase tracking-wider sm:max-w-xs`}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="K7P3QX9M"
          maxLength={40}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className={btn.secondary} disabled={busy || !code.trim()}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />} {t("referral.redeem")}
        </button>
      </div>
      {msg && (
        <p role={msg.tone === "error" ? "alert" : "status"} className={`mt-2 text-xs ${msg.tone === "error" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
          {msg.text}
        </p>
      )}
    </form>
  );
}
