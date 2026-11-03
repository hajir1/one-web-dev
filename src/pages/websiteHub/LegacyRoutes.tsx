import { lazy } from "react";
import { useSearchParams } from "react-router";
import { Navigate } from "../../components/app/LocaleLink";
import { WEBSITE_HUB_PATH, studioPath } from "../../config/menu";
import { useDesignStore, type SavedDesign } from "../pageMaker/core/store/designStore";
import { SITE_TYPE, normalizeSiteDoc } from "../pageMaker/helpers/site";
import { COMPOSITION_TYPE } from "../pageMaker/helpers/composer";

const PageMaker = lazy(() => import("../pageMaker/Page/PageMaker"));
const WebsiteManager = lazy(() => import("../pageMaker/Page/WebsiteManager"));

/* ================================================================== */
/* v20: alamat lama tetap bekerja setelah alur disederhanakan menjadi    */
/* Website Saya → Studio.                                               */
/*   /page-maker?design=X  → Studio website yang memuat halaman X        */
/*                           (desain lepas: editor satu halaman lama)    */
/*   /page-maker           → Website Saya                                */
/*   /website?site=X       → Studio website X (&step=deploy ikut)        */
/*   /website              → Website Saya (kecuali masih ada data        */
/*                           Page Composer lama yang perlu dikonversi)   */
/* ================================================================== */

const EMPTY: SavedDesign[] = [];

function siteOfPage(sites: SavedDesign[], designId: string): SavedDesign | null {
  return sites.find((s) => normalizeSiteDoc(s.state).pages.some((p) => p.designId === designId)) ?? null;
}

export function LegacyPageMakerRoute() {
  const [params] = useSearchParams();
  const sites = useDesignStore((s) => s.designs[SITE_TYPE]) ?? EMPTY;
  const id = params.get("design");
  if (!id) return <Navigate to={WEBSITE_HUB_PATH} replace />;
  const site = siteOfPage(sites, id);
  if (site) return <Navigate to={studioPath(site.id, id)} replace />;
  return <PageMaker />;
}

export function LegacyWebsiteRoute() {
  const [params] = useSearchParams();
  const sites = useDesignStore((s) => s.designs[SITE_TYPE]) ?? EMPTY;
  const legacy = useDesignStore((s) => s.designs[COMPOSITION_TYPE]) ?? EMPTY;
  const id = params.get("site");
  const site = id ? sites.find((s) => s.id === id) : null;
  if (site) return <Navigate to={`${studioPath(site.id)}${params.get("step") === "deploy" ? "?step=deploy" : ""}`} replace />;
  if (legacy.length > 0) return <WebsiteManager />;
  return <Navigate to={WEBSITE_HUB_PATH} replace />;
}
