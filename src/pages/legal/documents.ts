// ─── pages/legal/documents.ts ───────────────────────────────────────────────
// Content of the Terms & Conditions, Privacy Policy, Refund Policy, and Contact.
// DRAFT prepared following the ITE Law, GR 71/2019 (PSTE), GR 80/2019 (PMSE),
// Law 27/2022 (Personal Data Protection), and Law 8/1999 (Consumer
// Consumer Protection). Must be reviewed by a lawyer before use. Text in
// [square brackets] = placeholder (see config/legal.ts).
//
// Format: each section holds paragraphs (string) or bullet lists (string[]).
// Documents are in Indonesian only (Law 24/2009: agreements with Indonesian
// parties must be in Indonesian); the /en pages show that note.

import { BUSINESS as B, LEGAL_EFFECTIVE_DATE, LEGAL_VERSION, type LegalDocId } from "../../config/legal";

export type LegalBlock = string | string[];
interface LegalSection {
  heading: string;
  body: LegalBlock[];
}
export interface LegalDocument {
  id: LegalDocId;
  title: string;
  summary: string;
  sections: LegalSection[];
}

const META = `Versi ${LEGAL_VERSION} · berlaku sejak ${LEGAL_EFFECTIVE_DATE}`;

const terms: LegalDocument = {
  id: "terms",
  title: "Syarat & Ketentuan Layanan",
  summary: `${META}. Dengan membuat akun, masuk dengan Google, atau membeli kredit, Anda menyetujui syarat ini.`,
  sections: [
    {
      heading: "1. Para pihak dan persetujuan",
      body: [
        `Layanan ${B.brand} (situs ${B.website} beserta aplikasinya, selanjutnya "Layanan") diselenggarakan oleh ${B.legalName}, ${B.entityType} yang beralamat di ${B.address}, NIB ${B.nib}, terdaftar sebagai Penyelenggara Sistem Elektronik Lingkup Privat dengan nomor ${B.pseNumber} (selanjutnya "Kami").`,
        `Syarat & Ketentuan ini adalah perjanjian elektronik antara Kami dan Anda sebagai pengguna. Persetujuan Anda dicatat secara elektronik (versi dokumen dan waktu persetujuan) dan memiliki kekuatan hukum yang sama dengan perjanjian tertulis sesuai UU Informasi dan Transaksi Elektronik.`,
        "Jika Anda tidak menyetujui syarat ini, jangan membuat akun atau membeli kredit. Fitur yang berjalan sepenuhnya di browser tanpa akun tetap tunduk pada bagian 8, 11, dan 12.",
      ],
    },
    {
      heading: "2. Definisi",
      body: [
        [
          "Akun: identitas Anda di Layanan, dibuat dengan email dan kata sandi atau akun Google.",
          "Kredit: satuan nilai di dalam Layanan untuk membuka fitur berbayar. Kredit BUKAN uang elektronik, bukan simpanan, dan tidak dapat ditukar dengan uang kecuali diatur di Kebijakan Refund.",
          "Item Premium: template, section, elemen, event, atau fitur Web Maker yang ditandai Premium dan dibuka dengan Kredit.",
          "Konten Pengguna: desain, teks, gambar, berkas, dan data lain yang Anda buat atau unggah.",
          "Kode Hasil Ekspor: berkas kode (HTML, React, Vue, Svelte, Angular, dan lainnya) yang dibuat Layanan dari desain Anda.",
        ],
      ],
    },
    {
      heading: "3. Akun",
      body: [
        [
          "Anda berusia minimal 18 tahun, atau telah mendapat persetujuan orang tua/wali yang ikut menyetujui syarat ini.",
          "Data yang Anda berikan benar dan Anda menjaga kerahasiaan kata sandi. Semua aktivitas dari Akun Anda dianggap dilakukan oleh Anda sampai Anda melaporkan penyalahgunaan kepada Kami.",
          "Satu orang boleh memiliki lebih dari satu Akun, tetapi tidak boleh membuat Akun tambahan untuk menyalahgunakan promosi, referral, atau kuota gratis.",
          "Anda dapat menghapus Akun kapan saja dari menu Akun & Privasi. Akibat penghapusan dijelaskan di bagian 13 dan Kebijakan Privasi.",
        ],
      ],
    },
    {
      heading: "4. Kredit dan harga",
      body: [
        "Harga paket Kredit ditampilkan dalam Rupiah dan sudah final saat Anda membayar (termasuk diskon voucher bila ada). Pajak yang berlaku mengikuti ketentuan perpajakan Indonesia dan dicantumkan di invoice bila dikenakan.",
        [
          "Kredit masuk ke Akun setelah pembayaran dikonfirmasi oleh penyedia pembayaran, bukan saat Anda kembali dari halaman pembayaran.",
          "Kredit tidak memiliki masa kedaluwarsa selama Akun aktif, tidak dapat dipindahkan ke Akun lain, dan tidak dapat diuangkan.",
          "Kredit gratis, promosi, atau imbalan referral tidak dapat diuangkan dalam keadaan apa pun.",
          "Bila pembayaran direfund atau dibatalkan oleh bank (chargeback), Kredit dari pembelian tersebut ditarik kembali walaupun saldo menjadi negatif. Saldo negatif harus dilunasi sebelum fitur berbayar dapat dipakai lagi.",
          "Tarif setiap fitur berbayar ditampilkan sebelum Anda memakainya. Kami dapat mengubah tarif untuk pemakaian berikutnya; perubahan tidak berlaku surut untuk Kredit atau Item Premium yang sudah dibeli.",
        ],
      ],
    },
    {
      heading: "5. Pembayaran",
      body: [
        "Pembayaran diproses oleh Midtrans (PT Midtrans) sebagai penyedia jasa pembayaran. Data kartu atau rekening Anda dimasukkan di halaman Midtrans dan tidak disimpan oleh Kami.",
        "Setiap pembayaran yang berhasil mendapatkan nomor invoice dan bukti pembayaran melalui email. Invoice juga dapat dibuka dari halaman Kredit.",
        "Pembayaran yang tidak diselesaikan dalam batas waktu yang ditampilkan akan kedaluwarsa otomatis tanpa biaya.",
      ],
    },
    {
      heading: "6. Item Premium, template, dan lisensi",
      body: [
        "Membuka Item Premium memberi Anda lisensi non-eksklusif, berlaku tanpa batas waktu, untuk memakainya di desain Anda dan di Kode Hasil Ekspor untuk proyek pribadi maupun komersial Anda atau klien Anda.",
        [
          "Anda TIDAK boleh menjual, membagikan, atau menerbitkan ulang template atau Item Premium sebagai template, kit UI, atau produk sejenis yang bersaing dengan Layanan.",
          "Item bawaan sebuah template Premium hanya terbuka di desain yang dibuat dari template tersebut.",
          "Item Premium yang telah dibuka tetap menjadi milik Akun Anda walaupun item itu kemudian diarsipkan dari katalog.",
        ],
      ],
    },
    {
      heading: "7. Kode Hasil Ekspor dan Konten Pengguna",
      body: [
        "Konten Pengguna dan Kode Hasil Ekspor dari desain Anda adalah milik Anda. Kami tidak mengklaim hak cipta atasnya.",
        "Anda memberi Kami izin terbatas untuk menyimpan, memproses, dan menampilkan Konten Pengguna semata-mata untuk menjalankan Layanan bagi Anda (misalnya sinkronisasi desain dan pembuatan kode).",
        "Kode Hasil Ekspor dibuat di server setelah kepemilikan Item Premium dan kuota ekspor diperiksa. Kuota ekspor gratis dan tarif ekspor berikutnya ditampilkan di Layanan.",
      ],
    },
    {
      heading: "8. Penggunaan yang dilarang",
      body: [
        "Anda dilarang memakai Layanan untuk:",
        [
          "konten yang melanggar hukum Indonesia, termasuk konten pornografi, perjudian, ujaran kebencian, atau berita bohong yang merugikan;",
          "melanggar hak kekayaan intelektual pihak lain (misalnya memakai gambar atau merek tanpa izin);",
          "membuat halaman penipuan (phishing), meniru pihak lain, atau menyebarkan perangkat lunak berbahaya;",
          "mengganggu, membebani secara tidak wajar, menguji celah keamanan tanpa izin tertulis, atau mengakses sistem di luar hak Anda;",
          "menyalahgunakan referral, promosi, kuota gratis, atau proses pembayaran.",
        ],
        "Kami dapat menghapus konten yang melanggar, menangguhkan, atau menutup Akun yang melanggar, serta melaporkannya kepada pihak berwenang bila diwajibkan hukum.",
      ],
    },
    {
      heading: "9. Fitur media dan kecerdasan buatan",
      body: [
        "Sebagian fitur media (misalnya hapus latar gambar) berjalan di browser Anda dengan model kecerdasan buatan sumber terbuka yang diunduh ke perangkat Anda. Gambar Anda tidak dikirim ke server Kami untuk fitur yang berjalan di browser.",
        "Fitur yang berjalan di server memproses berkas yang Anda unggah dan menghapus berkas serta hasilnya otomatis setelah masa simpan yang ditampilkan (bawaan 24 jam).",
        "Hasil pemrosesan otomatis dapat tidak sempurna. Periksa hasilnya sebelum dipakai; Kami tidak menjamin hasil cocok untuk tujuan tertentu.",
      ],
    },
    {
      heading: "10. Program referral",
      body: [
        [
          "Kode referral memberi voucher diskon kepada pengguna baru yang belum pernah membeli Kredit. Persentase, batas maksimal potongan, dan masa berlaku voucher ditampilkan di Layanan.",
          "Pemilik kode mendapat imbalan Kredit satu kali per teman setelah teman tersebut menyelesaikan pembayaran pertamanya. Imbalan ditarik bila pembayaran itu direfund.",
          "Alamat email yang sama (termasuk variasi titik atau alias +) dianggap orang yang sama. Akun yang sudah dihapus tidak dapat dipakai untuk memperoleh voucher baru.",
          "Kami dapat membatalkan voucher, imbalan, atau menonaktifkan kode yang terbukti disalahgunakan.",
        ],
      ],
    },
    {
      heading: "11. Ketersediaan dan perubahan Layanan",
      body: [
        "Kami berupaya menjaga Layanan tetap tersedia, tetapi Layanan dapat terhenti sementara untuk pemeliharaan atau karena gangguan di luar kendali Kami. Kami dapat menambah, mengubah, atau menghentikan fitur dengan pemberitahuan yang wajar.",
        "Bila fitur berbayar yang sudah Anda bayar dihentikan permanen, Kami akan mengembalikan Kredit yang belum terpakai untuk fitur tersebut atau memberikan pengganti yang setara.",
        "Simpan cadangan desain penting Anda. Desain yang belum tersinkron ke server hanya tersimpan di browser perangkat Anda.",
      ],
    },
    {
      heading: "12. Batasan tanggung jawab",
      body: [
        "Sejauh diizinkan hukum, Layanan disediakan sebagaimana adanya. Kami tidak bertanggung jawab atas kerugian tidak langsung seperti kehilangan keuntungan atau data yang timbul dari pemakaian Layanan.",
        "Total tanggung jawab Kami atas klaim apa pun terkait Layanan dibatasi sebesar jumlah yang Anda bayarkan kepada Kami dalam 3 (tiga) bulan sebelum kejadian. Batasan ini tidak mengurangi hak Anda sebagai konsumen menurut UU Perlindungan Konsumen dan tidak berlaku untuk kerugian akibat kesengajaan atau kelalaian berat Kami.",
      ],
    },
    {
      heading: "13. Penangguhan dan pengakhiran",
      body: [
        "Kami dapat menangguhkan atau menutup Akun yang melanggar syarat ini, terlibat penipuan pembayaran, atau diwajibkan oleh hukum. Bila penangguhan bukan karena pelanggaran Anda, Kredit yang belum terpakai dikembalikan sesuai Kebijakan Refund.",
        "Bila Anda menghapus Akun sendiri, sisa Kredit dan Item Premium hangus dan tidak dapat dipulihkan. Catatan transaksi tetap disimpan dalam bentuk anonim sesuai kewajiban pencatatan keuangan.",
      ],
    },
    {
      heading: "14. Perubahan Syarat & Ketentuan",
      body: [
        "Kami dapat memperbarui syarat ini. Versi baru diberi nomor versi baru; Anda akan diminta menyetujuinya sebelum melakukan pembelian berikutnya. Perubahan tidak berlaku surut untuk transaksi yang sudah selesai.",
      ],
    },
    {
      heading: "15. Hukum yang berlaku dan penyelesaian sengketa",
      body: [
        "Syarat ini tunduk pada hukum Republik Indonesia. Sengketa diselesaikan lebih dahulu secara musyawarah dalam 30 (tiga puluh) hari sejak pemberitahuan tertulis.",
        `Bila musyawarah tidak berhasil, Anda sebagai konsumen dapat menempuh penyelesaian melalui Badan Penyelesaian Sengketa Konsumen (BPSK) atau Pengadilan Negeri ${B.city}, sesuai ketentuan UU Perlindungan Konsumen.`,
      ],
    },
    {
      heading: "16. Kontak",
      body: [`Pertanyaan tentang syarat ini: ${B.email} · ${B.phone} · ${B.address}.`],
    },
  ],
};

