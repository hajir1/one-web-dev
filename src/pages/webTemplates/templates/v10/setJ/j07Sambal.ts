import { box, btn, contentJ, footer, form, fx, grid, H, header, home, Lbl, line, lookJ, pg, pic, product3, sec, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 07 · Sambal Bu Rum: sambal rumahan dalam jar. Ide besar: situs = papan nama warung yang dicat tangan; menu = papan harga kapur. */

const C = { cabai: "#C8241B", terasi: "#F2B705", daun: "#2F5D3A", kertas: "#FFF8EC", arang: "#1A1A1A" };
export const L07 = lookJ({ ink: C.arang, muted: "#3d3632", primary: C.cabai, primaryDark: "#9a1b13", soft: "#fbe7b0", line: C.arang, bg: C.kertas, head: "Dela Gothic One", body: "Zilla Slab", r: 6 });
const L = L07;

/** Huruf papan: kertas di atas merah, bayangan arang seperti cat dua lapis. */
const PAINT = `text-shadow: 4px 4px 0 ${C.arang};`;
const PLANK = `border: 6px solid ${C.arang}; border-radius: 6px; box-shadow: 8px 8px 0 ${C.arang};`;

const SAMBAL: { name: B; level: number; note: B; price: string; size: string }[] = [
  { name: ["Sambal Bawang", "Shallot Sambal"], level: 3, note: ["Bawang merah goreng, cabai keriting, minyak kelapa. Paling laku.", "Fried shallots, curly chillies, coconut oil. Our best seller."], price: "Rp38.000", size: "200 g" },
  { name: ["Sambal Ijo", "Green Sambal"], level: 2, note: ["Cabai hijau dan tomat hijau ditumis, wangi daun jeruk.", "Sautéed green chillies and green tomatoes, lime-leaf scented."], price: "Rp36.000", size: "200 g" },
  { name: ["Sambal Terasi", "Shrimp-paste Sambal"], level: 4, note: ["Terasi Rembang dibakar dulu, baru diulek. Baunya jujur.", "Rembang shrimp paste toasted, then pounded. Honest smell."], price: "Rp38.000", size: "200 g" },
  { name: ["Sambal Cumi", "Squid Sambal"], level: 5, note: ["Cumi asin Juwana dipotong kecil. Isinya banyak, bukan hiasan.", "Salted Juwana squid, cut small. Plenty of it, not garnish."], price: "Rp52.000", size: "200 g" },
];

/** Batang level pedas: lima kotak, terisi sesuai level. Tanpa ikon. */
function heat(level: number, on: string, off: string): BoxNode {
  return box(
    [Lbl(L, `Pedas ${level}/5`, on, { size: 12 }), line(Array.from({ length: 5 }, (_, i) => box([], { name: "Kotak", css: `width: 18px; height: 12px; border: 2px solid ${on}; ${i < level ? `background: ${on};` : `background: ${off};`}` })), { gap: 4, stack: false, name: "Batang" })],
    { gap: 6, name: "Level pedas" },
  );
}

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "SAMBAL BU RUM", { bg: C.kertas, ink: C.arang, hover: "#9a1b13", tag: t(["Ulekan tangan · Pati", "Hand-pounded · Pati"]), cta: [t(["Pesan jar", "Order a jar"]), href("pesan")], btn: { bg: C.cabai, radius: 6 }, css: `border-bottom: 6px solid ${C.arang};`, logoSize: 22 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Sambal Bu Rum", {
    bg: C.arang,
    ink: C.kertas,
    muted: "#d9cfc0",
    big: t(["Habis? Pesan lagi Senin.", "Ran out? Order again Monday."]),
    about: t(["Sambal rumahan Bu Rumiyati, dimasak di dapur belakang rumah di Pati sejak 1998. Nomor PIRT tercantum di label jar.", "Home-made sambal by Bu Rumiyati, cooked in her back kitchen in Pati since 1998. Home-industry licence printed on every jar."]),
    cols: [
      { title: t(["Dapur", "Kitchen"]), items: ["Jl. Kol. Sunandar 41", "Pati, Jawa Tengah"] },
      { title: t(["Pesan", "Order"]), items: ["0813-2580-4419", "@sambalburum"] },
    ],
    copy: t(["© 2026 Sambal Bu Rum. Konten contoh.", "© 2026 Sambal Bu Rum. Sample content."]),
  });
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  // Papan nama selebar layar, di atas "etalase".
  const sign = sec(
    "Papan nama",
    [
        box(
          [
            line([Lbl(L, t(["Sejak 1998", "Since 1998"]), C.kertas, { size: 14, full: false }), Lbl(L, t(["Masak Senin & Kamis", "Cooked Mon & Thu"]), C.kertas, { size: 14, full: false })], { justify: "between", stack: false, wrap: true }),
            H(L, t(["Sambal Bu Rum", "Sambal Bu Rum"]), "h2", { size: 120, color: C.kertas, lh: 0.95, upper: true, css: `${PAINT} @media (max-width: 520px) { & { font-size: 12vw; } }` }),
            Tx(L, t(["Bawang · Ijo · Terasi · Cumi", "Shallot · Green · Shrimp paste · Squid"]), { size: 22, color: C.kertas, weight: 700 }),
          ],
          { gap: 10, name: "Papan", bg: C.cabai, css: `${PLANK} padding: 26px 36px; @media (max-width: 520px) { & { padding: 20px; } }` },
        ),
    ],
    { bg: C.kertas, padY: 40 },
  );
  const hero = sec(
    "Etalase",
    [
      grid(
        [
          box([product3({ model: "jar", finish: "glossy", color: C.cabai, accent: C.terasi, h: 520, mh: 340, alt: t(["Jar Sambal Bu Rum 3D berputar", "Rotating 3D Sambal Bu Rum jar"]) })], { name: "Jar", bg: C.terasi, css: `${PLANK}` }),
          box(
            [
              fx(H(L, t(["Pedasnya jujur, ulekannya tangan.", "Honest heat, pounded by hand."]), "h1", { size: 64, lh: 1.02 }), "split", 50),
              Tx(L, t(["Sambal bawang, ijo, terasi, dan cumi buatan Bu Rum di Pati. Dimasak tiap Senin dan Kamis, dikirim ke seluruh Jawa dalam jar kaca.", "Shallot, green, shrimp-paste and squid sambal made by Bu Rum in Pati. Cooked every Monday and Thursday, shipped across Java in glass jars."]), { size: 20, color: "#3d3632", css: "max-width: 42ch;" }),
              line([btn(L, t(["Pesan lewat WhatsApp", "Order on WhatsApp"]), href("pesan"), { bg: C.cabai, radius: 6, css: `border: 3px solid ${C.arang}; box-shadow: 4px 4px 0 ${C.arang};` }), btn(L, t(["Lihat papan menu", "See the menu board"]), href("menu"), { bg: "transparent", fg: C.arang, border: C.arang, radius: 6 })], { gap: 14, wrap: true, stack: false }),
            ],
            { gap: 22, name: "Teks hero" },
          ),
        ],
        "minmax(0, .9fr) minmax(0, 1.1fr)",
        { gap: 56, align: "center" },
      ),
    ],
    { bg: C.kertas, padY: 48 },
  );
  const words: B[] = [["dimasak Senin", "cooked Monday"], ["dimasak Kamis", "cooked Thursday"], ["tanpa pengawet", "no preservatives"], ["tanpa MSG", "no MSG"], ["minyak kelapa", "coconut oil"], ["terasi Rembang", "Rembang shrimp paste"], ["cumi Juwana", "Juwana squid"]];
  const strip = sec("Pita warung", [fx(line(words.map((w) => H(L, `${t(w)} ✕`, "h3", { size: 30, color: C.kertas, full: false, upper: true, css: "white-space: nowrap;" })), { gap: 28, stack: false, name: "Kata" }), "marquee", 26)], { bg: C.daun, padY: 16, width: 1600, css: `overflow: hidden; border-top: 6px solid ${C.arang}; border-bottom: 6px solid ${C.arang};` });
  // Papan menu kapur: tiap baris naik satu per satu.
  const row = (s: (typeof SAMBAL)[number], i: number) =>
    fx(
      grid(
        [
          box([H(L, t(s.name), "h3", { size: 30, color: C.kertas }), Tx(L, t(s.note), { size: 16, color: "#e4ddd0" })], { gap: 6, name: "Nama" }),
          heat(s.level, C.terasi, "transparent"),
          box([H(L, s.price, "h3", { size: 28, color: C.terasi, full: false }), Tx(L, s.size, { size: 14, color: "#e4ddd0", full: false })], { gap: 2, name: "Harga" }),
        ],
        "minmax(0, 1.6fr) minmax(0, .7fr) minmax(0, .6fr)",
        { gap: 28, align: "center" },
      ),
      "rise",
      32,
      i * 90,
    );
  const board = sec(
    "Papan menu",
    [
      box(
        [
          line([H(L, t(["Daftar harga", "Price list"]), "h2", { size: 52, color: C.kertas, upper: true, full: false }), Tx(L, t(["per jar kaca 200 g", "per 200 g glass jar"]), { size: 16, color: "#e4ddd0", full: false })], { justify: "between", align: "end", wrap: true, stack: false }),
          ...SAMBAL.map(row),
        ],
        { gap: 28, name: "Papan kapur", bg: C.arang, css: `${PLANK} padding: 40px; & > *:not(:first-child) { border-top: 2px dashed #6b6560; padding-top: 24px; }` },
      ),
    ],
    { bg: C.kertas, padY: 72 },
  );
  const num = (n: string, label: B) => box([fx(H(L, n, "h2", { size: 72, color: C.cabai, full: false }), "counter"), Tx(L, t(label), { size: 16, color: C.arang, weight: 600 })], { gap: 4, name: "Angka", css: `border-top: 6px solid ${C.arang}; padding-top: 14px;` });
  const nums = sec(
    "Angka dapur",
    [
      grid(
        [num("1.240", ["jar per minggu, semuanya diulek", "jars a week, every one pounded"]), num("38", ["kg cabai tiap hari masak", "kg of chillies each cooking day"]), num("27", ["tahun Bu Rum memegang ulekan", "years Bu Rum has held the pestle"])],
        3,
        { gap: 36 },
      ),
    ],
    { bg: C.terasi, padY: 72, css: `border-top: 6px solid ${C.arang}; border-bottom: 6px solid ${C.arang};` },
  );
  const ulek = sec(
    "Ulekan",
    [
      grid(
        [
          box([fx(pic(j.img("cobek"), t(["Cobek batu dengan sambal merah dan ulekan", "Stone mortar with red sambal and pestle"]), { ratio: "4 / 5", radius: 6, css: PLANK }), "mask")], { name: "Gambar cobek" }),
          box(
            [
              Lbl(L, t(["Kenapa tidak diblender", "Why no blender"]), C.cabai),
              H(L, t(["Blender memotong. Ulekan memeras.", "A blender cuts. A pestle squeezes."]), "h2", { size: 46, lh: 1.05 }),
              Tx(L, t(["Cabai yang diulek pecah seratnya, minyaknya keluar, dan rasanya menyatu dengan bawang. Itu sebabnya sambal kami agak kasar dan warnanya tidak rata. Lima ibu tetangga membantu Bu Rum mengulek tiap hari masak, dari jam empat pagi.", "Pounded chillies split along the fibre, release their oil and fuse with the shallots. That's why our sambal is coarse and uneven in colour. Five neighbours help Bu Rum pound on every cooking day, from four in the morning."]), { size: 18, color: "#3d3632" }),
              fx(Tx(L, t(["“Kalau halus seperti saus, itu bukan sambal.” Bu Rum", "“If it's smooth like sauce, it isn't sambal.” Bu Rum"]), { size: 22, color: C.daun, weight: 700, css: "font-style: italic;" }), "rise"),
            ],
            { gap: 18, name: "Teks ulekan" },
          ),
        ],
        "minmax(0, .85fr) minmax(0, 1.15fr)",
        { gap: 56, align: "center" },
      ),
    ],
    { bg: C.kertas, padY: 96 },
  );
  return [sign, hero, strip, board, nums, ulek];
}

