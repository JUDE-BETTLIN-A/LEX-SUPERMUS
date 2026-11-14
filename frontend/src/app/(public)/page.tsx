"use client";

import Link from "next/link";
import { useProfessionalSession } from "@/components/ProfessionalSession";

/**
 * Landing page — ported from the prototype's `<section id="home">`.
 * `go(page)` calls become Next.js `<Link>` navigation.
 */
export default function HomePage() {
  const { profile } = useProfessionalSession();

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
          <p>Your Legal Career. Your Legal Practice. Your Legal Knowledge.</p>
          <div className="actions">
            {profile && (
              <Link href="/feed" className="goldbtn">
                Explore Platform →
              </Link>
            )}
            {!profile && (
              <Link href="/login" className="outlinebtn">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="ecosystem-section" aria-labelledby="ecosystem-title">
        <div className="sectionHeading">
          <p className="sectionKicker">One connected legal community</p>
          <h2 className="sectionTitle" id="ecosystem-title">
            Explore LEX SUPERMUS
          </h2>
          <p className="ecosystemIntro">
            Client support, trusted legal knowledge, and AI tools in one place.
          </p>
        </div>

        <div className="cards">
          <Link href="/client/access" className="card portal">
            <div className="ico">👥</div>
            <h3>Client Portal</h3>
            <p>Sign in or create an account to organise legal support.</p>
            <span className="link">Continue to client access →</span>
          </Link>
          <Link href="/library" className="card portal">
            <div className="ico">📚</div>
            <h3>Legal Library</h3>
            <p>Explore legal knowledge</p>
            <span className="link">Browse resources →</span>
          </Link>
          <Link href="/ai" className="card portal">
            <div className="ico">🧠</div>
            <h3>AI Legal Intelligence</h3>
            <p>Organise questions and explore legal topics.</p>
            <span className="link">Explore AI tools →</span>
          </Link>
        </div>
      </section>

      <section className="platform-section" aria-labelledby="platform-title">
        <div className="sectionHeading">
          <p className="sectionKicker">Designed for clarity and trust</p>
          <h2 className="sectionTitle" id="platform-title">
            A clearer way to get started
          </h2>
        </div>
        <div className="card ecosystem-benefits">
          <h3>Built around your legal journey</h3>
          <ul>
            <li>Clear client sign-in and account creation</li>
            <li>Consultation preferences in one place</li>
            <li>Legal resources alongside your support tools</li>
            <li>Privacy-first demo: no details are saved or sent</li>
          </ul>
        </div>
      </section>
    </section>
  );
}
