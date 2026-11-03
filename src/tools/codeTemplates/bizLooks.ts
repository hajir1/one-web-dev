/* ================================================================== */
/* Identitas per template untuk website 3D bisnis (desain ulang v27).   */
/*                                                                    */
/* Audit v26: ke-40 template memakai kerangka yang sama persis (hero   */
/* teks kiri + lingkaran 3D kanan, kartu bersudut bulat, latar krem,   */
/* 11 bagian berurutan, objek bergeser kiri-kanan), dan 16 di antaranya */
/* memakai Inter. Satu "look" memberi tiap template:                   */
/*  - palet, pasangan font, dan sudut sendiri;                          */
/*  - CSS yang mengubah tata letak & cara bagian disajikan;             */
/*  - elemen khas (label, kurva, struk, papan hitung mundur, ...);      */
/*  - efek scroll khas yang digerakkan OWD Scrub (pengganti GSAP);       */
/*  - jalur pose objek 3D yang sesuai idenya.                           */
/* Fungsi usaha (katalog, paket, lokasi, FAQ, WhatsApp) tetap sama.     */
/* ================================================================== */

export type PoseKey = "beranda" | "profil" | "katalog" | "keunggulan" | "alur" | "testimoni" | "galeri" | "harga" | "lokasi" | "faq" | "kontak";
export interface PoseLike { x: number; y: number; s: number; ry: number; rx: number; o: number; ny: number; ns: number; no: number }

export interface BizLook {
  /** Nama identitas (tampil di laporan & komentar sumber). */
  name: string;
  font: [string, string];
  /** [latar, permukaan, teks, teks lembut, aksen, aksen kedua] */
  colors: [string, string, string, string, string, string];
  dark?: boolean;
  round: number;
  /** Salinan hero baru (opsional). */
  type?: string;
  tagline?: string;
  intro?: string;
  hint?: string;
  /** Varian warna objek 3D & keterangan galeri baru (opsional). */
  variants?: [string, string, string][];
  gallery?: string[];
  /** Teks label kecil per bagian (opsional), mis. { profil: "No. 01 · Kebun" }. */
  kicks?: Partial<Record<PoseKey, string>>;
  css: string;
  /** HTML tambahan: di awal teks hero, di dalam panggung 3D, di header, dan elemen tetap (dekorasi). */
  heroTop?: string;
  stage?: string;
  nav?: string;
  fixed?: string;
  /** JS khas (modul, setelah mesin): boleh memakai G, ST, animated, lenis, reduce, secs, root. */
  js?: string;
  /** Ubah pose objek per bagian. */
  pose?: (k: PoseKey, p: PoseLike, i: number) => PoseLike;
}

