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
import { safeColor } from "../../helpers/background";
import { BackgroundSection, BorderSection, HoverSection, SECTION_ICONS, ShadowSection, SizingSection, SpacingSection, type PanelSection } from "../../ui/PanelStyling";
import { Group, Row } from "../../helpers/SmallUIHelpers";
import { ColorField, NumberField, SelectField, Show, TextField, ToggleField, type Updater, ImageField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import type { CardState } from "./Card";
import i18n from "../../../../../i18n";
import { boxImage } from "../placeholders";

/* ================================================================== */
/* Product Card (GRATIS) — kartu produk untuk katalog toko online       */
/*                                                                    */
/* Gambar, label, nama, harga (+ harga coret), rating, deskripsi       */
/* singkat, dan tombol CTA. Harga hanyalah TEKS tampilan: elemen ini    */
/* tidak memproses pembayaran apa pun.                                 */
/* ================================================================== */

type BaseCard = Omit<
  CardState,
  | "titleText"
  | "titleTag"
  | "bodyText"
  | "footerEnabled"
  | "footerBtnText"
  | "footerBtnHref"
  | "footerBtnBgColor"
  | "footerBtnTextColor"
  | "footerBtnBorderRadius"
  | "imageEnabled"
>;

export interface ProductCardState extends BaseCard {
  name: string;
  nameTag: "h2" | "h3" | "h4";
  description: string;
  showDescription: boolean;
  /** Teks harga apa adanya, mis. "Rp249.000" atau "$19". */
  priceText: string;
  /** Harga coret (opsional). */
  comparePriceText: string;
  priceFontSize: number;
  priceColor: string;
  rating: number;
  showRating: boolean;
  ratingColor: string;
  ratingCount: string;
  ctaText: string;
  /** Kosong = <button>; terisi = <a href>. */
  ctaHref: string;
  ctaFullWidth: boolean;
  ctaBgColor: string;
  ctaTextColor: string;
  ctaBorderRadius: number;
}

const PLACEHOLDER_IMG = boxImage(600, 600, "Product");

const DEFAULT_STATE: ProductCardState = {
  widthMode: "full",
  width: 280,
  paddingLinked: true,
  paddingTop: 16,
  paddingRight: 16,
  paddingBottom: 16,
  paddingLeft: 16,
  contentGap: 6,

  bgType: "solid",
  bgColor: "#ffffff",
  gradientFrom: "#1e3a8a",
  gradientTo: "#3b82f6",
  gradientAngle: 135,

  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#e2e8f0",
  borderRadius: 16,
  pill: false,

  shadowEnabled: true,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 16,
  shadowSpread: 0,
  shadowColor: "#0f172a",
  shadowOpacity: 8,

  hoverEnabled: true,
  hoverBgColor: "#ffffff",
  hoverBorderColor: "#bfdbfe",
  hoverTransform: "lift",
  hoverShadowEnabled: true,
  hoverShadowX: 0,
  hoverShadowY: 14,
  hoverShadowBlur: 32,
  hoverShadowSpread: 0,
  hoverShadowColor: "#0f172a",
  hoverShadowOpacity: 14,
  transitionDuration: 220,
  transitionEasing: "ease",

  imageSrc: PLACEHOLDER_IMG,
  imageAlt: "Foto produk",
  imageHeight: 220,
  imageObjectFit: "cover",
  imageBorderRadius: 0,

  name: "Nama Produk",
  nameTag: "h3",
  titleFontSize: 16,
  titleFontWeight: 600,
  titleColor: "#0f172a",

  description: "Deskripsi singkat produk.",
  showDescription: true,
  bodyFontSize: 13,
  bodyFontWeight: 400,
  bodyColor: "#64748b",

  priceText: "Rp149.000",
  comparePriceText: "",
  priceFontSize: 18,
  priceColor: "#1d4ed8",

  rating: 4.5,
  showRating: true,
  ratingColor: "#f59e0b",
  ratingCount: "(120)",

  badgeEnabled: false,
  badgeText: "Baru",
  badgeBgColor: "#eff6ff",
  badgeTextColor: "#1d4ed8",
  badgeBorderRadius: 999,

  ctaText: "Lihat Detail",
  ctaHref: "",
  ctaFullWidth: true,
  ctaBgColor: "#1d4ed8",
  ctaTextColor: "#ffffff",
  ctaBorderRadius: 10,
};

const DEFAULT_CLASS_NAME = "custom-product-card";

const clampRating = (r: number) => Math.max(0, Math.min(5, Number.isFinite(r) ? r : 0));

/** "★★★★☆" — bintang penuh dibulatkan ke 0,5 terdekat (setengah = ★ terakhir dianggap penuh ≥ .5). */
/** Harga coret: abu-abu yang tetap lolos kontras AA di latar kartu terang maupun gelap. */
function wasColor(bg: unknown): string {
  const m = typeof bg === "string" ? /^#([0-9a-f]{6})$/i.exec(bg.trim()) : null;
  if (!m) return "#64748b";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.45 ? "#cbd5e1" : "#64748b";
}

const imgW = (w: number) => (w > 0 ? Math.round(w) : 400);

function ratingStars(r: number): string {
  const full = Math.round(clampRating(r));
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function generateProductCardCss(s: ProductCardState, cls: string): string {
  const pad = paddingSides(s);
  const rules: string[] = [];
  rules.push(`.${cls} {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
${widthCss(s)}  background: ${backgroundCss(s)};
  border: ${s.borderWidth}px ${s.borderStyle} ${safeColor(s.borderColor) ?? "#e2e8f0"};
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
  rules.push(`.${cls}__image {
  display: block;
  width: 100%;
  height: ${Math.max(0, s.imageHeight)}px;
  object-fit: ${s.imageObjectFit};
  border-radius: ${s.imageBorderRadius}px;
  background: #f1f5f9;
}`);
  if (s.badgeEnabled) {
    rules.push(`.${cls}__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 3px 10px;
  border-radius: ${s.badgeBorderRadius}px;
  background: ${s.badgeBgColor};
  color: ${s.badgeTextColor};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}`);
  }
  rules.push(`.${cls}__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${s.contentGap}px;
  padding: ${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px;
}`);
  rules.push(`.${cls}__name {
  margin: 0;
  font-size: ${s.titleFontSize}px;
  font-weight: ${s.titleFontWeight};
  line-height: 1.35;
  color: ${s.titleColor};
}`);
  rules.push(`.${cls}__rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 13px;
  color: ${s.bodyColor};
}
.${cls}__stars {
  color: ${s.ratingColor};
  letter-spacing: 1px;
}`);
  rules.push(`.${cls}__price {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin: 2px 0 0;
}
.${cls}__now {
  font-size: ${s.priceFontSize}px;
  font-weight: 700;
  color: ${s.priceColor};
}
.${cls}__was {
  font-size: ${Math.max(10, Math.round(s.priceFontSize * 0.72))}px;
  color: ${wasColor(s.bgColor)};
  text-decoration: line-through;
}`);
  rules.push(`.${cls}__text {
  margin: 0;
  font-size: ${s.bodyFontSize}px;
  font-weight: ${s.bodyFontWeight};
  color: ${s.bodyColor};
  line-height: 1.55;
}`);
  rules.push(`.${cls}__cta {
  display: ${s.ctaFullWidth ? "block" : "inline-block"};
  ${s.ctaFullWidth ? "width: 100%;\n  " : "align-self: flex-start;\n  "}box-sizing: border-box;
  margin-top: auto;
  padding: 10px 16px;
  border: none;
  border-radius: ${s.ctaBorderRadius}px;
  background: ${s.ctaBgColor};
  color: ${s.ctaTextColor};
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 150ms ease;
}
.${cls}__cta:hover,
.${cls}__cta:focus-visible {
  opacity: 0.88;
}
.${cls}__spacer {
  flex: 1;
  min-height: 4px;
}`);
  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: ProductCardState, cls: string) {
  const cta = s.ctaHref.trim()
    ? h("a", { class: `${cls}__cta`, href: safeUrl(s.ctaHref) }, s.ctaText)
    : h("button", { type: "button", class: `${cls}__cta` }, s.ctaText);
  const r = clampRating(s.rating);
  return h(
    "article",
    { class: cls },
    // width/height = rasio ukuran asli sebelum gambar termuat (cegah layout bergeser); ukuran tampil tetap dari CSS.
    h("img", { class: `${cls}__image`, src: safeUrl(s.imageSrc, PLACEHOLDER_IMG), alt: s.imageAlt, width: imgW(s.width), height: Math.max(1, Math.round(s.imageHeight)), loading: "lazy", decoding: "async" }),
    s.badgeEnabled && s.badgeText.trim() ? h("span", { class: `${cls}__badge` }, s.badgeText) : null,
    h(
      "div",
      { class: `${cls}__body` },
      h(s.nameTag, { class: `${cls}__name` }, s.name),
      s.showRating
        ? h(
            "p",
            { class: `${cls}__rating` },
            h("span", { class: `${cls}__stars`, "aria-hidden": "true" }, ratingStars(r)),
            h("span", {}, `${r.toFixed(1)} ${s.ratingCount}`.trim()),
          )
        : null,
      h(
        "p",
        { class: `${cls}__price` },
        h("span", { class: `${cls}__now` }, s.priceText),
        s.comparePriceText.trim() ? h("s", { class: `${cls}__was` }, s.comparePriceText) : null,
      ),
      s.showDescription && s.description.trim() ? h("p", { class: `${cls}__text` }, s.description) : null,
      h("span", { class: `${cls}__spacer` }),
      s.ctaText.trim() ? cta : null,
    ),
  );
}

function sections(s: ProductCardState, update: Updater<ProductCardState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "content",
      label: i18n.t("el.f.content"),
      icon: SECTION_ICONS.content,
      content: (
        <>
          <Group title={i18n.t("el.f.product")}>
            <TextField {...p} k="name" label={i18n.t("el.f.productName")} />
            <SelectField
              {...p}
              k="nameTag"
              label={i18n.t("el.f.nameTag")}
              options={[
                { value: "h2", label: "H2" },
                { value: "h3", label: "H3" },
                { value: "h4", label: "H4" },
              ]}
            />
            <ToggleField {...p} k="showDescription" label={i18n.t("el.f.showDescription")} />
            <Show when={s.showDescription}>
              <TextField {...p} k="description" label={i18n.t("el.f.description")} multiline />
            </Show>
          </Group>
          <Group title={i18n.t("el.f.price")}>
            <TextField {...p} k="priceText" label={i18n.t("el.f.price")} placeholder="Rp149.000" hint={i18n.t("el.f.priceHint")} />
            <TextField {...p} k="comparePriceText" label={i18n.t("el.f.comparePrice")} placeholder="Rp199.000" />
            <Row>
              <NumberField {...p} k="priceFontSize" label={i18n.t("el.f.size")} min={10} />
              <ColorField {...p} k="priceColor" label={i18n.t("el.f.color")} />
            </Row>
          </Group>
          <Group title={i18n.t("el.f.rating")}>
            <ToggleField {...p} k="showRating" label={i18n.t("el.f.showRating")} />
            <Show when={s.showRating}>
              <Row>
                <NumberField {...p} k="rating" label={i18n.t("el.f.ratingValue")} min={0} max={5} step={0.1} />
                <TextField {...p} k="ratingCount" label={i18n.t("el.f.reviewCount")} placeholder="(120)" />
              </Row>
              <ColorField {...p} k="ratingColor" label={i18n.t("el.f.starColor")} />
            </Show>
          </Group>
          <Group title={i18n.t("el.f.label")}>
            <ToggleField {...p} k="badgeEnabled" label={i18n.t("el.f.showLabel")} />
            <Show when={s.badgeEnabled}>
              <TextField {...p} k="badgeText" label={i18n.t("el.f.labelText")} />
              <Row>
                <ColorField {...p} k="badgeBgColor" label={i18n.t("el.f.background")} />
                <ColorField {...p} k="badgeTextColor" label={i18n.t("el.f.text")} />
              </Row>
            </Show>
          </Group>
          <Group title={i18n.t("el.f.ctaButton")}>
            <TextField {...p} k="ctaText" label={i18n.t("el.f.buttonText")} />
            <TextField {...p} k="ctaHref" label={i18n.t("el.f.linkOptional")} placeholder="detail-produk.html" hint={i18n.t("el.f.linkButtonHint")} />
            <ToggleField {...p} k="ctaFullWidth" label={i18n.t("el.f.fullCardWidth")} />
            <Row>
              <ColorField {...p} k="ctaBgColor" label={i18n.t("el.f.background")} />
              <ColorField {...p} k="ctaTextColor" label={i18n.t("el.f.text")} />
            </Row>
            <NumberField {...p} k="ctaBorderRadius" label={i18n.t("el.f.buttonRadius")} min={0} />
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
    { id: "background", label: i18n.t("el.f.background"), icon: SECTION_ICONS.background, content: <BackgroundSection {...p} /> },
    { id: "border", label: i18n.t("el.f.border"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    { id: "hover", label: i18n.t("el.f.hover"), icon: SECTION_ICONS.hover, content: <HoverSection {...p} /> },
  ];
}

export const productCardElement = defineElement<ProductCardState>({
  type: "product-card",
  label: "Product Card",
  group: "Data",
  componentName: "ProductCard",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: (s, cls) => ({ css: generateProductCardCss(s, cls), markup: buildMarkup(s, cls) }),
  sections,
});
