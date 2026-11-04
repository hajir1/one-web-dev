import type { TemplateContent } from "../../../types";
import { buildContentI } from "./kitI";
import { V9I_SPECS } from "./specs";

/** Catalog v9 template content (part I, Premium 3D & animation), keyed by the IDs in ../catalogI.ts. */
export const V9I_TEMPLATES: Record<string, TemplateContent> = Object.fromEntries(V9I_SPECS.map((s) => [s.id, buildContentI(s)]));
