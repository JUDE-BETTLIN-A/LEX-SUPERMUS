/**
 * Auth API client — JUDE-BETTLIN branch.
 * Talks to the auth-service (Spring Boot, port 8086). No credentials or
 * secrets live here; the base URL comes from NEXT_PUBLIC_AUTH_API.
 *
 * Fallback rule (master spec Part 20 rule 9/12): when auth-service is not
 * reachable the UI shows a clearly labelled demo message — it never fakes a
 * successful registration, login or verification.
 */
export const AUTH_API =
  process.env.NEXT_PUBLIC_AUTH_API ?? "http://localhost:8086";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: "STUDENT" | "ADVOCATE" | "CLIENT" | "ADMIN";
  accountStatus: string;
  verified: boolean;
};

export type AuthResult =
  | { ok: true; message: string; user?: AuthUser; token?: string }
  | { ok: false; error: string; offline?: boolean };

async function call(path: string, body: unknown): Promise<AuthResult> {
  try {
    const res = await fetch(`${AUTH_API}/api/auth${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return {
        ok: false,
        error:
          (typeof data.message === "string" && data.message) ||
          `Registration failed (HTTP ${res.status}).`,
      };
    }
    return {
      ok: true,
      message: (typeof data.message === "string" && data.message) || "Success.",
      user: data.user as AuthUser | undefined,
      token: typeof data.token === "string" ? data.token : undefined,
    };
  } catch {
    return {
      ok: false,
      offline: true,
      error:
        "Auth service not reachable. Start auth-service on port 8086, or try again later — this page does not fake results.",
    };
  }
}

export const registerStudent = (body: unknown) =>
  call("/register/student", body);
export const registerAdvocate = (body: unknown) =>
  call("/register/advocate", body);
export const registerClient = (body: unknown) => call("/register/client", body);
export const login = (body: { email: string; password: string }) =>
  call("/login", body);

/** Persist the signed-in identity for the portal pages (MVP: localStorage). */
export function saveSession(token: string, user: AuthUser) {
  try {
    localStorage.setItem("lex_token", token);
    localStorage.setItem("lex_user", JSON.stringify(user));
  } catch {
    /* storage unavailable — session stays memory-only */
  }
}
