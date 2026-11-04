import { h } from "./dsl";
import { DONATION, EVENTS, FARM, GYM, PROPERTY } from "./domainsE";
import type { HSpec } from "./spec";

/* Batch 5 (20): property & rentals, gym, agriculture, foundations & donations, event organizers. */
export const H5: HSpec[] = [
  h("dash-unit-sewa", "Unit Sewa", PROPERTY, { cat: "realestate", shell: "side-light", card: "accent", kpi: "split", pal: ["#1c2b36", "#64748b", "#2d6a8f", "#1e4d69", "#dceaf3", "#e2e8ee"], font: ["Montserrat", "Inter"], r: 10, bg: "#f5f8fa", login: "split", pages: 4, home: 1, fx: "aos" }),
  h("dash-kosan", "Kosan", PROPERTY, { tier: "free", shell: "topnav", card: "shadow", kpi: "plain", pal: ["#292524", "#78716c", "#b5532a", "#8c3d1d", "#f8e3d9", "#e7e5e4"], font: ["Rubik", "Rubik"], r: 14, bg: "#fcf8f5", login: "center", pages: 2, home: 6 }),
  h("dash-hunian-prima", "Hunian Prima", PROPERTY, { shell: "side-brand", card: "flat", kpi: "counter", pal: ["#1a1a2e", "#6b7280", "#7a5c3e", "#5a422b", "#efe6dc", "#e6e1da"], font: ["Cormorant Garamond", "Inter"], r: 4, bg: "#f8f6f2", login: "banner", pages: 3, home: 3, fx: "animate" }),
  h("dash-gedung-malam", "Gedung", PROPERTY, { shell: "topnav-dark", card: "glass", kpi: "tint", pal: ["#e7eef5", "#94a3b8", "#7fb3d5", "#4a86b0", "#123049", "#22303f"], font: ["Sora", "Inter"], r: 16, bg: "#0c141c", sf: "#14202b", dark: true, login: "split", pages: 5, home: 7 }),

  h("dash-otot", "Otot", GYM, { cat: "fitness", shell: "side-dark", card: "brutal", kpi: "accent", pal: ["#0a0a0a", "#404040", "#d6336c", "#a61e4d", "#ffdeeb", "#d4d4d4"], font: ["Bebas Neue", "Rubik"], r: 2, bg: "#f8f8f8", login: "split", pages: 1, home: 4, fx: "animate" }),
  h("dash-bugar", "Bugar", GYM, { shell: "topnav", card: "flat", kpi: "icon", pal: ["#111827", "#6b7280", "#0c8599", "#0b7285", "#d0ebff", "#e5e7eb"], font: ["Outfit", "Outfit"], r: 18, bg: "#f6fafb", login: "banner", pages: 3, home: 0, fx: "aos" }),
  h("dash-arena-fit", "Arena Fit", GYM, { shell: "rail", card: "glass", kpi: "counter", pal: ["#f4f4f5", "#a1a1aa", "#c0eb75", "#82c91e", "#2b3a12", "#2a2d25"], font: ["Oswald", "Inter"], r: 10, bg: "#0f110c", sf: "#181b14", dark: true, login: "split", pages: 4, home: 2, tags: ["dark mode"] }),
  h("dash-studio-yoga", "Studio Napas", GYM, { tier: "free", shell: "side-float", card: "border", kpi: "tint", pal: ["#2f3e46", "#6b7f86", "#52796f", "#354f52", "#dfece6", "#e3e9e6"], font: ["Lora", "Nunito"], r: 22, bg: "#f6f8f6", login: "center", pages: 0, home: 5 }),

  h("dash-tani-maju", "Tani Maju", FARM, { cat: "agriculture", shell: "side-brand", card: "shadow", kpi: "icon", pal: ["#1f2a1a", "#66705f", "#4c7a2a", "#365a1d", "#e3f0d8", "#e2e7dc"], font: ["Merriweather", "Work Sans"], r: 12, bg: "#f7f9f3", login: "split", pages: 0, home: 3, fx: "aos" }),
  h("dash-sawah", "Sawah", FARM, { shell: "topnav", card: "accent", kpi: "split", pal: ["#2b2a1f", "#77735f", "#8a7a1b", "#665a10", "#f3eed0", "#e8e5d6"], font: ["Fraunces", "Work Sans"], r: 8, bg: "#fbfaf2", login: "banner", pages: 2, home: 1 }),
  h("dash-kebun-pintar", "Kebun Pintar", FARM, { shell: "side-light", card: "glass", kpi: "counter", pal: ["#13322b", "#5e7a72", "#0f7b5f", "#0a5c47", "#d3f1e7", "#d9e7e2"], font: ["Sora", "Inter"], r: 18, bg: "#eef6f2", login: "center", pages: 4, home: 4, fx: "animate" }),
  h("dash-ladang-malam", "Ladang", FARM, { shell: "side-dark", card: "flat", kpi: "tint", pal: ["#ecfccb", "#a3a38f", "#a3c75c", "#6f9431", "#2a3510", "#2c3120"], font: ["Space Grotesk", "Inter"], r: 6, bg: "#10130b", sf: "#191d12", dark: true, login: "split", pages: 5, home: 6 }),

  h("dash-peduli", "Peduli", DONATION, { cat: "nonprofit", shell: "side-light", card: "shadow", kpi: "icon", pal: ["#3a1f2b", "#7d6670", "#c2255c", "#9c1c4a", "#fde2ec", "#efe3e8"], font: ["Nunito", "Nunito"], r: 16, bg: "#fdf7f9", login: "split", pages: 3, home: 1, fx: "aos" }),
  h("dash-uluran", "Uluran", DONATION, { tier: "free", shell: "topnav", card: "border", kpi: "plain", pal: ["#1d2b28", "#5f716c", "#1f7a63", "#155c4a", "#d7efe8", "#e1e9e6"], font: ["Plus Jakarta Sans", "Plus Jakarta Sans"], r: 12, bg: "#f6faf8", login: "center", pages: 4, home: 4 }),
  h("dash-yayasan-terang", "Yayasan Terang", DONATION, { shell: "side-float", card: "accent", kpi: "counter", pal: ["#2a2016", "#7a6e62", "#b7791f", "#8a5a12", "#faeed8", "#ece4d8"], font: ["Playfair Display", "Work Sans"], r: 10, bg: "#fcf9f3", login: "banner", pages: 1, home: 7, fx: "animate" }),
  h("dash-gotong", "Gotong", DONATION, { shell: "rail", card: "brutal", kpi: "split", pal: ["#0a0a0a", "#404040", "#1864ab", "#0b4884", "#d0ebff", "#d4d4d4"], font: ["Archivo Black", "Work Sans"], r: 6, bg: "#f6f9fc", login: "split", pages: 5, home: 0 }),

  h("dash-panitia", "Panitia", EVENTS, { cat: "event", shell: "side-dark", card: "accent", kpi: "split", pal: ["#1e1b2e", "#6b6880", "#7950f2", "#5f3dc4", "#e5dbff", "#e4e2ec"], font: ["Syne", "Inter"], r: 14, bg: "#f8f7fc", login: "split", pages: 1, home: 0, fx: "aos" }),
  h("dash-tiket-fest", "Tiket Fest", EVENTS, { shell: "topnav-dark", card: "brutal", kpi: "accent", pal: ["#0a0a0a", "#404040", "#e03131", "#b02525", "#ffe3e3", "#d4d4d4"], font: ["Righteous", "Rubik"], r: 8, bg: "#fff8f6", login: "banner", pages: 3, home: 5, fx: "animate" }),
  h("dash-panggung", "Panggung", EVENTS, { shell: "side-brand", card: "glass", kpi: "icon", pal: ["#fff1f2", "#b7a3a8", "#ff8fab", "#e64980", "#4c0519", "#3a2229"], font: ["Bebas Neue", "Inter"], r: 18, bg: "#170b10", sf: "#22121a", dark: true, login: "split", pages: 4, home: 6, tags: ["dark mode"] }),
  h("dash-konferensi", "Konferensi", EVENTS, { shell: "side-light", card: "border", kpi: "tint", pal: ["#0f1d3a", "#5b6b85", "#2255b8", "#173d87", "#dde7fa", "#e1e6ef"], font: ["Inter", "Inter"], r: 8, bg: "#f6f8fc", login: "center", pages: 2, home: 3 }),
];
