"use client";

import { motion } from "framer-motion";

export default function FeaturedRelease() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-32">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* cover art placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square overflow-hidden rounded-2xl"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, var(--accent), var(--bg-soft), var(--accent))",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "var(--bg)" }}
          >
            Cover art — placeholder
          </div>
        </motion.div>

        <div>
          <p
            className="mb-3 text-xs uppercase tracking-widest2"
            style={{ color: "var(--accent)" }}
          >
            Latest Release · 2026
          </p>
          <h2 className="display text-4xl md:text-6xl">Blue Monday</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Rework, feat. Peter Hook · directed &amp; produced by Tom Laroc
          </p>
          <p className="mt-6 max-w-md text-lg">
            The night the rework finally landed — that bassline rebuilt from the
            ground up, generative visuals breathing with every hit.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
            {["Watch", "Spotify", "Apple", "Mixcloud"].map((l) => (
              <a
                key={l}
                href="#"
                className="rounded-full border px-5 py-3 transition-colors hover:opacity-70"
                style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
