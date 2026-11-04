import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { Gift, Loader2, LogIn, UserPlus } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import { Link, useLang, useLocaleNavigate } from "../../components/app/LocaleLink";
import { btn, Field, INPUT, Notice } from "../../components/app/ui";
import { ApiError } from "../../api/client";
import { googleSignInUrl, loadAuthMethods, signIn, signUp, useSession } from "../../auth/session";
import { isBackendConfigured } from "../media/processing/apiConfig";
import AuthLayout from "./AuthPageLayout";
import VerifyPending from "./VerifyPending";
import { legalPath } from "../../config/legal";
import { clearStoredReferral, getStoredReferral, normalizeReferralInput, storeReferral } from "../../auth/referralCapture";

/** Consent sentence with links to the Terms and Privacy Policy (opened in a new tab). */
export function TermsConsentText() {
  const { t } = useTranslation();
  const link = "font-semibold text-brand-600 hover:underline dark:text-brand-400";
  return (
    <>
      {t("legal.consent.before")}{" "}
      <Link to={legalPath("terms")} target="_blank" rel="noopener" className={link}>
        {t("legal.docs.terms")}
      </Link>{" "}
      {t("legal.consent.and")}{" "}
      <Link to={legalPath("privacy")} target="_blank" rel="noopener" className={link}>
        {t("legal.docs.privacy")}
      </Link>
      {t("legal.consent.after")}
    </>
  );
}

