import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, Trash2 } from "lucide-react";
import AssetImage from "./AssetImage";
import ImagePickerDialog from "./ImagePickerDialog";
import { assetIdOf } from "./refs";
import { useAssets } from "./store";

/** Short text describing the image source: asset name, file name from the URL, or "old upload". */
export function useImageLabel() {
  const { t } = useTranslation();
  const assets = useAssets((s) => s.assets);
  return (v: string) => {
    const id = assetIdOf(v);
    if (id) return assets.find((a) => a.id === id)?.name ?? t("assets.fromLibrary");
    if (v.startsWith("data:")) return t("assets.legacyUpload");
    const tail = v.split(/[?#]/)[0].split("/").filter(Boolean).pop();
    return tail ? decodeURIComponent(tail).slice(0, 60) : v.slice(0, 60);
  };
}

/**
 * Image field: small preview + "Choose image"/"Replace" (opens the picker:
 * My assets / Upload / URL) + remove. Value: `aset:<id>` or a URL.
 */
export default function ImageValueInput({ id, value, onChange, allowEmpty = true }: { id?: string; value: string; onChange: (v: string) => void; allowEmpty?: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const label = useImageLabel();
  const v = (value ?? "").trim();
  return (
    <div className="flex items-center gap-2" data-testid="image-value-input">
      <button
        type="button"
        id={id}
        onClick={() => setOpen(true)}
        className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 hover:border-brand-500 dark:border-gray-700 dark:bg-gray-800"
        aria-label={v ? t("assets.change") : t("assets.choose")}
      >
        {v ? <AssetImage src={v} className="h-full w-full object-cover" /> : <ImagePlus className="m-auto h-5 w-5 text-gray-400" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-gray-600 dark:text-gray-300" title={v.startsWith("data:") ? undefined : v}>
          {v ? label(v) : t("assets.none")}
        </p>
        <button type="button" onClick={() => setOpen(true)} className="text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300" data-testid="image-value-choose">
          {v ? t("assets.change") : t("assets.choose")}
        </button>
      </div>
      {v && allowEmpty && (
        <button type="button" onClick={() => onChange("")} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-white/10" aria-label={t("assets.clear")}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      {open && <ImagePickerDialog open onClose={() => setOpen(false)} onPick={(vals) => onChange(vals[0])} />}
    </div>
  );
}
