"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import PortalShell from "@/components/PortalShell";

type MeetingMode = "IN_PERSON" | "ONLINE";

const TABS = [
  { key: "overview", label: "Dashboard" },
  { key: "consultation", label: "Request a consultation" },
  { key: "lawyers", label: "Find a lawyer" },
  { key: "assistant", label: "Organise an issue" },
  { key: "documents", label: "Documents" },
];

export default function ClientPortal() {
  const [tab, setTab] = useState("overview");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("IN_PERSON");
  const [requestNotice, setRequestNotice] = useState("");

  function handleConsultationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setMeetingMode("IN_PERSON");
    setRequestNotice(
      "Demo only: your request was checked in this browser and cleared. It was not sent or saved.",
    );
  }

  return (
    <PortalShell title="Client Portal" tabs={TABS} active={tab} onChange={setTab}>
      {tab === "overview" && (
        <div className="client-overview">
          <div className="client-welcome">
            <p className="sectionKicker">Client portal</p>
            <h1>Legal support, made easier</h1>
            <p className="sub">
              Explore advocate profiles, prepare for a consultation, and keep
              your next steps organised.
            </p>
          </div>
          <div className="notice" role="note">
            This is a public demo. Account, advocate search, consultation, and
            document services are not connected. Do not enter real or sensitive
            information.
          </div>
          <div className="client-actions">
            <button
              className="primary"
              onClick={() => {
                setRequestNotice("");
                setTab("consultation");
              }}
            >
              Request a consultation
            </button>
            <button className="client-secondary-action" onClick={() => setTab("lawyers")}>
              Browse advocate profiles
            </button>
          </div>
          <div className="client-steps">
            <article className="item">
              <span className="client-step-number">01</span>
              <h3>Describe what you need</h3>
              <p>Outline your issue and preferred meeting format.</p>
            </article>
            <article className="item">
              <span className="client-step-number">02</span>
              <h3>Explore your options</h3>
              <p>Review sample advocate profiles and legal resources.</p>
            </article>
            <article className="item">
              <span className="client-step-number">03</span>
              <h3>Discuss next steps</h3>
              <p>In a live service, an advocate would follow up with you.</p>
            </article>
          </div>
          <p className="client-account-link">
            Need an account?{" "}
            <Link href="/client/access">Sign in or create one</Link>
          </p>
        </div>
      )}

      {tab === "consultation" && (
        <>
          <h1>Request a consultation</h1>
          <p className="sub">
            Tell us how you would prefer to meet and briefly describe the issue.
          </p>
          <div className="notice" role="note">
            Demo form only. Do not include confidential, urgent, or highly
            sensitive details. Nothing you enter is saved or sent.
          </div>
          <form className="client-request-form" onSubmit={handleConsultationSubmit}>
            <div className="client-form-grid">
              <div>
                <label htmlFor="meeting-mode">Meeting mode</label>
                <select
                  id="meeting-mode"
                  name="meetingMode"
                  value={meetingMode}
                  onChange={(event) =>
                    setMeetingMode(
                      event.target.value === "ONLINE" ? "ONLINE" : "IN_PERSON",
                    )
                  }
                  required
                >
                  <option value="IN_PERSON">In person</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>
              <div>
                <label htmlFor="meeting-location">
                  {meetingMode === "IN_PERSON"
                    ? "Preferred meeting location"
                    : "Your city or time zone"}
                </label>
                <input
                  id="meeting-location"
                  name="location"
                  autoComplete="address-level2"
                  required
                  placeholder={
                    meetingMode === "IN_PERSON"
                      ? "City or preferred venue"
                      : "City and time zone"
                  }
                />
              </div>
              <div className="client-form-field--full">
                <label htmlFor="legal-issue">Reason for consultation</label>
                <textarea
                  id="legal-issue"
                  name="reason"
                  rows={5}
                  maxLength={2000}
                  required
                  placeholder="Briefly describe the legal issue or question (up to 2,000 characters)."
                />
              </div>
            </div>
            {requestNotice && (
              <div className="notice" role="status">
                {requestNotice}
              </div>
            )}
            <div className="client-form-actions">
              <button type="submit" className="primary">
                Review demo request
              </button>
              <button
                type="button"
                className="client-secondary-action"
                onClick={() => {
                  setRequestNotice("");
                  setTab("overview");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      {tab === "lawyers" && (
        <>
          <h1>Explore advocate profiles</h1>
          <p className="sub">
            Sample profiles are shown for layout demonstration only.
          </p>
          <div className="notice" role="note">
            Profiles are illustrative and are not verified or available for
            booking in this demo.
          </div>
          <div className="rowcards">
            <article className="item">
              <h3>Adv. Priya Sharma</h3>
              <p>Family law · Chennai</p>
              <span className="pill">Illustrative profile</span>
            </article>
            <article className="item">
              <h3>Adv. Arjun Menon</h3>
              <p>Corporate law · Chennai</p>
              <span className="pill">Illustrative profile</span>
            </article>
          </div>
        </>
      )}

      {tab === "assistant" && (
        <>
          <h1>Organise a legal issue</h1>
          <p className="sub">
            Use this space to prepare questions for a qualified advocate.
          </p>
          <div className="notice" role="note">
            This demo does not analyse or save your text. Avoid adding personal
            or confidential details.
          </div>
          <textarea
            aria-label="Brief description of a legal issue"
            placeholder="Write a brief, general description…"
          />
          <button
            className="primary"
            onClick={() =>
              window.alert(
                "This demo does not process or save your text. Please consult a qualified advocate.",
              )
            }
          >
            Organise my issue
          </button>
        </>
      )}

      {tab === "documents" && (
        <>
          <h1>Documents</h1>
          <p className="sub">
            Secure document sharing will be available when the client service is
            connected.
          </p>
          <div className="notice" role="note">
            Uploads are disabled in this demo. Do not select or share confidential
            documents here.
          </div>
        </>
      )}
    </PortalShell>
  );
}
