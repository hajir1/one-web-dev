import type { StyleState, TextTag } from "./generatorCss";
import i18n from "../../../../i18n";

/** State specific to the Text element: StyleState + a REQUIRED tag. */
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

/** TAG_OPTIONS with labels in the active language (called at render time). */
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
 * Sensible font size & weight per tag. Applied EVERY time the tag changes
 * (overwriting the previous fontSize/fontWeight); they can still be changed manually again
 * in the "Typography" section afterwards.
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
 * The only place for the tag fallback. Old designs in localStorage created
 * before the `tag` field existed may load state without `tag`, so it is still guarded.
 */
export function getTag(s: { tag?: TextTag }): TextTag {
  return s.tag ?? "p";
}