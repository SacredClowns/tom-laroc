"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Mix } from "@/lib/mixcloud";

/**
 * Persistent "Listen" launcher. Mixcloud audio can't play from a hidden frame
 * (and Edge/ad-blockers stop it), so instead of faking playback here the bar
 * takes the user into the Visualizer — the one place a visible Mixcloud player
 * reliably plays — and auto-starts the selected mix.
 */
export default function MiniPlayer() {
  const pathname = usePathname();
  const router = useRouter();
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/mixes")
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && Array.isArray(j.mixes)) setMixes(j.mixes);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // The Visualizer is the player; the Archive has its own. Hide elsewhere.
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/for") ||
    pathname?.startsWith("/visualizer") ||
    pathname?.startsWith("/archive")
  )
    return null;

  const current = mixes[idx];

  function listen() {
    router.push(`/visualizer?play=1&mix=${idx}`);
  }
  function go(e: React.MouseEvent, delta: number) {
    e.stopPropagation();
    if (mixes.length === 0) return;
    setIdx((idx + delta + mixes.length) % mixes.length);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="fixed bottom-5 left-1/2 z-50 w-[min(94vw,560px)] -translate-x-1/2"
      >
        <button
          onClick={listen}
          className="flex w-full items-center gap-3 rounded-full border px-3 py-3 pr-5 text-left backdrop-blur-xl transition-colors hover:border-[var(--accent)]"
          style={{
            borderColor: "var(--accent-soft)",
            backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)",
          }}
          aria-label="Listen in the visualizer"
        >
          <span
            onClick={(e) => go(e, -1)}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs sm:flex"
            style={{ color: "var(--muted)" }}
            aria-label="Previous mix"
          >
            ‹
          </span>

          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            ▶
          </span>

          <span
            onClick={(e) => go(e, 1)}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs sm:flex"
            style={{ color: "var(--muted)" }}
            aria-label="Next mix"
          >
            ›
          </span>

          {/* idle waveform */}
          <span className="flex h-8 flex-1 items-center gap-[3px] overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  height: `${20 + Math.abs(Math.sin(i * 0.7)) * 70}%`,
                  backgroundColor: "var(--accent)",
                  opacity: 0.4,
                }}
              />
            ))}
          </span>

          <span className="hidden min-w-0 shrink-0 text-right sm:block sm:max-w-[44%]">
            <span className="block truncate text-xs" style={{ color: "var(--fg)" }}>
              {current ? current.name : "Loading Tom's mixes…"}
            </span>
            <span
              className="block text-[10px] uppercase font-display font-medium tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              {current ? "Listen in the visualizer ↗" : ""}
            </span>
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
