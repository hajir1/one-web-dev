import { useId, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2, Copy } from "lucide-react";
import { btn, INPUT } from "../../../../components/app/ui";
import ImageValueInput from "../../../../assetLibrary/ImageValueInput";
import GalleryEditor from "../../../../assetLibrary/GalleryEditor";
import { blankLike, pathKey, setAt, type Path } from "../editModel";

/* ================================================================== */
/* Form otomatis untuk blok data JSON template kode (CONFIG/PROJECTS).   */
/*   teks → input/textarea, angka → input angka, ya/tidak → kotak centang,*/
/*   tanggal ISO → tanggal & jam, warna HEX → pemilih warna,              */
/*   gambar/foto → URL atau unggah (dikecilkan jadi JPEG),               */
/*   daftar → tambah/hapus/urutkan item, objek → kelompok bertingkat.    */
/* Kunci di daftar `hidden` (mis. "id", "adegan") tidak ditampilkan.     */
/* ================================================================== */

const LABEL_CLS = "mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300";
const ISO_RE = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/;
const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const IMAGE_KEY = /^(gambar|foto|image|img|logo|sampul)$/i;
/** "judulHitungMundur" → "Judul hitung mundur". Label khusus dari locales bila ada. */
function useLabel() {
  const { t, i18n } = useTranslation();
  return (key: string) => {
    const k = `codeEditor.keys.${key}`;
    if (i18n.exists(k)) return t(k);
    const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
    return words.charAt(0).toUpperCase() + words.slice(1);
  };
}


/** v21: kolom gambar = pemilih Pustaka Aset (Aset saya / Unggah / URL). */
export function ImageInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return <ImageValueInput id={id} value={value} onChange={onChange} />;
}

/** Daftar objek berbentuk galeri: tepat satu kunci gambar + satu kunci teks (mis. { judul, gambar }). */
function galleryShape(value: unknown[]): { img: string; cap: string } | null {
  if (!value.length) return null;
  let shape: { img: string; cap: string } | null = null;
  for (const v of value) {
    if (!v || typeof v !== "object" || Array.isArray(v)) return null;
    const keys = Object.keys(v);
    const img = keys.find((k) => IMAGE_KEY.test(k));
    const cap = keys.find((k) => k !== img);
    if (keys.length !== 2 || !img || !cap || typeof (v as Record<string, unknown>)[cap] !== "string") return null;
    if (shape && (shape.img !== img || shape.cap !== cap)) return null;
    shape = { img, cap };
  }
  return shape;
}

