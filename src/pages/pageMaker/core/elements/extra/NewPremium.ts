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
/* Dipecah per elemen di folder newPremium/ (no. 15); berkas ini hanya mengekspor ulang. */

export * from "./newPremium/Popover";
export * from "./newPremium/Toast";
export * from "./newPremium/Offcanvas";
export * from "./newPremium/OtpInput";
export * from "./newPremium/Dropdown";
export * from "./newPremium/CookieConsent";
export * from "./newPremium/ImageHotspot";
export * from "./newPremium/FormWizard";
