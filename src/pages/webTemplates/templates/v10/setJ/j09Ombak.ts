import { box, btn, contentJ, footer, form, fx, grid, H, header, home, Lbl, line, lookJ, particles3, pg, pic, sec, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 09 · Ombak Kidul: sekolah selancar Batu Karas. Ide besar: situs = zine risograf yang distaples; tabel pasang naik baris demi baris. */

const C = { teal: "#00838A", tealGelap: "#006970", oranye: "#FF6C2F", kertas: "#F6F1E7", navy: "#1D2B4F", pasir: "#E3C99A" };
export const L09 = lookJ({ ink: C.navy, muted: "#3b4560", primary: C.tealGelap, primaryDark: "#00545a", soft: C.pasir, line: C.navy, bg: C.kertas, head: "Instrument Serif", body: "Schibsted Grotesk", r: 4 });
const L = L09;

/** Cetak dua warna yang meleset: bayangan oranye di belakang huruf. */
const RISO = `text-shadow: 5px 4px 0 rgba(255, 108, 47, 0.75);`;
/** Halaman zine: kertas, garis tepi tipis, staples di atas. */
const PAGE = `border: 1.5px solid ${C.navy}; box-shadow: 6px 6px 0 ${C.navy};`;

const TIDES: [B, string, string, string, B, boolean][] = [
  [["Sen 9", "Mon 9"], "05.40", "11.52", "0,8 m", ["Pagi rata, cocok", "Clean morning, good"], true],
  [["Sel 10", "Tue 10"], "06.18", "12.30", "0,9 m", ["Pagi rata, cocok", "Clean morning, good"], true],
  [["Rab 11", "Wed 11"], "06.55", "13.07", "1,4 m", ["Terlalu besar untuk pemula", "Too big for beginners"], false],
  [["Kam 12", "Thu 12"], "07.31", "13.44", "1,1 m", ["Kelas pindah ke sore", "Class moves to afternoon"], true],
  [["Jum 13", "Fri 13"], "08.06", "14.20", "0,7 m", ["Paling ramah minggu ini", "Friendliest this week"], true],
];

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "Ombak Kidul", { bg: C.kertas, ink: C.navy, hover: C.tealGelap, tag: t(["Sekolah selancar · Batu Karas", "Surf school · Batu Karas"]), cta: [t(["Daftar kelas", "Book a class"]), href("daftar")], btn: { bg: C.navy, radius: 4 }, css: `border-bottom: 1.5px solid ${C.navy};`, logoSize: 34 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Ombak Kidul", {
    bg: C.navy,
    ink: C.kertas,
    muted: "#c9cfdc",
    big: t(["Sampai ketemu di air.", "See you in the water."]),
    about: t(["Sekolah selancar keluarga Kang Ujang di Batu Karas, Pangandaran. Zine ini dicetak ulang tiap musim.", "Kang Ujang's family surf school in Batu Karas, Pangandaran. This zine is reprinted every season."]),
    cols: [
      { title: t(["Pondok", "Hut"]), items: [t(["Pinggir muara, Batu Karas", "By the river mouth, Batu Karas"]), "Pangandaran, Jawa Barat"] },
      { title: t(["Kabari kami", "Get in touch"]), items: ["0852-2311-0907", "@ombakkidul"] },
    ],
    copy: t(["© 2026 Ombak Kidul. Konten contoh.", "© 2026 Ombak Kidul. Sample content."]),
  });
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const hero = sec(
    "Sampul zine",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["Zine no. 7", "Zine no. 7"]), C.navy, { size: 13 }),
              Tx(L, t(["Musim kemarau 2026. Gratis, ambil satu di pondok.", "Dry season 2026. Free, take one at the hut."]), { size: 14 }),
              Tx(L, "ISA Level 1 · 4 : 1", { size: 14, weight: 700, color: C.navy }),
            ],
            { gap: 10, name: "Kolofon", css: `border-top: 6px solid ${C.oranye}; padding-top: 14px;` },
          ),
          box(
            [
              fx(H(L, t(["Berdiri di papan, jatuh, lalu berdiri lagi.", "Stand up, fall off, stand up again."]), "h1", { size: 104, lh: 0.92, weight: 400, css: RISO }), "rise", 40),
              Tx(L, t(["Kelas selancar pemula di Batu Karas: grup kecil empat orang, instruktur bersertifikat ISA, dan papan busa yang empuk untuk hari pertama.", "Beginner surf lessons in Batu Karas: small groups of four, ISA-certified instructors, and soft foam boards for your first day."]), { size: 20, css: "max-width: 46ch;" }),
              line([btn(L, t(["Daftar kelas pagi", "Book a morning class"]), href("daftar"), { bg: C.navy, radius: 4 }), btn(L, t(["Lihat paket", "See packages"]), href("kelas"), { bg: C.oranye, fg: C.navy, radius: 4 })], { gap: 12, wrap: true, stack: false }),
            ],
            { gap: 24, name: "Judul sampul" },
          ),
        ],
        "minmax(0, .28fr) minmax(0, 1fr)",
        { gap: 48, align: "start" },
      ),
    ],
    { bg: C.kertas, padY: 72 },
  );
  const wave = sec(
    "Ombak",
    [
      grid(
        [
          box([particles3({ shape: "wave", color: "#7fd0d3", accent: C.oranye, density: "high", size: 4, h: 360, mh: 260, alt: t(["Ombak titik-titik 3D yang bergerak pelan", "Slowly moving 3D dotted wave"]), drag: "off" })], { name: "Ombak 3D" }),
          box(
            [
              H(L, t(["Pagi ini: 0,8 meter, angin darat.", "This morning: 0.8 metres, offshore wind."]), "h2", { size: 44, color: C.kertas, lh: 1, weight: 400 }),
              Tx(L, t(["Batu Karas menghadap teluk, jadi ombaknya pecah panjang dan pelan di atas pasir. Itu sebabnya kami mengajar di sini, bukan di pantai terbuka.", "Batu Karas faces into a bay, so waves break long and slow over sand. That's why we teach here and not on the open coast."]), { size: 17, color: "#d7dbe6" }),
            ],
            { gap: 14, name: "Laporan ombak" },
          ),
        ],
        "minmax(0, 1.2fr) minmax(0, .8fr)",
        { gap: 40, align: "center" },
      ),
    ],
    { bg: C.navy, padY: 56 },
  );
  // Tabel pasang: tiap baris naik bergiliran (efek khas template ini).
  const cols = "minmax(0, .7fr) minmax(0, .7fr) minmax(0, .7fr) minmax(0, .6fr) minmax(0, 1.4fr)";
  const cell = (s: string, o: { b?: boolean; c?: string } = {}) => box([Tx(L, s, { size: 16, weight: o.b ? 700 : 400, color: o.c ?? C.navy })], { name: "Sel" });
  const tide = sec(
    "Tabel pasang",
    [
      grid(
        [
          box([Lbl(L, t(["Halaman 2", "Page 2"]), C.tealGelap), H(L, t(["Tabel pasang minggu ini", "This week's tide table"]), "h2", { size: 56, lh: 0.95, weight: 400, css: RISO }), Tx(L, t(["Kelas pemula kami jadwalkan dua jam sebelum pasang tertinggi, saat ombak paling lembut.", "We schedule beginner classes two hours before high tide, when the waves are softest."]), { size: 16 })], { gap: 12, name: "Judul" }),
          box(
            [
              grid([cell(t(["Hari", "Day"]), { b: true }), cell(t(["Surut", "Low"]), { b: true }), cell(t(["Pasang", "High"]), { b: true }), cell(t(["Ombak", "Swell"]), { b: true }), cell(t(["Catatan", "Note"]), { b: true })], cols, { gap: 10 }),
              ...TIDES.map(([d, lo, hi, sw, note, ok], i) => fx(grid([cell(t(d), { b: true }), cell(lo), cell(hi), cell(sw), cell(`${ok ? "✓" : "✗"} ${t(note)}`, { c: ok ? C.tealGelap : "#b2361a" })], cols, { gap: 10, align: "center" }), "rise", 28, i * 110)),
            ],
            { gap: 0, name: "Tabel", bg: "#ffffff", css: `${PAGE} padding: 6px 22px; & > * { border-bottom: 1px dashed ${C.navy}; padding: 12px 0; } & > *:last-child { border-bottom: 0; }` },
          ),
        ],
        "minmax(0, .7fr) minmax(0, 1.3fr)",
        { gap: 48, align: "start" },
      ),
    ],
    { bg: C.kertas, padY: 88 },
  );
  const steps: [B, B][] = [
    [["08.00 · Di pasir", "8:00 · On the sand"], ["Pemanasan, cara berbaring di papan, dan latihan pop-up sampai kaki hafal.", "Warm-up, lying on the board, and pop-up drills until your feet remember."]],
    [["08.40 · Air setinggi pinggang", "8:40 · Waist-deep water"], ["Instruktur mendorong papan Anda tepat saat ombak datang. Anda cukup berdiri.", "Your instructor pushes the board as the wave arrives. You just stand."]],
    [["09.30 · Mendayung sendiri", "9:30 · Paddle on your own"], ["Belajar membaca ombak dan memilih yang pas. Banyak jatuh, itu bagian dari pelajaran.", "Learn to read waves and pick yours. Lots of falling; that's the lesson."]],
    [["10.00 · Kelapa muda", "10:00 · Young coconut"], ["Foto-foto dari instruktur dikirim lewat WhatsApp sore harinya.", "Photos from your instructor arrive on WhatsApp that afternoon."]],
  ];
  const day = sec(
    "Hari pertama",
    [
      grid(
        [
          box([fx(pic(j.img("papan"), t(["Empat papan busa berdiri di pasir", "Four foam boards standing in the sand"]), { ratio: "9 / 11", radius: 0, css: PAGE }), "scale", 12)], { name: "Gambar papan", css: "transform: rotate(-1.5deg);" }),
          box(
            [Lbl(L, t(["Halaman 3", "Page 3"]), C.tealGelap), H(L, t(["Dua jam pertama Anda di Batu Karas.", "Your first two hours in Batu Karas."]), "h2", { size: 52, lh: 0.98, weight: 400, css: RISO }), ...steps.map(([h, x], i) => fx(box([H(L, t(h), "h3", { size: 20, bodyFont: true, weight: 700 }), Tx(L, t(x), { size: 16 })], { gap: 4, name: "Langkah", css: `border-left: 4px solid ${C.oranye}; padding-left: 16px;` }), "rise", 24, i * 90))],
            { gap: 20, name: "Langkah hari pertama" },
          ),
        ],
        "minmax(0, .85fr) minmax(0, 1.15fr)",
        { gap: 56, align: "start" },
      ),
    ],
    { bg: C.pasir, padY: 96, css: `border-top: 1.5px solid ${C.navy};` },
  );
  return [hero, wave, tide, day];
}

