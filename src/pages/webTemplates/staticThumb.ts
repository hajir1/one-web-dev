import { THUMBS } from "../../demo/thumbs.generated";

/* ================================================================== */
/* Static catalog thumbnails (v21): public/thumbs/<id>.<id|en>.webp,    */
/* built by src/tools/genThumbs.ts. Replaces the full-page iframe per   */
/* card (heavy: fonts, libraries, WebGL). Code Templates only have .id. */
/* ================================================================== */

const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";

/** Thumbnail image URL, or null when not built yet (the card uses an iframe as before). */
export function staticThumbUrl(id: string, lang: string): string | null {
  const l = lang.startsWith("en") ? "en" : "id";
  const key = THUMBS[`${id}.${l}`] ? `${id}.${l}` : THUMBS[`${id}.id`] ? `${id}.id` : null;
  return key ? `${base}thumbs/${key}.webp?v=${THUMBS[key]}` : null;
}
