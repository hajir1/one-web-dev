import { test } from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { decodeText, detectDelimiter, parseCsv, toCsv } from "../shared/csv";
import { DataError } from "../shared/errors";
import { arraysToObjects, formatCellValue, readWorkbook, uniqueHeaders, worksheetToObjects } from "../shared/excelUtils";
import { formatJson, jsonStats, minifyJson, parseJsonStrict } from "../shared/json";
import { safeFileName } from "../shared/downloadUtils";
import { buildSql, detectColumnType, escapeValue, parseJsonText, quoteIdent, validateColumns } from "../SqlConverter/sqlUtils";
import { jsObjectToJson, jsonToJsObject, parseJsObject, printJs, DEFAULT_JS_PRINT } from "../Utilities/lib/jsObject";
import { decodeBase64, decodeUrl, encodeBase64, encodeUrl, parseQuery } from "../Utilities/lib/encoding";
import { decodeJwt } from "../Utilities/lib/jwt";
import { guessUnit, parseTimestamp } from "../Utilities/lib/timestamp";
import { csvToJson, hashText, jsonToCsv, uuids } from "../Utilities/lib/misc";

const code = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return e instanceof DataError ? e.code : `other:${(e as Error).message}`;
  }
  return null;
};

/* ------------------------------- CSV -------------------------------- */

test("CSV: field ber-kutip berisi ENTER tidak memecah baris (bug lama)", () => {
  const rows = parseCsv('nama,alamat\nBudi,"Jl. Mawar 1\nBandung"\nSiti,Jakarta');
  assert.deepEqual(rows, [
    ["nama", "alamat"],
    ["Budi", "Jl. Mawar 1\nBandung"],
    ["Siti", "Jakarta"],
  ]);
});

test("CSV: pemisah dideteksi, bukan dicampur (bug lama: ; di nilai memecah kolom)", () => {
  assert.equal(detectDelimiter("a,b\n1,2"), ",");
  assert.equal(detectDelimiter("a;b;c\n1;2;3"), ";");
  assert.equal(detectDelimiter("a\tb\n1\t2"), "\t");
  assert.deepEqual(parseCsv("produk,catatan\nKopi,harga 10;20"), [
    ["produk", "catatan"],
    ["Kopi", "harga 10;20"],
  ]);
});

test("CSV: kutip ganda, CRLF, BOM, baris kosong, kutip tak tertutup", () => {
  assert.deepEqual(parseCsv('a,b\r\n"say ""hi""",2\r\n\r\n'), [
    ["a", "b"],
    ['say "hi"', "2"],
  ]);
  assert.equal(decodeText(new Uint8Array([0xef, 0xbb, 0xbf, 0x61])), "a");
  assert.equal(decodeText(new Uint8Array([0x63, 0x61, 0x66, 0xe9])), "café"); // Windows-1252
  assert.equal(code(() => parseCsv('a,b\n"x,1')), "csvUnclosedQuote");
});

test("CSV: toCsv mengutip bila perlu & round-trip", () => {
  const rows = [["a", "b"], ['x,"y"', "l1\nl2"], [1, null]];
  const csv = toCsv(rows);
  assert.equal(csv, 'a,b\r\n"x,""y""","l1\nl2"\r\n1,');
  assert.deepEqual(parseCsv(csv), [["a", "b"], ['x,"y"', "l1\nl2"], ["1", ""]]);
});

/* ------------------------------ Excel ------------------------------- */

test("Excel: header duplikat unik tanpa tabrakan (bug lama a, a_2, a_2)", () => {
  assert.deepEqual(uniqueHeaders(["a", "a", "a_2", ""]), ["a", "a_2", "a_2_2", "kolom_4"]);
  assert.deepEqual(arraysToObjects([["id", "id"], [1, 2], ["", ""], [3]]), [
    { id: 1, id_2: 2 },
    { id: 3, id_2: "" },
  ]);
});

test("Excel: rumus tanpa hasil tidak bocor sebagai objek", () => {
  assert.equal(formatCellValue({ formula: "A1+B1" }), "");
  assert.equal(formatCellValue({ formula: "A1+B1", result: 7 }), 7);
  assert.equal(formatCellValue({ sharedFormula: "A1", result: "x" }), "x");
  assert.equal(formatCellValue({ richText: [{ text: "a" }, { text: "b" }] }), "ab");
  assert.equal(formatCellValue(new Date("2024-01-02T03:04:05Z")), "2024-01-02T03:04:05.000Z");
});

