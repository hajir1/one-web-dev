import { addCss, box, btn, contentJ, footer, form, fx, grid, H, header, home, Lbl, line, list, lookJ, pg, pic, product3, sec, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 01 · Tanah Liat Kasongan: a pottery small business. Big idea: the potter's wheel + a process "fired" in stages (pin). */

const C = { tera: "#B5532A", tanah: "#3B2A20", kapur: "#F3EBDD", abu: "#8C7B6B", lumut: "#5E7D5B" };
export const L01 = lookJ({ ink: C.tanah, muted: "#5c4a3e", primary: C.tera, primaryDark: "#8f3f1e", soft: "#ead9c4", line: "#d8c6ae", bg: C.kapur, head: "Young Serif", body: "Hanken Grotesk", r: 0 });
const L = L01;

const ITEMS: [string, B, B, string, string][] = [
  ["014", ["Vas leher angsa", "Swan-neck vase"], ["Tinggi 42 cm · glasir lumut", "42 cm tall · moss glaze"], "Rp185.000", "vas"],
  ["027", ["Pot gantung tiga tali", "Three-cord hanging pot"], ["Ø 18 cm · tanah polos", "Ø 18 cm · bare clay"], "Rp65.000", "pot"],
  ["031", ["Kendi air minum", "Drinking-water kendi"], ["1,5 liter · bakar dua kali", "1.5 litres · double-fired"], "Rp90.000", "kendi"],
  ["048", ["Tempayan teras", "Terrace water jar"], ["Tinggi 60 cm · motif tekan", "60 cm tall · pressed motif"], "Rp420.000", "tempayan"],
  ["052", ["Lampu gerabah berlubang", "Pierced clay lamp"], ["Tinggi 28 cm · fiting E27", "28 cm tall · E27 socket"], "Rp150.000", "lampu"],
  ["063", ["Celengan ayam jago", "Rooster money box"], ["Tinggi 22 cm · cat tangan", "22 cm tall · hand-painted"], "Rp45.000", "celengan"],
];

const STEPS: [string, B, B, B][] = [
  ["01", ["Uleni", "Knead"], ["Tanah liat dari sawah Kasongan diinjak dan diuleni sampai tak ada gelembung udara.", "Clay from Kasongan's rice fields is trodden and kneaded until no air bubbles remain."], ["Hari 1", "Day 1"]],
  ["02", ["Putar", "Throw"], ["Dibentuk di atas meja putar kayu. Satu vas besar butuh sekitar 40 menit.", "Shaped on a wooden wheel. One large vase takes about 40 minutes."], ["Hari 1", "Day 1"]],
  ["03", ["Jemur", "Dry"], ["Diangin-anginkan di bawah atap, lalu dijemur dua hari agar tidak retak di tungku.", "Air-dried under the roof, then sun-dried for two days so it won't crack in the kiln."], ["Hari 2–3", "Days 2–3"]],
  ["04", ["Bakar", "Fire"], ["Dibakar dengan kayu dan sekam sampai 1.050°C, lalu didinginkan pelan semalaman.", "Fired with wood and rice husk to 1,050°C, then cooled slowly overnight."], ["Hari 4", "Day 4"]],
];

/** Catalog tag: string hole, stamp number, image, name, size, price. */
function tag(j: J, [no, name, size, price, art]: (typeof ITEMS)[number]): BoxNode {
  const { t } = j;
  const c = box(
    [
      Lbl(L, `No. ${no}`, C.tera, { css: "letter-spacing: 3px;" }),
      pic(j.img(art), `${t(name)}, Tanah Liat Kasongan`, { ratio: "1 / 1" }),
      H(L, t(name), "h3", { size: 22 }),
      Tx(L, t(size), { size: 14 }),
      Tx(L, price, { size: 18, weight: 800, color: C.tanah, css: `border-top: 2px dashed ${C.tanah}; padding-top: 10px;` }),
    ],
    { gap: 10, name: "Tag katalog", bg: "#fbf6ee", css: `position: relative; padding: 34px 22px 22px;  border: 2px solid ${C.tanah}; clip-path: polygon(14% 0, 86% 0, 100% 9%, 100% 100%, 0 100%, 0 9%);` },
  );
  addCss(c, `&::before { content: ""; position: absolute; top: 12px; left: 50%; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; border: 2px solid ${C.tanah}; background: ${C.kapur}; }`);
  return c;
}

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "Tanah Liat Kasongan", { bg: C.kapur, ink: C.tanah, hover: "#8f3f1e", cta: [t(["Pesan khusus", "Custom order"]), href("kunjungi")], btn: { bg: C.tanah, radius: 0 }, css: `border-bottom: 2px solid ${C.tanah};`, logoSize: 20 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Tanah Liat Kasongan", {
    bg: C.tanah,
    ink: C.kapur,
    muted: "#c9b8a6",
    big: t(["Mampir ke bengkel kami. Tanahnya masih basah.", "Drop by the workshop. The clay is still wet."]),
    bigSize: 48,
    about: t(["Perajin gerabah keluarga di Kasongan, Bantul, sejak 1987.", "A family pottery workshop in Kasongan, Bantul, since 1987."]),
    cols: [
      { title: t(["Bengkel", "Workshop"]), items: ["Jl. Kasongan No. 21, Bangunjiwo", "Kasihan, Bantul", t(["Senin–Sabtu, 08.00–16.00", "Mon–Sat, 08:00–16:00"])] },
      { title: t(["Hubungi", "Contact"]), items: ["0812-2700-1987", "halo@tanahliatkasongan.id", "@tanahliatkasongan"] },
    ],
    copy: t(["© 2026 Tanah Liat Kasongan. Konten contoh.", "© 2026 Tanah Liat Kasongan. Sample content."]),
  });
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const fact = (n: string, label: B) => box([fx(H(L, n, "h3", { size: 40, color: C.tera }), "counter"), Tx(L, t(label), { size: 13, upper: true, spacing: 1 })], { gap: 2, name: "Angka", css: `border-left: 2px solid ${C.tanah}; padding-left: 14px;` });
  const text = box(
    [
      Lbl(L, t(["Kasongan, Bantul · sejak 1987", "Kasongan, Bantul · since 1987"]), C.tera),
      fx(H(L, t(["Dibentuk tangan, dibakar 1.050°C.", "Shaped by hand, fired at 1,050°C."]), "h1", { size: 76, lh: 1.02, spacing: -2 }), "split", 70),
      Tx(L, t(["Vas, pot, dan pesanan khusus dari perajin Kasongan sejak 1987. Tiap barang masih menyimpan bekas jari pembuatnya.", "Vases, pots and custom orders from Kasongan potters since 1987. Every piece still carries its maker's fingerprints."]), { size: 19, css: "max-width: 34ch;" }),
      line([btn(L, t(["Lihat katalog", "See the catalogue"]), href("katalog"), { radius: 0 }), btn(L, t(["Kelas membuat gerabah", "Pottery class"]), href("kunjungi"), { bg: "transparent", fg: C.tanah, border: C.tanah, radius: 0 })], { gap: 12, wrap: true, stack: false }),
      line([fact("1.050°C", ["suhu tungku", "kiln heat"]), fact("38", ["tahun membakar", "years firing"]), fact("11", ["perajin", "potters"])], { gap: 28, wrap: true, stack: false, name: "Deret angka" }),
    ],
    { gap: 22, name: "Teks hero" },
  );
  const wheel = box([product3({ model: "vase", finish: "matte", color: C.tera, accent: C.lumut, h: 560, mh: 380, alt: t(["Vas gerabah 3D, bisa diputar", "3D clay vase you can turn"]) })], { name: "Meja putar", css: `position: relative; &::after { content: ""; position: absolute; left: 18%; right: 18%; bottom: 30px; height: 26px; border-radius: 50%; background: ${C.abu}; opacity: .35; z-index: -1; }` });
  const hero = sec("Hero meja putar", [grid([text, wheel], "minmax(0, 1.1fr) minmax(0, .9fr)", { gap: 32, align: "center" })], { bg: C.kapur, padY: 64 });

  const words = [t(["Vas", "Vases"]), t(["Pot gantung", "Hanging pots"]), "Kendi", t(["Tempayan", "Water jars"]), t(["Lampu gerabah", "Clay lamps"]), t(["Celengan", "Money boxes"]), t(["Pesanan hotel", "Hotel orders"])];
  const strip = fx(line(words.map((w) => H(L, `${w} ·`, "h3", { size: 30, color: C.kapur, full: false, css: "white-space: nowrap;" })), { gap: 28, stack: false, name: "Pita jenis barang" }), "marquee", 36);
  const band = sec("Pita barang", [strip], { bg: C.tera, padY: 20, width: 1600, css: "overflow: hidden;" });

  const step = ([n, title, text, day]: (typeof STEPS)[number]) =>
    box([H(L, n, "h3", { size: 64, color: C.tera, lh: 1 }), H(L, t(title), "h3", { size: 26, color: C.kapur }), Tx(L, t(text), { size: 15, color: "#d9cbbb" }), Lbl(L, t(day), "#c2b2a1")], { gap: 10, name: "Tahap", css: `border-top: 2px solid ${C.tera}; padding-top: 16px;` });
  const proc = fx(
    grid([box([Lbl(L, t(["Proses", "Process"]), "#c2b2a1"), H(L, t(["Empat hari dari tanah sawah ke rak toko.", "Four days from rice-field clay to the shelf."]), "h2", { size: 40, color: C.kapur, lh: 1.1 })], { gap: 12, name: "Judul proses" }), ...STEPS.map(step)], "minmax(0, 1.3fr) repeat(4, minmax(0, 1fr))", { gap: 28, align: "start" }),
    "pin",
    70,
  );
  const process = sec("Proses (menempel)", [proc], { bg: C.tanah, padY: 96 });

  const cat = sec(
    "Katalog tag",
    [
      line([H(L, t(["Yang sedang ada di rak", "On the shelf right now"]), "h2", { size: 44, css: "max-width: 14ch;" }), Tx(L, t(["Semua barang dibuat satu per satu, jadi ukuran bisa selisih 1–2 cm. Itu tandanya buatan tangan.", "Every piece is made one at a time, so sizes may vary by 1–2 cm. That's how you know it's handmade."]), { size: 16, css: "max-width: 40ch;" })], { gap: 32, justify: "between", align: "end" }),
      fx(grid(ITEMS.map((it) => tag(j, it)), 3, { gap: 24, align: "stretch" }), "rise", 40),
    ],
    { bg: C.kapur, padY: 96 },
  );

  const maker = sec(
    "Dari bengkel",
    [
      grid(
        [
          box([fx(pic(j.img("bengkel"), t(["Pak Warsito membentuk vas di meja putar", "Pak Warsito throwing a vase on the wheel"]), { ratio: "4 / 5" }), "mask")], { name: "Foto" }),
          box(
            [
              Lbl(L, t(["Dari bengkel", "From the workshop"]), "#46613f"),
              H(L, t(["\"Tanah yang baik itu yang mau diajak pelan.\"", "\"Good clay is clay that lets you go slowly.\""]), "h2", { size: 38, lh: 1.15 }),
              Tx(L, t(["Pak Warsito mulai memutar tanah liat umur dua belas tahun, membantu ayahnya. Sekarang ia mengajari sebelas perajin muda di bengkel yang sama, dengan tungku yang sama.", "Pak Warsito started throwing clay at twelve, helping his father. Today he teaches eleven young potters in the same workshop, with the same kiln."]), { size: 17 }),
              Tx(L, "Warsito, " + t(["pendiri", "founder"]), { size: 14, weight: 700, color: C.tanah }),
            ],
            { gap: 16, name: "Cerita" },
          ),
        ],
        "minmax(0, .9fr) minmax(0, 1.1fr)",
        { gap: 56, align: "center" },
      ),
    ],
    { bg: "#ece0cf", padY: 96 },
  );

  const order = sec(
    "Pesanan khusus",
    [
      grid(
        [
          box(
            [
              H(L, t(["Kafe Anda butuh 120 pot yang sama persis? Bisa.", "Need 120 identical pots for your café? We can."]), "h2", { size: 44, color: C.kapur, lh: 1.08 }),
              list([t(["Logo atau nama dicap sebelum dibakar", "Logo or name stamped before firing"]), t(["Glasir warna sesuai interior", "Glaze colours matched to your interior"]), t(["Contoh fisik dikirim dulu, gratis", "A physical sample sent first, free"]), t(["Produksi 3–5 minggu", "3–5 weeks of production"])], C.kapur, { size: 16, gap: 6 }),
            ],
            { gap: 18, name: "Teks pesanan" },
          ),
          form(
            L,
            [
              { kind: "input", label: t(["Nama usaha", "Business name"]), ph: "Kopi Pelan" },
              { kind: "input", label: "WhatsApp", ph: "0812…", type: "tel" },
              { kind: "select", label: t(["Jenis barang", "Item"]), ph: t(["Pilih", "Choose"]), options: [t(["Pot tanaman", "Plant pots"]), t(["Vas", "Vases"]), t(["Lampu", "Lamps"]), t(["Peralatan saji", "Tableware"])] },
              { kind: "input", label: t(["Jumlah", "Quantity"]), ph: "120", type: "number" },
            ],
            t(["Minta penawaran", "Request a quote"]),
            { btn: { bg: C.tanah, radius: 0 }, radius: 0, bg: C.kapur, css: `padding: 28px; border: 2px solid ${C.tanah};` },
          ),
        ],
        "minmax(0, 1fr) minmax(0, .9fr)",
        { gap: 48, align: "center" },
      ),
    ],
    { bg: C.tera, padY: 96 },
  );
  return [hero, band, process, cat, maker, order];
}

