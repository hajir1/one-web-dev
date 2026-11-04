import { useCallback, useEffect,  useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Boxes,
  CreditCard,
  History,
  LayoutTemplate,
  Package,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import { Link } from "../../components/app/LocaleLink";
import {   Notice, Panel } from "../../components/app/ui";
import { isAdmin, mfaStatus, useSession, type MfaStatus } from "../../auth/session";
import MfaPanel from "../../components/app/MfaPanel";
import { isBackendConfigured } from "../media/processing/apiConfig";
import { Spinner } from "./adminShared";
import { OverviewTab } from "./tabs/OverviewTab";
import { UsersTab } from "./tabs/UsersTab";
import { TemplatesTab } from "./tabs/TemplatesTab";
import { CatalogTab } from "./tabs/CatalogTab";
import { PackagesTab } from "./tabs/PackagesTab";
import { PaymentsTab, JobsTab } from "./tabs/PaymentsJobsTab";
import { PythonTab } from "./tabs/PythonTab";
import { AuditTab } from "./tabs/AuditTab";

/* ================================================================== */
/* Admin panel. All data & actions go through the backend /admin/* endpoints; */
/* this page stores nothing itself. Access rights are decided by the     */
/* server (403 when not ADMIN); the role check here is UI only.         */
/* ================================================================== */

const TABS = ["overview", "users", "templates", "catalog", "packages", "payments", "jobs", "python", "audit"] as const;
type Tab = (typeof TABS)[number];
const TAB_ICON: Record<Tab, typeof Users> = {
  overview: Activity,
  users: Users,
  templates: LayoutTemplate,
  catalog: Boxes,
  packages: Package,
  payments: CreditCard,
  jobs: Server,
  python: Server,
  audit: History,
};


/* ------------------------------ kerangka ------------------------------ */

export default function AdminPage() {
  const { t } = useTranslation();
  const status = useSession((s) => s.status);
  const user = useSession((s) => s.user);
  const [params, setParams] = useSearchParams();
  const tab = (TABS as readonly string[]).includes(params.get("tab") ?? "") ? (params.get("tab") as Tab) : "overview";
  const setTab = (v: Tab) => setParams((p) => (p.set("tab", v), p), { replace: true });

  let body: ReactNode;
  if (!isBackendConfigured()) body = <Notice tone="warn">{t("errors.billingUnavailable")}</Notice>;
  else if (status === "idle" || status === "loading") body = <Spinner />;
  else if (status === "unavailable") body = <Notice tone="error">{t("admin.unavailable")}</Notice>;
  else if (!user)
    body = (
      <Notice tone="info" title={t("admin.signInTitle")}>
        <Link to="/signin?next=/admin" className="font-semibold underline">
          {t("auth.signIn")}
        </Link>
      </Notice>
    );
  else if (!isAdmin(user)) body = <Notice tone="error">{t("admin.forbidden")}</Notice>;
  else
    body = (
      <AdminMfaGate>
        <nav className="flex flex-wrap gap-1.5" role="tablist" aria-label={t("admin.title")}>
          {TABS.map((k) => {
            const Icon = TAB_ICON[k];
            return (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                data-testid={`admin-tab-${k}`}
                onClick={() => setTab(k)}
                className={`${tab === k ? "bg-brand-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"} inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium dark:border-gray-800`}
              >
                <Icon className="h-4 w-4" /> {t(`admin.tabs.${k}`)}
              </button>
            );
          })}
        </nav>
        {tab === "overview" && <OverviewTab />}
        {tab === "users" && <UsersTab />}
        {tab === "templates" && <TemplatesTab />}
        {tab === "catalog" && <CatalogTab />}
        {tab === "packages" && <PackagesTab />}
        {tab === "payments" && <PaymentsTab />}
        {tab === "jobs" && <JobsTab />}
        {tab === "python" && <PythonTab />}
        {tab === "audit" && <AuditTab />}
      </AdminMfaGate>
    );

  return (
    <div className="space-y-5" data-testid="admin-page">
      <AppMeta title={t("admin.title")} description={t("admin.description")} />
      <PageHeader icon={ShieldCheck} title={t("admin.title")} description={t("admin.description")} />
      {body}
    </div>
  );
}

/**
 * The admin panel requires a session that has passed 2FA (the server rejects with 403
 * MFA_REQUIRED / MFA_NOT_ENROLLED). Admins enroll or enter a code here.
 */
function AdminMfaGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [st, setSt] = useState<MfaStatus | null | "error">(null);
  const load = useCallback(() => {
    mfaStatus().then(setSt, () => setSt("error"));
  }, []);
  useEffect(load, [load]);
  if (st === null) return <Spinner />;
  if (st !== "error" && st.requiredForAdmin && !st.sessionVerified)
    return (
      <Panel title={t("mfa.adminTitle")} description={t("mfa.description")}>
        <MfaPanel onVerified={load} compact />
      </Panel>
    );
  return <>{children}</>;
}
