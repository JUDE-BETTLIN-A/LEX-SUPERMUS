"use client";

import { useState } from "react";
import PortalShell from "@/components/PortalShell";

const TABS = [
  { key: "overview", label: "▦ Overview" },
  { key: "queue", label: "✓ Verification Queue" },
  { key: "users", label: "♙ User Management" },
  { key: "content", label: "▤ Content Management" },
];

/**
 * Admin console — ported from the prototype's `adminTab()` function.
 * The verification queue reviews advocate submissions produced by
 * services/advocate-service (Bar Council verification workflow).
 */
export default function AdminPortal() {
  const [tab, setTab] = useState("overview");

  return (
    <PortalShell title="Admin Console" tabs={TABS} active={tab} onChange={setTab}>
      {tab === "overview" && (
        <>
          <h1>Admin Dashboard</h1>
          <p className="sub">Illustrative platform operations overview.</p>
          <div className="stats">
            <div className="stat">
              Registered accounts<b>—</b>
            </div>
            <div className="stat">
              Verification queue<b>—</b>
            </div>
            <div className="stat">
              Content records<b>—</b>
            </div>
          </div>
          <div className="notice">
            No production data is connected. Admin actions are demonstrations
            only.
          </div>
        </>
      )}

      {tab === "queue" && (
        <>
          <h1>Advocate Verification Queue</h1>
          <div className="item">
            <b>Sample application A</b>
            <p>State Council · Pending review</p>
            <button
              className="primary"
              onClick={() => window.alert("Demo review only. No status changed.")}
            >
              Review
            </button>
          </div>
        </>
      )}

      {tab === "users" && (
        <>
          <h1>User Management</h1>
          <p className="sub">Role-based access management interface concept.</p>
          <div className="item">Student · Advocate · Client · Reviewer</div>
        </>
      )}

      {tab === "content" && (
        <>
          <h1>Content Management</h1>
          <p className="sub">
            Manage statutes, judgments, source metadata and version history.
          </p>
          <div className="item">Legal library ingestion and review queue</div>
        </>
      )}
    </PortalShell>
  );
}