function Leaf({ k, value, onChange }: { k: string; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId();
  const label = useLabel()(k);
  if (typeof value === "boolean")
    return (
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
        {label}
      </label>
    );
  let field: ReactNode;
  if (typeof value === "number") {
    field = <input id={id} type="number" value={Number.isFinite(value) ? value : 0} step="any" onChange={(e) => e.target.value !== "" && onChange(Number(e.target.value))} className={INPUT} />;
  } else if (typeof value === "string" && ISO_RE.test(value)) {
    const [, local, zone = ""] = ISO_RE.exec(value)!;
    field = <input id={id} type="datetime-local" value={local} onChange={(e) => e.target.value && onChange(`${e.target.value}:00${zone}`)} className={INPUT} />;
  } else if (typeof value === "string" && HEX_RE.test(value)) {
    field = (
      <div className="flex items-center gap-2">
        <input type="color" aria-label={label} value={value.length === 4 ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}` : value} onChange={(e) => onChange(e.target.value)} className="h-9 w-10 cursor-pointer rounded border border-gray-300 bg-transparent p-0.5 dark:border-gray-700" />
        <input id={id} value={value} onChange={(e) => HEX_RE.test(e.target.value) && onChange(e.target.value)} className={`${INPUT} font-mono`} />
      </div>
    );
  } else if (typeof value === "string" && IMAGE_KEY.test(k)) {
    field = <ImageInput id={id} value={value} onChange={onChange} />;
  } else {
    const s = value == null ? "" : String(value);
    field =
      s.length > 70 || s.includes("\n") ? (
        <textarea id={id} value={s} rows={Math.min(6, Math.max(2, Math.ceil(s.length / 60)))} onChange={(e) => onChange(e.target.value)} className={INPUT} />
      ) : (
        <input id={id} value={s} onChange={(e) => onChange(e.target.value)} className={INPUT} />
      );
  }
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={LABEL_CLS}>
        {label}
      </label>
      {field}
    </div>
  );
}

const TITLE_KEYS = ["judul", "nama", "panggilan", "title", "name", "label"];
/** Judul ringkas item daftar: judul/nama bila ada, selain itu nilai teks pertama yang tidak kosong. */
function itemTitle(v: unknown, i: number): string {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    const named = TITLE_KEYS.map((k) => o[k]).find((x) => typeof x === "string" && x.trim());
    const s = named ?? Object.values(o).find((x) => typeof x === "string" && x.trim() && !x.startsWith("data:") && !ISO_RE.test(x));
    if (typeof s === "string") return s.length > 48 ? `${s.slice(0, 46)}…` : s;
  }
  if (typeof v === "string" && v.trim()) return v.length > 48 ? `${v.slice(0, 46)}…` : v;
  return `#${i + 1}`;
}

function ListField({ k, value, path, hidden, onChange }: { k: string; value: unknown[]; path: Path; hidden: Set<string>; onChange: (v: unknown) => void }) {
  const { t } = useTranslation();
  const label = useLabel()(k);
  const [open, setOpen] = useState<number | null>(null);
  const primitive = value.every((x) => typeof x !== "object" || x === null);
  const move = (i: number, d: number) => {
    const next = value.slice();
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
    if (open === i) setOpen(i + d);
  };
  const gal = galleryShape(value);
  if (gal)
    return (
      <fieldset className="min-w-0 rounded-xl border border-gray-200 p-3 dark:border-gray-800" data-testid="data-gallery">
        <legend className="px-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
          {label} <span className="font-normal text-gray-400">({value.length})</span>
        </legend>
        <GalleryEditor
          items={value.map((o) => {
            const r = o as Record<string, unknown>;
            return { src: String(r[gal.img] ?? ""), caption: String(r[gal.cap] ?? "") };
          })}
          onChange={(items) => onChange(items.map((it) => ({ [gal.cap]: it.caption, [gal.img]: it.src })))}
          isSample={(src) => !src.trim()}
          max={40}
        />
      </fieldset>
    );
  return (
    <fieldset className="min-w-0 rounded-xl border border-gray-200 p-3 dark:border-gray-800" data-testid="data-list">
      <legend className="px-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
        {label} <span className="font-normal text-gray-400">({value.length})</span>
      </legend>
      <ol className="flex flex-col gap-2">
        {value.map((item, i) => (
          <li key={i} className={primitive ? "flex items-start gap-1" : "rounded-lg border border-gray-200 dark:border-gray-800"}>
            {primitive ? (
              <>
                {typeof item === "string" && item.length > 60 ? (
                  <textarea value={item} aria-label={`${label} ${i + 1}`} rows={Math.min(5, Math.ceil(item.length / 50))} onChange={(e) => onChange(setAt(value, [i], e.target.value))} className={`${INPUT} min-w-0 !py-1.5`} />
                ) : (
                  <input value={String(item ?? "")} aria-label={`${label} ${i + 1}`} onChange={(e) => onChange(setAt(value, [i], typeof item === "number" ? Number(e.target.value) || 0 : e.target.value))} className={`${INPUT} min-w-0 !py-1.5`} />
                )}
                <ItemTools i={i} n={value.length} move={move} duplicate={() => onChange([...value.slice(0, i + 1), structuredClone(item), ...value.slice(i + 1)])} remove={() => onChange(value.filter((_, j) => j !== i))} />
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 px-2 py-1.5">
                  <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-sm font-medium text-gray-800 dark:text-white/90">
                    <ChevronDown className={`h-4 w-4 shrink-0 transition ${open === i ? "" : "-rotate-90"}`} />
                    <span className="truncate">{itemTitle(item, i)}</span>
                  </button>
                  <ItemTools i={i} n={value.length} move={move} duplicate={() => onChange([...value.slice(0, i + 1), structuredClone(item), ...value.slice(i + 1)])} remove={() => onChange(value.filter((_, j) => j !== i))} />
                </div>
                {open === i && (
                  <div className="border-t border-gray-100 p-3 dark:border-gray-800">
                    <Node value={item} path={[...path, i]} hidden={hidden} onChange={(v) => onChange(setAt(value, [i], v))} />
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
      <button
        type="button"
        data-testid="data-add"
        className={`${btn.ghost} mt-2 !px-2 !py-1 text-xs`}
        onClick={() => {
          onChange([...value, blankLike(value[value.length - 1] ?? "")]);
          if (!primitive) setOpen(value.length);
        }}
      >
        <Plus className="h-3.5 w-3.5" /> {t("codeEditor.addItem")}
      </button>
    </fieldset>
  );
}

function ItemTools({ i, n, move, duplicate, remove }: { i: number; n: number; move: (i: number, d: number) => void; duplicate: () => void; remove: () => void }) {
  const { t } = useTranslation();
  return (
    <span className="flex shrink-0 items-center">
      <button type="button" className={`${btn.icon} !h-7 !w-7`} disabled={i === 0} onClick={() => move(i, -1)} aria-label={t("codeEditor.moveUp")}>
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={`${btn.icon} !h-7 !w-7`} disabled={i === n - 1} onClick={() => move(i, 1)} aria-label={t("codeEditor.moveDown")}>
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={`${btn.icon} !h-7 !w-7`} onClick={duplicate} aria-label={t("codeEditor.duplicateItem")} title={t("codeEditor.duplicateItem")}>
        <Copy className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={`${btn.icon} !h-7 !w-7 hover:!text-rose-600`} onClick={remove} aria-label={t("codeEditor.removeItem")}>
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function Node({ value, path, hidden, onChange, k }: { value: unknown; path: Path; hidden: Set<string>; onChange: (v: unknown) => void; k?: string }) {
  const label = useLabel();
  if (Array.isArray(value)) return <ListField k={k ?? ""} value={value} path={path} hidden={hidden} onChange={onChange} />;
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([key]) => !hidden.has(pathKey([...path, key])));
    const body = (
      <div className="grid gap-3">
        {entries.map(([key, v]) => (
          <Node key={key} k={key} value={v} path={[...path, key]} hidden={hidden} onChange={(nv) => onChange(setAt(value, [key], nv))} />
        ))}
      </div>
    );
    // Objek di dalam objek (mis. "kutipan", "musik") → kelompok berbingkai; item daftar & akar tanpa bingkai.
    return k && typeof path[path.length - 1] === "string" && path.length > 0 ? (
      <fieldset className="min-w-0 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
        <legend className="px-1 text-xs font-semibold text-gray-700 dark:text-gray-200">{label(k)}</legend>
        {body}
      </fieldset>
    ) : (
      body
    );
  }
  return <Leaf k={k ?? ""} value={value} onChange={onChange} />;
}

/** Form untuk satu blok data. */
export default function DataForm({ label, value, hidden, onChange }: { label: string; value: unknown; hidden: string[]; onChange: (v: unknown) => void }) {
  return <Node k={Array.isArray(value) ? label : undefined} value={value} path={[]} hidden={new Set(hidden)} onChange={onChange} />;
}
