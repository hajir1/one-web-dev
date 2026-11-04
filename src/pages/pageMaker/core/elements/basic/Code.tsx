import { useState } from "react";
import { Trans } from "react-i18next";
import { Code2, Info } from "lucide-react";
import type { PanelSection, Updater } from "../../ui/PanelStyling";
import { defineElement } from "../../helpers/elementDefinition";
import { h, raw } from "../../helpers/markup";
import { Segmented } from "../../helpers/SmallUIHelpers";
import CodeEditor from "../../ui/CodeEditor";
import i18n from "../../../../../i18n";

/* ================================================================== */
/* Code Element — the user's raw HTML + CSS + JavaScript                */
/*                                                                    */
/* - HTML: rendered as is (<script> tags removed; use the JS tab).      */
/*   React: dangerouslySetInnerHTML · Vue: v-html · Svelte: {@html} ·   */
/*   Angular: [innerHTML] + DomSanitizer.bypassSecurityTrustHtml.       */
/* - CSS: scoped to this element (`&` = the wrapper), so it does not leak. */
/* - JS : Custom JS runtime (element, on, onCleanup, …) — runs in       */
/*        Preview & export, not on the design canvas.                   */
/* Not for framework components (JSX/SFC): those are still treated as HTML. */
/* ================================================================== */

export interface CodeState {
  html: string;
  css: string;
  js: string;
}

const DEFAULT_STATE: CodeState = {
  html: `<div class="kotak-info">
  <strong>Halo dari Code Element!</strong>
  <p>Tulis HTML Anda sendiri di sini.</p>
</div>`,
  css: `.kotak-info {
  padding: 16px;
  border-radius: 8px;
  background: #eff6ff;
  color: #1e3a8a;
}`,
  js: "",
};

const MAX_CODE_HTML = 50000;

/** Strips <script>…</script> (not run by innerHTML/frameworks; use the JavaScript tab). */
export function stripScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script\s*>/gi, "").replace(/<\/?script\b[^>]*>/gi, "");
}

export const hasScriptTag = (html: string) => /<script\b/i.test(html);

/** A JS string that is safe to put inside an SFC <script> block. */
const jsString = (s: string) =>
  JSON.stringify(s).replace(/<\//g, "<\\/").replace(/[\u2028\u2029]/g, " ");

function CodeTabs({ s, update }: { s: CodeState; update: Updater<CodeState> }) {
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  return (
    <div className="flex flex-col gap-2" data-testid="code-element-editor">
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "html", label: "HTML" },
          { value: "css", label: "CSS" },
          { value: "js", label: "JavaScript" },
        ]}
      />
      {tab === "html" && (
        <>
          <CodeEditor
            lang="html"
            label={i18n.t("el.f.htmlCode")}
            testId="code-html"
            rows={10}
            maxLength={MAX_CODE_HTML}
            value={s.html}
            onChange={(v) => update("html", v)}
          />
          {hasScriptTag(s.html) && (
            <p role="alert" className="text-[11px] text-amber-700 dark:text-amber-400">
              {i18n.t("el.f.codeScriptWarning")}
            </p>
          )}
        </>
      )}
      {tab === "css" && (
        <CodeEditor lang="css" label={i18n.t("el.f.cssCode")} testId="code-css" rows={10} value={s.css} onChange={(v) => update("css", v)} />
      )}
      {tab === "js" && (
        <CodeEditor
          lang="js"
          label={i18n.t("el.f.jsCode")}
          testId="code-js"
          rows={10}
          value={s.js}
          onChange={(v) => update("js", v)}
          placeholder={'element.querySelector("strong").textContent = "Halo!";'}
        />
      )}
      <div className="flex gap-1.5 rounded-lg bg-blue-50 p-2.5 text-[11px] leading-snug text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
        <Info className="mt-px h-3.5 w-3.5 shrink-0" />
        <span>
          <Trans i18nKey="el.f.codeInfo" components={{ b: <b />, code: <code /> }} />
        </span>
      </div>
    </div>
  );
}

function codeSections(s: CodeState, update: Updater<CodeState>): PanelSection[] {
  return [{ id: "code", label: i18n.t("el.f.code"), icon: Code2, content: <CodeTabs s={s} update={update} /> }];
}

export const codeElement = defineElement<CodeState>({
  type: "code",
  label: "Code",
  group: "Elemen",
  componentName: "CodeBlock",
  defaultClassName: "custom-code",
  defaults: DEFAULT_STATE,
  spec: (s, cls) => {
    const html = stripScripts(String(s.html ?? "")).trim();
    const str = jsString(html);
    return {
      css: `.${cls} {\n  display: block;\n  min-width: 0;\n}\n`,
      markup: h("div", { class: cls }, raw(html)),
      // Frameworks: HTML is inserted as a string, not a template ({{ }} / { } braces are not interpreted).
      vue: {
        template: `<div class="${cls}" v-html="html"></div>`,
        script: `const html = ${str};`,
      },
      svelte: {
        markup: `<div class="${cls}">{@html html}</div>`,
        script: `const html = ${str};`,
      },
      angular: {
        template: `<div class="${cls}" [innerHTML]="html"></div>`,
        classBody: `html: SafeHtml;\n\n// The user's HTML is intentionally not sanitized so it renders exactly as in Page Maker.\nconstructor(sanitizer: DomSanitizer) {\n  this.html = sanitizer.bypassSecurityTrustHtml(${str});\n}`,
        headerImports: `import { DomSanitizer, SafeHtml } from '@angular/platform-browser';`,
      },
    };
  },
  customCode: (s) => ({ css: s.css, js: s.js }),
  sections: codeSections,
});
