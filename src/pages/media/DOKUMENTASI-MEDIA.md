# Media — Audit, Redesign, Browser vs Server

Dokumen ini mencatat hasil audit, perbaikan bug, arsitektur baru, analisis pemrosesan browser vs server, aturan kredit, evaluasi fitur baru, dan keterbatasan menu **Media** OneWebDev. Fitur WebMaker tidak diubah, kecuali satu tambahan opsional `costLabel` di `src/credits`.

## 1. Kondisi awal

Ada 4 halaman: Image Converter, Find Colors at Image, Remove Background, dan Video to Frames.

- Komponen bersama: `MediaDropzone`, `MediaFileItem`, `BulkActionBar`, `MediaPageHeader`, `MediaPageWrapper`.
- Logika file, unduhan, dan status ditulis ulang di tiap halaman.
- Semua halaman berbagi template yang sama: judul di tengah, dropzone, lalu daftar.
- Teks campur Inggris dan Indonesia.

## 2. Bug yang ditemukan dan perbaikannya

| # | Lokasi lama | Bug | Perbaikan |
|---|---|---|---|
| 1 | Image Converter | Object URL pratinjau dan hasil tidak pernah dicabut saat item dihapus, "Hapus Semua", atau halaman ditinggalkan, sehingga memori bocor | `useFileQueue` mencabut URL saat hapus, ganti hasil, clear, dan unmount |
| 2 | Image Converter | Format tujuan diganti setelah konversi, file tetap WebP tapi diunduh dengan ekstensi `.jpg`. Label juga ikut salah | Hasil menyimpan nama dan format sendiri. Hasil lama ditandai "Pengaturan berubah" dan diproses ulang |
| 3 | Image Converter, Remove BG | Item bisa diproses ganda: klik "Convert" per item saat "Convert Semua" berjalan. `convertAll` memakai snapshot `items` yang basi | Satu antrean aktif, guard per item, dan `itemsRef` |
| 4 | Image Converter | Validasi hanya dari MIME/nama. `palsu.png` (HTML) diterima. GIF/BMP/AVIF yang sebenarnya bisa dibaca malah gagal "format tidak dikenali" | Sniffing isi file (`lib/fileSniff.ts`). Sumber diperluas ke GIF, BMP, ICO, dan AVIF |
| 5 | Image Converter | Hanya pesan file terlalu besar terakhir yang tampil (`setGlobalError` di dalam `filter`) | `validateFiles` dan `summarizeRejections`: semua penolakan dirangkum |
| 6 | Image Converter | Teks warna latar JPEG tidak divalidasi; nilai salah membuat latar hitam | `ColorField` hanya menerapkan HEX yang valid |
| 7 | Semua konversi | Browser yang tidak bisa encode WebP diam-diam menghasilkan PNG, tetapi diberi nama `.webp` | `encodeCanvas` memverifikasi `blob.type`. `canEncode` menonaktifkan pilihan yang tidak didukung |
| 8 | Semua konversi | Canvas raksasa (resize 100000 px) gagal tanpa pesan jelas | Batas sisi 16.384 px, input maksimal 50 MP, dan pesan "terlalu besar" |
| 9 | Raster → SVG | Tracing berjalan di thread UI. Gambar besar membekukan tab dan tidak bisa dibatalkan | Web Worker (`workers/imageWorker.ts`), gambar di atas 1,5 MP diperkecil, bisa dibatalkan (terminate) |
| 10 | SVG | Parse error tidak terdeteksi di Chrome/Safari (`<parsererror>` disisipkan di dalam `<svg>`). `width="100%"` dibaca 100 px. `new Promise(async…)`. Script/`on*` ikut ke hasil SVG | `lib/svg.ts`: deteksi `parsererror`, satuan cm/mm/in/pt/%, sanitasi script/`on*`/`javascript:` |
| 11 | Background SVG | `<rect width="100%">` meleset bila viewBox tidak mulai di 0 | Rect mengikuti koordinat viewBox |
| 12 | Unduhan | `<a>` tidak dimasukkan ke DOM. URL ZIP dicabut segera setelah klik, sehingga unduhan bisa 0 byte di sebagian browser | `lib/download.ts`: `<a>` dipasang ke DOM, URL dicabut setelah 60 detik, nama file disanitasi |
| 13 | ZIP | DEFLATE ulang file yang sudah terkompresi hanya membuang CPU | ZIP memakai STORE, dengan progres |
| 14 | Dropzone | Status drag berkedip saat melewati elemen anak. Tidak bisa dipakai dengan keyboard | Penghitung dragenter/leave, `role=button`, Enter/Spasi, tempel Ctrl+V |
| 15 | Find Colors | Tidak berfungsi di layar sentuh (hanya `mousemove`) | Pointer Events; sentuh: geser untuk pratinjau, angkat jari untuk mengunci |
| 16 | Find Colors | Gerakan pertama tidak menghasilkan warna, karena canvas loupe belum ter-mount | Loupe selalu ada di DOM |
| 17 | Find Colors | `useRef(document.createElement("canvas"))` membuat canvas baru di setiap render. Gambar dimuat sebagai data URL (base64, boros memori). Tidak ada penanganan file rusak. Alpha diabaikan (transparan tampil sebagai hitam) | Canvas dibuat sekali, decode via `createImageBitmap`, pesan galat, dan RGBA/HSLA |
| 18 | Find Colors | Loupe 2×2 piksel terlalu kecil untuk presisi. Loupe bisa keluar layar. Clipboard gagal diam-diam di non-HTTPS | Loupe 9×9 dengan posisi menyesuaikan tepi, fallback `execCommand`, dan pesan bila gagal |
| 19 | Video to Frames | Codec tidak didukung (HEVC/ProRes) membuat status "Membaca info video…" macet selamanya | `loadVideoMeta`: tangani `error` dan timeout 20 detik, dengan pesan codec yang jelas |
| 20 | Video to Frames | Durasi `Infinity` (WebM hasil MediaRecorder) membuat loop tak berujung | Durasi dihitung ulang (seek ke ujung). Bila tetap gagal, ditolak dengan pesan |
| 21 | Video to Frames | Tanpa batas frame: 10 menit × 60 fps = 36.000 blob di memori, tab crash | Maksimal 600 frame sekali ekstrak, dengan pemberitahuan dan rentang waktu |
| 22 | Video to Frames | Seek bisa menggantung. Ekstraksi tetap jalan setelah halaman ditinggalkan. Frame baru tampil setelah semua selesai | Seek dengan timeout, abort saat unmount, frame tampil bertahap |
| 23 | Video to Frames | Tombol unduh per frame hanya muncul saat hover, sehingga tidak bisa dipakai di HP | Tombol selalu tampil |
| 24 | Video to Frames | File audio saja menyebabkan canvas 0×0 dan galat membingungkan | Dicek `videoWidth`, dengan pesan "tidak punya trek video" |
| 25 | `MediaFileItem` | `resultSize && …` merender angka "0" bila hasil 0 byte | Hasil kosong dianggap gagal ("Hasil pemrosesan kosong") |
| 26 | Remove Background | Library dan runtime ONNX (±24 MB WASM) dimuat bersama halaman | `import()` dinamis saat tombol ditekan |
| 27 | Remove Background | Galat unduh model tampil mentah. Tidak bisa dibatalkan | Pesan jelas (koneksi/CSP), dan unduhan model dibatalkan lewat `fetchArgs.signal` |

