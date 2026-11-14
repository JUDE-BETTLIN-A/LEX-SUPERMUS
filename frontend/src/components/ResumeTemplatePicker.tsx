"use client";

import {
  RESUME_TEMPLATES,
  type ResumeTemplateId,
} from "@/lib/resume-export";

type ResumeAudience = "STUDENT" | "ADVOCATE";

const ADVOCATE_TEMPLATE_NAMES: Record<
  ResumeTemplateId,
  { name: string; description: string }
> = {
  classic: {
    name: "Classic Legal CV",
    description: "Formal, clean layout for legal applications.",
  },
  modern: {
    name: "Modern Advocate",
    description: "Neat single-column design with understated legal styling.",
  },
  compact: {
    name: "Concise Practice Profile",
    description: "Compact format for focused professional applications.",
  },
  minimal: {
    name: "Clean Minimal",
    description: "Minimal typography and generous white space.",
  },
  executive: {
    name: "Executive Legal",
    description: "Polished format for experienced legal practitioners.",
  },
  litigation: {
    name: "Litigation & Advocacy",
    description: "Structured to present court practice and advocacy experience.",
  },
  corporate: {
    name: "Corporate & Advisory",
    description: "Clear format for corporate, contract, and compliance work.",
  },
  academic: {
    name: "Research & Publications",
    description: "Emphasizes legal research, writing, and presentations.",
  },
};

export function getResumeTemplateDisplayName(
  template: ResumeTemplateId,
  audience: ResumeAudience
): string {
  if (audience === "ADVOCATE") return ADVOCATE_TEMPLATE_NAMES[template].name;
  return RESUME_TEMPLATES.find((item) => item.id === template)?.name ?? "Resume";
}

export default function ResumeTemplatePicker({
  template,
  onChange,
  audience = "STUDENT",
}: {
  template: ResumeTemplateId;
  onChange: (template: ResumeTemplateId) => void;
  audience?: ResumeAudience;
}) {
  return (
    <section className="resume-builder-section" aria-labelledby="resume-template-heading">
      <h2 id="resume-template-heading">1. Choose a resume template</h2>
      <div className="resume-template-grid">
        {RESUME_TEMPLATES.map((item) => {
          const display = audience === "ADVOCATE"
            ? ADVOCATE_TEMPLATE_NAMES[item.id]
            : { name: item.name, description: item.description };
          return (
            <button
              key={item.id}
              type="button"
              className={`resume-template-card resume-template-card--${item.id}${template === item.id ? " selected" : ""}`}
              aria-pressed={template === item.id}
              onClick={() => onChange(item.id)}
            >
              <span className={`resume-template-sample resume-template-sample--${item.id}`} aria-hidden="true">
                <b>RESUME</b>
                <i>{audience === "ADVOCATE" ? "ADVOCATE PROFILE" : "LEGAL STUDENT"}</i>
                <span />
                <span />
                <small>EXPERIENCE</small>
                <span />
              </span>
              <strong>{display.name}</strong>
              <small>{display.description}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
