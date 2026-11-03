import { hexToRgba, safeUrl } from "../../helpers/generatorCss";
import { h } from "../../helpers/markup";
import { BorderSection, HoverSection, SECTION_ICONS, ShadowSection, SizingSection, type PanelSection } from "../../ui/PanelStyling";
import { Group } from "../../helpers/SmallUIHelpers";
import { ColorField, NumberField, RangeField, SelectField, Show, TextField, ToggleField, type Updater, ImageField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";
import { sceneImage } from "../placeholders";

/* ------------------------------------------------------------------ */
/* ImageState                                                          */
/* ------------------------------------------------------------------ */

export interface ImageState {
  /* Ukuran */
  widthMode: "auto" | "fixed" | "full";
  width: number;
  heightMode: "auto" | "fixed" | "aspect";
  height: number;
  aspectRatio: string;
  objectFit: "cover" | "contain" | "fill" | "scale-down" | "none";

  /* Border & Radius */
  borderWidth: number;
  borderStyle: "none" | "solid" | "dashed" | "dotted";
  borderColor: string;
  borderRadius: number;
  pill: boolean;

  /* Shadow */
  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  shadowOpacity: number;

  /* Filter */
  filterGrayscale: number; // 0-100%
  filterBlur: number; // px
  filterBrightness: number; // % (default 100)
  filterContrast: number; // % (default 100)
  filterSepia: number; // 0-100%

  /* Overlay */
  overlayEnabled: boolean;
  overlayColor: string;
  overlayOpacity: number; // 0-100%

  /* Hover & Transisi */
  hoverEnabled: boolean;
  transitionDuration: number;
  transitionEasing: string;
  hoverScale: number; // e.g. 1.05
  hoverFilterGrayscale: number;
  hoverFilterBlur: number;
  hoverFilterBrightness: number;
  hoverFilterContrast: number;
  hoverFilterSepia: number;
  hoverOverlayOpacity: number;
  hoverShadowEnabled: boolean;
  hoverShadowX: number;
  hoverShadowY: number;
  hoverShadowBlur: number;
  hoverShadowSpread: number;
  hoverShadowColor: string;
  hoverShadowOpacity: number;

  /* Data Dummy */
  srcUrl: string;
  altText: string;
  lazyLoad: boolean;
  /** Gambar utama halaman (LCP): tanpa lazy, fetchpriority="high". */
  priority?: boolean;
}

const DEFAULT_STATE: ImageState = {
  widthMode: "fixed",
  width: 400,
  heightMode: "aspect",
  height: 300,
  aspectRatio: "16 / 9",
  objectFit: "cover",

  borderWidth: 0,
  borderStyle: "none",
  borderColor: "#e5e7eb",
  borderRadius: 12,
  pill: false,

  shadowEnabled: true,
  shadowX: 0,
  shadowY: 10,
  shadowBlur: 20,
  shadowSpread: -5,
  shadowColor: "#000000",
  shadowOpacity: 15,

  filterGrayscale: 0,
  filterBlur: 0,
  filterBrightness: 100,
  filterContrast: 100,
  filterSepia: 0,

  overlayEnabled: false,
  overlayColor: "#000000",
  overlayOpacity: 30,

  hoverEnabled: true,
  transitionDuration: 300,
  transitionEasing: "ease-in-out",
  hoverScale: 1.05,
  hoverFilterGrayscale: 0,
  hoverFilterBlur: 0,
  hoverFilterBrightness: 110,
  hoverFilterContrast: 105,
  hoverFilterSepia: 0,
  hoverOverlayOpacity: 0,

  hoverShadowEnabled: true,
  hoverShadowX: 0,
  hoverShadowY: 20,
  hoverShadowBlur: 25,
  hoverShadowSpread: -5,
  hoverShadowColor: "#000000",
  hoverShadowOpacity: 25,

  srcUrl: sceneImage(800, 533, ["#f4a261", "#fde2c4"], ["#c2674a", "#9a4a36", "#6d3226"], "#ffe8b0"),
  altText: "Pemandangan alam yang indah",
  lazyLoad: true,
};

const DEFAULT_CLASS_NAME = "custom-image";

/* ------------------------------------------------------------------ */
/* CSS generator khusus Image                                          */
/* ------------------------------------------------------------------ */

function buildFilter(s: ImageState, isHover: boolean = false) {
  const g = isHover ? s.hoverFilterGrayscale : s.filterGrayscale;
  const b = isHover ? s.hoverFilterBlur : s.filterBlur;
  const br = isHover ? s.hoverFilterBrightness : s.filterBrightness;
  const c = isHover ? s.hoverFilterContrast : s.filterContrast;
  const se = isHover ? s.hoverFilterSepia : s.filterSepia;

  const filters = [];
  if (g > 0) filters.push(`grayscale(${g}%)`);
  if (b > 0) filters.push(`blur(${b}px)`);
  if (br !== 100) filters.push(`brightness(${br}%)`);
  if (c !== 100) filters.push(`contrast(${c}%)`);
  if (se > 0) filters.push(`sepia(${se}%)`);

  return filters.length > 0 ? filters.join(" ") : "none";
}

function generateImageCss(s: ImageState, cls: string): string {
  const widthLine =
    s.widthMode === "fixed"
      ? `  width: ${s.width}px;\n`
      : s.widthMode === "full"
        ? `  width: 100%;\n`
        : "";

  const heightLine =
    s.heightMode === "fixed"
      ? `  height: ${s.height}px;\n`
      : s.heightMode === "aspect"
        ? `  aspect-ratio: ${s.aspectRatio};\n`
        : "";

  const shadowLine = s.shadowEnabled
    ? `  box-shadow: ${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${s.shadowSpread}px ${hexToRgba(s.shadowColor, s.shadowOpacity)};\n`
    : "";

  // The wrapper is necessary to clip the scaled image and contain the overlay
  const wrapperBase = `.${cls}-wrapper {
  box-sizing: border-box;
${widthLine}${heightLine}  display: inline-block;
  max-width: 100%;
  position: relative;
  overflow: hidden;
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  border-radius: ${s.pill ? "9999px" : `${s.borderRadius}px`};
${shadowLine}  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}`;

  const imageBase = `.${cls} {
  width: 100%;
  height: 100%;
  object-fit: ${s.objectFit};
  display: block;
  filter: ${buildFilter(s)};
  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}`;

  const overlayBase = s.overlayEnabled
    ? `
.${cls}-overlay {
  position: absolute;
  inset: 0;
  background-color: ${hexToRgba(s.overlayColor, s.overlayOpacity)};
  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
  pointer-events: none;
}`
    : "";

  let hoverCss = "";
  if (s.hoverEnabled) {
    const hoverShadowLine = s.hoverShadowEnabled
      ? `  box-shadow: ${s.hoverShadowX}px ${s.hoverShadowY}px ${s.hoverShadowBlur}px ${s.hoverShadowSpread}px ${hexToRgba(s.hoverShadowColor, s.hoverShadowOpacity)};\n`
      : "";

    hoverCss += (hoverShadowLine ? `
.${cls}-wrapper:hover {
${hoverShadowLine}}
` : "") + `
.${cls}-wrapper:hover .${cls} {
  transform: scale(${s.hoverScale});
  filter: ${buildFilter(s, true)};
}`;

    if (s.overlayEnabled) {
      hoverCss += `
.${cls}-wrapper:hover .${cls}-overlay {
  background-color: ${hexToRgba(s.overlayColor, s.hoverOverlayOpacity)};
}`;
    }
  }

  return (
    [wrapperBase, imageBase, overlayBase, hoverCss]
      .filter(Boolean)
      .join("\n\n") + "\n"
  );
}

/** "16 / 9" → 16/9; nilai tak valid → null. */
function ratioOf(v: string): number | null {
  const m = /^\s*([\d.]+)\s*\/\s*([\d.]+)\s*$/.exec(v);
  const r = m ? Number(m[1]) / Number(m[2]) : Number(v);
  return Number.isFinite(r) && r > 0 ? r : null;
}

export function imageDims(s: Pick<ImageState, "widthMode" | "width" | "heightMode" | "height" | "aspectRatio">): { width: number; height: number } {
  const w = s.widthMode === "fixed" && s.width > 0 ? Math.round(s.width) : 800;
  const r = s.heightMode === "aspect" ? ratioOf(s.aspectRatio) : null;
  const h = r ? Math.round(w / r) : s.height > 0 ? Math.round(s.height) : Math.round((w * 9) / 16);
  return { width: w, height: Math.max(1, h) };
}

function buildMarkup(s: ImageState, cls: string) {
  return h(
    "div",
    { class: `${cls}-wrapper` },
    h("img", {
      class: cls,
      src: safeUrl(s.srcUrl, ""),
      alt: s.altText,
      // Rasio ukuran asli sebelum gambar termuat (cegah layout bergeser); ukuran tampil tetap dari CSS.
      ...imageDims(s),
      loading: s.lazyLoad ? "lazy" : undefined,
      decoding: "async",
      // Gambar utama di atas lipatan (hero): diunduh lebih dulu.
      fetchpriority: s.priority ? "high" : undefined,
    }),
    s.overlayEnabled ? h("div", { class: `${cls}-overlay`, "aria-hidden": "true" }) : null,
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

const pct = (v: number) => `${v}%`;

const FILTERS = [
  { base: "filterGrayscale", hover: "hoverFilterGrayscale", label: () => "Grayscale", max: 100, unit: "%" },
  { base: "filterBlur", hover: "hoverFilterBlur", label: () => "Blur", max: 20, unit: "px" },
  { base: "filterBrightness", hover: "hoverFilterBrightness", label: () => i18n.t("el.f.brightness"), max: 200, unit: "%" },
  { base: "filterContrast", hover: "hoverFilterContrast", label: () => i18n.t("el.f.contrast"), max: 200, unit: "%" },
  { base: "filterSepia", hover: "hoverFilterSepia", label: () => "Sepia", max: 100, unit: "%" },
] as const;

/** Lima slider filter; set yang sama dipakai untuk kondisi normal & hover. */
function filterFields(p: { s: ImageState; update: Updater<ImageState> }, hover: boolean) {
  return (
    <>
      {FILTERS.map((f) => (
        <RangeField
          key={f.base}
          {...p}
          k={hover ? f.hover : f.base}
          label={f.label()}
          min={0}
          max={f.max}
          format={(v) => `${v}${f.unit}`}
        />
      ))}
    </>
  );
}

function imageSections(s: ImageState, update: Updater<ImageState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "source",
      label: i18n.t("el.f.imageSource"),
      icon: SECTION_ICONS.image,
      content: (
        <>
          <ImageField {...p} k="srcUrl" label={i18n.t("el.f.imageUrlSrc")} />
          <TextField
            {...p}
            k="altText"
            label={i18n.t("el.f.altText")}
            hint={i18n.t("el.f.altHint")}
          />
          <ToggleField {...p} k="lazyLoad" label={i18n.t("el.f.lazyLoad")} />
        </>
      ),
    },
    {
      id: "sizing",
      label: i18n.t("el.f.size"),
      icon: SECTION_ICONS.sizing,
      content: (
        <>
          <SizingSection {...p} />
          <SelectField
            {...p}
            k="heightMode"
            label={i18n.t("el.f.height")}
            options={[
              { value: "auto", label: "Auto" },
              { value: "fixed", label: i18n.t("el.f.fixedPx") },
              { value: "aspect", label: i18n.t("el.f.aspectRatio") },
            ]}
          />
          <Show when={s.heightMode === "fixed"}>
            <NumberField {...p} k="height" label={i18n.t("el.f.heightValue")} min={0} />
          </Show>
          <Show when={s.heightMode === "aspect"}>
            <SelectField
              {...p}
              k="aspectRatio"
              label={i18n.t("el.f.ratio")}
              options={[
                { value: "16 / 9", label: i18n.t("el.f.ratio169") },
                { value: "4 / 3", label: i18n.t("el.f.ratio43") },
                { value: "1 / 1", label: i18n.t("el.f.ratio11") },
                { value: "3 / 2", label: i18n.t("el.f.ratio32") },
                { value: "21 / 9", label: i18n.t("el.f.ratio219") },
                { value: "9 / 16", label: i18n.t("el.f.ratio916") },
              ]}
            />
          </Show>
          <SelectField
            {...p}
            k="objectFit"
            label={i18n.t("el.f.objectFitLabel")}
            options={[
              { value: "cover", label: i18n.t("el.f.fitCover") },
              { value: "contain", label: i18n.t("el.f.fitContain") },
              { value: "fill", label: i18n.t("el.f.fitFill") },
              { value: "scale-down", label: "Scale down" },
              { value: "none", label: i18n.t("el.f.fitNone") },
            ]}
          />
        </>
      ),
    },
    { id: "filter", label: i18n.t("el.f.filterEffects"), icon: SECTION_ICONS.filter, content: filterFields(p, false) },
    {
      id: "overlay",
      label: "Overlay",
      icon: SECTION_ICONS.layout,
      content: (
        <>
          <ToggleField {...p} k="overlayEnabled" label={i18n.t("el.f.useOverlay")} />
          <Show when={s.overlayEnabled}>
            <ColorField {...p} k="overlayColor" label={i18n.t("el.f.overlayColor")} />
            <RangeField {...p} k="overlayOpacity" label="Opacity" min={0} max={100} format={pct} />
          </Show>
        </>
      ),
    },
    { id: "border", label: i18n.t("el.f.border"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    {
      id: "hover",
      label: i18n.t("el.f.hover"),
      icon: SECTION_ICONS.hover,
      content: (
        <HoverSection {...p} withTransform={false}>
          <RangeField {...p} k="hoverScale" label={i18n.t("el.f.zoom")} min={1} max={1.5} step={0.01} format={(v) => `${v}×`} />
          <Show when={s.overlayEnabled}>
            <RangeField {...p} k="hoverOverlayOpacity" label={i18n.t("el.f.overlayOpacity")} min={0} max={100} format={pct} />
          </Show>
          <Group title={i18n.t("el.f.hoverFilter")}>{filterFields(p, true)}</Group>
        </HoverSection>
      ),
    },
  ];
}



/* ------------------------------------------------------------------ */
/* Definisi — dipakai halaman ini dan Component Maker                  */
/* ------------------------------------------------------------------ */

export const imageElement = defineElement<ImageState>({
  type: "image",
  label: "Image",
  group: "Elemen",
  componentName: "Image",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  rootClass: (cls) => `${cls}-wrapper`,
  spec: (s, cls) => ({ css: generateImageCss(s, cls), markup: buildMarkup(s, cls) }),
  sections: imageSections,
});
