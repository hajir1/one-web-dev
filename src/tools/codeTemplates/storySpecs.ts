import type { StorySpec } from "./story3d";
import { SCENE_KOMPUTER, SCENE_KUCING } from "./storyScenesA";

/* ================================================================== */
/* 17 3D Scroll Story templates (v22). All brands, names, numbers, and  */
/* contacts are fictional. Each template's flow is different; see the comment above */
/* each specification.                                                  */
/* ================================================================== */

const F = (display: string, text: string, q: string) => ({ display, text, href: `https://fonts.googleapis.com/css2?${q}&display=swap` });

export const STORY_SPECS_A: StorySpec[] = [
  /* An empty computer → the screen lights up → the camera enters the screen → text comes out of the screen → the screen shows the finished site. */
  {
    id: "story-layar-kosong",
    title: "Studio Barisan · Dari Layar Kosong",
    description: "Agensi web: komputer kosong di meja, saat digulir layar menyala dan mengetik, kamera masuk ke layar, lalu teks keluar dari layar dan situs jadi tampil di monitor.",
    brand: "Studio Barisan",
    footer: "Jl. Cikini Raya 21, Jakarta · Studio web & produk digital",
    font: F("Space Grotesk", "Inter", "family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600"),
    colors: { bg: "#0d0f17", bg2: "#1c2240", panel: "#141827", ink: "#f2f4ff", inkSoft: "#a3aac6", accent: "#5cf2b8", accent2: "#8c7bff", line: "rgba(255,255,255,.12)", obj: "#d9dbe4", obj2: "#5a4636", veil: "#0c1020", dark: true },
    configLabel: "Teks di layar komputer",
    config: { layarBaris: ["halo, dunia.", "layar ini masih kosong.", "mari kita isi."], judulSitus: "Situs yang bekerja.", layarAkhir: "Ayo mulai.", layarAkhirSub: "halo@studiobarisan.id" },
    acts: [
      { id: "awal", kind: "hero", side: "left", fx: "rise", kicker: "Studio web & produk digital", title: "Semua dimulai dari layar kosong.", body: ["Gulir pelan-pelan. Kami tunjukkan bagaimana satu baris kode berubah menjadi situs yang dipakai ribuan orang."], key: { cam: [5.6, 1.5, 7.6], look: [-1.4, 0.1, 0], boot: 0, type: 0, ui: 0, end: 0 } },
      { id: "nyala", nav: "Cerita", kind: "text", side: "right", fx: "type", kicker: "Baris pertama", title: "Lalu layar menyala.", body: ["Setiap proyek kami mulai dengan menulis masalahnya dalam satu kalimat, sebelum satu piksel pun digambar."], key: { cam: [-2.6, 0.9, 5.2], look: [1.5, 0.3, 0], boot: 1, type: 0.6 } },
      { id: "masuk", kind: "quote", side: "center", fx: "zoom", vh: 180, title: "Dari satu baris kode, lahir sebuah merek yang bisa disentuh.", key: { cam: [0, 0.35, 0.62], look: [0, 0.35, 0], type: 1, veil: 1, sway: 0 } },
      { id: "layanan", nav: "Layanan", kind: "cards", side: "left", fx: "chars", kicker: "Yang kami kerjakan", title: "Situs, aplikasi, sistem desain.", cards: [{ tag: "2-6 minggu", title: "Situs perusahaan", text: "Cepat, mudah diubah tim Anda, dan rapi di mesin pencari." }, { tag: "8-16 minggu", title: "Produk digital", text: "Dari riset pengguna sampai aplikasi yang siap diluncurkan." }, { tag: "Berkelanjutan", title: "Tim cadangan", text: "Desainer dan developer kami bergabung ke sprint Anda." }], key: { cam: [4.2, 2.4, 6.6], look: [-1.7, 0.1, 0], veil: 0, ui: 1, sway: 0.4 } },
      { id: "angka", nav: "Hasil", kind: "stats", side: "right", fx: "slide", kicker: "Sejak 2016", title: "Angka yang kami jaga.", stats: [["140+", "situs diluncurkan"], ["98", "skor kecepatan rata-rata"], ["9", "tahun bersama klien"]], key: { cam: [-4.6, 3.2, 5.2], look: [1.6, -0.2, 0] } },
      { id: "kontak", nav: "Kontak", kind: "contact", side: "center", fx: "rise", kicker: "Giliran Anda", title: "Layar Anda masih kosong?", body: ["Ceritakan idenya. Kami balas dalam satu hari kerja."], cta: [{ label: "Chat WhatsApp", href: "wa" }, { label: "Lihat cerita lagi", href: "#awal", ghost: true }], key: { cam: [0, 1.0, 8.8], look: [0, -0.9, 0], end: 1 } },
    ],
    email: "halo@studiobarisan.id",
    wa: "6281200001001",
    scene: SCENE_KOMPUTER,
  },
  /* Cat sits → the camera approaches the eye → the pupil widens → into the pupil → universe → paw print constellation → back out. */
  {
    id: "story-mata-kucing",
    title: "Semesta Meong · Klinik & Hotel Kucing",
    description: "Klinik dan hotel kucing: kucing 3D duduk mengibaskan ekor, saat digulir kamera mendekati matanya, pupil melebar, lalu semesta bintang muncul dari dalam mata dan membentuk rasi jejak kaki.",
    brand: "Semesta Meong",
    footer: "Jl. Kemang Selatan 8, Jakarta · Buka setiap hari 08.00 sampai 21.00",
    font: F("Fredoka", "Nunito", "family=Fredoka:wght@500;700&family=Nunito:wght@400;700"),
    colors: { bg: "#120e1f", bg2: "#2b2150", panel: "#1c1630", ink: "#fff7ec", inkSoft: "#c8bfd9", accent: "#ffb648", accent2: "#7ad7ff", line: "rgba(255,255,255,.12)", obj: "#e8893a", obj2: "#fff1dc", veil: "#020205", dark: true },
    configLabel: "Pengaturan adegan",
    config: {},
    acts: [
      { id: "halo", kind: "hero", side: "left", fx: "chars", kicker: "Klinik & hotel kucing", title: "Lihat matanya baik-baik.", body: ["Setiap kucing membawa semesta kecilnya sendiri. Tugas kami menjaganya tetap bersinar."], key: { cam: [3.2, 1.2, 7.2], look: [-1.3, 0.3, 0], pupil: 0, space: 0, paw: 0 } },
      { id: "dekat", nav: "Cerita", kind: "text", side: "right", fx: "rise", kicker: "Lebih dekat", title: "Pupilnya mulai melebar.", body: ["Kucing yang penasaran, tenang, dan sehat menatap dunia dengan mata seperti ini."], key: { cam: [-1.6, 1.25, 2.9], look: [0.4, 1.0, 0.8], pupil: 0.35 } },
      { id: "mata", kind: "quote", side: "center", fx: "wipe", vh: 170, title: "Di balik mata kucing, ada semesta yang perlu dirawat.", key: { cam: [-0.37, 1.05, 1.16], look: [-0.37, 1.05, 0.9], pupil: 1, sway: 0, veil: 0.85 } },
      { id: "semesta", nav: "Layanan", kind: "cards", side: "left", fx: "flip", kicker: "Layanan kami", title: "Semesta yang kami rawat.", cards: [{ tag: "24 jam", title: "Klinik & vaksin", text: "Dokter hewan khusus kucing, vaksin, dan sterilisasi." }, { tag: "Ber-AC", title: "Hotel kucing", text: "Kamar pribadi, kamera pantau, dan laporan foto harian." }, { tag: "Ramah", title: "Grooming lembut", text: "Mandi, potong kuku, dan sisir tanpa membuat stres." }], key: { cam: [3.0, 13.5, 11.0], look: [-3.0, 0.4, 0.0], space: 1, veil: 0, sway: 0.4 } },
      { id: "rasi", nav: "Angka", kind: "stats", side: "right", fx: "slide", kicker: "Rasi jejak kaki", title: "Bintang-bintang kami.", stats: [["12.000", "kucing pernah dirawat"], ["4,9", "ulasan pemilik"], ["24", "jam siaga dokter"]], key: { cam: [-2.4, 4.6, 13.0], look: [1.7, 4.2, -1.0], paw: 1 } },
      { id: "pulang", nav: "Kontak", kind: "contact", side: "right", fx: "rise", kicker: "Kembali ke bumi", title: "Bawa semesta kecilmu ke sini.", body: ["Jadwalkan kunjungan atau tanya kamar hotel lewat WhatsApp."], cta: [{ label: "Chat WhatsApp", href: "wa" }, { label: "Ulangi cerita", href: "#halo", ghost: true }], key: { cam: [-2.2, 0.9, 8.0], look: [1.9, 0.0, 0], space: 0, paw: 0, pupil: 0.15 } },
    ],
    email: "halo@semestameong.id",
    wa: "6281200001002",
    scene: SCENE_KUCING,
  },
];
