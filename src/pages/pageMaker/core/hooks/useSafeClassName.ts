import { useMemo, useState } from "react";

/**
 * Nama class yang benar-benar dipakai untuk render & export. Kalau input
 * kosong atau bukan identifier CSS sederhana yang valid, jatuh balik ke
 * `defaultName` supaya preview & kode yang di-generate tidak rusak.
 *
 * Aturan yang dipakai sengaja ketat: harus diawali huruf atau underscore,
 * kemudian hanya boleh berisi huruf, angka, underscore, atau tanda hubung.
 */
export function useSafeClassName(defaultName: string) {
  const [className, setClassName] = useState<string>(defaultName);

  const safeClassName = useMemo(() => {
    const candidate = className.trim();
    const isValidClassName = /^[A-Za-z_][A-Za-z0-9_-]*$/.test(candidate);

    return isValidClassName ? candidate : defaultName;
  }, [className, defaultName]);

  return { className, setClassName, safeClassName };
}
