"use client";

import { useState } from "react";
import Link from "next/link";
import { registerAdvocate } from "@/lib/authApi";

type Values = {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirm: string;
  barCouncil: string;
  barId: string;
  experience: string;
  specialization: string;
  location: string;
  consent: boolean;
};

const INITIAL: Values = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirm: "",
  barCouncil: "",
  barId: "",
  experience: "",
  specialization: "",
  location: "",
  consent: false,
};

const COUNCILS = [
  "Bar Council of Tamil Nadu and Puducherry",
  "Bar Council of Karnataka",
  "Bar Council of Kerala",
  "Bar Council of Andhra Pradesh",
  "Bar Council of Telangana",
  "Bar Council of Maharashtra and Goa",
  "Bar Council of Delhi",
  "Other State Bar Council",
];

const SPECIALIZATIONS = [
  "Criminal Law",
  "Family Law",
  "Corporate / Commercial Law",
  "Civil Litigation",
  "Property & Real Estate",
  "Labour & Employment",
  "Taxation",
  "Constitutional Law",
  "Intellectual Property",
  "Other",
];

const STEPS = ["Personal", "Professional", "Consent"];

/**
 * Advocate registration — multi-step (master spec Part 5) — JUDE-BETTLIN branch.
 * Step 1 personal → Step 2 professional (Bar Council, enrolment/bar ID,
 * experience, specialization, location, mobile) → Step 3 consent.
 * The Bar Council enrolment *review* itself stays in advocate-service
 * (existing module); registration only records details as PENDING.
 */
export default function AdvocateRegistrationForm() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Values>(INITIAL);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setV((prev) => ({ ...prev, [key]: e.target.value }));

  const validateStep = (): string | null => {
    if (step === 0) {
      if (v.fullName.trim().length < 3) return "Enter your full legal name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return "Enter a valid email address.";
      if (!/^\d{10}$/.test(v.mobile.replace(/\D/g, ""))) return "Mobile number must be 10 digits.";
      if (v.password.length < 8) return "Password must be at least 8 characters.";
      if (v.password !== v.confirm) return "Passwords do not match.";
    }
    if (step === 1) {
      if (!v.barCouncil) return "Select your State Bar Council.";
      if (v.barId.trim().length < 4) return "Enter your Bar Council enrolment / bar ID.";
      const years = Number(v.experience);
      if (v.experience && (Number.isNaN(years) || years < 0 || years > 70))
        return "Years of experience must be between 0 and 70.";
      if (v.location.trim().length < 2) return "Enter your place of practice / location.";
    }
    if (step === 2 && !v.consent) return "Please accept the consent notice to submit.";
    return null;
  };

  const next = () => {
    const problem = validateStep();
    setError(problem);
    if (!problem) setStep((s) => Math.min(s + 1, 2));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const problem = validateStep();
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError(null);
    const res = await registerAdvocate({
      fullName: v.fullName.trim(),
      email: v.email.trim(),
      mobileNumber: v.mobile.replace(/\D/g, ""),
      password: v.password,
      barCouncil: v.barCouncil,
      enrollmentNumber: v.barId.trim(),
      yearsOfExperience: v.experience ? Number(v.experience) : null,
      specialization: v.specialization || null,
      practiceLocation: v.location.trim(),
    });
    setBusy(false);

    if (res.ok) {
      window.alert(
        "Registration submitted. Your Bar Council enrolment verification starts as PENDING — no verified badge until review completes. Please sign in from the Login page."
      );
      window.location.href = "/login";
      return;
    }
    setError(res.error);
  };

  return (
    <div className="panel">
      <Link href="/login" className="ghost" style={{ textDecoration: "none" }}>
        ← Back
      </Link>
      <h1 style={{ marginTop: 12 }}>⚖️ Advocate Registration</h1>
      <p className="sub">Step {step + 1} of 3 — {STEPS[step]}</p>

      <div className="stepbar">
        {STEPS.map((label, i) => (
          <div key={label} className={`stepdot${i <= step ? " active" : ""}`}>
            <b>{i + 1}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={submit}>
        {step === 0 && (
          <>
            <label>Full legal name</label>
            <input placeholder="Name as per Bar Council roll" value={v.fullName} onChange={set("fullName")} required />
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" value={v.email} onChange={set("email")} required />
            <label>Mobile number</label>
            <input
              placeholder="10-digit mobile number"
              value={v.mobile}
              onChange={set("mobile")}
              inputMode="numeric"
              maxLength={10}
              required
            />
            <label>Password</label>
            <input type="password" placeholder="At least 8 characters" value={v.password} onChange={set("password")} minLength={8} required />
            <label>Confirm password</label>
            <input type="password" placeholder="Re-enter password" value={v.confirm} onChange={set("confirm")} minLength={8} required />
          </>
        )}

        {step === 1 && (
          <>
            <label>State Bar Council</label>
            <select value={v.barCouncil} onChange={set("barCouncil")} required>
              <option value="" disabled>
                Select your State Bar Council
              </option>
              {COUNCILS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <label>Bar Council enrolment number / Bar ID</label>
            <input placeholder="Enrolment number on the certificate" value={v.barId} onChange={set("barId")} required />
            <div className="rowcards" style={{ gap: 12 }}>
              <div>
                <label>Years of experience</label>
                <input placeholder="e.g. 6" value={v.experience} onChange={set("experience")} inputMode="numeric" />
              </div>
              <div>
                <label>Area of specialization</label>
                <select value={v.specialization} onChange={set("specialization")}>
                  <option value="">Select (optional)</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <label>Place of practice / Location</label>
            <input placeholder="City, State" value={v.location} onChange={set("location")} required />
            <div className="notice">
              Enrolment certificate upload and the official verification review
              (advocate-service Bar Council module) follow after account
              creation — Phase 4 of the master spec. Enrollment number format
              is validated server-side.
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontWeight: 400 }}>
              <input type="checkbox" checked={v.consent} onChange={(e) => setV((p) => ({ ...p, consent: e.target.checked }))} style={{ marginTop: 4 }} />
              <span>
                I consent to LEX SUPERMUS processing my professional details,
                reviewing my Bar Council credentials, and displaying my
                approved professional information. (Consent version 1.0 ·
                purpose: advocate enrolment verification workflow)
              </span>
            </label>
            <div className="notice">
              Registration does <b>not</b> confirm legal eligibility to
              practise. Verification status stays PENDING until authorized
              reviewers complete the Bar Council enrolment review.
            </div>
          </>
        )}

        {error && <div className="notice" style={{ borderColor: "#c0392b" }}>{error}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {step > 0 && (
            <button type="button" className="ghost" onClick={() => { setStep((s) => s - 1); setError(null); }}>
              ← Previous
            </button>
          )}
          {step < 2 ? (
            <button type="button" className="primary" onClick={next}>
              Next →
            </button>
          ) : (
            <button type="submit" className="primary" disabled={busy}>
              {busy ? "Submitting…" : "Submit Registration"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
