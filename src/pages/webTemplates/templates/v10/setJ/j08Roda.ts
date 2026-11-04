import { box, btn, contentJ, footer, form, fx, grid, H, header, home, Lbl, line, lookJ, pg, pic, sec, shape3, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 08 · Roda Lawas: an onthel bicycle restoration workshop. Big idea: the site = an enamel sign + a numbered parts catalog. */

const C = { hijau: "#1E4D3B", krem: "#F1E6C8", merah: "#A3282B", krom: "#B9BCB8", karat: "#8A4B2A", tinta: "#1b2a22" };
export const L08 = lookJ({ ink: C.tinta, muted: "#3f4a42", primary: C.merah, primaryDark: "#7e1d20", soft: "#e6d8b2", line: C.hijau, bg: C.krem, head: "Bodoni Moda", body: "Epilogue", r: 18 });
const L = L08;

/** Enamel sign: rounded corners, a double cream frame, "bolts" in the four corners via inset shadows. */
const ENAMEL = `border-radius: 22px; border: 3px solid ${C.krem}; outline: 10px solid ${C.hijau}; outline-offset: 0; box-shadow: 0 0 0 13px ${C.tinta}, 0 18px 40px -12px rgba(0,0,0,.35);`;

const PARTS: { no: string; name: B; note: B }[] = [
  { no: "1", name: ["Rangka", "Frame"], note: ["Dikupas sampai besi, karat dibersihkan elektrolisis, dicat ulang enamel oven.", "Stripped to bare steel, rust removed by electrolysis, re-enamelled in an oven."] },
  { no: "2", name: ["Spakbor & lampu", "Mudguards & lamp"], note: ["Spakbor diluruskan dengan palu kayu, lampu dinamo diganti kabelnya.", "Mudguards straightened with a wooden mallet, dynamo lamp rewired."] },
  { no: "3", name: ["Sadel kulit", "Leather saddle"], note: ["Kulit lama diminyaki; bila sobek, dijahit ulang oleh penjahit kulit di Kotagede.", "Old leather oiled; if torn, restitched by a Kotagede saddler."] },
  { no: "4", name: ["Gir & rantai", "Chainring & chain"], note: ["Gir direndam, rantai diganti baru dengan pitch asli 1/2 × 1/8 inci.", "Chainring soaked, chain replaced with the original 1/2 × 1/8 inch pitch."] },
  { no: "5", name: ["Setang & rem tarik", "Bars & rod brakes"], note: ["Krom dipoles atau dilapis ulang, batang rem disetel supaya pakem.", "Chrome polished or replated, brake rods adjusted to bite properly."] },
  { no: "6", name: ["Roda & jari-jari", "Wheels & spokes"], note: ["36 jari-jari per roda, disetel satu per satu sampai velg tidak goyang.", "36 spokes a wheel, trued one by one until the rim runs straight."] },
];

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "Roda Lawas", { bg: C.hijau, ink: C.krem, menuInk: C.krem, hover: "#f6d77a", tag: t(["Restorasi onthel · Kotagede", "Vintage bicycle restoration · Kotagede"]), cta: [t(["Daftar antre", "Join the queue"]), href("antre")], btn: { bg: C.merah, radius: 18 }, logoSize: 28 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Roda Lawas", {
    bg: C.tinta,
    ink: C.krem,
    muted: "#c8c2ad",
    big: t(["Kalau masih ada rangkanya, masih bisa.", "If the frame's still there, it can be done."]),
    about: t(["Bengkel restorasi sepeda onthel milik Pak Darmo dan dua anaknya. Buka Selasa sampai Minggu, 08.00–16.00.", "A vintage bicycle restoration workshop run by Pak Darmo and his two sons. Open Tuesday to Sunday, 8am–4pm."]),
    cols: [
      { title: t(["Bengkel", "Workshop"]), items: ["Jl. Mondorakan 23", "Kotagede, Yogyakarta"] },
      { title: t(["Hubungi", "Contact"]), items: ["0878-3900-2209", "bengkel@rodalawas.id"] },
    ],
    copy: t(["© 2026 Roda Lawas. Konten contoh.", "© 2026 Roda Lawas. Sample content."]),
  });
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const hero = sec(
    "Papan enamel",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["No. 2009 · Bengkel Kotagede", "No. 2009 · Kotagede workshop"]), "#f6d77a", { size: 13 }),
              fx(H(L, t(["Sepeda kakek Anda masih bisa jalan.", "Your grandfather's bicycle can still ride."]), "h1", { size: 68, color: C.krem, lh: 1.02, weight: 700, css: "font-style: italic;" }), "rise", 40),
              Tx(L, t(["Roda Lawas memulihkan onthel Gazelle, Fongers, dan Raleigh di Kotagede sejak 2009: bongkar total, cat ulang, dan jari-jari disetel satu per satu.", "Roda Lawas has restored Gazelle, Fongers and Raleigh roadsters in Kotagede since 2009: full strip-down, repaint, and every spoke trued by hand."]), { size: 18, color: C.krem, css: "max-width: 44ch;" }),
              line([btn(L, t(["Daftar antre restorasi", "Join the restoration queue"]), href("antre"), { bg: C.merah, radius: 18 }), btn(L, t(["Lihat harga", "See prices"]), href("layanan"), { bg: "transparent", fg: C.krem, border: C.krem, radius: 18 })], { gap: 12, wrap: true, stack: false }),
            ],
            { gap: 20, name: "Papan", bg: C.hijau, css: `${ENAMEL} padding: 44px;` },
          ),
          box(
            [
              shape3({ shape: "torus", material: "wire", color: C.hijau, accent: C.merah, h: 440, mh: 300, alt: t(["Velg krom 3D yang bisa diputar dengan kursor", "3D chrome rim you can turn with the cursor"]), spin: "on", drag: "on" }),
              Tx(L, t(["Geser untuk memutar velg.", "Drag to turn the rim."]), { size: 13, color: "#3f4a42", align: "center" }),
            ],
            { gap: 4, name: "Velg 3D" },
          ),
        ],
        "minmax(0, 1.15fr) minmax(0, .85fr)",
        { gap: 56, align: "center" },
      ),
    ],
    { bg: C.krem, padY: 72 },
  );
  // Spare parts catalog: a numbered technical drawing + a numbered list that rises in turn.
  const partRow = (p: (typeof PARTS)[number], i: number) =>
    fx(
      line(
        [
          H(L, p.no, "h3", { size: 26, color: C.merah, full: false, weight: 700, css: `width: 48px; height: 48px; border: 3px solid ${C.merah}; border-radius: 999px; display: grid; place-items: center; flex: 0 0 48px;` }),
          box([H(L, t(p.name), "h3", { size: 22, weight: 700 }), Tx(L, t(p.note), { size: 15 })], { gap: 2, name: "Isi" }),
        ],
        { gap: 18, align: "start", stack: false, name: "Bagian" },
      ),
      "rise",
      24,
      i * 80,
    );
  const catalog = sec(
    "Katalog suku cadang",
    [
      box([Lbl(L, t(["Gambar 1 · Onthel pria, rangka 58 cm", "Fig. 1 · Gentleman's roadster, 58 cm frame"]), C.merah), H(L, t(["Enam bagian, semuanya dibongkar.", "Six assemblies, every one taken apart."]), "h2", { size: 48, lh: 1.05 })], { gap: 10, name: "Judul" }),
      grid(
        [
          box([pic(j.img("onthel"), t(["Gambar teknik onthel dengan nomor bagian 1 sampai 6", "Technical drawing of a roadster with parts numbered 1 to 6"]), { ratio: "3 / 2", radius: 0, css: `border: 2px solid ${C.hijau};` })], { name: "Gambar teknik" }),
          box(PARTS.map(partRow), { gap: 18, name: "Daftar bagian" }),
        ],
        "minmax(0, 1.2fr) minmax(0, .8fr)",
        { gap: 48, align: "start" },
      ),
    ],
    { bg: C.krem, padY: 88, css: `border-top: 2px dashed ${C.hijau};` },
  );
  const num = (n: string, label: B) => box([fx(H(L, n, "h2", { size: 80, color: C.krem, full: false, weight: 700 }), "counter"), Tx(L, t(label), { size: 15, color: "#d9d2bb" })], { gap: 4, name: "Angka", css: `border-left: 3px solid ${C.krem}; padding-left: 18px;` });
  const nums = sec(
    "Angka bengkel",
    [grid([num("412", ["sepeda dipulihkan sejak 2009", "bicycles restored since 2009"]), num("36", ["jari-jari disetel per roda", "spokes trued per wheel"]), num("4", ["minggu rata-rata per sepeda", "weeks per bicycle on average"])], 3, { gap: 36 })],
    { bg: C.hijau, padY: 80 },
  );
  const weeks: [B, B][] = [
    [["Minggu 1 · Bongkar", "Week 1 · Strip"], ["Semua baut dilepas, dicatat, dan difoto. Bagian yang hilang dicari di pasar loak Klithikan.", "Every bolt removed, logged and photographed. Missing parts hunted down at Klithikan flea market."]],
    [["Minggu 2 · Rangka", "Week 2 · Frame"], ["Elektrolisis, dempul tipis, cat dasar, lalu enamel dua lapis. Garis pinstripe ditarik tangan.", "Electrolysis, thin filler, primer, then two coats of enamel. Pinstripes drawn by hand."]],
    [["Minggu 3 · Krom & kulit", "Week 3 · Chrome & leather"], ["Setang, lampu, dan bel dipoles. Sadel diminyaki atau dijahit ulang.", "Bars, lamp and bell polished. Saddle oiled or restitched."]],
    [["Minggu 4 · Rakit & setel", "Week 4 · Build & true"], ["Dirakit ulang, roda disetel, lalu diuji keliling Kotagede sejauh 10 km.", "Rebuilt, wheels trued, then test-ridden 10 km around Kotagede."]],
  ];
  const process = sec(
    "Empat minggu",
    [
      grid(
        [
          box([fx(pic(j.img("bengkel"), t(["Dinding bengkel dengan velg tergantung dan papan alat", "Workshop wall with hanging rims and a tool board"]), { ratio: "5 / 6", radius: 18 }), "rise", 40)], { name: "Gambar bengkel" }),
          box(
            [H(L, t(["Satu sepeda, empat minggu.", "One bicycle, four weeks."]), "h2", { size: 46, lh: 1.05 }), ...weeks.map(([h, x], i) => fx(box([H(L, t(h), "h3", { size: 22, color: C.merah, weight: 700 }), Tx(L, t(x), { size: 16 })], { gap: 4, name: "Minggu", css: `border-top: 2px solid ${C.hijau}; padding-top: 14px;` }), "rise", 24, i * 80))],
            { gap: 22, name: "Jadwal" },
          ),
        ],
        "minmax(0, .8fr) minmax(0, 1.2fr)",
        { gap: 56, align: "start" },
      ),
    ],
    { bg: C.krem, padY: 96 },
  );
  return [hero, catalog, nums, process];
}