const privacy: LegalDocument = {
  id: "privacy",
  title: "Kebijakan Privasi",
  summary: `${META}. Menjelaskan data pribadi apa yang Kami proses, untuk apa, dan hak Anda menurut UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).`,
  sections: [
    {
      heading: "1. Pengendali data",
      body: [
        `Pengendali Data Pribadi untuk Layanan ${B.brand} adalah ${B.legalName}, ${B.address}. Pejabat pelindungan data pribadi: ${B.dataProtectionOfficer}, dapat dihubungi di ${B.privacyEmail}.`,
      ],
    },
    {
      heading: "2. Data yang Kami kumpulkan",
      body: [
        [
          "Data akun: alamat email, nama, foto profil (bila masuk dengan Google), hash kata sandi (kata sandi asli tidak pernah disimpan), status verifikasi email, versi dan waktu persetujuan dokumen legal, status verifikasi dua langkah.",
          "Data sesi dan keamanan: token sesi (dalam cookie httpOnly), jenis browser (user agent), alamat IP di log server dan jejak audit admin, catatan percobaan masuk yang gagal.",
          "Data transaksi: paket Kredit, nominal, diskon, status, nomor invoice, metode pembayaran, dan nomor transaksi dari Midtrans. Data kartu atau rekening TIDAK Kami terima.",
          "Data pemakaian: riwayat mutasi Kredit, Item Premium yang dimiliki, riwayat ekspor, dan riwayat pemrosesan fitur server.",
          "Konten Pengguna: desain dan website yang Anda sinkronkan, serta berkas yang Anda unggah ke fitur server.",
          "Data di perangkat Anda: desain, ikon, font, dan preferensi disimpan di penyimpanan lokal browser (localStorage). Data ini tetap di perangkat Anda sampai disinkronkan atau dihapus.",
        ],
        "Kami tidak sengaja mengumpulkan data pribadi yang bersifat spesifik (seperti data kesehatan, biometrik, atau keuangan pribadi selain data transaksi di atas).",
      ],
    },
    {
      heading: "3. Tujuan dan dasar pemrosesan",
      body: [
        [
          "Menjalankan perjanjian dengan Anda: membuat dan mengelola Akun, menyimpan desain, memproses pembelian dan pemakaian Kredit, membuat Kode Hasil Ekspor, mengirim email layanan (verifikasi, atur ulang sandi, bukti bayar).",
          "Memenuhi kewajiban hukum: menyimpan catatan transaksi dan invoice untuk keperluan akuntansi dan perpajakan, menanggapi permintaan sah aparat penegak hukum.",
          "Kepentingan yang sah: menjaga keamanan (pembatasan percobaan masuk, verifikasi dua langkah admin, jejak audit), mencegah penipuan dan penyalahgunaan referral.",
          "Persetujuan Anda: untuk hal lain yang akan Kami mintakan secara terpisah. Kami tidak mengirim email pemasaran tanpa persetujuan Anda.",
        ],
      ],
    },
    {
      heading: "4. Pihak ketiga yang memproses data",
      body: [
        "Kami hanya membagikan data seperlunya kepada pemroses berikut, yang terikat kewajiban kerahasiaan:",
        [
          "Google LLC: bila Anda memilih masuk dengan Google (menerima email, nama, dan foto profil Anda dari Google).",
          "Midtrans (PT Midtrans): memproses pembayaran; menerima email Anda, nominal, dan rincian pesanan.",
          "Penyedia layanan email: mengirim email layanan kepada Anda. [Nama penyedia SMTP]",
          "Penyedia hosting, basis data, dan penyimpanan berkas: [Nama penyedia hosting/cloud dan lokasi pusat data].",
          "Hugging Face: browser Anda mengunduh berkas model kecerdasan buatan untuk fitur hapus latar. Gambar Anda tidak dikirim ke Hugging Face maupun ke Kami.",
        ],
        "Sebagian pemroses di atas dapat menyimpan data di luar wilayah Indonesia. Transfer tersebut dilakukan dengan memastikan tingkat pelindungan yang setara atau lebih tinggi sesuai Pasal 56 UU PDP.",
        "Kami tidak menjual data pribadi Anda.",
      ],
    },
    {
      heading: "5. Masa simpan",
      body: [
        [
          "Data akun dan desain: selama Akun aktif.",
          "Setelah Akun dihapus: profil, desain, sesi, dan akun Google yang tertaut dihapus atau dianonimkan segera. Sidik jari satu arah (hash) dari email disimpan untuk mencegah penyalahgunaan referral dan tidak dapat dikembalikan menjadi email.",
          "Catatan transaksi, invoice, dan mutasi Kredit: disimpan dalam bentuk anonim selama 10 (sepuluh) tahun sesuai kewajiban dokumen perusahaan dan perpajakan.",
          "Berkas unggahan dan hasil fitur server: dihapus otomatis setelah masa simpan (bawaan 24 jam).",
          "Token verifikasi email dan atur ulang sandi: berlaku singkat dan dibersihkan otomatis setelah kedaluwarsa.",
          "Jejak audit admin: [jangka waktu, mis. 2 tahun].",
        ],
      ],
    },
    {
      heading: "6. Hak Anda sebagai subjek data",
      body: [
        "Sesuai UU PDP, Anda berhak:",
        [
          "mendapatkan informasi tentang pemrosesan data Anda (dokumen ini);",
          "mengakses dan memperoleh salinan data pribadi Anda: menu Akun & Privasi → Unduh data saya (format JSON);",
          "memperbarui atau memperbaiki data yang tidak akurat;",
          "menghapus data pribadi Anda: menu Akun & Privasi → Hapus akun;",
          "menarik persetujuan yang pernah diberikan;",
          "mengajukan keberatan atas pemrosesan tertentu.",
        ],
        `Permintaan yang tidak dapat dilakukan sendiri lewat menu dapat dikirim ke ${B.privacyEmail}. Kami akan memverifikasi identitas Anda dan menanggapi dalam jangka waktu yang ditetapkan UU PDP.`,
      ],
    },
    {
      heading: "7. Keamanan",
      body: [
        "Kami menerapkan langkah teknis dan organisasi yang wajar, antara lain: koneksi terenkripsi (HTTPS), kata sandi disimpan sebagai hash scrypt, token sesi dalam cookie httpOnly, rahasia verifikasi dua langkah dienkripsi, pembatasan percobaan masuk, verifikasi dua langkah wajib untuk admin, dan jejak audit setiap tindakan admin.",
        "Bila terjadi kegagalan pelindungan data pribadi, Kami akan memberitahu Anda dan lembaga yang berwenang paling lambat 3 x 24 jam sesuai Pasal 46 UU PDP.",
      ],
    },
    {
      heading: "8. Cookie dan penyimpanan lokal",
      body: [
        "Kami hanya memakai cookie yang diperlukan agar Layanan berfungsi: cookie sesi masuk (httpOnly) dan cookie sementara untuk login Google. Kami tidak memakai cookie iklan atau pelacak pihak ketiga.",
        "Penyimpanan lokal browser dipakai untuk desain, ikon, font, bahasa, dan tema. Anda dapat menghapusnya kapan saja lewat pengaturan browser; data yang belum tersinkron akan hilang.",
      ],
    },
    {
      heading: "9. Anak",
      body: [
        "Layanan tidak ditujukan untuk anak di bawah 18 tahun tanpa persetujuan orang tua/wali. Bila Anda mengetahui anak memberikan data tanpa persetujuan tersebut, hubungi Kami agar datanya dihapus.",
      ],
    },
    {
      heading: "10. Perubahan kebijakan",
      body: ["Perubahan kebijakan ini diberi nomor versi baru dan diberitahukan di Layanan. Untuk perubahan penting, Anda akan diminta menyetujui ulang."],
    },
    {
      heading: "11. Kontak",
      body: [`${B.dataProtectionOfficer} · ${B.privacyEmail} · ${B.address}.`],
    },
  ],
};

