import type { Metadata } from "next";
import ClientRegistrationForm from "@/components/auth/ClientRegistrationForm";

export const metadata: Metadata = {
  title: "Client Registration | LEX SUPERMUS",
};

/** Route: /register/client — minimal client registration (email + password). */
export default function ClientRegistrationPage() {
  return (
    <section id="register-client" className="page">
      <ClientRegistrationForm />
    </section>
  );
}
