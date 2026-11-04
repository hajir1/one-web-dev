// ─── observability.ts ────────────────────────────────────────────────────────
// v7 (P10): Sentry in the browser, OPTIONAL. Active only when VITE_SENTRY_DSN is set
// at build time; the package loads separately (dynamic import) so without a DSN it does not
// add to the main bundle size. Requests to the backend carry the `sentry-trace` header
// + `baggage` so the browser → Nest → Python trace is connected.
// No personal data: no IP/cookies/form content, and query strings are stripped from URLs.

import { apiConfig } from "./pages/media/processing/apiConfig";

type Env = Record<string, string | undefined>;

export interface SentryPlan {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate: number;
  /** API origins allowed to receive trace headers. */
  apiOrigin: string | null;
}

export function sentryPlan(env: Env, apiBase: string | null): SentryPlan | null {
  const dsn = env.VITE_SENTRY_DSN?.trim();
  if (!dsn || !/^https?:\/\//.test(dsn)) return null;
  const n = Number(env.VITE_SENTRY_TRACES_SAMPLE_RATE);
  let apiOrigin: string | null;
  try {
    apiOrigin = apiBase ? new URL(apiBase).origin : null;
  } catch {
    apiOrigin = null;
  }
  return {
    dsn,
    environment: env.VITE_SENTRY_ENVIRONMENT || env.MODE || "production",
    release: env.VITE_SENTRY_RELEASE || undefined,
    tracesSampleRate: env.VITE_SENTRY_TRACES_SAMPLE_RATE && Number.isFinite(n) && n >= 0 && n <= 1 ? n : 0.1,
    apiOrigin,
  };
}

/** Strip the query string & fragment (invitation tokens, URL signatures, etc.). */
export const stripQuery = (url: string) => url.replace(/[?#].*$/, "");

export function initObservability(env: Env = import.meta.env as unknown as Env): void {
  const plan = sentryPlan(env, apiConfig.baseUrl);
  if (!plan) return;
  void import("@sentry/react")
    .then((Sentry) => {
      Sentry.init({
        dsn: plan.dsn,
        environment: plan.environment,
        release: plan.release,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: plan.tracesSampleRate,
        tracePropagationTargets: plan.apiOrigin ? [plan.apiOrigin] : [],
        dataCollection: { userInfo: false, cookies: false, httpBodies: [], urlQueryParams: false },
        beforeSend(event) {
          if (event.request?.url) event.request.url = stripQuery(event.request.url);
          return event;
        },
        beforeBreadcrumb(crumb) {
          if (typeof crumb.data?.url === "string") crumb.data.url = stripQuery(crumb.data.url);
          return crumb;
        },
      });
    })
    .catch(() => undefined);
}
