# Page Maker — Catatan Perubahan

> **Terbaru: bagian 11** (lebar Row 80%/100%/kustom, Menu Element dinamis, Folder Website: homepage, slug, pratinjau antarhalaman, ekspor website utuh; Page Composer dimigrasi).
> Bagian 10: Lanjutan, Code Element, kuota desain/ekspor, konfirmasi keluar, elemen premium.
> Bagian 9: Element Maker & Component Maker sudah dihapus; engine-nya kini ada di
> `pageMaker/core` (dari `elementMaker`) dan `pageMaker/engine` (dari `componentMaker`). Path
> `componentMaker/...` / `elementMaker/...` di bagian lama merujuk ke lokasi sebelumnya.

Page Maker sekarang berupa **visual builder** (konsep Divi): canvas selebar layar, section wajib, 10 preset section,
tombol (+) + drag-and-drop, dan semua pengaturan lewat popup — tanpa sidebar permanen.

## 1. Hasil audit versi lama

| # | Temuan | Dampak |
|---|---|---|
| 1 | `Page/PageMaker.tsx` hanya stub: seluruh isi dikomentari, yang tampil cuma `<div>PageMaker</div>` | Fitur tidak bisa dipakai sama sekali |
| 2 | Helper & UI mengimpor modul lama yang sudah tidak ada setelah rework Component Maker: `componentGenerator`, `componentTemplates`, `elementRegistry`, tipe `HAlign` | Tidak bisa dikompilasi |
| 3 | Bergantung pada `sectionMaker/*` (sectionGenerator, sectionTemplates, …) — section hanya bisa berasal dari desain tersimpan di tool lain | Section tidak bisa dibuat di dalam Page Maker |
| 4 | Model datar `items[]` (satu baris = satu section/component/elemen); elemen bisa dipasang langsung di halaman tanpa section | Bertentangan dengan konsep "section wajib"; tidak ada layout bersarang |
| 5 | `live ? live.state : snapshot` tanpa di-merge default | Desain lama bisa menghasilkan `undefined`/`NaN` di CSS |
| 6 | Nama class item memakai nomor urut (`__item-N`) | Class berubah tiap item dipindah → CSS export tidak stabil |
| 7 | Preview di-inject langsung ke halaman aplikasi; mode "Mobile" hanya membatasi lebar (`@media` tidak bereaksi) | CSS bocor, uji responsif palsu |
| 8 | Tanpa undo/redo; hapus langsung permanen | Mudah kehilangan kerja |
| 9 | `AppLayout` membungkus semua halaman dengan sidebar + header + `max-w-(--breakpoint-2xl)` + padding | Canvas tidak bisa 100% lebar |

## 2. Konsep & arsitektur

**Satu engine dengan Component Maker.** Halaman = pohon yang sama (`BoxNode`/`ElementNode`):
`root (<main>)` → **Section** → **Row** → elemen (lihat bagian 8). Pratinjau & kode dibuat oleh `compose()` yang sama,
jadi kode selalu sama dengan pratinjau; 5 framework didukung (React/Vue/Svelte/Angular memakai komponen anak untuk elemen interaktif).

**Section** = `BoxNode` dengan `tag` semantik + `section: {contentWidth, padY, padX, minHeight, bgImage}`.
Latar penuh selebar halaman, isi dibatasi `contentWidth` lewat `padding: Ypx max(Xpx, calc((100% - W) / 2))` —
tanpa elemen pembungkus tambahan.

**Aturan "section wajib"** (`helpers/pageDoc.ts`, diuji): root hanya menerima section; section tidak boleh bersarang;
elemen/component hanya masuk ke dalam section. Berlaku untuk klik (+), drag-and-drop canvas, drag di Struktur, dan saat memuat desain.

**10 preset section** (`helpers/sectionPresets.ts`): Satu Kolom, Hero Terpusat, Hero Dua Kolom, Fitur 3 Kolom,
Statistik 4 Kolom, Konten + Sisi, Harga 3 Kartu, CTA Banner, Navbar, Footer 4 Kolom. Kolom awalnya kosong; isi lewat (+).

