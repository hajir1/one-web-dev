import { dataBlock, doc, esc, ot, type ThemeVar } from "./shared";
import { fontLink } from "./web3d";
import { ICON_CSS, icon } from "./umkmIcons";

/* ================================================================== */
/* SMALL BUSINESS LANDING PAGE (v23): one file, no library.             */
/*                                                                    */
/* A complete sales page for a small business: hero, strengths,         */
/* products + prices with a cart sent to WhatsApp, how to               */
/* order, testimonials, promos, FAQ, location & opening hours ("open    */
/* now" computed from CONFIG), and a floating WhatsApp button.          */
/*                                                                    */
/* Ten skins with different layouts (not just a color change):          */
/* pasar, papan, nota, majalah, bento, kontras, pastel, malam, alam,    */
/* kiosk. Illustrations = SVG icons (umkmIcons.ts), no external images. */
/* ================================================================== */

export type Skin = "pasar" | "papan" | "nota" | "majalah" | "bento" | "kontras" | "pastel" | "malam" | "alam" | "kios";

export interface LandingSpec {
  id: string;
  skin: Skin;
  /** [display, text] Google Fonts. */
  font: [string, string];
  /** [background, surface, text, soft text, accent, second accent] */
  colors: [string, string, string, string, string, string];
  icon: string;
  name: string;
  /** Small label in the hero, e.g. "Warung bakso sejak 2009". */
  type: string;
  tagline: string;
  intro: string;
  city: string;
  address: string;
  /** Opening hours rows shown: [day, hours]. */
  hours: [string, string][];
  /** Opening hours for the "open now" status: [day (0 = Sunday), open, close]. */
  open: [number[], string, string][];
  wa: string;
  ig: string;
  usp: [string, string, string][];
  menuTitle: string;
  /** [name, description, price, unit, icon, label?] */
  products: [string, string, number, string, string, string?][];
  steps: [string, string][];
  testi: [string, string, string][];
  faq: [string, string][];
  promo: [string, string];
  stats: [string, string][];
  /** false = a service business: no cart, each service has an ask-via-WhatsApp button. */
  cart?: false;
  /** Catalog category (TemplateCategory). */
  category?: string;
}

type Hero = "split" | "center" | "poster" | "board" | "ticket";
type List = "cards" | "list" | "receipt" | "bento" | "rows";
const LAYOUT: Record<Skin, { hero: Hero; list: List; ticker: boolean; label: string }> = {
  pasar: { hero: "split", list: "cards", ticker: true, label: "Pasar" },
  papan: { hero: "board", list: "list", ticker: false, label: "Papan Kapur" },
  nota: { hero: "ticket", list: "receipt", ticker: false, label: "Nota" },
  majalah: { hero: "poster", list: "rows", ticker: false, label: "Majalah" },
  bento: { hero: "split", list: "bento", ticker: false, label: "Bento" },
  kontras: { hero: "poster", list: "cards", ticker: true, label: "Kontras" },
  pastel: { hero: "center", list: "cards", ticker: false, label: "Pastel" },
  malam: { hero: "center", list: "rows", ticker: false, label: "Malam" },
  alam: { hero: "split", list: "cards", ticker: false, label: "Alam" },
  kios: { hero: "center", list: "list", ticker: true, label: "Kios" },
};
export const skinLabel = (s: Skin) => LAYOUT[s].label;

export const rupiah = (v: number) => "Rp" + v.toLocaleString("id-ID").replace(/,/g, ".");
/** Google Fonts with only one weight (requesting 500–700 makes the Google CSS fail). */
const SINGLE_WEIGHT: Record<string, string> = { Anton: "", Shrikhand: "", "Young Serif": "", "Instrument Serif": ":ital@0;1", "Abril Fatface": "", "Bebas Neue": "", Righteous: "", Gloock: "", Italiana: "", "Gilda Display": "", "Archivo Black": "" };
export const fontHref = (f: [string, string]) =>
  `https://fonts.googleapis.com/css2?${[...new Set(f)].map((x) => `family=${x.replace(/ /g, "+")}${x in SINGLE_WEIGHT ? SINGLE_WEIGHT[x] : x === "Courier Prime" || x === "Space Mono" ? ":ital,wght@0,400;0,700;1,400" : ":wght@400;500;600;700"}`).join("&")}&display=swap`;

/* ------------------------------- CSS ------------------------------- */