function pageHead(j: J, kicker: B, title: B, text: B): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [stack([Lbl(L, t(kicker), C.tealGelap), fx(H(L, t(title), "h1", { size: 84, lh: 0.95, weight: 400, css: RISO }), "rise"), Tx(L, t(text), { size: 19, css: "max-width: 54ch;" })], { gap: 14 })], { bg: C.kertas, padY: 72, css: `border-bottom: 1.5px solid ${C.navy};` });
}

function kelas(j: J): BoxNode[] {
  const { t } = j;
  const packs: [B, string, B, B][] = [
    [["Coba sekali", "Try once"], "Rp350.000", ["2 jam, papan busa, rashguard, dan foto.", "2 hours, foam board, rashguard and photos."], ["Untuk yang belum tahu suka atau tidak.", "For when you're not sure you'll like it."]],
    [["Tiga pagi", "Three mornings"], "Rp900.000", ["3 × 2 jam dengan instruktur yang sama.", "3 × 2 hours with the same instructor."], ["Biasanya hari ketiga sudah bisa berdiri sendiri.", "Most people stand up alone by day three."]],
    [["Seminggu di Batu Karas", "A week in Batu Karas"], "Rp2.600.000", ["5 kelas, sewa papan sore gratis, dan analisis video.", "5 classes, free afternoon board rental, and video review."], ["Pindah dari papan busa ke papan keras.", "Move from foam to a hard board."]],
  ];
  // Kupon zine: baris bertepi putus-putus yang bisa "digunting".
  const coupon = ([name, price, inc, note]: (typeof packs)[number], i: number) =>
    fx(
      grid(
        [
          box([Lbl(L, `${t(["Kupon", "Coupon"])} ${i + 1}/3`, C.tealGelap), H(L, t(name), "h2", { size: 44, lh: 1, weight: 400 })], { gap: 6, name: "Nama" }),
          box([Tx(L, t(inc), { size: 17, color: C.navy, weight: 600 }), Tx(L, t(note), { size: 15 })], { gap: 6, name: "Isi" }),
          box([H(L, price, "h3", { size: 30, color: C.navy, align: "right", bodyFont: true, weight: 800 })], { name: "Harga" }),
        ],
        "minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, .6fr)",
        { gap: 28, align: "center" },
      ),
      "scale",
      8,
      i * 100,
    );
  return [
    pageHead(j, ["Halaman 4", "Page 4"], ["Paket kelas", "Class packages"], ["Semua kelas pagi, maksimal empat murid per instruktur. Harga termasuk papan, rashguard, dan asuransi kecelakaan.", "All classes in the morning, four students per instructor at most. Prices include board, rashguard and accident insurance."]),
    sec("Kupon", [box(packs.map(coupon), { gap: 28, name: "Daftar kupon", css: `& > * { border: 2px dashed ${C.navy}; padding: 26px; background: #ffffff; }` })], { bg: C.kertas, padY: 72 }),
    sec(
      "Tanya jawab",
      [
        grid(
          ([[["Saya tidak bisa berenang.", "I can't swim."], ["Kelas pertama di air setinggi pinggang dan papan busa mengapung. Tetapi kami sarankan bisa berenang 50 meter sebelum paket seminggu.", "The first class is waist-deep and foam boards float. We do suggest being able to swim 50 metres before the week package."]], [["Umur berapa boleh ikut?", "What age can join?"], ["Mulai 8 tahun, dengan satu instruktur untuk dua anak.", "From 8 years old, with one instructor per two kids."]], [["Kalau ombak terlalu besar?", "What if the waves are too big?"], ["Kelas dipindah ke hari lain atau uang kembali penuh. Lihat tabel pasang di halaman 2.", "We move the class or refund in full. See the tide table on page 2."]], [["Bawa apa?", "What to bring?"], ["Sunblock tahan air, topi, dan baju ganti. Sisanya kami siapkan.", "Waterproof sunscreen, a hat and a change of clothes. We provide the rest."]]] as [B, B][]).map(([q, a]) => box([H(L, t(q), "h3", { size: 28, weight: 400 }), Tx(L, t(a), { size: 16 })], { gap: 6, name: "Tanya" })),
          2,
          { gap: 36 },
        ),
      ],
      { bg: C.pasir, padY: 80, css: `border-top: 1.5px solid ${C.navy};` },
    ),
  ];
}

