import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ProfessionalSessionProvider } from "@/components/ProfessionalSession";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "LEX SUPERMUS | Where Law Meets Intelligence",
  description:
    "Your Legal Career. Your Legal Practice. Your Legal Knowledge. — Indian legal technology ecosystem (demo).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProfessionalSessionProvider>
          <SiteHeader />
          <main>
            {children}
            <SiteFooter />
          </main>
        </ProfessionalSessionProvider>
      </body>
    </html>
  );
}
