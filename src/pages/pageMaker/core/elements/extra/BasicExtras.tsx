import { CalendarDays, ClipboardCopy, Info, Loader, Megaphone, Palette, PlayCircle, Star } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, NumberField, RangeField, SegmentedField, SelectField, Show, TextField, ToggleField, ImageField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { h } from "../../helpers/markup";
import { safeUrl } from "../../helpers/generatorCss";
import i18n from "../../../../../i18n";
import { clamp, color, safeVideoFile, seconds, vimeoId, youtubeId } from "./shared";

/* ================================================================== */
/* Elemen GRATIS tambahan: Banner, Spinner, Rating, Tooltip, Video,     */
/* Date Picker, Clipboard.                                              */
/*                                                                    */
/* Semua markup memakai h() sehingga sama di 5 framework. Interaksi     */
/* kecil (tutup banner, salin teks) memakai `customCode` → runtime       */
/* Custom JS yang sama dengan pengaturan Lanjutan (jalan di Pratinjau &  */
/* hasil ekspor, tidak di canvas Desain).                               */
/* ================================================================== */

const tr = (k: string) => i18n.t(`el.x.${k}`);

/* ------------------------------ Banner ------------------------------ */

export interface BannerState {
  badge: string;
  text: string;
  linkText: string;
  href: string;
  align: "left" | "center";
  dismissible: boolean;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  linkColor: string;
  radius: number;
  paddingY: number;
}

