"use client";

import { useState } from "react";

const CATEGORIES = [
  {
    title: "Constitution of India",
    body: "Articles, schedules and constitutional materials.",
    pill: "Constitution",
  },
  {
    title: "Central Acts",
    body: "Legislation with source and amendment metadata.",
    pill: "Legislation",
  },
  {
    title: "Judgments",
    body: "Supreme Court and High Court decisions.",
    pill: "Case law",
  },
  {
    title: "Bare Acts & Rules",
    body: "Organised statutory texts and rules.",
    pill: "Research",
  },
];

/**
 * Legal library — ported from the prototype's `<section id="library">`
 * and `searchLibrary()`. Real search will be served by
 * services/legal-library-service.
 */
export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const search = () => {
    const q = query.trim();
    setResult(
      `Prototype search for “${q.replace(/[<>&"]/g, "")}”. Connect an indexed legal corpus and authoritative sources to return real results.`
    );
  };

  return (
    <section id="library" className="page">
      <div className="panel">
        <h1>Digital Legal Library</h1>
        <p className="sub">
          A searchable research space for statutes, judgments and legal
          materials.
        </p>
        <input
          id="libsearch"
          placeholder="Search Acts, sections, judgments or keywords…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search();
          }}
        />
        <button className="primary" onClick={search}>
          Search library
        </button>

        <div id="libresults">
          {result ? (
            <div className="notice">{result}</div>
          ) : (
            <>
              <div className="rowcards">
                {CATEGORIES.map((c) => (
                  <div className="item" key={c.title}>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                    <span className="pill">{c.pill}</span>
                  </div>
                ))}
              </div>
              <div className="notice">
                Prototype note: connect authoritative sources such as India Code
                and court repositories before treating any text as current law.
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
