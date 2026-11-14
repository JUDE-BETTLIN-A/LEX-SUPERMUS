"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, saveSession } from "@/lib/authApi";
import { ROLE_PORTAL } from "@/lib/navigation";

/**
 * Common login form (master spec Part 10.1) — JUDE-BETTLIN branch.
 * Email + password for every role. After sign-in the backend decides the
 * role; the frontend redirect is derived from the server response, never
 * from a client-side role picker.
 */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    const res = await login({ email: email.trim(), password });
    setBusy(false);

    if (!res.ok) {
      setError(
        res.offline
          ? `${res.error} (Demo preview: you can still view the portal pages, but no account session exists.)`
          : res.error
      );
      if (res.offline) {
        window.alert(
          "Demo only: auth-service is not running, so this sign-in is a preview without a real account. No fake login result is shown."
        );
      }
      return;
    }
    if (res.user) {
      if (res.token) saveSession(res.token, res.user);
      const role = res.user.role.toLowerCase() as keyof typeof ROLE_PORTAL;
      router.push(ROLE_PORTAL[role] ?? "/");
      return;
    }
    setError("Sign-in succeeded but the server response was incomplete.");
  };

  return (
    <>
      <h1>Welcome Back</h1>
      <p className="sub">One account for the whole LEX SUPERMUS platform.</p>

      <form onSubmit={submit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        {error && <div className="notice" style={{ borderColor: "#c0392b" }}>{error}</div>}

        <button type="submit" className="primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p style={{ margin: "14px 0 0", color: "var(--muted)" }}>
        New here?{" "}
        <a href="/login" style={{ color: "#9b7739", fontWeight: 700, cursor: "pointer" }}>
          See registration options
        </a>
      </p>
      <div className="notice">
        Passwords are hashed server-side (BCrypt). OTP verification and password
        reset are planned in later phases of the master spec.
      </div>
    </>
  );
}
