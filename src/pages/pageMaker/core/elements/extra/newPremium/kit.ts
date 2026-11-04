import type {  } from "../../../ui/PanelStyling";
import i18n from "../../../../../../i18n";

/* ================================================================== */
/* PREMIUM elements v3 (advanced — need interaction JS):                */
/* Popover, Notifikasi Toast, Panel Samping (Offcanvas), Input OTP,     */
/* Dropdown Button, Cookie Consent, Hotspot Image, Form                 */
/* Bertahap.                                                            */
/*                                                                    */
/* The same pattern as the v2 premium elements: static markup still makes */
/* sense without JS (the Design canvas does not run JS), interaction via */
/* `customCode` (Custom JS runtime: `element`, `on`, `onCleanup`) in    */
/* the preview and the export output of all five frameworks. The `data-ready` attribute */
/* set by the runtime; floating elements (toast, cookie) only "float"  */
/* once that attribute exists, so they stay selectable & editable on the canvas. */
/* ================================================================== */

export const tr = (k: string) => i18n.t(`el.y.${k}`);
export const f = (k: string) => i18n.t(`el.f.${k}`);

export const btnCss = (bg: string, fg: string, r: number) => `display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  border: 0;
  border-radius: ${r}px;
  background: ${bg};
  color: ${fg};
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;`;

/** Shared code: close on a click outside the element / the Escape key. */
export const outsideEsc = (closeFn: string) => `on(document, "click", function (e) {
  if (!element.contains(e.target)) ${closeFn}(false);
});
on(document, "keydown", function (e) {
  if (e.key === "Escape") ${closeFn}(true);
});`;
