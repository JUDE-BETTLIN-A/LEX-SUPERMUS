"use client";

import { useState } from "react";

type Badge = "Advocate" | "Law Student";

type Post = {
  author: string;
  badge: Badge;
  location: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
};

const INITIAL_POSTS: Post[] = [
  {
    author: "Adv. Priya Sharma",
    badge: "Advocate",
    location: "Family law · Chennai",
    title: "Case study: maintenance award under Section 125 CrPC",
    body: "Sharing a recent matter (anonymised): a 4-year delay in filing did not defeat the claim. The court focused on means of the husband and need of the wife. Key takeaway for students: pleadings around income sources matter more than emotional submissions.",
    tags: ["Family Law", "Criminal Misc", "Anonymised"],
    likes: 41,
    comments: 7,
  },
  {
    author: "Adv. Arjun Menon",
    badge: "Advocate",
    location: "Corporate law · Chennai",
    title: "Case note: arbitration clause survives novation of contract",
    body: "A supply agreement was replaced by a fresh agreement with revised terms. The arbitral reference still survived because the core obligation persisted. Students — read the novation test together with s.62 of the Contract Act.",
    tags: ["Arbitration", "Contracts", "Case Note"],
    likes: 58,
    comments: 12,
  },
  {
    author: "Karthik R.",
    badge: "Law Student",
    location: "4th year · Tamil Nadu",
    title: "Moot court debrief: our bail application strategy",
    body: "We argued three grounds for bail — parity, delay in trial and nature of the offence. Judges pressed hardest on parity. Posting our skeleton so juniors can reuse the structure. Verify every citation before you rely on it!",
    tags: ["Moot Court", "Bail", "Study Notes"],
    likes: 33,
    comments: 9,
  },
];

const TRENDING = [
  { label: "Bail & Anticipatory Bail", posts: 12 },
  { label: "Arbitration Practice", posts: 9 },
  { label: "Family Law Matters", posts: 8 },
  { label: "Moot Court Notes", posts: 14 },
  { label: "Contract Drafting", posts: 6 },
];

/**
 * Community feed (LinkedIn-style) — JUDE-BETTLIN branch.
 * A professional space where practising advocates and law-practising
 * students post case studies, case notes and moot debriefs.
 *
 * Demo framing: sample posts only, not live legal content. Practice areas
 * and posts come from legal-library-service / future backend.
 */
export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [draft, setDraft] = useState("");

  const publish = () => {
    const text = draft.trim();
    if (!text) return;
    window.alert(
      "Demo only: posting is not connected to a backend yet. Your case study would be reviewed and shared in the real version."
    );
    const newPost: Post = {
      author: "You (demo)",
      badge: "Law Student",
      location: "LEX SUPERMUS",
      title: text.length <= 80 ? text : text.slice(0, 80) + "…",
      body: text,
      tags: ["Demo Post"],
      likes: 0,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setDraft("");
  };

  const toggleLike = (index: number) => {
    setLiked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section id="feed" className="page">
      <div className="feedHead">
        <h1>Legal Community Feed</h1>
        <p className="sub">
          Case studies and case notes from practising advocates and
          law-practising students. Sample content only — verify all sources
          independently.
        </p>
      </div>

      <div className="feedGrid">
        {/* Left: profile / audience card */}
        <aside>
          <div className="sidecard">
            <div className="avatar lg">LS</div>
            <b>LEX SUPERMUS Member</b>
            <p>
              Sign in to post your case studies and follow practice areas.
            </p>
            <a href="/login" className="goldbtn" style={{ display: "inline-block", marginTop: 10 }}>
              Login Register →
            </a>
          </div>
          <div className="sidecard">
            <b>Who is this space for?</b>
            <p>⚖ Advocates · 🎓 Law-practising students</p>
            <div className="notice">
              Client matters are strictly anonymised. Never post confidential
              details of a case or client.
            </div>
          </div>
        </aside>

        {/* Centre: composer + posts */}
        <div>
          <div className="sidecard composer">
            <div className="avatar">Me</div>
            <textarea
              placeholder="Start a case study or case note…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) publish();
              }}
            />
            <button className="primary" onClick={publish}>
              Post
            </button>
          </div>

          {posts.map((post, i) => (
            <div className="item post" key={i}>
              <div className="postHead">
                <div className="avatar">
                  {post.author
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <b>{post.author}</b>{" "}
                  <span className="pill">{post.badge}</span>
                  <div className="postMeta">{post.location}</div>
                </div>
              </div>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <div className="tagRow">
                {post.tags.map((t) => (
                  <span className="pill" key={t}>
                    #{t}
                  </span>
                ))}
              </div>
              <div className="postActions">
                <button
                  className="ghost"
                  onClick={() => toggleLike(i)}
                  aria-pressed={!!liked[i]}
                >
                  {liked[i] ? "👍 Liked" : "👍 Like"}{" "}
                  <b>{post.likes + (liked[i] ? 1 : 0)}</b>
                </button>
                <button className="ghost" onClick={() => window.alert("Demo only: comments open after backend integration.")}>
                  💬 Comment <b>{post.comments}</b>
                </button>
                <button
                  className="ghost"
                  onClick={() =>
                    window.alert(
                      "Demo only: sharing is disabled in this prototype."
                    )
                  }
                >
                  ↗ Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: community highlights */}
        <aside>
          <div className="sidecard">
            <b>Trending practice areas</b>
            {TRENDING.map((t) => (
              <div className="trendRow" key={t.label}>
                <span>{t.label}</span>
                <small>{t.posts} posts · week</small>
              </div>
            ))}
          </div>
          <div className="sidecard">
            <b>Verified advocates</b>
            <p>
              Profiles marked ✓ have completed the Bar Council enrolment review
              inside LEX SUPERMUS.
            </p>
            <div className="notice">
              This feed is a community space, not legal advice. For legal help,
              consult a qualified advocate through the Client Portal.
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