const BASE = `
:root { --font-display: var(--fd), Georgia, serif; --font-text: var(--ft), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; --pad: clamp(16px, 5vw, 64px); --r: 18px; --max: 1160px; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--bg); }
body { margin: 0; background: var(--bg); color: var(--ink); font: 16.5px/1.6 var(--font-text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
img, svg { max-width: 100%; }
a { color: inherit; }
h1, h2, h3 { font-family: var(--font-display); line-height: 1.08; margin: 0 0 14px; letter-spacing: -.02em; }
h1 { font-size: clamp(40px, 6.4vw, 84px); }
h2 { font-size: clamp(30px, 4vw, 52px); }
h3 { font-size: 20px; letter-spacing: -.01em; }
p { margin: 0 0 12px; }
.wrap { width: min(100% - 2 * var(--pad), var(--max)); margin-inline: auto; }
.skip { position: absolute; left: -999px; top: 8px; z-index: 90; padding: 10px 14px; border-radius: 8px; background: var(--accent); color: var(--on-accent); }
.skip:focus { left: 8px; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.kick { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 14px; font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
.soft { color: var(--soft); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 22px; border-radius: 999px; border: 2px solid var(--accent); background: var(--accent); color: var(--on-accent); font: 600 15px/1 var(--font-text); text-decoration: none; cursor: pointer; transition: transform .2s, box-shadow .2s, background .2s; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -12px var(--accent); }
.btn.ghost { background: transparent; color: var(--ink); border-color: color-mix(in srgb, var(--ink) 25%, transparent); }
.btn .ico { font-size: 20px; }
.wa-ico { width: 20px; height: 20px; fill: currentColor; }

/* nav */
.nav { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.nav .wrap { display: flex; align-items: center; gap: 18px; min-height: 66px; }
.logo { display: inline-flex; align-items: center; gap: 10px; font: 700 19px/1.1 var(--font-display); text-decoration: none; }
.logo .ico { font-size: 30px; }
.nav ul { display: flex; gap: 4px; margin: 0 0 0 auto; padding: 0; list-style: none; }
.nav ul a { display: inline-flex; min-height: 40px; align-items: center; padding: 0 12px; border-radius: 999px; font-size: 14.5px; text-decoration: none; color: var(--soft); }
.nav ul a:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 7%, transparent); }
.nav .btn { min-height: 42px; padding: 0 16px; font-size: 14px; }
.menu-btn { display: none; margin-left: auto; width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; }
.menu-btn span, .menu-btn span::before, .menu-btn span::after { display: block; width: 18px; height: 2px; margin: auto; background: currentColor; position: relative; content: ""; }
.menu-btn span::before { position: absolute; top: -6px; } .menu-btn span::after { position: absolute; top: 6px; }

/* hero */
.hero { position: relative; padding: clamp(40px, 8vw, 96px) 0 clamp(48px, 8vw, 100px); overflow: hidden; }
.hero .lead { font-size: clamp(17px, 1.6vw, 20px); color: var(--soft); max-width: 44ch; }
.ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.meta { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 26px; font-size: 14px; color: var(--soft); }
.meta b { color: var(--ink); }
.status { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; background: color-mix(in srgb, var(--ink) 7%, transparent); }
.status i { width: 8px; height: 8px; border-radius: 50%; background: #9aa0a6; }
.status.on i { background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,.2); }
.status.off i { background: #ef4444; }
.art { position: relative; aspect-ratio: 1; width: min(100%, 460px); margin-inline: auto; }
.art .big { position: absolute; inset: 14%; display: grid; place-items: center; border-radius: 50%; background: var(--surface); color: var(--ink); box-shadow: 0 40px 80px -50px rgba(0,0,0,.5); transition: transform .3s ease-out; }
.art .big .ico { font-size: clamp(130px, 22vw, 230px); }
.art .fl { position: absolute; display: grid; place-items: center; width: 22%; aspect-ratio: 1; border-radius: 28%; background: var(--surface); color: var(--ink); box-shadow: 0 20px 40px -26px rgba(0,0,0,.45); animation: bob 6s ease-in-out infinite; }
.art .fl .ico { font-size: 52%; width: 52%; height: 52%; }
.art .fl:nth-child(2) { left: 0; top: 8%; } .art .fl:nth-child(3) { right: 0; top: 22%; animation-delay: -2s; } .art .fl:nth-child(4) { left: 8%; bottom: 4%; animation-delay: -4s; }
.art .tag { position: absolute; right: 2%; bottom: 10%; padding: 10px 16px; border-radius: 14px; background: var(--accent); color: var(--on-accent); font-weight: 700; font-size: 14px; transform: rotate(-4deg); box-shadow: 0 16px 30px -18px rgba(0,0,0,.5); }
@keyframes bob { 50% { transform: translateY(-12px) rotate(3deg); } }

/* ticker */
.ticker { overflow: hidden; border-block: 1px solid var(--line); background: var(--accent); color: var(--on-accent); }
.ticker div { display: flex; gap: 40px; width: max-content; padding: 14px 0; font: 700 18px/1 var(--font-display); white-space: nowrap; animation: tick 30s linear infinite; }
.ticker span { display: inline-flex; align-items: center; gap: 12px; }
.ticker .ico { font-size: 24px; --accent: var(--on-accent); }
@keyframes tick { to { transform: translateX(-50%); } }

/* section */
section.s { padding: clamp(56px, 9vw, 110px) 0; }
.head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 12px 40px; margin-bottom: clamp(26px, 4vw, 44px); }
.head p { max-width: 46ch; color: var(--soft); margin: 0; }
.alt { background: var(--surface); }
.usp { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
.usp li { list-style: none; padding: 24px; border-radius: var(--r); background: var(--bg); border: 1px solid var(--line); }
.usp .ico { font-size: 46px; margin-bottom: 12px; color: var(--ink); }
.usp p { margin: 0; color: var(--soft); font-size: 15px; }
ul.usp, ul.grid, ol.steps, ul.testi, .faq { margin: 0; padding: 0; }
.stats { display: flex; flex-wrap: wrap; gap: 14px 40px; margin-top: 30px; }
.stats div b { display: block; font: 700 clamp(28px, 3.4vw, 42px)/1 var(--font-display); color: var(--accent); }
.stats div span { font-size: 14px; color: var(--soft); }

/* products */
.filter { display: flex; flex-wrap: wrap; gap: 8px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; }
.item { position: relative; display: flex; flex-direction: column; list-style: none; padding: 20px; border-radius: var(--r); background: var(--surface); border: 1px solid var(--line); }
.item .pic { display: grid; place-items: center; aspect-ratio: 4 / 3; margin-bottom: 16px; border-radius: calc(var(--r) - 6px); background: color-mix(in srgb, var(--accent) 14%, var(--bg)); color: var(--ink); }
.item .pic .ico { font-size: 92px; transition: transform .35s; }
.item:hover .pic .ico { transform: scale(1.08) rotate(-4deg); }
.item p { flex: 1; font-size: 14.5px; color: var(--soft); }
.item .badge { position: absolute; top: 14px; left: 14px; padding: 4px 10px; border-radius: 999px; background: var(--accent-2); color: var(--on-accent-2); font-size: 12px; font-weight: 700; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 6px; }
.price { font: 700 19px/1.1 var(--font-display); }
.price small { font: 500 12.5px var(--font-text); color: var(--soft); }
.qty { display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; border: 1.5px solid var(--line); padding: 3px; }
.qty button { width: 34px; height: 34px; border-radius: 50%; border: 0; background: var(--accent); color: var(--on-accent); font: 700 18px/1 var(--font-text); cursor: pointer; }
.qty button.minus { background: transparent; color: var(--ink); }
.qty output { min-width: 18px; text-align: center; font-weight: 700; font-variant-numeric: tabular-nums; }
.btn.ask { min-height: 38px; padding: 0 16px; }
.qty:not(.has) .minus, .qty:not(.has) output { display: none; }
.note { margin-top: 16px; font-size: 13.5px; color: var(--soft); }

/* langkah */
.steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; counter-reset: st; }
.steps li { list-style: none; position: relative; padding: 26px 22px 22px; border-radius: var(--r); border: 1px dashed color-mix(in srgb, var(--ink) 30%, transparent); counter-increment: st; }
.steps li::before { content: counter(st); display: grid; place-items: center; width: 40px; height: 40px; margin-bottom: 14px; border-radius: 50%; background: var(--accent); color: var(--on-accent); font: 700 18px var(--font-display); }
.steps p { margin: 0; color: var(--soft); font-size: 15px; }

/* testimoni */
.testi { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(280px, 1fr); gap: 18px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 8px; scrollbar-width: thin; }
.testi li { list-style: none; scroll-snap-align: start; padding: 26px; border-radius: var(--r); background: var(--bg); border: 1px solid var(--line); display: flex; flex-direction: column; }
.testi blockquote { flex: 1; margin: 0 0 18px; font-size: 16.5px; }
.testi blockquote::before { content: "\\201C"; display: block; height: 30px; font: 700 54px/1 var(--font-display); color: var(--accent); }
.testi .stars { color: #f5a524; letter-spacing: 2px; margin-bottom: 8px; }
.who b { display: block; } .who span { font-size: 13.5px; color: var(--soft); }

/* promo */
.promo { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px; padding: clamp(24px, 4vw, 40px); border-radius: calc(var(--r) + 6px); background: var(--accent); color: var(--on-accent); }
.promo .ico { font-size: 80px; --accent: var(--on-accent); color: var(--on-accent); }
.promo h2 { font-size: clamp(26px, 3.2vw, 40px); margin-bottom: 6px; }
.promo p { margin: 0; opacity: .9; }
.promo .btn { background: var(--on-accent); color: var(--accent); border-color: var(--on-accent); }

/* faq */
.faq { display: grid; gap: 12px; max-width: 820px; }
.faq details { border-radius: 14px; background: var(--surface); border: 1px solid var(--line); }
.faq summary { display: flex; justify-content: space-between; gap: 16px; padding: 18px 20px; font-weight: 600; cursor: pointer; list-style: none; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: "+"; font: 600 22px/1 var(--font-text); color: var(--accent); transition: transform .25s; }
.faq details[open] summary::after { transform: rotate(45deg); }
.faq details p { padding: 0 20px 18px; margin: 0; color: var(--soft); }

/* lokasi */
.loc { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; align-items: stretch; }
.map { position: relative; min-height: 300px; border-radius: var(--r); overflow: hidden; background: color-mix(in srgb, var(--accent) 10%, var(--surface)); border: 1px solid var(--line); }
.map svg.grid-map { position: absolute; inset: 0; width: 100%; height: 100%; }
.map .pin { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -100%); display: grid; justify-items: center; gap: 6px; }
.map .pin b { padding: 8px 14px; border-radius: 12px; background: var(--ink); color: var(--bg); font-size: 14px; white-space: nowrap; }
.map .pin i { width: 18px; height: 18px; border-radius: 50%; background: var(--accent); border: 4px solid var(--bg); box-shadow: 0 0 0 8px color-mix(in srgb, var(--accent) 30%, transparent); animation: pulse 2s ease-out infinite; }
@keyframes pulse { 50% { box-shadow: 0 0 0 14px color-mix(in srgb, var(--accent) 10%, transparent); } }
.map .btn { position: absolute; left: 16px; bottom: 16px; }
.info { padding: clamp(22px, 3vw, 32px); border-radius: var(--r); background: var(--surface); border: 1px solid var(--line); }
.info table { width: 100%; border-collapse: collapse; margin: 14px 0 18px; font-size: 15px; }
.info td { padding: 9px 0; border-bottom: 1px dashed var(--line); }
.info td:last-child { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
.info address { font-style: normal; color: var(--soft); }

/* cta + footer */
.cta { text-align: center; }
.cta h2 { max-width: 18ch; margin-inline: auto; }
.cta p { max-width: 50ch; margin: 0 auto; color: var(--soft); }
.cta .ctas { justify-content: center; }
footer { padding: 34px 0 110px; border-top: 1px solid var(--line); font-size: 14px; color: var(--soft); }
footer .wrap { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px 24px; }

/* keranjang + wa */
.cart { position: fixed; left: 50%; bottom: 16px; z-index: 60; display: flex; align-items: center; gap: 14px; width: min(100% - 24px, 560px); padding: 10px 10px 10px 20px; border-radius: 999px; background: var(--ink); color: var(--bg); box-shadow: 0 20px 50px -20px rgba(0,0,0,.6); transform: translate(-50%, 140%); visibility: hidden; transition: transform .4s cubic-bezier(.2,.8,.2,1), visibility 0s .4s; }
.cart.show { transform: translate(-50%, 0); visibility: visible; transition: transform .4s cubic-bezier(.2,.8,.2,1); }
.cart div { flex: 1; min-width: 0; line-height: 1.25; }
.cart b { display: block; font-size: 17px; font-variant-numeric: tabular-nums; }
.cart span { font-size: 13px; opacity: .75; }
.cart .btn { min-height: 46px; }
.cart .clear { width: 40px; height: 40px; border-radius: 50%; border: 0; background: transparent; color: inherit; font-size: 20px; cursor: pointer; opacity: .7; }
.fab { position: fixed; right: 18px; bottom: 18px; z-index: 55; display: grid; place-items: center; width: 58px; height: 58px; border-radius: 50%; background: #25d366; color: #fff; box-shadow: 0 14px 30px -12px rgba(0,0,0,.5); transition: transform .2s, opacity .3s; }
.fab:hover { transform: scale(1.08); }
.fab svg { width: 30px; height: 30px; fill: currentColor; }
body.has-cart .fab { opacity: 0; pointer-events: none; }

/* appears on scroll */
.js [data-rv] { opacity: 0; transform: translateY(26px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); transition-delay: var(--d, 0s); }
.js [data-rv].in { opacity: 1; transform: none; }

@media (max-width: 860px) {
  .nav ul, .nav .btn { display: none; }
  .menu-btn { display: block; }
  .nav.open ul { display: grid; position: absolute; left: 0; right: 0; top: 100%; padding: 10px 16px 16px; background: var(--bg); border-bottom: 1px solid var(--line); }
  .loc { grid-template-columns: 1fr; }
  .promo { grid-template-columns: 1fr; text-align: left; }
  .promo .ico { font-size: 56px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .art .fl, .ticker div, .map .pin i { animation: none; }
  .js [data-rv] { opacity: 1; transform: none; transition: none; }
  .cart { transition: none; }
}
`;

