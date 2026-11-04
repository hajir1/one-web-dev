import { backgroundCss, type BgKind, type BgFields } from "./background";
export { backgroundCss } from "./background";
export type WidthMode = "auto" | "fixed" | "full";
export type BgType = BgKind;
export type HoverTransform = "none" | "lift" | "scale" | "lift-scale";
type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
/** "blade" = Laravel Blade (the same markup as HTML, wrapped in a Laravel layout & routes). */
export type Framework = "html" | "blade" | "react" | "vue" | "svelte" | "angular";
/** HTML tags for text-based elements (Text/Heading). */
export type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
type TextAlign = "left" | "center" | "right" | "justify";
/** The `type` attribute of an <input>. Only used by the Input element. */
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "tel"
  | "url";

/** Display label for each framework: one source of truth for every element maker. */
export const FRAMEWORK_LABELS: Record<Framework, string> = {
  html: "HTML",
  blade: "Laravel Blade",
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
  angular: "Angular",
};

/* ------------------------------------------------------------------ */
/* State is split into small pieces (mixins) that can be assembled      */
/* per element. Sections in PanelStyling are adaptive: a field only     */
/* shows when its key exists in the state, so an element only picks the */
/* relevant mixins (Pick<...>) without filling in fake fields.          */
/* ------------------------------------------------------------------ */

/** Size, padding, background, border, shadow: the usual CSS "box". */
export interface BoxStyle {
  widthMode: WidthMode;
  width: number;

  paddingLinked: boolean;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  marginLinked: boolean;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;

  bgType: BgType;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  /* Extra background fields (optional; see helpers/background.ts). */
  gradientKind?: BgFields["gradientKind"];
  gradientVia?: string;
  bgImage?: string;
  bgSize?: BgFields["bgSize"];
  bgPosition?: BgFields["bgPosition"];
  bgRepeat?: BgFields["bgRepeat"];
  bgAttachment?: BgFields["bgAttachment"];
  bgOverlayColor?: string;
  bgOverlayOpacity?: number;

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

  cursor: string;
}

/** Text style: used by any element that has text. */
export interface TypographyStyle {
  /** CSS font-family string from the global font library; empty/undefined = inherit. */
  fontFamily?: string;
  fontSize: number;
  /** Fluid size: `fontSize` on desktop, shrinking smoothly down to phone screens (clamp). */
  fluidType?: boolean;
  fontWeight: number;
  letterSpacing: number;
  textColor: string;
  textAlign: TextAlign;
  textTransform: TextTransform;
}

/**
 * The `font-size` of a text style. Fluid size: rem + vw between 360px
 * and 1280px screens; on phones about 72% of the desktop size (at least 18px).
 */
export function fontSizeCss(s: Pick<TypographyStyle, "fontSize" | "fluidType">): string {
  const max = s.fontSize;
  if (!s.fluidType || max < 22) return `${max}px`;
  // Small headings stay nearly fixed; large headings shrink more (equivalent to the old 72% phone size).
  const min = Math.max(18, Math.round(max <= 28 ? max * 0.85 : max <= 64 ? max * 0.72 : 46 + (max - 64) * 0.25));
  const slope = (max - min) / 920;
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return `clamp(${r(min / 16)}rem, ${r((min - slope * 360) / 16)}rem + ${r(slope * 100)}vw, ${r(max / 16)}rem)`;
}

/** Transition + hover state: used by interactive/hoverable elements. */
interface InteractionStyle {
  transitionDuration: number;
  transitionEasing: string;

  hoverEnabled: boolean;
  hoverBgColor: string;
  hoverTextColor: string;
  hoverBorderColor: string;
  hoverTransform: HoverTransform;
  hoverShadowEnabled: boolean;
  hoverShadowX: number;
  hoverShadowY: number;
  hoverShadowBlur: number;
  hoverShadowSpread: number;
  hoverShadowColor: string;
  hoverShadowOpacity: number;
}