**Lisensi (diperbarui v4):** `@imgly/background-removal` (AGPL-3.0) sudah **dihapus**. Mode browser kini memakai `@huggingface/transformers` (Apache-2.0) dengan model `onnx-community/BiRefNet_lite-ONNX` (MIT), dijalankan di Web Worker `workers/bgRemovalWorker.ts` (WebGPU bila ada, selain itu WASM). Model diunduh sekali dari `huggingface.co` (fp16 ±115 MB / fp32 ±224 MB) lalu disimpan di Cache Storage browser. Untuk CSP ketat, izinkan `huggingface.co`, `cdn-lfs.huggingface.co`, `cas-bridge.xethub.hf.co` dan `cdn.jsdelivr.net` (runtime WASM ONNX), atau host salinan model sendiri lalu set `env.remoteHost`. Mode server (Python, "HD") tidak berubah.

## 3. Arsitektur baru

```
media/
  components/  MediaShell (kerangka, breadcrumb, chip mode), Dropzone (+useFileIntake),
               FileRow, QueuePanel (aksi massal + ZIP), ModePicker (+ServerUsageMeter),
               ServerGate (perkiraan biaya / server belum tersedia), CompareSlider, ui (kontrol)
  hooks/       useFileQueue (antrean: batal, anti-ganda, cabut URL, hasil usang), useProcessingMode
  lib/         fileSniff, validate, format, download, svg, color (+palet), metadata, sharpen,
               video, videoPlan                          ← fungsi murni, diuji di Node
  converters/  formats, options, sizings, image (decode/encode terverifikasi), index (dispatcher)
  processing/  policy (browser/server per fitur), serverQuota, serverClient (kontrak backend)
  workers/     imageWorker (tracing, unsharp mask), runWorker
  Page/        MediaHub, ImageConverter, findColorIAtImage, RemoveBackground, VideoToFrames,
               ImageUpscaler, MetadataRemover, VideoToGif*, AudioExtract*, VideoCompress*,
               CreditStore*                                           (* tahap 2)
  processing/  + apiConfig, pricing (harga terpusat), billing (akun & pembayaran)
  components/  + FeatureAccess (kartu akses), ServerVideoTool (kerangka alat video server)
  hooks/       + useFeatureAccess, useVideoSource
  lib/         + wav, audio, serverPlans
```

