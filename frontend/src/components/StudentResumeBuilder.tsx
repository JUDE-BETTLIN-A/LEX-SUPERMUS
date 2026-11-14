"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { getSavedProfileKey } from "@/lib/professional-profile";
import {
  isStudentEducationDetails,
  STUDENT_EDUCATION_STORAGE_KEY,
  type EducationEntry,
  type StudentEducationDetails,
} from "@/lib/student-resume";
import ResumeTemplatePicker from "@/components/ResumeTemplatePicker";
import ResumeDownloadControl from "@/components/ResumeDownloadControl";
import {
  downloadResumeDocx,
  downloadResumePdf,
  RESUME_TEMPLATES,
  type ResumeDocumentData,
  type ResumeTemplateId,
} from "@/lib/resume-export";

type ResumeContent = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  targetRole: string;
  portfolio: string;
  summary: string;
  skills: string;
  internships: string;
  projects: string;
  certifications: string;
  achievements: string;
  volunteering: string;
  languages: string;
};

type ResumeDraft = {
  template: ResumeTemplateId;
  content: ResumeContent;
};

const RESUME_DRAFT_KEY = "lex-supermus-student-resume-draft";

const EMPTY_CONTENT: ResumeContent = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  targetRole: "",
  portfolio: "",
  summary: "",
  skills: "",
  internships: "",
  projects: "",
  certifications: "",
  achievements: "",
  volunteering: "",
  languages: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isResumeTemplate(value: unknown): value is ResumeTemplateId {
  return RESUME_TEMPLATES.some((item) => item.id === value);
}

function isResumeContent(value: unknown): value is ResumeContent {
  return (
    isRecord(value) &&
    Object.keys(EMPTY_CONTENT).every((key) => typeof value[key] === "string")
  );
}

function isResumeDraft(value: unknown): value is ResumeDraft {
  return isRecord(value) && isResumeTemplate(value.template) && isResumeContent(value.content);
}

function getTextLines(value: string, splitCommas: boolean): string[] {
  return value
    .split(splitCommas ? /\r?\n|,/ : /\r?\n/)
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
}