**Canvas (`ui/BuilderCanvas.tsx`).** Halaman dirender di iframe sandbox (`ui/PageFrame.tsx`, `helpers/pageShell.ts`) agar
`@media` benar-benar bereaksi pada Desktop / Tablet 768 / Mobile 375. Iframe melaporkan kotak tiap node; overlay di induk
menggambar outline, toolbar node (seret, pengaturan, +, naik/turun, duplikat, pilih induk, hapus), tombol (+) di kolom kosong,
tombol (+) antar section, dan penanda drop. Tidak ada elemen tambahan di dalam halaman, jadi kode export bersih.
Penentuan tempat drop ada di `helpers/dropTarget.ts` (fungsi murni, diuji).

**Popup (non-modal, `ui/FloatingPanel.tsx`).** Bisa diseret, posisi diingat, jadi bottom sheet di layar < 640px, Esc menutup.
- **Tambah (+)**: tab Elemen (pustaka Element Maker + desain tersimpan), Component (desain tersimpan Component Maker, disalin ke halaman), Kontainer. Klik atau seret ke canvas; popup tetap terbuka supaya bisa menambah beberapa item.
- **Pengaturan**: memakai `Inspector` + `PanelStyling` yang sama dengan Component/Element Maker (section punya grup "Section": tag, lebar isi, padding, tinggi minimum, gambar latar).
- **Struktur**: pohon dengan drag-and-drop. **Desain Saya**: simpan/buka halaman.

**Mode**: Desain (builder) · Pratinjau (tanpa overlay, interaktif) · Kode (pratinjau kiri + kode kanan, 5 framework, salin/unduh).

**Layout tanpa sidebar.** `layout/AppLayout.tsx` memakai daftar `IMMERSIVE_ROUTES = ["/page-maker"]`: rute itu merender `<Outlet />`
saja (tanpa sidebar, header, pembatas lebar). Page Maker memenuhi `fixed inset-0` dan punya tombol Keluar sendiri.

## 3. Perubahan di modul lain (kompatibel)

- `componentMaker/helpers/componentTypes.ts`: `BoxNode` mendapat `tag?` dan `section?` (opsional; data lama tetap valid).
- `compose.ts`: tag semantik, padding/min-height/gambar latar section (URL divalidasi). `migrate.ts`: field baru disanitasi.
- `Inspector.tsx`: grup "Section"; tombol bungkus/lepas disembunyikan untuk section.
- `helpers/editHandlers.ts` (baru): handler pengeditan properti dipakai bersama Component Maker & Page Maker.
- `dnd.ts`: payload `component` & `section`, `subscribeDrag`. `ElementLibrary`: `FitPreview` diekspor, prop `dropAreaLabel`.
- `TemplatePicker.tsx`: `ThumbNode` diekspor.

## 4. Migrasi data

`normalizePageDoc` menerima format baru, format lama Page Maker (`items[]` → tiap item jadi section, component dibuka sebagai kontainer
bersarang), dan data korup (tidak pernah melempar; elemen yang nyasar dibungkus section, tidak ada yang hilang).

## 5. File

- **Baru:** `helpers/{pageDoc,sectionPresets,dropTarget,pageShell}.ts`, `ui/{BuilderCanvas,PageFrame,PagePreview,FloatingPanel,AddPanel,SectionPicker}.tsx`, `Page/PageMaker.tsx` (ditulis ulang), `tests/page.test.ts`.
- **Dihapus (digantikan):** `helpers/pageGenerator.ts`, `helpers/pageTypes.ts`, `ui/PageCanvas.tsx`, `ui/PageLibraryPanel.tsx`, `ui/PageItemInspector.tsx`, `ui/PageSettings.tsx`.

## 6. Tes

