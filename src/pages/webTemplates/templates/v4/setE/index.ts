import type { TemplateContent } from "../../../types";
import { coworkingHubKreatif, coworkingRuangTemu, dentalOrtho, dentalSenyumSehat, furnitureKayuJati } from "./e1";
import { furnitureMinimalis, languageKursusBahasa, languageLesPrivat, maritimeDivingTrip, maritimePelayaran } from "./e2";
import { agricultureHidroponik, craftAnyaman, craftKeramik, financeInvestasi, saasAnalitikData } from "./e3";
import { educationBimbelOnline, energyAngin, logisticsGudang, nonprofitLaporanDampak, startupPitch } from "./e4";

/** Konten template katalog v4 (bagian E), dikunci dengan ID di ../catalogE.ts. */
export const V4E_TEMPLATES: Record<string, TemplateContent> = {
  "coworking-ruang-temu": coworkingRuangTemu,
  "coworking-hub-kreatif": coworkingHubKreatif,
  "dental-senyum-sehat": dentalSenyumSehat,
  "dental-ortho": dentalOrtho,
  "furniture-kayu-jati": furnitureKayuJati,
  "furniture-minimalis": furnitureMinimalis,
  "language-kursus-bahasa": languageKursusBahasa,
  "language-les-privat": languageLesPrivat,
  "maritime-diving-trip": maritimeDivingTrip,
  "maritime-pelayaran": maritimePelayaran,
  "craft-anyaman": craftAnyaman,
  "craft-keramik": craftKeramik,
  "saas-analitik-data": saasAnalitikData,
  "finance-investasi": financeInvestasi,
  "agriculture-hidroponik": agricultureHidroponik,
  "nonprofit-laporan-dampak": nonprofitLaporanDampak,
  "energy-angin": energyAngin,
  "startup-pitch-deck": startupPitch,
  "education-bimbel-online": educationBimbelOnline,
  "logistics-gudang": logisticsGudang,
};
