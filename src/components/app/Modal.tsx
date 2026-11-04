import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ================================================================== */
/* Accessible modal dialog: role dialog/alertdialog, initial focus,      */
/* Escape closes, focus returns to the trigger, Tab stays inside.        */
/* ================================================================== */

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  size = "md",
  alert = false,
  testId,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  alert?: boolean;
  testId?: string;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const box = ref.current;
    const first = box?.querySelector<HTMLElement>("[data-autofocus]") ?? box?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && box) {
        const items = Array.from(box.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  const width = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" }[size];

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-end justify-center bg-gray-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role={alert ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        data-testid={testId}
        className={`flex max-h-[92vh] w-full ${width} flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl dark:border-gray-800 dark:bg-gray-900`}
      >
        <div className="flex items-start gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">{icon}</span>}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>}
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-3 sm:flex-row sm:justify-end dark:border-gray-800">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
