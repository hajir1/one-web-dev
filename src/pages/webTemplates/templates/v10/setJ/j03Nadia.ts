import { box, btn, contentJ, footer, form, fx, grid, H, header, home, Lbl, line, lookJ, pg, pic, product3, sec, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 03 · Nadia Pramesti (portofolio fotografer dokumenter). Ide besar: foto "dicuci" di depan pengunjung (mask). */

const C = { gelap: "#141210", merah: "#B23A2B", kertas: "#E9E2D3", abu: "#6E665C", film: "#D9A441" };
export const L03 = lookJ({ ink: C.kertas, muted: "#b9b1a3", primary: C.merah, primaryDark: "#8e2c20", soft: "#2a2622", line: "#3a3530", bg: C.gelap, head: "Newsreader", body: "DM Mono", r: 2 });
const L = L03;

const STORIES: [string, B, B, string][] = [
  ["R-07", ["Paotere sebelum subuh", "Paotere before dawn"], ["Pelabuhan perahu pinisi, 2025 · 36 bingkai", "Pinisi harbour, 2025 · 36 frames"], "s1"],
  ["R-12", ["Pasar Terong dari bawah meja", "Terong Market from under the table"], ["Esai foto untuk majalah, 2024 · 24 bingkai", "Magazine photo essay, 2024 · 24 frames"], "s2"],
  ["R-19", ["Garam di Jeneponto", "Salt in Jeneponto"], ["Liputan musim kemarau, 2023 · 30 bingkai", "Dry-season story, 2023 · 30 frames"], "s3"],
  ["R-23", ["Rumah yang dipindah", "The house that moved"], ["Rumah panggung Bugis diangkat 40 orang, 2022", "A Bugis stilt house carried by 40 people, 2022"], "s4"],
];

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "Nadia Pramesti", { bg: C.gelap, ink: C.kertas, menuInk: "#d6cfc2", hover: "#e07a6b", tag: t(["Fotografer dokumenter", "Documentary photographer"]), cta: [t(["Tulis surel", "Write to me"]), href("kontak")], btn: { bg: C.merah, radius: 2 }, css: "border-bottom: 1px solid #2c2824;", logoSize: 22 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Nadia Pramesti", {
    bg: "#0c0b0a",
    ink: C.kertas,
    muted: "#a39b8e",
    big: t(["Rol berikutnya belum diisi.", "The next roll is still empty."]),
    about: t(["Fotografer dokumenter di Makassar. Liputan, esai foto, dan workshop.", "Documentary photographer in Makassar. Assignments, photo essays and workshops."]),
    cols: [
      { title: t(["Kontak", "Contact"]), items: ["nadia@pramesti.photo", "+62 811-4100-235"] },
      { title: t(["Agen", "Agency"]), items: [t(["Tersedia untuk penugasan di Indonesia Timur", "Available for assignments across eastern Indonesia"])] },
    ],
    copy: t(["© 2026 Nadia Pramesti. Konten contoh.", "© 2026 Nadia Pramesti. Sample content."]),
  });
}

