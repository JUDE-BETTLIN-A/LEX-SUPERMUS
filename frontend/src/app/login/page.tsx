import type { Metadata } from "next";
import AuthPanel from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Professional Sign In / Create Account | LEX SUPERMUS",
};

/**
 * Student and advocate sign-in and account creation.
 */
export default function LoginPage() {
  return (
    <section id="login" className="page">
      <AuthPanel />
    </section>
  );
}

