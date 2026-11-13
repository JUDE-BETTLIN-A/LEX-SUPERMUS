"use client";

import { useMemo, useState } from "react";

type Badge = "Advocate" | "Law Student";

type Post = {
  author: string;
  badge: Badge;
  verified: boolean;
  degree: string;
  time: string;
  location: string;
  title?: string;
  body: string;
  media?: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
};

const INITIAL_POSTS: Post[] = [
  {
    author: "Adv. Shafna K.",
    badge: "Advocate",
    verified: true,
    degree: "Bar Council ✓ Verified",
    time: "3h",
    location: "Family law · Chennai",
    title: "Case study: maintenance award under Section 125 CrPC",
    body: "Excited to share an anonymised matter from my practice: a 4-year delay in filing did not defeat the maintenance claim. The court focused on the means of the husband and the need of the wife. What it does: shows why pleading income sources beats emotional submissions. Key takeaway for students — study the evidentiary record, not just the ratio. Verify every citation independently before relying on it.",
    media: "📄 Case document preview (demo media)",
    tags: ["Family Law", "Criminal Misc", "Anonymised"],
    likes: 457,
    comments: 26,
    shares: 4,
  },
  {
    author: "Adv. Arjun Menon",
    badge: "Advocate",
    verified: true,
    degree: "Bar Council ✓ Verified",
    time: "1d",
    location: "Corporate law · Chennai",
    title: "Case note: arbitration clause survives novation of contract",
    body: "A supply agreement was replaced by a fresh agreement with revised terms — yet the arbitral reference survived because the core obligation persisted. Students: read the novation test alongside Section 62 of the Indian Contract Act. Please independently verify legal information; this note is for discussion only.",
    tags: ["Arbitration", "Contracts", "Case Note"],
    likes: 58,
    comments: 12,
    shares: 3,
  },
  {
    author: "Karthik R.",
    badge: "Law Student",
    verified: false,
    degree: "Law-practising student",
    time: "2d",
    location: "4th year · Tamil Nadu",
    title: "Moot court debrief: our bail application strategy",
    body: "We argued three grounds for bail — parity, delay in trial and nature of the offence. The bench pressed hardest on parity. Posting our skeleton so juniors can reuse the structure. All citations here are illustrative — check them against current law.",
    tags: ["Moot Court", "Bail", "Study Notes"],
    likes: 33,
    comments: 9,
    shares: 1,
  },
];

const NEWS = [
  { title: "Bar Council publishes e-filing practice directions", meta: "3h ago · 1,204 readers" },
  { title: "Law firms make strong case for more ADR", meta: "3h ago · 714 readers" },
  { title: "Supreme Court lists digital-hearing expansion", meta: "5h ago · 676 readers" },
  { title: "Indian advocates: new campus-to-practice pathways", meta: "58m ago · 203 readers" },
  { title: "Moot season is here — how to pick your problem", meta: "2h ago · 4,622 readers" },
];
const NEWS_EXTRA = [
  { title: "Legal-tech adoption rising in tier-2 practices", meta: "1d ago · 988 readers" },
  { title: "Case-management tools: what to verify first", meta: "1d ago · 455 readers" },
];

const CHALLENGES = [
  { ico: "⚖", name: "Bail Plea #605", meta: "14 connections attempted" },
  { ico: "📄", name: "Contract Quiz #157", meta: "8 connections attempted" },
  { ico: "🏛", name: "Constitution Patch #240", meta: "6 connections attempted" },
  { ico: "🧩", name: "Mini Case File #458", meta: "5 connections attempted" },
];

const UTILITIES = [
  { ico: "🔖", label: "Saved items" },
  { ico: "👥", label: "Practice groups" },
  { ico: "📰", label: "Legal digests" },
  { ico: "📅", label: "Moots & events" },
];

const TOOLS = [
  { ico: "🎬", label: "Video" },
  { ico: "📎", label: "Exhibit photo" },
  { ico: "✍️", label: "Write case study" },
];

/**
 * Community feed (LinkedIn-style, complete) — JUDE-BETTLIN branch.
 * Profile column · composer + case-study posts · news & challenges column.
 * Demo framing: sample posts only, not live legal content. Posts will be
 * served by the future community backend.
 */