/* ---------------------------- 1. Kopi ---------------------------- */
const KOPI: BizLook = {
  name: "Catatan Sangrai",
  font: ["Fraunces", "IBM Plex Mono"],
  colors: ["#e8dbc4", "#f3ead9", "#2a1a10", "#5e4636", "#8e3b1f", "#5f6b2c"],
  round: 2,
  type: "Roastery & kedai kopi",
  tagline: "Disangrai hari Kamis, sampai di cangkirmu hari Senin.",
  intro: "Arabika dari kebun keluarga kami di lereng Ijen, 1.400 meter. Tiap kantong mencatat tanggal sangrai, suhu first crack, dan nama petani yang memetiknya.",
  hint: "Gulir untuk menyangrai, geser untuk memutar",
  kicks: { profil: "Lembar 01 · Kebun", katalog: "Lembar 02 · Hasil sangrai", keunggulan: "Lembar 03 · Alasan", alur: "Lembar 04 · Alur pesan", testimoni: "Lembar 05 · Catatan cicip", galeri: "Lembar 06 · Foto", harga: "Lembar 07 · Langganan", lokasi: "Lembar 08 · Kedai", faq: "Lembar 09 · Tanya", kontak: "Lembar 10 · Pesan" },
  heroTop: `<div class="batch" aria-hidden="true"><span>Batch 0412</span><span>Sangrai 31·10</span><span>First crack 196&deg;C</span></div>`,
  fixed: `<div class="roast" aria-hidden="true"><svg viewBox="0 0 60 1000" preserveAspectRatio="none"><path class="roast-bg" d="M48 0 C 46 120 18 160 20 260 S 40 420 34 520 S 14 700 22 820 S 40 940 30 1000"/><path class="roast-line" d="M48 0 C 46 120 18 160 20 260 S 40 420 34 520 S 14 700 22 820 S 40 940 30 1000"/></svg><ol><li>Kering 150&deg;</li><li>Maillard 175&deg;</li><li>First crack 196&deg;</li><li>Selesai 208&deg;</li></ol><b class="temp"><span data-temp>92</span>&deg;C</b></div>`,
  css: `
body { background-color: var(--bg); background-image: repeating-linear-gradient(97deg, transparent 0 3px, color-mix(in srgb, var(--ink) 3%, transparent) 3px 4px), repeating-linear-gradient(3deg, transparent 0 7px, color-mix(in srgb, var(--accent) 3%, transparent) 7px 8px); }
h1, h2 { font-weight: 600; letter-spacing: -.035em; font-variation-settings: "SOFT" 100, "WONK" 1; }
.hero h1 { font-size: clamp(42px, 5.6vw, 82px); }
.kick { font-family: var(--ft); font-size: 12px; letter-spacing: .08em; color: var(--accent); }
.hero-text { position: relative; padding: clamp(22px, 3vw, 38px); border: 1.5px solid var(--ink); outline: 1.5px solid var(--ink); outline-offset: 5px; background: color-mix(in srgb, var(--surface) 70%, transparent); }
.batch { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: -6px 0 18px; padding-bottom: 12px; border-bottom: 1.5px dashed var(--ink); font: 500 12px/1.2 var(--ft); text-transform: uppercase; letter-spacing: .06em; }
.btn { border-radius: 2px; font-family: var(--ft); text-transform: uppercase; letter-spacing: .06em; font-size: 13px; }
.card { border: 1.5px dashed color-mix(in srgb, var(--ink) 55%, transparent); background: color-mix(in srgb, var(--surface) 80%, transparent); }
.stats b, .price, .plan .amount { font-family: var(--ft); font-weight: 600; letter-spacing: -.02em; }
.grid { grid-template-columns: 1fr; gap: 0; border-top: 1.5px solid var(--ink); }
.item.card { flex-direction: row; flex-wrap: wrap; align-items: baseline; gap: 4px 18px; padding: 16px 4px; border: 0; border-bottom: 1.5px dashed color-mix(in srgb, var(--ink) 45%, transparent); background: none; border-radius: 0; }
.item .pic { display: none; }
.item .tag { position: static; order: 3; border-radius: 0; font-family: var(--ft); }
.item small.cat { order: 0; width: 120px; font-family: var(--ft); }
.item h3 { order: 1; margin: 0; flex: 1 1 220px; font-size: 21px; }
.item p { order: 4; flex: 1 1 100%; padding-left: 138px; }
.item .row { order: 2; margin: 0; gap: 16px; }
.roast { position: fixed; left: 10px; top: 92px; bottom: 26px; z-index: 3; width: 150px; pointer-events: none; font: 500 11px/1.2 var(--ft); color: var(--soft); }
.roast svg { position: absolute; left: 0; top: 0; width: 60px; height: 100%; overflow: visible; }
.roast path { fill: none; stroke-width: 2.4; vector-effect: non-scaling-stroke; }
.roast .roast-bg { stroke: color-mix(in srgb, var(--ink) 14%, transparent); stroke-dasharray: 2 6; }
.roast .roast-line { stroke: var(--accent); }
.roast ol { position: absolute; inset: 0; margin: 0; padding: 0; list-style: none; }
.roast li { position: absolute; left: 30px; padding: 3px 6px; background: var(--bg); text-transform: uppercase; letter-spacing: .05em; transition: color .3s; white-space: nowrap; }
.roast li:nth-child(1) { top: 22%; } .roast li:nth-child(2) { top: 46%; } .roast li:nth-child(3) { top: 70%; } .roast li:nth-child(4) { top: 94%; }
.roast li.on { color: var(--accent); font-weight: 600; }
.roast .temp { position: absolute; left: 0; top: -26px; font-size: 13px; color: var(--ink); }
@media (min-width: 1181px) { main, footer { padding-left: 150px; } .roast li { background: none; } }
@media (max-width: 1180px) { .roast { display: none; } }
@media (max-width: 640px) { .item p { padding-left: 0; } .item small.cat { width: auto; } }
`,
  js: `
(function () {
  const line = document.querySelector(".roast-line"), temp = document.querySelector("[data-temp]"), marks = Array.prototype.slice.call(document.querySelectorAll(".roast li"));
  if (!line) return;
  const L = line.getTotalLength ? line.getTotalLength() : 1000;
  line.style.strokeDasharray = L + " " + L;
  const paint = (p) => { line.style.strokeDashoffset = String(L * (1 - p)); if (temp) temp.textContent = String(Math.round(92 + p * 116)); marks.forEach((m, i) => m.classList.toggle("on", p >= (i + 1) * 0.235 - 0.02)); };
  if (animated) ST.create({ start: 0, end: "max", scrub: 0.6, onUpdate: (st) => paint(st.progress) }); else paint(1);
})();`,
};

