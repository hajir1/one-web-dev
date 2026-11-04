import {    Palette,   SlidersHorizontal } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField, LinesField, NumberField,    TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color, fieldName,     parseOptions } from "../shared";
import { tr, f, SR_ONLY, focusCss } from "./kit";

/* --------------------------- Segmented Buttons -------------------------- */

export interface SegmentedState {
  label: string;
  name: string;
  options: string[];
  selected: number;
  fullWidth: boolean;
  accentColor: string;
  activeText: string;
  bgColor: string;
  textColor: string;
  radius: number;
}

export const segmentedElement = defineElement<SegmentedState>({
  type: "segmented",
  label: "Tombol Segmen",
  group: "Form",
  componentName: "SegmentedControl",
  defaultClassName: "custom-segmented",
  defaults: {
    label: "Periode tagihan",
    name: "periode",
    options: ["Bulanan", "Tahunan", "Seumur hidup"],
    selected: 1,
    fullWidth: false,
    accentColor: "#2563eb",
    activeText: "#ffffff",
    bgColor: "#f1f5f9",
    textColor: "#334155",
    radius: 10,
  },
  spec: (s, cls) => {
    const opts = parseOptions(s.options).slice(0, 6);
    const sel = Math.round(clamp(s.selected, 1, Math.max(1, opts.length)));
    const name = fieldName(s.name, "pilihan");
    const accent = color(s.accentColor, "#2563eb");
    const r = clamp(s.radius, 0, 999);
    return {
      css: `.${cls} {
  display: ${s.fullWidth ? "flex" : "inline-flex"};
  gap: 4px;
  min-width: 0;
  margin: 0;
  padding: 4px;
  border: 0;
  border-radius: ${r}px;
  background: ${color(s.bgColor, "#f1f5f9")};
}
.${cls}__legend {
  ${SR_ONLY}
}
.${cls}__opt {
  position: relative;
  flex: ${s.fullWidth ? "1" : "0 0 auto"};
}
.${cls}__input {
  ${SR_ONLY}
}
.${cls}__text {
  display: block;
  padding: 8px 16px;
  border-radius: ${Math.max(0, r - 3)}px;
  color: ${color(s.textColor, "#334155")};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.${cls}__opt:hover .${cls}__text {
  background: rgba(15, 23, 42, 0.06);
}
.${cls}__input:checked + .${cls}__text {
  background: ${accent};
  color: ${color(s.activeText, "#ffffff")};
  box-shadow: 0 2px 6px -2px rgba(15, 23, 42, 0.35);
}
.${cls}__input:focus-visible + .${cls}__text {
  ${focusCss(accent)}
}
`,
      markup: h(
        "fieldset",
        { class: cls },
        h("legend", { class: `${cls}__legend` }, s.label || name),
        opts.map((o, i) =>
          h(
            "label",
            { class: `${cls}__opt` },
            h("input", { class: `${cls}__input`, type: "radio", name, value: o, checked: i + 1 === sel }),
            h("span", { class: `${cls}__text` }, o),
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
        icon: SlidersHorizontal,
        content: (
          <>
            <TextField {...p} k="label" label={f("label")} hint={tr("srLabelHint")} />
            <TextField {...p} k="name" label={f("nameAttrOptional")} />
            <LinesField {...p} k="options" label={f("optionList")} rows={4} />
            <NumberField {...p} k="selected" label={tr("selectedIndex")} min={1} max={6} />
            <ToggleField {...p} k="fullWidth" label={f("full")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="accentColor" label={f("accentColor")} />
            <ColorField {...p} k="activeText" label={tr("activeText")} />
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={999} suffix="px" />
          </>
        ),
      },
    ];
  },
});
