import { DataError } from "../../shared/errors";

/* ================================================================== */
/* Konverter timestamp: Unix (detik/milidetik/mikro/nano) ↔ tanggal.      */
/* ================================================================== */

export type EpochUnit = "s" | "ms" | "us" | "ns";

export interface TimestampResult {
  date: Date;
  /** Satuan yang dipakai/terdeteksi untuk input angka; null untuk input tanggal. */
  unit: EpochUnit | null;
  seconds: number;
  millis: number;
  iso: string;
  utc: string;
}

/** Tebak satuan dari jumlah digit: ≤11 detik, ≤14 ms, ≤17 µs, selebihnya ns. */
export function guessUnit(digits: string): EpochUnit {
  const n = digits.replace(/^-/, "").split(".")[0].length;
  if (n <= 11) return "s";
  if (n <= 14) return "ms";
  if (n <= 17) return "us";
  return "ns";
}

const DIV: Record<EpochUnit, number> = { s: 1 / 1000, ms: 1, us: 1000, ns: 1_000_000 };

export function parseTimestamp(input: string, unit: EpochUnit | "auto" = "auto"): TimestampResult {
  const s = input.trim();
  if (!s) throw new DataError("emptyInput");
  let date: Date;
  let used: EpochUnit | null = null;
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    used = unit === "auto" ? guessUnit(s) : unit;
    date = new Date(Number(s) / DIV[used]);
  } else {
    // Hanya format tanggal yang jelas: ISO 8601 / RFC 2822. Bentuk ambigu ditolak.
    if (!/^\d{4}-\d{2}-\d{2}([T ][\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/.test(s) && !/^[A-Za-z]{3},? /.test(s)) throw new DataError("timestampFormat");
    date = new Date(/^\d{4}-\d{2}-\d{2} /.test(s) ? s.replace(" ", "T") : s);
  }
  if (Number.isNaN(date.getTime())) throw new DataError("timestampRange");
  const millis = date.getTime();
  return { date, unit: used, seconds: Math.floor(millis / 1000), millis, iso: date.toISOString(), utc: date.toUTCString() };
}

/** "3 jam lalu" / "in 2 days" sesuai locale. */
export function relativeTime(millis: number, locale: string, now = Date.now()): string {
  const diff = (millis - now) / 1000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
    [Infinity, "year"],
  ];
  const sizes: Record<string, number> = { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2629800, year: 31557600 };
  for (const [limit, u] of steps) if (abs < limit) return rtf.format(Math.round(diff / sizes[u]), u);
  return rtf.format(Math.round(diff / sizes.year), "year");
}