**Desain per halaman** tetap konsisten (MediaShell, warna utama biru-800, dark mode), tetapi tata letaknya mengikuti fungsi:

| Halaman | Tata letak |
|---|---|
| Converter | Panel pengaturan + antrean batch |
| Find Colors | Panggung gambar dengan loupe + inspektur, koleksi, dan palet |
| Remove Background | Perbandingan sebelum/sesudah + pilihan model dan latar |
| Video to Frames | Pemutar + filmstrip + panel rencana frame |
| Upscaler | Perbandingan piksel + skala |
| Metadata | Laporan temuan (GPS, kamera, prompt AI) |
| Hub | Kartu alat + tabel perbandingan |

Di layar kecil, unggahan dan antrean tampil sebelum pengaturan.

## 4. Pemisahan browser dan server

`processing/policy.ts` adalah sumber tunggal klasifikasi:

| Fitur | Browser | Server | Rekomendasi | Alasan |
|---|---|---|---|---|
| Image Converter | ✔ gratis | — | Browser | Encode Canvas setara kualitas server untuk PNG/JPEG/WebP; upload hanya menambah waktu dan risiko |
| Find Colors | ✔ gratis | — | Browser | Interaksi per piksel harus instan |
| Remove Background | ✔ gratis (ISNet ONNX) | berbayar | Browser | Cukup untuk umum dan privat; server untuk batch besar/HD (butuh GPU) |
| Video to Frames | ✔ gratis | berbayar | Browser | Browser untuk MP4/WebM umum; server untuk codec tak didukung, frame-exact, dan video besar |
| Image Upscaler | ✔ gratis (interpolasi + penajaman) | berbayar (AI) | Browser | Super-resolution AI butuh model besar dan GPU |
| Hapus Metadata | ✔ gratis | — (sengaja) | Browser | Tujuannya privasi; mengirim foto ber-GPS ke server bertentangan dengan tujuannya |
| Video to GIF | — | berbayar | Server | Encoder GIF berkualitas berat untuk browser |
| Ekstrak Audio | ✔ gratis (WAV) | berbayar (MP3/AAC/Opus) | Browser | WAV cukup di browser; format terkompresi & file panjang di server |
| Kompres Video | — | berbayar | Server | Encode video terlalu berat untuk browser |

Server tidak otomatis berbayar. Harga, akses, dan status aktif tiap fitur server diatur di `pricing.ts`.

### Perbandingan teknis

