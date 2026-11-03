import { THUMBS } from "../../demo/thumbs.generated";

/* ================================================================== */
/* Thumbnail statis katalog (v21): public/thumbs/<id>.<id|en>.webp,     */
/* dibuat src/tools/genThumbs.ts. Menggantikan iframe halaman utuh per  */
/* kartu (berat: font, library, WebGL). Template Kode hanya punya .id.  */
/* ================================================================== */

const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";

/** URL gambar thumbnail, atau null bila belum dibuat (kartu memakai iframe seperti dulu). */
export function staticThumbUrl(id: string, lang: string): string | null {
  const l = lang.startsWith("en") ? "en" : "id";
  const key = THUMBS[`${id}.${l}`] ? `${id}.${l}` : THUMBS[`${id}.id`] ? `${id}.id` : null;
  return key ? `${base}thumbs/${key}.webp?v=${THUMBS[key]}` : null;
}
