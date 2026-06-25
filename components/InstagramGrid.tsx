"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import type { InstaPost } from "@/lib/instagram";
import { IG_HANDLE, IG_URL } from "@/lib/instagram";

function Glyph({ kind }: { kind?: InstaPost["kind"] }) {
  if (kind === "video")
    return <span className="text-sm">▶</span>;
  if (kind === "carousel")
    return <span className="text-sm">▤</span>;
  return null;
}

export default function InstagramGrid({ posts }: { posts: InstaPost[] }) {
  return (
    <section id="instagram" className="mx-auto max-w-6xl px-6 py-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs uppercase font-medium tracking-widest2" style={{ color: "var(--accent)" }}>
            On Instagram
          </p>
          <h2 className="display text-3xl md:text-5xl">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="hover:opacity-70">
              @{IG_HANDLE}
            </a>
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            The daily work — generative art, music visuals, #AIArtToday.
          </p>
        </div>
        <a
          href={IG_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full px-6 py-3 text-xs uppercase font-medium tracking-[0.2em]"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          Follow
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {posts.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.permalink}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
            className="group relative aspect-square overflow-hidden rounded-xl"
            style={{ background: p.gradient || "var(--bg-soft)" }}
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* media-type glyph */}
            <span className="absolute right-2 top-2" style={{ color: "var(--fg)" }}>
              <Glyph kind={p.kind} />
            </span>

            {/* hover overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent 70%)" }}
            >
              {(p.likes || p.comments) && (
                <div className="mb-1 flex gap-4 text-xs" style={{ color: "var(--fg)" }}>
                  {p.likes ? <span>♥ {p.likes.toLocaleString()}</span> : null}
                  {p.comments ? <span>💬 {p.comments}</span> : null}
                </div>
              )}
              <p className="line-clamp-2 text-[11px]" style={{ color: "var(--fg)" }}>
                {p.caption}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
