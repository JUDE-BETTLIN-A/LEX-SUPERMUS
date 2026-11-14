import type { Metadata } from "next";
import AdvocatePortal from "@/components/portals/AdvocatePortal";
import ProfessionalRoleGuard from "@/components/ProfessionalRoleGuard";

export const metadata: Metadata = { title: "Advocate Portal | LEX SUPERMUS" };

/** Route: /advocate — prototype `<section id="advocate">` + `advTab()`. */
export default function AdvocatePage() {
  return (
    <section id="advocate" className="page">
      <ProfessionalRoleGuard role="ADVOCATE">
        <AdvocatePortal />
      </ProfessionalRoleGuard>
    </section>
  );
}
