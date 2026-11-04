import { asset } from "../assets";
import { badge, col, el, eyebrow, grid, heading, image, inline, linkButton, page, para, section, siteFooter, siteHeader, stack, button, type Palette } from "../build";
import type { TemplateContent, Tr } from "../types";

/* Company Profile — FREE: business consultant, 3 pages (Home, About, Contact). */

const P: Palette = { ink: "#0f172a", muted: "#475569", primary: "#1d4ed8", primaryDark: "#1e3a8a", soft: "#eff6ff", line: "#e2e8f0" };
const BRAND = "Nusantara Consulting";

const footer = (tr: Tr) =>
  siteFooter(
    BRAND,
    tr("Mitra strategi dan operasional untuk UMKM dan perusahaan yang sedang bertumbuh.", "Strategy and operations partner for growing small businesses and companies."),
    [
      { title: tr("Layanan", "Services"), items: [tr("Strategi bisnis", "Business strategy"), tr("Transformasi digital", "Digital transformation"), tr("Keuangan & pajak", "Finance & tax")] },
      { title: tr("Kontak", "Contact"), items: ["halo@nusantara.example", "+62 21 555 0123", "Jakarta, Indonesia"] },
    ],
    tr("© 2026 Nusantara Consulting. Seluruh hak cipta dilindungi.", "© 2026 Nusantara Consulting. All rights reserved."),
  );

const serviceCard = (title: string, text: string, tag: string) =>
  col([badge(tag, P.soft, P.primary, "#bfdbfe"), heading(title, "h3", { size: 20 }), para(text, { size: 15 })], {
    card: { bg: "#ffffff", border: P.line, radius: 16, padding: 28 },
    gap: 12,
    name: "Kartu layanan",
  });

const stat = (value: string, label: string) =>
  col([heading(value, "h3", { size: 34, color: P.primary, align: "center" }), para(label, { size: 14, align: "center" })], { gap: 4, align: "center", name: "Statistik" });

function home(tr: Tr, href: (k: string) => string) {
  return page([
    siteHeader(BRAND, P, linkButton(tr("Konsultasi gratis", "Free consultation"), href("contact"), "primary", P)),
    section(
      "Hero",
      [
        grid(
          [
            col(
              [
                eyebrow(tr("Konsultan bisnis terpercaya", "Trusted business consultants"), P.primary),
                heading(tr("Tumbuhkan bisnis Anda dengan strategi yang terukur", "Grow your business with measurable strategy"), "h1"),
                para(
                  tr(
                    "Kami membantu UMKM dan perusahaan menyusun strategi, merapikan operasional, dan mengambil keputusan berbasis data.",
                    "We help small businesses and companies shape strategy, streamline operations, and make data-driven decisions.",
                  ),
                  { size: 18 },
                ),
                inline([linkButton(tr("Jadwalkan konsultasi", "Book a consultation"), href("contact"), "primary", P), linkButton(tr("Tentang kami", "About us"), href("about"), "outline", P)]),
              ],
              { gap: 20, name: "Teks hero" },
            ),
            col([image(asset("hero-office"), tr("Ilustrasi dasbor bisnis", "Business dashboard illustration"), { ratio: "4 / 3", radius: 24 })], { name: "Gambar hero" }),
          ],
          2,
          { gap: 48, align: "center" },
        ),
      ],
      { bg: "#f8fafc", padY: 88 },
    ),
    section("Statistik", [grid([stat("250+", tr("Klien dibantu", "Clients served")), stat("12", tr("Tahun pengalaman", "Years of experience")), stat("98%", tr("Klien puas", "Client satisfaction")), stat("15", tr("Konsultan ahli", "Expert consultants"))], 4, { gap: 24 })], { padY: 48 }),
    section(
      "Layanan",
      [
        stack([eyebrow(tr("Layanan kami", "Our services"), P.primary, "center"), heading(tr("Solusi lengkap untuk setiap tahap bisnis", "Complete solutions for every business stage"), "h2", { align: "center" })], { gap: 8, align: "stretch" }),
        grid(
          [
            serviceCard(tr("Strategi bisnis", "Business strategy"), tr("Riset pasar, model bisnis, dan peta jalan pertumbuhan yang realistis.", "Market research, business models, and a realistic growth roadmap."), tr("Strategi", "Strategy")),
            serviceCard(tr("Transformasi digital", "Digital transformation"), tr("Pilih dan terapkan sistem yang tepat agar tim bekerja lebih efisien.", "Pick and implement the right systems so your team works efficiently."), tr("Teknologi", "Technology")),
            serviceCard(tr("Keuangan & pajak", "Finance & tax"), tr("Laporan keuangan rapi, perencanaan arus kas, dan kepatuhan pajak.", "Clean financial reports, cash-flow planning, and tax compliance."), tr("Keuangan", "Finance")),
          ],
          3,
          { gap: 24, align: "stretch" },
        ),
      ],
      { bg: "#f8fafc" },
    ),
    section(
      "Keunggulan",
      [
        grid(
          [
            col([image(asset("workspace"), tr("Ruang kerja tim", "Team workspace"), { ratio: "10 / 7", radius: 20 })], { name: "Gambar" }),
            col(
              [
                eyebrow(tr("Kenapa memilih kami", "Why choose us"), P.primary),
                heading(tr("Pendampingan dari strategi sampai eksekusi", "Guidance from strategy to execution"), "h2"),
                el("list", {
                  items: [
                    tr("Tim berpengalaman di berbagai industri", "Experienced team across industries"),
                    tr("Laporan progres mingguan yang transparan", "Transparent weekly progress reports"),
                    tr("Biaya jelas sejak awal, tanpa biaya tersembunyi", "Clear pricing upfront, no hidden fees"),
                    tr("Dukungan setelah proyek selesai", "Support after the project ends"),
                  ],
                  markerColor: P.primary,
                  shadowEnabled: false,
                  borderColor: P.line,
                  fontSize: 15,
                }),
              ],
              { gap: 16, name: "Teks" },
            ),
          ],
          2,
          { gap: 48, align: "center" },
        ),
      ],
      { padY: 80 },
    ),
    section(
      "Ajakan",
      [
        stack(
          [
            heading(tr("Siap membawa bisnis Anda ke tahap berikutnya?", "Ready to take your business to the next level?"), "h2", { color: "#ffffff", align: "center" }),
            para(tr("Konsultasi pertama 30 menit tanpa biaya.", "Your first 30-minute consultation is free."), { color: "#dbeafe", align: "center", size: 18 }),
            linkButton(tr("Hubungi kami", "Contact us"), href("contact"), "light", P),
          ],
          { gap: 16, align: "center" },
        ),
      ],
      { gradient: ["#1e3a8a", "#2563eb", 120], padY: 72, width: 820 },
    ),
    footer(tr),
  ]);
}

