"use client";

import type { ReactNode } from "react";

export type PortalTabItem = {
  key: string;
  label: string;
};

/**
 * Shared portal layout — ported from the prototype's
 * `<div class="workspace"><aside class="sidebar">…<div class="panel">` markup.
 * The `studentTab / advTab / clientTab / adminTab` sidebar switchers all
 * collapse into this single component driven by React state.
 */
export default function PortalShell({
  title,
  tabs,
  active,
  onChange,
  children,
}: {
  title: string;
  tabs: PortalTabItem[];
  active: string;
  onChange: (key: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="sideTitle">{title}</div>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`sidebtn${tab.key === active ? " active" : ""}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </aside>
      <div className="panel">{children}</div>
    </div>
  );
}
