import { BellRing,      Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,  SelectField, Show, TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color } from "../shared";
import { tr, f, btnCss } from "./kit";

/* -------------------------- Notifikasi Toast ------------------------ */

export interface ToastState {
  triggerText: string;
  title: string;
  message: string;
  tone: "info" | "success" | "warning" | "error";
  position: "top-right" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  duration: number;
  showOnLoad: boolean;
  delay: number;
  triggerBg: string;
  triggerColor: string;
  bgColor: string;
  textColor: string;
  radius: number;
}

const TONES: Record<ToastState["tone"], { c: string; icon: string }> = {
  info: { c: "#2563eb", icon: "i" },
  success: { c: "#16a34a", icon: "✓" },
  warning: { c: "#d97706", icon: "!" },
  error: { c: "#dc2626", icon: "×" },
};

export const toastElement = defineElement<ToastState>({
  type: "toast",
  label: "Notifikasi Toast",
  group: "Premium",
  premium: true,
  componentName: "Toast",
  defaultClassName: "custom-toast",
  defaults: {
    triggerText: "Simpan perubahan",
    title: "Berhasil disimpan",
    message: "Perubahan profil Anda sudah tersimpan.",
    tone: "success",
    position: "bottom-right",
    duration: 4,
    showOnLoad: false,
    delay: 2,
    triggerBg: "#0f172a",
    triggerColor: "#ffffff",
    bgColor: "#ffffff",
    textColor: "#0f172a",
    radius: 12,
  },
  spec: (s, cls) => {
    const tone = TONES[s.tone] ?? TONES.info;
    const r = clamp(s.radius, 0, 24);
    const [v, hz] = s.position.split("-") as ["top" | "bottom", "left" | "right" | "center"];
    const place = `${v}: 20px;\n  ${hz === "center" ? "left: 50%;\n  transform: translateX(-50%);" : `${hz}: 20px;`}`;
    return {
      css: `.${cls} {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.${cls}__trigger {
  ${btnCss(color(s.triggerBg, "#0f172a"), color(s.triggerColor, "#ffffff"), Math.min(r, 10))}
}
.${cls}__trigger:focus-visible {
  outline: 2px solid ${color(s.triggerBg, "#0f172a")};
  outline-offset: 2px;
}
.${cls}__toast {
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 340px;
  max-width: calc(100vw - 40px);
  padding: 14px 14px 14px 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-left: 4px solid ${tone.c};
  border-radius: ${r}px;
  background: ${color(s.bgColor, "#ffffff")};
  color: ${color(s.textColor, "#0f172a")};
  box-shadow: 0 18px 40px -16px rgba(15, 23, 42, 0.4);
}
.${cls}__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${tone.c};
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
}
.${cls}__text {
  flex: 1;
  min-width: 0;
}
.${cls}__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}
.${cls}__msg {
  margin: 2px 0 0;
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.8;
}
.${cls}__close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.6;
}
.${cls}__close:hover,
.${cls}__close:focus-visible {
  opacity: 1;
  background: rgba(15, 23, 42, 0.06);
}
/* Floats only once the runtime is active; in the Design canvas it shows in the flow. */
.${cls}[data-ready] .${cls}__toast {
  position: fixed;
  ${place}
  z-index: 1100;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
}
.${cls}[data-ready] .${cls}__toast:not(.is-visible) {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  ${hz === "center" ? `transform: translate(-50%, ${v === "top" ? "-" : ""}12px);` : `transform: translateY(${v === "top" ? "-" : ""}12px);`}
}
@media (prefers-reduced-motion: reduce) {
  .${cls}[data-ready] .${cls}__toast { transition: none; }
}
`,
      markup: h(
        "div",
        { class: cls, "data-duration": String(Math.round(clamp(s.duration, 0, 30))), "data-autoshow": s.showOnLoad ? String(Math.round(clamp(s.delay, 0, 60))) : undefined },
        !!s.triggerText && h("button", { class: `${cls}__trigger`, type: "button", "data-toast-open": "" }, s.triggerText),
        h(
          "div",
          { class: `${cls}__toast`, role: s.tone === "error" || s.tone === "warning" ? "alert" : "status", "aria-live": s.tone === "error" || s.tone === "warning" ? "assertive" : "polite" },
          h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, tone.icon),
          h("div", { class: `${cls}__text` }, h("p", { class: `${cls}__title` }, s.title), !!s.message && h("p", { class: `${cls}__msg` }, s.message)),
          h("button", { class: `${cls}__close`, type: "button", "aria-label": tr("close"), "data-toast-close": "" }, "×"),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var toast = element.querySelector("[data-toast-close]").parentNode;
var duration = (+element.getAttribute("data-duration") || 0) * 1000;
var auto = element.getAttribute("data-autoshow");
var timer = null, wait = null;
element.setAttribute("data-ready", "");
function hide() {
  clearTimeout(timer);
  toast.classList.remove("is-visible");
}
function show() {
  toast.classList.add("is-visible");
  clearTimeout(timer);
  if (duration > 0) timer = setTimeout(hide, duration);
}
on(element.querySelector("[data-toast-open]"), "click", show);
on(element.querySelector("[data-toast-close]"), "click", hide);
on(toast, "mouseenter", function () { clearTimeout(timer); });
on(toast, "mouseleave", function () { if (toast.classList.contains("is-visible") && duration > 0) timer = setTimeout(hide, duration); });
if (auto !== null) wait = setTimeout(show, (+auto || 0) * 1000);
onCleanup(function () {
  clearTimeout(timer);
  clearTimeout(wait);
  element.removeAttribute("data-ready");
  toast.classList.remove("is-visible");
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: BellRing,
        content: (
          <>
            <TextField {...p} k="triggerText" label={tr("triggerText")} hint={tr("toastTriggerHint")} />
            <TextField {...p} k="title" label={f("title")} />
            <TextField {...p} k="message" label={f("body")} multiline rows={2} />
            <SelectField
              {...p}
              k="tone"
              label={tr("tone")}
              options={[
                { value: "info", label: tr("toneInfo") },
                { value: "success", label: tr("toneSuccess") },
                { value: "warning", label: tr("toneWarning") },
                { value: "error", label: tr("toneError") },
              ]}
            />
            <SelectField
              {...p}
              k="position"
              label={f("position")}
              options={[
                { value: "top-right", label: tr("topRight") },
                { value: "bottom-right", label: tr("bottomRight") },
                { value: "bottom-left", label: tr("bottomLeft") },
                { value: "top-center", label: tr("topCenter") },
                { value: "bottom-center", label: tr("bottomCenter") },
              ]}
            />
            <NumberField {...p} k="duration" label={tr("duration")} hint={tr("durationHint")} min={0} max={30} suffix="s" />
            <ToggleField {...p} k="showOnLoad" label={tr("showOnLoad")} />
            <Show when={s.showOnLoad}>
              <NumberField {...p} k="delay" label={tr("delay")} min={0} max={60} suffix="s" />
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
            <ColorField {...p} k="triggerBg" label={tr("triggerBg")} />
            <ColorField {...p} k="triggerColor" label={tr("triggerColor")} />
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});
