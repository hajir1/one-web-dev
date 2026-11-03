/* Buat THIRD_PARTY_NOTICES.md dari dependensi produksi (package.json → node_modules).
   Jalankan ulang setiap kali dependensi berubah: `npm run notices`. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const seen = new Map();

function visit(name) {
  if (seen.has(name)) return;
  const dir = path.join(root, "node_modules", name);
  const file = path.join(dir, "package.json");
  if (!fs.existsSync(file)) return;
  const p = JSON.parse(fs.readFileSync(file, "utf8"));
  const lic = name === "buffers" && !p.license ? "MIT/X11 (README paket)" : typeof p.license === "string" ? p.license : p.license?.type ?? (Array.isArray(p.licenses) ? p.licenses.map((l) => l.type).join(" OR ") : "TIDAK DIKETAHUI");
  const repo = typeof p.repository === "string" ? p.repository : p.repository?.url ?? p.homepage ?? "";
  seen.set(name, { name, version: p.version, license: lic, repo: repo.replace(/^git\+/, "").replace(/\.git$/, "") });
  for (const dep of Object.keys(p.dependencies ?? {})) visit(dep);
}
for (const dep of Object.keys(pkg.dependencies ?? {})) visit(dep);

const rows = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
const byLicense = rows.reduce((m, r) => m.set(r.license, (m.get(r.license) ?? 0) + 1), new Map());
const md = `# Pemberitahuan pihak ketiga

OneWebDev memakai karya pihak lain berikut. Lisensi masing-masing tetap berlaku untuk bagiannya.

## Dasar proyek

Kerangka awal dashboard berasal dari **TailAdmin React** (MIT):

\`\`\`
${fs.readFileSync(path.join(root, "LICENSES", "MIT-TailAdmin.txt"), "utf8").trim()}
\`\`\`

## Dimuat saat dipakai (tidak dibundel)

| Komponen | Lisensi | Dipakai untuk |
|---|---|---|
| three.js (CDN jsDelivr) | MIT | Elemen 3D (\`owd3d\`) |
| A-Frame (CDN jsDelivr) | MIT | Library A-Frame opsional di Desain Halaman |
| Chart.js (CDN jsDelivr) | MIT | Elemen grafik |
| Model BiRefNet lite (\`onnx-community/BiRefNet_lite-ONNX\`, Hugging Face) | MIT (cek kartu model setiap kali model diganti) | Hapus latar gambar di browser |
| Plus Jakarta Sans, JetBrains Mono, font Google Fonts lain | SIL OFL 1.1 | Tipografi aplikasi & template |

Efek animasi (pengganti AOS, Animate.css, dan Vanilla Tilt) ditulis ulang sebagai \`owd-motion\`. Keyframe gaya Animate.css mengikuti Animate.css 4.1.1 (MIT, © Daniel Eden).

## Paket npm yang dibundel (${rows.length} paket)

Ringkasan: ${[...byLicense].sort((a, b) => b[1] - a[1]).map(([l, n]) => `${l} (${n})`).join(", ")}.

| Paket | Versi | Lisensi | Sumber |
|---|---|---|---|
${rows.map((r) => `| ${r.name} | ${r.version} | ${r.license} | ${r.repo} |`).join("\n")}

_Dibuat otomatis oleh \`scripts/third-party-notices.mjs\`._
`;
fs.writeFileSync(path.join(root, "THIRD_PARTY_NOTICES.md"), md);
console.log(`THIRD_PARTY_NOTICES.md: ${rows.length} paket; ${[...byLicense].map(([l, n]) => `${l}=${n}`).join(", ")}`);
