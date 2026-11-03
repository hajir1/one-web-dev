import { useSyncExternalStore } from "react";

/* Satu detak per detik untuk semua countdown promo (bukan satu interval per kartu). */

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

/** Waktu sekarang (ms), diperbarui tiap detik selama ada komponen yang memakai. */
export const usePromoNow = () => useSyncExternalStore(subscribe, () => now, () => now);
