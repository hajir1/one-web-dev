# Uji 3D di HP kelas bawah

Sejak v25, runtime 3D (`owd3d`) punya **penjaga FPS**:

1. Elemen 3D baru dimuat saat mendekati layar (seperti sebelumnya).
2. Selama ±2,5 detik animasi pertama, FPS diukur. Bila di bawah **30**, resolusi diturunkan ke 1× lalu diukur lagi.
3. Bila masih di bawah 30, animasi dihentikan dan **gambar statis** (`URL gambar pengganti` di panel elemen, atau poster bawaan) ditampilkan. Konsol mencatat `[3D] memakai gambar statis: FPS rendah (n)`.
4. Bila WebGL tidak ada atau konteks WebGL hilang (GPU kehabisan memori), gambar statis langsung dipakai.

Batas bisa diubah per elemen lewat konfigurasi `minFps` (0 = penjaga mati).

Uji otomatis (Chromium, CPU diperlambat 30×) sudah lolos: `x3d-rimba-roastery` dan `x3d-velo-listrik` jatuh ke gambar statis di ±9-10 fps dan tetap 3D pada kecepatan normal.

## Cara menguji di HP

- **HP:** Android kelas bawah (RAM 3-4 GB, mis. chipset Helio G35/G85 atau Unisoc T606), Chrome terbaru. Satu iPhone lama (iPhone 8/SE 2) untuk Safari.
- **Buka:** halaman demo template (Web Templates → Pratinjau) atau hasil unduhan yang dibuka lewat server lokal.
- **Debug:** sambungkan USB, buka `chrome://inspect` di laptop, lihat konsol.
- **Catat per template:**
  1. Apakah halaman bisa digulir mulus (tidak tersendat saat 3D muncul)?
  2. Apakah 3D tampil atau berganti ke gambar statis (lihat konsol)?
  3. Apakah HP panas atau baterai turun cepat dalam 1 menit?
  4. Apakah gambar statis terlihat pantas (tidak gepeng atau kosong)?

## Prioritas uji

Diurutkan dari yang paling berat (jumlah kanvas WebGL; partikel dan globe paling berat). Uji **1-12** dulu; bila semuanya lolos, sisanya hampir pasti aman. `card-3d` hanya efek miring CSS (tanpa WebGL) yang bereaksi saat kartu disentuh atau digeser, jadi ringan.

| # | Template | Kanvas WebGL | Elemen 3D |
|---|---|---|---|
| 1 | `x3d-kuantum-cloud` | 5 | three-particles ×2, three-shape ×2, three-globe ×1 |
| 2 | `x3d-orbit-kargo` | 4 | three-globe ×3, three-particles ×1 |
| 3 | `x3d-dompet-rapi` | 5 | three-shape ×3, three-particles ×2 |
| 4 | `x3d-neuralis-ai` | 4 | three-particles ×2, three-shape ×2 |
| 5 | `x3d-insight-labs` | 4 | three-globe ×2, three-shape ×2 |
| 6 | `x3d-sinar-surya` | 4 | three-shape ×3, three-particles ×1 |
| 7 | `x3d-kosmo-planetarium` | 3 | three-particles ×1, three-globe ×2 |
| 8 | `x3d-festival-gelombang` | 3 | three-particles ×3, card-3d ×6 |
| 9 | `x3d-lari-nusantara` | 3 | three-particles ×3 |
| 10 | `x3d-nusantara-charter` | 3 | three-globe ×2, three-shape ×1 |
| 11 | `x3d-nusa-game` | 3 | three-shape ×1, card-3d ×6, three-particles ×2 |
| 12 | `x3d-robotika-cakra` | 3 | three-shape ×2, card-3d ×3, three-particles ×1 |
| 13 | `x3d-lindung-asuransi` | 3 | three-shape ×2, three-particles ×1 |
| 14 | `x3d-setrum-station` | 3 | three-shape ×2, three-globe ×1 |
| 15 | `x3d-embun-botanica` | 3 | three-product ×3 |
| 16 | `x3d-lintas-benua` | 2 | three-globe ×2, card-3d ×6 |
| 17 | `x3d-arena-nova` | 2 | three-particles ×2, card-3d ×6 |
| 18 | `x3d-lensa-teduh` | 3 | three-shape ×3 |
| 19 | `x3d-samudra-biru` | 2 | three-globe ×2, card-3d ×3 |
| 20 | `x3d-pulse-lab` | 2 | three-particles ×2, card-3d ×6 |
| 21 | `x3d-linguaria` | 2 | three-globe ×2 |
| 22 | `x3d-prima-baja` | 3 | three-shape ×3 |
| 23 | `x3d-ruang-obrol` | 2 | three-particles ×2 |
| 24 | `x3d-yoga-teratai` | 2 | three-particles ×2 |
| 25 | `x3d-aurelia-clinic` | 3 | three-product ×3 |
| 26 | `x3d-rimba-roastery` | 2 | three-product ×2, card-3d ×3 |
| 27 | `x3d-studio-lumen` | 2 | three-shape ×2, card-3d ×6 |
| 28 | `x3d-wangi-nusa` | 2 | three-product ×2, card-3d ×3 |
| 29 | `x3d-madu-sumbawa` | 2 | three-product ×2 |
| 30 | `x3d-velo-listrik` | 2 | card-3d ×3, three-shape ×2 |
| 31 | `x3d-aksara-studio` | 2 | three-shape ×2, card-3d ×6 |
| 32 | `x3d-senyum-kristal` | 2 | three-shape ×2 |
| 33 | `x3d-teh-malabar` | 2 | three-product ×2 |
| 34 | `x3d-segar-hidroponik` | 2 | three-product ×2 |
| 35 | `x3d-adhyaksa-rekan` | 2 | three-shape ×2 |
| 36 | `x3d-turbo-garasi` | 2 | three-shape ×2 |
| 37 | `x3d-kakao-jembrana` | 2 | three-product ×2 |
| 38 | `x3d-roti-gandum` | 2 | three-product ×2 |
| 39 | `x3d-simpul-coworking` | 2 | three-shape ×2, card-3d ×6 |
| 40 | `x3d-langit-ubud` | 1 | card-3d ×6, three-particles ×1 |
| 41 | `x3d-tirta-sari` | 1 | three-product ×1 |
| 42 | `x3d-kembang-setaman` | 1 | three-product ×1 |
| 43 | `x3d-kriya-loka` | 0 | card-3d ×3 |
| 44 | `x3d-galeri-rupa` | 0 | card-3d ×6 |
| 45 | `x3d-atlas-properti` | 0 | card-3d ×9 |
| 46 | `x3d-satwa-sehat` | 0 | card-3d ×3 |
| 47 | `x3d-batik-sekar` | 0 | card-3d ×6 |
| 48 | `x3d-senja-kata` | 0 | card-3d ×6 |
| 49 | `x3d-cahaya-ilmu` | 0 | card-3d ×6 |
| 50 | `x3d-kayu-jepara` | 0 | card-3d ×6 |
