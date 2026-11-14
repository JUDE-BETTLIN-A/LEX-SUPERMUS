"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type ProfessionalRole = "STUDENT" | "ADVOCATE";

export default function RoleAccessGate({
  role,
  children,
}: {
  role: ProfessionalRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const activeRole = window.localStorage.getItem("lex-supermus-user-role");
    const hasName = Boolean(window.localStorage.getItem("lex-supermus-user-name"));
    if (activeRole === role && hasName) {
      setAuthorized(true);
    } else {
      router.replace(activeRole === "CLIENT" ? "/client" : "/login");
    }
  }, [role, router]);

  return authorized ? children : null;
}
