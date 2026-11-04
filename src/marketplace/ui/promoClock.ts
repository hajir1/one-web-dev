import { useSyncExternalStore } from "react";

/* One tick per second for every promo countdown (not one interval per card). */

const listeners = new Set<() => void>();
let now = Date.now();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(fn: () => void) {
  listeners.add(fn);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(fn);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** Current time (ms), updated every second while any component uses it. */
export const usePromoNow = () => useSyncExternalStore(subscribe, () => now, () => now);
