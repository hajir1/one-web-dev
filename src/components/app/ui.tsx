// ─── components/app/ui.tsx ──────────────────────────────────────────────────
// Kit UI bersama OneWebDev (Dashboard, Data, Media, Web Maker,
// Credits). Gaya: biru OneWeb (lihat palet di index.css), abu slate,
// sudut membulat, mode gelap, dan fokus keyboard yang terlihat.
// Semua teks bawaan (aria-label, pesan validasi) lewat i18n.

import { useEffect, useId, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import i18n from "../../i18n";

/* ------------------------------ aksen ------------------------------ */

export type Accent = "blue" | "violet" | "emerald" | "amber" | "indigo" | "rose";

export const ACCENT: Record<Accent, { tile: string; glow: string; text: string }> = {
  blue: { tile: "bg-blue-50 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300", glow: "from-blue-100/70", text: "text-blue-800 dark:text-blue-300" },
  violet: { tile: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", glow: "from-violet-100/70", text: "text-violet-700 dark:text-violet-300" },
  emerald: { tile: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", glow: "from-emerald-100/70", text: "text-emerald-700 dark:text-emerald-300" },
  amber: { tile: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", glow: "from-amber-100/70", text: "text-amber-700 dark:text-amber-300" },
  indigo: { tile: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300", glow: "from-indigo-100/70", text: "text-indigo-700 dark:text-indigo-300" },
  rose: { tile: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300", glow: "from-rose-100/70", text: "text-rose-700 dark:text-rose-300" },
};

/* ------------------------------ tombol ----------------------------- */

const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-40";

export const btn = {
  primary: `${BTN_BASE} bg-brand-600 px-4 py-2.5 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700`,
  secondary: `${BTN_BASE} border border-gray-200 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5`,
  ghost: `${BTN_BASE} px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white/90`,
  danger: `${BTN_BASE} bg-rose-600 px-4 py-2.5 text-white hover:bg-rose-700`,
  success: `${BTN_BASE} bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700`,
  icon: "inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:opacity-40 dark:hover:bg-white/10 dark:hover:text-white/80",
};

/* ------------------------------ panel ------------------------------ */

export function Panel({
  title,
  description,
  actions,
  children,
  className = "",
  bodyClassName = "p-4 sm:p-5",
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/40 ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 px-4 py-3 sm:px-5 dark:border-gray-800">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/* ------------------------------ notice ----------------------------- */

const NOTICE_TONE = {
  info: { cls: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200", Icon: Info },
  warn: { cls: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200", Icon: AlertTriangle },
  error: { cls: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200", Icon: XCircle },
  success: { cls: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200", Icon: CheckCircle2 },
};

export function Notice({
  tone = "info",
  title,
  children,
  onDismiss,
  testId,
}: {
  tone?: keyof typeof NOTICE_TONE;
  title?: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  testId?: string;
}) {
  const { cls, Icon } = NOTICE_TONE[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} data-testid={testId} className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={`${title ? "mt-0.5" : ""} text-[13px] leading-relaxed opacity-90`}>{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label={i18n.t("common.dismissNotice")} className="-m-1 rounded p-1 opacity-60 hover:opacity-100">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------ field ------------------------------ */

export function Field({ label, hint, children, htmlFor }: { label: ReactNode; hint?: ReactNode; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled,
  format = (v) => String(v),
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  format?: (v: number) => string;
  hint?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </label>
        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-200">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-800 disabled:opacity-40"
      />
      {hint && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
    </div>
  );
}

export function Segmented<V extends string>({
  value,
  options,
  onChange,
  label,
  disabled,
}: {
  value: V;
  options: { value: V; label: ReactNode; title?: string }[];
  onChange: (v: V) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-white/5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          disabled={disabled}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 ${
            value === o.value
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
              : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label, hint, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode; disabled?: boolean }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-blue-800 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/50 dark:bg-gray-700" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-800 dark:text-white/90">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{hint}</span>}
      </span>
    </label>
  );
}

export const INPUT =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

/** Angka yang divalidasi & dijepit saat selesai diketik (bukan tiap tombol). */
export function NumberField({
  value,
  onChange,
  min,
  max,
  label,
  suffix,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  label: string;
  suffix?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  const commit = () => {
    const n = Math.round(Number(text));
    const v = Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : value;
    setText(String(v));
    if (v !== value) onChange(v);
  };
  return (
    <Field label={label} htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          inputMode="numeric"
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value.replace(/[^\d]/g, ""))}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className={`${INPUT} ${suffix ? "pr-9" : ""}`}
        />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>}
      </div>
    </Field>
  );
}

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const isHexColor = (v: string) => HEX_RE.test(v.trim());
const normalizeHex = (v: string) => {
  const t = v.trim().toLowerCase();
  return t.length === 4 ? `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}` : t;
};

/** Pilih warna; teks HEX hanya diterapkan bila valid (warna tidak valid sebelumnya membuat latar JPEG jadi hitam). */
export function ColorField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const id = useId();
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const invalid = !isHexColor(text);
  return (
    <Field label={label} htmlFor={id} hint={invalid ? <span className="text-rose-600">{i18n.t("common.invalidHex")}</span> : undefined}>
      <div className={`flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 dark:bg-gray-900 ${invalid ? "border-rose-400" : "border-gray-300 dark:border-gray-700"}`}>
        <input
          type="color"
          aria-label={`${label} (${i18n.t("common.picker")})`}
          value={isHexColor(value) ? normalizeHex(value) : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <input
          id={id}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (isHexColor(e.target.value)) onChange(normalizeHex(e.target.value));
          }}
          onBlur={() => setText(value)}
          className="w-full bg-transparent font-mono text-sm text-gray-800 outline-none dark:text-white/90"
        />
      </div>
    </Field>
  );
}

export function SelectField<V extends string>({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: string }[];
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id}>
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as V)} className={INPUT}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ProgressBar({ value, label }: { value: number | null; label?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10" role="progressbar" aria-label={label} aria-valuenow={value ?? undefined} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`h-full rounded-full bg-blue-700 transition-all duration-300 ${value === null ? "w-1/3 animate-pulse" : ""}`}
        style={value === null ? undefined : { width: `${Math.max(2, value)}%` }}
      />
    </div>
  );
}

export function Chip({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "amber" | "blue" | "rose" }) {
  const cls = {
    gray: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    blue: "bg-blue-50 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  }[tone];
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{children}</span>;
}

export const CHECKERBOARD: React.CSSProperties = {
  backgroundColor: "#fff",
  backgroundImage:
    "linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0,0 7px,7px -7px,-7px 0",
};
