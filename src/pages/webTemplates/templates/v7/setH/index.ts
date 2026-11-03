import type { TemplateContent } from "../../../types";
import { buildContent } from "./kitH";
import { V7H_SPECS } from "./specs";

/** Konten template katalog v7 (bagian H, dashboard), dikunci dengan ID di ../catalogH.ts. */
export const V7H_TEMPLATES: Record<string, TemplateContent> = Object.fromEntries(V7H_SPECS.map((s) => [s.id, buildContent(s)]));
