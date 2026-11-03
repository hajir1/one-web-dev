import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Images } from "lucide-react";
import Modal from "../components/app/Modal";
import { INPUT, btn } from "../components/app/ui";
import AssetLibrary, { DropZone, useUploader } from "./AssetLibrary";
import AssetImage from "./AssetImage";
import { assetRef } from "./refs";

type Tab = "library" | "upload" | "url";

/** URL gambar dari luar yang boleh dipakai (bukan javascript:/data: non-gambar). */
export const isUsableImageUrl = (u: string) => /^(https?:\/\/[^\s"'<>]+|\/[^\s"'<>]*|\.\/[^\s"'<>]*)$/i.test(u.trim());

/**
 * Pemilih gambar tunggal yang sama di semua tempat (elemen Gambar, galeri,
 * latar, foto undangan, …): tab "Aset saya", "Unggah", "URL".
 * Hasil: `aset:<id>` (pustaka) atau URL biasa.
 */
export default function ImagePickerDialog({
  open,
  onClose,
  onPick,
  multiple,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (values: string[]) => void;
  multiple?: boolean;
  title?: string;
}) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("library");
  const [sel, setSel] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const { run, progress } = useUploader();

  const done = (values: string[]) => {
    if (!values.length) return;
    onPick(values);
    setSel([]);
    setUrl("");
    onClose();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "library", label: t("assets.tab.library") },
    { id: "upload", label: t("assets.tab.upload") },
    { id: "url", label: t("assets.tab.url") },
  ];
  const urlOk = isUsableImageUrl(url);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      icon={<Images className="h-5 w-5" />}
      title={title ?? (multiple ? t("assets.pickManyTitle") : t("assets.pickTitle"))}
      testId="image-picker"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="button" className={btn.secondary} onClick={onClose}>
            {t("common.cancel")}
          </button>
          {tab === "url" ? (
            <button type="button" className={btn.primary} disabled={!urlOk} onClick={() => done([url.trim()])} data-testid="image-picker-ok">
              {t("assets.useUrl")}
            </button>
          ) : (
            <button type="button" className={btn.primary} disabled={!sel.length} onClick={() => done(sel.map(assetRef))} data-testid="image-picker-ok">
              {multiple && sel.length > 1 ? t("assets.useMany", { count: sel.length }) : t("assets.useOne")}
            </button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div role="tablist" className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {tabs.map((x) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={tab === x.id}
              onClick={() => setTab(x.id)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold ${tab === x.id ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-800 dark:text-gray-400"}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        {tab === "library" && <AssetLibrary mode="pick" multiple={multiple} selected={sel} onSelect={setSel} onConfirm={(ids) => done(ids.map(assetRef))} />}

        {tab === "upload" && (
          <DropZone
            busy={progress ? t("assets.uploading", { done: progress.done, total: progress.total }) : null}
            onFiles={async (files) => {
              const r = await run(multiple ? files : files.slice(0, 1));
              if (r.added.length) done(r.added.map((a) => assetRef(a.id)));
            }}
          />
        )}

        {tab === "url" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="image-picker-url">
              {t("assets.urlLabel")}
            </label>
            <input id="image-picker-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…/foto.jpg" className={INPUT} autoFocus />
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("assets.urlHint")}</p>
            {urlOk && <AssetImage src={url.trim()} className="max-h-48 w-auto self-start rounded-lg border border-gray-200 object-contain dark:border-gray-700" />}
          </div>
        )}
      </div>
    </Modal>
  );
}
