import { BellRing, Cookie, Crosshair, KeyRound, ListChecks, MessageSquareMore, Palette, PanelRight, SquareChevronDown } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SegmentedField, SelectField, Show, TextField, ToggleField, ImageField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { h } from "../../helpers/markup";
import { safeUrl } from "../../helpers/generatorCss";
import i18n from "../../../../../i18n";
import { clamp, color, fieldName, parseHotspots, parseLinks, parseWizard } from "./shared";

/* ================================================================== */
/* Elemen PREMIUM v3 (tingkat lanjut — butuh JS interaksi):             */
/* Popover, Notifikasi Toast, Panel Samping (Offcanvas), Input OTP,     */
/* Tombol Dropdown, Persetujuan Cookie, Gambar Hotspot, Formulir        */
/* Bertahap.                                                            */
/*                                                                    */
/* Pola yang sama dengan elemen premium v2: markup statis tetap masuk   */
/* akal tanpa JS (canvas Desain tidak menjalankan JS), interaksi lewat  */
/* `customCode` (runtime Custom JS: `element`, `on`, `onCleanup`) di    */
/* Pratinjau dan hasil ekspor kelima framework. Atribut `data-ready`    */
/* dipasang runtime; elemen mengambang (toast, cookie) baru "melayang"  */
/* setelah atribut itu ada, jadi di canvas tetap bisa dipilih & diatur. */
/* ================================================================== */

const tr = (k: string) => i18n.t(`el.y.${k}`);
const f = (k: string) => i18n.t(`el.f.${k}`);

const btnCss = (bg: string, fg: string, r: number) => `display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  border: 0;
  border-radius: ${r}px;
  background: ${bg};
  color: ${fg};
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;`;

/** Kode bersama: tutup saat klik di luar elemen / tombol Escape. */
const outsideEsc = (closeFn: string) => `on(document, "click", function (e) {
  if (!element.contains(e.target)) ${closeFn}(false);
});
on(document, "keydown", function (e) {
  if (e.key === "Escape") ${closeFn}(true);
});`;

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
/* Melayang hanya setelah runtime aktif; di canvas Desain tampil di alur. */
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

/* -------------------------- Tombol Dropdown ------------------------- */

export interface DropdownState {
  buttonText: string;
  items: string[];
  align: "left" | "right";
  bgColor: string;
  textColor: string;
  menuBg: string;
  menuText: string;
  hoverBg: string;
  radius: number;
}

