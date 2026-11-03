import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Images } from "lucide-react";
import Modal from "../components/app/Modal";
import { btn } from "../components/app/ui";
import AssetLibrary from "./AssetLibrary";

/** Menu "Aset" di bar Studio / editor template kode: kelola semua gambar. */
export default function AssetLibraryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose} size="xl" icon={<Images className="h-5 w-5" />} title={t("assets.title")} description={t("assets.subtitle")} testId="asset-library-dialog">
      <AssetLibrary mode="manage" />
    </Modal>
  );
}

/** Tombol "Aset" + dialognya. */
export function AssetLibraryButton({ className, labelClassName }: { className?: string; labelClassName?: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className ?? `${btn.secondary} !px-3 !py-1.5`} onClick={() => setOpen(true)} data-testid="open-assets" title={t("assets.subtitle")}>
        <Images className="h-4 w-4" /> <span className={labelClassName}>{t("assets.menu")}</span>
      </button>
      {open && <AssetLibraryDialog open onClose={() => setOpen(false)} />}
    </>
  );
}
