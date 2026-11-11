"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";

/**
 * Site header — ported from the prototype's `<header>` + `<nav id="topnav">`.
 * The `go(page)` function is replaced by Next.js routing; the active state
 * comes from the current pathname instead of `data-page` toggling.
 */
export default function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header>
      <Link href="/" className="brand" style={{ textDecoration: "none" }}>
        <span className="mark">⚙</span>
        <div>
          <b>LEX SUPERMUS</b>
          <small>WHERE LAW MEETS INTELLIGENCE</small>
        </div>
      </Link>
      <nav id="topnav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.page}
            href={item.href}
            className={`navbtn${isActive(item.href) ? " active" : ""}`}
            data-page={item.page}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
