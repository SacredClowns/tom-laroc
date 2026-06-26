import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { getDispatch, allDispatchSlugs, DISPATCHES } from "@/lib/dispatches";
import { SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return allDispatchSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDispatch(slug);
  if (!d) return {};
  return {
    title: d.title,
    description: d.excerpt,
    alternates: { canonical: `/dispatches/${d.slug}` },
    openGraph: {
      type: "article",
      title: d.title,
      description: d.excerpt,
      publishedTime: d.date,
      url: `${SITE_URL}/dispatches/${d.slug}`,
    },
  };
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DispatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDispatch(slug);
  if (!d) notFound();

  const more = DISPATCHES.filter((x) => x.slug !== d.slug).slice(0, 2);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: d.title,
    description: d.excerpt,
    datePublished: d.date,
    dateModified: d.date,
    author: { "@type": "Person", name: "Tom Laroc", url: SITE_URL },
    publisher: { "@type": "Person", name: "Tom Laroc" },
    mainEntityOfPage: `${SITE_URL}/dispatches/${d.slug}`,
    keywords: d.tags.join(", "),
    image: `${SITE_URL}/opengraph-image`,
  };

  return (
    <main className="min-h-screen pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <article className="mx-auto max-w-3xl px-6 pb-24">
        <Link
          href="/dispatches"
          className="text-xs uppercase font-display font-medium tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          ← Dispatches
        </Link>

        <div
          className="mt-8 flex items-center gap-3 text-[11px] uppercase font-display font-medium tracking-[0.2em]"
          style={{ color: "var(--muted)" }}
        >
          <span>{fmt(d.date)}</span>
          <span>·</span>
          <span>{d.readMins} min read</span>
        </div>

        <h1 className="display mt-4 text-4xl leading-[1.05] tracking-tightest md:text-6xl">
          {d.title}
        </h1>

        <div className="mt-10 space-y-6">
          {d.body.map((b, i) => {
            if (b.type === "h2")
              return (
                <h2 key={i} className="display pt-4 text-2xl md:text-3xl">
                  {b.text}
                </h2>
              );
            if (b.type === "quote")
              return (
                <blockquote
                  key={i}
                  className="display border-l-2 pl-6 text-2xl leading-snug md:text-3xl"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                >
                  {b.text}
                </blockquote>
              );
            return (
              <p key={i} className="text-lg leading-relaxed" style={{ color: "var(--fg)" }}>
                {b.text}
              </p>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="mt-16 flex flex-col items-start gap-4 rounded-3xl border p-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--accent-soft)" }}
        >
          <p className="display text-2xl">Want this for your business?</p>
          <Link
            href="/bookings"
            className="shrink-0 rounded-full px-7 py-4 text-xs uppercase font-display font-medium tracking-[0.2em]"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            Work with Tom
          </Link>
        </div>

        {/* more */}
        {more.length > 0 && (
          <div className="mt-16">
            <p className="text-xs uppercase font-display font-medium tracking-[0.18em]" style={{ color: "var(--muted)" }}>
              Keep reading
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {more.map((m) => (
                <Link
                  key={m.slug}
                  href={`/dispatches/${m.slug}`}
                  className="rounded-2xl border p-6 transition-opacity hover:opacity-80"
                  style={{ borderColor: "var(--accent-soft)" }}
                >
                  <h3 className="display text-xl">{m.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    {m.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}
