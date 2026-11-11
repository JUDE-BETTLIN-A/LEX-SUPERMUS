/** Shared frontend types for LEX SUPERMUS. */

/** Roles known to the platform (mirrors UserRole enums in each service). */
export type UserRole = "STUDENT" | "ADVOCATE" | "CLIENT" | "ADMIN" | "REVIEWER";

/** Advocate Bar Council verification states (advocate-service workflow). */
export type VerificationStatus =
  | "NOT_SUBMITTED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type BarCouncilVerification = {
  id: string;
  fullName: string;
  stateBarCouncil: string;
  enrolmentNumber: string;
  status: VerificationStatus;
  submittedAt?: string;
};

/** Placeholder shape returned by legal-library-service search. */
export type LibraryResult = {
  title: string;
  source: string;
  citation?: string;
  summary: string;
};
