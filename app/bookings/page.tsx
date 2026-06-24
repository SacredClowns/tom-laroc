import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ConsultForm from "@/components/ConsultForm";
import { PACKAGES, CUSTOM } from "@/lib/packages";

export const metadata: Metadata = {
  title: "AI Strategy & Creative Direction in Miami",
  description:
    "Work with Tom Laroc — design-led AI strategy, creative direction, and training for brands, artists, and professionals. Based in South Beach, Miami; working worldwide. Tell him about your business.",
  alternates: { canonical: "/bookings" },
};

const SERVICES = [
  {
    n: "01",
    title: "AI Strategy & Roadmap",
    body: "Where AI actually fits your business — prioritized, realistic, and tied to outcomes. No hype, no shiny-object detours.",
  },
  {
    n: "02",
    title: "Generative Content Systems",
    body: "Repeatable pipelines for image, video, and copy at brand quality — so you ship more without losing taste or consistency.",
  },
  {
    n: "03",
    title: "Brand & Aesthetic Direction",
    body: "Taste as a service. Keep AI output unmistakably on-brand instead of generic. Forty years of a trained eye, applied.",
  },
  {
    n: "04",
    title: "Workflow & Automation",
    body: "Design the human-in-the-loop. Cut the busywork, keep the judgment where it matters, and make the whole thing run.",
  },
  {
    n: "05",
    title: "Training & Workshops",
    body: "Bring your team — or your studio, or your family — genuinely up to speed. Practical, hands-on, jargon-free.",
  },
  {
    n: "06",
    title: "Creative Production",
    body: "AI animation, music-video direction, immersive and generative work — concept to finished piece, done with you or for you.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Tell him about your business",
    body: "A few honest details below — where you are, where you're stuck, what winning looks like.",
  },
  {
    n: "02",
    title: "He analyzes it personally",
    body: "Tom replies with a specific, no-template read on where AI can move the needle for you. Real correspondence, not a funnel.",
  },
  {
    n: "03",
    title: "You decide how to work together",
    body: "Advisory, a defined project, or done-with-you. Whatever actually fits — no pressure, no retainer trap.",
  },
];

