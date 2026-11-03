/* ================================================================== */
/* Aset gambar template (SVG buatan sendiri, tanpa lisensi pihak ketiga) */
/*                                                                    */
/* Di aplikasi, gambar dipakai sebagai data URI agar pratinjau & Page    */
/* Maker bekerja tanpa server. Saat diunduh, setiap data URI diubah      */
/* menjadi berkas assets/img/<nama>.svg (lihat exportTemplate.ts).       */
/* SVG hanya berisi karakter ASCII.                                      */
/* ================================================================== */

import { EXTRA_SOURCES } from "./assetsExtra";
import { V2A_SOURCES } from "./templates/v2/setA/assets";
import { V2B_SOURCES } from "./templates/v2/setB/assets";
import { V3C_SOURCES } from "./templates/v3/setC/assets";
import { V3D_SOURCES } from "./templates/v3/setD/assets";
import { V4E_SOURCES } from "./templates/v4/setE/assets";
import { V5F_SOURCES } from "./templates/v5/setF/assets";
import { V6G_SOURCES } from "./templates/v6/setG/assets";
import { V7H_SOURCES } from "./templates/v7/setH/assets";
import { V9I_SOURCES } from "./templates/v9/setI/assets";
import { V10J_SOURCES } from "./templates/v10/setJ/assets";

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const grad = (id: string, a: string, b: string, angle = "0 0 1 1") => {
  const [x1, y1, x2, y2] = angle.split(" ");
  return `<defs><linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
};

/* ------------------------------ ilustrasi --------------------------- */

function heroOffice(): string {
  return svg(
    800,
    600,
    grad("g", "#dbeafe", "#eff6ff") +
      `<rect width="800" height="600" fill="url(#g)"/>` +
      `<circle cx="650" cy="120" r="70" fill="#bfdbfe"/>` +
      `<rect x="110" y="140" width="580" height="360" rx="22" fill="#ffffff" stroke="#bfdbfe" stroke-width="3"/>` +
      `<rect x="110" y="140" width="580" height="54" rx="22" fill="#1d4ed8"/><rect x="110" y="170" width="580" height="24" fill="#1d4ed8"/>` +
      `<circle cx="145" cy="167" r="8" fill="#93c5fd"/><circle cx="172" cy="167" r="8" fill="#93c5fd"/><circle cx="199" cy="167" r="8" fill="#93c5fd"/>` +
      `<rect x="150" y="230" width="230" height="20" rx="10" fill="#1e3a8a"/><rect x="150" y="266" width="300" height="12" rx="6" fill="#cbd5e1"/>` +
      `<rect x="150" y="290" width="260" height="12" rx="6" fill="#cbd5e1"/><rect x="150" y="330" width="120" height="36" rx="18" fill="#2563eb"/>` +
      `<rect x="150" y="400" width="150" height="70" rx="12" fill="#eff6ff"/><rect x="320" y="400" width="150" height="70" rx="12" fill="#eff6ff"/>` +
      `<rect x="490" y="230" width="160" height="240" rx="14" fill="#dbeafe"/>` +
      `<path d="M510 430 L550 380 L585 405 L630 330" stroke="#1d4ed8" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  );
}

function heroAgency(): string {
  return svg(
    800,
    640,
    grad("g", "#4f46e5", "#06b6d4") +
      `<rect width="800" height="640" rx="36" fill="url(#g)"/>` +
      `<circle cx="120" cy="110" r="90" fill="#ffffff" opacity="0.12"/><circle cx="700" cy="560" r="140" fill="#ffffff" opacity="0.1"/>` +
      `<rect x="150" y="120" width="500" height="330" rx="20" fill="#0f172a" opacity="0.92"/>` +
      `<rect x="180" y="160" width="180" height="16" rx="8" fill="#818cf8"/><rect x="180" y="196" width="300" height="10" rx="5" fill="#334155"/>` +
      `<rect x="180" y="218" width="260" height="10" rx="5" fill="#334155"/><rect x="180" y="260" width="130" height="140" rx="14" fill="#1e293b"/>` +
      `<rect x="325" y="260" width="130" height="140" rx="14" fill="#1e293b"/><rect x="470" y="260" width="150" height="140" rx="14" fill="#22d3ee" opacity="0.85"/>` +
      `<rect x="200" y="350" width="90" height="10" rx="5" fill="#6366f1"/><rect x="345" y="350" width="70" height="10" rx="5" fill="#a5b4fc"/>` +
      `<rect x="250" y="470" width="300" height="90" rx="18" fill="#ffffff"/><circle cx="295" cy="515" r="22" fill="#e0e7ff"/>` +
      `<rect x="330" y="500" width="160" height="12" rx="6" fill="#4f46e5"/><rect x="330" y="522" width="110" height="10" rx="5" fill="#cbd5e1"/>`,
  );
}

