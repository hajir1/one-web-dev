import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

interface Props {
  /** Belum pernah disimpan → minta nama dulu. */
  needsName: boolean;
  defaultName: string;
  /** true = tersimpan (lalu keluar); false = gagal (mis. kuota penuh) → tetap di editor. */
  onSaveAndLeave: (name: string) => boolean;
  onLeave: () => void;
  onCancel: () => void;
}

/** Dialog "Simpan dan Keluar / Keluar Tanpa Menyimpan / Batal". */
export default function LeaveDialog({ needsName, defaultName, onSaveAndLeave, onLeave, onCancel }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState<string | null>(null);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onCancel]);

  const save = () => {
    setError(null);
    if (!onSaveAndLeave(name.trim() || defaultName)) setError(t("pm.leave.notSaved"));
  };

  return createPortal(
    <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-black/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="leave-title"
        data-testid="leave-dialog"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 id="leave-title" className="text-base font-semibold text-gray-800 dark:text-white/90">
              {t("pm.leave.title")}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {t("pm.leave.body")}
            </p>
          </div>
        </div>
        {needsName && (
          <label className="mt-4 block text-xs text-gray-600 dark:text-gray-400">
            {t("pm.leave.designName")}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-950 dark:text-white/90"
            />
          </label>
        )}
        {error && (
          <p role="alert" className="mt-2 text-xs text-rose-600">
            {error}
          </p>
        )}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-gray-700 dark:hover:bg-rose-500/10"
          >
            {t("pm.leave.leaveWithoutSaving")}
          </button>
          <button
            ref={firstRef}
            type="button"
            onClick={save}
            className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            {t("pm.leave.saveAndLeave")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
