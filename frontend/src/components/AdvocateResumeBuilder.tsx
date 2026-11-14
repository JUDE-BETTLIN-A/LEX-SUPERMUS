"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import ResumeTemplatePicker, {
  getResumeTemplateDisplayName,
} from "@/components/ResumeTemplatePicker";
import ResumeDownloadControl from "@/components/ResumeDownloadControl";
import { getSavedProfileKey } from "@/lib/professional-profile";
import {
  downloadResumeDocx,
  downloadResumePdf,
  RESUME_TEMPLATES,
  type ResumeDocumentData,
  type ResumeTemplateId,
} from "@/lib/resume-export";

type AdvocateResumeContent = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  targetTitle: string;
  stateBarCouncil: string;
  enrolmentNumber: string;
  practiceAreas: string;
  yearsOfExperience: string;
  lawDegree: string;
  lawInstitution: string;
  graduationYear: string;
  summary: string;
  skills: string;
  professionalExperience: string;
  representativeWork: string;
  publications: string;
  certifications: string;
  achievements: string;
  languages: string;
};

type AdvocateResumeDraft = {
  template: ResumeTemplateId;
  content: AdvocateResumeContent;
};

const STORAGE_KEY = "lex-supermus-advocate-resume-draft";

const EMPTY_CONTENT: AdvocateResumeContent = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  targetTitle: "",
  stateBarCouncil: "",
  enrolmentNumber: "",
  practiceAreas: "",
  yearsOfExperience: "",
  lawDegree: "",
  lawInstitution: "",
  graduationYear: "",
  summary: "",
  skills: "",
  professionalExperience: "",
  representativeWork: "",
  publications: "",
  certifications: "",
  achievements: "",
  languages: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTemplate(value: unknown): value is ResumeTemplateId {
  return RESUME_TEMPLATES.some((template) => template.id === value);
}

function isAdvocateResumeContent(value: unknown): value is AdvocateResumeContent {
  return isRecord(value) && Object.keys(EMPTY_CONTENT).every((key) => typeof value[key] === "string");
}

function isDraft(value: unknown): value is AdvocateResumeDraft {
  return isRecord(value) && isTemplate(value.template) && isAdvocateResumeContent(value.content);
}

function getLines(value: string, splitCommas = false): string[] {
  return value
    .split(splitCommas ? /\r?\n|,/ : /\r?\n/)
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
}

function ResumeLines({ value, splitCommas = false }: { value: string; splitCommas?: boolean }) {
  const lines = getLines(value, splitCommas);
  if (!lines.length) return null;
  if (lines.length === 1) return <p>{lines[0]}</p>;
  return <ul>{lines.map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}</ul>;
}

