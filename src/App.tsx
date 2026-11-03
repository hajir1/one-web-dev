import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useParams } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Navigate as LocaleNavigate } from "./components/app/LocaleLink";
import { activateLanguage, isLang, preferredLang, splitLangPath, withFullLocale } from "./i18n";
import { isDemoHiddenPath, isDemoMode } from "./demo/demoMode";

/** v13: awalan path situs (Vite `base`, mis. "/repo" di GitHub Pages); kosong di root domain. */
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/+$/, "") || undefined;

/* Setiap halaman dimuat terpisah (code-splitting): pembukaan pertama hanya
   mengunduh kerangka aplikasi + halaman yang dibuka, bukan Page Maker,
   ExcelJS, transformers.js, dll. sekaligus. */
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const VerifyEmail = lazy(() => import("./pages/AuthPages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/AuthPages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/AuthPages/ResetPassword"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(withFullLocale(() => import("./pages/UserProfiles")));
const FindColorAtImage = lazy(withFullLocale(() => import("./pages/media/Page/findColorIAtImage/Index")));
const VideoToFrames = lazy(withFullLocale(() => import("./pages/media/Page/VideoToFrames/Index")));
const MediaHub = lazy(withFullLocale(() => import("./pages/media/Page/MediaHub/Index")));
const ImageUpscaler = lazy(withFullLocale(() => import("./pages/media/Page/ImageUpscaler/Index")));
const MetadataRemover = lazy(withFullLocale(() => import("./pages/media/Page/MetadataRemover/Index")));
const VideoToGif = lazy(withFullLocale(() => import("./pages/media/Page/VideoToGif/Index")));
const AudioExtract = lazy(withFullLocale(() => import("./pages/media/Page/AudioExtract/Index")));
const VideoCompress = lazy(withFullLocale(() => import("./pages/media/Page/VideoCompress/Index")));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const FaviconGenerator = lazy(withFullLocale(() => import("./pages/media/Page/FaviconGenerator/Index")));
const OgImageMaker = lazy(withFullLocale(() => import("./pages/media/Page/OgImage/Index")));
const PdfTools = lazy(withFullLocale(() => import("./pages/Data/PdfTools/Index")));
const RemoveBackground = lazy(withFullLocale(() => import("./pages/media/Page/RemoveBackground/Index")));
const ImageConverter = lazy(withFullLocale(() => import("./pages/media/Page/ImageConverter/Index")));
const AudioConverter = lazy(withFullLocale(() => import("./pages/media/Page/AudioConverter/Index")));
const ExcelToJsonConverter = lazy(withFullLocale(() => import("./pages/Data/ExcelToJsonConverter/Index")));
const SqlConverter = lazy(withFullLocale(() => import("./pages/Data/SqlConverter/Index")));
const DevUtilities = lazy(withFullLocale(() => import("./pages/Data/Utilities/Index")));
const ServerConvert = lazy(withFullLocale(() => import("./pages/Data/ServerConvert/Index")));
const PageMaker = lazy(withFullLocale(() => import("./pages/pageMaker/Page/PageMaker")));
const LegacyPageMakerRoute = lazy(withFullLocale(() => import("./pages/websiteHub/LegacyRoutes").then((m) => ({ default: m.LegacyPageMakerRoute }))));
const LegacyWebsiteRoute = lazy(withFullLocale(() => import("./pages/websiteHub/LegacyRoutes").then((m) => ({ default: m.LegacyWebsiteRoute }))));
const WebTemplates = lazy(withFullLocale(() => import("./pages/webTemplates/WebTemplates")));
const WebsiteHub = lazy(withFullLocale(() => import("./pages/websiteHub/WebsiteHub")));
const CodeTemplateEditor = lazy(withFullLocale(() => import("./pages/webTemplates/codeTemplates/editor/CodeTemplateEditor")));
const WebMarket = lazy(withFullLocale(() => import("./pages/webMarket/WebMarket")));
const GlobalSetting = lazy(withFullLocale(() => import("./pages/globalSetting/Page/GlobalSetting")));
const VrTour = lazy(withFullLocale(() => import("./pages/vr/Page/VrTour")));
const TourViewer = lazy(withFullLocale(() => import("./pages/vr/Page/TourViewer")));
const Dokumentasi = lazy(withFullLocale(() => import("./pages/dokumentasi/dokumentasi")));
const CreditsPage = lazy(withFullLocale(() => import("./pages/credits/CreditsPage")));
const DocsPage = lazy(withFullLocale(() => import("./pages/docs/DocsPage")));
const AdminPage = lazy(withFullLocale(() => import("./pages/admin/AdminPage")));
const AccountSettings = lazy(withFullLocale(() => import("./pages/account/AccountSettings")));
const LegalPage = lazy(withFullLocale(() => import("./pages/legal/LegalPage")));
const InvoicePage = lazy(withFullLocale(() => import("./pages/invoice/InvoicePage")));
const JobHistory = lazy(withFullLocale(() => import("./pages/jobs/JobHistory")));
const TeamPage = lazy(withFullLocale(() => import("./pages/team/TeamPage")));
const PlansPage = lazy(withFullLocale(() => import("./pages/plans/PlansPage")));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );
}

