import { asset } from "../../assets";
import { badge, col, el, eyebrow, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "../../build";
import { ctaBand, faqAccordion, featuresIcons, portfolioMosaic, pricingCards, servicesSplit, statsBand, teamCards, testimonialsWall } from "../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../types";
import { FONTS, centeredHeader, footer, header, pageWith, theme } from "./kit";

/* ================================================================== */
/* Template Pro set C: Event, Fotografi, Teknologi, Kesehatan.           */
/* ================================================================== */

/* ----------------------- 9. Event Summit (PREMIUM) ------------------- */

const EV: Palette = { ink: "#1e1b4b", muted: "#4c1d95", primary: "#c026d3", primaryDark: "#a21caf", soft: "#fae8ff", line: "#f5d0fe" };
const evTheme = theme(EV, { bg: "#ffffff", alt: "#fdf4ff", dark: "#1e1b4b", radius: 16, headFont: FONTS.grotesk });

const evFooter = (tr: Tr) =>
  footer("Nusa Summit", tr("Konferensi produk & teknologi tahunan.", "The annual product & technology conference."), [{ title: tr("Acara", "Event"), items: [tr("Jadwal", "Schedule"), tr("Pembicara", "Speakers"), tr("Tiket", "Tickets")] }, { title: tr("Kontak", "Contact"), items: ["halo@summit.example", "JCC Senayan, Jakarta"] }], tr("© 2026 Nusa Summit. Konten contoh.", "© 2026 Nusa Summit. Sample content."), "#1e1b4b");

const sessionTab = (tr: Tr, day: string, items: [string, string][]) => ({
  title: day,
  content: items.map(([time, talk]) => `${time} · ${talk}`).join(" — ") || tr("Segera diumumkan", "To be announced"),
});

export const eventSummit: TemplateContent = {
  brand: "Nusa Summit",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "schedule", slug: { id: "jadwal", en: "schedule" }, name: { id: "Jadwal", en: "Schedule" } },
  ],
  build: (key, tr, href) => {
    const head = header("Nusa Summit", EV, { bg: "#1e1b4b", ink: "#ffffff", font: FONTS.grotesk, cta: linkButton(tr("Beli tiket", "Get tickets"), href("home") + "#tiket", "primary", EV), sticky: true });
    const banner = section(
      "Pengumuman",
      [stack([el("banner", { badge: tr("Early bird", "Early bird"), text: tr("Diskon 30% untuk 200 tiket pertama.", "30% off the first 200 tickets."), linkText: tr("Ambil sekarang", "Grab yours"), href: "#tiket", bgColor: "#a21caf", badgeBg: "#fde047", badgeText: "#1e1b4b", linkColor: "#fae8ff", radius: 0 }, "Banner")], { align: "stretch" })],
      { bg: "#a21caf", padY: 0, width: 1400 },
    );
    if (key === "schedule")
      return pageWith(
        [
          banner,
          head,
          section("Judul", [stack([eyebrow(tr("12–13 Maret 2027", "March 12–13, 2027"), EV.primary, "center"), heading(tr("Jadwal dua hari", "Two-day schedule"), "h1", { align: "center", color: EV.ink, size: 46 })], { gap: 8, align: "stretch" })], { bg: evTheme.alt, padY: 64 }),
          section(
            "Agenda",
            [
              stack(
                [
                  el(
                    "tabs",
                    {
                      tabs: [
                        sessionTab(tr, tr("Hari 1", "Day 1"), [["09:00", tr("Pembukaan & keynote", "Opening & keynote")], ["10:30", tr("Membangun produk AI yang dipercaya", "Building trustworthy AI products")], ["13:00", tr("Panel: ekosistem startup 2027", "Panel: the 2027 startup ecosystem")], ["16:00", tr("Networking", "Networking")]]),
                        sessionTab(tr, tr("Hari 2", "Day 2"), [["09:00", tr("Workshop desain sistem", "Design systems workshop")], ["11:00", tr("Skala infrastruktur di Indonesia", "Scaling infrastructure in Indonesia")], ["14:00", tr("Demo day 10 startup", "Demo day: 10 startups")], ["17:00", tr("Penutupan", "Closing")]]),
                      ],
                      variant: "pills",
                      align: "center",
                      widthMode: "full",
                    },
                    "Tab agenda",
                  ),
                ],
                { align: "stretch" },
              ),
            ],
            { bg: "#ffffff", padY: 72, width: 960 },
          ),
          teamCards(evTheme, tr, { eyebrow: tr("Pembicara", "Speakers"), title: tr("Belajar dari praktisi", "Learn from practitioners"), text: "" }),
          evFooter(tr),
        ],
        FONTS.grotesk,
      );
    return pageWith(
      [
        banner,
        head,
        section(
          "Hero",
          [
            stack(
              [
                badge(tr("12–13 Maret 2027 · Jakarta", "March 12–13, 2027 · Jakarta"), "#312e81", "#f5d0fe", "#4c1d95"),
                heading(tr("Dua hari, 40 pembicara, 2.000 pembangun produk", "Two days, 40 speakers, 2,000 product builders"), "h1", { size: 56, color: "#ffffff", align: "center" }),
                para(tr("Konferensi untuk tim produk, desain, dan engineering di Asia Tenggara.", "A conference for product, design, and engineering teams in Southeast Asia."), { size: 18, color: "#e9d5ff", align: "center" }),
                el("countdown", { title: tr("Acara dimulai dalam", "Event starts in"), target: "2027-03-12T09:00", finishedText: tr("Acara sedang berlangsung!", "The event is live!"), boxColor: "#312e81", numberColor: "#ffffff", labelColor: "#c4b5fd", titleColor: "#f5d0fe", radius: 14 }, "Countdown"),
                inline([linkButton(tr("Beli tiket", "Get tickets"), "#tiket", "primary", EV), linkButton(tr("Lihat jadwal", "See schedule"), href("schedule"), "light", EV)], { justify: "center" }),
              ],
              { gap: 22, align: "center" },
            ),
          ],
          { gradient: ["#1e1b4b", "#701a75", 135], padY: 112, width: 960 },
        ),
        section("Panggung", [stack([image(asset("event-stage"), tr("Panggung utama", "Main stage"), { ratio: "21 / 9", radius: 16, shadow: true })], { align: "stretch" })], { bg: "#ffffff", padY: 56 }),
        featuresIcons(evTheme, tr, {
          eyebrow: tr("Kenapa hadir", "Why attend"),
          title: tr("Lebih dari sekadar sesi", "More than talks"),
          items: [
            { icon: "🎤", title: tr("40 sesi", "40 sessions"), text: tr("Keynote, panel, dan studi kasus dari tim lokal.", "Keynotes, panels, and case studies from local teams.") },
            { icon: "🛠️", title: tr("12 workshop", "12 workshops"), text: tr("Praktik langsung dengan kelompok kecil.", "Hands-on practice in small groups.") },
            { icon: "🤝", title: tr("Networking", "Networking"), text: tr("Temu mentor, investor, dan rekan sesama pembangun.", "Meet mentors, investors, and fellow builders.") },
          ],
        }),
        teamCards(evTheme, tr, { eyebrow: tr("Pembicara utama", "Keynote speakers"), title: tr("Dari tim yang membangun produk jutaan pengguna", "From teams building products for millions") }),
        pricingCards(evTheme, tr, {
          eyebrow: tr("Tiket", "Tickets"),
          title: tr("Pilih akses Anda", "Choose your pass"),
          text: tr("Harga contoh, sudah termasuk makan siang.", "Sample prices, lunch included."),
          badge: tr("Terlaris", "Best seller"),
          plans: [
            { name: tr("Mahasiswa", "Student"), price: "Rp350rb", period: "", text: tr("Kartu pelajar aktif.", "Valid student ID."), features: [tr("Akses 2 hari", "2-day access"), tr("Sesi utama", "Main sessions")], cta: { label: tr("Pilih", "Choose"), href: "#tiket" } },
            { name: "Regular", price: "Rp1,2jt", period: "", text: tr("Untuk profesional.", "For professionals."), features: [tr("Akses 2 hari", "2-day access"), tr("Semua sesi", "All sessions"), tr("1 workshop", "1 workshop")], cta: { label: tr("Pilih", "Choose"), href: "#tiket" }, featured: true },
            { name: "VIP", price: "Rp3,5jt", period: "", text: tr("Pengalaman penuh.", "The full experience."), features: [tr("Semua workshop", "All workshops"), tr("Makan malam pembicara", "Speaker dinner"), tr("Kursi depan", "Front-row seats")], cta: { label: tr("Pilih", "Choose"), href: "#tiket" } },
          ],
        }),
        faqAccordion(evTheme, tr, {
          items: [
            [tr("Apakah ada siaran langsung?", "Is there a livestream?"), tr("Keynote disiarkan langsung, sesi lain tersedia ulang untuk pemegang tiket.", "Keynotes are livestreamed; other sessions are available on demand for ticket holders.")],
            [tr("Bisa refund?", "Can I get a refund?"), tr("Refund penuh hingga 30 hari sebelum acara.", "Full refund up to 30 days before the event.")],
          ],
        }),
        evFooter(tr),
      ],
      FONTS.grotesk,
    );
  },
};

