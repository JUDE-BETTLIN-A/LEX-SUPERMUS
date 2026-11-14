"use client";

/**
 * AuthPanel – two-step unified auth panel for LEX SUPERMUS.
 *
 * STEP 1  →  Credentials  (Sign In / Create Account)
 *            • Email + Password (+ name & confirm on register)
 *
 * STEP 2  →  Domain chooser  (after credentials are accepted)
 *            • Student  |  Advocate  |  Client
 *            Each card shows the role-specific extras on register.
 *            Clicking a card redirects to that portal.
 *
 * No real authentication — UI prototype.
 * Wire handleCredentials() to the real auth API when backend is ready.
 *   student-service  :8081   advocate-service :8082   client-service :8083
 */

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type RoleKey = Extract<UserRole, "STUDENT" | "ADVOCATE" | "CLIENT">;
type AuthMode = "login" | "register";
type Step = "credentials" | "domain";

/* ─── Domain metadata ────────────────────────────────────────────────────── */

interface DomainMeta {
  label: string;
  icon: string;
  tagline: string;
  accentColor: string;
  bgColor: string;
  portal: string;
  extras: { label: string; placeholder: string; type?: string; options?: string[] }[];
}

const DOMAINS: Record<RoleKey, DomainMeta> = {
  STUDENT: {
    label: "Student",
    icon: "🎓",
    tagline: "Build your legal career",
    accentColor: "#2c9a66",
    bgColor: "#edfaf4",
    portal: "/student",
    extras: [
      { label: "Law School / University", placeholder: "e.g. National Law School, Bangalore" },
      {
        label: "Year of Study",
        placeholder: "Select year",
        type: "select",
        options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
      },
    ],
  },
  ADVOCATE: {
    label: "Advocate",
    icon: "⚖️",
    tagline: "Manage your practice",
    accentColor: "#c2a66b",
    bgColor: "#fdf8ef",
    portal: "/advocate",
    extras: [
      {
        label: "State Bar Council",
        placeholder: "Select council",
        type: "select",
        options: [
          "Bar Council of Tamil Nadu and Puducherry",
          "Bar Council of Delhi",
          "Bar Council of Maharashtra and Goa",
          "Other State Bar Council",
        ],
      },
      { label: "Enrolment Number", placeholder: "e.g. TN/1234/2020" },
    ],
  },
  CLIENT: {
    label: "Client",
    icon: "👤",
    tagline: "Find legal support",
    accentColor: "#14243a",
    bgColor: "#eef1f6",
    portal: "/client",
    extras: [
      { label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
      { label: "City", placeholder: "e.g. Chennai" },
    ],
  },
};

const DOMAIN_ORDER: RoleKey[] = ["STUDENT", "ADVOCATE", "CLIENT"];

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function AuthPanel() {
  const router = useRouter();

  const [step, setStep]       = useState<Step>("credentials");
  const [mode, setMode]       = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [domainLoading, setDomainLoading] = useState<RoleKey | null>(null);
  const [error, setError]     = useState("");

  /* ── Step 1: Credentials ───────────────────────────────────────────────── */

  async function handleCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const enteredName = String(formData.get("name") ?? "").trim();
    const displayName = mode === "register" && enteredName
      ? enteredName
      : (email.split("@")[0] || "Member")
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());
    try {
      /* TODO: replace with real API call
       *   await postJson("/api/auth/login", { email, password });
       *   OR  await postJson("/api/auth/register", { name, email, password });
       */
      await new Promise((r) => setTimeout(r, 700)); // simulate network
      window.localStorage.setItem("lex-supermus-user-name", displayName);
      window.dispatchEvent(new Event("lex-auth-updated"));
      setStep("domain");                             // advance to role picker
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Step 2: Domain selection ──────────────────────────────────────────── */

  async function handleDomainSelect(role: RoleKey) {
    setDomainLoading(role);
    try {
      /* TODO: attach role to the authenticated session, e.g.:
       *   await postJson("/api/auth/set-role", { role });
       */
      await new Promise((r) => setTimeout(r, 500));
      router.push(DOMAINS[role].portal);
    } finally {
      setDomainLoading(null);
    }
  }

  /* ── Render ────────────────────────────────────────────────────────────── */

  return (
    <div className="auth-page">

      {/* ── Branding ── */}
      <div className="auth-brand">
        <span className="auth-brand-mark">⚖</span>
        <div>
          <strong>LEX SUPERMUS</strong>
          <small>WHERE LAW MEETS INTELLIGENCE</small>
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div className="auth-steps">
        <div className={`auth-step-dot${step === "credentials" ? " auth-step-dot--active" : " auth-step-dot--done"}`}>
          {step === "domain" ? "✓" : "1"}
        </div>
        <div className={`auth-step-line${step === "domain" ? " auth-step-line--done" : ""}`} />
        <div className={`auth-step-dot${step === "domain" ? " auth-step-dot--active" : ""}`}>2</div>
        <span className="auth-step-label" style={{ marginLeft: 8 }}>
          {step === "credentials" ? "Enter your credentials" : "Choose your domain"}
        </span>
      </div>

      {/* ════════════════════════════════════════
          STEP 1 — CREDENTIALS CARD
         ════════════════════════════════════════ */}
      {step === "credentials" && (
        <div className="auth-card">

          {/* Mode toggle */}
          <div className="auth-mode-row">
            <button
              className={`auth-mode-btn${mode === "login" ? " auth-mode-btn--active" : ""}`}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Sign In
            </button>
            <button
              className={`auth-mode-btn${mode === "register" ? " auth-mode-btn--active" : ""}`}
              onClick={() => { setMode("register"); setError(""); }}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div className="auth-heading">
            <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p className="auth-sub">
              {mode === "login"
                ? "Sign in, then pick your portal — Student, Advocate, or Client."
                : "Register once, then choose your role in the next step."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCredentials} className="auth-form" noValidate>

            {mode === "register" && (
              <>
                <label htmlFor="auth-name">Full Name</label>
                <input id="auth-name" name="name" required placeholder="Your full legal name" />
              </>
            )}

            <label htmlFor="auth-email">Email Address</label>
            <input id="auth-email" name="email" type="email" required placeholder="you@example.com" />

            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              required
              placeholder={mode === "register" ? "Create a strong password" : "Enter your password"}
            />

            {mode === "register" && (
              <>
                <label htmlFor="auth-confirm">Confirm Password</label>
                <input id="auth-confirm" type="password" required placeholder="Re-enter your password" />
              </>
            )}

            {error && <div className="auth-error">{error}</div>}

            {mode === "login" && (
              <div className="auth-forgot">
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => window.alert("Demo: password-reset email would be sent.")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="auth-submit auth-submit--navy" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Register →"}
            </button>

            <p className="auth-disclaimer">
              {mode === "login"
                ? "Demo mode — no real credentials are verified."
                : "Demo mode — no data is stored or transmitted."}
            </p>
          </form>

          {/* Switch mode footer */}
          <div className="auth-switch">
            {mode === "login" ? (
              <>Don&apos;t have an account?{" "}
                <button className="auth-link-btn" onClick={() => setMode("register")}>Register here</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button className="auth-link-btn" onClick={() => setMode("login")}>Sign in</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          STEP 2 — DOMAIN CHOOSER
         ════════════════════════════════════════ */}
      {step === "domain" && (
        <div className="auth-domain-wrap">
          <div className="auth-heading" style={{ textAlign: "center", marginBottom: 24 }}>
            <h2>Choose your domain</h2>
            <p className="auth-sub">
              Select the role that best describes you.
              {mode === "register" && " You can complete your profile from your portal."}
            </p>
          </div>

          <div className="auth-domain-grid">
            {DOMAIN_ORDER.map((role) => {
              const d = DOMAINS[role];
              const isLoading = domainLoading === role;
              return (
                <button
                  key={role}
                  className={`auth-domain-card${isLoading ? " auth-domain-card--loading" : ""}`}
                  style={{ "--domain-accent": d.accentColor, "--domain-bg": d.bgColor } as React.CSSProperties}
                  onClick={() => handleDomainSelect(role)}
                  disabled={domainLoading !== null}
                >
                  <span className="auth-domain-icon">{d.icon}</span>
                  <span className="auth-domain-label">{d.label}</span>
                  <span className="auth-domain-tagline">{d.tagline}</span>

                  {/* Register: show key extra fields as preview pills */}
                  {mode === "register" && (
                    <ul className="auth-domain-fields">
                      {d.extras.map((ex) => (
                        <li key={ex.label}>{ex.label}</li>
                      ))}
                    </ul>
                  )}

                  <span className="auth-domain-cta">
                    {isLoading ? "Opening…" : `Enter as ${d.label} →`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Back link */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              className="auth-link-btn"
              onClick={() => { setStep("credentials"); setError(""); }}
            >
              ← Back to sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