export const bannerElement = defineElement<BannerState>({
  type: "banner",
  label: "Banner",
  group: "Elemen",
  componentName: "AnnouncementBanner",
  defaultClassName: "custom-banner",
  defaults: {
    badge: "Baru",
    text: "Fitur kolaborasi tim kini tersedia untuk semua paket.",
    linkText: "Lihat detail",
    href: "#",
    align: "center",
    dismissible: true,
    bgColor: "#1e3a8a",
    textColor: "#ffffff",
    badgeBg: "#facc15",
    badgeText: "#1e3a8a",
    linkColor: "#bfdbfe",
    radius: 12,
    paddingY: 12,
  },
  spec: (s, cls) => ({
    css: `.${cls} {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: ${s.align === "center" ? "center" : "flex-start"};
  gap: 8px 12px;
  width: 100%;
  padding: ${clamp(s.paddingY, 4, 48)}px ${s.dismissible ? 48 : 16}px ${clamp(s.paddingY, 4, 48)}px 16px;
  border-radius: ${clamp(s.radius, 0, 40)}px;
  background: ${color(s.bgColor, "#1e3a8a")};
  color: ${color(s.textColor, "#ffffff")};
  font-size: 14px;
  line-height: 1.5;
  text-align: ${s.align};
}
.${cls}__badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: ${color(s.badgeBg, "#facc15")};
  color: ${color(s.badgeText, "#1e3a8a")};
  font-size: 12px;
  font-weight: 700;
}
.${cls}__link {
  color: ${color(s.linkColor, "#bfdbfe")};
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.${cls}__close {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}
.${cls}__close:hover,
.${cls}__close:focus-visible {
  background: rgba(255, 255, 255, 0.15);
}
.${cls}[hidden] {
  display: none;
}
`,
    markup: h(
      "div",
      { class: cls, role: "region", "aria-label": s.badge || "Pengumuman" },
      !!s.badge && h("span", { class: `${cls}__badge` }, s.badge),
      h("span", { class: `${cls}__text` }, s.text),
      !!s.linkText && h("a", { class: `${cls}__link`, href: safeUrl(s.href) }, s.linkText),
      s.dismissible && h("button", { class: `${cls}__close`, type: "button", "aria-label": "Tutup pengumuman", "data-banner-close": "" }, "×"),
    ),
  }),
  customCode: (s) =>
    s.dismissible
      ? {
          js: `var btn = element.querySelector("[data-banner-close]");
on(btn, "click", function () {
  element.hidden = true;
});`,
        }
      : {},
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Megaphone,
        content: (
          <>
            <TextField {...p} k="badge" label={i18n.t("el.f.badgeText")} />
            <TextField {...p} k="text" label={i18n.t("el.f.text")} multiline rows={2} />
            <TextField {...p} k="linkText" label={tr("linkText")} />
            <TextField {...p} k="href" label={i18n.t("el.f.hrefLabel")} />
            <SegmentedField {...p} k="align" label={i18n.t("el.f.alignment")} options={[{ value: "left", label: i18n.t("el.f.left") }, { value: "center", label: i18n.t("el.f.center") }]} />
            <ToggleField {...p} k="dismissible" label={i18n.t("el.f.showCloseButton")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="bgColor" label={i18n.t("el.f.bg")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <ColorField {...p} k="badgeBg" label={tr("badgeBg")} />
            <ColorField {...p} k="badgeText" label={tr("badgeColor")} />
            <ColorField {...p} k="linkColor" label={i18n.t("el.f.linkColor")} />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={40} suffix="px" />
            <NumberField {...p} k="paddingY" label={tr("paddingY")} min={4} max={48} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ------------------------------ Spinner ----------------------------- */

export interface SpinnerState {
  variant: "ring" | "dots" | "bars";
  size: number;
  color: string;
  trackColor: string;
  speed: number;
  label: string;
  showLabel: boolean;
}

export const spinnerElement = defineElement<SpinnerState>({
  type: "spinner",
  label: "Spinner",
  group: "Elemen",
  componentName: "Spinner",
  defaultClassName: "custom-spinner",
  defaults: { variant: "ring", size: 40, color: "#2563eb", trackColor: "#dbeafe", speed: 0.9, label: "Memuat…", showLabel: true },
  spec: (s, cls) => {
    const size = clamp(s.size, 12, 160);
    const c = color(s.color, "#2563eb");
    const dur = seconds(s.speed, 0.3, 4);
    const shape =
      s.variant === "ring"
        ? `.${cls}__shape {
  width: ${size}px;
  height: ${size}px;
  border: ${Math.max(3, Math.round(size / 9))}px solid ${color(s.trackColor, "#dbeafe")};
  border-top-color: ${c};
  border-radius: 50%;
  animation: ${cls}-spin ${dur} linear infinite;
}`
        : `.${cls}__shape {
  display: flex;
  align-items: ${s.variant === "bars" ? "stretch" : "center"};
  gap: ${Math.round(size / 8)}px;
  height: ${size}px;
}
.${cls}__shape span {
  width: ${Math.round(size / (s.variant === "bars" ? 6 : 4))}px;
  ${s.variant === "dots" ? `height: ${Math.round(size / 4)}px;\n  border-radius: 50%;` : "border-radius: 3px;"}
  background: ${c};
  animation: ${cls}-pulse ${dur} ease-in-out infinite;
}
.${cls}__shape span:nth-child(2) { animation-delay: calc(${dur} / 6); }
.${cls}__shape span:nth-child(3) { animation-delay: calc(${dur} / 3); }`;
    return {
      css: `.${cls} {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: ${c};
  font-size: 14px;
  font-weight: 600;
}
${shape}
@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}
@keyframes ${cls}-pulse {
  0%, 100% { opacity: 0.25; transform: scale(0.75); }
  50% { opacity: 1; transform: scale(1); }
}
.${cls}__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__shape, .${cls}__shape span { animation-duration: ${dur}; animation-iteration-count: 3; }
}
`,
      markup: h(
        "div",
        { class: cls, role: "status", "aria-live": "polite" },
        h("span", { class: `${cls}__shape`, "aria-hidden": "true" }, s.variant === "ring" ? [] : [h("span"), h("span"), h("span")]),
        h("span", { class: s.showLabel ? `${cls}__label` : `${cls}__sr` }, s.label || "Memuat"),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Loader,
        content: (
          <>
            <SegmentedField {...p} k="variant" label={i18n.t("el.f.variant")} options={[{ value: "ring", label: tr("ring") }, { value: "dots", label: tr("dots") }, { value: "bars", label: tr("bars") }]} />
            <TextField {...p} k="label" label={i18n.t("el.f.label")} hint={tr("spinnerLabelHint")} />
            <ToggleField {...p} k="showLabel" label={i18n.t("el.f.showLabel")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="color" label={i18n.t("el.f.color")} />
            <Show when={s.variant === "ring"}>
              <ColorField {...p} k="trackColor" label={i18n.t("el.f.trackColor")} />
            </Show>
            <NumberField {...p} k="size" label={i18n.t("el.f.size")} min={12} max={160} suffix="px" />
            <RangeField {...p} k="speed" label={tr("speed")} min={0.3} max={4} step={0.1} format={(v) => `${v}s`} />
          </>
        ),
      },
    ];
  },
});

/* ------------------------------ Rating ------------------------------ */

export interface RatingState {
  value: number;
  max: number;
  size: number;
  color: string;
  emptyColor: string;
  showValue: boolean;
  caption: string;
  textColor: string;
}

export const ratingElement = defineElement<RatingState>({
  type: "rating",
  label: "Rating",
  group: "Data",
  componentName: "StarRating",
  defaultClassName: "custom-rating",
  defaults: { value: 4.5, max: 5, size: 22, color: "#f59e0b", emptyColor: "#e5e7eb", showValue: true, caption: "dari 128 ulasan", textColor: "#334155" },
  spec: (s, cls) => {
    const max = Math.round(clamp(s.max, 1, 10));
    const value = Math.round(clamp(s.value, 0, max) * 2) / 2;
    const stars = "★".repeat(max);
    return {
      css: `.${cls} {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: ${color(s.textColor, "#334155")};
  font-size: 14px;
}
.${cls}__stars {
  position: relative;
  display: inline-block;
  font-size: ${clamp(s.size, 10, 64)}px;
  line-height: 1;
  letter-spacing: 2px;
  color: ${color(s.emptyColor, "#e5e7eb")};
}
.${cls}__fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: ${(value / max) * 100}%;
  overflow: hidden;
  white-space: nowrap;
  color: ${color(s.color, "#f59e0b")};
}
.${cls}__value {
  font-weight: 700;
}
`,
      markup: h(
        "div",
        { class: cls, role: "img", "aria-label": `${value} / ${max}${s.caption ? ` ${s.caption}` : ""}` },
        h("span", { class: `${cls}__stars`, "aria-hidden": "true" }, stars, h("span", { class: `${cls}__fill` }, stars)),
        s.showValue && h("span", { class: `${cls}__value`, "aria-hidden": "true" }, String(value).replace(".", i18n.language?.startsWith("en") ? "." : ",")),
        !!s.caption && h("span", { class: `${cls}__caption`, "aria-hidden": "true" }, s.caption),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Star,
        content: (
          <>
            <RangeField {...p} k="value" label={i18n.t("el.f.ratingValue")} min={0} max={clamp(s.max, 1, 10)} step={0.5} />
            <NumberField {...p} k="max" label={tr("maxStars")} min={1} max={10} />
            <ToggleField {...p} k="showValue" label={tr("showValue")} />
            <TextField {...p} k="caption" label={tr("caption")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="color" label={i18n.t("el.f.starColor")} />
            <ColorField {...p} k="emptyColor" label={tr("emptyStar")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <NumberField {...p} k="size" label={i18n.t("el.f.size")} min={10} max={64} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ------------------------------ Tooltip ----------------------------- */

export interface TooltipState {
  trigger: string;
  tip: string;
  position: "top" | "bottom" | "left" | "right";
  triggerColor: string;
  bgColor: string;
  textColor: string;
  maxWidth: number;
}

const TIP_POS: Record<TooltipState["position"], string> = {
  top: "bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px);",
  bottom: "top: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(-4px);",
  left: "right: calc(100% + 8px); top: 50%; transform: translateY(-50%) translateX(4px);",
  right: "left: calc(100% + 8px); top: 50%; transform: translateY(-50%) translateX(-4px);",
};
const TIP_SHOW: Record<TooltipState["position"], string> = {
  top: "translateX(-50%) translateY(0)",
  bottom: "translateX(-50%) translateY(0)",
  left: "translateY(-50%) translateX(0)",
  right: "translateY(-50%) translateX(0)",
};

export const tooltipElement = defineElement<TooltipState>({
  type: "tooltip",
  label: "Tooltip",
  group: "Elemen",
  componentName: "Tooltip",
  defaultClassName: "custom-tooltip",
  defaults: { trigger: "Apa itu kredit?", tip: "Kredit dipakai untuk membuka template dan fitur premium.", position: "top", triggerColor: "#1d4ed8", bgColor: "#0f172a", textColor: "#ffffff", maxWidth: 240 },
  spec: (s, cls) => ({
    css: `.${cls} {
  position: relative;
  display: inline-block;
}
.${cls}__trigger {
  padding: 0;
  border: 0;
  background: none;
  color: ${color(s.triggerColor, "#1d4ed8")};
  font: inherit;
  font-weight: 600;
  text-decoration: underline dotted;
  text-underline-offset: 4px;
  cursor: help;
}
.${cls}__tip {
  position: absolute;
  z-index: 20;
  ${TIP_POS[s.position]}
  width: max-content;
  max-width: ${clamp(s.maxWidth, 120, 480)}px;
  padding: 8px 10px;
  border-radius: 8px;
  background: ${color(s.bgColor, "#0f172a")};
  color: ${color(s.textColor, "#ffffff")};
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  text-align: left;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
}
.${cls}:hover .${cls}__tip,
.${cls}:focus-within .${cls}__tip {
  opacity: 1;
  visibility: visible;
  transform: ${TIP_SHOW[s.position]};
}
@media (max-width: 480px) {
  .${cls}__tip { max-width: 70vw; }
}
`,
    markup: h(
      "span",
      { class: cls },
      h("button", { class: `${cls}__trigger`, type: "button", "aria-describedby": `${cls}-tip` }, s.trigger),
      h("span", { class: `${cls}__tip`, role: "tooltip", id: `${cls}-tip` }, s.tip),
    ),
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Info,
        content: (
          <>
            <TextField {...p} k="trigger" label={tr("trigger")} />
            <TextField {...p} k="tip" label={tr("tipText")} multiline rows={3} />
            <SegmentedField
              {...p}
              k="position"
              label={i18n.t("el.f.position")}
              options={(["top", "bottom", "left", "right"] as const).map((v) => ({ value: v, label: tr(`pos.${v}`) }))}
            />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="triggerColor" label={tr("triggerColor")} />
            <ColorField {...p} k="bgColor" label={i18n.t("el.f.bg")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <NumberField {...p} k="maxWidth" label={tr("maxWidth")} min={120} max={480} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ------------------------------- Video ------------------------------ */

export interface VideoState {
  source: "youtube" | "vimeo" | "file";
  url: string;
  title: string;
  ratio: "16 / 9" | "4 / 3" | "1 / 1" | "9 / 16" | "21 / 9";
  radius: number;
  autoplay: boolean;
  controls: boolean;
  shadow: boolean;
  poster: string;
}

/** URL embed yang aman (null = URL tidak dikenali). */
function videoEmbedUrl(s: Pick<VideoState, "source" | "url" | "autoplay" | "controls">): string | null {
  if (s.source === "youtube") {
    const id = youtubeId(s.url);
    if (!id) return null;
    const q = [s.autoplay ? "autoplay=1&mute=1" : "", s.controls ? "" : "controls=0", "rel=0"].filter(Boolean).join("&");
    return `https://www.youtube-nocookie.com/embed/${id}?${q}`;
  }
  if (s.source === "vimeo") {
    const id = vimeoId(s.url);
    if (!id) return null;
    const q = [s.autoplay ? "autoplay=1&muted=1" : "", s.controls ? "" : "controls=0", "dnt=1"].filter(Boolean).join("&");
    return `https://player.vimeo.com/video/${id}?${q}`;
  }
  return safeVideoFile(s.url);
}

export const videoElement = defineElement<VideoState>({
  type: "video",
  label: "Video",
  group: "Elemen",
  componentName: "VideoEmbed",
  defaultClassName: "custom-video",
  defaults: { source: "youtube", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", title: "Video produk", ratio: "16 / 9", radius: 16, autoplay: false, controls: true, shadow: true, poster: "" },
  spec: (s, cls) => {
    const src = videoEmbedUrl(s);
    const css = `.${cls} {
  position: relative;
  width: 100%;
  aspect-ratio: ${s.ratio};
  overflow: hidden;
  border-radius: ${clamp(s.radius, 0, 48)}px;
  background: #0f172a;
  ${s.shadow ? "box-shadow: 0 20px 45px -20px rgba(15, 23, 42, 0.45);" : ""}
}
.${cls}__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: cover;
}
.${cls}__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #cbd5e1;
  font-size: 14px;
  text-align: center;
}
`;
    if (!src) return { css, markup: h("div", { class: cls }, h("p", { class: `${cls}__empty` }, "URL video belum valid.")) };
    const media =
      s.source === "file"
        ? h("video", {
            class: `${cls}__media`,
            src,
            title: s.title,
            controls: s.controls,
            "html:muted": s.autoplay,
            "jsx:muted": s.autoplay,
            "html:autoplay": s.autoplay,
            "jsx:autoPlay": s.autoplay,
            "html:playsinline": true,
            "jsx:playsInline": true,
            "html:preload": "metadata",
            "jsx:preload": "metadata",
            poster: s.poster ? safeUrl(s.poster, "") || undefined : undefined,
          })
        : h("iframe", {
            class: `${cls}__media`,
            src,
            title: s.title || "Video",
            loading: "lazy",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            "html:allowfullscreen": true,
            "jsx:allowFullScreen": true,
            "html:referrerpolicy": "strict-origin-when-cross-origin",
            "jsx:referrerPolicy": "strict-origin-when-cross-origin",
          });
    return { css, markup: h("div", { class: cls }, media) };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: PlayCircle,
        content: (
          <>
            <SegmentedField {...p} k="source" label={tr("videoSource")} options={[{ value: "youtube", label: "YouTube" }, { value: "vimeo", label: "Vimeo" }, { value: "file", label: tr("videoFile") }]} />
            <TextField {...p} k="url" label={tr("videoUrl")} hint={videoEmbedUrl(s) ? undefined : tr("videoInvalid")} />
            <TextField {...p} k="title" label={tr("videoTitle")} hint={tr("videoTitleHint")} />
            <Show when={s.source === "file"}>
              <ImageField {...p} k="poster" label={tr("poster")} />
            </Show>
            <ToggleField {...p} k="autoplay" label={tr("autoplayMuted")} />
            <ToggleField {...p} k="controls" label={tr("controls")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <SelectField
              {...p}
              k="ratio"
              label={i18n.t("el.f.aspectRatio")}
              options={[
                { value: "16 / 9", label: "16:9" },
                { value: "4 / 3", label: "4:3" },
                { value: "1 / 1", label: "1:1" },
                { value: "9 / 16", label: "9:16" },
                { value: "21 / 9", label: "21:9" },
              ]}
            />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={48} suffix="px" />
            <ToggleField {...p} k="shadow" label={i18n.t("el.f.shadow")} />
          </>
        ),
      },
    ];
  },
});

/* ---------------------------- Date Picker --------------------------- */

export interface DatePickerState {
  label: string;
  name: string;
  mode: "date" | "datetime-local" | "time" | "month";
  min: string;
  max: string;
  required: boolean;
  helper: string;
  labelColor: string;
  borderColor: string;
  focusColor: string;
  radius: number;
  fullWidth: boolean;
}

export const datePickerElement = defineElement<DatePickerState>({
  type: "datepicker",
  label: "Date Picker",
  group: "Form",
  componentName: "DatePicker",
  defaultClassName: "custom-datepicker",
  defaults: { label: "Tanggal kunjungan", name: "tanggal", mode: "date", min: "", max: "", required: true, helper: "Pilih tanggal yang tersedia.", labelColor: "#1f2937", borderColor: "#cbd5e1", focusColor: "#2563eb", radius: 10, fullWidth: true },
  spec: (s, cls) => {
    const id = `${cls}-input`;
    const valid = (v: string) => (/^[\d:T-]{4,16}$/.test(v) ? v : undefined);
    return {
      css: `.${cls} {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${s.fullWidth ? "100%" : "auto"};
  max-width: 100%;
  font-size: 14px;
}
.${cls}__label {
  font-weight: 600;
  color: ${color(s.labelColor, "#1f2937")};
}
.${cls}__input {
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid ${color(s.borderColor, "#cbd5e1")};
  border-radius: ${clamp(s.radius, 0, 24)}px;
  background: #ffffff;
  color: #0f172a;
  font: inherit;
}
.${cls}__input:focus {
  outline: none;
  border-color: ${color(s.focusColor, "#2563eb")};
  box-shadow: 0 0 0 3px color-mix(in srgb, ${color(s.focusColor, "#2563eb")} 25%, transparent);
}
.${cls}__help {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}
`,
      markup: h(
        "div",
        { class: cls },
        h("label", { class: `${cls}__label`, for: id }, s.label, s.required ? " *" : ""),
        h("input", {
          class: `${cls}__input`,
          id,
          type: s.mode,
          name: s.name.replace(/[^\w-]/g, "") || "tanggal",
          min: valid(s.min),
          max: valid(s.max),
          required: s.required,
          "aria-describedby": s.helper ? `${cls}-help` : undefined,
        }),
        !!s.helper && h("p", { class: `${cls}__help`, id: `${cls}-help` }, s.helper),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: CalendarDays,
        content: (
          <>
            <TextField {...p} k="label" label={i18n.t("el.f.labelText")} />
            <SelectField
              {...p}
              k="mode"
              label={tr("dateMode")}
              options={[
                { value: "date", label: tr("modeDate") },
                { value: "datetime-local", label: tr("modeDateTime") },
                { value: "time", label: tr("modeTime") },
                { value: "month", label: tr("modeMonth") },
              ]}
            />
            <TextField {...p} k="name" label={i18n.t("el.f.nameAttrOptional")} />
            <TextField {...p} k="min" label={tr("minValue")} placeholder="2026-01-01" />
            <TextField {...p} k="max" label={tr("maxValue")} placeholder="2026-12-31" />
            <TextField {...p} k="helper" label={tr("helper")} />
            <ToggleField {...p} k="required" label={i18n.t("el.f.requiredField")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="labelColor" label={i18n.t("el.f.labelColor")} />
            <ColorField {...p} k="borderColor" label={i18n.t("el.f.border")} />
            <ColorField {...p} k="focusColor" label={i18n.t("el.f.focus")} />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={24} suffix="px" />
            <ToggleField {...p} k="fullWidth" label={i18n.t("el.f.full")} />
          </>
        ),
      },
    ];
  },
});

/* ----------------------------- Clipboard ---------------------------- */

export interface ClipboardState {
  label: string;
  value: string;
  buttonText: string;
  copiedText: string;
  bgColor: string;
  textColor: string;
  buttonBg: string;
  buttonColor: string;
  radius: number;
}

export const clipboardElement = defineElement<ClipboardState>({
  type: "clipboard",
  label: "Clipboard",
  group: "Data",
  componentName: "CopyToClipboard",
  defaultClassName: "custom-clipboard",
  defaults: { label: "Instalasi", value: "npm install onewebdev-ui", buttonText: "Salin", copiedText: "Tersalin!", bgColor: "#0f172a", textColor: "#e2e8f0", buttonBg: "#2563eb", buttonColor: "#ffffff", radius: 12 },
  spec: (s, cls) => ({
    css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}
.${cls}__label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
.${cls}__box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 14px;
  border-radius: ${clamp(s.radius, 0, 24)}px;
  background: ${color(s.bgColor, "#0f172a")};
}
.${cls}__value {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  color: ${color(s.textColor, "#e2e8f0")};
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 14px;
  white-space: nowrap;
}
.${cls}__btn {
  flex-shrink: 0;
  min-width: 76px;
  padding: 8px 12px;
  border: 0;
  border-radius: ${Math.max(0, clamp(s.radius, 0, 24) - 4)}px;
  background: ${color(s.buttonBg, "#2563eb")};
  color: ${color(s.buttonColor, "#ffffff")};
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.${cls}__btn:focus-visible {
  outline: 2px solid ${color(s.buttonBg, "#2563eb")};
  outline-offset: 2px;
}
`,
    markup: h(
      "div",
      { class: cls },
      !!s.label && h("span", { class: `${cls}__label` }, s.label),
      h(
        "div",
        { class: `${cls}__box` },
        h("code", { class: `${cls}__value`, "data-copy-value": "" }, s.value),
        h("button", { class: `${cls}__btn`, type: "button", "data-copy-btn": "", "data-copied": s.copiedText || "OK", "aria-live": "polite" }, s.buttonText || "Salin"),
      ),
    ),
  }),
  customCode: () => ({
    js: `var btn = element.querySelector("[data-copy-btn]");
var source = element.querySelector("[data-copy-value]");
var original = btn ? btn.textContent : "";
var timer = null;
function done(ok) {
  btn.textContent = ok ? btn.getAttribute("data-copied") : original;
  clearTimeout(timer);
  timer = setTimeout(function () { btn.textContent = original; }, 1600);
}
on(btn, "click", function () {
  var text = source ? source.textContent : "";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallback(text)); });
  } else done(fallback(text));
});
function fallback(text) {
  var area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  var ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
  document.body.removeChild(area);
  return ok;
}
onCleanup(function () { clearTimeout(timer); });`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: ClipboardCopy,
        content: (
          <>
            <TextField {...p} k="label" label={i18n.t("el.f.label")} />
            <TextField {...p} k="value" label={tr("copyValue")} multiline rows={2} />
            <TextField {...p} k="buttonText" label={i18n.t("el.f.buttonText")} />
            <TextField {...p} k="copiedText" label={tr("copiedText")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="bgColor" label={i18n.t("el.f.bg")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <ColorField {...p} k="buttonBg" label={tr("buttonBg")} />
            <ColorField {...p} k="buttonColor" label={tr("buttonColor")} />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});
