import {  Cookie,     Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import { ColorField,  NumberField,  SelectField,  TextField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { safeUrl } from "../../../helpers/generatorCss";
import { clamp, color } from "../shared";
import { tr, f, btnCss } from "./kit";

/* ------------------------- Persetujuan Cookie ----------------------- */

export interface CookieConsentState {
  message: string;
  linkText: string;
  linkHref: string;
  acceptText: string;
  declineText: string;
  position: "bottom" | "bottom-left" | "bottom-right";
  storageKey: string;
  bgColor: string;
  textColor: string;
  acceptBg: string;
  acceptColor: string;
  radius: number;
}

export const cookieConsentElement = defineElement<CookieConsentState>({
  type: "cookie-consent",
  label: "Persetujuan Cookie",
  group: "Premium",
  premium: true,
  componentName: "CookieConsent",
  defaultClassName: "custom-cookie",
  defaults: {
    message: "Kami memakai cookie untuk mengingat preferensi Anda dan memahami cara situs ini digunakan.",
    linkText: "Kebijakan privasi",
    linkHref: "/privasi",
    acceptText: "Terima",
    declineText: "Tolak",
    position: "bottom",
    storageKey: "cookie-consent",
    bgColor: "#0f172a",
    textColor: "#e2e8f0",
    acceptBg: "#2563eb",
    acceptColor: "#ffffff",
    radius: 14,
  },
  spec: (s, cls) => {
    const r = clamp(s.radius, 0, 24);
    const place = s.position === "bottom" ? "left: 16px;\n  right: 16px;\n  margin: 0 auto;\n  max-width: 960px;" : s.position === "bottom-left" ? "left: 16px;\n  max-width: 380px;" : "right: 16px;\n  max-width: 380px;";
    const stacked = s.position !== "bottom";
    return {
      css: `.${cls} {
  box-sizing: border-box;
  display: flex;
  ${stacked ? "flex-direction: column;\n  align-items: stretch;" : "flex-wrap: wrap;\n  align-items: center;"}
  gap: 14px 20px;
  width: 100%;
  padding: 18px 20px;
  border-radius: ${r}px;
  background: ${color(s.bgColor, "#0f172a")};
  color: ${color(s.textColor, "#e2e8f0")};
  box-shadow: 0 20px 50px -20px rgba(15, 23, 42, 0.6);
}
.${cls}__msg {
  flex: 1 1 320px;
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
}
.${cls}__msg a {
  color: inherit;
  font-weight: 700;
}
.${cls}__actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}
.${cls}__btn {
  ${btnCss("transparent", "inherit", Math.min(r, 10))}
  min-height: 40px;
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid currentColor;
}
.${cls}__btn--accept {
  border-color: ${color(s.acceptBg, "#2563eb")};
  background: ${color(s.acceptBg, "#2563eb")};
  color: ${color(s.acceptColor, "#ffffff")};
}
.${cls}__btn:focus-visible {
  outline: 2px solid ${color(s.acceptBg, "#2563eb")};
  outline-offset: 2px;
}
/* Floats at the bottom of the screen only once the runtime is active. */
.${cls}[data-ready] {
  position: fixed;
  bottom: 16px;
  ${place}
  width: auto;
  z-index: 1050;
}
.${cls}[hidden] {
  display: none;
}
`,
      markup: h(
        "div",
        { class: cls, role: "region", "aria-label": tr("cookieRegion"), "data-key": s.storageKey.replace(/[^\w-]/g, "") || "cookie-consent" },
        h("p", { class: `${cls}__msg` }, s.message, !!s.linkText && " ", !!s.linkText && h("a", { href: safeUrl(s.linkHref) }, s.linkText)),
        h(
          "div",
          { class: `${cls}__actions` },
          !!s.declineText && h("button", { class: `${cls}__btn`, type: "button", "data-consent": "declined" }, s.declineText),
          h("button", { class: `${cls}__btn ${cls}__btn--accept`, type: "button", "data-consent": "accepted" }, s.acceptText || "OK"),
        ),
      ),
    };
  },
  customCode: () => ({
    js: `var key = element.getAttribute("data-key") || "cookie-consent";
var saved = null;
try { saved = window.localStorage.getItem(key); } catch (e) { saved = null; }
element.setAttribute("data-ready", "");
if (saved) element.hidden = true;
Array.prototype.forEach.call(element.querySelectorAll("[data-consent]"), function (btn) {
  on(btn, "click", function () {
    var value = btn.getAttribute("data-consent");
    try { window.localStorage.setItem(key, value); } catch (e) { /* mode privat */ }
    element.hidden = true;
    document.dispatchEvent(new CustomEvent("cookie-consent", { detail: { value: value } }));
  });
});
onCleanup(function () {
  element.removeAttribute("data-ready");
  element.hidden = false;
});`,
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: Cookie,
        content: (
          <>
            <TextField {...p} k="message" label={f("body")} multiline rows={3} />
            <TextField {...p} k="linkText" label={tr("linkText")} />
            <TextField {...p} k="linkHref" label={f("hrefLabel")} />
            <TextField {...p} k="acceptText" label={tr("acceptText")} />
            <TextField {...p} k="declineText" label={tr("declineText")} hint={tr("declineHint")} />
            <SelectField
              {...p}
              k="position"
              label={f("position")}
              options={[
                { value: "bottom", label: tr("bottomCenter") },
                { value: "bottom-left", label: tr("bottomLeft") },
                { value: "bottom-right", label: tr("bottomRight") },
              ]}
            />
            <TextField {...p} k="storageKey" label={tr("storageKey")} hint={tr("storageKeyHint")} />
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
            <ColorField {...p} k="textColor" label={f("textColor")} />
            <ColorField {...p} k="acceptBg" label={tr("acceptBg")} />
            <ColorField {...p} k="acceptColor" label={tr("acceptColor")} />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={24} suffix="px" />
          </>
        ),
      },
    ];
  },
});
