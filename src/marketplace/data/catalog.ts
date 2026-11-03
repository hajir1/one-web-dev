import i18n from "../../i18n";
import { ELEMENT_DEFINITIONS } from "../../pages/pageMaker/core/elementDefinitions";
import { SECTION_PRESETS } from "../../pages/pageMaker/helpers/sectionPresets";
import { itemIdOf } from "../entitlements";
import { elementPrice, isNewElement, sectionPrice } from "./prices";
import { serverPiece } from "../serverCatalog";
import type { ElementCatalogItem, ItemId, SectionCatalogItem } from "../types";

/* ================================================================== */
/* Data katalog section & elemen (kode editor ada di frontend; tier &    */
/* harga ditimpa nilai server dari GET /catalog). Template TIDAK lagi    */
/* dirakit di sini untuk aplikasi: metadata & isinya ada di server.      */
/* Metadata template dari isi registry: lihat ./templateCatalog.ts       */
/* (hanya untuk skrip ekspor seed & tes, tidak masuk bundle aplikasi).   */
/* ================================================================== */


const ELEMENT_CATEGORY: Record<string, string> = { Elemen: "basic", Form: "form", Data: "data", Navigasi: "navigation", "3D": "3d", Premium: "interactive" };

/** Timpa tier & harga dengan nilai server (bila katalog server sudah dimuat). */
function withServer<T extends { id: ItemId; tier: "free" | "premium"; price: number }>(item: T): T {
  const s = serverPiece(item.id);
  return s ? { ...item, tier: s.tier, price: s.price } : item;
}

export function buildSectionCatalog(): SectionCatalogItem[] {
  return SECTION_PRESETS.map((p) =>
    withServer({
      id: itemIdOf.section(p.id),
      kind: "section" as const,
      refId: p.id,
      name: p.name,
      description: p.description,
      category: p.category ?? "layout",
      tier: p.tier,
      price: sectionPrice(p.id, p.tier),
      isNew: !!p.isNew,
    }),
  );
}

export function buildElementCatalog(): ElementCatalogItem[] {
  return ELEMENT_DEFINITIONS.map((d) => {
    const tier = d.premium ? "premium" : "free";
    return withServer({
      id: itemIdOf.element(d.type),
      kind: "element" as const,
      refId: d.type,
      name: i18n.t(`market.el.${d.type}.name`, { defaultValue: d.label }),
      description: i18n.t(`market.el.${d.type}.description`, { defaultValue: "" }),
      category: ELEMENT_CATEGORY[d.group] ?? "basic",
      tier,
      price: elementPrice(d.type, tier),
      isNew: isNewElement(d.type),
    });
  });
}
