import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Download, Eye, EyeOff, Inbox, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Link } from "../components/app/LocaleLink";
import { Notice, btn } from "../components/app/ui";
import { notify } from "../components/app/Toaster";
import { isDemoMode } from "../demo/demoMode";
import { useSession } from "../auth/session";
import { triggerDownload } from "../pages/Data/shared/downloadUtils";
import { formatDate } from "../pages/pageMaker/core/helpers/formatDate";
import {
  deleteSubmission,
  downloadCsv,
  ensureEndpoint,
  listSubmissions,
  setShowWishes,
  setSubmissionHidden,
  type FormEndpoint,
  type ProjectType,
  type Submission,
  type SubmissionKind,
} from "./api";

/* ================================================================== */
/* The "Submissions" panel (v20): RSVPs, wishes, and form entries from sites */
/* that are already online. Used in Studio (websites) and the template editor */
/* code (invitations). Demo mode: explanation + sample, no server.      */
/* ================================================================== */

const KINDS: (SubmissionKind | "all")[] = ["all", "rsvp", "ucapan", "form"];

const SAMPLE: Submission[] = [
  { id: "s1", kind: "rsvp", data: { nama: "Budi Santoso", hadir: "Insyaallah hadir", jumlah: "2" }, hidden: false, createdAt: "2026-10-30T09:12:00Z" },
  { id: "s2", kind: "ucapan", data: { nama: "Sari", teks: "Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah." }, hidden: false, createdAt: "2026-10-30T08:40:00Z" },
  { id: "s3", kind: "form", data: { nama: "Andi", email: "andi@contoh.id", pesan: "Saya ingin tanya harga paket." }, hidden: false, createdAt: "2026-10-29T15:05:00Z" },
];

