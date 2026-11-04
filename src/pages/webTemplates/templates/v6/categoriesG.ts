/** New categories introduced by set G (labels [id, en] are written to the locales by genTemplatesG). */
export const NEW_CATEGORIES_G = {
  pharmacy: ["Apotek", "Pharmacy"],
  carwash: ["Cuci mobil", "Car wash"],
  tailor: ["Penjahit", "Tailor"],
  spa: ["Spa", "Spa"],
  tattoo: ["Studio tato", "Tattoo studio"],
  optician: ["Optik", "Optician"],
  cleaning: ["Jasa kebersihan", "Cleaning"],
  moving: ["Jasa pindahan", "Movers"],
  security: ["Jasa keamanan", "Security"],
  brewery: ["Minuman fermentasi", "Brewery"],
  library: ["Perpustakaan", "Library"],
  cooperative: ["Koperasi", "Cooperative"],
  notary: ["Notaris", "Notary"],
  driving: ["Kursus mengemudi", "Driving school"],
  repair: ["Jasa servis", "Repair service"],
  garden: ["Taman & lanskap", "Garden & landscape"],
} as const satisfies Record<string, readonly [string, string]>;
