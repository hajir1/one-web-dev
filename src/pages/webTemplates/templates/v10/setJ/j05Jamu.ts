import { box, btn, contentJ, footer, form, fx, grid, H, header, home, Lbl, line, lookJ, pg, pic, product3, sec, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 05 · Jamu Bakul: jamu kaleng. Ide besar: bakul jamu gendong diganti kaleng; tiap varian satu pita warna selebar layar (scale). */

const C = { kunyit: "#E8A317", kencur: "#F4ECD6", sirih: "#3F6B3A", aren: "#6B3E26", jahe: "#B8432F", hitam: "#1d1712" };
export const L05 = lookJ({ ink: C.hitam, muted: "#4f4237", primary: C.jahe, primaryDark: "#8e3020", soft: "#f1dfb7", line: C.hitam, bg: C.kencur, head: "Bricolage Grotesque", body: "Spectral", r: 999 });
const L = L05;

const VARIANTS: { name: B; bg: string; ink: string; sub: string; taste: B; parts: B; kcal: string; art: string }[] = [
  { name: ["Kunyit Asam", "Turmeric Tamarind"], bg: C.kunyit, ink: C.hitam, sub: "#3b2a12", taste: ["Asam segar, sedikit pahit di ujung lidah.", "Fresh and sour, a little bitter at the finish."], parts: ["Kunyit 18%, asam jawa 9%, gula aren 6%, air", "Turmeric 18%, tamarind 9%, palm sugar 6%, water"], kcal: "62", art: "kunyit" },
  { name: ["Beras Kencur", "Rice & Galangal"], bg: "#efe0bd", ink: C.hitam, sub: "#4f4237", taste: ["Lembut, wangi, agak pedas hangat.", "Soft, fragrant, gently warming."], parts: ["Beras sangrai 12%, kencur 8%, jahe 2%, gula aren 6%, air", "Roasted rice 12%, galangal 8%, ginger 2%, palm sugar 6%, water"], kcal: "74", art: "kencur" },
  { name: ["Temulawak", "Java Ginger"], bg: C.sirih, ink: C.kencur, sub: "#e3dcc6", taste: ["Pahit tegas, aroma tanah, nendang.", "Firmly bitter, earthy, with a kick."], parts: ["Temulawak 16%, kayu manis 1%, madu 4%, air", "Java ginger 16%, cinnamon 1%, honey 4%, water"], kcal: "48", art: "temulawak" },
];

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "JAMU BAKUL", { bg: C.kencur, ink: C.hitam, hover: C.jahe, upper: true, cta: [t(["Beli satu krat", "Buy a crate"]), href("beli")], btn: { bg: C.hitam, radius: 999 }, css: `border-bottom: 4px solid ${C.hitam};`, logoSize: 24 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Jamu Bakul", {
    bg: C.aren,
    ink: C.kencur,
    muted: "#e0c9a8",
    big: t(["Kocok dulu, baru diminum.", "Shake it, then drink it."]),
    about: t(["Jamu siap minum dari resep Mbah Sumi, Sukoharjo. Nomor izin edar dicantumkan di kaleng.", "Ready-to-drink jamu from Mbah Sumi's recipe, Sukoharjo. Licence number printed on every can."]),
    cols: [
      { title: t(["Dapur", "Kitchen"]), items: ["Jl. Jamu Gendong 7, Nguter", "Sukoharjo, Jawa Tengah"] },
      { title: t(["Pesan", "Order"]), items: ["0857-2600-1931", "halo@jamubakul.id", "@jamubakul"] },
    ],
    copy: t(["© 2026 Jamu Bakul. Konten contoh.", "© 2026 Jamu Bakul. Sample content."]),
  });
}

