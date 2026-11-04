import { forwardRef, useCallback } from "react";
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  Navigate as RouterNavigate,
  useNavigate,
  useParams,
  type LinkProps,
  type NavigateOptions,
  type NavigateProps,
  type NavLinkProps,
  type To,
} from "react-router";
import { DEFAULT_LANG, isLang, localizePath, type Lang } from "../../i18n";

/* ================================================================== */
/* Link/Navigate that automatically adds the language prefix (/id, /en). */
/* Write paths as usual ("/media-tools"); the active language prefix    */
/* is added here, so URLs can always be opened directly.               */
/* ================================================================== */

/** Language from the `:lang` URL segment (default when missing). */
export function useLang(): Lang {
  const { lang } = useParams();
  return isLang(lang) ? lang : DEFAULT_LANG;
}

const localizeTo = (to: To, lang: Lang): To =>
  typeof to === "string" ? localizePath(to, lang) : to.pathname ? { ...to, pathname: localizePath(to.pathname, lang) } : to;

/** Function `lp("/credits")` → "/en/credits". */
export function useLocalePath() {
  const lang = useLang();
  return useCallback((to: string) => localizePath(to, lang), [lang]);
}

export function useLocaleNavigate() {
  const navigate = useNavigate();
  const lang = useLang();
  return useCallback(
    (to: To | number, opts?: NavigateOptions) => (typeof to === "number" ? navigate(to) : navigate(localizeTo(to, lang), opts)),
    [navigate, lang],
  );
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function LocaleLink({ to, ...rest }, ref) {
  const lang = useLang();
  return <RouterLink ref={ref} to={localizeTo(to, lang)} {...rest} />;
});

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function LocaleNavLink({ to, ...rest }, ref) {
  const lang = useLang();
  return <RouterNavLink ref={ref} to={localizeTo(to, lang)} {...rest} />;
});

export function Navigate({ to, ...rest }: NavigateProps) {
  const lang = useLang();
  return <RouterNavigate to={localizeTo(to, lang)} {...rest} />;
}
