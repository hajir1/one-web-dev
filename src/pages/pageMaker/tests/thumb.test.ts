import test from "node:test";
import assert from "node:assert/strict";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SECTION_PRESETS } from "../helpers/sectionPresets";

// Regression: clicking "Add Section" produced a white page because preset thumbnails
// containing elements (not just boxes) read `children` from element nodes.
test("thumbnail semua preset section bisa dirender tanpa error", async () => {
  // tsx uses the classic JSX transform in tests: provide a global React.
  (globalThis as { React?: unknown }).React = React;
  const { ThumbNode } = await import("../engine/ui/ThumbNode");
  for (const p of SECTION_PRESETS) {
    const html = renderToStaticMarkup(React.createElement(ThumbNode, { node: p.build(), parent: null, isRoot: true }));
    assert.ok(html.startsWith("<div"), p.id);
  }
});
