import test from "node:test";
import assert from "node:assert/strict";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SECTION_PRESETS } from "../helpers/sectionPresets";

// Regresi: klik "Tambah Section" membuat halaman putih karena thumbnail preset
// yang berisi elemen (bukan hanya box) membaca `children` dari node elemen.
test("thumbnail semua preset section bisa dirender tanpa error", async () => {
  // tsx memakai transform JSX klasik di tes: sediakan React global.
  (globalThis as { React?: unknown }).React = React;
  const { ThumbNode } = await import("../engine/ui/ThumbNode");
  for (const p of SECTION_PRESETS) {
    const html = renderToStaticMarkup(React.createElement(ThumbNode, { node: p.build(), parent: null, isRoot: true }));
    assert.ok(html.startsWith("<div"), p.id);
  }
});
