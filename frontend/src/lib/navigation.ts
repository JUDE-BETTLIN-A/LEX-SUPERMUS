export type NavItem = {
  /** Matches the prototype's `data-page` values */
  page: string;
  label: string;
  href: string;
};

/**
 * Top navigation — ported from the prototype's `<nav id="topnav">`.
<<<<<<< Updated upstream
 * `href` replaces the old `go(page)` JavaScript page switcher.
=======
 *
 * Home, Legal Library, and AI Solutions remain public nav links.
 * Professional login is handled separately; clients enter through /client.
>>>>>>> Stashed changes
 */
export const NAV_ITEMS: NavItem[] = [
  { page: "home", label: "Home", href: "/" },
  { page: "student", label: "Student", href: "/student" },
  { page: "advocate", label: "Advocate", href: "/advocate" },
  { page: "client", label: "Client", href: "/client" },
  { page: "library", label: "Legal Library", href: "/library" },
  { page: "ai", label: "AI Solutions", href: "/ai" },
  { page: "admin", label: "Admin", href: "/admin" },
];
