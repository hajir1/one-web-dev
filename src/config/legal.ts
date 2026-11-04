// ─── config/legal.ts ─────────────────────────────────────────────────────────
// Business identity & legal document version. EVERY value in [square brackets]
// are PLACEHOLDERS that must be replaced before accepting real payments;
// on the legal pages is a placeholder highlighted in yellow so it is easy to find.
//
// LEGAL_VERSION must MATCH TERMS_VERSION in the backend .env. Whenever the
// Terms / Privacy Policy content changes: bump both (e.g. a new date) →
// all users are asked to accept again before buying.

export const LEGAL_VERSION = "2026-10-20";
/** Effective date shown in the documents. */
export const LEGAL_EFFECTIVE_DATE = "20 Oktober 2026";

export const BUSINESS = {
  /** Service brand name. */
  brand: "OneWebDev",
  /** Name of the company / individual that owns the service, e.g. "PT Contoh Digital Indonesia". */
  legalName: "[NAMA USAHA / PT]",
  /** Business form, e.g. "perseroan terbatas" / "usaha perseorangan". */
  entityType: "[bentuk usaha]",
  address: "[Alamat lengkap usaha, kota, kode pos]",
  /** City of the competent district court. */
  city: "[Kota]",
  email: "[email-dukungan@domain-anda.com]",
  /** Email for personal data requests (may be the same as the support email). */
  privacyEmail: "[privasi@domain-anda.com]",
  phone: "[Nomor telepon/WhatsApp]",
  website: "[https://domain-anda.com]",
  /** NPWP badan / pribadi. */
  taxId: "[NPWP]",
  /** Nomor Induk Berusaha (OSS). */
  nib: "[NIB]",
  /** Private Electronic System Operator Registration Number (Kominfo/Komdigi). */
  pseNumber: "[Nomor Tanda Daftar PSE]",
  /** Pejabat/petugas pelindungan data pribadi (UU PDP Pasal 53). */
  dataProtectionOfficer: "[Nama Pejabat Pelindungan Data Pribadi]",
  /** Customer service hours. */
  supportHours: "[Senin–Jumat, 09.00–17.00 WIB]",
} as const;

export const LEGAL_DOCS = ["terms", "privacy", "refund", "contact"] as const;
export type LegalDocId = (typeof LEGAL_DOCS)[number];
export const isLegalDoc = (v: unknown): v is LegalDocId => typeof v === "string" && (LEGAL_DOCS as readonly string[]).includes(v);

/** Legal page paths (without the language prefix). */
export const legalPath = (doc: LegalDocId) => `/legal/${doc}`;