/* Hero & lists per layout. */
const LAYOUT_CSS: Record<Hero | List, string> = {
  split: `
.hero .wrap { display: grid; grid-template-columns: 1.05fr .95fr; align-items: center; gap: clamp(24px, 5vw, 70px); }
@media (max-width: 860px) { .hero .wrap { grid-template-columns: 1fr; } .art { width: min(78%, 340px); } }`,
  center: `
.hero { text-align: center; }
.hero .lead { margin-inline: auto; }
.hero .ctas, .hero .meta { justify-content: center; }
.hero h1 { max-width: 15ch; margin-inline: auto; }
.art { width: min(100%, 300px); margin-bottom: 10px; }
.art .big { inset: 10%; }`,
  poster: `
.hero h1 { font-size: clamp(54px, 11vw, 160px); line-height: .92; max-width: 11ch; }
.hero { isolation: isolate; }
.hero .wrap { position: relative; }
.hero .art { position: absolute; right: -4%; top: -6%; width: min(46vw, 520px); opacity: .95; z-index: -1; }
.hero .art .fl { display: none; }
.hero .lead { max-width: 38ch; }
@media (max-width: 860px) { .hero .art { position: relative; right: auto; top: auto; width: min(70%, 300px); margin: 20px 0 0 auto; } }`,
  board: `
.hero .board { display: grid; grid-template-columns: 1fr auto; gap: 30px; align-items: center; padding: clamp(28px, 5vw, 60px); border-radius: 20px; border: 10px solid var(--frame); box-shadow: inset 0 0 80px rgba(0,0,0,.45), 0 30px 60px -30px rgba(0,0,0,.6); background: var(--surface); }
.hero .art { width: min(32vw, 320px); }
.hero .art .big { background: transparent; box-shadow: none; inset: 0; }
.hero .art .fl { display: none; }
@media (max-width: 860px) { .hero .board { grid-template-columns: 1fr; } .hero .art { width: 60%; margin: 0 auto; } }`,
  ticket: `
.hero .ticket { position: relative; width: min(100%, 720px); margin-inline: auto; padding: clamp(28px, 5vw, 52px); background: var(--surface); border-radius: 6px; box-shadow: 0 30px 60px -36px rgba(0,0,0,.5); text-align: center; }
.hero .ticket::before, .hero .ticket::after { content: ""; position: absolute; left: 0; right: 0; height: 14px; background: radial-gradient(circle at 7px -2px, transparent 8px, var(--surface) 8.5px) 0 0 / 14px 14px repeat-x; }
.hero .ticket::before { top: -13px; transform: scaleY(-1); } .hero .ticket::after { bottom: -13px; }
.hero .ticket .lead { margin-inline: auto; }
.hero .ticket .ctas, .hero .ticket .meta { justify-content: center; }
.hero h1 { font-size: clamp(32px, 4.6vw, 58px); }
.hero .art { width: 160px; margin-bottom: 4px; }
.hero .art .tag { display: none; }
.hero .art .big { inset: 0; box-shadow: none; background: transparent; }
.hero .art .big .ico { font-size: 120px; }
.hero .art .fl { display: none; }
.hero .dash { border: 0; border-top: 2px dashed var(--line); margin: 22px 0; }`,
  cards: ``,
  list: `
.grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 6px 48px; }
.item { flex-direction: row; align-items: center; gap: 16px; padding: 16px 0; border: 0; border-bottom: 1px dashed var(--line); border-radius: 0; background: transparent; }
.item .pic { width: 64px; aspect-ratio: 1; margin: 0; flex: none; border-radius: 50%; }
.item .pic .ico { font-size: 38px; }
.item .txt { flex: 1; min-width: 0; }
.item h3 { display: flex; align-items: baseline; gap: 8px; margin: 0 0 4px; font-size: 19px; }
.item h3::after { content: ""; flex: 1; border-bottom: 2px dotted color-mix(in srgb, var(--ink) 35%, transparent); transform: translateY(-4px); }
.item p { margin: 0; font-size: 14px; }
.item .row { flex-direction: column; align-items: flex-end; margin: 0; }
.item .badge { position: static; display: inline-block; margin-bottom: 4px; }`,
  receipt: `
.grid { display: block; max-width: 760px; margin-inline: auto; padding: clamp(20px, 4vw, 40px); background: var(--surface); border-radius: 6px; box-shadow: 0 24px 50px -36px rgba(0,0,0,.5); font-family: var(--font-display); }
.item { flex-direction: row; align-items: center; gap: 14px; padding: 14px 0; border: 0; border-bottom: 2px dashed var(--line); border-radius: 0; background: transparent; }
.item .pic { width: 52px; aspect-ratio: 1; margin: 0; flex: none; border-radius: 8px; }
.item .pic .ico { font-size: 32px; }
.item .txt { flex: 1; min-width: 0; }
.item h3 { margin: 0 0 2px; font-size: 17px; text-transform: uppercase; letter-spacing: .02em; }
.item p { margin: 0; font-size: 13px; font-family: var(--font-text); }
.item .row { flex-direction: column; align-items: flex-end; margin: 0; }
.item .badge { position: static; display: inline-block; margin-bottom: 4px; }`,
  bento: `
.grid { grid-template-columns: repeat(4, 1fr); grid-auto-flow: dense; }
.item:nth-child(1) { grid-column: span 2; grid-row: span 2; }
.item:nth-child(1) .pic { aspect-ratio: auto; flex: 1; min-height: 240px; }
.item:nth-child(1) .pic .ico { font-size: 170px; }
.item:nth-child(4) { grid-column: span 2; }
.item:nth-child(4) .pic { aspect-ratio: 16 / 6; }
@media (max-width: 960px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .grid { grid-template-columns: 1fr; } .item:nth-child(n) { grid-column: auto; grid-row: auto; } }`,
  rows: `
.grid { display: block; counter-reset: it; border-top: 1px solid var(--line); }
.item { display: grid; grid-template-columns: 70px 90px 1fr auto; align-items: center; gap: 22px; padding: 22px 0; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; counter-increment: it; }
.item::before { content: counter(it, decimal-leading-zero); font: 600 30px/1 var(--font-display); color: var(--accent); }
.item .pic { width: 90px; aspect-ratio: 1; margin: 0; }
.item .pic .ico { font-size: 54px; }
.item h3 { font-size: clamp(20px, 2vw, 26px); margin-bottom: 4px; }
.item p { margin: 0; }
.item .row { flex-direction: column; align-items: flex-end; gap: 10px; margin: 0; }
.item .badge { position: static; display: inline-block; margin-bottom: 6px; }
@media (max-width: 700px) { .item { grid-template-columns: 64px 1fr; gap: 14px; } .item::before { display: none; } .item .pic { width: 64px; } .item .pic .ico { font-size: 40px; } .item .row { grid-column: 1 / -1; flex-direction: row; justify-content: space-between; } }`,
};

