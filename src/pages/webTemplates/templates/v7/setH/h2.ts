import { h } from "./dsl";
import { HR, INVENTORY, PROJECT, SAAS, SUPPORT } from "./domainsB";
import type { HSpec } from "./spec";

/* Batch 2 (20): manajemen proyek, metrik SaaS, SDM, inventaris, layanan pelanggan. */
export const H2: HSpec[] = [
  h("dash-papan-kerja", "Papan Kerja", PROJECT, { shell: "side-light", card: "flat", kpi: "tint", pal: ["#1c1917", "#78716c", "#8b5cf6", "#6d28d9", "#ede9fe", "#e7e5e4"], font: ["Outfit", "Inter"], r: 12, bg: "#fafaf9", login: "split", pages: 3, home: 6, fx: "aos" }),
  h("dash-tenggat", "Tenggat", PROJECT, { tier: "free", shell: "topnav", card: "shadow", kpi: "plain", pal: ["#0f172a", "#64748b", "#0891b2", "#0e7490", "#cffafe", "#e2e8f0"], font: ["Rubik", "Rubik"], r: 10, bg: "#f8fafc", login: "center", pages: 1, home: 7 }),
  h("dash-sprint-malam", "Sprint Malam", PROJECT, { shell: "rail", card: "glass", kpi: "counter", pal: ["#e5e7eb", "#9ca3af", "#facc15", "#ca8a04", "#422006", "#1f2937"], font: ["JetBrains Mono", "Inter"], r: 10, bg: "#0a0a0a", sf: "#141414", dark: true, login: "banner", pages: 1, home: 3, fx: "animate", tags: ["dark mode"] }),
  h("dash-lentera-studio", "Lentera Studio", PROJECT, { cat: "coworking", shell: "side-float", card: "accent", kpi: "icon", pal: ["#292524", "#78716c", "#d97706", "#b45309", "#fef3c7", "#e7e5e4"], font: ["Fraunces", "Inter"], r: 16, bg: "#fdf8f0", login: "split", pages: 4, home: 0 }),

  h("dash-langganan", "Langganan.io", SAAS, { cat: "saas", shell: "side-dark", card: "border", kpi: "split", pal: ["#111827", "#6b7280", "#6366f1", "#4f46e5", "#e0e7ff", "#e5e7eb"], font: ["Inter", "Inter"], r: 8, bg: "#f9fafb", login: "split", pages: 4, home: 4, fx: "aos" }),
  h("dash-mrr-pulse", "MRR Pulse", SAAS, { shell: "topnav-dark", card: "shadow", kpi: "counter", pal: ["#0f172a", "#64748b", "#0a8f63", "#047857", "#d1fae5", "#e2e8f0"], font: ["Sora", "Inter"], r: 14, bg: "#f5f7fa", login: "center", pages: 3, home: 5, fx: "animate" }),
  h("dash-orbit-saas", "Orbit SaaS", SAAS, { shell: "side-brand", card: "glass", kpi: "accent", pal: ["#f1f5f9", "#94a3b8", "#c084fc", "#9333ea", "#3b0764", "#27213a"], font: ["Syne", "Work Sans"], r: 18, bg: "#120d1d", sf: "#1b1528", dark: true, login: "split", pages: 1, home: 1, fx: "aos" }),
  h("dash-kohort", "Kohort", SAAS, { shell: "side-light", card: "brutal", kpi: "tint", pal: ["#0a0a0a", "#404040", "#ef4444", "#b91c1c", "#fee2e2", "#d4d4d4"], font: ["Space Grotesk", "Space Grotesk"], r: 0, bg: "#fafafa", login: "banner", pages: 3, home: 2 }),

  h("dash-insan-hr", "Insan HR", HR, { cat: "recruitment", shell: "side-light", card: "shadow", kpi: "icon", pal: ["#1e293b", "#64748b", "#0ea5a4", "#0f766e", "#ccfbf1", "#e2e8f0"], font: ["Plus Jakarta Sans", "Inter"], r: 14, bg: "#f6f9fb", login: "split", pages: 1, home: 2, fx: "aos" }),
  h("dash-rekan-kerja", "Rekan Kerja", HR, { tier: "free", shell: "side-dark", card: "border", kpi: "plain", pal: ["#1f2937", "#6b7280", "#db2777", "#be185d", "#fce7f3", "#e5e7eb"], font: ["Nunito", "Nunito"], r: 12, bg: "#fdf9fb", login: "center", pages: 0, home: 5 }),
  h("dash-absensi-pro", "Absensi Pro", HR, { shell: "topnav", card: "accent", kpi: "counter", pal: ["#172554", "#64748b", "#1e56d6", "#1e3a8a", "#dbeafe", "#e2e8f0"], font: ["Montserrat", "Inter"], r: 10, bg: "#f5f8ff", login: "banner", pages: 2, home: 7, fx: "animate" }),
  h("dash-talenta", "Talenta", HR, { shell: "side-float", card: "flat", kpi: "split", pal: ["#3f3f46", "#71717a", "#65a30d", "#4d7c0f", "#ecfccb", "#e4e4e7"], font: ["Lora", "Work Sans"], r: 20, bg: "#f7f8f2", login: "split", pages: 4, home: 3 }),

  h("dash-gudang-rapi", "Gudang Rapi", INVENTORY, { cat: "logistics", shell: "side-dark", card: "flat", kpi: "icon", pal: ["#18181b", "#71717a", "#c26a00", "#b45309", "#fef3c7", "#e4e4e7"], font: ["Oswald", "Inter"], r: 6, bg: "#f6f6f4", login: "split", pages: 2, home: 1, fx: "aos" }),
  h("dash-stokku", "Stokku", INVENTORY, { shell: "topnav", card: "border", kpi: "tint", pal: ["#0f172a", "#64748b", "#0e8f82", "#0d9488", "#ccfbf1", "#e2e8f0"], font: ["Outfit", "Outfit"], r: 12, bg: "#f7fafa", login: "center", pages: 5, home: 4 }),
  h("dash-palet", "Palet", INVENTORY, { shell: "rail", card: "brutal", kpi: "accent", pal: ["#111827", "#4b5563", "#4f8a0b", "#365f08", "#ecfccb", "#d1d5db"], font: ["Archivo Black", "Work Sans"], r: 2, bg: "#f9fbf4", login: "banner", pages: 0, home: 6, fx: "animate" }),
  h("dash-depo-gelap", "Depo", INVENTORY, { shell: "side-brand", card: "border", kpi: "counter", pal: ["#e2e8f0", "#94a3b8", "#fb923c", "#ea580c", "#431407", "#2b2f3a"], font: ["Bebas Neue", "Inter"], r: 8, bg: "#111318", sf: "#1a1d24", dark: true, login: "split", pages: 3, home: 0 }),

  h("dash-sigap-cs", "Sigap CS", SUPPORT, { cat: "technology", shell: "side-light", card: "accent", kpi: "split", pal: ["#111827", "#6b7280", "#f43f5e", "#9f1239", "#ffe4e6", "#e5e7eb"], font: ["Poppins", "Inter"], r: 12, bg: "#fbf8f9", login: "split", pages: 1, home: 4, fx: "aos" }),
  h("dash-halo-desk", "Halo Desk", SUPPORT, { shell: "topnav-dark", card: "flat", kpi: "icon", pal: ["#0f172a", "#64748b", "#3b82f6", "#1d4ed8", "#dbeafe", "#e2e8f0"], font: ["Josefin Sans", "Inter"], r: 16, bg: "#f4f7fc", login: "center", pages: 4, home: 2 }),
  h("dash-tiketin", "Tiketin", SUPPORT, { shell: "side-float", card: "shadow", kpi: "accent", pal: ["#1e1b4b", "#6b7280", "#a855f7", "#7e22ce", "#f3e8ff", "#e9e5f5"], font: ["Righteous", "Nunito"], r: 22, bg: "#faf7ff", login: "banner", pages: 5, home: 6, fx: "animate" }),
  h("dash-ruang-bantu", "Ruang Bantu", SUPPORT, { shell: "side-dark", card: "glass", kpi: "tint", pal: ["#ecfeff", "#94a3b8", "#2dd4bf", "#14b8a6", "#134e4a", "#1f2d3a"], font: ["Space Grotesk", "Inter"], r: 12, bg: "#0b1416", sf: "#112024", dark: true, login: "split", pages: 2, home: 7 }),
];
