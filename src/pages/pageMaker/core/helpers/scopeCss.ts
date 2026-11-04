/**
 * Prefixes every selector with `scope` so preview CSS does not leak into
 * the whole app. Without this, user class names such as "hidden",
 * "flex", or "container" would change the app's appearance (because preview
 * CSS is injected globally through <style>).
 *
 * A simple brace-based parser, enough for the CSS we
 * generate ourselves: plain rules, @media/@supports (content scoped), and
 * @keyframes/@font-face (left as is).
 */
export function scopeCss(css: string, scope: string): string {
  let out = "";
  let i = 0;
  const n = css.length;

  const readBlock = (start: number): number => {
    // start = index right after '{'; returns the index of its closing '}'
    let depth = 1;
    let j = start;
    while (j < n && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      if (depth === 0) break;
      j++;
    }
    return j;
  };

  while (i < n) {
    const open = css.indexOf("{", i);
    if (open === -1) {
      out += css.slice(i);
      break;
    }
    const prelude = css.slice(i, open);
    const close = readBlock(open + 1);
    const body = css.slice(open + 1, close);
    const trimmed = prelude.trim();

    if (trimmed.startsWith("@")) {
      if (/^@(media|supports|container|layer)\b/i.test(trimmed)) {
        out += `${prelude}{${scopeCss(body, scope)}}`;
      } else {
        out += `${prelude}{${body}}`;
      }
    } else {
      const lead = prelude.match(/^\s*/)?.[0] ?? "";
      const selectors = trimmed
        .split(",")
        .map((sel) => sel.trim())
        .filter(Boolean)
        .map((sel) =>
          /^(html|body|:root)\b/.test(sel) ? sel.replace(/^(html|body|:root)/, scope) : `${scope} ${sel}`,
        )
        .join(",\n");
      out += `${lead}${selectors} {${body}}`;
    }
    i = close + 1;
  }
  return out;
}
