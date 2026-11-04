// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { contrastRatio, convertCase, describeCron, diffLines, dummyText, nextRuns, parseCron, regexReplace, runRegex, wcagLevels } from "../Utilities/lib/textTools";
import { optimizeSvg } from "../Utilities/lib/svg";

test("convertCase", () => {
  assert.equal(convertCase("Kopi Susu Gula Aren!", "slug"), "kopi-susu-gula-aren");
  assert.equal(convertCase("Café déjà vu", "slug"), "cafe-deja-vu");
  assert.equal(convertCase("user id number", "camel"), "userIdNumber");
  assert.equal(convertCase("getHTTPResponse", "snake"), "get_http_response");
  assert.equal(convertCase("api base url", "constant"), "API_BASE_URL");
  assert.equal(convertCase("halo DUNIA", "title"), "Halo Dunia");
  assert.equal(convertCase("a b\n\nc d", "pascal"), "AB\n\nCD");
});

test("dummyText deterministik dengan seed", () => {
  const a = dummyText(2, "lorem", 42);
  assert.equal(a, dummyText(2, "lorem", 42));
  assert.equal(a.split("\n\n").length, 2);
  assert.ok(a.startsWith("Lorem ipsum dolor sit amet"));
  assert.ok(dummyText(1, "id", 1).endsWith("."));
});

test("cron: parse, jadwal berikutnya, penjelasan", () => {
  const c = parseCron("30 8 * * 1-5");
  const runs = nextRuns(c, new Date(2026, 9, 24, 9, 0), 3); // Sabtu 24 Okt 2026 09:00
  assert.deepEqual(runs.map((d) => [d.getDate(), d.getHours(), d.getMinutes()]), [[26, 8, 30], [27, 8, 30], [28, 8, 30]]);
  assert.equal(describeCron(c, "id"), "Pukul 08:30, setiap hari Senin, Selasa, Rabu, Kamis, Jumat.");
  assert.equal(describeCron(parseCron("@hourly"), "en"), "Every hour at minute 0.");
  assert.equal(describeCron(parseCron("*/15 * * * *"), "id"), "Menit 0, 15, 30, 45.");
  assert.equal(nextRuns(parseCron("0 0 29 2 *"), new Date(2026, 0, 1), 1)[0].getFullYear(), 2028);
  assert.throws(() => parseCron("* * *"), { code: "cronParts" });
  assert.throws(() => parseCron("61 * * * *"), { code: "cronField" });
  assert.deepEqual([...parseCron("0 0 * JAN-MAR SUN").month.values], [1, 2, 3]);
  assert.deepEqual([...parseCron("0 0 * * 7").dow.values], [0]);
});

test("diffLines", () => {
  const ops = diffLines("a\nb\nc", "a\nB\nc\nd");
  assert.deepEqual(ops.map((o) => o.type + o.text), ["samea", "delb", "addB", "samec", "addd"]);
  assert.ok(diffLines("A  b", "a b", { ignoreCase: true, ignoreWhitespace: true }).every((o) => o.type === "same"));
});

test("regex", () => {
  const r = runRegex("(\\w+)@(?<dom>\\w+)", "", "x a@b y c@d");
  assert.equal(r.matches.length, 1);
  assert.deepEqual(runRegex("(\\w+)@(?<dom>\\w+)", "g", "x a@b y c@d").matches.map((m) => m.named.dom), ["b", "d"]);
  assert.equal(runRegex("", "g", "ab").matches.length, 3); // empty matches do not cause an infinite loop
  assert.throws(() => runRegex("(", "g", "x"), { code: "regexInvalid" });
  assert.equal(regexReplace("(\\w+)@(\\w+)", "g", "a@b", "$2 at $1"), "b at a");
});

test("kontras WCAG", () => {
  assert.equal(contrastRatio("#000", "#fff").toFixed(0), "21");
  assert.equal(contrastRatio("#777777", "#ffffff").toFixed(2), "4.48");
  assert.equal(wcagLevels(4.48).aaNormal, false);
  assert.equal(contrastRatio("zzz", "#fff"), null);
});

test("optimizeSvg", () => {
  const out = optimizeSvg('<?xml version="1.0"?>\n<!-- c --><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><circle cx="12.000" cy="12.000" r="10.000"/></g></svg>', { multipass: true, keepViewBox: true });
  assert.ok(!out.includes("<!--") && out.includes("viewBox"));
  assert.throws(() => optimizeSvg("bukan svg", { multipass: true, keepViewBox: true }), { code: "svgInvalid" });
});
