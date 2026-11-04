import type {  } from "../../../ui/PanelStyling";
import i18n from "../../../../../../i18n";

/* ================================================================== */
/* FREE elements v3: Floating Label Input, Search Field, Input           */
/* Number, File Upload, Segmented Buttons, Avatar, Quote, Pagination,    */
/* Langkah Proses, Peta, Skeleton Loading.                               */
/*                                                                    */
/* Mostly pure HTML + CSS. Number Input & File Upload use               */
/* a little JS (the Custom JS runtime) that only adds convenience; without */
/* JS both still work as the browser's built-in inputs.                 */
/* ================================================================== */

export const tr = (k: string) => i18n.t(`el.y.${k}`);
export const f = (k: string) => i18n.t(`el.f.${k}`);

export const SR_ONLY = `position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;`;

export const focusCss = (c: string) => `outline: 2px solid ${c};
  outline-offset: 2px;`;
