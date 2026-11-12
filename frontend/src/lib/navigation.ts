export type NavItem = {
  /** Matches the prototype's `data-page` values */
  page: string;
  label: string;
  href: string;
  /** Rendered with a gold highlight (Login Register) */
  highlight?: boolean;
};

/**
 * Top navigation — ported from the prototype's `<nav id="topnav">`.
 * `href` replaces the old `go(page)` JavaScript page switcher.
 *
 * JUDE-BETTLIN branch: Student/Advocate/Client/Admin entries removed from the
 * top nav. The Login Register entry is highlighted in gold.
 */
export const NAV_ITEMS: NavItem[] = [
  { page: "home", label: "Home", href: "/" },
  { page: "library", label: "Legal Library", href: "/library" },
  { page: "ai", label: "AI Solutions", href: "/ai" },
  { page: "auth", label: "Login Register", href: "/login", highlight: true },
];

/** Portal route for each authentiatable role (used after sign in / sign up). */
export const ROLE_PORTAL: Record<"student" | "advocate" | "client", string> = {
  student: "/student",
  advocate: "/advocate",
  client: "/client",
};