function Row({ s, onHide, onDelete, busy }: { s: Submission; onHide?: () => void; onDelete?: () => void; busy?: boolean }) {
  const { t } = useTranslation();
  return (
    <li className={`rounded-xl border border-gray-200 px-3 py-2.5 dark:border-gray-800 ${s.hidden ? "opacity-60" : ""}`} data-testid="submission">
      <div className="mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">{t(`kiriman.kind.${s.kind}`)}</span>
        <span>{formatDate(Date.parse(s.createdAt))}</span>
        {s.hidden && <span className="font-semibold">{t("kiriman.hiddenBadge")}</span>}
        <span className="ml-auto flex items-center">
          {onHide && s.kind === "ucapan" && (
            <button type="button" className={`${btn.icon} !h-7 !w-7`} onClick={onHide} disabled={busy} title={s.hidden ? t("kiriman.show") : t("kiriman.hide")} aria-label={s.hidden ? t("kiriman.show") : t("kiriman.hide")}>
              {s.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          )}
          {onDelete && (
            <button type="button" className={`${btn.icon} !h-7 !w-7 hover:!text-rose-600`} onClick={onDelete} disabled={busy} title={t("common.delete")} aria-label={t("common.delete")}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </span>
      </div>
      <dl className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-3 gap-y-0.5 text-sm">
        {Object.entries(s.data).map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="truncate text-xs font-semibold text-gray-500 dark:text-gray-400">{k}</dt>
            <dd className="whitespace-pre-wrap break-words text-gray-800 dark:text-white/90">{v}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

export default function SubmissionsPanel({ projectType, projectId, projectName, invitation = false }: { projectType: ProjectType; projectId: string; projectName: string; invitation?: boolean }) {
  const { t } = useTranslation();
  const session = useSession((s) => s.status);
  const demo = isDemoMode();
  const [ep, setEp] = useState<FormEndpoint | null>(null);
  const [kind, setKind] = useState<SubmissionKind | "all">("all");
  const [items, setItems] = useState<Submission[]>([]);
  const [counts, setCounts] = useState<Partial<Record<SubmissionKind, number>>>({});
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(
    async (endpoint: FormEndpoint, k: SubmissionKind | "all", before: string | null = null) => {
      setLoading(true);
      setError(null);
      try {
        const page = await listSubmissions(endpoint.id, { kind: k === "all" ? undefined : k, before });
        setItems((prev) => (before ? [...prev, ...page.submissions] : page.submissions));
        setNext(page.nextBefore);
        setCounts(page.counts);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (demo || session !== "authenticated") return;
    let alive = true;
    ensureEndpoint(projectType, projectId, projectName).then(
      (e) => {
        if (!alive) return;
        setEp(e);
        void load(e, "all");
      },
      (e) => alive && setError(e instanceof Error ? e.message : String(e)),
    );
    return () => {
      alive = false;
    };
  }, [demo, session, projectType, projectId, projectName, load]);

  if (demo)
    return (
      <div className="flex flex-col gap-3" data-testid="kiriman-demo">
        <Notice tone="info" title={t("kiriman.demoTitle")}>
          {t(invitation ? "kiriman.demoTextInvite" : "kiriman.demoTextSite")}
        </Notice>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t("kiriman.sample")}</p>
        <ul className="pointer-events-none flex flex-col gap-2 select-none" aria-hidden>
          {SAMPLE.map((s) => (
            <Row key={s.id} s={s} />
          ))}
        </ul>
      </div>
    );

  if (session !== "authenticated")
    return (
      <Notice tone="info" title={t("kiriman.signinTitle")} testId="kiriman-signin">
        {t("kiriman.signinText")}{" "}
        <Link to="/signin" className="font-semibold underline">
          {t("kiriman.signin")}
        </Link>
      </Notice>
    );

  const change = (k: SubmissionKind | "all") => {
    setKind(k);
    if (ep) void load(ep, k);
  };

  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);

  return (
    <div className="flex flex-col gap-3" data-testid="kiriman-panel">
      {ep && (
        <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
          <p className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300">{t("kiriman.address")}</p>
          <div className="flex gap-1.5">
            <code className="min-w-0 flex-1 truncate rounded bg-gray-100 px-2 py-1.5 text-xs dark:bg-white/10" data-testid="kiriman-url">
              {ep.submitUrl}
            </code>
            <button
              type="button"
              className={`${btn.secondary} !px-2.5 !py-1.5 shrink-0 text-xs`}
              onClick={() => navigator.clipboard?.writeText(ep.submitUrl).then(() => notify.success(t("kiriman.copied")), () => {})}
            >
              <Copy className="h-3.5 w-3.5" /> {t("kiriman.copy")}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{t(invitation ? "kiriman.addressHintInvite" : "kiriman.addressHintSite")}</p>
          {invitation && (
            <label className="mt-2 flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={ep.showWishes}
                onChange={async (e) => {
                  const on = e.target.checked;
                  try {
                    setEp(await setShowWishes(ep.id, on));
                  } catch (err) {
                    notify.error(err instanceof Error ? err.message : String(err));
                  }
                }}
              />
              {t("kiriman.showWishes")}
            </label>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1" role="tablist">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            onClick={() => change(k)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${kind === k ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"}`}
          >
            {t(`kiriman.kind.${k}`)} {k === "all" ? total : (counts[k] ?? 0)}
          </button>
        ))}
        <span className="ml-auto flex gap-1">
          <button type="button" className={btn.icon} onClick={() => ep && load(ep, kind)} title={t("kiriman.refresh")} aria-label={t("kiriman.refresh")} disabled={!ep || loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            className={btn.icon}
            disabled={!ep || total === 0}
            title={t("kiriman.csv")}
            aria-label={t("kiriman.csv")}
            onClick={async () => {
              if (!ep) return;
              try {
                const f = await downloadCsv(ep.id, kind === "all" ? undefined : kind);
                triggerDownload(f.blob, f.fileName);
              } catch (e) {
                notify.error(e instanceof Error ? e.message : String(e));
              }
            }}
          >
            <Download className="h-4 w-4" />
          </button>
        </span>
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {!ep && !error && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}
      {ep && !loading && items.length === 0 && !error && (
        <p className="flex flex-col items-center gap-2 py-6 text-center text-sm text-gray-500 dark:text-gray-400" data-testid="kiriman-empty">
          <Inbox className="h-6 w-6" />
          {t("kiriman.empty")}
        </p>
      )}
      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((s) => (
            <Row
              key={s.id}
              s={s}
              busy={busyId === s.id}
              onHide={async () => {
                if (!ep) return;
                setBusyId(s.id);
                try {
                  await setSubmissionHidden(ep.id, s.id, !s.hidden);
                  setItems((list) => list.map((x) => (x.id === s.id ? { ...x, hidden: !s.hidden } : x)));
                } catch (e) {
                  notify.error(e instanceof Error ? e.message : String(e));
                } finally {
                  setBusyId(null);
                }
              }}
              onDelete={async () => {
                if (!ep || !window.confirm(t("kiriman.confirmDelete"))) return;
                setBusyId(s.id);
                try {
                  await deleteSubmission(ep.id, s.id);
                  setItems((list) => list.filter((x) => x.id !== s.id));
                  setCounts((c) => ({ ...c, [s.kind]: Math.max(0, (c[s.kind] ?? 1) - 1) }));
                } catch (e) {
                  notify.error(e instanceof Error ? e.message : String(e));
                } finally {
                  setBusyId(null);
                }
              }}
            />
          ))}
        </ul>
      )}
      {next && ep && (
        <button type="button" className={`${btn.ghost} self-center text-xs`} disabled={loading} onClick={() => load(ep, kind, next)}>
          {t("kiriman.more")}
        </button>
      )}
    </div>
  );
}
