import type { SavedDesign } from "../../pageMaker/core/store/designStore";
import { codeTemplateMeta } from "./catalog";
import { applyEdits, type CodeEdits, type RegionRenderer } from "./editModel";
import { FOLIO_REGIONS } from "./render/folioRender";
import { MOTION_REGIONS } from "./render/motionRender";
import { BIZ_REGIONS } from "./render/bizRender";

/* ================================================================== */
/* The user's CODE TEMPLATE project (v17).                               */
/*                                                                    */
/* Stored in designStore with type "code-site". Only the template id    */
/* + the form changes are stored (not a copy of the HTML), so it is small */
/* and also receives template fixes. Final HTML = applyEdits(base). */
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

/** Stored data → a valid document (corrupt/old data does not break the editor). */
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

/** Static HTML regions rebuilt from data (portfolio: project cards & details; 3D motion: the bio code panel; 3D business: lists). */
export function regionsFor(templateId: string): Record<string, RegionRenderer> {
  const group = codeTemplateMeta(templateId)?.code.group;
  return group === "portfolio3d" ? FOLIO_REGIONS : group === "motion3d" ? MOTION_REGIONS : group === "biz3d" ? BIZ_REGIONS : {};
}

/** HTML akhir proyek. */
export const renderCodeSite = (base: string, doc: CodeSiteDoc) => applyEdits(base, doc.edits, regionsFor(doc.templateId));

/** Code template projects created from a specific template. */
export const codeSitesFrom = (templateId: string, list: SavedDesign[]) => list.filter((d) => normalizeCodeSite(d.state)?.templateId === templateId);
