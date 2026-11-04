import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

/* ================================================================== */
/* A lightweight code editor with syntax highlighting (no dependencies). */
/* Technique: a transparent <textarea> over a colored <pre>, scroll     */
/* synchronized. Tab inserts 2 spaces; Esc releases focus (so           */
/* can still be left with the keyboard).                                */
/* ================================================================== */

export type CodeLang = "html" | "css" | "js";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const C = {
  comment: "text-gray-400 italic",
  string: "text-emerald-600 dark:text-emerald-400",
  keyword: "text-violet-600 dark:text-violet-400",
  number: "text-amber-600 dark:text-amber-400",
  tag: "text-blue-700 dark:text-sky-400",
  attr: "text-orange-600 dark:text-orange-300",
  prop: "text-blue-700 dark:text-sky-400",
  at: "text-violet-600 dark:text-violet-400",
} as const;

type Rule = [RegExp, keyof typeof C | null];

const RULES: Record<CodeLang, Rule[]> = {
  js: [
    [/\/\/[^\n]*|\/\*[\s\S]*?(\*\/|$)/y, "comment"],
    [/"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|`(?:\\.|[^`\\])*`?/y, "string"],
    [
      /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|from|try|catch|finally|throw|typeof|instanceof|in|of|this|null|undefined|true|false|async|await|default)\b/y,
      "keyword",
    ],
    [/\b\d+(?:\.\d+)?\b/y, "number"],
  ],
  css: [
    [/\/\*[\s\S]*?(\*\/|$)/y, "comment"],
    [/"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/y, "string"],
    [/@[\w-]+/y, "at"],
    [/[\w-]+(?=\s*:(?!:)[^{]*?(;|\}|$))/y, "prop"],
    [/#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg|fr)?\b/y, "number"],
    [/&/y, "keyword"],
  ],
  html: [
    [/<!--[\s\S]*?(-->|$)/y, "comment"],
    [/<\/?[A-Za-z][\w:-]*/y, "tag"],
    [/\/?>/y, "tag"],
    [/[A-Za-z_:@][\w:.-]*(?==)/y, "attr"],
    [/"[^"]*"?|'[^']*'?/y, "string"],
  ],
};

/** Colored HTML for `code` (already escaped; safe for innerHTML). */
export function highlight(code: string, lang: CodeLang): string {
  const rules = RULES[lang];
  let out = "";
  let plain = "";
  let i = 0;
  // For HTML, attributes/strings are only colored inside tags.
  let inTag = false;
  while (i < code.length) {
    let matched = false;
    for (const [re, cls] of rules) {
      if (lang === "html" && !inTag && (cls === "attr" || cls === "string" || re.source === "\\/?>")) continue;
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length) {
        if (plain) {
          out += esc(plain);
          plain = "";
        }
        out += cls ? `<span class="${C[cls]}">${esc(m[0])}</span>` : esc(m[0]);
        if (lang === "html" && cls === "tag") inTag = !/>$/.test(m[0]);
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      plain += code[i];
      i++;
    }
  }
  return out + esc(plain);
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  lang: CodeLang;
  label: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  testId?: string;
}

export default function CodeEditor({ value, onChange, lang, label, placeholder, rows = 6, maxLength, testId }: Props) {
  // Local value → typing stays smooth even while the parent saves to history.
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const html = useMemo(() => highlight(text, lang) + "\n", [text, lang]);

  const set = (v: string) => {
    setText(v);
    onChange(v);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const ta = e.currentTarget;
      const { selectionStart: a, selectionEnd: b } = ta;
      const next = text.slice(0, a) + "  " + text.slice(b);
      set(next);
      requestAnimationFrame(() => ta.setSelectionRange(a + 2, a + 2));
    } else if (e.key === "Escape") {
      e.currentTarget.blur();
    }
    e.stopPropagation(); // builder shortcuts (Delete, Ctrl+Z) are not triggered as well
  };

  const sync = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const box = "m-0 w-full whitespace-pre-wrap break-words px-2.5 py-2 font-mono text-xs leading-relaxed";
  return (
    <div className="relative rounded border border-gray-300 bg-gray-50 focus-within:border-blue-700 dark:border-gray-700 dark:bg-gray-950">
      <pre
        ref={preRef}
        aria-hidden
        className={`${box} pointer-events-none absolute inset-0 overflow-hidden text-gray-800 dark:text-gray-100`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <textarea
        ref={taRef}
        value={text}
        aria-label={label}
        data-testid={testId}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
        onKeyDown={onKey}
        onScroll={sync}
        className={`${box} relative block resize-y bg-transparent text-transparent caret-gray-800 outline-none placeholder:text-gray-400 dark:caret-white`}
      />
    </div>
  );
}
