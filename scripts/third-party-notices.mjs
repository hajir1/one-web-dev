/* Builds THIRD_PARTY_NOTICES.md from the production dependencies (package.json → node_modules).
   Run it again whenever dependencies change: `npm run notices`. */
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
  const lic = name === "buffers" && !p.license ? "MIT/X11 (package README)" : typeof p.license === "string" ? p.license : p.license?.type ?? (Array.isArray(p.licenses) ? p.licenses.map((l) => l.type).join(" OR ") : "UNKNOWN");
  const repo = typeof p.repository === "string" ? p.repository : p.repository?.url ?? p.homepage ?? "";
  seen.set(name, { name, version: p.version, license: lic, repo: repo.replace(/^git\+/, "").replace(/\.git$/, "") });
  for (const dep of Object.keys(p.dependencies ?? {})) visit(dep);
}
for (const dep of Object.keys(pkg.dependencies ?? {})) visit(dep);

const rows = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
const byLicense = rows.reduce((m, r) => m.set(r.license, (m.get(r.license) ?? 0) + 1), new Map());
const md = `# Third-party notices

OneWebDev uses the following work by others. Each license continues to apply to its part.

## Project base

The initial dashboard scaffold comes from **TailAdmin React** (MIT):

\`\`\`
${fs.readFileSync(path.join(root, "LICENSES", "MIT-TailAdmin.txt"), "utf8").trim()}
\`\`\`

## Loaded at runtime (not bundled)

| Component | License | Used for |
|---|---|---|
| three.js (jsDelivr CDN) | MIT | 3D elements (\`owd3d\`) |
| A-Frame (jsDelivr CDN) | MIT | Optional A-Frame library in Page Design |
| Chart.js (jsDelivr CDN) | MIT | Chart elements |
| BiRefNet lite model (\`onnx-community/BiRefNet_lite-ONNX\`, Hugging Face) | MIT (check the model card whenever the model changes) | In-browser image background removal |
| Plus Jakarta Sans, JetBrains Mono, other Google Fonts | SIL OFL 1.1 | App and template typography |
| Motion 11 (jsDelivr CDN) | MIT | Animation in code templates |
| Lenis 1.1 (jsDelivr CDN) | MIT | Smooth scrolling in code templates |
| Swiper 11 (jsDelivr CDN) | MIT | Sliders in code templates |
| AOS 2.3 (jsDelivr CDN) | MIT | Entrance animations in code templates |
| canvas-confetti 1.9 (jsDelivr CDN) | ISC | Confetti effect in invitation templates |

Scroll animation in the 3D templates uses an in-house engine (OWD Scrub, \`src/tools/codeTemplates/scrub.ts\`), not GSAP. Every sample image in the templates and Page Maker elements is an in-house SVG; 3D objects are procedural, with no external models or textures. Pure CSS animation templates use no library at all. Business names, people, partners, and testimonials in the templates are fictional.

Animation effects (replacing AOS, Animate.css, and Vanilla Tilt) are rewritten as \`owd-motion\`. The Animate.css style keyframes follow Animate.css 4.1.1 (MIT, © Daniel Eden).

## Bundled npm packages (${rows.length} packages)

Summary: ${[...byLicense].sort((a, b) => b[1] - a[1]).map(([l, n]) => `${l} (${n})`).join(", ")}.

| Package | Version | License | Source |
|---|---|---|---|
${rows.map((r) => `| ${r.name} | ${r.version} | ${r.license} | ${r.repo} |`).join("\n")}

_Generated automatically by \`scripts/third-party-notices.mjs\`._
`;
fs.writeFileSync(path.join(root, "THIRD_PARTY_NOTICES.md"), md);
console.log(`THIRD_PARTY_NOTICES.md: ${rows.length} packages; ${[...byLicense].map(([l, n]) => `${l}=${n}`).join(", ")}`);
