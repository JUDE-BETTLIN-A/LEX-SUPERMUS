"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type AuthMode = "login" | "register";

function getAdultBirthdateLimit() {
  const today = new Date();
  const limit = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );
  const month = String(limit.getMonth() + 1).padStart(2, "0");
  const day = String(limit.getDate()).padStart(2, "0");
  return `${limit.getFullYear()}-${month}-${day}`;
}

export default function ClientAuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const maxDateOfBirth = getAdultBirthdateLimit();

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (mode === "register") {
      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");
      const dateOfBirth = String(formData.get("dateOfBirth") ?? "");

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!dateOfBirth || dateOfBirth > maxDateOfBirth) {
        setError("Client accounts are for people aged 18 or older.");
        return;
      }

      setNotice(
        "Demo only: your details were checked in this browser and cleared. No account was created or information saved.",
      );
    } else {
      setNotice(
        "Demo only: sign-in cannot verify credentials because account services are not connected. No information was saved.",
      );
    }

    form.reset();
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="auth-brand-mark" aria-hidden="true">
          ⚖
        </span>
        <div>
          <strong>LEX SUPERMUS</strong>
          <small>CLIENT ACCESS</small>
        </div>
      </div>

      <div className="auth-card client-auth-card">
        <div className="auth-mode-row" role="group" aria-label="Client access">
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
              ? "Sign in to continue to the client portal."
              : "Share a few details to set up your client profile."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="client-auth-grid">
              <div>
                <label htmlFor="client-name">Full name</label>
                <input
                  id="client-name"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="client-date-of-birth">Date of birth</label>
                <input
                  id="client-date-of-birth"
                  name="dateOfBirth"
                  type="date"
                  autoComplete="bday"
                  min="1900-01-01"
                  max={maxDateOfBirth}
                  required
                />
                <small className="field-hint">You must be 18 or older.</small>
              </div>
              <div>
                <label htmlFor="client-email">Email address</label>
                <input
                  id="client-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="client-phone">Phone number</label>
                <input
                  id="client-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="Your phone number"
                />
              </div>
              <div className="client-auth-field--full">
                <label htmlFor="client-address">Address</label>
                <textarea
                  id="client-address"
                  name="address"
                  autoComplete="street-address"
                  rows={2}
                  required
                  placeholder="Street, city, state, and postal code"
                />
              </div>
              <div>
                <label htmlFor="client-password">Password</label>
                <input
                  id="client-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <label htmlFor="client-confirm-password">Confirm password</label>
                <input
                  id="client-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="Re-enter your password"
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
                required
                placeholder="you@example.com"
              />
              <label htmlFor="client-login-password">Password</label>
              <input
                id="client-login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
              />
            </>
          )}

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}
          {notice && (
            <div className="notice auth-notice" role="status">
              {notice}
            </div>
          )}

          <button type="submit" className="auth-submit auth-submit--navy">
            {mode === "login" ? "Continue to demo sign-in" : "Check demo details"}
          </button>

          <p className="auth-disclaimer">
            Demo only — account services are not connected. Do not enter real
            passwords or sensitive information; details are not saved or sent.
          </p>
        </form>

        {notice && (
          <div className="auth-continue">
            <Link href="/client" className="goldbtn">
              Continue to Client Portal →
            </Link>
          </div>
        )}

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              New to LEX SUPERMUS?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => changeMode("register")}
              >
                Create a client account
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => changeMode("login")}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
