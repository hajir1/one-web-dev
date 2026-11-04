import { standardStyleSections, type PanelSection, type Updater } from "../../ui/PanelStyling";
import { defineElement, type Patcher } from "../../helpers/elementDefinition";
import { generateCss, TextTag } from "../../helpers/generatorCss";
import { h, iconTextNodes } from "../../helpers/markup";
import { getTag, tagOptions, TAG_PRESETS, TextState } from "../../helpers/textTags";
import { Field, SelectInput } from "../../helpers/SmallUIHelpers";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* Default state                                                       */
/* ------------------------------------------------------------------ */

const DEFAULT_STATE: TextState = {
  text: "Judul yang Menarik Perhatian",

  widthMode: "auto",
  width: 220,

  paddingLinked: true,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,

  marginLinked: false,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,

  fontFamily: "",
  fontSize: 40,
  fluidType: false,
  fontWeight: 700,
  letterSpacing: 0,
  textColor: "#111827",
  textTransform: "none",
  textAlign: "center",

  bgType: "solid",
  bgColor: "transparent",
  gradientFrom: "#2563eb",
  gradientTo: "#7c3aed",
  gradientAngle: 90,

  borderWidth: 0,
  borderStyle: "none",
  borderColor: "#1e40af",
  borderRadius: 0,
  pill: false,

  shadowEnabled: false,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 14,
  shadowSpread: 0,
  shadowColor: "#2563eb",
  shadowOpacity: 35,

  transitionDuration: 150,
  transitionEasing: "ease",

  hoverEnabled: false,
  hoverBgColor: "#cfd4df",
  hoverTextColor: "#111827",
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
  iconSize: 24,
  iconGap: 10,
  iconColorMode: "currentColor",

  tag: "h1",

  cursor: "auto"
};

const DEFAULT_CLASS_NAME = "custom-text";

function textSections(
  s: TextState,
  update: Updater<TextState>,
  patch: Patcher<TextState>,
): PanelSection[] {
  const tag = getTag(s);

  // Change the tag + apply that tag's font size/weight preset.
  const changeTag = (nextTag: TextTag) => {
    const preset = TAG_PRESETS[nextTag];
    patch({ tag: nextTag, fontSize: preset.fontSize, fontWeight: preset.fontWeight });
  };

  return standardStyleSections(s, update, {
    multiline: true,
    contentExtra: (
      <Field
        label={i18n.t("el.f.htmlTag")}
        hint={i18n.t("el.f.htmlTagHint")}
      >
        <SelectInput value={tag} onChange={changeTag} options={tagOptions()} />
      </Field>
    ),
  });
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const textElement = defineElement<TextState>({
  type: "text",
  label: "Text",
  group: "Elemen",
  componentName: "Text",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls, icons) => {
    const icon = icons(s.iconId, s.iconSize, s.iconColorMode);
    return {
      css: generateCss(s, cls, !!icon),
      markup: h(getTag(s), { class: cls }, iconTextNodes(icon, s.iconPosition, s.text, cls)),
    };
  },
  sections: textSections,
});
