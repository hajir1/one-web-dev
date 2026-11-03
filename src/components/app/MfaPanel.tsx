import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, ShieldCheck } from "lucide-react";
import { btn, Field, INPUT, Notice } from "./ui";
import { ApiError } from "../../api/client";
import { loadSession, mfaDisable, mfaEnable, mfaSetup, mfaVerify, type MfaStatus } from "../../auth/session";
import { useMfaStatus } from "../../api/queries";
import { QueryError, Skeleton } from "./QueryState";
import MfaQr from "./MfaQr";

/**
 * Verifikasi dua langkah (TOTP: Google Authenticator, Microsoft Authenticator,
 * Aegis, 1Password, dll.). Tiga keadaan: belum aktif → daftar; aktif tetapi
 * sesi belum lolos → verifikasi; aktif & lolos → bisa dimatikan.
 * `onVerified` dipanggil setelah sesi lolos 2FA (dipakai panel admin).
 */
export default function MfaPanel({ onVerified, compact = false }: { onVerified?: () => void; compact?: boolean }) {
  const { t } = useTranslation();
  // Status 2FA lewat TanStack Query (cache bersama panel Akun & Admin).
  const q = useMfaStatus();
  const status: MfaStatus | null = q.data ?? null;
  const [setup, setSetup] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => q.refetch();

  /** v9: pesan yang jelas untuk kunci 2FA (bukan "Terlalu banyak permintaan") dan sisa percobaan. */
  const mfaErrorText = (e: unknown) => {
    if (!(e instanceof ApiError)) return t("errors.unknown");
    const wait = Number(e.body.retryAfterSeconds);
    if ((e.code === "MFA_LOCKED" || e.status === 429) && Number.isFinite(wait) && wait > 0)
      return t("mfa.locked", { minutes: Math.max(1, Math.ceil(wait / 60)) });
    const left = Number(e.body.attemptsLeft);
    if (e.code === "MFA_CODE_INVALID" && Number.isFinite(left)) return t("mfa.invalidLeft", { count: left });
    return e.message;
  };

  const run = async (fn: () => Promise<unknown>, after?: () => void) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setCode("");
      await refresh();
      after?.();
    } catch (e) {
      setError(mfaErrorText(e));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setError(t("mfa.codeFormat"));
    if (!status?.enabled)
      void run(
        () => mfaEnable(code),
        () => (setSetup(null), void loadSession(true), onVerified?.()),
      );
    else if (!status.sessionVerified) void run(() => mfaVerify(code), onVerified);
    else if (window.confirm(t("mfa.disableConfirm"))) void run(() => mfaDisable(code));
  };

  if (q.isError && !status) return <QueryError error={q.error} onRetry={() => void q.refetch()} retrying={q.isFetching} compact />;
  if (!status) return <Skeleton className="h-24 w-full max-w-md" />;
  const codeInput = (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <div className="w-40">
        <Field label={t("mfa.code")} htmlFor="mfa-code">
          <input
            id="mfa-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            className={INPUT}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            data-testid="mfa-code"
          />
        </Field>
      </div>
      <button type="submit" className={status.enabled && status.sessionVerified ? btn.secondary : btn.primary} disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {!status.enabled ? t("mfa.enable") : !status.sessionVerified ? t("mfa.verify") : t("mfa.disable")}
      </button>
    </form>
  );

  return (
    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300" data-testid="mfa-panel">
      {!compact && (
        <p className="flex items-center gap-2 font-medium">
          <ShieldCheck className={`h-4 w-4 ${status.enabled ? "text-emerald-600" : "text-gray-400"}`} />
          {status.enabled ? t("mfa.on") : t("mfa.off")}
        </p>
      )}
      {error && <Notice tone="error">{error}</Notice>}
      {!status.enabled && !setup && (
        <>
          <p>{status.requiredForAdmin ? t("mfa.requiredAdmin") : t("mfa.intro")}</p>
          <button type="button" className={btn.primary} disabled={busy} onClick={() => run(async () => setSetup(await mfaSetup()))}>
            {t("mfa.start")}
          </button>
        </>
      )}
      {!status.enabled && setup && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <MfaQr value={setup.otpauthUrl} />
            <ol className="ml-5 list-decimal space-y-1">
              <li>{t("mfa.step1")}</li>
              <li>
                {t("mfa.step2")}{" "}
                <code
                  className="select-all break-all rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  data-testid="mfa-secret"
                >
                  {setup.secret.replace(/(.{4})/g, "$1 ").trim()}
                </code>{" "}
                <a href={setup.otpauthUrl} className="text-brand-600 hover:underline dark:text-brand-400">
                  {t("mfa.openApp")}
                </a>
              </li>
              <li>{t("mfa.step3")}</li>
            </ol>
          </div>
          {codeInput}
        </>
      )}
      {status.enabled && !status.sessionVerified && (
        <>
          <p>{t("mfa.verifyText")}</p>
          {codeInput}
        </>
      )}
      {status.enabled && status.sessionVerified && !compact && (
        <>
          <p>{t("mfa.disableText")}</p>
          {codeInput}
        </>
      )}
    </div>
  );
}
