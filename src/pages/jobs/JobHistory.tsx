import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Download, History, Loader2, Mail, RefreshCw } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import { Navigate } from "../../components/app/LocaleLink";
import { Chip, Notice, Panel, Segmented, Toggle, btn } from "../../components/app/ui";
import { api, ApiError } from "../../api/client";
import { useSession } from "../../auth/session";
import { currentLang, LANG_LABEL } from "../../i18n";
import { featureName, formatCredits, type ServerFeatureId } from "../media/processing/pricing";
import { jobErrorMessage } from "../media/processing/serverClient";
import { formatSize } from "../Data/shared/excelUtils";
import { useJobPrefs } from "./jobPrefs";
import { historyQuery, type HistoryItem, type HistoryPage } from "./history";

type Group = "all" | "media" | "data" | "vr";
type Status = "all" | "succeeded" | "failed" | "running";

const STATE_TONE: Record<string, "green" | "rose" | "amber" | "gray"> = { succeeded: "green", failed: "rose", cancelled: "gray", running: "amber", queued: "amber" };

/** v7 (P1): /:lang/job-history — server job history (Media, Data, VR) + re-download results. */
export default function JobHistory() {
  const { t } = useTranslation();
  const planPaid = (j: HistoryItem) =>
    t("jobs.paid.plan", {
      what: j.charged.videoSeconds ? t("jobs.planChargedVideo", { minutes: Math.max(1, Math.ceil(j.charged.videoSeconds / 60)) }) : t("jobs.planCharged", { units: j.charged.units ?? 0 }),
    });
  const status = useSession((s) => s.status);
  const [params] = useSearchParams();
  const highlight = params.get("job");
  const [group, setGroup] = useState<Group>("all");
  const [state, setState] = useState<Status>("all");
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { notify, setNotify } = useJobPrefs();

  const load = useCallback(
    async (more: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const page = await api<HistoryPage>(historyQuery({ group, status: state, cursor: more }));
        setItems((cur) => (more ? [...cur, ...page.items] : page.items));
        setCursor(page.nextCursor);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : t("errors.unknown"));
      } finally {
        setLoading(false);
      }
    },
    [group, state, t],
  );

  useEffect(() => {
    if (status === "authenticated") void load(null);
  }, [status, load]);

  if (status === "anonymous") return <Navigate to="/signin?next=/job-history" replace />;

  const download = async (job: HistoryItem) => {
    setDownloading(job.id);
    try {
      const r = await api<{ url: string; fileName: string }>(`/jobs/history/${job.id}/download`);
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.fileName;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      if (e instanceof ApiError && e.status === 410) setItems((cur) => cur.map((x) => (x.id === job.id ? { ...x, downloadable: false } : x)));
      setError(e instanceof ApiError ? e.message : t("errors.unknown"));
    } finally {
      setDownloading(null);
    }
  };

  const locale = LANG_LABEL[currentLang()].locale;
  const when = (iso: string) => new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <AppMeta title={t("jobs.title")} description={t("jobs.description")} />
      <div className="flex flex-col gap-5" data-testid="job-history">
        <PageHeader icon={History} title={t("jobs.title")} description={t("jobs.description")} crumbs={[{ label: t("nav.account") }, { label: t("jobs.title") }]} />

        <Panel>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <Toggle checked={notify} onChange={setNotify} label={<span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" /> {t("jobs.notify")}</span>} hint={t("jobs.notifyHint")} />
          </div>
        </Panel>

        <Panel
          title={t("jobs.listTitle")}
          actions={
            <button type="button" className={btn.icon} onClick={() => void load(null)} disabled={loading} aria-label={t("jobs.reload")}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          }
        >
          <div className="mb-4 flex flex-wrap gap-3">
            <Segmented<Group>
              value={group}
              onChange={setGroup}
              label={t("jobs.filterGroup")}
              options={(["all", "media", "data", "vr"] as Group[]).map((g) => ({ value: g, label: g === "all" ? t("jobs.all") : t(`nav.sections.${g}.name`) }))}
            />
            <Segmented<Status> value={state} onChange={setState} label={t("jobs.filterStatus")} options={(["all", "succeeded", "failed", "running"] as Status[]).map((s) => ({ value: s, label: t(`jobs.status.${s}`) }))} />
          </div>
          {error && (
            <div className="mb-3">
              <Notice tone="error" onDismiss={() => setError(null)}>
                {error}
              </Notice>
            </div>
          )}
          {!loading && items.length === 0 && !error ? (
            <p className="py-8 text-center text-sm text-gray-500" data-testid="job-history-empty">
              {t("jobs.empty")}
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800" data-testid="job-history-list">
              {items.map((j) => (
                <li key={j.id} className={`flex flex-col gap-2 py-3 sm:flex-row sm:items-center ${j.id === highlight ? "rounded-lg bg-brand-25 px-2 dark:bg-brand-500/5" : ""}`}>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/90">
                      <span className="truncate">{j.inputName}</span>
                      <Chip tone={STATE_TONE[j.state] ?? "gray"}>{t(`jobs.state.${j.state}`, { defaultValue: j.state })}</Chip>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {featureName(j.feature as ServerFeatureId)} · {formatSize(j.inputBytes)} · {when(j.createdAt)}
                      {j.state === "succeeded" && (
                        <>
                          {" "}
                          · {j.paidBy === "plan" ? planPaid(j) : j.paidBy === "pack" ? t("jobs.paid.pack", { n: j.charged.packUses }) : j.paidBy === "free" ? t("jobs.paid.free") : j.paidBy === "team" ? t("jobs.paid.team", { cost: formatCredits(j.charged.credits), team: j.teamName ?? "" }) : formatCredits(j.charged.credits)}
                        </>
                      )}
                    </p>
                    {j.state === "failed" && j.error && <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-300">{jobErrorMessage(j.error)}</p>}
                    {j.state === "succeeded" && j.expiresAt && <p className="mt-0.5 text-[11px] text-gray-400">{j.downloadable ? t("jobs.keptUntil", { date: when(j.expiresAt) }) : t("jobs.expired")}</p>}
                  </div>
                  {j.state === "succeeded" && (
                    <button type="button" className={`${btn.secondary} shrink-0`} disabled={!j.downloadable || downloading === j.id} onClick={() => void download(j)} data-testid={`job-download-${j.id}`}>
                      {downloading === j.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {t("jobs.download")}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {cursor && (
            <button type="button" className={`${btn.secondary} mt-3 w-full`} onClick={() => void load(cursor)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {t("jobs.more")}
            </button>
          )}
        </Panel>
      </div>
    </>
  );
}
