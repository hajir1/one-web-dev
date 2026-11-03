import {    KeyRound,   Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,    TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color, fieldName } from "../shared";
import { tr, f } from "./kit";

/* ----------------------------- Input OTP ---------------------------- */

export interface OtpInputState {
  label: string;
  helper: string;
  length: number;
  name: string;
  numericOnly: boolean;
  boxSize: number;
  accentColor: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  radius: number;
}

export const otpInputElement = defineElement<OtpInputState>({
  type: "otp-input",
  label: "Input OTP",
  group: "Premium",
  premium: true,
  componentName: "OtpInput",
  defaultClassName: "custom-otp",
  defaults: {
    label: "Kode verifikasi",
    helper: "Masukkan 6 digit kode yang kami kirim ke WhatsApp Anda.",
    length: 6,
    name: "otp",
    numericOnly: true,
    boxSize: 52,
    accentColor: "#2563eb",
    borderColor: "#cbd5e1",
    textColor: "#0f172a",
    bgColor: "#ffffff",
    radius: 12,
  },
  spec: (s, cls) => {
    const n = Math.round(clamp(s.length, 4, 8));
    const size = clamp(s.boxSize, 36, 72);
    const accent = color(s.accentColor, "#2563eb");
    const mode = s.numericOnly ? "numeric" : "text";
    return {
      css: `.${cls} {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.${cls}__label {
  margin-bottom: 8px;
  padding: 0;
  color: ${color(s.textColor, "#0f172a")};
  font-size: 14px;
  font-weight: 700;
}
.${cls}__boxes {
  display: flex;
  gap: ${Math.round(size * 0.18)}px;
}
.${cls}__digit {
  box-sizing: border-box;
  width: ${size}px;
  height: ${Math.round(size * 1.15)}px;
  padding: 0;
  border: 1.5px solid ${color(s.borderColor, "#cbd5e1")};
  border-radius: ${clamp(s.radius, 0, 24)}px;
  background: ${color(s.bgColor, "#ffffff")};
  color: ${color(s.textColor, "#0f172a")};
  font: inherit;
  font-size: ${Math.round(size * 0.46)}px;
  font-weight: 700;
  text-align: center;
  outline: none;
  caret-color: ${accent};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.${cls}__digit:focus {
  border-color: ${accent};
  box-shadow: 0 0 0 3px color-mix(in srgb, ${accent} 20%, transparent);
}
.${cls}.is-complete .${cls}__digit {
  border-color: ${accent};
}
.${cls}__help {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
}
@media (max-width: 420px) {
  .${cls}__digit { width: calc((100vw - 64px) / ${n}); height: 48px; font-size: 20px; }
}
`,
      markup: h(
        "fieldset",
        { class: cls, "data-length": String(n), "data-numeric": s.numericOnly ? "true" : "false" },
        h("legend", { class: `${cls}__label` }, s.label || tr("otp")),
        h(
          "div",
          { class: `${cls}__boxes` },
          Array.from({ length: n }, (_, i) =>
            h("input", {
              class: `${cls}__digit`,
              type: "text",
              maxlength: 1,
              "html:inputmode": mode,
              "jsx:inputMode": mode,
              "html:autocomplete": i === 0 ? "one-time-code" : "off",
              "jsx:autoComplete": i === 0 ? "one-time-code" : "off",
              pattern: s.numericOnly ? "[0-9]" : undefined,
              "aria-label": tr("digitOf").replace("{{i}}", String(i + 1)).replace("{{n}}", String(n)),
              "aria-describedby": s.helper ? `${cls}-help` : undefined,
            }),
          ),
        ),
        h("input", { type: "hidden", name: fieldName(s.name, "otp"), "data-otp-value": "" }),
        !!s.helper && h("p", { class: `${cls}__help`, id: `${cls}-help` }, s.helper),
      ),
    };
  },
  customCode: () => ({
    js: `var boxes = Array.prototype.slice.call(element.querySelectorAll("input[maxlength]"));
var hidden = element.querySelector("[data-otp-value]");
var numeric = element.getAttribute("data-numeric") === "true";
function clean(v) { return (numeric ? v.replace(/\\D/g, "") : v.replace(/\\s/g, "")); }
function sync() {
  var code = boxes.map(function (b) { return b.value; }).join("");
  hidden.value = code;
  var done = code.length === boxes.length;
  element.classList.toggle("is-complete", done);
  if (done) element.dispatchEvent(new CustomEvent("otp-complete", { bubbles: true, detail: { code: code } }));
}
function fill(from, text) {
  var chars = clean(text).split("");
  for (var i = 0; i < chars.length && from + i < boxes.length; i++) boxes[from + i].value = chars[i];
  var next = Math.min(from + chars.length, boxes.length - 1);
  boxes[next].focus();
  sync();
}
boxes.forEach(function (box, i) {
  on(box, "input", function () {
    var v = clean(box.value);
    if (v.length > 1) { fill(i, v); return; }
    box.value = v;
    if (v && i < boxes.length - 1) boxes[i + 1].focus();
    sync();
  });
  on(box, "keydown", function (e) {
    if (e.key === "Backspace" && !box.value && i > 0) { boxes[i - 1].focus(); boxes[i - 1].value = ""; sync(); e.preventDefault(); }
    else if (e.key === "ArrowLeft" && i > 0) { boxes[i - 1].focus(); e.preventDefault(); }
    else if (e.key === "ArrowRight" && i < boxes.length - 1) { boxes[i + 1].focus(); e.preventDefault(); }
  });
  on(box, "focus", function () { box.select(); });
  on(box, "paste", function (e) {
    var text = (e.clipboardData || window.clipboardData).getData("text");
    if (!text) return;
    e.preventDefault();
    fill(i, text);
  });
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: KeyRound,
        content: (
          <>
            <TextField {...p} k="label" label={f("label")} />
            <TextField {...p} k="helper" label={tr("helper")} multiline rows={2} />
            <NumberField {...p} k="length" label={tr("digits")} min={4} max={8} />
            <TextField {...p} k="name" label={f("nameAttrOptional")} />
            <ToggleField {...p} k="numericOnly" label={tr("numericOnly")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="boxSize" label={f("boxSize")} min={36} max={72} suffix="px" />
            <ColorField {...p} k="accentColor" label={f("accentColor")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});
