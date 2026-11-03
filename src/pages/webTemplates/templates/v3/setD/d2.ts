import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import { portfolioMosaic, servicesSplit, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import {
  bento,
  cardsD,
  catalog,
  counterD,
  countdownD,
  ctaD,
  dividerD,
  editorial,
  faqD,
  footerD,
  formD,
  galleryLb,
  headerD,
  heroBento,
  heroCollage,
  heroEditorial,
  heroPoster,
  heroType,
  home,
  indexList,
  locations,
  lookD,
  marqueeD,
  mosaic,
  newsletter,
  numbers,
  offer,
  pageHead,
  peopleD,
  pg,
  pro,
  pullQuote,
  quotesD,
  render,
  sliderD,
  specs,
  splitPanel,
  tableD,
  tabsD,
  timelineD,
  typerD,
  videoD,
  withFx,
  wordBand,
  zigzag,
} from "./kitD";

/* ================================================================== */
/* Template v3 D6–D10: Rumah produksi, Festival film, Perhiasan emas,    */
/* Perhiasan handmade, Rekrutmen eksekutif.                              */
/* ================================================================== */

/* ---------- 6. Layar Kenari Pictures — rumah produksi (6 hlm) --------- */
// Premium: pro-portfolio-mosaic, typewriter, logo-marquee. Library: Animate. Tema gelap, tipografi raksasa.

const FP: Palette = { ink: "#f5f5f4", muted: "#a8a29e", primary: "#dc2626", primaryDark: "#991b1b", soft: "#292524", line: "#44403c" };
const F = lookD(FP, { head: "Bebas Neue", body: "Space Grotesk", shape: "sharp", radius: 0, bg: "#0c0a09", alt: "#1c1917", inv: "#000000", surface: "#1c1917", fx: { animate: "fadeInUp" }, upper: true, dark: true });

const fFoot = (tr: Tr) =>
  footerD("Layar Kenari", F, {
    variant: "giant",
    about: tr("Rumah produksi film pendek, iklan, dan dokumenter. Jakarta Selatan.", "A production house for short films, commercials and documentaries. South Jakarta."),
    cols: [
      { title: tr("Studio", "Studio"), items: ["Jl. Kemang Timur 21", "+62 21 7100 2299", "halo@layarkenari.id"] },
      { title: tr("Ikuti", "Follow"), items: ["Vimeo", "Instagram", "YouTube"] },
    ],
    copy: tr("© 2026 Layar Kenari Pictures. Konten contoh.", "© 2026 Layar Kenari Pictures. Sample content."),
  });

export const filmProduksi: TemplateContent = {
  brand: "Layar Kenari Pictures",
  pages: [home(), pg("works", ["karya", "Karya"], ["work", "Work"]), pg("services", ["layanan", "Layanan"], ["services", "Services"]), pg("studio", ["studio", "Studio"], ["studio", "Studio"]), pg("process", ["proses", "Proses"], ["process", "Process"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) =>
    render(F, key, headerD("Layar Kenari", F, { variant: "bar", cta: [tr("Mulai proyek", "Start a project"), href("contact")] }), fFoot(tr), {
      home: () => [
        heroType(F, {
          eyebrow: tr("Rumah produksi · sejak 2014", "Production house · since 2014"),
          title: "",
          titleNode: typerD(F, tr("Kami membuat", "We make"), [tr("film pendek", "short films"), tr("iklan TV", "TV commercials"), tr("dokumenter", "documentaries"), tr("video musik", "music videos")], { size: 88 }),
          text: tr("Dari naskah hingga color grading, satu tim kecil yang menyimak cerita Anda dan membawanya ke layar.", "From script to colour grade — a small team that listens to your story and brings it to the screen."),
          image: asset("v3d-camera"),
          alt: tr("Kamera film", "Film camera"),
          words: [tr("Penyutradaraan", "Directing"), tr("Sinematografi", "Cinematography"), "Editing", tr("Tata suara", "Sound design"), "Color grading"],
          actions: [[tr("Tonton showreel", "Watch showreel"), href("works")]],
        }),
        withFx(F, portfolioMosaic(pro(F), tr, { eyebrow: tr("Karya terpilih", "Selected work"), title: tr("Cerita yang sudah tayang", "Stories already on screen"), text: tr("Iklan, film pendek festival, dan seri dokumenter.", "Commercials, festival shorts and documentary series."), works: [{ title: tr("Pulang ke Hulu", "Back Upstream"), tag: tr("Film pendek · 18 menit", "Short film · 18 min"), image: asset("v3d-camera") }, { title: tr("Rasa Sabtu", "Saturday Taste"), tag: tr("Iklan TV · 30 detik", "TV spot · 30 sec"), image: asset("v3d-food-plum") }, { title: tr("Penjaga Mercusuar", "The Lighthouse Keeper"), tag: tr("Dokumenter", "Documentary"), image: asset("v3d-lake-dusk") }, { title: "Ombak", tag: tr("Video musik", "Music video"), image: asset("v3d-turntable") }, { title: tr("Kota Tanpa Tidur", "Sleepless City"), tag: tr("Seri web", "Web series"), image: asset("v3d-tower-night") }], cta: { label: tr("Semua karya", "All work"), href: href("works") } })),
        marqueeD(F, { title: tr("Klien dan mitra distribusi", "Clients and distribution partners"), items: ["Kopi Tepian", "Sepatu Langkah", "Teh Lereng", "Rumah Musik Senandika", "Yayasan Arsip Rekam", "Bioskop Kolektif Pesisir"] }),
        ctaD(F, { title: tr("Punya cerita? Kami siapkan kameranya.", "Got a story? We'll bring the camera."), actions: [[tr("Ceritakan proyek Anda", "Tell us about your project"), href("contact")]], tone: "primary" }),
      ],
      works: () => [
        pageHead(F, { eyebrow: tr("Karya", "Work"), title: tr("Arsip produksi", "Production archive"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Karya", "Work"), ""]] }),
        videoD(F, { title: tr("Showreel 2026", "Showreel 2026"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", vtitle: "Showreel Layar Kenari 2026" }),
        indexList(F, { title: tr("Daftar karya", "Project list"), rows: [{ title: tr("Pulang ke Hulu", "Back Upstream"), meta: tr("2025 · Film pendek", "2025 · Short film"), tag: tr("Festival", "Festival"), href: href("works"), cta: tr("Detail", "Details") }, { title: tr("Rasa Sabtu", "Saturday Taste"), meta: tr("2025 · Iklan", "2025 · Commercial"), tag: "TVC", href: href("works"), cta: tr("Detail", "Details") }, { title: tr("Penjaga Mercusuar", "The Lighthouse Keeper"), meta: tr("2024 · Dokumenter", "2024 · Documentary"), tag: tr("Seri 3 episode", "3-episode series"), href: href("works"), cta: tr("Detail", "Details") }, { title: "Ombak", meta: tr("2024 · Video musik", "2024 · Music video"), href: href("works"), cta: tr("Detail", "Details") }] }),
      ],
      services: () => [
        pageHead(F, { eyebrow: tr("Layanan", "Services"), title: tr("Praproduksi sampai paskaproduksi", "Pre-production to post") }),
        bento(F, { title: tr("Yang kami kerjakan", "What we do"), items: [{ title: tr("Iklan & konten merek", "Ads & brand content"), text: tr("TVC, video sosial media, dan kampanye digital.", "TVCs, social video and digital campaigns."), wide: true, accent: true }, { title: tr("Film pendek", "Short films"), text: tr("Pengembangan naskah dan produksi festival.", "Script development and festival production.") }, { title: tr("Dokumenter", "Documentary"), text: tr("Riset, wawancara, dan arsip.", "Research, interviews and archives.") }, { title: tr("Paskaproduksi", "Post-production"), text: tr("Editing, grading, mixing 5.1.", "Editing, grading, 5.1 mixing."), wide: true }] }),
        tableD(F, { title: tr("Paket mulai dari", "Packages from"), columns: [tr("Paket", "Package"), tr("Durasi", "Length"), tr("Mulai", "From")], rows: [[tr("Video sosial", "Social video"), "15–60 dtk", "Rp45 jt"], ["TVC", "30 dtk", "Rp280 jt"], [tr("Film pendek", "Short film"), "10–20 mnt", "Rp350 jt"]], note: tr("Harga contoh, belum termasuk talent & lokasi.", "Sample prices, excluding talent and locations.") }),
      ],
      studio: () => [
        pageHead(F, { eyebrow: "Studio", title: tr("Dua belas orang, satu ruang editing", "Twelve people, one edit suite") }),
        peopleD(F, { title: tr("Tim inti", "Core team"), items: [{ name: "Reza Mahendra", role: tr("Sutradara", "Director"), photo: asset("v3d-face-1") }, { name: "Kinanti Ayuningtyas", role: tr("Produser", "Producer"), photo: asset("v3d-face-2") }, { name: "Bayu Saptaji", role: tr("Penata kamera", "Cinematographer"), photo: asset("v3d-face-3") }, { name: "Sekar Arum", role: "Editor", photo: asset("v3d-face-6") }] }),
        specs(F, { title: tr("Peralatan", "Gear"), rows: [[tr("Kamera", "Cameras"), tr("Sinema 6K × 2, lensa anamorfik", "6K cinema × 2, anamorphic lenses")], [tr("Lampu", "Lighting"), tr("LED 1.200 W, balon cahaya", "1,200 W LEDs, light balloons")], [tr("Studio", "Stage"), tr("Ruang 120 m² dengan cyclorama", "120 m² room with cyclorama")]], image: asset("v3d-camera-light"), alt: tr("Kamera di studio", "Camera on stage") }),
      ],
      process: () => [
        pageHead(F, { eyebrow: tr("Proses", "Process"), title: tr("Dari ide ke layar dalam 6 minggu", "Idea to screen in 6 weeks") }),
        zigzag(F, { title: tr("Tahapan produksi", "Production stages"), steps: [[tr("Pengembangan", "Development"), tr("Riset, naskah, dan papan mood bersama tim Anda.", "Research, script and mood boards with your team.")], [tr("Praproduksi", "Pre-production"), tr("Casting, survei lokasi, dan jadwal syuting.", "Casting, location scouting and shoot schedule.")], [tr("Syuting", "Shoot"), tr("Rata-rata 2–4 hari dengan kru 15–30 orang.", "Typically 2–4 days with a 15–30 person crew.")], [tr("Paskaproduksi", "Post"), tr("Dua putaran revisi termasuk.", "Two rounds of revisions included.")]] }),
        faqD(F, { title: tr("Pertanyaan klien", "Client questions"), items: [[tr("Bisa syuting di luar kota?", "Can you shoot out of town?"), tr("Bisa, biaya perjalanan dihitung terpisah.", "Yes, travel is quoted separately.")], [tr("Siapa pemilik hak cipta?", "Who owns the rights?"), tr("Klien, kecuali disepakati lain.", "The client, unless agreed otherwise.")], [tr("Pembayaran?", "Payment?"), tr("40% di muka, 60% saat serah terima.", "40% upfront, 60% on delivery.")], [tr("Format akhir?", "Final formats?"), tr("4K, 1080p, vertikal untuk media sosial.", "4K, 1080p and vertical for social.")]] }),
      ],
      contact: () => [
        pageHead(F, { eyebrow: tr("Kontak", "Contact"), title: tr("Mari bicara soal cerita Anda", "Let's talk about your story") }),
        formD(F, { title: tr("Ringkasan proyek", "Project brief"), info: [["Email", "halo@layarkenari.id"], [tr("Telepon", "Phone"), "+62 21 7100 2299"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("Perusahaan", "Company"), ph: "" }, { kind: "select", label: tr("Jenis proyek", "Project type"), ph: tr("Pilih", "Choose"), options: [tr("Iklan", "Commercial"), tr("Film pendek", "Short film"), tr("Dokumenter", "Documentary"), tr("Lainnya", "Other")] }, { kind: "select", label: tr("Anggaran", "Budget"), ph: tr("Pilih", "Choose"), options: ["< Rp100 jt", "Rp100–300 jt", "> Rp300 jt"] }], message: tr("Ceritakan idenya", "Tell us the idea"), submit: tr("Kirim brief", "Send brief") }),
      ],
    }),
};

/* --------- 7. Festival Film Pesisir Lumbara (5 hlm, Premium) ---------- */
// Premium: countdown, slider, modal-popup. Library: AOS + Animate. Gaya retro poster.

const XP: Palette = { ink: "#2b0a0a", muted: "#6b3a32", primary: "#b91c1c", primaryDark: "#7f1d1d", soft: "#fef3c7", line: "#fcd34d" };
const X = lookD(XP, { head: "Righteous", body: "Work Sans", shape: "retro", radius: 14, bg: "#fffbeb", alt: "#fef3c7", inv: "#2b0a0a", fx: { aos: "flip-up", animate: "bounceIn" } });

const xFoot = (tr: Tr) =>
  footerD("FFP Lumbara", X, {
    variant: "columns",
    about: tr("Festival Film Pesisir Lumbara — film pendek dan panjang dari kota-kota pantai Asia Tenggara.", "Lumbara Coastal Film Festival — short and feature films from Southeast Asia's coastal towns."),
    cols: [
      { title: tr("Festival", "Festival"), items: [tr("12–15 Des 2026", "12–15 Dec 2026"), tr("5 lokasi pemutaran", "5 venues"), "info@ffplumbara.id"] },
      { title: tr("Ikuti", "Follow"), items: ["@ffplumbara", tr("Buletin festival", "Festival newsletter")] },
    ],
    social: ["Instagram | https://instagram.com/ffplumbara", "X | https://x.com/ffplumbara"],
    copy: tr("© 2026 FFP Lumbara. Konten contoh.", "© 2026 FFP Lumbara. Sample content."),
  });

export const filmFestival: TemplateContent = {
  brand: "Festival Film Pesisir Lumbara",
  pages: [home(), pg("program", ["program", "Program"], ["programme", "Programme"]), pg("films", ["film-pilihan", "Film Pilihan"], ["selection", "Selection"]), pg("tickets", ["tiket", "Tiket"], ["tickets", "Tickets"]), pg("venues", ["lokasi", "Lokasi"], ["venues", "Venues"])],
  build: (key, tr, href) =>
    render(X, key, headerD("FFP Lumbara", X, { variant: "center", cta: [tr("Beli tiket", "Buy tickets"), href("tickets")] }), xFoot(tr), {
      home: () => [
        heroPoster(X, {
          eyebrow: tr("Edisi ke-7", "7th edition"),
          title: tr("Cerita dari tepi laut", "Stories from the shoreline"),
          date: tr("12—15 Desember 2026 · Lumbara", "12—15 December 2026 · Lumbara"),
          text: tr("64 film dari 11 negara, pemutaran layar tancap di pantai, dan diskusi bersama pembuat film.", "64 films from 11 countries, open-air beach screenings and talks with filmmakers."),
          image: asset("v3d-cinema"),
          alt: tr("Layar bioskop", "Cinema screen"),
          actions: [[tr("Lihat program", "See the programme"), href("program")], [tr("Beli pas festival", "Get a festival pass"), href("tickets"), "outline"]],
        }),
        countdownD(X, { eyebrow: tr("Menuju pembukaan", "Countdown to opening"), title: tr("Layar dibuka sebentar lagi", "The screen opens soon"), text: tr("Film pembuka: Garam di Ujung Lidah (2026).", "Opening film: Salt on the Tongue (2026)."), target: "2026-12-12T19:00", finished: tr("Festival sedang berlangsung", "The festival is on") }),
        sliderD(X, { title: tr("Sorotan program", "Programme highlights"), slides: [{ title: tr("Kompetisi Pendek Asia Tenggara", "Southeast Asian Shorts Competition"), text: tr("24 film bersaing untuk Jangkar Emas.", "24 films compete for the Golden Anchor."), bg: "#b91c1c" }, { title: tr("Layar Pantai", "Beach Screen"), text: tr("Pemutaran gratis tiap malam pukul 19.30.", "Free screenings every night at 7.30pm."), bg: "#7f1d1d" }, { title: tr("Kelas Sinema", "Cinema Class"), text: tr("Lokakarya penyuntingan untuk pelajar.", "Editing workshop for students."), bg: "#b45309" }] }),
        wordBand(X, [tr("Kompetisi", "Competition"), tr("Layar pantai", "Beach screen"), tr("Diskusi", "Talks"), tr("Lokakarya", "Workshops"), tr("Pasar film", "Film market")], { bg: "#2b0a0a", color: "#fcd34d" }),
      ],
      program: () => [
        pageHead(X, { eyebrow: tr("Program", "Programme"), title: tr("Empat hari, lima layar", "Four days, five screens"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Program", "Programme"), ""]] }),
        tabsD(X, { title: tr("Jadwal harian", "Daily schedule"), tabs: [[tr("Sabtu 12", "Sat 12"), tr("19.00 Pembukaan & film pembuka di Gedung Kesenian. 21.30 Layar Pantai: Kompilasi Pendek A.", "7pm Opening & opening film at the Arts Hall. 9.30pm Beach Screen: Shorts A.")], [tr("Minggu 13", "Sun 13"), tr("10.00 Kompetisi Pendek blok 1–3. 16.00 Diskusi: Membuat film tanpa studio.", "10am Shorts competition blocks 1–3. 4pm Talk: Filmmaking without a studio.")], [tr("Senin 14", "Mon 14"), tr("10.00 Kelas Sinema. 19.30 Film panjang: Perahu Kertas Ibu.", "10am Cinema Class. 7.30pm Feature: Mother's Paper Boat.")], [tr("Selasa 15", "Tue 15"), tr("19.00 Malam penghargaan Jangkar Emas.", "7pm Golden Anchor awards night.")]] }),
        timelineD(X, { title: tr("Acara khusus", "Special events"), items: [["12 Des · 19.00", tr("Malam pembukaan", "Opening night"), tr("Karpet merah pasir dan orkes kampung.", "A sand red carpet and village orchestra.")], ["13 Des · 16.00", tr("Diskusi pembuat film", "Filmmaker talk"), tr("Tiga sutradara muda pesisir.", "Three young coastal directors.")], ["15 Des · 19.00", tr("Penghargaan", "Awards"), tr("Jangkar Emas, Perak, dan Pilihan Penonton.", "Golden & Silver Anchor and Audience Choice.")]] }),
      ],
      films: () => [
        pageHead(X, { eyebrow: tr("Seleksi resmi", "Official selection"), title: tr("Film pilihan 2026", "2026 selection") }),
        catalog(X, { title: tr("Kompetisi utama", "Main competition"), items: [{ image: asset("v3d-cinema"), title: tr("Garam di Ujung Lidah", "Salt on the Tongue"), text: tr("Drama · 94 menit · Indonesia", "Drama · 94 min · Indonesia"), price: tr("Film pembuka", "Opening film"), cta: tr("Jadwal", "Schedule"), href: href("program") }, { image: asset("v3d-lake-dusk"), title: tr("Pulau yang Pergi", "The Island That Left"), text: tr("Dokumenter · 72 menit", "Documentary · 72 min"), price: tr("Premier Asia", "Asian premiere"), cta: tr("Jadwal", "Schedule"), href: href("program") }, { image: asset("v3d-cinema-gold"), title: tr("Jala", "The Net"), text: tr("Pendek · 15 menit", "Short · 15 min"), price: tr("Kompetisi", "Competition"), cta: tr("Jadwal", "Schedule"), href: href("program") }] }),
        pullQuote(X, { text: tr("Film dari pesisir mengajarkan kita bahwa laut bukan batas, melainkan jalan.", "Coastal cinema teaches us the sea is not a border but a road."), name: "Ratna Kemalasari", role: tr("Direktur program", "Programme director") }),
      ],
      tickets: () => [
        pageHead(X, { eyebrow: tr("Tiket", "Tickets"), title: tr("Pas festival & tiket satuan", "Festival passes & single tickets") }),
        tableD(X, { title: tr("Harga tiket", "Ticket prices"), columns: [tr("Jenis", "Type"), tr("Harga", "Price"), tr("Termasuk", "Includes")], rows: [[tr("Satuan", "Single"), "Rp35.000", tr("1 pemutaran", "1 screening")], [tr("Pas harian", "Day pass"), "Rp90.000", tr("Semua pemutaran 1 hari", "All screenings for a day")], [tr("Pas festival", "Festival pass"), "Rp250.000", tr("4 hari + malam penghargaan", "4 days + awards night")], [tr("Pelajar", "Student"), "Rp20.000", tr("Dengan kartu pelajar", "With student card")]] }),
        offer(X, { eyebrow: tr("Penawaran awal", "Early bird"), title: tr("Pas festival hemat 30%", "Festival pass 30% off"), text: tr("Hanya sampai 15 November 2026.", "Only until 15 November 2026."), trigger: tr("Klaim harga awal", "Claim early price"), modalTitle: tr("Pas festival Rp175.000", "Festival pass Rp175,000"), body: tr("Masukkan kode PESISIR7 saat checkout. Maksimal 2 pas per akun, tidak dapat diuangkan kembali.", "Enter code PESISIR7 at checkout. Max 2 passes per account, non-refundable."), cta: tr("Beli sekarang", "Buy now"), href: href("tickets") }),
        faqD(X, { title: tr("Info tiket", "Ticket info"), items: [[tr("Tiket bisa ditukar?", "Can I exchange tickets?"), tr("Bisa, maksimal 2 jam sebelum pemutaran.", "Yes, up to 2 hours before the screening.")], [tr("Batas usia?", "Age limits?"), tr("Lihat rating di tiap film.", "See each film's rating.")], [tr("Layar Pantai berbayar?", "Is the Beach Screen paid?"), tr("Gratis, tanpa reservasi.", "Free, no booking.")], [tr("Ada subtitle?", "Subtitles?"), tr("Semua film bersubtitle Indonesia & Inggris.", "All films subtitled in Indonesian & English.")]] }),
      ],
      venues: () => [
        pageHead(X, { eyebrow: tr("Lokasi", "Venues"), title: tr("Lima tempat pemutaran", "Five screening venues") }),
        locations(X, { title: tr("Peta festival", "Festival map"), image: asset("v3d-map"), places: [[tr("Gedung Kesenian Lumbara", "Lumbara Arts Hall"), "Jl. Dermaga 1", tr("Layar utama, 420 kursi", "Main screen, 420 seats")], [tr("Layar Pantai", "Beach Screen"), tr("Pantai Tanjung Lumbara", "Tanjung Lumbara Beach"), tr("Gratis, 19.30", "Free, 7.30pm")], [tr("Bioskop Rakyat", "People's Cinema"), "Jl. Pasar Ikan 12", tr("180 kursi", "180 seats")]] }),
        newsletter(X, { title: tr("Kabar festival", "Festival news"), text: tr("Pengumuman program dan relawan.", "Programme and volunteer announcements."), ph: "email@contoh.com", submit: tr("Daftar", "Sign up") }),
      ],
    }),
};

/* --------- 8. Kencana Rasmi — perhiasan emas & berlian (6 hlm) -------- */
// Premium: gallery-lightbox, testimonial. Library: Tilt + AOS. Gaya editorial mewah.

const EP: Palette = { ink: "#1c1408", muted: "#6b5a3e", primary: "#a16207", primaryDark: "#713f12", soft: "#fef9c3", line: "#e7d9b0" };
const E = lookD(EP, { head: "Cormorant Garamond", body: "Montserrat", shape: "editorial", radius: 0, bg: "#fffdf7", alt: "#f8f3e6", inv: "#1c1408", fx: { tilt: true, aos: "fade" } });

const eFoot = (tr: Tr) =>
  footerD("Kencana Rasmi", E, {
    variant: "columns",
    about: tr("Perhiasan emas & berlian bersertifikat. Butik keluarga sejak 1978.", "Certified gold & diamond jewellery. A family boutique since 1978."),
    cols: [
      { title: tr("Butik", "Boutiques"), items: ["Jl. Sudirman 88, Medan", "Jl. Pemuda 14, Semarang"] },
      { title: tr("Layanan", "Services"), items: [tr("Buyback emas", "Gold buyback"), tr("Pesanan khusus", "Custom orders"), tr("Perawatan", "Care")] },
    ],
    copy: tr("© 2026 Kencana Rasmi. Konten contoh.", "© 2026 Kencana Rasmi. Sample content."),
  });

export const jewelryEmas: TemplateContent = {
  brand: "Kencana Rasmi",
  pages: [home(), pg("collection", ["koleksi", "Koleksi"], ["collection", "Collection"]), pg("gold", ["harga-emas", "Harga Emas"], ["gold-price", "Gold Price"]), pg("custom", ["pesanan-khusus", "Pesanan Khusus"], ["custom-orders", "Custom Orders"]), pg("care", ["perawatan", "Perawatan"], ["care", "Care"]), pg("boutiques", ["butik", "Butik"], ["boutiques", "Boutiques"])],
  build: (key, tr, href) =>
    render(E, key, headerD("Kencana Rasmi", E, { variant: "center" }), eFoot(tr), {
      home: () => [
        heroEditorial(E, {
          meta: [tr("Edisi Pernikahan", "Bridal edition"), tr("Musim 2026", "Season 2026"), tr("Emas 18K & 24K", "18K & 24K gold")],
          eyebrow: tr("Koleksi baru", "New collection"),
          title: tr("Cahaya yang diwariskan", "Light worth passing on"),
          text: tr("Cincin, kalung, dan gelang yang dibuat tangan oleh pengrajin kami — bersertifikat, dengan jaminan buyback seumur hidup.", "Rings, necklaces and bracelets handmade by our artisans — certified, with a lifetime buyback guarantee."),
          image: asset("v3d-ring"),
          alt: tr("Cincin emas dan kalung", "Gold ring and necklace"),
          actions: [[tr("Jelajahi koleksi", "Explore the collection"), href("collection")], [tr("Harga emas hari ini", "Today's gold price"), href("gold"), "outline"]],
        }),
        editorial(E, { title: tr("Janji Kencana Rasmi", "The Kencana Rasmi promise"), cols: [[tr("Bersertifikat", "Certified"), tr("Setiap berlian disertai sertifikat laboratorium independen.", "Every diamond comes with an independent lab certificate.")], [tr("Buyback seumur hidup", "Lifetime buyback"), tr("Potongan hanya 5% dari harga emas hari itu.", "Only 5% below that day's gold price.")], [tr("Dibuat tangan", "Handmade"), tr("Pengrajin dengan pengalaman rata-rata 20 tahun.", "Artisans with 20 years' experience on average.")]] }),
        galleryLb(E, { eyebrow: tr("Lookbook", "Lookbook"), title: tr("Koleksi Pernikahan 2026", "2026 Bridal Collection"), images: [[asset("v3d-ring"), tr("Cincin Rasmi solitaire", "Rasmi solitaire ring")], [asset("v3d-ring-dark"), tr("Kalung Senja", "Senja necklace")], [asset("v3d-beads"), tr("Gelang Mutiara Laut", "Sea Pearl bracelet")]], ratio: "4 / 5" }),
        quotesD(E, { title: tr("Kata pelanggan", "Customer words"), items: [{ quote: tr("Cincin nikah kami dibuat ulang dari emas peninggalan nenek. Hasilnya luar biasa.", "Our wedding rings were remade from grandma's gold. Stunning result."), author: "Anindya & Fajar", role: tr("Pasangan pengantin", "Newlyweds"), avatar: asset("v3d-face-4") }, { quote: tr("Proses buyback cepat dan transparan, dihitung di depan saya.", "The buyback was quick and transparent, calculated in front of me."), author: "Hendra Gunawan", role: tr("Pelanggan sejak 1995", "Customer since 1995"), avatar: asset("v3d-face-5") }] }),
      ],
      collection: () => [
        pageHead(E, { eyebrow: tr("Koleksi", "Collection"), title: tr("Cincin, kalung, gelang", "Rings, necklaces, bracelets"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Koleksi", "Collection"), ""]] }),
        catalog(E, { title: tr("Paling dicari", "Most wanted"), items: [{ image: asset("v3d-ring"), title: tr("Cincin Rasmi 0,3 ct", "Rasmi ring 0.3 ct"), text: tr("Emas putih 18K, berlian VS1.", "18K white gold, VS1 diamond."), price: "Rp18.400.000", cta: tr("Tanya stok", "Check stock"), href: href("boutiques") }, { image: asset("v3d-ring-dark"), title: tr("Kalung Senja", "Senja necklace"), text: tr("Emas kuning 18K, liontin ruby.", "18K yellow gold, ruby pendant."), price: "Rp9.750.000", cta: tr("Tanya stok", "Check stock"), href: href("boutiques") }, { image: asset("v3d-beads"), title: tr("Gelang Mutiara Laut", "Sea Pearl bracelet"), text: tr("Mutiara air laut, kait emas.", "Saltwater pearls, gold clasp."), price: "Rp6.200.000", cta: tr("Tanya stok", "Check stock"), href: href("boutiques") }] }),
        mosaic(E, { title: tr("Detail pengerjaan", "Craft details"), images: [[asset("v3d-ring"), tr("Pemasangan batu", "Stone setting")], [asset("v3d-ring-dark"), tr("Pemolesan akhir", "Final polish")], [asset("v3d-beads"), tr("Merangkai mutiara", "Pearl stringing")]] }),
      ],
      gold: () => [
        pageHead(E, { eyebrow: tr("Harga emas", "Gold price"), title: tr("Harga hari ini & buyback", "Today's price & buyback"), text: tr("Diperbarui setiap pukul 09.00 WIB. Angka contoh.", "Updated daily at 9am WIB. Sample figures.") }),
        tableD(E, { title: tr("Harga per gram", "Price per gram"), columns: [tr("Kadar", "Purity"), tr("Jual", "Sell"), tr("Buyback", "Buyback")], rows: [["24K", "Rp1.420.000", "Rp1.349.000"], ["22K", "Rp1.305.000", "Rp1.239.000"], ["18K", "Rp1.072.000", "Rp1.018.000"]] }),
        specs(E, { title: tr("Syarat buyback", "Buyback terms"), rows: [[tr("Dokumen", "Documents"), tr("Nota asli & sertifikat", "Original receipt & certificate")], [tr("Potongan", "Deduction"), tr("5% dari harga hari itu", "5% of that day's price")], [tr("Tanpa nota", "Without receipt"), tr("Dinilai ulang di tempat", "Re-assessed on site")]] }),
      ],
      custom: () => [
        pageHead(E, { eyebrow: tr("Pesanan khusus", "Custom orders"), title: tr("Rancang perhiasan Anda sendiri", "Design your own piece") }),
        zigzag(E, { title: tr("Dari sketsa ke jari manis", "From sketch to ring finger"), steps: [[tr("Konsultasi", "Consultation"), tr("Bawa ide, foto, atau emas lama Anda.", "Bring ideas, photos or your old gold."), asset("v3d-ring")], [tr("Model lilin", "Wax model"), tr("Cetakan 3D untuk dicoba sebelum dicor.", "A 3D-printed model to try before casting."), asset("v3d-ring-dark")], [tr("Pengerjaan", "Crafting"), tr("3–5 minggu oleh pengrajin kami.", "3–5 weeks by our artisans."), asset("v3d-beads")]] }),
        formD(E, { title: tr("Jadwalkan konsultasi", "Book a consultation"), info: [[tr("Durasi", "Duration"), tr("45 menit, gratis", "45 minutes, free")], ["WhatsApp", "0812 6000 1978"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "select", label: tr("Butik", "Boutique"), ph: tr("Pilih", "Choose"), options: ["Medan", "Semarang"] }, { kind: "date", label: tr("Tanggal", "Date") }], message: tr("Ceritakan ide Anda", "Describe your idea"), submit: tr("Pesan jadwal", "Book") }),
      ],
      care: () => [
        pageHead(E, { eyebrow: tr("Perawatan", "Care"), title: tr("Agar kilaunya bertahan puluhan tahun", "Keeping the shine for decades") }),
        cardsD(E, { title: tr("Panduan singkat", "Quick guide"), items: [{ title: tr("Lepas saat berenang", "Remove when swimming"), text: tr("Klorin bisa merusak emas putih.", "Chlorine can damage white gold.") }, { title: tr("Simpan terpisah", "Store separately"), text: tr("Gunakan kantong kain agar tidak tergores.", "Use cloth pouches to avoid scratches.") }, { title: tr("Cuci lembut", "Gentle wash"), text: tr("Air hangat, sabun bayi, sikat gigi halus.", "Warm water, baby soap, a soft toothbrush.") }] }),
        faqD(E, { title: tr("Layanan perawatan", "Care services"), items: [[tr("Cuci gratis?", "Free cleaning?"), tr("Ya, seumur hidup untuk produk kami.", "Yes, for life on our pieces.")], [tr("Ganti ukuran cincin?", "Resizing?"), tr("Gratis sekali dalam tahun pertama.", "Free once in the first year.")], [tr("Rodium ulang?", "Re-plating?"), tr("Rp250.000 untuk emas putih.", "Rp250,000 for white gold.")], [tr("Berapa lama?", "How long?"), tr("1–3 hari kerja.", "1–3 working days.")]] }),
      ],
      boutiques: () => [
        pageHead(E, { eyebrow: tr("Butik", "Boutiques"), title: tr("Kunjungi kami", "Visit us") }),
        locations(E, { title: tr("Dua butik", "Two boutiques"), image: asset("v3d-map"), places: [["Kencana Rasmi Medan", "Jl. Sudirman 88", tr("Sen–Sab 10.00–19.00", "Mon–Sat 10am–7pm")], ["Kencana Rasmi Semarang", "Jl. Pemuda 14", tr("Setiap hari 10.00–20.00", "Daily 10am–8pm")]] }),
        splitPanel(E, { title: tr("Ruang privat", "Private room"), text: tr("Untuk memilih cincin pernikahan dengan tenang, pesan ruang privat 60 menit.", "To choose wedding rings in peace, book a private 60-minute room."), image: asset("v3d-ring-dark"), alt: tr("Perhiasan di etalase", "Jewellery on display"), actions: [[tr("Pesan ruang", "Book the room"), href("custom")]] }),
      ],
    }),
};

/* ------------ 9. Untai Perak Atelier — perhiasan handmade (4 hlm) ------- */
// Premium: pro-testimonials-wall. Library: Tilt. Pastel lembut + aksara tulisan tangan.

const UP: Palette = { ink: "#3b0d24", muted: "#7a4a5f", primary: "#9d174d", primaryDark: "#831843", soft: "#fce7f3", line: "#fbcfe8" };
const U = lookD(UP, { head: "Caveat", body: "Josefin Sans", shape: "soft", radius: 32, bg: "#fffafc", alt: "#fdf0f6", inv: "#3b0d24", fx: { tilt: true } });

const uFoot = (tr: Tr) =>
  footerD("Untai Perak", U, {
    variant: "slim",
    about: tr("Perhiasan perak & manik buatan tangan dari studio kecil di Bali.", "Handmade silver & bead jewellery from a small studio in Bali."),
    social: ["Instagram | https://instagram.com/untaiperak", "Pinterest | https://pinterest.com/untaiperak", "WhatsApp | https://wa.me/6281200007788"],
    copy: tr("© 2026 Untai Perak Atelier. Konten contoh.", "© 2026 Untai Perak Atelier. Sample content."),
  });

export const jewelryHandmade: TemplateContent = {
  brand: "Untai Perak Atelier",
  pages: [home(), pg("shop", ["toko", "Toko"], ["shop", "Shop"]), pg("workshop", ["kelas", "Kelas"], ["workshop", "Workshop"]), pg("story", ["cerita", "Cerita & Kontak"], ["story", "Story & Contact"])],
  build: (key, tr, href) =>
    render(U, key, headerD("Untai Perak", U, { variant: "pill", cta: [tr("Ikut kelas", "Join a class"), href("workshop")] }), uFoot(tr), {
      home: () => [
        heroCollage(U, {
          eyebrow: tr("Dibuat pelan, dipakai lama", "Made slowly, worn for years"),
          title: tr("Perak kecil untuk cerita besar", "Little silver for big stories"),
          text: tr("Anting, cincin, dan gelang manik yang ditempa satu per satu. Setiap karya punya cacat kecil yang membuatnya milik Anda.", "Earrings, rings and beaded bracelets forged one by one. Each piece has a tiny flaw that makes it yours."),
          images: [[asset("v3d-beads"), tr("Gelang manik", "Beaded bracelet")], [asset("v3d-ring"), tr("Cincin perak", "Silver ring")], [asset("v3d-beads-teal"), tr("Kalung manik", "Bead necklace")]],
          actions: [[tr("Belanja", "Shop"), href("shop")], [tr("Kelas membuat cincin", "Ring-making class"), href("workshop"), "outline"]],
        }),
        catalog(U, { title: tr("Baru dari meja kerja", "Fresh off the bench"), items: [{ image: asset("v3d-ring"), title: tr("Cincin Ombak", "Wave ring"), text: tr("Perak 925, tekstur palu.", "925 silver, hammered texture."), price: "Rp285.000", cta: tr("Pesan", "Order"), href: href("shop") }, { image: asset("v3d-beads"), title: tr("Gelang Kuncup", "Bud bracelet"), text: tr("Manik kaca & perak.", "Glass beads & silver."), price: "Rp195.000", badge: tr("Baru", "New"), cta: tr("Pesan", "Order"), href: href("shop") }, { image: asset("v3d-beads-teal"), title: tr("Kalung Lagun", "Lagoon necklace"), text: tr("Manik toska, panjang 42 cm.", "Turquoise beads, 42 cm."), price: "Rp340.000", cta: tr("Pesan", "Order"), href: href("shop") }] }),
        withFx(U, testimonialsWall(pro(U), tr, { title: tr("Dipakai, lalu dicintai", "Worn, then loved"), score: 4.9, caption: tr("dari 640 pesanan", "from 640 orders"), quotes: [{ text: tr("Cincinnya pas sekali, kemasannya juga manis.", "The ring fits perfectly, and the packaging is lovely."), name: "Dinda", role: "Denpasar", avatar: asset("v3d-face-2") }, { text: tr("Kelas membuat cincin jadi kencan paling berkesan.", "The ring class was our most memorable date."), name: "Arya & Nita", role: tr("Peserta kelas", "Class guests"), avatar: asset("v3d-face-3") }, { text: tr("Gelangnya tidak menghitam setelah setahun.", "No tarnish after a year."), name: "Sari", role: "Yogyakarta", avatar: asset("v3d-face-4") }] })),
      ],
      shop: () => [
        pageHead(U, { eyebrow: tr("Toko", "Shop"), title: tr("Pesan lewat pesan langsung", "Order by direct message"), text: tr("Stok terbatas; ukuran cincin bisa disesuaikan dalam 3 hari.", "Limited stock; ring sizes adjusted within 3 days.") }),
        bento(U, { title: tr("Kategori", "Categories"), items: [{ title: tr("Cincin", "Rings"), text: tr("24 model, ukuran 5–12.", "24 styles, sizes 5–12."), image: asset("v3d-ring"), tall: true }, { title: tr("Anting", "Earrings"), text: tr("Kait & tusuk, antialergi.", "Hooks & studs, hypoallergenic."), icon: "◌" }, { title: tr("Gelang manik", "Bead bracelets"), text: tr("Bisa pilih warna sendiri.", "Choose your colours."), icon: "∞", accent: true }, { title: tr("Kado", "Gifts"), text: tr("Kotak kayu + kartu tulisan tangan.", "Wooden box + handwritten card."), icon: "✿", wide: true }] }),
        tableD(U, { title: tr("Panduan ukuran cincin", "Ring size guide"), columns: [tr("Ukuran", "Size"), tr("Keliling jari", "Circumference")], rows: [["6", "51,8 mm"], ["7", "54,4 mm"], ["8", "57,0 mm"], ["9", "59,5 mm"]] }),
      ],
      workshop: () => [
        pageHead(U, { eyebrow: tr("Kelas", "Workshop"), title: tr("Buat cincin perakmu sendiri dalam 3 jam", "Make your own silver ring in 3 hours") }),
        zigzag(U, { title: tr("Yang akan kamu lakukan", "What you'll do"), steps: [[tr("Memotong & menempa", "Cut & hammer"), tr("Memilih tekstur dan ukuran.", "Choose texture and size."), asset("v3d-ring")], [tr("Menyolder", "Solder"), tr("Dipandu satu-satu, aman untuk pemula.", "Guided one-to-one, beginner-safe."), asset("v3d-beads")], [tr("Memoles", "Polish"), tr("Dibawa pulang hari itu juga.", "Take it home the same day."), asset("v3d-beads-teal")]] }),
        formD(U, { title: tr("Pesan kursi", "Book a seat"), info: [[tr("Harga", "Price"), tr("Rp450.000 / orang", "Rp450,000 / person")], [tr("Jadwal", "Schedule"), tr("Sabtu & Minggu 10.00", "Sat & Sun 10am")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "date", label: tr("Tanggal", "Date") }, { kind: "select", label: tr("Peserta", "Guests"), ph: tr("Pilih", "Choose"), options: ["1", "2", "3–4"] }], submit: tr("Pesan", "Book") }),
      ],
      story: () => [
        splitPanel(U, { eyebrow: tr("Cerita", "Story"), title: tr("Dimulai dari meja makan", "It started at the dining table"), text: tr("Gita belajar menempa perak dari pengrajin Celuk, lalu membuka studio kecil di halaman rumahnya pada 2020.", "Gita learned silversmithing from Celuk artisans and opened a small studio in her yard in 2020."), image: asset("v3d-beads"), alt: tr("Untaian manik", "Bead strands"), bullets: [tr("Perak daur ulang", "Recycled silver"), tr("Kemasan tanpa plastik", "Plastic-free packaging")] }),
        dividerD(U, tr("Hubungi kami", "Get in touch")),
        formD(U, { title: tr("Kirim pesan", "Send a message"), info: [["WhatsApp", "0812 0000 7788"], ["Email", "halo@untaiperak.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: "Email", ph: "", type: "email" }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send"), name: tr("Kontak", "Contact") }),
      ],
    }),
};

/* ------------- 10. Talentara Partners — rekrutmen eksekutif (8 hlm) ------- */
// Premium: pro-services-split, pro-team-cards, stats-counter, logo-marquee, testimonial. Library: AOS.

const TP: Palette = { ink: "#042f2e", muted: "#41615e", primary: "#0f766e", primaryDark: "#115e59", soft: "#ccfbf1", line: "#99f6e4" };
const TA = lookD(TP, { head: "Syne", body: "Inter", shape: "sharp", radius: 6, bg: "#ffffff", alt: "#f0fdfa", inv: "#042f2e", fx: { aos: "fade-left" } });

const taFoot = (tr: Tr) =>
  footerD("Talentara", TA, {
    variant: "giant",
    about: tr("Rekrutmen eksekutif dan profesional untuk perusahaan yang tumbuh cepat.", "Executive and professional search for fast-growing companies."),
    cols: [
      { title: tr("Perusahaan", "Employers"), items: [tr("Executive search", "Executive search"), tr("Rekrutmen massal", "Volume hiring"), tr("Asesmen", "Assessment")] },
      { title: tr("Kandidat", "Candidates"), items: [tr("Lowongan", "Jobs"), tr("Kirim CV", "Send CV")] },
      { title: tr("Kantor", "Office"), items: ["Jl. Gatot Subroto Kav. 52", "+62 21 5200 8800"] },
    ],
    social: ["LinkedIn | https://linkedin.com/company/talentara", "Instagram | https://instagram.com/talentara"],
    copy: tr("© 2026 Talentara Partners. Konten contoh.", "© 2026 Talentara Partners. Sample content."),
  });

export const recruitmentTalenta: TemplateContent = {
  brand: "Talentara Partners",
  pages: [
    home(),
    pg("employers", ["untuk-perusahaan", "Untuk Perusahaan"], ["for-employers", "For Employers"]),
    pg("candidates", ["untuk-kandidat", "Untuk Kandidat"], ["for-candidates", "For Candidates"]),
    pg("jobs", ["lowongan", "Lowongan"], ["jobs", "Jobs"]),
    pg("industries", ["industri", "Industri"], ["industries", "Industries"]),
    pg("process", ["metode", "Metode"], ["method", "Method"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) =>
    render(TA, key, headerD("Talentara", TA, { variant: "bar", cta: [tr("Cari talenta", "Find talent"), href("contact")] }), taFoot(tr), {
      home: () => [
        heroBento(TA, {
          eyebrow: tr("Executive search", "Executive search"),
          title: tr("Orang yang tepat mengubah arah perusahaan", "The right person changes a company's course"),
          text: tr("Kami memetakan pasar talenta, mendekati kandidat pasif, dan menyerahkan shortlist dalam 21 hari.", "We map the talent market, approach passive candidates and deliver a shortlist in 21 days."),
          image: asset("v3d-briefcase"),
          alt: tr("Koper kerja dan profil kandidat", "Briefcase and candidate profile"),
          tiles: [["21 hari", tr("Shortlist rata-rata", "Average shortlist")], ["94%", tr("Bertahan > 1 tahun", "Stay > 1 year")], ["1.400+", tr("Posisi terisi", "Roles filled")]],
          actions: [[tr("Untuk perusahaan", "For employers"), href("employers")], [tr("Lihat lowongan", "See jobs"), href("jobs"), "outline"]],
        }),
        marqueeD(TA, { title: tr("Dipercaya oleh tim kepemimpinan di", "Trusted by leadership teams at"), items: ["Arunika Logistik", "Bank Desa Makmur", "Lintas Nusa Energi", "Kopi Tanah Air", "Medika Sentosa", "Rumah Belajar Cerdas"] }),
        withFx(TA, servicesSplit(pro(TA), tr, { eyebrow: tr("Layanan", "Services"), title: tr("Tiga cara kami membantu", "Three ways we help"), image: asset("v3d-briefcase"), imageAlt: tr("Rekrutmen", "Recruitment"), items: [{ icon: "01", title: "Executive search", text: tr("Direktur, VP, dan C-level.", "Directors, VPs and C-level.") }, { icon: "02", title: tr("Rekrutmen profesional", "Professional hiring"), text: tr("Manajer dan spesialis.", "Managers and specialists.") }, { icon: "03", title: tr("Asesmen kepemimpinan", "Leadership assessment"), text: tr("Psikometri dan wawancara berbasis kompetensi.", "Psychometrics and competency interviews.") }], cta: { label: tr("Diskusikan kebutuhan", "Discuss your needs"), href: href("contact") } })),
        counterD(TA, { inv: true, title: tr("Rekam jejak", "Track record"), items: [tr("1.400+ | Posisi terisi", "1,400+ | Roles filled"), tr("38.000 | Kandidat terpetakan", "38,000 | Candidates mapped"), tr("21 | Hari ke shortlist", "21 | Days to shortlist"), tr("94% | Retensi 1 tahun", "94% | 1-year retention")] }),
      ],
      employers: () => [
        pageHead(TA, { eyebrow: tr("Untuk perusahaan", "For employers"), title: tr("Rekrutmen yang bisa diukur", "Hiring you can measure"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Perusahaan", "Employers"), ""]] }),
        cardsD(TA, { title: tr("Model kerja sama", "Engagement models"), items: [{ icon: "◆", title: tr("Retained", "Retained"), text: tr("Untuk posisi C-level; biaya bertahap.", "For C-level roles; staged fees."), meta: tr("30% gaji tahunan", "30% of annual salary") }, { icon: "◇", title: tr("Kontingensi", "Contingency"), text: tr("Bayar hanya bila kandidat diterima.", "Pay only when someone is hired."), meta: tr("20% gaji tahunan", "20% of annual salary") }, { icon: "▣", title: tr("Proyek massal", "Volume project"), text: tr("10+ posisi untuk ekspansi.", "10+ roles for expansion."), meta: tr("Harga per proyek", "Per-project pricing") }] }),
        quotesD(TA, { title: tr("Kata klien", "Client words"), items: [{ quote: tr("Shortlist CFO kami datang dalam 18 hari, ketiganya layak.", "Our CFO shortlist came in 18 days, all three were strong."), author: "Ir. Bambang Hartono", role: tr("CEO, Lintas Nusa Energi", "CEO, Lintas Nusa Energi"), avatar: asset("v3d-face-5") }, { quote: tr("Mereka jujur saat kandidat favorit kami kurang cocok.", "They were honest when our favourite candidate wasn't a fit."), author: "Laksmi Widuri", role: tr("HR Director, Medika Sentosa", "HR Director, Medika Sentosa"), avatar: asset("v3d-face-6") }] }),
      ],
      candidates: () => [
        pageHead(TA, { eyebrow: tr("Untuk kandidat", "For candidates"), title: tr("Langkah karier berikutnya, dengan diskret", "Your next career move, discreetly") }),
        zigzag(TA, { title: tr("Bersama konsultan kami", "With our consultants"), steps: [[tr("Percakapan awal", "Intro conversation"), tr("30 menit membahas tujuan karier Anda.", "30 minutes on your career goals.")], [tr("Dicocokkan", "Matched"), tr("Kami hanya mengajukan Anda dengan izin.", "We only put you forward with consent.")], [tr("Dipersiapkan", "Prepared"), tr("Brief perusahaan dan latihan wawancara.", "Company brief and interview practice.")]] }),
        faqD(TA, { title: tr("Pertanyaan kandidat", "Candidate questions"), items: [[tr("Apakah gratis?", "Is it free?"), tr("Ya, kandidat tidak pernah membayar.", "Yes, candidates never pay.")], [tr("Data saya aman?", "Is my data safe?"), tr("CV tidak dibagikan tanpa persetujuan.", "CVs are never shared without consent.")], [tr("Berapa lama prosesnya?", "How long does it take?"), tr("3–8 minggu tergantung posisi.", "3–8 weeks depending on the role.")], [tr("Bisa untuk luar negeri?", "Overseas roles?"), tr("Ya, Asia Tenggara dan Australia.", "Yes, Southeast Asia and Australia.")]] }),
      ],
      jobs: () => [
        pageHead(TA, { eyebrow: tr("Lowongan", "Jobs"), title: tr("Posisi yang sedang kami cari", "Roles we're searching for") }),
        indexList(TA, { title: tr("Lowongan terbuka", "Open roles"), rows: [{ title: "Chief Financial Officer", meta: tr("Jakarta · Energi", "Jakarta · Energy"), tag: "C-level", href: href("contact"), cta: tr("Lamar", "Apply") }, { title: "Head of Supply Chain", meta: tr("Surabaya · Logistik", "Surabaya · Logistics"), tag: "Director", href: href("contact"), cta: tr("Lamar", "Apply") }, { title: "Product Manager, Payments", meta: tr("Jakarta · Fintech", "Jakarta · Fintech"), tag: tr("Hibrida", "Hybrid"), href: href("contact"), cta: tr("Lamar", "Apply") }, { title: "Plant Manager", meta: tr("Karawang · Manufaktur", "Karawang · Manufacturing"), tag: tr("Penuh waktu", "Full time"), href: href("contact"), cta: tr("Lamar", "Apply") }] }),
        newsletter(TA, { title: tr("Notifikasi lowongan", "Job alerts"), text: tr("Kami kirim posisi baru sesuai bidang Anda, maksimal 2 email sebulan.", "New roles in your field, max 2 emails a month."), ph: "email@contoh.com", submit: tr("Ikuti", "Subscribe") }),
      ],
      industries: () => [
        pageHead(TA, { eyebrow: tr("Industri", "Industries"), title: tr("Spesialis per sektor", "Sector specialists") }),
        bento(TA, { title: tr("Sektor fokus", "Focus sectors"), items: [{ title: tr("Energi & tambang", "Energy & mining"), text: tr("Transisi energi dan EBT.", "Energy transition and renewables."), icon: "⚡", wide: true, accent: true }, { title: tr("Keuangan & fintech", "Finance & fintech"), text: tr("Bank, asuransi, pembayaran.", "Banks, insurance, payments."), icon: "Rp" }, { title: tr("Kesehatan", "Healthcare"), text: tr("Rumah sakit dan farmasi.", "Hospitals and pharma."), icon: "✚" }, { title: tr("Manufaktur", "Manufacturing"), text: tr("Pabrik, rantai pasok, kualitas.", "Plants, supply chain, quality."), icon: "⚙", wide: true }] }),
        numbers(TA, { items: [["6", tr("Sektor", "Sectors")], ["18", tr("Konsultan senior", "Senior consultants")], ["9", tr("Negara", "Countries")]] }),
      ],
      process: () => [
        pageHead(TA, { eyebrow: tr("Metode", "Method"), title: tr("Pemetaan pasar sebelum iklan lowongan", "Market mapping before job ads") }),
        timelineD(TA, { title: tr("Alur 6 minggu", "A 6-week flow"), items: [[tr("Minggu 1", "Week 1"), tr("Brief & profil ideal", "Brief & ideal profile"), tr("Wawancara pemangku kepentingan.", "Stakeholder interviews.")], [tr("Minggu 2–3", "Week 2–3"), tr("Pemetaan & pendekatan", "Mapping & outreach"), tr("80–150 kandidat dipetakan.", "80–150 candidates mapped.")], [tr("Minggu 3", "Week 3"), "Shortlist", tr("3–5 kandidat dengan laporan.", "3–5 candidates with reports.")], [tr("Minggu 4–6", "Week 4–6"), tr("Wawancara & penawaran", "Interviews & offer"), tr("Kami dampingi negosiasi.", "We support negotiation.")]], side: { image: asset("v3d-briefcase"), alt: tr("Proses rekrutmen", "Recruitment process") } }),
      ],
      about: () => [
        pageHead(TA, { eyebrow: tr("Tentang", "About"), title: tr("Konsultan yang pernah duduk di kursi klien", "Consultants who've sat in the client's chair") }),
        withFx(TA, teamCards(pro(TA), tr, { title: tr("Partner kami", "Our partners"), members: [{ name: "Andini Larasati", role: "Managing Partner", photo: asset("v3d-face-4") }, { name: "Yosef Hutapea", role: tr("Partner, Energi", "Partner, Energy"), photo: asset("v3d-face-1") }, { name: "Mira Halim", role: tr("Partner, Keuangan", "Partner, Finance"), photo: asset("v3d-face-6") }, { name: "Gilang Ramadhan", role: tr("Partner, Teknologi", "Partner, Technology"), photo: asset("v3d-face-3") }] })),
        editorial(TA, { title: tr("Nilai kami", "Our values"), cols: [[tr("Diskret", "Discreet"), tr("Kerahasiaan kandidat dan klien.", "Confidentiality for candidates and clients.")], [tr("Berbasis data", "Data-led"), tr("Setiap rekomendasi disertai bukti.", "Every recommendation backed by evidence.")], [tr("Jangka panjang", "Long term"), tr("Garansi penggantian 6 bulan.", "6-month replacement guarantee.")]] }),
      ],
      contact: () => [
        pageHead(TA, { eyebrow: tr("Kontak", "Contact"), title: tr("Ceritakan posisi yang ingin diisi", "Tell us about the role") }),
        formD(TA, { title: tr("Permintaan rekrutmen", "Hiring request"), info: [[tr("Telepon", "Phone"), "+62 21 5200 8800"], ["Email", "partner@talentara.co.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("Perusahaan", "Company"), ph: "" }, { kind: "input", label: tr("Posisi", "Role"), ph: "" }, { kind: "select", label: tr("Level", "Level"), ph: tr("Pilih", "Choose"), options: ["C-level", "Director", "Manager", "Specialist"] }], message: tr("Catatan", "Notes"), submit: tr("Kirim", "Send") }),
        locations(TA, { title: tr("Kantor", "Offices"), image: asset("v3d-map"), places: [["Jakarta", "Jl. Gatot Subroto Kav. 52", tr("Sen–Jum", "Mon–Fri")], ["Surabaya", "Jl. Basuki Rahmat 7", tr("Sen–Jum", "Mon–Fri")]] }),
      ],
    }),
};