const INLINE_PRICE = `
.item .price { text-align: right; white-space: nowrap; }
.item .price small { display: block; margin-top: 2px; }`;

const SKIN_CSS: Record<Skin, string> = {
  pasar: `
:root { --r: 22px; }
.hero::before { content: ""; position: absolute; right: -10%; top: -20%; width: 60vw; height: 60vw; border-radius: 50%; background: color-mix(in srgb, var(--accent-2) 30%, transparent); z-index: -1; }
.hero { isolation: isolate; }
.art .big { background: var(--accent-2); }
.item { box-shadow: 0 14px 30px -24px rgba(0,0,0,.4); }`,
  papan: `
:root { --frame: #6b4a2b; --r: 12px; }
body { background: var(--bg); }
.hero .board h1, .hero .board .lead { color: var(--ink); }
.hero h1 { font-weight: 400; }
h2 { font-weight: 400; }
.alt { background: color-mix(in srgb, var(--surface) 70%, #000); }
.item .pic { background: transparent; border: 2px dashed color-mix(in srgb, var(--ink) 30%, transparent); }
.usp li, .testi li, .faq details, .info, .map { background: color-mix(in srgb, var(--surface) 80%, transparent); }
.btn { border-radius: 10px; }`,
  nota: `
:root { --r: 6px; }
body { background-image: radial-gradient(color-mix(in srgb, var(--ink) 7%, transparent) 1px, transparent 1px); background-size: 18px 18px; }
h1, h2, h3 { text-transform: uppercase; letter-spacing: .01em; }
.btn { border-radius: 4px; text-transform: uppercase; letter-spacing: .06em; font-size: 13.5px; }
.kick { font-family: var(--font-display); }
.usp li, .steps li, .testi li, .faq details, .info { border-radius: 4px; border-style: dashed; }
.price { font-family: var(--font-display); }`,
  majalah: `
:root { --r: 0px; }
h1, h2 { font-weight: 500; letter-spacing: -.035em; }
h1 em, h2 em { font-style: italic; color: var(--accent); }
.kick { color: var(--ink); border-top: 2px solid var(--ink); padding-top: 8px; letter-spacing: .2em; }
.btn { border-radius: 0; }
.usp { gap: 0; border-top: 1px solid var(--ink); }
.usp li { border: 0; border-right: 1px solid var(--line); border-radius: 0; background: transparent; }
.usp li:last-child { border-right: 0; }
.alt { background: var(--bg); border-block: 1px solid var(--ink); }
.testi li, .faq details, .info, .map { border-radius: 0; }
.promo { border-radius: 0; }`,
  bento: `
:root { --r: 26px; }
.hero .wrap > div:first-child { padding: clamp(24px, 4vw, 44px); border-radius: 32px; background: var(--surface); }
.art .big { border-radius: 36px; inset: 6%; background: var(--accent-2); }
.art .fl { border-radius: 22px; }
.usp li { background: var(--surface); }
section.alt { background: var(--bg); }
.testi li { background: var(--surface); }`,
  kontras: `
:root { --r: 0px; }
h1, h2, h3, .btn, .kick { text-transform: uppercase; }
h1, h2 { letter-spacing: -.04em; }
.btn { border-radius: 0; border: 3px solid var(--ink); box-shadow: 5px 5px 0 var(--ink); }
.btn:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 var(--ink); }
.btn.ghost { border-color: var(--ink); }
.item, .usp li, .testi li, .faq details, .info, .map, .steps li { border: 3px solid var(--ink); box-shadow: 6px 6px 0 var(--ink); border-radius: 0; }
.item .pic { border-radius: 0; border: 3px solid var(--ink); }
.art .big { border-radius: 0; border: 4px solid var(--ink); box-shadow: 12px 12px 0 var(--ink); background: var(--accent-2); }
.art .fl { border-radius: 0; border: 3px solid var(--ink); }
.promo { border-radius: 0; border: 3px solid var(--ink); box-shadow: 8px 8px 0 var(--ink); }
.nav { border-bottom: 3px solid var(--ink); }`,
  pastel: `
:root { --r: 28px; }
.hero::before, .hero::after { content: ""; position: absolute; z-index: -1; border-radius: 50%; filter: blur(2px); }
.hero { isolation: isolate; }
.hero::before { width: 420px; height: 420px; left: -120px; top: -80px; background: color-mix(in srgb, var(--accent) 22%, transparent); }
.hero::after { width: 360px; height: 360px; right: -100px; bottom: -120px; background: color-mix(in srgb, var(--accent-2) 30%, transparent); }
.art .big { background: color-mix(in srgb, var(--accent-2) 40%, var(--surface)); }
.item { border: 0; box-shadow: 0 18px 40px -28px rgba(60,40,90,.35); }
.usp li { border: 0; background: var(--surface); }`,
  malam: `
:root { --r: 4px; }
h1, h2 { font-weight: 500; }
.kick { color: var(--accent); letter-spacing: .3em; }
.hero h1 { background: linear-gradient(180deg, var(--ink), color-mix(in srgb, var(--accent) 70%, var(--ink))); -webkit-background-clip: text; background-clip: text; color: transparent; }
.art .big { background: radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--accent) 22%, var(--surface)), var(--surface)); border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent); }
.btn { border-radius: 2px; letter-spacing: .08em; text-transform: uppercase; font-size: 13px; }
.item .pic { background: color-mix(in srgb, var(--accent) 8%, var(--surface)); border: 1px solid var(--line); }`,
  alam: `
:root { --r: 24px; }
.art .big { border-radius: 58% 42% 51% 49% / 46% 56% 44% 54%; background: var(--accent-2); animation: blob 12s ease-in-out infinite; }
@keyframes blob { 50% { border-radius: 42% 58% 44% 56% / 56% 42% 58% 44%; } }
section.alt { position: relative; }
section.alt::before { content: ""; position: absolute; left: 0; right: 0; top: -28px; height: 30px; background: var(--surface); -webkit-mask: radial-gradient(30px 30px at 50% 100%, #000 98%, transparent) 0 0 / 60px 30px repeat-x; mask: radial-gradient(30px 30px at 50% 100%, #000 98%, transparent) 0 0 / 60px 30px repeat-x; }
.item .pic { border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%; }
@media (prefers-reduced-motion: reduce) { .art .big { animation: none; } }`,
  kios: `
:root { --r: 16px; }
.nav { border-bottom: 0; }
.nav::after { content: ""; position: absolute; left: 0; right: 0; top: 100%; height: 22px; background: repeating-linear-gradient(90deg, var(--accent) 0 40px, var(--surface) 40px 80px); -webkit-mask: radial-gradient(20px 22px at 20px 0, #000 98%, transparent) 0 0 / 40px 22px repeat-x; mask: radial-gradient(20px 22px at 20px 0, #000 98%, transparent) 0 0 / 40px 22px repeat-x; }
.hero { padding-top: clamp(64px, 10vw, 120px); }
.art .big { background: var(--accent-2); border: 6px solid var(--surface); }
h1 { text-shadow: 3px 3px 0 color-mix(in srgb, var(--accent-2) 70%, transparent); }`,
};

