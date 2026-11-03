import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import { Link, useLocaleNavigate } from "../../components/app/LocaleLink";
import { btn, Field, INPUT, Notice } from "../../components/app/ui";
import { ApiError } from "../../api/client";
import { verifyEmail } from "../../auth/session";
import AuthLayout from "./AuthPageLayout";
import VerifyPending from "./VerifyPending";

/**
 * Halaman tujuan tautan di email: /:lang/verify-email?token=…
 * Token dikirim SEKALI ke backend (StrictMode memanggil efek dua kali);
 * sukses → akun aktif dan langsung masuk.
 */
export default function VerifyEmail() {
  const { t } = useTranslation();
  const navigate = useLocaleNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<"loading" | "ok" | "invalid" | "expired">(token ? "loading" : "invalid");
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [resendFor, setResendFor] = useState<string | null>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (!token || sent.current) return;
    sent.current = true;
    verifyEmail(token)
      .then(() => {
        setState("ok");
        // Hapus token dari URL/riwayat, lalu ke beranda.
        window.history.replaceState(null, "", window.location.pathname);
        setTimeout(() => navigate("/", { replace: true }), 1500);
      })
      .catch((e) => {
        setState(e instanceof ApiError && e.code === "EMAIL_VERIFY_TOKEN_EXPIRED" ? "expired" : "invalid");
        setMessage(e instanceof ApiError ? e.message : t("errors.unknown"));
      });
  }, [token, navigate, t]);

  const askResend = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) setResendFor(email.trim().toLowerCase());
  };

  return (
    <AuthLayout>
      <AppMeta title={t("auth.verify.title")} />
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("auth.verify.title")}</h1>
      <div className="mt-5" data-testid={`verify-${state}`}>
        {state === "loading" && (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> {t("auth.verify.checking")}
          </p>
        )}
        {state === "ok" && (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" /> {t("auth.verify.success")}
          </p>
        )}
        {(state === "invalid" || state === "expired") &&
          (resendFor ? (
            <VerifyPending email={resendFor} intro="expired" />
          ) : (
            <div className="space-y-4">
              <Notice tone={state === "expired" ? "warn" : "error"}>{message ?? t("auth.verify.invalid")}</Notice>
              <form onSubmit={askResend} className="space-y-3">
                <Field label={t("auth.verify.resendLabel")} htmlFor="verify-email">
                  <input id="verify-email" type="email" required className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={254} />
                </Field>
                <button type="submit" className={`${btn.secondary} w-full`}>
                  {t("auth.verify.resend")}
                </button>
              </form>
            </div>
          ))}
      </div>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link to="/signin" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          {t("auth.signIn")}
        </Link>
      </p>
    </AuthLayout>
  );
}
