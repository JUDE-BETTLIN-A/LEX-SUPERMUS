import type { Metadata } from "next";
import AdminPortal from "@/components/portals/AdminPortal";

export const metadata: Metadata = { title: "Admin Console | LEX SUPERMUS" };

/** Route: /admin — prototype `<section id="admin">` + `adminTab()`. */
export default function AdminPage() {
  return (
    <section id="admin" className="page">
      <AdminPortal />
    </section>
  );
}
