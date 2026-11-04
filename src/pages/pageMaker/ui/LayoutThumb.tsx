import type { SpecialtyLayout } from "../helpers/sectionTypes";

/* Column structure thumbnail (Divi "Insert Row" panel style). Bar width = the real fr. */

const TONE = {
  teal: "bg-teal-400 dark:bg-teal-500",
  blue: "bg-blue-500",
  red: "bg-rose-400 dark:bg-rose-500",
  orange: "bg-orange-300 dark:bg-orange-400",
  purple: "bg-violet-500",
  white: "bg-white/80",
} as const;

export type ThumbTone = keyof typeof TONE;

export function ColumnBars({ fr, tone = "teal", height = 22 }: { fr: number[]; tone?: ThumbTone; height?: number }) {
  return (
    <div className="flex w-full gap-1" style={{ height }} aria-hidden="true">
      {fr.map((n, i) => (
        <div key={i} className={`rounded-sm ${TONE[tone]}`} style={{ flex: `${n} 1 0` }} />
      ))}
    </div>
  );
}

/** The special column (holding inner rows) is drawn orange, side columns red. */
export function SpecialtyBars({ layout, height = 40 }: { layout: SpecialtyLayout; height?: number }) {
  return (
    <div className="flex w-full gap-1" style={{ height }} aria-hidden="true">
      {layout.cols.map((c, i) =>
        c.inner ? (
          <div key={i} className="flex flex-col gap-1" style={{ flex: `${c.fr} 1 0` }}>
            {c.inner.map((fr, j) => (
              <div key={j} className="flex flex-1 gap-1">
                {fr.map((n, k) => (
                  <div key={k} className={`rounded-sm ${TONE.orange}`} style={{ flex: `${n} 1 0` }} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div key={i} className={`rounded-sm ${TONE.red}`} style={{ flex: `${c.fr} 1 0` }} />
        ),
      )}
    </div>
  );
}
