import { BG_DEFAULTS } from "./helpers/background";
import type { AnyElementDefinition, ElementGroup } from "./helpers/elementDefinition";
import { buttonElement } from "./elements/basic/Button";
import { textElement } from "./elements/basic/Text";
import { anchorElement } from "./elements/basic/Anchor";
import { alertElement } from "./elements/basic/Alert";
import { badgeElement } from "./elements/basic/Badge";
import { iconElement } from "./elements/basic/Icon";
import { imageElement } from "./elements/basic/Image";
import { inputElement } from "./elements/forms/Input";
import { selectElement } from "./elements/forms/Select";
import { checkboxElement } from "./elements/forms/Checkbox";
import { switchElement } from "./elements/forms/Switch";
import { cardElement } from "./elements/data/Card";
import { productCardElement } from "./elements/data/ProductCard";
import { listElement } from "./elements/data/List";
import { tableElement } from "./elements/data/Table";
import { accordionElement } from "./elements/data/Accordion";
import { breadcrumbsElement } from "./elements/navigation/Breadcrumbs";
import { tabsElement } from "./elements/navigation/Tabs";
import { codeElement } from "./elements/basic/Code";
import { menuElement } from "./elements/navigation/Menu";
import { sliderElement } from "./elements/premium/Slider";
import { countdownElement } from "./elements/premium/Countdown";
import { chartElement } from "./elements/data/Chart";
import { pricingElement, progressElement, testimonialElement } from "./elements/premium/StaticTemplates";
import { bannerElement, clipboardElement, datePickerElement, ratingElement, spinnerElement, tooltipElement, videoElement } from "./elements/extra/BasicExtras";
import { comparisonTableElement, megaMenuElement, pricingSwitchElement, statsCounterElement, typewriterElement } from "./elements/extra/PremiumExtras";
import { dividerElement, radioGroupElement, socialLinksElement, textareaElement, timelineElement } from "./elements/extra/MoreExtras";
import { backToTopElement, beforeAfterElement, galleryLightboxElement, logoMarqueeElement, modalPopupElement } from "./elements/extra/MorePremium";
import { avatarElement, blockquoteElement, fileUploadElement, floatingInputElement, mapEmbedElement, numberStepperElement, paginationElement, searchBarElement, segmentedElement, skeletonElement, stepsElement } from "./elements/extra/NewFree";
import { THREE_D_ELEMENTS } from "./elements/three/ThreeElements";
import { cookieConsentElement, dropdownElement, formWizardElement, imageHotspotElement, offcanvasElement, otpInputElement, popoverElement, toastElement } from "./elements/extra/NewPremium";

/**
 * Every BUILT-IN Page Maker element (spec + styling panel + default state).
 * New element: create its definition file in `elements/<group>/`, export
 * `xxxElement`, then add it to this list.
 */
const BASE_DEFINITIONS: AnyElementDefinition[] = [
  buttonElement,
  textElement,
  anchorElement,
  alertElement,
  badgeElement,
  iconElement,
  imageElement,
  inputElement,
  selectElement,
  checkboxElement,
  switchElement,
  cardElement,
  productCardElement,
  listElement,
  tableElement,
  chartElement,
  accordionElement,
  breadcrumbsElement,
  tabsElement,
  codeElement,
  menuElement,
  // Extra (free)
  bannerElement,
  videoElement,
  spinnerElement,
  tooltipElement,
  datePickerElement,
  ratingElement,
  clipboardElement,
  dividerElement,
  textareaElement,
  radioGroupElement,
  socialLinksElement,
  timelineElement,
  // Extra v3 (free)
  floatingInputElement,
  searchBarElement,
  numberStepperElement,
  fileUploadElement,
  segmentedElement,
  avatarElement,
  blockquoteElement,
  skeletonElement,
  paginationElement,
  stepsElement,
  mapEmbedElement,
  // Premium (needs credits)
  sliderElement,
  countdownElement,
  progressElement,
  testimonialElement,
  pricingElement,
  statsCounterElement,
  pricingSwitchElement,
  megaMenuElement,
  comparisonTableElement,
  typewriterElement,
  galleryLightboxElement,
  logoMarqueeElement,
  modalPopupElement,
  beforeAfterElement,
  backToTopElement,
  // Premium v3 (tingkat lanjut)
  popoverElement,
  toastElement,
  offcanvasElement,
  dropdownElement,
  otpInputElement,
  cookieConsentElement,
  imageHotspotElement,
  formWizardElement,
  // 3D v9 (Premium, Three.js loads when used)
  ...THREE_D_ELEMENTS,
];

/**
 * Elements with a `bgType` automatically get the full background fields
 * (radial/center gradient, image, overlay) in their default state, so the
 * background editor & design storage recognize those fields.
 */
/** v7: elements without text (images, icons, dividers, …); they get no font settings. */
const NO_TEXT_TYPES = new Set(["icon", "image", "video", "spinner", "divider", "skeleton", "map-embed", "before-after", "back-to-top", "chart", "code", "three-product", "three-shape", "three-globe", "three-particles"]);

/** v7: elements whose CSS generator already writes its own `font-family`. */
export const NATIVE_FONT_TYPES = new Set(
  BASE_DEFINITIONS.filter((d) => d.defaults && typeof d.defaults === "object" && "fontFamily" in d.defaults).map((d) => d.type),
);

/**
 * v7: text elements whose font is written by compose in general (a
 * `font-family` rule on the element's outer class + form controls inherit). The
 * `fontFamily` field is added to their defaults so it is stored in the state.
 */
export const GENERIC_FONT_TYPES = new Set(
  BASE_DEFINITIONS.filter((d) => !NO_TEXT_TYPES.has(d.type) && !NATIVE_FONT_TYPES.has(d.type)).map((d) => d.type),
);

export const supportsFont = (type: string) => NATIVE_FONT_TYPES.has(type) || GENERIC_FONT_TYPES.has(type);

export const ELEMENT_DEFINITIONS: AnyElementDefinition[] = BASE_DEFINITIONS.map((d) => {
  let defaults = d.defaults;
  if (defaults && typeof defaults === "object" && "bgType" in defaults) defaults = { ...BG_DEFAULTS, ...defaults };
  if (GENERIC_FONT_TYPES.has(d.type) && defaults && typeof defaults === "object") defaults = { ...defaults, fontFamily: "" };
  return defaults === d.defaults ? d : { ...d, defaults };
});

export const ELEMENT_GROUP_ORDER: ElementGroup[] = ["Elemen", "Form", "Data", "Navigasi", "3D", "Premium"];

export const ELEMENT_DEFINITION_BY_TYPE: Record<string, AnyElementDefinition> =
  Object.fromEntries(ELEMENT_DEFINITIONS.map((d) => [d.type, d]));
