/* ================================================================== */
/* Placeholder gambar                                                  */
/*                                                                    */
/* Gambar yang gagal dimuat (atau tanpa src) diganti SVG data-URI:     */
/* bingkai + gunung + matahari di latar abu lembut. Tanpa file luar,   */
/* jadi hasil unduhan tetap utuh. Teks alt tetap di atribut (SEO dan   */
/* pembaca layar), hanya tidak tampil di layar.                        */
/*                                                                    */
/* Dipakai di: canvas/pratinjau Desain Halaman (pageShell), HTML hasil */
/* unduhan (siteExport, markup), dan demo template (dari siteExport).  */
/* ================================================================== */

/** Warna latar placeholder; mengisi sisa ruang bila rasio wadah berbeda dari 4:3. */
const IMG_PLACEHOLDER_BG = "#eef1f5";

const SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">` +
  `<rect width="400" height="300" fill="${IMG_PLACEHOLDER_BG}"/>` +
  `<g fill="none" stroke="#94a3b8" stroke-width="6" stroke-linejoin="round">` +
  `<rect x="158" y="114" width="84" height="72" rx="9"/>` +
  `</g>` +
  `<path d="M161 183 L186 152 L203 170 L215 158 L239 183 Z" fill="#94a3b8"/>` +
  `<circle cx="219" cy="134" r="8" fill="#94a3b8"/>` +
  `</svg>`;

/** SVG placeholder sebagai data-URI (aman dipakai di atribut src). */
export const IMG_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(SVG)}`;

/**
 * Skrip mandiri (ES5) untuk <head>: listener `error` fase capture
 * menangkap gambar gagal sebelum ikon rusak/alt sempat terlihat lama.
 * Gambar tanpa src (atau src kosong) diganti saat DOM siap dan saat
 * konten baru ditambahkan (canvas editor merender ulang isi halaman).
 */
export const IMG_FALLBACK_SCRIPT = `(function () {
  var P = ${JSON.stringify(IMG_PLACEHOLDER)};
  function fix(img) {
    if (img.getAttribute("src") === P) return;
    img.removeAttribute("srcset");
    img.setAttribute("data-img-placeholder", "");
    img.style.backgroundColor = "${IMG_PLACEHOLDER_BG}";
    img.src = P;
  }
  function scan(root) {
    var list = root.querySelectorAll ? root.querySelectorAll("img") : [];
    for (var i = 0; i < list.length; i++) if (!list[i].getAttribute("src")) fix(list[i]);
    if (root.tagName === "IMG" && !root.getAttribute("src")) fix(root);
  }
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG") fix(t);
  }, true);
  function start() {
    scan(document);
    if (!window.MutationObserver) return;
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.type === "attributes") {
          if (r.target.tagName === "IMG" && !r.target.getAttribute("src")) fix(r.target);
          else if (r.target.tagName === "IMG" && r.target.getAttribute("src") !== P) {
            r.target.removeAttribute("data-img-placeholder");
            r.target.style.backgroundColor = "";
          }
        } else for (var j = 0; j < r.addedNodes.length; j++) if (r.addedNodes[j].nodeType === 1) scan(r.addedNodes[j]);
      }
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["src"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();`;

/** Tag <script> siap tempel di <head>. */
export const IMG_FALLBACK_TAG = `<script>${IMG_FALLBACK_SCRIPT}</script>`;
