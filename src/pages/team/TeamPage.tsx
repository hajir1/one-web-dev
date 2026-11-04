import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRightLeft, Crown, Loader2, LogOut, Mail, Trash2, UserPlus, Users, X } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import { Navigate } from "../../components/app/LocaleLink";
import { Chip, Field, INPUT, Notice, Panel, Segmented, btn } from "../../components/app/ui";
import { notify } from "../../components/app/Toaster";
import { api, ApiError, newIdempotencyKey } from "../../api/client";
import { useSession } from "../../auth/session";
import { currentLang } from "../../i18n";
import { refreshBilling, useBilling } from "../media/processing/billing";
import { formatCredits } from "../media/processing/pricing";
import { TEAM_MAX_MEMBERS, type TeamView } from "./team";

/** v7 (P6): /:lang/team — team & shared credits; /:lang/team/join?token=… accepts an invitation. */
export default function TeamPage() {
  const { t } = useTranslation();
  const status = useSession((s) => s.status);
  const [params, setParams] = useSearchParams();
  const token = params.get("token");
  const [team, setTeam] = useState<TeamView | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const balance = useBilling((s) => s.account?.balance ?? null);

  const run = useCallback(
    async <T,>(key: string, fn: () => Promise<T>, done?: string) => {
      setBusy(key);
      setError(null);
      try {
        const r = await fn();
        if (r && typeof r === "object" && "team" in r) setTeam((r as { team: TeamView | null }).team);
        if (done) notify.success(done);
        void refreshBilling();
        return r;
      } catch (e) {
        setError(e instanceof ApiError ? e.message : t("errors.unknown"));
        return null;
      } finally {
        setBusy(null);
      }
    },
    [t],
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    void run("load", () => api<{ team: TeamView | null }>("/teams/me"));
  }, [status, run]);

  if (status === "anonymous") return <Navigate to={`/signin?next=${encodeURIComponent(token ? `/team/join?token=${token}` : "/team")}`} replace />;

  const accept = () =>
    run("accept", () => api<{ team: TeamView }>("/teams/invites/accept", { body: { token } }), t("team.joined")).then((r) => {
      if (r) setParams({}, { replace: true });
    });

  return (
    <>
      <AppMeta title={t("team.title")} description={t("team.description")} />
      <div className="flex flex-col gap-5" data-testid="team-page">
        <PageHeader icon={Users} title={t("team.title")} description={t("team.description")} crumbs={[{ label: t("nav.account") }, { label: t("team.title") }]} />
        {error && (
          <Notice tone="error" onDismiss={() => setError(null)} testId="team-error">
            {error}
          </Notice>
        )}
        {token && (
          <Panel title={t("team.inviteTitle")}>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">{team ? t("team.inviteAlreadyInTeam", { name: team.name }) : t("team.inviteText")}</p>
            <div className="flex gap-2">
              <button type="button" className={btn.primary} onClick={() => void accept()} disabled={busy !== null || !!team} data-testid="team-accept">
                {busy === "accept" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} {t("team.accept")}
              </button>
              <button type="button" className={btn.secondary} onClick={() => setParams({}, { replace: true })}>
                {t("common.cancel")}
              </button>
            </div>
          </Panel>
        )}
        {team === undefined ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        ) : team === null ? (
          <CreateTeam busy={busy === "create"} onCreate={(name) => void run("create", () => api<{ team: TeamView }>("/teams", { body: { name } }), t("team.created"))} />
        ) : (
          <TeamDetail team={team} busy={busy} balance={balance} run={run} onGone={() => setTeam(null)} />
        )}
      </div>
    </>
  );
}

function CreateTeam({ busy, onCreate }: { busy: boolean; onCreate: (name: string) => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Panel title={t("team.createTitle")} description={t("team.createText")}>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (name.trim().length >= 2) onCreate(name.trim());
          }}
        >
          <input className={INPUT} value={name} maxLength={60} placeholder={t("team.namePlaceholder")} aria-label={t("team.name")} onChange={(e) => setName(e.target.value)} data-testid="team-name" />
          <button type="submit" className={btn.primary} disabled={busy || name.trim().length < 2} data-testid="team-create">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />} {t("team.create")}
          </button>
        </form>
      </Panel>
      <RulesPanel />
    </div>
  );
}

