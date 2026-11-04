import { gradientCss } from "../../helpers/background";
import type { BgType } from "../../helpers/generatorCss";
import {
  borderRadiusCss,
  hexToRgba,
  paddingCss,
  paddingSides,
  shadowValue,
  widthCss,
} from "../../helpers/generatorCss";
import { h } from "../../helpers/markup";
import { BackgroundSection, BorderSection, FocusRingSection, HoverSection, SECTION_ICONS, ShadowSection, SizingSection, SpacingSection, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import { Group } from "../../helpers/SmallUIHelpers";
import {
  ColorField,
  LinesField,
  NumberField,
  Show,
  TextField,
  ToggleField,
  type Updater,
} from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { svgDataUri } from "./Checkbox";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* SelectState                                                         */
/* ------------------------------------------------------------------ */

export interface SelectState {
  /* Size & Padding */
  widthMode: "auto" | "fixed" | "full";
  width: number;
  paddingLinked: boolean;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  /* Typography */
  fontSize: number;
  fontWeight: number;
  textColor: string;
  textAlign: "left" | "center" | "right";

  /* Background */
  bgType: BgType;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;

  /* Border */
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

  /* Focus & Hover */
  hoverEnabled: boolean;
  hoverBgColor: string;
  hoverBorderColor: string;

  focusRingEnabled: boolean;
  focusBorderColor: string;
  focusRingColor: string;
  focusRingWidth: number;
  focusRingOpacity: number;

  transitionDuration: number;
  transitionEasing: string;

  /* Chevron (Icon dropdown) */
  customChevron: boolean;
  chevronColor: string;
  chevronSize: number;

  /* Data Dummy */
  placeholder: string;
  options: string[];
  labelEnabled: boolean;
  labelText: string;
  required: boolean;
}

const DEFAULT_STATE: SelectState = {
  widthMode: "fixed",
  width: 250,

  paddingLinked: false,
  paddingTop: 10,
  paddingRight: 40,
  paddingBottom: 10,
  paddingLeft: 14,

  fontSize: 14,
  fontWeight: 500,
  textColor: "#111827",
  textAlign: "left",

  bgType: "solid",
  bgColor: "#ffffff",
  gradientFrom: "#f9fafb",
  gradientTo: "#f3f4f6",
  gradientAngle: 180,

  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#d1d5db",
  borderRadius: 8,
  pill: false,

  shadowEnabled: true,
  shadowX: 0,
  shadowY: 1,
  shadowBlur: 2,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 5,

  hoverEnabled: true,
  hoverBgColor: "#f9fafb",
  hoverBorderColor: "#9ca3af",

  focusRingEnabled: true,
  focusBorderColor: "#3b82f6",
  focusRingColor: "#3b82f6",
  focusRingWidth: 3,
  focusRingOpacity: 20,

  transitionDuration: 200,
  transitionEasing: "ease",

  customChevron: true,
  chevronColor: "#6b7280",
  chevronSize: 20,

  placeholder: "Pilih opsi...",
  options: ["Opsi Pertama", "Opsi Kedua", "Opsi Ketiga", "Opsi Keempat"],
  labelEnabled: true,
  labelText: "Kategori",
  required: false,
};

const DEFAULT_CLASS_NAME = "custom-select";

/* ------------------------------------------------------------------ */
/* CSS generator khusus Select                                         */
/* ------------------------------------------------------------------ */

/**
 * The select background is layered: [chevron, gradient] over
 * background-color. Previously the gradient was written to `background-color`
 * (invalid → the background disappeared) and overrode/was overridden by the chevron.
 */
function backgroundLayers(s: SelectState, color: string, withGradient: boolean): string {
  const pad = paddingSides(s);
  const chevron = s.customChevron
    ? svgDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${s.chevronColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
      )
    : null;
  const gradient = withGradient
    ? gradientCss(s)
    : null;

  const images = [chevron, gradient].filter(Boolean) as string[];
  const lines = [`  background-color: ${withGradient ? "transparent" : color};`];
  if (images.length) {
    const chevronPos = `right ${Math.max(Math.round((pad.right - s.chevronSize) / 2), 4)}px center`;
    lines.push(`  background-image: ${images.join(", ")};`);
    lines.push(`  background-repeat: no-repeat;`);
    lines.push(
      `  background-position: ${[chevron && chevronPos, gradient && "0 0"].filter(Boolean).join(", ")};`,
    );
    lines.push(
      `  background-size: ${[chevron && `${s.chevronSize}px`, gradient && "100% 100%"].filter(Boolean).join(", ")};`,
    );
  } else {
    lines.push(`  background-image: none;`);
  }
  return lines.join("\n");
}

function generateSelectCss(s: SelectState, cls: string): string {
  const isGradient = s.bgType === "gradient";
  const baseShadow = shadowValue(s);
  const rules: string[] = [];

  rules.push(`.${cls}-wrapper {
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  max-width: 100%;
${widthCss(s)}}`);

  if (s.labelEnabled) {
    rules.push(`.${cls}__label {
  font-size: ${Math.max(s.fontSize - 1, 10)}px;
  font-weight: 600;
  color: ${s.textColor};
}`);
  }

  rules.push(`.${cls} {
  box-sizing: border-box;
  display: block;
  width: 100%;
  margin: 0;
  padding: ${paddingCss(s)};
  font-family: inherit;
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  color: ${s.textColor};
  text-align: ${s.textAlign};
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  border-radius: ${borderRadiusCss(s)};
${s.customChevron ? "  appearance: none;\n  -webkit-appearance: none;\n" : ""}${backgroundLayers(s, s.bgColor, isGradient)}
${baseShadow ? `  box-shadow: ${baseShadow};\n` : ""}  outline: none;
  cursor: pointer;
  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}`);

  if (s.hoverEnabled) {
    rules.push(`.${cls}:hover {
${backgroundLayers(s, s.hoverBgColor, false)}
  border-color: ${s.hoverBorderColor};
}`);
  }

  rules.push(`.${cls}:focus-visible {
  border-color: ${s.focusBorderColor};
${
  s.focusRingEnabled
    ? `  box-shadow: ${baseShadow ? baseShadow + ", " : ""}0 0 0 ${s.focusRingWidth}px ${hexToRgba(s.focusRingColor, s.focusRingOpacity)};`
    : `  outline: 2px solid ${s.focusBorderColor};\n  outline-offset: 2px;`
}
}`);

  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: SelectState, cls: string) {
  const id = `${cls}-id`;
  return h(
    "div",
    { class: `${cls}-wrapper` },
    s.labelEnabled ? h("label", { class: `${cls}__label`, for: id }, s.labelText) : null,
    h(
      "select",
      {
        id: s.labelEnabled ? id : undefined,
        class: cls,
        "aria-label": s.labelEnabled ? undefined : s.placeholder,
        required: s.required,
        "jsx:defaultValue": "",
      },
      h("option", { value: "", disabled: true, "html:selected": true }, s.placeholder),
      s.options.map((opt) => h("option", { value: opt }, opt)),
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function selectSections(s: SelectState, update: Updater<SelectState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "content",
      label: i18n.t("el.f.optionsLabel"),
      icon: SECTION_ICONS.items,
      content: (
        <>
          <ToggleField {...p} k="labelEnabled" label={i18n.t("el.f.showLabel")} />
          <Show when={s.labelEnabled}>
            <TextField {...p} k="labelText" label={i18n.t("el.f.labelText")} />
          </Show>
          <TextField {...p} k="placeholder" label={i18n.t("el.f.placeholder")} />
          <LinesField {...p} k="options" label={i18n.t("el.f.optionList")} rows={6} />
          <ToggleField {...p} k="required" label={i18n.t("el.f.requiredSelect")} />
          <Group title={i18n.t("el.f.chevronIcon")}>
            <ToggleField {...p} k="customChevron" label={i18n.t("el.f.customChevron")} />
            <Show when={s.customChevron}>
              <NumberField {...p} k="chevronSize" label={i18n.t("el.f.chevronSize")} min={6} />
              <ColorField {...p} k="chevronColor" label={i18n.t("el.f.chevronColor")} />
            </Show>
          </Group>
        </>
      ),
    },
    {
      id: "typography",
      label: i18n.t("el.f.typography"),
      icon: SECTION_ICONS.typography,
      content: (
        <TypographySection
          {...p}
          keys={{ size: "fontSize", weight: "fontWeight", color: "textColor", align: "textAlign" }}
        />
      ),
    },
    {
      id: "sizing",
      label: i18n.t("el.f.sizeSpacing"),
      icon: SECTION_ICONS.sizing,
      content: (
        <>
          <SizingSection {...p} />
          <SpacingSection {...p} />
        </>
      ),
    },
    { id: "background", label: i18n.t("el.f.background"), icon: SECTION_ICONS.background, content: <BackgroundSection {...p} kinds={["solid", "gradient"]} /> },
    { id: "border", label: i18n.t("el.f.border"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    { id: "hover", label: i18n.t("el.f.hover"), icon: SECTION_ICONS.hover, content: <HoverSection {...p} /> },
    { id: "focus", label: i18n.t("el.f.focus"), icon: SECTION_ICONS.focus, content: <FocusRingSection {...p} /> },
  ];
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const selectElement = defineElement<SelectState>({
  type: "select",
  label: "Select",
  group: "Form",
  componentName: "Select",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  rootClass: (cls) => `${cls}-wrapper`,
  spec: (s, cls) => ({ css: generateSelectCss(s, cls), markup: buildMarkup(s, cls) }),
  sections: selectSections,
});
