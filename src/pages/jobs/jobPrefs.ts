// ─── jobs/jobPrefs.ts ────────────────────────────────────────────────────────
// v7 (P4): preferensi "email saya bila pekerjaan server yang lama sudah selesai".
// Disimpan per browser; dikirim sebagai `notify` di setiap job. Server hanya
// mengirim email bila job berjalan ≥ JOB_NOTIFY_MIN_SECONDS (default 60 dtk).

import { create } from "zustand";

const KEY = "owd.jobNotify";

function read(): boolean {
  try {
    return globalThis.localStorage?.getItem(KEY) !== "0";
  } catch {
    return true;
  }
}

export const useJobPrefs = create<{ notify: boolean; setNotify: (v: boolean) => void }>((set) => ({
  notify: read(),
  setNotify: (notify) => {
    try {
      globalThis.localStorage?.setItem(KEY, notify ? "1" : "0");
    } catch {
      /* mode privat: tetap berlaku selama tab terbuka */
    }
    set({ notify });
  },
}));
