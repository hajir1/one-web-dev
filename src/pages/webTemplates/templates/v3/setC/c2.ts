import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import { pricingCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import { countdownBand, mega, priceSwitch, quotes, slider, typer } from "../../v2/setA/kitA";
import {
  banner,
  beforeAfter,
  bento,
  bigNumbers,
  cardsC,
  catalog,
  chips,
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
  pull,
  split,
  steps,
  strip,
  table,
  tabs,
  timelineC,
  video,
  words,
} from "./kitC";

/* ================================================================== */
/* Template v3 C6–C10: Patisserie, Podcast, Studio rekaman, Streetwear, */
/* Batik.                                                               */
/* ================================================================== */

/* ------------- 6. Patisserie (PREMIUM, 7 hlm) — lembut mewah --------- */

const SG: Palette = { ink: "#4a0d2a", muted: "#8a5770", primary: "#be185d", primaryDark: "#9d174d", soft: "#fce7f3", line: "#fbcfe8" };
const sg = lookC(SG, { head: "DM Serif Display", body: "Outfit", skin: "soft", radius: 28, bg: "#fffafc", alt: "#fdf2f7", dark: "#3b0a22", fx: { aos: "zoom-in-up", tilt: { max: 6, glare: true } }, btnR: 999, accent2: "#f59e0b" });

const sgFoot = (tr: Tr) =>
  ftr(sg, "Sekar Gula Patisserie", {
    kind: "giant",
    about: tr("Patisserie kecil di Kemang Utara. Kue custom, entremet, dan kelas pastry akhir pekan.", "A small patisserie in North Kemang. Custom cakes, entremets and weekend pastry classes."),
    cols: [
      { title: tr("Butik", "Boutique"), items: ["Jl. Kemang Utara IX/3", tr("Rab–Min 10.00–20.00", "Wed–Sun 10am–8pm")] },
      { title: tr("Pesanan", "Orders"), items: ["+62 811 9020 3355", "pesan@sekargula.id"] },
    ],
    copy: tr("© 2026 Sekar Gula Patisserie. Konten contoh.", "© 2026 Sekar Gula Patisserie. Sample content."),
    social: ["Instagram | https://instagram.com/sekargula", "Pinterest | https://pinterest.com/sekargula"],
    backTop: tr("Ke atas", "Top"),
  });

export const bakeryPatisserie: TemplateContent = {
  brand: "Sekar Gula Patisserie",
  pages: [
    home(),
    pg("collection", ["koleksi", "Koleksi"], ["collection", "Collection"]),
    pg("custom", ["kue-custom", "Kue Custom"], ["custom-cakes", "Custom Cakes"]),
    pg("class", ["kelas-pastry", "Kelas Pastry"], ["pastry-class", "Pastry Class"]),
    pg("gallery", ["galeri", "Galeri"], ["gallery", "Gallery"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("order", ["pesan", "Pesan"], ["order", "Order"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(sg, "Sekar Gula", { kind: "pill", cta: [tr("Pesan kue", "Order a cake"), href("order")] });
    const end = sgFoot(tr);
    if (key === "collection")
      return pageC(sg, [
        head,
        banner(sg, { kind: "center", eyebrow: tr("Etalase minggu ini", "This week's counter"), title: tr("Koleksi entremet & tart", "Entremets & tarts"), text: tr("Dibuat dalam batch kecil setiap Rabu dan Sabtu.", "Made in small batches every Wednesday and Saturday.") }),
        catalog(sg, {
          title: tr("Untuk dibawa pulang", "To take home"),
          items: [
            { image: asset("v3c-cake"), title: "Rose Lychee Entremet", text: tr("Mousse leci, kompot mawar, dacquoise almond", "Lychee mousse, rose compote, almond dacquoise"), price: "Rp385.000", badge: tr("Favorit", "Favourite"), cta: tr("Pesan", "Order"), href: href("order") },
            { image: asset("v3c-cake-gold"), title: "Gula Aren Mille-feuille", text: tr("Krim diplomat gula aren", "Palm sugar diplomat cream"), price: "Rp295.000", cta: tr("Pesan", "Order"), href: href("order") },
            { image: asset("v3c-cake"), title: "Tart Markisa Meringue", text: tr("Markisa Medan, meringue Italia", "Passion fruit, Italian meringue"), price: "Rp260.000", cta: tr("Pesan", "Order"), href: href("order") },
            { image: asset("v3c-cake-gold"), title: "Opera Kopi Gayo", text: tr("Tujuh lapis, ganache cokelat 64%", "Seven layers, 64% chocolate ganache"), price: "Rp340.000", cta: tr("Pesan", "Order"), href: href("order") },
            { image: asset("v3c-cake"), title: "Pandan Chiffon Royale", text: tr("Chiffon pandan, krim kelapa bakar", "Pandan chiffon, toasted coconut cream"), price: "Rp210.000", cta: tr("Pesan", "Order"), href: href("order") },
            { image: asset("v3c-cake-gold"), title: tr("Kotak Petit Four", "Petit Four Box"), text: tr("12 kue mungil campur", "12 assorted mini cakes"), price: "Rp185.000", cta: tr("Pesan", "Order"), href: href("order") },
          ],
        }),
        modalOffer(sg, { title: tr("Pre-order musim Natal", "Christmas pre-orders"), text: tr("Bûche de Noël edisi terbatas, 80 loyang saja.", "Limited-edition bûche de Noël, only 80 cakes."), trigger: tr("Lihat edisi", "See the edition"), modalTitle: "Bûche de Noël 2026", body: tr("Cokelat hitam, kastanye, dan jeruk. Pengambilan 20–24 Desember. DP 50% saat memesan.", "Dark chocolate, chestnut and orange. Pickup December 20–24. 50% deposit when ordering."), cta: [tr("Pre-order", "Pre-order"), href("order")] }),
        end,
      ]);
    if (key === "custom")
      return pageC(sg, [
        head,
        hero(sg, { kind: "collage", eyebrow: tr("Kue custom", "Custom cakes"), title: tr("Kue yang diceritakan dulu, baru dipanggang", "Cakes that start as a story"), text: tr("Konsultasi 30 menit untuk rasa, warna, dan cerita acara Anda. Sketsa dikirim dalam 2 hari.", "A 30-minute consultation on flavour, colour and your event's story. Sketch within 2 days."), acts: [[tr("Jadwalkan konsultasi", "Book a consultation"), href("order")]], images: [asset("v3c-cake"), asset("v3c-cake-gold"), asset("v3c-bouquet")], alt: tr("Kue custom", "Custom cakes") }),
        steps(sg, { title: tr("Dari konsultasi ke meja pesta", "From consultation to party table"), items: [[tr("Konsultasi", "Consult"), tr("Ceritakan acara, tamu, dan rasa favorit.", "Tell us about the event, guests and flavours.")], [tr("Sketsa & cicip", "Sketch & taste"), tr("Kotak cicip 3 rasa dikirim ke rumah.", "A 3-flavour tasting box sent home.")], [tr("Produksi", "Make"), tr("Dibuat H-2, dekorasi H-1.", "Baked two days before, decorated the day before.")], [tr("Antar & pasang", "Deliver & set"), tr("Tim kami memasang di lokasi.", "Our team sets it up on site.")]] }),
        pricingCards(sg, tr, {
          eyebrow: tr("Harga mulai", "Starting prices"),
          title: tr("Paket kue custom", "Custom cake packages"),
          plans: [
            { name: tr("Ulang tahun", "Birthday"), price: "Rp650rb", period: tr("/ 20 porsi", "/ 20 servings"), text: tr("Satu tingkat, dekorasi tangan.", "One tier, hand decoration."), features: [tr("2 pilihan rasa", "2 flavour choices"), tr("Topper nama", "Name topper"), tr("Kotak cicip", "Tasting box")], cta: { label: tr("Pilih", "Choose"), href: href("order") } },
            { name: tr("Pernikahan", "Wedding"), price: "Rp4,8jt", period: tr("/ 150 porsi", "/ 150 servings"), text: tr("Tiga tingkat, bunga gula.", "Three tiers, sugar flowers."), features: [tr("Konsultasi 2x", "2 consultations"), tr("Pemasangan di venue", "Venue setup"), tr("Dessert table opsional", "Optional dessert table")], cta: { label: tr("Pilih", "Choose"), href: href("order") }, featured: true },
            { name: tr("Korporat", "Corporate"), price: "Rp180rb", period: tr("/ kotak", "/ box"), text: tr("Hampers & kue logo.", "Hampers & logo cakes."), features: [tr("Min. 30 kotak", "Min. 30 boxes"), tr("Kartu ucapan", "Greeting card")], cta: { label: tr("Pilih", "Choose"), href: href("order") } },
          ],
        }),
        end,
      ]);
    if (key === "class")
      return pageC(sg, [
        head,
        banner(sg, { kind: "image", eyebrow: tr("Sabtu & Minggu", "Weekends"), title: tr("Kelas pastry dengan chef kami", "Pastry classes with our chef"), text: tr("Maksimal 8 peserta, semua bahan disediakan, hasil dibawa pulang.", "Maximum 8 students, all ingredients provided, take your bakes home."), image: asset("v3c-cake-gold"), alt: tr("Kelas pastry", "Pastry class") }),
        table(sg, { title: tr("Jadwal kelas", "Class schedule"), columns: [tr("Kelas", "Class"), tr("Durasi", "Length"), tr("Tingkat", "Level"), tr("Biaya", "Fee")], rows: [["Choux & Éclair", tr("4 jam", "4 hrs"), tr("Pemula", "Beginner"), "Rp850.000"], [tr("Tart buah", "Fruit tarts"), tr("4 jam", "4 hrs"), tr("Pemula", "Beginner"), "Rp800.000"], ["Entremet", tr("6 jam", "6 hrs"), tr("Menengah", "Intermediate"), "Rp1.450.000"], ["Viennoiserie", tr("2 hari", "2 days"), tr("Lanjut", "Advanced"), "Rp2.600.000"]] }),
        quotes(sg, { title: tr("Kata alumni kelas", "From our students"), items: [{ quote: tr("Éclair pertama saya langsung mengembang sempurna. Penjelasannya sabar sekali.", "My very first éclairs puffed perfectly. Such patient teaching."), author: "Citra Maharani", role: tr("Alumni Choux", "Choux alumna"), avatar: asset("v3c-face-4") }, { quote: tr("Kelasnya kecil, jadi chef memperhatikan setiap meja.", "Small class, so the chef checks every table."), author: "Bagus Wiratama", role: tr("Alumni Entremet", "Entremet alumnus"), avatar: asset("v3c-face-3") }] }),
        end,
      ]);
    if (key === "gallery")
      return pageC(sg, [
        head,
        banner(sg, { kind: "rule", eyebrow: tr("Portofolio", "Portfolio"), title: tr("Kue yang pernah kami buat", "Cakes we've made"), text: tr("Ketuk gambar untuk memperbesar.", "Tap an image to enlarge.") }),
        lightbox(sg, { images: [[asset("v3c-cake"), tr("Pernikahan taman, 3 tingkat", "Garden wedding, 3 tiers")], [asset("v3c-cake-gold"), tr("Ulang tahun ke-60", "60th birthday")], [asset("v3c-bouquet"), tr("Bunga gula peoni", "Sugar peonies")], [asset("v3c-cake"), tr("Lamaran pastel", "Pastel engagement")], [asset("v3c-cake-gold"), tr("Peluncuran produk", "Product launch")], [asset("v3c-bouquet-sun"), tr("Dessert table", "Dessert table")]], cols: 3, ratio: "3 / 4" }),
        cta(sg, { kind: "sticker", title: tr("Punya ide kue impian?", "Dreaming up a cake?"), acts: [[tr("Konsultasi gratis", "Free consultation"), href("custom")]] }),
        end,
      ]);
    if (key === "about")
      return pageC(sg, [
        head,
        split(sg, { eyebrow: tr("Chef pendiri", "Founding chef"), title: tr("Sekar belajar di Lyon, pulang membawa gula aren", "Sekar trained in Lyon and came home to palm sugar"), paras: [tr("Setelah enam tahun di dapur pastry Prancis, Chef Sekar Ayuningtyas membuka butik kecil yang memadukan teknik klasik dan rasa Nusantara.", "After six years in French pastry kitchens, Chef Sekar Ayuningtyas opened a small boutique blending classic technique with Indonesian flavours.")], image: asset("v3c-face-2"), alt: "Chef Sekar", tone: "primary" }),
        bigNumbers(sg, [["2019", tr("Butik dibuka", "Boutique opened")], ["1.800+", tr("Kue custom", "Custom cakes")], ["14", tr("Rasa Nusantara", "Local flavours")]]),
        pull(sg, { text: tr("Teknik Prancis itu disiplin; rasa Indonesia itu kenangan. Kami butuh keduanya.", "French technique is discipline; Indonesian flavour is memory. We need both."), name: "Sekar Ayuningtyas", role: "Chef pâtissière" }),
        end,
      ]);
    if (key === "order")
      return pageC(sg, [
        head,
        form(sg, { eyebrow: tr("Pesanan", "Orders"), title: tr("Ceritakan kue Anda", "Tell us about your cake"), text: tr("Kami membalas dalam 1 hari kerja dengan estimasi harga.", "We reply within one working day with a quote."), info: [["WhatsApp", "+62 811 9020 3355"], [tr("Minimal pesan", "Lead time"), tr("H-5 untuk kue custom", "5 days for custom cakes")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "date", label: tr("Tanggal acara", "Event date") }, { kind: "select", label: tr("Jenis", "Type"), ph: tr("Pilih", "Choose"), options: [tr("Ulang tahun", "Birthday"), tr("Pernikahan", "Wedding"), tr("Korporat", "Corporate"), tr("Etalase", "From the counter")] }], message: tr("Ide & jumlah porsi", "Ideas & servings"), submit: tr("Kirim permintaan", "Send request") }),
        faq(sg, { title: tr("Tentang pesanan", "About orders"), items: [[tr("Bisa bebas gluten?", "Gluten-free?"), tr("Beberapa rasa bisa, tanyakan saat konsultasi.", "Some flavours can be; ask during consultation.")], [tr("Antar ke luar Jakarta?", "Delivery outside Jakarta?"), tr("Jabodetabek dengan mobil berpendingin.", "Greater Jakarta in a chilled van.")]] }),
        end,
      ]);
    return pageC(sg, [
      head,
      hero(sg, { kind: "editorial", meta: ["Sekar Gula", tr("Patisserie · Kemang", "Patisserie · Kemang")], title: tr("Teknik Prancis, rasa yang kita kenal", "French technique, flavours we know"), text: tr("Entremet gula aren, tart markisa, dan kue custom yang dibuat dari cerita Anda.", "Palm sugar entremets, passion fruit tarts and custom cakes made from your story."), acts: [[tr("Lihat koleksi", "See the collection"), href("collection")], [tr("Kue custom", "Custom cakes"), href("custom"), "outline"]], image: asset("v3c-cake"), alt: tr("Kue tingkat", "Tiered cake") }),
      bento(sg, { title: tr("Dari butik kami", "From our boutique"), tiles: [{ title: "Rose Lychee", text: tr("Entremet terlaris sejak 2019.", "Our best seller since 2019."), image: asset("v3c-cake"), wide: true }, { title: tr("Kue custom", "Custom cakes"), text: tr("Sketsa dalam 2 hari.", "Sketch within 2 days."), stat: "1.800+", tone: "primary" }, { title: tr("Kelas akhir pekan", "Weekend classes"), text: tr("Maks. 8 peserta.", "Max 8 students."), stat: "8", tone: "soft" }, { title: tr("Rasa Nusantara", "Local flavours"), text: tr("Gula aren, pandan, markisa, kopi Gayo.", "Palm sugar, pandan, passion fruit, Gayo coffee."), image: asset("v3c-cake-gold"), wide: true }] }),
      quotes(sg, { title: tr("Mereka bilang", "What they say"), items: [{ quote: tr("Kue pernikahan kami jadi bahan obrolan semua tamu.", "Our wedding cake was what every guest talked about."), author: "Anindya & Raka", role: tr("Pernikahan 2025", "Wedding 2025"), avatar: asset("v3c-face-4") }, { quote: tr("Mille-feuille gula arennya bikin rindu.", "The palm sugar mille-feuille is unforgettable."), author: "Yudhistira P.", role: tr("Pelanggan tetap", "Regular"), avatar: asset("v3c-face-1") }, { quote: tr("Hampers kantor rapi dan tepat waktu.", "Office hampers were neat and on time."), author: "Melati S.", role: "HR Manager", avatar: asset("v3c-face-2") }] }),
      cta(sg, { kind: "giant", title: tr("Pesan kue untuk momen berikutnya", "Order a cake for your next moment"), acts: [[tr("Mulai pesan", "Start an order"), href("order"), "light"]], bg: sg.p.primaryDark }),
      end,
    ]);
  },
};

/* ------------ 7. Podcast Ruang Dengar (PREMIUM, 5 hlm) — neon -------- */

const RD: Palette = { ink: "#f5f3ff", muted: "#c4b5fd", primary: "#8b5cf6", primaryDark: "#6d28d9", soft: "#ede9fe", line: "#c4b5fd" };
const rd = lookC(RD, { head: "Syne", body: "Inter", skin: "neon", radius: 18, bg: "#0e0a1f", alt: "#171030", dark: "#08061a", fx: { animate: "fadeInUp", tilt: { max: 12, glare: true } }, btnR: 999, onDark: "#c4b5fd", accent2: "#ec4899" });

const rdFoot = (tr: Tr) =>
  ftr(rd, "Siniar Ruang Dengar", {
    kind: "giant",
    about: tr("Podcast obrolan panjang tentang kerja, kota, dan hal-hal yang jarang dibahas. Episode baru setiap Kamis.", "A long-form podcast about work, cities and the things rarely talked about. New episodes every Thursday."),
    cols: [{ title: tr("Dengarkan", "Listen"), items: ["Spotify", "Apple Podcasts", "YouTube"] }, { title: tr("Kerja sama", "Partnerships"), items: ["sponsor@ruangdengar.id"] }],
    copy: tr("© 2026 Siniar Ruang Dengar. Konten contoh.", "© 2026 Siniar Ruang Dengar. Sample content."),
    social: ["Spotify | https://open.spotify.com/show/ruangdengar", "YouTube | https://youtube.com/@ruangdengar", "Instagram | https://instagram.com/ruangdengar"],
  });

export const podcastRuangDengar: TemplateContent = {
  brand: "Siniar Ruang Dengar",
  pages: [home(), pg("episodes", ["episode", "Episode"], ["episodes", "Episodes"]), pg("hosts", ["host", "Host"], ["hosts", "Hosts"]), pg("sponsor", ["sponsor", "Sponsor"], ["sponsor", "Sponsor"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) => {
    const head = hdr(rd, "Ruang Dengar", { kind: "dark", cta: [tr("Dengarkan", "Listen"), href("episodes")] });
    const end = rdFoot(tr);
    if (key === "episodes")
      return pageC(rd, [
        head,
        banner(rd, { kind: "band", eyebrow: tr("148 episode", "148 episodes"), title: tr("Semua episode", "All episodes"), text: tr("Durasi 60–90 menit, transkrip tersedia.", "60–90 minutes each, transcripts available.") }),
        journal(rd, { title: tr("Terbaru", "Latest"), read: tr("Dengarkan", "Listen"), href: href("episodes"), items: [{ image: asset("v3c-mic"), tag: "EP 148", date: "12 Nov 2026", title: tr("Kerja dari kota kecil", "Working from a small town"), text: tr("Bersama arsitek yang pindah ke Wonosobo dan tetap melayani klien Jakarta.", "With an architect who moved to Wonosobo and still serves Jakarta clients.") }, { image: asset("v3c-mic"), tag: "EP 147", date: "5 Nov 2026", title: tr("Gaji pertama & rasa bersalah", "First pay & guilt"), text: tr("Generasi sandwich bercerita.", "Sandwich-generation stories.") }, { image: asset("v3c-mic"), tag: "EP 146", date: "29 Okt 2026", title: tr("Angkot terakhir", "The last minibus"), text: tr("Sopir angkot 30 tahun di Bogor.", "A Bogor minibus driver of 30 years.") }] }),
        video(rd, { title: tr("Versi video EP 148", "EP 148 video edition"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" }),
        end,
      ]);
    if (key === "hosts")
      return pageC(rd, [
        head,
        people(rd, { eyebrow: tr("Di balik mikrofon", "Behind the mic"), title: tr("Dua host, satu meja", "Two hosts, one table"), cols: 2, items: [{ name: "Tara Wisesa", role: tr("Host & produser", "Host & producer"), photo: asset("v3c-face-4"), text: tr("Mantan jurnalis radio, senang bertanya hal yang canggung.", "Former radio journalist who loves awkward questions.") }, { name: "Bima Aryasatya", role: tr("Host", "Host"), photo: asset("v3c-face-3"), text: tr("Peneliti urban, pembaca peta, penggemar bakso.", "Urban researcher, map reader, meatball fan.") }] }),
        pull(rd, { text: tr("Kami tidak mengejar jawaban cepat. Kami memberi ruang sampai tamu berani jujur.", "We don't chase quick answers. We make room until guests dare to be honest."), name: "Tara Wisesa", role: "Host", bg: rd.alt }),
        end,
      ]);
    if (key === "sponsor")
      return pageC(rd, [
        head,
        hero(rd, { kind: "oversized", eyebrow: tr("Media kit 2026", "2026 media kit"), title: tr("Didengar sampai menit terakhir", "Heard to the very last minute"), text: tr("Rata-rata pendengar menyelesaikan 78% episode. Iklan dibacakan host, bukan rekaman pabrik.", "Listeners finish 78% of each episode on average. Ads are host-read, not canned."), acts: [[tr("Minta media kit", "Request the media kit"), href("contact")]] }),
        bigNumbers(rd, [["210K", tr("Unduhan/bulan", "Downloads/month")], ["78%", tr("Tingkat selesai", "Completion rate")], ["25–34", tr("Usia dominan", "Main age group")]], { bg: rd.alt }),
        marquee(rd, { title: tr("Pernah bekerja sama dengan", "Past partners"), items: ["Kopi Lereng", "Bank Sampah Mandiri Jaya", "Sepeda Kayuh", "Teh Pucuk Gunung", "Buku Kampung", "Studio Lantai 3"] }),
        end,
      ]);
    if (key === "contact")
      return pageC(rd, [
        head,
        form(rd, { title: tr("Usulkan tamu atau cerita", "Suggest a guest or story"), info: [["Email", "halo@ruangdengar.id"], ["Sponsor", "sponsor@ruangdengar.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "select", label: tr("Topik", "Topic"), ph: tr("Pilih", "Choose"), options: [tr("Usul tamu", "Guest idea"), "Sponsor", tr("Lainnya", "Other")] }], message: tr("Ceritakan", "Tell us"), submit: tr("Kirim", "Send") }),
        faq(rd, { title: tr("Pertanyaan pendengar", "Listener questions"), items: [[tr("Ada transkrip?", "Transcripts?"), tr("Ya, terbit 2 hari setelah episode.", "Yes, two days after each episode.")], [tr("Boleh ikut rekaman?", "Can I attend a recording?"), tr("Rekaman live tiap akhir bulan.", "Live recordings at month's end.")]] }),
        end,
      ]);
    return pageC(rd, [
      head,
      hero(rd, { kind: "neon", badge: tr("EP 148 tayang", "EP 148 is out"), titleNode: typer(rd, tr("Obrolan panjang tentang", "Long talks about"), [tr("kerja", "work"), tr("kota", "cities"), tr("keluarga", "family"), tr("hal canggung", "awkward things")], { size: 56, color: "#ffffff", word: "#f0abfc" }), title: "Ruang Dengar", text: tr("Satu tamu, satu meja, 90 menit tanpa terburu-buru. Episode baru setiap Kamis.", "One guest, one table, 90 unhurried minutes. New episodes every Thursday."), acts: [[tr("Dengarkan sekarang", "Listen now"), href("episodes")], [tr("Jadi sponsor", "Sponsor us"), href("sponsor"), "outline"]], image: asset("v3c-mic"), alt: tr("Mikrofon", "Microphone") }),
      marquee(rd, { title: tr("Tersedia di", "Available on"), items: ["Spotify", "Apple Podcasts", "YouTube", "Pocket Casts", "Castbox", "RSS"], bg: rd.alt }),
      cardsC(rd, { title: tr("Seri pilihan", "Featured series"), items: [{ image: asset("v3c-mic"), title: tr("Kota & Kita", "Cities & Us"), text: tr("12 episode tentang ruang publik.", "12 episodes on public space."), meta: "S3" }, { image: asset("v3c-headphones"), title: tr("Kerja Itu Apa", "What Is Work"), text: tr("Karier tanpa glorifikasi.", "Careers without the glamour."), meta: "S2" }, { image: asset("v3c-mic"), title: tr("Rumah", "Home"), text: tr("Keluarga, warisan, pulang.", "Family, inheritance, going home."), meta: "S1" }] }),
      cta(rd, { kind: "giant", title: tr("Kamis malam, earphone siap?", "Thursday night, earphones ready?"), acts: [[tr("Semua episode", "All episodes"), href("episodes"), "light"]], bg: rd.p.primaryDark }),
      end,
    ]);
  },
};

/* --------- 8. Studio Suara (PREMIUM, 4 hlm) — retro teal ------------- */

const SS: Palette = { ink: "#042f2e", muted: "#3d6664", primary: "#0f766e", primaryDark: "#115e59", soft: "#ccfbf1", line: "#5eead4" };
const ss = lookC(SS, { head: "Space Mono", body: "Work Sans", skin: "retro", radius: 14, bg: "#f6fbf7", alt: "#e6f4ef", dark: "#042f2e", fx: { aos: "flip-up" }, btnR: 8, onDark: "#99d5cb", accent2: "#f59e0b" });

const ssFoot = (tr: Tr) =>
  ftr(ss, "Bilik Suara Studio", {
    kind: "columns",
    about: tr("Studio rekaman podcast, voice over, dan audiobook di Bandung. Dua bilik kedap suara + ruang mixing.", "Podcast, voice-over and audiobook studio in Bandung. Two sound-proof booths plus a mixing room."),
    cols: [{ title: tr("Studio", "Studio"), items: ["Jl. Cihampelas 140", tr("Setiap hari 09.00–22.00", "Daily 9am–10pm")] }, { title: tr("Kontak", "Contact"), items: ["+62 822 1400 7788", "booking@biliksuara.id"] }],
    copy: tr("© 2026 Bilik Suara Studio. Konten contoh.", "© 2026 Bilik Suara Studio. Sample content."),
  });

export const podcastStudioSuara: TemplateContent = {
  brand: "Bilik Suara Studio",
  pages: [home(), pg("rooms", ["ruang", "Ruang Studio"], ["rooms", "Rooms"]), pg("rates", ["tarif", "Tarif"], ["rates", "Rates"]), pg("booking", ["booking", "Booking"], ["book", "Book"])],
  build: (key, tr, href) => {
    const head = hdr(ss, "Bilik Suara", { kind: "split", cta: [tr("Booking", "Book"), href("booking")] });
    const end = ssFoot(tr);
    if (key === "rooms")
      return pageC(ss, [
        head,
        banner(ss, { kind: "image", eyebrow: tr("3 ruang", "3 rooms"), title: tr("Bilik untuk setiap suara", "A booth for every voice"), text: tr("Peredam 60 dB, mikrofon kondensor, dan engineer yang menemani.", "60 dB isolation, condenser mics and an engineer by your side."), image: asset("v3c-headphones-amber"), alt: tr("Headphone studio", "Studio headphones") }),
        cardsC(ss, { title: tr("Ruang kami", "Our rooms"), items: [{ icon: "A", title: tr("Bilik A — Podcast", "Booth A — Podcast"), text: tr("4 mikrofon, kamera 3 sudut untuk video podcast.", "4 mics, 3-angle cameras for video podcasts."), meta: tr("Maks. 4 orang", "Up to 4 people") }, { icon: "B", title: tr("Bilik B — Voice over", "Booth B — Voice-over"), text: tr("Kering & sunyi, cocok untuk iklan dan audiobook.", "Dry and silent, ideal for ads and audiobooks."), meta: tr("1–2 orang", "1–2 people") }, { icon: "M", title: tr("Ruang mixing", "Mixing room"), text: tr("Monitor near-field, perawatan akustik penuh.", "Near-field monitors, full acoustic treatment."), meta: tr("Dengan engineer", "With engineer") }] }),
        table(ss, { title: tr("Peralatan", "Gear list"), columns: [tr("Kategori", "Category"), tr("Alat", "Gear")], rows: [[tr("Mikrofon", "Microphones"), tr("Kondensor diafragma besar x4, dinamis x4", "Large-diaphragm condensers x4, dynamics x4")], [tr("Antarmuka", "Interface"), tr("8 input preamp", "8 preamp inputs")], [tr("Monitor", "Monitoring"), tr("Headphone tertutup x6", "Closed-back headphones x6")]] }),
        end,
      ]);
    if (key === "rates")
      return pageC(ss, [
        head,
        priceSwitch(ss, { eyebrow: tr("Tarif", "Rates"), title: tr("Per sesi atau paket bulanan", "Per session or monthly package"), plans: [tr("Rekam | Rp250rb | Rp2,2jt | Per jam; Bilik A atau B; File mentah WAV | Booking", "Record | Rp250k | Rp2.2m | Per hour; Booth A or B; Raw WAV files | Book"), tr("Rekam + Mix | Rp450rb | Rp4jt | Per jam; Mixing & mastering; Noise cleanup; Revisi 1x | Booking", "Record + Mix | Rp450k | Rp4m | Per hour; Mixing & mastering; Noise cleanup; 1 revision | Book"), tr("Video podcast | Rp900rb | Rp8jt | Per episode; 3 kamera; Edit dasar | Booking", "Video podcast | Rp900k | Rp8m | Per episode; 3 cameras; Basic edit | Book")], labels: [tr("Per sesi", "Per session"), tr("Paket 10 sesi", "10-session pack"), tr("Hemat 12%", "Save 12%"), tr("/sesi", "/session"), tr("/10 sesi", "/10 sessions")], href: href("booking") }),
        beforeAfter(ss, { eyebrow: tr("Hasil mixing", "Mixing results"), title: tr("Geser untuk dengar bedanya (secara visual)", "Slide to see the difference"), text: tr("Rekaman mentah penuh dengung AC; setelah mixing bersih dan seimbang.", "Raw takes full of AC hum; after mixing, clean and balanced."), before: asset("v3c-wave-raw"), after: asset("v3c-wave-clean"), labels: [tr("Mentah", "Raw"), tr("Sesudah mix", "Mixed")], alt: tr("Gelombang suara sebelum dan sesudah", "Waveform before and after"), bullets: [tr("Noise reduction", "Noise reduction"), tr("EQ vokal", "Vocal EQ"), tr("Loudness -16 LUFS", "-16 LUFS loudness")] }),
        end,
      ]);
    if (key === "booking")
      return pageC(ss, [
        head,
        form(ss, { eyebrow: "Booking", title: tr("Pesan jam rekaman", "Book recording time"), info: [["WhatsApp", "+62 822 1400 7788"], [tr("DP", "Deposit"), "50%"]], fields: [{ kind: "input", label: tr("Nama / proyek", "Name / project"), ph: tr("Mis. Podcast Teman Pulang", "e.g. Teman Pulang Podcast") }, { kind: "select", label: tr("Ruang", "Room"), ph: tr("Pilih", "Choose"), options: [tr("Bilik A", "Booth A"), tr("Bilik B", "Booth B"), tr("Ruang mixing", "Mixing room")] }, { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" }], submit: tr("Kirim booking", "Send booking") }),
        steps(ss, { title: tr("Hari rekaman", "Recording day"), items: [[tr("Datang 15 menit lebih awal", "Arrive 15 minutes early"), tr("Cek suara & minum air hangat.", "Sound check & warm water.")], [tr("Rekam", "Record"), tr("Engineer memantau level.", "The engineer watches levels.")], [tr("Terima file", "Get your files"), tr("Link unduhan di hari yang sama.", "Download link the same day.")]] }),
        end,
      ]);
    return pageC(ss, [
      head,
      hero(ss, { kind: "retro", badge: tr("Bandung · sejak 2017", "Bandung · since 2017"), title: tr("Suaramu, sebersih aslinya", "Your voice, as clean as the real thing"), text: tr("Studio rekaman untuk podcast, voice over, dan audiobook. Datang bawa naskah, pulang bawa file siap tayang.", "A studio for podcasts, voice-overs and audiobooks. Bring a script, leave with ready-to-publish files."), acts: [[tr("Lihat tarif", "See rates"), href("rates")], [tr("Ruang studio", "Our rooms"), href("rooms"), "outline"]], image: asset("v3c-headphones"), alt: tr("Headphone", "Headphones") }),
      numbered(ss, { title: tr("Yang kami kerjakan", "What we do"), items: [[tr("Podcast audio & video", "Audio & video podcasts"), tr("Rekam, edit, mix, unggah.", "Record, edit, mix, publish.")], ["Voice over", tr("Iklan, e-learning, IVR.", "Ads, e-learning, phone menus.")], [tr("Audiobook", "Audiobooks"), tr("Narasi panjang dengan pengarah suara.", "Long-form narration with a voice director.")]] }),
      chips(ss, { title: tr("Dipercaya oleh", "Trusted by"), chips: ["Teman Pulang Podcast", "Sekolah Daring Pelangi", "Radio Kampus 98", "Penerbit Daun Lontar"] }),
      cta(ss, { kind: "split", title: tr("Slot akhir pekan cepat penuh", "Weekend slots fill fast"), acts: [[tr("Booking sekarang", "Book now"), href("booking"), "light"]] }),
      end,
    ]);
  },
};

/* ------------ 9. Streetwear (PREMIUM, 7 hlm) — brutalist asam -------- */

const GS: Palette = { ink: "#0a0a0a", muted: "#3f3f46", primary: "#18181b", primaryDark: "#000000", soft: "#ecfccb", line: "#a3e635" };
const gs = lookC(GS, { head: "Archivo Black", body: "Space Grotesk", skin: "brutal", radius: 0, bg: "#fafaf5", alt: "#ecfccb", dark: "#0a0a0a", fx: { aos: "slide-up", animate: "lightSpeedInRight", tilt: { max: 14, glare: true } }, btnR: 0, caps: true, accent2: "#a3e635" });

const gsFoot = (tr: Tr) =>
  ftr(gs, "Gang Kecil Supply", {
    kind: "giant",
    about: tr("Label streetwear dari gang sempit di Yogyakarta. Drop terbatas, dijahit lokal.", "A streetwear label from a narrow Yogyakarta alley. Limited drops, sewn locally."),
    cols: [{ title: "Shop", items: [tr("Drop terbaru", "Latest drop"), "Lookbook", "Stockist"] }, { title: tr("Bantuan", "Help"), items: [tr("Panduan ukuran", "Size guide"), tr("Retur 7 hari", "7-day returns")] }],
    copy: tr("© 2026 Gang Kecil Supply. Konten contoh.", "© 2026 Gang Kecil Supply. Sample content."),
    social: ["Instagram | https://instagram.com/gangkecil.supply", "TikTok | https://tiktok.com/@gangkecil", "YouTube | https://youtube.com/@gangkecil"],
    backTop: tr("Ke atas", "Top"),
  });

export const fashionStreetwear: TemplateContent = {
  brand: "Gang Kecil Supply",
  pages: [
    home(),
    pg("drop", ["drop", "Drop 07"], ["drop", "Drop 07"]),
    pg("shop", ["koleksi", "Koleksi"], ["shop", "Shop"]),
    pg("lookbook", ["lookbook", "Lookbook"], ["lookbook", "Lookbook"]),
    pg("story", ["cerita", "Cerita"], ["story", "Story"]),
    pg("stockist", ["stockist", "Stockist"], ["stockists", "Stockists"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const nav = mega(gs, [`Shop | ${href("shop")}`, `- ${tr("Kaos", "Tees")} | ${tr("Katun 24s heavyweight", "24s heavyweight cotton")} | ${href("shop")}`, `- Hoodie | ${tr("Fleece 330 gsm", "330 gsm fleece")} | ${href("shop")}`, `- ${tr("Aksesori", "Accessories")} | ${tr("Topi, tas, kaus kaki", "Caps, bags, socks")} | ${href("shop")}`, `Drop 07 | ${href("drop")}`, `Lookbook | ${href("lookbook")}`, `${tr("Cerita", "Story")} | ${href("story")}`], tr("Drop 07", "Drop 07"), href("drop"));
    const head = hdr(gs, "Gang Kecil", { kind: "bar", nav, strip: tr("Gratis ongkir Jawa–Bali untuk pembelian di atas Rp500rb", "Free Java–Bali shipping over Rp500k") });
    const end = gsFoot(tr);
    const items = [
      { image: asset("v3c-tee"), title: tr("Kaos Gang 01", "Gang Tee 01"), text: tr("Heavyweight, sablon plastisol", "Heavyweight, plastisol print"), price: "Rp249.000", badge: "Drop 07", cta: tr("Lihat", "View"), href: href("shop") },
      { image: asset("v3c-tee-acid"), title: tr("Hoodie Asam", "Acid Hoodie"), text: tr("Fleece 330 gsm, bordir", "330 gsm fleece, embroidered"), price: "Rp549.000", cta: tr("Lihat", "View"), href: href("shop") },
      { image: asset("v3c-tee"), title: tr("Kaos Peta Kampung", "Village Map Tee"), text: tr("Cetak peta gang Prawirotaman", "Printed alley map"), price: "Rp229.000", cta: tr("Lihat", "View"), href: href("shop") },
    ];
    if (key === "drop")
      return pageC(gs, [
        head,
        countdownBand(gs, { eyebrow: "Drop 07 / " + tr("Jumat 19.00", "Friday 7pm"), title: tr("Drop berikutnya dibuka dalam", "Next drop opens in"), text: tr("120 hoodie, 300 kaos. Tidak ada restock.", "120 hoodies, 300 tees. No restock."), target: "2026-11-20T19:00", finished: tr("Drop sudah dibuka!", "The drop is live!"), actions: [[tr("Ingatkan saya", "Remind me"), href("contact"), "light"]], bg: gs.dark }),
        hero(gs, { kind: "oversized", eyebrow: "Drop 07", title: tr("Asam Manis Gang", "Sour Sweet Alley"), text: tr("Warna hijau asam terinspirasi lampu neon warung tengah malam.", "Acid green inspired by midnight food-stall neon."), image: asset("v3c-tee-acid"), alt: "Drop 07" }),
        catalog(gs, { title: tr("Isi drop", "In the drop"), items }),
        end,
      ]);
    if (key === "shop")
      return pageC(gs, [
        head,
        banner(gs, { kind: "rule", eyebrow: "Shop", title: tr("Semua barang", "Everything"), text: tr("Stok terbatas per ukuran. Ukuran S–XXL.", "Limited stock per size. Sizes S–XXL.") }),
        catalog(gs, { title: tr("Tersedia sekarang", "In stock now"), items: [...items, { image: asset("v3c-tee-acid"), title: tr("Topi Lima Panel", "Five-Panel Cap"), text: tr("Nilon, tali kulit", "Nylon, leather strap"), price: "Rp189.000", cta: tr("Lihat", "View"), href: href("shop") }, { image: asset("v3c-tee"), title: tr("Tas Selempang", "Sling Bag"), text: tr("Cordura, 3 liter", "Cordura, 3 litres"), price: "Rp279.000", cta: tr("Lihat", "View"), href: href("shop") }, { image: asset("v3c-tee-acid"), title: tr("Kaus Kaki 3 Pasang", "Socks 3-Pack"), text: tr("Katun combed", "Combed cotton"), price: "Rp99.000", cta: tr("Lihat", "View"), href: href("shop") }] }),
        table(gs, { title: tr("Panduan ukuran", "Size guide"), columns: [tr("Ukuran", "Size"), tr("Lebar dada", "Chest"), tr("Panjang", "Length")], rows: [["S", "52 cm", "70 cm"], ["M", "55 cm", "72 cm"], ["L", "58 cm", "74 cm"], ["XL", "61 cm", "76 cm"]], name: tr("Ukuran", "Sizes") }),
        end,
      ]);
    if (key === "lookbook")
      return pageC(gs, [
        head,
        lightbox(gs, { title: tr("Lookbook Drop 07", "Drop 07 lookbook"), images: [[asset("v3c-tee-acid"), tr("Gang Prawirotaman, 23.40", "Prawirotaman alley, 11:40pm")], [asset("v3c-tee"), tr("Warung burjo", "Late-night stall")], [asset("v3c-tee-acid"), tr("Parkiran stasiun", "Station car park")], [asset("v3c-tee"), tr("Atap ruko", "Shophouse rooftop")]], cols: 2, ratio: "3 / 4" }),
        words(gs, ["Drop 07", tr("Asam", "Sour"), tr("Manis", "Sweet"), "Gang"], { bg: gs.p.line }),
        end,
      ]);
    if (key === "story")
      return pageC(gs, [
        head,
        split(gs, { eyebrow: tr("Sejak 2020", "Since 2020"), title: tr("Dari sablon manual di garasi", "From hand screen-printing in a garage"), paras: [tr("Tiga teman SMA mulai menyablon 24 kaos untuk band kampung. Sekarang kami bekerja dengan dua penjahit dan satu bengkel sablon di Bantul.", "Three school friends printed 24 tees for a local band. Now we work with two tailors and a print shop in Bantul.")], bullets: [tr("Dijahit di Yogyakarta", "Sewn in Yogyakarta"), tr("Upah layak, jam kerja jelas", "Fair pay, clear hours"), tr("Sisa kain jadi tas", "Offcuts become bags")], image: asset("v3c-tee"), alt: tr("Kaos", "Tee"), tone: "dark" }),
        bigNumbers(gs, [["07", "Drops"], ["4.200", tr("Kaos terjual", "Tees sold")], ["2", tr("Penjahit mitra", "Partner tailors")]], { bg: gs.p.line }),
        end,
      ]);
    if (key === "stockist")
      return pageC(gs, [
        head,
        banner(gs, { kind: "band", title: tr("Cari kami di toko", "Find us in stores") }),
        cardsC(gs, { title: "Stockist", items: [{ title: "Lantai Dua Store", text: "Jl. Kaliurang Km 5, Yogyakarta", meta: tr("Semua koleksi", "Full range") }, { title: "Ruang Ganti Collective", text: "Jl. Braga 51, Bandung", meta: tr("Kaos & topi", "Tees & caps") }, { title: "Pojok Pasar Lokal", text: "Jl. Tunjungan 30, Surabaya", meta: tr("Drop terbatas", "Limited drops") }] }),
        end,
      ]);
    if (key === "contact")
      return pageC(gs, [
        head,
        form(gs, { title: tr("Hubungi Gang Kecil", "Get in touch"), info: [["Email", "halo@gangkecil.id"], ["Wholesale", "toko@gangkecil.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "input", label: "Email", ph: "email@contoh.id", type: "email" }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
        faq(gs, { title: tr("Pengiriman & retur", "Shipping & returns"), items: [[tr("Berapa lama kirim?", "Shipping time?"), tr("2–4 hari kerja Jawa–Bali.", "2–4 working days in Java–Bali.")], [tr("Bisa tukar ukuran?", "Size exchanges?"), tr("Bisa, 7 hari sejak diterima.", "Yes, within 7 days of delivery.")]] }),
        end,
      ]);
    return pageC(gs, [
      head,
      hero(gs, { kind: "brutal", badge: tr("Drop 07 · Jumat", "Drop 07 · Friday"), eyebrow: tr("Yogyakarta streetwear", "Yogyakarta streetwear"), title: tr("Dari gang sempit, untuk jalan besar", "From narrow alleys to wide streets"), text: tr("Kaos heavyweight dan hoodie edisi terbatas, dijahit lokal. Sekali habis, tidak dicetak ulang.", "Limited heavyweight tees and hoodies, sewn locally. Once gone, never reprinted."), acts: [[tr("Lihat drop", "See the drop"), href("drop")], [tr("Shop", "Shop"), href("shop"), "outline"]], image: asset("v3c-tee-acid"), alt: tr("Hoodie hijau asam", "Acid green hoodie") }),
      marquee(gs, { title: "", items: ["DROP 07", tr("TANPA RESTOCK", "NO RESTOCK"), tr("DIJAHIT LOKAL", "SEWN LOCALLY"), "S–XXL", tr("JUMAT 19.00", "FRIDAY 7PM")], bg: gs.p.line }),
      catalog(gs, { eyebrow: tr("Terbaru", "Newest"), title: tr("Masih ada stok", "Still in stock"), items }),
      cta(gs, { kind: "giant", title: tr("Jangan sampai kehabisan", "Don't miss out"), acts: [[tr("Ingatkan saya", "Remind me"), href("drop"), "light"]], bg: gs.dark }),
      end,
    ]);
  },
};

/* --------- 10. Batik Nusantara (PREMIUM, 8 hlm) — editorial wastra ---- */

const WL: Palette = { ink: "#3b1d0c", muted: "#7c5a42", primary: "#92400e", primaryDark: "#78350f", soft: "#fef3c7", line: "#e7c58f" };
const wl = lookC(WL, { head: "Cormorant Garamond", body: "Montserrat", skin: "editorial", radius: 2, bg: "#fffaf0", alt: "#f6ead3", dark: "#2a160a", fx: { aos: "fade", tilt: { max: 5 } }, btnR: 2, onDark: "#e7c58f", accent2: "#1e3a8a" });

const wlFoot = (tr: Tr) =>
  ftr(wl, "Wastra Laras", {
    kind: "columns",
    about: tr("Batik tulis dan cap dari 40 pengrajin di Pekalongan, Lasem, dan Solo. Setiap kain bertanda tangan pembuatnya.", "Hand-drawn and stamped batik from 40 artisans in Pekalongan, Lasem and Solo. Every cloth signed by its maker."),
    cols: [{ title: tr("Galeri", "Gallery"), items: ["Jl. Slamet Riyadi 210, Solo", tr("Sel–Min 10.00–18.00", "Tue–Sun 10am–6pm")] }, { title: tr("Layanan", "Services"), items: [tr("Pesanan seragam", "Uniform orders"), tr("Perawatan kain", "Cloth care")] }],
    copy: tr("© 2026 Wastra Laras. Konten contoh.", "© 2026 Wastra Laras. Sample content."),
    social: ["Instagram | https://instagram.com/wastralaras", "Pinterest | https://pinterest.com/wastralaras"],
  });

export const fashionBatikNusantara: TemplateContent = {
  brand: "Wastra Laras",
  pages: [
    home(),
    pg("collection", ["koleksi", "Koleksi"], ["collection", "Collection"]),
    pg("motifs", ["motif", "Kamus Motif"], ["motifs", "Motif Guide"]),
    pg("craft", ["proses", "Proses"], ["craft", "The Craft"]),
    pg("artisans", ["pengrajin", "Pengrajin"], ["artisans", "Artisans"]),
    pg("lookbook", ["lookbook", "Lookbook"], ["lookbook", "Lookbook"]),
    pg("journal", ["jurnal", "Jurnal"], ["journal", "Journal"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(wl, "Wastra Laras", { kind: "stack" });
    const end = wlFoot(tr);
    if (key === "collection")
      return pageC(wl, [
        head,
        banner(wl, { kind: "rule", eyebrow: tr("Koleksi 2026", "2026 collection"), title: tr("Kain, kemeja, dan selendang", "Cloths, shirts and shawls"), text: tr("Harga sudah termasuk kartu keaslian bertanda tangan pengrajin.", "Prices include a certificate signed by the artisan.") }),
        catalog(wl, { title: tr("Pilihan kurator", "Curator's picks"), items: [{ image: asset("v3c-batik"), title: tr("Kain Kawung Sogan", "Sogan Kawung Cloth"), text: tr("Tulis, 2,5 m, pewarna alam", "Hand-drawn, 2.5 m, natural dye"), price: "Rp2.400.000", badge: tr("Tulis", "Hand-drawn"), cta: tr("Tanya", "Enquire"), href: href("contact") }, { image: asset("v3c-batik-indigo"), title: tr("Kemeja Lasem Indigo", "Lasem Indigo Shirt"), text: tr("Cap kombinasi tulis", "Stamped & hand-drawn"), price: "Rp890.000", cta: tr("Tanya", "Enquire"), href: href("contact") }, { image: asset("v3c-batik"), title: tr("Selendang Parang", "Parang Shawl"), text: tr("Sutra, 2 m", "Silk, 2 m"), price: "Rp1.150.000", cta: tr("Tanya", "Enquire"), href: href("contact") }] }),
        tabs(wl, { title: tr("Jenis batik", "Types of batik"), tabs: [[tr("Tulis", "Hand-drawn"), tr("Dilukis dengan canting, 1–3 bulan per kain.", "Drawn with a canting, 1–3 months per cloth.")], ["Cap", tr("Dicap dengan stempel tembaga, lebih cepat dan terjangkau.", "Stamped with copper blocks, faster and more affordable.")], [tr("Kombinasi", "Combination"), tr("Pola cap, isen-isen ditulis tangan.", "Stamped pattern, hand-drawn infill.")]], variant: "underline" }),
        end,
      ]);
    if (key === "motifs")
      return pageC(wl, [
        head,
        banner(wl, { kind: "center", eyebrow: tr("Kamus motif", "Motif guide"), title: tr("Setiap motif punya cerita", "Every motif tells a story") }),
        numbered(wl, { title: tr("Motif klasik", "Classic motifs"), items: [["Kawung", tr("Empat bulatan seperti buah aren; lambang kesucian hati.", "Four ovals like palm fruit; a sign of a pure heart.")], ["Parang", tr("Garis miring seperti ombak; semangat yang tak putus.", "Diagonal waves; an unbroken spirit.")], ["Truntum", tr("Bunga kecil di malam hari; cinta yang tumbuh kembali.", "Tiny night blossoms; love that grows again.")], ["Lasem Latohan", tr("Rumput laut merah; jejak budaya pesisir.", "Red seaweed; a trace of coastal culture.")]] }),
        strip(wl, { images: [[asset("v3c-batik"), "Kawung"], [asset("v3c-batik-indigo"), "Parang"], [asset("v3c-batik"), "Truntum"]] }),
        end,
      ]);
    if (key === "craft")
      return pageC(wl, [
        head,
        hero(wl, { kind: "split", eyebrow: tr("Proses", "The craft"), title: tr("Tiga bulan untuk satu kain", "Three months for one cloth"), text: tr("Dari mori putih sampai lorodan terakhir, setiap tahap dikerjakan tangan.", "From plain cotton to the final wax removal, every step is done by hand."), image: asset("v3c-batik"), alt: tr("Kain batik", "Batik cloth") }),
        timelineC(wl, { title: tr("Tahap pembuatan", "Making steps"), items: [tr("Minggu 1 | Nyorek | Pola digambar pensil di atas mori.", "Week 1 | Sketching | The pattern is pencilled onto cotton."), tr("Minggu 2–6 | Nyanting | Malam panas digoreskan dengan canting.", "Weeks 2–6 | Waxing | Hot wax drawn with a canting."), tr("Minggu 7–9 | Mewarna | Celup pewarna alam berulang.", "Weeks 7–9 | Dyeing | Repeated natural dye baths."), tr("Minggu 10 | Nglorod | Malam dilepas dengan air mendidih.", "Week 10 | Wax removal | Wax boiled away.")] }),
        end,
      ]);
    if (key === "artisans")
      return pageC(wl, [
        head,
        people(wl, { eyebrow: tr("40 pengrajin", "40 artisans"), title: tr("Tangan di balik kain", "The hands behind the cloth"), items: [{ name: "Ibu Sri Rahayu", role: "Pekalongan", photo: asset("v3c-face-2"), text: tr("Membatik sejak 1981.", "Making batik since 1981.") }, { name: "Pak Tjahjo Santoso", role: "Lasem", photo: asset("v3c-face-1"), text: tr("Ahli warna merah getih pitik.", "Master of Lasem red.") }, { name: "Ibu Warsini", role: "Solo", photo: asset("v3c-face-4"), text: tr("Spesialis motif keraton.", "Specialist in court motifs.") }] }),
        testimonialsWall(wl, tr, { eyebrow: tr("Kolektor", "Collectors"), title: tr("Dari tangan ke lemari Anda", "From their hands to your wardrobe"), score: 4.9, caption: tr("dari 860 ulasan", "from 860 reviews"), quotes: [{ text: tr("Kainnya datang dengan surat tulisan tangan pembatiknya. Menyentuh sekali.", "The cloth arrived with a handwritten note from the artisan. So touching."), name: "Larasati W.", role: tr("Kolektor, Jakarta", "Collector, Jakarta"), avatar: asset("v3c-face-4") }, { text: tr("Seragam kantor kami jadi bahan obrolan klien.", "Our office uniforms became a client talking point."), name: "Hendra G.", role: tr("Direktur, Semarang", "Director, Semarang"), avatar: asset("v3c-face-3") }, { text: tr("Warna indigonya makin cantik setelah dicuci.", "The indigo gets lovelier with every wash."), name: "Maya R.", role: tr("Pelanggan, Bali", "Customer, Bali"), avatar: asset("v3c-face-2") }] }),
        end,
      ]);
    if (key === "lookbook")
      return pageC(wl, [
        head,
        slider(wl, { slides: [{ title: tr("Sogan untuk akad", "Sogan for the ceremony"), text: tr("Kawung & truntum dalam cokelat hangat", "Kawung & truntum in warm browns"), bg: wl.p.primaryDark }, { title: tr("Indigo untuk kantor", "Indigo for the office"), text: tr("Kemeja Lasem yang tenang", "Calm Lasem shirts"), bg: "#1e3a8a" }, { title: tr("Pesisir untuk liburan", "Coastal for holidays"), text: tr("Warna cerah Pekalongan", "Bright Pekalongan colours"), bg: "#b45309" }], height: 380 }),
        lightbox(wl, { title: tr("Foto koleksi", "Collection photos"), images: [[asset("v3c-batik"), "Sogan"], [asset("v3c-batik-indigo"), "Indigo"], [asset("v3c-batik"), tr("Pesisir", "Coastal")]], cols: 3, ratio: "3 / 4" }),
        end,
      ]);
    if (key === "journal")
      return pageC(wl, [
        head,
        journal(wl, { eyebrow: tr("Jurnal", "Journal"), title: tr("Catatan dari bengkel batik", "Notes from the batik workshop"), read: tr("Baca", "Read"), href: href("journal"), items: [{ image: asset("v3c-batik"), tag: tr("Perawatan", "Care"), date: "Okt 2026", title: tr("Cara mencuci batik tulis", "How to wash hand-drawn batik"), text: tr("Lerak, air dingin, dan jangan diperas.", "Soapberry, cold water, never wring.") }, { image: asset("v3c-batik-indigo"), tag: tr("Sejarah", "History"), date: "Sep 2026", title: tr("Merah Lasem dan jalur dagang", "Lasem red and the trade routes"), text: tr("Warna yang lahir dari pertemuan budaya.", "A colour born from meeting cultures.") }, { image: asset("v3c-batik"), tag: tr("Pengrajin", "Artisans"), date: "Agu 2026", title: tr("Sehari bersama Ibu Sri", "A day with Ibu Sri"), text: tr("Canting, kopi, dan sabar.", "Canting, coffee and patience.") }] }),
        newsletter(wl, { title: tr("Surat bulanan", "Monthly letter"), text: tr("Koleksi baru dan kisah pengrajin, sebulan sekali.", "New pieces and artisan stories, once a month."), ph: "email@contoh.id", submit: tr("Daftar", "Subscribe") }),
        end,
      ]);
    if (key === "contact")
      return pageC(wl, [
        head,
        infoTiles(wl, [[tr("Galeri", "Gallery"), "Jl. Slamet Riyadi 210, Solo"], ["WhatsApp", "+62 271 640 330"], [tr("Seragam", "Uniforms"), tr("Min. 30 potong", "Min. 30 pieces")]]),
        form(wl, { title: tr("Tanya kain atau pesanan seragam", "Ask about cloth or uniform orders"), info: [["Email", "halo@wastralaras.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "select", label: tr("Keperluan", "Purpose"), ph: tr("Pilih", "Choose"), options: [tr("Beli kain", "Buy cloth"), tr("Seragam", "Uniforms"), tr("Kolaborasi", "Collaboration")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
        end,
      ]);
    return pageC(wl, [
      head,
      hero(wl, { kind: "editorial", meta: ["Wastra Laras", tr("Edisi Musim Hujan 2026", "Rainy Season 2026")], title: tr("Kain yang ditulis, bukan dicetak", "Cloth that is written, not printed"), text: tr("Batik tulis dan cap dari 40 pengrajin. Setiap kain datang dengan nama dan cerita pembuatnya.", "Hand-drawn and stamped batik from 40 artisans. Every cloth arrives with its maker's name and story."), acts: [[tr("Lihat koleksi", "See the collection"), href("collection")], [tr("Kenali pengrajin", "Meet the artisans"), href("artisans"), "outline"]], image: asset("v3c-batik"), alt: tr("Batik kawung", "Kawung batik") }),
      slider(wl, { slides: [{ title: tr("Koleksi Sogan", "Sogan collection"), text: tr("Cokelat soga dari kulit kayu", "Brown dye from tree bark"), bg: wl.p.primaryDark }, { title: tr("Indigo Lasem", "Lasem indigo"), text: tr("Biru yang menua dengan indah", "A blue that ages beautifully"), bg: "#1e3a8a" }], height: 300 }),
      split(wl, { eyebrow: tr("Pengrajin", "Artisans"), title: tr("Kami membeli di harga pembuat", "We buy at the maker's price"), paras: [tr("Pengrajin menentukan harga kainnya sendiri; kami menambah ongkos galeri secara terbuka.", "Artisans set their own price; we add a transparent gallery margin.")], image: asset("v3c-batik-indigo"), alt: tr("Batik indigo", "Indigo batik"), tone: "soft", reverse: true, acts: [[tr("Proses kami", "Our process"), href("craft")]] }),
      cta(wl, { kind: "split", title: tr("Kunjungi galeri di Solo", "Visit our Solo gallery"), acts: [[tr("Kontak", "Contact"), href("contact"), "light"]] }),
      end,
    ]);
  },
};
