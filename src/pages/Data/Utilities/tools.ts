import { ArrowLeftRight, Binary, Braces, CaseSensitive, Clock, Code2, Contrast, FileCode2, FileDiff, FileJson, Fingerprint, Hash, KeyRound, Link2, Minimize2, Regex, Sheet, Text, Timer, type LucideIcon } from "lucide-react";
import i18n from "../../../i18n";
import { DataError } from "../shared/errors";
import { formatJson, jsonStats, minifyJson, parseJsonStrict, type Indent } from "../shared/json";
import type { Delimiter } from "../shared/csv";
import { jsObjectToJson, jsonToJsObject, type JsPrintOptions } from "./lib/jsObject";
import { decodeBase64, decodeUrl, encodeBase64, encodeUrl, parseQuery } from "./lib/encoding";
import { csvToJson, hashText, jsonToCsv, uuids, type HashAlgo } from "./lib/misc";
import { convertCase, describeCron, dummyText, nextRuns, parseCron, type CaseId } from "./lib/textTools";

/* ================================================================== */
/* Developer Utilities list: the ONE source for the hub, routes, and docs. */
/* Every tool runs 100% in the browser: input is never sent to a server. */
/* UI text: data.util.tools.<id>.* (locales).                            */
/* ================================================================== */

export type ToolId =
  | "json-format"
  | "json-minify"
  | "json-to-js"
  | "js-to-json"
  | "json-csv"
  | "base64"
  | "url"
  | "jwt"
  | "hash"
  | "timestamp"
  | "uuid"
  // v10
  | "regex"
  | "diff"
  | "case"
  | "lorem"
  | "cron"
  | "contrast"
  | "svg";
export type ToolGroup = "json" | "encoding" | "generate" | "text" | "web";

export type OptionDef =
  | { id: string; kind: "select"; values: string[]; default: string; literal?: boolean }
  | { id: string; kind: "toggle"; default: boolean }
  | { id: string; kind: "text"; default: string; placeholder?: string }
  | { id: string; kind: "number"; default: number; min: number; max: number };

export type OptionValues = Record<string, string | boolean | number>;

export interface ToolResult {
  output: string;
  /** Small summary under the output (labels already translated). */
  stats?: { label: string; value: string }[];
  warnings?: string[];
}

interface ToolAction {
  id: string;
  run: (input: string, o: OptionValues) => ToolResult | Promise<ToolResult>;
  /** The result can be swapped into the input for another action (e.g. encode ↔ decode). */
  primary?: boolean;
}

export interface ToolDef {
  id: ToolId;
  group: ToolGroup;
  icon: LucideIcon;
  /** "text" = input→output generik; "custom" = tampilan khusus (JWT, timestamp). */
  view: "text" | "jwt" | "timestamp" | "regex" | "diff" | "contrast";
  /** Input/output language for naming the downloaded file. */
  ext?: string;
  options?: OptionDef[];
  actions?: ToolAction[];
  /** Tools without input (generators). */
  noInput?: boolean;
  sample?: string;
}

const t = (k: string, o?: Record<string, unknown>) => i18n.t(k, o);
const fmtNum = (n: number) => n.toLocaleString(i18n.language === "en" ? "en-US" : "id-ID");
const sizeStats = (input: string, output: string) => {
  const a = new TextEncoder().encode(input).length;
  const b = new TextEncoder().encode(output).length;
  return [
    { label: t("data.util.stats.inputSize"), value: `${fmtNum(a)} B` },
    { label: t("data.util.stats.outputSize"), value: `${fmtNum(b)} B` },
    ...(a > 0 ? [{ label: t("data.util.stats.change"), value: `${b <= a ? "−" : "+"}${Math.abs(Math.round(((b - a) / a) * 100))}%` }] : []),
  ];
};
const structStats = (text: string) => {
  const s = jsonStats(parseJsonStrict(text));
  return [
    { label: t("data.util.stats.root"), value: s.root },
    { label: s.root === "array" ? t("data.util.stats.items") : t("data.util.stats.keys"), value: fmtNum(s.size) },
    { label: t("data.util.stats.depth"), value: String(s.depth) },
  ];
};
const indentOpt: OptionDef = { id: "indent", kind: "select", values: ["2", "4", "tab"], default: "2" };

