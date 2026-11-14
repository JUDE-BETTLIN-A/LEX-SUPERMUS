"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/navigation";

/**
 * Site header — ported from the prototype's `<header>` + `<nav id="topnav">`.
 *
 * Student / Advocate / Client nav entries are removed.
 * Signed-out users see Login; authenticated users see Logout.
 * Home, Legal Library, and AI Solutions remain as public links.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const syncUserName = () => {
      setUserName(window.localStorage.getItem("lex-supermus-user-name") ?? "");
    };
    syncUserName();
    window.addEventListener("lex-auth-updated", syncUserName);
    return () => window.removeEventListener("lex-auth-updated", syncUserName);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isLoginActive = pathname.startsWith("/login");

  function handleLogout() {
    window.localStorage.removeItem("lex-supermus-user-name");
    window.dispatchEvent(new Event("lex-auth-updated"));
    router.push("/");
  }

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

        {userName && <span className="nav-user-greeting">Welcome, {userName}</span>}

        {userName ? (
          <button type="button" className="navbtn nav-login-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className={`navbtn nav-login-btn${isLoginActive ? " nav-login-btn--active" : ""}`}
            data-page="login"
            title="Sign in or register"
          >
            <span className="nav-login-icon" aria-hidden="true">🔐</span>
            <span className="nav-login-label">Login</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
