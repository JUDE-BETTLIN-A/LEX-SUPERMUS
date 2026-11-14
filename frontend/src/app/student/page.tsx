import type { Metadata } from "next";
import StudentPortal from "@/components/portals/StudentPortal";
import ProfessionalRoleGuard from "@/components/ProfessionalRoleGuard";

export const metadata: Metadata = { title: "Student Portal | LEX SUPERMUS" };

/** Route: /student — prototype `<section id="student">` + `studentTab()`. */
export default function StudentPage() {
  return (
    <section id="student" className="page">
      <ProfessionalRoleGuard role="STUDENT">
        <StudentPortal />
      </ProfessionalRoleGuard>
    </section>
  );
}
