import type { LandingSpec } from "./landing";

/* Bantuan menulis spesifikasi landing UMKM (v23). */

const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const SETIAP = [0, 1, 2, 3, 4, 5, 6];
export const SENIN_SABTU = [1, 2, 3, 4, 5, 6];
export const SENIN_JUMAT = [1, 2, 3, 4, 5];
export const SELASA_MINGGU = [0, 2, 3, 4, 5, 6];

function hariLabel(d: number[]): string {
  if (d.length === 7) return "Setiap hari";
  const s = [...d].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
  const idx = s.map((x) => (x + 6) % 7);
  const run = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (run && s.length > 2) return `${NAMA_HARI[s[0]]} - ${NAMA_HARI[s[s.length - 1]]}`;
  return s.map((x) => NAMA_HARI[x]).join(", ");
}

/** Jam buka: [[hari, buka, tutup], ...] → baris tampil + data status. Format jam "08.00". */
export function jam(...rows: [number[], string, string][]): Pick<LandingSpec, "hours" | "open"> {
  const hours: [string, string][] = rows.map(([d, a, b]) => [hariLabel(d), `${a} - ${b} WIB`]);
  const all = new Set(rows.flatMap((r) => r[0]));
  const tutup = SETIAP.filter((d) => !all.has(d));
  if (tutup.length) hours.push([hariLabel(tutup), "Tutup"]);
  return { hours, open: rows };
}
/** Sama dengan jam(), zona WITA/WIT hanya mengubah label. */
export function jamZona(z: "WITA" | "WIT", ...rows: [number[], string, string][]) {
  const r = jam(...rows);
  return { ...r, hours: r.hours.map(([d, h]) => [d, h.replace("WIB", z)] as [string, string]) };
}

export const LANGKAH = {
  makanan: [
    ["Pilih menu", "Tekan + pada menu yang kamu mau, jumlahnya bisa diatur."],
    ["Kirim lewat WhatsApp", "Daftar pesanan dan totalnya otomatis tersusun di chat."],
    ["Ambil atau diantar", "Ambil di tempat, atau kami kirim lewat ojek online ke alamatmu."],
  ],
  jasa: [
    ["Pilih layanan", "Tandai layanan yang dibutuhkan, lalu kirim lewat WhatsApp."],
    ["Atur jadwal", "Kami balas dengan jadwal kosong dan perkiraan biaya."],
    ["Dikerjakan", "Datang ke tempat kami atau kami yang datang ke lokasimu."],
  ],
  toko: [
    ["Pilih barang", "Tekan + untuk memasukkan ke keranjang."],
    ["Konfirmasi stok", "Kami cek stok dan ongkir, lalu kirim total akhir."],
    ["Bayar & dikirim", "Transfer atau bayar di tempat. Resi dikirim lewat WhatsApp."],
  ],
} as const satisfies Record<string, [string, string][]>;
export const langkah = (k: keyof typeof LANGKAH) => LANGKAH[k].map((x) => [...x] as [string, string]);