/* ---------------------------- 2. Roti ---------------------------- */
const ROTI: BizLook = {
  name: "Etalase Pagi",
  font: ["Shrikhand", "Figtree"],
  colors: ["#fff1dc", "#fffaf2", "#3a1f14", "#6e4c3c", "#b8262f", "#f0b23a"],
  round: 18,
  type: "Toko roti & kue rumahan",
  tagline: "Keluar oven tiga kali sehari. Yang jam enam paling cepat habis.",
  hint: "Gulir untuk memutar meja kue, geser untuk melihat",
  kicks: { katalog: "Isi etalase hari ini" },
  heroTop: `<div class="oven" aria-live="polite"><span>Angkatan berikutnya</span><b data-oven>06.00</b></div>`,
  fixed: `<div class="awning" aria-hidden="true"></div>`,
  css: `
.awning { position: absolute; left: 0; right: 0; top: 66px; height: 54px; z-index: 1; background: repeating-linear-gradient(90deg, var(--accent) 0 44px, var(--surface) 44px 88px); -webkit-mask: radial-gradient(22px 16px at 22px 100%, transparent 98%, #000) 0 0 / 44px 100%; mask: radial-gradient(22px 16px at 22px 100%, transparent 98%, #000) 0 0 / 44px 100%; pointer-events: none; }
h1, h2 { font-weight: 400; letter-spacing: 0; line-height: 1.04; color: var(--accent); }
.hero h1 { font-size: clamp(40px, 5vw, 74px); text-shadow: 3px 3px 0 color-mix(in srgb, var(--accent-2) 70%, transparent); }
.hero { padding-top: 150px; }
.kick { font-family: var(--ft); font-weight: 800; letter-spacing: .04em; color: var(--ink); text-transform: none; font-size: 15px; }
.oven { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 18px; padding: 8px 16px 8px 8px; border-radius: 999px; background: var(--ink); color: var(--bg); font-size: 14px; font-weight: 600; }
.oven b { padding: 6px 12px; border-radius: 999px; background: var(--accent-2); color: var(--ink); font-size: 16px; font-variant-numeric: tabular-nums; }
.card { border: 2px solid var(--ink); box-shadow: 4px 5px 0 var(--ink); }
.grid { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 0 18px; }
.item.card { border: 0; box-shadow: none; background: none; padding: 26px 6px 22px; border-bottom: 10px solid #b07a4a; border-radius: 0; }
.item .pic { aspect-ratio: 1; border-radius: 50%; width: 76%; margin: 0 auto 14px; background: radial-gradient(circle at 40% 35%, var(--surface), color-mix(in srgb, var(--accent-2) 40%, var(--surface))); box-shadow: inset 0 -10px 0 color-mix(in srgb, var(--ink) 8%, transparent); }
.item .tag { top: 12px; left: auto; right: 10px; border-radius: 4px; transform: rotate(calc(8deg + var(--swing, 0) * 1deg)); transform-origin: 50% -14px; box-shadow: 0 -14px 0 -13px var(--ink); }
.item .row .price { display: inline-block; padding: 4px 10px; border: 2px solid var(--ink); border-radius: 6px; background: var(--surface); transform: rotate(calc(-3deg - var(--swing, 0) * .8deg)); transform-origin: 50% -10px; }
.tab { border: 2px solid var(--ink); font-weight: 700; }
.tab[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn { box-shadow: 3px 3px 0 var(--ink); font-weight: 800; }
.btn.ghost { background: var(--surface); box-shadow: inset 0 0 0 2px var(--ink), 3px 3px 0 var(--ink); }
.steps li::before { border-radius: 50%; background: var(--accent-2); color: var(--ink); }
.testi li:nth-child(odd) { transform: rotate(-1.2deg); } .testi li:nth-child(even) { transform: rotate(1deg); }
@media (max-width: 900px) { .awning { height: 34px; } .hero { padding-top: 110px; } }
`,
  js: `
(function () {
  const el = document.querySelector("[data-oven]");
  if (el) { const now = new Date(), h = now.getHours() + now.getMinutes() / 60, next = [6, 10, 15].find((x) => x > h); el.textContent = next ? String(next).padStart(2, "0") + ".00" : "Besok 06.00"; }
  if (!animated || !lenis) return;
  let sw = 0;
  lenis.on("scroll", (e) => { sw = Math.max(-9, Math.min(9, (e.velocity || 0) * 0.6)); });
  G.ticker.add(() => { sw *= 0.9; root.style.setProperty("--swing", sw.toFixed(2)); });
})();`,
  pose: (_k, p, i) => ({ ...p, ry: p.ry + i * 0.9 }),
};

/* ---------------------------- 3. Batik --------------------------- */
const BATIK: BizLook = {
  name: "Lembar Malam",
  font: ["Bodoni Moda", "Jost"],
  colors: ["#f2ece0", "#faf6ee", "#1d2742", "#4f5770", "#6b3a1f", "#a8823a"],
  round: 0,
  type: "Batik tulis & cap Pekalongan",
  tagline: "Empat puluh hari, tiga kali dilorod, satu lembar kain.",
  intro: "Batik tulis dan cap dari bengkel keluarga di Pekalongan. Setiap motif kami beri nomor, catatan asal-usul, dan nama pembatiknya.",
  hint: "Gulir untuk membentangkan kain",
  kicks: { profil: "I · Bengkel", katalog: "II · Koleksi", keunggulan: "III · Cara kami", alur: "IV · Memesan", testimoni: "V · Pemakai", galeri: "VI · Lembar", harga: "VII · Pesanan khusus", lokasi: "VIII · Bengkel", faq: "IX · Tanya", kontak: "X · Surat" },
  heroTop: `<p class="vert" aria-hidden="true">Pekalongan &middot; sejak 1987 &middot; lembar no. 214</p>`,
  css: `
h1, h2 { font-weight: 500; letter-spacing: -.01em; }
.hero h1 { font-size: clamp(46px, 6.4vw, 104px); line-height: .96; font-style: italic; }
.hero .wrap { grid-template-columns: 1.25fr .9fr; }
.hero-text { position: relative; padding-left: 38px; }
.vert { position: absolute; left: 0; top: 0; bottom: 0; writing-mode: vertical-rl; transform: rotate(180deg); font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: var(--soft); margin: 0; }
.kick { font-family: var(--fd); font-style: italic; text-transform: none; letter-spacing: .02em; font-size: 17px; color: var(--accent); }
.s { border-top: 1px solid var(--line); }
.card { border: 0; border-top: 1px solid var(--ink); border-radius: 0; background: none; }
.btn { border-radius: 0; text-transform: uppercase; letter-spacing: .16em; font-size: 12px; min-height: 50px; }
.grid { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 40px 28px; counter-reset: motif; }
.item.card { grid-column: span 2; padding: 18px 0 0; counter-increment: motif; }
.item.card:nth-child(5n + 1) { grid-column: span 4; }
.item .pic { aspect-ratio: 4 / 5; border-radius: 0; background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 14%, var(--surface)) 0 14px, var(--surface) 14px 28px); }
.item.card:nth-child(5n + 1) .pic { aspect-ratio: 16 / 10; }
.item h3 { font-size: 24px; font-style: italic; }
.item h3::before { content: counter(motif, upper-roman) ". "; font-style: normal; color: var(--accent); }
.item .tag { left: 0; top: 30px; border-radius: 0; background: var(--ink); color: var(--bg); }
.tab { border-radius: 0; border: 0; border-bottom: 1px solid var(--line); background: none; text-transform: uppercase; letter-spacing: .14em; font-size: 12px; }
.tab[aria-pressed="true"] { background: none; color: var(--accent); border-color: var(--accent); }
.steps li::before { border-radius: 0; background: none; color: var(--accent); font: italic 500 30px/1 var(--fd); }
.testi blockquote { font: italic 400 20px/1.45 var(--fd); }
h2.wax { clip-path: inset(0 100% 0 0); }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } .item.card, .item.card:nth-child(5n + 1) { grid-column: span 1; } .item.card:nth-child(5n + 1) { grid-column: 1 / -1; } .hero .wrap { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
`,
  js: `
(function () {
  const heads = Array.prototype.slice.call(document.querySelectorAll("main .s h2"));
  if (!animated) return;
  heads.forEach((h) => { h.classList.add("wax"); G.fromTo(h, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "power2.out", scrollTrigger: { trigger: h, start: "top 92%", end: "top 55%", scrub: 0.4 } }); });
})();`,
  pose: (k, p) => (k === "katalog" || k === "galeri" ? { ...p, o: 0.05, no: 0.04 } : p),
};