export default function AdvocateResumeBuilder() {
  const [content, setContent] = useState<AdvocateResumeContent>(EMPTY_CONTENT);
  const [template, setTemplate] = useState<ResumeTemplateId>("executive");
  const [ready, setReady] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let profileContent: Partial<AdvocateResumeContent> = {};
    try {
      const profileDetailsRaw = window.localStorage.getItem(
        getSavedProfileKey("ADVOCATE", "details")
      );
      if (profileDetailsRaw) {
        const profile: unknown = JSON.parse(profileDetailsRaw);
        if (isRecord(profile)) {
          profileContent = {
            fullName: typeof profile.fullName === "string" ? profile.fullName : "",
            email: typeof profile.email === "string" ? profile.email : "",
            phone: typeof profile.phone === "string" ? profile.phone : "",
            city: typeof profile.city === "string" ? profile.city : "",
            stateBarCouncil: typeof profile.stateBarCouncil === "string" ? profile.stateBarCouncil : "",
            enrolmentNumber: typeof profile.barCouncilNumber === "string" ? profile.barCouncilNumber : "",
            practiceAreas: typeof profile.practiceAreas === "string" ? profile.practiceAreas : "",
            yearsOfExperience: typeof profile.yearsOfExperience === "string" ? profile.yearsOfExperience : "",
          };
        }
      } else {
        profileContent.fullName = window.localStorage.getItem("lex-supermus-user-name") ?? "";
      }

      const draftRaw = window.localStorage.getItem(STORAGE_KEY);
      if (draftRaw) {
        const draft: unknown = JSON.parse(draftRaw);
        if (isDraft(draft)) {
          setContent(draft.content);
          setTemplate(draft.template);
        } else {
          setError("Saved advocate resume details could not be read. Please enter and save them again.");
          setContent({ ...EMPTY_CONTENT, ...profileContent });
        }
      } else {
        setContent({ ...EMPTY_CONTENT, ...profileContent });
      }
    } catch {
      setError("Some saved advocate details could not be loaded from this browser.");
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
    setMessage("");
  }

  function saveDraft(): boolean {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ template, content }));
      setSaved(true);
      setError("");
      return true;
    } catch {
      setSaved(false);
      setError("Advocate resume details could not be saved in this browser. Please try again.");
      return false;
    }
  }

  function getResumeDocumentData(): ResumeDocumentData {
    const credentialDetails = [
      content.stateBarCouncil && `State Bar Council: ${content.stateBarCouncil}`,
      content.enrolmentNumber && `Enrolment number (self-reported): ${content.enrolmentNumber}`,
      content.practiceAreas && `Practice areas: ${content.practiceAreas}`,
      content.yearsOfExperience && `${content.yearsOfExperience} years of experience`,
    ].filter((line): line is string => Boolean(line));

    const experienceEntries = getLines(content.professionalExperience);
    const educationEntry = [
      content.lawDegree,
      content.lawInstitution,
      content.graduationYear,
    ].filter(Boolean).join(" | ");

    const sections = [
      { heading: "Professional Summary", entries: [content.summary] },
      { heading: "Bar Council & Practice", entries: credentialDetails },
      { heading: "Professional Experience", entries: experienceEntries, bullets: true },
      { heading: "Education", entries: educationEntry ? [educationEntry] : [] },
      { heading: "Areas of Expertise", entries: getLines(content.skills, true), bullets: true },
      { heading: "Representative Work (Anonymized)", entries: getLines(content.representativeWork), bullets: true },
      { heading: "Publications & Presentations", entries: getLines(content.publications), bullets: true },
      { heading: "Certifications & Professional Development", entries: getLines(content.certifications), bullets: true },
      { heading: "Awards & Achievements", entries: getLines(content.achievements), bullets: true },
      { heading: "Languages", entries: getLines(content.languages, true) },
    ];

    return {
      fullName: content.fullName,
      headline: content.targetTitle,
      contactInfo: [content.email, content.phone, content.city].filter(Boolean),
      sections: sections.filter((section) => section.entries.length > 0),
    };
  }

  function handleBuildResume() {
    if (!content.fullName.trim() || !content.email.trim() || !content.targetTitle.trim()) {
      setError("Add your name, email, and professional title before building your resume.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email.trim())) {
      setError("Enter a valid email address for your resume contact details.");
      return;
    }
    if (!content.summary.trim() || !content.skills.trim() || !content.lawDegree.trim()) {
      setError("Add your professional summary, areas of expertise, and law degree before building.");
      return;
    }
    if (!saveDraft()) return;
    setPreviewVisible(true);
  }

  async function handleDownload(format: "pdf" | "docx") {
    try {
      if (format === "pdf") {
        downloadResumePdf(getResumeDocumentData(), template);
        setMessage("PDF downloaded.");
      } else {
        await downloadResumeDocx(getResumeDocumentData(), template);
        setMessage("Word document downloaded.");
      }
    } catch {
      setMessage(`The ${format === "pdf" ? "PDF" : "Word document"} could not be created. Please try again.`);
    }
  }

  if (!ready) {
    return (
      <>
        <h1>Advocate Professional Resume</h1>
        <p className="sub">Loading your saved professional details…</p>
      </>
    );
  }

  return (
    <div className="resume-builder">
      <h1>Advocate Professional Resume</h1>
      <p className="sub">
        Choose a clean legal template, add your practice details, and preview your resume.
      </p>
      <p className="resume-builder-note">
        Use a single-column layout. Keep client names and confidential or privileged case details out.
        Bar Council information is self-reported.
      </p>

      <ResumeTemplatePicker
        template={template}
        audience="ADVOCATE"
        onChange={(nextTemplate) => {
          setTemplate(nextTemplate);
          setSaved(false);
          setPreviewVisible(false);
          setMessage("");
        }}
      />

      <section className="resume-builder-section" aria-labelledby="advocate-resume-details-heading">
        <h2 id="advocate-resume-details-heading">2. Your professional details</h2>
        <p className="resume-help">
          Account and Bar Council details are prefilled where available. Add accurate education,
          practice experience, expertise, and achievements.
        </p>
        <div className="resume-fields-grid">
          <div><label htmlFor="adv-resume-name">Full name *</label><input id="adv-resume-name" name="fullName" value={content.fullName} onChange={updateField} /></div>
          <div><label htmlFor="adv-resume-email">Email address *</label><input id="adv-resume-email" name="email" type="email" value={content.email} onChange={updateField} /></div>
          <div><label htmlFor="adv-resume-phone">Phone number</label><input id="adv-resume-phone" name="phone" type="tel" value={content.phone} onChange={updateField} /></div>
          <div><label htmlFor="adv-resume-city">City</label><input id="adv-resume-city" name="city" value={content.city} onChange={updateField} /></div>
          <div className="resume-field-full"><label htmlFor="adv-resume-title">Professional title / target role *</label><input id="adv-resume-title" name="targetTitle" value={content.targetTitle} onChange={updateField} placeholder="e.g. Advocate | Civil Litigation" /></div>
          <div><label htmlFor="adv-resume-council">State Bar Council</label><input id="adv-resume-council" name="stateBarCouncil" value={content.stateBarCouncil} onChange={updateField} /></div>
          <div><label htmlFor="adv-resume-enrolment">Enrolment number</label><input id="adv-resume-enrolment" name="enrolmentNumber" value={content.enrolmentNumber} onChange={updateField} /></div>
          <div><label htmlFor="adv-resume-practice-areas">Practice areas</label><input id="adv-resume-practice-areas" name="practiceAreas" value={content.practiceAreas} onChange={updateField} placeholder="e.g. civil, family, commercial" /></div>
          <div><label htmlFor="adv-resume-experience-years">Years in practice</label><input id="adv-resume-experience-years" name="yearsOfExperience" type="number" min="0" max="60" value={content.yearsOfExperience} onChange={updateField} /></div>
          <div><label htmlFor="adv-resume-degree">Law degree *</label><input id="adv-resume-degree" name="lawDegree" value={content.lawDegree} onChange={updateField} placeholder="e.g. LL.B." /></div>
          <div><label htmlFor="adv-resume-law-institution">Law school / university</label><input id="adv-resume-law-institution" name="lawInstitution" value={content.lawInstitution} onChange={updateField} /></div>
          <div><label htmlFor="adv-resume-graduation-year">Graduation year</label><input id="adv-resume-graduation-year" name="graduationYear" type="number" min="1950" max={new Date().getFullYear()} value={content.graduationYear} onChange={updateField} /></div>
          <div className="resume-field-full"><label htmlFor="adv-resume-summary">Professional summary *</label><textarea id="adv-resume-summary" name="summary" value={content.summary} onChange={updateField} placeholder="Summarize your practice focus, experience, and strengths in 2–4 factual sentences." /></div>
          <div className="resume-field-full"><label htmlFor="adv-resume-skills">Areas of expertise / legal skills *</label><textarea id="adv-resume-skills" name="skills" value={content.skills} onChange={updateField} placeholder="Add relevant skills, separated by commas or one per line." /></div>
          <div className="resume-field-full"><label htmlFor="adv-resume-professional-experience">Professional experience</label><textarea id="adv-resume-professional-experience" name="professionalExperience" value={content.professionalExperience} onChange={updateField} placeholder="One entry per line: role, chambers/firm/organization, dates, responsibilities, and factual outcomes." /></div>
          <details className="resume-optional-section resume-field-full">
            <summary>
              Additional sections (optional)
              {[
                content.representativeWork,
                content.publications,
                content.certifications,
                content.achievements,
                content.languages,
              ].some((value) => value.trim()) && <span> · saved details</span>}
            </summary>
            <div className="resume-fields-grid">
              <div className="resume-field-full"><label htmlFor="adv-resume-representative-work">Representative work (anonymized)</label><textarea id="adv-resume-representative-work" name="representativeWork" value={content.representativeWork} onChange={updateField} placeholder="Describe general matter types or work performed. Do not disclose client names, confidential facts, or privileged information." /></div>
              <div><label htmlFor="adv-resume-publications">Publications / presentations</label><textarea id="adv-resume-publications" name="publications" value={content.publications} onChange={updateField} /></div>
              <div><label htmlFor="adv-resume-certifications">Certifications / professional development</label><textarea id="adv-resume-certifications" name="certifications" value={content.certifications} onChange={updateField} /></div>
              <div><label htmlFor="adv-resume-achievements">Awards / achievements</label><textarea id="adv-resume-achievements" name="achievements" value={content.achievements} onChange={updateField} /></div>
              <div><label htmlFor="adv-resume-languages">Languages</label><textarea id="adv-resume-languages" name="languages" value={content.languages} onChange={updateField} placeholder="e.g. English (fluent), Tamil (native)" /></div>
            </div>
          </details>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}
        {saved && <p className="student-details-success" role="status">✓ Saved in this browser</p>}
        {message && <p className="student-details-success" role="status">{message}</p>}
        <div className="resume-actions">
          <button type="button" className="resume-secondary-button" onClick={saveDraft}>Save details</button>
          <button type="button" className="primary" onClick={handleBuildResume}>Save &amp; build resume preview</button>
        </div>
        <p className="resume-storage-note">Resume drafts are saved in this browser.</p>
      </section>

      {previewVisible && (
        <section className="resume-preview-section" aria-labelledby="advocate-resume-preview-heading">
          <div className="resume-preview-toolbar">
            <div>
              <h2 id="advocate-resume-preview-heading">
                3. Resume preview · {getResumeTemplateDisplayName(template, "ADVOCATE")}
              </h2>
              <p>Review your resume before downloading.</p>
            </div>
            <ResumeDownloadControl onDownload={handleDownload} />
          </div>

          <article className={`resume-preview resume-preview--${template}`}>
            <div className="resume-preview-header">
              <h1>{content.fullName}</h1>
              <p className="resume-target-role">{content.targetTitle}</p>
              <p className="resume-contact-line">
                {[content.email, content.phone, content.city].filter(Boolean).join(" | ")}
              </p>
            </div>
            <section><h2>Professional Summary</h2><p>{content.summary}</p></section>
            <section>
              <h2>Bar Council &amp; Practice</h2>
              <ResumeLines value={[
                content.stateBarCouncil && `State Bar Council: ${content.stateBarCouncil}`,
                content.enrolmentNumber && `Enrolment number (self-reported): ${content.enrolmentNumber}`,
                content.practiceAreas && `Practice areas: ${content.practiceAreas}`,
                content.yearsOfExperience && `${content.yearsOfExperience} years in practice`,
              ].filter(Boolean).join("\n")} />
            </section>
            {content.professionalExperience.trim() && <section><h2>Professional Experience</h2><ResumeLines value={content.professionalExperience} /></section>}
            <section>
              <h2>Education</h2>
              <p>{[content.lawDegree, content.lawInstitution, content.graduationYear].filter(Boolean).join(" | ")}</p>
            </section>
            <section><h2>Areas of Expertise</h2><ResumeLines value={content.skills} splitCommas /></section>
            {content.representativeWork.trim() && <section><h2>Representative Work (Anonymized)</h2><ResumeLines value={content.representativeWork} /></section>}
            {content.publications.trim() && <section><h2>Publications &amp; Presentations</h2><ResumeLines value={content.publications} /></section>}
            {content.certifications.trim() && <section><h2>Certifications &amp; Professional Development</h2><ResumeLines value={content.certifications} /></section>}
            {content.achievements.trim() && <section><h2>Awards &amp; Achievements</h2><ResumeLines value={content.achievements} /></section>}
            {content.languages.trim() && <section><h2>Languages</h2><ResumeLines value={content.languages} splitCommas /></section>}
          </article>
        </section>
      )}
    </div>
  );
}
