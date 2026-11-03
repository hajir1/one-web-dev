import { useId, useRef, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";

/**
 * Area unggah yang aksesibel: bisa diklik, di-drag & drop, dan dipakai
 * dengan keyboard (Enter/Spasi). Validasi file dilakukan oleh pemanggil.
 */
export default function FileDropZone({
  accept,
  multiple = false,
  onFiles,
  hint,
  title,
  compact = false,
  disabled = false,
  testId,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint?: string;
  title?: string;
  compact?: boolean;
  disabled?: boolean;
  testId?: string;
}) {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const hintId = useId();

  const take = (list: FileList | null) => {
    const files = list ? Array.from(list) : [];
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-describedby={hintId}
      data-testid={testId}
      onClick={() => !disabled && input.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          input.current?.click();
        }
      }}
      onDragOver={(e: DragEvent) => {
        e.preventDefault();
        if (!disabled) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        setDrag(false);
        if (!disabled) take(e.dataTransfer.files);
      }}
      className={`group cursor-pointer rounded-2xl border-2 border-dashed text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${
        compact ? "px-4 py-5" : "px-6 py-10"
      } ${drag ? "border-brand-500 bg-brand-25 dark:bg-brand-500/10" : "border-gray-300 hover:border-brand-400 hover:bg-gray-50/60 dark:border-gray-700 dark:hover:bg-white/[0.02]"} ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        tabIndex={-1}
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:scale-105 dark:bg-brand-500/15 dark:text-brand-300">
        <Upload className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title ?? t(multiple ? "data.drop.titleMany" : "data.drop.title")}</p>
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}
