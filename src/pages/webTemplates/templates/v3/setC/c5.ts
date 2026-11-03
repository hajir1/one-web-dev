import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import { servicesSplit, statsBand, teamCards } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import { compare, counter, mega, plans, priceSwitch, quotes, slider, typer } from "../../v2/setA/kitA";
import {
  banner,
  beforeAfter,
  bento,
  bigNumbers,
  cardsC,
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
  strip,
  table,
  tabs,
  timelineC,
  video,
  words,
} from "./kitC";

/* ================================================================== */
/* Template v3 C21–C25: Diving, Tato, Hotel kapsul, Edtech, Konsultan    */
/* pajak.                                                               */
/* ================================================================== */

/* -------------- 21. Diving (PREMIUM, 6 hlm) — samudra ---------------- */

const KB: Palette = { ink: "#082f49", muted: "#3f6176", primary: "#0369a1", primaryDark: "#075985", soft: "#e0f2fe", line: "#7dd3fc" };
const kb = lookC(KB, { head: "Montserrat", body: "Outfit", skin: "soft", radius: 20, bg: "#f5fbff", alt: "#e6f4fc", dark: "#05233a", fx: { aos: "fade-right", tilt: { max: 7, glare: true } }, btnR: 999, onDark: "#a5cfe8", accent2: "#14b8a6" });

const kbFoot = (tr: Tr) =>
  ftr(kb, "Karang Biru Dive Center", {
    kind: "giant",
    about: tr("Pusat selam berlisensi di Pulau Menjangan & Nusa Penida. Kursus, fun dive, dan liveaboard.", "A licensed dive centre in Menjangan & Nusa Penida. Courses, fun dives and liveaboards."),
    cols: [{ title: tr("Dive center", "Dive centre"), items: ["Pemuteran, Buleleng", tr("Setiap hari 07.00–18.00", "Daily 7am–6pm")] }, { title: tr("Kontak", "Contact"), items: ["+62 362 940 552", "dive@karangbiru.id"] }],
    copy: tr("© 2026 Karang Biru Dive Center. Konten contoh.", "© 2026 Karang Biru Dive Center. Sample content."),
    social: ["Instagram | https://instagram.com/karangbiru.dive", "YouTube | https://youtube.com/@karangbiru"],
  });

