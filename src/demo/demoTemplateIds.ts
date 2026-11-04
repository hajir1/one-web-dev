import { TEMPLATE_CATALOG } from "../config/templates";
import { CODE_TEMPLATE_IDS } from "../pages/webTemplates/codeTemplates/catalog";

/* ================================================================== */
/* Templates bundled in the frontend for DEMO MODE.                     */
/*                                                                    */
/* v13: EVERY catalog template (previously 100 picks in v12). Order      */
/* = catalog order (TEMPLATE_CATALOG). In demo mode everything is free.  */
/* After the catalog changes, run src/tools/genDemoTemplates.ts again.*/
/* ================================================================== */

export const DEMO_TEMPLATE_IDS: readonly string[] = TEMPLATE_CATALOG.map((t) => t.id);

/** Number shown (Page Design templates + 37 Code Templates v16–v18). */
export const DEMO_TEMPLATE_COUNT = DEMO_TEMPLATE_IDS.length + CODE_TEMPLATE_IDS.length;
