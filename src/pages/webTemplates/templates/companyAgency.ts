import { asset } from "../assets";
import { badge, button, col, el, eyebrow, grid, heading, image, inline, linkButton, page, para, section, siteFooter, siteHeader, stack, type Palette } from "../build";
import type { TemplateContent, Tr } from "../types";

/* Landing Page / Company Profile — PREMIUM: digital agency, 3 pages. */

const P: Palette = { ink: "#0f172a", muted: "#475569", primary: "#4f46e5", primaryDark: "#3730a3", soft: "#eef2ff", line: "#e0e7ff" };
const BRAND = "Arunika Digital";

const footer = (tr: Tr) =>
  siteFooter(
    BRAND,
    tr("Studio produk digital: strategi, desain, dan pengembangan web & aplikasi.", "Digital product studio: strategy, design, and web & app development."),
    [
      { title: tr("Studio", "Studio"), items: [tr("Layanan", "Services"), tr("Portofolio", "Portfolio"), tr("Karier", "Careers")] },
      { title: tr("Sosial", "Social"), items: ["Instagram", "LinkedIn", "Dribbble"] },
      { title: tr("Kontak", "Contact"), items: ["hello@arunika.example", "+62 812 0000 1234"] },
    ],
    tr("© 2026 Arunika Digital. Dibuat dengan OneWebDev.", "© 2026 Arunika Digital. Built with OneWebDev."),
    "#0b1023",
  );

const step = (n: string, title: string, text: string) =>
  col([heading(n, "h3", { size: 28, color: P.primary }), heading(title, "h3", { size: 18 }), para(text, { size: 14 })], { gap: 6, name: "Langkah" });

const quote = (text: string, who: string, role: string, img: string) =>
  col(
    [
      para(`“${text}”`, { size: 17, color: P.ink }),
      col([image(asset(img), who, { ratio: "1 / 1", radius: 999 })], { name: "Foto", width: 56 }),
      col([para(who, { weight: 700, color: P.ink, size: 15 }), para(role, { size: 13 })], { gap: 0, name: "Nama" }),
    ],
    { card: { bg: "#ffffff", border: P.line, radius: 20, padding: 28 }, gap: 18, name: "Testimoni" },
  );

const plan = (tr: Tr, href: (k: string) => string, name: string, price: string, items: string[], featured = false) =>
  col(
    [
      ...(featured ? [badge(tr("Paling populer", "Most popular"), P.primary, "#ffffff")] : []),
      heading(name, "h3", { size: 20, color: featured ? "#ffffff" : P.ink }),
      heading(price, "h2", { size: 34, color: featured ? "#ffffff" : P.ink }),
      el("list", {
        items,
        markerColor: featured ? "#a5b4fc" : P.primary,
        bgColor: "transparent",
        borderWidth: 0,
        borderStyle: "none",
        shadowEnabled: false,
        dividerEnabled: false,
        itemHoverEnabled: false,
        textColor: featured ? "#e0e7ff" : "#475569",
        paddingLeft: 0,
        paddingRight: 0,
      }),
      linkButton(tr("Diskusikan proyek", "Discuss a project"), href("contact"), featured ? "light" : "outline", P, { full: true }),
    ],
    { card: { bg: featured ? "#1e1b4b" : "#ffffff", border: featured ? undefined : P.line, radius: 20, padding: 28 }, gap: 14, name: "Paket" },
  );

