import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import i18n from "./i18n";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import { bootstrapApi } from "./api/bootstrap";
import { captureReferralFromUrl } from "./auth/referralCapture";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { initObservability } from "./observability";
import PwaUpdatePrompt from "./components/common/PwaUpdatePrompt";
import { Analytics } from "@vercel/analytics/react";
import { isDemoMode } from "./demo/demoMode";
import { installDemoLocale } from "./demo/demoLocale";

initObservability();
captureReferralFromUrl();
bootstrapApi();
// Mode demo (v15): teks tanpa "gratis"/kredit.
if (isDemoMode()) installDemoLocale(i18n);

// Vercel Web Analytics (v19): aktif hanya bila di-build di Vercel (VITE_VERCEL_ENV diisi Vercel otomatis).
// Paksa nyala/mati lewat VITE_VERCEL_ANALYTICS=true|false. Aktifkan juga "Analytics" di dashboard proyek Vercel.
// Frontend-only (open source, VITE_API_BASE_URL=off): mati kecuali diminta eksplisit (opt-in).
const frontendOnly = import.meta.env.VITE_API_BASE_URL === "off";
const vercelAnalytics = import.meta.env.VITE_VERCEL_ANALYTICS
  ? import.meta.env.VITE_VERCEL_ANALYTICS === "true"
  : !frontendOnly && Boolean(import.meta.env.VITE_VERCEL_ENV);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppWrapper>
          <App />
          <PwaUpdatePrompt />
          {vercelAnalytics && <Analytics />}
        </AppWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
