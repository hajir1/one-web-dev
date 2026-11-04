import { box, btn, contentJ, el, footer, form, fx, grid, H, header, home, Lbl, line, lookJ, pg, pic, sec, stack, tilt, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 10 · Petak Sembilan: a Kotagede cement tile maker. Big idea: the site = a tiled floor; every part follows the tile module, and tile samples can be tilted. */

const C = { semen: "#A7A39A", oker: "#A8442E", hitam: "#1E1E1C", kunyit: "#D8A13A", kapur: "#EFEBE3" };
export const L10 = lookJ({ ink: C.hitam, muted: "#45433f", primary: C.oker, primaryDark: "#82321f", soft: "#dcd6cb", line: C.hitam, bg: C.kapur, head: "Unbounded", body: "Rethink Sans", r: 0 });
const L = L10;

const MOTIF: { key: string; code: string; name: B }[] = [
  { key: "kawung", code: "PS-01", name: ["Kawung", "Kawung"] },
  { key: "bintang", code: "PS-02", name: ["Bintang Malam", "Night Star"] },
  { key: "kipas", code: "PS-03", name: ["Kipas", "Fan"] },
  { key: "belah", code: "PS-04", name: ["Belah Ketupat", "Diamond"] },
  { key: "daun", code: "PS-05", name: ["Daun Sirih", "Betel Leaf"] },
  { key: "roda", code: "PS-06", name: ["Roda Pedati", "Cartwheel"] },
  { key: "catur", code: "PS-07", name: ["Papan Catur", "Chequer"] },
  { key: "sulur", code: "PS-08", name: ["Sulur", "Tendril"] },
  { key: "polos", code: "PS-09", name: ["Oker Polos", "Plain Ochre"] },
];

/** Grout lines: each tile is separated by a 6px gap in dark cement color. */
const NAT = `background: #6f6b63; padding: 6px;`;

/** A tile piece that can be tilted. */
const keping = (j: J, m: (typeof MOTIF)[number], max = 14) => tilt(box([pic(j.img(m.key), `${j.t(["Tegel motif", "Tile pattern"])} ${j.t(m.name)}`, { ratio: "1 / 1", radius: 0 })], { name: `Tegel ${m.code}` }), { max, scale: 1.04, glare: true });

/** A 3×3 grid that does not turn into a carousel on phones. */
function petak(cells: BoxNode[], cols: number, gap: number, mobile?: "two"): BoxNode {
  const g = grid(cells, cols, { gap });
  if (mobile) g.mobileGrid = mobile;
  else g.stackOnMobile = false;
  return g;
}

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "PETAK SEMBILAN", { bg: C.kapur, ink: C.hitam, hover: "#82321f", tag: t(["Tegel semen cetak tangan · Kotagede", "Hand-pressed cement tiles · Kotagede"]), cta: [t(["Minta sampel", "Request samples"]), href("pesan")], btn: { bg: C.hitam, radius: 0 }, css: `border-bottom: 6px solid ${C.hitam};`, logoSize: 20 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Petak Sembilan", {
    bg: C.hitam,
    ink: C.kapur,
    muted: "#c4bfb5",
    big: t(["Diinjak lima puluh tahun lagi.", "Walked on for another fifty years."]),
    about: t(["Pabrik tegel kecil keluarga Hadi di Kotagede. Tiga pres besi, tujuh pencetak, dan satu halaman jemur.", "The Hadi family's small tile works in Kotagede. Three iron presses, seven makers, and one drying yard."]),
    cols: [
      { title: t(["Pabrik", "Works"]), items: ["Jl. Karanglo 12", "Kotagede, Yogyakarta"] },
      { title: t(["Pesan", "Order"]), items: ["0274-370-919", "tegel@petaksembilan.id"] },
    ],
    copy: t(["© 2026 Petak Sembilan. Konten contoh.", "© 2026 Petak Sembilan. Sample content."]),
  });
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const hero = sec(
    "Petak sembilan",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["40 motif · 20 × 20 × 1,6 cm", "40 patterns · 20 × 20 × 1.6 cm"]), C.oker, { size: 13 }),
              fx(H(L, t(["Lantai yang dicetak satu per satu.", "Floors pressed one tile at a time."]), "h1", { size: 64, lh: 1.02, weight: 800, spacing: -1 }), "rise", 40),
              Tx(L, t(["Tegel semen motif dari Kotagede, dicetak tangan dengan pres besi tahun 1950-an. 40 motif siap kirim, atau kirim gambar Anda sendiri.", "Patterned cement tiles from Kotagede, hand-pressed on 1950s iron presses. 40 patterns ready to ship, or send us your own drawing."]), { size: 19, css: "max-width: 42ch;" }),
              line([btn(L, t(["Minta 3 sampel gratis", "Request 3 free samples"]), href("pesan"), { bg: C.oker, radius: 0 }), btn(L, t(["Lihat 40 motif", "See all 40 patterns"]), href("motif"), { bg: "transparent", fg: C.hitam, border: C.hitam, radius: 0 })], { gap: 12, wrap: true, stack: false }),
              Tx(L, t(["Arahkan kursor ke tegel untuk memiringkannya.", "Hover a tile to tilt it."]), { size: 13, color: "#45433f" }),
            ],
            { gap: 22, name: "Teks hero" },
          ),
          box([petak(MOTIF.map((m, i) => fx(keping(j, m), "rise", 24, (i % 3) * 90 + Math.floor(i / 3) * 90)), 3, 6)], { name: "Petak 3×3", css: NAT }),
        ],
        "minmax(0, 1fr) minmax(0, 1fr)",
        { gap: 56, align: "center" },
      ),
    ],
    { bg: C.kapur, padY: 72 },
  );
  const spec = sec(
    "Spesifikasi",
    [
      petak(
        ([["20 × 20", ["cm per keping", "cm per tile"]], ["25", ["keping per meter persegi", "tiles per square metre"]], ["3 ton", ["tekanan pres per keping", "press force per tile"]], ["28", ["hari dijemur sebelum dikirim", "days curing before shipping"]]] as [string, B][]).map(([n, l], i) =>
          box([H(L, n, "h2", { size: 40, color: i % 2 ? C.hitam : C.kapur, weight: 800 }), Tx(L, t(l), { size: 15, color: i % 2 ? C.hitam : C.kapur })], { gap: 6, name: "Angka", bg: i % 2 ? C.kunyit : C.hitam, css: "padding: 28px; aspect-ratio: 1 / 1; justify-content: end; @media (max-width: 640px) { & { padding: 16px; } }" }),
        ),
        4,
        6,
        "two",
      ),
    ],
    { bg: "#6f6b63", padY: 6, width: 1600 },
  );
  const steps: [B, B][] = [
    [["Warna dituang ke sekat", "Colour poured into the divider"], ["Adonan semen putih, pasir halus, dan oksida dituang ke sekat kuningan yang membentuk motif.", "White cement, fine sand and oxide poured into the brass divider that forms the pattern."]],
    [["Semen kering di atasnya", "Dry cement on top"], ["Sekat diangkat, lalu lapisan semen abu kering ditabur untuk menyerap air dari lapisan warna.", "The divider is lifted and a dry grey layer is sifted on to draw water from the colour coat."]],
    [["Dipres tiga ton", "Pressed at three tonnes"], ["Tuas pres diputar dua orang. Tidak ada mesin hidrolik, hanya ulir besi.", "Two people turn the press arm. No hydraulics, just an iron screw."]],
    [["Direndam, lalu dijemur", "Soaked, then cured"], ["Semalam di bak air, lalu 28 hari di rak teduh supaya tidak retak rambut.", "A night in a water tank, then 28 days on shaded racks so hairline cracks don't form."]],
  ];
  const how = sec(
    "Cara mencetak",
    [
      grid(
        [
          box([fx(pic(j.img("pres"), t(["Pres besi tua dengan cetakan kuningan", "Old iron press with brass mould"]), { ratio: "9 / 11", radius: 0 }), "mask")], { name: "Gambar pres", css: NAT }),
          box(
            [
              H(L, t(["Satu keping, empat langkah, tanpa jalan pintas.", "One tile, four steps, no shortcuts."]), "h2", { size: 40, lh: 1.08, weight: 800 }),
              ...steps.map(([h, x], i) =>
                fx(
                  line([H(L, `0${i + 1}`, "h3", { size: 22, color: C.kapur, full: false, weight: 800, css: `width: 56px; height: 56px; flex: 0 0 56px; display: grid; place-items: center; background: ${C.oker};` }), box([H(L, t(h), "h3", { size: 20, weight: 700, bodyFont: true }), Tx(L, t(x), { size: 16 })], { gap: 4, name: "Isi" })], { gap: 18, align: "start", stack: false, name: "Langkah" }),
                  "rise",
                  24,
                  i * 90,
                ),
              ),
            ],
            { gap: 24, name: "Langkah" },
          ),
        ],
        "minmax(0, .8fr) minmax(0, 1.2fr)",
        { gap: 56, align: "start" },
      ),
    ],
    { bg: C.kapur, padY: 96 },
  );
  return [hero, spec, how];
}

