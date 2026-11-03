import i18n from "../../i18n";
import { LIBRARY_IDS, type LibraryId } from "../../pages/pageMaker/engine/helpers/libraries";
import { templateFontsIn } from "../../pages/pageMaker/core/helpers/templateFonts";
import { collectElements, walk } from "../../pages/pageMaker/engine/helpers/tree";
import type { BoxNode, ComponentNode } from "../../pages/pageMaker/engine/helpers/componentTypes";
import { buildTemplatePages, type WebTemplate } from "../../pages/webTemplates/registry";
import { itemIdOf } from "../entitlements";
import type { ElementCatalogItem, ItemId, SectionCatalogItem, TemplateCatalogItem } from "../types";

/* ================================================================== */
/* Metadata template dari SUMBER template di frontend (registry).        */
/*                                                                    */
/* Hanya dipakai skrip ekspor seed (src/tools/exportTemplates.ts → data   */
/* awal backend) dan tes. Aplikasi membaca template dari GET /templates; */
/* file ini sengaja tidak diimpor kode aplikasi agar isi 250 template    */
/* tidak ikut bundle.                                                   */
/* ================================================================== */

/** Isi template: section preset & elemen yang dipakai di semua halamannya (urut kemunculan). */
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
      // Template Free tidak menyertakan item Premium; hanya template Premium yang membuka item bawaannya.
      premiumItemIds: t.tier === "premium" ? [...c.sectionIds, ...c.elementIds].filter((id) => premium.has(id)) : [],
      sectionCount: c.sectionCount,
      libraries: c.libraries,
      fonts: c.fonts,
    };
  });
}