const fileOf = (bytes: Uint8Array | string, name: string) => new File([bytes as BlobPart], name);

test("readWorkbook: .xls/.ods ditolak dengan pesan format lama; CSV & XLSX terbaca", async () => {
  await assert.rejects(readWorkbook(fileOf("x", "lama.xls")), (e) => e instanceof DataError && e.code === "legacyFormat");
  await assert.rejects(readWorkbook(fileOf("x", "a.ods")), (e) => e instanceof DataError && e.code === "legacyFormat");
  await assert.rejects(readWorkbook(fileOf("hello", "palsu.xlsx")), (e) => e instanceof DataError && e.code === "notXlsx");
  await assert.rejects(readWorkbook(fileOf("", "kosong.csv")), (e) => e instanceof DataError && e.code === "emptyFile");

  const csv = await readWorkbook(fileOf('id;nama\n1;"Budi; S."\n', "data.csv"));
  assert.deepEqual(worksheetToObjects(csv.worksheets[0]), [{ id: "1", nama: "Budi; S." }]);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Siswa");
  ws.addRow(["nim", "nama", "aktif"]);
  ws.addRow([123, "Ani", true]);
  const buf = new Uint8Array(await wb.xlsx.writeBuffer());
  const back = await readWorkbook(fileOf(buf, "siswa.xlsx"));
  assert.deepEqual(worksheetToObjects(back.getWorksheet("Siswa")!), [{ nim: 123, nama: "Ani", aktif: true }]);
});

/* ------------------------------- SQL -------------------------------- */

test("SQL: boolean per dialek (bug lama: 1/0 ditolak PostgreSQL)", () => {
  assert.equal(escapeValue(true, true, "postgres"), "TRUE");
  assert.equal(escapeValue(false, true, "mysql"), "0");
  assert.equal(escapeValue(true, true, "mssql"), "1");
});

test("SQL: objek bersarang tidak jadi [object Object]; backslash MySQL; N'' SQL Server", () => {
  assert.equal(escapeValue({ a: 1 }, true, "postgres"), `'{"a":1}'`);
  assert.equal(escapeValue("C:\\data\\", true, "mysql"), "'C:\\\\data\\\\'");
  assert.equal(escapeValue("C:\\data\\", true, "postgres"), "'C:\\data\\'");
  assert.equal(escapeValue("O'Brien", true, "generic"), "'O''Brien'");
  assert.equal(escapeValue("Café", true, "mssql"), "N'Café'");
  assert.equal(escapeValue(Number.NaN, true, "mysql"), "NULL");
  assert.equal(escapeValue("", false, "mysql"), "''");
});

test("SQL: identifier generic dikutip bila perlu; validasi kolom duplikat", () => {
  assert.equal(quoteIdent("nama", "generic"), "nama");
  assert.equal(quoteIdent("Nama Lengkap", "generic"), '"Nama Lengkap"');
  assert.equal(quoteIdent("a`b", "mysql"), "`a``b`");
  assert.deepEqual(validateColumns([{ source: "a", dbColumn: "x", included: true }, { source: "b", dbColumn: "X", included: true }]), { code: "duplicateColumn", name: "X" });
  assert.deepEqual(validateColumns([{ source: "a", dbColumn: "", included: false }]), { code: "noColumns" });
  assert.equal(validateColumns([{ source: "a", dbColumn: "", included: true }]), null);
});

test("SQL: buildSql bulk & single, tipe kolom campuran", () => {
  const rows = [{ id: 1, nama: "A" }, { id: 2, nama: null }];
  const cols = [{ source: "id", dbColumn: "id", included: true }, { source: "nama", dbColumn: "name", included: true }];
  assert.equal(buildSql(rows, "t", cols, "bulk", "postgres", true), 'INSERT INTO "t" ("id", "name") VALUES\n(1, \'A\'),\n(2, NULL);');
  assert.equal(buildSql(rows, "t", cols, "single", "generic", true, 1), "INSERT INTO t (id, name) VALUES (1, 'A');");
  assert.equal(detectColumnType([{ a: 1 }, { a: "x" }], "a"), "text");
  assert.equal(detectColumnType([{ a: 1 }, { a: "" }, { a: 2 }], "a"), "number");
  assert.equal(code(() => parseJsonText("[{")), "invalidJson");
});