| Aspek | Browser | Server |
|---|---|---|
| Performa | Tanpa transfer. Bergantung CPU/GPU pengguna. Model AI diunduh sekali | Ada transfer (20 MB di 10 Mbps ≈ 16 detik upload: 20 × 8 ÷ 10) + antrean. GPU konsisten |
| CPU/RAM/GPU | Perangkat pengguna. Satu Canvas = L × T × 4 byte (24 MP ≈ 96 MB per salinan) | Mesin kita; biaya per job |
| Batas ukuran | Memori tab + batas Canvas (Safari/iOS ±16,7 MP) | Bisa GB, dibatasi kebijakan |
| Privasi | File tidak keluar perangkat | Transfer HTTPS, penyimpanan sementara, wajib dihapus dan punya retensi |
| Internet | Hanya untuk memuat halaman/model | Wajib |
| Biaya | ±0 per proses (hosting statis/CDN) | CPU/GPU, storage, egress, naik sebanding jumlah proses |
| Skalabilitas | Otomatis (tiap pengguna membawa komputasi) | Perlu antrean, autoscaling, rate limit |
| Kualitas | Setara untuk konversi. Model AI harus kecil/terkuantisasi | Model penuh, encoder bisa disetel (mozjpeg, libavif), FFmpeg frame-exact |
| Format | HEIC/TIFF tidak terbaca, AVIF tidak bisa di-encode Canvas, codec video terbatas | Hampir semua (FFmpeg/libvips) |

**Kapan browser lebih cocok:** file pribadi/sensitif, konversi format standar, interaksi real-time, biaya nol, pemakaian offline.

**Kapan server lebih cocok:** model AI besar, codec yang tidak didukung browser, file atau video sangat besar, batch ratusan file, perangkat pengguna lemah, kebutuhan hasil yang identik di semua perangkat.

## 5. Sistem kredit dinamis per fitur (bayar dulu)

> Menggantikan aturan lama "1 kredit / 10 proses".

### Konfigurasi terpusat
Semua harga ada di `processing/pricing.ts` (`DEFAULT_PRICING`). Backend bisa mengirim harga sendiri lewat `GET /billing/pricing`; nilainya divalidasi lalu digabung (`mergePricing`). Komponen UI tidak pernah menulis angka biaya sendiri.

| Fitur | Biaya per penggunaan | Paket fitur (1 kredit) | Pengali biaya |
|---|---:|---:|---|
| Remove Background | 0,1 kredit | 12× | file > 10 MB ×1,5 |
| Video to GIF | 0,2 kredit | 7× | > 10 detik ×1,5 · > 20 detik ×2 |
| Image Upscaler | 0,25 kredit | 8× | skala > 2× ×1,5 |
| Video to Frames | 0,1 kredit | 10× | > 5 menit ×2 · > 15 menit ×3 |
| Ekstrak Audio | 0,05 kredit | 25× | > 30 menit ×2 |
| Kompres Video | 0,3 kredit | 5× | > 200 MB ×2 · > 1 GB ×4 |

- 1 kredit = US$1 (`CREDIT_USD`). Paket kredit: 5, 10, 25, dan 50 kredit.
- Semua angka di atas adalah **contoh awal, bukan harga final**.
- Tiap fitur punya batas input sendiri (`limits`) dan bisa dinonaktifkan backend (`enabled`).

### Aturan produk
Saldo dan akses dipisah:

1. **Saldo kredit** adalah dompet umum, dipakai membayar `costPerUse` setiap penggunaan yang berhasil.
2. **Akses fitur** (terkunci atau terbuka) dibuka dengan membeli **paket fitur** seharga `packPrice` kredit. Paket berisi `usesPerCredit` penggunaan yang lebih hemat. Paket pertama membuka fitur secara permanen.
   - Fitur dengan `unlockRequired: false` bisa langsung dibayar dari saldo.

Saat pemrosesan:

- Kuota paket dipakai lebih dulu; bila habis, biaya diambil dari saldo.
- Pengali (ukuran/durasi/skala) berlaku untuk keduanya: kuota terpakai = pengali dibulatkan ke atas.
- Kredit dan kuota hanya berkurang setelah job **berhasil** dan dikonfirmasi backend. Gagal atau dibatalkan = gratis.

### Status akses
Diperiksa berurutan (`accessState`):

1. **Belum tersedia**: server off atau fitur dinonaktifkan.
2. **Belum dimuat**: data akun belum ada.
3. **Terkunci**: paket fitur belum dibeli.
4. **Saldo tidak cukup**.
5. **Terbuka**.

### UX
- **Kartu akses** (panel samping pada mode server) dan **gerbang server** (dialog setiap kali tombol server diklik) menampilkan:
  - nama fitur dan status server;
  - status akses;
  - biaya per penggunaan dalam kredit dan US$;
  - isi paket;
  - perkiraan biaya untuk input saat ini, termasuk pengali;
  - saldo, kuota paket, dan perkiraan jumlah penggunaan;
  - tombol **Beli kredit** dan **Buka akses**.
