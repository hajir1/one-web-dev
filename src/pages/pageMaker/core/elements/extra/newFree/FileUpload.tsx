import {    Palette,       Upload } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,    TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color, fieldName } from "../shared";
import { tr, f, SR_ONLY, focusCss } from "./kit";

/* --------------------------- File Upload -------------------------- */

export interface FileUploadState {
  title: string;
  hint: string;
  buttonText: string;
  name: string;
  accept: string;
  multiple: boolean;
  required: boolean;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  radius: number;
}

export const fileUploadElement = defineElement<FileUploadState>({
  type: "file-upload",
  label: "Unggah Berkas",
  group: "Form",
  componentName: "FileUpload",
  defaultClassName: "custom-upload",
  defaults: {
    title: "Seret berkas ke sini",
    hint: "PDF, JPG, atau PNG · maks. 5 MB",
    buttonText: "Pilih berkas",
    name: "lampiran",
    accept: ".pdf,.jpg,.jpeg,.png",
    multiple: false,
    required: false,
    accentColor: "#2563eb",
    bgColor: "#f8fafc",
    borderColor: "#cbd5e1",
    textColor: "#0f172a",
    radius: 14,
  },
  spec: (s, cls) => {
    const accent = color(s.accentColor, "#2563eb");
    return {
      css: `.${cls} {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 28px 20px;
  border: 2px dashed ${color(s.borderColor, "#cbd5e1")};
  border-radius: ${clamp(s.radius, 0, 32)}px;
  background: ${color(s.bgColor, "#f8fafc")};
  color: ${color(s.textColor, "#0f172a")};
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.${cls}:hover,
.${cls}.is-drag {
  border-color: ${accent};
  background: color-mix(in srgb, ${accent} 6%, ${color(s.bgColor, "#f8fafc")});
}
.${cls}:focus-within {
  border-color: ${accent};
}
.${cls}__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: 4px;
  border-radius: 50%;
  background: color-mix(in srgb, ${accent} 12%, #ffffff);
  color: ${accent};
  font-size: 22px;
}
.${cls}__title {
  font-size: 16px;
  font-weight: 700;
}
.${cls}__hint {
  font-size: 13px;
  opacity: 0.7;
}
.${cls}__btn {
  margin-top: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${accent};
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}
.${cls}__input {
  ${SR_ONLY}
}
.${cls}__input:focus-visible + .${cls}__btn {
  ${focusCss(accent)}
}
.${cls}__files {
  font-size: 13px;
  font-weight: 600;
  color: ${accent};
  word-break: break-word;
}
.${cls}__files:empty {
  display: none;
}
`,
      markup: h(
        "label",
        { class: cls },
        h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, "⇪"),
        h("span", { class: `${cls}__title` }, s.title),
        !!s.hint && h("span", { class: `${cls}__hint` }, s.hint),
        h("input", { class: `${cls}__input`, type: "file", name: fieldName(s.name, "berkas"), accept: s.accept.trim() || undefined, multiple: s.multiple, required: s.required }),
        h("span", { class: `${cls}__btn` }, s.buttonText || tr("chooseFile")),
        h("span", { class: `${cls}__files`, "aria-live": "polite", "data-files": "" }),
      ),
    };
  },
  customCode: () => ({
    js: `var input = element.querySelector("input[type=file]");
var list = element.querySelector("[data-files]");
function show() {
  var names = Array.prototype.map.call(input.files || [], function (f) { return f.name; });
  list.textContent = names.join(", ");
}
on(input, "change", show);
on(element, "dragover", function (e) { e.preventDefault(); element.classList.add("is-drag"); });
on(element, "dragleave", function () { element.classList.remove("is-drag"); });
on(element, "drop", function (e) {
  e.preventDefault();
  element.classList.remove("is-drag");
  if (!e.dataTransfer || !e.dataTransfer.files.length) return;
  try { input.files = e.dataTransfer.files; } catch (err) { return; }
  input.dispatchEvent(new Event("change", { bubbles: true }));
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Upload,
        content: (
          <>
            <TextField {...p} k="title" label={f("title")} />
            <TextField {...p} k="hint" label={tr("helper")} />
            <TextField {...p} k="buttonText" label={f("buttonText")} />
            <TextField {...p} k="name" label={f("nameAttrOptional")} />
            <TextField {...p} k="accept" label={tr("accept")} hint={tr("acceptHint")} />
            <ToggleField {...p} k="multiple" label={tr("multiple")} />
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
            <ColorField {...p} k="accentColor" label={f("accentColor")} />
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={32} suffix="px" />
          </>
        ),
      },
    ];
  },
});
