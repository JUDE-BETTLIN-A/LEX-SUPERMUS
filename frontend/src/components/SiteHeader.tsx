"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import ProfileProgressAvatar from "@/components/ProfileProgressAvatar";
import { useProfessionalSession } from "@/components/ProfessionalSession";

/** Shared public navigation with role-specific client and professional access. */
export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useProfessionalSession();
  const isClientArea = pathname.startsWith("/client");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isLoginActive = pathname.startsWith("/login");

  function handleLogout() {
    signOut();
    router.replace("/");
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
        {/* Public navigation stays separate from role-based portal access. */}
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

        {isClientArea ? (
          <Link className="navbtn nav-login-btn" href="/client">
            Client Portal
          </Link>
        ) : profile ? (
          <>
            <span className="nav-user-greeting">Welcome, {profile.fullName}</span>
            <Link
              href="/feed"
              className="nav-profile-link"
              aria-label={`Open professional feed. Profile ${profile.completion}% complete.`}
            >
              <ProfileProgressAvatar
                fullName={profile.fullName}
                imageUrl={profile.avatarUrl}
                completion={profile.completion}
              />
            </Link>
            <button type="button" className="navbtn nav-login-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className={`navbtn nav-login-btn${isLoginActive ? " nav-login-btn--active" : ""}`}
            data-page="login"
            title="Sign in as a student or advocate"
          >
            <span className="nav-login-icon" aria-hidden="true">🔐</span>
            <span className="nav-login-label">Professional Login</span>
          </Link>
        )}

      </nav>
    </header>
  );
}
