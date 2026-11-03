import { borderRadiusCss, shadowLine, widthCss } from "../../helpers/generatorCss";
import { h, raw } from "../../helpers/markup";
import { BorderSection, SECTION_ICONS, ShadowSection, SizingSection, TransitionFields, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import ItemListEditor from "../../ui/ItemListEditor";
import { Group, Row } from "../../helpers/SmallUIHelpers";
import {
  ColorField,
  NumberField,
  SegmentedField,
  SelectField,
  ToggleField,
  type Updater,
} from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

interface AccordionItemData extends Record<string, string> {
  title: string;
  content: string;
}

export interface AccordionState {
  items: AccordionItemData[];
  /** Hanya satu item terbuka (atribut name pada <details>). */
  exclusive: boolean;
  firstOpen: boolean;

  widthMode: "auto" | "fixed" | "full";
  width: number;
  /** 0 = item menyatu dengan garis pemisah; >0 = kartu terpisah. */
  itemGap: number;

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

  /* Header */
  headerPaddingX: number;
  headerPaddingY: number;
  fontSize: number;
  fontWeight: number;
  textColor: string;
  headerBgColor: string;
  headerHoverBgColor: string;
  openHeaderBgColor: string;
  openTextColor: string;

  /* Isi */
  contentPaddingX: number;
  contentPaddingY: number;
  contentFontSize: number;
  contentFontWeight: number;
  contentColor: string;
  contentBgColor: string;
  contentDivider: boolean;

  /* Ikon */
  iconStyle: "chevron" | "plus" | "arrow";
  iconPosition: "left" | "right";
  iconColor: string;
  iconSize: number;

  transitionDuration: number;
  transitionEasing: string;
}

const DEFAULT_STATE: AccordionState = {
  items: [
    {
      title: "Apa itu Page Maker?",
      content:
        "Alat untuk menyusun halaman web secara visual lalu mengunduh source code-nya dalam berbagai framework.",
    },
    {
      title: "Apakah kodenya bisa langsung dipakai?",
      content:
        "Bisa. Accordion ini memakai elemen <details> bawaan HTML, jadi tetap interaktif tanpa JavaScript tambahan.",
    },
    {
      title: "Framework apa saja yang didukung?",
      content: "HTML, React, Vue, Svelte, dan Angular.",
    },
  ],
  exclusive: true,
  firstOpen: true,

  widthMode: "fixed",
  width: 480,
  itemGap: 0,

  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#e5e7eb",
  borderRadius: 12,
  pill: false,

  shadowEnabled: true,
  shadowX: 0,
  shadowY: 1,
  shadowBlur: 3,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 8,

  headerPaddingX: 18,
  headerPaddingY: 14,
  fontSize: 15,
  fontWeight: 600,
  textColor: "#111827",
  headerBgColor: "#ffffff",
  headerHoverBgColor: "#f9fafb",
  openHeaderBgColor: "#ffffff",
  openTextColor: "#012060",

  contentPaddingX: 18,
  contentPaddingY: 14,
  contentFontSize: 14,
  contentFontWeight: 400,
  contentColor: "#4b5563",
  contentBgColor: "#ffffff",
  contentDivider: false,

  iconStyle: "chevron",
  iconPosition: "right",
  iconColor: "#6b7280",
  iconSize: 18,

  transitionDuration: 200,
  transitionEasing: "ease",
};

const DEFAULT_CLASS_NAME = "custom-accordion";

const ICONS: Record<AccordionState["iconStyle"], { path: string; openRotate: number }> = {
  chevron: { path: '<path d="m6 9 6 6 6-6"/>', openRotate: 180 },
  plus: { path: '<path d="M12 5v14"/><path d="M5 12h14"/>', openRotate: 45 },
  arrow: { path: '<path d="m9 18 6-6-6-6"/>', openRotate: 90 },
};

function iconSvg(s: AccordionState) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s.iconSize}" height="${s.iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[s.iconStyle].path}</svg>`;
}

/* ------------------------------------------------------------------ */
/* CSS & markup                                                        */
/* ------------------------------------------------------------------ */

function generateAccordionCss(s: AccordionState, cls: string): string {
  const border = `${s.borderWidth}px ${s.borderStyle} ${s.borderColor}`;
  const radius = borderRadiusCss(s);
  const separated = s.itemGap > 0;
  const t = `${s.transitionDuration}ms ${s.transitionEasing}`;
  const rules: string[] = [];

  rules.push(`.${cls} {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: 100%;
${widthCss(s)}${
    separated
      ? `  gap: ${s.itemGap}px;\n`
      : `  border: ${border};\n  border-radius: ${radius};\n  overflow: hidden;\n${shadowLine(s)}`
  }}`);

  rules.push(`.${cls}__item {
  margin: 0;
  background: ${s.contentBgColor};${
    separated
      ? `\n  border: ${border};\n  border-radius: ${radius};\n  overflow: hidden;\n${shadowLine(s).trimEnd()}`
      : ""
  }
}`);

  if (!separated) {
    rules.push(`.${cls}__item + .${cls}__item {
  border-top: ${border};
}`);
  }

  rules.push(`.${cls}__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${s.headerPaddingY}px ${s.headerPaddingX}px;
  background: ${s.headerBgColor};
  color: ${s.textColor};
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  list-style: none;
  cursor: pointer;
  user-select: none;
  transition: background-color ${t}, color ${t};
}`);

  rules.push(`.${cls}__header::-webkit-details-marker {
  display: none;
}`);

  rules.push(`.${cls}__header:hover {
  background: ${s.headerHoverBgColor};
}`);

  rules.push(`.${cls}__header:focus-visible {
  outline: 2px solid ${s.openTextColor};
  outline-offset: -2px;
}`);

  rules.push(`.${cls}__item[open] > .${cls}__header {
  background: ${s.openHeaderBgColor};
  color: ${s.openTextColor};
}`);

  rules.push(`.${cls}__title {
  flex: 1;
}`);

  rules.push(`.${cls}__icon {
  display: inline-flex;
  flex-shrink: 0;
  color: ${s.iconColor};
  transition: transform ${t};
}`);

  rules.push(`.${cls}__item[open] .${cls}__icon {
  transform: rotate(${ICONS[s.iconStyle].openRotate}deg);
}`);

  rules.push(`.${cls}__content {
  padding: ${s.contentPaddingY}px ${s.contentPaddingX}px;
  color: ${s.contentColor};
  font-size: ${s.contentFontSize}px;
  font-weight: ${s.contentFontWeight};
  line-height: 1.6;${s.contentDivider ? `\n  border-top: ${border};` : ""}
}`);

  rules.push(`.${cls}__item[open] .${cls}__content {
  animation: ${cls}-reveal ${t};
}`);

  rules.push(`@keyframes ${cls}-reveal {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: none; }
}`);

  rules.push(`@media (prefers-reduced-motion: reduce) {
  .${cls}__icon,
  .${cls}__header {
    transition: none;
  }
  .${cls}__item[open] .${cls}__content {
    animation: none;
  }
}`);

  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: AccordionState, cls: string) {
  const icon = h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, raw(iconSvg(s)));
  return h(
    "div",
    { class: cls },
    s.items.map((item, i) => {
      const title = h("span", { class: `${cls}__title` }, item.title);
      return h(
        "details",
        {
          class: `${cls}__item`,
          name: s.exclusive ? `${cls}-group` : undefined,
          open: s.firstOpen && i === 0,
        },
        h("summary", { class: `${cls}__header` }, s.iconPosition === "left" ? [icon, title] : [title, icon]),
        h("div", { class: `${cls}__content` }, item.content),
      );
    }),
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function accordionSections(s: AccordionState, update: Updater<AccordionState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "items",
      label: i18n.t("el.f.item"),
      icon: SECTION_ICONS.items,
      content: (
        <>
          <ItemListEditor
            items={s.items}
            onChange={(v) => update("items", v)}
            fields={[
              { key: "title", label: i18n.t("el.f.title") },
              { key: "content", label: i18n.t("el.f.body"), multiline: true },
            ]}
            newItem={(i) => ({ title: `Pertanyaan ${i + 1}`, content: "Jawaban singkat di sini." })}
          />
          <ToggleField {...p} k="exclusive" label={i18n.t("el.f.exclusive")} />
          <ToggleField {...p} k="firstOpen" label={i18n.t("el.f.firstOpen")} />
        </>
      ),
    },
    {
      id: "header",
      label: i18n.t("el.f.header"),
      icon: SECTION_ICONS.layout,
      content: (
        <>
          <TypographySection {...p} keys={{ size: "fontSize", weight: "fontWeight", color: "textColor" }} />
          <Row>
            <NumberField {...p} k="headerPaddingX" label="Padding X" min={0} />
            <NumberField {...p} k="headerPaddingY" label="Padding Y" min={0} />
          </Row>
          <ColorField {...p} k="headerBgColor" label={i18n.t("el.f.background")} />
          <ColorField {...p} k="headerHoverBgColor" label={i18n.t("el.f.bgOnHover")} />
          <Group title={i18n.t("el.f.whenOpen")}>
            <Row>
              <ColorField {...p} k="openHeaderBgColor" label={i18n.t("el.f.background")} />
              <ColorField {...p} k="openTextColor" label={i18n.t("el.f.text")} />
            </Row>
          </Group>
        </>
      ),
    },
    {
      id: "content",
      label: i18n.t("el.f.body"),
      icon: SECTION_ICONS.content,
      content: (
        <>
          <TypographySection
            {...p}
            keys={{ size: "contentFontSize", weight: "contentFontWeight", color: "contentColor" }}
          />
          <Row>
            <NumberField {...p} k="contentPaddingX" label="Padding X" min={0} />
            <NumberField {...p} k="contentPaddingY" label="Padding Y" min={0} />
          </Row>
          <ColorField {...p} k="contentBgColor" label={i18n.t("el.f.contentBg")} />
          <ToggleField {...p} k="contentDivider" label={i18n.t("el.f.headerContentDivider")} />
        </>
      ),
    },
    {
      id: "icon",
      label: i18n.t("el.f.icon"),
      icon: SECTION_ICONS.icon,
      content: (
        <>
          <SelectField
            {...p}
            k="iconStyle"
            label={i18n.t("el.f.iconShape")}
            options={[
              { value: "chevron", label: i18n.t("el.f.iconChevron") },
              { value: "plus", label: i18n.t("el.f.iconPlus") },
              { value: "arrow", label: i18n.t("el.f.iconArrow") },
            ]}
          />
          <SegmentedField
            {...p}
            k="iconPosition"
            label={i18n.t("el.f.position")}
            options={[
              { value: "left", label: i18n.t("el.f.left") },
              { value: "right", label: i18n.t("el.f.right") },
            ]}
          />
          <Row>
            <NumberField {...p} k="iconSize" label={i18n.t("el.f.size")} min={8} />
            <ColorField {...p} k="iconColor" label={i18n.t("el.f.color")} />
          </Row>
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
          <NumberField
            {...p}
            k="itemGap"
            label={i18n.t("el.f.itemGap")}
            min={0}
            hint={i18n.t("el.f.itemGapHint")}
          />
        </>
      ),
    },
    { id: "border", label: i18n.t("el.f.border"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    { id: "transition", label: i18n.t("el.f.transition"), icon: SECTION_ICONS.animation, content: <TransitionFields {...p} /> },
  ];
}



/* ------------------------------------------------------------------ */
/* Definisi — dipakai halaman ini dan Component Maker                  */
/* ------------------------------------------------------------------ */

export const accordionElement = defineElement<AccordionState>({
  type: "accordion",
  label: "Accordion",
  group: "Data",
  componentName: "Accordion",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls) => ({ css: generateAccordionCss(s, cls), markup: buildMarkup(s, cls) }),
  sections: accordionSections,
});
