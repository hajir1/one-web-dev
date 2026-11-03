import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { BookOpen, ChevronDown, Coins, Crown, History, LayoutDashboard, MoreHorizontal, Users } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { CREDITS_PATH, DOCS_PATH, PLANS_PATH, JOB_HISTORY_PATH, TEAM_PATH, isLeafActive, visibleMenuSections, type MenuLeaf } from "../config/menu";
import { isDemoMode } from "../demo/demoMode";
import { Link } from "../components/app/LocaleLink";
import BrandLogo from "../components/app/BrandLogo";
import { splitLangPath } from "../i18n";
import { prefetchRoute } from "../api/queries";
import { useSession } from "../auth/session";

/* Menu diambil dari config/menu.ts — sumber yang sama dengan kartu di Dashboard. */

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const path = splitLangPath(location.pathname).rest;
  const wide = isExpanded || isHovered || isMobileOpen;

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  // Prefetch data halaman tujuan saat kursor/fokus di menu (TanStack Query).
  const signedIn = useSession((s) => s.status === "authenticated");
  const prefetch = useCallback((to: string) => prefetchRoute(to, signedIn), [signedIn]);

  const leafActive = useCallback((leaf: MenuLeaf) => isLeafActive(leaf, path), [path]);
  // Mode demo (v12): tanpa alat server/Toko dan tanpa menu akun (kredit, paket, riwayat, tim).
  const demo = isDemoMode();
  const sections = visibleMenuSections();

  // Buka kelompok yang berisi halaman aktif.
  useEffect(() => {
    const sec = sections.find((s) => s.items.some(leafActive));
    setOpenSection(sec ? sec.id : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, leafActive]);

  useEffect(() => {
    if (openSection && refs.current[openSection]) {
      setHeights((h) => ({ ...h, [openSection]: refs.current[openSection]?.scrollHeight ?? 0 }));
    }
  }, [openSection, t]);

  const topLink = (to: string, label: string, Icon: typeof Coins, active: boolean, testId?: string) => (
    <Link
      to={to}
      onMouseEnter={() => prefetch(to)}
      onFocus={() => prefetch(to)}
      data-testid={testId}
      aria-current={active ? "page" : undefined}
      className={`menu-item group ${active ? "menu-item-active" : "menu-item-inactive"} ${!wide ? "lg:justify-center" : ""}`}
    >
      <span className={`menu-item-icon-size ${active ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
        <Icon />
      </span>
      {wide && <span className="menu-item-text">{label}</span>}
    </Link>
  );

  return (
    <aside
      aria-label={t("nav.mainMenu")}
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-4 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900
        ${isExpanded || isMobileOpen ? "w-72.5" : isHovered ? "w-72.5" : "w-22.5"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`hidden py-6 lg:flex ${!wide ? "lg:justify-center" : "justify-start px-1"}`}>
        <Link to="/" aria-label={t("app.name")}>
          <BrandLogo collapsed={!wide} />
        </Link>
      </div>
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto pt-4 duration-300 ease-linear lg:pt-0">
        <nav className="mb-6 flex flex-col gap-6">
          <div>
            <h2 className={`mb-3 flex px-2 text-[11px] font-semibold uppercase leading-5 tracking-wider text-gray-400 ${!wide ? "lg:justify-center lg:px-0" : ""}`}>
              {wide ? t("nav.menu") : <MoreHorizontal className="size-5" />}
            </h2>
            <ul className="flex flex-col gap-1.5">
              <li>{topLink("/", t("nav.dashboard"), LayoutDashboard, path === "/", "nav-dashboard")}</li>
              {sections.map((section) => {
                const open = openSection === section.id;
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => setOpenSection(open ? null : section.id)}
                      aria-expanded={open}
                      className={`menu-item group cursor-pointer ${open ? "menu-item-active" : "menu-item-inactive"} ${!wide ? "lg:justify-center" : "lg:justify-start"}`}
                    >
                      <span className={`menu-item-icon-size ${open ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                        <Icon />
                      </span>
                      {wide && <span className="menu-item-text">{t(`nav.sections.${section.id}.name`)}</span>}
                      {wide && <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${open ? "rotate-180 text-brand-600" : ""}`} />}
                    </button>
                    {wide && (
                      <div
                        ref={(el) => {
                          refs.current[section.id] = el;
                        }}
                        className="overflow-hidden transition-all duration-300"
                        style={{ height: open ? `${heights[section.id] ?? 0}px` : "0px" }}
                      >
                        <ul className="ml-9 mt-1.5 space-y-0.5 border-l border-gray-100 pl-2 dark:border-gray-800">
                          {section.items.map((leaf) => {
                            const active = leafActive(leaf);
                            return (
                              <li key={leaf.path}>
                                <Link
                                  to={leaf.path}
                                  onMouseEnter={() => prefetch(leaf.path)}
                                  onFocus={() => prefetch(leaf.path)}
                                  aria-current={active ? "page" : undefined}
                                  className={`menu-dropdown-item !py-2 ${active ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                                >
                                  <span className="min-w-0 flex-1 truncate">{t(`nav.items.${leaf.key}.name`)}</span>
                                  <span className="ml-auto flex items-center gap-1">
                                    {leaf.credit && <Coins className="h-3.5 w-3.5 text-amber-500" aria-label={t("nav.usesCredits")} />}
                                    {leaf.new && (
                                      <span className={`menu-dropdown-badge ${active ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"}`}>{t("common.new")}</span>
                                    )}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className={`mb-3 flex px-2 text-[11px] font-semibold uppercase leading-5 tracking-wider text-gray-400 ${!wide ? "lg:justify-center lg:px-0" : ""}`}>
              {wide ? t(demo ? "nav.help" : "nav.account") : <MoreHorizontal className="size-5" />}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {!demo && (
                <>
                  <li>{topLink(CREDITS_PATH, t("nav.credits"), Coins, path === CREDITS_PATH, "nav-credits")}</li>
                  <li>{topLink(PLANS_PATH, t("nav.plans"), Crown, path === PLANS_PATH, "nav-plans")}</li>
                  <li>{topLink(JOB_HISTORY_PATH, t("nav.jobHistory"), History, path === JOB_HISTORY_PATH, "nav-job-history")}</li>
                  <li>{topLink(TEAM_PATH, t("nav.team"), Users, path === TEAM_PATH || path.startsWith(`${TEAM_PATH}/`), "nav-team")}</li>
                </>
              )}
              <li>{topLink(DOCS_PATH, t("nav.docs"), BookOpen, path === DOCS_PATH || path.startsWith(`${DOCS_PATH}/`), "nav-docs")}</li>
            </ul>
          </div>
        </nav>
        {wide ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
