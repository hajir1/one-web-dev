# Global Setting + menu ringkas

## Ringkasan
- Sidebar dan Dashboard memakai **satu sumber menu**: `src/config/menu.ts`.
  Sidebar menjadi **Dashboard · Data · Media · Web Maker**. Dashboard menampilkan 3 kartu (Data, Media, Web Maker) berisi alat-alatnya.
- **Web Maker** = Element Maker, Component Maker, Page Maker, **Global Setting** (baru).
- Element Maker tidak lagi memajang 17 elemen di sidebar: ada halaman daftar `/element-maker` (per kelompok) dan, di tiap halaman elemen, tautan "Semua elemen" + pengalih "Pindah ke".
- **Global Setting** (`/global-setting`, tab lewat `?tab=icon|font`):
  - **Ikon** — pindahan dari Dashboard lama (`CreateIcon`), plus unggah banyak berkas `.svg`, batas 200 KB, konfirmasi hapus.
  - **Font** — pustaka font (Google Fonts atau URL/berkas `.woff2/.woff/.ttf/.otf`/stylesheet), status "Termuat/Gagal dimuat", dan **font dasar halaman**.
  - Tab didaftarkan di `SETTING_TABS` (GlobalSetting.tsx): menambah kelompok pengaturan baru = satu entri + satu komponen panel.

## Cara font bekerja
1. Font disimpan di `useFontStore` (localStorage `global-font-library`, divalidasi ulang saat dimuat).
2. Panel Tipografi elemen mendapat pemilih **Font** — otomatis muncul untuk elemen yang punya field `fontFamily`
   (sekarang: Text, Button, Badge, Alert, Anchor). Nilainya string CSS biasa, mis. `"Poppins", sans-serif`; kosong = `inherit` (sama seperti sebelumnya).
3. CSS hasil export otomatis diberi pemuat font **hanya untuk font pustaka yang dipakai** (`withFontCss`): `@import` dulu, lalu `@font-face`.
   Berlaku untuk Element Maker, Component Maker, Page Maker, di semua 5 framework (pratinjau Component/Page = jalur compose yang sama dengan export).
4. **Font dasar** → root Page Maker (`font-family` di class root, ikut ke kode export) dan latar pratinjau Element Maker. Export Component tidak menulis font dasar (komponen mewarisi dari situs).
5. Nama font tidak bisa diubah setelah dibuat (elemen menyimpan string CSS-nya). Ganti font = hapus + tambah.

## Keamanan input
- Nama font: huruf/angka/spasi/`-`/`_` saja. URL: `http(s)://` atau `/path`; ditolak bila ada spasi, kutip, kurung, `;{}`, backslash, `javascript:`, `data:`, `//host`.
- Data localStorage yang rusak/diedit manual dibersihkan (`sanitizeFonts`).

## File
Baru: `config/menu.ts`, `pages/Dashboard/Home.tsx` (menggantikan versi lama), `pages/globalSetting/**`,
`elementMaker/{helpers/fontCss.ts, store/fontStore.ts, hooks/useLibraryFonts.ts, hooks/useFontStatus.ts, ui/FontSelect.tsx, Page/ElementMakerHome.tsx}`.
Diubah: `layout/AppSidebar.tsx`, `App.tsx` (2 import + 2 rute), `elementMaker/{ui/PanelStyling, ui/PreviewCanvas, ui/ElementMakerLayout, hooks/useElementOutput, helpers/generatorCss, helpers/icon/IconSelect}`,
5 elemen (default `fontFamily: ""`), `componentMaker/{helpers/compose.ts, Page/ComponentMaker.tsx}`, `pageMaker/Page/PageMaker.tsx`.
Hapus di sisi Anda: `pages/Dashboard/icon/` (dipindah ke `globalSetting/ui/IconManager.tsx`).

## Tes
`npx tsx --test src/pages/*/tests/*.test.ts` → 57 lulus (15 baru: validasi nama/URL, URL Google Fonts, pemuat, deteksi font terpakai, urutan @import, compose + 5 framework, sanitasi, menu).

## Batasan
- Nama font Google tidak bisa dipastikan ada sebelum dimuat; statusnya ditampilkan di daftar ("Gagal dimuat" bila salah ketik/offline).
- Berkas font lokal tidak diunggah; font berkas harus punya URL (situs sendiri atau CDN). Satu berkas = satu bobot.
- Font per-elemen baru ada di 5 elemen berbasis teks; Card/Tabs/Table dst. mewarisi font induk.
- Jika font diubah/dihapus di pustaka, elemen yang sudah memakainya tetap menyimpan string CSS lama (jatuh ke font cadangan).
