import type { BgType } from "../../helpers/generatorCss";
import {
  backgroundCss,
  borderRadiusCss,
  paddingCss,
  shadowLine,
  widthCss,
} from "../../helpers/generatorCss";
import { h } from "../../helpers/markup";
import { BackgroundSection, BorderSection, SECTION_ICONS, ShadowSection, SizingSection, SpacingSection, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import { Group, Row } from "../../helpers/SmallUIHelpers";
import {
  ColorField,
  LinesField,
  NumberField,
  SelectField,
  Show,
  ToggleField,
  type Updater,
} from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* ListState                                                           */
/* ------------------------------------------------------------------ */

export interface ListState {
  /* Container Style (BoxStyle-like) */
  widthMode: "auto" | "fixed" | "full";
  width: number;
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

  /* List Specific */
  listType: "ul" | "ol";
  listStyleType:
    | "disc"
    | "circle"
    | "square"
    | "decimal"
    | "lower-alpha"
    | "upper-alpha"
    | "lower-roman"
    | "upper-roman"
    | "none"
    | "custom-icon";
  markerColor: string;

  /* Item Typography & Spacing */
  fontSize: number;
  fontWeight: number;
  textColor: string;
  itemSpacing: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemBorderRadius: number;

  /* Hover & Interaction */
  itemHoverEnabled: boolean;
  itemHoverBgColor: string;
  itemHoverTextColor: string;

  /* Dividers */
  dividerEnabled: boolean;
  dividerColor: string;
  dividerWidth: number;

  /* Data */
  items: string[];
  transitionDuration: number;
}

const DEFAULT_STATE: ListState = {
  widthMode: "full",
  width: 400,
  paddingLinked: false,
  paddingTop: 12,
  paddingRight: 16,
  paddingBottom: 12,
  paddingLeft: 16,
  bgType: "solid",
  bgColor: "#ffffff",
  gradientFrom: "#1e3a8a",
  gradientTo: "#3b82f6",
  gradientAngle: 135,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#e5e7eb",
  borderRadius: 8,
  pill: false,
  shadowEnabled: true,
  shadowX: 0,
  shadowY: 1,
  shadowBlur: 3,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 10,

  listType: "ul",
  listStyleType: "disc",
  markerColor: "#3b82f6",

  fontSize: 14,
  fontWeight: 400,
  textColor: "#374151",
  itemSpacing: 4,
  itemPaddingX: 8,
  itemPaddingY: 8,
  itemBorderRadius: 6,

  itemHoverEnabled: true,
  itemHoverBgColor: "#f3f4f6",
  itemHoverTextColor: "#111827",

  dividerEnabled: true,
  dividerColor: "#f3f4f6",
  dividerWidth: 1,

  transitionDuration: 200,
  items: [
    "Fitur pertama yang sangat menarik",
    "Fitur kedua dengan performa tinggi",
    "Fitur ketiga yang mudah digunakan",
    "Fitur keempat untuk produktivitas",
  ],
};

const DEFAULT_CLASS_NAME = "custom-list";

const BULLETS = ["disc", "circle", "square"];

/* ------------------------------------------------------------------ */
/* CSS generator khusus List                                           */
/* ------------------------------------------------------------------ */

function generateListCss(s: ListState, cls: string): string {
  const isCustom = s.listStyleType === "custom-icon";
  const rules: string[] = [];

  rules.push(`.${cls} {
  box-sizing: border-box;
${widthCss(s) || "  display: inline-block;\n"}  margin: 0;
  padding: ${paddingCss(s)};
  background: ${backgroundCss(s)};
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  border-radius: ${borderRadiusCss(s)};
${shadowLine(s)}  list-style-position: inside;
  list-style-type: ${isCustom ? "none" : s.listStyleType};
}`);

  rules.push(`.${cls} li {
  display: ${isCustom ? "flex" : "list-item"};${isCustom ? "\n  align-items: baseline;\n  gap: 8px;" : ""}
  margin-bottom: ${s.itemSpacing}px;
  padding: ${s.itemPaddingY}px ${s.itemPaddingX}px;
  border-radius: ${s.itemBorderRadius}px;
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  color: ${s.textColor};
${s.dividerEnabled ? `  border-bottom: ${s.dividerWidth}px solid ${s.dividerColor};\n` : ""}  transition: background-color ${s.transitionDuration}ms ease, color ${s.transitionDuration}ms ease;
}`);

  if (!isCustom && s.listStyleType !== "none") {
    rules.push(`.${cls} li::marker {
  color: ${s.markerColor};
}`);
  }
  if (isCustom) {
    rules.push(`.${cls} li::before {
  content: "✓";
  color: ${s.markerColor};
  font-weight: 700;
}`);
  }

  rules.push(`.${cls} li:last-child {
  margin-bottom: 0;${s.dividerEnabled ? "\n  border-bottom: none;" : ""}
}`);

  if (s.itemHoverEnabled) {
    rules.push(`.${cls} li:hover {
  background-color: ${s.itemHoverBgColor};
  color: ${s.itemHoverTextColor};
}`);
  }

  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: ListState, cls: string) {
  return h(
    s.listType,
    { class: cls },
    s.items.map((item) => h("li", {}, item)),
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function listSections(s: ListState, update: Updater<ListState>): PanelSection[] {
  const p = { s, update };

  // Switch the ul/ol tag and move to the matching marker at the same time (bullet ↔ number).
  const setListType = (t: ListState["listType"]) => {
    update("listType", t);
    const isBullet = BULLETS.includes(s.listStyleType);
    if (t === "ol" && isBullet) update("listStyleType", "decimal");
    if (t === "ul" && !isBullet && s.listStyleType !== "none" && s.listStyleType !== "custom-icon")
      update("listStyleType", "disc");
  };

  return [
    {
      id: "items",
      label: i18n.t("el.f.item"),
      icon: SECTION_ICONS.items,
      content: (
        <>
          <LinesField {...p} k="items" label={i18n.t("el.f.listItems")} rows={6} />
          <SelectField
            s={s}
            update={(_, v) => setListType(v as ListState["listType"])}
            k="listType"
            label={i18n.t("el.f.listType")}
            options={[
              { value: "ul", label: i18n.t("el.f.unordered") },
              { value: "ol", label: i18n.t("el.f.ordered") },
            ]}
          />
          <SelectField
            {...p}
            k="listStyleType"
            label={i18n.t("el.f.marker")}
            options={[
              { value: "disc", label: i18n.t("el.f.markerDisc"), group: i18n.t("el.f.bullet") },
              { value: "circle", label: i18n.t("el.f.markerCircle"), group: i18n.t("el.f.bullet") },
              { value: "square", label: i18n.t("el.f.markerSquare"), group: i18n.t("el.f.bullet") },
              { value: "decimal", label: "1, 2, 3", group: i18n.t("el.f.numbers") },
              { value: "lower-alpha", label: "a, b, c", group: i18n.t("el.f.numbers") },
              { value: "upper-alpha", label: "A, B, C", group: i18n.t("el.f.numbers") },
              { value: "lower-roman", label: "i, ii, iii", group: i18n.t("el.f.numbers") },
              { value: "upper-roman", label: "I, II, III", group: i18n.t("el.f.numbers") },
              { value: "none", label: i18n.t("el.f.noMarker"), group: i18n.t("el.f.other") },
              { value: "custom-icon", label: i18n.t("el.f.markerCheck"), group: i18n.t("el.f.other") },
            ]}
          />
          <Show when={s.listStyleType !== "none"}>
            <ColorField {...p} k="markerColor" label={i18n.t("el.f.markerColor")} />
          </Show>
        </>
      ),
    },
    {
      id: "typography",
      label: i18n.t("el.f.typography"),
      icon: SECTION_ICONS.typography,
      content: <TypographySection {...p} />,
    },
    {
      id: "itemStyle",
      label: i18n.t("el.f.itemStyle"),
      icon: SECTION_ICONS.layout,
      content: (
        <>
          <NumberField {...p} k="itemSpacing" label={i18n.t("el.f.itemGap")} min={0} />
          <Row>
            <NumberField {...p} k="itemPaddingX" label="Padding X" min={0} />
            <NumberField {...p} k="itemPaddingY" label="Padding Y" min={0} />
          </Row>
          <NumberField {...p} k="itemBorderRadius" label={i18n.t("el.f.itemRadius")} min={0} />
          <Group title={i18n.t("el.f.divider")}>
            <ToggleField {...p} k="dividerEnabled" label={i18n.t("el.f.showDivider")} />
            <Show when={s.dividerEnabled}>
              <Row>
                <NumberField {...p} k="dividerWidth" label={i18n.t("el.f.thickness")} min={0} />
                <ColorField {...p} k="dividerColor" label={i18n.t("el.f.color")} />
              </Row>
            </Show>
          </Group>
        </>
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
    { id: "background", label: i18n.t("el.f.background"), icon: SECTION_ICONS.background, content: <BackgroundSection {...p} /> },
    { id: "border", label: i18n.t("el.f.border"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    {
      id: "hover",
      label: i18n.t("el.f.itemHover"),
      icon: SECTION_ICONS.hover,
      content: (
        <>
          <ToggleField {...p} k="itemHoverEnabled" label={i18n.t("el.f.itemHoverEffect")} />
          <Show when={s.itemHoverEnabled}>
            <NumberField {...p} k="transitionDuration" label={i18n.t("el.f.transitionDuration")} min={0} suffix="ms" />
            <ColorField {...p} k="itemHoverBgColor" label={i18n.t("el.f.bgOnHover")} />
            <ColorField {...p} k="itemHoverTextColor" label={i18n.t("el.f.textOnHover")} />
          </Show>
        </>
      ),
    },
  ];
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const listElement = defineElement<ListState>({
  type: "list",
  label: "List",
  group: "Data",
  componentName: "List",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls) => ({ css: generateListCss(s, cls), markup: buildMarkup(s, cls) }),
  sections: listSections,
});
