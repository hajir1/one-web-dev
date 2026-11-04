import { box, btn, contentJ, footer, form, fx, globe3, grid, H, header, home, Lbl, line, lookJ, pg, pic, sec, stack, Tx, type B, type BoxNode, type J } from "./kitJ";

/* 04 · Kongsi Pala Banda: a nutmeg exporter. Big idea: the spice route redrawn as an atlas; margin notes move (parallax). */

const C = { perkamen: "#EFE3C8", sepia: "#4A3426", segel: "#9E2A2B", pala: "#C9792B", laut: "#21364A" };
export const L04 = lookJ({ ink: C.sepia, muted: "#6a5242", primary: C.segel, primaryDark: "#7a1f20", soft: "#e6d6b4", line: "#cdb88f", bg: C.perkamen, head: "Libre Caslon Display", body: "Alegreya", r: 0 });
const L = L04;

const PORTS: [string, string, string][] = [
  ["Rotterdam", "51.9° U", "4.5° T"],
  ["Dubai", "25.3° U", "55.3° T"],
  ["Mumbai", "19.1° U", "72.9° T"],
  ["Shanghai", "31.2° U", "121.5° T"],
  ["Houston", "29.8° U", "95.4° B"],
];

/** Ink-ruled margin notes that move slower than the content (parallax). */
const note = (j: J, n: string, b: B) =>
  fx(box([Tx(L, n, { size: 13, color: C.segel, weight: 700 }), Tx(L, j.t(b), { size: 15, lh: 1.45, css: "font-style: italic;" })], { gap: 4, name: "Catatan pinggir", css: `border-left: 1px solid ${C.sepia}; padding-left: 12px;` }), "parallax", 30);

function head(j: J): BoxNode {
  const { t, href } = j;
  return header(L, "Kongsi Pala Banda", { bg: C.perkamen, ink: C.sepia, hover: C.segel, cta: [t(["Minta sampel", "Request samples"]), href("pesan")], btn: { bg: C.segel, radius: 0 }, css: `border-bottom: 3px double ${C.sepia};`, logoSize: 24 });
}

function foot(j: J): BoxNode {
  const { t } = j;
  return footer(L, "Kongsi Pala Banda", {
    bg: C.laut,
    ink: C.perkamen,
    muted: "#b8c3cc",
    big: t(["Dari Neira, sejak sebelum peta ini digambar.", "From Neira, since before this map was drawn."]),
    about: t(["Koperasi 312 petani pala di Banda Neira, Lonthoir, dan Ay. Ekspor sejak 2011.", "A cooperative of 312 nutmeg growers on Banda Neira, Lonthoir and Ay. Exporting since 2011."]),
    cols: [
      { title: t(["Gudang", "Warehouse"]), items: ["Jl. Pelabuhan, Banda Neira", "Maluku Tengah 97593"] },
      { title: t(["Perdagangan", "Trade"]), items: ["trade@kongsipalabanda.id", "+62 910-21-1144", t(["HS 0908.11 · 0908.21", "HS 0908.11 · 0908.21"])] },
    ],
    copy: t(["© 2026 Kongsi Pala Banda. Konten contoh.", "© 2026 Kongsi Pala Banda. Sample content."]),
  });
}

