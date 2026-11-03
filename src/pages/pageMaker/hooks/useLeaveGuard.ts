import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLocaleNavigate } from "../../../components/app/LocaleLink";

/* ================================================================== */
/* Konfirmasi sebelum meninggalkan editor bila ada perubahan belum       */
/* disimpan. Menangani semua jalur keluar yang didukung aplikasi:        */
/*   - tombol "Keluar" di editor          → request({ kind: "exit" })    */
/*   - tombol Back browser / gestur back  → entri "penjaga" di history   */
/*   - link internal (<a href>) di halaman → klik dicegat (capture)      */
/*   - tutup tab / muat ulang             → dialog bawaan browser        */
/*                                         (beforeunload; teks & tombol  */
/*                                         tidak bisa diubah browser)    */
/* Bekerja dengan BrowserRouter biasa (tanpa data router / useBlocker).  */
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
      /* history tidak tersedia */
    }
  };

  // Pasang entri penjaga begitu ada perubahan (sekali saja; tidak bergantung render ulang).
  useEffect(() => {
    if (dirty && !guarded.current) pushGuard();
  }, [dirty]);

  useEffect(() => {
    const onPop = () => {
      if (!guarded.current || leaving.current) return;
      guarded.current = false; // entri penjaga baru saja dilewati
      if (dirtyRef.current) {
        pushGuard(); // tetap di editor
        setPending({ kind: "back" });
      } else {
        window.history.back(); // sudah tersimpan → lanjutkan kembali
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
      if (url.origin !== window.location.origin) return; // keluar situs → beforeunload
      if (url.pathname === window.location.pathname && url.hash) return; // anchor di halaman yang sama
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

  /** Tinggalkan editor sekarang (tanpa bertanya). */
  const leave = useCallback(
    (t: LeaveTarget) => {
      leaving.current = true;
      setPending(null);
      if (t.kind === "path") {
        navigate(t.to, { replace: guarded.current });
        return;
      }
      if (guarded.current) {
        window.history.go(-2); // lewati entri penjaga + halaman editor
        return;
      }
      if (t.kind === "back") window.history.back();
      else if (opts.exitTo) opts.exitTo();
      else if (window.history.length > 1) navigate(-1);
      else localeNavigate("/");
    },
    [navigate, localeNavigate, opts],
  );

  /** Minta keluar: langsung bila tidak ada perubahan, selain itu tampilkan dialog. */
  const request = useCallback(
    (t: LeaveTarget) => {
      if (dirtyRef.current) setPending(t);
      else leave(t);
    },
    [leave],
  );

  return { pending, request, leave, cancel: () => setPending(null) };
}
