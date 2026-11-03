import { box, btn, contentJ, el, footer, form, fx, grid, H, header, home, Lbl, line, lookJ, pg, pic, product3, sec, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 06 · Festival Layang-Layang Pangandaran. Ide besar: halaman miring mengikuti angin (diagonal), judul pecah per kata (split). */

const C = { langit: "#9CC9DD", pasir: "#E8D3A6", merah: "#D2412F", laut: "#123A5A", kertas: "#FAF6EE" };
export const L06 = lookJ({ ink: C.laut, muted: "#2f4d63", primary: C.merah, primaryDark: "#a32e20", soft: "#dcebf2", line: C.laut, bg: C.kertas, head: "Big Shoulders Display", body: "Chivo", r: 0 });
const L = L06;

/** Potongan diagonal untuk tepi bawah section (arah angin). */
const SLANT = "clip-path: polygon(0 0, 100% 0, 100% calc(100% - 64px), 0 100%); padding-bottom: 120px !important; @media (max-width: 640px) { & { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28px), 0 100%); } }";

const DAYS: [B, [string, B, B][]][] = [
  [["Jumat 16 Juli", "Friday 16 July"], [["07.00", ["Pembukaan & layangan raksasa", "Opening & giant kites"], ["Pantai Barat", "West Beach"]], ["09.30", ["Lomba layangan tradisional", "Traditional kite contest"], ["Lapangan A", "Field A"]], ["16.00", ["Parade pasir & musik", "Sand parade & music"], ["Jalan Pantai", "Beach road"]]]],
  [["Sabtu 17 Juli", "Saturday 17 July"], [["08.00", ["Lomba kreasi 3D", "3D creation contest"], ["Lapangan B", "Field B"]], ["13.00", ["Kelas membuat layangan anak", "Kids' kite-making class"], ["Tenda Bambu", "Bamboo tent"]], ["19.00", ["Layangan malam berlampu", "Night kites with lights"], ["Pantai Barat", "West Beach"]]]],
  [["Minggu 18 Juli", "Sunday 18 July"], [["07.30", ["Final aduan layangan", "Kite-fighting final"], ["Lapangan A", "Field A"]], ["11.00", ["Penyerahan piala", "Awards"], ["Panggung utama", "Main stage"]], ["15.00", ["Layangan bersama 1.000 orang", "1,000 kites together"], ["Pantai Barat", "West Beach"]]]],
];

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "Angin Timur 2027", { bg: C.langit, ink: C.laut, hover: "#7a1f14", upper: true, tag: t(["Festival layang-layang · Pangandaran", "Kite festival · Pangandaran"]), cta: [t(["Beli tiket", "Get tickets"]), href("tiket")], btn: { bg: C.merah, radius: 0 }, logoSize: 30 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Angin Timur 2027", {
    bg: C.laut,
    ink: C.kertas,
    muted: "#a9c3d3",
    big: t(["Bawa benang sendiri.", "Bring your own string."]),
    bigSize: 72,
    about: t(["Festival layang-layang Angin Timur ke-12, diselenggarakan paguyuban pelayang dan warga Pantai Barat Pangandaran.", "The 12th Angin Timur kite festival, run by the local kite club and West Beach residents in Pangandaran."]),
    cols: [
      { title: t(["Lokasi", "Venue"]), items: [t(["Pantai Barat, Pangandaran", "West Beach, Pangandaran"]), "Jawa Barat"] },
      { title: t(["Panitia", "Organisers"]), items: ["panitia@angintimur.id", "0822-1800-0718"] },
    ],
    copy: t(["© 2026 Panitia Angin Timur. Konten contoh.", "© 2026 Angin Timur Committee. Sample content."]),
  });
}