function home(tr: Tr, href: (k: string) => string) {
  return page([
    siteHeader(BRAND, P, linkButton(tr("Mulai proyek", "Start a project"), href("contact"), "primary", P)),
    section(
      "Hero",
      [
        grid(
          [
            col(
              [
                badge(tr("Studio produk digital", "Digital product studio"), "#312e81", "#c7d2fe", "#4338ca"),
                heading(tr("Kami merancang produk digital yang disukai pengguna", "We design digital products people love"), "h1", { color: "#ffffff", size: 48 }),
                para(tr("Dari riset hingga peluncuran: website, aplikasi, dan sistem desain yang membantu bisnis Anda tumbuh.", "From research to launch: websites, apps, and design systems that help your business grow."), { color: "#c7d2fe", size: 18 }),
                inline([linkButton(tr("Lihat layanan", "See services"), href("services"), "light", P), linkButton(tr("Hubungi kami", "Contact us"), href("contact"), "primary", P)]),
              ],
              { gap: 20, name: "Teks hero" },
            ),
            col([image(asset("hero-agency"), tr("Ilustrasi aplikasi", "App illustration"), { ratio: "5 / 4", radius: 28 })], { name: "Gambar hero" }),
          ],
          "minmax(0, 1.1fr) minmax(0, 1fr)",
          { gap: 48, align: "center" },
        ),
      ],
      { gradient: ["#0b1023", "#1e1b4b", 160], padY: 104 },
    ),
    section(
      "Layanan",
      [
        stack([eyebrow(tr("Yang kami kerjakan", "What we do"), P.primary, "center"), heading(tr("Satu tim untuk seluruh perjalanan produk", "One team for the whole product journey"), "h2", { align: "center" })], { gap: 8, align: "stretch" }),
        grid(
          [
            col([heading("UI/UX", "h3", { size: 20 }), para(tr("Riset pengguna, wireframe, prototipe, dan desain antarmuka yang konsisten.", "User research, wireframes, prototypes, and consistent interface design."), { size: 15 })], { card: { bg: P.soft, radius: 18, padding: 28 }, gap: 10, name: "Layanan" }),
            col([heading(tr("Pengembangan web", "Web development"), "h3", { size: 20 }), para(tr("Website cepat dan aman dengan framework modern dan SEO yang rapi.", "Fast, secure websites with modern frameworks and clean SEO."), { size: 15 })], { card: { bg: P.soft, radius: 18, padding: 28 }, gap: 10, name: "Layanan" }),
            col([heading(tr("Aplikasi mobile", "Mobile apps"), "h3", { size: 20 }), para(tr("Aplikasi iOS dan Android dari satu basis kode, siap rilis ke toko aplikasi.", "iOS and Android apps from one codebase, ready for the app stores."), { size: 15 })], { card: { bg: P.soft, radius: 18, padding: 28 }, gap: 10, name: "Layanan" }),
          ],
          3,
          { gap: 24, align: "stretch" },
        ),
      ],
      { padY: 88 },
    ),
    section(
      "Proses",
      [
        stack([heading(tr("Proses kerja yang transparan", "A transparent process"), "h2", { align: "center" })], { align: "stretch" }),
        grid(
          [
            step("01", tr("Temukan", "Discover"), tr("Workshop untuk memahami tujuan, pengguna, dan batasan.", "Workshops to understand goals, users, and constraints.")),
            step("02", tr("Rancang", "Design"), tr("Prototipe yang bisa diuji sebelum menulis kode.", "Testable prototypes before writing code.")),
            step("03", tr("Bangun", "Build"), tr("Sprint dua mingguan dengan demo rutin.", "Two-week sprints with regular demos.")),
            step("04", tr("Luncurkan", "Launch"), tr("Rilis, pantau, dan iterasi berdasarkan data.", "Ship, monitor, and iterate on data.")),
          ],
          4,
          { gap: 28 },
        ),
      ],
      { bg: "#f8fafc" },
    ),
    section(
      "Testimoni",
      [
        stack([eyebrow(tr("Testimoni", "Testimonials"), P.primary, "center"), heading(tr("Dipercaya startup hingga korporasi", "Trusted by startups and enterprises"), "h2", { align: "center" })], { gap: 8, align: "stretch" }),
        grid(
          [
            quote(tr("Peluncuran aplikasi kami tepat waktu dan rating toko aplikasinya naik ke 4,8.", "Our app launched on time and its store rating climbed to 4.8."), "Andi Wijaya", "CEO, Kopiku", "team-2"),
            quote(tr("Desain sistemnya membuat tim internal kami jauh lebih cepat membangun fitur.", "The design system made our in-house team ship features much faster."), "Sari Utami", tr("Head of Product, Finly", "Head of Product, Finly"), "team-3"),
          ],
          2,
          { gap: 24, align: "stretch" },
        ),
      ],
    ),
    section(
      "Harga",
      [
        stack([heading(tr("Paket kerja sama", "Engagement plans"), "h2", { align: "center" }), para(tr("Harga ilustrasi — sesuaikan dengan penawaran Anda.", "Illustrative pricing; adjust to your own offer."), { align: "center", size: 14 })], { gap: 6, align: "stretch" }),
        grid(
          [
            plan(tr, href, tr("Landing page", "Landing page"), "Rp15 jt", [tr("1 halaman responsif", "1 responsive page"), tr("Copywriting dasar", "Basic copywriting"), tr("Selesai 2 minggu", "Done in 2 weeks")]),
            plan(tr, href, tr("Website bisnis", "Business website"), "Rp45 jt", [tr("Hingga 8 halaman", "Up to 8 pages"), "CMS", tr("SEO teknis", "Technical SEO"), tr("Dukungan 3 bulan", "3 months of support")], true),
            plan(tr, href, tr("Produk digital", "Digital product"), tr("Kustom", "Custom"), [tr("Web/mobile app", "Web/mobile app"), tr("Tim khusus", "Dedicated team"), tr("Sprint berkelanjutan", "Ongoing sprints")]),
          ],
          3,
          { gap: 24, align: "stretch" },
        ),
      ],
      { bg: "#f8fafc" },
    ),
    section(
      "Ajakan",
      [
        stack(
          [
            heading(tr("Punya ide produk? Ayo wujudkan.", "Have a product idea? Let's build it."), "h2", { color: "#ffffff", align: "center" }),
            linkButton(tr("Jadwalkan panggilan", "Book a call"), href("contact"), "light", P),
          ],
          { gap: 20, align: "center" },
        ),
      ],
      { gradient: ["#4f46e5", "#06b6d4", 120], padY: 80, width: 820 },
    ),
    footer(tr),
  ]);
}

