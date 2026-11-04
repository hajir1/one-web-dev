import { escapeHtml, escapeText, Framework } from "./generatorCss";
import type { GeneratedFile } from "../ui/CodeExportPanel";
import { IMG_FALLBACK_TAG } from "../../helpers/imagePlaceholder";

/* ================================================================== */
/* Mini markup tree → HTML & JSX from ONE source                       */
/*                                                                    */
/* Previously each element wrote separate HTML and JSX templates       */
/* as manual strings (prone to drift & forgotten escaping). Now markup */
/* is built once with h(), then rendered to HTML (index.html, Vue,     */
/* Svelte, Angular) or JSX (React) with the correct attribute rules.   */
/*                                                                    */
/*   h("button", { class: "btn", type: "button" }, "Klik")            */
/*   h("span", { class: "btn__icon" }, raw(svg))  // SVG mentah        */
/*                                                                    */
/* Awalan atribut menentukan target:                                  */
/*   "html:"   → all HTML templates (index.html, Vue, Svelte, Angular) */
/*   "jsx:"    → React (+ preview)                                     */
/*   "static:" → index.html only                                       */
/*   "vue:" / "svelte:" / "angular:" / "react:" → that framework only  */
/* A { expr: "..." } value = an expression: written {expr} in JSX & Svelte, */
/* written "expr" in Vue/Angular (use single quotes inside it).        */
/* ================================================================== */

interface Expr {
  expr: string;
}
type AttrValue = string | number | boolean | Expr | null | undefined;
export type Attrs = Record<string, AttrValue>;

export interface MElement {
  kind: "el";
  tag: string;
  attrs: Attrs;
  children: MChild[];
}
interface MText {
  kind: "text";
  value: string;
}
interface MRaw {
  kind: "raw";
  html: string;
}
type MChild = MElement | MText | MRaw;
export type MNode = MChild | null | false | undefined;

export function h(
  tag: string,
  attrs: Attrs = {},
  ...children: (MNode | string | (MNode | string)[])[]
): MElement {
  const flat: MChild[] = [];
  const push = (c: MNode | string) => {
    if (typeof c === "string") flat.push({ kind: "text", value: c });
    else if (c) flat.push(c);
  };
  children.forEach((c) => (Array.isArray(c) ? c.forEach(push) : push(c)));
  return { kind: "el", tag, attrs, children: flat };
}

/** Raw HTML markup (SVG icons). In JSX it is rendered via dangerouslySetInnerHTML,
 * so raw() must be the ONLY child of its wrapping element. */
export const raw = (html: string): MRaw => ({ kind: "raw", html });

const VOID = new Set(["img", "input", "br", "hr", "meta", "link"]);
const JSX_ATTR: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  checked: "defaultChecked",
  readonly: "readOnly",
  maxlength: "maxLength",
  colspan: "colSpan",
  rowspan: "rowSpan",
  fetchpriority: "fetchPriority",
};

export type RenderTarget = "static" | "react" | "vue" | "svelte" | "angular";
const PREFIXES = ["html:", "jsx:", "static:", "react:", "vue:", "svelte:", "angular:"];

/** Does an attribute prefixed with `prefix` apply to this target? */
function prefixApplies(prefix: string, target: RenderTarget): boolean {
  if (prefix === "html:") return target !== "react";
  if (prefix === "jsx:") return target === "react";
  return prefix === `${target}:`;
}

/** Normalize the attribute name for the target; null = skip. */
function resolveAttrKey(rawKey: string, target: RenderTarget): string | null {
  const prefix = PREFIXES.find((p) => rawKey.startsWith(p));
  if (prefix) {
    if (!prefixApplies(prefix, target)) return null;
    rawKey = rawKey.slice(prefix.length);
  }
  return target === "react" ? (JSX_ATTR[rawKey] ?? rawKey) : rawKey;
}

function attrsToString(attrs: Attrs, target: RenderTarget): string {
  const out: string[] = [];
  for (const [rawKey, v] of Object.entries(attrs)) {
    if (v === false || v === null || v === undefined) continue;
    const key = resolveAttrKey(rawKey, target);
    if (!key) continue;
    if (v === true) out.push(key);
    else if (typeof v === "object")
      out.push(
        target === "react" || target === "svelte"
          ? `${key}={${v.expr}}`
          : `${key}="${v.expr}"`,
      );
    else out.push(`${key}="${escapeHtml(String(v))}"`);
  }
  return out.length ? " " + out.join(" ") : "";
}

function isInline(el: MElement) {
  // multi-line raw (HTML/script blocks) must not be put inline.
  return el.children.every((c) => c.kind !== "el" && !(c.kind === "raw" && c.html.includes("\n")));
}

