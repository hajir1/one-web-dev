import { h } from "./dsl";
import { ADMIN, CRM, ECOMMERCE, FINANCE, WEBSTATS } from "./domainsA";
import type { HSpec } from "./spec";

/* Batch 1 (20): admin umum, analitik web, admin e-commerce, CRM, keuangan. */
export const H1: HSpec[] = [
  h("dash-nimbus-admin", "Nimbus Admin", ADMIN, { shell: "side-dark", card: "shadow", kpi: "icon", pal: ["#0f172a", "#64748b", "#4f46e5", "#3730a3", "#eef2ff", "#e2e8f0"], font: ["Inter", "Inter"], r: 12, bg: "#f4f6fb", login: "split", pages: 1, home: 0, fx: "aos" }),
  h("dash-tegak-panel", "Tegak Panel", ADMIN, { tier: "free", shell: "side-light", card: "border", kpi: "plain", pal: ["#111827", "#6b7280", "#2563eb", "#1d4ed8", "#dbeafe", "#e5e7eb"], font: ["Plus Jakarta Sans", "Plus Jakarta Sans"], r: 10, bg: "#f9fafb", login: "center", pages: 0, home: 1 }),
  h("dash-kontrol-gelap", "Kontrol", ADMIN, { shell: "side-brand", card: "glass", kpi: "tint", pal: ["#e2e8f0", "#94a3b8", "#22d3ee", "#0891b2", "#164e63", "#1e293b"], font: ["Sora", "Inter"], r: 14, bg: "#0b1220", sf: "#111a2e", dark: true, login: "split", pages: 3, home: 4, fx: "animate" }),
  h("dash-blok-admin", "Blok Admin", ADMIN, { shell: "topnav", card: "brutal", kpi: "accent", pal: ["#111111", "#525252", "#e2570b", "#c2410c", "#ffedd5", "#d4d4d4"], font: ["Space Grotesk", "Work Sans"], r: 6, bg: "#fffbeb", login: "banner", pages: 2, home: 2 }),

  h("dash-lintas-analytics", "Lintas Analytics", WEBSTATS, { shell: "topnav", card: "border", kpi: "split", pal: ["#111827", "#6b7280", "#0d9488", "#0f766e", "#ccfbf1", "#e5e7eb"], font: ["Space Grotesk", "Inter"], r: 12, bg: "#f8fafc", login: "center", pages: 5, home: 5, fx: "aos" }),
  h("dash-gelombang", "Gelombang", WEBSTATS, { shell: "side-dark", card: "flat", kpi: "counter", pal: ["#f1f5f9", "#94a3b8", "#a78bfa", "#7c3aed", "#2e1065", "#27273a"], font: ["Outfit", "Outfit"], r: 16, bg: "#0f0f1a", sf: "#18182a", dark: true, login: "split", pages: 0, home: 7 }),
  h("dash-jejak-web", "Jejak Web", WEBSTATS, { shell: "rail", card: "accent", kpi: "plain", pal: ["#1c1917", "#78716c", "#e11d48", "#be123c", "#ffe4e6", "#e7e5e4"], font: ["Rubik", "Rubik"], r: 8, bg: "#fafaf9", login: "banner", pages: 4, home: 3 }),
  h("dash-sinyal", "Sinyal", WEBSTATS, { shell: "side-float", card: "shadow", kpi: "icon", pal: ["#0c4a6e", "#64748b", "#0284c7", "#0369a1", "#e0f2fe", "#e2e8f0"], font: ["Nunito", "Nunito"], r: 18, bg: "#eef6fb", login: "split", pages: 2, home: 0, fx: "animate" }),

  h("dash-gerai-pro", "Gerai Pro", ECOMMERCE, { cat: "startup", shell: "side-light", card: "shadow", kpi: "icon", pal: ["#0f172a", "#64748b", "#16a34a", "#15803d", "#dcfce7", "#e2e8f0"], font: ["Poppins", "Poppins"], r: 14, bg: "#f6f8f6", login: "split", pages: 1, home: 6, fx: "aos" }),
  h("dash-pasar-kita", "Pasar Kita", ECOMMERCE, { tier: "free", cat: "startup", shell: "topnav", card: "border", kpi: "plain", pal: ["#1f2937", "#6b7280", "#ea580c", "#c2410c", "#ffedd5", "#e5e7eb"], font: ["Nunito", "Nunito"], r: 12, bg: "#fffaf5", login: "center", pages: 0, home: 2 }),
  h("dash-etalase-malam", "Etalase Malam", ECOMMERCE, { shell: "topnav-dark", card: "glass", kpi: "tint", pal: ["#f8fafc", "#a1a1aa", "#f472b6", "#db2777", "#500724", "#27272a"], font: ["Syne", "Inter"], r: 16, bg: "#09090b", sf: "#18181b", dark: true, login: "banner", pages: 4, home: 4 }),
  h("dash-kasir-online", "Kasir Online", ECOMMERCE, { shell: "side-brand", card: "accent", kpi: "split", pal: ["#1e1b4b", "#6366f1", "#7c3aed", "#5b21b6", "#ede9fe", "#e0e7ff"], font: ["Montserrat", "Inter"], r: 10, bg: "#f5f3ff", login: "split", pages: 2, home: 3, fx: "animate" }),

  h("dash-relasi-crm", "Relasio", CRM, { shell: "side-dark", card: "border", kpi: "accent", pal: ["#0f172a", "#64748b", "#0b7fc0", "#0369a1", "#e0f2fe", "#e2e8f0"], font: ["Inter", "Inter"], r: 10, bg: "#f1f5f9", login: "split", pages: 1, home: 6, fx: "aos" }),
  h("dash-jabat-tangan", "Jabat Tangan", CRM, { shell: "topnav", card: "shadow", kpi: "icon", pal: ["#292524", "#78716c", "#b45309", "#92400e", "#fef3c7", "#e7e5e4"], font: ["Fraunces", "Work Sans"], r: 14, bg: "#fdfbf7", login: "banner", pages: 3, home: 1 }),
  h("dash-prospek-plus", "Prospek+", CRM, { shell: "rail", card: "flat", kpi: "tint", pal: ["#e5e7eb", "#9ca3af", "#34d399", "#059669", "#064e3b", "#1f2937"], font: ["JetBrains Mono", "Inter"], r: 8, bg: "#030712", sf: "#111827", dark: true, login: "center", pages: 4, home: 0 }),
  h("dash-kawan-niaga", "Kawan Niaga", CRM, { shell: "side-float", card: "brutal", kpi: "plain", pal: ["#0a0a0a", "#404040", "#4338ca", "#3730a3", "#e0e7ff", "#d4d4d4"], font: ["Archivo Black", "Rubik"], r: 4, bg: "#f5f5f4", login: "split", pages: 2, home: 7 }),

  h("dash-neraca", "Neraca", FINANCE, { cat: "finance", shell: "side-dark", card: "shadow", kpi: "split", pal: ["#0f172a", "#64748b", "#059669", "#047857", "#d1fae5", "#e2e8f0"], font: ["Plus Jakarta Sans", "Inter"], r: 12, bg: "#f4f7f5", login: "split", pages: 2, home: 0, fx: "aos" }),
  h("dash-kas-kecil", "Kas Kecil", FINANCE, { shell: "side-light", card: "accent", kpi: "icon", pal: ["#1e293b", "#64748b", "#0f766e", "#115e59", "#ccfbf1", "#e2e8f0"], font: ["Lora", "Inter"], r: 8, bg: "#f8fafc", login: "banner", pages: 1, home: 5 }),
  h("dash-saldo-emas", "Saldo Emas", FINANCE, { shell: "topnav-dark", card: "border", kpi: "counter", pal: ["#fefce8", "#a8a29e", "#eab308", "#ca8a04", "#422006", "#292524"], font: ["DM Serif Display", "Inter"], r: 10, bg: "#0c0a09", sf: "#1c1917", dark: true, login: "split", pages: 4, home: 3, fx: "animate" }),
  h("dash-pembukuan", "Pembukuan.id", FINANCE, { shell: "topnav", card: "flat", kpi: "tint", pal: ["#172554", "#64748b", "#1d4ed8", "#1e3a8a", "#dbeafe", "#e2e8f0"], font: ["Merriweather", "Work Sans"], r: 6, bg: "#eef2f7", sf: "#ffffff", login: "center", pages: 0, home: 4 }),
];
