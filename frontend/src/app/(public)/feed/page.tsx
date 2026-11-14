import type { Metadata } from "next";
import ProfessionalFeed from "@/components/ProfessionalFeed";

export const metadata: Metadata = { title: "Professional Feed | LEX SUPERMUS" };

export default function FeedPage() {
  return (
    <section className="page">
      <ProfessionalFeed />
    </section>
  );
}
