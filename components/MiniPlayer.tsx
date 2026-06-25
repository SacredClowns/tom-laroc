"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { subscribe, setPlaying as setAudio } from "@/lib/audio";
import type { Mix } from "@/lib/mixcloud";

/**
 * Persistent player — plays Tom's REAL Mixcloud catalog site-wide.
 * A hidden Mixcloud widget handles the audio (cross-origin, so its JS API
 * drives the play state); pressing play makes the hero orb react. Opt-in,
 * never autoplay.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
function feed(key: string) {
  return `https://www.mixcloud.com/widget/iframe/?light=0&hide_cover=1&mini=1&feed=${encodeURIComponent(
    key
  )}`;
}

export default function MiniPlayer() {
  const pathname = usePathname();
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<any>(null);

  // keep UI in sync with the shared audio singleton (drives the orb)
  useEffect(() => subscribe(setPlaying), []);

  // pull Tom's real catalog
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

  // load the Mixcloud Widget API + bind play/pause to the orb energy
  useEffect(() => {
    if (mixes.length === 0) return;
    let cancelled = false;

    function init() {
      const w = window as any;
      if (cancelled || !iframeRef.current || !w.Mixcloud) return;
      const widget = w.Mixcloud.PlayerWidget(iframeRef.current);
      widgetRef.current = widget;
      widget.ready.then(() => {
        if (cancelled) return;
        widget.events.play.on(() => setAudio(true));
        widget.events.pause.on(() => setAudio(false));
        widget.events.ended.on(() => setAudio(false));
      });
    }

    if ((window as any).Mixcloud) init();
    else {
      const s = document.createElement("script");
      s.src = "https://widget.mixcloud.com/media/js/widgetApi.js";
      s.async = true;
      s.onload = init;
      document.body.appendChild(s);
    }
    return () => {
      cancelled = true;
    };
  }, [mixes.length]);

  function toggle() {
    const w = widgetRef.current;
    if (w) {
      if (playing) w.pause();
      else w.play();
    } else {
      setAudio(!playing); // fallback: still drives the orb
    }
  }

  function go(delta: number) {
    if (mixes.length === 0) return;
    const n = (idx + delta + mixes.length) % mixes.length;
    setIdx(n);
    widgetRef.current?.load?.(mixes[n].key, true).catch?.(() => {});
  }

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/for") ||
    pathname?.startsWith("/visualizer") ||
    pathname?.startsWith("/archive")
  )
    return null;

  const current = mixes[idx];

  return (
    <>
      {/* hidden audio engine (rendered, just off-screen so it can play) */}
      {current && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            width: 1,
            height: 1,
            bottom: 0,
            left: 0,
            opacity: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <iframe
            ref={iframeRef}
            title="player"
            src={feed(mixes[0].key)}
            width="320"
            height="120"
            allow="autoplay"
            frameBorder="0"
          />
        </div>
      )}

      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="fixed bottom-5 left-1/2 z-50 w-[min(94vw,560px)] -translate-x-1/2"
        >
          <div
            className="flex items-center gap-3 rounded-full border px-3 py-3 pr-5 backdrop-blur-xl"
            style={{
              borderColor: "var(--accent-soft)",
              backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)",
            }}
          >
            <button
              onClick={() => go(-1)}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs sm:flex"
              style={{ color: "var(--muted)" }}
              aria-label="Previous mix"
            >
              ‹
            </button>

            <button
              onClick={toggle}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "❚❚" : "▶"}
            </button>

            <button
              onClick={() => go(1)}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs sm:flex"
              style={{ color: "var(--muted)" }}
              aria-label="Next mix"
            >
              ›
            </button>

            {/* faux waveform */}
            <div className="flex h-8 flex-1 items-center gap-[3px] overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
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

            <div className="hidden min-w-0 shrink-0 text-right sm:block sm:max-w-[42%]">
              <p className="truncate text-xs" style={{ color: "var(--fg)" }}>
                {current ? current.name : "Loading Tom's mixes…"}
              </p>
              <p
                className="text-[10px] uppercase font-medium tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                {current ? "Tom Laroc · Mixcloud" : ""}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
