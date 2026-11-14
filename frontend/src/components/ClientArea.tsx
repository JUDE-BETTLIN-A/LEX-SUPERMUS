"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientAuthPanel from "@/components/auth/ClientAuthPanel";
import ClientPortal from "@/components/portals/ClientPortal";

export default function ClientArea() {
  const router = useRouter();
  const [isClient, setIsClient] = useState<boolean | null>(null);

  useEffect(() => {
    const syncAccess = () => {
      const role = window.localStorage.getItem("lex-supermus-user-role");
      const hasName = Boolean(window.localStorage.getItem("lex-supermus-user-name"));
      if (role === "STUDENT" || role === "ADVOCATE") {
        router.replace("/feed");
        return;
      }
      setIsClient(role === "CLIENT" && hasName);
    };

    syncAccess();
    window.addEventListener("lex-auth-updated", syncAccess);
    return () => window.removeEventListener("lex-auth-updated", syncAccess);
  }, [router]);

  if (isClient === null) return null;
  return isClient ? <ClientPortal /> : <ClientAuthPanel />;
}
