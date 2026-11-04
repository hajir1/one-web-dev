import type { TemplateContent } from "../../../types";
import { buildContent } from "./kitG";
import { V6G_SPECS } from "./specs";

/** Catalog v6 template content (part G), keyed by the IDs in ../catalogG.ts. */
export const V6G_TEMPLATES: Record<string, TemplateContent> = Object.fromEntries(V6G_SPECS.map((s) => [s.id, buildContent(s)]));
