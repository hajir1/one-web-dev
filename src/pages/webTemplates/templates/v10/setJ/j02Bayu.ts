import { box, btn, contentJ, footer, form, fx, grid, H, header, home, Lbl, line, lookJ, pg, pic, product3, sec, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 02 · Bayu Kertanegara (architect portfolio). Big idea: portfolio = an A1 drawing set; projects = sheets that slide (scrub-x). */

const C = { kalkir: "#EEF0EA", tinta: "#1F3A5F", pensil: "#A7B0A8", merah: "#C8402F", grafit: "#222524" };
export const L02 = lookJ({ ink: C.grafit, muted: "#4a5350", primary: C.tinta, primaryDark: "#142844", soft: "#dfe5e3", line: C.pensil, bg: C.kalkir, head: "Archivo", body: "IBM Plex Mono", r: 0 });
const L = L02;

/** Tracing paper background with a 24 px module grid. */
const GRID = `background-image: linear-gradient(${C.pensil}40 1px, transparent 1px), linear-gradient(90deg, ${C.pensil}40 1px, transparent 1px); background-size: 24px 24px;`;

const PROJECTS: [string, B, B, string, string, B][] = [
  ["A-02", ["Rumah Teduh Banyumanik", "Teduh House, Banyumanik"], ["Rumah tinggal · Semarang · 2025", "Residence · Semarang · 2025"], "286", "p1", ["Atap lebar 2,4 m menahan hujan dan panas sore; listrik turun 38% dibanding rumah lama pemilik.", "A 2.4 m roof overhang blocks rain and afternoon heat; power bills fell 38% versus the owners' old house."]],
  ["A-03", ["SD Kanthil Ungaran", "Kanthil Primary School, Ungaran"], ["Sekolah · 12 kelas · 2024", "School · 12 classrooms · 2024"], "1.940", "p2", ["Koridor terbuka dan dinding roster membuat kelas tetap sejuk tanpa AC.", "Open corridors and breeze-block walls keep classrooms cool without air conditioning."]],
  ["A-04", ["Ruang Kerja Kali Garang", "Kali Garang Workspace"], ["Kantor · renovasi gudang · 2023", "Office · warehouse conversion · 2023"], "720", "p3", ["Gudang kopi 1960-an dipakai ulang; rangka baja lama dibiarkan terlihat.", "A 1960s coffee warehouse reused; the old steel frame left exposed."]],
  ["A-05", ["Pavilion Pasar Johar", "Johar Market Pavilion"], ["Ruang publik · sayembara · 2022", "Public space · competition · 2022"], "410", "p4", ["Juara 2 sayembara kota: atap bambu modular yang bisa dibongkar pasang.", "Second prize in the city competition: a modular bamboo roof that can be taken down and rebuilt."]],
];

const SKILLS: [string, B, B][] = [
  ["01", ["Rumah tropis", "Tropical houses"], ["Desain dari nol sampai gambar kerja dan pengawasan berkala.", "From first sketch to construction drawings and site visits."]],
  ["02", ["Bangunan sekolah", "School buildings"], ["Kelas dengan ventilasi silang dan cahaya alami yang cukup untuk membaca.", "Classrooms with cross-ventilation and enough daylight to read by."]],
  ["03", ["Alih fungsi bangunan", "Adaptive reuse"], ["Gudang dan rumah lama dihidupkan lagi tanpa membongkar strukturnya.", "Old warehouses and houses brought back without tearing down the structure."]],
  ["04", ["Simulasi energi", "Energy modelling"], ["Hitung panas matahari dan aliran udara sebelum dinding dibangun.", "Sun and airflow analysis before a wall goes up."]],
];

const XP: [string, B, B][] = [
  ["2021–", ["Studio Kertanegara, Semarang", "Studio Kertanegara, Semarang"], ["Pendiri, arsitek utama", "Founder, lead architect"]],
  ["2017–21", ["Studio Ruang Kota, Jakarta", "Studio Ruang Kota, Jakarta"], ["Arsitek proyek", "Project architect"]],
  ["2014–17", ["Biro Ruang Tropis, Yogyakarta", "Biro Ruang Tropis, Yogyakarta"], ["Arsitek junior", "Junior architect"]],
  ["2014", ["S1 Arsitektur, Universitas Diponegoro", "B.Arch, Diponegoro University"], ["Lulus dengan tugas akhir sekolah hemat energi", "Graduated with an energy-efficient school thesis"]],
];

/** Drawing title block in the corner of the sheet. */
function titleBlock(j: J): BoxNode {
  const { t } = j;
  const cell = (k: B | string, v: string) => box([Lbl(L, typeof k === "string" ? k : t(k), "#55605c", { size: 10 }), Tx(L, v, { size: 14, color: C.grafit, weight: 600 })], { gap: 2, name: "Sel kop", css: `border: 1px solid ${C.grafit}; padding: 8px 10px; margin: -1px 0 0 -1px;` });
  return grid([cell(["Arsitek", "Architect"], "Bayu Kertanegara, IAI"), cell(["Lembar", "Sheet"], "A-01 / 05"), cell(["Skala", "Scale"], "1 : 100"), cell(["Tanggal", "Date"], "03.11.2026")], 2, { gap: 0 });
}

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "BAYU KERTANEGARA", { bg: C.kalkir, ink: C.grafit, hover: "#a3301f", tag: t(["Arsitek · Semarang", "Architect · Semarang"]), cta: [t(["Minta gambar", "Request drawings"]), href("kontak")], btn: { bg: C.tinta, radius: 0 }, css: `border-bottom: 1px solid ${C.grafit};`, logoSize: 18 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Bayu Kertanegara", {
    bg: C.tinta,
    ink: C.kalkir,
    muted: "#b9c4d3",
    big: t(["Revisi berikutnya: rumah Anda.", "Next revision: your house."]),
    about: t(["Arsitek berlisensi IAI. Rumah tropis, sekolah, dan alih fungsi bangunan.", "IAI-licensed architect. Tropical houses, schools and adaptive reuse."]),
    cols: [
      { title: t(["Studio", "Studio"]), items: ["Jl. Sriwijaya 44, Semarang", t(["Kunjungan dengan janji", "Visits by appointment"])] },
      { title: t(["Kontak", "Contact"]), items: ["bayu@kertanegara.studio", "0813-9022-1104", "LinkedIn · Instagram"] },
    ],
    copy: t(["© 2026 Bayu Kertanegara. Konten contoh.", "© 2026 Bayu Kertanegara. Sample content."]),
  });
}

