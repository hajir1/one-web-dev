import {    Palette,  Search } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,    TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { safeUrl } from "../../../helpers/generatorCss";
import { clamp, color, fieldName } from "../shared";
import { tr, f, SR_ONLY, focusCss } from "./kit";

/* -------------------------- Search Field ------------------------- */

export interface SearchBarState {
  placeholder: string;
  buttonText: string;
  action: string;
  param: string;
  showIcon: boolean;
  accentColor: string;
  buttonColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  radius: number;
}

export const searchBarElement = defineElement<SearchBarState>({
  type: "search-bar",
  label: "Kolom Pencarian",
  group: "Form",
  componentName: "SearchBar",
  defaultClassName: "custom-search",
  defaults: {
    placeholder: "Cari produk, artikel, atau halaman…",
    buttonText: "Cari",
    action: "/cari",
    param: "q",
    showIcon: true,
    accentColor: "#2563eb",
    buttonColor: "#ffffff",
    bgColor: "#ffffff",
    borderColor: "#cbd5e1",
    textColor: "#0f172a",
    radius: 999,
  },
  spec: (s, cls) => {
    const accent = color(s.accentColor, "#2563eb");
    const r = clamp(s.radius, 0, 999);
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 5px 5px 5px ${s.showIcon ? 14 : 18}px;
  border: 1.5px solid ${color(s.borderColor, "#cbd5e1")};
  border-radius: ${r}px;
  background: ${color(s.bgColor, "#ffffff")};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.${cls}:focus-within {
  border-color: ${accent};
  box-shadow: 0 0 0 3px color-mix(in srgb, ${accent} 20%, transparent);
}
.${cls}__icon {
  flex-shrink: 0;
  color: ${color(s.borderColor, "#94a3b8")};
  font-size: 18px;
  line-height: 1;
}
.${cls}__sr {
  ${SR_ONLY}
}
.${cls}__input {
  flex: 1;
  min-width: 0;
  min-height: 40px;
  padding: 0 4px;
  border: 0;
  background: transparent;
  color: ${color(s.textColor, "#0f172a")};
  font: inherit;
  font-size: 15px;
  outline: none;
}
.${cls}__btn {
  flex-shrink: 0;
  min-height: 40px;
  padding: 0 20px;
  border: 0;
  border-radius: ${Math.max(0, r - 4)}px;
  background: ${accent};
  color: ${color(s.buttonColor, "#ffffff")};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.${cls}__btn:hover {
  filter: brightness(1.08);
}
.${cls}__btn:focus-visible {
  ${focusCss(accent)}
}
`,
      markup: h(
        "form",
        { class: cls, role: "search", action: safeUrl(s.action, "#"), method: "get" },
        s.showIcon && h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, "⌕"),
        h("label", { class: `${cls}__sr`, for: `${cls}-q` }, s.placeholder || tr("search")),
        h("input", { class: `${cls}__input`, id: `${cls}-q`, type: "search", name: fieldName(s.param, "q"), placeholder: s.placeholder || undefined, autocomplete: "off", "jsx:autoComplete": "off" }),
        h("button", { class: `${cls}__btn`, type: "submit" }, s.buttonText || tr("search")),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Search,
        content: (
          <>
            <TextField {...p} k="placeholder" label={f("placeholder")} />
            <TextField {...p} k="buttonText" label={f("buttonText")} />
            <TextField {...p} k="action" label={tr("formAction")} hint={tr("formActionHint")} />
            <TextField {...p} k="param" label={tr("queryParam")} />
            <ToggleField {...p} k="showIcon" label={f("icon")} />
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
            <ColorField {...p} k="buttonColor" label={tr("buttonText")} />
            <ColorField {...p} k="bgColor" label={f("bg")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={999} suffix="px" />
          </>
        ),
      },
    ];
  },
});
