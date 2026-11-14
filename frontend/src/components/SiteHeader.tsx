"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileAvatar from "@/components/ProfileAvatar";
import { NAV_ITEMS } from "@/lib/navigation";

type UserRole = "STUDENT" | "ADVOCATE" | "CLIENT";

type SignedInProfile = {
  name: string;
  role: UserRole | "";
  avatar: string;
  completion: number;
};

function isUserRole(role: string): role is UserRole {
  return role === "STUDENT" || role === "ADVOCATE" || role === "CLIENT";
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<SignedInProfile>({
    name: "",
    role: "",
    avatar: "",
    completion: 0,
  });

  useEffect(() => {
    const syncProfile = () => {
      const savedRole = window.localStorage.getItem("lex-supermus-user-role") ?? "";
      const completion = Number(
        window.localStorage.getItem("lex-supermus-profile-completion") ?? "0"
      );
      setProfile({
        name: window.localStorage.getItem("lex-supermus-user-name") ?? "",
        role: isUserRole(savedRole) ? savedRole : "",
        avatar: window.localStorage.getItem("lex-supermus-user-avatar") ?? "",
        completion: Number.isFinite(completion) ? completion : 0,
      });
    };

    syncProfile();
    window.addEventListener("lex-auth-updated", syncProfile);
    window.addEventListener("storage", syncProfile);
    return () => {
      window.removeEventListener("lex-auth-updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const profileHref = profile.role === "CLIENT"
    ? "/client"
    : profile.role === "STUDENT"
      ? "/student"
      : "/advocate";

  function handleLogout() {
    [
      "lex-supermus-user-name",
      "lex-supermus-user-role",
      "lex-supermus-user-avatar",
      "lex-supermus-profile-completion",
    ].forEach((key) => window.localStorage.removeItem(key));
    window.dispatchEvent(new Event("lex-auth-updated"));
    router.push("/");
  }

  return (
    <header>
      <Link href="/" className="brand" style={{ textDecoration: "none" }}>
        <span className="mark" aria-hidden="true">⚖</span>
        <div>
          <b>LEX SUPERMUS</b>
          <small>WHERE LAW MEETS INTELLIGENCE</small>
        </div>
      </Link>
      <nav id="topnav">
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

        {profile.name && profile.role ? (
          <>
            <Link
              href={profileHref}
              className="nav-profile-link"
              aria-label={`${profile.name}, ${profile.role.toLowerCase()} profile, ${profile.completion}% complete`}
              title={`${profile.name} · Profile ${profile.completion}% complete`}
            >
              <ProfileAvatar
                name={profile.name}
                image={profile.avatar}
                completion={profile.completion}
              />
              <span className="nav-profile-percent">{profile.completion}%</span>
            </Link>
            <button type="button" className="navbtn nav-login-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className={`navbtn nav-login-btn${pathname.startsWith("/login") ? " nav-login-btn--active" : ""}`}
            data-page="login"
            title="Student and advocate sign in or register"
          >
            <span className="nav-login-icon" aria-hidden="true">🔐</span>
            <span className="nav-login-label">Login</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