/* -------------------- 10. Photography Lensa (PREMIUM) ---------------- */

const PH: Palette = { ink: "#1c1917", muted: "#78716c", primary: "#78716c", primaryDark: "#44403c", soft: "#f5f5f4", line: "#e7e5e4" };
const phTheme = theme(PH, { bg: "#fafaf9", alt: "#f5f5f4", dark: "#0c0a09", radius: 0, headFont: FONTS.elegant });

const phFooter = (tr: Tr) =>
  footer("Lensa", tr("Fotografi pernikahan & editorial.", "Wedding & editorial photography."), [{ title: tr("Kontak", "Contact"), items: ["halo@lensa.example", "Yogyakarta · Bali"] }], tr("© 2026 Lensa Studio. Foto contoh.", "© 2026 Lensa Studio. Sample photos."), "#0c0a09");

export const photographyLensa: TemplateContent = {
  brand: "Lensa",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "gallery", slug: { id: "galeri", en: "gallery" }, name: { id: "Galeri", en: "Gallery" } },
  ],
  build: (key, tr, href) => {
    const head = centeredHeader("LENSA", PH, { bg: "#fafaf9", font: FONTS.elegant });
    if (key === "gallery") {
      const shot = (n: number, alt: string, ratio: string) => col([image(asset(`photo-${n}`), alt, { ratio, radius: 0 })], { name: "Foto" });
      return pageWith(
        [
          head,
          section("Judul", [stack([heading(tr("Galeri", "Gallery"), "h1", { align: "center", color: PH.ink, size: 48 }), para(tr("Pilihan karya 2024–2026.", "Selected work 2024–2026."), { align: "center", color: PH.muted })], { gap: 8, align: "stretch" })], { bg: "#fafaf9", padY: 56 }),
          section(
            "Grid foto",
            [
              grid([shot(1, tr("Pernikahan di tepi pantai", "Beach wedding"), "3 / 4"), shot(2, tr("Potret studio", "Studio portrait"), "3 / 4"), shot(3, tr("Lanskap pagi", "Morning landscape"), "3 / 4")], 3, { gap: 12 }),
              grid([shot(4, tr("Detail cincin", "Ring detail"), "4 / 3"), shot(5, tr("Editorial busana", "Fashion editorial"), "4 / 3")], 2, { gap: 12 }),
            ],
            { bg: "#fafaf9", padY: 24, width: 1280 },
          ),
          ctaBand(phTheme, tr, { title: tr("Ceritakan hari besar Anda", "Tell us about your big day"), primary: { label: tr("Cek tanggal", "Check dates"), href: href("home") + "#kontak" }, secondary: null }),
          phFooter(tr),
        ],
        FONTS.elegant,
        "#fafaf9",
      );
    }
    return pageWith(
      [
        head,
        section(
          "Slider",
          [
            stack(
              [
                el(
                  "slider",
                  {
                    slides: [
                      { title: tr("Momen yang tak terulang", "Moments that never repeat"), text: tr("Fotografi pernikahan dengan gaya dokumenter.", "Documentary-style wedding photography."), bg: "#292524" },
                      { title: tr("Editorial & busana", "Editorial & fashion"), text: tr("Untuk brand, majalah, dan katalog.", "For brands, magazines, and catalogs."), bg: "#44403c" },
                      { title: tr("Potret keluarga", "Family portraits"), text: tr("Sesi santai di studio atau rumah Anda.", "Relaxed sessions in our studio or your home."), bg: "#57534e" },
                    ],
                    height: 460,
                    radius: 0,
                  },
                  "Slider",
                ),
              ],
              { align: "stretch" },
            ),
          ],
          { bg: "#fafaf9", padY: 0, width: 1400 },
        ),
        portfolioMosaic(phTheme, tr, {
          eyebrow: tr("Karya pilihan", "Selected work"),
          title: tr("Cerita dalam cahaya", "Stories told in light"),
          works: [
            { title: tr("Rani & Bima", "Rani & Bima"), tag: tr("Pernikahan · Bali", "Wedding · Bali"), image: asset("photo-1") },
            { title: "Kala Atelier", tag: "Editorial", image: asset("photo-5") },
            { title: tr("Keluarga Hartono", "The Hartonos"), tag: tr("Potret", "Portrait"), image: asset("photo-2") },
            { title: tr("Pagi di Dieng", "Morning in Dieng"), tag: tr("Lanskap", "Landscape"), image: asset("photo-3") },
            { title: tr("Detail", "Details"), tag: tr("Pernikahan", "Wedding"), image: asset("photo-4") },
          ],
          cta: { label: tr("Buka galeri", "Open gallery"), href: href("gallery") },
        }),
        testimonialsWall(phTheme, tr, { title: tr("Kata pasangan kami", "What our couples say"), dark: true }),
        section(
          "Kontak",
          [
            grid(
              [
                col([eyebrow(tr("Kontak", "Contact"), PH.muted), heading(tr("Cek ketersediaan tanggal", "Check date availability"), "h2", { color: PH.ink }), para(tr("Kami menerima 24 pernikahan per tahun agar setiap pasangan mendapat perhatian penuh.", "We take 24 weddings a year so every couple gets our full attention."), { color: PH.muted })], { gap: 12, name: "Teks" }),
                col(
                  [
                    el("input", { labelText: tr("Nama", "Name"), text: tr("Nama Anda", "Your name") }, "Input nama"),
                    el("datepicker", { label: tr("Tanggal acara", "Event date"), name: "tanggal", helper: "", focusColor: PH.primaryDark, radius: 0 }, "Tanggal"),
                    linkButton(tr("Kirim", "Send"), "#kontak", "dark", PH, { full: true }),
                  ],
                  { gap: 14, name: "Formulir" },
                ),
              ],
              2,
              { gap: 48, align: "start" },
            ),
          ],
          { bg: "#ffffff", padY: 88, width: 1040 },
        ),
        phFooter(tr),
      ],
      FONTS.elegant,
      "#fafaf9",
    );
  },
};

