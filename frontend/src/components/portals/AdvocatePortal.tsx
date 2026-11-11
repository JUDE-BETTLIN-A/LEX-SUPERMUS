"use client";

import { useState } from "react";
import PortalShell from "@/components/PortalShell";

const TABS = [
  { key: "overview", label: "▦ Dashboard" },
  { key: "verification", label: "✓ Bar Council Verification" },
  { key: "matters", label: "▤ Matters & Documents" },
  { key: "appointments", label: "▣ Appointments" },
];

/**
 * Advocate portal — ported from the prototype's `advTab()` function.
 * The "Bar Council Verification" tab mirrors the review workflow described in
 * docs/LEX_SUPERMUS_Advocate_Bar_Council_Verification_Module.pdf.
 * (Submission is demo-only in the UI; the real workflow lives in
 * services/advocate-service.)
 */
export default function AdvocatePortal() {
  const [tab, setTab] = useState("overview");

  return (
    <PortalShell title="Advocate Portal" tabs={TABS} active={tab} onChange={setTab}>
      {tab === "overview" && (
        <>
          <h1>Advocate Dashboard</h1>
          <p className="sub">Professional workspace and verification overview.</p>
          <div className="notice">
            Verification is a review workflow. This prototype does not verify
            enrolment with any Bar Council.
          </div>
          <div className="stats">
            <div className="stat">
              Profile status<b>In progress</b>
            </div>
            <div className="stat">
              Open matters<b>03</b>
            </div>
            <div className="stat">
              Appointments<b>02</b>
            </div>
          </div>
          <button className="primary" onClick={() => setTab("verification")}>
            Continue verification →
          </button>
        </>
      )}

      {tab === "verification" && (
        <>
          <h1>Bar Council Verification</h1>
          <p className="sub">Submit details for authorised review.</p>
          <div className="stats">
            <div className="stat">
              1 · Personal<b>Details</b>
            </div>
            <div className="stat">
              2 · Enrolment<b>Information</b>
            </div>
            <div className="stat">
              3 · Review<b>Pending</b>
            </div>
          </div>
          <label>Full legal name</label>
          <input placeholder="As shown in enrolment records" />
          <label>State Bar Council</label>
          <select defaultValue="Select council">
            <option>Select council</option>
            <option>Bar Council of Tamil Nadu and Puducherry</option>
            <option>Other State Bar Council</option>
          </select>
          <label>Enrolment number</label>
          <input placeholder="Enter enrolment number" />
          <label>Supporting document</label>
          <input type="file" />
          <button
            className="primary"
            onClick={() =>
              window.alert(
                "Demo only: submission captured locally; no real verification is performed."
              )
            }
          >
            Submit for review
          </button>
          <div className="notice">
            Status: Not submitted · No external verification performed.
          </div>
        </>
      )}

      {tab === "matters" && (
        <>
          <h1>Matters &amp; Documents</h1>
          <div className="item">
            <h3>Matter workspace</h3>
            <p>Organise matter notes and securely managed documents.</p>
            <span className="pill">Demo workspace</span>
          </div>
        </>
      )}

      {tab === "appointments" && (
        <>
          <h1>Appointments</h1>
          <div className="item">
            <h3>Consultation calendar</h3>
            <p>No connected calendar in this prototype.</p>
          </div>
        </>
      )}
    </PortalShell>
  );
}