function pageHead(j: J, title: B, text: B): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [stack([fx(H(L, t(title), "h1", { size: 56, lh: 1.04, weight: 800, color: C.kapur }), "rise"), Tx(L, t(text), { size: 18, color: C.kapur, css: "max-width: 56ch;" })], { gap: 14 })], { bg: C.hitam, padY: 72 });
}

function motif(j: J): BoxNode[] {
  const { t } = j;
  const card = (m: (typeof MOTIF)[number], i: number) =>
    fx(box([keping(j, m, 18), line([Lbl(L, m.code, C.oker), H(L, t(m.name), "h3", { size: 16, weight: 700, full: false })], { justify: "between", stack: false, wrap: true })], { gap: 10, name: "Kartu motif", bg: C.kapur, css: "padding: 12px;" }), "rise", 24, (i % 3) * 80);
  return [
    pageHead(j, ["Sembilan dari empat puluh motif", "Nine of our forty patterns"], ["Semua motif tersedia dalam ukuran 20 × 20 cm. Warna bisa ditukar dari palet 12 oksida kami tanpa biaya tambahan.", "Every pattern comes in 20 × 20 cm. Colours can be swapped from our 12-oxide palette at no extra cost."]),
    sec("Katalog", [box([petak(MOTIF.map(card), 3, 6)], { name: "Lantai katalog", css: NAT })], { bg: C.kapur, padY: 64 }),
    sec(
      "Motif sendiri",
      [
        grid(
          [
            box([H(L, t(["Punya gambar sendiri?", "Got your own drawing?"]), "h2", { size: 40, weight: 800 })], { name: "Judul" }),
            box(
              [
                Tx(L, t(["Kirim sketsa atau foto tegel lama Anda. Kami buatkan sekat kuningan baru (Rp2.400.000, sekali bayar) dan tiga sampel dalam dua minggu. Minimal pesanan 10 m².", "Send a sketch or a photo of your old tiles. We make a new brass divider (Rp2,400,000, one-off) and three samples within two weeks. Minimum order 10 m²."]), { size: 18, color: C.hitam }),
                Tx(L, t(["Tegel motif standar: Rp18.500 per keping. Tegel polos: Rp11.000 per keping.", "Standard patterned tiles: Rp18,500 each. Plain tiles: Rp11,000 each."]), { size: 16, weight: 700, color: C.hitam }),
              ],
              { gap: 12, name: "Teks" },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.kunyit, padY: 72 },
    ),
    sec(
      "Perbandingan",
      [
        box(
          [
            H(L, t(["Tegel semen atau keramik pabrik?", "Cement tile or factory ceramic?"]), "h2", { size: 36, weight: 800 }),
            fx(
              el(
                "comparison-table",
                {
                  columns: [t(["Tegel semen", "Cement tile"]), t(["Keramik pabrik", "Factory ceramic"])],
                  rows: [
                    t(["Motif tembus sampai 4 mm | ya | tidak, hanya di permukaan", "Pattern goes 4 mm deep | yes | no, surface only"]),
                    t(["Bisa dipoles ulang | ya | tidak", "Can be re-polished | yes | no"]),
                    t(["Terasa dingin di kaki | ya | sedang", "Cool underfoot | yes | somewhat"]),
                    t(["Perawatan | lilin tiap 6 bulan | cukup dipel", "Care | wax every 6 months | just mop"]),
                    t(["Harga per m² | Rp462.500 | mulai Rp90.000", "Price per m² | Rp462,500 | from Rp90,000"]),
                  ],
                  highlight: 1,
                  caption: t(["Kami jujur: keramik lebih murah dan lebih mudah dirawat.", "To be fair: ceramic is cheaper and easier to look after."]),
                  accentColor: C.oker,
                },
                "Tabel Perbandingan",
              ),
              "rise",
            ),
          ],
          { gap: 24, name: "Isi perbandingan" },
        ),
      ],
      { bg: C.kapur, padY: 80, width: 960 },
    ),
  ];
}

function pesan(j: J): BoxNode[] {
  const { t } = j;
  return [
    pageHead(j, ["Minta sampel atau penawaran", "Request samples or a quote"], ["Tiga sampel pertama gratis, Anda cukup bayar ongkir. Penawaran lengkap kami kirim dalam dua hari kerja.", "Your first three samples are free; you only pay shipping. A full quote follows within two working days."]),
    sec(
      "Formulir",
      [
        grid(
          [
            form(
              L,
              [
                { kind: "input", label: t(["Nama", "Name"]), ph: "Bu Laksmi" },
                { kind: "input", label: "WhatsApp", ph: "0812…", type: "tel" },
                { kind: "select", label: t(["Motif utama", "Main pattern"]), ph: t(["Pilih", "Choose"]), options: MOTIF.map((m) => `${m.code} ${t(m.name)}`) },
                { kind: "input", label: t(["Luas lantai (m²)", "Floor area (m²)"]), ph: "24", type: "number" },
                { kind: "input", label: t(["Kota proyek", "Project city"]), ph: "Magelang" },
              ],
              t(["Kirim permintaan", "Send request"]),
              { btn: { bg: C.oker, radius: 0 }, radius: 0, bg: "#ffffff", css: `border: 6px solid ${C.hitam}; padding: 28px;` },
            ),
            box(
              [
                H(L, t(["Hitungan cepat", "Quick maths"]), "h2", { size: 32, weight: 800 }),
                Tx(L, t(["Satu meter persegi = 25 keping. Tambahkan 8% untuk potongan di tepi ruangan.", "One square metre = 25 tiles. Add 8% for cuts at the room edges."]), { size: 17 }),
                Tx(L, t(["Contoh: kamar 3 × 4 m = 12 m² → 300 keping + 24 cadangan = 324 keping.", "Example: a 3 × 4 m room = 12 m² → 300 tiles + 24 spare = 324 tiles."]), { size: 17, weight: 700, color: C.hitam }),
                box([pic(j.img("catur"), t(["Tegel motif Papan Catur", "Chequer pattern tile"]), { ratio: "1 / 1", radius: 0 })], { name: "Sampel", css: `${NAT} max-width: 220px;` }),
              ],
              { gap: 14, name: "Hitungan" },
            ),
          ],
          "minmax(0, 1.1fr) minmax(0, .9fr)",
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.kapur, padY: 72 },
    ),
  ];
}

export const j10 = contentJ({
  id: "j3d-petak-sembilan",
  brand: "Petak Sembilan",
  L,
  pages: [home(), pg("motif", ["motif", "Motif"], ["patterns", "Patterns"]), pg("pesan", ["pesan", "Pesan"], ["order", "Order"])],
  head,
  foot,
  build: { home: homePage, motif, pesan },
});
