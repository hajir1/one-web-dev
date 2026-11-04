import test from "node:test";
import assert from "node:assert/strict";
import { EFFECT_LIBRARY_IDS, LIBRARY_IDS } from "../../pageMaker/engine/helpers/libraries";
import { walk } from "../../pageMaker/engine/helpers/tree";
import { compose } from "../../pageMaker/engine/helpers/compose";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { LIBRARY_PLAN } from "../templates/libraryPlan";
import { WEB_TEMPLATES, buildTemplatePages, getTemplate } from "../registry";
import { templateContents } from "../../../marketplace/data/templateCatalog";
import { V3C_CATALOG } from "../templates/v3/catalogC";
import { V3D_CATALOG } from "../templates/v3/catalogD";
import { V4E_CATALOG } from "../templates/v4/catalogE";
import { V5F_CATALOG } from "../templates/v5/catalogF";
import { V6G_CATALOG } from "../templates/v6/catalogG";
import { V7H_CATALOG } from "../templates/v7/catalogH";
import { V9I_CATALOG } from "../templates/v9/catalogI";
import { V10J_CATALOG } from "../templates/v10/catalogJ";

/* Old Premium templates (initial catalog + v2) now use libraries from the Element → Library menu. */

const V3 = new Set([...V3C_CATALOG, ...V3D_CATALOG, ...V4E_CATALOG, ...V5F_CATALOG, ...V6G_CATALOG, ...V7H_CATALOG, ...V9I_CATALOG, ...V10J_CATALOG].map((m) => m.id));
const OLD = WEB_TEMPLATES.filter((t) => !V3.has(t.id));

test("rencana library: semua template Premium lama terdaftar, Free tidak", () => {
  const premiumOld = OLD.filter((t) => t.tier === "premium");
  assert.equal(premiumOld.length, 64);
  for (const t of premiumOld) assert.ok(LIBRARY_PLAN[t.id], t.id);
  for (const id of Object.keys(LIBRARY_PLAN)) assert.equal(getTemplate(id)?.tier, "premium", id);
  const used = new Set(Object.values(LIBRARY_PLAN).flatMap((p) => ["aos", ...(p.hero ? ["animate"] : []), ...(p.tilt ? ["tilt"] : [])]));
  assert.deepEqual([...used].sort(), EFFECT_LIBRARY_IDS.filter((l) => l !== "scroll").sort(), "ketiga library dipakai");
});

test("setiap halaman template Premium lama memasang library & efek di node nyata", () => {
  for (const id of Object.keys(LIBRARY_PLAN)) {
    const t = getTemplate(id)!;
    for (const p of buildTemplatePages(t, "id")) {
      const libs = p.doc.root.libraries ?? [];
      assert.ok(libs.includes("aos"), `${id}/${p.key}: AOS`);
      assert.ok(libs.every((l) => (LIBRARY_IDS as string[]).includes(l)), `${id}/${p.key}: library dikenal`);
      const used = new Set<string>();
      walk(p.doc.root, (n) => Object.keys(n.libs ?? {}).forEach((k) => used.add(k)));
      assert.ok(used.has("aos"), `${id}/${p.key}: ada node ber-AOS`);
      for (const l of libs) assert.ok(used.has(l), `${id}/${p.key}: ${l} terpasang tapi tidak dipakai`);
    }
    assert.ok(templateContents(t).libraries.length > 0, `${id}: katalog mencatat library`);
    assert.equal(t.version, 2, `${id}: versi naik karena isi berubah`);
  }
});

test("template Free lama tanpa library; ekspor template Premium memuat runtime efek", () => {
  for (const t of OLD.filter((x) => x.tier === "free")) {
    for (const p of buildTemplatePages(t, "id")) assert.equal(p.doc.root.libraries, undefined, `${t.id}/${p.key}`);
  }
  const t = getTemplate("saas-crm-relasi")!;
  const home = buildTemplatePages(t, "id").find((p) => p.home)!;
  const index = compose(home.doc.root, { rootClass: "pg", icons: makeIconLookup([]) }).files("html").find((f) => f.name === "index.html")!.content;
  assert.match(index, /window\.OWDMotion/);
  assert.doesNotMatch(index, /cdn\.jsdelivr\.net\/npm\/(aos|animate\.css|vanilla-tilt)/);
  assert.doesNotMatch(index, /AOS\.init/);
  assert.match(index, /data-aos="/);
});
