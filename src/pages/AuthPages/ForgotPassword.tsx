import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Mail } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import { Link } from "../../components/app/LocaleLink";
import { btn, Field, INPUT, Notice } from "../../components/app/ui";
import { ApiError } from "../../api/client";
import { forgotPassword } from "../../auth/session";
import AuthLayout from "./AuthPageLayout";

/** /:lang/forgot-password — minta tautan atur ulang sandi (respons selalu generik). */
export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(email.trim().toLowerCase());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("errors.unknown"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <AppMeta title={t("auth.forgot.title")} />
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("auth.forgot.title")}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("auth.forgot.text")}</p>
      <div className="mt-5 space-y-4">
        {error && <Notice tone="error">{error}</Notice>}
        {sent ? (
          <Notice tone="success" testId="forgot-sent">
            {t("auth.forgot.sent", { email: sent })}
          </Notice>
        ) : (
          <form onSubmit={submit} className="space-y-4" data-testid="forgot-form">
            <Field label={t("auth.email")} htmlFor="forgot-email">
              <input id="forgot-email" type="email" required className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={254} />
            </Field>
            <button type="submit" className={`${btn.primary} w-full`} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {t("auth.forgot.submit")}
            </button>
          </form>
        )}
      </div>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link to="/signin" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          {t("auth.signIn")}
        </Link>
      </p>
    </AuthLayout>
  );
}