/* ------------------------------ HTML ------------------------------ */

export const WA_SVG = `<svg class="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3z"/></svg>`;

function waHref(s: LandingSpec, text?: string) {
  return `https://wa.me/${s.wa}?text=${encodeURIComponent(text ?? `Halo ${s.name}, saya mau tanya.`)}`;
}

function heroHtml(s: LandingSpec, L: (typeof LAYOUT)[Skin]): string {
  const side = [s.products[1]?.[4] ?? "star", s.usp[0]?.[0] ?? "sparkle", s.products[2]?.[4] ?? "leaf"];
  const art = `<div class="art" aria-hidden="true"><div class="big">${icon(s.icon)}</div>${side.map((x) => `<div class="fl">${icon(x)}</div>`).join("")}<div class="tag"${ot("heroLabel", "Hero: label di ilustrasi")}>${esc(s.city)}</div></div>`;
  const words = s.tagline;
  const text = `<p class="kick"${ot("heroKicker", "Hero: label kecil")}>${esc(s.type)}</p>
<h1${ot("heroJudul", "Hero: judul")}>${esc(words)}</h1>
<p class="lead"${ot("heroTeks", "Hero: paragraf", true)}>${esc(s.intro)}</p>
<div class="ctas"><a class="btn" href="#produk"${ot("heroTombol1", "Hero: tombol 1")}>${esc(s.menuTitle.split(" ")[0] === "Menu" ? "Lihat menu" : "Lihat " + s.menuTitle.toLowerCase())}</a><a class="btn ghost" href="${esc(waHref(s))}" target="_blank" rel="noopener" data-wa>${WA_SVG}<span${ot("heroTombol2", "Hero: tombol WhatsApp")}>Chat WhatsApp</span></a></div>
<div class="meta"><span class="status" data-status><i></i><span>Jam buka</span></span><span><b${ot("heroInfo1", "Hero: info 1")}>${esc(s.stats[0][0])}</b> <span${ot("heroInfo1Label", "Hero: label info 1")}>${esc(s.stats[0][1])}</span></span></div>`;
  if (L.hero === "split") return `<section class="hero" id="beranda"><div class="wrap"><div data-rv>${text}</div>${art}</div></section>`;
  if (L.hero === "center") return `<section class="hero" id="beranda"><div class="wrap" data-rv>${art}${text}</div></section>`;
  if (L.hero === "poster") return `<section class="hero" id="beranda"><div class="wrap">${art}<div data-rv>${text}</div></div></section>`;
  if (L.hero === "board") return `<section class="hero" id="beranda"><div class="wrap"><div class="board" data-rv><div>${text}</div>${art}</div></div></section>`;
  return `<section class="hero" id="beranda"><div class="wrap"><div class="ticket" data-rv>${art}${text.replace('<div class="meta">', '<hr class="dash"><div class="meta">')}</div></div></section>`;
}

