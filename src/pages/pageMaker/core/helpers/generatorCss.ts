import { backgroundCss, type BgKind, type BgFields } from "./background";
export { backgroundCss } from "./background";
export type WidthMode = "auto" | "fixed" | "full";
export type BgType = BgKind;
export type HoverTransform = "none" | "lift" | "scale" | "lift-scale";
type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
/** "blade" = Laravel Blade (markup sama dengan HTML, dibungkus layout & rute Laravel). */
export type Framework = "html" | "blade" | "react" | "vue" | "svelte" | "angular";
/** Tag HTML buat elemen berbasis teks (Text/Heading). */
export type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
type TextAlign = "left" | "center" | "right" | "justify";
/** Tipe atribut `type` pada <input>. Cuma dipakai elemen Input. */
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "tel"
  | "url";

/** Label tampilan tiap framework — satu sumber kebenaran untuk semua elemen maker. */
export const FRAMEWORK_LABELS: Record<Framework, string> = {
  html: "HTML",
  blade: "Laravel Blade",
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
  angular: "Angular",
};

/* ------------------------------------------------------------------ */
/* State dipecah jadi potongan kecil (mixin) yang bisa dirakit sendiri  */
/* per elemen. Section di PanelStyling bersifat adaptif: field hanya    */
/* tampil kalau key-nya ada di state, jadi elemen cukup memilih mixin   */
/* yang relevan (Pick<...>) tanpa harus mengisi field palsu.            */
/* ------------------------------------------------------------------ */

/** Ukuran, padding, background, border, shadow — "kotak" CSS pada umumnya. */
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
  /* Field background tambahan (opsional; lihat helpers/background.ts). */
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

/** Gaya teks — dipakai elemen apa pun yang punya teks. */
export interface TypographyStyle {
  /** String CSS font-family dari pustaka font global; kosong/undefined = warisi. */
  fontFamily?: string;
  fontSize: number;
  /** Ukuran cair: `fontSize` di desktop, mengecil mulus sampai layar HP (clamp). */
  fluidType?: boolean;
  fontWeight: number;
  letterSpacing: number;
  textColor: string;
  textAlign: TextAlign;
  textTransform: TextTransform;
}

/**
 * `font-size` sebuah gaya teks. Ukuran cair: rem + vw di antara layar 360px
 * dan 1280px; di HP sekitar 72% dari ukuran desktop (minimal 18px).
 */
export function fontSizeCss(s: Pick<TypographyStyle, "fontSize" | "fluidType">): string {
  const max = s.fontSize;
  if (!s.fluidType || max < 22) return `${max}px`;
  // Judul kecil hampir tetap; judul besar mengecil lebih banyak (setara ukuran HP lama 72%).
  const min = Math.max(18, Math.round(max <= 28 ? max * 0.85 : max <= 64 ? max * 0.72 : 46 + (max - 64) * 0.25));
  const slope = (max - min) / 920;
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return `clamp(${r(min / 16)}rem, ${r((min - slope * 360) / 16)}rem + ${r(slope * 100)}vw, ${r(max / 16)}rem)`;
}

/** Transisi + state hover — dipakai elemen yang interaktif/bisa di-hover. */
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

/** Ikon dari pustaka global — dipakai elemen yang bisa dikasih ikon. */
interface IconStyle {
  iconId: string | null;
  iconPosition: "left" | "right";
  iconSize: number;
  iconGap: number;
  iconColorMode: "currentColor" | "original";
}

/** Potongan shadow saja (mis. untuk Table, Image). */
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
 * Gabungan buat elemen "konten tunggal": satu teks + satu ikon opsional
 * (Button, Alert, Text, Anchor, Input, Badge).
 */
export interface StyleState
  extends BoxStyle,
    TypographyStyle,
    InteractionStyle,
    IconStyle {
  text: string;
  /** Opsional: dipakai elemen Text untuk pilih h1-h6/p. */
  tag?: TextTag;
  /** Opsional: dipakai elemen Input untuk pilih type="text|email|...". */
  inputType?: InputType;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Warna + opacity. Hex (#rgb/#rrggbb) dikonversi ke rgba(); warna lain
 * (transparent, rgb(), nama warna) memakai color-mix() supaya tidak lagi
 * menghasilkan "rgba(NaN, NaN, NaN, …)" seperti sebelumnya.
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

/** Nilai padding per sisi (memperhitungkan mode "sama rata"). */
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

/** Baris `box-shadow: ...;` (atau string kosong). `prefix` = "shadow" / "hoverShadow" / dst. */
export function shadowLine(
  s: object,
  prefix = "shadow",
  property = "box-shadow",
): string {
  const v = shadowValue(s, prefix);
  return v ? `  ${property}: ${v};\n` : "";
}

/** Nilai box-shadow saja (tanpa nama properti) atau "" kalau nonaktif. */
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

/** text-align → justify-content (untuk flex). */
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
 * Escape untuk TEKS & NILAI ATRIBUT di semua template yang di-generate
 * (HTML, JSX, Vue, Svelte, Angular). Selain karakter HTML biasa, kurung
 * kurawal juga di-escape karena `{` memicu ekspresi di JSX/Svelte dan
 * `{{` memicu interpolasi di Vue/Angular — sebelumnya teks seperti
 * "Halo {nama}" membuat kode React hasil export error. `@` juga di-escape
 * karena memulai control-flow block di template Angular 17+ (mis. teks
 * "john@example.com" membuat template Angular gagal compile).
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
 * Escape untuk isi TEKS (bukan atribut): kutip dibiarkan apa adanya supaya
 * kode hasil export tetap enak dibaca ("Jum'at", "kata "kunci"").
 */
export function escapeText(str: string): string {
  return escapeHtml(str).replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/** Hanya izinkan URL yang aman untuk href/src (blok javascript:, data:text/html, dst). */
export function safeUrl(url: string, fallback = "#"): string {
  const u = String(url ?? "").trim();
  if (!u) return fallback;
  // eslint-disable-next-line no-control-regex -- karakter kontrol sengaja dibuang sebelum cek skema URL
  if (/^(javascript|vbscript|data):/i.test(u.replace(/[\s\u0000-\u001f]/g, "")))
    return /^data:image\//i.test(u) ? u : fallback;
  return u;
}


/** Menghasilkan CSS lengkap (base + hover + ikon) untuk elemen StyleState. */
export function generateCss(
  s: StyleState,
  className: string,
  hasIcon: boolean = false,
  /** Paksa tata letak flex walau tanpa ikon (mis. Alert dengan tombol tutup). */
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
