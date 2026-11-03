/* ================================================================== */
/* Background lengkap — dipakai elemen (state) dan kontainer (section,  */
/* Row, grup). Logika murni (tanpa React) supaya bisa dites.            */
/*                                                                    */
/* Satu nilai shorthand `background:` yang mendukung:                   */
/*   none · warna solid · gradient (linear/radial, 2–3 warna) ·         */
/*   gambar (URL / unggahan) + ukuran, posisi, ulangi, lampiran         */
/*   (parallax), warna dasar, dan overlay warna transparan.             */
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

/** Field background (nama sama untuk elemen & kontainer). Field tambahan opsional → data lama tetap valid. */
export interface BgFields {
  bgType: BgKind;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  gradientKind?: GradientKind;
  /** Warna tengah gradient; kosong = hanya dua warna. */
  gradientVia?: string;
  bgImage?: string;
  bgSize?: BgSize;
  bgPosition?: BgPosition;
  bgRepeat?: BgRepeat;
  bgAttachment?: BgAttachment;
  /** Warna overlay di atas gambar. */
  bgOverlayColor?: string;
  /** 0–100; 0 = tanpa overlay. */
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

/** Batas ukuran gambar unggahan (data URL) supaya desain tersimpan tidak membengkak. */
export const MAX_UPLOAD_BYTES = 1.5 * 1024 * 1024;

/** URL gambar yang aman ditaruh di `url("…")`: http(s), path relatif, atau data:image. */
export function isSafeBgImage(u: string | undefined): u is string {
  if (!u) return false;
  return (
    /^(https?:\/\/|data:image\/(png|jpe?g|gif|webp|avif|svg\+xml);|\/|\.\/|aset:[a-z0-9][a-z0-9-]{5,40}$)/i.test(u) &&
    !/["'()\\\s<>]/.test(u) &&
    u.length <= 3_000_000
  );
}

/** Warna aman untuk CSS (hex, rgb/hsl, nama, transparent). Selain itu → null. */
export function safeColor(c: string | undefined): string | null {
  if (!c) return null;
  const v = c.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return v;
  if (/^(rgb|rgba|hsl|hsla)\([\d\s.,%/+-]+\)$/i.test(v)) return v;
  if (/^[a-z]{3,20}$/i.test(v)) return v;
  return null;
}

/** Hex → rgba dengan opasitas 0–100 (warna non-hex memakai color-mix). */
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

/** Nilai gradient saja (linear/radial, 2–3 warna). */
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
 * Nilai shorthand `background`. Selalu menghasilkan string valid:
 * `none`, warna, gradient, atau lapisan [overlay,] gambar + warna dasar.
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

/** Normalisasi field background dari data tersimpan (nilai tak dikenal → bawaan). */
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
