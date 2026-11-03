import type { StyleState, TextTag } from "./generatorCss";
import i18n from "../../../../i18n";

/** State khusus elemen Text: StyleState + tag yang WAJIB ada. */
export interface TextState extends StyleState {
  tag: TextTag;
}

export const TAG_OPTIONS: { value: TextTag; label: string }[] = [
  { value: "h1", label: "H1 — Judul utama" },
  { value: "h2", label: "H2 — Sub judul" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
  { value: "p", label: "P — Paragraf" },
];

/** TAG_OPTIONS dengan label mengikuti bahasa aktif (dipanggil saat render). */
export const tagOptions = (): { value: TextTag; label: string }[] => [
  { value: "h1", label: i18n.t("el.f.tagH1") },
  { value: "h2", label: i18n.t("el.f.tagH2") },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
  { value: "p", label: i18n.t("el.f.tagP") },
];

/**
 * Ukuran & ketebalan font wajar per tag. Diterapkan SETIAP kali tag diganti
 * (menimpa fontSize/fontWeight sebelumnya); tetap bisa diubah manual lagi
 * lewat section "Tipografi" setelahnya.
 */
export const TAG_PRESETS: Record<
  TextTag,
  { fontSize: number; fontWeight: number }
> = {
  h1: { fontSize: 40, fontWeight: 700 },
  h2: { fontSize: 32, fontWeight: 700 },
  h3: { fontSize: 26, fontWeight: 600 },
  h4: { fontSize: 22, fontWeight: 600 },
  h5: { fontSize: 18, fontWeight: 600 },
  h6: { fontSize: 16, fontWeight: 600 },
  p: { fontSize: 16, fontWeight: 400 },
};

/**
 * Satu-satunya tempat fallback tag. Desain lama di localStorage yang dibuat
 * sebelum field `tag` ada bisa memuat state tanpa `tag`, jadi tetap dijaga.
 */
export function getTag(s: { tag?: TextTag }): TextTag {
  return s.tag ?? "p";
}