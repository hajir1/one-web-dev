import { BarChart3, MessageSquareQuote, Palette, Tag } from "lucide-react";
import type { PanelSection, Updater } from "../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, RangeField, SegmentedField, TextField, ToggleField, Show, ImageField } from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import { h } from "../../helpers/markup";
import { safeUrl } from "../../helpers/generatorCss";
import { safeColor } from "../../helpers/background";
import i18n from "../../../../../i18n";
import { boxImage } from "../placeholders";

/* ================================================================== */
/* PREMIUM element templates (static): Progress Bar, Testimonial, Card  */
/* Pricing. Only HTML + CSS, so the output is identical in every framework. */
/* ================================================================== */

const col = (c: string, d: string) => safeColor(c) ?? d;
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));

/* ------------------------------ Progress ---------------------------- */

export interface ProgressState {
  label: string;
  value: number;
  showValue: boolean;
  striped: boolean;
  barColor: string;
  trackColor: string;
  textColor: string;
  height: number;
  radius: number;
}

const PROGRESS_DEFAULT: ProgressState = {
  label: "Progres proyek",
  value: 72,
  showValue: true,
  striped: false,
  barColor: "#2563eb",
  trackColor: "#e5e7eb",
  textColor: "#1f2937",
  height: 12,
  radius: 999,
};

