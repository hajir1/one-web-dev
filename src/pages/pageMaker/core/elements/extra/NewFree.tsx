import { ChevronsLeftRight, ListOrdered, MapPin, Palette, Quote, Search, SlidersHorizontal, SquareDashed, SquarePlus, TextCursor, Upload, Users } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SegmentedField, SelectField, Show, TextField, ToggleField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { h } from "../../helpers/markup";
import { safeUrl } from "../../helpers/generatorCss";
import i18n from "../../../../../i18n";
import { clamp, color, fieldName, initials, mapsEmbedUrl, pageHref, paginationItems, parseOptions, parsePeople, parseSteps } from "./shared";

/* ================================================================== */
/* Elemen GRATIS v3: Input Label Mengambang, Kolom Pencarian, Input      */
/* Angka, Unggah Berkas, Tombol Segmen, Avatar, Kutipan, Paginasi,       */
/* Langkah Proses, Peta, Skeleton Loading.                               */
/*                                                                    */
/* Sebagian besar murni HTML + CSS. Input Angka & Unggah Berkas memakai  */
/* sedikit JS (runtime Custom JS) yang hanya menambah kenyamanan; tanpa  */
/* JS keduanya tetap berfungsi sebagai input bawaan browser.            */
/* ================================================================== */

const tr = (k: string) => i18n.t(`el.y.${k}`);
const f = (k: string) => i18n.t(`el.f.${k}`);

const SR_ONLY = `position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;`;

const focusCss = (c: string) => `outline: 2px solid ${c};
  outline-offset: 2px;`;

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

/* -------------------------- Kolom Pencarian ------------------------- */

export interface SearchBarState {
  placeholder: string;
  buttonText: string;
  action: string;
  param: string;
  showIcon: boolean;
  accentColor: string;
  buttonColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  radius: number;
}

