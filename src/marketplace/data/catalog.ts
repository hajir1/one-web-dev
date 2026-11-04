import i18n from "../../i18n";
import { ELEMENT_DEFINITIONS } from "../../pages/pageMaker/core/elementDefinitions";
import { SECTION_PRESETS } from "../../pages/pageMaker/helpers/sectionPresets";
import { itemIdOf } from "../entitlements";
import { elementPrice, isNewElement, sectionPrice } from "./prices";
import { serverPiece } from "../serverCatalog";
import type { ElementCatalogItem, ItemId, SectionCatalogItem } from "../types";

/* ================================================================== */
/* Section & element catalog data (editor code lives in the frontend; tiers & */
/* prices are overridden by server values from GET /catalog). Templates are NO longer */
/* assembled here for the app: their metadata & content live on the server. */
/* Template metadata from the registry content: see ./templateCatalog.ts */
/* (only for the seed export script & tests, not in the app bundle).   */
/* ================================================================== */


const ELEMENT_CATEGORY: Record<string, string> = { Elemen: "basic", Form: "form", Data: "data", Navigasi: "navigation", "3D": "3d", Premium: "interactive" };

/** Overrides tiers & prices with server values (once the server catalog has loaded). */
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
