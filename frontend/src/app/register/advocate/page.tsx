import type { Metadata } from "next";
import AdvocateRegistrationForm from "@/components/auth/AdvocateRegistrationForm";

export const metadata: Metadata = {
  title: "Advocate Registration | LEX SUPERMUS",
};

/** Route: /register/advocate — multi-step advocate registration (spec Part 5). */
export default function AdvocateRegistrationPage() {
  return (
    <section id="register-advocate" className="page">
      <AdvocateRegistrationForm />
    </section>
  );
}
