import { asset } from "../../assets";
import { badge, col, el, eyebrow, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "../../build";
import { ctaBand, faqAccordion, featuresIcons, portfolioMosaic, pricingCards, servicesSplit, statsBand, teamCards, testimonialsWall } from "../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../types";
import { FONTS, footer, header, listingCard, pageWith, theme } from "./kit";

/* ================================================================== */
/* Template Pro set D: Travel, Profesional, Creative Studio, Komunitas.  */
/* ================================================================== */

/* ----------------------- 13. Travel Jelajah (PREMIUM) ---------------- */

const TJ: Palette = { ink: "#0c4a6e", muted: "#475569", primary: "#0284c7", primaryDark: "#0369a1", soft: "#e0f2fe", line: "#bae6fd" };
const tjTheme = theme(TJ, { bg: "#ffffff", alt: "#f0f9ff", dark: "#082f49", radius: 22, headFont: FONTS.rounded });

const trip = (tr: Tr, img: string, title: string, text: string, price: string, badgeText?: string) =>
  col([listingCard({ image: asset(img), title, text, price, badge: badgeText, rating: 4.9, reviews: tr("(320 ulasan)", "(320 reviews)"), cta: tr("Lihat paket", "View trip"), href: "#paket", p: TJ })], { name: "Paket" });

export const travelJelajah: TemplateContent = {
  brand: "Jelajah",
  pages: [{ key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true }],
  build: (_key, tr) =>
    pageWith(
      [
        header("Jelajah", TJ, { font: FONTS.rounded, cta: linkButton(tr("Konsultasi gratis", "Free consultation"), "#kontak", "primary", TJ) }),
        section(
          "Hero",
          [
            grid(
              [
                col(
                  [
                    badge(tr("Open trip & private tour", "Open trips & private tours"), TJ.soft, TJ.primaryDark, TJ.line),
                    heading(tr("Jelajahi Indonesia tanpa ribet", "Explore Indonesia, hassle-free"), "h1", { size: 52, color: TJ.ink }),
                    para(tr("Paket perjalanan kurasi lokal: transportasi, penginapan, dan pemandu sudah termasuk.", "Locally curated trips: transport, stays, and guides included."), { size: 18, color: TJ.muted }),
                    inline([linkButton(tr("Lihat destinasi", "See destinations"), "#paket", "primary", TJ), linkButton(tr("Tanya admin", "Ask us"), "#kontak", "outline", TJ)]),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                col([image(asset("travel-hero"), tr("Pantai tropis", "Tropical beach"), { ratio: "4 / 3", radius: 28 })], { name: "Gambar" }),
              ],
              "minmax(0, 1.1fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { gradient: [TJ.soft, "#ffffff", 180], padY: 96 },
        ),
        section(
          "Promo",
          [
            stack(
              [
                heading(tr("Promo akhir tahun berakhir dalam", "Year-end deal ends in"), "h3", { align: "center", color: "#ffffff" }),
                el("countdown", { title: "", target: "2026-12-31T23:59", finishedText: tr("Promo telah berakhir.", "The deal has ended."), boxColor: "#0c4a6e", numberColor: "#ffffff", labelColor: "#bae6fd", titleColor: "#ffffff", radius: 14 }, "Countdown"),
              ],
              { gap: 16, align: "center" },
            ),
          ],
          { bg: "#0369a1", padY: 56 },
        ),
        section(
          "Destinasi",
          [
            stack([eyebrow(tr("Destinasi populer", "Popular destinations"), TJ.primary, "center"), heading(tr("Paket terlaris bulan ini", "This month's best sellers"), "h2", { align: "center", color: TJ.ink })], { gap: 8, align: "stretch" }),
            grid(
              [
                trip(tr, "travel-1", "Labuan Bajo", tr("3H2M · Live on board · Komodo", "3D2N · Liveaboard · Komodo"), "Rp4,9jt", tr("Terlaris", "Best seller")),
                trip(tr, "travel-2", "Bromo – Ijen", tr("3H2M · Sunrise & kawah biru", "3D2N · Sunrise & blue fire"), "Rp2,3jt"),
                trip(tr, "travel-3", "Raja Ampat", tr("5H4M · Diving & homestay", "5D4N · Diving & homestay"), "Rp9,8jt", tr("Baru", "New")),
              ],
              3,
              { gap: 24, align: "stretch" },
            ),
          ],
          { bg: "#ffffff", padY: 88 },
        ),
        featuresIcons(tjTheme, tr, {
          title: tr("Kenapa jalan bersama Jelajah", "Why travel with Jelajah"),
          items: [
            { icon: "🧭", title: tr("Pemandu lokal", "Local guides"), text: tr("Bersertifikat dan fasih berbahasa Inggris.", "Certified and fluent in English.") },
            { icon: "🛡️", title: tr("Asuransi perjalanan", "Travel insurance"), text: tr("Termasuk di semua paket.", "Included with every trip.") },
            { icon: "💬", title: tr("Admin 24 jam", "24-hour support"), text: tr("Siap membantu selama perjalanan.", "Here for you throughout the trip.") },
          ],
        }),
        testimonialsWall(tjTheme, tr, { title: tr("Cerita para pelancong", "Stories from travelers"), score: 4.9, caption: tr("dari 2.400 ulasan", "from 2,400 reviews") }),
        ctaBand(tjTheme, tr, { title: tr("Rencanakan liburan berikutnya", "Plan your next getaway"), primary: { label: tr("Chat WhatsApp", "Chat on WhatsApp"), href: "#kontak" }, secondary: null }),
        footer("Jelajah", tr("Agen perjalanan berizin sejak 2015.", "Licensed travel agency since 2015."), [{ title: tr("Destinasi", "Destinations"), items: ["Labuan Bajo", "Bromo", "Raja Ampat"] }, { title: tr("Kontak", "Contact"), items: ["+62 812 0000 1357", "halo@jelajah.example"] }], tr("© 2026 Jelajah. Harga contoh.", "© 2026 Jelajah. Sample prices."), "#082f49"),
      ],
      FONTS.rounded,
    ),
};

/* -------------------- 14. Professional Lexa (PREMIUM) ---------------- */

const LX: Palette = { ink: "#111827", muted: "#4b5563", primary: "#b8860b", primaryDark: "#8b6508", soft: "#fdf6e3", line: "#e5d3a1" };
const lxTheme = theme(LX, { bg: "#ffffff", alt: "#faf8f2", dark: "#111827", radius: 4, headFont: FONTS.serif });

const lxFooter = (tr: Tr) =>
  footer("Lexa & Partners", tr("Kantor hukum korporasi & ketenagakerjaan.", "Corporate & employment law firm."), [{ title: tr("Praktik", "Practice"), items: [tr("Korporasi", "Corporate"), tr("Ketenagakerjaan", "Employment"), tr("Litigasi", "Litigation")] }, { title: tr("Kantor", "Office"), items: ["Sudirman, Jakarta", "+62 21 555 0199"] }], tr("© 2026 Lexa & Partners. Konten contoh, bukan nasihat hukum.", "© 2026 Lexa & Partners. Sample content, not legal advice."), "#111827");

export const professionalLexa: TemplateContent = {
  brand: "Lexa & Partners",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "contact", slug: { id: "kontak", en: "contact" }, name: { id: "Kontak", en: "Contact" } },
  ],
  build: (key, tr, href) => {
    const head = header("LEXA & PARTNERS", LX, { bg: "#111827", ink: "#ffffff", font: FONTS.serif, cta: linkButton(tr("Konsultasi", "Consultation"), href("contact"), "primary", LX) });
    if (key === "contact")
      return pageWith(
        [
          head,
          section(
            "Kontak",
            [
              grid(
                [
                  col(
                    [
                      eyebrow(tr("Konsultasi awal", "Initial consultation"), LX.primary),
                      heading(tr("Ceritakan kebutuhan hukum Anda", "Tell us about your legal needs"), "h1", { color: LX.ink, size: 40 }),
                      para(tr("Konsultasi awal 30 menit tanpa biaya. Semua informasi dijaga kerahasiaannya.", "The first 30-minute consultation is free. Everything you share stays confidential."), { color: LX.muted }),
                      el("tooltip", { trigger: tr("Apa itu retainer?", "What is a retainer?"), tip: tr("Biaya bulanan tetap untuk akses konsultasi hukum rutin.", "A fixed monthly fee for ongoing legal advice."), triggerColor: LX.primaryDark, bgColor: "#111827" }, "Tooltip"),
                    ],
                    { gap: 14, name: "Teks" },
                  ),
                  col(
                    [
                      el("input", { labelText: tr("Nama / perusahaan", "Name / company"), text: tr("PT Contoh Jaya", "Example Co.") }, "Input nama"),
                      el("select", { labelText: tr("Bidang", "Practice area"), placeholder: tr("Pilih bidang", "Choose an area"), options: [tr("Korporasi", "Corporate"), tr("Ketenagakerjaan", "Employment"), tr("Litigasi", "Litigation"), tr("Kekayaan intelektual", "Intellectual property")], widthMode: "full" }, "Bidang"),
                      el("datepicker", { label: tr("Jadwal konsultasi", "Consultation slot"), name: "jadwal", mode: "datetime-local", helper: "", focusColor: LX.primary, radius: 4 }, "Jadwal"),
                      linkButton(tr("Kirim permintaan", "Send request"), "#kirim", "dark", LX, { full: true }),
                    ],
                    { gap: 14, card: { bg: "#ffffff", border: LX.line, radius: 4, padding: 28 }, name: "Formulir" },
                  ),
                ],
                2,
                { gap: 48, align: "start" },
              ),
            ],
            { bg: lxTheme.alt, padY: 96, width: 1120 },
          ),
          lxFooter(tr),
        ],
        FONTS.serif,
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
                    eyebrow(tr("Sejak 2004", "Since 2004"), "#e5d3a1"),
                    heading(tr("Kepastian hukum untuk bisnis yang bertumbuh", "Legal certainty for growing businesses"), "h1", { size: 50, color: "#ffffff" }),
                    para(tr("Mendampingi 300+ perusahaan dalam transaksi, kepatuhan, dan sengketa.", "Advising 300+ companies on transactions, compliance, and disputes."), { size: 18, color: "#d1d5db" }),
                    inline([linkButton(tr("Jadwalkan konsultasi", "Schedule a consultation"), href("contact"), "primary", LX)]),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                col([image(asset("law-city"), tr("Kantor di pusat kota", "Downtown office"), { ratio: "4 / 3", radius: 4 })], { name: "Gambar" }),
              ],
              "minmax(0, 1.2fr) minmax(0, 1fr)",
              { gap: 56, align: "center" },
            ),
          ],
          { bg: "#111827", padY: 104 },
        ),
        servicesSplit(lxTheme, tr, {
          eyebrow: tr("Area praktik", "Practice areas"),
          title: tr("Satu tim untuk seluruh siklus bisnis", "One team for the whole business lifecycle"),
          image: asset("law-city"),
          items: [
            { icon: "I", title: tr("Korporasi & M&A", "Corporate & M&A"), text: tr("Pendirian, investasi, merger, dan akuisisi.", "Formation, investment, mergers, and acquisitions.") },
            { icon: "II", title: tr("Ketenagakerjaan", "Employment"), text: tr("Peraturan perusahaan, PHK, dan hubungan industrial.", "Company regulations, terminations, and industrial relations.") },
            { icon: "III", title: tr("Litigasi", "Litigation"), text: tr("Sengketa komersial dan arbitrase.", "Commercial disputes and arbitration.") },
          ],
          cta: null,
        }),
        section("Angka", [stack([el("stats-counter", { items: [tr("20 | Tahun berpraktik", "20 | Years in practice"), tr("300+ | Klien korporasi", "300+ | Corporate clients"), tr("Rp12 T | Nilai transaksi", "Rp12T | Deal value"), tr("35 | Advokat", "35 | Lawyers")], accentColor: LX.primary, numberColor: LX.ink }, "Statistik Animasi")], { align: "stretch" })], { bg: "#ffffff", padY: 72 }),
        teamCards(lxTheme, tr, { eyebrow: tr("Partner", "Partners"), title: tr("Dipimpin advokat senior", "Led by senior lawyers"), text: "" }),
        faqAccordion(lxTheme, tr, {
          items: [
            [tr("Bagaimana struktur biaya?", "How are fees structured?"), tr("Per jam, per proyek, atau retainer bulanan.", "Hourly, per project, or monthly retainer.")],
            [tr("Apakah melayani UMKM?", "Do you work with SMEs?"), tr("Ya, dengan paket retainer khusus.", "Yes, with dedicated retainer packages.")],
          ],
        }),
        lxFooter(tr),
      ],
      FONTS.serif,
    );
  },
};

