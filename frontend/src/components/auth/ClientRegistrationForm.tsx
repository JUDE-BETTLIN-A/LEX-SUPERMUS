"use client";

import { useState } from "react";
import Link from "next/link";
import { registerClient } from "@/lib/authApi";

/**
 * Client registration (master spec: minimal account) — JUDE-BETTLIN branch.
 * Email + password only, as the product owner specified ("pothum").
 */
export default function ClientRegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const res = await registerClient({ email: email.trim(), password });
    setBusy(false);

    if (res.ok) {
      window.alert("Client account created. Please sign in from the Login page.");
      window.location.href = "/login";
      return;
    }
    setError(res.error);
  };

  return (
    <div className="panel">
      <Link href="/login" className="ghost" style={{ textDecoration: "none" }}>
        ← Back
      </Link>
      <h1 style={{ marginTop: 12 }}>👤 Client Registration</h1>
      <p className="sub">Email and password — that's all it takes.</p>

      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        <label>Confirm password</label>
        <input type="password" placeholder="Re-enter password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required />

        {error && <div className="notice" style={{ borderColor: "#c0392b" }}>{error}</div>}

        <button type="submit" className="primary" disabled={busy}>
          {busy ? "Creating…" : "Create Client Account"}
        </button>
      </form>

      <div className="notice">
        Client accounts can browse the community and find legal support.
        Verified badges exist only for students and advocates who complete the
        verification workflow.
      </div>
    </div>
  );
}
