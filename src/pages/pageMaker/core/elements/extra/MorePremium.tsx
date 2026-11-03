import { ArrowUpToLine, Columns2, Images, MessageSquare, Palette, ScrollText } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, RangeField, SegmentedField, SelectField, Show, TextField, ToggleField, ImageField, GalleryField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { h } from "../../helpers/markup";
import { safeUrl } from "../../helpers/generatorCss";
import i18n from "../../../../../i18n";
import { clamp, color, parseGallery, parseMarquee, safeImage, seconds } from "./shared";
import { SAMPLE_SCENES, sceneImage } from "../placeholders";

/* ================================================================== */
/* Elemen PREMIUM v2: Galeri Lightbox, Marquee Logo, Modal Popup,       */
/* Before/After, Tombol Kembali ke Atas.                                */
/*                                                                    */
/* Markup statis (h()) tetap berguna tanpa JS (galeri → tautan gambar,  */
/* before/after → posisi awal, tombol atas → tautan #top). Interaksi    */
/* ditambahkan lewat `customCode` (runtime Custom JS) di Pratinjau dan  */
/* hasil ekspor kelima framework.                                       */
/* ================================================================== */

const tr = (k: string) => i18n.t(`el.x.${k}`);
const f = (k: string) => i18n.t(`el.f.${k}`);

const SR_ONLY = `position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;`;

/* -------------------------- Galeri Lightbox ------------------------- */

export interface GalleryLightboxState {
  images: string[];
  columns: number;
  gap: number;
  radius: number;
  ratio: "1 / 1" | "4 / 3" | "16 / 9" | "3 / 4";
  showCaptions: boolean;
  overlayColor: string;
  captionColor: string;
}

