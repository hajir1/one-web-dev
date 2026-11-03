import type { ReactNode } from "react";
import i18n from "../../../../i18n";
import ImageValueInput from "../../../../assetLibrary/ImageValueInput";
import GalleryEditor, { type GalleryItem } from "../../../../assetLibrary/GalleryEditor";
import {
  ColorInput,
  Field,
  LinesInput,
  NumberInput,
  RangeInput,
  Segmented,
  SelectInput,
  SelectOption,
  TextInput,
  Toggle,
} from "../helpers/SmallUIHelpers";

/* ------------------------------------------------------------------ */
/* Bound fields: kontrol form yang langsung terikat ke satu key state. */
/*                                                                    */
/*   <NumberField s={s} update={update} k="boxSize" label="Ukuran" /> */
/*                                                                    */
/* `k` diketik ketat: NumberField hanya menerima key bertipe number,  */
/* ColorField/TextField hanya key string, dst — jadi salah ketik nama */
/* field langsung ketahuan saat compile.                              */
/* ------------------------------------------------------------------ */

/** Signature `update` yang dipakai semua elemen. */
export type Updater<S> = <K extends keyof S>(key: K, value: S[K]) => void;

/** Ambil nama key di S yang tipenya T. */
export type KeysOfType<S, T> = {
  [K in keyof S]-?: S[K] extends T ? K : never;
}[keyof S] &
  string;

interface BoundBase<S> {
  s: S;
  update: Updater<S>;
  label: string;
  hint?: string;
}

export function NumberField<S>({
  s,
  update,
  k,
  label,
  hint,
  min,
  max,
  step,
  suffix,
}: BoundBase<S> & {
  k: KeysOfType<S, number>;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <NumberInput
        value={s[k] as number}
        onChange={(v) => update(k, v as S[typeof k])}
        min={min}
        max={max}
        step={step}
        suffix={suffix}
      />
    </Field>
  );
}

export function ColorField<S>({
  s,
  update,
  k,
  label,
  hint,
}: BoundBase<S> & { k: KeysOfType<S, string> }) {
  return (
    <Field label={label} hint={hint}>
      <ColorInput
        value={s[k] as string}
        onChange={(v) => update(k, v as S[typeof k])}
      />
    </Field>
  );
}

export function TextField<S>({
  s,
  update,
  k,
  label,
  hint,
  placeholder,
  multiline,
  rows,
}: BoundBase<S> & {
  k: KeysOfType<S, string>;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <TextInput
        value={s[k] as string}
        onChange={(v) => update(k, v as S[typeof k])}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
      />
    </Field>
  );
}

export function SelectField<S, K extends KeysOfType<S, string | number>>({
  s,
  update,
  k,
  label,
  hint,
  options,
}: BoundBase<S> & {
  k: K;
  options: readonly SelectOption<S[K] & (string | number)>[];
}) {
  return (
    <Field label={label} hint={hint}>
      <SelectInput
        value={s[k] as S[K] & (string | number)}
        onChange={(v) => update(k, v as S[K])}
        options={options}
      />
    </Field>
  );
}

export function SegmentedField<S, K extends KeysOfType<S, string>>({
  s,
  update,
  k,
  label,
  hint,
  options,
}: BoundBase<S> & {
  k: K;
  options: readonly SelectOption<S[K] & string>[];
}) {
  return (
    <Field label={label} hint={hint}>
      <Segmented
        value={s[k] as S[K] & string}
        onChange={(v) => update(k, v as S[K])}
        options={options}
      />
    </Field>
  );
}

export function ToggleField<S>({
  s,
  update,
  k,
  label,
}: Omit<BoundBase<S>, "hint"> & { k: KeysOfType<S, boolean> }) {
  return (
    <Toggle
      checked={s[k] as boolean}
      onChange={(v) => update(k, v as S[typeof k])}
      label={label}
    />
  );
}

export function RangeField<S>({
  s,
  update,
  k,
  label,
  hint,
  min,
  max,
  step,
  format = (v) => String(v),
}: BoundBase<S> & {
  k: KeysOfType<S, number>;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
}) {
  const v = s[k] as number;
  return (
    <Field label={`${label}: ${format(v)}`} hint={hint}>
      <RangeInput
        value={v}
        onChange={(n) => update(k, n as S[typeof k])}
        min={min}
        max={max}
        step={step}
      />
    </Field>
  );
}

