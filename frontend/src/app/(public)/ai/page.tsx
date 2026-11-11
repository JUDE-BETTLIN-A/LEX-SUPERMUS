import AiWorkspace from "@/components/AiWorkspace";

/**
 * AI solutions page — ported from the prototype's `<section id="ai">`.
 * Chat logic lives in components/AiWorkspace.tsx (`setAI` / `sendAI`).
 */
export default function AiPage() {
  return (
    <section id="ai" className="page">
      <AiWorkspace />
    </section>
  );
}