/** Satu bingkai di contact sheet: nomor, foto, tanda pilih merah. */
function frame(j: J, [code, name, meta, art]: (typeof STORIES)[number], i: number): BoxNode {
  const { t } = j;
  const picked = i % 2 === 0;
  const c = box(
    [
      line([Tx(L, `${code} · ${String(i * 6 + 4).padStart(2, "0")}A`, { size: 11, color: C.film, full: false }), Tx(L, picked ? t(["dipilih", "picked"]) : "", { size: 11, color: "#e07a6b", full: false })], { gap: 8, justify: "between", stack: false }),
      fx(pic(j.img(art), t(name), { ratio: "3 / 2", css: picked ? `outline: 3px solid ${C.merah}; outline-offset: 4px;` : "" }), "mask", 1400, i * 120),
      H(L, t(name), "h3", { size: 24, weight: 600 }),
      Tx(L, t(meta), { size: 12 }),
    ],
    { gap: 10, name: "Bingkai" },
  );
  return c;
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const hero = sec(
    "Hero cetakan",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["Rol 31 · Makassar", "Roll 31 · Makassar"]), C.film),
              fx(H(L, t(["Saya memotret orang yang jarang difoto.", "I photograph people who rarely get photographed."]), "h1", { size: 66, lh: 1.02, weight: 500, spacing: -1 }), "split", 80),
              Tx(L, t(["Nadia Pramesti, fotografer dokumenter di Makassar. Sepuluh tahun mengikuti nelayan, buruh pelabuhan, dan pasar pagi, hampir selalu dengan satu lensa 35 mm.", "Nadia Pramesti, documentary photographer in Makassar. Ten years following fishermen, dock workers and morning markets, almost always with one 35 mm lens."]), { size: 15, css: "max-width: 48ch;" }),
              line([btn(L, t(["Lihat contact sheet", "See the contact sheet"]), href("proyek"), { bg: C.merah, radius: 2 }), btn(L, t(["Pesan liputan", "Commission a story"]), href("kontak"), { bg: "transparent", fg: C.kertas, border: C.kertas, radius: 2, hoverFg: C.gelap })], { gap: 12, wrap: true, stack: false }),
              box([product3({ model: "lens", finish: "metal", color: "#5b544d", accent: "#7d9aa8", h: 260, mh: 200, alt: t(["Lensa 35 mm 3D, bisa diputar", "3D 35 mm lens you can rotate"]) }), Tx(L, t(["35 mm f/2. Satu lensa untuk semua cerita di sini.", "35 mm f/2. One lens for every story here."]), { size: 11, color: C.film })], { gap: 4, name: "Lensa", css: "max-width: 360px;" }),
            ],
            { gap: 20, name: "Teks hero" },
          ),
          box([box([fx(pic(j.img("hero"), t(["Nelayan menarik jaring saat subuh di Paotere", "A fisherman hauling a net at dawn in Paotere"]), { ratio: "4 / 5" }), "parallax", 14)], { name: "Bingkai cetak", css: "overflow: hidden;" }), Tx(L, t(["Paotere, 05.12. Kodak Tri-X dipush ke 1600.", "Paotere, 05:12. Kodak Tri-X pushed to 1600."]), { size: 11, color: "#5a5248" })], { gap: 8, name: "Cetakan besar", bg: C.kertas, css: `padding: 14px 14px 10px;` }),
        ],
        "minmax(0, 1fr) minmax(0, .95fr)",
        { gap: 48, align: "center" },
      ),
    ],
    { bg: C.gelap, padY: 72 },
  );

  const places = ["PAOTERE", "PASAR TERONG", "JENEPONTO", "SOPPENG", "SELAYAR", "KOTA AMBON", "BULUKUMBA", "TANA TORAJA"];
  const strip = sec(
    "Pita film",
    [fx(line(places.map((p) => Tx(L, `▸ ${p}`, { size: 13, color: C.gelap, weight: 500, full: false, css: "white-space: nowrap; letter-spacing: 2px;" })), { gap: 40, stack: false, name: "Lokasi" }), "marquee", 40)],
    { bg: C.film, padY: 12, width: 1600, css: `overflow: hidden; border-top: 6px dotted ${C.gelap}; border-bottom: 6px dotted ${C.gelap};` },
  );

  const about = sec(
    "Tentang",
    [
      grid(
        [
          box([Lbl(L, t(["Catatan lapangan", "Field notes"]), C.film), H(L, t(["Saya datang sebelum kamera dikeluarkan.", "I show up before the camera comes out."]), "h2", { size: 40, weight: 500, lh: 1.1 })], { gap: 12, name: "Judul" }),
          box(
            [
              Tx(L, t(["Biasanya saya tinggal tiga sampai lima hari di satu tempat sebelum memotret. Ikut makan, ikut menunggu ikan, ikut kehujanan. Foto yang baik datang setelah orang lupa saya membawa kamera.", "I usually stay three to five days in a place before shooting. I eat with people, wait for the fish, get rained on. The good pictures come after people forget I'm carrying a camera."]), { size: 15, color: "#d6cfc2" }),
              Tx(L, t(["Karya saya terbit di media nasional dan internasional, dan dipamerkan di Makassar, Jakarta, dan Yogyakarta.", "My work has run in national and international media and shown in Makassar, Jakarta and Yogyakarta."]), { size: 15 }),
            ],
            { gap: 16, name: "Isi" },
          ),
        ],
        "minmax(0, .9fr) minmax(0, 1.1fr)",
        { gap: 48 },
      ),
    ],
    { bg: C.gelap, padY: 88 },
  );

  const sheet = sec(
    "Contact sheet",
    [
      line([H(L, t(["Proyek pilihan", "Selected projects"]), "h2", { size: 44, weight: 500 }), Tx(L, t(["Lingkaran merah: bingkai yang akhirnya dicetak.", "Red outline: the frame that finally got printed."]), { size: 12, color: C.film })], { gap: 24, justify: "between", align: "end" }),
      grid(STORIES.map((s, i) => frame(j, s, i)), 2, { gap: 40 }),
    ],
    { bg: "#1c1916", padY: 88, css: "border-top: 1px solid #2c2824;" },
  );

  const services: [B, B, string][] = [
    [["Liputan", "Assignments"], ["Penugasan media dan LSM, 3–14 hari, termasuk keterangan foto dan wawancara singkat.", "Media and NGO assignments, 3–14 days, captions and short interviews included."], "01"],
    [["Esai foto", "Photo essays"], ["Cerita panjang 20–40 bingkai untuk buku, laporan tahunan, atau pameran.", "Long-form stories of 20–40 frames for books, annual reports or exhibitions."], "02"],
    [["Workshop", "Workshops"], ["Kelas dua hari: mendekati orang asing, etika memotret, dan menyunting urutan cerita.", "Two-day class: approaching strangers, ethics, and sequencing a story."], "03"],
  ];
  const skills = sec(
    "Keahlian",
    [
      H(L, t(["Yang bisa saya kerjakan untuk Anda", "What I can do for you"]), "h2", { size: 40, weight: 500 }),
      fx(box(services.map(([n, x, k]) => grid([box([Tx(L, k, { size: 12, color: C.film })], { name: "No" }), box([H(L, t(n), "h3", { size: 28, weight: 500 })], { name: "Nama" }), box([Tx(L, t(x), { size: 14 })], { name: "Isi" })], "60px minmax(0, .8fr) minmax(0, 1.2fr)", { gap: 20, align: "start" })), { gap: 0, name: "Layanan", css: "& > * { border-top: 1px solid #3a3530; padding: 22px 0; }" }), "rise"),
    ],
    { bg: C.gelap, padY: 88 },
  );

  const years: [string, B][] = [
    ["2026", ["Pameran tunggal \"Air Asin\", Makassar Biennale", "Solo show \"Salt Water\", Makassar Biennale"]],
    ["2025", ["Esai Paotere terbit di majalah perjalanan nasional", "Paotere essay published in a national travel magazine"]],
    ["2023", ["Hibah liputan iklim untuk cerita garam Jeneponto", "Climate reporting grant for the Jeneponto salt story"]],
    ["2019", ["Fotografer staf, harian lokal Makassar", "Staff photographer, a Makassar daily"]],
    ["2016", ["Mulai memotret pasar dengan kamera pinjaman", "Started shooting markets with a borrowed camera"]],
  ];
  const xp = sec(
    "Pengalaman",
    [grid([box([H(L, t(["Pengalaman", "Experience"]), "h2", { size: 40, weight: 500 })], { name: "Judul" }), box(years.map(([y, x]) => line([Tx(L, y, { size: 14, color: C.film, full: false, css: "width: 64px;" }), Tx(L, t(x), { size: 15, color: "#d6cfc2" })], { gap: 20, stack: false, name: "Tahun" })), { gap: 0, name: "Daftar", css: "& > * { border-bottom: 1px solid #3a3530; padding: 14px 0; }" })], "minmax(0, .7fr) minmax(0, 1.3fr)", { gap: 40 })],
    { bg: "#1c1916", padY: 88 },
  );

  const quote = sec(
    "Testimoni",
    [
      stack(
        [
          H(L, t(["\"Nadia mengirim 24 foto, dan kami tidak sanggup membuang satu pun. Akhirnya cerita itu kami tambah empat halaman.\"", "\"Nadia sent 24 pictures and we couldn't bear to drop a single one. We ended up giving the story four extra pages.\""]), "h2", { size: 38, weight: 400, lh: 1.25, align: "center", color: C.gelap, css: "font-style: italic;" }),
          Tx(L, t(["Redaktur foto, majalah perjalanan", "Photo editor, travel magazine"]), { size: 12, color: "#6b3a1e", align: "center" }),
        ],
        { gap: 18, align: "center" },
      ),
    ],
    { bg: C.kertas, padY: 96, width: 880 },
  );

  const cta = sec(
    "Kontak",
    [line([H(L, t(["Ada cerita yang perlu diikuti lebih lama?", "Got a story that needs following for longer?"]), "h2", { size: 44, weight: 500, css: "max-width: 18ch;" }), btn(L, t(["Tulis surel", "Write to me"]), href("kontak"), { bg: C.merah, radius: 2, css: "white-space: nowrap;" })], { gap: 32, justify: "between", align: "center" })],
    { bg: C.gelap, padY: 88 },
  );
  return [hero, strip, about, sheet, skills, xp, quote, cta];
}

