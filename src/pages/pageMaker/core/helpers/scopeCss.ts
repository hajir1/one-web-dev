/**
 * Awali setiap selector dengan `scope` supaya CSS preview tidak bocor ke
 * seluruh aplikasi. Tanpa ini, nama class buatan user seperti "hidden",
 * "flex", atau "container" ikut mengubah tampilan aplikasi (karena CSS
 * preview disuntik global lewat <style>).
 *
 * Parser sederhana berbasis kurung kurawal — cukup untuk CSS yang kita
 * generate sendiri: rule biasa, @media/@supports (isi di-scope), dan
 * @keyframes/@font-face (dibiarkan apa adanya).
 */
export function scopeCss(css: string, scope: string): string {
  let out = "";
  let i = 0;
  const n = css.length;

  const readBlock = (start: number): number => {
    // start = index tepat setelah '{'; kembalikan index '}' penutupnya
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
