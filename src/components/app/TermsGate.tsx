import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Loader2, ScrollText } from "lucide-react";
import { btn, Notice } from "./ui";
import { ApiError } from "../../api/client";
import { acceptTerms, signOut, useSession } from "../../auth/session";
import { LEGAL_VERSION } from "../../config/legal";
import { splitLangPath } from "../../i18n";
import { TermsConsentText } from "../../pages/AuthPages/AuthForm";

/**
 * User yang masuk tetapi belum menyetujui S&K versi berlaku (akun lama,
 * login Google dari halaman Masuk, atau dokumen diperbarui) diminta setuju
 * dulu. Backend juga menolak checkout (403 TERMS_NOT_ACCEPTED) tanpa ini.
 */
export default function TermsGate() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const user = useSession((s) => s.user);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.termsAccepted !== false) return null;
  // Dokumen legal harus tetap bisa dibaca.
  if (splitLangPath(pathname).rest.startsWith("/legal/")) return null;

  const accept = async () => {
    setBusy(true);
    setError(null);
    try {
      await acceptTerms(user.termsVersion ?? LEGAL_VERSION);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("errors.unknown"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gray-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="terms-gate-title" data-testid="terms-gate">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <ScrollText className="h-8 w-8 text-brand-600" />
        <h2 id="terms-gate-title" className="mt-3 text-lg font-bold text-gray-900 dark:text-white">
          {t("legal.gate.title")}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("legal.gate.text")}</p>
        {error && (
          <div className="mt-3">
            <Notice tone="error">{error}</Notice>
          </div>
        )}
        <label className="mt-4 flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
          <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            <TermsConsentText />
          </span>
        </label>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className={btn.ghost} onClick={() => void signOut()}>
            {t("auth.signOut")}
          </button>
          <button type="button" className={btn.primary} disabled={!agree || busy} onClick={accept} data-testid="terms-accept">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("legal.gate.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
