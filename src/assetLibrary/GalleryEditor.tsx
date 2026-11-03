import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, GripVertical, ImagePlus, Plus, Trash2 } from "lucide-react";
import AssetImage from "./AssetImage";
import ImagePickerDialog from "./ImagePickerDialog";

export interface GalleryItem {
  src: string;
  caption: string;
}

/**
 * Daftar galeri visual: tiap baris = thumbnail (klik untuk ganti) + keterangan.
 * Urutan diubah dengan seret (atau tombol panah untuk keyboard). "+ Tambah
 * gambar" membuka pemilih Aset (bisa pilih banyak sekaligus). Gambar bawaan
 * template diberi label "Ilustrasi contoh" agar jelas harus diganti.
 * `asText` (opsional) = editor teks lama untuk pengguna mahir.
 */
export default function GalleryEditor({
  items,
  onChange,
  isSample,
  max = 24,
  captionPlaceholder,
  asText,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  isSample?: (src: string) => boolean;
  max?: number;
  captionPlaceholder?: string;
  asText?: ReactNode;
}) {
  const { t } = useTranslation();
  const [picker, setPicker] = useState<{ index: number | null } | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [text, setText] = useState(false);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };
  const set = (i: number, patch: Partial<GalleryItem>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const samples = isSample ? items.filter((it) => isSample(it.src)).length : 0;

  if (text && asText)
    return (
      <div className="flex flex-col gap-2">
        {asText}
        <button type="button" onClick={() => setText(false)} className="self-start text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300">
          {t("assets.gallery.visual")}
        </button>
      </div>
    );

  return (
    <div className="flex flex-col gap-2" data-testid="gallery-editor">
      {samples > 0 && <p className="rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">{t("assets.gallery.sampleNote", { count: samples })}</p>}
      <ul className="flex flex-col gap-1.5">
        {items.map((it, i) => (
          <li
            key={`${i}-${it.src.slice(-24)}`}
            draggable
            onDragStart={(e) => {
              setDrag(i);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              if (drag === null) return;
              e.preventDefault();
              setOver(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (drag !== null) move(drag, i);
              setDrag(null);
              setOver(null);
            }}
            onDragEnd={() => {
              setDrag(null);
              setOver(null);
            }}
            className={`flex items-center gap-1.5 rounded-lg border bg-white p-1.5 dark:bg-gray-900 ${over === i && drag !== i ? "border-brand-500" : "border-gray-200 dark:border-gray-800"} ${drag === i ? "opacity-50" : ""}`}
            data-testid="gallery-row"
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-gray-300" aria-hidden />
            <button type="button" onClick={() => setPicker({ index: i })} className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800" aria-label={t("assets.gallery.replace", { n: i + 1 })}>
              {it.src.trim() ? <AssetImage src={it.src} className="h-full w-full object-cover" /> : <ImagePlus className="m-auto h-5 w-5 text-gray-400" />}
              {isSample?.(it.src) && <span className="absolute inset-x-0 bottom-0 whitespace-nowrap bg-black/60 px-1 text-center text-[9px] font-semibold leading-4 text-white">{t("assets.gallery.sample")}</span>}
            </button>
            <input
              value={it.caption}
              onChange={(e) => set(i, { caption: e.target.value })}
              placeholder={captionPlaceholder ?? t("assets.gallery.caption")}
              aria-label={t("assets.gallery.captionN", { n: i + 1 })}
              className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs text-gray-800 outline-none hover:border-gray-200 focus:border-blue-600 dark:text-white/90 dark:hover:border-gray-700"
            />
            <span className="flex shrink-0 flex-col">
              <button type="button" className="text-gray-400 hover:text-gray-800 disabled:opacity-30 dark:hover:text-white" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label={t("assets.gallery.up", { n: i + 1 })}>
                <ArrowUp className="h-3 w-3" />
              </button>
              <button type="button" className="text-gray-400 hover:text-gray-800 disabled:opacity-30 dark:hover:text-white" disabled={i === items.length - 1} onClick={() => move(i, i + 1)} aria-label={t("assets.gallery.down", { n: i + 1 })}>
                <ArrowDown className="h-3 w-3" />
              </button>
            </span>
            <button type="button" className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-white/10" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={t("assets.gallery.remove", { n: i + 1 })}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setPicker({ index: null })}
        disabled={items.length >= max}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
        data-testid="gallery-add"
      >
        <Plus className="h-3.5 w-3.5" /> {t("assets.gallery.add")}
      </button>
      {asText && (
        <button type="button" onClick={() => setText(true)} className="self-start text-xs text-gray-500 hover:underline dark:text-gray-400">
          {t("assets.gallery.asText")}
        </button>
      )}
      {picker && (
        <ImagePickerDialog
          open
          multiple={picker.index === null}
          onClose={() => setPicker(null)}
          onPick={(vals) => {
            if (picker.index !== null) set(picker.index, { src: vals[0] });
            else onChange([...items, ...vals.slice(0, Math.max(0, max - items.length)).map((src) => ({ src, caption: "" }))]);
          }}
        />
      )}
    </div>
  );
}
