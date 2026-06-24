"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { usePhase } from "@/lib/phase";

// WebGL is client-only — never SSR the Three.js canvas.
const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
});

export default function Hero() {
  const { phase } = usePhase();

  return (
    <section className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden">
      {/* phase glow behind the WebGL */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, var(--glow), transparent 70%)",
        }}
      />

      {/* The Frequency — Three.js generative form */}
      <Scene />

      {/* readable DOM type sits above the canvas */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6 text-xs uppercase tracking-widest2"
          style={{ color: "var(--accent)" }}
        >
          Artist · Designer · The bridge to AI
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45 }}
          className="display text-6xl leading-[0.9] tracking-tightest mix-blend-screen md:text-[10rem]"
        >
          TOM LAROC
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="mt-7 max-w-xl text-base md:text-lg"
          style={{ color: "var(--muted)" }}
        >
          An artist&apos;s eye on AI — the bridge between contemporary graphic
          design and what comes next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="pointer-events-auto mt-10 flex items-center gap-5 text-xs uppercase tracking-[0.25em]"
        >
          <a href="#work" style={{ color: "var(--fg)" }} className="hover:opacity-70">
            See the work
          </a>
          <span style={{ color: "var(--muted)" }}>·</span>
          <a href="/bookings" style={{ color: "var(--fg)" }} className="hover:opacity-70">
            Work with Tom
          </a>
          <span style={{ color: "var(--muted)" }}>·</span>
          <a href="/artist" style={{ color: "var(--fg)" }} className="hover:opacity-70">
            About
          </a>
        </motion.div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em]"
        style={{ color: "var(--muted)" }}
      >
        {phase === "warmup" ? "Scroll into the night" : "—"}
      </div>
    </section>
  );
}
