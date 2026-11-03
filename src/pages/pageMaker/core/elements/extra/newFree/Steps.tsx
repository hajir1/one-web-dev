import {  ListOrdered,  Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SegmentedField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color,        parseSteps } from "../shared";
import { tr, f } from "./kit";

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
