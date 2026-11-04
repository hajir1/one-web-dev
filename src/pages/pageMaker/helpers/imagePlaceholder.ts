/* ================================================================== */
/* Image placeholders                                                  */
/*                                                                    */
/* Images that fail to load (or have no src) are replaced with an SVG data URI: */
/* frame + mountain + sun on a soft gray background. No external files, */
/* so downloads stay complete. The alt text stays in the attribute (SEO and */
/* screen readers), it is just not shown on screen.                    */
/*                                                                    */
/* Used in: the Page Design canvas/preview (pageShell), the downloaded HTML */
/* (siteExport, markup), and template demos (from siteExport).         */
/* ================================================================== */

/** Placeholder background color; fills the remaining space when the container ratio differs from 4:3. */
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

/** The placeholder SVG as a data URI (safe to use in a src attribute). */
export const IMG_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(SVG)}`;

/**
 * A standalone (ES5) script for <head>: a capture-phase `error` listener
 * catches failed images before the broken icon/alt shows for long.
 * Images without a src (or with an empty src) are replaced when the DOM is ready and when
 * new content is added (the editor canvas re-renders the page content).
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

/** <script> tag ready to paste into <head>. */
export const IMG_FALLBACK_TAG = `<script>${IMG_FALLBACK_SCRIPT}</script>`;