function services(tr: Tr, href: (k: string) => string) {
  const block = (title: string, text: string, points: string[], img: string, flip: boolean) =>
    section(
      title,
      [
        grid(
          (() => {
            const textCol = col(
              [
                heading(title, "h2", { size: 30 }),
                para(text, { size: 16 }),
                el("list", { items: points, markerColor: P.primary, shadowEnabled: false, borderColor: P.line, fontSize: 15 }),
              ],
              { gap: 14, name: "Teks" },
            );
            const imgCol = col([image(asset(img), title, { ratio: "5 / 4", radius: 24 })], { name: "Gambar" });
            return flip ? [imgCol, textCol] : [textCol, imgCol];
          })(),
          2,
          { gap: 48, align: "center" },
        ),
      ],
      { bg: flip ? "#f8fafc" : "#ffffff", padY: 80 },
    );
  return page([
    siteHeader(BRAND, P, linkButton(tr("Mulai proyek", "Start a project"), href("contact"), "primary", P)),
    section(
      "Pembuka",
      [
        stack(
          [
            badge(tr("Layanan", "Services"), "#312e81", "#c7d2fe", "#4338ca"),
            heading(tr("Layanan lengkap dari ide sampai rilis", "End-to-end services from idea to release"), "h1", { color: "#ffffff", align: "center", size: 42 }),
            para(tr("Pilih satu layanan atau gabungkan semuanya dalam satu tim.", "Pick one service or combine them all in one team."), { color: "#c7d2fe", align: "center", size: 18 }),
          ],
          { gap: 16, align: "center" },
        ),
      ],
      { gradient: ["#0b1023", "#1e1b4b", 160], padY: 88, width: 820 },
    ),
    block(
      tr("Desain UI/UX", "UI/UX design"),
      tr("Kami memulai dari masalah pengguna, lalu merancang alur dan antarmuka yang mudah dipakai.", "We start from user problems, then design flows and interfaces that are easy to use."),
      [tr("Riset & wawancara pengguna", "User research & interviews"), tr("Prototipe interaktif", "Interactive prototypes"), tr("Sistem desain", "Design systems")],
      "hero-agency",
      false,
    ),
    block(
      tr("Pengembangan web", "Web development"),
      tr("Website dan aplikasi web yang cepat, aman, dan mudah dikelola tim Anda.", "Fast, secure web apps and websites your team can manage."),
      [tr("Performa & Core Web Vitals", "Performance & Core Web Vitals"), tr("Integrasi API & CMS", "API & CMS integrations"), tr("Aksesibilitas", "Accessibility")],
      "workspace",
      true,
    ),
    block(
      tr("Konsultasi produk", "Product consulting"),
      tr("Bantu menentukan prioritas fitur, metrik, dan peta jalan rilis.", "Help prioritize features, metrics, and the release roadmap."),
      [tr("Workshop strategi", "Strategy workshops"), tr("Analitik produk", "Product analytics"), tr("Pendampingan tim", "Team coaching")],
      "hero-office",
      false,
    ),
    footer(tr),
  ]);
}