test("safeFileName membersihkan karakter terlarang", () => {
  assert.equal(safeFileName("data/siswa:2024?"), "data_siswa_2024_");
  assert.equal(safeFileName("   "), "data");
});

/* ------------------------------- JSON ------------------------------- */

test("JSON: format, minify, posisi error baris/kolom", () => {
  assert.equal(formatJson('{"b":1,"a":[1,2]}', "2", true), '{\n  "a": [\n    1,\n    2\n  ],\n  "b": 1\n}');
  assert.equal(minifyJson('{ "a" : [ 1 , 2 ] }'), '{"a":[1,2]}');
  try {
    parseJsonStrict('{\n  "a": 1,\n  "b": }');
    assert.fail("harus error");
  } catch (e) {
    assert.ok(e instanceof DataError);
    assert.equal(e.code, "invalidJson");
    assert.equal(e.params.line, 3);
  }
  assert.equal(code(() => parseJsonStrict("   ")), "emptyInput");
  assert.deepEqual(jsonStats({ a: [1, { b: 2 }] }), { root: "object", size: 1, depth: 3, keys: 2 });
  assert.equal(jsonStats(Array.from({ length: 200000 }, (_, i) => i)).size, 200000);
});

/* --------------------------- JS Object ------------------------------ */

test("JS Object → JSON: kunci tanpa kutip, kutip tunggal, koma akhir, komentar, pembungkus kode", () => {
  const src = `// konfigurasi
export const config = {
  name: 'App', // nama
  "ver": 1.5e2,
  hex: 0xff, big: 1_000,
  tags: ['a', "b", \`c\`,],
  nested: { ok: true, nil: null, gone: undefined },
  esc: 'it\\'s \\u{1F600}',
};`;
  const r = jsObjectToJson(src, "2");
  assert.deepEqual(JSON.parse(r.output), { name: "App", ver: 150, hex: 255, big: 1000, tags: ["a", "b", "c"], nested: { ok: true, nil: null }, esc: "it's 😀" });
  assert.deepEqual(r.warnings, [{ code: "undefinedRemoved", params: { count: 1 } }]);
});

test("JS Object → JSON: kode berbahaya/ekspresi ditolak (tanpa eval)", () => {
  assert.equal(code(() => parseJsObject("{ a: alert(1) }")), "jsIdentifier");
  assert.equal(code(() => parseJsObject("{ a: function(){} }")), "jsExpression");
  assert.equal(code(() => parseJsObject("{ [k]: 1 }")), "jsComputedKey");
  assert.equal(code(() => parseJsObject("{ a }")), "jsShorthand");
  assert.equal(code(() => parseJsObject("{ a: `x${y}` }")), "jsTemplate");
  assert.equal(code(() => parseJsObject("{ a: NaN }")), "jsNonFinite");
  assert.equal(code(() => parseJsObject("{ a: 1 } x")), "jsTrailing");
  assert.equal(code(() => parseJsObject("{ a: 1 ")), "jsUnexpectedEnd");
  assert.equal(code(() => parseJsObject("{ a: 1 b: 2 }")), "jsExpectedComma");
  assert.equal(code(() => parseJsObject("[1,,2]")), "jsHole");
  const p = parseJsObject('{ "__proto__": { "x": 1 } }').value as Record<string, unknown>;
  assert.equal(({} as Record<string, unknown>).x, undefined); // tidak mencemari prototype
  assert.deepEqual(Object.keys(p), ["__proto__"]);
});

test("JSON → JS Object: kunci tanpa kutip, kutip tunggal, nama variabel", () => {
  const out = jsonToJsObject('{"name":"O\'Neil","first-name":"x","list":[1,{}],"e":[]}', DEFAULT_JS_PRINT);
  assert.equal(out, "const data = {\n  name: 'O\\'Neil',\n  'first-name': 'x',\n  list: [\n    1,\n    {}\n  ],\n  e: []\n};\n");
  assert.equal(printJs({ a: 1 }, { ...DEFAULT_JS_PRINT, variable: "", quote: "double", unquoteKeys: false, trailingComma: true }), '{\n  "a": 1,\n}');
  assert.equal(code(() => printJs({}, { ...DEFAULT_JS_PRINT, variable: "class" })), "badVariable");
  // round trip
  const back = parseJsObject(out).value;
  assert.deepEqual(back, { name: "O'Neil", "first-name": "x", list: [1, {}], e: [] });
});

/* ---------------------------- Encoding ------------------------------ */

