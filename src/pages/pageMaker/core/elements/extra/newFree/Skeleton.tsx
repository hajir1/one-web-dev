import {    Palette,    SquareDashed } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,    TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color } from "../shared";
import { tr, f, SR_ONLY } from "./kit";

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
