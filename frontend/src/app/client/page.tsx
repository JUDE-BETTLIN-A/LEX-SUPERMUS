import type { Metadata } from "next";
import ClientPortal from "@/components/portals/ClientPortal";

export const metadata: Metadata = { title: "Client Portal | LEX SUPERMUS" };

/** Route: /client — prototype `<section id="client">` + `clientTab()`. */
export default function ClientPage() {
  return (
    <section id="client" className="page">
      <ClientPortal />
    </section>
  );
}