/** Pita varian selebar layar: nama raksasa + rasa + komposisi + gambar cukil. */
function band(j: J, v: (typeof VARIANTS)[number], i: number): BoxNode {
  const { t } = j;
  const txt = box(
    [
      Lbl(L, `0${i + 1} / 03`, v.sub),
      H(L, t(v.name), "h2", { size: 84, color: v.ink, lh: 0.95, spacing: -2, weight: 800 }),
      Tx(L, t(v.taste), { size: 22, color: v.ink, css: "font-style: italic;" }),
      fx(box([Tx(L, t(v.parts), { size: 15, color: v.sub }), Tx(L, `${v.kcal} kkal / 250 ml`, { size: 15, color: v.sub, weight: 600 })], { gap: 6, name: "Komposisi" }), "rise", 24),
    ],
    { gap: 14, name: "Teks varian" },
  );
  const img = box([fx(pic(j.img(v.art), t(v.name), { ratio: "1 / 1", radius: 999 }), "scale", 18)], { name: "Gambar bahan" });
  return sec(`Pita ${v.name[0]}`, [grid(i % 2 ? [img, txt] : [txt, img], i % 2 ? "minmax(0, .8fr) minmax(0, 1.2fr)" : "minmax(0, 1.2fr) minmax(0, .8fr)", { gap: 48, align: "center" })], { bg: v.bg, padY: 88, css: `border-top: 4px solid ${C.hitam};` });
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const hero = sec(
    "Hero kaleng",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["Baru · 250 ml · Sukoharjo", "New · 250 ml · Sukoharjo"]), C.jahe),
              fx(H(L, t(["Jamu gendong, sekarang muat di tas.", "Jamu gendong, now fits in your bag."]), "h1", { size: 80, lh: 0.95, spacing: -3, weight: 800 }), "split", 60),
              Tx(L, t(["Kunyit asam, beras kencur, dan temulawak dari resep Mbah Sumi di Sukoharjo. Tanpa pengawet dan pemanis buatan, tahan tiga bulan di kulkas.", "Turmeric tamarind, rice & galangal, and Java ginger from Mbah Sumi's recipe in Sukoharjo. No preservatives or artificial sweeteners; keeps three months in the fridge."]), { size: 20, color: "#3a2f26", css: "max-width: 40ch;" }),
              line([btn(L, t(["Pilih varian", "Choose a flavour"]), href("varian"), { bg: C.jahe }), btn(L, t(["Beli satu krat (24)", "Buy a crate (24)"]), href("beli"), { bg: "transparent", fg: C.hitam, border: C.hitam })], { gap: 12, wrap: true, stack: false }),
            ],
            { gap: 22, name: "Teks hero" },
          ),
          box([product3({ model: "can", finish: "glossy", color: C.kunyit, accent: C.jahe, h: 560, mh: 380, alt: t(["Kaleng Jamu Bakul 3D berputar", "Rotating 3D Jamu Bakul can"]) })], { name: "Kaleng", bg: C.kunyit, css: `border: 4px solid ${C.hitam}; border-radius: 280px 280px 24px 24px; overflow: hidden;` }),
        ],
        "minmax(0, 1.1fr) minmax(0, .9fr)",
        { gap: 48, align: "center" },
      ),
    ],
    { bg: C.kencur, padY: 64 },
  );
  const parts = [t(["kunyit", "turmeric"]), t(["asam jawa", "tamarind"]), t(["beras sangrai", "roasted rice"]), t(["kencur", "galangal"]), t(["temulawak", "Java ginger"]), t(["gula aren", "palm sugar"]), t(["kayu manis", "cinnamon"]), t(["jahe", "ginger"])];
  const strip = sec("Pita bahan", [fx(line(parts.map((p) => H(L, `${p} ·`, "h3", { size: 34, color: C.kencur, full: false, weight: 800, css: "white-space: nowrap;" })), { gap: 30, stack: false, name: "Bahan" }), "marquee", 30)], { bg: C.hitam, padY: 18, width: 1600, css: "overflow: hidden;" });
  const why = sec(
    "Mengapa kaleng",
    [
      grid(
        [
          box([H(L, t(["Mbah Sumi menggendong jamu 41 tahun. Cucunya memilih kaleng.", "Mbah Sumi carried jamu for 41 years. Her grandson chose cans."]), "h2", { size: 44, lh: 1.02, weight: 800 })], { name: "Judul" }),
          fx(
            box(
              ([[["Kaleng menahan cahaya", "Cans block light"], ["Kurkumin di kunyit cepat pudar kena cahaya. Di botol bening, warnanya hilang dalam seminggu.", "Curcumin fades quickly in light. In clear bottles the colour is gone within a week."]], [["Dipasteurisasi, bukan diawetkan", "Pasteurised, not preserved"], ["Dipanaskan 85°C selama 15 detik, lalu langsung didinginkan. Tanpa natrium benzoat.", "Heated to 85°C for 15 seconds, then chilled at once. No sodium benzoate."]], [["Kalengnya bisa didaur ulang", "The can is recyclable"], ["Kumpulkan 24 kaleng kosong, tukar dengan satu kaleng baru di agen kami.", "Return 24 empties and get a fresh can from our stockists."]]] as [B, B][]).map(([h, x], i) =>
                line([H(L, String(i + 1), "h3", { size: 44, color: C.jahe, full: false, weight: 800, css: "width: 48px;" }), box([H(L, t(h), "h3", { size: 24, weight: 700 }), Tx(L, t(x), { size: 17 })], { gap: 4, name: "Isi" })], { gap: 18, stack: false, name: "Alasan" }),
              ),
              { gap: 26, name: "Alasan" },
            ),
            "rise",
          ),
        ],
        2,
        { gap: 56, align: "start" },
      ),
    ],
    { bg: C.kencur, padY: 96 },
  );
  return [hero, strip, ...VARIANTS.map((v, i) => band(j, v, i)), why];
}

