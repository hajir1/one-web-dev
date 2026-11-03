import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CODE_TEMPLATE_CATALOG, codeTemplateReadme, withThumbFlag } from "../catalog";
import { applyEdits, readModel } from "../editModel";
import { FOLIO_REGIONS } from "../render/folioRender";
import { MOTION_REGIONS, motionApi } from "../render/motionRender";
import { createCodeSiteDoc, normalizeCodeSite, regionsFor, renderCodeSite } from "../codeSite";
import { TEMPLATE_CATEGORIES } from "../../../../config/templates";
import { ANIM_SPECS, buildAnim } from "../../../../tools/codeTemplates/anim";
import { INVITE_SPECS, buildInvite } from "../../../../tools/codeTemplates/invite";
import { WEB3D_SPECS, buildWeb3D } from "../../../../tools/codeTemplates/web3d";
import { FOLIO_SPECS, buildFolio } from "../../../../tools/codeTemplates/folio";
import { MOTION_SPECS, buildMotion } from "../../../../tools/codeTemplates/motion3d";
import { STORY_SPECS } from "../../../../tools/codeTemplates/storyAll";
import { buildStory, flatKeys } from "../../../../tools/codeTemplates/story3d";
import { ANIM2_SPECS } from "../../../../tools/codeTemplates/anim2All";
import { buildAnim2 } from "../../../../tools/codeTemplates/anim2";
import { INVITE_SPECS_V22 } from "../../../../tools/codeTemplates/inviteV22";
import { INVITE_SPECS_V23 } from "../../../../tools/codeTemplates/inviteV23";
import { ANIM2_SPECS_C } from "../../../../tools/codeTemplates/anim2SpecsC";
import { LANDING_SPECS } from "../../../../tools/codeTemplates/landingAll";
import { buildLanding } from "../../../../tools/codeTemplates/landing";
import { BIZ_SPECS } from "../../../../tools/codeTemplates/bizAll";
import { buildBiz } from "../../../../tools/codeTemplates/biz3d";
import { STORY_OF } from "../../../../tools/codeTemplates/bizStory";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../files");
const read = (id: string) => readFileSync(join(dir, `${id}.html`), "utf8");
const kb = (s: string) => Buffer.byteLength(s) / 1024;
const scriptBlocks = (html: string) => [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");
const visibleText = (html: string) => html.replace(/<script\b[\s\S]*?<\/script>/g, "").replace(/<style\b[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
const ALLOWED_HOSTS = ["https://cdn.jsdelivr.net/npm/", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://fonts.gstatic.com"];

const dataOf = (html: string, name: string) => readModel(html).data.find((d) => d.name === name)?.value;

test("katalog: 237 template (v16: 12, v17: +10, v18: +15, v22: +50, v23: +150), id unik, kategori dikenal", () => {
  assert.equal(CODE_TEMPLATE_CATALOG.length, 237);
  assert.equal(new Set(CODE_TEMPLATE_CATALOG.map((t) => t.id)).size, 237);
  const per: Record<string, number> = { animation: 27, invitation: 35, web3d: 5, portfolio3d: 5, motion3d: 25, landing: 100, biz3d: 40 };
  for (const [g, n] of Object.entries(per)) assert.equal(CODE_TEMPLATE_CATALOG.filter((t) => t.code.group === g).length, n, g);
  for (const t of CODE_TEMPLATE_CATALOG) assert.ok(TEMPLATE_CATEGORIES.includes(t.category), `${t.id}: kategori ${t.category}`);
});

test("berkas hasil generator sama dengan sumbernya (jalankan npm run gen:code bila gagal)", () => {
  const built: [string, string][] = [
    ...ANIM_SPECS.map((s) => [s.id, buildAnim(s)] as [string, string]),
    ...INVITE_SPECS.map((s) => [s.id, buildInvite(s)] as [string, string]),
    ...WEB3D_SPECS.map((s) => [s.id, buildWeb3D(s)] as [string, string]),
    ...FOLIO_SPECS.map((s) => [s.id, buildFolio(s)] as [string, string]),
    ...MOTION_SPECS.map((s) => [s.id, buildMotion(s)] as [string, string]),
    ...STORY_SPECS.map((s) => [s.id, buildStory(s)] as [string, string]),
    ...ANIM2_SPECS.map((s) => [s.id, buildAnim2(s)] as [string, string]),
    ...LANDING_SPECS.map((s) => [s.id, buildLanding(s)] as [string, string]),
    ...BIZ_SPECS.map((s) => [s.id, buildBiz(s)] as [string, string]),
  ];
  assert.deepEqual(built.map(([id]) => id).sort(), CODE_TEMPLATE_CATALOG.map((t) => t.id).sort());
  for (const [id, html] of built) assert.equal(read(id), html, id);
});

test("Vercel Web Analytics di semua template, tidak aktif di pratinjau/berkas lokal (v19)", () => {
  for (const t of CODE_TEMPLATE_CATALOG) {
    const html = read(t.id);
    assert.equal((html.match(/\/_vercel\/insights\/script\.js/g) ?? []).length, 1, t.id);
    assert.match(html, /!\/\^https\?:\$\/\.test\(location\.protocol\) \|\| window\.top !== window\.self/, t.id);
  }
});

test("v21: undangan punya tanggal hitung mundur sendiri (awal = acara pertama), dipakai hitung mundur", () => {
  for (const t of CODE_TEMPLATE_CATALOG.filter((x) => x.code.group === "invitation")) {
    const html = read(t.id);
    const cfg = dataOf(html, "CONFIG") as { tanggalHitungMundur: string; acara: { mulai: string }[] };
    assert.equal(cfg.tanggalHitungMundur, cfg.acara[0].mulai, t.id);
    assert.match(html, /var target = new Date\(countDate\)\.getTime\(\);/, t.id);
  }
});

test("batas ukuran per kelompok terpenuhi", () => {
  for (const t of CODE_TEMPLATE_CATALOG) assert.ok(kb(read(t.id)) < t.code.budgetKb, `${t.id}: ${kb(read(t.id)).toFixed(1)} KB ≥ ${t.code.budgetKb} KB`);
});

test("hanya library yang diizinkan, versi dipatok", () => {
  for (const t of CODE_TEMPLATE_CATALOG) {
    const html = read(t.id);
    const urls = [...html.matchAll(/(?:src|href)="(https:\/\/[^"]+)"/g)].map((m) => m[1]).filter((u) => !u.startsWith("https://www.google.com/maps") && !u.startsWith("https://wa.me/") && !u.startsWith("https://example.com/"));
    const mods = [...html.matchAll(/"(https:\/\/cdn\.jsdelivr\.net\/npm\/[^"]+)"/g)].map((m) => m[1]);
    for (const u of [...urls, ...mods]) assert.ok(ALLOWED_HOSTS.some((h) => u.startsWith(h)), `${t.id}: ${u}`);
    const libPaths = [...html.matchAll(/(?:esm|umd)\("([^"]+)"\)/g)].map((m) => "https://cdn.jsdelivr.net/npm/" + m[1]);
    mods.push(...libPaths);
    for (const u of [...urls, ...mods].filter((x) => x.includes("/npm/"))) assert.match(u, /\/npm\/[a-z-]+@\d+\.\d+\.\d+\//, `${t.id}: versi tidak dipatok ${u}`);
    const pkgs = new Set([...urls, ...mods].filter((x) => x.includes("/npm/")).map((u) => /\/npm\/([a-z-]+)@/.exec(u)![1]));
    const allowed: Record<string, string[]> = { animation: [], invitation: ["aos", "swiper", "canvas-confetti"], web3d: ["three", "lenis"], portfolio3d: ["three", "lenis"], motion3d: ["three", "lenis", "motion"], landing: [], biz3d: ["three", "lenis", "motion"] };
    for (const p of pkgs) assert.ok(allowed[t.code.group].includes(p), `${t.id}: library ${p} tidak diizinkan`);
  }
});

const OLD_ANIM_IDS = new Set(ANIM_SPECS.map((s) => s.id));
test("animasi: SVG berlapis, keyframes, cahaya tanpa filter blur (v19), canvas maks 60, variabel CSS", () => {
  for (const t of CODE_TEMPLATE_CATALOG.filter((x) => x.code.group === "animation" && OLD_ANIM_IDS.has(x.id))) {
    const html = read(t.id);
    assert.ok((html.match(/class="px/g) ?? []).length >= 6, `${t.id}: lapisan`);
    assert.match(html, /@keyframes sway/);
    // v19: filter blur di lapisan yang berayun dihitung ulang tiap frame (FPS turun ke ~25); cahaya = gradasi radial.
    assert.doesNotMatch(html, /feGaussianBlur|filter="url\(/);
    assert.match(html, /<radialGradient id="halo">/);
    assert.match(html, /class="halo"/);
    assert.match(html, /<canvas id="flies"/);
    assert.match(html, /Math\.min\(60,/);
    assert.equal((dataOf(html, "CONFIG") as { parallaxOnMobile: boolean }).parallaxOnMobile, false);
    for (const v of ["--flower:", "--glow:", "--speed:"]) assert.ok(html.includes(v), `${t.id}: ${v}`);
  }
});

test("undangan: CONFIG di awal skrip, ?to=, musik tidak otomatis, .ics, salin, WhatsApp, peta tanpa API key", () => {
  for (const t of CODE_TEMPLATE_CATALOG.filter((x) => x.code.group === "invitation")) {
    const html = read(t.id);
    const inline = /<script>\s*\/\* ==== KONFIGURASI UNDANGAN[^\n]*\nconst CONFIG = \/\*owd:data name="CONFIG"[^*]*\*\/\{/.test(html);
    assert.ok(inline, `${t.id}: CONFIG di awal skrip`);
    assert.match(html, /Kepada Yth\./);
    assert.match(html, /get\("to"\)/);
    assert.match(html, /Buka Undangan/);
    assert.doesNotMatch(html, /autoplay/i);
    // Musik hanya dimulai di handler tombol "Buka Undangan" atau tombol musik.
    const js = scriptBlocks(html);
    assert.equal((js.match(/startMusic\(\);/g) ?? []).length, 2, `${t.id}: startMusic dipanggil dari 2 tempat (buka & tombol)`);
    assert.match(js, /BEGIN:VCALENDAR/);
    assert.match(js, /clipboard/);
    assert.match(js, /https:\/\/wa\.me\//);
    assert.match(js, /google\.com\/maps\/search\/\?api=1&query=/);
    assert.doesNotMatch(html, /key=AIza|maps\/api\/js/);
    assert.match(html, /swiper/);
    assert.match(html, /confetti/);
  }
});

test("3D: library dipatok + CDN cadangan, konten tidak tertutup loader, satu canvas, fallback, anggaran, dispose", () => {
  for (const t of CODE_TEMPLATE_CATALOG.filter((x) => x.code.group !== "animation" && x.code.group !== "invitation" && x.code.group !== "landing")) {
    const html = read(t.id);
    assert.match(html, /<link rel="modulepreload" href="https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.169\.0\//);
    assert.match(html, /const CDN = \["https:\/\/cdn\.jsdelivr\.net\/npm\/","https:\/\/unpkg\.com\/"\];/);
    assert.match(html, /esm\("three@0\.169\.0\/build\/three\.module\.min\.js"\)/);
    assert.match(html, /esm\("lenis@1\.1\.13\/dist\/lenis\.mjs"\)/);
    // Tidak ada stylesheet/skrip CDN yang menahan tampilan pertama.
    assert.doesNotMatch(html, /<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr/);
    assert.doesNotMatch(html, /<script src="https:\/\/cdn\.jsdelivr/);
    assert.match(html, /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*" media="print" onload="this\.media='all'">/);
    // Loader hanya penanda kecil, bukan lapisan layar penuh.
    assert.doesNotMatch(html, /\.loader \{ position: fixed; inset: 0/);
    assert.equal((html.match(/<canvas\b/g) ?? []).length, 1, `${t.id}: satu canvas`);
    assert.equal((html.match(/new THREE\.WebGLRenderer/g) ?? []).length, 1, `${t.id}: satu konteks`);
    assert.match(html, /no-webgl/);
    assert.match(html, /Math\.min\(window\.devicePixelRatio \|\| 1, (?:2|CONFIG\.maksPixelRatio)\)/);
    assert.match(html, /forceContextLoss/);
    assert.match(html, /pagehide/);
    assert.match(html, /IntersectionObserver/);
    assert.doesNotMatch(html, /GLTFLoader|TextureLoader|\.glb|\.gltf|\.jpg|\.png|\.webp/, `${t.id}: tanpa model/tekstur eksternal`);
  }
  for (const t of CODE_TEMPLATE_CATALOG.filter((x) => x.code.group === "web3d")) {
    const html = read(t.id);
    assert.match(html, /"maksSegitiga": 50000/);
    assert.match(html, /CatmullRomCurve3/);
    assert.ok((html.match(/data-adegan="/g) ?? []).length >= 4);
    assert.match(html, /class="loader"/);
  }
});

test("portofolio: PROJECTS di awal skrip, konten statis lengkap tanpa JS, kontak email & WhatsApp", () => {
  for (const t of CODE_TEMPLATE_CATALOG.filter((x) => x.code.group === "portfolio3d")) {
    const html = read(t.id);
    assert.match(html, /\/\* ==== DATA PROYEK[^\n]*\nconst PROJECTS = \/\*owd:data name="PROJECTS"[^*]*\*\/\[/);
    const projects = dataOf(html, "PROJECTS") as { slug: string; judul: string; tautan: string; tag: string[]; deskripsi: string[] }[];
    assert.ok(projects.length >= 3);
    const text = visibleText(html);
    for (const p of projects) {
      assert.ok(html.includes(`id="proyek-${p.slug}"`), `${t.id}: detail ${p.slug} statis`);
      assert.ok(text.includes(p.judul), `${t.id}: judul ${p.judul} terbaca tanpa JS`);
      assert.ok(p.tag.length && p.tautan && p.deskripsi.length);
    }
    assert.match(html, /<h1 id="hero-t"[ >]/);
    assert.match(html, /id="tentang"/);
    assert.match(html, /href="mailto:/);
    assert.match(html, /href="https:\/\/wa\.me\/\d+\?text=/);
    assert.match(html, /data-tilt/);
  }
});

const MOTION_IDS = new Set(MOTION_SPECS.map((s) => s.id));
test("3D motion: OWD Scrub (pengganti GSAP) + Motion + three dalam satu halaman, biodata kode dari CONFIG, pose per bab", () => {
  for (const t of CODE_TEMPLATE_CATALOG.filter((x) => MOTION_IDS.has(x.id))) {
    const html = read(t.id);
    assert.match(html, /window\.OWDScrub = \(function/);
    assert.doesNotMatch(html, /gsap@/);
    assert.match(html, /motion@11\.11\.13\/dist\/motion\.js/);
    assert.match(html, /scrollTrigger: \{/);
    assert.match(html, /inView\(/);
    assert.match(html, /const CONFIG = \/\*owd:data name="CONFIG"/);
    const cfg = dataOf(html, "CONFIG") as { profil: Record<string, unknown> };
    assert.ok(Object.keys(cfg.profil).length >= 4, `${t.id}: biodata`);
    // Panel kode statis (tanpa JS) = render dari CONFIG.
    const region = /<!--owd:render name="code"-->([\s\S]*?)<!--owd:end-->/.exec(html)![1];
    assert.equal(region, motionApi().bioHtml(cfg), `${t.id}: panel kode statis sesuai CONFIG`);
    const poses = JSON.parse(/const POSES = (\[.*\]);/.exec(html)![1]) as { screen: string; s: number }[];
    const chapters = (html.match(/data-ch="/g) ?? []).length;
    assert.equal(poses.length, chapters, `${t.id}: satu pose per bab`);
    assert.ok(chapters >= 6);
    assert.ok(poses.some((p) => p.screen === "code"), `${t.id}: ada bab kode`);
    assert.ok(poses[1].s > poses[0].s, `${t.id}: objek membesar di bab kode`);
    assert.match(html, /class="statement"/);
    assert.match(html, /href="mailto:/);
    assert.match(html, /href="https:\/\/wa\.me\/\d+\?text=/);
  }
});

test("3D motion: biodata kode dalam js, py, dan json; teks di-escape", () => {
  const api = motionApi();
  const base = { variabel: "saya", komentar: "Halo", profil: { nama: "A <b>", umur: 3, aktif: true, alat: ["x", "y"] } };
  assert.equal(api.bioText({ ...base, bahasa: "js" }), '// Halo\nconst saya = {\n  nama: "A <b>",\n  umur: 3,\n  aktif: true,\n  alat: ["x", "y"],\n};');
  assert.equal(api.bioText({ ...base, bahasa: "py" }), '# Halo\nsaya = {\n    "nama": "A <b>",\n    "umur": 3,\n    "aktif": True,\n    "alat": ["x", "y"],\n}');
  assert.equal(api.bioText({ ...base, komentar: "", bahasa: "json" }), '{\n  "nama": "A <b>",\n  "umur": 3,\n  "aktif": true,\n  "alat": ["x", "y"]\n}');
  assert.doesNotMatch(api.bioHtml({ ...base, bahasa: "js" }), /<b>/);
  // Editor: ubah biodata → panel kode statis ikut berubah.
  const html = read("motion-ruang-kode");
  const cfg = dataOf(html, "CONFIG") as Record<string, unknown>;
  const out = applyEdits(html, { data: { CONFIG: { ...cfg, profil: { nama: "Dewi Lestari" } } } }, MOTION_REGIONS);
  assert.match(out, /tk-key">nama<\/span><span class="tk-pun">: <\/span><span class="tk-str">&quot;Dewi Lestari&quot;/);
  assert.doesNotMatch(out, /Raka Pratama&quot;/);
  assert.equal(Object.keys(regionsFor("motion-ruang-kode")).length, 1);
});

/* ---------------- v22: 50 template baru ---------------- */
test("v22: 17 cerita 3D, 16 animasi cerita, 17 undangan; semuanya terdaftar di katalog", () => {
  assert.equal(STORY_SPECS.length, 17);
  assert.equal(ANIM2_SPECS.length, 21);
  assert.equal(INVITE_SPECS_V22.length, 17);
  const ids = new Set(CODE_TEMPLATE_CATALOG.map((t) => t.id));
  for (const s of [...STORY_SPECS, ...ANIM2_SPECS, ...INVITE_SPECS_V22]) assert.ok(ids.has(s.id), s.id);
  for (const s of STORY_SPECS) assert.equal(CODE_TEMPLATE_CATALOG.find((t) => t.id === s.id)!.code.group, "motion3d", s.id);
  for (const s of ANIM2_SPECS) assert.equal(CODE_TEMPLATE_CATALOG.find((t) => t.id === s.id)!.code.group, "animation", s.id);
});

test("v22 cerita 3D: three + OWD Scrub + Motion, satu babak = satu pose kamera, alur adegan berbeda-beda", () => {
  const scenes = new Set<string>();
  for (const s of STORY_SPECS) {
    const html = read(s.id);
    assert.match(html, /window\.OWDScrub = \(function/, s.id);
    assert.doesNotMatch(html, /gsap@/, s.id);
    assert.match(html, /motion@11\.11\.13\/dist\/motion\.js/, s.id);
    assert.match(html, /scrollTrigger: \{/, s.id);
    const acts = (html.match(/<section[^>]* data-act[ >]/g) ?? []).length;
    assert.ok(acts >= 4, `${s.id}: minimal 4 babak`);
    assert.equal(flatKeys(s).length, acts, `${s.id}: satu pose kamera per babak`);
    assert.match(html, /const CONFIG = \/\*owd:data name="CONFIG"/, s.id);
    scenes.add(s.scene);
  }
  assert.equal(scenes.size, STORY_SPECS.length, "setiap cerita punya adegan 3D sendiri");
});

test("v22 animasi cerita: satu canvas 2D tanpa library, babak bertahap, kartu ucapan, kontrol jeda", () => {
  const scenes = new Set<string>();
  for (const s of ANIM2_SPECS) {
    const html = read(s.id);
    assert.equal((html.match(/<canvas\b/g) ?? []).length, 1, s.id);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/|unpkg\.com/, `${s.id}: tanpa library`);
    assert.match(html, /getContext\("2d"\)/, s.id);
    assert.match(html, /devicePixelRatio \|\| 1, 2\)/, `${s.id}: DPR dibatasi`);
    assert.match(html, /visibilitychange/, `${s.id}: berhenti saat tab tersembunyi`);
    assert.match(html, /OWD_THUMB/, s.id);
    assert.match(html, /class="note/, s.id);
    for (const v of ["--bg-1:", "--c-1:", "--ink:", "--speed:"]) assert.ok(html.includes(v), `${s.id}: ${v}`);
    const cfg = dataOf(html, "CONFIG") as { detikPerBabak: number; majuOtomatis: boolean };
    assert.ok(cfg.detikPerBabak > 0 && typeof cfg.majuOtomatis === "boolean", s.id);
    for (let i = 1; i <= s.beats.length; i++) assert.match(html, new RegExp(`data-owd-text="babak${i}"`), `${s.id}: babak${i}`);
    scenes.add(s.scene);
  }
  assert.equal(scenes.size, ANIM2_SPECS.length, "setiap animasi punya adegan sendiri");
});

test("v22 undangan: setiap undangan punya animasi pembuka sendiri yang selesai sebelum sampul hilang", () => {
  const opens = new Set<string>();
  for (const s of [...INVITE_SPECS_V22, ...INVITE_SPECS_V23]) {
    const html = read(s.id);
    const m = /class="op ([a-z-]+)/.exec(html);
    assert.ok(m, `${s.id}: animasi pembuka`);
    opens.add(m![1]);
  }
  assert.equal(opens.size, INVITE_SPECS_V22.length + INVITE_SPECS_V23.length, "animasi pembuka tidak ada yang sama");
});

/* ---------------- v23: 150 template baru ---------------- */
const plain = (html: string) => visibleText(html).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
test("v23: 100 landing page, 40 website 3D bisnis, 5 undangan, 5 animasi; 30 landing + 5 web 3D untuk UMKM", () => {
  assert.equal(LANDING_SPECS.length, 100);
  assert.equal(BIZ_SPECS.length, 40);
  assert.equal(INVITE_SPECS_V23.length, 5);
  assert.equal(ANIM2_SPECS_C.length, 5);
  const byId = new Map(CODE_TEMPLATE_CATALOG.map((t) => [t.id, t]));
  for (const s of LANDING_SPECS) assert.equal(byId.get(s.id)?.code.group, "landing", s.id);
  for (const s of BIZ_SPECS) assert.equal(byId.get(s.id)?.code.group, "biz3d", s.id);
  assert.equal(CODE_TEMPLATE_CATALOG.filter((t) => t.code.group === "landing" && t.tags.includes("umkm")).length, 30);
  assert.equal(CODE_TEMPLATE_CATALOG.filter((t) => t.code.group === "biz3d" && t.tags.includes("umkm")).length, 5);
  // 3D disebar rata: satu template per kategori.
  assert.equal(new Set(BIZ_SPECS.map((s) => s.category)).size, 40);
});

test("v23 landing: tanpa library, WhatsApp, jam buka dari CONFIG, menu/layanan & FAQ terbaca tanpa JS", () => {
  for (const s of LANDING_SPECS) {
    const html = read(s.id);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/|unpkg\.com/, `${s.id}: tanpa library`);
    assert.match(html, /https:\/\/wa\.me\//, s.id);
    const cfg = dataOf(html, "CONFIG") as { whatsapp: string };
    assert.match(cfg.whatsapp, /^62\d{8,13}$/, s.id);
    const text = plain(html);
    assert.ok(text.includes(s.name), `${s.id}: nama usaha`);
    for (const p of s.products) assert.ok(text.includes(p[0]), `${s.id}: ${p[0]}`);
    for (const f of s.faq) assert.ok(text.includes(f[0]), `${s.id}: FAQ`);
    if (s.cart === false) assert.doesNotMatch(html, /<div class="cart"/, `${s.id}: usaha jasa tanpa keranjang`);
  }
});

test("v23 web 3D bisnis: 11 section lengkap, galeri render 3D, paket, lokasi, FAQ, kontak WhatsApp", () => {
  const models = new Set<string>();
  for (const s of BIZ_SPECS) {
    const html = read(s.id);
    for (const id of ["beranda", "profil", "katalog", "keunggulan", "alur", "testimoni", "galeri", "harga", "lokasi", "faq", "kontak"]) assert.match(html, new RegExp(`id="${id}"`), `${s.id}: section ${id}`);
    assert.match(html, /window\.OWDScrub = \(function/, s.id);
    assert.doesNotMatch(html, /gsap@/, s.id);
    assert.match(html, /motion@11\.11\.13\/dist\/motion\.js/, s.id);
    assert.equal((html.match(/<li data-shot\b/g) ?? []).length, 6, `${s.id}: 6 foto galeri`);
    assert.equal((html.match(/ data-plan>/g) ?? []).length, s.plans.length, `${s.id}: paket`);
    assert.match(html, /data-form/, `${s.id}: form kontak`);
    const cfg = dataOf(html, "CONFIG") as { whatsapp: string; varian: unknown[] };
    assert.match(cfg.whatsapp, /^62\d{8,13}$/, s.id);
    assert.ok(cfg.varian.length >= 2, `${s.id}: varian warna`);
    const text = plain(html);
    for (const p of s.products) assert.ok(text.includes(p[0]), `${s.id}: ${p[0]}`);
    for (const f of s.faq) assert.ok(text.includes(f[0]), `${s.id}: FAQ`);
    models.add(s.model);
  }
  assert.equal(models.size, 40, "setiap website 3D punya objek 3D sendiri");
});

test("v23.1 web 3D bisnis: cerita scroll (benih → rakit → urai → menyelam → partikel nama)", () => {
  for (const s of BIZ_SPECS) {
    const html = read(s.id);
    const story = STORY_OF[s.model];
    assert.ok(story, `${s.id}: model punya cerita`);
    assert.match(html, /function buildSeed\(K, THREE, COL\)/, `${s.id}: benih`);
    assert.match(html, new RegExp(`const STORY = \\{"seed":"${story[0]}"`), `${s.id}: STORY`);
    const m = /const POSES = (\[.*?\]);/.exec(html);
    assert.ok(m, s.id);
    const poses = JSON.parse(m[1]) as Record<string, number>[];
    assert.equal(poses.length, 11);
    assert.equal(poses[0].bld, 0, `${s.id}: hero menampilkan benih`);
    assert.ok(poses.slice(1).every((p) => p.bld === 1), `${s.id}: objek utuh setelah hero`);
    assert.equal(poses.filter((p) => p.dive === 1).length, 1, `${s.id}: tepat satu bagian menyelam`);
    assert.ok(poses.filter((p) => p.exp || p.orb || p.lay || p.dis).length >= 2, `${s.id}: minimal dua adegan lain`);
    assert.match(html, /function buildWorld\(W\)/, `${s.id}: dunia khas`);
    assert.match(html, /function story\(C, t, dt\)/, s.id);
  }
});

test("aksesibilitas & gaya: lang, viewport, reduced motion, tanpa em dash di teks", () => {
  for (const t of CODE_TEMPLATE_CATALOG) {
    const html = read(t.id);
    assert.match(html, /<html lang="id"/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /prefers-reduced-motion/);
    assert.doesNotMatch(visibleText(html), /—/, `${t.id}: em dash`);
  }
});

test("thumbnail & README", () => {
  assert.match(withThumbFlag("<html><head><title>x</title></head></html>"), /<head><script>window\.OWD_THUMB=true<\/script><title>/);
  for (const t of CODE_TEMPLATE_CATALOG) {
    for (const lang of ["id", "en"] as const) {
      const md = codeTemplateReadme(t, "Nama", lang);
      assert.match(md, /^# Nama/);
      assert.ok(md.includes(String(t.code.budgetKb)));
    }
  }
});

test("edit tanpa kode: setiap template punya teks, warna, dan data yang bisa diedit; tanpa perubahan = berkas sama", () => {
  for (const t of CODE_TEMPLATE_CATALOG) {
    const html = read(t.id);
    const m = readModel(html);
    assert.ok(m.texts.length >= 4, `${t.id}: teks`);
    assert.ok(m.vars.length >= 5, `${t.id}: variabel warna`);
    assert.ok(m.vars.some((v) => v.kind === "color"), `${t.id}: ada warna`);
    // Satu blok data; website 3D bisnis (v27) punya blok kedua DAFTAR untuk daftar yang bisa ditambah/dihapus.
    assert.equal(m.data.length, t.id.startsWith("biz-") ? 2 : 1, `${t.id}: jumlah blok data`);
    const regions = regionsFor(t.id);
    const same = applyEdits(html, { data: Object.fromEntries(m.data.map((d) => [d.name, d.value])) }, regions);
    assert.equal(same, html, `${t.id}: tulis ulang data tanpa perubahan harus identik`);
  }
});

test("edit tanpa kode: perubahan teks, warna, tautan, dan proyek diterapkan dengan aman", () => {
  const html = read("folio-raka-aditya");
  const m = readModel(html);
  const projects = m.data[0].value as { judul: string; slug: string }[];
  const out = applyEdits(
    html,
    {
      texts: { nama: "Ayu <b>Lestari</b>" },
      vars: { "--accent": "#ff0000;}body{display:none" },
      links: { email: "javascript:alert(1)", whatsapp: "wa.me/628123" },
      data: { PROJECTS: [...projects, { ...projects[0], slug: "", judul: "Proyek Baru" }] },
    },
    FOLIO_REGIONS,
  );
  assert.equal((out.match(/>Ayu &lt;b&gt;Lestari&lt;\/b&gt;</g) ?? []).length, 3, "nama di merek, judul, dan kaki halaman");
  assert.doesNotMatch(out, /<b>Lestari/);
  assert.match(out, /--accent: #ff0000body;?|--accent: #ff0000bodydisplay:none;/);
  assert.doesNotMatch(out, /javascript:/);
  assert.match(out, /href="https:\/\/wa\.me\/628123"/);
  assert.match(visibleText(out), /Proyek Baru/, "proyek baru ada di HTML statis");
  assert.match(out, /id="proyek-proyek-baru-\d+"/);
  const m2 = readModel(out);
  assert.equal(m2.texts.find((x) => x.key === "nama")!.value, "Ayu <b>Lestari</b>");
});

test("proyek template kode: data tersimpan dinormalkan, HTML akhir = template + perubahan", () => {
  assert.equal(normalizeCodeSite(null), null);
  assert.equal(normalizeCodeSite({ edits: {} }), null);
  const doc = normalizeCodeSite({ templateId: "anim-sakura-senja", edits: { texts: { judul: "Untukmu", rusak: 5 }, vars: "x" } })!;
  assert.deepEqual(doc.edits, { texts: { judul: "Untukmu" }, links: {}, vars: {}, data: {} });
  const html = renderCodeSite(read("anim-sakura-senja"), doc);
  assert.match(html, /data-owd-text="judul"[^>]*>Untukmu</);
  assert.equal(renderCodeSite(read("folio-naya-kirana"), createCodeSiteDoc("folio-naya-kirana")), read("folio-naya-kirana"));
  assert.ok(Object.keys(regionsFor("folio-naya-kirana")).length === 2 && Object.keys(regionsFor("anim-sakura-senja")).length === 0);
});

test("3D bisnis (v27): daftar bisa ditambah, diduplikat, diurutkan, dihapus; HTML statis ikut dibangun ulang", () => {
  const id = "biz-kopi-lereng-ijen";
  const html = read(id);
  const m = readModel(html);
  const blk = m.data.find((d) => d.name === "DAFTAR");
  assert.ok(blk, "blok DAFTAR ada");
  assert.ok(blk.hidden.includes("katalog.ikon"));
  const d = blk.value as { kategori: string[]; katalog: { nama: string; kategori: string; harga: number }[]; faq: { tanya: string; jawab: string }[]; paket: { nama: string }[] };
  const regions = regionsFor(id);
  assert.ok(Object.keys(regions).length >= 11);
  const items = (h: string) => (h.match(/<li class="item card"/g) ?? []).length;
  const before = items(html);
  assert.equal(before, d.katalog.length);
  // tambah + duplikat
  const added = { ...d, katalog: [...d.katalog, { ...d.katalog[0], nama: "Menu <Baru>", kategori: d.kategori[1] }, d.katalog[0]] };
  let out = applyEdits(html, { data: { DAFTAR: added } }, regions);
  assert.equal(items(out), before + 2);
  assert.ok(out.includes("Menu &lt;Baru&gt;") && !out.includes("Menu <Baru>"));
  assert.ok(out.includes(`data-c="1"`));
  // kategori baru jadi tab filter baru
  out = applyEdits(html, { data: { DAFTAR: { ...d, kategori: [...d.kategori, "Musiman"] } } }, regions);
  assert.ok(out.includes(`data-f="${d.kategori.length}"`) && out.includes(">Musiman</button>"));
  // urutkan + hapus FAQ
  const faq = [d.faq[1], d.faq[0]];
  out = applyEdits(html, { data: { DAFTAR: { ...d, faq } } }, regions);
  assert.ok(out.indexOf(d.faq[1].tanya) < out.indexOf(d.faq[0].tanya));
  out = applyEdits(html, { data: { DAFTAR: { ...d, faq: [] } } }, regions);
  assert.ok(!out.includes("<details class=\"card\""));
  // paket baru muncul juga di pilihan formulir
  out = applyEdits(html, { data: { DAFTAR: { ...d, paket: [...d.paket, { ...d.paket[0], nama: "Paket Kantor" }] } } }, regions);
  assert.ok(out.includes("<option>Paket Kantor</option>") && out.includes("Pilih Paket Kantor"));
});

test("v27.1 web 3D bisnis: storyboard berbeda per template (dunia + urutan adegan)", () => {
  const combos = new Set<string>(), worlds = new Map<string, number>();
  for (const s of BIZ_SPECS) {
    const html = read(s.id);
    const st = JSON.parse(/const STORY = (\{.*?\});/.exec(html)![1]) as { world: string; build: string; seed: string };
    const poses = (JSON.parse(/const POSES = (\[.*?\]);/.exec(html)![1]) as Record<string, number>[]).map((p) => ["exp", "orb", "lay", "dive", "dis"].find((k) => p[k] === 1) ?? "-").join(",");
    combos.add(`${st.world}|${poses}`);
    worlds.set(st.world, (worlds.get(st.world) ?? 0) + 1);
    assert.doesNotMatch(html, /TorusGeometry\(2\.1, 0\.025/.source && st.world !== "tunnel" ? /TorusGeometry\(2\.1, 0\.025/ : /$^/, `${s.id}: lorong cincin hanya untuk dunia tunnel`);
  }
  assert.equal(combos.size, BIZ_SPECS.length, "setiap template punya kombinasi dunia + urutan adegan sendiri");
  assert.ok(worlds.size >= 12, "minimal 12 dunia");
  assert.ok([...worlds.values()].every((n) => n <= 4), "satu dunia paling banyak dipakai 4 template");
});