function workspace(): string {
  return svg(
    800,
    560,
    `<rect width="800" height="560" fill="#f1f5f9"/><rect x="0" y="400" width="800" height="160" fill="#e2e8f0"/>` +
      `<rect x="120" y="360" width="560" height="22" rx="6" fill="#94a3b8"/><rect x="150" y="382" width="16" height="140" fill="#94a3b8"/><rect x="634" y="382" width="16" height="140" fill="#94a3b8"/>` +
      `<rect x="250" y="170" width="300" height="180" rx="12" fill="#1e293b"/><rect x="266" y="186" width="268" height="148" rx="6" fill="#3b82f6"/>` +
      `<rect x="380" y="350" width="40" height="12" fill="#1e293b"/><rect x="290" y="210" width="120" height="12" rx="6" fill="#dbeafe"/><rect x="290" y="236" width="200" height="8" rx="4" fill="#93c5fd"/>` +
      `<circle cx="600" cy="320" r="34" fill="#22c55e"/><rect x="590" y="300" width="20" height="60" fill="#15803d"/><rect x="560" y="330" width="80" height="30" rx="6" fill="#b45309"/>` +
      `<rect x="170" y="310" width="60" height="50" rx="8" fill="#ffffff"/><rect x="230" y="322" width="14" height="22" rx="7" fill="none" stroke="#ffffff" stroke-width="5"/>`,
  );
}

function avatar(bg: string, skin: string, hair: string): string {
  return svg(
    400,
    400,
    `<rect width="400" height="400" fill="${bg}"/><circle cx="200" cy="170" r="78" fill="${skin}"/>` +
      `<path d="M122 160 Q130 80 200 80 Q270 80 278 160 Q250 120 200 122 Q150 120 122 160Z" fill="${hair}"/>` +
      `<path d="M70 400 Q80 280 200 270 Q320 280 330 400Z" fill="#ffffff" opacity="0.9"/>`,
  );
}

function storefront(): string {
  return svg(
    900,
    600,
    grad("g", "#fef3c7", "#fde68a") +
      `<rect width="900" height="600" fill="url(#g)"/><rect x="140" y="170" width="620" height="360" rx="10" fill="#7c2d12"/>` +
      `<path d="M120 170 H780 L740 100 H160Z" fill="#b45309"/>` +
      `<path d="M160 100 h76 l-16 70 h-76z M312 100 h76 l-8 70 h-76z M464 100 h76 l0 70 h-76z M616 100 h76 l8 70 h-76z" fill="#fef3c7" opacity="0.8"/>` +
      `<rect x="190" y="230" width="300" height="220" rx="8" fill="#fde68a"/><rect x="530" y="230" width="180" height="300" rx="8" fill="#451a03"/>` +
      `<circle cx="690" cy="380" r="8" fill="#fbbf24"/><rect x="220" y="260" width="110" height="10" rx="5" fill="#92400e"/>` +
      `<rect x="220" y="380" width="60" height="60" rx="8" fill="#ffffff"/><rect x="300" y="390" width="60" height="50" rx="8" fill="#ffffff"/><rect x="380" y="370" width="70" height="70" rx="8" fill="#ffffff"/>`,
  );
}

function boutiqueBanner(): string {
  return svg(
    1200,
    560,
    grad("g", "#ccfbf1", "#f0fdfa", "0 0 1 0") +
      `<rect width="1200" height="560" fill="url(#g)"/><circle cx="930" cy="280" r="220" fill="#99f6e4"/>` +
      `<path d="M860 150 l70 -30 l70 30 l50 60 l-40 30 l-25 -20 v200 h-110 v-200 l-25 20 l-40 -30z" fill="#0f766e"/>` +
      `<path d="M1010 230 q40 0 60 40 l-20 160 h-90 l10 -150z" fill="#f59e0b" opacity="0.9"/>` +
      `<rect x="760" y="420" width="120" height="70" rx="14" fill="#134e4a"/><path d="M790 420 q30 -50 60 0" stroke="#134e4a" stroke-width="8" fill="none"/>`,
  );
}