/* ------------------------- 11. Tech DevHub (PREMIUM) ----------------- */

const TD: Palette = { ink: "#e2e8f0", muted: "#94a3b8", primary: "#22d3ee", primaryDark: "#06b6d4", soft: "#083344", line: "#1e293b" };
const tdTheme = theme(TD, { bg: "#020617", alt: "#0f172a", dark: "#020617", radius: 10, headFont: FONTS.mono });

const tdFooter = (tr: Tr) =>
  footer("devhub", tr("API & SDK open source untuk pembayaran lokal.", "Open-source APIs & SDKs for local payments."), [{ title: "Developer", items: ["Docs", "API Reference", "Status"] }, { title: "Community", items: ["GitHub", "Discord", "Changelog"] }], tr("© 2026 devhub. Lisensi MIT. Konten contoh.", "© 2026 devhub. MIT License. Sample content."), "#020617");

export const techDevhub: TemplateContent = {
  brand: "devhub",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "docs", slug: { id: "dokumentasi", en: "docs" }, name: { id: "Dokumentasi", en: "Docs" } },
  ],
  build: (key, tr, href) => {
    const head = header("devhub_", TD, { bg: "#020617", ink: "#ffffff", font: FONTS.mono, cta: linkButton("GitHub ↗", "#github", "outline", TD) });
    const install = (cmd: string, label: string) => el("clipboard", { label, value: cmd, buttonText: tr("Salin", "Copy"), copiedText: tr("Tersalin!", "Copied!"), bgColor: "#0f172a", textColor: "#a5f3fc", buttonBg: "#0891b2", radius: 10 }, "Clipboard");
    if (key === "docs")
      return pageWith(
        [
          head,
          section(
            "Mulai cepat",
            [
              stack(
                [
                  eyebrow("Quickstart", TD.primary),
                  heading(tr("Terima pembayaran dalam 5 menit", "Accept payments in 5 minutes"), "h1", { color: "#ffffff", size: 40 }),
                  para(tr("1. Pasang SDK", "1. Install the SDK"), { color: TD.ink, weight: 600 }),
                  install("npm install @devhub/pay", "npm"),
                  para(tr("2. Buat transaksi", "2. Create a charge"), { color: TD.ink, weight: 600 }),
                  install('pay.charges.create({ amount: 150000, method: "qris" })', "JavaScript"),
                  para(tr("3. Dengarkan webhook", "3. Listen for webhooks"), { color: TD.ink, weight: 600 }),
                  install("devhub listen --forward-to localhost:3000/webhook", "CLI"),
                ],
                { gap: 14, align: "stretch" },
              ),
            ],
            { bg: "#020617", padY: 80, width: 820 },
          ),
          faqAccordion(tdTheme, tr, {
            title: tr("Pertanyaan developer", "Developer questions"),
            items: [
              [tr("Bahasa apa saja yang didukung?", "Which languages are supported?"), "JavaScript, Python, Go, PHP, Java."],
              [tr("Ada sandbox?", "Is there a sandbox?"), tr("Ya, semua akun mendapat kunci sandbox gratis.", "Yes, every account gets free sandbox keys.")],
            ],
          }),
          tdFooter(tr),
        ],
        FONTS.mono,
        "#020617",
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
                    badge("v3.2 · open source", "#083344", "#67e8f9", "#155e75"),
                    el("typewriter", { prefix: tr("Satu API untuk", "One API for"), words: ["QRIS", "virtual account", "e-wallet", tr("kartu kredit", "credit cards")], tag: "h1", fontSize: 48, textColor: "#ffffff", wordColor: "#22d3ee" }, "Teks Mengetik"),
                    para(tr("SDK bertipe lengkap, webhook yang andal, dan dokumentasi yang benar-benar bisa dibaca.", "Fully typed SDKs, reliable webhooks, and docs you can actually read."), { size: 18, color: TD.muted }),
                    install("npm install @devhub/pay", tr("Pasang", "Install")),
                    inline([linkButton(tr("Baca dokumentasi", "Read the docs"), href("docs"), "primary", { ...TD, primary: "#0891b2", primaryDark: "#0e7490" }), linkButton("GitHub", "#github", "outline", TD)]),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                col([image(asset("tech-code"), tr("Contoh kode", "Code sample"), { ratio: "4 / 3", radius: 12 })], { name: "Kode" }),
              ],
              "minmax(0, 1.1fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { bg: "#020617", padY: 104 },
        ),
        statsBand(tdTheme, tr, { stats: [["18K", "GitHub stars"], ["99,99%", "API uptime"], ["120 ms", tr("Latensi p95", "p95 latency")], ["6", "SDK"]] }),
        featuresIcons(tdTheme, tr, {
          title: tr("Dibuat oleh developer, untuk developer", "Built by developers, for developers"),
          items: [
            { icon: "{ }", title: tr("SDK bertipe", "Typed SDKs"), text: tr("Autocomplete penuh di editor Anda.", "Full autocomplete in your editor.") },
            { icon: "↻", title: tr("Webhook andal", "Reliable webhooks"), text: tr("Retry otomatis dan tanda tangan HMAC.", "Automatic retries and HMAC signatures.") },
            { icon: "⌘", title: "CLI", text: tr("Uji webhook lokal tanpa ngrok.", "Test webhooks locally without ngrok.") },
          ],
        }),
        testimonialsWall(tdTheme, tr, {
          title: tr("Dipakai tim engineering di seluruh Indonesia", "Used by engineering teams across Indonesia"),
          dark: true,
          quotes: [
            { text: tr("Integrasi QRIS selesai dalam satu sore. Dokumentasinya jelas.", "QRIS integration took one afternoon. The docs are clear."), name: "Rina Kusuma", role: "Backend Lead, Toko Rina", avatar: asset("pro-team-2") },
            { text: tr("Webhook-nya tidak pernah hilang, bahkan saat traffic puncak.", "Webhooks never drop, even at peak traffic."), name: "Bayu Pratama", role: "SRE, Kopiku", avatar: asset("pro-team-1") },
            { text: tr("SDK bertipe menghemat banyak waktu debugging.", "The typed SDK saves us so much debugging time."), name: "Dewi Lestari", role: "CTO, Finly", avatar: asset("pro-team-3") },
          ],
        }),
        section(
          "Perbandingan",
          [stack([heading(tr("Kenapa tim pindah ke devhub", "Why teams switch to devhub"), "h2", { align: "center", color: "#ffffff" }), el("comparison-table", { columns: ["devhub", tr("Gateway lama", "Legacy gateway")], rows: [tr("SDK bertipe | ya | tidak", "Typed SDK | yes | no"), tr("Sandbox instan | ya | 3 hari", "Instant sandbox | yes | 3 days"), tr("Kode sumber terbuka | ya | tidak", "Open source | yes | no")], highlight: 1, caption: "", accentColor: "#0891b2" }, "Tabel Perbandingan")], { gap: 24, align: "stretch" })],
          { bg: "#0f172a", padY: 88, width: 900 },
        ),
        ctaBand(tdTheme, tr, { title: tr("Kirim transaksi pertama hari ini", "Ship your first charge today"), primary: { label: tr("Mulai cepat", "Quickstart"), href: href("docs") } }),
        tdFooter(tr),
      ],
      FONTS.mono,
      "#020617",
    );
  },
};

