import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import i18n from "../../../../i18n";
import { isVarRef } from "./cssVars";
import { detachColor, detachNumber, useVarPicker, VarButton, VarChip } from "../ui/VarPicker";

/* ------------------------------------------------------------------ */
/* Small UI helpers — primitif tampilan yang dipakai SEMUA panel.      */
/* Semua kontrol form di panel styling wajib memakai komponen di sini  */
/* (bukan <input>/<select> mentah) supaya tampilannya seragam.         */
/* ------------------------------------------------------------------ */

const CONTROL_CLASS =
  "w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white/90 px-2.5 py-1.5 outline-none focus:border-blue-700 dark:focus:border-blue-500";

/** Kartu bersection dengan judul (dipakai di luar accordion, mis. Nama Class). */
export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b mt-4 border-gray-200 dark:border-gray-800 py-4 first:pt-0 last:border-none">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
        {title}
      </h4>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

/** Sub-judul di dalam satu kategori accordion (mis. "Belum dicentang"). */
export function Group({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 pt-3 first:pt-0 border-t first:border-t-0 border-dashed border-gray-200 dark:border-gray-800">
      {title && (
        <h5 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {title}
        </h5>
      )}
      {children}
    </div>
  );
}

/** Dua kolom sejajar. */
export function Row({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </label>
      )}
      {children}
      {hint && (
        <p className="mt-1 text-[11px] leading-snug text-gray-400">{hint}</p>
      )}
    </div>
  );
}

/**
 * Input angka. Menyimpan teks lokal supaya field bisa dikosongkan sementara
 * saat mengetik (sebelumnya langsung jadi 0), dan nilai dijepit ke min/max.
 */
