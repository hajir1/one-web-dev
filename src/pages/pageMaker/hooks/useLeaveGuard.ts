import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLocaleNavigate } from "../../../components/app/LocaleLink";

/* ================================================================== */
/* Confirmation before leaving the editor when there are unsaved        */
/* changes. Handles every exit path the app supports:                   */
/*   - the "Exit" button in the editor    → request({ kind: "exit" })    */
/*   - the browser Back button / back gesture → a "guard" entry in history */
/*   - internal links (<a href>) on the page → clicks intercepted (capture) */
/*   - close tab / reload             → the browser's built-in dialog    */
/*                                         (beforeunload; the text & buttons */
/*                                         cannot be changed by the browser) */
/* Works with a plain BrowserRouter (no data router / useBlocker).      */
/* ================================================================== */

export type LeaveTarget = { kind: "exit" } | { kind: "back" } | { kind: "path"; to: string };

const GUARD = "__pmLeaveGuard";

export function useLeaveGuard(dirty: boolean, opts: { exitTo?: () => void } = {}) {
  const navigate = useNavigate();
  const localeNavigate = useLocaleNavigate();
  const [pending, setPending] = useState<LeaveTarget | null>(null);
  const guarded = useRef(false);
  const leaving = useRef(false);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  const pushGuard = () => {
    try {
      window.history.pushState({ ...(window.history.state ?? {}), [GUARD]: true }, "");
      guarded.current = true;
    } catch {
      /* history not available */
    }
  };

  // Add a guard entry as soon as there are changes (only once; independent of re-renders).
  useEffect(() => {
    if (dirty && !guarded.current) pushGuard();
  }, [dirty]);

  useEffect(() => {
    const onPop = () => {
      if (!guarded.current || leaving.current) return;
      guarded.current = false; // the guard entry was just passed
      if (dirtyRef.current) {
        pushGuard(); // stay in the editor
        setPending({ kind: "back" });
      } else {
        window.history.back(); // already saved → continue going back
      }
    };
    const onUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current || leaving.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      if (!dirtyRef.current || leaving.current || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return; // leaving the site → beforeunload
      if (url.pathname === window.location.pathname && url.hash) return; // an anchor on the same page
      e.preventDefault();
      e.stopPropagation();
      setPending({ kind: "path", to: url.pathname + url.search + url.hash });
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  /** Leave the editor now (without asking). */
  const leave = useCallback(
    (t: LeaveTarget) => {
      leaving.current = true;
      setPending(null);
      if (t.kind === "path") {
        navigate(t.to, { replace: guarded.current });
        return;
      }
      if (guarded.current) {
        window.history.go(-2); // skip the guard entry + the editor page
        return;
      }
      if (t.kind === "back") window.history.back();
      else if (opts.exitTo) opts.exitTo();
      else if (window.history.length > 1) navigate(-1);
      else localeNavigate("/");
    },
    [navigate, localeNavigate, opts],
  );

  /** Requests an exit: immediate when there are no changes, otherwise shows the dialog. */
  const request = useCallback(
    (t: LeaveTarget) => {
      if (dirtyRef.current) setPending(t);
      else leave(t);
    },
    [leave],
  );

  return { pending, request, leave, cancel: () => setPending(null) };
}
