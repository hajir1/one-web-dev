import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { THUMBS } from "../../../demo/thumbs.generated";
import { DEMO_TEMPLATE_IDS } from "../../../demo/demoTemplateIds";
import { CODE_TEMPLATE_IDS } from "../codeTemplates/catalog";
import { staticThumbUrl } from "../staticThumb";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../../../../public/thumbs");

test("v21: setiap template katalog punya thumbnail statis (jalankan npm run gen:thumbs bila gagal)", () => {
  const missing: string[] = [];
  for (const id of CODE_TEMPLATE_IDS) if (!THUMBS[`${id}.id`]) missing.push(`${id}.id`);
  for (const id of DEMO_TEMPLATE_IDS) for (const l of ["id", "en"]) if (!THUMBS[`${id}.${l}`]) missing.push(`${id}.${l}`);
  assert.deepEqual(missing, []);
});

test("v21: berkas thumbnail ada dan ringan (< 80 KB)", () => {
  for (const key of Object.keys(THUMBS)) {
    const f = join(dir, `${key}.webp`);
    assert.ok(existsSync(f), `${key}.webp tidak ada`);
    assert.ok(statSync(f).size < 80 * 1024, `${key}.webp terlalu besar`);
  }
});

test("v21: URL thumbnail per bahasa, Template Kode jatuh ke .id, tanpa gambar → null", () => {
  const page = DEMO_TEMPLATE_IDS[0];
  assert.match(staticThumbUrl(page, "en")!, new RegExp(`/thumbs/${page}\\.en\\.webp\\?v=[0-9a-f]{8}$`));
  assert.match(staticThumbUrl(page, "id-ID")!, new RegExp(`/thumbs/${page}\\.id\\.webp\\?v=`));
  assert.match(staticThumbUrl(CODE_TEMPLATE_IDS[0], "en")!, new RegExp(`/thumbs/${CODE_TEMPLATE_IDS[0]}\\.id\\.webp\\?v=`));
  assert.equal(staticThumbUrl("tidak-ada", "id"), null);
});
