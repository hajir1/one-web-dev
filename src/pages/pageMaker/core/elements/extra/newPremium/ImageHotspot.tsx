import {   Crosshair,    Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField, LinesField, NumberField,  SelectField,  TextField, ToggleField, ImageField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { safeUrl } from "../../../helpers/generatorCss";
import { clamp, color,  parseHotspots } from "../shared";
import { tr, f,  outsideEsc } from "./kit";
import { roomImage } from "../../placeholders";

/* -------------------------- Hotspot Image -------------------------- */

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
    image: roomImage(1400, 900),
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
