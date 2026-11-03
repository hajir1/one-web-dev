import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { GripHorizontal, X } from "lucide-react";
import { usePersistentState } from "../engine/helpers/usePersistentState";

/* ================================================================== */
/* Popup mengambang (non-modal)                                         */
/*                                                                    */
/* Tidak ada backdrop, jadi canvas tetap bisa diklik / jadi tujuan       */
/* drag & drop selagi popup terbuka. Header bisa diseret; posisi diingat. */
/* Di layar sempit tampil sebagai bottom sheet.                          */
/* ================================================================== */

interface Pos {
  x: number;
  y: number;
}
const isPos = (v: unknown): v is Pos =>
  !!v && typeof v === "object" && typeof (v as Pos).x === "number" && typeof (v as Pos).y === "number";

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), Math.max(min, max));

function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 640);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return narrow;
}

interface FloatingPanelProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  /** Kunci penyimpanan posisi (per jenis popup). */
  storageKey: string;
  width?: number;
  /** Posisi awal bila belum pernah diseret. */
  initial?: (vw: number, vh: number, w: number) => Pos;
  /** Konten di bawah header yang tidak ikut menggulir (mis. tab). */
  toolbar?: ReactNode;
  testId?: string;
}

export default function FloatingPanel({
  title,
  icon,
  onClose,
  children,
  storageKey,
  width = 380,
  initial = (vw, _vh, w) => ({ x: vw - w - 16, y: 72 }),
  toolbar,
  testId,
}: FloatingPanelProps) {
  const { t } = useTranslation();
  const narrow = useNarrow();
  const [saved, setSaved] = usePersistentState<Pos | null>(`pm-pos-${storageKey}`, null, (v): v is Pos | null => v === null || isPos(v));
  const [pos, setPos] = useState<Pos>(() => saved ?? initial(window.innerWidth, window.innerHeight, width));
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  /** Jaga panel tetap terlihat saat jendela mengecil. */
  const keepVisible = useCallback(
    (p: Pos): Pos => {
      const w = Math.min(width, window.innerWidth - 16);
      return { x: clamp(p.x, 8, window.innerWidth - w - 8), y: clamp(p.y, 8, window.innerHeight - 80) };
    },
    [width],
  );
  useLayoutEffect(() => {
    setPos((p) => keepVisible(p));
  }, [keepVisible]);
  useEffect(() => {
    const on = () => setPos((p) => keepVisible(p));
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [keepVisible]);

  // Fokus ke panel saat dibuka (aksesibilitas keyboard).
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (narrow || (e.target as HTMLElement).closest("button")) return;
    const r = ref.current!.getBoundingClientRect();
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    setPos(keepVisible({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy }));
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setSaved(pos);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape" && !e.defaultPrevented) {
      e.stopPropagation();
      onClose();
    }
  };

  const style = narrow ? undefined : { left: pos.x, top: pos.y, width: Math.min(width, window.innerWidth - 16) };

  return (
    <section
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-label={title}
      data-testid={testId}
      onKeyDown={onKeyDown}
      style={style}
      className={`fixed z-50 flex flex-col overflow-hidden border border-gray-200 bg-white shadow-2xl outline-none dark:border-gray-700 dark:bg-gray-900 ${
        narrow
          ? "inset-x-0 bottom-0 max-h-[78vh] rounded-t-2xl"
          : "max-h-[calc(100vh-96px)] rounded-xl"
      }`}
    >
      <header
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={`flex shrink-0 select-none items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/60 ${
          narrow ? "" : "cursor-move"
        }`}
      >
        {!narrow && <GripHorizontal className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />}
        {icon}
        <h4 className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800 dark:text-white/90">{title}</h4>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("pm.panel.close", { title })}
          className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>
      {toolbar}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">{children}</div>
    </section>
  );
}
