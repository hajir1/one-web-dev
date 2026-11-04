import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { ChevronDown, Crown, Gift, History, LogIn, LogOut, ShieldCheck, UserCog, Users, Wallet } from "lucide-react";
import { Link, useLocaleNavigate } from "../components/app/LocaleLink";
import { CREDITS_PATH, JOB_HISTORY_PATH, PLANS_PATH, TEAM_PATH } from "../config/menu";
import { isAdmin, loadSession, signOut, useSession } from "../auth/session";

/** Sign-in button, or the account menu (credits, admin, sign out) when signed in. */
export default function UserMenu() {
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const navigate = useLocaleNavigate();
  const status = useSession((s) => s.status);
  const user = useSession((s) => s.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "idle") void loadSession();
  }, [status]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (status === "unavailable" || status === "idle" || status === "loading") return null;
  if (!user)
    return (
      <Link
        to={`/signin?next=${encodeURIComponent(pathname + search)}`}
        data-testid="header-signin"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-xs font-semibold text-white hover:bg-brand-700"
      >
        <LogIn className="h-4 w-4" /> <span className="hidden sm:inline">{t("auth.signIn")}</span>
      </Link>
    );

  const label = user.name || user.email;
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        data-testid="header-user"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-white/5"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] text-white">{initial}</span>
        )}
        <span className="hidden max-w-[10rem] truncate md:inline">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-sm shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
            <p className="truncate font-semibold text-gray-800 dark:text-white/90">{label}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <Link role="menuitem" to="/profile" onClick={() => setOpen(false)} data-testid="header-profile" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
            <Gift className="h-4 w-4" /> {t("profile.menu")}
          </Link>
          <Link role="menuitem" to={CREDITS_PATH} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
            <Wallet className="h-4 w-4" /> {t("header.creditsTitle")}
          </Link>
          <Link role="menuitem" to={PLANS_PATH} onClick={() => setOpen(false)} data-testid="header-plans" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
            <Crown className="h-4 w-4" /> {t("nav.plans")}
          </Link>
          <Link role="menuitem" to={JOB_HISTORY_PATH} onClick={() => setOpen(false)} data-testid="header-job-history" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
            <History className="h-4 w-4" /> {t("nav.jobHistory")}
          </Link>
          <Link role="menuitem" to={TEAM_PATH} onClick={() => setOpen(false)} data-testid="header-team" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
            <Users className="h-4 w-4" /> {t("nav.team")}
          </Link>
          <Link role="menuitem" to="/account" onClick={() => setOpen(false)} data-testid="header-account" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
            <UserCog className="h-4 w-4" /> {t("account.title")}
          </Link>
          {isAdmin(user) && (
            <Link role="menuitem" to="/admin" onClick={() => setOpen(false)} data-testid="header-admin" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5">
              <ShieldCheck className="h-4 w-4" /> {t("admin.title")}
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
              navigate("/");
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" /> {t("auth.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