const refund: LegalDocument = {
  id: "refund",
  title: "Kebijakan Refund",
  summary: `${META}. Kapan pembelian Kredit dapat dikembalikan, dan bagaimana caranya.`,
  sections: [
    {
      heading: "1. Prinsip umum",
      body: [
        "Kredit adalah produk digital yang langsung dikirim ke Akun setelah pembayaran dikonfirmasi. Karena itu, pada umumnya pembelian yang Kreditnya sudah dipakai tidak dapat dikembalikan, kecuali dalam keadaan di bawah ini.",
      ],
    },
    {
      heading: "2. Refund yang PASTI kami berikan",
      body: [
        [
          "Tagihan ganda: Anda terbayar dua kali untuk pesanan yang sama.",
          "Kredit tidak masuk: pembayaran sukses tetapi Kredit tidak masuk dalam 1 x 24 jam dan Kami tidak dapat memperbaikinya.",
          "Kesalahan sistem Kami: misalnya Kredit terpotong untuk fitur yang gagal karena kesalahan di pihak Kami (biasanya Kredit dikembalikan ke saldo; refund uang bila Anda memintanya dan Kredit tersebut berasal dari pembelian).",
          "Fitur berbayar dihentikan permanen sebelum Anda sempat memakainya.",
        ],
      ],
    },
    {
      heading: "3. Refund atas permintaan (tanpa alasan)",
      body: [
        "Anda dapat meminta refund penuh untuk satu pembelian bila Kredit dari pembelian itu BELUM dipakai sama sekali dan permintaan diajukan paling lambat 7 (tujuh) hari sejak tanggal invoice.",
      ],
    },
    {
      heading: "4. Yang tidak dapat direfund",
      body: [
        [
          "Kredit yang sudah dipakai untuk membuka Item Premium, template, paket desain/website, ekspor, atau fitur server yang berhasil.",
          "Kredit gratis, promosi, atau imbalan referral.",
          "Sisa Kredit pada Akun yang dihapus atas permintaan pemilik.",
          "Akun yang ditangguhkan karena pelanggaran Syarat & Ketentuan.",
        ],
      ],
    },
    {
      heading: "5. Cara mengajukan",
      body: [
        `Kirim email ke ${B.email} dengan subjek "Refund", sertakan nomor invoice (format INV/TAHUN/BULAN/NOMOR) dan alasan singkat. Gunakan email yang terdaftar di Akun.`,
        [
          "Kami menanggapi paling lambat 3 (tiga) hari kerja.",
          "Refund yang disetujui diproses paling lambat 14 (empat belas) hari kerja.",
          "Dana dikembalikan melalui metode pembayaran asal bila didukung Midtrans (kartu, GoPay, QRIS, ShopeePay); untuk virtual account bank, dana dikirim lewat transfer bank ke rekening atas nama Anda.",
          "Waktu dana diterima mengikuti proses bank atau penyedia e-wallet.",
        ],
      ],
    },
    {
      heading: "6. Akibat refund",
      body: [
        [
          "Kredit dari pembelian yang direfund ditarik dari saldo. Untuk refund sebagian, Kredit ditarik sebanding dengan nominal yang dikembalikan.",
          "Bila Kredit sudah terpakai sebagian, saldo dapat menjadi negatif dan harus dilunasi sebelum fitur berbayar dapat dipakai lagi.",
          "Imbalan referral yang diterima pengajak dari pembelian tersebut ikut ditarik.",
          "Anda menerima email pemberitahuan refund.",
        ],
      ],
    },
    {
      heading: "7. Pembatalan oleh bank (chargeback)",
      body: [
        "Bila Anda membatalkan transaksi melalui bank penerbit kartu, Kredit dari transaksi itu ditarik otomatis. Kami menyarankan menghubungi Kami lebih dahulu karena sebagian besar masalah dapat diselesaikan lebih cepat. Chargeback yang terbukti tidak sah dapat menyebabkan Akun ditangguhkan.",
      ],
    },
  ],
};

