"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_PORTAL } from "@/lib/navigation";

type Mode = "signin" | "signup";
type Role = keyof typeof ROLE_PORTAL;

const ROLES: { key: Role; icon: string; title: string; body: string }[] = [
  { key: "student", icon: "🎓", title: "Student", body: "Build your legal career" },
  { key: "advocate", icon: "⚖️", title: "Advocate", body: "Verify. Practise. Grow." },
  { key: "client", icon: "👥", title: "Client", body: "Find trusted legal support" },
];

/**
 * Auth panel — JUDE-BETTLIN branch: replaces the Admin nav entry with a
 * Login / Sign Up page where Student, Advocate and Client users can sign in
 * or create an account, then land in their own portal.
 *
 * Demo only: no backend call yet. When auth is wired up (JWT — see
 * .env.example), this panel should POST to the role-appropriate service.
 */
export default function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<Role>("student");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const action = mode === "signin" ? "Signed in" : "Account created";
    window.alert(
      `Demo only: ${action} as ${role}. Authentication backend is not connected yet.`
    );
    router.push(ROLE_PORTAL[role]);
  };

  return (
    <div className="panel">
      <h1>{mode === "signin" ? "Welcome Back" : "Create Your Account"}</h1>
      <p className="sub">
        Students, Advocates and Clients — one account for the LEX SUPERMUS
        platform.
      </p>

      {/* Role selection */}
      <div className="rowcards">
        {ROLES.map((r) => (
          <div
            key={r.key}
            className="item"
            role="button"
            tabIndex={0}
            onClick={() => setRole(r.key)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setRole(r.key);
            }}
            style={{
              cursor: "pointer",
              borderColor: role === r.key ? "var(--gold)" : undefined,
              boxShadow: role === r.key ? "0 3px 14px #c2a66b55" : undefined,
            }}
          >
            <h3>
              {r.icon} {r.title}
            </h3>
            <p>{r.body}</p>
            {role === r.key && <span className="pill">Selected</span>}
          </div>
        ))}
      </div>

      {/* Mode switch */}
      <div style={{ display: "flex", gap: 8, margin: "18px 0 4px" }}>
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={`authtab${mode === m ? " active" : ""}`}
            onClick={() => setMode(m)}
          >
            {m === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={submit}>
        {mode === "signup" && (
          <>
            <label>Full name</label>
            <input
              placeholder="Enter your full name"
              required
            />
          </>
        )}
        <label>Email</label>
        <input type="email" placeholder="you@example.com" required />
        <label>Password</label>
        <input type="password" placeholder="••••••••" minLength={8} required />

        {mode === "signup" && role === "advocate" && (
          <>
            <label>State Bar Council</label>
            <select required defaultValue="">
              <option value="" disabled>
                Select council
              </option>
              <option>Bar Council of Tamil Nadu and Puducherry</option>
              <option>Other State Bar Council</option>
            </select>
            <label>Enrolment number</label>
            <input placeholder="Enter enrolment number" required />
            <div className="notice">
              Advocate accounts start unverified. Bar Council enrolment review
              happens inside the Advocate Portal after sign up.
            </div>
          </>
        )}

        {mode === "signup" && (
          <div className="notice">
            By creating an account you agree to platform terms. This demo does
            not send data anywhere yet.
          </div>
        )}

        <button type="submit" className="primary">
          {mode === "signin"
            ? `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`
            : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
        </button>
      </form>

      <div className="notice">
        Demo authentication only — accounts are not stored and no verification
        is performed. Never use real credentials here.
      </div>
    </div>
  );
}
