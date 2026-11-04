import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import { Link } from "../../components/app/LocaleLink";
import { btn, Field, INPUT, Notice } from "../../components/app/ui";
import { ApiError } from "../../api/client";
import { resetPassword } from "../../auth/session";
import AuthLayout from "./AuthPageLayout";

/** /:lang/reset-password?token=… — target of the link in the password reset email. */
export default function ResetPassword() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [token] = useState(() => params.get("token") ?? "");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(token ? null : t("auth.reset.invalid"));

  // Do not leave the token in the URL/browser history.
  useEffect(() => {
    if (token) window.history.replaceState(null, "", window.location.pathname);
  }, [token]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (pw !== pw2) return setError(t("auth.reset.mismatch"));
    setBusy(true);
    setError(null);
    try {
      await resetPassword(token, pw);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("errors.unknown"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <AppMeta title={t("auth.reset.title")} />
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("auth.reset.title")}</h1>
      <div className="mt-5 space-y-4">
        {error && <Notice tone="error">{error}</Notice>}
        {done ? (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300" data-testid="reset-done">
            <CheckCircle2 className="h-5 w-5" /> {t("auth.reset.done")}
          </p>
        ) : (
          token && (
            <form onSubmit={submit} className="space-y-4" data-testid="reset-form">
              <Field label={t("auth.reset.newPassword")} htmlFor="reset-pw" hint={t("auth.passwordHint")}>
                <input id="reset-pw" type="password" required minLength={8} maxLength={128} className={INPUT} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
              </Field>
              <Field label={t("auth.reset.confirm")} htmlFor="reset-pw2">
                <input id="reset-pw2" type="password" required minLength={8} maxLength={128} className={INPUT} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
              </Field>
              <button type="submit" className={`${btn.primary} w-full`} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                {t("auth.reset.submit")}
              </button>
            </form>
          )
        )}
      </div>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link to={done || !token ? "/signin" : "/forgot-password"} className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          {done || !token ? t("auth.signIn") : t("auth.forgot.again")}
        </Link>
      </p>
    </AuthLayout>
  );
}
