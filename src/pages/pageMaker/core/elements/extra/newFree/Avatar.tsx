import {    Palette,        Users } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SegmentedField,  Show,  ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color,  initials,     parsePeople } from "../shared";
import { tr, f } from "./kit";

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
      "Sari Dewi",
      "Bima Pratama",
      "Nadia Putri",
      "Raka Aditya",
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
