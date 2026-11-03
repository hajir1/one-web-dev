import { assetRef } from "./refs";

/** Desain tersimpan (bentuk minimal, agar fungsi ini bisa diuji tanpa store). */
interface DesignLike {
  id: string;
  name: string;
  state: unknown;
}

export interface AssetUse {
  /** Teks untuk pengguna, mis. "Toko Kopi › Beranda" atau "Undangan Raka (template kode)". */
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
 * Tempat aset dipakai: halaman website (beserta nama websitenya), template kode,
 * dan desain elemen. Dipakai untuk mencegah gambar terhapus selagi masih tampil.
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
      // `aset:abc123` tidak boleh cocok dengan `aset:abc1234`.
      if (!json.includes(ref) || !new RegExp(`${ref}(?![a-z0-9-])`).test(json)) continue;
      const site = type === PAGE_TYPE ? siteOf.get(d.id) : undefined;
      out.push({ label: site ? `${site} › ${d.name}` : `${d.name} (${typeLabel(type)})`, type, designId: d.id });
    }
  }
  return out;
}
