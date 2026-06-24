import Link from "next/link";
import PageShell from "@/components/PageShell";
import { DISPATCHES } from "@/lib/dispatches";

export const metadata = {
  title: "Dispatches — Notes on Design, AI & Taste",
  description:
    "Writing from Tom Laroc on design-led AI, keeping generative work on-brand, and bringing AI into a business without losing the soul.",
  alternates: { canonical: "/dispatches" },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DispatchesPage() {
  return (
    <PageShell
      eyebrow="Dispatches"
      title="Notes from the practice."
      intro="On design-led AI, taste as a moat, and putting these tools to work without losing the soul of what you do."
    >
      <div className="mt-16 divide-y" style={{ borderColor: "var(--accent-soft)" }}>
        {DISPATCHES.map((d) => (
          <Link
            key={d.slug}
            href={`/dispatches/${d.slug}`}
            className="group block py-8"
            style={{ borderTop: "1px solid var(--accent-soft)" }}
          >
            <div
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]"
              style={{ color: "var(--muted)" }}
            >
              <span style={{ color: "var(--accent)" }}>{fmt(d.date)}</span>
              <span>·</span>
              <span>{d.readMins} min</span>
            </div>
            <h2 className="display mt-3 text-3xl transition-opacity group-hover:opacity-70 md:text-4xl">
              {d.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base" style={{ color: "var(--muted)" }}>
              {d.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
