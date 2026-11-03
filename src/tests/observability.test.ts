import test from "node:test";
import assert from "node:assert/strict";
import { sentryPlan, stripQuery } from "../observability";

/* v7 (P10): Sentry browser opsional. */

test("tanpa VITE_SENTRY_DSN → mati", () => {
  assert.equal(sentryPlan({}, "http://localhost:3000"), null);
  assert.equal(sentryPlan({ VITE_SENTRY_DSN: "bukan-url" }, null), null);
});

test("DSN valid: sampling default 0,1, header trace hanya ke origin API", () => {
  const p = sentryPlan({ VITE_SENTRY_DSN: "https://k@o1.ingest.sentry.io/3", MODE: "production" }, "https://api.onewebdev.id/v1");
  assert.deepEqual(p, { dsn: "https://k@o1.ingest.sentry.io/3", environment: "production", release: undefined, tracesSampleRate: 0.1, apiOrigin: "https://api.onewebdev.id" });
  assert.equal(sentryPlan({ VITE_SENTRY_DSN: "https://k@x/1", VITE_SENTRY_TRACES_SAMPLE_RATE: "0.5" }, null)?.tracesSampleRate, 0.5);
  assert.equal(sentryPlan({ VITE_SENTRY_DSN: "https://k@x/1", VITE_SENTRY_TRACES_SAMPLE_RATE: "3" }, null)?.tracesSampleRate, 0.1);
});

test("stripQuery membuang token & tanda tangan URL", () => {
  assert.equal(stripQuery("https://a.id/id/team/join?token=rahasia#x"), "https://a.id/id/team/join");
});
