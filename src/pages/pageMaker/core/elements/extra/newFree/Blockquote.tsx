import {    Palette, Quote } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField, SegmentedField,  Show, TextField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color } from "../shared";
import { tr, f } from "./kit";

/* ------------------------------ Kutipan ----------------------------- */

export interface BlockquoteState {
  quote: string;
  author: string;
  role: string;
  variant: "bar" | "card" | "large";
  accentColor: string;
  textColor: string;
  bgColor: string;
  fontSize: number;
  align: "left" | "center";
}

export const blockquoteElement = defineElement<BlockquoteState>({
  type: "blockquote",
  label: "Kutipan",
  group: "Elemen",
  componentName: "Blockquote",
  defaultClassName: "custom-quote",
  defaults: {
    quote: "Desain yang baik itu jujur. Ia tidak membuat produk tampak lebih hebat dari kenyataannya.",
    author: "Dieter Rams",
    role: "Desainer industri",
    variant: "bar",
    accentColor: "#2563eb",
    textColor: "#0f172a",
    bgColor: "#f8fafc",
    fontSize: 22,
    align: "left",
  },
  spec: (s, cls) => {
    const accent = color(s.accentColor, "#2563eb");
    const size = clamp(s.fontSize, 14, 48);
    const box =
      s.variant === "bar"
        ? `padding: 4px 0 4px 22px;\n  border-left: 4px solid ${accent};`
        : s.variant === "card"
          ? `padding: 28px 28px 24px;\n  border-radius: 16px;\n  background: ${color(s.bgColor, "#f8fafc")};`
          : "padding: 0;";
    return {
      css: `.${cls} {
  box-sizing: border-box;
  position: relative;
  margin: 0;
  ${box}
  color: ${color(s.textColor, "#0f172a")};
  text-align: ${s.align === "center" ? "center" : "left"};
}
.${cls}__mark {
  display: ${s.variant === "bar" ? "none" : "block"};
  height: ${Math.round(size * 1.4)}px;
  color: ${accent};
  font-family: Georgia, "Times New Roman", serif;
  font-size: ${Math.round(size * (s.variant === "large" ? 4 : 2.6))}px;
  line-height: 1;
}
.${cls}__text {
  margin: 0;
  font-size: ${s.variant === "large" ? Math.round(size * 1.3) : size}px;
  font-weight: ${s.variant === "large" ? 700 : 500};
  line-height: 1.45;
}
.${cls}__cite {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 14px;
  font-size: 14px;
}
.${cls}__author {
  font-style: normal;
  font-weight: 700;
}
.${cls}__role {
  opacity: 0.65;
}
`,
      markup: h(
        "figure",
        { class: cls },
        h("span", { class: `${cls}__mark`, "aria-hidden": "true" }, "“"),
        h("blockquote", { class: `${cls}__text` }, s.quote),
        (!!s.author || !!s.role) &&
          h("figcaption", { class: `${cls}__cite` }, !!s.author && h("cite", { class: `${cls}__author` }, s.author), !!s.role && h("span", { class: `${cls}__role` }, s.role)),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Quote,
        content: (
          <>
            <TextField {...p} k="quote" label={f("quote")} multiline rows={4} />
            <TextField {...p} k="author" label={f("name")} />
            <TextField {...p} k="role" label={tr("role")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <SegmentedField {...p} k="variant" label={f("variant")} options={[{ value: "bar", label: tr("bar") }, { value: "card", label: tr("card") }, { value: "large", label: tr("large") }]} />
            <SegmentedField {...p} k="align" label={f("alignment")} options={[{ value: "left", label: f("left") }, { value: "center", label: f("center") }]} />
            <NumberField {...p} k="fontSize" label={f("textSize")} min={14} max={48} suffix="px" />
            <ColorField {...p} k="accentColor" label={f("accentColor")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <Show when={s.variant === "card"}>
              <ColorField {...p} k="bgColor" label={f("bg")} />
            </Show>
          </>
        ),
      },
    ];
  },
});
