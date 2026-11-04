import { createContext, useContext } from "react";
import type { AccessReason, ItemId, Tier } from "../types";
import { isDemoMode } from "../../demo/demoMode";

/* ================================================================== */
/* Access context for the element library & section picker in Page Maker. */
/* Without a provider: the old behavior (Premium = locked, no price).    */
/* ================================================================== */

export interface PieceAccess {
  reason: (itemId: ItemId, tier: Tier) => AccessReason;
  /** Credit price of a Premium item (null = unknown). */
  priceOf: (itemId: ItemId) => number | null;
}

const DEFAULT_ACCESS: PieceAccess = {
  reason: (_id, tier) => (tier === "free" || isDemoMode() ? "free" : "locked"),
  priceOf: () => null,
};

export const PieceAccessContext = createContext<PieceAccess>(DEFAULT_ACCESS);

export const usePieceAccess = () => useContext(PieceAccessContext);
