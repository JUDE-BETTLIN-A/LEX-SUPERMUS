"use client";

import { useState } from "react";

type AiMode = "career" | "legal";

type ChatEntry = { who: "user" | "ai"; text: string };

const MODE_INTRO: Record<AiMode, string> = {
  career:
    "Career AI selected. Ask about legal career paths, resumes or skills.",
  legal:
    "Legal AI selected. Ask a legal research question; verify all sources independently.",
};

/**
 * AI workspace — ported from the prototype's `setAI()` and `sendAI()`.
 * Responses are framed as demo/unverified, as required:
 * "Please independently verify legal information."
 */
export default function AiWorkspace() {
  const [mode, setMode] = useState<AiMode>("legal");
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");

  const selectMode = (m: AiMode) => {
    setMode(m);
    setEntries([]);
  };

  const send = () => {
    const value = input.trim();
    if (!value) return;
    setEntries((prev) => [
      ...prev,
      { who: "user", text: value },
      {
        who: "ai",
        text: "Demo response: Your question has been received. A production version would retrieve relevant career resources or verified legal sources and display citations. Please independently verify legal information.",
      },
    ]);
    setInput("");
  };

  return (
    <div className="panel">
      <h1>AI Intelligence Workspace</h1>
      <p className="sub">
        Choose a research assistant. Responses in this prototype are
        demonstrations, not legal advice.
      </p>
      <div className="rowcards">
        <div className="item">
          <h3>🎓 Career AI</h3>
          <p>Resume feedback, skill gaps and legal career pathways.</p>
          <button className="primary" onClick={() => selectMode("career")}>
            Open Career AI
          </button>
        </div>
        <div className="item">
          <h3>⚖ Legal AI</h3>
          <p>Structure a legal issue and identify sources to verify.</p>
          <button className="primary" onClick={() => selectMode("legal")}>
            Open Legal AI
          </button>
        </div>
      </div>

      <div className="item">
        <h3>
          {mode === "career" ? "Career AI Assistant" : "Legal AI Assistant"}
        </h3>

        <div className="chat">
          {entries.length === 0 ? (
            MODE_INTRO[mode]
          ) : (
            entries.map((entry, i) => (
              <div
                key={i}
                className={`chat${entry.who === "user" ? " user" : ""}`}
              >
                {entry.text}
              </div>
            ))
          )}
        </div>

        <input
          placeholder="Type a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button className="primary" onClick={send}>
          Send message
        </button>

        <div className="notice">
          AI output must be checked against current legislation and
          authoritative judgments. It does not replace a qualified advocate.
        </div>
      </div>
    </div>
  );
}
