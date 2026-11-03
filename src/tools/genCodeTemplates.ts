import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ANIM_SPECS, buildAnim } from "./codeTemplates/anim";
import { INVITE_SPECS, buildInvite } from "./codeTemplates/invite";
import { WEB3D_SPECS, buildWeb3D } from "./codeTemplates/web3d";
import { FOLIO_SPECS, buildFolio } from "./codeTemplates/folio";
import { MOTION_SPECS, buildMotion } from "./codeTemplates/motion3d";
import { STORY_SPECS } from "./codeTemplates/storyAll";
import { buildStory } from "./codeTemplates/story3d";
import { ANIM2_SPECS } from "./codeTemplates/anim2All";
import { buildAnim2 } from "./codeTemplates/anim2";
import { LANDING_SPECS } from "./codeTemplates/landingAll";
import { buildLanding } from "./codeTemplates/landing";
import { BIZ_SPECS } from "./codeTemplates/bizAll";
import { buildBiz } from "./codeTemplates/biz3d";

/* ================================================================== */
/* Generator Template Kode (v16, bagian J): menulis 12 berkas HTML       */
/* mandiri ke pages/webTemplates/codeTemplates/files/.                  */
/* Jalankan: npm run gen:code                                          */
/* ================================================================== */

const out = join(dirname(fileURLToPath(import.meta.url)), "../pages/webTemplates/codeTemplates/files");
mkdirSync(out, { recursive: true });

const files: [string, string][] = [
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

for (const [id, html] of files) {
  writeFileSync(join(out, `${id}.html`), html);
  console.log(`${id}.html  ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}
