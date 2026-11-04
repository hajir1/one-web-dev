import type { TemplateContent } from "../../../types";
import { automotiveDealer, beautyBarbershop, financeAccounting, fitnessYoga, personalResume } from "./b1";
import { constructionInterior, hospitalityVilla, musicSchool, nonprofitFoundationEdu, weddingOrganizer } from "./b2";
import { agriCoffeeFarm, gamingEsportsTeam, kidsToystore, logisticsCargo, petsShop } from "./b3";
import { architectureLandscape, educationLanguage, newsMagazine, shopFurniture, startupFintech } from "./b4";
import { communityCoworking, healthPharmacy, photographyWeddingFilm, professionalNotary, techCybersecurity } from "./b5";

/** Catalog v2 template content (part B), keyed by the IDs in ../catalogB.ts. */
export const V2B_TEMPLATES: Record<string, TemplateContent> = {
  "personal-resume": personalResume,
  "fitness-yoga": fitnessYoga,
  "beauty-barbershop": beautyBarbershop,
  "automotive-dealer": automotiveDealer,
  "finance-accounting": financeAccounting,
  "nonprofit-foundation-edu": nonprofitFoundationEdu,
  "wedding-organizer": weddingOrganizer,
  "music-school": musicSchool,
  "construction-interior": constructionInterior,
  "hospitality-villa": hospitalityVilla,
  "kids-toystore": kidsToystore,
  "pets-shop": petsShop,
  "agri-coffee-farm": agriCoffeeFarm,
  "logistics-cargo": logisticsCargo,
  "gaming-esports-team": gamingEsportsTeam,
  "architecture-landscape": architectureLandscape,
  "news-magazine": newsMagazine,
  "startup-fintech": startupFintech,
  "shop-furniture": shopFurniture,
  "education-language": educationLanguage,
  "health-pharmacy": healthPharmacy,
  "photography-wedding-film": photographyWeddingFilm,
  "tech-cybersecurity": techCybersecurity,
  "professional-notary": professionalNotary,
  "community-coworking": communityCoworking,
};
