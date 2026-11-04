import {       Palette,  SquareChevronDown } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SegmentedField,   TextField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color,   parseLinks } from "../shared";
import { tr, f, btnCss, outsideEsc } from "./kit";

/* -------------------------- Dropdown Button ------------------------- */

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
