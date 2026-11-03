import { useEffect } from "react";
import { create } from "zustand";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ================================================================== */
/* Notifikasi hasil operasi (toast) untuk seluruh aplikasi.             */
/*   notify.success("…") / notify.error("…") dari mana saja.            */
/* <Toaster/> dipasang sekali di AppLayout.                              */
/* ================================================================== */

export type ToastTone = "success" | "error" | "info" | "warn";
export interface Toast {
  id: number;
  tone: ToastTone;
  text: string;
}

let seq = 0;
const useToastStore = create<{ toasts: Toast[]; push: (t: Omit<Toast, "id">) => void; dismiss: (id: number) => void }>((set) => ({
  toasts: [],
  push: (t) => set((s) => ({ toasts: [...s.toasts.slice(-3), { ...t, id: ++seq }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

const push = (tone: ToastTone) => (text: string) => useToastStore.getState().push({ tone, text });
export const notify = { success: push("success"), error: push("error"), info: push("info"), warn: push("warn") };

const TONE = {
  success: { Icon: CheckCircle2, cls: "border-emerald-200 text-emerald-900 dark:border-emerald-500/30 dark:text-emerald-100", icon: "text-emerald-600" },
  error: { Icon: XCircle, cls: "border-rose-200 text-rose-900 dark:border-rose-500/30 dark:text-rose-100", icon: "text-rose-600" },
  info: { Icon: Info, cls: "border-brand-200 text-gray-900 dark:border-brand-500/30 dark:text-white", icon: "text-brand-600" },
  warn: { Icon: AlertTriangle, cls: "border-amber-200 text-amber-950 dark:border-amber-500/30 dark:text-amber-100", icon: "text-amber-600" },
} as const;

function ToastItem({ toast }: { toast: Toast }) {
  const { t } = useTranslation();
  const dismiss = useToastStore((s) => s.dismiss);
  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), toast.tone === "error" ? 7000 : 4000);
    return () => clearTimeout(timer);
  }, [toast, dismiss]);
  const { Icon, cls, icon } = TONE[toast.tone];
  return (
    <li
      role={toast.tone === "error" ? "alert" : "status"}
      className={`pointer-events-auto flex w-full items-start gap-2.5 rounded-xl border bg-white px-3.5 py-3 text-sm shadow-theme-lg dark:bg-gray-900 ${cls}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${icon}`} />
      <p className="min-w-0 flex-1 leading-snug">{toast.text}</p>
      <button type="button" onClick={() => dismiss(toast.id)} aria-label={t("common.close")} className="-m-1 rounded p-1 opacity-50 hover:opacity-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <ul aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[100001] flex w-[min(92vw,380px)] flex-col gap-2" data-testid="toaster">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </ul>
  );
}
