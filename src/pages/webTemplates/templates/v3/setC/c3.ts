import { asset } from "../../../assets";
import { col, el, grid, image, inline, type Palette } from "../../../build";
import { portfolioMosaic, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import { compare, countdownBand, counter, field, mega, plans, priceSwitch, quotes, slider } from "../../v2/setA/kitA";
import {
  H,
  P,
  acts,
  banner,
  beforeAfter,
  bento,
  gbox,
  bigNumbers,
  cardsC,
  catalog,
  chips,
  cta,
  faq,
  form,
  ftr,
  fxPic,
  hdr,
  hero,
  home,
  infoTiles,
  kicker,
  lightbox,
  lookC,
  modalOffer,
  newsletter,
  numbered,
  pageC,
  pg,
  priceLines,
  pull,
  sec,
  split,
  steps,
  strip,
  table,
  tabs,
  timelineC,
  words,
  type LC,
  type Listing,
} from "./kitC";

/* ================================================================== */
/* Template v3 C11–C15: Percetakan, Laundry, Florist, Dekorasi bunga,   */
/* Toko gawai.                                                          */
/* ================================================================== */

/* ------------- 11. Cetak Kilat (PREMIUM, 6 hlm) — bento CMYK --------- */

const CK: Palette = { ink: "#0c1a2b", muted: "#475569", primary: "#0284c7", primaryDark: "#0369a1", soft: "#e0f2fe", line: "#bae6fd" };
const ck = lookC(CK, { head: "Righteous", body: "Plus Jakarta Sans", skin: "bento", radius: 24, bg: "#ffffff", alt: "#f1f5f9", dark: "#0c1a2b", fx: { animate: "zoomIn" }, btnR: 14, accent2: "#ec4899" });

const ckFoot = (tr: Tr) =>
  ftr(ck, "Cetak Sigap 24", {
    kind: "card",
    about: tr("Percetakan digital & offset 24 jam di Depok. File masuk malam, cetakan siap pagi.", "24-hour digital & offset printing in Depok. Send files at night, collect in the morning."),
    cols: [{ title: tr("Produk", "Products"), items: [tr("Kartu nama", "Business cards"), "Banner & X-banner", tr("Stiker & label", "Stickers & labels")] }, { title: tr("Kontak", "Contact"), items: ["+62 821 2424 0024", "file@cetaksigap.id"] }],
    copy: tr("© 2026 Cetak Sigap 24. Konten contoh.", "© 2026 Cetak Sigap 24. Sample content."),
  });

export const printingCetakKilat: TemplateContent = {
  brand: "Cetak Sigap 24",
  pages: [
    home(),
    pg("products", ["produk", "Produk"], ["products", "Products"]),
    pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]),
    pg("how", ["cara-pesan", "Cara Pesan"], ["how-to-order", "How to Order"]),
    pg("work", ["portofolio", "Portofolio"], ["portfolio", "Portfolio"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(ck, "Cetak Sigap 24", { kind: "pill", cta: [tr("Kirim file", "Send files"), href("contact")] });
    const end = ckFoot(tr);
    if (key === "products")
      return pageC(ck, [
        head,
        banner(ck, { kind: "band", eyebrow: tr("40+ produk", "40+ products"), title: tr("Cetak apa saja hari ini", "Print anything today") }),
        bento(ck, { title: tr("Paling sering dicetak", "Most printed"), tiles: [{ title: tr("Kartu nama", "Business cards"), text: tr("Art carton 260 g, laminasi doff, 1 hari.", "260 g art carton, matte laminate, 1 day."), image: asset("v3c-press"), wide: true }, { title: "Banner", text: tr("Flexi 280 g, mata ayam gratis.", "280 g flexi, free eyelets."), stat: "3 jam", tone: "primary" }, { title: tr("Stiker vinyl", "Vinyl stickers"), text: tr("Potong bentuk bebas.", "Any die-cut shape."), stat: "A3+" }, { title: tr("Buku & katalog", "Books & catalogues"), text: tr("Jilid lem panas, mulai 20 eksemplar.", "Perfect binding from 20 copies."), tone: "dark" }, { title: tr("Kemasan", "Packaging"), text: tr("Box makanan & hampers.", "Food & hamper boxes."), tone: "soft" }] }),
        tabs(ck, { title: tr("Pilihan kertas", "Paper options"), tabs: [["Art paper", tr("120–150 g untuk brosur & flyer.", "120–150 g for brochures & flyers.")], ["Art carton", tr("210–310 g untuk kartu & cover.", "210–310 g for cards & covers.")], [tr("Kertas daur ulang", "Recycled"), tr("Tekstur alami, 250 g.", "Natural texture, 250 g.")]] }),
        end,
      ]);
    if (key === "pricing")
      return pageC(ck, [
        head,
        plans(ck, { eyebrow: tr("Paket UMKM", "Small-business packs"), title: tr("Mulai jualan dengan cetakan rapi", "Start selling with neat prints"), items: [{ plan: tr("Starter", "Starter"), price: "Rp199rb", period: tr("/paket", "/pack"), description: tr("Untuk usaha baru.", "For new businesses."), features: [tr("200 kartu nama", "200 business cards"), tr("100 stiker logo", "100 logo stickers"), tr("1 x banner 1x2 m", "1 x 1x2 m banner")], buttonText: tr("Pesan", "Order"), buttonHref: href("contact") }, { plan: tr("Buka Toko", "Shop Opening"), price: "Rp549rb", period: tr("/paket", "/pack"), description: tr("Paket grand opening.", "Grand opening pack."), features: [tr("500 flyer A5", "500 A5 flyers"), "X-banner", tr("300 stiker kemasan", "300 packaging stickers"), tr("Desain gratis", "Free design")], buttonText: tr("Pesan", "Order"), buttonHref: href("contact"), featured: true, badge: tr("Terlaris", "Best seller") }, { plan: tr("Event", "Event"), price: "Rp1,2jt", period: tr("/paket", "/pack"), description: tr("Seminar & bazar.", "Seminars & bazaars."), features: [tr("ID card + tali", "ID cards + lanyards"), tr("Backdrop 3x2 m", "3x2 m backdrop"), tr("Sertifikat", "Certificates")], buttonText: tr("Pesan", "Order"), buttonHref: href("contact") }] }),
        compare(ck, { title: tr("Digital atau offset?", "Digital or offset?"), columns: ["Digital", "Offset"], rows: [tr("Jumlah ideal | 1–500 | 1.000+", "Ideal quantity | 1–500 | 1,000+"), tr("Waktu | 1–3 jam | 2–3 hari", "Turnaround | 1–3 hours | 2–3 days"), tr("Warna Pantone | tidak | ya", "Pantone colours | no | yes"), tr("Data variabel | ya | tidak", "Variable data | yes | no")], highlight: 1, caption: tr("Kami sarankan otomatis saat file masuk", "We recommend automatically when files arrive") }),
        priceLines(ck, { title: tr("Harga satuan", "Unit prices"), groups: [{ title: tr("Kartu & kertas", "Cards & paper"), items: [[tr("Kartu nama", "Business cards"), tr("1 kotak (100)", "1 box (100)"), "Rp45.000"], ["Flyer A5", tr("per 100 lembar", "per 100 sheets"), "Rp85.000"]] }, { title: tr("Besar", "Large format"), items: [["Banner", tr("per m2", "per m2"), "Rp25.000"], ["X-banner", tr("+ rangka", "+ stand"), "Rp95.000"]] }] }),
        end,
      ]);
    if (key === "how")
      return pageC(ck, [
        head,
        steps(ck, { title: tr("Pesan tanpa antre", "Order without queueing"), items: [[tr("Kirim file", "Send files"), tr("PDF, AI, atau JPG 300 dpi lewat WhatsApp.", "PDF, AI or 300 dpi JPG via WhatsApp.")], [tr("Cek proof", "Check the proof"), tr("Kami kirim pratinjau 15 menit.", "We send a preview in 15 minutes.")], [tr("Bayar", "Pay"), tr("Transfer atau QRIS.", "Transfer or QR.")], [tr("Ambil / kirim", "Pickup / delivery"), tr("Kurir instan Jabodetabek.", "Instant courier in Greater Jakarta.")]] }),
        faq(ck, { title: tr("Soal file", "About files"), items: [[tr("File saya RGB?", "My file is RGB?"), tr("Kami konversi ke CMYK dan kabari bila warna bergeser.", "We convert to CMYK and warn about colour shifts.")], [tr("Perlu bleed?", "Need bleed?"), tr("Tambahkan 3 mm di tiap sisi.", "Add 3 mm on each side.")], [tr("Tidak punya desain?", "No design?"), tr("Desainer kami mulai Rp50 ribu.", "Our designers start at Rp50k.")]] }),
        end,
      ]);
    if (key === "work")
      return pageC(ck, [
        head,
        hero(ck, { kind: "bento", eyebrow: tr("Portofolio", "Portfolio"), title: tr("Dicetak untuk 3.000+ UMKM", "Printed for 3,000+ small businesses"), text: tr("Dari kedai kopi sampai seminar nasional.", "From coffee stalls to national seminars."), image: asset("v3c-press-warm"), alt: tr("Mesin cetak", "Printer"), stat: ["3.000+", "UMKM"], chips: ["Kopi Lereng", "Bazar Ramadan", tr("Wisuda TK", "Kindergarten graduation")] }),
        strip(ck, { images: [[asset("v3c-press"), tr("Kemasan kopi", "Coffee packaging")], [asset("v3c-press-warm"), tr("Backdrop seminar", "Seminar backdrop")], [asset("v3c-press"), tr("Stiker label", "Label stickers")], [asset("v3c-press-warm"), tr("Kartu ucapan", "Greeting cards")]] }),
        end,
      ]);
    if (key === "contact")
      return pageC(ck, [
        head,
        form(ck, { title: tr("Kirim file & minta harga", "Send files & get a quote"), info: [["WhatsApp", "+62 821 2424 0024"], [tr("Alamat", "Address"), "Jl. Margonda Raya 380, Depok"], [tr("Jam", "Hours"), "24 jam"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "select", label: tr("Produk", "Product"), ph: tr("Pilih", "Choose"), options: [tr("Kartu nama", "Business cards"), "Banner", tr("Stiker", "Stickers"), tr("Lainnya", "Other")] }, { kind: "input", label: tr("Jumlah", "Quantity"), ph: "100", type: "number" }], message: tr("Catatan", "Notes"), submit: tr("Minta harga", "Get a quote") }),
        infoTiles(ck, [[tr("Rata-rata balas", "Avg. reply"), tr("7 menit", "7 minutes")], [tr("Kurir", "Courier"), tr("Instan & reguler", "Instant & regular")]]),
        end,
      ]);
    return pageC(ck, [
      head,
      hero(ck, { kind: "bento", eyebrow: tr("Buka 24 jam", "Open 24 hours"), title: tr("File malam ini, cetakan besok pagi", "Files tonight, prints tomorrow morning"), text: tr("Kartu nama, banner, stiker, dan kemasan dengan proof gratis dalam 15 menit.", "Business cards, banners, stickers and packaging with a free proof in 15 minutes."), acts: [[tr("Lihat produk", "See products"), href("products")], [tr("Harga", "Pricing"), href("pricing"), "outline"]], image: asset("v3c-press"), alt: tr("Mesin cetak", "Printing press"), stat: ["15 mnt", tr("Proof gratis", "Free proof")], chips: ["Digital", "Offset", "Large format"] }),
      words(ck, ["Cyan", "Magenta", "Yellow", "Key"], { bg: ck.p.primary }),
      cardsC(ck, { title: tr("Kenapa Cetak Sigap", "Why Cetak Sigap"), items: [{ icon: "24", title: tr("Buka 24 jam", "Open 24/7"), text: tr("Shift malam untuk deadline mendadak.", "A night shift for sudden deadlines.") }, { icon: "15", title: tr("Proof 15 menit", "15-minute proofs"), text: tr("Cek warna sebelum cetak.", "Check colours before printing.") }, { icon: "0", title: tr("Ongkir 0", "Free delivery"), text: tr("Untuk Depok di atas Rp300rb.", "Within Depok over Rp300k.") }] }),
      cta(ck, { kind: "split", title: tr("Deadline besok?", "Deadline tomorrow?"), text: tr("Kirim sekarang, kami mulai malam ini.", "Send now and we start tonight."), acts: [[tr("Kirim file", "Send files"), href("contact"), "light"]] }),
      end,
    ]);
  },
};

/* --------------- 12. Laundry (PREMIUM, 4 hlm) — pastel air ----------- */

const LB: Palette = { ink: "#083344", muted: "#4b6b78", primary: "#0891b2", primaryDark: "#0e7490", soft: "#cffafe", line: "#a5f3fc" };
const lb = lookC(LB, { head: "Poppins", body: "Nunito", skin: "soft", radius: 30, bg: "#f7fdff", alt: "#e9fbfe", dark: "#083344", fx: { aos: "fade-up", animate: "bounceIn" }, btnR: 999, accent2: "#a78bfa" });

const lbFoot = (tr: Tr) =>
  ftr(lb, "Laundry Busa Bersih", {
    kind: "minimal",
    about: "",
    cols: [{ title: "", items: [tr("Antar jemput gratis 3 km", "Free pickup within 3 km"), "WA +62 857 1100 2299", tr("Buka 07.00–21.00", "Open 7am–9pm")] }],
    copy: tr("© 2026 Laundry Busa Bersih. Konten contoh.", "© 2026 Laundry Busa Bersih. Sample content."),
    social: ["WhatsApp | https://wa.me/6285711002299", "Instagram | https://instagram.com/busabersih"],
  });

export const laundryBersih: TemplateContent = {
  brand: "Laundry Busa Bersih",
  pages: [home(), pg("services", ["layanan", "Layanan"], ["services", "Services"]), pg("prices", ["harga", "Harga"], ["prices", "Prices"]), pg("pickup", ["jemput", "Jemput"], ["pickup", "Pickup"])],
  build: (key, tr, href) => {
    const head = hdr(lb, "Busa Bersih", { kind: "pill", cta: [tr("Jemput sekarang", "Book a pickup"), href("pickup")] });
    const end = lbFoot(tr);
    if (key === "services")
      return pageC(lb, [
        head,
        banner(lb, { kind: "image", eyebrow: tr("Layanan", "Services"), title: tr("Dari kaus harian sampai bed cover", "From daily tees to duvets"), image: asset("v3c-washer-mint"), alt: tr("Mesin cuci", "Washing machine") }),
        cardsC(lb, { title: tr("Pilih layanan", "Choose a service"), cols: 2, items: [{ icon: "K", title: tr("Kiloan cuci lipat", "Wash & fold by kilo"), text: tr("Selesai 2 hari, deterjen hipoalergenik.", "Ready in 2 days, hypoallergenic detergent."), meta: "Rp8.000/kg" }, { icon: "S", title: tr("Kiloan cuci setrika", "Wash & iron by kilo"), text: tr("Dilipat rapi dalam plastik per orang.", "Neatly folded and bagged per person."), meta: "Rp11.000/kg" }, { icon: "B", title: tr("Bed cover & selimut", "Duvets & blankets"), text: tr("Mesin besar 20 kg.", "20 kg large machines."), meta: tr("mulai Rp35.000", "from Rp35,000") }, { icon: "P", title: tr("Sepatu & tas", "Shoes & bags"), text: tr("Cuci manual, sikat lembut.", "Hand-washed with soft brushes."), meta: tr("mulai Rp45.000", "from Rp45,000") }] }),
        numbered(lb, { title: tr("Standar kebersihan", "Our cleaning standard"), items: [[tr("Satu mesin satu pelanggan", "One machine per customer"), tr("Pakaian tidak dicampur dengan milik orang lain.", "Your clothes are never mixed with others.")], [tr("Air disaring", "Filtered water"), tr("Tidak meninggalkan noda kuning.", "No yellow stains.")], [tr("Ditimbang di depan Anda", "Weighed in front of you"), tr("Foto timbangan dikirim via WA.", "Scale photo sent on WhatsApp.")]] }),
        end,
      ]);
    if (key === "prices")
      return pageC(lb, [
        head,
        priceSwitch(lb, { eyebrow: tr("Langganan", "Subscription"), title: tr("Hemat dengan langganan bulanan", "Save with a monthly plan"), plans: [tr("Anak kos | Rp150rb | Rp1,6jt | 20 kg/bulan; Cuci lipat; Jemput 2x/minggu | Pilih", "Student | Rp150k | Rp1.6m | 20 kg/month; Wash & fold; Pickup twice a week | Choose"), tr("Keluarga | Rp320rb | Rp3,4jt | 40 kg/bulan; Cuci setrika; Jemput 3x/minggu; 1 bed cover | Pilih", "Family | Rp320k | Rp3.4m | 40 kg/month; Wash & iron; Pickup 3x a week; 1 duvet | Choose"), tr("Usaha | Rp750rb | Rp8jt | 100 kg/bulan; Handuk & seragam; Jemput harian | Pilih", "Business | Rp750k | Rp8m | 100 kg/month; Towels & uniforms; Daily pickup | Choose")], labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 10%", "Save 10%"), tr("/bulan", "/month"), tr("/tahun", "/year")], href: href("pickup") }),
        table(lb, { title: tr("Harga satuan", "Unit prices"), columns: [tr("Item", "Item"), tr("Reguler 2 hari", "Regular 2 days"), tr("Kilat 6 jam", "Express 6 hours")], rows: [[tr("Cuci lipat /kg", "Wash & fold /kg"), "Rp8.000", "Rp14.000"], [tr("Cuci setrika /kg", "Wash & iron /kg"), "Rp11.000", "Rp18.000"], [tr("Jas / kebaya", "Suit / kebaya"), "Rp35.000", "Rp55.000"]] }),
        end,
      ]);
    if (key === "pickup")
      return pageC(lb, [
        head,
        form(lb, { eyebrow: tr("Gratis 3 km", "Free within 3 km"), title: tr("Jadwalkan penjemputan", "Schedule a pickup"), info: [["WhatsApp", "+62 857 1100 2299"], [tr("Jam jemput", "Pickup hours"), "08.00–19.00"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "input", label: tr("Alamat", "Address"), ph: tr("Alamat lengkap", "Full address") }, { kind: "date", label: tr("Waktu jemput", "Pickup time"), mode: "datetime-local" }, { kind: "select", label: tr("Layanan", "Service"), ph: tr("Pilih", "Choose"), options: [tr("Cuci lipat", "Wash & fold"), tr("Cuci setrika", "Wash & iron"), tr("Bed cover", "Duvet")] }], submit: tr("Pesan jemput", "Book pickup") }),
        faq(lb, { title: tr("Pertanyaan", "Questions"), items: [[tr("Kalau ada yang hilang?", "If something goes missing?"), tr("Ganti rugi hingga 10x biaya cuci.", "Compensation up to 10x the wash fee.")], [tr("Bisa noda membandel?", "Stubborn stains?"), tr("Treatment noda Rp5.000 per item.", "Stain treatment Rp5,000 per item.")]] }),
        end,
      ]);
    return pageC(lb, [
      head,
      hero(lb, { kind: "pastel", badge: tr("Jemput & antar gratis", "Free pickup & delivery"), title: tr("Cucian beres, akhir pekan bebas", "Laundry done, weekends free"), text: tr("Kami jemput cucian Anda, mencuci satu mesin per pelanggan, lalu mengantar kembali wangi dan terlipat rapi.", "We pick up your laundry, wash it in its own machine and bring it back fresh and neatly folded."), acts: [[tr("Jemput sekarang", "Book a pickup"), href("pickup")], [tr("Lihat harga", "See prices"), href("prices"), "outline"]], image: asset("v3c-washer"), alt: tr("Mesin cuci", "Washing machine"), chips: [tr("1 mesin 1 pelanggan", "1 machine per customer"), tr("Selesai 2 hari", "Ready in 2 days"), tr("Kilat 6 jam", "6-hour express")] }),
      steps(lb, { title: tr("Semudah tiga langkah", "As easy as three steps"), items: [[tr("Chat WA", "Chat on WhatsApp"), tr("Kirim alamat & jam jemput.", "Send address & pickup time.")], [tr("Kami jemput", "We collect"), tr("Ditimbang di depan Anda.", "Weighed in front of you.")], [tr("Diantar wangi", "Delivered fresh"), tr("Bayar saat cucian tiba.", "Pay on delivery.")]] }),
      bigNumbers(lb, [["12.000+", tr("Kg dicuci/bulan", "Kg washed/month")], ["2 hari", tr("Waktu reguler", "Regular turnaround")], ["4,9", "Rating"]]),
      cta(lb, { kind: "sticker", title: tr("Cucian menumpuk?", "Laundry piling up?"), text: tr("Jemput hari ini, rapi lusa.", "Picked up today, ready the day after tomorrow."), acts: [[tr("Pesan jemput", "Book a pickup"), href("pickup")]] }),
      end,
    ]);
  },
};

/* -------------- 13. Florist Kembang (PREMIUM, 5 hlm) — garis manis ---- */

const KR: Palette = { ink: "#500724", muted: "#86506a", primary: "#db2777", primaryDark: "#be185d", soft: "#fce7f3", line: "#f9a8d4" };
const kr = lookC(KR, { head: "Caveat", body: "Poppins", skin: "line", radius: 32, bg: "#fffbfd", alt: "#fdf0f6", dark: "#3d0a1f", fx: { aos: "fade-left", tilt: { max: 9 } }, btnR: 999, accent2: "#f97316" });

const krFoot = (tr: Tr) =>
  ftr(kr, "Kembang Rinai Florist", {
    kind: "card",
    about: tr("Buket harian, hampers, dan bunga duka dari kebun mitra di Lembang. Antar sameday Bandung.", "Daily bouquets, hampers and sympathy flowers from partner farms in Lembang. Same-day delivery in Bandung."),
    cols: [{ title: tr("Toko", "Shop"), items: ["Jl. Dago 77, Bandung", tr("Setiap hari 08.00–20.00", "Daily 8am–8pm")] }, { title: tr("Pesan", "Order"), items: ["+62 812 2020 7700"] }],
    copy: tr("© 2026 Kembang Rinai Florist. Konten contoh.", "© 2026 Kembang Rinai Florist. Sample content."),
    social: ["Instagram | https://instagram.com/kembangrinai", "WhatsApp | https://wa.me/6281220207700"],
  });

export const floristKembang: TemplateContent = {
  brand: "Kembang Rinai Florist",
  pages: [home(), pg("bouquets", ["buket", "Buket"], ["bouquets", "Bouquets"]), pg("hampers", ["hampers", "Hampers"], ["hampers", "Hampers"]), pg("gallery", ["galeri", "Galeri"], ["gallery", "Gallery"]), pg("order", ["pesan", "Pesan"], ["order", "Order"])],
  build: (key, tr, href) => {
    const head = hdr(kr, "Kembang Rinai", { kind: "stack", strip: tr("Pesan sebelum 14.00, tiba hari ini di Bandung", "Order before 2pm for same-day Bandung delivery") });
    const end = krFoot(tr);
    const buket: Listing[] = [
      { image: asset("v3c-bouquet"), title: tr("Buket Rinai", "Rinai Bouquet"), text: tr("Mawar pink & baby breath", "Pink roses & baby's breath"), price: "Rp275.000", badge: tr("Terlaris", "Best seller"), cta: tr("Pesan", "Order"), href: href("order") },
      { image: asset("v3c-bouquet-sun"), title: tr("Buket Pagi", "Morning Bouquet"), text: tr("Bunga matahari & aster", "Sunflowers & asters"), price: "Rp235.000", cta: tr("Pesan", "Order"), href: href("order") },
      { image: asset("v3c-bouquet"), title: tr("Buket Wisuda", "Graduation Bouquet"), text: tr("Lili, mawar, pita nama", "Lilies, roses, name ribbon"), price: "Rp320.000", cta: tr("Pesan", "Order"), href: href("order") },
    ];
    if (key === "bouquets")
      return pageC(kr, [
        head,
        banner(kr, { kind: "image", eyebrow: tr("Buket harian", "Daily bouquets"), title: tr("Dirangkai pagi ini", "Arranged this morning"), text: tr("Bunga tiba dari Lembang setiap pukul 05.00.", "Flowers arrive from Lembang at 5am every day."), image: asset("v3c-bouquet"), alt: tr("Buket", "Bouquet") }),
        catalog(kr, { title: tr("Pilih buket", "Choose a bouquet"), items: buket }),
        chips(kr, { title: tr("Untuk momen apa?", "For which moment?"), chips: [tr("Ulang tahun", "Birthday"), tr("Wisuda", "Graduation"), tr("Permintaan maaf", "Apology"), tr("Anniversary", "Anniversary"), tr("Duka cita", "Sympathy"), tr("Tanpa alasan", "Just because")], bg: kr.alt }),
        end,
      ]);
    if (key === "hampers")
      return pageC(kr, [
        head,
        split(kr, { eyebrow: "Hampers", title: tr("Bunga + kue + kartu tulisan tangan", "Flowers + cake + a handwritten card"), paras: [tr("Kami bekerja sama dengan toko kue lokal untuk hampers yang manis dan segar.", "We partner with local bakeries for sweet, fresh hampers.")], bullets: [tr("Kotak kayu bisa dipakai ulang", "Reusable wooden box"), tr("Kartu ditulis tangan", "Handwritten card"), tr("Foto sebelum dikirim", "Photo before dispatch")], image: asset("v3c-bouquet-sun"), alt: "Hampers", tone: "soft" }),
        modalOffer(kr, { title: tr("Hampers korporat", "Corporate hampers"), text: tr("Untuk 20 kotak ke atas, ada diskon & logo di kartu.", "20+ boxes get a discount and your logo on the card."), trigger: tr("Lihat penawaran", "See the offer"), modalTitle: tr("Hampers korporat", "Corporate hampers"), body: tr("Diskon 12% untuk 20–49 kotak, 18% untuk 50+ kotak. Kartu ucapan berlogo gratis.", "12% off for 20–49 boxes, 18% for 50+. Free logo greeting cards."), cta: [tr("Minta penawaran", "Request a quote"), href("order")] }),
        end,
      ]);
    if (key === "gallery")
      return pageC(kr, [
        head,
        lightbox(kr, { title: tr("Rangkaian minggu ini", "This week's arrangements"), images: [[asset("v3c-bouquet"), tr("Mawar pastel", "Pastel roses")], [asset("v3c-bouquet-sun"), tr("Matahari pagi", "Morning sun")], [asset("v3c-bouquet"), tr("Buket wisuda", "Graduation bouquet")], [asset("v3c-bouquet-sun"), tr("Meja resepsi", "Reception table")], [asset("v3c-bouquet"), tr("Bunga duka", "Sympathy flowers")], [asset("v3c-bouquet-sun"), "Hampers"]], cols: 3, ratio: "1 / 1" }),
        pull(kr, { text: tr("Kami memotret setiap buket sebelum dikirim, supaya Anda tahu persis apa yang diterima.", "We photograph every bouquet before it leaves, so you know exactly what arrives."), name: "Rinai Kusumawati", role: tr("Florist kepala", "Head florist"), bg: kr.alt }),
        end,
      ]);
    if (key === "order")
      return pageC(kr, [
        head,
        form(kr, { title: tr("Pesan bunga", "Order flowers"), text: tr("Sertakan pesan kartu, kami tuliskan dengan tangan.", "Include your card message; we'll handwrite it."), info: [["WhatsApp", "+62 812 2020 7700"], [tr("Sameday", "Same day"), tr("Pesan sebelum 14.00", "Order before 2pm")]], fields: [{ kind: "input", label: tr("Nama pengirim", "Sender name"), ph: tr("Nama", "Name") }, { kind: "input", label: tr("Alamat tujuan", "Delivery address"), ph: tr("Alamat", "Address") }, { kind: "date", label: tr("Tanggal kirim", "Delivery date") }], message: tr("Pesan kartu", "Card message"), submit: tr("Kirim pesanan", "Send order") }),
        faq(kr, { title: tr("Pengiriman", "Delivery"), items: [[tr("Ongkir berapa?", "Delivery fee?"), tr("Gratis 5 km, selebihnya Rp3.000/km.", "Free within 5 km, then Rp3,000/km.")], [tr("Tahan berapa hari?", "How long do they last?"), tr("5–7 hari dengan ganti air harian.", "5–7 days with daily water changes.")]] }),
        end,
      ]);
    return pageC(kr, [
      head,
      hero(kr, { kind: "collage", eyebrow: tr("Florist Bandung", "Bandung florist"), title: tr("Bunga segar, dirangkai dengan cerita", "Fresh flowers, arranged with a story"), text: tr("Buket harian, hampers, dan bunga duka. Dikirim hari ini, difoto sebelum berangkat.", "Daily bouquets, hampers and sympathy flowers. Delivered today, photographed before they leave."), acts: [[tr("Pilih buket", "Choose a bouquet"), href("bouquets")], [tr("Hampers", "Hampers"), href("hampers"), "outline"]], images: [asset("v3c-bouquet"), asset("v3c-bouquet-sun"), asset("v3c-bouquet")], alt: tr("Buket bunga", "Flower bouquets") }),
      catalog(kr, { eyebrow: tr("Favorit", "Favourites"), title: tr("Buket minggu ini", "This week's bouquets"), items: buket, bg: kr.alt }),
      lightbox(kr, { title: tr("Dari meja rangkai", "From the arranging table"), images: [[asset("v3c-bouquet-sun"), tr("Pagi di toko", "Morning at the shop")], [asset("v3c-bouquet"), tr("Mawar Lembang", "Lembang roses")], [asset("v3c-bouquet-sun"), tr("Bunga matahari", "Sunflowers")]], cols: 3 }),
      cta(kr, { kind: "giant", title: tr("Kirim bunga hari ini", "Send flowers today"), acts: [[tr("Pesan sekarang", "Order now"), href("order"), "light"]], bg: kr.p.primary }),
      end,
    ]);
  },
};

/* --------- 14. Wedding Bloom (PREMIUM, 6 hlm) — kaca keemasan -------- */

const TK: Palette = { ink: "#3f2a06", muted: "#7a6440", primary: "#a16207", primaryDark: "#854d0e", soft: "#fef9c3", line: "#fde68a" };
const tk = lookC(TK, { head: "Cormorant Garamond", body: "Josefin Sans", skin: "glass", radius: 20, bg: "#fffdf6", alt: "#fbf5e4", dark: "#2b1d05", fx: { aos: "fade-up" }, btnR: 4, onDark: "#f3e3b5", accent2: "#be185d" });

const tkFoot = (tr: Tr) =>
  ftr(tk, "Taman Kelopak Decor", {
    kind: "giant",
    about: tr("Dekorasi bunga pernikahan & acara di Bali dan Jawa. 300+ acara sejak 2016.", "Wedding & event floral styling in Bali and Java. 300+ events since 2016."),
    cols: [{ title: tr("Studio", "Studio"), items: ["Jl. Raya Ubud 18, Gianyar", tr("Kunjungan dengan janji", "By appointment")] }, { title: tr("Kontak", "Contact"), items: ["+62 361 970 445", "halo@tamankelopak.id"] }],
    copy: tr("© 2026 Taman Kelopak Decor. Konten contoh.", "© 2026 Taman Kelopak Decor. Sample content."),
    social: ["Instagram | https://instagram.com/tamankelopak", "Pinterest | https://pinterest.com/tamankelopak"],
  });

export const floristWeddingBloom: TemplateContent = {
  brand: "Taman Kelopak Decor",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("portfolio", ["portofolio", "Portofolio"], ["portfolio", "Portfolio"]),
    pg("venues", ["venue", "Venue"], ["venues", "Venues"]),
    pg("process", ["proses", "Proses"], ["process", "Process"]),
    pg("enquire", ["konsultasi", "Konsultasi"], ["enquire", "Enquire"]),
  ],
  build: (key, tr, href) => {
    const head = hdr(tk, "Taman Kelopak", { kind: "bar", cta: [tr("Konsultasi", "Enquire"), href("enquire")] });
    const end = tkFoot(tr);
    if (key === "services")
      return pageC(tk, [
        head,
        banner(tk, { kind: "rule", eyebrow: tr("Layanan", "Services"), title: tr("Dekorasi dari altar sampai meja tamu", "Styling from altar to guest tables"), text: tr("Semua bunga lokal musiman dari petani Bedugul.", "All seasonal local blooms from Bedugul growers.") }),
        cardsC(tk, { title: tr("Yang kami tangani", "What we handle"), items: [{ image: asset("v3c-arch"), title: tr("Gerbang & altar", "Arches & altars"), text: tr("Struktur bambu, bunga segar.", "Bamboo structures, fresh flowers.") }, { image: asset("v3c-bouquet"), title: tr("Buket pengantin", "Bridal bouquets"), text: tr("Dirangkai pagi hari H.", "Arranged on the morning itself.") }, { image: asset("v3c-venue-bloom"), title: tr("Meja & instalasi", "Tables & installations"), text: tr("Hanging flowers, centerpiece.", "Hanging flowers, centerpieces.") }] }),
        counter(tk, { items: ["300+ | " + tr("Acara", "Events"), "42 | " + tr("Venue", "Venues"), "18 | " + tr("Petani mitra", "Partner growers"), "0 | " + tr("Busa floral", "Floral foam")] }),
        end,
      ]);
    if (key === "portfolio")
      return pageC(tk, [
        head,
        portfolioMosaic(tk, tr, { eyebrow: tr("Karya", "Work"), title: tr("Pernikahan yang kami dekor", "Weddings we've styled"), text: tr("Dari tebing Uluwatu sampai pendopo Yogyakarta.", "From Uluwatu clifftops to Yogyakarta pavilions."), works: [{ title: "Anindita & Rafi", tag: "Uluwatu", image: asset("v3c-arch") }, { title: "Sekar & Bima", tag: "Ubud", image: asset("v3c-venue-bloom") }, { title: "Laila & Fikri", tag: "Yogyakarta", image: asset("v3c-bouquet") }, { title: "Maya & Dion", tag: "Canggu", image: asset("v3c-bouquet-sun") }, { title: "Rara & Teguh", tag: "Bandung", image: asset("v3c-arch") }], cta: null }),
        testimonialsWall(tk, tr, { title: tr("Kata pengantin", "From our couples"), score: 5, caption: tr("dari 180 pasangan", "from 180 couples"), quotes: [{ text: tr("Gerbangnya persis seperti mimpi saya, bahkan lebih.", "The arch was exactly my dream, even better."), name: "Anindita", role: "Uluwatu 2025", avatar: asset("v3c-face-2") }, { text: tr("Tim datang subuh dan pulang paling akhir.", "The team arrived at dawn and left last."), name: "Bima", role: "Ubud 2025", avatar: asset("v3c-face-3") }, { text: tr("Bunganya masih segar sampai after party.", "Flowers stayed fresh through the after-party."), name: "Laila", role: "Yogyakarta 2026", avatar: asset("v3c-face-4") }] }),
        end,
      ]);
    if (key === "venues")
      return pageC(tk, [
        head,
        beforeAfter(tk, { eyebrow: tr("Transformasi", "Transformation"), title: tr("Aula kosong jadi taman", "An empty hall becomes a garden"), text: tr("Geser untuk melihat ballroom sebelum dan sesudah kami bekerja selama 9 jam.", "Slide to see the ballroom before and after our 9 hours of work."), before: asset("v3c-venue-plain"), after: asset("v3c-venue-bloom"), labels: [tr("Sebelum", "Before"), tr("Sesudah", "After")], alt: tr("Ballroom sebelum dan sesudah dekorasi", "Ballroom before and after styling") }),
        table(tk, { title: tr("Venue langganan", "Regular venues"), columns: [tr("Venue", "Venue"), tr("Kota", "City"), tr("Kapasitas", "Capacity"), tr("Gaya", "Style")], rows: [["Tebing Sunyi", "Uluwatu", "150", tr("Taman tebing", "Cliff garden")], ["Pendopo Sekar Kedaton", "Yogyakarta", "400", tr("Tradisional", "Traditional")], ["Rumah Kaca Bedugul", "Bedugul", "80", tr("Intim", "Intimate")]] }),
        end,
      ]);
    if (key === "process")
      return pageC(tk, [
        head,
        timelineC(tk, { eyebrow: tr("Proses", "Process"), title: tr("Sembilan bulan menuju hari H", "Nine months to the day"), items: [tr("H-9 bulan | Konsultasi | Moodboard & anggaran.", "9 months out | Consultation | Moodboard & budget."), tr("H-6 bulan | Survei venue | Ukur & rencana struktur.", "6 months out | Venue survey | Measure & plan structures."), tr("H-1 bulan | Mock-up | Satu meja contoh untuk dicoba.", "1 month out | Mock-up | One sample table to approve."), tr("Hari H | Pemasangan | Tim 12 orang sejak subuh.", "The day | Installation | A 12-person team from dawn.")], image: asset("v3c-arch"), alt: tr("Gerbang bunga", "Floral arch") }),
        slider(tk, { slides: [{ title: tr("Moodboard", "Moodboard"), text: tr("Warna, tekstur, bunga musiman", "Colours, textures, seasonal blooms"), bg: tk.p.primary }, { title: "Mock-up", text: tr("Coba sebelum hari H", "Try before the day"), bg: tk.p.primaryDark }, { title: tr("Hari H", "The day"), text: tr("Pemasangan 9 jam", "9-hour installation"), bg: tk.dark }], height: 300 }),
        end,
      ]);
    if (key === "enquire")
      return pageC(tk, [
        head,
        form(tk, { title: tr("Ceritakan hari Anda", "Tell us about your day"), info: [["WhatsApp", "+62 361 970 445"], [tr("Anggaran mulai", "Budgets from"), "Rp35 juta"]], fields: [{ kind: "input", label: tr("Nama pasangan", "Couple's names"), ph: "Sekar & Bima" }, { kind: "date", label: tr("Tanggal", "Date") }, { kind: "input", label: tr("Venue", "Venue"), ph: tr("Nama venue", "Venue name") }, { kind: "select", label: tr("Jumlah tamu", "Guests"), ph: tr("Pilih", "Choose"), options: ["< 100", "100–300", "300+"] }], message: tr("Gaya yang diinginkan", "Desired style"), submit: tr("Kirim", "Send") }),
        faq(tk, { title: tr("Sebelum konsultasi", "Before you enquire"), items: [[tr("Melayani luar Bali?", "Outside Bali?"), tr("Ya, Jawa & Lombok dengan biaya perjalanan.", "Yes, Java & Lombok with travel fees.")], [tr("Bunga impor?", "Imported flowers?"), tr("Kami utamakan bunga lokal musiman.", "We prioritise seasonal local blooms.")]] }),
        end,
      ]);
    return pageC(tk, [
      head,
      hero(tk, { kind: "glass", eyebrow: tr("Dekorasi bunga pernikahan", "Wedding floral styling"), title: tr("Bunga yang membuat tamu berhenti sejenak", "Flowers that make guests pause"), text: tr("Gerbang, altar, dan meja tamu dari bunga lokal musiman. Tanpa busa floral, tanpa plastik.", "Arches, altars and tables from seasonal local blooms. No floral foam, no plastic."), acts: [[tr("Lihat portofolio", "See portfolio"), href("portfolio"), "light"], [tr("Konsultasi", "Enquire"), href("enquire"), "outline"]], image: asset("v3c-arch"), alt: tr("Gerbang bunga", "Floral arch"), chips: ["Bali", tr("Jawa", "Java"), "Lombok"] }),
      beforeAfter(tk, { eyebrow: tr("Geser", "Slide"), title: tr("Sembilan jam bekerja", "Nine hours of work"), before: asset("v3c-venue-plain"), after: asset("v3c-venue-bloom"), labels: [tr("Pagi", "Morning"), tr("Sore", "Evening")], alt: tr("Venue sebelum & sesudah", "Venue before & after") }),
      portfolioMosaic(tk, tr, { title: tr("Pernikahan terbaru", "Recent weddings"), works: [{ title: "Anindita & Rafi", tag: "Uluwatu", image: asset("v3c-arch") }, { title: "Sekar & Bima", tag: "Ubud", image: asset("v3c-venue-bloom") }, { title: "Laila & Fikri", tag: "Yogyakarta", image: asset("v3c-bouquet") }, { title: "Maya & Dion", tag: "Canggu", image: asset("v3c-bouquet-sun") }, { title: "Rara & Teguh", tag: "Bandung", image: asset("v3c-arch") }], cta: { label: tr("Semua karya", "All work"), href: href("portfolio") } }),
      cta(tk, { kind: "split", title: tr("Tanggal 2027 mulai dibuka", "2027 dates now open"), acts: [[tr("Konsultasi", "Enquire"), href("enquire"), "light"]] }),
      end,
    ]);
  },
};

/* ---------------- 15. Toko Gawai (PREMIUM, 9 hlm) — bento ------------ */

const TG: Palette = { ink: "#0b1220", muted: "#4b5563", primary: "#2563eb", primaryDark: "#1d4ed8", soft: "#dbeafe", line: "#bfdbfe" };
const tg = lookC(TG, { head: "Sora", body: "Inter", skin: "bento", radius: 20, bg: "#ffffff", alt: "#f3f6fb", dark: "#0b1220", fx: { aos: "fade-up", tilt: { max: 10, glare: true } }, btnR: 12, accent2: "#06b6d4" });

const tgFoot = (tr: Tr) =>
  ftr(tg, "Toko Gawai Petir", {
    kind: "columns",
    about: tr("Toko gawai resmi bergaransi di Medan. Ponsel, laptop, aksesori, dan servis.", "An authorised gadget store in Medan. Phones, laptops, accessories and repairs."),
    cols: [{ title: tr("Belanja", "Shop"), items: [tr("Ponsel", "Phones"), tr("Laptop", "Laptops"), tr("Aksesori", "Accessories")] }, { title: tr("Bantuan", "Help"), items: [tr("Garansi", "Warranty"), tr("Servis", "Repairs"), "FAQ"] }],
    copy: tr("© 2026 Toko Gawai Petir. Konten contoh. Merek produk fiktif.", "© 2026 Toko Gawai Petir. Sample content. Product brands are fictional."),
    social: ["Instagram | https://instagram.com/gawaipetir", "YouTube | https://youtube.com/@gawaipetir", "TikTok | https://tiktok.com/@gawaipetir"],
    backTop: tr("Ke atas", "Top"),
  });

/** Detail produk (Product Card tetap gratis; halaman ini memakai elemen biasa). */
function productDetail(L: LC, tr: Tr, href: (k: string) => string) {
  const pics = col(
    [fxPic(L, image(asset("v3c-gadget"), "Petir Nova 12", { ratio: "1 / 1", radius: L.radius })), gbox([asset("v3c-gadget-dark"), asset("v3c-gadget"), asset("v3c-gadget-dark")].map((s) => image(s, "Petir Nova 12", { ratio: "1 / 1", radius: 12 })), "repeat(3, minmax(0, 1fr))", { gap: 10, name: "Thumbnail", stack: false })],
    { gap: 12, name: "Galeri produk" },
  );
  const info = col(
    [
      kicker(L, tr("Ponsel · Garansi resmi 1 tahun", "Phone · 1-year official warranty")),
      H(L, "Petir Nova 12 — 8/256 GB", "h1", { size: 40 }),
      el("rating", { value: 4.8, caption: tr("dari 1.204 ulasan", "from 1,204 reviews"), color: "#f59e0b", textColor: L.p.muted }, "Rating"),
      inline([H(L, "Rp4.299.000", "h2", { size: 34, color: L.p.primaryDark, full: false }), P(L, "Rp4.799.000", { size: 16, full: false })], { gap: 12 }),
      P(L, tr("Layar AMOLED 6,7 inci 120 Hz, baterai 5.000 mAh, kamera 64 MP. Bonus pelindung layar dan casing.", "6.7-inch 120 Hz AMOLED, 5,000 mAh battery, 64 MP camera. Free screen protector and case.")),
      field(L, { kind: "select", label: tr("Warna", "Colour"), ph: tr("Pilih", "Choose"), options: [tr("Hitam Malam", "Night Black"), tr("Biru Petir", "Bolt Blue"), tr("Perak", "Silver")] }, 0),
      field(L, { kind: "select", label: tr("Proteksi", "Protection"), ph: tr("Pilih", "Choose"), options: [tr("Tanpa proteksi", "None"), tr("Layar pecah 1 thn +Rp199rb", "Screen 1 yr +Rp199k")] }, 1),
      acts(L, [[tr("Tanya stok via WA", "Check stock on WhatsApp"), href("contact")], [tr("Bandingkan", "Compare"), href("compare"), "outline"]]),
      P(L, tr("Pembelian & pembayaran dilakukan di toko atau WhatsApp; situs ini tidak memproses transaksi.", "Purchases & payment happen in store or on WhatsApp; this site does not process transactions."), { size: 13 }),
    ],
    { gap: 14, name: "Info produk" },
  );
  return sec("Detail produk", [grid([pics, info], "minmax(0, 1fr) minmax(0, 1.1fr)", { gap: 48, align: "start" })], { bg: L.bg, padY: 56 });
}

export const shopGadget: TemplateContent = {
  brand: "Toko Gawai Petir",
  pages: [
    home(),
    pg("catalog", ["katalog", "Katalog"], ["catalog", "Catalog"]),
    pg("product", ["detail-produk", "Detail Produk"], ["product", "Product"]),
    pg("compare", ["bandingkan", "Bandingkan"], ["compare", "Compare"]),
    pg("promo", ["promo", "Promo"], ["deals", "Deals"]),
    pg("warranty", ["garansi", "Garansi"], ["warranty", "Warranty"]),
    pg("service", ["servis", "Servis"], ["repairs", "Repairs"]),
    pg("faq", ["bantuan", "Bantuan"], ["help", "Help"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const nav = mega(tg, [`${tr("Ponsel", "Phones")} | ${href("catalog")}`, `- Petir Nova | ${tr("Kelas menengah terlaris", "Best-selling mid-range")} | ${href("product")}`, `- Petir Lite | ${tr("Baterai 2 hari", "Two-day battery")} | ${href("catalog")}`, `${tr("Laptop", "Laptops")} | ${href("catalog")}`, `- Awan Book 14 | ${tr("Ringan 1,2 kg", "Light 1.2 kg")} | ${href("catalog")}`, `Promo | ${href("promo")}`, `${tr("Servis", "Repairs")} | ${href("service")}`, `- ${tr("Garansi", "Warranty")} | ${tr("Klaim resmi", "Official claims")} | ${href("warranty")}`], tr("Promo", "Deals"), href("promo"));
    const head = hdr(tg, "Gawai Petir", { kind: "pill", nav, strip: tr("Cicilan 0% 12 bulan · Tukar tambah ponsel lama", "0% instalments for 12 months · Trade in your old phone") });
    const end = tgFoot(tr);
    const go = href("product");
    const goods: Listing[] = [
      { image: asset("v3c-gadget"), title: "Petir Nova 12", text: "8/256 GB, AMOLED 120 Hz", price: "Rp4.299.000", compare: "Rp4.799.000", badge: tr("Hemat 500rb", "Save 500k"), rating: 4.8, reviews: "(1.204)", cta: tr("Lihat detail", "View details"), href: go },
      { image: asset("v3c-gadget-dark"), title: "Petir Lite 5", text: tr("Baterai 6.000 mAh", "6,000 mAh battery"), price: "Rp1.899.000", rating: 4.6, reviews: "(842)", cta: tr("Lihat detail", "View details"), href: go },
      { image: asset("v3c-gadget"), title: "Awan Book 14", text: tr("Laptop 1,2 kg, 16 GB RAM", "1.2 kg laptop, 16 GB RAM"), price: "Rp8.999.000", rating: 4.7, reviews: "(311)", cta: tr("Lihat detail", "View details"), href: go },
      { image: asset("v3c-gadget-dark"), title: "Gelombang Buds Pro", text: tr("ANC, 30 jam", "ANC, 30 hours"), price: "Rp899.000", rating: 4.5, reviews: "(1.980)", cta: tr("Lihat detail", "View details"), href: go },
      { image: asset("v3c-gadget"), title: "Detak Watch 3", text: tr("GPS, AMOLED", "GPS, AMOLED"), price: "Rp1.499.000", rating: 4.6, reviews: "(520)", cta: tr("Lihat detail", "View details"), href: go },
      { image: asset("v3c-gadget-dark"), title: tr("Pengisi Daya Kilat 65W", "Bolt 65W Charger"), text: "GaN, 3 port", price: "Rp349.000", rating: 4.8, reviews: "(2.410)", cta: tr("Lihat detail", "View details"), href: go },
    ];
    if (key === "catalog")
      return pageC(tg, [
        head,
        banner(tg, { kind: "rule", eyebrow: tr("Katalog", "Catalog"), title: tr("Semua gawai", "All gadgets"), text: tr("Harga sudah termasuk PPN. Stok diperbarui setiap jam.", "Prices include VAT. Stock updated hourly.") }),
        catalog(tg, { title: tr("Ponsel, laptop & aksesori", "Phones, laptops & accessories"), items: goods }),
        chips(tg, { title: tr("Cari berdasarkan kebutuhan", "Shop by need"), chips: [tr("Kamera terbaik", "Best camera"), tr("Baterai awet", "Long battery"), tr("Untuk gim", "Gaming"), tr("Kerja & kuliah", "Work & study"), tr("Di bawah 2 juta", "Under 2 million")], bg: tg.alt }),
        end,
      ]);
    if (key === "product")
      return pageC(tg, [
        head,
        productDetail(tg, tr, href),
        table(tg, { title: tr("Spesifikasi & isi kotak", "Specs & in the box"), name: tr("Spesifikasi", "Specs"), columns: [tr("Bagian", "Item"), tr("Detail", "Details")], rows: [[tr("Layar", "Display"), tr("6,7 inci AMOLED 120 Hz", "6.7-inch 120 Hz AMOLED")], ["Chipset", tr("Octa-core 4 nm", "4 nm octa-core")], [tr("Kamera", "Cameras"), "64 + 8 + 2 MP"], [tr("Baterai", "Battery"), tr("5.000 mAh, pengisian 45 W", "5,000 mAh, 45 W charging")], [tr("Isi kotak", "In the box"), tr("Unit, kabel USB-C, charger 45 W, casing, manual", "Phone, USB-C cable, 45 W charger, case, manual")], [tr("Garansi", "Warranty"), tr("1 tahun resmi + 30 hari tukar unit", "1-year official + 30-day replacement")]] }),
        catalog(tg, { title: tr("Sering dibeli bersama", "Frequently bought together"), items: goods.slice(3, 6), name: tr("Produk terkait", "Related products") }),
        end,
      ]);
    if (key === "compare")
      return pageC(tg, [
        head,
        compare(tg, { eyebrow: tr("Bandingkan", "Compare"), title: tr("Nova atau Lite?", "Nova or Lite?"), columns: ["Petir Lite 5", "Petir Nova 12", "Awan Book 14"], rows: [tr("Harga | Rp1,9jt | Rp4,3jt | Rp9jt", "Price | Rp1.9m | Rp4.3m | Rp9m"), tr("Layar | LCD 90 Hz | AMOLED 120 Hz | IPS 14 inci", "Display | LCD 90 Hz | AMOLED 120 Hz | 14-inch IPS"), tr("NFC | tidak | ya | tidak", "NFC | no | yes | no"), tr("Pengisian cepat | ya | ya | ya", "Fast charging | yes | yes | yes"), tr("Garansi | 1 thn | 1 thn | 2 thn", "Warranty | 1 yr | 1 yr | 2 yrs")], highlight: 2, caption: tr("Rekomendasi staf toko", "Store staff pick") }),
        quotes(tg, { title: tr("Ulasan pembeli", "Buyer reviews"), items: [{ quote: tr("Baterai Nova tahan seharian untuk ojek daring.", "The Nova battery lasts a full day of ride-hailing."), author: "Hendra Sitorus", role: "Medan", avatar: asset("v3c-face-3"), rating: 5 }, { quote: tr("Tukar tambah ponsel lama, prosesnya 20 menit.", "Traded in my old phone in 20 minutes."), author: "Rizky Nasution", role: "Binjai", avatar: asset("v3c-face-1"), rating: 5 }, { quote: tr("Staf menjelaskan tanpa memaksa beli.", "Staff explained without pushing a sale."), author: "Dewi Lubis", role: "Medan", avatar: asset("v3c-face-4"), rating: 4 }] }),
        end,
      ]);
    if (key === "promo")
      return pageC(tg, [
        head,
        countdownBand(tg, { eyebrow: tr("Pesta Gawai 11.11", "11.11 Gadget Fest"), title: tr("Promo berakhir dalam", "Deals end in"), text: tr("Diskon hingga 30% dan cicilan 0% 12 bulan.", "Up to 30% off and 0% instalments for 12 months."), target: "2026-11-11T23:59", finished: tr("Promo telah berakhir.", "The sale has ended."), actions: [[tr("Lihat produk", "See products"), href("catalog"), "light"]], bg: tg.p.primaryDark }),
        catalog(tg, { title: tr("Harga promo", "Sale prices"), items: goods.slice(0, 3), name: "Promo" }),
        slider(tg, { slides: [{ title: tr("Tukar tambah +Rp300rb", "Trade-in bonus +Rp300k"), text: tr("Untuk ponsel lama merek apa pun", "For any old phone"), bg: tg.p.primary }, { title: tr("Cicilan 0%", "0% instalments"), text: tr("Kartu kredit & paylater", "Credit card & paylater"), bg: tg.dark }], height: 260 }),
        end,
      ]);
    if (key === "warranty")
      return pageC(tg, [
        head,
        banner(tg, { kind: "image", eyebrow: tr("Garansi resmi", "Official warranty"), title: tr("Klaim garansi tanpa ribet", "Hassle-free warranty claims"), text: tr("Bawa unit & nota, kami urus ke pusat servis.", "Bring the unit & receipt; we handle the service centre."), image: asset("v3c-gadget-dark"), alt: tr("Gawai", "Gadget") }),
        steps(tg, { title: tr("Alur klaim", "Claim flow"), items: [[tr("Bawa unit", "Bring the unit"), tr("Dengan nota atau kartu garansi.", "With receipt or warranty card.")], [tr("Cek 15 menit", "15-minute check"), tr("Teknisi mendiagnosis di depan Anda.", "Technician diagnoses in front of you.")], [tr("Unit pengganti", "Loan unit"), tr("Selama perbaikan > 3 hari.", "While repairs take > 3 days.")]] }),
        end,
      ]);
    if (key === "service")
      return pageC(tg, [
        head,
        priceLines(tg, { eyebrow: tr("Servis", "Repairs"), title: tr("Tarif servis umum", "Common repair rates"), groups: [{ title: tr("Ponsel", "Phones"), items: [[tr("Ganti layar", "Screen replacement"), tr("Suku cadang asli", "Original parts"), tr("mulai Rp650.000", "from Rp650,000")], [tr("Ganti baterai", "Battery replacement"), tr("30 menit", "30 minutes"), "Rp280.000"]] }, { title: tr("Laptop", "Laptops"), items: [[tr("Bersih & pasta", "Clean & repaste"), tr("1 jam", "1 hour"), "Rp150.000"], [tr("Upgrade SSD", "SSD upgrade"), tr("Pindah data gratis", "Free data migration"), tr("mulai Rp450.000", "from Rp450,000")]] }] }),
        form(tg, { title: tr("Booking servis", "Book a repair"), info: [[tr("Lokasi", "Location"), "Jl. Gatot Subroto 88, Medan"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "input", label: tr("Tipe perangkat", "Device model"), ph: "Petir Nova 12" }, { kind: "date", label: tr("Jadwal datang", "Visit time"), mode: "datetime-local" }], message: tr("Keluhan", "Issue"), submit: tr("Booking", "Book") }),
        end,
      ]);
    if (key === "faq")
      return pageC(tg, [
        head,
        faq(tg, { eyebrow: tr("Bantuan", "Help"), title: tr("Pertanyaan pembeli", "Buyer questions"), items: [[tr("Apakah produk resmi?", "Are products official?"), tr("Ya, semua bergaransi resmi distributor.", "Yes, all carry official distributor warranty.")], [tr("Bisa kirim ke luar kota?", "Shipping out of town?"), tr("Ya, dengan asuransi pengiriman.", "Yes, with shipping insurance.")], [tr("Cicilan tanpa kartu kredit?", "Instalments without credit card?"), tr("Bisa lewat paylater mitra.", "Yes, via partner paylater.")], [tr("Tukar tambah?", "Trade-in?"), tr("Taksiran langsung di toko.", "Instant valuation in store.")]], act: [tr("Chat CS", "Chat support"), href("contact")] }),
        infoTiles(tg, [[tr("CS", "Support"), "08.00–22.00"], [tr("Balasan", "Reply time"), tr("< 10 menit", "< 10 min")], [tr("Toko", "Store"), "Medan"]], { bg: tg.alt }),
        end,
      ]);
    if (key === "contact")
      return pageC(tg, [
        head,
        form(tg, { title: tr("Tanya stok & harga", "Ask about stock & prices"), info: [["WhatsApp", "+62 811 6000 8822"], [tr("Toko", "Store"), "Jl. Gatot Subroto 88, Medan"], [tr("Jam", "Hours"), "10.00–22.00"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { kind: "input", label: tr("Produk", "Product"), ph: "Petir Nova 12" }], message: tr("Pertanyaan", "Question"), submit: tr("Kirim", "Send") }),
        newsletter(tg, { title: tr("Info promo duluan", "Hear about deals first"), text: tr("Kabar flash sale langsung ke email Anda.", "Flash sale alerts straight to your inbox."), ph: "email@contoh.id", submit: tr("Daftar", "Subscribe") }),
        end,
      ]);
    return pageC(tg, [
      head,
      hero(tg, { kind: "bento", eyebrow: tr("Gawai resmi bergaransi", "Official, warrantied gadgets"), title: tr("Upgrade gawai tanpa drama", "Upgrade your gadget, no drama"), text: tr("Ponsel, laptop, dan aksesori bergaransi resmi. Tukar tambah dan cicilan 0% di toko.", "Phones, laptops and accessories with official warranty. Trade-in and 0% instalments in store."), acts: [[tr("Belanja", "Shop now"), href("catalog")], [tr("Promo 11.11", "11.11 deals"), href("promo"), "outline"]], image: asset("v3c-gadget"), alt: tr("Ponsel dan laptop", "Phone and laptop"), stat: ["0%", tr("Cicilan 12 bulan", "12-month instalments")], chips: [tr("Garansi resmi", "Official warranty"), tr("Tukar tambah", "Trade-in")] }),
      slider(tg, { slides: [{ title: "Petir Nova 12", text: tr("Kini Rp4,299 juta", "Now Rp4.299m"), bg: tg.p.primary }, { title: "Awan Book 14", text: tr("Laptop 1,2 kg untuk kuliah", "A 1.2 kg laptop for study"), bg: tg.dark }], height: 280 }),
      catalog(tg, { eyebrow: tr("Terlaris", "Best sellers"), title: tr("Pilihan minggu ini", "This week's picks"), items: goods }),
      cta(tg, { kind: "split", title: tr("Bingung pilih?", "Not sure which?"), text: tr("Bandingkan spesifikasi berdampingan.", "Compare specs side by side."), acts: [[tr("Bandingkan", "Compare"), href("compare"), "light"]] }),
      end,
    ]);
  },
};
