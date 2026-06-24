"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import type { Mix } from "@/lib/mixcloud";
import { MIXCLOUD_PROFILE } from "@/lib/mixcloud";

function embedSrc(key: string) {
  return `https://www.mixcloud.com/widget/iframe/?light=0&feed=${encodeURIComponent(
    key
  )}`;
}

export default function MixcloudArchive({ mixes }: { mixes: Mix[] }) {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mixes;
    return mixes.filter((m) => m.name.toLowerCase().includes(q));
  }, [mixes, query]);

  if (mixes.length === 0) {
    return (
      <div className="rounded-2xl border p-10 text-center" style={{ borderColor: "var(--accent-soft)" }}>
        <p style={{ color: "var(--muted)" }}>
          The archive is loading from Mixcloud.{" "}
          <a href={MIXCLOUD_PROFILE} className="underline" style={{ color: "var(--accent)" }}>
            Listen on Mixcloud →
          </a>
        </p>
      </div>
    );
  }

  const current = mixes[active];

  return (
    <div>
      {/* Now playing */}
      <div className="sticky top-20 z-20 mb-10">
        <div
          className="overflow-hidden rounded-2xl border backdrop-blur-xl"
          style={{
            borderColor: "var(--accent-soft)",
            backgroundColor: "color-mix(in srgb, var(--bg) 80%, transparent)",
          }}
        >
          <iframe
            key={current.key}
            title={current.name}
            src={embedSrc(current.key)}
            width="100%"
            height="120"
            frameBorder="0"
            allow="autoplay"
          />
        </div>
      </div>

      {/* Search + count */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "var(--muted)" }}>
          {mixes.length} mixes · the surviving archive
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the archive…"
          className="w-full max-w-xs rounded-full border bg-transparent px-5 py-2.5 text-sm outline-none focus:border-[var(--accent)] sm:w-64"
          style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((m) => {
          const idx = mixes.indexOf(m);
          const isActive = idx === active;
          return (
            <button
              key={m.key}
              onClick={() => {
                setActive(idx);
                if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group overflow-hidden rounded-xl border text-left transition-colors"
              style={{
                borderColor: isActive ? "var(--accent)" : "var(--accent-soft)",
              }}
            >
              <div className="relative aspect-square overflow-hidden">
                {m.picture ? (
                  <img
                    src={m.picture}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: "linear-gradient(135deg, var(--accent-soft), var(--bg-soft))" }}
                  />
                )}
                <span
                  className="absolute bottom-2 right-2 rounded-full px-2 py-1 text-[10px]"
                  style={{ backgroundColor: "color-mix(in srgb, var(--bg) 75%, transparent)", color: "var(--fg)" }}
                >
                  {isActive ? "▶ playing" : m.length}
                </span>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm" style={{ color: "var(--fg)" }}>
                  {m.name}
                </p>
                <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                  {m.year} · {m.plays.toLocaleString()} plays
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs" style={{ color: "var(--muted)" }}>
        <a href={MIXCLOUD_PROFILE} className="underline" style={{ color: "var(--accent)" }}>
          Full archive on Mixcloud →
        </a>
      </p>
    </div>
  );
}