function productHtml(s: LandingSpec, L: (typeof LAYOUT)[Skin]): string {
  const inline = L.list !== "cards" && L.list !== "bento";
  return s.products
    .map(([name, desc, price, unit, ic, tag], i) => {
      const k = `p${i + 1}`;
      const badge = tag ? `<span class="badge"${ot(`${k}Label`, `Produk ${i + 1}: label`)}>${esc(tag)}</span>` : "";
      const txt = `<h3${ot(`${k}Nama`, `Produk ${i + 1}: nama`)}>${esc(name)}</h3><p${ot(`${k}Desk`, `Produk ${i + 1}: deskripsi`, true)}>${esc(desc)}</p>`;
      const ask = price <= 0 || s.cart === false;
      const row = `<div class="row"><span class="price"><span data-price${ot(`${k}Harga`, `Produk ${i + 1}: harga`)}>${price <= 0 ? esc(unit.charAt(0).toUpperCase() + unit.slice(1)) : rupiah(price)}</span>${price <= 0 ? "" : ` <small${ot(`${k}Satuan`, `Produk ${i + 1}: satuan`)}>${esc(unit)}</small>`}</span>${ask ? `<a class="btn ghost ask" href="${esc(waHref(s, `Halo ${s.name}, saya mau tanya ${name}.`))}" target="_blank" rel="noopener" data-wa data-wa-text="Halo, saya mau tanya ${esc(name)}.">${s.cart === false ? "Tanya" : "Tanya"}</a>` : ""}<span class="qty"${ask ? " hidden" : ""}><button type="button" class="minus" aria-label="Kurangi ${esc(name)}">&minus;</button><output aria-live="polite">0</output><button type="button" class="plus" aria-label="Tambah ${esc(name)}">+</button></span></div>`;
      return inline
        ? `<li class="item" data-rv style="--d:${(i % 3) * 0.06}s"><div class="pic">${icon(ic)}</div><div class="txt">${badge}${txt}</div>${row}</li>`
        : `<li class="item" data-rv style="--d:${(i % 3) * 0.08}s">${badge}<div class="pic">${icon(ic)}</div>${txt}${row}</li>`;
    })
    .join("\n");
}

export const MAP_SVG = `<svg class="grid-map" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" opacity=".16" stroke-width="10"><path d="M-20 80 420 60M-20 210 420 250M90 -20 120 320M290 -20 260 320"/></g><g fill="none" stroke="currentColor" opacity=".08" stroke-width="4"><path d="M-20 140 420 150M190 -20 200 320M-20 20 160 320M420 30 220 320"/></g><g fill="currentColor" opacity=".07"><rect x="140" y="90" width="40" height="40" rx="6"/><rect x="210" y="170" width="38" height="30" rx="6"/><rect x="20" y="230" width="50" height="40" rx="6"/><rect x="310" y="90" width="60" height="40" rx="6"/></g></svg>`;