/** One project sheet (fixed width; full screen width on phones). */
function sheet(j: J, [code, name, meta, area, art, note]: (typeof PROJECTS)[number]): BoxNode {
  const { t } = j;
  const s = box(
    [
      line([Lbl(L, code, C.merah), Lbl(L, t(meta), "#55605c")], { gap: 12, justify: "between", stack: false, wrap: true }),
      pic(j.img(art), t(name), { ratio: "4 / 3", css: `border: 1px solid ${C.grafit};` }),
      H(L, t(name), "h3", { size: 26, lh: 1.1 }),
      Tx(L, t(note), { size: 14 }),
      line([fx(H(L, area, "h3", { size: 36, color: C.tinta, full: false }), "counter"), Tx(L, "m²", { size: 14, full: false })], { gap: 6, align: "end", stack: false }),
    ],
    { gap: 12, name: "Lembar proyek", width: 460, bg: "#f7f8f4", css: `border: 1px solid ${C.grafit}; padding: 22px; @media (max-width: 767px) { & { width: 100% !important; } }` },
  );
  return s;
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const hero = sec(
    "Hero kop gambar",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["Lembar A-01 · Pengantar", "Sheet A-01 · Introduction"]), C.merah),
              fx(H(L, t(["Lembar A-01: rumah yang mengikuti matahari.", "Sheet A-01: a house that follows the sun."]), "h1", { size: 68, lh: 1, spacing: -2, upper: false, weight: 800 }), "split", 50),
              Tx(L, t(["Saya Bayu Kertanegara, arsitek di Semarang. Sebelas tahun merancang rumah tropis, sekolah, dan ruang kerja yang hemat listrik tanpa harus terlihat hemat.", "I'm Bayu Kertanegara, an architect in Semarang. Eleven years designing tropical houses, schools and workspaces that save power without looking like they're trying."]), { size: 16, css: "max-width: 52ch;" }),
              line([btn(L, t(["Lihat lembar proyek", "See project sheets"]), href("proyek"), { bg: C.tinta, radius: 0 }), btn(L, t(["Kirim brief", "Send a brief"]), href("kontak"), { bg: "transparent", fg: C.grafit, border: C.grafit, radius: 0 })], { gap: 12, wrap: true, stack: false }),
              titleBlock(j),
            ],
            { gap: 20, name: "Teks hero" },
          ),
          box([product3({ model: "massing", finish: "matte", color: "#f4f5f1", accent: C.tinta, h: 520, mh: 340, alt: t(["Maket bangunan 3D yang bisa diputar", "3D architectural model you can rotate"]) }), Tx(L, t(["Maket studi massa, Rumah Teduh. Seret untuk memutar.", "Massing study, Teduh House. Drag to rotate."]), { size: 12, align: "center", color: "#55605c" })], { gap: 8, name: "Maket", bg: "#f7f8f4", css: `border: 1px solid ${C.grafit};  padding: 12px;` }),
        ],
        "minmax(0, 1.05fr) minmax(0, .95fr)",
        { gap: 40, align: "center" },
      ),
    ],
    { bg: C.kalkir, padY: 64, css: GRID },
  );

  const about = sec(
    "Tentang",
    [
      grid(
        [
          box([Lbl(L, t(["Catatan arsitek", "Architect's notes"]), C.merah), H(L, t(["Saya mulai dari arah matahari, bukan dari fasad.", "I start from the sun's path, not the facade."]), "h2", { size: 40, lh: 1.05 })], { gap: 12, name: "Judul tentang" }),
          box(
            [
              Tx(L, t(["Sebelum menggambar denah, saya duduk di lahan klien dari pagi sampai sore. Dari situ kelihatan di mana angin masuk, sisi mana yang panas, dan pohon mana yang layak dipertahankan.", "Before drawing a plan I sit on the client's site from morning to late afternoon. That shows where the wind comes in, which side gets hot, and which trees are worth keeping."]), { size: 16 }),
              grid(
                ([["1", ["Lahan dulu, gambar kemudian", "Site first, drawings later"]], ["2", ["Material lokal yang bisa diperbaiki tukang setempat", "Local materials local builders can repair"]], ["3", ["Biaya listrik dihitung sebelum biaya fasad", "Running costs counted before facade costs"]]] as [string, B][]).map(([n, x]) =>
                  box([H(L, n, "h3", { size: 28, color: C.merah }), Tx(L, t(x), { size: 14, color: C.grafit })], { gap: 6, name: "Prinsip", css: `border-top: 1px solid ${C.grafit}; padding-top: 10px;` }),
                ),
                3,
                { gap: 20 },
              ),
            ],
            { gap: 24, name: "Isi tentang" },
          ),
        ],
        "minmax(0, .8fr) minmax(0, 1.2fr)",
        { gap: 48, align: "start" },
      ),
    ],
    { bg: "#e6eae4", padY: 88 },
  );

  const intro = box([Lbl(L, t(["Proyek pilihan", "Selected projects"]), C.merah), H(L, t(["Empat lembar, empat cara menahan panas.", "Four sheets, four ways to keep the heat out."]), "h2", { size: 44, lh: 1.02 }), Tx(L, t(["Scroll untuk membalik lembar.", "Scroll to turn the sheets."]), { size: 13 })], { gap: 14, name: "Judul proyek", width: 340, css: "@media (max-width: 767px) { & { width: 100% !important; } }" });
  const strip = fx(line([intro, ...PROJECTS.map((p) => sheet(j, p))], { gap: 28, align: "stretch", name: "Deret lembar", wrap: false, stack: true }), "scrub-x");
  const projects = sec("Proyek (geser horizontal)", [strip], { bg: C.kalkir, padY: 80, css: GRID });

  const legend = sec(
    "Keahlian",
    [
      grid(
        [
          box([Lbl(L, t(["Legenda", "Legend"]), C.merah), H(L, t(["Yang saya kerjakan", "What I do"]), "h2", { size: 40 })], { gap: 12, name: "Judul keahlian" }),
          fx(
            box(
              SKILLS.map(([n, s, x]) => line([Tx(L, n, { size: 13, color: C.merah, weight: 600, full: false, css: `border: 1px solid ${C.merah}; padding: 2px 8px;` }), box([H(L, t(s), "h3", { size: 22 }), Tx(L, t(x), { size: 14 })], { gap: 4, name: "Isi legenda" })], { gap: 18, stack: false, name: "Baris legenda" })),
              { gap: 0, name: "Legenda", css: `& > * { border-bottom: 1px solid ${C.pensil}; padding: 18px 0; }` },
            ),
            "rise",
            24,
          ),
        ],
        "minmax(0, .8fr) minmax(0, 1.2fr)",
        { gap: 48, align: "start" },
      ),
    ],
    { bg: "#e6eae4", padY: 88 },
  );

  const xp = sec(
    "Pengalaman (tabel revisi)",
    [
      stack([Lbl(L, t(["Tabel revisi", "Revision table"]), C.merah), H(L, t(["Pengalaman", "Experience"]), "h2", { size: 40 })], { gap: 10 }),
      box(
        XP.map(([y, place, role], i) =>
          grid([box([Tx(L, `R${XP.length - i}`, { size: 13, color: C.merah, weight: 600 })], { name: "Kode" }), box([Tx(L, y, { size: 14, color: C.grafit })], { name: "Tahun" }), box([H(L, t(place), "h3", { size: 20 })], { name: "Tempat" }), box([Tx(L, t(role), { size: 14 })], { name: "Peran" })], "60px 110px minmax(0, 1.4fr) minmax(0, 1fr)", { gap: 16, align: "center" }),
        ),
        { gap: 0, name: "Tabel", css: `border-top: 2px solid ${C.grafit}; & > * { border-bottom: 1px solid ${C.pensil}; padding: 16px 0; }` },
      ),
    ],
    { bg: C.kalkir, padY: 80, css: GRID },
  );

  const quote = (q: B, who: string, role: B) =>
    box([Lbl(L, t(["Catatan klien", "Client note"]), C.merah), H(L, t(q), "h3", { size: 22, lh: 1.35, bodyFont: true, weight: 500 }), Tx(L, `${who} · ${t(role)}`, { size: 13, color: C.grafit, weight: 600 })], { gap: 12, name: "Catatan klien", css: `border-left: 3px solid ${C.merah}; padding: 4px 0 4px 18px;` });
  const notes = sec(
    "Testimoni",
    [
      grid(
        [
          quote(["\"Bayu menolak menambah AC di ruang keluarga. Dua tahun kemudian kami bersyukur dia keras kepala.\"", "\"Bayu refused to add air-con in the family room. Two years on we're grateful he was stubborn.\""], "Laras & Dimas", ["pemilik Rumah Teduh", "owners, Teduh House"]),
          quote(["\"Anak-anak tidak lagi mengantuk setelah jam istirahat. Kelasnya terang dan anginnya jalan.\"", "\"The kids no longer doze off after break. The rooms are bright and the air moves.\""], "Sri Wahyuni", ["kepala SD Kanthil", "head, Kanthil Primary"]),
        ],
        2,
        { gap: 48 },
      ),
    ],
    { bg: "#e6eae4", padY: 80 },
  );

  const cta = sec(
    "Kontak",
    [
      grid(
        [
          box([H(L, t(["Punya lahan dan belum tahu mau dibangun apa?", "Got a plot and no idea what to build yet?"]), "h2", { size: 44, color: C.kalkir, lh: 1.05 }), Tx(L, t(["Konsultasi pertama satu jam, gratis, di lahan Anda (Semarang dan sekitarnya).", "The first one-hour consultation is free, on your site (Semarang and surroundings)."]), { size: 16, color: "#c9d3e0" })], { gap: 16, name: "Ajakan" }),
          box([btn(L, t(["Kirim permintaan gambar", "Send a drawing request"]), href("kontak"), { bg: C.kalkir, fg: C.tinta, radius: 0, hoverBg: "#ffffff", hoverFg: C.tinta }), Tx(L, "bayu@kertanegara.studio", { size: 15, color: C.kalkir })], { gap: 14, name: "Tombol", align: "start" }),
        ],
        "minmax(0, 1.4fr) minmax(0, .6fr)",
        { gap: 40, align: "center" },
      ),
    ],
    { bg: C.tinta, padY: 80 },
  );
  return [hero, about, projects, legend, xp, notes, cta];
}