/** Papan jadwal bergaya papan keberangkatan stasiun. */
function board(j: J, [day, rows]: (typeof DAYS)[number]): BoxNode {
  const { t } = j;
  return box(
    [
      H(L, t(day), "h3", { size: 30, color: C.pasir, upper: true }),
      fx(box(rows.map(([time, what, where]) => grid([box([H(L, time, "h3", { size: 28, color: "#ffb4a6" })], { name: "Jam" }), box([Tx(L, t(what), { size: 16, color: C.kertas, weight: 700 })], { name: "Acara" }), box([Tx(L, t(where), { size: 13, color: "#a9c3d3", upper: true, spacing: 1 })], { name: "Tempat" })], "84px minmax(0, 1.6fr) minmax(0, 1fr)", { gap: 14, align: "center" })), { gap: 0, name: "Baris", css: "& > * { border-top: 1px solid #ffffff26; padding: 14px 0; }" }), "rise", 30),
    ],
    { gap: 10, name: "Papan hari" },
  );
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const hero = sec(
    "Hero diagonal",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["Festival ke-12 · Pantai Barat Pangandaran", "12th edition · West Beach, Pangandaran"]), C.laut),
              fx(H(L, t(["Angin timur datang 16 Juli.", "The east wind arrives 16 July."]), "h1", { size: 120, lh: 0.86, upper: true, weight: 900, spacing: -1, css: "transform: rotate(-4deg); transform-origin: left bottom;" }), "split", 90),
              Tx(L, t(["Festival layang-layang Angin Timur ke-12: tiga hari, 400 peserta dari 9 negara, satu langit di atas Pantai Barat Pangandaran.", "The 12th Angin Timur kite festival: three days, 400 flyers from 9 countries, one sky over Pangandaran's West Beach."]), { size: 19, color: C.laut, css: "max-width: 42ch;" }),
              line([btn(L, t(["Beli tiket", "Get tickets"]), href("tiket"), { bg: C.merah, radius: 0 }), btn(L, t(["Lihat jadwal", "See the schedule"]), href("jadwal"), { bg: "transparent", fg: C.laut, border: C.laut, radius: 0 })], { gap: 12, wrap: true, stack: false }),
            ],
            { gap: 24, name: "Teks hero" },
          ),
          box([product3({ model: "kite", finish: "matte", color: C.merah, accent: C.kertas, h: 560, mh: 360, alt: t(["Layangan wajik 3D, bisa diputar", "3D diamond kite you can turn"]) })], { name: "Layangan" }),
        ],
        "minmax(0, 1.25fr) minmax(0, .75fr)",
        { gap: 24, align: "center" },
      ),
    ],
    { bg: C.langit, padY: 56, css: SLANT },
  );

  const count = sec(
    "Hitung mundur",
    [
      grid(
        [
          box([H(L, t(["Tali dilepas dalam", "Lines go up in"]), "h2", { size: 44, upper: true }), Tx(L, t(["Pendaftaran peserta lomba ditutup 10 Juli.", "Contest registration closes 10 July."]), { size: 16, color: C.laut })], { gap: 8, name: "Judul" }),
          box([el("countdown", { title: "", target: "2027-07-16T07:00", finishedText: t(["Festival sedang berlangsung.", "The festival is on."]), boxColor: C.laut, numberColor: C.kertas, labelColor: C.pasir, titleColor: C.laut, radius: 0 }, "Countdown")], { name: "Hitung mundur" }),
        ],
        "minmax(0, .8fr) minmax(0, 1.2fr)",
        { gap: 32, align: "center" },
      ),
    ],
    { bg: C.pasir, padY: 64 },
  );

  const nums = sec(
    "Angka festival",
    [
      grid(
        ([["400", ["pelayang", "flyers"]], ["9", ["negara", "countries"]], ["1.000", ["layangan di hari terakhir", "kites on the final day"]], ["3", ["hari", "days"]]] as [string, B][]).map(([n, l], i) =>
          box([fx(H(L, n, "h2", { size: 96, color: i % 2 ? C.merah : C.laut, lh: 0.9, weight: 900 }), "counter"), Tx(L, t(l), { size: 15, upper: true, spacing: 1, color: C.laut })], { gap: 4, name: "Angka", css: `transform: translateY(${i * 18}px); @media (max-width: 767px) { & { transform: none; } }` }),
        ),
        4,
        { gap: 24 },
      ),
    ],
    { bg: C.kertas, padY: 96 },
  );

  const cats: [B, B][] = [
    [["Layangan tradisional", "Traditional kites"], ["Bambu, kertas minyak, benang gelasan. Dinilai dari keseimbangan dan ketinggian.", "Bamboo, oil paper, glass-coated string. Judged on balance and height."]],
    [["Kreasi 3D", "3D creations"], ["Bentuk ikan pari, naga, sampai perahu; panjang boleh sampai 30 meter.", "Manta rays, dragons, even boats; up to 30 metres long."]],
    [["Malam berlampu", "Night lights"], ["Layangan dengan lampu LED baterai, diterbangkan setelah magrib.", "Kites with battery LEDs, flown after sunset."]],
  ];
  const kinds = sec(
    "Kategori lomba",
    [
      H(L, t(["Tiga kategori lomba", "Three contest categories"]), "h2", { size: 64, upper: true, color: C.kertas }),
      fx(box(cats.map(([n, x], i) => line([H(L, `0${i + 1}`, "h3", { size: 72, color: C.pasir, full: false, weight: 900, css: "width: 110px;" }), box([H(L, t(n), "h3", { size: 34, upper: true, color: C.kertas }), Tx(L, t(x), { size: 16, color: "#ffe1da" })], { gap: 4, name: "Isi" })], { gap: 20, align: "center", stack: false, name: "Kategori" })), { gap: 0, name: "Daftar kategori", css: "& > * { border-top: 2px solid #ffffff55; padding: 18px 0; } & > *:nth-child(2) { padding-left: 8%; } & > *:nth-child(3) { padding-left: 16%; } @media (max-width: 767px) { & > * { padding-left: 0 !important; } }" }), "rise", 40),
    ],
    { bg: C.merah, padY: 96, css: SLANT },
  );

  const sched = sec("Jadwal", [H(L, t(["Papan jadwal", "Schedule board"]), "h2", { size: 64, upper: true, color: C.kertas }), grid(DAYS.map((d) => board(j, d)), 3, { gap: 36 })], { bg: C.laut, padY: 96 });

  const beach = sec("Foto pantai", [grid([box([fx(pic(j.img("pantai"), t(["Ratusan layangan di atas Pantai Barat", "Hundreds of kites over West Beach"]), { ratio: "16 / 9" }), "mask")], { name: "Foto" }), box([H(L, t(["Datang pagi. Angin terbaik pukul 07.00–10.00.", "Come early. The best wind is 07:00–10:00."]), "h2", { size: 44, upper: true, lh: 0.95 }), Tx(L, t(["Parkir di Lapangan Merdeka, lalu jalan kaki lima menit. Pantai ditutup untuk kendaraan selama festival.", "Park at Merdeka Field and walk five minutes. The beach is closed to vehicles during the festival."]), { size: 16, color: C.laut })], { gap: 14, name: "Teks" })], "minmax(0, 1.3fr) minmax(0, .7fr)", { gap: 40, align: "center" })], { bg: C.kertas, padY: 96 });
  return [hero, count, nums, kinds, sched, beach];
}

