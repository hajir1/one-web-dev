import {    useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Ban,
  Coins,
  ShieldCheck,
} from "lucide-react";
import Modal from "../../../components/app/Modal";
import { Chip, INPUT,  Panel, btn } from "../../../components/app/ui";
import {  api } from "../../../api/client";
import {   useSession } from "../../../auth/session";
import { Loadable, Pager, ReloadBtn, SearchBox, Select, Spinner, Table, Stat } from "../adminShared";
import { type Row, fmtDate, fmtNum, qs, statusTone, td, useAdminGet, act, type Paged } from "../adminApi";

/* ------------------------------ user ------------------------------ */

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  providers: string[];
  balance: number;
  designs: number;
  payments: number;
  lastLoginAt: string | null;
  createdAt: string;
}
export function UsersTab() {
  const { t } = useTranslation();
  const [f, setF] = useState({ q: "", role: "", status: "", page: 1 });
  const q = useAdminGet<Paged & { users: UserRow[] }>(`/admin/users${qs({ ...f, pageSize: 25 })}`);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Panel
      title={t("admin.tabs.users")}
      actions={
        <>
          <SearchBox value={f.q} onChange={(v) => setF({ ...f, q: v, page: 1 })} placeholder={t("admin.users.search")} />
          <Select
            value={f.role}
            onChange={(v) => setF({ ...f, role: v, page: 1 })}
            options={[
              { value: "", label: t("admin.users.allRoles") },
              { value: "ADMIN", label: "ADMIN" },
              { value: "USER", label: "USER" },
            ]}
          />
          <Select
            value={f.status}
            onChange={(v) => setF({ ...f, status: v, page: 1 })}
            options={[
              { value: "", label: t("admin.allStatus") },
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "SUSPENDED", label: "SUSPENDED" },
            ]}
          />
          <ReloadBtn onClick={q.reload} loading={q.loading} />
        </>
      }
    >
      <Loadable {...q} onRetry={q.reload}>
        <Table
          head={[t("admin.users.email"), t("admin.users.role"), t("admin.status"), t("admin.users.balance"), t("admin.users.designs"), t("admin.users.lastLogin")]}
          empty={q.data?.users.length === 0}
        >
          {q.data?.users.map((u) => (
            <tr key={u.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" onClick={() => setOpen(u.id)} data-testid="admin-user-row">
              <td className={td}>
                <p className="font-medium">{u.email}</p>
                <p className="text-xs text-gray-500">
                  {u.name ?? "—"} · {u.providers.join(", ") || "—"}
                </p>
              </td>
              <td className={td}>
                <Chip tone={u.role === "ADMIN" ? "blue" : "gray"}>{u.role}</Chip>
              </td>
              <td className={td}>
                <Chip tone={statusTone(u.status)}>{u.status}</Chip>
              </td>
              <td className={td}>{fmtNum(u.balance)}</td>
              <td className={td}>{u.designs}</td>
              <td className={td}>{fmtDate(u.lastLoginAt)}</td>
            </tr>
          ))}
        </Table>
        {q.data && <Pager page={q.data.page} pageSize={q.data.pageSize} total={q.data.total} onPage={(page) => setF({ ...f, page })} />}
      </Loadable>
      {open && <UserDetail id={open} onClose={() => setOpen(null)} onChanged={q.reload} />}
    </Panel>
  );
}

interface UserDetailData {
  user: { id: string; email: string; name: string | null; role: "USER" | "ADMIN"; status: "ACTIVE" | "SUSPENDED"; hasPassword: boolean; referralCode: string | null; createdAt: string };
  account: { balance: number; items: string[]; extraDesigns: number; extraSiteSlots: number };
  quota: { designs: { used: number; max: number }; sites: { used: number; max: number }; exports: { used: number; free: number; remaining: number } };
  activeSessions: number;
  ledger: { id: string; type: string; amount: number; balanceAfter: number; description: string | null; createdAt: string }[];
  payments: Row[];
  jobs: Row[];
}

