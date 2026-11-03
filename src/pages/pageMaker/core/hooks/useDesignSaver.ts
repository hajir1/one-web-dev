import { Dispatch, SetStateAction, useMemo, useState } from "react";
import i18n from "../../../../i18n";
import type { DesignManagerProps } from "../ui/PanelStyling";
import { SavedDesign, useDesignStore } from "../store/designStore";

import { isVarRef } from "../helpers/cssVars";
/**
 * Gabungkan state tersimpan dengan DEFAULT_STATE. Desain yang disimpan
 * sebelum sebuah field baru ditambahkan tidak punya field itu — tanpa
 * merge, field-nya jadi `undefined` dan CSS/preview rusak (mis. "NaNpx").
 */
export function mergeWithDefault<T>(defaults: T, saved: unknown): T {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaults;
  const out = { ...(defaults as object) } as Record<string, unknown>;
  for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
    if (!(k in out)) continue; // buang field usang yang sudah tidak dipakai
    const d = out[k];
    // Pertahankan tipe default: kalau tipe tersimpan beda, pakai default.
    // v7: referensi variabel global `var(--x)` boleh menggantikan angka/warna.
    if (d !== null && v !== null && typeof d !== typeof v && !(typeof v === "string" && typeof d !== "boolean" && isVarRef(v))) continue;
    if (Array.isArray(d) !== Array.isArray(v)) continue;
    out[k] = v;
  }
  return out as T;
}

/**
 * Seluruh logic "Desain Tersimpan" (simpan baru, simpan perubahan, muat,
 * rename, hapus) sebagai satu hook generic. `elementType` memisahkan
 * keranjang penyimpanan tiap elemen ("button", "text", ...).
 */
export function useDesignSaver<T>(
  elementType: string,
  s: T,
  setS: Dispatch<SetStateAction<T>>,
  DEFAULT_STATE: T,
  /**
   * Ubah state tersimpan menjadi state aktif. Default: merge dengan
   * DEFAULT_STATE. Berguna kalau bentuk state berubah antar versi dan desain
   * lama perlu dimigrasi (mis. Component Maker).
   */
  normalize: (saved: unknown) => T = (saved) => mergeWithDefault(DEFAULT_STATE, saved),
  /**
   * Batas desain gratis. Membuat desain baru / salinan saat jumlahnya sudah
   * `maxFree` memanggil `onLimit` dan TIDAK menyimpan. Memperbarui desain
   * yang sudah ada tidak dibatasi; desain yang ada tidak pernah dihapus.
   */
  limit: { maxFree?: number; onLimit?: () => void } = {},
): DesignManagerProps {
  const designs = useDesignStore((st) => st.designs[elementType]) ?? EMPTY;
  const saveDesign = useDesignStore((st) => st.saveDesign);
  const updateDesign = useDesignStore((st) => st.updateDesign);
  const renameDesign = useDesignStore((st) => st.renameDesign);
  const deleteDesign = useDesignStore((st) => st.deleteDesign);

  const [activeDesignId, setActiveDesignId] = useState<string | null>(null);
  const [designNameInput, setDesignNameInput] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const activeDesign = designs.find((d) => d.id === activeDesignId) || null;

  const limitReached = limit.maxFree !== undefined && designs.length >= limit.maxFree;
  const guard = () => {
    if (!limitReached) return true;
    limit.onLimit?.();
    return false;
  };

  const handleSaveNew = (nameArg?: string) => {
    if (!guard()) return null;
    const name = (nameArg ?? designNameInput).trim() || i18n.t("pm.design.defaultName", { n: designs.length + 1 });
    const id = saveDesign(elementType, name, s);
    setActiveDesignId(id);
    setDesignNameInput(name);
    return id;
  };

  const handleSaveChanges = () => {
    if (!activeDesignId || !activeDesign) return false;
    updateDesign(elementType, activeDesignId, s);
    return true;
  };

  const handleDuplicate = () => {
    if (!activeDesign || !guard()) return null;
    const name = `${activeDesign.name} ${i18n.t("pm.design.copySuffix")}`;
    const id = saveDesign(elementType, name, s);
    setActiveDesignId(id);
    setDesignNameInput(name);
    return id;
  };

  const handleLoad = (design: SavedDesign) => {
    setS(normalize(design.state));
    setActiveDesignId(design.id);
    setDesignNameInput(design.name);
  };

  const handleNewDesign = () => {
    setS(DEFAULT_STATE);
    setActiveDesignId(null);
    setDesignNameInput("");
  };

  const startRename = (design: SavedDesign) => {
    setRenamingId(design.id);
    setRenameValue(design.name);
  };

  const confirmRename = () => {
    if (renamingId) renameDesign(elementType, renamingId, renameValue);
    setRenamingId(null);
  };

  const cancelRename = () => setRenamingId(null);

  const handleDelete = (id: string) => {
    deleteDesign(elementType, id);
    if (activeDesignId === id) {
      setActiveDesignId(null);
      setDesignNameInput("");
    }
  };

  /**
   * Ada perubahan yang belum tersimpan? Baseline desain tersimpan ikut
   * di-merge dengan default supaya desain lama tidak selalu tampil "berubah".
   */
  const isDirty = useMemo(() => {
    const baseline = activeDesign ? normalize(activeDesign.state) : DEFAULT_STATE;
    // v7: salinan variabel (root.vars) ditambahkan saat menyimpan → abaikan saat membandingkan.
    const strip = (x: unknown) => JSON.stringify(x, (k, v) => (k === "vars" && Array.isArray(v) ? undefined : v));
    return strip(baseline) !== strip(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDesign, s, DEFAULT_STATE]);

  return {
    designs,
    activeDesign,
    activeDesignId,
    designNameInput,
    setDesignNameInput,
    renamingId,
    renameValue,
    setRenameValue,
    handleSaveNew,
    handleSaveChanges,
    handleNewDesign,
    handleDuplicate,
    freeLimit: limit.maxFree,
    limitReached,
    isDirty,
    handleLoad,
    handleDelete,
    startRename,
    confirmRename,
    cancelRename,
  };
}

const EMPTY: SavedDesign[] = [];
