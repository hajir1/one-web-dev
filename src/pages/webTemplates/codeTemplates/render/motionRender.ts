import type { RegionRenderer } from "../editModel";

/* ================================================================== */
/* Render "biodata dalam bentuk kode" untuk template 3D Motion (v18).    */
/* SATU sumber untuk generator (HTML statis), skrip template (panel kode */
/* & layar 3D), dan editor tanpa kode (bangun ulang HTML statis).        */
/* Ditulis sebagai teks JS karena juga disalin apa adanya ke template.  */
/* ================================================================== */

export const MOTION_RENDER = String.raw`
function escHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
/* Baris kode berwarna dari CONFIG: [[kelas, teks], ...] per baris. Bahasa: js, py, json. */
function bioLines(cfg) {
  var c = cfg || {}, p = c.profil && typeof c.profil === "object" ? c.profil : {};
  var lang = c.bahasa === "py" || c.bahasa === "json" ? c.bahasa : "js";
  var name = String(c.variabel || "profil").replace(/[^\w$]/g, "") || "profil";
  var q = function (s) { return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'; };
  var val = function (v) {
    if (Array.isArray(v)) {
      var out = [["pun", "["]];
      v.forEach(function (x, i) { if (i) out.push(["pun", ", "]); out.push(["str", q(x)]); });
      out.push(["pun", "]"]);
      return out;
    }
    if (typeof v === "number") return [["num", String(v)]];
    if (typeof v === "boolean") return [["kw", lang === "py" ? (v ? "True" : "False") : String(v)]];
    return [["str", q(v == null ? "" : v)]];
  };
  var lines = [];
  if (c.komentar) lines.push([["com", (lang === "py" ? "# " : "// ") + c.komentar]]);
  if (lang === "js") lines.push([["kw", "const "], ["var", name], ["pun", " = {"]]);
  else if (lang === "py") lines.push([["var", name], ["pun", " = {"]]);
  else lines.push([["pun", "{"]]);
  var keys = Object.keys(p);
  keys.forEach(function (k, i) {
    var key = lang === "js" && /^[A-Za-z_$][\w$]*$/.test(k) ? [["key", k]] : [["str", q(k)]];
    var last = i === keys.length - 1;
    lines.push([["pun", lang === "py" ? "    " : "  "]].concat(key, [["pun", ": "]], val(p[k]), last && lang === "json" ? [] : [["pun", ","]]));
  });
  lines.push([["pun", lang === "js" ? "};" : "}"]]);
  return lines;
}
function bioText(cfg) { return bioLines(cfg).map(function (l) { return l.map(function (t) { return t[1]; }).join(""); }).join("\n"); }
function bioHtml(cfg) {
  return bioLines(cfg).map(function (l) {
    return '<span class="ln">' + l.map(function (t) { return '<span class="tk-' + t[0] + '">' + escHtml(t[1]) + "</span>"; }).join("") + "</span>";
  }).join("");
}
`;

interface MotionApi {
  bioHtml: (cfg: unknown) => string;
  bioText: (cfg: unknown) => string;
  bioLines: (cfg: unknown) => [string, string][][];
}
let api: MotionApi | null = null;
/** Fungsi render dari MOTION_RENDER (teks konstan milik aplikasi, bukan masukan pengguna). */
export function motionApi(): MotionApi {
  api ??= new Function(`${MOTION_RENDER}; return { bioHtml, bioText, bioLines };`)() as MotionApi;
  return api;
}

/** Pembangun ulang panel kode statis untuk editor (dari CONFIG). */
export const MOTION_REGIONS: Record<string, RegionRenderer> = {
  code: (data) => motionApi().bioHtml(data.CONFIG),
};