function pageHead(j: J, title: B, text: B): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [box([fx(H(L, t(title), "h1", { size: 60, color: C.krem, lh: 1.02, css: "font-style: italic;" }), "rise"), Tx(L, t(text), { size: 18, color: C.krem, css: "max-width: 56ch;" })], { gap: 14, name: "Papan", bg: C.hijau, css: `${ENAMEL} padding: 40px;` })], { bg: C.krem, padY: 64 });
}

function layanan(j: J): BoxNode[] {
  const { t } = j;
  const items: [string, B, B, string][] = [
    ["A", ["Servis ringan", "Light service"], ["Setel rem, roda, dan rantai; ganti ban dalam; pelumasan. Selesai di hari yang sama.", "Brakes, wheels and chain adjusted; inner tubes replaced; lubrication. Same-day."], "Rp185.000"],
    ["B", ["Setel roda", "Wheel truing"], ["Satu roda disetel ulang, jari-jari patah diganti stainless.", "One wheel re-trued, broken spokes replaced with stainless."], "Rp120.000"],
    ["C", ["Cat ulang rangka", "Frame repaint"], ["Elektrolisis, enamel oven, pinstripe tangan, dan decal sesuai merek.", "Electrolysis, oven enamel, hand pinstripe and period decals."], "Rp1.450.000"],
    ["D", ["Restorasi total", "Full restoration"], ["Semua bagian pada Gambar 1. Sekitar empat minggu, foto progres tiap pekan.", "Everything in Fig. 1. About four weeks, progress photos every week."], "mulai Rp4.800.000"],
  ];
  const row = ([code, name, note, price]: (typeof items)[number], i: number) =>
    fx(
      grid(
        [
          box([H(L, code, "h3", { size: 40, color: C.merah, weight: 700 })], { name: "Kode" }),
          box([H(L, t(name), "h3", { size: 26, weight: 700 }), Tx(L, t(note), { size: 16 })], { gap: 4, name: "Isi" }),
          box([H(L, price.startsWith("mulai") ? t(["mulai Rp4.800.000", "from Rp4,800,000"]) : price, "h3", { size: 22, color: C.hijau, align: "right", bodyFont: true, weight: 700 })], { name: "Harga" }),
        ],
        "64px minmax(0, 1fr) minmax(0, 220px)",
        { gap: 24, align: "center" },
      ),
      "rise",
      24,
      i * 70,
    );
  return [
    pageHead(j, ["Daftar harga bengkel", "Workshop price list"], ["Harga sudah termasuk tenaga dan bahan umum. Suku cadang langka dihitung terpisah setelah kami cari dan Anda setujui.", "Prices include labour and common materials. Rare parts are charged separately, once we find them and you approve."]),
    sec("Harga", [box(items.map(row), { gap: 0, name: "Tabel harga", css: `& > * { border-bottom: 2px dashed ${C.hijau}; padding: 22px 0; }` })], { bg: C.krem, padY: 72 }),
    sec(
      "Garansi",
      [grid([box([H(L, t(["Rangka yang kami cat bergaransi dua tahun.", "Frames we paint carry a two-year guarantee."]), "h2", { size: 40, color: C.krem, lh: 1.1 })], { name: "Judul" }), box([Tx(L, t(["Bila cat mengelupas bukan karena benturan, kami cat ulang tanpa biaya. Simpan kuitansi dan nomor rangka yang kami ukir di bawah gir.", "If the paint lifts and it wasn't a knock, we repaint free. Keep your receipt and the frame number we engrave under the chainring."]), { size: 17, color: "#e1dac4" })], { name: "Teks" })], 2, { gap: 48, align: "center" })],
      { bg: C.karat, padY: 72 },
    ),
  ];
}