function render(node: MNode, mode: RenderTarget, depth: number): string {
  if (!node) return "";
  const pad = "  ".repeat(depth);
  if (node.kind === "text") return pad + escapeText(node.value);
  if (node.kind === "raw") {
    // Multi-line raw (e.g. <script> content/HTML blocks) is indented per line too.
    return node.html
      .split("\n")
      .map((l) => (l.trim() ? pad + l : l))
      .join("\n");
  }

  const attrs = attrsToString(node.attrs, mode);
  if (VOID.has(node.tag)) return `${pad}<${node.tag}${attrs} />`;

  const onlyRaw =
    node.children.length === 1 && node.children[0]?.kind === "raw"
      ? (node.children[0] as MRaw)
      : null;
  if (onlyRaw && mode === "react") {
    return `${pad}<${node.tag}${attrs} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(onlyRaw.html)} }} />`;
  }
  if (node.children.length === 0) {
    // Components (PascalCase: <Tabs1 />) are written self-closing; HTML tags stay paired.
    return /^[A-Z]/.test(node.tag)
      ? `${pad}<${node.tag}${attrs} />`
      : `${pad}<${node.tag}${attrs}></${node.tag}>`;
  }

  if (isInline(node)) {
    const inner = node.children
      .map((c) => (c.kind === "text" ? escapeText(c.value) : c.kind === "raw" ? c.html : ""))
      .join("");
    return `${pad}<${node.tag}${attrs}>${inner}</${node.tag}>`;
  }
  const inner = node.children.map((c) => render(c, mode, depth + 1)).join("\n");
  return `${pad}<${node.tag}${attrs}>\n${inner}\n${pad}</${node.tag}>`;
}

/** Renders to a template string for one framework target. */
export function renderFor(target: RenderTarget, nodes: MNode | MNode[], depth = 0): string {
  const list = (Array.isArray(nodes) ? nodes : [nodes]).filter(Boolean);
  if (target === "react" && list.length > 1) {
    const pad = "  ".repeat(depth);
    return `${pad}<>\n${list.map((n) => render(n, target, depth + 1)).join("\n")}\n${pad}</>`;
  }
  return list.map((n) => render(n, target, depth)).join("\n");
}

export const renderHtml = (nodes: MNode | MNode[], depth = 0) => renderFor("static", nodes, depth);
export const renderJsx = (nodes: MNode | MNode[], depth = 0) => renderFor("react", nodes, depth);

/** Icon (optional) + text, ordered by position; used by many elements. */
export function iconTextNodes(
  iconMarkup: string | null,
  iconPosition: "left" | "right",
  text: string,
  cls: string,
): (MNode | string)[] {
  if (!iconMarkup) return [text];
  const icon = h("span", { class: `${cls}__icon`, "aria-hidden": "true" }, raw(iconMarkup));
  const label = h("span", { class: `${cls}__text` }, text);
  return iconPosition === "left" ? [icon, label] : [label, icon];
}

/* ================================================================== */
/* Generator file multi-framework bersama                              */
/* ================================================================== */

export interface FrameworkSpec {
  /** PascalCase, e.g. "Button" → Button.jsx, button.component.ts. */
  name: string;
  css: string;
  /** Static markup. Used by every framework except those overridden. */
  markup?: MNode | MNode[];
  /** Override for interactive components (Tabs, etc.). */
  html?: { body?: string; script?: string; /** Extra tags in <head> (e.g. CDN library CSS). */ head?: string; /** Tags before </body> (e.g. CDN library JS). */ tail?: string };
  react?: { imports?: string; pre?: string; jsx?: string };
  vue?: {
    template?: string;
    script?: string;
    /** Global CSS (a `<style>` block without scoped), e.g. Custom CSS that must reach child components. */
    globalCss?: string;
  };
  svelte?: { markup?: string; script?: string };
  angular?: {
    template?: string;
    classBody?: string;
    /** A standalone component that uses other components: `imports: [...]` + their file imports. */
    standalone?: boolean;
    imports?: { name: string; path: string }[];
    /** Extra symbols from '@angular/core' (e.g. ElementRef, ViewChild). */
    coreImports?: string[];
    /** Extra (free-form) import lines at the top of the file. */
    headerImports?: string;
    /** Interfaces the class implements (e.g. AfterViewInit). */
    implementsList?: string[];
    /** `encapsulation: ViewEncapsulation.None` (component CSS becomes global). */
    encapsulationNone?: boolean;
  };
  /** Wrap the rendered markup per framework (e.g. Svelte {#if}, Angular @if). */
  wrap?: Partial<Record<RenderTarget, (markup: string) => string>>;
}

