import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useParams } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Navigate as LocaleNavigate } from "./components/app/LocaleLink";
import { activateLanguage, isLang, preferredLang, splitLangPath, withFullLocale } from "./i18n";
import { isDemoHiddenPath, isDemoMode } from "./demo/demoMode";

/** v13: site path prefix (Vite `base`, e.g. "/repo" on GitHub Pages); empty at the domain root. */
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/+$/, "") || undefined;

/* Every page is loaded separately (code splitting): the first visit only
   downloads the app shell plus the opened page, not Page Maker,
   ExcelJS, transformers.js, etc. all at once. */
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
/* App routes: every page lives under a language prefix.                */
/*   /id/...  (Indonesian)   /en/...  (English)                         */
/* URLs without a prefix (including old links like /page-maker?design=…) */
/* are redirected to the chosen language with the same path, query, and hash. */
/* ================================================================== */

/** "/" or a path without a prefix → /<lang>/<path>. */
function AddLangPrefix() {
  const { pathname, search, hash } = useLocation();
  const { rest } = splitLangPath(pathname);
  return <Navigate to={`/${preferredLang()}${rest === "/" ? "" : rest}${search}${hash}`} replace />;
}

/** Validate the language segment, load the language bundle, then render the page. */
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
      () => alive && setReady(lang), // failed to load the bundle: still render with the fallback (Indonesian)
    );
    return () => {
      alive = false;
    };
  }, [lang]);

  if (!valid) return <AddLangPrefix />;
  // Demo mode (v12): account, payment, and server tool pages do not exist → Dashboard.
  if (isDemoMode() && isDemoHiddenPath(splitLangPath(pathname).rest)) return <LocaleNavigate to="/" replace />;
  // Wait for the language bundle only the first time; when switching languages, the page stays visible.
  if (ready === null) return null;
  return (
    <Suspense fallback={<PageFallback />}>
      <Outlet />
    </Suspense>
  );
}

/** Old /media-tools/kredit → Credits page (the ?fitur parameter is kept). */
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
              {/* Credit purchases moved from Media to the Credits page. */}
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

            {/* Element Maker, Component Maker & Section Maker were removed:
                Page Maker is the only builder. Old URLs redirect to Page Maker. */}
            <Route path="element-maker/*" element={<LocaleNavigate to="/page-maker" replace />} />
            <Route path="component-maker" element={<LocaleNavigate to="/page-maker" replace />} />
            <Route path="section-maker" element={<LocaleNavigate to="/page-maker" replace />} />

            {/* v17: Website Builder home (Choose → Modify → Deploy) & no-code editor for Code Templates */}
            <Route path="website-builder" element={<WebsiteHub />} />
            <Route path="website-builder/code/:projectId" element={<CodeTemplateEditor />} />

            {/* v20: Studio = one website, many pages, deploy from the editor. */}
            <Route path="studio/:siteId" element={<PageMaker />} />
            {/* Old addresses: Page Editor & Compose & Deploy → Studio (see LegacyRoutes.tsx). */}
            <Route path="page-maker" element={<LegacyPageMakerRoute />} />
            <Route path="website" element={<LegacyWebsiteRoute />} />
            {/* Old Page Composer → Website (old data is migrated there) */}
            <Route path="page-composer" element={<LocaleNavigate to="/website" replace />} />

            {/* Ready-made website templates (free & premium) */}
            <Route path="web-templates" element={<WebTemplates />} />
            <Route path="web-templates/:templateId" element={<WebTemplates />} />
            {/* Design packs, demo balance & Premium items (local simulation) */}
            <Route path="web-market" element={<WebMarket />} />

            {/* Web Maker: icon library, fonts, and global configuration */}
            <Route path="global-setting" element={<GlobalSetting />} />

            {/* VR: 360° tour builder (A-Frame from a CDN) */}
            <Route path="vr" element={<LocaleNavigate to="/vr/tour-360" replace />} />
            <Route path="vr/tour-360" element={<VrTour />} />

            <Route path="dokumentasi" element={<Dokumentasi />} />
          </Route>

          {/* VR: full-screen tour preview (no sidebar), opened in a new tab */}
          <Route path="vr/tour-360/pratinjau/:tourId" element={<TourViewer />} />

          {/* Auth Layout */}
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Public legal documents & print-ready invoices (no sidebar) */}
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
