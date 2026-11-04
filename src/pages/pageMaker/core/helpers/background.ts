/* ================================================================== */
/* Full background: used by elements (state) and containers (section,   */
/* Row, group). Pure logic (no React) so it can be tested.              */
/*                                                                    */
/* One `background:` shorthand value that supports:                     */
/*   none · solid color · gradient (linear/radial, 2–3 colors) ·        */
/*   image (URL / upload) + size, position, repeat, attachment          */
/*   (parallax), base color, and a transparent color overlay.           */
/* ================================================================== */

export type BgKind = "none" | "solid" | "gradient" | "image";
type GradientKind = "linear" | "radial";
type BgSize = "cover" | "contain" | "auto";
type BgRepeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
type BgAttachment = "scroll" | "fixed";

const BG_KINDS: BgKind[] = ["none", "solid", "gradient", "image"];
export const BG_POSITIONS = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
] as const;
type BgPosition = (typeof BG_POSITIONS)[number];

/** Background fields (same names for elements & containers). Extra fields are optional → old data stays valid. */
export interface BgFields {
  bgType: BgKind;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  gradientKind?: GradientKind;
  /** Gradient middle color; empty = two colors only. */
  gradientVia?: string;
  bgImage?: string;
  bgSize?: BgSize;
  bgPosition?: BgPosition;
  bgRepeat?: BgRepeat;
  bgAttachment?: BgAttachment;
  /** Overlay color over the image. */
  bgOverlayColor?: string;
  /** 0–100; 0 = no overlay. */
  bgOverlayOpacity?: number;
}

export const BG_DEFAULTS: Required<Omit<BgFields, "bgType" | "bgColor" | "gradientFrom" | "gradientTo" | "gradientAngle">> = {
  gradientKind: "linear",
  gradientVia: "",
  bgImage: "",
  bgSize: "cover",
  bgPosition: "center",
  bgRepeat: "no-repeat",
  bgAttachment: "scroll",
  bgOverlayColor: "#000000",
  bgOverlayOpacity: 0,
};

/** Size limit for uploaded images (data URLs) so saved designs do not bloat. */
export const MAX_UPLOAD_BYTES = 1.5 * 1024 * 1024;

/** An image URL that is safe inside `url("…")`: http(s), relative paths, or data:image. */
export function isSafeBgImage(u: string | undefined): u is string {
  if (!u) return false;
  return (
    /^(https?:\/\/|data:image\/(png|jpe?g|gif|webp|avif|svg\+xml);|\/|\.\/|aset:[a-z0-9][a-z0-9-]{5,40}$)/i.test(u) &&
    !/["'()\\\s<>]/.test(u) &&
    u.length <= 3_000_000
  );
}

/** A safe CSS color (hex, rgb/hsl, name, transparent). Anything else → null. */
export function safeColor(c: string | undefined): string | null {
  if (!c) return null;
  const v = c.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return v;
  if (/^(rgb|rgba|hsl|hsla)\([\d\s.,%/+-]+\)$/i.test(v)) return v;
  if (/^[a-z]{3,20}$/i.test(v)) return v;
  return null;
}

/** Hex → rgba with 0–100 opacity (non-hex colors use color-mix). */
export function withOpacity(color: string, opacity: number): string {
  const a = Math.max(0, Math.min(100, opacity)) / 100;
  const m = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    const hex = m[1].length === 3 ? m[1].split("").map((x) => x + x).join("") : m[1];
    const n = parseInt(hex, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${+a.toFixed(2)})`;
  }
  return `color-mix(in srgb, ${color} ${Math.round(a * 100)}%, transparent)`;
}

type BgLike = Partial<BgFields> & { bgType?: string };

/** The gradient value only (linear/radial, 2–3 colors). */
export function gradientCss(b: BgLike): string {
  const stops = [b.gradientFrom ?? "#ffffff", b.gradientVia?.trim() || null, b.gradientTo ?? "#000000"]
    .filter((c): c is string => !!c)
    .map((c) => safeColor(c) ?? "transparent")
    .join(", ");
  return (b.gradientKind ?? "linear") === "radial"
    ? `radial-gradient(circle, ${stops})`
    : `linear-gradient(${Math.round(b.gradientAngle ?? 90)}deg, ${stops})`;
}

/**
 * The `background` shorthand value. Always produces a valid string:
 * `none`, a color, a gradient, or layers [overlay,] image + base color.
 */
export function backgroundCss(b: BgLike): string {
  const color = safeColor(b.bgColor) ?? "transparent";
  switch (b.bgType) {
    case "none":
      return "none";
    case "gradient":
      return gradientCss(b);
    case "image": {
      if (!isSafeBgImage(b.bgImage)) return color;
      const pos = (BG_POSITIONS as readonly string[]).includes(b.bgPosition ?? "") ? b.bgPosition : "center";
      const size = b.bgSize === "contain" || b.bgSize === "auto" ? b.bgSize : "cover";
      const repeat = ["repeat", "repeat-x", "repeat-y"].includes(b.bgRepeat ?? "") ? b.bgRepeat : "no-repeat";
      const attach = b.bgAttachment === "fixed" ? " fixed" : "";
      const image = `url("${b.bgImage}") ${pos} / ${size} ${repeat}${attach} ${color}`;
      const op = Number(b.bgOverlayOpacity ?? 0);
      if (op > 0) {
        const ov = withOpacity(safeColor(b.bgOverlayColor) ?? "#000000", op);
        return `linear-gradient(${ov}, ${ov}), ${image}`;
      }
      return image;
    }
    default:
      return color;
  }
}

/** Normalizes background fields from stored data (unknown values → defaults). */
export function sanitizeBg(v: Record<string, unknown>, fallbackType: BgKind): Partial<BgFields> {
  const pick = <T extends string>(x: unknown, list: readonly T[], d: T): T => (list.includes(x as T) ? (x as T) : d);
  const out: Partial<BgFields> = {
    bgType: pick(v.bgType, BG_KINDS, fallbackType),
    gradientFrom: typeof v.gradientFrom === "string" ? v.gradientFrom : "#2563eb",
    gradientTo: typeof v.gradientTo === "string" ? v.gradientTo : "#7c3aed",
    gradientAngle: typeof v.gradientAngle === "number" && Number.isFinite(v.gradientAngle) ? Math.min(360, Math.max(0, v.gradientAngle)) : 90,
    gradientKind: pick(v.gradientKind, ["linear", "radial"] as const, "linear"),
    gradientVia: typeof v.gradientVia === "string" ? v.gradientVia.slice(0, 40) : "",
    bgImage: typeof v.bgImage === "string" && isSafeBgImage(v.bgImage) ? v.bgImage : "",
    bgSize: pick(v.bgSize, ["cover", "contain", "auto"] as const, "cover"),
    bgPosition: pick(v.bgPosition, BG_POSITIONS, "center"),
    bgRepeat: pick(v.bgRepeat, ["no-repeat", "repeat", "repeat-x", "repeat-y"] as const, "no-repeat"),
    bgAttachment: pick(v.bgAttachment, ["scroll", "fixed"] as const, "scroll"),
    bgOverlayColor: typeof v.bgOverlayColor === "string" ? v.bgOverlayColor : "#000000",
    bgOverlayOpacity:
      typeof v.bgOverlayOpacity === "number" && Number.isFinite(v.bgOverlayOpacity)
        ? Math.min(100, Math.max(0, Math.round(v.bgOverlayOpacity)))
        : 0,
  };
  return out;
}
