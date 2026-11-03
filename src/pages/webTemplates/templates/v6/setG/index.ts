import type { TemplateContent } from "../../../types";
import { buildContent } from "./kitG";
import { V6G_SPECS } from "./specs";

/** Konten template katalog v6 (bagian G), dikunci dengan ID di ../catalogG.ts. */
export const V6G_TEMPLATES: Record<string, TemplateContent> = Object.fromEntries(V6G_SPECS.map((s) => [s.id, buildContent(s)]));
