"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";

/**
 * Site header — ported from the prototype's `<header>` + `<nav id="topnav">`.
 *
 * Student / Advocate / Client nav entries are removed.
 * A single 🔐 Login button routes to /login where the user authenticates
 * and then picks their domain (Student | Advocate | Client).
 * Home, Legal Library, and AI Solutions remain as public links.
 */
export default function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isLoginActive = pathname.startsWith("/login");

  return (
    <header>
      <Link href="/" className="brand" style={{ textDecoration: "none" }}>
        <span className="mark">⚖</span>
        <div>
          <b>LEX SUPERMUS</b>
          <small>WHERE LAW MEETS INTELLIGENCE</small>
        </div>
      </Link>

      <nav id="topnav">
        {/* Public nav links — Home · Legal Library · AI Solutions */}
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.page}
            href={item.href}
            className={`navbtn${isActive(item.href) ? " active" : ""}`}
            data-page={item.page}
          >
            {item.label}
          </Link>
        ))}

        {/* Single unified Login entry — replaces Student / Advocate / Client */}
        <Link
          href="/login"
          className={`navbtn nav-login-btn${isLoginActive ? " nav-login-btn--active" : ""}`}
          data-page="login"
          title="Sign in or register as Student, Advocate, or Client"
        >
          <span className="nav-login-icon" aria-hidden="true">🔐</span>
          <span className="nav-login-label">Login</span>
        </Link>
      </nav>
    </header>
  );
}
