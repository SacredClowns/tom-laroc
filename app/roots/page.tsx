import PageShell from "@/components/PageShell";

export const metadata = { title: "Roots — Tom Laroc" };

export default function RootsPage() {
  return (
    <PageShell
      eyebrow="Roots"
      title="Why I play."
      intro="A photograph of my father in the Bronx, mid-1950s. The block. The first crate. The reason the fidelity matters."
    >
      <p className="mt-12 display text-2xl" style={{ color: "var(--accent)" }}>
        Read the room. Land the drop. Credit your sources.
      </p>
    </PageShell>
  );
}