/* ----------------------- 12. Health Klinik (PREMIUM) ----------------- */

const HK: Palette = { ink: "#134e4a", muted: "#475569", primary: "#0d9488", primaryDark: "#0f766e", soft: "#ccfbf1", line: "#99f6e4" };
const hkTheme = theme(HK, { bg: "#ffffff", alt: "#f0fdfa", dark: "#134e4a", radius: 20, headFont: FONTS.rounded });

const hkFooter = (tr: Tr) =>
  footer("Klinik Sehati", tr("Klinik keluarga dengan dokter umum & spesialis.", "Family clinic with GPs & specialists."), [{ title: tr("Jam buka", "Hours"), items: [tr("Senin–Sabtu 08.00–21.00", "Mon–Sat 8am–9pm"), tr("Minggu 09.00–15.00", "Sun 9am–3pm")] }, { title: tr("Kontak", "Contact"), items: ["(021) 555-0123", "Jl. Melati 12, Bandung"] }], tr("© 2026 Klinik Sehati. Konten contoh, bukan saran medis.", "© 2026 Klinik Sehati. Sample content, not medical advice."), "#134e4a");

const bookingForm = (tr: Tr) =>
  col(
    [
      heading(tr("Buat janji temu", "Book an appointment"), "h3", { color: HK.ink }),
      el("input", { labelText: tr("Nama pasien", "Patient name"), text: tr("Nama lengkap", "Full name") }, "Input nama"),
      el("select", { labelText: tr("Layanan", "Service"), placeholder: tr("Pilih layanan", "Choose a service"), options: [tr("Dokter umum", "General practice"), tr("Anak", "Pediatrics"), tr("Gigi", "Dental"), tr("Kandungan", "Obstetrics")], widthMode: "full" }, "Pilih layanan"),
      el("datepicker", { label: tr("Tanggal", "Date"), name: "tanggal", helper: tr("Konfirmasi via WhatsApp.", "Confirmed via WhatsApp."), focusColor: HK.primary }, "Tanggal"),
      linkButton(tr("Kirim permintaan", "Send request"), "#janji", "primary", HK, { full: true }),
    ],
    { gap: 14, card: { bg: "#ffffff", border: HK.line, radius: 20, padding: 28 }, name: "Formulir janji" },
  );

