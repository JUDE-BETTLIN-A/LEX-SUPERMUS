"use client";

import { useState } from "react";
import PortalShell from "@/components/PortalShell";
import ProfessionalProfileDetails from "@/components/ProfessionalProfileDetails";
import StudentAdditionalDetails from "@/components/StudentAdditionalDetails";
import StudentResumeBuilder from "@/components/StudentResumeBuilder";

const TABS = [
  { key: "overview", label: "▦ Dashboard" },
  { key: "resume", label: "▤ Resume Builder" },
  { key: "jobs", label: "▣ Jobs & Internships" },
  { key: "career", label: "✦ Career AI" },
  { key: "applications", label: "☷ Applications" },
];

/**
 * Student portal — ported from the prototype's `studentTab()` function.
 * Each `m[...]` template literal becomes a branch below.
 */
export default function StudentPortal() {
  const [tab, setTab] = useState("overview");
  const demoAlert = (msg: string) => window.alert(msg);

  return (
    <PortalShell title="Student Portal" tabs={TABS} active={tab} onChange={setTab}>
      {tab === "overview" && (
        <>
          <h1>Student Dashboard</h1>
          <p className="sub">Welcome back. Continue building your legal career.</p>
          <div className="item">
            <b>Profile completion · 100%</b>
            <div className="progress">
              <span style={{ width: "100%" }} />
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              Saved opportunities<b>08</b>
            </div>
            <div className="stat">
              Applications<b>04</b>
            </div>
            <div className="stat">
              Skills tracked<b>12</b>
            </div>
          </div>
          <ProfessionalProfileDetails role="STUDENT" />
          <StudentAdditionalDetails />
          <div className="rowcards">
            <div className="item">
              <h3>Quick access</h3>
              <p>Resume builder · Explore jobs · Career AI</p>
            </div>
            <div className="item">
              <h3>Recommended next step</h3>
              <p>Complete your profile and add your latest academic details.</p>
            </div>
          </div>
        </>
      )}

      {tab === "resume" && (
        <StudentResumeBuilder onGoToDashboard={() => setTab("overview")} />
      )}

      {tab === "jobs" && (
        <>
          <h1>Jobs &amp; Internships</h1>
          <p className="sub">Illustrative opportunities — not live vacancies.</p>
          <div className="item">
            <h3>Legal Research Intern</h3>
            <p>Research, case summaries and drafting support · Chennai</p>
            <span className="pill">Sample listing</span>
          </div>
          <div className="item">
            <h3>Compliance Intern</h3>
            <p>Regulatory research and documentation · Hybrid</p>
            <span className="pill">Sample listing</span>
          </div>
        </>
      )}

      {tab === "career" && (
        <>
          <h1>Career AI</h1>
          <p className="sub">Explore legal career pathways and skill development.</p>
          <textarea placeholder="Describe your interests, skills and career goals…" />
          <button
            className="primary"
            onClick={() => demoAlert("Demo: career roadmap preview.")}
          >
            Suggest a career roadmap
          </button>
        </>
      )}

      {tab === "applications" && (
        <>
          <h1>My Applications</h1>
          <div className="item">
            Legal Research Intern <span className="pill">Draft</span>
          </div>
          <div className="item">
            Compliance Intern <span className="pill">Submitted · Demo</span>
          </div>
        </>
      )}
    </PortalShell>
  );
}
