import { ChevronsLeftRight,   Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,   Show, TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp, color,    pageHref, paginationItems } from "../shared";
import { tr, f,  focusCss } from "./kit";

/* ----------------------------- Paginasi ----------------------------- */

export interface PaginationState {
  total: number;
  current: number;
  hrefPattern: string;
  showPrevNext: boolean;
  prevText: string;
  nextText: string;
  accentColor: string;
  activeText: string;
  textColor: string;
  borderColor: string;
  radius: number;
}

export const paginationElement = defineElement<PaginationState>({
  type: "pagination",
  label: "Paginasi",
  group: "Navigasi",
  componentName: "Pagination",
  defaultClassName: "custom-pagination",
  defaults: {
    total: 12,
    current: 4,
    hrefPattern: "?page={n}",
    showPrevNext: true,
    prevText: "Sebelumnya",
    nextText: "Berikutnya",
    accentColor: "#2563eb",
    activeText: "#ffffff",
    textColor: "#334155",
    borderColor: "#e2e8f0",
    radius: 8,
  },
  spec: (s, cls) => {
    const total = Math.round(clamp(s.total, 1, 999));
    const cur = Math.round(clamp(s.current, 1, total));
    const accent = color(s.accentColor, "#2563eb");
    const link = (n: number, label: string, extra = "") =>
      h("li", {}, h("a", { class: `${cls}__link${extra}`, href: pageHref(s.hrefPattern, n), "aria-label": /^\d+$/.test(label) ? `${tr("page")} ${n}` : undefined }, label));
    const disabled = (label: string, extra: string) => h("li", {}, h("span", { class: `${cls}__link ${extra} is-disabled`, "aria-disabled": "true" }, label));
    return {
      css: `.${cls}__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${cls}__link {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${color(s.borderColor, "#e2e8f0")};
  border-radius: ${clamp(s.radius, 0, 999)}px;
  color: ${color(s.textColor, "#334155")};
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
a.${cls}__link:hover {
  border-color: ${accent};
  color: ${accent};
}
a.${cls}__link:focus-visible {
  ${focusCss(accent)}
}
.${cls}__link[aria-current="page"] {
  border-color: ${accent};
  background: ${accent};
  color: ${color(s.activeText, "#ffffff")};
}
.${cls}__gap {
  border-color: transparent;
}
.${cls}__link.is-disabled {
  opacity: 0.45;
}
@media (max-width: 480px) {
  .${cls}__edge { display: none; }
}
`,
      markup: h(
        "nav",
        { class: cls, "aria-label": tr("pagination") },
        h(
          "ul",
          { class: `${cls}__list` },
          s.showPrevNext && (cur > 1 ? link(cur - 1, `‹ ${s.prevText}`, ` ${cls}__edge`) : disabled(`‹ ${s.prevText}`, `${cls}__edge`)),
          paginationItems(total, cur).map((it) =>
            it === "…"
              ? h("li", { "aria-hidden": "true" }, h("span", { class: `${cls}__link ${cls}__gap` }, "…"))
              : it === cur
                ? h("li", {}, h("a", { class: `${cls}__link`, href: pageHref(s.hrefPattern, it), "aria-current": "page", "aria-label": `${tr("page")} ${it}` }, String(it)))
                : link(it, String(it)),
          ),
          s.showPrevNext && (cur < total ? link(cur + 1, `${s.nextText} ›`, ` ${cls}__edge`) : disabled(`${s.nextText} ›`, `${cls}__edge`)),
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
        icon: ChevronsLeftRight,
        content: (
          <>
            <NumberField {...p} k="total" label={tr("totalPages")} min={1} max={999} />
            <NumberField {...p} k="current" label={tr("currentPage")} min={1} max={999} />
            <TextField {...p} k="hrefPattern" label={tr("hrefPattern")} hint={tr("hrefPatternHint")} />
            <ToggleField {...p} k="showPrevNext" label={tr("showPrevNext")} />
            <Show when={s.showPrevNext}>
              <TextField {...p} k="prevText" label={tr("prevText")} />
              <TextField {...p} k="nextText" label={tr("nextText")} />
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
            <ColorField {...p} k="accentColor" label={f("activePageColor")} />
            <ColorField {...p} k="activeText" label={tr("activeText")} />
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="borderColor" label={f("border")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={999} suffix="px" />
          </>
        ),
      },
    ];
  },
});
