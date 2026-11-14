"use client";

import { useState } from "react";
import Link from "next/link";
import { registerStudent } from "@/lib/authApi";

type Values = {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirm: string;
  course: string;
  college: string;
  cgpa: string;
  passedOutYear: string;
  yearsOfStudy: string;
  consent: boolean;
};

const INITIAL: Values = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirm: "",
  course: "",
  college: "",
  cgpa: "",
  passedOutYear: "",
  yearsOfStudy: "",
  consent: false,
};

const COURSES = [
  "3-Year LL.B",
  "5-Year B.A. LL.B",
  "5-Year B.B.A. LL.B",
  "5-Year B.Com. LL.B",
  "LL.M",
  "Other recognised law programme",
];

const STEPS = ["Personal", "Academic", "Consent"];

/**
 * Student registration — multi-step (master spec Part 4) — JUDE-BETTLIN branch.
 * Step 1 personal → Step 2 academic (course, college, CGPA, passed-out year,
 * years of study) → Step 3 consent. Document upload and institution database
 * selection arrive with Phase 3 (student verification).
 */
export default function StudentRegistrationForm() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Values>(INITIAL);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setV((prev) => ({ ...prev, [key]: e.target.value }));

  const validateStep = (): string | null => {
    if (step === 0) {
      if (v.fullName.trim().length < 3) return "Enter your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return "Enter a valid email address.";
      if (!/^\d{10}$/.test(v.mobile.replace(/\D/g, ""))) return "Mobile number must be 10 digits.";
      if (v.password.length < 8) return "Password must be at least 8 characters.";
      if (v.password !== v.confirm) return "Passwords do not match.";
    }
    if (step === 1) {
      if (!v.course) return "Select your course.";
      if (v.college.trim().length < 3) return "Enter your college / university name.";
      const cgpa = Number(v.cgpa);
      if (!v.cgpa || Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) return "CGPA must be between 0 and 10.";
      const year = Number(v.passedOutYear);
      const now = new Date().getFullYear();
      if (!v.passedOutYear || Number.isNaN(year) || year < 1990 || year > now + 6)
        return `Year of passed out must be between 1990 and ${now + 6}.`;
      const yos = Number(v.yearsOfStudy);
      if (!v.yearsOfStudy || Number.isNaN(yos) || yos < 1 || yos > 6)
        return "Years of study must be between 1 and 6.";
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
    const res = await registerStudent({
      fullName: v.fullName.trim(),
      email: v.email.trim(),
      mobileNumber: v.mobile.replace(/\D/g, ""),
      password: v.password,
      course: v.course,
      collegeName: v.college.trim(),
      cgpa: Number(v.cgpa),
      passedOutYear: Number(v.passedOutYear),
      yearsOfStudy: Number(v.yearsOfStudy),
    });
    setBusy(false);

    if (res.ok) {
      window.alert(
        "Registration submitted. Please sign in from the Login page. Note: account starts unverified — no verified badge until review completes."
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
      <h1 style={{ marginTop: 12 }}>🎓 Student Registration</h1>
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
            <label>Full name</label>
            <input placeholder="Enter your full name" value={v.fullName} onChange={set("fullName")} required />
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
            <label>Course</label>
            <select value={v.course} onChange={set("course")} required>
              <option value="" disabled>
                Select your course
              </option>
              {COURSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <label>College / University</label>
            <input placeholder="College or university name" value={v.college} onChange={set("college")} required />
            <div className="rowcards" style={{ gap: 12 }}>
              <div>
                <label>CGPA (out of 10)</label>
                <input placeholder="e.g. 8.2" value={v.cgpa} onChange={set("cgpa")} inputMode="decimal" required />
              </div>
              <div>
                <label>Year of passed out</label>
                <input placeholder="e.g. 2027" value={v.passedOutYear} onChange={set("passedOutYear")} inputMode="numeric" maxLength={4} required />
              </div>
            </div>
            <label>Years of study completed</label>
            <input placeholder="e.g. 3" value={v.yearsOfStudy} onChange={set("yearsOfStudy")} inputMode="numeric" maxLength={1} required />
            <div className="notice">
              Academic document upload (college ID / bonafide / marksheet) and
              institution database selection come with Phase 3 of the master
              spec.
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontWeight: 400 }}>
              <input type="checkbox" checked={v.consent} onChange={(e) => setV((p) => ({ ...p, consent: e.target.checked }))} style={{ marginTop: 4 }} />
              <span>
                I consent to LEX SUPERMUS processing my registration
                information, reviewing my academic records for verification,
                and displaying my approved profile information. (Consent
                version 1.0 · purpose: student verification workflow)
              </span>
            </label>
            <div className="notice">
              Please independently verify legal information on this platform.
              Accounts start <b>unverified</b>; the verified badge appears only
              after review completes.
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