- **Saat server belum tersedia**, gerbang menampilkan: **"Server belum tersedia. Fitur ini akan dapat digunakan setelah layanan server diaktifkan."** Tidak ada upload, saldo tidak berubah, dan tidak ada transaksi.
- **Halaman Kredit Media** (`/media-tools/kredit`) berisi:
  - saldo;
  - paket kredit;
  - tabel harga dan akses per fitur;
  - kalkulator penggunaan;
  - penjelasan cara kerja.

  Tombol beli dan buka akses memanggil backend. Tanpa backend, muncul pemberitahuan "Pembayaran belum tersedia… Tidak ada transaksi yang dibuat."

### Keamanan
- **Saldo, akses, dan hasil pembayaran hanya dari respons backend** (`setAccountFromServer`). State billing sengaja tidak disimpan di localStorage.
- **Kembali dari gateway** (`?session=…`): status diverifikasi ke `GET /billing/checkout/:id`, yang berasal dari webhook. Parameter URL tidak dipercaya.
- **URL checkout:** hanya `https` yang diterima (http hanya untuk localhost).
- **Anti ganda:**
  - Klik ganda pada checkout, unlock, atau job digabung menjadi satu request.
  - Job memakai `Idempotency-Key` stabil (sidik jari file + parameter).
  - Checkout dan unlock memakai kunci per percobaan.
- **Rahasia:** tidak ada secret gateway atau API key di frontend. Autentikasi memakai cookie sesi.

### Bagian yang membutuhkan backend
- `GET /billing/account`, `GET /billing/pricing`, `POST /billing/checkout`, `GET /billing/checkout/:id`, `POST /billing/unlock` (kontrak di `processing/billing.ts`).
- `POST/GET/DELETE /media/jobs` (kontrak di `processing/serverClient.ts`). Backend harus:
  - mengecek akses dan saldo sebelum antre;
  - memotong kuota atau kredit hanya untuk job `succeeded`, dalam satu transaksi DB yang idempoten;
  - mengembalikan `account` terbaru.
- Webhook payment gateway, database saldo/ledger/entitlement, worker FFmpeg/AI, penghapusan file sementara, dan rate limit.

## 6. Evaluasi fitur baru

| Kandidat | Manfaat / pengguna | Metode | Dependensi & biaya | Keputusan |
|---|---|---|---|---|
| **Hapus Metadata** | Privasi (GPS, nomor seri, prompt AI) untuk siapa pun yang membagikan foto | Browser, lossless | Tanpa dependensi | **Dibuat, gratis**: JPEG/PNG/WebP lossless (piksel identik, diverifikasi), orientasi dan ICC opsional, gambar tambahan MPF dibuang |
| **Image Upscaler** | Aset kecil untuk web/cetak | Browser: interpolasi + unsharp mask di Worker. Server: AI | Browser tanpa dependensi; AI butuh GPU (Real-ESRGAN) | **Dibuat**: browser gratis (jujur: tidak menambah detail); mode AI server ber-kredit (backend menyusul) |
| Kompresi & resize batch | Optimasi gambar web | Browser | — | **Diintegrasikan ke Converter**: target "Format asli", mode "Muat di kotak", "Jangan perbesar" |
| Thumbnail video | Cover video/blog | Browser | — | **Diintegrasikan ke Video to Frames**: "Ambil frame ini" + mode "jumlah total merata" |
| Video → GIF | Demo singkat | Server (FFmpeg palettegen/paletteuse) | Sedang | **UI lengkap** (rentang ≤ 30 detik, fps, lebar, palet, loop, validasi); proses menunggu backend |
| Ekstrak audio | Podcast, subtitle | Browser: WAV via Web Audio. Server: MP3/AAC/Opus/salin | Rendah/sedang | **WAV di browser berfungsi penuh (gratis)**; MP3/AAC menunggu backend |
| Kompresi video | Upload lebih kecil | Server | Tinggi | **UI lengkap** (kualitas/target ukuran → bitrate, resolusi, codec, audio, validasi); proses menunggu backend |

## 7. Keamanan