```
npx tsx --test src/pages/componentMaker/tests/*.test.ts src/pages/pageMaker/tests/*.test.ts
```
42 tes. Diuji juga di browser (Playwright): section wajib, 10 preset, (+) & klik tambah, drag-and-drop dari popup ke kolom,
popup pengaturan → CSS berubah, mode Pratinjau/Kode, viewport Mobile (grid jadi 1 kolom), Struktur, Delete + Undo (juga dari dalam iframe),
muat desain format lama/korup, layar 390px; kode semua framework dikompilasi (esbuild, Vue SFC, Svelte, Angular, parse5).
Hasil export Element Maker tetap identik (diff 17 halaman × 5 framework, mode normal & stress).

## 7. Yang perlu diperhatikan di aplikasi

- Ganti `layout/AppLayout.tsx` dengan versi baru; `App.tsx` tidak perlu diubah (rute `/page-maker` sudah ada).
- **Section Maker (`pages/sectionMaker`) tidak ikut dikerjakan** dan kemungkinan masih mengimpor modul Component Maker lama
  (`componentGenerator`, `componentTemplates`, `elementRegistry`) yang sudah diganti pada rework sebelumnya. Modul itu perlu dimigrasi
  ke engine baru (atau dipensiunkan, karena section kini dibuat langsung di Page Maker).
- Component yang ditambahkan ke halaman adalah **salinan** (tidak mengikuti perubahan desain Component Maker). Elemen dari desain tersimpan Element Maker tetap tertaut seperti di Component Maker.


## 8. Pembaruan — Section → Row → Element

Perbaikan dari temuan produksi: section otomatis ber-flex sehingga elemen terhimpit/bertumpuk, elemen bisa langsung di section/kolom,
tidak ada (+) pada elemen, dan tidak ada Row.

**Hierarki baru:** `root (<main>)` → **Section** (layout `block`, `display: block`) → **Row** (`row: true`, BoxNode yang bisa di-styling) → **Element**
(boleh lewat kolom/grup di dalam Row, mis. kolom preset atau Component yang dimasukkan).

| Permintaan | Implementasi |
|---|---|
| 1. Section tampil normal | Layout baru `block` → CSS `display: block` tanpa flex/grid/gap. Preset kini section blok + Row. |
| 2. (+) di setiap elemen | Tombol (+) bulat di tepi bawah elemen/grup (hover atau terpilih) + di toolbar → elemen baru tepat di bawahnya (saudara berikutnya di Row yang sama). |
| 3. Section → Row → Element | `canInsertInto` ketat; `placeNode` membungkus konten yang dijatuhkan ke section dengan Row otomatis; `enforcePageStructure` + `movePageNode` menjaga hierarki (klik, drag canvas, drag Struktur, muat desain). |
| 4. (+) di setiap Row | (+) ungu di tepi bawah Row + toolbar → Row baru tepat di bawahnya; toolbar section → Row di akhir; tab **Row** (1/2/3/4 kolom, sejajar) bisa diklik atau diseret. |
| 5. Row bisa di-styling | Row = BoxNode penuh: Inspector menampilkan layout, jarak, perataan, ukuran, padding, latar, border, sudut, bayangan. |

**Migrasi halaman lama** (`normalizePageDoc` → `normalizeSection`): section ber-flex/grid dengan kolom/elemen langsung diubah menjadi section blok
berisi satu Row yang mewarisi layout lama (layout, gap, kolom, perataan) — tampilan sama, tidak ada elemen hilang; section kosong lama → blok. Idempoten (diuji).

**Perubahan di modul bersama (aditif, kompatibel):** `componentTypes.ts` (`BoxLayout` + `"block"`, `BoxNode.row?`), `migrate.ts` (sanitasi), `compose.ts`
(`display:block`; anak blok tanpa aturan penempatan), `tree.ts`/`elementIcons.ts` (label & ikon blok), `Inspector.tsx` (opsi "Normal (blok)" hanya untuk section;
sembunyikan pengaturan flex saat blok; bungkus/lepas disembunyikan untuk Row), `dnd.ts` (payload `row`). Perilaku Element/Component Maker tidak berubah.

