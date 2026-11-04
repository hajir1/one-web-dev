import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Gift, Layers, Lock } from "lucide-react";
import type { AccessReason, ItemId, Tier } from "../types";
import { PieceAccessContext, usePieceAccess, type PieceAccess } from "./pieceAccess";
import { isDemoMode } from "../../demo/demoMode";

/** Mount in Page Maker: sets the access labels & prices in the library. */

export function PieceAccessProvider({ value, children }: { value: PieceAccess; children: ReactNode }) {
  return <PieceAccessContext.Provider value={value}>{children}</PieceAccessContext.Provider>;
}

const TONE: Record<AccessReason, string> = {
  free: "bg-emerald-600 text-white",
  owned: "bg-emerald-600 text-white",
  template: "bg-indigo-600 text-white",
  locked: "bg-amber-500 text-white",
};

/**
 * Small access label: Premium + price (locked), Owned, From template.
 * Free items get no label unless `showFree`.
 */
export function AccessBadge({ itemId, tier, className = "", showFree = false }: { itemId: ItemId; tier: Tier; className?: string; showFree?: boolean }) {
  const { t } = useTranslation();
  const access = usePieceAccess();
  const reason = access.reason(itemId, tier);
  // Demo mode (v15): no "Free" label.
  if (reason === "free" && (!showFree || isDemoMode())) return null;
  const price = access.priceOf(itemId);
  const Icon = reason === "locked" ? Lock : reason === "template" ? Layers : reason === "owned" ? BadgeCheck : Gift;
  const label =
    reason === "locked"
      ? price !== null
        ? t("market.badge.lockedPrice", { count: price })
        : t("common.premium")
      : t(`market.badge.${reason}`);
  return (
    <span
      data-access={reason}
      title={t(`market.badge.${reason}Hint`)}
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow ${TONE[reason]} ${className}`}
    >
      <Icon className="h-2.5 w-2.5" /> {label}
    </span>
  );
}
