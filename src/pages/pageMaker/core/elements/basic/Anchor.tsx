import { standardStyleSections, type PanelSection, type Updater } from "../../ui/PanelStyling";
import { defineElement } from "../../helpers/elementDefinition";
import { generateCss, safeUrl, StyleState } from "../../helpers/generatorCss";
import { h, iconTextNodes } from "../../helpers/markup";
import { SelectField, TextField } from "../../ui/fields";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State & default                                                     */
/* ------------------------------------------------------------------ */

export interface AnchorState extends StyleState {
  href: string;
  target: "" | "_self" | "_blank" | "_parent" | "_top";
  underline: "none" | "always" | "hover";
}

const DEFAULT_STATE: AnchorState = {
  text: "Link yang Menarik Perhatian",
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
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: 0,
  textColor: "#111827",
  textTransform: "none",
  textAlign: "left",
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
  cursor: "pointer",
  href: "#",
  target: "",
  underline: "hover",
};

const DEFAULT_CLASS_NAME = "custom-anchor";

function anchorCss(s: AnchorState, cls: string, hasIcon: boolean) {
  let css = generateCss(s, cls, hasIcon);
  if (s.underline === "always") {
    css = css.replace("text-decoration: none;", "text-decoration: underline;");
  } else if (s.underline === "hover") {
    css += `
.${cls}:hover {
  text-decoration: underline;
}
`;
  }
  return css;
}

function buildMarkup(s: AnchorState, cls: string, iconMarkup: string | null) {
  return h(
    "a",
    {
      href: safeUrl(s.href),
      target: s.target || undefined,
      // Wajib untuk target="_blank": cegah tab baru mengakses window.opener.
      rel: s.target === "_blank" ? "noopener noreferrer" : undefined,
      class: cls,
    },
    iconTextNodes(iconMarkup, s.iconPosition, s.text, cls),
  );
}

function anchorSections(s: AnchorState, update: Updater<AnchorState>): PanelSection[] {
  return standardStyleSections(s, update, {
    contentExtra: (
      <>
        <TextField
          s={s}
          update={update}
          k="href"
          label={i18n.t("el.f.hrefLabel")}
          placeholder="https://example.com"
          hint={safeUrl(s.href) !== s.href.trim() && s.href.trim() ? i18n.t("el.f.hrefHint") : undefined}
        />
        <SelectField
          s={s}
          update={update}
          k="target"
          label={i18n.t("el.f.target")}
          options={[
            { value: "", label: i18n.t("el.f.targetDefault") },
            { value: "_blank", label: i18n.t("el.f.targetBlank") },
            { value: "_self", label: "_self" },
            { value: "_parent", label: "_parent" },
            { value: "_top", label: "_top" },
          ]}
        />
        <SelectField
          s={s}
          update={update}
          k="underline"
          label={i18n.t("el.f.underline")}
          options={[
            { value: "none", label: i18n.t("el.f.never") },
            { value: "hover", label: i18n.t("el.f.onHover") },
            { value: "always", label: i18n.t("el.f.always") },
          ]}
        />
      </>
    ),
  });
}



/* ------------------------------------------------------------------ */
/* Definisi — dipakai halaman ini dan Component Maker                  */
/* ------------------------------------------------------------------ */

export const anchorElement = defineElement<AnchorState>({
  type: "anchor",
  label: "Anchor / Link",
  group: "Elemen",
  componentName: "Anchor",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls, icons) => {
    const icon = icons(s.iconId, s.iconSize, s.iconColorMode);
    return { css: anchorCss(s, cls, !!icon), markup: buildMarkup(s, cls, icon) };
  },
  sections: anchorSections,
});
