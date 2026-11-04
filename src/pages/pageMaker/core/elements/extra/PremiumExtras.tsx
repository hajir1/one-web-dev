import { BadgeDollarSign, Columns3, Keyboard, Palette, PanelTop, TrendingUp } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, RangeField, SegmentedField, SelectField, TextField, ToggleField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { h } from "../../helpers/markup";
import { fontSizeCss, safeUrl } from "../../helpers/generatorCss";
import i18n from "../../../../../i18n";
import { cells, clamp, color, comparisonCell, formatStat, nonEmpty, parseMegaMenu, parsePlans, parseStat } from "./shared";

/* ================================================================== */
/* Extra PREMIUM elements: Animated Stats, Monthly/Yearly Pricing,       */
/* Mega Menu, Comparison Table, Typing Text (Typewriter).               */
/*                                                                    */
/* Static markup (h()) shows a tidy final state, so                     */
/* the Design canvas, search engines, and visitors without JS still see */
/* the full content. Animation/interaction is added through `customCode` (the */
/* Custom JS runtime) in Preview and in the exported output of all five frameworks. */
/* ================================================================== */

const tr = (k: string) => i18n.t(`el.x.${k}`);
const statLocale = (): "id" | "en" => (i18n.language?.startsWith("en") ? "en" : "id");

/* ------------------------- Statistik animasi ------------------------- */

export interface StatsCounterState {
  items: string[];
  columns: number;
  duration: number;
  numberColor: string;
  labelColor: string;
  accentColor: string;
  cardBg: string;
  numberSize: number;
  align: "left" | "center";
  divider: boolean;
}