/* ================================================================== */
/* Rute aplikasi — semua halaman berada di bawah prefix bahasa:          */
/*   /id/...  (Bahasa Indonesia)   /en/...  (English)                   */
/* URL tanpa prefix (termasuk tautan lama seperti /page-maker?design=…)  */
/* diarahkan ke bahasa pilihan dengan path, query, dan hash yang sama.   */
/* ================================================================== */

/** "/" atau path tanpa prefix → /<bahasa>/<path>. */
function AddLangPrefix() {
  const { pathname, search, hash } = useLocation();
  const { rest } = splitLangPath(pathname);
  return <Navigate to={`/${preferredLang()}${rest === "/" ? "" : rest}${search}${hash}`} replace />;
}

/** Validasi segmen bahasa, muat bundle bahasa, lalu render halaman. */
function LangRoute() {
  const { lang } = useParams();
  const { pathname } = useLocation();
  const valid = isLang(lang);
  const [ready, setReady] = useState<string | null>(null);

  useEffect(() => {
    if (!isLang(lang)) return;
    let alive = true;
    activateLanguage(lang).then(
      () => alive && setReady(lang),
      () => alive && setReady(lang), // gagal memuat bundle: tetap tampil dengan fallback (Indonesia)
    );
    return () => {
      alive = false;
    };
  }, [lang]);

  if (!valid) return <AddLangPrefix />;
  // Mode demo (v12): halaman akun, pembayaran & alat server tidak ada → Dashboard.
  if (isDemoMode() && isDemoHiddenPath(splitLangPath(pathname).rest)) return <LocaleNavigate to="/" replace />;
  // Tunggu bundle bahasa pertama kali saja; saat berganti bahasa, halaman tetap tampil.
  if (ready === null) return null;
  return (
    <Suspense fallback={<PageFallback />}>
      <Outlet />
    </Suspense>
  );
}

/** /media-tools/kredit lama → halaman Credits (parameter ?fitur dipertahankan). */
function LegacyCreditRedirect() {
  const { search } = useLocation();
  return <LocaleNavigate to={`/credits${search}`} replace />;
}

