import { asset } from "../../assets";
import { badge, button, col, el, eyebrow, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "../../build";
import { ctaBand, faqAccordion, featuresIcons, portfolioMosaic, pricingCards, servicesSplit, teamCards, testimonialsWall } from "../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../types";
import { FONTS, centeredHeader, footer, header, listingCard, pageWith, theme } from "./kit";

/* ================================================================== */
/* Template Pro set B: Personal Brand, Restoran, Properti, Pendidikan.   */
/* ================================================================== */

/* ---------------------- 5. Personal Brand (PREMIUM) ------------------ */

const PB: Palette = { ink: "#292524", muted: "#57534e", primary: "#c2410c", primaryDark: "#9a3412", soft: "#ffedd5", line: "#fed7aa" };
const pbTheme = theme(PB, { bg: "#fffbf5", alt: "#fdf4ea", dark: "#292524", radius: 28, headFont: FONTS.elegant });

export const personalBrand: TemplateContent = {
  brand: "Dimas Arya",
  pages: [{ key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true }],
  build: (_key, tr) =>
    pageWith(
      [
        header("Dimas Arya", PB, { bg: "#fffbf5", font: FONTS.elegant, cta: linkButton(tr("Jadwalkan sesi", "Book a session"), "#jadwal", "primary", PB) }),
        section(
          "Hero",
          [
            grid(
              [
                col(
                  [
                    eyebrow(tr("Coach kepemimpinan & pembicara", "Leadership coach & speaker"), PB.primary),
                    heading(tr("Bantu pemimpin baru memimpin dengan tenang dan percaya diri", "Helping new leaders lead with calm and confidence"), "h1", { size: 50, color: PB.ink }),
                    para(tr("Lebih dari 600 manajer di 40 perusahaan telah mengikuti program coaching saya.", "Over 600 managers at 40 companies have joined my coaching programs."), { size: 18, color: PB.muted }),
                    inline([linkButton(tr("Jadwalkan sesi gratis", "Book a free session"), "#jadwal", "primary", PB), linkButton(tr("Tonton profil", "Watch intro"), "#video", "outline", PB)]),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                col([image(asset("brand-portrait"), "Dimas Arya", { ratio: "4 / 5", radius: 200 })], { name: "Foto" }),
              ],
              "minmax(0, 1.3fr) minmax(0, 1fr)",
              { gap: 56, align: "center" },
            ),
          ],
          { bg: "#fffbf5", padY: 96 },
        ),
        section(
          "Video",
          [stack([heading(tr("Kenali pendekatan saya dalam 2 menit", "Get to know my approach in 2 minutes"), "h2", { align: "center", color: PB.ink }), el("video", { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", title: tr("Video profil", "Intro video"), radius: 28 }, "Video")], { gap: 24, align: "stretch" })],
          { bg: pbTheme.alt, padY: 80, width: 900 },
        ),
        servicesSplit(pbTheme, tr, {
          eyebrow: tr("Program", "Programs"),
          title: tr("Tiga cara bekerja bersama", "Three ways to work together"),
          image: asset("pro-services"),
          items: [
            { icon: "1:1", title: tr("Coaching personal", "1:1 coaching"), text: tr("Enam sesi mingguan, fokus pada tantangan nyata Anda.", "Six weekly sessions focused on your real challenges.") },
            { icon: "👥", title: tr("Workshop tim", "Team workshops"), text: tr("Sesi setengah hari untuk menyelaraskan cara kerja tim.", "Half-day sessions to align how your team works.") },
            { icon: "🎤", title: tr("Pembicara", "Speaking"), text: tr("Keynote tentang kepemimpinan dan budaya kerja.", "Keynotes on leadership and work culture.") },
          ],
          cta: { label: tr("Lihat jadwal", "See availability"), href: "#jadwal" },
          reverse: true,
        }),
        testimonialsWall(pbTheme, tr, { title: tr("Kata mereka yang pernah dibimbing", "What past clients say") }),
        ctaBand(pbTheme, tr, { title: tr("Mulai dengan sesi perkenalan gratis", "Start with a free intro session"), text: tr("30 menit, daring, tanpa komitmen.", "30 minutes, online, no commitment."), primary: { label: tr("Pilih jadwal", "Pick a time"), href: "#jadwal" }, secondary: null }),
        footer("Dimas Arya", tr("Coach kepemimpinan berbasis di Yogyakarta.", "Leadership coach based in Yogyakarta."), [{ title: tr("Ikuti", "Follow"), items: ["LinkedIn", "YouTube", "Newsletter"] }], tr("© 2026 Dimas Arya. Konten contoh.", "© 2026 Dimas Arya. Sample content."), "#292524"),
      ],
      FONTS.sans,
      "#fffbf5",
    ),
};

/* ------------------------ 6. Restoran Saji (PREMIUM) ----------------- */

const RS: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#b45309", primaryDark: "#78350f", soft: "#fef3c7", line: "#e7d7b7" };
const rsTheme = theme(RS, { bg: "#fffdf7", alt: "#f7f1e3", dark: "#14532d", radius: 2, headFont: FONTS.elegant });

const menuRow = (name: string, desc: string, price: string) =>
  col(
    [
      col([heading(name, "h4", { size: 18, color: RS.ink, full: false }), heading(price, "h4", { size: 18, color: RS.primary, full: false })], { layout: "row", gap: 12, name: "Nama & harga", stackOnMobile: false }),
      para(desc, { size: 14, color: RS.muted }),
    ],
    { gap: 4, name: "Menu" },
  );

const rsFooter = (tr: Tr) =>
  footer("Saji", tr("Masakan Nusantara modern di Senopati, Jakarta.", "Modern Indonesian cuisine in Senopati, Jakarta."), [{ title: tr("Jam buka", "Hours"), items: [tr("Sel–Jum 11.00–22.00", "Tue–Fri 11am–10pm"), tr("Sab–Min 10.00–23.00", "Sat–Sun 10am–11pm")] }, { title: tr("Kontak", "Contact"), items: ["+62 21 0000 1234", "halo@saji.example"] }], tr("© 2026 Saji. Menu & harga contoh.", "© 2026 Saji. Sample menu & prices."), "#14532d");

export const restaurantSaji: TemplateContent = {
  brand: "Saji",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "menu", slug: { id: "menu", en: "menu" }, name: { id: "Menu", en: "Menu" } },
  ],
  build: (key, tr, href) => {
    const head = centeredHeader("SAJI", RS, { bg: "#fffdf7", font: FONTS.elegant });
    if (key === "menu")
      return pageWith(
        [
          head,
          section("Judul menu", [stack([eyebrow(tr("Menu musim ini", "This season's menu"), RS.primary, "center"), heading(tr("Rasa rumah, sentuhan baru", "Home flavors, new twists"), "h1", { align: "center", color: RS.ink, size: 46 })], { gap: 8, align: "stretch" })], { bg: "#fffdf7", padY: 64 }),
          section(
            "Daftar menu",
            [
              stack([el("tabs", {
                tabs: [
                  { title: tr("Pembuka", "Starters"), content: tr("Lumpia rebung · Rp45.000 — Sate lilit ikan · Rp55.000 — Perkedel jagung · Rp38.000", "Bamboo shoot spring rolls · Rp45,000 — Balinese fish satay · Rp55,000 — Corn fritters · Rp38,000") },
                  { title: tr("Utama", "Mains"), content: tr("Iga bakar rica · Rp145.000 — Gulai kepala ikan · Rp128.000 — Nasi liwet komplet · Rp85.000", "Grilled rica ribs · Rp145,000 — Fish head curry · Rp128,000 — Complete liwet rice · Rp85,000") },
                  { title: tr("Penutup", "Desserts"), content: tr("Klepon cake · Rp42.000 — Es teler modern · Rp40.000 — Pisang goreng madu · Rp35.000", "Klepon cake · Rp42,000 — Modern es teler · Rp40,000 — Honey banana fritters · Rp35,000") },
                ],
                variant: "pills",
                align: "center",
                widthMode: "full",
              }, "Tab menu")], { align: "stretch" }),
              grid([col([menuRow(tr("Rendang wagyu", "Wagyu rendang"), tr("Dimasak 8 jam dengan rempah Minang.", "Slow-cooked 8 hours with Minang spices."), "Rp185k"), menuRow(tr("Bebek betutu", "Betutu duck"), tr("Bebek utuh berbumbu Bali, dibungkus daun pisang.", "Whole Balinese-spiced duck in banana leaf."), "Rp160k")], { gap: 20, name: "Kolom" }), col([menuRow(tr("Sop buntut", "Oxtail soup"), tr("Kaldu bening, sayur segar, emping.", "Clear broth, fresh vegetables, emping crackers."), "Rp120k"), menuRow(tr("Ikan bakar jimbaran", "Jimbaran grilled fish"), tr("Ikan harian, sambal matah.", "Catch of the day, sambal matah."), "Rp135k")], { gap: 20, name: "Kolom" })], 2, { gap: 40 }),
            ],
            { bg: rsTheme.alt, padY: 72, width: 960 },
          ),
          ctaBand(rsTheme, tr, { title: tr("Pesan meja untuk malam ini", "Book a table for tonight"), primary: { label: tr("Reservasi", "Reserve"), href: href("home") }, secondary: null }),
          rsFooter(tr),
        ],
        FONTS.serif,
        "#fffdf7",
      );
    return pageWith(
      [
        head,
        section(
          "Hero",
          [
            grid(
              [
                col(
                  [
                    eyebrow(tr("Sejak 2019 · Jakarta Selatan", "Since 2019 · South Jakarta"), "#fcd34d"),
                    heading(tr("Masakan Nusantara, disajikan dengan cara baru", "Indonesian cuisine, served a new way"), "h1", { size: 52, color: "#ffffff" }),
                    para(tr("Bahan lokal dari petani mitra, resep keluarga, dan dapur terbuka.", "Local ingredients from partner farmers, family recipes, and an open kitchen."), { size: 18, color: "#d9f99d" }),
                    inline([linkButton(tr("Lihat menu", "See the menu"), href("menu"), "light", RS), linkButton(tr("Reservasi", "Reserve"), "#reservasi", "outline", { ...RS, primary: "#fcd34d", primaryDark: "#fde68a", soft: "#365314" })]),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                col([image(asset("food-hero"), tr("Hidangan unggulan", "Signature dish"), { ratio: "1 / 1", radius: 999 })], { name: "Gambar" }),
              ],
              "minmax(0, 1.2fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { bg: "#14532d", padY: 104 },
        ),
        portfolioMosaic(rsTheme, tr, {
          eyebrow: tr("Hidangan favorit", "Signature dishes"),
          title: tr("Yang paling sering dipesan", "Most ordered"),
          text: tr("Disiapkan setiap hari dari bahan segar.", "Prepared daily from fresh ingredients."),
          works: [
            { title: tr("Rendang wagyu", "Wagyu rendang"), tag: "Rp185.000", image: asset("food-1") },
            { title: tr("Bebek betutu", "Betutu duck"), tag: "Rp160.000", image: asset("food-2") },
            { title: tr("Sop buntut", "Oxtail soup"), tag: "Rp120.000", image: asset("food-3") },
            { title: tr("Klepon cake", "Klepon cake"), tag: "Rp42.000", image: asset("food-1") },
            { title: tr("Es teler", "Es teler"), tag: "Rp40.000", image: asset("food-2") },
          ],
          cta: { label: tr("Menu lengkap", "Full menu"), href: href("menu") },
        }),
        testimonialsWall(rsTheme, tr, { title: tr("Ulasan tamu", "Guest reviews"), caption: tr("di Google (1.240 ulasan)", "on Google (1,240 reviews)"), score: 4.8 }),
        section(
          "Reservasi",
          [
            grid(
              [
                col([eyebrow(tr("Reservasi", "Reservations"), RS.primary), heading(tr("Pesan meja Anda", "Book your table"), "h2", { color: RS.ink }), para(tr("Untuk rombongan lebih dari 10 orang, hubungi kami lewat telepon.", "For groups larger than 10, please call us."), { color: RS.muted })], { gap: 10, name: "Teks" }),
                col(
                  [
                    el("input", { labelText: tr("Nama", "Name"), text: tr("Nama Anda", "Your name") }, "Input nama"),
                    el("datepicker", { label: tr("Tanggal", "Date"), name: "tanggal", helper: tr("Kami buka Selasa–Minggu.", "Open Tuesday–Sunday."), focusColor: RS.primary }, "Tanggal"),
                    el("select", { labelText: tr("Jumlah tamu", "Guests"), placeholder: tr("Pilih", "Choose"), options: ["2", "3–4", "5–6", "7–10"], widthMode: "full" }, "Pilih tamu"),
                    button(tr("Kirim reservasi", "Send reservation"), RS, { full: true, type: "submit" }),
                    para(tr("Formulir contoh: hubungkan ke sistem reservasi Anda.", "Sample form: connect it to your booking system."), { size: 12, color: "#a8a29e" }),
                  ],
                  { card: { bg: "#ffffff", border: RS.line, radius: 2, padding: 28 }, gap: 14, name: "Formulir" },
                ),
              ],
              "minmax(0, 1fr) minmax(0, 1.2fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { bg: "#fffdf7", padY: 88 },
        ),
        rsFooter(tr),
      ],
      FONTS.serif,
      "#fffdf7",
    );
  },
};

/* ---------------------- 7. Properti Hunian (PREMIUM) ----------------- */

const RE: Palette = { ink: "#0f172a", muted: "#475569", primary: "#0f766e", primaryDark: "#115e59", soft: "#ccfbf1", line: "#d1fae5" };
const reTheme = theme(RE, { alt: "#f0fdfa", dark: "#042f2e", radius: 14 });

const listing = (tr: Tr, img: string, title: string, loc: string, price: string, badgeText?: string) =>
  col([listingCard({ image: asset(img), title, text: loc, price, badge: badgeText, cta: tr("Jadwalkan kunjungan", "Schedule a visit"), href: "#kunjungan", p: RE, rating: undefined })], { name: "Listing" });

const reFooter = (tr: Tr) =>
  footer("Hunian.id", tr("Agen properti terpercaya di Jabodetabek.", "Trusted property agents in Greater Jakarta."), [{ title: tr("Properti", "Properties"), items: [tr("Rumah", "Houses"), tr("Apartemen", "Apartments"), tr("Ruko", "Shophouses")] }, { title: tr("Kontak", "Contact"), items: ["+62 811 0000 2468", "halo@hunian.example"] }], tr("© 2026 Hunian.id. Listing & harga contoh.", "© 2026 Hunian.id. Sample listings & prices."), "#042f2e");

export const realestateHunian: TemplateContent = {
  brand: "Hunian.id",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "listings", slug: { id: "properti", en: "listings" }, name: { id: "Properti", en: "Listings" } },
  ],
  build: (key, tr, href) => {
    const head = header("Hunian.id", RE, { cta: linkButton(tr("Titip jual", "List your home"), "#jual", "primary", RE) });
    const listings = grid(
      [
        listing(tr, "estate-house-1", tr("Rumah Taman Asri", "Taman Asri House"), tr("BSD · 3 KT · 2 KM · 150 m²", "BSD · 3 bed · 2 bath · 150 m²"), "Rp2,4 M", tr("Baru", "New")),
        listing(tr, "estate-house-2", tr("Rumah Cluster Mentari", "Mentari Cluster Home"), tr("Bekasi · 4 KT · 3 KM · 180 m²", "Bekasi · 4 bed · 3 bath · 180 m²"), "Rp1,9 M"),
        listing(tr, "estate-house-3", tr("Townhouse Lavender", "Lavender Townhouse"), tr("Depok · 2 KT · 2 KM · 96 m²", "Depok · 2 bed · 2 bath · 96 m²"), "Rp1,1 M", tr("Promo", "Deal")),
      ],
      3,
      { gap: 24, align: "stretch" },
    );
    if (key === "listings")
      return pageWith(
        [
          head,
          section("Judul", [stack([heading(tr("Properti tersedia", "Available properties"), "h1", { color: RE.ink, size: 42 }), para(tr("Diperbarui setiap minggu oleh agen kami.", "Updated weekly by our agents."), { color: RE.muted })], { gap: 8 })], { bg: reTheme.alt, padY: 56 }),
          section("Daftar", [listings, grid([listing(tr, "estate-house-2", tr("Rumah Hook Kenanga", "Kenanga Corner House"), tr("Tangerang · 3 KT · 160 m²", "Tangerang · 3 bed · 160 m²"), "Rp2,1 M"), listing(tr, "estate-house-1", tr("Rumah Pohon Cemara", "Cemara Tree House"), tr("Bogor · 3 KT · 200 m²", "Bogor · 3 bed · 200 m²"), "Rp1,6 M"), listing(tr, "estate-house-3", tr("Apartemen Senja", "Senja Apartment"), tr("Jakarta · 2 KT · 72 m²", "Jakarta · 2 bed · 72 m²"), "Rp1,4 M")], 3, { gap: 24, align: "stretch" })], { bg: "#ffffff", padY: 64 }),
          section("KPR", [stack([heading(tr("Bandingkan opsi pembiayaan", "Compare financing options"), "h2", { align: "center", color: RE.ink }), el("comparison-table", { columns: ["KPR Bank", tr("KPR Syariah", "Sharia mortgage"), tr("Cash bertahap", "Installment cash")], rows: [tr("Uang muka | 10% | 15% | 30%", "Down payment | 10% | 15% | 30%"), tr("Tenor | 20 tahun | 15 tahun | 2 tahun", "Tenor | 20 years | 15 years | 2 years"), tr("Bunga tetap | 3 tahun | ya | tidak", "Fixed rate | 3 years | yes | no"), tr("Dibantu agen | ya | ya | ya", "Agent assisted | yes | yes | yes")], highlight: 1, caption: "", accentColor: RE.primary }, "Tabel Perbandingan")], { gap: 20, align: "stretch" })], { bg: reTheme.alt, padY: 80, width: 960 }),
          reFooter(tr),
        ],
        FONTS.sans,
      );
    return pageWith(
      [
        head,
        section(
          "Hero",
          [
            grid(
              [
                col(
                  [
                    badge(tr("1.200+ properti terverifikasi", "1,200+ verified properties"), RE.soft, RE.primaryDark),
                    heading(tr("Temukan rumah yang pas untuk keluarga Anda", "Find the right home for your family"), "h1", { size: 50, color: RE.ink }),
                    para(tr("Listing terverifikasi, harga transparan, dan agen yang mendampingi sampai serah terima.", "Verified listings, transparent pricing, and agents with you until handover."), { size: 18, color: RE.muted }),
                    col(
                      [
                        el("select", { labelText: tr("Lokasi", "Location"), placeholder: tr("Semua lokasi", "All locations"), options: ["Jakarta", "Tangerang", "Bekasi", "Depok", "Bogor"], widthMode: "full" }, "Lokasi"),
                        el("select", { labelText: tr("Tipe", "Type"), placeholder: tr("Semua tipe", "All types"), options: [tr("Rumah", "House"), tr("Apartemen", "Apartment"), tr("Ruko", "Shophouse")], widthMode: "full" }, "Tipe"),
                        linkButton(tr("Cari properti", "Search"), href("listings"), "primary", RE, { full: true }),
                      ],
                      { card: { bg: "#ffffff", border: RE.line, radius: 14, padding: 20 }, gap: 12, name: "Pencarian" },
                    ),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                col([image(asset("estate-city"), tr("Kota", "City"), { ratio: "4 / 5", radius: 24 })], { name: "Gambar" }),
              ],
              "minmax(0, 1.1fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { gradient: [RE.soft, "#ffffff", 180], padY: 88 },
        ),
        section("Pilihan", [stack([eyebrow(tr("Pilihan minggu ini", "This week's picks"), RE.primary), heading(tr("Properti unggulan", "Featured properties"), "h2", { color: RE.ink })], { gap: 6 }), listings, stack([linkButton(tr("Lihat semua properti", "See all properties"), href("listings"), "outline", RE)], { align: "center" })], { bg: "#ffffff", padY: 80 }),
        section("Angka", [stack([el("stats-counter", { items: [tr("1.200+ | Properti aktif", "1,200+ | Active listings"), tr("8.500 | Keluarga terbantu", "8,500 | Families helped"), tr("45 | Agen bersertifikat", "45 | Certified agents"), tr("14 hari | Rata-rata terjual", "14 days | Average time to sell")], accentColor: RE.primary, numberColor: RE.ink }, "Statistik Animasi")], { gap: 0, align: "stretch" })], { bg: reTheme.alt, padY: 72 }),
        teamCards(reTheme, tr, { title: tr("Agen yang siap membantu", "Agents ready to help"), members: [{ name: "Rudi Hartanto", role: tr("Agen senior · BSD", "Senior agent · BSD"), photo: asset("pro-team-1") }, { name: "Lina Marlina", role: tr("Agen · Bekasi", "Agent · Bekasi"), photo: asset("pro-team-2") }, { name: "Yoga Saputra", role: tr("Agen · Depok", "Agent · Depok"), photo: asset("pro-team-3") }, { name: "Fitri Ayu", role: tr("Konsultan KPR", "Mortgage consultant"), photo: asset("pro-team-4") }] }),
        faqAccordion(reTheme, tr, { items: [[tr("Apakah ada biaya untuk pembeli?", "Do buyers pay a fee?"), tr("Tidak. Komisi dibayar penjual.", "No. The seller pays the commission.")], [tr("Bisa bantu proses KPR?", "Can you help with a mortgage?"), tr("Bisa, konsultan kami bekerja sama dengan 12 bank.", "Yes, our consultants work with 12 banks.")], [tr("Berapa lama proses jual?", "How long does selling take?"), tr("Rata-rata 14 hari untuk properti dengan harga pasar.", "About 14 days on average for market-priced homes.")]] }),
        reFooter(tr),
      ],
      FONTS.sans,
    );
  },
};

/* ------------------------ 8. Kelas Online (PREMIUM) ------------------ */

const ED: Palette = { ink: "#1e293b", muted: "#475569", primary: "#2563eb", primaryDark: "#1d4ed8", soft: "#dbeafe", line: "#bfdbfe" };
const edTheme = theme(ED, { bg: "#ffffff", alt: "#fefce8", dark: "#1e3a8a", radius: 24, headFont: FONTS.rounded });

export const educationKelas: TemplateContent = {
  brand: "KelasKita",
  pages: [{ key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true }],
  build: (_key, tr) =>
    pageWith(
      [
        header("KelasKita", ED, { font: FONTS.rounded, cta: linkButton(tr("Daftar", "Enroll"), "#daftar", "primary", ED) }),
        section(
          "Hero",
          [
            grid(
              [
                col(
                  [
                    badge(tr("Batch Januari dibuka", "January batch open"), "#fef08a", "#854d0e", "#fde047"),
                    heading(tr("Belajar coding dari nol sampai siap kerja", "Learn to code from zero to job-ready"), "h1", { size: 50, color: ED.ink }),
                    para(tr("Kelas live 12 minggu, mentor industri, dan proyek portofolio nyata.", "12-week live classes, industry mentors, and real portfolio projects."), { size: 18, color: ED.muted }),
                    inline([linkButton(tr("Lihat kurikulum", "See curriculum"), "#kurikulum", "primary", ED), linkButton(tr("Konsultasi gratis", "Free consultation"), "#konsultasi", "outline", ED)]),
                    el("rating", { value: 4.8, caption: tr("dari 3.100 alumni", "from 3,100 alumni"), textColor: ED.muted }, "Rating"),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                col([image(asset("edu-books"), tr("Ilustrasi belajar", "Learning illustration"), { ratio: "5 / 4", radius: 32 })], { name: "Gambar" }),
              ],
              "minmax(0, 1.1fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { bg: "#fefce8", padY: 88 },
        ),
        featuresIcons(edTheme, tr, {
          eyebrow: tr("Kurikulum", "Curriculum"),
          title: tr("Empat modul, satu tujuan: kerja", "Four modules, one goal: a job"),
          items: [
            { icon: "🧱", title: "HTML & CSS", text: tr("Dasar web dan desain responsif.", "Web fundamentals and responsive design.") },
            { icon: "⚛️", title: "JavaScript & React", text: tr("Aplikasi interaktif modern.", "Modern interactive apps.") },
            { icon: "🗄️", title: "Backend & database", text: tr("API, autentikasi, dan PostgreSQL.", "APIs, authentication, and PostgreSQL.") },
            { icon: "🚀", title: tr("Proyek akhir", "Capstone"), text: tr("Bangun dan rilis produk nyata.", "Build and ship a real product.") },
          ],
        }),
        pricingCards(edTheme, tr, {
          eyebrow: tr("Biaya", "Tuition"),
          title: tr("Pilih jalur belajar", "Choose your track"),
          plans: [
            { name: tr("Mandiri", "Self-paced"), price: "Rp1,5jt", period: "", text: tr("Video + forum.", "Videos + forum."), features: [tr("Akses 12 bulan", "12-month access"), tr("Kuis otomatis", "Auto-graded quizzes")], cta: { label: tr("Pilih", "Choose"), href: "#daftar" } },
            { name: "Bootcamp", price: "Rp9,5jt", period: "", text: tr("Kelas live + mentor.", "Live classes + mentor."), features: [tr("Kelas live 3×/minggu", "Live classes 3×/week"), tr("Review kode", "Code reviews"), tr("Penyaluran kerja", "Job placement")], cta: { label: tr("Daftar bootcamp", "Join bootcamp"), href: "#daftar" }, featured: true },
            { name: tr("Korporat", "Corporate"), price: tr("Kustom", "Custom"), period: "", text: tr("Untuk tim perusahaan.", "For company teams."), features: [tr("Kurikulum khusus", "Custom curriculum"), tr("Laporan progres", "Progress reports")], cta: { label: tr("Hubungi kami", "Contact us"), href: "#kontak" } },
          ],
        }),
        teamCards(edTheme, tr, { title: tr("Belajar dari praktisi", "Learn from practitioners"), members: [{ name: "Fajar Nugroho", role: "Senior Engineer · Toko Kilat", photo: asset("pro-team-1") }, { name: "Intan Permata", role: "Frontend Lead · Jelajah Kita", photo: asset("pro-team-2") }, { name: "Arif Rahman", role: "Backend Engineer · Xendit", photo: asset("pro-team-3") }, { name: "Nadia Safitri", role: tr("Career coach", "Career coach"), photo: asset("pro-team-4") }] }),
        faqAccordion(edTheme, tr, { items: [[tr("Apakah harus punya latar IT?", "Do I need an IT background?"), tr("Tidak. 70% alumni berasal dari bidang lain.", "No. 70% of alumni came from other fields.")], [tr("Bisa dicicil?", "Can I pay in installments?"), tr("Bisa, hingga 12 bulan tanpa bunga.", "Yes, up to 12 months interest-free.")], [tr("Ada sertifikat?", "Is there a certificate?"), tr("Ada, plus portofolio proyek yang bisa ditunjukkan.", "Yes, plus a portfolio of projects to show.")]] }),
        footer("KelasKita", tr("Sekolah coding online untuk semua.", "An online coding school for everyone."), [{ title: tr("Program", "Programs"), items: ["Bootcamp", tr("Kelas mandiri", "Self-paced"), tr("Korporat", "Corporate")] }], tr("© 2026 KelasKita. Konten & harga contoh.", "© 2026 KelasKita. Sample content & prices."), "#1e3a8a"),
      ],
      FONTS.rounded,
    ),
};

