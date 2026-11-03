import { TEMPLATE_CATALOG } from "../config/templates";
import { CODE_TEMPLATE_IDS } from "../pages/webTemplates/codeTemplates/catalog";

/* ================================================================== */
/* Template yang dibundel di frontend untuk MODE DEMO.                  */
/*                                                                    */
/* v13: SEMUA template katalog (sebelumnya 100 pilihan di v12). Urutan   */
/* = urutan katalog (TEMPLATE_CATALOG). Di mode demo semuanya gratis.    */
/* Setelah katalog berubah, jalankan ulang src/tools/genDemoTemplates.ts.*/
/* ================================================================== */

export const DEMO_TEMPLATE_IDS: readonly string[] = TEMPLATE_CATALOG.map((t) => t.id);

/** Jumlah yang ditampilkan (template Desain Halaman + 37 Template Kode v16–v18). */
export const DEMO_TEMPLATE_COUNT = DEMO_TEMPLATE_IDS.length + CODE_TEMPLATE_IDS.length;
