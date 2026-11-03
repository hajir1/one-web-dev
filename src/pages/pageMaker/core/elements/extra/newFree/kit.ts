import type {  } from "../../../ui/PanelStyling";
import i18n from "../../../../../../i18n";

/* ================================================================== */
/* Elemen GRATIS v3: Input Label Mengambang, Kolom Pencarian, Input      */
/* Angka, Unggah Berkas, Tombol Segmen, Avatar, Kutipan, Paginasi,       */
/* Langkah Proses, Peta, Skeleton Loading.                               */
/*                                                                    */
/* Sebagian besar murni HTML + CSS. Input Angka & Unggah Berkas memakai  */
/* sedikit JS (runtime Custom JS) yang hanya menambah kenyamanan; tanpa  */
/* JS keduanya tetap berfungsi sebagai input bawaan browser.            */
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