function pageHeadK(j: J, ey: B, title: B, text: B): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [stack([Lbl(L, t(ey), C.tera), fx(H(L, t(title), "h1", { size: 64, lh: 1.05, css: "max-width: 16ch;" }), "split"), Tx(L, t(text), { size: 18, css: "max-width: 52ch;" })], { gap: 14 })], { bg: C.kapur, padY: 72, css: `border-bottom: 2px solid ${C.tanah};` });
}

function katalog(j: J): BoxNode[] {
  const { t } = j;
  const care: [B, B][] = [
    [["Sebelum dipakai", "Before first use"], ["Rendam pot tanaman 10 menit agar pori-porinya tidak menyerap air pupuk terlalu cepat.", "Soak plant pots for 10 minutes so the pores don't soak up fertiliser water too fast."]],
    [["Membersihkan", "Cleaning"], ["Cukup sikat lembut dan air. Hindari sabun cuci piring untuk gerabah tanpa glasir.", "A soft brush and water are enough. Avoid dish soap on unglazed pieces."]],
    [["Pengiriman", "Shipping"], ["Dikemas dengan sekam dan kardus dobel. Barang pecah di jalan kami ganti.", "Packed in rice husk and double cardboard. Anything broken in transit is replaced."]],
  ];
  return [
    pageHeadK(j, ["Katalog", "Catalogue"], ["Enam puluh bentuk, satu tungku.", "Sixty shapes, one kiln."], ["Harga sudah termasuk kemasan aman. Ongkos kirim dihitung saat pesanan dikonfirmasi lewat WhatsApp.", "Prices include safe packing. Shipping is calculated when you confirm the order on WhatsApp."]),
    sec("Daftar katalog", [fx(grid([...ITEMS, ...ITEMS.slice(0, 3).map(([n, a, b, c, d]) => [String(Number(n) + 40).padStart(3, "0"), a, b, c, d] as (typeof ITEMS)[number])].map((it) => tag(j, it)), 3, { gap: 24, align: "stretch" }), "rise", 40)], { bg: C.kapur, padY: 80 }),
    sec("Perawatan", [grid(care.map(([h, x]) => box([H(L, t(h), "h3", { size: 24 }), Tx(L, t(x), { size: 15 })], { gap: 8, name: "Tips", css: `border-top: 2px solid ${C.tanah}; padding-top: 14px;` })), 3, { gap: 32 })], { bg: "#ece0cf", padY: 72 }),
  ];
}