function UserDetail({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const { t } = useTranslation();
  const me = useSession((s) => s.user);
  const q = useAdminGet<UserDetailData>(`/admin/users/${id}`);
  const [credit, setCredit] = useState({ amount: "", reason: "" });
  const [quota, setQuota] = useState({ designs: "", sites: "" });
  const [item, setItem] = useState("");
  const [busy, setBusy] = useState(false);
  const d = q.data;
  const self = me?.id === id;
  const done = () => {
    void q.reload();
    onChanged();
  };
  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    const r = await act(fn, ok, done);
    setBusy(false);
    return r;
  };
  const patch = (body: Row) => run(() => api(`/admin/users/${id}`, { method: "PATCH", body }), t("admin.saved"));

  return (
    <Modal open onClose={onClose} size="xl" title={d?.user.email ?? t("admin.users.detail")} testId="admin-user-detail">
      <Loadable {...q} onRetry={q.reload}>
        {!d ? (
          <Spinner />
        ) : (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label={t("admin.users.balance")} value={fmtNum(d.account.balance)} />
              <Stat label={t("admin.users.designs")} value={`${d.quota.designs.used} / ${d.quota.designs.max}`} />
              <Stat label={t("admin.users.sites")} value={`${d.quota.sites.used} / ${d.quota.sites.max}`} />
              <Stat label={t("admin.users.exports")} value={`${d.quota.exports.used} / ${d.quota.exports.free}`} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Chip tone={d.user.role === "ADMIN" ? "blue" : "gray"}>{d.user.role}</Chip>
              <Chip tone={statusTone(d.user.status)}>{d.user.status}</Chip>
              <Chip>{t("admin.users.sessions", { count: d.activeSessions })}</Chip>
              {d.user.referralCode && <Chip>{d.user.referralCode}</Chip>}
              <span className="flex-1" />
              <button
                type="button"
                className={btn.secondary}
                disabled={busy || self}
                onClick={() => patch({ role: d.user.role === "ADMIN" ? "USER" : "ADMIN" })}
                title={self ? t("admin.users.notSelf") : undefined}
              >
                <ShieldCheck className="h-4 w-4" /> {d.user.role === "ADMIN" ? t("admin.users.makeUser") : t("admin.users.makeAdmin")}
              </button>
              <button
                type="button"
                className={d.user.status === "ACTIVE" ? btn.danger : btn.secondary}
                disabled={busy || self}
                onClick={() => patch({ status: d.user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" })}
              >
                <Ban className="h-4 w-4" /> {d.user.status === "ACTIVE" ? t("admin.users.suspend") : t("admin.users.activate")}
              </button>
              <button
                type="button"
                className={btn.secondary}
                disabled={busy || d.activeSessions === 0}
                onClick={() => run(() => api(`/admin/users/${id}/sessions/revoke`, { method: "POST", body: {} }), t("admin.users.revoked"))}
              >
                {t("admin.users.revokeSessions")}
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <form
                className="space-y-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const amount = Number(credit.amount);
                  if (!Number.isFinite(amount) || amount === 0 || !credit.reason.trim()) return;
                  if (await run(() => api(`/admin/users/${id}/credits/adjust`, { body: { amount, reason: credit.reason.trim() } }), t("admin.saved"))) setCredit({ amount: "", reason: "" });
                }}
              >
                <p className="font-semibold">
                  <Coins className="mr-1 inline h-4 w-4" />
                  {t("admin.users.adjustCredits")}
                </p>
                <input className={INPUT} type="number" step="any" placeholder={t("admin.users.amountHint")} value={credit.amount} onChange={(e) => setCredit({ ...credit, amount: e.target.value })} />
                <input className={INPUT} placeholder={t("admin.users.reason")} value={credit.reason} maxLength={200} onChange={(e) => setCredit({ ...credit, reason: e.target.value })} />
                <button className={btn.primary} disabled={busy || !credit.amount || !credit.reason.trim()}>
                  {t("admin.apply")}
                </button>
              </form>
              <form
                className="space-y-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const body = { designs: Number(quota.designs) || undefined, sites: Number(quota.sites) || undefined };
                  if (!body.designs && !body.sites) return;
                  if (await run(() => api(`/admin/users/${id}/quota`, { body }), t("admin.saved"))) setQuota({ designs: "", sites: "" });
                }}
              >
                <p className="font-semibold">{t("admin.users.addQuota")}</p>
                <input className={INPUT} type="number" placeholder={t("admin.users.extraDesigns")} value={quota.designs} onChange={(e) => setQuota({ ...quota, designs: e.target.value })} />
                <input className={INPUT} type="number" placeholder={t("admin.users.extraSites")} value={quota.sites} onChange={(e) => setQuota({ ...quota, sites: e.target.value })} />
                <button className={btn.primary} disabled={busy || (!quota.designs && !quota.sites)}>
                  {t("admin.apply")}
                </button>
              </form>
              <form
                className="space-y-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const itemId = item.trim();
                  if (!itemId) return;
                  if (await run(() => api(`/admin/users/${id}/items`, { body: { itemId } }), t("admin.saved"))) setItem("");
                }}
              >
                <p className="font-semibold">{t("admin.users.grantItem")}</p>
                <input className={INPUT} placeholder="template:company-starter" value={item} onChange={(e) => setItem(e.target.value)} />
                <button className={btn.primary} disabled={busy || !item.trim()}>
                  {t("admin.users.grant")}
                </button>
              </form>
            </div>

            <div>
              <p className="mb-1 font-semibold">{t("admin.users.items", { count: d.account.items.length })}</p>
              <div className="flex max-h-32 flex-wrap gap-1.5 overflow-auto">
                {d.account.items.length === 0 && <span className="text-gray-500">—</span>}
                {d.account.items.map((k) => (
                  <span key={k} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-white/10">
                    {k}
                    <button
                      type="button"
                      aria-label={t("admin.users.revokeItem")}
                      className="text-gray-400 hover:text-rose-600"
                      disabled={busy}
                      onClick={() => run(() => api(`/admin/users/${id}/items/${encodeURIComponent(k)}`, { method: "DELETE" }), t("admin.saved"))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1 font-semibold">{t("admin.users.ledger")}</p>
              <Table head={[t("admin.date"), t("admin.type"), t("admin.amount"), t("admin.users.balance"), t("admin.note")]} empty={d.ledger.length === 0}>
                {d.ledger.map((l) => (
                  <tr key={l.id}>
                    <td className={td}>{fmtDate(l.createdAt)}</td>
                    <td className={td}>{l.type}</td>
                    <td className={`${td} ${l.amount < 0 ? "text-rose-600" : "text-emerald-600"}`}>{l.amount > 0 ? `+${l.amount}` : l.amount}</td>
                    <td className={td}>{l.balanceAfter}</td>
                    <td className={td}>{l.description ?? "—"}</td>
                  </tr>
                ))}
              </Table>
            </div>
          </div>
        )}
      </Loadable>
    </Modal>
  );
}

/* ------------------------------ template ------------------------------ */