function about(tr: Tr, href: (k: string) => string) {
  const member = (img: string, name: string, role: string) =>
    col([image(asset(img), name, { ratio: "1 / 1", radius: 999 }), heading(name, "h3", { size: 18, align: "center" }), para(role, { size: 14, align: "center" })], { gap: 8, align: "center", name: "Anggota tim" });
  const value = (title: string, text: string) => col([heading(title, "h3", { size: 18 }), para(text, { size: 15 })], { card: { bg: "#ffffff", border: P.line, padding: 24 }, gap: 8, name: "Nilai" });
  return page([
    siteHeader(BRAND, P, linkButton(tr("Konsultasi gratis", "Free consultation"), href("contact"), "primary", P)),
    section(
      "Pembuka",
      [
        stack(
          [
            eyebrow(tr("Tentang kami", "About us"), P.primary, "center"),
            heading(tr("Kami percaya bisnis yang sehat dimulai dari keputusan yang jelas", "We believe healthy businesses start with clear decisions"), "h1", { align: "center", size: 40 }),
            para(
              tr(
                "Didirikan pada 2014, Nusantara Consulting telah mendampingi ratusan bisnis di Indonesia — dari kedai keluarga sampai perusahaan dengan ratusan karyawan.",
                "Founded in 2014, Nusantara Consulting has guided hundreds of businesses in Indonesia, from family shops to companies with hundreds of employees.",
              ),
              { align: "center", size: 18 },
            ),
          ],
          { gap: 16, align: "stretch" },
        ),
      ],
      { bg: "#f8fafc", padY: 88, width: 860 },
    ),
    section(
      "Nilai",
      [
            stack([heading(tr("Nilai yang kami pegang", "Our values"), "h2", { align: "center" })], { align: "stretch" }),
            grid(
              [
                value(tr("Jujur", "Honest"), tr("Rekomendasi kami selalu berdasarkan data, bukan sekadar menyenangkan klien.", "Our recommendations are always data-based, not just what clients want to hear.")),
                value(tr("Praktis", "Practical"), tr("Setiap saran harus bisa dijalankan oleh tim Anda dengan sumber daya yang ada.", "Every recommendation must be doable by your team with existing resources.")),
                value(tr("Bertanggung jawab", "Accountable"), tr("Kami mengukur hasil bersama dan terbuka soal kemajuan.", "We measure results together and stay open about progress.")),
              ],
              3,
              { gap: 24, align: "stretch" },
            ),
      ],
    ),
    section(
      "Tim",
      [
        stack([heading(tr("Tim inti", "Core team"), "h2", { align: "center" })], { align: "stretch" }),
        grid(
          [
            member("team-1", "Rina Pratiwi", tr("Managing Partner", "Managing Partner")),
            member("team-2", "Bagus Santoso", tr("Kepala Transformasi Digital", "Head of Digital Transformation")),
            member("team-3", "Dewi Lestari", tr("Konsultan Keuangan", "Finance Consultant")),
          ],
          3,
          { gap: 32, align: "start" },
        ),
      ],
      { bg: "#f8fafc" },
    ),
    footer(tr),
  ]);
}

