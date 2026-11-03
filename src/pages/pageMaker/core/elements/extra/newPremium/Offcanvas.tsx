import {       Palette, PanelRight } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SegmentedField,   TextField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { safeUrl } from "../../../helpers/generatorCss";
import { clamp, color,   parseLinks } from "../shared";
import { tr, f, btnCss } from "./kit";

/* --------------------- Panel Samping (Offcanvas) -------------------- */

export interface OffcanvasState {
  triggerText: string;
  title: string;
  links: string[];
  body: string;
  ctaText: string;
  ctaHref: string;
  side: "left" | "right";
  width: number;
  triggerBg: string;
  triggerColor: string;
  panelBg: string;
  textColor: string;
  accentColor: string;
  overlayColor: string;
}

export const offcanvasElement = defineElement<OffcanvasState>({
  type: "offcanvas",
  label: "Panel Samping (Offcanvas)",
  group: "Premium",
  premium: true,
  componentName: "Offcanvas",
  defaultClassName: "custom-offcanvas",
  defaults: {
    triggerText: "☰ Menu",
    title: "Menu",
    links: ["Beranda | #", "Layanan | #layanan", "Portofolio | #portofolio", "Tentang kami | #tentang", "Kontak | #kontak"],
    body: "Senin–Jumat, 09.00–17.00 WIB",
    ctaText: "Konsultasi gratis",
    ctaHref: "#kontak",
    side: "right",
    width: 340,
    triggerBg: "#0f172a",
    triggerColor: "#ffffff",
    panelBg: "#ffffff",
    textColor: "#0f172a",
    accentColor: "#2563eb",
    overlayColor: "#0f172a",
  },
  spec: (s, cls) => {
    const links = parseLinks(s.links);
    const side = s.side === "left" ? "left" : "right";
    const accent = color(s.accentColor, "#2563eb");
    return {
      css: `.${cls} {
  display: inline-block;
}
.${cls}__trigger {
  ${btnCss(color(s.triggerBg, "#0f172a"), color(s.triggerColor, "#ffffff"), 10)}
}
.${cls}__trigger:focus-visible,
.${cls}__close:focus-visible,
.${cls}__link:focus-visible,
.${cls}__cta:focus-visible {
  outline: 2px solid ${accent};
  outline-offset: 2px;
}
.${cls}__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: color-mix(in srgb, ${color(s.overlayColor, "#0f172a")} 55%, transparent);
  opacity: 0;
  transition: opacity 0.25s ease;
}
.${cls}__backdrop[hidden] {
  display: none;
}
.${cls}__backdrop.is-open {
  opacity: 1;
}
.${cls}__panel {
  position: absolute;
  top: 0;
  bottom: 0;
  ${side}: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: ${clamp(s.width, 240, 560)}px;
  max-width: 88vw;
  padding: 22px;
  overflow-y: auto;
  background: ${color(s.panelBg, "#ffffff")};
  color: ${color(s.textColor, "#0f172a")};
  box-shadow: 0 0 60px rgba(15, 23, 42, 0.35);
  transform: translateX(${side === "left" ? "-" : ""}100%);
  transition: transform 0.28s ease;
}
.${cls}__backdrop.is-open .${cls}__panel {
  transform: none;
}
.${cls}__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.${cls}__title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}
.${cls}__close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.06);
  color: inherit;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}
.${cls}__nav ul {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${cls}__link {
  display: block;
  padding: 12px 4px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  color: inherit;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
}
.${cls}__link:hover {
  color: ${accent};
}
.${cls}__body {
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
}
.${cls}__cta {
  ${btnCss(accent, "#ffffff", 10)}
  margin-top: auto;
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__backdrop, .${cls}__panel { transition: none; }
}
`,
      markup: h(
        "div",
        { class: cls },
        h("button", { class: `${cls}__trigger`, type: "button", "aria-haspopup": "dialog", "aria-controls": `${cls}-panel`, "data-oc-open": "" }, s.triggerText || "Menu"),
        h(
          "div",
          { class: `${cls}__backdrop`, hidden: true, "data-oc-backdrop": "" },
          h(
            "aside",
            { class: `${cls}__panel`, id: `${cls}-panel`, role: "dialog", "aria-modal": "true", "aria-labelledby": `${cls}-title`, tabindex: "-1" },
            h("div", { class: `${cls}__head` }, h("h2", { class: `${cls}__title`, id: `${cls}-title` }, s.title || "Menu"), h("button", { class: `${cls}__close`, type: "button", "aria-label": tr("close"), "data-oc-close": "" }, "×")),
            links.length > 0 && h("nav", { class: `${cls}__nav`, "aria-label": s.title || "Menu" }, h("ul", {}, links.map((l) => h("li", {}, h("a", { class: `${cls}__link`, href: l.href, "data-oc-link": "" }, l.label))))),
            !!s.body && h("p", { class: `${cls}__body` }, s.body),
            !!s.ctaText && h("a", { class: `${cls}__cta`, href: safeUrl(s.ctaHref) }, s.ctaText),
          ),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var trigger = element.querySelector("[data-oc-open]");
var backdrop = element.querySelector("[data-oc-backdrop]");
var panel = backdrop ? backdrop.querySelector("[role=dialog]") : null;
var timer = null;
function focusables() {
  return Array.prototype.filter.call(panel.querySelectorAll("a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"), function (el) {
    return !el.disabled && el.offsetParent !== null;
  });
}
function open() {
  clearTimeout(timer);
  backdrop.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(function () { backdrop.classList.add("is-open"); });
  var list = focusables();
  (list[0] || panel).focus();
}
function close() {
  if (backdrop.hidden) return;
  backdrop.classList.remove("is-open");
  trigger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  timer = setTimeout(function () { backdrop.hidden = true; }, 280);
  trigger.focus();
}
if (trigger && backdrop && panel) {
  trigger.setAttribute("aria-expanded", "false");
  on(trigger, "click", open);
  on(panel.querySelector("[data-oc-close]"), "click", close);
  Array.prototype.forEach.call(panel.querySelectorAll("[data-oc-link]"), function (a) { on(a, "click", close); });
  on(backdrop, "click", function (e) { if (e.target === backdrop) close(); });
  on(document, "keydown", function (e) {
    if (backdrop.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var list = focusables();
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  onCleanup(function () {
    clearTimeout(timer);
    if (!backdrop.hidden) document.body.style.overflow = "";
  });
}`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: PanelRight,
        content: (
          <>
            <TextField {...p} k="triggerText" label={tr("triggerText")} />
            <TextField {...p} k="title" label={f("title")} />
            <LinesField {...p} k="links" label={tr("links")} hint={tr("linksHint")} rows={6} />
            <TextField {...p} k="body" label={f("description")} multiline rows={2} />
            <TextField {...p} k="ctaText" label={f("buttonText")} />
            <TextField {...p} k="ctaHref" label={f("buttonLink")} />
            <SegmentedField {...p} k="side" label={f("position")} options={[{ value: "left", label: f("left") }, { value: "right", label: f("right") }]} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="width" label={tr("panelWidth")} min={240} max={560} suffix="px" />
            <ColorField {...p} k="triggerBg" label={tr("triggerBg")} />
            <ColorField {...p} k="triggerColor" label={tr("triggerColor")} />
            <ColorField {...p} k="panelBg" label={f("panelBg")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="accentColor" label={f("accentColor")} />
            <ColorField {...p} k="overlayColor" label={f("overlayColor")} />
          </>
        ),
      },
    ];
  },
});
