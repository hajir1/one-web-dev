import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileText, Loader2, Trash2 } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import MfaPanel from "../../components/app/MfaPanel";
import { Link, Navigate, useLocaleNavigate } from "../../components/app/LocaleLink";
import { btn, Field, INPUT, Notice, Panel } from "../../components/app/ui";
import { ApiError } from "../../api/client";
import { deleteAccount, downloadMyData, isAdmin, useSession } from "../../auth/session";
import { LEGAL_DOCS, legalPath } from "../../config/legal";

/** /:lang/account — privasi data (UU PDP), keamanan akun, dokumen legal. */
export default function AccountSettings() {
  const { t } = useTranslation();
  const navigate = useLocaleNavigate();
  const status = useSession((s) => s.status);
  const user = useSession((s) => s.user);
  const [busy, setBusy] = useState<"export" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState("");
  const [password, setPassword] = useState("");

  if (status === "anonymous") return <Navigate to="/signin?next=/account" replace />;
  if (!user) return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />;

  const doExport = async () => {
    setBusy("export");
    setError(null);
    try {
      await downloadMyData();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("errors.unknown"));
    } finally {
      setBusy(null);
    }
  };

  const doDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (!window.confirm(t("account.delete.finalConfirm"))) return;
    setBusy("delete");
    setError(null);
    try {
      await deleteAccount(confirm, password || undefined);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("errors.unknown"));
    } finally {
      setBusy(null);
    }
  };

  const word = t("account.delete.word");
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <AppMeta title={t("account.title")} />
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("account.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>
      {error && <Notice tone="error" onDismiss={() => setError(null)}>{error}</Notice>}

      <Panel title={t("account.security")} description={t("mfa.description")}>
        <MfaPanel />
      </Panel>

      <Panel title={t("account.data.title")} description={t("account.data.text")}>
        <button type="button" className={btn.secondary} onClick={doExport} disabled={busy !== null} data-testid="account-export">
          {busy === "export" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {t("account.data.download")}
        </button>
      </Panel>

      <Panel title={t("account.legal")}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {LEGAL_DOCS.map((d) => (
            <li key={d}>
              <Link to={legalPath(d)} className="flex items-center gap-2 text-sm text-brand-600 hover:underline dark:text-brand-400">
                <FileText className="h-4 w-4" /> {t(`legal.docs.${d}`)}
              </Link>
            </li>
          ))}
        </ul>
        {user.termsAccepted && <p className="mt-3 text-xs text-gray-500">{t("account.termsAccepted", { version: user.termsVersion })}</p>}
      </Panel>

      <Panel title={t("account.delete.title")} description={t("account.delete.text")} className="border-rose-200 dark:border-rose-500/30">
        {isAdmin(user) ? (
          <Notice tone="warn">{t("account.delete.admin")}</Notice>
        ) : (
          <form onSubmit={doDelete} className="space-y-3" data-testid="account-delete">
            <ul className="ml-5 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>{t("account.delete.point1")}</li>
              <li>{t("account.delete.point2")}</li>
              <li>{t("account.delete.point3")}</li>
            </ul>
            {user.hasPassword && (
              <Field label={t("auth.password")} htmlFor="del-pw">
                <input id="del-pw" type="password" required className={INPUT} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </Field>
            )}
            <Field label={t("account.delete.typeWord", { word })} htmlFor="del-confirm">
              <input id="del-confirm" className={INPUT} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
            </Field>
            <button type="submit" className={btn.danger} disabled={busy !== null || confirm.trim().toUpperCase() !== word}>
              {busy === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {t("account.delete.submit")}
            </button>
          </form>
        )}
      </Panel>
    </div>
  );
}