/* ------------------------------- produk ----------------------------- */

type ProductShape = "bag" | "mug" | "beans" | "dripper" | "tumbler" | "cookie" | "shirt" | "dress" | "sneaker" | "tote" | "watch" | "hat";

const SHAPES: Record<ProductShape, (c: string, d: string) => string> = {
  bag: (c, d) =>
    `<path d="M200 140 h200 l30 330 h-260z" fill="${c}"/><rect x="200" y="140" width="200" height="40" fill="${d}"/>` +
    `<rect x="240" y="260" width="120" height="90" rx="10" fill="#ffffff" opacity="0.9"/><circle cx="300" cy="305" r="22" fill="${d}"/>`,
  mug: (c, d) =>
    `<rect x="190" y="200" width="190" height="220" rx="24" fill="${c}"/><path d="M380 250 q70 0 70 60 q0 60 -70 60" stroke="${c}" stroke-width="26" fill="none"/>` +
    `<ellipse cx="285" cy="205" rx="95" ry="18" fill="${d}"/><path d="M250 150 q20 -30 0 -60 M300 150 q20 -30 0 -60" stroke="#94a3b8" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  beans: (c, d) =>
    [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const x = 200 + (i % 3) * 100;
        const y = 220 + Math.floor(i / 3) * 120;
        return `<ellipse cx="${x}" cy="${y}" rx="44" ry="60" fill="${c}" transform="rotate(${i * 25} ${x} ${y})"/><path d="M${x} ${y - 50} q-22 50 0 100" stroke="${d}" stroke-width="7" fill="none" transform="rotate(${i * 25} ${x} ${y})"/>`;
      })
      .join(""),
  dripper: (c, d) =>
    `<path d="M200 180 h200 l-60 140 h-80z" fill="${c}"/><rect x="250" y="320" width="100" height="16" fill="${d}"/>` +
    `<path d="M220 340 h160 v110 q0 30 -30 30 h-100 q-30 0 -30 -30z" fill="#e2e8f0"/><rect x="230" y="400" width="140" height="70" rx="20" fill="${d}" opacity="0.8"/>`,
  tumbler: (c, d) =>
    `<rect x="240" y="150" width="120" height="40" rx="12" fill="${d}"/><path d="M230 190 h140 l-14 290 h-112z" fill="${c}"/>` +
    `<rect x="236" y="300" width="128" height="40" fill="#ffffff" opacity="0.5"/>`,
  cookie: (c, d) =>
    `<circle cx="300" cy="300" r="150" fill="${c}"/>` +
    [
      [250, 240],
      [340, 260],
      [280, 330],
      [360, 350],
      [230, 330],
      [310, 400],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="${d}"/>`)
      .join(""),
  shirt: (c, d) =>
    `<path d="M220 140 l-100 60 l40 80 l50 -24 v220 h180 v-220 l50 24 l40 -80 l-100 -60 q-80 50 -160 0z" fill="${c}"/>` +
    `<path d="M260 140 q40 40 80 0" stroke="${d}" stroke-width="10" fill="none"/>`,
  dress: (c, d) =>
    `<path d="M250 120 h100 l-10 90 l90 270 h-260 l90 -270z" fill="${c}"/><rect x="240" y="205" width="120" height="18" fill="${d}"/>`,
  sneaker: (c, d) =>
    `<path d="M120 380 q0 -60 40 -80 l100 -50 l60 60 q80 20 160 30 q40 10 40 50 v20 h-400z" fill="${c}"/>` +
    `<rect x="120" y="400" width="400" height="30" rx="10" fill="${d}"/><path d="M270 270 l20 20 M290 255 l20 20 M310 240 l20 20" stroke="#ffffff" stroke-width="8"/>`,
  tote: (c, d) =>
    `<path d="M240 220 q0 -90 60 -90 q60 0 60 90" stroke="${d}" stroke-width="14" fill="none"/><rect x="180" y="210" width="240" height="250" rx="16" fill="${c}"/>` +
    `<rect x="230" y="300" width="140" height="10" rx="5" fill="#ffffff" opacity="0.7"/>`,
  watch: (c, d) =>
    `<rect x="260" y="100" width="80" height="400" rx="20" fill="${d}"/><circle cx="300" cy="300" r="110" fill="${c}"/><circle cx="300" cy="300" r="88" fill="#ffffff"/>` +
    `<path d="M300 300 v-60 M300 300 l40 24" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>`,
  hat: (c, d) =>
    `<ellipse cx="300" cy="380" rx="210" ry="50" fill="${c}"/><path d="M190 380 q0 -170 110 -170 q110 0 110 170z" fill="${c}"/><rect x="190" y="330" width="220" height="30" fill="${d}"/>`,
};