export const searchBarElement = defineElement<SearchBarState>({
  type: "search-bar",
  label: "Kolom Pencarian",
  group: "Form",
  componentName: "SearchBar",
  defaultClassName: "custom-search",
  defaults: {
    placeholder: "Cari produk, artikel, atau halaman…",
    buttonText: "Cari",
    action: "/cari",
    param: "q",
    showIcon: true,
    accentColor: "#2563eb",
    buttonColor: "#ffffff",
    bgColor: "#ffffff",
    borderColor: "#cbd5e1",
    textColor: "#0f172a",
    radius: 999,
  },
  spec: (s, cls) => {
    const accent = color(s.accentColor, "#2563eb");
    const r = clamp(s.radius, 0, 999);
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 5px 5px 5px ${s.showIcon ? 14 : 18}px;
  border: 1.5px solid ${color(s.borderColor, "#cbd5e1")};
  border-radius: ${r}px;
  background: ${color(s.bgColor, "#ffffff")};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.${cls}:focus-within {
  border-color: ${accent};
  box-shadow: 0 0 0 3px color-mix(in srgb, ${accent} 20%, transparent);
}
.${cls}__icon {
  flex-shrink: 0;
  color: ${color(s.borderColor, "#94a3b8")};
  font-size: 18px;
  line-height: 1;
}
.${cls}__sr {
  ${SR_ONLY}
}
.${cls}__input {
  flex: 1;
  min-width: 0;
  min-height: 40px;
  padding: 0 4px;
  border: 0;
  background: transparent;
  color: ${color(s.textColor, "#0f172a")};
  font: inherit;
  font-size: 15px;
  outline: none;
}
.${cls}__btn {
  flex-shrink: 0;
  min-height: 40px;
  padding: 0 20px;
  border: 0;
  border-radius: ${Math.max(0, r - 4)}px;
  background: ${accent};
  color: ${color(s.buttonColor, "#ffffff")};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.${cls}__btn:hover {
  filter: brightness(1.08);
}
.${cls}__btn:focus-visible {
  ${focusCss(accent)}
}
`,
      markup: h(
        "form",
        { class: cls, role: "search", action: safeUrl(s.action, "#"), method: "get" },
        s.showIcon && h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, "⌕"),
        h("label", { class: `${cls}__sr`, for: `${cls}-q` }, s.placeholder || tr("search")),
        h("input", { class: `${cls}__input`, id: `${cls}-q`, type: "search", name: fieldName(s.param, "q"), placeholder: s.placeholder || undefined, autocomplete: "off", "jsx:autoComplete": "off" }),
        h("button", { class: `${cls}__btn`, type: "submit" }, s.buttonText || tr("search")),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Search,
        content: (
          <>
            <TextField {...p} k="placeholder" label={f("placeholder")} />
            <TextField {...p} k="buttonText" label={f("buttonText")} />
            <TextField {...p} k="action" label={tr("formAction")} hint={tr("formActionHint")} />
            <TextField {...p} k="param" label={tr("queryParam")} />
            <ToggleField {...p} k="showIcon" label={f("icon")} />
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
            <ColorField {...p} k="buttonColor" label={tr("buttonText")} />
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={999} suffix="px" />
          </>
        ),
      },
    ];
  },
});

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

/* --------------------------- Unggah Berkas -------------------------- */

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

/* --------------------------- Tombol Segmen -------------------------- */

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

/* ------------------------------ Avatar ------------------------------ */

export interface AvatarState {
  people: string[];
  stacked: boolean;
  maxVisible: number;
  size: number;
  shape: "circle" | "rounded";
  showStatus: boolean;
  statusColor: string;
  bgColor: string;
  textColor: string;
  ringColor: string;
}

const AVATAR_TONES = ["#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3", "#ede9fe", "#ccfbf1"];

export const avatarElement = defineElement<AvatarState>({
  type: "avatar",
  label: "Avatar",
  group: "Elemen",
  componentName: "AvatarGroup",
  defaultClassName: "custom-avatar",
  defaults: {
    people: [
      "Sari Dewi | https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      "Bima Pratama | https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      "Nadia Putri",
      "Raka Aditya | https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      "Lestari Wulan",
      "Dimas Arya",
    ],
    stacked: true,
    maxVisible: 4,
    size: 44,
    shape: "circle",
    showStatus: false,
    statusColor: "#22c55e",
    bgColor: "",
    textColor: "#1e293b",
    ringColor: "#ffffff",
  },
  spec: (s, cls) => {
    const people = parsePeople(s.people);
    const max = Math.round(clamp(s.maxVisible, 1, 12));
    const shown = people.slice(0, max);
    const rest = people.length - shown.length;
    const size = clamp(s.size, 24, 120);
    const r = s.shape === "circle" ? "50%" : `${Math.round(size * 0.25)}px`;
    const tones = shown.map((_, i) => `.${cls}__item:nth-child(${i + 1}) { background: ${color(s.bgColor, AVATAR_TONES[i % AVATAR_TONES.length])}; }`).join("\n");
    return {
      css: `.${cls} {
  display: inline-flex;
  align-items: center;
  ${s.stacked ? `padding-left: ${Math.round(size * 0.28)}px;` : "flex-wrap: wrap;\n  gap: 8px;"}
}
.${cls}__item {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${size}px;
  height: ${size}px;
  ${s.stacked ? `margin-left: -${Math.round(size * 0.28)}px;` : ""}
  border: 2px solid ${color(s.ringColor, "#ffffff")};
  border-radius: ${r};
  color: ${color(s.textColor, "#1e293b")};
  font-size: ${Math.round(size * 0.36)}px;
  font-weight: 700;
  line-height: 1;
}
${tones}
.${cls}__img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}
.${cls}__more {
  background: #e2e8f0;
  font-size: ${Math.round(size * 0.3)}px;
}
.${cls}__dot {
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${Math.max(8, Math.round(size * 0.24))}px;
  height: ${Math.max(8, Math.round(size * 0.24))}px;
  border: 2px solid ${color(s.ringColor, "#ffffff")};
  border-radius: 50%;
  background: ${color(s.statusColor, "#22c55e")};
}
`,
      markup: h(
        "div",
        { class: cls, role: "group", "aria-label": people.map((x) => x.name).join(", ") || "Avatar" },
        shown.map((x) =>
          h(
            "span",
            { class: `${cls}__item`, title: x.name },
            x.photo ? h("img", { class: `${cls}__img`, src: x.photo, alt: x.name, loading: "lazy" }) : h("span", { "aria-hidden": "true" }, initials(x.name)),
            s.showStatus && h("span", { class: `${cls}__dot`, "aria-hidden": "true" }),
          ),
        ),
        rest > 0 && h("span", { class: `${cls}__item ${cls}__more`, title: tr("andMore").replace("{{n}}", String(rest)) }, `+${rest}`),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Users,
        content: (
          <>
            <LinesField {...p} k="people" label={tr("people")} hint={tr("peopleHint")} rows={6} />
            <ToggleField {...p} k="stacked" label={tr("stacked")} />
            <NumberField {...p} k="maxVisible" label={tr("maxVisible")} min={1} max={12} />
            <ToggleField {...p} k="showStatus" label={f("showStatusDot")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="size" label={f("size")} min={24} max={120} suffix="px" />
            <SegmentedField {...p} k="shape" label={f("iconShape")} options={[{ value: "circle", label: tr("circle") }, { value: "rounded", label: tr("rounded") }]} />
            <ColorField {...p} k="bgColor" label={tr("initialsBg")} hint={tr("initialsBgHint")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="ringColor" label={tr("ringColor")} />
            <Show when={s.showStatus}>
              <ColorField {...p} k="statusColor" label={f("statusDot")} />
            </Show>
          </>
        ),
      },
    ];
  },
});

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

/* ----------------------------- Paginasi ----------------------------- */

export interface PaginationState {
  total: number;
  current: number;
  hrefPattern: string;
  showPrevNext: boolean;
  prevText: string;
  nextText: string;
  accentColor: string;
  activeText: string;
  textColor: string;
  borderColor: string;
  radius: number;
}

export const paginationElement = defineElement<PaginationState>({
  type: "pagination",
  label: "Paginasi",
  group: "Navigasi",
  componentName: "Pagination",
  defaultClassName: "custom-pagination",
  defaults: {
    total: 12,
    current: 4,
    hrefPattern: "?page={n}",
    showPrevNext: true,
    prevText: "Sebelumnya",
    nextText: "Berikutnya",
    accentColor: "#2563eb",
    activeText: "#ffffff",
    textColor: "#334155",
    borderColor: "#e2e8f0",
    radius: 8,
  },
  spec: (s, cls) => {
    const total = Math.round(clamp(s.total, 1, 999));
    const cur = Math.round(clamp(s.current, 1, total));
    const accent = color(s.accentColor, "#2563eb");
    const link = (n: number, label: string, extra = "") =>
      h("li", {}, h("a", { class: `${cls}__link${extra}`, href: pageHref(s.hrefPattern, n), "aria-label": /^\d+$/.test(label) ? `${tr("page")} ${n}` : undefined }, label));
    const disabled = (label: string, extra: string) => h("li", {}, h("span", { class: `${cls}__link ${extra} is-disabled`, "aria-disabled": "true" }, label));
    return {
      css: `.${cls}__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${cls}__link {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${color(s.borderColor, "#e2e8f0")};
  border-radius: ${clamp(s.radius, 0, 999)}px;
  color: ${color(s.textColor, "#334155")};
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
a.${cls}__link:hover {
  border-color: ${accent};
  color: ${accent};
}
a.${cls}__link:focus-visible {
  ${focusCss(accent)}
}
.${cls}__link[aria-current="page"] {
  border-color: ${accent};
  background: ${accent};
  color: ${color(s.activeText, "#ffffff")};
}
.${cls}__gap {
  border-color: transparent;
}
.${cls}__link.is-disabled {
  opacity: 0.45;
}
@media (max-width: 480px) {
  .${cls}__edge { display: none; }
}
`,
      markup: h(
        "nav",
        { class: cls, "aria-label": tr("pagination") },
        h(
          "ul",
          { class: `${cls}__list` },
          s.showPrevNext && (cur > 1 ? link(cur - 1, `‹ ${s.prevText}`, ` ${cls}__edge`) : disabled(`‹ ${s.prevText}`, `${cls}__edge`)),
          paginationItems(total, cur).map((it) =>
            it === "…"
              ? h("li", { "aria-hidden": "true" }, h("span", { class: `${cls}__link ${cls}__gap` }, "…"))
              : it === cur
                ? h("li", {}, h("a", { class: `${cls}__link`, href: pageHref(s.hrefPattern, it), "aria-current": "page", "aria-label": `${tr("page")} ${it}` }, String(it)))
                : link(it, String(it)),
          ),
          s.showPrevNext && (cur < total ? link(cur + 1, `${s.nextText} ›`, ` ${cls}__edge`) : disabled(`${s.nextText} ›`, `${cls}__edge`)),
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
        icon: ChevronsLeftRight,
        content: (
          <>
            <NumberField {...p} k="total" label={tr("totalPages")} min={1} max={999} />
            <NumberField {...p} k="current" label={tr("currentPage")} min={1} max={999} />
            <TextField {...p} k="hrefPattern" label={tr("hrefPattern")} hint={tr("hrefPatternHint")} />
            <ToggleField {...p} k="showPrevNext" label={tr("showPrevNext")} />
            <Show when={s.showPrevNext}>
              <TextField {...p} k="prevText" label={tr("prevText")} />
              <TextField {...p} k="nextText" label={tr("nextText")} />
            </Show>
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="accentColor" label={f("activePageColor")} />
            <ColorField {...p} k="activeText" label={tr("activeText")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={999} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* -------------------------- Langkah Proses -------------------------- */

export interface StepsState {
  steps: string[];
  current: number;
  orientation: "horizontal" | "vertical";
  accentColor: string;
  textColor: string;
  mutedColor: string;
  lineColor: string;
}

export const stepsElement = defineElement<StepsState>({
  type: "steps",
  label: "Langkah Proses",
  group: "Navigasi",
  componentName: "Steps",
  defaultClassName: "custom-steps",
  defaults: {
    steps: ["Keranjang | Periksa pesanan", "Pengiriman | Alamat & kurir", "Pembayaran | Pilih metode", "Selesai | Konfirmasi"],
    current: 2,
    orientation: "horizontal",
    accentColor: "#2563eb",
    textColor: "#0f172a",
    mutedColor: "#94a3b8",
    lineColor: "#e2e8f0",
  },
  spec: (s, cls) => {
    const steps = parseSteps(s.steps);
    const cur = Math.round(clamp(s.current, 1, Math.max(1, steps.length)));
    const accent = color(s.accentColor, "#2563eb");
    const horiz = s.orientation === "horizontal";
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  ${horiz ? "" : "flex-direction: column;\n  gap: 4px;"}
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: ${cls};
}
.${cls}__step {
  position: relative;
  display: flex;
  ${horiz ? "flex: 1;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;" : "gap: 14px;\n  padding-bottom: 22px;"}
  gap: ${horiz ? 8 : 14}px;
  color: ${color(s.mutedColor, "#94a3b8")};
}
.${cls}__step::after {
  content: "";
  position: absolute;
  ${horiz ? "top: 17px;\n  left: calc(50% + 24px);\n  right: calc(-50% + 24px);\n  height: 2px;" : "top: 40px;\n  bottom: 4px;\n  left: 17px;\n  width: 2px;"}
  background: ${color(s.lineColor, "#e2e8f0")};
}
.${cls}__step:last-child::after {
  display: none;
}
.${cls}__step.is-done::after {
  background: ${accent};
}
.${cls}__dot {
  box-sizing: border-box;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 2px solid ${color(s.lineColor, "#e2e8f0")};
  border-radius: 50%;
  background: #ffffff;
  font-size: 14px;
  font-weight: 700;
}
.${cls}__step.is-done .${cls}__dot {
  border-color: ${accent};
  background: ${accent};
  color: #ffffff;
}
.${cls}__step.is-current .${cls}__dot {
  border-color: ${accent};
  color: ${accent};
  box-shadow: 0 0 0 4px color-mix(in srgb, ${accent} 18%, transparent);
}
.${cls}__title {
  display: block;
  font-size: 14px;
  font-weight: 700;
}
.${cls}__step.is-done .${cls}__title,
.${cls}__step.is-current .${cls}__title {
  color: ${color(s.textColor, "#0f172a")};
}
.${cls}__text {
  display: block;
  margin-top: 2px;
  font-size: 12px;
}
${
  horiz
    ? `@media (max-width: 560px) {
  .${cls}__text { display: none; }
  .${cls}__title { font-size: 12px; }
}`
    : ""
}
`,
      markup: h(
        "ol",
        { class: cls },
        steps.map((st, i) => {
          const state = i + 1 < cur ? "is-done" : i + 1 === cur ? "is-current" : "";
          return h(
            "li",
            { class: `${cls}__step${state ? ` ${state}` : ""}`, "aria-current": i + 1 === cur ? "step" : undefined },
            h("span", { class: `${cls}__dot`, "aria-hidden": "true" }, i + 1 < cur ? "✓" : String(i + 1)),
            h("span", {}, h("span", { class: `${cls}__title` }, st.title), !!st.text && h("span", { class: `${cls}__text` }, st.text)),
          );
        }),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: ListOrdered,
        content: (
          <>
            <LinesField {...p} k="steps" label={tr("steps")} hint={tr("stepsHint")} rows={5} />
            <NumberField {...p} k="current" label={tr("currentStep")} min={1} max={8} />
            <SegmentedField {...p} k="orientation" label={f("orientation")} options={[{ value: "horizontal", label: f("horizontal") }, { value: "vertical", label: f("vertical") }]} />
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
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="mutedColor" label={tr("mutedColor")} />
            <ColorField {...p} k="lineColor" label={f("lineColor")} />
          </>
        ),
      },
    ];
  },
});