const contact: LegalDocument = {
  id: "contact",
  title: "Kontak & Informasi Pelaku Usaha",
  summary: "Informasi pelaku usaha sesuai PP No. 80 Tahun 2019 tentang Perdagangan Melalui Sistem Elektronik.",
  sections: [
    {
      heading: "Identitas usaha",
      body: [
        [
          `Nama usaha: ${B.legalName}`,
          `Merek layanan: ${B.brand}`,
          `Bentuk usaha: ${B.entityType}`,
          `Alamat: ${B.address}`,
          `NIB: ${B.nib}`,
          `NPWP: ${B.taxId}`,
          `Tanda Daftar PSE Lingkup Privat: ${B.pseNumber}`,
          `Situs: ${B.website}`,
        ],
      ],
    },
    {
      heading: "Layanan pelanggan",
      body: [
        [
          `Email: ${B.email}`,
          `Telepon/WhatsApp: ${B.phone}`,
          `Jam layanan: ${B.supportHours}`,
          `Permintaan data pribadi: ${B.privacyEmail}`,
        ],
        "Pengaduan dijawab paling lambat 3 (tiga) hari kerja. Sertakan email Akun dan nomor invoice bila terkait pembayaran.",
      ],
    },
    {
      heading: "Pengaduan konsumen",
      body: [
        "Bila pengaduan Anda tidak terselesaikan, Anda dapat menyampaikannya kepada Direktorat Jenderal Perlindungan Konsumen dan Tertib Niaga, Kementerian Perdagangan Republik Indonesia, atau Badan Penyelesaian Sengketa Konsumen (BPSK) di kota Anda.",
      ],
    },
  ],
};

export const LEGAL_DOCUMENTS: Record<LegalDocId, LegalDocument> = { terms, privacy, refund, contact };
