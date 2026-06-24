"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WORK } from "@/lib/work";

export default function WorkGrid() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-6 py-32">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p
            className="mb-3 text-xs uppercase tracking-widest2"
            style={{ color: "var(--accent)" }}
          >
            Selected Work
          </p>
          <h2 className="display max-w-3xl text-4xl leading-[1.02] md:text-6xl">
            AI that never looks like AI.
          </h2>
        </div>
        <a
          href="/work"
          className="hidden text-xs uppercase tracking-[0.2em] hover:opacity-70 md:block"
          style={{ color: "var(--muted)" }}
        >
          All work →
        </a>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {WORK.map((w, i) => (
          <motion.article
            key={w.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border p-6"
            style={{ borderColor: "var(--accent-soft)" }}
          >
            {/* visual placeholder */}
            <div
              className="mb-5 aspect-[4/3] rounded-lg transition-transform duration-700 group-hover:scale-[1.02]"
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
                {w.category}
              </span>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                {w.year}
              </span>
            </div>
            <h3 className="display mt-2 text-2xl">
              {w.href ? (
                <Link href={w.href} className="hover:opacity-70">
                  {w.title}
                </Link>
              ) : (
                w.title
              )}
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {w.blurb}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
