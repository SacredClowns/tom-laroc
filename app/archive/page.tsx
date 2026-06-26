import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import MixcloudArchive from "@/components/MixcloudArchive";
import { getMixes } from "@/lib/mixcloud";

export const metadata: Metadata = {
  title: "The Archive — 40 Years of Mixes",
  description:
    "Forty years of Tom Laroc's mixes and live sets — hip-hop, breakbeats, and more. The originals were lost to a fire; what survived lives here, preserved and playable.",
  alternates: { canonical: "/archive" },
};

// Static with daily revalidation — new uploads sync in automatically.
export const revalidate = 86400;

export default async function ArchivePage() {
  const mixes = await getMixes();

  return (
    <main className="min-h-screen pt-36">
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="mb-4 text-xs uppercase font-display font-medium tracking-widest2" style={{ color: "var(--accent)" }}>
          The Archive
        </p>
        <h1 className="display text-5xl leading-[0.95] tracking-tightest md:text-8xl">
          Forty years, preserved.
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--muted)" }}>
          A 40-year discography of mixes and live sets — where the taste was
          trained. The original recordings were lost to a house fire. What
          survived lives here now, and isn&apos;t going anywhere. Press play.
        </p>

        <Link
          href="/visualizer"
          className="mt-8 inline-block rounded-full px-7 py-4 text-xs uppercase font-display font-medium tracking-[0.2em]"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          Play it in the Visualizer →
        </Link>

        <div className="mt-14">
          <MixcloudArchive mixes={mixes} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
