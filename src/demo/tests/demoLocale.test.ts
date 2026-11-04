// v15: demo mode without "free", credit, or Premium wording.
import test from "node:test";
import assert from "node:assert/strict";
import i18next from "i18next";
import id from "../../locales/id.json";
import en from "../../locales/en.json";
import { DEMO_LOCALE, installDemoLocale } from "../demoLocale";

type Tree = { [k: string]: unknown };
const LOCALES: Record<"id" | "en", Tree> = { id: id as Tree, en: en as Tree };
const FORBIDDEN = /\b(gratis|free|kredit|credits?|premium|berbayar|paid|kuota|quota)\b/i;

function* strings(node: unknown, path: string): Generator<[string, string]> {
  if (typeof node === "string") yield [path, node];
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) yield* strings(v, path ? `${path}.${k}` : k);
}
const at = (root: Tree, path: string): unknown => path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Tree)[k] : undefined), root);

test("teks pengganti demo menimpa kunci yang memang ada, tanpa kata gratis/kredit", () => {
  for (const lang of ["id", "en"] as const) {
    for (const [path, text] of strings(DEMO_LOCALE[lang], "")) {
      assert.equal(typeof at(LOCALES[lang], path), "string", `${lang}: kunci ${path} tidak ada di locale`);
      assert.doesNotMatch(text, FORBIDDEN, `${lang}.${path}`);
    }
  }
});

test("semua teks demo.* (widget, template, VR, dokumentasi, banner) tanpa kata gratis/kredit", () => {
  for (const lang of ["id", "en"] as const) {
    const demo = LOCALES[lang].demo as Tree;
    for (const [path, text] of strings(demo, "demo")) assert.doesNotMatch(text, FORBIDDEN, `${lang}: ${path}`);
    assert.deepEqual(Object.keys(at(LOCALES.id, "demo") as Tree).sort(), Object.keys(demo).sort(), "kunci demo id & en sama");
    assert.ok(at(demo, "promo.title") && at(demo, "widget.sites") && at(demo, "vr.body"));
    assert.equal(at(demo, "vr.limit"), undefined);
  }
});

test("teks demo dipasang juga pada bahasa yang dimuat belakangan", async () => {
  const i18n = i18next.createInstance();
  await i18n.init({ resources: { id: { translation: id } }, lng: "id", initAsync: false, showSupportNotice: false });
  installDemoLocale(i18n);
  assert.equal(i18n.t("media.shell.browserFree"), "Diproses di browser");
  assert.equal(i18n.t("pm.events.freeNote"), "Semua event tersedia.");
  i18n.addResourceBundle("en", "translation", en, true, true);
  assert.equal(i18n.getFixedT("en")("media.shell.browserFree"), "Processed in your browser");
  assert.equal(i18n.getFixedT("en")("media.tools.audio-converter.tagline"), "Convert MP3, WAV, OGG, Opus, FLAC, AAC, M4A — many files at once, no upload.");
  assert.equal(i18n.getFixedT("en")("home.ctaTemplates"), at(LOCALES.en, "home.ctaTemplates"), "kunci lain tidak berubah");
});