/** Destination after login: internal paths only (no external URLs). */
function safeNext(raw: string | null, lang: string): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\")) return raw;
  return `/${lang}`;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const { t } = useTranslation();
  const lang = useLang();
  const navigate = useLocaleNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"), lang);
  const methods = useSession((s) => s.methods);
  const status = useSession((s) => s.status);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  /** v5: optional referral code; filled automatically from the invitation link (?ref=). */
  const [referral, setReferral] = useState(() => normalizeReferralInput(params.get("ref")) ?? (mode === "signup" ? getStoredReferral() : null) ?? "");
  const [referralError, setReferralError] = useState<string | null>(null);
  const referralCode = referral.trim() ? normalizeReferralInput(referral) : null;
  /** Sign-up requires ticking consent to the Terms + Privacy Policy (proof of electronic consent). */
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(params.get("error") || params.get("auth_error") ? t("auth.googleFailed") : null);
  /** Email awaiting verification (after sign-up, or a login rejected with EMAIL_NOT_VERIFIED). */
  const [pending, setPending] = useState<{ email: string; cooldown: number; intro: "signup" | "signin" } | null>(null);
  const backend = isBackendConfigured();
  /** Sign-up: the confirmation must match; the message appears once the confirmation field is filled. */
  const mismatch = mode === "signup" && password2 !== "" && password2 !== password;
  const confirmOk = mode === "signin" || (password2 !== "" && password2 === password);

  useEffect(() => {
    if (backend) void loadAuthMethods();
  }, [backend]);
  // Already signed in → go straight to the destination.
  useEffect(() => {
    if (status === "authenticated") navigate(next.replace(/^\/(id|en)(?=\/|$)/, "") || "/", { replace: true });
  }, [status, next, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (mode === "signup" && !agree) {
      setError(t("legal.consent.required"));
      return;
    }
    if (!confirmOk) return;
    if (mode === "signup" && referral.trim() && !referralCode) {
      setReferralError(t("referral.invalidFormat"));
      return;
    }
    setError(null);
    setReferralError(null);
    setBusy(true);
    try {
      if (mode === "signin") await signIn(email.trim(), password);
      else {
        const r = await signUp(email.trim(), password, name.trim() || undefined, lang, referralCode);
        clearStoredReferral();
        setPassword("");
        setPassword2("");
        setPending({ email: r.email, cooldown: r.resendCooldownSeconds, intro: "signup" });
      }
    } catch (err) {
      if (err instanceof ApiError && err.code?.startsWith("REFERRAL_")) {
        setReferralError(err.message);
        return;
      }
      if (err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED") {
        setPending({ email: email.trim().toLowerCase(), cooldown: 60, intro: "signin" });
        return;
      }
      setError(err instanceof ApiError ? err.message : t("errors.unknown"));
    } finally {
      setBusy(false);
    }
  };

  const signin = mode === "signin";
  const passwordOn = methods?.password ?? true;
  if (pending)
    return (
      <AuthLayout>
        <AppMeta title={t("auth.verify.checkTitle")} />
        <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{t(signin ? "auth.signInTitle" : "auth.signUpTitle")}</h1>
        <VerifyPending email={pending.email} cooldown={pending.cooldown} intro={pending.intro} />
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <button type="button" className="font-semibold text-brand-600 hover:underline dark:text-brand-400" onClick={() => setPending(null)}>
            {t("auth.verify.back")}
          </button>
        </p>
      </AuthLayout>
    );
  return (
    <AuthLayout>
      <AppMeta title={t(signin ? "auth.signInTitle" : "auth.signUpTitle")} />
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t(signin ? "auth.signInTitle" : "auth.signUpTitle")}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t(signin ? "auth.signInText" : "auth.signUpText")}</p>

      {!backend && (
        <div className="mt-4">
          <Notice tone="warn">{t("errors.serverUnavailable")}</Notice>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <Notice tone="error" testId="auth-error" onDismiss={() => setError(null)}>
            {error}
          </Notice>
        </div>
      )}

      {!signin && (
        <label className="mt-5 flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300" data-testid="auth-consent">
          <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
          <span>
            <TermsConsentText />
          </span>
        </label>
      )}

      {methods?.google &&
        (signin || agree ? (
          <a href={googleSignInUrl(next, !signin && agree, signin ? null : referralCode)} className={`${btn.secondary} mt-5 w-full`} data-testid="auth-google">
            <GoogleIcon /> {t("auth.google")}
          </a>
        ) : (
          <button type="button" className={`${btn.secondary} mt-5 w-full`} data-testid="auth-google" onClick={() => setError(t("legal.consent.required"))}>
            <GoogleIcon /> {t("auth.google")}
          </button>
        ))}
      {methods?.google && passwordOn && (
        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          {t("auth.or")}
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>
      )}

      {passwordOn ? (
        <form onSubmit={submit} className={`space-y-4 ${methods?.google ? "" : "mt-5"}`} data-testid={`auth-form-${mode}`}>
          {!signin && (
            <Field label={t("auth.name")} htmlFor="auth-name">
              <input id="auth-name" className={INPUT} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={100} />
            </Field>
          )}
          <Field label={t("auth.email")} htmlFor="auth-email">
            <input id="auth-email" type="email" required className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={254} />
          </Field>
          <Field label={t("auth.password")} htmlFor="auth-password" hint={signin ? undefined : t("auth.passwordHint")}>
            <input
              id="auth-password"
              type="password"
              required
              minLength={8}
              maxLength={128}
              className={INPUT}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={signin ? "current-password" : "new-password"}
            />
          </Field>
          {!signin && (
            <Field label={t("auth.passwordConfirm")} htmlFor="auth-password2">
              <input
                id="auth-password2"
                type="password"
                required
                maxLength={128}
                className={`${INPUT} ${mismatch ? "border-rose-400 focus:border-rose-500" : ""}`}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                autoComplete="new-password"
                aria-invalid={mismatch}
                aria-describedby={mismatch ? "auth-password2-error" : undefined}
                data-testid="auth-password-confirm"
              />
              {mismatch && (
                <p id="auth-password2-error" role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400" data-testid="auth-password-mismatch">
                  {t("auth.passwordMismatch")}
                </p>
              )}
            </Field>
          )}
          {!signin && (
            <Field label={t("referral.signupLabel")} htmlFor="auth-referral" hint={referralError ? undefined : t("referral.signupHint")}>
              <div className="relative">
                <Gift className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="auth-referral"
                  className={`${INPUT} pl-9 font-mono uppercase tracking-wider ${referralError ? "border-rose-400 focus:border-rose-500" : ""}`}
                  value={referral}
                  onChange={(e) => {
                    setReferral(e.target.value.toUpperCase());
                    setReferralError(null);
                  }}
                  onBlur={() => referralCode && storeReferral(referralCode)}
                  placeholder="K7P3QX9M"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={40}
                  aria-invalid={!!referralError}
                  aria-describedby={referralError ? "auth-referral-error" : undefined}
                  data-testid="auth-referral"
                />
              </div>
              {referralError && (
                <p id="auth-referral-error" role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400" data-testid="auth-referral-error">
                  {referralError}
                </p>
              )}
            </Field>
          )}
          {signin && (
            <p className="-mt-2 text-right text-xs">
              <Link to="/forgot-password" className="font-semibold text-brand-600 hover:underline dark:text-brand-400" data-testid="auth-forgot">
                {t("auth.forgot.link")}
              </Link>
            </p>
          )}
          <button type="submit" className={`${btn.primary} w-full`} disabled={busy || !backend || (!signin && (!agree || !confirmOk))}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : signin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {t(signin ? "auth.signIn" : "auth.signUp")}
          </button>
        </form>
      ) : (
        !methods?.google && <p className="mt-5 text-sm text-gray-500">{t("auth.noMethod")}</p>
      )}

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {t(signin ? "auth.noAccount" : "auth.haveAccount")}{" "}
        <Link
          to={`${signin ? "/signup" : "/signin"}${params.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          {t(signin ? "auth.signUp" : "auth.signIn")}
        </Link>
      </p>
    </AuthLayout>
  );
}
