import type { TemplateContent } from "../../../types";
import { buildContent } from "./kitH";
import { V7H_SPECS } from "./specs";

/** Catalog v7 template content (part H, dashboards), keyed by the IDs in ../catalogH.ts. */
export const V7H_TEMPLATES: Record<string, TemplateContent> = Object.fromEntries(V7H_SPECS.map((s) => [s.id, buildContent(s)]));
