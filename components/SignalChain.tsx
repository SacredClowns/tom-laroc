"use client";

import { motion } from "framer-motion";

const MAP = [
  { booth: "How far you'll stray from the expected", prompt: "Temperature" },
  { booth: "Key, BPM, the room you're actually in", prompt: "Constraints" },
  { booth: "Where the night has to arrive", prompt: "Intent" },
  { booth: "Dropping a record, watching the floor", prompt: "A/B test" },
  { booth: "Keeping what lands, cutting what dies", prompt: "Reinforcement learning" },
  { booth: "The wrong record at 1am", prompt: "A hallucination" },
  { booth: "Knowing the difference instantly", prompt: "Taste" },
];

export default function SignalChain() {
  return (
    <section id="signal" className="mx-auto max-w-5xl px-6 py-32">
      <p
        className="mb-3 text-xs uppercase font-display font-medium tracking-widest2"
        style={{ color: "var(--accent)" }}
      >
        The Signal Chain
      </p>
      <h2 className="display max-w-3xl text-3xl leading-tight md:text-5xl">
        I&apos;ve been prompt engineering for forty years. The machine just
        showed up late.
      </h2>

      <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--muted)" }}>
        A DJ set and a good prompt run on the same machine. You set the
        temperature, hold the constraints, hold the intent — then read the room
        and adjust. Every record is a test. The floor is the reward signal. Zero
        tolerance for hallucinations.
      </p>

      {/* parameter map */}
      <div className="mt-16 divide-y" style={{ borderColor: "var(--accent-soft)" }}>
        {MAP.map((row, i) => (
          <motion.div
            key={row.prompt}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="grid grid-cols-1 items-baseline gap-2 py-5 md:grid-cols-2 md:gap-8"
            style={{ borderTop: "1px solid var(--accent-soft)" }}
          >
            <p className="text-base md:text-lg" style={{ color: "var(--muted)" }}>
              {row.booth}
            </p>
            <p className="display text-xl md:text-2xl">{row.prompt}</p>
          </motion.div>
        ))}
      </div>

      <p
        className="mt-12 display text-2xl md:text-3xl"
        style={{ color: "var(--accent)" }}
      >
        Forty years of training data. One human in the loop.
      </p>
    </section>
  );
}
