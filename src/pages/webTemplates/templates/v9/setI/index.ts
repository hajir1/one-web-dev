import type { TemplateContent } from "../../../types";
import { buildContentI } from "./kitI";
import { V9I_SPECS } from "./specs";

/** Konten template katalog v9 (bagian I, Premium 3D & animasi), dikunci dengan ID di ../catalogI.ts. */
export const V9I_TEMPLATES: Record<string, TemplateContent> = Object.fromEntries(V9I_SPECS.map((s) => [s.id, buildContentI(s)]));
