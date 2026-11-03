import {     ListChecks,  Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField, LinesField, NumberField,    TextField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { safeUrl } from "../../../helpers/generatorCss";
import { clamp, color,    parseWizard } from "../shared";
import { tr, f, btnCss } from "./kit";

/* ------------------------- Formulir Bertahap ------------------------ */

export interface FormWizardState {
  steps: string[];
  nextText: string;
  backText: string;
  submitText: string;
  successTitle: string;
  successText: string;
  action: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  radius: number;
}

export const formWizardElement = defineElement<FormWizardState>({
  type: "form-wizard",
  label: "Formulir Bertahap",
  group: "Premium",
  premium: true,
  componentName: "FormWizard",
  defaultClassName: "custom-wizard",
  defaults: {
    steps: ["Data diri | Nama lengkap*; Email*; Nomor WhatsApp", "Kebutuhan | Jenis layanan*; Perkiraan anggaran; Tanggal mulai", "Detail | Pesan untuk tim kami"],
    nextText: "Lanjut",
    backText: "Kembali",
    submitText: "Kirim permintaan",
    successTitle: "Terima kasih!",
    successText: "Permintaan Anda sudah kami terima. Tim kami akan menghubungi dalam 1×24 jam.",
    action: "",
    accentColor: "#2563eb",
    bgColor: "#ffffff",
    textColor: "#0f172a",
    borderColor: "#e2e8f0",
    radius: 16,
  },
  spec: (s, cls) => {
    const steps = parseWizard(s.steps);
    const accent = color(s.accentColor, "#2563eb");
    const border = color(s.borderColor, "#e2e8f0");
    const r = clamp(s.radius, 0, 32);
    const action = s.action.trim() ? safeUrl(s.action) : undefined;
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 26px;
  border: 1px solid ${border};
  border-radius: ${r}px;
  background: ${color(s.bgColor, "#ffffff")};
  color: ${color(s.textColor, "#0f172a")};
}
.${cls}__progress {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: ${cls};
}
.${cls}__prog {
  flex: 1;
  padding-top: 10px;
  border-top: 4px solid ${border};
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  counter-increment: ${cls};
}
.${cls}__prog::before {
  content: counter(${cls}) ". ";
}
.${cls}__prog.is-active,
.${cls}__prog.is-done {
  border-top-color: ${accent};
  color: ${color(s.textColor, "#0f172a")};
}
.${cls}__step {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.${cls}__step[hidden] {
  display: none;
}
.${cls}__legend {
  margin-bottom: 4px;
  padding: 0;
  font-size: 18px;
  font-weight: 800;
}
.${cls}__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}
.${cls}__req {
  color: #dc2626;
}
.${cls}__input {
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1.5px solid ${border};
  border-radius: ${Math.min(r, 10)}px;
  background: #ffffff;
  color: inherit;
  font: inherit;
  font-weight: 400;
}
textarea.${cls}__input {
  min-height: 110px;
  resize: vertical;
}
.${cls}__input:focus {
  border-color: ${accent};
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, ${accent} 20%, transparent);
}
.${cls}__nav {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.${cls}__btn {
  ${btnCss(accent, "#ffffff", Math.min(r, 10))}
}
.${cls}__btn--ghost {
  border: 1.5px solid ${border};
  background: transparent;
  color: inherit;
}
.${cls}__btn[hidden] {
  display: none;
}
.${cls}__btn:focus-visible {
  outline: 2px solid ${accent};
  outline-offset: 2px;
}
.${cls}__done {
  padding: 18px 0 6px;
  text-align: center;
}
.${cls}__done[hidden] {
  display: none;
}
.${cls}__done-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${accent};
  color: #ffffff;
  font-size: 26px;
}
.${cls}__done-title {
  margin: 12px 0 6px;
  font-size: 20px;
  font-weight: 800;
}
.${cls}__done-text {
  margin: 0;
  opacity: 0.75;
}
`,
      markup: h(
        "form",
        { class: cls, action, method: "post", "data-has-action": action ? "true" : "false" },
        steps.length > 1 && h("ol", { class: `${cls}__progress`, "aria-hidden": "true" }, steps.map((st, i) => h("li", { class: `${cls}__prog${i === 0 ? " is-active" : ""}` }, st.title))),
        steps.map((st, i) =>
          h(
            "fieldset",
            { class: `${cls}__step`, "data-step": String(i), hidden: i > 0 },
            h("legend", { class: `${cls}__legend` }, st.title),
            st.fields.map((fd) =>
              h(
                "label",
                { class: `${cls}__field` },
                h("span", {}, fd.label, fd.required && h("span", { class: `${cls}__req`, "aria-hidden": "true" }, " *")),
                fd.type === "textarea"
                  ? h("textarea", { class: `${cls}__input`, name: fd.name, rows: 4, required: fd.required })
                  : h("input", { class: `${cls}__input`, type: fd.type, name: fd.name, required: fd.required }),
              ),
            ),
          ),
        ),
        h(
          "div",
          { class: `${cls}__nav` },
          h("button", { class: `${cls}__btn ${cls}__btn--ghost`, type: "button", "data-wz-back": "", hidden: true }, s.backText || "‹"),
          steps.length > 1 && h("button", { class: `${cls}__btn`, type: "button", "data-wz-next": "" }, s.nextText || "›"),
          h("button", { class: `${cls}__btn`, type: "submit", "data-wz-submit": "", hidden: steps.length > 1 }, s.submitText || "OK"),
        ),
        h(
          "div",
          { class: `${cls}__done`, role: "status", hidden: true, "data-wz-done": "" },
          h("span", { class: `${cls}__done-icon`, "aria-hidden": "true" }, "✓"),
          h("p", { class: `${cls}__done-title` }, s.successTitle),
          !!s.successText && h("p", { class: `${cls}__done-text` }, s.successText),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var steps = Array.prototype.slice.call(element.querySelectorAll("[data-step]"));
var progs = Array.prototype.slice.call(element.querySelectorAll("ol li"));
var back = element.querySelector("[data-wz-back]");
var next = element.querySelector("[data-wz-next]");
var submit = element.querySelector("[data-wz-submit]");
var done = element.querySelector("[data-wz-done]");
var nav = back.parentNode;
var hasAction = element.getAttribute("data-has-action") === "true";
var at = 0;
function show(i) {
  at = Math.max(0, Math.min(steps.length - 1, i));
  steps.forEach(function (s, k) { s.hidden = k !== at; });
  progs.forEach(function (p, k) {
    p.classList.toggle("is-active", k === at);
    p.classList.toggle("is-done", k < at);
  });
  back.hidden = at === 0;
  if (next) next.hidden = at === steps.length - 1;
  submit.hidden = at !== steps.length - 1;
  var first = steps[at].querySelector("input, textarea, select");
  if (first && i !== 0) first.focus();
}
function valid() {
  var fields = steps[at].querySelectorAll("input, textarea, select");
  for (var k = 0; k < fields.length; k++) {
    if (!fields[k].checkValidity()) { fields[k].reportValidity(); return false; }
  }
  return true;
}
on(back, "click", function () { show(at - 1); });
if (next) on(next, "click", function () { if (valid()) show(at + 1); });
on(element, "submit", function (e) {
  if (!valid()) { e.preventDefault(); return; }
  element.dispatchEvent(new CustomEvent("wizard-submit", { bubbles: true }));
  if (hasAction) return;
  e.preventDefault();
  steps.forEach(function (s) { s.hidden = true; });
  progs.forEach(function (p) { p.classList.add("is-done"); });
  nav.hidden = true;
  done.hidden = false;
});
show(0);`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: ListChecks,
        content: (
          <>
            <LinesField {...p} k="steps" label={tr("wizardSteps")} hint={tr("wizardStepsHint")} rows={6} />
            <TextField {...p} k="nextText" label={tr("nextText")} />
            <TextField {...p} k="backText" label={tr("prevText")} />
            <TextField {...p} k="submitText" label={f("buttonText")} />
            <TextField {...p} k="successTitle" label={tr("successTitle")} />
            <TextField {...p} k="successText" label={tr("successText")} multiline rows={2} />
            <TextField {...p} k="action" label={tr("formAction")} hint={tr("wizardActionHint")} />
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
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={32} suffix="px" />
          </>
        ),
      },
    ];
  },
});
