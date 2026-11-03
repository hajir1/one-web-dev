import { specks, svg } from "./art";

/* Ilustrasi 03 Nadia Pramesti: "foto" hitam-putih berbutir (bentuk sederhana + grain), bukan foto asli. */

const grain = (w: number, h: number, seed: number) => specks(700, w, h, "#ffffff", seed, 1.1) + specks(500, w, h, "#000000", seed + 9, 1.2);
const bw = (w: number, h: number, sky: [string, string], body: string, seed: number) =>
  svg(w, h, `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#s)"/>${body}<g opacity=".35">${grain(w, h, seed)}</g>`);

/** Nelayan menarik jaring saat subuh (potret). */
const hero = () =>
  bw(800, 1000, ["#9a948a", "#2b2825"], `<rect y="640" width="800" height="360" fill="#3c3834"/><path d="M0 660c200-20 600-20 800 0" stroke="#bdb6aa" stroke-width="3" fill="none"/><path d="M360 380c40-30 90-20 110 20l40 260h-200z" fill="#141210"/><circle cx="420" cy="330" r="46" fill="#141210"/><path d="M470 460l180 120M480 500l170 140" stroke="#141210" stroke-width="22" stroke-linecap="round"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${560 + i * 18} ${560 + i * 6}l60 260" stroke="#5c5650" stroke-width="2"/>`).join("")}<circle cx="190" cy="250" r="60" fill="#d8d2c6" opacity=".5"/>`, 3);

/** Perahu pinisi berjajar di dermaga. */
const s1 = () => bw(900, 600, ["#b5afa4", "#4a4540"], `<rect y="420" width="900" height="180" fill="#2a2724"/>${[80, 300, 520, 720].map((x, i) => `<path d="M${x} 420h${160 - i * 10}l-30 50h-${110 - i * 10}z" fill="#141210"/><path d="M${x + 70} 420V${170 + i * 20}" stroke="#141210" stroke-width="6"/><path d="M${x + 76} ${180 + i * 20}l70 200h-70z" fill="#d8d2c6" opacity=".7"/>`).join("")}`, 5);

/** Meja pasar dilihat dari bawah: kaki-kaki, keranjang, cahaya dari celah. */
const s2 = () => bw(900, 600, ["#3a3632", "#141210"], `<rect x="0" y="0" width="900" height="120" fill="#141210"/>${[120, 380, 640].map((x) => `<rect x="${x}" y="120" width="26" height="480" fill="#0c0b0a"/>`).join("")}<path d="M200 600c20-160 80-220 140-220s90 80 100 220z" fill="#6d665e"/><ellipse cx="620" cy="520" rx="140" ry="60" fill="#8b8379"/><path d="M0 120h900" stroke="#e9e2d3" stroke-width="4" opacity=".8"/>`, 7);

/** Petak garam: garis-garis kolam, petani memikul. */
const s3 = () => bw(900, 600, ["#e2ddd2", "#8c867c"], `${Array.from({ length: 6 }, (_, i) => `<path d="M0 ${300 + i * 50}L900 ${280 + i * 54}" stroke="#4a4540" stroke-width="3"/>`).join("")}<circle cx="430" cy="250" r="22" fill="#141210"/><path d="M410 270h40l14 120h-68z" fill="#141210"/><path d="M340 290h180" stroke="#141210" stroke-width="8"/><path d="M330 290l-10 50h40zM530 290l-10 50h40z" fill="#3a3632"/>`, 11);

/** Rumah panggung diangkat banyak orang. */
const s4 = () => bw(900, 600, ["#a8a297", "#57514a"], `<path d="M260 170l190-90 190 90z" fill="#141210"/><rect x="290" y="170" width="320" height="140" fill="#2a2724"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${300 + i * 58}" y="310" width="10" height="120" fill="#141210"/>`).join("")}${Array.from({ length: 14 }, (_, i) => `<circle cx="${240 + i * 32}" cy="${440 + (i % 2) * 8}" r="14" fill="#141210"/><rect x="${230 + i * 32}" y="${454 + (i % 2) * 8}" width="20" height="80" fill="#141210"/>`).join("")}<rect y="540" width="900" height="60" fill="#3c3834"/>`, 13);

export const ART03: Record<string, () => string> = { hero, s1, s2, s3, s4 };
