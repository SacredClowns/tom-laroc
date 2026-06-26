"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePhase, PHASES } from "@/lib/phase";

export default function ArcOfTheNight() {
  const { phase, setPhase } = usePhase();
  const current = PHASES.find((p) => p.id === phase)!;

  return (
    <section id="arc" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="mb-12 text-center">
        <p
          className="mb-3 text-xs uppercase font-display font-medium tracking-widest2"
          style={{ color: "var(--accent)" }}
        >
          The Arc of the Night
        </p>
        <h2 className="display text-3xl md:text-5xl">
          Choose where you step in.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm" style={{ color: "var(--muted)" }}>
          Every phase re-themes the whole room — light, color, and what&apos;s
          playing.
        </p>
      </div>

      {/* selector */}
      <div className="mb-14 flex flex-wrap items-center justify-center gap-3">
        {PHASES.map((p) => {
          const active = p.id === phase;
          return (
            <button
              key={p.id}
              onClick={() => setPhase(p.id)}
              className="rounded-full border px-6 py-3 text-xs uppercase font-display font-medium tracking-[0.18em] transition-all duration-500"
              style={{
                borderColor: active ? "var(--accent)" : "var(--accent-soft)",
                backgroundColor: active ? "var(--accent)" : "transparent",
                color: active ? "var(--bg)" : "var(--muted)",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* phase display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border p-10 md:p-16"
          style={{
            borderColor: "var(--accent-soft)",
            background:
              "radial-gradient(80% 120% at 50% 0%, var(--accent-soft), transparent 70%)",
          }}
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p
                className="display text-7xl md:text-9xl"
                style={{ color: "var(--accent)" }}
              >
                {current.time}
              </p>
              <p className="mt-4 text-xl md:text-2xl">{current.mood}</p>
            </div>
            <div className="md:text-right">
              <p
                className="text-[10px] uppercase font-display font-medium tracking-[0.18em]"
                style={{ color: "var(--muted)" }}
              >
                Now playing
              </p>
              <p className="mt-2 text-lg">{current.nowPlaying}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
