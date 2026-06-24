import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ScreeningRoom from "@/components/ScreeningRoom";
import { getVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "The Screening Room — Films & Generative Video",
  description:
    "Tom Laroc's video work — AI animation, generative film, and music visuals from the HI-FI-AI Sound channel. Press play.",
  alternates: { canonical: "/screening-room" },
};

// Static with hourly revalidation — new uploads appear automatically.
export const revalidate = 3600;

export default async function ScreeningRoomPage() {
  const videos = await getVideos();

  return (
    <main className="min-h-screen pt-36">
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="mb-4 text-xs uppercase tracking-widest2" style={{ color: "var(--accent)" }}>
          The Screening Room
        </p>
        <h1 className="display text-5xl leading-[0.95] tracking-tightest md:text-8xl">
          In motion.
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--muted)" }}>
          Films, AI animation, and generative video — straight from the HI-FI-AI
          Sound channel. The pipeline, in motion.
        </p>

        <div className="mt-14">
          <ScreeningRoom videos={videos} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
