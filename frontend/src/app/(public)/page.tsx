import Link from "next/link";

/**
 * Landing page — ported from the prototype's `<section id="home">`.
 * `go(page)` calls become Next.js `<Link>` navigation.
 */
export default function HomePage() {
  return (
    <section id="home" className="page">
      <div className="hero">
        <div className="heroContent">
          <div className="eyebrow">THE INDIAN LEGAL TECHNOLOGY ECOSYSTEM</div>
          <h1>
            Where Law
            <br />
            Meets <span>Intelligence</span>
          </h1>
          <p>Your Legal Career. Your Legal Practice. Your Legal Knowledge.</p>
          <div className="actions">
            <Link href="/feed" className="goldbtn">
              Explore Platform →
            </Link>
            <Link href="/client" className="outlinebtn">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <h2 className="sectionTitle">OUR ECOSYSTEM</h2>

      <div className="cards">
        <Link href="/student" className="card portal">
          <div className="ico">🎓</div>
          <h3>Students</h3>
          <p>Build your legal career</p>
          <span className="link">Explore opportunities →</span>
        </Link>
        <Link href="/advocate" className="card portal">
          <div className="ico">⚙️</div>
          <h3>Advocates</h3>
          <p>Verify. Practise. Grow.</p>
          <span className="link">Professional tools →</span>
        </Link>
        <Link href="/client" className="card portal">
          <div className="ico">👥</div>
          <h3>Clients</h3>
          <p>Find trusted legal support</p>
          <span className="link">Get legal help →</span>
        </Link>
        <Link href="/library" className="card portal">
          <div className="ico">📚</div>
          <h3>Legal Library</h3>
          <p>Explore legal knowledge</p>
          <span className="link">Browse resources →</span>
        </Link>
      </div>

      <div className="featureGrid">
        <div className="card feature">
          <div className="ico">🧠</div>
          <div>
            <h3>AI Legal Intelligence</h3>
            <p>Ask. Learn. Research. Advance.</p>
            <Link href="/ai" className="goldbtn">
              Try AI →
            </Link>
          </div>
        </div>
        <div className="card feature">
          <div className="ico">🛡️</div>
          <div>
            <h3>Advocate Verification</h3>
            <p>Structured enrolment review workflow.</p>
            <Link href="/advocate" className="outlinebtn">
              View workflow →
            </Link>
          </div>
        </div>
        <div className="card">
          <h3>Why LEX SUPERMUS?</h3>
          <p>
            ✓ Trusted legal knowledge
            <br />✓ AI-assisted research
            <br />✓ Professional ecosystem
            <br />✓ Privacy-conscious design
          </p>
        </div>
      </div>
    </section>
  );
}
