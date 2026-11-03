import type { BgType } from "../../helpers/generatorCss";
import {
  backgroundCss,
  borderRadiusCss,
  paddingCss,
  safeUrl,
  shadowLine,
} from "../../helpers/generatorCss";
import { h, raw } from "../../helpers/markup";
import { BackgroundSection, BorderSection, IconSection, SECTION_ICONS, ShadowSection, SpacingSection, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import ItemListEditor from "../../ui/ItemListEditor";
import { Group, Row } from "../../helpers/SmallUIHelpers";
import {
  ColorField,
  FONT_WEIGHT_OPTIONS,
  NumberField,
  SelectField,
  Show,
  TextField,
  ToggleField,
  type Updater,
} from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

interface CrumbData extends Record<string, string> {
  label: string;
  href: string;
}

export interface BreadcrumbsState {
  items: CrumbData[];

  separator: "slash" | "chevron" | "arrow" | "dot" | "pipe" | "custom";
  customSeparator: string;
  separatorColor: string;
  separatorGap: number;

  fontSize: number;
  fontWeight: number;
  textColor: string;
  linkHoverColor: string;
  underlineOnHover: boolean;
  currentColor: string;
  currentFontWeight: number;

  /* Ikon untuk item pertama (Home) */
  iconId: string | null;
  iconSize: number;
  iconGap: number;
  iconColorMode: "currentColor" | "original";
  iconOnly: boolean;

  /* Kotak pembungkus */
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
}

const DEFAULT_STATE: BreadcrumbsState = {
  items: [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/produk" },
    { label: "Elektronik", href: "/produk/elektronik" },
    { label: "Laptop Gaming", href: "" },
  ],

  separator: "chevron",
  customSeparator: "»",
  separatorColor: "#9ca3af",
  separatorGap: 8,

  fontSize: 14,
  fontWeight: 500,
  textColor: "#6b7280",
  linkHoverColor: "#012060",
  underlineOnHover: true,
  currentColor: "#111827",
  currentFontWeight: 600,

  iconId: null,
  iconSize: 16,
  iconGap: 6,
  iconColorMode: "currentColor",
  iconOnly: false,

  paddingLinked: false,
  paddingTop: 10,
  paddingRight: 16,
  paddingBottom: 10,
  paddingLeft: 16,
  bgType: "solid",
  bgColor: "#f9fafb",
  gradientFrom: "#eff6ff",
  gradientTo: "#f5f3ff",
  gradientAngle: 90,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#e5e7eb",
  borderRadius: 10,
  pill: false,
  shadowEnabled: false,
  shadowX: 0,
  shadowY: 1,
  shadowBlur: 2,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 6,
};

const DEFAULT_CLASS_NAME = "custom-breadcrumbs";

const SEPARATORS: Record<Exclude<BreadcrumbsState["separator"], "custom">, string> = {
  slash: "/",
  chevron: "›",
  arrow: "→",
  dot: "•",
  pipe: "|",
};

/** Escape isi string CSS `content: "..."`. */
const cssString = (v: string) => v.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");

/* ------------------------------------------------------------------ */
/* CSS & markup                                                        */
/* ------------------------------------------------------------------ */

function generateBreadcrumbsCss(
  s: BreadcrumbsState,
  cls: string,
  hasIcon = false,
): string {
  const sep = s.separator === "custom" ? s.customSeparator || "/" : SEPARATORS[s.separator];
  const rules: string[] = [];

  rules.push(`.${cls} {
  box-sizing: border-box;
  display: inline-block;
  max-width: 100%;
  padding: ${paddingCss(s)};
  background: ${backgroundCss(s)};
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  border-radius: ${borderRadiusCss(s)};
${shadowLine(s)}  font-size: ${s.fontSize}px;
}`);

  rules.push(`.${cls}__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${s.separatorGap}px;
  margin: 0;
  padding: 0;
  list-style: none;
}`);

  rules.push(`.${cls}__item {
  display: inline-flex;
  align-items: center;
  gap: ${s.separatorGap}px;
}`);

  // Pemisah dibuat lewat CSS: tidak ikut dibacakan screen reader & tidak mengotori markup.
  rules.push(`.${cls}__item + .${cls}__item::before {
  content: "${cssString(sep)}";
  color: ${s.separatorColor};
}`);

  rules.push(`.${cls}__link {
  display: inline-flex;
  align-items: center;
  gap: ${s.iconGap}px;
  color: ${s.textColor};
  font-weight: ${s.fontWeight};
  text-decoration: none;
  border-radius: 4px;
  transition: color 150ms ease;
}`);

  rules.push(`.${cls}__link:hover {
  color: ${s.linkHoverColor};${s.underlineOnHover ? "\n  text-decoration: underline;" : ""}
}`);

  rules.push(`.${cls}__link:focus-visible {
  outline: 2px solid ${s.linkHoverColor};
  outline-offset: 2px;
}`);

  rules.push(`.${cls}__current {
  color: ${s.currentColor};
  font-weight: ${s.currentFontWeight};
}`);

  if (hasIcon) {
    rules.push(`.${cls}__icon {
  display: inline-flex;
}`);
  }

  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: BreadcrumbsState, cls: string, iconMarkup: string | null) {
  const last = s.items.length - 1;
  return h(
    "nav",
    { class: cls, "aria-label": "Breadcrumb" },
    h(
      "ol",
      { class: `${cls}__list` },
      s.items.map((item, i) => {
        const withIcon = i === 0 && iconMarkup;
        const icon = withIcon
          ? h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, raw(iconMarkup))
          : null;
        const labelNodes = withIcon && s.iconOnly ? [icon] : [icon, item.label];

        if (i === last || !item.href.trim()) {
          return h(
            "li",
            { class: `${cls}__item` },
            h(
              "span",
              {
                class: `${cls}__current`,
                "aria-current": i === last ? "page" : undefined,
                "aria-label": withIcon && s.iconOnly ? item.label : undefined,
              },
              labelNodes,
            ),
          );
        }
        return h(
          "li",
          { class: `${cls}__item` },
          h(
            "a",
            {
              class: `${cls}__link`,
              href: safeUrl(item.href),
              "aria-label": withIcon && s.iconOnly ? item.label : undefined,
            },
            labelNodes,
          ),
        );
      }),
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function breadcrumbSections(
  s: BreadcrumbsState,
  update: Updater<BreadcrumbsState>,
): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "items",
      label: i18n.t("el.f.item"),
      icon: SECTION_ICONS.items,
      content: (
        <ItemListEditor
          items={s.items}
          onChange={(v) => update("items", v)}
          itemLabel={i18n.t("el.f.level")}
          fields={[
            { key: "label", label: i18n.t("el.f.label") },
            { key: "href", label: i18n.t("el.f.link"), placeholder: i18n.t("el.f.crumbLinkPlaceholder") },
          ]}
          newItem={(i) => ({ label: `Halaman ${i + 1}`, href: "" })}
        />
      ),
    },
    {
      id: "separator",
      label: i18n.t("el.f.separator"),
      icon: SECTION_ICONS.layout,
      content: (
        <>
          <SelectField
            {...p}
            k="separator"
            label={i18n.t("el.f.separatorShape")}
            options={[
              { value: "slash", label: i18n.t("el.f.sepSlash") },
              { value: "chevron", label: i18n.t("el.f.sepChevron") },
              { value: "arrow", label: i18n.t("el.f.sepArrow") },
              { value: "dot", label: i18n.t("el.f.sepDot") },
              { value: "pipe", label: i18n.t("el.f.sepPipe") },
              { value: "custom", label: i18n.t("el.f.sepCustom") },
            ]}
          />
          <Show when={s.separator === "custom"}>
            <TextField {...p} k="customSeparator" label={i18n.t("el.f.separatorText")} />
          </Show>
          <Row>
            <ColorField {...p} k="separatorColor" label={i18n.t("el.f.color")} />
            <NumberField {...p} k="separatorGap" label={i18n.t("el.f.spacing")} min={0} />
          </Row>
        </>
      ),
    },
    {
      id: "typography",
      label: i18n.t("el.f.typography"),
      icon: SECTION_ICONS.typography,
      content: (
        <>
          <Group title={i18n.t("el.f.link")}>
            <TypographySection
              {...p}
              keys={{ size: "fontSize", weight: "fontWeight", color: "textColor" }}
              colorLabel={i18n.t("el.f.linkColor")}
            />
            <ColorField {...p} k="linkHoverColor" label={i18n.t("el.f.colorOnHover")} />
            <ToggleField {...p} k="underlineOnHover" label={i18n.t("el.f.underlineOnHover")} />
          </Group>
          <Group title={i18n.t("el.f.currentPage")}>
            <Row>
              <ColorField {...p} k="currentColor" label={i18n.t("el.f.color")} />
              <SelectField {...p} k="currentFontWeight" label={i18n.t("el.f.weight")} options={FONT_WEIGHT_OPTIONS} />
            </Row>
          </Group>
        </>
      ),
    },
    {
      id: "icon",
      label: i18n.t("el.f.homeIcon"),
      icon: SECTION_ICONS.icon,
      content: (
        <>
          <IconSection {...p} withPosition={false} />
          <Show when={!!s.iconId}>
            <ToggleField {...p} k="iconOnly" label={i18n.t("el.f.iconOnly")} />
          </Show>
        </>
      ),
    },
    {
      id: "spacing",
      label: i18n.t("el.f.spacing"),
      icon: SECTION_ICONS.spacing,
      content: <SpacingSection {...p} />,
    },
    { id: "background", label: i18n.t("el.f.background"), icon: SECTION_ICONS.background, content: <BackgroundSection {...p} /> },
    { id: "border", label: i18n.t("el.f.border"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
  ];
}



/* ------------------------------------------------------------------ */
/* Definisi — dipakai halaman ini dan Component Maker                  */
/* ------------------------------------------------------------------ */

export const breadcrumbsElement = defineElement<BreadcrumbsState>({
  type: "breadcrumbs",
  label: "Breadcrumbs",
  group: "Navigasi",
  componentName: "Breadcrumbs",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls, icons) => {
    const icon = icons(s.iconId, s.iconSize, s.iconColorMode);
    return { css: generateBreadcrumbsCss(s, cls, !!icon), markup: buildMarkup(s, cls, icon) };
  },
  sections: breadcrumbSections,
});
