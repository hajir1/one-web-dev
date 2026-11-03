import { dataBlock, doc, esc, ot, type ThemeVar } from "./shared";
import { BOOT, CDNS, LENIS_STYLE, LIB_IMPORTS, PRELOAD, fontLink } from "./web3d";
import { MOTION_JS } from "./motion3d";
import { SCRUB_JS } from "./scrub";
import { ICON_CSS, icon } from "./umkmIcons";
import { MAP_SVG, WA_SVG, fontHref } from "./landing";
import { MODELS } from "./bizModels";
import { SEEDS, SEED_LABEL, STORY_ENGINE, STORY_OF } from "./bizStory";
import { FLOATERS, WORLDS, storyChannels, storyboardOf, storyboardText } from "./bizWorlds";
import { BIZ_LOOKS, type BizLook } from "./bizLooks";
import { BIZ_DAFTAR_HIDE, bizRegion, type BizDaftar } from "../../pages/webTemplates/codeTemplates/render/bizRender";

/** Isi daftar (blok data DAFTAR) dari spesifikasi. */
export function bizDaftar(s: BizSpec): BizDaftar {
  return {
    ikon: s.icon,
    kategori: [...s.cats],
    katalog: s.products.map(([nama, deskripsi, harga, satuan, c, ikon, label]) => ({ nama, deskripsi, harga, satuan, kategori: s.cats[c] ?? s.cats[0] ?? "", label: label ?? "", ikon })),
    keunggulan: s.usp.map(([ikon, judul, isi]) => ({ judul, isi, ikon })),
    alur: s.steps.map(([judul, isi]) => ({ judul, isi })),
    ulasan: s.testi.map(([isi, nama, keterangan]) => ({ isi, nama, keterangan })),
    galeri: [...s.gallery],
    paket: s.plans.map(([nama, harga, satuan, ringkasan, fitur, hot]) => ({ nama, harga, satuan, ringkasan, fitur: [...fitur], unggulan: !!hot })),
    jam: s.hours.map(([hari, jam]) => ({ hari, jam })),
    faq: s.faq.map(([tanya, jawab]) => ({ tanya, jawab })),
  };
}

/* ================================================================== */
/* WEBSITE 3D BISNIS (v23): situs usaha lengkap dengan objek 3D.         */
/*                                                                    */
/* Satu halaman berisi semua bagian situs bisnis sungguhan: hero 3D      */
/* interaktif (geser untuk memutar + chip varian warna), profil usaha,   */
/* katalog dengan filter, keunggulan, alur kerja, testimoni, galeri      */
/* (foto produk dirender dari objek 3D yang sama), harga/paket, lokasi  */
/* & jam buka dengan status "buka sekarang", FAQ, formulir kontak yang  */
/* tersusun jadi pesan WhatsApp, dan tombol WhatsApp mengambang.         */
/*                                                                    */
/* - three.js  : objek prosedural (bizModels.ts), tanpa model/tekstur    */
/*               eksternal; pantulan dari lingkungan buatan (PMREM).     */
/* - OWD Scrub : mesin scroll bawaan menggerakkan cerita objek per bagian */
/*               (bizStory.ts: benih, rakit, urai, menyelam, partikel). */
/* - Motion    : judul hero, angka berjalan, tombol magnetis.           */
/* - Lenis     : gulir halus.                                           */
/* Fallback: tanpa WebGL → ilustrasi ikon + gradasi; tanpa JS → semua    */
/* konten tetap terbaca; kurangi gerak → tanpa animasi.                  */
/* ================================================================== */

export interface BizSpec {
  id: string;
  category: string;
  /** Kunci di MODELS (bizModels.ts). */
  model: string;
  /** Objek di kiri pada hero (tata letak dibalik). */
  flip?: boolean;
  dark?: boolean;
  /** Radius sudut kartu (px). */
  round?: number;
  font: [string, string];
  /** [latar, permukaan, teks, teks lembut, aksen, aksen kedua] */
  colors: [string, string, string, string, string, string];
  icon: string;
  name: string;
  type: string;
  tagline: string;
  intro: string;
  /** [judul, paragraf 1, paragraf 2] */
  about: [string, string, string];
  /** [kutipan, nama, peran] */
  founder: [string, string, string];
  stats: [string, string][];
  /** [nama varian, warna 1, warna 2] untuk objek 3D. */
  variants: [string, string, string][];
  variantLabel?: string;
  city: string;
  address: string;
  hours: [string, string][];
  open: [number[], string, string][];
  wa: string;
  ig: string;
  email: string;
  phone: string;
  catalogTitle: string;
  cats: string[];
  /** [nama, deskripsi, harga (0 = tanya), satuan, indeks kategori, ikon, label?] */
  products: [string, string, number, string, number, string, string?][];
  usp: [string, string, string][];
  steps: [string, string][];
  testi: [string, string, string][];
  /** [nilai, keterangan] mis. ["4,9", "dari 320 ulasan Google"] */
  rating: [string, string];
  gallery: string[];
  planTitle: string;
  /** [nama, harga, satuan, ringkasan, fitur[], unggulan?] */
  plans: [string, number, string, string, string[], boolean?][];
  faq: [string, string][];
  cta: [string, string];
}

const path = (u: string) => u.slice(CDNS[0].length);

/* Urutan bagian & pose objek. x = sepersekian setengah lebar layar; ny/ns/no = layar sempit. */
const SECTIONS = ["beranda", "profil", "katalog", "keunggulan", "alur", "testimoni", "galeri", "harga", "lokasi", "faq", "kontak"] as const;
type Sec = (typeof SECTIONS)[number];
const POSE: Record<Sec, { x: number; y: number; s: number; ry: number; rx: number; o: number; ny: number; ns: number; no: number }> = {
  beranda: { x: 0.5, y: -0.05, s: 1, ry: -0.55, rx: 0.14, o: 1, ny: 1.05, ns: 0.62, no: 1 },
  profil: { x: -0.56, y: 0, s: 0.9, ry: 0.8, rx: 0.22, o: 1, ny: 1.0, ns: 0.5, no: 0.3 },
  katalog: { x: 0.7, y: 0.35, s: 0.5, ry: 2.0, rx: 0.1, o: 0.16, ny: 0.4, ns: 0.45, no: 0.08 },
  keunggulan: { x: 0.56, y: -0.05, s: 0.95, ry: 3.3, rx: 0.18, o: 1, ny: 1.0, ns: 0.5, no: 0.3 },
  alur: { x: -0.56, y: 0.05, s: 0.85, ry: 4.3, rx: -0.1, o: 1, ny: 1.0, ns: 0.5, no: 0.3 },
  testimoni: { x: 0, y: 0.25, s: 1.3, ry: 5.4, rx: 0.2, o: 0.12, ny: 0.3, ns: 0.7, no: 0.08 },
  galeri: { x: 0, y: 0, s: 0.6, ry: 6.2, rx: 0.1, o: 0.06, ny: 0, ns: 0.4, no: 0.05 },
  harga: { x: -0.66, y: 0.2, s: 0.55, ry: 7.0, rx: 0.1, o: 0.14, ny: 0.4, ns: 0.45, no: 0.08 },
  lokasi: { x: 0.66, y: 0.1, s: 0.6, ry: 7.8, rx: 0.1, o: 0.18, ny: 0.4, ns: 0.45, no: 0.1 },
  faq: { x: 0.56, y: 0, s: 0.9, ry: 8.7, rx: 0.2, o: 1, ny: 1.0, ns: 0.5, no: 0.3 },
  kontak: { x: -0.52, y: 0, s: 1.05, ry: 9.6, rx: 0.14, o: 1, ny: 1.0, ns: 0.55, no: 0.35 },
};
/** Sudut foto galeri (dirender dari objek 3D). */
const SHOTS = [
  { ry: -0.6, rx: 0.2, v: 0, z: 6.4, y: 0.4 },
  { ry: 0.9, rx: 0.35, v: 1, z: 5.6, y: 1.2 },
  { ry: 2.4, rx: 0.05, v: 2, z: 6.8, y: 0 },
  { ry: -2.2, rx: 0.5, v: 0, z: 5.2, y: 2 },
  { ry: 3.4, rx: 0.15, v: 1, z: 4.6, y: 0.3 },
  { ry: -1.2, rx: -0.15, v: 2, z: 7.2, y: -0.6 },
];

export function bizPoses(s: BizSpec) {
  return SECTIONS.map((k) => {
    const p = POSE[k];
    const { beat, ...c } = storyChannels(s.model, k);
    /* Bagian beradegan butuh kanvas lebih terang; "menyelam" paling terang agar dunianya terlihat. */
    const lit = beat ? { o: Math.max(p.o, c.dive ? 0.6 : 0.5), no: Math.max(p.no, 0.32) } : {};
    return { ...p, x: s.flip ? -p.x : p.x, ...c, ...lit };
  }).map((p, i) => (BIZ_LOOKS[s.id]?.pose ? BIZ_LOOKS[s.id].pose!(SECTIONS[i], p, i) : p));
}