function RulesPanel() {
  const { t } = useTranslation();
  return (
    <Panel title={t("team.rulesTitle")}>
      <ul className="flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {(t("team.rules", { returnObjects: true, max: TEAM_MAX_MEMBERS }) as string[]).map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </Panel>
  );
}

type Run = <T>(key: string, fn: () => Promise<T>, done?: string) => Promise<T | null>;

function TeamDetail({ team, busy, balance, run, onGone }: { team: TeamView; busy: string | null; balance: number | null; run: Run; onGone: () => void }) {
  const { t } = useTranslation();
  const owner = team.role === "owner";
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [confirmDisband, setConfirmDisband] = useState(false);
  const seats = team.members.length + team.invites.length;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-5">
        <Panel
          title={
            <span className="flex items-center gap-2">
              {team.name} <Chip tone={owner ? "amber" : "blue"}>{owner ? <><Crown className="h-3 w-3" /> {t("team.owner")}</> : t("team.member")}</Chip>
            </span>
          }
          description={t("team.seats", { n: seats, max: team.maxMembers })}
        >
          <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800" data-testid="team-members">
            {team.members.map((m) => (
              <li key={m.userId} className="flex flex-wrap items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                    {m.name || m.email} {m.role === "owner" && <Crown className="inline h-3.5 w-3.5 text-amber-500" aria-label={t("team.owner")} />}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {m.email}
                    {owner && m.spentMonth !== undefined && <> · {t("team.spent", { spent: formatCredits(m.spentMonth), limit: m.monthlyLimit === null || m.monthlyLimit === undefined ? t("team.noLimit") : formatCredits(m.monthlyLimit) })}</>}
                  </p>
                </div>
                {owner && m.role === "member" && (
                  <>
                    <LimitEditor value={m.monthlyLimit ?? null} disabled={busy !== null} onSave={(v) => void run("limit", () => api(`/teams/members/${m.userId}`, { method: "PATCH", body: { monthlyLimit: v } }), t("team.limitSaved"))} />
                    <button type="button" className={btn.icon} aria-label={t("team.remove")} disabled={busy !== null} onClick={() => void run("remove", () => api(`/teams/members/${m.userId}`, { method: "DELETE" }))}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
            {team.invites.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                <p className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
                  {i.email} <Chip>{t("team.pending")}</Chip>
                </p>
                <button
                  type="button"
                  className={btn.icon}
                  aria-label={t("team.revoke")}
                  disabled={busy !== null}
                  onClick={() => void run("revoke", () => api(`/teams/invites/${i.id}`, { method: "DELETE" }).then(() => api<{ team: TeamView }>("/teams/me")))}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          {owner && seats < team.maxMembers && (
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                void run("invite", () => api("/teams/invites", { body: { email: email.trim(), lang: currentLang() } }).then(() => api<{ team: TeamView }>("/teams/me")), t("team.invited", { email: email.trim() })).then((r) => {
                  if (r) setEmail("");
                });
              }}
            >
              <input type="email" required className={INPUT} value={email} placeholder={t("team.inviteEmail")} aria-label={t("team.inviteEmail")} onChange={(e) => setEmail(e.target.value)} data-testid="team-invite-email" />
              <button type="submit" className={btn.secondary} disabled={busy !== null || !email.trim()} data-testid="team-invite">
                {busy === "invite" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} {t("team.invite")}
              </button>
            </form>
          )}
        </Panel>
        <SourcePanel team={team} busy={busy !== null} run={run} />
      </div>

      <aside className="flex flex-col gap-5">
        <Panel title={t("team.walletTitle")}>
          <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="team-balance">
            {formatCredits(team.balance)}
          </p>
          {!owner && <p className="mt-1 text-xs text-gray-500">{t("team.myUsage", { spent: formatCredits(team.me.spentMonth), limit: team.me.monthlyLimit === null ? t("team.noLimit") : formatCredits(team.me.monthlyLimit) })}</p>}
          {owner && (
            <form
              className="mt-4 flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const credits = Number(amount.replace(",", "."));
                if (!(credits > 0)) return;
                void run("transfer", () => api("/teams/transfer", { body: { credits }, idempotencyKey: newIdempotencyKey("team") }), t("team.transferred", { credits: formatCredits(credits) })).then((r) => {
                  if (r) setAmount("");
                });
              }}
            >
              <Field label={t("team.transferLabel")} hint={balance !== null ? t("team.personalBalance", { balance: formatCredits(balance) }) : undefined}>
                <input inputMode="decimal" className={INPUT} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10" data-testid="team-transfer-amount" />
              </Field>
              <button type="submit" className={btn.primary} disabled={busy !== null || !(Number(amount.replace(",", ".")) > 0)} data-testid="team-transfer">
                {busy === "transfer" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />} {t("team.transfer")}
              </button>
              <p className="text-[11px] text-gray-500">{t("team.transferNote")}</p>
            </form>
          )}
        </Panel>
        <RulesPanel />
        <Panel>
          {owner ? (
            confirmDisband ? (
              <div className="flex flex-col gap-2 text-sm">
                <p className="text-rose-700 dark:text-rose-300">{t("team.disbandConfirm", { balance: formatCredits(team.balance) })}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`${btn.primary} !bg-rose-600`}
                    disabled={busy !== null}
                    onClick={() => void run("disband", () => api("/teams", { method: "DELETE" }), t("team.disbanded")).then((r) => r && onGone())}
                    data-testid="team-disband-confirm"
                  >
                    {t("team.disband")}
                  </button>
                  <button type="button" className={btn.secondary} onClick={() => setConfirmDisband(false)}>
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className={`${btn.ghost} text-rose-600`} onClick={() => setConfirmDisband(true)} data-testid="team-disband">
                <Trash2 className="h-4 w-4" /> {t("team.disband")}
              </button>
            )
          ) : (
            <MemberLeave busy={busy !== null} run={run} onGone={onGone} />
          )}
        </Panel>
      </aside>
    </div>
  );
}

