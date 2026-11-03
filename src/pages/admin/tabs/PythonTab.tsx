import { useTranslation } from "react-i18next";
import { Chip,  Notice, Panel } from "../../../components/app/ui";
import { Loadable, PythonChip, ReloadBtn, Spinner, Table } from "../adminShared";
import { fmtDate, td, useAdminGet } from "../adminApi";

export function PythonTab() {
  const { t } = useTranslation();
  const q = useAdminGet<{ health: PythonHealth; features: Record<string, { enabled: boolean; python: boolean; ready?: boolean }> }>("/admin/python");
  const d = q.data;
  return (
    <Panel title={t("admin.tabs.python")} description={t("admin.python.hint")} actions={<ReloadBtn onClick={q.reload} loading={q.loading} />}>
      <Loadable {...q} onRetry={q.reload}>
        {d ? (
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <PythonChip h={d.health} />
              {d.health.checkedAt && <span className="text-xs text-gray-500">{fmtDate(d.health.checkedAt)}</span>}
            </div>
            {d.health.error && <Notice tone="error">{d.health.error}</Notice>}
            {d.health.configured && (
              <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  [t("admin.python.version"), d.health.version ?? "—"],
                  [t("admin.python.workers"), d.health.workers ?? "—"],
                  [t("admin.python.queued"), d.health.queue ? `${d.health.queue.queued ?? 0} / ${d.health.queue.max ?? "—"}` : "—"],
                  [t("admin.python.running"), d.health.queue?.running ?? "—"],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
                    <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
                    <dd className="font-semibold text-gray-800 dark:text-white/90">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Table head={[t("admin.jobs.feature"), t("admin.active"), t("admin.jobs.executor"), t("admin.python.ready")]}>
              {Object.entries(d.features).map(([k, v]) => {
                const info = d.health.detail?.[k];
                return (
                  <tr key={k}>
                    <td className={td}>{k}</td>
                    <td className={td}>
                      <Chip tone={v.enabled ? "green" : "gray"}>{v.enabled ? t("admin.yes") : t("admin.no")}</Chip>
                    </td>
                    <td className={td}>{v.python ? "PYTHON" : "LOCAL"}</td>
                    <td className={td}>
                      <Chip tone={v.ready ? "green" : "rose"}>{v.ready ? t("admin.yes") : t("admin.no")}</Chip>
                      {v.python && info && !info.ready && info.reason ? <span className="ml-2 text-xs text-gray-500">{info.reason}</span> : null}
                    </td>
                  </tr>
                );
              })}
            </Table>
          </div>
        ) : (
          <Spinner />
        )}
      </Loadable>
    </Panel>
  );
}

interface PythonHealth {
  configured: boolean;
  ok: boolean | null;
  features?: string[];
  checkedAt?: string;
  error?: string;
  version?: string;
  workers?: number;
  queue?: { queued?: number; running?: number; max?: number };
  detail?: Record<string, { enabled?: boolean; ready?: boolean; reason?: string }>;
}

/* ------------------------------ audit ------------------------------ */
