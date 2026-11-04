import type { TemplateContent } from "../../types";
import { blogJournal, portfolioMinimal, saasLaunch, startupPitch } from "./setA";
import { educationKelas, personalBrand, realestateHunian, restaurantSaji } from "./setB";
import { eventSummit, healthKlinik, photographyLensa, techDevhub } from "./setC";
import { communityKita, creativeStudio, professionalLexa, travelJelajah } from "./setD";

/** Content of the 16 Pro templates, keyed by catalog ID (config/templates.ts). */
export const PRO_TEMPLATES: Record<string, TemplateContent> = {
  "portfolio-minimal": portfolioMinimal,
  "blog-journal": blogJournal,
  "saas-launch": saasLaunch,
  "startup-pitch": startupPitch,
  "personal-brand": personalBrand,
  "restaurant-saji": restaurantSaji,
  "realestate-hunian": realestateHunian,
  "education-kelas": educationKelas,
  "event-summit": eventSummit,
  "photography-lensa": photographyLensa,
  "tech-devhub": techDevhub,
  "health-klinik": healthKlinik,
  "travel-jelajah": travelJelajah,
  "professional-lexa": professionalLexa,
  "creative-studio": creativeStudio,
  "community-kita": communityKita,
};