/* --------------------------- 4. Gerabah -------------------------- */
const GERABAH: BizLook = {
  name: "Meja Putar",
  font: ["Young Serif", "Instrument Sans"],
  colors: ["#ead9c4", "#f5ebdd", "#2b1d16", "#5e4a3c", "#a2431c", "#4a5b36"],
  round: 26,
  type: "Perajin gerabah & keramik Kasongan",
  tagline: "Diputar tangan, dibakar kayu, dikirim utuh.",
  hint: "Gulir untuk memutar meja, geser untuk melihat",
  kicks: { katalog: "Rak pengeringan", alur: "Dari tanah sampai tungku" },
  stage: `<div class="wheel" aria-hidden="true"><b data-rpm>0</b><span>putaran/menit</span></div>`,
  css: `
h1, h2 { font-weight: 400; letter-spacing: -.01em; }
.hero h1 { font-size: clamp(44px, 5.8vw, 86px); }
.kick { text-transform: none; letter-spacing: 0; font-size: 15px; font-weight: 600; color: var(--accent-2); }
.stage::after { content: ""; position: absolute; left: 14%; right: 14%; bottom: 4%; height: 14%; border-radius: 50%; background: radial-gradient(closest-side, color-mix(in srgb, var(--ink) 30%, transparent), transparent); }
.wheel { position: absolute; right: 4%; top: 6%; display: grid; justify-items: end; font-size: 12px; color: var(--soft); }
.wheel b { font: 400 44px/1 var(--fd); color: var(--accent); font-variant-numeric: tabular-nums; }
.card { border: 0; background: var(--surface); box-shadow: 0 1px 0 color-mix(in srgb, var(--ink) 10%, transparent); }
.grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 36px 20px; }
.item.card { background: none; box-shadow: none; padding: 0; }
.item .pic { aspect-ratio: 3 / 4; border-radius: 999px 999px 10px 10px; background: radial-gradient(120% 80% at 50% 100%, color-mix(in srgb, var(--accent) 45%, var(--surface)), var(--surface) 70%); }
.item .tag { top: 14px; left: 50%; transform: translateX(-50%); }
.steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.steps li { padding: 64px 18px 18px; border-radius: 999px 999px var(--r) var(--r); text-align: center; }
.steps li::before { left: 50%; transform: translateX(-50%); top: 14px; border-radius: 50%; background: var(--accent-2); }
.plan { border-radius: 200px 200px var(--r) var(--r); padding-top: 64px; }
.plan .badge { left: 50%; transform: translateX(-50%); }
.gal li { border-radius: 999px 999px var(--r) var(--r); }
@media (max-width: 560px) { .steps { grid-template-columns: 1fr; } }
`,
  js: `
(function () {
  const rpm = document.querySelector("[data-rpm]");
  if (!rpm || !animated || !lenis) return;
  let v = 0;
  lenis.on("scroll", (e) => { v = Math.min(140, Math.abs(e.velocity || 0) * 9); });
  let shown = 0;
  G.ticker.add(() => { shown += (v - shown) * 0.08; v *= 0.94; rpm.textContent = String(Math.round(shown)); });
})();`,
  pose: (_k, p, i) => ({ ...p, ry: p.ry * 1.6 + i * 1.2, rx: 0.08 }),
};

