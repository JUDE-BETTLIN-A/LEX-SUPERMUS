import type { Metadata } from "next";
import RegistrationLanding from "@/components/auth/RegistrationLanding";

export const metadata: Metadata = {
  title: "Join / Login | LEX SUPERMUS",
};

/**
 * Route: /login — JUDE-BETTLIN branch.
 * Registration landing ("Join India's Legal Professional Network") with
 * Student / Advocate / Client options and a common login toggle.
 */
export default function LoginPage() {
  return (
    <section id="login" className="page">
      <RegistrationLanding />
    </section>
  );
}
