import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, Tr } from "../../../types";
import { portfolioMosaic, teamCards } from "../../../../pageMaker/helpers/sectionPresetsPro";
import {
  backTop,
  beforeAfterD,
  bento,
  cardsD,
  compareD,
  countdownD,
  ctaD,
  editorial,
  faqD,
  footerD,
  formD,
  galleryLb,
  headerD,
  heroEditorial,
  heroSoft,
  heroSplitScreen,
  heroStacked,
  heroTicket,
  home,
  indexList,
  locations,
  lookD,
  megaD,
  mosaic,
  notes,
  numbers,
  offer,
  pageHead,
  peopleD,
  pg,
  plansD,
  priceSwitchD,
  pro,
  pullQuote,
  quotesD,
  rail,
  render,
  specs,
  splitBand,
  splitPanel,
  swatches,
  tableD,
  tabsD,
  timelineD,
  typerD,
  withFx,
  wordBand,
  zigzag,
} from "./kitE";

/* ================================================================== */
/* Template v4 E1–E5: Coworking (Free), Hub kreatif, Klinik gigi,        */
/* Ortodonti, Mebel kayu jati.                                           */
/* ================================================================== */

/* ---------- 1. Ruang Temu Cowork — coworking (FREE, 4 pages) ---------- */
// Only free elements & presets; library: AOS.

const RP: Palette = { ink: "#0b2b28", muted: "#4f6b67", primary: "#0f766e", primaryDark: "#115e59", soft: "#ccfbf1", line: "#99f6e4" };
const R = lookD(RP, { head: "Outfit", body: "Work Sans", shape: "soft", radius: 20, bg: "#f7fcfb", alt: "#e9f7f4", inv: "#0b2b28", fx: { aos: "fade-up" } });

const rFoot = (tr: Tr) =>
  footerD("Ruang Temu Cowork", R, {
    variant: "columns",
    about: tr("Ruang kerja bersama yang tenang di tengah kota: meja fleksibel, ruang rapat, dan kopi yang tidak pernah habis.", "A calm shared workspace in the middle of town: flexible desks, meeting rooms and coffee that never runs out."),
    cols: [
      { title: tr("Ruang", "Spaces"), items: [tr("Meja fleksibel", "Hot desks"), tr("Meja tetap", "Fixed desks"), tr("Ruang rapat", "Meeting rooms")] },
      { title: tr("Kontak", "Contact"), items: ["halo@ruangtemu.id", "0812 3300 7781", tr("Jl. Kenanga 18, Semarang", "Jl. Kenanga 18, Semarang")] },
    ],
    social: ["Instagram | https://instagram.com/ruangtemu.cowork", "LinkedIn | https://linkedin.com/company/ruangtemu"],
    copy: tr("© 2026 Ruang Temu Cowork. Konten contoh.", "© 2026 Ruang Temu Cowork. Sample content."),
  });

export const coworkingRuangTemu: TemplateContent = {
  brand: "Ruang Temu Cowork",
  pages: [home(), pg("spaces", ["ruang", "Ruang"], ["spaces", "Spaces"]), pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) =>
    render(R, key, headerD("Ruang Temu Cowork", R, { variant: "bar", cta: [tr("Coba gratis sehari", "Try a free day"), href("contact")] }), rFoot(tr), {
      home: () => [
        heroSplitScreen(R, {
          eyebrow: tr("Coworking · Semarang", "Coworking · Semarang"),
          title: tr("Kerja lebih fokus, bertemu lebih banyak orang", "Focus better, meet more people"),
          text: tr("Meja fleksibel mulai harian, ruang rapat per jam, dan internet 300 Mbps. Datang saja, sisanya kami siapkan.", "Flexible desks by the day, meeting rooms by the hour and 300 Mbps internet. Just show up — we handle the rest."),
          list: [tr("Buka 07.00–22.00 setiap hari", "Open 7am–10pm daily"), tr("Kopi & teh sepuasnya", "Unlimited coffee & tea"), tr("Loker & alamat bisnis", "Lockers & business address")],
          image: asset("v4e-cowork"),
          alt: tr("Dua orang bekerja di meja bersama", "Two people working at a shared desk"),
          actions: [[tr("Lihat ruang", "See spaces"), href("spaces"), "light"]],
        }),
        bento(R, {
          eyebrow: tr("Fasilitas", "Facilities"),
          title: tr("Semua yang dibutuhkan hari kerja Anda", "Everything your workday needs"),
          items: [
            { title: tr("Lantai fokus", "Focus floor"), text: tr("Zona hening tanpa telepon, kursi ergonomis, dan lampu meja hangat.", "A silent zone with no calls, ergonomic chairs and warm desk lamps."), image: asset("v4e-cowork"), wide: true, meta: tr("40 kursi", "40 seats") },
            { title: tr("Bilik telepon", "Phone booths"), text: tr("Empat bilik kedap suara untuk panggilan video.", "Four soundproof booths for video calls."), icon: "◉", accent: true },
            { title: tr("Dapur bersama", "Shared kitchen"), text: tr("Kulkas, microwave, dan biji kopi lokal.", "Fridge, microwave and local coffee beans."), icon: "☕" },
            { title: tr("Printer & scan", "Print & scan"), text: tr("100 lembar gratis per bulan untuk anggota.", "100 free pages a month for members."), icon: "▤" },
          ],
        }),
        numbers(R, { items: [["300", tr("Mbps internet", "Mbps internet")], ["6", tr("Ruang rapat", "Meeting rooms")], ["120", tr("Anggota aktif", "Active members")], ["15", tr("Jam buka per hari", "Hours open daily")]] }),
        ctaD(R, { title: tr("Hari pertama gratis", "Your first day is free"), text: tr("Isi formulir singkat, datang dengan KTP, dan pilih meja Anda.", "Fill a short form, bring your ID and pick your desk."), actions: [[tr("Klaim hari gratis", "Claim free day"), href("contact")]], tone: "primary" }),
      ],
      spaces: () => [
        pageHead(R, { eyebrow: tr("Ruang", "Spaces"), title: tr("Pilih cara Anda bekerja", "Pick how you work"), text: tr("Dari satu kursi untuk sehari sampai ruang rapat untuk dua belas orang.", "From one seat for a day to a meeting room for twelve.") }),
        zigzag(R, {
          title: tr("Tiga jenis ruang", "Three kinds of space"),
          steps: [
            [tr("Meja fleksibel", "Hot desk"), tr("Duduk di mana saja di lantai bersama. Cocok untuk pekerja lepas dan tim kecil yang sering berpindah.", "Sit anywhere on the shared floor. Great for freelancers and small teams on the move."), asset("v4e-cowork")],
            [tr("Meja tetap", "Fixed desk"), tr("Meja milik Anda sendiri dengan laci terkunci dan monitor 24 inci.", "A desk that's yours, with a locking drawer and a 24-inch monitor."), asset("v4e-cowork-night")],
            [tr("Ruang rapat", "Meeting room"), tr("Kapasitas 4–12 orang, layar TV, papan tulis, dan konferensi video.", "Seats 4–12, with a TV screen, whiteboard and video conferencing."), asset("v4e-cowork")],
          ],
        }),
        rail(R, { title: tr("Cara memesan ruang rapat", "How to book a meeting room"), steps: [[tr("Pilih jam", "Pick a time"), tr("Cek jadwal kosong lewat WhatsApp.", "Check free slots over WhatsApp.")], [tr("Konfirmasi", "Confirm"), tr("Kami kirim kode akses pintu.", "We send a door access code.")], [tr("Datang", "Arrive"), tr("Air mineral & spidol sudah siap.", "Water & markers are ready.")], [tr("Bayar", "Pay"), tr("QRIS atau transfer setelah selesai.", "QRIS or transfer afterwards.")]] }),
      ],
      pricing: () => [
        pageHead(R, { eyebrow: tr("Harga", "Pricing"), title: tr("Harga jujur, tanpa kontrak panjang", "Honest prices, no long contracts") }),
        tableD(R, {
          title: tr("Daftar harga", "Price list"),
          columns: [tr("Paket", "Plan"), tr("Harga", "Price"), tr("Termasuk", "Includes")],
          rows: [
            [tr("Harian", "Day pass"), "Rp65.000", tr("Meja fleksibel, kopi, internet", "Hot desk, coffee, internet")],
            [tr("10 hari", "10-day pack"), "Rp550.000", tr("Berlaku 2 bulan", "Valid for 2 months")],
            [tr("Bulanan fleksibel", "Monthly flex"), "Rp1.150.000", tr("Akses tanpa batas + 4 jam ruang rapat", "Unlimited access + 4 meeting-room hours")],
            [tr("Bulanan meja tetap", "Monthly fixed"), "Rp1.750.000", tr("Meja sendiri, loker, alamat bisnis", "Own desk, locker, business address")],
            [tr("Ruang rapat", "Meeting room"), tr("Rp120.000/jam", "Rp120,000/hr"), tr("4–12 orang", "4–12 people")],
          ],
          note: tr("Harga contoh, sudah termasuk pajak.", "Sample prices, tax included."),
        }),
        faqD(R, {
          title: tr("Pertanyaan umum", "Common questions"),
          items: [
            [tr("Apakah bisa datang tanpa reservasi?", "Can I walk in without booking?"), tr("Bisa untuk meja fleksibel selama kursi tersedia.", "Yes for hot desks, while seats are available.")],
            [tr("Ada parkir?", "Is there parking?"), tr("Parkir motor gratis, mobil Rp5.000 per masuk.", "Free motorbike parking; cars Rp5,000 per entry.")],
            [tr("Bisa minta faktur?", "Can I get an invoice?"), tr("Bisa, atas nama pribadi atau perusahaan.", "Yes, in a personal or company name.")],
          ],
        }),
      ],
      contact: () => [
        pageHead(R, { eyebrow: tr("Kontak", "Contact"), title: tr("Mampir, kopi pertama dari kami", "Drop by — the first coffee's on us") }),
        formD(R, {
          title: tr("Daftar hari gratis", "Book your free day"),
          info: [[tr("Alamat", "Address"), "Jl. Kenanga 18, Semarang"], ["WhatsApp", "0812 3300 7781"], [tr("Jam buka", "Hours"), "07.00–22.00"]],
          fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { kind: "input", label: "Email", ph: "nama@email.com", type: "email" }, { kind: "date", label: tr("Tanggal datang", "Visit date") }],
          submit: tr("Kirim", "Send"),
        }),
        locations(R, { title: tr("Cara ke sini", "Getting here"), image: asset("v4e-route"), places: [[tr("Lantai 2, Gedung Kenanga", "2nd floor, Kenanga Building"), "Jl. Kenanga 18", tr("Lift & tangga", "Lift & stairs")], [tr("Halte terdekat", "Nearest bus stop"), tr("Halte Pandanaran", "Pandanaran stop"), tr("3 menit jalan kaki", "3-minute walk")]] }),
      ],
    }),
};

