import { generateCss, StyleState } from "../../helpers/generatorCss";
import { h, iconTextNodes } from "../../helpers/markup";
import { standardStyleSections, type PanelSection, type Updater } from "../../ui/PanelStyling";
import { SelectField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State & default                                                     */
/* ------------------------------------------------------------------ */

export interface ButtonState extends StyleState {
  buttonType: "button" | "submit" | "reset";
}

const DEFAULT_STATE: ButtonState = {
  text: "Klik Saya",
  buttonType: "button",

  widthMode: "auto",
  width: 220,

  paddingLinked: false,
  paddingTop: 8,
  paddingRight: 12,
  paddingBottom: 8,
  paddingLeft: 12,

  marginLinked: false,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,

  fontFamily: "",
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: 0,
  textColor: "#ffffff",
  textTransform: "none",
  textAlign: "center",

  bgType: "solid",
  bgColor: "#012060",
  gradientFrom: "#2563eb",
  gradientTo: "#7c3aed",
  gradientAngle: 90,

  borderWidth: 0,
  borderStyle: "solid",
  borderColor: "#1e40af",
  borderRadius: 8,
  pill: false,

  shadowEnabled: false,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 14,
  shadowSpread: 0,
  shadowColor: "#2563eb",
  shadowOpacity: 35,

  transitionDuration: 200,
  transitionEasing: "ease",

  hoverEnabled: true,
  hoverBgColor: "#cfd4df",
  hoverTextColor: "#012060",
  hoverBorderColor: "#cfd4df",
  hoverTransform: "none",
  hoverShadowEnabled: false,
  hoverShadowX: 0,
  hoverShadowY: 10,
  hoverShadowBlur: 22,
  hoverShadowSpread: 0,
  hoverShadowColor: "#2563eb",
  hoverShadowOpacity: 100,

  iconId: null,
  iconPosition: "left",
  iconSize: 18,
  iconGap: 8,
  iconColorMode: "currentColor",

  cursor: "pointer",
};

const DEFAULT_CLASS_NAME = "custom-button";

function buildMarkup(s: ButtonState, cls: string, iconMarkup: string | null) {
  return h(
    "button",
    { type: s.buttonType, class: cls },
    iconTextNodes(iconMarkup, s.iconPosition, s.text, cls),
  );
}

function buttonSections(s: ButtonState, update: Updater<ButtonState>): PanelSection[] {
  return standardStyleSections(s, update, {
    contentExtra: (
      <SelectField
        s={s}
        update={update}
        k="buttonType"
        label={i18n.t("el.f.typeAttr")}
        options={[
          { value: "button", label: i18n.t("el.f.btnTypeButton") },
          { value: "submit", label: i18n.t("el.f.btnTypeSubmit") },
          { value: "reset", label: i18n.t("el.f.btnTypeReset") },
        ]}
      />
    ),
  });
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const buttonElement = defineElement<ButtonState>({
  type: "button",
  label: "Button",
  group: "Elemen",
  componentName: "Button",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls, icons) => {
    const icon = icons(s.iconId, s.iconSize, s.iconColorMode);
    return { css: generateCss(s, cls, !!icon), markup: buildMarkup(s, cls, icon) };
  },
  sections: buttonSections,
});
