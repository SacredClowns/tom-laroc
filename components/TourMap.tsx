"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TOUR } from "@/lib/data";

export default function TourMap() {
  const homeIdx = TOUR.findIndex((s) => s.home);
  const [active, setActive] = useState<number | null>(homeIdx >= 0 ? homeIdx : null);

  return (
    <section id="live" className="mx-auto max-w-6xl px-6 py-32">
      <p
        className="mb-3 text-xs uppercase font-display font-medium tracking-widest2"
        style={{ color: "var(--accent)" }}
      >
        Footprint
      </p>
      <h2 className="display text-3xl md:text-5xl">Where the work has traveled.</h2>
      <p className="mt-4 max-w-xl text-sm" style={{ color: "var(--muted)" }}>
        Based in <span style={{ color: "var(--fg)" }}>South Beach, Miami</span> for
        20+ years — open to local Miami work and remote engagements worldwide.
      </p>

      {/* abstract world field */}
      <div
        className="relative mt-12 aspect-[2/1] w-full overflow-hidden rounded-2xl border"
        style={{
          borderColor: "var(--accent-soft)",
          background:
            "radial-gradient(120% 120% at 50% 120%, var(--accent-soft), var(--bg-soft) 60%)",
        }}
      >
        {TOUR.map((stop, i) => (
          <button
            key={stop.city}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
            aria-label={`${stop.city}, ${stop.date}`}
          >
            <span
              className="block rounded-full"
              style={{
                height: stop.home ? "1.15rem" : "0.75rem",
                width: stop.home ? "1.15rem" : "0.75rem",
                backgroundColor:
                  stop.home || stop.upcoming ? "var(--accent)" : "var(--fg)",
                boxShadow: stop.home
                  ? "0 0 0 10px var(--accent-soft)"
                  : stop.upcoming
                  ? "0 0 0 6px var(--accent-soft)"
                  : "none",
                animation:
                  stop.home || stop.upcoming
                    ? "breathe 3s ease-in-out infinite"
                    : "none",
              }}
            />
          </button>
        ))}

        {active !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-5 left-5 max-w-xs rounded-xl border p-4 backdrop-blur-md"
            style={{
              borderColor: "var(--accent-soft)",
              backgroundColor: "color-mix(in srgb, var(--bg) 75%, transparent)",
            }}
          >
            <p
              className="text-[10px] uppercase font-display font-medium tracking-[0.18em]"
              style={{ color: "var(--accent)" }}
            >
              {TOUR[active].home
                ? "Home base"
                : TOUR[active].upcoming
                ? "Upcoming"
                : "Established"}{" "}
              · {TOUR[active].date}
            </p>
            <p className="mt-1 display text-2xl">{TOUR[active].city}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {TOUR[active].venue}
            </p>
            <p className="mt-2 text-sm">{TOUR[active].memory}</p>
          </motion.div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        {TOUR.filter((s) => s.upcoming).map((s) => (
          <div
            key={s.city}
            className="flex items-center justify-between border-b py-4"
            style={{ borderColor: "var(--accent-soft)" }}
          >
            <div>
              <p className="display text-xl">{s.city}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {s.venue}
              </p>
            </div>
            <a
              href="/bookings"
              className="rounded-full border px-5 py-2 text-xs uppercase font-display font-medium tracking-[0.2em]"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              Enquire
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