/* --------------------- 15. Creative Studio (PREMIUM) ----------------- */

const CS: Palette = { ink: "#18181b", muted: "#52525b", primary: "#ec4899", primaryDark: "#db2777", soft: "#fce7f3", line: "#fbcfe8" };
const csTheme = theme(CS, { bg: "#ffffff", alt: "#fdf2f8", dark: "#18181b", radius: 28, headFont: FONTS.grotesk });

const csMega = (tr: Tr, href: (k: string) => string) =>
  el(
    "mega-menu",
    {
      items: [
        `${tr("Layanan", "Services")} | ${href("home")}#layanan`,
        `- Branding | ${tr("Identitas & logo", "Identity & logo")} | ${href("home")}#layanan`,
        `- ${tr("Motion", "Motion")} | ${tr("Animasi & video", "Animation & video")} | ${href("home")}#layanan`,
        `- Web | ${tr("Situs & produk digital", "Sites & digital products")} | ${href("home")}#layanan`,
        `${tr("Karya", "Work")} | ${href("work")}`,
        `${tr("Kontak", "Contact")} | ${href("contact")}`,
      ],
      ctaText: tr("Mulai proyek", "Start a project"),
      ctaHref: href("contact"),
      hoverColor: CS.primary,
      ctaBg: CS.primary,
    },
    "Mega Menu",
  );