export const progressElement = defineElement<ProgressState>({
  type: "progress",
  label: "Progress Bar",
  group: "Premium",
  premium: true,
  componentName: "ProgressBar",
  defaultClassName: "custom-progress",
  defaults: PROGRESS_DEFAULT,
  spec: (s, cls) => {
    const v = clamp(s.value, 0, 100);
    const bar = col(s.barColor, "#2563eb");
    return {
      css: `.${cls} {
  box-sizing: border-box;
  width: 100%;
  color: ${col(s.textColor, "#1f2937")};
}
.${cls}__head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}
.${cls}__track {
  height: ${clamp(s.height, 2, 60)}px;
  border-radius: ${clamp(s.radius, 0, 999)}px;
  background: ${col(s.trackColor, "#e5e7eb")};
  overflow: hidden;
}
.${cls}__bar {
  width: ${v}%;
  height: 100%;
  border-radius: inherit;
  background: ${
        s.striped
          ? `repeating-linear-gradient(45deg, ${bar} 0 10px, rgba(255, 255, 255, 0.25) 10px 20px), ${bar}`
          : bar
      };
  transition: width 0.6s ease;
}
`,
      markup: h(
        "div",
        { class: cls },
        h("div", { class: `${cls}__head` }, h("span", { class: `${cls}__label` }, s.label), s.showValue && h("span", { class: `${cls}__value` }, `${v}%`)),
        h(
          "div",
          {
            class: `${cls}__track`,
            role: "progressbar",
            "aria-valuenow": String(v),
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            "aria-label": s.label || "Progres",
          },
          h("div", { class: `${cls}__bar` }),
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
        icon: BarChart3,
        content: (
          <>
            <TextField {...p} k="label" label={i18n.t("el.f.label")} />
            <RangeField {...p} k="value" label={i18n.t("el.f.value")} min={0} max={100} format={(v) => `${v}%`} />
            <ToggleField {...p} k="showValue" label={i18n.t("el.f.showPercent")} />
            <ToggleField {...p} k="striped" label={i18n.t("el.f.stripedBar")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="barColor" label={i18n.t("el.f.barColor")} />
            <ColorField {...p} k="trackColor" label={i18n.t("el.f.trackColor")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <NumberField {...p} k="height" label={i18n.t("el.f.height")} min={2} max={60} suffix="px" />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={999} suffix="px" />
          </>
        ),
      },
    ];
  },
});

/* ----------------------------- Testimoni ----------------------------- */

export interface TestimonialState {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  align: "left" | "center";
  bgColor: string;
  textColor: string;
  accentColor: string;
  radius: number;
  shadow: boolean;
}

const TESTI_DEFAULT: TestimonialState = {
  quote: "Layanannya cepat dan hasilnya rapi. Tim kami bisa meluncurkan halaman baru dalam hitungan jam.",
  author: "Rina Kartika",
  role: "Product Manager, Contoh Studio",
  avatar: boxImage(96, 96, "RK"),
  rating: 5,
  align: "left",
  bgColor: "#ffffff",
  textColor: "#1f2937",
  accentColor: "#f59e0b",
  radius: 16,
  shadow: true,
};

export const testimonialElement = defineElement<TestimonialState>({
  type: "testimonial",
  label: "Testimoni",
  group: "Premium",
  premium: true,
  componentName: "Testimonial",
  defaultClassName: "custom-testimonial",
  defaults: TESTI_DEFAULT,
  spec: (s, cls) => {
    const rating = Math.round(clamp(s.rating, 0, 5));
    const center = s.align === "center";
    const avatar = s.avatar.trim() ? safeUrl(s.avatar, "") : "";
    return {
      css: `.${cls} {
  box-sizing: border-box;
  margin: 0;
  padding: 24px;
  border-radius: ${clamp(s.radius, 0, 64)}px;
  background: ${col(s.bgColor, "#ffffff")};
  color: ${col(s.textColor, "#1f2937")};
  text-align: ${center ? "center" : "left"};
${s.shadow ? "  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);\n" : ""}}
.${cls}__stars {
  color: ${col(s.accentColor, "#f59e0b")};
  letter-spacing: 2px;
  font-size: 16px;
}
.${cls}__quote {
  margin: 12px 0 20px;
  font-size: 16px;
  line-height: 1.6;
}
.${cls}__author {
  display: flex;
  align-items: center;
  gap: 12px;
${center ? "  justify-content: center;\n" : ""}}
.${cls}__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.${cls}__name {
  display: block;
  font-style: normal;
  font-weight: 700;
}
.${cls}__role {
  display: block;
  font-size: 13px;
  opacity: 0.7;
}
`,
      markup: h(
        "figure",
        { class: cls },
        rating > 0 && h("div", { class: `${cls}__stars`, role: "img", "aria-label": `Rating ${rating} dari 5` }, "★".repeat(rating) + "☆".repeat(5 - rating)),
        h("blockquote", { class: `${cls}__quote` }, h("p", {}, s.quote)),
        h(
          "figcaption",
          { class: `${cls}__author` },
          !!avatar && h("img", { class: `${cls}__avatar`, src: avatar, alt: "", loading: "lazy" }),
          h("div", {}, h("cite", { class: `${cls}__name` }, s.author), !!s.role && h("span", { class: `${cls}__role` }, s.role)),
        ),
      ),
    };
  },
  sections: (s, update: Updater<TestimonialState>): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: MessageSquareQuote,
        content: (
          <>
            <TextField {...p} k="quote" label={i18n.t("el.f.quote")} multiline rows={4} />
            <TextField {...p} k="author" label={i18n.t("el.f.name")} />
            <TextField {...p} k="role" label={i18n.t("el.f.jobCompany")} />
            <ImageField {...p} k="avatar" label={i18n.t("el.f.photoUrlOptional")} />
            <RangeField {...p} k="rating" label={i18n.t("el.f.rating")} min={0} max={5} format={(v) => `${v} bintang`} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <SegmentedField
              {...p}
              k="align"
              label={i18n.t("el.f.alignment")}
              options={[
                { value: "left", label: i18n.t("el.f.left") },
                { value: "center", label: i18n.t("el.f.center") },
              ]}
            />
            <ColorField {...p} k="bgColor" label={i18n.t("el.f.bg")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.text")} />
            <ColorField {...p} k="accentColor" label={i18n.t("el.f.stars")} />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={64} suffix="px" />
            <ToggleField {...p} k="shadow" label={i18n.t("el.f.dropShadow")} />
          </>
        ),
      },
    ];
  },
});

/* ---------------------------- Pricing Card ---------------------------- */

export interface PricingState {
  plan: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  featured: boolean;
  badge: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  radius: number;
}

const PRICING_DEFAULT: PricingState = {
  plan: "Pro",
  price: "Rp149rb",
  period: "/bulan",
  description: "Untuk tim kecil yang ingin bergerak cepat.",
  features: ["10 proyek", "Ekspor tanpa batas", "Dukungan prioritas", "Domain kustom"],
  buttonText: "Pilih paket",
  buttonHref: "#",
  featured: true,
  badge: "Populer",
  accentColor: "#2563eb",
  bgColor: "#ffffff",
  textColor: "#0f172a",
  radius: 16,
};

export const pricingElement = defineElement<PricingState>({
  type: "pricing",
  label: "Kartu Harga",
  group: "Premium",
  premium: true,
  componentName: "PricingCard",
  defaultClassName: "custom-pricing",
  defaults: PRICING_DEFAULT,
  spec: (s, cls) => {
    const accent = col(s.accentColor, "#2563eb");
    return {
      css: `.${cls} {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 28px 24px;
  border-radius: ${clamp(s.radius, 0, 64)}px;
  background: ${col(s.bgColor, "#ffffff")};
  color: ${col(s.textColor, "#0f172a")};
  border: ${s.featured ? `2px solid ${accent}` : "1px solid #e5e7eb"};
${s.featured ? "  box-shadow: 0 16px 40px rgba(37, 99, 235, 0.15);\n" : ""}}
.${cls}__badge {
  position: absolute;
  top: -12px;
  right: 20px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${accent};
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}
.${cls}__plan {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}
.${cls}__desc {
  margin: 0;
  font-size: 14px;
  opacity: 0.75;
}
.${cls}__price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.${cls}__amount {
  font-size: 36px;
  font-weight: 800;
}
.${cls}__period {
  opacity: 0.7;
}
.${cls}__features {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}
.${cls}__features li::before {
  content: "✓";
  margin-right: 8px;
  color: ${accent};
  font-weight: 700;
}
.${cls}__button {
  display: inline-block;
  margin-top: auto;
  padding: 10px 16px;
  border-radius: 10px;
  background: ${accent};
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
}
.${cls}__button:hover {
  opacity: 0.9;
}
`,
      markup: h(
        "div",
        { class: cls },
        !!(s.featured && s.badge.trim()) && h("span", { class: `${cls}__badge` }, s.badge),
        h("h3", { class: `${cls}__plan` }, s.plan),
        !!s.description && h("p", { class: `${cls}__desc` }, s.description),
        h("div", { class: `${cls}__price` }, h("span", { class: `${cls}__amount` }, s.price), !!s.period && h("span", { class: `${cls}__period` }, s.period)),
        h(
          "ul",
          { class: `${cls}__features` },
          s.features.filter((f) => f.trim()).map((f) => h("li", {}, f)),
        ),
        h("a", { class: `${cls}__button`, href: safeUrl(s.buttonHref) }, s.buttonText),
      ),
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Tag,
        content: (
          <>
            <TextField {...p} k="plan" label={i18n.t("el.f.planName")} />
            <TextField {...p} k="price" label={i18n.t("el.f.price")} />
            <TextField {...p} k="period" label={i18n.t("el.f.period")} />
            <TextField {...p} k="description" label={i18n.t("el.f.description")} multiline />
            <LinesField {...p} k="features" label={i18n.t("el.f.featuresList")} rows={5} />
            <TextField {...p} k="buttonText" label={i18n.t("el.f.buttonText")} />
            <TextField {...p} k="buttonHref" label={i18n.t("el.f.buttonLink")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ToggleField {...p} k="featured" label={i18n.t("el.f.featuredPlan")} />
            <Show when={s.featured}>
              <TextField {...p} k="badge" label={i18n.t("el.f.highlightLabel")} />
            </Show>
            <ColorField {...p} k="accentColor" label={i18n.t("el.f.accentColor")} />
            <ColorField {...p} k="bgColor" label={i18n.t("el.f.bg")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.text")} />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={64} suffix="px" />
          </>
        ),
      },
    ];
  },
});
