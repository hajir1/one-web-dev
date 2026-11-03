import { ELEMENT_3D_PRICE, ITEM_PRICE, VR_PRO } from "../../config/marketplace";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../pages/pageMaker/core/elementDefinitions";
import { getSectionPreset } from "../../pages/pageMaker/helpers/sectionPresets";
import { parseItemId } from "../entitlements";
import { serverPiece } from "../serverCatalog";
import type { ItemId, Tier } from "../types";

/* ================================================================== */
/* Harga section & elemen (kredit). Sinkron, tanpa memuat katalog        */
/* template, supaya Page Maker bisa menampilkan harga seketika.          */
/* ================================================================== */

/** Fitur yang dibuka sekali per akun (kunci item `feature:<id>`). Nama = konten, tidak diterjemahkan. */
export const FEATURE_ITEMS: Record<string, { name: string; price: number }> = {
  [VR_PRO.id]: { name: "Tur 360° Pro", price: VR_PRO.price },
};

/** Elemen yang ditambahkan pada rilis katalog ini (label "Baru"). */
export const NEW_ELEMENT_TYPES = [
  "floating-input",
  "search-bar",
  "number-stepper",
  "file-upload",
  "segmented",
  "avatar",
  "blockquote",
  "skeleton",
  "pagination",
  "steps",
  "map-embed",
  "popover",
  "toast",
  "offcanvas",
  "dropdown",
  "otp-input",
  "cookie-consent",
  "image-hotspot",
  "form-wizard",
];

/** v9: 5 elemen 3D Premium (juga diberi label "Baru"). */
export const ELEMENTS_3D = Object.keys(ELEMENT_3D_PRICE);
export const isNewElement = (type: string) => NEW_ELEMENT_TYPES.includes(type) || ELEMENTS_3D.includes(type);

/** Elemen rilis sebelumnya (v2) — dipakai tes lama. */
export const ELEMENTS_V2 = ["divider", "textarea", "radio-group", "social-links", "timeline", "gallery-lightbox", "logo-marquee", "modal-popup", "before-after", "back-to-top", "chart"];

/** Elemen Premium yang kompleks = 10 kredit (Rp10rb); lainnya 5 kredit (Rp5rb). */
const ELEMENT_PRICE: Record<string, number> = {
  slider: ITEM_PRICE.premiumMax,
  "stats-counter": ITEM_PRICE.premiumMax,
  "pricing-switch": ITEM_PRICE.premiumMax,
  "mega-menu": ITEM_PRICE.premiumMax,
  "comparison-table": ITEM_PRICE.premiumMax,
  "gallery-lightbox": ITEM_PRICE.premiumMax,
  "modal-popup": ITEM_PRICE.premiumMax,
  "before-after": ITEM_PRICE.premiumMax,
  offcanvas: ITEM_PRICE.premiumMax,
  "image-hotspot": ITEM_PRICE.premiumMax,
  "form-wizard": ITEM_PRICE.premiumMax,
  ...ELEMENT_3D_PRICE,
};

export const elementPrice = (type: string, tier: Tier): number => (tier === "free" ? ITEM_PRICE.free : (ELEMENT_PRICE[type] ?? ITEM_PRICE.premiumMin));

/** Preset Pro (berisi konten lengkap) = 2 kredit, preset dasar = 1. */
export const sectionPrice = (id: string, tier: Tier): number => (tier === "free" ? ITEM_PRICE.free : id.startsWith("pro-") ? ITEM_PRICE.premiumMax : ITEM_PRICE.premiumMin);

/** Tier & harga item section/elemen/fitur dari ID-nya (nilai server bila sudah dimuat); null bila tidak dikenal. */
export function pieceInfo(itemId: ItemId): { kind: "section" | "element" | "feature"; refId: string; tier: Tier; price: number; name: string } | null {
  const local = localPieceInfo(itemId);
  const srv = serverPiece(itemId);
  return local && srv ? { ...local, tier: srv.tier, price: srv.price } : local;
}

/** Nilai bawaan frontend (dipakai sebelum katalog server dimuat). */
function localPieceInfo(itemId: ItemId): { kind: "section" | "element" | "feature"; refId: string; tier: Tier; price: number; name: string } | null {
  const p = parseItemId(itemId);
  if (!p || p.kind === "template") return null;
  if (p.kind === "feature") {
    const f = FEATURE_ITEMS[p.ref];
    return f ? { kind: "feature", refId: p.ref, tier: "premium", price: f.price, name: f.name } : null;
  }
  if (p.kind === "element") {
    const d = ELEMENT_DEFINITION_BY_TYPE[p.ref];
    if (!d) return null;
    const tier: Tier = d.premium ? "premium" : "free";
    return { kind: "element", refId: d.type, tier, price: elementPrice(d.type, tier), name: d.label };
  }
  const s = getSectionPreset(p.ref);
  if (!s) return null;
  return { kind: "section", refId: s.id, tier: s.tier, price: sectionPrice(s.id, s.tier), name: s.name };
}