const csFooter = (tr: Tr) =>
  footer("Studio Warna", tr("Studio branding, motion, dan web.", "A branding, motion, and web studio."), [{ title: "Studio", items: [tr("Karya", "Work"), tr("Layanan", "Services"), tr("Karier", "Careers")] }, { title: tr("Kontak", "Contact"), items: ["hello@warna.example", "Jakarta · Remote"] }], tr("© 2026 Studio Warna. Karya contoh.", "© 2026 Studio Warna. Sample work."), "#18181b");

export const creativeStudio: TemplateContent = {
  brand: "Studio Warna",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "work", slug: { id: "karya", en: "work" }, name: { id: "Karya", en: "Work" } },
    { key: "contact", slug: { id: "kontak", en: "contact" }, name: { id: "Kontak", en: "Contact" } },
  ],
  build: (key, tr, href) => {
    const head = header("warna✳", CS, { nav: csMega(tr, href), font: FONTS.grotesk, sticky: true });
    if (key === "work")
      return pageWith(
        [
          head,
          section(
            "Showreel",
            [
              stack(
                [
                  el(
                    "slider",
                    {
                      slides: [
                        { title: "Kopi Senja — rebrand", text: tr("Identitas baru untuk 40 gerai.", "A new identity for 40 stores."), bg: "#db2777" },
                        { title: "Finly — motion system", text: tr("120 animasi mikro di aplikasi.", "120 in-app micro animations."), bg: "#7c3aed" },
                        { title: "Rumah Batik — web", text: tr("Toko online dengan konversi naik 2x.", "Online store with 2x conversion."), bg: "#0f766e" },
                      ],
                      height: 380,
                      radius: 28,
                    },
                    "Slider",
                  ),
                ],
                { align: "stretch" },
              ),
            ],
            { bg: "#ffffff", padY: 48 },
          ),
          portfolioMosaic(csTheme, tr, { eyebrow: tr("Arsip", "Archive"), title: tr("Karya 2023–2026", "Work 2023–2026"), cta: null }),
          csFooter(tr),
        ],
        FONTS.grotesk,
      );
    if (key === "contact")
      return pageWith(
        [
          head,
          section(
            "Brief",
            [stack([eyebrow(tr("Mulai proyek", "Start a project"), CS.primary, "center"), heading(tr("Pilih paket, lalu kirim brief singkat", "Pick a package, then send a short brief"), "h1", { align: "center", color: CS.ink, size: 44 })], { gap: 8, align: "stretch" })],
            { bg: csTheme.alt, padY: 72 },
          ),
          section(
            "Paket",
            [stack([el("pricing-switch", { monthlyLabel: tr("Per proyek", "Per project"), yearlyLabel: tr("Retainer", "Retainer"), saveBadge: tr("Hemat 15%", "Save 15%"), periodMonthly: "", periodYearly: tr("/bulan", "/month"), plans: [tr("Brand Kit | Rp25jt | Rp7jt | Logo; Palet & tipografi; Panduan merek | Pilih", "Brand Kit | Rp25m | Rp7m | Logo; Palette & type; Brand guide | Choose"), tr("Brand + Web | Rp60jt | Rp15jt | Semua di Brand Kit; Situs 6 halaman; Animasi logo | Pilih", "Brand + Web | Rp60m | Rp15m | Everything in Brand Kit; 6-page site; Logo animation | Choose"), tr("Studio | Rp120jt | Rp28jt | Tim khusus; Kampanye motion; Prioritas | Hubungi kami", "Studio | Rp120m | Rp28m | Dedicated team; Motion campaigns; Priority | Contact us")], featured: 2, accentColor: CS.primary, featuredBg: "#18181b", ctaHref: "#brief" }, "Harga Bulanan/Tahunan")], { align: "stretch" })],
            { bg: "#ffffff", padY: 64 },
          ),
          section(
            "Formulir",
            [
              stack(
                [
                  el("input", { labelText: tr("Nama & perusahaan", "Name & company"), text: tr("Nama Anda", "Your name") }, "Input nama"),
                  el("input", { labelText: "Email", text: "nama@perusahaan.com", inputType: "email" }, "Input email"),
                  el("datepicker", { label: tr("Target peluncuran", "Launch target"), name: "target", mode: "month", required: false, helper: "", focusColor: CS.primary, radius: 14 }, "Target"),
                  linkButton(tr("Kirim brief", "Send brief"), "#brief", "primary", CS, { full: true }),
                ],
                { gap: 14, align: "stretch" },
              ),
            ],
            { bg: "#ffffff", padY: 48, width: 640 },
          ),
          csFooter(tr),
        ],
        FONTS.grotesk,
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
                    el("typewriter", { prefix: tr("Kami membuat merek", "We make brands"), words: [tr("berani", "bold"), tr("hidup", "alive"), tr("diingat", "memorable")], tag: "h1", fontSize: 64, textColor: CS.ink, wordColor: CS.primary }, "Teks Mengetik"),
                    para(tr("Studio branding, motion, dan web untuk perusahaan yang ingin tampil beda.", "A branding, motion, and web studio for companies that want to stand out."), { size: 19, color: CS.muted }),
                    inline([linkButton(tr("Lihat karya", "See our work"), href("work"), "dark", CS), linkButton(tr("Mulai proyek", "Start a project"), href("contact"), "outline", CS)]),
                  ],
                  { gap: 22, name: "Teks hero" },
                ),
                col([image(asset("creative-hero"), tr("Karya studio", "Studio work"), { ratio: "1 / 1", radius: 28 })], { name: "Gambar" }),
              ],
              "minmax(0, 1.2fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { gradient: [CS.soft, "#ffffff", 200], padY: 104 },
        ),
        statsBand(csTheme, tr, { stats: [["140+", tr("Merek diluncurkan", "Brands launched")], ["12", tr("Penghargaan desain", "Design awards")], ["9", tr("Negara klien", "Client countries")], ["4,9/5", tr("Kepuasan klien", "Client satisfaction")]] }),
        portfolioMosaic(csTheme, tr, { eyebrow: tr("Karya pilihan", "Selected work"), title: tr("Proyek terbaru", "Recent projects"), cta: { label: tr("Semua karya", "All work"), href: href("work") } }),
        servicesSplit(csTheme, tr, { eyebrow: tr("Layanan", "Services"), title: tr("Dari strategi hingga piksel terakhir", "From strategy to the last pixel"), image: asset("pro-services"), cta: { label: tr("Mulai proyek", "Start a project"), href: href("contact") } }),
        testimonialsWall(csTheme, tr, { title: tr("Kata klien", "Client words") }),
        ctaBand(csTheme, tr, { title: tr("Punya ide besar?", "Got a big idea?"), primary: { label: tr("Ceritakan ke kami", "Tell us about it"), href: href("contact") }, secondary: null }),
        csFooter(tr),
      ],
      FONTS.grotesk,
    );
  },
};