function kunjungi(j: J): BoxNode[] {
  const { t } = j;
  const sched: [B, string, B][] = [
    [["Kelas coba (2 jam)", "Taster class (2 hrs)"], "Rp150.000", ["Sabtu & Minggu, 09.00", "Sat & Sun, 09:00"]],
    [["Kelas keluarga", "Family class"], "Rp400.000", ["4 orang, hari bebas", "4 people, any day"]],
    [["Kursus 4 minggu", "4-week course"], "Rp1.200.000", ["Rabu malam, 19.00", "Wednesday evenings, 19:00"]],
  ];
  return [
    pageHeadK(j, ["Kunjungi & pesan", "Visit & order"], ["Tangan Anda akan kotor. Itu bagian yang paling seru.", "Your hands will get dirty. That's the best part."], ["Kelas membuat gerabah untuk pemula, rombongan sekolah, dan tim kantor. Hasil karya dibakar dan bisa diambil seminggu kemudian.", "Pottery classes for beginners, school groups and office teams. Your piece is fired and ready for pickup a week later."]),
    sec(
      "Jadwal kelas",
      [
        fx(
          box(
            sched.map(([n, price, when]) => line([H(L, t(n), "h3", { size: 26, css: "flex: 1 1 260px;" }), Tx(L, t(when), { size: 15, css: "flex: 1 1 200px;" }), Tx(L, price, { size: 20, weight: 800, color: C.tera, full: false })], { gap: 20, align: "center", justify: "between", wrap: true, stack: false, name: "Baris jadwal" })),
            { gap: 0, name: "Jadwal", css: `& > * { border-bottom: 2px solid ${C.tanah}; padding: 22px 0; }` },
          ),
          "rise",
          30,
        ),
      ],
      { bg: C.kapur, padY: 72 },
    ),
    sec(
      "Pesan kelas",
      [
        grid(
          [
            box([H(L, t(["Daftar kelas atau tanya pesanan", "Book a class or ask about an order"]), "h2", { size: 36 }), Tx(L, t(["Kami balas lewat WhatsApp di jam kerja. Rombongan di atas 15 orang mohon kabari seminggu sebelumnya.", "We reply on WhatsApp during working hours. Groups over 15, please let us know a week ahead."]), { size: 16 }), box([Lbl(L, t(["Alamat", "Address"]), C.tera), Tx(L, "Jl. Kasongan No. 21, Bangunjiwo, Kasihan, Bantul 55184", { size: 16, color: C.tanah, weight: 600 }), Tx(L, t(["Dari Malioboro ±25 menit ke arah selatan. Parkir bus muat di depan bengkel.", "About 25 minutes south of Malioboro. Buses can park in front of the workshop."]), { size: 14 })], { gap: 6, name: "Alamat", css: `border-left: 2px solid ${C.tanah}; padding-left: 16px;` })], { gap: 14, name: "Info" }),
            form(L, [{ kind: "input", label: t(["Nama", "Name"]), ph: "Rara" }, { kind: "input", label: "WhatsApp", ph: "0812…", type: "tel" }, { kind: "select", label: t(["Kelas", "Class"]), ph: t(["Pilih", "Choose"]), options: sched.map(([n]) => t(n)) }, { kind: "date", label: t(["Tanggal", "Date"]) }], t(["Kirim", "Send"]), { btn: { bg: C.tanah, radius: 0 }, radius: 0, bg: "#fbf6ee", css: `padding: 28px; border: 2px solid ${C.tanah};` }),
          ],
          "minmax(0, 1fr) minmax(0, 1fr)",
          { gap: 48, align: "start" },
        ),
      ],
      { bg: "#ece0cf", padY: 80 },
    ),
  ];
}

export const j01 = contentJ({
  id: "j3d-tanah-liat-kasongan",
  brand: "Tanah Liat Kasongan",
  L,
  pages: [home(), pg("katalog", ["katalog", "Katalog"], ["catalogue", "Catalogue"]), pg("kunjungi", ["kunjungi", "Kunjungi"], ["visit", "Visit"])],
  head,
  foot,
  build: { home: homePage, katalog, kunjungi },
});