**File:** baru `helpers/rowModel.ts`; diubah `helpers/{pageDoc,sectionPresets,dropTarget}.ts`, `ui/{BuilderCanvas,AddPanel,SectionPicker}.tsx`, `Page/PageMaker.tsx`, `tests/page.test.ts`.

**Tes:** 65 tes unit lulus (23 untuk Page Maker, termasuk Row, migrasi, `placeNode`, drop Row). Browser: section `display:block`, Row grid/flex, (+) elemen & Row,
styling Row, 10 preset, 390px tanpa scroll horizontal; export Element Maker identik; kode 5 framework dikompilasi.

**Catatan:** "tepat di bawah elemen" = saudara berikutnya dalam Row yang sama (vertikal pada Row stack bawaan). Kolom/grup dalam Row boleh berisi beberapa elemen.


## 9. Pembaruan — Page Maker satu-satunya builder, background, event JS, kredit

### 9.1 Penyederhanaan builder
- **Dihapus:** halaman & rute Element Maker (17 halaman + hub), Component Maker, menu sidebar/Dashboard-nya,
  pustaka "desain tersimpan" elemen/komponen di panel Tambah (tab Component, tautan desain, banner sinkron).
- **Dipindah (bukan dihapus) karena dipakai Page Maker:**
  `elementMaker/{helpers,hooks,store,ui}` → `pageMaker/core/…`, definisi 17 elemen →
  `pageMaker/core/elements/{basic,forms,data,navigation}` (hanya definisi; komponen halaman maker dibuang),
  `componentMaker/{helpers,ui}` → `pageMaker/engine/…`.
- Panel Tambah: **Elemen (bawaan saja) · Grup · Row**. Data lama: tautan desain (`link`) dibuang saat dimuat, state tetap.
- Global Setting tetap (ikon & font), import-nya diarahkan ke `pageMaker/core`.
- `App.tsx`: rute `/element-maker/*`, `/component-maker`, `/section-maker` diarahkan ke `/page-maker`.
  **Hapus folder** `src/pages/elementMaker`, `src/pages/componentMaker`, dan `src/pages/sectionMaker`
  (Section Maker mengimpor modul Component Maker yang sudah tidak ada).

### 9.2 Background lengkap (`core/helpers/background.ts`, `core/ui/BackgroundEditor.tsx`)
- Tipe: **Tidak ada · Warna · Gradient (linear/radial, warna tengah opsional) · Gambar** (URL atau unggah ≤ 1,5 MB,
  ukuran cover/contain/asli, 9 posisi, ulangi, parallax `fixed`, warna dasar, overlay warna + opasitas).
- Satu nilai shorthand `background:`; URL & warna divalidasi (tidak bisa menutup deklarasi CSS).
- Berlaku untuk **section, Row, grup** (grup "Background & Border") dan elemen ber-latar
  (Button, Text, Anchor, Alert, Badge, Icon, Card, List, Breadcrumbs; Input/Select: warna & gradient).
- Data lama (`bgEnabled`/`bgColor`, `section.bgImage`) tetap tampil sama; diubah otomatis ke field baru saat diedit.

### 9.3 Pratinjau kode terbatas & kuota unduh (`src/credits/`)
- Mode Kode menampilkan **sebagian baris** tiap berkas (≈40%, 6–24 baris); sisanya tidak dikirim ke DOM. Tombol Salin dihapus.
- **Unduh** = satu-satunya cara mendapat kode lengkap: gratis **5× per IP**. IP diambil dari `api.ipify.org`
  (cadangan: id perangkat acak), hitungan di localStorage. Setelah habis → dialog kredit.
- Catatan keamanan: pembatasan di frontend bisa diakali (hapus data situs, devtools, iframe pratinjau). Pindahkan ke backend saat tersedia.

