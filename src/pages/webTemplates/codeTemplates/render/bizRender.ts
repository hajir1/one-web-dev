import type { RegionRenderer } from "../editModel";
import { icon } from "../../../../tools/codeTemplates/umkmIcons";

/* ================================================================== */
/* Daftar yang bisa ditambah/dihapus/diurutkan di website 3D bisnis (v27).*/
/*                                                                    */
/* Isi daftar (katalog, kategori, keunggulan, alur, ulasan, galeri,      */
/* paket, jam buka, FAQ) disimpan di blok data DAFTAR. Fungsi di sini    */
/* membangun HTML statisnya; dipakai generator (HTML awal) dan editor    */
/* tanpa kode (bangun ulang setelah daftar diubah). Struktur kelas sama  */
/* dengan v23 agar CSS identitas, filter katalog, tombol WhatsApp, dan   */
/* foto galeri 3D tetap bekerja untuk item baru.                        */
/* ================================================================== */

export interface BizItem { nama: string; deskripsi: string; harga: number; satuan: string; kategori: string; label: string; ikon: string }
export interface BizPlan { nama: string; harga: number; satuan: string; ringkasan: string; fitur: string[]; unggulan: boolean }
export interface BizDaftar {
  ikon: string;
  kategori: string[];
  katalog: BizItem[];
  keunggulan: { judul: string; isi: string; ikon: string }[];
  alur: { judul: string; isi: string }[];
  ulasan: { isi: string; nama: string; keterangan: string }[];
  galeri: string[];
  paket: BizPlan[];
  jam: { hari: string; jam: string }[];
  faq: { tanya: string; jawab: string }[];
}
/** Kunci di DAFTAR yang tidak tampil di form (ikon dipilih desainer). */
export const BIZ_DAFTAR_HIDE = "ikon,katalog.ikon,keunggulan.ikon";