export function buildLanding(s: LandingSpec): string {
  const L = LAYOUT[s.skin];
  const [bg, surface, ink, soft, accent, accent2] = s.colors;
  const lum = (h: string) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  const on = (h: string) => (lum(h) > 0.62 ? "#161616" : "#ffffff");
  const vars: ThemeVar[] = [
    { name: "--bg", value: bg, label: "Latar halaman" },
    { name: "--surface", value: surface, label: "Latar kartu & bagian" },
    { name: "--ink", value: ink, label: "Teks utama" },
    { name: "--soft", value: soft, label: "Teks sekunder" },
    { name: "--accent", value: accent, label: "Warna utama (tombol, harga)" },
    { name: "--accent-2", value: accent2, label: "Warna kedua (label, ilustrasi)" },
    { name: "--on-accent", value: on(accent), label: "Teks di atas warna utama" },
    { name: "--on-accent-2", value: on(accent2), label: "Teks di atas warna kedua" },
    { name: "--line", value: `color-mix(in srgb, ${ink} 14%, transparent)`, label: "Garis" },
    { name: "--fd", value: `"${s.font[0]}"`, label: "Font judul" },
    { name: "--ft", value: `"${s.font[1]}"`, label: "Font teks" },
  ];
  const config = {
    whatsapp: s.wa,
    zonaWaktu: 7,
    jamBuka: s.open.map(([d, a, b]) => ({ hari: d.join(","), buka: a, tutup: b })),
    pesanPembuka: `Halo ${s.name}, saya mau pesan:`,
    pesanPenutup: "Nama:\nAlamat / ambil di tempat:",
    keranjang: s.cart !== false,
  };
  const nav = [["#keunggulan", "Keunggulan"], ["#produk", s.menuTitle.split(" ")[0] === "Menu" ? "Menu" : s.menuTitle.split(" ")[0]], ["#testimoni", "Ulasan"], ["#faq", "FAQ"], ["#lokasi", "Lokasi"]];
  const ticker = L.ticker
    ? `<div class="ticker" aria-hidden="true"><div>${[...s.products, ...s.products].map((p) => `<span>${icon(p[4])}${esc(p[0])}</span>`).join("")}</div></div>`
    : "";
  const body = `
<a class="skip" href="#produk">Lewati ke produk</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="#beranda">${icon(s.icon)}<span${ot("nama", "Nama usaha")}>${esc(s.name)}</span></a>
  <nav aria-label="Navigasi utama"><ul>${nav.map(([h, t], i) => `<li><a href="${h}"${ot(`menu${i + 1}`, `Menu ${i + 1}`)}>${esc(t)}</a></li>`).join("")}</ul></nav>
  <a class="btn" href="${esc(waHref(s))}" target="_blank" rel="noopener" data-wa>${WA_SVG}<span${ot("navTombol", "Tombol di navigasi")}>Pesan</span></a>
  <button class="menu-btn" type="button" aria-label="Buka menu" aria-expanded="false"><span></span></button>
</div></header>
<main>
${heroHtml(s, L)}
${ticker}
<section class="s alt" id="keunggulan"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("uspKicker", "Keunggulan: label kecil")}>Kenapa ${esc(s.name)}</p><h2${ot("uspJudul", "Keunggulan: judul")}>${esc(s.usp.length > 3 ? "Yang bikin pelanggan balik lagi" : "Alasan pelanggan memilih kami")}</h2></div></div>
  <ul class="usp">${s.usp.map(([ic, t, d], i) => `<li data-rv style="--d:${i * 0.08}s">${icon(ic)}<h3${ot(`usp${i + 1}`, `Keunggulan ${i + 1}: judul`)}>${esc(t)}</h3><p${ot(`usp${i + 1}Teks`, `Keunggulan ${i + 1}: isi`, true)}>${esc(d)}</p></li>`).join("")}</ul>
  <div class="stats" data-rv>${s.stats.map(([v, l], i) => `<div><b${ot(`angka${i + 1}`, `Angka ${i + 1}`)}>${esc(v)}</b><span${ot(`angka${i + 1}Label`, `Label angka ${i + 1}`)}>${esc(l)}</span></div>`).join("")}</div>
</div></section>
<section class="s" id="produk"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("produkKicker", "Produk: label kecil")}>${s.cart === false ? "Layanan &amp; biaya" : "Harga jelas, tanpa biaya tersembunyi"}</p><h2${ot("produkJudul", "Produk: judul")}>${esc(s.menuTitle)}</h2></div><p${ot("produkTeks", "Produk: keterangan", true)}>${s.cart === false ? "Biaya di bawah adalah harga mulai. Tekan Tanya untuk konsultasi gratis lewat WhatsApp." : "Tekan + untuk memilih. Pesanan dikirim lewat WhatsApp, jadi kamu bisa tanya dulu sebelum bayar."}</p></div>
  <ul class="grid">
${productHtml(s, L)}
  </ul>
  <p class="note"${ot("produkCatatan", "Produk: catatan harga")}>${s.cart === false ? "Biaya akhir tergantung kebutuhan. Kami jelaskan rinciannya sebelum pekerjaan dimulai." : "Harga dapat berubah sewaktu-waktu. Konfirmasi akhir lewat WhatsApp."}</p>
</div></section>
<section class="s" id="promo"><div class="wrap"><div class="promo" data-rv>${icon(s.icon)}<div><h2${ot("promoJudul", "Promo: judul")}>${esc(s.promo[0])}</h2><p${ot("promoTeks", "Promo: isi", true)}>${esc(s.promo[1])}</p></div><a class="btn" href="${esc(waHref(s, `Halo ${s.name}, saya mau ambil promo: ${s.promo[0]}`))}" target="_blank" rel="noopener" data-wa data-wa-text="Halo, saya mau ambil promo: ${esc(s.promo[0])}"><span${ot("promoTombol", "Promo: tombol")}>Ambil promo</span></a></div></div></section>
<section class="s alt" id="cara"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("caraKicker", "Cara pesan: label kecil")}>Gampang</p><h2${ot("caraJudul", "Cara pesan: judul")}>Cara pesan</h2></div></div>
  <ol class="steps">${s.steps.map(([t, d], i) => `<li data-rv style="--d:${i * 0.1}s"><h3${ot(`langkah${i + 1}`, `Langkah ${i + 1}: judul`)}>${esc(t)}</h3><p${ot(`langkah${i + 1}Teks`, `Langkah ${i + 1}: isi`, true)}>${esc(d)}</p></li>`).join("")}</ol>
</div></section>
<section class="s" id="testimoni"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("ulasanKicker", "Ulasan: label kecil")}>Kata pelanggan</p><h2${ot("ulasanJudul", "Ulasan: judul")}>Sudah dicoba, sudah dibuktikan</h2></div><p class="soft">Geser untuk melihat ulasan lain.</p></div>
  <ul class="testi" tabindex="0" aria-label="Ulasan pelanggan">${s.testi.map(([q, n, r], i) => `<li><div class="stars" aria-label="Bintang 5">&#9733;&#9733;&#9733;&#9733;&#9733;</div><blockquote${ot(`ulasan${i + 1}`, `Ulasan ${i + 1}: isi`, true)}>${esc(q)}</blockquote><div class="who"><b${ot(`ulasan${i + 1}Nama`, `Ulasan ${i + 1}: nama`)}>${esc(n)}</b><span${ot(`ulasan${i + 1}Ket`, `Ulasan ${i + 1}: keterangan`)}>${esc(r)}</span></div></li>`).join("")}</ul>
</div></section>
<section class="s alt" id="faq"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("faqKicker", "FAQ: label kecil")}>Tanya jawab</p><h2${ot("faqJudul", "FAQ: judul")}>Sering ditanyakan</h2></div></div>
  <div class="faq">${s.faq.map(([q, a], i) => `<details data-rv${i === 0 ? " open" : ""}><summary${ot(`faq${i + 1}`, `FAQ ${i + 1}: pertanyaan`)}>${esc(q)}</summary><p${ot(`faq${i + 1}Jawab`, `FAQ ${i + 1}: jawaban`, true)}>${esc(a)}</p></details>`).join("")}</div>
