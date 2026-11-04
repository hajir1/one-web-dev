import { assetRef } from "./refs";

/** A stored design (minimal shape, so this function can be tested without the store). */
interface DesignLike {
  id: string;
  name: string;
  state: unknown;
}

export interface AssetUse {
  /** Text for the user, e.g. "Coffee Shop › Home" or "Raka Invitation (code template)". */
  label: string;
  type: string;
  designId: string;
}

const SITE_TYPE = "site";
const PAGE_TYPE = "page";

const pagesOfSite = (state: unknown): string[] => {
  const pages = (state as { pages?: { designId?: unknown }[] } | null)?.pages;
  return Array.isArray(pages) ? pages.map((p) => (typeof p?.designId === "string" ? p.designId : "")).filter(Boolean) : [];
};

/**
 * Where an asset is used: website pages (with their website name), code templates,
 * and element designs. Used to prevent deleting images that are still displayed.
 */
export function assetUsage(id: string, designs: Record<string, DesignLike[]>, typeLabel: (type: string) => string = (t) => t): AssetUse[] {
  const ref = assetRef(id);
  const siteOf = new Map<string, string>();
  for (const s of designs[SITE_TYPE] ?? []) for (const p of pagesOfSite(s.state)) if (!siteOf.has(p)) siteOf.set(p, s.name);
  const out: AssetUse[] = [];
  for (const [type, list] of Object.entries(designs)) {
    if (type === SITE_TYPE) continue;
    for (const d of list ?? []) {
      let json: string;
      try {
        json = JSON.stringify(d.state) ?? "";
      } catch {
        continue;
      }
      // `aset:abc123` must not match `aset:abc1234`.
      if (!json.includes(ref) || !new RegExp(`${ref}(?![a-z0-9-])`).test(json)) continue;
      const site = type === PAGE_TYPE ? siteOf.get(d.id) : undefined;
      out.push({ label: site ? `${site} › ${d.name}` : `${d.name} (${typeLabel(type)})`, type, designId: d.id });
    }
  }
  return out;
}
