"use client";

import { useEffect, useState } from "react";
import {
  getSavedProfileKey,
  type ProfessionalRole,
} from "@/lib/professional-profile";

type ProfileField = {
  key: string;
  label: string;
};

const PROFILE_FIELDS: Record<ProfessionalRole, ProfileField[]> = {
  STUDENT: [
    { key: "fullName", label: "Full name" },
    { key: "dateOfBirth", label: "Date of birth" },
    { key: "email", label: "Email address" },
    { key: "phone", label: "Phone number" },
    { key: "institution", label: "Law school / university" },
    { key: "degree", label: "Degree / course" },
    { key: "yearOfStudy", label: "Year of study" },
    { key: "city", label: "City" },
  ],
  ADVOCATE: [
    { key: "fullName", label: "Full name" },
    { key: "dateOfBirth", label: "Date of birth" },
    { key: "email", label: "Email address" },
    { key: "phone", label: "Phone number" },
    { key: "stateBarCouncil", label: "State Bar Council" },
    { key: "barCouncilNumber", label: "Enrolment number" },
    { key: "practiceAreas", label: "Practice areas" },
    { key: "yearsOfExperience", label: "Years of experience" },
    { key: "city", label: "City" },
    { key: "verificationConsent", label: "Verification consent" },
  ],
};

function isProfileDetails(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((field) => typeof field === "string")
  );
}

function formatFieldValue(key: string, value: string): string {
  if (key === "verificationConsent") return value === "yes" ? "Confirmed" : "Not confirmed";
  if (key !== "dateOfBirth") return value;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function ProfessionalProfileDetails({ role }: { role: ProfessionalRole }) {
  const [details, setDetails] = useState<Record<string, string> | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const savedDetails = window.localStorage.getItem(getSavedProfileKey(role, "details"));
    if (!savedDetails) return;

    try {
      const parsed: unknown = JSON.parse(savedDetails);
      if (isProfileDetails(parsed)) {
        setDetails(parsed);
      } else {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    }
  }, [role]);

  return (
    <section className="item professional-profile-details" aria-labelledby="profile-details-title">
      <h2 id="profile-details-title">Your profile details</h2>
      {loadError ? (
        <p role="alert">Saved profile details could not be read. Please create your profile again.</p>
      ) : details ? (
        <dl className="profile-details-grid">
          {PROFILE_FIELDS[role].map(({ key, label }) => (
            <div className="profile-detail" key={key}>
              <dt>{label}</dt>
              <dd>{details[key] ? formatFieldValue(key, details[key]) : "Not provided"}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>Profile details are not available for this account yet. Create a profile to see them here.</p>
      )}
      <p className="profile-details-note">
        Passwords are never shown or saved. Profile details in this demo are stored only in this browser.
      </p>
    </section>
  );
}
