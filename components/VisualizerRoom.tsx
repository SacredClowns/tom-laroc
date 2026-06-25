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
import Marquee from "@/components/Marquee";

type Mode = "orb" | "wave" | "spectrum" | "tunnel" | "galaxy" | "warp";
const MODES: { id: Mode; label: string }[] = [
  { id: "orb", label: "The Frequency" },
  { id: "wave", label: "Wave Field" },
  { id: "spectrum", label: "Spectrum" },
  { id: "tunnel", label: "Tunnel" },
  { id: "galaxy", label: "Galaxy" },
  { id: "warp", label: "Warp" },
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

function VizScene({ mode }: { mode: Mode }) {
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
      <CameraRig />
      <EffectComposer>
        <Bloom intensity={1.8} luminanceThreshold={0.12} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

function feed(key: string) {
  return `https://www.mixcloud.com/widget/iframe/?light=0&hide_cover=1&mini=1&feed=${encodeURIComponent(
    key
  )}`;
}

export default function VisualizerRoom({ mixes }: { mixes: Mix[] }) {
  const [mode, setMode] = useState<Mode>("orb");
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<any>(null);

  const hasMixes = mixes.length > 0;
  const current = hasMixes ? mixes[idx] : null;

  // Only render the WebGL canvas on the client.
  useEffect(() => setMounted(true), []);

  // Load the Mixcloud Widget API and bind play/pause to the visualizer energy.
  useEffect(() => {
    if (!hasMixes) return;
    let cancelled = false;

    function init() {
      if (cancelled || !iframeRef.current || !window.Mixcloud) return;
      const widget = window.Mixcloud.PlayerWidget(iframeRef.current);
      widgetRef.current = widget;
      widget.ready.then(() => {
        if (cancelled) return;
        widget.events.play.on(() => setPlaying(true));
        widget.events.pause.on(() => setPlaying(false));
        widget.events.ended.on(() => setPlaying(false));
      });
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
  }, [hasMixes]);

  function pick(i: number) {
    setIdx(i);
    const w = widgetRef.current;
    if (w && current) {
      w.load(mixes[i].key, true).catch(() => {});
    }
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
          <VizScene mode={mode} />
        </Canvas>
      )}

      {/* title — now-playing marquee */}
      <div className="pointer-events-none absolute left-0 right-0 top-24 z-10">
        <p
          className="px-6 text-center text-[11px] uppercase tracking-[0.4em]"
          style={{ color: "var(--accent)" }}
        >
          The Visualizer · Now Playing
        </p>
        {current && (
          <div className="mt-5 opacity-90">
            <Marquee text={current.name} />
          </div>
        )}
      </div>

      {/* controls */}
      <div className="absolute bottom-6 left-1/2 z-20 w-[min(94vw,860px)] -translate-x-1/2">
        <div
          className="rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            borderColor: "var(--accent-soft)",
            backgroundColor: "color-mix(in srgb, var(--bg) 80%, transparent)",
          }}
        >
          {/* visualizer switcher */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
            {MODES.map((m) => {
              const on = m.id === mode;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all"
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
                title={current!.name}
                src={feed(current!.key)}
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
