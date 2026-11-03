import { useCallback, useState } from "react";

/** useState yang diingat di localStorage (preferensi tampilan). Aman bila storage diblokir. */
export function usePersistentState<T>(key: string, initial: T, valid?: (v: unknown) => v is T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initial;
      const parsed: unknown = JSON.parse(raw);
      return valid ? (valid(parsed) ? parsed : initial) : (parsed as T);
    } catch {
      return initial;
    }
  });
  const set = useCallback(
    (v: T) => {
      setValue(v);
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        /* diabaikan */
      }
    },
    [key],
  );
  return [value, set] as const;
}
