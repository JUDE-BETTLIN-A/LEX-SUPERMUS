"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileAvatar from "@/components/ProfileAvatar";

type ProfessionalRole = "STUDENT" | "ADVOCATE";

const POSTS = [
  {
    name: "LEX SUPERMUS Legal Network",
    detail: "Legal community · 2h",
    initials: "LS",
    text: "Welcome to a professional space for India’s legal community. Share insights, discover opportunities, and connect with students and advocates.",
    tags: ["#LegalCommunity", "#IndiaLaw"],
  },
  {
    name: "Aarav Menon",
    detail: "Advocate · 5h",
    initials: "AM",
    text: "A thoughtful case brief starts with a clear issue, the governing rule, and a concise explanation of how the court applied it. What helps you keep your research focused?",
    tags: ["#LegalResearch", "#Advocacy"],
  },
];

export default function ProfessionalFeed() {
  const router = useRouter();
  const [userName, setUserName] = useState("LEX SUPERMUS Member");
  const [userRole, setUserRole] = useState<ProfessionalRole | null>(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [postText, setPostText] = useState("");
  const [postedText, setPostedText] = useState("");

  useEffect(() => {
    const storedName = window.localStorage.getItem("lex-supermus-user-name");
    const storedRole = window.localStorage.getItem("lex-supermus-user-role");
    if (!storedName || (storedRole !== "STUDENT" && storedRole !== "ADVOCATE")) {
      router.replace(storedRole === "CLIENT" ? "/client" : "/login");
      return;
    }

    setUserName(storedName);
    setUserRole(storedRole);
    setProfilePhoto(window.localStorage.getItem("lex-supermus-user-avatar") ?? "");
    setIsAuthenticated(true);
  }, [router]);

  function publishPost() {
    const text = postText.trim();
    if (!text) return;
    setPostedText(text);
    setPostText("");
  }

  if (!isAuthenticated) return null;

  return (
    <div className="professional-feed">
      <div className="feedHead">
        <h1>Your legal network</h1>
        <p className="sub">Connect, share knowledge, and grow your legal career.</p>
      </div>

      <div className="liGrid">
        <aside>
          <section className="liCard feed-profile-card">
            <div className="liCover" />
            <ProfileAvatar
              name={userName}
              image={profilePhoto}
              completion={100}
              size="large"
              className="feed-profile-avatar"
            />
            <h2>{userName}</h2>
            <p className="liMuted">{userRole === "STUDENT" ? "Law student" : "Advocate"}</p>
            <div className="liDivider" />
            <div className="feed-profile-stat"><span>Profile views</span><b>24</b></div>
            <div className="feed-profile-stat"><span>Connections</span><b>18</b></div>
          </section>
          <section className="liCard">
            <h3>My professional space</h3>
            {userRole === "STUDENT" ? (
              <a className="feed-list-link" href="/student">My student portal</a>
            ) : (
              <a className="feed-list-link" href="/advocate">My advocate portal</a>
            )}
            <a className="feed-list-link" href="/library">Legal library</a>
          </section>
        </aside>

        <section aria-label="Community feed">
          <div className="liCard">
            <div className="liRow">
              <ProfileAvatar name={userName} image={profilePhoto} completion={100} />
              <label className="feed-composer-label" htmlFor="feed-post">
                Share a legal insight or update
              </label>
            </div>
            <textarea
              id="feed-post"
              className="feed-composer-input"
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              placeholder="What would you like to share with your network?"
              rows={3}
            />
            <div className="feed-composer-footer">
              <span className="liMuted">Keep it professional and constructive.</span>
              <button className="primary" onClick={publishPost} disabled={!postText.trim()}>
                Share post
              </button>
            </div>
          </div>

          <div className="liSort">Feed posts <span>·</span> Latest</div>
          {postedText && (
            <article className="liCard">
              <div className="postHead">
                <ProfileAvatar name={userName} image={profilePhoto} completion={100} />
                <div><b>{userName}</b><div className="postMeta">Community member · Just now</div></div>
              </div>
              <p>{postedText}</p>
              <div className="liActions"><span>♡ Like</span><span>↗ Share</span></div>
            </article>
          )}
          {POSTS.map((post) => (
            <article className="liCard" key={post.name}>
              <div className="postHead">
                <div className="liAvatar">{post.initials}</div>
                <div><b>{post.name}</b><div className="postMeta">{post.detail}</div></div>
              </div>
              <p>{post.text}</p>
              <div className="tagRow">{post.tags.map((tag) => <span className="feed-tag" key={tag}>{tag}</span>)}</div>
              <div className="liActions"><span>♡ Like</span><span>◯ Comment</span><span>↗ Share</span></div>
            </article>
          ))}
        </section>

        <aside>
          <section className="liCard">
            <h3>Legal community highlights</h3>
            <div className="feed-highlight"><b>Legal research &amp; writing</b><span>Build and share your skills</span></div>
            <div className="feed-highlight"><b>Career opportunities</b><span>Explore internships and roles</span></div>
            <div className="feed-highlight"><b>Practice insights</b><span>Learn from the legal community</span></div>
          </section>
          <section className="liCard">
            <h3>Explore LEX SUPERMUS</h3>
            <p className="liMuted">Your career, your practice, your legal knowledge — connected in one place.</p>
            <a className="feed-list-link" href="/ai">Explore AI Legal Intelligence →</a>
          </section>
        </aside>
      </div>
    </div>
  );
}
