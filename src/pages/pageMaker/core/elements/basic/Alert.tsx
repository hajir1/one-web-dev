import { standardStyleSections, type PanelSection, type Updater } from "../../ui/PanelStyling";
import { defineElement, type ElementSpec, type IconLookup } from "../../helpers/elementDefinition";
import { generateCss, StyleState } from "../../helpers/generatorCss";
import { h, iconTextNodes, raw } from "../../helpers/markup";
import { SelectField, ToggleField } from "../../ui/fields";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State & default                                                     */
/* ------------------------------------------------------------------ */

export interface AlertState extends StyleState {
  /** "alert" = penting & diumumkan segera; "status" = informasi sopan. */
  role: "alert" | "status";
  /** Show the close button (×). */
  dismissible: boolean;
}

const DEFAULT_STATE: AlertState = {
  text: "Perubahan berhasil disimpan.",

  widthMode: "full",
  width: 400,

  paddingLinked: false,
  paddingTop: 14,
  paddingRight: 16,
  paddingBottom: 14,
  paddingLeft: 16,

  marginLinked: false,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,

  fontFamily: "",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0,
  textColor: "#1e3a8a",
  textTransform: "none",
  textAlign: "left",

  bgType: "solid",
  bgColor: "#eff6ff",
  gradientFrom: "#eff6ff",
  gradientTo: "#dbeafe",
  gradientAngle: 90,

  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#bfdbfe",
  borderRadius: 10,
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
  hoverBgColor: "#dbeafe",
  hoverTextColor: "#1e3a8a",
  hoverBorderColor: "#93c5fd",
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
  iconSize: 20,
  iconGap: 10,
  iconColorMode: "currentColor",

  role: "alert",
  dismissible: false,

  cursor: "default"
};

const DEFAULT_CLASS_NAME = "custom-alert";

const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

function alertCss(s: AlertState, cls: string, hasIcon: boolean) {
  // Alerts are always block-level; they become flex when there is an icon/close button so everything lines up.
  const flex = hasIcon || s.dismissible;
  let css = generateCss(s, cls, hasIcon, flex).replace(
    flex ? "display: inline-flex;" : "display: inline-block;",
    flex ? "display: flex;" : "display: block;",
  );
  if (s.dismissible) {
    css += `
.${cls}__text {
  flex: 1;
}

.${cls}__close {
  display: inline-flex;
  margin-left: auto;
  padding: 2px;
  border: 0;
  background: transparent;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  border-radius: 4px;
}

.${cls}__close:hover {
  opacity: 1;
}
`;
  }
  return css;
}

function buildMarkup(s: AlertState, cls: string, iconMarkup: string | null) {
  const content = s.dismissible
    ? [
        ...(iconMarkup
          ? iconTextNodes(iconMarkup, "left", s.text, cls)
          : [h("span", { class: `${cls}__text` }, s.text)]),
        h(
          "button",
          {
            type: "button",
            class: `${cls}__close`,
            "aria-label": "Tutup",
            // Logika tutup per framework
            "react:onClick": { expr: "() => setOpen(false)" },
            "vue:@click": { expr: "open = false" },
            "svelte:on:click": { expr: "() => (open = false)" },
            "angular:(click)": { expr: "open = false" },
          },
          raw(CLOSE_SVG),
        ),
      ]
    : iconTextNodes(iconMarkup, s.iconPosition, s.text, cls);
  return h(
    "div",
    { class: cls, role: s.role, "vue:v-if": s.dismissible ? { expr: "open" } : undefined },
    content,
  );
}

function alertSections(s: AlertState, update: Updater<AlertState>): PanelSection[] {
  return standardStyleSections(s, update, {
    multiline: true,
    contentExtra: (
      <>
        <SelectField
          s={s}
          update={update}
          k="role"
          label={i18n.t("el.f.roleA11y")}
          hint={i18n.t("el.f.roleHint")}
          options={[
            { value: "alert", label: 'role="alert"' },
            { value: "status", label: 'role="status"' },
          ]}
        />
        <ToggleField s={s} update={update} k="dismissible" label={i18n.t("el.f.showCloseButton")} />
      </>
    ),
    omit: ["cursor"],
  });
}

function alertSpec(s: AlertState, cls: string, icons: IconLookup): ElementSpec {
  const icon = icons(s.iconId, s.iconSize, s.iconColorMode);
  return {
    css: alertCss(s, cls, !!icon),
    markup: buildMarkup(s, cls, icon),
    ...(s.dismissible && {
      html: {
        script: `document.querySelectorAll(".${cls}__close").forEach((btn) => {
  btn.addEventListener("click", () => btn.closest(".${cls}").remove());
});`,
      },
      react: {
        imports: `import { useState } from "react";`,
        pre: `const [open, setOpen] = useState(true);\nif (!open) return null;`,
      },
      vue: { script: `import { ref } from "vue";\n\nconst open = ref(true);` },
      svelte: { script: "let open = true;" },
      angular: { classBody: "open = true;" },
      wrap: {
        svelte: (m) => `{#if open}\n${m}\n{/if}`,
        angular: (m) => `@if (open) {\n${m}\n}`,
      },
    }),
  };
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const alertElement = defineElement<AlertState>({
  type: "alert",
  label: "Alert",
  group: "Elemen",
  componentName: "Alert",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: alertSpec,
  sections: alertSections,
});
