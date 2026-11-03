import type { AccessContext, AccessReason, EntitlementSnapshot, ItemId, Tier } from "./types";

/* ================================================================== */
/* Aturan akses Free/Premium — fungsi MURNI (tanpa React/penyimpanan)    */
/*                                                                    */
/* - Item Free selalu boleh dipakai.                                    */
/* - Item yang dibeli individual boleh dipakai di semua desain.          */
/* - Item yang DISERTAKAN template hanya boleh dipakai di desain yang     */
/*   berasal dari template milik pengguna. Bila pengguna memiliki        */
/*   beberapa template, akses item bawaan semua template itu digabung.   */
/* - Desain dari nol (tanpa template) tidak mendapat akses bawaan        */
/*   template: item Premium yang tidak dibeli tetap terkunci.            */
/* - Membeli template TIDAK membuka seluruh katalog Premium.            */
/* ================================================================== */

export const EMPTY_ENTITLEMENTS: EntitlementSnapshot = { templates: [], templateGrants: [], items: [] };

export const itemIdOf = {
  template: (id: string): ItemId => `template:${id}`,
  section: (presetId: string): ItemId => `preset:${presetId}`,
  element: (type: string): ItemId => `element:${type}`,
  feature: (id: string): ItemId => `feature:${id}`,
};

/** Bagian dari kunci item: { kind, ref }. null bila format tidak dikenal. */
export function parseItemId(id: string): { kind: "template" | "section" | "element" | "feature"; ref: string } | null {
  const m = /^(template|preset|element|feature):([\w-]{1,80})$/.exec(id);
  if (!m) return null;
  return { kind: m[1] === "preset" ? "section" : (m[1] as "template" | "element" | "feature"), ref: m[2] };
}

export const ownsTemplate = (snap: EntitlementSnapshot, templateId: string) => snap.templates.some((t) => t.templateId === templateId);
const ownsItem = (snap: EntitlementSnapshot, itemId: ItemId) => snap.items.some((i) => i.itemId === itemId);

/** Template yang aktif sebagai konteks: hanya bila template itu dimiliki pengguna. */
export function activeTemplateContext(snap: EntitlementSnapshot, ctx: AccessContext | undefined): string | null {
  const id = ctx?.templateId;
  return id && ownsTemplate(snap, id) ? id : null;
}

/** Gabungan item bawaan dari SEMUA template yang dimiliki. */
export function templateGrantedItems(snap: EntitlementSnapshot): Set<ItemId> {
  const owned = new Set(snap.templates.map((t) => t.templateId));
  const out = new Set<ItemId>();
  for (const g of snap.templateGrants) if (owned.has(g.templateId)) g.itemIds.forEach((i) => out.add(i));
  return out;
}

/** Alasan akses untuk satu item (section/element). */
export function accessReason(itemId: ItemId, tier: Tier, snap: EntitlementSnapshot, ctx?: AccessContext): AccessReason {
  if (tier === "free") return "free";
  if (ownsItem(snap, itemId)) return "owned";
  if (activeTemplateContext(snap, ctx) && templateGrantedItems(snap).has(itemId)) return "template";
  return "locked";
}

export const canUse = (itemId: ItemId, tier: Tier, snap: EntitlementSnapshot, ctx?: AccessContext) => accessReason(itemId, tier, snap, ctx) !== "locked";

/** Status template: free (tanpa beli), owned (sudah dibeli), locked. */
export function templateStatus(templateId: string, tier: Tier, snap: EntitlementSnapshot): "free" | "owned" | "locked" {
  if (tier === "free") return "free";
  return ownsTemplate(snap, templateId) ? "owned" : "locked";
}
