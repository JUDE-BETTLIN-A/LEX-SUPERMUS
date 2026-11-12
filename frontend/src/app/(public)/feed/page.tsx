import type { Metadata } from "next";
import CommunityFeed from "@/components/CommunityFeed";

export const metadata: Metadata = {
  title: "Legal Community Feed | LEX SUPERMUS",
};

/**
 * Route: /feed — JUDE-BETTLIN branch.
 * LinkedIn-style community feed where practising advocates and
 * law-practising students post case studies and case notes.
 * Reached via the home page's "Explore Platform →" CTA.
 */
export default function FeedPage() {
  return <CommunityFeed />;
}
