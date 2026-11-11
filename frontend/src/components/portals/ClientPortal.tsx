"use client";

import { useState } from "react";
import PortalShell from "@/components/PortalShell";

const TABS = [
  { key: "overview", label: "▦ Dashboard" },
  { key: "lawyers", label: "⚖ Find a Lawyer" },
  { key: "assistant", label: "✦ Legal Issue Assistant" },
  { key: "documents", label: "▤ My Documents" },
];

/**
 * Client portal — ported from the prototype's `clientTab()` function.
 */
export default function ClientPortal() {
  const [tab, setTab] = useState("overview");

  return (
    <PortalShell title="Client Portal" tabs={TABS} active={tab} onChange={setTab}>
      {tab === "overview" && (
        <>
          <h1>Client Dashboard</h1>
          <p className="sub">
            Find legal support and organise your consultations.
          </p>
          <div className="stats">
            <div className="stat">
              Consultation requests<b>01</b>
            </div>
            <div className="stat">
              Saved advocates<b>02</b>
            </div>
            <div className="stat">
              Documents<b>03</b>
            </div>
          </div>
          <button className="primary" onClick={() => setTab("lawyers")}>
            Find a lawyer →
          </button>
        </>
      )}

      {tab === "lawyers" && (
        <>
          <h1>Find the Right Legal Support</h1>
          <p className="sub">
            Search and filter advocate profiles. Sample profiles only.
          </p>
          <input placeholder="Search by legal issue or location" />
          <div className="rowcards">
            <div className="item">
              <h3>Adv. Priya Sharma</h3>
              <p>Family law · Chennai</p>
              <span className="pill">Illustrative profile</span>
            </div>
            <div className="item">
              <h3>Adv. Arjun Menon</h3>
              <p>Corporate law · Chennai</p>
              <span className="pill">Illustrative profile</span>
            </div>
          </div>
        </>
      )}

      {tab === "assistant" && (
        <>
          <h1>Legal Issue Assistant</h1>
          <p className="sub">
            Describe your issue to organise the questions you may wish to
            discuss with an advocate.
          </p>
          <textarea placeholder="Briefly describe your legal concern…" />
          <button
            className="primary"
            onClick={() =>
              window.alert(
                "Demo: issue summary generated. Please consult a qualified advocate."
              )
            }
          >
            Organise my issue
          </button>
        </>
      )}

      {tab === "documents" && (
        <>
          <h1>My Documents</h1>
          <p className="sub">Private document area concept.</p>
          <input type="file" multiple />
          <div className="notice">
            File storage and access controls are not connected in this
            prototype.
          </div>
        </>
      )}
    </PortalShell>
  );
}