/* ----------------------- 16. Community Kita (PREMIUM) --------------- */

const CK: Palette = { ink: "#2e1065", muted: "#5b21b6", primary: "#7c3aed", primaryDark: "#6d28d9", soft: "#ede9fe", line: "#ddd6fe" };
const ckTheme = theme(CK, { bg: "#ffffff", alt: "#faf5ff", dark: "#2e1065", radius: 24, headFont: FONTS.rounded });

export const communityKita: TemplateContent = {
  brand: "KitaDev",
  pages: [{ key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true }],
  build: (_key, tr) =>
    pageWith(
      [
        header("KitaDev", CK, { font: FONTS.rounded, cta: linkButton(tr("Gabung", "Join"), "#gabung", "primary", CK) }),
        section(
          "Hero",
          [
            grid(
              [
                col(
                  [
                    badge(tr("12.000 anggota · 18 kota", "12,000 members · 18 cities"), CK.soft, CK.primaryDark, CK.line),
                    heading(tr("Tempat developer Indonesia belajar bareng", "Where Indonesian developers learn together"), "h1", { size: 50, color: CK.ink }),
                    para(tr("Meetup bulanan, mentoring, dan forum diskusi yang ramah pemula.", "Monthly meetups, mentoring, and a beginner-friendly forum."), { size: 18, color: CK.muted }),
                    inline([linkButton(tr("Gabung gratis", "Join for free"), "#gabung", "primary", CK), linkButton(tr("Lihat acara", "See events"), "#acara", "outline", CK)]),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                col([image(asset("community-people"), tr("Anggota komunitas", "Community members"), { ratio: "4 / 3", radius: 24 })], { name: "Gambar" }),
              ],
              "minmax(0, 1.1fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { gradient: [CK.soft, "#ffffff", 170], padY: 96 },
        ),
        section(
          "Acara berikutnya",
          [
            grid(
              [
                col([eyebrow(tr("Meetup berikutnya", "Next meetup"), "#ddd6fe"), heading(tr("KitaDev Jakarta #48: Web performance", "KitaDev Jakarta #48: Web performance"), "h2", { color: "#ffffff" }), para(tr("Sabtu, 14 November · Co-working Kuningan · gratis", "Saturday, November 14 · Kuningan co-working · free"), { color: "#e9d5ff" })], { gap: 10, name: "Info acara" }),
                col([el("countdown", { title: "", target: "2026-11-14T10:00", finishedText: tr("Acara sedang berlangsung!", "Happening now!"), boxColor: "#4c1d95", numberColor: "#ffffff", labelColor: "#ddd6fe", titleColor: "#ffffff", radius: 16 }, "Countdown")], { name: "Hitung mundur" }),
              ],
              2,
              { gap: 40, align: "center" },
            ),
          ],
          { bg: "#2e1065", padY: 72 },
        ),
        featuresIcons(ckTheme, tr, {
          title: tr("Yang kamu dapat", "What you get"),
          items: [
            { icon: "📅", title: "Meetup", text: tr("Sesi bulanan di 18 kota.", "Monthly sessions in 18 cities.") },
            { icon: "🧑‍🏫", title: "Mentoring", text: tr("Dipasangkan dengan engineer senior.", "Get paired with a senior engineer.") },
            { icon: "💼", title: tr("Info kerja", "Job board"), text: tr("Lowongan eksklusif dari mitra.", "Exclusive openings from partners.") },
          ],
        }),
        pricingCards(ckTheme, tr, {
          eyebrow: tr("Keanggotaan", "Membership"),
          title: tr("Gratis selamanya, dukung kalau mau", "Free forever, support if you like"),
          badge: tr("Favorit", "Popular"),
          plans: [
            { name: tr("Anggota", "Member"), price: "Rp0", period: "", text: tr("Akses dasar.", "Basic access."), features: [tr("Forum", "Forum"), tr("Meetup terbuka", "Open meetups")], cta: { label: tr("Gabung", "Join"), href: "#gabung" } },
            { name: tr("Pendukung", "Supporter"), price: "Rp50rb", period: tr("/bulan", "/month"), text: tr("Bantu acara tetap gratis.", "Keep events free."), features: [tr("Rekaman sesi", "Session recordings"), tr("Kaos tahunan", "Yearly T-shirt"), tr("Prioritas mentoring", "Mentoring priority")], cta: { label: tr("Dukung", "Support"), href: "#gabung" }, featured: true },
          ],
        }),
        teamCards(ckTheme, tr, { eyebrow: tr("Pengurus", "Organizers"), title: tr("Dijalankan oleh relawan", "Run by volunteers"), text: "" }),
        faqAccordion(ckTheme, tr, {
          items: [
            [tr("Harus jago coding dulu?", "Do I need to be good at coding?"), tr("Tidak, banyak anggota baru mulai belajar.", "No, many members are just starting out.")],
            [tr("Bisa jadi pembicara?", "Can I give a talk?"), tr("Bisa, kirim topik lewat formulir CFP.", "Yes, submit a topic through the CFP form.")],
          ],
        }),
        footer("KitaDev", tr("Komunitas developer nirlaba.", "A non-profit developer community."), [{ title: tr("Komunitas", "Community"), items: ["Discord", "Meetup", "YouTube"] }], tr("© 2026 KitaDev. Konten contoh.", "© 2026 KitaDev. Sample content."), "#2e1065"),
      ],
      FONTS.rounded,
    ),
};
