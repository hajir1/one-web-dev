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
/* Code Element — HTML mentah + CSS + JavaScript milik pengguna         */
/*                                                                    */
/* - HTML: dirender apa adanya (tag <script> dibuang; pakai tab JS).    */
/*   React: dangerouslySetInnerHTML · Vue: v-html · Svelte: {@html} ·   */
/*   Angular: [innerHTML] + DomSanitizer.bypassSecurityTrustHtml.       */
/* - CSS: di-scope ke elemen ini (`&` = pembungkus), jadi tidak bocor.  */
/* - JS : runtime Custom JS (element, on, onCleanup, …) — jalan di      */
/*        Pratinjau & export, tidak di canvas desain.                   */
/* Bukan untuk komponen framework (JSX/SFC): itu tetap dianggap HTML.   */
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

/** Buang <script>…</script> (tidak dijalankan oleh innerHTML/framework — gunakan tab JavaScript). */
export function stripScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script\s*>/gi, "").replace(/<\/?script\b[^>]*>/gi, "");
}

export const hasScriptTag = (html: string) => /<script\b/i.test(html);

/** String JS aman diletakkan di dalam blok <script> SFC. */
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
      // Framework: HTML disisipkan sebagai string, bukan template (kurung {{ }} / { } tidak ditafsirkan).
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
        classBody: `html: SafeHtml;\n\n// HTML milik pengguna sengaja tidak disanitasi agar tampil persis seperti di Page Maker.\nconstructor(sanitizer: DomSanitizer) {\n  this.html = sanitizer.bypassSecurityTrustHtml(${str});\n}`,
        headerImports: `import { DomSanitizer, SafeHtml } from '@angular/platform-browser';`,
      },
    };
  },
  customCode: (s) => ({ css: s.css, js: s.js }),
  sections: codeSections,
});
