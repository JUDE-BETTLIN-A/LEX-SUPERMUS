export type EducationEntry = {
  institution: string;
  qualification: string;
  completionYear: string;
  score: string;
};

export type ExperienceDetails = {
  organization: string;
  role: string;
  duration: string;
  description: string;
};

export type StudentEducationDetails = {
  ssc: EducationEntry;
  hsc: EducationEntry;
  ug: EducationEntry;
  pg: EducationEntry;
  experience: ExperienceDetails;
};

export const STUDENT_EDUCATION_STORAGE_KEY = "lex-supermus-student-additional-details";

export function isStudentEducationDetails(value: unknown): value is StudentEducationDetails {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

  const record = value as Record<string, unknown>;
  const educationFields: (keyof EducationEntry)[] = [
    "institution",
    "qualification",
    "completionYear",
    "score",
  ];
  const experienceFields: (keyof ExperienceDetails)[] = [
    "organization",
    "role",
    "duration",
    "description",
  ];
  const hasStringFields = (entry: unknown, fields: string[]) =>
    typeof entry === "object" &&
    entry !== null &&
    !Array.isArray(entry) &&
    fields.every((field) => typeof (entry as Record<string, unknown>)[field] === "string");

  return (
    ["ssc", "hsc", "ug", "pg"].every((key) => hasStringFields(record[key], educationFields)) &&
    hasStringFields(record.experience, experienceFields)
  );
}