function homePage(j: J): BoxNode[] {
  const { t, href } = j;
  const hero = sec(
    "Hero atlas",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["Folio I · Banda Neira, 4.5° S 129.9° T", "Folio I · Banda Neira, 4.5° S 129.9° E"]), C.segel),
              fx(H(L, t(["Pala yang dulu diperebutkan, kini dikirim per kontainer.", "The nutmeg once fought over, now shipped by the container."]), "h1", { size: 60, lh: 1.05 }), "split", 60),
              Tx(L, t(["Pala dan fuli kering dari kebun Banda Neira, disortir tangan, lalu dikirim ke 14 negara lengkap dengan sertifikat asal dan uji aflatoksin.", "Dried nutmeg and mace from Banda Neira's groves, hand-sorted and shipped to 14 countries with certificates of origin and aflatoxin tests."]), { size: 19, css: "max-width: 46ch;" }),
              line([btn(L, t(["Lihat manifes", "See the manifest"]), href("produk"), { bg: C.segel, radius: 0 }), btn(L, t(["Minta sampel 500 g", "Request a 500 g sample"]), href("pesan"), { bg: "transparent", fg: C.sepia, border: C.sepia, radius: 0 })], { gap: 12, wrap: true, stack: false }),
            ],
            { gap: 20, name: "Teks hero" },
          ),
          box([globe3({ color: C.pala, ocean: C.laut, glow: C.pala, marker: C.perkamen, markers: ["Banda Neira, -4.5, 129.9", "Rotterdam, 51.9, 4.5", "Dubai, 25.3, 55.3", "Mumbai, 19.1, 72.9", "Shanghai, 31.2, 121.5", "Houston, 29.8, -95.4"], startLon: 100, h: 520, mh: 340, alt: t(["Globe 3D: rute kapal dari Banda ke lima pelabuhan pembeli", "3D globe: shipping routes from Banda to five buyer ports"]) }), Tx(L, t(["Seret globe untuk mengikuti rute.", "Drag the globe to follow the routes."]), { size: 13, align: "center", css: "font-style: italic;" })], { gap: 6, name: "Globe rute" }),
        ],
        "minmax(0, 1fr) minmax(0, 1fr)",
        { gap: 40, align: "center" },
      ),
    ],
    { bg: C.perkamen, padY: 64 },
  );

  const story = sec(
    "Kisah dengan catatan pinggir",
    [
      grid(
        [
          box(
            [
              Lbl(L, t(["Folio II", "Folio II"]), C.segel),
              H(L, t(["Pulau kecil yang pernah ditukar dengan Manhattan.", "The small island once traded for Manhattan."]), "h2", { size: 44, lh: 1.1 }),
              Tx(L, t(["Tahun 1667, Inggris menyerahkan Pulau Run kepada Belanda dan menerima Manhattan sebagai gantinya. Semua demi pala. Tiga ratus tahun kemudian, harga pala di kebun Banda justru sering lebih rendah daripada di pasar Jakarta.", "In 1667 England handed the island of Run to the Dutch and took Manhattan in return, all for nutmeg. Three centuries later, the price at the Banda grove was often lower than in Jakarta's markets."]), { size: 18 }),
              Tx(L, t(["Kongsi kami dibentuk agar petani menjual langsung ke pembeli luar negeri: harga dibuka di papan gudang, timbangan disaksikan, dan pembayaran masuk ke rekening petani dalam tujuh hari.", "Our cooperative was formed so growers sell straight to overseas buyers: prices posted on the warehouse board, weighing witnessed, and payment into the grower's account within seven days."]), { size: 18 }),
              fx(pic(j.img("peta"), t(["Peta lama Kepulauan Banda yang digambar ulang", "A redrawn old map of the Banda Islands"]), { ratio: "16 / 9", css: `border: 1px solid ${C.sepia};` }), "mask"),
            ],
            { gap: 18, name: "Isi utama" },
          ),
          box([note(j, "i.", ["Pala Banda (Myristica fragrans) berbunga sepanjang tahun; panen besar dua kali.", "Banda nutmeg flowers year-round; two main harvests."]), note(j, "ii.", ["Fuli adalah selaput merah pembungkus biji. Harganya hingga 4× biji pala.", "Mace is the red aril around the seed. It sells for up to 4× the nut."]), note(j, "iii.", ["Kebun di bawah pohon kenari tua: naungan yang sama sejak abad ke-17.", "Groves shaded by old canarium trees, the same shade since the 1600s."])], { gap: 56, name: "Kolom catatan", css: "padding-top: 120px; @media (max-width: 767px) { & { padding-top: 0; } }" }),
        ],
        "minmax(0, 1.6fr) minmax(0, .6fr)",
        { gap: 56, align: "start" },
      ),
    ],
    { bg: "#f5ecd9", padY: 96, css: `border-top: 1px solid #cdb88f; border-bottom: 1px solid #cdb88f;` },
  );

  const tons = sec(
    "Angka pengiriman",
    [
      grid(
        ([["640", ["ton pala & fuli per tahun", "tonnes of nutmeg & mace a year"]], ["14", ["negara tujuan", "destination countries"]], ["312", ["petani anggota", "member growers"]], ["7", ["hari sampai uang di rekening petani", "days until growers are paid"]]] as [string, B][]).map(([n, l]) =>
          box([fx(H(L, n, "h2", { size: 64, color: C.perkamen, lh: 1 }), "counter"), Tx(L, t(l), { size: 15, color: "#d2dbe2" })], { gap: 6, name: "Angka", css: `border-top: 1px solid ${C.pala}; padding-top: 12px;` }),
        ),
        4,
        { gap: 28 },
      ),
    ],
    { bg: C.laut, padY: 80 },
  );

  const ports = sec(
    "Pelabuhan tujuan",
    [
      grid(
        [
          box([Lbl(L, t(["Folio III", "Folio III"]), C.segel), H(L, t(["Ke mana pala kami berlayar", "Where our nutmeg sails"]), "h2", { size: 40 }), Tx(L, t(["Dikirim FOB Ambon atau CIF ke pelabuhan Anda. Transit rata-rata 21–38 hari.", "Shipped FOB Ambon or CIF to your port. Average transit 21–38 days."]), { size: 17 })], { gap: 12, name: "Judul" }),
          fx(box(PORTS.map(([n, a, b]) => line([H(L, n, "h3", { size: 28, css: "flex: 1 1 200px;" }), Tx(L, `${a} · ${b}`, { size: 15, full: false, css: "font-variant-numeric: tabular-nums;" })], { gap: 16, justify: "between", align: "center", stack: false, wrap: true, name: "Pelabuhan" })), { gap: 0, name: "Daftar pelabuhan", css: `& > * { border-bottom: 1px dashed ${C.sepia}; padding: 16px 0; }` }), "rise", 24),
        ],
        "minmax(0, .8fr) minmax(0, 1.2fr)",
        { gap: 56, align: "start" },
      ),
    ],
    { bg: C.perkamen, padY: 96 },
  );

  const seal = sec(
    "Ajakan bersegel",
    [
      line(
        [
          box([H(L, "KPB", "h3", { size: 26, color: C.perkamen, align: "center" }), Tx(L, "1667", { size: 12, color: C.perkamen, align: "center" })], { gap: 0, name: "Segel lilin", width: 120, bg: C.segel, css: "height: 120px; border-radius: 50%; justify-content: center; flex: 0 0 120px;" }),
          box([H(L, t(["Butuh sampel sebelum memesan satu kontainer?", "Need a sample before ordering a container?"]), "h2", { size: 36 }), Tx(L, t(["Kami kirim 500 g pala ABCD dan 100 g fuli, lengkap dengan hasil lab, dalam 10 hari.", "We send 500 g of ABCD nutmeg and 100 g of mace with lab results within 10 days."]), { size: 17 })], { gap: 10, name: "Teks" }),
          btn(L, t(["Minta sampel", "Request samples"]), href("pesan"), { bg: C.sepia, radius: 0, css: "white-space: nowrap;" }),
        ],
        { gap: 32, align: "center", name: "Baris ajakan" },
      ),
    ],
    { bg: "#f5ecd9", padY: 80 },
  );
  return [hero, story, tons, ports, seal];
}