function pageHead(j: J, code: string, title: B, text: B): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [stack([Lbl(L, code, C.merah), fx(H(L, t(title), "h1", { size: 60, lh: 1.02, spacing: -1 }), "split"), Tx(L, t(text), { size: 16, css: "max-width: 60ch;" })], { gap: 12 })], { bg: C.kalkir, padY: 72, css: `${GRID} border-bottom: 1px solid ${C.grafit};` });
}

function proyek(j: J): BoxNode[] {
  const { t } = j;
  const row = (p: (typeof PROJECTS)[number], i: number): BoxNode => {
    const [code, name, meta, area, art, note] = p;
    const img = box([fx(pic(j.img(art), t(name), { ratio: "16 / 10", css: `border: 1px solid ${C.grafit};` }), "mask")], { name: "Gambar" });
    const txt = box([Lbl(L, code, C.merah), H(L, t(name), "h2", { size: 34, lh: 1.05 }), Lbl(L, t(meta), "#55605c"), Tx(L, t(note), { size: 15 }), line([fx(H(L, area, "h3", { size: 30, color: C.tinta, full: false }), "counter"), Tx(L, t(["m² terbangun", "m² built"]), { size: 13, full: false })], { gap: 8, align: "end", stack: false })], { gap: 12, name: "Keterangan" });
    return sec(`Lembar ${code}`, [grid(i % 2 ? [txt, img] : [img, txt], "minmax(0, 1.2fr) minmax(0, .8fr)", { gap: 40, align: "center" })], { bg: i % 2 ? "#e6eae4" : C.kalkir, padY: 72, css: `border-bottom: 1px solid ${C.pensil};` });
  };
  return [pageHead(j, t(["Indeks lembar A-02 sampai A-05", "Sheet index A-02 to A-05"]), ["Proyek", "Projects"], ["Setiap proyek ditulis dengan angka yang bisa diperiksa: luas, biaya listrik, suhu ruang. Gambar kerja lengkap tersedia untuk klien dan mahasiswa yang meminta.", "Each project is written up with numbers you can check: floor area, power bills, room temperature. Full drawings are available to clients and students on request."]), ...PROJECTS.map(row)];
}