/** Terapkan identitas (v27) ke spesifikasi: palet, font, sudut, dan salinan hero. */
export function withLook(spec: BizSpec): BizSpec {
  const L = BIZ_LOOKS[spec.id];
  if (!L) return spec;
  return { ...spec, font: L.font, colors: L.colors, dark: !!L.dark, round: L.round, type: L.type ?? spec.type, tagline: L.tagline ?? spec.tagline, intro: L.intro ?? spec.intro, variants: L.variants ?? spec.variants, gallery: L.gallery ?? spec.gallery };
}

/** Sisipkan elemen & label khas identitas ke HTML badan halaman. */
function applyLookHtml(L: BizLook | undefined, body: string): string {
  if (!L) return body;
  let out = body;
  if (L.heroTop) out = out.replace('<div class="hero-text">', `<div class="hero-text">\n    ${L.heroTop}`);
  if (L.stage) out = out.replace('<div class="fb" aria-hidden="true">', `${L.stage}<div class="fb" aria-hidden="true">`);
  if (L.nav) out = out.replace('<a class="btn sm" href="', `${L.nav}<a class="btn sm" href="`);
  if (L.fixed) out = out.replace('<div class="loader" aria-hidden="true">', `${L.fixed}\n<div class="loader" aria-hidden="true">`);
  if (L.hint) out = out.replace(/(<span class="hint" aria-hidden="true">&#8645; )[^<]*/, `$1${esc(L.hint)}`);
  for (const [k, text] of Object.entries(L.kicks ?? {})) {
    const at = out.indexOf(`id="${k}"`);
    if (at < 0) continue;
    const i = out.indexOf('<p class="kick"', at);
    out = out.slice(0, i) + out.slice(i).replace(/^(<p class="kick"[^>]*>)[^<]*(<\/p>)/, `$1${esc(text!)}$2`);
  }
  return out;
}

/* ------------------------------- CSS ------------------------------- */

function css(s: BizSpec): string {
  return `
* { box-sizing: border-box; }
html { background: var(--bg); color-scheme: ${s.dark ? "dark" : "light"}; scroll-padding-top: 76px; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.65 var(--ft), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
a { color: inherit; }
img, svg { display: block; }
h1, h2, h3 { font-family: var(--fd), system-ui, sans-serif; letter-spacing: -.02em; margin: 0; }
p { margin: 0; }
.wrap { width: min(100% - 2 * var(--pad), 1180px); margin-inline: auto; }
.skip { position: absolute; left: -999px; top: 8px; z-index: 80; padding: 10px 14px; border-radius: 8px; background: var(--accent); color: var(--on-accent); }
.skip:focus { left: 8px; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.soft { color: var(--soft); }

#gl { position: fixed; inset: 0; z-index: 0; width: 100vw; height: 100vh; display: block; opacity: 0; transition: opacity .8s; pointer-events: none; }
html.webgl #gl { opacity: 1; }
.loader { position: fixed; left: 16px; bottom: 16px; z-index: 40; display: none; align-items: center; gap: 10px; padding: 8px 14px 8px 10px; border-radius: 999px; background: var(--surface); color: var(--soft); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; pointer-events: none; box-shadow: 0 10px 30px -18px rgba(0,0,0,.5); }
html.loading .loader { display: flex; }
.loader i { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--line); border-top-color: var(--accent); animation: spin .9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 22px; border-radius: 999px; border: 0; background: var(--accent); color: var(--on-accent); font: 600 15px/1 var(--ft), system-ui, sans-serif; text-decoration: none; cursor: pointer; white-space: nowrap; transition: filter .2s; }
.btn:hover { filter: brightness(1.08); }
.btn.ghost { background: transparent; color: var(--ink); box-shadow: inset 0 0 0 1.5px var(--line); }
.btn.sm { min-height: 40px; padding: 0 16px; font-size: 14px; }
.wa-ico { width: 18px; height: 18px; fill: currentColor; }

.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: color-mix(in srgb, var(--bg) 72%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
.nav .wrap { display: flex; align-items: center; gap: 14px; min-height: 66px; }
.logo { display: inline-flex; align-items: center; gap: 10px; font: 700 18px/1.1 var(--fd), system-ui, sans-serif; text-decoration: none; margin-right: auto; }
.logo .ico { font-size: 30px; color: var(--ink); }
.nav ul { display: flex; gap: 2px; margin: 0; padding: 0; list-style: none; }
.nav ul a { display: inline-flex; align-items: center; min-height: 40px; padding: 0 11px; border-radius: 999px; text-decoration: none; font-size: 14px; color: var(--soft); }
.nav ul a:hover, .nav ul a.active { color: var(--ink); background: color-mix(in srgb, var(--ink) 8%, transparent); }
.menu-btn { display: none; width: 44px; height: 44px; border: 0; border-radius: 12px; background: color-mix(in srgb, var(--ink) 8%, transparent); color: var(--ink); cursor: pointer; }
.menu-btn span, .menu-btn span::before, .menu-btn span::after { display: block; width: 18px; height: 2px; margin: auto; background: currentColor; position: relative; transition: transform .2s; }
.menu-btn span::before, .menu-btn span::after { content: ""; position: absolute; left: 0; }
.menu-btn span::before { top: -6px; } .menu-btn span::after { top: 6px; }
.progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; }
.progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transform-origin: 0 50%; transform: scaleX(0); }

main { position: relative; z-index: 2; }
.s { position: relative; padding: clamp(72px, 10vw, 128px) 0; }
.kick { margin: 0 0 10px; font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
h2 { font-size: clamp(30px, 3.8vw, 50px); line-height: 1.06; margin-bottom: 14px; }
h3 { font-size: 19px; line-height: 1.25; }
.head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px 32px; margin-bottom: 34px; }
.head > div { max-width: 640px; }
.head > p { max-width: 420px; color: var(--soft); }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); }
.status { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; background: color-mix(in srgb, var(--ink) 7%, transparent); }
.status i { width: 8px; height: 8px; border-radius: 50%; background: #9aa0a6; }
.status.on i { background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,.2); }
.status.off i { background: #ef4444; }

/* hero */
.hero { min-height: 100vh; display: flex; align-items: center; padding: 96px 0 48px; }
.hero .wrap { display: grid; grid-template-columns: 1.05fr 1fr; gap: 28px; align-items: center; }
.flip .hero .stage { order: -1; }
.hero h1 { font-size: clamp(40px, 5.4vw, 76px); line-height: 1.02; margin: 0 0 18px; }
.hero .lead { font-size: clamp(17px, 1.4vw, 19px); color: var(--soft); max-width: 46ch; }
.ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.facts { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; margin-top: 26px; font-size: 14px; color: var(--soft); }
.facts b { color: var(--ink); }
.facts .star { color: #f5b301; }
.stage { position: relative; height: min(66vh, 600px); min-height: 340px; touch-action: pan-y; cursor: grab; border-radius: var(--r); }
.stage.grab { cursor: grabbing; }
.stage .fb { position: absolute; inset: 8%; display: grid; place-items: center; border-radius: 50%; background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent-2) 55%, var(--surface)), color-mix(in srgb, var(--accent) 35%, var(--bg)) 70%); font-size: clamp(120px, 18vw, 230px); color: var(--ink); }
html.webgl .stage .fb { display: none; }
.hint { position: absolute; left: 50%; bottom: 6px; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; background: color-mix(in srgb, var(--surface) 80%, transparent); font-size: 12px; color: var(--soft); white-space: nowrap; pointer-events: none; }
html:not(.webgl) .hint { display: none; }
.variants { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 22px; }
.variants > span { font-size: 13px; color: var(--soft); margin-right: 4px; }
.chip { display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 14px 0 6px; border-radius: 999px; border: 1px solid var(--line); background: color-mix(in srgb, var(--surface) 85%, transparent); color: var(--ink); font: 500 14px/1 var(--ft), system-ui, sans-serif; cursor: pointer; }
.chip i { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--c1) 50%, var(--c2) 50%); box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }
.chip[aria-pressed="true"] { border-color: var(--accent); box-shadow: inset 0 0 0 1.5px var(--accent); }

/* bagian samping: teks di satu sisi, objek di sisi lain */
.side .wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.side.r .copy { grid-column: 2; }
.side .copy { min-width: 0; }

.about p + p { margin-top: 14px; }
.about p { color: var(--soft); }
.stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 26px; }
.stats div { padding: 18px; }
.stats b { display: block; font: 700 clamp(26px, 2.8vw, 38px)/1.05 var(--fd), system-ui, sans-serif; color: var(--accent); font-variant-numeric: tabular-nums; white-space: nowrap; }
.stats span { font-size: 14px; color: var(--soft); }
.founder { margin: 26px 0 0; padding: 20px 22px; border-left: 4px solid var(--accent); background: color-mix(in srgb, var(--surface) 70%, transparent); border-radius: 0 var(--r) var(--r) 0; }
.founder blockquote { margin: 0 0 10px; font: 500 18px/1.5 var(--fd), system-ui, sans-serif; }
.founder figcaption { font-size: 14px; color: var(--soft); }

/* katalog */
.tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: -10px 0 26px; }
.tab { min-height: 42px; padding: 0 18px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); font: 500 14px/1 var(--ft), system-ui, sans-serif; cursor: pointer; }
.tab[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin: 0; padding: 0; list-style: none; }
.item { position: relative; display: flex; flex-direction: column; padding: 18px; }
.item[hidden] { display: none; }
.item .pic { display: grid; place-items: center; aspect-ratio: 16 / 10; margin-bottom: 14px; border-radius: calc(var(--r) - 6px); background: linear-gradient(140deg, color-mix(in srgb, var(--accent) 16%, var(--surface)), color-mix(in srgb, var(--accent-2) 22%, var(--surface))); font-size: 64px; color: var(--ink); }
.item .tag { position: absolute; top: 26px; left: 26px; padding: 3px 10px; border-radius: 999px; background: var(--accent-2); color: var(--on-accent-2); font-size: 12px; font-weight: 700; }
.item small.cat { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--soft); }
.item h3 { margin: 4px 0 6px; }
.item p { font-size: 14px; color: var(--soft); flex: 1; }
.item .row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 14px; }
.price { font: 700 19px/1.1 var(--fd), system-ui, sans-serif; color: var(--accent); }
.price small { display: block; font: 500 12px/1.3 var(--ft), system-ui, sans-serif; color: var(--soft); }

/* keunggulan & alur */
.usp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; }
.usp li { padding: 18px; }
.usp .ico { font-size: 34px; margin-bottom: 10px; }
.usp h3 { font-size: 17px; margin-bottom: 4px; }
.usp p { font-size: 14px; color: var(--soft); }
.steps { margin: 0; padding: 0; list-style: none; counter-reset: st; display: grid; gap: 12px; }
.steps li { position: relative; padding: 18px 18px 18px 74px; counter-increment: st; }
.steps li::before { content: counter(st, decimal-leading-zero); position: absolute; left: 18px; top: 16px; width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px; background: var(--accent); color: var(--on-accent); font: 700 16px/1 var(--fd), system-ui, sans-serif; }
.steps h3 { font-size: 17px; margin-bottom: 4px; }
.steps p { font-size: 14px; color: var(--soft); }

/* testimoni */
.score { display: flex; align-items: center; gap: 14px; }
.score b { font: 700 46px/1 var(--fd), system-ui, sans-serif; }
.score span { font-size: 14px; color: var(--soft); max-width: 18ch; }
.testi { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin: 0; padding: 0; list-style: none; }
.testi li { display: flex; flex-direction: column; padding: 22px; }
.stars { color: #f5b301; letter-spacing: 2px; margin-bottom: 10px; }
.testi blockquote { margin: 0 0 16px; flex: 1; }
.testi .who b { display: block; }
.testi .who span { font-size: 13px; color: var(--soft); }

/* galeri: foto dirender dari objek 3D */
.gal { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 0; padding: 0; list-style: none; }
.gal li { position: relative; overflow: hidden; aspect-ratio: 4 / 3; border-radius: var(--r); background: linear-gradient(150deg, color-mix(in srgb, var(--accent) 30%, var(--surface)), color-mix(in srgb, var(--accent-2) 30%, var(--bg))); background-size: cover; background-position: center; }
.gal li:nth-child(1) { grid-row: span 2; aspect-ratio: auto; }
.gal li .ico { position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); font-size: 90px; color: var(--ink); opacity: .55; }
.gal li.shot .ico { display: none; }
.gal figcaption { position: absolute; left: 12px; right: 12px; bottom: 12px; padding: 8px 12px; border-radius: 12px; background: color-mix(in srgb, var(--surface) 86%, transparent); font-size: 14px; font-weight: 500; }

/* harga */
.plans { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: stretch; }
.plan { display: flex; flex-direction: column; padding: 26px; }
.plan.hot { border: 2px solid var(--accent); box-shadow: 0 30px 60px -36px color-mix(in srgb, var(--accent) 70%, transparent); position: relative; }
.plan .badge { position: absolute; top: -13px; left: 26px; padding: 4px 12px; border-radius: 999px; background: var(--accent); color: var(--on-accent); font-size: 12px; font-weight: 700; }
.plan .amount { margin: 14px 0 6px; font: 700 clamp(28px, 3vw, 38px)/1 var(--fd), system-ui, sans-serif; }
.plan .amount small { font: 500 14px/1 var(--ft), system-ui, sans-serif; color: var(--soft); }
.plan > p { font-size: 14px; color: var(--soft); }
.plan ul { margin: 18px 0 22px; padding: 0; list-style: none; display: grid; gap: 8px; flex: 1; font-size: 15px; }
.plan li { position: relative; padding-left: 26px; }
.plan li::before { content: ""; position: absolute; left: 0; top: .42em; width: 14px; height: 8px; border-left: 2.5px solid var(--accent); border-bottom: 2.5px solid var(--accent); transform: rotate(-45deg); }
.plan .btn { width: 100%; }

/* lokasi */
.loc { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; }
.map { position: relative; min-height: 340px; border-radius: var(--r); overflow: hidden; background: color-mix(in srgb, var(--accent) 10%, var(--surface)); border: 1px solid var(--line); color: var(--ink); }
.map svg.grid-map { position: absolute; inset: 0; width: 100%; height: 100%; }
.map .pin { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -100%); display: grid; justify-items: center; gap: 6px; }
.map .pin b { padding: 8px 14px; border-radius: 12px; background: var(--ink); color: var(--bg); font-size: 14px; white-space: nowrap; }
.map .pin i { width: 18px; height: 18px; border-radius: 50%; background: var(--accent); border: 4px solid var(--bg); box-shadow: 0 0 0 8px color-mix(in srgb, var(--accent) 30%, transparent); }
.map .btn { position: absolute; left: 16px; bottom: 16px; }
.info { padding: 24px; }
.info table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 15px; }
.info td { padding: 8px 0; border-bottom: 1px solid var(--line); }
.info td + td { text-align: right; font-variant-numeric: tabular-nums; }
.info address { font-style: normal; color: var(--soft); }
.contacts { display: grid; gap: 6px; margin-top: 14px; font-size: 15px; }
.contacts a { text-decoration: none; }
.contacts a:hover { color: var(--accent); }

/* faq */
.faq { display: grid; gap: 10px; }
.faq details { padding: 0 20px; }
.faq summary { display: flex; justify-content: space-between; gap: 14px; align-items: center; min-height: 58px; font-weight: 600; cursor: pointer; list-style: none; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: "+"; font-size: 22px; color: var(--accent); transition: transform .2s; }
.faq details[open] summary::after { transform: rotate(45deg); }
.faq details p { padding: 0 0 18px; color: var(--soft); }

/* kontak */
.form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; padding: 22px; }
.form label { display: grid; gap: 6px; font-size: 13px; font-weight: 600; color: var(--soft); }
.form .full { grid-column: 1 / -1; }
.form input, .form select, .form textarea { width: 100%; min-height: 46px; padding: 10px 14px; border-radius: calc(var(--r) - 8px); border: 1px solid var(--line); background: var(--bg); color: var(--ink); font: 15px/1.4 var(--ft), system-ui, sans-serif; }
.form textarea { resize: vertical; }
.form .btn { grid-column: 1 / -1; }
.quick { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }

footer { position: relative; z-index: 2; padding: 56px 0 28px; background: color-mix(in srgb, var(--surface) 92%, var(--bg)); border-top: 1px solid var(--line); font-size: 15px; }
.fgrid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 28px; }
.fgrid h3 { font-size: 15px; margin-bottom: 12px; }
.fgrid ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; color: var(--soft); }
.fgrid a { text-decoration: none; }
.fgrid a:hover { color: var(--accent); }
.fbot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--line); font-size: 13px; color: var(--soft); }
.fab { position: fixed; right: 18px; bottom: 18px; z-index: 45; display: grid; place-items: center; width: 58px; height: 58px; border-radius: 50%; background: #25d366; color: #fff; box-shadow: 0 14px 30px -10px rgba(0,0,0,.5); }
.fab svg { width: 30px; height: 30px; fill: currentColor; }

html.js [data-rv] { opacity: 0; transform: translateY(26px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); transition-delay: var(--d, 0s); }
html.js [data-rv].in { opacity: 1; transform: none; }
html.no-webgl body { background: radial-gradient(80% 60% at 75% 10%, color-mix(in srgb, var(--accent) 18%, var(--bg)), var(--bg) 70%) fixed; }
html.no-webgl #gl { display: none; }
${ICON_CSS}
@media (max-width: 1080px) {
  .testi { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .nav ul a { padding: 0 8px; }
}
@media (max-width: 900px) {
  .nav ul { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; padding: 10px var(--pad) 16px; background: var(--bg); border-bottom: 1px solid var(--line); }
  .nav.open ul { display: flex; }
  .nav ul a { min-height: 46px; font-size: 16px; }
  .menu-btn { display: block; }
  .nav .btn span { display: none; }
  .nav .btn { width: 44px; min-height: 44px; padding: 0; }
  .hero { padding-top: 80px; }
  .hero .wrap { grid-template-columns: 1fr; gap: 8px; }
  .hero .stage, .flip .hero .stage { order: -1; height: 42vh; min-height: 280px; }
  .side .wrap { grid-template-columns: 1fr; }
  .side.r .copy { grid-column: 1; }
  .side .copy { padding: 22px; border-radius: var(--r); background: color-mix(in srgb, var(--bg) 84%, transparent); }
  .side .copy .card { background: color-mix(in srgb, var(--surface) 92%, transparent); }
  .gal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gal li:nth-child(1) { grid-row: auto; aspect-ratio: 4 / 3; }
  .plans, .loc { grid-template-columns: 1fr; }
  .fgrid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .usp, .stats, .form { grid-template-columns: 1fr; }
  .testi { grid-template-columns: 1fr; }
  .gal { grid-template-columns: 1fr; }
  .fgrid { grid-template-columns: 1fr; }
  .grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  html.js [data-rv] { opacity: 1; transform: none; transition: none; }
  #gl { transition: none; }
  .loader i { animation: none; }
}
`;
}

/* ------------------------------- HTML ------------------------------ */

const waText = (s: BizSpec, t?: string) => `https://wa.me/${s.wa}?text=${encodeURIComponent(t ?? `Halo ${s.name}, saya mau tanya.`)}`;

function heroHtml(s: BizSpec): string {
  return `<section class="hero" id="beranda" data-pose="0" aria-labelledby="hero-t"><div class="wrap">
  <div class="hero-text">
    <p class="kick"${ot("heroLabel", "Hero: label kecil")}>${esc(s.type)}</p>
    <h1 id="hero-t"${ot("heroJudul", "Hero: judul")}>${esc(s.tagline)}</h1>
    <p class="lead"${ot("heroTeks", "Hero: paragraf", true)}>${esc(s.intro)}</p>
    <div class="ctas"><a class="btn" href="#katalog"${ot("heroTombol1", "Hero: tombol 1")}>Lihat ${esc(s.catalogTitle.toLowerCase())}</a><a class="btn ghost" href="${esc(waText(s))}" target="_blank" rel="noopener" data-wa>${WA_SVG}<span${ot("heroTombol2", "Hero: tombol 2")}>Chat WhatsApp</span></a></div>
    <div class="facts"><span class="status" data-status><i></i><span>Jam buka</span></span><span><span class="star">&#9733;</span> <b${ot("rating", "Rating")}>${esc(s.rating[0])}</b> <span${ot("ratingKet", "Keterangan rating")}>${esc(s.rating[1])}</span></span><span${ot("kota", "Kota")}>${esc(s.city)}</span></div>
    <div class="variants" data-variants><span${ot("varianLabel", "Label pilihan varian")}>${esc(s.variantLabel ?? "Coba warna:")}</span>${s.variants.map(([n, a, b], i) => `<button class="chip" type="button" aria-pressed="${i === 0}" style="--c1:${a};--c2:${b}"><i></i>${esc(n)}</button>`).join("")}</div>
  </div>
  <div class="stage" tabindex="0" role="img" aria-label="Model 3D ${esc(s.name)}. Geser atau pakai tombol panah untuk memutar."><div class="fb" aria-hidden="true">${icon(s.icon)}</div><span class="hint" aria-hidden="true">&#8645; Gulir untuk merakit, geser untuk memutar</span></div>
</div></section>`;
}

function sideClass(s: BizSpec, i: number) {
  return bizPoses(s)[i].x > 0 ? "l" : "r";
}

export function buildBiz(spec: BizSpec): string {
  const s = withLook(spec);
  const look = BIZ_LOOKS[s.id];
  const board = storyboardOf(s.model);
  const story = STORY_OF[s.model] ?? (["spark", "spiral"] as const);
  if (!MODELS[s.model]) throw new Error(`${s.id}: model ${s.model} tidak ada`);
  const [bg, surface, ink, soft, accent, accent2] = s.colors;
  const lum = (h: string) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  const on = (h: string) => (lum(h) > 0.62 ? "#161616" : "#ffffff");
  const vars: ThemeVar[] = [
    { name: "--bg", value: bg, label: "Latar halaman" },
    { name: "--surface", value: surface, label: "Latar kartu" },
    { name: "--ink", value: ink, label: "Teks utama" },
    { name: "--soft", value: soft, label: "Teks sekunder" },
    { name: "--accent", value: accent, label: "Warna utama (tombol, harga)" },
    { name: "--accent-2", value: accent2, label: "Warna kedua (label, aksen)" },
    { name: "--on-accent", value: on(accent), label: "Teks di atas warna utama" },
    { name: "--on-accent-2", value: on(accent2), label: "Teks di atas warna kedua" },
    { name: "--line", value: `color-mix(in srgb, ${ink} 13%, transparent)`, label: "Garis" },
    { name: "--r", value: `${s.round ?? 20}px`, label: "Sudut kartu", range: [0, 32, 1] },
    { name: "--pad", value: "clamp(16px, 4vw, 48px)", label: "Jarak tepi halaman" },
    { name: "--fd", value: `"${s.font[0]}"`, label: "Font judul" },
    { name: "--ft", value: `"${s.font[1]}"`, label: "Font teks" },
  ];
  const config = {
    whatsapp: s.wa,
    zonaWaktu: s.hours[0]?.[1].includes("WITA") ? 8 : s.hours[0]?.[1].includes("WIT") ? 9 : 7,
    jamBuka: s.open.map(([d, a, b]) => ({ hari: d.join(","), buka: a, tutup: b })),
    pesanPembuka: `Halo ${s.name}, saya mau pesan:`,
    varian: s.variants.map(([nama, warna1, warna2]) => ({ nama, warna1, warna2 })),
    putarOtomatis: true,
  };
  const daftar = bizDaftar(s);
  const rd = { CONFIG: config, DAFTAR: daftar };
  const nav: [string, string][] = [["#profil", "Profil"], ["#katalog", s.catalogTitle.split(" ")[0]], ["#harga", "Harga"], ["#galeri", "Galeri"], ["#lokasi", "Lokasi"], ["#faq", "FAQ"]];
  const lane = (i: number) => sideClass(s, i);
  const body = `
<a class="skip" href="#katalog">Lewati ke ${esc(s.catalogTitle.toLowerCase())}</a>
<canvas id="gl" aria-hidden="true"></canvas>
<div class="loader" aria-hidden="true"><i></i>Memuat 3D</div>
<header class="nav"><div class="wrap">
  <a class="logo" href="#beranda">${icon(s.icon)}<span${ot("nama", "Nama usaha")}>${esc(s.name)}</span></a>
  <nav aria-label="Navigasi utama"><ul>${nav.map(([h, t], i) => `<li><a href="${h}"${ot(`menu${i + 1}`, `Menu ${i + 1}`)}>${esc(t)}</a></li>`).join("")}</ul></nav>
  <a class="btn sm" href="${esc(waText(s))}" target="_blank" rel="noopener" data-wa aria-label="Chat WhatsApp">${WA_SVG}<span${ot("navTombol", "Tombol di navigasi")}>Hubungi kami</span></a>
  <button class="menu-btn" type="button" aria-label="Buka menu" aria-expanded="false"><span></span></button>
</div><div class="progress" aria-hidden="true"><i></i></div></header>
<main id="konten">
${heroHtml(s)}
<section class="s side ${lane(1)}" id="profil" data-pose="1"><div class="wrap"><div class="copy about">
  <p class="kick" data-rv${ot("profilLabel", "Profil: label kecil")}>Tentang ${esc(s.name)}</p>
  <h2 data-rv${ot("profilJudul", "Profil: judul")}>${esc(s.about[0])}</h2>
  <p data-rv${ot("profilTeks1", "Profil: paragraf 1", true)}>${esc(s.about[1])}</p>
  <p data-rv${ot("profilTeks2", "Profil: paragraf 2", true)}>${esc(s.about[2])}</p>
  <div class="stats">${s.stats.map(([v, l], i) => `<div class="card" data-rv style="--d:${i * 0.06}s"><b data-count${ot(`angka${i + 1}`, `Angka ${i + 1}`)}>${esc(v)}</b><span${ot(`angka${i + 1}Label`, `Angka ${i + 1}: label`)}>${esc(l)}</span></div>`).join("")}</div>
  <figure class="founder" data-rv><blockquote${ot("pendiriKutipan", "Kutipan pendiri", true)}>&ldquo;${esc(s.founder[0])}&rdquo;</blockquote><figcaption><b${ot("pendiriNama", "Nama pendiri")}>${esc(s.founder[1])}</b>, <span${ot("pendiriPeran", "Peran pendiri")}>${esc(s.founder[2])}</span></figcaption></figure>
</div></div></section>
<section class="s" id="katalog" data-pose="2"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("katalogLabel", "Katalog: label kecil")}>${s.products.some((p) => p[2] > 0) ? "Harga jelas, pesan lewat WhatsApp" : "Layanan kami"}</p><h2${ot("katalogJudul", "Katalog: judul")}>${esc(s.catalogTitle)}</h2></div><p${ot("katalogTeks", "Katalog: keterangan", true)}>Pilih kategori untuk menyaring. Tekan Pesan, pesan WhatsApp langsung tersusun dengan nama item.</p></div>
  <div class="tabs" role="toolbar" aria-label="Saring kategori">${bizRegion("biz-tabs", rd)}</div>
  <ul class="grid">${bizRegion("biz-katalog", rd)}</ul>
</div></section>
<section class="s side ${lane(3)}" id="keunggulan" data-pose="3"><div class="wrap"><div class="copy">
  <p class="kick" data-rv${ot("uspLabel", "Keunggulan: label kecil")}>Kenapa memilih kami</p>
  <h2 data-rv${ot("uspJudul", "Keunggulan: judul")}>Yang membuat pelanggan kembali lagi</h2>
  <ul class="usp">${bizRegion("biz-usp", rd)}</ul>
</div></div></section>
<section class="s side ${lane(4)}" id="alur" data-pose="4"><div class="wrap"><div class="copy">
  <p class="kick" data-rv${ot("alurLabel", "Alur: label kecil")}>Cara kerja</p>
  <h2 data-rv${ot("alurJudul", "Alur: judul")}>Dari chat pertama sampai selesai</h2>
  <ol class="steps">${bizRegion("biz-alur", rd)}</ol>
</div></div></section>
<section class="s" id="testimoni" data-pose="5"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("ulasanLabel", "Ulasan: label kecil")}>Kata pelanggan</p><h2${ot("ulasanJudul", "Ulasan: judul")}>Dipercaya pelanggan sungguhan</h2></div><div class="score"><b${ot("rating", "Rating")}>${esc(s.rating[0])}</b><span><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><br><span${ot("ratingKet", "Keterangan rating")}>${esc(s.rating[1])}</span></span></div></div>
  <ul class="testi">${bizRegion("biz-ulasan", rd)}</ul>
</div></section>
<section class="s" id="galeri" data-pose="6"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("galeriLabel", "Galeri: label kecil")}>Galeri</p><h2${ot("galeriJudul", "Galeri: judul")}>Lihat lebih dekat</h2></div><p${ot("galeriTeks", "Galeri: keterangan", true)}>Setiap sudut dirender langsung dari model 3D di halaman ini, dalam warna yang berbeda.</p></div>
  <ul class="gal">${bizRegion("biz-galeri", rd)}</ul>
</div></section>
<section class="s" id="harga" data-pose="7"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("hargaLabel", "Harga: label kecil")}>Harga &amp; paket</p><h2${ot("hargaJudul", "Harga: judul")}>${esc(s.planTitle)}</h2></div><p${ot("hargaTeks", "Harga: keterangan", true)}>Harga transparan. Butuh yang berbeda? Ceritakan kebutuhanmu, kami buatkan penawaran.</p></div>
  <div class="plans">${bizRegion("biz-paket", rd)}</div>
</div></section>
<section class="s" id="lokasi" data-pose="8"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("lokasiLabel", "Lokasi: label kecil")}>Lokasi &amp; jam operasional</p><h2${ot("lokasiJudul", "Lokasi: judul")}>Mampir atau hubungi kami</h2></div></div>
  <div class="loc">
    <div class="map" data-rv>${MAP_SVG}<div class="pin"><b${ot("nama", "Nama usaha")}>${esc(s.name)}</b><i></i></div><a class="btn sm" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${s.name} ${s.address}`)}" target="_blank" rel="noopener"${ot("petaTombol", "Lokasi: tombol peta")}>Buka Google Maps</a></div>
    <div class="info card" data-rv style="--d:.1s">
      <span class="status" data-status><i></i><span>Jam buka</span></span>
      <table><tbody>${bizRegion("biz-jam", rd)}</tbody></table>
      <address${ot("alamat", "Alamat", true)}>${esc(s.address)}</address>
      <div class="contacts"><a href="${esc(waText(s))}" target="_blank" rel="noopener" data-wa>WhatsApp <b${ot("telepon", "Nomor tampil")}>${esc(s.phone)}</b></a><a href="mailto:${esc(s.email)}"${ot("email", "Email")}>${esc(s.email)}</a><span>Instagram <b${ot("instagram", "Instagram")}>${esc(s.ig)}</b></span></div>
    </div>
  </div>
</div></section>
<section class="s side ${lane(9)}" id="faq" data-pose="9"><div class="wrap"><div class="copy">
  <p class="kick" data-rv${ot("faqLabel", "FAQ: label kecil")}>Tanya jawab</p>
  <h2 data-rv${ot("faqJudul", "FAQ: judul")}>Pertanyaan yang sering masuk</h2>
  <div class="faq">${bizRegion("biz-faq", rd)}</div>
</div></div></section>
<section class="s side ${lane(10)}" id="kontak" data-pose="10"><div class="wrap"><div class="copy">
  <p class="kick" data-rv${ot("kontakLabel", "Kontak: label kecil")}>Kontak</p>
  <h2 data-rv${ot("kontakJudul", "Kontak: judul")}>${esc(s.cta[0])}</h2>
  <p class="soft" data-rv${ot("kontakTeks", "Kontak: isi", true)}>${esc(s.cta[1])}</p>
  <form class="form card" data-form data-rv>
    <label>Nama<input name="nama" required autocomplete="name" placeholder="Nama kamu"></label>
    <label>Kebutuhan<select name="perlu">${bizRegion("biz-pilihan", rd)}</select></label>
    <label class="full">Tanggal (opsional)<input type="date" name="tanggal"></label>
    <label class="full">Pesan<textarea name="pesan" rows="4" placeholder="Ceritakan kebutuhanmu"></textarea></label>
    <button class="btn" type="submit">${WA_SVG}<span${ot("formTombol", "Formulir: tombol")}>Kirim lewat WhatsApp</span></button>
  </form>
  <div class="quick" data-rv><a class="btn ghost sm" href="mailto:${esc(s.email)}"${ot("email", "Email")}>${esc(s.email)}</a><a class="btn ghost sm" href="#lokasi">Lihat lokasi</a></div>
</div></div></section>
</main>
<footer><div class="wrap">
  <div class="fgrid">
    <div><a class="logo" href="#beranda">${icon(s.icon)}<span${ot("nama", "Nama usaha")}>${esc(s.name)}</span></a><p class="soft" style="margin-top:12px"${ot("kakiTeks", "Kaki halaman: deskripsi", true)}>${esc(s.type)} di ${esc(s.city)}.</p></div>
    <div><h3>Jelajahi</h3><ul>${nav.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join("")}</ul></div>
    <div><h3>Hubungi</h3><ul><li><a href="${esc(waText(s))}" target="_blank" rel="noopener" data-wa>WhatsApp</a></li><li><a href="mailto:${esc(s.email)}">Email</a></li><li>${esc(s.ig)}</li></ul></div>
    <div><h3>Jam buka</h3><ul>${bizRegion("biz-jam-kaki", rd)}</ul></div>
  </div>
  <div class="fbot"><span>&copy; <span data-year>2026</span> <span${ot("nama", "Nama usaha")}>${esc(s.name)}</span>, <span${ot("kota", "Kota")}>${esc(s.city)}</span></span><span${ot("catatanKaki", "Catatan kaki")}>Usaha lokal, dibuat dengan sepenuh hati.</span></div>
</div></footer>
<a class="fab" href="${esc(waText(s))}" target="_blank" rel="noopener" data-wa aria-label="Chat WhatsApp">${WA_SVG.replace('class="wa-ico" ', "")}</a>
<script>
/* ==== DATA USAHA: ubah di sini (atau lewat editor OneWebDev) ==== */
const CONFIG = ${dataBlock("CONFIG", "Pengaturan usaha (WhatsApp, jam buka, varian 3D)", config)};
/* Daftar isi: tambah, hapus, urutkan, atau duplikat item lewat editor OneWebDev (HTML di bawah dibangun ulang dari sini). */
const DAFTAR = ${dataBlock("DAFTAR", "Daftar isi (katalog, paket, ulasan, FAQ, ...)", daftar, BIZ_DAFTAR_HIDE.split(","))};
/* ================================================================ */
${UI}
</script>
<script type="module">
${LIB_IMPORTS}
/* Motion (skrip klasik); animasi scroll memakai OWD Scrub bawaan (tanpa CDN). Bila gagal, situs tetap jalan. */
await umd(${JSON.stringify(path(MOTION_JS))}).catch((e) => console.warn("[owd] Animasi scroll tidak aktif:", e));

/* Pose objek per bagian (urutan = section data-pose) & sudut foto galeri. */
const POSES = ${JSON.stringify(bizPoses(s))};
const SHOTS = ${JSON.stringify(SHOTS)};
/* Cerita scroll: benih di hero (${SEED_LABEL[story[0]]}) lalu objek tersusun dengan gaya "${story[1]}". */
/* Storyboard: ${storyboardText(s.model)} */
const STORY = ${JSON.stringify({ seed: story[0], act: story[0] === "hammer" ? "strike" : "burst", build: story[1], world: board.world, variant: board.variant })};

/* ---- Objek 3D (prosedural, tanpa model/tekstur eksternal) ---- */
function buildModel(K, THREE, COL, BRAND) {
  const M = K.M;${MODELS[s.model]}
}
/* ---- Benih cerita (muncul di hero sebelum objek dirakit) ---- */
function buildSeed(K, THREE, COL) {
  const M = K.M;${SEEDS[story[0]]}
}
/* ---- Dunia di dalam objek saat menyelam: ${board.world} ---- */
function buildWorld(W) {
  const THREE = W.THREE;${WORLDS[board.world]}
}
function floatGeo(THREE) { return ${FLOATERS[board.world]}; }
${ENGINE.trim()}
${look?.js ? `/* ---- Identitas "${look.name}": efek scroll khas ---- */\n${look.js.trim()}` : ""}
</script>`;
  return doc({
    title: `${s.name} | ${s.type}`,
    description: `${s.name}, ${s.type.toLowerCase()} di ${s.city}. ${s.tagline}`,
    theme: bg,
    head: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLink(fontHref(s.font))}
${LENIS_STYLE}
${PRELOAD}
<link rel="preload" as="fetch" href="${MOTION_JS}" crossorigin>
<script>${SCRUB_JS.trim()}</script>
${BOOT}`,
    vars,
    css: css(s) + (look ? `\n/* ==== Identitas "${look.name}" (v27) ==== */${look.css}` : ""),
    body: applyLookHtml(look, body).replace('<main id="konten">', `<main id="konten"${s.flip ? ' class="flip"' : ""}>`),
  });
}

