import type { Metadata } from "next";
import AuthPanel from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Login / Sign Up | LEX SUPERMUS",
};

/**
 * Route: /login — JUDE-BETTLIN branch.
 * Replaces the old Admin nav entry: Student, Advocate and Client users
 * sign in or create an account here, then land in their own portal.
 */
export default function LoginPage() {
  return (
    <section id="login" className="page">
      <AuthPanel />
    </section>
  );
}