### 9.4 Preset section: 8 gratis + 14 premium
- Gratis: Satu Kolom, Hero Terpusat, Hero Dua Kolom, Fitur 3 Kolom, Konten + Sisi, CTA Banner, Navbar, Footer 4 Kolom.
- Premium (baru 12 + 2 lama): Hero Gambar, Hero Gradient, Statistik 4 Kolom, Harga 3 Kartu, Testimoni, Tim 4 Kolom,
  Deretan Logo, FAQ Dua Kolom, Newsletter, Langkah 4 Tahap, Galeri 3×2, Kontak Dua Kolom, Artikel 3 Kartu, Banner Gelap.
- Pemilih preset dibagi dua kelompok berlabel (Gratis / Premium + gembok). Premium → dialog kredit (juga dijaga di `addSection` & drop).

### 9.5 Event JavaScript (`engine/helpers/events.ts`, `ui/EventsPanel.tsx`)
- Elemen: Button, Anchor, Image, Icon, Badge, Card, Input, Select, Checkbox, Switch (event form dipasang di `<input>/<select>`).
- Gratis: `onClick`. Premium (dialog kredit): onDoubleClick, onChange, onInput, onMouseDown/Up/Enter/Leave, onFocus, onBlur, onKeyDown/Up.
- Hasil: HTML `function` + `addEventListener` di `script.js`; React `onClick={fn}` + fungsi di komponen; Vue `@click` + `<script setup>`;
  Svelte `on:click` + `<script>`; Angular `(click)="fn($event)"` + method kelas.
- `compose({ allowPremiumEvents })` = satu titik penegakan; tanpa kredit event premium tidak ikut di kode (peringatan).
- Kode dicek sintaksnya (dikompilasi, tidak dijalankan); yang tidak valid tidak ikut. Event tidak jalan di canvas Desain, jalan di Pratinjau & export.

### 9.6 Sistem kredit (`src/credits/credits.ts`, `CreditDialog.tsx`)
Tidak ditemukan sistem kredit di kode yang dibagikan, jadi dibuat satu pintu: `requireCredit(feature, …)` menampilkan
dialog "membutuhkan kredit" (tanpa transaksi). Hubungkan ke backend kredit di file ini saja.

### 9.7 Tes
69 tes unit (background, preset, event 5 framework, kuota, pratinjau terbatas, migrasi). Browser (Playwright): preset premium → dialog,
event onClick jalan di Pratinjau, premium event → dialog, background gradient/gambar di canvas, 5 unduhan lalu dialog, 390px dark tanpa
scroll horizontal. Kompilasi 5 framework (esbuild, Vue SFC, Svelte, Angular, parse5) untuk halaman 22 preset + 17 elemen + event: lolos.


## 10. Pembaruan — Lanjutan, Code Element, kuota, Page Composer

### 10.1 Audit alur data (ringkas)
`PageMaker` → `useComponentDoc` (undo/redo) → pohon `BoxNode/ElementNode` (`engine/helpers/componentTypes.ts`) →
`compose()` (satu sumber: canvas desain `preview:true`, Pratinjau & 5 framework) → iframe sandbox `allow-scripts`
tanpa same-origin (`helpers/pageShell.ts`). Simpan: `useDesignSaver` + `designStore` (localStorage, tipe `page`).
Kuota & kredit: `src/credits/`.

### 10.2 Lanjutan: CSS ID, CSS Class, Custom CSS, Custom JS (gratis) — `engine/helpers/advanced.ts`, `ui/AdvancedPanel.tsx`
- Data: `node.advanced = { cssId, cssClass, customCss, customJs }` di section, Row, grup, elemen (disanitasi saat dimuat).
- ID: divalidasi; ganda dalam satu halaman → akhiran `-2`, `-3` + peringatan (juga dicek di panel).
- Class: token valid ditambahkan ke elemen terluar (termasuk template komponen anak seperti Tabs).
- Custom CSS di-scope ke class node (`&` = node, selector lain jadi turunan, `@media` di-scope, `@import`/`</style>` dibuang,
  kurung tak seimbang → diabaikan + peringatan). Vue: blok `<style>` global; Svelte: `:global()`; Angular: `ViewEncapsulation.None`.
