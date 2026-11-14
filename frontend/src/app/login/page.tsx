import type { Metadata } from "next";
import AuthPanel from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Login / Sign Up | LEX SUPERMUS",
};

/** Student and Advocate sign in or create a professional account here. */
export default function LoginPage() {
  return (
    <section id="login" className="page">
      <AuthPanel />
    </section>
  );
}