- **Validasi file:** jenis dari isi (magic bytes), ukuran, file kosong, dan batas jumlah per halaman. HEIC/TIFF mendapat pesan khusus.
- **Batas pemrosesan:** input maksimal 50 MP, sisi Canvas maksimal 16.384 px, upscale maksimal 16,7 MP, maksimal 600 frame video, dan timeout seek/metadata.
- **SVG:** script, `on*`, `javascript:`, iframe, embed, dan object dibuang dari hasil. Pratinjau memakai `<img>`, sehingga script tidak pernah dijalankan.
- **Nama file unduhan:** disanitasi (tanpa path atau karakter terlarang).
- **Memori:** Canvas dibebaskan (`width = 0`) setelah dipakai.
- **Rahasia:** tidak ada API key atau kredensial di frontend. Server memakai cookie sesi dan base URL dari env.

## 8. Pengujian

- **Unit (`media/tests/media.test.ts`, 19 tes):** sniffing, validasi, format, metadata JPEG/PNG/WebP (termasuk EXIF GPS sintetis, data setelah EOI, byte FF D9 di dalam tabel), rencana frame, upscale, unsharp mask, warna dan palet, satuan SVG, resize, format tujuan, kebijakan, perkiraan kredit, dan klien server dengan fetch tiruan. Skenario klien server: server tidak ada, idempotensi, request ganda, 402, job gagal, batal (DELETE), dan 413.
- **Browser (Playwright, `validate/mm1–mm5`):**
  - Converter: file palsu ditolak, WebP/JPEG/format asli/SVG, hasil usang dan ekstensi benar, ZIP diverifikasi magic bytes, sanitasi SVG, orientasi EXIF, resize.
  - Find Colors: gerakan pertama, transparan, kunci, keyboard, sentuh, palet.
  - Video: HEVC ditolak dengan pesan, WebM tanpa durasi, ekstraksi, batal di tengah, thumbnail manual, ZIP, gerbang server.
  - Upscaler: 3×, unduh, gerbang server.
  - Metadata: hasil diverifikasi dengan Pillow, piksel identik.
  - Remove BG: gerbang server; mode browser tanpa akses CDN memberi pesan jelas.
  - Hub, 390 px tanpa scroll horizontal, dan dark mode.

### Tahap 2 (sistem kredit & fitur server)
- **Unit (`tests/billing.test.ts`, 16 tes):** harga sesuai tabel; pengali dan batas; rencana biaya (paket lalu saldo); urutan status akses; perkiraan penggunaan; sanitasi harga dan akun dari backend; kebijakan browser vs server; billing tanpa backend (tanpa transaksi) dan dengan backend tiruan (checkout tunggal, verifikasi pending tidak menambah saldo, URL checkout aman, unlock); klien server (pesan baku, fitur nonaktif, idempotensi, 402/403, gagal/batal); rencana GIF dan kompres; WAV.
- **Browser (`validate/mm6`):**
  - Video to GIF: validasi dan lebar disamakan, alert gerbang, tombol buka akses → pemberitahuan pembayaran, tanpa hasil palsu, 390 px.
  - Kompres: validasi resolusi dan target ukuran.
  - Ekstrak Audio: WAV mono 16 kHz diverifikasi header/ukurannya, video tanpa suara, gerbang server.
  - Toko kredit: beli dan buka akses → pemberitahuan, kalkulator, kembali dari checkout tanpa backend → "tidak dapat diverifikasi", 390 px.
  - Regresi mm1–mm5 dan Page Maker lulus.

## 9. Keterbatasan

- Pemrosesan server, pembayaran, dan saldo belum aktif; yang tersedia baru kontrak dan UI-nya. Saldo tampil "belum dapat dimuat", dan tombol server, beli, serta buka akses hanya menampilkan pemberitahuan.
- Harga masih contoh awal. Target ukuran Kompres Video minimal 1 MB.
- Remove Background mode browser butuh akses ke CDN model (diuji: tanpa akses, pesan galat tampil). Lisensi AGPL perlu diputuskan.
- Batas Canvas berbeda per browser: 16,7 MP dipakai sebagai batas aman upscale; konversi di atasnya bisa gagal di Safari/iOS (dengan pesan).
- Seek video tidak frame-exact. Codec bergantung browser (Chromium tanpa codec proprietary tidak bisa memutar H.264).
- AVIF/HEIC tidak bisa di-encode. HEIC/TIFF tidak bisa dibaca.
- Hapus metadata lossless hanya untuk JPEG/PNG/WebP; format lain di-encode ulang ke PNG.