- Custom JS: runtime `initCustomCode(root)` — `run()` per node dengan try/catch, helper `on()` (otomatis dilepas) dan
  `onCleanup()`, inisialisasi ulang pada root yang sama membersihkan yang lama (anti listener ganda, aman StrictMode).
  HTML: `script.js` → `initCustomCode(document)`; React `useRef+useEffect`; Vue `onMounted/onBeforeUnmount`;
  Svelte `bind:this + onMount`; Angular `@ViewChild + ngAfterViewInit/ngOnDestroy` (berkas `customCode.js` / `custom-code.ts`).
  Hanya jalan di Pratinjau & export, tidak di canvas desain; iframe membersihkan Custom JS sebelum render ulang.
- Editor kode ringan ber-highlight tanpa dependensi (`core/ui/CodeEditor.tsx`).

### 10.3 Code Element — `core/elements/basic/Code.tsx`
HTML mentah + CSS + JS (tab terpisah). `<script>` dibuang (peringatan di panel). CSS & JS lewat jalur Lanjutan.
Framework: React `dangerouslySetInnerHTML`, Vue `v-html`, Svelte `{@html}`, Angular `[innerHTML]` + `bypassSecurityTrustHtml`.
Batasan: JSX/SFC framework tidak didukung (tampil sebagai HTML).

### 10.4 Batas 5 desain — `useDesignSaver(…, { maxFree, onLimit })`, `DesignManagerBar`
Simpan baru & "Simpan sebagai Salinan" dihitung; "Simpan Perubahan" tidak. Saat penuh: dialog kredit, tidak ada yang
dihapus/ditimpa; desain lama tetap bisa dibuka/diedit/diperbarui. Indikator "x/5 desain gratis".

### 10.5 Kuota ekspor 20 — `src/credits/downloadQuota.ts`, `useExportQuota`
Dihitung setelah berkas berhasil dibuat & diunduh. Ekspor ulang identik (framework + isi sama, sidik jari FNV-1a) gratis;
framework berbeda = ekspor baru; ZIP & berkas tunggal sama (1 ekspor); gagal tidak dihitung. Data lama (`owd-download-quota`) dimigrasi.

### 10.6 Page Composer — `helpers/composer.ts` (UI-nya diganti Website pada bagian 11; rute `/page-composer` → `/website`)
Design (tipe `page`) vs Page/komposisi (tipe `composition`). Item = snapshot (deep copy) desain; tambah/hapus/ganti/urutkan
(seret atau panah), "Perbarui salinan" bila sumber berubah. Penggabungan menyalin section dengan id node baru, mengganti
CSS ID yang bentrok, dan memaksa struktur valid. Pratinjau (3 viewport), simpan, ekspor (kuota sama).

### 10.7 Konfirmasi keluar — `hooks/useLeaveGuard.ts`, `ui/LeaveDialog.tsx`
Simpan dan Keluar / Keluar Tanpa Menyimpan / Batal. Jalur: tombol Keluar, Back browser (entri penjaga di history),
link internal (klik dicegat), tutup/muat ulang tab (dialog bawaan browser). Juga dipakai di Page Composer.

### 10.8 Elemen premium — `core/elements/premium/`
Slider (5 framework, timer dibersihkan), Countdown (5 framework), Progress Bar, Testimoni, Kartu Harga.
Ditandai gembok di pustaka; menambah → dialog kredit. `compose({ allowPremiumElements })` sebagai penegak di hasil.

### 10.9 Pengujian
80 tes unit (11 tes baru di `tests/features.test.ts`). Browser: Lanjutan & Code Element (canvas vs Pratinjau), elemen premium →
dialog, 5 desain lalu ke-6 → dialog, konfirmasi keluar (Keluar, Back), Composer (urutan, ID bentrok, sumber tidak berubah,
simpan, ekspor ulang tidak dihitung), kuota habis → dialog, 390px dark tanpa scroll horizontal; regresi pm1–pm10, Global Setting,
dokumentasi. Kompilasi 5 framework untuk halaman dengan semua fitur & elemen premium: lolos. `vite build` lolos.

