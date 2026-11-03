import {  useEffect,  useState } from "react";
import { useTranslation } from "react-i18next";
import {    Panel, btn } from "../../../components/app/ui";
import { Loadable, ReloadBtn, Select, Table } from "../adminShared";
import { fmtDate, qs, td, useAdminGet } from "../adminApi";

interface AuditRow {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: unknown;
  ip: string | null;
  createdAt: string;
}

/** Jejak audit semua perubahan oleh admin (dicatat server, tidak bisa diubah dari panel). */
export function AuditTab() {
  const { t } = useTranslation();
  const [cursor, setCursor] = useState<string | null>(null);
  const [action, setAction] = useState("");
  const [rows, setRows] = useState<AuditRow[]>([]);
  const q = useAdminGet<{ items: AuditRow[]; nextCursor: string | null }>(`/admin/audit${qs({ cursor: cursor ?? undefined, limit: 50, action: action || undefined })}`);
  useEffect(() => {
    if (q.data) setRows((prev) => (cursor ? [...prev, ...q.data!.items.filter((r) => !prev.some((p) => p.id === r.id))] : q.data!.items));
  }, [q.data, cursor]);
  return (
    <Panel
      title={t("admin.tabs.audit")}
      description={t("admin.audit.description")}
      actions={
        <>
          <Select
            value={action}
            onChange={(v) => (setCursor(null), setRows([]), setAction(v))}
            options={[
              { value: "", label: t("admin.audit.allActions") },
              { value: "ADMIN_FREE_USAGE", label: t("admin.audit.adminFreeUsage") },
            ]}
          />
          <ReloadBtn onClick={() => (setCursor(null), void q.reload())} loading={q.loading} />
        </>
      }
    >
      <Loadable {...q} onRetry={q.reload}>
        <Table head={[t("admin.date"), "Admin", t("admin.audit.action"), t("admin.audit.target"), "IP"]} empty={rows.length === 0}>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={td}>{fmtDate(r.createdAt)}</td>
              <td className={td}>{r.adminEmail}</td>
              <td className={td}>
                <span className="font-mono text-xs">{r.action}</span>
                {r.details ? <pre className="mt-1 max-w-md overflow-x-auto whitespace-pre-wrap text-[11px] text-gray-500">{JSON.stringify(r.details)}</pre> : null}
              </td>
              <td className={td}>
                {r.targetType}:{" "}
                <span className="font-mono text-xs">{r.targetId}</span>
              </td>
              <td className={td}>{r.ip ?? "—"}</td>
            </tr>
          ))}
        </Table>
        {q.data?.nextCursor && (
          <div className="mt-3 text-center">
            <button type="button" className={btn.secondary} onClick={() => setCursor(q.data!.nextCursor)}>
              {t("admin.audit.more")}
            </button>
          </div>
        )}
      </Loadable>
    </Panel>
  );
}
