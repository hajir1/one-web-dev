/* ================================================================== */
/* Ikon ilustrasi UMKM (v23): SVG garis + isian dua warna, 64x64.        */
/* Garis = currentColor, isian .f1 = aksen, .f2 = aksen kedua.          */
/* Dipakai di hero, kartu produk, dan latar dekoratif landing page.      */
/* ================================================================== */

export const ICONS: Record<string, string> = {
  cup: `<path class="f1" d="M14 24h30v16a14 14 0 0 1-14 14h-2a14 14 0 0 1-14-14z"/><path d="M14 24h30v16a14 14 0 0 1-14 14h-2a14 14 0 0 1-14-14zM44 28h4a6 6 0 0 1 0 12h-5M10 58h40"/><path d="M22 8c-3 4 3 6 0 10M30 6c-3 4 3 6 0 10M38 8c-3 4 3 6 0 10"/>`,
  iced: `<path class="f1" d="M18 22h28l-4 34H22z"/><path d="M18 22h28l-4 34H22zM16 16h32v6H16zM36 16l6-12h6"/><circle class="f2" cx="26" cy="48" r="3"/><circle class="f2" cx="34" cy="50" r="3"/><circle class="f2" cx="30" cy="43" r="3"/>`,
  bowl: `<path class="f1" d="M8 30h48a24 22 0 0 1-48 0z"/><path d="M8 30h48a24 22 0 0 1-48 0zM22 52h20M40 6l-8 22M50 10l-14 18"/><circle class="f2" cx="22" cy="26" r="5"/><circle class="f2" cx="32" cy="24" r="5"/>`,
  plate: `<ellipse class="f2" cx="32" cy="38" rx="26" ry="14"/><ellipse cx="32" cy="38" rx="26" ry="14"/><path class="f1" d="M18 36c2-10 26-12 28 0z"/><path d="M18 36c2-10 26-12 28 0zM8 14v14M12 14v14M10 28v28M56 12c-6 6-6 16 0 18v26"/>`,
  skewer: `<path d="M6 58 58 6"/><rect class="f1" x="16" y="34" width="12" height="12" rx="3" transform="rotate(-45 22 40)"/><rect class="f2" x="26" y="24" width="12" height="12" rx="3" transform="rotate(-45 32 30)"/><rect class="f1" x="36" y="14" width="12" height="12" rx="3" transform="rotate(-45 42 20)"/><path d="M8 46c4 0 4 4 8 4M18 56c0-4 4-4 4-8"/>`,
  noodle: `<path class="f1" d="M8 32h48a24 20 0 0 1-48 0z"/><path d="M8 32h48a24 20 0 0 1-48 0zM18 32c0-10 4-10 4-20M26 32c0-12 4-12 4-24M34 32c0-10 4-10 4-22M46 4 30 30M54 8 36 30"/>`,
  chicken: `<path class="f1" d="M24 40c-12-4-14-22 0-28 14-6 28 4 24 18-2 8-12 14-24 10z"/><path d="M24 40c-12-4-14-22 0-28 14-6 28 4 24 18-2 8-12 14-24 10zM24 40l-8 10M12 46l4 4-2 6M18 52l-4 6"/><path class="f2" d="M30 20c4 0 8 2 8 6"/>`,
  fish: `<path class="f1" d="M8 32c10-14 30-16 42 0-12 16-32 14-42 0z"/><path d="M8 32c10-14 30-16 42 0-12 16-32 14-42 0zM50 32l8-10v20zM24 24c4 4 4 12 0 16"/><circle cx="16" cy="30" r="1.5"/>`,
  bread: `<path class="f1" d="M10 30c0-12 10-18 22-18s22 6 22 18v20H10z"/><path d="M10 30c0-12 10-18 22-18s22 6 22 18v20H10zM22 24l-4 8M32 22l-2 10M42 24l-2 8"/>`,
  cake: `<rect class="f1" x="10" y="32" width="44" height="22" rx="3"/><path d="M10 32h44v22H10zM10 42c6 4 10-4 15 0s10 4 15 0 9-4 14 0M8 54h48"/><rect class="f2" x="18" y="22" width="28" height="10" rx="2"/><path d="M18 22h28v10H18zM32 10v12"/><path class="f1" d="M32 4c3 3 3 6 0 7-3-1-3-4 0-7z"/>`,
  cookie: `<circle class="f1" cx="30" cy="34" r="22"/><circle cx="30" cy="34" r="22"/><circle class="f2" cx="22" cy="28" r="3"/><circle class="f2" cx="36" cy="26" r="3"/><circle class="f2" cx="32" cy="42" r="3"/><circle class="f2" cx="20" cy="40" r="2.5"/><path d="M46 8l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"/>`,
  donut: `<circle class="f1" cx="32" cy="34" r="22"/><circle cx="32" cy="34" r="22"/><circle cx="32" cy="34" r="7"/><path class="f2" d="M14 30c4-12 32-14 36 0-4 4-8 0-12 4s-10 2-12-2-8 2-12-2z"/><path d="M22 22l2 3M40 22l-2 3M34 46l2 2"/>`,
  jar: `<rect class="f2" x="18" y="8" width="28" height="8" rx="2"/><path d="M18 8h28v8H18z"/><path class="f1" d="M16 16h32v34a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6z"/><path d="M16 16h32v34a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6zM22 30h20v14H22z"/>`,
  bottle: `<path class="f1" d="M24 22c0-6 4-8 4-12h8c0 4 4 6 4 12v30a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4z"/><path d="M24 22c0-6 4-8 4-12h8c0 4 4 6 4 12v30a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4zM27 4h10v6H27z"/><rect class="f2" x="24" y="30" width="16" height="12"/>`,
  chili: `<path class="f1" d="M18 20c-6 14 6 34 30 36-14-8-14-24-18-34z"/><path d="M18 20c-6 14 6 34 30 36-14-8-14-24-18-34zM18 20c4-6 10-6 12 0M24 18c0-6 4-10 10-10"/>`,
  leaf: `<path class="f1" d="M10 54C10 26 26 10 54 10c0 28-16 44-44 44z"/><path d="M10 54C10 26 26 10 54 10c0 28-16 44-44 44zM10 54 40 24M24 40h10M30 34V24"/>`,
  plant: `<path class="f2" d="M18 40h28l-4 18H22z"/><path d="M18 40h28l-4 18H22zM32 40V22"/><path class="f1" d="M32 26c-10 0-16-6-16-14 10 0 16 6 16 14zM32 22c0-10 6-16 16-16 0 10-6 16-16 16z"/><path d="M32 26c-10 0-16-6-16-14 10 0 16 6 16 14zM32 22c0-10 6-16 16-16 0 10-6 16-16 16z"/>`,
  flower: `<g class="f1"><circle cx="32" cy="16" r="8"/><circle cx="44" cy="26" r="8"/><circle cx="40" cy="40" r="8"/><circle cx="24" cy="40" r="8"/><circle cx="20" cy="26" r="8"/></g><circle class="f2" cx="32" cy="30" r="7"/><circle cx="32" cy="30" r="7"/><path d="M32 46v14M32 54c-6 0-10-4-10-8M32 54c6 0 10-4 10-8"/>`,
  honey: `<path class="f1" d="M12 20h40v30a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z"/><path d="M12 20h40v30a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6zM14 12h36v8H14z"/><path class="f2" d="M24 32l8-5 8 5v9l-8 5-8-5z"/><path d="M24 32l8-5 8 5v9l-8 5-8-5z"/>`,
  egg: `<ellipse class="f2" cx="22" cy="36" rx="12" ry="16"/><ellipse cx="22" cy="36" rx="12" ry="16"/><ellipse class="f1" cx="42" cy="38" rx="12" ry="15"/><ellipse cx="42" cy="38" rx="12" ry="15"/><path d="M6 56h52"/>`,
  shirt: `<path class="f1" d="M22 8l-14 8 6 12 6-3v31h24V25l6 3 6-12-14-8c-2 5-6 7-10 7s-8-2-10-7z"/><path d="M22 8l-14 8 6 12 6-3v31h24V25l6 3 6-12-14-8c-2 5-6 7-10 7s-8-2-10-7z"/><circle class="f2" cx="32" cy="34" r="6"/>`,
  dress: `<path class="f1" d="M24 6h16l-2 14 14 36H12l14-36z"/><path d="M24 6h16l-2 14 14 36H12l14-36zM26 20h12"/><path class="f2" d="M20 40h24l3 8H17z"/>`,
  hijab: `<path class="f1" d="M32 6c-14 0-20 12-20 24 0 10 4 18 6 26h28c2-8 6-16 6-26 0-12-6-24-20-24z"/><path d="M32 6c-14 0-20 12-20 24 0 10 4 18 6 26h28c2-8 6-16 6-26 0-12-6-24-20-24z"/><ellipse class="f2" cx="32" cy="28" rx="10" ry="12"/><ellipse cx="32" cy="28" rx="10" ry="12"/>`,
  shoe: `<path class="f1" d="M6 44V24h14c4 8 14 10 22 10 10 0 16 4 16 10v6H6z"/><path d="M6 44V24h14c4 8 14 10 22 10 10 0 16 4 16 10v6H6zM6 44h52M24 30l-4 6M30 32l-3 6M36 33l-2 6"/>`,
  bag: `<path class="f1" d="M10 22h44l-4 34H14z"/><path d="M10 22h44l-4 34H14zM22 22v-4a10 10 0 0 1 20 0v4"/><path class="f2" d="M14 34h36l-1 8H15z"/>`,
  ring: `<circle cx="32" cy="40" r="16"/><circle class="f2" cx="32" cy="40" r="12"/><circle cx="32" cy="40" r="12"/><path class="f1" d="M24 18l4-8h8l4 8-8 8z"/><path d="M24 18l4-8h8l4 8-8 8zM24 18h16"/>`,
  batik: `<rect class="f1" x="8" y="8" width="48" height="48" rx="4"/><rect x="8" y="8" width="48" height="48" rx="4"/><g class="f2"><circle cx="20" cy="20" r="6"/><circle cx="44" cy="20" r="6"/><circle cx="20" cy="44" r="6"/><circle cx="44" cy="44" r="6"/></g><path d="M32 14v36M14 32h36M26 26l12 12M38 26 26 38"/>`,
  needle: `<path d="M50 6 14 58"/><ellipse cx="48" cy="9" rx="2" ry="4" transform="rotate(35 48 9)"/><path class="f1" d="M8 20c10-10 26 0 18 10s4 22 22 18" fill="none"/><path d="M8 20c10-10 26 0 18 10s4 22 22 18"/><circle class="f2" cx="14" cy="48" r="8"/><circle cx="14" cy="48" r="8"/>`,
  scissors: `<circle class="f2" cx="16" cy="48" r="8"/><circle class="f2" cx="40" cy="52" r="8"/><circle cx="16" cy="48" r="8"/><circle cx="40" cy="52" r="8"/><path class="f1" d="M22 42 50 8l2 4-26 34zM36 45 30 8l-4 2 4 36z"/><path d="M22 42 50 8M36 45 28 8"/>`,
  comb: `<rect class="f1" x="8" y="14" width="48" height="12" rx="3"/><rect x="8" y="14" width="48" height="12" rx="3"/><path d="M12 26v24M18 26v24M24 26v24M30 26v24M36 26v24M42 26v24M48 26v24M54 26v18"/>`,
  drop: `<path class="f1" d="M32 6C24 20 14 30 14 40a18 18 0 0 0 36 0C50 30 40 20 32 6z"/><path d="M32 6C24 20 14 30 14 40a18 18 0 0 0 36 0C50 30 40 20 32 6z"/><path class="f2" d="M24 40a8 8 0 0 0 8 8"/><path d="M24 40a8 8 0 0 0 8 8"/>`,
  soap: `<rect class="f1" x="8" y="28" width="40" height="22" rx="8"/><rect x="8" y="28" width="40" height="22" rx="8"/><circle class="f2" cx="48" cy="18" r="8"/><circle cx="48" cy="18" r="8"/><circle cx="34" cy="14" r="4"/><circle cx="56" cy="34" r="3"/><path d="M16 38h16"/>`,
  spray: `<rect class="f1" x="18" y="24" width="24" height="32" rx="5"/><rect x="18" y="24" width="24" height="32" rx="5"/><path d="M24 24v-8h12v8M30 16V10h10M46 8l6-2M46 12h7M46 16l6 2"/><rect class="f2" x="22" y="34" width="16" height="12" rx="2"/>`,
  wrench: `<path class="f1" d="M44 6a14 14 0 0 0-12 20L8 50l6 6 24-24a14 14 0 0 0 20-12l-8 4-6-6z"/><path d="M44 6a14 14 0 0 0-12 20L8 50l6 6 24-24a14 14 0 0 0 20-12l-8 4-6-6z"/>`,
  tire: `<circle class="f1" cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="24"/><circle class="f2" cx="32" cy="32" r="12"/><circle cx="32" cy="32" r="12"/><circle cx="32" cy="32" r="3"/><path d="M32 8v6M32 50v6M8 32h6M50 32h6M15 15l4 4M45 45l4 4M49 15l-4 4M15 49l4-4"/>`,
  car: `<path class="f1" d="M6 40l4-14c1-4 4-6 8-6h28c4 0 7 2 8 6l4 14v8H6z"/><path d="M6 40l4-14c1-4 4-6 8-6h28c4 0 7 2 8 6l4 14v8H6zM14 28h36l2 10H12z"/><circle class="f2" cx="18" cy="48" r="6"/><circle class="f2" cx="46" cy="48" r="6"/><circle cx="18" cy="48" r="6"/><circle cx="46" cy="48" r="6"/>`,
  motor: `<circle class="f2" cx="14" cy="44" r="10"/><circle class="f2" cx="50" cy="44" r="10"/><circle cx="14" cy="44" r="10"/><circle cx="50" cy="44" r="10"/><path class="f1" d="M20 34h18l6-8h-8l-4-6h-8z"/><path d="M14 44l10-12h16l10 12M40 26l4-10h6M20 34h18l6-8"/>`,
  bike: `<circle cx="14" cy="42" r="11"/><circle cx="50" cy="42" r="11"/><path class="f1" d="M14 42l12-18h18l6 18M26 24l8 18 10-18" fill="none"/><path d="M14 42l12-18h18l6 18M26 24l8 18 10-18M22 18h8M44 24l-2-8h6"/><circle class="f2" cx="34" cy="42" r="3"/>`,
  truck: `<rect class="f1" x="4" y="16" width="34" height="28" rx="2"/><path d="M4 16h34v28H4zM38 26h12l8 10v8H38z"/><circle class="f2" cx="16" cy="48" r="6"/><circle class="f2" cx="48" cy="48" r="6"/><circle cx="16" cy="48" r="6"/><circle cx="48" cy="48" r="6"/>`,
  house: `<path class="f1" d="M8 30 32 10l24 20v26H8z"/><path d="M8 30 32 10l24 20v26H8zM4 32 32 8l28 24"/><rect class="f2" x="26" y="38" width="12" height="18"/><rect x="26" y="38" width="12" height="18"/><rect x="14" y="34" width="8" height="8"/><rect x="42" y="34" width="8" height="8"/>`,
  shop: `<path class="f1" d="M6 22h52l-4-12H10z"/><path d="M6 22h52l-4-12H10zM6 22c0 6 9 6 9 0 0 6 9 6 9 0 0 6 8 6 8 0 0 6 9 6 9 0 0 6 8 6 8 0 0 6 9 6 9 0M10 28v28h44V28"/><rect class="f2" x="16" y="36" width="14" height="20"/><rect x="16" y="36" width="14" height="20"/><rect x="36" y="36" width="12" height="10"/>`,
  bed: `<rect class="f1" x="6" y="30" width="52" height="16" rx="3"/><path d="M6 30h52v16H6zM6 20v36M58 30v26M6 46h52"/><rect class="f2" x="10" y="22" width="16" height="8" rx="3"/><rect x="10" y="22" width="16" height="8" rx="3"/>`,
  key: `<circle class="f1" cx="20" cy="24" r="12"/><circle cx="20" cy="24" r="12"/><circle cx="20" cy="24" r="4"/><path d="M28 32 54 58M44 48l6-6M50 54l4-4"/>`,
  book: `<path class="f1" d="M8 12c8-2 16-2 24 4v38c-8-6-16-6-24-4z"/><path class="f2" d="M56 12c-8-2-16-2-24 4v38c8-6 16-6 24-4z"/><path d="M8 12c8-2 16-2 24 4v38c-8-6-16-6-24-4zM56 12c-8-2-16-2-24 4v38c8-6 16-6 24-4z"/>`,
  camera: `<path class="f1" d="M6 20h12l4-6h20l4 6h12v32H6z"/><path d="M6 20h12l4-6h20l4 6h12v32H6z"/><circle class="f2" cx="32" cy="35" r="11"/><circle cx="32" cy="35" r="11"/><circle cx="32" cy="35" r="5"/><path d="M48 26h4"/>`,
  printer: `<rect class="f1" x="6" y="22" width="52" height="22" rx="4"/><rect x="6" y="22" width="52" height="22" rx="4"/><path d="M16 22V8h32v14"/><rect class="f2" x="16" y="36" width="32" height="20"/><rect x="16" y="36" width="32" height="20"/><path d="M22 44h20M22 50h14M48 30h4"/>`,
  phone: `<rect class="f1" x="16" y="4" width="32" height="56" rx="6"/><rect x="16" y="4" width="32" height="56" rx="6"/><rect class="f2" x="20" y="12" width="24" height="38" rx="2"/><path d="M28 8h8M30 55h4"/>`,
  laptop: `<rect class="f1" x="12" y="12" width="40" height="28" rx="3"/><rect x="12" y="12" width="40" height="28" rx="3"/><rect class="f2" x="16" y="16" width="32" height="20"/><path d="M4 46h56l-4 6H8zM12 40h40"/>`,
  ac: `<rect class="f1" x="6" y="12" width="52" height="22" rx="4"/><rect x="6" y="12" width="52" height="22" rx="4"/><path d="M12 28h40M18 42c0 4-4 4-4 8M32 42c0 4-4 4-4 8M46 42c0 4-4 4-4 8"/><circle class="f2" cx="50" cy="20" r="2"/>`,
  washer: `<rect class="f1" x="10" y="6" width="44" height="52" rx="4"/><rect x="10" y="6" width="44" height="52" rx="4"/><path d="M10 18h44"/><circle class="f2" cx="32" cy="38" r="13"/><circle cx="32" cy="38" r="13"/><path d="M24 40c4-4 12 2 16-2"/><circle cx="18" cy="12" r="2"/><circle cx="26" cy="12" r="2"/>`,
  bucket: `<path class="f1" d="M12 22h40l-5 34H17z"/><path d="M12 22h40l-5 34H17zM12 22c0-10 40-10 40 0"/><path class="f2" d="M24 10c4 4 4 8 0 10 6-2 10-6 8-12"/><path d="M40 30c4 8-2 14-6 14"/>`,
  water: `<rect class="f1" x="16" y="18" width="32" height="40" rx="8"/><rect x="16" y="18" width="32" height="40" rx="8"/><path d="M26 18v-6h12v6M24 4h16v8H24zM16 32h32M16 44h32"/><path class="f2" d="M32 36c-3 4-4 5-4 7a4 4 0 0 0 8 0c0-2-1-3-4-7z"/>`,
  gas: `<rect class="f1" x="14" y="16" width="36" height="42" rx="14"/><rect x="14" y="16" width="36" height="42" rx="14"/><path d="M26 16v-8h12v8M22 8h20"/><rect class="f2" x="20" y="30" width="24" height="12" rx="3"/>`,
  paw: `<ellipse class="f1" cx="32" cy="42" rx="12" ry="10"/><ellipse cx="32" cy="42" rx="12" ry="10"/><g class="f2"><ellipse cx="14" cy="28" rx="5" ry="7"/><ellipse cx="24" cy="16" rx="5" ry="7"/><ellipse cx="40" cy="16" rx="5" ry="7"/><ellipse cx="50" cy="28" rx="5" ry="7"/></g><ellipse cx="14" cy="28" rx="5" ry="7"/><ellipse cx="24" cy="16" rx="5" ry="7"/><ellipse cx="40" cy="16" rx="5" ry="7"/><ellipse cx="50" cy="28" rx="5" ry="7"/>`,
  basket: `<path class="f1" d="M6 28h52l-6 28H12z"/><path d="M6 28h52l-6 28H12zM18 28l8-18M46 28l-8-18M10 38h44M12 48h40M22 28v28M32 28v28M42 28v28"/>`,
  gift: `<rect class="f1" x="8" y="26" width="48" height="30" rx="2"/><rect x="8" y="26" width="48" height="30" rx="2"/><rect class="f2" x="6" y="18" width="52" height="10" rx="2"/><path d="M6 18h52v10H6zM32 18v38M32 18c-6-12-18-10-14-2 2 2 8 2 14 2zM32 18c6-12 18-10 14-2-2 2-8 2-14 2z"/>`,
  music: `<path class="f1" d="M22 46V14l30-6v32"/><path d="M22 46V14l30-6v32M22 22l30-6"/><ellipse class="f2" cx="16" cy="46" rx="7" ry="6"/><ellipse class="f2" cx="46" cy="40" rx="7" ry="6"/><ellipse cx="16" cy="46" rx="7" ry="6"/><ellipse cx="46" cy="40" rx="7" ry="6"/>`,
  pen: `<path class="f1" d="M44 6l14 14-30 30-16 4 4-16z"/><path d="M44 6l14 14-30 30-16 4 4-16zM38 12l14 14M16 40l8 8"/><path d="M6 58h20"/>`,
  candle: `<rect class="f1" x="20" y="24" width="24" height="32" rx="2"/><rect x="20" y="24" width="24" height="32" rx="2"/><path d="M32 24v-6M14 56h36"/><path class="f2" d="M32 4c5 6 5 10 0 12-5-2-5-6 0-12z"/><path d="M32 4c5 6 5 10 0 12-5-2-5-6 0-12z"/>`,
  vase: `<path class="f1" d="M24 6h16v6c0 4 12 10 12 24 0 12-8 20-20 20S12 48 12 36c0-14 12-20 12-24z"/><path d="M24 6h16v6c0 4 12 10 12 24 0 12-8 20-20 20S12 48 12 36c0-14 12-20 12-24z"/><path class="f2" d="M14 34h36v6H14z"/>`,
  chair: `<path class="f1" d="M18 8h28v24H18z"/><path d="M18 8h28v24H18zM14 32h36v8H14zM18 40v18M46 40v18M22 14h20M22 20h20M22 26h20"/>`,
  star: `<path class="f1" d="M32 6l7 16 18 2-13 12 4 18-16-9-16 9 4-18L7 24l18-2z"/><path d="M32 6l7 16 18 2-13 12 4 18-16-9-16 9 4-18L7 24l18-2z"/>`,
  tea: `<path class="f1" d="M12 28h34v8a14 14 0 0 1-14 14h-6a14 14 0 0 1-14-14z"/><path d="M12 28h34v8a14 14 0 0 1-14 14h-6a14 14 0 0 1-14-14zM46 30l8-6M26 20c4-4 8-4 6-12M8 56h42"/><path class="f2" d="M30 22c2-6 8-8 12-6-2 6-8 8-12 6z"/>`,
  icecream: `<path class="f2" d="M20 30h24L32 60z"/><path d="M20 30h24L32 60zM24 38l12 8M28 48l6 4M40 38l-14 10"/><circle class="f1" cx="32" cy="20" r="13"/><circle cx="32" cy="20" r="13"/>`,
  tent: `<path class="f1" d="M4 54 32 10l28 44z"/><path d="M4 54 32 10l28 44zM32 10v44M24 54l8-14 8 14"/>`,
  bus: `<rect class="f1" x="6" y="12" width="52" height="34" rx="6"/><rect x="6" y="12" width="52" height="34" rx="6"/><path d="M6 30h52M18 12v18M32 12v18M46 12v18"/><circle class="f2" cx="18" cy="48" r="5"/><circle class="f2" cx="46" cy="48" r="5"/><circle cx="18" cy="48" r="5"/><circle cx="46" cy="48" r="5"/>`,
  sprout: `<path d="M32 58V30"/><path class="f1" d="M32 34C32 22 22 14 10 14c0 12 10 20 22 20z"/><path class="f2" d="M32 28c0-10 8-18 20-18 0 10-8 18-20 18z"/><path d="M32 34C32 22 22 14 10 14c0 12 10 20 22 20zM32 28c0-10 8-18 20-18 0 10-8 18-20 18zM14 58h36"/>`,
  hammer: `<path class="f1" d="M14 10h22l6 6v8H14z"/><path d="M14 10h22l6 6v8H14zM28 24v32M24 56h8"/><path class="f2" d="M42 14l10-4 2 6-10 4"/>`,
  bolt: `<path class="f1" d="M36 4 12 36h18l-4 24 24-34H32z"/><path d="M36 4 12 36h18l-4 24 24-34H32z"/>`,
  sparkle: `<path class="f1" d="M32 4l6 20 20 8-20 8-6 20-6-20-20-8 20-8z"/><path d="M32 4l6 20 20 8-20 8-6 20-6-20-20-8 20-8z"/>`,
  box: `<path class="f1" d="M8 20 32 8l24 12v26L32 58 8 46z"/><path d="M8 20 32 8l24 12v26L32 58 8 46zM8 20l24 12 24-12M32 32v26"/><path class="f2" d="M20 14l24 12v8l-6 3v-8L14 17z"/>`,
  broom: `<path d="M50 6 30 34"/><path class="f1" d="M24 30l12 8-6 20-20-4z"/><path d="M24 30l12 8-6 20-20-4zM16 54l8-14M22 56l6-12"/>`,
  bento: `<rect class="f1" x="6" y="14" width="52" height="40" rx="4"/><rect x="6" y="14" width="52" height="40" rx="4"/><path d="M30 14v40M30 34h28"/><circle class="f2" cx="18" cy="34" r="8"/><rect class="f2" x="36" y="20" width="16" height="8" rx="2"/><path d="M38 42c4-4 8 4 12 0"/>`,
};

export type IconName = keyof typeof ICONS;

/** <svg> ikon: kelas .ico mewarnai garis (currentColor) dan isian .f1/.f2. */
export const icon = (name: string, cls = "ico", label?: string) =>
  `<svg class="${cls}" viewBox="0 0 64 64" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${ICONS[name] ?? ICONS.star}</svg>`;

/** CSS dasar ikon (dipakai semua skin). */
export const ICON_CSS = `
.ico { width: 1em; height: 1em; fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; overflow: visible; }
.ico .f1 { fill: var(--accent); }
.ico .f2 { fill: var(--accent-2); }
`;