/** Icon from the global library: used by elements that can have an icon. */
interface IconStyle {
  iconId: string | null;
  iconPosition: "left" | "right";
  iconSize: number;
  iconGap: number;
  iconColorMode: "currentColor" | "original";
}

/** Shadow fragment only (e.g. for Table, Image). */
export type ShadowStyle = Pick<
  BoxStyle,
  | "shadowEnabled"
  | "shadowX"
  | "shadowY"
  | "shadowBlur"
  | "shadowSpread"
  | "shadowColor"
  | "shadowOpacity"
>;

/**
 * Combination for "single content" elements: one text + one optional icon
 * (Button, Alert, Text, Anchor, Input, Badge).
 */
export interface StyleState
  extends BoxStyle,
    TypographyStyle,
    InteractionStyle,
    IconStyle {
  text: string;
  /** Optional: used by the Text element to choose h1-h6/p. */
  tag?: TextTag;
  /** Optional: used by the Input element to choose type="text|email|...". */
  inputType?: InputType;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Color + opacity. Hex (#rgb/#rrggbb) is converted to rgba(); other colors
 * (transparent, rgb(), color names) use color-mix() so they no longer
 * produce "rgba(NaN, NaN, NaN, …)" as before.
 */
export function hexToRgba(color: string, opacityPct: number): string {
  const pct = Math.min(Math.max(Number(opacityPct) || 0, 0), 100);
  const clean = color.trim().replace("#", "");
  const isHex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color.trim());
  if (!isHex) {
    if (!color.trim()) return "transparent";
    return `color-mix(in srgb, ${color.trim()} ${pct}%, transparent)`;
  }
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${pct / 100})`;
}

type PaddingLike = Pick<
  BoxStyle,
  "paddingLinked" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft"
>;
type MarginLike = Pick<
  BoxStyle,
  "marginLinked" | "marginTop" | "marginRight" | "marginBottom" | "marginLeft"
>;

export function paddingCss(s: PaddingLike): string {
  if (s.paddingLinked) return `${s.paddingTop}px`;
  return `${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px`;
}

/** Padding value per side (accounts for the "uniform" mode). */
export function paddingSides(s: PaddingLike) {
  const t = s.paddingTop;
  return s.paddingLinked
    ? { top: t, right: t, bottom: t, left: t }
    : {
        top: s.paddingTop,
        right: s.paddingRight,
        bottom: s.paddingBottom,
        left: s.paddingLeft,
      };
}

export function marginCss(s: MarginLike): string {
  if (s.marginLinked) return `${s.marginTop}px`;
  return `${s.marginTop}px ${s.marginRight}px ${s.marginBottom}px ${s.marginLeft}px`;
}

export function borderRadiusCss(s: { pill: boolean; borderRadius: number }): string {
  return s.pill ? "9999px" : `${s.borderRadius}px`;
}

export function widthCss(s: { widthMode: WidthMode; width: number }): string {
  return s.widthMode === "fixed"
    ? `  width: ${s.width}px;\n`
    : s.widthMode === "full"
      ? `  width: 100%;\n`
      : "";
}

/** A `box-shadow: ...;` line (or an empty string). `prefix` = "shadow" / "hoverShadow" / etc. */
export function shadowLine(
  s: object,
  prefix = "shadow",
  property = "box-shadow",
): string {
  const v = shadowValue(s, prefix);
  return v ? `  ${property}: ${v};\n` : "";
}

/** The box-shadow value only (no property name), or "" when disabled. */
export function shadowValue(s: object, prefix = "shadow"): string {
  const o = s as Record<string, unknown>;
  if (`${prefix}Enabled` in o && !o[`${prefix}Enabled`]) return "";
  return `${o[`${prefix}X`]}px ${o[`${prefix}Y`]}px ${o[`${prefix}Blur`]}px ${o[`${prefix}Spread`]}px ${hexToRgba(
    String(o[`${prefix}Color`]),
    Number(o[`${prefix}Opacity`]),
  )}`;
}

export function transformCss(t: HoverTransform): string {
  switch (t) {
    case "lift":
      return "translateY(-3px)";
    case "scale":
      return "scale(1.05)";
    case "lift-scale":
      return "translateY(-3px) scale(1.05)";
    default:
      return "none";
  }
}

/** text-align → justify-content (for flex). */
function alignToJustify(a: TextAlign | "left" | "center" | "right"): string {
  return a === "center"
    ? "center"
    : a === "right"
      ? "flex-end"
      : a === "justify"
        ? "space-between"
        : "flex-start";
}

/**
 * Escaping for TEXT & ATTRIBUTE VALUES in every generated template
 * (HTML, JSX, Vue, Svelte, Angular). Besides the usual HTML characters, curly
 * braces are escaped too because `{` starts an expression in JSX/Svelte and
 * `{{` starts interpolation in Vue/Angular; previously text such as
 * "Halo {nama}" broke the exported React code. `@` is escaped too
 * because it starts a control-flow block in Angular 17+ templates (e.g. the text
 * "john@example.com" made the Angular template fail to compile).
 */
export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;")
    .replace(/@/g, "&#64;");
}

/**
 * Escaping for TEXT content (not attributes): quotes are left as is so
 * the exported code stays readable ("Jum'at", "kata "kunci"").
 */
export function escapeText(str: string): string {
  return escapeHtml(str).replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/** Only allows URLs that are safe for href/src (blocks javascript:, data:text/html, etc.). */
export function safeUrl(url: string, fallback = "#"): string {
  const u = String(url ?? "").trim();
  if (!u) return fallback;
  // eslint-disable-next-line no-control-regex -- control characters are deliberately stripped before the URL scheme check
  if (/^(javascript|vbscript|data):/i.test(u.replace(/[\s\u0000-\u001f]/g, "")))
    return /^data:image\//i.test(u) ? u : fallback;
  return u;
}


/** Produces the full CSS (base + hover + icon) for a StyleState element. */
export function generateCss(
  s: StyleState,
  className: string,
  hasIcon: boolean = false,
  /** Forces a flex layout even without an icon (e.g. an Alert with a close button). */
  flex: boolean = hasIcon,
): string {
  const displayLines = flex
    ? `  display: inline-flex;\n  align-items: center;\n  justify-content: ${alignToJustify(s.textAlign)};\n  gap: ${s.iconGap}px;\n`
    : `  display: inline-block;\n`;

  const base = `.${className} {
  box-sizing: border-box;
${displayLines}${widthCss(s)}  margin: ${marginCss(s)};
  padding: ${paddingCss(s)};
  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};
  border-radius: ${borderRadiusCss(s)};
  background: ${backgroundCss(s)};
  color: ${s.textColor};
  font-family: ${s.fontFamily || "inherit"};
  font-size: ${fontSizeCss(s)};
  font-weight: ${s.fontWeight};
  overflow-wrap: break-word;
  text-align: ${s.textAlign};
  letter-spacing: ${s.letterSpacing}px;
  text-transform: ${s.textTransform};
  text-decoration: none;
  cursor: ${s.cursor};
${shadowLine(s)}  transition: all ${s.transitionDuration}ms ${s.transitionEasing};
}`;

  const hover = s.hoverEnabled
    ? `

.${className}:hover {
  background: ${s.hoverBgColor};
  color: ${s.hoverTextColor};
  border-color: ${s.hoverBorderColor};
  transform: ${transformCss(s.hoverTransform)};
${shadowLine(s, "hoverShadow")}}`
    : "";

  const iconRules = hasIcon
    ? `

.${className}__icon {
  display: inline-flex;
  flex-shrink: 0;
}`
    : "";

  return base + hover + iconRules + "\n";
}