function MemberLeave({ busy, run, onGone }: { busy: boolean; run: Run; onGone: () => void }) {
  const { t } = useTranslation();
  const me = useSession((s) => s.user?.id);
  return (
    <button
      type="button"
      className={`${btn.ghost} text-rose-600`}
      disabled={busy || !me}
      onClick={() => {
        if (window.confirm(t("team.leaveConfirm"))) void run("leave", () => api(`/teams/members/${me}`, { method: "DELETE" }), t("team.left")).then((r) => r && onGone());
      }}
      data-testid="team-leave"
    >
      <LogOut className="h-4 w-4" /> {t("team.leave")}
    </button>
  );
}

function SourcePanel({ team, busy, run }: { team: TeamView; busy: boolean; run: Run }) {
  const { t } = useTranslation();
  const value = team.me.payWithTeam ? "team" : "personal";
  return (
    <Panel title={t("team.sourceTitle")} description={t("team.sourceText")}>
      <Segmented<"team" | "personal">
        value={value}
        disabled={busy}
        label={t("team.sourceTitle")}
        onChange={(v) =>
          void run("source", async () => {
            await api("/teams/me/preference", { method: "PATCH", body: { payWithTeam: v === "team" } });
            return api<{ team: TeamView }>("/teams/me");
          })
        }
        options={[
          { value: "team", label: t("team.sourceTeam") },
          { value: "personal", label: t("team.sourcePersonal") },
        ]}
      />
    </Panel>
  );
}

function LimitEditor({ value, disabled, onSave }: { value: number | null; disabled: boolean; onSave: (v: number | null) => void }) {
  const { t } = useTranslation();
  const [text, setText] = useState(value === null ? "" : String(value));
  useEffect(() => setText(value === null ? "" : String(value)), [value]);
  const parsed = text.trim() === "" ? null : Number(text.replace(",", "."));
  const valid = parsed === null || (Number.isFinite(parsed) && parsed >= 0);
  return (
    <form
      className="flex items-center gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid && parsed !== value) onSave(parsed);
      }}
    >
      <input className={`${INPUT} !w-24 !py-1.5 text-xs`} inputMode="decimal" value={text} placeholder={t("team.noLimit")} aria-label={t("team.limitLabel")} onChange={(e) => setText(e.target.value)} />
      <button type="submit" className={`${btn.secondary.replace("px-4 py-2.5", "px-2.5 py-1.5")} text-xs`} disabled={disabled || !valid || parsed === value}>
        {t("team.limitSave")}
      </button>
    </form>
  );
}
