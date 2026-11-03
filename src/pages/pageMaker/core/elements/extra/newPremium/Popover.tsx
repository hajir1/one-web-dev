import {      MessageSquareMore, Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,  SelectField,  TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { safeUrl } from "../../../helpers/generatorCss";
import { clamp, color } from "../shared";
import { tr, f, btnCss } from "./kit";

/* ------------------------------ Popover ----------------------------- */

export interface PopoverState {
  triggerText: string;
  title: string;
  body: string;
  linkText: string;
  linkHref: string;
  placement: "top" | "bottom" | "left" | "right";
  openOnHover: boolean;
  openInDesign: boolean;
  width: number;
  triggerBg: string;
  triggerColor: string;
  panelBg: string;
  textColor: string;
  borderColor: string;
  radius: number;
}

export const popoverElement = defineElement<PopoverState>({
  type: "popover",
  label: "Popover",
  group: "Premium",
  premium: true,
  componentName: "Popover",
  defaultClassName: "custom-popover",
  defaults: {
    triggerText: "Apa itu kredit?",
    title: "Kredit",
    body: "Kredit dipakai untuk membuka template, section, dan elemen premium. Kredit tidak kedaluwarsa.",
    linkText: "Pelajari lebih lanjut",
    linkHref: "#kredit",
    placement: "bottom",
    openOnHover: false,
    openInDesign: true,
    width: 280,
    triggerBg: "#eff6ff",
    triggerColor: "#1d4ed8",
    panelBg: "#ffffff",
    textColor: "#0f172a",
    borderColor: "#e2e8f0",
    radius: 12,
  },
  spec: (s, cls) => {
    const r = clamp(s.radius, 0, 24);
    const pb = color(s.panelBg, "#ffffff");
    const pos = {
      top: "bottom: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%);",
      bottom: "top: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%);",
      left: "right: calc(100% + 10px);\n  top: 50%;\n  transform: translateY(-50%);",
      right: "left: calc(100% + 10px);\n  top: 50%;\n  transform: translateY(-50%);",
    }[s.placement];
    const arrow = {
      top: "top: 100%;\n  left: 50%;\n  margin-left: -6px;",
      bottom: "bottom: 100%;\n  left: 50%;\n  margin-left: -6px;",
      left: "left: 100%;\n  top: 50%;\n  margin-top: -6px;",
      right: "right: 100%;\n  top: 50%;\n  margin-top: -6px;",
    }[s.placement];
    const border = color(s.borderColor, "#e2e8f0");
    return {
      css: `.${cls} {
  position: relative;
  display: inline-block;
}
.${cls}__trigger {
  ${btnCss(color(s.triggerBg, "#eff6ff"), color(s.triggerColor, "#1d4ed8"), 999)}
  min-height: 36px;
  padding: 6px 14px;
  font-size: 14px;
}
.${cls}__trigger:focus-visible {
  outline: 2px solid ${color(s.triggerColor, "#1d4ed8")};
  outline-offset: 2px;
}
.${cls}__panel {
  position: absolute;
  ${pos}
  z-index: 950;
  box-sizing: border-box;
  width: ${clamp(s.width, 180, 480)}px;
  max-width: calc(100vw - 32px);
  padding: 16px 18px;
  border: 1px solid ${border};
  border-radius: ${r}px;
  background: ${pb};
  color: ${color(s.textColor, "#0f172a")};
  text-align: left;
  box-shadow: 0 18px 40px -16px rgba(15, 23, 42, 0.35);
}
.${cls}__panel[hidden] {
  display: none;
}
.${cls}__arrow {
  position: absolute;
  ${arrow}
  width: 0;
  height: 0;
  border: 6px solid transparent;
  ${{ top: "border-top", bottom: "border-bottom", left: "border-left", right: "border-right" }[s.placement]}-color: ${pb};
}
.${cls}__title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 800;
}
.${cls}__body {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  opacity: 0.85;
}
.${cls}__link {
  display: inline-block;
  margin-top: 10px;
  color: ${color(s.triggerColor, "#1d4ed8")};
  font-size: 14px;
  font-weight: 700;
}
`,
      markup: h(
        "div",
        { class: cls, "data-hover": s.openOnHover ? "true" : "false" },
        h("button", { class: `${cls}__trigger`, type: "button", "aria-expanded": s.openInDesign ? "true" : "false", "aria-controls": `${cls}-panel` }, s.triggerText || "?"),
        h(
          "div",
          { class: `${cls}__panel`, id: `${cls}-panel`, role: "dialog", "aria-label": s.title || s.triggerText, hidden: !s.openInDesign },
          h("span", { class: `${cls}__arrow`, "aria-hidden": "true" }),
          !!s.title && h("p", { class: `${cls}__title` }, s.title),
          !!s.body && h("p", { class: `${cls}__body` }, s.body),
          !!s.linkText && h("a", { class: `${cls}__link`, href: safeUrl(s.linkHref) }, s.linkText),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var trigger = element.querySelector("button");
var panel = element.querySelector("[role=dialog]");
var hover = element.getAttribute("data-hover") === "true";
var timer = null;
function set(open, refocus) {
  panel.hidden = !open;
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
  if (!open && refocus) trigger.focus();
}
if (trigger && panel) {
  set(false);
  on(trigger, "click", function () { set(panel.hidden); });
  if (hover) {
    on(element, "mouseenter", function () { clearTimeout(timer); set(true); });
    on(element, "mouseleave", function () { timer = setTimeout(function () { set(false); }, 150); });
  }
  on(document, "click", function (e) { if (!element.contains(e.target)) set(false); });
  on(document, "keydown", function (e) { if (e.key === "Escape" && !panel.hidden) set(false, true); });
  onCleanup(function () { clearTimeout(timer); });
}`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: MessageSquareMore,
        content: (
          <>
            <TextField {...p} k="triggerText" label={tr("triggerText")} />
            <TextField {...p} k="title" label={f("title")} />
            <TextField {...p} k="body" label={f("body")} multiline rows={3} />
            <TextField {...p} k="linkText" label={tr("linkText")} />
            <TextField {...p} k="linkHref" label={f("hrefLabel")} />
            <SelectField
              {...p}
              k="placement"
              label={f("position")}
              options={[
                { value: "top", label: tr("top") },
                { value: "bottom", label: tr("bottom") },
                { value: "left", label: f("left") },
                { value: "right", label: f("right") },
              ]}
            />
            <ToggleField {...p} k="openOnHover" label={tr("openOnHover")} />
            <ToggleField {...p} k="openInDesign" label={tr("openInDesign")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="width" label={f("cardWidth")} min={180} max={480} suffix="px" />
            <ColorField {...p} k="triggerBg" label={tr("triggerBg")} />
            <ColorField {...p} k="triggerColor" label={tr("triggerColor")} />
            <ColorField {...p} k="panelBg" label={f("panelBg")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});
