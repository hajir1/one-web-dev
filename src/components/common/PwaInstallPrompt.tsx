import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useTranslation } from "react-i18next";

/* Tombol "Pasang aplikasi" (Chrome/Edge/Android) bila browser menawarkan instalasi.
   iOS Safari tidak punya event ini: pemasangan lewat Bagikan → Tambah ke Layar Utama. */

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "owd-pwa-install-dismissed";

function dismissedRecently() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return Number.isFinite(at) && Date.now() - at < 30 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function PwaInstallPrompt() {
  const { t } = useTranslation();
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (!dismissedRecently()) setEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setEvt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!evt) return null;

  const close = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* penyimpanan diblokir: cukup sembunyikan untuk sesi ini */
    }
    setEvt(null);
  };

  return (
    <div role="dialog" aria-label={t("pwa.installTitle")} className="fixed bottom-4 left-4 z-[100000] flex w-[min(92vw,360px)] items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 dark:text-white">
      <img src={`${import.meta.env.BASE_URL}pwa-64x64.png`} alt="" className="h-9 w-9 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug">{t("pwa.installTitle")}</p>
        <p className="mt-0.5 leading-snug text-gray-500 dark:text-gray-400">{t("pwa.installBody")}</p>
        <button
          type="button"
          onClick={async () => {
            await evt.prompt();
            await evt.userChoice.catch(() => undefined);
            setEvt(null);
          }}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
        >
          <Download className="h-3.5 w-3.5" />
          {t("pwa.install")}
        </button>
      </div>
      <button type="button" onClick={close} aria-label={t("common.close")} className="-m-1 rounded p-1 opacity-50 hover:opacity-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