</div></section>
<section class="s" id="lokasi"><div class="wrap">
  <div class="head" data-rv><div><p class="kick"${ot("lokasiKicker", "Lokasi: label kecil")}>Mampir yuk</p><h2${ot("lokasiJudul", "Lokasi: judul")}>Lokasi &amp; jam buka</h2></div></div>
  <div class="loc">
    <div class="map" data-rv>${MAP_SVG}<div class="pin"><b${ot("nama", "Nama usaha")}>${esc(s.name)}</b><i></i></div><a class="btn" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${s.name} ${s.address}`)}" target="_blank" rel="noopener"${ot("petaTombol", "Lokasi: tombol peta")}>Buka Google Maps</a></div>
    <div class="info" data-rv style="--d:.1s">
      <span class="status" data-status><i></i><span>Jam buka</span></span>
      <table><tbody>${s.hours.map(([d, h], i) => `<tr><td${ot(`jam${i + 1}Hari`, `Jam buka ${i + 1}: hari`)}>${esc(d)}</td><td${ot(`jam${i + 1}`, `Jam buka ${i + 1}: jam`)}>${esc(h)}</td></tr>`).join("")}</tbody></table>
      <address${ot("alamat", "Alamat", true)}>${esc(s.address)}</address>
      <p class="soft" style="margin-top:10px">Instagram <b${ot("instagram", "Instagram")}>${esc(s.ig)}</b></p>
    </div>
  </div>
</div></section>
<section class="s alt cta" id="kontak"><div class="wrap" data-rv>
  <h2${ot("ctaJudul", "Ajakan: judul")}>${esc(s.menuTitle.startsWith("Menu") ? "Lapar? Langsung chat saja." : "Ada yang bisa kami bantu? Langsung chat saja.")}</h2>
  <p${ot("ctaTeks", "Ajakan: isi", true)}>Balasan cepat di jam buka. Di luar jam buka, pesanan dicatat dan diproses keesokan harinya.</p>
  <div class="ctas"><a class="btn" href="${esc(waHref(s))}" target="_blank" rel="noopener" data-wa>${WA_SVG}<span${ot("ctaTombol", "Ajakan: tombol")}>Chat WhatsApp</span></a><a class="btn ghost" href="#produk"${ot("ctaTombol2", "Ajakan: tombol 2")}>Pilih produk</a></div>
</div></section>
</main>
<footer><div class="wrap"><span>&copy; <span data-year>2026</span> <span${ot("nama", "Nama usaha")}>${esc(s.name)}</span>, <span${ot("kota", "Kota")}>${esc(s.city)}</span></span><span${ot("catatanKaki", "Catatan kaki")}>Usaha lokal, dibuat dengan sepenuh hati.</span></div></footer>
${s.cart === false ? "" : `<div class="cart" role="region" aria-label="Keranjang" aria-live="polite"><button class="clear" type="button" aria-label="Kosongkan keranjang">&times;</button><div><b data-total>Rp0</b><span data-count>0 item</span></div><a class="btn" href="${esc(waHref(s))}" target="_blank" rel="noopener" data-order>${WA_SVG}Pesan via WA</a></div>`}
<a class="fab" href="${esc(waHref(s))}" target="_blank" rel="noopener" data-wa aria-label="Chat WhatsApp">${WA_SVG.replace('class="wa-ico" ', "")}</a>
<script>
/* ==== BUSINESS DATA: edit here (or in the OneWebDev editor) ==== */
const CONFIG = ${dataBlock("CONFIG", "Pengaturan usaha (WhatsApp, jam buka, pesan)", config)};
/* ================================================================ */
${SCRIPT}
</script>`;
  return doc({
    title: `${s.name} | ${s.type}`,
    description: `${s.name}, ${s.type.toLowerCase()} di ${s.city}. ${s.tagline}`,
    theme: bg,
    head: `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n${fontLink(fontHref(s.font))}\n<script>document.documentElement.classList.add("js")</script>`,
    vars,
    css: BASE + ICON_CSS + LAYOUT_CSS[L.hero] + LAYOUT_CSS[L.list] + (L.list === "cards" || L.list === "bento" ? "" : INLINE_PRICE) + SKIN_CSS[s.skin],
    body,
  });
}

const SCRIPT = String.raw`(function () {
  var root = document.documentElement, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nama = (document.querySelector(".logo span") || {}).textContent || "";
  var wa = String(CONFIG.whatsapp || "").replace(/\D/g, "");
  function waLink(text) { return "https://wa.me/" + wa + "?text=" + encodeURIComponent(text); }
  /* All WhatsApp links follow CONFIG.whatsapp. */
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = waLink(a.getAttribute("data-wa-text") || ("Halo " + nama.trim() + ", saya mau tanya.")); });
  var y = document.querySelector("[data-year]"); if (y) y.textContent = new Date().getFullYear();

  /* Mobile menu. */
  var nav = document.querySelector(".nav"), mb = document.querySelector(".menu-btn");
  if (mb) { mb.addEventListener("click", function () { var o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); }); nav.querySelectorAll("ul a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); }); }); }

  /* Open-now status (business time = UTC + zonaWaktu). */
  function mins(s) { var p = String(s).split(/[.:]/); return (+p[0] || 0) * 60 + (+p[1] || 0); }
  function status() {
    var now = new Date(Date.now() + (Number(CONFIG.zonaWaktu) || 7) * 3600e3), d = now.getUTCDay(), m = now.getUTCHours() * 60 + now.getUTCMinutes();
    var on = (CONFIG.jamBuka || []).some(function (j) { var days = String(j.hari).split(",").map(Number), a = mins(j.buka), b = mins(j.tutup); return days.indexOf(d) >= 0 && (b > a ? m >= a && m < b : m >= a || m < b); });
    document.querySelectorAll("[data-status]").forEach(function (el) { el.classList.toggle("on", on); el.classList.toggle("off", !on); el.lastElementChild.textContent = on ? "Buka sekarang" : "Sedang tutup"; });
  }
  status(); setInterval(status, 60000);

  /* Cart: prices are read from the price text (updates when the text is edited). */
  var items = Array.prototype.slice.call(document.querySelectorAll(".item")), cart = document.querySelector(".cart");
  var price = function (el) { return parseInt((el.querySelector("[data-price]").textContent || "").replace(/\D/g, ""), 10) || 0; };
  var rp = function (v) { return "Rp" + v.toLocaleString("id-ID").replace(/,/g, "."); };
  var qty = items.map(function () { return 0; });
  function render() {
    var n = 0, t = 0, lines = [];
    items.forEach(function (el, i) {
      var q = qty[i], box = el.querySelector(".qty");
      if (box.hidden) return;
      box.classList.toggle("has", q > 0); box.querySelector("output").textContent = q;
      if (q > 0) { n += q; t += q * price(el); lines.push("- " + q + "x " + el.querySelector("h3").textContent.trim() + " (" + rp(q * price(el)) + ")"); }
    });
    if (!cart) return;
    cart.querySelector("[data-total]").textContent = rp(t);
    cart.querySelector("[data-count]").textContent = n + " item";
    cart.querySelector("[data-order]").href = waLink([CONFIG.pesanPembuka, lines.join("\n"), "Total: " + rp(t), "", CONFIG.pesanPenutup].join("\n"));
    var show = n > 0 && CONFIG.keranjang !== false;
    cart.classList.toggle("show", show); document.body.classList.toggle("has-cart", show);
  }
  items.forEach(function (el, i) {
    if (!el.querySelector(".qty") || el.querySelector(".qty").hidden) return;
    el.querySelector(".plus").addEventListener("click", function () { qty[i]++; render(); });
    el.querySelector(".minus").addEventListener("click", function () { qty[i] = Math.max(0, qty[i] - 1); render(); });
  });
  if (cart) cart.querySelector(".clear").addEventListener("click", function () { qty = qty.map(function () { return 0; }); render(); });
  if (CONFIG.keranjang === false) document.querySelectorAll(".qty").forEach(function (q) { q.style.display = "none"; });
  render();

  /* Appears on scroll. */
  var rv = document.querySelectorAll("[data-rv]");
  if (window.OWD_THUMB || reduce || !("IntersectionObserver" in window)) rv.forEach(function (el) { el.classList.add("in"); });
  else { var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" }); rv.forEach(function (el) { io.observe(el); }); }

  /* The hero illustration follows the cursor slightly. */
  var big = document.querySelector(".art .big");
  if (big && !reduce && matchMedia("(pointer: fine)").matches) addEventListener("pointermove", function (e) { var x = e.clientX / innerWidth - .5, yy = e.clientY / innerHeight - .5; big.style.transform = "translate(" + (x * 18).toFixed(1) + "px," + (yy * 14).toFixed(1) + "px) rotate(" + (x * 6).toFixed(1) + "deg)"; }, { passive: true });
})();`;
