import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Copy } from "lucide-react";
import { notify } from "./Toaster";

/** Salin teks ke clipboard dengan umpan balik (ikon centang + toast saat gagal). */
export default function CopyButton({
  text,
  className,
  label,
  disabled,
  testId,
}: {
  text: string | (() => string);
  className?: string;
  label?: string;
  disabled?: boolean;
  testId?: string;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const copy = async () => {
    const value = typeof text === "function" ? text() : text;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      notify.error(t("common.copyFailed"));
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={disabled}
      data-testid={testId}
      aria-live="polite"
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
      }
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? t("common.copied") : (label ?? t("common.copy"))}
    </button>
  );
}
