import type { Metadata } from "next";
import ClientAuthPanel from "@/components/auth/ClientAuthPanel";

export const metadata: Metadata = {
  title: "Client Access | LEX SUPERMUS",
};

export default function ClientAccessPage() {
  return (
    <section className="page">
      <ClientAuthPanel />
    </section>
  );
}