const esc = (v: unknown) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const rupiah = (v: number) => "Rp" + v.toLocaleString("id-ID").replace(/,/g, ".");
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
const wa = (cfg: Record<string, unknown>, text: string) => `https://wa.me/${String(cfg.whatsapp ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

function daftarOf(data: Record<string, unknown>): BizDaftar {
  const d = obj(data.DAFTAR);
  return {
    ikon: String(d.ikon ?? "star"),
    kategori: arr<unknown>(d.kategori).map((x) => String(x ?? "")),
    katalog: arr<Record<string, unknown>>(d.katalog).map((x) => obj(x)).map((x) => ({ nama: String(x.nama ?? ""), deskripsi: String(x.deskripsi ?? ""), harga: num(x.harga), satuan: String(x.satuan ?? ""), kategori: String(x.kategori ?? ""), label: String(x.label ?? ""), ikon: String(x.ikon || "star") })),
    keunggulan: arr<unknown>(d.keunggulan).map(obj).map((x) => ({ judul: String(x.judul ?? ""), isi: String(x.isi ?? ""), ikon: String(x.ikon || "star") })),
    alur: arr<unknown>(d.alur).map(obj).map((x) => ({ judul: String(x.judul ?? ""), isi: String(x.isi ?? "") })),
    ulasan: arr<unknown>(d.ulasan).map(obj).map((x) => ({ isi: String(x.isi ?? ""), nama: String(x.nama ?? ""), keterangan: String(x.keterangan ?? "") })),
    galeri: arr<unknown>(d.galeri).map((x) => String(x ?? "")),
    paket: arr<unknown>(d.paket).map(obj).map((x) => ({ nama: String(x.nama ?? ""), harga: num(x.harga), satuan: String(x.satuan ?? ""), ringkasan: String(x.ringkasan ?? ""), fitur: arr<unknown>(x.fitur).map((f) => String(f ?? "")), unggulan: x.unggulan === true })),
    jam: arr<unknown>(d.jam).map(obj).map((x) => ({ hari: String(x.hari ?? ""), jam: String(x.jam ?? "") })),
    faq: arr<unknown>(d.faq).map(obj).map((x) => ({ tanya: String(x.tanya ?? ""), jawab: String(x.jawab ?? "") })),
  };
}

const priceHtml = (price: number, unit: string) =>
  price <= 0 ? `<span class="price"><span>${esc(cap(unit || "Tanya harga"))}</span></span>` : `<span class="price"><span>${rupiah(price)}</span><small>${esc(unit)}</small></span>`;

/** Indeks kategori item: cocokkan nama (tanpa beda huruf besar/kecil); tidak cocok = kategori pertama. */
const catIndex = (cats: string[], name: string) => Math.max(0, cats.findIndex((c) => c.trim().toLowerCase() === name.trim().toLowerCase()));

const R = (fn: (d: BizDaftar, cfg: Record<string, unknown>) => string): RegionRenderer => (data) => fn(daftarOf(data), obj(data.CONFIG));

export const BIZ_REGIONS: Record<string, RegionRenderer> = {
  "biz-tabs": R((d) => `<button class="tab" type="button" data-f="all" aria-pressed="true">Semua</button>${d.kategori.map((c, i) => `<button class="tab" type="button" data-f="${i}" aria-pressed="false">${esc(c)}</button>`).join("")}`),
  "biz-katalog": R((d, cfg) =>
    d.katalog
      .map((it, i) => {
        const c = catIndex(d.kategori, it.kategori);
        return `<li class="item card" data-c="${c}" data-rv style="--d:${(i % 4) * 0.05}s"><div class="pic" aria-hidden="true">${icon(it.ikon)}</div>${it.label ? `<span class="tag">${esc(it.label)}</span>` : ""}<small class="cat">${esc(d.kategori[c] ?? "")}</small><h3>${esc(it.nama)}</h3><p>${esc(it.deskripsi)}</p><div class="row">${priceHtml(it.harga, it.satuan)}<a class="btn sm" href="${esc(wa(cfg, `${String(cfg.pesanPembuka ?? "Halo, saya mau pesan:")}\n- ${it.nama}`))}" target="_blank" rel="noopener" data-order>${it.harga > 0 ? "Pesan" : "Tanya"}</a></div></li>`;
      })
      .join(""),
  ),
  "biz-usp": R((d) => d.keunggulan.map((u, i) => `<li class="card" data-rv style="--d:${i * 0.05}s">${icon(u.ikon)}<h3>${esc(u.judul)}</h3><p>${esc(u.isi)}</p></li>`).join("")),
  "biz-alur": R((d) => d.alur.map((s, i) => `<li class="card" data-rv style="--d:${i * 0.07}s"><h3>${esc(s.judul)}</h3><p>${esc(s.isi)}</p></li>`).join("")),
  "biz-ulasan": R((d) => d.ulasan.map((q, i) => `<li class="card" data-rv style="--d:${i * 0.06}s"><div class="stars" aria-label="Bintang 5">&#9733;&#9733;&#9733;&#9733;&#9733;</div><blockquote>${esc(q.isi)}</blockquote><div class="who"><b>${esc(q.nama)}</b><span>${esc(q.keterangan)}</span></div></li>`).join("")),
  "biz-galeri": R((d) => d.galeri.map((g, i) => `<li data-shot data-rv style="--d:${i * 0.05}s"><figure style="margin:0">${icon(d.ikon)}<figcaption>${esc(g)}</figcaption></figure></li>`).join("")),
  "biz-paket": R((d, cfg) =>
    d.paket
      .map(
        (p, i) =>
          `<article class="plan card${p.unggulan ? " hot" : ""}" data-rv style="--d:${i * 0.08}s">${p.unggulan ? `<span class="badge">Paling dipilih</span>` : ""}<h3>${esc(p.nama)}</h3><p class="amount"><span>${p.harga > 0 ? rupiah(p.harga) : esc(cap(p.satuan || "Hubungi kami"))}</span>${p.harga > 0 ? ` <small>${esc(p.satuan)}</small>` : ""}</p><p>${esc(p.ringkasan)}</p><ul>${p.fitur.map((f) => `<li>${esc(f)}</li>`).join("")}</ul><a class="btn${p.unggulan ? "" : " ghost"}" href="${esc(wa(cfg, `Halo, saya tertarik ${p.nama}.`))}" target="_blank" rel="noopener" data-plan>Pilih ${esc(p.nama)}</a></article>`,
      )
      .join(""),
  ),
  "biz-jam": R((d) => d.jam.map((j) => `<tr><td>${esc(j.hari)}</td><td>${esc(j.jam)}</td></tr>`).join("")),
  "biz-jam-kaki": R((d) => d.jam.slice(0, 3).map((j) => `<li>${esc(j.hari)}: ${esc(j.jam)}</li>`).join("")),
  "biz-faq": R((d) => d.faq.map((f, i) => `<details class="card" data-rv${i === 0 ? " open" : ""}><summary>${esc(f.tanya)}</summary><p>${esc(f.jawab)}</p></details>`).join("")),
  "biz-pilihan": R((d) => [...d.paket.map((p) => p.nama), ...d.kategori, "Lainnya"].filter(Boolean).map((o) => `<option>${esc(o)}</option>`).join("")),
};

/** Bungkus HTML awal sebuah wilayah dengan penanda agar editor bisa membangunnya ulang. */
export const bizRegion = (name: string, data: Record<string, unknown>) => `<!--owd:render name="${name}"-->${BIZ_REGIONS[name](data, {})}<!--owd:end-->`;
