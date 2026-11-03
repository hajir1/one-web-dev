import { useTranslation } from "react-i18next";
import { Chip,   Panel } from "../../../components/app/ui";
import { formatIdr } from "../../../config/pricing";
import { Loadable, PythonChip, ReloadBtn, Spinner, Stat } from "../adminShared";
import { fmtNum, useAdminGet } from "../adminApi";

/* ------------------------------ ringkasan ------------------------------ */

interface Overview {
  users: { total: number; admins: number; activeToday: number; suspended: number };
  revenue: { currency: string; payments: number; amount: number }[];
  creditsOutstanding: number;
  pendingPayments: number;
  jobs: Record<string, number>;
  templates: Record<string, number>;
  features: Record<string, { enabled: boolean; python: boolean }>;
  python: { configured: boolean; ok: boolean | null; error?: string };
}


export function OverviewTab() {
  const { t } = useTranslation();
  const q = useAdminGet<Overview>("/admin/overview");
  const d = q.data;
  return (
    <Panel title={t("admin.tabs.overview")} actions={<ReloadBtn onClick={q.reload} loading={q.loading} />}>
      <Loadable {...q} onRetry={q.reload}>
        {d ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label={t("admin.overview.users")} value={fmtNum(d.users.total)} />
              <Stat label={t("admin.overview.activeToday")} value={fmtNum(d.users.activeToday)} />
              <Stat label={t("admin.overview.credits")} value={fmtNum(d.creditsOutstanding)} />
              <Stat label={t("admin.overview.pending")} value={fmtNum(d.pendingPayments)} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Stat
                label={t("admin.overview.revenue")}
                value={d.revenue.length ? d.revenue.map((r) => `${r.currency === "IDR" ? formatIdr(r.amount) : `${r.currency} ${r.amount.toLocaleString()}`} (${r.payments})`).join(" · ") : "—"}
              />
              <Stat label={t("admin.overview.jobs")} value={Object.entries(d.jobs).map(([k, v]) => `${k} ${v}`).join(" · ") || "—"} />
              <Stat label={t("admin.overview.templates")} value={Object.entries(d.templates).map(([k, v]) => `${k} ${v}`).join(" · ") || "—"} />
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Chip tone={d.users.suspended ? "rose" : "gray"}>{t("admin.overview.suspended", { count: d.users.suspended })}</Chip>
              <Chip tone="blue">{t("admin.overview.admins", { count: d.users.admins })}</Chip>
              <PythonChip h={d.python} />
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </Loadable>
    </Panel>
  );
}
