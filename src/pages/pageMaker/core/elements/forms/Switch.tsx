import { hexToRgba, shadowValue } from "../../helpers/generatorCss";
import { h } from "../../helpers/markup";
import { BorderSection, FocusRingSection, HoverSection, SECTION_ICONS, ShadowSection, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import { Group, Row } from "../../helpers/SmallUIHelpers";
import {
  ColorField,
  NumberField,
  SegmentedField,
  TextField,
  ToggleField,
  type Updater,
} from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

export interface SwitchState {
  labelText: string;
  labelPosition: "left" | "right";
  defaultChecked: boolean;
  name: string;
  gap: number;

  fontSize: number;
  fontWeight: number;
  textColor: string;

  /* Track */
  trackWidth: number;
  trackHeight: number;
  thumbInset: number;
  offTrackColor: string;
  onTrackColor: string;
  thumbColor: string;

  /* Border track */
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  pill: boolean;

  /* Shadow thumb */
  thumbShadowEnabled: boolean;
  thumbShadowX: number;
  thumbShadowY: number;
  thumbShadowBlur: number;
  thumbShadowSpread: number;
  thumbShadowColor: string;
  thumbShadowOpacity: number;

  /* Hover */
  hoverEnabled: boolean;
  hoverOffTrackColor: string;
  hoverOnTrackColor: string;

  /* Fokus */
  focusRingEnabled: boolean;
  focusRingColor: string;
  focusRingWidth: number;
  focusRingOpacity: number;

  transitionDuration: number;
  transitionEasing: string;
}

const DEFAULT_STATE: SwitchState = {
  labelText: "Notifikasi email",
  labelPosition: "right",
  defaultChecked: true,
  name: "",
  gap: 10,

  fontSize: 14,
  fontWeight: 500,
  textColor: "#374151",

  trackWidth: 44,
  trackHeight: 24,
  thumbInset: 3,
  offTrackColor: "#d1d5db",
  onTrackColor: "#012060",
  thumbColor: "#ffffff",

  borderWidth: 0,
  borderColor: "#9ca3af",
  borderRadius: 6,
  pill: true,

  thumbShadowEnabled: true,
  thumbShadowX: 0,
  thumbShadowY: 1,
  thumbShadowBlur: 3,
  thumbShadowSpread: 0,
  thumbShadowColor: "#000000",
  thumbShadowOpacity: 25,

  hoverEnabled: true,
  hoverOffTrackColor: "#9ca3af",
  hoverOnTrackColor: "#1e3a8a",

  focusRingEnabled: true,
  focusRingColor: "#2563eb",
  focusRingWidth: 3,
  focusRingOpacity: 35,

  transitionDuration: 200,
  transitionEasing: "ease",
};

const DEFAULT_CLASS_NAME = "custom-switch";

/* ------------------------------------------------------------------ */
/* CSS & markup                                                        */
/* ------------------------------------------------------------------ */

/** Ukuran thumb & jarak gesernya dihitung dari ukuran track. */
function switchGeometry(s: SwitchState) {
  const innerH = s.trackHeight - 2 * s.borderWidth;
  const innerW = s.trackWidth - 2 * s.borderWidth;
  const thumb = Math.max(innerH - 2 * s.thumbInset, 4);
  const travel = Math.max(innerW - 2 * s.thumbInset - thumb, 0);
  return { thumb, travel };
}

function generateSwitchCss(s: SwitchState, cls: string): string {
  const { thumb, travel } = switchGeometry(s);
  const t = `${s.transitionDuration}ms ${s.transitionEasing}`;
  const trackRadius = s.pill ? "9999px" : `${s.borderRadius}px`;
  const thumbRadius = s.pill ? "50%" : `${Math.max(s.borderRadius - s.thumbInset, 0)}px`;
  const thumbShadow = shadowValue(s, "thumbShadow");
  const rules: string[] = [];

  rules.push(`.${cls} {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${s.gap}px;
  flex-direction: ${s.labelPosition === "left" ? "row-reverse" : "row"};
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  color: ${s.textColor};
  cursor: pointer;
  user-select: none;
}`);

  rules.push(`.${cls}__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
}`);

  rules.push(`.${cls}__track {
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: ${s.trackWidth}px;
  height: ${s.trackHeight}px;
  background: ${s.offTrackColor};
  border: ${s.borderWidth}px solid ${s.borderColor};
  border-radius: ${trackRadius};
  transition: background-color ${t}, border-color ${t}, box-shadow ${t};
}`);

  rules.push(`.${cls}__thumb {
  position: absolute;
  top: ${s.thumbInset}px;
  left: ${s.thumbInset}px;
  width: ${thumb}px;
  height: ${thumb}px;
  border-radius: ${thumbRadius};
  background: ${s.thumbColor};
${thumbShadow ? `  box-shadow: ${thumbShadow};\n` : ""}  transition: transform ${t};
}`);

  if (s.hoverEnabled) {
    rules.push(`.${cls}:hover .${cls}__input:not(:checked) + .${cls}__track {
  background: ${s.hoverOffTrackColor};
}

.${cls}:hover .${cls}__input:checked + .${cls}__track {
  background: ${s.hoverOnTrackColor};
}`);
  }

  rules.push(`.${cls}__input:checked + .${cls}__track {
  background: ${s.onTrackColor};
  border-color: ${s.onTrackColor};
}`);

  rules.push(`.${cls}__input:checked + .${cls}__track .${cls}__thumb {
  transform: translateX(${travel}px);
}`);

  rules.push(
    s.focusRingEnabled
      ? `.${cls}__input:focus-visible + .${cls}__track {
  box-shadow: 0 0 0 ${s.focusRingWidth}px ${hexToRgba(s.focusRingColor, s.focusRingOpacity)};
}`
      : `.${cls}__input:focus-visible + .${cls}__track {
  outline: 2px solid ${s.onTrackColor};
  outline-offset: 2px;
}`,
  );

  rules.push(`@media (prefers-reduced-motion: reduce) {
  .${cls}__track,
  .${cls}__thumb {
    transition: none;
  }
}`);

  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: SwitchState, cls: string) {
  return h(
    "label",
    { class: cls },
    h("input", {
      type: "checkbox",
      role: "switch",
      class: `${cls}__input`,
      name: s.name.trim() || undefined,
      checked: s.defaultChecked,
    }),
    h("span", { class: `${cls}__track`, "aria-hidden": "true" }, h("span", { class: `${cls}__thumb` })),
    h("span", { class: `${cls}__label` }, s.labelText),
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function switchSections(s: SwitchState, update: Updater<SwitchState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "content",
      label: i18n.t("el.f.content"),
      icon: SECTION_ICONS.content,
      content: (
        <>
          <TextField {...p} k="labelText" label={i18n.t("el.f.labelText")} />
          <SegmentedField
            {...p}
            k="labelPosition"
            label={i18n.t("el.f.labelPosition")}
            options={[
              { value: "left", label: i18n.t("el.f.left") },
              { value: "right", label: i18n.t("el.f.right") },
            ]}
          />
          <TextField {...p} k="name" label={i18n.t("el.f.nameAttrOptional")} placeholder={i18n.t("el.f.namePlaceholderNotif")} />
          <ToggleField {...p} k="defaultChecked" label={i18n.t("el.f.onByDefault")} />
        </>
      ),
    },
    {
      id: "typography",
      label: i18n.t("el.f.typography"),
      icon: SECTION_ICONS.typography,
      content: (
        <>
          <TypographySection {...p} />
          <NumberField {...p} k="gap" label={i18n.t("el.f.labelSwitchGap")} min={0} />
        </>
      ),
    },
    {
      id: "sizing",
      label: i18n.t("el.f.size"),
      icon: SECTION_ICONS.sizing,
      content: (
        <>
          <Row>
            <NumberField {...p} k="trackWidth" label={i18n.t("el.f.trackWidth")} min={16} />
            <NumberField {...p} k="trackHeight" label={i18n.t("el.f.trackHeight")} min={8} />
          </Row>
          <NumberField
            {...p}
            k="thumbInset"
            label={i18n.t("el.f.thumbInset")}
            min={0}
            hint={i18n.t("el.f.thumbHint")}
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
          <Row>
            <ColorField {...p} k="offTrackColor" label={i18n.t("el.f.trackOff")} />
            <ColorField {...p} k="onTrackColor" label={i18n.t("el.f.trackOn")} />
          </Row>
          <ColorField {...p} k="thumbColor" label={i18n.t("el.f.thumb")} />
        </>
      ),
    },
    { id: "border", label: i18n.t("el.f.trackBorder"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    {
      id: "shadow",
      label: i18n.t("el.f.thumbShadow"),
      icon: SECTION_ICONS.shadow,
      content: <ShadowSection {...p} prefix="thumbShadow" toggleLabel={i18n.t("el.f.thumbShadowToggle")} />,
    },
    {
      id: "hover",
      label: i18n.t("el.f.hoverTransition"),
      icon: SECTION_ICONS.hover,
      content: (
        <HoverSection {...p}>
          <Group>
            <Row>
              <ColorField {...p} k="hoverOffTrackColor" label={i18n.t("el.f.trackOffHover")} />
              <ColorField {...p} k="hoverOnTrackColor" label={i18n.t("el.f.trackOnHover")} />
            </Row>
          </Group>
        </HoverSection>
      ),
    },
    { id: "focus", label: i18n.t("el.f.focus"), icon: SECTION_ICONS.focus, content: <FocusRingSection {...p} /> },
  ];
}



/* ------------------------------------------------------------------ */
/* Definisi — dipakai halaman ini dan Component Maker                  */
/* ------------------------------------------------------------------ */

export const switchElement = defineElement<SwitchState>({
  type: "switch",
  label: "Toggle Switch",
  group: "Form",
  componentName: "ToggleSwitch",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls) => ({ css: generateSwitchCss(s, cls), markup: buildMarkup(s, cls) }),
  sections: switchSections,
});