function pageHead(j: J, title: B, text: B, bg = C.kunyit): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [stack([fx(H(L, t(title), "h1", { size: 72, lh: 0.95, weight: 800, spacing: -2 }), "split"), Tx(L, t(text), { size: 19, color: "#3a2f26", css: "max-width: 54ch;" })], { gap: 14 })], { bg, padY: 72, css: `border-bottom: 4px solid ${C.hitam};` });
}

function varian(j: J): BoxNode[] {
  const { t } = j;
  const cell = (s: string, b = false) => box([Tx(L, s, { size: 16, weight: b ? 700 : 400, color: C.hitam })], { name: "Sel" });
  const cols = "minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))";
  const rowsData: [B, string, string, string][] = [
    [["Energi", "Energy"], "62 kkal", "74 kkal", "48 kkal"],
    [["Gula total", "Total sugar"], "9 g", "11 g", "6 g"],
    [["Kafein", "Caffeine"], "0", "0", "0"],
    [["Simpan", "Storage"], "≤ 8°C", "≤ 8°C", "≤ 8°C"],
  ];
  return [
    pageHead(j, ["Tiga rasa, satu bakul.", "Three flavours, one basket."], ["Bandingkan kandungan per kaleng 250 ml. Semua varian dibuat dari bahan segar, bukan bubuk instan.", "Compare per 250 ml can. Every flavour is made from fresh roots, not instant powder."]),
    sec(
      "Tabel kandungan",
      [
        box(
          [grid([cell(""), ...VARIANTS.map((v) => cell(t(v.name), true))], cols, { gap: 12 }), ...rowsData.map(([k, a, b, c]) => grid([cell(t(k), true), cell(a), cell(b), cell(c)], cols, { gap: 12, align: "center" }))],
          { gap: 0, name: "Tabel", css: `border: 4px solid ${C.hitam}; border-radius: 24px; padding: 6px 24px; & > * { border-bottom: 2px solid ${C.hitam}; padding: 14px 0; } & > *:last-child { border-bottom: 0; }` },
        ),
      ],
      { bg: C.kencur, padY: 80 },
    ),
    ...VARIANTS.map((v, i) => band(j, v, i)),
  ];
}

function beli(j: J): BoxNode[] {
  const { t } = j;
  const shops: [string, B][] = [
    ["Solo", ["Pasar Gede (los jamu), Toko Sumber Waras", "Gede Market (jamu stalls), Sumber Waras shop"]],
    ["Yogyakarta", ["Kedai Laras, Jl. Prawirotaman", "Kedai Laras, Prawirotaman St."]],
    ["Semarang", ["Swalayan Sehat Selalu, Banyumanik", "Sehat Selalu supermarket, Banyumanik"]],
    ["Jakarta", ["Pesan online, kirim dingin 2 hari", "Order online, chilled delivery in 2 days"]],
  ];
  return [
    pageHead(j, ["Beli per kaleng atau per krat.", "Buy by the can or the crate."], ["Satu krat isi 24 kaleng campur. Pengiriman dingin untuk Jawa, Bali, dan Lampung.", "A crate holds 24 mixed cans. Chilled delivery across Java, Bali and Lampung."], C.jahe),
    sec(
      "Agen & pesan",
      [
        grid(
          [
            fx(box(shops.map(([c, s]) => box([H(L, c, "h3", { size: 28, weight: 800 }), Tx(L, t(s), { size: 16 })], { gap: 2, name: "Agen", css: `border-bottom: 2px solid ${C.hitam}; padding-bottom: 14px;` })), { gap: 16, name: "Daftar agen" }), "rise"),
            form(
              L,
              [
                { kind: "input", label: t(["Nama", "Name"]), ph: "Sari" },
                { kind: "input", label: "WhatsApp", ph: "0857…", type: "tel" },
                { kind: "select", label: t(["Isi krat", "Crate mix"]), ph: t(["Pilih", "Choose"]), options: [t(["Campur 8-8-8", "Mixed 8-8-8"]), t(["Kunyit Asam semua", "All Turmeric Tamarind"]), t(["Beras Kencur semua", "All Rice & Galangal"]), t(["Temulawak semua", "All Java Ginger"])] },
                { kind: "input", label: t(["Kota tujuan", "City"]), ph: "Bandung" },
              ],
              t(["Pesan via WhatsApp", "Order via WhatsApp"]),
              { btn: { bg: C.hitam, radius: 999 }, radius: 14, bg: "#ffffff", css: `border: 4px solid ${C.hitam}; border-radius: 24px; padding: 26px;` },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.kencur, padY: 80 },
    ),
  ];
}

export const j05 = contentJ({
  id: "j3d-jamu-bakul",
  brand: "Jamu Bakul",
  L,
  pages: [home(), pg("varian", ["varian", "Varian"], ["flavours", "Flavours"]), pg("beli", ["beli", "Beli"], ["buy", "Buy"])],
  head,
  foot,
  build: { home: homePage, varian, beli },
});