export const healthKlinik: TemplateContent = {
  brand: "Klinik Sehati",
  pages: [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "services", slug: { id: "layanan", en: "services" }, name: { id: "Layanan", en: "Services" } },
  ],
  build: (key, tr, href) => {
    const head = header("Klinik Sehati", HK, { font: FONTS.rounded, cta: linkButton(tr("Buat janji", "Book now"), "#janji", "primary", HK) });
    const notice = section("Info", [stack([el("banner", { badge: "Info", text: tr("Vaksin influenza tersedia mulai bulan ini.", "Flu vaccines are available from this month."), linkText: tr("Daftar", "Register"), href: "#janji", bgColor: "#0f766e", badgeBg: "#ccfbf1", badgeText: "#134e4a", linkColor: "#ccfbf1", radius: 0 }, "Banner")], { align: "stretch" })], { bg: "#0f766e", padY: 0, width: 1400 });
    if (key === "services")
      return pageWith(
        [
          notice,
          head,
          servicesSplit(hkTheme, tr, {
            eyebrow: tr("Layanan", "Services"),
            title: tr("Perawatan lengkap untuk seluruh keluarga", "Complete care for the whole family"),
            image: asset("health-pulse"),
            items: [
              { icon: "🩺", title: tr("Dokter umum", "General practice"), text: tr("Pemeriksaan, resep, dan rujukan.", "Check-ups, prescriptions, and referrals.") },
              { icon: "🧒", title: tr("Anak", "Pediatrics"), text: tr("Imunisasi dan tumbuh kembang.", "Immunization and growth monitoring.") },
              { icon: "🦷", title: tr("Gigi", "Dental"), text: tr("Scaling, tambal, dan ortodonti.", "Cleaning, fillings, and orthodontics.") },
            ],
            cta: { label: tr("Buat janji", "Book now"), href: "#janji" },
          }),
          section(
            "Tarif",
            [stack([heading(tr("Tarif konsultasi", "Consultation fees"), "h2", { align: "center", color: HK.ink }), el("comparison-table", { columns: [tr("Umum", "General"), tr("Spesialis", "Specialist"), "Telekonsultasi"], rows: [tr("Biaya | Rp75rb | Rp250rb | Rp50rb", "Fee | Rp75k | Rp250k | Rp50k"), tr("Durasi | 15 menit | 20 menit | 15 menit", "Duration | 15 min | 20 min | 15 min"), tr("BPJS | ya | rujukan | tidak", "BPJS | yes | referral | no")], highlight: 1, caption: tr("Tarif contoh.", "Sample fees."), accentColor: HK.primary }, "Tabel Perbandingan")], { gap: 20, align: "stretch" })],
            { bg: hkTheme.alt, padY: 80, width: 960 },
          ),
          hkFooter(tr),
        ],
        FONTS.rounded,
      );
    return pageWith(
      [
        notice,
        head,
        section(
          "Hero",
          [
            grid(
              [
                col(
                  [
                    eyebrow(tr("Klinik keluarga · Bandung", "Family clinic · Bandung"), HK.primary),
                    heading(tr("Dokter yang mendengarkan, jadwal yang pasti", "Doctors who listen, appointments you can count on"), "h1", { size: 48, color: HK.ink }),
                    para(tr("Buat janji online, datang tepat waktu, tanpa antre lama.", "Book online, arrive on time, skip the long queue."), { size: 18, color: HK.muted }),
                    inline([linkButton(tr("Lihat layanan", "See services"), href("services"), "outline", HK)]),
                  ],
                  { gap: 18, name: "Teks hero" },
                ),
                bookingForm(tr),
              ],
              "minmax(0, 1.2fr) minmax(0, 1fr)",
              { gap: 48, align: "center" },
            ),
          ],
          { gradient: [HK.soft, "#ffffff", 160], padY: 96 },
        ),
        section("Angka", [stack([el("stats-counter", { items: [tr("25.000+ | Pasien terlayani", "25,000+ | Patients served"), tr("18 | Dokter", "18 | Doctors"), tr("4,9 | Rating Google", "4.9 | Google rating"), tr("12 menit | Rata-rata tunggu", "12 min | Average wait")], accentColor: HK.primary, numberColor: HK.ink }, "Statistik Animasi")], { align: "stretch" })], { bg: "#ffffff", padY: 72 }),
        teamCards(hkTheme, tr, { eyebrow: tr("Tim dokter", "Our doctors"), title: tr("Berpengalaman dan ramah", "Experienced and caring"), text: "" }),
        faqAccordion(hkTheme, tr, {
          items: [
            [tr("Apakah menerima BPJS?", "Do you accept BPJS?"), tr("Ya, untuk layanan dokter umum.", "Yes, for general practice.")],
            [tr("Bisa konsultasi online?", "Can I consult online?"), tr("Bisa, lewat video call di jam praktik.", "Yes, by video call during clinic hours.")],
          ],
        }),
        hkFooter(tr),
      ],
      FONTS.rounded,
    );
  },
};

