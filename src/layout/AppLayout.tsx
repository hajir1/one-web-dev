import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Suspense } from "react";
import { Outlet, useLocation } from "react-router";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import PwaInstallPrompt from "../components/common/PwaInstallPrompt";
import Toaster from "../components/app/Toaster";
import TermsGate from "../components/app/TermsGate";
import { splitLangPath } from "../i18n";

/**
 * Halaman builder layar penuh (mis. Page Maker): tanpa sidebar, header, dan
 * pembatas lebar `max-w-(--breakpoint-2xl)` — halaman itu memenuhi 100% viewport
 * dan menyediakan tombol keluarnya sendiri.
 */
const IMMERSIVE_ROUTES = ["/page-maker", "/studio", "/website-builder/code"];

const isImmersive = (pathname: string) => {
  const path = splitLangPath(pathname).rest;
  return IMMERSIVE_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
};

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { pathname } = useLocation();

  if (isImmersive(pathname)) {
    return (
      <>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
        <Toaster />
        <TermsGate />
      </>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-72.5" : "lg:ml-22.5"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <main id="main" className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
          {/* Suspense di sini: sidebar & header tetap tampil saat halaman berikutnya dimuat. */}
          <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center"><span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* PWA install banner — muncul di sudut bawah jika belum diinstall */}
      <PwaInstallPrompt />
      <Toaster />
      <TermsGate />
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
