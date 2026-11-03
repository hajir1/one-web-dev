import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import { teamCards } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import { countdownBand, counter, priceSwitch, progressBars, slider } from "../../v2/setA/kitA";
import {
  banner,
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
  lightbox,
  lookC,
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
/* Template v3 C1–C5: Roti (Free), Futsal, Run club, Masjid, Gereja.    */
/* ================================================================== */

/* ---------------- 1. Roti Hangat (FREE, 4 hlm) — pastel lembut -------- */
// Hanya elemen & section gratis; library: AOS saja.

const RH: Palette = { ink: "#3b2410", muted: "#7a5a3c", primary: "#b45309", primaryDark: "#92400e", soft: "#fef3c7", line: "#fde68a" };
const rh = lookC(RH, { head: "Fraunces", body: "Nunito", skin: "soft", radius: 22, bg: "#fffbf3", alt: "#fdf0dc", dark: "#3b2410", fx: { aos: "fade-up" }, btnR: 999 });

const rhFoot = (tr: Tr) =>
  ftr(rh, "Dapur Roti Rumi", {
    kind: "card",
    about: tr("Toko roti rumahan di Kotabaru, dipanggang sejak subuh setiap hari kecuali Senin.", "A neighbourhood bakery in Kotabaru, baking from dawn every day except Monday."),
    cols: [
      { title: tr("Buka", "Open"), items: [tr("Sel–Min 06.00–19.00", "Tue–Sun 6am–7pm"), tr("Senin libur", "Closed Mondays")] },
      { title: tr("Pesan", "Order"), items: ["WA +62 811 2600 4471", "Jl. Kenari Raya 12"] },
    ],
    copy: tr("© 2026 Dapur Roti Rumi. Konten contoh.", "© 2026 Dapur Roti Rumi. Sample content."),
    social: ["Instagram | https://instagram.com/dapurrotirumi", "WhatsApp | https://wa.me/6281126004471"],
  });

export const bakeryRotiHangat: TemplateContent = {
  brand: "Dapur Roti Rumi",
  pages: [home(), pg("menu", ["menu-roti", "Menu Roti"], ["bread-menu", "Bread Menu"]), pg("story", ["cerita", "Cerita Dapur"], ["our-story", "Our Story"]), pg("order", ["pesan", "Pesan Antar"], ["order", "Delivery"])],
  build: (key, tr, href) => {
    const head = hdr(rh, "Dapur Roti Rumi", { kind: "pill", cta: [tr("Pesan antar", "Order now"), href("order")], strip: tr("Roti sobek keluar oven pukul 06.00 & 15.00", "Pull-apart bread out of the oven at 6am & 3pm") });
    const end = rhFoot(tr);
    if (key === "menu")
      return pageC(rh, [
        head,
        banner(rh, { kind: "center", eyebrow: tr("Menu harian", "Daily menu"), title: tr("Hangat, lembut, dan tanpa pengawet", "Warm, soft, and preservative-free"), text: tr("Semua roti memakai ragi alami dan mentega asli. Stok terbatas, habis berarti habis.", "Every loaf uses natural yeast and real butter. Limited batches: when it's gone, it's gone.") }),
        priceLines(rh, {
          title: tr("Daftar roti", "Bread list"),
          groups: [
            { title: tr("Roti manis", "Sweet bread"), items: [["Roti Sobek Susu", tr("12 potong, susu segar", "12 pieces, fresh milk"), "Rp32.000"], ["Bolu Pandan Gulung", tr("Daun pandan asli", "Real pandan leaves"), "Rp45.000"], ["Roti Abon Pedas", tr("Abon sapi buatan sendiri", "House-made beef floss"), "Rp14.000"]] },
            { title: tr("Roti tawar & asin", "Loaves & savoury"), items: [["Tawar Gandum", tr("Gandum utuh 60%", "60% wholemeal"), "Rp28.000"], ["Croissant Mentega", tr("Laminasi 27 lapis", "27 laminated layers"), "Rp18.000"], ["Focaccia Rosemary", tr("Minyak zaitun & garam laut", "Olive oil & sea salt"), "Rp35.000"]] },
          ],
          note: tr("Harga per item. Pesanan di atas Rp150.000 gratis ongkir dalam 5 km.", "Prices per item. Free delivery within 5 km for orders over Rp150,000."),
        }),
        tabs(rh, {
          eyebrow: tr("Jadwal panggang", "Baking schedule"),
          title: tr("Kapan roti favoritmu keluar oven", "When your favourite comes out of the oven"),
          tabs: [
            [tr("Pagi", "Morning"), tr("06.00 — roti sobek, tawar gandum, croissant.", "6am — pull-apart bread, wholemeal loaf, croissant.")],
            [tr("Siang", "Midday"), tr("11.00 — focaccia, roti abon, pizza mini.", "11am — focaccia, floss buns, mini pizza.")],
            [tr("Sore", "Afternoon"), tr("15.00 — bolu pandan, roti sobek batch kedua.", "3pm — pandan roll cake, second pull-apart batch.")],
          ],
        }),
        end,
      ]);
    if (key === "story")
      return pageC(rh, [
        head,
        split(rh, {
          eyebrow: tr("Sejak 2018", "Since 2018"),
          title: tr("Berawal dari oven kecil di dapur Bu Rumi", "It began with Bu Rumi's tiny kitchen oven"),
          paras: [tr("Bu Rumi menjual roti sobek ke tetangga lewat grup WhatsApp RT. Pesanan pertama: 14 bungkus.", "Bu Rumi sold pull-apart bread to neighbours through the block's WhatsApp group. First order: 14 packs."), tr("Kini dapur kami memanggang 600 roti sehari bersama tujuh orang dari kampung sekitar.", "Today our kitchen bakes 600 loaves a day with seven people from the neighbourhood.")],
          bullets: [tr("Ragi alami, fermentasi 16 jam", "Natural yeast, 16-hour ferment"), tr("Telur dari peternak Sleman", "Eggs from Sleman farmers"), tr("Kemasan kertas, bukan plastik", "Paper packaging, not plastic")],
          image: asset("v3c-bread"),
          alt: tr("Roti hangat di meja", "Warm bread on the table"),
        }),
        timelineC(rh, { eyebrow: tr("Perjalanan", "Journey"), title: tr("Dari 14 bungkus ke 600 roti", "From 14 packs to 600 loaves"), items: [tr("2018 | Grup WhatsApp RT | Roti sobek pesanan tetangga.", "2018 | Neighbourhood chat | Pull-apart bread for neighbours."), tr("2020 | Etalase pertama | Teras rumah jadi toko kecil.", "2020 | First display | The front porch became a tiny shop."), tr("2023 | Oven dek | Kapasitas naik tiga kali lipat.", "2023 | Deck oven | Capacity tripled."), tr("2026 | Kelas anak | Belajar membentuk roti tiap Minggu.", "2026 | Kids' class | Shaping bread every Sunday.")] }),
        pull(rh, { text: tr("Roti yang baik itu sabar: biarkan adonan bekerja semalaman.", "Good bread is patient: let the dough work overnight."), name: "Bu Rumi", role: tr("Pendiri", "Founder"), bg: rh.alt }),
        end,
      ]);
    if (key === "order")
      return pageC(rh, [
        head,
        steps(rh, { eyebrow: tr("Cara pesan", "How to order"), title: tr("Tiga langkah, roti sampai hangat", "Three steps, bread arrives warm"), items: [[tr("Pilih roti", "Pick your bread"), tr("Lihat menu dan catat jumlahnya.", "Check the menu and note quantities.")], [tr("Isi formulir", "Fill the form"), tr("Pilih jam antar pagi atau sore.", "Choose a morning or afternoon slot.")], [tr("Bayar di tempat", "Pay on delivery"), tr("Tunai atau transfer saat roti tiba.", "Cash or transfer when it arrives.")]] }),
        form(rh, {
          eyebrow: tr("Pesan antar", "Delivery"),
          title: tr("Pesan untuk besok pagi", "Order for tomorrow morning"),
          text: tr("Pesanan masuk sebelum pukul 20.00 dikirim besok pagi.", "Orders before 8pm are delivered the next morning."),
          info: [[tr("Area", "Area"), tr("Radius 5 km dari Kotabaru", "Within 5 km of Kotabaru")], ["WhatsApp", "+62 811 2600 4471"]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama penerima", "Recipient name") },
            { kind: "input", label: tr("Alamat", "Address"), ph: tr("Jalan, nomor, patokan", "Street, number, landmark") },
            { kind: "select", label: tr("Jam antar", "Delivery slot"), ph: tr("Pilih", "Choose"), options: ["06.30–08.00", "15.30–17.00"] },
          ],
          message: tr("Daftar pesanan", "Your order"),
          submit: tr("Kirim pesanan", "Send order"),
        }),
        faq(rh, { eyebrow: "FAQ", title: tr("Sebelum memesan", "Before you order"), items: [[tr("Bisa pesan untuk acara?", "Can I order for events?"), tr("Bisa, minimal H-2 untuk 50 roti ke atas.", "Yes, two days ahead for 50+ pieces.")], [tr("Tahan berapa lama?", "How long does it keep?"), tr("Dua hari di suhu ruang, lima hari di kulkas.", "Two days at room temperature, five in the fridge.")], [tr("Ada pilihan tanpa telur?", "Egg-free options?"), tr("Tawar gandum dan focaccia tanpa telur.", "The wholemeal loaf and focaccia are egg-free.")]] }),
        end,
      ]);
    return pageC(rh, [
      head,
      hero(rh, { kind: "pastel", badge: tr("Keluar oven 06.00", "Out of the oven at 6am"), title: tr("Roti hangat untuk sarapan serumah", "Warm bread for the whole family's breakfast"), text: tr("Roti sobek susu, croissant mentega, dan bolu pandan dari dapur kecil di Kotabaru. Diantar sebelum jam kantor.", "Milk pull-apart bread, butter croissants and pandan roll from a small Kotabaru kitchen. Delivered before office hours."), acts: [[tr("Lihat menu", "See the menu"), href("menu")], [tr("Pesan antar", "Order delivery"), href("order"), "outline"]], image: asset("v3c-bread"), alt: tr("Roti dan croissant", "Bread and croissant"), chips: [tr("Ragi alami", "Natural yeast"), tr("Tanpa pengawet", "No preservatives"), tr("Mentega asli", "Real butter")] }),
      cardsC(rh, {
        eyebrow: tr("Favorit pelanggan", "Customer favourites"),
        title: tr("Yang paling cepat habis", "The first to sell out"),
        align: "center",
        items: [
          { icon: "01", title: "Roti Sobek Susu", text: tr("Lembut seperti kapas, wangi susu segar.", "Cloud-soft with a fresh milk aroma."), meta: "Rp32.000" },
          { icon: "02", title: "Croissant Mentega", text: tr("Renyah di luar, berlapis di dalam.", "Crisp outside, layered inside."), meta: "Rp18.000" },
          { icon: "03", title: "Bolu Pandan Gulung", text: tr("Pandan asli dengan krim kelapa.", "Real pandan with coconut cream."), meta: "Rp45.000" },
        ],
      }),
      catalog(rh, {
        eyebrow: tr("Paket hemat", "Value bundles"),
        title: tr("Paket untuk sarapan & arisan", "Bundles for breakfast & gatherings"),
        bg: rh.alt,
        items: [
          { image: asset("v3c-bread"), title: tr("Paket Sarapan", "Breakfast Pack"), text: tr("1 tawar gandum + 4 croissant", "1 wholemeal loaf + 4 croissants"), price: "Rp95.000", cta: tr("Pesan", "Order"), href: href("order") },
          { image: asset("v3c-bread-night"), title: tr("Paket Arisan", "Gathering Pack"), text: tr("30 roti manis campur", "30 assorted sweet buns"), price: "Rp210.000", badge: tr("Hemat", "Save"), cta: tr("Pesan", "Order"), href: href("order") },
          { image: asset("v3c-bread"), title: tr("Paket Bekal", "Lunchbox Pack"), text: tr("6 roti abon + 2 bolu", "6 floss buns + 2 roll cakes"), price: "Rp120.000", cta: tr("Pesan", "Order"), href: href("order") },
        ],
      }),
      cta(rh, { kind: "sticker", title: tr("Pesan malam ini, sarapan besok", "Order tonight, breakfast tomorrow"), text: tr("Kirim sebelum 20.00 dan roti tiba pukul 07.00.", "Send it before 8pm and bread arrives at 7am."), acts: [[tr("Pesan antar", "Order delivery"), href("order")]] }),
      end,
    ]);
  },
};

/* ------------- 2. Futsal Arena (PREMIUM, 6 hlm) — neon gelap ---------- */

const FA: Palette = { ink: "#f0fdf4", muted: "#a7c4b0", primary: "#22c55e", primaryDark: "#15803d", soft: "#dcfce7", line: "#86efac" };
const fa = lookC(FA, { head: "Bebas Neue", body: "Rubik", skin: "neon", radius: 10, bg: "#07130c", alt: "#0c1d13", dark: "#030806", fx: { aos: "fade-up", animate: "backInUp" }, btnR: 6, caps: true, onDark: "#a7c4b0", accent2: "#a3e635" });

const faFoot = (tr: Tr) =>
  ftr(fa, "Lapangan Gelora Lima", {
    kind: "giant",
    about: tr("Empat lapangan vinyl & rumput sintetis di Cibubur. Buka 07.00–24.00.", "Four vinyl and synthetic-turf pitches in Cibubur. Open 7am–midnight."),
    cols: [
      { title: tr("Lapangan", "Pitches"), items: ["Vinyl A & B", tr("Sintetis C & D", "Synthetic C & D"), tr("Ruang ganti & bilas", "Changing rooms & showers")] },
      { title: tr("Kontak", "Contact"), items: ["+62 812 7410 5520", "Jl. Alternatif Km 4"] },
    ],
    copy: tr("© 2026 Lapangan Gelora Lima. Konten contoh.", "© 2026 Lapangan Gelora Lima. Sample content."),
    social: ["Instagram | https://instagram.com/geloralima", "YouTube | https://youtube.com/@geloralima", "TikTok | https://tiktok.com/@geloralima"],
  });

export const sportsFutsalArena: TemplateContent = {
  brand: "Lapangan Gelora Lima",
  pages: [
    home(),
    pg("courts", ["lapangan", "Lapangan"], ["courts", "Courts"]),
    pg("booking", ["jadwal-sewa", "Jadwal & Sewa"], ["booking", "Booking"]),
    pg("league", ["turnamen", "Turnamen"], ["tournament", "Tournament"]),
    pg("member", ["member", "Member"], ["membership", "Membership"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(fa, "Gelora Lima", { kind: "dark", cta: [tr("Sewa lapangan", "Book a pitch"), href("booking")], sticky: true });
    const end = faFoot(tr);
    if (key === "courts")
      return pageC(fa, [
        head,
        banner(fa, { kind: "band", eyebrow: tr("4 lapangan", "4 pitches"), title: tr("Pilih permukaan mainmu", "Pick your surface"), text: tr("Vinyl untuk umpan cepat, sintetis untuk duel keras.", "Vinyl for quick passing, synthetic turf for hard duels.") }),
        bento(fa, {
          title: tr("Fasilitas lengkap", "Full facilities"),
          tiles: [
            { title: tr("Lapangan Vinyl A & B", "Vinyl pitches A & B"), text: tr("Standar FIFA 25 x 15 m, lampu LED 400 lux.", "FIFA standard 25 x 15 m, 400-lux LED lighting."), image: asset("v3c-pitch"), wide: true },
            { title: tr("Skor digital", "Digital scoreboard"), text: tr("Papan skor & timer di setiap lapangan.", "Scoreboard & timer on every pitch."), stat: "4", tone: "primary" },
            { title: tr("Ruang bilas", "Showers"), text: tr("Air hangat, loker berkunci.", "Hot water, lockable lockers."), stat: "24" },
            { title: tr("Kantin", "Canteen"), text: tr("Es teh jumbo & nasi goreng sampai tengah malam.", "Jumbo iced tea & fried rice till midnight."), tone: "dark" },
            { title: tr("Parkir", "Parking"), text: tr("60 mobil, 150 motor.", "60 cars, 150 motorbikes."), stat: "210" },
          ],
        }),
        table(fa, { eyebrow: tr("Spesifikasi", "Specs"), title: tr("Perbandingan lapangan", "Pitch comparison"), columns: [tr("Lapangan", "Pitch"), tr("Permukaan", "Surface"), tr("Ukuran", "Size"), tr("Cocok untuk", "Best for")], rows: [["A", "Vinyl", "25 x 15 m", tr("Liga & turnamen", "Leagues & tournaments")], ["B", "Vinyl", "25 x 15 m", tr("Latihan tim", "Team practice")], ["C", tr("Sintetis", "Synthetic"), "30 x 18 m", tr("Main santai", "Casual games")], ["D", tr("Sintetis", "Synthetic"), "22 x 14 m", tr("Anak & SSB", "Kids & academies")]] }),
        end,
      ]);
    if (key === "booking")
      return pageC(fa, [
        head,
        banner(fa, { kind: "rule", eyebrow: tr("Sewa per jam", "Hourly rental"), title: tr("Jadwal & tarif", "Schedule & rates"), text: tr("Booking minimal 1 jam. DP 50% via transfer mengunci jadwal.", "Minimum 1 hour. A 50% deposit locks your slot.") }),
        priceSwitch(fa, {
          eyebrow: tr("Tarif", "Rates"),
          title: tr("Sekali main atau langganan", "Single games or a season pass"),
          plans: [
            tr("Pagi | Rp120rb | Rp1,1jt | 07.00–15.00; Semua lapangan; Bola & rompi | Pesan pagi", "Morning | Rp120k | Rp1.1m | 7am–3pm; Any pitch; Ball & bibs | Book morning"),
            tr("Prime | Rp220rb | Rp2,1jt | 17.00–22.00; Vinyl A/B; Skor digital; Wasit opsional | Pesan prime", "Prime | Rp220k | Rp2.1m | 5pm–10pm; Vinyl A/B; Digital score; Optional referee | Book prime"),
            tr("Malam | Rp160rb | Rp1,5jt | 22.00–24.00; Semua lapangan; Diskon member | Pesan malam", "Late | Rp160k | Rp1.5m | 10pm–midnight; Any pitch; Member discount | Book late"),
          ],
          labels: [tr("Per jam", "Per hour"), tr("Paket 10 jam", "10-hour pack"), tr("Hemat 10%", "Save 10%"), tr("/jam", "/hour"), tr("/10 jam", "/10 hours")],
          href: href("contact"),
        }),
        form(fa, {
          eyebrow: "Booking",
          title: tr("Kunci jadwalmu", "Lock your slot"),
          info: [[tr("Konfirmasi", "Confirmation"), tr("Maks. 30 menit via WhatsApp", "Within 30 min on WhatsApp")], [tr("Pembatalan", "Cancellation"), tr("Gratis H-1", "Free a day before")]],
          fields: [
            { kind: "input", label: tr("Nama tim", "Team name"), ph: "FC Kampung Rambutan" },
            { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" },
            { kind: "select", label: tr("Lapangan", "Pitch"), ph: tr("Pilih", "Choose"), options: ["Vinyl A", "Vinyl B", tr("Sintetis C", "Synthetic C"), tr("Sintetis D", "Synthetic D")] },
            { kind: "select", label: tr("Durasi", "Duration"), ph: tr("Pilih", "Choose"), options: [tr("1 jam", "1 hour"), tr("2 jam", "2 hours"), tr("3 jam", "3 hours")] },
          ],
          submit: tr("Kirim booking", "Send booking"),
        }),
        end,
      ]);
    if (key === "league")
      return pageC(fa, [
        head,
        countdownBand(fa, { eyebrow: tr("Gelora Cup 2026", "Gelora Cup 2026"), title: tr("Pendaftaran ditutup dalam", "Registration closes in"), text: tr("32 tim, hadiah total Rp25 juta, final disiarkan langsung.", "32 teams, Rp25 million prize pool, live-streamed final."), target: "2026-11-28T20:00", finished: tr("Pendaftaran ditutup.", "Registration closed."), actions: [[tr("Daftar tim", "Register a team"), href("contact")]], bg: fa.alt }),
        numbered(fa, { eyebrow: tr("Format", "Format"), title: tr("Cara turnamen berjalan", "How the tournament runs"), items: [[tr("Fase grup", "Group stage"), tr("8 grup isi 4 tim, 2 x 15 menit.", "8 groups of 4, 2 x 15 minutes.")], [tr("Gugur 16 besar", "Round of 16"), tr("Adu penalti bila imbang.", "Penalties if level.")], [tr("Final malam", "Night final"), tr("Lapangan A, live di kanal YouTube kami.", "Pitch A, live on our YouTube channel.")]] }),
        counter(fa, { title: tr("Musim lalu", "Last season"), items: ["32 | " + tr("Tim", "Teams"), "96 | " + tr("Pertandingan", "Matches"), "412 | " + tr("Gol", "Goals"), "3.800 | " + tr("Penonton", "Spectators")], dark: true }),
        end,
      ]);
    if (key === "member")
      return pageC(fa, [
        head,
        hero(fa, { kind: "poster", meta: [tr("Member", "Member"), "2026"], title: tr("Main lebih sering, bayar lebih hemat", "Play more, pay less"), text: tr("Kartu member memberi potongan 15%, prioritas jadwal prime, dan undangan liga internal.", "A member card gives 15% off, priority prime slots and invites to our in-house league."), acts: [[tr("Daftar member", "Join now"), href("contact")]] }),
        cardsC(fa, { title: tr("Keuntungan member", "Member perks"), items: [{ icon: "%", title: tr("Diskon 15%", "15% off"), text: tr("Untuk semua jam sewa.", "On every rental hour.") }, { icon: "P", title: tr("Prioritas prime", "Prime priority"), text: tr("Booking H-14 sebelum umum.", "Book 14 days before the public.") }, { icon: "L", title: tr("Liga internal", "In-house league"), text: tr("Kompetisi bulanan antartim member.", "A monthly league for member teams.") }] }),
        faq(fa, { title: tr("Soal member", "About membership"), items: [[tr("Berapa biayanya?", "How much is it?"), tr("Rp150 ribu per tim per tahun.", "Rp150k per team per year.")], [tr("Bisa untuk perorangan?", "Can individuals join?"), tr("Bisa, ikut sesi main bareng Kamis malam.", "Yes, via Thursday-night pickup games.")]] }),
        end,
      ]);
    if (key === "contact")
      return pageC(fa, [
        head,
        infoTiles(fa, [[tr("Alamat", "Address"), "Jl. Alternatif Km 4, Cibubur"], ["WhatsApp", "+62 812 7410 5520"], [tr("Jam", "Hours"), "07.00–24.00"]]),
        form(fa, { title: tr("Tanya jadwal kosong", "Ask about free slots"), info: [["Email", "halo@geloralima.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "input", label: "WhatsApp", ph: "08xx" }], message: tr("Pertanyaan", "Question"), submit: tr("Kirim", "Send") }),
        end,
      ]);
    return pageC(fa, [
      head,
      hero(fa, { kind: "neon", badge: tr("Buka sampai 24.00", "Open till midnight"), title: tr("Malam ini, lapangan milikmu", "Tonight, the pitch is yours"), text: tr("Empat lapangan berstandar turnamen, lampu LED terang, dan booking online dalam dua menit.", "Four tournament-grade pitches, bright LED lights and two-minute online booking."), acts: [[tr("Cek jadwal", "Check slots"), href("booking")], [tr("Lihat lapangan", "See the pitches"), href("courts"), "outline"]], image: asset("v3c-pitch-day"), alt: tr("Lapangan futsal", "Futsal pitch"), chips: ["Vinyl", tr("Sintetis", "Synthetic"), tr("Skor digital", "Digital scores")] }),
      words(fa, [tr("Sewa", "Book"), tr("Main", "Play"), tr("Menang", "Win"), tr("Ulangi", "Repeat")], { bg: fa.p.primary }),
      counter(fa, { items: ["4 | " + tr("Lapangan", "Pitches"), "17 | " + tr("Jam buka/hari", "Hours a day"), "1.200+ | " + tr("Tim terdaftar", "Registered teams"), "4,9 | Rating"], dark: true, bg: fa.bg }),
      cta(fa, { kind: "split", title: tr("Gelora Cup 2026 dibuka", "Gelora Cup 2026 is open"), text: tr("32 slot tim, hadiah Rp25 juta.", "32 team slots, Rp25 million in prizes."), acts: [[tr("Info turnamen", "Tournament info"), href("league")]], bg: fa.alt }),
      end,
    ]);
  },
};

/* -------------- 3. Run Club (PREMIUM, 5 hlm) — brutalist -------------- */

const RC: Palette = { ink: "#111111", muted: "#3f3f46", primary: "#f43f5e", primaryDark: "#be123c", soft: "#ffe4e6", line: "#fda4af" };
const rc = lookC(RC, { head: "Archivo Black", body: "Inter", skin: "brutal", radius: 0, bg: "#fffdf7", alt: "#fff1f2", dark: "#111111", fx: { aos: "fade-right", tilt: { max: 8 } }, btnR: 0, caps: true, accent2: "#facc15" });

const rcFoot = (tr: Tr) =>
  ftr(rc, "Langkah Subuh Run Club", {
    kind: "columns",
    about: tr("Komunitas lari gratis di Surabaya. Semua pace diterima, tidak ada yang ditinggal.", "A free running community in Surabaya. Every pace welcome, nobody left behind."),
    cols: [
      { title: tr("Lari rutin", "Weekly runs"), items: [tr("Selasa 05.00 — Taman Bungkul", "Tue 5am — Bungkul Park"), tr("Sabtu 05.30 — Long run", "Sat 5:30am — Long run")] },
      { title: tr("Ikuti", "Follow"), items: ["@langkahsubuh", "halo@langkahsubuh.run"] },
    ],
    copy: tr("© 2026 Langkah Subuh Run Club. Konten contoh.", "© 2026 Langkah Subuh Run Club. Sample content."),
    social: ["Instagram | https://instagram.com/langkahsubuh", "Strava | https://strava.com/clubs/langkahsubuh"],
  });

export const sportsRunclub: TemplateContent = {
  brand: "Langkah Subuh Run Club",
  pages: [home(), pg("runs", ["jadwal-lari", "Jadwal Lari"], ["runs", "Weekly Runs"]), pg("race", ["race", "Race 10K"], ["race", "10K Race"]), pg("crew", ["komunitas", "Komunitas"], ["community", "Community"]), pg("join", ["gabung", "Gabung"], ["join", "Join"])],
  build: (key, tr, href) => {
    const head = hdr(rc, "Langkah Subuh", { kind: "bar", cta: [tr("Gabung gratis", "Join free"), href("join")] });
    const end = rcFoot(tr);
    if (key === "runs")
      return pageC(rc, [
        head,
        banner(rc, { kind: "rule", eyebrow: tr("Setiap minggu", "Every week"), title: tr("Jadwal lari", "Run schedule"), text: tr("Kumpul 15 menit sebelum mulai untuk pemanasan bersama.", "Meet 15 minutes early for a group warm-up.") }),
        table(rc, { title: tr("Rute minggu ini", "This week's routes"), columns: [tr("Hari", "Day"), tr("Jam", "Time"), tr("Rute", "Route"), tr("Jarak", "Distance"), "Pace"], rows: [[tr("Selasa", "Tuesday"), "05.00", tr("Taman Bungkul – Darmo", "Bungkul Park – Darmo"), "6 km", "6:00–7:30"], [tr("Kamis", "Thursday"), "19.00", tr("Interval stadion", "Stadium intervals"), "8 x 400 m", tr("Semua", "All")], [tr("Sabtu", "Saturday"), "05.30", tr("Long run Kenjeran", "Kenjeran long run"), "12–21 km", "5:30–7:00"]], note: tr("Ada pacer untuk setiap kelompok pace.", "There is a pacer for every pace group.") }),
        steps(rc, { eyebrow: tr("Lari pertama?", "First run?"), title: tr("Yang perlu kamu tahu", "What you need to know"), items: [[tr("Datang saja", "Just show up"), tr("Tidak perlu daftar untuk lari rutin.", "No sign-up needed for weekly runs.")], [tr("Cari bendera", "Find the flag"), tr("Bendera pink = titik kumpul.", "Pink flag = meeting point.")], [tr("Pilih pacer", "Pick a pacer"), tr("Bilang pace nyamanmu, kami carikan grup.", "Tell us your easy pace and we'll find your group.")]] }),
        end,
      ]);
    if (key === "race")
      return pageC(rc, [
        head,
        hero(rc, { kind: "brutal", badge: tr("Kuota 1.500 pelari", "1,500 runner cap"), eyebrow: "Subuh 10K / 2026", title: tr("Lari 10K saat kota masih tidur", "A 10K while the city sleeps"), text: tr("Start 04.45 dari Taman Bungkul, finis bersama matahari terbit di Jembatan Merah.", "Start 4:45am at Bungkul Park, finish with the sunrise at Jembatan Merah."), acts: [[tr("Daftar race", "Register"), href("join")]], image: asset("v3c-runner-dawn"), alt: tr("Pelari saat fajar", "Runner at dawn") }),
        countdownBand(rc, { title: tr("Start dalam", "Gun goes off in"), text: tr("Race pack diambil H-2 di sekretariat.", "Collect your race pack two days before."), target: "2026-12-13T04:45", finished: tr("Race sedang berlangsung!", "The race is on!"), bg: rc.dark }),
        lightbox(rc, { title: tr("Galeri race 2025", "2025 race gallery"), images: [[asset("v3c-runner"), tr("Start 04.45", "Start 4:45am")], [asset("v3c-runner-dawn"), tr("Km 7 saat fajar", "Km 7 at dawn")], [asset("v3c-runner"), tr("Garis finis", "Finish line")]], cols: 3 }),
        end,
      ]);
    if (key === "crew")
      return pageC(rc, [
        head,
        people(rc, { eyebrow: "Pacer", title: tr("Kenalan dengan pacer kami", "Meet our pacers"), items: [{ name: "Dimas Prakoso", role: "Pace 5:30", photo: asset("v3c-face-1") }, { name: "Ayu Kartika", role: "Pace 6:30", photo: asset("v3c-face-2") }, { name: "Rendi Saputra", role: "Pace 7:00", photo: asset("v3c-face-3") }, { name: "Nadia Salsabila", role: tr("Pelatih lari", "Run coach"), photo: asset("v3c-face-4") }] }),
        pull(rc, { text: tr("Saya datang tidak kuat lari 2 km. Delapan bulan kemudian finis half marathon pertama.", "I arrived unable to run 2 km. Eight months later I finished my first half marathon."), name: "Sekar Paramitha", role: tr("Anggota sejak 2024", "Member since 2024"), bg: rc.p.soft }),
        bigNumbers(rc, [["2.400", tr("Anggota", "Members")], ["52", tr("Lari per tahun", "Runs a year")], ["0", tr("Biaya keanggotaan", "Membership fee")]]),
        end,
      ]);
    if (key === "join")
      return pageC(rc, [
        head,
        form(rc, { eyebrow: tr("Gratis", "Free"), title: tr("Gabung Langkah Subuh", "Join Langkah Subuh"), text: tr("Kami kirim info rute tiap Senin malam.", "We send route info every Monday night."), info: [["Email", "halo@langkahsubuh.run"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama panggilan", "Nickname") }, { kind: "select", label: tr("Pace nyaman", "Easy pace"), ph: tr("Pilih", "Choose"), options: ["< 5:30", "5:30–6:30", "6:30–7:30", "> 7:30"] }, { kind: "check", label: tr("Saya juga ingin ikut Subuh 10K", "I also want to run Subuh 10K") }], submit: tr("Daftar", "Sign up") }),
        faq(rc, { title: tr("Pertanyaan pelari baru", "New runner questions"), items: [[tr("Harus cepat?", "Do I need to be fast?"), tr("Tidak. Grup paling santai jalan-lari.", "No. The easiest group run-walks.")], [tr("Ada biaya?", "Any fees?"), tr("Lari rutin gratis; race berbayar.", "Weekly runs are free; races are paid.")]] }),
        end,
      ]);
    return pageC(rc, [
      head,
      hero(rc, { kind: "brutal", badge: tr("Gratis selamanya", "Free forever"), eyebrow: tr("Run club Surabaya", "Surabaya run club"), title: tr("Bangun subuh. Lari bareng. Ngopi.", "Wake early. Run together. Coffee."), text: tr("Tiga kali seminggu kami lari dengan pacer untuk setiap kecepatan, lalu sarapan bersama.", "Three times a week we run with pacers for every speed, then share breakfast."), acts: [[tr("Lihat jadwal", "See the schedule"), href("runs")], [tr("Subuh 10K", "Subuh 10K"), href("race"), "outline"]], image: asset("v3c-runner"), alt: tr("Pelari", "Runner") }),
      words(rc, ["5K", "10K", "21K", tr("Kopi", "Coffee")], { bg: rc.p.primary }),
      cardsC(rc, { title: tr("Kenapa lari bareng kami", "Why run with us"), items: [{ icon: "1", title: tr("Pacer setiap grup", "A pacer for every group"), text: tr("Tidak ada yang ditinggal di belakang.", "Nobody gets left behind.") }, { icon: "2", title: tr("Rute aman", "Safe routes"), text: tr("Dikawal marshal di persimpangan.", "Marshals at every crossing.") }, { icon: "3", title: tr("Program 0–5K", "0–5K program"), text: tr("Delapan minggu untuk pemula.", "Eight weeks for beginners.") }] }),
      cta(rc, { kind: "giant", title: tr("Sampai jumpa Selasa 05.00", "See you Tuesday, 5am"), acts: [[tr("Gabung gratis", "Join free"), href("join"), "dark"]], bg: rc.p.line }),
      end,
    ]);
  },
};

/* ---------- 4. Masjid An-Nur (PREMIUM, 6 hlm) — kaca hijau zamrud ------ */

const MA: Palette = { ink: "#022c22", muted: "#3f6b5c", primary: "#047857", primaryDark: "#065f46", soft: "#d1fae5", line: "#a7f3d0" };
const ma = lookC(MA, { head: "Lora", body: "Work Sans", skin: "line", radius: 16, bg: "#ffffff", alt: "#f0fdf8", dark: "#022c22", fx: { aos: "fade-up" }, onDark: "#a7d7c5", accent2: "#d97706" });

const maFoot = (tr: Tr) =>
  ftr(ma, "Masjid Jami An-Nur Pelita", {
    kind: "columns",
    about: tr("Masjid warga Perumahan Pelita Asri. Terbuka untuk ibadah, kajian, dan kegiatan sosial.", "The community mosque of Pelita Asri estate. Open for prayer, study circles and social programs."),
    cols: [
      { title: tr("Layanan", "Services"), items: [tr("Kajian rutin", "Weekly study"), tr("Zakat & infak", "Zakat & donations"), tr("Akad nikah", "Marriage ceremonies")] },
      { title: tr("Alamat", "Address"), items: ["Jl. Pelita Asri Blok C", "+62 813 2211 0870"] },
    ],
    copy: tr("© 2026 DKM An-Nur Pelita. Konten contoh.", "© 2026 An-Nur Pelita Mosque Board. Sample content."),
    backTop: tr("Kembali ke atas", "Back to top"),
  });

export const worshipMasjidAnnur: TemplateContent = {
  brand: "Masjid Jami An-Nur Pelita",
  pages: [
    home(),
    pg("schedule", ["jadwal", "Jadwal"], ["schedule", "Schedule"]),
    pg("study", ["kajian", "Kajian"], ["study-circles", "Study Circles"]),
    pg("zakat", ["zakat-infak", "Zakat & Infak"], ["zakat", "Zakat & Giving"]),
    pg("about", ["profil", "Profil"], ["about", "About"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(ma, "An-Nur Pelita", { kind: "stack", strip: tr("Subuh 04.32 · Zuhur 11.51 · Asar 15.12 · Magrib 17.54 · Isya 19.05", "Fajr 4:32 · Dhuhr 11:51 · Asr 3:12 · Maghrib 5:54 · Isha 7:05") });
    const end = maFoot(tr);
    if (key === "schedule")
      return pageC(ma, [
        head,
        banner(ma, { kind: "center", eyebrow: tr("Pekan ini", "This week"), title: tr("Jadwal salat & kegiatan", "Prayer & activity schedule"), text: tr("Jadwal mengikuti perhitungan Kemenag untuk wilayah Bekasi.", "Times follow the official calculation for the Bekasi area.") }),
        table(ma, { title: tr("Imam & khatib", "Imams & preachers"), columns: [tr("Hari", "Day"), tr("Kegiatan", "Activity"), tr("Waktu", "Time"), tr("Pengisi", "Led by")], rows: [[tr("Jumat", "Friday"), tr("Salat Jumat", "Friday prayer"), "11.45", "Ust. Fadhil Rahman"], [tr("Sabtu", "Saturday"), tr("Kajian fikih", "Fiqh study"), tr("Ba'da Subuh", "After Fajr"), "Ust. Hanif Maulana"], [tr("Ahad", "Sunday"), tr("TPA anak", "Kids' Quran class"), "15.30", tr("Tim TPA", "TPA team")], [tr("Rabu", "Wednesday"), tr("Tahsin dewasa", "Adult recitation"), tr("Ba'da Isya", "After Isha"), "Ust. Zaki Hamdani"]] }),
        infoTiles(ma, [[tr("Parkir", "Parking"), tr("40 mobil", "40 cars")], [tr("Tempat wudu", "Ablution"), tr("Terpisah pria/wanita", "Separate areas")], [tr("Akses", "Access"), tr("Ramah kursi roda", "Wheelchair friendly")]], { bg: ma.alt }),
        end,
      ]);
    if (key === "study")
      return pageC(ma, [
        head,
        banner(ma, { kind: "image", eyebrow: tr("Majelis ilmu", "Study circles"), title: tr("Kajian terbuka untuk semua", "Open study for everyone"), text: tr("Tanpa daftar, cukup datang. Rekaman tersedia di kanal kami.", "No sign-up, just come. Recordings on our channel."), image: asset("v3c-pattern"), alt: tr("Pola geometris", "Geometric pattern") }),
        cardsC(ma, { title: tr("Kajian rutin", "Regular circles"), items: [{ icon: "F", title: tr("Fikih keluarga", "Family fiqh"), text: tr("Sabtu ba'da Subuh, bahas bab per bab.", "Saturdays after Fajr, chapter by chapter."), meta: "Ust. Hanif Maulana" }, { icon: "T", title: tr("Tafsir juz 30", "Juz 30 tafsir"), text: tr("Kamis ba'da Magrib, untuk pemula.", "Thursdays after Maghrib, for beginners."), meta: "Ust. Fadhil Rahman" }, { icon: "M", title: tr("Kajian muslimah", "Women's circle"), text: tr("Selasa 09.00, ruang serbaguna.", "Tuesdays 9am, multipurpose hall."), meta: "Ustzh. Laila Fitriani" }] }),
        teamCards(ma, tr, { eyebrow: tr("Asatidz", "Teachers"), title: tr("Pengisi kajian", "Our teachers"), members: [{ name: "Ust. Fadhil Rahman", role: tr("Imam rawatib", "Resident imam"), photo: asset("v3c-face-1") }, { name: "Ust. Hanif Maulana", role: tr("Fikih", "Fiqh"), photo: asset("v3c-face-3") }, { name: "Ustzh. Laila Fitriani", role: tr("Kajian muslimah", "Women's circle"), photo: asset("v3c-face-2") }, { name: "Ust. Zaki Hamdani", role: tr("Tahsin", "Recitation"), photo: asset("v3c-face-1") }] }),
        end,
      ]);
    if (key === "zakat")
      return pageC(ma, [
        head,
        hero(ma, { kind: "glass", eyebrow: tr("Zakat, infak, sedekah", "Zakat & charity"), title: tr("Titipan Anda, kami salurkan dengan laporan", "Your giving, delivered and reported"), text: tr("Laporan penyaluran diumumkan setiap Jumat dan bisa diunduh siapa saja.", "Distribution reports are announced every Friday and open to all."), acts: [[tr("Konfirmasi transfer", "Confirm a transfer"), href("contact"), "light"]], image: asset("v3c-mosque"), alt: tr("Masjid", "Mosque"), chips: [tr("Zakat fitrah", "Zakat al-fitr"), tr("Infak pembangunan", "Building fund"), tr("Santunan yatim", "Orphan support")] }),
        progressBars(ma, { eyebrow: tr("Program 2026", "2026 programs"), title: tr("Capaian dana", "Fundraising progress"), bars: [[tr("Renovasi tempat wudu", "Ablution area renovation"), 72], [tr("Beasiswa santri TPA", "TPA scholarships"), 45], [tr("Paket sembako Ramadan", "Ramadan food packs"), 88]], side: { image: asset("v3c-pattern"), alt: tr("Pola", "Pattern") } }),
        counter(ma, { title: tr("Tersalurkan tahun lalu", "Distributed last year"), items: ["412 | " + tr("Keluarga dibantu", "Families helped"), "86 | " + tr("Anak yatim", "Orphans"), "1.250 | " + tr("Paket sembako", "Food packs"), "100% | " + tr("Dilaporkan", "Reported")] }),
        end,
      ]);
    if (key === "about")
      return pageC(ma, [
        head,
        split(ma, { eyebrow: tr("Sejarah", "History"), title: tr("Dibangun swadaya warga sejak 1998", "Built by residents since 1998"), paras: [tr("Berawal dari musala 6 x 8 meter, An-Nur kini menampung 900 jamaah dengan perpustakaan dan ruang TPA.", "From a 6 x 8 m prayer room, An-Nur now holds 900 worshippers plus a library and Quran classrooms.")], image: asset("v3c-mosque"), alt: tr("Bangunan masjid", "Mosque building"), tone: "dark" }),
        timelineC(ma, { title: tr("Perjalanan An-Nur", "An-Nur's journey"), items: [tr("1998 | Musala warga | Berdiri di lahan wakaf Bapak H. Sobri.", "1998 | Residents' prayer room | Built on land endowed by Mr. Sobri."), tr("2008 | Masjid jami | Kubah dan menara selesai.", "2008 | Congregational mosque | Dome and minaret completed."), tr("2019 | Perpustakaan | 2.000 judul buku.", "2019 | Library | 2,000 titles."), tr("2026 | Ramah difabel | Ram & tempat wudu duduk.", "2026 | Accessible | Ramps and seated ablution.")] }),
        end,
      ]);
    if (key === "contact")
      return pageC(ma, [
        head,
        form(ma, { eyebrow: tr("Sekretariat DKM", "Board office"), title: tr("Hubungi pengurus", "Contact the board"), text: tr("Untuk akad nikah, peminjaman aula, atau konfirmasi zakat.", "For marriage ceremonies, hall bookings or zakat confirmation."), info: [[tr("Alamat", "Address"), "Jl. Pelita Asri Blok C, Bekasi"], ["WhatsApp", "+62 813 2211 0870"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { kind: "select", label: tr("Keperluan", "Purpose"), ph: tr("Pilih", "Choose"), options: [tr("Akad nikah", "Marriage"), tr("Pinjam aula", "Hall booking"), tr("Konfirmasi zakat", "Zakat confirmation"), tr("Lainnya", "Other")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
        faq(ma, { title: tr("Yang sering ditanyakan", "Frequently asked"), items: [[tr("Bisa salat jenazah di sini?", "Funeral prayers here?"), tr("Bisa, hubungi pengurus 24 jam.", "Yes, contact the board 24/7.")], [tr("Ada parkir saat Jumat?", "Parking on Fridays?"), tr("Lahan sekolah sebelah dibuka 11.00.", "The school next door opens its lot at 11am.")]] }),
        end,
      ]);
    return pageC(ma, [
      head,
      hero(ma, { kind: "glass", eyebrow: tr("Masjid warga Pelita Asri", "Pelita Asri community mosque"), title: tr("Rumah bersama untuk ibadah dan ilmu", "A shared home for prayer and learning"), text: tr("Salat berjamaah lima waktu, kajian terbuka, TPA anak, dan layanan zakat yang transparan.", "Five daily congregational prayers, open study circles, kids' Quran classes and transparent zakat."), acts: [[tr("Jadwal pekan ini", "This week's schedule"), href("schedule"), "light"], [tr("Tunaikan zakat", "Give zakat"), href("zakat"), "outline"]], image: asset("v3c-mosque"), alt: tr("Masjid An-Nur", "An-Nur mosque") }),
      cardsC(ma, { eyebrow: tr("Program", "Programs"), title: tr("Kegiatan yang bisa Anda ikuti", "Activities you can join"), items: [{ icon: "K", title: tr("Kajian", "Study"), text: tr("Empat kajian rutin setiap pekan.", "Four regular circles every week.") }, { icon: "T", title: "TPA", text: tr("120 santri belajar membaca Al-Qur'an.", "120 children learning to recite.") }, { icon: "Z", title: tr("Zakat", "Zakat"), text: tr("Disalurkan ke warga sekitar.", "Distributed to local families.") }] }),
      counter(ma, { items: ["900 | " + tr("Kapasitas jamaah", "Worshippers"), "120 | " + tr("Santri TPA", "TPA students"), "4 | " + tr("Kajian/pekan", "Circles/week"), "28 | " + tr("Tahun melayani", "Years serving")], bg: ma.alt }),
      cta(ma, { kind: "split", title: tr("Ikut kajian Sabtu ini", "Join this Saturday's circle"), text: tr("Ba'da Subuh, sarapan bersama setelahnya.", "After Fajr, with breakfast afterwards."), acts: [[tr("Lihat kajian", "See circles"), href("study"), "light"]] }),
      end,
    ]);
  },
};

/* ----------- 5. Gereja Kasih (PREMIUM, 5 hlm) — editorial ungu ------- */

const GK: Palette = { ink: "#2e1065", muted: "#5b4b80", primary: "#6d28d9", primaryDark: "#5b21b6", soft: "#ede9fe", line: "#ddd6fe" };
const gk = lookC(GK, { head: "Playfair Display", body: "Josefin Sans", skin: "editorial", radius: 4, bg: "#fdfcff", alt: "#f5f3ff", dark: "#1e0b3d", fx: { aos: "fade-up", animate: "fadeInUp" }, onDark: "#c4b5fd", accent2: "#db2777" });

const gkFoot = (tr: Tr) =>
  ftr(gk, "Jemaat Kasih Mulia", {
    kind: "minimal",
    about: "",
    cols: [{ title: "", items: [tr("Ibadah Minggu 07.00 & 10.00", "Sunday services 7am & 10am"), "Jl. Cempaka Putih 8, Malang", "+62 341 550 218"] }],
    copy: tr("© 2026 Jemaat Kasih Mulia. Konten contoh.", "© 2026 Jemaat Kasih Mulia. Sample content."),
    social: ["YouTube | https://youtube.com/@kasihmulia", "Instagram | https://instagram.com/kasihmulia"],
  });

export const worshipGerejaKasih: TemplateContent = {
  brand: "Jemaat Kasih Mulia",
  pages: [home(), pg("services", ["ibadah", "Ibadah"], ["services", "Services"]), pg("ministry", ["pelayanan", "Pelayanan"], ["ministries", "Ministries"]), pg("events", ["acara", "Acara"], ["events", "Events"]), pg("visit", ["kunjungi", "Kunjungi"], ["visit", "Visit"])],
  build: (key, tr, href) => {
    const head = hdr(gk, "Kasih Mulia", { kind: "bar", cta: [tr("Ibadah Minggu", "Sunday service"), href("services")] });
    const end = gkFoot(tr);
    if (key === "services")
      return pageC(gk, [
        head,
        banner(gk, { kind: "rule", eyebrow: tr("Setiap Minggu", "Every Sunday"), title: tr("Ibadah raya", "Sunday worship"), text: tr("Dua jam ibadah dengan liturgi sederhana, pujian, dan firman.", "Two services with a simple liturgy, worship and the word.") }),
        numbered(gk, { title: tr("Jadwal ibadah", "Service times"), items: [[tr("Ibadah pagi 07.00", "Early service 7am"), tr("Liturgi tradisional dengan paduan suara.", "Traditional liturgy with choir.")], [tr("Ibadah umum 10.00", "Main service 10am"), tr("Pujian kontemporer & sekolah Minggu.", "Contemporary worship & Sunday school.")], [tr("Ibadah pemuda 17.00", "Youth service 5pm"), tr("Untuk usia 15–25 tahun.", "For ages 15–25.")]] }),
        slider(gk, { slides: [{ title: tr("Seri khotbah: Kasih yang Tinggal", "Sermon series: Love that Stays"), text: tr("Oktober–November, Pdt. Yohanes Wibisono", "October–November, Rev. Yohanes Wibisono"), bg: gk.p.primary }, { title: tr("Perjamuan kudus", "Holy communion"), text: tr("Minggu pertama setiap bulan", "First Sunday of every month"), bg: gk.dark }], height: 300 }),
        end,
      ]);
    if (key === "ministry")
      return pageC(gk, [
        head,
        cardsC(gk, { eyebrow: tr("Melayani bersama", "Serving together"), title: tr("Pelayanan jemaat", "Ministries"), cols: 2, items: [{ title: tr("Sekolah Minggu", "Sunday school"), text: tr("Kelas usia 3–12 tahun, 10.00 di gedung serbaguna.", "Ages 3–12, 10am in the hall."), meta: tr("Koordinator: Ibu Ruth Handayani", "Coordinator: Mrs. Ruth Handayani") }, { title: tr("Komsel", "Small groups"), text: tr("24 kelompok sel di seluruh Malang.", "24 small groups across Malang."), meta: tr("Rabu malam", "Wednesday nights") }, { title: tr("Diakonia", "Outreach"), text: tr("Dapur umum & beasiswa sekolah.", "Community kitchen & school scholarships."), meta: tr("Sabtu kedua", "Second Saturday") }, { title: tr("Musik & multimedia", "Music & media"), text: tr("Latihan Kamis 19.00.", "Rehearsals Thursday 7pm."), meta: tr("Terbuka untuk relawan", "Volunteers welcome") }] }),
        split(gk, { eyebrow: "Diakonia", title: tr("Dapur umum setiap Sabtu", "A community kitchen every Saturday"), paras: [tr("Relawan memasak 300 porsi untuk pekerja harian dan lansia di sekitar gereja.", "Volunteers cook 300 meals for day labourers and elderly neighbours.")], image: asset("v3c-chapel"), alt: tr("Gedung gereja", "Church building"), tone: "primary", reverse: true }),
        end,
      ]);
    if (key === "events")
      return pageC(gk, [
        head,
        banner(gk, { kind: "band", eyebrow: tr("Kalender", "Calendar"), title: tr("Acara mendatang", "Upcoming events") }),
        timelineC(gk, { title: tr("Desember 2026", "December 2026"), items: [tr("6 Des | Retret pemuda | Batu, dua hari satu malam.", "Dec 6 | Youth retreat | Batu, two days."), tr("14 Des | Konser Natal anak | Gedung utama, 17.00.", "Dec 14 | Children's Christmas concert | Main hall, 5pm."), tr("24 Des | Malam Natal | Ibadah lilin 19.00.", "Dec 24 | Christmas Eve | Candlelight service 7pm."), tr("31 Des | Ibadah tutup tahun | 21.00.", "Dec 31 | Year-end service | 9pm.")], image: asset("v3c-chapel-dusk"), alt: tr("Gereja", "Church") }),
        modalOffer(gk, { title: tr("Daftar retret pemuda", "Sign up for the youth retreat"), text: tr("Kuota 80 peserta, biaya Rp250 ribu termasuk makan.", "80 places, Rp250k including meals."), trigger: tr("Lihat detail", "See details"), modalTitle: tr("Retret Pemuda 2026", "Youth Retreat 2026"), body: tr("6–7 Desember di Batu. Berangkat 07.00 dari gereja. Bawa Alkitab, jaket, dan obat pribadi.", "December 6–7 in Batu. Leaving 7am from church. Bring a Bible, jacket and personal medicine."), cta: [tr("Daftar sekarang", "Register now"), href("visit")] }),
        end,
      ]);
    if (key === "visit")
      return pageC(gk, [
        head,
        hero(gk, { kind: "minimal", eyebrow: tr("Pertama kali?", "First time?"), title: tr("Datang apa adanya, Anda diterima", "Come as you are, you're welcome"), text: tr("Tim penyambut akan menemani Anda di pintu utama dan menunjukkan kelas anak.", "Our welcome team will meet you at the main door and show you the kids' classes."), image: asset("v3c-chapel"), alt: tr("Pintu gereja", "Church door") }),
        form(gk, { title: tr("Kabari kami kedatangan Anda", "Let us know you're coming"), info: [[tr("Alamat", "Address"), "Jl. Cempaka Putih 8, Malang"], [tr("Parkir", "Parking"), tr("Halaman belakang", "Rear courtyard")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "select", label: tr("Ibadah", "Service"), ph: tr("Pilih", "Choose"), options: ["07.00", "10.00", "17.00"] }, { kind: "check", label: tr("Saya membawa anak", "I'm bringing children") }], submit: tr("Kirim", "Send") }),
        end,
      ]);
    return pageC(gk, [
      head,
      hero(gk, { kind: "editorial", meta: [tr("Jemaat Kasih Mulia", "Kasih Mulia Church"), tr("Malang, sejak 1972", "Malang, since 1972")], title: tr("Kasih yang tinggal, bukan sekadar singgah", "Love that stays, not just visits"), text: tr("Komunitas iman yang beribadah, belajar, dan melayani kota bersama-sama setiap minggu.", "A faith community that worships, learns and serves the city together every week."), acts: [[tr("Jadwal ibadah", "Service times"), href("services")], [tr("Kunjungi kami", "Plan a visit"), href("visit"), "outline"]], image: asset("v3c-chapel-dusk"), alt: tr("Gereja", "Church") }),
      slider(gk, { slides: [{ title: tr("Ibadah Natal 24 Desember", "Christmas Eve, December 24"), text: tr("Ibadah lilin 19.00", "Candlelight service 7pm"), bg: gk.p.primary }, { title: tr("Komsel baru dibuka", "New small groups"), text: tr("Daftar sebelum akhir bulan", "Sign up before month's end"), bg: gk.p.primaryDark }, { title: tr("Dapur umum Sabtu", "Saturday kitchen"), text: tr("Relawan dibutuhkan", "Volunteers needed"), bg: gk.dark }], height: 320 }),
      chips(gk, { title: tr("Ada tempat untuk Anda", "There's a place for you"), chips: [tr("Sekolah Minggu", "Sunday school"), tr("Pemuda", "Youth"), tr("Komsel", "Small groups"), tr("Paduan suara", "Choir"), "Diakonia", tr("Lansia", "Seniors")], bg: gk.alt }),
      newsletter(gk, { title: tr("Warta jemaat mingguan", "Weekly bulletin"), text: tr("Ringkasan khotbah dan pengumuman tiap Sabtu.", "Sermon notes and announcements every Saturday."), ph: "email@contoh.id", submit: tr("Berlangganan", "Subscribe") }),
      end,
    ]);
  },
};
