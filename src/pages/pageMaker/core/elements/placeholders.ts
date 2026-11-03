/* ================================================================== */
/* Gambar contoh bawaan elemen (SVG buatan sendiri, tanpa lisensi pihak  */
/* ketiga dan tanpa layanan luar). Menggantikan foto Unsplash dan        */
/* placehold.co agar isi bawaan bebas dipakai komersial.                */
/* ================================================================== */

const uri = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;
const esc = (s: string) => s.replace(/[<>&"]/g, "");

/** Pemandangan sederhana: langit gradasi, matahari, dan lapisan bukit. */
export function sceneImage(w: number, h: number, sky: [string, string], hills: [string, string, string], sun = "#fff4d6", grey = false): string {
  const f = grey ? ` filter="url(#g)"` : "";
  const hill = (y: number, amp: number, c: string, ph: number) => {
    let d = `M0 ${h}`;
    for (let x = 0; x <= w; x += w / 8) d += ` L${x.toFixed(0)} ${(y + Math.sin(x / w * 6.3 + ph) * amp).toFixed(0)}`;
    return `<path d="${d} L${w} ${h} Z" fill="${c}"/>`;
  };
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>${grey ? '<filter id="g"><feColorMatrix type="saturate" values="0"/></filter>' : ""}</defs><g${f}><rect width="${w}" height="${h}" fill="url(#s)"/><circle cx="${w * 0.72}" cy="${h * 0.32}" r="${h * 0.11}" fill="${sun}"/>${hill(h * 0.58, h * 0.06, hills[0], 0.4)}${hill(h * 0.7, h * 0.05, hills[1], 2.1)}${hill(h * 0.82, h * 0.04, hills[2], 4)}</g></svg>`,
  );
}

/** Kotak abu-abu netral dengan label (pengganti placehold.co). */
export function boxImage(w: number, h: number, text: string): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#e2e8f0"/><text x="50%" y="50%" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="${Math.round(Math.min(w, h) / 8)}" text-anchor="middle" dominant-baseline="middle">${esc(text)}</text></svg>`,
  );
}

/** Ruangan sederhana (untuk contoh titik interaktif): dinding, lantai, sofa, lampu. */
export function roomImage(w: number, h: number): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h * 0.7}" fill="#efe6da"/><rect y="${h * 0.7}" width="${w}" height="${h * 0.3}" fill="#c8a983"/><rect x="${w * 0.12}" y="${h * 0.16}" width="${w * 0.22}" height="${h * 0.26}" fill="#9fb7a6"/><rect x="${w * 0.3}" y="${h * 0.5}" width="${w * 0.42}" height="${h * 0.2}" rx="${h * 0.03}" fill="#5f6f82"/><rect x="${w * 0.27}" y="${h * 0.58}" width="${w * 0.48}" height="${h * 0.14}" rx="${h * 0.03}" fill="#4d5b6b"/><rect x="${w * 0.82}" y="${h * 0.22}" width="${w * 0.012}" height="${h * 0.48}" fill="#3b3b3b"/><path d="M${w * 0.78} ${h * 0.22} L${w * 0.87} ${h * 0.22} L${w * 0.85} ${h * 0.12} L${w * 0.8} ${h * 0.12} Z" fill="#f2c46d"/><rect x="${w * 0.4}" y="${h * 0.8}" width="${w * 0.24}" height="${h * 0.05}" rx="${h * 0.02}" fill="#8a6a48"/></svg>`,
  );
}

/** Enam pemandangan contoh untuk galeri. */
export const SAMPLE_SCENES: [string, string][] = [
  [sceneImage(1200, 800, ["#c9d6df", "#eef2f3"], ["#8fa3a6", "#6b8284", "#4e6466"]), "Lembah berkabut"],
  [sceneImage(1200, 800, ["#7fb3d5", "#d6eaf8"], ["#5d8aa8", "#3e6d8e", "#2c4f66"]), "Danau pegunungan"],
  [sceneImage(1200, 800, ["#f6d5b0", "#fdf1e3"], ["#c99b72", "#a67753", "#7d5639"], "#ffffff"), "Rumah tepi danau"],
  [sceneImage(1200, 800, ["#b8d8be", "#eaf4ec"], ["#6f9e78", "#4f7d5a", "#345b3e"]), "Hutan pinus"],
  [sceneImage(1200, 800, ["#f4a261", "#fde2c4"], ["#c2674a", "#9a4a36", "#6d3226"], "#ffe8b0"), "Matahari terbenam"],
  [sceneImage(1200, 800, ["#a9c5d8", "#e7f0f6"], ["#7c9b8a", "#5e7f6d", "#3f5f50"]), "Lanskap sungai"],
];
