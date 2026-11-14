"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ProfessionalRole } from "@/components/ProfessionalSession";
import { useProfessionalSession } from "@/components/ProfessionalSession";

export default function ProfessionalRoleGuard({
  role,
  children,
}: {
  role: ProfessionalRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const { profile } = useProfessionalSession();

  useEffect(() => {
    if (!profile) {
      router.replace("/");
      return;
    }

    if (profile.role !== role) {
      router.replace(profile.role === "STUDENT" ? "/student" : "/advocate");
    }
  }, [profile, role, router]);

  if (!profile || profile.role !== role) return null;
  return children;
}
