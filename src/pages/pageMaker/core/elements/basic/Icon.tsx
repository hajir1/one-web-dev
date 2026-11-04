import type { BgType } from "../../helpers/generatorCss";
import {
  backgroundCss,
  borderRadiusCss,
  paddingCss,
  shadowLine,
  transformCss,
} from "../../helpers/generatorCss";
import { h, raw } from "../../helpers/markup";
import { BackgroundSection, BorderSection, CursorSection, HoverSection, IconSection, SECTION_ICONS, ShadowSection, SpacingSection, type PanelSection } from "../../ui/PanelStyling";
import {
  ColorField,
  NumberField,
  SelectField,
  Show,
  TextField,
  type Updater,
} from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { renderIconMarkup } from "../../store/iconStore";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* IconState                                                           */
/* ------------------------------------------------------------------ */

export interface IconMakerState {
  iconId: string | null;

  size: number;
  iconColorMode: "currentColor" | "original";
  iconColor: string; // Used if currentColor

  /* Container / Background */
  paddingLinked: boolean;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  bgType: BgType;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;

  borderWidth: number;
  borderStyle: "none" | "solid" | "dashed" | "dotted";
  borderColor: string;
  borderRadius: number;
  pill: boolean;

  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  shadowOpacity: number;

  /* Built-in animations */
  animation: "none" | "spin" | "pulse" | "bounce" | "wiggle";
  animationDuration: number;

  /* Hover */
  hoverEnabled: boolean;
  hoverIconColor: string;
  hoverBgColor: string;
  hoverBorderColor: string;
  hoverTransform: "none" | "lift" | "scale" | "lift-scale";
  hoverShadowEnabled: boolean;
  hoverShadowX: number;
  hoverShadowY: number;
  hoverShadowBlur: number;
  hoverShadowSpread: number;
  hoverShadowColor: string;
  hoverShadowOpacity: number;
  transitionDuration: number;
  transitionEasing: string;

  cursor: string;
  /** Alternative text. Empty = decorative icon (aria-hidden). */
  ariaLabel: string;
}

const DEFAULT_STATE: IconMakerState = {
  iconId: null,
  size: 48,
  iconColorMode: "currentColor",
  iconColor: "#3b82f6",

  paddingLinked: true,
  paddingTop: 16,
  paddingRight: 16,
  paddingBottom: 16,
  paddingLeft: 16,

  bgType: "solid",
  bgColor: "#eff6ff",
  gradientFrom: "#1e3a8a",
  gradientTo: "#3b82f6",
  gradientAngle: 135,

  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#bfdbfe",
  borderRadius: 16,
  pill: false,

  shadowEnabled: false,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 10,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 10,

  animation: "none",
  animationDuration: 2000,

  hoverEnabled: true,
  hoverIconColor: "#ffffff",
  hoverBgColor: "#3b82f6",
  hoverBorderColor: "#2563eb",
  hoverTransform: "scale",
  hoverShadowEnabled: true,
  hoverShadowX: 0,
  hoverShadowY: 8,
  hoverShadowBlur: 20,
  hoverShadowSpread: 0,
  hoverShadowColor: "#3b82f6",
  hoverShadowOpacity: 30,
  transitionDuration: 300,
  transitionEasing: "ease",

  cursor: "pointer",
  ariaLabel: "",
};

const DEFAULT_CLASS_NAME = "custom-icon";

/** Sample icon when no icon is selected yet / the library is empty. */
const DUMMY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m7 19 5 3 5-3"/></svg>`;

/* ------------------------------------------------------------------ */
/* CSS generator khusus Icon                                           */
/* ------------------------------------------------------------------ */

const KEYFRAMES: Record<Exclude<IconMakerState["animation"], "none">, string> = {
  spin: "from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }",
  pulse: "0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.1); }",
  bounce: "0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-25%); }",
  wiggle:
    "0%, 100% { transform: rotate(0deg); }\n  25% { transform: rotate(-10deg); }\n  75% { transform: rotate(10deg); }",
};

