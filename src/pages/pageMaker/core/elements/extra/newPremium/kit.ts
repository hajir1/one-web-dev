import type {  } from "../../../ui/PanelStyling";
import i18n from "../../../../../../i18n";

/* ================================================================== */
/* Elemen PREMIUM v3 (tingkat lanjut — butuh JS interaksi):             */
/* Popover, Notifikasi Toast, Panel Samping (Offcanvas), Input OTP,     */
/* Tombol Dropdown, Persetujuan Cookie, Gambar Hotspot, Formulir        */
/* Bertahap.                                                            */
/*                                                                    */
/* Pola yang sama dengan elemen premium v2: markup statis tetap masuk   */
/* akal tanpa JS (canvas Desain tidak menjalankan JS), interaksi lewat  */
/* `customCode` (runtime Custom JS: `element`, `on`, `onCleanup`) di    */
/* Pratinjau dan hasil ekspor kelima framework. Atribut `data-ready`    */
/* dipasang runtime; elemen mengambang (toast, cookie) baru "melayang"  */
/* setelah atribut itu ada, jadi di canvas tetap bisa dipilih & diatur. */
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

/** Kode bersama: tutup saat klik di luar elemen / tombol Escape. */
export const outsideEsc = (closeFn: string) => `on(document, "click", function (e) {
  if (!element.contains(e.target)) ${closeFn}(false);
});
on(document, "keydown", function (e) {
  if (e.key === "Escape") ${closeFn}(true);
});`;
