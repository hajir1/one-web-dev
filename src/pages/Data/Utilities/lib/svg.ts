import { optimize } from "svgo/browser";
import { DataError } from "../../shared/errors";

/** Optimasi SVG dengan SVGO (MIT) di browser. Dimuat dinamis oleh tools.ts. */
export function optimizeSvg(input: string, o: { multipass: boolean; keepViewBox: boolean }): string {
  if (!/<svg[\s>]/i.test(input)) throw new DataError("svgInvalid", { detail: "<svg> tidak ditemukan" });
  try {
    return optimize(input, {
      multipass: o.multipass,
      // SVGO 4: viewBox tidak dihapus oleh preset-default; plugin removeViewBox hanya bila diminta.
      plugins: o.keepViewBox ? ["preset-default"] : ["preset-default", "removeViewBox"],
    }).data;
  } catch (e) {
    throw new DataError("svgInvalid", { detail: String((e as Error)?.message ?? e).split("\n")[0] });
  }
}
