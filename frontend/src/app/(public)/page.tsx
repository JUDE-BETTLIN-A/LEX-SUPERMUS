import Link from "next/link";

/**
 * Landing page — ported from the prototype's `<section id="home">`.
 * `go(page)` calls become Next.js `<Link>` navigation.
 */
export default function HomePage() {
<<<<<<< Updated upstream
=======
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const syncAuthentication = () => {
      setUserRole(window.localStorage.getItem("lex-supermus-user-role") ?? "");
    };

    syncAuthentication();
    window.addEventListener("lex-auth-updated", syncAuthentication);
    window.addEventListener("storage", syncAuthentication);
    return () => {
      window.removeEventListener("lex-auth-updated", syncAuthentication);
      window.removeEventListener("storage", syncAuthentication);
    };
  }, []);

>>>>>>> Stashed changes
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
          <p>Legal Support. Trusted Knowledge. Clear Next Steps.</p>
          <div className="actions">
<<<<<<< Updated upstream
            <Link href="/student" className="goldbtn">
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
=======
            {(userRole === "STUDENT" || userRole === "ADVOCATE") && (
              <Link href="/feed" className="goldbtn">
                Explore Professional Feed →
              </Link>
            )}
            {userRole === "CLIENT" && (
              <Link href="/client" className="goldbtn">
                Open Client Portal →
              </Link>
            )}
            {!userRole && (
              <Link href="/login" className="outlinebtn">
                Get Started
              </Link>
            )}
            <Link href="#ecosystem" className="heroExploreLink">
              Browse services <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </div>

      <section id="ecosystem" className="ecosystemSection" aria-labelledby="ecosystem-title">
        <div className="sectionHeading">
          <p className="sectionEyebrow">One connected platform</p>
          <h2 id="ecosystem-title" className="sectionTitle">LEGAL SUPPORT, KNOWLEDGE &amp; INTELLIGENCE</h2>
          <p className="sectionIntro">
            Find legal support, explore trusted resources, and get help understanding your next steps.
>>>>>>> Stashed changes
          </p>
        </div>

        <div className="ecosystemGrid">
          <Link href="/client" className="card portal ecosystemCard">
            <span className="ecosystemType">PERSONALISED LEGAL SUPPORT</span>
            <div className="ico" aria-hidden="true">👥</div>
            <h3>Client Portal</h3>
            <p>Share what kind of help you need and arrange an online or in-person meeting.</p>
            <span className="link">Sign in or create an account <span aria-hidden="true">→</span></span>
          </Link>
          <Link href="/library" className="card portal ecosystemCard">
            <span className="ecosystemType">LEGAL RESOURCES</span>
            <div className="ico" aria-hidden="true">📚</div>
            <h3>Legal Library</h3>
            <p>Browse legal resources and build a clearer understanding of relevant topics.</p>
            <span className="link">Explore the library <span aria-hidden="true">→</span></span>
          </Link>
          <Link href="/ai" className="card portal ecosystemCard ecosystemCardFeatured">
            <span className="ecosystemType">AI-ASSISTED GUIDANCE</span>
            <div className="ico" aria-hidden="true">🧠</div>
            <h3>AI Legal Intelligence</h3>
            <p>Organise questions and explore legal topics with AI-assisted tools.</p>
            <span className="link">Explore AI tools <span aria-hidden="true">→</span></span>
          </Link>
        </div>
      </section>
    </section>
  );
}
