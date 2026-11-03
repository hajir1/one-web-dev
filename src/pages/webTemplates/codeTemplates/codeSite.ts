import type { SavedDesign } from "../../pageMaker/core/store/designStore";
import { codeTemplateMeta } from "./catalog";
import { applyEdits, type CodeEdits, type RegionRenderer } from "./editModel";
import { FOLIO_REGIONS } from "./render/folioRender";
import { MOTION_REGIONS } from "./render/motionRender";
import { BIZ_REGIONS } from "./render/bizRender";

/* ================================================================== */
/* Proyek TEMPLATE KODE milik pengguna (v17).                            */
/*                                                                    */
/* Disimpan di designStore dengan tipe "code-site". Yang disimpan hanya  */
/* id template + perubahan dari form (bukan salinan HTML), jadi kecil    */
/* dan ikut mendapat perbaikan template. HTML akhir = applyEdits(dasar). */
/* ================================================================== */

export const CODE_SITE_TYPE = "code-site";

export interface CodeSiteDoc {
  version: 1;
  templateId: string;
  edits: CodeEdits;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const strMap = (v: unknown): Record<string, string> =>
  isObj(v) ? Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === "string") as [string, string][]) : {};

/** Data tersimpan → dokumen valid (data rusak/lama tidak membuat editor gagal). */
export function normalizeCodeSite(raw: unknown): CodeSiteDoc | null {
  if (!isObj(raw) || typeof raw.templateId !== "string") return null;
  const e = isObj(raw.edits) ? raw.edits : {};
  return {
    version: 1,
    templateId: raw.templateId,
    edits: { texts: strMap(e.texts), links: strMap(e.links), vars: strMap(e.vars), data: isObj(e.data) ? e.data : {} },
  };
}

export const createCodeSiteDoc = (templateId: string): CodeSiteDoc => ({ version: 1, templateId, edits: {} });

/** Wilayah HTML statis yang dibangun ulang dari data (portofolio: kartu & detail proyek; 3D motion: panel kode biodata; 3D bisnis: daftar isi). */
export function regionsFor(templateId: string): Record<string, RegionRenderer> {
  const group = codeTemplateMeta(templateId)?.code.group;
  return group === "portfolio3d" ? FOLIO_REGIONS : group === "motion3d" ? MOTION_REGIONS : group === "biz3d" ? BIZ_REGIONS : {};
}

/** HTML akhir proyek. */
export const renderCodeSite = (base: string, doc: CodeSiteDoc) => applyEdits(base, doc.edits, regionsFor(doc.templateId));

/** Proyek template kode yang dibuat dari template tertentu. */
export const codeSitesFrom = (templateId: string, list: SavedDesign[]) => list.filter((d) => normalizeCodeSite(d.state)?.templateId === templateId);
