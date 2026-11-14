"use client";

import { useState } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";

/**
 * Registration landing page (master spec Part 3) — JUDE-BETTLIN branch.
 * "Join India's Legal Professional Network" + Student / Advocate cards,
 * a separate Client registration option, and a common Login toggle.
 * Replaces the old single-panel AuthPanel.
 */
export default function RegistrationLanding() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="panel">
      {!showLogin ? (
        <>
          <h1>Join India's Legal Professional Network</h1>
          <p className="sub">
            Connect with law students, advocates and legal professionals.
            Discover internships, career opportunities and build your legal
            professional identity.
          </p>

          <div className="rowcards" style={{ gap: 14 }}>
            <div className="item" style={{ margin: 0, display: "flex", flexDirection: "column" }}>
              <h3>🎓 Join as a Law Student</h3>
              <p style={{ flex: 1 }}>
                Build your legal career, discover internships, connect with
                advocates and showcase your academic achievements.
              </p>
              <Link href="/register/student" className="primary" style={{ textAlign: "center", textDecoration: "none", marginTop: 10 }}>
                Register as Student
              </Link>
            </div>

            <div className="item" style={{ margin: 0, display: "flex", flexDirection: "column" }}>
              <h3>⚖️ Join as an Advocate</h3>
              <p style={{ flex: 1 }}>
                Build your professional identity, connect with upcoming legal
                talent and discover professional opportunities.
              </p>
              <Link href="/register/advocate" className="primary" style={{ textAlign: "center", textDecoration: "none", marginTop: 10 }}>
                Register as Advocate
              </Link>
            </div>
          </div>

          <div className="item" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: 0 }}>👤 Client account</h3>
              <p style={{ margin: "4px 0 0" }}>
                Just need email and password — find trusted legal support.
              </p>
            </div>
            <Link href="/register/client" className="ghost" style={{ textDecoration: "none" }}>
              Register as Client →
            </Link>
          </div>

          <div className="divider" style={{ height: 1, background: "var(--line)", margin: "18px 0" }} />

          <p style={{ margin: 0, color: "var(--muted)" }}>
            Already a member?
          </p>
          <button type="button" className="authtab active" style={{ marginTop: 8 }} onClick={() => setShowLogin(true)}>
            Sign In →
          </button>

          <div className="notice">
            Registration collects only what the relevant verification workflow
            needs (master spec Part 15 — data minimisation). Advocates start
            unverified; Bar Council enrolment review happens after sign up.
          </div>
        </>
      ) : (
        <>
          <button type="button" className="ghost" style={{ marginBottom: 12 }} onClick={() => setShowLogin(false)}>
            ← Back to registration options
          </button>
          <LoginForm />
        </>
      )}
    </div>
  );
}
