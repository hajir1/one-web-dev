import { h } from "./dsl";
import { CLINIC, FLEET, HOTEL, LMS, POS } from "./domainsD";
import type { HSpec } from "./spec";

/* Batch 4 (20): kursus online, klinik, armada & pengiriman, hotel, kasir restoran. */
export const H4: HSpec[] = [
  h("dash-kelasku", "Kelasku", LMS, { cat: "education", shell: "side-light", card: "shadow", kpi: "icon", pal: ["#1e1b4b", "#64748b", "#5b5bd6", "#3e3eb8", "#e6e6fb", "#e5e7eb"], font: ["Nunito", "Nunito"], r: 16, bg: "#f7f7fd", login: "split", pages: 4, home: 7, fx: "aos" }),
  h("dash-pena-belajar", "Pena Belajar", LMS, { tier: "free", shell: "topnav", card: "border", kpi: "tint", pal: ["#1f2937", "#6b7280", "#0b7a75", "#075e5a", "#d2f1ef", "#e5e7eb"], font: ["Lora", "Inter"], r: 12, bg: "#f6faf9", login: "center", pages: 3, home: 2 }),
  h("dash-akademi", "Akademi", LMS, { shell: "side-brand", card: "accent", kpi: "counter", pal: ["#18181b", "#71717a", "#c2185b", "#8e1145", "#fce4ef", "#e7e5e4"], font: ["Playfair Display", "Work Sans"], r: 10, bg: "#fcf8f9", login: "banner", pages: 1, home: 5, fx: "animate" }),
  h("dash-kampus-malam", "Kampus Malam", LMS, { shell: "rail", card: "glass", kpi: "split", pal: ["#eef2ff", "#a5b4fc", "#8c9eff", "#5c6ac4", "#1e1b4b", "#272a45"], font: ["Outfit", "Inter"], r: 18, bg: "#0e0f1f", sf: "#171933", dark: true, login: "split", pages: 2, home: 1 }),

  h("dash-sehat-klinik", "Sehat Klinik", CLINIC, { cat: "health", shell: "side-light", card: "accent", kpi: "icon", pal: ["#0f2a2e", "#5f7a7d", "#0d8f8f", "#0a6b6b", "#d7f2f2", "#dfe9ea"], font: ["Plus Jakarta Sans", "Inter"], r: 14, bg: "#f4fafa", login: "split", pages: 0, home: 4, fx: "aos" }),
  h("dash-medika", "Medika", CLINIC, { shell: "topnav", card: "flat", kpi: "split", pal: ["#102a43", "#627d98", "#2f6fdf", "#1f4fa8", "#dce8fb", "#e1e7ef"], font: ["Inter", "Inter"], r: 10, bg: "#f5f8fc", login: "center", pages: 5, home: 3 }),
  h("dash-poli-ceria", "Poli Ceria", CLINIC, { shell: "side-float", card: "shadow", kpi: "counter", pal: ["#3b2f2f", "#7a6a6a", "#e0607e", "#b23a5a", "#fde4ea", "#efe4e6"], font: ["Nunito", "Rubik"], r: 22, bg: "#fff8f9", login: "banner", pages: 1, home: 6, fx: "animate" }),
  h("dash-rekam-medis", "Rekam", CLINIC, { tier: "free", shell: "side-dark", card: "border", kpi: "plain", pal: ["#1e293b", "#64748b", "#178a5b", "#0f6a45", "#d8f3e6", "#e2e8f0"], font: ["Work Sans", "Work Sans"], r: 8, bg: "#f6f9f8", login: "split", pages: 3, home: 0 }),

  h("dash-armada", "Armada", FLEET, { cat: "logistics", shell: "side-dark", card: "shadow", kpi: "accent", pal: ["#111827", "#6b7280", "#d9480f", "#a63a0a", "#ffe8dc", "#e5e7eb"], font: ["Oswald", "Inter"], r: 8, bg: "#f7f6f4", login: "split", pages: 2, home: 5, fx: "aos" }),
  h("dash-kirim-cepat", "Kirim Cepat", FLEET, { shell: "topnav-dark", card: "border", kpi: "icon", pal: ["#0f172a", "#64748b", "#0b6bcb", "#08519b", "#dbeafe", "#e2e8f0"], font: ["Montserrat", "Inter"], r: 12, bg: "#f4f7fb", login: "center", pages: 1, home: 2 }),
  h("dash-rute-malam", "Rute", FLEET, { shell: "side-float", card: "glass", kpi: "tint", pal: ["#fef3c7", "#a8a29e", "#ffb020", "#d97706", "#451a03", "#33291f"], font: ["Bebas Neue", "Inter"], r: 14, bg: "#14110d", sf: "#1f1a14", dark: true, login: "banner", pages: 4, home: 6, fx: "animate", tags: ["dark mode"] }),
  h("dash-ekspedisi", "Ekspedisi", FLEET, { shell: "side-light", card: "brutal", kpi: "split", pal: ["#0a0a0a", "#404040", "#2b8a3e", "#1e6b2e", "#d3f9d8", "#d4d4d4"], font: ["Space Grotesk", "Work Sans"], r: 4, bg: "#f7faf6", login: "split", pages: 5, home: 1 }),

  h("dash-meja-depan", "Meja Depan", HOTEL, { cat: "hospitality", shell: "side-light", card: "shadow", kpi: "split", pal: ["#2b2118", "#7c6f64", "#9a6b2f", "#734f20", "#f4e9da", "#ebe3d9"], font: ["Cormorant Garamond", "Work Sans"], r: 6, bg: "#faf7f2", login: "split", pages: 4, home: 0, fx: "aos" }),
  h("dash-inap", "Inap", HOTEL, { shell: "topnav", card: "accent", kpi: "icon", pal: ["#0f2537", "#5b6f80", "#1a7f9c", "#125e74", "#d6eef5", "#e0e8ee"], font: ["Josefin Sans", "Inter"], r: 14, bg: "#f5f9fb", login: "banner", pages: 2, home: 5 }),
  h("dash-resor-senja", "Resor Senja", HOTEL, { shell: "side-brand", card: "glass", kpi: "counter", pal: ["#fdf2f8", "#b4a3ad", "#f08ab4", "#c2457b", "#4a0f2a", "#3a2632"], font: ["DM Serif Display", "Inter"], r: 20, bg: "#1a0f15", sf: "#26161f", dark: true, login: "split", pages: 1, home: 3, fx: "animate" }),
  h("dash-wisma", "Wisma", HOTEL, { shell: "rail", card: "flat", kpi: "accent", pal: ["#1c1917", "#78716c", "#3d7a5a", "#2a5a41", "#dcefe4", "#e7e5e4"], font: ["Libre Baskerville", "Inter"], r: 10, bg: "#f6f8f5", login: "center", pages: 3, home: 7 }),

  h("dash-kasir-kopi", "Kasir Kopi", POS, { cat: "restaurant", shell: "side-dark", card: "accent", kpi: "tint", pal: ["#2a1e17", "#7a6a60", "#8a5a3c", "#64402a", "#f2e5dc", "#eae1da"], font: ["Fraunces", "Inter"], r: 12, bg: "#faf6f2", login: "split", pages: 0, home: 2, fx: "aos" }),
  h("dash-warung-digital", "Warung Digital", POS, { tier: "free", shell: "topnav", card: "shadow", kpi: "plain", pal: ["#1f2937", "#6b7280", "#c92a2a", "#a51d1d", "#ffe3e3", "#e5e7eb"], font: ["Poppins", "Poppins"], r: 14, bg: "#fffaf9", login: "center", pages: 2, home: 4 }),
  h("dash-dapur-pro", "Dapur Pro", POS, { shell: "side-float", card: "brutal", kpi: "counter", pal: ["#111111", "#525252", "#e8590c", "#b54708", "#ffe8cc", "#d4d4d4"], font: ["Righteous", "Rubik"], r: 10, bg: "#fff9f2", login: "banner", pages: 4, home: 6, fx: "animate" }),
  h("dash-bistro-malam", "Bistro", POS, { shell: "topnav-dark", card: "glass", kpi: "icon", pal: ["#f5f5f4", "#a8a29e", "#e9b872", "#b8863b", "#3d2c14", "#332c24"], font: ["Playfair Display", "Inter"], r: 16, bg: "#12100d", sf: "#1c1915", dark: true, login: "split", pages: 5, home: 1 }),
];
