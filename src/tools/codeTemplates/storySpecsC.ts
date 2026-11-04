import type { StorySpec } from "./story3d";
import { SCENE_JAMPASIR, SCENE_LAMPU, SCENE_PESAWAT } from "./storyScenesC";

const F = (display: string, text: string, q: string) => ({ display, text, href: `https://fonts.googleapis.com/css2?${q}&display=swap` });

export const STORY_SPECS_C: StorySpec[] = [
  /* Flat paper on a desk → a corner folds → becomes a paper plane → flies through word rings → lands again. */
  {
    id: "story-pesawat-kertas",
    title: "Lipat Kata · Agensi Konten & Penulisan",
    description: "Agensi konten: selembar kertas di meja dilipat saat digulir sampai menjadi pesawat kertas, lalu terbang melewati cincin kata dan meninggalkan jejak putus-putus.",
    brand: "Lipat Kata",
    footer: "Lipat Kata · Yogyakarta · Penulisan, konten media sosial, dan buletin",
    font: F("Bricolage Grotesque", "Inter", "family=Bricolage+Grotesque:wght@500;800&family=Inter:wght@400;600"),
    colors: { bg: "#e9f1fa", bg2: "#ffffff", panel: "#ffffff", ink: "#132033", inkSoft: "#4e5d74", accent: "#ff5a3c", accent2: "#2f6bff", line: "rgba(19,32,51,.12)", obj: "#fbfbf7", obj2: "#c99a6b", veil: "#132033", dark: false },
    configLabel: "Kata di cincin yang dilewati pesawat",
    config: { kata: ["Cerita", "Kampanye", "Buletin", "Naskah"] },
    acts: [
      { id: "kertas", kind: "hero", side: "left", fx: "chars", kicker: "Agensi konten & penulisan", title: "Kata yang tepat bisa terbang.", body: ["Selembar kertas kosong di meja kami. Gulir, dan lihat apa yang terjadi kalau dilipat dengan benar."], key: { cam: [3.2, 4.4, 5.6], look: [-1.5, 0, 0], fold: 0, lift: 0, fly: 0 } },
      { id: "lipat", nav: "Cara kerja", kind: "text", side: "right", fx: "type", kicker: "Lipatan pertama", title: "Rapikan sudutnya dulu.", body: ["Kami mulai dari satu pertanyaan: siapa pembacanya, dan apa yang harus mereka lakukan setelah membaca?"], key: { cam: [-2.6, 4.0, 4.4], look: [1.3, 0, 0], fold: 0.45 } },
      { id: "bentuk", kind: "text", side: "left", fx: "wipe", kicker: "Lipatan terakhir", title: "Lalu bentuknya jelas.", body: ["Struktur, nada, dan judul disepakati sebelum kami menulis paragraf pertama."], key: { cam: [4.0, 2.2, 5.2], look: [-1.7, 0.7, 0], fold: 1, lift: 1 } },
      { id: "terbang", kind: "quote", side: "center", fx: "rise", vh: 230, title: "Tulisan yang baik tidak diam di meja.", key: { cam: [0, 7.5, 15.0], look: [0, 3.0, -8.0], fly: 0.6 } },
      { id: "layanan", nav: "Layanan", kind: "cards", side: "right", fx: "flip", kicker: "Yang kami tulis", title: "Melewati setiap cincin.", cards: [{ tag: "Mingguan", title: "Konten media sosial", text: "Kalender, naskah, dan desain sederhana untuk tiga platform." }, { tag: "Bulanan", title: "Buletin email", text: "Ditulis, dijadwalkan, dan dilaporkan angka bukanya." }, { tag: "Per proyek", title: "Naskah situs & profil", text: "Halaman yang menjelaskan bisnis Anda dalam 10 detik." }], key: { cam: [-6.0, 5.0, 8.0], look: [3.6, 3.0, -6.0], fly: 0.88 } },
      { id: "kontak", nav: "Kontak", kind: "contact", side: "left", fx: "rise", kicker: "Mendarat", title: "Kirimkan kertas kosong Anda.", body: ["Ceritakan bisnisnya dalam tiga kalimat. Kami balas dengan contoh tulisan, gratis."], cta: [{ label: "Chat WhatsApp", href: "wa" }, { label: "Lipat ulang", href: "#kertas", ghost: true }], key: { cam: [4.4, 3.4, 6.4], look: [-1.0, 0.9, 0], fly: 1 } },
    ],
    email: "halo@lipatkata.id",
    wa: "6281200001007",
    scene: SCENE_PESAWAT,
  },
  /* A dark light bulb → the filament lights up → the camera enters the filament → the filament breaks into a pulsing neural network. */
  {
    id: "story-bola-lampu",
    title: "Nalar Labs · Konsultan AI",
    description: "Konsultan kecerdasan buatan: bola lampu gelap di tengah layar, saat digulir filamennya menyala, kamera masuk ke filamen, lalu cahaya pecah menjadi jaringan saraf yang berdenyut.",
    brand: "Nalar Labs",
    footer: "Nalar Labs · Jakarta · Konsultan & pengembangan AI",
    font: F("Unbounded", "Manrope", "family=Unbounded:wght@500;700&family=Manrope:wght@400;600"),
    colors: { bg: "#0b0913", bg2: "#2a1b45", panel: "#14111f", ink: "#f6f1ff", inkSoft: "#b2a8c9", accent: "#ffc65c", accent2: "#a77bff", line: "rgba(255,255,255,.12)", obj: "#8a8f99", obj2: "#e0d6ff", veil: "#0b0913", dark: true },
    configLabel: "Pengaturan adegan",
    config: {},
    thumb: 3,
    acts: [
      { id: "gelap", kind: "hero", side: "left", fx: "rise", kicker: "Konsultan AI", title: "Ide bagus sering mulai dalam gelap.", body: ["Data Anda sudah ada. Yang belum ada adalah cara menyalakannya."], key: { cam: [3.2, 1.6, 6.2], look: [-1.4, 0.7, 0], glow: 0, net: 0 } },
      { id: "nyala", nav: "Cara kerja", kind: "text", side: "right", fx: "type", kicker: "Minggu pertama", title: "Lalu filamennya menyala.", body: ["Kami cari satu proses yang paling banyak makan waktu tim Anda, lalu membuktikan AI bisa memangkasnya."], key: { cam: [-2.2, 1.3, 4.0], look: [1.0, 0.9, 0], glow: 1 } },
      { id: "masuk", kind: "quote", side: "center", fx: "zoom", vh: 190, title: "Di dalam satu cahaya, ada ribuan sambungan.", key: { cam: [0.05, 1.02, 0.8], look: [0, 0.98, 0], net: 0.5, sway: 0 } },
      { id: "jaringan", nav: "Layanan", kind: "cards", side: "left", fx: "chars", kicker: "Yang kami bangun", title: "Jaringan yang bekerja.", cards: [{ tag: "4 minggu", title: "Asisten dokumen", text: "Tanya jawab atas SOP, kontrak, dan laporan internal." }, { tag: "6 minggu", title: "Prediksi permintaan", text: "Stok dan jadwal produksi dari data penjualan Anda." }, { tag: "Berkelanjutan", title: "Tim AI sewaan", text: "Engineer kami bergabung sampai tim Anda siap mandiri." }], key: { cam: [6.0, 3.0, 12.0], look: [-3.2, 1.0, 0], net: 1, sway: 0.4 } },
      { id: "angka", nav: "Hasil", kind: "stats", side: "right", fx: "slide", kicker: "Hasil klien", title: "Cahaya yang terukur.", stats: [["38%", "waktu kerja dihemat"], ["21", "model di produksi"], ["11", "industri"]], key: { cam: [-7.0, -1.5, 10.0], look: [3.2, 1.0, 0] } },
      { id: "kontak", nav: "Kontak", kind: "contact", side: "center", fx: "flip", kicker: "Ngobrol dulu", title: "Ceritakan proses yang paling melelahkan.", body: ["Satu jam konsultasi gratis. Kami pulang dengan satu ide yang bisa diuji dalam sebulan."], cta: [{ label: "Chat WhatsApp", href: "wa" }, { label: "Matikan lampu lagi", href: "#gelap", ghost: true }], key: { cam: [0, 1.0, 17.0], look: [0, -2.5, 0] } },
    ],
    email: "halo@nalarlabs.id",
    wa: "6281200001008",
    scene: SCENE_LAMPU,
  },
  /* Hourglass → sand falls with the scroll → lid opens → grains fly into a timeline ring → the camera travels along the ring. */
  {
    id: "story-jam-pasir",
    title: "Batik Laras · Sejak 1987",
    description: "Rumah batik keluarga: jam pasir yang pasirnya turun mengikuti scroll, lalu tutupnya terbuka dan butir pasir terbang membentuk cincin lini waktu dengan tonggak tahun.",
    brand: "Batik Laras",
    footer: "Batik Laras · Jl. Dr. Radjiman 210, Surakarta · Sejak 1987",
    font: F("Cormorant Garamond", "Karla", "family=Cormorant+Garamond:wght@600;700&family=Karla:wght@400;600"),
    colors: { bg: "#1b1510", bg2: "#3b2a1b", panel: "#231b14", ink: "#f8eedf", inkSoft: "#cdbba3", accent: "#e6b45c", accent2: "#c4553a", line: "rgba(248,238,223,.14)", obj: "#e6b45c", obj2: "#6b4426", veil: "#1b1510", dark: true },
    configLabel: "Tonggak lini waktu",
    config: { tonggak: [{ tahun: 1987, teks: "Satu canting" }, { tahun: 1998, teks: "Toko pertama" }, { tahun: 2009, teks: "Ekspor ke Jepang" }, { tahun: 2016, teks: "Galeri Solo" }, { tahun: 2025, teks: "Kelas daring" }] },
    thumb: 3,
    acts: [
      { id: "waktu", kind: "hero", side: "left", fx: "chars", kicker: "Rumah batik sejak 1987", title: "Batik butuh waktu.", body: ["Satu kain tulis bisa memakan tiga bulan. Gulir, dan biarkan pasirnya turun."], key: { cam: [3.2, 0.9, 6.6], look: [-1.5, 0, 0], sand: 0.04, open: 0, ring: 0, years: 0 } },
      { id: "sabar", nav: "Cerita", kind: "text", side: "right", fx: "type", kicker: "Butir demi butir", title: "Malam, canting, celup, ulang.", body: ["Setiap warna berarti satu kali celup dan satu kali lorot. Tidak ada jalan pintas yang menghasilkan kain yang sama."], key: { cam: [-2.0, 0.5, 4.2], look: [1.0, -0.2, 0], sand: 0.6 } },
      { id: "lepas", kind: "quote", side: "center", fx: "wipe", vh: 200, title: "Waktu yang dijaga menjadi warisan.", key: { cam: [0, 2.2, 8.5], look: [0, 0.6, 0], sand: 1, open: 1, ring: 0.5 } },
      { id: "jejak", nav: "Lini waktu", kind: "cards", side: "left", fx: "flip", kicker: "Lini waktu kami", title: "Tiga dekade, satu cincin.", cards: [{ tag: "1987", title: "Satu canting", text: "Ibu Laras membatik di teras rumah di Laweyan." }, { tag: "2009", title: "Ekspor ke Jepang", text: "Kain tulis kami dipakai untuk kimono musim panas." }, { tag: "2025", title: "Kelas daring", text: "Kini 4.000 murid belajar membatik dari rumah." }], key: { cam: [9.5, 4.5, 10.5], look: [-3.0, -1.0, 2.0], ring: 1, years: 1 } },
      { id: "angka", nav: "Angka", kind: "stats", side: "right", fx: "slide", kicker: "Yang tersimpan", title: "Pasir yang sudah turun.", stats: [["38", "tahun membatik"], ["640", "motif tercatat"], ["27", "pembatik tetap"]], key: { cam: [-10.0, 3.0, -5.0], look: [3.0, -1.0, -1.0] } },
      { id: "kunjungi", nav: "Kontak", kind: "contact", side: "center", fx: "rise", kicker: "Mampir ke galeri", title: "Lihat kainnya, sentuh waktunya.", body: ["Galeri buka setiap hari. Kelas membatik setiap Sabtu pagi."], cta: [{ label: "Chat WhatsApp", href: "wa" }, { label: "Balik jam pasirnya", href: "#waktu", ghost: true }], key: { cam: [0, 16.0, 7.0], look: [0, -1.8, 0] } },
    ],
    email: "halo@batiklaras.id",
    wa: "6281200001009",
    scene: SCENE_JAMPASIR,
  },
];
