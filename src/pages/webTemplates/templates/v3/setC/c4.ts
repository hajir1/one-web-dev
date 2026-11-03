import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import { portfolioMosaic, pricingCards, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import { compare, countdownBand, counter, progressBars, quotes, slider, typer } from "../../v2/setA/kitA";
import {
  banner,
  bento,
  cardsC,
  cta,
  faq,
  form,
  ftr,
  hdr,
  hero,
  home,
  infoTiles,
  journal,
  lightbox,
  lookC,
  marquee,
  modalOffer,
  newsletter,
  numbered,
  pageC,
  people,
  pg,
  priceLines,
  pull,
  split,
  steps,
  table,
  tabs,
  timelineC,
  words,
} from "./kitC";

/* ================================================================== */
/* Template v3 C16–C20: Ilustrator, Ramen, Psikolog, Tahfidz, AI Lab.  */
/* ================================================================== */

/* ---------- 16. Ilustrator (PREMIUM, 4 hlm) — retro oranye ---------- */

const PK: Palette = { ink: "#2b1406", muted: "#6b4a33", primary: "#ea580c", primaryDark: "#c2410c", soft: "#ffedd5", line: "#fdba74" };
const pk = lookC(PK, { head: "Syne", body: "Nunito", skin: "retro", radius: 18, bg: "#fff8f0", alt: "#ffeedd", dark: "#2b1406", fx: { animate: "rubberBand", tilt: { max: 15, glare: true } }, btnR: 999, accent2: "#7c3aed" });

const pkFoot = (tr: Tr) =>
  ftr(pk, "Pena Kelinci Studio", {
    kind: "minimal",
    about: "",
    cols: [{ title: "", items: [tr("Komisi dibuka Jan–Mar", "Commissions open Jan–Mar"), "halo@penakelinci.id", "Malang"] }],
    copy: tr("© 2026 Pena Kelinci Studio. Konten contoh.", "© 2026 Pena Kelinci Studio. Sample content."),
    social: ["Instagram | https://instagram.com/penakelinci", "Behance | https://behance.net/penakelinci", "Dribbble | https://dribbble.com/penakelinci"],
  });

export const portfolioIllustrator: TemplateContent = {
  brand: "Pena Kelinci Studio",
  pages: [home(), pg("work", ["karya", "Karya"], ["work", "Work"]), pg("commission", ["komisi", "Komisi"], ["commissions", "Commissions"]), pg("about", ["tentang", "Tentang"], ["about", "About"])],
  build: (key, tr, href) => {
    const head = hdr(pk, "Pena Kelinci", { kind: "pill", cta: [tr("Pesan komisi", "Commission"), href("commission")] });
    const end = pkFoot(tr);
    if (key === "work")
      return pageC(pk, [
        head,
        banner(pk, { kind: "band", eyebrow: tr("2019–2026", "2019–2026"), title: tr("Karya pilihan", "Selected work"), text: tr("Buku anak, kemasan, editorial, dan mural.", "Children's books, packaging, editorial and murals.") }),
        portfolioMosaic(pk, tr, { eyebrow: tr("Klien", "Clients"), title: tr("Proyek terbaru", "Recent projects"), works: [{ title: tr("Si Kancil Pulang", "Kancil Comes Home"), tag: tr("Buku anak", "Picture book"), image: asset("v3c-sketch") }, { title: "Teh Pucuk Gunung", tag: tr("Kemasan", "Packaging"), image: asset("v3c-bouquet-sun") }, { title: tr("Majalah Kota Pelan", "Slow City Magazine"), tag: "Editorial", image: asset("v3c-sketch") }, { title: tr("Mural SD Tunas", "Tunas School Mural"), tag: "Mural", image: asset("v3c-reef") }, { title: tr("Kartu Lebaran", "Eid cards"), tag: tr("Kartu", "Cards"), image: asset("v3c-pattern") }], cta: null }),
        lightbox(pk, { title: tr("Sketsa & proses", "Sketches & process"), images: [[asset("v3c-sketch"), tr("Sketsa pensil", "Pencil sketch")], [asset("v3c-sketch"), tr("Warna dasar", "Flat colours")], [asset("v3c-sketch"), tr("Final", "Final")], [asset("v3c-sketch"), tr("Cetak", "Print")]], cols: 4, ratio: "3 / 4" }),
        end,
      ]);
    if (key === "commission")
      return pageC(pk, [
        head,
        priceLines(pk, { eyebrow: tr("Komisi", "Commissions"), title: tr("Harga mulai", "Starting prices"), groups: [{ title: tr("Personal", "Personal"), items: [[tr("Potret keluarga", "Family portrait"), tr("Digital, A4, 2 revisi", "Digital, A4, 2 revisions"), "Rp850.000"], [tr("Ilustrasi hewan peliharaan", "Pet portrait"), tr("Digital, latar sederhana", "Digital, simple background"), "Rp550.000"]] }, { title: tr("Bisnis", "Business"), items: [[tr("Kemasan produk", "Product packaging"), tr("Hak pakai 3 tahun", "3-year licence"), "Rp6.500.000"], [tr("Ilustrasi editorial", "Editorial illustration"), tr("Per gambar", "Per image"), "Rp2.200.000"]] }], note: tr("Uang muka 50%. Pengerjaan 2–6 minggu.", "50% deposit. 2–6 weeks turnaround.") }),
        steps(pk, { title: tr("Alur komisi", "How it works"), items: [[tr("Brief", "Brief"), tr("Isi formulir & kirim referensi.", "Fill the form & send references.")], [tr("Sketsa", "Sketch"), tr("2 opsi sketsa dalam 5 hari.", "2 sketch options within 5 days.")], [tr("Warna", "Colour"), tr("Revisi warna 2x.", "2 colour revisions.")], [tr("Final", "Final"), tr("File 300 dpi + PNG transparan.", "300 dpi files + transparent PNG.")]] }),
        form(pk, { title: tr("Mulai komisi", "Start a commission"), info: [["Email", "halo@penakelinci.id"], [tr("Antrean", "Queue"), tr("4 slot tersisa bulan ini", "4 slots left this month")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "select", label: tr("Jenis", "Type"), ph: tr("Pilih", "Choose"), options: [tr("Personal", "Personal"), tr("Kemasan", "Packaging"), "Editorial", tr("Buku", "Book")] }, { kind: "date", label: tr("Tenggat", "Deadline") }], message: tr("Ceritakan idemu", "Describe your idea"), submit: tr("Kirim brief", "Send brief") }),
        end,
      ]);
    if (key === "about")
      return pageC(pk, [
        head,
        split(pk, { eyebrow: tr("Halo!", "Hello!"), title: tr("Saya Kinanti, ilustrator yang suka kelinci", "I'm Kinanti, an illustrator who loves rabbits"), paras: [tr("Lulusan DKV yang bekerja dari studio kecil di Malang. Gaya saya hangat, bertekstur, dan penuh warna jingga.", "A design graduate working from a small Malang studio. My style is warm, textured and full of orange.")], bullets: ["Procreate", "Gouache", tr("Cetak risograf", "Risograph printing")], image: asset("v3c-face-4"), alt: "Kinanti", tone: "soft" }),
        timelineC(pk, { title: tr("Perjalanan", "Journey"), items: [tr("2019 | Buku anak pertama | Diterbitkan Penerbit Daun Lontar.", "2019 | First picture book | Published by Daun Lontar."), tr("2022 | Pameran tunggal | Galeri Kota Lama, Malang.", "2022 | Solo show | Kota Lama Gallery, Malang."), tr("2026 | Studio Pena Kelinci | Bersama 2 asisten.", "2026 | Pena Kelinci Studio | With 2 assistants.")] }),
        end,
      ]);
    return pageC(pk, [
      head,
      hero(pk, { kind: "collage", eyebrow: tr("Ilustrator · Malang", "Illustrator · Malang"), titleNode: typer(pk, tr("Saya menggambar", "I draw"), [tr("buku anak", "picture books"), tr("kemasan", "packaging"), "mural", tr("kartu ucapan", "greeting cards")], { size: 52, word: pk.p.primary }), title: "Pena Kelinci", text: tr("Ilustrasi hangat penuh tekstur untuk penerbit, brand lokal, dan kamu yang ingin hadiah unik.", "Warm, textured illustration for publishers, local brands and anyone wanting a unique gift."), acts: [[tr("Lihat karya", "See work"), href("work")], [tr("Pesan komisi", "Commission me"), href("commission"), "outline"]], images: [asset("v3c-sketch"), asset("v3c-bouquet-sun"), asset("v3c-reef")], alt: tr("Ilustrasi", "Illustrations") }),
      words(pk, [tr("Buku", "Books"), tr("Kemasan", "Packaging"), "Mural", "Editorial"], { bg: pk.p.line }),
      lightbox(pk, { title: tr("Karya favorit", "Favourite pieces"), images: [[asset("v3c-sketch"), tr("Si Kancil Pulang", "Kancil Comes Home")], [asset("v3c-reef"), tr("Mural laut", "Sea mural")], [asset("v3c-bouquet-sun"), tr("Kemasan teh", "Tea packaging")]], cols: 3, ratio: "1 / 1" }),
      cta(pk, { kind: "sticker", title: tr("4 slot komisi tersisa", "4 commission slots left"), acts: [[tr("Pesan sekarang", "Book now"), href("commission")]] }),
      end,
    ]);
  },
};

/* ------------ 17. Ramen (PREMIUM, 6 hlm) — gelap merah izakaya ------- */

const RK: Palette = { ink: "#fef2f2", muted: "#d6b8b0", primary: "#dc2626", primaryDark: "#b91c1c", soft: "#fee2e2", line: "#fca5a5" };
const rk = lookC(RK, { head: "Oswald", body: "Work Sans", skin: "line", radius: 6, bg: "#160d0b", alt: "#231412", dark: "#0c0706", fx: { aos: "fade-down", animate: "fadeInLeft" }, btnR: 4, caps: true, onDark: "#d6b8b0", accent2: "#f59e0b" });

const rkFoot = (tr: Tr) =>
  ftr(rk, "Kedai Ramen Kumo", {
    kind: "columns",
    about: tr("Ramen kaldu tulang 18 jam & izakaya kecil di Senopati. Halal, tanpa babi dan mirin.", "18-hour bone broth ramen & a small izakaya in Senopati. Halal, no pork, no mirin."),
    cols: [{ title: tr("Jam", "Hours"), items: [tr("Sen–Kam 11.00–22.00", "Mon–Thu 11am–10pm"), tr("Jum–Min 11.00–24.00", "Fri–Sun 11am–midnight")] }, { title: tr("Kontak", "Contact"), items: ["Jl. Suryo 21, Jakarta", "+62 21 7270 9911"] }],
    copy: tr("© 2026 Kedai Ramen Kumo. Konten contoh.", "© 2026 Kedai Ramen Kumo. Sample content."),
    social: ["Instagram | https://instagram.com/ramenkumo", "TikTok | https://tiktok.com/@ramenkumo"],
  });

export const restaurantRamen: TemplateContent = {
  brand: "Kedai Ramen Kumo",
  pages: [
    home(),
    pg("menu", ["menu", "Menu"], ["menu", "Menu"]),
    pg("izakaya", ["izakaya", "Izakaya Malam"], ["izakaya", "Night Izakaya"]),
    pg("broth", ["kaldu", "Kaldu Kami"], ["our-broth", "Our Broth"]),
    pg("reserve", ["reservasi", "Reservasi"], ["reservations", "Reservations"]),
    pg("visit", ["lokasi", "Lokasi"], ["location", "Location"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(rk, "Ramen Kumo", { kind: "dark", cta: [tr("Reservasi", "Reserve"), href("reserve")], strip: tr("Kaldu habis = kedai tutup. Datang lebih awal.", "When the broth runs out, we close. Come early.") });
    const end = rkFoot(tr);
    if (key === "menu")
      return pageC(rk, [
        head,
        banner(rk, { kind: "band", eyebrow: "Menu", title: tr("Ramen, nasi, dan teman makan", "Ramen, rice and sides") }),
        priceLines(rk, { title: tr("Mangkuk utama", "Main bowls"), groups: [{ title: "Ramen", items: [["Tori Paitan", tr("Kaldu ayam kental, chashu ayam", "Creamy chicken broth, chicken chashu"), "Rp68.000"], ["Gyu Shoyu", tr("Kaldu sapi kecap asin, daging iris", "Beef shoyu broth, sliced beef"), "Rp78.000"], ["Kumo Pedas", tr("Minyak cabai rawit, level 1–5", "Bird's-eye chilli oil, level 1–5"), "Rp72.000"]] }, { title: tr("Pendamping", "Sides"), items: [["Gyoza", tr("5 pcs ayam", "5 chicken pieces"), "Rp35.000"], ["Karaage", tr("Ayam goreng jahe", "Ginger fried chicken"), "Rp42.000"], ["Ajitama", tr("Telur rendam 24 jam", "24-hour marinated egg"), "Rp12.000"]] }], note: tr("Semua bahan halal. Tambah mi Rp15.000.", "All ingredients halal. Extra noodles Rp15,000.") }),
        tabs(rk, { title: tr("Pilih tingkat", "Choose your level"), tabs: [[tr("Kekentalan", "Richness"), tr("Ringan · Normal · Kental", "Light · Normal · Rich")], [tr("Kematangan mi", "Noodle firmness"), tr("Keras · Normal · Lembut", "Firm · Normal · Soft")], [tr("Pedas", "Spice"), tr("Level 1 sampai 5", "Level 1 to 5")]] }),
        end,
      ]);
    if (key === "izakaya")
      return pageC(rk, [
        head,
        hero(rk, { kind: "oversized", eyebrow: tr("Jum–Min 19.00", "Fri–Sun 7pm"), title: tr("Izakaya setelah ramen terakhir", "Izakaya after the last bowl"), text: tr("Tusukan arang, teh dingin, dan musik city pop sampai tengah malam.", "Charcoal skewers, cold tea and city pop until midnight."), image: asset("v3c-ramen"), alt: "Izakaya" }),
        cardsC(rk, { title: tr("Menu malam", "Night menu"), items: [{ title: "Yakitori", text: tr("Paha ayam & daun bawang di atas arang.", "Chicken thigh & leek over charcoal."), meta: "Rp18.000/tusuk" }, { title: "Tsukune", text: tr("Bakso ayam saus tare.", "Chicken meatballs with tare."), meta: "Rp22.000" }, { title: tr("Teh barley dingin", "Cold barley tea"), text: tr("Isi ulang gratis.", "Free refills."), meta: "Rp15.000" }] }),
        end,
      ]);
    if (key === "broth")
      return pageC(rk, [
        head,
        split(rk, { eyebrow: tr("18 jam", "18 hours"), title: tr("Kaldu dimulai pukul 17.00 kemarin", "The broth started at 5pm yesterday"), paras: [tr("Tulang ayam dan sapi direbus api besar agar kolagen pecah dan kaldu menjadi putih susu.", "Chicken and beef bones boil hard so the collagen breaks down into a milky broth.")], bullets: [tr("Tanpa MSG tambahan", "No added MSG"), tr("Mi dibuat sendiri tiap pagi", "Noodles made every morning"), tr("Sertifikat halal", "Halal certified")], image: asset("v3c-ramen"), alt: tr("Mangkuk ramen", "Ramen bowl"), tone: "primary" }),
        counter(rk, { title: tr("Setiap hari", "Every day"), items: ["18 | " + tr("Jam merebus", "Hours simmering"), "320 | " + tr("Mangkuk", "Bowls"), "40 kg | " + tr("Tulang", "Bones"), "0 | " + tr("Babi & mirin", "Pork & mirin")], dark: true }),
        end,
      ]);
    if (key === "reserve")
      return pageC(rk, [
        head,
        form(rk, { eyebrow: tr("Reservasi", "Reservations"), title: tr("Pesan meja izakaya", "Book an izakaya table"), text: tr("Siang hari tanpa reservasi; malam hari disarankan pesan.", "No bookings at lunch; recommended for evenings."), info: [["WhatsApp", "+62 21 7270 9911"], [tr("Meja", "Tables"), tr("2–8 orang", "2–8 people")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" }, { kind: "select", label: tr("Jumlah", "Party size"), ph: tr("Pilih", "Choose"), options: ["2", "3–4", "5–8"] }], submit: tr("Reservasi", "Reserve") }),
        testimonialsWall(rk, tr, { title: tr("Kata pelanggan", "What diners say"), score: 4.8, caption: tr("dari 3.100 ulasan", "from 3,100 reviews"), dark: true, quotes: [{ text: tr("Tori paitan terbaik yang pernah saya coba di Jakarta.", "The best tori paitan I've had in Jakarta."), name: "Andre W.", role: tr("Pelanggan", "Diner"), avatar: asset("v3c-face-3") }, { text: tr("Izakaya-nya hangat, cocok untuk ngobrol lama.", "The izakaya is cosy, perfect for long chats."), name: "Nisa P.", role: tr("Pelanggan", "Diner"), avatar: asset("v3c-face-2") }, { text: tr("Akhirnya ramen halal yang kaldunya serius.", "Finally a halal ramen with serious broth."), name: "Fajar H.", role: tr("Pelanggan", "Diner"), avatar: asset("v3c-face-1") }] }),
        end,
      ]);
    if (key === "visit")
      return pageC(rk, [
        head,
        infoTiles(rk, [[tr("Alamat", "Address"), "Jl. Suryo 21, Senopati"], [tr("Parkir", "Parking"), tr("Valet Rp20rb", "Valet Rp20k")], ["MRT", tr("Stasiun Senayan, 8 menit", "Senayan station, 8 min")]]),
        faq(rk, { title: tr("Sebelum datang", "Before you come"), items: [[tr("Ada ramen vegetarian?", "Vegetarian ramen?"), tr("Ada, kaldu jamur shiitake setiap Rabu.", "Yes, shiitake broth every Wednesday.")], [tr("Ramah anak?", "Kid friendly?"), tr("Ada kursi anak dan porsi kecil.", "High chairs and kids' portions.")]] }),
        end,
      ]);
    return pageC(rk, [
      head,
      hero(rk, { kind: "split", eyebrow: tr("Senopati · halal", "Senopati · halal"), title: tr("Kaldu 18 jam dalam satu mangkuk", "18 hours of broth in one bowl"), text: tr("Ramen kaldu tulang kental, mi buatan sendiri, dan izakaya kecil di akhir pekan.", "Rich bone-broth ramen, house-made noodles and a small weekend izakaya."), acts: [[tr("Lihat menu", "See the menu"), href("menu"), "light"], [tr("Reservasi", "Reserve"), href("reserve"), "outline"]], image: asset("v3c-ramen"), alt: tr("Ramen", "Ramen") }),
      slider(rk, { slides: [{ title: "Tori Paitan", text: tr("Terlaris sejak hari pertama", "Best seller since day one"), bg: rk.p.primaryDark }, { title: "Kumo Pedas", text: tr("Level 5 untuk pemberani", "Level 5 for the brave"), bg: "#7c2d12" }, { title: tr("Izakaya Jumat", "Friday izakaya"), text: tr("Yakitori arang 19.00", "Charcoal yakitori 7pm"), bg: rk.dark }], height: 300, bg: rk.bg }),
      numbered(rk, { title: tr("Cara menikmati", "How to enjoy it"), items: [[tr("Hirup kaldunya", "Sip the broth"), tr("Sendok pertama tanpa campuran.", "First spoonful, nothing added.")], [tr("Seruput mi", "Slurp the noodles"), tr("Bunyi seruput itu pujian.", "Slurping is a compliment.")], [tr("Tambah telur", "Add an egg"), tr("Ajitama 24 jam.", "24-hour ajitama.")]] }),
      cta(rk, { kind: "giant", title: tr("Kaldu hari ini masih ada", "Today's broth is still on"), acts: [[tr("Lokasi", "Location"), href("visit"), "light"]], bg: rk.p.primaryDark }),
      end,
    ]);
  },
};

/* ------------ 18. Psikolog (PREMIUM, 5 hlm) — pastel teduh ----------- */

const RT: Palette = { ink: "#123b36", muted: "#4f6f69", primary: "#0d9488", primaryDark: "#0f766e", soft: "#ccfbf1", line: "#99f6e4" };
const rt = lookC(RT, { head: "Lora", body: "Nunito", skin: "soft", radius: 26, bg: "#f8fbf9", alt: "#eef6f2", dark: "#123b36", fx: { aos: "fade" }, btnR: 999, onDark: "#a7d3cb", accent2: "#84cc16" });

const rtFoot = (tr: Tr) =>
  ftr(rt, "Ruang Teduh Psikologi", {
    kind: "card",
    about: tr("Layanan psikologi klinis & konseling untuk remaja, dewasa, dan pasangan. Tatap muka di Semarang atau daring.", "Clinical psychology & counselling for teens, adults and couples. In person in Semarang or online."),
    cols: [{ title: tr("Jam layanan", "Hours"), items: [tr("Sen–Sab 09.00–20.00", "Mon–Sat 9am–8pm")] }, { title: tr("Darurat", "Crisis"), items: [tr("Hubungi 119 ext 8", "Call 119 ext 8")] }],
    copy: tr("© 2026 Ruang Teduh Psikologi. Konten contoh, bukan pengganti layanan darurat.", "© 2026 Ruang Teduh Psikologi. Sample content, not a crisis service."),
  });

export const healthPsikolog: TemplateContent = {
  brand: "Ruang Teduh Psikologi",
  pages: [home(), pg("services", ["layanan", "Layanan"], ["services", "Services"]), pg("team", ["psikolog", "Psikolog"], ["psychologists", "Psychologists"]), pg("resources", ["artikel", "Artikel"], ["resources", "Resources"]), pg("book", ["jadwal", "Buat Jadwal"], ["book", "Book a Session"])],
  build: (key, tr, href) => {
    const head = hdr(rt, "Ruang Teduh", { kind: "pill", cta: [tr("Buat jadwal", "Book a session"), href("book")] });
    const end = rtFoot(tr);
    if (key === "services")
      return pageC(rt, [
        head,
        banner(rt, { kind: "center", eyebrow: tr("Layanan", "Services"), title: tr("Pendampingan yang pelan dan aman", "Unhurried, safe support"), text: tr("Sesi 60 menit, kerahasiaan dijaga sesuai kode etik HIMPSI.", "60-minute sessions, confidentiality kept under professional ethics.") }),
        cardsC(rt, { title: tr("Jenis sesi", "Session types"), cols: 2, items: [{ icon: "I", title: tr("Konseling individu", "Individual counselling"), text: tr("Kecemasan, stres kerja, duka, transisi hidup.", "Anxiety, work stress, grief, life transitions."), meta: "Rp350.000 / 60 mnt" }, { icon: "P", title: tr("Konseling pasangan", "Couples counselling"), text: tr("Komunikasi, konflik, pranikah.", "Communication, conflict, pre-marital."), meta: "Rp500.000 / 75 mnt" }, { icon: "R", title: tr("Remaja", "Teens"), text: tr("Usia 13–18, dengan sesi orang tua.", "Ages 13–18, with a parent session."), meta: "Rp350.000 / 60 mnt" }, { icon: "A", title: tr("Asesmen psikologis", "Psychological assessment"), text: tr("Minat bakat & tes klinis.", "Aptitude & clinical tests."), meta: tr("mulai Rp750.000", "from Rp750,000") }] }),
        modalOffer(rt, { title: tr("Belum yakin butuh konseling?", "Not sure you need counselling?"), text: tr("Coba cek diri singkat 5 pertanyaan.", "Try a short 5-question self-check."), trigger: tr("Mulai cek diri", "Start self-check"), modalTitle: tr("Cek diri singkat", "Quick self-check"), body: tr("Dua minggu terakhir, apakah Anda sering merasa lelah tanpa sebab, sulit tidur, atau kehilangan minat? Jika ya untuk dua atau lebih, sesi perkenalan 20 menit bisa membantu.", "In the last two weeks, have you often felt tired for no reason, slept badly or lost interest? If yes to two or more, a 20-minute intro session can help."), cta: [tr("Buat jadwal perkenalan", "Book an intro session"), href("book")] }),
        end,
      ]);
    if (key === "team")
      return pageC(rt, [
        head,
        teamCards(rt, tr, { eyebrow: tr("Tim", "Team"), title: tr("Psikolog berlisensi", "Licensed psychologists"), members: [{ name: "Anindya Prameswari, M.Psi.", role: tr("Psikolog klinis dewasa", "Adult clinical psychologist"), photo: asset("v3c-face-2"), links: [{ label: tr("Jadwal", "Schedule"), href: href("book") }] }, { name: "Galih Pranata, M.Psi.", role: tr("Psikolog pasangan", "Couples psychologist"), photo: asset("v3c-face-1"), links: [{ label: tr("Jadwal", "Schedule"), href: href("book") }] }, { name: "Sarah Hutapea, M.Psi.", role: tr("Psikolog remaja", "Teen psychologist"), photo: asset("v3c-face-4"), links: [{ label: tr("Jadwal", "Schedule"), href: href("book") }] }] }),
        pull(rt, { text: tr("Tidak ada masalah yang terlalu kecil untuk dibicarakan.", "No problem is too small to talk about."), name: "Anindya Prameswari", role: tr("Pendiri", "Founder"), bg: rt.alt }),
        end,
      ]);
    if (key === "resources")
      return pageC(rt, [
        head,
        journal(rt, { eyebrow: tr("Artikel", "Articles"), title: tr("Bacaan untuk hari yang berat", "Reading for heavy days"), read: tr("Baca", "Read"), href: href("resources"), items: [{ image: asset("v3c-calm"), tag: tr("Kecemasan", "Anxiety"), date: "Nov 2026", title: tr("Teknik napas 4-7-8", "The 4-7-8 breathing technique"), text: tr("Latihan 2 menit sebelum rapat.", "A 2-minute exercise before meetings.") }, { image: asset("v3c-calm"), tag: tr("Relasi", "Relationships"), date: "Okt 2026", title: tr("Bertengkar dengan sehat", "Fighting fair"), text: tr("Empat aturan untuk pasangan.", "Four rules for couples.") }, { image: asset("v3c-calm"), tag: tr("Remaja", "Teens"), date: "Sep 2026", title: tr("Saat anak menutup diri", "When teens withdraw"), text: tr("Tanda dan cara membuka obrolan.", "Signs and how to start talking.") }] }),
        newsletter(rt, { title: tr("Surat teduh bulanan", "Monthly calm letter"), text: tr("Satu latihan sederhana setiap bulan.", "One simple exercise a month."), ph: "email@contoh.id", submit: tr("Berlangganan", "Subscribe") }),
        end,
      ]);
    if (key === "book")
      return pageC(rt, [
        head,
        form(rt, { eyebrow: tr("Rahasia terjaga", "Confidential"), title: tr("Buat jadwal sesi", "Book a session"), text: tr("Admin akan mengonfirmasi lewat WhatsApp dalam 2 jam kerja.", "Our admin confirms via WhatsApp within 2 working hours."), info: [["WhatsApp", "+62 24 8600 4422"], [tr("Daring", "Online"), "Video call"]], fields: [{ kind: "input", label: tr("Nama panggilan", "Preferred name"), ph: tr("Boleh nama samaran", "A nickname is fine") }, { kind: "select", label: tr("Layanan", "Service"), ph: tr("Pilih", "Choose"), options: [tr("Individu", "Individual"), tr("Pasangan", "Couples"), tr("Remaja", "Teen"), tr("Asesmen", "Assessment")] }, { kind: "select", label: tr("Format", "Format"), ph: tr("Pilih", "Choose"), options: [tr("Tatap muka", "In person"), tr("Daring", "Online")] }, { kind: "date", label: tr("Tanggal pilihan", "Preferred date") }], submit: tr("Kirim permintaan", "Send request") }),
        faq(rt, { title: tr("Pertanyaan umum", "Common questions"), items: [[tr("Apakah rahasia?", "Is it confidential?"), tr("Ya, kecuali ada risiko keselamatan.", "Yes, unless there is a safety risk.")], [tr("Berapa sesi dibutuhkan?", "How many sessions?"), tr("Rata-rata 4–8 sesi.", "Typically 4–8 sessions.")], [tr("Bisa pakai asuransi?", "Insurance?"), tr("Beberapa asuransi swasta, tanyakan admin.", "Some private insurers; ask our admin.")]] }),
        end,
      ]);
    return pageC(rt, [
      head,
      hero(rt, { kind: "minimal", eyebrow: tr("Psikologi klinis · Semarang & daring", "Clinical psychology · Semarang & online"), title: tr("Tempat aman untuk bercerita pelan-pelan", "A safe place to talk, at your pace"), text: tr("Konseling individu, pasangan, dan remaja bersama psikolog berlisensi. Tanpa menghakimi, tanpa terburu-buru.", "Individual, couples and teen counselling with licensed psychologists. No judgement, no rush."), acts: [[tr("Buat jadwal", "Book a session"), href("book")], [tr("Lihat layanan", "See services"), href("services"), "outline"]], image: asset("v3c-calm"), alt: tr("Ruang konseling", "Counselling room") }),
      steps(rt, { title: tr("Langkah pertama", "First steps"), items: [[tr("Isi formulir", "Fill the form"), tr("Cukup nama panggilan.", "A nickname is enough.")], [tr("Sesi perkenalan", "Intro session"), tr("20 menit, gratis.", "20 minutes, free.")], [tr("Rencana bersama", "Plan together"), tr("Tujuan dan jumlah sesi.", "Goals and number of sessions.")]] }),
      teamCards(rt, tr, { title: tr("Psikolog kami", "Our psychologists"), members: [{ name: "Anindya P.", role: tr("Dewasa", "Adults"), photo: asset("v3c-face-2") }, { name: "Galih P.", role: tr("Pasangan", "Couples"), photo: asset("v3c-face-1") }, { name: "Sarah H.", role: tr("Remaja", "Teens"), photo: asset("v3c-face-4") }] }),
      cta(rt, { kind: "sticker", title: tr("Hari ini cukup berat?", "Is today heavy?"), text: tr("Sesi perkenalan 20 menit gratis.", "Free 20-minute intro session."), acts: [[tr("Buat jadwal", "Book a session"), href("book")]] }),
      end,
    ]);
  },
};

/* ---------- 19. Rumah Tahfidz (PREMIUM, 7 hlm) — bento hijau ---------- */

const MH: Palette = { ink: "#052e16", muted: "#3f6248", primary: "#15803d", primaryDark: "#166534", soft: "#dcfce7", line: "#bbf7d0" };
const mh = lookC(MH, { head: "Libre Baskerville", body: "Plus Jakarta Sans", skin: "bento", radius: 22, bg: "#ffffff", alt: "#f1f8f2", dark: "#052e16", fx: { aos: "zoom-in", animate: "fadeInDown" }, btnR: 12, onDark: "#a7d7b5", accent2: "#ca8a04" });

const mhFoot = (tr: Tr) =>
  ftr(mh, "Rumah Tahfidz Mutiara Hafazah", {
    kind: "columns",
    about: tr("Program tahfidz untuk anak usia 7–15 tahun dengan metode talaqqi dan murajaah harian. Depok, Jawa Barat.", "A Quran memorisation program for ages 7–15 with talaqqi and daily review. Depok, West Java."),
    cols: [{ title: tr("Program", "Programs"), items: [tr("Tahfidz reguler", "Regular tahfidz"), tr("Mukim (asrama)", "Boarding"), tr("Kelas dewasa", "Adult classes")] }, { title: tr("Kontak", "Contact"), items: ["+62 812 9100 3030", "Jl. Raya Sawangan 45"] }],
    copy: tr("© 2026 Rumah Tahfidz Mutiara Hafazah. Konten contoh.", "© 2026 Rumah Tahfidz Mutiara Hafazah. Sample content."),
    social: ["YouTube | https://youtube.com/@mutiarahafazah", "Instagram | https://instagram.com/mutiarahafazah"],
  });

export const educationTahfidz: TemplateContent = {
  brand: "Rumah Tahfidz Mutiara Hafazah",
  pages: [
    home(),
    pg("programs", ["program", "Program"], ["programs", "Programs"]),
    pg("method", ["metode", "Metode"], ["method", "Method"]),
    pg("teachers", ["asatidz", "Asatidz"], ["teachers", "Teachers"]),
    pg("admission", ["pendaftaran", "Pendaftaran"], ["admission", "Admission"]),
    pg("waqf", ["wakaf", "Wakaf"], ["endowment", "Endowment"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(mh, "Mutiara Hafazah", { kind: "split", cta: [tr("Daftar santri", "Enrol"), href("admission")] });
    const end = mhFoot(tr);
    if (key === "programs")
      return pageC(mh, [
        head,
        banner(mh, { kind: "image", eyebrow: tr("Program", "Programs"), title: tr("Pilih jalur hafalan", "Choose a memorisation path"), text: tr("Kelas kecil 8 santri per musyrif.", "Small classes of 8 students per teacher."), image: asset("v3c-quran"), alt: tr("Mushaf", "Quran") }),
        pricingCards(mh, tr, { eyebrow: tr("Biaya per bulan", "Monthly fees"), title: tr("Program santri", "Student programs"), plans: [{ name: tr("Reguler sore", "Afternoon"), price: "Rp450rb", period: tr("/bulan", "/month"), text: tr("Sen–Jum 15.30–17.30", "Mon–Fri 3:30–5:30pm"), features: [tr("Target 2 juz/tahun", "Target 2 juz/year"), tr("Laporan mingguan", "Weekly reports")], cta: { label: tr("Daftar", "Enrol"), href: href("admission") } }, { name: tr("Mukim", "Boarding"), price: "Rp2,4jt", period: tr("/bulan", "/month"), text: tr("Asrama & makan 3x", "Boarding & 3 meals"), features: [tr("Target 5 juz/tahun", "Target 5 juz/year"), tr("Sekolah formal mitra", "Partner formal school"), tr("Murajaah malam", "Night review")], cta: { label: tr("Daftar", "Enrol"), href: href("admission") }, featured: true }, { name: tr("Dewasa", "Adults"), price: "Rp250rb", period: tr("/bulan", "/month"), text: tr("Sabtu–Ahad pagi", "Weekend mornings"), features: [tr("Tahsin + hafalan", "Recitation + memorisation"), tr("Kelas terpisah", "Separate classes")], cta: { label: tr("Daftar", "Enrol"), href: href("admission") } }] }),
        end,
      ]);
    if (key === "method")
      return pageC(mh, [
        head,
        numbered(mh, { eyebrow: tr("Metode", "Method"), title: tr("Talaqqi, ziyadah, murajaah", "Talaqqi, new lessons, review"), items: [[tr("Talaqqi", "Talaqqi"), tr("Santri mendengar & menirukan bacaan musyrif.", "Students listen to and repeat the teacher.")], [tr("Ziyadah", "New lessons"), tr("Setengah halaman baru setiap hari.", "Half a new page every day.")], [tr("Murajaah", "Review"), tr("Mengulang 5 halaman lama setiap hari.", "Reviewing 5 old pages daily.")], [tr("Tasmi'", "Recital"), tr("Ujian per juz di depan penguji.", "A per-juz exam before examiners.")]] }),
        progressBars(mh, { title: tr("Rata-rata capaian santri", "Average student progress"), bars: [[tr("Kelancaran bacaan", "Fluency"), 92], [tr("Ketepatan tajwid", "Tajwid accuracy"), 87], [tr("Target juz tahunan", "Yearly juz target"), 78]], side: { image: asset("v3c-quran"), alt: tr("Rehal", "Quran stand") } }),
        end,
      ]);
    if (key === "teachers")
      return pageC(mh, [
        head,
        people(mh, { eyebrow: "Asatidz", title: tr("Musyrif bersanad", "Certified teachers"), items: [{ name: "Ust. Ahmad Fauzan", role: tr("Kepala tahfidz", "Head of tahfidz"), photo: asset("v3c-face-1"), text: tr("Hafiz 30 juz, sanad Riwayat Hafs.", "Memorised 30 juz, Hafs chain.") }, { name: "Ustzh. Hanifah Zahra", role: tr("Musyrifah putri", "Girls' teacher"), photo: asset("v3c-face-2"), text: tr("Pengajar tahsin 9 tahun.", "Recitation teacher for 9 years.") }, { name: "Ust. Ilham Syahputra", role: tr("Pembina asrama", "Boarding supervisor"), photo: asset("v3c-face-3"), text: tr("Alumni pesantren di Kediri.", "Alumnus of a Kediri boarding school.") }] }),
        quotes(mh, { title: tr("Kata wali santri", "From parents"), items: [{ quote: tr("Anak saya hafal 3 juz dalam setahun dan jadi lebih disiplin.", "My son memorised 3 juz in a year and became more disciplined."), author: "Ibu Rahmawati", role: tr("Wali santri", "Parent"), avatar: asset("v3c-face-4") }, { quote: tr("Laporan mingguan sangat membantu kami di rumah.", "Weekly reports help us a lot at home."), author: "Bapak Yusuf", role: tr("Wali santri", "Parent"), avatar: asset("v3c-face-1") }] }),
        end,
      ]);
    if (key === "admission")
      return pageC(mh, [
        head,
        countdownBand(mh, { eyebrow: tr("Tahun ajaran 2027/2028", "2027/2028 intake"), title: tr("Gelombang 1 ditutup dalam", "Wave 1 closes in"), text: tr("Kuota 40 santri baru, tes baca 15 menit.", "40 new places, a 15-minute reading test."), target: "2027-01-31T17:00", finished: tr("Gelombang 1 ditutup.", "Wave 1 closed."), actions: [[tr("Isi formulir", "Fill in the form"), href("contact"), "light"]] }),
        steps(mh, { title: tr("Alur pendaftaran", "Admission steps"), items: [[tr("Isi formulir", "Fill the form"), tr("Data santri & wali.", "Student & parent details.")], [tr("Tes baca", "Reading test"), tr("15 menit bersama musyrif.", "15 minutes with a teacher.")], [tr("Wawancara", "Interview"), tr("Bersama orang tua.", "With parents.")], [tr("Pengumuman", "Results"), tr("Maks. 7 hari.", "Within 7 days.")]] }),
        faq(mh, { title: tr("Syarat", "Requirements"), items: [[tr("Usia berapa?", "What age?"), tr("7–15 tahun.", "7–15 years old.")], [tr("Harus sudah lancar membaca?", "Must they read fluently?"), tr("Minimal sudah selesai Iqra'.", "At least finished the basic reader.")]] }),
        end,
      ]);
    if (key === "waqf")
      return pageC(mh, [
        head,
        hero(mh, { kind: "poster", meta: [tr("Wakaf", "Endowment"), "2026"], title: tr("Wakaf gedung asrama putri", "Endow the girls' dormitory"), text: tr("Asrama 3 lantai untuk 60 santriwati. Setiap Rp100 ribu menjadi satu bata.", "A 3-storey dormitory for 60 girls. Every Rp100k becomes one brick."), acts: [[tr("Konfirmasi wakaf", "Confirm a gift"), href("contact")]], image: asset("v3c-quran"), alt: tr("Wakaf", "Endowment") }),
        progressBars(mh, { title: tr("Progres pembangunan", "Construction progress"), bars: [[tr("Dana terkumpul", "Funds raised"), 64], [tr("Fondasi", "Foundation"), 100], [tr("Lantai 2", "Second floor"), 35]] }),
        counter(mh, { items: ["1.840 | " + tr("Pewakaf", "Donors"), "Rp1,9 M | " + tr("Terkumpul", "Raised"), "60 | " + tr("Santriwati", "Girls"), "3 | " + tr("Lantai", "Floors")] }),
        end,
      ]);
    if (key === "contact")
      return pageC(mh, [
        head,
        form(mh, { title: tr("Hubungi sekretariat", "Contact the office"), info: [["WhatsApp", "+62 812 9100 3030"], [tr("Alamat", "Address"), "Jl. Raya Sawangan 45, Depok"]], fields: [{ kind: "input", label: tr("Nama wali", "Parent's name"), ph: tr("Nama", "Name") }, { kind: "input", label: tr("Nama santri", "Student's name"), ph: tr("Nama", "Name") }, { kind: "select", label: tr("Keperluan", "Purpose"), ph: tr("Pilih", "Choose"), options: [tr("Pendaftaran", "Admission"), tr("Wakaf", "Endowment"), tr("Kunjungan", "Visit")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
        infoTiles(mh, [[tr("Kunjungan", "Visits"), tr("Sabtu 09.00–12.00", "Saturday 9am–noon")], [tr("Rekening wakaf", "Endowment account"), "BSN 7001 2299 30"]]),
        end,
      ]);
    return pageC(mh, [
      head,
      hero(mh, { kind: "bento", eyebrow: tr("Rumah tahfidz anak · Depok", "Children's tahfidz · Depok"), title: tr("Menghafal dengan tenang, bukan tergesa", "Memorise calmly, not hurriedly"), text: tr("Kelas kecil, musyrif bersanad, dan laporan mingguan untuk orang tua.", "Small classes, certified teachers and weekly reports for parents."), acts: [[tr("Lihat program", "See programs"), href("programs")], [tr("Daftar", "Enrol"), href("admission"), "outline"]], image: asset("v3c-quran"), alt: tr("Mushaf di rehal", "Quran on a stand"), stat: ["8:1", tr("Santri per musyrif", "Students per teacher")], chips: [tr("Talaqqi", "Talaqqi"), tr("Murajaah harian", "Daily review"), tr("Asrama", "Boarding")] }),
      counter(mh, { title: tr("Sejak 2015", "Since 2015"), items: ["212 | " + tr("Santri aktif", "Active students"), "37 | " + tr("Hafiz 30 juz", "Full memorisers"), "14 | " + tr("Musyrif", "Teachers"), "11 | " + tr("Tahun", "Years")] }),
      bento(mh, { title: tr("Sehari di Mutiara Hafazah", "A day at Mutiara Hafazah"), tiles: [{ title: tr("Subuh", "Dawn"), text: tr("Murajaah berjamaah 30 menit.", "30 minutes of group review."), stat: "04.30", tone: "primary" }, { title: tr("Pagi", "Morning"), text: tr("Sekolah formal mitra.", "Partner formal school."), image: asset("v3c-quran"), wide: true }, { title: tr("Sore", "Afternoon"), text: tr("Ziyadah setengah halaman.", "Half a new page."), stat: "15.30" }, { title: tr("Malam", "Evening"), text: tr("Tasmi' kelompok.", "Group recital."), tone: "dark" }, { title: tr("Ahad", "Sunday"), text: tr("Olahraga & kegiatan alam.", "Sport & outdoor activities."), tone: "soft" }] }),
      cta(mh, { kind: "split", title: tr("Pendaftaran gelombang 1 dibuka", "Wave 1 admissions open"), acts: [[tr("Daftar", "Enrol"), href("admission"), "light"]] }),
      end,
    ]);
  },
};

/* ------------ 20. AI Lab (PREMIUM, 8 hlm) — kaca gelap ---------------- */

const KG: Palette = { ink: "#eef2ff", muted: "#b4bce6", primary: "#6366f1", primaryDark: "#4f46e5", soft: "#e0e7ff", line: "#a5b4fc" };
const kg = lookC(KG, { head: "Space Grotesk", body: "JetBrains Mono", skin: "glass", radius: 16, bg: "#0b0d24", alt: "#12153a", dark: "#06071a", fx: { aos: "fade-up", animate: "zoomIn", tilt: { max: 8, glare: true } }, btnR: 10, onDark: "#b4bce6", accent2: "#06b6d4" });

const kgFoot = (tr: Tr) =>
  ftr(kg, "Kognisi Lab", {
    kind: "giant",
    about: tr("Lab riset & rekayasa AI terapan untuk bahasa daerah, pertanian, dan layanan publik. Bandung & daring.", "An applied AI research & engineering lab for regional languages, agriculture and public services. Bandung & remote."),
    cols: [{ title: tr("Lab", "Lab"), items: [tr("Riset", "Research"), tr("Produk", "Products"), tr("Karier", "Careers")] }, { title: tr("Kontak", "Contact"), items: ["halo@kognisilab.id"] }],
    copy: tr("© 2026 Kognisi Lab. Konten contoh.", "© 2026 Kognisi Lab. Sample content."),
    social: ["GitHub | https://github.com/kognisilab", "LinkedIn | https://linkedin.com/company/kognisilab", "X | https://x.com/kognisilab"],
    backTop: tr("Ke atas", "Top"),
  });

export const technologyAiLab: TemplateContent = {
  brand: "Kognisi Lab",
  pages: [
    home(),
    pg("research", ["riset", "Riset"], ["research", "Research"]),
    pg("products", ["produk", "Produk"], ["products", "Products"]),
    pg("cases", ["studi-kasus", "Studi Kasus"], ["case-studies", "Case Studies"]),
    pg("team", ["tim", "Tim"], ["team", "Team"]),
    pg("careers", ["karier", "Karier"], ["careers", "Careers"]),
    pg("blog", ["catatan", "Catatan Lab"], ["lab-notes", "Lab Notes"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(kg, "kognisi/lab", { kind: "dark", cta: [tr("Diskusi proyek", "Talk to us"), href("contact")], sticky: true });
    const end = kgFoot(tr);
    if (key === "research")
      return pageC(kg, [
        head,
        banner(kg, { kind: "band", eyebrow: tr("Riset", "Research"), title: tr("Model kecil, dampak besar", "Small models, big impact"), text: tr("Kami fokus pada model hemat komputasi yang bisa berjalan di perangkat lokal.", "We focus on compute-efficient models that run on local devices.") }),
        cardsC(kg, { title: tr("Area riset", "Research areas"), items: [{ icon: "NLP", title: tr("Bahasa daerah", "Regional languages"), text: tr("Korpus & model untuk Jawa, Sunda, Bugis, Minang.", "Corpora & models for Javanese, Sundanese, Buginese, Minang.") }, { icon: "CV", title: tr("Visi pertanian", "Agri vision"), text: tr("Deteksi penyakit daun dari foto ponsel.", "Leaf disease detection from phone photos.") }, { icon: "RAG", title: tr("Dokumen publik", "Public documents"), text: tr("Tanya-jawab atas regulasi daerah.", "Q&A over local regulations.") }] }),
        compare(kg, { title: tr("Model kami vs model besar umum", "Our models vs large general models"), columns: tr("Kognisi-Kecil | Model besar umum", "Kognisi-Small | General large model").split(" | "), rows: [tr("Ukuran | 1,3 M parameter | 70+ M parameter", "Size | 1.3B params | 70B+ params"), tr("Jalan di laptop | ya | tidak", "Runs on a laptop | yes | no"), tr("Bahasa Bugis | ya | tidak", "Buginese | yes | no"), tr("Biaya inferensi | sangat rendah | tinggi", "Inference cost | very low | high")], highlight: 1, caption: tr("Uji internal 2026", "Internal benchmark 2026") }),
        end,
      ]);
    if (key === "products")
      return pageC(kg, [
        head,
        bento(kg, { eyebrow: tr("Produk", "Products"), title: tr("Siap dipakai tim Anda", "Ready for your team"), tiles: [{ title: "Lontar API", text: tr("Terjemahan & ringkasan 12 bahasa daerah.", "Translation & summaries in 12 regional languages."), image: asset("v3c-neural"), wide: true }, { title: "DaunScan", text: tr("Aplikasi diagnosis tanaman offline.", "Offline crop diagnosis app."), stat: "94%", tone: "primary" }, { title: "Arsip Tanya", text: tr("Asisten dokumen untuk pemda.", "Document assistant for local government."), stat: "38" }, { title: tr("Lisensi on-premise", "On-premise licence"), text: tr("Data tidak keluar dari server Anda.", "Data never leaves your servers."), tone: "dark", wide: true }] }),
        marquee(kg, { title: tr("Dipakai oleh", "Used by"), items: ["Dinas Tani Sejahtera", "Koperasi Daun Hijau", "Perpustakaan Kota Pelita", "Klinik Desa Sehat", "Penerbit Lontar Baru"] }),
        end,
      ]);
    if (key === "cases")
      return pageC(kg, [
        head,
        split(kg, { eyebrow: tr("Studi kasus", "Case study"), title: tr("DaunScan untuk 4.000 petani padi", "DaunScan for 4,000 rice farmers"), paras: [tr("Bersama koperasi di Sulawesi Selatan, deteksi penyakit blas turun dari 9 hari menjadi 1 hari.", "With a South Sulawesi cooperative, blast disease detection dropped from 9 days to 1.")], bullets: [tr("Berjalan offline di ponsel 2 GB RAM", "Runs offline on 2 GB RAM phones"), tr("Antarmuka bahasa Bugis", "Buginese interface"), tr("Akurasi 94% di lapangan", "94% field accuracy")], image: asset("v3c-neural"), alt: tr("Jaringan saraf", "Neural network"), tone: "dark" }),
        counter(kg, { title: tr("Dampak 2026", "2026 impact"), items: ["4.000 | " + tr("Petani", "Farmers"), "1 hari | " + tr("Waktu deteksi", "Detection time"), "12 | " + tr("Bahasa daerah", "Regional languages"), "38 | " + tr("Pemda", "Local govts")], dark: true }),
        end,
      ]);
    if (key === "team")
      return pageC(kg, [
        head,
        teamCards(kg, tr, { eyebrow: tr("Tim", "Team"), title: tr("Peneliti & insinyur", "Researchers & engineers"), members: [{ name: "Dr. Arini Kusumastuti", role: tr("Direktur riset", "Research director"), photo: asset("v3c-face-2") }, { name: "Yosef Manurung", role: "ML engineer", photo: asset("v3c-face-3") }, { name: "Nurul Aini", role: tr("Ahli linguistik", "Linguist"), photo: asset("v3c-face-4") }, { name: "Bayu Saputra", role: "MLOps", photo: asset("v3c-face-1") }] }),
        pull(kg, { text: tr("AI yang baik harus mengerti bahasa nenek kita.", "Good AI should understand our grandmothers' language."), name: "Dr. Arini Kusumastuti", role: tr("Direktur riset", "Research director"), bg: kg.alt }),
        end,
      ]);
    if (key === "careers")
      return pageC(kg, [
        head,
        hero(kg, { kind: "oversized", eyebrow: tr("Karier", "Careers"), title: tr("Bangun AI untuk Nusantara", "Build AI for the archipelago"), text: tr("Kerja hybrid dari Bandung, anggaran GPU pribadi, dan waktu riset 20%.", "Hybrid from Bandung, a personal GPU budget and 20% research time."), acts: [[tr("Kirim CV", "Send your CV"), href("contact")]] }),
        table(kg, { title: tr("Lowongan terbuka", "Open roles"), columns: [tr("Posisi", "Role"), tr("Tim", "Team"), tr("Lokasi", "Location")], rows: [["Research Scientist, NLP", tr("Riset", "Research"), "Bandung / remote"], ["ML Engineer", tr("Produk", "Products"), "Bandung"], [tr("Anotator bahasa Minang", "Minang language annotator"), "Data", "Remote"]] }),
        end,
      ]);
    if (key === "blog")
      return pageC(kg, [
        head,
        journal(kg, { eyebrow: tr("Catatan lab", "Lab notes"), title: tr("Yang sedang kami pelajari", "What we're learning"), read: tr("Baca", "Read"), href: href("blog"), items: [{ image: asset("v3c-neural"), tag: "NLP", date: "Nov 2026", title: tr("Tokenizer untuk aksara Lontara", "A tokenizer for Lontara script"), text: tr("Kenapa BPE biasa gagal dan apa gantinya.", "Why standard BPE fails and what we use instead.") }, { image: asset("v3c-neural"), tag: "Edge", date: "Okt 2026", title: tr("Kuantisasi 4-bit di ponsel murah", "4-bit quantisation on budget phones"), text: tr("Hasil uji 12 perangkat.", "Results from 12 devices.") }, { image: asset("v3c-neural"), tag: tr("Etika", "Ethics"), date: "Sep 2026", title: tr("Persetujuan data dari desa", "Data consent from villages"), text: tr("Protokol yang kami pakai.", "The protocol we use.") }] }),
        newsletter(kg, { title: tr("Catatan lab bulanan", "Monthly lab notes"), text: tr("Ringkasan riset tanpa jargon.", "Research summaries without jargon."), ph: "email@contoh.id", submit: tr("Langganan", "Subscribe"), bg: kg.alt }),
        end,
      ]);
    if (key === "contact")
      return pageC(kg, [
        head,
        form(kg, { title: tr("Ceritakan masalah Anda", "Tell us your problem"), text: tr("Kami membalas dalam 2 hari kerja.", "We reply within 2 working days."), info: [["Email", "halo@kognisilab.id"], [tr("Kantor", "Office"), "Jl. Dago Asri 9, Bandung"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "input", label: tr("Organisasi", "Organisation"), ph: tr("Nama instansi", "Organisation name") }, { kind: "select", label: tr("Minat", "Interest"), ph: tr("Pilih", "Choose"), options: ["Lontar API", "DaunScan", "Arsip Tanya", tr("Riset bersama", "Joint research")] }], message: tr("Masalah yang ingin diselesaikan", "Problem to solve"), submit: tr("Kirim", "Send") }),
        faq(kg, { title: tr("Pertanyaan teknis", "Technical questions"), items: [[tr("Bisa on-premise?", "On-premise?"), tr("Ya, termasuk tanpa internet.", "Yes, including air-gapped.")], [tr("Data dipakai melatih model?", "Is data used for training?"), tr("Tidak, kecuali ada perjanjian tertulis.", "No, unless agreed in writing.")]] }),
        end,
      ]);
    return pageC(kg, [
      head,
      hero(kg, { kind: "neon", badge: tr("Model Lontar v3 rilis", "Lontar v3 released"), titleNode: typer(kg, tr("AI yang paham", "AI that understands"), [tr("bahasa daerah", "regional languages"), tr("sawah", "rice fields"), tr("dokumen pemda", "local regulations")], { size: 54, color: "#ffffff", word: "#67e8f9" }), title: "Kognisi Lab", text: tr("Riset dan rekayasa AI terapan yang hemat komputasi, berjalan offline, dan dibangun bersama komunitas.", "Applied AI research and engineering that is compute-efficient, runs offline and is built with communities."), acts: [[tr("Lihat produk", "See products"), href("products")], [tr("Riset kami", "Our research"), href("research"), "outline"]], image: asset("v3c-neural"), alt: tr("Jaringan saraf", "Neural network") }),
      marquee(kg, { title: tr("Mitra", "Partners"), items: ["Dinas Tani Sejahtera", "Koperasi Daun Hijau", "Perpustakaan Kota Pelita", "Klinik Desa Sehat", "Penerbit Lontar Baru"], bg: kg.alt }),
      counter(kg, { items: ["12 | " + tr("Bahasa daerah", "Regional languages"), "1,3 M | " + tr("Parameter", "Parameters"), "4.000 | " + tr("Petani", "Farmers"), "38 | " + tr("Pemda", "Local govts")], dark: true, bg: kg.bg }),
      cta(kg, { kind: "giant", title: tr("Punya masalah yang butuh AI kecil?", "Got a problem for a small AI?"), acts: [[tr("Diskusi proyek", "Talk to us"), href("contact"), "light"]], bg: kg.p.primaryDark }),
      end,
    ]);
  },
};
