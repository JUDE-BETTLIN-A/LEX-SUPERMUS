import type { Metadata } from "next";
import ClientArea from "@/components/ClientArea";

export const metadata: Metadata = { title: "Client Portal | LEX SUPERMUS" };

/** Separate client sign-in and client-only portal route. */
export default function ClientPage() {
  return (
    <section id="client" className="page">
      <ClientArea />
    </section>
  );
}
