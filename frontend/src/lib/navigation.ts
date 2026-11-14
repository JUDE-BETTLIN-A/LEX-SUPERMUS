export type NavItem = {
  /** Matches the prototype's `data-page` values */
  page: string;
  label: string;
  href: string;
};

/**
 * Top navigation — ported from the prototype's `<nav id="topnav">`.
 *
 * Role-specific entry points are rendered separately by SiteHeader.
 * Professional users sign in via /login; clients use /client/access.
 * Home, Legal Library, and AI Solutions remain public nav links.
 */
export const NAV_ITEMS: NavItem[] = [
  { page: "home",    label: "Home",          href: "/"        },
  { page: "library", label: "Legal Library", href: "/library" },
  { page: "ai",      label: "AI Solutions",  href: "/ai"      },
];