export function LinesField<S>({
  s,
  update,
  k,
  label,
  hint,
  rows,
  placeholder,
}: BoundBase<S> & {
  k: KeysOfType<S, string[]>;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <LinesInput
        value={s[k] as string[]}
        onChange={(v) => update(k, v as S[typeof k])}
        rows={rows}
        placeholder={placeholder}
      />
    </Field>
  );
}

/** v21: kolom gambar (Aset saya / Unggah / URL) — nilai `aset:<id>` atau URL. */
export function ImageField<S>({ s, update, k, label, hint }: BoundBase<S> & { k: KeysOfType<S, string> }) {
  return (
    <Field label={label} hint={hint}>
      <ImageValueInput value={(s[k] as string) ?? ""} onChange={(v) => update(k, v as S[typeof k])} />
    </Field>
  );
}

/** Contoh bawaan (Unsplash/Picsum) → label "Ilustrasi contoh" di editor galeri. */
export const isSampleImage = (src: string) => /^https:\/\/(images\.unsplash\.com|picsum\.photos)\//.test(src);

const toGallery = (lines: string[]): GalleryItem[] =>
  (lines ?? [])
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const at = l.indexOf("|");
      return at < 0 ? { src: l, caption: "" } : { src: l.slice(0, at).trim(), caption: l.slice(at + 1).trim() };
    });
const fromGallery = (items: GalleryItem[]) => items.filter((it) => it.src.trim()).map((it) => (it.caption.trim() ? `${it.src.trim()} | ${it.caption.trim()}` : it.src.trim()));

/** v21: galeri visual (baris "url | keterangan") + "Edit sebagai teks". */
export function GalleryField<S>({ s, update, k, label, hint, rows, max }: BoundBase<S> & { k: KeysOfType<S, string[]>; rows?: number; max?: number }) {
  const set = (v: string[]) => update(k, v as S[typeof k]);
  return (
    <Field label={label}>
      <GalleryEditor
        items={toGallery(s[k] as string[])}
        onChange={(items) => set(fromGallery(items))}
        isSample={isSampleImage}
        max={max}
        asText={
          <Field label={label} hint={hint}>
            <LinesInput value={s[k] as string[]} onChange={set} rows={rows} />
          </Field>
        }
      />
    </Field>
  );
}

/** Tampilkan children hanya kalau `when` true — biar JSX panel tetap rata. */
export function Show({ when, children }: { when: boolean; children: ReactNode }) {
  return when ? <>{children}</> : null;
}

/* ------------------------------------------------------------------ */
/* Opsi select yang dipakai berulang                                   */
/* ------------------------------------------------------------------ */

export const FONT_WEIGHT_OPTIONS: SelectOption<number>[] = [
  300, 400, 500, 600, 700, 800, 900,
].map((w) => ({ value: w, label: String(w) }));

export const EASING_OPTIONS: SelectOption<string>[] = [
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "linear",
].map((e) => ({ value: e, label: e }));

/** Opsi dengan label i18n lewat getter — selalu mengikuti bahasa aktif saat dibaca. */
export function tOption<V extends string | number>(value: V, key: string): SelectOption<V> {
  return {
    value,
    get label() {
      return i18n.t(key);
    },
  };
}

export const WIDTH_MODE_OPTIONS: SelectOption<"auto" | "fixed" | "full">[] = [
  tOption("auto", "pm.fields.width.auto"),
  tOption("fixed", "pm.fields.width.fixed"),
  tOption("full", "pm.fields.width.full"),
];

export const ALIGN_OPTIONS: SelectOption<"left" | "center" | "right">[] = [
  tOption("left", "pm.fields.align.left"),
  tOption("center", "pm.fields.align.center"),
  tOption("right", "pm.fields.align.right"),
];

export const HOVER_TRANSFORM_OPTIONS: SelectOption<
  "none" | "lift" | "scale" | "lift-scale"
>[] = [
  tOption("none", "pm.fields.hoverTransform.none"),
  tOption("lift", "pm.fields.hoverTransform.lift"),
  tOption("scale", "pm.fields.hoverTransform.scale"),
  tOption("lift-scale", "pm.fields.hoverTransform.liftScale"),
];