/* ---------------------------- 5. Madu ---------------------------- */
const MADU: BizLook = {
  name: "Sarang Tambora",
  font: ["Spectral", "Archivo"],
  colors: ["#151d17", "#1f2a22", "#f2e7cb", "#bdb193", "#e3a532", "#a9bd82"],
  dark: true,
  round: 4,
  type: "Madu hutan liar Sumbawa",
  tagline: "Dipanen dua kali setahun, dari sarang yang dibiarkan tetap hidup.",
  hint: "Gulir untuk mengisi sel madu",
  kicks: { katalog: "Isi sarang musim ini", alur: "Kalender panen" },
  fixed: `<div class="comb" aria-hidden="true"><i data-fill></i><span><b data-fillpct>0</b>% terisi</span></div>`,
  css: `
body { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='97' viewBox='0 0 56 97'%3E%3Cpath d='M28 0l28 16v32L28 64 0 48V16zM28 64v33' fill='none' stroke='%23e3a532' stroke-opacity='.06' stroke-width='1.2'/%3E%3C/svg%3E"); }
h1, h2 { font-weight: 500; letter-spacing: -.015em; }
.hero h1 { font-style: italic; font-size: clamp(40px, 5.2vw, 78px); }
h2 { position: relative; padding-bottom: 14px; }
h2::after { content: ""; position: absolute; left: 0; bottom: 0; width: 64px; height: 6px; border-radius: 0 0 6px 6px; background: var(--accent); }
.kick { color: var(--accent-2); }
.hex, .item .pic, .stats div { clip-path: polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%); }
.stats div { padding: 26px 30px; text-align: center; border: 0; background: color-mix(in srgb, var(--accent) 14%, var(--surface)); }
.item .pic { aspect-ratio: 1.15; width: 70%; margin: 0 auto 14px; border-radius: 0; background: radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--accent) 80%, #fff), var(--accent) 60%, color-mix(in srgb, var(--accent) 60%, #000)); color: var(--bg); }
.card { border-color: color-mix(in srgb, var(--accent) 22%, transparent); }
.steps { counter-reset: none; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.steps li { padding-left: 18px; padding-top: 58px; }
.steps li::before { content: attr(data-month); width: auto; padding: 0 12px; border-radius: 4px; background: var(--accent); color: var(--bg); font-size: 13px; letter-spacing: .06em; text-transform: uppercase; }
.comb { position: fixed; right: 16px; top: 96px; bottom: 96px; z-index: 3; width: 26px; pointer-events: none; }
.comb::before { content: ""; position: absolute; inset: 0; border-radius: 13px; border: 1.5px solid color-mix(in srgb, var(--accent) 40%, transparent); }
.comb i { position: absolute; left: 4px; right: 4px; bottom: 4px; top: 4px; border-radius: 10px; background: linear-gradient(to top, #b4741b, var(--accent)); transform-origin: 50% 100%; transform: scaleY(0); }
.comb span { position: absolute; right: 34px; bottom: 0; white-space: nowrap; font-size: 12px; color: var(--soft); }
@media (max-width: 1000px) { .comb { display: none; } }
@media (max-width: 560px) { .steps { grid-template-columns: 1fr; } }
`,
  js: `
(function () {
  ["Mei", "Juni", "Agustus", "September", "Oktober", "Desember"].forEach((m, i) => { const li = document.querySelectorAll(".steps li")[i]; if (li) li.setAttribute("data-month", m); });
  const pct = document.querySelector("[data-fillpct]");
  if (!animated) { const f = document.querySelector("[data-fill]"); if (f) f.style.transform = "none"; if (pct) pct.textContent = "100"; return; }
  G.to("[data-fill]", { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.8 } });
  ST.create({ start: 0, end: "max", scrub: true, onUpdate: (st) => { if (pct) pct.textContent = String(Math.round(st.progress * 100)); } });
})();`,
};

/* --------------------------- 6. Gawai ---------------------------- */
const GAWAI: BizLook = {
  name: "Meja Bongkar",
  font: ["Archivo", "JetBrains Mono"],
  colors: ["#efefec", "#ffffff", "#141518", "#4f525a", "#bf3b0c", "#1c6a48"],
  round: 0,
  type: "Servis HP, tablet & laptop",
  variants: [["Oranye sinyal", "#e8501a", "#141518"], ["Grafit", "#2b2f36", "#a3a8b3"], ["Hijau PCB", "#1c6a48", "#d9e4d2"], ["Putih meja", "#e9e8e3", "#e8501a"]],
  gallery: ["Ponsel di meja bongkar", "Bagian belakang dan kamera", "Ponsel grafit", "Detail tombol samping", "Ponsel hijau PCB", "Layar menyala setelah servis"],
  hint: "Gulir untuk membongkar, geser untuk memutar",
  kicks: { profil: "01 / Bengkel", katalog: "02 / Tarif servis", keunggulan: "03 / Standar", alur: "04 / Prosedur", testimoni: "05 / Laporan pelanggan", galeri: "06 / Foto meja", harga: "07 / Paket", lokasi: "08 / Lokasi", faq: "09 / FAQ", kontak: "10 / Tiket baru" },
  heroTop: `<div class="ticket" aria-hidden="true"><span>Tiket</span><b>#A-2741</b><span class="ok">Diagnosa gratis</span></div>`,
  css: `
body { background-image: linear-gradient(90deg, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px); background-size: calc((min(100vw - 2 * var(--pad), 1180px)) / 12) 100%; background-position: center 0; }
h1, h2 { font-weight: 800; letter-spacing: -.045em; text-transform: none; }
.hero h1 { font-size: clamp(44px, 6vw, 92px); line-height: .94; }
.kick { font-family: var(--ft); font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--ink); border-top: 3px solid var(--accent); padding-top: 8px; display: inline-block; }
.ticket { display: inline-flex; gap: 0; margin-bottom: 18px; border: 1.5px solid var(--ink); font: 500 12px/1 var(--ft); }
.ticket > * { padding: 8px 10px; } .ticket b { background: var(--ink); color: var(--bg); } .ticket .ok { color: var(--accent-2); }
.btn { border-radius: 0; font-family: var(--ft); font-weight: 500; }
.card { border: 1.5px solid var(--ink); }
.grid { grid-template-columns: 1fr; gap: 0; border: 1.5px solid var(--ink); counter-reset: row; }
.item.card { display: grid; grid-template-columns: 56px 1.1fr 1.6fr auto; align-items: center; gap: 4px 18px; padding: 14px 16px; border: 0; border-bottom: 1px solid var(--line); counter-increment: row; }
.item.card::before { content: counter(row, decimal-leading-zero); font: 500 13px var(--ft); color: var(--soft); }
.item .pic, .item small.cat { display: none; }
.item h3 { margin: 0; font-size: 17px; }
.item p { font-size: 14px; }
.item .row { margin: 0; }
.item .tag { position: static; grid-column: 2; justify-self: start; border-radius: 0; font-family: var(--ft); }
.price { font-family: var(--ft); font-weight: 600; }
.steps li::before { border-radius: 0; font-family: var(--ft); }
.plan.hot { box-shadow: 8px 8px 0 var(--accent); }
.stage::before { content: ""; position: absolute; left: 6%; right: 6%; height: 2px; top: 10%; background: var(--accent); opacity: .7; animation: scan 3.2s ease-in-out infinite; }
@keyframes scan { 50% { top: 88%; } }
@media (max-width: 760px) { .item.card { grid-template-columns: 40px 1fr; } .item p, .item .row { grid-column: 2; } }
@media (prefers-reduced-motion: reduce) { .stage::before { animation: none; } }
`,
  pose: (k, p) => (k === "katalog" ? { ...p, o: 0.05, no: 0.04 } : p),
};

