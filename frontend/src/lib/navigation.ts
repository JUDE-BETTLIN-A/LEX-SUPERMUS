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
 * JUDE-BETTLIN branch: Student/Advocate/Client/Admin entries removed from the
 * top nav. Users reach their portal by signing in / signing up at /login
 * (role-based redirect). The portal routes still exist but are reached
 * through authentication and links, not the header.
 */
export const NAV_ITEMS: NavItem[] = [
  { page: "home", label: "Home", href: "/" },
  { page: "library", label: "Legal Library", href: "/library" },
  { page: "ai", label: "AI Solutions", href: "/ai" },
  { page: "auth", label: "Login / Sign Up", href: "/login" },
];

/** Portal route for each authentiatable role (used after sign in / sign up). */
export const ROLE_PORTAL: Record<"student" | "advocate" | "client", string> = {
  student: "/student",
  advocate: "/advocate",
  client: "/client",
};
