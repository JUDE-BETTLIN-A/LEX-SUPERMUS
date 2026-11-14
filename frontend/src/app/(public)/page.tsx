"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UserRole = "STUDENT" | "ADVOCATE" | "CLIENT";

function isUserRole(role: string): role is UserRole {
  return role === "STUDENT" || role === "ADVOCATE" || role === "CLIENT";
}

export default function HomePage() {
  const [userRole, setUserRole] = useState<UserRole | "">("");

  useEffect(() => {
    const syncAuthentication = () => {
      const savedRole = window.localStorage.getItem("lex-supermus-user-role") ?? "";
      setUserRole(isUserRole(savedRole) ? savedRole : "");
    };

    syncAuthentication();
    window.addEventListener("lex-auth-updated", syncAuthentication);
    window.addEventListener("storage", syncAuthentication);
    return () => {
      window.removeEventListener("lex-auth-updated", syncAuthentication);
      window.removeEventListener("storage", syncAuthentication);
    };
  }, []);

  return (
    <section id="home" className="page">
      <div className="hero">
        <div className="heroContent">
          <div className="eyebrow">THE INDIAN LEGAL TECHNOLOGY ECOSYSTEM</div>
          <h1>
            Where Law
            <br />
            Meets <span>Intelligence</span>
          </h1>
          <p>Legal Support. Trusted Knowledge. Clear Next Steps.</p>
          <div className="actions">
            {(userRole === "STUDENT" || userRole === "ADVOCATE") && (
              <Link href="/feed" className="goldbtn">
                Explore Professional Feed →
              </Link>
            )}
            {userRole === "CLIENT" && (
              <Link href="/client" className="goldbtn">
                Open Client Portal →
              </Link>
            )}
            {!userRole && (
              <Link href="/login" className="outlinebtn">
                Get Started
              </Link>
            )}
            <Link href="#ecosystem" className="heroExploreLink">
              Browse services <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </div>

      <section id="ecosystem" className="ecosystemSection" aria-labelledby="ecosystem-title">
        <div className="sectionHeading">
          <p className="sectionEyebrow">One connected platform</p>
          <h2 id="ecosystem-title" className="sectionTitle">
            LEGAL SUPPORT, KNOWLEDGE &amp; INTELLIGENCE
          </h2>
          <p className="sectionIntro">
            Find legal support, explore trusted resources, and get help understanding your next steps.
          </p>
        </div>

        <div className="ecosystemGrid">
          <Link href="/client" className="card portal ecosystemCard">
            <span className="ecosystemType">PERSONALISED LEGAL SUPPORT</span>
            <div className="ico" aria-hidden="true">👥</div>
            <h3>Client Portal</h3>
            <p>Share what kind of help you need and arrange an online or in-person meeting.</p>
            <span className="link">
              Sign in or create an account <span aria-hidden="true">→</span>
            </span>
          </Link>
          <Link href="/library" className="card portal ecosystemCard">
            <span className="ecosystemType">LEGAL RESOURCES</span>
            <div className="ico" aria-hidden="true">📚</div>
            <h3>Legal Library</h3>
            <p>Browse legal resources and build a clearer understanding of relevant topics.</p>
            <span className="link">
              Explore the library <span aria-hidden="true">→</span>
            </span>
          </Link>
          <Link href="/ai" className="card portal ecosystemCard ecosystemCardFeatured">
            <span className="ecosystemType">AI-ASSISTED GUIDANCE</span>
            <div className="ico" aria-hidden="true">🧠</div>
            <h3>AI Legal Intelligence</h3>
            <p>Organise questions and explore legal topics with AI-assisted tools.</p>
            <span className="link">
              Explore AI tools <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </section>
    </section>
  );
}
