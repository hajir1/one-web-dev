import type { TemplateContent } from "../../../types";
import { bakeryRotiHangat, sportsFutsalArena, sportsRunclub, worshipGerejaKasih, worshipMasjidAnnur } from "./c1";
import { bakeryPatisserie, fashionBatikNusantara, fashionStreetwear, podcastRuangDengar, podcastStudioSuara } from "./c2";
import { floristKembang, floristWeddingBloom, laundryBersih, printingCetakKilat, shopGadget } from "./c3";
import { educationTahfidz, healthPsikolog, portfolioIllustrator, restaurantRamen, technologyAiLab } from "./c4";
import { companyKonsultanPajak, creativeTattoo, hospitalityCapsuleHotel, startupEdtech, travelDiving } from "./c5";

/** Catalog v3 template content (part C), keyed by the IDs in ../catalogC.ts. */
export const V3C_TEMPLATES: Record<string, TemplateContent> = {
  "bakery-roti-hangat": bakeryRotiHangat,
  "sports-futsal-arena": sportsFutsalArena,
  "sports-runclub": sportsRunclub,
  "worship-masjid-annur": worshipMasjidAnnur,
  "worship-gereja-kasih": worshipGerejaKasih,
  "bakery-patisserie": bakeryPatisserie,
  "podcast-ruang-dengar": podcastRuangDengar,
  "podcast-studio-suara": podcastStudioSuara,
  "fashion-streetwear": fashionStreetwear,
  "fashion-batik-nusantara": fashionBatikNusantara,
  "printing-cetak-kilat": printingCetakKilat,
  "laundry-bersih": laundryBersih,
  "florist-kembang": floristKembang,
  "florist-wedding-bloom": floristWeddingBloom,
  "shop-gadget": shopGadget,
  "portfolio-illustrator": portfolioIllustrator,
  "restaurant-ramen": restaurantRamen,
  "health-psikolog": healthPsikolog,
  "education-tahfidz": educationTahfidz,
  "technology-ai-lab": technologyAiLab,
  "travel-diving": travelDiving,
  "creative-tattoo": creativeTattoo,
  "hospitality-capsule-hotel": hospitalityCapsuleHotel,
  "startup-edtech": startupEdtech,
  "company-konsultan-pajak": companyKonsultanPajak,
};