function generateIconMakerCss(s: IconMakerState, cls: string): string {
  // Nama keyframes diberi awalan class: sebelumnya "spin"/"pulse"/"bounce"
  // clashes with Tailwind's built-in keyframes, so the preview animation was wrong.
  const animName = `${cls}-${s.animation}`;
  const animLine =
    s.animation !== "none"
      ? `  animation: ${animName} ${s.animationDuration}ms ${s.animation === "spin" ? "linear" : "ease-in-out"} infinite;\n`
      : "";

  const base = `.${cls} {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${paddingCss(s)};
  background: ${backgroundCss(s)};
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  border-radius: ${borderRadiusCss(s)};
  color: ${s.iconColor};
  cursor: ${s.cursor};
${shadowLine(s)}  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}`;

  const svgInner = `.${cls} svg {
  display: block;
${animLine}}`;

  // Hover uses the hover color (previously a gradient background ignored the hover color).
  const hover = s.hoverEnabled
    ? `.${cls}:hover {
  background: ${s.hoverBgColor};
  border-color: ${s.hoverBorderColor};
  color: ${s.hoverIconColor};
  transform: ${transformCss(s.hoverTransform)};
${shadowLine(s, "hoverShadow")}}`
    : "";

  const keyframes =
    s.animation !== "none"
      ? `@keyframes ${animName} {\n  ${KEYFRAMES[s.animation]}\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .${cls} svg {\n    animation: none;\n  }\n}`
      : "";

  return [base, svgInner, hover, keyframes].filter(Boolean).join("\n\n") + "\n";
}

function buildMarkup(s: IconMakerState, cls: string, svgMarkup: string) {
  const label = s.ariaLabel.trim();
  return h(
    "span",
    label ? { class: cls, role: "img", "aria-label": label } : { class: cls, "aria-hidden": "true" },
    raw(svgMarkup),
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function iconSections(s: IconMakerState, update: Updater<IconMakerState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "icon",
      label: i18n.t("el.f.icon"),
      icon: SECTION_ICONS.icon,
      content: (
        <>
          <IconSection {...p} withPosition={false} />
          <NumberField {...p} k="size" label={i18n.t("el.f.iconSize")} min={4} />
          <Show when={s.iconColorMode === "currentColor"}>
            <ColorField {...p} k="iconColor" label={i18n.t("el.f.iconColor")} />
          </Show>
          <TextField
            {...p}
            k="ariaLabel"
            label={i18n.t("el.f.a11yLabelOptional")}
            placeholder={i18n.t("el.f.a11yLabelPlaceholder")}
            hint={i18n.t("el.f.a11yLabelHint")}
          />
        </>
      ),
    },
    { id: "spacing", label: i18n.t("el.f.spacing"), icon: SECTION_ICONS.spacing, content: <SpacingSection {...p} /> },
    { id: "background", label: i18n.t("el.f.background"), icon: SECTION_ICONS.background, content: <BackgroundSection {...p} /> },
    { id: "border", label: i18n.t("el.f.border"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    {
      id: "animation",
      label: i18n.t("el.f.animation"),
      icon: SECTION_ICONS.animation,
      content: (
        <>
          <SelectField
            {...p}
            k="animation"
            label={i18n.t("el.f.animationType")}
            options={[
              { value: "none", label: i18n.t("el.f.none") },
              { value: "spin", label: i18n.t("el.f.animSpin") },
              { value: "pulse", label: i18n.t("el.f.animPulse") },
              { value: "bounce", label: i18n.t("el.f.animBounce") },
              { value: "wiggle", label: i18n.t("el.f.animWiggle") },
            ]}
          />
          <Show when={s.animation !== "none"}>
            <NumberField {...p} k="animationDuration" label={i18n.t("el.f.cycleDuration")} min={100} suffix="ms" />
          </Show>
        </>
      ),
    },
    { id: "cursor", label: i18n.t("el.f.cursor"), icon: SECTION_ICONS.cursor, content: <CursorSection {...p} /> },
    {
      id: "hover",
      label: i18n.t("el.f.hover"),
      icon: SECTION_ICONS.hover,
      content: (
        <HoverSection {...p}>
          <ColorField {...p} k="hoverIconColor" label={i18n.t("el.f.iconHoverColor")} />
        </HoverSection>
      ),
    },
  ];
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const iconElement = defineElement<IconMakerState>({
  type: "icon",
  label: "Icon",
  group: "Elemen",
  componentName: "IconMaker",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls, icons) => {
    // No icon selected → use the sample icon so the element is not empty.
    const svg =
      icons(s.iconId, s.size, s.iconColorMode) ??
      renderIconMarkup(DUMMY_SVG, s.size, s.iconColorMode);
    return { css: generateIconMakerCss(s, cls), markup: buildMarkup(s, cls, svg) };
  },
  sections: iconSections,
});
