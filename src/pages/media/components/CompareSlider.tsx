import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CHECKERBOARD } from "./ui";

/**
 * Perbandingan sebelum/sesudah dengan penggeser. Dipakai Remove Background
 * dan Image Upscaler. `pixelated` memperlihatkan piksel asli saat diperbesar.
 */
export default function CompareSlider({
  before,
  after,
  beforeLabel: beforeProp,
  afterLabel: afterProp,
  checker,
  background,
  pixelated,
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  checker?: boolean;
  /** Warna latar di belakang hasil (mis. pratinjau latar putih). */
  background?: string | null;
  pixelated?: boolean;
}) {
  const { t } = useTranslation();
  const beforeLabel = beforeProp ?? t("media.compare.before");
  const afterLabel = afterProp ?? t("media.compare.after");
  const [pos, setPos] = useState(50);
  const imgStyle = { imageRendering: pixelated ? ("pixelated" as const) : ("auto" as const) };
  return (
    <div className="relative select-none overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-700" style={checker ? CHECKERBOARD : undefined} data-testid="compare">
      <img src={after} alt={afterLabel} className="block max-h-[60vh] w-full object-contain" style={{ ...imgStyle, background: background ?? undefined }} draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt={beforeLabel} className="block h-full w-full bg-gray-100 object-contain dark:bg-gray-800" style={imgStyle} draggable={false} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.2)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-700 shadow-lg">⇆</span>
      </div>
      <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">{afterLabel}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t("media.compare.slider")}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
