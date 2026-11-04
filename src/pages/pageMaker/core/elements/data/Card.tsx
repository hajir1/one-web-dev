import type { BgType } from "../../helpers/generatorCss";
import {
  backgroundCss,
  borderRadiusCss,
  paddingSides,
  safeUrl,
  shadowLine,
  transformCss,
  widthCss,
} from "../../helpers/generatorCss";
import { h } from "../../helpers/markup";
import { BackgroundSection, BorderSection, HoverSection, SECTION_ICONS, ShadowSection, SizingSection, SpacingSection, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import { Group, Row } from "../../helpers/SmallUIHelpers";
import { ColorField, NumberField, SelectField, Show, TextField, ToggleField, type Updater, ImageField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";
import { boxImage } from "../placeholders";

/* ------------------------------------------------------------------ */
/* CardState                                                           */
/* ------------------------------------------------------------------ */

export interface CardState {
  /* Size & padding */
  widthMode: "auto" | "fixed" | "full";
  width: number;
  paddingLinked: boolean;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  contentGap: number;

  /* Background */
  bgType: BgType;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;

  /* Border */
  borderWidth: number;
  borderStyle: "none" | "solid" | "dashed" | "dotted";
  borderColor: string;
  borderRadius: number;
  pill: boolean;

  /* Shadow */
  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  shadowOpacity: number;

  /* Hover */
  hoverEnabled: boolean;
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

  /* Image */
  imageEnabled: boolean;
  imageSrc: string;
  imageAlt: string;
  imageHeight: number;
  imageObjectFit: "cover" | "contain" | "fill";
  imageBorderRadius: number;

  /* Text */
  titleText: string;
  titleTag: "h2" | "h3" | "h4";
  titleFontSize: number;
  titleFontWeight: number;
  titleColor: string;

  bodyText: string;
  bodyFontSize: number;
  bodyFontWeight: number;
  bodyColor: string;

  /* Badge */
  badgeEnabled: boolean;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  badgeBorderRadius: number;

  /* Footer */
  footerEnabled: boolean;
  footerBtnText: string;
  /** Empty = <button>; filled = <a href>. */
  footerBtnHref: string;
  footerBtnBgColor: string;
  footerBtnTextColor: string;
  footerBtnBorderRadius: number;
}

const PLACEHOLDER_IMG = boxImage(640, 360, "Image");

const DEFAULT_STATE: CardState = {
  widthMode: "fixed",
  width: 320,
  paddingLinked: true,
  paddingTop: 20,
  paddingRight: 20,
  paddingBottom: 20,
  paddingLeft: 20,
  contentGap: 8,

  bgType: "solid",
  bgColor: "#ffffff",
  gradientFrom: "#1e3a8a",
  gradientTo: "#3b82f6",
  gradientAngle: 135,

  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#e5e7eb",
  borderRadius: 16,
  pill: false,

  shadowEnabled: true,
  shadowX: 0,
  shadowY: 8,
  shadowBlur: 24,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 10,

  hoverEnabled: true,
  hoverBgColor: "#ffffff",
  hoverBorderColor: "#d1d5db",
  hoverTransform: "lift",
  hoverShadowEnabled: true,
  hoverShadowX: 0,
  hoverShadowY: 16,
  hoverShadowBlur: 40,
  hoverShadowSpread: 0,
  hoverShadowColor: "#000000",
  hoverShadowOpacity: 18,
  transitionDuration: 250,
  transitionEasing: "ease",

  imageEnabled: true,
  imageSrc: PLACEHOLDER_IMG,
  imageAlt: "Gambar kartu",
  imageHeight: 180,
  imageObjectFit: "cover",
  imageBorderRadius: 0,

  titleText: "Judul Kartu",
  titleTag: "h3",
  titleFontSize: 18,
  titleFontWeight: 700,
  titleColor: "#111827",

  bodyText:
    "Deskripsi singkat yang menjelaskan isi konten kartu. Bisa berisi teks bebas beberapa baris.",
  bodyFontSize: 14,
  bodyFontWeight: 400,
  bodyColor: "#6b7280",

  badgeEnabled: true,
  badgeText: "New",
  badgeBgColor: "#eff6ff",
  badgeTextColor: "#1d4ed8",
  badgeBorderRadius: 999,

  footerEnabled: true,
  footerBtnText: "Selengkapnya →",
  footerBtnHref: "",
  footerBtnBgColor: "#012060",
  footerBtnTextColor: "#ffffff",
  footerBtnBorderRadius: 8,
};

const DEFAULT_CLASS_NAME = "custom-card";

/* ------------------------------------------------------------------ */
/* CSS generator khusus Card                                           */
/* ------------------------------------------------------------------ */

function generateCardCss(s: CardState, cls: string): string {
  const pad = paddingSides(s);
  const rules: string[] = [];

  rules.push(`.${cls} {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
${widthCss(s)}  background: ${backgroundCss(s)};
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  border-radius: ${borderRadiusCss(s)};
${shadowLine(s)}  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}`);

  if (s.hoverEnabled) {
    rules.push(`.${cls}:hover {
  background: ${s.hoverBgColor};
  border-color: ${s.hoverBorderColor};
  transform: ${transformCss(s.hoverTransform)};
${shadowLine(s, "hoverShadow")}}`);
  }

  if (s.imageEnabled) {
    rules.push(`.${cls}__image {
  display: block;
  width: 100%;
  height: ${s.imageHeight}px;
  object-fit: ${s.imageObjectFit};
  border-radius: ${s.imageBorderRadius}px;
}`);
  }

  rules.push(`.${cls}__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${s.contentGap}px;
  padding: ${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px;
}`);

  if (s.badgeEnabled) {
    rules.push(`.${cls}__badge {
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: ${s.badgeBorderRadius}px;
  background: ${s.badgeBgColor};
  color: ${s.badgeTextColor};
  font-size: 11px;
  font-weight: 600;
}`);
  }

  rules.push(`.${cls}__title {
  margin: 0;
  font-size: ${s.titleFontSize}px;
  font-weight: ${s.titleFontWeight};
  color: ${s.titleColor};
}`);

  rules.push(`.${cls}__text {
  margin: 0;
  font-size: ${s.bodyFontSize}px;
  font-weight: ${s.bodyFontWeight};
  color: ${s.bodyColor};
  line-height: 1.6;
}`);

  if (s.footerEnabled) {
    // Previously the footer's left padding was missing (only 3 values: top right bottom).
    rules.push(`.${cls}__footer {
  padding: 0 ${pad.right}px ${pad.bottom}px ${pad.left}px;
}`);
    rules.push(`.${cls}__btn {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  border-radius: ${s.footerBtnBorderRadius}px;
  background: ${s.footerBtnBgColor};
  color: ${s.footerBtnTextColor};
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 150ms ease;
}`);
    rules.push(`.${cls}__btn:hover {
  opacity: 0.88;
}`);
  }

  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: CardState, cls: string) {
  const btn = s.footerBtnHref.trim()
    ? h("a", { class: `${cls}__btn`, href: safeUrl(s.footerBtnHref) }, s.footerBtnText)
    : h("button", { type: "button", class: `${cls}__btn` }, s.footerBtnText);

  return h(
    "article",
    { class: cls },
    s.imageEnabled
      ? h("img", {
          class: `${cls}__image`,
          src: safeUrl(s.imageSrc, PLACEHOLDER_IMG),
          alt: s.imageAlt,
          width: 400,
          height: Math.max(1, Math.round(s.imageHeight)),
          loading: "lazy",
          decoding: "async",
        })
      : null,
    h(
      "div",
      { class: `${cls}__body` },
      s.badgeEnabled ? h("span", { class: `${cls}__badge` }, s.badgeText) : null,
      h(s.titleTag, { class: `${cls}__title` }, s.titleText),
      h("p", { class: `${cls}__text` }, s.bodyText),
    ),
    s.footerEnabled ? h("div", { class: `${cls}__footer` }, btn) : null,
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function cardSections(s: CardState, update: Updater<CardState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "content",
      label: i18n.t("el.f.content"),
      icon: SECTION_ICONS.content,
      content: (
        <>
          <Group title={i18n.t("el.f.titleDesc")}>
            <TextField {...p} k="titleText" label={i18n.t("el.f.title")} />
            <SelectField
              {...p}
              k="titleTag"
              label={i18n.t("el.f.titleTag")}
              options={[
                { value: "h2", label: "H2" },
                { value: "h3", label: "H3" },
                { value: "h4", label: "H4" },
              ]}
            />
            <TextField {...p} k="bodyText" label={i18n.t("el.f.description")} multiline />
          </Group>
          <Group title="Badge">
            <ToggleField {...p} k="badgeEnabled" label={i18n.t("el.f.showBadge")} />
            <Show when={s.badgeEnabled}>
              <TextField {...p} k="badgeText" label={i18n.t("el.f.badgeText")} />
              <Row>
                <ColorField {...p} k="badgeBgColor" label={i18n.t("el.f.background")} />
                <ColorField {...p} k="badgeTextColor" label={i18n.t("el.f.text")} />
              </Row>
              <NumberField {...p} k="badgeBorderRadius" label={i18n.t("el.f.badgeRadius")} min={0} />
            </Show>
          </Group>
          <Group title={i18n.t("el.f.footerButton")}>
            <ToggleField {...p} k="footerEnabled" label={i18n.t("el.f.showButton")} />
            <Show when={s.footerEnabled}>
              <TextField {...p} k="footerBtnText" label={i18n.t("el.f.buttonText")} />
              <TextField
                {...p}
                k="footerBtnHref"
                label={i18n.t("el.f.linkOptional")}
                placeholder="https://..."
                hint={i18n.t("el.f.linkButtonHint")}
              />
              <Row>
                <ColorField {...p} k="footerBtnBgColor" label={i18n.t("el.f.background")} />
                <ColorField {...p} k="footerBtnTextColor" label={i18n.t("el.f.text")} />
              </Row>
              <NumberField {...p} k="footerBtnBorderRadius" label={i18n.t("el.f.buttonRadius")} min={0} />
            </Show>
          </Group>
        </>
      ),
    },
    {
      id: "image",
      label: i18n.t("el.f.image"),
      icon: SECTION_ICONS.image,
      content: (
        <>
          <ToggleField {...p} k="imageEnabled" label={i18n.t("el.f.showImage")} />
          <Show when={s.imageEnabled}>
            <ImageField {...p} k="imageSrc" label={i18n.t("el.f.imageUrl")} />
            <TextField {...p} k="imageAlt" label={i18n.t("el.f.altText")} />
            <NumberField {...p} k="imageHeight" label={i18n.t("el.f.imageHeight")} min={0} />
            <SelectField
              {...p}
              k="imageObjectFit"
              label="Object-fit"
              options={[
                { value: "cover", label: "cover" },
                { value: "contain", label: "contain" },
                { value: "fill", label: "fill" },
              ]}
            />
            <NumberField {...p} k="imageBorderRadius" label={i18n.t("el.f.imageRadius")} min={0} />
          </Show>
        </>
      ),
    },
    {
      id: "sizing",
      label: i18n.t("el.f.sizeSpacing"),
      icon: SECTION_ICONS.sizing,
      content: (
        <>
          <SizingSection {...p} label={i18n.t("el.f.cardWidth")} />
          <SpacingSection {...p} paddingTitle={i18n.t("el.f.cardPadding")}>
            <NumberField {...p} k="contentGap" label={i18n.t("el.f.contentGap")} min={0} />
          </SpacingSection>
        </>
      ),
    },
    {
      id: "typography",
      label: i18n.t("el.f.typography"),
      icon: SECTION_ICONS.typography,
      content: (
        <>
          <Group title={i18n.t("el.f.title")}>
            <TypographySection
              {...p}
              keys={{ size: "titleFontSize", weight: "titleFontWeight", color: "titleColor" }}
            />
          </Group>
          <Group title={i18n.t("el.f.description")}>
            <TypographySection
              {...p}
              keys={{ size: "bodyFontSize", weight: "bodyFontWeight", color: "bodyColor" }}
            />
          </Group>
        </>
      ),
    },
    { id: "background", label: i18n.t("el.f.background"), icon: SECTION_ICONS.background, content: <BackgroundSection {...p} /> },
    { id: "border", label: i18n.t("el.f.border"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    { id: "hover", label: i18n.t("el.f.hover"), icon: SECTION_ICONS.hover, content: <HoverSection {...p} /> },
  ];
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const cardElement = defineElement<CardState>({
  type: "card",
  label: "Card",
  group: "Data",
  componentName: "Card",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls) => ({ css: generateCardCss(s, cls), markup: buildMarkup(s, cls) }),
  sections: cardSections,
});