export default function WorkWithTomPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-40 pb-24">
        <p
          className="mb-6 text-xs uppercase tracking-widest2"
          style={{ color: "var(--accent)" }}
        >
          Design-led AI · Creative Direction · Teaching
        </p>
        <h1 className="display max-w-4xl text-5xl leading-[0.98] tracking-tightest md:text-8xl">
          Put AI to work — without losing the soul of what you do.
        </h1>
        <p className="mt-8 max-w-2xl text-lg md:text-xl" style={{ color: "var(--muted)" }}>
          Tom Laroc is an artist and designer first — a keen eye and serious
          taste, and the bridge between contemporary graphic design and AI. For
          years he&apos;s helped brands, artists, and professionals — and taught
          thousands — put AI to work without it ever looking like AI.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#start"
            className="rounded-full px-8 py-4 text-xs uppercase tracking-[0.2em]"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            Tell Tom about your business
          </a>
          <a
            href="#services"
            className="rounded-full border px-8 py-4 text-xs uppercase tracking-[0.2em]"
            style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
          >
            What he does
          </a>
        </div>
      </section>

      {/* Credibility strip */}
      <section
        className="border-y"
        style={{ borderColor: "var(--accent-soft)" }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
          {[
            ["40-yr legacy", "DJ → designer → AI"],
            ["Daily show", "co-hosts #AIArtToday"],
            ["Taught 1000s", "hands-on, jargon-free"],
            ["Miami-based", "local reach + worldwide remote"],
          ].map(([big, small]) => (
            <div key={big} className="px-6 py-8">
              <p className="display text-2xl md:text-3xl">{big}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                {small}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="display text-3xl md:text-5xl">What Tom does.</h2>
        <p className="mt-4 max-w-2xl text-sm" style={{ color: "var(--muted)" }}>
          A Renaissance practice that bridges high-level generative AI and
          commercial multimedia production — strategy, taste, and execution under
          one roof. He consults for agencies (including Boyne &amp; Co.) and
          co-hosts the daily <span style={{ color: "var(--fg)" }}>#AIArtToday</span>{" "}
          show. Engagements are shaped around what you actually need.
        </p>
        <div className="mt-14 grid gap-px md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.n}
              className="border p-8"
              style={{ borderColor: "var(--accent-soft)" }}
            >
              <p
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--accent)" }}
              >
                {s.n}
              </p>
              <h3 className="display mt-3 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="engagements" className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="display text-3xl md:text-5xl">Engagements.</h2>
        <p className="mt-4 max-w-xl text-sm" style={{ color: "var(--muted)" }}>
          Clear ways to start. Every engagement begins with the same question:
          where can AI actually move the needle for you?
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.slug}
              className="flex flex-col rounded-3xl border p-8"
              style={{
                borderColor: p.featured ? "var(--accent)" : "var(--accent-soft)",
                background: p.featured ? "var(--accent-soft)" : "transparent",
              }}
            >
              {p.featured && (
                <p
                  className="mb-4 text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "var(--accent)" }}
                >
                  Most popular
                </p>
              )}
              <h3 className="display text-2xl">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="display text-4xl" style={{ color: "var(--accent)" }}>
                  {p.price}
                </span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {p.cadence}
                </span>
              </div>
              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                {p.tagline}
              </p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {p.includes.map((inc) => (
                  <li key={inc} className="flex gap-2">
                    <span style={{ color: "var(--accent)" }}>—</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#start"
                className="mt-8 rounded-full px-6 py-3 text-center text-xs uppercase tracking-[0.2em]"
                style={
                  p.featured
                    ? { backgroundColor: "var(--accent)", color: "var(--bg)" }
                    : { border: "1px solid var(--accent-soft)", color: "var(--fg)" }
                }
              >
                Start with this
              </a>
            </div>
          ))}
        </div>

        <div
          className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border p-8 sm:flex-row sm:items-center"
          style={{ borderColor: "var(--accent-soft)" }}
        >
          <div>
            <h3 className="display text-2xl">{CUSTOM.name}</h3>
            <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--muted)" }}>
              {CUSTOM.tagline}
            </p>
          </div>
          <a
            href="#start"
            className="shrink-0 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.2em]"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          >
            Let&apos;s talk
          </a>
        </div>

        <p className="mt-6 text-xs" style={{ color: "var(--muted)" }}>
          Prefer to pay online? Card checkout & deposits coming next.
        </p>
      </section>

      {/* Proof of depth */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="display text-2xl leading-snug md:text-4xl">
          &ldquo;DJing was always real-time prompt engineering — temperature,
          constraints, intent, reading the room. Zero tolerance for
          hallucinations. I&apos;ve run that loop for forty years. The tools
          finally caught up.&rdquo;
        </p>
        <p
          className="mt-6 text-xs uppercase tracking-[0.25em]"
          style={{ color: "var(--accent)" }}
        >
          Tom Laroc
        </p>
      </section>

      {/* How it works */}
      <section
        className="border-y py-24"
        style={{ borderColor: "var(--accent-soft)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="display text-3xl md:text-5xl">How it works.</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p
                  className="display text-5xl"
                  style={{ color: "var(--accent)" }}
                >
                  {s.n}
                </p>
                <h3 className="display mt-4 text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The intake form */}
      <section id="start" className="mx-auto max-w-3xl px-6 py-28">
        <p
          className="mb-3 text-xs uppercase tracking-widest2"
          style={{ color: "var(--accent)" }}
        >
          Start here
        </p>
        <h2 className="display text-4xl md:text-6xl">
          Tell Tom about your business.
        </h2>
        <p className="mt-5 max-w-xl text-base" style={{ color: "var(--muted)" }}>
          The more honest the detail, the sharper his read. He&apos;ll come back
          to you personally with where AI can actually move the needle.
        </p>

        <div className="mt-12">
          <ConsultForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
