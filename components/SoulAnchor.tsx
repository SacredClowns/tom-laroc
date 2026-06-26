"use client";

import { motion } from "framer-motion";

export default function SoulAnchor() {
  return (
    <section id="roots" className="mx-auto max-w-4xl px-6 py-32 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p
          className="mb-6 text-xs uppercase font-display font-medium tracking-widest2"
          style={{ color: "var(--accent)" }}
        >
          Roots
        </p>
        <p className="display text-3xl leading-snug md:text-5xl">
          A photograph of my father, the Bronx, the mid-1950s. Leather jacket,
          brick behind him, a smile that outran the century.
        </p>
        <p className="mx-auto mt-8 max-w-xl text-lg" style={{ color: "var(--muted)" }}>
          That&apos;s where the fidelity comes from. The phone&apos;s in a drawer.
          The archive is alive. Everything here is made by hand, on purpose, with
          full attention — and credit always goes to the source.
        </p>
        <p className="mt-10 display text-xl" style={{ color: "var(--accent)" }}>
          Read the room. Land the drop. Credit your sources.
        </p>
      </motion.div>
    </section>
  );
}
