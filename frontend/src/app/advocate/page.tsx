import type { Metadata } from "next";
import AdvocatePortal from "@/components/portals/AdvocatePortal";
import RoleAccessGate from "@/components/RoleAccessGate";

export const metadata: Metadata = { title: "Advocate Portal | LEX SUPERMUS" };

/** Route: /advocate — prototype `<section id="advocate">` + `advTab()`. */
export default function AdvocatePage() {
  return (
    <section id="advocate" className="page">
      <RoleAccessGate role="ADVOCATE">
        <AdvocatePortal />
      </RoleAccessGate>
    </section>
  );
}
