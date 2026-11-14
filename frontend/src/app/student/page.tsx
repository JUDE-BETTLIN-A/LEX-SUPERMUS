import type { Metadata } from "next";
import StudentPortal from "@/components/portals/StudentPortal";
import RoleAccessGate from "@/components/RoleAccessGate";

export const metadata: Metadata = { title: "Student Portal | LEX SUPERMUS" };

/** Route: /student — prototype `<section id="student">` + `studentTab()`. */
export default function StudentPage() {
  return (
    <section id="student" className="page">
      <RoleAccessGate role="STUDENT">
        <StudentPortal />
      </RoleAccessGate>
    </section>
  );
}