/* --------------------------- 7. Kasir ---------------------------- */
const KASIR: BizLook = {
  name: "Struk Panjang",
  font: ["Instrument Sans", "Space Mono"],
  colors: ["#ebe8e1", "#fffefa", "#151515", "#55524b", "#0d7448", "#f2dc4e"],
  round: 0,
  type: "Aplikasi kasir & stok untuk UMKM",
  variants: [["Hijau kasir", "#0d7448", "#f2dc4e"], ["Hitam struk", "#1d1d1d", "#f2dc4e"], ["Putih kertas", "#f1eee6", "#0d7448"], ["Kuning stabilo", "#e9cf3a", "#151515"]],
  gallery: ["Dasbor penjualan", "Laptop dari samping", "Mode malam kasir", "Grafik dari dekat", "Warna stabilo", "Laporan laba harian"],
  tagline: "Struk terakhir dicetak jam sembilan, laporannya sudah jadi semenit kemudian.",
  hint: "Gulir untuk mencetak struk",
  kicks: { katalog: "Daftar harga fitur", harga: "Total per bulan" },
  nav: `<span class="till" aria-hidden="true">Omzet hari ini <b>Rp<span data-till>0</span></b></span>`,
  css: `
h1, h2 { font-weight: 700; letter-spacing: -.035em; }
.hero h1 { font-size: clamp(40px, 5vw, 76px); }
.hero h1, h2 { background: linear-gradient(transparent 62%, var(--accent-2) 62%, var(--accent-2) 90%, transparent 90%) no-repeat; background-size: 100% 100%; display: inline; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.hero h1 { display: block; background: none; }
.kick, .stats b, .price, .plan .amount, .steps li::before, .till { font-family: var(--ft); }
.kick { letter-spacing: 0; text-transform: uppercase; font-size: 12px; color: var(--soft); }
.kick::before { content: "** "; } .kick::after { content: " **"; }
.till { margin-right: 10px; font-size: 12px; color: var(--soft); white-space: nowrap; }
.till b { color: var(--accent); font-variant-numeric: tabular-nums; }
.btn { border-radius: 0; font-family: var(--ft); font-size: 13px; text-transform: uppercase; }
.card { position: relative; border: 0; background: var(--surface); box-shadow: 0 1px 2px rgba(0,0,0,.08); --tear: radial-gradient(6px 5px at 6px 0, transparent 98%, #000) 0 0 / 12px 100%; }
.plan.card, .info.card, .form.card { -webkit-mask: var(--tear); mask: var(--tear); padding-top: 34px; }
.grid { grid-template-columns: 1fr; max-width: 680px; gap: 0; background: var(--surface); padding: 22px 26px; font-family: var(--ft); }
.item.card { flex-direction: row; flex-wrap: wrap; gap: 4px 12px; padding: 12px 0; box-shadow: none; border-bottom: 1.5px dashed color-mix(in srgb, var(--ink) 40%, transparent); }
.item .pic, .item small.cat { display: none; }
.item h3 { flex: 1; margin: 0; font: 700 15px/1.3 var(--ft); text-transform: uppercase; }
.item p { flex: 1 1 100%; order: 3; font-size: 13px; }
.item .row { margin: 0; }
.item .tag { position: static; order: 2; border-radius: 0; background: var(--accent-2); color: var(--ink); }
.plan ul { border-top: 1.5px dashed var(--line); border-bottom: 1.5px dashed var(--line); padding: 12px 0; font-family: var(--ft); font-size: 13px; }
.plan .amount::before { content: "TOTAL "; font: 400 13px var(--ft); color: var(--soft); }
@media (max-width: 1080px) { .till { display: none; } }
`,
  js: `
(function () {
  const t = document.querySelector("[data-till]");
  if (!t) return;
  const fmt = (v) => Math.round(v).toLocaleString("id-ID").replace(/,/g, ".");
  if (!animated) { t.textContent = fmt(4285000); return; }
  ST.create({ start: 0, end: "max", scrub: 0.5, onUpdate: (st) => { t.textContent = fmt(Math.round((st.progress * 4285000) / 500) * 500); } });
})();`,
};

