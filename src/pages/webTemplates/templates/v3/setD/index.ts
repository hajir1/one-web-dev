import type { TemplateContent } from "../../../types";
import { blogCatatanKuliner, governmentDesaDigital, governmentDinasPariwisata, insuranceAuto, insuranceLindungi } from "./d1";
import { filmFestival, filmProduksi, jewelryEmas, jewelryHandmade, recruitmentTalenta } from "./d2";
import { bookstorePenerbit, bookstorePustaka, energyEvCharging, energySurya, recruitmentJobBoard } from "./d3";
import { laundryKiloanExpress, printingMerch, saasHrAbsensi, scienceLabRiset, scienceMuseum } from "./d4";
import { agencySeo, financeKoperasi, musicDj, nonprofitLingkungan, realestateApartemen } from "./d5";

/** Konten template katalog v3 (bagian D), dikunci dengan ID di ../catalogD.ts. */
export const V3D_TEMPLATES: Record<string, TemplateContent> = {
  "blog-catatan-kuliner": blogCatatanKuliner,
  "government-desa-digital": governmentDesaDigital,
  "government-dinas-pariwisata": governmentDinasPariwisata,
  "insurance-lindungi": insuranceLindungi,
  "insurance-auto": insuranceAuto,
  "film-produksi": filmProduksi,
  "film-festival": filmFestival,
  "jewelry-emas": jewelryEmas,
  "jewelry-handmade": jewelryHandmade,
  "recruitment-talenta": recruitmentTalenta,
  "recruitment-job-board": recruitmentJobBoard,
  "bookstore-pustaka": bookstorePustaka,
  "bookstore-penerbit": bookstorePenerbit,
  "energy-surya": energySurya,
  "energy-ev-charging": energyEvCharging,
  "science-lab-riset": scienceLabRiset,
  "science-museum": scienceMuseum,
  "printing-merch": printingMerch,
  "laundry-kiloan-express": laundryKiloanExpress,
  "saas-hr-absensi": saasHrAbsensi,
  "finance-koperasi": financeKoperasi,
  "realestate-apartemen": realestateApartemen,
  "music-dj": musicDj,
  "nonprofit-lingkungan": nonprofitLingkungan,
  "agency-seo": agencySeo,
};
