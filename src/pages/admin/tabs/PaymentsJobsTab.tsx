import {    useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../../../components/app/LocaleLink";
import { Chip,   Panel, btn } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import {  api } from "../../../api/client";
import { formatIdr } from "../../../config/pricing";
import { Loadable, Pager, ReloadBtn, SearchBox, Select, Table } from "../adminShared";
import { type Row, fmtDate, fmtNum, qs, statusTone, td, useAdminGet, act, type Paged } from "../adminApi";

export function PaymentsTab() {
  const { t } = useTranslation();
  const [f, setF] = useState({ q: "", status: "", page: 1 });
  const q = useAdminGet<Paged & { payments: Row[] }>(`/admin/payments${qs({ ...f, pageSize: 25 })}`);
  /** Refund: nominal (kosong = sisa penuh), alasan, dan apakah diteruskan ke Midtrans. */
  const refund = (p: Row) => {
    const remaining = Number(p.amount) - Number(p.refundAmount ?? 0);
    const raw = window.prompt(t("admin.refund.amountPrompt", { max: formatIdr(remaining) }), String(remaining));
    if (raw === null) return;
    const amount = Number(raw.replace(/\D/g, ""));
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > remaining) return notify.error(t("admin.refund.amountInvalid"));
    const reason = window.prompt(t("admin.refund.reasonPrompt"))?.trim();
    if (!reason || reason.length < 3) return;
    const viaProvider = window.confirm(t("admin.refund.viaProvider"));
    void act(
      () => api(`/admin/payments/${String(p.id)}/refund`, { body: { amount, reason, viaProvider } }),
      t("admin.refund.done"),
      q.reload,
    );
  };
  return (
    <Panel
      title={t("admin.tabs.payments")}
      actions={
        <>
          <SearchBox value={f.q} onChange={(v) => setF({ ...f, q: v, page: 1 })} placeholder={t("admin.users.search")} />
          <Select
            value={f.status}
            onChange={(v) => setF({ ...f, status: v, page: 1 })}
            options={[{ value: "", label: t("admin.allStatus") }, ...["PENDING", "PAID", "FAILED", "EXPIRED", "CANCELLED", "REFUNDED"].map((s) => ({ value: s, label: s }))]}
          />
          <ReloadBtn onClick={q.reload} loading={q.loading} />
        </>
      }
    >
      <Loadable {...q} onRetry={q.reload}>
        <Table head={[t("admin.date"), t("admin.users.email"), t("admin.packages.credits"), t("admin.amount"), "Gateway", t("admin.status"), t("admin.refund.invoice"), ""]} empty={q.data?.payments.length === 0}>
          {q.data?.payments.map((p) => (
            <tr key={String(p.id)}>
              <td className={td}>{fmtDate(p.createdAt)}</td>
              <td className={td}>{String(p.email)}</td>
              <td className={td}>{fmtNum(p.credits)}</td>
              <td className={td}>
                {p.currency === "IDR" ? formatIdr(Number(p.amount)) : `${String(p.currency)} ${fmtNum(p.amount)}`}
              </td>
              <td className={td}>{String(p.provider)}</td>
              <td className={td}>
                <Chip tone={statusTone(p.status)}>{String(p.status)}</Chip>
                {typeof p.refundAmount === "number" && p.refundAmount > 0 && <span className="ml-1 text-xs text-rose-600">−{formatIdr(p.refundAmount)}</span>}
              </td>
              <td className={td}>
                {p.invoiceNumber ? (
                  <Link to={`/invoice/${String(p.id)}`} target="_blank" className="font-mono text-xs text-brand-600 hover:underline">
                    {String(p.invoiceNumber)}
                  </Link>
                ) : (
                  "—"
                )}
              </td>
              <td className={td}>
                {p.status === "PAID" && (
                  <button type="button" className={btn.ghost} onClick={() => refund(p)} data-testid="admin-refund">
                    {t("admin.refund.action")}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
        {q.data && <Pager page={q.data.page} pageSize={q.data.pageSize} total={q.data.total} onPage={(page) => setF({ ...f, page })} />}
      </Loadable>
    </Panel>
  );
}

export function JobsTab() {
  const { t } = useTranslation();
  const [f, setF] = useState({ q: "", status: "", kind: "", page: 1 });
  const q = useAdminGet<Paged & { jobs: Row[] }>(`/admin/jobs${qs({ ...f, pageSize: 25 })}`);
  return (
    <Panel
      title={t("admin.tabs.jobs")}
      actions={
        <>
          <SearchBox value={f.q} onChange={(v) => setF({ ...f, q: v, page: 1 })} placeholder={t("admin.jobs.search")} />
          <Select
            value={f.status}
            onChange={(v) => setF({ ...f, status: v, page: 1 })}
            options={[{ value: "", label: t("admin.allStatus") }, ...["QUEUED", "RUNNING", "SUCCEEDED", "FAILED", "CANCELLED"].map((s) => ({ value: s, label: s }))]}
          />
          <Select
            value={f.kind}
            onChange={(v) => setF({ ...f, kind: v, page: 1 })}
            options={[
              { value: "", label: t("admin.jobs.allExecutors") },
              { value: "LOCAL", label: "LOCAL" },
              { value: "PYTHON", label: "PYTHON" },
            ]}
          />
          <ReloadBtn onClick={q.reload} loading={q.loading} />
        </>
      }
    >
      <Loadable {...q} onRetry={q.reload}>
        <Table head={[t("admin.date"), t("admin.users.email"), t("admin.jobs.feature"), t("admin.jobs.executor"), t("admin.status"), t("admin.jobs.charged")]} empty={q.data?.jobs.length === 0}>
          {q.data?.jobs.map((j) => {
            const charged = (j.charged ?? {}) as { credits?: number; packUses?: number };
            return (
              <tr key={String(j.id)}>
                <td className={td}>{fmtDate(j.createdAt)}</td>
                <td className={td}>{String(j.email)}</td>
                <td className={td}>
                  <p>{String(j.feature)}</p>
                  <p className="max-w-[16rem] truncate text-xs text-gray-500">{String(j.inputName ?? "")}</p>
                </td>
                <td className={td}>{String(j.executor)}</td>
                <td className={td}>
                  <Chip tone={statusTone(j.status)}>{String(j.status)}</Chip>
                  {typeof j.error === "string" && j.error && <p className="max-w-[16rem] truncate text-xs text-rose-600">{j.error}</p>}
                </td>
                <td className={td}>
                  {fmtNum(charged.credits ?? 0)}
                  {charged.packUses ? ` · ${charged.packUses} pack` : ""}
                </td>
              </tr>
            );
          })}
        </Table>
        {q.data && <Pager page={q.data.page} pageSize={q.data.pageSize} total={q.data.total} onPage={(page) => setF({ ...f, page })} />}
      </Loadable>
    </Panel>
  );
}

/* ------------------------------ pekerja Python ------------------------------ */
