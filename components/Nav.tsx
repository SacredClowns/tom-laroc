"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/artist", label: "Artist" },
  { href: "/work", label: "Work" },
  { href: "/screening-room", label: "Screening Room" },
  { href: "/archive", label: "Archive" },
  { href: "/live", label: "Footprint" },
  { href: "/dispatches", label: "Dispatches" },
  { href: "/roots", label: "Roots" },
  { href: "/bookings", label: "Work With Tom" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Public chrome doesn't belong in the back office, bespoke pages,
  // or the full-screen visualizer.
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/for") ||
    pathname?.startsWith("/visualizer")
  )
    return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "color-mix(in srgb, var(--bg) 70%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="display whitespace-nowrap text-lg tracking-tightest"
          style={{ color: "var(--fg)" }}
        >
          TOM LAROC
          <span className="ml-2 align-super text-[10px]" style={{ color: "var(--accent)" }}>
            HI-FI-AI
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-xs uppercase font-display font-medium tracking-[0.18em] transition-opacity hover:opacity-100"
              style={{ color: "var(--muted)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/inner-circle"
            className="whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase font-display font-medium tracking-[0.18em] transition-colors"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          >
            Inner Circle
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs uppercase font-display font-medium tracking-[0.2em] lg:hidden"
          style={{ color: "var(--fg)" }}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div
          className="flex flex-col gap-4 px-6 pb-6 lg:hidden"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {[...LINKS, { href: "/inner-circle", label: "Inner Circle" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase font-display font-medium tracking-[0.2em]"
              style={{ color: "var(--muted)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
