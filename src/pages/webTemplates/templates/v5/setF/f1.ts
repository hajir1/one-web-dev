import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, Tr } from "../../../types";
import { statsBand, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import {
  backTop,
  bento,
  cardsD,
  compareD,
  countdownD,
  ctaD,
  faqD,
  footerD,
  formD,
  fullHeader,
  fullImage,
  fullSplit,
  galleryLb,
  headerD,
  home,
  locations,
  lookD,
  megaD,
  numbers,
  offer,
  pageHead,
  pg,
  plansD,
  pro,
  rail,
  render,
  sliderD,
  specialty,
  specs,
  tableD,
  timelineD,
  typerD,
  withFx,
  zigzag,
} from "./kitF";

/* ================================================================== */
/* Template v5 F1–F4: Katering (Free), Resor, Rental mobil, Studio yoga. */
/* Setiap template memakai section Lebar Penuh & Spesialisasi.          */
/* ================================================================== */

/* ------------- 1. Dapur Rasa Katering — catering (FREE, 4 hlm) ------------- */
// Hanya elemen & preset gratis; library: AOS.

const DP: Palette = { ink: "#3b1d0e", muted: "#7c5a45", primary: "#c2410c", primaryDark: "#9a3412", soft: "#ffedd5", line: "#fed7aa" };
const D = lookD(DP, { head: "Fraunces", body: "Rubik", shape: "soft", radius: 18, bg: "#fffbf5", alt: "#fff1e2", inv: "#3b1d0e", fx: { aos: "fade-up" } });

const dFoot = (tr: Tr) =>
  footerD("Dapur Rasa Katering", D, {
    variant: "columns",
    about: tr("Katering rumahan untuk kantor, arisan, dan hajatan. Dimasak pagi, diantar hangat.", "Home-style catering for offices, gatherings and celebrations. Cooked in the morning, delivered warm."),
    cols: [
      { title: tr("Menu", "Menu"), items: [tr("Nasi kotak", "Rice boxes"), tr("Prasmanan", "Buffet"), tr("Tumpeng", "Tumpeng")] },
      { title: tr("Kontak", "Contact"), items: ["0813 4455 1200", "pesan@dapurrasa.id", "Jl. Melati 21, Yogyakarta"] },
    ],
    social: ["Instagram | https://instagram.com/dapurrasa.katering", "WhatsApp | https://wa.me/6281344551200"],
    copy: tr("© 2026 Dapur Rasa Katering. Konten contoh.", "© 2026 Dapur Rasa Katering. Sample content."),
  });

export const cateringDapurRasa: TemplateContent = {
  brand: "Dapur Rasa Katering",
  pages: [home(), pg("menu", ["menu", "Menu"], ["menu", "Menu"]), pg("packages", ["paket", "Paket"], ["packages", "Packages"]), pg("order", ["pesan", "Pesan"], ["order", "Order"])],
  build: (key, tr, href) =>
    render(D, key, headerD("Dapur Rasa", D, { variant: "bar", cta: [tr("Pesan sekarang", "Order now"), href("order")] }), dFoot(tr), {
      home: () => [
        fullHeader(D, {
          eyebrow: tr("Katering rumahan · Yogyakarta", "Home-style catering · Yogyakarta"),
          title: tr("Masakan rumah untuk setiap acara Anda", "Home cooking for every occasion"),
          text: tr("Nasi kotak, prasmanan, dan tumpeng dari dapur kami. Minimal 20 porsi, gratis antar dalam kota.", "Rice boxes, buffets and tumpeng from our kitchen. From 20 portions, free delivery in town."),
          image: asset("v5f-catering"),
          actions: [[tr("Lihat menu", "See the menu"), href("menu"), "light"], [tr("Hitung pesanan", "Plan an order"), href("order"), "dark"]],
        }),
        specialty(D, {
          side: { title: tr("Pesan hari ini", "Order today"), text: tr("Pesanan masuk sebelum 15.00 bisa diantar besok pagi.", "Orders before 3pm can be delivered tomorrow morning."), items: [tr("Minimal 20 porsi", "From 20 portions"), tr("Gratis antar dalam kota", "Free delivery in town"), tr("Bayar setelah cicip", "Pay after tasting")], action: [tr("Pesan via formulir", "Order via form"), href("order")] },
          eyebrow: tr("Kenapa kami", "Why us"),
          title: tr("Rasa rumahan, takaran pas, datang tepat waktu", "Home taste, right portions, on time"),
          text: tr("Dimasak juru masak yang sama sejak 2012, dengan bumbu yang diulek sendiri.", "Cooked by the same chefs since 2012, with spices ground by hand."),
          items: [
            { icon: "🍲", title: tr("Masak pagi", "Cooked fresh"), text: tr("Semua lauk dimasak di hari pengiriman.", "Every dish is cooked on delivery day.") },
            { icon: "🥗", title: tr("Menu seimbang", "Balanced menus"), text: tr("Selalu ada sayur, protein, dan buah.", "Always with vegetables, protein and fruit.") },
            { icon: "⏱", title: tr("Tepat waktu", "On time"), text: tr("Diantar 30 menit sebelum jam makan.", "Delivered 30 minutes before mealtime.") },
            { icon: "♻", title: tr("Kemasan ramah", "Eco packaging"), text: tr("Kotak kertas & besek bambu.", "Paper boxes & bamboo baskets.") },
          ],
          image: { src: asset("v5f-catering-green"), alt: tr("Hidangan prasmanan", "Buffet dishes") },
        }),
        numbers(D, { items: [["12", tr("Tahun memasak", "Years cooking")], ["1.200+", tr("Acara dilayani", "Events served")], ["40", tr("Pilihan lauk", "Dish choices")], ["4,9", tr("Rating pelanggan", "Customer rating")]] }),
        ctaD(D, { title: tr("Cicip gratis untuk pesanan pertama", "Free tasting for first orders"), text: tr("Untuk pesanan di atas 100 porsi.", "For orders above 100 portions."), actions: [[tr("Atur jadwal cicip", "Book a tasting"), href("order")]], tone: "primary" }),
      ],
      menu: () => [
        pageHead(D, { eyebrow: tr("Menu", "Menu"), title: tr("Pilih lauk favorit Anda", "Pick your favourite dishes"), text: tr("Menu berganti setiap minggu, menu klasik selalu ada.", "The menu changes weekly; the classics are always on.") }),
        cardsD(D, {
          title: tr("Menu klasik", "Classic menu"),
          items: [
            { icon: "🍗", title: tr("Ayam bakar madu", "Honey grilled chicken"), text: tr("Dibakar arang, bumbu kecap madu.", "Charcoal-grilled with honey soy glaze."), meta: "Rp18.000" },
            { icon: "🐟", title: tr("Ikan dabu-dabu", "Fish with dabu-dabu"), text: tr("Ikan kakap goreng, sambal tomat segar.", "Fried snapper, fresh tomato salsa."), meta: "Rp20.000" },
            { icon: "🥘", title: tr("Rendang daging", "Beef rendang"), text: tr("Dimasak 6 jam hingga kering.", "Slow-cooked for six hours."), meta: "Rp24.000" },
            { icon: "🥬", title: tr("Sayur lodeh", "Vegetable lodeh"), text: tr("Kuah santan, labu, dan kacang panjang.", "Coconut broth, squash and long beans."), meta: "Rp8.000" },
            { icon: "🍳", title: tr("Telur balado", "Balado eggs"), text: tr("Sambal merah manis pedas.", "Sweet and spicy red chili."), meta: "Rp7.000" },
            { icon: "🍌", title: tr("Pisang & buah", "Banana & fruit"), text: tr("Buah musiman sebagai penutup.", "Seasonal fruit for dessert."), meta: "Rp4.000" },
          ],
        }),
        fullImage(D, { image: asset("v5f-catering-green"), alt: tr("Meja prasmanan", "Buffet table"), caption: tr("Prasmanan untuk 150 tamu di Sleman, Mei 2026.", "A buffet for 150 guests in Sleman, May 2026.") }),
      ],
      packages: () => [
        pageHead(D, { eyebrow: tr("Paket", "Packages"), title: tr("Paket siap pesan", "Ready-to-order packages") }),
        tableD(D, {
          title: tr("Daftar paket", "Package list"),
          columns: [tr("Paket", "Package"), tr("Isi", "Contents"), tr("Harga/porsi", "Price/portion")],
          rows: [
            [tr("Nasi kotak hemat", "Budget rice box"), tr("Nasi, 1 lauk, sayur, sambal", "Rice, 1 main, veg, chili"), "Rp22.000"],
            [tr("Nasi kotak spesial", "Special rice box"), tr("Nasi, 2 lauk, sayur, buah, air", "Rice, 2 mains, veg, fruit, water"), "Rp35.000"],
            [tr("Prasmanan", "Buffet"), tr("6 menu + pondokan + alat saji", "6 dishes + stall + serving ware"), "Rp55.000"],
            [tr("Tumpeng mini", "Mini tumpeng"), tr("Untuk 1 orang, 7 lauk", "For one, 7 sides"), "Rp45.000"],
          ],
          note: tr("Harga contoh. Minimal 20 porsi.", "Sample prices. Minimum 20 portions."),
        }),
        faqD(D, {
          title: tr("Pertanyaan umum", "Common questions"),
          items: [
            [tr("Bisa pesan untuk besok?", "Can I order for tomorrow?"), tr("Bisa, bila pesanan masuk sebelum 15.00.", "Yes, if the order arrives before 3pm.")],
            [tr("Ada menu vegetarian?", "Vegetarian options?"), tr("Ada, tandai saat memesan.", "Yes, just mention it when ordering.")],
            [tr("Bagaimana pembayaran?", "How do I pay?"), tr("DP 30%, pelunasan setelah acara.", "30% deposit, the rest after the event.")],
          ],
        }),
      ],
      order: () => [
        pageHead(D, { eyebrow: tr("Pesan", "Order"), title: tr("Ceritakan acara Anda", "Tell us about your event") }),
        formD(D, {
          title: tr("Formulir pesanan", "Order form"),
          info: [["WhatsApp", "0813 4455 1200"], [tr("Jam pesan", "Order hours"), "07.00–20.00"], [tr("Dapur", "Kitchen"), "Jl. Melati 21, Yogyakarta"]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama pemesan", "Your name") },
            { kind: "date", label: tr("Tanggal acara", "Event date") },
            { kind: "select", label: tr("Paket", "Package"), ph: tr("Pilih paket", "Choose a package"), options: [tr("Nasi kotak hemat", "Budget rice box"), tr("Nasi kotak spesial", "Special rice box"), tr("Prasmanan", "Buffet"), tr("Tumpeng mini", "Mini tumpeng")] },
            { kind: "input", label: tr("Jumlah porsi", "Portions"), ph: "50", type: "number" },
          ],
          submit: tr("Kirim pesanan", "Send order"),
        }),
        locations(D, { title: tr("Area antar", "Delivery area"), image: asset("v5f-catering"), places: [[tr("Kota Yogyakarta", "Yogyakarta city"), tr("Gratis antar", "Free delivery"), tr("Setiap hari", "Daily")], ["Sleman & Bantul", tr("Ongkir Rp25.000", "Rp25,000 delivery"), tr("Min. 50 porsi", "Min. 50 portions")]] }),
      ],
    }),
};

/* ------------- 2. Teras Senja Resort — hotel (6 hlm, Premium) ------------- */
// Premium: mega-menu, slider, gallery-lightbox, testimonials-wall, offer modal, back-to-top. Library: AOS + Animate.

const SP: Palette = { ink: "#2a1a12", muted: "#6b5446", primary: "#b45309", primaryDark: "#7c2d12", soft: "#fef3c7", line: "#fcd34d" };
const S = lookD(SP, { head: "Cormorant Garamond", body: "Nunito", shape: "editorial", radius: 4, bg: "#fffdf8", alt: "#fbf3e4", inv: "#2a1a12", fx: { aos: "fade-up", animate: "fadeInUp" } });

const sHead = (tr: Tr, href: (k: string) => string) =>
  headerD("Teras Senja", S, { variant: "center", sticky: true, nav: megaD(S, [tr("Kamar", "Rooms"), tr("Santap", "Dining"), tr("Pengalaman", "Experiences"), tr("Galeri", "Gallery")], tr("Pesan kamar", "Book a room"), href("book")) });
const sFoot = (tr: Tr) =>
  footerD("Teras Senja Resort", S, {
    variant: "giant",
    about: tr("Resor 24 vila di tebing pantai selatan Lombok, menghadap matahari terbenam.", "A 24-villa resort on Lombok's south-coast cliffs, facing the sunset."),
    cols: [{ title: tr("Kunjungi", "Visit"), items: ["Tanjung Aan, Lombok Tengah", "+62 370 555 0188", "stay@terassenja.id"] }],
    social: ["Instagram | https://instagram.com/terassenja", "TripAdvisor | https://tripadvisor.com"],
    copy: tr("© 2026 Teras Senja Resort. Konten contoh.", "© 2026 Teras Senja Resort. Sample content."),
    extra: [backTop(S, tr("Ke atas", "Back to top"))],
  });

export const hotelTerasSenja: TemplateContent = {
  brand: "Teras Senja Resort",
  pages: [
    home(),
    pg("rooms", ["kamar", "Kamar"], ["rooms", "Rooms"]),
    pg("dining", ["santap", "Santap"], ["dining", "Dining"]),
    pg("experiences", ["pengalaman", "Pengalaman"], ["experiences", "Experiences"]),
    pg("gallery", ["galeri", "Galeri"], ["gallery", "Gallery"]),
    pg("book", ["pesan", "Pesan"], ["book", "Book"]),
  ],
  build: (key, tr, href) =>
    render(S, key, sHead(tr, href), sFoot(tr), {
      home: () => [
        fullHeader(S, {
          eyebrow: tr("Lombok · sejak 2018", "Lombok · since 2018"),
          title: tr("Setiap senja punya terasnya sendiri", "Every sunset has its own terrace"),
          text: tr("24 vila dengan kolam pribadi di atas tebing, lima menit berjalan ke pantai berpasir merica.", "24 villas with private pools on the cliff, five minutes' walk to a peppercorn-sand beach."),
          image: asset("v5f-resort"),
          size: 72,
          actions: [[tr("Lihat vila", "See villas"), href("rooms"), "light"]],
        }),
        sliderD(S, {
          slides: [
            { title: tr("Vila Tebing", "Cliff Villa"), text: tr("Kolam infinity menghadap barat.", "An infinity pool facing west."), bg: "#7c2d12" },
            { title: tr("Vila Taman", "Garden Villa"), text: tr("Dikelilingi kamboja dan pandan.", "Surrounded by frangipani and pandan."), bg: "#365314" },
            { title: tr("Rumah Keluarga", "Family House"), text: tr("Tiga kamar untuk enam tamu.", "Three bedrooms for six guests."), bg: "#1e3a8a" },
          ],
          height: 340,
        }),
        specialty(S, {
          side: { title: tr("Termasuk di setiap menginap", "Included with every stay"), items: [tr("Sarapan di vila", "Breakfast in your villa"), tr("Antar-jemput bandara", "Airport transfers"), tr("Yoga pagi", "Morning yoga"), tr("Sepeda", "Bicycles")], action: [tr("Cek tanggal", "Check dates"), href("book")], inv: true },
          eyebrow: tr("Resor", "The resort"),
          title: tr("Tenang, dekat laut, jauh dari keramaian", "Quiet, by the sea, away from the crowds"),
          items: [
            { icon: "🌅", title: tr("Teras senja", "Sunset terrace"), text: tr("Koktail gratis pukul 17.30 setiap hari.", "Complimentary cocktails at 5.30pm daily.") },
            { icon: "🏊", title: tr("Kolam pribadi", "Private pools"), text: tr("Setiap vila punya kolam sendiri.", "Every villa has its own pool.") },
            { icon: "🧘", title: tr("Spa tebing", "Cliff spa"), text: tr("Pijat Sasak dengan minyak kelapa.", "Sasak massage with coconut oil.") },
            { icon: "🚤", title: tr("Pantai tersembunyi", "Hidden beaches"), text: tr("Perahu ke tiga pantai sepi.", "Boat trips to three quiet beaches.") },
          ],
          ratio: "1/3",
        }),
        withFx(S, testimonialsWall(pro(S), tr, { title: tr("Kata tamu kami", "What guests say"), score: 4.9, caption: tr("dari 860 ulasan", "from 860 reviews"), quotes: [{ text: tr("Matahari terbenam dari kolam vila tidak akan kami lupakan.", "The sunset from our villa pool is unforgettable."), name: "Clara & Ben", role: tr("Bulan madu", "Honeymoon"), avatar: asset("v4e-face-2") }, { text: tr("Staf mengingat nama anak-anak kami sejak hari pertama.", "Staff remembered our kids' names from day one."), name: "Hendra W.", role: tr("Liburan keluarga", "Family holiday"), avatar: asset("v4e-face-1") }, { text: tr("Sarapan di teras setiap pagi, sempurna.", "Breakfast on the terrace every morning, perfect."), name: "Mai T.", role: tr("Pelancong solo", "Solo traveller"), avatar: asset("v4e-face-4") }] })),
      ],
      rooms: () => [
        pageHead(S, { eyebrow: tr("Kamar", "Rooms"), title: tr("Tiga jenis vila", "Three kinds of villa") }),
        zigzag(S, {
          title: tr("Pilih vila Anda", "Choose your villa"),
          steps: [
            [tr("Vila Tebing · Rp4,2 jt/malam", "Cliff Villa · Rp4.2m/night"), tr("90 m², kolam infinity, teras matahari terbenam.", "90 m², infinity pool, sunset terrace."), asset("v5f-resort")],
            [tr("Vila Taman · Rp3,1 jt/malam", "Garden Villa · Rp3.1m/night"), tr("75 m², kamar mandi terbuka, taman tropis.", "75 m², open-air bathroom, tropical garden."), asset("v5f-resort-night")],
            [tr("Rumah Keluarga · Rp6,8 jt/malam", "Family House · Rp6.8m/night"), tr("3 kamar tidur, dapur kecil, kolam 12 m.", "3 bedrooms, kitchenette, 12 m pool."), asset("v5f-resort")],
          ],
        }),
        compareD(S, { title: tr("Bandingkan vila", "Compare villas"), columns: [tr("Fasilitas", "Feature"), tr("Taman", "Garden"), tr("Tebing", "Cliff"), tr("Keluarga", "Family")], rows: [tr("Kolam pribadi | ✓ | ✓ | ✓", "Private pool | ✓ | ✓ | ✓"), tr("Pemandangan laut | — | ✓ | ✓", "Sea view | — | ✓ | ✓"), tr("Kamar tidur | 1 | 1 | 3", "Bedrooms | 1 | 1 | 3"), tr("Dapur | — | — | ✓", "Kitchen | — | — | ✓")], highlight: 2, caption: tr("Semua vila termasuk sarapan.", "All villas include breakfast.") }),
      ],
      dining: () => [
        pageHead(S, { eyebrow: tr("Santap", "Dining"), title: tr("Dapur laut & kebun", "A sea-and-garden kitchen") }),
        fullSplit(S, { title: tr("Restoran Senja", "Senja Restaurant"), text: tr("Ikan dari nelayan Tanjung Aan, sayur dari kebun resor.", "Fish from Tanjung Aan fishermen, vegetables from the resort garden."), bullets: [tr("Sarapan 07.00–11.00", "Breakfast 7–11am"), tr("Makan malam 18.00–22.00", "Dinner 6–10pm"), tr("Kelas masak Sasak", "Sasak cooking class")], image: asset("v5f-resort-night"), alt: tr("Restoran tepi tebing", "Cliffside restaurant") }),
        offer(S, { eyebrow: tr("Paket romantis", "Romance package"), title: tr("Makan malam di pantai", "Dinner on the beach"), text: tr("Meja untuk dua di pasir, lima hidangan, dan lilin.", "A table for two on the sand, five courses and candles."), trigger: tr("Lihat detail", "See details"), modalTitle: tr("Makan malam pantai", "Beach dinner"), body: tr("Rp1,8 jt untuk dua orang. Pesan minimal sehari sebelumnya.", "Rp1.8m for two. Book at least a day ahead."), cta: tr("Pesan", "Book"), href: href("book") }),
      ],
      experiences: () => [
        pageHead(S, { eyebrow: tr("Pengalaman", "Experiences"), title: tr("Hari-hari yang tidak terburu-buru", "Unhurried days") }),
        timelineD(S, { title: tr("Satu hari di Teras Senja", "A day at Teras Senja"), items: [["06.30", tr("Yoga pagi", "Morning yoga"), tr("Di paviliun kayu di atas tebing.", "In the wooden pavilion on the cliff.")], ["10.00", tr("Perahu ke pantai", "Boat to the beach"), tr("Snorkeling di Gili Kedis.", "Snorkelling at Gili Kedis.")], ["15.00", tr("Kelas tenun", "Weaving class"), tr("Bersama penenun Sukarara.", "With Sukarara weavers.")], ["17.30", tr("Teras senja", "Sunset terrace"), tr("Koktail & musik gambus.", "Cocktails & gambus music.")]], side: { image: asset("v5f-resort"), alt: tr("Pantai saat senja", "Beach at sunset") } }),
      ],
      gallery: () => [
        pageHead(S, { eyebrow: tr("Galeri", "Gallery"), title: tr("Sekilas resor", "A glimpse of the resort") }),
        galleryLb(S, { title: tr("Foto resor", "Resort photos"), images: [[asset("v5f-resort"), tr("Senja dari vila", "Sunset from a villa")], [asset("v5f-resort-night"), tr("Malam di teras", "Night on the terrace")], [asset("v5f-resort"), tr("Kolam tebing", "Cliff pool")], [asset("v5f-resort-night"), tr("Restoran", "Restaurant")], [asset("v5f-resort"), tr("Pantai", "Beach")], [asset("v5f-resort-night"), tr("Spa", "Spa")]] }),
      ],
      book: () => [
        pageHead(S, { eyebrow: tr("Pesan", "Book"), title: tr("Rencanakan menginap", "Plan your stay") }),
        formD(S, {
          title: tr("Permintaan pemesanan", "Booking request"),
          info: [["WhatsApp", "+62 370 555 0188"], ["Email", "stay@terassenja.id"], [tr("Check-in", "Check-in"), "14.00"]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") },
            { kind: "date", label: tr("Tanggal datang", "Arrival") },
            { kind: "date", label: tr("Tanggal pulang", "Departure") },
            { kind: "select", label: tr("Vila", "Villa"), ph: tr("Pilih vila", "Choose a villa"), options: [tr("Vila Taman", "Garden Villa"), tr("Vila Tebing", "Cliff Villa"), tr("Rumah Keluarga", "Family House")] },
          ],
          submit: tr("Kirim permintaan", "Send request"),
        }),
      ],
    }),
};

/* ------------- 3. Lintas Rental — rental mobil (5 hlm, Premium) ------------- */
// Premium: pricing (plans), comparison-table, countdown. Library: AOS + Tilt.

const LP: Palette = { ink: "#0f172a", muted: "#475569", primary: "#dc2626", primaryDark: "#991b1b", soft: "#fee2e2", line: "#fecaca" };
const LR = lookD(LP, { head: "Oswald", body: "Inter", shape: "sharp", radius: 0, bg: "#ffffff", alt: "#f1f5f9", inv: "#0f172a", fx: { aos: "fade-right", tilt: true }, upper: true });

const lFoot = (tr: Tr) =>
  footerD("Lintas Rental", LR, {
    variant: "slim",
    about: tr("Sewa mobil harian & bulanan di Bali, lepas kunci atau dengan sopir.", "Daily & monthly car rental in Bali, self-drive or with a driver."),
    copy: tr("© 2026 Lintas Rental. Konten contoh.", "© 2026 Lintas Rental. Sample content."),
    social: ["Instagram | https://instagram.com/lintasrental", "WhatsApp | https://wa.me/6281200009911"],
  });

export const rentalLintas: TemplateContent = {
  brand: "Lintas Rental",
  pages: [home(), pg("fleet", ["armada", "Armada"], ["fleet", "Fleet"]), pg("rates", ["tarif", "Tarif"], ["rates", "Rates"]), pg("terms", ["syarat", "Syarat"], ["terms", "Terms"]), pg("book", ["sewa", "Sewa"], ["book", "Book"])],
  build: (key, tr, href) =>
    render(LR, key, headerD("Lintas", LR, { variant: "ink", cta: [tr("Sewa sekarang", "Book now"), href("book")], info: [tr("Bandara Ngurah Rai · 24 jam", "Ngurah Rai Airport · 24 hours"), "WhatsApp 0812 0000 9911"] }), lFoot(tr), {
      home: () => [
        fullHeader(LR, {
          eyebrow: tr("Sewa mobil Bali", "Bali car rental"),
          title: tr("Ambil kunci, jelajahi pulau", "Grab the keys, explore the island"),
          text: tr("Mobil terawat, asuransi penuh, antar ke hotel atau bandara tanpa biaya tambahan.", "Well-kept cars, full insurance, delivered to your hotel or the airport at no extra cost."),
          image: asset("v5f-car-dark"),
          align: "left",
          chips: [tr("Mulai Rp300rb/hari", "From Rp300k/day"), tr("Asuransi penuh", "Full insurance"), tr("Tanpa deposit tunai", "No cash deposit")],
          actions: [[tr("Lihat armada", "See the fleet"), href("fleet"), "light"]],
        }),
        specialty(LR, {
          side: { title: tr("Sewa dalam 3 langkah", "Rent in 3 steps"), items: [tr("1. Pilih mobil & tanggal", "1. Pick a car & dates"), tr("2. Kirim foto SIM", "2. Send a photo of your licence"), tr("3. Mobil diantar", "3. We deliver the car")], action: [tr("Mulai sewa", "Start booking"), href("book")] },
          sideRight: true,
          eyebrow: tr("Kenapa Lintas", "Why Lintas"),
          title: tr("Tanpa biaya tersembunyi", "No hidden fees"),
          items: [
            { icon: "🛡", title: tr("Asuransi all-risk", "All-risk insurance"), text: tr("Sudah termasuk di setiap sewa.", "Included in every rental.") },
            { icon: "⛽", title: tr("Bensin adil", "Fair fuel"), text: tr("Kembalikan dengan tangki sama.", "Return with the same tank level.") },
            { icon: "📍", title: tr("Antar gratis", "Free delivery"), text: tr("Badung, Denpasar, Gianyar.", "Badung, Denpasar, Gianyar.") },
            { icon: "🧰", title: tr("Bantuan 24 jam", "24-hour help"), text: tr("Mobil pengganti bila mogok.", "A replacement car if yours breaks down.") },
          ],
        }),
        countdownD(LR, { eyebrow: tr("Promo musim hujan", "Rainy-season deal"), title: tr("Diskon 20% sewa mingguan", "20% off weekly rentals"), text: tr("Berlaku untuk pemesanan sebelum promo berakhir.", "For bookings made before the deal ends."), target: "2026-12-31T23:59", finished: tr("Promo berakhir", "Deal ended"), actions: [[tr("Pakai promo", "Use the deal"), href("book"), "light"]] }),
      ],
      fleet: () => [
        pageHead(LR, { eyebrow: tr("Armada", "Fleet"), title: tr("Mobil untuk setiap perjalanan", "A car for every trip") }),
        cardsD(LR, {
          title: tr("Pilihan mobil", "Car choices"),
          items: [
            { icon: "🚗", title: "Brio / Agya", text: tr("Hemat untuk berdua, otomatis.", "Economical for two, automatic."), meta: "Rp300.000/" + tr("hari", "day") },
            { icon: "🚙", title: "Xpander / Avanza", text: tr("7 kursi untuk keluarga.", "7 seats for families."), meta: "Rp450.000/" + tr("hari", "day") },
            { icon: "🚐", title: "Innova Zenix", text: tr("Nyaman untuk perjalanan jauh.", "Comfortable for long drives."), meta: "Rp750.000/" + tr("hari", "day") },
            { icon: "🛻", title: "Jimny 4x4", text: tr("Untuk jalan pantai & bukit.", "For beach and hill roads."), meta: "Rp850.000/" + tr("hari", "day") },
          ],
          cols: 4,
        }),
        fullImage(LR, { image: asset("v5f-car"), alt: tr("Mobil di jalan pesisir", "A car on a coastal road"), ratio: "21 / 6" }),
      ],
      rates: () => [
        pageHead(LR, { eyebrow: tr("Tarif", "Rates"), title: tr("Makin lama, makin hemat", "The longer, the cheaper") }),
        plansD(LR, {
          title: tr("Paket sewa", "Rental plans"),
          items: [
            { plan: tr("Harian", "Daily"), price: "Rp300rb", period: tr("/hari", "/day"), description: tr("1–6 hari", "1–6 days"), features: [tr("Asuransi", "Insurance"), tr("Antar gratis", "Free delivery")], buttonText: tr("Pilih", "Choose"), buttonHref: href("book") },
            { plan: tr("Mingguan", "Weekly"), price: "Rp1,8jt", period: tr("/minggu", "/week"), description: tr("Hemat 15%", "Save 15%"), features: [tr("Asuransi", "Insurance"), tr("Antar gratis", "Free delivery"), tr("Cuci gratis", "Free wash")], buttonText: tr("Pilih", "Choose"), buttonHref: href("book"), featured: true, badge: tr("Terlaris", "Best seller") },
            { plan: tr("Bulanan", "Monthly"), price: "Rp6,2jt", period: tr("/bulan", "/month"), description: tr("Hemat 30%", "Save 30%"), features: [tr("Servis rutin", "Routine service"), tr("Mobil pengganti", "Replacement car")], buttonText: tr("Pilih", "Choose"), buttonHref: href("book") },
          ],
        }),
        compareD(LR, { title: tr("Lepas kunci atau dengan sopir?", "Self-drive or with a driver?"), columns: [tr("Hal", "Item"), tr("Lepas kunci", "Self-drive"), tr("Dengan sopir", "With driver")], rows: [tr("Harga mulai | Rp300rb | Rp650rb", "From | Rp300k | Rp650k"), tr("Bensin | Penyewa | Termasuk", "Fuel | Renter | Included"), tr("Jam pakai | 24 jam | 12 jam", "Hours | 24 hours | 12 hours")], highlight: 1, caption: tr("Harga contoh per hari.", "Sample prices per day.") }),
      ],
      terms: () => [
        pageHead(LR, { eyebrow: tr("Syarat", "Terms"), title: tr("Syarat sewa", "Rental terms") }),
        specs(LR, { title: tr("Yang perlu disiapkan", "What you need"), rows: [[tr("Usia", "Age"), tr("Minimal 21 tahun", "21 or older")], ["SIM", tr("SIM A atau SIM internasional", "Local or international licence")], [tr("Identitas", "ID"), tr("KTP atau paspor", "ID card or passport")], [tr("Pembayaran", "Payment"), tr("Kartu kredit/debit atau transfer", "Credit/debit card or transfer")]], image: asset("v5f-car") }),
        faqD(LR, { title: tr("Pertanyaan sewa", "Rental questions"), items: [[tr("Boleh keluar Bali?", "Can I leave Bali?"), tr("Ke Lombok boleh dengan izin tertulis.", "Lombok is fine with written permission.")], [tr("Bagaimana jika telat kembali?", "What if I'm late?"), tr("Tenggang 1 jam, lalu tarif per jam.", "1-hour grace, then hourly rates.")]] }),
      ],
      book: () => [
        pageHead(LR, { eyebrow: tr("Sewa", "Book"), title: tr("Pesan mobil Anda", "Book your car") }),
        formD(LR, {
          title: tr("Formulir sewa", "Booking form"),
          info: [["WhatsApp", "0812 0000 9911"], [tr("Kantor", "Office"), "Jl. Raya Tuban 88, Kuta"], [tr("Jam", "Hours"), tr("24 jam", "24 hours")]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama sesuai SIM", "Name as on licence") },
            { kind: "select", label: tr("Mobil", "Car"), ph: tr("Pilih mobil", "Choose a car"), options: ["Brio / Agya", "Xpander / Avanza", "Innova Zenix", "Jimny 4x4"] },
            { kind: "date", label: tr("Mulai sewa", "Pick-up"), mode: "datetime-local" },
            { kind: "date", label: tr("Selesai sewa", "Return"), mode: "datetime-local" },
          ],
          submit: tr("Pesan", "Book"),
        }),
      ],
    }),
};

/* ------------- 4. Hening Yoga — studio yoga (5 hlm, Premium) ------------- */
// Premium: typewriter, team-cards & stats-band (preset Pro). Library: Animate.

const HP: Palette = { ink: "#2e1065", muted: "#5b4b7a", primary: "#7c3aed", primaryDark: "#5b21b6", soft: "#ede9fe", line: "#ddd6fe" };
const H = lookD(HP, { head: "Lora", body: "Josefin Sans", shape: "glass", radius: 26, bg: "#fbfaff", alt: "#f3f0ff", inv: "#2e1065", fx: { animate: "fadeIn" } });

const hFoot = (tr: Tr) =>
  footerD("Hening Yoga", H, {
    variant: "columns",
    about: tr("Studio yoga kecil di Bandung untuk pemula, ibu hamil, dan siapa saja yang butuh jeda.", "A small Bandung yoga studio for beginners, mums-to-be and anyone who needs a pause."),
    cols: [{ title: tr("Studio", "Studio"), items: ["Jl. Cipaganti 140, Bandung", "0821 7000 3311", "halo@heningyoga.id"] }],
    social: ["Instagram | https://instagram.com/heningyoga", "YouTube | https://youtube.com/@heningyoga"],
    copy: tr("© 2026 Hening Yoga. Konten contoh.", "© 2026 Hening Yoga. Sample content."),
  });

export const yogaHening: TemplateContent = {
  brand: "Hening Yoga",
  pages: [home(), pg("classes", ["kelas", "Kelas"], ["classes", "Classes"]), pg("teachers", ["pengajar", "Pengajar"], ["teachers", "Teachers"]), pg("schedule", ["jadwal", "Jadwal"], ["schedule", "Schedule"]), pg("join", ["gabung", "Gabung"], ["join", "Join"])],
  build: (key, tr, href) =>
    render(H, key, headerD("Hening", H, { variant: "pill", cta: [tr("Kelas percobaan", "Trial class"), href("join")] }), hFoot(tr), {
      home: () => [
        fullHeader(H, {
          eyebrow: tr("Studio yoga · Bandung", "Yoga studio · Bandung"),
          title: tr("Tarik napas. Kembali ke tubuh.", "Breathe in. Come back to your body."),
          titleNode: typerD(H, tr("Yoga untuk ", "Yoga for "), [tr("pemula", "beginners"), tr("ibu hamil", "mums-to-be"), tr("pekerja kantoran", "office workers")], { size: 60, color: "#ffffff", align: "center" }),
          text: tr("Kelas kecil maksimal 10 orang, matras dan teh jahe disediakan.", "Small classes of up to 10, with mats and ginger tea provided."),
          image: asset("v5f-yoga"),
          overlay: 45,
          actions: [[tr("Coba kelas pertama", "Try your first class"), href("join"), "light"]],
        }),
        specialty(H, {
          side: { title: tr("Kelas minggu ini", "This week"), items: [tr("Sen · Hatha pemula 07.00", "Mon · Beginner Hatha 7am"), tr("Rab · Prenatal 10.00", "Wed · Prenatal 10am"), tr("Jum · Yin 19.00", "Fri · Yin 7pm"), tr("Sab · Vinyasa 08.00", "Sat · Vinyasa 8am")], action: [tr("Jadwal lengkap", "Full schedule"), href("schedule")] },
          eyebrow: tr("Kelas", "Classes"),
          title: tr("Temukan ritme Anda", "Find your rhythm"),
          items: [
            { icon: "🌱", title: "Hatha", text: tr("Gerakan dasar, pelan, dan jelas.", "Basic poses, slow and clear.") },
            { icon: "🌊", title: "Vinyasa", text: tr("Mengalir dengan napas.", "Flowing with the breath.") },
            { icon: "🌙", title: "Yin", text: tr("Tahan lama untuk melepas tegang.", "Long holds to release tension.") },
            { icon: "🤰", title: "Prenatal", text: tr("Aman untuk trimester 2–3.", "Safe for trimesters 2–3.") },
          ],
          image: { src: asset("v5f-yoga-warm"), alt: tr("Kelas yoga pagi", "Morning yoga class") },
        }),
        withFx(H, statsBand(pro(H), tr, { title: tr("Hening dalam angka", "Hening in numbers"), stats: [["6", tr("Pengajar bersertifikat", "Certified teachers")], ["24", tr("Kelas per minggu", "Classes a week")], ["10", tr("Orang per kelas", "People per class")], ["4,9", tr("Rating Google", "Google rating")]] })),
      ],
      classes: () => [
        pageHead(H, { eyebrow: tr("Kelas", "Classes"), title: tr("Pilih kelas yang pas", "Pick the right class") }),
        bento(H, {
          title: tr("Jenis kelas", "Class types"),
          items: [
            { title: tr("Hatha pemula", "Beginner Hatha"), text: tr("60 menit, cocok untuk yang belum pernah yoga.", "60 minutes, ideal if you've never tried yoga."), image: asset("v5f-yoga"), wide: true, meta: tr("Semua tingkat", "All levels") },
            { title: "Prenatal", text: tr("Didampingi bidan sekali sebulan.", "With a midwife once a month."), icon: "🤰", accent: true },
            { title: "Yin", text: tr("Kelas malam yang menenangkan.", "A calming evening class."), icon: "🌙" },
            { title: tr("Privat", "Private"), text: tr("Di studio atau rumah Anda.", "At the studio or your home."), icon: "🏠" },
          ],
        }),
        fullImage(H, { image: asset("v5f-yoga-warm"), alt: tr("Ruang studio", "Studio room"), caption: tr("Ruang utama dengan lantai kayu dan jendela taman.", "The main room with wooden floors and garden windows.") }),
      ],
      teachers: () => [
        pageHead(H, { eyebrow: tr("Pengajar", "Teachers"), title: tr("Mereka yang memandu", "The people who guide you") }),
        withFx(H, teamCards(pro(H), tr, { title: tr("Pengajar kami", "Our teachers"), members: [{ name: "Ayu Kirana", role: tr("Hatha & Yin · RYT 500", "Hatha & Yin · RYT 500"), photo: asset("v4e-face-2") }, { name: "Raka Wibisono", role: "Vinyasa · RYT 200", photo: asset("v4e-face-1") }, { name: "Dewi Lestari", role: tr("Prenatal · Bidan", "Prenatal · Midwife"), photo: asset("v4e-face-4") }] })),
      ],
      schedule: () => [
        pageHead(H, { eyebrow: tr("Jadwal", "Schedule"), title: tr("Jadwal mingguan", "Weekly schedule") }),
        tableD(H, {
          title: tr("Kelas reguler", "Regular classes"),
          columns: [tr("Hari", "Day"), tr("Pagi", "Morning"), tr("Malam", "Evening")],
          rows: [
            [tr("Senin", "Monday"), tr("Hatha 07.00", "Hatha 7am"), tr("Vinyasa 19.00", "Vinyasa 7pm")],
            [tr("Rabu", "Wednesday"), tr("Prenatal 10.00", "Prenatal 10am"), tr("Hatha 19.00", "Hatha 7pm")],
            [tr("Jumat", "Friday"), tr("Vinyasa 07.00", "Vinyasa 7am"), tr("Yin 19.00", "Yin 7pm")],
            [tr("Sabtu", "Saturday"), tr("Vinyasa 08.00", "Vinyasa 8am"), "—"],
          ],
          note: tr("Datang 10 menit sebelum kelas.", "Arrive 10 minutes before class."),
        }),
      ],
      join: () => [
        pageHead(H, { eyebrow: tr("Gabung", "Join"), title: tr("Kelas pertama Rp50.000", "First class Rp50,000") }),
        formD(H, {
          title: tr("Daftar kelas percobaan", "Book a trial class"),
          info: [["WhatsApp", "0821 7000 3311"], [tr("Studio", "Studio"), "Jl. Cipaganti 140, Bandung"]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
            { kind: "select", label: tr("Kelas", "Class"), ph: tr("Pilih kelas", "Choose a class"), options: ["Hatha", "Vinyasa", "Yin", "Prenatal"] },
            { kind: "date", label: tr("Tanggal", "Date") },
          ],
          submit: tr("Daftar", "Book"),
        }),
        rail(H, { title: tr("Setelah mendaftar", "After you sign up"), steps: [[tr("Konfirmasi", "Confirmation"), tr("Kami kirim pesan WhatsApp.", "We message you on WhatsApp.")], [tr("Datang", "Arrive"), tr("Pakai baju nyaman.", "Wear comfy clothes.")], [tr("Berlatih", "Practise"), tr("Matras disediakan.", "Mats provided.")]] }),
      ],
    }),
};