function contact(tr: Tr) {
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
                heading(tr("Mari diskusikan proyek Anda", "Let's talk about your project"), "h1", { size: 40 }),
                para(tr("Ceritakan tujuan dan tenggat Anda. Kami akan membalas dengan estimasi awal dalam 2 hari kerja.", "Tell us your goals and timeline. We'll reply with an initial estimate within 2 business days."), { size: 17 }),
                col([para("hello@arunika.example", { weight: 700, color: P.ink }), para("+62 812 0000 1234", { color: P.ink }), para("Bandung, Indonesia")], { gap: 4, card: { bg: P.soft, radius: 16, padding: 20 }, name: "Info" }),
              ],
              { gap: 18, name: "Info" },
            ),
            col(
              [
                el("input", { labelText: tr("Nama", "Name"), text: tr("Nama Anda", "Your name") }, "Input nama"),
                el("input", { labelText: "Email", text: "nama@perusahaan.com", inputType: "email" }, "Input email"),
                el("select", { labelText: tr("Anggaran", "Budget"), placeholder: tr("Pilih kisaran", "Choose a range"), options: ["< Rp25 jt", "Rp25–75 jt", "> Rp75 jt"], widthMode: "full" }, "Pilih anggaran"),
                el("input", { labelText: tr("Ceritakan proyeknya", "Describe the project"), text: tr("Tujuan, fitur utama, tenggat…", "Goals, key features, deadline…") }, "Input pesan"),
                button(tr("Kirim", "Send"), P, { full: true, type: "submit" }),
                para(tr("Formulir contoh: hubungkan ke layanan formulir atau backend Anda.", "Sample form: connect it to your form service or backend."), { size: 12, color: "#94a3b8" }),
              ],
              { card: { bg: "#ffffff", border: P.line, radius: 20, padding: 28 }, gap: 14, name: "Formulir" },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { bg: "#f8fafc", padY: 88 },
    ),
    footer(tr),
  ]);
}

export const companyAgency: TemplateContent = {
  brand: BRAND,
  pages: [
    { key: "home", slug: { id: "beranda", en: "home" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "services", slug: { id: "layanan", en: "services" }, name: { id: "Layanan", en: "Services" } },
    { key: "contact", slug: { id: "kontak", en: "contact" }, name: { id: "Kontak", en: "Contact" } },
  ],
  build: (key, tr, href) => (key === "services" ? services(tr, href) : key === "contact" ? contact(tr) : home(tr, href)),
};
