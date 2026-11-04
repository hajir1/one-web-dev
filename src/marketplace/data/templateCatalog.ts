import i18n from "../../i18n";
import { LIBRARY_IDS, type LibraryId } from "../../pages/pageMaker/engine/helpers/libraries";
import { templateFontsIn } from "../../pages/pageMaker/core/helpers/templateFonts";
import { collectElements, walk } from "../../pages/pageMaker/engine/helpers/tree";
import type { BoxNode, ComponentNode } from "../../pages/pageMaker/engine/helpers/componentTypes";
import { buildTemplatePages, type WebTemplate } from "../../pages/webTemplates/registry";
import { itemIdOf } from "../entitlements";
import type { ElementCatalogItem, ItemId, SectionCatalogItem, TemplateCatalogItem } from "../types";

/* ================================================================== */
/* Template metadata from the template SOURCES in the frontend (registry). */
/*                                                                    */
/* Only used by the seed export script (src/tools/exportTemplates.ts → initial */
/* backend data) and tests. The app reads templates from GET /templates; */
/* this file is deliberately not imported by app code so the content of 250 templates */
/* is not bundled.                                                      */
/* ================================================================== */

/** Template content: section presets & elements used across all its pages (in order of appearance). */
export function templateContents(t: WebTemplate): { sectionIds: ItemId[]; elementIds: ItemId[]; sectionCount: number; libraries: LibraryId[]; fonts: string[] } {
  const sections: ItemId[] = [];
  const elements: ItemId[] = [];
  const libs = new Set<LibraryId>();
  const fonts = new Set<string>();
  let sectionCount = 0;
  for (const page of buildTemplatePages(t, "id")) {
    const root = page.doc.root;
    sectionCount += root.children.length;
    for (const id of root.libraries ?? []) libs.add(id);
    for (const f of templateFontsIn(JSON.stringify(root))) fonts.add(f);
    walk(root, (n: ComponentNode) => {
      const id = n.kind === "box" ? (n as BoxNode).section?.presetId : undefined;
      if (id) sections.push(itemIdOf.section(id));
    });
    for (const e of collectElements(root)) elements.push(itemIdOf.element(e.elementType));
  }
  return { sectionIds: [...new Set(sections)], elementIds: [...new Set(elements)], sectionCount, libraries: LIBRARY_IDS.filter((id) => libs.has(id)), fonts: [...fonts] };
}

export function buildTemplateCatalog(pieces: { sections: SectionCatalogItem[]; elements: ElementCatalogItem[] }, templates: WebTemplate[]): TemplateCatalogItem[] {
  const premium = new Set([...pieces.sections, ...pieces.elements].filter((i) => i.tier === "premium").map((i) => i.id));
  return templates.map((t) => {
    const c = templateContents(t);
    const lang = i18n.language?.startsWith("en") ? "en" : "id";
    return {
      id: itemIdOf.template(t.id),
      kind: "template",
      refId: t.id,
      name: i18n.t(`templates.items.${t.id}.name`, { defaultValue: t.id }),
      description: i18n.t(`templates.items.${t.id}.description`, { defaultValue: "" }),
      category: t.category,
      tier: t.tier,
      price: t.price,
      isNew: !!t.isNew,
      accent: t.accent,
      tags: t.tags,
      pages: t.content.pages.map((p) => ({ key: p.key, name: p.name[lang] })),
      sectionIds: c.sectionIds,
      elementIds: c.elementIds,
      // Free templates do not include Premium items; only Premium templates unlock their built-in items.
      premiumItemIds: t.tier === "premium" ? [...c.sectionIds, ...c.elementIds].filter((id) => premium.has(id)) : [],
      sectionCount: c.sectionCount,
      libraries: c.libraries,
      fonts: c.fonts,
    };
  });
}