export const TOOLS: ToolDef[] = [
  {
    id: "json-format",
    group: "json",
    icon: Braces,
    view: "text",
    ext: "json",
    options: [indentOpt, { id: "sortKeys", kind: "toggle", default: false }],
    actions: [
      { id: "format", primary: true, run: (i, o) => ({ output: formatJson(i, o.indent as Indent, !!o.sortKeys), stats: structStats(i) }) },
      { id: "validate", run: (i) => ({ output: (parseJsonStrict(i), t("data.util.validJson")), stats: structStats(i) }) },
    ],
    sample: '{"id":7,"name":"OneWebDev","tags":["json","tools"],"owner":{"name":"Hajir","active":true}}',
  },
  {
    id: "json-minify",
    group: "json",
    icon: Minimize2,
    view: "text",
    ext: "json",
    actions: [{ id: "minify", primary: true, run: (i) => { const out = minifyJson(i); return { output: out, stats: sizeStats(i, out) }; } }],
    sample: '{\n  "id": 7,\n  "tags": [\n    "json",\n    "tools"\n  ]\n}',
  },
  {
    id: "json-to-js",
    group: "json",
    icon: Code2,
    view: "text",
    ext: "js",
    options: [
      { id: "variable", kind: "text", default: "data", placeholder: "data" },
      { id: "quote", kind: "select", values: ["single", "double"], default: "single" },
      indentOpt,
      { id: "unquoteKeys", kind: "toggle", default: true },
      { id: "trailingComma", kind: "toggle", default: false },
    ],
    actions: [
      {
        id: "convert",
        primary: true,
        run: (i, o) => ({
          output: jsonToJsObject(i, {
            variable: String(o.variable ?? ""),
            quote: o.quote as JsPrintOptions["quote"],
            indent: o.indent as Indent,
            unquoteKeys: !!o.unquoteKeys,
            trailingComma: !!o.trailingComma,
          }),
        }),
      },
    ],
    sample: '{"name":"Kopi Susu","price":18000,"in-stock":true,"sizes":["S","M","L"]}',
  },
  {
    id: "js-to-json",
    group: "json",
    icon: FileJson,
    view: "text",
    ext: "json",
    options: [indentOpt],
    actions: [
      {
        id: "convert",
        primary: true,
        run: (i, o) => {
          const r = jsObjectToJson(i, o.indent as Indent);
          return { output: r.output, warnings: r.warnings.map((w) => t(`data.util.warnings.${w.code}`, w.params)) };
        },
      },
    ],
    sample: "const product = {\n  name: 'Kopi Susu', // product name\n  price: 18_000,\n  sizes: ['S', 'M', 'L',],\n  promo: undefined,\n};",
  },
  {
    id: "json-csv",
    group: "json",
    icon: Sheet,
    view: "text",
    ext: "csv",
    options: [
      { id: "delimiter", kind: "select", values: [",", ";", "\t"], default: ",", literal: true },
      { id: "header", kind: "toggle", default: true },
    ],
    actions: [
      {
        id: "toCsv",
        primary: true,
        run: (i, o) => {
          const r = jsonToCsv(i, o.delimiter as Delimiter);
          return { output: r.output, stats: [{ label: t("data.util.stats.rows"), value: fmtNum(r.rows) }, { label: t("data.util.stats.cols"), value: fmtNum(r.cols) }] };
        },
      },
      {
        id: "toJson",
        run: (i, o) => {
          const r = csvToJson(i, !!o.header);
          return { output: r.output, stats: [{ label: t("data.util.stats.rows"), value: fmtNum(r.rows) }, { label: t("data.util.stats.cols"), value: fmtNum(r.cols) }] };
        },
      },
    ],
    sample: '[{"sku":"A-1","name":"Kopi, Susu","price":18000},{"sku":"A-2","name":"Teh","price":9000}]',
  },
  {
    id: "base64",
    group: "encoding",
    icon: Binary,
    view: "text",
    ext: "txt",
    options: [{ id: "urlSafe", kind: "toggle", default: false }],
    actions: [
      { id: "encode", primary: true, run: (i, o) => ({ output: encodeBase64(i, !!o.urlSafe), stats: sizeStats(i, encodeBase64(i, !!o.urlSafe)) }) },
      { id: "decode", run: (i) => ({ output: decodeBase64(i) }) },
    ],
    sample: "Halo, OneWebDev! 👋",
  },
  {
    id: "url",
    group: "encoding",
    icon: Link2,
    view: "text",
    ext: "txt",
    options: [
      { id: "mode", kind: "select", values: ["component", "uri"], default: "component" },
      { id: "plusAsSpace", kind: "toggle", default: true },
    ],
    actions: [
      { id: "encode", primary: true, run: (i, o) => ({ output: encodeUrl(i, o.mode as "component" | "uri") }) },
      { id: "decode", run: (i, o) => ({ output: decodeUrl(i, !!o.plusAsSpace) }) },
      {
        id: "parseQuery",
        run: (i) => {
          const pairs = parseQuery(i);
          if (!pairs.length) throw new DataError("noQuery");
          return { output: JSON.stringify(Object.fromEntries(pairs.map(([k, v]) => [k, v])), null, 2), stats: [{ label: t("data.util.stats.params"), value: String(pairs.length) }] };
        },
      },
    ],
    sample: "https://onewebdev.id/cari?q=kopi susu&kategori=minuman#hasil",
  },
  { id: "jwt", group: "encoding", icon: KeyRound, view: "jwt" },
  {
    id: "hash",
    group: "encoding",
    icon: Hash,
    view: "text",
    ext: "txt",
    options: [
      { id: "algo", kind: "select", values: ["SHA-256", "SHA-1", "SHA-384", "SHA-512"], default: "SHA-256", literal: true },
      { id: "format", kind: "select", values: ["hex", "base64"], default: "hex", literal: true },
    ],
    actions: [{ id: "hash", primary: true, run: async (i, o) => ({ output: await hashText(i, o.algo as HashAlgo, o.format as "hex" | "base64") }) }],
    sample: "password123",
  },
  { id: "timestamp", group: "generate", icon: Clock, view: "timestamp" },
  {
    id: "uuid",
    group: "generate",
    icon: Fingerprint,
    view: "text",
    ext: "txt",
    noInput: true,
    options: [
      { id: "count", kind: "number", default: 5, min: 1, max: 500 },
      { id: "upper", kind: "toggle", default: false },
    ],
    actions: [{ id: "generate", primary: true, run: (_i, o) => ({ output: uuids(Number(o.count), !!o.upper) }) }],
  },
  /* ------------------------------- v10 ------------------------------- */
  { id: "regex", group: "text", icon: Regex, view: "regex" },
  { id: "diff", group: "text", icon: FileDiff, view: "diff" },
  {
    id: "case",
    group: "text",
    icon: CaseSensitive,
    view: "text",
    ext: "txt",
    actions: (["slug", "camel", "pascal", "snake", "constant", "title", "sentence", "upper", "lower"] as CaseId[]).map((id, i) => ({
      id: `case-${id}`,
      primary: i === 0,
      run: (input: string) => ({ output: convertCase(input, id) }),
    })),
    sample: "Promo Kopi Susu Gula Aren\nharga spesial akhir pekan",
  },
  {
    id: "lorem",
    group: "text",
    icon: Text,
    view: "text",
    ext: "txt",
    noInput: true,
    options: [
      { id: "paragraphs", kind: "number", default: 3, min: 1, max: 50 },
      { id: "textLang", kind: "select", values: ["lorem", "id"], default: "lorem" },
    ],
    actions: [
      {
        id: "generateText",
        primary: true,
        run: (_i, o) => {
          const out = dummyText(Number(o.paragraphs), o.textLang as "lorem" | "id");
          return { output: out, stats: [{ label: t("data.util.stats.words"), value: fmtNum(out.split(/\s+/).filter(Boolean).length) }] };
        },
      },
    ],
  },
  {
    id: "cron",
    group: "generate",
    icon: Timer,
    view: "text",
    ext: "txt",
    actions: [
      {
        id: "explain",
        primary: true,
        run: (input) => {
          const c = parseCron(input);
          const lang = i18n.language?.startsWith("en") ? "en" : "id";
          const runs = nextRuns(c, new Date(), 5).map((d) => d.toLocaleString(lang === "en" ? "en-US" : "id-ID", { dateStyle: "full", timeStyle: "short" }));
          return { output: `${describeCron(c, lang)}\n\n${t("data.util.cron.next")}\n${runs.map((r) => `• ${r}`).join("\n") || t("data.util.cron.none")}` };
        },
      },
    ],
    sample: "30 8 * * 1-5",
  },
  { id: "contrast", group: "web", icon: Contrast, view: "contrast" },
  {
    id: "svg",
    group: "web",
    icon: FileCode2,
    view: "text",
    ext: "svg",
    options: [
      { id: "multipass", kind: "toggle", default: true },
      { id: "keepViewBox", kind: "toggle", default: true },
    ],
    actions: [
      {
        id: "optimize",
        primary: true,
        run: async (input, o) => {
          const { optimizeSvg } = await import("./lib/svg");
          const out = optimizeSvg(input, { multipass: !!o.multipass, keepViewBox: !!o.keepViewBox });
          return { output: out, stats: sizeStats(input, out) };
        },
      },
    ],
    sample: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Made with the editor -->\n<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\n  <g>\n    <circle cx="12.000" cy="12.000" r="10.000" fill="#3B68F0"/>\n  </g>\n</svg>',
  },
];

export const TOOL_GROUPS: ToolGroup[] = ["json", "encoding", "text", "web", "generate"];
export const TOOL_BY_ID = Object.fromEntries(TOOLS.map((x) => [x.id, x])) as Record<ToolId, ToolDef>;
export const isToolId = (v: unknown): v is ToolId => typeof v === "string" && v in TOOL_BY_ID;
export const SWAP_ICON = ArrowLeftRight;

export function defaultOptions(def: ToolDef): OptionValues {
  return Object.fromEntries((def.options ?? []).map((o) => [o.id, o.default]));
}
