// ─── config/legal.ts ─────────────────────────────────────────────────────────
// Identitas usaha & versi dokumen legal. SEMUA nilai dalam [kurung siku]
// adalah PLACEHOLDER yang wajib diganti sebelum menerima pembayaran sungguhan;
// di halaman legal placeholder ditandai kuning agar mudah ditemukan.
//
// LEGAL_VERSION harus SAMA dengan TERMS_VERSION di .env backend. Setiap kali
// isi S&K / Kebijakan Privasi berubah: naikkan keduanya (mis. tanggal baru) →
// semua user diminta menyetujui ulang sebelum membeli.

export const LEGAL_VERSION = "2026-10-20";
/** Tanggal berlaku yang ditampilkan di dokumen. */
export const LEGAL_EFFECTIVE_DATE = "20 Oktober 2026";

export const BUSINESS = {
  /** Nama merek layanan. */
  brand: "OneWebDev",
  /** Nama badan usaha / perorangan pemilik layanan, mis. "PT Contoh Digital Indonesia". */
  legalName: "[NAMA USAHA / PT]",
  /** Bentuk usaha, mis. "perseroan terbatas" / "usaha perseorangan". */
  entityType: "[bentuk usaha]",
  address: "[Alamat lengkap usaha, kota, kode pos]",
  /** Kota untuk pengadilan negeri yang berwenang. */
  city: "[Kota]",
  email: "[email-dukungan@domain-anda.com]",
  /** Email khusus permintaan data pribadi (boleh sama dengan email dukungan). */
  privacyEmail: "[privasi@domain-anda.com]",
  phone: "[Nomor telepon/WhatsApp]",
  website: "[https://domain-anda.com]",
  /** NPWP badan / pribadi. */
  taxId: "[NPWP]",
  /** Nomor Induk Berusaha (OSS). */
  nib: "[NIB]",
  /** Nomor Tanda Daftar Penyelenggara Sistem Elektronik Lingkup Privat (Kominfo/Komdigi). */
  pseNumber: "[Nomor Tanda Daftar PSE]",
  /** Pejabat/petugas pelindungan data pribadi (UU PDP Pasal 53). */
  dataProtectionOfficer: "[Nama Pejabat Pelindungan Data Pribadi]",
  /** Jam layanan pelanggan. */
  supportHours: "[Senin–Jumat, 09.00–17.00 WIB]",
} as const;

export const LEGAL_DOCS = ["terms", "privacy", "refund", "contact"] as const;
export type LegalDocId = (typeof LEGAL_DOCS)[number];
export const isLegalDoc = (v: unknown): v is LegalDocId => typeof v === "string" && (LEGAL_DOCS as readonly string[]).includes(v);

/** Path halaman legal (tanpa prefix bahasa). */
export const legalPath = (doc: LegalDocId) => `/legal/${doc}`;