/* ------- 2. Gudang Gagas Hub — creative hub (6 hlm, Premium) -------- */
// Premium: mega-menu, typewriter, pro-portfolio-mosaic, pricing-switch, countdown, back-to-top. Library: Animate + Tilt.

const GP: Palette = { ink: "#1a1033", muted: "#4b3f66", primary: "#7c3aed", primaryDark: "#5b21b6", soft: "#ede9fe", line: "#c4b5fd" };
const G = lookD(GP, { head: "Syne", body: "Rubik", shape: "brutal", radius: 0, bg: "#fdfcf7", alt: "#fde047", inv: "#1a1033", fx: { animate: "fadeInUp", tilt: true }, upper: true });

const gHead = (tr: Tr, href: (k: string) => string) =>
  headerD("Gudang Gagas", G, {
    variant: "bar",
    sticky: true,
    nav: megaD(G, [tr("Keanggotaan", "Membership"), tr("Studio", "Studios"), tr("Acara", "Events"), tr("Komunitas", "Community")], tr("Gabung", "Join"), href("membership")),
  });
const gFoot = (tr: Tr) =>
  footerD("Gudang Gagas", G, {
    variant: "giant",
    about: tr("Bekas gudang teh yang kini jadi rumah bagi desainer, pembuat konten, dan pengrajin digital.", "A former tea warehouse now home to designers, creators and digital makers."),
    cols: [{ title: tr("Kunjungi", "Visit"), items: ["Jl. Gudang Teh 7, Bandung", tr("Senin–Sabtu 08.00–23.00", "Mon–Sat 8am–11pm")] }],
    social: ["Instagram | https://instagram.com/gudanggagas", "TikTok | https://tiktok.com/@gudanggagas", "YouTube | https://youtube.com/@gudanggagas"],
    copy: tr("© 2026 Gudang Gagas Hub. Konten contoh.", "© 2026 Gudang Gagas Hub. Sample content."),
    extra: [backTop(G, tr("Ke atas", "Back to top"))],
  });

