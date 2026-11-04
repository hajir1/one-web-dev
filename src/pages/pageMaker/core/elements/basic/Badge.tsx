import { generateCss, StyleState } from "../../helpers/generatorCss";
import { h, iconTextNodes } from "../../helpers/markup";
import { SECTION_ICONS, standardStyleSections, type PanelSection, type Updater } from "../../ui/PanelStyling";
import { Field, Group } from "../../helpers/SmallUIHelpers";
import { ColorField, NumberField, Show, ToggleField } from "../../ui/fields";
import { defineElement, type Patcher } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State & default                                                     */
/* ------------------------------------------------------------------ */

export interface BadgeState extends StyleState {
  /** Status dot before the text (e.g. "● Online"). */
  dotEnabled: boolean;
  dotColor: string;
  dotSize: number;
  dotPulse: boolean;
}

const DEFAULT_STATE: BadgeState = {
  text: "Baru",

  widthMode: "auto",
  width: 120,

  paddingLinked: false,
  paddingTop: 3,
  paddingRight: 10,
  paddingBottom: 3,
  paddingLeft: 10,

  marginLinked: true,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,

  fontFamily: "",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0,
  textColor: "#1d4ed8",
  textTransform: "none",
  textAlign: "center",

  bgType: "solid",
  bgColor: "#eff6ff",
  gradientFrom: "#2563eb",
  gradientTo: "#7c3aed",
  gradientAngle: 90,

  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#bfdbfe",
  borderRadius: 999,
  pill: true,

  shadowEnabled: false,
  shadowX: 0,
  shadowY: 1,
  shadowBlur: 2,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 10,

  transitionDuration: 150,
  transitionEasing: "ease",

  hoverEnabled: false,
  hoverBgColor: "#dbeafe",
  hoverTextColor: "#1e40af",
  hoverBorderColor: "#93c5fd",
  hoverTransform: "none",
  hoverShadowEnabled: false,
  hoverShadowX: 0,
  hoverShadowY: 4,
  hoverShadowBlur: 10,
  hoverShadowSpread: 0,
  hoverShadowColor: "#2563eb",
  hoverShadowOpacity: 25,

  iconId: null,
  iconPosition: "left",
  iconSize: 14,
  iconGap: 6,
  iconColorMode: "currentColor",

  cursor: "default",

  dotEnabled: false,
  dotColor: "#22c55e",
  dotSize: 8,
  dotPulse: false,
};

const DEFAULT_CLASS_NAME = "custom-badge";

/* ------------------------------------------------------------------ */
/* Color presets: one click sets the bg, text, border, & hover color    */
/* ------------------------------------------------------------------ */

type Tone = "blue" | "green" | "amber" | "red" | "gray" | "violet";
type Variant = "soft" | "solid" | "outline";

const TONES: Record<Tone, { label: string; c50: string; c200: string; c600: string; c700: string }> = {
  blue: { label: "el.f.toneBlue", c50: "#eff6ff", c200: "#bfdbfe", c600: "#2563eb", c700: "#1d4ed8" },
  green: { label: "el.f.toneGreen", c50: "#f0fdf4", c200: "#bbf7d0", c600: "#16a34a", c700: "#15803d" },
  amber: { label: "el.f.toneAmber", c50: "#fffbeb", c200: "#fde68a", c600: "#d97706", c700: "#b45309" },
  red: { label: "el.f.toneRed", c50: "#fef2f2", c200: "#fecaca", c600: "#dc2626", c700: "#b91c1c" },
  gray: { label: "el.f.toneGray", c50: "#f9fafb", c200: "#e5e7eb", c600: "#4b5563", c700: "#374151" },
  violet: { label: "el.f.toneViolet", c50: "#f5f3ff", c200: "#ddd6fe", c600: "#7c3aed", c700: "#6d28d9" },
};

function presetPatch(tone: Tone, variant: Variant): Partial<BadgeState> {
  const t = TONES[tone];
  const base = { bgType: "solid" as const, borderStyle: "solid" as const, borderWidth: 1 };
  if (variant === "solid")
    return { ...base, bgColor: t.c600, textColor: "#ffffff", borderColor: t.c600, hoverBgColor: t.c700, hoverTextColor: "#ffffff", hoverBorderColor: t.c700 };
  if (variant === "outline")
    return { ...base, bgColor: "transparent", textColor: t.c700, borderColor: t.c600, hoverBgColor: t.c50, hoverTextColor: t.c700, hoverBorderColor: t.c600 };
  return { ...base, bgColor: t.c50, textColor: t.c700, borderColor: t.c200, hoverBgColor: t.c200, hoverTextColor: t.c700, hoverBorderColor: t.c200 };
}