/* ------------------------- skrip antarmuka ------------------------- */
/* Skrip klasik: jalan segera walau library 3D belum termuat. */
const UI = String.raw`(function () {
  var root = document.documentElement, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nama = ((document.querySelector(".logo span") || {}).textContent || "").trim();
  var wa = String(CONFIG.whatsapp || "").replace(/\D/g, "");
  function waLink(text) { return "https://wa.me/" + wa + "?text=" + encodeURIComponent(text); }
  var rp = function (v) { return "Rp" + v.toLocaleString("id-ID").replace(/,/g, "."); };
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = waLink("Halo " + nama + ", saya mau tanya."); });
  /* Tombol Pesan / Pilih paket: pesan tersusun dari teks yang tampil (ikut berubah bila diedit). */
  document.querySelectorAll("[data-order]").forEach(function (a) {
    a.addEventListener("click", function () { var it = a.closest(".item"), h = it.querySelector("h3").textContent.trim(), p = it.querySelector(".price").textContent.replace(/\s+/g, " ").trim(); a.href = waLink(CONFIG.pesanPembuka + "\n- " + h + " (" + p + ")\n\nNama:\nCatatan:"); });
  });
  document.querySelectorAll("[data-plan]").forEach(function (a) {
    a.addEventListener("click", function () { var pl = a.closest(".plan"), h = pl.querySelector("h3").textContent.trim(); a.href = waLink("Halo " + nama + ", saya tertarik " + h + " (" + pl.querySelector(".amount").textContent.replace(/\s+/g, " ").trim() + ").\n\nNama:\nKebutuhan:"); });
  });
  var y = document.querySelector("[data-year]"); if (y) y.textContent = new Date().getFullYear();

  /* Menu ponsel. */
  var nav = document.querySelector(".nav"), mb = document.querySelector(".menu-btn");
  if (mb) { mb.addEventListener("click", function () { var o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); }); nav.querySelectorAll("ul a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); }); }); }

  /* Status buka sekarang (waktu usaha = UTC + zonaWaktu). */
  function mins(s) { var p = String(s).split(/[.:]/); return (+p[0] || 0) * 60 + (+p[1] || 0); }
  function status() {
    var now = new Date(Date.now() + (Number(CONFIG.zonaWaktu) || 7) * 3600e3), d = now.getUTCDay(), m = now.getUTCHours() * 60 + now.getUTCMinutes();
    var on = (CONFIG.jamBuka || []).some(function (j) { var days = String(j.hari).split(",").map(Number), a = mins(j.buka), b = mins(j.tutup); return days.indexOf(d) >= 0 && (b > a ? m >= a && m < b : m >= a || m < b); });
    document.querySelectorAll("[data-status]").forEach(function (el) { el.classList.toggle("on", on); el.classList.toggle("off", !on); el.lastElementChild.textContent = on ? "Buka sekarang" : "Sedang tutup"; });
  }
  status(); setInterval(status, 60000);

  /* Saring katalog. */
  var tabs = document.querySelectorAll(".tab"), items = document.querySelectorAll(".item");
  tabs.forEach(function (t) { t.addEventListener("click", function () { var f = t.getAttribute("data-f"); tabs.forEach(function (x) { x.setAttribute("aria-pressed", String(x === t)); }); items.forEach(function (it) { it.hidden = f !== "all" && it.getAttribute("data-c") !== f; if (!it.hidden) it.classList.add("in"); }); }); });

  /* Chip varian dari CONFIG.varian; objek 3D mendengarkan event owd:varian. */
  var vbox = document.querySelector("[data-variants]");
  if (vbox && Array.isArray(CONFIG.varian) && CONFIG.varian.length) {
    vbox.querySelectorAll(".chip").forEach(function (c) { c.remove(); });
    CONFIG.varian.forEach(function (v, i) {
      var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.setAttribute("aria-pressed", String(i === 0));
      b.style.setProperty("--c1", v.warna1); b.style.setProperty("--c2", v.warna2);
      b.appendChild(document.createElement("i")); b.appendChild(document.createTextNode(v.nama));
      b.addEventListener("click", function () { vbox.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); document.dispatchEvent(new CustomEvent("owd:varian", { detail: i })); });
      vbox.appendChild(b);
    });
  }

  /* Formulir kontak → pesan WhatsApp. */
  var form = document.querySelector("[data-form]");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(form), lines = ["Halo " + nama + ",", "", "Nama: " + (f.get("nama") || ""), "Kebutuhan: " + (f.get("perlu") || "")];
    if (f.get("tanggal")) lines.push("Tanggal: " + f.get("tanggal"));
    if (f.get("pesan")) lines.push("", String(f.get("pesan")));
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });

  /* Muncul saat digulir. */
  var rv = document.querySelectorAll("[data-rv]");
  if (window.OWD_THUMB || reduce || !("IntersectionObserver" in window)) rv.forEach(function (el) { el.classList.add("in"); });
  else { var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" }); rv.forEach(function (el) { io.observe(el); }); }

  /* Menu aktif sesuai bagian yang sedang dibaca. */
  var links = document.querySelectorAll(".nav ul a");
  if ("IntersectionObserver" in window) { var io2 = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); }); }); }, { rootMargin: "-45% 0px -50% 0px" }); document.querySelectorAll("main > section").forEach(function (s) { io2.observe(s); }); }
})();`;