export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [draft, setDraft] = useState("");
  const [showNews, setShowNews] = useState(false);
  const [sort, setSort] = useState<"top" | "recent">("top");
  const [activeTool, setActiveTool] = useState("Feed");

  const ordered = useMemo(
    () =>
      sort === "top"
        ? [...posts].sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
        : [...posts].reverse(),
    [posts, sort]
  );

  const publish = () => {
    const text = draft.trim();
    if (!text) return;
    window.alert(
      "Demo only: posting is not connected to a backend yet. Your case study would be reviewed and shared in the real version."
    );
    const newPost: Post = {
      author: "Demo Member (You)",
      badge: "Law Student",
      verified: false,
      degree: "Law-practising student",
      time: "now",
      location: "LEX SUPERMUS",
      body: text,
      tags: ["Demo Post"],
      likes: 0,
      comments: 0,
      shares: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setDraft("");
  };

  const toggleLike = (index: number) =>
    setLiked((prev) => ({ ...prev, [index]: !prev[index] }));

  const demo = (msg: string) => window.alert("Demo only: " + msg);

  const longBody = (post: Post, index: number) => {
    const isLong = post.body.length > 220;
    const open = expanded[index];
    return (
      <>
        <p>
          {open || !isLong ? post.body : post.body.slice(0, 220).trim() + "… "}
          {isLong && (
            <button
              className="liMore"
              onClick={() => setExpanded((p) => ({ ...p, [index]: !open }))}
            >
              {open ? "show less" : "more"}
            </button>
          )}
        </p>
      </>
    );
  };

  return (
    <section id="feed" className="page liTheme">
      {/* Feed toolbar (LinkedIn icon-nav) */}
      <div className="liIconNav">
        {[
          { label: "Feed", ico: "🏠", badge: 0 },
          { label: "My Circle", ico: "👥", badge: 1 },
          { label: "Briefs & Jobs", ico: "💼", badge: 0 },
          { label: "Messaging", ico: "💬", badge: 3 },
          { label: "Notifications", ico: "🔔", badge: 22 },
          { label: "Me", ico: "🧑", badge: 0 },
        ].map((t) => (
          <button
            key={t.label}
            className={activeTool === t.label ? "active" : ""}
            onClick={() => {
              setActiveTool(t.label);
              if (t.label !== "Feed") demo(`${t.label} opens after backend integration.`);
            }}
          >
            <span className="liBadge">
              {t.ico}
              {t.badge > 0 && <b>{t.badge}</b>}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="liGrid">
        {/* ============ LEFT: profile column ============ */}
        <aside>
          <div className="liCard" style={{ padding: 0 }}>
            <div className="liCover" style={{ margin: 0, borderRadius: "12px 12px 0 0" }} />
            <div style={{ padding: "0 16px 16px" }}>
              <div className="liAvatar" style={{ marginTop: -34 }}>DM</div>
              <b style={{ fontSize: 17 }}>Demo Member</b>
              <p style={{ margin: "4px 0", color: "var(--ink)" }}>
                Law-practising student | LEX SUPERMUS
              </p>
              <p className="liMuted">Tamil Nadu</p>
              <p className="liMuted" style={{ marginTop: 6 }}>
                🏛 Practice group: Criminal Law Study Circle
              </p>
              <div className="liDivider" />
              <div className="liRow" style={{ justifyContent: "space-between" }}>
                <span className="liMuted">Profile viewers</span>
                <b style={{ color: "#9b7739" }}>8</b>
              </div>
              <div className="liRow" style={{ justifyContent: "space-between" }}>
                <span className="liMuted">Case study views</span>
                <b style={{ color: "#9b7739" }}>86</b>
              </div>
              <div className="liDivider" />
              <button className="ghost" style={{ width: "100%" }} onClick={() => demo("analytics open after backend integration.")}>
                View all analytics
              </button>
            </div>
          </div>

          <div className="liCard">
            <p className="liMuted" style={{ margin: 0 }}>
              Achieve more with LEX PRO
            </p>
            <div className="liRow" style={{ marginTop: 6 }}>
              <span>🥇</span>
              <b>Try LEX PRO for ₹0</b>
            </div>
          </div>

          <div className="liCard">
            {UTILITIES.map((u) => (
              <div className="liUtil" key={u.label}>
                <span>{u.ico}</span>
                <button className="liLink" onClick={() => demo(`${u.label} open after backend integration.`)}>
                  {u.label}
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* ============ CENTRE: composer + posts ============ */}
        <div style={{ minWidth: 0 }}>
          <div className="liCard">
            <div className="composer" style={{ border: "1px solid #d9dce2", borderRadius: 28, padding: 6 }}>
              <div className="avatar" style={{ background: "var(--gold)", color: "#1b2431" }}>Me</div>
              <input
                placeholder="Start a post"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") publish();
                }}
                style={{ flex: 1, border: 0, margin: 0, padding: "12px 16px", background: "transparent" }}
              />
            </div>
            <div className="liActions" style={{ justifyContent: "space-around" }}>
              {TOOLS.map((t) => (
                <button key={t.label} className="liLink" onClick={() => demo(`${t.label} composer opens after backend integration.`)}>
                  {t.ico} {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="liSort">
            Sort by:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "top" | "recent")}
              aria-label="Sort posts"
            >
              <option value="top">Top</option>
              <option value="recent">Recent</option>
            </select>
          </div>

          {ordered.map((post, i) => (
            <div className="liCard" key={i} style={{ padding: 16 }}>
              <div className="postHead">
                <div className="avatar">
                  {post.author
                    .replace("Adv. ", "")
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <b>
                    {post.author}
                  </b>{" "}
                  {post.verified && <span className="pill">✓ {post.degree}</span>}
                  <div className="postMeta">
                    {post.badge} · {post.time} · {post.location}
                  </div>
                </div>
                <button className="liLink" onClick={() => demo("follow opens after backend integration.")}>
                  + Follow
                </button>
              </div>

              <h3 style={{ margin: "8px 0 4px" }}>{post.title}</h3>
              {longBody(post, i)}

              {post.media && <div className="liMedia">{post.media}</div>}

              <div className="tagRow">
                {post.tags.map((t) => (
                  <span className="pill" key={t}>
                    #{t}
                  </span>
                ))}
              </div>

              <div className="liActions" style={{ justifyContent: "space-around", borderTop: "1px solid var(--line)" }}>
                <button className="ghost" onClick={() => toggleLike(i)} aria-pressed={!!liked[i]}>
                  {liked[i] ? "👍 Liked" : "👍 Like"} {post.likes + (liked[i] ? 1 : 0)}
                </button>
                <button className="ghost" onClick={() => demo("comments open after backend integration.")}>
                  💬 {post.comments}
                </button>
                <button className="ghost" onClick={() => demo("repost is disabled in this prototype.")}>
                  🔁 {post.shares}
                </button>
                <button className="ghost" onClick={() => demo("sharing is disabled in this prototype.")}>
                  ↗ Send
                </button>
              </div>
            </div>
          ))}

          {/* Job-update style card */}
          <div className="liCard" style={{ textAlign: "center" }}>
            <div className="liRow" style={{ justifyContent: "space-between" }}>
              <span className="liMuted">Adv. Arjun Menon's verification update</span>
              <span>•••</span>
            </div>
            <div className="liMedia" style={{ height: 130 }}>
              <div>
                <div style={{ fontSize: 34 }}>✓</div>
                <b>Completed Bar Council enrolment review</b>
                <p className="liMuted" style={{ color: "#e3e7ed" }}>
                  Verified member of the LEX SUPERMUS advocate community
                </p>
              </div>
            </div>
            <div className="liActions" style={{ justifyContent: "space-around" }}>
              <button className="ghost">👍 12</button>
              <button className="ghost">💬 2</button>
            </div>
          </div>
        </div>

        {/* ============ RIGHT: news + challenges ============ */}
        <aside>
          <div className="liCard">
            <b style={{ fontSize: 16 }}>LEX News</b>
            <p className="liMuted" style={{ margin: "2px 0 4px" }}>Top stories</p>
            {(showNews ? [...NEWS, ...NEWS_EXTRA] : NEWS).map((n) => (
              <div className="liNewsItem" key={n.title}>
                <b>{n.title}</b>
                <small>{n.meta}</small>
              </div>
            ))}
            <button className="liLink" onClick={() => setShowNews((s) => !s)}>
              {showNews ? "Show less news ▴" : "Show more news ▾"}
            </button>
            <div className="notice" style={{ marginTop: 10 }}>
              Sample headlines only — verify all sources independently.
            </div>
          </div>

          <div className="liCard">
            <b style={{ fontSize: 16 }}>Today's case challenges</b>
            {CHALLENGES.map((c) => (
              <div className="liPuzzle" key={c.name}>
                <span className="ico">{c.ico}</span>
                <div style={{ flex: 1 }}>
                  <b>{c.name}</b>
                  <div className="liMuted" style={{ fontSize: 12 }}>{c.meta}</div>
                </div>
                <span>›</span>
              </div>
            ))}
            <button className="liLink" onClick={() => demo("case challenges open after backend integration.")}>
              Show more ▾
            </button>
          </div>

          <div className="liCard liFooter">
            <div>
              {["About", "Accessibility", "Help Center", "Privacy & Terms", "Community Guidelines", "Get the app", "More"].map(
                (l) => (
                  <a key={l} onClick={() => demo("this link is illustrative.")} role="link" tabIndex={0}>
                    {l}
                  </a>
                )
              )}
            </div>
            <div className="liDivider" />
            <b style={{ fontFamily: "Georgia,serif" }}>LEX SUPERMUS</b>
            <p className="liMuted">Where Law Meets Intelligence · © 2026</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