export const coworkingHubKreatif: TemplateContent = {
  brand: "Gudang Gagas Hub",
  pages: [
    home(),
    pg("membership", ["keanggotaan", "Keanggotaan"], ["membership", "Membership"]),
    pg("studios", ["studio", "Studio"], ["studios", "Studios"]),
    pg("events", ["acara", "Acara"], ["events", "Events"]),
    pg("community", ["komunitas", "Komunitas"], ["community", "Community"]),
    pg("contact", ["kunjungi", "Kunjungi"], ["visit", "Visit"]),
  ],
  build: (key, tr, href) =>
    render(G, key, gHead(tr, href), gFoot(tr), {
      home: () => [
        heroStacked(G, {
          eyebrow: tr("Hub kreatif · Bandung", "Creative hub · Bandung"),
          title: tr("Bikin. Bareng. Besar.", "Make. Together. Big."),
          lines: [tr("Bikin.", "Make."), tr("Bareng.", "Together."), tr("Besar.", "Big.")],
          titleNode: typerD(G, tr("Tempat untuk ", "A place to "), [tr("membuat", "make"), tr("merekam", "record"), tr("berkolaborasi", "collaborate")], { size: 72 }),
          text: tr("1.800 m² gudang tua berisi studio foto, ruang podcast, bengkel cetak, dan meja panjang untuk siapa saja yang sedang membuat sesuatu.", "1,800 m² of old warehouse with photo studios, podcast rooms, a print workshop and long tables for anyone making something."),
          image: asset("v4e-cowork-night"),
          alt: tr("Lantai kerja hub kreatif", "Creative hub work floor"),
          actions: [[tr("Lihat keanggotaan", "See membership"), href("membership")], [tr("Jadwal acara", "Event schedule"), href("events"), "outline"]],
        }),
        wordBand(G, [tr("Studio foto", "Photo studio"), "Podcast", tr("Sablon", "Screen print"), "Risograph", tr("Meja panjang", "Long tables"), tr("Kelas malam", "Night classes")], { bg: G.p.ink, color: "#fde047" }),
        withFx(G, portfolioMosaic(pro(G), tr, { eyebrow: tr("Dibuat di sini", "Made here"), title: tr("Karya anggota bulan ini", "Member work this month"), works: [{ title: tr("Zine Kota Hujan", "Rain City Zine"), tag: "Risograph", image: asset("v4e-cowork-night") }, { title: tr("Podcast Obrol Pasar", "Market Talk Podcast"), tag: "Audio", image: asset("v4e-speech") }, { title: tr("Kaos Rimba", "Rimba Tees"), tag: tr("Sablon", "Screen print"), image: asset("v4e-weave") }, { title: tr("Katalog Keramik", "Ceramics Catalogue"), tag: tr("Foto produk", "Product photo"), image: asset("v4e-pottery") }, { title: tr("Kursi Lipat", "Folding Chair"), tag: tr("Desain produk", "Product design"), image: asset("v4e-chair") }], cta: { label: tr("Kenali komunitas", "Meet the community"), href: href("community") } })),
        splitBand(G, { left: { title: tr("Untuk pembuat", "For makers"), text: tr("Akses alat dan ruang tanpa membeli semuanya sendiri.", "Access tools and space without buying it all yourself."), actions: [[tr("Pilih paket", "Pick a plan"), href("membership"), "light"]] }, right: { title: tr("Untuk brand", "For brands"), text: tr("Sewa studio untuk sesi foto atau peluncuran produk.", "Rent a studio for shoots or product launches."), actions: [[tr("Lihat studio", "See studios"), href("studios")]] } }),
      ],
      membership: () => [
        pageHead(G, { eyebrow: tr("Keanggotaan", "Membership"), title: tr("Bayar sesuai ritme Anda", "Pay to your own rhythm") }),
        priceSwitchD(G, {
          title: tr("Tiga tingkat akses", "Three levels of access"),
          plans: [
            tr("Teman | Rp350rb | Rp3,5jt | 8 hari/bulan; Meja panjang; Diskon kelas 10% | Pilih Teman", "Friend | Rp350k | Rp3.5M | 8 days/month; Long tables; 10% off classes | Choose Friend"),
            tr("Penghuni | Rp950rb | Rp9,5jt | Akses tanpa batas; 6 jam studio; Loker | Pilih Penghuni", "Resident | Rp950k | Rp9.5M | Unlimited access; 6 studio hours; Locker | Choose Resident"),
            tr("Kolektif | Rp2,4jt | Rp24jt | Untuk 4 orang; Meja tim; 20 jam studio | Pilih Kolektif", "Collective | Rp2.4M | Rp24M | For 4 people; Team desk; 20 studio hours | Choose Collective"),
          ],
          labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 2 bulan", "2 months free"), tr("/bulan", "/month"), tr("/tahun", "/year")],
          href: href("contact"),
        }),
        faqD(G, { title: tr("Sebelum bergabung", "Before you join"), items: [[tr("Bisa cuti keanggotaan?", "Can I pause my membership?"), tr("Bisa, maksimal 2 bulan per tahun.", "Yes, up to 2 months a year.")], [tr("Alat apa yang bisa dipakai?", "Which tools can I use?"), tr("Semua alat setelah induksi singkat 30 menit.", "All tools after a short 30-minute induction.")]] }),
      ],
      studios: () => [
        pageHead(G, { eyebrow: tr("Studio", "Studios"), title: tr("Ruang untuk hal yang berisik dan berantakan", "Rooms for noisy, messy things") }),
        cardsD(G, {
          title: tr("Studio yang bisa disewa", "Studios for hire"),
          cols: 3,
          items: [
            { icon: "◐", title: tr("Studio foto", "Photo studio"), text: tr("Cyclorama putih 5 m, lampu kontinu, dan backdrop warna.", "5 m white cyclorama, continuous lights and colour backdrops."), meta: tr("Rp180rb/jam", "Rp180k/hr") },
            { icon: "◎", title: tr("Ruang podcast", "Podcast room"), text: tr("4 mikrofon, peredam akustik, dan operator opsional.", "4 microphones, acoustic treatment and an optional operator."), meta: tr("Rp120rb/jam", "Rp120k/hr") },
            { icon: "▦", title: tr("Bengkel cetak", "Print workshop"), text: tr("Meja sablon 4 warna dan mesin risograph.", "4-colour screen-print table and a risograph."), meta: tr("Rp90rb/jam", "Rp90k/hr") },
          ],
        }),
        specs(G, { title: tr("Spesifikasi studio foto", "Photo studio specs"), rows: [[tr("Luas", "Area"), "64 m²"], [tr("Tinggi plafon", "Ceiling"), "5,2 m"], [tr("Daya", "Power"), "11.000 VA"], [tr("Akses bongkar muat", "Loading access"), tr("Pintu gulung 3 m", "3 m roller door")]], image: asset("v4e-cowork-night"), alt: tr("Studio foto", "Photo studio") }),
      ],
      events: () => [
        countdownD(G, { eyebrow: tr("Acara besar", "Big event"), title: tr("Pasar Gagas — pasar karya anggota", "Gagas Market — a members' maker fair"), text: tr("60 lapak, panggung musik akustik, dan kelas kilat sepanjang hari.", "60 stalls, an acoustic stage and flash classes all day."), target: "2026-12-06T10:00", finished: tr("Pasar sedang berlangsung!", "The market is on!"), actions: [[tr("Daftar lapak", "Book a stall"), href("contact"), "light"]] }),
        indexList(G, {
          title: tr("Kalender bulan ini", "This month's calendar"),
          rows: [
            { title: tr("Malam sablon terbuka", "Open screen-print night"), meta: tr("Kamis, 19.00", "Thu, 7pm"), tag: tr("Kelas", "Class"), href: href("contact"), cta: tr("Daftar", "Join") },
            { title: tr("Bedah portofolio desainer", "Designer portfolio review"), meta: tr("Sabtu, 14.00", "Sat, 2pm"), tag: tr("Diskusi", "Talk"), href: href("contact"), cta: tr("Daftar", "Join") },
            { title: tr("Rekam podcast pertamamu", "Record your first podcast"), meta: tr("Minggu, 10.00", "Sun, 10am"), tag: tr("Lokakarya", "Workshop"), href: href("contact"), cta: tr("Daftar", "Join") },
          ],
        }),
      ],
      community: () => [
        pageHead(G, { eyebrow: tr("Komunitas", "Community"), title: tr("320 orang yang suka membuat", "320 people who love to make") }),
        notes(G, { title: tr("Aturan rumah", "House rules"), colors: ["#fde047", "#c4b5fd", "#86efac", "#fda4af"], items: [[tr("Bereskan alat", "Tidy your tools"), tr("Kembalikan ke papan bayangan.", "Back on the shadow board.")], [tr("Bagikan ilmu", "Share skills"), tr("Satu kelas kecil per tahun.", "One small class a year.")], [tr("Sapa tetangga", "Say hi"), tr("Meja panjang = meja ngobrol.", "Long tables = talking tables.")], [tr("Kredit karya", "Credit work"), tr("Sebut kolaborator Anda.", "Name your collaborators.")]] }),
        quotesD(G, { title: tr("Kata penghuni", "Residents say"), items: [{ quote: tr("Klien pertama saya datang dari obrolan di dapur bersama.", "My first client came from a chat in the shared kitchen."), author: "Nadia Kusnadi", role: tr("Ilustrator", "Illustrator"), avatar: asset("v4e-face-2") }, { quote: tr("Studio podcastnya bikin kami berani rekaman tiap minggu.", "The podcast room made us brave enough to record weekly."), author: "Raka & Dimas", role: "Podcaster", avatar: asset("v4e-face-1") }] }),
      ],
      contact: () => [
        pageHead(G, { eyebrow: tr("Kunjungi", "Visit"), title: tr("Tur gratis setiap Sabtu pukul 11.00", "Free tours every Saturday at 11am") }),
        formD(G, { title: tr("Pesan tur atau studio", "Book a tour or studio"), info: [[tr("Alamat", "Address"), "Jl. Gudang Teh 7, Bandung"], ["WhatsApp", "0813 2200 5150"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "select", label: tr("Keperluan", "Purpose"), ph: tr("Pilih", "Choose"), options: [tr("Tur", "Tour"), tr("Sewa studio", "Studio hire"), tr("Keanggotaan", "Membership")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send"), formFirst: true }),
      ],
    }),
};

/* ------ 3. Klinik Gigi Pualam — klinik gigi (6 hlm, Premium) -------- */
// Premium: before-after, pro-team-cards, pricing. Library: AOS.

const KP: Palette = { ink: "#0c2a3d", muted: "#4a6577", primary: "#0ea5e9", primaryDark: "#0369a1", soft: "#e0f2fe", line: "#bae6fd" };
const K = lookD(KP, { head: "Lora", body: "Inter", shape: "glass", radius: 24, bg: "#f6fbff", alt: "#e8f5fe", inv: "#0c2a3d", fx: { aos: "zoom-in" } });

const kFoot = (tr: Tr) =>
  footerD("Klinik Gigi Pualam", K, {
    variant: "columns",
    about: tr("Klinik gigi keluarga dengan dokter yang sabar menjelaskan, alat steril, dan jadwal yang tepat waktu.", "A family dental clinic with dentists who explain patiently, sterile tools and appointments that run on time."),
    cols: [
      { title: tr("Jam praktik", "Hours"), items: [tr("Senin–Jumat 09.00–20.00", "Mon–Fri 9am–8pm"), tr("Sabtu 09.00–15.00", "Sat 9am–3pm")] },
      { title: tr("Kontak", "Contact"), items: ["0274 555 210", "halo@pualamdental.id"] },
    ],
    social: ["Instagram | https://instagram.com/pualamdental", "Facebook | https://facebook.com/pualamdental"],
    copy: tr("© 2026 Klinik Gigi Pualam. Konten contoh, bukan nasihat medis.", "© 2026 Klinik Gigi Pualam. Sample content, not medical advice."),
  });

export const dentalSenyumSehat: TemplateContent = {
  brand: "Klinik Gigi Pualam",
  pages: [
    home(),
    pg("treatments", ["perawatan", "Perawatan"], ["treatments", "Treatments"]),
    pg("doctors", ["dokter", "Dokter"], ["dentists", "Dentists"]),
    pg("prices", ["biaya", "Biaya"], ["fees", "Fees"]),
    pg("info", ["info-pasien", "Info Pasien"], ["patient-info", "Patient Info"]),
    pg("booking", ["janji-temu", "Janji Temu"], ["book", "Book"]),
  ],
  build: (key, tr, href) =>
    render(K, key, headerD("Klinik Gigi Pualam", K, { variant: "pill", cta: [tr("Buat janji", "Book now"), href("booking")] }), kFoot(tr), {
      home: () => [
        heroSoft(K, {
          eyebrow: tr("Klinik gigi keluarga", "Family dental clinic"),
          title: tr("Senyum sehat tanpa rasa takut", "Healthy smiles, without the fear"),
          text: tr("Pemeriksaan pertama gratis untuk anak di bawah 12 tahun. Kami jelaskan setiap langkah sebelum alat menyentuh gigi Anda.", "First check-up free for children under 12. We explain every step before any tool touches your teeth."),
          image: asset("v4e-tooth"),
          alt: tr("Ilustrasi gigi bersih", "Clean tooth illustration"),
          chips: [tr("Steril autoklaf", "Autoclave-sterile"), tr("Bius tanpa jarum", "Needle-free numbing"), tr("Tepat waktu", "On time")],
          actions: [[tr("Buat janji", "Book now"), href("booking")], [tr("Lihat perawatan", "See treatments"), href("treatments"), "outline"]],
        }),
        cardsD(K, {
          eyebrow: tr("Layanan utama", "Main services"),
          title: tr("Dari pembersihan rutin sampai implan", "From routine cleaning to implants"),
          cols: 4,
          items: [
            { icon: "✦", title: tr("Scaling", "Scaling"), text: tr("Membersihkan karang gigi dalam 30 menit.", "Removes tartar in 30 minutes.") },
            { icon: "◐", title: tr("Tambal estetik", "Tooth-coloured fillings"), text: tr("Warna menyatu dengan gigi asli.", "Blends with your natural teeth.") },
            { icon: "☼", title: tr("Pemutihan", "Whitening"), text: tr("Hingga 6 tingkat lebih cerah.", "Up to 6 shades brighter.") },
            { icon: "◎", title: tr("Gigi anak", "Kids' dentistry"), text: tr("Ruang bermain & dokter spesialis anak.", "Play corner & paediatric dentist.") },
          ],
        }),
        beforeAfterD(K, { eyebrow: tr("Hasil nyata", "Real results"), title: tr("Pemutihan dalam satu kunjungan", "Whitening in one visit"), before: asset("v4e-tooth-mint"), after: asset("v4e-tooth"), labels: [tr("Sebelum", "Before"), tr("Sesudah", "After")], alt: tr("Perbandingan warna gigi", "Tooth shade comparison") }),
        pullQuote(K, { text: tr("Anak saya yang dulu menangis di kursi dokter, sekarang minta kontrol sendiri.", "My son who used to cry in the chair now asks for his own check-ups."), name: "Ibu Ratna Wijaya", role: tr("Pasien sejak 2023", "Patient since 2023") }),
      ],
      treatments: () => [
        pageHead(K, { eyebrow: tr("Perawatan", "Treatments"), title: tr("Perawatan yang kami tangani", "Treatments we provide"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Perawatan", "Treatments"), ""]] }),
        tabsD(K, {
          title: tr("Kenali prosedurnya", "Know the procedure"),
          tabs: [
            [tr("Saluran akar", "Root canal"), tr("Dua sampai tiga kunjungan. Saraf yang meradang dibersihkan lalu diisi; gigi tetap bisa dipakai mengunyah.", "Two to three visits. The inflamed nerve is cleaned and filled; the tooth stays usable for chewing.")],
            [tr("Implan", "Implants"), tr("Tiang titanium ditanam lalu dipasangi mahkota setelah 3 bulan. Konsultasi dan rontgen panoramik dulu.", "A titanium post is placed and crowned after 3 months. Consultation and panoramic X-ray first.")],
            [tr("Gigi tiruan", "Dentures"), tr("Lepasan atau cekat, dibuat di laboratorium mitra dalam 10 hari kerja.", "Removable or fixed, made by our partner lab in 10 working days.")],
          ],
        }),
        splitPanel(K, { eyebrow: tr("Teknologi", "Technology"), title: tr("Rontgen digital radiasi rendah", "Low-dose digital X-ray"), text: tr("Hasil muncul di layar dalam 5 detik sehingga Anda bisa melihat sendiri kondisi gigi.", "Results show on screen in 5 seconds so you can see your teeth for yourself."), bullets: [tr("Radiasi 80% lebih rendah", "80% less radiation"), tr("Hasil dikirim via email", "Results emailed to you")], image: asset("v4e-tooth-mint"), alt: tr("Rontgen gigi", "Dental X-ray") }),
      ],
      doctors: () => [
        pageHead(K, { eyebrow: tr("Tim", "Team"), title: tr("Dokter yang sabar menjelaskan", "Dentists who take time to explain") }),
        withFx(K, teamCards(pro(K), tr, { title: tr("Dokter kami", "Our dentists"), members: [{ name: "drg. Larasati Putri", role: tr("Dokter gigi umum", "General dentist"), photo: asset("v4e-face-2") }, { name: "drg. Bima Santoso, Sp.KGA", role: tr("Spesialis gigi anak", "Paediatric dentist"), photo: asset("v4e-face-1") }, { name: "drg. Wening Hapsari, Sp.Pros", role: tr("Spesialis prostodonsia", "Prosthodontist"), photo: asset("v4e-face-4") }, { name: "drg. Yusuf Habibi", role: tr("Bedah mulut", "Oral surgery"), photo: asset("v4e-face-3") }] })),
        tableD(K, { title: tr("Jadwal praktik", "Practice schedule"), columns: [tr("Dokter", "Dentist"), tr("Hari", "Days"), tr("Jam", "Hours")], rows: [["drg. Larasati", tr("Senin–Jumat", "Mon–Fri"), "09.00–15.00"], ["drg. Bima", tr("Selasa, Kamis, Sabtu", "Tue, Thu, Sat"), "13.00–20.00"], ["drg. Wening", tr("Rabu, Jumat", "Wed, Fri"), "15.00–20.00"]] }),
      ],
      prices: () => [
        pageHead(K, { eyebrow: tr("Biaya", "Fees"), title: tr("Biaya transparan sebelum tindakan", "Clear fees before any treatment") }),
        plansD(K, {
          title: tr("Paket perawatan", "Care plans"),
          items: [
            { plan: tr("Periksa", "Check-up"), price: "Rp150rb", period: tr("/kunjungan", "/visit"), description: tr("Konsultasi + foto intraoral.", "Consultation + intraoral photos."), features: [tr("Pemeriksaan lengkap", "Full exam"), tr("Rencana perawatan tertulis", "Written treatment plan")], buttonText: tr("Pesan", "Book"), buttonHref: href("booking") },
            { plan: tr("Bersih", "Clean"), price: "Rp450rb", period: tr("/kunjungan", "/visit"), description: tr("Paling sering dipilih.", "Most popular."), features: [tr("Scaling + polishing", "Scaling + polishing"), tr("Fluoride", "Fluoride"), tr("Kontrol 6 bulan", "6-month recall")], buttonText: tr("Pesan", "Book"), buttonHref: href("booking"), featured: true, badge: tr("Favorit", "Popular") },
            { plan: tr("Keluarga", "Family"), price: "Rp1,4jt", period: tr("/tahun", "/year"), description: tr("Untuk 4 orang.", "For 4 people."), features: [tr("2× scaling per orang", "2× scaling each"), tr("Diskon tambal 20%", "20% off fillings")], buttonText: tr("Pesan", "Book"), buttonHref: href("booking") },
          ],
        }),
        ctaD(K, { title: tr("Pakai asuransi?", "Using insurance?"), text: tr("Kami bekerja sama dengan 12 penyedia asuransi kesehatan. Bawa kartu Anda.", "We work with 12 health insurers. Bring your card."), actions: [[tr("Tanya cakupan", "Ask about cover"), href("booking")]], tone: "soft" }),
      ],
      info: () => [
        pageHead(K, { eyebrow: tr("Info pasien", "Patient info"), title: tr("Sebelum dan sesudah kunjungan", "Before and after your visit") }),
        faqD(K, { title: tr("Pertanyaan pasien", "Patient questions"), items: [[tr("Apakah scaling sakit?", "Does scaling hurt?"), tr("Umumnya hanya ngilu ringan. Gel bius tersedia.", "Usually just mild sensitivity. Numbing gel is available.")], [tr("Bolehkah ibu hamil periksa?", "Can pregnant women be seen?"), tr("Boleh, trimester kedua adalah waktu terbaik.", "Yes — the second trimester is the best time.")], [tr("Berapa lama tambalan bertahan?", "How long do fillings last?"), tr("Rata-rata 7–10 tahun dengan perawatan baik.", "On average 7–10 years with good care.")]] }),
        rail(K, { title: tr("Hari kunjungan Anda", "Your visit day"), steps: [[tr("Daftar ulang", "Check in"), tr("Datang 10 menit lebih awal.", "Arrive 10 minutes early.")], [tr("Periksa", "Exam"), tr("Foto & penjelasan dokter.", "Photos & explanation.")], [tr("Tindakan", "Treatment"), tr("Setelah Anda setuju.", "Once you agree.")], [tr("Kontrol", "Recall"), tr("Pengingat via WhatsApp.", "WhatsApp reminder.")]] }),
      ],
      booking: () => [
        pageHead(K, { eyebrow: tr("Janji temu", "Appointments"), title: tr("Pilih jadwal yang cocok", "Pick a time that suits you") }),
        formD(K, { title: tr("Formulir janji temu", "Appointment form"), info: [[tr("Telepon", "Phone"), "0274 555 210"], [tr("Alamat", "Address"), "Jl. Kaliurang Km 6, Yogyakarta"]], fields: [{ kind: "input", label: tr("Nama pasien", "Patient name"), ph: tr("Nama lengkap", "Full name") }, { kind: "select", label: tr("Keluhan", "Concern"), ph: tr("Pilih", "Choose"), options: [tr("Periksa rutin", "Routine check"), tr("Sakit gigi", "Toothache"), tr("Estetik", "Cosmetic"), tr("Anak", "Child")] }, { kind: "date", label: tr("Tanggal", "Date"), mode: "datetime-local" }], submit: tr("Kirim permintaan", "Send request") }),
      ],
    }),
};

/* --------- 4. Rapi Ortho Studio — ortodonti (5 hlm, Premium) -------- */
// Premium: before-after, comparison-table, modal-popup. Library: AOS + Tilt.

const OP: Palette = { ink: "#3a0b24", muted: "#7a4a62", primary: "#db2777", primaryDark: "#9d174d", soft: "#fce7f3", line: "#fbcfe8" };
const O = lookD(OP, { head: "DM Serif Display", body: "Outfit", shape: "retro", radius: 18, bg: "#fffafc", alt: "#fdeef6", inv: "#3a0b24", fx: { aos: "flip-left", tilt: true } });

const oFoot = (tr: Tr) =>
  footerD("Rapi Ortho Studio", O, {
    variant: "slim",
    about: tr("Studio ortodonti: kawat gigi & aligner bening oleh spesialis ortodonsia.", "An orthodontic studio: braces & clear aligners by specialist orthodontists."),
    social: ["Instagram | https://instagram.com/rapiortho", "TikTok | https://tiktok.com/@rapiortho"],
    copy: tr("© 2026 Rapi Ortho Studio. Konten contoh.", "© 2026 Rapi Ortho Studio. Sample content."),
  });

export const dentalOrtho: TemplateContent = {
  brand: "Rapi Ortho Studio",
  pages: [home(), pg("braces", ["kawat-gigi", "Kawat Gigi"], ["braces", "Braces"]), pg("aligner", ["aligner-bening", "Aligner Bening"], ["clear-aligners", "Clear Aligners"]), pg("journey", ["perjalanan", "Perjalanan"], ["journey", "Journey"]), pg("consult", ["konsultasi", "Konsultasi"], ["consult", "Consult"])],
  build: (key, tr, href) =>
    render(O, key, headerD("Rapi Ortho", O, { variant: "center", cta: [tr("Konsultasi", "Consult"), href("consult")] }), oFoot(tr), {
      home: () => [
        heroEditorial(O, {
          meta: [tr("Ortodonti", "Orthodontics"), tr("Surabaya", "Surabaya"), tr("Sejak 2019", "Since 2019")],
          eyebrow: tr("Kawat gigi & aligner", "Braces & aligners"),
          title: tr("Gigi rapi, rencana yang jelas sejak hari pertama", "Straight teeth, with a clear plan from day one"),
          text: tr("Simulasi 3D hasil akhir sebelum Anda memutuskan. Cicilan 0% hingga 24 bulan.", "A 3D preview of your result before you decide. 0% instalments for up to 24 months."),
          image: asset("v4e-braces"),
          alt: tr("Senyum dengan kawat gigi", "Smile with braces"),
          actions: [[tr("Konsultasi gratis", "Free consultation"), href("consult")]],
        }),
        beforeAfterD(O, { eyebrow: tr("Geser untuk melihat", "Slide to compare"), title: tr("18 bulan perawatan aligner", "18 months of aligner treatment"), before: asset("v4e-braces"), after: asset("v4e-braces-clear"), labels: [tr("Awal", "Start"), tr("Akhir", "Finish")], alt: tr("Perbandingan susunan gigi", "Teeth alignment comparison") }),
        offer(O, { eyebrow: tr("Promo pelajar", "Student offer"), title: tr("Diskon Rp1 juta untuk pelajar & mahasiswa", "Rp1M off for students"), text: tr("Berlaku untuk pemasangan sampai 31 Desember 2026.", "Valid for fittings until 31 December 2026."), trigger: tr("Lihat syarat", "See terms"), modalTitle: tr("Syarat promo", "Offer terms"), body: tr("Tunjukkan kartu pelajar aktif. Tidak bisa digabung dengan promo lain. Berlaku untuk kawat metal dan keramik.", "Show a valid student card. Can't be combined with other offers. Valid for metal and ceramic braces."), cta: tr("Pesan konsultasi", "Book a consult"), href: href("consult") }),
      ],
      braces: () => [
        pageHead(O, { eyebrow: tr("Kawat gigi", "Braces"), title: tr("Pilih bracket yang Anda suka", "Pick the brackets you like") }),
        swatches(O, { title: tr("Jenis bracket", "Bracket types"), items: [["#94a3b8", tr("Metal", "Metal"), tr("Paling kuat & hemat.", "Strongest & most affordable.")], ["#f5f5f4", tr("Keramik", "Ceramic"), tr("Warna gigi, samar.", "Tooth-coloured, subtle.")], ["#fde68a", tr("Self-ligating", "Self-ligating"), tr("Kontrol lebih jarang.", "Fewer adjustments.")], ["#f9a8d4", tr("Karet warna", "Colour ties"), tr("Ganti tiap kontrol.", "Change every visit.")]] }),
        compareD(O, { title: tr("Bandingkan pilihan", "Compare options"), columns: [tr("Metal", "Metal"), tr("Keramik", "Ceramic"), tr("Aligner", "Aligner")], rows: [tr("Biaya mulai | Rp7jt | Rp11jt | Rp24jt", "From | Rp7M | Rp11M | Rp24M"), tr("Terlihat | ya | samar | hampir tidak", "Visible | yes | subtle | barely"), tr("Bisa dilepas | tidak | tidak | ya", "Removable | no | no | yes"), tr("Kontrol | 4 minggu | 4 minggu | 8 minggu", "Check-ups | 4 weeks | 4 weeks | 8 weeks")], highlight: 3, caption: tr("Harga contoh untuk kasus ringan–sedang.", "Sample prices for mild–moderate cases.") }),
      ],
      aligner: () => [
        heroTicket(O, { eyebrow: tr("Aligner bening", "Clear aligners"), title: tr("Hampir tak terlihat, bisa dilepas saat makan", "Nearly invisible, removable at mealtimes"), text: tr("Cetakan digital tanpa bubur cetak. Set baru setiap 2 minggu.", "Digital scan, no impression putty. A new set every 2 weeks."), stubs: [[tr("Durasi", "Duration"), tr("6–18 bulan", "6–18 months")], [tr("Pemakaian", "Wear time"), tr("22 jam/hari", "22 hrs/day")], [tr("Kontrol", "Check-ups"), tr("Tiap 8 minggu", "Every 8 weeks")]], actions: [[tr("Cek kecocokan", "Check if you qualify"), href("consult")]] }),
        faqD(O, { title: tr("Tentang aligner", "About aligners"), items: [[tr("Cocok untuk semua kasus?", "Does it suit every case?"), tr("Tidak; gigi sangat bertumpuk kadang butuh kawat.", "No — severe crowding may still need braces.")], [tr("Boleh minum kopi?", "Can I drink coffee?"), tr("Lepas dulu aligner agar tidak bernoda.", "Take the aligners out first to avoid stains.")]] }),
      ],
      journey: () => [
        pageHead(O, { eyebrow: tr("Perjalanan", "Journey"), title: tr("Dari konsultasi sampai retainer", "From consultation to retainer") }),
        timelineD(O, { title: tr("Tahapan perawatan", "Treatment stages"), items: [[tr("Minggu 1", "Week 1"), tr("Konsultasi & scan", "Consult & scan"), tr("Foto, rontgen, dan scan 3D.", "Photos, X-ray and 3D scan.")], [tr("Minggu 2", "Week 2"), tr("Simulasi hasil", "Result preview"), tr("Anda melihat hasil akhir di layar.", "You see the final result on screen.")], [tr("Minggu 3", "Week 3"), tr("Pemasangan", "Fitting"), tr("Sekitar 90 menit.", "About 90 minutes.")], [tr("Bulan 6–18", "Months 6–18"), tr("Kontrol rutin", "Regular checks"), tr("Penyesuaian kawat atau set aligner baru.", "Wire adjustments or new aligner sets.")], [tr("Akhir", "Finish"), tr("Retainer", "Retainer"), tr("Menjaga hasil tetap rapi.", "Keeps the result in place.")]], side: { image: asset("v4e-braces-clear"), alt: tr("Aligner bening", "Clear aligner") } }),
        quotesD(O, { title: tr("Cerita pasien", "Patient stories"), items: [{ quote: tr("Simulasi 3D-nya bikin saya yakin. Hasil akhirnya persis seperti di layar.", "The 3D preview convinced me. The result looks exactly like the screen."), author: "Salsa Amelia", role: tr("Mahasiswi", "Student"), avatar: asset("v4e-face-4") }, { quote: tr("Cicilan 0% sangat membantu.", "The 0% instalments really helped."), author: "Andre Wiratama", role: tr("Karyawan", "Employee"), avatar: asset("v4e-face-3") }] }),
      ],
      consult: () => [
        pageHead(O, { eyebrow: tr("Konsultasi", "Consultation"), title: tr("Konsultasi pertama gratis", "Your first consultation is free") }),
        formD(O, { title: tr("Pesan konsultasi", "Book a consultation"), info: [["WhatsApp", "0811 3400 9090"], [tr("Alamat", "Address"), "Jl. Darmo Permai 21, Surabaya"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { kind: "select", label: tr("Minat", "Interest"), ph: tr("Pilih", "Choose"), options: [tr("Kawat gigi", "Braces"), tr("Aligner", "Aligners"), tr("Belum tahu", "Not sure")] }, { kind: "check", label: tr("Saya pelajar/mahasiswa", "I'm a student") }], submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* ------- 5. Jati Wangsa Mebel — mebel kayu jati (7 hlm, Premium) ------ */
// Premium: mega-menu, gallery-lightbox, pro-portfolio-mosaic, testimonial, back-to-top. Library: AOS.

const JP: Palette = { ink: "#2b1a0e", muted: "#6d5644", primary: "#92400e", primaryDark: "#78350f", soft: "#fdf0dc", line: "#e9d5b7" };
const J = lookD(JP, { head: "Cormorant Garamond", body: "Work Sans", shape: "editorial", radius: 2, bg: "#fcf8f1", alt: "#f4ebdc", inv: "#2b1a0e", fx: { aos: "fade" } });

const jHead = (tr: Tr, href: (k: string) => string) =>
  headerD("Jati Wangsa", J, {
    variant: "split",
    info: [tr("Bengkel mebel sejak 1987 · Jepara", "Furniture workshop since 1987 · Jepara"), tr("Kirim ke seluruh Indonesia", "Shipping across Indonesia")],
    nav: megaD(J, [tr("Koleksi", "Collection"), tr("Pesanan khusus", "Custom orders"), tr("Bengkel", "Workshop"), tr("Material", "Materials")], tr("Minta penawaran", "Get a quote"), href("contact")),
  });
const jFoot = (tr: Tr) =>
  footerD("Jati Wangsa", J, {
    variant: "giant",
    about: tr("Mebel jati solid buatan tangan tiga generasi tukang kayu Jepara.", "Solid teak furniture handmade by three generations of Jepara woodworkers."),
    cols: [{ title: tr("Galeri", "Showroom"), items: ["Jl. Raya Tahunan 45, Jepara", tr("Setiap hari 08.00–17.00", "Daily 8am–5pm")] }, { title: tr("Kontak", "Contact"), items: ["0291 600 777", "sapa@jatiwangsa.id"] }],
    social: ["Instagram | https://instagram.com/jatiwangsa", "Pinterest | https://pinterest.com/jatiwangsa"],
    copy: tr("© 2026 Jati Wangsa Mebel. Konten contoh.", "© 2026 Jati Wangsa Mebel. Sample content."),
    extra: [backTop(J, tr("Ke atas", "To top"))],
  });

export const furnitureKayuJati: TemplateContent = {
  brand: "Jati Wangsa Mebel",
  pages: [
    home(),
    pg("collection", ["koleksi", "Koleksi"], ["collection", "Collection"]),
    pg("custom", ["pesanan-khusus", "Pesanan Khusus"], ["custom-orders", "Custom Orders"]),
    pg("workshop", ["bengkel", "Bengkel"], ["workshop", "Workshop"]),
    pg("materials", ["material", "Material"], ["materials", "Materials"]),
    pg("projects", ["proyek", "Proyek"], ["projects", "Projects"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) =>
    render(J, key, jHead(tr, href), jFoot(tr), {
      home: () => [
        heroEditorial(J, {
          meta: [tr("Edisi Musim Kemarau", "Dry Season Edition"), "Jepara", "No. 38"],
          eyebrow: tr("Mebel jati solid", "Solid teak furniture"),
          title: tr("Kayu yang tumbuh 40 tahun, dibuat untuk 100 tahun lagi", "Wood that grew for 40 years, made to last 100 more"),
          text: tr("Kursi, meja, dan lemari dari jati bersertifikat legal, disambung pasak tanpa paku, dan diselesaikan dengan minyak alami.", "Chairs, tables and cabinets in certified legal teak, pegged without nails and finished with natural oils."),
          image: asset("v4e-chair"),
          alt: tr("Kursi jati dan meja samping", "Teak chair and side table"),
          actions: [[tr("Lihat koleksi", "See the collection"), href("collection")]],
        }),
        editorial(J, { eyebrow: tr("Cara kami bekerja", "How we work"), title: tr("Tiga prinsip bengkel", "Three workshop principles"), cols: [[tr("Kayu tua", "Mature wood"), tr("Hanya jati berumur 30 tahun ke atas, dikeringkan 6 bulan.", "Only teak over 30 years old, air-dried for 6 months.")], [tr("Sambungan pasak", "Pegged joints"), tr("Purus dan pasak kayu — bisa dibongkar dan diperbaiki.", "Mortise, tenon and pegs — can be taken apart and repaired.")], [tr("Garansi 10 tahun", "10-year warranty"), tr("Untuk sambungan dan struktur.", "On joints and structure.")]] }),
        withFx(J, portfolioMosaic(pro(J), tr, { eyebrow: tr("Dipasang di rumah", "In homes"), title: tr("Proyek pilihan", "Selected projects"), works: [{ title: tr("Ruang makan Kemang", "Kemang dining room"), tag: tr("Meja 10 kursi", "10-seat table"), image: asset("v4e-chair") }, { title: tr("Villa Ubud", "Ubud villa"), tag: tr("Daybed", "Daybed"), image: asset("v4e-chair-sage") }, { title: tr("Kafe Tepi Sawah", "Ricefield café"), tag: tr("40 kursi", "40 chairs"), image: asset("v4e-sofa-clay") }, { title: tr("Perpustakaan rumah", "Home library"), tag: tr("Rak dinding", "Wall shelving"), image: asset("v4e-chair") }, { title: tr("Hotel butik Solo", "Solo boutique hotel"), tag: tr("Lemari kamar", "Wardrobes"), image: asset("v4e-chair-sage") }], cta: { label: tr("Semua proyek", "All projects"), href: href("projects") } })),
        quotesD(J, { title: tr("Pemilik yang puas", "Happy owners"), items: [{ quote: tr("Meja makan kami sudah 8 tahun, masih kokoh dan makin cantik.", "Our dining table is 8 years old, still solid and more beautiful."), author: "Keluarga Hartono", role: "Jakarta", avatar: asset("v4e-face-1") }, { quote: tr("Pesanan khusus sesuai gambar, tepat waktu.", "The custom piece matched the drawing and came on time."), author: "Dewi Anggraini", role: tr("Arsitek", "Architect"), avatar: asset("v4e-face-2") }] }),
      ],
      collection: () => [
        pageHead(J, { eyebrow: tr("Koleksi", "Collection"), title: tr("Koleksi tetap", "The permanent collection"), text: tr("Bisa dipesan dengan ukuran dan warna minyak berbeda.", "Available in other sizes and oil finishes.") }),
        galleryLb(J, { title: tr("Katalog 2026", "2026 catalogue"), images: [[asset("v4e-chair"), tr("Kursi Sore — Rp3,8 jt", "Sore chair — Rp3.8M")], [asset("v4e-chair-sage"), tr("Kursi Teras — Rp4,2 jt", "Terrace chair — Rp4.2M")], [asset("v4e-sofa-clay"), tr("Sofa Lawas — Rp14 jt", "Lawas sofa — Rp14M")], [asset("v4e-chair"), tr("Meja Samping — Rp1,9 jt", "Side table — Rp1.9M")], [asset("v4e-chair-sage"), tr("Bangku Panjang — Rp5,5 jt", "Long bench — Rp5.5M")], [asset("v4e-sofa-clay"), tr("Daybed Pesisir — Rp18 jt", "Coastal daybed — Rp18M")]] }),
        ctaD(J, { title: tr("Ukuran tidak pas?", "Size not right?"), text: tr("Semua koleksi bisa disesuaikan tanpa biaya desain.", "Every piece can be resized with no design fee."), actions: [[tr("Pesanan khusus", "Custom order"), href("custom")]], tone: "inv" }),
      ],
      custom: () => [
        pageHead(J, { eyebrow: tr("Pesanan khusus", "Custom orders"), title: tr("Dari sketsa di serbet sampai mebel di rumah", "From a napkin sketch to furniture in your home") }),
        rail(J, { title: tr("Lima langkah", "Five steps"), steps: [[tr("Cerita", "Brief"), tr("Ukuran ruang & kebutuhan.", "Room size & needs.")], [tr("Gambar", "Drawing"), tr("Gambar kerja 3 hari.", "Shop drawing in 3 days.")], [tr("Uang muka", "Deposit"), tr("50% untuk kayu.", "50% for timber.")], [tr("Produksi", "Build"), tr("4–8 minggu, foto progres.", "4–8 weeks, progress photos.")], [tr("Kirim", "Deliver"), tr("Dirakit di lokasi.", "Assembled on site.")]] }),
        formD(J, { title: tr("Minta penawaran", "Request a quote"), info: [["WhatsApp", "0812 2900 1987"], ["Email", "sapa@jatiwangsa.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "select", label: tr("Jenis mebel", "Furniture type"), ph: tr("Pilih", "Choose"), options: [tr("Meja", "Table"), tr("Kursi", "Chair"), tr("Lemari", "Cabinet"), tr("Lainnya", "Other")] }, { kind: "input", label: tr("Ukuran kira-kira", "Rough size"), ph: "200 × 90 × 75 cm" }], message: tr("Ceritakan kebutuhan Anda", "Tell us what you need"), submit: tr("Kirim", "Send") }),
      ],
      workshop: () => [
        pageHead(J, { eyebrow: tr("Bengkel", "Workshop"), title: tr("28 tukang, satu halaman belakang", "28 craftsmen, one backyard") }),
        splitPanel(J, { eyebrow: tr("Sejak 1987", "Since 1987"), title: tr("Dimulai oleh Pak Wangsa", "Started by Pak Wangsa"), text: tr("Bengkel kecil di belakang rumah kini mempekerjakan 28 tukang, sebagian besar tetangga sendiri.", "A small backyard shop now employs 28 craftsmen, most of them neighbours."), bullets: [tr("Pelatihan magang 2 tahun", "2-year apprenticeship"), tr("Upah di atas UMK", "Wages above the regional minimum")], image: asset("v4e-chair-sage"), alt: tr("Bengkel kayu", "Wood workshop") }),
        peopleD(J, { title: tr("Kepala tukang", "Master craftsmen"), items: [{ name: "Pak Sutrisno", role: tr("Ukir, 34 tahun", "Carving, 34 years"), photo: asset("v4e-face-3") }, { name: "Mas Joko", role: tr("Sambungan", "Joinery"), photo: asset("v4e-face-1") }, { name: "Mbak Sri", role: tr("Finishing", "Finishing"), photo: asset("v4e-face-4") }] }),
      ],
      materials: () => [
        pageHead(J, { eyebrow: tr("Material", "Materials"), title: tr("Pilihan minyak & warna", "Oil & colour choices") }),
        swatches(J, { title: tr("Lima warna akhir", "Five finishes"), items: [["#e8c99b", tr("Alami", "Natural"), tr("Minyak tung bening.", "Clear tung oil.")], ["#b7814a", tr("Madu", "Honey"), tr("Hangat, paling laris.", "Warm, best-seller.")], ["#7a4a24", tr("Kopi", "Coffee"), tr("Cokelat tua.", "Dark brown.")], ["#3f2a1a", tr("Arang", "Charcoal"), tr("Hampir hitam.", "Almost black.")], ["#d6cfc4", tr("Kapur", "Limewash"), tr("Pucat ala pantai.", "Pale, coastal.")]] }),
        specs(J, { title: tr("Tentang kayu kami", "About our timber"), rows: [[tr("Jenis", "Species"), "Tectona grandis"], [tr("Asal", "Origin"), tr("Hutan rakyat Jawa Tengah", "Community forests, Central Java")], [tr("Kadar air", "Moisture"), "10–12%"], [tr("Sertifikat", "Certificate"), tr("SVLK legal", "SVLK legal timber")]], image: asset("v4e-chair"), alt: tr("Kayu jati", "Teak wood") }),
      ],
      projects: () => [
        pageHead(J, { eyebrow: tr("Proyek", "Projects"), title: tr("Rumah, kafe, dan hotel", "Homes, cafés and hotels") }),
        mosaic(J, { title: tr("Detail dari lapangan", "Details from the field"), images: [[asset("v4e-chair"), tr("Kursi makan", "Dining chairs")], [asset("v4e-sofa-clay"), tr("Ruang tamu", "Living room")], [asset("v4e-chair-sage"), tr("Teras", "Terrace")]] }),
        numbers(J, { items: [["1.200+", tr("Proyek", "Projects")], ["37", tr("Tahun", "Years")], ["14", tr("Negara tujuan", "Export countries")]] }),
      ],
      contact: () => [
        pageHead(J, { eyebrow: tr("Kontak", "Contact"), title: tr("Kunjungi galeri kami di Jepara", "Visit our Jepara showroom") }),
        locations(J, { title: tr("Galeri & bengkel", "Showroom & workshop"), image: asset("v4e-route"), places: [[tr("Galeri", "Showroom"), "Jl. Raya Tahunan 45, Jepara", tr("Setiap hari", "Daily")], [tr("Bengkel", "Workshop"), "Desa Mulyoharjo", tr("Tur dengan janji", "Tours by appointment")]] }),
        formD(J, { title: tr("Kirim pesan", "Send a message"), info: [["Email", "sapa@jatiwangsa.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "input", label: "Email", ph: "nama@email.com", type: "email" }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
      ],
    }),
};

