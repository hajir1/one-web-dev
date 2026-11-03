import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; run: () => void };
}

const LIFETIME_MS = 6000;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((message: string, action?: Toast["action"]) => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-2), { id, message, action }]);
  }, []);

  return { toasts, push, dismiss };
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { t } = useTranslation();
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, LIFETIME_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-lg bg-gray-900 px-3.5 py-2.5 text-xs text-white shadow-lg dark:bg-gray-100 dark:text-gray-900">
      <span className="min-w-0 flex-1">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action!.run();
            onDismiss();
          }}
          className="shrink-0 rounded px-2 py-0.5 font-semibold text-blue-300 hover:bg-white/10 dark:text-blue-700 dark:hover:bg-black/5"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t("common.dismissNotice")}
        className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function Toasts({
  toasts,
  dismiss,
}: {
  toasts: Toast[];
  dismiss: (id: number) => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-99998 mx-auto flex w-full max-w-sm flex-col gap-2 px-4"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}
