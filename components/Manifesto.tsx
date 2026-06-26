"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

// Positive voice — "say it in the positive" — and his actual identity:
// analog soul + generative precision, made by hand, sources credited.
const STATEMENT =
  "Tom Laroc tunes the signal by hand. Analog soul, generative precision, full attention — every source credited.";
const PUNCH = "A frequency you can step inside, and carry home.";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  const words = STATEMENT.split(" ");
  const total = words.length;

  const punchOpacity = useTransform(scrollYProgress, [0.78, 0.98], [0.12, 1]);
  const punchY = useTransform(scrollYProgress, [0.78, 0.98], [14, 0]);
  const auroraY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-5xl px-6 py-40 md:py-60"
    >
      {/* drifting aurora of the phase color — depth behind the type */}
      <motion.div
        style={{ y: auroraY }}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-40 animate-drift mix-blend-screen"
          style={{
            background:
              "radial-gradient(38% 38% at 35% 35%, var(--glow), transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 opacity-25 mix-blend-screen"
          style={{
            background:
              "radial-gradient(34% 34% at 70% 65%, var(--accent), transparent 70%)",
          }}
        />
      </motion.div>

      <p
        className="mb-12 text-[11px] uppercase font-display font-medium tracking-[0.45em]"
        style={{ color: "var(--accent)" }}
      >
        01 — The Signal
      </p>

      <p className="display text-[2rem] font-light leading-[1.18] tracking-tightest md:text-[4.25rem] md:leading-[1.08]">
        {words.map((w, i) => {
          const start = (i / total) * 0.8;
          const end = start + (1 / total) * 0.8 + 0.08;
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {w}
            </Word>
          );
        })}
      </p>

      <motion.p
        style={{ opacity: punchOpacity, y: punchY, color: "var(--accent)" }}
        className="display mt-10 text-[2rem] font-light italic leading-[1.1] tracking-tightest md:text-[4.25rem]"
      >
        {PUNCH}
      </motion.p>
    </section>
  );
}