function daftar(j: J): BoxNode[] {
  const { t } = j;
  return [
    pageHead(j, ["Halaman 5", "Page 5"], ["Daftar kelas", "Book a class"], ["Isi formulir ini, Kang Ujang membalas lewat WhatsApp dalam satu jam (kecuali sedang di air).", "Fill in the form and Kang Ujang replies on WhatsApp within an hour (unless he's in the water)."]),
    sec(
      "Formulir",
      [
        grid(
          [
            form(
              L,
              [
                { kind: "input", label: t(["Nama", "Name"]), ph: "Raka" },
                { kind: "input", label: "WhatsApp", ph: "0852…", type: "tel" },
                { kind: "select", label: t(["Paket", "Package"]), ph: t(["Pilih", "Choose"]), options: [t(["Coba sekali", "Try once"]), t(["Tiga pagi", "Three mornings"]), t(["Seminggu di Batu Karas", "A week in Batu Karas"])] },
                { kind: "date", label: t(["Tanggal mulai", "Start date"]) },
                { kind: "input", label: t(["Jumlah orang", "Number of people"]), ph: "2", type: "number" },
              ],
              t(["Kirim pendaftaran", "Send booking"]),
              { btn: { bg: C.navy, radius: 4 }, radius: 4, bg: "#ffffff", css: `${PAGE} padding: 28px;` },
            ),
            box(
              [
                H(L, t(["Cara ke pondok", "Finding the hut"]), "h2", { size: 40, weight: 400, css: RISO }),
                Tx(L, t(["Dari alun-alun Pangandaran ke barat 32 km. Masuk gerbang Batu Karas, ikuti jalan sampai muara. Pondok kami beratap terpal oranye.", "From Pangandaran square, 32 km west. Enter the Batu Karas gate and follow the road to the river mouth. Our hut has an orange tarp roof."]), { size: 17 }),
                Tx(L, t(["Parkir motor gratis. Bilas air tawar dan loker tersedia.", "Free motorbike parking. Fresh-water showers and lockers available."]), { size: 15, weight: 600, color: C.navy }),
                fx(box([pic(j.img("ombak"), t(["Cetak risograf ombak dan peselancar di teluk Batu Karas", "Risograph print of a wave and surfer in Batu Karas bay"]), { ratio: "3 / 2", radius: 0, css: PAGE })], { name: "Cetakan ombak", css: "transform: rotate(1.2deg);" }), "scale", 10),
              ],
              { gap: 14, name: "Arah" },
            ),
          ],
          "minmax(0, 1.1fr) minmax(0, .9fr)",
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.kertas, padY: 72 },
    ),
  ];
}

export const j09 = contentJ({
  id: "j3d-ombak-kidul",
  brand: "Ombak Kidul",
  L,
  pages: [home(), pg("kelas", ["kelas", "Kelas"], ["classes", "Classes"]), pg("daftar", ["daftar", "Daftar"], ["book", "Book"])],
  head,
  foot,
  build: { home: homePage, kelas, daftar },
});
