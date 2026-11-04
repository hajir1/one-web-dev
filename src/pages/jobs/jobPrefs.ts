// ─── jobs/jobPrefs.ts ────────────────────────────────────────────────────────
// v7 (P4): the "email me when a long server job finishes" preference.
// Stored per browser; sent as `notify` with every job. The server only
// sends an email when a job runs ≥ JOB_NOTIFY_MIN_SECONDS (default 60 s).

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
      /* private mode: still applies while the tab is open */
    }
    set({ notify });
  },
}));
