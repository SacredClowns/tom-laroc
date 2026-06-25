"use client";

import { useState } from "react";

export default function InnerCircle() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="inner-circle" className="mx-auto max-w-3xl px-6 py-32 text-center">
      <p
        className="mb-3 text-xs uppercase font-medium tracking-widest2"
        style={{ color: "var(--accent)" }}
      >
        Inner Circle
      </p>
      <h2 className="display text-3xl md:text-5xl">Dispatches from the booth.</h2>
      <p className="mx-auto mt-4 max-w-md text-sm" style={{ color: "var(--muted)" }}>
        Early tickets, unreleased edits, location reveals, notes from the road.
        Not a signup — an invitation in.
      </p>

      {done ? (
        <p className="mt-10 display text-2xl" style={{ color: "var(--accent)" }}>
          You&apos;re in. See you past sunrise.
        </p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
            } catch {
              /* still confirm — capture is best-effort */
            }
            setDone(true);
          }}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@somewhere.com"
            className="flex-1 rounded-full border bg-transparent px-6 py-4 text-sm outline-none"
            style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
          />
          <button
            type="submit"
            className="rounded-full px-7 py-4 text-xs uppercase font-medium tracking-[0.2em]"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            Let me in
          </button>
        </form>
      )}
    </section>
  );
}
