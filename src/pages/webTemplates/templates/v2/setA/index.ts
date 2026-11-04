import type { TemplateContent } from "../../../types";
import { automotiveBengkel, beautySalonAyu, cafeKopiSenja, financeDana, fitnessGymPulse } from "./t1";
import { constructionBangun, hotelResortPantai, musicBandNada, nonprofitPeduli, weddingJanji } from "./t2";
import { agriTani, gamingArena, kidsPreschool, logisticsKirim, petsVetSahabat } from "./t3";
import { architectureRuang, educationUniversity, newsWarta, saasCrmRelasi, shopSkincare } from "./t4";
import { agencyMarketing, companyManufaktur, eventMusicFest, healthDental, travelUmrah } from "./t5";

/** Catalog v2 template content (part A), keyed by the IDs in ../catalogA.ts. */
export const V2A_TEMPLATES: Record<string, TemplateContent> = {
  "cafe-kopi-senja": cafeKopiSenja,
  "fitness-gym-pulse": fitnessGymPulse,
  "beauty-salon-ayu": beautySalonAyu,
  "automotive-bengkel": automotiveBengkel,
  "finance-dana": financeDana,
  "nonprofit-peduli": nonprofitPeduli,
  "wedding-janji": weddingJanji,
  "music-band-nada": musicBandNada,
  "construction-bangun": constructionBangun,
  "hotel-resort-pantai": hotelResortPantai,
  "kids-preschool": kidsPreschool,
  "pets-vet-sahabat": petsVetSahabat,
  "agri-tani": agriTani,
  "logistics-kirim": logisticsKirim,
  "gaming-arena": gamingArena,
  "architecture-ruang": architectureRuang,
  "news-warta": newsWarta,
  "saas-crm-relasi": saasCrmRelasi,
  "shop-skincare": shopSkincare,
  "education-university": educationUniversity,
  "health-dental": healthDental,
  "travel-umrah": travelUmrah,
  "event-music-fest": eventMusicFest,
  "agency-marketing": agencyMarketing,
  "company-manufaktur": companyManufaktur,
};