/* ------------------------------- Peta ------------------------------- */

export interface MapEmbedState {
  query: string;
  zoom: number;
  height: number;
  radius: number;
  title: string;
  grayscale: boolean;
}

export const mapEmbedElement = defineElement<MapEmbedState>({
  type: "map-embed",
  label: "Peta Lokasi",
  group: "Data",
  componentName: "MapEmbed",
  defaultClassName: "custom-map",
  defaults: { query: "Monumen Nasional, Jakarta", zoom: 15, height: 360, radius: 16, title: "Lokasi kami", grayscale: false },
  spec: (s, cls) => ({
    css: `.${cls} {
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: ${clamp(s.height, 160, 900)}px;
  border-radius: ${clamp(s.radius, 0, 40)}px;
  background: #e2e8f0;
}
.${cls}__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;${s.grayscale ? "\n  filter: grayscale(1);" : ""}
}
`,
    markup: h(
      "div",
      { class: cls },
      h("iframe", {
        class: `${cls}__frame`,
        src: mapsEmbedUrl(s.query, s.zoom),
        title: s.title || tr("map"),
        loading: "lazy",
        "html:referrerpolicy": "no-referrer-when-downgrade",
        "jsx:referrerPolicy": "no-referrer-when-downgrade",
        "html:allowfullscreen": true,
        "jsx:allowFullScreen": true,
      }),
    ),
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: MapPin,
        content: (
          <>
            <TextField {...p} k="query" label={tr("address")} hint={tr("addressHint")} />
            <NumberField {...p} k="zoom" label={tr("zoom")} min={3} max={20} />
            <TextField {...p} k="title" label={tr("frameTitle")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="height" label={f("height")} min={160} max={900} suffix="px" />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={40} suffix="px" />
            <ToggleField {...p} k="grayscale" label={tr("grayscale")} />
          </>
        ),
      },
    ];
  },
});