function product(shape: ProductShape, bg: string, c: string, d: string): string {
  return svg(600, 600, `<rect width="600" height="600" fill="${bg}"/>${SHAPES[shape](c, d)}`);
}

/* ------------------------------ registry ---------------------------- */

const SOURCES: Record<string, () => string> = {
  "hero-office": heroOffice,
  "hero-agency": heroAgency,
  workspace,
  storefront,
  "boutique-banner": boutiqueBanner,
  "team-1": () => avatar("#dbeafe", "#f1c27d", "#3f2a1d"),
  "team-2": () => avatar("#e0e7ff", "#c68642", "#111827"),
  "team-3": () => avatar("#ccfbf1", "#ffdbac", "#7c2d12"),
  "coffee-bag": () => product("bag", "#fef3c7", "#92400e", "#451a03"),
  "coffee-mug": () => product("mug", "#ffedd5", "#ea580c", "#7c2d12"),
  "coffee-beans": () => product("beans", "#fef9c3", "#78350f", "#fde68a"),
  "coffee-dripper": () => product("dripper", "#ecfccb", "#f8fafc", "#65a30d"),
  "coffee-tumbler": () => product("tumbler", "#e0f2fe", "#0369a1", "#0c4a6e"),
  "coffee-cookie": () => product("cookie", "#fce7f3", "#d97706", "#451a03"),
  "fashion-shirt": () => product("shirt", "#f0fdfa", "#0f766e", "#134e4a"),
  "fashion-dress": () => product("dress", "#fdf2f8", "#db2777", "#831843"),
  "fashion-sneaker": () => product("sneaker", "#f8fafc", "#334155", "#e2e8f0"),
  "fashion-tote": () => product("tote", "#fefce8", "#ca8a04", "#713f12"),
  "fashion-watch": () => product("watch", "#f1f5f9", "#0f766e", "#1e293b"),
  "fashion-hat": () => product("hat", "#fff7ed", "#c2410c", "#431407"),
  ...EXTRA_SOURCES,
  ...V2A_SOURCES,
  ...V2B_SOURCES,
  ...V3C_SOURCES,
  ...V3D_SOURCES,
  ...V4E_SOURCES,
  ...V5F_SOURCES,
  ...V6G_SOURCES,
  ...V7H_SOURCES,
  ...V9I_SOURCES,
  ...V10J_SOURCES,
};

export type AssetName = keyof typeof SOURCES;
export const ASSET_NAMES = Object.keys(SOURCES);

const cacheSvg = new Map<string, string>();
const cacheUri = new Map<string, string>();

/** Isi SVG sebuah aset. */
export function assetSvg(name: string): string {
  let s = cacheSvg.get(name);
  if (s === undefined) {
    const src = SOURCES[name];
    if (!src) throw new Error(`Unknown template asset: ${name}`);
    s = src();
    cacheSvg.set(name, s);
  }
  return s;
}

/** Data URI (base64) sebuah aset — dipakai di state elemen. */
export function asset(name: string): string {
  let u = cacheUri.get(name);
  if (u === undefined) {
    u = `data:image/svg+xml;base64,${btoa(assetSvg(name))}`;
    cacheUri.set(name, u);
  }
  return u;
}

/** Peta balik data URI → nama aset (untuk mengubahnya menjadi berkas saat diunduh). */
export function assetNameOf(uri: string): string | null {
  for (const name of ASSET_NAMES) if (asset(name) === uri) return name;
  return null;
}
