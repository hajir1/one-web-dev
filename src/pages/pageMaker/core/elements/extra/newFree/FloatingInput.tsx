import {    Palette,      TextCursor } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField, SegmentedField, SelectField,  TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color, fieldName } from "../shared";
import { tr, f } from "./kit";

/* ---------------------- Input Label Mengambang ---------------------- */

export interface FloatingInputState {
  label: string;
  inputType: "text" | "email" | "password" | "tel" | "url" | "textarea";
  name: string;
  required: boolean;
  helper: string;
  variant: "outline" | "filled" | "underline";
  accentColor: string;
  textColor: string;
  labelColor: string;
  borderColor: string;
  bgColor: string;
  radius: number;
}

export const floatingInputElement = defineElement<FloatingInputState>({
  type: "floating-input",
  label: "Input Label Mengambang",
  group: "Form",
  componentName: "FloatingInput",
  defaultClassName: "custom-floating",
  defaults: {
    label: "Alamat email",
    inputType: "email",
    name: "email",
    required: true,
    helper: "",
    variant: "outline",
    accentColor: "#2563eb",
    textColor: "#0f172a",
    labelColor: "#64748b",
    borderColor: "#cbd5e1",
    bgColor: "#ffffff",
    radius: 10,
  },
  spec: (s, cls) => {
    const accent = color(s.accentColor, "#2563eb");
    const border = color(s.borderColor, "#cbd5e1");
    const r = s.variant === "underline" ? 0 : clamp(s.radius, 0, 24);
    const area = s.inputType === "textarea";
    const id = `${cls}-field`;
    const box =
      s.variant === "underline"
        ? `border: 0;\n  border-bottom: 2px solid ${border};\n  background: transparent;`
        : s.variant === "filled"
          ? `border: 0;\n  border-bottom: 2px solid ${border};\n  background: color-mix(in srgb, ${border} 30%, ${color(s.bgColor, "#ffffff")});`
          : `border: 1.5px solid ${border};\n  background: ${color(s.bgColor, "#ffffff")};`;
    return {
      css: `.${cls} {
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.${cls}__input {
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-height: 56px;
  padding: 24px ${s.variant === "underline" ? 2 : 14}px 8px;
  ${box}
  border-radius: ${r}px ${r}px ${s.variant === "outline" ? r : 0}px ${s.variant === "outline" ? r : 0}px;
  color: ${color(s.textColor, "#0f172a")};
  font: inherit;
  font-size: 16px;
  line-height: 1.4;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;${area ? "\n  min-height: 110px;\n  resize: vertical;" : ""}
}
.${cls}__label {
  position: absolute;
  top: ${area ? 18 : 18}px;
  left: ${s.variant === "underline" ? 2 : 15}px;
  max-width: calc(100% - 30px);
  overflow: hidden;
  color: ${color(s.labelColor, "#64748b")};
  font-size: 16px;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.18s ease, color 0.18s ease;
}
.${cls}__input:focus {
  border-color: ${accent};${s.variant === "outline" ? `\n  box-shadow: 0 0 0 3px color-mix(in srgb, ${accent} 20%, transparent);` : ""}
}
.${cls}__input:focus + .${cls}__label,
.${cls}__input:not(:placeholder-shown) + .${cls}__label {
  transform: translateY(-10px) scale(0.78);
}
.${cls}__input:focus + .${cls}__label {
  color: ${accent};
}
.${cls}__req {
  color: #dc2626;
}
.${cls}__help {
  margin: 6px 2px 0;
  color: ${color(s.labelColor, "#64748b")};
  font-size: 13px;
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__label, .${cls}__input { transition: none; }
}
`,
      markup: h(
        "div",
        { class: cls },
        h(area ? "textarea" : "input", {
          class: `${cls}__input`,
          id,
          type: area ? undefined : s.inputType,
          name: fieldName(s.name, "field"),
          placeholder: " ",
          rows: area ? 4 : undefined,
          required: s.required,
          "aria-describedby": s.helper ? `${cls}-help` : undefined,
        }),
        h("label", { class: `${cls}__label`, for: id }, s.label || tr("fieldLabel"), s.required && h("span", { class: `${cls}__req`, "aria-hidden": "true" }, " *")),
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
        icon: TextCursor,
        content: (
          <>
            <TextField {...p} k="label" label={f("label")} />
            <SelectField
              {...p}
              k="inputType"
              label={f("typeAttr")}
              options={[
                { value: "text", label: "text" },
                { value: "email", label: f("typeEmail") },
                { value: "password", label: f("typePassword") },
                { value: "tel", label: f("typeTel") },
                { value: "url", label: f("typeUrl") },
                { value: "textarea", label: tr("multiline") },
              ]}
            />
            <TextField {...p} k="name" label={f("nameAttrOptional")} />
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
            <SegmentedField
              {...p}
              k="variant"
              label={f("variant")}
              options={[
                { value: "outline", label: f("variantOutline") },
                { value: "filled", label: tr("filled") },
                { value: "underline", label: f("underline") },
              ]}
            />
            <ColorField {...p} k="accentColor" label={f("accentColor")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="labelColor" label={f("labelColor")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});