### 10.10 Batasan
- Semua kuota & kredit = simulasi frontend (localStorage + IP publik), mudah dimanipulasi.
- Template Angular hanya divalidasi parser (bukan `ng build`); Svelte memberi peringatan a11y pada elemen non-interaktif yang diberi event.
- Custom JS & Code Element menjalankan kode pengguna apa adanya di hasil export (tanggung jawab pengguna).
- Halaman di Page Composer tidak membawa pengaturan root (latar halaman) dari desain sumber.

## 11. Pembaruan — Lebar Row, Menu Element dinamis, Folder Website

### 11.1 Audit
- **Row ±80%:** penyebabnya bukan Row, tetapi section. Padding samping section dihitung `max(padX, calc((100% - lebarIsi) / 2))`, jadi konten (termasuk Row ber-`width: 100%`) selalu terjepit di `Lebar isi` (bawaan 1120px), dan tampak ±80% di layar lebar.
- **Penyimpanan:** `designStore` (localStorage `element-maker-designs-v2`) dikelompokkan per tipe: `page` (desain Page Maker), `composition` (Page Composer lama). Desain punya ID stabil (`makeId`).
- **Generator:** `compose(root, opts)` adalah satu jalur untuk canvas, pratinjau, dan 5 framework, sehingga semua perubahan dipasang di sana.
- **Pratinjau:** iframe sandbox (`pageShell`) berkomunikasi lewat `postMessage`.

### 11.2 Lebar Row — `compose.ts › rowWidthRules`, `Inspector.tsx`, `migrate.ts`
- Padding section sekarang hanya `padY padX`. `Lebar isi` section dipindah ke Row, sebagai mode bawaan **"Ikuti lebar isi section"** (`max-width` dan auto margin), jadi tampilan lama tidak berubah.
- `BoxNode.rowWidth`:

  | Nilai | CSS yang dihasilkan |
  | --- | --- |
  | `content` | `max-width: <lebar isi>px`, di tengah |
  | `80` | `width: 80%`, di tengah |
  | `full` | `width: 100%; max-width: none` |
  | `custom` | `rowCustomWidth` dengan satuan `rowCustomUnit` (px/%) dan `max-width: 100%` |

- Aturannya sama untuk canvas, pratinjau, dan semua export, dan tetap responsif.

### 11.3 Menu Element — `core/elements/navigation/Menu.tsx`, `core/helpers/siteTypes.ts`
- **Item menu:** diambil dari halaman folder website (`SiteContext` dikirim ke `spec(s, cls, icons, ctx)`). Labelnya label khusus, atau nama desain terkini. URL-nya dari slug, bukan nama mentah.
- **Folder yang dipakai:** pilihan pengguna, lalu folder yang memuat halaman yang sedang dirender, lalu folder pertama. Bila belum ada folder, menu menampilkan contoh.
- **Pilihan halaman:** `pageIds` kosong berarti semua halaman. Urutan mengikuti urutan di folder.
- **Pengaturan:** orientasi, perataan, gap, ukuran/tebal teks, padding, warna teks/hover/aktif, penanda halaman aktif (`aria-current`), dan susun vertikal di mobile.
- **Bentuk tautan:**

  | Tempat | Tautan |
  | --- | --- |
  | Halaman tunggal | `<a href="slug.html" data-pm-page>` |
  | Website React | `Link` |
  | Website Vue | `RouterLink` |
  | Website Svelte | `#/slug` |
  | Website Angular | `routerLink` |
  | Website HTML | `slug.html` |