export const travelDiving: TemplateContent = {
  brand: "Karang Biru Dive Center",
  pages: [
    home(),
    pg("trips", ["trip", "Trip Selam"], ["trips", "Dive Trips"]),
    pg("courses", ["kursus", "Kursus"], ["courses", "Courses"]),
    pg("sites", ["titik-selam", "Titik Selam"], ["dive-sites", "Dive Sites"]),
    pg("gallery", ["galeri", "Galeri"], ["gallery", "Gallery"]),
    pg("book", ["pesan", "Pesan"], ["book", "Book"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(kb, "Karang Biru", { kind: "pill", cta: [tr("Pesan trip", "Book a trip"), href("book")] });
    const end = kbFoot(tr);
    if (key === "trips")
      return pageC(kb, [
        head,
        banner(kb, { kind: "band", eyebrow: tr("Trip harian & liveaboard", "Day trips & liveaboards"), title: tr("Pilih petualangan bawah air", "Choose your underwater adventure") }),
        plans(kb, { title: tr("Paket trip", "Trip packages"), items: [{ plan: "Fun Dive", price: "Rp1,4jt", period: tr("/2 selam", "/2 dives"), description: tr("Untuk penyelam bersertifikat.", "For certified divers."), features: [tr("Perahu & pemandu", "Boat & guide"), tr("Tabung & pemberat", "Tanks & weights"), tr("Makan siang", "Lunch")], buttonText: tr("Pesan", "Book"), buttonHref: href("book") }, { plan: tr("Manta Penida", "Penida Mantas"), price: "Rp2,1jt", period: tr("/3 selam", "/3 dives"), description: tr("Manta Point & Crystal Bay.", "Manta Point & Crystal Bay."), features: [tr("Speedboat", "Speedboat"), tr("Foto bawah air", "Underwater photos"), tr("Penjemputan hotel", "Hotel pickup")], buttonText: tr("Pesan", "Book"), buttonHref: href("book"), featured: true, badge: tr("Favorit", "Favourite") }, { plan: "Liveaboard", price: "Rp14jt", period: tr("/4 hari", "/4 days"), description: tr("Komodo, 12 selam.", "Komodo, 12 dives."), features: [tr("Kabin ber-AC", "Air-con cabin"), tr("Semua makan", "All meals"), "Nitrox"], buttonText: tr("Pesan", "Book"), buttonHref: href("book") }] }),
        table(kb, { title: tr("Jadwal keberangkatan", "Departures"), columns: [tr("Trip", "Trip"), tr("Hari", "Days"), tr("Berangkat", "Departs"), tr("Kuota", "Spots")], rows: [["Menjangan", tr("Setiap hari", "Daily"), "08.00", "12"], ["Nusa Penida", tr("Sel, Kam, Sab", "Tue, Thu, Sat"), "07.00", "10"], ["Komodo", tr("Tanggal 5 & 20", "5th & 20th"), "06.00", "16"]] }),
        end,
      ]);
    if (key === "courses")
      return pageC(kb, [
        head,
        steps(kb, { eyebrow: tr("Kursus", "Courses"), title: tr("Dari kolam ke laut lepas", "From pool to open water"), items: [[tr("Coba selam", "Try dive"), tr("1 hari, tanpa sertifikat.", "1 day, no certificate.")], ["Open Water", tr("3 hari, kedalaman 18 m.", "3 days, 18 m depth.")], ["Advanced", tr("2 hari, 30 m & navigasi.", "2 days, 30 m & navigation.")], ["Rescue", tr("3 hari, keselamatan.", "3 days, safety.")]] }),
        priceLines(kb, { title: tr("Biaya kursus", "Course fees"), groups: [{ title: tr("Pemula", "Beginner"), items: [[tr("Coba selam", "Try dive"), tr("Kolam + 1 selam laut", "Pool + 1 ocean dive"), "Rp1.250.000"], ["Open Water", tr("Termasuk e-learning", "Includes e-learning"), "Rp6.500.000"]] }, { title: tr("Lanjutan", "Continuing"), items: [["Advanced", tr("5 selam petualangan", "5 adventure dives"), "Rp5.200.000"], ["Rescue", tr("Termasuk EFR", "Includes first aid"), "Rp6.900.000"]] }] }),
        end,
      ]);
    if (key === "sites")
      return pageC(kb, [
        head,
        bento(kb, { eyebrow: tr("Titik selam", "Dive sites"), title: tr("Dari dinding karang ke kapal karam", "From coral walls to wrecks"), tiles: [{ title: tr("Dinding Menjangan", "Menjangan Wall"), text: tr("Gorgonia raksasa, visibilitas 30 m.", "Giant sea fans, 30 m visibility."), image: asset("v3c-reef"), wide: true }, { title: "Manta Point", text: tr("Pari manta hampir setiap hari.", "Mantas almost daily."), stat: "90%", tone: "primary" }, { title: "Crystal Bay", text: tr("Musim mola-mola Jul–Okt.", "Mola season Jul–Oct."), stat: "Jul–Okt" }, { title: tr("Kapal Anker", "Anchor Wreck"), text: tr("Kapal abad ke-19 di 40 m.", "A 19th-century wreck at 40 m."), tone: "dark" }, { title: tr("Taman Pemuteran", "Pemuteran Gardens"), text: tr("Restorasi karang biorock.", "Biorock reef restoration."), tone: "soft" }] }),
        counter(kb, { title: tr("Musim lalu", "Last season"), items: ["3.200 | " + tr("Penyelam", "Divers"), "14 | " + tr("Titik selam", "Sites"), "0 | " + tr("Insiden", "Incidents"), "1.200 | " + tr("Karang ditanam", "Corals planted")] }),
        end,
      ]);
    if (key === "gallery")
      return pageC(kb, [
        head,
        lightbox(kb, { title: tr("Dari bawah laut", "From below the surface"), images: [[asset("v3c-reef-deep"), tr("Karang Menjangan", "Menjangan reef")], [asset("v3c-reef"), tr("Ikan badut", "Clownfish")], [asset("v3c-reef"), tr("Penyelam di dinding", "Diver on the wall")], [asset("v3c-reef-deep"), tr("Taman biorock", "Biorock garden")], [asset("v3c-reef"), tr("Manta Point", "Manta Point")], [asset("v3c-reef"), tr("Senja di perahu", "Sunset on the boat")]], cols: 3 }),
        video(kb, { title: tr("Satu hari di Menjangan", "A day at Menjangan"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" }),
        end,
      ]);
    if (key === "book")
      return pageC(kb, [
        head,
        form(kb, { title: tr("Pesan trip atau kursus", "Book a trip or course"), info: [["WhatsApp", "+62 362 940 552"], [tr("Sertifikat", "Certification"), tr("Bawa kartu & logbook", "Bring card & logbook")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "select", label: tr("Pilihan", "Choice"), ph: tr("Pilih", "Choose"), options: ["Fun Dive", tr("Manta Penida", "Penida Mantas"), "Liveaboard", "Open Water"] }, { kind: "date", label: tr("Tanggal", "Date") }, { kind: "select", label: tr("Level", "Level"), ph: tr("Pilih", "Choose"), options: [tr("Belum pernah", "Never dived"), "Open Water", "Advanced", "Rescue+"] }], message: tr("Catatan kesehatan", "Health notes"), submit: tr("Kirim", "Send") }),
        faq(kb, { title: tr("Keselamatan", "Safety"), items: [[tr("Tidak bisa berenang?", "Can't swim?"), tr("Coba selam tetap bisa dengan instruktur 1:1.", "Try dives are still possible with a 1:1 instructor.")], [tr("Batas terbang setelah selam?", "Flying after diving?"), tr("Minimal 18 jam.", "At least 18 hours.")]] }),
        end,
      ]);
    return pageC(kb, [
      head,
      hero(kb, { kind: "oversized", eyebrow: tr("Menjangan · Nusa Penida · Komodo", "Menjangan · Nusa Penida · Komodo"), title: tr("Turun pelan, lihat lebih banyak", "Descend slowly, see more"), text: tr("Fun dive, kursus bersertifikat, dan liveaboard dengan rasio pemandu 1:4.", "Fun dives, certified courses and liveaboards with a 1:4 guide ratio."), acts: [[tr("Lihat trip", "See trips"), href("trips")], [tr("Kursus selam", "Dive courses"), href("courses"), "outline"]], image: asset("v3c-reef-deep"), alt: tr("Terumbu karang", "Coral reef") }),
      cardsC(kb, { title: tr("Kenapa menyelam bersama kami", "Why dive with us"), items: [{ image: asset("v3c-reef"), title: tr("Rasio 1:4", "1:4 ratio"), text: tr("Pemandu tidak pernah membawa lebih dari 4 tamu.", "Guides never take more than 4 guests.") }, { image: asset("v3c-reef"), title: tr("Alat terawat", "Serviced gear"), text: tr("Regulator diservis tiap 6 bulan.", "Regulators serviced every 6 months.") }, { image: asset("v3c-reef-deep"), title: tr("Restorasi karang", "Reef restoration"), text: tr("Rp50 ribu per tamu untuk biorock.", "Rp50k per guest goes to biorock.") }] }),
      counter(kb, { items: ["14 | " + tr("Titik selam", "Dive sites"), "1:4 | " + tr("Rasio pemandu", "Guide ratio"), "3.200 | " + tr("Penyelam/tahun", "Divers/year"), "4,9 | Rating"], bg: kb.alt }),
      cta(kb, { kind: "split", title: tr("Musim manta sedang berlangsung", "Manta season is on"), acts: [[tr("Pesan trip", "Book a trip"), href("book"), "light"]] }),
      end,
    ]);
  },
};

/* -------------- 22. Tattoo (PREMIUM, 4 hlm) — tinta gelap ------------ */

const JT: Palette = { ink: "#f5f5f4", muted: "#b8b2aa", primary: "#dc2626", primaryDark: "#991b1b", soft: "#fee2e2", line: "#fca5a5" };
const jt = lookC(JT, { head: "Pacifico", body: "Space Grotesk", skin: "line", radius: 0, bg: "#121110", alt: "#1c1a18", dark: "#0a0908", fx: { tilt: { max: 18, glare: true } }, btnR: 0, onDark: "#b8b2aa", accent2: "#f59e0b" });

const jtFoot = (tr: Tr) =>
  ftr(jt, "Jarum Tinta Studio", {
    kind: "columns",
    about: tr("Studio tato privat di Kuta Utara. Steril, berlisensi, dengan janji temu saja.", "A private tattoo studio in North Kuta. Sterile, licensed, by appointment only."),
    cols: [{ title: "Studio", items: ["Jl. Batu Mejan 7", tr("Sel–Sab 12.00–21.00", "Tue–Sat noon–9pm")] }, { title: tr("Booking", "Booking"), items: ["book@jarumtinta.id"] }],
    copy: tr("© 2026 Jarum Tinta Studio. Konten contoh. Usia minimal 18 tahun.", "© 2026 Jarum Tinta Studio. Sample content. 18+ only."),
    social: ["Instagram | https://instagram.com/jarumtinta"],
  });

export const creativeTattoo: TemplateContent = {
  brand: "Jarum Tinta Studio",
  pages: [home(), pg("artists", ["artis", "Artis"], ["artists", "Artists"]), pg("flash", ["flash-coverup", "Flash & Cover-up"], ["flash-coverup", "Flash & Cover-up"]), pg("book", ["booking", "Booking"], ["book", "Booking"])],
  build: (key, tr, href) => {
    const head = hdr(jt, "Jarum Tinta", { kind: "dark", cta: [tr("Booking", "Book"), href("book")] });
    const end = jtFoot(tr);
    if (key === "artists")
      return pageC(jt, [
        head,
        people(jt, { eyebrow: tr("Artis", "Artists"), title: tr("Tiga tangan, tiga gaya", "Three hands, three styles"), cols: 3, items: [{ name: "Gede Arsana", role: "Neo-traditional", photo: asset("v3c-face-3"), text: tr("Warna tebal, garis tegas.", "Bold colour, strong lines.") }, { name: "Maya Lestiani", role: "Fine line", photo: asset("v3c-face-4"), text: tr("Botani & huruf kecil.", "Botanicals & tiny script.") }, { name: "Rio Hutagalung", role: "Blackwork", photo: asset("v3c-face-1"), text: tr("Ornamen & pola Nusantara.", "Ornament & archipelago patterns.") }] }),
        lightbox(jt, { title: tr("Portofolio", "Portfolio"), images: [[asset("v3c-rose-flash"), tr("Mawar neo-traditional", "Neo-traditional rose")], [asset("v3c-tattoo-new"), tr("Cover-up lengan", "Forearm cover-up")], [asset("v3c-rose-flash"), tr("Lembar flash", "Flash sheet")], [asset("v3c-pattern"), tr("Pola blackwork", "Blackwork pattern")]], cols: 4, ratio: "3 / 4" }),
        end,
      ]);
    if (key === "flash")
      return pageC(jt, [
        head,
        beforeAfter(jt, { eyebrow: "Cover-up", title: tr("Tato lama, cerita baru", "Old tattoo, new story"), text: tr("Geser untuk melihat tato pudar yang kami tutup dengan mawar baru.", "Slide to see a faded tattoo covered by a new rose."), before: asset("v3c-tattoo-old"), after: asset("v3c-tattoo-new"), labels: [tr("Sebelum", "Before"), tr("Sesudah", "After")], alt: tr("Cover-up sebelum dan sesudah", "Cover-up before and after"), bullets: [tr("Konsultasi gratis", "Free consultation"), tr("2–3 sesi", "2–3 sessions")] }),
        priceLines(jt, { title: tr("Flash hari ini", "Today's flash"), groups: [{ title: tr("Kecil", "Small"), items: [[tr("Mawar mini", "Mini rose"), "5 cm", "Rp750.000"], [tr("Bintang", "Star"), "4 cm", "Rp600.000"]] }, { title: tr("Sedang", "Medium"), items: [[tr("Mawar penuh", "Full rose"), "12 cm", "Rp2.200.000"], [tr("Ular & belati", "Snake & dagger"), "15 cm", "Rp2.800.000"]] }], note: tr("Desain flash hanya ditato sekali.", "Each flash design is tattooed only once.") }),
        end,
      ]);
    if (key === "book")
      return pageC(jt, [
        head,
        form(jt, { title: tr("Booking sesi", "Book a session"), text: tr("DP Rp500 ribu mengunci jadwal dan dipotong dari total.", "A Rp500k deposit locks your slot and comes off the total."), info: [["Email", "book@jarumtinta.id"], [tr("Usia", "Age"), "18+"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "select", label: tr("Artis", "Artist"), ph: tr("Pilih", "Choose"), options: ["Gede Arsana", "Maya Lestiani", "Rio Hutagalung"] }, { kind: "input", label: tr("Lokasi tubuh & ukuran", "Placement & size"), ph: tr("Lengan bawah, 10 cm", "Forearm, 10 cm") }], message: tr("Ide desain", "Design idea"), submit: tr("Kirim", "Send") }),
        faq(jt, { title: tr("Perawatan", "Aftercare"), items: [[tr("Berapa lama sembuh?", "Healing time?"), tr("2–4 minggu.", "2–4 weeks.")], [tr("Boleh berenang?", "Swimming?"), tr("Tunggu 2 minggu.", "Wait two weeks.")], [tr("Jarum sekali pakai?", "Single-use needles?"), tr("Selalu.", "Always.")]] }),
        end,
      ]);
    return pageC(jt, [
      head,
      hero(jt, { kind: "split", eyebrow: tr("Kuta Utara · janji temu", "North Kuta · by appointment"), title: tr("Tinta yang kamu bawa seumur hidup", "Ink you carry for life"), text: tr("Neo-traditional, fine line, dan blackwork oleh tiga artis tetap. Steril dan tanpa terburu-buru.", "Neo-traditional, fine line and blackwork by three resident artists. Sterile and unhurried."), acts: [[tr("Booking", "Book"), href("book"), "light"], [tr("Flash", "Flash"), href("flash"), "outline"]], image: asset("v3c-rose-flash"), alt: tr("Desain mawar", "Rose design") }),
      strip(jt, { title: tr("Karya terbaru", "Latest work"), images: [[asset("v3c-rose-flash"), tr("Mawar", "Rose")], [asset("v3c-tattoo-new"), "Cover-up"], [asset("v3c-pattern"), "Blackwork"]] }),
      words(jt, ["Neo-trad", "Fine line", "Blackwork", "Cover-up"], { bg: jt.p.primaryDark }),
      cta(jt, { kind: "split", title: tr("Slot bulan depan dibuka", "Next month's slots are open"), acts: [[tr("Booking", "Book"), href("book"), "light"]], bg: jt.alt }),
      end,
    ]);
  },
};

/* -------- 23. Capsule Hotel (PREMIUM, 7 hlm) — retro oranye --------- */

const SK: Palette = { ink: "#2a1105", muted: "#6f4b37", primary: "#c2410c", primaryDark: "#9a3412", soft: "#ffedd5", line: "#fdba74" };
const sk = lookC(SK, { head: "Outfit", body: "Rubik", skin: "retro", radius: 16, bg: "#fffaf3", alt: "#fff1e2", dark: "#2a1105", fx: { aos: "flip-left", animate: "backInUp" }, btnR: 10, accent2: "#0ea5e9" });

const skFoot = (tr: Tr) =>
  ftr(sk, "Singgah Kapsul", {
    kind: "card",
    about: tr("Hotel kapsul 64 pod di dekat Stasiun Tugu, Yogyakarta. Check-in mandiri 24 jam.", "A 64-pod capsule hotel near Tugu Station, Yogyakarta. 24-hour self check-in."),
    cols: [{ title: tr("Alamat", "Address"), items: ["Jl. Pasar Kembang 12", "+62 274 512 077"] }, { title: tr("Info", "Info"), items: ["Check-in 14.00", "Check-out 12.00"] }],
    copy: tr("© 2026 Singgah Kapsul. Konten contoh.", "© 2026 Singgah Kapsul. Sample content."),
    social: ["Instagram | https://instagram.com/singgahkapsul", "TikTok | https://tiktok.com/@singgahkapsul"],
  });

export const hospitalityCapsuleHotel: TemplateContent = {
  brand: "Singgah Kapsul",
  pages: [
    home(),
    pg("pods", ["pod", "Pod & Kamar"], ["pods", "Pods & Rooms"]),
    pg("facilities", ["fasilitas", "Fasilitas"], ["facilities", "Facilities"]),
    pg("rates", ["tarif", "Tarif"], ["rates", "Rates"]),
    pg("area", ["sekitar", "Jelajah Sekitar"], ["nearby", "Nearby"]),
    pg("rules", ["aturan", "Aturan Rumah"], ["house-rules", "House Rules"]),
    pg("book", ["pesan", "Pesan"], ["book", "Book"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(sk, "Singgah Kapsul", { kind: "bar", cta: [tr("Cek ketersediaan", "Check availability"), href("book")] });
    const end = skFoot(tr);
    if (key === "pods")
      return pageC(sk, [
        head,
        banner(sk, { kind: "image", eyebrow: tr("64 pod", "64 pods"), title: tr("Kecil di luar, lega di dalam", "Small outside, roomy inside"), text: tr("Kasur 100 x 210 cm, lampu baca, colokan, dan tirai kedap cahaya.", "100 x 210 cm mattress, reading light, outlets and blackout curtain."), image: asset("v3c-capsule"), alt: tr("Pod kapsul", "Capsule pods") }),
        compare(sk, { title: tr("Pilih tipe pod", "Choose a pod type"), columns: ["Single", "Queen", tr("Privat", "Private")], rows: [tr("Kasur | 100 x 210 | 140 x 210 | 160 x 200", "Bed | 100 x 210 | 140 x 210 | 160 x 200"), tr("Kamar mandi | bersama | bersama | dalam", "Bathroom | shared | shared | ensuite"), tr("Loker | ya | ya | ya", "Locker | yes | yes | yes"), tr("Area wanita | ya | tidak | tidak", "Women-only floor | yes | no | no")], highlight: 1, caption: tr("Semua harga termasuk sarapan", "All rates include breakfast") }),
        end,
      ]);
    if (key === "facilities")
      return pageC(sk, [
        head,
        cardsC(sk, { eyebrow: tr("Fasilitas", "Facilities"), title: tr("Semua yang backpacker butuhkan", "Everything a backpacker needs"), items: [{ icon: "W", title: "Wi-Fi 200 Mbps", text: tr("Sampai ke dalam pod.", "Right inside your pod.") }, { icon: "D", title: tr("Dapur bersama", "Shared kitchen"), text: tr("Kopi & teh gratis 24 jam.", "Free 24-hour coffee & tea.") }, { icon: "L", title: tr("Laundry koin", "Coin laundry"), text: tr("Rp15 ribu per siklus.", "Rp15k per cycle.") }, { icon: "R", title: tr("Rooftop", "Rooftop"), text: tr("Pemandangan Merapi saat cerah.", "Merapi views on clear days.") }, { icon: "S", title: tr("Penitipan tas", "Luggage storage"), text: tr("Gratis sebelum check-in.", "Free before check-in.") }, { icon: "B", title: tr("Sewa sepeda", "Bike hire"), text: tr("Rp30 ribu per hari.", "Rp30k per day.") }] }),
        slider(sk, { slides: [{ title: tr("Rooftop senja", "Rooftop at dusk"), text: tr("Lantai 4, buka sampai 23.00", "Level 4, open until 11pm"), bg: sk.p.primary }, { title: tr("Dapur bersama", "Shared kitchen"), text: tr("Masak bareng tamu lain", "Cook with fellow guests"), bg: sk.p.primaryDark }], height: 280 }),
        end,
      ]);
    if (key === "rates")
      return pageC(sk, [
        head,
        table(sk, { eyebrow: tr("Tarif per malam", "Nightly rates"), title: tr("Harga sudah termasuk sarapan", "Rates include breakfast"), columns: [tr("Tipe", "Type"), tr("Hari kerja", "Weekday"), tr("Akhir pekan", "Weekend"), tr("Mingguan", "Weekly")], rows: [["Single", "Rp165.000", "Rp195.000", "Rp990.000"], ["Queen", "Rp245.000", "Rp285.000", "Rp1.450.000"], [tr("Privat", "Private"), "Rp420.000", "Rp480.000", "Rp2.500.000"]] }),
        statsBand(sk, tr, { eyebrow: tr("Kenapa tamu kembali", "Why guests return"), title: tr("Angka dari ulasan tamu", "Numbers from guest reviews"), stats: [["9,2", tr("Skor kebersihan", "Cleanliness score")], ["4 mnt", tr("Jalan ke stasiun", "Walk to station")], ["38%", tr("Tamu kembali", "Returning guests")], ["24/7", tr("Check-in mandiri", "Self check-in")]] }),
        end,
      ]);
    if (key === "area")
      return pageC(sk, [
        head,
        numbered(sk, { eyebrow: tr("Jelajah", "Explore"), title: tr("Dalam 15 menit jalan kaki", "Within a 15-minute walk"), items: [["Malioboro", tr("5 menit — belanja & angkringan.", "5 min — shopping & street food.")], [tr("Stasiun Tugu", "Tugu Station"), tr("4 menit — kereta ke seluruh Jawa.", "4 min — trains across Java.")], [tr("Kampung Ketandan", "Ketandan Quarter"), tr("10 menit — kuliner pecinan.", "10 min — Chinatown food.")], [tr("Taman Pintar", "Science Park"), tr("15 menit — museum sains.", "15 min — a science museum.")]] }),
        chips(sk, { title: tr("Tur yang bisa dipesan di resepsionis", "Tours bookable at reception"), chips: [tr("Sunrise Borobudur", "Borobudur sunrise"), tr("Jip Merapi", "Merapi jeep"), tr("Kelas batik", "Batik class"), tr("Goa Jomblang", "Jomblang Cave"), tr("Sepeda desa", "Village cycling")] }),
        end,
      ]);
    if (key === "rules")
      return pageC(sk, [
        head,
        banner(sk, { kind: "center", eyebrow: tr("Aturan rumah", "House rules"), title: tr("Supaya semua bisa tidur nyenyak", "So everyone sleeps well") }),
        faq(sk, { title: tr("Aturan & kebijakan", "Rules & policies"), items: [[tr("Jam tenang?", "Quiet hours?"), "22.00–07.00"], [tr("Boleh merokok?", "Smoking?"), tr("Hanya di rooftop area terbuka.", "Only on the open rooftop.")], [tr("Batas usia?", "Age limit?"), tr("Minimal 16 tahun.", "16 and over.")], [tr("Pembatalan?", "Cancellation?"), tr("Gratis H-2.", "Free up to 2 days before.")]] }),
        quotes(sk, { title: tr("Kata tamu", "Guest words"), items: [{ quote: tr("Pod-nya bersih dan benar-benar gelap. Tidur pulas sebelum kereta pagi.", "The pod was clean and truly dark. Slept well before my early train."), author: "Lukas B.", role: tr("Tamu dari Jerman", "Guest from Germany"), avatar: asset("v3c-face-3") }, { quote: tr("Lantai khusus wanita bikin saya tenang solo traveling.", "The women-only floor made solo travel feel safe."), author: "Putri A.", role: tr("Tamu dari Medan", "Guest from Medan"), avatar: asset("v3c-face-2") }] }),
        end,
      ]);
    if (key === "book")
      return pageC(sk, [
        head,
        form(sk, { title: tr("Cek ketersediaan", "Check availability"), info: [["WhatsApp", "+62 274 512 077"], [tr("Pembayaran", "Payment"), tr("Di tempat saat check-in", "On arrival")]], fields: [{ kind: "date", label: "Check-in" }, { kind: "date", label: "Check-out" }, { kind: "select", label: tr("Tipe pod", "Pod type"), ph: tr("Pilih", "Choose"), options: ["Single", "Queen", tr("Privat", "Private")] }, { kind: "check", label: tr("Lantai khusus wanita", "Women-only floor") }], submit: tr("Kirim permintaan", "Send request") }),
        infoTiles(sk, [["Check-in", "14.00"], ["Check-out", "12.00"], [tr("Stasiun", "Station"), tr("4 menit", "4 min")]]),
        end,
      ]);
    return pageC(sk, [
      head,
      hero(sk, { kind: "poster", meta: ["Singgah Kapsul", "Yogyakarta"], title: tr("Tidur nyenyak, dekat stasiun", "Sleep well, steps from the station"), text: tr("64 pod kedap cahaya, rooftop, dan sarapan gudeg. Mulai Rp165 ribu per malam.", "64 blackout pods, a rooftop and a gudeg breakfast. From Rp165k a night."), acts: [[tr("Cek ketersediaan", "Check availability"), href("book")], [tr("Lihat pod", "See the pods"), href("pods"), "outline"]], image: asset("v3c-capsule"), alt: tr("Pod kapsul", "Capsule pods"), chips: ["Wi-Fi 200 Mbps", tr("Lantai wanita", "Women's floor"), tr("Check-in 24 jam", "24h check-in")] }),
      slider(sk, { slides: [{ title: tr("Pod Queen", "Queen pod"), text: tr("Untuk berdua, Rp245 ribu", "For two, Rp245k"), bg: sk.p.primary }, { title: tr("Rooftop", "Rooftop"), text: tr("Kopi gratis saat senja", "Free coffee at dusk"), bg: "#0ea5e9" }, { title: tr("Sarapan gudeg", "Gudeg breakfast"), text: tr("Setiap pagi 06.30–10.00", "Every morning 6:30–10am"), bg: sk.p.primaryDark }], height: 300 }),
      bigNumbers(sk, [["64", tr("Pod", "Pods")], ["4 mnt", tr("Ke Stasiun Tugu", "To Tugu Station")], ["9,2", tr("Skor kebersihan", "Cleanliness")]]),
      cta(sk, { kind: "sticker", title: tr("Kereta pagi besok?", "Early train tomorrow?"), text: tr("Singgah malam ini, jalan 4 menit ke peron.", "Stay tonight, walk 4 minutes to the platform."), acts: [[tr("Pesan", "Book"), href("book")]] }),
      end,
    ]);
  },
};

/* -------------- 24. Edtech (PREMIUM, 9 hlm) — pastel ungu ------------ */

const LK: Palette = { ink: "#2a0f45", muted: "#5f4b78", primary: "#9333ea", primaryDark: "#7e22ce", soft: "#f3e8ff", line: "#e9d5ff" };
const lk = lookC(LK, { head: "Plus Jakarta Sans", body: "Inter", skin: "soft", radius: 24, bg: "#fdfaff", alt: "#f6effe", dark: "#1e0b33", fx: { aos: "fade-up", animate: "fadeInUp", tilt: { max: 10 } }, btnR: 14, onDark: "#d8c3f0", accent2: "#22c55e" });

const lkFoot = (tr: Tr) =>
  ftr(lk, "Lentera Kelas", {
    kind: "giant",
    about: tr("Aplikasi belajar adaptif untuk SD–SMA: latihan 10 menit sehari yang menyesuaikan kemampuan anak.", "An adaptive learning app for grades 1–12: 10 minutes of practice a day that adjusts to each child."),
    cols: [{ title: tr("Produk", "Product"), items: [tr("Fitur", "Features"), tr("Harga", "Pricing"), tr("Untuk sekolah", "For schools")] }, { title: tr("Perusahaan", "Company"), items: [tr("Tentang", "About"), tr("Karier", "Careers"), tr("Blog", "Blog")] }],
    copy: tr("© 2026 Lentera Kelas. Konten contoh.", "© 2026 Lentera Kelas. Sample content."),
    social: ["Instagram | https://instagram.com/lenterakelas", "YouTube | https://youtube.com/@lenterakelas", "LinkedIn | https://linkedin.com/company/lenterakelas"],
  });

export const startupEdtech: TemplateContent = {
  brand: "Lentera Kelas",
  pages: [
    home(),
    pg("features", ["fitur", "Fitur"], ["features", "Features"]),
    pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]),
    pg("schools", ["sekolah", "Untuk Sekolah"], ["schools", "For Schools"]),
    pg("parents", ["orang-tua", "Untuk Orang Tua"], ["parents", "For Parents"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("careers", ["karier", "Karier"], ["careers", "Careers"]),
    pg("blog", ["blog", "Blog"], ["blog", "Blog"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const nav = mega(lk, [`${tr("Produk", "Product")} | ${href("features")}`, `- ${tr("Latihan adaptif", "Adaptive practice")} | ${tr("Soal menyesuaikan kemampuan", "Questions adapt to skill")} | ${href("features")}`, `- ${tr("Rapor orang tua", "Parent report")} | ${tr("Ringkasan mingguan", "Weekly summary")} | ${href("parents")}`, `- ${tr("Dasbor guru", "Teacher dashboard")} | ${tr("Pantau satu kelas", "Track a whole class")} | ${href("schools")}`, `${tr("Harga", "Pricing")} | ${href("pricing")}`, `${tr("Sekolah", "Schools")} | ${href("schools")}`, `Blog | ${href("blog")}`], tr("Coba gratis", "Try free"), href("pricing"));
    const head = hdr(lk, "Lentera Kelas", { kind: "pill", nav, sticky: true });
    const end = lkFoot(tr);
    if (key === "features")
      return pageC(lk, [
        head,
        banner(lk, { kind: "center", eyebrow: tr("Fitur", "Features"), title: tr("10 menit sehari yang benar-benar dipakai", "10 minutes a day that actually stick") }),
        bento(lk, { title: tr("Apa yang ada di aplikasi", "Inside the app"), tiles: [{ title: tr("Latihan adaptif", "Adaptive practice"), text: tr("Soal naik-turun level sesuai jawaban anak.", "Questions move up or down with each answer."), image: asset("v3c-app"), wide: true }, { title: tr("Rentetan harian", "Daily streaks"), text: tr("Lencana & hadiah kecil.", "Badges & small rewards."), stat: "21 hari", tone: "primary" }, { title: tr("Mode offline", "Offline mode"), text: tr("Unduh 50 soal untuk perjalanan.", "Download 50 questions for the road."), stat: "50" }, { title: tr("Pembahasan video", "Video explanations"), text: tr("Durasi 90 detik per konsep.", "90 seconds per concept."), tone: "dark" }, { title: tr("Kurikulum Merdeka", "National curriculum"), text: tr("Matematika, IPA, Bahasa.", "Maths, science, languages."), tone: "soft" }] }),
        compare(lk, { title: tr("Gratis vs Plus", "Free vs Plus"), columns: [tr("Gratis", "Free"), "Plus", tr("Sekolah", "School")], rows: [tr("Latihan harian | 5 soal | tanpa batas | tanpa batas", "Daily practice | 5 questions | unlimited | unlimited"), tr("Rapor orang tua | tidak | ya | ya", "Parent report | no | yes | yes"), tr("Mode offline | tidak | ya | ya", "Offline mode | no | yes | yes"), tr("Dasbor guru | tidak | tidak | ya", "Teacher dashboard | no | no | yes")], highlight: 2, caption: tr("Bandingkan paket", "Compare plans") }),
        end,
      ]);
    if (key === "pricing")
      return pageC(lk, [
        head,
        priceSwitch(lk, { eyebrow: tr("Harga", "Pricing"), title: tr("Mulai gratis, upgrade kapan saja", "Start free, upgrade any time"), plans: [tr("Gratis | Rp0 | Rp0 | 5 soal/hari; 1 profil anak; Pembahasan teks | Mulai", "Free | Rp0 | Rp0 | 5 questions/day; 1 child profile; Text explanations | Start"), tr("Plus | Rp49rb | Rp470rb | Soal tanpa batas; 3 profil anak; Video pembahasan; Rapor mingguan | Coba 14 hari", "Plus | Rp49k | Rp470k | Unlimited questions; 3 child profiles; Video explanations; Weekly report | Try 14 days"), tr("Sekolah | Rp15rb | Rp150rb | Per siswa; Dasbor guru; Ujian kelas; Pelatihan guru | Hubungi kami", "School | Rp15k | Rp150k | Per student; Teacher dashboard; Class tests; Teacher training | Contact us")], labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 20%", "Save 20%"), tr("/bulan", "/month"), tr("/tahun", "/year")], href: href("contact") }),
        faq(lk, { title: tr("Soal pembayaran", "About billing"), items: [[tr("Bisa berhenti kapan saja?", "Cancel any time?"), tr("Ya, tanpa biaya.", "Yes, no fees.")], [tr("Ada diskon keluarga?", "Family discount?"), tr("Paket Plus sudah untuk 3 anak.", "Plus already covers 3 children.")]] }),
        end,
      ]);
    if (key === "schools")
      return pageC(lk, [
        head,
        hero(lk, { kind: "split", eyebrow: tr("Untuk sekolah", "For schools"), title: tr("Satu dasbor untuk satu kelas", "One dashboard for a whole class"), text: tr("Guru melihat konsep mana yang belum dipahami sebelum ulangan, bukan sesudahnya.", "Teachers see which concepts are shaky before the test, not after."), acts: [[tr("Minta demo", "Request a demo"), href("contact"), "light"]], image: asset("v3c-app"), alt: tr("Dasbor guru", "Teacher dashboard") }),
        counter(lk, { title: tr("Di 420 sekolah", "In 420 schools"), items: ["420 | " + tr("Sekolah", "Schools"), "68.000 | " + tr("Siswa", "Students"), "+18% | " + tr("Nilai rata-rata", "Average score"), "3.100 | " + tr("Guru", "Teachers")] }),
        quotes(lk, { title: tr("Kata guru", "From teachers"), items: [{ quote: tr("Saya tahu siapa yang butuh bantuan pecahan sebelum ulangan.", "I know who needs help with fractions before the test."), author: "Bu Wulan Sari", role: tr("Guru SD, Sleman", "Primary teacher, Sleman"), avatar: asset("v3c-face-4") }, { quote: tr("Anak-anak berebut menjaga rentetan harian.", "Kids compete to keep their streaks."), author: "Pak Daniel Siregar", role: tr("Guru SMP, Medan", "Middle school teacher, Medan"), avatar: asset("v3c-face-3") }] }),
        end,
      ]);
    if (key === "parents")
      return pageC(lk, [
        head,
        split(lk, { eyebrow: tr("Untuk orang tua", "For parents"), title: tr("Rapor mingguan tanpa drama", "A weekly report, no drama"), paras: [tr("Setiap Minggu malam Anda menerima ringkasan: konsep yang dikuasai, yang perlu diulang, dan satu ide aktivitas di rumah.", "Every Sunday night you get a summary: concepts mastered, ones to review and one idea for home.")], bullets: [tr("Batas waktu layar", "Screen-time limits"), tr("Tanpa iklan", "No ads"), tr("Data anak tidak dijual", "Child data never sold")], image: asset("v3c-app"), alt: tr("Rapor di aplikasi", "Report in the app"), tone: "soft" }),
        steps(lk, { title: tr("Mulai dalam 3 menit", "Start in 3 minutes"), items: [[tr("Unduh", "Download"), tr("Android & iOS.", "Android & iOS.")], [tr("Tes penempatan", "Placement test"), tr("10 soal singkat.", "10 quick questions.")], [tr("Belajar 10 menit", "Learn 10 minutes"), tr("Setiap hari.", "Every day.")]] }),
        end,
      ]);
    if (key === "about")
      return pageC(lk, [
        head,
        timelineC(lk, { eyebrow: tr("Cerita kami", "Our story"), title: tr("Dari les privat ke 1 juta pengguna", "From private tutoring to 1 million users"), items: [tr("2021 | Les di garasi | Tiga mahasiswa mengajar anak tetangga.", "2021 | Garage tutoring | Three students taught neighbourhood kids."), tr("2023 | Aplikasi pertama | 10.000 unduhan di bulan pertama.", "2023 | First app | 10,000 downloads in month one."), tr("2025 | Pendanaan awal | Masuk 400 sekolah.", "2025 | Seed funding | Reached 400 schools."), tr("2026 | 1 juta pengguna | Mode offline untuk daerah 3T.", "2026 | 1 million users | Offline mode for remote areas.")], image: asset("v3c-app"), alt: tr("Aplikasi", "App") }),
        teamCards(lk, tr, { title: tr("Tim pendiri", "Founding team"), members: [{ name: "Raditya Wicaksono", role: "CEO", photo: asset("v3c-face-1") }, { name: "Intan Permatasari", role: tr("Kepala Kurikulum", "Head of Curriculum"), photo: asset("v3c-face-2") }, { name: "Kevin Halim", role: "CTO", photo: asset("v3c-face-3") }] }),
        end,
      ]);
    if (key === "careers")
      return pageC(lk, [
        head,
        cardsC(lk, { eyebrow: tr("Karier", "Careers"), title: tr("Bantu 10 juta anak belajar", "Help 10 million kids learn"), cols: 2, items: [{ title: "Senior Mobile Engineer", text: tr("Flutter, mode offline, performa ponsel murah.", "Flutter, offline mode, budget-phone performance."), meta: tr("Jakarta / remote", "Jakarta / remote") }, { title: tr("Penulis soal Matematika", "Maths content writer"), text: tr("Kurikulum SD–SMP.", "Primary–middle school curriculum."), meta: "Remote" }, { title: "Data Analyst", text: tr("Mengukur dampak belajar.", "Measuring learning impact."), meta: "Jakarta" }, { title: tr("Partnership Sekolah", "School Partnerships"), text: tr("Wilayah Indonesia Timur.", "Eastern Indonesia region."), meta: "Makassar" }] }),
        chips(lk, { title: tr("Benefit", "Benefits"), chips: [tr("Kerja hybrid", "Hybrid work"), tr("Asuransi keluarga", "Family insurance"), tr("Anggaran belajar Rp10 jt", "Rp10m learning budget"), tr("Cuti 18 hari", "18 days leave")], bg: lk.alt }),
        end,
      ]);
    if (key === "blog")
      return pageC(lk, [
        head,
        journal(lk, { eyebrow: "Blog", title: tr("Tips belajar & kabar produk", "Study tips & product news"), read: tr("Baca", "Read"), href: href("blog"), items: [{ image: asset("v3c-app"), tag: tr("Tips", "Tips"), date: "Nov 2026", title: tr("Kenapa 10 menit lebih baik dari 2 jam", "Why 10 minutes beats 2 hours"), text: tr("Ilmu di balik latihan berjarak.", "The science of spaced practice.") }, { image: asset("v3c-app"), tag: tr("Produk", "Product"), date: "Okt 2026", title: tr("Mode offline untuk daerah 3T", "Offline mode for remote regions"), text: tr("Belajar tanpa sinyal.", "Learning without signal.") }, { image: asset("v3c-app"), tag: tr("Orang tua", "Parents"), date: "Sep 2026", title: tr("Menemani tanpa mengambil alih", "Supporting without taking over"), text: tr("Peran orang tua saat anak belajar.", "A parent's role during study time.") }] }),
        newsletter(lk, { title: tr("Kabar bulanan", "Monthly news"), text: tr("Tips belajar untuk orang tua & guru.", "Study tips for parents & teachers."), ph: "email@contoh.id", submit: tr("Daftar", "Subscribe") }),
        end,
      ]);
    if (key === "contact")
      return pageC(lk, [
        head,
        form(lk, { title: tr("Hubungi tim Lentera", "Contact the Lentera team"), info: [["Email", "halo@lenterakelas.id"], [tr("Sekolah", "Schools"), "sekolah@lenterakelas.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "select", label: tr("Saya adalah", "I am a"), ph: tr("Pilih", "Choose"), options: [tr("Orang tua", "Parent"), tr("Guru", "Teacher"), tr("Kepala sekolah", "Principal"), tr("Lainnya", "Other")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
        infoTiles(lk, [[tr("Kantor", "Office"), "Jl. Kemang Raya 4, Jakarta"], [tr("Jam CS", "Support hours"), "08.00–20.00"]]),
        end,
      ]);
    return pageC(lk, [
      head,
      hero(lk, { kind: "pastel", badge: tr("1 juta pengguna", "1 million users"), titleNode: typer(lk, tr("Belajar 10 menit untuk", "10 minutes a day for"), [tr("Matematika", "Maths"), "IPA", tr("Bahasa Inggris", "English")], { size: 54, align: "center" }), title: "Lentera Kelas", text: tr("Latihan adaptif yang menyesuaikan kemampuan anak, rapor mingguan untuk orang tua, dan dasbor untuk guru.", "Adaptive practice that adjusts to each child, weekly reports for parents and a dashboard for teachers."), acts: [[tr("Coba gratis", "Try free"), href("pricing")], [tr("Untuk sekolah", "For schools"), href("schools"), "outline"]], image: asset("v3c-app"), alt: tr("Aplikasi belajar", "Learning app") }),
      counter(lk, { items: ["1 jt | " + tr("Pengguna", "Users"), "420 | " + tr("Sekolah", "Schools"), "+18% | " + tr("Nilai", "Scores"), "4,8 | Rating"] }),
      cardsC(lk, { title: tr("Untuk semua yang terlibat", "For everyone involved"), items: [{ image: asset("v3c-app"), title: tr("Anak", "Kids"), text: tr("Soal pas, tidak terlalu mudah atau sulit.", "Questions that are just right.") }, { image: asset("v3c-app"), title: tr("Orang tua", "Parents"), text: tr("Rapor mingguan yang jelas.", "A clear weekly report.") }, { image: asset("v3c-app"), title: tr("Guru", "Teachers"), text: tr("Dasbor satu kelas.", "A whole-class dashboard.") }] }),
      quotes(lk, { title: tr("Cerita pengguna", "User stories"), items: [{ quote: tr("Anak saya minta latihan sendiri tiap malam.", "My daughter asks to practise every night."), author: "Ibu Ratna", role: tr("Orang tua, Bekasi", "Parent, Bekasi"), avatar: asset("v3c-face-2"), rating: 5 }, { quote: tr("Nilai pecahan kelas saya naik 20 poin.", "My class's fraction scores rose 20 points."), author: "Pak Andi", role: tr("Guru, Kupang", "Teacher, Kupang"), avatar: asset("v3c-face-1"), rating: 5 }, { quote: tr("Mode offline penting buat kami di pulau.", "Offline mode matters on our island."), author: "Kak Maria", role: tr("Relawan, Alor", "Volunteer, Alor"), avatar: asset("v3c-face-4"), rating: 5 }] }),
      cta(lk, { kind: "giant", title: tr("Mulai rentetan pertama hari ini", "Start your first streak today"), acts: [[tr("Coba gratis", "Try free"), href("pricing"), "light"]], bg: lk.p.primaryDark }),
      end,
    ]);
  },
};

/* --------- 25. Konsultan Pajak (PREMIUM, 10 hlm) — editorial biru ---- */

const TW: Palette = { ink: "#0f1d3d", muted: "#4a5878", primary: "#1e3a8a", primaryDark: "#172554", soft: "#e0e7ff", line: "#c7d2fe" };
const tw = lookC(TW, { head: "Merriweather", body: "Work Sans", skin: "editorial", radius: 8, bg: "#ffffff", alt: "#f4f6fb", dark: "#0b1530", fx: { aos: "fade-up" }, btnR: 6, onDark: "#b6c2e2", accent2: "#b45309" });

const twFoot = (tr: Tr) =>
  ftr(tw, "Taksasi Wibawa & Rekan", {
    kind: "columns",
    about: tr("Konsultan pajak terdaftar untuk perusahaan, UMKM, dan pribadi. Kantor di Jakarta dan Surabaya.", "Registered tax consultants for companies, SMEs and individuals. Offices in Jakarta and Surabaya."),
    cols: [{ title: tr("Layanan", "Services"), items: [tr("Pajak badan", "Corporate tax"), tr("Pajak pribadi", "Personal tax"), tr("Pemeriksaan & keberatan", "Audits & objections")] }, { title: tr("Kantor", "Offices"), items: ["Jl. Jend. Sudirman 52, Jakarta", "Jl. Basuki Rahmat 18, Surabaya"] }],
    copy: tr("© 2026 Taksasi Wibawa & Rekan. Konten contoh, bukan nasihat pajak.", "© 2026 Taksasi Wibawa & Rekan. Sample content, not tax advice."),
    social: ["LinkedIn | https://linkedin.com/company/taksasiwibawa", "YouTube | https://youtube.com/@taksasiwibawa"],
    backTop: tr("Kembali ke atas", "Back to top"),
  });

export const companyKonsultanPajak: TemplateContent = {
  brand: "Taksasi Wibawa & Rekan",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("corporate", ["pajak-badan", "Pajak Badan"], ["corporate-tax", "Corporate Tax"]),
    pg("personal", ["pajak-pribadi", "Pajak Pribadi"], ["personal-tax", "Personal Tax"]),
    pg("audit", ["pemeriksaan", "Pemeriksaan"], ["tax-audits", "Tax Audits"]),
    pg("team", ["tim", "Tim"], ["team", "Team"]),
    pg("calendar", ["kalender-pajak", "Kalender Pajak"], ["tax-calendar", "Tax Calendar"]),
    pg("insights", ["wawasan", "Wawasan"], ["insights", "Insights"]),
    pg("faq", ["faq", "FAQ"], ["faq", "FAQ"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(tw, "Taksasi Wibawa", { kind: "bar", cta: [tr("Konsultasi", "Consultation"), href("contact")], strip: tr("Batas lapor SPT Tahunan Badan: 30 April", "Corporate annual return deadline: 30 April") });
    const end = twFoot(tr);
    if (key === "services")
      return pageC(tw, [
        head,
        banner(tw, { kind: "rule", eyebrow: tr("Layanan", "Services"), title: tr("Kepatuhan, perencanaan, pendampingan", "Compliance, planning, representation"), text: tr("Ruang lingkup dan biaya tertulis sebelum pekerjaan dimulai.", "Written scope and fees before work begins.") }),
        servicesSplit(tw, tr, { eyebrow: tr("Lingkup kerja", "Scope"), title: tr("Empat layanan inti", "Four core services"), image: asset("v3c-tax"), imageAlt: tr("Dokumen pajak", "Tax documents"), items: [{ icon: "01", title: tr("Kepatuhan bulanan", "Monthly compliance"), text: tr("PPh 21/23/4(2), PPN, e-Faktur.", "Withholding taxes, VAT, e-invoicing.") }, { icon: "02", title: tr("SPT Tahunan", "Annual returns"), text: tr("Badan & orang pribadi.", "Corporate & individual.") }, { icon: "03", title: tr("Perencanaan pajak", "Tax planning"), text: tr("Struktur usaha & transfer pricing.", "Business structure & transfer pricing.") }, { icon: "04", title: tr("Sengketa", "Disputes"), text: tr("Pemeriksaan, keberatan, banding.", "Audits, objections, appeals.") }], cta: { label: tr("Minta proposal", "Request a proposal"), href: href("contact") } }),
        compare(tw, { title: tr("Paket retainer", "Retainer packages"), columns: ["UMKM", tr("Menengah", "Mid-size"), "Korporasi"], rows: [tr("Omzet | < Rp4,8 M | Rp4,8–50 M | > Rp50 M", "Turnover | < Rp4.8B | Rp4.8–50B | > Rp50B"), tr("Laporan bulanan | ya | ya | ya", "Monthly filing | yes | yes | yes"), tr("Review transfer pricing | tidak | opsional | ya", "Transfer pricing review | no | optional | yes"), tr("Pendampingan pemeriksaan | tidak | ya | ya", "Audit representation | no | yes | yes")], highlight: 2, caption: tr("Biaya disesuaikan volume transaksi", "Fees scale with transaction volume") }),
        end,
      ]);
    if (key === "corporate")
      return pageC(tw, [
        head,
        hero(tw, { kind: "editorial", meta: [tr("Pajak badan", "Corporate tax"), tr("PT, CV, koperasi", "Companies, partnerships, co-ops")], title: tr("Laporan rapi, tidur tenang", "Tidy filings, peaceful sleep"), text: tr("Kami menangani pajak bulanan dan tahunan sehingga tim keuangan Anda fokus pada bisnis.", "We handle monthly and annual tax so your finance team can focus on the business."), acts: [[tr("Minta proposal", "Request a proposal"), href("contact")]], image: asset("v3c-tax"), alt: tr("Dokumen pajak", "Tax documents") }),
        numbered(tw, { title: tr("Yang kami kerjakan tiap bulan", "What we do every month"), items: [[tr("Rekonsiliasi", "Reconciliation"), tr("Cocokkan buku besar dengan faktur.", "Match the ledger to invoices.")], [tr("Hitung & setor", "Calculate & pay"), tr("Kode billing sebelum tanggal 10.", "Billing codes before the 10th.")], [tr("Lapor", "File"), tr("SPT Masa sebelum tanggal 20.", "Monthly returns before the 20th.")], [tr("Laporan manajemen", "Management report"), tr("Ringkasan beban pajak 1 halaman.", "A one-page tax summary.")]] }),
        end,
      ]);
    if (key === "personal")
      return pageC(tw, [
        head,
        split(tw, { eyebrow: tr("Pajak pribadi", "Personal tax"), title: tr("SPT pribadi tanpa begadang", "Personal returns without late nights"), paras: [tr("Untuk karyawan dengan penghasilan lain, profesional, dan pemilik usaha perorangan.", "For employees with side income, professionals and sole proprietors.")], bullets: [tr("Pelaporan harta & utang", "Assets & liabilities"), tr("Penghasilan luar negeri", "Foreign income"), tr("Pembetulan SPT lama", "Amending past returns")], image: asset("v3c-tax"), alt: tr("Kalkulator", "Calculator"), tone: "soft" }),
        priceLines(tw, { title: tr("Biaya tetap", "Fixed fees"), groups: [{ title: tr("Karyawan", "Employees"), items: [[tr("SPT 1770 S", "Standard return"), tr("Satu pemberi kerja + harta", "One employer + assets"), "Rp450.000"], [tr("Pembetulan", "Amendment"), tr("Per tahun pajak", "Per tax year"), "Rp650.000"]] }, { title: tr("Profesional & usaha", "Professionals & business"), items: [[tr("SPT 1770", "Business return"), tr("Dengan norma/pembukuan", "Deemed profit or books"), tr("mulai Rp1.500.000", "from Rp1,500,000")], [tr("Penghasilan luar negeri", "Foreign income"), tr("Kredit pajak luar negeri", "Foreign tax credit"), tr("mulai Rp2.500.000", "from Rp2,500,000")]] }] }),
        end,
      ]);
    if (key === "audit")
      return pageC(tw, [
        head,
        banner(tw, { kind: "band", eyebrow: tr("Pemeriksaan & sengketa", "Audits & disputes"), title: tr("Didampingi sejak surat pertama", "Represented from the first letter") }),
        timelineC(tw, { title: tr("Alur pendampingan", "Representation flow"), items: [tr("Hari 1 | Telaah surat | Kami baca SP2DK atau SPHP bersama Anda.", "Day 1 | Review the letter | We read the notice with you."), tr("Minggu 1 | Siapkan data | Daftar dokumen & rekonsiliasi.", "Week 1 | Prepare data | Document list & reconciliation."), tr("Minggu 2–6 | Pembahasan | Kami hadir di setiap pertemuan.", "Weeks 2–6 | Discussions | We attend every meeting."), tr("Setelahnya | Keberatan/banding | Bila hasil belum adil.", "Afterwards | Objection/appeal | If the outcome is unfair.")] }),
        modalOffer(tw, { title: tr("Baru menerima surat dari kantor pajak?", "Just received a tax office letter?"), text: tr("Jangan panik. Kirim fotonya, kami telaah gratis.", "Don't panic. Send a photo; we review it for free."), trigger: tr("Telaah gratis", "Free review"), modalTitle: tr("Telaah surat gratis", "Free letter review"), body: tr("Kirim foto surat (SP2DK, SPHP, atau STP) lewat formulir kontak. Kami membalas dalam 1 hari kerja dengan langkah awal yang perlu dilakukan.", "Send a photo of the letter through our contact form. We reply within one working day with the first steps to take."), cta: [tr("Kirim surat", "Send the letter"), href("contact")] }),
        end,
      ]);
    if (key === "team")
      return pageC(tw, [
        head,
        teamCards(tw, tr, { eyebrow: tr("Rekan", "Partners"), title: tr("Konsultan bersertifikat", "Certified consultants"), members: [{ name: "Wibawa Hadiprawiro, S.E., Ak.", role: tr("Managing partner · Brevet C", "Managing partner · Level C"), photo: asset("v3c-face-1") }, { name: "Theresia Nainggolan", role: tr("Partner · Transfer pricing", "Partner · Transfer pricing"), photo: asset("v3c-face-4") }, { name: "Ardi Kurniawan", role: tr("Senior manager · Sengketa", "Senior manager · Disputes"), photo: asset("v3c-face-3") }, { name: "Siti Mardiyah", role: tr("Manajer · Pajak pribadi", "Manager · Personal tax"), photo: asset("v3c-face-2") }] }),
        statsBand(tw, tr, { eyebrow: tr("Rekam jejak", "Track record"), title: tr("Sejak 2009", "Since 2009"), text: tr("Klien dari manufaktur, ritel, teknologi, dan nirlaba.", "Clients in manufacturing, retail, tech and non-profit."), stats: [["380+", tr("Klien aktif", "Active clients")], ["17", tr("Tahun", "Years")], ["86%", tr("Keberatan dikabulkan", "Objections granted")], ["24", tr("Konsultan", "Consultants")]] }),
        end,
      ]);
    if (key === "calendar")
      return pageC(tw, [
        head,
        table(tw, { eyebrow: tr("Kalender pajak", "Tax calendar"), title: tr("Tanggal penting setiap bulan", "Key dates every month"), columns: [tr("Tanggal", "Date"), tr("Kewajiban", "Obligation"), tr("Untuk", "For")], rows: [["10", tr("Setor PPh potong/pungut", "Pay withholding taxes"), tr("Pemotong", "Withholders")], ["15", tr("Setor PPh 25 & PPh final UMKM", "Pay instalments & SME final tax"), tr("Badan & UMKM", "Companies & SMEs")], ["20", tr("Lapor SPT Masa PPh", "File monthly income tax returns"), tr("Semua pemotong", "All withholders")], [tr("Akhir bulan", "Month end"), tr("Setor & lapor PPN", "Pay & file VAT"), "PKP"]], note: tr("Bila jatuh pada hari libur, bergeser ke hari kerja berikutnya.", "If on a holiday, it moves to the next working day.") }),
        tabs(tw, { title: tr("Tenggat tahunan", "Annual deadlines"), tabs: [[tr("Orang pribadi", "Individuals"), tr("SPT Tahunan paling lambat 31 Maret.", "Annual return by 31 March.")], [tr("Badan", "Companies"), tr("SPT Tahunan paling lambat 30 April.", "Annual return by 30 April.")], [tr("Transfer pricing", "Transfer pricing"), tr("Dokumen lokal tersedia 4 bulan setelah tahun buku.", "Local file ready 4 months after year end.")]], variant: "boxed" }),
        end,
      ]);
    if (key === "insights")
      return pageC(tw, [
        head,
        journal(tw, { eyebrow: tr("Wawasan", "Insights"), title: tr("Catatan pajak terbaru", "Latest tax notes"), read: tr("Baca", "Read"), href: href("insights"), items: [{ image: asset("v3c-tax"), tag: "PPN", date: "Nov 2026", title: tr("Lima kesalahan e-Faktur yang sering terjadi", "Five common e-invoicing mistakes"), text: tr("Dan cara mencegahnya sebelum diperiksa.", "And how to prevent them before an audit.") }, { image: asset("v3c-tax"), tag: "UMKM", date: "Okt 2026", title: tr("Kapan UMKM keluar dari PPh final?", "When do SMEs leave the final tax regime?"), text: tr("Simulasi omzet & pembukuan.", "Turnover & bookkeeping scenarios.") }, { image: asset("v3c-tax"), tag: tr("Pribadi", "Personal"), date: "Sep 2026", title: tr("Melaporkan aset kripto", "Reporting crypto assets"), text: tr("Kolom yang tepat di SPT.", "The right fields on your return.") }] }),
        newsletter(tw, { title: tr("Ringkasan pajak bulanan", "Monthly tax digest"), text: tr("Perubahan aturan dalam bahasa sederhana.", "Rule changes in plain language."), ph: "email@perusahaan.id", submit: tr("Berlangganan", "Subscribe") }),
        end,
      ]);
    if (key === "faq")
      return pageC(tw, [
        head,
        faq(tw, { eyebrow: "FAQ", title: tr("Pertanyaan klien", "Client questions"), items: [[tr("Apakah konsultan terdaftar?", "Are you registered?"), tr("Ya, seluruh konsultan memegang izin praktik.", "Yes, all consultants hold practising licences.")], [tr("Bisa kerja jarak jauh?", "Can you work remotely?"), tr("Ya, dokumen dikirim melalui portal terenkripsi.", "Yes, documents go through an encrypted portal.")], [tr("Bagaimana biaya ditentukan?", "How are fees set?"), tr("Berdasarkan volume transaksi, tertulis di proposal.", "By transaction volume, written in the proposal.")], [tr("Menangani wilayah luar Jawa?", "Outside Java?"), tr("Ya, klien kami tersebar di 19 provinsi.", "Yes, clients in 19 provinces.")]], act: [tr("Tanya langsung", "Ask us directly"), href("contact")] }),
        cta(tw, { kind: "split", title: tr("Belum menemukan jawabannya?", "Didn't find your answer?"), acts: [[tr("Hubungi kami", "Contact us"), href("contact"), "light"]] }),
        end,
      ]);
    if (key === "contact")
      return pageC(tw, [
        head,
        form(tw, { eyebrow: tr("Konsultasi awal gratis 30 menit", "Free 30-minute first consultation"), title: tr("Ceritakan kebutuhan pajak Anda", "Tell us your tax needs"), info: [["Jakarta", "+62 21 5790 2200"], ["Surabaya", "+62 31 534 1100"], ["Email", "halo@taksasiwibawa.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "input", label: tr("Perusahaan", "Company"), ph: tr("Opsional", "Optional") }, { kind: "select", label: tr("Kebutuhan", "Need"), ph: tr("Pilih", "Choose"), options: [tr("Pajak badan", "Corporate tax"), tr("Pajak pribadi", "Personal tax"), tr("Pemeriksaan", "Audit"), tr("Perencanaan", "Planning")] }], message: tr("Ringkasan", "Summary"), submit: tr("Jadwalkan", "Schedule") }),
        infoTiles(tw, [[tr("Jam kantor", "Office hours"), tr("Sen–Jum 08.30–17.30", "Mon–Fri 8:30am–5:30pm")], [tr("Balasan", "Reply"), tr("1 hari kerja", "1 working day")], [tr("Kerahasiaan", "Confidentiality"), "NDA"]]),
        end,
      ]);
    return pageC(tw, [
      head,
      hero(tw, { kind: "split", eyebrow: tr("Konsultan pajak terdaftar", "Registered tax consultants"), title: tr("Pajak yang jelas untuk keputusan yang tenang", "Clear tax for calm decisions"), text: tr("Kepatuhan bulanan, SPT tahunan, perencanaan, dan pendampingan pemeriksaan untuk perusahaan dan pribadi.", "Monthly compliance, annual returns, planning and audit representation for companies and individuals."), acts: [[tr("Konsultasi gratis", "Free consultation"), href("contact"), "light"], [tr("Layanan", "Services"), href("services"), "outline"]], image: asset("v3c-tax"), alt: tr("Dokumen pajak", "Tax documents") }),
      statsBand(tw, tr, { title: tr("Dipercaya 380+ klien", "Trusted by 380+ clients"), stats: [["380+", tr("Klien", "Clients")], ["17", tr("Tahun", "Years")], ["86%", tr("Keberatan dikabulkan", "Objections granted")], ["19", tr("Provinsi", "Provinces")]] }),
      cardsC(tw, { title: tr("Mulai dari kebutuhan Anda", "Start from your need"), items: [{ title: tr("Pajak badan", "Corporate tax"), text: tr("Bulanan & tahunan untuk PT dan CV.", "Monthly & annual for companies."), meta: tr("Selengkapnya", "Learn more") }, { title: tr("Pajak pribadi", "Personal tax"), text: tr("SPT karyawan & profesional.", "Returns for employees & professionals."), meta: tr("Selengkapnya", "Learn more") }, { title: tr("Pemeriksaan", "Audits"), text: tr("Didampingi dari surat pertama.", "Represented from the first letter."), meta: tr("Selengkapnya", "Learn more") }] }),
      pull(tw, { text: tr("Klien yang paham posisinya tidak takut dengan surat dari kantor pajak.", "Clients who understand their position don't fear tax office letters."), name: "Wibawa Hadiprawiro", role: "Managing partner", bg: tw.alt }),
      cta(tw, { kind: "split", title: tr("Konsultasi awal 30 menit, gratis", "A free 30-minute first consultation"), acts: [[tr("Jadwalkan", "Schedule"), href("contact"), "light"]] }),
      end,
    ]);
  },
};
