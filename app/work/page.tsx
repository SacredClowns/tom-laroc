import PageShell from "@/components/PageShell";
import WorkGrid from "@/components/WorkGrid";

export const metadata = {
  title: "Work — Generative Art, AI Animation & Design",
  description:
    "Selected work from Tom Laroc — film direction, generative art, AI animation, immersive/VR, and design systems. AI that never looks like AI.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <PageShell
      eyebrow="Work"
      title="The proof."
      intro="An artist's eye, applied across film, generative art, design, and immersive work. The throughline is taste — AI that never looks like AI."
    >
      <div className="mt-8 -mx-6">
        <WorkGrid />
      </div>
    </PageShell>
  );
}
