import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import { btn, Notice } from "../../components/app/ui";
import { ApiError } from "../../api/client";
import { resendVerification } from "../../auth/session";

/**
 * "Check your email" + a resend button with a countdown. Used after
 * sign-up, after a login is rejected because the email is not verified, and on
 * the verification page when the link has expired.
 */
export default function VerifyPending({ email, cooldown = 60, intro }: { email: string; cooldown?: number; intro?: "signup" | "signin" | "expired" }) {
  const { t } = useTranslation();
  const [left, setLeft] = useState(intro === "signup" ? cooldown : 0);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const resend = async () => {
    if (busy || left > 0) return;
    setBusy(true);
    setError(null);
    try {
      const r = await resendVerification(email);
      setSent(true);
      setLeft(r.resendCooldownSeconds || cooldown);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("errors.unknown"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="verify-pending">
      <div className="flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm text-brand-800 dark:bg-brand-500/10 dark:text-brand-200">
        <MailCheck className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">{t(intro === "signin" ? "auth.verify.notVerifiedTitle" : "auth.verify.checkTitle")}</p>
          <p className="mt-1 leading-relaxed">{t("auth.verify.checkText", { email })}</p>
        </div>
      </div>
      {sent && <Notice tone="success">{t("auth.verify.resent")}</Notice>}
      {error && (
        <Notice tone="error" onDismiss={() => setError(null)}>
          {error}
        </Notice>
      )}
      <button type="button" className={`${btn.secondary} w-full`} onClick={resend} disabled={busy || left > 0} data-testid="verify-resend">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        {left > 0 ? t("auth.verify.resendIn", { seconds: left }) : t("auth.verify.resend")}
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400">{t("auth.verify.spamHint")}</p>
    </div>
  );
}
