export type NavItem = {
  /** Matches the prototype's `data-page` values */
  page: string;
  label: string;
  href: string;
};

/**
 * Top navigation — ported from the prototype's `<nav id="topnav">`.
 * `href` replaces the old `go(page)` JavaScript page switcher.
 *
 * Home, Legal Library, and AI Solutions remain public nav links.
 * Professional login is handled separately; clients enter through /client.
 */
export const NAV_ITEMS: NavItem[] = [
  { page: "home", label: "Home", href: "/" },
  { page: "library", label: "Legal Library", href: "/library" },
  { page: "ai", label: "AI Solutions", href: "/ai" },
];