export default function App() {
  return (
    <Router basename={ROUTER_BASENAME}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AddLangPrefix />} />
        <Route path="/:lang" element={<LangRoute />}>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />

            <Route path="profile" element={<UserProfiles />} />

            <Route path="credits" element={<CreditsPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="job-history" element={<JobHistory />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="team/join" element={<TeamPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="docs/:topic" element={<DocsPage />} />

            <Route path="media-tools">
              <Route index element={<MediaHub />} />
              <Route path="find-colors-at-image" element={<FindColorAtImage />} />
              <Route path="image-converter" element={<ImageConverter />} />
              <Route path="audio-converter" element={<AudioConverter />} />
              <Route path="video-to-frames" element={<VideoToFrames />} />
              <Route path="remove-background" element={<RemoveBackground />} />
              <Route path="image-upscaler" element={<ImageUpscaler />} />
              <Route path="metadata-remover" element={<MetadataRemover />} />
              <Route path="video-to-gif" element={<VideoToGif />} />
              <Route path="audio-extract" element={<AudioExtract />} />
              <Route path="video-compress" element={<VideoCompress />} />
              <Route path="favicon-generator" element={<FaviconGenerator />} />
              <Route path="og-image" element={<OgImageMaker />} />
              {/* Pembelian kredit dipindah dari Media ke halaman Credits. */}
              <Route path="kredit" element={<LegacyCreditRedirect />} />
            </Route>

            <Route path="data-tools">
              <Route index element={<LocaleNavigate to="/data-tools/excel-to-json" replace />} />
              <Route path="excel-to-json" element={<ExcelToJsonConverter />} />
              <Route path="sql-converter" element={<SqlConverter />} />
              <Route path="utilities" element={<DevUtilities />} />
              <Route path="utilities/:tool" element={<DevUtilities />} />
              <Route path="pdf-tools" element={<PdfTools />} />
              <Route path="pdf-tools/:tool" element={<PdfTools />} />
              <Route path="server-convert" element={<ServerConvert />} />
            </Route>

            {/* Element Maker, Component Maker & Section Maker sudah dihapus:
                Page Maker satu-satunya builder. URL lama diarahkan ke Page Maker. */}
            <Route path="element-maker/*" element={<LocaleNavigate to="/page-maker" replace />} />
            <Route path="component-maker" element={<LocaleNavigate to="/page-maker" replace />} />
            <Route path="section-maker" element={<LocaleNavigate to="/page-maker" replace />} />

            {/* v17: beranda Pembuat Website (Pilih → Modifikasi → Deploy) & editor tanpa kode Template Kode */}
            <Route path="website-builder" element={<WebsiteHub />} />
            <Route path="website-builder/code/:projectId" element={<CodeTemplateEditor />} />

            {/* v20: Studio = satu website, banyak halaman, deploy dari editor. */}
            <Route path="studio/:siteId" element={<PageMaker />} />
            {/* Alamat lama: Editor Halaman & Susun & Deploy → Studio (lihat LegacyRoutes.tsx). */}
            <Route path="page-maker" element={<LegacyPageMakerRoute />} />
            <Route path="website" element={<LegacyWebsiteRoute />} />
            {/* Page Composer lama → Website (data lama dimigrasikan di sana) */}
            <Route path="page-composer" element={<LocaleNavigate to="/website" replace />} />

            {/* Template website siap pakai (gratis & premium) */}
            <Route path="web-templates" element={<WebTemplates />} />
            <Route path="web-templates/:templateId" element={<WebTemplates />} />
            {/* Paket desain, saldo demo & item Premium (simulasi lokal) */}
            <Route path="web-market" element={<WebMarket />} />

            {/* Web Maker: pustaka ikon, font, dan konfigurasi global */}
            <Route path="global-setting" element={<GlobalSetting />} />

            {/* VR: pembuat tur 360° (A-Frame dari CDN) */}
            <Route path="vr" element={<LocaleNavigate to="/vr/tour-360" replace />} />
            <Route path="vr/tour-360" element={<VrTour />} />

            <Route path="dokumentasi" element={<Dokumentasi />} />
          </Route>

          {/* VR: pratinjau tur layar penuh (tanpa sidebar), dibuka di tab baru */}
          <Route path="vr/tour-360/pratinjau/:tourId" element={<TourViewer />} />

          {/* Auth Layout */}
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Dokumen legal publik & invoice siap cetak (tanpa sidebar) */}
          <Route path="legal" element={<LocaleNavigate to="/legal/terms" replace />} />
          <Route path="legal/:doc" element={<LegalPage />} />
          <Route path="invoice/:id" element={<InvoicePage />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
