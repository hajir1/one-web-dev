import { optimize } from "svgo/browser";
import { DataError } from "../../shared/errors";

/** SVG optimization with SVGO (MIT) in the browser. Loaded dynamically by tools.ts. */
export function optimizeSvg(input: string, o: { multipass: boolean; keepViewBox: boolean }): string {
  if (!/<svg[\s>]/i.test(input)) throw new DataError("svgInvalid", { detail: "<svg> tidak ditemukan" });
  try {
    return optimize(input, {
      multipass: o.multipass,
      // SVGO 4: viewBox is not removed by preset-default; the removeViewBox plugin only when requested.
      plugins: o.keepViewBox ? ["preset-default"] : ["preset-default", "removeViewBox"],
    }).data;
  } catch (e) {
    throw new DataError("svgInvalid", { detail: String((e as Error)?.message ?? e).split("\n")[0] });
  }
}