/* ------------------------------------------------------------------ */
/* CSS & markup                                                        */
/* ------------------------------------------------------------------ */

function badgeCss(s: BadgeState, cls: string, hasIcon: boolean): string {
  // Badges with a status dot are always flex so the dot & text line up.
  let css = generateCss(s, cls, hasIcon, hasIcon || s.dotEnabled);
  if (s.dotEnabled) {
    if (!hasIcon) css = css.replace(/gap: \d+px;/, `gap: ${s.iconGap}px;`);
    css += `
.${cls}__dot {
  width: ${s.dotSize}px;
  height: ${s.dotSize}px;
  flex-shrink: 0;
  border-radius: 9999px;
  background: ${s.dotColor};
}
`;
    if (s.dotPulse) {
      css += `
.${cls}__dot {
  animation: ${cls}-pulse 1.6s ease-out infinite;
}

@keyframes ${cls}-pulse {
  0% { box-shadow: 0 0 0 0 ${s.dotColor}; }
  70% { box-shadow: 0 0 0 ${Math.max(4, Math.round(s.dotSize / 1.5))}px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .${cls}__dot {
    animation: none;
  }
}
`;
    }
  }
  return css;
}

function buildMarkup(s: BadgeState, cls: string, iconMarkup: string | null) {
  return h(
    "span",
    { class: cls },
    s.dotEnabled ? h("span", { class: `${cls}__dot`, "aria-hidden": "true" }) : null,
    iconTextNodes(iconMarkup, s.iconPosition, s.text, cls),
  );
}

function badgeSections(
  s: BadgeState,
  update: Updater<BadgeState>,
  patch: Patcher<BadgeState>,
): PanelSection[] {
  const applyPreset = (tone: Tone, variant: Variant) => patch(presetPatch(tone, variant));

  return standardStyleSections(s, update, {
    extra: [
      {
        id: "preset",
        label: i18n.t("el.f.colorPreset"),
        icon: SECTION_ICONS.background,
        after: "content",
        content: (
          <>
            {(["soft", "solid", "outline"] as Variant[]).map((variant) => (
              <Field key={variant} label={i18n.t(variant === "soft" ? "el.f.variantSoft" : variant === "solid" ? "el.f.variantSolid" : "el.f.variantOutline")}>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(TONES) as Tone[]).map((tone) => {
                    const p = presetPatch(tone, variant);
                    return (
                      <button
                        key={tone}
                        type="button"
                        title={`${i18n.t(TONES[tone].label)} — ${variant}`}
                        onClick={() => applyPreset(tone, variant)}
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold border hover:scale-105 transition-transform"
                        style={{ background: p.bgColor, color: p.textColor, borderColor: p.borderColor }}
                      >
                        {i18n.t(TONES[tone].label)}
                      </button>
                    );
                  })}
                </div>
              </Field>
            ))}
          </>
        ),
      },
      {
        id: "dot",
        label: i18n.t("el.f.statusDot"),
        icon: SECTION_ICONS.number,
        after: "icon",
        content: (
          <>
            <ToggleField s={s} update={update} k="dotEnabled" label={i18n.t("el.f.showStatusDot")} />
            <Show when={s.dotEnabled}>
              <ColorField s={s} update={update} k="dotColor" label={i18n.t("el.f.dotColor")} />
              <NumberField s={s} update={update} k="dotSize" label={i18n.t("el.f.dotSize")} min={2} />
              <Group>
                <ToggleField s={s} update={update} k="dotPulse" label={i18n.t("el.f.pulseAnimation")} />
              </Group>
            </Show>
          </>
        ),
      },
    ],
  });
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const badgeElement = defineElement<BadgeState>({
  type: "badge",
  label: "Badge",
  group: "Elemen",
  componentName: "Badge",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls, icons) => {
    const icon = icons(s.iconId, s.iconSize, s.iconColorMode);
    return { css: badgeCss(s, cls, !!icon), markup: buildMarkup(s, cls, icon) };
  },
  sections: badgeSections,
});