### 11.4 Folder Website — `helpers/site.ts`, `Page/WebsiteManager.tsx`, rute `/website`
- **Model data:** tipe desain `site`, isinya `SiteDoc { version: 1, pages: [{ designId, slug, label? }], homepageId }`. Hanya referensi ke desain, tanpa salinan.
- **Operasi:** `addPage`, `removePage`, `movePage`, `replacePage`, `setHomepage`, `setSlug` (dengan validasi dan cek unik), `setLabel`, `normalizeSiteDoc`.
- Mengeluarkan halaman dari folder, atau menghapus folder, tidak menghapus desain sumber.
- **Kuota:** 1 folder gratis (`FREE_SITES`, fitur kredit `site-slot`). Batas desain halaman naik menjadi 10 (`FREE_DESIGNS`).
- **Navigasi:**
  - Page Maker menerima `?design=<id>` dari tombol edit di Website.
  - Desain Saya punya tautan **Kelola website**.
  - Menu sidebar "Page Composer" diganti "Website".

### 11.5 Pratinjau & ekspor website — `helpers/siteExport.ts › buildSite`
- Tiap halaman di-compose terpisah dengan class `page-<slug>`. Gaya, ID, Custom CSS/JS, dan komponen anak tidak bertabrakan antarhalaman.
- **Pratinjau:** klik `a[data-pm-page]` di iframe mengirim `pm:navigate`, lalu halaman yang tampil berpindah.
- **Struktur ekspor per framework:**

  | Framework | Struktur |
  | --- | --- |
  | HTML | `index.html` (homepage) dan `slug.html`, aset di `assets/` |
  | React | `App.jsx` (react-router-dom) dan `main.jsx` |
  | Vue | `router.js` (vue-router), `App.vue`, dan `main.js` |
  | Svelte | `App.svelte` dengan router hash |
  | Angular | `app.routes.ts`, `app.component.ts`, dan `main.ts`; halaman dibuat standalone |

  README disertakan untuk semua framework.
- **Peringatan:** desain yang sudah dihapus, homepage yang tidak tersedia, dan folder kosong.

### 11.6 Migrasi Page Composer, lalu Folder Website
1. Desain `page` tidak disentuh. Folder hanya mereferensikannya.
2. Data `composition` lama tetap tersimpan dan tampil di Website › **Data Page Composer lama**:
   - **Jadikan desain** menggabungkan susunan lama menjadi satu desain halaman lewat `mergeComposition`, dengan cek batas desain.
   - **Hapus** dilakukan hanya bila pengguna memilihnya.
3. Rute `/page-composer` diarahkan ke `/website`. `Page/PageComposer.tsx` dihapus. `helpers/composer.ts` tetap dipakai untuk konversi.

### 11.7 Pengujian
- **Unit:** 89 tes lulus. `tests/site.test.ts` (8 tes) menguji slug, operasi folder, normalisasi, resolusi menu dan propagasi ganti nama, tautan per target, struktur ekspor per framework, dan peringatan.
- **Browser:**
  - `pm12` (Website): buat folder, folder ke-2 memunculkan kredit, tambah halaman, slug salah dan benar, label, homepage, urutan, navigasi lewat menu di pratinjau, Custom JS berjalan, ganti nama desain ikut ke menu, keluarkan halaman, migrasi lama, unduh zip React/HTML.
  - `pm13` (Page Maker): `?design=`, menu di canvas, Row 80% / bawaan / 100% / 500px, batas 10 desain.
  - Regresi `pm1`–`pm11` dan dokumentasi lulus.
  - `check.mjs`: 80/80 berkas ekspor website lolos cek sintaks.

### 11.8 Batasan
- Semua fitur hanya di frontend (localStorage). Kredit masih berupa pemberitahuan.
- React, Vue, dan Angular memakai URL bersih, jadi hosting membutuhkan fallback SPA ke `index.html`. Svelte memakai hash (`#/slug`) supaya tanpa dependensi router.
- Ekspor Angular divalidasi lewat parser, belum di-build dengan Angular CLI.
- HTML ekspor website menyimpan atribut `data-pm-page` pada tautan menu. Atribut ini tidak berbahaya.
- Pengaturan halaman (latar root) tiap desain ikut ke halamannya masing-masing. Belum ada layout bersama (header/footer global), jadi Menu ditambahkan di setiap halaman.
