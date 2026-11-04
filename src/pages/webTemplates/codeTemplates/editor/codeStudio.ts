import type { CodeModel } from "../editModel";

/* ================================================================== */
/* Code template Studio (v20): click to edit, layout locked.             */
/*                                                                    */
/* The preview gets a "bridge" script (ONLY in the preview, not included */
/* downloaded/deployed):                                                */
/*   - Edit mode: guide lines when the cursor is over text/a section; clicks */
/*     are sent to the editor as a "pick" (text key, link, section).    */
/*     Buttons & form fields still work (e.g. "Open Invitation"); their text */
/*     is changed by clicking their section area;                       */
/*   - Try mode: the template runs normally (buttons, animation, 3D);    */
/*   - the scroll position & an already opened invitation cover are remembered, so */
/*     a preview reloaded after an edit does not jump to the top.       */
/* No adding/moving sections: the template structure is preserved       */
/* so animation and 3D do not break.                                   */
/* ================================================================== */

export interface Pick {
  /** The clicked data-owd-text key (if any). */
  text?: string;
  /** The data-owd-href key on the clicked link / its wrapper. */
  link?: string;
  /** The photo path in CONFIG (data-owd-img, e.g. "tokoh.0.foto") when a photo was clicked (v21). */
  image?: string;
  /** Section id (or "sampul" for the invitation cover). */
  section?: string;
  /** Every text & link key inside that section. */
  sectionTexts: string[];
  sectionLinks: string[];
}

export interface BridgeState {
  edit: boolean;
  scrollY: number;
  opened: boolean;
}

export const BRIDGE_MSG = "owd-studio";

/** Bridge script for the preview. Initial values are embedded as safe JSON. */
export function bridgeScript(state: BridgeState): string {
  const init = JSON.stringify(state).replace(/</g, "\\u003c");
  return `<style id="owd-studio-css">
html.owd-edit [data-owd-text],html.owd-edit [data-owd-href]{cursor:pointer}
html.owd-edit button[data-owd-text]{cursor:auto}
html.owd-edit :not(button)[data-owd-text]:hover,html.owd-edit [data-owd-href]:hover{outline:2px dashed #2563eb!important;outline-offset:3px}
html.owd-edit section:hover,html.owd-edit #cover:hover{outline:2px solid rgba(37,99,235,.35);outline-offset:-2px}
html.owd-edit section,html.owd-edit #cover{cursor:pointer}
html.owd-edit [data-owd-img]{cursor:pointer}
html.owd-edit [data-owd-img]:hover{outline:2px dashed #2563eb!important;outline-offset:3px}
</style>
<script>(function(){
var S=${init},P=window.parent,M=${JSON.stringify(BRIDGE_MSG)};
function post(o){o.type=M;try{P.postMessage(o,"*")}catch(e){}}
function mode(on){S.edit=!!on;document.documentElement.classList.toggle("owd-edit",S.edit)}
mode(S.edit);
function keys(root,attr){var out=[],seen={};if(!root)return out;var els=root.querySelectorAll("["+attr+"]");for(var i=0;i<els.length;i++){var k=els[i].getAttribute(attr);if(k&&!seen[k]){seen[k]=1;out.push(k)}}return out}
function pass(el){return el.closest&&el.closest("button,input,textarea,select,label,summary,[role=button]")}
document.addEventListener("click",function(e){
  var t=e.target;if(!t||!t.closest)return;
  if(t.closest("#open"))post({kind:"opened"});
  if(!S.edit)return;
  var a=t.closest("a");
  if(pass(t))return;
  var txt=t.closest("[data-owd-text]"),lnk=t.closest("[data-owd-href]"),img=t.closest("[data-owd-img]");
  if(!txt&&!lnk&&a&&(a.getAttribute("href")||"").charAt(0)==="#")return;
  e.preventDefault();e.stopPropagation();
  var sec=t.closest("section[id]")||t.closest("#cover");
  var id=sec?(sec.id==="cover"?"sampul":sec.id):null;
  post({kind:"pick",pick:{image:img?img.getAttribute("data-owd-img"):undefined,text:txt?txt.getAttribute("data-owd-text"):undefined,link:lnk?lnk.getAttribute("data-owd-href"):undefined,section:id||undefined,sectionTexts:keys(sec,"data-owd-text"),sectionLinks:keys(sec,"data-owd-href")}});
},true);
var tm=0;addEventListener("scroll",function(){clearTimeout(tm);tm=setTimeout(function(){post({kind:"scroll",y:Math.round(scrollY)})},120)},{passive:true});
addEventListener("message",function(e){var d=e.data;if(!d||d.type!==M)return;if(d.kind==="mode")mode(d.edit)});
function restore(){if(S.opened){var b=document.getElementById("open");if(b)b.click()}if(S.scrollY>0)setTimeout(function(){scrollTo({top:S.scrollY,behavior:"instant"})},S.opened?1000:0)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",restore);else restore();
})();</script>`;
}

/** Attaches the bridge to the preview HTML (before </body>, or at the end). */
export function withBridge(html: string, state: BridgeState): string {
  const s = bridgeScript(state);
  const i = html.lastIndexOf("</body>");
  return i >= 0 ? html.slice(0, i) + s + html.slice(i) : html + s;
}