/* ------------------------- Skeleton Loading ------------------------- */

export interface SkeletonState {
  lines: number;
  showAvatar: boolean;
  showImage: boolean;
  animate: boolean;
  baseColor: string;
  shineColor: string;
  radius: number;
  label: string;
}

export const skeletonElement = defineElement<SkeletonState>({
  type: "skeleton",
  label: "Skeleton Loading",
  group: "Elemen",
  componentName: "Skeleton",
  defaultClassName: "custom-skeleton",
  defaults: { lines: 3, showAvatar: true, showImage: true, animate: true, baseColor: "#e2e8f0", shineColor: "#f8fafc", radius: 8, label: "Memuat konten…" },
  spec: (s, cls) => {
    const n = Math.round(clamp(s.lines, 1, 8));
    const base = color(s.baseColor, "#e2e8f0");
    const r = clamp(s.radius, 0, 24);
    const widths = [100, 92, 78, 86, 64, 95, 70, 82];
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.${cls}__bone {
  display: block;
  border-radius: ${r}px;
  background: ${base};${
    s.animate
      ? `\n  background-image: linear-gradient(90deg, ${base} 0%, ${color(s.shineColor, "#f8fafc")} 50%, ${base} 100%);\n  background-size: 200% 100%;\n  animation: ${cls}-shine 1.4s ease-in-out infinite;`
      : ""
  }
}
.${cls}__image {
  aspect-ratio: 16 / 9;
}
.${cls}__head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.${cls}__avatar {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
}
.${cls}__lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.${cls}__line {
  height: 12px;
}
.${cls}__head .${cls}__line {
  width: 45%;
}
${widths
  .slice(0, n)
  .map((w, i) => `.${cls}__lines .${cls}__line:nth-child(${i + 1}) { width: ${w}%; }`)
  .join("\n")}
.${cls}__sr {
  ${SR_ONLY}
}
@keyframes ${cls}-shine {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__bone { animation: none; }
}
`,
      markup: h(
        "div",
        { class: cls, role: "status", "aria-busy": "true" },
        h("span", { class: `${cls}__sr` }, s.label || tr("loading")),
        s.showImage && h("span", { class: `${cls}__bone ${cls}__image`, "aria-hidden": "true" }),
        s.showAvatar &&
          h(
            "span",
            { class: `${cls}__head`, "aria-hidden": "true" },
            h("span", { class: `${cls}__bone ${cls}__avatar` }),
            h("span", { class: `${cls}__bone ${cls}__line` }),
          ),
        h(
          "span",
          { class: cls + "__lines", "aria-hidden": "true" },
          Array.from({ length: n }, () => h("span", { class: `${cls}__bone ${cls}__line` })),
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
        icon: SquareDashed,
        content: (
          <>
            <NumberField {...p} k="lines" label={tr("textLines")} min={1} max={8} />
            <ToggleField {...p} k="showImage" label={f("showImage")} />
            <ToggleField {...p} k="showAvatar" label={tr("showAvatar")} />
            <ToggleField {...p} k="animate" label={f("animation")} />
            <TextField {...p} k="label" label={tr("srText")} hint={tr("srTextHint")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="baseColor" label={f("bg")} />
            <ColorField {...p} k="shineColor" label={tr("shineColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});