export function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function indent(str: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return str
    .split("\n")
    .map((l) => (l.trim() ? pad + l : l))
    .join("\n");
}

export function generateFrameworkFiles(
  framework: Framework,
  spec: FrameworkSpec,
): GeneratedFile[] {
  const { name, css } = spec;
  const kebab = toKebab(name);
  const m = (t: RenderTarget) => {
    const out = spec.markup ? renderFor(t, spec.markup) : "";
    return spec.wrap?.[t] ? spec.wrap[t]!(out) : out;
  };

  switch (framework) {
    case "blade":
    case "html": {
      const body = spec.html?.body ?? m("static");
      const script = spec.html?.script;
      const head = spec.html?.head ? `\n${indent(spec.html.head, 2)}` : "";
      const tail = spec.html?.tail ? `\n${indent(spec.html.tail, 2)}` : "";
      const files: GeneratedFile[] = [
        {
          name: "index.html",
          lang: "html",
          content: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name}</title>
  <link rel="stylesheet" href="style.css" />
  ${IMG_FALLBACK_TAG}${head}
</head>
<body>
${indent(body, 2)}${tail}${script ? `\n  <script src="script.js"></script>` : ""}
</body>
</html>
`,
        },
        { name: "style.css", lang: "css", content: css },
      ];
      if (script) files.push({ name: "script.js", lang: "js", content: script.trim() + "\n" });
      return files;
    }

    case "react": {
      const jsx = spec.react?.jsx ?? (spec.markup ? m("react") : "null");
      const imports = spec.react?.imports ? spec.react.imports.trim() + "\n" : "";
      const pre = spec.react?.pre ? indent(spec.react.pre.trim(), 2) + "\n\n" : "";
      return [
        {
          name: `${name}.jsx`,
          lang: "jsx",
          content: `${imports}import "./${name}.css";

export default function ${name}() {
${pre}  return (
${indent(jsx, 4)}
  );
}
`,
        },
        { name: `${name}.css`, lang: "css", content: css },
      ];
    }

    case "vue": {
      const template = spec.vue?.template ?? m("vue");
      const script = spec.vue?.script?.trim();
      return [
        {
          name: `${name}.vue`,
          lang: "vue",
          content: `<template>
${indent(template, 2)}
</template>
${script ? `\n<script setup>\n${script}\n</script>\n` : ""}
<style scoped>
${css}</style>
${spec.vue?.globalCss?.trim() ? `\n<style>\n${spec.vue.globalCss.trim()}\n</style>\n` : ""}`,
        },
      ];
    }

    case "svelte": {
      const markup = spec.svelte?.markup ?? m("svelte");
      const script = spec.svelte?.script?.trim();
      return [
        {
          name: `${name}.svelte`,
          lang: "svelte",
          content: `${script ? `<script>\n${indent(script, 2)}\n</script>\n\n` : ""}${markup}

<style>
${css}</style>
`,
        },
      ];
    }

    case "angular": {
      const template = spec.angular?.template ?? m("angular");
      const body = spec.angular?.classBody?.trim();
      const uses = spec.angular?.imports ?? [];
      const standalone = spec.angular?.standalone || uses.length > 0;
      const useImports = uses.map((u) => `import { ${u.name} } from '${u.path}';\n`).join("");
      const ng = spec.angular ?? {};
      const coreNames = ["Component", ...(ng.encapsulationNone ? ["ViewEncapsulation"] : []), ...(ng.coreImports ?? [])];
      const header = ng.headerImports?.trim() ? `${ng.headerImports.trim()}\n` : "";
      const standaloneMeta = standalone
        ? `\n  standalone: true,${uses.length ? `\n  imports: [${uses.map((u) => u.name).join(", ")}],` : ""}`
        : "";
      const encapsulation = ng.encapsulationNone ? `\n  encapsulation: ViewEncapsulation.None,` : "";
      const impl = ng.implementsList?.length ? ` implements ${ng.implementsList.join(", ")}` : "";
      return [
        {
          name: `${kebab}.component.ts`,
          lang: "ts",
          content: `import { ${[...new Set(coreNames)].join(", ")} } from '@angular/core';
${header}${useImports}
@Component({
  selector: 'app-${kebab}',${standaloneMeta}${encapsulation}
  templateUrl: './${kebab}.component.html',
  styleUrls: ['./${kebab}.component.css'],
})
export class ${name}Component${impl} {${body ? `\n${indent(body, 2)}\n` : ""}}
`,
        },
        { name: `${kebab}.component.html`, lang: "html", content: template + "\n" },
        { name: `${kebab}.component.css`, lang: "css", content: css },
      ];
    }
  }
}
