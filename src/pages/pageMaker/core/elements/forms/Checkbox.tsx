import { hexToRgba, shadowValue } from "../../helpers/generatorCss";
import { h } from "../../helpers/markup";
import { BorderSection, FocusRingSection, HoverSection, SECTION_ICONS, ShadowSection, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import { Group, Row } from "../../helpers/SmallUIHelpers";
import {
  ColorField,
  NumberField,
  RangeField,
  TextField,
  ToggleField,
  type Updater,
} from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* CheckboxState                                                       */
/* ------------------------------------------------------------------ */

export interface CheckboxState {
  /* Label text & Gap */
  labelText: string;
  gap: number;
  defaultChecked: boolean;
  /** Atribut name (opsional) — dipakai saat dikirim lewat form. */
  name: string;

  /* Typography */
  fontSize: number;
  fontWeight: number;
  textColor: string;

  /* Checkbox Box Size & Border */
  boxSize: number;
  borderWidth: number;
  borderRadius: number;
  pill: boolean;

  /* Unchecked Colors */
  uncheckedBorderColor: string;
  uncheckedBgColor: string;

  /* Checked Colors */
  checkedBorderColor: string;
  checkedBgColor: string;
  checkColor: string;
  checkSizeRatio: number; // 0.1 to 1.0 (how big the checkmark is compared to box)

  /* Shadow */
  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  shadowOpacity: number;

  /* Hover */
  hoverEnabled: boolean;
  hoverUncheckedBorderColor: string;
  hoverUncheckedBgColor: string;

  /* Focus Ring */
  focusRingEnabled: boolean;
  focusRingColor: string;
  focusRingWidth: number;
  focusRingOpacity: number;

  transitionDuration: number;
  transitionEasing: string;
}

const DEFAULT_STATE: CheckboxState = {
  labelText: "Saya menyetujui syarat & ketentuan",
  gap: 10,
  defaultChecked: true,
  name: "",

  fontSize: 14,
  fontWeight: 400,
  textColor: "#374151",

  boxSize: 20,
  borderWidth: 2,
  borderRadius: 4,
  pill: false,

  uncheckedBorderColor: "#d1d5db",
  uncheckedBgColor: "#ffffff",

  checkedBorderColor: "#3b82f6",
  checkedBgColor: "#3b82f6",
  checkColor: "#ffffff",
  checkSizeRatio: 0.6,

  shadowEnabled: false,
  shadowX: 0,
  shadowY: 1,
  shadowBlur: 2,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 5,

  hoverEnabled: true,
  hoverUncheckedBorderColor: "#9ca3af",
  hoverUncheckedBgColor: "#f9fafb",

  focusRingEnabled: true,
  focusRingColor: "#3b82f6",
  focusRingWidth: 3,
  focusRingOpacity: 25,

  transitionDuration: 200,
  transitionEasing: "ease",
};

const DEFAULT_CLASS_NAME = "custom-checkbox";

/** SVG → data URI yang di-encode penuh (aman untuk semua browser). */
export function svgDataUri(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/* ------------------------------------------------------------------ */
/* CSS generator khusus Checkbox                                       */
/* ------------------------------------------------------------------ */

function generateCheckboxCss(s: CheckboxState, cls: string): string {
  const br = s.pill ? "9999px" : `${s.borderRadius}px`;
  const baseShadow = shadowValue(s);
  const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${s.checkColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const markSize = Math.round(s.boxSize * s.checkSizeRatio * 10) / 10;
  const rules: string[] = [];

  rules.push(`.${cls}-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${s.gap}px;
  cursor: pointer;
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  color: ${s.textColor};
  user-select: none;
}`);

  // Input asli tetap ada (bisa difokus & dibaca screen reader), hanya disembunyikan visual.
  rules.push(`.${cls}-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
}`);

  rules.push(`.${cls}-box {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${s.boxSize}px;
  height: ${s.boxSize}px;
  background-color: ${s.uncheckedBgColor};
  border: ${s.borderWidth}px solid ${s.uncheckedBorderColor};
  border-radius: ${br};
${baseShadow ? `  box-shadow: ${baseShadow};
` : ""}  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}`);

  if (s.hoverEnabled) {
    rules.push(`.${cls}-wrapper:hover .${cls}-input:not(:checked) ~ .${cls}-box {
  border-color: ${s.hoverUncheckedBorderColor};
  background-color: ${s.hoverUncheckedBgColor};
}`);
  }

  if (s.focusRingEnabled) {
    rules.push(`.${cls}-input:focus-visible ~ .${cls}-box {
  box-shadow: ${baseShadow ? baseShadow + ", " : ""}0 0 0 ${s.focusRingWidth}px ${hexToRgba(s.focusRingColor, s.focusRingOpacity)};
}`);
  } else {
    rules.push(`.${cls}-input:focus-visible ~ .${cls}-box {
  outline: 2px solid ${s.checkedBorderColor};
  outline-offset: 2px;
}`);
  }

  rules.push(`.${cls}-input:checked ~ .${cls}-box {
  background-color: ${s.checkedBgColor};
  border-color: ${s.checkedBorderColor};
}`);

  rules.push(`.${cls}-box::after {
  content: "";
  display: block;
  width: ${markSize}px;
  height: ${markSize}px;
  background-image: ${svgDataUri(checkSvg)};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}`);

  rules.push(`.${cls}-input:checked ~ .${cls}-box::after {
  opacity: 1;
  transform: scale(1);
}`);

  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: CheckboxState, cls: string) {
  return h(
    "label",
    { class: `${cls}-wrapper` },
    h("input", {
      type: "checkbox",
      class: `${cls}-input`,
      name: s.name.trim() || undefined,
      checked: s.defaultChecked,
    }),
    h("span", { class: `${cls}-box`, "aria-hidden": "true" }),
    h("span", { class: `${cls}-text` }, s.labelText),
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function checkboxSections(s: CheckboxState, update: Updater<CheckboxState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "content",
      label: i18n.t("el.f.content"),
      icon: SECTION_ICONS.content,
      content: (
        <>
          <TextField {...p} k="labelText" label={i18n.t("el.f.labelText")} />
          <TextField {...p} k="name" label={i18n.t("el.f.nameAttrOptional")} placeholder={i18n.t("el.f.namePlaceholderAgree")} />
          <ToggleField {...p} k="defaultChecked" label={i18n.t("el.f.checkedByDefault")} />
        </>
      ),
    },
    { id: "typography", label: i18n.t("el.f.typography"), icon: SECTION_ICONS.typography, content: <TypographySection {...p} /> },
    {
      id: "sizing",
      label: i18n.t("el.f.size"),
      icon: SECTION_ICONS.sizing,
      content: (
        <>
          <Row>
            <NumberField {...p} k="boxSize" label={i18n.t("el.f.boxSize")} min={8} />
            <NumberField {...p} k="gap" label={i18n.t("el.f.gapToLabel")} min={0} />
          </Row>
          <RangeField
            {...p}
            k="checkSizeRatio"
            label={i18n.t("el.f.checkSize")}
            min={0.1}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
          />
        </>
      ),
    },
    {
      id: "colors",
      label: i18n.t("el.f.color"),
      icon: SECTION_ICONS.background,
      content: (
        <>
          <Group title={i18n.t("el.f.unchecked")}>
            <Row>
              <ColorField {...p} k="uncheckedBgColor" label={i18n.t("el.f.background")} />
              <ColorField {...p} k="uncheckedBorderColor" label={i18n.t("el.f.border")} />
            </Row>
          </Group>
          <Group title={i18n.t("el.f.checked")}>
            <Row>
              <ColorField {...p} k="checkedBgColor" label={i18n.t("el.f.background")} />
              <ColorField {...p} k="checkedBorderColor" label={i18n.t("el.f.border")} />
            </Row>
            <ColorField {...p} k="checkColor" label={i18n.t("el.f.checkColor")} />
          </Group>
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
        <HoverSection {...p} labels={{ toggle: i18n.t("el.f.uncheckedHoverStyle") }}>
          <ColorField {...p} k="hoverUncheckedBgColor" label={i18n.t("el.f.bgOnHover")} />
          <ColorField {...p} k="hoverUncheckedBorderColor" label={i18n.t("el.f.borderOnHover")} />
        </HoverSection>
      ),
    },
    { id: "focus", label: i18n.t("el.f.focus"), icon: SECTION_ICONS.focus, content: <FocusRingSection {...p} /> },
  ];
}



/* ------------------------------------------------------------------ */
/* Definisi — dipakai halaman ini dan Component Maker                  */
/* ------------------------------------------------------------------ */

export const checkboxElement = defineElement<CheckboxState>({
  type: "checkbox",
  label: "Checkbox",
  group: "Form",
  componentName: "Checkbox",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  rootClass: (cls) => `${cls}-wrapper`,
  spec: (s, cls) => ({ css: generateCheckboxCss(s, cls), markup: buildMarkup(s, cls) }),
  sections: checkboxSections,
});
