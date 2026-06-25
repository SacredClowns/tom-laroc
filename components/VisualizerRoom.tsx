"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import type { Mix } from "@/lib/mixcloud";
import { setPlaying } from "@/lib/audio";
import FrequencyOrb from "@/components/three/FrequencyOrb";
import Particles from "@/components/three/Particles";
import VizWave from "@/components/viz/VizWave";
import VizWarp from "@/components/viz/VizWarp";
import VizSpectrum from "@/components/viz/VizSpectrum";
import VizTunnel from "@/components/viz/VizTunnel";
import VizGalaxy from "@/components/viz/VizGalaxy";
import VizSwarm, { type Glyph } from "@/components/viz/VizSwarm";
import Marquee from "@/components/Marquee";
import { setVizColor, triggerFlash } from "@/lib/viz";
import { Leaf, Bolt, Sparkle, Flame, Note, Record, Star, Diamond } from "@/components/FxIcons";

const GLYPHS: { id: Glyph; Icon: (p: { className?: string }) => React.ReactElement }[] = [
  { id: "leaf", Icon: Leaf },
  { id: "note", Icon: Note },
  { id: "record", Icon: Record },
  { id: "star", Icon: Star },
  { id: "bolt", Icon: Bolt },
  { id: "diamond", Icon: Diamond },
];

const PALETTE = [
  "#8b6cff", "#5b8cff", "#22d3ee", "#34d399", "#a3e635",
  "#ffd166", "#ff8a3d", "#ff4d6d", "#ff5fd2", "#ffffff",
];

const FX = [
  { key: "leaf", color: "#3fbf5f", strength: 1.0, Icon: Leaf },
  { key: "bolt", color: "#ffffff", strength: 1.3, Icon: Bolt },
  { key: "spark", color: "#8b6cff", strength: 1.1, Icon: Sparkle },
  { key: "flame", color: "#ff6a3d", strength: 1.2, Icon: Flame },
];

