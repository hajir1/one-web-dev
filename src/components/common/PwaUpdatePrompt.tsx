import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, WifiOff, X } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ================================================================== */
/* Service worker (vite-plugin-pwa, registerType "prompt").             */
/* - A new version never activates silently: a "Reload to               */
/*   update" card appears and the user decides when.                     */
/* - Checks for updates every hour & when the tab becomes active, so     */
/*   tabs left open for a long time do not get stuck on an old version.  */
/* - Mounted once at the root (main.tsx), so it also shows in the        */
/*   full-screen Page Design.                                           */
/* ================================================================== */

const CHECK_EVERY_MS = 60 * 60 * 1000;

function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

export default function PwaUpdatePrompt() {
  const { t } = useTranslation();
  const online = useOnline();
  const [updating, setUpdating] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, reg) {
      if (!reg) return;
      const check = async () => {
        if (reg.installing || !navigator.onLine) return;
        // Bypass the HTTP cache so a new sw.js is really detected.
        const res = await fetch(swUrl, { cache: "no-store", headers: { "cache-control": "no-cache" } }).catch(() => null);
        if (res?.status === 200) await reg.update().catch(() => undefined);
      };
      setInterval(check, CHECK_EVERY_MS);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") void check();
      });
    },
  });

  if (!needRefresh && online) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[100001] flex w-[min(92vw,360px)] flex-col gap-2" aria-live="polite">
      {!online && (
        <div role="status" className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-amber-200 bg-white px-3.5 py-3 text-sm text-amber-950 shadow-theme-lg dark:border-amber-500/30 dark:bg-gray-900 dark:text-amber-100">
          <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="min-w-0 flex-1 leading-snug">{t("pwa.offline")}</p>
        </div>
      )}
      {needRefresh && (
        <div role="alert" className="pointer-events-auto rounded-xl border border-brand-200 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-theme-lg dark:border-brand-500/30 dark:bg-gray-900 dark:text-white">
          <div className="flex items-start gap-2.5">
            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-snug">{t("pwa.updateTitle")}</p>
              <p className="mt-0.5 leading-snug text-gray-500 dark:text-gray-400">{t("pwa.updateBody")}</p>
            </div>
            <button type="button" onClick={() => setNeedRefresh(false)} aria-label={t("pwa.later")} className="-m-1 rounded p-1 opacity-50 hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setNeedRefresh(false)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
              {t("pwa.later")}
            </button>
            <button
              type="button"
              disabled={updating}
              onClick={() => {
                setUpdating(true);
                void updateServiceWorker(true);
              }}
              className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {t("pwa.reload")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