function antre(j: J): BoxNode[] {
  const { t } = j;
  return [
    pageHead(j, ["Daftar antre restorasi", "Join the restoration queue"], ["Bengkel kami hanya memegang enam sepeda sekaligus. Antrean saat ini sekitar lima minggu.", "We only take six bicycles at a time. The current queue is about five weeks."]),
    sec(
      "Formulir antre",
      [
        grid(
          [
            stack(
              [
                H(L, t(["Yang perlu disiapkan", "What to bring"]), "h2", { size: 34 }),
                ...([[["Foto empat sisi", "Photos from four sides"], ["Kiri, kanan, depan, dan nomor rangka di bawah sadel.", "Left, right, front, and the frame number under the saddle."]], [["Cerita sepedanya", "The bicycle's story"], ["Tahun kira-kira dan siapa pemakainya dulu. Membantu kami memilih warna asli.", "Rough year and who rode it. Helps us pick the original colour."]], [["Bagian yang sudah hilang", "Parts already missing"], ["Kami cari di pasar loak. Biasanya ketemu dalam dua minggu.", "We'll hunt at flea markets. Usually found within two weeks."]]] as [B, B][]).map(([h, x], i) =>
                  fx(box([H(L, t(h), "h3", { size: 20, weight: 700, bodyFont: true }), Tx(L, t(x), { size: 15 })], { gap: 4, name: "Syarat", css: `border-left: 3px solid ${C.merah}; padding-left: 16px;` }), "rise", 20, i * 80),
                ),
              ],
              { gap: 20 },
            ),
            form(
              L,
              [
                { kind: "input", label: t(["Nama", "Name"]), ph: "Pak Harjo" },
                { kind: "input", label: "WhatsApp", ph: "0878…", type: "tel" },
                { kind: "select", label: t(["Merek sepeda", "Bicycle make"]), ph: t(["Pilih", "Choose"]), options: ["Gazelle", "Fongers", "Raleigh", "Batavus", t(["Lainnya / tidak tahu", "Other / not sure"])] },
                { kind: "select", label: t(["Layanan", "Service"]), ph: t(["Pilih", "Choose"]), options: [t(["Servis ringan", "Light service"]), t(["Setel roda", "Wheel truing"]), t(["Cat ulang rangka", "Frame repaint"]), t(["Restorasi total", "Full restoration"])] },
                { kind: "input", label: t(["Perkiraan tahun sepeda", "Rough year of the bicycle"]), ph: "1950-an" },
              ],
              t(["Kirim ke bengkel", "Send to the workshop"]),
              { btn: { bg: C.merah, radius: 18 }, radius: 10, bg: "#fbf6e8", css: `border: 2px solid ${C.hijau}; border-radius: 22px; padding: 28px;` },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.krem, padY: 72 },
    ),
  ];
}

export const j08 = contentJ({
  id: "j3d-roda-lawas",
  brand: "Roda Lawas",
  L,
  pages: [home(), pg("layanan", ["layanan", "Layanan"], ["services", "Services"]), pg("antre", ["antre", "Antrean"], ["queue", "Queue"])],
  head,
  foot,
  build: { home: homePage, layanan, antre },
});