function pageHead(j: J, ey: B, title: B, text: B): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [stack([Lbl(L, t(ey), C.film), fx(H(L, t(title), "h1", { size: 60, weight: 500, lh: 1.05 }), "split"), Tx(L, t(text), { size: 15, css: "max-width: 56ch;" })], { gap: 12 })], { bg: C.gelap, padY: 72, css: "border-bottom: 1px solid #2c2824;" });
}

function proyek(j: J): BoxNode[] {
  const { t } = j;
  return [
    pageHead(j, ["Arsip", "Archive"], ["Empat rol, empat kampung.", "Four rolls, four places."], ["Setiap cerita disertai catatan lapangan dan izin dari orang yang difoto.", "Every story comes with field notes and consent from the people photographed."]),
    ...STORIES.map(([code, name, meta, art], i) =>
      sec(`Cerita ${code}`, [grid([box([fx(pic(j.img(art), t(name), { ratio: "3 / 2" }), "mask")], { name: "Foto" }), box([Lbl(L, code, C.film), H(L, t(name), "h2", { size: 36, weight: 500 }), Tx(L, t(meta), { size: 13 })], { gap: 10, name: "Keterangan" })], i % 2 ? "minmax(0, .8fr) minmax(0, 1.2fr)" : "minmax(0, 1.2fr) minmax(0, .8fr)", { gap: 36, align: "end" })], { bg: i % 2 ? "#1c1916" : C.gelap, padY: 72 }),
    ),
  ];
}