export const galleryLightboxElement = defineElement<GalleryLightboxState>({
  type: "gallery-lightbox",
  label: "Galeri Lightbox",
  group: "Premium",
  premium: true,
  componentName: "GalleryLightbox",
  defaultClassName: "custom-gallery",
  defaults: {
    images: [
      ...SAMPLE_SCENES.map(([src, cap]) => `${src} | ${cap}`),
    ],
    columns: 3,
    gap: 12,
    radius: 12,
    ratio: "4 / 3",
    showCaptions: false,
    overlayColor: "#0b1120",
    captionColor: "#ffffff",
  },
  spec: (s, cls) => {
    const imgs = parseGallery(s.images);
    const cols = Math.round(clamp(s.columns, 1, 6));
    const overlay = color(s.overlayColor, "#0b1120");
    return {
      css: `.${cls} {
  width: 100%;
}
.${cls}__grid {
  display: grid;
  grid-template-columns: repeat(${cols}, minmax(0, 1fr));
  gap: ${clamp(s.gap, 0, 40)}px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${cls}__thumb {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: ${clamp(s.radius, 0, 40)}px;
  aspect-ratio: ${s.ratio};
  background: #e2e8f0;
  cursor: zoom-in;
}
.${cls}__thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}
.${cls}__thumb:hover img,
.${cls}__thumb:focus-visible img {
  transform: scale(1.05);
}
.${cls}__thumb:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.${cls}__cap {
  position: absolute;
  inset: auto 0 0 0;
  padding: 24px 12px 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
}
.${cls}__box {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 64px;
  background: color-mix(in srgb, ${overlay} 92%, transparent);
}
.${cls}__box[hidden] {
  display: none;
}
.${cls}__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
}
.${cls}__full {
  max-width: 100%;
  max-height: calc(100vh - 160px);
  border-radius: 8px;
  object-fit: contain;
}
.${cls}__full-cap {
  color: ${color(s.captionColor, "#ffffff")};
  font-size: 14px;
  text-align: center;
}
.${cls}__btn {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}
.${cls}__btn:hover,
.${cls}__btn:focus-visible {
  background: rgba(255, 255, 255, 0.28);
}
.${cls}__btn:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}
.${cls}__close { top: 12px; right: 12px; }
.${cls}__prev { left: 12px; top: 50%; transform: translateY(-50%); }
.${cls}__next { right: 12px; top: 50%; transform: translateY(-50%); }
@media (max-width: 640px) {
  .${cls}__grid { grid-template-columns: repeat(${Math.min(2, cols)}, minmax(0, 1fr)); }
  .${cls}__box { padding: 56px 12px; }
  .${cls}__prev, .${cls}__next { top: auto; bottom: 12px; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__thumb img { transition: none; }
}
`,
      markup: h(
        "div",
        { class: cls },
        h(
          "ul",
          { class: `${cls}__grid` },
          imgs.map((g, i) =>
            h(
              "li",
              {},
              h(
                "a",
                { class: `${cls}__thumb`, href: safeUrl(g.src), "data-lb-index": String(i), "data-caption": g.caption, "aria-label": g.caption || `Gambar ${i + 1}` },
                h("img", { src: safeUrl(g.src, ""), alt: g.caption, loading: "lazy" }),
                s.showCaptions && !!g.caption && h("span", { class: `${cls}__cap`, "aria-hidden": "true" }, g.caption),
              ),
            ),
          ),
        ),
        h(
          "div",
          { class: `${cls}__box`, role: "dialog", "aria-modal": "true", "aria-label": "Galeri", hidden: true, "data-lb-box": "" },
          h(
            "figure",
            { class: `${cls}__figure` },
            h("img", { class: `${cls}__full`, alt: "", "data-lb-img": "" }),
            h("figcaption", { class: `${cls}__full-cap`, "aria-live": "polite", "data-lb-cap": "" }),
          ),
          h("button", { class: `${cls}__btn ${cls}__prev`, type: "button", "aria-label": "Gambar sebelumnya", "data-lb-prev": "" }, "‹"),
          h("button", { class: `${cls}__btn ${cls}__next`, type: "button", "aria-label": "Gambar berikutnya", "data-lb-next": "" }, "›"),
          h("button", { class: `${cls}__btn ${cls}__close`, type: "button", "aria-label": "Tutup galeri", "data-lb-close": "" }, "×"),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var links = Array.prototype.slice.call(element.querySelectorAll("[data-lb-index]"));
var box = element.querySelector("[data-lb-box]");
var img = element.querySelector("[data-lb-img]");
var cap = element.querySelector("[data-lb-cap]");
var closeBtn = element.querySelector("[data-lb-close]");
var current = 0;
var opener = null;
function show(i) {
  if (!links.length) return;
  current = (i + links.length) % links.length;
  var a = links[current];
  var text = a.getAttribute("data-caption") || "";
  img.setAttribute("src", a.getAttribute("href"));
  img.setAttribute("alt", text);
  cap.textContent = text;
  cap.hidden = !text;
}
function open(i) {
  opener = document.activeElement;
  show(i);
  box.hidden = false;
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}
function close() {
  if (box.hidden) return;
  box.hidden = true;
  document.body.style.overflow = "";
  if (opener && opener.focus) opener.focus();
}
links.forEach(function (a, i) {
  on(a, "click", function (e) {
    e.preventDefault();
    open(i);
  });
});
on(element.querySelector("[data-lb-prev]"), "click", function () { show(current - 1); });
on(element.querySelector("[data-lb-next]"), "click", function () { show(current + 1); });
on(closeBtn, "click", close);
on(box, "click", function (e) {
  if (e.target === box) close();
});
on(document, "keydown", function (e) {
  if (box.hidden) return;
  if (e.key === "Escape") close();
  else if (e.key === "ArrowLeft") show(current - 1);
  else if (e.key === "ArrowRight") show(current + 1);
  else if (e.key === "Tab") {
    var f = box.querySelectorAll("button");
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
onCleanup(function () {
  if (!box.hidden) document.body.style.overflow = "";
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Images,
        content: (
          <>
            <GalleryField {...p} k="images" label={tr("galleryImages")} hint={tr("galleryImagesHint")} rows={7} max={24} />
            <ToggleField {...p} k="showCaptions" label={tr("showCaptions")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="columns" label={tr("columns")} min={1} max={6} />
            <NumberField {...p} k="gap" label={f("spacing")} min={0} max={40} suffix="px" />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={40} suffix="px" />
            <SelectField
              {...p}
              k="ratio"
              label={f("aspectRatio")}
              options={[
                { value: "1 / 1", label: "1:1" },
                { value: "4 / 3", label: "4:3" },
                { value: "16 / 9", label: "16:9" },
                { value: "3 / 4", label: "3:4" },
              ]}
            />
            <ColorField {...p} k="overlayColor" label={f("overlayColor")} />
            <ColorField {...p} k="captionColor" label={tr("captionColor")} />
          </>
        ),
      },
    ];
  },
});

/* ---------------------------- Logo Marquee -------------------------- */

export interface LogoMarqueeState {
  title: string;
  items: string[];
  speed: number;
  direction: "left" | "right";
  pauseOnHover: boolean;
  logoHeight: number;
  gap: number;
  grayscale: boolean;
  fade: boolean;
  textColor: string;
  bgColor: string;
}

export const logoMarqueeElement = defineElement<LogoMarqueeState>({
  type: "logo-marquee",
  label: "Marquee Logo",
  group: "Premium",
  premium: true,
  componentName: "LogoMarquee",
  defaultClassName: "custom-marquee",
  defaults: {
    title: "Dipercaya oleh tim di seluruh Indonesia",
    items: ["Nusantara Tech", "Kopi Senja", "Bumi Digital", "Arunika Studio", "Lumbung Data", "Sinar Logistik"],
    speed: 30,
    direction: "left",
    pauseOnHover: true,
    logoHeight: 32,
    gap: 48,
    grayscale: true,
    fade: true,
    textColor: "#475569",
    bgColor: "transparent",
  },
  spec: (s, cls) => {
    const items = parseMarquee(s.items);
    const gap = clamp(s.gap, 8, 120);
    const hgt = clamp(s.logoHeight, 16, 96);
    const track = (hidden: boolean) =>
      h(
        "ul",
        { class: `${cls}__track`, "aria-hidden": hidden ? "true" : undefined },
        items.map((it) =>
          h(
            "li",
            { class: `${cls}__item` },
            it.src ? h("img", { class: `${cls}__logo`, src: safeUrl(it.src, ""), alt: hidden ? "" : it.label, loading: "lazy" }) : h("span", { class: `${cls}__text` }, it.label),
          ),
        ),
      );
    return {
      css: `.${cls} {
  width: 100%;
  padding: 8px 0;
  background: ${s.bgColor === "transparent" ? "transparent" : color(s.bgColor, "transparent")};
}
.${cls}__title {
  margin: 0 0 16px;
  color: ${color(s.textColor, "#475569")};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
.${cls}__viewport {
  display: flex;
  overflow: hidden;
  ${s.fade ? "-webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);\n  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);" : ""}
}
.${cls}__track {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: ${gap}px;
  min-width: 100%;
  margin: 0;
  padding: 0 ${gap / 2}px;
  list-style: none;
  animation: ${cls}-scroll ${seconds(s.speed, 5, 120)} linear infinite${s.direction === "right" ? " reverse" : ""};
}
${s.pauseOnHover ? `.${cls}__viewport:hover .${cls}__track,\n.${cls}__viewport:focus-within .${cls}__track {\n  animation-play-state: paused;\n}` : ""}
.${cls}__item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: ${hgt}px;
}
.${cls}__logo {
  height: 100%;
  width: auto;
  object-fit: contain;
  ${s.grayscale ? "filter: grayscale(1);\n  opacity: 0.7;\n  transition: filter 0.2s ease, opacity 0.2s ease;" : ""}
}
${s.grayscale ? `.${cls}__logo:hover {\n  filter: none;\n  opacity: 1;\n}` : ""}
.${cls}__text {
  color: ${color(s.textColor, "#475569")};
  font-size: ${Math.round(hgt * 0.6)}px;
  font-weight: 800;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
@keyframes ${cls}-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% - ${gap}px)); }
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__viewport { -webkit-mask-image: none; mask-image: none; }
  .${cls}__track { flex-wrap: wrap; justify-content: center; row-gap: 16px; animation: none; }
  .${cls}__track[aria-hidden="true"] { display: none; }
}
`,
      markup: h(
        "div",
        { class: cls },
        !!s.title && h("p", { class: `${cls}__title` }, s.title),
        h("div", { class: `${cls}__viewport` }, track(false), track(true)),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: ScrollText,
        content: (
          <>
            <TextField {...p} k="title" label={f("title")} />
            <LinesField {...p} k="items" label={tr("marqueeItems")} hint={tr("marqueeItemsHint")} rows={7} />
            <RangeField {...p} k="speed" label={tr("loopDuration")} min={5} max={120} step={1} format={(v) => `${v}s`} />
            <SegmentedField {...p} k="direction" label={tr("direction")} options={[{ value: "left", label: tr("pos.left") }, { value: "right", label: tr("pos.right") }]} />
            <ToggleField {...p} k="pauseOnHover" label={tr("pauseOnHover")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="logoHeight" label={tr("logoHeight")} min={16} max={96} suffix="px" />
            <NumberField {...p} k="gap" label={f("spacing")} min={8} max={120} suffix="px" />
            <ToggleField {...p} k="grayscale" label={tr("grayscale")} />
            <ToggleField {...p} k="fade" label={tr("edgeFade")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="bgColor" label={f("bg")} />
          </>
        ),
      },
    ];
  },
});

/* ----------------------------- Modal Popup -------------------------- */

export interface ModalPopupState {
  triggerText: string;
  title: string;
  body: string;
  ctaText: string;
  ctaHref: string;
  closeOnBackdrop: boolean;
  maxWidth: number;
  triggerBg: string;
  triggerColor: string;
  panelBg: string;
  textColor: string;
  ctaBg: string;
  ctaColor: string;
  overlayColor: string;
  radius: number;
}

export const modalPopupElement = defineElement<ModalPopupState>({
  type: "modal-popup",
  label: "Modal Popup",
  group: "Premium",
  premium: true,
  componentName: "ModalPopup",
  defaultClassName: "custom-modal",
  defaults: {
    triggerText: "Dapatkan penawaran",
    title: "Diskon 20% untuk pelanggan baru",
    body: "Daftar hari ini dan nikmati semua fitur premium dengan harga spesial selama 3 bulan pertama.",
    ctaText: "Klaim sekarang",
    ctaHref: "#daftar",
    closeOnBackdrop: true,
    maxWidth: 480,
    triggerBg: "#2563eb",
    triggerColor: "#ffffff",
    panelBg: "#ffffff",
    textColor: "#0f172a",
    ctaBg: "#2563eb",
    ctaColor: "#ffffff",
    overlayColor: "#0f172a",
    radius: 16,
  },
  spec: (s, cls) => {
    const r = clamp(s.radius, 0, 32);
    const href = safeUrl(s.ctaHref);
    return {
      css: `.${cls} {
  display: inline-block;
}
.${cls}__trigger,
.${cls}__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 20px;
  border: 0;
  border-radius: ${Math.min(r, 12)}px;
  font: inherit;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}
.${cls}__trigger {
  background: ${color(s.triggerBg, "#2563eb")};
  color: ${color(s.triggerColor, "#ffffff")};
}
.${cls}__trigger:focus-visible,
.${cls}__cta:focus-visible {
  outline: 2px solid ${color(s.triggerBg, "#2563eb")};
  outline-offset: 2px;
}
.${cls}__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: color-mix(in srgb, ${color(s.overlayColor, "#0f172a")} 60%, transparent);
}
.${cls}__backdrop[hidden] {
  display: none;
}
.${cls}__panel {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: ${clamp(s.maxWidth, 280, 800)}px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  padding: 28px 24px 24px;
  border-radius: ${r}px;
  background: ${color(s.panelBg, "#ffffff")};
  color: ${color(s.textColor, "#0f172a")};
  box-shadow: 0 30px 60px -20px rgba(15, 23, 42, 0.45);
  animation: ${cls}-in 0.2s ease-out;
}
.${cls}__title {
  margin: 0 32px 8px 0;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.3;
}
.${cls}__body {
  margin: 0 0 20px;
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.85;
}
.${cls}__cta {
  background: ${color(s.ctaBg, "#2563eb")};
  color: ${color(s.ctaColor, "#ffffff")};
}
.${cls}__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}
.${cls}__close:hover,
.${cls}__close:focus-visible {
  background: rgba(15, 23, 42, 0.08);
}
@keyframes ${cls}-in {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__panel { animation: none; }
}
`,
      markup: h(
        "div",
        { class: cls, "data-backdrop-close": s.closeOnBackdrop ? "true" : "false" },
        h("button", { class: `${cls}__trigger`, type: "button", "aria-haspopup": "dialog", "aria-controls": `${cls}-dialog`, "data-modal-open": "" }, s.triggerText || "Buka"),
        h(
          "div",
          { class: `${cls}__backdrop`, hidden: true, "data-modal-backdrop": "" },
          h(
            "div",
            { class: `${cls}__panel`, id: `${cls}-dialog`, role: "dialog", "aria-modal": "true", "aria-labelledby": `${cls}-title`, tabindex: "-1" },
            h("button", { class: `${cls}__close`, type: "button", "aria-label": "Tutup", "data-modal-close": "" }, "×"),
            h("h2", { class: `${cls}__title`, id: `${cls}-title` }, s.title),
            !!s.body && h("p", { class: `${cls}__body` }, s.body),
            !!s.ctaText && h("a", { class: `${cls}__cta`, href }, s.ctaText),
          ),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var trigger = element.querySelector("[data-modal-open]");
var backdrop = element.querySelector("[data-modal-backdrop]");
var panel = backdrop ? backdrop.querySelector("[role=dialog]") : null;
var byBackdrop = element.getAttribute("data-backdrop-close") !== "false";
function focusables() {
  return Array.prototype.filter.call(panel.querySelectorAll("a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"), function (el) {
    return !el.disabled && el.offsetParent !== null;
  });
}
function open() {
  backdrop.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  var list = focusables();
  (list[0] || panel).focus();
}
function close() {
  if (backdrop.hidden) return;
  backdrop.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  trigger.focus();
}
if (trigger && backdrop && panel) {
  trigger.setAttribute("aria-expanded", "false");
  on(trigger, "click", open);
  on(panel.querySelector("[data-modal-close]"), "click", close);
  on(backdrop, "click", function (e) {
    if (byBackdrop && e.target === backdrop) close();
  });
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
        icon: MessageSquare,
        content: (
          <>
            <TextField {...p} k="triggerText" label={tr("triggerButton")} />
            <TextField {...p} k="title" label={f("title")} />
            <TextField {...p} k="body" label={f("body")} multiline rows={4} />
            <TextField {...p} k="ctaText" label={f("buttonText")} />
            <TextField {...p} k="ctaHref" label={f("buttonLink")} />
            <ToggleField {...p} k="closeOnBackdrop" label={tr("closeOnBackdrop")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="triggerBg" label={tr("buttonBg")} />
            <ColorField {...p} k="triggerColor" label={tr("buttonColor")} />
            <ColorField {...p} k="panelBg" label={f("panelBg")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="ctaBg" label={tr("ctaBg")} />
            <ColorField {...p} k="ctaColor" label={tr("ctaColor")} />
            <ColorField {...p} k="overlayColor" label={f("overlayColor")} />
            <NumberField {...p} k="maxWidth" label={tr("maxWidth")} min={280} max={800} suffix="px" />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={32} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ---------------------------- Before / After ------------------------ */

export interface BeforeAfterState {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  start: number;
  ratio: "16 / 9" | "4 / 3" | "1 / 1" | "3 / 4";
  radius: number;
  handleColor: string;
  showLabels: boolean;
}

export const beforeAfterElement = defineElement<BeforeAfterState>({
  type: "before-after",
  label: "Before / After",
  group: "Premium",
  premium: true,
  componentName: "BeforeAfter",
  defaultClassName: "custom-compare",
  defaults: {
    before: sceneImage(1200, 800, ["#7fb3d5", "#d6eaf8"], ["#5d8aa8", "#3e6d8e", "#2c4f66"], "#fff4d6", true),
    after: sceneImage(1200, 800, ["#7fb3d5", "#d6eaf8"], ["#5d8aa8", "#3e6d8e", "#2c4f66"]),
    beforeLabel: "Sebelum",
    afterLabel: "Sesudah",
    alt: "Perbandingan ruangan sebelum dan sesudah renovasi",
    start: 50,
    ratio: "16 / 9",
    radius: 16,
    handleColor: "#ffffff",
    showLabels: true,
  },
  spec: (s, cls) => {
    const pos = Math.round(clamp(s.start, 0, 100));
    const handle = color(s.handleColor, "#ffffff");
    const before = safeImage(s.before);
    const after = safeImage(s.after);
    return {
      css: `.${cls} {
  --pos: ${pos}%;
  position: relative;
  width: 100%;
  aspect-ratio: ${s.ratio};
  overflow: hidden;
  border-radius: ${clamp(s.radius, 0, 40)}px;
  background: #e2e8f0;
  user-select: none;
}
.${cls}__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.${cls}__after {
  clip-path: inset(0 0 0 var(--pos));
}
.${cls}__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--pos);
  width: 3px;
  margin-left: -1.5px;
  background: ${handle};
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
.${cls}__line::after {
  content: "\\2039\\203A";
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${handle};
  color: #0f172a;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}
.${cls}__range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: ew-resize;
}
.${cls}__range:focus-visible ~ .${cls}__line {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.${cls}__tag {
  position: absolute;
  top: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.65);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  pointer-events: none;
}
.${cls}__tag--before { left: 12px; }
.${cls}__tag--after { right: 12px; }
`,
      markup: h(
        "div",
        { class: cls, role: "group", "aria-label": s.alt || "Perbandingan sebelum dan sesudah" },
        !!before && h("img", { class: `${cls}__img`, src: safeUrl(before, ""), alt: s.beforeLabel ? `${s.beforeLabel}: ${s.alt}` : s.alt, loading: "lazy" }),
        !!after && h("img", { class: `${cls}__img ${cls}__after`, src: safeUrl(after, ""), alt: s.afterLabel ? `${s.afterLabel}: ${s.alt}` : s.alt, loading: "lazy" }),
        s.showLabels && !!s.beforeLabel && h("span", { class: `${cls}__tag ${cls}__tag--before`, "aria-hidden": "true" }, s.beforeLabel),
        s.showLabels && !!s.afterLabel && h("span", { class: `${cls}__tag ${cls}__tag--after`, "aria-hidden": "true" }, s.afterLabel),
        h("input", {
          class: `${cls}__range`,
          type: "range",
          min: "0",
          max: "100",
          step: "1",
          "html:value": String(pos),
          "jsx:defaultValue": String(pos),
          "aria-label": `${s.beforeLabel || "Sebelum"} / ${s.afterLabel || "Sesudah"}`,
          "data-compare-range": "",
        }),
        h("span", { class: `${cls}__line`, "aria-hidden": "true" }),
      ),
    };
  },
  customCode: () => ({
    js: `var range = element.querySelector("[data-compare-range]");
function update() {
  element.style.setProperty("--pos", range.value + "%");
}
if (range) {
  update();
  on(range, "input", update);
  on(range, "change", update);
}`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Columns2,
        content: (
          <>
            <ImageField {...p} k="before" label={tr("beforeImage")} />
            <ImageField {...p} k="after" label={tr("afterImage")} />
            <TextField {...p} k="alt" label={f("altText")} hint={f("altHint")} />
            <ToggleField {...p} k="showLabels" label={f("showLabel")} />
            <Show when={s.showLabels}>
              <TextField {...p} k="beforeLabel" label={tr("beforeLabel")} />
              <TextField {...p} k="afterLabel" label={tr("afterLabel")} />
            </Show>
            <RangeField {...p} k="start" label={tr("startPosition")} min={0} max={100} step={1} format={(v) => `${v}%`} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <SelectField
              {...p}
              k="ratio"
              label={f("aspectRatio")}
              options={[
                { value: "16 / 9", label: "16:9" },
                { value: "4 / 3", label: "4:3" },
                { value: "1 / 1", label: "1:1" },
                { value: "3 / 4", label: "3:4" },
              ]}
            />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={40} suffix="px" />
            <ColorField {...p} k="handleColor" label={tr("handleColor")} />
          </>
        ),
      },
    ];
  },
});

/* ----------------------------- Back to Top -------------------------- */

export interface BackToTopState {
  label: string;
  showText: boolean;
  offset: number;
  position: "left" | "right";
  size: number;
  bgColor: string;
  iconColor: string;
  hoverBg: string;
  radius: number;
  bottom: number;
}

export const backToTopElement = defineElement<BackToTopState>({
  type: "back-to-top",
  label: "Kembali ke Atas",
  group: "Premium",
  premium: true,
  componentName: "BackToTop",
  defaultClassName: "custom-totop",
  defaults: {
    label: "Kembali ke atas",
    showText: false,
    offset: 400,
    position: "right",
    size: 48,
    bgColor: "#0f172a",
    iconColor: "#ffffff",
    hoverBg: "#2563eb",
    radius: 999,
    bottom: 24,
  },
  spec: (s, cls) => {
    const size = clamp(s.size, 32, 80);
    return {
      css: `.${cls} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: ${size}px;
  height: ${size}px;
  padding: 0 ${s.showText ? 16 : 0}px;
  border: 0;
  border-radius: ${clamp(s.radius, 0, 999)}px;
  background: ${color(s.bgColor, "#0f172a")};
  color: ${color(s.iconColor, "#ffffff")};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 10px 25px -8px rgba(15, 23, 42, 0.5);
  cursor: pointer;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s, background-color 0.2s ease;
}
.${cls}:hover,
.${cls}:focus-visible {
  background: ${color(s.hoverBg, "#2563eb")};
}
.${cls}:focus-visible {
  outline: 2px solid ${color(s.hoverBg, "#2563eb")};
  outline-offset: 3px;
}
.${cls}__icon {
  font-size: ${Math.round(size * 0.42)}px;
  line-height: 1;
}
.${cls}__sr {
  ${SR_ONLY}
}
/* Mengambang hanya setelah runtime aktif (Pratinjau & ekspor); di canvas Desain tetap di alur. */
.${cls}[data-ready] {
  position: fixed;
  bottom: ${clamp(s.bottom, 8, 120)}px;
  ${s.position === "left" ? "left" : "right"}: 24px;
  z-index: 900;
}
.${cls}[data-ready]:not(.is-visible) {
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .${cls} { transition: none; }
}
`,
      markup: h(
        "button",
        { class: cls, type: "button", "aria-label": s.showText ? undefined : s.label || "Kembali ke atas", "data-offset": String(Math.round(clamp(s.offset, 0, 5000))) },
        h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, "↑"),
        s.showText && h("span", {}, s.label || "Kembali ke atas"),
      ),
    };
  },
  customCode: () => ({
    js: `var offset = +element.getAttribute("data-offset") || 0;
var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
element.setAttribute("data-ready", "");
function check() {
  var y = window.pageYOffset || document.documentElement.scrollTop || 0;
  var visible = y > offset;
  element.classList.toggle("is-visible", visible);
  if (visible) element.removeAttribute("tabindex");
  else element.setAttribute("tabindex", "-1");
}
check();
on(window, "scroll", check, { passive: true });
on(element, "click", function () {
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
});
onCleanup(function () {
  element.removeAttribute("data-ready");
  element.classList.remove("is-visible");
  element.removeAttribute("tabindex");
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: ArrowUpToLine,
        content: (
          <>
            <TextField {...p} k="label" label={f("label")} />
            <ToggleField {...p} k="showText" label={f("showLabel")} />
            <NumberField {...p} k="offset" label={tr("scrollOffset")} hint={tr("scrollOffsetHint")} min={0} max={5000} suffix="px" />
            <SegmentedField {...p} k="position" label={f("position")} options={[{ value: "left", label: f("left") }, { value: "right", label: f("right") }]} />
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
            <ColorField {...p} k="iconColor" label={f("iconColor")} />
            <ColorField {...p} k="hoverBg" label={f("bgOnHover")} />
            <NumberField {...p} k="size" label={f("size")} min={32} max={80} suffix="px" />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={999} suffix="px" />
            <NumberField {...p} k="bottom" label={tr("bottomOffset")} min={8} max={120} suffix="px" />
          </>
        ),
      },
    ];
  },
});
