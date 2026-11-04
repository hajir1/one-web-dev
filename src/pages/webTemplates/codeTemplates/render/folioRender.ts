import type { RegionRenderer } from "../editModel";

/* ================================================================== */
/* Renders the 3D Portfolio project HTML. ONE source for:                */
/*   - the generator (static HTML for readers without JS),              */
/*   - the template script (re-render from PROJECTS),                   */
/*   - the no-code editor (rebuild the static HTML after editing).      */
/* Written as JS text because it is also copied as is into the template. */
/* ================================================================== */

export const FOLIO_RENDER = String.raw`
function escHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
/* Project image: SVG placeholder (replace with an <img> if you have a picture). */
function safeImg(u) { u = String(u || "").trim(); return /^(https?:\/\/|data:image\/(png|jpe?g|webp|gif);)/i.test(u) ? u : ""; }
function projectArt(p, i, c1, c2) {
  if (safeImg(p.gambar)) return '<img class="art" src="' + escHtml(safeImg(p.gambar)) + '" alt="Gambar proyek ' + escHtml(p.judul) + '" loading="lazy">';
  var r = 40 + (i * 37) % 60, x = 90 + (i * 53) % 220, y = 70 + (i * 29) % 90;
  return '<svg class="art" viewBox="0 0 400 260" role="img" aria-label="Gambar contoh proyek ' + escHtml(p.judul) + '">' +
    '<rect width="400" height="260" fill="' + c1 + '"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c2 + '" fill-opacity=".85"/>' +
    '<rect x="' + (250 - (i * 41) % 120) + '" y="' + (120 + (i * 17) % 50) + '" width="140" height="90" rx="14" fill="#fff" fill-opacity=".18"/>' +
    '<path d="M0 ' + (200 - (i * 13) % 40) + ' Q 200 ' + (150 + (i * 31) % 60) + ' 400 ' + (210 - (i * 7) % 30) + ' V260 H0Z" fill="#000" fill-opacity=".14"/>' +
    '</svg>';
}
/* Project anchor key: slug, or generated from the title (new projects from the editor). */
function slugOf(p, i) { var s = String(p.slug || p.judul || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); return (s || "proyek") + (p.slug ? "" : "-" + (i + 1)); }
function listOf(v) { return Array.isArray(v) ? v : []; }
function renderCards(list, c1, c2) {
  return list.map(function (p, i) {
    return '<li><a class="card" href="#proyek-' + escHtml(slugOf(p, i)) + '" data-tilt>' + projectArt(p, i, c1, c2) +
      '<span class="card-body"><span class="card-year">' + escHtml(p.tahun) + '</span><strong>' + escHtml(p.judul) + '</strong><span>' + escHtml(p.ringkas) + '</span>' +
      '<span class="tags">' + listOf(p.tag).map(function (t) { return '<span>' + escHtml(t) + '</span>'; }).join("") + '</span></span></a></li>';
  }).join("");
}
function renderDetails(list, c1, c2) {
  return list.map(function (p, i) {
    return '<article class="detail" id="proyek-' + escHtml(slugOf(p, i)) + '" tabindex="-1" aria-labelledby="proyek-' + escHtml(slugOf(p, i)) + '-t">' +
      '<a class="back" href="#proyek">Kembali ke daftar proyek</a>' +
      '<div class="detail-grid"><div>' + projectArt(p, i, c1, c2) + '</div><div>' +
      '<p class="kicker">' + escHtml(p.tahun) + ' · ' + escHtml(p.peran) + '</p>' +
      '<h3 id="proyek-' + escHtml(slugOf(p, i)) + '-t">' + escHtml(p.judul) + '</h3>' +
      listOf(p.deskripsi).map(function (d) { return '<p>' + escHtml(d) + '</p>'; }).join("") +
      '<p class="tags">' + listOf(p.tag).map(function (t) { return '<span>' + escHtml(t) + '</span>'; }).join("") + '</p>' +
      '<a class="btn" href="' + escHtml(/^(https?:|mailto:|#)/i.test(String(p.tautan || "")) ? p.tautan : "#") + '" target="_blank" rel="noopener">Lihat proyek</a>' +
      '</div></div></article>';
  }).join("");
}
`;


interface FolioApi {
  renderCards: (list: unknown[], c1: string, c2: string) => string;
  renderDetails: (list: unknown[], c1: string, c2: string) => string;
}
let api: FolioApi | null = null;
/** Render functions from FOLIO_RENDER (constant text owned by the app, not user input). */
export function folioApi(): FolioApi {
  api ??= new Function(`${FOLIO_RENDER}; return { renderCards, renderDetails };`)() as FolioApi;
  return api;
}

/** Static region rebuilder for the editor (PROJECTS data + the theme accent color). */
export const FOLIO_REGIONS: Record<string, RegionRenderer> = {
  cards: (data, vars) => folioApi().renderCards((data.PROJECTS as unknown[]) ?? [], vars["--accent"] ?? "#888", vars["--accent-2"] ?? "#444"),
  details: (data, vars) => folioApi().renderDetails((data.PROJECTS as unknown[]) ?? [], vars["--accent"] ?? "#888", vars["--accent-2"] ?? "#444"),
};
