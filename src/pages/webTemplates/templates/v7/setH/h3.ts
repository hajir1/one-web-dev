import { h } from "./dsl";
import { CRYPTO, DEVOPS, IOT, MARKETING, SOCIAL } from "./domainsC";
import type { HSpec } from "./spec";

/* Batch 3 (20): pemasaran, media sosial, DevOps, IoT/energi, kripto. */
export const H3: HSpec[] = [
  h("dash-kanal-iklan", "Kanal Iklan", MARKETING, { cat: "agency", shell: "side-light", card: "shadow", kpi: "accent", pal: ["#1f2937", "#6b7280", "#ec4899", "#be185d", "#fce7f3", "#ececf1"], font: ["Montserrat", "Inter"], r: 14, bg: "#fcf9fb", login: "split", pages: 1, home: 5, fx: "aos" }),
  h("dash-roas-lab", "ROAS Lab", MARKETING, { shell: "topnav", card: "accent", kpi: "tint", pal: ["#0f172a", "#64748b", "#e24d1f", "#c2410c", "#ffedd5", "#e5e7eb"], font: ["Space Grotesk", "Work Sans"], r: 10, bg: "#fffaf6", login: "banner", pages: 3, home: 3, fx: "animate" }),
  h("dash-gaung", "Gaung", MARKETING, { tier: "free", shell: "side-float", card: "border", kpi: "plain", pal: ["#18181b", "#71717a", "#6741d9", "#5b21b6", "#ede9fe", "#e4e4e7"], font: ["Poppins", "Poppins"], r: 16, bg: "#faf8ff", login: "center", pages: 2, home: 0 }),
  h("dash-sorot", "Sorot", MARKETING, { shell: "side-brand", card: "flat", kpi: "counter", pal: ["#1c1917", "#78716c", "#dc2626", "#991b1b", "#fee2e2", "#e7e5e4"], font: ["Bebas Neue", "Work Sans"], r: 4, bg: "#fbf7f5", login: "split", pages: 4, home: 2 }),

  h("dash-kreator-hub", "Kreator Hub", SOCIAL, { cat: "creative", shell: "side-float", card: "glass", kpi: "icon", pal: ["#f5f3ff", "#a1a1aa", "#ff5fa2", "#db2777", "#500724", "#2a2233"], font: ["Outfit", "Outfit"], r: 22, bg: "#140f1a", sf: "#1d1626", dark: true, login: "split", pages: 1, home: 6, fx: "aos" }),
  h("dash-sorak", "Sorak", SOCIAL, { shell: "topnav", card: "brutal", kpi: "plain", pal: ["#0a0a0a", "#404040", "#a16207", "#713f12", "#fef08a", "#d4d4d4"], font: ["Archivo Black", "Rubik"], r: 8, bg: "#fffdf0", login: "banner", pages: 2, home: 4 }),
  h("dash-linimasa", "Linimasa", SOCIAL, { shell: "rail", card: "shadow", kpi: "split", pal: ["#111827", "#6b7280", "#0890a8", "#0e7490", "#cffafe", "#e5e7eb"], font: ["Nunito", "Inter"], r: 18, bg: "#f5fbfc", login: "center", pages: 3, home: 1, fx: "animate" }),
  h("dash-gema-sosial", "Gema", SOCIAL, { tier: "free", shell: "side-light", card: "flat", kpi: "tint", pal: ["#27272a", "#71717a", "#d946ef", "#a21caf", "#fae8ff", "#e4e4e7"], font: ["Josefin Sans", "Nunito"], r: 14, bg: "#fdf8fe", login: "split", pages: 4, home: 7 }),

  h("dash-tiang-ops", "Tiang Ops", DEVOPS, { cat: "technology", shell: "side-dark", card: "border", kpi: "split", pal: ["#e2e8f0", "#94a3b8", "#4ade80", "#16a34a", "#052e16", "#243042"], font: ["JetBrains Mono", "Inter"], r: 6, bg: "#0d1117", sf: "#161b22", dark: true, login: "split", pages: 5, home: 6, fx: "animate", tags: ["dark mode"] }),
  h("dash-uptime", "Uptime", DEVOPS, { shell: "topnav-dark", card: "accent", kpi: "icon", pal: ["#0f172a", "#64748b", "#1b8f45", "#15803d", "#dcfce7", "#e2e8f0"], font: ["Inter", "Inter"], r: 8, bg: "#f6f8fa", login: "center", pages: 0, home: 2 }),
  h("dash-kluster", "Kluster", DEVOPS, { shell: "rail", card: "flat", kpi: "accent", pal: ["#e5e7eb", "#9ca3af", "#60a5fa", "#2563eb", "#172554", "#26303f"], font: ["Space Mono", "Inter"], r: 4, bg: "#0b0f17", sf: "#121826", dark: true, login: "banner", pages: 2, home: 5, fx: "aos" }),
  h("dash-pipa-rilis", "Pipa Rilis", DEVOPS, { shell: "side-light", card: "brutal", kpi: "counter", pal: ["#111111", "#525252", "#7048e8", "#5b21b6", "#ede9fe", "#d4d4d4"], font: ["Space Grotesk", "Inter"], r: 0, bg: "#fafafa", login: "split", pages: 3, home: 0 }),

  h("dash-watt", "Watt", IOT, { cat: "energy", shell: "side-brand", card: "shadow", kpi: "icon", pal: ["#1a2e05", "#57534e", "#5c940d", "#3f6212", "#ecfccb", "#e2e8d8"], font: ["Sora", "Inter"], r: 16, bg: "#f7faf2", login: "split", pages: 4, home: 1, fx: "aos" }),
  h("dash-sensorik", "Sensorik", IOT, { shell: "side-dark", card: "glass", kpi: "counter", pal: ["#e0f2fe", "#94a3b8", "#38bdf8", "#0284c7", "#0c4a6e", "#1e2b3c"], font: ["Outfit", "Inter"], r: 14, bg: "#081420", sf: "#0f1e2e", dark: true, login: "center", pages: 1, home: 3, fx: "animate" }),
  h("dash-gedung-pintar", "Gedung Pintar", IOT, { shell: "topnav", card: "accent", kpi: "split", pal: ["#0f172a", "#64748b", "#0f9d8a", "#0b6e61", "#d5f5ef", "#e2e8f0"], font: ["Plus Jakarta Sans", "Inter"], r: 12, bg: "#f5faf9", login: "banner", pages: 5, home: 6 }),
  h("dash-surya-panel", "Surya Panel", IOT, { shell: "side-float", card: "border", kpi: "tint", pal: ["#292524", "#78716c", "#b86e00", "#b45309", "#fef3c7", "#e7e5e4"], font: ["Rubik", "Inter"], r: 20, bg: "#fffbf2", login: "split", pages: 2, home: 7 }),

  h("dash-dompet-koin", "Dompet Koin", CRYPTO, { cat: "finance", shell: "side-dark", card: "shadow", kpi: "accent", pal: ["#f8fafc", "#94a3b8", "#f7931a", "#c2410c", "#431407", "#2a2f3a"], font: ["Sora", "Inter"], r: 16, bg: "#0f1115", sf: "#181b22", dark: true, login: "split", pages: 4, home: 0, fx: "aos" }),
  h("dash-rantai", "Rantai", CRYPTO, { shell: "topnav-dark", card: "glass", kpi: "split", pal: ["#ede9fe", "#a1a1aa", "#b197fc", "#7c3aed", "#2e1065", "#2b2440"], font: ["Space Grotesk", "Inter"], r: 20, bg: "#0e0b18", sf: "#171225", dark: true, login: "center", pages: 2, home: 3, fx: "animate" }),
  h("dash-satoshi", "Satoshi", CRYPTO, { shell: "side-light", card: "border", kpi: "icon", pal: ["#111827", "#6b7280", "#c7841a", "#92400e", "#fef3c7", "#e5e7eb"], font: ["JetBrains Mono", "Work Sans"], r: 6, bg: "#fcfaf6", login: "banner", pages: 1, home: 5 }),
  h("dash-blok-aset", "Blok Aset", CRYPTO, { shell: "rail", card: "accent", kpi: "tint", pal: ["#0f172a", "#64748b", "#0a7ea4", "#155e75", "#cffafe", "#e2e8f0"], font: ["Syne", "Inter"], r: 12, bg: "#f4f9fb", login: "split", pages: 3, home: 2, fx: "aos" }),
];
