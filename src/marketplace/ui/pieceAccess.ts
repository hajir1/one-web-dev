import { createContext, useContext } from "react";
import type { AccessReason, ItemId, Tier } from "../types";
import { isDemoMode } from "../../demo/demoMode";

/* ================================================================== */
/* Konteks akses untuk pustaka elemen & pemilih section di Page Maker.   */
/* Tanpa provider: perilaku lama (Premium = terkunci, tanpa harga).      */
/* ================================================================== */

export interface PieceAccess {
  reason: (itemId: ItemId, tier: Tier) => AccessReason;
  /** Harga kredit item Premium (null = tidak diketahui). */
  priceOf: (itemId: ItemId) => number | null;
}

const DEFAULT_ACCESS: PieceAccess = {
  reason: (_id, tier) => (tier === "free" || isDemoMode() ? "free" : "locked"),
  priceOf: () => null,
};

export const PieceAccessContext = createContext<PieceAccess>(DEFAULT_ACCESS);

export const usePieceAccess = () => useContext(PieceAccessContext);