test("Base64: UTF-8, URL-safe, padding, error", () => {
  assert.equal(encodeBase64("Halo dunia 👋"), "SGFsbyBkdW5pYSDwn5GL");
  assert.equal(decodeBase64("SGFsbyBkdW5pYSDwn5GL"), "Halo dunia 👋");
  assert.equal(encodeBase64("??>", true), "Pz8-");
  assert.equal(decodeBase64("Pz8-"), "??>");
  assert.equal(decodeBase64("YQ"), "a");
  assert.equal(decodeBase64("data:text/plain;base64,YQ=="), "a");
  assert.equal(code(() => decodeBase64("ab$c")), "base64Invalid");
  assert.equal(code(() => decodeBase64("abcde")), "base64Length");
  assert.equal(code(() => decodeBase64("/w==")), "base64Binary");
});

test("URL encode/decode & query", () => {
  assert.equal(encodeUrl("a b&c=é"), "a%20b%26c%3D%C3%A9");
  assert.equal(encodeUrl("https://x.id/a b?q=1", "uri"), "https://x.id/a%20b?q=1");
  assert.equal(decodeUrl("a+b%20c"), "a b c");
  assert.equal(decodeUrl("a+b", false), "a+b");
  assert.equal(code(() => decodeUrl("100%")), "urlMalformed");
  assert.deepEqual(parseQuery("https://x.id/?a=1&b=dua%20kata#h"), [["a", "1"], ["b", "dua kata"]]);
});

/* ------------------------------ JWT --------------------------------- */

const b64url = (o: unknown) => encodeBase64(JSON.stringify(o), true);
test("JWT: decode header/payload, status waktu, error", () => {
  const tok = `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({ sub: "1", iat: 1700000000, exp: 1700003600 })}.sig`;
  const d = decodeJwt(`Bearer ${tok}`, 1700000100 * 1000);
  assert.equal(d.header.alg, "HS256");
  assert.equal(d.status, "valid-time");
  assert.equal(d.times.find((t) => t.claim === "exp")!.iso, "2023-11-14T23:13:20.000Z");
  assert.equal(decodeJwt(tok, 1700003600 * 1000).status, "expired");
  assert.equal(code(() => decodeJwt("a.b")), "jwtParts");
  assert.equal(code(() => decodeJwt("a.b.c.d.e")), "jwtEncrypted");
  assert.equal(code(() => decodeJwt("!!!.e30.x")), "jwtBase64");
  assert.equal(code(() => decodeJwt(`${encodeBase64("nope", true)}.e30.x`)), "jwtJson");
});

/* --------------------------- Timestamp ------------------------------ */

test("Timestamp: deteksi satuan & konversi", () => {
  assert.equal(guessUnit("1700000000"), "s");
  assert.equal(guessUnit("1700000000000"), "ms");
  assert.equal(guessUnit("1700000000000000"), "us");
  assert.equal(parseTimestamp("1700000000").iso, "2023-11-14T22:13:20.000Z");
  assert.equal(parseTimestamp("1700000000123").millis, 1700000000123);
  assert.equal(parseTimestamp("1700000000", "ms").iso, "1970-01-20T16:13:20.000Z");
  assert.equal(parseTimestamp("2024-02-29T12:00:00Z").seconds, 1709208000);
  assert.equal(parseTimestamp("2024-02-29 12:00:00Z").seconds, 1709208000);
  assert.equal(code(() => parseTimestamp("kemarin")), "timestampFormat");
  assert.equal(code(() => parseTimestamp("99999999999999999999999")), "timestampRange");
});

/* ---------------------------- Lainnya ------------------------------- */

test("Hash SHA-256, UUID v4, JSON ↔ CSV", async () => {
  assert.equal(await hashText("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(await hashText("abc", "SHA-1", "base64"), "qZk+NkcGgWq6PiVxeFDCbJzQ2J0=");
  const u = uuids(3).split("\n");
  assert.equal(u.length, 3);
  assert.ok(u.every((x) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(x)));
  assert.equal(jsonToCsv('[{"a":1,"b":"x,y"},{"a":2,"c":{"d":1}}]').output, 'a,b,c\r\n1,"x,y",\r\n2,,"{""d"":1}"');
  assert.equal(csvToJson("a,a\n1,2", true, 0).output, '[{"a":"1","a_2":"2"}]');
  assert.equal(code(() => jsonToCsv("[1,2]")), "csvNeedsObjects");
});