function pageHead(j: J, title: B, text: B): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [stack([fx(H(L, t(title), "h1", { size: 96, upper: true, weight: 900, lh: 0.88, css: "transform: rotate(-3deg); transform-origin: left bottom;" }), "split"), Tx(L, t(text), { size: 18, color: C.laut, css: "max-width: 56ch;" })], { gap: 18 })], { bg: C.langit, padY: 72, css: SLANT });
}

function jadwal(j: J): BoxNode[] {
  return [pageHead(j, ["Tiga hari, satu langit", "Three days, one sky"], ["Jadwal bisa bergeser bila angin terlalu kencang (di atas 35 km/jam). Pengumuman lewat pengeras suara dan Instagram panitia.", "Times may shift if the wind tops 35 km/h. Announcements over the PA and the committee's Instagram."]), ...DAYS.map((d, i) => sec(`Hari ${i + 1}`, [board(j, d)], { bg: C.laut, padY: 56, css: i ? "border-top: 1px solid #ffffff22;" : "" }))];
}

function tiket(j: J): BoxNode[] {
  const { t } = j;
  const tix: [B, string, B][] = [
    [["Penonton harian", "Day pass"], "Rp25.000", ["Anak di bawah 10 tahun gratis", "Under-10s free"]],
    [["Tiga hari", "Three-day pass"], "Rp60.000", ["Termasuk layangan kertas untuk dirakit", "Includes a paper kite kit"]],
    [["Peserta lomba", "Contestant"], "Rp150.000", ["Per tim, maksimal 4 orang", "Per team, up to 4 people"]],
  ];
  return [
    pageHead(j, ["Tiket & pendaftaran", "Tickets & registration"], ["Tiket dijual di lokasi dan lewat formulir ini. Peserta lomba wajib mendaftar sebelum 10 Juli.", "Tickets are sold on site and through this form. Contestants must register before 10 July."]),
    sec(
      "Harga & formulir",
      [
        grid(
          [
            fx(box(tix.map(([n, p, x]) => line([box([H(L, t(n), "h3", { size: 32, upper: true }), Tx(L, t(x), { size: 14, color: C.laut })], { gap: 2, name: "Nama" }), H(L, p, "h3", { size: 34, color: C.merah, full: false })], { gap: 16, justify: "between", align: "center", stack: false, name: "Tiket" })), { gap: 0, name: "Daftar tiket", css: `& > * { border-bottom: 3px solid ${C.laut}; padding: 18px 0; }` }), "rise"),
            form(L, [{ kind: "input", label: t(["Nama", "Name"]), ph: "Ujang" }, { kind: "input", label: "WhatsApp", ph: "0822…", type: "tel" }, { kind: "select", label: t(["Jenis tiket", "Ticket type"]), ph: t(["Pilih", "Choose"]), options: tix.map(([n]) => t(n)) }, { kind: "input", label: t(["Jumlah", "Quantity"]), ph: "2", type: "number" }], t(["Pesan tiket", "Book tickets"]), { btn: { bg: C.merah, radius: 0 }, radius: 0, bg: C.pasir, css: `padding: 26px; border: 3px solid ${C.laut};` }),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.kertas, padY: 88 },
    ),
    sec(
      "Paket layangan",
      [
        grid(
          [
            box([fx(pic(j.img("paket"), t(["Isi paket layangan: kertas, dua bilah bambu, benang, dan lem", "Kite kit contents: paper, two bamboo sticks, string and glue"]), { ratio: "3 / 2" }), "scale", 12)], { name: "Gambar paket" }),
            box([H(L, t(["Tiket tiga hari dapat satu paket layangan.", "Three-day passes come with a kite kit."]), "h2", { size: 40, upper: true, lh: 0.95, color: C.kertas }), Tx(L, t(["Kertas minyak, dua bilah bambu, 50 meter benang, dan lem kanji. Rakit di Tenda Bambu bersama pelayang senior, lalu terbangkan di hari terakhir.", "Waxed paper, two bamboo sticks, 50 metres of string and starch glue. Build it in the Bamboo Tent with senior flyers, then fly it on the last day."]), { size: 17, color: C.kertas })], { gap: 14, name: "Teks paket" }),
          ],
          "minmax(0, 1.1fr) minmax(0, .9fr)",
          { gap: 48, align: "center" },
        ),
      ],
      { bg: C.laut, padY: 88 },
    ),
  ];
}

export const j06 = contentJ({
  id: "j3d-angin-timur-layang",
  brand: "Angin Timur 2027",
  L,
  pages: [home(), pg("jadwal", ["jadwal", "Jadwal"], ["schedule", "Schedule"]), pg("tiket", ["tiket", "Tiket"], ["tickets", "Tickets"])],
  head,
  foot,
  build: { home: homePage, jadwal, tiket },
});
