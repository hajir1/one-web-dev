import type { AccessContext, AccessReason, EntitlementSnapshot, ItemId, Tier } from "./types";

/* ================================================================== */
/* Free/Premium access rules: PURE functions (no React/storage)          */
/*                                                                    */
/* - Free items can always be used.                                     */
/* - Individually purchased items may be used in every design.          */
/* - Items INCLUDED with a template may only be used in designs that     */
/*   come from a template the user owns. If the user owns                */
/*   several templates, the built-in item access of all of them is merged. */
/* - Designs from scratch (no template) do not get built-in template     */
/*   access: Premium items that were not purchased stay locked.         */
/* - Buying a template does NOT unlock the whole Premium catalog.       */
/* ================================================================== */

export const EMPTY_ENTITLEMENTS: EntitlementSnapshot = { templates: [], templateGrants: [], items: [] };

export const itemIdOf = {
  template: (id: string): ItemId => `template:${id}`,
  section: (presetId: string): ItemId => `preset:${presetId}`,
  element: (type: string): ItemId => `element:${type}`,
  feature: (id: string): ItemId => `feature:${id}`,
};

/** Parts of an item key: { kind, ref }. null when the format is unknown. */
export function parseItemId(id: string): { kind: "template" | "section" | "element" | "feature"; ref: string } | null {
  const m = /^(template|preset|element|feature):([\w-]{1,80})$/.exec(id);
  if (!m) return null;
  return { kind: m[1] === "preset" ? "section" : (m[1] as "template" | "element" | "feature"), ref: m[2] };
}

export const ownsTemplate = (snap: EntitlementSnapshot, templateId: string) => snap.templates.some((t) => t.templateId === templateId);
const ownsItem = (snap: EntitlementSnapshot, itemId: ItemId) => snap.items.some((i) => i.itemId === itemId);

/** The template active as context: only when the user owns that template. */
export function activeTemplateContext(snap: EntitlementSnapshot, ctx: AccessContext | undefined): string | null {
  const id = ctx?.templateId;
  return id && ownsTemplate(snap, id) ? id : null;
}

/** Union of the built-in items of EVERY owned template. */
export function templateGrantedItems(snap: EntitlementSnapshot): Set<ItemId> {
  const owned = new Set(snap.templates.map((t) => t.templateId));
  const out = new Set<ItemId>();
  for (const g of snap.templateGrants) if (owned.has(g.templateId)) g.itemIds.forEach((i) => out.add(i));
  return out;
}

/** Access reason for one item (section/element). */
export function accessReason(itemId: ItemId, tier: Tier, snap: EntitlementSnapshot, ctx?: AccessContext): AccessReason {
  if (tier === "free") return "free";
  if (ownsItem(snap, itemId)) return "owned";
  if (activeTemplateContext(snap, ctx) && templateGrantedItems(snap).has(itemId)) return "template";
  return "locked";
}

export const canUse = (itemId: ItemId, tier: Tier, snap: EntitlementSnapshot, ctx?: AccessContext) => accessReason(itemId, tier, snap, ctx) !== "locked";

/** Template status: free (no purchase), owned (already purchased), locked. */
export function templateStatus(templateId: string, tier: Tier, snap: EntitlementSnapshot): "free" | "owned" | "locked" {
  if (tier === "free") return "free";
  return ownsTemplate(snap, templateId) ? "owned" : "locked";
}
