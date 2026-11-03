import { asset } from "../../assets";
import { badge, col, el, eyebrow, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "../../build";
import { ctaBand, faqAccordion, featuresIcons, heroSpotlight, statsBand, teamCards, testimonialsWall } from "../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../types";
import { FONTS, footer, header, pageWith, theme } from "./kit";

/* ================================================================== */
/* Template Pro set A: Portfolio (Free), Blog (Free), SaaS, Startup.     */
/* ================================================================== */

/* ----------------------- 1. Portfolio Minimal (FREE) ----------------- */

const PF: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#ea580c", primaryDark: "#c2410c", soft: "#fff7ed", line: "#e7e5e4" };
const pfTheme = theme(PF, { alt: "#fafaf9", radius: 6, headFont: FONTS.serif });

export const portfolioMinimal: TemplateContent = {
  brand: "Nadia Putri",
  pages: [{ key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true }],
  build: (_key, tr) => {
    const work = (img: string, title: string, meta: string) =>
      col([image(asset(img), title, { ratio: "4 / 3", radius: 6 }), heading(title, "h3", { size: 18, color: PF.ink }), para(meta, { size: 14, color: PF.muted })], { gap: 8, name: "Karya" });
    return pageWith(
      [
        header("Nadia Putri", PF, { cta: linkButton(tr("Kontak", "Contact"), "#kontak", "outline", PF), font: FONTS.serif }),
        section(
          "Intro",
          [
            grid(
              [
                col(
                  [
                    eyebrow(tr("Desainer produk · Bandung", "Product designer · Bandung"), PF.primary),
                    heading(tr("Saya merancang antarmuka yang tenang, jelas, dan mudah dipakai.", "I design calm, clear, easy-to-use interfaces."), "h1", { size: 46, color: PF.ink }),
                    para(tr("Tujuh tahun membantu startup dan UMKM membangun produk digital yang disukai pengguna.", "Seven years helping startups and small businesses build digital products people love."), { size: 18, color: PF.muted }),
                  ],
                  { gap: 16, name: "Teks intro" },
                ),
                col([el("text", { text: tr("Tersedia untuk proyek baru mulai November.", "Available for new projects from November."), tag: "p", fontSize: 14, fontWeight: 600, textColor: PF.primaryDark, widthMode: "full" }, "Status")], { card: { bg: PF.soft, radius: 6, padding: 20 }, name: "Status" }),
              ],
              "minmax(0, 2fr) minmax(0, 1fr)",
              { gap: 40, align: "end" },
            ),
          ],
          { bg: "#ffffff", padY: 96 },
        ),
        section(
          "Karya",
          [
            stack([heading(tr("Karya terpilih", "Selected work"), "h2", { color: PF.ink })], { gap: 0 }),
            grid([work("folio-1", "Ruang Baca", tr("Aplikasi perpustakaan · 2026", "Library app · 2026")), work("folio-2", "Pasar Pagi", tr("Toko online UMKM · 2025", "Small-business shop · 2025"))], 2, { gap: 28 }),
            grid([work("folio-3", "Jalan Sehat", tr("Pelacak kebugaran · 2025", "Fitness tracker · 2025")), work("folio-4", "Kas Kita", tr("Dasbor keuangan · 2024", "Finance dashboard · 2024"))], 2, { gap: 28 }),
          ],
          { bg: pfTheme.alt, padY: 80 },
        ),
        featuresIcons(pfTheme, tr, {
          eyebrow: tr("Keahlian", "Skills"),
          title: tr("Cara saya membantu", "How I can help"),
          items: [
            { icon: "◎", title: tr("Riset pengguna", "User research"), text: tr("Wawancara, uji kegunaan, dan peta perjalanan pengguna.", "Interviews, usability tests, and journey maps.") },
            { icon: "▢", title: tr("Desain UI", "UI design"), text: tr("Antarmuka rapi dengan sistem komponen yang konsisten.", "Tidy interfaces with a consistent component system.") },
            { icon: "↗", title: tr("Prototipe", "Prototyping"), text: tr("Prototipe interaktif untuk validasi sebelum dibangun.", "Interactive prototypes to validate before building.") },
          ],
        }),
        ctaBand(pfTheme, tr, { title: tr("Punya proyek menarik?", "Have an interesting project?"), text: tr("Ceritakan sedikit tentang ide Anda. Saya membalas dalam dua hari kerja.", "Tell me a little about your idea. I reply within two business days."), primary: { label: "halo@nadia.example", href: "mailto:halo@nadia.example" }, secondary: null }),
        footer("Nadia Putri", tr("Desainer produk independen.", "Independent product designer."), [{ title: tr("Sosial", "Social"), items: ["Dribbble", "LinkedIn", "Instagram"] }], tr("© 2026 Nadia Putri. Konten contoh.", "© 2026 Nadia Putri. Sample content."), "#1c1917"),
      ],
      FONTS.sans,
    );
  },
};

/* --------------------------- 2. Blog Jurnal (FREE) ------------------- */

const BL: Palette = { ink: "#111827", muted: "#4b5563", primary: "#0369a1", primaryDark: "#075985", soft: "#e0f2fe", line: "#e5e7eb" };
const blTheme = theme(BL, { radius: 12, headFont: FONTS.serif, alt: "#f9fafb" });

export const blogJournal: TemplateContent = {
  brand: "Catatan Kopi",
  pages: [{ key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true }],
  build: (_key, tr) => {
    const post = (img: string, cat: string, title: string, meta: string) =>
      col(
        [image(asset(img), title, { ratio: "16 / 10", radius: 12 }), badge(cat, BL.soft, BL.primaryDark), heading(title, "h3", { size: 20, color: BL.ink }), para(meta, { size: 13, color: BL.muted })],
        { gap: 10, name: "Artikel" },
      );
    const h1 = heading(tr("Kenapa kami meninggalkan rapat harian (dan apa yang terjadi)", "Why we dropped daily standups (and what happened)"), "h1", { size: 40, color: BL.ink });
    h1.advanced = { customCss: `${h1.advanced?.customCss}\n& { font-family: ${FONTS.serif}; }` };
    return pageWith(
      [
        header("Catatan Kopi", BL, { font: FONTS.serif }),
        section(
          "Artikel utama",
          [
            grid(
              [
                col([image(asset("blog-1"), tr("Ilustrasi artikel", "Article illustration"), { ratio: "4 / 3", radius: 16 })], { name: "Gambar" }),
                col([badge(tr("Kerja tim", "Teamwork"), BL.soft, BL.primaryDark), h1, para(tr("Eksperimen tiga bulan mengganti rapat dengan catatan tertulis: hasilnya mengejutkan.", "A three-month experiment replacing meetings with written notes: the results were surprising."), { size: 18, color: BL.muted }), para(tr("Oleh Rara · 8 menit baca", "By Rara · 8 min read"), { size: 14, color: BL.muted }), linkButton(tr("Baca artikel", "Read article"), "#artikel", "primary", BL)], { gap: 14, name: "Ringkasan" }),
              ],
              "minmax(0, 1.1fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { bg: "#ffffff", padY: 72 },
        ),
        section(
          "Artikel terbaru",
          [
            stack([heading(tr("Terbaru", "Latest"), "h2", { color: BL.ink })], { gap: 0 }),
            grid(
              [
                post("blog-2", tr("Produktivitas", "Productivity"), tr("Menulis dokumen desain yang benar-benar dibaca", "Writing design docs people actually read"), tr("12 Okt 2026 · 6 menit", "Oct 12, 2026 · 6 min")),
                post("blog-3", tr("Karier", "Career"), tr("Dari junior ke senior: hal yang tidak diajarkan", "Junior to senior: what nobody teaches you"), tr("5 Okt 2026 · 9 menit", "Oct 5, 2026 · 9 min")),
                post("blog-4", tr("Alat", "Tools"), tr("Lima alat kecil yang menghemat jam kerja kami", "Five small tools that save us hours"), tr("28 Sep 2026 · 4 menit", "Sep 28, 2026 · 4 min")),
              ],
              3,
              { gap: 28, align: "stretch" },
            ),
          ],
          { bg: blTheme.alt, padY: 72 },
        ),
        section(
          "Newsletter",
          [
            stack(
              [
                heading(tr("Satu email bagus setiap Jumat", "One good email every Friday"), "h2", { align: "center", color: BL.ink }),
                para(tr("Artikel pilihan tentang kerja tim, produk, dan kebiasaan kecil. Tanpa spam.", "Hand-picked articles on teamwork, product, and small habits. No spam."), { align: "center", color: BL.muted }),
                inline([el("input", { labelEnabled: false, text: "nama@email.com", inputType: "email" }, "Input email"), linkButton(tr("Berlangganan", "Subscribe"), "#berlangganan", "primary", BL)], { justify: "center" }),
              ],
              { gap: 12, align: "center" },
            ),
          ],
          { bg: "#ffffff", padY: 80, width: 720 },
        ),
        faqAccordion(blTheme, tr, {
          title: tr("Tentang blog ini", "About this blog"),
          items: [
            [tr("Seberapa sering artikel terbit?", "How often do you publish?"), tr("Dua artikel per minggu, Selasa dan Jumat.", "Two articles a week, Tuesday and Friday.")],
            [tr("Boleh mengirim tulisan tamu?", "Can I send a guest post?"), tr("Boleh. Kirim ringkasan ide ke redaksi lewat email.", "Yes. Send a short pitch to the editors by email.")],
            [tr("Apakah artikel boleh dikutip?", "Can I quote articles?"), tr("Silakan, sertakan tautan ke artikel asli.", "Go ahead, please link to the original article.")],
          ],
        }),
        footer("Catatan Kopi", tr("Blog tentang kerja tim dan membangun produk.", "A blog about teamwork and building products."), [{ title: tr("Kategori", "Categories"), items: [tr("Produktivitas", "Productivity"), tr("Karier", "Career"), tr("Alat", "Tools")] }], tr("© 2026 Catatan Kopi. Konten contoh.", "© 2026 Catatan Kopi. Sample content."), "#111827"),
      ],
      FONTS.sans,
      "#ffffff",
    );
  },
};

/* ----------------------- 3. SaaS Launch (PREMIUM) -------------------- */

const SA: Palette = { ink: "#0f172a", muted: "#475569", primary: "#6366f1", primaryDark: "#4338ca", soft: "#eef2ff", line: "#e0e7ff" };
const saTheme = theme(SA, { radius: 20, dark: "#0b1023", alt: "#f8fafc" });

const saasMega = (tr: Tr, href: (k: string) => string) =>
  el(
    "mega-menu",
    {
      items: [
        `${tr("Produk", "Product")} | ${href("features")}`,
        `- ${tr("Analitik", "Analytics")} | ${tr("Dasbor real-time", "Real-time dashboards")} | ${href("features")}`,
        `- ${tr("Otomasi", "Automation")} | ${tr("Alur kerja tanpa kode", "No-code workflows")} | ${href("features")}`,
        `- ${tr("Integrasi", "Integrations")} | ${tr("150+ aplikasi", "150+ apps")} | ${href("features")}`,
        `- ${tr("Keamanan", "Security")} | ${tr("SSO & audit log", "SSO & audit log")} | ${href("features")}`,
        `${tr("Harga", "Pricing")} | ${href("pricing")}`,
        `${tr("Beranda", "Home")} | ${href("home")}`,
      ],
      ctaText: tr("Coba gratis", "Try free"),
      ctaHref: href("pricing"),
      hoverColor: SA.primary,
      ctaBg: SA.primary,
    },
    "Mega Menu",
  );

const saasFooter = (tr: Tr) =>
  footer(
    "Metrika",
    tr("Analitik produk untuk tim yang bergerak cepat.", "Product analytics for fast-moving teams."),
    [
      { title: tr("Produk", "Product"), items: [tr("Fitur", "Features"), tr("Harga", "Pricing"), "Changelog"] },
      { title: tr("Perusahaan", "Company"), items: [tr("Tentang", "About"), tr("Karier", "Careers"), "Blog"] },
    ],
    tr("© 2026 Metrika. Konten & harga contoh.", "© 2026 Metrika. Sample content & prices."),
    "#0b1023",
  );

export const saasLaunch: TemplateContent = {
  brand: "Metrika",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "features", slug: { id: "fitur", en: "features" }, name: { id: "Fitur", en: "Features" } },
    { key: "pricing", slug: { id: "harga", en: "pricing" }, name: { id: "Harga", en: "Pricing" } },
  ],
  build: (key, tr, href) => {
    const head = header("Metrika", SA, { nav: saasMega(tr, href), sticky: true });
    if (key === "features")
      return pageWith(
        [
          head,
          heroSpotlight(saTheme, tr, { badge: tr("Fitur", "Features"), title: tr("Semua data produk Anda, satu tempat", "All your product data in one place"), text: tr("Lacak peristiwa, bangun funnel, dan otomatiskan laporan tanpa SQL.", "Track events, build funnels, and automate reports without SQL."), primary: { label: tr("Lihat harga", "See pricing"), href: href("pricing") }, secondary: { label: tr("Beranda", "Home"), href: href("home") }, image: asset("saas-dash"), note: "" }),
          featuresIcons(saTheme, tr, {
            title: tr("Dibangun untuk tim produk", "Built for product teams"),
            items: [
              { icon: "📈", title: tr("Funnel", "Funnels"), text: tr("Lihat di langkah mana pengguna berhenti.", "See where users drop off.") },
              { icon: "🔁", title: tr("Retensi", "Retention"), text: tr("Kohort mingguan otomatis.", "Automatic weekly cohorts.") },
              { icon: "🧪", title: tr("Eksperimen", "Experiments"), text: tr("Uji A/B dengan signifikansi statistik.", "A/B tests with statistical significance.") },
              { icon: "🔔", title: tr("Peringatan", "Alerts"), text: tr("Notifikasi saat metrik berubah drastis.", "Get notified when metrics swing.") },
              { icon: "🧩", title: tr("Integrasi", "Integrations"), text: tr("Hubungkan ke 150+ aplikasi.", "Connect to 150+ apps.") },
              { icon: "🛡️", title: tr("Keamanan", "Security"), text: tr("SSO, audit log, dan enkripsi.", "SSO, audit logs, and encryption.") },
            ],
          }),
          section("Perbandingan", [stack([heading(tr("Bandingkan dengan cara lama", "Compare with the old way"), "h2", { align: "center", color: SA.ink }), el("comparison-table", { columns: ["Spreadsheet", "Metrika"], rows: [tr("Data real-time | tidak | ya", "Real-time data | no | yes"), tr("Funnel otomatis | tidak | ya", "Automatic funnels | no | yes"), tr("Akses tim | Terbatas | Tanpa batas", "Team access | Limited | Unlimited"), tr("Waktu setup | Berhari-hari | 10 menit", "Setup time | Days | 10 minutes")], highlight: 2, caption: "", accentColor: SA.primary }, "Tabel Perbandingan")], { gap: 24, align: "stretch" })], { bg: saTheme.alt, padY: 88, width: 900 }),
          ctaBand(saTheme, tr, { primary: { label: tr("Mulai gratis", "Start free"), href: href("pricing") } }),
          saasFooter(tr),
        ],
        FONTS.sans,
      );
    if (key === "pricing")
      return pageWith(
        [
          head,
          section(
            "Harga",
            [
              stack([eyebrow(tr("Harga", "Pricing"), SA.primary, "center"), heading(tr("Mulai gratis, bayar saat tumbuh", "Start free, pay as you grow"), "h1", { align: "center", color: SA.ink, size: 44 }), para(tr("Harga contoh dalam Rupiah. Hemat 20% dengan tagihan tahunan.", "Sample prices in Rupiah. Save 20% with yearly billing."), { align: "center", color: SA.muted })], { gap: 10, align: "stretch" }),
              stack([el("pricing-switch", { monthlyLabel: tr("Bulanan", "Monthly"), yearlyLabel: tr("Tahunan", "Yearly"), saveBadge: tr("Hemat 20%", "Save 20%"), periodMonthly: tr("/bulan", "/month"), periodYearly: tr("/tahun", "/year"), plans: [tr("Starter | Rp0 | Rp0 | 1 proyek; 10rb peristiwa; Dasbor dasar | Mulai gratis", "Starter | Rp0 | Rp0 | 1 project; 10k events; Basic dashboards | Start free"), tr("Growth | Rp249rb | Rp2,4jt | 5 proyek; 1 jt peristiwa; Funnel & retensi; Peringatan | Coba Growth", "Growth | Rp249k | Rp2.4m | 5 projects; 1M events; Funnels & retention; Alerts | Try Growth"), tr("Scale | Rp899rb | Rp8,6jt | Proyek tanpa batas; 20 jt peristiwa; SSO & audit log; Manajer akun | Hubungi sales", "Scale | Rp899k | Rp8.6m | Unlimited projects; 20M events; SSO & audit log; Account manager | Contact sales")], featured: 2, accentColor: SA.primary, featuredBg: "#1e1b4b", ctaHref: "#daftar" }, "Harga Bulanan/Tahunan")], { gap: 0, align: "stretch" }),
            ],
            { gradient: [SA.soft, "#ffffff", 180], padY: 88 },
          ),
          faqAccordion(saTheme, tr, {
            items: [
              [tr("Apakah ada uji coba?", "Is there a trial?"), tr("Paket Growth gratis 14 hari, tanpa kartu kredit.", "Growth is free for 14 days, no credit card.")],
              [tr("Bisa ganti paket kapan saja?", "Can I switch plans any time?"), tr("Bisa, selisih dihitung prorata.", "Yes, the difference is prorated.")],
              [tr("Di mana data disimpan?", "Where is data stored?"), tr("Di pusat data Jakarta dengan cadangan harian.", "In a Jakarta data center with daily backups.")],
            ],
          }),
          saasFooter(tr),
        ],
        FONTS.sans,
      );
    return pageWith(
      [
        head,
        heroSpotlight(saTheme, tr, {
          badge: tr("Baru: laporan otomatis mingguan", "New: weekly automated reports"),
          title: tr("Pahami pengguna Anda dalam hitungan menit", "Understand your users in minutes"),
          text: tr("Metrika mengubah data peristiwa menjadi wawasan yang bisa langsung ditindaklanjuti tim produk.", "Metrika turns event data into insights your product team can act on right away."),
          primary: { label: tr("Coba gratis 14 hari", "Try free for 14 days"), href: href("pricing") },
          secondary: { label: tr("Lihat fitur", "See features"), href: href("features") },
          image: asset("saas-dash"),
        }),
        statsBand(saTheme, tr, { stats: [["3.200+", tr("Tim aktif", "Active teams")], ["1,2 M", tr("Peristiwa per hari", "Events per day")], ["99,98%", "Uptime"], ["4,9/5", tr("Rating G2", "G2 rating")]] }),
        featuresIcons(saTheme, tr, {
          title: tr("Dari data mentah ke keputusan", "From raw data to decisions"),
          items: [
            { icon: "⚙️", title: tr("Pasang dalam 10 menit", "Set up in 10 minutes"), text: tr("SDK ringan untuk web dan mobile.", "Lightweight SDK for web and mobile.") },
            { icon: "📊", title: tr("Dasbor siap pakai", "Ready-made dashboards"), text: tr("Template untuk aktivasi, retensi, dan pendapatan.", "Templates for activation, retention, and revenue.") },
            { icon: "🤝", title: tr("Untuk semua tim", "For every team"), text: tr("Bagikan laporan ke produk, marketing, dan manajemen.", "Share reports with product, marketing, and leadership.") },
          ],
        }),
        testimonialsWall(saTheme, tr, { dark: true }),
        ctaBand(saTheme, tr, { title: tr("Mulai pahami pengguna hari ini", "Start understanding users today"), primary: { label: tr("Lihat harga", "See pricing"), href: href("pricing") } }),
        saasFooter(tr),
      ],
      FONTS.sans,
    );
  },
};

/* ---------------------- 4. Startup Pitch (PREMIUM) ------------------- */

const ST: Palette = { ink: "#0a0a0a", muted: "#525252", primary: "#65a30d", primaryDark: "#3f6212", soft: "#ecfccb", line: "#e5e5e5" };
const stTheme = theme(ST, { radius: 4, dark: "#0a0a0a", alt: "#f5f5f4", headFont: FONTS.grotesk });

export const startupPitch: TemplateContent = {
  brand: "Panen.io",
  pages: [{ key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true }],
  build: (_key, tr) =>
    pageWith(
      [
        header("Panen.io", ST, { bg: "#0a0a0a", ink: "#ffffff", cta: linkButton(tr("Gabung waitlist", "Join waitlist"), "#waitlist", "light", ST), font: FONTS.grotesk }),
        section(
          "Hero",
          [
            grid(
              [
                col(
                  [
                    badge(tr("Seed round · 2026", "Seed round · 2026"), "#1a2e05", "#bef264", "#365314"),
                    el("typewriter", { prefix: tr("Pasar digital untuk", "A digital market for"), words: [tr("petani kecil", "smallholder farmers"), tr("koperasi desa", "village co-ops"), tr("dapur restoran", "restaurant kitchens")], tag: "h1", fontSize: 54, textColor: "#ffffff", wordColor: "#a3e635" }, "Teks Mengetik"),
                    para(tr("Panen.io menghubungkan 4.000 petani langsung ke dapur restoran. Harga adil, pengiriman H+1.", "Panen.io connects 4,000 farmers directly to restaurant kitchens. Fair prices, next-day delivery."), { size: 18, color: "#d4d4d4" }),
                    inline([linkButton(tr("Gabung waitlist", "Join waitlist"), "#waitlist", "light", ST), linkButton(tr("Unduh pitch deck", "Download pitch deck"), "#deck", "outline", { ...ST, primary: "#a3e635", primaryDark: "#bef264", soft: "#1a2e05" })]),
                  ],
                  { gap: 20, name: "Teks hero" },
                ),
                col([image(asset("startup-dash"), tr("Dasbor Panen.io", "Panen.io dashboard"), { ratio: "4 / 3", radius: 4 })], { name: "Gambar" }),
              ],
              "minmax(0, 1.2fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { bg: "#0a0a0a", padY: 112 },
        ),
        section(
          "Traksi",
          [
            stack([heading(tr("Traksi 12 bulan pertama", "First 12 months of traction"), "h2", { color: ST.ink }), el("stats-counter", { items: [tr("4.000+ | Petani terdaftar", "4,000+ | Farmers onboarded"), tr("320 | Restoran pelanggan", "320 | Restaurant customers"), tr("Rp18 M | GMV tahunan", "Rp18B | Annual GMV"), tr("62% | Repeat order", "62% | Repeat orders")], accentColor: ST.primary, numberColor: ST.ink }, "Statistik Animasi")], { gap: 28, align: "stretch" }),
          ],
          { bg: "#ffffff", padY: 88 },
        ),
        featuresIcons(stTheme, tr, {
          eyebrow: tr("Masalah → solusi", "Problem → solution"),
          title: tr("Rantai pasok yang lebih pendek dan adil", "A shorter, fairer supply chain"),
          items: [
            { icon: "1", title: tr("Tanpa tengkulak", "No middlemen"), text: tr("Petani menerima 30% lebih banyak per kilogram.", "Farmers earn 30% more per kilogram.") },
            { icon: "2", title: tr("Logistik pintar", "Smart logistics"), text: tr("Rute dioptimalkan, sisa makanan berkurang 40%.", "Optimized routes cut food waste by 40%.") },
            { icon: "3", title: tr("Pembayaran instan", "Instant payouts"), text: tr("Dana masuk ke petani di hari yang sama.", "Farmers are paid the same day.") },
          ],
        }),
        teamCards(stTheme, tr, { title: tr("Pendiri", "Founders"), text: tr("Pernah membangun logistik di startup ojek daring dan agritech di Kementan.", "Previously built logistics at a ride-hailing startup and agritech at the Ministry of Agriculture.") }),
        ctaBand(stTheme, tr, { title: tr("Tertarik berinvestasi atau bermitra?", "Interested in investing or partnering?"), primary: { label: "founders@panen.example", href: "mailto:founders@panen.example" }, secondary: null }),
        footer("Panen.io", tr("Pasar digital untuk hasil tani segar.", "A digital market for fresh produce."), [{ title: tr("Kontak", "Contact"), items: ["founders@panen.example", "Jakarta, Indonesia"] }], tr("© 2026 Panen.io. Konten contoh.", "© 2026 Panen.io. Sample content."), "#0a0a0a"),
      ],
      FONTS.grotesk,
    ),
};
