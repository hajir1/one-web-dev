import { CircleDot, GitCommitVertical, Palette, Share2, SeparatorHorizontal, TextQuote } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SegmentedField, SelectField, Show, TextField, ToggleField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { h, raw } from "../../helpers/markup";
import { safeUrl } from "../../helpers/generatorCss";
import i18n from "../../../../../i18n";
import { clamp, color, fieldName, parseOptions, parseSocialLinks, parseTimeline } from "./shared";
import { BRAND_ICONS, brandSvg } from "./brandIcons";

/* ================================================================== */
/* Elemen GRATIS v2: Pemisah (Divider), Textarea, Grup Radio,           */
/* Tautan Sosial, Timeline.                                             */
/*                                                                    */
/* Semua statis (h() saja) → identik di 5 framework, tanpa runtime JS.  */
/* ================================================================== */

const tr = (k: string) => i18n.t(`el.x.${k}`);
const f = (k: string) => i18n.t(`el.f.${k}`);

/* ------------------------------ Divider ----------------------------- */

export interface DividerState {
  label: string;
  lineStyle: "solid" | "dashed" | "dotted";
  thickness: number;
  color: string;
  labelColor: string;
  spacing: number;
  width: number;
}

export const dividerElement = defineElement<DividerState>({
  type: "divider",
  label: "Pemisah",
  group: "Elemen",
  componentName: "SectionDivider",
  defaultClassName: "custom-divider",
  defaults: { label: "", lineStyle: "solid", thickness: 1, color: "#cbd5e1", labelColor: "#64748b", spacing: 24, width: 100 },
  spec: (s, cls) => {
    const line = `${clamp(s.thickness, 1, 12)}px ${s.lineStyle} ${color(s.color, "#cbd5e1")}`;
    const label = s.label.trim();
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  width: ${clamp(s.width, 10, 100)}%;
  margin: ${clamp(s.spacing, 0, 120)}px auto;
  border: 0;
  ${label ? "" : `border-top: ${line};\n  height: 0;`}
  color: ${color(s.labelColor, "#64748b")};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.${cls}::before,
.${cls}::after {
  content: "";
  flex: 1;
  ${label ? `border-top: ${line};` : "display: none;"}
}
.${cls}__label {
  flex-shrink: 0;
  max-width: 70%;
  text-align: center;
}
`,
      markup: label
        ? h("div", { class: cls, role: "separator", "aria-label": label }, h("span", { class: `${cls}__label`, "aria-hidden": "true" }, label))
        : h("hr", { class: cls }),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: SeparatorHorizontal,
        content: (
          <>
            <TextField {...p} k="label" label={tr("dividerLabel")} hint={tr("dividerLabelHint")} />
            <SegmentedField
              {...p}
              k="lineStyle"
              label={tr("lineStyle")}
              options={[
                { value: "solid", label: tr("lineSolid") },
                { value: "dashed", label: tr("lineDashed") },
                { value: "dotted", label: tr("lineDotted") },
              ]}
            />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="color" label={f("lineColor")} />
            <Show when={!!s.label.trim()}>
              <ColorField {...p} k="labelColor" label={f("labelColor")} />
            </Show>
            <NumberField {...p} k="thickness" label={f("thickness")} min={1} max={12} suffix="px" />
            <NumberField {...p} k="spacing" label={tr("marginY")} min={0} max={120} suffix="px" />
            <NumberField {...p} k="width" label={tr("widthPercent")} min={10} max={100} suffix="%" />
          </>
        ),
      },
    ];
  },
});

/* ----------------------------- Textarea ----------------------------- */

export interface TextareaState {
  label: string;
  name: string;
  placeholder: string;
  rows: number;
  maxLength: number;
  required: boolean;
  helper: string;
  labelColor: string;
  borderColor: string;
  focusColor: string;
  radius: number;
  resize: "vertical" | "none";
}

export const textareaElement = defineElement<TextareaState>({
  type: "textarea",
  label: "Textarea",
  group: "Form",
  componentName: "TextArea",
  defaultClassName: "custom-textarea",
  defaults: {
    label: "Pesan",
    name: "pesan",
    placeholder: "Tulis pesan Anda di sini…",
    rows: 4,
    maxLength: 0,
    required: false,
    helper: "Kami akan membalas dalam 1×24 jam.",
    labelColor: "#1f2937",
    borderColor: "#cbd5e1",
    focusColor: "#2563eb",
    radius: 10,
    resize: "vertical",
  },
  spec: (s, cls) => {
    const id = `${cls}-input`;
    const focus = color(s.focusColor, "#2563eb");
    const max = Math.round(clamp(s.maxLength, 0, 10000));
    return {
      css: `.${cls} {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-size: 14px;
}
.${cls}__label {
  font-weight: 600;
  color: ${color(s.labelColor, "#1f2937")};
}
.${cls}__input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${color(s.borderColor, "#cbd5e1")};
  border-radius: ${clamp(s.radius, 0, 24)}px;
  background: #ffffff;
  color: #0f172a;
  font: inherit;
  line-height: 1.5;
  resize: ${s.resize === "none" ? "none" : "vertical"};
}
.${cls}__input:focus {
  outline: none;
  border-color: ${focus};
  box-shadow: 0 0 0 3px color-mix(in srgb, ${focus} 25%, transparent);
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
        h("textarea", {
          class: `${cls}__input`,
          id,
          name: fieldName(s.name, "pesan"),
          rows: Math.round(clamp(s.rows, 2, 20)),
          placeholder: s.placeholder || undefined,
          maxlength: max > 0 ? max : undefined,
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
        label: f("content"),
        icon: TextQuote,
        content: (
          <>
            <TextField {...p} k="label" label={f("labelText")} />
            <TextField {...p} k="placeholder" label={f("placeholder")} />
            <TextField {...p} k="name" label={f("nameAttrOptional")} />
            <NumberField {...p} k="rows" label={tr("textRows")} min={2} max={20} />
            <NumberField {...p} k="maxLength" label={tr("maxLength")} hint={tr("maxLengthHint")} min={0} max={10000} />
            <TextField {...p} k="helper" label={tr("helper")} />
            <ToggleField {...p} k="required" label={f("requiredField")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="labelColor" label={f("labelColor")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <ColorField {...p} k="focusColor" label={f("focus")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
            <SegmentedField {...p} k="resize" label={tr("resize")} options={[{ value: "vertical", label: tr("resizeVertical") }, { value: "none", label: tr("resizeNone") }]} />
          </>
        ),
      },
    ];
  },
});

/* ---------------------------- Radio Group --------------------------- */

export interface RadioGroupState {
  label: string;
  name: string;
  options: string[];
  selected: number;
  layout: "vertical" | "horizontal";
  required: boolean;
  labelColor: string;
  textColor: string;
  accentColor: string;
  size: number;
}

export const radioGroupElement = defineElement<RadioGroupState>({
  type: "radio-group",
  label: "Grup Radio",
  group: "Form",
  componentName: "RadioGroup",
  defaultClassName: "custom-radio",
  defaults: {
    label: "Paket yang diminati",
    name: "paket",
    options: ["Starter", "Bisnis", "Enterprise"],
    selected: 2,
    layout: "vertical",
    required: false,
    labelColor: "#1f2937",
    textColor: "#334155",
    accentColor: "#2563eb",
    size: 18,
  },
  spec: (s, cls) => {
    const opts = parseOptions(s.options);
    const sel = Math.round(s.selected);
    const name = fieldName(s.name, "pilihan");
    return {
      css: `.${cls} {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
  font-size: 14px;
}
.${cls}__legend {
  margin-bottom: 8px;
  padding: 0;
  font-weight: 600;
  color: ${color(s.labelColor, "#1f2937")};
}
.${cls}__list {
  display: flex;
  flex-direction: ${s.layout === "horizontal" ? "row" : "column"};
  flex-wrap: wrap;
  gap: ${s.layout === "horizontal" ? "10px 20px" : "10px"};
}
.${cls}__option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${color(s.textColor, "#334155")};
  cursor: pointer;
}
.${cls}__input {
  width: ${clamp(s.size, 12, 32)}px;
  height: ${clamp(s.size, 12, 32)}px;
  margin: 0;
  accent-color: ${color(s.accentColor, "#2563eb")};
  cursor: pointer;
}
.${cls}__input:focus-visible {
  outline: 2px solid ${color(s.accentColor, "#2563eb")};
  outline-offset: 2px;
}
`,
      markup: h(
        "fieldset",
        { class: cls },
        !!s.label && h("legend", { class: `${cls}__legend` }, s.label, s.required ? " *" : ""),
        h(
          "div",
          { class: `${cls}__list` },
          opts.map((o, i) =>
            h(
              "label",
              { class: `${cls}__option`, for: `${cls}-opt-${i + 1}` },
              h("input", {
                class: `${cls}__input`,
                type: "radio",
                id: `${cls}-opt-${i + 1}`,
                name,
                value: o,
                checked: i + 1 === sel,
                required: s.required && i === 0,
              }),
              h("span", {}, o),
            ),
          ),
        ),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    const count = parseOptions(s.options).length;
    return [
      {
        id: "content",
        label: f("content"),
        icon: CircleDot,
        content: (
          <>
            <TextField {...p} k="label" label={f("labelText")} />
            <LinesField {...p} k="options" label={f("optionList")} rows={5} />
            <NumberField {...p} k="selected" label={tr("defaultOption")} hint={tr("defaultOptionHint")} min={0} max={Math.max(1, count)} />
            <SegmentedField {...p} k="layout" label={f("orientation")} options={[{ value: "vertical", label: f("vertical") }, { value: "horizontal", label: f("horizontal") }]} />
            <TextField {...p} k="name" label={f("nameAttrOptional")} />
            <ToggleField {...p} k="required" label={f("requiredField")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="labelColor" label={f("labelColor")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="accentColor" label={f("accentColor")} />
            <NumberField {...p} k="size" label={f("size")} min={12} max={32} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* --------------------------- Social Links --------------------------- */

export interface SocialLinksState {
  links: string[];
  shape: "circle" | "rounded" | "square";
  size: number;
  gap: number;
  bgColor: string;
  iconColor: string;
  hoverBg: string;
  hoverColor: string;
  newTab: boolean;
  align: "left" | "center" | "right";
  /** true = latar memakai warna resmi tiap merek; false = warna latar/ikon di bawah. */
  brandColors: boolean;
}

const SHAPE_RADIUS: Record<SocialLinksState["shape"], string> = { circle: "50%", rounded: "28%", square: "4px" };

export const socialLinksElement = defineElement<SocialLinksState>({
  type: "social-links",
  label: "Tautan Sosial",
  group: "Navigasi",
  componentName: "SocialLinks",
  defaultClassName: "custom-social",
  defaults: {
    links: ["Instagram | https://instagram.com/", "Facebook | https://facebook.com/", "LinkedIn | https://linkedin.com/", "YouTube | https://youtube.com/", "GitHub | https://github.com/"],
    shape: "circle",
    size: 40,
    gap: 10,
    bgColor: "#0f172a",
    iconColor: "#ffffff",
    hoverBg: "#2563eb",
    hoverColor: "#ffffff",
    newTab: true,
    align: "left",
    brandColors: true,
  },
  spec: (s, cls) => {
    const links = parseSocialLinks(s.links);
    const size = clamp(s.size, 24, 72);
    const used = [...new Set(links.map((l) => l.icon).filter((k): k is string => !!k))];
    const brandCss = s.brandColors
      ? used.map((k) => `.${cls}__link--${k} {\n  background: #${BRAND_ICONS[k].hex};\n  color: #ffffff;\n}`).join("\n") +
        `\n.${cls}__link[class*="--"]:hover,\n.${cls}__link[class*="--"]:focus-visible {\n  filter: brightness(1.12);\n}\n`
      : "";
    return {
      css: `.${cls} {
  display: flex;
  flex-wrap: wrap;
  justify-content: ${s.align === "center" ? "center" : s.align === "right" ? "flex-end" : "flex-start"};
  gap: ${clamp(s.gap, 0, 40)}px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${cls}__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${size}px;
  height: ${size}px;
  border-radius: ${SHAPE_RADIUS[s.shape] ?? "50%"};
  background: ${color(s.bgColor, "#0f172a")};
  color: ${color(s.iconColor, "#ffffff")};
  font-size: ${Math.round(size * 0.36)}px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.${cls}__link:hover,
.${cls}__link:focus-visible {
  background: ${color(s.hoverBg, "#2563eb")};
  color: ${color(s.hoverColor, "#ffffff")};
  transform: translateY(-2px);
}
.${cls}__link:focus-visible {
  outline: 2px solid ${color(s.hoverBg, "#2563eb")};
  outline-offset: 3px;
}
.${cls}__link svg {
  width: ${Math.round(size * 0.48)}px;
  height: ${Math.round(size * 0.48)}px;
  display: block;
}
${brandCss}@media (prefers-reduced-motion: reduce) {
  .${cls}__link { transition: none; }
  .${cls}__link:hover, .${cls}__link:focus-visible { transform: none; }
}
`,
      markup: h(
        "ul",
        { class: cls, "aria-label": "Media sosial" },
        links.map((l) =>
          h(
            "li",
            {},
            h(
              "a",
              {
                class: l.icon && s.brandColors ? `${cls}__link ${cls}__link--${l.icon}` : `${cls}__link`,
                href: safeUrl(l.href),
                "aria-label": l.name,
                title: l.name,
                target: s.newTab ? "_blank" : undefined,
                rel: s.newTab ? "noopener noreferrer" : undefined,
              },
              l.icon ? h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, raw(brandSvg(l.icon, Math.round(size * 0.48)))) : h("span", { "aria-hidden": "true" }, l.glyph),
            ),
          ),
        ),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Share2,
        content: (
          <>
            <LinesField {...p} k="links" label={tr("socialLinks")} hint={tr("socialLinksHint")} rows={6} />
            <ToggleField {...p} k="newTab" label={tr("openNewTab")} />
            <ToggleField {...p} k="brandColors" label={tr("brandColors")} />
            <SegmentedField
              {...p}
              k="align"
              label={f("alignment")}
              options={[
                { value: "left", label: f("left") },
                { value: "center", label: f("center") },
                { value: "right", label: f("right") },
              ]}
            />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <SelectField
              {...p}
              k="shape"
              label={tr("shape")}
              options={[
                { value: "circle", label: tr("shapeCircle") },
                { value: "rounded", label: tr("shapeRounded") },
                { value: "square", label: tr("shapeSquare") },
              ]}
            />
            <NumberField {...p} k="size" label={f("size")} min={24} max={72} suffix="px" />
            <NumberField {...p} k="gap" label={f("spacing")} min={0} max={40} suffix="px" />
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <ColorField {...p} k="iconColor" label={f("iconColor")} />
            <ColorField {...p} k="hoverBg" label={f("bgOnHover")} />
            <ColorField {...p} k="hoverColor" label={f("hoverColor")} />
          </>
        ),
      },
    ];
  },
});

/* ------------------------------ Timeline ---------------------------- */

export interface TimelineState {
  items: string[];
  accentColor: string;
  lineColor: string;
  dateColor: string;
  titleColor: string;
  textColor: string;
  dotSize: number;
}

export const timelineElement = defineElement<TimelineState>({
  type: "timeline",
  label: "Timeline",
  group: "Data",
  componentName: "Timeline",
  defaultClassName: "custom-timeline",
  defaults: {
    items: [
      "Jan 2024 | Ide lahir | Tim kecil mulai membangun prototipe pertama.",
      "Jun 2024 | Rilis beta | 500 pengguna awal mencoba dan memberi masukan.",
      "Mar 2025 | Pendanaan awal | Bergabung dengan program akselerator.",
      "2026 | Ekspansi regional | Hadir di 5 negara Asia Tenggara.",
    ],
    accentColor: "#2563eb",
    lineColor: "#e2e8f0",
    dateColor: "#2563eb",
    titleColor: "#0f172a",
    textColor: "#475569",
    dotSize: 14,
  },
  spec: (s, cls) => {
    const items = parseTimeline(s.items);
    const dot = clamp(s.dotSize, 8, 28);
    const accent = color(s.accentColor, "#2563eb");
    return {
      css: `.${cls} {
  position: relative;
  margin: 0;
  padding: 0 0 0 ${dot + 18}px;
  list-style: none;
}
.${cls}::before {
  content: "";
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: ${Math.round(dot / 2) - 1}px;
  width: 2px;
  background: ${color(s.lineColor, "#e2e8f0")};
}
.${cls}__item {
  position: relative;
  padding-bottom: 28px;
}
.${cls}__item:last-child {
  padding-bottom: 0;
}
.${cls}__item::before {
  content: "";
  position: absolute;
  top: 4px;
  left: -${dot + 18}px;
  box-sizing: border-box;
  width: ${dot}px;
  height: ${dot}px;
  border: 3px solid ${accent};
  border-radius: 50%;
  background: #ffffff;
}
.${cls}__date {
  display: block;
  margin-bottom: 2px;
  color: ${color(s.dateColor, "#2563eb")};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.${cls}__title {
  margin: 0;
  color: ${color(s.titleColor, "#0f172a")};
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
}
.${cls}__text {
  margin: 4px 0 0;
  color: ${color(s.textColor, "#475569")};
  font-size: 14px;
  line-height: 1.6;
}
`,
      markup: h(
        "ol",
        { class: cls },
        items.map((it) =>
          h(
            "li",
            { class: `${cls}__item` },
            !!it.date && h("span", { class: `${cls}__date` }, it.date),
            h("h3", { class: `${cls}__title` }, it.title),
            !!it.text && h("p", { class: `${cls}__text` }, it.text),
          ),
        ),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: GitCommitVertical,
        content: <LinesField {...p} k="items" label={tr("timelineItems")} hint={tr("timelineItemsHint")} rows={7} />,
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="accentColor" label={f("accentColor")} />
            <ColorField {...p} k="lineColor" label={f("lineColor")} />
            <ColorField {...p} k="dateColor" label={tr("dateColor")} />
            <ColorField {...p} k="titleColor" label={f("titleColor")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <NumberField {...p} k="dotSize" label={f("dotSize")} min={8} max={28} suffix="px" />
          </>
        ),
      },
    ];
  },
});