type Mode = "orb" | "wave" | "spectrum" | "tunnel" | "galaxy" | "warp" | "leaves";
const MODES: { id: Mode; label: string }[] = [
  { id: "orb", label: "The Frequency" },
  { id: "wave", label: "Wave Field" },
  { id: "spectrum", label: "Spectrum" },
  { id: "tunnel", label: "Tunnel" },
  { id: "galaxy", label: "Galaxy" },
  { id: "warp", label: "Warp" },
  { id: "leaves", label: "Swarm" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Mixcloud?: any;
  }
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * 0.04;
    state.camera.position.y += (state.pointer.y * 0.4 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function VizScene({ mode, glyph }: { mode: Mode; glyph: Glyph }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      {mode === "orb" && (
        <>
          <FrequencyOrb detail={26} />
          <Particles count={1400} />
        </>
      )}
      {mode === "wave" && (
        <>
          <VizWave />
          <Particles count={900} />
        </>
      )}
      {mode === "spectrum" && (
        <>
          <VizSpectrum />
          <Particles count={700} />
        </>
      )}
      {mode === "tunnel" && (
        <>
          <VizTunnel />
          <Particles count={700} />
        </>
      )}
      {mode === "galaxy" && <VizGalaxy />}
      {mode === "warp" && <VizWarp count={2000} />}
      {mode === "leaves" && (
        <>
          <VizSwarm glyph={glyph} count={18} />
          <Particles count={500} />
        </>
      )}
      <CameraRig />
      <EffectComposer>
        <Bloom intensity={1.8} luminanceThreshold={0.12} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

function feed(key: string, autoplay = false) {
  return `https://www.mixcloud.com/widget/iframe/?light=0&hide_cover=1&mini=1${
    autoplay ? "&autoplay=1" : ""
  }&feed=${encodeURIComponent(key)}`;
}

export default function VisualizerRoom({ mixes }: { mixes: Mix[] }) {
  const [mode, setMode] = useState<Mode>("orb");
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [glyph, setGlyph] = useState<Glyph>("leaf");
  const [chrome, setChrome] = useState(true); // show UI (controls + title)
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prismRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearPrism() {
    if (prismRef.current) {
      clearInterval(prismRef.current);
      prismRef.current = null;
    }
  }
  function chooseColor(c: string) {
    clearPrism();
    setVizColor(c);
    setSel(c);
  }
  function chooseAuto() {
    clearPrism();
    setVizColor(null);
    setSel(null);
  }
  function choosePrism() {
    clearPrism();
    setSel("prism");
    let h = 0;
    prismRef.current = setInterval(() => {
      h = (h + 14) % 360;
      setVizColor(`hsl(${h}, 90%, 62%)`);
    }, 110);
  }
  useEffect(() => () => clearPrism(), []);

  const hasMixes = mixes.length > 0;
  const current = hasMixes ? mixes[idx] : null;

  // Only render the WebGL canvas on the client.
  useEffect(() => setMounted(true), []);

  // Bind the Mixcloud widget's play/pause to the visualizer energy. Re-runs on
  // every track change because the iframe remounts (keyed by mix), so we never
  // call widget.load — switching tracks just reloads the player. Bulletproof.
  useEffect(() => {
    if (!hasMixes || !mounted) return;
    let cancelled = false;

    function init() {
      if (cancelled || !iframeRef.current || !window.Mixcloud) return;
      try {
        const widget = window.Mixcloud.PlayerWidget(iframeRef.current);
        widget.ready.then(() => {
          if (cancelled) return;
          widget.events.play.on(() => setPlaying(true));
          widget.events.pause.on(() => setPlaying(false));
          widget.events.ended.on(() => setPlaying(false));
        });
      } catch {
        /* ignore — visuals still run on their own */
      }
    }

    if (window.Mixcloud) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = "https://widget.mixcloud.com/media/js/widgetApi.js";
      s.async = true;
      s.onload = init;
      document.body.appendChild(s);
    }
    return () => {
      cancelled = true;
      setPlaying(false);
    };
  }, [hasMixes, mounted, current?.key]);

  function pick(i: number) {
    setIdx(i); // iframe remounts with the new mix (keyed by key) and autoplays
  }

  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
      {mounted && (
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.8]}
          camera={{ position: [0, 0, 4.6], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <VizScene mode={mode} glyph={glyph} />
        </Canvas>
      )}

      {/* immerse toggle — hide all UI to just watch the visuals */}
      <button
        onClick={() => setChrome((c) => !c)}
        title={chrome ? "Hide controls" : "Show controls"}
        aria-label={chrome ? "Hide controls" : "Show controls"}
        className="absolute right-6 top-24 z-30 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl transition-opacity hover:opacity-100"
        style={{
          borderColor: "var(--accent-soft)",
          backgroundColor: "color-mix(in srgb, var(--bg) 55%, transparent)",
          color: "var(--fg)",
          opacity: chrome ? 0.65 : 0.35,
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
          {chrome ? (
            <>
              <path d="M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z" />
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </>
          ) : (
            <>
              <path d="M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>

      {/* title — now-playing marquee */}
      <div
        className={`pointer-events-none absolute left-0 right-0 top-24 z-10 transition-opacity duration-500 ${
          chrome ? "opacity-100" : "opacity-0"
        }`}
      >
        <p
          className="animate-blink px-6 text-center text-[11px] uppercase font-medium tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          The Visualizer · Now Playing
        </p>
        {current && (
          <div className="mt-5 opacity-40">
            <Marquee text={current.name} />
          </div>
        )}
      </div>

      {/* controls */}
      <div
        className={`absolute bottom-6 left-1/2 z-20 w-[min(94vw,860px)] -translate-x-1/2 transition-all duration-500 ${
          chrome ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"
        }`}
      >
        <div
          className="rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            borderColor: "var(--accent-soft)",
            backgroundColor: "color-mix(in srgb, var(--bg) 80%, transparent)",
          }}
        >
          {/* color picker + FX triggers */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={chooseAuto}
                title="Auto (phase color)"
                className="flex h-5 w-5 items-center justify-center rounded-full border text-[8px]"
                style={{
                  borderColor: sel === null ? "var(--fg)" : "var(--accent-soft)",
                  color: "var(--muted)",
                }}
              >
                A
              </button>
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => chooseColor(c)}
                  aria-label={`color ${c}`}
                  className="h-5 w-5 rounded-full"
                  style={{
                    background: c,
                    outline: sel === c ? "2px solid var(--fg)" : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
              <button
                onClick={choosePrism}
                title="Prism (cycle colors)"
                className="h-5 w-5 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #ff4d6d, #ffd166, #34d399, #22d3ee, #8b6cff, #ff5fd2, #ff4d6d)",
                  outline: sel === "prism" ? "2px solid var(--fg)" : "none",
                  outlineOffset: 2,
                }}
              />
            </div>
            <div className="flex items-center gap-3" style={{ color: "var(--fg)" }}>
              {FX.map(({ key, color, strength, Icon }) => (
                <button
                  key={key}
                  onClick={() => triggerFlash(color, strength)}
                  title={`${key} FX`}
                  className="opacity-60 transition-opacity hover:opacity-100"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* visualizer switcher */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
            {MODES.map((m) => {
              const on = m.id === mode;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="rounded-full border px-4 py-2 text-xs uppercase font-medium tracking-[0.2em] transition-all"
                  style={{
                    borderColor: on ? "var(--accent)" : "var(--accent-soft)",
                    backgroundColor: on ? "var(--accent)" : "transparent",
                    color: on ? "var(--bg)" : "var(--muted)",
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* glyph picker — only in Swarm mode */}
          {mode === "leaves" && (
            <div className="mb-3 flex items-center justify-center gap-3">
              {GLYPHS.map(({ id, Icon }) => {
                const on = id === glyph;
                return (
                  <button
                    key={id}
                    onClick={() => setGlyph(id)}
                    title={id}
                    className="rounded-full border p-2 transition-colors"
                    style={{
                      borderColor: on ? "var(--accent)" : "var(--accent-soft)",
                      color: on ? "var(--accent)" : "var(--muted)",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          )}

          {hasMixes ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => pick((idx - 1 + mixes.length) % mixes.length)}
                className="shrink-0 rounded-full border px-3 py-2 text-xs"
                style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
                aria-label="Previous mix"
              >
                ‹
              </button>
              <iframe
                ref={iframeRef}
                key={current!.key}
                title="Mixcloud player"
                src={feed(current!.key, idx !== 0)}
                width="100%"
                height="60"
                frameBorder="0"
                allow="autoplay"
                className="flex-1 rounded-lg"
              />
              <button
                onClick={() => pick((idx + 1) % mixes.length)}
                className="shrink-0 rounded-full border px-3 py-2 text-xs"
                style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
                aria-label="Next mix"
              >
                ›
              </button>
            </div>
          ) : (
            <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
              Loading mixes…
            </p>
          )}

          {/* quick mix list */}
          {hasMixes && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {mixes.slice(0, 24).map((m, i) => (
                <button
                  key={m.key}
                  onClick={() => pick(i)}
                  className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] transition-colors"
                  style={{
                    backgroundColor: i === idx ? "var(--accent-soft)" : "transparent",
                    color: i === idx ? "var(--fg)" : "var(--muted)",
                    border: "1px solid var(--accent-soft)",
                  }}
                >
                  {m.name.length > 26 ? m.name.slice(0, 26) + "…" : m.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
