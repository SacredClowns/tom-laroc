"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CONTACT_EMAIL } from "@/lib/contact";

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

type Props = {
  name: string;
  company?: string;
  challenge?: string;
  focus?: string[];
};

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay },
});

export default function ForYou({ name, company, challenge, focus }: Props) {
  const first = (name || "there").split(" ")[0];
  const subject = company ? `for ${company}` : "made for you";
  const focusLine = focus?.length ? focus.slice(0, 2).join(" + ").toLowerCase() : null;

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Re: ${company || name} + Tom`
  )}&body=${encodeURIComponent(`Hi Tom,\n\n`)}`;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* generative backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <Scene />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 40%, transparent, var(--bg) 80%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-28">
        <motion.p
          {...fade(0.1)}
          className="text-xs uppercase font-medium tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          A note from Tom Laroc · {subject}
        </motion.p>

        <motion.h1
          {...fade(0.25)}
          className="display mt-6 text-5xl leading-[0.95] tracking-tightest md:text-8xl"
        >
          Hello, {first}.
        </motion.h1>

        <motion.p {...fade(0.45)} className="mt-8 max-w-2xl text-lg md:text-2xl">
          This page exists for one person. You. Built after you reached out — not
          a template, not a funnel.
        </motion.p>

        {challenge && (
          <motion.div {...fade(0.6)} className="mt-10 max-w-2xl">
            <p className="text-xs uppercase font-medium tracking-[0.18em]" style={{ color: "var(--accent)" }}>
              You said
            </p>
            <p className="display mt-3 text-2xl leading-snug md:text-4xl">
              &ldquo;{challenge}&rdquo;
            </p>
          </motion.div>
        )}

        <motion.p {...fade(0.75)} className="mt-10 max-w-2xl text-lg" style={{ color: "var(--muted)" }}>
          {focusLine
            ? `Here's the short version: ${focusLine} is exactly where I work — turning AI from noise into a system that actually moves the needle. `
            : "Here's the short version: I turn AI from noise into a system that actually moves the needle. "}
          Forty years of taste and craft, pointed at your problem. Let&apos;s talk
          about how that looks for you.
        </motion.p>

        <motion.div {...fade(0.9)} className="mt-12 flex flex-wrap gap-4">
          <a
            href={mailto}
            className="rounded-full px-8 py-4 text-xs uppercase font-medium tracking-[0.2em]"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            Reply to Tom
          </a>
          <a
            href="/bookings#engagements"
            className="rounded-full border px-8 py-4 text-xs uppercase font-medium tracking-[0.2em]"
            style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
          >
            See how we&apos;d work
          </a>
        </motion.div>

        <motion.p {...fade(1.05)} className="mt-16 text-sm" style={{ color: "var(--muted)" }}>
          — Tom · Hi-Fi-Ai
        </motion.p>
      </div>
    </main>
  );
}