/* ------------------------------- mesin 3D --------------------------- */

const ENGINE = String.raw`
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
/* OWD Scrub: mesin scroll bawaan OneWebDev (API mirip GSAP + ScrollTrigger). */
const G = window.OWDScrub, ST = G && G.ScrollTrigger, Mo = window.Motion;
const hasG = !!(G && ST);
const cssv = (n) => getComputedStyle(root).getPropertyValue(n).trim();
const COL = { bg: cssv("--bg"), surface: cssv("--surface"), ink: cssv("--ink"), accent: cssv("--accent"), accent2: cssv("--accent-2") };
const BRAND = ((document.querySelector(".logo span") || {}).textContent || "").trim();
const secs = Array.prototype.slice.call(document.querySelectorAll("[data-pose]"));
const S = Object.assign({}, POSES[0]);
const animated = !reduce && hasG;

/* 1) Gulir halus + pose objek per bagian (OWD Scrub). */
let lenis = null;
if (hasG) G.registerPlugin(ST);
if (animated) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ST.update);
  G.ticker.add((time) => lenis.raf(time * 1000));
  G.ticker.lagSmoothing(0);
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    const el = a && a.getAttribute("href").length > 1 && document.getElementById(a.getAttribute("href").slice(1));
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: el.id === "beranda" ? 0 : -66, duration: 1.4 });
  });
  G.to(".progress i", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  for (let i = 1; i < secs.length; i++) {
    G.timeline({ scrollTrigger: { trigger: secs[i], start: "top bottom", end: "top 30%", scrub: 1 } })
      .fromTo(S, Object.assign({}, POSES[i - 1]), Object.assign({}, POSES[i], { ease: "none", immediateRender: false }));
  }
} else if ("IntersectionObserver" in window) {
  /* Tanpa mesin scroll / kurangi gerak: pose melompat ke bagian yang sedang dibaca. */
  const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) Object.assign(S, POSES[secs.indexOf(e.target)]); }), { rootMargin: "-50% 0px -50% 0px" });
  secs.forEach((s) => io.observe(s));
}

/* 2) Motion: judul hero per kata, angka berjalan, tombol magnetis. */
if (!reduce && Mo && !window.OWD_THUMB) {
  const { animate, inView, stagger } = Mo;
  const ease = [0.2, 0.7, 0.2, 1];
  const h1 = document.getElementById("hero-t");
  if (h1) {
    const words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute("aria-label", h1.textContent.trim());
    h1.textContent = "";
    words.forEach((w, i) => { const s = document.createElement("span"); s.setAttribute("aria-hidden", "true"); s.style.display = "inline-block"; s.textContent = w; h1.appendChild(s); if (i < words.length - 1) h1.appendChild(document.createTextNode(" ")); });
    animate(h1.querySelectorAll("span"), { opacity: [0, 1], y: [36, 0], rotate: [4, 0] }, { delay: stagger(0.05, { startDelay: 0.1 }), duration: 0.8, ease });
  }
  document.querySelectorAll("[data-count]").forEach((el) => {
    const m = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/.exec(el.textContent.trim());
    if (!m) return;
    const raw = m[2], dec = /,\d+$/.test(raw) ? raw.split(",")[1].length : 0, target = parseFloat(raw.replace(/\./g, "").replace(",", "."));
    const fmt = (v) => m[1] + (dec ? v.toFixed(dec).replace(".", ",") : Math.round(v).toLocaleString("id-ID").replace(/,/g, ".")) + m[3];
    inView(el, () => { animate(0, target, { duration: 1.6, ease, onUpdate: (v) => { el.textContent = fmt(v); } }); }, { amount: 0.6 });
  });
  if (matchMedia("(pointer: fine)").matches) document.querySelectorAll(".hero .btn, .plan .btn").forEach((b) => {
    b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); animate(b, { x: (e.clientX - r.left - r.width / 2) * 0.2, y: (e.clientY - r.top - r.height / 2) * 0.3 }, { type: "spring", stiffness: 320, damping: 18 }); });
    b.addEventListener("pointerleave", () => { animate(b, { x: 0, y: 0 }, { type: "spring", stiffness: 260, damping: 14 }); });
  });
}

/* 3) Three.js */
function fail(reason) { root.classList.add("no-webgl"); root.classList.remove("loading"); console.warn("[owd] 3D tidak aktif:", reason); }
function hasWebGL() { try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { return false; } }
const canvas = document.getElementById("gl");
if (!hasWebGL()) fail("WebGL tidak tersedia");
else { try { start(); } catch (e) { fail(e && e.message ? e.message : String(e)); } }

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 8);
  const textures = [], disposables = [];
  const track = (x) => { disposables.push(x); return x; };

  /* Lingkungan pantulan buatan (tanpa HDR eksternal). */
  const pm = new THREE.PMREMGenerator(renderer), env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), new THREE.MeshBasicMaterial({ color: 0x6f6f74, side: THREE.BackSide })));
  const panel = (c, k, p, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.lookAt(0, 0, 0); env.add(m); };
  panel("#ffffff", 5, [0, 5, 0], 7, 7); panel("#ffffff", 3, [-5, 1, 2], 3, 6); panel(COL.accent, 2.5, [5, 0, -2], 3, 6); panel("#ffffff", 2, [0, 0, 5], 5, 2);
  const envTex = pm.fromScene(env, 0.04).texture; scene.environment = envTex; textures.push(envTex);
  env.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  pm.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, new THREE.Color(COL.bg), 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(3, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(new THREE.Color(COL.accent), 1.4); rim.position.set(-5, 2, -4); scene.add(rim);

  /* Tekstur kanvas. */
  function glowTex() {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.35, "rgba(255,255,255,.35)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); textures.push(t); return t;
  }
  const GLOW = glowTex();
  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  function canvasTex(w, h, draw, repeat) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); }
    textures.push(t); return t;
  }
  /* Pola abu-abu: warna bahan (varian) yang mewarnainya. */
  const PATTERNS = {
    batik: (g, w) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, w); g.fillStyle = "#6a6a6a"; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const cx = x * 64 + 32, cy = y * 64 + 32; for (let k = 0; k < 4; k++) { g.save(); g.translate(cx, cy); g.rotate(k * Math.PI / 2 + Math.PI / 4); g.beginPath(); g.ellipse(0, -16, 9, 15, 0, 0, 7); g.fill(); g.restore(); } g.beginPath(); g.arc(cx, cy, 4, 0, 7); g.fill(); } },
    parang: (g, w) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, w); g.strokeStyle = "#5c5c5c"; g.lineWidth = 12; for (let i = -4; i < 8; i++) { g.beginPath(); for (let t = 0; t <= 1; t += .05) { const x = i * 48 + t * 256, y = t * 256 + Math.sin(t * Math.PI * 6) * 12; t ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } },
    stripe: (g, w) => { g.fillStyle = "#1a1a1a"; g.fillRect(0, 0, w, w); g.fillStyle = "#fff"; for (let i = -4; i < 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64 + 32, 0); g.lineTo(i * 64 + 32 + 64, w); g.lineTo(i * 64 + 64, w); g.fill(); } },
    dots: (g, w) => { g.fillStyle = "#e6e6e6"; g.fillRect(0, 0, w, w); g.fillStyle = "#3a3a3a"; for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { g.beginPath(); g.arc(x * 16 + 8 + (y % 2) * 8, y * 16 + 8, 4, 0, 7); g.fill(); } },
    grid: (g, w) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, w, w); g.strokeStyle = "#9a9a9a"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, w); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } },
    globe: (g, w) => { g.fillStyle = "#8a8a8a"; g.fillRect(0, 0, w, w); g.fillStyle = "#fff"; [[40,70,40,28],[90,150,30,46],[160,80,52,30],[200,160,30,22],[130,60,18,14]].forEach(([x, y, a, b]) => { g.beginPath(); g.ellipse(x, y, a, b, .4, 0, 7); g.fill(); }); },
    rings: (g, w) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, w); for (let i = 8; i > 0; i--) { g.fillStyle = i % 2 ? "#777" : "#fff"; g.beginPath(); g.arc(w * .6, w * .45, i * 18, 0, 7); g.fill(); } },
  };
  const REP = { batik: 2, parang: 2, dots: 3, grid: 2, stripe: 1, globe: 1, rings: 1 };

  /* Bahan. Varian (CONFIG.varian) mewarnai m1 & m2. */
  const VAR = Array.isArray(CONFIG.varian) && CONFIG.varian.length ? CONFIG.varian : [{ warna1: COL.accent, warna2: COL.accent2 }];
  const std = (c, o) => track(new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.45, metalness: 0 }, o || {})));
  const M = {
    m1: std(VAR[0].warna1, { roughness: 0.38 }), m2: std(VAR[0].warna2, { roughness: 0.45 }),
    m3: std("#f3efe7", { roughness: 0.5 }), dk: std("#1f2026", { roughness: 0.5 }),
    mt: std("#c9cdd4", { metalness: 1, roughness: 0.28 }), au: std("#d9aa4b", { metalness: 1, roughness: 0.3 }),
    gl: track(new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, metalness: 0, transparent: true, opacity: 0.28, envMapIntensity: 1.6, depthWrite: false })),
    gl2: std("#1b2331", { roughness: 0.08, metalness: 0.6 }),
  };

  /* Alat bantu menyusun objek. */
  const model = new THREE.Group();
  let seed = 11, target = model;
  function put(o, opt) {
    opt = opt || {};
    if (opt.p) o.position.set(opt.p[0] || 0, opt.p[1] || 0, opt.p[2] || 0);
    if (opt.r) o.rotation.set(opt.r[0] || 0, opt.r[1] || 0, opt.r[2] || 0);
    if (opt.s) o.scale.set(opt.s[0], opt.s[1], opt.s[2]);
    (opt.to || target).add(o); return o;
  }
  const mesh = (geo, mat, opt) => put(new THREE.Mesh(track(geo), mat), opt);
  function rbox(w, h, d, r) {
    if (!r) return new THREE.BoxGeometry(w, h, d);
    const b = Math.min(r * 0.7, d * 0.45, w * 0.45, h * 0.45), cr = Math.max(0.001, Math.min(r, w / 2, h / 2) - b);
    const ww = w - 2 * b, hh = h - 2 * b, sh = new THREE.Shape(), x = -ww / 2, y = -hh / 2;
    sh.moveTo(x + cr, y); sh.lineTo(x + ww - cr, y); sh.quadraticCurveTo(x + ww, y, x + ww, y + cr); sh.lineTo(x + ww, y + hh - cr); sh.quadraticCurveTo(x + ww, y + hh, x + ww - cr, y + hh); sh.lineTo(x + cr, y + hh); sh.quadraticCurveTo(x, y + hh, x, y + hh - cr); sh.lineTo(x, y + cr); sh.quadraticCurveTo(x, y, x + cr, y);
    const g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.001, d - 2 * b), bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 4, curveSegments: 8 });
    g.center(); return g;
  }
  const K = {
    M, rr, mesh,
    rnd: () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; },
    grp: (opt) => put(new THREE.Group(), opt),
    std: (c, o) => std(c, o),
    lathe: (pts, mat, opt, seg) => mesh(new THREE.LatheGeometry(pts.map((q) => new THREE.Vector2(q[0], q[1])), seg || 56), mat, opt),
    box: (w, h, d, r, mat, opt) => mesh(rbox(w, h, d, r), mat, opt),
    cyl: (rt, rb, h, mat, opt, seg, open) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 40, 1, !!open), mat, opt),
    sph: (r, mat, opt) => mesh(new THREE.SphereGeometry(r, 32, 20), mat, opt),
    tor: (R, t, mat, opt, arc) => mesh(new THREE.TorusGeometry(R, t, 16, 64, arc || Math.PI * 2), mat, opt),
    cap: (r, len, mat, opt) => mesh(new THREE.CapsuleGeometry(r, len, 8, 24), mat, opt),
    plane: (w, h, mat, opt) => mesh(new THREE.PlaneGeometry(w, h), mat, opt),
    ext: (pts, depth, mat, opt, bev) => { const sh = new THREE.Shape(pts.map((q) => new THREE.Vector2(q[0], q[1]))); const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: bev > 0, bevelSize: bev || 0, bevelThickness: bev || 0, bevelSegments: 3, curveSegments: 16 }); if (!(opt && opt.keep)) g.center(); return mesh(g, mat, opt); },
    screen: (w, h, draw) => track(new THREE.MeshBasicMaterial({ map: canvasTex(w, h, draw), toneMapped: false })),
    tex: (kind) => canvasTex(256, 256, PATTERNS[kind] || PATTERNS.grid, REP[kind] || 1),
    spr: (c, size, opt) => { const s = put(new THREE.Sprite(track(new THREE.SpriteMaterial({ map: GLOW, color: c, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }))), opt); s.scale.setScalar(size); return s; },
    tick: null,
    target: (g) => { target = g; },
  };
  K.g = model;
  buildModel(K, THREE, COL, BRAND);

  /* Ukuran & titik tengah objek diseragamkan. */
  model.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(model), size = bb.getSize(new THREE.Vector3()), mid = bb.getCenter(new THREE.Vector3());
  const k = 2.7 / Math.max(size.x, size.y, size.z);
  const fit = new THREE.Group(); fit.add(model); model.position.sub(mid); fit.scale.setScalar(k);
  const spin = new THREE.Group(); spin.add(fit);
  const pivot = new THREE.Group(); pivot.add(spin); scene.add(pivot);
  const shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), track(new THREE.MeshBasicMaterial({ map: GLOW, color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false })));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -size.y * k / 2 - 0.08; shadow.scale.set(3.4, 3.4, 1); pivot.add(shadow);

  /* Partikel latar: bentuk kecil melayang. */
  const floaters = new THREE.Group(); scene.add(floaters);
  const fm = [std(COL.accent, { roughness: 0.4 }), std(COL.accent2, { roughness: 0.4 }), track(M.m3.clone())].map((x) => { x.transparent = true; x.opacity = 0.55; x.depthWrite = false; return x; });
  const fg = floatGeo(THREE).map(track);
  for (let i = 0; i < 12; i++) { const f = new THREE.Mesh(fg[i % 4], fm[i % 3]); f.position.set((K.rnd() - 0.5) * 13, (K.rnd() - 0.5) * 8, -1.5 - K.rnd() * 4); f.userData.v = 0.2 + K.rnd() * 0.5; f.userData.y = f.position.y; floaters.add(f); }

${STORY_ENGINE.trim()}

  const tris = (() => { let n = 0; scene.traverse((o) => { if (o.isMesh) { const gg = o.geometry; n += (gg.index ? gg.index.count : gg.attributes.position.count) / 3; } }); return Math.round(n); })();
  window.__OWD_STATS = { triangles: tris, budget: 120000, contexts: 1 };

  /* Warna varian: m1/m2 + bahan turunan (m1b, m2b) bergeser halus ke warna tujuan. */
  const v1 = [M.m1, M.m1b].filter(Boolean), v2 = [M.m2, M.m2b].filter(Boolean);
  const want = { a: new THREE.Color(VAR[0].warna1), b: new THREE.Color(VAR[0].warna2) };
  function paintVariant(v, instant) {
    want.a.set(v.warna1); want.b.set(v.warna2);
    if (instant) { v1.forEach((m) => m.color.copy(want.a)); v2.forEach((m) => m.color.copy(want.b)); }
  }
  let current = 0;
  document.addEventListener("owd:varian", (e) => { current = e.detail % VAR.length; paintVariant(VAR[current], reduce); spinKick(); });

  /* Putar dengan geser (hero). */
  const stage = document.querySelector(".stage");
  const user = { ry: 0, rx: 0, vy: 0, drag: false, lx: 0, ly: 0 };
  function spinKick() { if (!reduce) user.vy += 0.12; }
  if (stage) {
    stage.addEventListener("pointerdown", (e) => { user.drag = true; user.lx = e.clientX; user.ly = e.clientY; stage.classList.add("grab"); try { stage.setPointerCapture(e.pointerId); } catch (x) {} });
    stage.addEventListener("pointermove", (e) => { if (!user.drag) return; const dx = e.clientX - user.lx, dy = e.clientY - user.ly; user.lx = e.clientX; user.ly = e.clientY; user.ry += dx * 0.012; user.vy = dx * 0.004; user.rx = Math.max(-0.6, Math.min(0.6, user.rx + dy * 0.006)); });
    const up = () => { user.drag = false; stage.classList.remove("grab"); };
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    stage.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { user.ry -= 0.3; e.preventDefault(); } if (e.key === "ArrowRight") { user.ry += 0.3; e.preventDefault(); } if (e.key === "ArrowUp") user.rx = Math.max(-0.6, user.rx - 0.15); if (e.key === "ArrowDown") user.rx = Math.min(0.6, user.rx + 0.15); });
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduce && matchMedia("(pointer: fine)").matches) addEventListener("pointermove", (e) => { pointer.tx = e.clientX / innerWidth - 0.5; pointer.ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener("resize", resize); resize();
  let visible = true;
  const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; });
  io.observe(canvas);

  let auto = 0;
  function applyPose(t) {
    const narrow = camera.aspect < 0.9;
    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
    const dv = reduce ? 0 : S.dive || 0, dz = 1 + dv * dv * 9; /* menyelam: objek membesar menembus kamera */
    const x = (narrow ? 0 : S.x * halfW) * (1 - dv), y = (narrow ? S.ny : S.y) * (1 - dv), s = (narrow ? S.ns : S.s) * dz;
    pivot.position.set(x, y + (reduce ? 0 : Math.sin(t * 1.1) * 0.05), 0);
    pivot.scale.setScalar(s);
    spin.rotation.set(S.rx + user.rx, S.ry + user.ry + auto, 0);
    camera.position.x = pointer.x * 0.35; camera.position.y = -pointer.y * 0.25; camera.lookAt(0, 0, 0);
    canvas.style.opacity = String(narrow ? S.no : S.o);
  }

  /* Galeri: setiap foto dirender dari objek yang sama (sudut & varian berbeda). */
  let shotsDone = false;
  function shots() {
    if (shotsDone) return; shotsDone = true;
    const tiles = Array.prototype.slice.call(document.querySelectorAll("[data-shot]"));
    if (!tiles.length) return;
    const W = 720, H = 540, keepZ = camera.position.clone();
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
    story(FIXED, 0, 0); lastKey = "";
    world.visible = false; points.visible = false; seedSpin.visible = false; spin.visible = true;
    floaters.visible = false; pivot.position.set(0, 0, 0); pivot.scale.setScalar(1);
    tiles.forEach((el, i) => {
      const sh = SHOTS[i % SHOTS.length];
      paintVariant(VAR[sh.v % VAR.length], true);
      scene.background = new THREE.Color(i % 2 ? COL.surface : COL.bg);
      spin.rotation.set(sh.rx, sh.ry, 0);
      camera.position.set(0, sh.y, sh.z); camera.lookAt(0, 0, 0);
      if (K.tick) K.tick(1.2 + i * 0.7, 0.016);
      renderer.render(scene, camera);
      try { el.style.backgroundImage = "url(" + canvas.toDataURL("image/jpeg", 0.86) + ")"; el.classList.add("shot"); } catch (e) {}
    });
    scene.background = null; floaters.visible = true; camera.position.copy(keepZ); camera.position.z = 8;
    paintVariant(VAR[current], true);
    renderer.setPixelRatio(dpr); resize();
  }
  const gal = document.getElementById("galeri");
  if (gal && !window.OWD_THUMB) { const gio = new IntersectionObserver((en) => { if (en[0].isIntersecting) { gio.disconnect(); requestAnimationFrame(shots); } }, { rootMargin: "900px 0px" }); gio.observe(gal); }

  const clock = new THREE.Clock();
  let raf = 0, first = true, frames = 0, slow = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.1), t = clock.elapsedTime;
    if (!visible || document.hidden) return;
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3); pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
    if (!user.drag) { user.ry += user.vy; user.vy *= 0.94; if (CONFIG.putarOtomatis !== false && !reduce) auto += dt * 0.22; }
    v1.forEach((m) => m.color.lerp(want.a, Math.min(1, dt * 5))); v2.forEach((m) => m.color.lerp(want.b, Math.min(1, dt * 5)));
    applyPose(t);
    if (K.tick && !reduce) K.tick(t, dt);
    story(reduce ? FIXED : S, t, reduce ? 0 : dt);
    const sy = window.scrollY || 0;
    floaters.children.forEach((f, i) => { f.rotation.x += dt * f.userData.v; f.rotation.y += dt * f.userData.v * 0.7; f.position.y = ((f.userData.y + sy * 0.0012 * f.userData.v * 3 + 4) % 8 + 8) % 8 - 4; });
    renderer.render(scene, camera);
    if (first) { first = false; root.classList.add("webgl"); root.classList.remove("loading"); }
    frames++; if (dt > 0.022) slow++;
    if (frames === 90) { if (slow > 45 && dpr > 1) { dpr = Math.max(1, dpr - 0.5); renderer.setPixelRatio(dpr); resize(); } frames = 0; slow = 0; }
  }
  if (window.OWD_THUMB) { Object.assign(S, POSES[0]); if (K.tick) K.tick(1.5, 0.016); applyPose(0); story(FIXED, 0, 0); renderer.render(scene, camera); root.classList.add("webgl"); root.classList.remove("loading"); return; }
  raf = requestAnimationFrame(frame);

  function dispose() {
    cancelAnimationFrame(raf);
    io.disconnect();
    if (hasG) ST.getAll().forEach((s) => s.kill());
    if (lenis) lenis.destroy();
    disposables.forEach((x) => x.dispose());
    textures.forEach((x) => x.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  }
  addEventListener("pagehide", dispose, { once: true });
}
`;