export function NumberInput(props: {
  /** v7: bisa berisi referensi variabel `var(--x)` (string). */
  value: number | string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const vars = useVarPicker();
  const { value, onChange, suffix = "px" } = props;
  if (typeof value === "string" && isVarRef(value))
    return <VarChip value={value} onDetach={() => onChange(detachNumber(value, vars))} />;
  const num = typeof value === "number" ? value : Number(value) || 0;
  // Variabel ukuran hanya untuk field ber-satuan px (bukan ms, %, ×, dst).
  const pick = vars && suffix === "px" ? <VarButton type="size" onPick={(ref) => onChange(ref as unknown as number)} /> : null;
  return (
    <div className="flex items-center gap-1.5">
      <div className="min-w-0 flex-1">
        <PlainNumberInput {...props} value={num} suffix={suffix} />
      </div>
      {pick}
    </div>
  );
}

function PlainNumberInput({
  value,
  onChange,
  min,
  max,
  step,
  suffix = "px",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const [text, setText] = useState(String(value));

  // Sinkron kalau nilai berubah dari luar (muat desain, reset, dst).
  useEffect(() => {
    if (Number(text) !== value) setText(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const clamp = (n: number) => {
    let out = n;
    if (min !== undefined) out = Math.max(min, out);
    if (max !== undefined) out = Math.min(max, out);
    return out;
  };

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={text}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);
          if (raw.trim() === "" || raw === "-") return;
          const n = Number(raw);
          if (Number.isFinite(n)) onChange(clamp(n));
        }}
        onBlur={() => {
          const n = Number(text);
          const next = text.trim() === "" || !Number.isFinite(n) ? value : clamp(n);
          setText(String(next));
          if (next !== value) onChange(next);
        }}
        className={`${CONTROL_CLASS} px-2`}
      />
      {suffix && (
        <span className="text-xs text-gray-400 shrink-0">{suffix}</span>
      )}
    </div>
  );
}

/** Ubah warna CSS apa pun jadi #rrggbb untuk <input type="color"> (fallback hitam). */
function toHex6(value: string): string {
  const v = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(v))
    return (
      "#" +
      v
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")
        .toLowerCase()
    );
  if (/^#[0-9a-f]{8}$/i.test(v)) return v.slice(0, 7).toLowerCase();
  return "#000000";
}

/**
 * Pemilih warna + input teks. Teks boleh berisi nilai CSS apa pun
 * (transparent, rgb(), dst); picker selalu menerima hex valid supaya
 * browser tidak memunculkan warning "value does not conform".
 */
export function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const vars = useVarPicker();
  if (isVarRef(value)) return <VarChip value={value} onDetach={() => onChange(detachColor(value, vars))} />;
  const isTransparent = value.trim().toLowerCase() === "transparent";
  const field = (
    <div className="flex min-w-0 flex-1 items-center gap-2 rounded border border-gray-300 dark:border-gray-700 px-2 py-1 min-w-0">
      <span className="relative w-7 h-7 shrink-0 rounded overflow-hidden bg-[linear-gradient(45deg,#d1d5db_25%,transparent_25%,transparent_75%,#d1d5db_75%),linear-gradient(45deg,#d1d5db_25%,transparent_25%,transparent_75%,#d1d5db_75%)] bg-size-[8px_8px] bg-position-[0_0,4px_4px]">
        <input
          type="color"
          value={toHex6(value)}
          onChange={(e) => onChange(e.target.value)}
          className={`absolute inset-0 w-full h-full cursor-pointer bg-transparent ${isTransparent ? "opacity-0" : ""}`}
          aria-label={i18n.t("el.ui.pickColor")}
        />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 min-w-0 text-sm bg-transparent text-gray-700 dark:text-gray-300 outline-none"
      />
    </div>
  );
  if (!vars) return field;
  return (
    <div className="flex items-center gap-1.5">
      {field}
      <VarButton type="color" onPick={onChange} />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-blue-800 w-3.5 h-3.5"
      />
      {label}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  return multiline ? (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${CONTROL_CLASS} resize-y`}
    />
  ) : (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={CONTROL_CLASS}
    />
  );
}

export interface SelectOption<V extends string | number = string> {
  value: V;
  label: string;
  group?: string;
}

/** <select> seragam. Nilai angka (mis. font-weight) tetap dikembalikan sebagai angka. */
export function SelectInput<V extends string | number>({
  value,
  onChange,
  options,
}: {
  value: V;
  onChange: (v: V) => void;
  options: readonly SelectOption<V>[];
}) {
  const numeric = typeof value === "number";
  const groups: { name?: string; items: SelectOption<V>[] }[] = [];
  options.forEach((o) => {
    const last = groups[groups.length - 1];
    if (last && last.name === o.group) last.items.push(o);
    else groups.push({ name: o.group, items: [o] });
  });

  const renderOpts = (items: SelectOption<V>[]) =>
    items.map((o) => (
      <option key={String(o.value)} value={o.value}>
        {o.label}
      </option>
    ));

  return (
    <select
      value={value}
      onChange={(e) =>
        onChange((numeric ? Number(e.target.value) : e.target.value) as V)
      }
      className={`${CONTROL_CLASS} px-2`}
    >
      {groups.map((g, i) =>
        g.name ? (
          <optgroup key={g.name + i} label={g.name}>
            {renderOpts(g.items)}
          </optgroup>
        ) : (
          renderOpts(g.items)
        ),
      )}
    </select>
  );
}

export function RangeInput({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-blue-800"
    />
  );
}

/**
 * Textarea yang terikat ke nilai terstruktur lewat `format`/`parse`.
 * Teks lokal hanya disinkronkan ulang kalau nilai berubah DARI LUAR
 * (muat desain / reset) — sebelumnya textarea List & Select tetap
 * menampilkan isi lama setelah desain dimuat. Perbandingan memakai
 * hasil `format`, jadi aman walau induk membuat array baru tiap render.
 */
export function SyncedTextarea<T>({
  value,
  onChange,
  format,
  parse,
  rows = 5,
  placeholder,
}: {
  value: T;
  onChange: (v: T) => void;
  format: (v: T) => string;
  parse: (text: string) => T;
  rows?: number;
  placeholder?: string;
}) {
  const formatted = format(value);
  const [text, setText] = useState(formatted);
  const lastEmitted = useRef(formatted);

  useEffect(() => {
    if (formatted !== lastEmitted.current) {
      lastEmitted.current = formatted;
      setText(formatted);
    }
  }, [formatted]);

  return (
    <textarea
      value={text}
      rows={rows}
      placeholder={placeholder}
      spellCheck={false}
      onChange={(e) => {
        setText(e.target.value);
        const next = parse(e.target.value);
        lastEmitted.current = format(next);
        onChange(next);
      }}
      className={`${CONTROL_CLASS} resize-y`}
    />
  );
}

const joinLines = (v: string[]) => v.join("\n");
const splitLines = (t: string) =>
  t
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Textarea "satu item per baris" yang terikat ke array string. */
export function LinesInput({
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <SyncedTextarea
      value={value}
      onChange={onChange}
      format={joinLines}
      parse={splitLines}
      rows={rows}
      placeholder={placeholder}
    />
  );
}

/** Pilihan tombol kecil berderet (pengganti select untuk 2–4 opsi). */
export function Segmented<V extends string>({
  value,
  onChange,
  options,
}: {
  value: V;
  onChange: (v: V) => void;
  options: readonly SelectOption<V>[];
}) {
  return (
    <div className="flex rounded border border-gray-300 dark:border-gray-700 p-0.5 gap-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            value === o.value
              ? "bg-blue-800 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