function pageHead(j: J, title: B, text: B, bg: string = C.cabai): BoxNode {
  const { t } = j;
  const dark = bg === C.cabai || bg === C.daun;
  return sec("Kepala halaman", [stack([fx(H(L, t(title), "h1", { size: 68, lh: 1, color: dark ? C.kertas : C.arang, css: dark ? PAINT : "" }), "split"), Tx(L, t(text), { size: 19, color: dark ? C.kertas : C.arang, css: "max-width: 54ch;" })], { gap: 14 })], { bg, padY: 72, css: `border-bottom: 6px solid ${C.arang};` });
}

function menu(j: J): BoxNode[] {
  const { t } = j;
  const card = (s: (typeof SAMBAL)[number], i: number) =>
    fx(
      box(
        [
          line([Lbl(L, `No. ${i + 1}`, C.cabai, { size: 14 }), H(L, s.price, "h3", { size: 24, color: C.arang, full: false })], { justify: "between", stack: false }),
          H(L, t(s.name), "h2", { size: 34, lh: 1.05 }),
          Tx(L, t(s.note), { size: 16, color: "#3d3632" }),
          heat(s.level, C.cabai, C.kertas),
        ],
        { gap: 12, name: "Kartu sambal", bg: "#ffffff", css: `${PLANK} padding: 24px;` },
      ),
      "rise",
      28,
      (i % 2) * 120,
    );
  return [
    pageHead(j, ["Papan menu", "Menu board"], ["Empat sambal, satu ukuran jar. Harga sudah termasuk jar kaca; kembalikan jar kosong dapat potongan Rp3.000.", "Four sambals, one jar size. Prices include the glass jar; return an empty jar for Rp3,000 off."]),
    sec("Daftar sambal", [grid(SAMBAL.map(card), 2, { gap: 32, align: "stretch" })], { bg: C.kertas, padY: 80 }),
    sec(
      "Rak",
      [
        grid(
          [
            box([fx(pic(j.img("rak"), t(["Jar sambal berjajar di rak dapur", "Sambal jars lined up on the kitchen shelf"]), { ratio: "16 / 9", radius: 6, css: PLANK }), "mask")], { name: "Gambar rak" }),
            box(
              [
                H(L, t(["Tahan berapa lama?", "How long does it keep?"]), "h2", { size: 40, color: C.kertas }),
                Tx(L, t(["Dua minggu di suhu ruang selama tutupnya rapat dan sendoknya kering. Dua bulan di kulkas. Minyak di atas sambal itu pelindung, jangan dibuang.", "Two weeks at room temperature if the lid is tight and the spoon is dry. Two months in the fridge. The oil on top protects it, so don't pour it off."]), { size: 18, color: C.kertas }),
              ],
              { gap: 14, name: "Teks simpan" },
            ),
          ],
          "minmax(0, 1.2fr) minmax(0, .8fr)",
          { gap: 48, align: "center" },
        ),
      ],
      { bg: C.daun, padY: 80 },
    ),
  ];
}