/** Invitation part → the CONFIG key that fills it. */
const INVITE_SECTIONS: Record<string, string[]> = {
  sampul: ["judul", "namaSampul", "tamuBawaan", "musik"],
  profil: ["salam", "judulProfil", "pembuka", "tokoh", "kutipan"],
  "hitung-mundur": ["judulHitungMundur", "tanggalHitungMundur", "teksSelesai"],
  acara: ["judulAcara", "pengantarAcara", "zonaWaktu", "labelZona", "acara"],
  galeri: ["judulGaleri", "pengantarGaleri", "galeri"],
  ucapan: ["judulUcapan", "pengantarUcapan", "ucapanContoh"],
  amplop: ["amplop"],
  rsvp: ["rsvp"],
  penutup: ["penutup", "salamPenutup", "keluarga"],
};

/** Portfolio/other parts filled by a specific data block. */
const SECTION_BLOCKS: Record<string, string> = { proyek: "PROJECTS" };
/** 3D business website: section → list key in the DAFTAR block (can be added, deleted, reordered, duplicated). */
const LIST_KEYS: Record<string, string[]> = { katalog: ["kategori", "katalog"], keunggulan: ["keunggulan"], alur: ["alur"], testimoni: ["ulasan"], galeri: ["galeri"], harga: ["paket"], lokasi: ["jam"], faq: ["faq"], kontak: ["paket", "kategori"] };

export interface PickFields {
  texts: string[];
  links: string[];
  /** The data blocks shown + the top-level keys allowed to show (null = all). */
  data: { name: string; keys: string[] | null }[];
  /** The clicked photo: its path in CONFIG (v21). */
  image?: string[];
}

/**
 * Fields shown in the popup for one click. The clicked text comes first;
 * a click on an empty area of a section shows every text in that section and
 * the data that fills it (invitations: CONFIG per section; portfolio: PROJECTS).
 */
export function fieldsForPick(model: CodeModel, pick: Pick): PickFields {
  const known = new Set(model.texts.map((t) => t.key));
  const knownLinks = new Set(model.links.map((l) => l.key));
  const texts = pick.text ? [pick.text] : pick.sectionTexts;
  const links = pick.link ? [pick.link] : pick.text ? [] : pick.sectionLinks;
  const data: PickFields["data"] = [];
  const image = pick.image ? imagePath(model, pick.image) : null;
  if (image) return { texts: [], links: [], data: [], image };
  if (!pick.text && !pick.link && pick.section) {
    const block = SECTION_BLOCKS[pick.section];
    if (block && model.data.some((d) => d.name === block)) data.push({ name: block, keys: null });
    // Business 3D (v27): the per-part lists live in the DAFTAR block.
    const list = LIST_KEYS[pick.section];
    if (list && model.data.some((d) => d.name === "DAFTAR")) data.push({ name: "DAFTAR", keys: list });
    const cfg = model.data.find((d) => d.name === "CONFIG");
    if (cfg && cfg.value && typeof cfg.value === "object" && !Array.isArray(cfg.value)) {
      const top = Object.keys(cfg.value);
      const flat = pick.section.replace(/-/g, "").toLowerCase();
      const mapped = (INVITE_SECTIONS[pick.section] ?? []).filter((k) => top.includes(k));
      // Other templates: keys whose name contains the part id (e.g. "judulGaleri").
      const guessed = top.filter((k) => !mapped.includes(k) && k.toLowerCase().includes(flat) && flat.length >= 4);
      const keys = [...mapped, ...guessed];
      if (keys.length) data.push({ name: "CONFIG", keys });
    }
  }
  return { texts: texts.filter((k) => known.has(k)), links: links.filter((k) => knownLinks.has(k)), data };
}

/** Top-level keys hidden so DataForm only shows `keys`. */
export function hiddenExcept(value: unknown, keys: string[] | null, hidden: string[]): string[] {
  if (!keys || !value || typeof value !== "object" || Array.isArray(value)) return hidden;
  return [...hidden, ...Object.keys(value).filter((k) => !keys.includes(k))];
}

export const isEmptyPick = (f: PickFields) => !f.image && !f.texts.length && !f.links.length && !f.data.length;

/** "tokoh.0.foto" → ["tokoh", "0", "foto"] when that path really exists in CONFIG and holds text. */
function imagePath(model: CodeModel, path: string): string[] | null {
  const parts = path.split(".");
  let v: unknown = model.data.find((d) => d.name === "CONFIG")?.value;
  for (const p of parts) v = v && typeof v === "object" ? (v as Record<string, unknown>)[p] : undefined;
  return typeof v === "string" ? parts : null;
}

/** Gets / replaces the value at a path (a new copy, without changing the original). */
export function getIn(value: unknown, path: string[]): unknown {
  return path.reduce<unknown>((v, p) => (v && typeof v === "object" ? (v as Record<string, unknown>)[p] : undefined), value);
}
export function setIn(value: unknown, path: string[], next: unknown): unknown {
  if (!path.length) return next;
  const [head, ...rest] = path;
  if (Array.isArray(value)) return value.map((x, i) => (String(i) === head ? setIn(x, rest, next) : x));
  const o = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return { ...o, [head]: setIn(o[head], rest, next) };
}