function kontak(j: J): BoxNode[] {
  const { t } = j;
  const steps: [string, B][] = [
    ["01", ["Kirim brief dan lokasi lahan", "Send a brief and the site location"]],
    ["02", ["Kunjungan lahan satu jam, gratis", "A free one-hour site visit"]],
    ["03", ["Penawaran biaya desain dalam 5 hari kerja", "A design fee proposal within 5 working days"]],
  ];
  return [
    pageHead(j, t(["Lembar Z-01 · Permintaan gambar", "Sheet Z-01 · Drawing request"]), ["Ceritakan lahan Anda.", "Tell me about your site."], ["Makin banyak yang saya tahu soal lahan dan cara Anda tinggal, makin akurat penawarannya.", "The more I know about the site and how you live, the more accurate the proposal."]),
    sec(
      "Formulir",
      [
        grid(
          [
            fx(box(steps.map(([n, s]) => line([Tx(L, n, { size: 13, color: C.merah, weight: 600, full: false }), H(L, t(s), "h3", { size: 20 })], { gap: 16, stack: false, align: "center", name: "Langkah" })), { gap: 0, name: "Alur", css: `& > * { border-bottom: 1px solid ${C.pensil}; padding: 18px 0; }` }), "rise"),
            form(
              L,
              [
                { kind: "input", label: t(["Nama", "Name"]), ph: "Laras Wibowo" },
                { kind: "input", label: t(["Surel", "Email"]), ph: "laras@surel.id", type: "email" },
                { kind: "select", label: t(["Jenis proyek", "Project type"]), ph: t(["Pilih", "Choose"]), options: [t(["Rumah tinggal", "House"]), t(["Sekolah", "School"]), t(["Renovasi / alih fungsi", "Renovation / reuse"]), t(["Lainnya", "Other"])] },
                { kind: "input", label: t(["Luas lahan (m²)", "Site area (m²)"]), ph: "240", type: "number" },
                { kind: "input", label: t(["Lokasi lahan", "Site location"]), ph: "Banyumanik, Semarang" },
              ],
              t(["Kirim permintaan", "Send request"]),
              { btn: { bg: C.tinta, radius: 0 }, radius: 0, bg: "#f7f8f4", css: `border: 1px solid ${C.grafit}; padding: 26px;` },
            ),
          ],
          "minmax(0, .9fr) minmax(0, 1.1fr)",
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.kalkir, padY: 80, css: GRID },
    ),
  ];
}

export const j02 = contentJ({
  id: "j3d-bayu-kertanegara",
  brand: "Bayu Kertanegara",
  L,
  pages: [home(), pg("proyek", ["proyek", "Proyek"], ["projects", "Projects"]), pg("kontak", ["kontak", "Kontak"], ["contact", "Contact"])],
  head,
  foot,
  build: { home: homePage, proyek, kontak },
});


