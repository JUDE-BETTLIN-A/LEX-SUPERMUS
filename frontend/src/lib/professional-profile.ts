export type ProfessionalRole = "STUDENT" | "ADVOCATE";

export function getSavedProfileKey(
  role: ProfessionalRole,
  field: "name" | "avatar" | "details"
): string {
  return `lex-supermus-saved-${role.toLowerCase()}-${field}`;
}
