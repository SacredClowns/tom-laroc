"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePhase, PHASES } from "@/lib/phase";
import { subscribe, togglePlaying } from "@/lib/audio";

/**
 * Persistent, elegant mini-player. Audio is opt-in (never autoplay).
 * Wire Howler.js / Wavesurfer here; for now it shows the now-playing
 * track for the active phase and a faux waveform.
 */
export default function MiniPlayer() {
  const { phase } = usePhase();
  const [playing, setPlaying] = useState(false);
  const current = PHASES.find((p) => p.id === phase)!;
  const pathname = usePathname();

  // keep local UI in sync with the shared audio singleton (drives the orb)
  useEffect(() => subscribe(setPlaying), []);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/for") ||
    pathname?.startsWith("/visualizer")
  )
    return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2"
      >
        <div
          className="flex items-center gap-4 rounded-full border px-3 py-3 pr-5 backdrop-blur-xl"
          style={{
            borderColor: "var(--accent-soft)",
            backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)",
          }}
        >
          <button
            onClick={() => togglePlaying()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "❚❚" : "▶"}
          </button>

          {/* faux waveform */}
          <div className="flex h-8 flex-1 items-center gap-[3px] overflow-hidden">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  height: `${20 + Math.abs(Math.sin(i * 0.7)) * 70}%`,
                  backgroundColor: "var(--accent)",
                  opacity: playing ? 0.85 : 0.3,
                  transition: "opacity 0.4s",
                }}
              />
            ))}
          </div>

          <div className="hidden min-w-0 shrink-0 text-right sm:block">
            <p className="truncate text-xs" style={{ color: "var(--fg)" }}>
              {current.nowPlaying}
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--muted)" }}
            >
              {current.label}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
