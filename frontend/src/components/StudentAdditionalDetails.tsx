"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import {
  isStudentEducationDetails,
  STUDENT_EDUCATION_STORAGE_KEY,
  type EducationEntry,
  type StudentEducationDetails,
} from "@/lib/student-resume";

const EMPTY_EDUCATION: EducationEntry = {
  institution: "",
  qualification: "",
  completionYear: "",
  score: "",
};

const EMPTY_DETAILS: StudentEducationDetails = {
  ssc: { ...EMPTY_EDUCATION },
  hsc: { ...EMPTY_EDUCATION },
  ug: { ...EMPTY_EDUCATION },
  pg: { ...EMPTY_EDUCATION },
  experience: {
    organization: "",
    role: "",
    duration: "",
    description: "",
  },
};

const EDUCATION_LEVELS = [
  { key: "ssc", title: "SSC (Class 10)", required: true },
  { key: "hsc", title: "HSC (Class 12)", required: true },
  { key: "ug", title: "Undergraduate (UG)", required: true },
  { key: "pg", title: "Postgraduate (PG)", required: false },
] as const;

function hasRequiredEducation(details: StudentEducationDetails): boolean {
  return (["ssc", "hsc", "ug"] as const).every((key) =>
    Object.values(details[key]).every((value) => value.trim().length > 0)
  );
}

function getField(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export default function StudentAdditionalDetails() {
  const [details, setDetails] = useState<StudentEducationDetails>(EMPTY_DETAILS);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [hasSaved, setHasSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    try {
      const savedDetails = window.localStorage.getItem(STUDENT_EDUCATION_STORAGE_KEY);
      if (savedDetails) {
        const parsed: unknown = JSON.parse(savedDetails);
        if (isStudentEducationDetails(parsed)) {
          setDetails(parsed);
          const complete = hasRequiredEducation(parsed);
          setHasSaved(complete);
          setIsEditing(!complete);
        } else {
          setError("Saved education details could not be read. Please enter and save them again.");
        }
      }
    } catch {
      setError("Education details could not be loaded from this browser.");
    } finally {
      setReady(true);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const educationDetails = (key: string): EducationEntry => ({
      institution: getField(formData, `${key}Institution`),
      qualification: getField(formData, `${key}Qualification`),
      completionYear: getField(formData, `${key}CompletionYear`),
      score: getField(formData, `${key}Score`),
    });
    const nextDetails: StudentEducationDetails = {
      ssc: educationDetails("ssc"),
      hsc: educationDetails("hsc"),
      ug: educationDetails("ug"),
      pg: educationDetails("pg"),
      experience: {
        organization: getField(formData, "experienceOrganization"),
        role: getField(formData, "experienceRole"),
        duration: getField(formData, "experienceDuration"),
        description: getField(formData, "experienceDescription"),
      },
    };

    try {
      window.localStorage.setItem(STUDENT_EDUCATION_STORAGE_KEY, JSON.stringify(nextDetails));
      setDetails(nextDetails);
      setError("");
      setHasSaved(true);
      setIsEditing(false);
    } catch {
      setError("Education details could not be saved in this browser. Please try again.");
    }
  }

  if (!ready) {
    return (
      <section className="item student-additional-details" aria-busy="true">
        <h2>Education &amp; experience</h2>
        <p>Loading your saved details…</p>
      </section>
    );
  }

  return (
    <section className="item student-additional-details">
      <div className="student-details-heading">
        <div>
          <h2>Education &amp; experience</h2>
          <p className="sub">
            SSC, HSC, and UG details are required. PG and work experience are optional.
          </p>
        </div>
        {!isEditing && (
          <div className="student-details-actions">
            <span className="student-details-success" role="status">✓ Saved</span>
            <button
              type="button"
              className="resume-secondary-button student-edit-button"
              aria-label="Edit education and experience details"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <Pencil size={15} aria-hidden="true" />
              Edit
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
      <form onSubmit={handleSubmit}>
        <div className="student-education-grid">
          {EDUCATION_LEVELS.map(({ key, title, required }) => (
            <fieldset className="student-details-section" key={key}>
              <legend>{title}{required ? " *" : " (optional)"}</legend>
              <label htmlFor={`${key}-institution`}>Institution name</label>
              <input
                id={`${key}-institution`}
                name={`${key}Institution`}
                defaultValue={details[key].institution}
                required={required}
              />
              <label htmlFor={`${key}-qualification`}>Board / degree / qualification</label>
              <input
                id={`${key}-qualification`}
                name={`${key}Qualification`}
                defaultValue={details[key].qualification}
                required={required}
              />
              <label htmlFor={`${key}-completion-year`}>Completion year</label>
              <input
                id={`${key}-completion-year`}
                name={`${key}CompletionYear`}
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                defaultValue={details[key].completionYear}
                required={required}
              />
              <label htmlFor={`${key}-score`}>Marks / CGPA</label>
              <input
                id={`${key}-score`}
                name={`${key}Score`}
                placeholder="e.g. 85% or 8.5 CGPA"
                defaultValue={details[key].score}
                required={required}
              />
            </fieldset>
          ))}
        </div>

        <fieldset className="student-details-section student-experience-section">
          <legend>Work experience (optional)</legend>
          <div className="student-experience-grid">
            <div>
              <label htmlFor="experience-organization">Organization</label>
              <input
                id="experience-organization"
                name="experienceOrganization"
                defaultValue={details.experience.organization}
              />
            </div>
            <div>
              <label htmlFor="experience-role">Role / position</label>
              <input
                id="experience-role"
                name="experienceRole"
                defaultValue={details.experience.role}
              />
            </div>
            <div>
              <label htmlFor="experience-duration">Duration</label>
              <input
                id="experience-duration"
                name="experienceDuration"
                placeholder="e.g. 6 months"
                defaultValue={details.experience.duration}
              />
            </div>
            <div>
              <label htmlFor="experience-description">Brief description</label>
              <textarea
                id="experience-description"
                name="experienceDescription"
                defaultValue={details.experience.description}
              />
            </div>
          </div>
        </fieldset>

        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="primary" type="submit">
          {hasSaved ? "Save changes" : "Save education & experience"}
        </button>
      </form>
      ) : (
        <dl className="student-saved-details">
          {EDUCATION_LEVELS.map(({ key, title }) => {
            const entry = details[key];
            const value = [
              entry.qualification,
              entry.institution,
              entry.completionYear,
              entry.score,
            ].filter(Boolean).join(" · ");
            return (
              <div key={key}>
                <dt>{title}</dt>
                <dd>{value || "Not added"}</dd>
              </div>
            );
          })}
          <div>
            <dt>Work experience</dt>
            <dd>
              {[
                details.experience.role,
                details.experience.organization,
                details.experience.duration,
                details.experience.description,
              ].filter(Boolean).join(" · ") || "Not added"}
            </dd>
          </div>
        </dl>
      )}
      <p className="profile-details-note">
        Demo only: these details are stored in this browser and are not sent to a server.
      </p>
    </section>
  );
}
