// ─── components/app/AdminFreeBadge.tsx ───────────────────────────────────────
// v6: "Admin: no credits" indicator. The status comes from the backend session profile
// (`adminFree`), not from a user choice; the badge is informational only.

import { useTranslation } from "react-i18next";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useSession } from "../../auth/session";
import { Link } from "./LocaleLink";

/** true = validated admin session; every feature without credits. */
export const useAdminFree = () => useSession((s) => s.user?.adminFree === true);
/** true = admin whose session has not passed 2FA yet. */
const useAdminFreePending = () => useSession((s) => s.user?.adminFreePendingMfa === true);

/** Small badge (header, access card). Not rendered for regular users. */
export function AdminFreeBadge({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const { t } = useTranslation();
  const free = useAdminFree();
  const pending = useAdminFreePending();
  if (!free && !pending) return null;
  const tone = free
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
    : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300";
  const Icon = free ? ShieldCheck : ShieldAlert;
  const body = (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone} ${className}`}
      title={t(free ? "adminFree.badgeTitle" : "adminFree.pendingTitle")}
      data-testid="admin-free-badge"
    >
      <Icon className="h-3 w-3" aria-hidden />
      <span className={compact ? "sr-only sm:not-sr-only" : ""}>{t(free ? "adminFree.badge" : "adminFree.pendingBadge")}</span>
    </span>
  );
  return free ? body : <Link to="/admin">{body}</Link>;
}

/** Explanation box (Credits page, buy dialog). */
export function AdminFreeNotice({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const free = useAdminFree();
  const pending = useAdminFreePending();
  if (!free && !pending) return null;
  return (
    <div
      role="status"
      className={`flex flex-wrap items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
        free
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
          : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
      } ${className}`}
      data-testid="admin-free-notice"
    >
      <AdminFreeBadge />
      <p className="min-w-0 flex-1">{t(free ? "adminFree.notice" : "adminFree.pendingNotice")}</p>
      {pending && (
        <Link to="/admin" className="text-sm font-semibold underline underline-offset-2">
          {t("adminFree.openAdmin")}
        </Link>
      )}
    </div>
  );
}
