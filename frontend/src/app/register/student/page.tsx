import type { Metadata } from "next";
import StudentRegistrationForm from "@/components/auth/StudentRegistrationForm";

export const metadata: Metadata = {
  title: "Student Registration | LEX SUPERMUS",
};

/** Route: /register/student — multi-step student registration (spec Part 4). */
export default function StudentRegistrationPage() {
  return (
    <section id="register-student" className="page">
      <StudentRegistrationForm />
    </section>
  );
}