function kontak(j: J): BoxNode[] {
  const { t } = j;
  return [
    pageHead(j, ["Kontak", "Contact"], ["Ceritakan siapa yang ingin Anda dengar.", "Tell me whose story you want told."], ["Saya membalas dalam dua hari kerja. Untuk penugasan mendesak, telepon saja.", "I reply within two working days. For urgent assignments, just call."]),
    sec(
      "Formulir",
      [
        grid(
          [
            box([Lbl(L, t(["Langsung", "Direct"]), C.film), H(L, "nadia@pramesti.photo", "h3", { size: 26, weight: 500 }), H(L, "+62 811-4100-235", "h3", { size: 26, weight: 500 }), Tx(L, t(["Makassar, Sulawesi Selatan. Bersedia bepergian ke seluruh Indonesia Timur.", "Makassar, South Sulawesi. Happy to travel across eastern Indonesia."]), { size: 14 })], { gap: 10, name: "Info" }),
            form(
              L,
              [
                { kind: "input", label: t(["Nama", "Name"]), ph: "Andi Rahma" },
                { kind: "input", label: t(["Surel", "Email"]), ph: "andi@redaksi.id", type: "email" },
                { kind: "select", label: t(["Keperluan", "Purpose"]), ph: t(["Pilih", "Choose"]), options: [t(["Liputan", "Assignment"]), t(["Esai foto", "Photo essay"]), t(["Workshop", "Workshop"]), t(["Lisensi foto", "Image licensing"])] },
                { kind: "date", label: t(["Perkiraan tanggal", "Approximate date"]) },
              ],
              t(["Kirim", "Send"]),
              { btn: { bg: C.merah, radius: 2 }, radius: 2, labelColor: C.kertas, bg: "#1c1916", css: "border: 1px solid #3a3530; padding: 26px;" },
            ),
          ],
          "minmax(0, .9fr) minmax(0, 1.1fr)",
          { gap: 48 },
        ),
      ],
      { bg: C.gelap, padY: 80 },
    ),
  ];
}

export const j03 = contentJ({
  id: "j3d-nadia-pramesti",
  brand: "Nadia Pramesti",
  L,
  pages: [home(), pg("proyek", ["proyek", "Proyek"], ["projects", "Projects"]), pg("kontak", ["kontak", "Kontak"], ["contact", "Contact"])],
  head,
  foot,
  build: { home: homePage, proyek, kontak },
});