export const statsCounterElement = defineElement<StatsCounterState>({
  type: "stats-counter",
  label: "Statistik Animasi",
  group: "Premium",
  premium: true,
  componentName: "AnimatedStats",
  defaultClassName: "custom-stats",
  defaults: {
    items: ["12.500+ | Pengguna aktif", "98% | Tingkat kepuasan", "4,9 | Rating rata-rata", "150+ | Integrasi"],
    columns: 4,
    duration: 1.6,
    numberColor: "#0f172a",
    labelColor: "#64748b",
    accentColor: "#2563eb",
    cardBg: "transparent",
    numberSize: 40,
    align: "center",
    divider: true,
  },
  spec: (s, cls) => {
    const loc = statLocale();
    const items = nonEmpty(s.items)
      .slice(0, 8)
      .map((l) => {
        const [num = "", label = ""] = cells(l);
        return { stat: parseStat(num), raw: num, label };
      });
    const cols = Math.round(clamp(s.columns, 1, 6));
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(${cols}, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
  text-align: ${s.align};
}
.${cls}__item {
  padding: 8px 12px;
  border-radius: 14px;
  background: ${s.cardBg === "transparent" ? "transparent" : color(s.cardBg, "transparent")};
}
${s.divider ? `.${cls}__item + .${cls}__item {\n  border-left: 1px solid color-mix(in srgb, ${color(s.labelColor, "#64748b")} 25%, transparent);\n}` : ""}
.${cls}__num {
  display: block;
  font-size: ${fontSizeCss({ fontSize: clamp(s.numberSize, 20, 96), fluidType: true })};
  font-weight: 800;
  line-height: 1.1;
  overflow-wrap: anywhere;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: ${color(s.numberColor, "#0f172a")};
}
.${cls}__num::after {
  content: "";
  display: block;
  width: 32px;
  height: 3px;
  margin: 10px ${s.align === "center" ? "auto" : "0"} 0;
  border-radius: 3px;
  background: ${color(s.accentColor, "#2563eb")};
}
.${cls}__label {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: ${color(s.labelColor, "#64748b")};
}
@media (max-width: 768px) {
  .${cls} { grid-template-columns: repeat(${Math.min(2, cols)}, minmax(0, 1fr)); }
  .${cls}__item + .${cls}__item { border-left: 0; }
}
`,
      markup: h(
        "div",
        { class: cls },
        items.map((it) =>
          h(
            "div",
            { class: `${cls}__item` },
            h(
              "span",
              it.stat
                ? {
                    class: `${cls}__num`,
                    "data-count": String(it.stat.value),
                    "data-decimals": String(it.stat.decimals),
                    "data-prefix": it.stat.prefix,
                    "data-suffix": it.stat.suffix,
                  }
                : { class: `${cls}__num` },
              it.stat ? `${it.stat.prefix}${formatStat(it.stat.value, it.stat.decimals, loc)}${it.stat.suffix}` : it.raw,
            ),
            h("span", { class: `${cls}__label` }, it.label),
          ),
        ),
      ),
    };
  },
  customCode: (s) => ({
    js: `var duration = ${Math.round(clamp(s.duration, 0.3, 6) * 1000)};
var sep = ${JSON.stringify(statLocale() === "id" ? "." : ",")};
var dot = ${JSON.stringify(statLocale() === "id" ? "," : ".")};
var nums = element.querySelectorAll("[data-count]");
var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function fmt(v, d) {
  var parts = Math.abs(v).toFixed(d).split(".");
  var s = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, sep);
  return (v < 0 ? "-" : "") + s + (parts[1] ? dot + parts[1] : "");
}
function show(el, v) {
  el.textContent = (el.getAttribute("data-prefix") || "") + fmt(v, +el.getAttribute("data-decimals") || 0) + (el.getAttribute("data-suffix") || "");
}
function run(el) {
  var target = +el.getAttribute("data-count");
  var start = null;
  function step(t) {
    if (!el.isConnected) return;
    if (start === null) start = t;
    var p = Math.min(1, (t - start) / duration);
    show(el, target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
if (!reduce && "IntersectionObserver" in window) {
  Array.prototype.forEach.call(nums, function (el) { show(el, 0); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { io.unobserve(e.target); run(e.target); }
    });
  }, { threshold: 0.4 });
  Array.prototype.forEach.call(nums, function (el) { io.observe(el); });
  onCleanup(function () { io.disconnect(); });
}`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: TrendingUp,
        content: (
          <>
            <LinesField {...p} k="items" label={tr("statItems")} hint={tr("statItemsHint")} rows={5} />
            <NumberField {...p} k="columns" label={tr("columns")} min={1} max={6} />
            <RangeField {...p} k="duration" label={tr("animDuration")} min={0.3} max={6} step={0.1} format={(v) => `${v}s`} />
            <SegmentedField {...p} k="align" label={i18n.t("el.f.alignment")} options={[{ value: "left", label: i18n.t("el.f.left") }, { value: "center", label: i18n.t("el.f.center") }]} />
            <ToggleField {...p} k="divider" label={i18n.t("el.f.showDivider")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="numberColor" label={i18n.t("el.f.numberColor")} />
            <ColorField {...p} k="labelColor" label={i18n.t("el.f.labelColor")} />
            <ColorField {...p} k="accentColor" label={i18n.t("el.f.accentColor")} />
            <ColorField {...p} k="cardBg" label={tr("cardBg")} />
            <NumberField {...p} k="numberSize" label={tr("numberSize")} min={20} max={96} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ---------------------- Monthly/yearly pricing ----------------------- */

export interface PricingSwitchState {
  monthlyLabel: string;
  yearlyLabel: string;
  saveBadge: string;
  periodMonthly: string;
  periodYearly: string;
  plans: string[];
  featured: number;
  ctaHref: string;
  accentColor: string;
  inkColor: string;
  cardBg: string;
  featuredBg: string;
  radius: number;
}

export const pricingSwitchElement = defineElement<PricingSwitchState>({
  type: "pricing-switch",
  label: "Harga Bulanan/Tahunan",
  group: "Premium",
  premium: true,
  componentName: "PricingSwitch",
  defaultClassName: "custom-pricing-switch",
  defaults: {
    monthlyLabel: "Bulanan",
    yearlyLabel: "Tahunan",
    saveBadge: "Hemat 20%",
    periodMonthly: "/bulan",
    periodYearly: "/tahun",
    plans: [
      "Starter | Rp49rb | Rp470rb | 1 proyek; 5 GB penyimpanan; Dukungan email | Mulai gratis",
      "Pro | Rp149rb | Rp1,4jt | 10 proyek; 100 GB penyimpanan; Analitik lanjutan; Dukungan prioritas | Coba Pro",
      "Tim | Rp399rb | Rp3,8jt | Proyek tanpa batas; 1 TB penyimpanan; SSO & audit log; Manajer akun | Hubungi sales",
    ],
    featured: 2,
    ctaHref: "#",
    accentColor: "#4f46e5",
    inkColor: "#0f172a",
    cardBg: "#ffffff",
    featuredBg: "#1e1b4b",
    radius: 20,
  },
  spec: (s, cls) => {
    const plans = parsePlans(s.plans);
    const accent = color(s.accentColor, "#4f46e5");
    const ink = color(s.inkColor, "#0f172a");
    const featuredIndex = Math.round(clamp(s.featured, 0, plans.length)) - 1;
    const r = clamp(s.radius, 0, 40);
    return {
      css: `.${cls} {
  box-sizing: border-box;
  width: 100%;
  color: ${ink};
}
.${cls}__switch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}
.${cls}__toggle {
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, ${accent} 14%, transparent);
  border: 1px solid color-mix(in srgb, ${accent} 30%, transparent);
}
.${cls}__opt {
  padding: 8px 18px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: ${ink};
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.${cls}__opt[aria-pressed="true"] {
  background: ${accent};
  color: #ffffff;
}
.${cls}__save {
  padding: 4px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-size: 12px;
  font-weight: 700;
}
.${cls}__grid {
  display: grid;
  grid-template-columns: repeat(${Math.max(1, plans.length)}, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
}
.${cls}__card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px;
  border: 1px solid color-mix(in srgb, ${ink} 10%, transparent);
  border-radius: ${r}px;
  background: ${color(s.cardBg, "#ffffff")};
}
.${cls}__card.is-featured {
  border-color: transparent;
  background: ${color(s.featuredBg, "#1e1b4b")};
  color: #ffffff;
  box-shadow: 0 24px 50px -24px color-mix(in srgb, ${accent} 70%, transparent);
}
.${cls}__name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}
.${cls}__price {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.${cls}__period {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.7;
}
.${cls}[data-billing="monthly"] [data-period="yearly"],
.${cls}[data-billing="yearly"] [data-period="monthly"] {
  display: none;
}
.${cls}__list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
}
.${cls}__list li::before {
  content: "✓";
  margin-right: 8px;
  color: ${accent};
  font-weight: 800;
}
.${cls}__card.is-featured .${cls}__list li::before {
  color: #a5b4fc;
}
.${cls}__cta {
  margin-top: auto;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${accent};
  color: #ffffff;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}
.${cls}__card.is-featured .${cls}__cta {
  background: #ffffff;
  color: ${color(s.featuredBg, "#1e1b4b")};
}
@media (max-width: 860px) {
  .${cls}__grid { grid-template-columns: minmax(0, 1fr); }
}
`,
      markup: h(
        "div",
        { class: cls, "data-billing": "monthly" },
        h(
          "div",
          { class: `${cls}__switch` },
          h(
            "div",
            { class: `${cls}__toggle`, role: "group", "aria-label": `${s.monthlyLabel} / ${s.yearlyLabel}` },
            h("button", { class: `${cls}__opt`, type: "button", "data-set": "monthly", "aria-pressed": "true" }, s.monthlyLabel),
            h("button", { class: `${cls}__opt`, type: "button", "data-set": "yearly", "aria-pressed": "false" }, s.yearlyLabel),
          ),
          !!s.saveBadge && h("span", { class: `${cls}__save` }, s.saveBadge),
        ),
        h(
          "div",
          { class: `${cls}__grid` },
          plans.map((p, i) =>
            h(
              "div",
              { class: i === featuredIndex ? `${cls}__card is-featured` : `${cls}__card` },
              h("p", { class: `${cls}__name` }, p.name),
              h(
                "p",
                { class: `${cls}__price` },
                h("span", { "data-period": "monthly" }, p.monthly, h("span", { class: `${cls}__period` }, ` ${s.periodMonthly}`)),
                h("span", { "data-period": "yearly" }, p.yearly, h("span", { class: `${cls}__period` }, ` ${s.periodYearly}`)),
              ),
              h("ul", { class: `${cls}__list` }, p.features.map((f) => h("li", {}, f))),
              !!p.cta && h("a", { class: `${cls}__cta`, href: safeUrl(s.ctaHref) }, p.cta),
            ),
          ),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var buttons = element.querySelectorAll("[data-set]");
Array.prototype.forEach.call(buttons, function (btn) {
  on(btn, "click", function () {
    var mode = btn.getAttribute("data-set");
    element.setAttribute("data-billing", mode);
    Array.prototype.forEach.call(buttons, function (b) {
      b.setAttribute("aria-pressed", String(b === btn));
    });
  });
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: BadgeDollarSign,
        content: (
          <>
            <LinesField {...p} k="plans" label={tr("plans")} hint={tr("plansHint")} rows={6} />
            <NumberField {...p} k="featured" label={tr("featuredIndex")} hint={tr("featuredIndexHint")} min={0} max={4} />
            <TextField {...p} k="monthlyLabel" label={tr("monthlyLabel")} />
            <TextField {...p} k="yearlyLabel" label={tr("yearlyLabel")} />
            <TextField {...p} k="periodMonthly" label={tr("periodMonthly")} />
            <TextField {...p} k="periodYearly" label={tr("periodYearly")} />
            <TextField {...p} k="saveBadge" label={tr("saveBadge")} />
            <TextField {...p} k="ctaHref" label={i18n.t("el.f.hrefLabel")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="accentColor" label={i18n.t("el.f.accentColor")} />
            <ColorField {...p} k="inkColor" label={i18n.t("el.f.textColor")} />
            <ColorField {...p} k="cardBg" label={tr("cardBg")} />
            <ColorField {...p} k="featuredBg" label={tr("featuredBg")} />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={40} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ------------------------------ Mega menu --------------------------- */

export interface MegaMenuState {
  items: string[];
  ctaText: string;
  ctaHref: string;
  textColor: string;
  hoverColor: string;
  panelBg: string;
  ctaBg: string;
  align: "start" | "center" | "end";
  columns: number;
}

export const megaMenuElement = defineElement<MegaMenuState>({
  type: "mega-menu",
  label: "Mega Menu",
  group: "Premium",
  premium: true,
  componentName: "MegaMenu",
  defaultClassName: "custom-mega-menu",
  defaults: {
    items: [
      "Produk | #produk",
      "- Analitik | Dasbor real-time untuk tim | #analitik",
      "- Otomasi | Alur kerja tanpa kode | #otomasi",
      "- Integrasi | 150+ aplikasi terhubung | #integrasi",
      "- Keamanan | SSO, audit log, enkripsi | #keamanan",
      "Solusi | #solusi",
      "- Startup | Bergerak cepat sejak hari pertama | #startup",
      "- Enterprise | Skala, kepatuhan, dukungan | #enterprise",
      "- Agensi | Kelola banyak klien | #agensi",
      "Harga | #harga",
      "Sumber Daya | #sumber",
      "- Blog | Kabar dan tutorial | #blog",
      "- Dokumentasi | Panduan lengkap | #docs",
    ],
    ctaText: "Coba gratis",
    ctaHref: "#",
    textColor: "#0f172a",
    hoverColor: "#4f46e5",
    panelBg: "#ffffff",
    ctaBg: "#4f46e5",
    align: "end",
    columns: 2,
  },
  spec: (s, cls) => {
    const items = parseMegaMenu(s.items);
    const hover = color(s.hoverColor, "#4f46e5");
    return {
      css: `.${cls} {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: ${s.align === "start" ? "flex-start" : s.align === "center" ? "center" : "flex-end"};
  gap: 4px;
  width: 100%;
  font-size: 15px;
  color: ${color(s.textColor, "#0f172a")};
}
.${cls}__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${cls}__item {
  position: static;
}
.${cls}__top {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.${cls}__top:hover,
.${cls}__top:focus-visible,
.${cls}__item.is-open > .${cls}__top {
  color: ${hover};
  background: color-mix(in srgb, ${hover} 8%, transparent);
}
.${cls}__caret {
  font-size: 10px;
  transition: transform 0.2s ease;
}
.${cls}__item.is-open .${cls}__caret {
  transform: rotate(180deg);
}
.${cls}__panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(${Math.round(clamp(s.columns, 1, 4))}, minmax(0, 1fr));
  gap: 6px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: ${color(s.panelBg, "#ffffff")};
  box-shadow: 0 24px 48px -16px rgba(15, 23, 42, 0.25);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
}
.${cls}__item:hover > .${cls}__panel,
.${cls}__item:focus-within > .${cls}__panel,
.${cls}__item.is-open > .${cls}__panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.${cls}__link {
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  color: inherit;
  text-decoration: none;
}
.${cls}__link:hover,
.${cls}__link:focus-visible {
  background: color-mix(in srgb, ${hover} 8%, transparent);
}
.${cls}__link strong {
  display: block;
  font-size: 14px;
}
.${cls}__link span {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  color: #64748b;
}
.${cls}__cta {
  margin-left: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  background: ${color(s.ctaBg, "#4f46e5")};
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
}
.${cls}__drawer {
  display: contents;
}
.${cls}__burger {
  display: none;
}
@media (max-width: 1024px) {
  .${cls} { order: 2; flex-wrap: nowrap; width: auto; }
  .${cls}__burger { display: inline-flex; flex-direction: column; justify-content: center; gap: 5px; width: 44px; height: 44px; padding: 0 11px; border: 0; border-radius: 10px; background: none; color: inherit; cursor: pointer; box-sizing: border-box; }
  .${cls}__burger span { display: block; height: 2px; border-radius: 2px; background: currentColor; transition: transform 0.2s ease, opacity 0.2s ease; }
  .${cls}.is-menu-open .${cls}__burger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .${cls}.is-menu-open .${cls}__burger span:nth-child(2) { opacity: 0; }
  .${cls}.is-menu-open .${cls}__burger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .${cls}__drawer { position: absolute; top: calc(100% + 8px); ${s.align === "start" ? "left: 0;" : s.align === "center" ? "left: 50%; transform: translateX(-50%);" : "right: 0;"} z-index: 60; display: none; flex-direction: column; width: min(340px, calc(100vw - 64px)); max-height: calc(100vh - 120px); overflow-y: auto; padding: 10px; border: 1px solid color-mix(in srgb, currentColor 14%, transparent); border-radius: 16px; background: ${color(s.panelBg, "#ffffff")}; box-shadow: 0 24px 48px -16px rgba(15, 23, 42, 0.35); box-sizing: border-box; }
  .${cls}.is-menu-open .${cls}__drawer { display: flex; }
  .${cls}__list { flex-direction: column; align-items: stretch; width: 100%; }
  .${cls}__top { width: 100%; justify-content: space-between; box-sizing: border-box; }
  .${cls}__panel { position: static; display: none; grid-template-columns: minmax(0, 1fr); margin: 2px 0 6px; padding: 4px 0 4px 8px; border: 0; background: none; box-shadow: none; opacity: 1; visibility: visible; transform: none; }
  .${cls}__item:hover > .${cls}__panel, .${cls}__item:focus-within > .${cls}__panel { display: none; }
  .${cls}__item.is-open > .${cls}__panel { display: grid; }
  .${cls}__link span { color: inherit; opacity: 0.7; }
  .${cls}__cta { margin: 8px 0 0; text-align: center; }
}
`,
      markup: h(
        "nav",
        { class: cls, "aria-label": "Menu utama" },
        h("button", { class: `${cls}__burger`, type: "button", "aria-expanded": "false", "aria-controls": `${cls}-drawer`, "aria-label": i18n.t("el.f.openMenu") }, h("span", {}), h("span", {}), h("span", {})),
        h(
          "div",
          { class: `${cls}__drawer`, id: `${cls}-drawer` },
          h(
            "ul",
            { class: `${cls}__list` },
            items.map((it, i) =>
              h(
                "li",
                { class: `${cls}__item` },
                it.links.length
                  ? [
                      h(
                        "button",
                        { class: `${cls}__top`, type: "button", "aria-expanded": "false", "aria-controls": `${cls}-panel-${i}` },
                        it.label,
                        h("span", { class: `${cls}__caret`, "aria-hidden": "true" }, "▼"),
                      ),
                      h(
                        "div",
                        { class: `${cls}__panel`, id: `${cls}-panel-${i}` },
                        it.links.map((l) => h("a", { class: `${cls}__link`, href: safeUrl(l.href) }, h("strong", {}, l.title), !!l.description && h("span", {}, l.description))),
                      ),
                    ]
                  : h("a", { class: `${cls}__top`, href: safeUrl(it.href) }, it.label),
              ),
            ),
          ),
          !!s.ctaText && h("a", { class: `${cls}__cta`, href: safeUrl(s.ctaHref) }, s.ctaText),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var items = element.querySelectorAll("li");
function closeAll(except) {
  Array.prototype.forEach.call(items, function (li) {
    if (li === except) return;
    li.classList.remove("is-open");
    var b = li.querySelector("button[aria-expanded]");
    if (b) b.setAttribute("aria-expanded", "false");
  });
}
Array.prototype.forEach.call(items, function (li) {
  var btn = li.querySelector("button[aria-expanded]");
  if (!btn) return;
  on(btn, "click", function () {
    var open = !li.classList.contains("is-open");
    closeAll(li);
    li.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
});
var burger = element.querySelector("button[aria-controls$='-drawer']");
function setMenu(open) {
  element.classList.toggle("is-menu-open", open);
  if (burger) burger.setAttribute("aria-expanded", String(open));
}
if (burger) on(burger, "click", function () {
  setMenu(!element.classList.contains("is-menu-open"));
});
on(document, "click", function (e) {
  if (!element.contains(e.target)) { closeAll(null); setMenu(false); }
});
on(document, "keydown", function (e) {
  if (e.key === "Escape") { closeAll(null); setMenu(false); }
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: PanelTop,
        content: (
          <>
            <LinesField {...p} k="items" label={tr("megaItems")} hint={tr("megaItemsHint")} rows={10} />
            <NumberField {...p} k="columns" label={tr("panelColumns")} min={1} max={4} />
            <SegmentedField {...p} k="align" label={i18n.t("el.f.alignment")} options={[{ value: "start", label: i18n.t("el.f.left") }, { value: "center", label: i18n.t("el.f.center") }, { value: "end", label: i18n.t("el.f.right") }]} />
            <TextField {...p} k="ctaText" label={i18n.t("el.f.ctaButton")} />
            <TextField {...p} k="ctaHref" label={i18n.t("el.f.hrefLabel")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <ColorField {...p} k="hoverColor" label={i18n.t("el.f.hoverColor")} />
            <ColorField {...p} k="panelBg" label={i18n.t("el.f.panelBg")} />
            <ColorField {...p} k="ctaBg" label={tr("buttonBg")} />
          </>
        ),
      },
    ];
  },
});

/* -------------------------- Comparison table ----------------------- */

export interface ComparisonTableState {
  columns: string[];
  rows: string[];
  highlight: number;
  caption: string;
  accentColor: string;
  headerBg: string;
  textColor: string;
  yesColor: string;
  noColor: string;
  radius: number;
}

export const comparisonTableElement = defineElement<ComparisonTableState>({
  type: "comparison-table",
  label: "Tabel Perbandingan",
  group: "Premium",
  premium: true,
  componentName: "ComparisonTable",
  defaultClassName: "custom-compare",
  defaults: {
    columns: ["Starter", "Pro", "Enterprise"],
    rows: [
      "Jumlah proyek | 1 | 10 | Tanpa batas",
      "Domain kustom | tidak | ya | ya",
      "Analitik lanjutan | tidak | ya | ya",
      "SSO & audit log | tidak | tidak | ya",
      "Dukungan | Email | Prioritas | Manajer akun",
    ],
    highlight: 2,
    caption: "Bandingkan paket",
    accentColor: "#4f46e5",
    headerBg: "#f8fafc",
    textColor: "#0f172a",
    yesColor: "#16a34a",
    noColor: "#cbd5e1",
    radius: 16,
  },
  spec: (s, cls) => {
    const columns = nonEmpty(s.columns).slice(0, 5);
    const rows = nonEmpty(s.rows)
      .slice(0, 30)
      .map((l) => {
        const [label = "", ...vals] = cells(l);
        return { label, vals: columns.map((_, i) => comparisonCell(vals[i] ?? "")) };
      });
    const hi = Math.round(clamp(s.highlight, 0, columns.length));
    const accent = color(s.accentColor, "#4f46e5");
    const hiCss = hi
      ? `.${cls} th:nth-child(${hi + 1}),
.${cls} td:nth-child(${hi + 1}) {
  background: color-mix(in srgb, ${accent} 7%, #ffffff);
}
.${cls} thead th:nth-child(${hi + 1}) {
  background: ${accent};
  color: #ffffff;
}`
      : "";
    return {
      css: `.${cls} {
  box-sizing: border-box;
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: ${clamp(s.radius, 0, 32)}px;
  -webkit-overflow-scrolling: touch;
}
.${cls} table {
  width: 100%;
  min-width: ${160 + columns.length * 120}px;
  border-collapse: collapse;
  color: ${color(s.textColor, "#0f172a")};
  font-size: 14px;
}
.${cls} caption {
  padding: 14px 16px;
  font-weight: 700;
  text-align: left;
}
.${cls} th,
.${cls} td {
  padding: 14px 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}
.${cls} thead th {
  background: ${color(s.headerBg, "#f8fafc")};
  font-weight: 700;
}
.${cls} tbody th {
  position: sticky;
  left: 0;
  background: #ffffff;
  font-weight: 600;
  text-align: left;
}
.${cls}__yes {
  color: ${color(s.yesColor, "#16a34a")};
  font-size: 18px;
  font-weight: 800;
}
.${cls}__no {
  color: ${color(s.noColor, "#cbd5e1")};
  font-size: 18px;
  font-weight: 800;
}
${hiCss}
`,
      markup: h(
        "div",
        { class: cls },
        h(
          "table",
          {},
          !!s.caption && h("caption", {}, s.caption),
          h("thead", {}, h("tr", {}, h("th", { scope: "col" }, ""), columns.map((c) => h("th", { scope: "col" }, c)))),
          h(
            "tbody",
            {},
            rows.map((r) =>
              h(
                "tr",
                {},
                h("th", { scope: "row" }, r.label),
                r.vals.map((v) =>
                  h(
                    "td",
                    {},
                    v === true
                      ? h("span", { class: `${cls}__yes`, role: "img", "aria-label": "Ya" }, "✓")
                      : v === false
                        ? h("span", { class: `${cls}__no`, role: "img", "aria-label": "Tidak" }, "–")
                        : v,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Columns3,
        content: (
          <>
            <TextField {...p} k="caption" label={tr("caption")} />
            <LinesField {...p} k="columns" label={tr("compareColumns")} rows={4} />
            <LinesField {...p} k="rows" label={tr("compareRows")} hint={tr("compareRowsHint")} rows={8} />
            <NumberField {...p} k="highlight" label={tr("highlightColumn")} hint={tr("featuredIndexHint")} min={0} max={5} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="accentColor" label={i18n.t("el.f.accentColor")} />
            <ColorField {...p} k="headerBg" label={tr("headerBg")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <ColorField {...p} k="yesColor" label={tr("yesColor")} />
            <ColorField {...p} k="noColor" label={tr("noColor")} />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={32} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ------------------------------ Typewriter -------------------------- */

export interface TypewriterState {
  prefix: string;
  words: string[];
  tag: "h1" | "h2" | "h3" | "p";
  fontSize: number;
  textColor: string;
  wordColor: string;
  align: "left" | "center";
  typeSpeed: number;
  pause: number;
  cursor: boolean;
}

export const typewriterElement = defineElement<TypewriterState>({
  type: "typewriter",
  label: "Teks Mengetik",
  group: "Premium",
  premium: true,
  componentName: "Typewriter",
  defaultClassName: "custom-typewriter",
  defaults: {
    prefix: "Bangun website untuk",
    words: ["startup", "agensi", "toko online", "portofolio"],
    tag: "h2",
    fontSize: 40,
    textColor: "#0f172a",
    wordColor: "#4f46e5",
    align: "left",
    typeSpeed: 70,
    pause: 1.6,
    cursor: true,
  },
  spec: (s, cls) => {
    const words = nonEmpty(s.words).map((w) => w.replace(/\|/g, "/")).slice(0, 12);
    const size = clamp(s.fontSize, 14, 96);
    return {
      css: `.${cls} {
  margin: 0;
  font-size: ${fontSizeCss({ fontSize: size, fluidType: true })};
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: ${color(s.textColor, "#0f172a")};
  text-align: ${s.align};
}
.${cls}__word {
  margin-left: 0.25em;
  color: ${color(s.wordColor, "#4f46e5")};
  white-space: nowrap;
}
@media (max-width: 480px) {
  .${cls}__word {
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
${
  s.cursor
    ? `.${cls}__word::after {
  content: "";
  display: inline-block;
  width: 3px;
  height: 0.9em;
  margin-left: 4px;
  vertical-align: -0.08em;
  background: currentColor;
  animation: ${cls}-blink 1s steps(1) infinite;
}
@keyframes ${cls}-blink {
  50% { opacity: 0; }
}`
    : ""
}
@media (max-width: 640px) {
  .${cls} { font-size: ${Math.round(size * 0.72)}px; }
}
`,
      markup: h(
        s.tag,
        { class: cls, "data-words": words.join("|") },
        s.prefix.trim(),
        h("span", { class: `${cls}__word`, "aria-live": "polite" }, words[0] ?? ""),
      ),
    };
  },
  customCode: (s) => ({
    js: `var target = element.querySelector("span");
var words = [];
words = (element.getAttribute("data-words") || "").split("|").filter(Boolean);
var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (target && words.length > 1) {
  var speed = ${Math.round(clamp(s.typeSpeed, 20, 300))};
  var pause = ${Math.round(clamp(s.pause, 0.3, 8) * 1000)};
  var i = 0, n = words[0].length, deleting = true, timer = null;
  target.setAttribute("aria-live", "off");
  function tick() {
    if (!element.isConnected) return;
    var word = words[i];
    if (reduce) {
      i = (i + 1) % words.length;
      target.textContent = words[i];
      timer = setTimeout(tick, pause + 800);
      return;
    }
    n += deleting ? -1 : 1;
    target.textContent = word.slice(0, Math.max(0, n));
    var delay = deleting ? speed / 2 : speed;
    if (!deleting && n >= word.length) { deleting = true; delay = pause; }
    else if (deleting && n <= 0) { deleting = false; i = (i + 1) % words.length; delay = speed * 4; }
    timer = setTimeout(tick, delay);
  }
  timer = setTimeout(tick, pause);
  onCleanup(function () { clearTimeout(timer); });
}`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Keyboard,
        content: (
          <>
            <TextField {...p} k="prefix" label={tr("prefix")} />
            <LinesField {...p} k="words" label={tr("words")} hint={tr("wordsHint")} rows={5} />
            <SelectField
              {...p}
              k="tag"
              label={i18n.t("el.f.htmlTag")}
              options={[
                { value: "h1", label: "H1" },
                { value: "h2", label: "H2" },
                { value: "h3", label: "H3" },
                { value: "p", label: "P" },
              ]}
            />
            <SegmentedField {...p} k="align" label={i18n.t("el.f.alignment")} options={[{ value: "left", label: i18n.t("el.f.left") }, { value: "center", label: i18n.t("el.f.center") }]} />
            <ToggleField {...p} k="cursor" label={tr("cursor")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="fontSize" label={i18n.t("el.f.textSize")} min={14} max={96} suffix="px" />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <ColorField {...p} k="wordColor" label={tr("wordColor")} />
            <RangeField {...p} k="typeSpeed" label={tr("typeSpeed")} min={20} max={300} step={10} format={(v) => `${v} ms`} />
            <RangeField {...p} k="pause" label={tr("pause")} min={0.3} max={8} step={0.1} format={(v) => `${v}s`} />
          </>
        ),
      },
    ];
  },
});