function ResumeText({ value, splitCommas = false }: { value: string; splitCommas?: boolean }) {
  const lines = getTextLines(value, splitCommas);
  if (lines.length === 0) return null;
  if (lines.length === 1) return <p>{lines[0]}</p>;
  return (
    <ul>
      {lines.map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
    </ul>
  );
}

function hasEducationDetails(education: StudentEducationDetails | null): boolean {
  if (!education) return false;
  return (["ssc", "hsc", "ug"] as const).every((key) => {
    const entry = education[key];
    return Object.values(entry).every((value) => value.trim().length > 0);
  });
}

export default function StudentResumeBuilder({
  onGoToDashboard,
}: {
  onGoToDashboard: () => void;
}) {
  const [content, setContent] = useState<ResumeContent>(EMPTY_CONTENT);
  const [education, setEducation] = useState<StudentEducationDetails | null>(null);
  const [template, setTemplate] = useState<ResumeTemplateId>("classic");
  const [ready, setReady] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let profileContent: Partial<ResumeContent> = {};

    try {
      const profileDetailsRaw = window.localStorage.getItem(
        getSavedProfileKey("STUDENT", "details")
      );
      if (profileDetailsRaw) {
        const profileDetails: unknown = JSON.parse(profileDetailsRaw);
        if (isRecord(profileDetails)) {
          profileContent = {
            fullName: typeof profileDetails.fullName === "string" ? profileDetails.fullName : "",
            email: typeof profileDetails.email === "string" ? profileDetails.email : "",
            phone: typeof profileDetails.phone === "string" ? profileDetails.phone : "",
            city: typeof profileDetails.city === "string" ? profileDetails.city : "",
          };
        }
      } else {
        profileContent.fullName = window.localStorage.getItem("lex-supermus-user-name") ?? "";
      }

      const educationRaw = window.localStorage.getItem(STUDENT_EDUCATION_STORAGE_KEY);
      if (educationRaw) {
        const parsedEducation: unknown = JSON.parse(educationRaw);
        if (isStudentEducationDetails(parsedEducation)) {
          setEducation(parsedEducation);
        } else {
          setError("Saved education details could not be read. Update them on the Dashboard.");
        }
      }

      const draftRaw = window.localStorage.getItem(RESUME_DRAFT_KEY);
      if (draftRaw) {
        const parsedDraft: unknown = JSON.parse(draftRaw);
        if (isResumeDraft(parsedDraft)) {
          setContent(parsedDraft.content);
          setTemplate(parsedDraft.template);
        } else {
          setError("Saved resume details could not be read. Please enter and save them again.");
          setContent({ ...EMPTY_CONTENT, ...profileContent });
        }
      } else {
        setContent({ ...EMPTY_CONTENT, ...profileContent });
      }
    } catch {
      setError("Some saved details could not be loaded from this browser.");
      setContent({ ...EMPTY_CONTENT, ...profileContent });
    } finally {
      setReady(true);
    }
  }, []);

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    setContent((current) => ({ ...current, [name]: value }));
    setSaved(false);
    setPreviewVisible(false);
    setExportMessage("");
  }

  function saveDraft(): boolean {
    const draft: ResumeDraft = { template, content };
    try {
      window.localStorage.setItem(RESUME_DRAFT_KEY, JSON.stringify(draft));
      setSaved(true);
      setError("");
      return true;
    } catch {
      setSaved(false);
      setError("Resume details could not be saved in this browser. Please try again.");
      return false;
    }
  }

  function handleBuildResume() {
    if (!hasEducationDetails(education)) {
      setError("First add and save your SSC, HSC, and UG details on the student Dashboard.");
      return;
    }
    if (!content.fullName.trim() || !content.email.trim()) {
      setError("Add your name and email address to your resume contact details.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email.trim())) {
      setError("Enter a valid email address for your resume contact details.");
      return;
    }
    if (!content.targetRole.trim() || !content.summary.trim() || !content.skills.trim()) {
      setError("Add a target role, professional summary, and skills before building your resume.");
      return;
    }
    if (!saveDraft()) return;
    setPreviewVisible(true);
  }

  function getResumeDocumentData(): ResumeDocumentData {
    const experience = education?.experience;
    const experienceEntries = experience
      ? [
          [experience.role, experience.organization].filter(Boolean).join(" | "),
          experience.duration,
          ...getTextLines(experience.description, false).map((line) => `- ${line}`),
        ].filter(Boolean)
      : [];
    const sections = [
      { heading: "Professional Summary", entries: [content.summary] },
      { heading: "Skills", entries: getTextLines(content.skills, true), bullets: true },
      { heading: "Work Experience", entries: experienceEntries },
      {
        heading: "Internships & Legal Experience",
        entries: getTextLines(content.internships, false),
        bullets: true,
      },
      {
        heading: "Education",
        entries: educationEntries.map(({ label, entry }) =>
          [entry.qualification || label, entry.institution, entry.completionYear, entry.score]
            .filter(Boolean)
            .join(" | ")
        ),
      },
      { heading: "Projects & Publications", entries: getTextLines(content.projects, false), bullets: true },
      { heading: "Certifications & Courses", entries: getTextLines(content.certifications, false), bullets: true },
      { heading: "Awards & Achievements", entries: getTextLines(content.achievements, false), bullets: true },
      { heading: "Leadership & Volunteering", entries: getTextLines(content.volunteering, false), bullets: true },
      { heading: "Languages", entries: getTextLines(content.languages, true) },
    ];

    return {
      fullName: content.fullName,
      headline: content.targetRole,
      contactInfo: [content.email, content.phone, content.city, content.portfolio].filter(Boolean),
      sections: sections.filter((section) => section.entries.length > 0),
    };
  }

  async function handleDownload(format: "pdf" | "docx") {
    try {
      if (format === "pdf") {
        downloadResumePdf(getResumeDocumentData(), template);
        setExportMessage("PDF downloaded.");
      } else {
        await downloadResumeDocx(getResumeDocumentData(), template);
        setExportMessage("Word document downloaded.");
      }
    } catch {
      setExportMessage(`The ${format === "pdf" ? "PDF" : "Word document"} could not be created. Please try again.`);
    }
  }

  const educationEntries: { label: string; entry: EducationEntry }[] = education
    ? [
        { label: "Postgraduate (PG)", entry: education.pg },
        { label: "Undergraduate (UG)", entry: education.ug },
        { label: "HSC (Class 12)", entry: education.hsc },
        { label: "SSC (Class 10)", entry: education.ssc },
      ]
        .filter(({ entry }) => entry.institution.trim() || entry.qualification.trim())
        .sort(
          (left, right) =>
            Number(right.entry.completionYear) - Number(left.entry.completionYear)
        )
    : [];

  if (!ready) {
    return (
      <>
        <h1>ATS-Friendly Resume Builder</h1>
        <p className="sub">Loading your saved student profile…</p>
      </>
    );
  }

  return (
    <div className="resume-builder">
      <h1>ATS-Friendly Resume Builder</h1>
      <p className="sub">
        Choose a professional template, add your details, and preview your resume.
      </p>

      <p className="resume-builder-note">Clean, single-column layouts designed for ATS readability.</p>

      {!hasEducationDetails(education) && (
        <div className="notice">
          Save your required SSC, HSC, and UG details on the Dashboard before building your resume.
          <div>
            <button type="button" className="resume-secondary-button" onClick={onGoToDashboard}>
              Go to education details
            </button>
          </div>
        </div>
      )}

      <ResumeTemplatePicker
        template={template}
        onChange={(nextTemplate) => {
          setTemplate(nextTemplate);
          setSaved(false);
          setPreviewVisible(false);
          setExportMessage("");
        }}
      />

      <section className="resume-builder-section" aria-labelledby="resume-details-heading">
        <h2 id="resume-details-heading">2. Add your resume details</h2>
        <p className="resume-help">
          Fields with * are needed to build a resume. Keep every statement accurate and specific.
        </p>

        <div className="resume-fields-grid">
          <div>
            <label htmlFor="resume-full-name">Full name *</label>
            <input id="resume-full-name" name="fullName" value={content.fullName} onChange={updateField} required />
          </div>
          <div>
            <label htmlFor="resume-email">Email address *</label>
            <input id="resume-email" name="email" type="email" value={content.email} onChange={updateField} required />
          </div>
          <div>
            <label htmlFor="resume-phone">Phone number</label>
            <input id="resume-phone" name="phone" type="tel" value={content.phone} onChange={updateField} />
          </div>
          <div>
            <label htmlFor="resume-city">City</label>
            <input id="resume-city" name="city" value={content.city} onChange={updateField} />
          </div>
          <div>
            <label htmlFor="resume-target-role">Target role / practice area *</label>
            <input
              id="resume-target-role"
              name="targetRole"
              value={content.targetRole}
              onChange={updateField}
              placeholder="e.g. Legal Research Intern"
              required
            />
          </div>
          <div className="resume-field-full">
            <label htmlFor="resume-portfolio">Portfolio / writing sample link (optional)</label>
            <input id="resume-portfolio" name="portfolio" type="url" value={content.portfolio} onChange={updateField} placeholder="https://" />
          </div>
          <div className="resume-field-full">
            <label htmlFor="resume-summary">Professional summary *</label>
            <textarea
              id="resume-summary"
              name="summary"
              value={content.summary}
              onChange={updateField}
              placeholder="Write 2–4 concise sentences about your legal education, relevant strengths, interests, and target role. Avoid unsupported claims."
              required
            />
          </div>
          <div className="resume-field-full">
            <label htmlFor="resume-skills">Legal and professional skills *</label>
            <textarea
              id="resume-skills"
              name="skills"
              value={content.skills}
              onChange={updateField}
              placeholder="Add truthful skills, separated by commas or one per line (e.g. legal research, case analysis, drafting, client communication)."
              required
            />
          </div>
          <details className="resume-optional-section resume-field-full">
            <summary>
              Additional sections (optional)
              {[
                content.internships,
                content.projects,
                content.certifications,
                content.achievements,
                content.volunteering,
                content.languages,
              ].some((value) => value.trim()) && <span> · saved details</span>}
            </summary>
            <div className="resume-fields-grid">
              <div className="resume-field-full">
                <label htmlFor="resume-internships">Internships, clinics, or moots</label>
                <textarea id="resume-internships" name="internships" value={content.internships} onChange={updateField} placeholder="Add one experience per line: role / organization / dates / your contribution or outcome." />
              </div>
              <div className="resume-field-full">
                <label htmlFor="resume-projects">Projects, research, or publications</label>
                <textarea id="resume-projects" name="projects" value={content.projects} onChange={updateField} placeholder="Add the title, your contribution, and any relevant result or link." />
              </div>
              <div>
                <label htmlFor="resume-certifications">Certifications / courses</label>
                <textarea id="resume-certifications" name="certifications" value={content.certifications} onChange={updateField} />
              </div>
              <div>
                <label htmlFor="resume-achievements">Awards / achievements</label>
                <textarea id="resume-achievements" name="achievements" value={content.achievements} onChange={updateField} />
              </div>
              <div>
                <label htmlFor="resume-volunteering">Leadership / volunteering</label>
                <textarea id="resume-volunteering" name="volunteering" value={content.volunteering} onChange={updateField} />
              </div>
              <div>
                <label htmlFor="resume-languages">Languages</label>
                <textarea id="resume-languages" name="languages" value={content.languages} onChange={updateField} placeholder="e.g. English (fluent), Tamil (native)" />
              </div>
            </div>
          </details>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}
        {saved && <p className="student-details-success" role="status">✓ Saved in this browser</p>}
        {exportMessage && <p className="student-details-success" role="status">{exportMessage}</p>}
        <div className="resume-actions">
          <button type="button" className="resume-secondary-button" onClick={saveDraft}>
            Save details
          </button>
          <button type="button" className="primary" onClick={handleBuildResume}>
            Save &amp; build resume preview
          </button>
        </div>
        <p className="resume-storage-note">Resume drafts are saved in this browser.</p>
      </section>

      {previewVisible && education && (
        <section className="resume-preview-section" aria-labelledby="resume-preview-heading">
          <div className="resume-preview-toolbar">
            <div>
              <h2 id="resume-preview-heading">3. Resume preview · {RESUME_TEMPLATES.find((item) => item.id === template)?.name}</h2>
              <p>Review every detail for accuracy before downloading.</p>
            </div>
            <ResumeDownloadControl onDownload={handleDownload} />
          </div>

          <article className={`resume-preview resume-preview--${template}`}>
            <div className="resume-preview-header">
              <h1>{content.fullName}</h1>
              <p className="resume-target-role">{content.targetRole}</p>
              <p className="resume-contact-line">
                {[content.email, content.phone, content.city, content.portfolio]
                  .filter(Boolean)
                  .join(" | ")}
              </p>
            </div>

            <section>
              <h2>Professional Summary</h2>
              <p>{content.summary}</p>
            </section>
            <section>
              <h2>Skills</h2>
              <ResumeText value={content.skills} splitCommas />
            </section>

            {education.experience.organization || education.experience.role || education.experience.description ? (
              <section>
                <h2>Work Experience</h2>
                <h3>{[education.experience.role, education.experience.organization].filter(Boolean).join(" · ")}</h3>
                {education.experience.duration && <p>{education.experience.duration}</p>}
                <ResumeText value={education.experience.description} />
              </section>
            ) : null}

            {content.internships.trim() && (
              <section>
                <h2>Internships &amp; Legal Experience</h2>
                <ResumeText value={content.internships} />
              </section>
            )}

            <section>
              <h2>Education</h2>
              {educationEntries.map(({ label, entry }) => (
                <div className="resume-education-entry" key={label}>
                  <h3>{entry.qualification || label}</h3>
                  <p>
                    {[entry.institution, entry.completionYear, entry.score]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                </div>
              ))}
            </section>

            {content.projects.trim() && <section><h2>Projects &amp; Publications</h2><ResumeText value={content.projects} /></section>}
            {content.certifications.trim() && <section><h2>Certifications &amp; Courses</h2><ResumeText value={content.certifications} /></section>}
            {content.achievements.trim() && <section><h2>Awards &amp; Achievements</h2><ResumeText value={content.achievements} /></section>}
            {content.volunteering.trim() && <section><h2>Leadership &amp; Volunteering</h2><ResumeText value={content.volunteering} /></section>}
            {content.languages.trim() && <section><h2>Languages</h2><ResumeText value={content.languages} splitCommas /></section>}
          </article>
        </section>
      )}
    </div>
  );
}