/* ------------------------ 8. Lepas Landas ------------------------ */
const ROKET: BizLook = {
  name: "Hitung Mundur",
  font: ["Anton", "IBM Plex Mono"],
  colors: ["#e7e5de", "#f5f4ef", "#111111", "#45443f", "#b83600", "#2440a0"],
  round: 0,
  type: "Akselerator startup tahap awal",
  variants: [["Oranye roket", "#e64500", "#111111"], ["Biru cetak", "#2440a0", "#e7e5de"], ["Hijau", "#16a34a", "#e64500"]],
  tagline: "Dua belas minggu, satu tanggal peluncuran, pelanggan pertama sebelum demo day.",
  hint: "Gulir untuk menghitung mundur",
  nav: `<span class="tminus" aria-hidden="true">T&minus;<b data-t>10</b></span>`,
  css: `
h1, h2 { font-weight: 400; text-transform: uppercase; letter-spacing: .005em; line-height: .95; }
.hero h1 { font-size: clamp(42px, 5.4vw, 88px); }
h2 { font-size: clamp(36px, 5vw, 72px); }
main { counter-reset: tm 11; }
main > section { counter-increment: tm -1; }
.kick, .btn, .tab, .stats span, .price small, .item small.cat { font-family: var(--ft); }
.kick { color: var(--ink); letter-spacing: .04em; }
.kick::before { content: "T-" counter(tm) " / "; color: var(--accent); }
.btn { border-radius: 0; border: 2.5px solid var(--ink); box-shadow: 5px 5px 0 var(--ink); text-transform: uppercase; font-weight: 600; }
.btn.ghost { box-shadow: 5px 5px 0 var(--ink); background: var(--surface); }
.card { border: 2.5px solid var(--ink); box-shadow: 6px 6px 0 var(--ink); }
.stats b { font: 400 clamp(36px, 4vw, 56px)/1 var(--fd); color: var(--ink); }
.item .pic { border-radius: 0; background: repeating-linear-gradient(-45deg, var(--accent) 0 12px, var(--ink) 12px 24px); color: var(--bg); }
.item h3, .plan h3, .usp h3, .steps h3 { font: 400 22px/1.05 var(--fd); text-transform: uppercase; }
.plan.hot { background: #ff6a1f; color: #111; --soft: #2a2a27; --accent: #111; --on-accent: #ff6a1f; }
.tminus { margin-right: 10px; font: 400 30px/1 var(--fd); color: var(--accent); font-variant-numeric: tabular-nums; }
.tminus b { font-weight: 400; display: inline-block; min-width: 2ch; }
`,
  js: `
(function () {
  const t = document.querySelector("[data-t]");
  if (!t) return;
  const show = (p) => { const v = Math.max(0, Math.round(10 - p * 10.4)); t.textContent = v ? String(v).padStart(2, "0") : "0"; };
  if (animated) ST.create({ start: 0, end: "max", scrub: true, onUpdate: (st) => show(st.progress) }); else show(1);
})();`,
  pose: (_k, p, i) => ({ ...p, y: p.y - 0.35 + i * 0.07, rx: 0.05 }),
};

/* --------------------------- 9. Ruang Ide ------------------------ */
const IDE: BizLook = {
  name: "Simpul Brief",
  font: ["Bricolage Grotesque", "Newsreader"],
  colors: ["#efeae0", "#f8f5ee", "#161412", "#57514a", "#d63c22", "#1d7566"],
  round: 4,
  type: "Agensi kreatif & digital",
  variants: [["Merah vermilion", "#d63c22", "#e3b23c"], ["Hijau teal", "#1d7566", "#efeae0"], ["Hitam tinta", "#1b1916", "#d63c22"], ["Oker", "#d9a43a", "#161412"]],
  gallery: ["Simpul vermilion", "Orbit dan benang", "Simpul teal", "Detail lekukan", "Simpul tinta", "Simpul oker"],
  tagline: "Brief yang kusut kami urai jadi satu ide yang masih diingat orang besok paginya.",
  hint: "Gulir untuk menarik simpulnya",
  kicks: { katalog: "Yang bisa kami kerjakan", testimoni: "Kata klien, tanpa disunting" },
  fixed: `<svg class="thread" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M70 0 C 20 80 95 160 50 240 S 5 380 60 470 S 96 620 40 700 S 10 880 64 1000"/></svg>`,
  css: `
body { font-size: 18px; }
h1, h2 { font-weight: 800; letter-spacing: -.05em; line-height: .98; }
.hero h1 { font-size: clamp(42px, 5.6vw, 88px); }
.kick { font: italic 400 20px/1.2 var(--ft); text-transform: none; letter-spacing: 0; color: var(--accent); }
.btn { border-radius: 4px; font-family: var(--fd); font-weight: 700; }
.card { border: 1.5px solid var(--ink); }
.grid { grid-template-columns: 1fr; gap: 0; counter-reset: c; border-top: 1.5px solid var(--ink); }
.item.card { display: grid; grid-template-columns: 90px 1fr 1fr auto; gap: 6px 20px; align-items: baseline; padding: 22px 0; border: 0; border-bottom: 1.5px solid var(--ink); border-radius: 0; background: none; counter-increment: c; }
.item.card::before { content: counter(c, decimal-leading-zero); font: 800 44px/1 var(--fd); color: var(--accent); }
.item .pic { display: none; }
.item small.cat { grid-column: 2; grid-row: 2; }
.item h3 { grid-column: 2; grid-row: 1; margin: 0; font-size: 28px; letter-spacing: -.03em; }
.item p { grid-column: 3; grid-row: 1 / 3; font: 400 17px/1.5 var(--ft); }
.item .row { grid-column: 4; grid-row: 1 / 3; flex-direction: column; align-items: flex-end; margin: 0; }
.item .tag { position: static; grid-column: 2; grid-row: 3; justify-self: start; border-radius: 4px; }
.testi li { border: 0; background: var(--accent-2); color: #fff; box-shadow: 0 18px 30px -22px rgba(0,0,0,.5); }
.testi li:nth-child(2n) { background: var(--accent); transform: rotate(1.4deg) translateY(14px); }
.testi li:nth-child(2n + 1) { transform: rotate(-1.2deg); }
.testi .who span, .testi .stars { color: inherit; opacity: .85; }
.testi blockquote { font: italic 400 20px/1.4 var(--ft); }
.thread { position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; overflow: visible; }
.thread path { fill: none; stroke: var(--accent); stroke-width: 2.5; vector-effect: non-scaling-stroke; opacity: .55; }
@media (max-width: 900px) { .item.card { grid-template-columns: 56px 1fr; } .item.card::before { font-size: 30px; } .item p, .item .row, .item small.cat, .item .tag { grid-column: 2; grid-row: auto; } .item .row { flex-direction: row; align-items: center; } }
`,
  js: `
(function () {
  const svg = document.querySelector(".thread"), p = svg && svg.querySelector("path"), main = document.getElementById("konten");
  if (!p || !main) return;
  main.style.position = "relative"; main.appendChild(svg);
  const L = p.getTotalLength(); p.style.strokeDasharray = L + " " + L;
  if (animated) G.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.8 } }); else p.style.strokeDashoffset = "0";
})();`,
};

