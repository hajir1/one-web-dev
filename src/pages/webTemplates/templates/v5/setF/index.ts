import type { TemplateContent } from "../../../types";
import { cateringDapurRasa, hotelTerasSenja, rentalLintas, yogaHening } from "./f1";
import { barberCukurJenggala, eventRiangPesta, taxTaksa } from "./f2";
import { agroPetikKebun, appDompetku, museumLiniMasa } from "./f3";

/** Catalog v5 template content (part F), keyed by the IDs in ../catalogF.ts. */
export const V5F_TEMPLATES: Record<string, TemplateContent> = {
  "catering-dapur-rasa": cateringDapurRasa,
  "hotel-teras-senja": hotelTerasSenja,
  "rental-lintas": rentalLintas,
  "yoga-hening": yogaHening,
  "tax-taksa": taxTaksa,
  "event-riang-pesta": eventRiangPesta,
  "barber-cukur-jenggala": barberCukurJenggala,
  "museum-lini-masa": museumLiniMasa,
  "app-dompetku": appDompetku,
  "agro-petik-kebun": agroPetikKebun,
};
