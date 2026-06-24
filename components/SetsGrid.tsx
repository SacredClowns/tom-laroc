"use client";

import { motion } from "framer-motion";
import { SETS } from "@/lib/data";

export default function SetsGrid() {
  return (
    <section id="sets" className="mx-auto max-w-7xl px-6 py-32">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p
            className="mb-3 text-xs uppercase tracking-widest2"
            style={{ color: "var(--accent)" }}
          >
            Sets &amp; Mixes
          </p>
          <h2 className="display text-3xl md:text-5xl">From the archive.</h2>
        </div>
        <a
          href="/sets"
          className="hidden text-xs uppercase tracking-[0.2em] hover:opacity-70 md:block"
          style={{ color: "var(--muted)" }}
        >
          All sets →
        </a>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SETS.map((set, i) => (
          <motion.article
            key={set.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border p-6"
            style={{ borderColor: "var(--accent-soft)" }}
          >
            {/* still placeholder */}
            <div
              className="mb-5 aspect-video rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-soft), var(--bg-soft))",
              }}
            />
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{ color: "var(--accent)" }}
              >
                {set.phase}
              </span>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                {set.duration}
              </span>
            </div>
            <h3 className="display mt-2 text-2xl">{set.title}</h3>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              {set.venue} · {set.city}
            </p>
            <p className="mt-4 text-sm">{set.story}</p>

            <button
              className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--fg)" }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
              >
                ▶
              </span>
              Play
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
