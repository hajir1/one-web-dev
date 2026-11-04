import { Dispatch, SetStateAction, useMemo, useState } from "react";
import i18n from "../../../../i18n";
import type { DesignManagerProps } from "../ui/PanelStyling";
import { SavedDesign, useDesignStore } from "../store/designStore";

import { isVarRef } from "../helpers/cssVars";
/**
 * Merges stored state with DEFAULT_STATE. Designs saved
 * before a new field was added do not have that field; without the
 * merge, the field becomes `undefined` and the CSS/preview breaks (e.g. "NaNpx").
 */
export function mergeWithDefault<T>(defaults: T, saved: unknown): T {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaults;
  const out = { ...(defaults as object) } as Record<string, unknown>;
  for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
    if (!(k in out)) continue; // drop obsolete fields that are no longer used
    const d = out[k];
    // Keep the default type: if the stored type differs, use the default.
    // v7: global variable references `var(--x)` may replace numbers/colors.
    if (d !== null && v !== null && typeof d !== typeof v && !(typeof v === "string" && typeof d !== "boolean" && isVarRef(v))) continue;
    if (Array.isArray(d) !== Array.isArray(v)) continue;
    out[k] = v;
  }
  return out as T;
}

/**
 * All the "Saved Designs" logic (save new, save changes, load,
 * rename, delete) as one generic hook. `elementType` separates
 * each element's storage bucket ("button", "text", ...).
 */
export function useDesignSaver<T>(
  elementType: string,
  s: T,
  setS: Dispatch<SetStateAction<T>>,
  DEFAULT_STATE: T,
  /**
   * Turns stored state into active state. Default: merge with
   * DEFAULT_STATE. Useful when the state shape changes between versions and old
   * designs need migrating (e.g. Component Maker).
   */
  normalize: (saved: unknown) => T = (saved) => mergeWithDefault(DEFAULT_STATE, saved),
  /**
   * Free design limit. Creating a new design / copy when the count is already
   * `maxFree` calls `onLimit` and does NOT save. Updating an existing design
   * is not limited; existing designs are never deleted.
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
   * Are there unsaved changes? The saved design baseline is also
   * merged with the defaults so old designs do not always show as "changed".
   */
  const isDirty = useMemo(() => {
    const baseline = activeDesign ? normalize(activeDesign.state) : DEFAULT_STATE;
    // v7: the variable copy (root.vars) is added on save → ignore it when comparing.
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