export const dropdownElement = defineElement<DropdownState>({
  type: "dropdown",
  label: "Tombol Dropdown",
  group: "Premium",
  premium: true,
  componentName: "DropdownButton",
  defaultClassName: "custom-dropdown",
  defaults: {
    buttonText: "Unduh laporan",
    items: ["PDF | #pdf", "Excel (.xlsx) | #xlsx", "CSV | #csv", "Kirim lewat email | #email"],
    align: "left",
    bgColor: "#2563eb",
    textColor: "#ffffff",
    menuBg: "#ffffff",
    menuText: "#0f172a",
    hoverBg: "#eff6ff",
    radius: 10,
  },
  spec: (s, cls) => {
    const items = parseLinks(s.items);
    const r = clamp(s.radius, 0, 24);
    return {
      css: `.${cls} {
  position: relative;
  display: inline-block;
}
.${cls}__btn {
  ${btnCss(color(s.bgColor, "#2563eb"), color(s.textColor, "#ffffff"), r)}
}
.${cls}__btn:focus-visible {
  outline: 2px solid ${color(s.bgColor, "#2563eb")};
  outline-offset: 2px;
}
.${cls}__caret {
  font-size: 12px;
  transition: transform 0.2s ease;
}
.${cls}__btn[aria-expanded="true"] .${cls}__caret {
  transform: rotate(180deg);
}
.${cls}__menu {
  position: absolute;
  top: calc(100% + 6px);
  ${s.align === "right" ? "right" : "left"}: 0;
  z-index: 950;
  box-sizing: border-box;
  min-width: max(100%, 200px);
  margin: 0;
  padding: 6px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: ${r}px;
  background: ${color(s.menuBg, "#ffffff")};
  list-style: none;
  box-shadow: 0 18px 40px -16px rgba(15, 23, 42, 0.35);
}
.${cls}__menu[hidden] {
  display: none;
}
.${cls}__item {
  display: block;
  padding: 10px 12px;
  border-radius: ${Math.max(0, r - 4)}px;
  color: ${color(s.menuText, "#0f172a")};
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  outline: none;
}
.${cls}__item:hover,
.${cls}__item:focus {
  background: ${color(s.hoverBg, "#eff6ff")};
}
`,
      markup: h(
        "div",
        { class: cls },
        h("button", { class: `${cls}__btn`, type: "button", "aria-haspopup": "menu", "aria-expanded": "false", "aria-controls": `${cls}-menu` }, s.buttonText || "Menu", h("span", { class: `${cls}__caret`, "aria-hidden": "true" }, "▾")),
        h("ul", { class: `${cls}__menu`, id: `${cls}-menu`, role: "menu", hidden: true }, items.map((it) => h("li", { role: "none" }, h("a", { class: `${cls}__item`, role: "menuitem", href: it.href, tabindex: "-1" }, it.label)))),
      ),
    };
  },
  customCode: () => ({
    js: `var btn = element.querySelector("[aria-haspopup]");
var menu = element.querySelector("[role=menu]");
var items = Array.prototype.slice.call(menu.querySelectorAll("[role=menuitem]"));
function set(open, focusBtn) {
  menu.hidden = !open;
  btn.setAttribute("aria-expanded", open ? "true" : "false");
  if (!open && focusBtn) btn.focus();
}
function move(i) {
  if (!items.length) return;
  items[(i + items.length) % items.length].focus();
}
on(btn, "click", function () {
  var open = menu.hidden;
  set(open);
  if (open) move(0);
});
on(btn, "keydown", function (e) {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    set(true);
    move(e.key === "ArrowDown" ? 0 : -1);
  }
});
on(menu, "keydown", function (e) {
  var i = items.indexOf(document.activeElement);
  if (e.key === "ArrowDown") { e.preventDefault(); move(i + 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); move(i - 1); }
  else if (e.key === "Home") { e.preventDefault(); move(0); }
  else if (e.key === "End") { e.preventDefault(); move(-1); }
  else if (e.key === "Tab") set(false);
});
items.forEach(function (a) { on(a, "click", function () { set(false); }); });
${outsideEsc("closeMenu")}
function closeMenu(refocus) { if (!menu.hidden) set(false, refocus); }`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: SquareChevronDown,
        content: (
          <>
            <TextField {...p} k="buttonText" label={f("buttonText")} />
            <LinesField {...p} k="items" label={tr("menuItems")} hint={tr("linksHint")} rows={5} />
            <SegmentedField {...p} k="align" label={f("alignment")} options={[{ value: "left", label: f("left") }, { value: "right", label: f("right") }]} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="bgColor" label={tr("triggerBg")} />
            <ColorField {...p} k="textColor" label={tr("triggerColor")} />
            <ColorField {...p} k="menuBg" label={f("panelBg")} />
            <ColorField {...p} k="menuText" label={f("textColor")} />
            <ColorField {...p} k="hoverBg" label={f("bgOnHover")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ------------------------- Persetujuan Cookie ----------------------- */

export interface CookieConsentState {
  message: string;
  linkText: string;
  linkHref: string;
  acceptText: string;
  declineText: string;
  position: "bottom" | "bottom-left" | "bottom-right";
  storageKey: string;
  bgColor: string;
  textColor: string;
  acceptBg: string;
  acceptColor: string;
  radius: number;
}

export const cookieConsentElement = defineElement<CookieConsentState>({
  type: "cookie-consent",
  label: "Persetujuan Cookie",
  group: "Premium",
  premium: true,
  componentName: "CookieConsent",
  defaultClassName: "custom-cookie",
  defaults: {
    message: "Kami memakai cookie untuk mengingat preferensi Anda dan memahami cara situs ini digunakan.",
    linkText: "Kebijakan privasi",
    linkHref: "/privasi",
    acceptText: "Terima",
    declineText: "Tolak",
    position: "bottom",
    storageKey: "cookie-consent",
    bgColor: "#0f172a",
    textColor: "#e2e8f0",
    acceptBg: "#2563eb",
    acceptColor: "#ffffff",
    radius: 14,
  },
  spec: (s, cls) => {
    const r = clamp(s.radius, 0, 24);
    const place = s.position === "bottom" ? "left: 16px;\n  right: 16px;\n  margin: 0 auto;\n  max-width: 960px;" : s.position === "bottom-left" ? "left: 16px;\n  max-width: 380px;" : "right: 16px;\n  max-width: 380px;";
    const stacked = s.position !== "bottom";
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  ${stacked ? "flex-direction: column;\n  align-items: stretch;" : "flex-wrap: wrap;\n  align-items: center;"}
  gap: 14px 20px;
  width: 100%;
  padding: 18px 20px;
  border-radius: ${r}px;
  background: ${color(s.bgColor, "#0f172a")};
  color: ${color(s.textColor, "#e2e8f0")};
  box-shadow: 0 20px 50px -20px rgba(15, 23, 42, 0.6);
}
.${cls}__msg {
  flex: 1 1 320px;
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
}
.${cls}__msg a {
  color: inherit;
  font-weight: 700;
}
.${cls}__actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}
.${cls}__btn {
  ${btnCss("transparent", "inherit", Math.min(r, 10))}
  min-height: 40px;
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid currentColor;
}
.${cls}__btn--accept {
  border-color: ${color(s.acceptBg, "#2563eb")};
  background: ${color(s.acceptBg, "#2563eb")};
  color: ${color(s.acceptColor, "#ffffff")};
}
.${cls}__btn:focus-visible {
  outline: 2px solid ${color(s.acceptBg, "#2563eb")};
  outline-offset: 2px;
}
/* Melayang di bawah layar hanya setelah runtime aktif. */
.${cls}[data-ready] {
  position: fixed;
  bottom: 16px;
  ${place}
  width: auto;
  z-index: 1050;
}
.${cls}[hidden] {
  display: none;
}
`,
      markup: h(
        "div",
        { class: cls, role: "region", "aria-label": tr("cookieRegion"), "data-key": s.storageKey.replace(/[^\w-]/g, "") || "cookie-consent" },
        h("p", { class: `${cls}__msg` }, s.message, !!s.linkText && " ", !!s.linkText && h("a", { href: safeUrl(s.linkHref) }, s.linkText)),
        h(
          "div",
          { class: `${cls}__actions` },
          !!s.declineText && h("button", { class: `${cls}__btn`, type: "button", "data-consent": "declined" }, s.declineText),
          h("button", { class: `${cls}__btn ${cls}__btn--accept`, type: "button", "data-consent": "accepted" }, s.acceptText || "OK"),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var key = element.getAttribute("data-key") || "cookie-consent";
var saved = null;
try { saved = window.localStorage.getItem(key); } catch (e) { saved = null; }
element.setAttribute("data-ready", "");
if (saved) element.hidden = true;
Array.prototype.forEach.call(element.querySelectorAll("[data-consent]"), function (btn) {
  on(btn, "click", function () {
    var value = btn.getAttribute("data-consent");
    try { window.localStorage.setItem(key, value); } catch (e) { /* mode privat */ }
    element.hidden = true;
    document.dispatchEvent(new CustomEvent("cookie-consent", { detail: { value: value } }));
  });
});
onCleanup(function () {
  element.removeAttribute("data-ready");
  element.hidden = false;
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Cookie,
        content: (
          <>
            <TextField {...p} k="message" label={f("body")} multiline rows={3} />
            <TextField {...p} k="linkText" label={tr("linkText")} />
            <TextField {...p} k="linkHref" label={f("hrefLabel")} />
            <TextField {...p} k="acceptText" label={tr("acceptText")} />
            <TextField {...p} k="declineText" label={tr("declineText")} hint={tr("declineHint")} />
            <SelectField
              {...p}
              k="position"
              label={f("position")}
              options={[
                { value: "bottom", label: tr("bottomCenter") },
                { value: "bottom-left", label: tr("bottomLeft") },
                { value: "bottom-right", label: tr("bottomRight") },
              ]}
            />
            <TextField {...p} k="storageKey" label={tr("storageKey")} hint={tr("storageKeyHint")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="acceptBg" label={tr("acceptBg")} />
            <ColorField {...p} k="acceptColor" label={tr("acceptColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* -------------------------- Gambar Hotspot -------------------------- */

export interface ImageHotspotState {
  image: string;
  alt: string;
  spots: string[];
  ratio: "16 / 9" | "4 / 3" | "1 / 1" | "3 / 2";
  radius: number;
  dotColor: string;
  panelBg: string;
  textColor: string;
  pulse: boolean;
}

export const imageHotspotElement = defineElement<ImageHotspotState>({
  type: "image-hotspot",
  label: "Gambar Hotspot",
  group: "Premium",
  premium: true,
  componentName: "ImageHotspot",
  defaultClassName: "custom-hotspot",
  defaults: {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400",
    alt: "Ruang tamu bergaya skandinavia",
    spots: [
      "24 | 62 | Sofa Linen Abu | Rp 7.450.000 · kain linen, rangka kayu jati",
      "52 | 38 | Lampu Gantung Rotan | Rp 890.000 · anyaman tangan",
      "78 | 70 | Meja Samping Oak | Rp 1.250.000 · kayu oak solid",
    ],
    ratio: "16 / 9",
    radius: 16,
    dotColor: "#ffffff",
    panelBg: "#ffffff",
    textColor: "#0f172a",
    pulse: true,
  },
  spec: (s, cls) => {
    const spots = parseHotspots(s.spots);
    const dot = color(s.dotColor, "#ffffff");
    return {
      css: `.${cls} {
  position: relative;
  overflow: visible;
  width: 100%;
}
.${cls}__img {
  display: block;
  width: 100%;
  aspect-ratio: ${s.ratio};
  border-radius: ${clamp(s.radius, 0, 40)}px;
  object-fit: cover;
}
.${cls}__spot {
  position: absolute;
  transform: translate(-50%, -50%);
}
${spots.map((sp, i) => `.${cls}__spot:nth-of-type(${i + 1}) { left: ${sp.x}%; top: ${sp.y}%; }`).join("\n")}
.${cls}__dot {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${dot};
  color: #0f172a;
  font: inherit;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.35);
  cursor: pointer;
}
${
  s.pulse
    ? `.${cls}__dot::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid ${dot};
  animation: ${cls}-pulse 1.8s ease-out infinite;
}
@keyframes ${cls}-pulse {
  from { opacity: 0.9; transform: scale(0.8); }
  to { opacity: 0; transform: scale(1.5); }
}`
    : ""
}
.${cls}__dot[aria-expanded="true"] {
  transform: rotate(45deg);
}
.${cls}__dot:focus-visible {
  outline: 3px solid #0f172a;
  outline-offset: 2px;
}
.${cls}__tip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  z-index: 5;
  box-sizing: border-box;
  width: 230px;
  padding: 12px 14px;
  border-radius: 12px;
  background: ${color(s.panelBg, "#ffffff")};
  color: ${color(s.textColor, "#0f172a")};
  box-shadow: 0 18px 40px -16px rgba(15, 23, 42, 0.45);
  transform: translateX(-50%);
}
.${cls}__tip[hidden] {
  display: none;
}
.${cls}__spot.is-low .${cls}__tip {
  top: calc(100% + 12px);
  bottom: auto;
}
.${cls}__tip-title {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
}
.${cls}__tip-text {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.8;
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__dot::before { animation: none; }
}
`,
      markup: h(
        "div",
        { class: cls },
        h("img", { class: `${cls}__img`, src: safeUrl(s.image, ""), alt: s.alt, loading: "lazy" }),
        spots.map((sp, i) =>
          h(
            "div",
            { class: `${cls}__spot${sp.y < 35 ? ` is-low` : ""}` },
            h("button", { class: `${cls}__dot`, type: "button", "aria-expanded": "false", "aria-controls": `${cls}-tip-${i + 1}`, "aria-label": sp.title }, "+"),
            h("div", { class: `${cls}__tip`, id: `${cls}-tip-${i + 1}`, role: "dialog", "aria-label": sp.title, hidden: true }, h("p", { class: `${cls}__tip-title` }, sp.title), !!sp.text && h("p", { class: `${cls}__tip-text` }, sp.text)),
          ),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var dots = Array.prototype.slice.call(element.querySelectorAll("[aria-controls]"));
function closeAll(except) {
  dots.forEach(function (d) {
    if (d === except) return;
    d.setAttribute("aria-expanded", "false");
    var tip = document.getElementById(d.getAttribute("aria-controls"));
    if (tip) tip.hidden = true;
  });
}
dots.forEach(function (d) {
  on(d, "click", function () {
    var tip = document.getElementById(d.getAttribute("aria-controls"));
    var open = d.getAttribute("aria-expanded") !== "true";
    closeAll(d);
    d.setAttribute("aria-expanded", open ? "true" : "false");
    if (tip) tip.hidden = !open;
  });
});
${outsideEsc("closeSpots")}
function closeSpots(refocus) {
  var openDot = dots.filter(function (d) { return d.getAttribute("aria-expanded") === "true"; })[0];
  closeAll(null);
  if (refocus && openDot) openDot.focus();
}`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Crosshair,
        content: (
          <>
            <ImageField {...p} k="image" label={f("imageUrl")} />
            <TextField {...p} k="alt" label={f("altText")} hint={f("altHint")} />
            <LinesField {...p} k="spots" label={tr("spots")} hint={tr("spotsHint")} rows={5} />
            <SelectField
              {...p}
              k="ratio"
              label={f("ratio")}
              options={[
                { value: "16 / 9", label: "16:9" },
                { value: "4 / 3", label: "4:3" },
                { value: "3 / 2", label: "3:2" },
                { value: "1 / 1", label: "1:1" },
              ]}
            />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="dotColor" label={f("dotColor")} />
            <ColorField {...p} k="panelBg" label={f("panelBg")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <NumberField {...p} k="radius" label={f("imageRadius")} min={0} max={40} suffix="px" />
            <ToggleField {...p} k="pulse" label={f("pulseAnimation")} />
          </>
        ),
      },
    ];
  },
});

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
