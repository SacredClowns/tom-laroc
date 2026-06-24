import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Artist & Designer · Bronx to Miami",
  description:
    "Tom Laroc — artist and designer, the bridge between contemporary graphic design and AI. Born in the Bronx, based in South Beach, Miami for 20+ years.",
  alternates: { canonical: "/artist" },
};

export default function ArtistPage() {
  return (
    <PageShell
      eyebrow="The Artist"
      title="Artist first."
      intro="Tom Laroc is an artist and designer before anything else — a keen eye and serious taste, honed over decades. Born in the Bronx, based in South Beach, Miami for over twenty years. AI is just the newest material in his hands. He is the bridge between contemporary graphic design and what AI can do."
    >
      <div className="mt-16 space-y-6 text-lg" style={{ color: "var(--fg)" }}>
        <p>
          The eye came first — composition, type, color, the discipline of
          design. Then three decades across music and culture (Bronx roots,
          Sleeping Bag Records, the Erick Sermon era, a friendship with Jam
          Master Jay) that taught him how to read a room and hold a feeling.
        </p>
        <p>
          We&apos;ve been working at the edge of design and AI for years —
          generative art, AI animation, immersive work — and taught thousands of
          people how to use these tools without losing taste. That&apos;s the
          whole point: AI that never looks like AI.
        </p>
        <p>
          A deliberate, high-fidelity life: the smartphone retired, the archive
          kept alive, every detail intentional. Analog soul meets generative
          precision. That&apos;s Hi-Fi-Ai.
        </p>
      </div>
    </PageShell>
  );
}