/* -------------------------- 10. Arka Lensa ----------------------- */
const LENSA: BizLook = {
  name: "Kamar Gelap",
  font: ["Instrument Serif", "Courier Prime"],
  colors: ["#15110f", "#211a17", "#f0e8dc", "#bcae9d", "#e2493c", "#d9a441"],
  dark: true,
  round: 0,
  type: "Fotografer pernikahan & keluarga",
  tagline: "Tiga puluh enam frame per acara. Yang kami serahkan hanya yang membuatmu diam sebentar.",
  hint: "Gulir untuk memajukan film",
  kicks: { profil: "Frame 04", katalog: "Frame 09", keunggulan: "Frame 13", alur: "Frame 17", testimoni: "Frame 21", galeri: "Frame 24 · lembar kontak", harga: "Frame 28", lokasi: "Frame 31", faq: "Frame 33", kontak: "Frame 36" },
  nav: `<span class="frame" aria-hidden="true">&#9656; <b data-frame>01</b>/36</span>`,
  fixed: `<div class="safelight" aria-hidden="true"></div>`,
  css: `
h1, h2 { font-weight: 400; letter-spacing: -.01em; line-height: 1; }
.hero h1 { font-size: clamp(46px, 6vw, 96px); }
h2 { font-size: clamp(36px, 4.4vw, 64px); }
h2 em, .hero h1 { font-style: italic; }
.kick, .btn, .tab, .frame, .item small.cat, .price { font-family: var(--ft); }
.kick { color: var(--accent-2); letter-spacing: .12em; }
.kick::before { content: "KODAK 400  \\25B8  "; white-space: pre; opacity: .6; }
.btn { border-radius: 0; text-transform: uppercase; letter-spacing: .1em; font-size: 13px; }
.card { --ink: #1c1714; --soft: #574d44; --line: rgba(28,23,20,.18); border: 0; background: #f2ece2; color: var(--ink); padding: 14px 14px 18px; box-shadow: 0 20px 40px -24px #000; }
.card .price, .card .kick { --accent: #a8281e; }
.btn:not(.ghost), .plan .badge, .steps li::before { color: #15110f; }
.form input, .form select, .form textarea { background: #fffaf2; }
.card .price, .plan .amount { color: #1c1714; }
.plan .btn.ghost { color: #1c1714; box-shadow: inset 0 0 0 1.5px #1c1714; }
.plan.hot { border: 0; outline: 3px solid var(--accent); }
.item .pic { border-radius: 0; background: linear-gradient(160deg, #3a2f29, #15110f); color: #f0e8dc; }
.gal { gap: 0; padding: 26px 18px; background: #0b0908; border-block: 18px solid #0b0908; -webkit-mask: none; position: relative; }
.gal::before, .gal::after { content: ""; position: absolute; left: 0; right: 0; height: 12px; background: repeating-linear-gradient(90deg, transparent 0 10px, #2b231f 10px 22px, transparent 22px 30px); }
.gal::before { top: -15px; } .gal::after { bottom: -15px; }
.gal li { border-radius: 0; margin: 0 4px; filter: grayscale(.3) contrast(1.05); }
.gal li:nth-child(1) { grid-row: auto; aspect-ratio: 4 / 3; }
.gal figcaption { border-radius: 0; background: none; color: var(--accent-2); font-family: var(--ft); font-size: 12px; }
.frame { margin-right: 10px; font-size: 13px; color: var(--accent-2); white-space: nowrap; }
.safelight { position: fixed; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(80% 70% at 50% 40%, #b3261e, #3a0a07); mix-blend-mode: multiply; opacity: 0; }
.testi blockquote { font: italic 400 22px/1.35 var(--fd); }
@media (max-width: 900px) { .frame { display: none; } }
`,
  js: `
(function () {
  const f = document.querySelector("[data-frame]"), gal = document.getElementById("galeri");
  if (f && animated) ST.create({ start: 0, end: "max", scrub: true, onUpdate: (st) => { f.textContent = String(1 + Math.round(st.progress * 35)).padStart(2, "0"); } });
  if (gal && animated) {
    G.fromTo(".safelight", { opacity: 0 }, { opacity: 0.55, ease: "none", scrollTrigger: { trigger: gal, start: "top 85%", end: "top 30%", scrub: true } });
    G.fromTo(".safelight", { opacity: 0.55 }, { opacity: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: gal, start: "bottom 70%", end: "bottom 20%", scrub: true } });
  }
})();`,
  pose: (k, p) => (k === "galeri" ? { ...p, o: 0.02, no: 0.02 } : p),
};

/** Identitas per id template. Template yang belum didesain ulang tetap memakai tampilan v23. */
export const BIZ_LOOKS: Record<string, BizLook> = {
  "biz-kopi-lereng-ijen": KOPI,
  "biz-roti-sobat-oven": ROTI,
  "biz-batik-canting-sari": BATIK,
  "biz-gerabah-kasongan-tanah": GERABAH,
  "biz-madu-hutan-sumbawa": MADU,
  "biz-servis-gawai-klinik": GAWAI,
  "biz-kasir-awan-saas": KASIR,
  "biz-akselerator-lepas-landas": ROKET,
  "biz-agensi-ruang-ide": IDE,
  "biz-fotografer-arka-lensa": LENSA,
};