function pageHead(j: J, folio: B, title: B, text: B): BoxNode {
  const { t } = j;
  return sec("Kepala halaman", [stack([Lbl(L, t(folio), C.segel), fx(H(L, t(title), "h1", { size: 56, lh: 1.08 }), "split"), Tx(L, t(text), { size: 18, css: "max-width: 56ch;" })], { gap: 12 })], { bg: C.perkamen, padY: 72, css: `border-bottom: 3px double ${C.sepia};` });
}

function produk(j: J): BoxNode[] {
  const { t } = j;
  const rows: [string, B, string, string, string][] = [
    ["01", ["Pala biji ABCD (utuh, sortir)", "Whole nutmeg ABCD (sorted)"], "80–110 / kg", "≤ 10 ppb", "USD 9,80"],
    ["02", ["Pala BWP (patah, untuk giling)", "BWP nutmeg (broken, for grinding)"], "—", "≤ 10 ppb", "USD 7,20"],
    ["03", ["Fuli utuh grade 1", "Whole mace grade 1"], t(["merah jingga", "orange-red"]), "≤ 10 ppb", "USD 31,00"],
    ["04", ["Pala bubuk (mesh 40)", "Ground nutmeg (40 mesh)"], "—", "≤ 5 ppb", "USD 11,50"],
  ];
  const cell = (s: string, o: { b?: boolean; c?: string } = {}) => box([Tx(L, s, { size: 15, weight: o.b ? 700 : 400, color: o.c ?? C.sepia })], { name: "Sel" });
  const head2 = grid([cell("No.", { b: true }), cell(t(["Barang", "Goods"]), { b: true }), cell(t(["Isi per kg", "Count per kg"]), { b: true }), cell(t(["Aflatoksin", "Aflatoxin"]), { b: true }), cell("FOB / kg", { b: true })], "50px minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)", { gap: 12 });
  return [
    pageHead(j, ["Manifes kargo · musim 2026", "Cargo manifest · 2026 season"], ["Apa yang ada di gudang Neira", "What's in the Neira warehouse"], ["Harga FOB Ambon per kg, minimum pesanan 1 ton. Harga berubah mengikuti panen; konfirmasi akhir lewat penawaran tertulis.", "FOB Ambon prices per kg, minimum order 1 tonne. Prices follow the harvest; final terms by written quote."]),
    sec(
      "Manifes",
      [
        box(
          [head2, ...rows.map(([n, g, c, a, p]) => grid([cell(n, { c: C.segel }), cell(t(g), { b: true }), cell(c), cell(a), cell(p, { b: true })], "50px minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)", { gap: 12, align: "center" }))],
          { gap: 0, name: "Tabel manifes", bg: "#f8f1e2", css: `border: 1px solid ${C.sepia}; padding: 8px 20px; & > * { border-bottom: 1px dashed ${C.sepia}; padding: 14px 0; } & > *:last-child { border-bottom: 0; }` },
        ),
        Tx(L, t(["Semua lot disertai Certificate of Origin, fitosanitari, dan hasil lab aflatoksin pihak ketiga.", "Every lot comes with a Certificate of Origin, phytosanitary certificate and third-party aflatoxin results."]), { size: 15, css: "font-style: italic;" }),
      ],
      { bg: C.perkamen, padY: 80 },
    ),
    sec("Kebun", [grid([box([fx(pic(j.img("kebun"), t(["Kebun pala di bawah naungan pohon kenari", "Nutmeg grove under canarium shade"]), { ratio: "4 / 3" }), "mask")], { name: "Foto" }), box([H(L, t(["Dikeringkan di para-para, bukan oven", "Dried on racks, not in ovens"]), "h2", { size: 36 }), Tx(L, t(["Biji dijemur 6–8 minggu dalam cangkangnya di atas bara sabut kelapa yang kecil. Lambat, tetapi minyak atsirinya tetap utuh.", "The nuts dry in their shells for 6–8 weeks over low coconut-husk embers. Slow, but the essential oil stays intact."]), { size: 18 })], { gap: 14, name: "Teks" })], 2, { gap: 48, align: "center" })], { bg: "#f5ecd9", padY: 80 }),
  ];
}

