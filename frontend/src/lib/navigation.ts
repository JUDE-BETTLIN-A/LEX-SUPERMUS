export type NavItem = {
  /** Matches the prototype's `data-page` values */
  page: string;
  label: string;
  href: string;
};

/**
 * Top navigation — ported from the prototype's `<nav id="topnav">`.
 *
 * Student / Advocate / Client / Admin are removed from the top bar.
 * Users reach their portal by signing in via /login (the single Login button).
 * Home, Legal Library, and AI Solutions remain public nav links.
 */
export const NAV_ITEMS: NavItem[] = [
  { page: "home",    label: "Home",          href: "/"        },
  { page: "library", label: "Legal Library", href: "/library" },
  { page: "ai",      label: "AI Solutions",  href: "/ai"      },
];
