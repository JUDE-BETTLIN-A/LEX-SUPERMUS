"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

enum MeetingMode {
  InPerson = "in-person",
  Online = "online",
}

type ClientRegistration = {
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  meetingMode: MeetingMode;
  meetingLocation: string;
  issue: string;
};

type AuthMode = "login" | "register";

function getAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;

  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);
  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)
  ) {
    age -= 1;
  }
  return age;
}

function getLatestAdultBirthDate(): string {
  const today = new Date();
  const date = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function isMeetingMode(value: string): value is MeetingMode {
  return Object.values(MeetingMode).some((mode) => mode === value);
}

export default function ClientAuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const age = getAge(dateOfBirth);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    let displayName = (email.split("@")[0] || "Client")
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

    if (mode === "register") {
      const age = getAge(dateOfBirth);
      if (age === null || age < 18) {
        setError("You must be at least 18 years old to create a client account.");
        return;
      }

      const meetingMode = String(formData.get("meetingMode") ?? "");
      if (!isMeetingMode(meetingMode)) {
        setError("Choose an in-person or online meeting.");
        return;
      }

      const registration: ClientRegistration = {
        name: String(formData.get("name") ?? "").trim(),
        dateOfBirth,
        email,
        phone: String(formData.get("phone") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        meetingMode,
        meetingLocation: String(formData.get("meetingLocation") ?? "").trim(),
        issue: String(formData.get("issue") ?? "").trim(),
      };
      displayName = registration.name;

      if (password !== String(formData.get("confirmPassword") ?? "")) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
    window.localStorage.setItem("lex-supermus-user-name", displayName);
    window.localStorage.setItem("lex-supermus-user-role", "CLIENT");
    window.localStorage.removeItem("lex-supermus-user-avatar");
    window.localStorage.setItem("lex-supermus-profile-completion", "100");
    window.dispatchEvent(new Event("lex-auth-updated"));
    router.push("/client");
    setLoading(false);
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setDateOfBirth("");
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="auth-brand-mark" aria-hidden="true">⚖</span>
        <div>
          <strong>LEX SUPERMUS</strong>
          <small>LEGAL SUPPORT, KNOWLEDGE &amp; INTELLIGENCE</small>
        </div>
      </div>

      <div className={`auth-card client-auth-card${mode === "register" ? " client-auth-card--register" : ""}`}>
        <div className="auth-mode-row" role="group" aria-label="Client account options">
          <button
            type="button"
            aria-pressed={mode === "login"}
            className={`auth-mode-btn${mode === "login" ? " auth-mode-btn--active" : ""}`}
            onClick={() => changeMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            aria-pressed={mode === "register"}
            className={`auth-mode-btn${mode === "register" ? " auth-mode-btn--active" : ""}`}
            onClick={() => changeMode("register")}
          >
            Create Account
          </button>
        </div>

        <div className="auth-heading">
          <h2>{mode === "login" ? "Welcome back" : "Create your client account"}</h2>
          <p className="auth-sub">
            {mode === "login"
              ? "Sign in to continue to your client portal."
              : "Tell us how to reach you and what kind of support you need."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="client-registration-grid">
              <div className="client-field">
                <label htmlFor="client-name">Full name</label>
                <input id="client-name" name="name" autoComplete="name" required />
              </div>
              <div className="client-field">
                <label htmlFor="client-date-of-birth">Date of birth</label>
                <input
                  id="client-date-of-birth"
                  name="dateOfBirth"
                  type="date"
                  max={getLatestAdultBirthDate()}
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  autoComplete="bday"
                  required
                />
                <span className="client-age-note" aria-live="polite">
                  {age === null ? "Client accounts are for adults aged 18 or over." : `Age: ${age}`}
                </span>
              </div>
              <div className="client-field">
                <label htmlFor="client-email">Email address</label>
                <input
                  id="client-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="client-field">
                <label htmlFor="client-phone">Phone number</label>
                <input
                  id="client-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  pattern="[0-9+(). -]{7,20}"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div className="client-field client-field--full">
                <label htmlFor="client-address">Address</label>
                <textarea
                  id="client-address"
                  name="address"
                  autoComplete="street-address"
                  rows={2}
                  required
                />
              </div>
              <div className="client-field">
                <label htmlFor="client-meeting-mode">Preferred meeting mode</label>
                <select id="client-meeting-mode" name="meetingMode" defaultValue="" required>
                  <option value="" disabled>Select a meeting mode</option>
                  <option value={MeetingMode.InPerson}>In-person</option>
                  <option value={MeetingMode.Online}>Online</option>
                </select>
              </div>
              <div className="client-field">
                <label htmlFor="client-meeting-location">Meeting location</label>
                <input
                  id="client-meeting-location"
                  name="meetingLocation"
                  placeholder="City, area, or preferred online location"
                  required
                />
              </div>
              <div className="client-field client-field--full">
                <label htmlFor="client-issue">How can we help?</label>
                <textarea
                  id="client-issue"
                  name="issue"
                  rows={3}
                  minLength={10}
                  placeholder="Briefly describe the type of legal support you are looking for."
                  required
                />
              </div>
              <div className="client-field">
                <label htmlFor="client-password">Create password</label>
                <input
                  id="client-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              <div className="client-field">
                <label htmlFor="client-confirm-password">Confirm password</label>
                <input
                  id="client-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>
          )}

          {mode === "login" && (
            <>
              <label htmlFor="client-login-email">Email address</label>
              <input
                id="client-login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
              <label htmlFor="client-login-password">Password</label>
              <input
                id="client-login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
              <div className="auth-forgot">
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => window.alert("Password reset is not available in this demo.")}
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {error && <div className="auth-error" role="alert">{error}</div>}

          {mode === "register" && (
            <p className="client-privacy-note">
              Demo only: your display name is kept in this browser; other details are not sent or
              securely stored. Avoid entering confidential case facts or sensitive documents.
            </p>
          )}

          {mode === "login" && (
            <p className="auth-disclaimer">Demo mode — sign-in is not connected to a live account service.</p>
          )}

          <button type="submit" className="auth-submit auth-submit--navy" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign in to client portal →" : "Create client account →"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>New to LEX SUPERMUS?{" "}
              <button type="button" className="auth-link-btn" onClick={() => changeMode("register")}>
                Create a client account
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button type="button" className="auth-link-btn" onClick={() => changeMode("login")}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
