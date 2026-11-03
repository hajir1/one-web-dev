import { useCallback, useEffect, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";
import { KIND_LABEL } from "../lib/fileSniff";
import { formatSize } from "../lib/format";
import { summarizeRejections, validateFiles, type AcceptedFile, type FileRules, type RejectedFile } from "../lib/validate";

/**
 * Validasi file masuk (isi, ukuran, jumlah) lalu teruskan yang lolos.
 * Penolakan disimpan untuk ditampilkan, tidak dibuang diam-diam.
 */
export function useFileIntake(rules: FileRules, onAccepted: (files: AcceptedFile[]) => void) {
  const [checking, setChecking] = useState(false);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  const latest = useRef({ rules, onAccepted });
  latest.current = { rules, onAccepted };

  const handleFiles = useCallback(async (files: Iterable<File>) => {
    setChecking(true);
    try {
      const res = await validateFiles(files, latest.current.rules);
      setRejected(res.rejected);
      if (res.accepted.length) latest.current.onAccepted(res.accepted);
    } finally {
      setChecking(false);
    }
  }, []);

  return { handleFiles, checking, rejected, rejectionText: summarizeRejections(rejected), clearRejected: () => setRejected([]) };
}

interface DropzoneProps {
  rules: FileRules;
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  /** Atribut accept untuk dialog file (petunjuk OS; validasi tetap dari isi). */
  accept: string;
  title?: ReactNode;
  compact?: boolean;
  busy?: boolean;
  /** Terima Ctrl/Cmd+V gambar dari clipboard. */
  allowPaste?: boolean;
  testId?: string;
}

export default function Dropzone({ rules, onFiles, multiple = true, accept, title, compact, busy, allowPaste, testId = "dropzone" }: DropzoneProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  // Penghitung dragenter/dragleave: tanpa ini status "drag" berkedip saat
  // kursor melewati elemen anak (bug versi lama).
  const depth = useRef(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (!allowPaste) return;
    const onPaste = (e: ClipboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      const files = Array.from(e.clipboardData?.files ?? []);
      if (files.length) {
        e.preventDefault();
        onFiles(multiple ? files : files.slice(0, 1));
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [allowPaste, multiple, onFiles]);

  const open = () => !busy && inputRef.current?.click();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };
  const drop = (e: DragEvent) => {
    e.preventDefault();
    depth.current = 0;
    setOver(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length && !busy) onFiles(multiple ? files : files.slice(0, 1));
  };

  const formats = Array.from(new Set(rules.kinds.map((k) => KIND_LABEL[k]))).join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={typeof title === "string" ? title : t("media.dropzone.choose")}
      aria-busy={busy}
      data-testid={testId}
      onClick={open}
      onKeyDown={onKey}
      onDragEnter={(e) => {
        e.preventDefault();
        depth.current++;
        setOver(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (!depth.current) setOver(false);
      }}
      onDrop={drop}
      className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50 ${
        compact ? "gap-1 px-4 py-4 sm:flex-row sm:gap-3" : "gap-2 px-6 py-10 sm:py-12"
      } ${
        over
          ? "border-blue-700 bg-blue-50/80 dark:bg-blue-500/10"
          : "border-gray-300 bg-gray-50/60 hover:border-blue-700 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-white/[0.02] dark:hover:bg-blue-500/5"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        data-testid={`${testId}-input`}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-white text-blue-800 shadow-sm ring-1 ring-gray-200 transition group-hover:scale-105 dark:bg-gray-900 dark:text-blue-300 dark:ring-gray-700 ${
          compact ? "h-9 w-9" : "h-12 w-12"
        }`}
      >
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className={compact ? "h-4 w-4" : "h-6 w-6"} />}
      </span>
      <div className={compact ? "sm:text-left" : ""}>
        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
          {busy ? t("media.dropzone.checking") : over ? t("media.dropzone.release") : title ?? t("media.dropzone.prompt")}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {formats} · {t("media.dropzone.max", { size: formatSize(rules.maxBytes) })}
          {multiple ? t("media.dropzone.perFile") : ""}
          {allowPaste ? t("media.dropzone.paste") : ""}
        </p>
      </div>
    </div>
  );
}
