import {    Palette,     SquarePlus } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,    TextField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color, fieldName } from "../shared";
import { tr, f } from "./kit";

/* ---------------------------- Input Angka --------------------------- */

export interface NumberStepperState {
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  accentColor: string;
  borderColor: string;
  textColor: string;
  radius: number;
}

export const numberStepperElement = defineElement<NumberStepperState>({
  type: "number-stepper",
  label: "Input Angka (+/−)",
  group: "Form",
  componentName: "NumberStepper",
  defaultClassName: "custom-stepper",
  defaults: { label: "Jumlah", name: "jumlah", value: 1, min: 1, max: 99, step: 1, accentColor: "#2563eb", borderColor: "#cbd5e1", textColor: "#0f172a", radius: 10 },
  spec: (s, cls) => {
    const min = Math.min(s.min, s.max);
    const max = Math.max(s.min, s.max);
    const val = clamp(s.value, min, max);
    const accent = color(s.accentColor, "#2563eb");
    const r = clamp(s.radius, 0, 24);
    return {
      css: `.${cls} {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
}
.${cls}__label {
  color: ${color(s.textColor, "#0f172a")};
  font-size: 14px;
  font-weight: 600;
}
.${cls}__box {
  display: inline-flex;
  align-items: stretch;
  overflow: hidden;
  border: 1.5px solid ${color(s.borderColor, "#cbd5e1")};
  border-radius: ${r}px;
  background: #ffffff;
}
.${cls}__box:focus-within {
  border-color: ${accent};
}
.${cls}__btn {
  width: 44px;
  min-height: 44px;
  border: 0;
  background: color-mix(in srgb, ${accent} 8%, #ffffff);
  color: ${accent};
  font: inherit;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}
.${cls}__btn:hover {
  background: color-mix(in srgb, ${accent} 16%, #ffffff);
}
.${cls}__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.${cls}__btn:focus-visible {
  outline: 2px solid ${accent};
  outline-offset: -2px;
}
.${cls}__input {
  width: 64px;
  border: 0;
  background: transparent;
  color: ${color(s.textColor, "#0f172a")};
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  outline: none;
  -moz-appearance: textfield;
  appearance: textfield;
}
.${cls}__input::-webkit-outer-spin-button,
.${cls}__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
`,
      markup: h(
        "div",
        { class: cls },
        !!s.label && h("label", { class: `${cls}__label`, for: `${cls}-n` }, s.label),
        h(
          "div",
          { class: `${cls}__box` },
          h("button", { class: `${cls}__btn`, type: "button", "data-step": "-1", "aria-label": tr("decrease") }, "−"),
          h("input", {
            class: `${cls}__input`,
            id: `${cls}-n`,
            type: "number",
            name: fieldName(s.name, "jumlah"),
            min,
            max,
            step: clamp(s.step, 0.01, 1000),
            "html:value": val,
            "jsx:defaultValue": val,
            "html:inputmode": "decimal",
            "jsx:inputMode": "decimal",
            "aria-label": s.label ? undefined : tr("amount"),
          }),
          h("button", { class: `${cls}__btn`, type: "button", "data-step": "1", "aria-label": tr("increase") }, "+"),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var input = element.querySelector("input");
var buttons = element.querySelectorAll("[data-step]");
function limits() {
  return { min: parseFloat(input.min), max: parseFloat(input.max), step: parseFloat(input.step) || 1 };
}
function sync() {
  var l = limits(), v = parseFloat(input.value);
  buttons[0].disabled = !isNaN(l.min) && v <= l.min;
  buttons[1].disabled = !isNaN(l.max) && v >= l.max;
}
Array.prototype.forEach.call(buttons, function (btn) {
  on(btn, "click", function () {
    var l = limits();
    var v = parseFloat(input.value);
    if (isNaN(v)) v = isNaN(l.min) ? 0 : l.min;
    v = Math.round((v + l.step * +btn.getAttribute("data-step")) * 1000) / 1000;
    if (!isNaN(l.min)) v = Math.max(l.min, v);
    if (!isNaN(l.max)) v = Math.min(l.max, v);
    input.value = String(v);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    sync();
  });
});
on(input, "input", sync);
sync();`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: SquarePlus,
        content: (
          <>
            <TextField {...p} k="label" label={f("label")} />
            <TextField {...p} k="name" label={f("nameAttrOptional")} />
            <NumberField {...p} k="value" label={f("value")} />
            <NumberField {...p} k="min" label={tr("min")} />
            <NumberField {...p} k="max" label={tr("max")} />
            <NumberField {...p} k="step" label={tr("step")} min={0.01} />
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
            <ColorField {...p} k="borderColor" label={f("border")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});