function pesan(j: J): BoxNode[] {
  const { t } = j;
  const days: [B, B][] = [
    [["Senin masak", "Monday: cook"], ["Pesanan sampai Minggu malam masuk masakan Senin, dikirim Selasa pagi.", "Orders in by Sunday night go into Monday's batch, shipped Tuesday morning."]],
    [["Kamis masak", "Thursday: cook"], ["Pesanan sampai Rabu malam masuk masakan Kamis, dikirim Jumat pagi.", "Orders in by Wednesday night go into Thursday's batch, shipped Friday morning."]],
    [["Ongkir", "Shipping"], ["Pati, Kudus, Jepara diantar sendiri. Kota lain lewat ekspedisi, jar dibungkus kardus dan bubble wrap tiga lapis.", "Pati, Kudus and Jepara we deliver ourselves. Elsewhere by courier, each jar boxed with three layers of bubble wrap."]],
  ];
  return [
    pageHead(j, ["Pesan sebelum hari masak.", "Order before cooking day."], ["Kami tidak menyetok. Semua sambal dimasak sesuai pesanan, jadi tidak ada jar yang menunggu di gudang.", "We don't stockpile. Every sambal is cooked to order, so no jar sits waiting in a warehouse."], C.terasi),
    sec(
      "Jadwal & formulir",
      [
        grid(
          [
            box(days.map(([h, x], i) => fx(box([H(L, t(h), "h3", { size: 28, color: i < 2 ? C.cabai : C.daun }), Tx(L, t(x), { size: 17, color: "#3d3632" })], { gap: 6, name: "Jadwal", css: `border-left: 6px solid ${C.arang}; padding-left: 18px;` }), "rise", 24, i * 100)), { gap: 28, name: "Jadwal masak" }),
            form(
              L,
              [
                { kind: "input", label: t(["Nama", "Name"]), ph: "Wulan" },
                { kind: "input", label: "WhatsApp", ph: "0813…", type: "tel" },
                { kind: "select", label: t(["Sambal", "Sambal"]), ph: t(["Pilih", "Choose"]), options: SAMBAL.map((s) => t(s.name)).concat(t(["Paket isi empat", "Pack of four"])) },
                { kind: "input", label: t(["Jumlah jar", "Number of jars"]), ph: "3", type: "number" },
                { kind: "input", label: t(["Kota", "City"]), ph: "Semarang" },
              ],
              t(["Kirim pesanan", "Send order"]),
              { btn: { bg: C.cabai, radius: 6 }, radius: 6, bg: "#ffffff", css: `${PLANK} padding: 26px;` },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.kertas, padY: 80 },
    ),
  ];
}

export const j07 = contentJ({
  id: "j3d-sambal-bu-rum",
  brand: "Sambal Bu Rum",
  L,
  pages: [home(), pg("menu", ["menu", "Menu"], ["menu", "Menu"]), pg("pesan", ["pesan", "Pesan"], ["order", "Order"])],
  head,
  foot,
  build: { home: homePage, menu, pesan },
});