function contact(tr: Tr) {
  const info = (label: string, value: string) => col([para(label, { size: 13, weight: 700, color: P.primary }), para(value, { size: 16, color: P.ink })], { gap: 2, name: "Info kontak" });
  return page([
    siteHeader(BRAND, P),
    section(
      "Kontak",
      [
        grid(
          [
            col(
              [
                eyebrow(tr("Kontak", "Contact"), P.primary),
                heading(tr("Ceritakan kebutuhan bisnis Anda", "Tell us about your business needs"), "h1", { size: 38 }),
                para(tr("Tim kami membalas dalam 1 hari kerja.", "Our team replies within 1 business day."), { size: 17 }),
                info(tr("Alamat", "Address"), "Jl. Sudirman No. 1, Jakarta"),
                info("Email", "halo@nusantara.example"),
                info(tr("Telepon", "Phone"), "+62 21 555 0123"),
              ],
              { gap: 16, name: "Info" },
            ),
            col(
              [
                el("input", { labelText: tr("Nama lengkap", "Full name"), text: tr("Nama Anda", "Your name"), inputType: "text" }, "Input nama"),
                el("input", { labelText: "Email", text: "nama@perusahaan.com", inputType: "email" }, "Input email"),
                el("select", { labelText: tr("Topik", "Topic"), placeholder: tr("Pilih topik", "Choose a topic"), options: [tr("Strategi bisnis", "Business strategy"), tr("Transformasi digital", "Digital transformation"), tr("Keuangan & pajak", "Finance & tax")], widthMode: "full" }, "Pilih topik"),
                el("input", { labelText: tr("Pesan", "Message"), text: tr("Tulis pesan singkat", "Write a short message"), inputType: "text" }, "Input pesan"),
                button(tr("Kirim pesan", "Send message"), P, { full: true, type: "submit" }),
                para(tr("Catatan: formulir contoh. Hubungkan ke layanan formulir atau backend Anda sebelum dipakai.", "Note: sample form. Connect it to your form service or backend before going live."), { size: 12, color: "#94a3b8" }),
              ],
              { card: { bg: "#ffffff", border: P.line, radius: 20, padding: 28 }, gap: 14, name: "Formulir" },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { bg: "#f8fafc", padY: 80 },
    ),
    section(
      "FAQ",
      [
        stack([heading(tr("Pertanyaan umum", "Frequently asked questions"), "h2", { align: "center" })], { align: "stretch" }),
        stack(
          [
            el("accordion", {
              widthMode: "full",
              openTextColor: P.primary,
              items: [
                { title: tr("Berapa lama satu proyek konsultasi?", "How long does a consulting project take?"), content: tr("Umumnya 4–12 minggu, tergantung ruang lingkup.", "Usually 4 to 12 weeks, depending on scope.") },
                { title: tr("Apakah melayani di luar Jakarta?", "Do you work outside Jakarta?"), content: tr("Ya, kami bekerja hibrida dan melayani klien di seluruh Indonesia.", "Yes, we work hybrid and serve clients across Indonesia.") },
                { title: tr("Bagaimana sistem biayanya?", "How is pricing structured?"), content: tr("Biaya tetap per proyek yang disepakati di awal.", "A fixed project fee agreed upfront.") },
              ],
            }),
          ],
          { align: "stretch" },
        ),
      ],
      { width: 820 },
    ),
    footer(tr),
  ]);
}

export const companyStarter: TemplateContent = {
  brand: BRAND,
  pages: [
    { key: "home", slug: { id: "beranda", en: "home" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "about", slug: { id: "tentang", en: "about" }, name: { id: "Tentang", en: "About" } },
    { key: "contact", slug: { id: "kontak", en: "contact" }, name: { id: "Kontak", en: "Contact" } },
  ],
  build: (key, tr, href) => (key === "about" ? about(tr, href) : key === "contact" ? contact(tr) : home(tr, href)),
};