function pesan(j: J): BoxNode[] {
  const { t } = j;
  return [
    pageHead(j, ["Folio IV · Permintaan", "Folio IV · Enquiry"], ["Minta sampel atau penawaran", "Request samples or a quote"], ["Isi data perusahaan Anda. Tim perdagangan membalas dalam satu hari kerja (WIT).", "Fill in your company details. The trade team replies within one working day (UTC+9)."]),
    sec(
      "Formulir",
      [
        grid(
          [
            box([note(j, "i.", ["Sampel gratis untuk importir terdaftar; ongkir kurir ditanggung pembeli.", "Samples are free for registered importers; courier costs are paid by the buyer."]), note(j, "ii.", ["Kontrak musiman tersedia untuk 5 ton ke atas.", "Seasonal contracts available from 5 tonnes."])], { gap: 32, name: "Catatan" }),
            form(
              L,
              [
                { kind: "input", label: t(["Perusahaan", "Company"]), ph: "Rotterdam Spice B.V." },
                { kind: "input", label: t(["Surel", "Email"]), ph: "buyer@company.com", type: "email" },
                { kind: "select", label: t(["Barang", "Goods"]), ph: t(["Pilih", "Choose"]), options: ["ABCD", "BWP", t(["Fuli", "Mace"]), t(["Bubuk", "Ground"])] },
                { kind: "input", label: t(["Perkiraan volume (ton/tahun)", "Estimated volume (t/year)"]), ph: "12", type: "number" },
                { kind: "input", label: t(["Pelabuhan tujuan", "Destination port"]), ph: "Rotterdam" },
              ],
              t(["Kirim permintaan", "Send enquiry"]),
              { btn: { bg: C.segel, radius: 0 }, radius: 0, bg: "#f8f1e2", css: `border: 1px solid ${C.sepia}; padding: 26px;` },
            ),
          ],
          "minmax(0, .7fr) minmax(0, 1.3fr)",
          { gap: 48, align: "start" },
        ),
      ],
      { bg: C.perkamen, padY: 80 },
    ),
  ];
}

export const j04 = contentJ({
  id: "j3d-kongsi-pala-banda",
  brand: "Kongsi Pala Banda",
  L,
  pages: [home(), pg("produk", ["produk", "Produk"], ["products", "Products"]), pg("pesan", ["pesan", "Pesan"], ["enquire", "Enquire"])],
  head,
  foot,
  build: { home: homePage, produk, pesan },
});
