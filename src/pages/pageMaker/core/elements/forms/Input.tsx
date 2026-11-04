import {
  backgroundCss,
  borderRadiusCss,
  hexToRgba,
  InputType,
  marginCss,
  StyleState,
} from "../../helpers/generatorCss";
import { h, raw } from "../../helpers/markup";
import { standardStyleSections, type PanelSection, type Updater } from "../../ui/PanelStyling";
import { SelectField, Show, TextField, ToggleField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State & default                                                     */
/* ------------------------------------------------------------------ */

export interface InputState extends StyleState {
  inputType: InputType;
  /** <label for> label above the input; important for accessibility. */
  labelEnabled: boolean;
  labelText: string;
  required: boolean;
}

const TYPE_OPTIONS: { value: InputType; label: string }[] = [
  { value: "text", label: "el.f.text" },
  { value: "email", label: "el.f.typeEmail" },
  { value: "password", label: "el.f.typePassword" },
  { value: "number", label: "el.f.numbers" },
  { value: "search", label: "el.f.typeSearch" },
  { value: "tel", label: "el.f.typeTel" },
  { value: "url", label: "el.f.typeUrl" },
];

const DEFAULT_STATE: InputState = {
  text: "Masukkan teks placeholder",

  widthMode: "full",
  width: 320,

  paddingLinked: false,
  paddingTop: 10,
  paddingRight: 14,
  paddingBottom: 10,
  paddingLeft: 14,

  marginLinked: false,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,

  fontSize: 14,
  fontWeight: 400,
  letterSpacing: 0,
  textColor: "#111827",
  textTransform: "none",
  textAlign: "left",

  bgType: "solid",
  bgColor: "#ffffff",
  gradientFrom: "#2563eb",
  gradientTo: "#7c3aed",
  gradientAngle: 90,

  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#d1d5db",
  borderRadius: 8,
  pill: false,

  shadowEnabled: false,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: "#2563eb",
  shadowOpacity: 35,

  transitionDuration: 150,
  transitionEasing: "ease",

  // The "Hover" field in the panel is also used as the :focus state for Input
  // (see the note in generateInputCss) — the default is a blue focus-ring effect.
  hoverEnabled: true,
  hoverBgColor: "#ffffff",
  hoverTextColor: "#111827",
  hoverBorderColor: "#2563eb",
  hoverTransform: "none",
  hoverShadowEnabled: true,
  hoverShadowX: 0,
  hoverShadowY: 0,
  hoverShadowBlur: 0,
  hoverShadowSpread: 3,
  hoverShadowColor: "#2563eb",
  hoverShadowOpacity: 25,

  iconId: null,
  iconPosition: "left",
  iconSize: 18,
  iconGap: 8,
  iconColorMode: "currentColor",

  inputType: "text",
  labelText: "Alamat email",
  labelEnabled: true,
  required: false,

  cursor: "text"
};

const DEFAULT_CLASS_NAME = "custom-input";

export interface InputClassNames {
  input: string;
  wrapper: string;
  field: string;
  icon: string;
  label: string;
}

/** Derive the wrapper, icon, & label class names from one base class name. */
function deriveClassNames(base: string): InputClassNames {
  return {
    input: base,
    wrapper: `${base}-wrapper`,
    field: `${base}-field`,
    icon: `${base}__icon`,
    label: `${base}__label`,
  };
}

/* ------------------------------------------------------------------ */
/* CSS & markup khusus Input                                           */
/* ------------------------------------------------------------------ */

/**
 * Input does not use the shared `generateCss()` because <input>:
 *  - needs a :focus state (not just :hover) as the main feedback
 *  - the icon is positioned absolutely inside a wrapper (input = void element)
 * The "Hover" field in the panel is used for :hover AND :focus.
 */
function generateInputCss(
  s: InputState,
  hasIcon: boolean,
  cls: InputClassNames,
): string {
  const iconSpace = hasIcon ? s.iconSize + s.iconGap : 0;

  const baseTop = s.paddingTop;
  const baseRight = s.paddingLinked ? s.paddingTop : s.paddingRight;
  const baseBottom = s.paddingLinked ? s.paddingTop : s.paddingBottom;
  const baseLeft = s.paddingLinked ? s.paddingTop : s.paddingLeft;

  const padLeft =
    baseLeft + (hasIcon && s.iconPosition === "left" ? iconSpace : 0);
  const padRight =
    baseRight + (hasIcon && s.iconPosition === "right" ? iconSpace : 0);

  const widthLine =
    s.widthMode === "fixed"
      ? `  width: ${s.width}px;\n`
      : s.widthMode === "full"
        ? `  width: 100%;\n`
        : `  width: auto;\n`;

  const shadowLine = s.shadowEnabled
    ? `  box-shadow: ${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${s.shadowSpread}px ${hexToRgba(s.shadowColor, s.shadowOpacity)};\n`
    : "";

  const wrapper = `.${cls.wrapper} {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  margin: ${marginCss(s)};
${widthLine}}`;

  const input = `.${cls.input} {
  display: block;
  box-sizing: border-box;
  width: 100%;
  cursor: ${s.cursor};
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  border-radius: ${borderRadiusCss(s)};
  padding: ${baseTop}px ${padRight}px ${baseBottom}px ${padLeft}px;
  background: ${backgroundCss(s)};
  color: ${s.textColor};
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  font-family: inherit;
  text-align: ${s.textAlign};
  letter-spacing: ${s.letterSpacing}px;
  outline: none;
  text-transform: ${s.textTransform};
${shadowLine}  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}

.${cls.input}::placeholder {
  color: ${hexToRgba(s.textColor, 55)};
}`;

  const hoverShadowLine = s.hoverShadowEnabled
    ? `  box-shadow: ${s.hoverShadowX}px ${s.hoverShadowY}px ${s.hoverShadowBlur}px ${s.hoverShadowSpread}px ${hexToRgba(s.hoverShadowColor, s.hoverShadowOpacity)};\n`
    : "";

  const hoverFocus = s.hoverEnabled
    ? `

.${cls.input}:hover,
.${cls.input}:focus {
  background: ${s.hoverBgColor};
  color: ${s.hoverTextColor};
  border-color: ${s.hoverBorderColor};
${hoverShadowLine}}`
    : `

.${cls.input}:focus-visible {
  outline: 2px solid ${s.hoverBorderColor};
  outline-offset: 2px;
}`; // without a focus style, the input must still be visible on keyboard focus

  const iconRules = hasIcon
    ? `

.${cls.field} {
  position: relative;
}

.${cls.field} .${cls.icon} {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${s.iconPosition === "left" ? `left: ${baseLeft}px;` : `right: ${baseRight}px;`}
  display: inline-flex;
  pointer-events: none;
  color: ${s.textColor};
}`
    : "";

  const label = s.labelEnabled
    ? `

.${cls.label} {
  display: block;
  margin-bottom: 6px;
  font-size: ${Math.max(s.fontSize - 1, 10)}px;
  font-weight: 600;
  color: ${s.textColor};
}`
    : "";

  return wrapper + "\n\n" + input + hoverFocus + iconRules + label + "\n";
}

function buildMarkup(s: InputState, iconMarkup: string | null, cls: InputClassNames) {
  const id = `${cls.input}-id`;
  const input = h("input", {
    id: s.labelEnabled ? id : undefined,
    type: s.inputType,
    class: cls.input,
    placeholder: s.text,
    "aria-label": s.labelEnabled ? undefined : s.text,
    required: s.required,
  });
  const icon = iconMarkup
    ? h("span", { class: cls.icon, "aria-hidden": "true" }, raw(iconMarkup))
    : null;
  const field = icon
    ? h("div", { class: cls.field }, s.iconPosition === "left" ? [icon, input] : [input, icon])
    : input;
  return h(
    "div",
    { class: cls.wrapper },
    s.labelEnabled ? h("label", { class: cls.label, for: id }, s.labelText) : null,
    field,
  );
}

function inputSections(s: InputState, update: Updater<InputState>): PanelSection[] {
  return standardStyleSections(s, update, {
    backgroundKinds: ["none", "solid", "gradient"],
    textLabel: i18n.t("el.f.placeholder"),
    contentExtra: (
      <>
        <SelectField s={s} update={update} k="inputType" label={i18n.t("el.f.typeAttr")} options={TYPE_OPTIONS.map((o) => ({ value: o.value, label: i18n.t(o.label) }))} />
        <ToggleField s={s} update={update} k="labelEnabled" label={i18n.t("el.f.showLabelAboveInput")} />
        <Show when={s.labelEnabled}>
          <TextField s={s} update={update} k="labelText" label={i18n.t("el.f.labelText")} />
        </Show>
        <ToggleField s={s} update={update} k="required" label={i18n.t("el.f.requiredField")} />
      </>
    ),
    hoverTitle: i18n.t("el.f.hoverFocus"),
    hoverLabels: {
      toggle: i18n.t("el.f.enableHoverFocus"),
      bg: i18n.t("el.f.bgOnHoverFocus"),
      text: i18n.t("el.f.textOnHoverFocus"),
      border: i18n.t("el.f.borderOnHoverFocus"),
    },
    withHoverTransform: false,
  });
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const inputElement = defineElement<InputState>({
  type: "input",
  label: "Input",
  group: "Form",
  componentName: "Input",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  rootClass: (cls) => deriveClassNames(cls).wrapper,
  spec: (s, cls, icons) => {
    const icon = icons(s.iconId, s.iconSize, s.iconColorMode);
    const names = deriveClassNames(cls);
    return { css: generateInputCss(s, !!icon, names), markup: buildMarkup(s, icon, names) };
  },
  sections: inputSections,
});
